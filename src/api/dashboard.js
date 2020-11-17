import request from '@/utils/request'
import qs from 'qs'
export function fetchAllData(query) {
  return request({
    url: `/nvsapi/Statis/getMonitorStatis`,
    method: 'post',
    params: query
  })
}

// http://host31.880508.xyz:10000/Statis/getRealTimeStatis?token=***
// 监控实时情况
export function fetchNowInfo(query) {
  return request({
    url: `/nvsapi/Statis/getRealTimeStatis`,
    method: 'post',
    params: query
  })
}
export function fetchSinMan(query) {
  return request({
    url: `/nvsapi/Alert/getMyStatis`,
    method: 'post',
    params: query
  })
}
