import request from '@/utils/request'
import qs from 'qs'

export function fetchUserList(query) {
  return request({
    url: 'v1/users',
    method: 'get',
    params: query
  })
}
// 获取用户信息
export function fetchUser() {
  return request({
    url: '/nvsapi/Login/info',
    method: 'get'
  })
}

export function fetchCommunity() {
  return request({
    url: '/nvsapi/alarm/stat/all',
    method: 'get'
  })
}

export function alarmStatus() {
  return request({
    url: '/nvsapi/device/stat',
    method: 'get'
  })
}

// 在线用户列表
export function fetchOnlineList() {
  return request({
    url: '/nvsapi/Login/online'
  })
}

// 强退
export function fetchOnlineLogout(code) {
  return request({
    url: `/nvsapi/Login/logout/${code}`,
    method: 'get'
  })
}

// 查询所有区域
// export function getAreas() {
//   return request({
//     url: `/nvsapi/Area/QueryActive`,
//     method: 'post'
//   })
// }

// 查询所有部门
export function getDepartments() {
  return request({
    url: `/nvsapi/Department/QueryActive`,
    method: 'post'
  })
}

// 查询所有岗位
export function getPosts() {
  return request({
    url: `/nvsapi/Post/QueryActive`,
    method: 'post'
  })
}

// 查询所有权限
export function getPermissions() {
  return request({
    url: `/nvsapi/Permissions/QueryActive`,
    method: 'post'
  })
}

