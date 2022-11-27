<template>
  <!-- 打印入库单据24cm的适配宽度 -->
  <div style="width: 682px;margin-left: 50px;margin-top: 0px">
    <div v-for="oneDoc in tableData.content" >
      <div v-for="page in getPages(oneDoc)" :key="page">
      <!-- 分页 -->
      <div  class='tab_company_out'>
        <h1 style="font-size: 28px;margin-bottom: 5px;margin-top: 30px">博 艺 鞋 业 鞋 材 报 价 单</h1>
        <h3 style="font-size: 15px;margin-bottom: 5px;text-align: left;font-weight: bold">鞋材供应商：{{oneDoc.supplierName}}</h3>
        <table cellpadding='0' cellspacing='0' >
          <tr>
            <th width='44%'>材料名称</th>
            <th width='10%'>规格</th>
            <th width='10%'>计量单位</th>
            <th width='11%'>材料商报价(不含税)</th>
            <th width='11%'>本厂确认价(不含税)</th>
            <th width='14%'>备注</th>

          </tr>
          <!-- 每页显示onePageRow条数据 -->
          <tr v-for="(row,index) in oneDoc.rowList.slice((page-1)*onePageRow,page*onePageRow)" :key="index">
            <td style="text-align: left;padding-left: 8px;height: 48px;line-height: 48px;">{{row.materialName}}</td>
            <td style="text-align: center;height: 48px;line-height: 48px;">{{row.specs == null ? '':(row.specs.length >8 ? row.specs.substring(0,8):row.specs)}}</td>
            <td style="text-align: center;height: 48px;line-height: 48px;">{{row.unit}}</td>
            <td style="text-align: center;height: 48px;line-height: 48px;"></td>
            <td style="text-align: center;height: 48px;line-height: 48px;"></td>
            <td style="text-align: center;height: 48px;line-height: 48px;">{{row.materialId}}</td>
          </tr>
          <!-- 插入空白行 -->
          <template v-if="blankLines===true && oneDoc.rowList.slice((page-1)*onePageRow,page*onePageRow).length<onePageRow">
            <tr v-for="d in (onePageRow-oneDoc.rowList.slice((page-1)*onePageRow,page*onePageRow).length)" :key="`_${d}_`">
              <td style ="height: 48px;line-height: 48px;"></td>
              <td style ="height: 48px;line-height: 48px;"></td>
              <td style ="height: 48px;line-height: 48px;"></td>
              <td style ="height: 48px;line-height: 48px;"></td>
              <td style ="height: 48px;line-height: 48px;"></td>
              <td style ="height: 48px;line-height: 48px;"></td>
            </tr>
          </template>

        </table>
        <h3 style="font-size: 15px;margin-bottom: 5px;text-align: left;height: 28px;line-height: 28px;">开票补税点：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%      </h3>
        <h3 style="font-size: 15px;margin-bottom: 5px;text-align: left;height: 28px;line-height: 28px;">价格生效日期：           </h3>
        <h3 style="font-size: 15px;margin-bottom: 5px;text-align: left;height: 28px;line-height: 28px;">结账方式：              </h3>
        <h3 style="font-size: 15px;margin-bottom: 5px;text-align: left;height: 28px;line-height: 28px;">材料质量要求：已检测为标准</h3>
        <h3 style="font-size: 10px;margin-bottom: 5px;text-align: left;text-decoration: underline;height: 20px;line-height: 20px;">注：如因供应商所送物料于封样有偏差（规格，数量等）造成客户罚款，一切责任与损失由供应商负责。另货款按9折结算，半年后付款</h3>
        <h3 style="font-size: 15px;margin-top: 30px;text-align: left;height: 28px;line-height: 28px;">审核：                </h3>
        <h3 style="font-size: 15px;margin-top: 30px;text-align: left;height: 28px;line-height: 28px;">审批：                </h3>
      </div>
    </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "printNoPriceForeignMaterial",
  // 制作打印模版组件时，props区域尽量保留。
  props: {
    // 每页多少行
    onePageRow: {
      type: Number,
      default: 13
    },
    // 是否插入空白行
    blankLines: {
      type: Boolean,
      default: true
    },
    getChineseNumber: Function, // 求数字的中文写法，从easyPrint组件传入
    tableData: {"content":[]}
  },
  data: {
    td:{}
  },
  computed: {
    pages() {
      var pages_ = 0;
      for (let i = 0; i < this.tableData.content.length; i++) {
        pages_+= Math.ceil(
            this.tableData.content[i].rowList.length / this.onePageRow
        ); // 向上取整数
      }

      return pages_ <= 0 ? 1 : pages_;
    },
  },
  methods:{
    getPages(oneDoc){
      var pages_ = 0;
      pages_= Math.ceil(
          oneDoc.rowList.length / this.onePageRow
      ); // 向上取整数

      return pages_ <= 0 ? 1 : pages_;
    }
  },
  created() {
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
  height: 48px;
  line-height: 48px;
}
table tr td:last-of-type,
table tr th:last-of-type {
  border-right: 1px solid #000;
}
table tr th {
  border-top: 1px solid #000;
  border-left: 1px solid #000;
  height: 48px;
  line-height: 48px;
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