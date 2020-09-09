<template>
  <div id="dashID" class="dashboard-container">
    <el-row :gutter="12">
      <el-col :span="18" class="status">
        <div id="map" :class="isFullscreen?'mapE':''">
          <div class="dash-title">监控实时情况</div>
          <div class="mapbox">
            <div class="overv">
              <div class="overvBox">
                <span class="overbgc">总摄像头</span>
                <p class="overmsg">{{ total }}个</p>
              </div>
              <div class="overvBox">
                <span class="overbgc">离线摄像头</span>
                <p class="overmsg">{{ offCamera }}个</p>
              </div>
              <div class="overvBox">
                <span class="overbgc">告警次数</span>
                <p class="overmsg">{{ alarmTime }}次</p>
              </div>
              <div class="overvBox">
                <span class="overbgc">已处理</span>
                <p class="overmsg">{{ processed }}次</p>
              </div>
            </div>
            <div id="mapChart" ref="mapChart" >
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="{width: '50%'; height: '60vh'; margin-top: 20px;}">
        <div id="trend" :class="isFullscreen?'smaEcarts':''">
          <div class="dash-title">告警趋势</div>
          <p class="trendTitle">目标评估</p>
          <p class="trenddes">{{ trendText }}</p>
          <div id="alarmLine" :style="{width: '100%', height: '120px'}" class="lineEcharts"></div>
        </div>
        <div id="dispose" :class="isFullscreen?'smaEcarts':''">
          <div class="dash-title">告警处理率</div>
          <div class="disbox">
            <div id="panel" :class="isFullscreen?'chartHei':''"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="18" style="margin-top:20px;margin-bottom:20px;">
        <el-col :span="16" style="padding-left:0;">
          <div id="classify" :class="isFullscreen?'smaEcarts':''">
            <div class="dash-title">
              各类告警占比
              <span style="cursor:pointer;" @click="goAlarmList">更多 ></span>
            </div>
            <div class="pie">
              <div id="man" :class="isFullscreen?'chartHei':''" class="canFu"></div>
              <div id="car" :class="isFullscreen?'chartHei':''" class="canFu"></div>
              <div id="bicycle" :class="isFullscreen?'chartHei':''" class="canFu"></div>
            </div>
          </div>
        </el-col>
        <el-col :span="8" style="padding-right:0;">
          <div id="hotarea" :class="isFullscreen?'smaEcarts':''">
            <div class="dash-title">热门告警位置</div>
            <div class="tagbox">
              <tag-cloud :data="hotTag" :hover="false" radius="20" rotate-angle-xbase="800" rotate-angle-ybase="800" @clickTag="clickTagItem"></tag-cloud>
            </div>
          </div>
        </el-col>
      </el-col>
      <el-col :span="6" style="margin-top: 20px;margin-bottom:20px;">
        <div id="net" :class="isFullscreen?'smaEcarts':''">
          <div class="dash-title">摄像头在线率</div>
          <div id="camerarate" :class="isFullscreen?'chartHei':''"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
// 引入水波球
import 'echarts-liquidfill'
import huayin from '@/json/weinan.json'
import elementResizeDetectorMaker from 'element-resize-detector'
// 引入基本模板
// const echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import {
  fetchAllData, fetchNowInfo
} from '@/api/dashboard'
function registerMap() {
  echarts.registerMap('渭南', huayin)
}
export default {
  name: 'Dashboard',
  // mixins: [PreCheck],
  components: {

  },
  data() {
    return {
      screenWidth: '',
      alarmTime: '',
      processed: '',
      offCamera: '',
      total: '',
      datay: [10, 11, 12],
      pieData: [{ value: 10, name: '嘻嘻' }],
      hotTag: [
        /* { 'id': '05023f8da31c4b4187cc6899e2a3aec2', 'name': '镇远县' } */
      ],
      alertHandleRate: '',
      trendText: '保持稳定',
      zhuData: [],
      zhuXdata: [],
      zhuYdata: [],
      mapShowData: [],
      isFullscreen: false,
      screenHeight: ''
    }
  },
  watch: {
    screenWidth(v) {
      const canvas = document.getElementsByTagName('canvas');
      [].forEach.call(canvas, function(item) {
        // do whatever
        item.style.width = '100%'
        item.parentNode.style = `position: absolute; width: 100%;height: 100%;top: 0%;left: 50%;transform: translateX(-50%); padding: 0px; margin: 0px; border-width: 0px; cursor: default;`
      })
    },
    screenHeight(v) {
      const canvas = document.getElementsByTagName('canvas');
      [].forEach.call(canvas, function(item) {
        // do whatever
        item.style.width = '100%'
        item.parentNode.style = `position: absolute; width: 100%;height: 100%;top: 0%;left: 50%;transform: translateX(-50%); padding: 0px; margin: 0px; border-width: 0px; cursor: default;`
      })
      if (v === window.screen.height - 50) {
        this.isFullscreen = true
      } else {
        this.isFullscreen = false
      }
    }
  },
  async created() {
    await this.getList()
    await this.getNowList()
    registerMap()
  },
  mounted() {
    const that = this
    that.screenWidth = document.getElementById('dashID').clientWidth
    that.screenHeight = document.getElementById('dashID').clientHeight
    const erd = elementResizeDetectorMaker()
    erd.listenTo(document.getElementById('dashID'), element => {
      that.$nextTick(() => {
        // 监听到事件后执行的业务逻辑
        that.screenWidth = element.clientWidth
        that.screenHeight = element.clientHeight
      })
    })
    // that.getMap()
    that.camerarate()
    that.drawPie('man', '人员', '#1890FF', NaN)
    that.drawPie('car', '机动车', '#5DDECF', NaN)
    that.drawPie('bicycle', '非机动车', '#2FC25B', NaN)
    that.getPanel(that.cameraOnlineRate)
    that.drawZhu('alarmLine')
  },
  methods: {
    goAlarmList() {
      this.$router.push('/alarmMessage')
    },
    checkFull() {
      var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
      // to fix : false || undefined == undefined
      if (isFull === undefined) {
        isFull = false
      }
      return isFull
    },
    getList() {
      // fetchAllData
      const params = {
        cascade: true,
        page: {
          index: 1,
          size: 20
        },
        params: {
        }
      }
      fetchAllData(params).then(res => {
        this.trendText = res.body.data.alertAvgVariance > 0.8 ? '治安案件有所降低' : res.body.data.alertAvgVariance > 0.4 ? '治安案件保持稳定' : '治安案件有所增加'
        res.body.data.alertStatisByMonthList.forEach((item, index) => {
          this.zhuData.push(
            [
              item.calMonth,
              item.alertCount
            ]
          )
          this.zhuXdata.push(item.calMonth)
          this.zhuYdata.push(item.alertCount)
        })
        this.drawZhu(this.zhuData, this.zhuXdata, this.zhuYdata)
      })
      // alertStatisByAddList
    },
    getNowList() {
      // fetchAllData
      const params = {
        cascade: true,
        page: {
          index: 1,
          size: 20
        },
        params: {
        }
      }
      fetchNowInfo(params).then(res => {
        this.total = res.body.data.offlineCameras + res.body.data.onlineCameras
        this.offCamera = res.body.data.offlineCameras
        this.alarmTime = res.body.data.todayAlerts
        this.processed = res.body.data.todayHandleds
        this.getPanel(parseInt(res.body.data.alertHandleRate * 100))
        this.camerarate(parseInt(res.body.data.cameraOnlineRate * 100))
        res.body.data.alertStatisByAddList.reverse().forEach((item, index) => {
          this.hotTag.push({
            id: new Date(), name: item.address, maxFont: index === 0 ? '12px' : (12 + index * 5) + 'px'
          })
          this.mapShowData.push({
            name: item.address, value: item.alertCount, latitude: item.latitude,
            longitude: item.longitude
          })
        })
        this.getMap(this.mapShowData)
        res.body.data.alertStatisByTypeList.forEach(item => {
          if (item.type === '1') {
            this.drawPie('man', '人员', '#1890FF', parseInt(item.typeRate * 100))
          } else if (item.type === '2') {
            this.drawPie('car', '机动车', '#5DDECF', parseInt(item.typeRate * 100))
          } else {
            this.drawPie('bicycle', '非机动车', '#2FC25B', parseInt(item.typeRate * 100))
          }
        })
      })
    },
    clickTagItem(tag) {
      // TODO
    },
    getMap(inData) {
      this.charts = echarts.init(document.getElementById('mapChart'))
      var data = []
      var geoCoordMap = {}
      inData.forEach(item => {
        data.push({
          name: item.name, value: item.value
        })
        geoCoordMap[item.name] = [item.longitude, item.latitude]
      })
      var convertData = function(data) {
        var res = []
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name]
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            })
          }
        }
        return res
      }
      var option = {
        backgroundColor: '#fff',
        title: {
          show: false
        },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          formatter: function(params) {
            if (typeof (params.value)[2] === 'undefined') {
              console.log(params, 'paramsparamsparamsparamsparamsparamsparams')
            } else {
              console.log(params, 'paramsparamsparamsparamsparamsparamsparamsparamsparamsparamsparams')
            }
          }
        },
        legend: {
          orient: '',
          left: 20,
          top: 20,
          selectedMode: false, // 取消图例上的点击事件
          icon: 'circle',
          data: ['小于50', '小于100', '大于100'],
          textStyle: {
            color: '#000'
          }
        },
        grid: {
          height: '100%',
          width: '100%'
        },
        xAxis: {
          type: 'category',
          show: true
        },
        yAxis: {
          position: 'right',
          axisLabel: {
            show: true
          },
          axisLine: {
            show: true
          },
          splitLine: {
            show: true
          },
          axisTick: {
            show: true
          }
        },
        geo: {
          map: '渭南',
          roam: true,
          aspectScale: 1,
          tooltip: {
            triggerOn: 'mousemove',
            formatter: '{a} <br/>{b} : {c}%'
          },
          label: {
            show: true,
            normal: {
              // show: 0,
              show: true,
              textStyle: {
                color: '#000'
              }
            },
            emphasis: {
              // show: 0,
              show: true,
              textStyle: {
                // show: 0,
                show: true,
                color: '#000'
              }
            }
          },
          zoom: 1.2,
          z: 13,
          itemStyle: {
            show: true,
            normal: {
              opacity: 0.4,
              areaColor: 'rgba(122,193,254,0.2)',
              borderColor: '#1c89cd',
              borderWidth: 2
            },
            emphasis: { // 鼠标移动上去变色
              show: false,
              opacity: 0.4,
              areaColor: 'rgba(122,193,254,0.2)',
              textStyle: {
                show: true
              }
            }
          }
        },
        series: [{
          type: 'effectScatter',
          coordinateSystem: 'geo',
          z: 12,
          symbolSize: 7,
          showEffectOn: 'render',
          rippleEffect: {
            period: 2,
            scale: 5,
            brushType: 'fill'
          },
          hoverAnimation: true,
          data: convertData(data),
          label: {
            normal: {
              show: false,
              textStyle: {
                color: '#000'
              },
              padding: [0, 0, -50, 0],
              formatter: function(item) {
                return item.name + `(${item.data.value[2]}次)`
              }
            },
            emphasis: {
              show: true,
              textStyle: {
                show: true,
                color: '#000'
              }
            }
          },
          itemStyle: {
            normal: {
              show: true,
              color: function(params) {
                if (params.data.value[2]) {
                  if (params.data.value[2] < 35) {
                    return '#17b885'
                  }
                  if ((params.data.value[2]) >= 35 && (params.data.value[2] <= 60)) {
                    return '#eec511'
                  }
                  if (params.data.value[2] > 60) {
                    return '#d04132'
                  }
                }
              },
              shadowBlur: 10,
              shadowColor: '#333'
            },
            emphasis: {
              show: true,
              areaColor: '#f00'
            }
          }
        },
        {
          name: '小于50',
          type: 'bar',
          color: '#17b885',
          legendHoverLink: true,
          tooltip: {
            position: [10, 10],
            backgroundColor: 'rgba(50,50,50,0.7)',
            triggerOn: 'mousemove',
            formatter: function(params) {
              console.log(params, 'paramsparamsparamsparamsparamsparamsparams')
              return params.data.name
            }
          }
        },
        {
          name: '小于100',
          type: 'bar',
          color: '#eec511',
          legendHoverLink: true,
          tooltip: {
            position: [10, 10],
            backgroundColor: 'rgba(50,50,50,0.7)',
            triggerOn: 'mousemove',
            formatter: function(params) {
              console.log(params, 'paramsparamsparamsparamsparamsparamsparams')
              return params.data.name
            }
          }
        }, {
          name: '大于100',
          type: 'bar',
          color: '#d04132',
          legendHoverLink: true,
          tooltip: {
            backgroundColor: 'rgba(50,50,50,0.7)',
            triggerOn: 'mousemove',
            formatter: function(params) {
              return params.data.name
            }
          }
        }
        ]
      }
      this.charts.setOption(option)
    },
    getPanel(rate) {
      this.charts = echarts.init(document.getElementById('panel'))
      this.charts.setOption({
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'
        },
        toolbox: { // 工具栏小图标
          show: false,
          feature: {
            restore: {},
            saveAsImage: {}
          }
        },
        series: [{
          name: '业务指标',
          type: 'gauge',
          splitNumber: 5,
          detail: { // 仪表盘详情，用于显示数据
            formatter: '{value}%',
            color: '#333333',
            fontSize: 16,
            fontWeight: 'bolder'
          },
          data: [{
            value: rate,
            name: ''
          }],
          axisLine: { // 表盘样式
            show: true,
            lineStyle: {
              width: 6, // 表盘粗细
              color: [
                [1, '#2d82ff']
              ],
              shadowBlur: 10,
              shadowColor: 'rgba(0, 103, 255, 0.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 8
            }
          },

          axisTick: {
            show: false, // 是否显示坐标轴小标记，这里不显示
            length: 8, // 属性length控制线长
            lineStyle: { // 属性lineStyle控制线条样式
              color: '#fff'
            }
          },
          splitLine: { // 分隔线
            length: 8, // 属性length控制线长
            lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
              color: 'rgba(255, 255, 255, 0.2)'
            }
          },
          pointer: { // 指针样式
            width: 3
          },
          itemStyle: { // 指针阴影
            shadowBlur: 10,
            shadowColor: 'rgba(0, 103, 255, 0.2)',
            shadowOffsetX: 0,
            shadowOffsetY: 8
          },
          axisLabel: { // 刻度标签。
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
          markPoint: { // 指针中心加一个小白点
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
        }]
      })
    },
    camerarate(rate) {
      var myChart = echarts.init(document.getElementById('camerarate'))
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: `在线率 \n ${rate}%`,
          textStyle: {
            fontSize: 20,
            fontFamily: 'Microsoft Yahei',
            fontWeight: 'normal',
            color: '#ccc',
            rich: {
              a: {
                fontSize: 28
              }
            }
          },
          x: 'center',
          y: '40%'
        },
        series: [{
          type: 'liquidFill',
          radius: '80%',
          center: ['50%', '50%'],
          //  shape: 'roundRect',
          phase: 0,
          direction: 'right',
          data: [0.5, 0.5, 0.5],
          backgroundStyle: {
            borderColor: 'rgba(0,150,255,0.4)', // 背景内边框
            color: 'rgba(0,150,255,0.4)' // 背景颜色
          },
          outline: {
            borderDistance: 0,
            itemStyle: {
              borderWidth: 1,
              borderColor: '#1890FF'
            }
          },
          // 图形样式
          itemStyle: {
            color: '#1890FF', // 水球显示的背景颜色
            opacity: 0.5, // 波浪的透明度
            shadowBlur: 2 // 波浪的阴影范围
          },
          backgroundStyle: {
            color: '#fff', // 水球未到的背景颜色
            opacity: 0.5
          },
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 1,
              color: '#0CB8EA'
            }, {
              offset: 0.5,
              color: '#0CB8EA'
            }, {
              offset: 0,
              color: '#0CB8EA'
            }],
            globalCoord: false
          },
          label: {
            normal: {
              formatter: ''
            }
          }
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    drawPie(id, name, color, percent) {
      var placeHolderStyle = {
        normal: {
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          color: 'rgba(0,0,0,0)',
          borderWidth: 0
        },
        emphasis: {
          color: 'rgba(0,0,0,0)',
          borderWidth: 0
        }
      }

      var dataStyle = {
        normal: {
          formatter: '{c}%',
          position: 'center',
          show: true,
          textStyle: {
            fontSize: '20',
            fontWeight: 'normal',
            color: '#34374E'
          }
        }
      }

      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        backgroundColor: '#fff',
        title: [{
          text: name,
          left: '50%',
          top: '60%',
          textAlign: 'center',
          textStyle: {
            fontWeight: 'normal',
            fontSize: '16',
            color: '#AAAFC8',
            textAlign: 'center'
          }
        }],
        series: [{
          type: 'pie',
          hoverAnimation: false, // 鼠标经过的特效
          radius: ['60%', '72%'],
          // center: ['30%', '50%'],
          startAngle: 225,
          labelLine: {
            normal: {
              show: false
            }
          },
          label: {
            normal: {
              position: 'center'
            }
          },
          data: [{
            value: 100,
            itemStyle: {
              normal: {
                color: '#E1E8EE'
              }
            }
          }, {
            value: 35,
            itemStyle: placeHolderStyle
          }

          ]
        },
        // 上层环形配置
        {
          type: 'pie',
          hoverAnimation: false, // 鼠标经过的特效
          radius: ['60%', '72%'],
          // center: ['30%', '50%'],
          startAngle: 225,
          labelLine: {
            normal: {
              show: false
            }
          },
          label: {
            normal: {
              position: 'center'
            }
          },
          data: [{
            value: percent,
            itemStyle: {
              normal: {
                color: color
              }
            },
            label: dataStyle
          }, {
            value: 35,
            itemStyle: placeHolderStyle
          }

          ]
        }
        ]
      })
    },
    drawZhu(data, xData, yData) {
      var charts = echarts.init(document.getElementById('alarmLine'))
      var XName = xData
      var data1 = yData
      var img = [
        'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABRCAYAAABFTSEIAAAACXBIWXMAAAsSAAALEgHS3X78AAAEp0lEQVR42u3cz4sjRRTA8W9Vd3Vn8mMmjj9WQWSRZQ+CsH+B7MnDIgiCd0E8CYJ/gOAIelo8ehUP/gF6WLw5/gMueFP2sIcF0dHd2Z1kknR11fOQZJJJMtlZd03H7HtQpNOTnpn+8Lrm1etmjIig8e/DKoECKqACKqCGAiqgAiqghgIqoAIqoIYCKqACKqCGAiqgAiqghgIqoAJudKTr+osZMNPvBUQBHwHsPF9fB9R0DeHMOQ6T6WOrhEzXBM4swDOL0M6CrArRVoq3t2dGUIb9fTvatg8ZZup1PDBgzPmy98mey6qfzjLz2WaWjEUZKEvGyi9nWyneMOvGIyFQo2Sbg4MUSChpU9IeTTUpJdsEajPZOJeJG5uBZj7rLLduWS5dGm6XNLEELOFUFj54ACJCaychkpDSASK3bwsXL0YgVpWJKwM0iy9Zy8HdGru7jvt3Pbu7w0wES7drTwAbjTHMGCsQcIAnYTC1/wRx0wEnl27JNgZI8HQ6Kc1mQq83RNzaMjPzXqDbjTQaJRFLxIyyMSxAXEkWrhrQzAAmo5HOjCQf7jflILxOkohL+aUPgV4vEGNJo+E5PAy02+UIMEwBxo0CPDP7Dg5SnEtpt1PA0e87XO25FOoh8IYIH2Y5b45RzGAQBiIltZoHxqMcjbksXAVgdc2EQMYzzzdotyeZWKuleULXJtwT4SODfC2QCWR+IF9KnjuX1Xbo99Op7LVE8iXlz0YBTk5SyLEEjo5OLuccEoFUvHfO+reuUPx4zftXAIcx1hdcF+/TvFab4A0Bs0VwqyhpVnkJT89/Q4DDQ0e77YCMwIUsFMeFZD856699URRvX4nxE4A/jbnxXp7v4Zw3ReGNSDHI8wFQjIafuoyn58L/fB6sth/Ybg9fez2TRC6QZcZYvgHsazF+MP7YCyLXcM7gvSXLDGBqYDg+NhwdmSpPoTrAkub0W+f4FSB1fDucIunMHSLpO8WAH0rSy8u+19MBCHB4OHzd2pI+CEUhpigEiN+l6WcdY252jLn5s7Wf472ImPcN8pUl/tEHoV4XWq1Ke4KrLmPsTA3oODpytFoOyJKSyzHyMSIxteWngMW5cSEdDJQUhTdZVgxOz3/+jFJm4+bA2e5JpNU6WZ4Fw99JwnWMKccwpeddP+B7GZTNUPKqybJy0O+Hs1YfMz9swwvpB8fbGDG0GuGkkK7V0hxSmZQpABI8l2z0v3sJf50qpAMJCd2qCulql3LD1lRGQjm7lEsDz0rkxTQOfiPPxUBcuJTbbhss/Y1eyi3NwsmKInmkZsKk5gtPUzNhvp11507CSy/X6XYStpvFudpZw1ZWIOF4Cq6SdtbKbioJyAhRTu3u9yMJXerN+ugvaQQsjcZ8Q3VnZwxlSDhe1lB9GjrSw5b+1avT8+Jw+979nNaOI6U3KpTrWAosxVQmygK4ld8X0ZtK/7eViExD7O1NQPb3T7fsl4/4sBpwYzPwjFbTo95Yl9l9Vd1YN1X/147HebSjary1AHyc5qc+XLQEQx9ve8Kg6xr6hKoCKqACKqCGAiqgAiqghgIqoAIqoIYCKqACKqCGAiqgAiqghgIq4JrHP8fEWV8FMTmOAAAAAElFTkSuQmCC',
        'image://data:image/png;base64,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',
        'image://data:image/png;base64,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',
        'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAABPCAYAAACqNJiGAAAACXBIWXMAAAsSAAALEgHS3X78AAAHaUlEQVR42u3cv29jWRUH8O+5P96zX5x4Mk4yjCW0S5QqZil2aIEUUG5BEQr4B2joKBclrhAF1HR0gNYVK6BapDSIyhSLnAKNxBSrLJOJd+L413vv3nsOhfNjMhmx4sfaSXSP5ESOrt/1++jcn+8qJCKI8d+FigQRL+JFvIgXI+JFvIgX8WJEvIgX8SJexIsR8SJexIt4MSJexIt4ES9GxPvfw9zGL0Ugev1vgtv3gJluw0NvApH8R+VvB+ZC8a6jCdpo096/Kd8GsIc9mfEtHnGBzXYG18b+OVgb2+gRABzgBQE7r5Q9wA7WZfuScB9tAIJ9AYiwIECz2GzbpyuwFm1ilQBgA63X+rwdAEeyCeAAkB30ziH3gXPARWTh3EfbWbaBgH0CerSOFnWxqjYAVUeqnqGpB58M9AquXoNPBvoZmrqOVG0AqotVtY4WAT0C9qkNkNz/Pu9iFN0/v/EWHQIqQZ9UqCeauaLJcWqWilM/WQYANhg9RCaFH6eMRNjYiUdfSjRkG2CgJ0BLZhkIzLMJzxHvzXAZnqn+p4mqVauZ1srQkvWToQqaisumGySVbJm1jJ0p82I09Z4bj0ue4G1eJOBc8drnfdw6WrQBqAxQyrtseuqcXSOVn5XarCilR6QUJTSFoyqssJQSasL+jLmykgR3Ilx9YC0bO5kAfAzwC/TkEC3Zw77MC28uA8bFIDEbVXfRxUeUICXlV7KCnE7XSraoatJsFKrKaa8ZOYEsseQiMJLCBKvHnECRWpuGIkCnHllizsbLKGgHuwIcvlLfFw84lwFDzn920CPgkKpoUgVGjYwt7bB05VCbwdhbu1QznBeJKJeI0kkKvAsy74J4k/MisUs1Mxh7Ww61scPSjYwtKzCqiiYBhzS7vkDuV59Hl6NrF6uqjlRNnqcme1TTFcC4cWmD8lYTrTNQBeSbAH4kKnzHQgsLmKGCFngv7DUbZ5cSlwN+8nwUskeFH6DgJ3jJV33fPcm8q6lui6qHTTJoUOVhsmRwqvJRoQ15ratWS8kjVvISwDcAfCxOJYWjhAW/gPAPAnNLWb1myOt8VGiDUzW7ToOqh006uDE/vON4Nxb524DBgKC9n5yR0kSqJK91EbSqsNYgI+zfh1bvV6W1rRMygHwM4LtKcx8+PC7Ja02kJmekoL03GBC2P39z4Q42W6LzqTEBUE+f9vVgqaHrad94W7MV5S1rlQjkHQJ9PQT+ncVXvpzxO78GqAbwP4fqL99nnLxMrSmdSEkipQpc5myccSM3KBq+Pu6Hra1GAMC4XP9+sTc3t2bb6cyWYdgCmo8BPGxgGQCRJYInQI4F8kMiTRV5+70ZHACoL2Wy/R6RphJMhEAET0SWljG7TvPx7LrX6rlPy7Pd3dZlFpSuXAL6GAKYYHKRn6ei6NvGBgHx8HryhjNtQkosH4nQV3H+uVmhPgIH/aZ67gneVTJsoSGDs0GJz4Daci5VsSIwIoUXC2ER4dz0PhRM/yBwf2WMfztO/vyhCKoE/BLMIjBSFSu15VzwGXDSP8EWGvKm+u70JJku53nAAYANAA8bSTk+sYYHSoL2LCKsErPlmQpA/Vzk5PfDyp9+AhcIVguXgWHtsYL6jVHsnMyQ1SCVwFbW1p0/BHCMq42sV+u9s5n36kx/tpV0JB51ebDG7OvCQYSdlEFAnwLCAD4goq+ReEeE71HgP2ptfkYsmyLhcYAOTsoQRNjXhR+sMXvUZRtHsoOevKneO9/ntc9/d7uAR19yV2YhSFJZtmE1q3rPeEGgfzC5D1JSPybhUin6FZH/lgZ+KmAP4NSx+NWs6ivLNoQgSe7KzKMv3e71eu7ZCmO2o3IAqA1AVYJPEymS3Cy5CgamGGljlNeOEh2I1wzUIw/+ewojUzixooOVMng2Ia0Fn6PuK35sS0rLXJviGOAdgOe5szKXzKNre8I9mXaPZFObAsZPyhfHnKHubc24JNNOc+GY/fOE8besogrNXIJDqblwSaadrRmXoe7LF8cM4yeb2hTT7vUmS/cr827u512scSswSrypWUUhPyt5okjVVyqkUF4aMBIZnOWSsXBlJVFeBNB+msPzzTXt/Pbz5tbn0St9X6cDDNGUAQrOn3p2lOYlTzFxpdcr1k0xclOYV14jp1esm7jSlzyF10uT/OkMboimdDpXfR3dvz7vZvZ1Oj3a3QW6WFVVNClBnwwaRGGYgNN0YMsJAFhPlUysgioK0cvlxRb8FEfyBC+507mYGM9/G37OD4AubmxfDndbArTkCV7yNsADFDxBj9/Sy7mzw7MMhc9QeGvykbPDs7f0cj5BjwcoeBu4bKqHC4JbQOa9noHnWYge7WL2vHbnfJrbxdFlmSdoymySPXt+2wGwe62Pmz/cAvHedMRi/xKrg5uL+xnWZVm5voJZzE0s/KzKTcTZu3a7TdibjTB7e3vy+nBwG86r0G367xafd+DnthzwuZV4dy3i4caIF/EiXsSLEfEiXsSLeDEiXsSLeBEv4sWIeBEv4kW8GBEv4kW8iBcj4v0f4l+bPQ5YnMn04QAAAABJRU5ErkJggg=='
      ]
      var option = {
        backgroundColor: '#fff',
        grid: {
          left: '5%',
          top: '5%',
          bottom: '5%',
          right: '5%'
        },
        legend: {
          type: 'scroll',
          data: '来电量',
          itemWidth: 18,
          itemHeight: 12,
          textStyle: {
            color: '#00ffff',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        yAxis: [{
          type: 'value',
          position: 'left',
          nameTextStyle: {
            color: '#00FFFF'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(135,140,147,0.8)'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: '{value}',
            color: '#000',
            fontSize: 14
          }
        }],
        xAxis: [{
          type: 'category',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#0696f9'
            }
          },
          axisLabel: {
            inside: false,
            textStyle: {
              color: '#000', // x轴颜色
              fontWeight: 'normal',
              fontSize: '14',
              lineHeight: 22
            }
          },
          data: XName
        }],
        series: [{
          symbolSize: 150,
          symbol: img[2],
          name: '告警数',
          type: 'line',
          data: data1,
          itemStyle: {
            normal: {
              borderWidth: 5,
              color: '#0696f9'
            }
          }
        },
        {
          name: '滑行的光点',
          type: 'lines',
          coordinateSystem: 'cartesian2d',
          symbolSize: 30,
          polyline: true,
          effect: {
            show: true,
            trailLength: 0,
            symbol: 'arrow',
            period: 10, // 光点滑动速度
            symbolSize: 150
          },
          lineStyle: {
            normal: {
              show: true,
              width: 1,
              opacity: 0.6,
              curveness: 0.2
            }
          },
          data: data
        }
        ],
        grid: {
          left: '25px',
          top: '25px',
          bottom: '25px',
          right: '25px'
        }
      }
      charts.setOption(option)
    }
  }
}

</script>

<style lang="scss" scoped>
.main-container {
  background-color: #F0F2F5;
  }
  #dashID{
    height: 100%;
  }
#panel {
  overflow: hidden;
  position:relative !important;
  div {
    width: 100%;
    position: absolute !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
}
#alarmLine {
  overflow: hidden;
  position:relative !important;
  div {
    width: 100%;
    position: absolute !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
}
#man {
  position:relative !important;
  div {
    width: 100%;
    position: absolute !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
}
#car {
  position:relative !important;
  div {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
}
#bicycle {
  position:relative !important;
  div {
    width: 100%;
    position: absolute !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
}
#alarmLine {
  overflow: hidden;
  position:relative !important;
  div {
    width: 100%;
    position: absolute !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
}
#camerarate {
  overflow: hidden;
  position:relative !important;
  div {
    width: 100%;
    position: absolute !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
}
.dashboard-container {
  height: 759px;
  padding: 0px 20px;
  background: #F0F2F5;
  #map {
    height: 440px;
    background-color: #fff;
  }
  #trend{
    height: 30%;
    background-color: #fff;
    .trendTitle {
      padding: 0;
      font-size: 12px;
      color: #ccc;
      margin-left: 10px;
      margin-top: 10px;
    }
    .trenddes {
      margin: 0;
      padding: 0;
      font-size: 12px;
      margin-left: 10px;
    }
  }
  #dispose {
    height: 30%;
    background-color: #fff;
    margin-top:20px;
  }
  #classify {
    height: 30%;
    background-color: #fff;
  }
  #hotarea {
    height: 30%;
    background-color: #fff;
  }
  #net {
    height: 30%;
    background-color: #fff;
    #camerarate {
      height: 170px;
      display: flex;
    }
  }
  .status {
    margin-top: 20px;
  }
  .box-device {
    .device-panel {
      display: flex;
      height: 120px;
      .device-unit {
        flex: 1;
        padding: 15px 0;
        text-align: center;
        .unit-label {
          font-size: 14px;
          line-height: 40px;
          color: #ccc;
        }
        .unit-val {
          font-size: 26px;
          line-height: 50px;
          color: #FF9832;
        }
      }
    }
  }
  .box-line {
    margin-top: 20px;
  }

  .dash-title {
    position: relative;
    margin: 0;
    padding: 0;
    padding-left: 20px;
    font-size: 14px;
    border-bottom: 1px solid #F0F2F5;
    height: 40px;
    line-height: 40px;
    color: #333;
    position: relative;
    span {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #1890FF;
      line-height: 22px;
      position: absolute;
      top: 50%;
      right: 3%;
      transform: translateY(-50%);
    }
    .close {
      position: absolute;
      top: 20px;
      right: 10px;
      font-size: 16px;
      transform: translate(-50%, -50%);
    }
  }
}
.el-row {
  height: 100vh;
}
.mapbox {
  height: 400px;
  padding: 0;
  overflow: hidden;
  #mapChart {
    width: 100%;
    height: 330px;
    margin-top:20px;
    display: flex;
    overflow: hidden;
    position:relative !important;
    div {
      width: 100%;
      height: 100%;
    }
    canvas {
      width: 100%;
      height: 100%;
      background-color: transparent;
    }
  }
  .overv {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: flex-start;
    .overvBox {
      margin-left: 16px;
      margin-right: 50px;
      padding-top: 10px;
      .overbgc {
            font-size: 12px;
            color: #939393;
          }
      .overmsg {
        -webkit-margin-before: 0;
        -webkit-margin-after: 0;
        font-size: 20px;
        flex-wrap: 700;
        color: #000;
        margin-top: 10px;
      }
    }

  }
  .amap-logo {
    opacity: 0;
  }
}
.pie {
  height: 170px;
  display: flex;
  overflow: hidden;
}
.canFu {
    height: 100%;
    flex: 1;
  }
  .tagbox {
    width: 100%;
    height: 170px;
    overflow: hidden;
    .tag-cloud {
    height: 100%;
  }
  }
  .disbox {
    width: 100%;
    height: 170px;
    #panel {
      height: 100%;
    }
    #panel>div {
      height: 100%;
    }
  }
  .smaEcarts {
    height: 240px !important;
  }
  .mapE {
    height: 500px !important;
  }
  .chartHei {
    height: 210px !important;
  }
</style>
