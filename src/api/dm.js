import request from '@/utils/request'
import qs from 'qs'
export function fetchCarList(query) {
  return request({
    url: `/xplocal/CarLicense/QueryActive`,
    method: 'post',
    params: query
  })
}
export function fetchSingleCarData(id) {
  return request({
    url: `/xplocal/CarLicense/Get/${id}`,
    method: 'get'
  })
}
export function addCarData(query) {
  return request({
    url: `/xplocal/CarLicense/Add`,
    method: 'post',
    params: query
  })
}
export function importCarData(query) {
  return request({
    url: `/xplocal/CarLicense/Import`,
    method: 'post',
    params: query
  })
}
export function deleteCarData(query) {
  return request({
    url: `/xplocal/CarLicense/Delete`,
    method: 'post',
    params: query
  })
}
