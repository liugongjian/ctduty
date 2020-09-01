<template>
  <div class="chinaecharts">
    <div class="top">
      <p>摄像头分布情况</p>
    </div>
    <div class="map">
      <div class="overv">
        <div class="overvBox">
          <span class="overbgc">总摄像头</span>
          <p class="overmsg">{{ total }}</p>
        </div>
        <div class="overvBox">
          <span class="overbgc">开启率</span>
          <p class="overmsg">{{ onlineRatio }}%</p>
        </div>
        <div class="overvBox">
          <span class="overbgc">在线总数</span>
          <p class="overmsg">{{ online }}</p>
        </div>
        <div class="overvBox">
          <span class="overbgc">离线总数</span>
          <p class="overmsg">{{ offline }}</p>
        </div>
      </div>
      <br>
      <div id="mapChart" ref="mapChart" ></div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import ningxia from 'echarts/map/json/province/ningxia.json'
import { fetchdeviceList } from '@/api/applications'
import {
  alarmStatus
} from '@/api/user'
function registerMap() {
  echarts.registerMap('宁夏', ningxia)
}
export default {
  name: 'ChinaEcharts',
  data() {
    return {
      mapData: [],
      online: '',
      offline: '',
      onlineRatio: '',
      total: ''
    }
  },
  mounted() {
    registerMap()
    this.getData()
    this.getStatus()
  },
  methods: {
    getData() {
      fetchdeviceList().then(res => {
        this.mapData = res.data
        this.mapFn(res.data)
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
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return '更新时间: ' + params.data.createTime[2] + '<br/>' + '设备名称: ' + params.data.deviceName[2] + '<br/>' + '安装位置: ' + params.data.installAddress[2]
          },
          extraCssText: 'height:50px; white-space:pre-wrap;'
        },
        geo: {
          map: '宁夏',
          roam: true,
          aspectScale: 1,
          scaleLimit: { // 所属组件的z分层，z值小的图形会被z值大的图形覆盖
            min: 1.23, // 最小的缩放值
            max: 1.23 // 最大的缩放值
          },
          label: {
            emphasis: {
              show: true,
              color: '#fff'
            }
          },
          itemStyle: {
            normal: {
              borderColor: '#ff5722',
              show: true
            },
            emphasis: {
              areaColor: '#5B8FF9',
              show: true
            }
          }
        },
        series: [
          {
            name: 'pm2.5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(geoCoordMap, locValue).slice(0, 4),
            symbolSize: 12,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
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
    async getStatus() {
      const res = await alarmStatus()
      if (res.code === 0) {
        res.data.map((item, index) => {
          if (item.name === 'online') {
            this.online = item.count
          } else if (item.name === 'offline') {
            this.offline = item.count
          } else if (item.name === 'total') {
            this.total = item.count
          } else {
            this.onlineRatio = item.count
          }
        })
      }
    }
  }
}
</script>
<style lang='scss'>
.chinaecharts {
    width: 100%;
    padding:0 20px;
}
.top {
  width: 100%;
  height: 30px;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid #f1f1f1;
  p {
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
    text-indent: 16px;
    line-height: 30px;
  }
}
.map {
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
            color: #ccc;
          }
      .overmsg {
        -webkit-margin-before: 0;
        -webkit-margin-after: 0;
        font-size: 26px;
        flex-wrap: 700;
        color: #FFA750;
        margin-top: 10px;
      }
    }

  }
  #mapChart {
    width: 100%;
    height: 500px;
  }
}
</style>
