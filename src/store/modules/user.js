import {
  loginByUsername,
  loginLdapByUsername,
  // logout,
  getUserPrem
} from '@/api/login'
import { fetchUser,  fetchUserOnline } from '@/api/user';
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import { setTagNavListInLocalstorage } from '@/utils'
import { loginDingtalk } from '@/api/user'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: undefined,
    auth: [],
    setting: {
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROLE: (state, role) => {
      state.role = role
    },
    SET_AUTH: (state, roles) => {
      state.auth = roles
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_REALNAME: (state, realname) => {
      state.realname = realname
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // Ldap 登陆
    LoginLdapByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginLdapByUsername(userInfo).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方登录
    LoginByThird({ commit }, data) {
      return new Promise((resolve, reject) => {
        loginDingtalk(data)
          .then(response => {
            const data = response.data
            commit('SET_TOKEN', data.token)
            setToken(data.token)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      fetchUserOnline().then(res => {
        console.log(res)
      }).catch(error => {
        console.log(error)
      })
      return new Promise((resolve, reject) => {
        fetchUser()
          .then(response => {
            if (response.data) {
              commit('SET_NAME', response.data.name)
              commit('SET_ROLE', response.data.role)
              commit('SET_USERID', response.data.id)
            }
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        // setTagNavListInLocalstorage([])
        commit('DEL_ALL_VISITED_VIEWS')
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        setTagNavListInLocalstorage([])
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserPrem(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
