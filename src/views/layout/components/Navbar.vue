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
      <div class="fullscreen" @click="screenfull">
        <svg-icon icon-class="fullscreen"></svg-icon>
        <span class="screen">全屏</span>
      </div>
      <div class="full">
        <svg-icon icon-class="leadership"></svg-icon>
        <span class="leader-name">领导</span>
      </div>
      <el-dropdown class="noticeDrop" @command="handleCommand">
        <span class="el-dropdown-link">
          <div class="notice">
            <svg-icon icon-class="bells"></svg-icon>
            <span class="noticemsg">消息</span>
            <span :style="{display:notReadNoticeTotal?'block':'none'}" class="noRcount">{{ notReadNoticeTotal }}</span>
          </div>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in notReadNotice" :key="item.id" :command="item">{{ '公告: '+ item.title }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="avatar-container right-menu-item" placement="bottom" trigger="click">
        <div class="avatar-wrapper">
          <img src="../../../assets/images/username_icon.png" alt>
          <span class="user-name">{{ username }}</span>
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
      <el-dialog :visible="dialogVisable" :title="'公告'" width="720px" @close="()=>{dialogVisable = false}">
        <el-form ref="addFormRef" :rules="addFormRules" :model="noticeForm">
          <el-form-item label="标题" prop="title">
            <el-input v-model="noticeForm.title" disabled class="input_title" ></el-input>
          </el-form-item>
          <el-form-item label="创建者" prop="creatorId">
            <el-input v-model="noticeForm.creatorId" disabled class="input_title" ></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-radio-group v-model="noticeForm.type" disabled>
              <el-radio :label="0">通知</el-radio>
              <el-radio :label="1">公告</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="紧急程度" prop="state">
            <el-radio-group v-model="noticeForm.state" disabled>
              <el-radio :label="0">普通</el-radio>
              <el-radio :label="1">紧急</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <span>内容</span>
            <quill-editor
              ref="myQuillEditor"
              v-model="noticeForm.content"
              :options="editorOption"
              disabled>
            </quill-editor>
          </el-form-item>

          <el-form-item label="签名档">
            <el-select v-model="noticeForm.signatureId" disabled placeholder="请选择">
              <el-option v-for="item in departmentInfo" :value="item.departmentId" :label="item.department" :key="item.departmentId"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="dialogConfirm()"
          >确 定</el-button>
        </div>
      </el-form:model="form"></el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import screenfull from 'screenfull'
import Cookies from 'js-cookie'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import minLogo from '@/assets/images/logo-min.png'
import { updateUserPassWord, fetchUser } from '@/api/user'
import { notReadNotices } from '@/api/notice'

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
      dialogVisable: false,
      timer: '',
      noticeForm: {},
      dialogFormVisible: false,
      form: {
        re_password: '',
        new_password: ''
      },
      isFullscreen: false,
      username: '',
      notReadNotice: [],
      notReadNoticeTotal: '',
      departmentInfo: [
        {
          departmentId: 3275699862611970,
          department: '华阴市公安支队'
        },
        {
          departmentId: 3275699862611971,
          department: '孟塬派出所'
        },
        {
          departmentId: 3275699862611972,
          department: '华山镇派出所'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      // 'name',
      'avatar',
      'device'
    ])

  },
  watch: {
    isFullscreen(v) {
      if (v) {
        document.getElementsByClassName('fullscreen')[0].childNodes[0].classList.add('highlight')
        document.getElementsByClassName('fullscreen')[0].childNodes[2].classList.add('texthighlight')
      } else {
        document.getElementsByClassName('fullscreen')[0].childNodes[0].classList.remove('highlight')
        document.getElementsByClassName('fullscreen')[0].childNodes[2].classList.remove('texthighlight')
      }
    },
    notReadNoticeTotal(v) {
      if (v) {
        clearInterval(this.timer)
        this.$message({
          type: 'info',
          message: `您有${v}条未读消息`
        })
      }
    }
  },
  mounted() {
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      const params = {
        index: 1,
        size: 10000,
        total: 0
      }
      notReadNotices(params).then((res) => {
        if (res.body.data.length > 0) {
          this.notReadNoticeTotal = res.body.page.total
          this.notReadNotice = res.body.data
        }
      })
    }, 5000)
    window.onresize = () => {
      // 全屏下监控是否按键了ESC
      if (!document.webkitIsFullScreen) {
        this.isFullscreen = false
      }
      if (!this.checkFull()) {
        // 全屏下按键esc后要执行的动作
        this.isFullscreen = false
      }
    }
    fetchUser().then((res) => {
      this.username = res.body.data.username
    }).catch(err => {
      return err
    })
  },
  methods: {
    handleCommand(command) {
      this.dialogVisable = true
      this.noticeForm = command
    },
    screenfull(e) {
      e.path.forEach(item => {
        if (item.className === 'fullscreen') {
          item.childNodes[0].classList.toggle('highlight')
        }
      })
      screenfull.toggle()
      this.isFullscreen = !this.isFullscreen
    },
    /**
   * 是否全屏并按键ESC键的方法
   */
    checkFull() {
      var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
      // to fix : false || undefined == undefined
      if (isFull === undefined) {
        isFull = false
      }
      return isFull
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    // logout() {
    //   this.$store.dispatch('LogOut').then(() => {
    //     location.reload()// In order to re-instantiate the vue-router object to avoid bugs
    //   })
    // },
    // huanglulu
    businessLogout() {
      // window.location.href = `${process.env.LOGOUT_URL}`;
      Cookies.remove('token')
      Cookies.remove('username')
      Cookies.remove('userId')
      Cookies.remove('level')
      this.$router.push('/login')
    }
    // toUpWord() {
    //   if (this.form.re_password === '') {
    //     this.$message.error('请输入新密码')
    //     return
    //   }
    //   if (this.form.new_password === '') {
    //     this.$message.error('请输入确认新密码')
    //     return
    //   }
    //   var patt1 = new RegExp(/\s+/g)
    //   if (patt1.test(this.form.re_password) || patt1.test(this.form.new_password)) {
    //     this.$message.error('密码仅支持输入字母，数字，符号')
    //     return
    //   }
    //   updateUserPassWord(this.form).then(() => {
    //     this.$confirm('登录已失效, 请重新登录！', '密码修改成功', {
    //       confirmButtonText: '确定',
    //       showCancelButton: false,
    //       type: 'success'
    //     }).then(() => {
    //       this.logout()
    //     }).catch(() => {
    //     })
    //   }).catch((res) => {
    //     this.$message.error(res.msg)
    //   })
    // }
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
      display: flex;
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
        // position: absolute;
        // right: 0px;
        margin-top: 12px;
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
      .full {
        margin-right: 30px;
        display: flex;
        color: #000;
        .svg-icon {
          width: 20px;
          height: 20px;
          margin-top: 16px;
          margin-right: 4px;
          border-radius: 50%;
          vertical-align: middle;
        }
        .leader-name {
          font-family: PingFangSC-Regular;
          margin-top: 5px;
          font-size: 14px;
          line-height: 40px;
        }
      }
      .fullscreen {
        margin-right: 30px;
        margin-top: 1px;
        font-size: 14px;
        cursor: pointer;
      }
      .notice {
        margin-right: 24px;
        font-size: 14px;
        cursor: pointer;
      }
      .full {
        cursor: pointer;
      }
      .highlight {
        fill: #E6A23C;
      }
      .texthighlight {
        color: #E6A23C;
        font-weight: 700;
      }
    }
  }
  .notice {
    position:relative;
    color: #000;
    .noRcount {
      display: inline-block;
      width: 20px;
      height: 15px;
      font-size: 12px;
      line-height: 15px;
      text-align: center;
      color: #fff;
      position: absolute;
      border-radius: 5px 5px 5px 0;
      background-color: red;
      top: 5px;
      right: -20px;
    }
  }
  .noticeDrop {
    border: none !important;
  }

</style>
