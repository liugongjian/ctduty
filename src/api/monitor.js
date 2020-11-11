import request from '@/utils/request'

export function fetchAllMonitor(query) {
  return request({
    url: '/nvsapi/camera/live/query',
    method: 'get',
    data: query
  })
}

export function updateMonitor(data) {
  return request({
    url: `/nvsapi/camera/live/update/${data.id}/${data.cameraId}`,
    method: 'put',
    data: data
  })
}

export function addMonitor(data) {
  return request({
    url: `/nvsapi/camera/live/add/${data.cameraId}`,
    method: 'post',
    data: data
  })
}

export function delMonitor(id) {
  return request({
    url: `/nvsapi/camera/live/delete/${id}`,
    method: 'delete'
  })
}

export function play(cameraId) {
  return request({
    url: `/nvsapi/camera/live/play/${cameraId}`,
    method: 'post'
  })
}

export function stop(id) {
  return request({
    url: `/nvsapi/camera/live/stop/${id}`,
    method: 'delete'
  })
}

export function loadingImg() {
  return request({
    url: `/nvsapi/camera/live/image`,
    // url: `http://192.168.50.152:10001/camera/live/image`,
    method: 'get'
  })
}
