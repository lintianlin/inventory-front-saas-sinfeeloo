<template>
    <div class="nav-horizontal bg-theme top-nav-bottom">
        <div class="com-logo">
            <div class="logoIcon"></div>
        </div>
        <div class="main-nav">
            <ul>
                <li v-for="item in oneMenu" :class="{'checked':checkIdx==item.id}" @click="clickNav(item.id)">
                    <div class="li-content">
                        <i :class="[item.icon]"></i>
                        <span>{{item.name}}</span>
                    </div>

                </li>
            </ul>
        </div>
        <div class="info-set">
            <ul class="main-menu">
                <li class="user">
                    <!--<img :src="userInfo.headerUrl" alt="" v-show="userInfo.headerUrl">-->
                    <!--<i class="eliconfont elicon-touxiang" v-show="!userInfo.headerUrl"></i>-->
                    <span>{{adminName}}</span>
                </li>
                <li title="重置密码" @click="dialogFormVisible =!dialogFormVisible">
                    <i class="eliconfont elicon-lock"></i>
                </li>
                <li title="退出">
                    <el-popover
                            ref="popover"
                            placement="bottom"
                            width="160"
                            popper-class="logoutPop"
                            v-model="visible2">
                        <p>确定要退出系统吗？</p>
                        <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
                            <el-button type="primary" size="mini" @click="loginOut">确定</el-button>
                        </div>
                    </el-popover>
                    <i class="eliconfont elicon-power" v-popover:popover @click="logoutClick"></i>
                </li>
            </ul>
            <el-dialog title="修改密码" :visible.sync="dialogFormVisible" size="tiny" class="passwordDialog">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="原密码：" prop="oldPassword">
                        <el-input type="password" v-model="ruleForm.oldPassword" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="修改密码：" prop="password">
                        <el-input type="password" v-model="ruleForm.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码：" prop="conPassword">
                        <el-input type="password" v-model="ruleForm.conPassword" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">取消</el-button>
                </div>
            </el-dialog>
            <div class="theme-box" v-show="themeShow">
                <ul>
                    <li id="default" @click="changeTheme('default')"></li>
                    <li id="red" @click="changeTheme('red')"></li>
                </ul>
            </div>
            <el-alert class="topAlert"
                      v-if="elAlertShow"
                      :title="elAlertTitle"
                      :type="elAlertType"
                      :closable="false"
                      show-icon>
            </el-alert>
        </div>

    </div>
</template>
<style lang='less'>
    .nav-horizontal {
        display: flex;
        height: 80px;
        color: #ffffff;
        font-size: 14px;
        /*line-height: 80px;*/
        .com-logo {
            width: 186px;
            display: flex;
            align-items: center;
            font-size: 16px;
            .logoIcon {
                width: 166px;
                height: 33px;
                margin-left: 20px;
                background: url("../assets/navPic/logo.png") no-repeat;
            }
        }
        .main-nav {
            flex: 1;
            ul {
                display: flex;
                justify-content: flex-start;
                height: 80px;
                li {
                    display: flex;
                    flex-direction: column;
                    margin: 0 10px 5px;
                    padding: 5px 0 18px;
                    width: 73px;
                    position: relative;
                    cursor: pointer;
                    .li-content {
                        transform: transLateY(10px);
                    }
                    i {
                        display: block;
                        width: 25px;
                        height: 25px;
                        margin: 0 auto;
                        &.caigouIcon {
                            background: url("../assets/navPic/s_caigou.png") no-repeat;
                        }
                        &.caiwuIcon {
                            background: url("../assets/navPic/s_caiwu.png") no-repeat;
                        }
                        &.danganIcon {
                            background: url("../assets/navPic/s_dangan.png") no-repeat;
                        }
                        &.dingdanIcon {
                            background: url("../assets/navPic/s_dingdan.png") no-repeat;
                        }
                        &.kucunIcon {
                            background: url("../assets/navPic/s_kucun.png") no-repeat;
                        }
                        &.shangpinIcon {
                            background: url("../assets/navPic/s_shangpin.png") no-repeat;
                        }
                        &.shouyeIcon {
                            background: url("../assets/navPic/s_shouye.png") no-repeat;
                        }
                        &.shujuIcon {
                            background: url("../assets/navPic/s_shuju.png") no-repeat;
                        }
                        &.xingweiIcon {
                            background: url("../assets/navPic/s_xingwei.png") no-repeat;
                        }
                        &.yingxiaoIcon {
                            background: url("../assets/navPic/s_yingxiao.png") no-repeat;
                        }
                    }
                    span {
                        flex: 1;
                        margin-top: 5px;
                        display: block;
                        color: rgba(255, 255, 255, 0.8)
                    }
                    &:hover {
                        border-bottom-left-radius: 8px;
                        border-bottom-right-radius: 8px;
                        background: rgba(18, 93, 199, 1);
                        transition: background 0.5s;
                        font-weight: bold;
                        span {
                            color: rgba(255, 255, 255, 1);
                            transition: color 0.5s;
                        }
                        i {
                            display: block;
                            margin: 0 auto;
                            &.caigouIcon {
                                background: url("../assets/navPic/caigou.png") no-repeat;
                            }
                            &.caiwuIcon {
                                background: url("../assets/navPic/caiwu.png") no-repeat;
                            }
                            &.danganIcon {
                                background: url("../assets/navPic/dangan.png") no-repeat;
                            }
                            &.dingdanIcon {
                                background: url("../assets/navPic/dingdan.png") no-repeat;
                            }
                            &.kucunIcon {
                                background: url("../assets/navPic/kucun.png") no-repeat;
                            }
                            &.shangpinIcon {
                                background: url("../assets/navPic/shangpin.png") no-repeat;
                            }
                            &.shouyeIcon {
                                background: url("../assets/navPic/shouye.png") no-repeat;
                            }
                            &.shujuIcon {
                                background: url("../assets/navPic/shuju.png") no-repeat;
                            }
                            &.xingweiIcon {
                                background: url("../assets/navPic/xingwei.png") no-repeat;
                            }
                            &.yingxiaoIcon {
                                background: url("../assets/navPic/yingxiao.png") no-repeat;
                            }
                        }
                    }
                    &.checked {
                        border-bottom-left-radius: 8px;
                        border-bottom-right-radius: 8px;
                        background: rgba(18, 93, 199, 1);
                        font-weight: bold;
                        span {
                            color: rgba(255, 255, 255, 1);
                        }
                        i {
                            display: block;
                            margin: 0 auto;
                            &.caigouIcon {
                                background: url("../assets/navPic/caigou.png") no-repeat;
                            }
                            &.caiwuIcon {
                                background: url("../assets/navPic/caiwu.png") no-repeat;
                            }
                            &.danganIcon {
                                background: url("../assets/navPic/dangan.png") no-repeat;
                            }
                            &.dingdanIcon {
                                background: url("../assets/navPic/dingdan.png") no-repeat;
                            }
                            &.kucunIcon {
                                background: url("../assets/navPic/kucun.png") no-repeat;
                            }
                            &.shangpinIcon {
                                background: url("../assets/navPic/shangpin.png") no-repeat;
                            }
                            &.shouyeIcon {
                                background: url("../assets/navPic/shouye.png") no-repeat;
                            }
                            &.shujuIcon {
                                background: url("../assets/navPic/shuju.png") no-repeat;
                            }
                            &.xingweiIcon {
                                background: url("../assets/navPic/xingwei.png") no-repeat;
                            }
                            &.yingxiaoIcon {
                                background: url("../assets/navPic/yingxiao.png") no-repeat;
                            }
                        }
                        &:after {
                            content: '';
                            display: block;
                            width: 80%;
                            height: 2px;
                            background: #ffffff;
                            position: absolute;
                            bottom: -1px;
                            left: 10%;
                        }
                    }
                }
            }
        }
        .info-set {
            .theme-box {
                width: 190px;
                height: 100px;
                background: #ffffff;
                border: solid 1px #e4e4e4;
                position: absolute;
                top: 81px;
                right: 35px;
                ul {
                    display: flex;
                    li {
                        display: block;
                        width: 80px;
                        height: 80px;
                        margin: 10px 0px 10px 10px;
                        &#default {
                            background: #1c7bd9;
                        }
                        &#red {
                            background: red;
                        }
                    }
                }
            }
            ul.main-menu {
                display: flex;
                justify-content: flex-end;
                padding-right: 13px;
                li {
                    display: inline-block;
                    width: 58px;
                    height: 80px;
                    line-height: 80px;
                    position: relative;
                    cursor: pointer;
                    &.user {
                        width: auto;
                        padding-right: 15px;
                        min-width: 140px;
                        img {
                            width: 32px;
                            height: 32px;
                            border-radius: 32px;
                            vertical-align: middle;
                            margin-right: 5px;
                        }
                        i {
                            font-size: 35px;
                            display: inline-block;
                            background: #379cdf;
                            width: 32px;
                            height: 32px;
                            border-radius: 32px;
                            vertical-align: middle;
                            &:before {
                                display: block;
                                transform: translateY(-22px) translateX(-1px);
                            }
                        }
                        span {
                            display: inline-block;
                            height: 80px;
                            line-height: 80px;
                        }
                    }
                    i {
                        font-size: 18px;
                    }
                    &:not(:first-child) {
                        &:before {
                            content: '';
                            display: block;
                            width: 1px;
                            height: 20px;
                            background: rgba(255, 255, 255, 0.5);
                            position: absolute;
                            top: 30px;
                            left: 0;
                        }
                    }

                    &:first-child {
                        &:before {

                        }
                    }
                }
            }
            .topAlert {
                position: fixed;
                line-height: 20px;
                top: 61px;
                z-index: 9999999;
                right: 25%;
                width: 50%;
            }
        }
    }

    .logoutPop {
        z-index: 4000;
    }

    @media screen and (max-width: 1485px) {
        .nav-horizontal {
            .com-logo {
                width: 141px;
                .logoIcon {
                    width: 131px;
                    margin-left: 5px;
                    background-size: 100%;
                    margin-right: 5px;
                }
            }
            .main-nav {
                ul {
                    li {
                        margin: 0 2px 5px;
                        padding: 5px 0 18px;
                        width: 53px;
                        i {
                            width: 25px;
                            height: 25px;
                        }
                    }
                }
            }
            .info-set {
                ul.main-menu {
                    padding-right: 3px;
                    li {
                        width: 38px;
                        &.user {
                            min-width: 180px;
                            padding-right: 5px;
                        }
                        i {
                            margin-right: 0;
                        }
                    }
                }
            }
        }
    }
</style>

<script>
    import api from '@/fetch/api'
    import http from '@/fetch/http'

    export default {
        data() {
            var validateOldPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }

            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                }
                if (!(/^(?=.*\d)(?=.*[a-zA-Z]).{6,10}$/.test(value))) {
                    callback(new Error('必须包含字母和数字，不能使用特殊字符，长度在6~10之间'));
                }
                else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('conPassword');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }

            };
            return {
                checkIdx: 102,
                themeShow: false,
                userInfo: {
                    headerImage: false,
                    headerUrl: localStorage.loginUserHeaderUrl
                },
                visible2: false,
                adminName: '',
                oneMenu: [],
                dialogFormVisible: false,
                ruleForm: {
                    oldPassword: '',
                    password: '',
                    conPassword: '',
                },
                rules: {
                    oldPassword: [
                        {required: true, validator: validateOldPass, trigger: 'blur'}
                    ],
                    password: [
                        {required: true, validator: validatePass, trigger: 'blur'}
                    ],
                    conPassword: [
                        {required: true, validator: validatePass2, trigger: 'blur'}
                    ]

                },
                elAlertShow: false,//提示框是否可显示
                elAlertTitle: 'fqwefq',//提示框文字
                elAlertType: 'success',//提示框类型
            }
        },
        mounted() {
            var currentTopParam = localStorage.topParam//读取缓存中顶部导航
            if (currentTopParam) {
                var evalTop = eval("(" + currentTopParam + ")");
                this.checkIdx = evalTop.topIdx
            }
            this.adminName = localStorage.account ? localStorage.account : '未登录';
            this.getPermission();
            this.$root.Bus.$on('pageToChangeTop', value => {//监听页面跳转事件--非父子组件传值
                this.checkIdx = value;
            })

        },
        methods: {
            gotoIndex() {
                this.checkIdx = 102
                this.$root.Bus.$emit('navChange', 102)//发送事件给左侧导航--非父子组件传值
            },
            getPermission() {//权限
                var self = this;
                let params = {
                    userId: localStorage.userId
                }
                http.axiosGet(api.menu.getPermissionWithMenuList, params,
                    response => {
                        if (response.data.success) {
                            self.oneMenu = response.data.data;
                        } else {
//							self.controlElAlert('操作失败，请重新提交','warning');
                        }
                    })
            },
            clickNav(idx) {//顶部导航切换
                this.checkIdx = idx;
                var topParam = {
                    topIdx: idx
                }
                localStorage.topParam = JSON.stringify(topParam);
                this.$root.Bus.$emit('navChange', idx)//发送事件给左侧导航--非父子组件传值
            },
            changeTheme(theme) {//换肤功能
                var style = theme;
                $("link[title='" + style + "']").removeAttr("disabled");
                $("link[title!='" + style + "']").attr("disabled", "disabled");
//				$.cookie("mystyle",style,{expires:30});
                localStorage.mystyle = style;
                localStorage.styleExpiresDate = 30;
//				$(this).addClass("cur").siblings().removeClass("cur");
            },
            submitForm() {//重置密码
                var self = this;
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        let params = {
                            oldPassword: this.ruleForm.oldPassword,
                            newPassword: this.ruleForm.password,
                            id: localStorage.userId
                        }
                        http.axiosGet(api.user.modifyPassword, params,
                            response => {
                                if (response.data.success) {
                                    self.controlElAlert(response.data.des, 'success');
                                    self.dialogFormVisible = false;
                                    self.resetForm();
                                } else {
                                    self.controlElAlert(response.data.des, 'error');
                                }
                            })
                    } else {
                        return false;
                    }
                });

            },
            resetForm() {
                this.$refs['ruleForm'].resetFields();
                this.dialogFormVisible = false;
            },
            loginOut() {//登出
                this.visible2 = false;
                let params = {}
                http.axiosPost(api.login.logout, params,
                    response => {
                        if (response.data.success) {
                            localStorage.userId = '';
                            localStorage.account = '';
                            localStorage.token = '';
                            localStorage.clear();
                            this.$router.push({path: '/login'})
                        } else {
                            //
                        }
                    })
            },
            logoutClick() {
                setTimeout(() => {
                    $(".logoutPop").css({'z-index': '4000'})
                }, 100)
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
        },
        watch: {
            dialogFormVisible: function (val, oldVal) {
                this.$refs['ruleForm'].resetFields();
            }
        }
    }
</script>
