import request from '@/utils/request'

// 获取所有
export const getDepartments = () => {
  return request({
    method: 'get',
    url: '/company/department'
  })
}
// 删除
export const deleteDepartments = id => {
  return request({
    method: 'DELETE',
    url: `company/department/${id}`
  })
}
// 添加部门
export const addDepartments = data => {
  return request({
    method: 'POST',
    url: '/company/department',
    data
  })
}
// 获取单个部门
export const getTments = id => {
  return request({
    method: 'GET',
    url: `/company/department/${id}`
  })
}
export const editDepartment = data => {
  return request({
    method: 'PUT',
    url: `/company/department/${data.id}`,
    data
  })
}
