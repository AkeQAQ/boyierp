<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name:"app",
    watch:{
      // 解决刷新浏览器没有tab的问题
      $route(to,from){

        console.log("跳转的to path：",to.path)
        if(to.path != '/login' && !to.path.toString().startsWith("/luckysheet") ){
          console.log("obj.checkNumto:",to)
          this.$store.commit("addTab", {routerName:to.name,title:to.meta.title})

        }
      }
    }
  }
</script>

<style>
@import './assets/css/common.css';

html, body, #app {
  font-family: 'Helvetica Neue', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', 'Microsoft Yahei', sans-serif;
  height: 100%;
  padding: 0;
  margin: 0;
  font-size: 15px;

}
.el-table__row{
td:not(.is-hidden):last-child{
  right:-1px;}
}
</style>