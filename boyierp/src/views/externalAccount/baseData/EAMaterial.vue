<template>

  <el-container>
    <el-aside width="200px">


      <!-- 物料分组按钮 -->
      <el-button type="text" size="small" v-if="hasAuth('externalAccount:baseData:material:list')" @click="addGroup()">新增分组</el-button>
      <el-button type="text" size="small" v-if="hasAuth('externalAccount:baseData:material:list')" @click="updateGroup()">修改分组
      </el-button>
      <el-button type="text" v-if="hasAuth('externalAccount:baseData:material:list') ">
        <!-- 气泡确认框 -->
        <template>
          <el-popconfirm @confirm="del2()"
                        :title="'确定删除分组: ['+this.lastClickTreeNode.label+'] 吗?'" >
            <el-button type="text" size="small" slot="reference">删除分组</el-button>
          </el-popconfirm>
        </template>
      </el-button>

      <!-- 物料分组Tree -->
      <dbltree  ref="groupTree"
               node-key="id"
               :default-expanded-keys="defaulExpandedKeys"
               style="font-weight: bold"
               :highlight-current=true
               :data="groupData" :props="groupDefaultProps" @node-click="handleNodeClick"
                @node-dblClick="nodeDbClick"
       >

      </dbltree>

      <!-- 物料分组弹框 -->
      <el-dialog
          title="物料分组信息"
          :visible.sync="groupDialogVisible"
          width="30%"
          top="0vh"
          :before-close="handleClose_group"
          :append-to-body="true"

      >

        <el-form :model="groupEditForm" :rules="groupRules" ref="groupEditForm" label-width="100px"
                 class="demo-editForm">
          <el-form-item v-show="false" label="id" prop="id">
            <el-input v-model="groupEditForm.id"></el-input>
          </el-form-item>
          <el-form-item v-show="false" label="parentId" prop="parentId">
            <el-input v-model="groupEditForm.parentId"></el-input>
          </el-form-item>

          <el-form-item label="上级分组" prop="parentCode">
            <el-input v-model="groupEditForm.parentCode"
                      :disabled="true">
            </el-input>
          </el-form-item>

          <el-form-item label="编码" prop="code">
            <el-input v-model="groupEditForm.code" :disabled="groupEditForm.id"></el-input>
          </el-form-item>

          <el-form-item label="名称" prop="name">

            <div  :class=" 'el-input'" >
              <input  class="el-input__inner"  v-model.lazy="groupEditForm.name">
              </input>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="groupSubmitForm('groupEditForm',)">完成</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>


    </el-aside>
        <!-- 右侧物料列表 -->
        <el-main>
            <el-form :inline="true" class="demo-form-inline">

              <el-form-item>
                <div style="margin-top: 6px;margin-bottom: 0">
                  <el-input size="mini" placeholder="请输入搜索关键字" v-model="searchStr" clearable class="input-with-select">
                    <el-select v-model="select" style="width: 120px"  slot="prepend" placeholder="搜索字段">
                      <el-option label="唯一编码" value="id"></el-option>
                      <el-option label="分组编码" value="groupCode"></el-option>
<!--                      <el-option label="子编码" value="subId"></el-option>-->
                      <el-option label="名称" value="name"></el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search"  @click="search()"></el-button>

                  </el-input>

                </div>
              </el-form-item>

              <el-form-item v-if="hasAuth('externalAccount:baseData:material:list')">
                <el-button  size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('externalAccount:baseData:material:list')"  @click="addMaterial()">新增</el-button>
              </el-form-item>

              <el-form-item v-if="hasAuth('externalAccount:baseData:material:list')">
                <el-popconfirm @confirm="del(null)" title="确定删除吗？" >
                  <el-button  size="mini" icon="el-icon-delete" :disabled="this.multipleSelection.length === 0 " type="danger" slot="reference">批量删除</el-button>
                </el-popconfirm>
              </el-form-item>

              <el-form-item v-if="hasAuth('externalAccount:baseData:material:list')" style="margin-left: 0">
                <el-dropdown   @command="expChange">
                  <el-button  icon="el-icon-download" size="mini" >
                    导出<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="all">导出当前条件全部</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>

            </el-form>

            <el-table

                ref="multipleTable"
                v-loading = "tableLoad"
                element-loading-background = "rgba(255, 255, 255, .5)"
                element-loading-text = "加载中，请稍后..."
                :data="tableData"
                border
                stripe
                fit
                height="480px"
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
                  label="唯一编码"
                  prop="id"
                  sortable
                  width="120px"
                  >
              </el-table-column>
<!--              <el-table-column
                  label="分组编码"
                  prop="groupCode">
              </el-table-column>
              <el-table-column
                  label="子编码"
                  prop="subId"
              >
              </el-table-column>-->

              <el-table-column
                  prop="name"
                  label="名称"
                  width="250px"
                  show-overflow-tooltip>
              </el-table-column>

              <el-table-column
                  prop="specs"
                  label="规格型号"
                  width="100px"

                  show-overflow-tooltip>
              </el-table-column>

              <el-table-column
                  prop="unit"
                  label="库存单位"
                  width="70px"
                  show-overflow-tooltip>
              </el-table-column>

              <el-table-column
                  prop="bigUnit"
                  label="入库单位"
                  width="70px"
                  show-overflow-tooltip>
              </el-table-column>

              <el-table-column
                  prop="unitRadio"
                  label="换算系数"
                  width="70px"
                  show-overflow-tooltip>
              </el-table-column>

              <el-table-column
                  prop="lowWarningLine"
                  label="低预警线"
                  width="70px"
                  show-overflow-tooltip>
              </el-table-column>

              <el-table-column
                  prop="status"
                  label="状态"
                  width="87px"
                  sortable
              >
                <template slot-scope="scope">
                  <el-tag size="small" v-if="scope.row.status === null" type="success">启用</el-tag>
                  <el-tag size="small" v-else-if="scope.row.status===-1" type="danger">停用</el-tag>

                </template>
              </el-table-column>

              <el-table-column
                  prop="action"
                  label="操作"
                  width="160px"
                  fixed="right"
              >
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="edit(scope.row.id)" v-if="hasAuth('externalAccount:baseData:material:list')   ">编辑</el-button>
                  <el-divider direction="vertical" v-if="hasAuth('externalAccount:baseData:material:list')   "></el-divider>

                  <el-button style="padding: 0" type="text"v-if="hasAuth('externalAccount:baseData:material:list')   ">
                    <template>
                      <el-popconfirm  @confirm="del(scope.row.id)"
                                     title="确定删除吗？"
                      >
                        <el-button type="text" size="small" slot="reference">删除</el-button>
                      </el-popconfirm>
                    </template>
                  </el-button>

                  <el-divider direction="vertical" v-if="hasAuth('externalAccount:baseData:material:list') && scope.row.status ===null   "></el-divider>
                  <el-button style="padding: 0" type="text"v-if="hasAuth('externalAccount:baseData:material:list')  && scope.row.status ===null   ">
                    <template>
                      <el-popconfirm  @confirm="stop(scope.row.id)"
                                      title="确定禁用吗？"
                      >
                        <el-button type="text" size="small" slot="reference">禁用</el-button>
                      </el-popconfirm>
                    </template>
                  </el-button>

                  <el-divider direction="vertical" v-if="hasAuth('externalAccount:baseData:material:list')  && scope.row.status ===-1  "></el-divider>
                  <el-button style="padding: 0" type="text"v-if="hasAuth('externalAccount:baseData:material:list') && scope.row.status ===-1   ">
                    <template>
                      <el-popconfirm  @confirm="startBM(scope.row.id)"
                                      title="确定启用吗？"
                      >
                        <el-button type="text" size="small" slot="reference">启用</el-button>
                      </el-popconfirm>
                    </template>
                  </el-button>

                </template>
              </el-table-column>

            </el-table>

            <!-- 物料列表 弹窗 -->
            <el-dialog
                title="物料信息"
                :visible.sync="dialogVisible"
                width="30%"
                top="0vh"
                :before-close="handleClose"
                :append-to-body="true"
                style="padding: 0 0"
            >

              <el-form style="margin-top: -30px" :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-editForm">

                <el-form-item   v-if="false" label="唯一编码" prop="id" >
                  <el-input   v-model="editForm.id" ></el-input>
                </el-form-item>

                <el-form-item style="margin: 5px 0px" label="唯一编码" prop="subId" >
                  <el-input style="width: 80px"  v-model="editForm.groupCode" :disabled="true" ></el-input>
                 <el-input style="width: 40%" placeholder="保存自动生成" v-model="editForm.subId" :disabled="true" ></el-input>
                </el-form-item>

                <el-form-item label="名称" prop="name" style="margin: 5px 0px">

                  <div  :class=" 'el-input '" >
                    <input  class="el-input__inner"  v-model.lazy="editForm.name">
                    </input>
                  </div>
                </el-form-item>

                <el-form-item label="规格型号" prop="specs" style="margin: 5px 0px">
                  <div  :class=" 'el-input '" >
                    <input  class="el-input__inner"  v-model.lazy="editForm.specs">
                    </input>
                  </div>
                </el-form-item>

                <el-form-item label="库存单位" prop="unit" style="margin: 5px 0px">

                  <!-- 搜索框 -->
                  <el-autocomplete
                      class="inline-input"
                      v-model="editForm.unit"
                      :fetch-suggestions="querySearch"
                      placeholder="请输入内容"
                  >

                  </el-autocomplete>

                </el-form-item>

                <el-form-item label="入库单位" prop="bigUnit" style="margin: 5px 0px">

                  <!-- 搜索框 -->
                  <el-autocomplete
                      class="inline-input"
                      v-model="editForm.bigUnit"
                      :fetch-suggestions="querySearch"
                      placeholder="请输入内容"
                  >

                  </el-autocomplete>

                </el-form-item>

                <el-form-item label="换算系数" prop="unitRadio" style="margin: 5px 0px">
                  1入库单位=<el-input v-model="editForm.unitRadio" style="width: 100px"></el-input>库存单位
                </el-form-item>
                <el-form-item label="低预警线" prop="lowWarningLine" style="margin: 5px 0px">
                  <div  :class=" 'el-input '" >
                    <input  class="el-input__inner"  v-model.lazy="editForm.lowWarningLine">
                    </input>
                  </div>
                </el-form-item>

                <el-form-item label="照片" style="margin: 5px 0px">
                  <!-- 新的缩略图-->
                  <el-upload
                      :disabled="!hasAuth('externalAccount:baseData:material:list') || this.fileList.length >=1"
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
                      @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                        <!--            <span
                                        v-if="!disabled"
                                        class="el-upload-list__item-delete"
                                        @click="handleDownload(file)"
                                    >
                                      <i class="el-icon-download"></i>
                                    </span>-->
                  <span
                      v-if="hasAuth('externalAccount:baseData:material:list') "
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
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
<!--
                <el-form-item label="视频" style="height: 200px">
                  <video-my ref="videoUpload" @returnBack="returnBack" :urlPre="'/externalAccount/baseData/material/'"   v-model="editForm.videoUrl"/>
                </el-form-item>-->

                <el-form-item>
                  <el-button type="primary" @click="submitForm('editForm',addOrUpdate)">完成</el-button>
                  <el-button type="primary" @click="addNew()">新增</el-button>
                  <el-button type="primary" :disabled="copyFlag" @click="copy()">复制</el-button>

                </el-form-item>
              </el-form>

            </el-dialog>

            <!--物料列表 分页组件 -->
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
import {request, request2, sysbaseUrl} from "@/axios";
// import VideoMy from "@/components/video";

export default {
  name: "EAMaterial",
  // components: {VideoMy},
  data() {
    return {
      video:'http://localhost:8081\\baseDataMaterial-_1670558123950.mp4',
      copyFlag:false,


      fileList: [],
      dialogOnePicVisible:false,
      dialogOneImageUrl:'',

      tableLoad:false,
      select:'',
      defaulExpandedKeys: [0],
      currentPage: 1 // 当前页
      , pageSize: 50 // 一页多少条
      , total: 0 // 总共多少数据
      , searchStr: '',
      searchMaterialField:'',
      addOrUpdate: 'save',
      editForm: {
        id:'',
        groupCode:'',
        subId:'',
        name:'',
        unit:'',
        specs:'',
        bigUnit:'',
        unitRadio:'1',
        lowWarningLine:'',
        videoUrl:''
      },
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        unit: [
          {required: true, message: '请输入单位', trigger: 'blur'}
        ],
        bigUnit: [
          {required: true, message: '请输入单位', trigger: 'blur'}
        ],
        unitRadio: [
          {required: true, message: '请输入系数', trigger: 'blur'}
        ]
      }
      ,
      // 物料分组 编辑表单
      groupEditForm: {
        parentId: 0 // 初始默认值
      },
      // 物料分组 校验规则
      groupRules: {
        name: [
          {required: true, message: '请输入分组名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入编码', trigger: 'blur'}
        ]
      },
      dialogVisible: false,
      groupDialogVisible: false, // 物料分组的弹窗标识
      tableData: [],
      multipleSelection: [] // 多选框数组
      ,
      authorityTreeData: [],
      defaultProps: {
        label: 'name'
      },
      authorityDialogVisible: false,
      authorityForm: {},
      // 物料分组 Tree数据
      groupData: [
        {
          parentId: '',
          code: ''
        }
      ],
      // 物料分组 Tree 配置
      groupDefaultProps: {
        children: 'children',
        label: 'label'
      },
      // 物料分组 上次点击的TreeNode
      lastClickTreeNode: {},

      // 搜索框列表数据存放
      restaurants: [
      ]/*,
      // 搜索字段 数据存放
      restaurants2: [
        {value:'唯一编码'},{value:'分组编码'},{value:'子编码'},{value:'名称'}
      ]*/
    }
  },
  methods: {
    // video 子组件回传事件
    returnBack(data){
      // 查看图片
      request.get('/externalAccount/baseData/material/removeVideoPath?id='+data).then(res => {
        this.$message.success("删除视频成功!");
      })
    },
    expChange(item) {
      console.log("导出:",item)
      if(item === 'all'){
        this.exportAll()
      }
    },
    // 导出列表数据- 服务端写出字节流到浏览器，进行保存
    exportAll() {
      request2.post('/externalAccount/baseData/material/export?'+
          "searchField="+this.select+
          "&&searchStr="+this.searchStr
          ,null
          ,{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'物料全部列表.xlsx')
      }).catch()
    },
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

    // 图片放大预览。
    handlePictureCardPreview(file) {
      console.log("文件:",file)
      this.dialogOneImageUrl = file.url;
      this.dialogOnePicVisible = true;
    },
    // 图片删除
    handleRemove(file, fileList) {
      console.log("删除图片:",file)
      const url = file.url
      const i = this.fileList.findIndex(x => x.url === url)
      this.fileList.splice(i, 1)

      request({
        method: 'get',
        url: '/externalAccount/baseData/material/delPic?fileName='+file.name,
        headers: {'Content-Type': 'multipart/form-data'}
      }).then(res => {
        // 成功
        this.$message({
          message: '删除成功!',
          type: 'success'
        });

      })
    },

    // 图片新增
    uploadRequest(fileobj) {
      if(this.editForm.id ===null || this.editForm.id ===undefined || this.editForm.id ===''){
        this.$message.error("没有ID")
        return;
      }

      let param = new FormData()
      param.append('files', fileobj.file)
      console.log("上传的文件对象:",fileobj)
      request({
        method: 'post',
        url: '/externalAccount/baseData/material/uploadPic?id='+this.editForm.id,
        headers: {'Content-Type': 'multipart/form-data'},
        data: param
      }).then(res => {
        // 成功
        this.$message({
          message: '添加成功!',
          type: 'success'
        });

        this.$nextTick(() => {
          request.get('/externalAccount/baseData/material/getPicturesById?id='+this.editForm.id).then(res => {
            let data = res.data.data;
            this.fileList.push({name:data[data.length-1],url: sysbaseUrl+"/"+data[data.length-1]})
          })
        })


      })
    },

    nodeDbClick(event,data){

      this.currentPage = 1
      console.log("双击获取data：",data)
      console.log("双击获取分组的ID：",data.id)
      this.lastClickTreeNode = {
        id: data.id,
        code: data.code,
        label: data.label,
        name: data.name,
        parentId: data.parentId,
        parentCode: data.parentCode
      };

      request.get('/externalAccount/baseData/material/listByGroupCode', {
        params: {
          currentPage: this.currentPage
          , pageSize: this.pageSize
          , total: this.total
          , searchStr:  data.code
        }
      }).then(res => {
        this.tableData = res.data.data.records
        this.total = res.data.data.total

        this.select = "groupCode"
        if(data.code ==='全部'){
          this.searchStr=''
        }else {
          this.searchStr=data.code
        }

      })
    },

    // 获取基本单位的所有数据
    loadUnitAll() {
      request.post('/externalAccount/baseData/unit/getSearchAllData').then(res => {
          this.restaurants = res.data.data
      })
    },
/*
    // 查询搜索字段类型
    querySearch2(queryString, cb) {
      var restaurants2 = this.restaurants2;
      var results = queryString ? restaurants2.filter(this.createFilter(queryString)) : restaurants2;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },*/

    // 查询搜索框列表数据
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
      };
    },

    copy(){
      this.editForm.id = ''
      this.editForm.subId=''
      this.addOrUpdate='save'
      this.copyFlag=true;
      this.$message.success("已复制")
    },

    addNew(){
      this.addOrUpdate='save'

      this.$refs['editForm'].resetFields();
    },

    // 物料列表 点击添加按钮
    addMaterial(){

      if(this.lastClickTreeNode.id===undefined ){
        this.$message({
          message: '请选择一层分组!',
          type: 'error'
        });
      }else if(this.lastClickTreeNode.id===0){
        this.$message({
          message: '请选择全部的子分组!',
          type: 'error'
        });
      }
      else {
        this.editForm.groupCode = this.lastClickTreeNode.code;
        this.dialogVisible = true
        this.addOrUpdate='save'

      }
    },

    // 物料分组 点击添加按钮
    addGroup() {
      if(this.lastClickTreeNode.id === undefined){
        this.$message({
          message: '请选择一层菜单!',
          type: 'error'
        });
      }
      else if (this.lastClickTreeNode.parentId === 0 || this.lastClickTreeNode.id === 0) {

        if (this.lastClickTreeNode) {
          this.groupEditForm = {
            parentId: this.lastClickTreeNode.id,
            parentCode: this.lastClickTreeNode.code
          }
        }
        this.groupDialogVisible = true
        console.log("添加页面的parentId,parentCode:", this.groupEditForm.parentId, this.groupEditForm.parentCode)
      } else {
        this.$message({
          message: '只允许2层菜单!请重新选择',
          type: 'error'
        });
      }
    },
    // 物料分组 点击修改按钮
    updateGroup() {
      if(this.lastClickTreeNode.id === 0){
        return
      }

        console.log("上一次选中的TreeNode:", this.lastClickTreeNode)
      if (this.lastClickTreeNode.id != undefined) {
        this.groupEditForm =
            {
              id: this.lastClickTreeNode.id,
              code: this.lastClickTreeNode.code,
              label: this.lastClickTreeNode.label,
              name: this.lastClickTreeNode.name,
              parentId: this.lastClickTreeNode.parentId,
              parentCode: this.lastClickTreeNode.parentCode,
            }
        ;
        this.groupDialogVisible = true
      } else {
        this.$message({
          message: '请选择一个分组!',
          type: 'error'
        });
      }
    },
    // 分页方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getMaterialList()

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getMaterialList()

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
    submitForm(formName,methodName) {

      if(this.editForm.bigUnit != '' && this.editForm.unitRadio===''){
        this.$message.error("存在换算单位，但是换算系数为空")
        return ;
      }
      this.$refs[formName].validate((valid) => {
        console.log("当前物料id:",this.editForm.id)
        if (valid) {
          const load = this.$loading({
            lock: true,
            text: '处理中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          request.post('/externalAccount/baseData/material/'+methodName, this.editForm).then(res => {
            load.close()
            this.$message({
              message: (this.editForm.id ? '编辑' : '新增') + '成功!',
              type: 'success'
            });

            if(!this.editForm.subId) {
              console.log("回显的ID：", res.data.data)
              this.editForm.subId = res.data.data.subId;
              this.editForm.id = res.data.data.id;
              this.addOrUpdate = "update"
            }
            this.getMaterialList();

          }).catch(()=>{
            load.close()
          })
        } else {
          console.log('error submit!!');
          return false;
        }
        this.copyFlag=false;
      });
    },
    // 物料分组 表单提交
    groupSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {

        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          if (valid) {
            console.log("提交前的参数:parentId:", this.groupEditForm.parentId)

            request.post('/externalAccount/baseData/materialGroup/' + (this.groupEditForm.id ? 'update' : 'save'), this.groupEditForm).then(res => {
              this.$message({
                message: (this.groupEditForm.id ? '编辑' : '新增') + '成功!',
                type: 'success'
              });

              // 关闭弹窗并且重置内容
              this.groupDialogVisible = false;
              let parentId = this.groupEditForm.parentId;

              this.resetForm("groupEditForm")

              this.getMaterialGroupList();
              this.defaulExpandedKeys = [parentId]; // 设置展开上级

              console.info("设置的默认展开ID:", parentId)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })

      });
    },
    submitAuthorityForm(formName) {
      console.log("提交后的，被选中的 角色 ID数组：", this.$refs.tree.getCheckedKeys())
      request.post('/sys/user/authority?userId=' + this.authorityForm.id, this.$refs.tree.getCheckedKeys()).then(res => {
        let result = res.data
        this.$message({
          message: '修改成功!',
          type: 'success'
        });

        // 关闭弹窗并且重置内容
        this.authorityDialogVisible = false;
      });
    },
    search(){
      this.currentPage = 1
      this.getMaterialList()
    },
    // 查询物料表单列表数据
    getMaterialList() {
      this.tableLoad = true;
      console.log("搜索字段:",this.select)
      request.get('/externalAccount/baseData/material/list', {
        params: {
          currentPage: this.currentPage
          , pageSize: this.pageSize
          , total: this.total
          , searchStr: this.searchStr
          , searchField:this.select
        }
      }).then(res => {
        this.tableData = res.data.data.records
        this.total = res.data.data.total
        console.log("获取用户表单数据", res.data.data.records)
        this.tableLoad = false;
        this.$nextTick(() => {
          this.$refs['multipleTable'].doLayout();
        })
      })
    },
    // 物料分组 查询分组列表数据
    getMaterialGroupList() {
      request.post('/externalAccount/baseData/materialGroup/listValide').then(res => {
        this.$nextTick(() => {
          this.groupData = res.data.data
          console.log("查询物料分组", res.data.data)
        })
      })
    },
    // 编辑页面
    edit(id) {
      this.fileList = []
      this.addOrUpdate = "update"
      request.get('/externalAccount/baseData/material/queryById?id=' + id).then(res => {
        let result = res.data.data
        // 查看图片
        request.get('/externalAccount/baseData/material/getPicturesById?id='+id).then(res => {
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
          // this.$refs['videoUpload'].id=id;
          // this.$refs['videoUpload'].action= sysbaseUrl+'/externalAccount/baseData/material/uploadVideo?id='+id
          // if(result.videoUrl){
          //   this.$refs['videoUpload'].commonUpdateSrc(sysbaseUrl+"\\"+result.videoUrl)
          // }else{
          //   this.$refs['videoUpload'].commonUpdateSrc('')
          // }
          // console.log("edit 时，video的id和action",this.$refs['videoUpload'].id,this.$refs['videoUpload'].action);
        })

      })
    },

    // 启用物料
    startBM(id) {
      request.post('/externalAccount/baseData/material/startBM', id).then(res => {
        this.$message({
          message: '启用成功!',
          type: 'success'
        });
        this.getMaterialList()

      })
    },
    // 禁用物料
    stop(id) {
      request.post('/externalAccount/baseData/material/stop', id).then(res => {
        this.$message({
          message: '禁用成功!',
          type: 'success'
        });
        this.getMaterialList()

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
      request.post('/externalAccount/baseData/material/del', ids).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getMaterialList()
        console.log("删除后重新加载页面")

      })
    },
    // 物料分组-删除事件
    del2() {
      if(this.lastClickTreeNode.id === 0){
        this.$message({
          message: '不允许删除!',
          type: 'error'
        });
        return
      }
      let delId = this.lastClickTreeNode.id

      if(!delId){
        this.$message({
          message: '请选择一个分组!',
          type: 'error'
        });
        return
      }
      let parentId = this.lastClickTreeNode.parentId

      console.log("选中删除分组id:", delId)
      request.get('/externalAccount/baseData/materialGroup/delById?id=' + delId+'&&groupCode='+this.lastClickTreeNode.code).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });

        this.getMaterialGroupList()
        this.defaulExpandedKeys = [parentId]; // 编辑要展开自己或者上级

        console.log("删除后重新加载页面")

      })
    },
    // 关闭弹窗处理动作
    handleClose(done) {
      this.$refs['editForm'].resetFields();
      console.log("关闭窗口")
      this.fileList=[]
      this.copyFlag=false;
      done();
    },
    // 物料分组 关闭弹窗处理动作
    handleClose_group(done) {
      this.$refs['groupEditForm'].resetFields();
      console.log("关闭分组窗口")
      done();
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 分类分组 树形菜单的点击事件
    handleNodeClick(data, node, item) {
      console.log(data)
      console.log(node)
      console.log(item)
      this.lastClickTreeNode = {
        id: data.id,
        code: data.code,
        label: data.label,
        name: data.name,
        parentId: data.parentId,
        parentCode: data.parentCode
      };
      console.log("最后选中的Treedata: ", this.lastClickTreeNode)
    }
  },
  // 页面初始化时调用的方法
  created() {
    this.getMaterialList()
    this.getMaterialGroupList()
    this.loadUnitAll()
  }

}
</script>

<style scoped>
.el-pagination {
  float: right;

}
/deep/ .el-upload-dragger{
  width: 289px;
  height: 200px;
}
</style>