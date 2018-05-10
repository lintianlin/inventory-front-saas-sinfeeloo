<template>
    <div class="nav-vertical">
        <div class="nav-l-bg" v-bind:style="{'min-height':minH+'px','max-height':maxH+'px',height:H+'px'}"></div>
        <div class="nav-content">
            <ul id="nav-content-h">
                <li v-for="one in oneMenu" v-show="checkedIndex==one.id">
                    <div class="son-nav" v-for="two in one.children">
                        <a class="group-title">
                            <!--<i class="eliconfont" :class="[two.menuIcon]"></i>-->
                            <i class="beforeLine"></i>
                            {{two.name}}</a>
                        <router-link v-for="three in two.children" class="son-nav nav-text" :key="three.id"
                                     :class="{'checked':checkedSon==three.id}"
                                     @click.native="checkedSonFun(three.id,three.url,three)"
                                     :to="three.url+'?nav='+three.id">{{three.menuName}}
                        </router-link>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<style lang="less">
    .nav-vertical {
        width: 100%;
        height: 100%;
        font-size: 14px;
        overflow: hidden;
        color: #ffffff;
        .nav-l-bg {
            background: #273455;
            width: 140px;
            height: auto;
        }
        .nav-content {
            position: absolute;
            top: 0;
            left: 0;
            ul {
                li {
                    display: block;
                    a {
                        display: block;
                        text-decoration: none;
                        height: 46px;
                        line-height: 46px;
                        position: relative;
                    }
                    div.son-nav {
                        width: 105px;
                        a {
                            width: 100%;
                            padding-left: 35px;
                            text-align: left;
                            &.group-title {
                                color: #ffffff;
                                transform: translateX(-23px);
                                .beforeLine {
                                    display: inline-block;
                                    width: 3px;
                                    height: 13px;
                                    background: red;
                                    border-radius: 1px;
                                    transform: translateY(1px);
                                    margin-right: 3px;
                                }
                            }

                        }
                    }
                }
            }
        }
    }

    .eliconfont {
        margin-right: 4px;
    }

</style>
<script>
    import api from '@/fetch/api'
    import http from '@/fetch/http'
    import $ from 'jquery'

    export default {
        data() {
            return {
                oneMenu: [],
                minH: 700,
                maxH: 2500,
                H: 800,
                checkedIndex: 102, //顶部大导航索引
                checkedSon: 104   //左侧子导航索引
            }
        },
        mounted() {
            var self = this;
            var currentNavParam = localStorage.navParam//读取缓存中左侧导航
            if (currentNavParam) {
                var evalNav = eval("(" + currentNavParam + ")")
                this.checkedSon = evalNav.navIdx;
                self.$router.push({path: evalNav.navUrl + '?nav=' + this.checkedSon})
            }
            var currentTopParam = localStorage.topParam//读取缓存中顶部导航
            if (currentTopParam) {
                var evalTop = eval("(" + currentTopParam + ")")
                this.checkedIndex = evalTop.topIdx;
            }
            self.getWindowSize();
            $(window).resize(function () {
                self.getWindowSize();
            });
            self.getPermission();
            this.$root.Bus.$on('navChange', value => {//监听顶部导航点击事件--非父子组件传值
                this.checkedIndex = value;
                this.getWindowSize(value)
                this.getFirstPage(value)
            })
            this.$root.Bus.$on('pageToChangeLeft', value => {//监听页面跳转事件--非父子组件传值
                this.checkedIndex = value[0];
                this.checkedSon = value[1]
            })
        },
        methods: {
            getFirstPage(val) {//顶部导航切换，左侧菜单默认打开第一个
                var self = this;
                self.oneMenu.forEach((item, i) => {
                    if (val == item.id) {
                        var navArr = [];
                        var navParam = {
                            navIdx: item.children[0].children[0].id,
                            navUrl: item.children[0].children[0].url,
                        }
                        navArr.push(navParam)
                        localStorage.navParam = JSON.stringify(navParam);//存入缓存，记录上次打开的页面，以备下次进来时默认打开
                        self.checkedSon = item.children[0].children[0].id;
                        self.$router.push({path: item.children[0].children[0].url + '?nav=' + self.checkedSon})
                    }
                })
            },
            getWindowSize() {
                var h = document.documentElement.clientHeight - 61;
                this.H = 46 * 18;
                this.minH = h;
            },
            checkedSonFun(idx, url, item) {
                var self = this;
                this.checkedSon = idx;
                var navArr = [];
                var navParam = {
                    navIdx: idx,
                    navUrl: url,
                }
                navArr.push(navParam)
                localStorage.navParam = JSON.stringify(navParam);
                this.$root.Bus.$emit('ListenToNav', navArr)//发送事件给页面--目前未用--非父子组件传值（示例--销售订单--备用）
            },
            getPermission: function () {//权限
                var self = this;
                let params = {
                    companyId: localStorage.companyID
                }
                http.axiosGet(api.menu.getPermissionWithMenuList, params,
                    response => {
                        if (response.data.rc === 200) {//查询成功
                            self.oneMenu = response.data.data;
                        } else {
//							self.controlElAlert('操作失败，请重新提交','warning');
                        }
                    })
            },
        },
        beforeDestroy() {
            this.$root.Bus.$off('navChange')//监听顶部导航点击事件--非父子组件传值--销毁
        },
    }
</script>
