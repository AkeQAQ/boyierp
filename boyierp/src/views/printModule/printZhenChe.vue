<template>
  <!-- 打印入库单据24cm的适配宽度 -->
  <div style="width: 765px;">
    <div v-for="page in pages" :key="page">
      <!-- 分页 -->
      <div  class='tab_company_out'>
        <h3 style="font-size: 20px;margin-bottom: 0px">针  车  计  划  领  料  单</h3>

        <table cellpadding='0' cellspacing='0'  style="padding: 0 0">
          <tr>
            <td width='25%' style="text-align: center;font-size: 20px;font-weight: bold" >{{ tableData.rowList[page -1].productBrand }}</td>
            <td width='25%' style="text-align: center;font-size: 18px;font-weight: bold" >{{tableData.rowList[page-1].productNum}}</td>
            <td width='12%' style="text-align: center;font-size: 18px;font-weight: bold">{{tableData.rowList[page-1].productColor}}</td>
            <td width='25%' style="text-align: center;font-size: 18px;font-weight: bold">单号:{{tableData.rowList[page-1].batchId}}</td>
            <td width='13%' style="text-align: center;font-size: 18px;font-weight: bold">数量:{{tableData.rowList[page-1].totalNum}}</td>

          </tr>

        </table>
        <table cellpadding='0' cellspacing='0' style="padding: 0 0" >

          <tr>
            <td width='50%' style="text-align: center;font-size: 18px">物料名称</td>
            <td width="10.5%" style="text-align: center;font-size: 18px">标准用量</td>
            <td width="13%" style="text-align: center;font-size: 18px">单位</td>
            <td width="13.75%" style="text-align: center;font-size: 18px">应发用量</td>
            <td width="12%" style="text-align: center;font-size: 18px">实发用量</td>

          </tr>

          <tr v-for="(row,index) in tableData.rowList[page-1].subList" :key="index">
            <td width='50%' style="text-align: center;font-size: 16px;font-weight: bold" v-if="(row.materialId+':'+row.materialName).length < 25">{{row.materialId}}:{{row.materialName}}</td>
            <td width="50%" style="text-align: center;font-size: 13px ;font-weight: bold" v-if="(row.materialId+':'+row.materialName).length >= 25">{{row.materialId}}:{{row.materialName}}</td>
            <td width="10.5%" style="text-align: center;font-size: 16px">{{row.dosage}}</td>
            <td width="13%" style="text-align: center;font-size: 16px">{{row.materialUnit}}</td>
            <td width="13.75%" style="text-align: center;font-size: 18px">{{row.needNum}}</td>
            <td width="12%" style="text-align: center;font-size: 16px"></td>

          </tr>

        </table>

        <el-row :gutter="0" style="padding-top: 0px;margin-bottom: 1px">
          <el-col :span="6"><div class="grid-content bg-purple"></div>
            <time>制单人：{{$store.state.user_info.userName}}</time>
          </el-col>
          <el-col :span="7"><div class="grid-content bg-purple">
            <span>打印日期：{{new Date().toLocaleDateString()}} {{ (new Date()).toLocaleTimeString()}}  </span>
          </div>
          </el-col>
        </el-row>


      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "printZhenChe",
  // 制作打印模版组件时，props区域尽量保留。
  props: {
    // 每页多少行
    onePageRow: {
      type: Number,
      default: 1
    },
    // 是否插入空白行
    blankLines: {
      type: Boolean,
      default: true
    },
    getChineseNumber: Function, // 求数字的中文写法，从easyPrint组件传入
    tableData: {
    }
  },
  data: {
    td:{}
  },
  computed: {
    pages() {
      if(!this.tableData.rowList){
        console.log("rowList 无值")
        return 1;
      }

      // 求当前数据能打印的页数
      var pages_ = Math.ceil(
          this.tableData.rowList.length / this.onePageRow
      ); // 向上取整数
      console.log("计算pages:",pages_)
      console.log("tableData:",this.tableData)
      return pages_ <= 0 ? 1 : pages_;
    },
    chineseTotal() {
      // 计算中文合计，如果忘记传入
      return this.getChineseNumber != null
          ? this.getChineseNumber(this.tableData.totalAmount)
          : "您还没有传入getChineseNumber";
    }
  },
  created() {
    console.log("传入参数:",this.tableData)
  }
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  list-style-type: none;
  font-family: "微软雅黑";
  font-size: 12px;
}
.tab_company_out {
  text-align: center;
  width: 100%;
  margin: auto;
  page-break-after: always;
}
h3 {
  font-size: 14px;
}
/*.dan {
  text-align: center;
  position: relative;
}*/
.dan span {
  position: absolute;
  right: 0;
}
p {
  overflow: hidden;
  padding: 10px 0;
}
p span {
  float: left;
}
p span ins {
  text-decoration: underline;
}
p time {
  float: right;
}
table {
  width: 100%;
  padding-top: 10px;
  border: none;
  border-bottom: 1px solid #000;
}
table tr td {
  border: 1px solid #000;
  border-bottom: none;
  border-right: none;
  height: 28px;
  line-height: 28px;
}
table tr td:last-of-type,
table tr th:last-of-type {
  border-right: 1px solid #000;
}
td {
  font-size: 18px;
}
table tr th  {
  border-top: 1px solid #000;
  border-left: 1px solid #000;
  height: 28px;
  line-height: 28px;
  font-size: 18px;
}
table tr th:nth-child(2) {
  width: 0;
}
.lu {
  display: inline-block;
  padding-top: 10px;
}
.lu li {
  float: left;
  text-align: left;
}
.lu li label {
  width: 100px;
  display: inline-block;
}
.lu li:last-of-type {
  margin-right: 0;
}

@media print {
    body{
      text-align: center;
    }
    table{
      table-layout:auto!important;
      width:100%!important;
    }
    th,td{
      display: table-cell !important;
    }
    .cell{
      width:100%!important;
    }
}

</style>