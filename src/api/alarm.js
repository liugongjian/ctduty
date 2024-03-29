import request from '@/utils/request'
import qs from 'qs'
export function fetchOldVehicle(deviceNum, query) {
  return request({
    url: `/nvsapi/alarm/vehicle/${deviceNum}`,
    method: 'get',
    params: query
  })
}
export function fetchOldSchool(deviceNum, query) {
  return request({
    url: `/nvsapi/alarm/school/${deviceNum}`,
    method: 'get',
    params: query
  })
}
export function fetchOldFactory(deviceNum, query) {
  return request({
    url: `/nvsapi/alarm/factory/${deviceNum}`,
    method: 'get',
    params: query
  })
}
export function fetchOldCommunity(deviceNum, query) {
  return request({
    url: `/nvsapi/alarm/community/${deviceNum}`,
    method: 'get',
    params: query
  })
}

export function fetchOldFace(deviceNum, query) {
  return request({
    url: `/nvsapi/alarm/face/${deviceNum}`,
    method: 'get',
    params: query
  })
}
export function fetchAll(query) {
  return request({
    url: '/nvsapi/alarm/all',
    method: 'get',
    params: query
  })
}

export function fetchVehicle(deviceNum, query) {
  return request({
    url: `/nvsapi/alarm/snapshots/vehicle/${deviceNum}`,
    method: 'get',
    params: query
  })
}

export function fetchSchool(deviceNum, query) {
  return request({
    url: `/nvsapi/alarm/snapshots/school/${deviceNum}`,
    method: 'get',
    params: query
  })
}

export function fetchFactory(deviceNum, query) {
  return request({
    url: `/nvsapi/alarm/snapshots/factory/${deviceNum}`,
    method: 'get',
    params: query
  })
}

export function fetchCommunity(deviceNum, query) {
  return request({
    url: `/nvsapi/alarm/snapshots/community/${deviceNum}`,
    method: 'get',
    params: query
  })
}

export function fetchFace(deviceNum, query) {
  return request({
    url: `/nvsapi/alarm/snapshots/face/${deviceNum}`,
    method: 'get',
    params: query
  })
}

export function fetchWeek() {
  return request({
    url: '/nvsapi/alarm/stat/community',
    method: 'get'
  })
}

export function fetchType() {
  return request({
    url: '/nvsapi/Alert/type',
    method: 'get'
  })
}

export function alarmImg(id) {
  return '/nvsapi' + '/image/' + id
}

export function alarmStatus() {
  return '/nvsapi/device/stat'
}

export function pushSet(form) {
  return request({
    url: '/nvsapi/Setting/Update',
    method: 'post',
    data: [{
      id: 3275166382090240,
      setting: JSON.stringify(form)
    }]
  })
}
export function getPushSet() {
  return request({
    url: '/nvsapi/Setting/Get/3275166382090240',
    method: 'get'
  })
}

export function getAlertInfos(query) {
  return request({
    url: '/nvsapi/Alert/QueryFilter',
    method: 'post',
    data: query
  })
}
export function deleteAlertInfo(query) {
  return request({
    url: '/nvsapi/Alert/Delete',
    method: 'post',
    data: query
  })
}
export function notifyState(query) {
  return request({
    url: '/nvsapi/Alert/Update',
    method: 'post',
    data: query
  })
}

export function getAllTotal(query) {
  return request({
    url: '/nvsapi/Alert/queryTimeBetween',
    method: 'post',
    data: query
  })
}

export function fetchalarmList(query) {
  return request({
    url: '/nvsapi/Alert/QueryFilter',
    method: 'post',
    data: query
  })
}

export function fetchNormalStatus(id, state) {
  return request({
    url: `/nvsapi/Alert/UpdateState?id=${id}&state=${state}`,
    method: 'post'
  })
}
