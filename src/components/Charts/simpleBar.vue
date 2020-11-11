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
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value',
          data: []
        }
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: function(newValue) {
      this.chartData = newValue
      this.initChart()
    }
  },
  mounted() {
    // this.initChart()
    this.chart = echarts.init(document.getElementById(this.id))
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
      const { xAxis, yAxis, unit } = this.chartData
      const data = yAxis.data
      let color = ['#36CBCB']
      if (this.id === 'times-bar') {
        color = ['#3AA0FF']
        xAxis.axisLabel = {
          formatter: function(value, index) {
            // 格式化成月/日，只在第一个刻度显示年份
            if (value.length && value.length > 5) {
              return value.substring(0, 5) + '...'
            } else return value
          },
          color: '#333'
        }
      }
      this.chart.setOption({
        tooltip: {
          trigger: 'item'
        },
        grid: {
          left: 20,
          top: 50,
          bottom: 30,
          containLabel: true
        },
        color, // ['#1890FF', '#69C0FF', '#BAE7FF', '#DEF3FF'], // '#0050B3'
        xAxis: {
          axisLine: {
            lineStyle: {
              color: '#BFBFBF'
            }
          },
          axisLabel: {
            color: '#333'
          },
          ...xAxis
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: '#BFBFBF'
            }
          },
          axisLabel: {
            color: '#333'
          },
          splitLine: {
            lineStyle: {
              color: '#E8E8E8',
              type: 'dotted'
            }
          },
          name: `单位/${unit}`,
          nameTextStyle: {
            color: '#9B9B9B'
          },

          ...yAxis
        },
        series: [{
          data,
          type: 'bar',
          barMaxWidth: '30px'
        }]
      })
    }
  }
}
</script>
