<template>
  <div class="dashboard-container">
    <el-row :gutter="12">
      <el-col :span="12" class="status">
        <el-col :span="12">
          <div class="box-dashboard box-device">
            <div class="dash-title">设备状态</div>
            <div class="device-panel">
              <div class="device-unit">
                <div class="unit-label">在线设备</div>
                <div class="unit-val">{{ online }}</div>
              </div>
              <div class="device-unit">
                <div class="unit-label">离线设备</div>
                <div class="unit-val">{{ offline }}</div>
              </div>
            </div>
          </div>
          <div class="box-dashboard box-line">
            <div class="dash-title">每日告警数</div>
            <div id="alarmLine" :style="{width: '100%', height: '312px'}" class="lineEcharts"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <AlarmPanel type="all" />
        </el-col>
      </el-col>
      <el-col :span="12" style="{width: '50%'; height: '532px'; margin-top: 20px;}">
        <div class="box-dashboard home">
          <div class="dash-title">
            车辆子系统
            <!-- <svg-icon icon-class="close" class="close"/> -->
          </div>
          <monitor size="small" alarm-size="mini" type="vehicle" video-ref="vehicle" />
        </div>
      </el-col>
      <el-col :span="12" style="margin-top: 20px;">
        <div class="box-dashboard home">
          <div class="dash-title">学校子系统</div>
          <monitor size="small" alarm-size="mini" type="school" video-ref="school"/>
        </div>
      </el-col>
      <el-col :span="12" style="margin-top: 20px;">
        <div class="box-dashboard home">
          <div class="dash-title">社区子系统</div>
          <monitor size="small" alarm-size="mini" type="community" video-ref="community"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { getUserDomain } from '@/api/login'
// import { getToken } from '@/utils/auth'
// import PreCheck from '../layout/mixin/PreCheck'
import echarts from 'echarts'
// 引入基本模板
// const echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

import monitor from '@/views/monitor'
import AlarmPanel from '@/components/AlarmPanel'
import {
  fetchUser, fetchCommunity, alarmStatus
} from '@/api/user'

export default {
  name: 'Dashboard',
  // mixins: [PreCheck],
  components: {
    monitor,
    AlarmPanel
  },
  data() {
    return {
      domainlist: [],
      centerDialogVisible: false,
      charts: '',
      xData: [],
      yData: [],
      online: '',
      offline: ''
    }
  },
  computed: {},
  created() {
  },
  async mounted() {
    await this.getAlarm()
    this.$nextTick(function() {
      this.drawZhu('alarmLine')
    })
    this.getStatus()
  },
  methods: {
    async getAlarm() {
      const res = await fetchCommunity()
      this.xData = []
      this.yData = [] // 清空数据
      if (res.code === 0) {
        res.data.map((item, index) => {
          this.xData.push(item.day.substring(item.day.length - 5, item.day.length))
          this.yData.push(item.count)
        })
      }
    },
    drawZhu(id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.xData,
          axisTick: { show: false },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#929292',
              fontSize: '12px'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#929292'
            }
          },
          axisTick: { show: false }
        },
        series: [{
          data: this.yData,
          type: 'line',
          color: '#5B8FF9',
          smooth: true
        }],
        grid: {
          x: 50,
          y: 50,
          x2: 20,
          y2: 50
        }
      })
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

<style lang="scss" scoped>
.dashboard-container {
  padding: 0px 20px;
  background: #F0F2F5;
  .status {
    padding-left: 0px !important;
    padding-right: 0px !important;
    margin-top: 20px;
  }
  .box-dashboard {
    background: #fff;
    border-radius: 4px;
  }
  .box-dashboard.home {
    height: 532px;
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
</style>
