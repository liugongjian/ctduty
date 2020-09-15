import request from '@/utils/request'

export function fetchAllMonitor(query) {
  return request({
    url: '/nvsapi2/Camera/QueryActive',
    method: 'get',
    data: query
  })
}

export function updateMonitor(data) {
  return request({
    url: '/nvsapi2/Camera/Update',
    method: 'post',
    data: data
  })
}

export function addMonitor(data) {
  return request({
    url: '/nvsapi2/Camera/Add',
    method: 'post',
    data: data
  })
}

export function delMonitor(query) {
  return request({
    url: '/nvsapi2/Camera/Delete',
    method: 'post',
    data: query
  })
}

