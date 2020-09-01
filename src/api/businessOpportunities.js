import request from '@/utils/request'
import qs from 'qs'
import config from '@/config'
const {
  prefix: { commonPrefix }
} = config
// 首页的获取列表数据接口
export function fetchBusinessList(query) {
  return request({
    url: commonPrefix + '/v1/businessOpportunities',
    method: 'get',
    params: query
  })
}

// 首页和编辑页的获取类型数据接口
export function fetchBusinessType(params) {
  return request({
    url: commonPrefix + '/v1/businessOpportunities/categoryList',
    method: 'get',
    params: params
  })
}

// 根据首页的流程ID即SID进入到详情页 获取到SID对应的所有文章数据
export function fetchBusinessDetail(params) {
  const SID = params.SID
  params = {
    isPaging: 0
  }
  return request({
    url: commonPrefix + '/v1/businessOpportunities/' + SID + '/articles',
    method: 'get',
    params: params
  })
}

// 根据详情页的流程SID进入到添加页面 拿到分类和名称
export function fetchBusinessAdd(params) {
  const SID = params.SID
  params = {
    isPaging: 0
  }
  return request({
    url: commonPrefix + '/v1/businessOpportunities/' + SID + '/articles',
    method: 'get',
    params: params
  })
}
// 根据详情页的流程SID进入到新增页面 拿到分类和名称
export function fetchBusinessView(params) {
  const SID = params.SID
  const CID = params.CID
  params = {
    isPaging: 0
  }
  return request({
    url: commonPrefix + '/v1/businessOpportunities/' + SID + '/articles/' + CID,
    method: 'get',
    params: params
  })
}

// 编辑页的获取标签数据接口
export function fetchBusinessTag(params) {
  return request({
    url: commonPrefix + '/v1/businessOpportunities/tagList',
    method: 'get',
    params: params
  })
}

// 编辑页 获取 下一位的 数据接口
// export function fetchBusinessNextConsumer(params) {
//   return request({
//     url: userPrefix + '/v1/users',
//     method: 'get',
//     params: params
//   })
// }
export function fetchBusinessNextConsumer(params) {
  return request({
    url: commonPrefix + '/v1/businessOpportunities/userList',
    method: 'get',
    params: params
  })
}

// 编辑页 创建 点击提交按钮 有当前用户
export function submitBusinessCreate(data) {
  return request({
    url: commonPrefix + '/v1/businessOpportunities',
    method: 'post',
    data: qs.stringify(data),
    headers: { policy: '/buOpportunities/businessOpportunities/:create' }
  })
}
// 编辑页 新增 点击提交按钮 有SID
export function submitBusinessAdd(SID, data) {
  return request({
    url: commonPrefix + '/v1/businessOpportunities/' + SID + '/articles',
    method: 'post',
    data: data
  })
}

// export function fetchBusinessUploadFile(fd, headers) {
//   return request({
//     url: commonPrefix + '/v1/businessOpportunities/uploadFile',
//     method: 'post',
//     headers,
//     data: fd
//   })
// }
