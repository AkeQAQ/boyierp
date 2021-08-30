<template>
  <div>
    <div v-for="page in pages" :key="page">
      <!-- 分页 -->
      <div class='tab_company_out'>
        <h3 style="font-size: 20px;margin-bottom: 10px">采  购  物  料  入  库  单</h3>

        <el-row :gutter="20" style="padding-bottom: 10px;text-align: center">
          <el-col :span="6"><div class="grid-content bg-purple"></div>
            <time>日期：{{tableData.buyInDate}}</time>
          </el-col>
          <el-col :span="6"><div class="grid-content bg-purple">
            <span>供应商：{{tableData.supplierName}}</span>
          </div>
          </el-col>
          <el-col :span="6"><div class="grid-content bg-purple">
            <span>供应商单据号：{{tableData.supplierDocumentNum}}</span>
          </div>
          </el-col>
          <el-col :span="6"><div class="grid-content bg-purple">
            <span>单据号：{{tableData.id}}</span>
          </div>
          </el-col>
        </el-row>
        <table cellpadding='0' cellspacing='0'>
          <tr>
            <th width='5%'>材料编号</th>
            <th width='25%'>材料名称</th>
            <th width='10%'>规格</th>
            <th width='8%'>订单号</th>
            <th width='12%'>计价数量</th>
            <th width='5%'>单位</th>
            <th width='8%'>单价</th>
            <th width='12%'>总金额</th>
            <th width='15%'>说明</th>
          </tr>
          <!-- 每页显示onePageRow条数据 -->
          <tr v-for="(row,index) in tableData.rowList.slice((page-1)*onePageRow,page*onePageRow)" :key="index">
            <td>{{row.id}}</td>
            <td>{{row.materialName}}</td>
            <td>{{row.specs}}</td>
            <td>{{row.orderNum}}</td>
            <td>{{row.num}}</td>
            <td>{{row.unit}}</td>
            <td>{{row.price}}</td>
            <td>{{(row.price * row.num).toFixed(2)}}</td>
            <td>{{row.comment}}</td>
          </tr>
          <!-- 插入空白行 -->
          <template v-if="blankLines===true && tableData.rowList.slice((page-1)*onePageRow,page*onePageRow).length<5">
            <tr v-for="d in (5-tableData.rowList.slice((page-1)*onePageRow,page*onePageRow).length)" :key="`_${d}_`">
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
          <!-- page:当前页，pages最大页 -->
          <tr v-if="page==pages">
            <td colspan='1'>合计</td>
            <td colspan='3'>{{chineseTotal}}</td>
            <td colspan='2'>{{tableData.totalNum}}</td>
            <td colspan='1'></td>

            <td id='total'>{{tableData.totalAmount}}</td>
            <td></td>
          </tr>
          <tr v-else>
            <td colspan='2'>合计</td>
            <td colspan='5'>(合计打印到最后一页)</td>
            <td id=''></td>
            <td></td>
          </tr>

        </table>
        <el-row :gutter="20" style="padding-top: 10px;margin-bottom: 10px">
          <el-col :span="6"><div class="grid-content bg-purple"></div>
            <time>制单人：{{tableData.createdUser}}</time>
          </el-col>
          <el-col :span="6"><div class="grid-content bg-purple">
            <span>仓库主管：</span>
          </div>
          </el-col>
          <el-col :span="6"><div class="grid-content bg-purple">
            <span>审核人：</span>
          </div>
          </el-col>
          <el-col :span="6"><div class="grid-content bg-purple">
            <span>送货人：</span>
          </div>
          </el-col>
        </el-row>
        <hr style="height: 2px;background-color: black"/>

        <el-row :gutter="20" style="padding-top: 10px;margin-bottom: 10px">
          <el-col :span="14" style="text-align: left"><div class="grid-content bg-purple"></div>
            <span>注：一式两联：第一联财务（白），第二联供应商（红）</span>
          </el-col>
          <el-col :span="7" style="text-align: right"><div class="grid-content bg-purple">
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
  name: "demo",
  // 制作打印模版组件时，props区域尽量保留。
  props: {
    // 接受的打印数据
   /* tableData: {
      type: Object,
      default() {
        return {
          id: 998,
          store_name: "测试店铺",
          created_at: "2018-06-06",
          total_amount: 35580,
          total_pv: 23231,
          detail: [
            {
              name: "商品A",
              item_unit: "40ML",
              item_size: "瓶",
              item_quantity: 5,
              item_price: 188,
              pv: 150,
              item_total: 5 * 188,
              item_total_pv: 5 * 150
            },
            {
              name: "商品A",
              item_unit: "40ML",
              item_size: "瓶",
              item_quantity: 5,
              item_price: 188,
              pv: 150,
              item_total: 5 * 188,
              item_total_pv: 5 * 150
            },
            {
              name: "商品A",
              item_unit: "40ML",
              item_size: "瓶",
              item_quantity: 5,
              item_price: 188,
              pv: 150,
              item_total: 5 * 188,
              item_total_pv: 5 * 150
            },
            {
              name: "商品A",
              item_unit: "40ML",
              item_size: "瓶",
              item_quantity: 5,
              item_price: 188,
              pv: 150,
              item_total: 5 * 188,
              item_total_pv: 5 * 150
            },
            {
              name: "商品A",
              item_unit: "40ML",
              item_size: "瓶",
              item_quantity: 5,
              item_price: 188,
              pv: 150,
              item_total: 5 * 188,
              item_total_pv: 5 * 150
            },
            {
              name: "商品A",
              item_unit: "40ML",
              item_size: "瓶",
              item_quantity: 5,
              item_price: 188,
              pv: 150,
              item_total: 5 * 188,
              item_total_pv: 5 * 150
            },
            {
              name: "商品A",
              item_unit: "40ML",
              item_size: "瓶",
              item_quantity: 5,
              item_price: 188,
              pv: 150,
              item_total: 5 * 188,
              item_total_pv: 5 * 150
            },
            {
              name: "商品A",
              item_unit: "40ML",
              item_size: "瓶",
              item_quantity: 5,
              item_price: 188,
              pv: 150,
              item_total: 5 * 188,
              item_total_pv: 5 * 150
            }
          ]
        };
      }
    },*/
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
  height: 20px;
  line-height: 20px;
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
  margin-right: 15px;
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
}

</style>