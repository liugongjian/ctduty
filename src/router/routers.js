/* Layout */
import Layout from '@/views/layout/Layout'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: false,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: {
          title: 'dashboard',
          icon: 'dashboard',
          noCache: true,
          affix: true,
          roles: []
        }
      }
    ]
  },
  {
    path: '/sysmanage',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'sysmanage',
      icon: 'dashboard',
      noCache: true
    },
    children: [
      {
        path: 'userManage',
        component: () => import('@/views/sysmanage/userManage/index'),
        name: 'sysUser',
        meta: {
          title: 'userManage',
          icon: 'dashboard',
          noCache: false
        }
      },
      {
        path: 'cameraManage',
        component: () => import('@/views/sysmanage/cameraManage/index'),
        name: 'sysCameraManage',
        meta: {
          title: 'cameraManage',
          icon: 'dashboard',
          noCache: false
        }
      },
      {
        path: 'areaManage',
        component: () => import('@/views/sysmanage/areaManage/index'),
        name: 'sysAreaManage',
        meta: {
          title: 'areaManage',
          icon: 'dashboard',
          noCache: false
        }
      }
    ]
  },
  {
    path: '',
    name: 'defaultIndex',
    redirect: '/login',
    hidden: true
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: false
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401')
    // hidden:true
  }
]

export const asyncRouterMap = [
]
