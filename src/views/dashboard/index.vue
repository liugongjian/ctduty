<template>
  <div id="dashID" class="dashboard-container">
    <div class="overviews">
      <div class="cameraPanel">
        <div class="cameraPanel-content">
          <div class="cameraPanel-icon cameraPanel-icon-online"> <svg-icon icon-class="dashboardCamera"></svg-icon></div>
          <div class="cameraPanel-info">
            <div class="cameraPanel-title">在线摄像头</div>
            <div class="cameraPanel-number">1200个</div>
          </div>
        </div>
        <div class="cameraPanel-footer">占比 12%</div>
      </div>
      <div class="cameraPanel">
        <div class="cameraPanel-content">
          <div class="cameraPanel-icon"> <svg-icon icon-class="dashboardCamera"></svg-icon></div>
          <div class="cameraPanel-info">
            <div class="cameraPanel-title">离线摄像头</div>
            <div class="cameraPanel-number">1200个</div>
          </div>
        </div>
        <div class="cameraPanel-footer">占比 12%</div>
      </div>
      <div class="amount-flipper">
        <div class="overviews-itemTitle">今日告警数</div>
        <div class="flip-container">
          <Flipper ref="flipperHour1" />
          <span class="number-split" />
          <Flipper ref="flipperHour1" />
          <span class="span5px" />
          <Flipper ref="flipperHour2" />
          <span class="span5px" />
          <Flipper ref="flipperMinute1" />
          <span class="number-split" />
          <Flipper ref="flipperMinute2" />
          <span class="span5px" />
          <Flipper ref="flipperSecond1" />
          <span class="span5px" />
          <Flipper ref="flipperSecond2" />
        </div>
      </div>
      <div class="summaryBar">
        <div class="overviews-itemTitle">智能算法应用概览</div>
        <div>
          <div><StackedBar id="summary-bar-chart" :chart-data="testData" width="600px" height="100px"/></div>
        </div>
      </div>
    </div>
    <div class="charts">
      <div class="chart1">
        <div class="chart-title">告警排行</div>
        <SimpleBar id="times-bar" key="times-bar"/>
      </div>
      <div class="chart2">
        <div class="chart-title">告警趋势</div>
        <SimpleBar id="trend-bar" key="trend-bar"/>
      </div>
    </div>
    <div class="alarm-detail">
      <div class="chart-title">告警详情</div>
      <div class="alarm-detail-table"><el-table
        :data="userList"
        :header-cell-style="{ background: '#ecedee', color: '#717171' }"
      >
        <el-table-column label="摄像头名称" prop="username"></el-table-column>
        <el-table-column label="A算法" prop="name"></el-table-column>
        <el-table-column label="B算法" prop="phone"></el-table-column>
        <el-table-column label="C算法" prop="post.name"></el-table-column>
      </el-table></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import Flipper from '@/components/Charts/Flipper'
import StackedBar from '@/components/Charts/stackedBar'
import SimpleBar from '@/components/Charts/simpleBar'
// 引入水波球
import 'echarts-liquidfill'
import huayin from '@/json/huayin.json'
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
    Flipper,
    StackedBar,
    SimpleBar
  },
  directives: { // 使用局部注册指令的方式
    resize: { // 指令的名称
      bind(el, binding) { // el为绑定的元素，binding为绑定给指令的对象
        let width = ''
        let height = ''
        function isReize() {
          const style = document.defaultView.getComputedStyle(el)
          if (width !== style.width || height !== style.height) {
            binding.value() // 关键
          }
          width = style.width
          height = style.height
        }
        el.__vueSetInterval__ = setInterval(isReize, 500)
      },
      unbind(el) {
        clearInterval(el.__vueSetInterval__)
      }
    }
  },
  data() {
    return {
      timer: null,
      flipObjs: [],
      cardStyle: {
        height: '67px',
        lineHeight: '67px'
      },
      testData: [
        {
          'id': 1,
          'name': '智能侦测 ',
          'data': 320,
          'percent': 10
        },
        {
          'id': 2,
          'name': '算法A',
          'data': 310,
          'percent': 20
        },
        {
          'id': 3,
          'name': '算法B',
          'data': 100,
          'percent': 15
        },
        {
          'id': 4,
          'name': '算法C',
          'data': 130,
          'percent': 15
        },
        {
          'id': 5,
          'name': '其它',
          'data': 333,
          'percent': 40
        }
      ]
    }
  },
  watch: {
    screenWidth(v) {
      const canvas = document.getElementsByTagName('canvas');
      [].forEach.call(canvas, function(item) {
        item.style.width = '100%'
        item.parentNode.style = `display:inline-block;text-align:center;`
      })
    }
  },
  mounted() {
    this.flipObjs = [
      this.$refs.flipperHour1,
      this.$refs.flipperHour2,
      this.$refs.flipperMinute1,
      this.$refs.flipperMinute2,
      this.$refs.flipperSecond1,
      this.$refs.flipperSecond2
    ]
    this.init()
    this.run()
  },
  methods: {
  // 初始化数字
    init() {
      const now = new Date()
      const nowTimeStr = this.formatDate(new Date(now.getTime()), 'hhiiss')
      for (let i = 0; i < this.flipObjs.length; i++) {
        this.flipObjs[i].setFront(nowTimeStr[i])
      }
    },
    // 开始计时
    run() {
      this.timer = setInterval(() => {
      // 获取当前时间
        const now = new Date()
        const nowTimeStr = this.formatDate(new Date(now.getTime() - 1000), 'hhiiss')
        const nextTimeStr = this.formatDate(now, 'hhiiss')
        for (let i = 0; i < this.flipObjs.length; i++) {
          if (nowTimeStr[i] === nextTimeStr[i]) {
            continue
          }
          this.flipObjs[i].flipDown(
            nowTimeStr[i],
            nextTimeStr[i]
          )
        }
      }, 1000)
    },
    // 正则格式化日期
    formatDate(date, dateFormat) {
    /* 单独格式化年份，根据y的字符数量输出年份
     * 例如：yyyy => 2019
            yy => 19
            y => 9
     */
      if (/(y+)/.test(dateFormat)) {
        dateFormat = dateFormat.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      }
      // 格式化月、日、时、分、秒
      const o = {
        'm+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'i+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (const k in o) {
        if (new RegExp(`(${k})`).test(dateFormat)) {
        // 取出对应的值
          const str = o[k] + ''
          /* 根据设置的格式，输出对应的字符
           * 例如: 早上8时，hh => 08，h => 8
           * 但是，当数字>=10时，无论格式为一位还是多位，不做截取，这是与年份格式化不一致的地方
           * 例如: 下午15时，hh => 15, h => 15
           */
          dateFormat = dateFormat.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : this.padLeftZero(str)
          )
        }
      }
      return dateFormat
    },
    // 日期时间补零
    padLeftZero(str) {
      return ('00' + str).substr(str.length)
    },
    drawZhu(data, xData, yData) {
      var charts = echarts.init(document.getElementById('alarmLine'))
      const pointStyle = {
        borderColor: '#1890FF',
        color: '#fff',
        borderWidth: 1
      }
      const labelStyle = {
        show: true,
        position: 'top',
        lineHeight: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,.9)',
        borderColor: '#ccc',
        borderWidth: '1',
        padding: [5, 10, 4],
        color: '#000000',
        fontSize: 12,
        fontWeight: 'normal'
      }
      let total = yData
      const seriesData = []
      total = total.sort(function(a, b) {
        return a - b
      })
      total.forEach((item, index) => {
        const ob = {
          value: item,
          itemStyle: pointStyle,
          label: labelStyle
        }
        if (index === total.length - 1) {
          ob.itemStyle = {
            borderColor: '#1890FF',
            color: '#1890FF',
            borderWidth: 1
          }
          ob.label = {
            show: true,
            position: 'top',
            lineHeight: 10,
            backgroundColor: '#1890FF',
            borderRadius: 5,
            borderColor: '#1890FF',
            borderWidth: '1',
            padding: [5, 10, 4],
            color: '#fff',
            fontSize: 12,
            fontWeight: 'normal'
          }
        }
        seriesData.push(ob)
      })
      var option = {
        title: {
          left: 'left'
        },
        grid: {
          top: '15%',
          left: '16%',
          right: '10%',
          bottom: '18%'
        },
        xAxis: [{
          type: 'category',
          axisTick: {
            show: false
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed'
            }
          },
          data: xData
        }],
        yAxis: [{
          type: 'value',
          min: 0,
          max: 20000,
          splitNumber: 3,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          }
        }],
        series: [{
          type: 'line',
          showAllSymbol: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            normal: {
              color: '#1890FF',
              width: 3
            }
          },
          tooltip: {
            show: false
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [{
                  offset: 0,
                  color: '#1890FF'
                },
                {
                  offset: 1,
                  color: '#1890FF'
                }
                ],
                false
              )
            }
          },
          data: seriesData,
          markLine: {
            symbol: ['none', 'none'], // 去掉箭头
            itemStyle: {
              normal: {
                lineStyle: {
                  type: 'dashed',
                  color: '#ccc',
                  width: 2
                }
              }
            }
          // data: [{
          //   name: 'Y 轴值为 0 的水平线',
          //   yAxis: 0,
          //   label: {
          //     normal: {
          //       formatter: '0'
          //     }
          //   }
          // }]
          }
        }]
      }
      charts.setOption(option)
    }
  }
}

</script>

<style lang="scss" scoped>
$iconHeight: 65px;
$cameraWidth: 220px;
$flipperWidth: 350px;
$summaryBarWidth: 600px;
.dashboard-container{
  padding:20px;
  background-color:#F0F2F5;
  min-height: 100%;
  min-width: 2 * $cameraWidth + $flipperWidth + $summaryBarWidth + 20px * 5;
  .span5px{
    display:inline-block;
    width: 3px;
  }
  .number-split{
    display:inline-block;
    width: 7px;
  }
  .number-split::before{
    content: ",";
    color:#3AA0FF;
    font-size: 36px;
  }
  .chart-title{
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #333333;
    padding-bottom: 10px;
    border-bottom: 1px solid #E8E8E8;
  }
  .overviews{
    display:flex;
    height: 147px;
    justify-content: space-between;
    &-itemTitle{
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      margin-bottom: 20px;
    }
    .cameraPanel{
      flex-grow:1;
      margin-right: 20px;
      border-radius: 2px;
      width: $cameraWidth;
      background-color: white;
      padding:20px;
      &-content{
        height: $iconHeight+20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #E8E8E8;
      }
      &-icon{
        width: $iconHeight;
        height: $iconHeight;
        line-height: $iconHeight;
        font-size: 50px;
        display: inline-block;
        color: #999;
        vertical-align: top;
        &-online{
          color:#1890FF;
        }
      }
      &-info{
        height: $iconHeight;
        display: inline-block;
      }
      &-title{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        line-height: 22px;
        padding-top: 5px;
      }
      &-number{
        font-family: HelveticaNeue;
        font-size: 30px;
        color: rgba(0,0,0,0.85);
        line-height: 38px;
        height:38px;
      }
      &-footer{
        margin-top:10px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0,0,0,0.65);
        line-height: 22px;
      }
    }
    .amount-flipper{
      flex-grow:1;
      border-radius: 2px;
      width:$flipperWidth;
      background-color:white;
      padding:20px;
      margin-right: 20px;
      .flip-container{
        margin: 10px auto;
        width:$flipperWidth;
      }
    }
    .summaryBar{
      flex-grow:1;
      border-radius: 2px;
      width:$summaryBarWidth;
      background-color:white;
      padding:20px;
    }
  }
  .charts{
    height: 420px;
    margin: 20px 0;
    display: flex;
    .chart1, .chart2{
      width:50%;
      padding:20px;
      background-color: white;
      border-radius: 2px;
    }
    .chart1{
      margin-right: 10px;
    }
     .chart2{
      margin-left: 10px;
    }
  }
  .alarm-detail{
    padding:20px;
    background-color: white;
    border-radius: 2px;
    &-table{
      margin-top: 20px;
    }
  }
}
</style>
