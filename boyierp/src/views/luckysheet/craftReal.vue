<template>

  <el-container>
    <el-main>
      <el-form style="width: 100%;height: 100%;align-items: center;margin-top: 0px"
               size="mini"
               label-width="100px"
               inline
               :model="editForm2" :rules="rules" ref="editForm2"
               class="demo-editForm">

        <el-form-item>
          <input style="font-size:16px;" type="file" @change="uploadExcel" />

        </el-form-item>

        <el-form-item>
          <el-button type="primary" v-if="hasAuth('produce:craft:real')"  @click="submitForm()">
            保存最终工艺单
          </el-button>
          <el-button type="primary"  @click="returnPage">
            取消
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-input size="mini" v-show="false" v-model="editForm2.realJson">
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
  name: "craftReal-lk",
  data() {
    return {
      editForm2: {
        id: '',
        realJson:[]
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
          data:exportJson.sheets,
          title:exportJson.info.name,
          userInfo:exportJson.info.name.creator
        });
      });
    },
    // 表单提交
    submitForm(formName) {
      //ToJson
      this.editForm2.realJson = JSON.stringify(luckysheet.getAllSheets());
      console.log("提交时的json,",this.editForm2.realJson)

        request.post('/produce/craft/setStreadReal' , this.editForm2).then(res => {
          this.$message({
            message: '编辑成功!',
            type: 'success'
          });

          this.returnPage()
        })
    },


  },
  created() {
    console.log("id=",this.$route.params.id)

    this.$nextTick(() => {

        request.get('/produce/craft/queryById?id=' + this.$route.params.id).then(res => {
          let result = res.data.data
          this.editForm2 = result

          console.log("realJson",this.editForm2.realJson)
          if(this.editForm2.realJson === ''){
            request.get('/produce/craft/getStreadDemo').then(res => {
              let result = res.data.data;
              if(result != null){
                let arr = JSON.parse(result.demoJson);
                var options = {
                  container:'luckysheet',
                  titile:'test',
                  lang:'zh',
                  data:arr
                }
                luckysheet.create(options)
              }
              else{

                var options = {
                  container:'luckysheet',
                  titile:'1',
                  lang:'zh'
                }
                luckysheet.create(options)
              }
            })
          }else{
            let arr = JSON.parse(this.editForm2.realJson);
            if(arr )
              var options = {
                container:'luckysheet',
                titile:'test',
                lang:'zh',
                data:arr
              }
            luckysheet.create(options)
          }
        })

    });

  }
}
</script>

<style scoped>

</style>