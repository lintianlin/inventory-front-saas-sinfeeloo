/**
 * Created by Administrator on 2017/9/15 0015.
 */
var picURL = 'http://192.168.30.47:8087/'
export default {
  login: {
    login: '/user/login', // 登录
    logout: '/user/logout'// 登出
  },
  goods: {
    getGoodsListByPage: 'goods/getGoodsListByPage', // 查询商品列表
    addGoods: 'goods/addGoods', // 添加商品
    modifyGoods: 'goods/modifyGoods', // 修改商品
    deleteGoods: 'goods/deleteGoods', // 删除商品
    getGoodsDetail: 'goods/getGoodsDetail' // 获得商品详情
  },
  storage: {
    getStorageListByPage: 'storage/getStorageListByPage',
    addStorage: 'storage/addStorage',
    modifyStorage: 'storage/modifyStorage',
    deleteStorage: 'storage/deleteStorage',
    getStorageDetail: 'storage/getStorageDetail'
  },
  param: {
    getParamListByPage: 'param/getParamListByPage', // 获取参数列表
    addParam: 'param/addParam', // 添加参数
    modifyParam: 'param/modifyParam',// 修改参数
    deleteParam: 'param/deleteParam', // 删除参数
    getParamTypeList: 'param/getParamTypeList', // 获取参数类型
    getById: 'param/getById' // 获取参数详情
  },
  user: {// 用户管理
    modifyPassword: 'user/modifyPassword',// 修改密码
    getUserListByPage: 'user/getUserListByPage',
    addUser: 'user/addUser',
    modifyUser: 'user/modifyUser',
    deleteUser: 'user/deleteUser',
    operateLockUser: 'user/operateLockUser'

  },
  employee: {// 员工管理
    addEmployee: 'employee/addEmployee',
    getEmployeeListByPage: 'employee/getEmployeeListByPage',
    modifyEmployee: 'employee/modifyEmployee',
    deleteEmployee: 'employee/deleteEmployee',
    getEmployeeDetail: 'employee/getEmployeeDetail',
  },
  supplier:{//供应商管理
    addSupplier:'supplier/addSupplier',
    getSupplierListByPage:'supplier/getSupplierListByPage',
    modifySupplier:'supplier/modifySupplier',
    deleteSupplier:'supplier/deleteSupplier',
    getById:'supplier/getById'
  },
  menu: {// 菜单管理
    getPermissionWithMenuList: '/menu/getMenuList'// 获取用户权限对应的菜单列表
  },
  alyunPicUrl: 'http://sinfeeloo.oss-cn-beijing.aliyuncs.com/images/saas/', // 阿里云图片地址
  pic: {// 图片上传
    baseUrl: picURL,
    uploadPhoto: picURL + 'image/upload', // 图片统一上传
    deletePhoto: 'system/companyphoto/delete'// 图片删除
  }
}
