import request from '@/utils/request'
import qs from 'qs'
import config from '@/config'
const {
  baseUrl: { pro }
} = config
export function loginGetToken(data) {
  return request({
    url: '/nvsapi/Login',
    method: 'post',
    data: data
  })
}

// 登录心跳
export function heartbeat() {
  return request({
    url: '/nvsapi/Login/heartbeat',
    method: 'get'
  })
}

// login ldap
export function loginLdapByUsername(data) {
  return request({
    url: '/v1/users/login/ldap',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function logout() {
  return request({
    url: '/nvsapi/Login/logout',
    method: 'get'
  })
}

export function getUserPrem(token) {
  return request({
    url: pro + '/v1/permission',
    method: 'get'
  })
}

export function getUserDomain(token) {
  return request({
    url: '/v1/account/domains',
    method: 'get'
  })
}

export function getUserCaptcha(token) {
  return request({
    url: 'captcha/request',
    method: 'get',
    params: {
      token
    }
  })
}
