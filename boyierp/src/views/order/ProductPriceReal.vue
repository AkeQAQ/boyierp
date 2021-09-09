<template>

  <el-container>
    <el-main>
      <!-- 成本核算列表 -->
      <el-form :inline="true" class="demo-form-inline">
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
          <el-button size="mini" icon="el-icon-search" @click="getList">搜索</el-button>
        </el-form-item>


        <el-form-item v-if="hasAuth('order:productPriceReal:save')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('order:productPriceReal:save')"
                     @click="add()"
          >新增
          </el-button>
        </el-form-item>

      </el-form>

      <el-table

          ref="multipleTable"
          :data="tableData"
          border
          fit
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
            label="成本报价编号"
            prop="preId"
            width="100px"
            show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
            label="本厂货号"
            prop="companyNum"
            width="110px"
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
            label="实际价格"
            >
        </el-table-column>

        <el-table-column
            prop="uploadName"
            label="文件名称"
        >
        </el-table-column>

        <el-table-column
            prop="status"
            label="状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status === 0" type="success">已确认</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===1" type="danger">未确认</el-tag>
          </template>
        </el-table-column>

        <el-table-column
            prop="action"
            label="操作"
            width="200px"
            fixed="right"
        >
          <template slot-scope="scope">

            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('order:productPriceReal:down')    ">
              <template>
                <el-popconfirm @confirm="down(scope.row.id,scope.row.uploadName)"
                               title="确定下载吗？"
                >
                  <el-button type="text" size="small" slot="reference">下载文件</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('order:productPriceReal:valid')   && scope.row.status ===1   ">
              <template>
                <el-popconfirm @confirm="valid(scope.row.id)"
                               title="确定审核完成吗？"
                >
                  <el-button type="text" size="small" slot="reference">确认审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>


            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('order:productPriceReal:returnValid')   && scope.row.status ===0   ">
              <template>
                <el-popconfirm @confirm="returnValid(scope.row.id)"
                               title="确定反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">反审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0px" type="text"
                       v-if="hasAuth('order:productPriceReal:del') && scope.row.status ===1   ">
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
      <!-- 成本核算弹窗 -->
      <el-dialog
          title="成本核算信息"
          :visible.sync="dialogVisible"
          :before-close="handleClose"
          width="600px"
      >
        <el-form style="width: 100%;align-items: center"
                 size="mini"
                 label-width="110px"
                 :model="editForm" :rules="rules" ref="editForm"
                 class="demo-editForm">



          <el-form-item label="成本报价编号" prop="preId">
            <el-input size="mini" clearable style="width: 200px" v-model="editForm.preId">
            </el-input>
          </el-form-item>

          <el-form-item label="实际价格" prop="price">
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

// POI，因为响应输出字节流，和ajax 的请求不一样。
import {request} from "@/axios";

import {request2} from "@/axios";

export default {
  name: 'ProductPriceReal',
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
      pushForm: {
        orderDetailIds: [],
        supplierDocumentNum: '',
        buyInDate: '',
      },
      editForm: {
        preId:'',
        status: 1, // 编辑表单初始默认值
        id: '',
        companyNum: '',
        customer: '',
        price: ''
      },
      rules: {
        preId: [
          {required: true, message: '请输入新产品成本核算报价的编号', change: 'blur'}
        ],
        companyNum: [
          {required: true, message: '请输入本厂货号', change: 'blur'}
        ],
        customer: [
          {required: true, message: '请输入客户公司', trigger: 'blur'}
        ]
      },
      pushRules: {
        buyInDate: [
          {required: true, message: '请输入入库日期', change: 'blur'}
        ],
        supplierDocumentNum: [
          {required: true, message: '请输入本厂货号单据号', trigger: 'blur'}
        ]
      },
      dialogVisible: false,
      tableData: [],

    }
  },
  methods: {
    uploadRequest(fileobj) {
      let param = new FormData()
      param.append('files', fileobj.file)

      request({
        method: 'post',
        url: '/order/productPriceReal/upload?customer=' + this.editForm.customer + "&&companyNum=" + this.editForm.companyNum + "&&price=" + this.editForm.price
        +"&&preId="+this.editForm.preId,
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
    }
    ,
// 点击添加按钮
    add() {
      this.addOrUpdate = 'save'
      this.editForm = {
        status: 1,
        companyNum: '',
        customer: '',
        file: ''
      }
      this.dialogVisible = true
    }
    ,

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

    }
    ,
// 下推入库提交
    submitPushForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {


          request.post('/order/productPriceReal/push?orderDetailIds=' + this.pushForm.orderDetailIds, this.pushForm).then(res => {
            this.$message({
              message: '下推成功!',
              type: 'success'
            });

            // 关闭弹窗并且重置内容
            this.pushDialogVisible = false;
            this.resetForm("pushForm")
            this.getList()
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
    ,
// 表单提交
    submitForm(formName, methodName) {
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

    // 查询价目表单列表数据
    getList() {
      console.log("搜索字段:", this.select)
      request.get('/order/productPriceReal/list', {
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
      })
    }
    ,

    pushPage() {
      if (this.multipleSelection === [] || this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择下推的选项!',
          type: 'error'
        });
        return
      }

      this.pushDialogVisible = true
      this.pushForm.orderDetailIds = this.multipleSelection
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
    valid(id) {
      request.post('/order/productPriceReal/valid', id).then(res => {
        this.$message({
          message: '审核成功!',
          type: 'success'
        });
        this.getList()
        console.log("审核后重新加载页面")
      })
    },
    // 反审核
    returnValid(id) {
      request.post('/order/productPriceReal/returnValid', id).then(res => {
        this.$message({
          message: '反审核成功!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 下载
    down(id,name) {

      request2.post('/order/productPriceReal/down?id='+id
          ,null,{responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
        this.saveFile(blob,name)
      }).catch()
    },
    // 删除
    del(id) {
      request.post('/order/productPriceReal/del', id).then(res => {
        this.$message({
          message: '删除成功!',
          type: 'success'
        });
        this.getList()
        console.log("删除后重新加载页面")

      })
    }
    ,
    /*// 状态待审核
    statusPass(id) {
      request.get('/order/productPriceReal/statusPass?id=' + id).then(res => {
        this.$message({
          message: '审核通过!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 状态反审核
    statusReturn(id) {
      request.get('/order/productPriceReal/statusReturn?id=' + id).then(res => {
        this.$message({
          message: '反审核完成!',
          type: 'success'
        });
        this.getList()
      })
    },*/
    // 关闭弹窗处理动作
    handleClose(done) {
      this.$refs['editForm'].resetFields();
      console.log("关闭窗口")
      done();
    }
    ,
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
    this.getList()
  }

}

</script>

<style scoped>


.el-pagination {
  float: right;

}

.el-table--mini td {
  padding: 0 0;
}

</style>