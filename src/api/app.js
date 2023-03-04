import request from '@/utils/system/request'


// 登入api
export function loginApi(params) {
  return request({
    url: '/admins/login',
    method: 'post',
    params,
  })
}
// 退出登入Api
export function loginOutApi(params) {
  return request({
    url: '/admins/loginOut',
    method: 'post',
    params,
  })
}
// 獲取用户信息Api
export function getInfoApi(params) {
  return request({
    url: '/admins/info',
    method: 'post',
    params
  })
}
// 新增
export function addAdmin(data) {
  return request({
    url: '/admins/addAdmin',
    method: 'post',
    data,
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
export function passwordChange(data) {
  return request({
    url: '/admins/passwordChange',
    method: 'post',
    data
  })
}