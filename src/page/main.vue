<template>
    <div class="">
        <el-row class="top-nav">
            <topNav></topNav>
        </el-row>
        <el-row class="main-c">
            <div id="outDiv" v-show="leftShow">
                <el-col class="left-nav" id="left-nav-id" style="border-right: 0px solid #F7F8Fc">
                    <verticalNav></verticalNav>
                </el-col>
            </div>

            <el-col :span="23" class="mainContent">
                <el-row style="padding-bottom:15px;">
                    <router-view v-on:routerChange="getCurrentRouter"></router-view>
                </el-row>
                <el-row>
                    <!--<mainFooter v-if="copyRight"></mainFooter>-->
                </el-row>
            </el-col>
        </el-row>
    </div>

</template>

<script>
    import top from '@/components/Top.vue' //顶部加导航
    import nav from '@/components/Nav.vue' //主页导航
    import foot from '@/components/Footer.vue' //底
    import $ from 'jquery'

    export default {
        components: {
            'topNav': top,
            'verticalNav': nav,
            'mainFooter': foot
        },
        data() {
            return {
                topNav: 6,
                sonNav: '',
                leftShow: true,
                copyRight: true,//是否显示底部版权
            }
        },
        mounted() {
            var self = this;
            self.getWindowSize();
            $(window).resize(function () {
                self.getWindowSize();
                var width = $(document).width() - 142;
                $(".mainContent").css({
                    "width": width,
                    "margin-left": 142
                });
            });

            var width = $(document).width() - 142;
            $(".mainContent").css({
                "width": width,
                "margin-left": 142
            });

            $("#left-nav-id").mouseover(function () {
                $(this).css("overflow-y", "scroll");
            });
            $("#left-nav-id").mouseout(function () {
                $(this).css("overflow-y", "hidden");
            });

            var currentTopParam = localStorage.topParam//读取缓存中顶部导航
            if (currentTopParam) {
                var evalTop = eval("(" + currentTopParam + ")");
                this.topNav = evalTop.topIdx
            }
            this.$root.Bus.$on('navChange', value => {//监听顶部导航点击事件--非父子组件传值
                if (value == '102') {
                    self.leftShow = false;
                } else {
                    self.leftShow = true;
                }

            })
        },
        methods: {
            getWindowSize() {
                var l_h = document.getElementById("left-nav-id").offsetHeight;
                var h = document.documentElement.clientHeight - 81;
                var w = document.documentElement.clientWidth - 142;
//	            $('.left-nav').height(h+'px');
                $('.mainContent').height((h) + 'px').width(w + 'px');
//        $('.mainContent').width(w + 'px');
            },
            getCurrentRouter(val) {
                this.sonNav = val
            }
        },
        watch: {
            '$route': function (val, oldVal) {
                this.copyRight = val.meta.showCopyRight;
            }
        }
    }
</script>

<style lang="less">
    @bc-color: #F7F8Fc;
    * {
        padding: 0;
        margin: 0;
    }

    body {
        background: @bc-color;
    }

    #outDiv {
        position: fixed;
        top: 81px;
        z-index: 2600;
        min-height: 400px;
        background: #273455;
        height: 100%;
        float: left;
        -webkit-transform: translateX(0);
        -ms-transform: translateX(0);
        /*overflow-x: visible;*/
        clear: both;
        width: 142px;
        overflow: hidden;
    }

    #left-nav-id {
        position: fixed;
        /*top: 0;*/
        /*z-index: 9999;*/
        min-height: 400px;
        /*background: #273455;*/
        height: 100%;
        /*float: left;*/
        /*-webkit-transform: translateX(0);*/
        /*-ms-transform: translateX(0);*/
        /*overflow-x: visible;*/
        /*clear: both;*/
    }

    .top-nav {
        height: 81px;
        position: relative;
        z-index: 2699;
    }

    .main-c {
        position: relative;
    }

    .left-nav {
        overflow: hidden;
        width: 162px !important;
        border-right: solid 1px #E4E4E4;
    }

    .mainContent {
        background: @bc-color;
        overflow-y: auto;
        overflow-x: hidden;
        min-width: 1060px;
    }

    .nav-vertical .nav-content ul {
        padding-bottom: 70px;
    }
</style>
