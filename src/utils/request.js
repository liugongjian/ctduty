import axios from 'axios'
import {
  Message
} from 'element-ui'
import store from '@/store'
import Cookies from 'js-cookie'
import { logout, heartbeat } from '../api/login'
// import {
//   getToken,
//   getPrefix
// } from '@/utils/auth'

// huanglulu
const getToken = function(token) {
  return Cookies.get(token) || ''
}
let messageInstance = null
const rewriteMessage = options => {
  if (messageInstance) {
    messageInstance.close()
  }
  messageInstance = Message(options)
}
// create an axios instance
const service = axios.create({
  // baseURL: process.env['ZEUS_ADMIN_URL'],
  timeout: 40000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    // const token = getToken('token')
    //
    const token = Cookies.get('token')

    if (token) {
      // 让每个请求携带token 把头部的'Bearer '去掉
      config.headers['Authorization'] = token
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  error => {
    // Do something with request error
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data
    if (res.code == 50000) {
      if (res.code === 50000 && res.message === 'Token not found.' || res.code === 50000 && res.message === 'Token unauthorized.') {
        logout().then((res) => {
          Cookies.remove('token')
          Cookies.remove('username')
          Cookies.remove('userId')
          Cookies.remove('level')
          store.dispatch('FedLogOut').then(() => {
            window.location.href = '/login'
          })
        }).catch(err => {
          return Promise.reject(err)
        })
      } else {
        return Promise.reject(response.data)
      }
    } else {
      return response.data
    }
  },
  error => {
    const timeout = null
    const msg = (error.response && error.response.data.msg) || error.message
    // console.log(error, msg)
    // Message({
    //   message: msg,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    rewriteMessage({
      message: msg,
      type: 'error',
      duration: 5 * 1000
    })
    // const { status } = error.response
    // if (status === 401) {
    //   Cookies.remove('saas_token_id', { domain: '.ctyun.cn' })
    //   clearTimeout(timeout)
    //   timeout = setTimeout(() => {
    //     window.location.href = process.env.SAAS_URL + `?from=zen&redirect_url=${process.env.OPENAPI_URL}`
    //   }, 3000)
    // }
    return Promise.reject(error)
  }
)

export default service
