/**
 * Created by Administrator on 2017/9/15 0015.
 */
var picURL = 'http://192.168.30.47:8010/';
export default {
    login: {
        login: '/user/login',//登录
        logout: '/user/logout'//登出
    },
    index: {

        getSupplierHomePageData: 'system/homePage/getSupplierHomePageData',//查询经销商管理平台首页数据
        getSupplierHomePageChartData: 'system/homePage/getSupplierHomePageChartData',//查询经销商管理平台首页数据
        getSupplierHomePageBacklog: 'system/homePage/getSupplierHomePageBacklog',//待办事项
        save: 'system/evaluate/save',//评价反馈--添加
    },
    user:{//用户管理
        modifyPassword:'user/modifyPassword'//修改密码
    },
    menu:{//菜单管理
        getPermissionWithMenuList:'/menu/getMenuList'//获取用户权限对应的菜单列表
    },
    alyunPicUrl: 'http://sinfeeloo.oss-cn-beijing.aliyuncs.com/images/saas/',//阿里云图片地址
    pic: {//图片上传
        logodeal: picURL + 'system/company/logodeal',//公司Logo
        companyphoto: picURL + 'system/companyphoto/deal',//公司相册批量上传
        customerImagedeal: picURL + 'system/customer/imagedeal',//客户图片上传
        brandLogo: picURL + 'goods/goodsBrand/uploadLogo',//客户图片上传
        uploadPhoto: picURL + 'common/image/uploadToTemp',//图片统一上传-临时文件
        deletePhoto: 'system/companyphoto/delete',//图片删除
    }
}
