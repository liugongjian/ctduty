import request from '@/utils/request'
import qs from 'qs'
import config from '@/config'
const {
  baseUrl: { pro }
} = config
export function loginGetToken(data) {
  return request({
    url: 'http://host31.880508.xyz:10000/Login',
    method: 'post',
    data: data
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
    url: 'http://host31.880508.xyz:10000/Login/logout',
    method: 'post'
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
