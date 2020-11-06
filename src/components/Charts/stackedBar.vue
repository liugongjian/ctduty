<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    chartData: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: { // 坐标轴指示器，坐标轴触发有效
        //     type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        //   }
        // },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          data: this.chartData.map((item, idx) => `${idx}`),
          formatter: idx => {
            const item = this.chartData[idx]
            return `${item.name} ${item.data}个 ${item.percent}%`
          },
          bottom: 20,
          left: 62

        },
        grid: {
          left: 0,
          top: 0,
          bottom: 60,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          max: 'dataMax',
          show: false
        },
        yAxis: {
          type: 'category',
          data: ['摄像头配置'],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        color: ['#0050B3', '#1890FF', '#69C0FF', '#BAE7FF', '#DEF3FF'],
        series: this.chartData.map((item, idx) => {
          return ({
            ...item,
            name: idx,
            type: 'bar',
            stack: '总量',
            // label: {
            //   show: true,
            //   position: 'insideRight'
            // },
            tooltip: {
              formatter: () => {
                return `${item.name} ${item.data}个 ${item.percent}%`
              }
            },
            data: [item.data]
          })
        })
      })
    }
  }
}
</script>
