<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchName" placeholder="名称" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="getMenuList()">搜索</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      </el-form-item>

      <el-form-item>
        <!-- 气泡确认框 -->
        <el-popconfirm @confirm="del(null)" title="确定删除吗？" >
          <el-button :disabled="this.multipleSelection.length === 0 " type="danger" slot="reference">批量删除</el-button>
        </el-popconfirm>
      </el-form-item>

    </el-form>

    <el-table
        ref="multipleTable"
        :data="tableData"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          label="名称"
          prop="roleName"
          width="120">
      </el-table-column>
      <el-table-column
          prop="code"
          label="唯一编码"
          width="120">
      </el-table-column>
      <el-table-column
          prop="content"
          label="描述"
          show-overflow-tooltip>
      </el-table-column>

      <el-table-column
          prop="status"
          label="状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.status === 0" type="success">正常</el-tag>
          <el-tag size="small" v-else-if="scope.row.status===1" type="danger">禁止</el-tag>

        </template>
      </el-table-column>

      <el-table-column
          prop="action"
          label="操作">
        <template slot-scope="scope">

          <el-button type="text" @click="edit(scope.row.id)">分配菜单权限</el-button>
          <el-divider direction="vertical"></el-divider>

          <el-button type="text" @click="edit(scope.row.id)">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text">
            <!-- 气泡确认框 -->
            <template>
              <el-popconfirm @confirm="del(scope.row.id)"
                             title="确定删除吗？"
              >
                <el-button type="text" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
          </el-button>


        </template>
      </el-table-column>

    </el-table>

    <!-- 弹窗 -->
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
    >

      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-editForm">

        <!-- 隐藏ID -->
        <el-form-item v-show="false" label="id" prop="id">
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>

        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="唯一编码" prop="code">
          <el-input v-model="editForm.code"></el-input>
        </el-form-item>

        <el-form-item label="描述" prop="content">
          <el-input v-model="editForm.content"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio label=0>正常</el-radio>
            <el-radio label=1>禁止</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">完成</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>

        </el-form-item>
      </el-form>

    </el-dialog>

    <!-- 分页组件 -->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.currentPage"
        :page-sizes="[1, 20, 30, 40]"
        :page-size="this.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.totalNum">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      currentPage: 1 // 当前页
      , pageSize: 1 // 一页多少条
      , totalNum: 0 // 总共多少数据
      ,searchName: '',
      // batchDelDisable: true,
      editForm: {
        status: "0" // 编辑表单初始默认值
      },
      rules: {

        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入唯一编码', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请输入状态', trigger: 'blur'}
        ]
      }
      ,
      dialogVisible: false,
      tableData: [],
      multipleSelection: [] // 多选框数组

    }
  },
  methods: {
    // 分页方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getMenuList()

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getMenuList()

    },
    // 多选框方法
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      console.log("多选框 val ", val)
      this.multipleSelection = val;
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/sys/role/' + (this.editForm.id ? 'update' : 'save'), this.editForm).then(res => {
            let result = res.data
            this.$message({
              message: (this.editForm.id ? '编辑' : '新增') + '成功!',
              type: 'success'
            });

            // 关闭弹窗并且重置内容
            this.dialogVisible = false;
            this.resetForm("editForm")
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 查询角色表单列表数据
    getMenuList() {
      this.$axios.post('/sys/role/list', {
          param:{
            currentPage: this.currentPage
            , pageSize: this.pageSize
            , totalNum: this.totalNum
            ,searchName: this.searchName
        }}).then(res => {
        this.tableData = res.data.data.tableData
        this.totalNum = res.data.data.totalNum
        console.log("获取角色表单数据", res.data.data.tableData)
      })
    },
    // 编辑
    edit(id) {
      this.$axios.get('/sys/role/queryById?id=' + id).then(res => {
        let result = res.data.data
        this.dialogVisible = true
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.editForm = result
          console.log("role id=" + id)
        })

      })
    },
    // 删除
    del(id) {
      let ids = []
      if(id){
        // 单个删除
        console.log("删除:id",id)

        ids.push(id)
      }else{
        // 批量删除
        console.log("批量删除:id",id)
        for (let theId in this.multipleSelection) {
          ids.push(theId)
        }
      }
      this.$axios.post('/sys/role/del', ids).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getMenuList()
        console.log("删除后重新加载页面")

      })
    },
    // 关闭弹窗处理动作
    handleClose(done) {
      this.$refs['editForm'].resetFields();
      console.log("关闭窗口")
      done();
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  // 页面初始化时调用的方法
  created() {
    this.getMenuList()
    this.dialogVisible = false

  }
}
</script>

<style scoped>
.el-pagination {
  float: right;
}
</style>