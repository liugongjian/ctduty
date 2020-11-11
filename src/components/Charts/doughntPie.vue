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
  watch: {
    chartData: function(newValue) {
      this.chartData = newValue
      console.log('newValue', newValue)
      this.initChart()
    }
  },
  mounted() {
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
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}个 ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          // right: 0,
          // x: 0, // '80%',
          // y: 0, // '50%',
          bottom: 20,
          icon: 'circle',
          iconSize: 10,
          data: this.chartData.map(({ name }) => name),
          textStyle: {
            fontSize: 10,
            color: '#9b9b9b'
          }
        },
        color: ['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#36CBCB'],
        series: [
          {
            name: '智能算法应用概览n',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
              formatter: '{b}\n已配置摄像头{c}个\n({d}%)',
              fontSize: 12,
              color: '#333'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '16',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            },
            data: this.chartData.map(({ data, name }) => ({
              value: data,
              name
            }))
          }
        ]
      }
      this.chart.setOption(option)
    }
  }
}
</script>

