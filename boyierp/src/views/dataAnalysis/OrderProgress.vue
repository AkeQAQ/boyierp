<template>

  <el-container>
    <el-main class="elMain_my" style="padding-top: 0;padding-right: 0px">
      <el-form :inline="true" class="demo-form-inline elForm_my" >
        <el-form-item>
          <el-select size="mini" style="width: 120px" v-model="select" filterable @change="searchFieldChange" placeholder="请选择搜索字段">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>

          <!-- 列表界面-物料搜索 -->
          <el-autocomplete size="mini" v-if="selectedName === 'materialName'" clearable
                           style="width: 200px"
                           popper-class="my-autocomplete"

                           class="inline-input"
                           v-model="searchStr"
                           :fetch-suggestions="querySearch2"
                           :trigger-on-focus="false"
                           placeholder="请输入搜索内容"
                           @select="searchSelect"
                           @focus="searchMmaterialFocus()"
                           @keyup.enter.native="search()"

          >
          </el-autocomplete>

          <!-- 公司货号 -->
          <div v-if="selectedName === 'productNum'" :class=" 'el-input el-input--mini'" style="margin: 0 0">
            <input  @keyup.enter="search()" class="el-input__inner" style="width: 200px"  placeholder="请输入搜索内容"
                    v-model.lazy="searchStr">
            </input>
          </div>

          <!-- 品牌 -->
          <div v-if="selectedName === 'productBrand'" :class=" 'el-input el-input--mini'" style="margin: 0 0">
            <input  @keyup.enter="search()" class="el-input__inner" style="width: 200px"  placeholder="请输入搜索内容"
                    v-model.lazy="searchStr">
            </input>
          </div>

        </el-form-item>

        <el-popover
            placement="left"
            width="410"
            trigger="click">
          <ul v-for="(item,index) in manySearchArr">
            <li>
              <el-select style="width: 130px" size="mini" v-model="item.selectField" filterable  placeholder="请选择搜索字段">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>

              </el-select>
              <el-autocomplete size="mini" v-if="item.selectField === 'materialName'" clearable
                               style="width: 200px"
                               popper-class="my-autocomplete"
                               class="inline-input"
                               v-model="item.searchStr"
                               :fetch-suggestions="querySearch2"
                               :trigger-on-focus="false"
                               @select="searchManySelect($event,index)"
                               @focus="searchMmaterialFocus()"

                               placeholder="请输入搜索内容"

              >
              </el-autocomplete>

              <!-- 公司货号 -->
              <div v-if="item.selectField==='productNum'" :class=" 'el-input el-input--mini'" style="margin: 0 0">
                <input   class="el-input__inner" style="width: 200px"  placeholder="请输入搜索内容"
                        v-model.lazy="item.searchStr">
                </input>
              </div>

              <!-- 品牌 -->
              <div v-if="item.selectField==='productBrand'" :class=" 'el-input el-input--mini'" style="margin: 0 0">
                <input   class="el-input__inner" style="width: 200px"  placeholder="请输入搜索内容"
                        v-model.lazy="item.searchStr">
                </input>
              </div>

              <el-button type="danger" size="mini" icon="el-icon-delete" circle
                         @click="delSearch(index)"
              ></el-button>

            </li>
          </ul>
          <el-button type="primary" style="margin-left: 40px" size="mini" @click="addSearchItem()">添加额外搜索条件</el-button>

          <el-button slot="reference" type="info" style="padding: 0 0 ;margin-top: 20px;margin-left: -10px" size="mini" icon="el-icon-arrow-down" circle></el-button>

        </el-popover>


        <el-form-item >
          <el-select
              size ="mini"
              v-model="checkedBox"
              multiple
              collapse-tags
              style="margin-left: 0;width: 150px"
              placeholder="请选择状态">
            <el-option
                v-for="item in statusArr"
                :key="item.val"
                :label="item.name"
                :value="item.val">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item >
          <el-select
              size ="mini"
              v-model="checkedBox2"
              multiple
              collapse-tags
              style="margin-left: 0;width: 170px"
              placeholder="请选择状态">
            <el-option
                v-for="item in status2Arr"
                :key="item.val"
                :label="item.name"
                :value="item.val">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" icon="el-icon-search" @click="search()" type="success">搜索</el-button>
        </el-form-item>


      </el-form>

      <el-table
          ref="multipleTable"
          :data="tableData"
          v-loading = "tableLoad"
          element-loading-background = "rgba(255, 255, 255, .5)"
          element-loading-text = "加载中，请稍后..."
          border
          fit
          height="520px"
          :span-method="objectSpanMethod"
          :summary-method="getSummaries"
          show-summary
          size="mini"
          tooltip-effect="dark"
          style="width: 100%;color:black"
          :cell-style="{padding:'0',borderColor:'black'}"
          :header-cell-style="{borderColor:'black'}"
          :default-sort="{prop:'id',order:'descending'}"
          @selection-change="handleSelectionChange">

        <el-table-column
            label="订单号"
            prop="orderNum"
            width="80px"
            show-overflow-tooltip
        >
        </el-table-column>


        <el-table-column
            label="公司货号"
            prop="productNum"
            width="100"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            prop="productBrand"
            label="品牌"
            width="80px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="productColor"
            label="颜色"
            width="50px"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="orderNumber"
            label="订单数目"
            width="70px"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="materialId"
            label="物料编码"
            width="80px"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="materialName"
            label="物料名称"
            width="140px"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="calNum"
            label="应报数目"
            width="80px"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="preparedNum"
            label="已报备数目"
            width="90px"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="progressPercent"
            label="备料进度"
            width="100px"
            show-overflow-tooltip>
          <template slot-scope="scope">
            <el-progress :percentage="convertPercent(scope.row.progressPercent ) " :format="progressFormat(scope.row.progressPercent)"></el-progress>
          </template>
        </el-table-column>

        <el-table-column
            prop="inNum"
            label="入库数目"
            width="80px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            label="入库进度"
            width="100px"
            show-overflow-tooltip>
          <template slot-scope="scope">
            <el-progress :percentage="isNaN(parseInt(scope.row.inNum * 100 /scope.row.preparedNum))? 0 : parseInt(scope.row.inNum * 100 /scope.row.preparedNum)"
                         ></el-progress>
          </template>
        </el-table-column>

        <el-table-column
            prop="comment"
            label="备注"
            width="100px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="status"
            width="90px"
            label="订单状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status === 0" type="success">已审核</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===1" type="warning">暂存</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===2" type="danger">审核中</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===3" type="danger">重新审核</el-tag>
          </template>
        </el-table-column>

        <el-table-column
            prop="prepared"
            label="备料状态"
            width="90px"
            show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.prepared === 2" type="warning">备料确认</el-tag>
            <el-tag size="small" v-else="scope.row.prepared === 1" type="info">备料未确认</el-tag>
            <el-tag size="small" v-else-if="scope.row.prepared===0" type="success">备料已报(完成)</el-tag>
          </template>

        </el-table-column>

      </el-table>


      <!--价目列表 分页组件 -->
      <el-pagination

          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-sizes="[50, 200, 500, 1000]"
          :page-size="this.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total">
      </el-pagination>

    </el-main>

  </el-container>

</template>

<script>

// POI，因为响应输出字节流，和ajax 的请求不一样。
import {request} from "@/axios";
import {sysbaseUrl} from "@/axios";

import {request2} from "@/axios";

export default {
  name: 'OrderProgress',
  data() {
    return {

      // 多个搜索输入框
      manySearchArr:[{
        selectField:'materialName',
        searchStr:'',
      }],

      tableLoad:true,
      statusArr : [{'name':'暂存','val':1},{'name':'审核中','val':2},{'name':'已审核','val':0},{'name':'重新审核','val':3}],
      checkedBox:[1,2,3,0],

      status2Arr : [{'name':'备料已确认','val':2},{'name':'备料未确认','val':1},{'name':'备料完成(已报)','val':0}],
      checkedBox2:[2,1,0],

      // 搜索字段
      selectedName: 'materialName',// 搜索默认值
      options: [
        {value: 'materialName', label: '物料名称'},

        {value: 'productNum', label: '公司货号'},
        {value: 'productBrand', label: '品牌'}
      ],
      select: 'materialName', // 搜索默认值
      searchStr: '',
      searchStrList: [],
      searchField: '',

      // 分页字段
      currentPage: 1 // 当前页
      , pageSize: 50 // 一页多少条
      , total: 0 // 总共多少数据
      ,
      tableData: [],
      spanArr: [],
      pos: '',

      restaurants2: [], //

    }
  },

  methods: {
    searchMmaterialFocus(){
      this.loadMaterialAll()
    },

    searchSelect(item) {
      this.searchStr = item.name

    },

    loadMaterialAll() {
      request.post('/baseData/material/getSearchAllData').then(res => {
        this.restaurants2 = res.data.data
      })
    },

    querySearch2(queryString, cb) {
      var restaurants = this.restaurants2;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1) || (restaurant.id.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },

    /**
     * val 进度条的percentage值（接口的返回值）
     */
    convertPercent(val) {
      // 如果val值大于100，则返回100，否则返回原数值
      return val > 100 ? 100 : val
    },
    /**
     * val 进度条的percentage值（接口的返回值）
     */
    progressFormat(val) {
      return () => {
        return val+ '%'
      }
    },

      // 同ID的，单元格合并，数据库配合返回根据ID排序
    getSpanArr(data) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0
        } else {
          // 判断这一条和上一条id是否相同
          if (data[i].orderNum === data[i - 1].orderNum) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    objectSpanMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
       if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 2) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 3) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 4) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }

    },

    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0 ) {
          sums[index] = '求和';
          return;
        }
        if (index === 7 || index === 8|| index === 10) {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = sums[index].toFixed(2);
          } else {
            sums[index] = 'N/A';
          }

        }

      });

      return sums;
    },

    searchManySelect(item,index) {
      let theObj = this.manySearchArr[index];
      theObj.searchStr = item.name;
      console.log("manySearchArr:",this.manySearchArr)
    },
    delSearch(index){
      this.manySearchArr.splice(index,1)
    },
    addSearchItem(){
      let obj = {
        selectField:'productNum',
        searchStr:'',
      }
      this.manySearchArr.push(obj)
    },


    // 分页方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getList()

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getList()

    },
    handleSelectionChange(val) {
      console.log("多选框 val ", val)
      this.multipleSelection = []

      val.forEach(theId => {
        this.multipleSelection.push(theId.id)
      })
      console.log("多选框 选中的 ", this.multipleSelection)
    },

    search(){
      this.currentPage = 1
      this.getList()
    },
    // 查询价目表单列表数据
    getList() {
      this.tableLoad = true;
      let checkStr = this.checkedBox.join(",");
      let check2Str = this.checkedBox2.join(",");

      let url = '/produce/orderMaterialProgress/list?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&searchField="+this.select+
          "&&searchStatus="+checkStr+
          "&&searchStatus2="+check2Str;
      request.post(url,
          {'manySearchArr':this.manySearchArr,'searchStr':this.searchStr},
          null).then(res => {
          this.tableData = res.data.data.records
        this.getSpanArr(this.tableData)
        this.total = res.data.data.total
          this.tableLoad = false;
          this.$nextTick(() => {
          this.$refs['multipleTable'].doLayout();
        })
      }).catch(error=>{
        this.tableLoad = false;
        console.log("error:",error)
      })
    },


    searchFieldChange(item) {
      console.log("搜索字段改变:", item)
      this.selectedName = item
    },

    // el-table 单元格样式修改
    cellStyle() {
      return 'padding:0 0'
    },

  },
  created() {
    this.loadMaterialAll();
    this.getList()

  }

}

</script>

<style scoped>

.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}

.el-table{
  border: 1px solid black;
}
::v-deep .el-table tbody tr:hover > td {
  background-color: transparent;
}

.el-pagination {
  float: right;

}

.el-table--mini td {
  padding: 0 0;
}


.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

/deep/ .el-transfer-panel{
  width: 450px !important;
}

</style>