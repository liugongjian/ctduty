<template>
  <div id="alarmInfo" class="alarmInfo">
    <div class="map">
      <el-amap
        :amap-manager="amapManager"
        :center="center"
        :events="events"
        :zoom="zoom"
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
      <div class="warn">
        <div class="dispose">
          <div class="dash-title">告警处理率</div>
          <div class="disbox" style="height: 100%; width:100% margin-bottom: 16px;">
            <div id="panel" style="height: 100%; width:100%"></div>
          </div>
        </div>
        <div class="bottom" style="margin-top: 13px">
          <div class="todyW">今日告警</div>
          <div class="bottom-left">
            <div style="width:100%; height:35px">
              <div class="zuo" style="line-height: 32px" @click="allTab">
                <p>全部</p>
              </div>
              <div class="zhong" style="line-height: 32px" @click="yTab">
                <p>已处理</p>
              </div>
              <div class="you" style="line-height: 32px" @click="wTab">
                <p>未处理</p>
              </div>
              <div class="bottom-right">
                <ul>
                  <li style="float:right; width:25%">
                    <a @click="()=>{this.$router.push('/alarmMessage')}">历史告警</a>
                  </li>
                </ul>
              </div>
            </div>

            <div class="zuoContent" style="width:100%; height:100%">
              <div v-if="showTabValue === 'all'">
                <div :data="stepsData">
                  <template>
                    <div
                      v-for="(item, index) in stepsData"
                      :key="index"
                      class="stepword"
                      @click="showDialog(item)"
                    >
                      <div style="height:32px; width:32px; float:left">
                        <svg-icon v-if="item.state === 0" class="deal" icon-class="deal" />
                        <svg-icon
                          v-else
                          if="item.state === 1"
                          class="untreated"
                          icon-class="untreated"
                        />
                        <div class="shu"></div>
                      </div>
                      <div class="youContent" style="float:right width:100%;">
                        <p class="dizhi">{{ item.camera.address }}</p>
                        <svg-icon v-if="item.type === 1" icon-class="people" />
                        <svg-icon v-else-if="item.type === 2" icon-class="car" />
                        <svg-icon v-else if="item.type === 3" icon-class="bicycle" />
                        <span
                          :formatter="formatTime"
                          style="width:100%; font-size: 13px; color:#7e7e7e; margin-top: 4px;"
                        >{{ item.createTime }}</span>
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
                    @click="showDialog(item)"
                  >
                    <div style="height:32px; width:32px; float:left">
                      <svg-icon v-if="item.state === 0" class="deal" icon-class="deal" />
                      <div class="shu" style="height:16px;"></div>
                    </div>
                    <div class="youContent" style="float:right width:100%;">
                      <p class="dizhi">{{ item.camera.address }}</p>
                      <svg-icon v-if="item.type === 1" icon-class="people" />
                      <svg-icon v-else-if="item.type === 2" icon-class="car" />
                      <svg-icon v-else if="item.type === 3" icon-class="bicycle" />
                      <span
                        :formatter="formatTime"
                        style="width:100%; font-size: 13px; color:#7e7e7e; margin-top: 4px;"
                      >{{ item.createTime }}</span>
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
                    <div style="height:32px; width:32px; float:left">
                      <svg-icon v-if="item.state === 0" class="untreated" icon-class="untreated" />
                      <div class="shu"></div>
                    </div>
                    <div class="youContent" style="float:right width:100%;">
                      <p class="dizhi">{{ item.camera.address }}</p>
                      <svg-icon v-if="item.type === 1" icon-class="people" />
                      <svg-icon v-else-if="item.type === 2" icon-class="car" />
                      <svg-icon v-else if="item.type === 3" icon-class="bicycle" />
                      <span
                        :formatter="formatTime"
                        style="width:100%; font-size: 13px; color:#7e7e7e; margin-top: 4px;"
                      >{{ item.createTime }}</span>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <el-dialog
            v-model="temp"
            :visible="dialogVisable"
            title="报警显示"
            width="700px"
            @close="closeDialog"
          >
            <el-form :model="dataDia" label-position="right" label-width="100px">
              <el-form-item :formatter="formatTime" label="流量状态:">
                <span style="width: 300px;">{{ dataDia.camera.address }}</span>
              </el-form-item>
              <el-form-item label="监控时间:">
                <span style="width: 300px;">
                  {{
                    dataDia.createTime
                  }}
                </span>
              </el-form-item>
              <el-form-item label="原始照片:" prop="image">
                <el-image :src="dataDia.image" style="width:350px; height:200px;"></el-image>
              </el-form-item>
              <el-form-item label="结构化照片:" prop="imageCut">
                <el-image :src="dataDia.imageCut" style="width:150px; height:150px;"></el-image>
              </el-form-item>
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
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import echarts from 'echarts'
// 引入水球
import 'echarts-liquidfill'
// 引入基本模板
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import { fetchalarmList, fetchNormalStatus } from '@/api/alarm'
import { fetchAllCameraList } from '@/api/camera'
import { fetchSinMan } from '@/api/dashboard'
import Pagination from '@/components/Pagination'
import { renderTime } from '@/utils'
import VueAMap from 'vue-amap'
import moment from 'moment'
const amapManager = new VueAMap.AMapManager()
export default {
  name: 'ECloudWatch',
  // components: { CameraList },
  components: { Pagination },
  props: ['data', 'defaultActive'],
  data() {
    return {
      timer: null,
      dataError: [],
      dataDia: {},
      // alarmForm: {
      //   address: '',
      //   createTime: ''
      // },
      temp: {
        camera: {},
        createTime: '',
        image: '',
        imageCut: ''
      },
      yData: [],
      // TabLan: all,
      dialogVisable: false,
      activeName: 'first',
      formInfo: [],
      active: 0,
      stateData: '',
      stepsData: [],
      values: 3,
      xData: [],
      zoom: 12,
      hasMarker: false,
      showZwMes: true,
      center: [110.09, 34.58],
      markersDom: null,
      showTabValue: 'all',
      markers: [],
      amapManager,
      total: 0,
      allTotal: 0,
      page: 1,
      limit: 10,
      events: {
        click: a => {}
      }
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
      }, 200)
    },
    hasMarker(v) {
      const that = this
      if (v) {
        [].forEach.call(document.getElementsByClassName('markerImg'), function(
          item,
          index
        ) {
          if (index === 0) {
            item.classList.add('markerClickImg')
            that.form = JSON.parse(item.attributes[1].nodeValue)
            that.form.createTime = moment(that.form.createTime).format(
              'YYYY-MM-DD HH:mm:SS'
            )
            that.showZwMes = false
          }
        })
      }
    },
    limit() {
      this.page = 1
      this.pageChange()
    }
  },
  async created() {
    this.userId = Cookies.get('userId')
    await this.getalarmList()
    await this.getCameraList()
    await this.getPanelList()
  },
  mounted() {
    const that = this
    that.getPanel()
    document.getElementById('alarmInfo').onclick = function() {
      this.watchClick()
    }
    setInterval(() => {
      that.getalarmList()
    }, 5000)
    setTimeout(() => {
      this.formInfo = []
      this.formInfo.forEach(item => {
        this.markers.push({
          position: [item.longitude, item.latitude],
          content: `<img class='markerImg' data=${JSON.stringify(item)}
          src="https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png" style="width: 19px; height: 33px; top: 0px; left: 0px;">`
        })
      })
    }, 2000)
  },
  methods: {
    getPanelList() {
      // fetchAllData
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
        this.getPanel(parseInt(res.body.data.alertHandleRate * 100))
      })
    },
    getCameraList() {
      const params = {
        cascade: true,
        page: {
          index: 1,
          size: 20
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
            ] /* content: `<img class='markerImg' data=${JSON.stringify(item)} src="https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png" style="width: 19px; height: 33px; top: 0px; left: 0px;">`, */,
            content: `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg  class='markerImg'  data=${JSON.stringify(
              item
            )}  t="1599121043094" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2907" xmlns:xlink="http://www.w3.org/1999/xlink" width="40" height="40"><defs><style type="text/css"></style></defs><path d="M512.575 66.562c90.534 0 172.507 36.713 231.841 96.047 59.349 59.334 96.046 141.306 96.046 231.841 0 90.551-36.696 172.522-96.046 231.856-59.334 59.349-141.307 96.047-231.841 96.047-90.535 0-172.522-36.698-231.856-96.047C221.383 566.972 184.687 485 184.687 394.45c0-90.536 36.696-172.507 96.032-231.841 59.333-59.334 141.32-96.047 231.856-96.047zM441.27 439.874c16.993-53.202 41.838-91.409 97.927-125.07-60.031-17.437-129.499 48.742-97.927 125.07z m130.284 319.798v53.364l204.863 36.253v109.068H258.999V849.289l194.611-36.253v-53.349a267.622 267.622 0 0 0 58.965 6.563c20.266 0 40-2.282 58.979-6.578z m-58.979-515.121c-41.408 0-78.891 16.785-106.002 43.896-27.127 27.142-43.913 64.624-43.913 106.002 0 41.393 16.786 78.891 43.913 106.017 27.112 27.112 64.594 43.898 106.002 43.898 41.393 0 78.875-16.786 106.002-43.898 27.127-27.127 43.896-64.624 43.896-106.017 0-41.378-16.77-78.86-43.896-106.002-27.127-27.111-64.609-43.896-106.002-43.896z m73.348 76.564c-18.771-18.771-44.711-30.385-73.349-30.385-28.653 0-54.58 11.615-73.35 30.385-18.771 18.757-30.385 44.697-30.385 73.335 0 28.653 11.615 54.58 30.385 73.365 18.771 18.755 44.697 30.385 73.35 30.385 28.638 0 54.578-11.63 73.349-30.385 18.771-18.786 30.372-44.713 30.372-73.365 0-28.638-11.601-54.578-30.372-73.335z m71.424-71.439c-37.038-37.038-88.239-59.956-144.772-59.956-56.55 0-107.751 22.918-144.789 59.956-37.053 37.053-59.956 88.24-59.956 144.774 0 56.55 22.903 107.751 59.956 144.789 37.038 37.051 88.239 59.971 144.789 59.971 56.534 0 107.735-22.92 144.772-59.971C694.4 502.201 717.32 451 717.32 394.45c0-56.534-22.92-107.721-59.973-144.774z" p-id="2908"></path></svg>`
          })
        })
      })
    },
    formatTime: function(row, column, cellValue) {
      return moment(cellValue).format('YYYY-MM-DD HH:mm:SS')
    },
    allTab() {
      this.showTabValue = 'all'
    },
    yTab() {
      this.showTabValue = 'y'
      this.yData = []
      this.xData = []
      this.stepsData.forEach((item, index) => {
        if (item.state !== null) {
          this.yData.push(item)
        } else {
          this.xData.push(item)
        }
      })
    },
    wTab() {
      this.showTabValue = 'w'
      this.yData = []
      this.xData = []
      this.stepsData.forEach((item, index) => {
        if (item.state !== null) {
          this.yData.push(item)
        } else {
          this.xData.push(item)
        }
      })
    },
    getalarmList() {
      const params = {
        cascade: true,
        page: {
          index: 1,
          size: 40,
          total: 0
        },
        params: [
          // {
          //   field: "createTime",
          //   operator: "BETWEEN",
          //   value: { start: "2020-09-05 00:00:00", end: "2020-09-10 23:59:59" }
          // },
          // {
          //   field: "handlerId",
          //   operator: "NULL",
          //   value: "null"
          // }
        ]
      }
      fetchalarmList(params).then(response => {
        if (response.body.data.length) {
          if (!this.stepsData.length) {
            this.stepsData = response.body.data.reverse()
            this.dialogVisable = false
          } else if (JSON.stringify(this.stepsData[0]) !== JSON.stringify(response.body.data.reverse()[0])) {
            this.showDialog(this.stepsData[0])
            setTimeout(() => {
              this.dialogVisable = false
            }, 5000)
          } else {
            this.closeDialog()
            this.dialogVisable = false
          }
          this.stepsData.forEach(item => {
            if (item.id === response.body.data.reverse()[0].id) {
              this.showDialog()
            } else {
              this.dialogVisable = false
            }
          })
        }
        for (let i = 0; i < response.body.data.length; i++) {
          if (response.body.data[i].state === 1) {
            this.dataError.push(response.body.data[i])
          }
        }
        const index = 0
        if (this.dataError.length > 0) {
          this.dialogVisable = true
          this.dataDia = this.dataError[index]
        }
        /*  this.timer = setInterval(() => {
          console.log(345, index, this.dataError.length, this.dataError)
          index++
          if (this.dataError.length >= index) {
            clearInterval(this.timer)
            this.dialogVisable = false
            return
          }
          this.dialogVisable = true
          this.dataDia = this.dataError[index]
        }, 5000) */
      })
    },
    watchClick(e) {
      if (!e.path.some(item => item.className === 'amap-marker-content')) {
        return
      }
      const marImgs = document.getElementsByClassName('markerImg');
      [].forEach.call(marImgs, function(item) {
        item.classList.remove('markerClickImg')
      })
      e.path.forEach(item => {
        if (item.className === 'amap-marker-content') {
          item.childNodes[1].classList.add('markerClickImg')
          this.form = JSON.parse(item.childNodes[1].attributes[1].nodeValue)
          this.form.createTime = moment(this.form.createTime).format(
            'YYYY-MM-DD HH:mm:SS'
          )
          this.showZwMes = false
        }
      })
    },
    markerClick() {},
    closeDialog() {
      this.dialogVisable = false
    },
    showDialog(item) {
      this.dataDia = item
      this.dialogVisable = true
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
    handleClick(tab, event) {},
    next() {
      if (this.active++ > 2) this.active = 0
    },
    normal() {
      clearInterval(this.timer)
      fetchNormalStatus(this.dataDia.id, 0).then((res) => {
        this.dialogVisable = false
        this.getalarmList()
      })
    },
    unnormal() {
      clearInterval(this.timer)
      fetchNormalStatus(this.dataDia.id, 1).then((res) => {
        this.dialogVisable = false
        this.getalarmList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
  list-style: none;
}
.alarmInfo {
  padding: 0px 20px;
  background: #f0f2f5;
  height: 1000px;
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
      top: 0;
      right: 10px;
      background-color: #ffffff;
      width: 25%;
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
          font-size: 13px;
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
              font-size: 13px;
            }
            .zuoContent {
              background-color: pink;
            }
          }
          .zuo:hover {
            border: 1px solid #1890ff;
          }
          .zhong:hover {
            border: 1px solid #1890ff;
          }
          .you:hover {
            border: 1px solid #1890ff;
          }
          .zhong {
            float: left;
            width: 25%;
            height: 32px;
            border: #1890ff;
            background-color: #ffffff;
            p {
              color: #676767;
              font-size: 13px;
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
              font-size: 13px;
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
.shu {
  width: 2px;
  height: 23px;
  background-color: #d9d9d9;
  margin-left: 8px;
  margin-top: 2px;
}
.dizhi {
  width: 100%;
  font-size: 15px;
  color: #000000;
  font-weight: 300;
  margin-left: 10px;
  margin-bottom: 10px;
}

.dispose {
  height: 210px;
  width: 100%;
  background-color: #fff;
  margin-top: 10px;
}
.dash-title {
  position: relative;
  margin: 0;
  padding: 0;
  padding-left: 20px;
  font-size: 14px;

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
.status {
  margin-top: 20px;
}

.originImg {
  width: 380px;
  height: 250px;
}
.markerImg {
  fill: #3e94f9;
}
.markerClickImg {
  fill: #ff1a2e !important;
}
</style>

