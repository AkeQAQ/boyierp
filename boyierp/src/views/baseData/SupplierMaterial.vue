<template>

  <el-container>
    <el-main>
      <!-- 右侧价目列表 -->
      <el-form :inline="true" class="demo-form-inline">

        <el-form-item>
          <el-select size="mini" v-model="select" filterable @change="searchFieldChange" placeholder="请选择搜索字段" >
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
                           class="inline-input"
                           v-model="searchStr"
                           :fetch-suggestions="querySearch"
                           placeholder="请输入内容"
                           @select="searchSelect"

          >
          </el-autocomplete>

          <!-- 字段搜索框 -->
          <el-autocomplete size="mini" v-if="selectedName === 'materialName'" clearable
                           class="inline-input"
                           v-model="searchStr"
                           :fetch-suggestions="querySearch2"
                           placeholder="请输入内容"
                           @select="searchSelect"
          >
          </el-autocomplete>
        </el-form-item>


        <el-form-item>
          <el-button size="mini" icon="el-icon-search" @click="getSupplierMaterialList">搜索</el-button>
        </el-form-item>


        <el-form-item v-if="hasAuth('baseData:supplierMaterial:save')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('baseData:supplierMaterial:save')" @click="addSupplierMaterial()">新增
          </el-button>
        </el-form-item>

        <el-form-item v-if="hasAuth('baseData:supplierMaterial:del')">
          <el-popconfirm @confirm="del(null)" title="确定删除吗？">
            <el-button size="mini" icon="el-icon-delete" :disabled="this.multipleSelection.length === 0 " type="danger" slot="reference">批量删除</el-button>
          </el-popconfirm>
        </el-form-item>

      </el-form>

      <el-table

          ref="multipleTable"
          :data="tableData"
          border
          stripe
          fit
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
            label="供应商"
            prop="supplierName">
        </el-table-column>
        <el-table-column
            label="物料编码"
            prop="materialId"

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
            sortable
        >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.startDate }}</span>
          </template>
        </el-table-column>

        <el-table-column
            prop="endDate"
            label="失效日期"
            sortable>
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.endDate }}</span>
          </template>
        </el-table-column>

        <el-table-column
            prop="comment"
            label="备注"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="status"
            label="状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status === 0" type="success">正常</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===1" type="danger">禁止</el-tag>

          </template>
        </el-table-column>

        <el-table-column
            prop="action"
            label="操作"
            width="140px"
            fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row.id)"
                       v-if="hasAuth('baseData:supplierMaterial:update')   ">编辑
            </el-button>

            <el-divider direction="vertical" v-if="hasAuth('baseData:supplierMaterial:del')   "></el-divider>

            <el-button style="padding: 0px" type="text" v-if="hasAuth('baseData:supplierMaterial:del')   ">
              <template>
                <el-popconfirm @confirm="statusStop(scope.row.id)"
                               title="确定禁用吗？"
                >
                  <el-button type="text" size="small" slot="reference">禁用</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical" v-if="hasAuth('baseData:supplierMaterial:del')   "></el-divider>

            <el-button style="padding: 0px" type="text" v-if="hasAuth('baseData:supplierMaterial:del')   ">
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
                v-model="editForm.supplierName"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                @select="handleSelect"
                @change="moveMouse"
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
                class="inline-input"
                v-model="editForm.materialName"
                :fetch-suggestions="querySearch2"
                placeholder="请输入内容"
                @select="handleSelect2"
                @change="moveMaterialMouse"
                clearable
            >
            </el-autocomplete>
          </el-form-item>


          <el-form-item label="单价" prop="price">
            <el-input v-model="editForm.price" style="width: 220px" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </el-form-item>

          <el-form-item label="备注" prop="comment">
            <el-input v-model="editForm.comment" style="width: 220px">
            </el-input>
          </el-form-item>

          <el-form-item label="生效日期" prop="startDate">
            <el-date-picker
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




                          <el-form-item label="状态" prop="status">
                            <el-radio-group v-model="editForm.status">
                              <el-radio :label=0>正常</el-radio>
                              <el-radio :label=1>禁止</el-radio>
                            </el-radio-group>
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
          :page-sizes="[100, 200, 300, 400]"
          :page-size="this.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total">
      </el-pagination>
    </el-main>
  </el-container>


</template>

<script>
export default {
  name: "supplierMaterial",

  data() {
    return {
      // 搜索字段
      selectedName: 'supplierName',// 搜索默认值
      options: [
        {value: 'supplierName', label: '供应商名称'},
        {value: 'materialName', label: '物料名称'}
      ],
      select: 'supplierName', // 搜索默认值
      searchStr: '',
      searchField: '',
      restaurants: [],// 搜索框列表数据存放
      restaurants2: []
      ,

      // 分页字段
      currentPage: 1 // 当前页
      , pageSize: 100 // 一页多少条
      , total: 0 // 总共多少数据
      ,
      // 表单字段
      addOrUpdate: 'save',
      editForm: {
        status: 0, // 编辑表单初始默认值
        id: '',
        supplierId: '',
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
    /*computed: {
      selectedName: {
        get() {
          return this.selectedName;
        }
      },
    },*/
    loadSupplierAll() {
      this.$axios.post('/baseData/supplier/getSearchAllData').then(res => {
        this.restaurants = res.data.data
      })
    },


    loadMaterialAll() {
      this.$axios.post('/baseData/material/getSearchAllData').then(res => {
        this.restaurants2 = res.data.data
      })
    },
    // 查询搜索框列表数据
    querySearch2(queryString, cb) {
      var restaurants = this.restaurants2;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    // 查询搜索框列表数据
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0) || (restaurant.id.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
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

    // 价目列表 点击添加按钮
    addSupplierMaterial() {
      this.dialogVisible = true
      this.addOrUpdate = 'save'
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
          this.$axios.post('/baseData/supplierMaterial/' + methodName, this.editForm).then(res => {
            this.$message({
              message: (this.editForm.id ? '编辑' : '新增') + '成功!',
              type: 'success'
            });

            // 关闭弹窗并且重置内容
            this.dialogVisible = false;
            this.resetForm("editForm")
            this.getSupplierMaterialList();

          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    // 查询价目表单列表数据
    getSupplierMaterialList() {
      console.log("搜索字段:", this.select)
      this.$axios.get('/baseData/supplierMaterial/list', {
        params: {
          currentPage: this.currentPage
          , pageSize: this.pageSize
          , total: this.total
          , searchStr: this.searchStr
          , searchField: this.select
        }
      }).then(res => {
        this.tableData = res.data.data.records
        this.total = res.data.data.total
        console.log("获取用户表单数据", res.data.data.records)
      })
    },
    // 编辑页面
    edit(id) {
      this.addOrUpdate = "update"
      this.$axios.get('/baseData/supplierMaterial/queryById?id=' + id).then(res => {
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
      this.$axios.post('/baseData/supplierMaterial/del', ids).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getSupplierMaterialList()
        console.log("删除后重新加载页面")

      })
    },
    // 状态禁用
    statusStop(id){
      this.$axios.get('/baseData/supplierMaterial/statusStop?id='+id).then(res => {
        this.$message({
          message: '禁用成功!',
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
    moveMouse(text){
      try{
        // foreach 只能抛出异常结束
        this.restaurants.forEach(item =>{
          if(text === item.name){
            console.log("匹配到:",text,item.name,this.editForm.supplierId,item.id)
            this.editForm.supplierId = item.id
            this.editForm.supplierName=item.name

            throw new Error();
          }else {
            this.editForm.supplierId = ''
            this.editForm.supplierName = ''
            console.log("没有匹配到",text,item.name)
          }
        })
      }catch (err){
      }
    },
    moveMaterialMouse(text){
      try{
        // foreach 只能抛出异常结束
        this.restaurants2.forEach(item =>{
          if(text === item.name){
            console.log("匹配到:",text,item.name,this.editForm.materialId,item.id)
            this.editForm.materialId = item.id
            this.editForm.materialName=item.name
            throw new Error();
          }else {
            this.editForm.materialId = ''
            this.editForm.materialName = ''

            console.log("没有匹配到",text,item.name)
          }
        })
      }catch (err){
      }
    }

  },
  // 页面初始化时调用的方法
  created() {
    this.getSupplierMaterialList()
    this.loadSupplierAll()
    this.loadMaterialAll()

  }

}
</script>

<style scoped>
.el-pagination {
  float: right;

}
</style>