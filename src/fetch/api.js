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
  param: {
    getParamListByPage: 'param/getParamListByPage' // 获取参数列表
  },
  user: {// 用户管理
    modifyPassword: 'user/modifyPassword'// 修改密码
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
