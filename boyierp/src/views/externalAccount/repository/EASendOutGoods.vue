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

          <div v-if="selectedName === 'customerName'" :class=" 'el-input el-input--mini'" style="margin: 0 0">
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
              <el-select style="width: 100px" size="mini" v-model="item.selectField" filterable  placeholder="请选择搜索字段">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
              </el-select>

              <div :class=" 'el-input el-input--mini'" v-if="item.selectField === 'customerName'" style="width: 200px">
                <input  class="el-input__inner"   placeholder="请输入搜索内容"
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
        <el-form-item>

          <!-- 列表界面-日期搜索 -->
          <el-date-picker style="width: 125px;"
                          size="mini"
                          value-format="yyyy-MM-dd"
                          v-model="searchStartDate"
                          type="date"
                          clearable
                          placeholder="开始日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-date-picker style="width: 125px;"
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
              placeholder="请选择审核状态">
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


        <el-form-item v-if="hasAuth('externalAccount:sendOutGoods:list')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('externalAccount:sendOutGoods:list')"
                     @click="add()"

          >新增
          </el-button>
        </el-form-item>

        <el-form-item v-if="hasAuth('externalAccount:sendOutGoods:list')">
          <el-popconfirm @confirm="statusPassBatch()" title="确定审核吗？">
            <el-button size="mini" icon="el-icon-success" :disabled="this.multipleSelection.length === 0 " type="danger"
                       slot="reference">批量审核
            </el-button>
          </el-popconfirm>
        </el-form-item>

        <el-form-item >
          <el-dropdown   @command="otherBtn">
            <el-button  icon="el-icon-more" size="mini" >
              其他操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="batchPrint">批量打印</el-dropdown-item>
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

          show-summary
          :summary-method="getSummaries"
          size="mini"
          tooltip-effect="dark"
          style="width: 100%;color:black"
          :cell-style="{padding:'0',borderColor:'black'}"
          :header-cell-style="{borderColor:'black'}"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="50">
        </el-table-column>
        <el-table-column
            label="编号"
            prop="id" width="100px "
        >
        </el-table-column>


        <el-table-column
            label="出库日期"
            prop="sendDate"
            width="90px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            prop="customerName"
            label="客户"
            width="110px"
            show-overflow-tooltip>
        </el-table-column>


        <el-table-column
            prop="status"
            width="100px"
            label="审核状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status === 0" type="success">已审核</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===1" type="warning">暂存</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===2" type="danger">审核中</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===3" type="danger">重新审核</el-tag>
          </template>
        </el-table-column>


        <el-table-column
            prop="productNum"
            label="产品编码"
            width="150px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="productName"
            label="产品名称"
            width="150px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="unit"
            label="单位"
            width="100px">
        </el-table-column>

        <el-table-column
            prop="num"
            label="数量"
            width="100px">
        </el-table-column>

        <el-table-column
            prop="price"
            label="含税单价"
            width="100px">
        </el-table-column>

        <el-table-column
            prop="amount"
            label="金额"
            width="100px">
        </el-table-column>

        <el-table-column
            prop="comment"
            label="备注"
            width="100px">
        </el-table-column>

        <el-table-column
            prop="action"
            label="操作"
            fixed="right"
            width="150px"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row.id)"
                       v-if="hasAuth('externalAccount:sendOutGoods:list') || (hasAuth('externalAccount:sendOutGoods:list') && scope.row.status != 1 )   ">{{ scope.row.status === 1 ? '编辑' : '查看' }}
            </el-button>


            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('externalAccount:sendOutGoods:list')  && (scope.row.status === 2 || scope.row.status === 3)   ">

              <template>
                <el-popconfirm @confirm="statusPass(scope.row.id)"
                               title="确定设置审核通过吗？"
                >
                  <el-button type="text" size="small" slot="reference">审核通过</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('externalAccount:sendOutGoods:list')  && scope.row.status ===0  ">
              <template>
                <el-popconfirm @confirm="statusReturn(scope.row.id)"
                               title="确定反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">反审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('externalAccount:sendOutGoods:list')  && scope.row.status ===1  "></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('externalAccount:sendOutGoods:list') && scope.row.status ===1   ">
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

      <!-- 成品出库弹窗 -->
      <el-dialog
          title="成品出库信息"
          :visible.sync="dialogVisible"
          :before-close="handleClose"
          fullscreen

          @opened="dialogOpend()"

      >
        <el-form style="width: 100%;margin-bottom: -20px;margin-top: -30px;align-items: center"
                 size="mini" :inline="true"
                 label-width="100px"
                 :model="editForm"  ref="editForm"
                 class="demo-editForm">

          <el-form-item label="编号" prop="id" >
            <el-input style="width: 150px" :disabled=true placeholder="保存自动生成" v-model="editForm.id">
            </el-input>
          </el-form-item>

          <el-form-item  label="客户" prop="customerName" >
            <div :class=" [(this.editForm.status!=1 )? 'el-input el-input--mini is-disabled' :'el-input el-input--mini']" >
              <input class="el-input__inner"
                      v-model.lazy="editForm.customerName">
              </input>
            </div>

          </el-form-item>


          <el-form-item label="出库日期" prop="sendDate" label-width="70px">
            <el-date-picker :disabled="this.editForm.status!==1 " style="width: 130px;"
                            value-format="yyyy-MM-dd"
                            v-model="editForm.sendDate"
                            type="date"
                            clearable
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item v-if="hasAuth('externalAccount:sendOutGoods:list')">
            <el-dropdown   @command="action">
              <el-button  icon="el-icon-edit-outline" size="mini" type="success">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="save" v-show="hasAuth('externalAccount:sendOutGoods:list') && (this.editForm.status===1 )" >
                  提交单据</el-dropdown-item>
                <el-dropdown-item command="subReturn" v-show="hasAuth('externalAccount:sendOutGoods:list') && (this.editForm.status===2 || this.editForm.status===3)">
                  撤销</el-dropdown-item>
                <el-dropdown-item command="addNew" v-show="hasAuth('externalAccount:sendOutGoods:list') ">
                  新增</el-dropdown-item>
                <el-dropdown-item command="copy" v-show="hasAuth('externalAccount:sendOutGoods:list') ">
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
                   v-show="this.editForm.status===1 ">添加
        </el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteDetails"
                   v-show="this.editForm.status===1 " >删除
        </el-button>

        <el-table
            :data="editForm.rowList"
            :row-class-name="rowClassName"
            show-summary
            :summary-method="getDetailSummaries"
            ref="tb"
            height="500"
            size="mini"
            :cell-style="cellStyle"
            fit
            @selection-change="handleDetailSelectionChange"

        >
          <el-table-column type="selection" width="80" align="center"   >
          </el-table-column>
          <el-table-column label="序号" align="center" prop="seqNum" width="50"></el-table-column>

          <el-table-column label="产品编码" align="center" prop="productNum" width="280">
            <template slot-scope="scope">
              <el-input size="mini"  style="width: 260px"  :disabled="editForm.status!==1 "
                        v-model="editForm.rowList[scope.row.seqNum-1].productNum"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="产品名称" align="center" prop="productName" width="280">
            <template slot-scope="scope">
              <el-input size="mini"  style="width: 260px"  :disabled="editForm.status!==1 "
                        v-model="editForm.rowList[scope.row.seqNum-1].productName"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="产品单位" align="center" prop="unit" width="100">
            <template slot-scope="scope">
              <el-input size="mini"  :disabled="editForm.status!==1 " v-model="editForm.rowList[scope.row.seqNum-1].unit"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="数量" align="center" width="100" prop="num">
            <template slot-scope="scope">
              <el-input
                  :disabled="editForm.status!==1 "
                  size="mini" v-model="editForm.rowList[scope.row.seqNum-1].num"
                  @input="changeNum(scope.row.seqNum)"
                  onkeyup="value=value.replace(/[^0-9.]/g,'')"

              />


            </template>
          </el-table-column>

          <el-table-column label="含税单价" align="center" width="100" prop="price">
            <template slot-scope="scope">
              <el-input
                  :disabled="editForm.status!==1 "
                  size="mini" v-model="editForm.rowList[scope.row.seqNum-1].price"
                  @input="price(scope.row.seqNum)"
                  onkeyup="value=value.replace(/[^0-9.]/g,'')"

              />
            </template>
          </el-table-column>
          <el-table-column label="金额" align="center" width="150" prop="amount">
            <template slot-scope="scope">
              <el-input
                  :disabled="true"
                  size="mini" v-model="editForm.rowList[scope.row.seqNum-1].amount"/>
            </template>
          </el-table-column>

          <el-table-column label="备注" align="center" width="250" prop="comment">
            <template slot-scope="scope">
              <el-input
                  :disabled="editForm.status!==1 "

                  size="mini" v-model="editForm.rowList[scope.row.seqNum-1].comment"/>
            </template>
          </el-table-column>

        </el-table>

      </el-dialog>


      <!-- 打印弹窗 -->
      <el-dialog
          title=""
          :visible.sync="dialogVisiblePrint"
          width="55%"
          class="elDialog_print_my"
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


      <!-- 批量打印弹窗 -->
      <el-dialog
          title=""
          :visible.sync="dialogVisibleBatchPrint"
          width="55%"
          class="elDialog_print_my"
          :before-close="printBatchClose"
      >
        <el-button v-if="dialogVisibleBatchPrint"
                   @click="printBatchDemo"
                   v-focus ref="printBatchBtn"
                   size="mini" icon="el-icon-printer" type="primary">打印
        </el-button>
        <vue-easy-print tableShow ref="easyBatchPrint">
          <template slot-scope="func">
            <print-batch :tableData="editBatchForm" :getChineseNumber="func.getChineseNumber"></print-batch>
          </template>
        </vue-easy-print>

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



    </el-main>

  </el-container>

</template>

<script>

import {request} from "@/axios";
// 引入打印基础组件，和打印模块print页面

import vueEasyPrint from "vue-easy-print";
import print from "@/views/printModule/EAprintSendOutGoods";
import printBatch from "@/views/printModule/EAprintSendOutGoodsBatch";
import exportExcelCommon from "@/views/common/ExportExcelCommon";

export default {
  name: 'EASendOutGoods',
  data() {
    return {
      dialogVisiblePrint: false,
      dialogVisibleBatchPrint: false,

      // 多个搜索输入框
      manySearchArr:[{
        selectField:'productName',
        searchStr:'',
      }],

      tableLoad:false,
      statusArr : [{'name':'暂存','val':1},{'name':'审核中','val':2},{'name':'已审核','val':0},{'name':'重新审核','val':3}],
      checkedBox:[1,2,3,0],

      searchStartDate: '',
      searchEndDate: '',

      //选中的从表数据
      checkedDetail: [],

      // 搜索字段
      selectedName: 'customerName',// 搜索默认值
      options: [
        {value: 'customerName', label: '客户'},

      ],
      select: 'customerName', // 搜索默认值
      searchStr: '',
      searchStrList: [],
      searchField: '',
      restaurants: [],// 搜索框列表数据存放
      restaurants2: [], //
      restaurants3: [], //

      // 分页字段
      currentPage: 1 // 当前页
      , pageSize: 50 // 一页多少条
      , total: 0 // 总共多少数据
      ,
      // 表单字段
      addOrUpdate: 'save',
      editForm: {
        status: 1, // 审核状态
        id: '',
        sendDate: new Date().format("yyyy-MM-dd") ,
        customerName: '',
        totalAmount:'',
        totalNum:'',
        rowList: [{
          productNum:'',
          productName:'',
          unit:'',
          num:'',
          price:'',
          amount:'',

        }]
      },
      dialogVisible: false,
      tableData: [],
      spanArr: [],
      multipleSelection: [], // 多选框数组
      editBatchForm:{'content':[
          {
            sendDate:'2022-04-23',
            id:'1',
            rowList:[
              {
                productNum:'',
                productName:'',
                unit:'',
                num:'',
                price:'',
                amount:'',
                totalNum:'7',
                totalAmount:'8'

              }
            ]
          }
        ]},
    }
  },// 引入打印模块基础组件和该打印模块的模板页面
  components: {
    vueEasyPrint,
    print,
    printBatch,
  },
  methods: {
    batchPrint(){
      if(this.multipleSelection.length ==0){
        this.$message.error("请至少选中一个")
        return;
      }
      let ids = this.multipleSelection;
      request.post('/externalAccount/repositorySendOutGoods/getBatchPrintByIds',ids).then(res => {
        this.editBatchForm.content = res.data.data;
        if (this.$refs.easyBatchPrint) {
          this.$refs.easyBatchPrint.tableData = this.editBatchForm
        }
        this.dialogVisibleBatchPrint = true
      })

    },
    otherBtn(item) {
       if(item === 'batchPrint'){
        this.batchPrint()
      }
    },
    printDemo() {
      this.$refs.easyPrint.print()
    },
    printBatchDemo() {
      this.$refs.easyBatchPrint.print()
    },
    // 关闭打印弹窗弹窗处理动作
    printClose(done) {
      this.$refs.easyPrint.tableShow = false;
      done();
    },
    // 关闭打印弹窗弹窗处理动作
    printBatchClose(done) {

      this.$refs.easyBatchPrint.tableShow = false;
      done();
    },
    preViewPrint() {
      if(this.editForm.id ==='' || this.editForm.id === undefined){
        this.$message.error("请先保存再打印.")
        return null;
      }
      if (this.editForm) {
        if (this.$refs.easyPrint) {
          console.log("totalAmount",this.editForm.totalAmount)

          this.$refs.easyPrint.tableData = this.editForm
        }
        this.dialogVisiblePrint = true

      } else {
        this.$message({
          message: '没有内容!',
          type: 'error'
        });
      }
    },
    changeNum(seq){
      if(this.editForm.rowList[seq-1].price !== ''){
        this.editForm.rowList[seq-1].amount = (this.editForm.rowList[seq-1].price *  this.editForm.rowList[seq-1].num).toFixed(2)
      }
    },
    price(seq){
      if(this.editForm.rowList[seq-1].num !== ''){
        this.editForm.rowList[seq-1].amount = (this.editForm.rowList[seq-1].price *  this.editForm.rowList[seq-1].num).toFixed(2)
      }
    },
    dialogOpend(){
      if(this.editForm.id !== '' && this.editForm.id !== undefined){
        console.log("打开编辑页面.锁住...",this.editForm.id);
        request.get('/externalAccount/repositorySendOutGoods/lockById?id=' + this.editForm.id)
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
      if (columnIndex===0|| columnIndex===1||columnIndex===2||columnIndex===3||columnIndex===4||columnIndex===13) {

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
        if (index === 5 || index === 7) {
          const values = data.map(item => Number(item[column.property]));
          console.log("index:values:",index,values)
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
        if(index === 5){
          this.editForm.totalNum = sums[index];
          console.log("this.editForm.totalNum:",this.editForm.totalNum)
        }else if(index === 7){
          this.editForm.totalAmount = sums[index];
          console.log("this.editForm.totalAmount:",this.editForm.totalAmount)
        }

      });

      return sums;
    },
    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0 ) {
          sums[index] = '求和';
          return;
        }
        if (index === 8 || index === 10) {
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
    rowClass({ row, rowIndex }) {
      if (this.multipleSelection.includes(row.id)) {
        return { "background-color": "rgba(255,235,205, 0.75)" };
      }
    },
    statusPassBatch(){
      let ids = this.multipleSelection;
      request.post('/externalAccount/repositorySendOutGoods/statusPassBatch',ids).then(res => {
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
        selectField:'productName',
        searchStr:'',
      }
      this.manySearchArr.push(obj)
    },
    // 查询搜索框列表数据
    addNext(seq){
      if(this.editForm.rowList.length === seq){
        this.handleAddDetails();
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
        this.closeBrowser();

        this.add();
      }
      else if(item === 'copy'){
        this.closeBrowser();

        this.editForm.id = '';
        this.editForm.status = 1;
        this.addOrUpdate = 'save';

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
    // 成品出库详细信息-添加
    handleAddDetails() {
      if (this.editForm.rowList == undefined) {
        console.log("editForm 初始化")
        this.editForm.rowList = [];
      }
      let obj = {};
      obj.productName = "";
      obj.productNum = "";
      obj.num = '';
      obj.price = ''
      obj.amount = ''
      obj.unit = ''


      this.editForm.rowList.push(obj);
    },
    // 成品出库详细信息-删除
    handleDeleteDetails() {
      if (this.checkedDetail.length == 0) {
        if(this.editForm.rowList.length === 0){
          this.$message({
            message: '没有记录可删除!',
            type: 'error'
          });
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

    add() {
      this.addOrUpdate = 'save'
      this.editForm = {
        status: 1, // 审核状态
        id: '',
        sendDate: new Date().format("yyyy-MM-dd") ,
        customerName: '',

        rowList: [{
          productNum:'',
          productName:'',
          num:'',
          price:'',
          amount:'',
          unit:'',

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
    handleSelectionChange(val) {
      console.log("多选框 val ", val)
      this.multipleSelection = []

      val.forEach(theId => {
        if(!this.multipleSelection.some(item=>item==theId.id)){
          this.multipleSelection.push(theId.id)
        }
      })
      console.log("多选框 选中的 ", this.multipleSelection)
    },
    // 表单提交
    submitForm(formName, methodName) {
      this.$refs[formName].validate((valid) => {

        if (valid) {
          if( this.editForm.customerName==='' || this.editForm.sendDate===''){
            console.log("editForm",this.editForm)
            this.$message({
              message: '客户、日期不能为空',
              type: 'error'
            });
            return
          }
          if (this.editForm.rowList === undefined || this.editForm.rowList.length === 0) {
            this.$message({
              message: '请录入至少一个成品出库信息',
              type: 'error'
            });
            return
          }

          let validateFlag = true;
          let validateMaterial = true;
          let validatePrice = true;

          console.log(this.editForm.rowList)
          let emptyArr = []; // 存放空内容 的 下标。
          for (let i = 0; i < this.editForm.rowList.length; i++) {
            let obj = this.editForm.rowList[i];
            console.log("obj:",obj)

            if((obj.productNum === undefined || obj.productNum === '') && (obj.num === '')){
              emptyArr.push(i+1);
              continue;
            }
            if (obj.num === undefined || obj.num === '') {
              validateFlag = false
            }
            if (obj.productNum === '') {
              validateMaterial = false
            }
            if (obj.price === '' || obj.price ===undefined) {
              validatePrice = false
            }
          }
          // 移除空的数组内容
          console.log("移除前的内容:",this.editForm.rowList)
          this.editForm.rowList = this.getNewArr(this.editForm.rowList,emptyArr);
          console.log("移除后的内容:",this.editForm.rowList)

          if (validateMaterial === false) {
            this.$message({
              message: '产品编号不能为空!',
              type: 'error'
            });
            return
          }

          if (validateFlag === false) {
            this.$message({
              message: '数量不能为空!',
              type: 'error'
            });
            return
          }
          if (validatePrice === false) {
            this.$message({
              message: '单价不能为空!',
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
          const load = this.$loading({
            lock: true,
            text: '处理中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          request.post('/externalAccount/repositorySendOutGoods/' + methodName, this.editForm).then(res => {
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
      this.tableLoad = true;
      let checkStr = this.checkedBox.join(",");

      let url = '/externalAccount/repositorySendOutGoods/list?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&searchField="+this.select+
          "&&searchStatus="+checkStr +
          "&&searchStartDate="+this.searchStartDate +
          "&&searchEndDate="+this.searchEndDate

      ;
      request.post(url,
          {'manySearchArr':this.manySearchArr,'searchStr':this.searchStr},
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
      request.get('/externalAccount/repositorySendOutGoods/queryById?id=' + id).then(res => {
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
      request.post('/externalAccount/repositorySendOutGoods/del', ids).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getList()
        console.log("删除后重新加载页面")

      })
    },

    // 撤销提交
    statusSubReturn(id) {
      request.get('/externalAccount/repositorySendOutGoods/statusSubReturn?id=' + id).then(res => {
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
      request.get('/externalAccount/repositorySendOutGoods/statusSubmit?id=' + id).then(res => {
        this.$message({
          message: '已提交!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 状态待审核
    statusPass(id) {
      request.get('/externalAccount/repositorySendOutGoods/statusPass?id=' + id).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 状态反审核
    statusReturn(id) {
      request.get('/externalAccount/repositorySendOutGoods/statusReturn?id=' + id).then(res => {
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

      if(this.editForm.id !== '' && this.editForm.id !== undefined){
        console.log("关闭编辑页面.打开锁...",this.editForm.id);
        request.get('/externalAccount/repositorySendOutGoods/lockOpenById?id=' + this.editForm.id)
      }
      this.$refs['editForm'].resetFields();
      this.fileList=[]
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

    // el-table 单元格样式修改
    cellStyle() {
      return 'padding:0 0'
    },

    async closeBrowser(){
      if(this.editForm.id !== '' && this.editForm.id !== undefined){
        console.log("关闭编辑页面.打开锁...",this.editForm.id);
        await request.get('/externalAccount/repositorySendOutGoods/lockOpenById?id=' + this.editForm.id)
      }
    },

  },
  created() {
    this.getList()
  },mounted() {
    window.addEventListener( 'beforeunload', e => this.closeBrowser() );
  }// 自定义指令，，insert在DOM加入的时候才生效
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
.el-form-item__label{
  text-align: left;
}
.disabled .el-upload--picture-card {
  display: none;
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