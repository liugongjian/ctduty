import request from '@/utils/request'
import qs from 'qs'
import config from '@/config'
const {
  prefix: { commonPrefix }
} = config

// 工厂子系统
export function fetchFactoryList(query) {
  return request({
    url: '/nvsapi/alarm/stat/factory',
    params: query
  })
}