import request from '@/utils/request'
import qs from 'qs'

export function getDeviceSystemInfo() {
  return request({
    url: '/nvsapi/device/systemInfo',
    method: 'get',
  })
}

export function getDeviceStatus() {
  return request({
    url: '/nvsapi/device/stat',
    method: 'get',
  })
}

export function captureUpload(data) {
  return request({
    url: '/nvsapi/device/frameCut',
    method: 'post',
    data: qs.stringify(data)
  })
}


export function getliveStream(deviceNum, data) {
  return request({
    url: `/nvsapi/device/play/${deviceNum}`,
    method: 'post',
    data: qs.stringify(data)
  })
}
