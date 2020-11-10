<template>
  <div id="alarmInfo" class="alarmInfo" @click="watchClick">
    <div class="map">
      <el-amap
        :amap-manager="amapManager"
        :center="center"
        :events="events"
        :zoom="zoom"
        :zooms="zooms"
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
          :ext-data="marker.extData"
          @click="markerClick"
        ></el-amap-marker>
        <el-amap-info-window
          v-if="dialogVisable"
          :auto-move="true"
          :position="window.position"
        >
          <div style="width:500px;height:350px; padding: 10px 10px 0px">
            <div :model="dataDia" label-position="right" label-width="100px">
              <div prop="image" style="width:480px;height:270px;position:relative;" @click="()=>{openBig(dataDia.image)}">
                <img :src="dataDia.image" width="480" height="270" style="z-index:1;">
                <CanvasDialog :img-url="dataDia.image" :left-top="[points[0],points[1]]" :name="dataDia.type === 1?'人员':dataDia.type === 2?'机动车':'非机动车'" :name-length="dataDia.type === 1?'2':dataDia.type === 2?'3':'4'" :right-bottom="[points[2],points[3]]" style="z-index:2;position:absolute;top:0;left:0;"></CanvasDialog>
              </div>
              <div class="popfooter">
                <el-tooltip :content="dataDia.camera.address" class="item" effect="light" placement="top-start">
                  <div class="popfooteraddress">
                    <svg-icon icon-class="pulladdress" style="color:#898989;"></svg-icon>
                    <span style="width: 260px;">{{ dataDia.camera?dataDia.camera.address : '' }}</span>
                  </div>
                </el-tooltip>
                <div class="popfootertime">
                  <svg-icon icon-class="pulltime" style="color:#a6a6a6;"></svg-icon>
                  <span style="width: 260px;">
                    {{
                      renderTime(dataDia.createTime)
                    }}
                  </span>
                </div>
              </div>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center; margin-top: 10px">
              <el-button class="warnnormal popwarn" round style="border-radius: 2px" @click="normal"><span class="spantext">正 常</span></el-button>
              <el-button class="warnunnormal popwarn" type="warning" round style="border-radius: 2px" @click="unnormal"><span class="spantext">异 常</span></el-button>
            </div>
          </div>
        </el-amap-info-window>
      </el-amap>
      <div class="warn">
        <el-tabs v-model="showAlarm" style="background-color:#fff;border-bottom:1px solid #e9e9e9;" @tab-click="handleClick">
          <el-tab-pane label="告警处理率" name="rate">
            <div class="disbox" style="height: 180px; width:100%">
              <div id="panel" class="panelown" style="height: 100%; width:100%"></div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="实时监控" name="monitoring">
            <div class="videoBox" style="height: 180px; width:100%;">
              <div style="height: 100%; width:100%;">
                <VideoPlayer v-if="hasUrl" :options="videoOptions"/>
                <div v-if="cameraId === null" style="text-align:center;padding-top:20%;font-size:20px;font-weight:700;color:#95afc0;">
                  {{ cameraState }}
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="bottom" style="opacity:1;background:#fff;">
          <div class="dash-title todayAlarm">
            今日告警
            <div style="float:right;line-height: 20px;margin-left:5px;font-size:12px;color:#FF9832;vertical-align: middle;margin:10px 30px;">
              <a @click="()=>{this.$router.push('/alarmMessage')}">历史告警 <svg-icon icon-class="rarrow"></svg-icon></a>
            </div>
            <!--  <span class="switch">
              <el-switch
                v-model="isHint"
                inactive-text="告警提示音"
              >
              </el-switch>
            </span> -->
          </div>
          <div style="width:100%; height:26px;display:flex;Justify-content：center;padding:0 1% 0 3%;cursor:pointer;overflow:hidden;">
            <div :style="{'border-color':showTabValue === 'all'? '#FF9832':'#D9D9D9', width: '30%'}" class="zuo" style="line-height: 26px;border: 1px solid #D9D9D9;text-align:center;" @click="allTab">
              <p :style="{'color':showTabValue === 'all'? '#FF9832':'#333'}">
                全部<span style="margin-left: 2px">{{ '(' + (todayAlerts > 9999 ? `${999 + '+'}` : todayAlerts) + ')' }}</span>
              </p>
            </div>
            <div :style="{'border-color':showTabValue === 'y'? '#1890ff':'#D9D9D9', width: '30%'}" class="zhong" style="line-height: 26px;border: 1px solid #D9D9D9;text-align:center;" @click="yTab">
              <p :style="{'color':showTabValue === 'y'? '#1890ff':'#333'}">
                已处理<span style="margin-left: 2px">{{ '(' + (todayHandleds > 9999 ? `${999 + '+'}` : todayHandleds) + ')' }}</span>
              </p>
            </div>
            <div :style="{'border-color':showTabValue === 'w'? '#1890ff':'#D9D9D9', width: '30%'}" class="you" style="line-height: 26px;border: 1px solid #D9D9D9;text-align:center;" @click="wTab">
              <p :style="{'color':showTabValue === 'w'? '#1890ff':'#333'}">
                未处理<span style="margin-left: 2px">{{ '(' + (todayUndeal > 9999 ? `${999 + '+'}` : todayUndeal) + ')' }}</span>
              </p>
            </div>

          </div>
          <div class="bottom-left">
            <div v-if="stepsData.length" class="zuoContent" style="width:100%;overflow: auto;">
              <div v-if="showTabValue === 'all'">
                <div v-if="hasData">
                  <div :class="{'not-allowed': isDisableAllAlarmBtn}">
                    <el-button v-if="isOnlyCameraData" :class="{'disable': isDisableAllAlarmBtn}" type="text" @click="allAlarm">全部数据</el-button>
                  </div>
                  <div :data="stepsData" style="margin-top:10px;">
                    <template v-if="stepsData.length">
                      <div
                        v-for="(item, index) in stepsData"
                        :key="index"
                        class="stepword"
                        @click="showDialog(item)"
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
                <div v-else style="text-align:center;padding-top:20%;font-size:20px;font-weight:700;color:#95afc0;">
                  此摄像头暂无告警信息
                </div>
              </div>
              <div v-if="showTabValue === 'y'">
                <template>
                  <div
                    v-for="(item, index) in yData"
                    :key="index"
                    class="stepword"
                    @click="showDialog(item)"
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
                      <div v-if="index !== yData.length -1" class="shu" style="height:30px;"></div>
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
                    @click="showDialog(item)"
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
            <div v-else class="zuoContent" style="width:100%;overflow: auto;">
              <div v-if="loading">
                <div v-if="showTabValue === 'all'" style="text-align:center;padding-top:20%;font-size:24px;font-weight:700;color:#FF9832;vertical-align:middle;">
                  <i class="el-icon-loading loading"></i>
                  <span style="display:inline-block;font-size:13px;line-height:24px;color:#FF9832;padding-bottom:5px;font-weight:500;">拼命加载中...</span>
                </div>
                <div v-if="showTabValue === 'y'" style="text-align:center;padding-top:20%;font-size:24px;font-weight:700;color:#FF9832;vertical-align:middle;">
                  <i class="el-icon-loading loading"></i>
                  <span style="display:inline-block;font-size:13px;line-height:24px;color:#FF9832;padding-bottom:5px;font-weight:500;">拼命加载中</span>
                </div>
                <div v-if="showTabValue === 'w'" style="text-align:center;padding-top:20%;font-size:24px;font-weight:700;color:#FF9832;vertical-align:middle;">
                  <i class="el-icon-loading loading"></i>
                  <span style="display:inline-block;font-size:13px;line-height:24px;color:#FF9832;padding-bottom:5px;font-weight:500;">拼命加载中</span>
                </div>
              </div>
              <div v-else>
                <div style="text-align:center;padding-top:20%;font-size:20px;font-weight:700;color:#95afc0;">
                  暂无数据
                </div>
              </div>
            </div>
          </div>
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
import CanvasDialog from '@/components/CanvasDialog'
import { play } from '@/api/monitor'
import { fetchSinMan } from '@/api/dashboard'
import { getPushSet } from '@/api/alarm.js'
import Pagination from '@/components/Pagination'
import { renderTime } from '@/utils'
import VueAMap from 'vue-amap'
import moment from 'moment'
import hintMusic from './assets/hint.mp3'
import newarrow from './assets/newarrow.png'
import { mapGetters } from 'vuex'
const amapManager = new VueAMap.AMapManager('container', {
  resizeEnable: true, // 是否监控地图容器尺寸变化
  zoom: 14 // 初始地图级别
})

export default {
  name: 'ECloudWatch',
  components: { Pagination, VideoPlayer, CanvasDialog },
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
      hasData: true,
      isHint: null,
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
      loading: true,
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
      isDisableAllAlarmBtn: false,
      zoom: 13,
      zooms: [13, 16],
      hasMarker: false,
      showZwMes: true,
      center: [110.170143, 34.567009],
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
      todayHandleds: null,
      todayUndeal: null,
      nowShowCameraId: null,
      allXDataCameraIDEQU: null,
      hasCameraDom: false,
      isPushOff: null,
      points: [],
      cameraAlarmObj: {

      },
      isFirDom: null,
      events: {
        click: info => {
          this.form = info.target.G.extData
          this.form.createTime = moment(this.form.createTime).format('YYYY-MM-DD HH:mm:SS')
          const markers = document.getElementsByClassName('markerImg');
          [].forEach.call(markers, function(item) {
            item.classList.remove('clickgif')
            item.classList.remove('markerClickImg')
          })
        }
      },
      window: {
        visable: false,
        position: [110.170143, 34.567009]
      }
    }
  },
  computed: {
    ...mapGetters([
      'hint'
    ])
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
            that.center = [that.form.longitude, that.form.latitude]
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
      this.isPushOff = false
      if (v) {
        this.timer = setInterval(() => {
          const params = {
            cascade: true,
            page: {
              index: 1,
              size: 500
            },
            params: [
              {
                field: 'create_time',
                operator: 'BETWEEN',
                value: {
                  start: moment(Date.now() - 5 * 1000).format('YYYY-MM-DD HH:mm:ss'),
                  end: moment().format('YYYY-MM-DD HH:mm:ss')
                }
              },
              {
                field: 'camera.inChargeId',
                operator: 'EQUALS',
                value: this.userId
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
              this.showDialog(response.body.data[0], true)
              this.getCameraList()
              const params = {
                cascade: true,
                page: {
                  index: 1,
                  size: 500
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
                  },
                  {
                    field: 'camera.inChargeId',
                    operator: 'EQUALS',
                    value: this.userId
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
                this.loading = true
                setTimeout(() => {
                  this.loading = false
                }, 10 * 1000)
                if (response.body.data.length) {
                  this.getPanelList()
                  if (!this.isOnlyCameraData) {
                    this.stepsData = response.body.data
                  }
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
            }
          })
        }, 5000)
      } else {
        setInterval(() => {
          this.isPushOff = true
          this.getCameraList()
          this.getalarmList()
        }, 300000)
      }
    }
  },

  async created() {
    this.userId = Cookies.get('userId')
    this.isHint = this.$store.state.notice.hint
    await this.getPush()
    await this.getalarmList()
    await this.getPanelList()
    await this.getCameraList()
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
      this.getalarmList()
      this.isDisableAllAlarmBtn = true
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
        params: {
          inChargeId: this.userId
        }
      }
      fetchAllCameraList(params).then(res => {
        this.formInfo = res.body.data
        this.markers = []
        this.showZwMes = true
        this.formInfo.forEach((item, index) => {
          if (this.isFirDom === null) {
            this.isFirDom = true
          } else {
            this.isFirDom = false
          }
          if (index === 0 && this.isFirDom) {
            this.form = item
            this.form.createTime = moment(this.form.createTime).format('YYYY-MM-DD HH:mm:SS')
            this.center = [item.longitude, item.latitude]
            this.zoom = 15
          }
          if (item.undealSum === '0') {
            this.markers.push({
              position: [
                item.longitude,
                item.latitude
              ],
              extData: item,
              content: `
              <div class='noalarmbox' style='width:60px;height:60px;'>
                 <svg class="icon markerImg ${item.online === 1 ? 'offline' : ''}"}  id=${item.id}  slot="reference"
                  t="1599121043094" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2907" xmlns:xlink="http://www.w3.org/1999/xlink" width="${this.nowShowCameraId === item.id ? '50' : '40'}" height="${this.nowShowCameraId === item.id ? '50' : '40'}"><defs><style type="text/css"></style></defs><path d="M512.575 66.562c90.534 0 172.507 36.713 231.841 96.047 59.349 59.334 96.046 141.306 96.046 231.841 0 90.551-36.696 172.522-96.046 231.856-59.334 59.349-141.307 96.047-231.841 96.047-90.535 0-172.522-36.698-231.856-96.047C221.383 566.972 184.687 485 184.687 394.45c0-90.536 36.696-172.507 96.032-231.841 59.333-59.334 141.32-96.047 231.856-96.047zM441.27 439.874c16.993-53.202 41.838-91.409 97.927-125.07-60.031-17.437-129.499 48.742-97.927 125.07z m130.284 319.798v53.364l204.863 36.253v109.068H258.999V849.289l194.611-36.253v-53.349a267.622 267.622 0 0 0 58.965 6.563c20.266 0 40-2.282 58.979-6.578z m-58.979-515.121c-41.408 0-78.891 16.785-106.002 43.896-27.127 27.142-43.913 64.624-43.913 106.002 0 41.393 16.786 78.891 43.913 106.017 27.112 27.112 64.594 43.898 106.002 43.898 41.393 0 78.875-16.786 106.002-43.898 27.127-27.127 43.896-64.624 43.896-106.017 0-41.378-16.77-78.86-43.896-106.002-27.127-27.111-64.609-43.896-106.002-43.896z m73.348 76.564c-18.771-18.771-44.711-30.385-73.349-30.385-28.653 0-54.58 11.615-73.35 30.385-18.771 18.757-30.385 44.697-30.385 73.335 0 28.653 11.615 54.58 30.385 73.365 18.771 18.755 44.697 30.385 73.35 30.385 28.638 0 54.578-11.63 73.349-30.385 18.771-18.786 30.372-44.713 30.372-73.365 0-28.638-11.601-54.578-30.372-73.335z m71.424-71.439c-37.038-37.038-88.239-59.956-144.772-59.956-56.55 0-107.751 22.918-144.789 59.956-37.053 37.053-59.956 88.24-59.956 144.774 0 56.55 22.903 107.751 59.956 144.789 37.038 37.051 88.239 59.971 144.789 59.971 56.534 0 107.735-22.92 144.772-59.971C694.4 502.201 717.32 451 717.32 394.45c0-56.534-22.92-107.721-59.973-144.774z" p-id="2908"></path></svg>
                  <div class='newdialog' style='display: ${this.nowShowCameraId === item.id ? 'none' : 'none'};z-index:999999999999999999999999999999999999999999;padding:0 5px;width:480px;height: 270px;font-size: 12px;line-height: 15px;text-align: center;color: #000;position: absolute;border-radius: 5px 5px 5px 0;background-color: #fff;top: -260px;right: -460px;'>${item.undealSum}</div>
              </div>
                `
            })
          } else if (item.online !== 1) {
            this.markers.push({
              position: [
                item.longitude,
                item.latitude
              ],
              extData: item,
              content: `<div class='gifbox'><img style='width:${this.nowShowCameraId === item.id ? '50px' : '40px'};height:${this.nowShowCameraId === item.id ? '50px' : '40px'};' id=${item.id} class="icon markergif markerImg"}   src='data:image/gif;base64,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' />
              <span v-if='${item.state === null}' style='display: ${item.undealSum ? 'inline-block' : 'none'};padding:0 5px;height: 15px;font-size: 12px;line-height: 15px;text-align: center;color: #fff;position: absolute;border-radius: 5px 5px 5px 0;background-color: red;top: -10px;right: ${item.undealSum.length === 1 ? '-5px' : item.undealSum.length === 2 ? '-10px' : item.undealSum.length === 3 ? '-18px' : '-23px'};'>${item.undealSum}</span>
              <div class='newdialog' style='display: ${this.nowShowCameraId === item.id ? 'none' : 'none'};z-index:999999999999999999999999999999999999999999999;padding:0 5px;width:480px;height: 270px;font-size: 12px;line-height: 15px;text-align: center;color: #000;position: absolute;border-radius: 5px 5px 5px 0;background-color: #fff;top: -260px;right: -460px;'>${item.undealSum}</div>
              </div>`
            })
          } else if (item.online === 1) {
            this.markers.push({
              position: [
                item.longitude,
                item.latitude
              ],
              extData: item,
              content: `<div class='gifbox'><img style='width:${this.nowShowCameraId === item.id ? '50px' : '40px'};height:${this.nowShowCameraId === item.id ? '50px' : '40px'};' id=${item.id} class="icon markergif markerImg"}   src='data:image/gif;base64,R0lGODlh9AH0AfQAAJWvwJWvwZavwJavwZevwZavwpWwwJWxwJWwwZWxwZawwJawwZewwZaxwZawwpexwgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEyABAAIf8LTkVUU0NBUEUyLjADAQAAACH/C0ltYWdlTWFnaWNrDWdhbW1hPTAuNDU0NTUALAAAAAD0AfQBAAX+ICSOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ikcslsOp/QqHRKrVqv2Kx2y+16v+CweEwum8/otHrNbrvf8Lh8Tq/b7/i8fs/v+/+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/Nw4JCgMGC8cDAQECDQIEDwfA0rcKCAYIANna29zd3tkCywoN0+WhBgYK3+vs7ezE5vGQA+ru9vf43QgI8v2BDtjyCRxIcIG/g3WWBSDIsKFABAMQSlSjwIDDixjz0ZvI0QuCBRlDirwnwGDHk1P+BggYybKlOwMoYyppMMClzZvrBMjcCaTBQpxAg3KLyLOoDZBCkyoFYCCA0actBARcSjWpTqhYSdSsynXpuKxP63Udq3QBP7AorZFdW9UpWonE2MqtavJtvIpz89K1O23BVr2Al57luytd4MNtCedCzJgrTMWzpjaeXBbyq7+UMydV4MCyqmSaQy8l6rkUUtGolZYWhTm1a6CPV3f6+bp20MGyL9G2zRtnAHK5KTmw2Ls4UAXBJYk1ztymgGjJG51uTt0l7uiGdlff3hL7oencw49E7l3QSvHoWV4t32d5+vcZ67LPAx6+/YvX58+RfL//Rf10OFCffwQORBqAbrj+V+CCA5GHIBvaMShhPvI9eMZ5E2Y4UH4WhqHhhwQd2CEYxIFo4j2xjehFhCe2+I2IKmbh4oz3xLgFjTi2A6ONUTyQ44/r7MhjEwwAaaQ3FQ7JRGtHNpmkkkiU2OSU2TwJJRFMUunklUlo6aU2QnLpw5dkZiPmEAOWeSSHZ+YgpZpaWtlmDWnCueWcOShop5Yp4jkDhnuW6WcNbwb6pZyDpsCfoWT2megKjAbq6KMnZGmkXwMkQ8wC1ShgVkl1AokopXq6OACnneFwjTGXUopCqRqW5BYRDlSDo6smJODirE1IFWqBvOJqogAOUhHXh2z6+at9YVYRAKz9Jdsmi/3+mTXGAoX65yq1zKaxrHiTtgnofc2SEcCi8IXLJbroHbMfgdIOCe12AYzKRrbiBSsmucXegS939qr4L3UKMPAHt9UZLOa8zOnbB3wBW/hevHscK165Fo5bnQEY92Fpc6nKi17HgAzcG8nzacxcv4soEx7LHbJr3CTfvjYkdzA/UnNqKEcns205R/KxbREnN3RtFD/CMM8qLi2aw5c4LVrRskmtmbqYHJ1ah9RRPcnPqWGd3M6Zia2Jyag92Nx6pKj8WtKloR2aKmRPBqBxUFtRzTHp7ENcOKcaoPAWdTPmNV9uo2Y2Ew4sUzg3HPcc5czsFXf4EA4AoHVDylQhN2X+kr/1OGCLG4EAwjaVToTVjJXX2+U+QLSWAg9AsflkoWeFemZPCHB7ZU7sThl2vSXQxOibwZ5D4pqxvdrviAWNpmbJMPF568EJz1juOEA/17NLgD0Z3FkhLxf5O3gPGKdKqK9XbuavlTcQ8efFvQ22OQ9ZbcrTID5q95tB/cYSQJS4by7ou8H1UBOAwRHhf4hZjW2OsEDX6C8IB2RLATkywK4YIYOKO0JtPFPBufQPBqx7XREgGJgTTuQ1tSMC88KzwRakUC6q20kJ5SI9HXTwNTVkwQ7Zsr+wrW5C89PBENeSwJMQwDXGE8ISqwOdILDwfXy54lx62D0TBTEFrqn+IlpcMwQQhqeJKEwNF2XyQ6Uk8QZmFM8aaxDHqthlio4RQhu3k8MYFAk1FzQK0+j3oy+a4IZkCSRPtMgWNLpAexkSwtbAgkc7EtJIb6wBIsfiwKeE8Ad7fI8hS8BAsKQNCFqaowwYSRYXTgM1rjwBKzWkyhicEiozBAwQ6sigS2qmlgcRTR8fWaZRjkA0xtQFJOWCSjU5cgWb5ApUZsmVZEbTiz8QTch4IpofVBJEsSRlaMLJi9AMswWhlFAmZRAaYMZjmWshpwjSOaEfwJMsRrnmUrLJKEXWgJqW5GbzfJBLL/mTBqF5JjDa2QN6fsgH3xRKMmvhI81ANFJg6kH+QefCE4eyxJ0riCiN5AmBuelQM2J0E0a3oVBZaqal5bQoD/64UnD0QJ+b2cnVNFrTbZxTBdTTaWa2mYOebmOUAN1nTHgZlB4wFUg9uKcHl5qZURqVG/KUKUqkWhWQpuCpRuqBSHEC08XwjgdjNVJZR4DToJB0FlrVwVW7sU4XeFQkdX0lZbyKgrvSqAdxnUgDMpNXIc61G3w9QWAlAlabAPaw3EisCRrrEgOe1YeQ7QYPkpoUyw4vfZnlxmNxd5LF4i+02yAnYUsLOh6gdhsHtWVrO5KZcA72tdpwLWXeCovLLg+3ud2BafvBVarwwK8/iu0L2gqUjiAXI7oFrub+dnAA3yKEuTcxpHSzsVYRWPcgxVWKcl+wXTMJ97MTea5DJEuC8ppXruiViHob8tMThDdQ0W2Mc3d73vLW1wRpdUkBOEJZlnTytOVl7wgC3JID9+O7CN7uf0swX4YomBYQroF7ARDOzFwYrvHFwYbDiV2b8LYVGUaoe7tbYYJ0VxYpnsGGP8zZ23Akxux074RJUGKXfBjGIb7BhgGwgx635MWxwLFsy1tYFbR4ICdmhZJhsOHuMpglUV7FlMnr3g8/WSBZVsWWXbDhHY/gy/kwM4aDHGHpfhHN+EByb9msYfd+8crj4chG8dnf7TY5BUZmiZxfcV+hqBkCcDaRlyn+M2hXFNqtfZZufhkz3l/gWSTdLTCVJh1BDlLmz69yL6cP05FHA0W7fh51YEo95haUF9V240hFYw1fNxe51b/AdUi3C5zf0vnBv55BjQW1g0uHpNILpcyhSwpccu55LMsG8WRAjQLpvriqrJ3MjxM9IQKoGjDU1oWmR3Jc4PKgALU9ybhFMtrQhtsE3LYHSuLtDtW+dtnGDsm8y8aDQP+o3fpFSWaQzYLqhjar/BW4riEV2h/7eySNTnJmHKzJ0Ip1tSh5NgEBbtR3m0AzUcz2ZOS57hZxvNMooSmtdTDssJZ74cmGORjnKs98ZyTattjpZuc6pnSzcbhtxugoSx7+kh/fouVAIblRfWDqpgoV2yc3VM9lHvNg00DjU4qdzp+u7KlHyuuTwfkt6C1vp2L0oprxNk+Ifmy0B4qkNte3IDVDUoPvSezdnDvQbcB2+xBVpb98Stwzksw9JbPpQTG6uPN+cTW99eHdgcrU+FmmkPOg7xgJcy1uafYvDVrlXYcK5jEidmbHCQiQZ0lKeZL6kXi8r14Cgq4YL/nJg5JKvY664cCCdbKUHgKDN47iRWB3uoMF6UIZvghGb5vfBz8jb4GlHgsZhNua8y2IN7QkcTTReZYSLWTHhxBm3aIo934tfEkNwWPQetdkOTWvl8f5yRJxCLQfmUNAvlA0r0z+Mk5PQ+/nf+k3SFKUId13TEZEGOEnfkSwgIkxBM8XEgf4C8x3c0XAIMpHAvrXWUWkfivkH78nTgRIGBWYEfFnWOliBBEod5YxQkbggC7BfyWIERM4DTN4ESFYAveXR0ZgfanBf78Ag/dQgyQghPiBBBMkQbWRgbJ0g+qRBEboDic4EdlnXEnghDc3hS2wgaqRG823BDvoelqITkATHFEohUwwf45BhPDGG3/nGbwBhIekbHJIAlVIFUx4EGrIQ06AAHtoE6fiBCcTHWHoEjnYAivoDQowhjJwh0tRh+aAhRhRf8vFhfUGiSiQiCOBidMAeq9xiDBAD0Lhh1RgicD+4x2F6BJsGIp+wRLgYwVnOITs4YO2QYk4MFjL5DsCYHlX4IhUwYnxEIsosgqa+FH6QX69kQrCaA/rpxjLaA/AmAfoxhzRGA/F1xuMWAh/qBer2BGSKBKg2AfPeA8DJjHUYYt7UB3Z+BTfmGec0I7spiLbkYd3MI740IyrYY/5cAn6WCM20o/20I1tAI8jIZBcRzCSQJCupyTFaGOOAJD+qCS+KBfYsggNCWlQkoq/iAjvgY/eAZEaUQimmBcxxCXwcS6BsI0D1ybkEo5XcJFK1SYwKV7oSAUzKV7KUi0GuQQ3qRQuSRi02C1wAJINsZN2MZKN8ZMy1JNW+CgaaUL+1XgDtsIgNamEErKIYcCUXWGUzvghA5B7vaiSxYErI6CQa2EMVEAsJ1KSZDmRzbcAbHkExTAjXFkaP2IMJ8YUWtlCZNmGTVISp7IAb4gCD+AT9TIlSokdRDlkN9GXX8WYiuaYKbCXkFlNkqkCblmZCXeZM6eZBJKYCBKUnpkeUckeTzmaD8iZW4ia76GaMLCYrMkOrsl+sbkdpWkhSFmbjzibM3CaugmOvEkDmfmbvhGcNTCcxNkSdbkuySkaHmmcbNWcUAedUimdSUmdmGWdgbF62ElH2olF3bkDyPmd7LCcuJKb5PkNt4kr45me3BWe/+eeDgmfBSifOGGerun+m6y5jvR5ArCJUesZnPoJmaDZn/ZnnxhBjwaaAv9ZTAsKBZQ5V/j5oA06JRT3oEtQoUDCnxhKA2YZKRPaoSUQoXYSoCJqAuh5cCe6BR9hnwW6ojIwoHDyojAqAwcgo16ioDXaeMRJozuqQLpZEj96Bh+KTUOKBsegmSF6pDlAADiqIT7KpEDgO9ulo1LKBA1AoulxpXWAF4cVpVx6hUa1pGE6OYySDmV6MFoqTCaapk5QpIQFpm5qBQEAp4gxmHM6CElKIx+Rp5CQorbnp5PAKuokqJqwp/aBlobqCQdAqLZZlYv6Bw+ALcXBMZHqaHbKDQJgqZdaC3wDbggAlp3+ugsf8SyjoaijyljEcioKwDoC4Dv0IKqpOqu0Wqu2equ4mqu6uqu82qu++qvAGqzCOqzEWqzGeqzImqzKuqzM2qzO+qzQGq2usxFTMAxCKq2X0A3HoHYUVB9tiq0e0g6+Uw07dgAQ0ar1Bq6WEBLokCnEMkDfqq5e0BjxKq9cQK/2Ogn4mq+RsK/8+gj++q+NELACuwgEW7CJcLAIewgKu7CF0LAOOwgQG7GBMLEU+wcWe7EPs3saawgZ27F68LEgiwciO7J2ULImSwcom7JysLIsCwcu+7JuELMyuwZP2g1kWrND4CmAKoFxqbNn4Idreo8WAbRgIBU9G0/1+rL+nDK0+7cPRpsEz9Ken9inUXtcLkMm2PCcNUsTN1sdC/CqV4uip/JapwKpxOqkGro27hKxyNCcnoKnzKoSa2uAYqusDICoCLoOfsGhP6o5YkmeZrEAFyqon7q3qYOqbsoxVIu42UAPVjoo6FC3jNm33ImdBZCpjhtZdWqcxqC5m2sPnqKaoVsdOTtGpdscp2tKqcscq5sVreu6nBm7xvG6WEG7xWG7tYe7tqG7nsS7vTu7wFsbvqt3wzuCfXm8QCS8ygtAzNu8oVG8RQG9znuZ1It/1nu9QZW92jtbktm90+mY4Ou94ju+jSG9AmW+iIG+B6m+3Pi87vu+3Bu/8vvzvfQLGOwrE/eLv/C7v2uRvzHhv/bTvwK8lQRcwFUBwAqHwGShwCLHwJY5vxCcwAc8wRJVwRZ8ahicwdm1wRysih78wSzhwLQlwkpBwjdmwkmBwi+kwhcswS4MiCEcwxfBwhJBwxoMwzhckDO8wyHSwz4sEDaMEEEMwjpcxDUMxEgckEq8xDrSxE4cJFAcxd4wxAeRKVicxVq8xVzcxV78xWAcxmI8xmRcxmZ8xmicxmq8xls8tm78xnAcx3I8x3Rcx3Z8x3icx3q8x3zcx378x4AcyII8yIRcyIZ8yIicyIq8yIzcyI78yJAcyZI8yZQcIyEAACH5BAEyABEAIf8LSW1hZ2VNYWdpY2sNZ2FtbWE9MC40NTQ1NQAsAAAAAPQB9AGE6iAn6yAn6iEn6yEn6iIn6yIn6iAo6yAo6iEo6yEo6yAp6yEp6yIo7CEo7CAp7CEp7CIpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABf5gJI5kaZ5oqq5s675wLM90bd94ru987//AoHBILBqPyKRyyWw6n9CodEqtWq/YrHbL7Xq/4LB4TC6bz+i0es1uu9/wuHxOr9vv+Lx+z+/7/4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr83DQkICQYHxAEDygMBEAUDwNG3yggDANfY2drb3NcBAgIBAdLkoQgB3enq6+oGBgnl8ZDFCOz29/jazAby/YEMA+rlG0hwYIID/hLWQRCuoMOHAwMqnKgmgQCIGDPmO8CPoscuDBJoHEny3rePKP6pVCvJsiU7hCljJhlwwKXNm+kEyNwJ5BvOn0C3QeNJ1IaBoEiTXjPgoKjTFsmUSlWK4KnVEtamapU69CrRo1vDKhXnNaYBdGLTSoVZVuE7tXCnwmsrb4DIuHi50pVGLK9frXt71fxLWG7gXAILK5Z6mNbix1qrNnZ1F7JlpQ0mq0qA9rJnpGw1kxr8uTRSnaJDdTbNGijq1J1ay04qGTYm0rNz4yRrm1JI3cCBduwNCWzw4zeTEXdUGblzl3OXI8r6vLrL2tIJUbfOneXr7IBWdx9PEvyfi+TTlxxuPg9u9fAzZm5/Z3v8+xC/04fTQDz+/wWFtl8b6AFoIEQDuv5h3IEMEjROgmo0KOFDDEB4xoITZmiShWQUqOGH93AYhn8glpiOiF6YqKI9XaGIxYowrqOfi1IUEOON6QhI4xMe4ugjNtHt6ERzPxYJAHtCKvGekUUGmeQRDzApJTY6PjnElFgCMKOVQGSZZYtc/kCil0WGCQSRZDK5pZk2oJkmk9ixacOYbxrppJwy9FgnlnjWsGedD/YJAwN/1rmmoCgUumeciKLgpo8BHJBAMcdwFkACdgkwAIZGItloCXSCeIAyFeLA0ZE+MvppBEtqGGlTRTAQKYyrlvAogwiomkQA55RY6wgfIrDAFQe0euCvt953JxYMTegpnpzit+kYzf4y+CmhBuaaRrTwPWtmqN0FugYDxpK3LJf/XToHgN4maR95ytkB7nPihhlfMXvcB+aTiZF3qB3cVveviAE7t28f71ZXr5DqGbJAssEt7KK/DyQCMXCl7rjAeLoW0u9z51o4r2wSJ9Krde0OeLFsVTKycms7cmfJy6YNbF65s4U8T3U6gxclyJsU3FrP2VXnycilEU2cnrmVnAnNl1noXMubJMxygkKX1jEnH+eWIHJOe+LcflA/pgrOpe0XsRfEHDTpqAK8g4ABuRpQMRdoe3Zwb0zXjAVAcWP0jtJLdA2zecClvAQDApSdj6ZVOE4Y1aLlDRnhRViN07RR9J120f5NR/GWWAEUAAXSi1HeWNaQPTFrXqoTYbnZy+mGuQ+si7X1lbntvlfuiu0t+2UJwKoE8IURhzphYQexfFyRLqG5ZcLvZbhnt+vwvF8BKP6D5HjZhrxfNvcwO2Sx+zBb9W2RPJPBSFxvWfZEgQ+X9ztwd5IRs6UmW/k6sJ9njiBAsdBPJufzC/5ysL3WADAHstGM5xbTvB00cDa+y8H48JK+orTGdES4oG6KsEG4PHAnCcTLAm0gv/QcUAYF3EpjWPNCGKRQYcMzTQZ3AgEa8m5C7DMVawJzQ7VU8AYgqqELWBPEnQxRCBM00ApnEEPDtKWFhdkhDYqoniPWoIqMuf5iaU4og+lJSIkr+NlnpugR09ztB1y8zxtxZ5qyYOszQSghgIRQR69g8S9BAGMXgxDHrczRKVoDwh+TGITSdLCNeOwSk9j4AkEGxYsUiaJfmjgDM64IkzH43FNECJjvZQkImoSdVT6jRRgsEkZoTMFnHpkQB0RSfWky5QCdUsi1/CCVOIrlCT6TMZ7ckgeWbBAoK6k3RBJPTHui5QuOKRNbPtN8hYJm1Oq3yx4oipMw8GT4iNLMHohTSuCc5mUoSY5y7kABisIGHS1DRnLYaJs8AOaU2KmCc8KFJ/pMCz9T0MsbLbMF3TTLZdLZAj02CZuWmU9MEpoDNcbTGz3YmP5lpCmNa+7An14SJgkuw9FoXKaYELyoNkQ6goIiRSYODWP+VLqNHlizdTFJpk1KqgKaboOnsrSMTEiZFKCeQKc36gFSW8JSW+BTez7dhkQ1SM+JCpUHUd1GPVWw1JZY9TFbTUFXY+TNq34EpGFh6ArGCiOjmuCpFCHqS7GaVa0i06yQxKkOXhnPu+rVI2wdCQ/kekq6Pqaps6CeYeu60sUqppW/sMxBe8pYoTi2MIiVhWUI8NHKcoMHMUXKQHWBVxx49rM7CGhYPnLHxQz2tPro7F8VwlexXPa0ak0BWmXoEZf+pKmwje1MaUeR2q52uMG9xm0B2Vv07cC3ZFquX/4+EtiMQFYF0PWSdPNCXcgoYAfGvahbSVBdjGT2FeWFyCFtkFxthPUE4Z3Ke3FRWiS2NxvPhUxuSTtb+95XS6nVb15di9z2ztdWAqZIfdn7X+UGEDKjvcWC/dTgA5MgtJccsGK2W1kLt/RyGk5egdsr28Wc1xUTpkGDATBZFGR3pyEmDIcZu1/4Qua6u0jxDFbc4qOCWMH9ZfB/e2yC+EoFx/wlbkr/W2MTvBg6MWauDni8g/Q+JMK2IOxPZlzXJpcAw0BBqT82asEGY3kEVnbIVBOi2shUucFcVsuZaaHl3YAXziOWsUfaPJXxjsDI2cyzlCey2z7HmaZEfmuQ+/5xUwJP+b+Htq1H7qlk09430SQAtFJQomMZgNlLmEZzp8sx6nDe97WPCbVTIRxpRalaBHW+CZJz7FxB13XWw0xwlAeNgzSDCAKt3oqXcfFkl/gVtsdeDGe7u2gKn/bVrCo1OTRNm2DXqamf3jJKfO0Q0CLb2qXkNGSgXWgyQTsCkv1qpS1dWT+PgM+GTsll1msUz/Yg2zjB9S7KLRXE2hvcVkQJvKVybm4fyN3AknY5Bi5THeA7qTzgd8PFXWtbFwrhIjC4QZyY7mSrFJcVT0mscQJymvaA2kXl+PzM6VMfjPwmPCk2lMt60WErWuHyoGgOUE6rk3tUJtgr+Z9sXv6CoPNE4wTxAc9N5AOZuwTYPFl6UOZMAoarSN82hivQF+oDiZvIwzfHeT+o+eg6iRkHUheOU5A+kHOLYE/aVGxR2D6QH6T9QG6PwMO17cyfvzmkuux437X+YCyd1+r9torTryNJKWF8pJ8h+i/2bufAG+lMonxKIi0PKUXO0isvx8mJ9V6kx4/A61ORPDDoPhCqm4D1Oi8z2Qcv+Lj3/AeolwrYyRF6vv8gRrs/Qe9vovpoLN4mQqB0iUYfAcRPZS+mKT5WTOT6XGce9KZhvkY1ZPrpb16MfRTC8KM/hOMjPzCsyTuClUkE1lS/HJQHCgkZ9H4TjF/Wh7n7aTJnoP7go6ABh3MYERRC+OF/QWUa6sd7rSF9jgIfWOcC9wdzmjGA/EceDHgCuacVzEcOsEcQBpgCESgW9YcCIWgTFxgPGaiBSNCB64EE/eM/V3MEoxMcSWB+N7GB5WCDEogEJYgTAnB2QsCCSWcbObMEQogP8RI/s/GBCnGEdbcEzpcUw7AE8DQbQDhDs9F9LhB/JSEA37U4I0QcKbgVCQgVPfg4OEhZRUgc2+c+T5AXJ/gCZ+gSZTgRTrhxULAAOrgNScgjtpMdUagWVFCCo0IFY0iGiAMcdTgDDzCDIwEOxJI45jGHN7gFAwAO+XApk7IFa9MeXEhwq3CHBKGFMaF8uf4Rh4dAiTaxiNt2HKRYCKJYEA94FYcoiKNQiwYEIXsYFGnYB/qXFr0ob84RjHgQiwXBhE6Bi8DYCcZYEChiHZrQjMeIIruoFK9YB9LojC7yiblICdlIECNYFt0hCaqYFEJSjUf2CNyYFk9SjkjRPYvgjqDBL+RxjWWAjlPBimWhjJtUCPyYFyBkJV10hXgQiM3mIvi4FZvIB9+oEXKyjnmhLniQkGGhj4Ehj1oBj3Twi6nWJxhZkXHwj4pBjPmXLWywKQbyKQzSh2KghwyCir0BRGEwIfbYGw35E5CjBScjIb+Cbh+CKYMIkaURkLWiIuBAlEeQKypikbUTI8kwi/4nUCw3qRUwaR4cGS6TEhAEWQLPQBMU+T89aQJCuWJPFJYl8JVkWRhVOSBjmZbjZpYg6JYNUpMcIpcHEo478pF2qRV4KSR6uZdJwZQoMpWA2W1wCQMGWZh6dpgwQJiKaQ/Lxpgw8JjPAZW18peUmRF92SeJmZmpJ5k30JmeKVqgKUSjGXmlSVWnuXKpmQOOCZh0+SuiuZojsZZhKZK0qY2t2XW5GRckCZcA2JtiEZuliZmeuZtG0JbCCQC/mZpXuZzasJnI+WXQWXnTmQRVWJ0sQZzXWXTaWRLd6QTKWZi2GZ4o8JyZ2ZzmeQKzSZmCuZ7Y9Z2PA58qIZ/sgIz0af4D7ZmW75mfLoCe96We/vkCaHlRAjqgLyAr32mZCDoErwki0tmgJUabByqhNQCgrmahZuCZAfCFGmoG+/km/fmhP0AA49l5JMoGPUSWDJqiU3Ap9xWhLtoEdgFb5TmjTjA3jDWiOOoEBepCPdoHP8oz3BmkV1CjaYIAkWmkgZAl6MCk0/GgVLmVUBoIDbEiElGlOxMsRaqlbMAZuHKjXioHNHEfkjKmoGAXxskS+IKmplAAmKgbc+Omr3CJnxEpFUqniIAABxCiHsgMehoNDNAXSSE3eRqonvAA37CoBGENzACoiBqpkjqplFqplnqpmJqpmrqpnNqpnvqpoBqqov46qqRaqqZ6qqiaqqq6qqzaqq76qod5DfgJQ6NyqLCKBtswKVAngwLwMbZ6qxu6DujwNjgwAAzgDpr0q8BKBiNBKZrCYhqhrMsqBiY2rZVQrdY6CdiarZGwrdz6CN76rY0QruK6CORarolwruh6COq6roXQru46CPAar006kvSqCPN6r36Qr/rKB/zar3rwrwCLBwI7sHZQsAZLBwibsHKwsAwLBw77sG4QsRK7Bm24mBVrB9WAmyzBDEiZsWgwDFKaDZHSpSBrFK+THgzhoScrBQrgDkCkkS17BGoaI8Ngsvc6DH5qgeEws2U0spfTpj57YdB6WhYhrZYKAcVil/7UcK8MAbT/8Q5r9qoPgCn2aRFiOqPgALU/IiktiqMHIA72+RDDSm9uSgA6OrYucRFfu5tWq7Z9dgwpmitrOrbooAzwyRknCrcPIbelaQxcq7YCgLMwyLdgA5eG6xw8KhqJe7hm2bjHsbgTCLmKiLiUqxuSOxmXi7mWu7luGJaeOxuZi4Whm36dW7qlMboCiLoIeLqsexmqi36ve6euO7sd+bi2C7u1m7uFEbvQx7tvibvAS0G7O7wRWbzGCz3Im7xGtLzMSzrO+7yIKLzSixe+SxfVyz3Rm71jsb3c+47e+71Acb3tI77NS73mO72gm77Qi77sC4ru+76BGb7yy6IS5CuO9ZuP9Ju/I3G/XsG/8Lu+AAy+8TvAq7i/Bky2CJzABeG/V8HA47vAEJyJEjzBG1LAFqwRDrxKGUyHFdzB6rDBmgfC9vvBJMwNIkx7J4wRKexBK9y/JvzC2NDC5CTD1jW0OJzDOrzDPNzDPvzDQBzEQjzERFzERnzESJzESrzETNzETvzEUBzFUjzFVFzFVnzFWJzFWrzFXNzFXowiIQAAOw==' />
              <span v-if='${item.state === null}' style='display: ${item.undealSum ? 'inline-block' : 'none'};padding:0 5px;height: 15px;font-size: 12px;line-height: 15px;text-align: center;color: #fff;position: absolute;border-radius: 5px 5px 5px 0;background-color: red;top: -10px;right: ${item.undealSum.length === 1 ? '-5px' : item.undealSum.length === 2 ? '-10px' : item.undealSum.length === 3 ? '-18px' : '-23px'};'>${item.undealSum}</span>
              <div class='newdialog' width='480px' height='270px' style='display: ${this.nowShowCameraId === item.id ? 'none' : 'none'};padding:0 5px;width:480px;height: 270px;font-size: 12px;line-height: 15px;text-align: center;color: #000;position: absolute;border-radius: 5px 5px 5px 0;background-color: #fff;top: -260px;right: -460px;'>${item.undealSum}</div>
              </div>`
            })
            // <div style='display: ${this.nowShowCameraId === item.id ? 'block' : 'none'};padding:0 5px;width:480px;height: 270px;font-size: 12px;line-height: 15px;text-align: center;color: #000;position: absolute;border-radius: 5px 5px 5px 0;background-color: #fff;top: -260px;right: -460px;'>${item.undealSum}</div>
          }
        })
      })
    },
    allTab() {
      this.showTabValue = 'all'
      this.getalarmList()
      this.isDisableAllAlarmBtn = true
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
          size: 500
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
          },
          {
            field: 'camera.inChargeId',
            operator: 'EQUALS',
            value: this.userId
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
        this.loading = true
        setTimeout(() => {
          this.loading = false
        }, 10 * 1000)
        if (response.body.data.length) {
          this.getPanelList()
          this.stepsData = response.body.data
          this.isOnlyCameraData = false
          this.isDisableAllAlarmBtn = false
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
        e.path.forEach(item => {
          if (item.className === 'amap-labels') {
            this.closeDialog()
          }
        })
        return
      }
      const markers = document.getElementsByClassName('markerImg');
      [].forEach.call(markers, function(item) {
        item.classList.remove('markerClickImg')
        item.classList.remove('clickgif')
        if (item.classList.contains('markergif')) {
          item.style.width = '40px'
          item.style.height = '40px'
        }
        item.setAttribute('width', 40)
        item.setAttribute('height', 40)
      })
      e.path.forEach(item => {
        if (item.className !== 'videoBox') {
          this.hasUrl = null
          this.cameraId = null
        }
        if (item.className === 'gifbox') {
          this.hasUrl = null
          this.showAlarm = 'monitoring'
          this.showActive = false
          this.alarmActive = true
          item.childNodes[0].classList.add('clickgif')
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
          this.zoom = 15
          this.showZwMes = false
          const params = {
            cascade: true,
            page: {
              index: 1,
              size: 500
            },
            params: [
              {
                field: 'cameraId',
                operator: 'EQUALS',
                value: this.form.id
              },
              {
                field: 'create_time',
                operator: 'BETWEEN',
                value: { start: moment(Date.now()).format(
                  'YYYY-MM-DD 00:00:00'
                ),
                end: moment().format('YYYY-MM-DD HH:mm:ss')
                }
              },
              {
                field: 'camera.inChargeId',
                operator: 'EQUALS',
                value: this.userId
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
            if (!response.body.data.length) {
              this.hasData = false
              this.getalarmList()
              setTimeout(() => {
                this.hasData = true
              }, 3000)
            } else {
              this.loading = true
              setTimeout(() => {
                this.loading = false
              }, 10 * 1000)
              this.getPanelList()
              this.stepsData = response.body.data || []
              this.hasData = true
              this.yData = []
              this.xData = []
              response.body.data.forEach(item => {
                if (item.handlerId !== null) {
                  this.yData.push(item)
                } else {
                  [...this.timers].forEach((item, index) => {
                    this.timers.splice(index, 1)
                  })
                  this.xData.push(item)
                }
              })
              this.isOnlyCameraData = true
            }
          })
          return
        }
        if (item.className === 'noalarmbox') {
          this.hasUrl = null
          this.showAlarm = 'monitoring'
          this.showActive = false
          this.alarmActive = true
          if (!item.childNodes[1].classList.contains('offline')) {
            item.childNodes[1].classList.add('markerClickImg')
          }
          item.childNodes[1].setAttribute('width', 50)
          item.childNodes[1].setAttribute('height', 50)
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
          this.zoom = 15
          this.center = [this.form.longitude, this.form.latitude]
          this.showZwMes = false
          const params = {
            cascade: true,
            page: {
              index: 1,
              size: 500
            },
            params: [
              {
                field: 'cameraId',
                operator: 'EQUALS',
                value: this.form.id
              },
              {
                field: 'create_time',
                operator: 'BETWEEN',
                value: { start: moment(Date.now()).format(
                  'YYYY-MM-DD 00:00:00'
                ),
                end: moment().format('YYYY-MM-DD HH:mm:ss')
                }
              },
              {
                field: 'camera.inChargeId',
                operator: 'EQUALS',
                value: this.userId
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
            if (!response.body.data.length) {
              this.hasData = false
              this.getalarmList()
              setTimeout(() => {
                this.hasData = true
              }, 3000)
            } else {
              this.loading = true
              setTimeout(() => {
                this.loading = false
              }, 10 * 1000)
              this.getPanelList()
              this.stepsData = response.body.data || []
              this.hasData = true
              this.yData = []
              this.xData = []
              response.body.data.forEach(item => {
                if (item.handlerId !== null) {
                  this.yData.push(item)
                } else {
                  [...this.timers].forEach((item, index) => {
                    this.timers.splice(index, 1)
                  })
                  this.xData.push(item)
                }
              })
              // 两分钟后自动恢复默认全部列表
              this.isOnlyCameraData = true
            }
          })
        }
      })
    },
    markerClick() {

    },
    async showDialog(cameraInfo, isAlert) {
      setTimeout(() => {
        this.closeDialog()
      }, 0)
      setTimeout(() => {
        this.dialogVisable = true
      }, 1)
      this.nowShowCameraId = cameraInfo.camera.id
      await this.getCameraList()
      this.dataDia = cameraInfo
      this.points = JSON.parse(cameraInfo.box)
      if (isAlert) {
        if (this.isHint) {
          const audio = new Audio(hintMusic)// 这里的路径写上mp3文件在项目中的绝对路径
          audio.play()// 播放
        }
        this.timer2 = setTimeout(() => {
          this.closeDialog()
        }, 5000)
      }
      this.center = [cameraInfo.camera.longitude + 0.008, cameraInfo.camera.latitude + 0.002]
      this.window.position = [cameraInfo.camera.longitude, cameraInfo.camera.latitude + 0.0007]
      this.zoom = 15
      const markers = document.getElementsByClassName('markerImg');
      [].forEach.call(markers, function(item) {
        item.classList.remove('markerClickImg')
        item.classList.remove('clickgif')
        if (item.classList.contains('markergif')) {
          item.style.width = '40px'
          item.style.height = '40px'
        }
        item.style.zIndex =
        item.setAttribute('width', 40)
        item.setAttribute('height', 40)
        if (item.id === cameraInfo.camera.id) {
          if (item.classList.contains('markergif')) {
            item.classList.add('clickgif')
          } else {
            item.setAttribute('width', 50)
            item.setAttribute('height', 50)
            item.classList.add('markerClickImg')
          }
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
      })
    }
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
}
.clickgif {
  width:50px;
  height:50px;
}
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
  box-sizing: content-box !important;
}
.warn {
  // height:590px !important;
  margin-bottom: 20px;
  overflow: hidden;
  border-radius: 5px;
  opacity: .95;
  background-color: #ffffff;
}
.zuoContent {
  padding: 20px 10px;
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
 .trafficSvg {
   fill : #FF9832 !important;
 }
.alarmInfo {
  padding: 0px 20px;
  background: #f0f2f5;
  // height: calc(100vh - 50px);
  height: 100%;
  width: 100%;
  .map {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    .warn {
      margin-top: 10px;
      position: absolute;
      height: 80%;
      opacity: .95;
      top: 30px;
      right: 15px;
      width: 320px;
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
          height: 50%;
          float: left;
          padding: 0 8px;
          overflow: auto;
          position:relative;
          .zuo {
            float: left;
            width: 33%;
            height: 26px;
            line-height: 26px;
            background-color: #ffffff;
            cursor: pointer !important;
            p {
              color: #676767;
              font-size: 12px;
            }
            .zuoContent {
              padding-right: 50px;
              height: 100%;
            }
          }
          .zuo:hover {
            border: 1px solid #FF9832 !important;
          }
          .zhong:hover {
            border: 1px solid #FF9832 !important;
          }
          .you:hover {
            border: 1px solid #FF9832 !important;
          }
          .zuo:active {
            color: #FF9832;
            border: 1px solid #FF9832 !important;
          }
          .zhong:active {
            color: #FF9832;
            border: 1px solid #FF9832 !important;
          }
          .you:active {
            color: #FF9832;
            border: 1px solid #FF9832 !important;
          }
          .zhong {
            float: left;
            width: 33%;
            height: 26px;
            border: #FF9832;
            background-color: #ffffff;
            cursor: pointer !important;
            p {
              color: #676767;
              font-size: 12px;
            }
          }
          .you {
            float: left;
            width: 33%;
            height: 26px;
            border: #FF9832;
            background-color: #ffffff;
            cursor: pointer !important;
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
          color: #FF9832;
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
    width: 1px;
    height: 28px;
    background-color: #d9d9d9;
    margin-left: 25%;
    margin-top: 2px;
  }
}
.youContent {
  margin-bottom: 16px;
  overflow: hidden;
  cursor: pointer;
}
.dizhi {
  width: 100%;
  font-size: 14px;
  color: #000000;
  font-weight: 300;
  margin-bottom: 8px;
}
#panel.panelown {
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
  width: 50px !important;
  height: 50px !important;
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
  font-size: 12px;
  padding: 0 30px;
}
.offline {
  fill: #95afc0 !important;
  // cursor: no-drop;
}
.elTag {
  text-align: center;
  width: 60px;
}
// .el-dialog__header {
//   padding: 0 !important;
// }
// .el-dialog .el-dialog__body {
//   padding: 0 !important;
// }
// .el-dialog__footer {
//   padding: 0 !important;
// }
.popsure {
  padding: 10px 0 !important;
}
.popfooter {
  padding-top: 4px;
  padding-left: 4px;
  display: flex;
  .popfooteraddress {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    width: 330px;
  }
  .popfootertime {
    width: 150px;
  }
}
.amap-info-content {
  padding-right: 10px;
}
.amap-info-close {
  display: none;
}
.warnnormal {
  border: 1px solid #ccc;
  background:#fff;
  .spantext {
    margin-left: -4px !important;
  }
}
.popwarn {
  border-radius: 2px !important;
  width: 60px;
  height: 30px;
  font-size: 12px;
  line-height: 10px;
  text-align: center;
  outline: none;
  cursor: pointer;
}
.warnunnormal {
  border: 1px solid #FF9832;
  color: #fff;
  background:#FF9832;
  margin-left: 10px;
  .spantext {
    margin-left: -4px !important;
  }
}
.amap-info-content .amap-info-outer {
  padding-bottom: 0px !important;
}
.amap-info-content {
  padding: 0px !important;
  border: none;
}
.el-tabs__header {
  margin: 0px;
}
.video-wrap {
  margin-top: 0px !important;
}
.untreated {
  font-size: 18px;
}
.amap-info-sharp {
  background: url('./assets/newarrow.png') !important;
  background-repeat: no-repeat !important;
}
.deal.svg-icon {
  font-size: 18px;
}
</style>

