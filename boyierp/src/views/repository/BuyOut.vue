<template>
  <el-container id="buyOut">
    <el-header style="height: 30px;padding: 0 0;margin-top: -10px;margin-bottom: 10px">
      <span style="font-size: 10px">快捷过滤   </span>
      <span style="font-size: 10px;font-weight: bold">方案:</span>
      <el-tag
          :key="tag.tagName"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="tagClose(tag)">
        <el-link type="primary" @click="chooseTag(tag)"> {{tag.tagName}}</el-link>
      </el-tag>
      <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput"> + 方案</el-button>



    </el-header>
    <el-main class="elMain_my" style="padding-top: 0;padding-right: 0px">
      <!-- 入库单列表 -->
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
          <!-- 列表界面-供应商搜索 -->
          <el-autocomplete
              size="mini" v-if="selectedName==='supplierName'"
              style="width: 200px"
              popper-class="my-autocomplete"

              clearable
                           class="inline-input"
                           v-model="searchStr"
                           :fetch-suggestions="querySearch"
                           :trigger-on-focus="false"

                            placeholder="请输入搜索内容"
                            @select="searchSelect"
                            @focus="searchSupplierFocus()"
              @keyup.enter.native="search()"


          >
          </el-autocomplete>

          <!-- 列表界面-物料搜索 -->
          <el-autocomplete size="mini" v-if="selectedName === 'materialName'" clearable
                           style="width: 200px"
                           popper-class="my-autocomplete"

                           class="inline-input"
                           v-model="searchStr"
                           :fetch-suggestions="querySearch2"
                           placeholder="请输入搜索内容"
                           :trigger-on-focus="false"
                           @select="searchSelect"
                           @keyup.enter.native="search()"
                           @focus="searchMmaterialFocus()"

          >
          </el-autocomplete>

          <!-- 列表界面-单据编号搜索 -->
          <el-input size="mini" v-model="searchStr" v-if="selectedName === 'id'" clearable
                    style="width: 200px"
                    @keyup.enter.native="search()"
                    placeholder="请输入搜索内容"></el-input>

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
                <el-autocomplete size="mini" v-if="item.selectField==='supplierName'"
                                 style="width: 200px"
                                 popper-class="my-autocomplete"
                                 clearable
                                 class="inline-input"
                                 v-model="item.searchStr"
                                 :fetch-suggestions="querySearch"
                                 :trigger-on-focus="false"
                                 placeholder="请输入搜索内容"
                                 @select="searchManySelect($event,index)"
                                 @focus="searchSupplierFocus()"
                >
                </el-autocomplete>

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

                <el-input size="mini" v-model="item.searchStr" v-if="item.selectField === 'id'" clearable
                          style="width: 200px"
                          placeholder="请输入搜索内容"></el-input>
                <el-button type="danger" size="mini" icon="el-icon-delete" circle
                           @click="delSearch(index)"
                ></el-button>

              </li>
            </ul>
            <el-button type="primary" style="margin-left: 40px" size="mini" @click="addSearchItem()">添加额外搜索条件</el-button>

            <el-button slot="reference" type="info" style="padding: 0 0 ;margin-top: 20px;margin-left: -10px" size="mini" icon="el-icon-arrow-down" circle></el-button>

          </el-popover>

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
          <el-button size="mini" icon="el-icon-search" type="success" @click="search()">搜索</el-button>
        </el-form-item>


        <el-form-item v-if="hasAuth('repository:buyOut:save')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('repository:buyOut:save')"
                     @click="addSupplierMaterial()"

          >新增
          </el-button>
        </el-form-item>
        <el-form-item v-if="hasAuth('repository:buyOut:valid')">
          <el-popconfirm @confirm="statusPassBatch()" title="确定审核吗？">
            <el-button size="mini" icon="el-icon-success" :disabled="this.multipleSelection.length === 0 " type="danger"
                       slot="reference">批量审核
            </el-button>
          </el-popconfirm>
        </el-form-item>

        <el-form-item v-if="hasAuth('repository:buyOut:export')" style="margin-left: 0">
          <el-dropdown   @command="expChange">
            <el-button  icon="el-icon-download" size="mini">
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
          height="520px"
          fit
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
            type="selection"
            width="50">
        </el-table-column>
        <el-table-column
            label="单据编号"
            sortable
            prop="id" width="100px"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click=" edit(scope.row.id)"
            >{{ scope.row.id }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
            prop="buyOutDate"
            label="退料日期"
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
            width="90px"
            label="状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status === 0" type="success">已审核</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===1" type="warning">暂存</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===2" type="danger">审核中</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===3" type="danger">重新审核</el-tag>
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
            width="200px"
            show-overflow-tooltip
        >
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
            width="100px"

        >
        </el-table-column>

        <el-table-column
            prop="price"
            label="单价"
            width="70px"
            :filters=priceFileterArr
            :filter-method="filterHandler"
        >
        </el-table-column>

        <el-table-column
            prop="amount"
            label="金额"
            width="100px"
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
                       v-if="hasAuth('repository:buyOut:update') || (hasAuth('repository:buyOut:list') && scope.row.status != 1 )   ">{{ scope.row.status === 1 ? '编辑' : '查看' }}
            </el-button>

<!--            <el-divider direction="vertical"
                        v-if="hasAuth('repository:buyOut:save') && scope.row.status ===1   "></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('repository:buyOut:save')  && scope.row.status ===1   ">
              <template>
                <el-popconfirm @confirm="statusSubmit(scope.row.id)"
                               title="确定提交吗？"
                >
                  <el-button type="text" size="small" slot="reference">提交</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('repository:buyOut:save') && (scope.row.status === 2 || scope.row.status === 3 )   "></el-divider>

            <el-button class="elInput_action_my" type="text" style="padding: 0"
                       v-if="hasAuth('repository:buyOut:save')  && (scope.row.status === 2 || scope.row.status === 3)   ">
              <template>
                <el-popconfirm @confirm="statusSubReturn(scope.row.id)"
                               title="确定撤销吗？"
                >
                  <el-button type="text" size="small" slot="reference">撤销</el-button>
                </el-popconfirm>
              </template>
            </el-button>-->

            <el-button class="elInput_action_my" type="text" style="padding: 0"
                       v-if="hasAuth('repository:buyOut:valid')  && (scope.row.status === 2 || scope.row.status === 3)   ">
              <template>
                <el-popconfirm @confirm="statusPass(scope.row.id)"
                               title="确定设置审核通过吗？"
                >
                  <el-button type="text" size="small" slot="reference">审核通过</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('repository:buyOut:valid')  && scope.row.status ===0  ">
              <template>
                <el-popconfirm @confirm="statusReturn(scope.row.id)"
                               title="确定反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">反审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('repository:buyOut:del')  && scope.row.status ===1  "></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('repository:buyOut:del') && scope.row.status ===1   ">
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
            <printOut :tableData="editForm" :getChineseNumber="func.getChineseNumber"></printOut>
          </template>
        </vue-easy-print>

      </el-dialog>

      <!-- 采购退料弹窗 -->

      <el-dialog
          title="采购退料信息"
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

          <el-form-item v-if="false" prop="supplierId" style="margin-bottom: 0">
            <el-input v-model="editForm.supplierId"></el-input>
          </el-form-item>
          <el-form-item label="供应商" prop="supplierName" style="margin-bottom: 10px">
            <!-- 搜索框 -->
            <el-autocomplete
                :disabled="this.editForm.status!=1 "
                style="width: 250px"
                popper-class="my-autocomplete"

                class="inline-input"
                v-model="editForm.supplierName"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                placeholder="请输入供应商"
                @select="handleSelect"
                @change="moveMouse"
                @focus="searchSupplierFocus()"

                clearable
            >
            </el-autocomplete>
          </el-form-item>

          <el-form-item label="退料日期" prop="buyOutDate">
            <el-date-picker :disabled="this.editForm.status!=1" style="width: 150px"
                            value-format="yyyy-MM-dd"
                            v-model="editForm.buyOutDate"
                            type="date"
                            clearable
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item v-if="hasAuth('repository:buyIn:save')">
            <el-dropdown   @command="action">
              <el-button  icon="el-icon-edit-outline" size="mini" type="success">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="save" v-show="hasAuth('repository:buyOut:save') && this.editForm.status===1" >
                  提交单据</el-dropdown-item>
                <el-dropdown-item command="subReturn" v-show="hasAuth('repository:buyOut:save') && (this.editForm.status===2 || this.editForm.status===3)">
                  撤销</el-dropdown-item>
                <el-dropdown-item command="addNew" v-show="hasAuth('repository:buyOut:save') ">
                  新增</el-dropdown-item>
                <el-dropdown-item command="copy" v-show="hasAuth('repository:buyOut:save') ">
                  复制</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>

          <el-form-item style="margin-left: 0">
            <el-button @click="preViewPrint()" icon="el-icon-printer" type="primary"
            >打印预览
            </el-button>

          </el-form-item>

        </el-form>
        <el-divider content-position="left">明细信息</el-divider>

        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddDetails"
                   v-show="this.editForm.status===1   ">添加
        </el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteDetails"
                   v-show="this.editForm.status===1">删除
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

          <el-table-column style="padding: 0 0;" label="物料编码" align="center" width="310" prop="materialId">
            <template slot-scope="scope">
              <el-autocomplete size="mini" clearable style="width: 300px"
                               :disabled="editForm.status!=1 "
                               popper-class="my-autocomplete"

                               class="inline-input"
                               v-model="editForm.rowList[scope.row.seqNum - 1].materialId"
                               :fetch-suggestions="tableSearch"
                               placeholder="请输入内容"
                               :trigger-on-focus="false"
                               @select="tableSelectSearch($event,editForm.rowList[scope.row.seqNum - 1])"
                               @change="tableMoveMouse($event,editForm.rowList[scope.row.seqNum - 1],scope.row.seqNum - 1)"
                               @focus="searchMaterialAllFocus();addNext(scope.row.seqNum)"

              >
              </el-autocomplete>
            </template>

          </el-table-column>

          <el-table-column label="物料名称" align="center" prop="materialName" width="210">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" style="width: 200px"
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

          <el-table-column label="退料数量" align="center" width="100" prop="num">
            <template slot-scope="scope">
              <el-input
                  onkeyup="value=value.replace(/[^0-9.]/g,'')"
                  :ref='"input_num_"+scope.row.seqNum'
                  @input="changeNum(scope.row.seqNum,editForm.supplierId,scope.row.materialId,editForm.buyOutDate)"
                  @keyup.up.native="numUp(scope.row.seqNum)"
                  @keyup.down.native="numDown(scope.row.seqNum)"
                  @focus="addNext(scope.row.seqNum)"
                  :disabled="editForm.status!=1 " size="mini" v-model="editForm.rowList[scope.row.seqNum-1].num"/>
            </template>
          </el-table-column>
          <el-table-column label="金额" align="center" width="115" prop="amount">
            <template slot-scope="scope">
              <el-input size="mini" :disabled=true v-model="editForm.rowList[scope.row.seqNum-1].amount"/>
            </template>
          </el-table-column>

          <el-table-column label="备注" align="center" width="150" prop="comment">
            <template slot-scope="scope">
              <el-input  :disabled="editForm.status!=1" size="mini" v-model="editForm.rowList[scope.row.seqNum-1].comment"/>
            </template>
          </el-table-column>

        </el-table>

      </el-dialog>

      <!--价目列表 分页组件 -->
      <el-pagination

          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-sizes="[100, 200, 300, 10000]"
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
import printOut from "@/views/printModule/printOut";
import exportExcelCommon from"../common/ExportExcelCommon"
import {request2} from "@/axios";

export default {
  name: 'BuyOut',
  // 引入打印模块基础组件和该打印模块的模板页面
  components: {
    vueEasyPrint,
    printOut,
    exportExcelCommon
  },
  data() {
    return {
      priceFileterArr:[],
      // 多个搜索输入框
      manySearchArr:[{
        selectField:'supplierName',
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
          prop: 'buyOutDate',
          label: '退料日期',
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
        ],
      //导出excel表格id及excel名称
      exportExcelInfo: {
        excelId: 'record-table',
        excelName: '采购退料列表.xlsx'
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
        id: '',
        supplierId: '',
        supplierName: '',
        materialName: '',
        materialId: '',
        buyOutDate: '',
        totalAmount:'',

        rowList: [{
          materialName:'',
          unit:'',
          materialId:'',
          num:'',
          specs:'',
          comment:'',
          price:'',
          amount:''
        }]
      },
      rules: {
        supplierName: [
          {required: true, message: '请输入供应商', change: 'blur'}
        ],
        supplierDocumentNum: [
          {required: true, message: '请输入供应商单据编号', trigger: 'blur'}
        ],
        buyOutDate: [
          {required: true, message: '请输入退料日期', trigger: 'blur'}
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
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    rowClass({ row, rowIndex }) {
      if (this.multipleSelection.includes(row.id)) {
        return { "background-color": "rgba(255,235,205, 0.75)" };
      }
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
        selectField:'supplierName',
        searchStr:'',
      }
      this.manySearchArr.push(obj)
    },

    chooseTag(tag){
      console.log("选中tag:",tag)
      this.select = tag.searchField
      this.searchStr = tag.searchStr;
      this.searchStartDate = tag.searchStartDate;
      this.searchEndDate = tag.searchEndDate;
      let arr = tag.searchStatus.split(",");
      let tmpArr = [];
      for (let i = 0; i < arr.length; i++) {
        tmpArr.push(parseInt(arr[i]));
      }
      this.checkedBox=tmpArr

      //
      var obj = JSON.parse(tag.searchOther);
      console.log("解析json:",obj)
      if(obj === null){
        this.manySearchArr = [];
      }else{
        this.manySearchArr = obj;
      }
      this.getBuyOutDocumentList();
    },
    async loadTags(){
      await request.get('/tag/list?type='+2).then(res => {
        this.dynamicTags = res.data.data;

      })
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async handleInputConfirm() {

      let inputValue = this.inputValue;
      // if (inputValue) {
      //   this.dynamicTags.push(inputValue);
      // }
      // 添加到数据库
      let checkStr = this.checkedBox.join(",");
      await request.post('/tag/save?tagName='+inputValue+'&&type='+2+
          "&&searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select+
          "&&searchStatus="+checkStr+
          '&&searchStr='+this.searchStr,
          this.manySearchArr,null).then(res => {
        this.$message({
          message: res.data.data,
          type: 'success'
        });
      })
      this.inputVisible = false;
      this.inputValue = '';
      await this.loadTags()
    },
    async tagClose(tag) {
      // 删除到数据库
      await request.get('/tag/del?tagName='+tag.tagName+'&&type='+2).then(res => {
        this.$message({
          message: res.data.data,
          type: 'success'
        });
      })
      await this.loadTags()
    },

    dialogOpend(){
      if(this.editForm.id != '' && this.editForm.id != undefined){
        console.log("打开编辑页面.锁住...",this.editForm.id);
        request.get('/repository/buyOut/lockById?id=' + this.editForm.id)
      }
    },
    addNext(seq){
      if(this.editForm.rowList.length === seq){
        this.handleAddDetails();
      }
    },

     changeNum(seq,supplierId,materialId,buyIndate){
      console.log("supplierId materialid:,buyIndate",supplierId,materialId,buyIndate)
      // 获取该物料，该日期的单价信息
      if(this.editForm.rowList[seq-1].price === '' || this.editForm.rowList[seq-1].price === undefined){
         request.get('/baseData/supplierMaterial/queryByValidPrice?supplierId='+supplierId+'&&materialId='+materialId
            +'&&date='+buyIndate).then(res => {
          if(res.data.data != null){
            this.editForm.rowList[seq-1].price = res.data.data
            this.editForm.rowList[seq-1].amount = (this.editForm.rowList[seq-1].price * this.editForm.rowList[seq-1].num).toFixed(2)
          }
        })
      }else{
        console.log("price:,num",this.editForm.rowList[seq-1].price,this.editForm.rowList[seq-1].num)
        this.editForm.rowList[seq-1].amount = (this.editForm.rowList[seq-1].price *  this.editForm.rowList[seq-1].num).toFixed(2)
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
    // 打印按钮事件
    printDemo() {
      this.$refs.easyPrint.print()
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
    // 采购退料详细信息-添加
    handleAddDetails() {
      if (this.editForm.rowList == undefined) {
        console.log("editForm 初始化")
        this.editForm.rowList = [];
      }
      let obj = {};
      obj.materialName = "";
      obj.unit = "";
      obj.materialId = '';
      obj.num = ''
      obj.specs = ''
      obj.comment = ''
      obj.price = ''
      obj.amount = ''
      this.editForm.rowList.push(obj);
      console.log("现有的数据:", this.editForm.rowList)
    },
    // 采购退料详细信息-删除
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
        let newArr = this.getNewArr(this.editForm.rowList,this.checkedDetail);
        this.editForm.rowList = newArr
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
      this.editForm.rowList.forEach(rows=>{
        rows.price = ''
        rows.amount = ''
      })
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
            this.editForm.supplierId = item.id
            this.editForm.supplierName = item.name
            throw new Error();
          } else {
            this.editForm.supplierId = ''
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

            rowObj.num = ''
            rowObj.comment = ''
          }

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
    // 退料列表 点击添加按钮
    addSupplierMaterial() {
      this.addOrUpdate = 'save'
      this.editForm = {
        status: 1, // 编辑表单初始默认值
        id: '',
        supplierId: '',
        supplierName: '',
        materialName: '',
        materialId: '',
        buyOutDate: new Date().format("yyyy-MM-dd"),
        totalAmount:'',

        rowList: [{
          materialName:'',
          unit:'',
          materialId:'',
          num:'',
          specs:'',
          comment:'',
          price:'',
          amount:''
        }]
      }
      this.dialogVisible = true
    },

    // 分页方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getBuyOutDocumentList()

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getBuyOutDocumentList()

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

          let emptyArr = []; // 存放空内容 的 下标。
          for (let i = 0; i < this.editForm.rowList.length; i++) {
            let obj = this.editForm.rowList[i];

            if((obj.num === undefined || obj.num === '') && (obj.materialId === '')){
              emptyArr.push(i+1);
              continue;
            }
            if (obj.num === undefined || obj.num === '') {
              validateFlag = false
            }
            if (obj.materialId === '') {
              validateMaterial = false
            }
          }
          // 移除空的数组内容
          console.log("移除前的内容:",this.editForm.rowList)
          let newArr = this.getNewArr(this.editForm.rowList,emptyArr);
          this.editForm.rowList = newArr
          console.log("移除后的内容:",this.editForm.rowList)

          if (validateMaterial === false) {
            this.$message({
              message: '物料不能为空!',
              type: 'error'
            });
            return
          }

          if (validateFlag === false) {
            this.$message({
              message: '退料数量不能为空!',
              type: 'error'
            });
            return
          }
          if(this.editForm.rowList.length === 0){
            this.$message({
              message: '详情内容不能为空!',
              type: 'error'
            });
            return
          }

          request.post('/repository/buyOut/' + methodName, this.editForm).then(res => {
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

            // 关闭弹窗并且重置内容
            // this.dialogVisible = false;
            // this.resetForm("editForm")
            // this.handleDeleteAllDetails()
            // this.getBuyOutDocumentList()

          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    search(){
      this.currentPage = 1;
      this.getBuyOutDocumentList();
    },
    // 查询价目表单列表数据
    getBuyOutDocumentList() {
      this.tableLoad = true;
      let checkStr = this.checkedBox.join(",");
      console.log("搜索字段:", this.select)
      request.post('/repository/buyOut/list?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&total="+this.total+
          "&&searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select+
          "&&searchStatus="+checkStr,
          {'manySearchArr':this.manySearchArr,'searchStr':this.searchStr},
          null).then(res => {
        let set = new Set();
        res.data.data.records.forEach(row => {
          set.add(row.price);
        });
        console.log("price set集合:",set)
        let tmpSortArr = Array.from(set).sort(this.$globalFun.numSeq);
        this.priceFileterArr = [];
        tmpSortArr.forEach(row =>{
          this.priceFileterArr.push({'text':row,'value':row})
        })
        console.timeEnd("str") //结束

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
      request.get('/repository/buyOut/queryById?id=' + id).then(res => {
        let result = res.data.data
        this.dialogVisible = true
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.editForm = result
          this.editForm.rowList.forEach(obj => {
            obj.amount = (obj.price * obj.num).toFixed(2)
          })
        })

      })
    },
    statusPassBatch(){
      let ids = this.multipleSelection;
      request.post('/repository/buyOut/statusPassBatch',ids).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getBuyOutDocumentList()
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
      request.post('/repository/buyOut/del', ids).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getBuyOutDocumentList()
        console.log("删除后重新加载页面")

      })
    },
    // 撤销提交
    statusSubReturn(id) {
      request.get('/repository/buyOut/statusSubReturn?id=' + id).then(res => {
        this.$message({
          message: '已撤销!',
          type: 'success'
        });
        this.editForm.status = 1;
        this.getBuyOutDocumentList()
      })
    },
    // 状态提交
    statusSubmit(id) {
      request.get('/repository/buyOut/statusSubmit?id=' + id).then(res => {
        this.$message({
          message: '已提交!',
          type: 'success'
        });
        this.getBuyOutDocumentList()
      })
    },
    // 状态待审核
    statusPass(id) {
      request.get('/repository/buyOut/statusPass?id=' + id).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getBuyOutDocumentList()
      })
    },
    // 状态反审核
    statusReturn(id) {
      request.get('/repository/buyOut/statusReturn?id=' + id).then(res => {
        this.$message({
          message: '反审核完成!',
          type: 'success'
        });
        this.getBuyOutDocumentList()
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
        request.get('/repository/buyOut/lockOpenById?id=' + this.editForm.id)
      }
      this.$refs['editForm'].resetFields();
      this.handleDeleteAllDetails()
      this.getBuyOutDocumentList()
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
      } else if (columnIndex === 9) {
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
        if (index === 6 || index === 7) {
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
          }else if(index === 7){
            this.editForm.totalAmount = sums[index];
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
        if (index === 8) {
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
      console.log("buyout print：")

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
        this.addSupplierMaterial();
      }
      else if(item === 'copy'){
        this.closeBrowser();
        this.editForm.id = '';
        this.editForm.status = 1;
        this.addOrUpdate = 'save';
      }
    },
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
    exportCurrent() {

      request2.post('/repository/buyOut/export?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&total="+this.total+
          "&&searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select
          ,{'manySearchArr':this.manySearchArr,'searchStr':this.searchStr},{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'采购退料当前页.xlsx')
      }).catch()
    },
    // 导出列表数据- 服务端写出字节流到浏览器，进行保存
    exportAll() {

      request2.post('/repository/buyOut/export?'+
          "searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select
          ,{'manySearchArr':this.manySearchArr,'searchStr':this.searchStr},{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'采购退料全部列表.xlsx')
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
    async closeBrowser(){
      if(this.editForm.id != '' && this.editForm.id != undefined){
        console.log("关闭编辑页面.打开锁...",this.editForm.id);
        await request.get('/repository/buyOut/lockOpenById?id=' + this.editForm.id)
      }
    },
    searchMmaterialFocus(){
      console.log("物料搜索框聚焦")
      this.loadMaterialAll()
    },
    searchSupplierFocus(){
      console.log("供应商搜索框聚焦")
      this.loadSupplierAll()
    },
    searchMaterialAllFocus(){
      this.loadTableSearchMaterialDetailAll()
    },
    handleEvent(){

      if (event.keyCode === 80&& event.ctrlKey) {
        this.preViewPrint();
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
    this.getBuyOutDocumentList()
    this.loadSupplierAll()
    this.loadMaterialAll()
    this.loadTableSearchMaterialDetailAll()
    this.loadTags()
  },mounted() {
    window.addEventListener( 'beforeunload', e => this.closeBrowser() );

  }
  ,
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

<style>
.el-table tbody tr:hover>td {
  background-color:#FFF !important
}
</style>

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