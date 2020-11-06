import request from '@/utils/request'

// 算法列表
export function taskList(query) {
  return request({
    url: '/nvsapi/task/QueryActive',
    method: 'post',
    data: query
  })
}

export function videoListByAlgorithmId(id) {
  return request({
    url: `/nvsapi/taskInst/devices/${id}`,
    method: 'get'
  })
}

// 查询摄像头
export function getCameraList(query) {
  return request({
    url: 'nvsapi/Camera/QueryFilter',
    method: 'post',
    data: query
  })
}
