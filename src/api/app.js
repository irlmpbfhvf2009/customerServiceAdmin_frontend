import request from '@/utils/system/request'

// 新增
export function addAdmin(data) {
  return request({
    url: '/admins/addAdmin',
    method: 'post',
    data
  })
}
// 查詢
export function getAllAdmins(params) {
  return request({
    url: '/admins/getAllAdmins',
    method: 'post',
    params,
  })
}
// 編輯
export function updateAdmin(data) {
  return request({
    url: '/admins/updateAdmin',
    method: 'post',
    data,
  })
}

// 删除
export function delAdmin(data) {
  return request({
    url: '/admins/delAdmin',
    method: 'post',
    data
  })
}