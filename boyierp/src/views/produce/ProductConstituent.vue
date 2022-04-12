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

        <el-form-item>
          <el-button size="mini" icon="el-icon-search" @click="search()" type="success">搜索</el-button>
        </el-form-item>


        <el-form-item v-if="hasAuth('produce:productConstituent:save')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('produce:productConstituent:save')"
                     @click="addProductConstituent()"

          >新增
          </el-button>
        </el-form-item>

        <el-form-item v-if="hasAuth('produce:productConstituent:valid')">
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
          border
          fit
          height="520px"

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
            label="编号"

            prop="id" width="90px "
        >
          <template slot-scope="scope">
            <el-button type="text" size="small"
                       @click=" edit(scope.row.id)"
            >{{ scope.row.id }}
            </el-button>
          </template>
        </el-table-column>


        <el-table-column
            label="公司货号"
            prop="productNum"
            width="210px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            prop="productBrand"
            label="品牌"
            width="310px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="productColor"
            label="颜色"
            width="100px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="status"
            width="110px"
            label="状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status === 0" type="success">已审核</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===1" type="warning">暂存</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===2" type="danger">审核中</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===3" type="danger">重新审核</el-tag>
          </template>
        </el-table-column>

        <el-table-column
            prop="action"
            label="操作"
            fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row.id)"
                       v-if="hasAuth('produce:productConstituent:update') || (hasAuth('produce:productConstituent:list') && scope.row.status != 1 )   ">{{ scope.row.status === 1 ? '编辑' : '查看' }}
            </el-button>


            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('produce:productConstituent:valid')  && (scope.row.status === 2 || scope.row.status === 3)   ">

              <template>
                <el-popconfirm @confirm="statusPass(scope.row.id)"
                               title="确定设置审核通过吗？"
                >
                  <el-button type="text" size="small" slot="reference">审核通过</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('produce:productConstituent:valid')  && scope.row.status ===0  ">
              <template>
                <el-popconfirm @confirm="statusReturn(scope.row.id)"
                               title="确定反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">反审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('produce:productConstituent:del')  && scope.row.status ===1  "></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('produce:productConstituent:del') && scope.row.status ===1   ">
              <template>
                <el-popconfirm @confirm="del(scope.row.id)"
                               title="确定删除吗？"
                >
                  <el-button type="text" size="small" slot="reference">删除</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('produce:productConstituent:del')  && scope.row.status ===0  "></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('produce:productConstituent:del') && scope.row.status ===0   ">
              <template>
                <el-popconfirm @confirm="addSpecialMaterial(scope.row.id)"
                               title="确定补充物料组成吗？"
                >
                  <el-button type="text" size="small" slot="reference">补充物料组成</el-button>
                </el-popconfirm>
              </template>
            </el-button>


          </template>
        </el-table-column>

      </el-table>

      <!-- 货号组成结构弹窗 -->
      <el-dialog
          title="货号组成结构信息"
          :visible.sync="dialogVisible"
          :before-close="handleClose"
          fullscreen
      >
        <el-form style="width: 100%;margin-bottom: -20px;margin-top: -30px;align-items: center"
                 size="mini" :inline="true"
                 label-width="100px"
                 :model="editForm"  ref="editForm"
                 class="demo-editForm">

          <el-form-item label="编号" prop="id" v-show="false" style="margin-bottom: 0">
            <el-input style="width: 150px" :disabled=true placeholder="保存自动生成" v-model="editForm.id">
            </el-input>
          </el-form-item>

          <el-form-item label="公司货号" prop="productNum" style="margin-bottom: 10px">
            <!-- 公司货号 -->
            <div  :class=" [(this.editForm.status!=1 )? 'el-input el-input--mini is-disabled' :'el-input el-input--mini']" style="margin: 0 0">
              <input  class="el-input__inner" style="width: 200px"
                      :disabled="editForm.status!=1"
                      v-model.lazy="editForm.productNum">
              </input>
            </div>
          </el-form-item>

          <el-form-item label="品牌" prop="productBrand" style="margin-bottom: 10px">
            <!-- 公司货号 -->
            <div  :class=" [(this.editForm.status!=1 )? 'el-input el-input--mini is-disabled' :'el-input el-input--mini']" style="margin: 0 0">
              <input  class="el-input__inner" style="width: 200px"
                      :disabled="editForm.status!=1"
                      v-model.lazy="editForm.productBrand">
              </input>
            </div>
          </el-form-item>

          <el-form-item label="颜色" prop="productColor" style="margin-bottom: 10px">
            <!-- 公司货号 -->
            <div  :class=" [(this.editForm.status!=1 )? 'el-input el-input--mini is-disabled' :'el-input el-input--mini']" style="margin: 0 0">
              <input  class="el-input__inner" style="width: 100px"
                      :disabled="editForm.status!=1"

                      v-model.lazy="editForm.productColor">
              </input>
            </div>
          </el-form-item>


          <el-form-item v-if="hasAuth('produce:productConstituent:save')">
            <el-dropdown   @command="action">
              <el-button  icon="el-icon-edit-outline" size="mini" type="success">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="save" v-show="hasAuth('produce:productConstituent:save') && (this.editForm.status===1 || this.specialAddFlag)" >
                  提交单据</el-dropdown-item>
                <el-dropdown-item command="subReturn" v-show="hasAuth('produce:productConstituent:save') && (this.editForm.status===2 || this.editForm.status===3)">
                  撤销</el-dropdown-item>
                <el-dropdown-item command="addNew" v-show="hasAuth('produce:productConstituent:save') ">
                  新增</el-dropdown-item>
                <el-dropdown-item command="copy" v-show="hasAuth('produce:productConstituent:save') ">
                  复制</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>

        </el-form>
        <el-divider content-position="left">明细信息</el-divider>

        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddDetails"
                   v-show="this.editForm.status===1 || this.specialAddFlag">添加
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
        >
          <el-table-column type="selection" width="80" align="center"/>
          <el-table-column label="序号" align="center" prop="seqNum" width="50"></el-table-column>

          <el-table-column style="padding: 0 0;" label="物料编码" align="center" width="320" prop="materialId">
            <template slot-scope="scope">
              <el-autocomplete
                                style="width: 300px"
                                popper-class="my-autocomplete"
                                size="mini" clearable
                               :disabled="editForm.status!=1  && !( specialAddFlag && scope.row.seqNum > specialAddOldSeq)"
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

          <el-table-column label="物料名称" align="center" prop="materialName" width="250">
            <template slot-scope="scope">
              <el-input size="mini" :disabled="true" style="width: 240px"
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

          <el-table-column label="用量" align="center" width="100" prop="dosage">
            <template slot-scope="scope">
              <el-input  :ref='"input_num_"+scope.row.seqNum'
                         onkeyup="value=value.replace(/[^0-9.]/g,'')"
                         @keyup.up.native="numUp(scope.row.seqNum)"
                         @keyup.down.native="numDown(scope.row.seqNum)"
                         @focus="addNext(scope.row.seqNum)"

                         :disabled="editForm.status!=1  && !( specialAddFlag && scope.row.seqNum > specialAddOldSeq)"
                         size="mini" v-model="editForm.rowList[scope.row.seqNum-1].dosage"/>
            </template>
          </el-table-column>

          <el-table-column label="图片预览">
            <template slot-scope="scope">
              <el-button icon="el-icon-search" circle  @click="handlePictureCardPreview(editForm.rowList[scope.row.seqNum-1].materialId)"></el-button>
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

import {request2} from "@/axios";

export default {
  name: 'ProductConstituent',
  data() {
    return {
      specialAddFlag:false,
      specialAddOldSeq:99999,

      dialogImageUrl :'',
      dialogPicVisible:false,

      // 多个搜索输入框
      manySearchArr:[{
        selectField:'productNum',
        searchStr:'',
      }],

      tableLoad:false,
      statusArr : [{'name':'暂存','val':1},{'name':'审核中','val':2},{'name':'已审核','val':0},{'name':'重新审核','val':3}],
      checkedBox:[1,2,3,0],

      //选中的从表数据
      checkedDetail: [],

      // 搜索字段
      selectedName: 'productNum',// 搜索默认值
      options: [
        {value: 'productNum', label: '公司货号'},
        {value: 'productBrand', label: '品牌'}
      ],
      select: 'productNum', // 搜索默认值
      searchStr: '',
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
        productNum: '',
        productBrand: '',
        productColor:'',
        rowList: [{
          materialName:'',
          unit:'',
          materialId:'',
          num:'',
          specs:'',
          dosage:'',
          picUrl:'',
          picUrls:''
        }]
      },
      dialogVisible: false,
      tableData: [],
      spanArr: [],
      pos: '',
      multipleSelection: [] // 多选框数组

    }
  },
  methods: {

    addSpecialMaterial(id){

      this.specialAddFlag=true;
      this.addOrUpdate = "update"
      request.get('/produce/productConstituent/queryById?id=' + id).then(res => {
        let result = res.data.data

        this.dialogVisible = true
        this.specialAddOldSeq=result.rowList.length;
        console.info("禁用的下标长度:",this.specialAddOldSeq)
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.editForm = result
        })

      })
    },

    handlePictureCardPreview(materialId){
      request.get('/baseData/material/getPicturesById?id='+materialId).then(res => {
        if(res.data.data.length ===0){
          this.$message({
            message: '没有图片!',
            type: 'error'
          });
          return;
        }
        let data = res.data.data;
        this.dialogImageUrl = sysbaseUrl+"/"+data[data.length-1];
        this.dialogPicVisible = true;

      })
    },
    rowClass({ row, rowIndex }) {
      if (this.multipleSelection.includes(row.id)) {
        return { "background-color": "rgba(255,235,205, 0.75)" };
      }
    },
    statusPassBatch(){
      let ids = this.multipleSelection;
      request.post('/produce/productConstituent/statusPassBatch',ids).then(res => {
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
        this.addProductConstituent();
      }
      else if(item === 'copy'){
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
    // 货号组成结构详细信息-添加
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
      obj.dosage=''

      this.editForm.rowList.push(obj);
    },
    // 货号组成结构详细信息-删除
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
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1) || ((restaurant.id+"").toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    createFilter2(queryString) {
      return (restaurant) => {
        return (restaurant.obj.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1) || (restaurant.id.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    moveMouse(text) {
      try {
        // foreach 只能抛出异常结束
        this.restaurants.forEach(item => {
          if (text === item.name) {
            console.log("匹配到:", text, item.name, this.editForm.departmentId, item.id)
            this.editForm.departmentId = item.id
            this.editForm.productNum = item.name
            throw new Error();
          } else {
            this.editForm.departmentId = ''
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
            rowObj.specs = item.obj.specs
            throw new Error();
          } else {
            rowObj.materialName = "";
            rowObj.unit = "";
            rowObj.materialId = '';
            rowObj.specs = ''

            rowObj.dosage = ''
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

    addProductConstituent() {
      this.addOrUpdate = 'save'
      this.editForm = {
        status: 1, // 编辑表单初始默认值
        id: '',
        productNum: '',
        productBrand: '',
        productColor: '',
        rowList: [{
          materialName:'',
          unit:'',
          materialId:'',
          num:'',
          specs:'',
          dosage:''
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
        this.multipleSelection.push(theId.id)
      })
      console.log("多选框 选中的 ", this.multipleSelection)
    },
    // 表单提交
    submitForm(formName, methodName) {
      this.$refs[formName].validate((valid) => {

        if (valid) {
          if(this.editForm.productColor==='' || this.editForm.productNum==='' || this.editForm.productBrand ===''){
            this.$message({
              message: '产品货号，颜色，品牌不能为空',
              type: 'error'
            });
            return
          }
          if (this.editForm.rowList === undefined || this.editForm.rowList.length === 0) {
            this.$message({
              message: '请录入至少一个货号组成结构物料信息',
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

            if((obj.dosage === undefined || obj.dosage === '') && (obj.materialId === '')){
              emptyArr.push(i+1);
              continue;
            }
            if (obj.dosage === undefined || obj.dosage === '') {
              validateFlag = false
            }
            if (obj.materialId === '') {
              validateMaterial = false
            }
          }
          // 移除空的数组内容
          console.log("移除前的内容:",this.editForm.rowList)
          this.editForm.rowList = this.getNewArr(this.editForm.rowList,emptyArr);
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
              message: '货号组成结构数量不能为空!',
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

          request.post('/produce/productConstituent/' + methodName+"?specialAddFlag="+this.specialAddFlag, this.editForm).then(res => {
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

            if(this.specialAddFlag){
              this.specialAddFlag=false
              this.dialogVisible=false;
            }else{
              this.editForm.status = 2;
            }
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
      let url = '/produce/productConstituent/list?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&searchField="+this.select+
          "&&searchStatus="+checkStr;
      request.post(url,
          {'manySearchArr':this.manySearchArr,'searchStr':this.searchStr},
          null).then(res => {
          this.tableData = res.data.data.records
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
    // 编辑页面
    edit(id) {
      this.addOrUpdate = "update"
      request.get('/produce/productConstituent/queryById?id=' + id).then(res => {
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
      request.post('/produce/productConstituent/del', ids).then(res => {
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
      request.get('/produce/productConstituent/statusSubReturn?id=' + id).then(res => {
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
      request.get('/produce/productConstituent/statusSubmit?id=' + id).then(res => {
        this.$message({
          message: '已提交!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 状态待审核
    statusPass(id) {
      request.get('/produce/productConstituent/statusPass?id=' + id).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 状态反审核
    statusReturn(id) {
      request.get('/produce/productConstituent/statusReturn?id=' + id).then(res => {
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
      this.specialAddFlag=false
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

    // el-table 单元格样式修改
    cellStyle() {
      return 'padding:0 0'
    },
    searchMmaterialFocus(){
      this.loadMaterialAll()
    },
    searchMaterialAllFocus(){
      this.loadTableSearchMaterialDetailAll()
    },

  },
  created() {
    this.getList()
    this.loadMaterialAll()
    this.loadTableSearchMaterialDetailAll()

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