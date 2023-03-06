<template>
  <!-- 打印入库单据24cm的适配宽度 -->
  <div style="width: 780px;" >
    <div v-for="oneDoc in tableData.content" >
      <div v-for="page in getPages(oneDoc)" :key="page">
        <!-- 分页 -->
        <div  class='tab_company_out'>
          <h3 style="font-size: 20px;margin-bottom: 5px">成  品  出  库  单</h3>

          <el-row :gutter="0" style="padding-bottom: 0px;margin-bottom: -10px;text-align: center">
            <el-col :span="4"><div class="grid-content bg-purple"></div>
              <time>日期：{{oneDoc.sendDate}}</time>
            </el-col>
            <el-col :span="15"><div class="grid-content bg-purple">
              <span>客户：{{oneDoc.customerName}}</span>
            </div>
            </el-col>
            <el-col :span="5"><div class="grid-content bg-purple">
              <span>单号：{{"CPCK"+oneDoc.id}}</span>
            </div>
            </el-col>
          </el-row>
          <table cellpadding='0' cellspacing='0' >
            <tr>
              <th width='26%'>产品编码</th>
              <th width='21%'>产品名称</th>
              <th width='7%'>单位</th>
              <th width='7%'>数量</th>
              <th width='8%'>含税单价</th>
              <th width='9%'>金额</th>
              <th width='23%'>备注</th>

            </tr>
            <!-- 每页显示onePageRow条数据 -->
            <tr v-for="(row,index) in oneDoc.rowList.slice((page-1)*onePageRow,page*onePageRow)" :key="index">
              <td style="text-align: left;padding-left: 8px">  {{row.productNum.length >16 ? row.productNum.substring(0,16):row.productNum}}</td>
              <td style="text-align: center">{{row.productName.length >16 ? row.productName.substring(0,16):row.productName}}</td>
              <td style="text-align: center">{{row.unit}}</td>
              <td style="text-align: center">{{row.num}}</td>
              <td style="text-align: center">{{row.price}}</td>
              <td style="text-align: center">{{(row.price * row.num).toFixed(2)}}</td>
              <td style="text-align: center"> {{row.comment!=null && row.comment.length >16 ? row.comment.substring(0,16):row.comment}}</td>
            </tr>
            <!-- 插入空白行 -->
            <template v-if="blankLines===true && oneDoc.rowList.slice((page-1)*onePageRow,page*onePageRow).length<onePageRow">
              <tr v-for="d in (onePageRow-oneDoc.rowList.slice((page-1)*onePageRow,page*onePageRow).length)" :key="`_${d}_`">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </template>
            <!-- page:当前页，pages最大页 -->
            <tr v-if="page==getPages(oneDoc)">
              <td style="text-align: center" colspan='1'>合计</td>
              <td style="text-align: center" colspan='2'>{{chineseTotal(oneDoc.totalAmount)}}</td>
              <td style="text-align: center" colspan='1'>{{oneDoc.totalNum}}</td>

              <td style="text-align: center" id='total' colspan='3'>{{oneDoc.totalAmount}}</td>
            </tr>

          </table>
          <el-row :gutter="0" style="padding-top: 0px;margin-bottom: 1px">
            <el-col :span="6"><div class="grid-content bg-purple"></div>
              <time>制单人：{{$store.state.user_info.userName}}</time>
            </el-col>
            <el-col :span="3"><div class="grid-content bg-purple">
              <span>仓库主管：</span>
            </div>
            </el-col>
            <el-col :span="3"><div class="grid-content bg-purple">
              <span>审核人：</span>
            </div>
            </el-col>
            <el-col :span="12"><div class="grid-content bg-purple">
              <span>送货人：</span>
            </div>
            </el-col>
          </el-row>
          <hr style="height: 2px;background-color: black"/>

          <el-row :gutter="0" style="padding-top: 0px;margin-bottom: 10px">
            <el-col :span="10" style="text-align: left"><div class="grid-content bg-purple"></div>
              <span>注：一式两联：第一联财务（白），第二联供应商（红）</span>
            </el-col>
            <el-col :span="14" style="text-align: right"><div class="grid-content bg-purple">
              <span>第{{page}}页，共{{getPages(oneDoc)}}页</span>
            </div>
            </el-col>

          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "EAprintSendOutGoodsBatch",
  // 制作打印模版组件时，props区域尽量保留。
  props: {
    // 每页多少行
    onePageRow: {
      type: Number,
      default: 6
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
      /*if(!this.tableData.rowList){
        console.log("rowList 无值")
        return 1;
      }*/
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
    },
    chineseTotal(totalAmount) {
      // 计算中文合计，如果忘记传入
      return this.getChineseNumber != null
          ? this.getChineseNumber(totalAmount)
          : "您还没有传入getChineseNumber";
    },
  },
  /*watch :{
    'tableData.totalAmount':{
      handler(newVal,oldVal){
        console.log("监听tableData.totalAmount.  old: , new :",oldVal,newVal)
      },
      deep:true
    }
  },*/

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