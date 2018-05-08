/**
 * Created by sinfeeloo on 18-5-8.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'

Vue.use(Vuex)

const state = {
  authKey: '',
  sessionId: '',
  cart: []
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
