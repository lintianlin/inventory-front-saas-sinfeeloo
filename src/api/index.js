/**
 * Created by sinfeeloo on 17-7-19.
 */
import {baseUrl, staticUrl} from './local'
// import Vue from 'vue'
import Qs from 'qs'
import axios from 'axios'
// import VueAxios from 'vue-axios'
import store from '../store'
import Lockr from 'lockr'
import api from '@/fetch/api'

axios.defaults.baseURL = baseUrl
axios.defaults.timeout = 1000 * 15
axios.defaults.headers.token = store.getters.getToken
// axios.defaults.headers.authKey = store.getters.getAuthKey
// axios.defaults.headers.sessionId = store.getters.setSessionId

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'

axios.defaults.paramsSerializer = function (params) {
    return Qs.stringify(params)
}
axios.defaults.transformRequest = [function (data) {
    data = Qs.stringify(data)
    return data
}]
axios.defaults.transformResponse = [function (data) {
    let result = JSON.parse(data)
    // 如果登录失效则跳转到登录
    if (result.rc !== 0) {
        // window.location.href = '/#/'
    }
    return result
}]

// 基础地址和静态文件地址
export {baseUrl, staticUrl}

// 登录
export function login(username, password) {
    return new Promise((resolve, reject) => {
        axios.post(api.login.login, {
            account: username,
            password: password
        }).then(res => {
            console.log(res)
            let token = res.data.data.token
            console.log(token)
            console.log(store.getters.getToken)
            axios.defaults.headers.token = token
            store.commit('setToken', token)
            Lockr.set('token', token)
            resolve(res)
        }, res => {
            reject(res)
        })
    })
}


//
// // 获取实时任务列表
// export function getProductLines () {
//   let url = '/realtimetask/getProductLines'
//   return axios.get(url)
// }
// 获取历史任务列表
export function getAllTask(data) {
    let url = '/realtimetask/getAllTask'
    return axios.get(url, {
        params: data
    })
}

// 获取历史任务 添加任务
export function addTask(data) {
    let url = '/realtimetask/allocating'
    return axios.post(url, data)
}

// // 获取历史任务 删除任务
// export function deleteTask (data) {
//   let url = '/realtimetask/deleteTask'
//   return axios.post(url, data)
// }
// // 获取历史任务 详情
// export function taskDetail (data) {
//   let url = '/realtimetask/taskDetail'
//   return axios.get(url, {
//     params: data
//   })
// }
// // 获取历史任务 编辑
// export function editTask (data) {
//   let url = '/realtimetask/editTask'
//   return axios.post(url, data)
// }
// // 获取班组数据
// export function groupData (data) {
//   let url = '/team/getTeams.do'
//   return axios.get(url, {
//     params: data
//   })
// }
// // 获取产品 数据
// export function ProductData (data) {
//   let url = '/product/getProducts.do'
//   return axios.get(url, {
//     params: data
//   })
// }
// // 获取暂停原因
// export function stopReasons (data) {
//   let url = '/reason/searchReason.do'
//   return axios.post(url, data)
// }
// // 获取暂停原因添加
// export function stopReasonsAdd (data) {
//   let url = '/reason/addPauseReason.do'
//   return axios.post(url, data)
// }
// // 获取生产线配置
// export function productionLine () {
//   let url = '/productLine/productionLines.do'
//   return axios.get(url)
// }
// // 添加生产线
// export function addProductLine (data) {
//   let url = '/productLine/addProductLine.do'
//   return axios.post(url, data)
// }
// // 获取单个生产线节点
// export function getNode (id) {
//   let url = '/node/getNodeListByProdId.do?prod_id=' + id
//   return axios.get(url)
// }
// // 获取 新的MAC地址
// export function getMAC () {
//   let url = '/sensor/getNewSensors.do'
//   return axios.get(url)
// }
// // 生产线，添加节点
// export function addNode (data) {
//   let url = '/node/addNode.do'
//   return axios.post(url, data)
// }
// // 生产线，删除节点
// export function delectNode (id) {
//   let url = '/node/delNode.do?node_id=' + id
//   return axios.post(url)
// }
// // 获取通知消息列表
// export function getMessage (title) {
//   let url = '/message/getMessageList?title=' + title
//   return axios.get(url)
// }
// // 获取通知消息列表 添加
// export function MessageAdd (data) {
//   let url = '/message/publicNews'
//   return axios.post(url, data)
// }
// // 获取通知消息列表 删除
// export function MessageDelect (id) {
//   let url = '/message/deleteMessage?id=' + id
//   return axios.post(url, id)
// }
// // 获取通知消息 详情
// // export function MessageDetail (id) {
// //   let url = '/message/getMessageManagementDetail?id=' + id
// //   return axios.get(url, id)
// // }
// // 获取数据分析 折线图
// export function analysis (type) {
//   let url = '/analysis/graph?type=' + type
//   return axios.get(url)
// }
// // 获取数据分析 班组
// export function analysisTeam (type) {
//   let url = '/analysis/team?type=' + type
//   return axios.get(url)
// }
// // 获取数据分析 班组
// export function analysisProduct (type) {
//   let url = '/analysis/productline?type=' + type
//   return axios.get(url)
// }
// /**
//  * 车间接口
//  */
//  // 任务列表
// export function getTasks (data) {
//   let url = '/task/getTasksShowInPlantByPage'
//   return axios.get(url, {
//     params: data
//   })
// }
//  // 任务列表 正在进行
// export function getTasksNow (data) {
//   let url = '/node/getNodeListOnDoingTaskByProdlineId'
//   return axios.get(url, {
//     params: data
//   })
// }
//  // 任务列表 添加任务
// export function addTaskNow (data) {
//   let url = '/task/addTask'
//   return axios.post(url, data)
// }
//  // 任务列表 获取暂停原因
// export function getAllReason (data) {
//   let url = '/reason/getAllPauseReason'
//   return axios.get(url)
// }
//  // 任务列表 操作
// export function operateTask (data) {
//   let url = '/task/operateTask'
//   return axios.post(url, data)
// }
// // 消息列表 接口
// export function getMessageRecord (data) {
//   let url = '/message/getMessageRecordList'
//   return axios.get(url, {
//     params: data
//   })
// }
// // 消息列表详情 接口
// export function getMessageDetail (data) {
//   let url = '/message/getMessageDetail'
//   return axios.get(url, {
//     params: data
//   })
// }
