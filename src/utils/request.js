import axios from 'axios'
import store from '@/store'
import router from '@/router'
// 引入element\message
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
const Timeout = 3600 // 定义超时时间

const request = axios.create({
  // 开发环境根路径
  baseURL: process.env.VUE_APP_BASE_API,
  // 设置超时时间
  timeout: 50000
})
// 请求拦截
request.interceptors.request.use(config => {
  if (store.getters.token) {
    if (IsCheckTimeOut()) {
      // 证明失效
      store.dispatch('user/logout')
      router.push('/')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截
request.interceptors.response.use(response => {
  //   // 返回的数据axios默认有一层data
  const { success, message, data } = response.data
  // 根据success判断是否响应成功
  if (success) {
    return data // 成功返回数据
  } else {
    Message.error(message)
    return Promise.reject(new Error(message)) // 失败返回Promise对象
  }
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002的时候 表示 后端告诉我token超时了
    store.dispatch('user/logout') // 登出action 删除token
    router.push('/login')
  } else {
    Message.error(error)
  }
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})
// 如果最新时间-登入时间超过了，定义的超时时间那么TOKEN失效
function IsCheckTimeOut () {
  // 获取当前时间
  const currentTime = Date.now()
  var timeStamp = getTimeStamp()
  return (currentTime - timeStamp) / 1000 > Timeout
}

export default request
