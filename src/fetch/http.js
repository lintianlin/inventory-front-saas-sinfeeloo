/**
 * Created by sinfeeloo on 2017/9/16 0016.
 * 网络请求工具类
 */
import axios from 'axios'
import utils from './utils'
import $ from 'jquery'
import api from '@/fetch/api'

export default {

  // get请求
  axiosGet(url, params, callback, errorCallback) {
    var newParams = utils.get_data(params)
    var data = ''
    $.each(newParams, function (name, value) {
      data += name + '=' + value + '&'
    })
    data = data.substring(0, data.length - 1)
    // data = data + '&token=' + localStorage.verifyToken;
    var urls = data ? (url + '?' + data) : url
    axios({
      url: urls,
      method: 'get',
      headers: {
        'token': localStorage.token
      }
    }).then(callback).catch(errorCallback)
  },

  // post请求
  axiosPost(url, params, callback, errorCallback) {
    axios({
      url: url,
      method: 'post',
      data: utils.get_data(params),
      transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        // ret += '&token=' + localStorage.verifyToken;
        return ret
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': localStorage.token
      }
    }).then(callback).catch(errorCallback)
  },

  // 导出excel
  exportExcel(url, params) {
    var newParams = utils.get_data(params)
    var data = ''
    $.each(newParams, function (name, value) {
      data += name + '=' + value + '&'
    })
    data = data.substring(0, data.length - 1)
    data = data + '&token=' + localStorage.verifyToken
    var urls = data ? (url + '?' + data) : url
    window.location.href = axios.defaults.baseURL + urls
  },
  getGoodsType(callback) {//获取商品类别，商品类别下拉框
    let params = {
      typeId: 2
    }
    this.axiosGet(api.param.getParamListByPage, params, callback);
  },
  getBrand(callback) {//获取品牌信息
    let params = {
      typeId: 1
    }
    this.axiosGet(api.param.getParamListByPage, params, callback);
  }
}
