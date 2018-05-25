<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
  <div>
    <el-container>
      <el-header>
        <img src="../assets/images/logo.png">
        <h2>华森进销存系统</h2>
        <div class="top_right">
          <img src="../assets/images/head.png">
          <span>{{userName}}</span>
          <p>
          <img src="../assets/images/edit.png">
          <span class="eliconfont elicon-power" v-popover:popover @click="logoutClick">退出</span>
          </p>
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
        </div>
      </el-header>
      <el-container id='content'>
        <el-aside class="text-l" width="200px">
          <el-row class="tac">
            <el-menu
              class="el-menu-vertical" @open="handleOpen" @close="handleClose" :router=true>
              <el-submenu :index="one.id.toString()" :key="one.id" v-for="one in oneMenu" >
                <template slot="title">
                  <img v-bind:src="one.icon"/>
                  <span>{{one.name}}</span>
                </template>
                <el-menu-item :index="two.id.toString()" :key="one.id+'-'+two.id" :route="two.path"
                              v-for="two in one.children">
                  {{two.name}}
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-row>
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
          <!--<el-footer>CopyRight @ 极优智能 2017</el-footer>-->
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import api from '@/fetch/api'
  import http from '@/fetch/http'

  export default {
    data() {
      return {
        userName: localStorage.account,
        imgSrc: require('../assets/images/menu_left2.png'),
        oneMenu: [],
        visible2: false,
        screenHeight: document.documentElement.clientHeight,
        checkedIndex: 102, //顶部大导航索引
        checkedSon: 104   //左侧子导航索引
      }
    },
    mounted() {
      var self = this;

      self.userName = localStorage.account;
      console.log("初始化-mounted"+localStorage.account);
      document.getElementById('content').style.minHeight = this.screenHeight - 60 + 'px';
      var currentNavParam = localStorage.navParam;//读取缓存中左侧导航
      console.log("缓存中的导航" + currentNavParam);
      //从本地缓存中获取
      if (currentNavParam) {
        var evalNav = eval("(" + currentNavParam + ")");
        console.log("当前导航参数" + evalNav);
        this.checkedSon = evalNav.navIdx;
        self.$router.push({path: evalNav.navUrl + '?nav=' + this.checkedSon})
      }
      self.getWindowSize();
      $(window).resize(function () {
        self.getWindowSize();
      });
      //访问网络请求
      self.getPermission();
      this.$root.Bus.$on('navChange', value => {//监听顶部导航点击事件--非父子组件传值
        this.checkedIndex = value;
        this.getWindowSize(value);
        console.log("点击事件：" + value);
        this.getFirstPage(value);
      })
      this.$root.Bus.$on('pageToChangeLeft', value => {//监听页面跳转事件--非父子组件传值
        this.checkedIndex = value[0];
        this.checkedSon = value[1]
      })
    },
    methods: {
      handleOpen(key, keyPath) {
        // console.log(key, keyPath)
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath)
      },
      getFirstPage(val) {//顶部导航切换，左侧菜单默认打开第一个
        var self = this;
        self.oneMenu.forEach((item, i) => {
          if (val == item.id) {
            var navArr = [];
            var navParam = {
              navIdx: item.children[0].id,
              navUrl: item.children[0].path,
            }
            console.log(item.children[0].id + '====' + item.children[0].path)
            navArr.push(navParam)
            localStorage.navParam = JSON.stringify(navParam);//存入缓存，记录上次打开的页面，以备下次进来时默认打开
            self.checkedSon = item.children[0].id;
            self.$router.push({path: item.children[0].path + '?nav=' + self.checkedSon})
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
          userId: localStorage.userId
        }
        console.log("用户id：" + params.userId);
        http.axiosGet(api.menu.getPermissionWithMenuList, params,
          response => {
            if (response.data.rc === 200) {//查询成功
              console.log("查询结果！" + response.data.data[0].icon);
              self.oneMenu = response.data.data;
            } else {
//							self.controlElAlert('操作失败，请重新提交','warning');
            }
          })
      },
      loginOut() {//登出
        this.visible2 = false;
        let params = {}
        http.axiosPost(api.login.logout, params,
          response => {
            if (response.data.rc === 200) {
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
      }
    },
    beforeDestroy() {
      this.$root.Bus.$off('navChange')//监听顶部导航点击事件--非父子组件传值--销毁
    }


  }
</script>

<style lang='less'>
  body {
    margin: 0;
  }

  .el-submenu .el-menu-item {
    padding-left: 62px !important;
  }

  .el-menu {
    border-right: 0px;
  }

  .el-header, .el-footer {
    background-color: #2E3337;
    color: #fff;
    line-height: 60px;
  }

  .el-aside {
    background: #fff;
  }


  .el-footer {
    background-color: #ffffff;
  }

  .el-header {
    padding: 0 !important;
  }

  .el-header img {
    margin: 0;
    padding: 0;
    width: 200px;
    float: left;
  }

  .el-header h2, .el-header p {
    display: inline-block;
    margin: 0;
    line-height: 60px;
    float: left;
    margin-left: 15px;
    letter-spacing: 3px;
  }

  .el-header .top_right {
    float: right;
    margin-right: 30px;
  }

  .el-header .top_right > img {
    width: auto;
    margin-top: 19px;
    margin-right: 10px;
  }

  .el-header .top_right p {
    float: none;
    border-left: 1px solid #999;
    padding-left: 14px;
    margin-top: 15px;
    height: 30px;
    cursor: pointer;
  }

  .el-header .top_right p img {
    width: auto;
    margin-top: 8px;
    margin-right: 8px;
  }

  .eliconfont {
    margin-right: 4px;
  }

  .el-header .top_right p span {
    line-height: 30px;
  }

  .el-header .top_right span {
    display: inline-block;
    line-height: 60px;
    float: left;
  }

  .el-container {
    background-color: #f3f3f5;
  }
</style>
