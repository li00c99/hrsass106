import request from '@/utils/request'

// 获取角色列表
export const getRoleList = params => {
  return request({
    method: 'GET',
    url: '/sys/role',
    params
  })
}

// 获取公司信息
export const getCompany = (id) => {
  return request({
    method: 'get',
    url: `/company/${id}`
  })
}

// 删除角色

export const deleteRole = id => {
  return request({
    method: 'DELETE',
    url: `/sys/role/${id}`
  })
}

// 修改
export function updateRole (data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}
/**
 * 获取角色详情
 * **/
export function getRoleDetail (id) {
  return request({
    url: `/sys/role/${id}`
  })
}

// 添加
export const addRoleDate = data => {
  return request({
    method: 'POST',
    url: '/sys/role',
    data
  })
}
