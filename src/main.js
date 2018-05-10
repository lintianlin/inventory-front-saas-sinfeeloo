// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import echarts from 'echarts'
import './assets/css/public.css'
import store from './store'
// 载入axios
import './api'
// element ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    data: {
        // 空的实例放到根组件下，所有的子组件都能调用
        Bus: new Vue()
    },
    router,
    store,
    template: '<App/>',
    components: { App }
})
