<template>
  <div class="loginContainer" style="display: flex; height: 100%;">
    <div class="leftLogo">
      <div class="leftTop">
        <img src="./images/leftTop.png" alt="">
      </div>
      <div class="rightTop">
        <img src="./images/rightTop.png" alt="">
      </div>
      <div class="leftBottom">
        <img src="./images/leftBottom.png" alt="">
      </div>
      <div class="rightBottom">
        <img src="./images/rightBottom.png" alt="">
      </div>
      <div class="logo">
        <img src="./images/logo.png" alt="">
      </div>
    </div>
    <div class="loginFormContainer">
      <div class="login">
        <div key="min-logo" class="logo" ></div>
        <p class="title">账号密码登录</p>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
          <el-form-item prop="username">
            <div class="accountIcon"></div>
            <el-input v-model="loginForm.username" type="text" placeholder="账户" class="userName"></el-input>
          </el-form-item>
          <el-form-item :error="erroruserMsg" prop="password">
            <div class="passwordIcon"></div>
            <el-input v-model="loginForm.password" type="password" placeholder="密码" class="passWord" ></el-input>
          </el-form-item>
          <!-- <el-form-item :error="errorcodeMsg" class="yzm" prop="yzm">
            <div class="yzmIcon"></div>
            <el-input v-model="loginForm.yzm" type="text" placeholder="请输入验证码" @keyup.enter.native="login"></el-input>
            <div class="yzmImg" style="margin-left: 12px;height:40px;position:absolute;right:0;top:0;width:102px" @click="refreshImg">
              <img :src = "verifyImgUrl" height="40" width="102">
            </div>
          </el-form-item> -->
        </el-form>
        <div>
          <el-button class="btn" type="warning" @click="login">登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { encryptAes } from './js/AES'
const Base64 = require('js-base64').Base64
import config from '@/config'
import { loginGetToken } from '../../api/login'
import { fetchUser } from '../../api/user'
const {
  prefix: { userPrefix }
} = config
// const yzmImg = userPrefix + '/v1/verify'
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
        // yzm: ''  // 验证码
      },
      // verifyImgUrl: yzmImg + '?' + new Date().getTime(),
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入用户名' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入密码' }
        ]
        // yzm: [
        //   { required: true, trigger: 'blur', message: '请输入验证码' }
        // ]
      },
      // errorMsg: '',
      erroruserMsg: '',
      errorcodeMsg: '',
      token: ''
    }
  },
  created() {
    this.setCookerTian()
  },
  methods: {
    // 刷新验证码
    // refreshImg() {
    //   this.verifyImgUrl = yzmImg + '?' + new Date().getTime()
    // },
    // 自动填充
    setCookerTian() {
      this.loginForm = {
        username: '',
        password: ''
        // yzm: ''
      }
      // 在页面加载时从cookie获取登录信息
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      // 如果存在赋值给表单，并且将记住密码勾选
      if (username && password) {
        this.loginForm.username = username
        this.loginForm.password = Base64.decode(password)
      } else {
        this.loginForm.username = ''
        this.loginForm.password = ''
      }
    },
    // 记住密码 则将用户名和密码保存在cookie中
    // setCooker(username, password) {
    //   if (this.loginForm.type) {
    //     Cookies.set('username', username)
    //     Cookies.set('password', Base64.encode(password))
    //   }
    // },
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const redirect_url_front = this.$route.query.redirect_url
          const redirect = this.$route.query.redirect
          // const passWord = Base64.encode(this.loginForm.password.trim())
          // const result = testPassword(this.loginForm.password.trim())
          // if(result === 0){
          const passWord = this.loginForm.password.trim()
          const params = {
            username: this.loginForm.username.trim(),
            password: passWord
          }
          this.erroruserMsg = ''
          this.errorcodeMsg = ''
          loginGetToken(params).then((resp) => {
            if (resp.code === 0) {
              // 把token存在cookie中
              Cookies.set('token', resp.body.data)
              // localStorage.setItem('token', resp.body.data)
              fetchUser().then((res) => {
                console.log('res level', res.body.data.permissions.level)
                const level = res.body.data.permissions.level
                // localStorage.setItem('userId', res.body.data.id)
                Cookies.set('userId', res.body.data.id)                
                Cookies.set('level', res.body.data.permissions.level)                
                Cookies.set('username', res.body.data.username) 
                if (level === 2 ) {
                  this.$router.push('/ecloudwatch')
                } else {
                  this.$router.push('/dashboard')
                }            
              }).catch(err => {
                console.log(err)
              })
            } else {
              // this.refreshImg()
              if (resp.code === 'USER_WRONG') {
                this.erroruserMsg = resp.msg
              } else if (resp.code === 'CODE_EXPIRES') {
                this.errorcodeMsg = resp.msg
              } else if (resp.code === 'CODE_ERROR') {
                this.errorcodeMsg = resp.msg
              } else {
                return false
              }
            }
            // eslint-disable-next-line handle-callback-err
          }).catch(error => {
            console.log(error)
            // this.refreshImg()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
body {
  .leftLogo {
    position: relative;
    .leftTop {
      position: absolute;
      top: -200px;
      left: -30px;
      width: 300px;
      height: 300px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .rightTop {
      position: fixed;
      top: -124px;
      right: -160px;
      width: 300px;
      height: 300px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .leftBottom {
      position: fixed;
      bottom: -260px;
      left: -150px;
      width: 400px;
      height: 400px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .rightBottom {
      position: fixed;
      bottom: -200px;
      right: -180px;
      width: 400px;
      height: 400px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .logo {
      position: absolute;
      top: 20px;
      left: 40px;
      width: 200px;
      height: 24px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .loginContainer {
    width: 100%;
    height: 100%;
    background:url(./images/loginBackground.png) no-repeat center, -webkit-linear-gradient(135deg, #50D0FF 0%, #1988D7 37%, #243495 100%);
    background-size: 100% 100%;
    background-position: bottom center;
  }

  .loginFormContainer {
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    flex:1;
  }
  .login {
    background-color: #fff;
    width: 400px;
    height: 420px;
    padding: 20px 20px;
    border-radius: 10px;
    position: fixed;
    top: 50%;
    right: 50px;
    transform: translateY(-50%);
    flex-direction: column;
    justify-content: center;
    padding-bottom: 30px;
    .logo{
      width:352px;
      height: 70px;
      background: url(./images/logoTitel.png) no-repeat center;
      background-size: 60% 60%;
      margin-left: 10px;
      // background-size: contain;
    }
    .title {
      height: 24px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      line-height: 24px;
      margin: 30px 0;
    }
    .userName,
    .passWord {
      width: 100%;
      height: 40px;
    }
    .btn {
      width: 368px;
      height: 40px;
      border-radius: 4px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      line-height: 20px;
      margin-top: 30px;
    }
    .el-input__inner {
      text-indent: 15px;
      height: 40px;
    }
    .el-form-item.el-form-item--medium {
        margin-bottom: 20px;
    }
    .el-checkbox__label {
        font-family: PingFangSC-Regular;
        color: #333333;
        line-height: 22px;
        width: 96px;
        height: 22px;
    }

  }
  .accountIcon {
      width: 10.4px;
      height: 14px;
      background-color: rgba(0,0,0,0.25);
      background: url(./images/account.png) no-repeat center;
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 999;
  }
  .passwordIcon {
      width: 10.4px;
      height: 14px;
      background-color: rgba(0,0,0,0.25);
      background: url(./images/password.png) no-repeat center;
      position: absolute;
      top: 12px;
      left: 10px;
      z-index: 999;
  }
  .yzmIcon {
      width: 12px;
      height: 15px;
      background-color: rgba(0,0,0,0.25);
      background: url(./images/yzm.png) no-repeat center;
      position: absolute;
      top: 12px;
      left: 10px;
      z-index: 999;
  }
  .yzm {
    .el-form-item__content {
      // display: flex;
      //line-height: 53px;
      // line-height: 68px;
      // height: 40px;
      .el-input.el-input--medium {
        width: 258px
      }
    }
  }
}
</style>
