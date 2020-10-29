<template>
  <div :class="!sidebar.opened? 'navToggle':'' " class="navbar">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <!-- <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item"/>

        <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip>

        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select class="international right-menu-item"/>
        </el-tooltip>
      </template>-->
      <div v-if="level < 2" class="full">
        <svg-icon icon-class="leadership"></svg-icon>
        <span class="leader-name">领导</span>
      </div>
      <div class="fullscreen" @click="screenfull">
        <svg-icon icon-class="fullscreen"></svg-icon>
        <span class="screen">全屏</span>
      </div>
      <el-dropdown placement="bottom" class="noticeDrop" @command="handleCommand">
        <span class="el-dropdown-link">
          <div class="notice">
            <svg-icon icon-class="bells"></svg-icon>
            <span class="noticemsg">消息</span>
            <span
              :style="{display:notReadNoticeTotal?'block':'none'}"
              class="noRcount"
            >{{ notReadNoticeTotal }}</span>
          </div>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in notReadNotice"
            :key="item.id"
            :command="item"
          >{{ '公告: '+ item.title }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="avatar-container right-menu-item" placement="bottom" trigger="click">
        <div class="avatar-wrapper">
          <img src="../../../assets/images/username_icon.png" alt />
          <span class="user-name">{{ username }}</span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span style="display:block;" @click="businessLogout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dialog :visible="dialogVisable" :title="'公告'" width="520px" @close="closeDialog">
        <el-form :model="noticeForm" label-width="85px" label-position="right">
          <el-form-item label="标题" prop="title">
            <div>{{ noticeForm.title }}</div>
          </el-form-item>
          <el-form-item label="创建者" prop="creator.username">
            <div>{{ noticeForm.creator.username }}</div>
          </el-form-item>
          <el-form-item label-width="0px">
            <el-row>
              <el-col :span="12">
                <el-form-item label-width="85px" label="类型" prop="type">
                  <el-radio v-if="noticeForm.type">公告</el-radio>
                  <el-radio v-else>通知</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label-width="85px" label="紧急程度" prop="state">
                  <el-radio v-if="noticeForm.state">紧急</el-radio>
                  <el-radio v-else>普通</el-radio>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="内容">
            <span
              style="margin-left:10px;margin-top:10px;border-radius: 5px;display:block;border:1px dashed #ccc;width: 300px;height:150px;"
              v-html="noticeForm.content"
            ></span>
          </el-form-item>
          <el-form-item label="签名档">
            <div>{{ noticeForm.signatureId === 3275699862611970? '华阴公安局':noticeForm.signatureId === 3275699862611971?'孟塬派出所':'华山镇派出所' }}</div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogConfirm()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import screenfull from "screenfull";
import Cookies from "js-cookie";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import LangSelect from "@/components/LangSelect";
import ThemePicker from "@/components/ThemePicker";
import minLogo from "@/assets/images/logo-min.png";
import { fetchUser } from "@/api/user";
import { logout } from "@/api/login";
import { notReadNotices, upReadNotices } from "@/api/notice";

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
      timer: null,
      noticeForm: {
        creator: {
          username: ""
        },
        signatureId: ""
      },
      dialogFormVisible: false,
      form: {
        re_password: "",
        new_password: ""
      },
      isFullscreen: false,
      username: "",
      notReadNotice: [],
      notReadNoticeTotal: "",
      departmentInfo: [
        {
          departmentId: 3275699862611970,
          department: "华阴公安局"
        },
        {
          departmentId: 3275699862611971,
          department: "孟塬派出所"
        },
        {
          departmentId: 3275699862611972,
          department: "华山镇派出所"
        }
      ],
      level: Cookies.get("level")
    };
  },
  computed: {
    ...mapGetters([
      "sidebar",
      // 'name',
      "avatar",
      "device",
      "noticeTotal",
      "noticeArr"
    ])
  },
  watch: {
    noticeTotal(v) {
      this.notReadNoticeTotal = v;
    },
    noticeArr(v) {
      this.notReadNotice = v;
    },
    isFullscreen(v) {
      if (v) {
        document
          .getElementsByClassName("fullscreen")[0]
          .childNodes[0].classList.add("highlight");
        document
          .getElementsByClassName("fullscreen")[0]
          .childNodes[2].classList.add("texthighlight");
        console.log(
          "sssssssssssssss",
          document.getElementsByClassName("screen")
        );
        document.getElementsByClassName("screen")[0].innerText = "退出";
      } else {
        document
          .getElementsByClassName("fullscreen")[0]
          .childNodes[0].classList.remove("highlight");
        document
          .getElementsByClassName("fullscreen")[0]
          .childNodes[2].classList.remove("texthighlight");
        document.getElementsByClassName("screen")[0].innerText = "全屏";
      }
    },
    notReadNoticeTotal(v, oldV) {
      if (v > oldV) {
        this.$message({
          type: "info",
          message: `您有${v}条未读消息`
        });
      }
    },
    $route(to, from) {
      if (to.path === "/login") {
        window.clearInterval(this.timer);
      }
      this.closeDialog();
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  created() {
    setTimeout(() => {
      this.getNewNotice();
    }, 2000);
  },
  mounted() {
    this.timer = setInterval(() => {
      this.getNewNotice();
    }, 30 * 1000);
    window.onresize = () => {
      // 全屏下监控是否按键了ESC
      if (!document.webkitIsFullScreen) {
        this.isFullscreen = false;
      }
      if (!this.checkFull()) {
        // 全屏下按键esc后要执行的动作
        this.isFullscreen = false;
      }
    };
    fetchUser()
      .then(res => {
        this.username = res.body.data.username;
      })
      .catch(err => {
        return err;
      });
  },
  methods: {
    getNewNotice() {
      const params = {
        index: 1,
        size: 10000,
        total: 0
      };
      notReadNotices(params).then(res => {
        if (res.body.data.length > 0) {
          this.notReadNoticeTotal = res.body.page.total;
          this.notReadNotice = res.body.data;
        } else {
          this.notReadNoticeTotal = "";
          this.notReadNotice = [];
        }
      });
    },
    closeDialog() {
      this.dialogVisable = false;
    },
    dialogConfirm() {
      upReadNotices(this.noticeForm.id).then(res => {
        this.dialogVisable = false;
        this.getNewNotice();
      });
    },
    handleCommand(command) {
      this.dialogVisable = true;
      this.noticeForm = command;
    },
    screenfull(e) {
      e.path.forEach(item => {
        if (item.className === "fullscreen") {
          item.childNodes[0].classList.toggle("highlight");
        }
      });
      screenfull.toggle();
      this.isFullscreen = !this.isFullscreen;
    },
    /**
     * 是否全屏并按键ESC键的方法
     */
    checkFull() {
      var isFull =
        document.fullscreenEnabled ||
        window.fullScreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenEnabled;
      // to fix : false || undefined == undefined
      if (isFull === undefined) {
        isFull = false;
      }
      return isFull;
    },
    toggleSideBar() {
      this.$store.dispatch("toggleSideBar");
    },
    // logout() {
    //   this.$store.dispatch('LogOut').then(() => {
    //     location.reload()// In order to re-instantiate the vue-router object to avoid bugs
    //   })
    // },
    // huanglulu
    businessLogout() {
      // window.location.href = `${process.env.LOGOUT_URL}`;
      logout()
        .then(res => {
          Cookies.remove("token");
          Cookies.remove("username");
          Cookies.remove("userId");
          Cookies.remove("level");
          this.$store.dispatch("FedLogOut").then(() => {
            this.$router.push("/login");
          });
        })
        .catch(err => {
          return err;
        });
      // Cookies.remove('token')
      // Cookies.remove('username')
      // Cookies.remove('userId')
      // Cookies.remove('level')
      // this.$store.dispatch('FedLogOut').then(() => {
      //   this.$router.push('/login')
      // })
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
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navToggle {
  padding-left: 85px !important;
  transition: all 0.18s linear;
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
    .highlight {
      fill: #e6a23c;
    }
    .texthighlight {
      color: #e6a23c;
      font-weight: 700;
    }
  }
}
label {
  width: 100px;
}
.notice {
  position: relative;
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
