import request from '@/utils/request'
import qs from 'qs'
import config from '@/config'
const {
  baseUrl: { pro }
} = config

// 添加人脸
export function fetchAddFace(query) {
  return request({
    url: '/nvsapi/Userface/Add',
    method: 'post',
    data: query
  })
}