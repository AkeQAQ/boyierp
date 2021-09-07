<template>

  <el-container>
    <el-main>
      <!-- 入库单列表 -->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-select size="mini" v-model="select" filterable @change="searchFieldChange" placeholder="请选择搜索字段">
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
          <!-- 列表界面-供应商搜索 -->
          <el-autocomplete size="mini" v-if="selectedName==='supplierName'"
                           clearable
                           class="inline-input"
                           v-model="searchStr"
                           :fetch-suggestions="querySearch"
                           placeholder="请输入搜索内容"
                           @select="searchSelect"
          >
          </el-autocomplete>

          <!-- 列表界面-物料搜索 -->
          <el-autocomplete size="mini" v-if="selectedName === 'materialName'" clearable
                           class="inline-input"
                           v-model="searchStr"
                           :fetch-suggestions="querySearch2"
                           placeholder="请输入搜索内容"
                           @select="searchSelect"

          >
          </el-autocomplete>

          <!-- 列表界面-单据编号搜索 -->
          <el-input size="mini" v-model="searchStr" v-if="selectedName === 'id'" clearable
                    placeholder="请输入搜索内容"></el-input>

        </el-form-item>

        <el-form-item>

          <!-- 列表界面-日期搜索 -->
          <el-date-picker style="width: 130px"
                          size="mini"
                          value-format="yyyy-MM-dd"
                          v-model="searchStartDate"
                          type="date"
                          clearable
                          placeholder="开始日期">
          </el-date-picker>

        </el-form-item>

        <el-form-item>
          <el-date-picker style="width: 130px"
                          size="mini"
                          value-format="yyyy-MM-dd"
                          v-model="searchEndDate"
                          type="date"
                          clearable
                          placeholder="结束日期">
          </el-date-picker>

        </el-form-item>


        <el-form-item>
          <el-button size="mini" icon="el-icon-search" @click="getBuyInDocumentList">搜索</el-button>
        </el-form-item>


        <el-form-item v-if="hasAuth('repository:buyIn:save')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('repository:buyIn:save')"
                     @click="addSupplierMaterial()"

          >新增
          </el-button>
        </el-form-item>

        <el-form-item v-if="hasAuth('repository:buyIn:export')">
          <el-dropdown   @command="expChange">
            <el-button  icon="el-icon-download" size="mini" type="success">
              导出<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="all">导出全部</el-dropdown-item>
              <el-dropdown-item command="currentList">导出当前列表</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>

        <!--        <el-form-item v-if="hasAuth('repository:buyIn:del')">
                  <el-popconfirm @confirm="del(null)" title="确定删除吗？">
                    <el-button size="mini" icon="el-icon-delete" :disabled="this.multipleSelection.length === 0 " type="danger"
                               slot="reference">批量删除
                    </el-button>
                  </el-popconfirm>
                </el-form-item>-->

      </el-form>

      <el-table

          ref="multipleTable"
          :data="tableData"
          :span-method="objectSpanMethod"
          border
          fit

          :summary-method="getSummaries"
          show-summary
          size="mini"
          tooltip-effect="dark"
          style="width: 100%;color:black"
          :cell-style="{padding:'0'}"
          :default-sort="{prop:'id',order:'descending'}"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="50">
        </el-table-column>
        <el-table-column
            label="单据编号"

            prop="id" width="70px"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click=" edit(scope.row.id)"
            >{{ scope.row.id }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
            prop="buyInDate"
            label="入库日期"
            width="90px"
        >
        </el-table-column>


        <el-table-column
            label="供应商"
            prop="supplierName"
            width="110px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            prop="status"
            label="状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status === 0" type="success">审核完成</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===1" type="danger">待审核</el-tag>
          </template>
        </el-table-column>

        <el-table-column
            label="物料编码"
            prop="materialId"
            width="90px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            prop="materialName"
            label="物料名称"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="unit"
            label="基本单位"
            width="80px"
        >
        </el-table-column>

        <!--        <el-table-column
                    prop="specs"
                    label="规格型号">
                </el-table-column>-->

        <el-table-column
            prop="num"
            label="数量"
            width="70px"

        >
        </el-table-column>


        <el-table-column
            prop="priceDate"
            label="价目日期"
            width="90px"
        >
        </el-table-column>

        <el-table-column
            prop="price"
            label="单价"
            width="60px"

        >
        </el-table-column>

        <el-table-column
            prop="amount"
            label="金额">
        </el-table-column>

        <el-table-column
            prop="orderId"
            label="订单编号">
        </el-table-column>

        <el-table-column
            prop="orderSeq"
            label="单号">
        </el-table-column>


        <el-table-column
            prop="action"
            label="操作"
            width="170px"
            fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row.id)"
                       v-if="hasAuth('repository:buyIn:update')   ">{{ scope.row.status === 0 ? '查看' : '编辑' }}
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('repository:buyIn:update') && scope.row.status ===1   "></el-divider>

            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('repository:buyIn:valid')  && scope.row.status ===1   ">
              <template>
                <el-popconfirm @confirm="statusPass(scope.row.id)"
                               title="确定设置审核通过吗？"
                >
                  <el-button type="text" size="small" slot="reference">审核通过</el-button>
                </el-popconfirm>
              </template>
            </el-button>


            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('baseData:supplierMaterial:valid')  && scope.row.status ===0  ">
              <template>
                <el-popconfirm @confirm="statusReturn(scope.row.id)"
                               title="确定反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">反审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('repository:buyIn:del')  && scope.row.status ===1  "></el-divider>

            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('repository:buyIn:del') && scope.row.status ===1   ">
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
      <el-dialog
          title=""
          :visible.sync="dialogVisiblePrint"
          width="55%"
          style="padding-top: 0px"
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

      </el-dialog>

      <!-- 采购入库弹窗 -->

      <el-dialog
          title="采购入库信息"
          :visible.sync="dialogVisible"
          :before-close="handleClose"
          fullscreen
      >
        <el-form style="width: 100%;margin-bottom: -20px;margin-top: -30px;align-items: center"
                 size="mini" :inline="true"
                 label-width="100px"
                 :model="editForm" :rules="rules" ref="editForm"
                 class="demo-editForm">

          <el-form-item label="单据编号" prop="id" style="margin-bottom: 0px">
            <el-input style="width: 150px" :disabled=true placeholder="保存自动生成" v-model="editForm.id">

            </el-input>
          </el-form-item>
          <!--
                    <el-form-item label="状态" prop="status" style="margin-bottom: 0px">
                      <el-input style="width: 220px" :disabled=true v-model="editForm.status" >
                      </el-input>
                    </el-form-item>-->

          <el-form-item v-if="false" prop="supplierId" style="margin-bottom: 0px">
            <el-input v-model="editForm.supplierId"></el-input>
          </el-form-item>
          <el-form-item label="供应商" prop="supplierName" style="margin-bottom: 10px">
            <!-- 搜索框 -->
            <el-autocomplete
                :disabled="this.editForm.status===0 ||  this.editForm.sourceType === 1"
                style="width: 150px"
                class="inline-input"
                v-model="editForm.supplierName"
                :fetch-suggestions="querySearch"
                placeholder="请输入供应商"
                @select="handleSelect"
                @change="moveMouse"

                clearable
            >
            </el-autocomplete>
          </el-form-item>

          <el-form-item  label="供应商单号" prop="supplierDocumentNum" style="padding: -20px 0 ;margin-bottom: -20px">
            <el-input :disabled="this.editForm.status===0 ||  this.editForm.sourceType === 1"  size="mini" clearable style="width: 150px" v-model="editForm.supplierDocumentNum">
            </el-input>
          </el-form-item>

          <el-form-item label="入库日期" prop="buyInDate">
            <el-date-picker :disabled="this.editForm.status===0 ||  this.editForm.sourceType === 1" style="width: 150px"
                            value-format="yyyy-MM-dd"
                            v-model="editForm.buyInDate"
                            type="date"
                            clearable
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item style="margin-left: 100px">
            <el-button type="primary" v-show="this.editForm.status===1" @click="submitForm('editForm',addOrUpdate)">
              保存单据
            </el-button>
            <el-button @click="preViewPrint()" icon="el-icon-printer" type="primary"
            >打印预览
            </el-button>

          </el-form-item>

        </el-form>
        <el-divider content-position="left">明细信息</el-divider>

        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddDetails"
                   v-show="this.editForm.status===1  && this.editForm.sourceType === 0 ">添加
        </el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteDetails"
                   v-show="this.editForm.status===1">删除
        </el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteAllDetails"
                   v-show="this.editForm.status===1  && this.editForm.sourceType === 0">清空
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

          <el-table-column label="单号" align="center" prop="orderSeq" width="100">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" v-model="editForm.rowList[scope.row.seqNum-1].orderSeq"></el-input>
            </template>
          </el-table-column>



          <el-table-column style="padding: 0 0;" label="物料编码" align="center" width="200" prop="materialId">
            <template slot-scope="scope">
              <el-autocomplete size="mini" clearable
                               :disabled="editForm.status===0 ||  editForm.sourceType === 1"
                               class="inline-input"
                               v-model="editForm.rowList[scope.row.seqNum - 1].materialId"
                               :fetch-suggestions="tableSearch"
                               placeholder="请输入内容"
                               @select="tableSelectSearch($event,editForm.rowList[scope.row.seqNum - 1])"
                               @change="tableMoveMouse($event,editForm.rowList[scope.row.seqNum - 1],scope.row.seqNum - 1)"
              >
              </el-autocomplete>
            </template>

          </el-table-column>

          <el-table-column label="物料名称" align="center" prop="materialName" width="180">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true"
                        v-model="editForm.rowList[scope.row.seqNum-1].materialName"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="规格型号" align="center" prop="specs" width="100">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" v-model="editForm.rowList[scope.row.seqNum-1].specs"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="物料单位" align="center" prop="unit" width="100">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" v-model="editForm.rowList[scope.row.seqNum-1].unit"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="入库单价" align="center" width="75" prop="price">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" v-model="editForm.rowList[scope.row.seqNum-1].price"/>
            </template>
          </el-table-column>

          <el-table-column label="入库数量" align="center" width="85" prop="num">
            <template slot-scope="scope">
              <el-input  :disabled="editForm.status===0 ||  editForm.sourceType === 1" size="mini" v-model="editForm.rowList[scope.row.seqNum-1].num"/>
            </template>
          </el-table-column>

          <el-table-column label="金额" align="center" width="115" prop="amount">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" v-model="editForm.rowList[scope.row.seqNum-1].amount"/>
            </template>
          </el-table-column>


          <el-table-column label="备注" align="center" width="150" prop="comment">
            <template slot-scope="scope">
              <el-input  :disabled="editForm.status===0 || editForm.sourceType === 1" size="mini" v-model="editForm.rowList[scope.row.seqNum-1].comment"/>
            </template>
          </el-table-column>

        </el-table>

      </el-dialog>

      <!--价目列表 分页组件 -->
      <el-pagination

          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="this.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total">
      </el-pagination>
    </el-main>

    <export-excel-common ref="myChild" :exportExcelInfo="exportExcelInfo" :tableData="tableData" :exportExcelArry="exportExcelArry"></export-excel-common>

  </el-container>


  <!-- 导出功能 -->



</template>

<script>

// POI，因为响应输出字节流，和ajax 的请求不一样。
import {request} from "@/axios";


// 引入打印基础组件，和打印模块print页面
import vueEasyPrint from "vue-easy-print";
import print from "@/views/printModule/print";
import exportExcelCommon from"../common/ExportExcelCommon"
import {request2} from "@/axios";

export default {
  name: 'BuyIn',
  // 引入打印模块基础组件和该打印模块的模板页面
  components: {
    vueEasyPrint,
    print,
    exportExcelCommon
  },
  data() {
    return {

      // vue 前端的 导出table 数据功能
      //导出表格字段及formatter信息
      exportExcelArry: [{
        prop: 'id',
        label: '单据编号',
        formatterFlag: false
      },
      {
        prop: 'buyInDate',
        label: '入库日期',
        formatterFlag: false
      },
        {
          prop: 'supplierName',
          label: '供应商',
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
          prop: 'unit',
          label: '基本单位',
          formatterFlag: false
        },{
          prop: 'num',
          label: '数量',
          formatterFlag: false
        }
        ,{
          prop: 'priceDate',
          label: '价目日期',
          formatterFlag: false
        }
        ,{
          prop: 'price',
          label: '单价',
          formatterFlag: false
        }
         ,{
        prop: 'amount',
        label: '金额',
        formatterFlag: false
      }],
      //导出excel表格id及excel名称
      exportExcelInfo: {
        excelId: 'record-table',
        excelName: '采购入库列表.xlsx'
      },
      //需要导出的table数据
      tableAllData: [],


      //选中的从表数据
      checkedDetail: [],

      // 搜索字段
      selectedName: 'supplierName',// 搜索默认值
      options: [
        {value: 'supplierName', label: '供应商名称'},
        {value: 'materialName', label: '物料名称'},
        {value: 'id', label: '单据编号'}
      ],
      select: 'supplierName', // 搜索默认值
      searchStr: '',
      searchStartDate: '',
      searchEndDate: '',
      searchStrList: [],
      searchField: '',
      restaurants: [],// 搜索框列表数据存放
      restaurants2: [], //
      restaurants3: [], //用于增量表格的搜索框内容

      // 分页字段
      currentPage: 1 // 当前页
      , pageSize: 100 // 一页多少条
      , total: 0 // 总共多少数据
      ,
      // 表单字段
      addOrUpdate: 'save',
      editForm: {
        status: 1, // 编辑表单初始默认值
        sourceType:'',
        id: '',
        supplierId: '',
        supplierName: '',
        materialName: '',
        materialId: '',
        buyInDate: '',
        endDate: '',
        price: '',
        rowList: []
      },
      rules: {
        supplierName: [
          {required: true, message: '请输入供应商', change: 'blur'}
        ],
        supplierDocumentNum: [
          {required: true, message: '请输入供应商单据编号', trigger: 'blur'}
        ],
        buyInDate: [
          {required: true, message: '请输入入库日期', trigger: 'blur'}
        ]
      }
      ,
      dialogVisible: false,
      dialogVisiblePrint: false,
      tableData: [],
      spanArr: [],
      pos: '',
      multipleSelection: [] // 多选框数组

    }
  },
  methods: {
    // 导出按钮
    exportExcel () {
      this.$refs.myChild.exportExcel();
    },

    // 打印按钮事件
    printDemo() {
      this.$refs.easyPrint.print()
    },
    // 设置每一行的seqNum = 游标+1
    rowClassName({row, rowIndex}) {
      row.seqNum = rowIndex + 1;
    },
    //单选框选中数据
    handleDetailSelectionChange(selection) {
      if (selection.length > 1) {
        this.$refs.tb.clearSelection();
        this.$refs.tb.toggleRowSelection(selection.pop());
      } else {
        this.checkedDetail = selection;
      }
    },
    // 采购入库详细信息-添加
    handleAddDetails() {
      if (this.editForm.rowList == undefined) {
        console.log("editForm 初始化")
        this.editForm.rowList = new Array();
      }
      let obj = {};
      obj.materialName = "";
      obj.unit = "";
      obj.materialId = '';
      obj.price = '';
      obj.num = ''
      obj.specs = ''
      obj.comment = ''
      obj.orderSeq=''

      this.editForm.rowList.push(obj);
      console.log("现有的数据:", this.editForm.rowList)
    },
    // 采购入库详细信息-删除
    handleDeleteDetails() {
      if (this.checkedDetail.length == 0) {
        this.$message({
          message: '请先选择要删除的数据!',
          type: 'error'
        });
      } else {
        this.editForm.rowList.splice(this.checkedDetail[0].seqNum - 1, 1);
      }
    },
    handleDeleteAllDetails() {
      this.editForm.rowList = [];
    },

    loadSupplierAll() {
      request.post('/baseData/supplier/getSearchAllData').then(res => {
        this.restaurants = res.data.data
      })
    },

    loadTableSearchMaterialDetailAll() {
      request.post('/baseData/material/loadTableSearchMaterialDetailAll').then(res => {
        this.restaurants3 = res.data.data
      })
    },
    loadMaterialAll() {
      request.post('/baseData/material/getSearchAllData').then(res => {
        this.restaurants2 = res.data.data
      })
    },
    // 查询搜索框列表数据
    tableSearch(queryString, cb) {
      var restaurants = this.restaurants3;
      var results = queryString ? restaurants.filter(this.createFilter2(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    // 查询搜索框列表数据
    querySearch2(queryString, cb) {
      var restaurants = this.restaurants2;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },

    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1) || (restaurant.id.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    createFilter2(queryString) {
      return (restaurant) => {
        return (restaurant.obj.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1) || (restaurant.id.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      this.editForm.supplierId = item.id
      this.editForm.supplierName = item.name
      console.log("选中：", item);
    },
    handleSelect2(item) {
      this.editForm.materialId = item.id
      this.editForm.materialName = item.name
      console.log("选中：", item);
    },
    searchSelect(item) {
      this.searchStr = item.name
      console.log("选中：", item);
    },
    moveMouse(text) {
      try {
        // foreach 只能抛出异常结束
        this.restaurants.forEach(item => {
          if (text === item.name) {
            console.log("匹配到:", text, item.name, this.editForm.supplierId, item.id)
            this.editForm.supplierId = item.id
            this.editForm.supplierName = item.name
            throw new Error();
          } else {
            this.editForm.supplierId = ''
            console.log("没有匹配到", text, item.name)
            this.editForm.supplierName = ''
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
            rowObj.specs = item.obj.specs
            throw new Error();
          } else {
            rowObj.materialName = "";
            rowObj.unit = "";
            rowObj.materialId = '';
            rowObj.specs = ''

            rowObj.price = '';
            rowObj.num = ''
            rowObj.comment = ''
            rowObj.amount=''
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
      param.specs = selectItem.obj.specs
      console.log("rowList：", this.editForm.rowList);

    },

    // 导出列表数据- 服务端写出字节流到浏览器，进行保存
    exportList() {

      request2.post('/repository/buyIn/export?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&total="+this.total+
          "&&searchStr="+this.searchStr+
          "&&searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select
      ,null,{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'采购入库全部列表.xlsx')
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


    // 入库列表 点击添加按钮
    addSupplierMaterial() {
      this.addOrUpdate = 'save'
      this.editForm = {
        status: 1, // 编辑表单初始默认值
        id: '',
        supplierId: '',
        supplierName: '',
        materialName: '',
        materialId: '',
        buyInDate: '',
        endDate: '',
        price: '',
        sourceType: 0,
        rowList: []
      }
      this.dialogVisible = true
    },

    // 分页方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getBuyInDocumentList()

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getBuyInDocumentList()

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
    handleSelectionChange(val) {
      console.log("多选框 val ", val)
      this.multipleSelection = []

      val.forEach(theId => {
        this.multipleSelection.push(theId.id)
      })
      console.log("多选框 选中的 ", this.multipleSelection)
    },
    // 表单提交
    submitForm(formName, methodName) {
      this.$refs[formName].validate((valid) => {

        console.log("当前供应商id:", this.editForm.supplierId)
        if (valid) {
          if (this.editForm.rowList === undefined || this.editForm.rowList.length === 0) {
            this.$message({
              message: '请录入至少一个采购物料信息',
              type: 'error'
            });
            return
          }

          let validateFlag = true;
          let validateMaterial = true;
          console.log(this.editForm.rowList)
          this.editForm.rowList.forEach(obj => {
            if (obj.num === undefined || obj.num === '') {
              validateFlag = false
            }
            if (obj.materialId === '') {
              validateMaterial = false
            }
          })
          if (validateMaterial === false) {
            this.$message({
              message: '物料不能为空!',
              type: 'error'
            });
            return
          }

          if (validateFlag === false) {
            this.$message({
              message: '入库数量不能为空!',
              type: 'error'
            });
            return
          }

          request.post('/repository/buyIn/' + methodName, this.editForm).then(res => {
            this.$message({
              message: (this.editForm.id ? '编辑' : '新增') + '成功!',
              type: 'success'
            });

            // 关闭弹窗并且重置内容
            this.dialogVisible = false;
            this.resetForm("editForm")
            this.handleDeleteAllDetails()
            this.getBuyInDocumentList()

          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    // 查询价目表单列表数据
    getBuyInDocumentList() {
      console.log("搜索字段:", this.select)
      request.get('/repository/buyIn/list', {
        params: {
        currentPage: this.currentPage
            , pageSize: this.pageSize
            , total: this.total
            , searchStr: this.searchStr
            , searchStartDate: this.searchStartDate
            , searchEndDate: this.searchEndDate
            , searchField: this.select
      }
      }).then(res => {
        this.tableData = res.data.data.records
        this.total = res.data.data.total
        this.getSpanArr(this.tableData)
        console.log("id:",res.data.data.records[0].orderId ===null)
        console.log("获取用户表单数据", res.data.data.records)
      })
    },
    // 编辑页面
    edit(id) {
      this.addOrUpdate = "update"
      request.get('/repository/buyIn/queryById?id=' + id).then(res => {
        let result = res.data.data
        this.dialogVisible = true
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.editForm = result
          this.restaurants3.forEach(obj => {
            console.log("obj:", obj, result.rowList.materialId)

            if (obj.id === result.materialId) {
              console.log("obj:", obj, result.materialId)
            }
          })
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
      request.post('/repository/buyIn/del', ids).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getBuyInDocumentList()
        console.log("删除后重新加载页面")

      })
    },
    // 状态待审核
    statusPass(id) {
      request.get('/repository/buyIn/statusPass?id=' + id).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getBuyInDocumentList()
      })
    },
    // 状态反审核
    statusReturn(id) {
      request.get('/repository/buyIn/statusReturn?id=' + id).then(res => {
        this.$message({
          message: '反审核完成!',
          type: 'success'
        });
        this.getBuyInDocumentList()
      })
    },
    // 关闭弹窗处理动作
    handleClose(done) {
      this.$refs['editForm'].resetFields();

      this.handleDeleteAllDetails()
      console.log("关闭窗口")
      done();
    },
    // 关闭打印弹窗弹窗处理动作
    printClose(done) {
      console.log("打印弹窗关闭...")

      this.$refs.easyPrint.tableShow = false;
      done();
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    searchFieldChange(item) {
      console.log("搜索字段改变:", item)
      if (item === 'supplierName') {
        this.selectedName = item
      } else {
        this.selectedName = item

      }
    },

    expChange(item) {
      console.log("导出:",item)
      if (item === 'currentList') {
        this.exportExcel()
      } else if(item === 'all'){
        this.exportList()
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
      } else if (columnIndex === 14) {
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
        if (index === 7 || index === 8) {
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
    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '求和';
          return;
        }
        if (index === 8 || index === 11) {
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
      return 'padding:0 0'
    }

  },
  created() {
    this.getBuyInDocumentList()
    this.loadSupplierAll()
    this.loadMaterialAll()
    this.loadTableSearchMaterialDetailAll()
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


.el-pagination {
  float: right;

}

.el-table--mini td {
  padding: 0 0;
}

</style>