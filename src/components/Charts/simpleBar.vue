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
      let { xAxis, yAxis } = this.chartData
      const { unit, series, tooltip } = this.chartData
      const data = xAxis.type === 'value' ? xAxis.data : yAxis.data
      let color = ['#36CBCB']
      if (this.id === 'times-bar') {
        color = ['#3AA0FF']
      }
      const categoryProps = {
        boundaryGap: true,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          formatter: function(value, index) {
            if (value.length && value.length > 6) {
              return value.substring(0, 4) + '...'
            } else return value
          },
          color: '#4a4a4a'
        }
      }
      if (xAxis.type === 'category') {
        xAxis = {
          ...categoryProps,
          ...xAxis
        }
      } else if (yAxis.type === 'category') {
        yAxis = {
          ...categoryProps,
          ...yAxis
        }
      }
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b0}: {c0}' + unit,
          ...tooltip
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
            color: '#4a4a4a'
          },
          splitLine: {
            lineStyle: {
              color: '#E8E8E8',
              type: 'dotted'
            }
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
            color: '#4a4a4a'
          },
          splitLine: {
            lineStyle: {
              color: '#E8E8E8',
              type: 'dotted'
            }
          },
          // axisPointer: {
          //   show: true
          // },
          name: `单位/${unit}`,
          nameTextStyle: {
            color: '#BFBFBF'
          },
          ...yAxis
        },
        series: [{
          data,
          type: 'bar',
          barMaxWidth: '22px',
          ...series
        }]
      })
    }
  }
}
</script>
