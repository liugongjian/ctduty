import request from '@/utils/request'
import qs from 'qs'
import config from '@/config'
const {
  prefix: { commonPrefix }
} = config

// 所有告警信息
export function fetchAllCameraList(query) {
  return request({
    url: 'http://192.168.30.26:10000/Camera/QueryActive',
    method: 'post',
    data: query
  })
}
