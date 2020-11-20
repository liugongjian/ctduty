/* Layout */
import Layout from '@/views/layout/Layout'
import MainLayout from '@/views/layout/MainLayout'

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
export const asyncRouterMap = [
  {
    path: '/',
    component: Layout,
    hidden: false,
    redirect: '/dashboard',
    meta: {
      roles: 'admin'
    },
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: {
          title: 'dashboard',
          icon: 'dashboard',
          noCache: true,
          affix: true,
          roles: 'admin'
        }
      }
    ]
  },
  // {
  //   path: '/ecloudwatch',
  //   component: Layout,
  //   redirect: '/ecloudwatch',
  //   hidden: false,
  //   children: [
  //     {
  //       path: '/ecloudwatch',
  //       component: () => import('@/views/eCloudWatch/index'),
  //       name: 'eCloudWatch',
  //       meta: {
  //         title: 'eCloudWatch',
  //         icon: 'ecloudwatch',
  //         noCache: true,
  //         affix: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/videomonitor',
  //   component: Layout,
  //   redirect: '/videomonitor',
  //   name: 'videomonitor',
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/videomonitor',
  //       component: () => import('@/views/videoMonitor/index'),
  //       name: 'videoMonitor',
  //       meta: {
  //         title: 'videoMonitor',
  //         icon: 'videoMonitor',
  //         noCache: true,
  //         affix: true
  //       }
  //     }
  //   ]
  // },
  {
    path: '/monitorScreen',
    component: Layout,
    redirect: '/monitorScreen',
    hidden: false,
    children: [
      {
        path: '/monitorScreen',
        component: () => import('@/views/monitorScreen/index'),
        name: 'monitorScreen',
        meta: {
          title: 'monitorScreen',
          icon: 'monitor',
          noCache: true,
          affix: true
        }
      }
    ]
  },
  {
    path: '/algorithmconfig',
    component: Layout,
    redirect: '/algorithmconfig',
    hidden: false,
    children: [
      {
        path: '/algorithmconfig',
        component: () => import('@/views/algorithmConfig/index'),
        name: 'algorithmConfig',
        meta: {
          title: 'algorithmConfig',
          icon: 'algorithmconfig',
          noCache: true,
          affix: true
        }
      }
    ]
  },

  {
    path: '/carManage',
    // component: () => import('@/views/sysmanage/carManage/index'),
    component: Layout,
    redirect: '/carManage',
    hidden: false,
    // alwaysShow: true, // will always show the root menu
    // hidden: false,
    children: [
      {
        path: '/carManage',
        component: () => import('@/views/sysmanage/carManage/index'),
        name: 'sysCarManage',
        meta: {
          title: 'carManage',
          icon: 'license',
          noCache: true,
          affix: true
        }
      }
    ]
  },
  {
    path: '/faceManage',
    component: Layout,
    redirect: '/faceManage',
    hidden: false,
    children: [
      {
        path: '/faceManage',
        component: () => import('@/views/sysmanage/faceManage/index'),
        name: 'sysFaceManage',
        meta: {
          title: 'faceManage',
          icon: 'face',
          noCache: true,
          affix: true
        }
      }
    ]
  },
  {
    path: '/cameraManage',
    component: Layout,
    redirect: '/cameraManage/list',
    // alwaysShow: true,
    hidden: false,
    name: 'sysCameraManage',
    meta: {
      title: 'cameraManage',
      icon: 'cameraManagement',
      noCache: false
    },
    withnonestmenu: true,
    children: [
      {
        path: '/cameraManage/list',
        component: MainLayout,
        name: 'sysCameraManage',
        hidden: true,
        withnonestmenu: true,
        // meta: {
        //   title: 'cameraManage',
        //   icon: 'cameraManagement',
        //   noCache: false
        //   // affix: true
        // },
        children: [
          {
            path: '',
            component: () => import('@/views/sysmanage/cameraManage/list'),
            name: 'sysCameraManage',
            hidden: true
            // meta: {
            //   title: 'cameraManage',
            //   icon: 'cameraManagement',
            //   noCache: true
            //   // affix: true
            // }
          },
          {
            path: '/cameraManage/videomonitor',
            component: () => import('@/views/videoMonitor/index'),
            name: 'cameraManage/videoMonitor',
            hidden: true,
            meta: {
              title: 'videoMonitor',
              icon: 'videoMonitor',
              noCache: false
            }

          }
        ]
      }
      // {
      //   path: '',
      //   component: () => import('@/views/sysmanage/cameraManage/list'),
      //   name: 'cameraManage',
      //   // hidden: true,
      //   meta: {
      //     title: 'cameraManage',
      //     icon: 'cameraManagement',
      //     noCache: true,
      //     affix: true
      //   }
      // }, {
      //   path: 'videomonitor',
      //   component: () => import('@/views/videoMonitor/index'),
      //   name: 'cameraManage/videoMonitor',
      //   hidden: true,
      //   meta: {
      //     title: 'videoMonitor',
      //     icon: 'videoMonitor',
      //     noCache: false
      //   }

      // }
    ]
  },
  {
    path: '/alarmMessage',
    component: Layout,
    alwaysShow: true,
    meta: {
      title: 'alarmMessage',
      icon: 'alarmMessage',
      noCache: true,
      roles: 'admin'
    },
    children: [
      {
        path: 'alarmMessage',
        component: () => import('@/views/alarmMessage/index'),
        name: 'alarmMessageIndex',
        meta: {
          title: 'alarmMessage',
          icon: 'alarmMessage',
          noCache: false
        }
      },
      {
        path: 'carHistory',
        component: () => import('@/views/sysmanage/carHistory/index'),
        name: 'carHistory',
        meta: {
          title: 'carHistory',
          icon: 'license',
          noCache: false
        }
      },
      {
        path: 'faceHistory',
        component: () => import('@/views/sysmanage/faceManage/history'),
        name: 'faceHistory',
        meta: {
          title: 'faceHistory',
          icon: 'face',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/sysMonitor',
    component: Layout,
    alwaysShow: true, // willalwaysshowtherootmenu
    meta: {
      title: 'sysMonitor',
      icon: 'sysMonitor',
      noCache: true,
      roles: 'admin'
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
    path: '/sysmanage',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    hidden: false,
    meta: {
      title: 'sysmanage',
      icon: 'sysmanage',
      noCache: true,
      roles: 'admin'
    },
    children: [
      /* {
        path: '/areaManage',
        component: MainLayout,
        alwaysShow: true,
        meta: {
          title: 'areaManage',
          icon: 'area'
        },
        children: [
          {
            path: 'area',
            component: () => import('@/views/sysmanage/areaManage/index'),
            name: 'sysAreaManageArea',
            meta: {
              title: '区域管理',
              icon: 'area'
            }
          },
          {
            path: 'administration',
            component: () =>
              import('@/views/sysmanage/areaManage/administration'),
            name: 'sysAreaManageAdministration',
            meta: {
              title: '行政管理',
              icon: 'administrative'
            }
          },
          {
            path: 'policeManage',
            component: () =>
              import('@/views/sysmanage/areaManage/policeManage'),
            name: 'sysAreaManagePoliceManage',
            meta: {
              title: '派出所管理',
              icon: 'police'
            }
          }
        ]
      }, */
      /* {
        path: 'policeManage',
        component: () => import('@/views/sysmanage/areaManage/policeManage'),
        name: 'policeManage',
        meta: {
          title: '派出所管理',
          icon: 'police',
          noCache: false
        }
      }, */
      {
        path: 'userManage',
        component: () => import('@/views/sysmanage/userManage/index'),
        name: 'sysUser',
        meta: {
          title: 'userManage',
          icon: 'userManage',
          noCache: false
        }
      }
      /* {
        path: 'dutyManage',
        component: () => import('@/views/sysmanage/dutyManage/index'),
        name: 'sysdutyManage',
        meta: {
          title: 'dutyManage',
          icon: 'dutyManage',
          noCache: false
        }
      }, */

    ]
  }
]
export const constantRouterMap = [
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   hidden: false,
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: () => import('@/views/dashboard/index'),
  //       name: 'dashboard',
  //       meta: {
  //         title: 'dashboard',
  //         icon: 'dashboard',
  //         noCache: true,
  //         affix: true,
  //         roles: []
  //       }
  //     }
  //   ]
  // },
  {
    path: 'addnewnotice',
    component: () => import('@/views/notice/addNewNotice'),
    meta: {
      title: 'eCloudWatch',
      icon: 'vsearch'
    }
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
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  }
]
