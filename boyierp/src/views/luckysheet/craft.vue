<template>
  <el-container>
    <el-main>
      <el-form style="width: 100%;height: 100%;align-items: center;margin-top: 0px"
               size="mini"
               label-width="100px"
               inline
               :model="editForm2" :rules="rules" ref="editForm2"
               class="demo-editForm">

        <el-form-item  v-show="editForm2.status===1" label="导入" style="margin-left: -50px">
          <input  style="font-size:12px;padding: 0;margin: 0;width: 160px" type="file"  @change="uploadExcel" />
        </el-form-item>

        <el-form-item label="本厂货号" prop="companyNum">
          <el-input size="mini" clearable style="width: 200px" v-model="editForm2.companyNum">
          </el-input>
        </el-form-item>

        <el-form-item label="客户公司" prop="customer">
          <el-input size="mini" clearable style="width: 200px" v-model="editForm2.customer">
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" v-show="editForm2.status===1" @click="submitForm('editForm2')">
            保存核算
          </el-button>
          <el-button type="primary"  @click="returnPage">
            返回
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-input size="mini" v-show="false" v-model="editForm2.excelJson">
          </el-input>
        </el-form-item>

      </el-form>

    </el-main>

    <el-footer>
        <div id="luckysheet" style="margin:0px;padding:0px;position:absolute;width:98%;height:100%;left:0px;top:60px;
"></div>
    </el-footer>
  </el-container>

</template>

<script>
import {request} from "@/axios";
import LuckyExcel from 'luckyexcel'

export default {
  name: "craft-lk",
  data() {
    return {
      editForm2: {
        status: 1, // 编辑表单初始默认值
        id: '',
        companyNum: '',
        customer: '',
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
    // 表单提交
    submitForm(formName) {
      //ToJson
      let methodName = this.$route.params.addOrUpdate
      this.editForm2.excelJson = JSON.stringify(luckysheet.getAllSheets());
      console.log("提交时的json,",this.editForm2.excelJson)

      this.$refs[formName].validate((valid) => {

        if (valid) {
          request.post('/produce/craft/' + methodName, this.editForm2).then(res => {
            this.$message({
              message: (methodName === 'update' ? '编辑' : '新增') + '成功!',
              type: 'success'
            });

            this.returnPage()
          })
        }
      })
    },


  },
  created() {
    console.log("id=",this.$route.params.id)
    console.log("addOrUpdate=",this.$route.params.addOrUpdate)

    this.$nextTick(() => {

      if(this.$route.params.addOrUpdate==='update'){

        request.get('/produce/craft/queryById?id=' + this.$route.params.id).then(res => {
          let result = res.data.data
          this.editForm2 = result
          console.log("excelJson",this.editForm2.excelJson)
          let arr = JSON.parse(this.editForm2.excelJson);
          var options = {
            container:'luckysheet',
            titile:'test',
            lang:'zh',
            column: 20, //空表格默认的列数量
            row: 30, //空表格默认的行数据量
            showinfobar:false, //是否显示顶部信息栏
            data:arr
          }
          luckysheet.create(options)
        })

      }else{
        request.get('/produce/craft/getStreadDemo').then(res => {
          let result = res.data.data;
          if(result != null){
            let arr = JSON.parse(result.demoJson);
            var options = {
              container:'luckysheet',
              titile:'test',
              lang:'zh',
              column: 20, //空表格默认的列数量
              row: 30, //空表格默认的行数据量
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
              row: 30, //空表格默认的行数据量
              showinfobar:false, //是否显示顶部信息栏
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

</style>