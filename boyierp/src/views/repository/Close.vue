<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="editForm" >
      <el-form-item>
        <el-date-picker prop="closeDate" style="width: 130px"
                        size="mini"
                        value-format="yyyy-MM-dd"
                        type="date"
                        v-model="editForm.closeDate"
                        clearable
                        placeholder="关账日期">
        </el-date-picker>

      </el-form-item>

      <el-form-item v-if="hasAuth('repository:close:save')">
        <el-button type="primary" size="mini" icon="el-icon-plus" v-if="hasAuth('repository:close:save')"  @click="submitForm">新增</el-button>
      </el-form-item>

      <el-form-item v-if="hasAuth('repository:close:return')">
        <el-popconfirm @confirm="returnLast()" title="确定回退吗？" >
          <el-button size="mini" icon="el-icon-delete"  type="danger" slot="reference">回退</el-button>
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
        height="300px"
        tooltip-effect="dark"
        style="width: 100%;color:black">
      <el-table-column
          label="关账日期"
          prop="closeDate">
      </el-table-column>

    </el-table>


    <el-table
        ref="multipleTable2"
        :data="tableData2"
        v-if="tableData2.length>0"
        border
        stripe
        size="mini"
        :cell-style="{padding:'0'}"
        height="300px"
        tooltip-effect="dark"
        style="width: 100%;color:black">
      <el-table-column
          label="提示信息"
          prop="content">
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import {request} from "@/axios";

export default {
  name: "Close",
  data() {
    return {
      editForm:{
        closeDate:''
      },
      tableData: [],
      tableData2: [],

    }
  },
  methods: {
    // 表单提交
    submitForm() {
      console.log(":",this.editForm.closeDate)
      if(this.editForm.closeDate ===undefined || this.editForm.closeDate === ''){
        this.$message({
          message: '请选择关账日期',
          type: 'error'
        });
        return;
      }
      request.post('/repository/close/save',this.editForm).then(res => {

        let theData = res.data.data;
        console.log("theRes data:",theData)
        if(theData instanceof Array && theData.length > 0){
          this.tableData2 = theData
        }else {
          this.$message({
            message: (this.editForm.id ? '编辑' : '新增') + '成功!',
            type: 'success'
          });
          this.getList();
        }

      })
    },

    // 查询角色表单列表数据
    getList() {
      request.get('/repository/close/list').then(res => {
        this.tableData = res.data.data
      })
    },

    // 查询角色表单列表数据
    returnLast() {
      request.get('/repository/close/return').then(res => {
        this.$message({
          message:'回退成功!',
          type: 'success'
        });
        this.getList();

      })
    },
  },
  // 页面初始化时调用的方法
  created() {
    this.getList()
  }
}
</script>

<style scoped>
.el-pagination {
  float: right;

}
</style>