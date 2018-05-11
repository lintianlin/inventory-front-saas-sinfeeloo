import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types'

Vue.use(Vuex)
// localStorage.userid = '59081bbf8b871';
// localStorage.name = 'admin';
// localStorage.verifyToken = '';
// localStorage.companyID='2';
const store = new Vuex.Store({
  // 定义状态
  state: {
    companyID: localStorage.companyID,
    name: localStorage.name,
    token: localStorage.verifyToken
  },
  mutations: {
    [types.LOGIN]: (state, data) => {
      localStorage.token = data
      state.token = data
    },
    [types.LOGOUT]: (state) => {
      localStorage.removeItem('token')
      state.token = null
    },
    [types.TITLE]: (state, data) => {
      state.title = data
    }
  }
})

export default store
