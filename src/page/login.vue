<template>
  <div class="login" id="login">
    <div class="login_logo">
      <img src="../assets/images/login_logo.png">
    </div>
    <div class="content">
      <div class="title">
        <h1>华森进销存系统</h1>
        <h2>进、销、存、财 四位一体</h2>
        <h1>做你最贴心的管家</h1>
      </div>
      <div class="login_con">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="form_name">
          <div class="login_text">
            <img src="../assets/images/user.png">
            <el-input v-model="ruleForm.name" placeholder="请输入用户名称" prefix-icon=' '>
            </el-input>
          </div>
          <div class="login_text">
            <img src="../assets/images/password.png">
            <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码" prefix-icon=' '>
            </el-input>
          </div>
          <el-button type="primary" class='success_btn' @click="submitForm('ruleForm')">登&nbsp;&nbsp;&nbsp;&nbsp;录
          </el-button>
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
  import http from '@/fetch/http'
  import api from '@/fetch/api'

  export default {
    data() {
      return {
        screenHeight: document.documentElement.clientHeight,
        ruleForm: {
          name: '',
          password: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        elAlertShow: false,//提示框是否可显示
        elAlertTitle: 'fqwefq',//提示框文字
        elAlertType: 'success',//提示框类型

      }
    },
    mounted () {
      document.getElementById('login').style.minHeight = this.screenHeight + 'px'
    },
    methods: {
      //提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.login();
          } else {
            return false;
          }
        });
      },
      login() {//登录方法
        var self = this;
        let params = {
          account: self.ruleForm.name,
          password: self.ruleForm.password
        }
        http.axiosPost(api.login.login, params,
          response => {
            if (200 === response.data.rc) {
              localStorage.token = response.data.data.token;
              localStorage.userId = response.data.data.id;
              localStorage.account = response.data.data.name
              console.log(response.data.data.id)
              self.$router.push({path: '/home'})
            } else {
              self.controlElAlert(response.data.des, 'error');
            }
          })
      },
      resetForm(formName) {//重置表单
        this.$refs[formName].resetFields();
      },
      controlElAlert(text, type) {//控制提示框
        var self = this;
        self.elAlertShow = true;
        self.elAlertTitle = text;
        self.elAlertType = type;
        setTimeout(function () {
          self.elAlertShow = false;
        }, 2000)
      },
      skuNameSearch(event) {
        this.submitForm('ruleForm');
      },
    }
  }
</script>

<style scoped>
  .login {
    position: relative;
    /*background: lightblue;*/
    background: url(../assets/images/back.png);
    background-size: 100% auto;
    background-repeat: no-repeat
  }

  .content {
    position: absolute;
    height: 256px;
    width: 850px;
    top: 45%;
    left: 47%;
    transform: translate(-50%, -50%);
  }

  .login_logo {
    position: absolute;
    width: 850px;
    top: 0;
    left: 47%;
    transform: translateX(-50%);
  }

  .login_logo img {
    margin-left: 143px;
  }

  .content .title {
    width: 500px;
    float: left;
    text-align: center;
    letter-spacing: 5px;
    padding-top: 22px;
    font-family: '宋体'
  }

  .content .title h1 {
    color: #fff;
    font-size: 44px;
    text-shadow: 4px 6px 6px #000;
  }

  .content .title h2 {
    color: #EBBF66;
    margin: 25px 0 35px;
    font-size: 30px;
    font-family: '黑体';
    text-shadow: 4px 6px 6px #1a1a1ac9;
  }

  .login_con {
    width: 350px;
    height: 256px;
    background: #fff;
    padding-top: 45px;
    float: left;
  }

  .login_con:hover .Prompt {
    display: block;
    transition: 1s all;
  }

  .login_con p {
    text-align: center;
    color: #666;
    font-size: 14px;
    margin-top: 50px;
  }

  .form_name {
    width: 80%;
    margin: 0 auto;
  }

  .el-input {
    margin-bottom: 20px;
  }

  .success_btn {
    width: 100%;
  }

  .login_text {
    position: relative;
  }

  .login_text img {
    position: absolute;
    top: 10px;
    left: 8px;
    width: 18px;
    z-index: 1;
  }

  .Prompt {
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

  .Prompt i {
    position: absolute;
    top: 28px;
    left: -6px;
    display: block;
    width: 12px;
    height: 12px;
    background: #fff;
    transform: rotate(45deg);
  }

  .Prompt p {
    font-size: 14px;
    width: 141px;
    margin: 23px auto;
  }

  .Prompt p span {
    color: red;
    margin: 0 4px;
  }
</style>
