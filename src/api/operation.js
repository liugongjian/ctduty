import request from '@/utils/request'
import qs from 'qs'

// 所有操作日志
export function fetchAllOperateList(query) {
  return request({
    url: '/nvsapi/oprecord',
    params: query
  })
}

// 添加操作日志
export function addOprecord(data) {
  return request({
    url: '/nvsapi/oprecord',
    method: 'post',
    data: qs.stringify(data)
  })
}

