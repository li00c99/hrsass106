import request from '@/utils/request'

export const getEmployeeSimple = () => {
  return request({
    method: 'GET',
    url: `/sys/user/simple`
  })
}
