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
                           :fetch-suggestions="queryMaterialSearchValide"
                           :trigger-on-focus="false"
                           placeholder="请输入搜索内容"
                           @select="searchSelect"
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
                               :fetch-suggestions="queryMaterialSearchValide"
                               :trigger-on-focus="false"
                               placeholder="请输入搜索内容"
                               @select="searchManySelect($event,index)"
                               @focus="searchMmaterialFocus()"
                               @keyup.enter.native="search()"

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
          <el-button size="mini" icon="el-icon-search" @click="search()" type="success">搜索</el-button>
        </el-form-item>

        <el-form-item v-if="hasAuth('baseData:materialSameGroup:save')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('baseData:materialSameGroup:save')"
                     @click="addComplementPrepare()"

          >新增
          </el-button>
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
          :span-method="objectSpanMethod"

          size="mini"
          tooltip-effect="dark"
          style="width: 100%;color:black"
          :cell-style="{padding:'0',borderColor:'black'}"
          :header-cell-style="{borderColor:'black'}"
          @selection-change="handleSelectionChange">



        <el-table-column
            prop="name"
            label="组名"
            width="150px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="materialId"
            label="物料编码"
            width="200px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="materialName"
            label="物料名称"
            width="300px"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="action"
            label="操作"
            fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row.id) "
                       v-if="hasAuth('baseData:materialSameGroup:save') && scope.row.status ===1   ">编辑
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('baseData:materialSameGroup:del')  && scope.row.status ===1  "></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('baseData:materialSameGroup:del') && scope.row.status ===1   ">
              <template>
                <el-popconfirm @confirm="del(scope.row.id)"
                               title="确定删除吗？"
                >
                  <el-button type="text" size="small" slot="reference" @click.stop="">删除</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-divider direction="vertical"
                        v-if="hasAuth('baseData:materialSameGroup:valid')  && scope.row.status ===1  "></el-divider>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('baseData:materialSameGroup:valid')  && scope.row.status === 1  ">

              <template>
                <el-popconfirm @confirm="statusPass(scope.row.id)"
                               title="确定设置审核通过吗？"
                >
                  <el-button type="text" size="small" slot="reference">审核通过</el-button>
                </el-popconfirm>
              </template>
            </el-button>


            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('baseData:materialSameGroup:valid')  && scope.row.status === 0  ">

              <template>
                <el-popconfirm @confirm="statusReturn(scope.row.id)"
                               title="确定设置反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">反审核通过</el-button>
                </el-popconfirm>
              </template>
            </el-button>

          </template>
        </el-table-column>

      </el-table>

      <el-dialog
          :visible.sync="dialogCalNumVisible"
          width="50%"
          title="替代物料组信息"
          :before-close="handleClosePrepare"
      >
        <el-form :model="editForm" :rules="rules" ref="editForm" label-width="120px" class="demo-editForm">

          <el-form-item  v-if="false" label="唯一编码" prop="id">
            <el-input   v-model="editForm.id" ></el-input>
          </el-form-item>

          <el-form-item label="组名称" prop="name">
            <el-input    v-model="editForm.name"/>
          </el-form-item>

          <el-form-item  v-for="(item,index) in editForm.details" label="物料名称" >
            <el-autocomplete
                popper-class="my-autocomplete"
                v-model="item.materialName"
                :fetch-suggestions="queryMaterialSearchValide"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @select="handleSelect2($event,editForm.details[index])"
                @change="moveMaterialMouse($event,editForm.details[index],index)"
                clearable
                @focus="searchMmaterialFocus(index+1)"

            >

            </el-autocomplete>
          </el-form-item>


          <el-form-item>
            <el-button type="primary" @click="submitForm('editForm',addOrUpdate)">完成</el-button>
          </el-form-item>
        </el-form>

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

export default {
  name: 'MaterialSameGroup',
  data() {
    return {
      rules: {
        materialName: [
          {required: true, message: '请输入物料', trigger: 'blur'}
        ],
        addNum: [
          {required: true, message: '请输入新报数量', trigger: 'blur'}
        ],
        comment: [
          {required: true, message: '请输入备注', trigger: 'blur'}
        ]

      },

      materialSearchDatas: [], // 用于搜索的建议框

      prepareCheckVal:[],

      dialogCalNumVisible:false,
      calNumResult:[],
      activeNames: ['0'],
      // 导入
      fileList: [],
      fileSizeIsSatisfy: false,
      dialogImportVisible:false,
      tableData2: [],
      tableData3: [],

      // 多个搜索输入框
      manySearchArr:[{
        selectField:'materialName',
        searchStr:'',
      }],

      tableLoad:true,
      statusArr : [{'name':'暂存','val':1},{'name':'审核中','val':2},{'name':'已审核','val':0},{'name':'重新审核','val':3}],
      checkedBox:[1,2,3,0],

      status2Arr : [{'name':'备料未完成','val':1},{'name':'备料完成','val':0}],
      checkedBox2:[1,0],

      // 搜索字段
      selectedName: 'materialName',// 搜索默认值
      options: [
        {value: 'materialName', label: '物料名称'}
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
      // 表单字段
      addOrUpdate: 'save',
      editForm: {
        id: '',
        details:[{}]
      },

      theCurrentPrepareOrderId:'',
      theCurrentOrderMsg:{id:'',orderNum:'',customerNum:'',productNum:'',productBrand:'',productColor:'',productRegion:''},
      prepareList:[{preparedNum:'',addNum:''}],
      dialogVisible: false,
      tableData: [],
      spanArr: [],
      multipleSelection: [] ,// 多选框数组

    }
  },

  methods: {
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
    objectSpanMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      else if (columnIndex === 3) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }

    },
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

    searchSelect(item) {
      this.searchStr = item.name
    },
    loadMaterialValideAll() {
      request.post('/baseData/material/getSearchAllData').then(res => {
        this.materialSearchDatas = res.data.data
      })
    },
    searchMmaterialFocus(seq) {
      console.log("物料搜索框聚焦",seq)
      this.loadMaterialValideAll()
      if(this.editForm.details.length === seq){
        let obj = {};
        obj.materialName = "";
        obj.materialId = "";

        this.editForm.details.push(obj);
      }

    },
    moveMaterialMouse(selectItem, rowObj,index) {
      try {
        // foreach 只能抛出异常结束
        this.materialSearchDatas.forEach(item => {
          if (selectItem === item.name) {
            rowObj.materialId = item.id
            rowObj.materialName = item.name
            throw new Error();
          } else {
            rowObj.materialId = ''
            rowObj.materialName = ''
          }
        })
      } catch (err) {
      }
    },
    handleSelect2(selectItem, param) {
      param.materialId = selectItem.id;
      param.materialName = selectItem.name
    },

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
    //进度条方法
    format(percentage) {
      return percentage === 100 ? '满' : `${percentage}%`;
    },

    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
    },

    prepare(scopeRow){
      console.info("prepare row:",scopeRow)
      this.theCurrentOrderMsg=scopeRow

      request.get('/order/productOrder/listOrderConstituentProgress?orderId='
          +scopeRow.id
      ).then(res => {

        let data = res.data.data;
        this.prepareList = data;
        this.dialogCalNumVisible = true;
      })
    },

    // 关闭弹窗处理动作
    handleImportClose(done) {
      this.$refs['editImportForm'].resetFields();
      this.tableData2 = []
      this.fileList=[]
      this.fileSizeIsSatisfy=false;
      this.$refs.upload.clearFiles();
      console.log("关闭窗口")
      done();
    },

    // 导入
    expChangeImport(item) {
      if (item === 'import') {
        this.dialogImportVisible = true;
      } else if(item === 'importDemo'){
        this.downImportDemo();
      }
    },

    rowClass({ row, rowIndex }) {
      if (this.multipleSelection.includes(row.id)) {
        return { "background-color": "rgba(255,235,205, 0.75)" };
      }
    },
    statusPassBatch(){
      let ids = this.multipleSelection;
      request.post('/order/productOrder/statusPassBatch',ids).then(res => {
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
        this.addComplementPrepare();
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
    addComplementPrepare() {
      this.addOrUpdate = 'save'
      this.editForm = {
        id: '',
        name:'',
        details:[{}]
      }
      this.dialogCalNumVisible = true
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
          const load = this.$loading({
            lock: true,
            text: '处理中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          for (let i = 0; i < this.editForm.details.length; i++) {
            if(this.editForm.details[i].materialId===''){
              this.editForm.details.splice(i);
              i--;
            }
          }

          request.post('/baseData/materialSameGroup/save', this.editForm).then(res => {
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
            this.getList()
            this.dialogCalNumVisible=false;
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

      let url = '/baseData/materialSameGroup/list?currentPage='+this.currentPage+
          "&&pageSize="+this.pageSize+
          "&&searchField="+this.select
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
      request.get('/baseData/materialSameGroup/queryById?id=' + id).then(res => {
        let result = res.data.data
        this.dialogCalNumVisible = true
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
      request.post('/baseData/materialSameGroup/del', ids).then(res => {
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
      request.get('/order/productOrder/statusSubReturn?id=' + id).then(res => {
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
      request.get('/order/productOrder/statusSubmit?id=' + id).then(res => {
        this.$message({
          message: '已提交!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 状态待审核
    statusPass(id) {
      request.post('/baseData/materialSameGroup/complementValid?id=' + id).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 状态反审核
    statusReturn(id) {
      request.post('/baseData/materialSameGroup/complementReValid?id=' + id).then(res => {
        this.$message({
          message: '反审核完成!',
          type: 'success'
        });
        this.getList()
      })
    },
    handleClosePrepare(done) {
      this.dialogCalNumVisible=false;
      this.getList()
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
      this.$refs['editForm'].resetFields();
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

  },
  created() {
    this.getList()

  }

}

</script>

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