<template>
  <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">

    <router-link to="/index"> <!-- 跳转路由 -->
      <el-menu-item index="0">
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </template>
      </el-menu-item>
    </router-link>


    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-s-operation"></i>
        <span>系统管理</span>
      </template>

      <router-link to="/sys/user">

        <el-menu-item index="1-1">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span slot="title">用户管理</span>
          </template>
        </el-menu-item>
      </router-link>
      <router-link to="/sys/role">

        <el-menu-item index="1-2">
          <template slot="title">
            <i class="el-icon-user-solid"></i>
            <span slot="title">角色管理</span>
          </template>
        </el-menu-item>
      </router-link>

    </el-submenu>

    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-setting"></i>
        <span>系统工具</span>
      </template>
      <el-menu-item index="2-1">
        <template slot="title">
          <i class="el-icon-s-order"></i>
          <span slot="title">基础数据管理</span>
        </template>
      </el-menu-item>
    </el-submenu>

  </el-menu>

</template>

<script>
export default {
  name: "SideMenu"
}
</script>

<style scoped>
.el-menu {
  height: 100%;
}
</style>