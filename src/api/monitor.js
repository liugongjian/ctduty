import request from '@/utils/request'

export function fetchAllMonitor(query) {
  return request({
    url: '/devapi/camera/live/query',
    method: 'get',
    data: query
  })
}

export function updateMonitor(data) {
  return request({
    url: `/devapi/camera/live/update/${data.id}/${data.cameraId}`,
    method: 'put',
    data: data
  })
}

export function addMonitor(data) {
  return request({
    url: `/devapi/camera/live/add/${data.cameraId}`,
    method: 'post',
    data: data
  })
}

export function delMonitor(id) {
  return request({
    url: `/devapi/camera/live/delete/${id}`,
    method: 'delete',
  })
}

export function play(cameraId) {
  return request({
    url: `/devapi/camera/live/play/${cameraId}`,
    method: 'post',
  })
}

export function stop(id) {
  return request({
    url: `/devapi/camera/live/stop/${id}`,
    method: 'delete',
  })
}

