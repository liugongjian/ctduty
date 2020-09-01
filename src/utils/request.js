import axios from 'axios'
import {
  Message
} from 'element-ui'
import Cookies from 'js-cookie'
// import {
//   getToken,
//   getPrefix
// } from '@/utils/auth'

// huanglulu
const getToken = function(TokenKey) {
  return Cookies.get(TokenKey) || ''
}
// create an axios instance
const service = axios.create({
  // baseURL: process.env['ZEUS_ADMIN_URL'],
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    // const token = store.getters.token
    const token = getToken('token')
    if (token) {
      // 让每个请求携带token 把头部的'Bearer '去掉
      config.headers['Authorization'] = token
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
    return res;
  },
  error => {
    let timeout = null
    const msg = error.response.data.msg || error.message
    Message({
      message: msg,
      type: 'error',
      duration: 5 * 1000
    })
    const { status } = error.response
    if (status === 401) {
      // removeToken()
      Cookies.remove('token')
      Cookies.remove('userId')
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        window.location.href = process.env.LOGIN_URL
      }, 3000)
    }
    return Promise.reject(error)
  }
)

export default service
