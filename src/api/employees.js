import request from '@/utils/request'

export const getEmployeeSimple = () => {
  return request({
    method: 'GET',
    url: `/sys/user/simple`
  })
}

// 获取员工列表信息
export const getEmployeesList = params => {
  return request({
    method: 'GET',
    url: '/sys/user',
    params
  })
}

// 删除
export const delEmployee = id => {
  return request({
    method: 'DELETE',
    url: `/sys/user/${id}`
  })
}

// 新增员工
export const addEmployee = data => {
  return request({
    method: 'POST',
    url: '/sys/user',
    data
  })
}
// 批量
export const importEmployee = data => {
  return request({
    method: 'POST',
    url: '/sys/user/batch',
    data
  })
}

// 保存员工信息
export const saveUserDetailById = data => {
  return request({
    method: 'PUT',
    url: `/sys/user/${data.id}`,
    data
  })
}

// 获取用户详情的基础信息
export const getPersonalDetail = id => {
  return request({
    method: 'GET',
    url: `/employees/${id}/personalInfo`
  })
}


/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}


/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}


/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

/** *
 * 给用户分配角色
 * ***/
export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put'
  })
}