<template>
  <div style="text-align: center">
    <h2>你好{{userInfo.userName}}</h2>
    <el-form :model="userForm" status-icon :rules="rules" ref="userForm" label-width="100px" class="demo-userForm">

      <el-form-item label="当前密码" prop="currentPass">
        <el-input type="password" v-model="userForm.currentPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input type="password" v-model="userForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="checkPass">
        <el-input type="password" v-model="userForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('userForm')">提交</el-button>
        <el-button @click="resetForm('userForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "UserCenter",
  data() {
    var validateCurrentPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'));
      }
      callback();

    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.userForm.checkPass !== '') {
          this.$refs.userForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.userForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      userForm: {
        currentPass:'',
        pass: '',
        checkPass: ''
      },
      rules: {
        currentPass: [
          {validator: validateCurrentPass, trigger: 'blur'},
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        pass: [
          {validator: validatePass, trigger: 'blur'},
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ]
      },
      userInfo:this.$store.state.user_info
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this
          this.$axios.post('/sys/user/updatePassword',this.userForm).then(response =>{
            _this.$alert(response.data.msg,'提示',{
              confirmButtonText:'确定',
              callback:action => {
                this.resetForm(formName)
              }
            })
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>

.el-form{
  width: 420px;
  margin: 50px auto;

}
/*.el-form-item{
  display: flex;
  justify-content: center;
}*/
</style>