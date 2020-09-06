<template>
  <div id="alarmInfo" class="alarmInfo">
    <div class="map">
      <el-amap
        :amap-manager="amapManager"
        :center="center"
        :events="events"
        :zoom="zoom"
        class="amap-demo"
        vid="amapDemo"
      ></el-amap>
      <el-amap-marker
        v-for="(marker, index) in markers"
        :events="events"
        :id="'point'+index"
        :key="index"
        :position="marker.position"
        :vid="index"
        :content="marker.content"
        @click="markerClick"
      ></el-amap-marker>
      <div class="warn">
        <div class="dispose">
          <div class="dash-title">告警处理率</div>
          <div class="disbox">
            <div id="panel"></div>
          </div>
        </div>
        <div class="bottom">
          <div class="todyW">今日告警</div>
          <div class="bottom-left">
            <el-tabs v-model="activeName" type="border-card" @click="handleClick">
              <el-tab-pane label="全部" name="first">
                <div style="height: 100%;">
                  <!-- <el-steps :active="active" finish-status="success" direction="vertical">
                      <el-step
                        v-for="item in approvalProcessProject"
                        :title="item.label"
                        :key="item.id"
                      >
                        <template slot="icon">
                          <img src="../../../src/assets/icon/已处理@1x.png" style="height:25x;width:25px;"/>
                        </template>
                        <template slot="description"></template>
                      </el-step>
                  </el-steps>-->
                  <template>
                    <div @click="showDialog">
                      <el-steps :active="values" space="50px" align-center direction="vertical">
                        <el-step
                          v-for="(item,index) in stepsData"
                          :title="item.title"
                          :description="item.date"
                          :key="index"
                        ></el-step>
                      </el-steps>
                    </div>
                  </template>
                </div>
              </el-tab-pane>
              <el-tab-pane label="未处理" name="second">
                <div style="height: 100%;">
                  <template>
                    <div @click="showDialog">
                      <el-steps :active="values" space="50px" align-center direction="vertical">
                        <el-step
                          v-for="(item,index) in stepsData"
                          :title="item.title"
                          :description="item.date"
                          :key="index"
                        ></el-step>
                      </el-steps>
                    </div>
                  </template>
                </div>
              </el-tab-pane>
              <el-tab-pane label="已处理" name="third">
                <div style="height: 100%;">
                  <template>
                    <div @click="showDialog">
                      <el-steps :active="values" space="50px" align-center direction="vertical">
                        <el-step
                          v-for="(item,index) in stepsData"
                          :title="item.title"
                          :description="item.date"
                          :key="index"
                        ></el-step>
                      </el-steps>
                    </div>
                  </template>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="bottom-right">
            <ul>
              <li>
                <a href="#">历史告警</a>
              </li>
            </ul>
          </div>
          <el-dialog :visible="dialogVisable" title="报警显示" width="520px" @close="closeDialog">
            <el-form :model="alarmForm" label-position="right" label-width="100px">
              <el-form-item v-model="alarmForm.address" label="流量状态:">
                <span style="width: 300px;">{{ "陕西省渭南市威清路双王路路口" }}</span>
              </el-form-item>
              <el-form-item v-model="alarmForm.time" label="监控时间:">
                <span style="width: 300px;">{{ "陕西省渭南市威清路双王路路口" }}</span>
              </el-form-item>
              <el-form-item label="原始照片:">
                <img src alt >
              </el-form-item>
              <el-form-item label="结构化照片:">
                <img src alt style="width: 300px; height: 300px" >
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button round @click="normal">正 常</el-button>
              <el-button type="warning" round @click="unnormal">异 常</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
// 引入水波球
import 'echarts-liquidfill'
// 引入基本模板
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import { fetchUser, fetchCommunity, alarmStatus } from '@/api/user'
import { fetchalarmList } from '@/api/alarm'
import VueAMap from 'vue-amap'
const amapManager = new VueAMap.AMapManager()
export default {
  name: 'ECloudWatch',
  components: {},
  props: ['data', 'defaultActive'],
  data() {
    return {
      alarmForm: {
        address: '',
        time: ''
      },
      dialogVisable: false,
      activeName: 'first',
      active: 0,
      stepsData: [
        {
          title: '陕西省渭南市威清路',
          date: '2020-08-31  23: 00 : 00'
        },
        {
          title: '陕西省渭南市威清路',
          date: '2020-08-31  23: 00 : 00'
        },
        {
          title: '陕西省渭南市威清路',
          date: '2020-08-31  23: 00 : 00'
        }
      ],
      values: 3,
      zoom: 12,
      center: [110.09, 34.58],
      markersDom: null,
      markers: [],
      amapManager,
      events: {
        init(o) {
          const marker = new AMap.Marker({
            position: new AMap.LngLat(110.09, 34.58), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            offset: new AMap.Pixel(-10, -10),
            title: '上海摩环文化有限公司',
            zoom: 13,
            color: 'red'
          })
          marker.setMap(o)
        }
      }
    }
  },
  created() {
    this.getalarmList()
  },
  mounted() {
    const that = this
    that.getPanel()
    document.getElementById('alarmInfo').onclick = function() {
      this.watchClick()
    }
    setTimeout(() => {
      this.formInfo = [
        {
          id: '567',
          inCharge: 'safsafjk',
          longitude: 110.034,
          latitude: 34.56,
          address: '嘻嘻',
          name: '李四',
          createTime: '2020-09-10',
          url: '哈哈',
          cl: 0
        }
      ]
      this.formInfo.forEach(item => {
        this.markers.push({
          position: [item.longitude, item.latitude],
          content: `<img class='markerImg' data=${JSON.stringify(item)}
          src="https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png" style="width: 19px; height: 33px; top: 0px; left: 0px;">`
        })
      })
    }, 2000)
  },
  methods: {
    getalarmList() {
      const params = {
        cascade: true,
        page: {
          index: 1,
          size: 10,
          total: 0
        },
        params: [
          {
            field: 'createTime',
            operator: 'BETWEEN',
            value: { start: '2020-09-05 00:00:00', end: '2020-09-05 23:59:59' }
          },
          {
            field: 'handlerId',
            operator: 'NULL',
            value: 'null'
          }
        ]
      }
      fetchalarmList(params).then(response => {
        console.log(response.body.data)
        const { data } = response.body
        this.alarmForm.address = data.camera.address
      })
    },
    watchClick(e) {
      e.path.forEach(item => {
        if (item.className === 'markerImg') {
          this.form = JSON.parse(item.attributes[1].nodeValue)
          // this.showZwMes = false;
        }
      })
    },
    markerClick() {
      console.log('11111')
    },
    closeDialog() {
      this.dialogForm = {
        id: '',
        inCharge: '',
        longitude: '',
        latitude: ''
        // address: ""
      }
      this.dialogVisable = false
    },
    showDialog() {
      this.dialogVisable = true
    },
    getPanel() {
      this.charts = echarts.init(document.getElementById('panel'))
      this.charts.setOption({
        backgroundColor: '#fff',
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'
        },
        toolbox: {
          // 工具栏小图标
          show: false,
          feature: {
            restore: {},
            saveAsImage: {}
          }
        },
        series: [
          {
            name: '业务指标',
            type: 'gauge',
            splitNumber: 3,
            detail: {
              // 仪表盘详情，用于显示数据
              formatter: '{value}%',
              color: '#333333',
              fontSize: 16,
              fontWeight: 'bolder'
            },
            data: [
              {
                value: 60,
                name: ''
              }
            ],
            axisLine: {
              // 表盘样式
              show: true,
              lineStyle: {
                width: 6, // 表盘粗细
                color: [[1, '#2d82ff']],
                shadowBlur: 10,
                shadowColor: 'rgba(0, 103, 255, 0.2)',
                shadowOffsetX: 0,
                shadowOffsetY: 8
              }
            },

            axisTick: {
              show: false, // 是否显示坐标轴小标记，这里不显示
              length: 8, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: '#fff'
              }
            },
            splitLine: {
              // 分隔线
              length: 8, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'rgba(255, 255, 255, 0.2)'
              }
            },
            pointer: {
              // 指针样式
              width: 3
            },
            itemStyle: {
              // 指针阴影
              shadowBlur: 10,
              shadowColor: 'rgba(0, 103, 255, 0.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 8
            },
            axisLabel: {
              // 刻度标签。
              show: true, // 是否显示标签,默认 true。
              distance: 5, // 标签与刻度线的距离,默认 5。
              color: '#000', // 文字的颜色,默认 #fff。
              fontSize: 12, // 文字的字体大小,默认 5。
              formatter: function(value) {
                if (parseInt(value) === 0) {
                  return '差'
                } else if (parseInt(value) === 33) {
                  return '中'
                } else if (parseInt(value) === 66) {
                  return '良'
                } else if (parseInt(value) === 100) {
                  return '优'
                }
              } // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。 示例:// 使用字符串模板，模板变量为刻度默认标签 {value},如:formatter: '{value} kg'; // 使用函数模板，函数参数分别为刻度数值,如formatter: function (value) {return value + 'km/h';}
            },
            markPoint: {
              // 指针中心加一个小白点
              symbol: 'circle',
              symbolSize: 5,
              data: [
                // 跟你的仪表盘的中心位置对应上，颜色可以和画板底色一样
                {
                  x: 'center',
                  y: 'center',
                  itemStyle: {
                    color: '#FFF'
                  }
                }
              ]
            }
          }
        ]
      })
    },
    handleClick(tab, event) {},
    next() {
      if (this.active++ > 2) this.active = 0
    },
    normal() {
      this.dialogVisable = false
    },
    unnormal() {
      this.dialogVisable = false
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
  list-style: none;
}
.alarmInfo {
  padding: 0px 20px;
  background: #f0f2f5;
  height: 1000px;
  width: 100%;
  .map {
    height: 100%;
    width: 100%;
    // background-color: #000;
    position: relative;
    overflow: hidden;
    .warn {
      margin-top: 10px;
      position: absolute;
      top: 0;
      right: 10px;
      background-color: #ffffff;
      width: 25%;
      height: 100%;

      .top {
        width: 100%;
        height: 270px;
        background-color: #fff;
        border-bottom: 1px solid #f0f2f5;

        p {
          font-weight: 200;
          font-size: 14px;
          color: #5e5e5e;
          text-align: left;
        }
      }

      .bottom {
        width: 100%;
        height: 100%;
        background-color: #ffffff;

        .todyW {
          color: #000000;
          font-size: 13px;
          font-weight: 700;
        }

        .bottom-left {
          width: 75%;
          height: 100%;
          float: left;
          padding-top: 8px;
        }
        .bottom-right {
          width: 25%;
          height: 100%;
          float: right;
          // background-color: green;
          padding-top: 10px;
          a {
            color: #1890ff;
            font-size: 12px;
            text-align: center;
          }
        }
      }
    }
  }

  .dispose {
    height: 210px;
    width: 100%;
    background-color: #fff;
    margin-top: 10px;
  }
  .dash-title {
    position: relative;
    margin: 0;
    padding: 0;
    padding-left: 20px;
    font-size: 14px;

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
  .status {
    margin-top: 20px;
  }
}

// #app .el-tabs__item {
//   box-shadow: none;
//   width: 64px;
//   height: 30px;
//   line-height: 30px;
//   background-color: #fff;
// }
</style>

