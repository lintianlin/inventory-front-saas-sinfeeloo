/**
 * Created by sinfeeloo on 18-5-8.
 */
import Lockr from 'lockr'
export const getToken = function (state) {
  if (!state.token) {
    state.token = Lockr.get('token')
  }
  return state.token ? state.token : ''
}
export const getId = function (state) {
  if (!state.id) {
    state.id = Lockr.get('id')
  }
  return state.id ? state.id : ''
}
// export const getSessionId = function (state) {
//   if (state.sessionId === '') {
//     state.sessionId = window.plus ? window.plus.storage.getItem('sessionId') : window.localStorage.getItem('sessionId')
//   }
//   return state.sessionId ? state.sessionId : ''
// }
// export const getCart = function (state) {
//   if (state.cart.length === 0) {
//     state.cart = JSON.parse(window.sessionStorage.getItem('cart'))
//   }
//   return state.cart ? state.cart : []
// }
