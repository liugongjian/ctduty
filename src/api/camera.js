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

// 支持模糊查询
export function searchCameraList(query) {
  return request({
    url: '/nvsapi/Camera/QueryFilter',
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

// 算法列表
export function taskList(query) {
  return request({
    url: '/nvsapi/task/QueryActive',
    method: 'post',
    data: query
  })
}

// 新增算法
export function addTask(query) {
  return request({
    url: '/nvsapi/taskInst/add',
    method: 'post',
    data: query
  })
}

// 查询单个摄像头算法
export function getTask(id) {
  return request({
    url: `/nvsapi/taskInst/list/${id}`,
    method: 'get'
  })
}

// 删除算法
export function delTask(id) {
  return request({
    url: `/nvsapi/taskInst/delete?id=${id}`,
    method: 'delete'
  })
}
