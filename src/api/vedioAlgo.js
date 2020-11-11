import request from '@/utils/request'
import qs from 'qs'

export default {
  // 获取图片接口
  getImageByDeviceId(deviceId) {
    return request({
      url: '/nvsapi/taskInst/snapshot/' + deviceId,
      method: 'get'
    })
  },
  // 获取获取算法列表接口
  getInstanceList(deviceId) {
    return request({
      url: '/nvsapi/taskInst/list/' + deviceId,
      method: 'get'
    })
  },
  // 根据实例id获取历史坐标接口
  getHisInstAreas(id) {
    return request({
      url: '/nvsapi/taskInst/area/' + id,
      method: 'get'
    })
  },
  // 增加修改删除实例配置
  configInstance(val) {
    return request({
      url: '/nvsapi/taskInst/config',
      method: 'post',
      data: val
    })
  }
}
