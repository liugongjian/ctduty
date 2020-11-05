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
          left: 0,
          top: 50,
          bottom: 30,
          containLabel: true
        },
        color: ['#1890FF', '#69C0FF', '#BAE7FF', '#DEF3FF'], // '#0050B3'
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        //   axisLine: {
        //     show: false
        //   },
        //   axisTick: {
        //     show: false
        //   }
        },
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
