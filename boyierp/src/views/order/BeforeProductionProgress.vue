<template>
  <div class="table-style">
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
        <el-input size="mini" v-model="searchStr" clearable></el-input>
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
            <el-input size="mini" v-model="item.searchStr" style="width: 150px" clearable></el-input>

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
            style="margin-left: 0;width: 160px"
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

      <el-form-item v-if="hasAuth('order:beforeProductionProgress:save')">

        <el-button type="primary" size="mini" icon="el-icon-plus" v-if="hasAuth('order:beforeProductionProgress:save')"  @click="dialogVisible = true">新增</el-button>
      </el-form-item>




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
           label="工厂货号"
           prop="productNum"
           width="100">
       </el-table-column>
       <el-table-column
           label="品牌"
           prop="productBrand"
           width="100">
       </el-table-column>

       <el-table-column
           prop="status"
           label="状态"
           width="87px"
           sortable
       >
         <template slot-scope="scope">
           <el-tag size="small" v-if="scope.row.status === 0" type="success">已审核</el-tag>
           <el-tag size="small" v-else-if="scope.row.status===1" type="warning">待审核</el-tag>

         </template>
       </el-table-column>

       <el-table-column
           label="创建日期"
           prop="created"
           width="150">
       </el-table-column>
       <el-table-column
           label="创建人"
           prop="createdUser"
           width="80">
       </el-table-column>

       <el-table-column
           label="最后修改人"
           prop="updatedUser"
           width="100">
       </el-table-column>

         <el-table-column prop="orderStatus" label="进度状态" align="center" width="630" >

           <template slot-scope="scope">

             <el-steps :active="scope.row.currentIndex"  align-center>

               <el-step

                   v-for="(value, key) in milepost"

                   :title="value.title"

                   :key="key"
                   :description="scope.row.details[key].created"

               ></el-step>

             </el-steps>

           </template>

         </el-table-column>


       <!-- fixed 固定某一列，都会显示 ，并且横向内容可以有横向拉框-->
       <el-table-column
           prop="action"
           label="操作"
           width="350"
           fixed="right"
       >
         <template slot-scope="scope">

           <el-button type="text" size="small" @click="edit(scope.row.id)" v-if="hasAuth('order:beforeProductionProgress:update')  && scope.row.status==1 " >编辑</el-button>
           <el-divider direction="vertical" v-if="hasAuth('order:beforeProductionProgress:del')   && scope.row.status==1  "></el-divider>

           <el-button type="text" style="padding: 0" v-if="hasAuth('order:beforeProductionProgress:del')   && scope.row.status==1  ">
             <!-- 气泡确认框 -->
             <template>
               <el-popconfirm @confirm="del(scope.row.id)"
                              title="确定删除吗？"
               >
                 <el-button type="text" size="small" slot="reference">删除</el-button>
               </el-popconfirm>
             </template>
           </el-button>

           <el-divider direction="vertical" v-if="hasAuth('order:beforeProductionProgress:valid')  && scope.row.status==1 "></el-divider>

           <el-button type="text" style="padding: 0" v-if="hasAuth('order:beforeProductionProgress:valid')  && scope.row.status==1 ">
             <!-- 气泡确认框 -->
             <template>
               <el-popconfirm @confirm="statusPass(scope.row.id)"
                              title="确定设置审核通过吗？"
               >
                 <el-button type="text" size="small" slot="reference">审核通过</el-button>
               </el-popconfirm>
             </template>
           </el-button>


           <el-button type="text" style="padding: 0" v-if="hasAuth('order:beforeProductionProgress:valid')  && scope.row.status==0 && scope.row.currentIndex == 1">
             <!-- 气泡确认框 -->
             <template>
               <el-popconfirm @confirm="statusReturn(scope.row.id)"
                              title="确定设置反审核通过吗？"
               >
                 <el-button type="text" size="small" slot="reference">反审核</el-button>
               </el-popconfirm>
             </template>
           </el-button>
           <el-button type="text" size="small" @click="getDetailsById(scope.row)"
                      v-if="hasAuth('order:beforeProductionProgress:list')  " >
             查看各阶段进度内容</el-button>

           <el-button type="text" size="small" @click="getDetailById(scope.row,scope.row.currentIndex)"
                      v-if="hasAuth('order:beforeProductionProgress:valid')  && scope.row.status==0 && scope.row.currentIndex == 1 " >
             编辑客户沟通进度</el-button>

           <el-button type="text" size="small" @click="getDetailById(scope.row,scope.row.currentIndex)"
                      v-if="hasAuth('order:beforeProductionProgress:sureShoe')  && scope.row.status==0 && scope.row.currentIndex == 2 " >
             编辑确认鞋进度</el-button>



         </template>
       </el-table-column>

     </el-table>

    <el-dialog
        :visible.sync="dialogCustomerRequiredVisible"
        width="35%"
        title="进度详情"
        :before-close="handleCloseCustomerRequired"
    >
      <el-descriptions class="margin-top"   :column="4"  :size="5" border>
        <template slot="extra">
          <el-button type="primary"  size="small" v-show="theCurrentStepDetail.isCurrent==0" @click="submitCustomerRequiredSave()">保存</el-button>
          <el-button type="primary"  size="small" v-show="theCurrentStepDetail.isCurrent==0" @click="submitCustomerRequired()">确认</el-button>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-home">
              公司货号
            </i>
          </template>
          {{ theCurrentOrderMsg.productNum }}

        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            品牌
          </template>
          {{ theCurrentOrderMsg.productBrand }}

        </el-descriptions-item>
      </el-descriptions>
      <el-divider content-position="left"></el-divider>
      <el-form :model="theCurrentStepDetail"  label-width="100px" class="demo-editForm">
        <!-- 隐藏ID -->
        <el-form-item v-show="false" label="id" prop="id">
          <el-input  v-model="theCurrentStepDetail.id"></el-input>
        </el-form-item>

        <el-form-item label="沟通内容" prop="content">
          <el-input
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 20}"
              placeholder="请输入内容"
              v-model="theCurrentStepDetail.content">
          </el-input>
        </el-form-item>
      </el-form>

    </el-dialog>

    <el-dialog
        :visible.sync="dialogStepDetailsVisible"
        width="55%"
        title="各阶段沟通内容"
        :before-close="handleCloseDetails"
    >
      <el-descriptions class="margin-top"   :column="4"   border>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-home">
              公司货号
            </i>
          </template>
          {{ theCurrentOrderMsg.productNum }}

        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            品牌
          </template>
          {{ theCurrentOrderMsg.productBrand }}

        </el-descriptions-item>
      </el-descriptions>
      <el-divider content-position="left"></el-divider>

      <el-form :model="item" v-for="item in stepDetails" v-show="item.typeId > 10"
                label-width="100px" class="demo-editForm">
        <!-- 隐藏ID -->
        <el-form-item v-show="false" label="id" prop="id">
          <el-input  v-model="item.id"></el-input>
        </el-form-item>

        <el-form-item :label="(item.typeId==20?'客户':'确认鞋')+'沟通内容'" prop="content" label-width="150px">
          <el-input
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 20}"
              v-model="item.content">
          </el-input>
        </el-form-item>
      </el-form>

    </el-dialog>

    <!-- 弹窗 -->
    <el-dialog
        title="产前沟通确认进度表信息"
        :visible.sync="dialogVisible"
        width="35%"
        :before-close="handleClose"
    >

      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-editForm">
        <!-- 隐藏ID -->
        <el-form-item v-show="false" label="id" prop="id">
          <el-input  v-model="editForm.id"></el-input>
        </el-form-item>

        <el-form-item label="工厂货号" prop="productNum">
          <el-input  style="width: 200px" v-model="editForm.productNum"></el-input>
        </el-form-item>

        <el-form-item label="品牌" prop="productBrand">
          <el-input style="width: 200px" v-model="editForm.productBrand"></el-input>
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
        :page-sizes="[50, 200, 700, 1000]"
        :page-size="this.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total">
    </el-pagination>
  </div>
</template>

<script>
import {request, request2} from "@/axios";

export default {
  name: "BeforeProductProgress",
  data() {
    return {
      dialogCustomerRequiredVisible:false,
      dialogStepDetailsVisible:false,
      milepost:[
        {title:'确认订单'},
        {title:'客户要求'},
        {title:'确认鞋'},
      ],

      checkedBox:[0,1],
      statusArr : [{'name':'已审核','val':0},{'name':'待审核','val':1}],

      copyFlag:false,
      searchStartDate: '',
      searchEndDate: '',
      manySearchArr:[{
        selectField:'productNum',
        searchStr:'',
      }],
      select: 'productNum', // 搜索默认值
      selectedName: 'productNum',// 搜索默认值
      searchStr: '',
      options: [
        {value: 'productNum', label: '工厂货号'},
        {value: 'productBrand', label: '品牌'}
      ],

      currentPage: 1 // 当前页
      , pageSize: 50 // 一页多少条
      , total: 0, // 总共多少数据
      // batchDelDisable: true,
      // 输入框的内容要写全，不然会发生，莫名其妙不能输入的问题
      editForm: {
        id:'',
        productNum:'',
        productBrand:'',
        status:''
      },
      rules: {
        productNum: [
          {required: true, message: '请输入工厂型号', trigger: 'blur'}
        ],
        productBrand: [
          {required: true, message: '请输入品牌', trigger: 'blur'}
        ]
      }
      ,
      dialogVisible: false,
      tableData: [],
      multipleSelection: [], // 多选框数组
      theCurrentOrderMsg:'',
      theCurrentStepDetail:'',
      stepDetails:[]
    }
  },
  methods: {
    submitCustomerRequiredSave(){

      request.post('/order/beforeProductionProgress/sureCustomerRequiredSave',this.theCurrentStepDetail
      ).then(res => {
        this.$message({
          message: '保存成功!',
          type: 'success'
        });
        this.dialogCustomerRequiredVisible=false;
        this.getList()
      })
    },
    submitCustomerRequired(){

      const load = this.$loading({
        lock: true,
        text: '处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      request.post('/order/beforeProductionProgress/sureCustomerRequired',this.theCurrentStepDetail
      ).then(res => {
        load.close()

        this.$message({
          message: '确认成功!',
          type: 'success'
        });
        this.dialogCustomerRequiredVisible=false;
        this.getList()
      }).catch(()=>{
        load.close()
      })
    },
    getDetailsById(scopeRow){
      this.theCurrentOrderMsg=scopeRow

      request.get('/order/beforeProductionProgress/getDetailsById?id='
          +scopeRow.id
      ).then(res => {

        let data = res.data.data;
        this.stepDetails = data;
        this.dialogStepDetailsVisible = true;
      })
    },
    getDetailById(scopeRow,currentIndex){
      this.theCurrentOrderMsg=scopeRow

      request.get('/order/beforeProductionProgress/getDetailById?id='
          +scopeRow.id+"&&detailIndex="+currentIndex
      ).then(res => {

        let data = res.data.data;
        this.theCurrentStepDetail = data;
        this.dialogCustomerRequiredVisible = true;
      })
    },
    handleCloseDetails(done) {
      this.dialogStepDetailsVisible=false;
      this.getList()
    },
    handleCloseCustomerRequired(done) {
      this.dialogCustomerRequiredVisible=false;
      this.getList()
    },
    // 状态待审核
    statusPass(id) {
      request.get('/order/beforeProductionProgress/statusPass?id=' + id).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 状态反审核
    statusReturn(id) {
      request.get('/order/beforeProductionProgress/statusReturn?id=' + id).then(res => {
        this.$message({
          message: '反审核完成!',
          type: 'success'
        });
        this.getList()
      })
    },
    stepStyle(key, orderStatus) {

      // 动态添加类名

      if (key == orderStatus) {

        return "stepActive";

      } else if (key < orderStatus) {

        return "stepSuccess";

      } else if (key > orderStatus) {

        return "stepWait";

      }

    },
    cellStyle({ row, column, rowIndex, columnIndex }) {

      if (columnIndex === 6 || columnIndex === 7) {

        return "text-align:left";

      } else {
        return "line-height:50px";
      }

    },

    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0 ) {
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
        selectField:'productNum',
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
          request.post('/order/beforeProductionProgress/' + (this.editForm.id ? 'update' : 'save'), this.editForm).then(res => {
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

       request.post('/order/beforeProductionProgress/list?currentPage='+this.currentPage+
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
      request.get('/order/beforeProductionProgress/queryById?id=' + id).then(res => {
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
      request.post('/order/beforeProductionProgress/del', ids).then(res => {
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