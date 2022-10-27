<template>

  <el-container>
    <el-main style="margin-top: -30px;margin-left: -30px">
      <el-form :inline="true" class="demo-form-inline" style="margin-bottom: -20px">
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
          <!-- 字段搜索框 -->
          <el-autocomplete size="mini" v-if="selectedName==='costOfLabourTypeName'" clearable
                           style="width: 200px"
                           popper-class="my-autocomplete"
                           class="inline-input"
                           v-model.lazy="searchStr"
                           :fetch-suggestions="queryCostOfLabourTypeSearchValide"
                           placeholder="请输入内容"
                           :trigger-on-focus="false"
                           @select="searchSelect"

          >
          </el-autocomplete>
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
              <el-autocomplete size="mini" v-if="item.selectField==='costOfLabourTypeName'" clearable
                               style="width: 200px"
                               popper-class="my-autocomplete"
                               clearable
                               class="inline-input"
                               v-model.lazy="item.searchStr"
                               :fetch-suggestions="queryCostOfLabourTypeSearchValide"
                               placeholder="请输入内容"
                               :trigger-on-focus="false"
                               @select="searchManySelect($event,index)"

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


        <el-form-item v-if="hasAuth('costOfLabour:processes:save')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('costOfLabour:processes:save')"
                     @click="addCostOfLabourProcesses()">新增
          </el-button>
        </el-form-item>
        <el-form-item v-if="hasAuth('costOfLabour:processes:valid')">
          <el-popconfirm @confirm="statusPassBatch()" title="确定审核吗？">
            <el-button size="mini" icon="el-icon-success" :disabled="this.multipleSelection.length === 0 " type="danger"
                       slot="reference">批量审核
            </el-button>
          </el-popconfirm>
        </el-form-item>

<!--
        <el-form-item v-if="hasAuth('costOfLabour:processes:valid')" style="margin-left: 0">
          <el-dropdown   @command="expChange">
            <el-button  icon="el-icon-download" size="mini" >
              导出<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="all">导出当前条件全部</el-dropdown-item>
              <el-dropdown-item command="currentList">导出当前页</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>

        <el-form-item v-if="hasAuth('costOfLabour:processes:valid')" >
          <el-button @click="preViewPrint()" size="mini" icon="el-icon-printer" type="primary"
          >打印预览
          </el-button>
        </el-form-item>-->

      </el-form>

      <el-table

          ref="multipleTable"
          :data="tableData"
          v-loading="tableLoad"
          element-loading-background="rgba(255, 255, 255, .5)"
          element-loading-text="加载中，请稍后..."
          border
          stripe
          fit
          height="520px"
          size="mini"
          tooltip-effect="dark"
          style="width: 100%;color:black"
          :cell-style="{padding:'0'}"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="40">
        </el-table-column>
        <el-table-column
            label="ID"
            prop="id"
        >
        </el-table-column>
        <el-table-column
            label="工价类别"
            prop="costOfLabourTypeName"
            show-overflow-tooltip
            width="150px"
        >
        </el-table-column>

        <el-table-column
            prop="processesName"
            label="工序名称">
        </el-table-column>

        <el-table-column
            prop="lowPrice"
            label="保底价格"
        >
        </el-table-column>

        <el-table-column
            prop="piecesPrice"
            label="片数价格"
        >
        </el-table-column>

        <el-table-column
            prop="startDate"
            label="生效日期"
            width="110px"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.startDate }}</span>
          </template>
        </el-table-column>

        <el-table-column
            prop="endDate"
            label="失效日期"
            width="110px"

        >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.endDate }}</span>
          </template>
        </el-table-column>

        <el-table-column
            prop="status"
            label="状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status === 0" type="success">审核通过</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===1" type="danger">待审核</el-tag>

          </template>
        </el-table-column>

        <el-table-column
            prop="comment"
            label="备注"
            show-overflow-tooltip
            width="180px"
        >
        </el-table-column>


        <el-table-column
            prop="action"
            label="操作"
            width="230px"
            fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row.id)"
                       v-if="hasAuth('costOfLabour:processes:update') && scope.row.status ===1  ">编辑
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('costOfLabour:processes:valid') && scope.row.status ===1   "></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('costOfLabour:processes:valid')  && scope.row.status ===1   ">
              <template>
                <el-popconfirm @confirm="statusPass(scope.row.id)"
                               title="确定设置审核通过吗？"
                >
                  <el-button type="text" size="small" slot="reference">审核通过</el-button>
                </el-popconfirm>
              </template>
            </el-button>


            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('costOfLabour:processes:valid')  && scope.row.status ===0  ">
              <template>
                <el-popconfirm @confirm="statusReturn(scope.row.id)"
                               title="确定反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">反审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button type="text" size="small" @click="edit(scope.row.id)"
                       v-if="hasAuth('costOfLabour:processes:valid') && scope.row.status ===0  ">修改失效日期
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('costOfLabour:processes:del') && scope.row.status ===1 "></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('costOfLabour:processes:del') && scope.row.status ===1  ">
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

      <el-dialog
          title=""
          :visible.sync="dialogVisiblePrint"
          width="65%"
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
            <print :tableData="tableData" :getChineseNumber="func.getChineseNumber"></print>
          </template>
        </vue-easy-print>

      </el-dialog>

      <!-- 价目列表 弹窗 -->
      <el-dialog
          title="价目信息"
          :visible.sync="dialogVisible"
          width="50%"
          :before-close="handleClose"
      >

        <el-form :inline="true" :model="editForm" :rules="rules" ref="editForm" label-width="100px"
                 class="demo-editForm">

          <el-form-item v-if="false" label="唯一编码" prop="id">
            <el-input v-model="editForm.id"></el-input>
          </el-form-item>

          <el-form-item v-if="false" prop="costOfLabourTypeId">
            <el-input v-model="editForm.costOfLabourTypeId"></el-input>
          </el-form-item>
          <el-form-item label="工价类别" prop="costOfLabourTypeName">
            <!-- 搜索框 -->
            <el-autocomplete
                class="inline-input"
                :disabled="editForm.status === 0 && editForm.id !=''"
                popper-class="my-autocomplete"

                v-model="editForm.costOfLabourTypeName"
                :fetch-suggestions="queryCostOfLabourTypeSearchValide"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @select="handleSelect"
                @change="moveMouse"
                @focus="searchCostOfLabourTypeFocus()"

                clearable
            >
            </el-autocomplete>
          </el-form-item>


          <el-form-item label="工序名称" prop="processesName">
            <el-input v-model="editForm.processesName"
                      :disabled="editForm.status === 0 && editForm.id !=''"
                      style="width: 220px">
            </el-input>
          </el-form-item>

          <el-form-item label="保底价格" prop="lowPrice">
            <el-input v-model="editForm.lowPrice" style="width: 220px"
                      :disabled="editForm.status === 0 && editForm.id !=''"

                      oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>

          </el-form-item>

          <el-form-item label="片数价格" prop="piecesPrice">
            <el-input v-model="editForm.piecesPrice" style="width: 220px"
                      :disabled="editForm.status === 0 && editForm.id !=''"

                      oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>

          </el-form-item>

          <el-form-item label="备注" prop="comment">
            <el-input v-model="editForm.comment"
                      :disabled="editForm.status === 0 && editForm.id !=''"
                      style="width: 220px">
            </el-input>
          </el-form-item>

          <el-form-item label="生效日期" prop="startDate">
            <el-date-picker
                :disabled="editForm.status === 0 && editForm.id !=''"

                value-format="yyyy-MM-dd"
                v-model="editForm.startDate"
                type="date"
                placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="失效日期" prop="endDate">
            <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="editForm.endDate"
                type="date"
                placeholder="默认2100-01-01">
            </el-date-picker>
          </el-form-item>

          <el-form-item style="margin-left: 100px">
            <el-button type="primary" @click="submitForm('editForm',addOrUpdate)">完成</el-button>

          </el-form-item>
        </el-form>

      </el-dialog>

      <!--价目列表 分页组件 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-sizes="[50, 200, 700, 1000]"
          :page-size="this.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total">
      </el-pagination>
    </el-main>
  </el-container>


</template>

<script>
import vueEasyPrint from "vue-easy-print";

import {request, request2} from "@/axios";
import print from "@/views/printModule/printSupplierMaterial";
import exportExcelCommon from "@/views/common/ExportExcelCommon";

export default {
  name: "processes",
  // 引入打印模块基础组件和该打印模块的模板页面
  components: {
    vueEasyPrint,
    print,
  },
  data() {
    return {
      dialogVisiblePrint:false,

      manySearchArr:[{
        selectField:'costOfLabourTypeName',
        searchStr:'',
      }],
      checkedBox:[1,0],
      statusArr : [{'name':'待审核','val':1},{'name':'已审核','val':0}],

      tableLoad: false,
      // 搜索字段
      selectedName: 'costOfLabourTypeName',// 搜索默认值
      options: [
        {value: 'costOfLabourTypeName', label: '工价类别名称'},
      ],
      select: 'costOfLabourTypeName', // 搜索默认值
      searchStr: '',
      searchField: '',
      costOfLabourTypeSearchDatas: [], // 用于搜索的建议框
      materialSearchDatas: [], // 用于搜索的建议框


      // 分页字段
      currentPage: 1 // 当前页
      , pageSize: 50 // 一页多少条
      , total: 0 // 总共多少数据
      ,
      // 表单字段
      addOrUpdate: 'save',
      editForm: {
        status: 0, // 编辑表单初始默认值
        id: '',
        costOfLabourTypeId: '',
        costOfLabourTypeName: '',
        processesName: '',
        startDate: '',
        endDate: '',
        lowPrice: '',
        piecesPrice:'',
        comment:''
      },
      rules: {
        processes: [
          {required: true, message: '请输入工序名称', change: 'blur'}
        ],
        costOfLabourTypeName: [
          {required: true, message: '请输入工价类别', change: 'blur'}
        ],
        lowPrice: [
          {required: true, message: '请输入保底价', trigger: 'blur'}
        ],
        piecesPrice: [
          {required: true, message: '请输入片数单价', trigger: 'blur'}
        ],
        startDate: [
          {required: true, message: '请输入生效日期', trigger: 'blur'}
        ]
      }
      ,
      dialogVisible: false,
      tableData: [],
      multipleSelection: [] // 多选框数组
    }
  },
  methods: {
    printDemo() {
      this.$refs.easyPrint.print()
    },

    printClose(done) {
      this.$refs.easyPrint.tableShow = false;
      done();
    },

    preViewPrint() {
      if (this.tableData) {
        console.log("打印时的easyPrint：", this.$refs.easyPrint)
        console.log("打印时的editForm：", this.tableData)
        if (this.$refs.easyPrint) {

          this.$refs.easyPrint.tableData = this.tableData

        }
        this.dialogVisiblePrint = true
      } else {
        this.$message({
          message: '没有内容!',
          type: 'error'
        });
      }
    },

    exportCurrentList() {

      let checkStr = this.checkedBox.join(",");
      request2.post('/costOfLabour/processes/export?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&total="+this.total+
          "&&searchField="+this.select+
          "&&searchStatus="+checkStr

          ,{'manySearchArr':this.manySearchArr,'searchStr':this.searchStr}
          ,{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'采购价目当前页.xlsx')
      }).catch()
    },
    // 导出列表数据- 服务端写出字节流到浏览器，进行保存
    exportAll() {

      let checkStr = this.checkedBox.join(",");
      request2.post('/costOfLabour/processes/export?'+
          "&&searchField="+this.select+
          "&&searchStatus="+checkStr

          ,{'manySearchArr':this.manySearchArr,'searchStr':this.searchStr}
          ,{responseType:'arraybuffer'}).then(res=>{
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
    expChange(item) {
      console.log("导出:",item)
      if (item === 'currentList') {
        this.exportCurrentList()
      } else if(item === 'all'){
        this.exportAll()
      }
    },

    delSearch(index){
      this.manySearchArr.splice(index,1)
    },
    addSearchItem(){
      let obj = {
        selectField:'costOfLabourTypeName',
        searchStr:'',
      }
      this.manySearchArr.push(obj)
    },

    searchMmaterialFocus() {
      this.loadMaterialValideAll()
    },
    searchCostOfLabourTypeFocus() {
      this.loadCostOfLabourTypeValideAll()
    },
    /*computed: {
      selectedName: {
        get() {
          return this.selectedName;
        }
      },
    },*/
    loadCostOfLabourTypeValideAll() {
      request.post('/costOfLabour/costOfLabourType/getSearchAllData').then(res => {
        this.costOfLabourTypeSearchDatas = res.data.data
        console.log("查询数据：",this.costOfLabourTypeSearchDatas)
      })
    },
    // 查询搜索框列表数据
    queryCostOfLabourTypeSearchValide(queryString, cb) {
      var restaurants = this.costOfLabourTypeSearchDatas;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
      };
    },
    getcostOfLabourTypeNameById(id) {
      this.costOfLabourTypeSearchDatas.forEach(obj => {
        if (id === obj.id) {
          this.editForm.costOfLabourTypeName = obj.name

        }
      })
    },
    getMaterialNameById(id) {
      this.materialSearchDatas.forEach(obj => {
        if (id === obj.id) {
          this.editForm.materialName = obj.name
        }
      })
    },
    handleSelect(item) {
      this.editForm.costOfLabourTypeId = item.id
      this.editForm.costOfLabourTypeName = item.name
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
    searchManySelect(item,index) {
      let theObj = this.manySearchArr[index];
      theObj.searchStr = item.name;
      console.log("manySearchArr:",this.manySearchArr)
    },

    // 价目列表 点击添加按钮
    addCostOfLabourProcesses() {
      this.addOrUpdate = 'save'
      this.editForm = {
        status: 0, // 编辑表单初始默认值
        id: '',
        costOfLabourTypeId: '',
        costOfLabourTypeName: '',
        startDate: '',
        endDate: '',
        lowPrice: '',
        piecePrice:'',
        processesName:'',
        comment:''
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
        console.log("当前工价类别id:", this.editForm.costOfLabourTypeId)
        if (valid) {
          const load = this.$loading({
            lock: true,
            text: '处理中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          request.post('/costOfLabour/processes/' + methodName, this.editForm).then(res => {
            load.close()
            this.$message({
              message: (this.editForm.id ? '编辑' : '新增') + '成功!',
              type: 'success'
            });

            // 关闭弹窗并且重置内容
            this.dialogVisible = false;
            this.resetForm("editForm")
            this.getList();

          }).catch(()=>{
            load.close()
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    search() {
      this.currentPage = 1;
      this.getList()
    },
    // 查询价目表单列表数据
    async getList() {
      this.tableLoad = true;
      let checkStr = this.checkedBox.join(",");
      console.log("多选框：",checkStr )
      console.log("搜索字段:", this.select)
      await request.post('/costOfLabour/processes/list?currentPage='+this.currentPage+
                "&&pageSize="+this.pageSize+
                "&&total="+this.total+
                "&&searchField="+this.select+
                "&&searchStatus="+checkStr,
                {'manySearchArr':this.manySearchArr,'searchStr':this.searchStr},
                null).then(res => {
        this.tableData = res.data.data.records
        this.total = res.data.data.total
        console.log("获取用户表单数据", res.data.data.records)
        this.tableLoad = false;
        /*this.$nextTick(() => {
          this.$refs['multipleTable'].doLayout();
        })*/
      })
    },
    // 编辑页面
    edit(id) {
      this.addOrUpdate = "update"
      request.get('/costOfLabour/processes/queryById?id=' + id).then(res => {
        let result = res.data.data
        this.editForm = result
        this.getcostOfLabourTypeNameById(this.editForm.costOfLabourTypeId)

        // 弹出框我们先让他初始化结束再赋值
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.dialogVisible = true
        })

      })
    },
    statusPassBatch(){
      let ids = this.multipleSelection;
      request.post('/costOfLabour/processes/statusPassBatch',ids).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getList()
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
      request.post('/costOfLabour/processes/del', ids).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getList()
        console.log("删除后重新加载页面")

      })
    },
    // 状态待审核
    statusPass(id) {
      request.get('/costOfLabour/processes/statusPass?id=' + id).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 状态反审核
    statusReturn(id) {
      request.get('/costOfLabour/processes/statusReturn?id=' + id).then(res => {
        this.$message({
          message: '反审核完成!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 关闭弹窗处理动作
    handleClose(done) {
      this.$refs['editForm'].resetFields();
      console.log("关闭窗口")
      done();
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    searchFieldChange(item) {
      console.log("搜索字段改变:", item)
      if (item === 'costOfLabourTypeName') {
        this.selectedName = item
      } else {
        this.selectedName = item

      }
    },
    moveMouse(text) {
      try {
        // foreach 只能抛出异常结束
        this.costOfLabourTypeSearchDatas.forEach(item => {
          console.log("moveMouse")
          if (text === item.name) {
            this.editForm.costOfLabourTypeId = item.id
            this.editForm.costOfLabourTypeName = item.name

            throw new Error();
          } else {
            this.editForm.costOfLabourTypeId = ''
            this.editForm.costOfLabourTypeName = ''
            console.log("没有匹配到", text, item.name)
          }
        })
      } catch (err) {
      }
    },
    moveMaterialMouse(text) {
      try {
        // foreach 只能抛出异常结束
        this.materialSearchDatas.forEach(item => {
          if (text === item.name) {
            console.log("匹配到:", text, item.name, this.editForm.materialId, item.id)
            this.editForm.materialId = item.id
            this.editForm.materialName = item.name
            throw new Error();
          } else {
            this.editForm.materialId = ''
            this.editForm.materialName = ''

            console.log("没有匹配到", text, item.name)
          }
        })
      } catch (err) {
      }
    }

  },
  // 页面初始化时调用的方法
  created() {
    this.getList()
    this.loadCostOfLabourTypeValideAll()
  }

}
</script>
<!--
<style >
.my-autocomplete{
  width: auto !important;
}
.my-autocomplete li{
  line-height: normal;
  padding: 7px;
}
.my-autocomplete .name{
  text-overflow: ellipsis;
  overflow: hidden;
}
.my-autocomplete .unit{
  font-size: 12px;
  color: #b4b4b4;
}
.my-autocomplete .highlighted .unit {
  color: #ddd;
}
</style>-->

<style scoped>
.el-pagination {
  float: right;

}


</style>