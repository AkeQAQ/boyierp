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
              {{ userInfo.userName }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item >
                <router-link  :to="{name:'UserCenter'}"> <!-- 该种方式，只能用路由的name 来指定 -->
                  修改密码
                </router-link>

<!--                <span  @click="updatePassClick">修改密码</span>-->
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
          <keep-alive>
            <router-view  />  <!-- 显示子路由内容 -->
          </keep-alive>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// <!-- 引入SideMenu.vue 公共组件 -->
import SideMenu from "@/views/inc/SideMenu";
import Tab from "@/views/inc/Tab";
import {request} from "@/axios";

export default {
  name: "Home",
  data(){
    return {
      timer:''
    }
  },
  computed:{
    userInfo:{
      get(){
        return this.$store.state.user_info;
      }
    },
  }
  ,
  components: {SideMenu, Tab},
  methods: {
    getUserInfo() {
      // 用户信息接口
      request.get('/sys/user/getUserInfo').then(res => {
        console.log("设置userInfo,",res.data.data)
        this.$store.commit("SET_USERINFO",res.data.data)
      })
    },
    logout() {
      // 用户退出接口
      request.post('/logout').then(res => {
        this.$store.commit('LOGOUT')
        this.$store.commit("reset")
        this.$router.push("/login")
      })
    }/*,
    updatePassClick(){
      this.$store.commit("addTab",{routerName:"UserCenter",title:'个人中心'})
      this.$router.push("/userCenter")
    }*/
    ,heartSend(){
      if(sessionStorage.getItem("token") != null){
        request.get('/common/heart/sendHeart').then(res => {
        })
      }
    }

  }
  ,
  created() {
    this.getUserInfo()
    this.timer = setInterval(this.heartSend, 9000);
  }
}
Date.prototype.format = function(fmt) {
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt)) {
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  for(var k in o) {
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt;
}
</script>


<style >

.my-autocomplete{
  width: auto !important;
}
.my-autocomplete li{
  line-height: normal;
  padding: 7px;
}
.my-autocomplete .name{
  text-overflow: ellipsis;
  overflow: hidden;
}
.my-autocomplete .unit{
  font-size: 12px;
  color: #b4b4b4;
}
.my-autocomplete .highlighted .unit {
  color: #ddd;
}

</style>

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
  /*background-color: #E9EEF3;*/
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