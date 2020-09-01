<template>
  <div :class="!sidebar.opened? 'navToggle':'' " class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <!-- <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item"/>

        <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip>

        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select class="international right-menu-item"/>
        </el-tooltip>
      </template> -->

      <el-dropdown class="avatar-container right-menu-item" placement="bottom" trigger="click">
        <div class="avatar-wrapper">
          <img src="../../../assets/images/username_icon.png" alt>
          <span class="user-name">{{ name }}</span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item >
            <span style="display:block;" @click="businessLogout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
        <!-- <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu> -->
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import minLogo from '@/assets/images/logo-min.png'
import { updateUserPassWord } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker
  },
  data() {
    return {
      minLogo,
      dialogFormVisible: false,
      form: {
        re_password: '',
        new_password: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ])

  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    // huanglulu
    businessLogout() {
      window.location.href = `${process.env.LOGOUT_URL}`;
      Cookies.remove('token')
      Cookies.remove('userId')
    },
    toUpWord() {
      if (this.form.re_password === '') {
        this.$message.error('请输入新密码')
        return
      }
      if (this.form.new_password === '') {
        this.$message.error('请输入确认新密码')
        return
      }
      var patt1 = new RegExp(/\s+/g)
      if (patt1.test(this.form.re_password) || patt1.test(this.form.new_password)) {
        this.$message.error('密码仅支持输入字母，数字，符号')
        return
      }
      updateUserPassWord(this.form).then(() => {
        this.$confirm('登录已失效, 请重新登录！', '密码修改成功', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'success'
        }).then(() => {
          this.logout()
        }).catch(() => {
        })
      }).catch((res) => {
        this.$message.error(res.msg)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .navToggle {
      padding-left: 70px !important;
      transition: all .18s linear;
    }
  .navbar {
    height: 50px !important;
    line-height: 50px;
    border-radius: 0px !important;
    border-bottom: 1px solid #eee;

    .hamburger-container {
      line-height: 58px;
      height: 50px !important;
      float: left;
      padding: 0 10px;
    }
    .breadcrumb-container {
      float: left;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }
    .right-menu {
      float: right;
      height: 100%;
      &:focus {
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }
      .screenfull {
        height: 20px;
      }
      .international {
        vertical-align: top;
      }
      .theme-switch {
        vertical-align: 15px;
      }
      .avatar-container {
        position: absolute;
        right: 0px;
        top: 12px;
        .avatar-wrapper {
          margin-right: 20px;
          display: flex;
          img {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            vertical-align: middle;
          }
          .user-name {
            margin-left: 10px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #666666;
            line-height: 22px;
          }
       }

            }
    }
  }
</style>
