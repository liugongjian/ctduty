import request from '@/utils/request'
import qs from 'qs'

export function getPoliceList(query) {
  return request({
    url: '/nvsapi/PoliceStation/QueryActive',
    method: 'post',
    data: query
  })
}

export function filterPoliceList(query) {
  return request({
    url: '/nvsapi/PoliceStation/QueryFilter',
    method: 'post',
    data: query
  })
}
//

export function addPolice(query) {
  return request({
    url: '/nvsapi/PoliceStation/Add',
    method: 'post',
    data: query
  })
}
//

export function updatePolice(query) {
  return request({
    url: '/nvsapi/PoliceStation/Update',
    method: 'post',
    data: query
  })
}

export function deletePolice(query) {
  return request({
    url: '/nvsapi/PoliceStation/Delete',
    method: 'post',
    data: query
  })
}

