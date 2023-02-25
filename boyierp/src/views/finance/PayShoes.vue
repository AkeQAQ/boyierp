<template>

  <el-container>
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

          <!-- 客户货号 -->
          <div v-if="selectedName === 'customerNum'" :class=" 'el-input el-input--mini'" style="margin: 0 0">
            <input  @keyup.enter="search()" class="el-input__inner" style="width: 200px"  placeholder="请输入搜索内容"
                    v-model.lazy="searchStr">
            </input>
          </div>

          <!-- id -->
          <div v-if="selectedName === 'documentNum'" :class=" 'el-input el-input--mini'" style="margin: 0 0">
            <input  @keyup.enter="search()" class="el-input__inner" style="width: 200px"  placeholder="请输入搜索内容"
                    v-model.lazy="searchStr">
            </input>
          </div>

          <!-- 列表界面-供应商搜索 -->
          <el-autocomplete size="mini" v-if="selectedName==='supplierName'"
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
              <!-- 客户货号 -->
              <div v-if="item.selectField==='customerNum'" :class=" 'el-input el-input--mini'" style="width: 200px">
                <input   class="el-input__inner"   placeholder="请输入搜索内容"
                         v-model.lazy="item.searchStr">
                </input>
              </div>


              <!-- id -->
              <div v-if="item.selectField === 'documentNum'" :class=" 'el-input el-input--mini'" style="width: 200px">
                <input   class="el-input__inner"   placeholder="请输入搜索内容"
                         v-model.lazy="item.searchStr">
                </input>
              </div>

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

        <el-form-item >
          <el-select
              size ="mini"
              v-model="takeStatus"
              multiple
              collapse-tags
              style="margin-left: 0;width: 150px"
              placeholder="请选择单据状态">
            <el-option
                v-for="item in takeStatusArr"
                :key="item.val"
                :label="item.name"
                :value="item.val">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item >
          <el-select
              size ="mini"
              v-model="payTypeStatus"
              multiple
              collapse-tags
              style="margin-left: 0;width: 150px"
              placeholder="请选择赔鞋类型">
            <el-option
                v-for="item in payTypeStatusArr"
                :key="item.val"
                :label="item.name"
                :value="item.val">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" icon="el-icon-search" @click="search()" type="success">搜索</el-button>
        </el-form-item>


        <el-form-item v-if="hasAuth('finance:payShoes:save')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('finance:payShoes:save')"
                     @click="addProductConstituent()"

          >新增
          </el-button>
        </el-form-item>

        <el-form-item v-if="hasAuth('finance:payShoes:valid')">
          <el-popconfirm @confirm="statusPassBatch()" title="确定审核吗？">
            <el-button size="mini" icon="el-icon-success" :disabled="this.multipleSelection.length === 0 " type="danger"
                       slot="reference">批量审核
            </el-button>
          </el-popconfirm>
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
            prop="id" width="70px "
        >
        </el-table-column>

        <el-table-column
            label="单据编号"
            prop="documentNum"
            width="150px"
            show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click=" edit(scope.row.id)"
            >{{ scope.row.documentNum }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
            label="罚款日期"
            prop="payDate"
            width="90px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            prop="supplierName"
            label="供应商名称"
            width="110px"
            show-overflow-tooltip>
        </el-table-column>


        <el-table-column
            prop="takeStatus"
            width="70px"
            label="单据状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.takeStatus === 0" type="success">已拿</el-tag>
            <el-tag size="small" v-else-if="scope.row.takeStatus===1" type="warning">未拿</el-tag>
          </template>
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
            width="80px"
            label="有无照片">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.picUrl !=null && scope.row.picUrl !='' && scope.row.picUrl !=undefined" type="success">有照片</el-tag>
            <el-tag size="small" v-else type="danger">无照片</el-tag>

          </template>
        </el-table-column>


        <el-table-column
            prop="customerNum"
            label="客户货号"
            width="150px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="payNumber"
            label="罚款数量"
            width="100px">
        </el-table-column>

        <el-table-column
            prop="payAmount"
            label="罚款金额"
            width="100px">
        </el-table-column>

        <el-table-column
            prop="payType"
            width="70px"
            label="赔鞋类型">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.payType === 0" type="success">大货</el-tag>
            <el-tag size="small" v-else-if="scope.row.payType===1" type="warning">残鞋</el-tag>
          </template>
        </el-table-column>


        <el-table-column
            prop="action"
            label="操作"
            fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row.id)"
                       v-if="hasAuth('finance:payShoes:update') || (hasAuth('finance:payShoes:list') && scope.row.status != 1 )   ">{{ scope.row.status === 1 ? '编辑' : '查看' }}
            </el-button>


            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('finance:payShoes:valid')  && (scope.row.status === 2 || scope.row.status === 3)   ">

              <template>
                <el-popconfirm @confirm="statusPass(scope.row.id)"
                               title="确定设置审核通过吗？"
                >
                  <el-button type="text" size="small" slot="reference">审核通过</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('finance:payShoes:valid')  && scope.row.status ===0  ">
              <template>
                <el-popconfirm @confirm="statusReturn(scope.row.id)"
                               title="确定反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">反审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('finance:payShoes:del')  && scope.row.status ===1  "></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('finance:payShoes:del') && scope.row.status ===1   ">
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

      <!-- 赔鞋弹窗 -->
      <el-dialog
          title="赔鞋信息"
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
          <el-form-item label="赔鞋单据编号"   prop="id" style="margin-bottom: 0">
            <el-input style="width: 150px" :disabled="this.editForm.status!==1" v-model="editForm.documentNum">
            </el-input>
          </el-form-item>

          <el-form-item label="供应商" prop="supplierName"  label-width="60px">
            <!-- 搜索框 -->
            <el-autocomplete
                style="width: 250px"
                :disabled="this.editForm.status!==1 "
                class="inline-input elAutocomplete_my"
                popper-class="my-autocomplete"

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

          <el-form-item label="入库日期" prop="payDate" label-width="70px">
            <el-date-picker :disabled="this.editForm.status!==1 " style="width: 130px;"
                            value-format="yyyy-MM-dd"
                            v-model="editForm.payDate"
                            type="date"
                            clearable
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item prop="takeStatus">
              <el-radio-group v-model="editForm.takeStatus" >
                <el-radio  :disabled="editForm.status!==0 " :label="0">已拿</el-radio>
                <el-radio  :disabled="editForm.status!==0 " :label="1">未拿</el-radio>
              </el-radio-group>

          </el-form-item>

          <el-form-item v-if="hasAuth('finance:payShoes:save')">
            <el-dropdown   @command="action">
              <el-button  icon="el-icon-edit-outline" size="mini" type="success">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="save" v-show="hasAuth('finance:payShoes:save') && (this.editForm.status===1 )" >
                  提交单据</el-dropdown-item>
                <el-dropdown-item command="subReturn" v-show="hasAuth('finance:payShoes:save') && (this.editForm.status===2 || this.editForm.status===3)">
                  撤销</el-dropdown-item>
                <el-dropdown-item command="addNew" v-show="hasAuth('finance:payShoes:save') ">
                  新增</el-dropdown-item>
                <el-dropdown-item command="copy" v-show="hasAuth('finance:payShoes:save') ">
                  复制</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>

          <el-form-item label="照片" label-width="40px">
            <!-- 新的缩略图-->
            <el-upload
                :disabled="!hasAuth('finance:payShoes:update') || this.fileList.length >=1 || this.editForm.status !=0"
                :class="{disabled:uploadDisabled}"
                action="#"
                ref="upload"
                :http-request="uploadRequest"
                :file-list="fileList"
                list-type="picture-card"
                :auto-upload="true">
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{file}">
                <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url" alt=""
                >
                <span class="el-upload-list__item-actions">
                  <span
                      class="el-upload-list__item-preview"
                      @click="showPic(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span
                      v-if="hasAuth('finance:payShoes:update')  && editForm.status ===0"
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file,editForm.id)"
                  >
                      <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>

            <el-dialog :visible.sync="dialogOnePicVisible" :append-to-body=true top="0vh">
              <img width="100%" :src="dialogOneImageUrl" alt="">
            </el-dialog>
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

          <el-table-column label="客户货号" align="center" width="200" prop="customerNum">
            <template slot-scope="scope">
              <el-input
                         :disabled="editForm.status!=1 "
                         size="mini" v-model="editForm.rowList[scope.row.seqNum-1].customerNum"/>
            </template>
          </el-table-column>

          <el-table-column label="数量" align="center" width="100" prop="payNumber">
            <template slot-scope="scope">
              <el-input
                  :disabled="editForm.status!=1 "
                  size="mini" v-model="editForm.rowList[scope.row.seqNum-1].payNumber"/>
            </template>
          </el-table-column>

          <el-table-column label="金额" align="center" width="150" prop="payAmount">
            <template slot-scope="scope">
              <el-input
                  :disabled="editForm.status!=1 "
                  size="mini" v-model="editForm.rowList[scope.row.seqNum-1].payAmount"/>
            </template>
          </el-table-column>

          <el-table-column label="类型" align="center" width="300" prop="payType">
            <template slot-scope="scope">
              <el-radio-group v-model="editForm.rowList[scope.row.seqNum-1].payType">
                <el-radio :disabled="editForm.status!=1" :label="0">大货</el-radio>
                <el-radio :disabled="editForm.status!=1" :label="1">残鞋</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>

        </el-table>

      </el-dialog>

      <el-dialog :visible.sync="dialogPicVisible" top="0vh" >
        <img width="100%" :src="dialogImageUrl" alt="">
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

// POI，因为响应输出字节流，和ajax 的请求不一样。
import {request} from "@/axios";
import {sysbaseUrl} from "@/axios";

export default {
  name: 'PayShoes',
  data() {
    return {
      fileList: [],
      dialogOnePicVisible:false,
      dialogOneImageUrl:'',

      oneMaterialPrices:[],
      specialAddOldSeq:99999,
      dialogImageUrl :'',
      dialogPicVisible:false,

      // 多个搜索输入框
      manySearchArr:[{
        selectField:'customerNum',
        searchStr:'',
      }],

      tableLoad:false,
      statusArr : [{'name':'暂存','val':1},{'name':'审核中','val':2},{'name':'已审核','val':0},{'name':'重新审核','val':3}],
      checkedBox:[1,2,3,0],

      takeStatusArr : [{'name':'未拿','val':1},{'name':'已拿','val':0}],
      takeStatus:[1,0],

      payTypeStatusArr : [{'name':'残鞋','val':1},{'name':'大货','val':0}],
      payTypeStatus:[1,0],

      searchStartDate: '',
      searchEndDate: '',


      //选中的从表数据
      checkedDetail: [],

      // 搜索字段
      selectedName: 'supplierName',// 搜索默认值
      options: [
        {value: 'supplierName', label: '供应商名称'},
        {value: 'customerNum', label: '客户货号'},
        {value: 'documentNum', label: '罚款单号'},

      ],
      select: 'supplierName', // 搜索默认值
      searchStr: '',
      searchStrList: [],
      searchField: '',
      restaurants: [],// 搜索框列表数据存放
      restaurants2: [], //
      restaurants3: [], //用于增量表格的搜索框内容
      restaurantsCustomer: [], //

      // 分页字段
      currentPage: 1 // 当前页
      , pageSize: 50 // 一页多少条
      , total: 0 // 总共多少数据
      ,
      // 表单字段
      addOrUpdate: 'save',
      editForm: {
        status: 1, // 审核状态
        takeStatus: 1, // 审核状态
        id: '',
        documentNum:'',
        payDate: new Date().format("yyyy-MM-dd") ,
        supplierId: '',

        picUrl:'',
        rowList: [{
          customerNum:'',
          payNumber:'',
          payAmount:'',
          payType:0,//赔鞋类型

        }]
      },
      dialogVisible: false,
      dialogRealDosageVisible: false,
      tableData: [],
      tableRealDosageData: [],
      spanArr: [],
      pos: '',
      multipleSelection: [] // 多选框数组

    }
  },
  methods: {
    dialogOpend(){
      if(this.editForm.id !== '' && this.editForm.id !== undefined){
        console.log("打开编辑页面.锁住...",this.editForm.id);
        request.get('/finance/supplierPayshoes/lockById?id=' + this.editForm.id)
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
      if (columnIndex===0|| columnIndex===1||columnIndex===2||columnIndex===3||columnIndex===4||columnIndex===5
          ||columnIndex===6||columnIndex===7||columnIndex===12) {

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
        if (index === 3 || index === 4) {
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
          if(index === 9){
            this.editForm.totalNum = sums[index];
            console.log("this.editForm.totalNum:",this.editForm.totalNum)
          }else if(index === 10){
            this.editForm.totalAmount = sums[index];
            console.log("this.editForm.totalAmount:",this.editForm.totalAmount)
          }
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
        if (index === 9 || index === 10) {
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
    handleRemove(file, id) {
      console.log("删除图片:",file)
      const url = file.url
      const i = this.fileList.findIndex(x => x.url === url)
      this.fileList.splice(i, 1)

      request({
        method: 'get',
        url: '/finance/supplierPayshoes/delPic?fileName='+file.name+"&&id="+id,
        headers: {'Content-Type': 'multipart/form-data'}
      }).then(res => {
        // 成功
        this.$message({
          message: '删除成功!',
          type: 'success'
        });

      })
    },

    uploadRequest(fileobj) {
      if(this.editForm.id ===null || this.editForm.id ===undefined || this.editForm.id ===''){
        this.$message.error("没有ID")
        this.fileList=[]
        return;
      }
      let param = new FormData()
      param.append('files', fileobj.file)
      console.log("上传的文件对象:",fileobj)
      request({
        method: 'post',
        url: '/finance/supplierPayshoes/uploadPic?id='+this.editForm.id,
        headers: {'Content-Type': 'multipart/form-data'},
        data: param
      }).then(res => {
        // 成功
        this.$message({
          message: '添加成功!',
          type: 'success'
        });

        this.$nextTick(() => {
          request.get('/finance/supplierPayshoes/getPicturesById?id='+this.editForm.id).then(res => {
            let data = res.data.data;
            this.fileList.push({name:data[data.length-1],url: sysbaseUrl+"/"+data[data.length-1]})
          })
        })


      })
    },


    searchSelect(item) {
      this.searchStr = item.name
    },
    showPic(file){
      this.dialogOneImageUrl = file.url;
      this.dialogOnePicVisible=true;

    },
    rowClass({ row, rowIndex }) {
      if (this.multipleSelection.includes(row.id)) {
        return { "background-color": "rgba(255,235,205, 0.75)" };
      }
    },
    statusPassBatch(){
      let ids = this.multipleSelection;
      request.post('/finance/supplierPayshoes/statusPassBatch',ids).then(res => {
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
        selectField:'customerNum',
        searchStr:'',
      }
      this.manySearchArr.push(obj)
    },

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

        this.addProductConstituent();
      }
      else if(item === 'copy'){
        this.closeBrowser();

        this.editForm.id = '';
        this.editForm.picUrl=''
        this.editForm.status = 1;
        this.dialogOneImageUrl=''
        this.fileList=[]

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
    // 赔鞋详细信息-添加
    handleAddDetails() {
      if (this.editForm.rowList == undefined) {
        console.log("editForm 初始化")
        this.editForm.rowList = [];
      }
      let obj = {};
      obj.customerNum = "";
      obj.payNumber = "";
      obj.payAmount = '';
      obj.payType = 0

      this.editForm.rowList.push(obj);
    },
    // 赔鞋详细信息-删除
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

    handleSelect(item) {
      this.editForm.supplierId = item.id
      this.editForm.supplierName = item.name
    },
    querySearch(queryString, cb) {
      let restaurants = this.restaurants;
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1) || ((restaurant.id).toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
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

    addProductConstituent() {
      this.addOrUpdate = 'save'
      this.editForm = {
        status: 1, // 审核状态
        takeStatus: 1, // 审核状态
        id: '',
        payDate: new Date().format("yyyy-MM-dd") ,
        supplierId: '',

        picUrl:'',
        rowList: [{
          customerNum:'',
          payNumber:'',
          payAmount:'',
          payType:0,//赔鞋类型

        }]
      }
      this.dialogOneImageUrl=''
      this.fileList=[]

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
          if(this.editForm.documentNum==='' || this.editForm.supplierId==='' || this.editForm.payDate===''){
            console.log("editForm",this.editForm)
            this.$message({
              message: '单据编号、供应商、日期不能为空',
              type: 'error'
            });
            return
          }
          if (this.editForm.rowList === undefined || this.editForm.rowList.length === 0) {
            this.$message({
              message: '请录入至少一个赔鞋信息',
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

            if((obj.payNumber === undefined || obj.payNumber === '') && (obj.customerNum === '')){
              emptyArr.push(i+1);
              continue;
            }
            if (obj.payNumber === undefined || obj.payNumber === '') {
              validateFlag = false
            }
            if (obj.customerNum === '') {
              validateMaterial = false
            }
          }
          // 移除空的数组内容
          console.log("移除前的内容:",this.editForm.rowList)
          this.editForm.rowList = this.getNewArr(this.editForm.rowList,emptyArr);
          console.log("移除后的内容:",this.editForm.rowList)

          if (validateMaterial === false) {
            this.$message({
              message: '客户货号不能为空!',
              type: 'error'
            });
            return
          }

          if (validateFlag === false) {
            this.$message({
              message: '赔鞋数量不能为空!',
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

          request.post('/finance/supplierPayshoes/' + methodName, this.editForm).then(res => {
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
      let takeStatus = this.takeStatus.join(",");
      let payTypeStatus = this.payTypeStatus.join(",");

      let url = '/finance/supplierPayshoes/list?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&searchField="+this.select+
          "&&searchStatus="+checkStr +
          "&&takeStatus="+takeStatus +
          "&&payTypeStatus="+payTypeStatus +
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
      request.get('/finance/supplierPayshoes/queryById?id=' + id).then(res => {
        let result = res.data.data
        // 查看图片
        request.get('/finance/supplierPayshoes/getPicturesById?id='+id).then(res => {
          let data = res.data.data;
          for (let i = 0; i < data.length; i++) {
            let oneFileName = data[i];
            this.fileList.push({name:oneFileName,url: sysbaseUrl+"/"+oneFileName})
          }
        })
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
      request.post('/finance/supplierPayshoes/del', ids).then(res => {
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
      request.get('/finance/supplierPayshoes/statusSubReturn?id=' + id).then(res => {
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
      request.get('/finance/supplierPayshoes/statusSubmit?id=' + id).then(res => {
        this.$message({
          message: '已提交!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 状态待审核
    statusPass(id) {
      request.get('/finance/supplierPayshoes/statusPass?id=' + id).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 状态反审核
    statusReturn(id) {
      request.get('/finance/supplierPayshoes/statusReturn?id=' + id).then(res => {
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
        request.get('/finance/supplierPayshoes/lockOpenById?id=' + this.editForm.id)
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

    searchSupplierFocus(){
      console.log("供应商搜索框聚焦")
      this.loadSupplierAll()
    },
    loadSupplierAll() {
      request.post('/baseData/supplier/getSearchAllData').then(res => {
        this.restaurants = res.data.data
      })
    },
    async closeBrowser(){
      if(this.editForm.id !== '' && this.editForm.id !== undefined){
        console.log("关闭编辑页面.打开锁...",this.editForm.id);
        await request.get('/finance/supplierPayshoes/lockOpenById?id=' + this.editForm.id)
      }
    },

  },
  computed:{
    uploadDisabled:function() {
      return this.fileList.length >0
    },
  },
  created() {
    this.getList()
    this.loadSupplierAll()
  },mounted() {
    window.addEventListener( 'beforeunload', e => this.closeBrowser() );

  },

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