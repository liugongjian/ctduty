import request from '@/utils/request'
import qs from 'qs'

export function fetchVehicleSnap(deviceNum, query) {
  return request({
    url: `/nvsapi/capture/vehicle/${deviceNum}`,
    method: 'get',
    params: query
  })
}

export function fetchFaceSnap(deviceNum, query) {
  return request({
    url: `/nvsapi/capture/face/${deviceNum}`,
    method: 'get',
    params: query
  })
}

export function fetchSchoolSnap(deviceNum, query) {
  return request({
    url: `/nvsapi/capture/school/${deviceNum}`,
    method: 'get',
    params: query
  })
}

export function fetchFactorySnap(deviceNum, query) {
  return request({
    url: `/nvsapi/capture/factory/${deviceNum}`,
    method: 'get',
    params: query
  })
}

export function fetchCommunitySnap(deviceNum, query) {
  return request({
    url: `/nvsapi/capture/community/${deviceNum}`,
    method: 'get',
    params: query
  })
}

