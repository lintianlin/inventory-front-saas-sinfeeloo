<template>
  <div class="login" id="login">
    <div class="login_logo">
      <img src="../assets/images/login_logo.png">
    </div>
    <div class="content">
      <div class="title">
        <h1>华森进销存系统</h1>
        <h2>进、销、存、财 四位一体</h2>
        <h2>做你最贴心的管家</h2>
      </div>
      <div class="login_con">
        <el-form :model="formInline" :rules="rules" ref="formInline" class="form_name">
          <div class="login_text">
            <img src="../assets/images/user.png">
            <el-input v-model="formInline.name" placeholder="请输入用户名称" prefix-icon=' '>
            </el-input>
          </div>
          <div class="login_text">
            <img src="../assets/images/password.png">
            <el-input v-model="formInline.password" type="password" placeholder="请输入密码" prefix-icon=' '>
            </el-input>
          </div>
          <el-button type="primary" class='success_btn' @click="onSubmit('formInline')">登&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
        </el-form>
        <p>CopyRight @ SinFeeLoo</p>
        <!-- <div class="Prompt">
          <i></i>
          <p><span>*</span>用户名或密码错误！</p>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api'
export default {
  data () {
    return {
      screenHeight: document.documentElement.clientHeight,
      formInline: {
        name: '',
        password: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入接收人', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入公告标题', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  mounted () {
    document.getElementById('login').style.minHeight = this.screenHeight + 'px'
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          login(this.formInline.name, this.formInline.password).then(res => {
            console.log(res.data)
            if (res.data.rc !== 0) {
              this.$message({
                type: 'info',
                message: res.data.des
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  created () {
  }
}
</script>
<style scoped>
.login{
  position: relative;
  /*background: lightblue;*/
  background: url(../assets/images/back.png);
  background-size:100% auto;background-repeat: no-repeat
}
.content {
  position: absolute;
  height: 256px;
  width: 850px;
  top: 45%;
  left: 47%;
  transform: translate(-50%,-50%);
}
.login_logo {
  position: absolute;
  width: 850px;
  top: 0;
  left: 47%;
  transform: translateX(-50%);
}
.login_logo img{
  margin-left: 143px;
}
.content .title{
  width: 500px;
  float: left;
  text-align: center;
  letter-spacing: 5px;
  padding-top: 22px;
  font-family: '宋体'
}
.content .title h1{
  color: #fff;
  font-size: 44px;
  text-shadow: 4px 6px 6px #000;
}
.content .title h2{
  color: #EBBF66;
  margin: 25px 0 35px;
  font-size: 30px;
  font-family: '黑体';
  text-shadow: 4px 6px 6px #1a1a1ac9;
}
.login_con{
  width: 350px;
  height: 256px;
  background: #fff;
  padding-top: 45px;
  float: left;
}
.login_con:hover .Prompt{
  display: block;
  transition: 1s all;
}

.login_con p{
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 50px;
}
.form_name{
  width: 80%;
  margin: 0 auto;
}
.el-input{
  margin-bottom: 20px;
}
.success_btn{
  width: 100%;
}
.login_text{
  position: relative;
}
.login_text img{
  position: absolute;
  top: 10px;
  left: 8px;
  width:18px;
  z-index:1;
}
.Prompt{
  display: none;
  position: absolute;
  right: -188px;
  top: 102px;
  height: 69px;
  width: 159px;
  background: #fff;
  border-radius: 4px;
  transform: translateX(-10px);
}
.Prompt i{
  position: absolute;
  top: 28px;
  left: -6px;
  display: block;
  width: 12px;
  height: 12px;
  background: #fff;
  transform: rotate(45deg);
}
.Prompt p{
  font-size: 14px;
  width: 141px;
  margin: 23px auto;
}
.Prompt p span{
  color: red;
  margin: 0 4px;
}
</style>
