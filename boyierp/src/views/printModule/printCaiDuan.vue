<template>
  <!-- 打印入库单据24cm的适配宽度 -->
  <div style="width: 765px;">
    <div v-for="page in pages" :key="page">
      <!-- 分页 -->
      <div  class='tab_company_out'>
        <h3 style="font-size: 20px;margin-bottom: 0px">裁  断  计  划  领  料  单</h3>

        <table cellpadding='0' cellspacing='0'  style="padding: 0 0">
          <tr>
            <td width='25%' style="text-align: center;font-size: 15px" >本厂货号:</td>
            <td width='15%' style="text-align: center;font-size: 18px;font-weight: bold" >{{tableData.rowList[page-1].productNum}}</td>
            <td width='10%' style="text-align: center;font-size: 15px">日期</td>
            <td width='30%' style="text-align: center;font-size: 18px"></td>
            <td width='10%' style="text-align: center;font-size: 15px">单号</td>
            <td width='10%' style="text-align: center;font-size: 18px">{{tableData.rowList[page-1].batchId}}</td>
          </tr>
          <tr>
            <td colspan="1" style="text-align: center;font-size: 20px;font-weight: bold" >{{ tableData.rowList[page -1].productBrand }}</td>
            <td colspan="1" style="text-align: center;font-size: 15px" >{{tableData.rowList[page-1].productColor}}</td>
            <td colspan="4" style="text-align: center;font-size: 18px">配 码 明 细</td>
          </tr>

        </table>
        <table cellpadding='0' cellspacing='0' style="padding: 0 0" >
          <tr >
            <td  width="25%" style="text-align: center;font-size: 15px;">客户货号:</td>
            <td width="5%" style="text-align: center;font-size: 15px">数量</td>
            <td width="5%" style="text-align: center;font-size: 15px">34</td>
            <td width="5%" style="text-align: center;font-size: 15px">35</td>
            <td width="5%" style="text-align: center;font-size: 15px">36</td>
            <td width="5%" style="text-align: center;font-size: 15px">37</td>
            <td width="5%" style="text-align: center;font-size: 15px">38</td>
            <td width="5%" style="text-align: center;font-size: 15px">39</td>
            <td width="5%" style="text-align: center;font-size: 15px">40</td>
            <td width="5%" style="text-align: center;font-size: 15px">41</td>
            <td width="5%" style="text-align: center;font-size: 15px">42</td>
            <td width="5%" style="text-align: center;font-size: 15px">43</td>
            <td width="5%" style="text-align: center;font-size: 15px">44</td>
            <td width="5%" style="text-align: center;font-size: 15px">45</td>
            <td width="5%" style="text-align: center;font-size: 15px">46</td>
            <td width="5%" style="text-align: center;font-size: 15px">47</td>

          </tr>
          <tr>
            <td  width="25%" style="text-align: center;font-size: 18px">{{tableData.rowList[page-1].customerNum}}</td>
            <td width="5%" style="text-align: center;font-size: 18px">{{tableData.rowList[page-1].totalNum}}</td>
            <td width="5%" style="text-align: center;font-size: 18px">{{tableData.rowList[page-1].size34==0?"":tableData.rowList[page-1].size34}}</td>
            <td width="5%" style="text-align: center;font-size: 18px">{{tableData.rowList[page-1].size35==0?"":tableData.rowList[page-1].size35}}</td>
            <td width="5%" style="text-align: center;font-size: 18px">{{tableData.rowList[page-1].size36==0?"":tableData.rowList[page-1].size36}}</td>
            <td width="5%" style="text-align: center;font-size: 18px">{{tableData.rowList[page-1].size37==0?"":tableData.rowList[page-1].size37}}</td>
            <td width="5%" style="text-align: center;font-size: 18px">{{tableData.rowList[page-1].size38==0?"":tableData.rowList[page-1].size38}}</td>
            <td width="5%" style="text-align: center;font-size: 18px">{{tableData.rowList[page-1].size39==0?"":tableData.rowList[page-1].size39}}</td>
            <td width="5%" style="text-align: center;font-size: 18px">{{tableData.rowList[page-1].size40==0?"":tableData.rowList[page-1].size40}}</td>
            <td width="5%" style="text-align: center;font-size: 18px">{{tableData.rowList[page-1].size41==0?"":tableData.rowList[page-1].size41}}</td>
            <td width="5%" style="text-align: center;font-size: 18px">{{tableData.rowList[page-1].size42==0?"":tableData.rowList[page-1].size42}}</td>
            <td width="5%" style="text-align: center;font-size: 18px">{{tableData.rowList[page-1].size43==0?"":tableData.rowList[page-1].size43}}</td>
            <td width="5%" style="text-align: center;font-size: 18px">{{tableData.rowList[page-1].size44==0?"":tableData.rowList[page-1].size44}}</td>
            <td width="5%" style="text-align: center;font-size: 18px">{{tableData.rowList[page-1].size45==0?"":tableData.rowList[page-1].size45}}</td>
            <td width="5%" style="text-align: center;font-size: 18px">{{tableData.rowList[page-1].size46==0?"":tableData.rowList[page-1].size46}}</td>
            <td width="5%" style="text-align: center;font-size: 18px">{{tableData.rowList[page-1].size47==0?"":tableData.rowList[page-1].size47}}</td>

          </tr>
          <tr>
            <td colspan="16"></td>
          </tr>

          <tr>
            <td colspan="4" style="text-align: center;font-size: 18px">皮料名称</td>
            <td colspan="2" style="text-align: center;font-size: 18px">标准用量</td>
            <td colspan="3" style="text-align: center;font-size: 18px">应发用量</td>
            <td colspan="3" style="text-align: center;font-size: 18px">实发用量</td>
            <td colspan="4" style="text-align: center;font-size: 15px">备注</td>

          </tr>

          <tr v-for="(row,index) in tableData.rowList[page-1].subList" :key="index">
            <td colspan="4" style="text-align: center;font-size: 16px;font-weight: bold" v-if="(row.materialId+':'+row.materialName).length < 25">{{row.materialId}}:{{row.materialName}}</td>
            <td colspan="4" style="text-align: center;font-size: 13px ;font-weight: bold" v-if="(row.materialId+':'+row.materialName).length >= 25">{{row.materialId}}:{{row.materialName}}</td>
            <td colspan="2" style="text-align: center;font-size: 16px">{{row.dosage}}</td>
            <td colspan="3" style="text-align: center;font-size: 18px">{{row.needNum}}</td>
            <td colspan="3" style="text-align: center;font-size: 16px"></td>
            <td colspan="4"  style="text-align: center;font-size: 16px" v-if="index===0" rowspan='3'></td>

          </tr>

        </table>

        <el-row :gutter="0" style="padding-top: 0px;margin-bottom: 1px">
          <el-col :span="6"><div class="grid-content bg-purple"></div>
            <time>制单人：{{$store.state.user_info.userName}}</time>
          </el-col>
          <el-col :span="6"><div class="grid-content bg-purple">
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
  name: "printCaiduan",
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