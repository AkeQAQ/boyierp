<template>
  <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">

    <router-link to="/index"> <!-- 跳转路由 -->
      <el-menu-item index="Index" >
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </template>
      </el-menu-item>
    </router-link>


    <el-submenu  :index="menu.title" v-for="menu in menuList">
      <template slot="title">
        <i :class="menu.icon"></i>
        <span>{{menu.title}}</span>
      </template>
      <router-link :to="item.path" v-for="item in menu.children">
        <el-menu-item :index="item.routerName"  >
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{item.title}}</span>
          </template>
        </el-menu-item>
      </router-link>

    </el-submenu>

  </el-menu>

</template>

<script>
export default {
  name: "SideMenu",
  data(){
    return {
      menuList:this.$store.state.menu.menuList
    }
  },
  methods:{
    // 点击左侧菜单栏 ，添加tab页
    /*selectMenu(current){
      console.log("点击左侧菜单栏",current)
      this.$store.commit("addTab",current)
    }*/

  },
  computed: {
    activeMenu() {
      return this.$store.state.tab.editableTabsValue
    }
  }
}
</script>

<style scoped>
.el-menu {
  height: 100%;
}
</style>