<template>

  <el-container>
    <el-main class="elMain_my">
      <el-form :inline="true" class="demo-form-inline elForm_my" >
        <el-form-item>
          <el-select size="mini" style="width: 120px" v-model="select" filterable @change="searchFieldChange" placeholder="请选择搜索字段" >
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
          <!-- 字段搜索框 -->
          <el-autocomplete size="mini" v-if="selectedName === 'materialName'" clearable
                           style="width: 300px"
                           popper-class="my-autocomplete"

                           class="inline-input"
                           v-model="searchStr"
                           :fetch-suggestions="queryMaterialSearchValide"
                           placeholder="请输入内容"
                           :trigger-on-focus="false"
                           @select="searchSelect"
                           @focus="searchMaterialFocus()"
          >
          </el-autocomplete>

          <!-- 字段搜索框 -->
          <el-autocomplete size="mini" v-if="selectedName === 'materialId'" clearable
                           style="width: 300px"
                           popper-class="my-autocomplete"

                           class="inline-input"
                           v-model="searchStr"
                           :fetch-suggestions="queryMaterialSearchValide"
                           placeholder="请输入内容"
                           :trigger-on-focus="false"
                           @select="searchSelect"
                           @focus="searchMaterialFocus()"
          >
          </el-autocomplete>
        </el-form-item>


        <el-form-item>

          <!-- 列表界面-日期搜索 -->
          <el-date-picker style="width: 130px;"
                          size="mini"
                          value-format="yyyy-MM-dd"
                          v-model="searchStartDate"
                          type="date"
                          clearable
                          placeholder="开始日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-date-picker style="width: 130px;"
                          size="mini"
                          value-format="yyyy-MM-dd"
                          v-model="searchEndDate"
                          type="date"
                          clearable
                          placeholder="结束日期">
          </el-date-picker>

        </el-form-item>

        <el-form-item >
          <el-select
              size ="mini"
              v-model="checkedBox"
              multiple
              collapse-tags
              style="margin-left: 0;"
              placeholder="请选择状态">
            <el-option
                v-for="item in statusArr"
                :key="item.val"
                :label="item.name"
                :value="item.val">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" icon="el-icon-search" @click="search()" type="success">搜索</el-button>
        </el-form-item>

      </el-form>

      <el-table
          show-summary
          v-loading = "tableLoad"
          element-loading-background = "rgba(255, 255, 255, .5)"
          element-loading-text = "加载中，请稍后..."
          height="520px"
          :summary-method="getSummaries"
          ref="multipleTable"
          :data="tableData"
          border
          size="mini"
          tooltip-effect="dark"
          style="width: 100%;color:black"
          :row-class-name="tableRowClassName"
          :cell-style="{padding:'0'}">
        <el-table-column
            type="selection"
            width="50">
        </el-table-column>
        <el-table-column
            label="物料编码"
            prop="materialId"

        >
        </el-table-column>

        <el-table-column
            prop="materialName"
            label="物料名称"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="status"
            label="状态"
            width="100px"
        >
          <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.status === 0" type="success">已审核</el-tag>
            <el-tag size="mini" v-else-if="scope.row.status===1" type="danger">暂存</el-tag>
            <el-tag size="mini" v-else-if="scope.row.status===2" type="danger">审核中</el-tag>
            <el-tag size="mini" v-else-if="scope.row.status===3" type="danger">重新审核</el-tag>
          </template>
        </el-table-column>


        <el-table-column
            prop="date"
            label="日期">
        </el-table-column>

        <el-table-column
            prop="docName"
            label="单据名称"
        >
        </el-table-column>

        <el-table-column
            prop="docNum"
            label="单据编号"
        >
        </el-table-column>

        <el-table-column
            prop="unit"
            label="基本单位"
            width="70px"
        >
        </el-table-column>

        <el-table-column
            prop="startNum"
            label="期初数量"
        >
        </el-table-column>

        <el-table-column
            prop="addNum"
            label="收入数量"
        >
        </el-table-column>

        <el-table-column
            prop="subNum"
            label="减少数量"
        >
        </el-table-column>

        <el-table-column
            prop="afterNum"
            label="结存数量"
        >
          <template slot-scope="scope">
            {{ scope.row.afterNum ==null? null :scope.row.afterNum.toFixed(2) }}
          </template>
        </el-table-column>

      </el-table>

      <!--价目列表 分页组件 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-sizes="[100, 200, 300, 10000]"
          :page-size="this.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total">
      </el-pagination>
    </el-main>

  </el-container>


</template>

<script>
import {request, request2} from "@/axios";
export default {
  name: "inOutDetail",
  data() {
    return {
      searchStartDate: new Date().format("yyyy-MM-dd"),
      searchEndDate: new Date().format("yyyy-MM-dd"),
      statusArr : [{'name':'暂存','val':1},{'name':'审核中','val':2},{'name':'已审核','val':0},{'name':'重新审核','val':3}],
      checkedBox:[1,2,3,0],
      // 搜索字段
      selectedName: 'materialName',// 搜索默认值
      options: [
        {value: 'materialName', label: '物料名称'},
        {value: 'materialId', label: '物料编码'}
      ],
      select: 'materialName', // 搜索默认值
      searchStr: '',
      searchField: '',
      restaurants: [],// 搜索框列表数据存放
      restaurants2: [],
      materialSearchDatas:[], // 用于搜索的建议框
      // 分页字段
      currentPage: 1 // 当前页
      , pageSize: 100 // 一页多少条
      , total: 0 // 总共多少数据
      ,
      tableData: [],
      tableLoad:false,
      multipleSelection: [] // 多选框数组
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (row.status === -1) {
        return 'start-row';
      }
      return '';
    },
    loadMaterialValideAll() {
      request.post('/baseData/material/getSearchAllData').then(res => {
        this.materialSearchDatas = res.data.data
      })
    },
    // 查询搜索框列表数据
    queryMaterialSearchValide(queryString, cb) {
      var restaurants = this.materialSearchDatas;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0) || (restaurant.id.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    searchSelect(item) {
      if(this.selectedName === 'materialName'){
        this.searchStr = item.name
      }else{
        this.searchStr = item.id
      }
      console.log("选中：", item);
    },

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
    search(){
      this.currentPage = 1;
      this.getList();
    },
    getList() {
      if(this.searchStartDate === '' || this.searchEndDate===''){
        this.$message({
          message: '时间不能为空!',
          type: 'error'
        });
        return;
      }
      if(this.checkedBox.length === 0){
        this.$message({
          message: '状态不能为空',
          type: 'error'
        });
        return;
      }
      this.tableLoad = true;

      let checkStr = this.checkedBox.join(",");
      console.log("多选框：",checkStr )
      request.get('/repository/inOutDetail/list', {
        params: {
          currentPage: this.currentPage
          , pageSize: this.pageSize
          , total: this.total
          , searchStr: this.searchStr
          , searchStartDate: this.searchStartDate
          , searchEndDate: this.searchEndDate
          , searchField: this.select
          , searchStatus:checkStr
        }
      }).then(res => {
        this.tableLoad = false;

        this.tableData = res.data.data.records
        this.total = res.data.data.total
        this.$nextTick(() => {
          this.$refs['multipleTable'].doLayout();
        })
      }).catch(error=>{
        this.tableLoad = false;
        console.log("error:",error)
      })
    },
    searchFieldChange(item) {
      this.selectedName = item
    },
    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '求和';
          return;
        }
        if (index === 8 || index === 9 || index === 10) {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = sums[index].toFixed(2);
          } else {
            sums[index] = 'N/A';
          }
        }

      });

      return sums;
    },
    searchMaterialFocus(){
      this.loadMaterialValideAll()
    },
  },
  // 页面初始化时调用的方法
  created() {
    this.getList()
    this.loadMaterialValideAll()
  }

}
</script>
<style scoped>

</style>
<!-- 不加scoped ，可以修改其他第三方组件的样式内容-->
<style >
.el-pagination {
  float: right;

}
.el-table .start-row {
  background: #cccccc;
}

</style>