import request from '@/utils/request'
import qs from 'qs'
import config from '@/config'
const {
  prefix: { commonPrefix }
} = config

// 人脸子系统
export function fetchFaceList(query) {
  return request({
    url: '/nvsapi/alarm/stat/face',
    params: query
  })
}