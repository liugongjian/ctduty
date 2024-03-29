import request from '@/utils/request'
import qs from 'qs'

export function fetchUserList(query) {
  return request({
    url: '/nvsapi/User/QueryActive',
    method: 'post',
    data: query
  })
}

export function fetchAreaList(query) {
  return request({
    url: '/nvsapi/Area/QueryActive',
    method: 'post',
    data: query
  })
}

export function fetchPoliceList(query) {
  return request({
    url: '/nvsapi/PoliceStation/QueryActive',
    method: 'post',
    data: query
  })
}

export function postAddUser(query) {
  return request({
    url: '/nvsapi/User/Add',
    method: 'post',
    data: query
  })
}

export function addPolice(query) {
  return request({
    url: '/nvsapi/PoliceStation/Add',
    method: 'post',
    data: query
  })
}

export function getUserInfo(id) {
  return request({
    url: `/nvsapi/User/Get/${id}`,
    method: 'get'
  })
}

export function updateUser(query) {
  return request({
    url: '/nvsapi/User/Update',
    method: 'post',
    data: query
  })
}

export function deleteUser(ids) {
  return request({
    url: '/nvsapi/User/Delete',
    method: 'post',
    data: ids
  })
}

export function getCountryNull() {
  return request({
    url: '/nvsapi/Area/QueryTree',
    method: 'post',
    data: {}
  })
}

export function getCountry(query) {
  return request({
    url: '/nvsapi/Area/QueryTree',
    method: 'post',
    data: query
  })
}

export function addCountry(ids) {
  return request({
    url: '/nvsapi/Area/Add',
    method: 'post',
    data: ids
  })
}

export function deleteCountry(ids) {
  return request({
    url: '/nvsapi/Area/Delete',
    method: 'post',
    data: ids
  })
}

export function searchCountry(ids) {
  return request({
    url: '/nvsapi/Area/QueryFilter',
    method: 'post',
    data: ids
  })
}

export function getPolice(ids) {
  return request({
    url: '/nvsapi/PoliceStation/QueryActive',
    method: 'post',
    data: ids
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
    method: 'post',
    data: {}
  })
}

// 查询所有岗位
export function getPosts() {
  return request({
    url: `/nvsapi/Post/QueryActive`,
    method: 'post',
    data: {}
  })
}

// 查询所有权限
export function getPermissions() {
  return request({
    url: `/nvsapi/Permissions/QueryActive`,
    method: 'post',
    data: {}
  })
}

export function checkIfExist(value) {
  return request({
    url: `/nvsapi/User/exist/username?username=${value}`,
    method: 'get'
  })
}
