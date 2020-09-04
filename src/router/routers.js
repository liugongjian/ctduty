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
      },
      {
        path: 'users',
        component: () => import('@/views/users/index'),
      },
      {
        path: 'notice',
        component: () => import('@/views/notice/index'),
      },
      {
        path: 'addnewnotice',
        component: () => import('@/views/notice/addNewNotice'),
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
