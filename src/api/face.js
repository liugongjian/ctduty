import request from '@/utils/request'
import qs from 'qs'
import config from '@/config'
const {
  baseUrl: { pro }
} = config

// 获取人脸列表
export function fetchFaceList(query) {
  return request({
    url: '/nvsapi/Userface/QueryActive',
    method: 'post',
    data: query
  })
}
// 添加人脸
export function fetchAddFace(query) {
  return request({
    url: '/nvsapi/Userface/Add',
    method: 'post',
    data: query
  })
}

// 更新
export function fetchUpdateFace(query) {
  return request({
    url: '/nvsapi/Userface/Update',
    method: 'post',
    data: query
  })
}

// 删除
export function fetchDeleteFace(query) {
  return request({
    url: '/nvsapi/Userface/Delete',
    method: 'post',
    data: query
  })
}

// 查询
export function fetchCheckFace(query) {
  return request({
    url: '/nvsapi/Userface/QueryActive',
    method: 'post',
    data: query
  })
}

// 搜索
export function fetchSearchFace(query) {
  return request({
    url: '/nvsapi/Userface/QueryFilter',
    method: 'post',
    data: query
  })
}