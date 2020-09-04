import request from '@/utils/request'
import qs from 'qs'

export function fetchUserList(query) {
  return request({
    url: '/nvsapi/User/QueryActive',
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