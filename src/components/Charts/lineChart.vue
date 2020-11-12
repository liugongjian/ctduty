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
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b0}: {c0}' + unit
        },
        grid: {
          left: 0,
          top: 50,
          bottom: 30,
          containLabel: true
        },
        color: ['#36CBCB'],
        xAxis: {
          axisLine: {
            lineStyle: {
              color: '#BFBFBF'
            }
          },
          axisLabel: {
            color: '#4a4a4a'
            // rotate: 30
          },
          axisPointer: {
            show: true,
            type: 'line'
          },
          boundaryGap: false,
          axisTick: {
            alignWithLabel: true
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
          name: `单位/${unit}`,
          nameTextStyle: {
            color: '#BFBFBF'
          },
          ...yAxis
        },
        series: [{
          data,
          type: 'line',
          smooth: true,
          areaStyle: {
            color: '#36CBCB',
            opacity: 0.5
          }
        }]
      })
    }
  }
}
</script>
