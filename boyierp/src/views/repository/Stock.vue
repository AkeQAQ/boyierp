<template>

  <el-container>
    <el-main>
      <el-form :inline="true" class="demo-form-inline">

        <el-form-item>
          <el-select size="mini" v-model="select" filterable @change="searchFieldChange" placeholder="请选择搜索字段" >
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
                           class="inline-input"
                           v-model="searchStr"
                           :fetch-suggestions="queryMaterialSearchValide"
                           placeholder="请输入内容"
                           @select="searchSelect"
          >
          </el-autocomplete>

          <!-- 字段搜索框 -->
          <el-autocomplete size="mini" v-if="selectedName === 'materialId'" clearable
                           class="inline-input"
                           v-model="searchStr"
                           :fetch-suggestions="queryMaterialSearchValide"
                           placeholder="请输入内容"
                           @select="searchSelect"
          >
          </el-autocomplete>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" icon="el-icon-search" @click="getStockList">搜索</el-button>
        </el-form-item>

      </el-form>

      <el-table
          show-summary
          :summary-method="getSummaries"
          ref="multipleTable"
          :data="tableData"
          border
          stripe
          size="mini"
          tooltip-effect="dark"
          style="width: 100%;color:black"
          :cell-style="{padding:'0'}"
          @selection-change="handleSelectionChange">
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
            prop="num"
            label="库存数量"

        >
        </el-table-column>

        <el-table-column
            prop="unit"
            label="基本单位"
            width="70px"
            >
        </el-table-column>


        <el-table-column
            prop="specs"
            label="规格型号"
            width="100px"
        >
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
import {request} from "@/axios";

export default {
  name: "stock",
  data() {
    return {
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
      multipleSelection: [] // 多选框数组
    }
  },
  methods: {
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
      this.getStockList()

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getStockList()

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
        this.multipleSelection.push(theId.id)
      })
      console.log("多选框 选中的 ", this.multipleSelection)
    },

    // 查询价目表单列表数据
    getStockList() {
      request.get('/repository/stock/list', {
        params: {
          currentPage: this.currentPage
          , pageSize: this.pageSize
          , total: this.total
          , searchStr: this.searchStr
          , searchField: this.select
        }
      }).then(res => {
        this.tableData = res.data.data.records
        this.total = res.data.data.total
        console.log("获取库存表单数据", res.data.data.records)
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
        if (index === 3 ) {
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
  },
  // 页面初始化时调用的方法
  created() {
    this.getStockList()
    this.loadMaterialValideAll()
  }

}
</script>

<style scoped>
.el-pagination {
  float: right;

}
</style>