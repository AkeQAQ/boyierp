<template>
  <el-container>
    <el-main >
      <div class="header">

        <el-button size="mini" type="primary" v-if="hasAuth('produce:craft:real')" @click="submitForm()">
          保存模板
        </el-button>

        <el-button size="mini" type="primary"  @click="printExcel()">
          打印
        </el-button>


        <el-button size="mini" type="primary"  @click="downloadExcel()">
          下载
        </el-button>

        <el-button style="margin-left: 100px" size="mini" type="danger"  @click="returnPage">
          返回
        </el-button>

      </div>


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

import { exportLKExcel } from "@/utils/exportLK";


export default {
  name: "craftDemo-lk",
  data() {
    return {
      editForm2: {
        demoJson:[]
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
          showinfobar:false,
          column: 20, //空表格默认的列数量
          row: 20, //空表格默认的行数据量
          data:exportJson.sheets,
          title:exportJson.info.name,
          userInfo:exportJson.info.name.creator
        });
      });
    },
    // 表单提交
    submitForm() {
      this.editForm2.demoJson = JSON.stringify(luckysheet.getAllSheets());
      console.log("提交时的json,",this.editForm2.demoJson)

      request.post('/produce/craft/setStreadDemo',this.editForm2).then(res => {
        this.$message({
          message:  '设置模板成功!',
          type: 'success'
        });
        this.returnPage()

      })
    },
    // 打印实现
    printExcel() {
      //  找到需要隐藏的DOM节点
      $(".header").addClass("printHideCss");
      window.print();
      $(".header").removeClass("printHideCss");
      //  window.location.reload();
    },
    // 导出到本地
    downloadExcel() {
      exportLKExcel(luckysheet.getAllSheets(), "工艺单");
    },


  },
  created() {
    this.$nextTick(() => {
      request.get('/produce/craft/getStreadDemo').then(res => {
        let result = res.data.data;
        if(result != null){
          let arr = JSON.parse(result.demoJson);
          var options = {
            container:'luckysheet',
            titile:'test',
            lang:'zh',
            column: 20, //空表格默认的列数量
            row: 20, //空表格默认的行数据量
            showinfobar:false,
            data:arr
          }
          luckysheet.create(options)
        }
        else{
          var options = {
            container:'luckysheet',
            titile:'1',
            column: 20, //空表格默认的列数量
            row: 20, //空表格默认的行数据量
            showinfobar:false, //是否显示顶部信息栏
            lang:'zh'
          }
          luckysheet.create(options)
        }
      })
    });

  }
}
</script>

<style scoped>

.printHideCss {
  visibility: hidden !important;
}
</style>