<template>
  <!-- 打印入库单据24cm的适配宽度 -->
  <div style="width: 780px;">
    <div v-for="page in pages" :key="page">
      <!-- 分页 -->
      <div  class='tab_company_out'>
        <h3 style="font-size: 20px;margin-bottom: 5px">生  产  领  料  单</h3>

        <el-row :gutter="0" style="padding-bottom: 0px;margin-bottom: -10px;text-align: center">
          <el-col :span="4"><div class="grid-content bg-purple"></div>
            <time>发料日期：{{tableData.pickDate}}</time>
          </el-col>
          <el-col :span="4"><div class="grid-content bg-purple">
            <span>收料部门：{{tableData.departmentName}}</span>
          </div>
          </el-col>
          <el-col :span="6"><div class="grid-content bg-purple">
            <span>单号：{{"SCLL"+tableData.id}}</span>
          </div>
          </el-col>
          <el-col :span="4"><div class="grid-content bg-purple">
            <span>生产序号：{{tableData.batchId}}</span>
          </div>
          </el-col>
          <el-col :span="4"><div class="grid-content bg-purple">
            <span>备注：{{tableData.comment}}</span>
          </div>
          </el-col>
        </el-row>
        <table cellpadding='0' cellspacing='0' >
          <tr>
            <th width='12%'>材料编号</th>
            <th width='34%'>材料名称</th>
            <th width='12%'>规格</th>
            <th width='10%'>计价数量</th>
            <th width='12%'>单位</th>
            <th width='20%'>备注</th>

          </tr>
          <!-- 每页显示onePageRow条数据 -->
          <tr v-for="(row,index) in tableData.rowList.slice((page-1)*onePageRow,page*onePageRow)" :key="index">
            <td style="text-align: left;padding-left: 8px">{{row.materialId}}</td>
            <td style="text-align: center">{{row.materialName.length >22 ? row.materialName.substring(0,22):row.materialName}}</td>
            <td style="text-align: center">{{row.specs.length >6 ? row.specs.substring(0,6):row.specs}}</td>
            <td style="text-align: center">{{row.num}}</td>
            <td style="text-align: center">{{row.unit}}</td>
            <td style="text-align: center">{{row.comment}}</td>
          </tr>
          <!-- 插入空白行 -->
          <template v-if="blankLines===true && tableData.rowList.slice((page-1)*onePageRow,page*onePageRow).length<onePageRow">
            <tr v-for="d in (onePageRow-tableData.rowList.slice((page-1)*onePageRow,page*onePageRow).length)" :key="`_${d}_`">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </template>
          <!-- page:当前页，pages最大页 -->
          <tr v-if="page==pages">
            <td style="text-align: center" colspan='1'>合计</td>
            <td style="text-align: center" colspan='2'></td>
            <td style="text-align: center" colspan='2'>{{tableData.totalNum}}</td>
            <td colspan='1'></td>
          </tr>

        </table>
        <el-row :gutter="0" style="padding-top: 0px;margin-bottom: 1px">
          <el-col :span="6"><div class="grid-content bg-purple"></div>
            <time>制单人：{{$store.state.user_info.userName}}</time>
          </el-col>
          <el-col :span="10"><div class="grid-content bg-purple">
            <span>仓库主管：</span>
          </div>
          </el-col>
          <el-col :span="6"><div class="grid-content bg-purple">
            <span>领料人：</span>
          </div>
          </el-col>
        </el-row>
        <hr style="height: 2px;background-color: black"/>

        <el-row :gutter="0" style="padding-top: 0px;margin-bottom: 10px">
          <el-col :span="13" style="text-align: left"><div class="grid-content bg-purple"></div>
            <span>注：一式两联：第一联财务（白），第二联供应商（红）</span>
          </el-col>
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
  name: "printPick",
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
    let totalNum = 0
    let totalAmount= 0
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