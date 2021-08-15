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
        if(to.path != '/login'){
          console.log("路由跳转to:",to)
          this.$store.commit("addTab", {routerName:to.name,title:to.meta.title})

        }
      }
    }
  }
</script>

<style>
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