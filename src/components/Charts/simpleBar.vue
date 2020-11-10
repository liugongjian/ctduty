<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
/**
 * option = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
    }]
};

 */
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
      console.log('????', newValue)
      this.initChart()
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
      const { xAxis, yAxis } = this.chartData
      console.log(this.chartData)
      if (yAxis.type === 'category') {
        yAxis.axisLabel = {
          formatter: function(value, index) {
            // 格式化成月/日，只在第一个刻度显示年份
            if (value.length && value.length > 6) {
              return value.substring(0, 6) + '...'
            } else return value
          }
        }
      }
      this.chart.setOption({
        tooltip: {
          trigger: 'item'
        },
        // legend: {
        //   data: this.chartData.map((item, idx) => `${idx}`),
        //   formatter: idx => {
        //     const item = this.chartData[idx]
        //     return `${item.name} ${item.data}个 ${item.percent}%`
        //   },
        //   bottom: 20,
        //   left: 62
        // },
        grid: {
          left: 20,
          top: 50,
          bottom: 30,
          containLabel: true
        },
        color: ['#1890FF', '#69C0FF', '#BAE7FF', '#DEF3FF'], // '#0050B3'
        xAxis: xAxis,
        yAxis: yAxis,
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          barMaxWidth: '30px'
        }]
      })
    }
  }
}
</script>
