<template>

  <el-container>
    <el-main class="elMain_my">
      <!-- 入库单列表 -->
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
                           @focus="searchMmaterialFocus()"
                           @keyup.enter.native="search()"

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
                           @focus="searchMmaterialFocus()"
                           @keyup.enter.native="search()"

          >
          </el-autocomplete>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" icon="el-icon-search" @click="search()" type="success">搜索</el-button>
        </el-form-item>

        <el-form-item v-if="hasAuth('externalAccount:repository:stock:list')">
          <el-dropdown   @command="expChange">
            <el-button  icon="el-icon-download" size="mini" >
              导出<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="all">导出当前条件全部</el-dropdown-item>
              <el-dropdown-item command="currentList">导出当前页</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item>
          <el-button @click="preViewPrint()" size="mini" icon="el-icon-printer" type="primary"
          >打印预览
          </el-button>
        </el-form-item>


      </el-form>

      <el-table
          show-summary
          :summary-method="getSummaries"
          ref="multipleTable"
          :data="tableData"
          border
          height="520px"
          size="mini"
          tooltip-effect="dark"
          style="width: 100%;color:black"
          :cell-style="cellClass"
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="50">
        </el-table-column>
        <el-table-column
            label="物料编码"
            prop="materialId"
            width="200px"

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
            width="100px"
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

        <el-table-column
            prop="latestPriceDate"
            label="最近购买时间"
            width="100px"
        >
        </el-table-column>

        <el-table-column
            prop="latestPickDate"
            label="最近领料时间"
            width="100px"
        >
        </el-table-column>


        <el-table-column
            prop="noPickNum"
            label="投产未领数量"
            width="120px"
        >
          <template slot-scope="scope">
            <el-popover
                placement="bottom"
                width="800"
                trigger="click">
              <el-table height="300px" :data="scope.row.noPickNums">
                <el-table-column width="100" property="orderNum" label="订单号"></el-table-column>
                <el-table-column width="120" property="productNum" label="工厂货号"></el-table-column>
                <el-table-column width="120" property="productBrand" label="品牌"></el-table-column>
                <el-table-column width="100" property="batchId" label="批次号"></el-table-column>
                <el-table-column width="100" property="batchNumber" label="批次号数量"></el-table-column>
                <el-table-column width="70" property="dosage" label="用量"></el-table-column>
                <el-table-column width="100" property="num" label="未领数量"></el-table-column>

              </el-table>
              <el-button  slot="reference" type="text">{{scope.row.noPickNum}}</el-button>
            </el-popover>

          </template>
        </el-table-column>

        <el-table-column
            prop="noInNum"
            label="已报未入库数量"
            width="120px"
        >
          <template slot-scope="scope">
            <el-popover
                placement="bottom"
                width="700"
                trigger="click">
              <el-table height="300px" :data="scope.row.noInNums">
                <el-table-column width="100" property="orderNum" label="订单号"></el-table-column>
                <el-table-column width="120" property="productNum" label="工厂货号"></el-table-column>
                <el-table-column width="120" property="productBrand" label="品牌"></el-table-column>
                <el-table-column width="100" property="orderNumber" label="订单数量"></el-table-column>
                <el-table-column width="100" property="preparedNum" label="已报备数量"></el-table-column>
                <el-table-column width="100" property="inNum" label="入库数量"></el-table-column>

              </el-table>
              <el-button  slot="reference" type="text">{{scope.row.noInNum}}</el-button>
            </el-popover>

          </template>
        </el-table-column>

        <el-table-column
            prop="needNum"
            label="未投产需要数量"
            width="120px"
        >
          <template slot-scope="scope">
            <el-popover
                placement="bottom"
                width="700"
                trigger="click">
              <el-table height="300px" :data="scope.row.noProductionNums">
                <el-table-column width="100" property="orderNum" label="订单号"></el-table-column>
                <el-table-column width="120" property="productNum" label="工厂货号"></el-table-column>
                <el-table-column width="120" property="productBrand" label="品牌"></el-table-column>
                <el-table-column width="100" property="orderNumber" label="订单数量"></el-table-column>
                <el-table-column width="70" property="dosage" label="用量"></el-table-column>
                <el-table-column width="100" property="needNum" label="需要数量"></el-table-column>

              </el-table>
              <el-button  slot="reference" type="text">{{scope.row.needNum}}</el-button>
            </el-popover>

          </template>
        </el-table-column>

      </el-table>

      <el-dialog
          title=""
          :visible.sync="dialogVisiblePrint"
          width="65%"
          class="elDialog_print_my"
          :before-close="printClose"
      >
        <el-button v-if="dialogVisiblePrint"
                   @click="printDemo"
                   v-focus ref="printBtn"
                   size="mini" icon="el-icon-printer" type="primary">打印
        </el-button>
        <vue-easy-print tableShow ref="easyPrint">
          <template slot-scope="func">
            <print :tableData="tableData" :getChineseNumber="func.getChineseNumber"></print>
          </template>
        </vue-easy-print>

      </el-dialog>

      <!--价目列表 分页组件 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-sizes="[50, 100, 200, 1000]"
          :page-size="this.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total">
      </el-pagination>
    </el-main>

    <!-- 导出功能 -->
    <export-excel-common ref="myChild" :exportExcelInfo="exportExcelInfo" :tableData="tableData" :exportExcelArry="exportExcelArry"></export-excel-common>



  </el-container>


</template>

<script>
import {request, request2} from "@/axios";
import vueEasyPrint from "vue-easy-print";
import print from "@/views/printModule/printStock";
import exportExcelCommon from "@/views/common/ExportExcelCommon";

export default {
  name: "EAstock",
  // 引入打印模块基础组件和该打印模块的模板页面
  components: {
    vueEasyPrint,
    print,
    exportExcelCommon
  },
  data() {
    return {
      dialogVisiblePrint:false,

      // vue 前端的 导出table 数据功能
      //导出表格字段及formatter信息
      exportExcelArry: [{
        prop: 'materialId',
        label: '物料编码',
        formatterFlag: false
      },
        {
          prop: 'materialName',
          label: '物料名称',
          formatterFlag: false
        }
        ,{
          prop: 'num',
          label: '库存数量',
          formatterFlag: false
        },
        {
          prop: 'unit',
          label: '基本单位',
          formatterFlag: false
        }
        ,{
          prop: 'specs',
          label: '规格型号',
          formatterFlag: false
        }
      ],
      //导出excel表格id及excel名称
      exportExcelInfo: {
        excelId: 'record-table',
        excelName: '库存列表.xlsx'
      },
      //需要导出的table数据
      tableAllData: [],

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
      , pageSize: 50 // 一页多少条
      , total: 0 // 总共多少数据
      ,
      tableData: [],
      multipleSelection: [] // 多选框数组
    }
  },
  methods: {

    tableRowClassName({row, rowIndex}) {
      row.seqNum = rowIndex + 1;

      let stockNum = this.tableData[row.seqNum-1].num ==null?0:this.tableData[row.seqNum-1].num;
      if( (parseFloat(this.tableData[row.seqNum-1].needNum) +  parseFloat(this.tableData[row.seqNum-1].noPickNum) ) <  (parseFloat (stockNum) + parseFloat (this.tableData[row.seqNum-1].noInNum))){
        console.log("warning_row")
        return 'warning-row';
      }
      return '';
    },

    cellClass({ row, column,rowIndex,columnIndex }) {

      if(columnIndex===7){
        // 1. 最近领料时间是空，或者现在时间>最近领料时间+60天

        if(row.latestPickDate!=null && row.latestPickDate!=undefined) {
          let pickDate = row.latestPickDate;
          let yyMMddArr = pickDate.split("-");
          let pickDateTimeStamp = new Date(yyMMddArr[0],yyMMddArr[1]-1,yyMMddArr[2]).getTime();

          let nowDateTimeStamp = new Date().getTime()

          if ((nowDateTimeStamp - pickDateTimeStamp) >= (24 * 60 * 60 * 1000 * 60)) {
            return {padding: '0', "background-color": "#e6a23c"}
          }
        }else{
          return {padding: '0', "background-color": "#e6a23c"}
        }
      }


      },
    // 打印按钮事件
    printDemo() {
      this.$refs.easyPrint.print()
    },
    // 关闭打印弹窗弹窗处理动作
    printClose(done) {
      this.$refs.easyPrint.tableShow = false;
      done();
    },

    preViewPrint() {
      if (this.tableData) {
        console.log("打印时的easyPrint：", this.$refs.easyPrint)
        console.log("打印时的editForm：", this.tableData)
        if (this.$refs.easyPrint) {

          this.$refs.easyPrint.tableData = this.tableData

        }
        this.dialogVisiblePrint = true
      } else {
        this.$message({
          message: '没有内容!',
          type: 'error'
        });
      }
    },
    expChange(item) {
      console.log("导出:",item)
      if (item === 'currentList') {
        this.exportCurrent()
      } else if(item === 'all'){
        this.exportAll()
      }
    },
    // 导出按钮
    exportExcel () {
      this.$refs.myChild.exportExcel();
    },
    exportCurrent() {

      request2.post('/externalAccount/repository/stock/export?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&total="+this.total+
          "&&searchStr="+this.searchStr+
          "&&searchField="+this.select
          ,null,{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'库存当前页.xlsx')
      }).catch()
    },
    // 导出列表数据- 服务端写出字节流到浏览器，进行保存
    exportAll() {

      request2.post('/externalAccount/repository/stock/export?'+
          "searchStr="+this.searchStr+
          "&&searchField="+this.select
          ,null,{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'库存全部列表.xlsx')
      }).catch()
    },
    // POI- 服务端写出字节流到浏览器，进行保存
    saveFile(data,name){
      try {
        const blobUrl = window.URL.createObjectURL(data)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.download = name
        a.href = blobUrl
        a.click()

      } catch (e) {
        alert('保存文件出错')
      }
    },
    loadMaterialValideAll() {
      request.post('/externalAccount/baseData/material/getSearchAllData').then(res => {
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
      }

      else{
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
        if(!this.multipleSelection.some(item=>item==theId.id)){
          this.multipleSelection.push(theId.id)
        }
      })
      console.log("多选框 选中的 ", this.multipleSelection)
    },

    search(){
      this.currentPage = 1;
      this.getStockList();
    },
    // 查询价目表单列表数据
    getStockList() {
      request.get('/externalAccount/repository/stock/list', {
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
        this.$nextTick(() => {
          this.$refs['multipleTable'].doLayout();
        })
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
    searchMmaterialFocus(){
      console.log("物料搜索框聚焦")
      this.loadMaterialValideAll()
    },
  },
  // 页面初始化时调用的方法
  created() {
    this.getStockList()
    this.loadMaterialValideAll()
  }// 自定义指令，，insert在DOM加入的时候才生效
  , directives: {
    // 声明自定义指令v-focus
    focus: {
      // v-foucs指令的钩子函数
      inserted: function (el, binding) {
        console.log("聚焦...")
        el.focus();
      },
    },
  }

}
</script>

<style>
.el-table .warning-row {
  background: #e6aaaa;
}
</style>
<style scoped>
.el-pagination {
  float: right;

}

</style>