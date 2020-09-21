import request from '@/utils/request'
import qs from 'qs'
import config from '@/config'
const {
  baseUrl: { pro }
} = config

// 所有告警信息
export function fetchAllCameraList(query) {
  return request({
    url: '/nvsapi/Camera/QueryActive',
    method: 'post',
    data: query
  })
}