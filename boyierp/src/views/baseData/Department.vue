<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input size="mini" icon="" v-model="searchName" placeholder="部门名称" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button size="mini" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-form-item>

      <el-form-item v-if="hasAuth('baseData:department:save')">
        <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('baseData:department:save')"  @click="dialogVisible = true">新增</el-button>
      </el-form-item>

      <el-form-item v-if="hasAuth('baseData:department:del')">
        <!-- 气泡确认框 -->
        <el-popconfirm @confirm="del(null)" title="确定删除吗？" >
          <el-button size="mini" icon="el-icon-delete" :disabled="this.multipleSelection.length === 0 " type="danger" slot="reference">批量删除</el-button>
        </el-popconfirm>
      </el-form-item>

    </el-form>

    <el-table
        ref="multipleTable"
        :data="tableData"
        border
        stripe
        size="mini"
        :cell-style="{padding:'0'}"
        fit
        tooltip-effect="dark"
        style="width: 100%;color:black"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          prop="id"
          label="编码"
          sortable
      >
      </el-table-column>
      <el-table-column
          label="部门名称"
          prop="name">
      </el-table-column>

      <!-- fixed 固定某一列，都会显示 ，并且横向内容可以有横向拉框-->
      <el-table-column
          prop="action"
          label="操作"
          width="230px"
          fixed="right"
      >
        <template slot-scope="scope">

          <el-button type="text" size="small" @click="edit(scope.row.id)" v-if="hasAuth('baseData:department:update')  ">编辑</el-button>
          <el-divider direction="vertical" v-if="hasAuth('baseData:department:del')  "></el-divider>

          <el-button type="text" style="padding: 0px" v-if="hasAuth('baseData:department:del')  ">
            <!-- 气泡确认框 -->
            <template>
              <el-popconfirm @confirm="del(scope.row.id)"
                             title="确定删除吗？"
              >
                <el-button type="text" size="small" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
          </el-button>


        </template>
      </el-table-column>

    </el-table>

    <!-- 弹窗 -->
    <el-dialog
        title="部门信息"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
    >

      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-editForm">
        <!-- 隐藏ID -->
        <el-form-item  v-show="false" label="id" prop="id" >
          <el-input v-model="editForm.id" ></el-input>
        </el-form-item>

        <el-form-item label="部门名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
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
        :page-sizes="[10, 20, 30, 40]"
        :page-size="this.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total">
    </el-pagination>
  </div>
</template>

<script>
import {request} from "@/axios";

export default {
  name: "User",
  data() {
    return {
      currentPage: 1 // 当前页
      , pageSize: 10 // 一页多少条
      , total: 0 // 总共多少数据
      ,searchName:'',
      // batchDelDisable: true,
      // 输入框的内容要写全，不然会发生，莫名其妙不能输入的问题
      editForm: {
        name:''
      },
      rules: {
        name: [
          {required: true, message: '请输入部门名称', trigger: 'blur'}
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
      this.getList()

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getList()

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
      this.multipleSelection = []

      val.forEach(theId => {
        if(theId.id === 1){
          // 是超级管理员部门，不能删除
        }else {
          this.multipleSelection.push(theId.id)
        }
      })
      console.log("多选框 选中的 ", this.multipleSelection)
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          request.post('/baseData/department/' + (this.editForm.id ? 'update' : 'save'), this.editForm).then(res => {
            this.$message({
              message: (this.editForm.id ? '编辑' : '新增') + '成功!',
              type: 'success'
            });

            // 关闭弹窗并且重置内容
            this.dialogVisible = false;
            this.resetForm("editForm")
            this.getList();

          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    // 查询部门表单列表数据
    getList() {
      request.get('/baseData/department/list', {
        params:{
          currentPage: this.currentPage
          , pageSize: this.pageSize
          , total: this.total
          ,searchName: this.searchName
        }}).then(res => {
        this.tableData = res.data.data.records
        this.total = res.data.data.total
        console.log("获取部门表单数据", res.data.data.records)
      })
    },
    // 编辑页面
    edit(id) {
      request.get('/baseData/department/queryById?id=' + id).then(res => {
        let result = res.data.data
        this.dialogVisible = true
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.editForm = result
          console.log("user id=" + id)
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
        ids = this.multipleSelection
        console.log("批量删除:id",ids)
      }
      request.post('/baseData/department/del', ids).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getList()
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
    this.getList()
    this.dialogVisible = false

  }
}
</script>

<style scoped>
.el-pagination {
  float: right;

}
</style>