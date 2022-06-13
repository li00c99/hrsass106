import axios from 'axios'
const request = axios.create()
request.interceptors.request.use() // 请求拦截
request.interceptors.response.use() // 响应拦截
export default request
