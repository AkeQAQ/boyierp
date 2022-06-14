<template>
  <el-container >
    <el-main >
      <el-form style="width: 100%;height: 100%;align-items: center;margin-top: -15px"
               size="mini"
               label-width="100px"

               inline
               :model="editForm2" :rules="rules" ref="editForm2"
               class="demo-editForm">

        <el-form-item   v-show="editForm2.status===1 && hasAuth('order:productPricePre:update')" label="导入" style="margin-left: -50px">
          <input  style="font-size:12px;padding: 0;margin: 0;width: 160px"  type="file" @change="uploadExcel" />
        </el-form-item>

        <el-form-item label="本厂货号" prop="companyNum">
          <el-input size="mini" clearable style="width: 150px" v-model="editForm2.companyNum">
          </el-input>
        </el-form-item>

        <el-form-item label="客户公司" prop="customer">
          <el-input size="mini" clearable style="width: 150px" v-model="editForm2.customer">
          </el-input>
        </el-form-item>

        <el-form-item label="报价价格" prop="dealPrice" v-if="hasAuth('order:productPricePre:showDealPrice')">
          <el-input size="mini" clearable style="width: 150px" v-model="editForm2.dealPrice">
          </el-input>
        </el-form-item>
<!--

        <el-form-item label="报价价格" prop="price">
          <el-input size="mini" clearable style="width: 200px" v-model="editForm2.price">
          </el-input>
        </el-form-item>
-->
        <el-form-item label="">
          <el-button v-show="hasAuth('order:productPricePre:update')" type="primary" :disabled="this.isCopy" style="margin-bottom: 10px" @click="copy()">
            {{this.isCopy ? '已复制':'复制'}}
          </el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button type="success" icon="el-icon-download"  style="margin-bottom: 10px" @click="exportExcel()">
            导出
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-input size="mini" v-show="false" v-model="editForm2.excelJson">
          </el-input>
        </el-form-item>
      </el-form>

      <div class="bottom" >
        <el-button type="primary" ref="saveBtn" style="margin-bottom: 10px" v-show="hasAuth('order:productPricePre:update') && (editForm2.status===1 || isCopy===true)" :loading="isLoad" @click="submitForm('editForm2')">
          保存报价
        </el-button>
        <el-button type="danger" ref="returnBtn" @click="returnPage">
          返回
        </el-button>
      </div>

    </el-main>

    <el-footer>
        <div id="luckysheet" style="margin:0px;padding:0px;position:absolute;width:98%;height:100%;left:0px;top:40px;
"></div>
    </el-footer>
  </el-container>

</template>

<script>
import {request} from "@/axios";
import {request2} from "@/axios";
import LuckyExcel from 'luckyexcel'
export default {
  name: "productPrice-lk",
  data() {
    return {
      isCopy:false,
      isLoad:false,
      editForm2: {
        status: 1, // 编辑表单初始默认值
        id: '',
        companyNum: '',
        customer: '',
        price:'',
        dealPrice:'',
        excelJson:[]
      },
      rules: {
        companyNum: [
          {required: true, message: '请输入本厂货号', change: 'blur'}
        ],
        customer: [
          {required: true, message: '请输入客户公司', trigger: 'blur'}
        ]
      },
    }

  },
  methods:{
    returnPage(){
      this.$router.go(-1);
    },

    uploadExcel(evt){
      const files = evt.target.files;
      if(files==null || files.length==0){
        alert("No files wait for import");
        return;
      }

      let name = files[0].name;
      let suffixArr = name.split("."), suffix = suffixArr[suffixArr.length-1];
      if(suffix!="xlsx"){
        alert("Currently only supports the import of xlsx files");
        return;
      }
      LuckyExcel.transformExcelToLucky(files[0], function(exportJson, luckysheetfile){

        if(exportJson.sheets==null || exportJson.sheets.length==0){
          alert("Failed to read the content of the excel file, currently does not support xls files!");
          return;
        }
        window.luckysheet.destroy();

        console.log("导入：",exportJson.sheets)
        window.luckysheet.create({
          container: 'luckysheet', //luckysheet is the container id
          column: 20, //空表格默认的列数量
          row: 20, //空表格默认的行数据量
          data:exportJson.sheets,
          title:exportJson.info.name,
          userInfo:exportJson.info.name.creator,
          showinfobar:false, //是否显示顶部信息栏

        });
      });
    },
    // 导出
    exportExcel(){
      const load = this.$loading({
        lock: true,
        text: '处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$refs['saveBtn'].disabled = true
      this.$refs['returnBtn'].disabled = true
//这里你要自己写个后台接口，处理上传上来的Excel数据，用post传输。我用的是Java后台处理导出！这里只是写了post请求的写法
      let that = this;
      request2.post("/order/productPricePre/export", {
        exceldatas: JSON.stringify(luckysheet.getAllSheets())
      }, {responseType:'arraybuffer'}).then(res=>{
        // 这里使用blob做一个转换
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        this.saveFile(blob,that.editForm2.companyNum+"_"+that.editForm2.customer+'.xlsx')
        load.close()
        this.$refs['saveBtn'].disabled = false
        this.$refs['returnBtn'].disabled = false
      }).catch(()=>{
        load.close()
        this.$refs['saveBtn'].disabled = false
        this.$refs['returnBtn'].disabled = false
      })


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
    copy(){
      this.isCopy = true
      this.editForm2.companyNum = ''
      this.editForm2.customer = ''
      this.editForm2.dealPrice = ''
      this.editForm2.id= ''
    },
    // 表单提交
    submitForm(formName) {
      //ToJson
      this.isLoad=true;
      let methodName = '';
      if(this.isCopy === true){
        methodName = 'save'
      }else {
        methodName = this.$route.params.addOrUpdate
      }
      this.editForm2.excelJson = JSON.stringify(luckysheet.getAllSheets());
      console.log("提交时的json,",this.editForm2.excelJson)
      let cellValue = luckysheet.getCellValue(59, 8);
      console.log("60行，9列的内容：",cellValue)
      this.editForm2.price = cellValue;

      this.$refs[formName].validate((valid) => {

        if (valid) {
          request.post('/order/productPricePre/' + methodName, this.editForm2).then(res => {
            this.$message({
              message: (methodName === 'update' ? '编辑' : '新增') + '成功!',
              type: 'success'
            });

            this.returnPage()
          })
        }
        this.isLoad=false;

      })
    },
  },
  created() {
    console.log("id=",this.$route.params.id)
    console.log("addOrUpdate=",this.$route.params.addOrUpdate)
    this.$nextTick(() => {

      if(this.$route.params.addOrUpdate==='update'){

        request.get('/order/productPricePre/queryById?id=' + this.$route.params.id).then(res => {
          let result = res.data.data
          this.editForm2 = result
          console.log("excelJson",this.editForm2.excelJson)
          let arr = JSON.parse(this.editForm2.excelJson);
          var options = {
            container:'luckysheet',
            titile:'test',
            lang:'zh',
            column: 20, //空表格默认的列数量
            row: 20, //空表格默认的行数据量
            showinfobar:false, //是否显示顶部信息栏
            data:arr
          }
          luckysheet.create(options)
        })
      }else{
        request.get('/order/productPricePre/getStreadDemo').then(res => {
          let result = res.data.data;
          if(result != null){
            let arr = JSON.parse(result.demoJson);
            var options = {
              container:'luckysheet',
              titile:'test',
              lang:'zh',
              column: 20, //空表格默认的列数量
              row: 20, //空表格默认的行数据量
              showinfobar:false, //是否显示顶部信息栏

              data:arr
            }
            luckysheet.create(options)
          }
          else{
            var options = {
              container:'luckysheet',
              titile:'1',
              lang:'zh',
              column: 20, //空表格默认的列数量
              row: 20, //空表格默认的行数据量
              showinfobar:false, //是否显示顶部信息栏,
              "scrollTop": 0,
            }
            luckysheet.create(options)
          }
        })
      }

    });

  }
}
</script>

<style scoped>
.bottom{position:fixed; bottom:100px;right: 50px;  z-index:2001;
  width: 100px;
}
</style>