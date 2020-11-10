import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import 'lib-flexible'
// import { enhance } from './router/enhance'
// import Router from 'vue-router'
// import { constantRouterMap } from '@/router/routers'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
// simulation data
// if (process.env.NODE_ENV !== 'production') require('@/mock')
import config from '@/config'
import installPlugin from '@/plugin'
import importDirective from '@/directive'

import * as filters from './filters' // global filters
// 引入高德地图
import VueAMap from 'vue-amap'
import 'lib-flexible/flexible.js'
Vue.config.productionTip = false
Vue.use(VueAMap)

VueAMap.initAMapApiLoader({
  key: '000cee9e7ed83849c5cee8fdec93478c',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType'],
  v: '1.4.4'
})
// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts')
// 引入折线图/柱状图等组件
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/radar')
// 引入提示框和title组件，图例
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/legendScroll') // 图例滚动
// vue全局注入echarts
Vue.prototype.$echarts = echarts
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor /* { default global options } */)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * 注册指令
 */
importDirective(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

// Vue.use(Router)
// let instance = null

// const router = new Router({
//   mode: 'history',
//   routes: constantRouterMap,
//   scrollBehavior: () => ({
//     y: 0
//   })
// })

// 给router添加动态路由
// enhance(router)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

// 设置localstorage关闭浏览器情况数据 但是切换浏览器tab栏也会清除 暂不使用

// //设置cookie
// function setCookie(name, value, seconds) {
//   seconds = seconds || 0;   //seconds有值就直接赋值，没有为0
//   var expires = "";
//   if (seconds != 0) {      //设置cookie生存时间
//     var date = new Date();
//     date.setTime(date.getTime() + (seconds * 1000));
//     expires = "; expires=" + date.toGMTString();
//   }
//   document.cookie = name + "=" + escape(value) + expires + "; path=/";   //转码并赋值
// }
// function setInof(key, value) {
//   localStorage.setItem(key, value);
//   setCookie(key,value)//存储localStorage的同时，也存储一个cookie来监听
// }

//  //取得cookie
//  function getCookie(name) {
//   var nameEQ = name + "=";
//   var ca = document.cookie.split(';'); //把cookie分割成组
//   for (var i = 0; i < ca.length; i++) {
//     var c = ca[i]; //取得字符串
//     while (c.charAt(0) == ' ') { //判断一下字符串有没有前导空格
//       c = c.substring(1, c.length); //有的话，从第二位开始取
//     }
//     if (c.indexOf(nameEQ) == 0) { //如果含有我们要的name
//       return unescape(c.substring(nameEQ.length, c.length)); //解码并截取我们要值
//     }
//   }
//   return false;
// }
// if(!getCookie('Token')){
//  //清除
//   localStorage.clear();
// }
