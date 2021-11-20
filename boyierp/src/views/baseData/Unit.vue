<template>
  <div>
    <el-form class="demo-form-inline">
      <el-form-item v-if="hasAuth('baseData:unit:save')">
        <el-button  size="mini" icon="el-icon-plus" type="primary" @click="dialogVisible = true">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        stripe
        fit
        size="mini"
        :cell-style="{padding:'0'}"
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
          prop="code"
          label="编码"
          >
      </el-table-column>
      <el-table-column
          prop="name"
          label="名称"
          >
      </el-table-column>

      <el-table-column
          prop="action"
          fixed="right"
          width="220"
          label="操作" style="float: right;">
        <template slot-scope="scope">
          <el-button type="text" v-if="hasAuth('baseData:unit:update')" size="small" @click="edit(scope.row.id)">编辑
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button style="padding: 0"  type="text" v-if="hasAuth('baseData:unit:del')">
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
        title="计量单位信息"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
    >

      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-editForm">

        <!-- 隐藏ID -->
        <el-form-item v-show="false" label="id" prop="id">
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>


        <el-form-item label="编码" prop="code">
          <el-input v-model="editForm.code"></el-input>
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
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
import {request} from "@/axios";

export default {
  name: "unit",
  data() {
    return {
      editForm: {
        code:'',
        name:''
      },
      rules: {

        name: [
          {required: true, message: '请输入计量单位名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入编码', trigger: 'blur'}
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
          request.post('/baseData/unit/' + (this.editForm.id ? 'update' : 'save'), this.editForm).then(res => {
            let result = res.data
            this.$message({
              message: (this.editForm.id ? '编辑' : '新增') + '成功!',
              type: 'success'
            });

            // 关闭弹窗并且重置内容
            this.dialogVisible = false;
            this.resetForm("editForm")
            this.getUnitList();

          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 查询计量单位表单列表数据
    getUnitList() {
      request.post('/baseData/unit/list').then(res => {
        this.tableData = res.data.data
      })
    },
    // 编辑
    edit(id) {
      request.get('/baseData/unit/queryById?id=' + id).then(res => {
        console.log("根据计量单位id查询结果:",res.data.data)
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
      request.get('/baseData/unit/delById?id=' + id).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getUnitList()
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
    this.getUnitList()
    this.dialogVisible = false

  }
}
</script>

<style scoped>

</style>