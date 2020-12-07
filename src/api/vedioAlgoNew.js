import request from '@/utils/request'
import qs from 'qs'

// 获取图片接口
export function getImageByDeviceId(deviceId) {
  return request({
    url: '/nvsapi/taskInst/snapshot/' + deviceId,
    method: 'get'
  })
}
// 获取获取算法列表接口
export function getInstanceList(deviceId) {
  return request({
    url: '/nvsapi/taskInst/list/' + deviceId,
    method: 'get'
  })
}
// 根据实例id获取历史坐标接口
export function getHisInstAreas(id) {
  return request({
    url: '/nvsapi/taskInst/area/' + id,
    method: 'get'
  })
}
// 增加修改删除实例配置
export function configInstance(val) {
  return request({
    url: '/nvsapi/taskInst/config',
    method: 'post',
    data: val
  })
}

// 获取视频监控页面该摄像头可筛选算法
export function getAlgoSelList(id) {
  return request({
    url: `/nvsapi/Statis/${id}/taskList`,
    method: 'get'
  })
}
