<template>

  <el-container>
    <el-main class="elMain_my">
      <!-- 入库单列表 -->
      <el-form :inline="true" class="demo-form-inline elForm_my" >
        <el-form-item>
          <el-select size="mini" v-model="select" filterable @change="searchFieldChange" placeholder="请选择搜索字段">
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
          <el-input size="mini"
                    placeholder="请输入搜索内容"
                    v-model="searchStr"
                    clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" icon="el-icon-search" @click="search()" type="success">搜索</el-button>
        </el-form-item>

        <el-form-item v-if="hasAuth('order:productPricePre:save')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('order:productPricePre:save')"
                     @click="add()"
          >添加
          </el-button>
        </el-form-item>


        <el-form-item v-if="hasAuth('order:productPricePre:save')">
          <el-button size="mini" icon="el-icon-s-order" type="success" v-if="hasAuth('order:productPricePre:save')"
                     @click="getSpreadDemo()"
          >设置模板
          </el-button>
        </el-form-item>
      </el-form>

      <el-table

          ref="multipleTable"
          :data="tableData"
          border
          fit
          height="520px"
          size="mini"
          tooltip-effect="dark"
          style="width: 100%;color:black"
          :cell-style="{padding:'0'}"
          :default-sort="{prop:'id',order:'descending'}"
      >

        <el-table-column
            label="编号"
            prop="id"
            width="50px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            label="本厂货号"
            prop="companyNum"
            width="70px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            prop="customer"
            label="客户公司"
            show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="price"
            label="报价价格"
            >
        </el-table-column>


        <el-table-column
            prop="priceLastUpdateDate"
            label="报价最后修改时间"
            width="150px"
        >
        </el-table-column>

        <el-table-column
            prop="priceLastUpdateUser"
            label="报价最后修改人"
            width="110px"
        >
        </el-table-column>

        <el-table-column
            prop="realPrice"
            label="实际价格"
        >
        </el-table-column>

        <el-table-column
            prop="realPriceLastUpdateDate"
            width="150px"
            label="实价最后修改时间"
        >
        </el-table-column>

        <el-table-column
            prop="realPriceLastUpdateUser"
            label="实价最后修改人"
            width="110px"
        >
        </el-table-column>

        <el-table-column
            prop="status"
            label="状态"
            width="100px"
        >
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status === 0" type="success">已最终确认</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===1" type="danger">未报价完成</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===2" type="danger">报价完成</el-tag>

          </template>
        </el-table-column>

        <el-table-column
            prop="action"
            label="操作"
            width="270px"
            fixed="right"
        >
          <template slot-scope="scope">

            <el-button type="text" size="small" @click="edit(scope.row.id)"
                       v-if="hasAuth('order:productPricePre:list') && scope.row.status != 1   ">查看报价
            </el-button>
            <el-button type="text" size="small" @click="realEdit(scope.row.id)"
                       v-if="hasAuth('order:productPricePre:list') && scope.row.status === 0   ">查看实价
            </el-button>

            <el-button type="text" size="small" @click="edit(scope.row.id)"
                       v-if="hasAuth('order:productPricePre:update') && scope.row.status === 1   ">编辑报价
            </el-button>
            <el-button type="text" size="small" @click="realEdit(scope.row.id)"
                       v-if="hasAuth('order:productPricePre:real') && scope.row.status === 2  ">编辑实价
            </el-button>

<!--
            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('order:productPricePre:down')    ">
              <template>
                <el-popconfirm @confirm="down(scope.row.id,scope.row.uploadName)"
                               title="确定下载吗？"
                >
                  <el-button type="text" size="small" slot="reference">下载文件</el-button>
                </el-popconfirm>
              </template>
            </el-button>
-->

            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('order:productPricePre:valid')   && scope.row.status ===1   ">
              <template>
                <el-popconfirm @confirm="valid(scope.row.id)"
                               title="确定审核完成吗？"
                >
                  <el-button type="text" size="small" slot="reference">确认报价</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('order:productPricePre:returnValid')   && scope.row.status ===2   ">
              <template>
                <el-popconfirm @confirm="returnValid(scope.row.id)"
                               title="确定反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">报价反审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('order:productPricePre:realValid')   && scope.row.status ===2   ">
              <template>
                <el-popconfirm @confirm="realValid(scope.row.id)"
                               title="确定审核完成吗？"
                >
                  <el-button type="text" size="small" slot="reference">确认实价</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('order:productPricePre:returnRealValid')   && scope.row.status ===0   ">
              <template>
                <el-popconfirm @confirm="returnRealValid(scope.row.id)"
                               title="确定反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">实价反审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('order:productPricePre:del') && scope.row.status ===1   ">
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

      <!-- 编辑页面 -->
<!--      <el-dialog
          title="成本核算信息"
          :visible.sync="dialogVisible2"
          :before-close="handleClose2"
          fullscreen

      >
        <el-form style="width: 100%;align-items: center;margin-top: -30px"
                 size="mini"
                 label-width="100px"
                 inline
                 :model="editForm2" :rules="rules" ref="editForm2"
                 class="demo-editForm">


          <el-form-item label="本厂货号" prop="companyNum">
            <el-input size="mini" clearable style="width: 200px" v-model="editForm2.companyNum">
            </el-input>
          </el-form-item>

          <el-form-item label="客户公司" prop="customer">
            <el-input size="mini" clearable style="width: 200px" v-model="editForm2.customer">
            </el-input>
          </el-form-item>


          <el-form-item label="报价价格" prop="price">
            <el-input size="mini" clearable style="width: 200px" v-model="editForm2.price">
            </el-input>
          </el-form-item>


          <el-form-item>
            <el-button type="primary" v-show="editForm2.status===1" @click="submitForm('editForm2',addOrUpdate)">
              保存核算
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-input size="mini" v-show="false" v-model="editForm2.excelJson">
            </el-input>
          </el-form-item>

        </el-form>
        <div style="width: 100%">
          &lt;!&ndash; SpreadJS 组件 &ndash;&gt;
          <gc-spread-sheets
              :hostClass="hostClass"
              @workbookInitialized="initWorkbook2"
          >
          </gc-spread-sheets>
        </div>
      </el-dialog>-->


      <!-- 设置模板 -->
<!--
      <el-dialog
          title="成本核算信息EXCEL模板设置"
          :visible.sync="dialogSpreadDemoVisible"
          fullscreen
      >
        <el-form style="width: 100%;align-items: center;margin-top: -30px"
                 size="mini"
                 label-width="100px"
                 inline
                 :model="editDemoForm"  ref="editDemoForm"
                 class="demo-editForm">

          <el-form-item>
            <el-button  type="primary" @click="setDemoForm()">
              完成设置
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-input size="mini" v-show="false" v-model="editDemoForm.demoJson">
            </el-input>
          </el-form-item>

        </el-form>

        &lt;!&ndash; SpreadJS 组件 &ndash;&gt;
        <gc-spread-sheets
            :hostClass="hostClass"
            @workbookInitialized="initWorkbookDemo"
        >
        </gc-spread-sheets>

      </el-dialog>
-->


      <!-- 实际报价模板 -->
<!--      <el-dialog
          title="成本核算信息实际报价"
          :visible.sync="dialogVisibleReal"
          fullscreen
      >
        <el-form style="width: 100%;align-items: center;margin-top: -30px"
                 size="mini"
                 label-width="100px"
                 inline
                 :model="editRealForm"  ref="editRealForm"
                 class="demo-editForm">


          <el-form-item label="实际价格" prop="realPrice">
            <el-input size="mini" clearable style="width: 200px" v-model="editRealForm.realPrice">
            </el-input>
          </el-form-item>

          <el-form-item >
            <el-button  v-if="hasAuth('order:productPricePre:real') && editRealForm.status === 2  " type="primary" @click="setRealForm()">
              完成设置
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-input size="mini" v-show="false" v-model="editRealForm.realJson">
            </el-input>
          </el-form-item>

        </el-form>


      </el-dialog>-->

      <!-- 成本核算弹窗 -->
<!--      <el-dialog
          title="成本核算信息"
          :visible.sync="dialogVisible"
          :before-close="handleClose"
          fullscreen
      >
        <el-form style="width: 100%;align-items: center;margin-bottom: -20px;margin-top: -30px;"
                 size="mini"
                 label-width="100px"
                 :model="editForm" :rules="rules" ref="editForm"
                 class="demo-editForm">


          <el-form-item label="本厂货号" prop="companyNum">
            <el-input size="mini" clearable style="width: 200px" v-model="editForm.companyNum">
            </el-input>
          </el-form-item>

          <el-form-item label="客户公司" prop="customer">
            <el-input size="mini" clearable style="width: 200px" v-model="editForm.customer">
            </el-input>
          </el-form-item>


          <el-form-item label="报价价格" prop="price">
            <el-input size="mini" clearable style="width: 200px" v-model="editForm.price">
            </el-input>
          </el-form-item>

          <el-form-item label="上传文件:">
            <el-upload
                class="upload-demo"
                ref="upload"
                drag
                :with-credentials="true"
                :limit="1"
                :file-list="fileList"
                :http-request="uploadRequest"
                :action="uploadUrl"
                :on-change="addFile"
                :auto-upload="false"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传一个，且不超过5M</div>
            </el-upload>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" v-show="editForm.status===1" @click="submitForm('editForm',addOrUpdate)">
              保存单据
            </el-button>
          </el-form-item>

        </el-form>
      </el-dialog>-->

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

// POI，因为响应输出字节流，和ajax 的请求不一样。
import {request} from "@/axios";

import {request2} from "@/axios";
// 导入SpreadJS

export default {
  name: 'ProductPricePre',
  data() {
    return {
      fileSizeIsSatisfy: false,
      fileList: [],

      // 搜索字段
      selectedName: 'companyNum',// 搜索默认值
      options: [
        {value: 'companyNum', label: '本厂货号'},
        {value: 'customer', label: '客户公司'}
      ],
      select: 'companyNum', // 搜索默认值
      searchStr: '',
      searchField: '',

      // 分页字段
      currentPage: 1 // 当前页
      , pageSize: 100 // 一页多少条
      , total: 0 // 总共多少数据
      ,
      addOrUpdate: 'save',
      tableData: [],

    }
  },
  methods: {
    uploadRequest(fileobj) {
      let param = new FormData()
      param.append('files', fileobj.file)

      request({
        method: 'post',
        url: '/order/productPricePre/upload?customer=' + this.editForm.customer + "&&companyNum=" + this.editForm.companyNum + "&&price=" + this.editForm.price,
        headers: {'Content-Type': 'multipart/form-data'},
        data: param
      }).then(res => {
        this.$message({
          message: (this.editForm.id ? '编辑' : '新增') + '成功!',
          type: 'success'
        });
        // 关闭弹窗并且重置内容
        this.dialogVisible = false;
        this.fileSizeIsSatisfy=false;
        this.fileList=[]
        this.resetForm("editForm")
        this.getList()

      })
    },

// 文件上传功能
    uploadUrl: function () {
      return "#";
    }
    ,
// 判断文件大小
    addFile(file, fileList) {
      this.fileList = fileList;
      //限制上传文件为5M
      console.log("文件大小", file.size)
      this.fileSizeIsSatisfy = file.size < 5 * 1024 * 1024 ? true : false;
      return this.fileSizeIsSatisfy
    },


    // 编辑页面
    realEdit(id) {
      this.$store.commit("SET_PRODUCTPRICEDATA", {select:this.select,searchStr:this.searchStr})

      this.addOrUpdate = "update"
      this.$router.push({name:'LKProductPrice_real',params:{id:id}});
     /* this.dialogVisibleReal = true

      await request.get('/order/productPricePre/queryRealById?id=' + id).then(res => {
        let result = res.data.data
        this.editRealForm = result
        // 显示EXCEL 数据
        this.fromJson(this.spreadReal,result.realJson)
      })*/
    },
    // 编辑页面
    edit(id) {
      this.$store.commit("SET_PRODUCTPRICEDATA", {select:this.select,searchStr:this.searchStr})

      this.addOrUpdate = "update"
      this.$router.push({name:'LKProductPrice',params:{id:id,addOrUpdate:this.addOrUpdate}});
      /*this.dialogVisible2 = true

      this.addOrUpdate = "update"
      await request.get('/order/productPricePre/queryById?id=' + id).then(res => {
        let result = res.data.data
        this.editForm2 = result
        // 显示EXCEL 数据

        console.log("该数据:",result.excelJson)
        this.fromJson(this.spread,result.excelJson)
      })*/
    },
    // 点击添加按钮
    add() {
      this.$store.commit("SET_PRODUCTPRICEDATA", {select:this.select,searchStr:this.searchStr})

      this.addOrUpdate = "save"
      this.$router.push({name:'LKProductPrice',params:{addOrUpdate:this.addOrUpdate}});
      /*this.addOrUpdate = 'save'
      this.editForm2 = {
        status: 1,
        companyNum: '',
        customer: '',
        file: ''
      }
      request.get('/order/productPricePre/getStreadDemo').then(res => {
        let result = res.data.data;
        if(result != null){
          console.log("setDemo:",result)
          this.fromJson(this.spread,result.demoJson)
        }
      })

      this.dialogVisible2 = true*/
    },
    // 点击设置模板按钮
      getSpreadDemo() {
        this.$store.commit("SET_PRODUCTPRICEDATA", {select:this.select,searchStr:this.searchStr})

        this.$router.push({name:'LKProductPrice_demo'});
        // this.dialogSpreadDemoVisible = true
    },
    // 点击设置模板按钮
    /*setDemoForm() {
      this.editDemoForm.demoJson = this.toJson(this.spreadDemo)
      request.post('/order/productPricePre/setStreadDemo',this.editDemoForm).then(res => {
        this.$message({
          message:  '设置模板成功!',
          type: 'success'
        });

        // 关闭弹窗并且重置内容
        this.dialogSpreadDemoVisible = false;
        this.resetForm("editDemoForm")
        this.getList()
      })
    },*/
    // 保存实际报价
  /*  setRealForm() {
      this.editRealForm.realJson = this.toJson(this.spreadReal)
      request.post('/order/productPricePre/setStreadReal',this.editRealForm).then(res => {
        this.$message({
          message:  '保存实际报价成功!',
          type: 'success'
        });

        // 关闭弹窗并且重置内容
        this.dialogVisibleReal = false;
        this.resetForm("editRealForm")
        this.getList()
      })
    },
    // 重新设置模板内容
    async setDemo(spread){
      await request.get('/order/productPricePre/getStreadDemo').then(res => {
        let result = res.data.data;
        if(result != null){
          console.log("setDemo:",result)
          this.fromJson(spread,result.demoJson)
        }
      })
    }*/
  /*  // 点击添加按钮
    add() {
      this.addOrUpdate = 'save'
      this.editForm = {
        status: 1,
        companyNum: '',
        customer: '',
        file: ''
      }
      this.dialogVisible = true
    }*/

// 分页方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getList()

    }
    ,
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getList()

    },
    // 文件上传
    uploadFile(formName, methodName) {

        this.$refs[formName].validate((valid) => {

          if (valid) {
            if (this.fileList.length <= 0) {
              this.$message.error("请至少上传一个文件！");
              return;
            }
            if (!this.fileSizeIsSatisfy) {
              this.$message.error("上传失败！存在文件大小超过5M！");
              return;
            }
            this.$refs.upload.submit();
          }
        })
    }
    ,

    search(){
      this.currentPage = 1
      this.getList()
    },

    // 查询价目表单列表数据
    getList() {
      console.log("搜索字段:", this.select)
      request.get('/order/productPricePre/list', {
        params: {
          currentPage: this.currentPage
          , pageSize: this.pageSize
          , total: this.total
          , searchStr: this.searchStr
          , searchStartDate: this.searchStartDate
          , searchEndDate: this.searchEndDate
          , searchField: this.select
        }
      }).then(res => {
        this.tableData = res.data.data.records
        this.total = res.data.data.total
        console.log("获取用户表单数据", res.data.data.records)
        this.$nextTick(() => {
          this.$refs['multipleTable'].doLayout();
        })
      })
    }

    ,
//  服务端写出字节流到浏览器，进行保存
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
    // 审核
    realValid(id) {
      request.post('/order/productPricePre/realValid', id).then(res => {
        this.$message({
          message: '最终审核成功!',
          type: 'success'
        });

        this.getList()
        console.log("审核后重新加载页面")
      })
    },
    // 审核
    valid(id) {
      request.post('/order/productPricePre/valid', id).then(res => {
        this.$message({
          message: '审核成功!',
          type: 'success'
        });

        this.getList()
        console.log("审核后重新加载页面")
      })
    },
    // 反审核
    returnRealValid(id) {
      request.post('/order/productPricePre/returnRealValid', id).then(res => {
        this.$message({
          message: '反审核成功!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 反审核
    returnValid(id) {
      request.post('/order/productPricePre/returnValid', id).then(res => {
        this.$message({
          message: '反审核成功!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 下载
    down(id,name) {

      request2.post('/order/productPricePre/down?id='+id
          ,null,{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
        this.saveFile(blob,name)
      }).catch()
    },

    // 删除
    del(id) {
      request.post('/order/productPricePre/del', id).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getList()
        console.log("删除后重新加载页面")

      })
    }
    ,
    // 关闭弹窗处理动作
    handleClose2(done) {
      this.$refs['editForm2'].resetFields();
      console.log("关闭窗口")
      done();
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
    ,
    searchFieldChange(item) {
      console.log("搜索字段改变:", item)
      if (item === 'companyNum') {
        this.selectedName = item
      } else {
        this.selectedName = item

      }
    }
    ,
  },
  created() {
    console.log("select:",    this.$store.state.producePriceData.select)
    if(this.$store.state.producePriceData.select != undefined){
      this.select = this.$store.state.producePriceData.select;
    }
    if(this.$store.state.producePriceData.searchStr != undefined){
      this.searchStr = this.$store.state.producePriceData.searchStr;
    }
    console.log("searchStr:",    this.$store.state.producePriceData.searchStr)
    this.getList()
  },
  /*activated(){
    console.log("激活。。")
    let main = this
    //根据key名获取传递回来的参数，data就是map
    productPriceEB.$on('searchType', function(data){
      //赋值给首页的附近医院数据模型
      console.log("激活。。select:data:",data)
      main.select = data;
    }.bind(this));

    //根据key名获取传递回来的参数，data就是map
    productPriceEB.$on('searchStr', function(data){
      //赋值给首页的附近医院数据模型
      console.log("激活。。searchStr:data:",data)
      main.searchStr = data;
    }.bind(this));

  }*/

}

</script>

<style scoped>
.spread-host {
  width: 100%;
  height: 600px;
}

.el-pagination {
  float: right;

}

.el-table--mini td {
  padding: 0 0;
}
.el-dialog__body{
  padding: 0 0;
}

</style>