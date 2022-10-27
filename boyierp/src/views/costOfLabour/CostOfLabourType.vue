<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item v-if="hasAuth('costOfLabour:costOfLabourType:save')">

        <el-button type="primary" size="mini" icon="el-icon-plus" v-if="hasAuth('costOfLabour:costOfLabourType:save')"  @click="dialogVisible = true">新增</el-button>
      </el-form-item>

      <el-form-item v-if="hasAuth('costOfLabour:costOfLabourType:del')">
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

        tooltip-effect="dark"
        style="width: 100%;color:black"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          label="工价类别名称"
          prop="typeName"
          width="200">
      </el-table-column>
      <el-table-column
          prop="roles"
          label="所属角色"
          width="200">
        <template slot-scope="scope">
          <el-tag size="small" type="info" v-show="scope.row.roles!=undefined" v-for="item in scope.row.roles">{{item.roleName}}</el-tag>
        </template>
      </el-table-column>
      <!-- fixed 固定某一列，都会显示 ，并且横向内容可以有横向拉框-->
      <el-table-column
          prop="action"
          label="操作"
          fixed="right"

      >
        <template slot-scope="scope">

          <el-button type="text" size="small" v-if="hasAuth('costOfLabour:costOfLabourType:authority')  "    @click="editRoleMenu(scope.row.id)">分配角色</el-button>

          <el-divider direction="vertical" v-if="hasAuth('costOfLabour:costOfLabourType:resetPass')  "></el-divider>

          <el-button type="text" size="small" @click="edit(scope.row.id)" v-if="hasAuth('costOfLabour:costOfLabourType:update')  ">编辑</el-button>
          <el-divider direction="vertical" v-if="hasAuth('costOfLabour:costOfLabourType:del')  "></el-divider>

          <el-button type="text" style="padding: 0" v-if="hasAuth('costOfLabour:costOfLabourType:del') ">
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
        title="工价类别"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
    >

      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-editForm">
        <!-- 隐藏ID -->
        <el-form-item v-show="false" label="id" prop="id">
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>

        <el-form-item label="工价类别" prop="typeName">
          <el-input v-model="editForm.typeName"></el-input>
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
        <!-- 隐藏ID -->
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

  </div>
</template>

<script>
import {request} from "@/axios";

export default {
  name: "CostOfLabourType",
  data() {
    return {

      searchUserName:'',
      // batchDelDisable: true,
      // 输入框的内容要写全，不然会发生，莫名其妙不能输入的问题
      editForm: {
        typeName:'',

      },
      rules: {
        typeName: [
          {required: true, message: '请输入工价类别名称', trigger: 'blur'}
        ],
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
          if(!this.multipleSelection.some(item=>item==theId.id)){
          this.multipleSelection.push(theId.id)
        }
      })
      console.log("多选框 选中的 ", this.multipleSelection)
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          request.post('/costOfLabour/costOfLabourType/' + (this.editForm.id ? 'update' : 'save'), this.editForm).then(res => {
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
    submitAuthorityForm(formName) {
      console.log("提交后的，被选中的 角色 ID数组：",this.$refs.tree.getCheckedKeys())
      request.post('/costOfLabour/costOfLabourType/authority?id='+this.authorityForm.id,this.$refs.tree.getCheckedKeys()).then(res => {
        let result = res.data
        this.$message({
          message:'修改成功!',
          type: 'success'
        });

        // 关闭弹窗并且重置内容
        this.authorityDialogVisible = false;
        this.getList()
      });
    },

    // 查询角色表单列表数据
    getList() {
      request.get('/costOfLabour/costOfLabourType/list').then(res => {
        this.tableData = res.data.data
      })
    },
    // 编辑页面
    edit(id) {
      request.get('/costOfLabour/costOfLabourType/queryById?id=' + id).then(res => {
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
    // 点击分配角色
    editRoleMenu(id) {
      // 设置id
      this.authorityForm.id = id;
      // 1. 弹出分配权限窗口
      this.authorityDialogVisible = true
      // 2. 获取全部角色列表
      request.post('/sys/role/listValide').then(res => {
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
        // 赋值到编辑表单
        this.authorityTreeData = res.data.data
          console.log("权限tree 数据:",this.authorityTreeData)
        })
      })
      // 3. 获取该用户的角色列表
      request.get('/costOfLabour/costOfLabourType/queryRolesByCostOfTypeName?id=' + id).then(res => {
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
      request.post('/costOfLabour/costOfLabourType/del', ids).then(res => {
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