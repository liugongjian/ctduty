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
          :ext-data="marker.extData"
        >
          <div v-if="marker.undealSum === '0'" class="alarmBox">
            <svg-icon icon-class="camera" class="blueSvg"/>
          </div>
          <div v-else-if="marker.online === 1" class="alarmBox">
            <span class="alarmTips">{{ marker.undealSum }}</span>
            <svg-icon icon-class="camera" class="graySvg"/>
          </div>
          <div v-else :class="showDialogInfo.cameraId === marker.extData.id? 'yes':'no' " class="alarmBox">
            <span class="alarmTips">{{ marker.undealSum }}</span>
            <img src="../../assets/images/camera.gif">
          </div>
        </el-amap-marker>
        <!-- <el-amap-info-window
          v-if="ifShowDialog"
          :auto-move="true"
          :position="dialogInfo.position"
        > -->
        <el-dialog :visible.sync="ifShowDialog" :modal-append-to-body="false" custom-class="imageDialog" width="500px" title="告警">
          <div class="imageBtn">
            <el-image :src="showDialogInfo.imageCompress" @click="()=>{openImage(showDialogInfo.image)}"></el-image>
          </div>
          <div class="imageInfo">
            <span class="imageAddress">
              <svg-icon icon-class="pulladdress"/>
              {{ showDialogInfo.camera.address }}
            </span>
            <span class="imageTime">
              <svg-icon icon-class="pulltime" style="color:#a6a6a6;"></svg-icon>
              {{ formatTime(showDialogInfo.createTime) }}
            </span>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="()=>{statusHandle(0,showDialogInfo.id)}">正常</el-button>
            <el-button @click="()=>{statusHandle(1,showDialogInfo.id)}">异常</el-button>
          </span>
        </el-dialog>
        <!-- </el-amap-info-window> -->
      </el-amap>
      <div class="warnBox">
        <el-tabs v-model="activeTabs" style="height:234px" @tab-click="tabHandle">
          <el-tab-pane label="告警处理率" name="percent">
            <div class="disbox">
              <div id="panel" class="panelown" style="height: 100%; width:100%"></div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="实时监控" name="video">
            <div class="videoInfoBox">
              <VideoPlayer v-if="hasUrl && ifVideoHasUrl" :options="videoOptions"/>
              <p v-else>{{ videoText }}</p>
              <!-- <p v-else>请点击选择摄像头</p> -->
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="todayBox">
          <div class="todayAlarmBox">
            <span class="todayTitle">
              今日告警
            </span>
            <a class="toHistory" @click="()=>{this.$router.push('/alarmMessage')}">
              历史告警 >
            </a>
          </div>
          <div class="alarmStatus">
            <div :class="activeAlarmKind === 'all' ? 'active' : ''" class="allAlarm" @click="changeTab('all')">
              全部({{ todayAlarms }})
            </div>
            <div :class="activeAlarmKind === 'deal' ? 'active' : ''" class="dealAlarm" @click="changeTab('deal')">
              已处理({{ todayHandleAlarms }})
            </div>
            <div :class="activeAlarmKind === 'undeal' ? 'active' : ''" class="undealAlarm" @click="changeTab('undeal')">
              未处理({{ todayAlarms - todayHandleAlarms }})
            </div>
          </div>
          <div
            v-if="alarmListData.length>0"
            class="alarmList"
            @scroll="listenScroll">
            <div
              v-for="(item,index) in alarmListData"
              :key="item.id"
              :class="index !== alarmListData.length - 1 ? 'line' : ''"
              class="listInfo"
              @click="()=>showDialog(item)">
              <div class="iconBox">
                <!-- <svg-icon v-if="!item.handlerId" icon-class="untreated" class="untreatedIcon"/> -->
                <svg-icon v-if="item.state === 0" class="deal" icon-class="deal" />
                <svg-icon
                  v-else-if="item.state === 1"
                  class="untreatedIcon"
                  icon-class="untreated2"
                />
                <svg-icon
                  v-else-if="item.handlerId === null"
                  class="untreatedIcon"
                  icon-class="untreated"
                />
              </div>
              <div class="infoBox">
                <p>{{ item.camera.address }}</p>
                <span>
                  <svg-icon v-if="item.type === 1" class="trafficSvg" icon-class="people" />
                  <svg-icon v-else-if="item.type === 2" class="trafficSvg" icon-class="car" />
                  <svg-icon v-else-if="item.type === 3" class="trafficSvg" icon-class="bicycle" />
                <span class="trafficTime">{{ formatTimeYear(item.createTime) }}</span></span>
              </div>
            </div>
          </div>
          <div v-else class="noData">暂无告警</div>
        </div>
      </div>
    </div>
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
import SvgIcon from '@/components/SvgIcon'
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
  resizeEnable: true
})
export default {
  components: { Pagination, VideoPlayer, SvgIcon },
  data() {
    return {
      activeTabs: 'percent',
      zoom: 9,
      zooms: [9, 20.5],
      hasMarker: false,
      showZwMes: true,
      center: [110.170143, 34.567009],
      markers: [],
      amapManager,
      markerChooseData: '',
      events: {
        click: info => {
          if (info.target.G.extData) {
            this.markerChooseData = info.target.G.extData
            this.alarmListData = []
            this.playMonitor()
            this.getPanelListById()
            // this.getalarmList()
            // console.log(info.target.G.extData)
            this.showDialogInfo.cameraId = info.target.G.extData.id
            this.hasUrl = false
          } else {
            if (this.markerChooseData) {
              this.markerChooseData = ''
              this.alarmListData = []
              this.getalarmList()
              this.getPanelList()
              this.hasUrl = false
              this.videoText = '请点击选择摄像头'
              this.activeTabs = 'percent'
              this.showDialogInfo = { camera: {}, cameraId: '' }
            }
          }
        },
        init(o) {
        }
      },
      dialogInfo: {
        position: [110.170143, 34.567009]
      },
      activeAlarmKind: 'all',
      todayAlarms: 0,
      todayHandleAlarms: 0,
      alarmListData: [],
      page: 1,
      videoOptions: {},
      hasUrl: false,
      videoText: '请点击选择摄像头',
      ifVideoHasUrl: false,
      ifShowDialog: false,
      showDialogInfo: { camera: {}},
      interValStart: false,
      pushStata: '',
      timer: null,
      timerOut: null,
      userId: ''
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
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
    clearTimeout(this.timerOut)
    this.timerOut = null
  },
  updated() {

  },
  methods: {
    watchClick(e) {

    },
    statusHandle(status, id) {
      // console.log(status, id)
      const params = [{
        id: id,
        state: status,
        handlerId: this.userId
      }]
      notifyState(params).then((res) => {
        if (res.code === 0) {
          this.alarmListData = []
          // this.getalarmList()
          this.getPanelListById()
          this.$notify({
            title: '成功',
            type: 'success',
            message: '更新成功!'
          })
          this.ifShowDialog = false
          this.interValConfig()
        }
      })
    },
    formatTime(time) {
      return moment(time).format('HH:mm:ss')
    },
    formatTimeYear(time) {
      return moment(time).format('YY-MM-DD HH:mm:ss')
    },
    getPush() {
      getPushSet().then(res => {
        this.pushStata = JSON.parse(res.body.data.setting)
      })
    },
    openImage(url) {
      window.open(url)
    },
    tabHandle(idx) {
      console.log(idx)
    },
    interValConfig() {
      this.interValStart = true
      this.timer = window.setInterval(() => {
        this.getPanelList()
      }, 5000)
    },
    getCameraList() {
      const params = {
        cascade: true,
        page: {
          index: 1,
          size: 100000
        },
        params: {
        }
      }

      fetchAllCameraList(params).then(res => {
        if (res.code === 0) {
          const { data } = res.body
          this.markers = data.map((item, index) => {
            if (index === 0) {
              const o = amapManager.getMap()
              o.setZoomAndCenter(18, [item.longitude, item.latitude])
            }
            return {
              position: [
                item.longitude,
                item.latitude
              ],
              extData: item,
              undealSum: item.undealSum,
              online: item.online
            }
          })
        }
      })
    },
    getPanelList() {
      const params = {
        cameraId: ''
      }
      fetchSinMan(params).then(res => {
        if (res.code === 0) {
          // this.window.position = [cameraInfo.camera.longitude, cameraInfo.camera.latitude + 0.0008]
          // const o = amapManager.getMap()
          // o.setZoomAndCenter(15, [cameraInfo.camera.longitude + 0.008, cameraInfo.camera.latitude + 0.006])
          // if (isAlert) {
          //   if (this.isHint) {
          //     const audio = new Audio(hintMusic)// 这里的路径写上mp3文件在项目中的绝对路径
          //     audio.play()// 播放
          //   }
          //   this.timer2 = setTimeout(() => {
          //     this.closeDialog()
          //   }, 5000)
          // }

          const { alertHandleRate, todayAlerts, todayHandleds } = res.body.data
          if (this.interValStart) {
            if (this.todayAlarms !== todayAlerts || this.todayHandleAlarms !== todayHandleds) {
              this.todayAlarms = todayAlerts
              this.todayHandleAlarms = todayHandleds
              const ratePercent = alertHandleRate * 100
              this.drawPanel(ratePercent)
              this.alarmListData = []
              // this.getalarmList()
              const param = {
                cascade: true,
                page: {
                  index: this.page,
                  size: 10
                },
                params: [{
                  field: 'create_time',
                  operator: 'BETWEEN',
                  value: {
                    start: this.pushStata ? `${moment().format('YYYY-MM-DD')} ${this.pushStata.date1}:00` : `${moment().format('YYYY-MM-DD')} 00:00:00`,
                    end: this.pushStata ? `${moment().format('YYYY-MM-DD')} ${this.pushStata.date2}:00` : `${moment().format('YYYY-MM-DD')} 23:59:00`
                  }
                }],
                sorts: [
                  {
                    field: 'create_time',
                    type: 'desc'
                  }
                ]
              }
              fetchalarmList(param).then(res => {
                if (res.code === 0) {
                  this.showDialogInfo = res.body.data[0]
                  this.ifShowDialog = true
                  this.dialogInfo.position = [this.showDialogInfo.camera.longitude, this.showDialogInfo.camera.latitude + 0.0008]
                  this.timerOut = window.setTimeout(() => {
                    this.ifShowDialog = false
                  }, 5000)
                  const dataList = res.body.data
                  for (const val in dataList) {
                    this.alarmListData.push(dataList[val])
                  }
                  this.alarmListDataTotal = res.body.page.total
                  const o = amapManager.getMap()
                  o.setZoomAndCenter(15, [this.showDialogInfo.camera.longitude + 0.008, this.showDialogInfo.camera.latitude + 0.006])
                }
              })
            } else {
              console.log('no')
            }
          } else {
            this.todayAlarms = todayAlerts
            this.todayHandleAlarms = todayHandleds
            const ratePercent = alertHandleRate * 100
            this.drawPanel(ratePercent)
            this.interValConfig()
          }
        }
      })
    },
    getPanelListById() {
      const params = this.markerChooseData ? {
        cameraId: this.markerChooseData.id
      } : {
        cameraId: ''
      }
      this.interValStart = false
      clearInterval(this.timer)
      this.timer = null
      clearTimeout(this.timerOut)
      this.timerOut = null
      fetchSinMan(params).then(res => {
        if (res.code === 0) {
          this.alarmListData = []
          this.getalarmList()
          const { alertHandleRate, todayAlerts, todayHandleds } = res.body.data
          this.todayAlarms = todayAlerts
          this.todayHandleAlarms = todayHandleds
          const ratePercent = alertHandleRate * 100
          this.drawPanel(ratePercent)
        }
      })
    },
    drawPanel(rate) {
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
              fontWeight: 'bolder',
              offsetCenter: [0, '70%']
            },
            data: [
              {
                value: rate.toFixed(2),
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
    changeTab(name) {
      this.activeAlarmKind = name
      this.page = 1
      this.alarmListData = []
      this.getalarmList()
    },
    listenScroll(e) {
      const ele = e.srcElement ? e.srcElement : e.target
      // if (ele.scrollTop + ele.offsetHeight > ele.scrollHeight - 100) {
      if (ele.scrollHeight - ele.scrollTop <= ele.clientHeight) {
        if (this.alarmListData.length >= this.alarmListDataTotal) {
          return false
        }
        ++this.page
        this.getalarmList()
      }
    },
    getalarmList() {
      const tempParam = () => {
        const val = {
          field: 'create_time',
          operator: 'BETWEEN',
          value: {
            start: this.pushStata ? `${moment().format('YYYY-MM-DD')} ${this.pushStata.date1}:00` : `${moment().format('YYYY-MM-DD')} 00:00:00`,
            end: this.pushStata ? `${moment().format('YYYY-MM-DD')} ${this.pushStata.date2}:00` : `${moment().format('YYYY-MM-DD')} 23:59:00`
          }
        }
        if (this.activeAlarmKind === 'deal') {
          return [
            val,
            {
              field: 'handlerId',
              operator: 'NOT_NULL'
            }

          ]
        } else if (this.activeAlarmKind === 'undeal') {
          return [
            val,
            {
              field: 'handlerId',
              operator: 'NULL'
            }
          ]
        }
        return [val]
      }

      const paramuIfID = () => {
        const param = tempParam()
        if (this.markerChooseData) {
          param.push({
            field: 'cameraId',
            operator: 'EQUALS',
            value: this.markerChooseData.id
          })
        }
        return param
      }

      const params = {
        cascade: true,
        page: {
          index: this.page,
          size: 10
        },
        params: paramuIfID(),
        sorts: [
          {
            field: 'create_time',
            type: 'desc'
          }
        ]
      }
      fetchalarmList(params).then(res => {
        if (res.code === 0) {
          const dataList = res.body.data
          for (const val in dataList) {
            this.alarmListData.push(dataList[val])
          }
          this.alarmListDataTotal = res.body.page.total
        }
      })
    },
    video_type(url) {
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
      } else if (url.endsWith('hls')) {
        return 'application/x-mpegURL'
      }
    },
    playMonitor() {
      // this.markerChooseData
      this.activeTabs = 'video'
      const { id } = this.markerChooseData
      this.videoText = '视频流加载中...'
      play(id).then(res => {
        if (res.body.data.rtmpuri) {
          this.hasUrl = true
          this.ifVideoHasUrl = true
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
                src: res.body.data.m3u8uri,
                type: this.video_type(res.body.data.m3u8uri)
              }
            ]
          }
        } else {
          this.ifVideoHasUrl = false
          this.videoText = '视频流获取失败，摄像头可能已离线'
        }
      })
    },
    showDialog(item) {
      this.showDialogInfo = item
      this.ifShowDialog = true
      // this.dialogInfo.position = [item.camera.longitude, item.camera.latitude + 0.0008]
      // const o = amapManager.getMap()
      // o.setZoomAndCenter(15, [item.camera.longitude + 0.008, item.camera.latitude + 0.006])
    }
  }
}
</script>
<style lang='scss'>
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
  }
  .imageDialog{
    /deep/.el-dialog__header{
      display: none;
    }
    /deep/.el-dialog__body{
      padding: 10px;
    }
    /deep/.el-dialog__footer{
      padding: 0  0 10px 0;
      background: #fff;
    }
  }
  .alarmBox{
    position: relative;
    &.yes{
      img{
        width: 50px;
        height: 50px;
      }
    }
    .alarmTips{
      position: absolute;
      top: -10px;
      right: -10px;
      display: inline-block;
      padding: 0 5px;
      height: 15px;
      font-size: 12px;
      line-height: 15px;
      text-align: center;
      color: #fff;
      position: absolute;
      border-radius: 4px 5px 5px 0;
      background-color: red;
    }
    img{
      width: 40px;
      height: 40px;
    }
  }
  .imageBtn{
    width: 480px;
    height: 270px;
    // margin: 0 auto;
    /deep/.el-image{
      height: 100%;
    }
  }
  .imageInfo{
    margin-top: 10px;
    padding-left: 10px;
    .imageTime{
      float: right;
      margin-right: 10px;
    }
  }
  .blueSvg{
    fill: #3e94f9;
    width: 40px;
    height: 40px;
  }
  .graySvg{
    fill: gray;
    width: 40px;
    height: 40px;
  }
  .warnBox{
      position: absolute;
      width: 320px;
      height: 90%;
      opacity: 0.95;
      top: 50%;
      transform: translateY(-50%);
      right: 15px;
      background-color: #fff;
      .disbox{
        width: 320px;
        height: 180px;
      }
      .videoInfoBox{
        width: 320px;
        height: 180px;
        p{
          line-height: 140px;
          font-size: 16px;
          text-align: center;
        }
      }
      .todayBox{
        border-top:1px solid rgb(233, 233, 233);
        padding:0 15px;
        height: calc(90% - 234px);
        .todayAlarmBox{
          height: 40px;
          line-height: 40px;
          .todayTitle{
            font-size: 16px;
          }
          .toHistory{
            font-size: 12px;
            float: right;
            color:#FF9832;
          }
        }
        .alarmStatus{
          display: flex;
          div{
            flex: 1;
            text-align: center;
            height: 26px;
            line-height: 26px;
            border:1px solid #D9D9D9;
            cursor: pointer;
            // margin-right: -1px;
            &.active{
              border-right: none;
              border:1px solid #FF9832;
              color:#FF9832
            }
          }
          // .allAlarm{
          //   border:1px solid #D9D9D9;
          // }
          // .dealAlarm{
          //   border-top:1px solid #D9D9D9;
          //   border-bottom:1px solid #D9D9D9;
          // }
          // .undealAlarm{
          //   border:1px solid #D9D9D9;
          // }

        }
        .noData{
            height: 50px;
            line-height: 50px;
            text-align: center;
            font-size: 18px;
          }
      }
      .alarmList{
        padding: 20px 5px;
        overflow-y: scroll;
        height: 100%;
        &::-webkit-scrollbar {
            display: none;
        }
        .listInfo{
          display: flex;
          cursor: pointer;
        }
        .trafficSvg{
          color: #FF9832;
        }
        .trafficTime{
          color: #7e7e7e
        }
        .line{
          position: relative;
          &::before{
            position: absolute;
            content: '';
            left: 9px;
            top: 22px;
            width: 1px;
            height: 20px;
            background: #dcdcdc;
          }
        }
        .infoBox{
          margin-left: 20px;
          margin-bottom: 7px;
          p{
            font-size: 14px;
            margin: 0;
            padding-bottom: 10px;
          }
          span{
            font-size: 12px;
          }
        }
        .untreatedIcon{
          font-size: 18px;
          color: #FF9832;
        }
        .deal{
          font-size: 18px;
        }
      }
  }
}

</style>
