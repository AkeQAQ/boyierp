

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

        <el-form-item v-if="hasAuth('produce:craft:save')">
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="hasAuth('produce:craft:save')"
                     @click="add()"
          >添加
          </el-button>
        </el-form-item>


        <el-form-item v-if="hasAuth('produce:craft:real')">
          <el-button size="mini" icon="el-icon-s-order" type="success" v-if="hasAuth('produce:craft:real')"
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
            prop="devLastUpdateDate"
            label="开发最后修改时间"
            width="150px"
        >
        </el-table-column>

        <el-table-column
            prop="devLastUpdateUser"
            label="开发最后修改人"
            width="110px"
        >
        </el-table-column>

        <el-table-column
            prop="lastUpdateDate"
            label="最终修改时间"
            width="150px"
        >
        </el-table-column>

        <el-table-column
            prop="lastUpdateUser"
            label="最终修改人"
            width="110px"
        >
        </el-table-column>

        <el-table-column
            prop="status"
            label="状态"
            width="120px"
        >
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status === 0" type="success">已最终确认</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===1" type="danger">开发未填写完成</el-tag>
            <el-tag size="small" v-else-if="scope.row.status===2" type="danger">开发填写完成</el-tag>

          </template>
        </el-table-column>

        <el-table-column
            prop="action"
            label="操作"
            width="350px"
            fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showPicture(scope.row.id)"
                       v-if="hasAuth('produce:craft:list')  ">查看确认样图片
            </el-button>


            <el-button type="text" size="small" @click="edit(scope.row.id)"
                       v-if="hasAuth('produce:craft:list') && scope.row.status != 1   ">查看开发内容
            </el-button>
            <el-button type="text" size="small" @click="realEdit(scope.row.id)"
                       v-if="hasAuth('produce:craft:list') && scope.row.status === 0   ">查看确认内容
            </el-button>

            <el-button type="text" size="small" @click="edit(scope.row.id)"
                       v-if="hasAuth('produce:craft:update') && scope.row.status === 1    ">开发编辑
            </el-button>
            <el-button type="text" size="small" @click="realEdit(scope.row.id)"
                       v-if="hasAuth('produce:craft:real') && scope.row.status === 2  ">确认编辑
            </el-button>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('produce:craft:valid')   && scope.row.status ===1   ">
              <template>
                <el-popconfirm @confirm="valid(scope.row.id)"
                               title="确定审核完成吗？"
                >
                  <el-button type="text" size="small" slot="reference">开发审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('produce:craft:returnValid')   && scope.row.status ===2   ">
              <template>
                <el-popconfirm @confirm="returnValid(scope.row.id)"
                               title="确定反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">开发反审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('produce:craft:realValid')   && scope.row.status ===2   ">
              <template>
                <el-popconfirm @confirm="realValid(scope.row.id)"
                               title="确定审核完成吗？"
                >
                  <el-button type="text" size="small" slot="reference">确认审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('produce:craft:returnRealValid')   && scope.row.status ===0   ">
              <template>
                <el-popconfirm @confirm="returnRealValid(scope.row.id)"
                               title="确定反审核吗？"
                >
                  <el-button type="text" size="small" slot="reference">确认反审核</el-button>
                </el-popconfirm>
              </template>
            </el-button>

            <el-button style="padding: 0" type="text"
                       v-if="hasAuth('produce:craft:del') && scope.row.status ===1   ">
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

      <el-dialog
          title="确认样信息"
          :visible.sync="dialogImportVisible"
          :before-close="handleImportClose"
          :append-to-body="true"

          fullscreen
      >
        <el-form style="width: 100%;margin-bottom: -20px;margin-top: -30px;align-items: center"
                 :inline="false"
                 size="mini"
                 label-width="100px"
                 :model="editImportForm"  ref="editImportForm"
                 class="demo-editForm myFormClass">

          <el-form-item label="工艺单编号" prop="id" style="margin-bottom: 20px;width: 300px">
            <el-input class="elInput_my" :disabled=true placeholder="" v-model="editImportForm.id">
            </el-input>
<!--            <el-button type="primary"  @click="importExcel('editImportForm')">
              保存
            </el-button>-->
          </el-form-item>

          <el-form-item label="上传文件:">
            <!--          <el-upload
                          class="upload-demo"
                          action="/produce/craft/uploadPic"
                          :on-preview="handlePreview"
                          :on-remove="handleRemove"
                          :file-list="fileList"
                          list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                      </el-upload>-->

            <!-- 新的缩略图-->
            <el-upload
                :disabled="!hasAuth('produce:craft:save')"
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
                      v-if="hasAuth('produce:craft:del') "
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


        </el-form>




      </el-dialog>
    </el-main>



  </el-container>

</template>

<script>

// POI，因为响应输出字节流，和ajax 的请求不一样。
import  {request} from "@/axios";
import {sysbaseUrl} from "@/axios";
import {request2} from "@/axios";

// 导入SpreadJS
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css";
import * as GC from "@grapecity/spread-sheets";
import "@grapecity/spread-sheets-vue";
import Vue from "vue";

export default {
  name: 'Craft',
  data() {
    return {
      disabled:false,

      fileList: [{name: 'food.jpeg', url: 'http://localhost:8080/1_1.png'}],
      dialogOnePicVisible:false,
      dialogOneImageUrl:'',

      dialogImportVisible: false,
      editImportForm: {
        id: ''
      },

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
      , pageSize: 200 // 一页多少条
      , total: 0 // 总共多少数据
      ,
      addOrUpdate: 'save',
      tableData: [],

    }
  },
  methods: {
    /*importExcel(formName) {
      this.$refs[formName].validate((valid) => {
        console.log("valid",valid)
        console.log("this.fileList",this.fileList)
        console.log("this.fileSizeIsSatisfy",this.fileSizeIsSatisfy)

       /!* if(this.fileList.length <= 0 || this.fileList.length > 1){
          this.$message.error("请上传一个文件！");
          return;
        }
        if (!this.fileSizeIsSatisfy) {
          this.$message.error("上传失败！存在文件大小超过5M！");
          return;
        }*!/
        if (valid) {
          this.$refs.upload.submit();
        }
        this.$refs['editImportForm'].resetFields();
        this.fileList=[]
        this.fileSizeIsSatisfy=false;
        this.$refs.upload.clearFiles();
        this.dialogImportVisible=false
      })
    }*/
    // 图片放大预览。
    handlePictureCardPreview(file) {
      console.log("文件:",file)
      this.dialogOneImageUrl = file.url;
      this.dialogOnePicVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    // 图片删除
    handleRemove(file, fileList) {
      console.log("删除图片:",file)
      const url = file.url
      const i = this.fileList.findIndex(x => x.url === url)
      this.fileList.splice(i, 1)

      request({
        method: 'get',
        url: '/produce/craft/delPic?fileName='+file.name,
        headers: {'Content-Type': 'multipart/form-data'}
      }).then(res => {
          // 成功
          this.$message({
            message: '删除成功!',
            type: 'success'
          });

      })
    },

    // 图片查询
    showPicture(id){
      this.fileList=[]
      request.get('/produce/craft/getPicturesById?id='+id).then(res => {
        let data = res.data.data;
        for (let i = 0; i < data.length; i++) {
          let oneFileName = data[i];
          this.fileList.push({name:oneFileName,url: sysbaseUrl+"/"+oneFileName})
        }
        this.editImportForm.id = id;

        this.dialogImportVisible=true
      })

    },

    // 图片新增
    uploadRequest(fileobj) {
      let param = new FormData()
      param.append('files', fileobj.file)
      console.log("上传的文件对象:",fileobj)
      request({
        method: 'post',
        url: '/produce/craft/uploadPic?id='+this.editImportForm.id,
        headers: {'Content-Type': 'multipart/form-data'},
        data: param
      }).then(res => {
          // 成功
          this.$message({
            message: '添加成功!',
            type: 'success'
          });

            this.$nextTick(() => {
              request.get('/produce/craft/getPicturesById?id='+this.editImportForm.id).then(res => {
                let data = res.data.data;
                this.fileList.push({name:data[data.length-1],url: sysbaseUrl+"/"+data[data.length-1]})
              })
            })


      })
    },
    // 关闭弹窗处理动作
    handleImportClose(done) {
      this.$refs['editImportForm'].resetFields();
      this.fileList=[]
      this.fileSizeIsSatisfy=false;
      this.$refs.upload.clearFiles();
      console.log("关闭窗口")
      done();
    },


    // 最终编辑页面
    realEdit(id) {
      this.$store.commit("SET_CRAFTDATA", {select:this.select,searchStr:this.searchStr})

      this.addOrUpdate = "update"
      this.$router.push({name:'LKCraft_real',params:{id:id}});
    },
    // 编辑页面
     edit(id) {
       this.$store.commit("SET_CRAFTDATA", {select:this.select,searchStr:this.searchStr})

       this.addOrUpdate = "update"
       this.$router.push({name:'LKCraft',params:{id:id,addOrUpdate:this.addOrUpdate}});
    },
    // 点击添加按钮
    add() {
      this.$store.commit("SET_CRAFTDATA", {select:this.select,searchStr:this.searchStr})

      this.addOrUpdate = "save"
      this.$router.push({name:'LKCraft',params:{addOrUpdate:this.addOrUpdate}});
    },
    // 点击设置模板按钮
    getSpreadDemo() {
      this.$store.commit("SET_CRAFTDATA", {select:this.select,searchStr:this.searchStr})

      this.$router.push({name:'LKCraft_demo'});
    },

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
    search(){
      this.currentPage = 1
      this.getList()
    },
    // 查询价目表单列表数据
    getList() {
      console.log("搜索字段:", this.select)
      request.get('/produce/craft/list', {
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
      })
    }
    ,
    // 审核
    realValid(id) {
      request.post('/produce/craft/realValid', id).then(res => {
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
      request.post('/produce/craft/valid', id).then(res => {
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
      request.post('/produce/craft/returnRealValid', id).then(res => {
        this.$message({
          message: '反审核成功!',
          type: 'success'
        });
        this.getList()
      })
    },
    // 反审核
    returnValid(id) {
      request.post('/produce/craft/returnValid', id).then(res => {
        this.$message({
          message: '反审核成功!',
          type: 'success'
        });
        this.getList()
      })
    },

    // 删除
    del(id) {
      request.post('/produce/craft/del', id).then(res => {
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
  },
  created() {
    console.log("select:",    this.$store.state.craftData.select)
    if(this.$store.state.craftData.select != undefined){
      this.select = this.$store.state.craftData.select;
    }
    if(this.$store.state.craftData.searchStr != undefined){
      this.searchStr = this.$store.state.craftData.searchStr;
    }
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
.el-dialog__body{
  padding: 0 0;
}
</style>