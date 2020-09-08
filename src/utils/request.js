import axios from 'axios'
import {
  Message
} from 'element-ui'
import Cookies from 'js-cookie'
import {logout} from '../api/login'
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
  timeout: 15000 // request timeout
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
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
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
    console.log('request的返回信息', res)
    if (res.code == 50000) {
      // Message({
      //   message: res.msg,
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      // // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // 请自行在引入 MessageBox
      //   // import { Message, MessageBox } from 'element-ui'
      //   MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
      //     confirmButtonText: '重新登录',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('FedLogOut').then(() => {
      //       location.reload() // 为了重新实例化vue-router对象 避免bug
      //     })
      //   })
      // }
      // if (res.code === 10012 || res.code === 10015) {
      //   store.dispatch('FedLogOut').then(() => {
      //     location.reload() // 为了重新实例化vue-router对象 避免bug
      //   })
      // }
      if (res.code === 50000 && res.message === 'Token unauthorized.') {
        console.log('token过期了')
        logout().then(() => {
          Cookies.remove('token')
          Cookies.remove('userId')
          Cookies.remove('username')
          this.$router.push('/login')
        })
      }
        return Promise.reject(response.data)
      // }
      // return Promise.reject(response.data)
    } else {
      return response.data
    }
  },
  error => {
    let timeout = null
    const msg = error.response.data.msg || error.message
    console.log(error, msg)
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
    const { status } = error.response
    if (status === 401) {
      Cookies.remove('saas_token_id', { domain: '.ctyun.cn' })
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        window.location.href = process.env.SAAS_URL + `?from=zen&redirect_url=${process.env.OPENAPI_URL}`
      }, 3000)
    }
    return Promise.reject(error)
  }
)

export default service
