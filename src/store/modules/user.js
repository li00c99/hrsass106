import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
export default {
  namespaced: true,
  state: {
    // 定义token并却通过缓存中拿到token
    token: getToken(),
    userInfo: {}
  },
  mutations: {
    // 设置token方法
    setToken (state, token) {
      state.token = token // vuex设置token
      setToken(token) // 更新缓存
    },
    // 删除token方法
    removeToken (state) {
      state.token = null // 清楚vuex
      removeToken() // 清空缓存
    },
    // 更新用户信息
    setUserInfo (state, userInfo) {
      state.userInfo = { ...userInfo }
    },
    // 删除用户信息
    removeUserInfo (state) {
      state.userInfo = {}
    }
  },
  actions: {
    // 封装的请求方法
    async login (context, data) {
      const results = await login(data)
      // 由于在响应拦截器中已经做了错误处理，请求成功可以直接拿到成功返回的data的值
      context.commit('setToken', results)
      // 设置一个登入时间
      setTimeStamp()
    },
    // 获取用户资料
    async getUserInfo (context) {
      const result = await getUserInfo()
      const baseInfo = await getUserDetailById(result.userId)
      const baseReult = { ...result, ...baseInfo }
      context.commit('setUserInfo', baseReult)
    },
    logout(context) {
      // 删除token
      context.commit('removeToken')
      // 删除用户资料
      context.commit('removeUserInfo')
    }
  }
}
