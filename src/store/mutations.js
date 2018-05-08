/**
 * Created by sinfeeloo on 18-5-8.
 */
import Lockr from 'lockr'
export const setToken = function (state, value) {
  Lockr.set('token', value)
  state.token = value
}
export const setId = function (state, value) {
  Lockr.set('id', value)
  state.id = value
}
// export const setSessionId = function (state, value) {
//   if (window.plus) {
//     window.plus.storage.setItem('sessionId', value)
//   } else {
//     window.localStorage.setItem('sessionId', value)
//   }
//   state.sessionId = value
// }
// 设置购物车
// export const setCart = function (state, value) {
//   window.sessionStorage.setItem('cart', JSON.stringify(value))
//   state.cart = value
// }
