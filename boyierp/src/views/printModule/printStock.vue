<template>
  <!-- 打印入库单据24cm的适配宽度 -->
  <div style="width: 850px;margin-left: 50px;margin-top: 20px">
    <div v-for="page in pages" :key="page">
      <!-- 分页 -->
      <div  class='tab_company_out'>
        <h3 style="font-size: 20px;margin-bottom: 5px">及  时  库  存</h3>

        <table cellpadding='0' cellspacing='0' >
          <tr>
            <th width='20%'>物料编码</th>
            <th width='40%'>物料名称</th>
            <th width='10%'>库存数量</th>
            <th width='20%'>基本单位</th>
            <th width='10%'>规格型号</th>

          </tr>
          <!-- 每页显示onePageRow条数据 -->
          <tr v-for="(row,index) in tableData.slice((page-1)*onePageRow,page*onePageRow)" :key="index">
            <td style="text-align: left;padding-left: 8px">{{row.materialId}}</td>
            <td style="text-align: center">{{row.materialName}}</td>
            <td style="text-align: center">{{row.num}}</td>
            <td style="text-align: center">{{row.unit}}</td>
            <td style="text-align: center">{{row.specs}}</td>
          </tr>
          <!-- 插入空白行 -->
         <template v-if="blankLines===true && tableData.slice((page-1)*onePageRow,page*onePageRow).length<onePageRow">
            <tr v-for="d in (onePageRow-tableData.slice((page-1)*onePageRow,page*onePageRow).length)" :key="`_${d}_`">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </template>

        </table>
        <el-row :gutter="20" style="padding-top: 0px;margin-bottom: 10px">
          <el-col :span="6" style="text-align: right"><div class="grid-content bg-purple">
            <span>打印日期：{{new Date().toLocaleDateString()}}  </span>
          </div>
          </el-col>
          <el-col :span="3" style="text-align: right"><div class="grid-content bg-purple">
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
      default: 45
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
table tr th {
  border-top: 1px solid #000;
  border-left: 1px solid #000;
  height: 22px;
  line-height: 22px;
  font-size: 12px;
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