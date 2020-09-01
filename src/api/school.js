import request from '@/utils/request'
import qs from 'qs'
import config from '@/config'
const {
  prefix: { commonPrefix }
} = config

// 学校子系统
export function fetchSchoolList(query) {
  return request({
    url: '/nvsapi/alarm/stat/school',
    params: query
  })
}