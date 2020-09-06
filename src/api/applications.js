import request from '@/utils/request'
import qs from 'qs'
import config from '@/config'
const {
  prefix: { commonPrefix }
} = config

// 所有告警信息
export function fetchAllWarningList(query) {
  return request({
    url: '/nvsapi/alarm/all',
    params: query
  })
}

// 所有操作日志
export function fetchAllOperateList(query) {
  return request({
    url: '/nvsapi/oprecord',
    params: query
  })
}

// 设备列表
export function fetchdeviceList(query) {
  return request({
    url: '/nvsapi/device/list',
    params: query
  })
}

export function fetchOnlineList() {
  return request({
    url: '/nvsapi/Login/online'
  })
}

export function fetchOnlineLogout(query,code) {
  return request({
    url: `/nvsapi/Login/logout/${code}`,
    params: query
  })
}
