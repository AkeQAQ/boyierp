<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
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
          prop="URL"
          label="菜单URL">
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
          label="操作">
        <template slot-scope="scope">
          <el-button type="text" >编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text">
            <template>
              <el-popconfirm
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
        width="30%">

      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-editForm">

              <el-form-item label="上级菜单" prop="parentId">
                 <el-select v-model="editForm.parentId" placeholder="请选择上级菜单">
                   <template v-for="item in tableData">
                     <el-option :label="item.menuName" :value="item.id">
                     </el-option>

                     <template v-for="child in item.children">
                       <el-option :label="child.menuName" :value="child.id">
                         <span>{{"   - " + child.menuName}}</span>
                       </el-option>
                     </template>

                   </template>
                 </el-select>
               </el-form-item>

<!--
      <el-form-item label="活动区域" prop="region">
        <el-select v-model="editForm.parentId" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
-->


        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="editForm.menuName"></el-input>
        </el-form-item>

        <el-form-item label="权限编码" prop="authority">
          <el-input v-model="editForm.authority"></el-input>
        </el-form-item>

        <el-form-item label="图标" prop="icon">
          <el-input v-model="editForm.icon"></el-input>
        </el-form-item>

        <el-form-item label="菜单URL" prop="URL">
          <el-input v-model="editForm.URL"></el-input>
        </el-form-item>

        <el-form-item label="菜单组件" prop="component">
          <el-input v-model="editForm.component"></el-input>
        </el-form-item>

        <el-form-item label="排序号" prop="orderType">
          <el-input v-model="editForm.orderType"></el-input>
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="editForm.type">
            <el-radio label="0">目录</el-radio>
            <el-radio label="1">菜单</el-radio>
            <el-radio label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status" >
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">禁止</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">立即创建</el-button>
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
      editForm:{
        parentId:'',
        menuName:'',
        authority:'',
        icon:'',
        type: 0,
        URL: '',
        component: '',
        orderType: '',
        status: 0,
        action: '',
        children: [{
          id: 31,
          menuName: '用户管理',
          authority: '',
          icon: '',
          type: 1,
          URL: '',
          component: '',
          orderType: '',
          status: 1,
          action: '',
        }]
      },
      rules: {

        parentId: [
          { required: true, message: '请选择上级菜单', trigger: 'change' }
        ],
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        authority: [
          { required: true, message: '请输入权限编码', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请输入图标', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入类型', trigger: 'blur' }
        ],
        URL: [
          { required: true, message: '请输入菜单URL', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '请输入菜单组件', trigger: 'blur' }
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
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getMenuList(){
      this.$axios.post('/sys/menu/list').then(res=>{
        this.tableData = res.data.data
      })

    }
  },
  created() {
    this.getMenuList()
  }
}
</script>

<style scoped>

</style>