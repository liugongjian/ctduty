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
          2
        </div>
        <div id="dispose">
          <div class="dash-title">告警处理率</div>
          3
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
            5
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
      pieData: [{ value: 10, name: '嘻嘻' }]
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
  },
  methods: {
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
                        fontSize: 28,
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
          data:  [0.5, 0.5, 0.5],
          backgroundStyle: {
            borderColor: 'rgba(0,150,255,0.4)', //背景内边框
            color:'rgba(0,150,255,0.4)', //背景颜色 
          },
          outline: {
            borderDistance: 0,
            itemStyle: {
              borderWidth: 1,
              borderColor: '#1890FF',
            }  
          },
            // 图形样式
          itemStyle: {
            color: '#1890FF', // 水球显示的背景颜色
            opacity: 0.5, // 波浪的透明度
            shadowBlur: 10 // 波浪的阴影范围
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
                    formatter: '',
                }
            }
        }, ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
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
        // 第一个图表
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
</style>
