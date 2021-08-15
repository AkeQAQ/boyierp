<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchName" placeholder="用户名称" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="getUserList()">搜索</el-button>
      </el-form-item>

      <el-form-item v-if="hasAuth('sysManage:user:save')">
        <el-button type="primary" v-if="hasAuth('sysManage:user:save')"  @click="dialogVisible = true">新增</el-button>
      </el-form-item>

      <el-form-item v-if="hasAuth('sysManage:user:del')">
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
        stripe
        size="mini"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          label="用户名"
          prop="userName"
          width="120">
      </el-table-column>
      <el-table-column
          prop="roleName"
          label="角色名称"
          width="120">
      </el-table-column>
      <el-table-column
          prop="email"
          label="邮箱"
          show-overflow-tooltip>
      </el-table-column>

      <el-table-column
          prop="mobile"
          label="手机号"
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

      <!-- fixed 固定某一列，都会显示 ，并且横向内容可以有横向拉框-->
      <el-table-column
          prop="action"
          label="操作"
          width="230px"
          fixed="right"
      >
        <template slot-scope="scope">

          <el-button type="text" size="small" v-if="hasAuth('sysManage:user:authority')"  @click="editRoleMenu(scope.row.id)">分配角色</el-button>
          <el-divider direction="vertical" v-if="hasAuth('sysManage:user:authority')" ></el-divider>

          <el-button type="text" v-if="hasAuth('sysManage:user:resetPass')">
            <!-- 气泡确认框 -->
            <template>
              <el-popconfirm @confirm="resetPass(scope.row.id,scope.row.userName)"
                             title="确定重置吗？"
              >
                <el-button type="text" size="small" slot="reference">重置密码</el-button>
              </el-popconfirm>
            </template>
          </el-button>

          <el-divider direction="vertical" v-if="hasAuth('sysManage:user:resetPass')"></el-divider>

          <el-button type="text" size="small" @click="edit(scope.row.id)" v-if="hasAuth('sysManage:user:update')">编辑</el-button>
          <el-divider direction="vertical" v-if="hasAuth('sysManage:user:del')"></el-divider>

          <el-button type="text"  v-if="hasAuth('sysManage:user:del')">
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
        title="用户信息"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
    >

      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-editForm">

        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="editForm.userName"></el-input>
          <el-input
              placeholder="初始密码 888888"
              :disabled="true">
          </el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
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

    <!-- 分配角色页面 -->
    <el-dialog
        title="分配角色权限"
        :visible.sync="authorityDialogVisible"
        width="30%"
        @closed="authorityDialogVisible = false"
    >
      <el-form :model="authorityForm" ref="authorityForm" label-width="100px" class="demo-editForm">


        <el-tree
            ref="tree"
            :data="authorityTreeData"
            show-checkbox
            default-expand-all
            node-key="id"
            :props="defaultProps">
        </el-tree>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="authorityDialogVisible = false">取消</el-button>

        <el-button type="primary" @click="submitAuthorityForm('authorityForm')">完成</el-button>

      </div>

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
  name: "User",
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
        userName: [
          {required: true, message: '请输入用户名称', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请输入状态', trigger: 'blur'}
        ]
      }
      ,
      dialogVisible: false,
      tableData: [],
      multipleSelection: [] // 多选框数组

      ,
      authorityTreeData: [],
      defaultProps: {
        label: 'roleName'
      },
      authorityDialogVisible:false,
      authorityForm:{}
    }
  },
  methods: {
    // 分页方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getUserList()

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getUserList()

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
          this.$axios.post('/sys/user/' + (this.editForm.id ? 'update' : 'save'), this.editForm).then(res => {
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
    submitAuthorityForm(formName) {
      console.log("提交后的，被选中的 角色 ID数组：",this.$refs.tree.getCheckedKeys())
      this.$axios.post('/sys/user/updateOwnRoles',{
        param:{

          roleIds:this.$refs.tree.getCheckedKeys()
        }
      }).then(res => {
        let result = res.data
        this.$message({
          message:'修改成功!',
          type: 'success'
        });

        // 关闭弹窗并且重置内容
        this.authorityDialogVisible = false;
      });
    },

    // 查询角色表单列表数据
    getUserList() {
      this.$axios.post('/sys/user/list', {
        param:{
          currentPage: this.currentPage
          , pageSize: this.pageSize
          , totalNum: this.totalNum
          ,searchName: this.searchName
        }}).then(res => {
        this.tableData = res.data.data.tableData
        this.totalNum = res.data.data.totalNum
        console.log("获取用户表单数据", res.data.data.tableData)
      })
    },
    // 编辑
    edit(id) {
      this.$axios.get('/sys/user/queryById?id=' + id).then(res => {
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
    // 编辑
    resetPass(id,username) {
      this.$axios.post('/sys/user/resetPass',{
        params:{
          id:id
        }
      }).then(res => {
        this.$message({
          message: '用户['+username+']重置成功!',
          type: 'success'
        });
      })
    },
    // 分配菜单权限
    editRoleMenu(id) {
      // 1. 弹出分配权限窗口
      this.authorityDialogVisible = true
      // 2. 获取全部菜单列表
      this.$axios.post('/sys/role/listAll').then(res => {
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        // this.$nextTick(() => {
        // 赋值到编辑表单
        this.authorityTreeData = res.data.data
        // })
      })
      // 3. 获取该用户的菜单列表
      this.$axios.get('/sys/user/queryRolesByUserId?id=' + id).then(res => {
        let result = res.data
        // 4. 设置选中的节点
        this.$refs.tree.setCheckedKeys(result.data);
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
        this.getUserList()
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
    this.getUserList()
    this.dialogVisible = false

  }
}
</script>

<style scoped>
.el-pagination {
  float: right;

}
</style>