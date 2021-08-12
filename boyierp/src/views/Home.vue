<template>
  <el-container>

    <!-- 左侧菜单 -->
    <el-aside width="200px">

      <!-- 引入SideMenu.vue 公共组件 -->
      <SideMenu></SideMenu>

    </el-aside>

    <!-- 右边区域 -->
    <el-container>

      <!-- 顶部区域 -->
      <el-header>
        <Strong>博艺ERP管理系统</Strong>
        <div class="header_right">
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ userInfo.username }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link :to="{name:'UserCenter'}"> <!-- 该种方式，只能用路由的name 来指定 -->
                  修改密码
                </router-link>
              </el-dropdown-item>

              <el-dropdown-item @click.native="logout">
                退出
              </el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>

        </div>
      </el-header>

      <!-- 主体区域 -->
      <el-main>
        <!--        11111-->
        <Tab></Tab>
        <div style="margin: 0 15px;">
          <router-view/>  <!-- 显示子路由内容 -->
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// <!-- 引入SideMenu.vue 公共组件 -->
import SideMenu from "@/views/inc/SideMenu";
import Tab from "@/views/inc/Tab";

export default {
  name: "Home",
  data() {
    return {
      userInfo: {
        id: "",
        username: ""
      }
    }
  },
  components: {SideMenu, Tab},
  methods: {
    getUserInfo() {
      // 用户信息接口
      this.$axios.post('/sys/getUserInfo').then(res => {
        this.userInfo = res.data.data;
      })
    },
    logout() {
      // 用户退出接口
      this.$axios.post('/logout').then(res => {
        this.$store.commit('LOGOUT')
        this.$store.commit("reset")
        this.$router.push("/login")
      })
    }

  }
  ,
  created() {
    this.getUserInfo()
  }
}
</script>

<style scoped>

.header_right {
  float: right;
  width: 200px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}


.el-container {
  height: 100%;
}


.el-header {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  padding: 0;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

/*<!-- 删除超链接下划线 -->*/
a {
  text-decoration: none;
}
</style>