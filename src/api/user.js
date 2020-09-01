import request from '@/utils/request'
import qs from 'qs'

export function fetchUserList(query) {
  return request({
    url: 'v1/users',
    method: 'get',
    params: query
  })
}

export function fetchUser() {
  return request({
    url: '/nvsapi/user/info',
    method: 'get',
  })
}

export function fetchCommunity() {
  return request({
    url: '/nvsapi/alarm/stat/all',
    method: 'get',
  })
}

export function alarmStatus() {
  return request({
    url: '/nvsapi/device/stat',
    method: 'get',
  })
}