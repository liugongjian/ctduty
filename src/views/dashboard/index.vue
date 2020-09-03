<template>
  <div class="dashboard-container">
    <el-row :gutter="12">
      <el-col :span="18" class="status">
        <div id="map">
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
            <div id="mapChart" ref="mapChart" ></div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="{width: '50%'; height: '532px'; margin-top: 20px;}">
        <div id="trend">
          <div class="dash-title">告警趋势预测</div>
          <p class="trendTitle">目标评估</p>
          <p class="trenddes">治安状况保持稳定</p>
          <div id="alarmLine" :style="{width: '100%', height: '120px'}" class="lineEcharts"></div>
        </div>
        <div id="dispose">
          <div class="dash-title">告警处理率</div>
          <div class="disbox">
            <div id="panel"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="18" style="margin-top:20px;margin-bottom:20px;">
        <el-col :span="16" style="padding-left:0;">
          <div id="classify">
            <div class="dash-title">各类告警占比</div>
            <div class="pie">
              <div id="man" class="canFu"></div>
              <div id="car" class="canFu"></div>
              <div id="bicycle" class="canFu"></div>
            </div>
          </div>
        </el-col>
        <el-col :span="8" style="padding-right:0;">
          <div id="hotarea">
            <div class="dash-title">热门告警位置</div>
            <div class="tagbox">
              <tag-cloud :data="hotTag" radius="20" rotate-angle-xbase="800" rotate-angle-ybase="800" @clickTag="clickTagItem"></tag-cloud>
            </div>
          </div>
        </el-col>
      </el-col>
      <el-col :span="6" style="margin-top: 20px;margin-bottom:20px;">
        <div id="net">
          <div class="dash-title">摄像头在线率</div>
          <div id="camerarate"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
// 引入水波球
import 'echarts-liquidfill'
import ningxia from '@/json/weinan.json'
// 引入基本模板
// const echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import {
  fetchUser, fetchCommunity, alarmStatus
} from '@/api/user'
function registerMap() {
  echarts.registerMap('渭南', ningxia)
}
export default {
  name: 'Dashboard',
  // mixins: [PreCheck],
  components: {

  },
  data() {
    return {
      mapData: [{
        cloudStorageType: 1,
        deviceId: 46600,
        deviceName: '何滩村三队（低端）',
        deviceNum: '64050200001327272790',
        devicePassword: 'zwdx@2020',
        devicePublicIp: '',
        devicePublicPort: '',
        id: '4028855e740f8e0501740f8e0fcc0000',
        installAddress: '渭南',
        isOnline: 1,
        isSupportPtz: 1,
        latitude: '34.50',
        loginName: '',
        loginPassword: '',
        longitude: '109.50',
        parentNvrNum: '',
        playbackProtocol: 0,
        updateStateTimeString: '2020-08-21 13:46:28'
      }],
      alarmTime: '888',
      processed: '666',
      offCamera: '5000',
      total: '10000',
      datay: [10, 11, 12],
      pieData: [{ value: 10, name: '嘻嘻' }],
      hotTag: [
        { 'id': '05023f8da31c4b4187cc6899e2a3aec2', 'name': '镇远县' },
        { 'id': '0ef028e5278f4f5ca31f99f1bd22b1cc', 'name': '剑河县' },
        { 'id': '1a32ef04d3c548eaa6777abb46da32f2', 'name': '台江县' },
        { 'id': '2c26488325bd493687d16315fe0e5fdd', 'name': '岑巩县' },
        { 'id': '3a786111828a4b9f89ae9da25753eedd', 'name': '黎平' },
        { 'id': '4ed593eed91b4244969995237f5c96c5', 'name': '丹寨县' },
        { 'id': '615d2c178f1a47cb8d473823e74f5386', 'name': '凯里市' },
        { 'id': '76f652df03db43349272a9aff492b065', 'name': '榕江县' },
        { 'id': '8ff29d0d35e548feb945063b34ed9c9b', 'name': '黄平县' },
        { 'id': 'a8ac2170008746fdadc05ea461bc5e37', 'name': '雷山县' }
      ]
    }
  },
  computed: {},
  created() {
  },
  mounted() {
    const that = this
    registerMap()
    that.mapFn(that.mapData)
    that.camerarate()
    that.drawPie('man', '人员')
    that.drawPie('car', '机动车')
    that.drawPie('bicycle', '非机动车')
    that.getPanel()
    this.drawZhu('alarmLine')
  },
  methods: {
    clickTagItem(tag) {
      // TODO
    },
    getPanel() {
      var datas = {
        value: 3,
        type: 1,
        radiusType: 1
      }
      var fontColor = '#1e87f0'
      const noramlSize = 12
      const state = ''
      const center = ['50%', '70%']
      const nqradius = '100%'
      const kdradius = '100%'
      const wqColor = 'rgba(80, 152, 237,0.9)'
      const nqColor = [
        [datas.value / 5, '#1e87f0'],
        [1, '#e6e6e6']
      ]
      this.charts = echarts.init(document.getElementById('panel'))
      this.charts.setOption({

        title: {
          show: true,
          x: 'center',
          bottom: '0%',
          text: datas.title,
          textStyle: {
            fontWeight: '700',
            fontSize: 12,
            color: fontColor
          }
        },
        tooltip: {
          show: false
        },
        series: [{
          name: '刻度文字',
          type: 'gauge',
          radius: kdradius,
          center: center,
          startAngle: 180,
          endAngle: 0,
          z: 7,
          splitNumber: 5,
          min: 0,
          max: 5,
          axisTick: {
            show: true,
            lineStyle: {
              color: '#ffffff',
              width: 1
            },
            length: 0,
            splitNumber: 4
          },
          splitLine: {
            show: false,
            length: 10
          },
          axisLine: {
            lineStyle: {
              width: 5,
              opacity: 0
            }
          },
          axisLabel: {
            fontSize: noramlSize,
            color: fontColor,
            lineStyle: {
              width: 2
            },
            formatter: function(v) {
              var str = ''
              switch (v) {
                case 1:
                  str = '差'
                  break

                case 2:
                  str = '中'
                  break

                case 3:
                  str = '良'
                  break

                case 4:
                  str = '优'
                  break
              }
              return str
            }
          },
          pointer: {
            show: false
          },
          detail: {
            show: false
          }
        },
        {
          name: '指针',
          type: 'gauge',
          z: 9,
          radius: '60%',
          startAngle: 180,
          endAngle: 0,
          center: center,
          axisLine: {
            lineStyle: {
              width: 0
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false,
            length: 0
          },
          axisLabel: {
            show: false
          },
          min: 0,
          max: 5,
          pointer: {
            show: true,
            width: 5,
            length: '80%'
          },
          itemStyle: {
            normal: {
              color: wqColor
            }
          },
          detail: {
            show: true,
            offsetCenter: [0, '40%'],
            formatter: function(v) {
              var str = ''
              switch (v) {
                case 1:
                  str = '25%'
                  break
                case 2:
                  str = '50%'
                  break

                case 3:
                  str = '75%'
                  break

                case 4:
                  str = '100%'
                  break
              }
              return [
                '{value|' + (str) + '} ',
                '{company|' + state + '}'
              ].join('\n')
            },
            rich: {
              value: {
                fontSize: 25,
                lineHeight: 10,
                color: '#1e87f0',
                fontWeight: '700'
              },
              company: {
                fontSize: 16,
                lineHeight: 20,
                color: '#1e87f0'
              }
            }
          },
          data: [datas.value]
        },
        {
          name: '内层盘',
          type: 'gauge',
          z: 6,
          top: '20%',
          radius: nqradius,
          startAngle: 180,
          endAngle: 0,
          center: center,
          axisLine: {
            lineStyle: {
              color: nqColor,
              width: 10,
              opacity: 0.9
            }
          },
          splitNumber: 4,
          min: 0,
          max: 5,
          axisTick: {
            show: false
          },

          axisLabel: {
            show: false
          },
          pointer: {
            show: false
          },

          detail: {
            show: 0
          }
        }
        ],
        grid: {
          x: 25,
          y: 45,
          x2: 5,
          y2: 20
        }
      })
    },
    mapFn(data) {
      var geoCoordMap = { // 这里放你打点的坐标信息，虚拟信息
      }
      var locValue = [
      ]
      data.forEach(item => {
        geoCoordMap[item.installAddress] = [item.longitude, item.latitude]
        locValue.push({ name: item.installAddress, value: item.deviceNum, createTime: item.updateStateTimeString, deviceName: item.deviceName, installAddress: item.installAddress })
      })
      var convertData = function(geoCoordMap, data) {
        var res = []
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name]
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value),
              createTime: geoCoord.concat(data[i].createTime),
              deviceName: geoCoord.concat(data[i].deviceName),
              installAddress: geoCoord.concat(data[i].installAddress)
            })
          }
        }
        return res
      }
      var chart = echarts.init(document.getElementById('mapChart'))
      var option = {
        visualMap: {
          min: 0,
          max: 1000,
          left: 80,
          bottom: 50,
          // 上下拖动
          realtime: false,
          // 平均分层
          splitNumber: 5,
          inRange: {
            color: ['#fff', '#b8ddf0', '#e0bdb8', '#e16f56', '#EB190A']
          },
          outOfRange: {
            color: ['#fff']
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return '更新时间: ' + params.data.createTime[2] + '<br/>' + '设备名称: ' + params.data.deviceName[2] + '<br/>' + '安装位置: ' + params.data.installAddress[2]
          },
          extraCssText: 'height:50px; white-space:pre-wrap;'
        },
        geo: {
          map: '渭南',
          roam: true,
          aspectScale: 1,
          scaleLimit: { // 所属组件的z分层，z值小的图形会被z值大的图形覆盖
            min: 1, // 最小的缩放值
            max: 1 // 最大的缩放值
          },
          label: {
            emphasis: {
              show: true,
              color: '#fff'
            }
          },
          itemStyle: {
            borderColor: '#000',
            normal: {
              borderColor: '#ff5722',
              show: false
            },
            emphasis: {
              areaColor: '#5B8FF9',
              show: true
            }
          },
          regions: [{
            name: '华阴市',
            itemStyle: {
              areaColor: '#ccc',
              color: '#ccc',
              borderColor: '#ccc'
            }
          }]
        },
        legend: {
          orient: 'horizontal',
          left: '0%',
          bottom: '0%', // 图例距离左的距离
          icon: 'rect',
          width: '100%',
          textStyle: {
            fontSize: 8
          },
          itemWidth: 200,
          tooltip: {
            show: true
          }
        },
        series: [
          {
            name: 'pm2.5',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertData(geoCoordMap, locValue).slice(0, 4),
            symbolSize: 24,
            label: {
              opacity: 0.5,
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              color: '#266ABE',
              opacity: 0.8,
              emphasis: {
                borderColor: '#fff',
                borderWidth: 1
              }
            }
          }
        ]
      }
      chart.setOption(option)
    },
    camerarate() {
      console.log('jjjj')
      var myChart = echarts.init(document.getElementById('camerarate'))
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '在线率 \n 20%',
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
    drawPie(id, name) {
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
            value: 75,
            itemStyle: {
              normal: {
                color: '#6F78CC'
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
    drawZhu(id) {
      var charts = echarts.init(document.getElementById('alarmLine'))
      var data = [{ name: '7月', testRate: 0.56, score: 0.80, state: '薄弱' }, { name: '8月', testRate: 1.56, score: 1.81, state: '薄弱' }, { name: '9月', testRate: 0.56, score: 0.80, state: '薄弱' }]
      var option = {
        backgroundColor: '#fff',
        color: ['#1890FF', 'RGB(45,188,255)'],
        title: {
          top: 18,
          left: 'center',
          textStyle: {
            color: '#333',
            fontSize: 16,
            fontFamily: 'MicrosoftYaHei-Bold'
          }
        },
        legend: {
          show: false
        },
        grid: {
          top: '35%', // 距上边距
          left: '10%', // 距离左边距
          right: '10%', // 距离右边距
          bottom: '10%' // 距离下边距
        },
        xAxis: {
          show: true,
          name: '',
          data: ['7月', '8月', '9月'],
          axisTick: {
            show: true,
            alignWithLabel: true,
            length: 0
          },
          nameTextStyle: {
            color: '#999'
          },
          axisLabel: {
            show: false
          },
          boundaryGap: false,
          // 轴线样式
          axisLine: {
            lineStyle: {
              color: '#e0e7ff'
            }
          }
        },
        yAxis: {
          name: '',
          max: 10,
          min: 0,
          nameTextStyle: {
            color: '#999'
          },
          axisLabel: {
            color: '#999'
          },
          // 网格样式
          splitLine: {
            show: false,
            lineStyle: {
              color: 'RGBA(128,151,177,0.76)',
              width: 1,
              type: 'dashed'
            }
          },
          // 轴线样式
          axisLine: {
            show: false,
            lineStyle: {
              color: '#e0e7ff'
            }
          },
          axisTick: {
            show: false, // 不显示刻度
            alignWithLabel: true, // 刻度与标签对齐
            interval: 1
          }
        },
        tooltip: {
          confine: true,
          trigger: 'axis', // axis为整个系列（a1有效），item为各个部分（a1无效）
          // position: 'bottom', //trigger: 'item'有效
          formatter: function(a) {
            console.log(a[0].dataIndex)
            var i = a[0].dataIndex
            var text = a[0].name + '<br>测试概率&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data[i].testRate + '<br>中高考分值&nbsp;&nbsp;&nbsp;&nbsp;' + data[i].score + '<br>掌握程度&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data[i].state
            return text
          }
        },
        series: [{
          name: '优秀学生',
          type: 'line',
          symbol: 'none',
          smooth: true,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: '#ffffff'
              },
              {
                offset: 1,
                color: '#1890FF'
              }
              ])
            }
          },
          data: [1, 6, 8]
        }
        ],
        grid: {
          top: '10%', // 距上边距
          bottom: '10%' // 距离下边距
        }
      }

      charts.setOption(option)
    }
  }
}

</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 0px 20px;
  background: #F0F2F5;
  #map {
    height: 440px;
    background-color: #fff;
  }
  #trend{
    height: 210px;
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
    height: 210px;
    background-color: #fff;
    margin-top:20px;
  }
  #classify {
    height: 210px;
    background-color: #fff;
  }
  #hotarea {
    height: 210px;
    background-color: #fff;
  }
  #net {
    height: 210px;
    background-color: #fff;
    #camerarate {
      height: 170px;
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
    .close {
      position: absolute;
      top: 20px;
      right: 10px;
      font-size: 16px;
      transform: translate(-50%, -50%);
    }
  }
}
.mapbox {
  height: 350px;
  #mapChart {
    width: 100%;
    height: 100%;
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
</style>
