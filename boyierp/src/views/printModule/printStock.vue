<template>
  <!-- 打印入库单据21cm的适配宽度 -->
  <div style="width: 760px;margin-left: 15px;margin-top: 0px">
    <div v-for="page in pages" :key="page">
      <!-- 分页 -->
      <div  class='tab_company_out'>
        <h3 style="font-size: 20px;margin-bottom: 0px;padding-top: 20px">及  时  库  存</h3>

        <table cellpadding='0' cellspacing='0' >
          <tr>
            <th width='12%'>物料编码</th>
            <th width='25%'>物料名称</th>
            <th width='9%'>库存数量</th>
            <th width='7%'>基本单位</th>
            <th width='9%'>规格型号</th>
            <th width='10%' >最近购买时间</th>
            <th width='10%'>最近领料时间</th>
            <th width='6%'>投产未领数量</th>
            <th width='6%'>已报未入库量</th>
            <th width='6%'>未投需要数量</th>

          </tr>
          <!-- 每页显示onePageRow条数据 -->
          <tr v-for="(row,index) in tableData.slice((page-1)*onePageRow,page*onePageRow)" :key="index">
            <td style="text-align: left;padding-left: 8px">{{row.materialId}}</td>
            <td style="text-align: center;font-size:12px">{{row.materialName.length >14 ? row.materialName.substring(0,14):row.materialName}}</td>
            <td style="text-align: center">{{row.num.toFixed(3) }}</td>
            <td style="text-align: center">{{row.unit.length >4 ? row.unit.substring(0,4):row.unit}}</td>
            <td style="text-align: center">{{row.specs.length >5 ? row.specs.substring(0,5):row.specs}}</td>
            <td style="text-align: center">{{row.latestPriceDate}}</td>
            <td style="text-align: center">{{row.latestPickDate}}</td>
            <td style="text-align: center">{{row.noPickNum}}</td>
            <td style="text-align: center">{{row.noInNum}}</td>
            <td style="text-align: center">{{row.needNum}}</td>

          </tr>
          <!-- 插入空白行 -->
         <template v-if="blankLines===true && tableData.slice((page-1)*onePageRow,page*onePageRow).length<onePageRow">
            <tr v-for="d in (onePageRow-tableData.slice((page-1)*onePageRow,page*onePageRow).length)" :key="`_${d}_`">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>

            </tr>
          </template>

        </table>
        <el-row :gutter="0" style="padding-top: 0px;margin-bottom: 10px">
          <el-col :span="6" style="text-align: right"><div class="grid-content bg-purple">
            <span>打印日期：{{new Date().toLocaleDateString()}}  </span>
          </div>
          </el-col>
          <el-col :span="18" style="text-align: right"><div class="grid-content bg-purple">
            <span>第{{page}}页，共{{pages}}页</span>
          </div>
          </el-col>

        </el-row>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "print",
  // 制作打印模版组件时，props区域尽量保留。
  props: {
    // 每页多少行
    onePageRow: {
      type: Number,
      default: 28
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
      if(!this.tableData){
        console.log("tableData 无值")
        return 1;
      }

      // 求当前数据能打印的页数
      var pages_ = Math.ceil(
          this.tableData.length / this.onePageRow
      ); // 向上取整数
      return pages_ <= 0 ? 1 : pages_;
    },
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
  font-size: 10px;
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
  height: 32px;
  font-size: 5px;
  line-height: 32px;
}
table tr td:last-of-type,
table tr th:last-of-type {
  border-right: 1px solid #000;
}
table tr th {
  border-top: 1px solid #000;
  border-left: 1px solid #000;
  height: 22px;
  line-height: 22px;
  font-size: 5px;
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