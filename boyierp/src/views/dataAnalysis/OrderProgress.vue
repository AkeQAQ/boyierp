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
              <div v-if="item.selectField==='productNum'" :class=" 'el-input el-input--mini'" style="width: 200px">
                <input   class="el-input__inner"  placeholder="请输入搜索内容"
                        v-model.lazy="item.searchStr">
                </input>
              </div>

              <!-- 品牌 -->
              <div v-if="item.selectField==='productBrand'" :class=" 'el-input el-input--mini'" style="width: 200px">
                <input   class="el-input__inner"   placeholder="请输入搜索内容"
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

        <el-form-item>
          <el-button size="mini" icon="el-icon-data-analysis"  v-if="hasAuth('order:productOrder:import')" @click="calOrderNeedMaterials()" type="primary">产品订单导入计算物料</el-button>
        </el-form-item>

        <el-form-item v-if="hasAuth('order:productOrder:list')">
          <el-popconfirm @confirm="groupView()" title="确定物料分组统计吗？">
            <el-button size="mini" icon="el-icon-shopping-cart-full"  type="warning"
                       slot="reference">物料分组统计
            </el-button>
          </el-popconfirm>
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
            width="70px"
            show-overflow-tooltip
        >
        </el-table-column>


        <el-table-column
            label="公司货号"
            prop="productNum"
            width="80"
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
            prop="created"
            label="备料日期"
            width="90px"
            :formatter="gridDateFormatter"
            show-overflow-tooltip>
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
            <el-tag size="small" v-else-if="scope.row.prepared === 1" type="info">备料未确认</el-tag>
            <el-tag size="small" v-else-if="scope.row.prepared===0" type="success">备料已报(完成)</el-tag>
          </template>

        </el-table-column>

      </el-table>

      <el-dialog
          title="导入订单计算"
          :visible.sync="dialogCalMaterials"
          :before-close="handleImportClose"
          fullscreen
      >
        <el-form style="width: 100%;margin-bottom: -20px;margin-top: -30px;align-items: center"
                 :inline="true"
                 size="mini"
                 label-width="100px"
                 ref="editImportForm"
                 class="demo-editForm myFormClass">

          <el-form-item label="上传文件:">
            <el-upload
                class="upload-demo"
                ref="upload"
                :file-list="fileList"
                :http-request="uploadRequest"
                action=""
                :on-change="addFile"
                :on-remove="removeFile"
                :auto-upload="false"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div class="el-upload__tip" slot="tip">只能上传一个，且不超过5M</div>
            </el-upload>
          </el-form-item>

          <el-form-item  label="系统起始日期" prop="startDate">
            <el-date-picker style="width: 130px;"
                            value-format="yyyy-MM-dd"
                            v-model="editForm.startDate"
                            type="date"
                            clearable
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="系统截至日期" prop="endDate">
            <el-date-picker  style="width: 130px;"
                             value-format="yyyy-MM-dd"
                             v-model="editForm.endDate"
                             type="date"
                             clearable
                             placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item style="margin-left: 100px">
            <el-button type="primary"  @click="importExcel('editImportForm')">
              确认计算
            </el-button>
          </el-form-item>

        </el-form>


        <el-table
            ref="multipleTable2"
            :data="tableData2"
            v-if="tableData2.length>0"
            border
            stripe
            size="mini"
            :cell-style="{padding:'0'}"
            height="500px"
            tooltip-effect="dark"
            style="width: 100%;color:black;font-size: 20px">
          <el-table-column
              label="提示信息"
              prop="content"
          >
          </el-table-column>

        </el-table>

        <el-table
            :data="prepareBatchList"
            :row-class-name="rowClassName"
            ref="tb"
            height="580"
            size="mini"
            :cell-style="cellStyle"
            fit
        >

          <el-table-column label="序号" align="center" prop="seqNum" width="50"></el-table-column>

          <el-table-column label="物料编码" align="center" prop="materialId" width="100px">
            <template slot-scope="scope">
              <span style="text-align: left" @click="">{{prepareBatchList[scope.row.seqNum-1].materialId}}</span>
            </template>
          </el-table-column>
          <el-table-column label="物料名称" align="center" prop="materialName" width="300px">
            <template slot-scope="scope">
              <span style="text-align: left" @click="">{{prepareBatchList[scope.row.seqNum-1].materialName}}</span>
            </template>
          </el-table-column>


          <el-table-column label="库存单位" align="center" prop="materialUnit" width="80">
            <template slot-scope="scope">
              <span style="text-align: left">{{prepareBatchList[scope.row.seqNum-1].materialUnit}}</span>
            </template>
          </el-table-column>

          <el-table-column label="应报备料数目(合计)" align="center" width="130" prop="calNums">
            <template slot-scope="scope">
              <span style="text-align: left">{{prepareBatchList[scope.row.seqNum-1].calNums}}</span>
            </template>
          </el-table-column>
          <el-table-column label="系统净入库数量(合计)" align="center" width="150" prop="netInNums">
            <template slot-scope="scope">
              <span style="text-align: left">{{prepareBatchList[scope.row.seqNum-1].netInNums}}</span>
            </template>
          </el-table-column>

          <el-table-column label="明细" align="center" width="140" >
            <template slot-scope="scope">
              <el-popover
                  placement="bottom"
                  width="900"
                  trigger="click">
                <el-table :data="prepareBatchList[scope.row.seqNum-1].details"
                          :summary-method="getDetailSummaries"
                          show-summary
                          max-height="350"
                >
                  <el-table-column width="100" property="orderNum" label="订单号"></el-table-column>
                  <el-table-column width="100" property="productNum" label="公司货号"></el-table-column>
                  <el-table-column width="100" property="productBrand" label="品牌"></el-table-column>
                  <el-table-column width="100" property="productColor" label="颜色"></el-table-column>
                  <el-table-column width="100" property="orderNumber" label="订单数量"></el-table-column>
                  <el-table-column width="100" property="dosage" label="用料"></el-table-column>
                  <el-table-column width="100" property="calNum" label="应报备用量"></el-table-column>
                </el-table>
                <el-button slot="reference">查看明细</el-button>
              </el-popover>
            </template>

          </el-table-column>

        </el-table>


      </el-dialog>

      <el-dialog
          :visible.sync="dialogGroupMaterials"
          fullscreen
          title="进度表物料分组统计"
      >
        <el-table
            :data="groupMaterialsLists"
            :row-class-name="tableRowClassName"
            ref="groupMaterials"
            height="500"
            size="mini"
            :cell-style="cellStyle"
            fit
        >

          <el-table-column label="序号" align="center" prop="seqNum" width="50"></el-table-column>

          <el-table-column label="物料编码" align="center" prop="materialId" width="100px">
            <template slot-scope="scope">
              <span style="text-align: left" >{{groupMaterialsLists[scope.row.seqNum-1].materialId}}</span>
            </template>
          </el-table-column>
          <el-table-column label="物料名称" align="center" prop="materialName" width="300px">
            <template slot-scope="scope">
              <span style="text-align: left" >{{groupMaterialsLists[scope.row.seqNum-1].materialName}}</span>
            </template>
          </el-table-column>

          <el-table-column label="应报备料数目" align="center" width="130" prop="calNum">
            <template slot-scope="scope">
              <span style="text-align: left">{{groupMaterialsLists[scope.row.seqNum-1].calNum}}</span>
            </template>
          </el-table-column>

          <el-table-column label="已备料数量" align="center" width="140" prop="preparedNum">
            <template slot-scope="scope">
              <span style="text-align: left">{{groupMaterialsLists[scope.row.seqNum-1].preparedNum}}</span>
            </template>
          </el-table-column>

          <el-table-column label="入库数量" align="center" width="140" prop="inNum">
            <template slot-scope="scope">
              <span style="text-align: left">{{groupMaterialsLists[scope.row.seqNum-1].inNum}}</span>
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
      editForm:{
        startDate:new Date().format("yyyy-MM-dd") ,
        endDate:new Date().format("yyyy-MM-dd") ,
  },

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

      dialogCalMaterials:false,
      fileList: [],
      fileSizeIsSatisfy: false,
      tableData2: [],
      prepareBatchList:
          [

          ],
      groupMaterialsLists:[],
      dialogGroupMaterials:false

    }

  },

  methods: {
    tableRowClassName({row, rowIndex}) {
      row.seqNum = rowIndex + 1;

      if(parseFloat(this.groupMaterialsLists[row.seqNum-1].preparedNum) >  parseFloat (this.groupMaterialsLists[row.seqNum-1].inNum) ){
        return 'warning-row';
      }
      return '';
    },
    groupView(){
      request.post('/produce/orderMaterialProgress/groupMaterialView').then(res => {
        this.groupMaterialsLists = res.data.data;
        this.dialogGroupMaterials = true;
      })
    },
    rowClassName({row, rowIndex}) {
      row.seqNum = rowIndex + 1;
    },

    importExcel() {
      console.log("this.fileList",this.fileList)
      console.log("this.fileSizeIsSatisfy",this.fileSizeIsSatisfy)

      if(this.fileList.length <= 0 || this.fileList.length > 1){
        this.$message.error("请上传一个文件！");
        return;
      }
      if (!this.fileSizeIsSatisfy) {
        this.$message.error("上传失败！存在文件大小超过5M！");
        return;
      }
      this.$refs.upload.submit();
    },
    // 文件导入--------------------
    uploadRequest(fileobj) {
      const load = this.$loading({
        lock: true,
        text: '处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let param = new FormData()
      param.append('files', fileobj.file)

      request({
        method: 'post',
        url: '/produce/orderMaterialProgress/upload?startDate='+this.editForm.startDate+"&&endDate="+this.editForm.endDate,
        headers: {'Content-Type': 'multipart/form-data'},
        data: param
      }).then(res => {
        let theData = res.data.data;
        console.log("返回的内容:",theData)
        load.close()

        if(theData instanceof Array && theData.length > 0){
          this.tableData2 = theData
        }else {
          // 成功
          this.$message({
            message: '计算成功!',
            type: 'success'
          });
          // 关闭弹窗并且重置内容
          this.$refs['editImportForm'].resetFields();
          this.tableData2 = []
          this.fileList=[]
          this.fileSizeIsSatisfy=false;
          this.$refs.upload.clearFiles();

          this.prepareBatchList = res.data.data.datas;
        }

      }).catch(()=>{
        load.close()
      })
    },

    // 文件上传功能
    uploadUrl: function () {
      return "#";
    }
    ,
    // 判断文件大小
    addFile(file, fileList) {
      console.log("addFile")
      this.fileList = fileList;
      //限制上传文件为5M
      console.log("文件大小", file.size)
      this.fileSizeIsSatisfy = file.size < 5 * 1024 * 1024 ? true : false;
      return this.fileSizeIsSatisfy
    },
    // 判断文件大小
    removeFile(file, fileList) {
      console.log("removeFile")
      this.fileList = fileList;
    },

    // 关闭弹窗处理动作
    handleImportClose(done) {
      this.$refs['editImportForm'].resetFields();
      this.tableData2 = []
      this.prepareBatchList=[]
      this.fileList=[]
      this.fileSizeIsSatisfy=false;
      this.$refs.upload.clearFiles();
      console.log("关闭窗口")
      done();
    },
    calOrderNeedMaterials(){
      this.dialogCalMaterials = true;

    },

    //表格时间格式化的方法（格式化格式为：yyyy-MM-dd，其他格式类似）
    gridDateFormatter(row, column, cellValue, index) {
      const daterc = row[column.property];
      if (daterc) {
        const dateMat = new Date(daterc);
        const Y = dateMat.getFullYear() + "-";
        const M = (dateMat.getMonth() + 1) < 10 ? '0' + (dateMat.getMonth() + 1) + "-" : (dateMat.getMonth() + 1) + "-";
        const D = dateMat.getDate() < 10 ? '0' + dateMat.getDate() + " " : dateMat.getDate() + " ";
        return Y + M + D;
      }
    },
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
    getDetailSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '求和';
          return;
        }
        if (index === 6 ) {
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
        if (index === 0 ) {
          sums[index] = '求和';
          return;
        }
        if (index === 7 || index === 8|| index === 11) {
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
        if(!this.multipleSelection.some(item=>item==theId.id)){
          this.multipleSelection.push(theId.id)
        }
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
<style>
.el-table .warning-row {
  background: #e6aaaa;
}

</style>

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