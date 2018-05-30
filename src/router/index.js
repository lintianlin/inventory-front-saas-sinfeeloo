import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/page/login'
import home from '@/page/home'

Vue.use(VueRouter)
var routes = [
  {path: '/', meta: {requireAuth: true}, component: home},
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,

    children: [
      // { path: '/Product-data', component: ProductData, name: 'ProductData' },
      {
        path: '/basicinfo/goods',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/basicinfo/goods'], resolve)
      }, // 商品管理
      {
        path: '/basicinfo/storage',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/basicinfo/storage'], resolve)
      }, // 仓库管理
      {
        path: '/basicinfo/employee',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/basicinfo/employee'], resolve)
      }, // 员工管理
      {
        path: '/basicinfo/param',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/basicinfo/param'], resolve)
      }, // 参数管理
      {
        path: '/basicinfo/addGoods',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/basicinfo/addGoods'], resolve)
      }, // 添加商品
      {
        path: '/basicinfo/addStorage',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/basicinfo/addStorage'], resolve)
      }, // 添加仓库
      {
        path: '/basicinfo/addEmployee',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/basicinfo/addEmployee'], resolve)
      }, // 添加仓库
      {
        path: '/basicinfo/addParam',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/basicinfo/addParam'], resolve)
      },//添加参数
      {
        path: '/purchase/purchaseOrder',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/purchase/purchaseOrder'], resolve)
      }, // 采购单
      {
        path: '/purchase/addPurchaseOrder',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/purchase/addPurchaseOrder'], resolve)
      }, // 添加采购单
      {
        path: '/purchase/supplier',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/purchase/supplier'], resolve)
      }, // 供应商管理
      {
        path: '/purchase/addSupplier',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/purchase/addSupplier'], resolve)
      }, // 添加供应商
      {
        path: '/sales/customer',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/sales/customer'], resolve)
      }, // 客户管理
      {
        path: '/sales/addCustomer',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/sales/addCustomer'], resolve)
      }, // 添加客户
      {
        path: '/sales/salesOrder',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/sales/salesOrder'], resolve)
      }, // 销售订单
      {
        path: '/stock/inventoryLook',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/stock/inventoryLook'], resolve)
      }, // 库存查看
      {
        path: '/stock/purchaseAudit',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/stock/purchaseAudit'], resolve)
      }, // 采购审核
      {
        path: '/stock/salesAudit',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/stock/salesAudit'], resolve)
      }, // 销售审核
      {
        path: '/analysis/purchaseAnalysis',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/analysis/purchaseAnalysis'], resolve)
      }, // 采购统计
      {
        path: '/analysis/salesAnalysis',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/analysis/salesAnalysis'], resolve)
      }, // 销售统计
      {
        path: '/system/menu',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/system/menu'], resolve)
      }, // 菜单管理
      {
        path: '/system/roles',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/system/roles'], resolve)
      }, // 角色管理
      {
        path: '/system/user',
        meta: {requireAuth: true, showCopyRight: true},
        component: resolve => require(['@/page/system/user'], resolve)
      } // 员工管理

    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (localStorage.token) { // 通过vuex state获取当前的token是否存在//store.state.token
      next()
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由to.fullPath
      })
    }
  } else {
    next()
  }
})
export default router
