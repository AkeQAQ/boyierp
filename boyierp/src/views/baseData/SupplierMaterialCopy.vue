<template>
  <!-- 采购价目表得复制 -->
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
          <el-autocomplete size="mini" v-if="selectedName==='supplierName'" clearable
                           style="width: 200px"
                           popper-class="my-autocomplete"

                           class="inline-input"
                           v-model.lazy="searchStr"
                           :fetch-suggestions="querySupplierSearchValide"
                           placeholder="请输入内容"
                           :trigger-on-focus="false"
                           @select="searchSelect"

          >
          </el-autocomplete>

          <!-- 字段搜索框 -->
          <el-autocomplete size="mini" v-if="selectedName === 'materialName'" clearable
                           style="width: 200px"
                           popper-class="my-autocomplete"

                           class="inline-input"
                           v-model.lazy="searchStr"
                           :fetch-suggestions="queryMaterialSearchValide"
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
              <el-autocomplete size="mini" v-if="item.selectField==='supplierName'" clearable
                               style="width: 200px"
                               popper-class="my-autocomplete"
                               clearable
                               class="inline-input"
                               v-model.lazy="item.searchStr"
                               :fetch-suggestions="querySupplierSearchValide"
                               placeholder="请输入内容"
                               :trigger-on-focus="false"
                               @select="searchManySelect($event,index)"

              >
              </el-autocomplete>

              <el-autocomplete size="mini" v-if="item.selectField === 'materialName'" clearable
                               style="width: 200px"
                               popper-class="my-autocomplete"
                               clearable
                               class="inline-input"
                               v-model.lazy="item.searchStr"
                               :fetch-suggestions="queryMaterialSearchValide"
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


        <el-form-item v-if="hasAuth('baseData:supplierMaterialCopy:save')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('baseData:supplierMaterialCopy:save')"
                     @click="addSupplierMaterial()">新增
          </el-button>
        </el-form-item>
        <el-form-item v-if="hasAuth('baseData:supplierMaterialCopy:valid')">
          <el-popconfirm @confirm="statusPassBatch()" title="确定审核吗？">
            <el-button size="mini" icon="el-icon-success" :disabled="this.multipleSelection.length === 0 " type="danger"
                       slot="reference">批量审核
            </el-button>
          </el-popconfirm>
        </el-form-item>
        <!--

                <el-form-item v-if="hasAuth('baseData:supplierMaterialCopy:del')">
                  <el-popconfirm @confirm="del(null)" title="确定删除吗？">
                    <el-button size="mini" icon="el-icon-delete" :disabled="this.multipleSelection.length === 0 " type="danger" slot="reference">批量删除</el-button>
                  </el-popconfirm>
                </el-form-item>
        -->

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
            label="供应商"
            prop="supplierName"
            show-overflow-tooltip
            width="150px"
        >
        </el-table-column>
        <el-table-column
            label="物料编码"
            prop="materialId"
            width="100px"
        >
        </el-table-column>

        <el-table-column
            prop="materialName"
            label="物料名称"
            show-overflow-tooltip
            width="150px"
        >
        </el-table-column>

        <el-table-column
            prop="unit"
            label="基本单位"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="specs"
            label="规格"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="price"
            label="单价"
            show-overflow-tooltip>
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
                       v-if="hasAuth('baseData:supplierMaterialCopy:update') && scope.row.status ===1  ">编辑
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('baseData:supplierMaterialCopy:valid') && scope.row.status ===1   "></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('baseData:supplierMaterialCopy:valid')  && scope.row.status ===1   ">
              <template>
                <el-popconfirm @confirm="statusPass(scope.row.id)"
                               title="确定设置审核通过吗？"
                >
                  <el-button type="text" size="small" slot="reference">审核通过</el-button>
                </el-popconfirm>
              </template>
            </el-button>


            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('baseData:supplierMaterialCopy:valid')  && scope.row.status ===0  ">
              <template>
                <el-popconfirm @confirm="statusReturn(scope.row.id)"
                               title="确定反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">反审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button type="text" size="small" @click="edit(scope.row.id)"
                       v-if="hasAuth('baseData:supplierMaterialCopy:valid') && scope.row.status ===0  ">修改失效日期
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('baseData:supplierMaterialCopy:del') && scope.row.status ===1 "></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('baseData:supplierMaterialCopy:del') && scope.row.status ===1  ">
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

          <el-form-item v-if="false" prop="supplierId">
            <el-input v-model="editForm.supplierId"></el-input>
          </el-form-item>
          <el-form-item label="供应商" prop="supplierName">
            <!-- 搜索框 -->
            <el-autocomplete
                class="inline-input"
                :disabled="editForm.status === 0 && editForm.id !=''"
                popper-class="my-autocomplete"

                v-model="editForm.supplierName"
                :fetch-suggestions="querySupplierSearchValide"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @select="handleSelect"
                @change="moveMouse"
                @focus="searchSupplierFocus()"

                clearable
            >
            </el-autocomplete>
          </el-form-item>

          <el-form-item v-if="false" prop="materialId">
            <el-input v-model="editForm.materialId"></el-input>
          </el-form-item>

          <el-form-item label="物料" prop="materialName">
            <!-- 搜索框 -->
            <el-autocomplete
                popper-class="my-autocomplete"
                :disabled="editForm.status === 0 && editForm.id !=''"

                v-model="editForm.materialName"
                :fetch-suggestions="queryMaterialSearchValide"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @select="handleSelect2"
                @change="moveMaterialMouse"
                clearable
                @focus="searchMmaterialFocus"
            >
              <i
                  class="el-icon-edit el-input__icon"
                  slot="suffix"
              >
              </i>
              <template slot-scope="{ item }">
                <div class="name">{{ item.value }}</div>
                <span class="unit">{{ item.bigUnit }}</span>
              </template>
            </el-autocomplete>
          </el-form-item>
          <!--                  style="line-height: normal;padding: 7px;"-->

          <!--          style="font-size: 12px;height:10px;color:#b4b4b4"-->

          <el-form-item label="单价" prop="price">
            <el-input v-model="editForm.price" style="width: 220px"
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
          :page-sizes="[200, 500, 700, 1000]"
          :page-size="this.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total">
      </el-pagination>
    </el-main>
  </el-container>


</template>

<script>
import {request} from "@/axios";

export default {
  name: "supplierMaterial",

  data() {
    return {
      manySearchArr:[{
        selectField:'supplierName',
        searchStr:'',
      }],
      checkedBox:[1,0],
      statusArr : [{'name':'待审核','val':1},{'name':'已审核','val':0}],

      tableLoad: false,
      // 搜索字段
      selectedName: 'supplierName',// 搜索默认值
      options: [
        {value: 'supplierName', label: '供应商名称'},
        {value: 'materialName', label: '物料名称'}
      ],
      select: 'supplierName', // 搜索默认值
      searchStr: '',
      searchField: '',
      supplierSearchDatas: [], // 用于搜索的建议框
      materialSearchDatas: [], // 用于搜索的建议框


      // 分页字段
      currentPage: 1 // 当前页
      , pageSize: 200 // 一页多少条
      , total: 0 // 总共多少数据
      ,
      // 表单字段
      addOrUpdate: 'save',
      editForm: {
        status: 0, // 编辑表单初始默认值
        id: '',
        supplierId: '',
        supplierName: '',
        materialName: '',
        materialId: '',
        startDate: '',
        endDate: '',
        price: ''
      },
      rules: {
        materialName: [
          {required: true, message: '请输入物料', change: 'blur'}
        ],
        supplierName: [
          {required: true, message: '请输入供应商', change: 'blur'}
        ],
        price: [
          {required: true, message: '请输入单价', trigger: 'blur'}
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

    searchMmaterialFocus() {
      console.log("物料搜索框聚焦")
      this.loadMaterialValideAll()
    },
    searchSupplierFocus() {
      console.log("供应商搜索框聚焦")
      this.loadSupplierValideAll()
    },
    /*computed: {
      selectedName: {
        get() {
          return this.selectedName;
        }
      },
    },*/
    loadMaterialValideAll() {
      request.post('/baseData/material/getSearchAllData').then(res => {
        this.materialSearchDatas = res.data.data
      })
    },
    loadSupplierValideAll() {
      request.post('/baseData/supplier/getSearchAllData').then(res => {
        this.supplierSearchDatas = res.data.data
      })
    },
    // 查询搜索框列表数据
    queryMaterialSearchValide(queryString, cb) {
      var restaurants = this.materialSearchDatas;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    // 查询搜索框列表数据
    querySupplierSearchValide(queryString, cb) {
      var restaurants = this.supplierSearchDatas;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1) || (restaurant.id.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    getSupplierNameById(id) {
      this.supplierSearchDatas.forEach(obj => {
        if (id === obj.id) {
          this.editForm.supplierName = obj.name

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
    searchManySelect(item,index) {
      let theObj = this.manySearchArr[index];
      theObj.searchStr = item.name;
      console.log("manySearchArr:",this.manySearchArr)
    },

    // 价目列表 点击添加按钮
    addSupplierMaterial() {
      this.addOrUpdate = 'save'
      this.editForm = {
        status: 0, // 编辑表单初始默认值
        id: '',
        supplierId: '',
        supplierName: '',
        materialName: '',
        materialId: '',
        startDate: '',
        endDate: '',
        price: ''
      }
      this.dialogVisible = true
    },

    // 分页方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getSupplierMaterialList()

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getSupplierMaterialList()

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
        console.log("当前物料id:", this.editForm.materialId)
        if (valid) {
          const load = this.$loading({
            lock: true,
            text: '处理中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          request.post('/baseData/supplierMaterialCopy/' + methodName, this.editForm).then(res => {
            load.close()
            this.$message({
              message: (this.editForm.id ? '编辑' : '新增') + '成功!',
              type: 'success'
            });

            // 关闭弹窗并且重置内容
            this.dialogVisible = false;
            this.resetForm("editForm")
            this.getSupplierMaterialList();

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
      this.getSupplierMaterialList()
    },
    // 查询价目表单列表数据
    async getSupplierMaterialList() {
      this.tableLoad = true;
      let checkStr = this.checkedBox.join(",");
      console.log("多选框：",checkStr )
      console.log("搜索字段:", this.select)
      await request.post('/baseData/supplierMaterialCopy/list?currentPage='+this.currentPage+
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
      request.get('/baseData/supplierMaterialCopy/queryById?id=' + id).then(res => {
        let result = res.data.data
        this.editForm = result
        this.getSupplierNameById(this.editForm.supplierId)
        this.getMaterialNameById(this.editForm.materialId)

        // 弹出框我们先让他初始化结束再赋值
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.dialogVisible = true
        })

      })
    },
    statusPassBatch(){
      let ids = this.multipleSelection;
      request.post('/baseData/supplierMaterialCopy/statusPassBatch',ids).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getSupplierMaterialList()
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
      request.post('/baseData/supplierMaterialCopy/del', ids).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getSupplierMaterialList()
        console.log("删除后重新加载页面")

      })
    },
    // 状态待审核
    statusPass(id) {
      request.get('/baseData/supplierMaterialCopy/statusPass?id=' + id).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getSupplierMaterialList()
      })
    },
    // 状态反审核
    statusReturn(id) {
      request.get('/baseData/supplierMaterialCopy/statusReturn?id=' + id).then(res => {
        this.$message({
          message: '反审核完成!',
          type: 'success'
        });
        this.getSupplierMaterialList()
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
      if (item === 'supplierName') {
        this.selectedName = item
      } else {
        this.selectedName = item

      }
    },
    moveMouse(text) {
      try {
        // foreach 只能抛出异常结束
        this.supplierSearchDatas.forEach(item => {
          console.log("moveMouse")
          if (text === item.name) {
            console.log("匹配到:", text, item.name, this.editForm.supplierId, item.id)
            this.editForm.supplierId = item.id
            this.editForm.supplierName = item.name

            throw new Error();
          } else {
            this.editForm.supplierId = ''
            this.editForm.supplierName = ''
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
    this.getSupplierMaterialList()
    this.loadSupplierValideAll()
    this.loadMaterialValideAll()
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