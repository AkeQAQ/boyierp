<template>

  <el-container>
    <el-main class="elMain_my" style="padding-top: 0;padding-right: 0px">
      <!-- 入库单列表 -->
      <el-form :inline="true" class="demo-form-inline elForm_my" >
        <el-form-item>
          <el-select size="mini" style="width: 150px" v-model="select" filterable @change="searchFieldChange" placeholder="请选择搜索字段">
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
          <!-- 列表界面-工厂型号搜索 -->
          <el-autocomplete size="mini" v-if="selectedName==='produceProductConstituentId'"
                           style="width: 200px"
                           clearable
                           class="inline-input"
                           @clear="clearProductNunAndBrand()"
                           v-model="searchStr"
                           :fetch-suggestions="querySearch"
                           placeholder="请输入搜索内容"
                           @select="searchSelect"
                           @focus="searchProductNumFocus()"
                           @keyup.enter.native="search()"

          >
          </el-autocomplete>

        </el-form-item>

<!--        <el-popover
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
              <el-autocomplete size="mini" v-if="item.selectField==='produceProductConstituentId'"
                               style="width: 200px"
                               popper-class="my-autocomplete"
                               clearable
                               class="inline-input"
                               v-model="item.searchStr"
                               :fetch-suggestions="querySearch"
                               placeholder="请输入搜索内容"

                               @select="searchManySelect($event,index)"
                               @focus="searchProductNumFocus()"
                               @keyup.enter.native="search()"

              >
              </el-autocomplete>

              <el-button type="danger" size="mini" icon="el-icon-delete" circle
                         @click="delSearch(index)"
              ></el-button>

            </li>
          </ul>
          <el-button type="primary" style="margin-left: 40px" size="mini" @click="addSearchItem()">添加额外搜索条件</el-button>

          <el-button slot="reference" type="info" style="padding: 0 0 ;margin-top: 20px;margin-left: -10px" size="mini" icon="el-icon-arrow-down" circle></el-button>

        </el-popover>-->

        <el-form-item>

          <!-- 列表界面-日期搜索 -->
          <el-date-picker style="width: 125px"
                          size="mini"
                          value-format="yyyy-MM-dd"
                          v-model="searchStartDate"
                          type="date"
                          clearable
                          placeholder="开始日期">
          </el-date-picker>

        </el-form-item>

        <el-form-item>
          <el-date-picker style="width: 125px"
                          size="mini"
                          value-format="yyyy-MM-dd"
                          v-model="searchEndDate"
                          type="date"
                          clearable
                          placeholder="结束日期">
          </el-date-picker>

        </el-form-item>

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

        <el-form-item>
          <el-button size="mini" icon="el-icon-search" @click="search()" type="success">搜索</el-button>
        </el-form-item>


        <el-form-item v-if="hasAuth('costOfLabour:costOfLabour:save')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('costOfLabour:costOfLabour:save')"
                     @click="addReturnMaterial()"

          >新增
          </el-button>
        </el-form-item>

        <el-form-item v-if="hasAuth('costOfLabour:costOfLabour:valid')">
          <el-popconfirm @confirm="statusPassBatch()" title="确定审核吗？">
            <el-button size="mini" icon="el-icon-success" :disabled="this.multipleSelection.length === 0 " type="danger"
                       slot="reference">批量审核
            </el-button>
          </el-popconfirm>
        </el-form-item>

        <el-form-item v-if="hasAuth('costOfLabour:costOfLabour:export')" style="margin-left: 0">
          <el-dropdown @command="expChange">
            <el-button icon="el-icon-download" size="mini" >
              导出<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="all">导出当前条件全部</el-dropdown-item>
              <el-dropdown-item command="currentList">导出当前页</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>

      </el-form>

      <el-table
          :row-style="rowClass"

          ref="multipleTable"
          :data="tableData"
          v-loading = "tableLoad"
          element-loading-background = "rgba(255, 255, 255, .5)"
          element-loading-text = "加载中，请稍后..."
          :span-method="objectSpanMethod"
          border
          fit
          height="520px"

          :summary-method="getSummaries"
          show-summary
          size="mini"
          tooltip-effect="dark"
          style="width: 100%;color:black"
          :cell-style="{padding:'0',borderColor:'black'}"
          :header-cell-style="{borderColor:'black'}"
          :default-sort="{prop:'id',order:'descending'}"
          @select="handleSelectionChange"
          @select-all="selectAll"
      >
        <el-table-column
            type="selection"
            width="50">
        </el-table-column>
        <el-table-column
            label="编号"

            prop="id" width="70px "
        >
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click=" edit(scope.row.id)"
            >{{ scope.row.id }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
            label="工价类型"
            prop="costOfLabourTypeName"
            width="100px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            prop="priceDate"
            label="价格日期"
            width="90px"
        >
        </el-table-column>

        <el-table-column
            label="工厂型号"
            prop="productNum"
            width="110px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            label="品牌"
            prop="productBrand"
            width="110px"
            show-overflow-tooltip
        >
        </el-table-column>


        <el-table-column
            prop="status"
            width="100px"
            label="状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status === 0" type="success">已审核</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===1" type="warning">暂存</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===2" type="danger">审核中</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===3" type="danger">重新审核</el-tag>
          </template>
        </el-table-column>


        <el-table-column
            label="总和价格"
            prop="totalPrice"
            width="110px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            label="核算价格"
            prop="prePrice"
            width="110px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            label="盈亏"
            width="100px"
        >
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.totalPrice === scope.row.prePrice" type="warning">正常</el-tag>
            <el-tag size="small" v-else-if="scope.row.totalPrice ==='' || scope.row.prePrice === '' || scope.row.totalPrice ===null || scope.row.prePrice === null" type="danger">无法计算</el-tag>
            <el-tag size="small" v-else-if="scope.row.totalPrice*1 < scope.row.prePrice*1  " type="success">盈利</el-tag>
            <el-tag size="small" v-else-if="scope.row.totalPrice*1 > scope.row.prePrice *1" type="info">亏损</el-tag>

          </template>
        </el-table-column>

        <el-table-column
            label="计算的片数价格"
            prop="calPiecesPrice"
            width="110px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            label="保底价格"
            prop="lowPrice"
            width="110px"
            show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
            label="实际价格"
            prop="realPrice"
            width="110px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            prop="reason"
            label="备注"
        >
        </el-table-column>

        <el-table-column
            prop="action"
            label="操作"
            width="120px"
            fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row.id)"
                       v-if="hasAuth('costOfLabour:costOfLabour:update') || (hasAuth('costOfLabour:costOfLabour:list') && scope.row.status != 1 )   ">{{ scope.row.status === 1 ? '编辑' : '查看' }}
            </el-button>


            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('costOfLabour:costOfLabour:valid')  && (scope.row.status === 2 || scope.row.status === 3)   ">

              <template>
                <el-popconfirm @confirm="statusPass(scope.row.id)"
                               title="确定设置审核通过吗？"
                >
                  <el-button type="text" size="small" slot="reference">审核通过</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('costOfLabour:costOfLabour:valid')  && scope.row.status ===0  ">
              <template>
                <el-popconfirm @confirm="statusReturn(scope.row.id)"
                               title="确定反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">反审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('costOfLabour:costOfLabour:del')  && scope.row.status ===1  "></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('costOfLabour:costOfLabour:del') && scope.row.status ===1   ">
              <template>
                <el-popconfirm @confirm="del(scope.row.id)"
                               title="确定删除吗？"
                >
                  <el-button type="text" size="small" slot="reference">删除</el-button>
                </el-popconfirm>
              </template>
            </el-button>


          </template>
        </el-table-column>

      </el-table>

      <!-- 打印弹窗 -->
<!--      <el-dialog
          title=""
          :visible.sync="dialogVisiblePrint"
          width="55%"
          style="padding-top: 0"
          :before-close="printClose"
      >
        <el-button v-if="dialogVisiblePrint"
                   @click="printDemo"
                   v-focus ref="printBtn"
                   size="mini" icon="el-icon-printer" type="primary">打印
        </el-button>
        <vue-easy-print tableShow ref="easyPrint">
          <template slot-scope="func">
            <print :tableData="editForm" :getChineseNumber="func.getChineseNumber"></print>
          </template>
        </vue-easy-print>

      </el-dialog>-->

      <!-- 退料弹窗 -->

      <el-dialog
          title="工价信息"
          :visible.sync="dialogVisible"
          :before-close="handleClose"
          fullscreen
          @opened="dialogOpend()"
      >
        <el-form style="width: 100%;margin-bottom: -20px;margin-top: -30px;align-items: center"
                 size="mini" :inline="true"
                 label-width="100px"
                 :model="editForm" :rules="rules" ref="editForm"
                 class="demo-editForm">

          <el-form-item label="单据编号" prop="id" style="margin-bottom: 0">
            <el-input style="width: 150px" :disabled=true placeholder="保存自动生成" v-model="editForm.id">
            </el-input>
          </el-form-item>


          <el-form-item v-if="false" prop="produceProductConstituentId" style="margin-bottom: 0">
            <el-input v-model="editForm.produceProductConstituentId"></el-input>
          </el-form-item>
          <el-form-item label="型号品牌" prop="productNum" style="margin-bottom: 10px">
            <!-- 搜索框 -->
            <el-autocomplete
                :disabled="this.editForm.status!=1"
                style="width: 250px"
                class="inline-input"
                v-model="editForm.productNum"
                :fetch-suggestions="querySearch"
                placeholder="请输入工厂型号品牌"
                @select="handleSelect"
                @change="moveMouse"
                @focus="searchProductNumFocus()"
                clearable
            >
            </el-autocomplete>
          </el-form-item>

          <el-form-item v-if="false" prop="costOfLabourTypeId" style="margin-bottom: 0">
            <el-input v-model="editForm.costOfLabourTypeId"></el-input>
          </el-form-item>
          <el-form-item label="工价类型" prop="costOfLabourTypeName" style="margin-bottom: 10px">
            <!-- 搜索框 -->
            <el-autocomplete
                :disabled="this.editForm.status!=1"
                style="width: 150px"
                class="inline-input"
                v-model="editForm.costOfLabourTypeName"
                :fetch-suggestions="querySearch2"
                placeholder="请选择工价类型"
                @select="handleSelect2"
                @change="moveMouse2"
                @focus="searchCostOfLabourTypeFocus()"
                clearable
            >
            </el-autocomplete>
          </el-form-item>

          <el-form-item label="工价日期" prop="priceDate">
            <el-date-picker :disabled="this.editForm.status!=1" style="width: 150px"
                            value-format="yyyy-MM-dd"
                            v-model="editForm.priceDate"
                            type="date"
                            clearable
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item  label="备注" prop="comment" style="padding: -20px 0 ;margin-bottom: -20px">
            <el-input :disabled="this.editForm.status!=1"  size="mini" clearable style="width: 150px" v-model="editForm.comment">
            </el-input>
          </el-form-item>

          <el-form-item v-if="hasAuth('costOfLabour:costOfLabour:save')">
            <el-dropdown   @command="action">
              <el-button  icon="el-icon-edit-outline" size="mini" type="success">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="save" v-show="hasAuth('costOfLabour:costOfLabour:save') && this.editForm.status===1" >
                  提交单据</el-dropdown-item>
                <el-dropdown-item command="subReturn" v-show="hasAuth('costOfLabour:costOfLabour:save') && (this.editForm.status===2 || this.editForm.status===3)">
                  撤销</el-dropdown-item>
                <el-dropdown-item command="addNew" v-show="hasAuth('costOfLabour:costOfLabour:save') ">
                  新增</el-dropdown-item>
                <el-dropdown-item command="copy" v-show="hasAuth('costOfLabour:costOfLabour:save') ">
                  复制</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>

<!--          <el-form-item >
            <el-button size="mini" @click="preViewPrint()" icon="el-icon-printer" type="primary"
            >打印预览
            </el-button>

          </el-form-item>-->

        </el-form>
        <el-divider content-position="left">明细信息</el-divider>

        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddDetails"
                   v-show="this.editForm.status===1">获取工序
        </el-button>

        <el-table
            :data="editForm.rowList"
            :row-class-name="rowClassName"
            @selection-change="handleDetailSelectionChange"
            ref="tb"
            height="500"
            size="mini"
            :cell-style="cellStyle"
            fit
            show-summary
            :summary-method="getDetailSummaries"
        >
          <el-table-column type="selection" width="80" align="center"/>
          <el-table-column label="序号" align="center" prop="seqNum" width="50"></el-table-column>

          <el-table-column v-show="true" label="工价外键ID" align="center" prop="foreignId" width="100">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" v-model="editForm.rowList[scope.row.seqNum-1].foreignId"></el-input>
            </template>
          </el-table-column>

          <el-table-column v-show="true" label="工序ID" align="center" prop="costOfLabourProcessesId" width="100">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" v-model="editForm.rowList[scope.row.seqNum-1].costOfLabourProcessesId"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="工序名称" align="center" prop="processesName" width="300">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" v-model="editForm.rowList[scope.row.seqNum-1].processesName"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="保底价格" align="center" prop="lowPrice" width="100">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" v-model="editForm.rowList[scope.row.seqNum-1].lowPrice"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="片数价格" align="center" prop="piecesPrice" width="100">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" v-model="editForm.rowList[scope.row.seqNum-1].piecesPrice"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="片数" align="center" width="100" prop="pieces">
            <template slot-scope="scope">
              <el-input
                  @input="changeNum(scope.row.seqNum)"
                  :disabled="editForm.status!=1" size="mini" v-model="editForm.rowList[scope.row.seqNum-1].pieces"/>
            </template>
          </el-table-column>

          <el-table-column label="计算价格(保底/片数选最大)" align="center" width="250" prop="calPrice">
            <template slot-scope="scope">
              <el-input  :disabled="true" size="mini" v-model="editForm.rowList[scope.row.seqNum-1].calPrice"/>
            </template>
          </el-table-column>

          <el-table-column label="实际价格" align="center" width="150" prop="realPrice">
            <template slot-scope="scope">
              <el-input  :disabled="editForm.status!=1" size="mini" v-model="editForm.rowList[scope.row.seqNum-1].realPrice"/>
            </template>
          </el-table-column>

          <el-table-column label="原因备注" align="center" width="200" prop="reason">
            <template slot-scope="scope">
              <el-input  :disabled="editForm.status!=1" size="mini" v-model="editForm.rowList[scope.row.seqNum-1].reason"/>
            </template>
          </el-table-column>

        </el-table>

      </el-dialog>

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

      <!-- 导出功能 -->
      <export-excel-common ref="myChild" :exportExcelInfo="exportExcelInfo" :tableData="tableData" :exportExcelArry="exportExcelArry"></export-excel-common>

    </el-main>

  </el-container>

</template>

<script>

// POI，因为响应输出字节流，和ajax 的请求不一样。
import {request} from "@/axios";


// 引入打印基础组件，和打印模块print页面
import vueEasyPrint from "vue-easy-print";
import print from "@/views/printModule/printReturn";
import exportExcelCommon from"../common/ExportExcelCommon"
import {request2} from "@/axios";

export default {
  name: 'CostOfLabour',
  // 引入打印模块基础组件和该打印模块的模板页面
  components: {
    vueEasyPrint,
    print,
    exportExcelCommon
  },
  data() {
    return {
      // 多个搜索输入框
      manySearchArr:[{
        selectField:'produceProductConstituentId',
        searchStr:'',
      }],


      dynamicTags: [],
      inputVisible: false,
      inputValue: '',

      tableLoad:false,
      statusArr : [{'name':'暂存','val':1},{'name':'审核中','val':2},{'name':'已审核','val':0},{'name':'重新审核','val':3}],
      checkedBox:[1,2,3,0],
      // vue 前端的 导出table 数据功能
      //导出表格字段及formatter信息
      exportExcelArry: [{
        prop: 'id',
        label: '单据编号',
        formatterFlag: false
      },
        {
          prop: 'priceDate',
          label: '退料日期',
          formatterFlag: false
        },

        {
          prop: 'status',
          label: '状态',
          formatterFlag: true,
          formatterType: 'common-type',
          formatterInfo: [{value: 0,label: '审核完成'},{value: 1,label: '待审核'}]
        },
        {
          prop: 'productNum',
          label: '退料工厂型号',
          formatterFlag: false
        },
        {
          prop: 'materialId',
          label: '物料编码',
          formatterFlag: false
        },
        {
          prop: 'materialName',
          label: '物料名称',
          formatterFlag: false
        },
        {
          prop: 'pieces',
          label: '规格型号',
          formatterFlag: false
        },
        {
          prop: 'unit',
          label: '基本单位',
          formatterFlag: false
        },{
          prop: 'num',
          label: '数量',
          formatterFlag: false
        }

      ],
      //导出excel表格id及excel名称
      exportExcelInfo: {
        excelId: 'record-table',
        excelName: '生产退料列表.xlsx'
      },
      //需要导出的table数据
      tableAllData: [],

      dialogVisiblePrint: false,

      //选中的从表数据
      checkedDetail: [],

      // 搜索字段
      selectedName: 'produceProductConstituentId',// 搜索默认值
      options: [
        {value: 'produceProductConstituentId', label: '工厂型号_品牌'}
      ],
      select: 'produceProductConstituentId', // 搜索默认值
      searchStr: '',
      searchStrId: '',
      searchStartDate: '',
      searchEndDate: '',
      searchStrList: [],
      searchField: '',
      restaurants: [],// 搜索框列表数据存放
      restaurants2: [], //
      restaurants3: [], //用于增量表格的搜索框内容

      // 分页字段
      currentPage: 1 // 当前页
      , pageSize: 50 // 一页多少条
      , total: 0 // 总共多少数据
      ,
      // 表单字段
      addOrUpdate: 'save',
      editForm: {
        status: 1, // 编辑表单初始默认值
        id: '',
        produceProductConstituentId: '',
        costOfLabourTypeId: '',
        costOfLabourTypeName:'',
        priceDate: '',
        productNum: '',
        comment:'',
        rowList: [{
          foreignId:'',
          costOfLabourProcessesId:'',
          pieces:'',
          realPrice:'',
          reason:''
        }]
      },
      rules: {
        productNum: [
          {required: true, message: '请选择工厂型号-品牌', change: 'blur'}
        ],
        priceDate: [
          {required: true, message: '请输入工价日期', trigger: 'blur'}
        ]
      }
      ,
      dialogVisible: false,
      tableData: [],
      spanArr: [],
      pos: '',
      multipleSelection: [] // 多选框数组

    }
  },
  methods: {
    changeNum(seq){
      let theCurrent = this.editForm.rowList[seq-1];
      let p = theCurrent.piecesPrice * theCurrent.pieces;
      this.editForm.rowList[seq-1].calPrice = p > theCurrent.lowPrice? p : theCurrent.lowPrice
    },
    rowClass({ row, rowIndex }) {
      if (this.multipleSelection.includes(row.id)) {
        return { "background-color": "rgba(255,235,205, 0.75)" };
      }
    },
    statusPassBatch(){
      let ids = this.multipleSelection;
      request.post('/costOfLabour/statusPassBatch',ids).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getList()
      })
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


    addNext(seq){
      if(this.editForm.rowList.length === seq){
        this.handleAddDetails();
      }
    },
    dialogOpend(){
      if(this.editForm.id != '' && this.editForm.id != undefined){
        console.log("打开编辑页面.锁住...",this.editForm.id);
        request.get('/costOfLabour/lockById?id=' + this.editForm.id)
      }
    },
    // 数量的上下光标事件
    numDown(seqNum){
      if(this.$refs['input_num_'+(seqNum + 1)] != undefined){
        this.$refs['input_num_'+(seqNum + 1)].focus()
      }
    },
    numUp(seqNum){
      if(this.$refs['input_num_'+(seqNum - 1)] != undefined){
        this.$refs['input_num_'+(seqNum - 1)].focus()
      }
    },
    action(item) {
      if(this.editForm.id === null || this.editForm.id === ''){
        this.addOrUpdate = 'save';
      }else{
        this.addOrUpdate = 'update';
      }
      if (item === 'save') {
        this.submitForm('editForm',this.addOrUpdate)
      } else if(item === 'subReturn'){
        console.log("撤销id:",this.editForm.id);
        if(this.editForm.id != ''){
          this.statusSubReturn(this.editForm.id)
        }else{
          this.$message.error("id 为空")
        }
      }
      else if(item === 'addNew'){
        console.log("详情页新增")
        this.closeBrowser();
        this.addReturnMaterial();
      }
      else if(item === 'copy'){
        this.closeBrowser();
        this.editForm.id = '';
        this.editForm.status = 1;
        this.addOrUpdate = 'save';
      }
    },
    // 导出
    expChange(item) {
      console.log("导出:",item)
      if (item === 'currentList') {
        this.exportCurrent()
      } else if(item === 'all'){
        this.exportAll()
      }
    },
    // 导出按钮
    exportExcel () {
      this.$refs.myChild.exportExcel();
    },
    exportAll() {

      request2.post('/costOfLabour/export?'+
          "searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select
          ,{'manySearchArr':this.manySearchArr,'searchStr':this.searchStr},{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'工价表全部列表.xlsx')
      }).catch()
    },
    // 导出列表数据- 服务端写出字节流到浏览器，进行保存
    exportCurrent() {

      request2.post('/costOfLabour/export?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&total="+this.total+
          "&&searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select
          ,{'manySearchArr':this.manySearchArr,'searchStr':this.searchStr},{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'工价表当前页.xlsx')
      }).catch()
    },
    // POI- 服务端写出字节流到浏览器，进行保存
    saveFile(data,name){
      try {
        const blobUrl = window.URL.createObjectURL(data)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.download = name
        a.href = blobUrl
        a.click()

      } catch (e) {
        alert('保存文件出错')
      }
    },

    // 设置每一行的seqNum = 游标+1
    rowClassName({row, rowIndex}) {
      row.seqNum = rowIndex + 1;
    },
    //单选框选中数据
    handleDetailSelectionChange(val) {
      console.log("多选框 val ", val)
      this.checkedDetail = []

      val.forEach(theId => {
        this.checkedDetail.push(theId.seqNum)
      })
      console.log("多选框 选中的 ", this.checkedDetail)
    },
    handleAddDetails() {
      if (this.editForm.rowList == undefined) {
        console.log("editForm 初始化")
        this.editForm.rowList = [];
      }
      if(this.editForm.costOfLabourTypeId ==='' || this.editForm.priceDate===''){
        this.$message({
          message: '工价类型和工价日期不能为空!',
          type: 'error'
        });
        return;
      }
      request.post('/costOfLabour/processes/getLists?labourTypeId='+this.editForm.costOfLabourTypeId
      +"&&priceDate="+this.editForm.priceDate).then(res => {
        this.editForm.rowList = res.data.data;
        for (let i = 0; i < this.editForm.rowList.length; i++) {
          this.editForm.rowList[i].costOfLabourProcessesId = this.editForm.rowList[i].id;
        }
        console.log("现有的数据:", this.editForm.rowList)

      })
    },
    // 退料详细信息-删除
    handleDeleteDetails() {
      if (this.checkedDetail.length == 0) {
        if(this.editForm.rowList.length === 0){
          this.$message({
            message: '没有记录可删除!',
            type: 'error'
          });
        }else{
          this.editForm.rowList.splice(this.editForm.rowList.length-1,1)
        }
      }else {
        this.editForm.rowList = this.getNewArr(this.editForm.rowList,this.checkedDetail);
      }
      this.checkedDetail=[]
    },
    handleDeleteAllDetails() {
      this.editForm.rowList = [];
    },
    // arr: 原数组，delIndexArr：删除下标数组
    getNewArr(arr,delIndexArr){
      let test = []
      test = arr.filter((item, index) =>{
        return !delIndexArr.includes(index+1)}
      )
      return test
    },

    loadProductNumAll() {
      request.post('/produce/productConstituent/getSearchAllData').then(res => {
        this.restaurants = res.data.data
      })
    },

    loadTableSearchMaterialDetailAll() {
      request.post('/baseData/material/loadTableSearchMaterialDetailAll').then(res => {
        this.restaurants3 = res.data.data
      })
    },
    loadCostOfLabourTypeAll() {
      request.post('/costOfLabour/costOfLabourType/getSearchAllData').then(res => {
        this.restaurants2 = res.data.data
      })
    },
    // 查询搜索框列表数据
    tableSearch(queryString, cb) {
      let restaurants = this.restaurants3;
      let results = queryString ? restaurants.filter(this.createFilter2(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    // 查询搜索框列表数据
    querySearch2(queryString, cb) {
      let restaurants = this.restaurants2;
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },

    querySearch(queryString, cb) {
      let restaurants = this.restaurants;
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1) ;
      };
    },
    createFilter2(queryString) {
      return (restaurant) => {
        return (restaurant.obj.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1) || (restaurant.id.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      this.editForm.produceProductConstituentId = item.id
      this.editForm.productNum = item.name
      console.log("选中：", item);
    },
    handleSelect2(item) {
      this.editForm.costOfLabourTypeId = item.id
      this.editForm.costOfLabourTypeName = item.name
      console.log("选中：", item);
    },
    clearProductNunAndBrand(item){
      this.searchStrId = ''
    },
    searchSelect(item) {
      this.searchStr = item.name
      this.searchStrId = item.id
      console.log("选中：", item);
    },
    moveMouse2(text) {
      try {
        // foreach 只能抛出异常结束
        this.restaurants2.forEach(item => {
          if (text === item.name) {
            this.editForm.costOfLabourTypeId = item.id
            this.editForm.costOfLabourTypeName = item.name
            throw new Error();
          } else {
            this.editForm.costOfLabourTypeId = ''
            console.log("没有匹配到", text, item.name)
            this.editForm.costOfLabourTypeName = ''
          }
        })
      } catch (err) {
      }
    },
    moveMouse(text) {
      try {
        // foreach 只能抛出异常结束
        this.restaurants.forEach(item => {
          if (text === item.name) {
            this.editForm.produceProductConstituentId = item.id
            this.editForm.productNum = item.name
            throw new Error();
          } else {
            this.editForm.produceProductConstituentId = ''
            console.log("没有匹配到", text, item.name)
            this.editForm.productNum = ''
          }
        })
      } catch (err) {
      }
    },
    tableMoveMouse(selectItem, rowObj,index) {
      console.log("tableMoveMouse", selectItem, rowObj)
      try {
        // foreach 只能抛出异常结束
        this.restaurants3.forEach(item => {
          if (selectItem === item.id) {
            console.log("匹配到:", selectItem, item.id)
            rowObj.materialId = item.id;
            rowObj.materialName = item.obj.name
            rowObj.unit = item.obj.unit
            rowObj.pieces = item.obj.pieces
            throw new Error();
          } else {
            rowObj.materialName = "";
            rowObj.unit = "";
            rowObj.materialId = '';
            rowObj.pieces = ''

            rowObj.num = ''
            console.log("没有匹配到", selectItem, item.id)
          }
          console.log("设置rowObj:{},",this.editForm.rowList)

        })
      } catch (err) {
      }
    },
    tableSelectSearch(selectItem, param) {
      console.log("每个表格项选中：", selectItem, param);
      param.materialId = selectItem.id;
      param.materialName = selectItem.obj.name
      param.unit = selectItem.obj.unit
      param.pieces = selectItem.obj.pieces
      console.log("rowList：", this.editForm.rowList);

    },


    // 领料列表 点击添加按钮
    addReturnMaterial() {
      this.addOrUpdate = 'save'
      this.editForm = {
        status: 1, // 编辑表单初始默认值
        id: '',
        produceConstituentId: '',
        costOfLabourTypeId:'',
        priceDate: new Date().format("yyyy-MM-dd"),
        rowList: [{
          foreign_id:'',
          cost_of_labour_processes_id:'',
          pieces:'',
          real_price:'',
          reason:''
        }]
      }
      this.dialogVisible = true
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
    // 多选框方法
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    selectAll(val){
      this.multipleSelection= [];

      val.forEach(theId => {
        if(!this.multipleSelection.some(item=>item==theId.id)){
          this.multipleSelection.push(theId.id)
        }
      })
      console.log("全选，多选框 val ", val)
      console.log("全选，多选框 选中的 ", this.multipleSelection)
    },
    handleSelectionChange(val,row) {
      if (!row||row===undefined) { // 没有row则是全选的情况

        return
      }
      this.multipleSelection= []
      console.log("val:",val)
      // 选中的数值全加进去
      val.forEach(theId => {
        if(!this.multipleSelection.some(item=>item==theId.id)){
          this.multipleSelection.push(theId.id)
        }
      })


      // 找出没选中的，把前面的数组等值的去掉
      this.multipleSelection.forEach((item,index,arr) => {
        console.log("判断:item{},row:{},val.indexOfrow:",item,row,val.indexOf(row))
        if(item === row.id  && val.indexOf(row) === -1){
          console.log("val:"+val+"不存在row:"+row);
          this.multipleSelection.splice(index,1)
          console.log("执行删除")

          this.tableData.forEach(item => {
            if (this.isCouple(item, row)) {
              this.$nextTick(() => {
                this.$refs.multipleTable.toggleRowSelection(item, false)
                console.log("消除ID："+row.id+",的选中状态")

                // 该处也会触发checkSelection方法，因为触发了selection-change
                // 类似于递归了，这就解决了第一个方案的问题
              })
            }
          })
        }
      });
      console.log("多选框 选中的 ", this.multipleSelection)

    },
    // 是否是成对的记录，也就是合并在一起的记录
    isCouple (row1, row2) {
      return row1.id === row2.id
    },
    // 表单提交
    submitForm(formName, methodName) {
      this.$refs[formName].validate((valid) => {

        if (valid) {
          if (this.editForm.rowList === undefined || this.editForm.rowList.length === 0) {
            this.$message({
              message: '没有详情信息',
              type: 'error'
            });
            return
          }

          let validateFlag = true;
          console.log(this.editForm.rowList)
          for (let i = 0; i < this.editForm.rowList.length; i++) {
            let obj = this.editForm.rowList[i];
            if (obj.realPrice === undefined || obj.realPrice === '') {
              validateFlag = false
            }
          }

          if (validateFlag === false) {
            this.$message({
              message: '价格不能为空!',
              type: 'error'
            });
            return
          }
          const load = this.$loading({
            lock: true,
            text: '处理中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          request.post('/costOfLabour/' + methodName, this.editForm).then(res => {
            load.close()
            this.$message({
              message: (this.editForm.id ? '编辑' : '新增') + '成功!',
              type: 'success'
            });

            if(!this.editForm.id){
              console.log("回显的ID：",res.data.data)
              this.editForm.id = res.data.data;
              this.addOrUpdate = "update"
            }
            this.editForm.status = 2;
          }).catch(()=>{
            load.close()
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    search(){
      this.currentPage = 1
      this.getList()
    },
    // 查询价目表单列表数据
    getList() {
      this.multipleSelection=[]
      this.tableLoad = true;
      let checkStr = this.checkedBox.join(",");
      let url = '/costOfLabour/list?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&total="+this.total+
          "&&searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select+
          "&&searchStatus="+checkStr;
      console.log("url:",url)
      request.post(url,
          {'manySearchArr':this.manySearchArr,'searchStr':this.select==='produceProductConstituentId' ?this.searchStrId :this.searchStr},
          null).then(res => {
          this.tableData = res.data.data.records
          this.total = res.data.data.total
          this.getSpanArr(this.tableData)
          this.tableLoad = false;
          this.$nextTick(() => {
          this.$refs['multipleTable'].doLayout();
        })
      }).catch(error=>{
        this.tableLoad = false;
        console.log("error:",error)
      })
    },
    // 编辑页面
    edit(id) {
      this.addOrUpdate = "update"
      request.get('/costOfLabour/queryById?id=' + id).then(res => {
        let result = res.data.data
        this.dialogVisible = true
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.editForm = result
        })

      })
    },

    // 删除
    del(id) {
      let ids = []
      if (id) {
        // 单个删除
        console.log("删除:id", id)

        ids.push(id)
      } else {
        // 批量删除
        ids = this.multipleSelection
        console.log("批量删除:id", ids)
      }
      const load = this.$loading({
        lock: true,
        text: '处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      request.post('/costOfLabour/del', ids).then(res => {
        load.close()
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getList()
        console.log("删除后重新加载页面")

      }).catch(()=>{
        load.close()
      })
    },

    // 撤销提交
    statusSubReturn(id) {
      request.get('/costOfLabour/statusSubReturn?id=' + id).then(res => {
        this.$message({
          message: '已撤销!',
          type: 'success'
        });
        this.editForm.status = 1;
        this.getList()
      })
    },
    // 状态提交
    statusSubmit(id) {
      request.get('/costOfLabour/statusSubmit?id=' + id).then(res => {
        this.$message({
          message: '已提交!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 状态待审核
    statusPass(id) {
      request.get('/costOfLabour/statusPass?id=' + id).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 状态反审核
    statusReturn(id) {
      request.get('/costOfLabour/statusReturn?id=' + id).then(res => {
        this.$message({
          message: '反审核完成!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 关闭弹窗处理动作
    handleClose(done) {
      if(this.editForm.status === 1){
        this.$confirm('确认关闭？')
            .then(_ => {
              this.closeMethod();
              done();
            })
            .catch(_ => {});
      }else{
        this.closeMethod();
        done();
      }
    },
    closeMethod(){
      if(this.editForm.id != '' && this.editForm.id != undefined){
        console.log("关闭编辑页面.打开锁...",this.editForm.id);
        request.get('/costOfLabour/lockOpenById?id=' + this.editForm.id)
      }
      this.$refs['editForm'].resetFields();
      this.handleDeleteAllDetails()
      this.getList()
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    searchFieldChange(item) {
      console.log("搜索字段改变:", item)
      this.selectedName = item
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
          if (data[i].id === data[i - 1].id) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    // 同ID的，单元格合并，数据库配合返回根据ID排序
    objectSpanMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      } else if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      } else if (columnIndex === 2) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      } else if (columnIndex === 3) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      } else if (columnIndex === 4) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      } else if (columnIndex === 5) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      else if (columnIndex === 6) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      else if (columnIndex === 7) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      else if (columnIndex === 8) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      else if (columnIndex === 9) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      else if (columnIndex === 14) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }

    },
    getDetailSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '求和';
          return;
        }
        if (index === 9 ) {
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
          if(index === 6){
            this.editForm.totalNum = sums[index];
          }
        }

      });

      return sums;
    },
    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '求和';
          return;
        }
        if (index === 10 ) {
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
    preViewPrint() {
      if(this.editForm.id ==='' || this.editForm.id === undefined){
        this.$message.error("请先保存再打印.")
        return null;
      }

      if (this.editForm) {
        console.log("打印时的easyPrint：", this.$refs.easyPrint)
        console.log("打印时的editForm：", this.editForm)
        if (this.$refs.easyPrint) {
          console.log("设置前打印内容", this.$refs.easyPrint.tableData)

          this.$refs.easyPrint.tableData = this.editForm
          console.log("设置后打印内容", this.$refs.easyPrint.tableData)

        }
        this.dialogVisiblePrint = true
      } else {
        this.$message({
          message: '没有内容!',
          type: 'error'
        });
      }
    },

    // el-table 单元格样式修改
    cellStyle() {
      return 'padding:10 0'
    },
    // 关闭打印弹窗弹窗处理动作
    printClose(done) {
      console.log("打印弹窗关闭...")

      this.$refs.easyPrint.tableShow = false;
      done();
    },
    // 打印按钮事件
    printDemo() {
      this.$refs.easyPrint.print()
    },
    async closeBrowser(){
      if(this.editForm.id != '' && this.editForm.id != undefined){
        console.log("关闭编辑页面.打开锁...",this.editForm.id);
        await request.get('/costOfLabour/lockOpenById?id=' + this.editForm.id)
      }
    },
    searchCostOfLabourTypeFocus(){
      this.loadCostOfLabourTypeAll()
    },
    searchProductNumFocus(){
      this.loadProductNumAll()
    },
    searchMaterialAllFocus(){
      this.loadTableSearchMaterialDetailAll()
    },
    handleEvent(){

      if (event.keyCode === 80&& event.ctrlKey) {
        let viewReturn = this.preViewPrint();
        if(viewReturn === null){
          event.preventDefault();
          event.returnValue = false;
          return false;
        }
        this.$nextTick(() => {
          this.printDemo()
        })
        event.preventDefault();
        event.returnValue = false;
        return false;
      }
    }

  },
  created() {
    this.getList()
    this.loadProductNumAll()
    this.loadCostOfLabourTypeAll()

  },mounted() {
    window.addEventListener( 'beforeunload', e => this.closeBrowser() );
  },
  activated() {
    document.addEventListener('keydown',this.handleEvent)
  },
  deactivated() {
    document.removeEventListener('keydown',this.handleEvent)
  }
  // 自定义指令，，insert在DOM加入的时候才生效
  , directives: {
    // 声明自定义指令v-focus
    focus: {
      // v-foucs指令的钩子函数
      inserted: function (el, binding) {
        console.log("聚焦...")
        el.focus();
      },
    },
  }

}

</script>

<style scoped>

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

</style>