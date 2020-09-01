import request from '@/utils/request'
import qs from 'qs'
import config from '@/config'
const {
  prefix: { commonPrefix }
} = config

// 车辆子系统
export function fetchCarList(query) {
  return request({
    url: '/nvsapi/alarm/stat/vehicle',
    params: query
  })
}