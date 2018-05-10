import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/page/login.vue'
import main from '@/page/main'

Vue.use(VueRouter)
var routes = [
    {path: '/', meta: {requireAuth: true}, component: main},
    {
        path: '/login',
        component: login
    },
    {
        path: '/main',
        component: main
        // ,
        // children: [
        //     // { path: '/Product-data', component: ProductData, name: 'ProductData' },
        //     {
        //         path: '/main/system/department',
        //         meta: {requireAuth: true, showCopyRight: true},
        //         component: resolve => require(['@/page/main/system/department'], resolve)
        //     },//部门管理
        //     {
        //         path: '/main/system/staff',
        //         meta: {requireAuth: true, showCopyRight: true},
        //         component: resolve => require(['@/page/main/system/staff'], resolve)
        //     }//员工管理
        // ]
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
});
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (localStorage.verifyToken) {  // 通过vuex state获取当前的token是否存在//store.state.token
            next();
        }
        else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由to.fullPath
            })
        }
    }
    else {
        next();
    }
})
export default router;