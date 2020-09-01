import request from '@/utils/request'
import qs from 'qs'

export function getVehicleTraffic(deviceNum) {
  return request({
    url: `/nvsapi/traffic/vehicle/${deviceNum}`,
    method: 'get'
  })
}

export function getHumanTraffic(deviceNum) {
  return request({
    url: `/nvsapi/traffic/human/${deviceNum}`,
    method: 'get'
  })
}

