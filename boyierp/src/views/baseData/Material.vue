<template>

  <el-container>
    <el-aside width="200px" style="background-color: #B3C0D1">
      <el-button type="text" size="small" v-if="hasAuth('baseData:material:save')"  @click="addGroup()" >新增分组</el-button>
      <el-button type="text" size="small" v-if="hasAuth('baseData:material:update')"  @click="updateGroup()"  >修改分组</el-button>
      <el-button type="text"  v-if="hasAuth('baseData:material:del') ">
        <!-- 气泡确认框 -->
        <template>
          <el-popconfirm @confirm="del2()"
                         title="确定删除吗？"
          >
            <el-button type="text" size="small" slot="reference">删除分组</el-button>
          </el-popconfirm>
        </template>
      </el-button>

      <el-tree ref="groupTree"
               node-key="id"
               :default-expanded-keys="defaulExpandedKeys"
               style="font-weight: bold"
               :data="groupData" :props="groupDefaultProps" @node-click="handleNodeClick"></el-tree>

      <!-- 物料分组弹框 -->
      <el-dialog
          title="物料分组信息"
          :visible.sync="groupDialogVisible"
          width="30%"
          :before-close="handleClose_group"
      >

        <el-form :model="groupEditForm" :rules="groupRules" ref="groupEditForm" label-width="100px" class="demo-editForm">
          <el-form-item v-show="true" label="id" prop="id">
            <el-input v-model="groupEditForm.id"></el-input>
          </el-form-item>
          <el-form-item v-show="true" label="parentId" prop="parentId">
            <el-input v-model="groupEditForm.parentId"></el-input>
          </el-form-item>

          <el-form-item label="上级分组" prop="parentCode">
            <el-input v-model="groupEditForm.parentCode"
                :disabled="true">
            </el-input>
          </el-form-item>

          <el-form-item label="编码" prop="code">
            <el-input v-model="groupEditForm.code"></el-input>
          </el-form-item>

          <el-form-item label="名称" prop="name">
            <el-input v-model="groupEditForm.name"></el-input>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="groupEditForm.status">
              <el-radio :label=0>正常</el-radio>
              <el-radio :label=1>禁止</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="groupSubmitForm('groupEditForm')">完成</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>



    </el-aside>
<!--    <el-main>
      <div>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="searchUserName" placeholder="用户名称" clearable></el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="getUserList">搜索</el-button>
          </el-form-item>

          <el-form-item v-if="hasAuth('sysManage:user:save')">
            <el-button type="primary" v-if="hasAuth('sysManage:user:save')"  @click="dialogVisible = true">新增</el-button>
          </el-form-item>

          <el-form-item v-if="hasAuth('sysManage:user:del')">
            &lt;!&ndash; 气泡确认框 &ndash;&gt;
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
              prop="sysRoles"
              label="角色名称"
              width="120">
            <template slot-scope="scope">
              <el-tag size="small" type="info" v-for="item in scope.row.sysRoles">{{item.roleName}}</el-tag>
            </template>
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

          &lt;!&ndash; fixed 固定某一列，都会显示 ，并且横向内容可以有横向拉框&ndash;&gt;
          <el-table-column
              prop="action"
              label="操作"
              width="230px"
              fixed="right"
          >
            <template slot-scope="scope">

              <el-button type="text" size="small" v-if="hasAuth('sysManage:user:authority')  && scope.row.userName !='admin'"    @click="editRoleMenu(scope.row.id)">分配角色</el-button>
              <el-divider direction="vertical" v-if="hasAuth('sysManage:user:authority')  && scope.row.userName !='admin'" ></el-divider>

              <el-button type="text" v-if="hasAuth('sysManage:user:resetPass')  && scope.row.userName !='admin'">
                &lt;!&ndash; 气泡确认框 &ndash;&gt;
                <template>
                  <el-popconfirm @confirm="resetPass(scope.row.id,scope.row.userName)"
                                 title="确定重置吗？"
                  >
                    <el-button type="text" size="small" slot="reference">重置密码</el-button>
                  </el-popconfirm>
                </template>
              </el-button>

              <el-divider direction="vertical" v-if="hasAuth('sysManage:user:resetPass')  && scope.row.userName !='admin'"></el-divider>

              <el-button type="text" size="small" @click="edit(scope.row.id)" v-if="hasAuth('sysManage:user:update')  && scope.row.userName !='admin'">编辑</el-button>
              <el-divider direction="vertical" v-if="hasAuth('sysManage:user:del')  && scope.row.userName !='admin'"></el-divider>

              <el-button type="text"  v-if="hasAuth('sysManage:user:del')  && scope.row.userName !='admin'">
                &lt;!&ndash; 气泡确认框 &ndash;&gt;
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

        &lt;!&ndash; 弹窗 &ndash;&gt;
        <el-dialog
            title="用户信息"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
        >

          <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-editForm">
            &lt;!&ndash; 隐藏ID &ndash;&gt;
            <el-form-item v-show="false" label="id" prop="id">
              <el-input v-model="editForm.id"></el-input>
            </el-form-item>

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

        &lt;!&ndash; 分配角色页面 &ndash;&gt;
        <el-dialog
            title="分配角色权限"
            :visible.sync="authorityDialogVisible"
            width="30%"
            @closed="authorityDialogVisible = false"
        >
          <el-form :model="authorityForm" ref="authorityForm" label-width="100px" class="demo-editForm">
            &lt;!&ndash; 隐藏ID &ndash;&gt;
            <el-form-item v-show="false" label="id" prop="id">
              <el-input v-model="authorityForm.id"></el-input>
            </el-form-item>

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

        &lt;!&ndash; 分页组件 &ndash;&gt;
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
    </el-main>-->
  </el-container>


</template>

<script>
export default {
  name: "Unit",
  data() {
    return {
      defaulExpandedKeys:[],
      currentPage: 1 // 当前页
      , pageSize: 10 // 一页多少条
      , total: 0 // 总共多少数据
      ,searchUserName:'',
      // batchDelDisable: true,
      editForm: {
        status: 0 // 编辑表单初始默认值
      },
      rules: {
        userName: [
          {required: true, message: '请输入用户名称', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请输入状态', trigger: 'blur'}
        ]
      }
      ,
      groupEditForm: {
        status: 0 ,// 编辑表单初始默认值
        parentId:0 // 初始默认值
      },
      groupRules: {
        name: [
          {required: true, message: '请输入分组名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入编码', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请输入状态', trigger: 'blur'}
        ]
      }
      ,
      dialogVisible: false,
      groupDialogVisible:false, // 物料分组的弹窗标识
      tableData: [],
      multipleSelection: [] // 多选框数组
      ,
      authorityTreeData: [],
      defaultProps: {
        label: 'roleName'
      },
      authorityDialogVisible:false,
      authorityForm:{}

      ,
      groupData:[
        {
          parentId:'',
          code:''
        }
      ],
      groupDefaultProps:{
        children: 'children',
        label: 'label'
      },
      groupTreeCheckedId:'',

      lastClickTreeNode:{
      }
    }
  },
  methods: {
    addGroup(){
      if(this.lastClickTreeNode){
        this.groupEditForm.parentId =this.lastClickTreeNode.id;
        this.groupEditForm.parentCode =this.lastClickTreeNode.code;
      }
      // if(this.groupEditForm.parentId === 0){
        this.groupDialogVisible = true
      console.log("添加页面的parentId,parentCode:",this.groupEditForm.parentId,this.groupEditForm.parentCode)

      // }else {
      //   this.$message({
      //     message: '只允许2层菜单!请重新选择',
      //     type: 'error'
      //   });
      // }
    },
    updateGroup(){
      console.log("上一次选中的TreeNode:",this.lastClickTreeNode)
      if(this.lastClickTreeNode.id!=undefined){
        this.groupEditForm = this.lastClickTreeNode;
        this.groupDialogVisible = true
      }else {
        this.$message({
              message: '请选择一个分组!',
              type: 'error'
            });
      }
    },
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
      this.multipleSelection = []

      val.forEach(theId => {
        if(theId.id === 1){
          // 是超级管理员用户，不能删除
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
          this.$axios.post('/sys/user/' + (this.editForm.id ? 'update' : 'save'), this.editForm).then(res => {
            this.$message({
              message: (this.editForm.id ? '编辑' : '新增') + '成功!',
              type: 'success'
            });

            // 关闭弹窗并且重置内容
            this.dialogVisible = false;
            this.resetForm("editForm")
            this.getUserList();

          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 物料分组的 表单提交
    groupSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {

        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          if (valid) {
            console.log("提交前的参数:parentId:",this.groupEditForm.parentId)

            this.$axios.post('/baseData/materialGroup/' + (this.groupEditForm.id ? 'update' : 'save'), this.groupEditForm).then(res => {
              this.$message({
                message: (this.groupEditForm.id ? '编辑' : '新增') + '成功!',
                type: 'success'
              });

              // 关闭弹窗并且重置内容
              this.groupDialogVisible = false;
              let id = this.groupEditForm.id;
              this.resetForm("groupEditForm")

              this.getMaterialGroupList();
              this.defaulExpandedKeys= [id];
              console.info("设置的默认展开ID:",id)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })

      });
    },
    submitAuthorityForm(formName) {
      console.log("提交后的，被选中的 角色 ID数组：",this.$refs.tree.getCheckedKeys())
      this.$axios.post('/sys/user/authority?userId='+this.authorityForm.id,this.$refs.tree.getCheckedKeys()).then(res => {
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
      this.$axios.get('/sys/user/list', {
        params:{
          currentPage: this.currentPage
          , pageSize: this.pageSize
          , total: this.total
          ,searchUserName: this.searchUserName
        }}).then(res => {
        this.tableData = res.data.data.records
        this.total = res.data.data.total
        console.log("获取用户表单数据", res.data.data.records)
      })
    },
    // 查询物料分组 列表数据
    getMaterialGroupList() {
      this.$axios.post('/baseData/materialGroup/listValide').then(res => {
          this.$nextTick(() => {
            this.groupData = res.data.data
            console.log("查询物料分组", res.data.data)
          })
      })
    },
    // 编辑页面
    edit(id) {
      this.$axios.get('/sys/user/queryById?id=' + id).then(res => {
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
    // 重置密码
    resetPass(id,username) {
      this.$axios.get('/sys/user/resetPass',{
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
    // 点击分配角色
    editRoleMenu(id) {
      // 设置id
      this.authorityForm.id = id;
      // 1. 弹出分配权限窗口
      this.authorityDialogVisible = true
      // 2. 获取全部角色列表
      this.$axios.post('/sys/role/listValide').then(res => {
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
        // 赋值到编辑表单
        this.authorityTreeData = res.data.data
          console.log("权限tree 数据:",this.authorityTreeData)
        })
      })
      // 3. 获取该用户的角色列表
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
        ids = this.multipleSelection
        console.log("批量删除:id",ids)
      }
      this.$axios.post('/sys/user/del', ids).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getUserList()
        console.log("删除后重新加载页面")

      })
    },
    // 分组-删除事件
    del2(id) {
      let checkedKeys = this.$refs.groupTree.getCurrentKey
      console.log("选中分组id:",checkedKeys)
      /*this.$axios.post('/baseData/materialGroup/del', id).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getMaterialGroupList()
        console.log("删除后重新加载页面")

      })*/
    },
    // 关闭弹窗处理动作
    handleClose(done) {
      this.$refs['editForm'].resetFields();
      console.log("关闭窗口")
      done();
    },
    // 关闭弹窗处理动作
    handleClose_group(done) {
      this.$refs['groupEditForm'].resetFields();
      console.log("关闭分组窗口")
      done();
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 树形菜单的点击事件
    handleNodeClick(data,node,item) {
      console.log(data)
      console.log(node)
      console.log(item)
      this.lastClickTreeNode = data;
      console.log("最后选中的Treedata: ",this.lastClickTreeNode)
    }
  },
  // 页面初始化时调用的方法
  created() {
    this.getUserList()
    this.getMaterialGroupList()
    this.dialogVisible = false
  }

}
</script>

<style scoped>
.el-pagination {
  float: right;

}
</style>