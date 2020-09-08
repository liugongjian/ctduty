import request from '@/utils/request'
import qs from 'qs'
import config from '@/config'
const {
  prefix: { commonPrefix }
} = config

// 所有告警信息
export function fetchAllCameraList(query) {
  return request({
    url: '/nvsapi/Camera/QueryActive',
    method: 'post',
    data: query
  })
}

// 编辑摄像头信息
export function editCamera(query) {
  return request({
    url: '/nvsapi/Camera/Update',
    method: 'post',
    data: query
  })
}

// 新增摄像头信息
export function addCamera(query) {
  return request({
    url: '/nvsapi/Camera/Add',
    method: 'post',
    data: query
  })
}

// 删除摄像头信息
export function delCamera(query) {
  return request({
    url: '/nvsapi/Camera/Delete',
    method: 'post',
    data: query
  })
}

