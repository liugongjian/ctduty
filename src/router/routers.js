/* Layout */
import Layout from "@/views/layout/Layout";
import MainLayout from "@/views/layout/MainLayout";

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
    path: "/",
    component: Layout,
    hidden: false,
    redirect: "/dashboard",
    meta: {
      roles: "admin"
    },
    children: [
      {
        path: "/dashboard",
        component: () => import("@/views/dashboard/index"),
        name: "dashboard",
        meta: {
          title: "dashboard",
          icon: "dashboard",
          noCache: true,
          affix: true,
          roles: "admin"
        }
      }
    ]
  },
  {
    path: "/ecloudwatch",
    component: Layout,
    redirect: "/ecloudwatch",
    hidden: false,
    children: [
      {
        path: "/ecloudwatch",
        component: () => import("@/views/eCloudWatch/index"),
        name: "eCloudWatch",
        meta: {
          title: "eCloudWatch",
          icon: "ecloudwatch",
          noCache: true,
          affix: true
        }
      }
    ]
  },
  {
    path: "/monitorScreen",
    component: Layout,
    redirect: "/monitorScreen",
    hidden: false,
    children: [
      {
        path: "/monitorScreen",
        component: () => import("@/views/monitorScreen/index"),
        name: "monitorScreen",
        meta: {
          title: "monitorScreen",
          icon: "monitor",
          noCache: true,
          affix: true
        }
      }
    ]
  },
  {
    path: "/alarmMessage",
    component: Layout,
    redirect: "/alarmMessage",
    hidden: false,
    children: [
      {
        path: "/alarmMessage",
        component: () => import("@/views/alarmMessage/index"),
        name: "alarmMessageIndex",
        meta: {
          title: "alarmMessage",
          icon: "alarmMessage",
          noCache: true,
          affix: true
        }
      }
    ]
  },
  {
    path: "/sysMonitor",
    component: Layout,
    alwaysShow: true, // willalwaysshowtherootmenu
    meta: {
      title: "sysMonitor",
      icon: "sysMonitor",
      noCache: true,
      roles: "admin"
    },
    children: [
      {
        path: "notice",
        component: () => import("@/views/sysMonitor/notice/index"),
        name: "noticeIndex",
        meta: {
          title: "notice",
          icon: "notice",
          noCache: false
        }
      },
      {
        path: "onlineUser",
        component: () => import("@/views/sysMonitor/onlineUser/index"),
        name: "onlineUserIndex",
        meta: {
          title: "onlineUser",
          icon: "onlineUser",
          noCache: false
        }
      },
      {
        path: "pushSet",
        component: () => import("@/views/sysMonitor/pushSet/index"),
        name: "pushSetIndex",
        meta: {
          title: "pushSet",
          icon: "pushSet",
          noCache: false
        }
      }
    ]
  },
  {
    path: "/sysmanage",
    component: Layout,
    alwaysShow: true, // will always show the root menu
    hidden: false,
    meta: {
      title: "sysmanage",
      icon: "sysmanage",
      noCache: true,
      roles: "admin"
    },
    children: [
      {
        path: "/areaManage",
        component: MainLayout,
        alwaysShow: true,
        meta: {
          title: "areaManage",
          icon: "area"
        },
        children: [
          {
            path: "area",
            component: () => import("@/views/sysmanage/areaManage/index"),
            name: "sysAreaManageArea",
            meta: {
              title: "区域管理",
              icon: "area"
            }
          },
          {
            path: "administration",
            component: () =>
              import("@/views/sysmanage/areaManage/administration"),
            name: "sysAreaManageAdministration",
            meta: {
              title: "行政管理",
              icon: "administrative"
            }
          },
          {
            path: "policeManage",
            component: () =>
              import("@/views/sysmanage/areaManage/policeManage"),
            name: "sysAreaManagePoliceManage",
            meta: {
              title: "派出所管理",
              icon: "police"
            }
          }
        ]
      },
      {
        path: "userManage",
        component: () => import("@/views/sysmanage/userManage/index"),
        name: "sysUser",
        meta: {
          title: "userManage",
          icon: "userManage",
          noCache: false
        }
      },
      {
        path: "dutyManage",
        component: () => import("@/views/sysmanage/dutyManage/index"),
        name: "sysUser",
        meta: {
          title: "dutyManage",
          icon: "userManage",
          noCache: false
        }
      },
      {
        path: "cameraManage",
        component: () => import("@/views/sysmanage/cameraManage/index"),
        name: "sysCameraManage",
        meta: {
          title: "cameraManage",
          icon: "cameraManagement",
          noCache: false
        }
      },
      {
        path: "carManage",
        component: () => import("@/views/sysmanage/carManage/index"),
        name: "sysCarManage",
        meta: {
          title: "carManage",
          icon: "license",
          noCache: false
        }
      },
      {
        path: "faceManage",
        component: () => import("@/views/sysmanage/faceManage/index"),
        name: "sysFaceManage",
        meta: {
          title: "faceManage",
          icon: "face",
          noCache: false
        }
      }
    ]
  }
];
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
    path: "addnewnotice",
    component: () => import("@/views/notice/addNewNotice"),
    meta: {
      title: "eCloudWatch",
      icon: "vsearch"
    }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/errorPage/404"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/views/errorPage/401"),
    hidden: true
  }
];
