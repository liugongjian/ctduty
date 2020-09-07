import Vue from 'vue'
import Router from 'vue-router'
import {
  constantRouterMap
} from '@/router/routers'
import { addOprecord } from '@/api/operation'
import Cookies from 'js-cookie'
import store from '@/store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { Store } from 'vuex'
// import {
//   getToken
// } from '@/utils/auth' // getToken from cookie

Vue.use(Router)
const router = new Router({
  mode: 'history',
  base: '/',
  routes: constantRouterMap,
  scrollBehavior: () => ({
    y: 0
  })
})

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

// permission judge function
// function hasPermission(roles, permissionRoles) {
//   // if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
//   if (!permissionRoles) return true
//   return roles.some(role => permissionRoles.indexOf(role) >= 0)
// }

// const whiteList = ['/login', '/auth-redirect', '/admin', '/install'] // no redirect whitelist

// router.beforeEach((to, from, next) => {
//   NProgress.start() // start progress bar
//   const getToken = function(TokenKey) {
//     return Cookies.get(TokenKey) || ''
//   }
//   if (getToken()) { // determine if there has token
//     /* has token*/
//     if (to.path === '/login') {
//       next({
//         path: '/'
//       })
//       NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
//     } else {
//       if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
//         store.dispatch('GetUserInfo').then(res => { // 拉取user_info
//           const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
//           store.dispatch('GenerateRoutes', {
//             roles
//           }).then(() => { // 根据roles权限生成可访问的路由表
//             router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
//             next({
//               ...to,
//               replace: true
//             }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
//           })
//         }).catch(() => {
//           store.dispatch('FedLogOut').then(() => {
//             Message.error('您暂时未有分配的权限，请联系管理员！')
//             next({
//               path: '/'
//             })
//           })
//         })
//       } else {
//         // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
//         if (hasPermission(store.getters.roles, to.meta.roles)) {
//           next()
//         } else {
//           next({
//             path: '/401',
//             replace: true,
//             query: {
//               noGoBack: true
//             }
//           })
//         }
//         // 可删 ↑
//       }
//       // next()
//     }
//   } else {
//     /* has no token*/
//     if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
//       next()
//     } else {
//       next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
//       NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
//     }
//   }
// })

router.beforeEach((to, from, next) => {
  let timeout = null
  // 判断当前用户是否已拉取完user_info信息
  // store.dispatch('GetUserInfo').then((res) => {
  //   if (res.code < 0) {
  //     Message.error('您还没有登录')
  //     clearTimeout(timeout)
  //     // timeout = setTimeout(() => {
  //     //   window.location.href = process.env.LOGIN_URL
  //     // }, 3000)
  //     return
  //   } else {
  //     // addOprecord({
  //     //   "userId": res.data.id,
  //     //   "userName": res.data.name,
  //     //   "record": `访问${to.name || to.path}`
  //     // });
  //     return
  //   }

  const token = localStorage.getItem('token')
  console.log('token', token)
  if (to.path === '/dashboard' || to.path === '/ecloudwatch' || to.path === '/ecloudwatch' || to.path === '/alarmMessage' || to.path === '/sysmanage/userManage' || to.path === '/sysmanage/cameraManage' || to.path === '/sysmanage/areaManage' || to.path === '/sysMonitor/notice' || to.path === '/sysMonitor/onlineUser' || to.path === '/sysMonitor/pushSet' ) {
    if (token) {
      next()
    } else {
      next('/login')
      // window.location.href = process.env.LOGIN_URL
    }
  } else {
    next()
  }
})
  // }).catch(error => {
  //   Message.error(error.message)
  //   // clearTimeout(timeout)
  //   // timeout = setTimeout(() => {
  //   //   window.location.href = process.env.LOGIN_URL
  //   // }, 1000)
  // })


// router.afterEach((to, from) => {
//   NProgress.done() // finish progress bar
// })

export default router
