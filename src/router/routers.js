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
    path: 'addnewnotice',
    component: () => import('@/views/notice/addNewNotice'),
    meta: {
      title: 'eCloudWatch',
      icon: 'vsearch'
    }
  },
  {
    path: '/ecloudwatch',
    component: Layout,
    redirect: '/ecloudwatch',
    hidden: false,
    children: [
      {
        path: '/ecloudwatch',
        component: () => import('@/views/eCloudWatch/index'),
        name: 'eCloudWatch',
        meta: {
          title: 'eCloudWatch',
          icon: 'ecloudwatch',
          noCache: true,
          affix: true,
          roles: []
        }
      }
    ]
  },
  {
    path: '/alarmMessage',
    component: Layout,
    redirect: '/alarmMessage',
    hidden: false,
    children: [
      {
        path: '/alarmMessage',
        component: () => import('@/views/alarmMessage/index'),
        name: 'alarmMessageIndex',
        meta: {
          title: 'alarmMessage',
          icon: 'alarmMessage',
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
      icon: 'sysmanage',
      noCache: true
    },
    children: [
      {
        path: 'userManage',
        component: () => import('@/views/sysmanage/userManage/index'),
        name: 'sysUser',
        meta: {
          title: 'userManage',
          icon: 'userManage',
          noCache: false
        }
      },
      {
        path: 'cameraManage',
        component: () => import('@/views/sysmanage/cameraManage/index'),
        name: 'sysCameraManage',
        meta: {
          title: 'cameraManage',
          icon: 'camera',
          noCache: false
        }
      },
      /*  { path: 'cameraManage/map',
        component: () => import('@/views/sysmanage/cameraManage/map'),
        name: 'sysCameraManageMap',
        hidden: true,
        meta: {
          title: 'cameraManage',
          icon: 'dashboard',
          noCache: false
        }
      },
      { path: 'cameraManage/list',
        component: () => import('@/views/sysmanage/cameraManage/list'),
        name: 'sysCameraManageList',
        hidden: true,
        meta: {
          title: 'cameraManage',
          icon: 'dashboard',
          noCache: false
        }
      }, */
      {
        path: 'areaManage',
        component: () => import('@/views/sysmanage/areaManage/index'),
        name: 'sysAreaManage',
        meta: {
          title: 'areaManage',
          icon: 'area',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/sysMonitor',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'sysMonitor',
      icon: 'sysMonitor',
      noCache: true
    },
    children: [
      {
        path: 'notice',
        component: () => import('@/views/sysMonitor/notice/index'),
        name: 'noticeIndex',
        meta: {
          title: 'notice',
          icon: 'notice',
          noCache: false
        }
      },
      {
        path: 'onlineUser',
        component: () => import('@/views/sysMonitor/onlineUser/index'),
        name: 'onlineUserIndex',
        meta: {
          title: 'onlineUser',
          icon: 'onlineUser',
          noCache: false
        }
      },
      {
        path: 'pushSet',
        component: () => import('@/views/sysMonitor/pushSet/index'),
        name: 'pushSetIndex',
        meta: {
          title: 'pushSet',
          icon: 'pushSet',
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
