import request from '@/utils/request'
import qs from 'qs'
import config from '@/config'
const {
  prefix: { commonPrefix }
} = config

// 社区子系统
export function fetchCommunityList(query) {
  return request({
    url: '/nvsapi/alarm/stat/community',
    params: query
  })
}