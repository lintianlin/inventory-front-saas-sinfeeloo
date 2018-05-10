<template>
    <div id="app">
        <div class="loginContent">
            <div class="left-cont">
                <p class="big-text">经销商、厂家一体化销售管理平台</p>
                <p class="small-text">打造F2B2b2C工具化电商平台，实现厂商一体化</p>
                <p class="small-text">为经销商提供一站式解决方案</p>
            </div>
            <img src="../assets/images/login-pc.png" class="login-pc">
            <el-row class="loginBox">
                <el-col :span="4" class="" style="position:relative;height: 100%">
                    <el-form :model="ruleForm" :rules="rules"  ref="ruleForm" label-width="100px" label-position="right"  class="demo-ruleForm">
                        <div class="big-title">Saas经销商业务管理系统</div>
                        <div class="small-title">Saas Dealer Management System</div>
                        <el-form-item label="" prop="name">
                            <i class="eliconfont elicon-user"></i>
                            <el-input v-model="ruleForm.name" placeholder="请输入用户名称"  @keyup.enter.native="skuNameSearch"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="pass">
                            <i class="eliconfont elicon-password"></i>
                            <el-input type="password" v-model="ruleForm.password" placeholder="请输入登录密码" auto-complete="off"  @keyup.enter.native="skuNameSearch"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')">登 录</el-button>
                            <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
                        </el-form-item>
                        <img src="../assets/images/login-bt.png" class="login-bt">
                    </el-form>
                </el-col>
            </el-row>
            <el-alert class="loginAlert"
                      v-if="elAlertShow"
                      :title="elAlertTitle"
                      :type="elAlertType"
                      :closable="false"
                      show-icon>
            </el-alert>
        </div>
        <div class="footerText">
            CopyRight ©️ 山东极优信息科技有限公司 2018
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
        computed: {},
        mounted() {
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
                        if (200===response.data.rc) {
                            localStorage.token = response.data.data.token;
                            localStorage.userId = response.data.data.id;
                            localStorage.account = response.data.data.name
                            console.log(response.data.data.id)
                            self.$router.push({path: '/main'})

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

<style lang="less">
    html{
        height: 100%;
    }
    body{
        height: 100%;
    }
    #app {
        font-family: Helvetica, sans-serif;
        text-align: center;
        height: 100%;
        position: relative;
        min-height:700px;
    }
    .loginContent{
        position: relative;
        height: 100%;
        overflow: auto;
        background: #1c7bd9 url("../assets/images/login-bg.png") no-repeat left center;
        background-size: 70% auto;
        .left-cont{
            position: absolute;
            left: 13.5%;
            top:255px;
            .big-text{
                font-size: 40px;
                color: #ffffff;
                margin-bottom: 68px;
            }
            .small-text{
                font-size: 24px;
                color: #ffffff;
                margin-bottom: 12px;
                text-align:right
            }
            p{
                text-shadow: 1px 1px 5px #000000;
            }
        }
        .login-pc{
            position: absolute;
            right: 0px;
            bottom: 60px;
        }
        .demo-ruleForm{
            width: 371px;
            height: 607px;
            background: #ffffff;
            position: absolute;
            top: 50%;
            left: 100%;
            margin: 40% 0 0 50px;
            border-radius: 4px;
            .big-title{
                margin-top: 52px;
                color: #585959;
                font-size: 24px;
            }
            .small-title{
                color: #737373;
                font-size: 16px;
                margin-bottom: 50px;
            }
            .el-form-item__content{
                position: relative;
                margin: 0 auto;
                width: 300px;
                margin-left: 36px!important;
            }
            .elicon-user,.elicon-password{
                position: absolute;
                left: 0px;
                top: 0px;
                width: 30px;
                z-index: 9;
                font-size: 18px;
                color: #BEBEBE;
            }
            .elicon-password{
                font-size: 28px;
            }
            input{
                border-bottom: 1px solid #cbcbcb;
                outline: none;
            }
            .el-input__inner{
                border-top: none;
                border-left: none;
                border-right: none;
                border-bottom: 1px solid #cbcbcb;
                padding-left: 34px;
            }
            .el-form-item__error{
                color: #ff4949;
                font-size: 12px;
                line-height: 1;
                padding-top: 4px;
                position: absolute;
                top: 11px;
                left: 216px;
            }
            .el-form-item.is-error .el-input__inner{
                border-color: transparent;
                border-bottom: 1px solid #cbcbcb;
            }
            .el-button--primary{
                margin-top: 50px;
                color: #fff;
                background-color: #1c7bd9;
                border-color: #1c7bd9;
                width: 293px;
                height: 40px;
                font-size: 16px;
            }
            .el-form-item__error{
                width: auto;
            }
            .login-bt{
                position: absolute;
                left:-1px;
                bottom: 0px;
                font-size: 17px;
            }
            input::-webkit-input-placeholder {
                /* WebKit browsers */
                color: #cfcfcf;
                font-size: 16px;
            }
            input:-moz-placeholder {
                /* Mozilla Firefox 4 to 18 */
                color: #cfcfcf;
                font-size: 16px;
            }
            input::-moz-placeholder {
                /* Mozilla Firefox 19+ */
                color: #cfcfcf;
                font-size: 16px;
            }
            input::-ms-input-placeholder {
                /* Internet Explorer 10+ */
                color: #cfcfcf;
                font-size: 16px;
            }

        }
        .loginBox{
            display: flex;
            justify-content: center;
            transform: translateX(-40px);
        }


    }
    .footerText{
        position: absolute;
        bottom:20px;
        left:40%;
        color:#f0f0f0;
        font-size:12px;
    }
    @media screen and (max-width: 1350px) {
        .loginContent {
            .left-cont{
                position: absolute;
                left: 5.5%;
                top:255px;
            }
        }
    }
    @media screen and (max-width: 1150px) {
        .loginContent {
            .left-cont{
                position: absolute;
                left: 5.5%;
                top:255px;
                .big-text{
                    font-size: 30px;
                    color: #ffffff;
                    margin-bottom: 68px;
                }
                .small-text{
                    font-size: 20px;
                    color: #ffffff;
                    margin-bottom: 12px;
                    text-align:right
                }
            }
        }
    }

</style>