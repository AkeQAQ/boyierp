<template>
  <div>
    <span style="font-size: 20px">在线人数：</span><span style="font-size: 20px;color: red">{{this.onlineNum}}</span>
    <el-button size="mini" icon="el-icon-refresh" type="primary" style="margin-left: 50px"
               @click="refresh()"

    >刷新
    </el-button>
    <el-divider content-position="left">在线人员名字</el-divider>
    <el-tag
        :key="tag"
        v-for="tag in onlineDetail">
      {{tag}}
    </el-tag>

  </div>
</template>

<script>

import {request} from "@/axios";

export default {
  name: "online",
  data(){
    return {
      onlineNum:0,
      onlineDetail:[]
    }
  },
  methods:{
    refresh(){
      this.getOnlineNum();
      this.$message({
        message: '刷新成功!',
        type: 'success'
      });
    },
    getOnlineNum(){
      request.get('/dataAnalysis/online/onlineNum').then(res=>{
        let data = res.data.data;
        this.onlineNum = data.onlineNum;
        this.onlineDetail = data.onlineDetail;
      }).catch()
    }
  },

  created() {
    this.getOnlineNum()
  }
}
</script>

<style scoped>

</style>