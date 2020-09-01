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
    path: '/application',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'application',
      icon: 'application',
      roles: ['/activitycenter']
    },
    children: [
      {
        path: 'vehicle',
        component: () => import('@/views/monitor/index'),
        name: 'vehicle',
        meta: {
          title: 'vehicle',
          icon: 'vehicle',
          roles: ['/activitycenter/activities']
        }
      },
      {
        path: 'school',
        component: () => import('@/views/monitor/index'),
        name: 'school',
        meta: {
          title: 'school',
          icon: 'school',
          roles: ['/activitycenter/activities']
        }
      },
      {
        path: 'factory',
        component: () => import('@/views/monitor/index'),
        name: 'factory',
        meta: {
          title: 'factory',
          icon: 'factory',
          roles: ['/activitycenter/activities']
        }
      },
      {
        path: 'community',
        component: () => import('@/views/monitor/index'),
        name: 'community',
        meta: {
          title: 'community',
          icon: 'community',
          roles: ['/activitycenter/activities']
        }
      },
      {
        path: 'face',
        component: () => import('@/views/monitor/index'),
        name: 'face',
        meta: {
          title: 'face',
          icon: 'face',
          roles: ['/activitycenter/activities']
        }
      }
    ]
  },
  {
    path: '/database',
    component: Layout,
    redirect: '/database',
    hidden: false,
    children: [
      {
        path: '/database',
        component: () => import('@/views/database/list'),
        name: 'database',
        meta: {
          title: 'database',
          icon: 'database',
          noCache: true,
          affix: true,
          roles: []
        }
      }
    ]
  },
  {
    path: '/alarm',
    component: Layout,
    redirect: '/alarm',
    hidden: false,
    children: [
      {
        path: '/alarm',
        component: () => import('@/views/alarm/list'),
        name: 'alarm',
        meta: {
          title: 'alarm',
          icon: 'alarm',
          noCache: true,
          affix: true,
          roles: []
        }
      }
    ]
  },
  {
    path: '/vsearch',
    component: Layout,
    redirect: '/vsearch',
    hidden: false,
    children: [
      {
        path: '/vsearch',
        component: () => import('@/views/vsearch/list'),
        name: 'vsearch',
        meta: {
          title: 'vsearch',
          icon: 'vsearch',
          noCache: true,
          affix: true,
          roles: []
        }
      }
    ]
  },
  {
    path: '/operation',
    component: Layout,
    redirect: '/operation',
    hidden: false,
    children: [
      {
        path: '/operation',
        component: () => import('@/views/device/list'),
        name: 'operation',
        meta: {
          title: 'operation',
          icon: 'operation',
          noCache: true,
          affix: true,
          roles: []
        }
      }
    ]
  },
  {
    path: '/collect',
    component: Layout,
    redirect: '/collect',
    hidden: false,
    children: [
      {
        path: '/collect',
        component: () => import('@/views/collect/index'),
        name: 'collect',
        meta: {
          title: 'collect',
          icon: 'collect',
          noCache: true,
          affix: true,
          roles: []
        }
      }
    ]
  },
  {
    path: '/analysis',
    component: Layout,
    redirect: '/analysis',
    hidden: false,
    children: [
      {
        path: '/analysis',
        component: () => import('@/views/analysis/index'),
        name: 'analysis',
        meta: {
          title: 'analysis',
          icon: 'analysis',
          noCache: true,
          affix: true,
          roles: []
        }
      }
    ]
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
