

<template>

  <el-container>
    <el-main class="elMain_my">
      <!-- 入库单列表 -->
      <el-form :inline="true" class="demo-form-inline elForm_my" >
        <el-form-item>
          <el-select size="mini" v-model="select" filterable @change="searchFieldChange" placeholder="请选择搜索字段">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input size="mini"
                    placeholder="请输入搜索内容"
                    v-model="searchStr"
                    clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" icon="el-icon-search" @click="getList">搜索</el-button>
        </el-form-item>

        <el-form-item v-if="hasAuth('produce:craft:save')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('produce:craft:save')"
                     @click="add()"
          >添加
          </el-button>
        </el-form-item>


        <el-form-item v-if="hasAuth('produce:craft:real')">
          <el-button size="mini" icon="el-icon-s-order" type="success" v-if="hasAuth('produce:craft:real')"
                     @click="getSpreadDemo()"
          >设置模板
          </el-button>
        </el-form-item>

      </el-form>

      <el-table

          ref="multipleTable"
          :data="tableData"
          border
          fit
          size="mini"
          tooltip-effect="dark"
          style="width: 100%;color:black"
          :cell-style="{padding:'0'}"
          :default-sort="{prop:'id',order:'descending'}"
      >

        <el-table-column
            label="编号"
            prop="id"
            width="50px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            label="本厂货号"
            prop="companyNum"
            width="110px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            prop="customer"
            label="客户公司"
            show-overflow-tooltip>
        </el-table-column>


        <el-table-column
            prop="devLastUpdateDate"
            label="开发最后修改时间"
            width="150px"
        >
        </el-table-column>

        <el-table-column
            prop="devLastUpdateUser"
            label="开发最后修改人"
            width="110px"
        >
        </el-table-column>

        <el-table-column
            prop="lastUpdateDate"
            label="最终修改时间"
            width="150px"
        >
        </el-table-column>

        <el-table-column
            prop="lastUpdateUser"
            label="最终修改人"
            width="110px"
        >
        </el-table-column>

        <el-table-column
            prop="status"
            label="状态"
            width="120px"
        >
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status === 0" type="success">已最终确认</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===1" type="danger">开发未填写完成</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===2" type="danger">开发填写完成</el-tag>

          </template>
        </el-table-column>

        <el-table-column
            prop="action"
            label="操作"
            width="350px"
            fixed="right"
        >
          <template slot-scope="scope">

            <el-button type="text" size="small" @click="edit(scope.row.id)"
                       v-if="hasAuth('produce:craft:list') && scope.row.status != 1   ">查看开发内容
            </el-button>
            <el-button type="text" size="small" @click="realEdit(scope.row.id)"
                       v-if="hasAuth('produce:craft:list') && scope.row.status === 0   ">查看确认内容
            </el-button>

            <el-button type="text" size="small" @click="edit(scope.row.id)"
                       v-if="hasAuth('produce:craft:update') && scope.row.status === 1    ">开发编辑
            </el-button>
            <el-button type="text" size="small" @click="realEdit(scope.row.id)"
                       v-if="hasAuth('produce:craft:real') && scope.row.status === 2  ">确认编辑
            </el-button>

            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('produce:craft:valid')   && scope.row.status ===1   ">
              <template>
                <el-popconfirm @confirm="valid(scope.row.id)"
                               title="确定审核完成吗？"
                >
                  <el-button type="text" size="small" slot="reference">开发审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('produce:craft:returnValid')   && scope.row.status ===2   ">
              <template>
                <el-popconfirm @confirm="returnValid(scope.row.id)"
                               title="确定反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">开发反审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('produce:craft:realValid')   && scope.row.status ===2   ">
              <template>
                <el-popconfirm @confirm="realValid(scope.row.id)"
                               title="确定审核完成吗？"
                >
                  <el-button type="text" size="small" slot="reference">确认审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('produce:craft:returnRealValid')   && scope.row.status ===0   ">
              <template>
                <el-popconfirm @confirm="returnRealValid(scope.row.id)"
                               title="确定反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">确认反审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('produce:craft:del') && scope.row.status ===1   ">
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

      <!--价目列表 分页组件 -->
      <el-pagination

          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="this.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total">
      </el-pagination>
    </el-main>

  </el-container>

</template>

<script>

// POI，因为响应输出字节流，和ajax 的请求不一样。
import {request} from "@/axios";

import {request2} from "@/axios";

// 导入SpreadJS
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css";
import * as GC from "@grapecity/spread-sheets";
import "@grapecity/spread-sheets-vue";

export default {
  name: 'Craft',
  data() {
    return {
      // 搜索字段
      selectedName: 'companyNum',// 搜索默认值
      options: [
        {value: 'companyNum', label: '本厂货号'},
        {value: 'customer', label: '客户公司'}
      ],
      select: 'companyNum', // 搜索默认值
      searchStr: '',
      searchField: '',

      // 分页字段
      currentPage: 1 // 当前页
      , pageSize: 100 // 一页多少条
      , total: 0 // 总共多少数据
      ,
      addOrUpdate: 'save',
      tableData: [],

    }
  },
  methods: {
    // 最终编辑页面
    realEdit(id) {
      this.addOrUpdate = "update"
      this.$router.push({name:'LKCraft_real',params:{id:id}});
    },
    // 编辑页面
     edit(id) {
       this.addOrUpdate = "update"
       this.$router.push({name:'LKCraft',params:{id:id,addOrUpdate:this.addOrUpdate}});
    },
    // 点击添加按钮
    add() {
      this.addOrUpdate = "save"
      this.$router.push({name:'LKCraft',params:{addOrUpdate:this.addOrUpdate}});
    },
    // 点击设置模板按钮
    getSpreadDemo() {
      this.$router.push({name:'LKCraft_demo'});
    },

// 分页方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getList()

    }
    ,
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getList()

    },
    // 查询价目表单列表数据
    getList() {
      console.log("搜索字段:", this.select)
      request.get('/produce/craft/list', {
        params: {
          currentPage: this.currentPage
          , pageSize: this.pageSize
          , total: this.total
          , searchStr: this.searchStr
          , searchStartDate: this.searchStartDate
          , searchEndDate: this.searchEndDate
          , searchField: this.select
        }
      }).then(res => {
        this.tableData = res.data.data.records
        this.total = res.data.data.total
      })
    }
    ,
    // 审核
    realValid(id) {
      request.post('/produce/craft/realValid', id).then(res => {
        this.$message({
          message: '最终审核成功!',
          type: 'success'
        });

        this.getList()
        console.log("审核后重新加载页面")
      })
    },
    // 审核
    valid(id) {
      request.post('/produce/craft/valid', id).then(res => {
        this.$message({
          message: '审核成功!',
          type: 'success'
        });

        this.getList()
        console.log("审核后重新加载页面")
      })
    },
    // 反审核
    returnRealValid(id) {
      request.post('/produce/craft/returnRealValid', id).then(res => {
        this.$message({
          message: '反审核成功!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 反审核
    returnValid(id) {
      request.post('/produce/craft/returnValid', id).then(res => {
        this.$message({
          message: '反审核成功!',
          type: 'success'
        });
        this.getList()
      })
    },

    // 删除
    del(id) {
      request.post('/produce/craft/del', id).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getList()
        console.log("删除后重新加载页面")

      })
    }
    ,
    // 关闭弹窗处理动作
    handleClose2(done) {
      this.$refs['editForm2'].resetFields();
      console.log("关闭窗口")
      done();
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
    ,
    searchFieldChange(item) {
      console.log("搜索字段改变:", item)
      if (item === 'companyNum') {
        this.selectedName = item
      } else {
        this.selectedName = item

      }
    }
  },
  created() {
    this.getList()
  }

}

</script>

<style scoped>

.el-pagination {
  float: right;

}

.el-table--mini td {
  padding: 0 0;
}
.el-dialog__body{
  padding: 0 0;
}
</style>