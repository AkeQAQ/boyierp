<template>
  <!-- 打印入库单据21cm的适配宽度 -->
  <div style="width: 780px;padding-left: 20px;padding-right: 15px">
      <!-- 分页 -->
      <div  class='tab_company_out'>
        <h3 style="font-size: 24px;margin-bottom: 5px;margin-top: 20px">博艺鞋业供应商对账单</h3>

        <table cellpadding='0' cellspacing='0' >
          <tr >
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px"  > 供应商名称：</td>
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px" > {{tableData.supplierName}}</td>
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px" > 供应商编号：</td>
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px" >{{tableData.supplierId}}</td>

          </tr>
          <tr >
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px"colspan='1'> 结账期</td>
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px" colspan='1'> {{jiezhangqiDate}}</td>
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px" colspan='1'> 对账单号：</td>
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px" colspan='1'>{{tableData.summaryDate+"-"+tableData.id}}</td>

          </tr>
          <tr >
            <td style="text-align: left;width: 100%;padding-left:2px;font-size: 15px;height: 16px"colspan='4'> 结账内容：</td>
          </tr>
          <tr >
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px"colspan='1'> 采购入库</td>
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px" colspan='1'> {{tableData.buyInAmount}}</td>
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px" colspan='1'> 采购退货：</td>
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px" colspan='1'>{{tableData.buyOutAmount}}</td>
          </tr>
          <tr >
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px;font-weight: bold" colspan='1'> 货款小计</td>
            <td style="text-align: left;width: 75%;padding-left:2px;font-size: 15px;height: 16px" colspan='3'> {{tableData.buyNetInAmount}}</td>
          </tr>
          <tr >
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px"colspan='1'> 赔鞋：</td>
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px" colspan='1'> {{tableData.payShoesAmount}}</td>
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px" colspan='1'> 检测费：</td>
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px" colspan='1'>{{tableData.testAmount}}</td>
          </tr>
          <tr >
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px"colspan='1'> 罚款：</td>
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px" colspan='1'> {{tableData.fineAmount}}</td>
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px" colspan='1'> 调整：</td>
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px" colspan='1'>{{tableData.changeAmount}}</td>
          </tr>
          <tr >
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px"colspan='1'> 补税点：</td>
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px" colspan='1'> {{tableData.taxSupplement}}</td>
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px" colspan='1'> 扣税点：</td>
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px" colspan='1'>{{tableData.taxDeduction}}</td>
          </tr>
          <tr >
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px"colspan='1'> 抹零：</td>
            <td style="text-align: left;width: 75%;padding-left:2px;font-size: 15px;height: 16px" colspan='3'> {{tableData.roundDown}}</td>
          </tr>
          <tr >
            <td style="text-align: left;width: 25%;padding-left:2px;font-size: 15px;height: 16px;font-weight: bold"colspan='1'> 扣（补）款小计</td>
            <td style="text-align: left;width: 75%;padding-left:2px;font-size: 15px;height: 16px" colspan='3'>{{tableData.otherTotalAmount}} </td>
          </tr>
          <tr >
            <td style="text-align: left;width: 100%;padding-left:2px;font-weight: bold;font-size: 18px"colspan='4'> 月应付货款：{{tableData.needPayAmount}}</td>
          </tr>
          <tr>
            <td style="text-align: left;width: 100%;padding-left:2px;font-weight: bold;font-size: 18px" colspan='4'> 大写：{{tableData.needPayAmount<0?'负':''}}{{chineseTotal}}</td>
          </tr>

        </table>

        <el-row :gutter="0" style="padding-top: 0px;margin-bottom: 1px">
          <el-col :span="18"><div class="grid-content bg-purple">
            <h3 style="font-size: 20px;padding-top: 18px;text-align: left">供应商代表签字：</h3>
          </div>
          </el-col>
          <el-col :span="6"><div style="padding-top: 40px" class="grid-content bg-purple"></div>
            <span style="font-size: 12px;text-align: left">制单人：{{$store.state.user_info.userName}}</span>
          </el-col>

        </el-row>

      </div>
  </div>
</template>


<script>
export default {
  name: "printSummary",
  // 制作打印模版组件时，props区域尽量保留。
  props: {

    getChineseNumber: Function, // 求数字的中文写法，从easyPrint组件传入
    tableData: {
      needPayAmount:''

    }
  },
  data: {
    td:{}
  },
  computed: {
    jiezhangqiDate(){
      let summaryDate = this.tableData.summaryDate;
      let split =summaryDate.split("-");
      return split[0]+'年'+split[1]+'月'
    },
    chineseTotal() {
      let num =this.tableData.needPayAmount;

      if(num < 0){
        num = this.tableData.needPayAmount * -1;
      }
      // 计算中文合计，如果忘记传入
       return this.getChineseNumber != null
           ? this.getChineseNumber(num)
           : "您还没有传入getChineseNumber";
    },

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
  margin: 0;

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
  height: 30px;
  line-height: 30px;
}
table tr td:last-of-type,
table tr th:last-of-type {
  border-right: 1px solid #000;
}
table tr th {
  border-top: 1px solid #000;
  border-left: 1px solid #000;
  height: 28px;
  line-height: 28px;
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
  text-align: left;width: 50%;
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