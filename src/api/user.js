import request from '@/utils/request'

// 封装的登入请求
export function login (data) {
  return request({
    method: 'post',
    url: '/sys/login',
    data
  })
}

export function getUserInfo () {
  return request({
    method: 'post',
    url: '/sys/profile'
  })
}

export function getUserDetailById (id) {
  return request({
    method: 'GET',
    url: `/sys/user/${id}`
  })
}

