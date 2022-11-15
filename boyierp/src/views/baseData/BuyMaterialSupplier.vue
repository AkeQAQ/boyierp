<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-select style="width: 120px" size="mini" v-model="select" filterable @change="searchFieldChange" placeholder="请选择搜索字段">
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

              clearable
              class="inline-input"
              popper-class="my-autocomplete"

              v-model="searchStr"
              :fetch-suggestions="querySupplierSearchValide"
              placeholder="请输入内容"
              :trigger-on-focus="false"
              @select="searchSelect"
              @change="moveMouse"
              @focus="searchSupplierFocus()"
              @keyup.enter.native="search()"

          >
          </el-autocomplete>


        <!-- 列表界面-物料搜索 -->
        <el-autocomplete
            clearable
            size="mini" v-if="selectedName === 'materialName'" style="width: 200px"
            class="inline-input"
            popper-class="my-autocomplete"
            v-model="searchStr"
            :fetch-suggestions="queryMaterialSearchValide"
            placeholder="请输入内容"
            :trigger-on-focus="false"
            @select="searchSelect"
            @change="moveMaterialMouse"
            @focus="searchMmaterialFocus"
            @keyup.enter.native="search()"

        >
        </el-autocomplete>

        <el-input size="mini" v-model="searchStr" v-if="selectedName === 'supplierMaterialId'" clearable
                  style="width: 200px"
                  @keyup.enter.native="search()"
                  placeholder="请输入内容"></el-input>


        <el-input size="mini" v-model="searchStr" v-if="selectedName === 'supplierMaterialName'" clearable
                  style="width: 200px"
                  @keyup.enter.native="search()"
                  placeholder="请输入内容"></el-input>


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

            <el-autocomplete
                size="mini" v-if="item.selectField==='supplierName'"
                style="width: 200px"

                clearable
                class="inline-input"
                popper-class="my-autocomplete"

                v-model="item.searchStr"
                :fetch-suggestions="querySupplierSearchValide"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @select="handleSelect"
                @change="moveMouse"
                @focus="searchSupplierFocus()"

            >
            </el-autocomplete>


            <!-- 列表界面-物料搜索 -->
            <el-autocomplete
                clearable
                size="mini" v-if="item.selectField === 'materialName'" style="width: 200px"
                class="inline-input"
                popper-class="my-autocomplete"
                v-model="item.searchStr"
                :fetch-suggestions="queryMaterialSearchValide"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @select="handleSelect2"
                @change="moveMaterialMouse"
                @focus="searchMmaterialFocus"

            >
            </el-autocomplete>

            <el-input size="mini" v-model="item.searchStr" v-if="item.selectField === 'supplierMaterialId'" clearable
                      style="width: 200px"
                      placeholder="请输入内容"></el-input>

            <el-input size="mini" v-model="item.searchStr" v-if="item.selectField === 'supplierMaterialName'" clearable
                      style="width: 200px"
                      placeholder="请输入内容"></el-input>



            <el-button type="danger" size="mini" icon="el-icon-delete" circle
                       @click="delSearch(index)"
            ></el-button>

          </li>
        </ul>
        <el-button type="primary" style="margin-left: 40px" size="mini" @click="addSearchItem()">添加额外搜索条件</el-button>

        <el-button slot="reference" type="info" style="padding: 0 0 ;margin-top: 20px;margin-left: -10px" size="mini" icon="el-icon-arrow-down" circle></el-button>

      </el-popover>



      <el-form-item>
        <el-button size="mini" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-form-item>

      <el-form-item v-if="hasAuth('baseData:buyMaterialSupplier:save')">

        <el-button type="primary" size="mini" icon="el-icon-plus" v-if="hasAuth('baseData:buyMaterialSupplier:save')"  @click="addBuyMaterialSupplier()">新增</el-button>
      </el-form-item>

<!--

      <el-form-item style="margin-left: 0">
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
-->


    </el-form>

    <el-table
        ref="multipleTable"
        :data="tableData"
        border
        stripe
        size="mini"
        :cell-style="{padding:'0'}"

        tooltip-effect="dark"
        style="width: 100%;color:black"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          label="内部物料编码"
          prop="innerMaterialId"
          width="150">
      </el-table-column>
      <el-table-column
          label="内部物料名称"
          prop="materialName"
          width="250">
      </el-table-column>
      <el-table-column
          prop="supplierName"
          label="供应商名称"
          width="150"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          prop="supplierMaterialId"
          label="供应商物料编码"
          width="150"
          show-overflow-tooltip>
      </el-table-column>

      <el-table-column
          prop="supplierMaterialName"
          label="供应商物料名称"
          width="300"
          show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
          prop="supplierMaterialPrice"
          label="价格"
          width="100"

      >
      </el-table-column>

      <!-- fixed 固定某一列，都会显示 ，并且横向内容可以有横向拉框-->
      <el-table-column
          prop="action"
          label="操作"
          fixed="right"

      >
        <template slot-scope="scope">

          <el-button type="text" size="small" @click="edit(scope.row.id)" v-if="hasAuth('baseData:buyMaterialSupplier:update')" >编辑</el-button>
          <el-divider direction="vertical" v-if="hasAuth('baseData:buyMaterialSupplier:del')  "></el-divider>

          <el-button type="text" style="padding: 0" v-if="hasAuth('baseData:buyMaterialSupplier:del')  ">
            <!-- 气泡确认框 -->
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

    <!-- 弹窗 -->
    <el-dialog
        title="内部物料与供应商物料信息"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
    >

      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="130px" class="demo-editForm">
        <!-- 隐藏ID -->
        <el-form-item v-show="false" label="id" prop="id">
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>


        <el-form-item v-show="false" label="内部物料编码" prop="innerMaterialId">
          <el-input v-model="editForm.innerMaterialId"></el-input>
        </el-form-item>

        <el-form-item label="物料" prop="materialName">
          <!-- 搜索框 -->
          <el-autocomplete
              clearable
              class="inline-input"
              popper-class="my-autocomplete"
              v-model="editForm.materialName"
              :fetch-suggestions="queryMaterialSearchValide"
              placeholder="请输入内容"
              :trigger-on-focus="false"
              @select="handleSelect2"
              @change="moveMaterialMouse"
              @focus="searchMmaterialFocus"
          >
          </el-autocomplete>
        </el-form-item>

        <el-form-item v-show="false" prop="supplierId">
          <el-input v-model="editForm.supplierId"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <!-- 搜索框 -->
          <el-autocomplete
              clearable
              class="inline-input"
              popper-class="my-autocomplete"

              v-model="editForm.supplierName"
              :fetch-suggestions="querySupplierSearchValide"
              placeholder="请输入内容"
              :trigger-on-focus="false"
              @select="handleSelect"
              @change="moveMouse"
              @focus="searchSupplierFocus()"
          >
          </el-autocomplete>
        </el-form-item>


        <el-form-item label="供应商物料编码" prop="supplierMaterialId">
          <el-input v-model="editForm.supplierMaterialId"></el-input>
        </el-form-item>

        <el-form-item label="供应商物料名称" prop="supplierMaterialName">
          <el-input v-model="editForm.supplierMaterialName"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="supplierMaterialPrice">
          <el-input v-model="editForm.supplierMaterialPrice"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm',addOrUpdate)">完成</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>

        </el-form-item>
      </el-form>

    </el-dialog>

    <!-- 分页组件 -->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.currentPage"
        :page-sizes="[200, 500, 700, 1000]"
        :page-size="this.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total">
    </el-pagination>
  </div>
</template>

<script>
import {request, request2} from "@/axios";

export default {
  name: "BuyMaterialSupplier",
  data() {
    return {
      supplierSearchDatas: [], // 用于搜索的建议框
      materialSearchDatas: [], // 用于搜索的建议框
      addOrUpdate: 'save',


      copyFlag:false,
      searchStartDate: '',
      searchEndDate: '',
      manySearchArr:[{
        selectField:'materialName',
        searchStr:'',
      }],
      select: 'materialName', // 搜索默认值
      selectedName: 'materialName',// 搜索默认值
      searchStr: '',
      options: [
        {value: 'materialName', label: '内部物料'},
        {value: 'supplierName', label: '供应商名称'},
        {value: 'supplierMaterialId', label: '供应商物料编码'},
        {value: 'supplierMaterialName', label: '供应商物料名称'}

      ],

      currentPage: 1 // 当前页
      , pageSize: 200 // 一页多少条
      , total: 0, // 总共多少数据
      // batchDelDisable: true,
      // 输入框的内容要写全，不然会发生，莫名其妙不能输入的问题
      editForm: {
        id:'',
        innerMaterialId:'',
        materialName:'',
        supplierName:'',
        supplierId:'',
        supplierMaterialId:'',
        supplierMaterialName:'',
        supplierMaterialPrice:''

      },
      rules: {
        materialName: [
          {required: true, message: '请输入物料', trigger: 'change'}
        ],
        supplierName: [
          {required: true, message: '请输入供应商名称', trigger: 'change'}
        ],
        supplierMaterialId: [
          {required: true, message: '请输入供应商物料编码', trigger: 'blur'}
        ]
      }
      ,
      dialogVisible: false,
      tableData: [],
      multipleSelection: [] // 多选框数组
    }
  },
  methods: {
    search(){
      this.currentPage = 1;
      this.getList();
    },

    addBuyMaterialSupplier(){
      this.addOrUpdate = 'save'
      this.editForm = {

        innerMaterialId:'',
        materialName:'',
        supplierName:'',
        supplierId:'',
        supplierMaterialId:'',
        supplierMaterialName:'',
        supplierMaterialPrice:''
      }
      this.dialogVisible = true
    },
    searchSupplierFocus() {
      console.log("供应商搜索框聚焦")
      this.loadSupplierValideAll()
    },
    searchMmaterialFocus() {
      console.log("物料搜索框聚焦")
      this.loadMaterialValideAll()
    },
    // 查询搜索框列表数据
    querySupplierSearchValide(queryString, cb) {
      var restaurants = this.supplierSearchDatas;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    // 查询搜索框列表数据
    queryMaterialSearchValide(queryString, cb) {
      var restaurants = this.materialSearchDatas;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1) || (restaurant.id.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    loadSupplierValideAll() {
      request.post('/baseData/supplier/getSearchAllData').then(res => {
        this.supplierSearchDatas = res.data.data
      })
    },
    loadMaterialValideAll() {
      request.post('/baseData/material/getSearchAllData').then(res => {
        this.materialSearchDatas = res.data.data
      })
    },
    handleSelect(item) {
      this.editForm.supplierId = item.id
      this.editForm.supplierName = item.name
      console.log("选中：", item);
    },
    handleSelect2(item) {
      this.editForm.innerMaterialId = item.id
      this.editForm.materialName = item.name
      console.log("选中：", item);
    },
    searchManySelect(item,index) {
      let theObj = this.manySearchArr[index];
      theObj.searchStr = item.name;
      console.log("manySearchArr:",this.manySearchArr)
    },
    searchSelect(item) {
      this.searchStr = item.name

    },
    moveMouse(text) {
      console.log("moveMouse",text)

      try {
        // foreach 只能抛出异常结束
        this.supplierSearchDatas.forEach(item => {
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
    moveMaterialMouse(text) {
      console.log("moveMaterialMouse",text)

      try {
        // foreach 只能抛出异常结束
        this.materialSearchDatas.forEach(item => {
          if (text === item.name) {
            console.log("匹配到:", text, item.name, this.editForm.innerMaterialId, item.id)
            this.editForm.innerMaterialId = item.id
            this.editForm.materialName = item.name
            throw new Error();
          } else {
            this.editForm.innerMaterialId = ''
            this.editForm.materialName = ''
          }
        })
      } catch (err) {
      }
    },

    getSupplierNameById(id) {
      this.supplierSearchDatas.forEach(obj => {
        if (id === obj.id) {
          this.editForm.supplierName = obj.name

        }
      })
    },
    getMaterialNameById(id) {
      console.log(this.materialSearchDatas,id)
      this.materialSearchDatas.forEach(obj => {
        if (id === obj.id) {
          console.log("匹配到物料名字")
          this.editForm.materialName = obj.name
        }
      })
    },
    /*exportCurrentList() {
      let checkStr = this.checkedBox.join(",");

      request2.post('/baseData/buyMaterialSupplier/export?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&total="+this.total+
          "&&searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select+
          "&&searchType="+checkStr
          ,{'manySearchArr':this.manySearchArr,'searchStr':this.searchStr}
          ,{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'内部物料与供应商物料当前页.xlsx')
      }).catch()
    },
    // 导出列表数据- 服务端写出字节流到浏览器，进行保存
    exportAll() {
      let checkStr = this.checkedBox.join(",");

      request2.post('/baseData/buyMaterialSupplier/export?'+
          "searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select
          +
          "&&searchType="+checkStr
          ,{'manySearchArr':this.manySearchArr,'searchStr':this.searchStr}
          ,{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'内部物料与供应商物料全部列表.xlsx')
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
    },*/

    delSearch(index){
      this.manySearchArr.splice(index,1)
    },
    addSearchItem(){
      let obj = {
        selectField:'materialName',
        searchStr:'',
      }
      this.manySearchArr.push(obj)
    },

    searchFieldChange(item) {
      this.selectedName = item
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
      console.log("多选框 选中的 ", this.multipleSelection)
    },
    // 表单提交
    submitForm(formName,methodName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const load = this.$loading({
            lock: true,
            text: '处理中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          request.post('/baseData/buyMaterialSupplier/' + methodName, this.editForm).then(res => {
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
      this.copyFlag=false;
    },

    getList() {

       request.post('/baseData/buyMaterialSupplier/list?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&total="+this.total+
          "&&searchField="+this.select,
          {'manySearchArr':this.manySearchArr,'searchStr':this.searchStr},
          null).then(res => {
        this.tableData = res.data.data.records

         this.total = res.data.data.total
      })
    },
    // 编辑页面
    edit(id) {
      this.addOrUpdate = "update"

      request.get('/baseData/buyMaterialSupplier/queryById?id=' + id).then(res => {
        let result = res.data.data
        // this.editForm = result（不知道为啥，供应商输入框不能输入）
        this.editForm.innerMaterialId = result.innerMaterialId
        this.editForm.materialName = result.materialName
        this.editForm.supplierName = result.supplierName
        this.editForm.supplierId = result.supplierId
        this.editForm.supplierMaterialId = result.supplierMaterialId
        this.editForm.supplierMaterialName = result.supplierMaterialName
        this.editForm.supplierMaterialPrice = result.supplierMaterialPrice
        this.editForm.id = result.id
        this.getSupplierNameById(result.supplierId)
         this.getMaterialNameById(result.innerMaterialId)

        console.log("edit:",this.editForm)
        // 弹出框我们先让他初始化结束再赋值
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.dialogVisible = true
        })
      })
    },
    // 删除
    del(id) {
      let ids = []
      if(id){
        // 单个删除
        console.log("删除:id",id)

        ids.push(id)
      }else{
        // 批量删除
        ids = this.multipleSelection
        console.log("批量删除:id",ids)
      }
      request.post('/baseData/buyMaterialSupplier/del', ids).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getList()
        console.log("删除后重新加载页面")

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
    }
  },
  // 页面初始化时调用的方法
  created() {
    this.getList()
    this.loadSupplierValideAll()
    this.loadMaterialValideAll()

  }
}
</script>

<style scoped>
.el-pagination {
  float: right;

}
</style>