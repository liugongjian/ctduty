<template>
  <div id="alarmInfo" class="alarmInfo" @click="watchClick">
    <div class="map">
      <div class="switch">
        <el-switch
          v-model="isHint"
          inactive-text="告警提示音"
        >
        </el-switch>
      </div>
      <el-amap
        :amap-manager="amapManager"
        :center="center"
        :events="events"
        :zoom="zoom"
        map-style="amap://styles/normal"
        class="amap-demo"
        vid="amapDemo"
      >
        <el-amap-marker
          v-for="(marker, index) in markers"
          :events="events"
          :id="'point'+index"
          :key="index"
          :position="marker.position"
          :vid="index"
          :content="marker.content"
          @click="markerClick"
        ></el-amap-marker>
      </el-amap>
      <div class="warn" style="background:rgba(0,0,0,0)">
        <div class="dispose" style="opacity:1;background:#fff;margin-bottom:20px;">
          <div class="watchtitle">
            <div :class="[{'active': showActive}, 'alarm', 'dash-title']" @click="alarmRate">告警处理率</div>
            <div :class="[{'active': alarmActive}, 'alarmMonitoring', 'dash-title']" @click="monitoring">实时监控</div>
          </div>
          <div v-show="showAlarm === 'rate'" class="disbox" style="height: 100%; width:100% margin-bottom: 16px;">
            <div id="panel" style="height: 80%; width:100%"></div>
            <!-- <div class="num">
              <div class="processed">已处理: <span style="color:#A3CB38;">{{ todayHandleds > 9999 ? `${999 + '+'}` : todayHandleds }}</span></div>
              <div class="untreated">未处理: <span style="color:red;">{{ todayUndeal > 9999 ? `${999 + '+'}` : todayUndeal }}</span></div>
            </div> -->
          </div>
          <div v-if="showAlarm === 'monitoring'" class="videoBox" style="height: 100%; width:100%;border-bottom:1px solid #ccc;">
            <div style="height: 90%; width:100%;border-bottom:1px solid #ccc;">
              <VideoPlayer v-if="hasUrl" :options="videoOptions"/>
              <div v-if="cameraId === null" style="text-align:center;padding-top:20%;font-size:20px;font-weight:700;color:#95afc0;">
                {{ cameraState }}
              </div>
            </div>
          </div>
        </div>
        <div class="bottom" style="opacity:1;background:#fff;margin-top: 13px;">
          <div class="dash-title todayAlarm">
            今日告警
          </div>
          <div class="bottom-left">
            <div style="width:100%; height:35px;">
              <div :style="{'border-color':showTabValue === 'all'? '#1890ff':'#D9D9D9'}" class="zuo" style="line-height: 30px;border: 1px solid #D9D9D9;text-align:center;" @click="allTab">
                <p :style="{'color':showTabValue === 'all'? '#1890ff':'#333'}">
                  全部(<span>{{ todayAlerts > 9999 ? `${999 + '+'}` : todayAlerts }}</span>)
                </p>
              </div>
              <div :style="{'border-color':showTabValue === 'y'? '#1890ff':'#D9D9D9', width: '28%'}" class="zhong" style="line-height: 30px;border: 1px solid #D9D9D9;text-align:center;" @click="yTab">
                <p :style="{'color':showTabValue === 'y'? '#1890ff':'#333'}">
                  已处理(<span style="color:#A3CB38;">{{ todayHandleds > 9999 ? `${999 + '+'}` : todayHandleds }}</span>)
                </p>
              </div>
              <div :style="{'border-color':showTabValue === 'w'? '#1890ff':'#D9D9D9', width: '28%'}" class="you" style="line-height: 30px;border: 1px solid #D9D9D9;text-align:center;" @click="wTab">
                <p :style="{'color':showTabValue === 'w'? '#1890ff':'#333'}">
                  未处理(<span style="color:red;">{{ todayUndeal > 9999 ? `${999 + '+'}` : todayUndeal }}</span>)
                </p>
              </div>
              <div class="bottom-right">
                <ul>
                  <li style="float:right;line-height: 20px;margin-left:5px;font-size:12px;">
                    <a @click="()=>{this.$router.push('/alarmMessage')}">历史告警</a>
                  </li>
                </ul>
              </div>
            </div>
            <div v-if="stepsData.length" class="zuoContent" style="width:100%; height:35vh;overflow: auto;padding:10px 20px;">
              <div v-if="showTabValue === 'all'">
                <el-button v-if="isOnlyCameraData" type="text" @click="allAlarm">全部数据</el-button>
                <div :data="stepsData" style="margin-top:10px;">
                  <template v-if="stepsData.length">
                    <div
                      v-for="(item, index) in stepsData"
                      :key="index"
                      class="stepword"
                      @click="showDialogFather(item)"
                    >
                      <div style="height:32px; width:32px; float:left" class="lefticon">
                        <svg-icon v-if="item.state === 0" class="deal" icon-class="deal" />
                        <svg-icon
                          v-else-if="item.state === 1"
                          class="untreated"
                          icon-class="untreated2"
                        />
                        <svg-icon
                          v-else-if="item.handlerId === null"
                          class="untreated"
                          icon-class="untreated"
                        />
                        <div v-if="index !== stepsData.length -1" class="shu"></div>
                      </div>
                      <div class="youContent" style="float:right width:100%;">
                        <p class="dizhi">{{ item.camera ?item.camera.address : '' }}</p>
                        <div class="addressword">
                          <svg-icon v-if="item.type === 1" class="trafficSvg" icon-class="people" />
                          <svg-icon v-else-if="item.type === 2" class="trafficSvg" icon-class="car" />
                          <svg-icon v-else class="trafficSvg" if="item.type === 3" icon-class="bicycle" />
                          <span
                            style="width:100%; font-size: 12px; color:#7e7e7e; margin-top: 4px;"
                          >{{ renderTime(item.createTime) }}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <div v-if="showTabValue === 'y'">
                <template>
                  <div
                    v-for="(item, index) in yData"
                    :key="index"
                    class="stepword"
                    @click="showDialogFather(item)"
                  >
                    <div style="height:32px; width:32px; float:left" class="lefticon">
                      <svg-icon v-if="item.state === 0" class="deal" icon-class="deal" />
                      <svg-icon
                        v-else-if="item.state === 1"
                        class="untreated"
                        icon-class="untreated2"
                      />
                      <svg-icon
                        v-else-if="item.handlerId === null"
                        class="untreated"
                        icon-class="untreated"
                      />
                      <div v-if="index !== yData.length -1" class="shu" style="height:16px;"></div>
                    </div>
                    <div class="youContent" style="float:right width:100%;">
                      <p class="dizhi">{{ item.camera ?item.camera.address : '' }}</p>
                      <div class="addressword">
                        <svg-icon v-if="item.type === 1" class="trafficSvg" icon-class="people" />
                        <svg-icon v-else-if="item.type === 2" class="trafficSvg" icon-class="car" />
                        <svg-icon v-else class="trafficSvg" if="item.type === 3" icon-class="bicycle" />
                        <span
                          style="width:100%; font-size: 12px; color:#7e7e7e; margin-top: 4px;"
                        >{{ renderTime(item.createTime) }}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <div v-if="showTabValue === 'w'">
                <template>
                  <div
                    v-for="(item, index) in xData"
                    :key="index"
                    class="stepword"
                    @click="showDialogFather(item)"
                  >
                    <div style="height:32px; width:32px; float:left" class="lefticon">
                      <svg-icon v-if="item.state === 0" class="deal" icon-class="deal" />
                      <svg-icon
                        v-else-if="item.state === 1"
                        class="untreated"
                        icon-class="untreated2"
                      />
                      <svg-icon
                        v-else-if="item.handlerId === null"
                        class="untreated"
                        icon-class="untreated"
                      />
                      <div v-if="index !== xData.length -1" class="shu"></div>
                    </div>
                    <div class="youContent" style="float:right width:100%;">
                      <p class="dizhi">{{ item.camera ?item.camera.address : '' }}</p>
                      <div class="addressword">
                        <svg-icon v-if="item.type === 1" class="trafficSvg" icon-class="people" />
                        <svg-icon v-else-if="item.type === 2" class="trafficSvg" icon-class="car" />
                        <svg-icon v-else-if="item.type === 3" class="trafficSvg" icon-class="bicycle" />
                        <span
                          style="width:100%; font-size: 12px; color:#7e7e7e; margin-top: 4px;"
                        >{{ renderTime(item.createTime) }}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div v-else class="zuoContent" style="width:100%; height:35vh;overflow: auto;padding:20px;">
              <div v-if="showTabValue === 'all'">
                暂无数据
              </div>
              <div v-if="showTabValue === 'y'">
                暂无数据
              </div>
              <div v-if="showTabValue === 'w'">
                暂无数据
              </div>
            </div>
          </div>
          <el-dialog
            v-model="temp"
            :visible="dialogVisable"
            title="报警显示"
            width="750px"
            @close="closeDialog"
          >
            <el-form :model="dataDia" label-position="right" label-width="100px">
              <el-form-item label="流量状态:">
                <span style="width: 300px;">{{ dataDia.camera?dataDia.camera.address : '' }}</span>
              </el-form-item>
              <el-form-item label="监控时间:">
                <span style="width: 300px;">
                  {{
                    renderTime(dataDia.createTime)
                  }}
                </span>
              </el-form-item>
              <el-form-item label="原始照片:" prop="image">
                <el-image :src="dataDia.imageCompress" style="width:525px; height:300px;" @click="()=>{openBig(dataDia.image)}"></el-image>
              </el-form-item>
              <el-form-item label="结构化照片:" prop="imageCut">
                <el-image :src="dataDia.imageCut" style="width:150px;"></el-image>
              </el-form-item>
              <el-form-item label="触发事件:" prop="type">
                <span v-if="dataDia.type === 1">人员</span>
                <span v-else-if="dataDia.type === 2">机动车</span>
              </el-form-item>
              <el-form-item v-if="dataDia.label" label="布控标签:" prop="label">
                <span v-if="dataDia.label === 1">白名单</span>
                <span v-else-if="dataDia.label === 2">黑名单</span>
                <span v-else-if="dataDia.label === 3">其他</span>
              </el-form-item>
              <!-- 车牌 -->
              <el-form-item v-if="dataDia.license" label="车牌:" prop="license">
                <span>{{dataDia.license}}</span>
              </el-form-item>
              <!-- 人员 -->
              <!-- <el-form-item v-if="licence" label="姓名:" prop="licence">
                <span>{{dataDia.licence}}</span>
              </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button round @click="normal">正 常</el-button>
              <el-button type="warning" round @click="unnormal">异 常</el-button>
            </div>
          </el-dialog>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="page"
            :limit.sync="limit"
            @pagination="pageChange()"
          />
        </div>
      </div>
    </div>
    <div v-if="markers.length>0"></div>

  </div>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer'
import Cookies from 'js-cookie'
import echarts from 'echarts'
// 引入水球
import 'echarts-liquidfill'
// 引入基本模板
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import { fetchalarmList, notifyState } from '@/api/alarm'
import { fetchAllCameraList } from '@/api/camera'
import { play, stop } from '@/api/monitor'
import { fetchSinMan, fetchNowInfo } from '@/api/dashboard'
import { getPushSet } from '@/api/alarm.js'
import Pagination from '@/components/Pagination'
import { renderTime } from '@/utils'
import VueAMap from 'vue-amap'
import moment from 'moment'
import hintMusic from './assets/hint.mp3'
const amapManager = new VueAMap.AMapManager()
export default {
  name: 'ECloudWatch',
  components: { Pagination, VideoPlayer },
  // components: { CameraList },
  // eslint-disable-next-line vue/require-prop-types
  props: ['data', 'defaultActive'],
  data() {
    return {
      timer: null,
      cameraState: '请选择要查看的摄像头',
      HTMLDoms: null,
      dataError: [],
      dataDia: {
        camera: {
        }
      },
      isHint: true,
      // alarmForm: {
      //   address: '',
      //   createTime: ''
      // },
      temp: {
        camera: {
        },
        createTime: '',
        image: '',
        imageCut: ''
      },
      yData: [
      ],
      // TabLan: all,
      dialogVisable: false,
      activeName: 'first',
      formInfo: [],
      active: 0,
      stateData: '',
      stepsData: [],
      values: 3,
      xData: [
      ],
      zoom: 12,
      hasMarker: false,
      showZwMes: true,
      center: [110.09, 34.58],
      markersDom: null,
      showTabValue: 'all',
      showAlarm: 'rate',
      markers: [],
      amapManager,
      total: 0,
      allTotal: 0,
      page: 1,
      limit: 10,
      timer2: '',
      isOnlyCameraData: false,
      events: {
        click: a => {}
      },
      renderTime,
      isPush: null,
      timer3: '',
      timer4: '',
      hasMouse: false,
      timers: [],
      rate: null,
      showActive: true,
      alarmActive: false,
      videoOptions: {},
      cameraId: null,
      hasUrl: null,
      todayAlerts: null,
      // 当天已处理
      todayHandleds: null,
      // 当天未处理
      todayUndeal: null
    }
  },
  watch: {
    markers(v) {
      setTimeout(() => {
        if (document.getElementsByClassName('markerImg').length) {
          this.hasMarker = true
        } else {
          this.hasMarker = false
        }
      }, 300)
    },
    hasMarker(v) {
      const that = this
      if (v) {
        [].forEach.call(document.getElementsByClassName('markerImg'), function(item, index) {
          if (index === 0) {
            that.center = [JSON.parse(item.attributes[1].nodeValue).longitude, JSON.parse(item.attributes[1].nodeValue).latitude]
            that.zoom = 15
            that.showZwMes = false
          }
        })
      }
    },
    limit() {
      this.page = 1
      this.pageChange()
    },
    $route(to, from) {
      window.clearInterval(this.timer)
    },
    isPush(v) {
      if (v) {
        this.timer = setInterval(() => {
          const params = {
            cascade: true,
            page: {
              index: 1,
              size: 300
            },
            params: [
              {
                field: 'create_time',
                operator: 'BETWEEN',
                value: {
                  start: moment(Date.now() - 5 * 1000).format('YYYY-MM-DD HH:mm:ss'),
                  end: moment().format('YYYY-MM-DD HH:mm:ss')
                }
              }
            ],
            sorts: [
              {
                field: 'create_time',
                type: 'desc'
              }
            ]

          }
          fetchalarmList(params).then(response => {
            if (response.body.data.length) {
              window.clearTimeout(this.timer2)
              this.getalarmList()
              this.isOnlyCameraData = false
              this.showDialog(response.body.data[0], true)
            }
          })
        }, 5000)
      } else {
        setTimeout(() => {
          this.getalarmList()
          this.isOnlyCameraData = false
        }, 300000)
      }
    },
    xData(v) {
      const that = this
      that.timers.forEach(item => {
        window.clearInterval(item)
      })
      v.forEach(item => {
        setTimeout(() => {
          [].forEach.call(document.getElementsByClassName('markerImg'), function(dom, i) {
            if (item.camera.id === JSON.parse(dom.attributes[1].nodeValue).id) {
              window.clearInterval(that.timer6)
              that.timers[i] = setInterval(() => {
                dom.classList.add('markerClickImg')
                dom.timer6 = setTimeout(() => {
                  dom.classList.remove('markerClickImg')
                }, 500)
              }, 1000)
            }
          })
        }, 300)
      })
    }
  },
  async created() {
    this.userId = Cookies.get('userId')
    await this.getPush()
    await this.getalarmList()
    await this.getCameraList()
    await this.getPanelList()
  },
  mounted() {
    const that = this
    that.getPush()
    that.getalarmList()
    that.getCameraList()
    that.getPanelList()
    that.getPanel()
  },
  updated() {
    if (document.getElementsByClassName('markerImg').length) {
      this.hasMarker = true
    } else {
      this.hasMarker = false
    }
    this.getPanelList()
  },
  beforeDestroy() {
    window.clearInterval(this.timer)
  },
  methods: {
    allAlarm() {
      this.isOnlyCameraData = false
      this.getalarmList()
    },
    video_type(_url) {
      var url = _url.toLowerCase()
      if (url.startsWith('rtmp')) {
        return 'rtmp/flv'
      } else if (url.endsWith('m3u8') || url.endsWith('m3u')) {
        return 'application/x-mpegURL'
      } else if (url.endsWith('webm')) {
        return 'video/webm'
      } else if (url.endsWith('mp4')) {
        return 'video/mp4'
      } else if (url.endsWith('ogv')) {
        return 'video/ogg'
      }
    },
    showDialogFather(item) {
      this.showDialog(item)
    },
    openBig(url) {
      window.open(url)
    },
    getPush() {
      getPushSet().then(res => {
        this.isPush = JSON.parse(res.body.data.setting).deliveryPush
      })
    },
    getPanelList() {
      const params = {
        cascade: true,
        page: {
          index: 0,
          size: 0
        },
        params: {}
      }
      fetchSinMan(params).then(res => {
        this.total = res.body.data.offlineCameras + res.body.data.onlineCameras
        this.offCamera = res.body.data.offlineCameras
        this.alarmTime = res.body.data.todayAlerts
        this.processed = res.body.data.todayHandleds
        this.rate = parseInt(res.body.data.alertHandleRate * 100)
        this.getPanel(parseInt(res.body.data.alertHandleRate * 100))
        this.todayAlerts = res.body.data.todayAlerts
        this.todayHandleds = res.body.data.todayHandleds
        this.todayUndeal = parseInt(res.body.data.todayAlerts - res.body.data.todayHandleds)
      })
    },
    getCameraList() {
      const params = {
        cascade: true,
        page: {
          index: 1,
          size: 100000
        },
        params: {}
      }
      fetchAllCameraList(params).then(res => {
        this.formInfo = res.body.data
        /*  this.formInfo.forEach(item => {
          item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:SS')
        }) */
        this.markers = []
        this.showZwMes = true
        if (document.getElementsByClassName('markerClickImg').length) {
          document
            .getElementsByClassName('markerClickImg')[0]
            .classList.remove('markerClickImg')
        }
        this.formInfo.forEach(item => {
          this.markers.push({
            position: [
              item.longitude,
              item.latitude
            ],
            content: `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg class="icon markerImg ${item.online === 1 ? 'offline' : ''}" data=${JSON.stringify(item)}
                t="1599121043094" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2907" xmlns:xlink="http://www.w3.org/1999/xlink" width="40" height="40"><defs><style type="text/css"></style></defs><path d="M512.575 66.562c90.534 0 172.507 36.713 231.841 96.047 59.349 59.334 96.046 141.306 96.046 231.841 0 90.551-36.696 172.522-96.046 231.856-59.334 59.349-141.307 96.047-231.841 96.047-90.535 0-172.522-36.698-231.856-96.047C221.383 566.972 184.687 485 184.687 394.45c0-90.536 36.696-172.507 96.032-231.841 59.333-59.334 141.32-96.047 231.856-96.047zM441.27 439.874c16.993-53.202 41.838-91.409 97.927-125.07-60.031-17.437-129.499 48.742-97.927 125.07z m130.284 319.798v53.364l204.863 36.253v109.068H258.999V849.289l194.611-36.253v-53.349a267.622 267.622 0 0 0 58.965 6.563c20.266 0 40-2.282 58.979-6.578z m-58.979-515.121c-41.408 0-78.891 16.785-106.002 43.896-27.127 27.142-43.913 64.624-43.913 106.002 0 41.393 16.786 78.891 43.913 106.017 27.112 27.112 64.594 43.898 106.002 43.898 41.393 0 78.875-16.786 106.002-43.898 27.127-27.127 43.896-64.624 43.896-106.017 0-41.378-16.77-78.86-43.896-106.002-27.127-27.111-64.609-43.896-106.002-43.896z m73.348 76.564c-18.771-18.771-44.711-30.385-73.349-30.385-28.653 0-54.58 11.615-73.35 30.385-18.771 18.757-30.385 44.697-30.385 73.335 0 28.653 11.615 54.58 30.385 73.365 18.771 18.755 44.697 30.385 73.35 30.385 28.638 0 54.578-11.63 73.349-30.385 18.771-18.786 30.372-44.713 30.372-73.365 0-28.638-11.601-54.578-30.372-73.335z m71.424-71.439c-37.038-37.038-88.239-59.956-144.772-59.956-56.55 0-107.751 22.918-144.789 59.956-37.053 37.053-59.956 88.24-59.956 144.774 0 56.55 22.903 107.751 59.956 144.789 37.038 37.051 88.239 59.971 144.789 59.971 56.534 0 107.735-22.92 144.772-59.971C694.4 502.201 717.32 451 717.32 394.45c0-56.534-22.92-107.721-59.973-144.774z" p-id="2908"></path></svg>
                <span v-if='${item.state === null}' style='display: ${item.dealSum.split('/')[0] === '0' ? 'none' : 'inline-block'};
      width: 20px;
      height: 15px;
      font-size: 12px;
      line-height: 15px;
      text-align: center;
      color: #fff;
      position: absolute;
      border-radius: 5px 5px 5px 0;
      background-color: red;
      top: -10px;
      right: 20px;
      '>${+item.dealSum.split('/')[0] > 99 ? '99+' : item.dealSum.split('/')[0]}</span>`
          })
        })
      })
    },
    allTab() {
      this.showTabValue = 'all'
    },
    yTab() {
      this.showTabValue = 'y'
    },
    wTab() {
      this.showTabValue = 'w'
    },
    alarmRate(e) {
      this.showAlarm = 'rate'
      this.showActive = true
      this.alarmActive = false
      this.isOnlyCameraData = false
      this.getalarmList()
    },
    monitoring(e) {
      this.showAlarm = 'monitoring'
      this.showActive = false
      this.alarmActive = true
    },
    getalarmList() {
      const params = {
        cascade: true,
        page: {
          index: 1,
          size: 300
        },
        params: [
          {
            field: 'create_time',
            operator: 'BETWEEN',
            value: { start: moment(Date.now()).format(
              'YYYY-MM-DD 00:00:00'
            ),
            end: moment().format('YYYY-MM-DD HH:mm:ss')
            }
          }
        ],
        sorts: [
          {
            field: 'create_time',
            type: 'desc'
          }
        ]
      }
      fetchalarmList(params).then(response => {
        if (response.body.data.length) {
          this.getPanelList()
          this.stepsData = response.body.data
          this.yData = []
          this.xData = []
          response.body.data.forEach(item => {
            if (item.handlerId !== null) {
              this.yData.push(item)
            } else {
              this.xData.push(item)
            }
          })
        }
      })
    },
    watchClick(e) {
      if (!e.path.some(item => item.className === 'amap-marker-content')) {
        return
      }
      const marImgs = document.getElementsByClassName('markerImg');
      [].forEach.call(marImgs, function(item) {
        item.classList.remove('markerClickImg')
        item.setAttribute('width', 40)
        item.setAttribute('height', 40)
      })
      e.path.forEach(item => {
        if (item.className !== 'videoBox') {
          this.hasUrl = null
          this.cameraId = null
        }
        if (item.className === 'amap-marker-content') {
          this.hasUrl = null
          this.showAlarm = 'monitoring'
          this.showActive = false
          this.alarmActive = true
          if (!item.childNodes[1].classList.contains('offline')) {
            item.childNodes[1].classList.add('markerClickImg')
          }
          item.childNodes[1].setAttribute('width', 50)
          item.childNodes[1].setAttribute('height', 50)
          this.form = JSON.parse(item.childNodes[1].attributes[1].nodeValue)
          this.form.createTime = moment(this.form.createTime).format(
            'YYYY-MM-DD HH:mm:SS'
          )
          if (this.form.online !== 1) {
            // this.cameraState = '请选择要查看的摄像头'
            if (this.currentcameraId === this.form.id && this.videoOpen) {
              this.hasUrl = null
              this.videoOpen = false
            } else if (this.form.online !== 1) {
              this.cameraState = '正在加载直播流...'
              play(this.form.id).then(res => {
                this.hasUrl = true
                this.cameraId = this.form.id
                this.currentcameraId = this.form.id
                this.videoOpen = true
                this.videoOptions = {
                  autoplay: true,
                  controls: true,
                  width: 400, // 播放器宽度
                  height: 300, // 播放器高度
                  // poster: 'http://www.jq22.com/demo/vide7.1.0201807161136/m.jpg',
                  // fluid: true, // 流体布局，自动充满，并保持播放 其比例
                  // m3u8uri
                  sources: [
                    {
                      src: res.body.data.rtmpuri,
                      type: this.video_type(res.body.data.rtmpuri)
                    }
                  ]
                }
              })
            }
          } else {
            this.cameraState = '此摄像头已离线'
          }
          this.center = [this.form.longitude, this.form.latitude]
          this.showZwMes = false
          const params = {
            cascade: true,
            page: {
              index: 1,
              size: 300
            },
            params: [
              {
                field: 'cameraId',
                operator: 'EQUALS',
                value: this.form.id
              }
            ],
            sorts: [
              {
                field: 'create_time',
                type: 'desc'
              }
            ]

          }
          fetchalarmList(params).then(response => {
            if (response.body.data.length) {
              this.getPanelList()
              this.stepsData = response.body.data || []
              this.yData = []
              this.xData = []
              response.body.data.forEach(item => {
                if (item.handlerId !== null) {
                  this.yData.push(item)
                } else {
                  [...this.timers].forEach((item, index) => {
                    window.clearInterval(item)
                    this.timers.splice(index, 1)
                  })
                  this.xData.push(item)
                }
              })
              // 两分钟后自动恢复默认全部列表
              this.isOnlyCameraData = true
              setTimeout(() => {
                this.getalarmList()
                this.isOnlyCameraData = false
              }, 120000)
            }
          })
        }
      })
    },
    markerClick() {

    },
    blink(dom) {
      window.clearInterval(this.timer4)
      this.timer3 = setInterval(() => {
        dom.classList.add('markerClickImg')
        this.timer4 = setTimeout(() => {
          dom.classList.remove('markerClickImg')
        }, 500)
      }, 1000)
    },
    showDialog(cameraInfo, isAlert) {
      this.dataDia = cameraInfo
      this.dialogVisable = true
      if (isAlert) {
        if (this.isHint) {
          const audio = new Audio(hintMusic)// 这里的路径写上mp3文件在项目中的绝对路径
          audio.play()// 播放
        }
        this.timer2 = setTimeout(() => {
          this.closeDialog()
        }, 5000)
      }
      this.center = [cameraInfo.camera.longitude, cameraInfo.camera.latitude]
      const markers = document.getElementsByClassName('markerImg');
      [].forEach.call(markers, function(item) {
        item.classList.remove('markerClickImg')
        item.setAttribute('width', 40)
        item.setAttribute('height', 40)
        if (JSON.parse(item.attributes[1].nodeValue).id === cameraInfo.camera.id) {
          item.setAttribute('width', 50)
          item.setAttribute('height', 50)
          item.classList.add('markerClickImg')
        }
      })
    },
    closeDialog() {
      this.dialogVisable = false
    },
    getPanel(rate) {
      this.charts = echarts.init(document.getElementById('panel'))
      this.charts.setOption({
        backgroundColor: '#fff',
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'
        },
        toolbox: {
          // 工具栏小图标
          show: false,
          feature: {
            restore: {},
            saveAsImage: {}
          }
        },
        series: [
          {
            name: '业务指标',
            type: 'gauge',
            splitNumber: 5,
            detail: {
              // 仪表盘详情，用于显示数据
              formatter: '{value}%',
              color: '#333333',
              fontSize: 16,
              fontWeight: 'bolder'
            },
            data: [
              {
                value: rate,
                name: ''
              }
            ],
            axisLine: {
              // 表盘样式
              show: true,
              lineStyle: {
                width: 6, // 表盘粗细
                color: [[1, '#2d82ff']],
                shadowBlur: 10,
                shadowColor: 'rgba(0, 103, 255, 0.2)',
                shadowOffsetX: 0,
                shadowOffsetY: 8
              }
            },

            axisTick: {
              show: false, // 是否显示坐标轴小标记，这里不显示
              length: 8, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: '#fff'
              }
            },
            splitLine: {
              // 分隔线
              length: 8, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'rgba(255, 255, 255, 0.2)'
              }
            },
            pointer: {
              // 指针样式
              width: 3
            },
            itemStyle: {
              // 指针阴影
              shadowBlur: 10,
              shadowColor: 'rgba(0, 103, 255, 0.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 8
            },
            axisLabel: {
              // 刻度标签。
              show: true, // 是否显示标签,默认 true。
              distance: 5, // 标签与刻度线的距离,默认 5。
              color: '#000', // 文字的颜色,默认 #fff。
              fontSize: 12, // 文字的字体大小,默认 5。
              formatter: function(value) {
                if (parseInt(value) === 0) {
                  return ''
                } else if (parseInt(value) === 20) {
                  return '差'
                } else if (parseInt(value) === 40) {
                  return '中'
                } else if (parseInt(value) === 60) {
                  return '良'
                } else if (parseInt(value) === 80) {
                  return '优'
                } else if (parseInt(value) === 100) {
                  return ''
                }
              } // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。 示例:// 使用字符串模板，模板变量为刻度默认标签 {value},如:formatter: '{value} kg'; // 使用函数模板，函数参数分别为刻度数值,如formatter: function (value) {return value + 'km/h';}
            },
            markPoint: {
              // 指针中心加一个小白点
              symbol: 'circle',
              symbolSize: 5,
              data: [
                // 跟你的仪表盘的中心位置对应上，颜色可以和画板底色一样
                {
                  x: 'center',
                  y: 'center',
                  itemStyle: {
                    color: '#FFF'
                  }
                }
              ]
            }
          }
        ]
      })
    },
    handleClick(tab, event) {
    },
    next() {
      if (this.active++ > 2) this.active = 0
    },
    normal() {
      const params = [{
        id: this.dataDia.id,
        state: 0,
        handlerId: this.userId

      }]
      notifyState(params, 0).then((res) => {
        this.getalarmList()
        this.getPanelList()
        this.dialogVisable = false
        this.isOnlyCameraData = false
      })
    },
    unnormal() {
      const params = [{
        id: this.dataDia.id,
        state: 1,
        handlerId: this.userId

      }]
      notifyState(params, 1).then((res) => {
        this.getalarmList()
        this.getPanelList()
        this.dialogVisable = false
        this.isOnlyCameraData = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.num {
  width: 80%;
  height: 30px;
  margin: 0 auto;
  display: flex;
  margin-top: 5px;
  position: absolute;
  bottom:10px;
  left: 50%;
  transform: translateX(-50%);
  div{
    width: 50%;
    padding:0 5px;
  }
}
.bottom {
  background-color: #fff !important;
  opacity:1 !important;
}
.dispose {
  background-color: #fff !important;
  opacity:1 !important;
}
.warn {
  height:78vh !important;
  margin-bottom: 20px;
  overflow: hidden;
}
.zuoContent::-webkit-scrollbar {/*滚动条整体样式*/
    margin-right: 20px;
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
}
.zuoContent::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #a4b0be;
}
.zuoContent::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
}
* {
  padding: 0;
  margin: 0;
  list-style: none;
}
#alarmInfo {
  padding: 0 !important;
}
.alarmMonitoring {
  border-left:1px solid #ccc;
}
.videoBox {
  border: none;
  background-color: #fff;
}
.markerClickImg {
   fill: #EA2027 !important;
 }
 .trafficSvg {
   fill : #1890ff !important;
 }
.alarmInfo {
  padding: 0px 20px;
  background: #f0f2f5;
  height: calc(100vh - 50px);
  width: 100%;
  .map {
    height: 100%;
    width: 100%;
    // background-color: #000;
    position: relative;
    overflow: hidden;
    .warn {
      margin-top: 10px;
      position: absolute;
      top: 70px;
      right: 10px;
      background-color: #ffffff;
      width: 320px;
      height: 100%;
      .top {
        width: 100%;
        height: 270px;
        background-color: #fff;
        border-bottom: 1px solid #f0f2f5;

        p {
          font-weight: 200;
          font-size: 14px;
          color: #5e5e5e;
          text-align: left;
        }
      }

      .bottom {
        width: 100%;
        height: 100%;
        background-color: #ffffff;

        .todyW {
          color: #000000;
          font-size: 12px;
          font-weight: 700;
        }

        .bottom-left {
          width: 100%;
          height: 100%;
          float: left;

          padding: 0 10px;
          padding-top: 8px;

          .zuo {
            float: left;
            width: 25%;
            height: 32px;
            background-color: #ffffff;
            p {
              color: #676767;
              font-size: 12px;
            }
            .zuoContent {
              background-color: pink;
            }
          }
          .zuo:hover {
            border: 1px solid #1890ff !important;
          }
          .zhong:hover {
            border: 1px solid #1890ff !important;
          }
          .you:hover {
            border: 1px solid #1890ff !important;
          }
          .zuo:active {
            color: #1890ff;
            border: 1px solid #1890ff !important;
          }
          .zhong:active {
            color: #1890ff;
            border: 1px solid #1890ff !important;
          }
          .you:active {
            color: #1890ff;
            border: 1px solid #1890ff !important;
          }
          .zhong {
            float: left;
            width: 25%;
            height: 32px;
            border: #1890ff;
            background-color: #ffffff;
            p {
              color: #676767;
              font-size: 12px;
            }
          }
          .you {
            float: left;
            width: 25%;
            height: 32px;
            border: #1890ff;
            background-color: #ffffff;
            p {
              color: #676767;
              font-size: 12px;
            }
          }
        }
      }

      .bottom-right {
        // width: 18%;
        height: 20px;
        // float: right;
        padding-top: 5px;
        a {
          color: #1890ff;
          font-size: 12px;
          text-align: center;
        }
      }
      .stepword {
        width: 100%;
        // margin-top: 5px;
      }
    }
  }
}
.disbox {
  position: relative;
}
.lefticon {
  height: 100%;
  .shu {
    width: 2px;
    height: 30px;
    background-color: #d9d9d9;
    margin-left: 8px;
    margin-top: 2px;
  }
}
.youContent {
  margin-bottom: 5px;
  overflow: hidden;
  cursor: pointer;
}
.dizhi {
  width: 100%;
  font-size: 15px;
  color: #000000;
  font-weight: 300;
  // margin-left: 10px;
  margin-bottom: 10px;
}
#panel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  &>div {
    width: 100%;
  }
}
.dispose {
  height: 210px;
  width: 100%;
  background-color: #fff;
}
.dash-title {
  position: relative;
  margin: 0;
  padding: 0;
  font-size: 16px;
  height: 40px;
  line-height: 40px;
  color: #333;
  .close {
    position: absolute;
    top: 20px;
    right: 10px;
    font-size: 16px;
    transform: translate(-50%, -50%);
  }
}
.todayAlarm {
  padding-left: 10px;
}
.status {
  margin-top: 20px;
}
.originImg {
  width: 380px;
  height: 250px;
}
.markerImg {
  fill: #3e94f9;
  width: 40px;
  height: 40px;
}
.markerClickImg {
  fill: #ff1a2e !important;
  width: 60px !important;
  height: 60px !important;
}
.watchtitle {
  display: flex;
  .dash-title {
    cursor: pointer;
    flex: 1;
    text-align: center;
    border-bottom: 1px solid #ccc;
  }
}
.active {
  color: #FF9832;
}
.switch {
  height: 50px;
  padding: 0 30px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content:flex-end;
  align-items: center;
  box-shadow: 0 1px 4px 0;
}
.offline {
  fill: #95afc0 !important;
  // cursor: no-drop;
}
</style>

