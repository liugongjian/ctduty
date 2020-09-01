<template>
  <div>
    <div class="title">
      <p>{{ title }}</p>
    </div>
    <div class="chart">
      <div class="chartbox">
        <p>{{ '每日告警数' }}</p>
        <div :id="ids[0]" class="canFu" style="height: 300px"></div>
      </div>
      <div class="chartbox">
        <p>{{ '告警比例' }}</p>
        <div :id="ids[1]" class="canFu" style="height: 300px"></div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: '',
  props: {
    title: {
      type: String,
      required: true
    },
    datax: {
      type: Array,
      required: true
    },
    datay: {
      type: Array,
      required: true
    },
    // 数组折线图在前, 饼图在后
    ids: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      charts: '',
      pieData: []
    }
  },
  // 调 用
  async mounted() {
    await this.getPieData()
    this.$nextTick(function() {
      this.drawZhu(this.ids[0])
    })
    this.$nextTick(function() {
      this.drawPie(this.ids[1])
    })
  },
  methods: {
    getPieData() {
      this.datay.forEach(item => {
        this.pieData.push({ value: item, name: '' })
      })
      this.datax.forEach((item, index) => {
        this.pieData[index].name = item
      })
    },
    drawPie(id) {
      var sum = 0
      this.datay.forEach(item => {
        sum += item
      })
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        title: {
          text: '告警数',
          subtext: sum + '条',
          x: 'center',
          top: '43%',
          textStyle: {
            fontWeight: 'normal',
            color: '#ccc',
            fontSize: '14'
          },
          subtextStyle: {
            fontWeight: 'normal',
            color: '#000',
            fontSize: '16'
          }
        },
        color: ['#5B8FF9', '#63DAAB', '#657798', '#EFBA1C', '#34A853', '#8e44ad', '#e67e22'],
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{a} <br/>{b}:({d}%)'
        },
        legend: {
          orient: 'horizontal',
          left: '0%', // 图例距离左的距离
          y: '0%', // 图例上下居中
          icon: 'circle',
          data: this.datax,
          width: '100%',
          textStyle: {
            fontSize: 8
          }
        },
        series: [
          {
            name: '告警数',
            type: 'pie',
            radius: ['35%', '65%'],
            // center: ['50%', '50%'],
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: false
                // position: 'inside'
              },
              show: true,
              position: 'inner',
              formatter: '{d}' + '%',
              fontSize: 12,
              align: 'center'
            },
            labelLine: {
              show: true
            },
            data: this.pieData
          }
        ],
        grid: {
          x: 50,
          y: 50,
          x2: 20,
          y2: 50
        }
      })
    },
    drawZhu(id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: this.datax,
          axisTick: { show: false },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#929292'
            }
          }
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          axisLine: {
            show: false,
            lineStyle: {
              color: '#929292'
            }
          },
          axisTick: { show: false }
        },
        series: [{
          data: this.datay,
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
    }
  }
}
</script>
<style lang='scss' scoped>
    * {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    .title {
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      font-weight: 700;
      box-sizing: content-box;
      p {
        border-bottom: 1px solid #ccc;
      }
    }
    .chart {
      display: flex;
      .chartbox:first-child {
       canvas {
          width: 100%;
        }
         p {
          padding-left: 20px;
        }
      }
      .chartbox {
        flex: 1;
        width: 50%;
        div {
          width: 80%;
          height: 80%;
        canvas {
          width: 100%;
         }
        }
        p {
          height: 50px;
          line-height: 50px;
          padding: 0;
          font-weight: 700;
        }
      }
    }
</style>
