<template>

  <el-container>
    <el-main class="elMain_my">
      <el-divider content-position="left">货期七天内的物料特急区</el-divider>

      <el-table
          show-summary
          ref="multipleTable"
          :data="tableData"
          border
          height="520px"
          size="mini"
          tooltip-effect="dark"
          style="width: 100%;color:black">
        <el-table-column
            label="物料编码"
            prop="materialId"
            width="200px"

        >
        </el-table-column>

        <el-table-column
            prop="materialName"
            label="物料名称"
            width="300px"

            show-overflow-tooltip>
        </el-table-column>


        <el-table-column
            prop="needNum"
            label="需要数量"
            width="100px"
        >
        </el-table-column>

        <el-table-column
            prop="stockNum"
            label="库存数量"
            width="100px"
        >

        </el-table-column>

        <el-table-column
            prop="unit"
            label="基本单位"
            width="100px"
        >
        </el-table-column>


        <el-table-column
            prop="details"
            label="明细信息"
            width="200px"
        >
          <template slot-scope="scope">
            <el-popover
                placement="bottom"
                width="450"
                trigger="click">
              <el-table height="300px" :data="scope.row.details">
                <el-table-column width="100" property="orderNum" label="订单号"></el-table-column>
                <el-table-column width="120" property="productNum" label="工厂货号"></el-table-column>
                <el-table-column width="120" property="productBrand" label="品牌"></el-table-column>
                <el-table-column width="100" property="orderNumber" label="订单数量"></el-table-column>

              </el-table>
              <el-button  slot="reference" type="text">明细信息</el-button>
            </el-popover>

          </template>
        </el-table-column>

      </el-table>

    </el-main>


  </el-container>


</template>

<script>
import {request, request2} from "@/axios";

export default {
  name: "MaterialDeadLineView",
  components: {
  },
  data() {
    return {
      tableData: [],
    }
  },
  methods: {

    // 查询价目表单列表数据
    getStockList() {
      request.get('/analysis/materialDeadLineView').then(res => {
        this.tableData = res.data.data
        this.$nextTick(() => {
          this.$refs['multipleTable'].doLayout();
        })
      })
    },
  },
  // 页面初始化时调用的方法
  created() {
    this.getStockList()
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