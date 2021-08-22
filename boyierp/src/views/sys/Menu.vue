<template>
  <div>
    <el-form class="demo-form-inline">
      <el-form-item v-if="hasAuth('sysManage:menu:save')">
        <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        stripe
        size="mini"
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
          prop="menuName"
          label="名称"
          sortable
          width="180">
      </el-table-column>
      <el-table-column
          prop="authority"
          label="权限编码"
          sortable
          width="180">
      </el-table-column>
      <el-table-column
          prop="icon"
          label="图标">
      </el-table-column>

      <el-table-column
          prop="type"
          label="类型">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.type === 0">目录</el-tag>
          <el-tag size="small" v-else-if="scope.row.type===1" type="success">菜单</el-tag>
          <el-tag size="small" v-else-if="scope.row.type===2" type="info">按钮</el-tag>

        </template>
      </el-table-column>

      <el-table-column
          prop="url"
          label="菜单url">
      </el-table-column>

      <el-table-column
          prop="component"
          label="菜单组件">
      </el-table-column>

      <el-table-column
          prop="orderType"
          label="排序号">
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
          fixed="right"
          width="150px"
          label="操作" style="float: right;">
        <template slot-scope="scope">
          <el-button type="text" v-if="hasAuth('sysManage:menu:update')" size="small" @click="edit(scope.row.id)">编辑
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button style="padding: 0px"  type="text" v-if="hasAuth('sysManage:menu:del')">
            <!-- 气泡确认框 -->
            <template>
              <el-popconfirm @confirm="del(scope.row.id)"
                             title="确定删除吗？"
              >
                <el-button type="text" slot="reference" size="small">删除</el-button>
              </el-popconfirm>
            </template>
          </el-button>


        </template>
      </el-table-column>
    </el-table>


    <!-- 弹窗 -->
    <el-dialog
        title="菜单信息"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
    >

      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-editForm">

        <!-- 隐藏ID -->
        <el-form-item v-show="false" label="id" prop="id">
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>

        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="editForm.parentId" placeholder="请选择上级菜单">
            <template v-for="item in tableData">
              <el-option :label="item.menuName" :value="item.id">
              </el-option>

              <template v-for="child in item.children">
                <el-option :label="child.menuName" :value="child.id">
                  <span>{{ "   - " + child.menuName }}</span>
                </el-option>
              </template>

            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="editForm.menuName"></el-input>
        </el-form-item>

        <el-form-item label="权限编码" prop="authority">
          <el-input v-model="editForm.authority"></el-input>
        </el-form-item>

        <el-form-item label="图标" prop="icon">
          <el-input v-model="editForm.icon"></el-input>
        </el-form-item>

        <el-form-item label="菜单url" prop="url">
          <el-input v-model="editForm.url"></el-input>
        </el-form-item>

        <el-form-item label="菜单组件" prop="component">
          <el-input v-model="editForm.component"></el-input>
        </el-form-item>

        <el-form-item label="排序号" prop="orderType">
          <el-input v-model="editForm.orderType"></el-input>
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="editForm.type">
            <el-radio :label=0>目录</el-radio>
            <el-radio :label=1>菜单</el-radio>
            <el-radio :label=2>按钮</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio :label=0>正常</el-radio>
            <el-radio :label=1>禁止</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">完成</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>

        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "menu",
  data() {
    return {
      editForm: {
        status: 0, // 编辑表单初始默认值
        type:2
      },
      rules: {

        parentId: [
          {required: true, message: '请选择上级菜单', trigger: 'change'}
        ],
        menuName: [
          {required: true, message: '请输入菜单名称', trigger: 'blur'}
        ],
        authority: [
          {required: true, message: '请输入权限编码', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请输入类型', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请输入状态', trigger: 'blur'}
        ]
      }
      ,
      dialogVisible: false,
      tableData: []
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/sys/menu/' + (this.editForm.id ? 'update' : 'save'), this.editForm).then(res => {
            let result = res.data
            this.$message({
              message: (this.editForm.id ? '编辑' : '新增') + '成功!',
              type: 'success'
            });

            // 关闭弹窗并且重置内容
            this.dialogVisible = false;
            this.resetForm("editForm")
            this.getMenuList();

          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 查询菜单表单列表数据
    getMenuList() {
      this.$axios.post('/sys/menu/list').then(res => {
        this.tableData = res.data.data
      })
    },
    // 编辑
    edit(id) {
      this.$axios.get('/sys/menu/queryById?id=' + id).then(res => {
        console.log("根据菜单id查询结果:",res.data.data)
        let result = res.data.data
        this.dialogVisible = true
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.editForm = result
          console.log("id=" + id)
        })

      })
    },
    // 删除
    del(id) {
      this.$axios.get('/sys/menu/delById?id=' + id).then(res => {
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

</style>