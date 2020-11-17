import { asyncRouterMap, constantRouterMap } from '@/router/routers'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(level, route) {
  if (route.meta && route.meta.roles) {
    // return roles.some(role => route.meta.roles.includes(role))
    return level < 2
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, level) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(level, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, level)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    level: false
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_LEVEL: (state, level) => {
      state.level = level
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { level } = data
        // let accessedRouters
        // if (level < 2) {
        //   accessedRouters = asyncRouterMap
        // } else {
        //   accessedRouters = filterAsyncRouter(asyncRouterMap, level)
        // }
        const accessedRouters = filterAsyncRouter(asyncRouterMap, level)
        commit('SET_ROUTERS', accessedRouters)
        commit('SET_LEVEL', true)
        resolve()
      })
    }
  }
}

export default permission
