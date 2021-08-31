<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :xl="6" :lg="7">
      <div class="grid-content bg-purple" style="margin-bottom: 60px">
        <h2>博艺ERP管理系统</h2>
        <el-image :src="require('@/assets/logo2.png')" style="width: 180px; height: 180px"/>
      </div>
    </el-col>
    <el-col :span="1">
      <div class="grid-content bg-purple-light">
        <el-divider direction="vertical" ></el-divider>
      </div>
    </el-col>
    <el-col :xl="6" :lg="7">
      <div class="grid-content bg-purple">

        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="demo-loginForm">
          <el-form-item label="用戶名" prop="username">
            <el-input  @keyup.enter.native="login()" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input  @keyup.enter.native="login()" type="password" v-model="loginForm.password"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary"  @click="submitForm('loginForm')" >登陆</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>

  </el-row>
</template>

<script>
import qs from 'qs'

export default {


  name: "Login",
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("校验通过")
          // 1. 发送登陆请求到后端进行登陆
          this.$axios.post('/login?'+qs.stringify(this.loginForm)).then(res =>{

            const jwt = res.headers['authorization']                     // 将jwt存储到应用store中
            console.log("获的authorization jwt：",jwt)
            this.$store.commit("SET_TOKEN", jwt)  // 调用SET_TOKEN 方法，传入参数jwt

            this.$router.push("/index") // 跳转
          })
        } else {
          console.log("校验失败")
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    login(){
      this.submitForm('loginForm');
    }

  }

}
</script>

<style scoped>

.el-row {
  height: 100%;
  background-color: #fafafa;
}


.el-col {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}

.el-divider {
  height: 230px;
}

.el-form-item {
  width: 400px;
}

</style>