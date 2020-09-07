import request from '@/utils/request'
import qs from 'qs'
export function fetchAllData(query) {
  return request({
    url: `http://host31.880508.xyz:10000/Statis/getMonitorStatis`,
    method: 'post',
    params: query
  })
}

// http://host31.880508.xyz:10000/Statis/getRealTimeStatis?token=***
// 监控实时情况
export function fetchNowInfo(query) {
  return request({
    url: `http://host31.880508.xyz:10000/Statis/getRealTimeStatis`,
    method: 'post',
    params: query
  })
}