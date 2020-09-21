import request from '@/utils/request'
import qs from 'qs'
export function fetchCarList(query) {
  return request({
    url: `/nvsapi/CarLicense/QueryActive`,
    method: 'post',
    data: query
  })
}
export function fetchSingleCarData(id) {
  return request({
    url: `/nvsapi/CarLicense/Get/${id}`,
    method: 'get'
  })
}
export function addCarData(query) {
  return request({
    url: `/nvsapi/CarLicense/Add`,
    method: 'post',
    data: query
  })
}
export function importCarData(query) {
  return request({
    url: `/nvsapi/CarLicense/Import`,
    method: 'post',
    data: query
  })
}
export function deleteCarData(query) {
  return request({
    url: `/nvsapi/CarLicense/Delete`,
    method: 'post',
    data: query
  })
}
// UploadImage
export function uploadImage(query) {
  return request({
    url: `/nvsapi/Userface/UploadImage`,
    method: 'post',
    data: query
  })
}
// UploadMultiImage
export function uploadMultiImage(query) {
  return request({
    url: `/nvsapi/Userface/UploadMultiImage`,
    method: 'post',
    data: query
  })
}
