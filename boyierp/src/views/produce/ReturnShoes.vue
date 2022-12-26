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

        <!-- userArtNo -->
        <div v-if="selectedName === 'userArtNo'" :class=" 'el-input el-input--mini'" style="margin: 0 0">
          <input  @keyup.enter="getList()" class="el-input__inner" style="width: 200px"  placeholder="请输入搜索内容"
                  v-model.lazy="searchStr">
          </input>
        </div>

        <!-- 快递号 -->
        <div v-if="selectedName === 'packageNo'" :class=" 'el-input el-input--mini'" style="margin: 0 0">
          <input  @keyup.enter="getList()" class="el-input__inner" style="width: 200px"  placeholder="请输入搜索内容"
                  v-model.lazy="searchStr">
          </input>
        </div>

        <!-- 区域 -->
        <div v-if="selectedName === 'region'" :class=" 'el-input el-input--mini'" style="margin: 0 0">
          <input  @keyup.enter="getList()" class="el-input__inner" style="width: 200px"  placeholder="请输入搜索内容"
                  v-model.lazy="searchStr">
          </input>
        </div>

        <!-- 品牌 -->
        <el-autocomplete size="mini" v-if="selectedName === 'userName'" clearable
                         style="width: 200px"
                         popper-class="my-autocomplete"
                         class="inline-input"
                         v-model="searchStr"
                         :fetch-suggestions="querySearchWithName"
                         :trigger-on-focus="false"
                         placeholder="请输入搜索内容"
                         @select="searchSelect"
                         @focus="loadCustomerAll()"
                         @keyup.enter.native="getList()"

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
            <!-- 公司货号 -->
            <div v-if="item.selectField==='userArtNo'" :class=" 'el-input el-input--mini'" style="width: 200px">
              <input   class="el-input__inner"   placeholder="请输入搜索内容"
                       v-model.lazy="item.searchStr">
              </input>
            </div>

            <div v-if="item.selectField==='packageNo'" :class=" 'el-input el-input--mini'" style="width: 200px">
              <input   class="el-input__inner"   placeholder="请输入搜索内容"
                       v-model.lazy="item.searchStr">
              </input>
            </div>

            <div v-if="item.selectField==='region'" :class=" 'el-input el-input--mini'" style="width: 200px">
              <input   class="el-input__inner"   placeholder="请输入搜索内容"
                       v-model.lazy="item.searchStr">
              </input>
            </div>

            <!-- 品牌 -->
            <el-autocomplete size="mini" v-if="item.selectField === 'userName'" clearable
                             style="width: 200px"
                             popper-class="my-autocomplete"
                             class="inline-input"
                             v-model="item.searchStr"
                             :fetch-suggestions="querySearchWithName"
                             :trigger-on-focus="false"
                             @select="searchManySelect($event,index)"
                             @focus="loadCustomerAll()"
                             placeholder="请输入搜索内容"
                             @change="moveMouse"

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
            style="margin-left: 0;width: 140px"
            placeholder="请选择类型">
          <el-option
              v-for="item in statusArr"
              :key="item.val"
              :label="item.name"
              :value="item.val">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button size="mini" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-form-item>

      <el-form-item v-if="hasAuth('produce:returnShoes:save')">

        <el-button type="primary" size="mini" icon="el-icon-plus" v-if="hasAuth('produce:returnShoes:save')"  @click="dialogVisible = true">新增</el-button>
      </el-form-item>


      <el-form-item style="margin-left: 0">
        <el-dropdown   @command="expChange">
          <el-button  icon="el-icon-download" size="mini" >
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
        ref="multipleTable"
        :data="tableData"
        border
        stripe
        size="mini"
        :cell-style="{padding:'0'}"
        :summary-method="getSummaries"
        show-summary

        tooltip-effect="dark"
        style="width: 100%;color:black"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          label="日期"
          prop="returnDate"
          width="90">
      </el-table-column>
      <el-table-column
          label="客户"
          prop="userName"
          width="100">
      </el-table-column>
      <el-table-column
          label="区域"
          prop="region"
          width="100">
      </el-table-column>
      <el-table-column
          prop="packageNo"
          label="快递号"
          width="150"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          prop="userArtNo"
          label="货号"
          show-overflow-tooltip>
      </el-table-column>

      <el-table-column
          prop="size"
          label="尺码"
          width="50"

      >
      </el-table-column>
      <el-table-column
          prop="num"
          label="数量"
          width="80"

      >
      </el-table-column>

      <el-table-column
          prop="userRequest"
          label="客户要求"
          width="150px"
      >
      </el-table-column>
      <el-table-column
          prop="departmentName"
          label="所属部门"
          width="100px"
      >
      </el-table-column>

      <el-table-column
          prop="dealSituation"
          label="处理情况"
          width="87px"
          >
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.dealSituation === '退鞋'" type="warning">退鞋</el-tag>
          <el-tag size="small" v-else-if="scope.row.dealSituation==='返修'" type="success">返修</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="backPackage"
          label="回寄快递单号"
          show-overflow-tooltip>
      </el-table-column>

      <!-- fixed 固定某一列，都会显示 ，并且横向内容可以有横向拉框-->
      <el-table-column
          prop="action"
          label="操作"
          width="230px"
          fixed="right"

      >
        <template slot-scope="scope">

          <el-button type="text" size="small" @click="edit(scope.row.id)" v-if="hasAuth('produce:returnShoes:update')" >编辑</el-button>
          <el-divider direction="vertical" v-if="hasAuth('produce:returnShoes:del')  "></el-divider>

          <el-button type="text" style="padding: 0" v-if="hasAuth('produce:returnShoes:del')  ">
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
        title="退残鞋信息"
        :visible.sync="dialogVisible"
        width="40%"
        top="0vh"
        :before-close="handleClose"
    >

      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-editForm">
        <!-- 隐藏ID -->
        <el-form-item v-show="false" label="id" prop="id">
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>

        <el-form-item label="日期" prop="returnDate">
          <el-date-picker  style="width: 140px;"
                          value-format="yyyy-MM-dd"
                          v-model="editForm.returnDate"
                          type="date"
                          clearable
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="客户" prop="userName">
          <el-autocomplete   clearable
                           style="width: 200px"
                           popper-class="my-autocomplete"
                           class="inline-input"
                           v-model="editForm.userName"
                           :fetch-suggestions="querySearchWithName"
                           :trigger-on-focus="false"
                           @select="editFormSelectUserName"
                           @focus="loadCustomerAll()"
                           placeholder="请输入搜索内容"
                           @change="moveMouse"

          >
          </el-autocomplete>
        </el-form-item>

        <el-form-item label="区域" prop="region">
          <div :class=" 'el-input el-input'">
            <input  class="el-input__inner"
                    v-model.lazy="editForm.region">
            </input>
          </div>
        </el-form-item>

        <el-form-item label="快递号" prop="packageNo">
          <div :class=" 'el-input el-input'">
            <input  class="el-input__inner"
                    v-model.lazy="editForm.packageNo">
            </input>
          </div>
        </el-form-item>

        <el-form-item label="货号" prop="userArtNo">
          <div :class=" 'el-input el-input'">
            <input  class="el-input__inner"
                    v-model.lazy="editForm.userArtNo">
            </input>
          </div>
        </el-form-item>

        <el-form-item label="尺码" prop="size">
          <div :class=" 'el-input el-input'">
            <input  class="el-input__inner"
                    v-model.lazy="editForm.size">
            </input>
          </div>
        </el-form-item>
        <el-form-item label="数量" prop="num">
          <div :class=" 'el-input el-input'">
            <input  class="el-input__inner"
                    onkeyup="value=value.replace(/[^0-9]/g,'')"
                    v-model.lazy="editForm.num">
            </input>
          </div>
        </el-form-item>
        <el-form-item label="客户要求" prop="userRequest">
          <div :class=" 'el-input el-input'">
            <input  class="el-input__inner"
                    v-model.lazy="editForm.userRequest">
            </input>
          </div>
        </el-form-item>
        <el-form-item v-if="false" prop="departmentId" style="margin-bottom: 0">
          <el-input v-model="editForm.departmentId"></el-input>
        </el-form-item>
        <el-form-item label="原因部门" prop="departmentName" style="margin-bottom: 10px">
          <!-- 搜索框 -->
          <el-autocomplete
              popper-class="my-autocomplete"
              class="inline-input"
              v-model="editForm.departmentName"
              :fetch-suggestions="querySearch"
              placeholder="请输入部门"
              @select="handleSelect"
              @change="moveMouseDepartment"
              @focus="loadDepartmentAll()"
              clearable
          >
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="处理情况" prop="dealSituation">
          <el-radio v-model="editForm.dealSituation" label="退鞋">退鞋</el-radio>
          <el-radio v-model="editForm.dealSituation" label="返修">返修</el-radio>
        </el-form-item>
        <el-form-item label="回寄快递单号" prop="backPackage">
          <div :class=" 'el-input el-input'">
            <input  class="el-input__inner"
                    v-model.lazy="editForm.backPackage">
            </input>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">完成</el-button>
          <el-button type="primary" :disabled="copyFlag" @click="copy()">复制</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>

        </el-form-item>
      </el-form>

    </el-dialog>

    <!-- 分页组件 -->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.currentPage"
        :page-sizes="[50, 200, 500, 1000]"
        :page-size="this.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total">
    </el-pagination>
  </div>
</template>

<script>
import {request, request2} from "@/axios";

export default {
  name: "ReturnShoes",
  data() {
    return {
      checkedBox:['退鞋','返修'],
      statusArr : [{'name':'退鞋','val':'退鞋'},{'name':'返修','val':'返修'}],

      copyFlag:false,
      searchStartDate: '',
      searchEndDate: '',
      manySearchArr:[{
        selectField:'userName',
        searchStr:'',
      }],
      select: 'userName', // 搜索默认值
      selectedName: 'userName',// 搜索默认值
      searchStr: '',
      options: [
        {value: 'userName', label: '客户名称'},
        {value: 'packageNo', label: '快递号'},
        {value: 'userArtNo', label: '货号'},
        {value: 'region', label: '区域'},

      ],

      currentPage: 1 // 当前页
      , pageSize: 50 // 一页多少条
      , total: 0, // 总共多少数据
      // batchDelDisable: true,
      // 输入框的内容要写全，不然会发生，莫名其妙不能输入的问题
      editForm: {
        userName:'',
        packageNo:'',
        userArtNo:'',
        size:'',
        num:0,
        userRequest:'',
        dealSituation:'',
        backPackage:'',
        returnDate: new Date().format("yyyy-MM-dd")

      },
      rules: {
        userName: [
          {required: true, message: '请输入客户名称', trigger: 'blur'}
        ],
        returnDate: [
          {required: true, message: '请输入日期', trigger: 'blur'}
        ],
        num: [
          {required: true, message: '请输入数量', trigger: 'blur'}
        ],
        userArtNo: [
          {required: true, message: '请输入货号', trigger: 'blur'}
        ],
        dealSituation: [
          {required: true, message: '请选择类别', trigger: 'blur'}
        ],
        departmentName: [
          {required: true, message: '请选择原因部门', trigger: 'blur'}
        ]
      }
      ,
      dialogVisible: false,
      tableData: [],
      multipleSelection: [], // 多选框数组
      restaurantsCustomer: [],
      restaurantsDepartment:[],
    }
  },
  methods: {
    loadDepartmentAll() {
      request.post('/baseData/department/getSearchAllData').then(res => {
        this.restaurantsDepartment = res.data.data
      })
    },
    editFormSelectUserName(item) {
      this.editForm.userName = item.name
    },
    handleSelect(item) {
      this.editForm.departmentId = item.id
      this.editForm.departmentName = item.name
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1) || ((restaurant.id+"").toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurantsDepartment;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;

      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    searchManySelect(item,index) {
      let theObj = this.manySearchArr[index];
      theObj.searchStr = item.name;
      console.log("manySearchArr:",this.manySearchArr)
    },
    loadCustomerAll() {
      request.post('/baseData/customer/getSearchAllData').then(res => {
        this.restaurantsCustomer = res.data.data
      })
    },
    searchSelect(item) {
      this.searchStr = item.name
    },
    tableSelectSearchCustomer(selectItem, param) {
      param.userName = selectItem.obj.name
    },
    moveMouseDepartment(text) {
      try {
        // foreach 只能抛出异常结束
        this.restaurants.forEach(item => {
          if (text === item.name) {
            this.editForm.departmentId = item.id
            this.editForm.departmentName = item.name
            throw new Error();
          } else {
            this.editForm.departmentId = ''
            this.editForm.departmentName = ''
          }
        })
      } catch (err) {
      }
    },
    moveMouse(text) {
      try {
        // foreach 只能抛出异常结束
        this.restaurantsCustomer.forEach(item => {
          if (text === item.name) {
            this.editForm.userName = item.name
            throw new Error();
          } else {
            this.editForm.userName = ''
          }
        })
      } catch (err) {
      }
    },
    createFilterWithName(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
      };
    },
    querySearchWithName(queryString, cb) {
      let restaurants = this.restaurantsCustomer;
      console.log("res",restaurants)
      let results = queryString ? restaurants.filter(this.createFilterWithName(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0 ) {
          sums[index] = '求和';
          return;
        }
        if (index === 7 ) {
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
    copy(){
      this.editForm.id = ''
      this.copyFlag=true;
      this.$message.success("已复制")
    },
    exportCurrentList() {
      let checkStr = this.checkedBox.join(",");

      request2.post('/produce/returnShoes/export?currentPage='+this.currentPage+
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

        this.saveFile(blob,'退残鞋当前页.xlsx')
      }).catch()
    },
    // 导出列表数据- 服务端写出字节流到浏览器，进行保存
    exportAll() {
      let checkStr = this.checkedBox.join(",");

      request2.post('/produce/returnShoes/export?'+
          "searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select
          +
          "&&searchType="+checkStr
          ,{'manySearchArr':this.manySearchArr,'searchStr':this.searchStr}
          ,{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,'退残鞋全部列表.xlsx')
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
        selectField:'userName',
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          request.post('/produce/returnShoes/' + (this.editForm.id ? 'update' : 'save'), this.editForm).then(res => {
            this.$message({
              message: (this.editForm.id ? '编辑' : '新增') + '成功!',
              type: 'success'
            });

            // 关闭弹窗并且重置内容
            this.dialogVisible = false;
            this.resetForm("editForm")
            this.getList();

          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      this.copyFlag=false;
    },

    // 查询角色表单列表数据
    getList() {
      let checkStr = this.checkedBox.join(",");

       request.post('/produce/returnShoes/list?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&total="+this.total+
          "&&searchStartDate="+this.searchStartDate+
          "&&searchEndDate="+this.searchEndDate+
          "&&searchField="+this.select+
          "&&searchType="+checkStr,
          {'manySearchArr':this.manySearchArr,'searchStr':this.searchStr},
          null).then(res => {
        this.tableData = res.data.data.records
        this.total = res.data.data.total
      })
    },
    // 编辑页面
    edit(id) {
      request.get('/produce/returnShoes/queryById?id=' + id).then(res => {
        let result = res.data.data
        this.dialogVisible = true
        // 弹出框我们先让他初始化结束再赋值 ，不然会无法重置
        this.$nextTick(() => {
          // 赋值到编辑表单
          this.editForm = result
          console.log("user id=" + id)
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
      request.post('/produce/returnShoes/del', ids).then(res => {
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
      this.copyFlag=false;
      done();
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  // 页面初始化时调用的方法
  created() {
    this.loadCustomerAll()
    this.getList()
    this.dialogVisible = false

  }
}
</script>

<style scoped>
.el-pagination {
  float: right;

}
</style>