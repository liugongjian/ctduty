<template>
  <div class="video-board">
    <div class="item-board item-traffic">
      <el-carousel :interval="2000" :loop="false" indicator-position="none">
        <el-carousel-item v-for="traffic in trafficList" :key="traffic.id">
          <div class="video-board">
            <div class="item-stats">
              <div class="stats-label">流量状态</div>
              <div class="stats-value"><span :class="level">{{ traffic.message || '' }}</span></div>
            </div>
            <div class="item-stats">
              <div v-if="traffic.unit === '人/分钟'" class="stats-label">实时人数</div>
              <div v-else-if="traffic.unit === '辆/分钟'" class="stats-label">实时车流</div>
              <div class="stats-value">{{ traffic.traffic != undefined ? traffic.traffic : '' }}<span class="unit">{{ traffic.unit || '' }}</span></div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div v-if="carousel.length > 0" class="item-board item-carousel">
      <el-carousel :interval="2000" :loop="false" indicator-position="none">
        <el-carousel-item v-for="item in carousel" :key="item.id">
          <div class="item-stats carousel-unit">
            <div class="stats-label">{{ item.label }}</div>
            <div class="stats-value"><span :class="level">{{ item.content || '' }}</span></div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>
<script>
import {
  getVehicleTraffic, getHumanTraffic
} from '@/api/traffic'
import {
  fetchVehicleSnap, fetchFaceSnap, fetchSchoolSnap, fetchFactorySnap, fetchCommunitySnap
} from '@/api/snap'

export default {
  name: 'Traffic',
  props: {
    type: {
      type: String
    },
    deviceNum: {
      type: String
    }
  },
  data() {
    return {
      // 跑马灯, 抓拍
      carousel: [],
      // 流量
      trafficList: [],
      level: 'normal',
      timer: null
    }
  },
  mounted() {
    this.getTraffic()
    this.getSnap()
    this.timer = setInterval(() => {
      this.getTraffic()
      this.getSnap()
    }, 10 * 1000)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    // getTraffic() {
    //   let api
    //   let level
    //   if (this.type == 'vehicle') {
    //     api = getVehicleTraffic
    //     level = 'normal'
    //   } else if (this.type == 'school') {
    //     api = getHumanTraffic
    //     level = 'warning'
    //   } else if (this.type == 'community') {
    //     api = getHumanTraffic
    //     level = 'danger'
    //   } else if (this.type == 'factory') {
    //     api = getHumanTraffic
    //   } else if (this.type == 'face') {
    //     api = getHumanTraffic
    //   }
    //   if (api && this.deviceNum) {
    //     api(this.deviceNum).then(res => {
    //       this.traffic = res.data || {}
    //       this.level = level;
    //     })
    //   }
    // },
    getSnap() {
      let api
      if (this.type == 'vehicle') {
        api = fetchVehicleSnap
      } else if (this.type == 'school') {
        api = fetchSchoolSnap
      } else if (this.type == 'community') {
        api = fetchCommunitySnap
      } else if (this.type == 'factory') {
        api = fetchFactorySnap
      } else if (this.type == 'face') {
        api = fetchFaceSnap
      }
      if (api && this.deviceNum) {
        api(this.deviceNum, { limit: 3 }).then(res => {
          this.carousel = (res.data || []).map(c => {
            return {
              id: c.id + Date.now(),
              label: c.message,
              content: c.content
            }
          })
        })
      }
    },
    getTraffic() {
      // 有的子系统需要同时查看车流量和人流量
      const promiseArr = []
      if (this.type == 'vehicle') {
        promiseArr.push(getVehicleTraffic(this.deviceNum))
      } else if (this.type == 'school') {
        promiseArr.push(getVehicleTraffic(this.deviceNum))
        promiseArr.push(getHumanTraffic(this.deviceNum))
      } else if (this.type == 'community') {
        promiseArr.push(getVehicleTraffic(this.deviceNum))
        promiseArr.push(getHumanTraffic(this.deviceNum))
      } else if (this.type == 'factory') {
        promiseArr.push(getVehicleTraffic(this.deviceNum))
      } else if (this.type == 'face') {
        promiseArr.push(getHumanTraffic(this.deviceNum))
      }
      Promise.all(promiseArr).then(res => {
        this.trafficList = []
        res.map(r => {
          if (r.data) {
            this.trafficList.push({
              ...r.data,
              id: this.type + Date.now() + JSON.stringify(r.data)
            })
          }
        })
      }).catch(e => {
        console.log('catch', e)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.video-board {
  height: 100px;
  display: flex;
  // background: #F7F8F8;
  // border-radius: 8px;
  // padding: 20px;
  margin-bottom: 15px;
  .item-board {
    display: flex;
    flex: 1;
    text-align: center;
    background: #F7F8F8;
    border-radius: 8px;
    padding: 20px;
  }
  .item-traffic {
    flex: 2;
    padding: 0;
  }
  .item-carousel {
    flex: 3;
    padding: 0;
    margin-left: 20px;
    .carousel-unit {
      padding: 20px;
      border-radius: 8px;
      background: #F7F8F8;
    }
  }
  .item-stats {
    flex: 1;
    text-align: center;
    padding: 20px;
    .stats-label {
      font-size: 14px;
      line-height: 20px;
    }
    .stats-value {
      font-size: 24px;
      line-height: 40px;
      .unit {
        font-size: 14px;
        margin-left: 5px;
        color: #666;
      }
      .normal {
        color: #333;
      }
      .warning {
        color: #FF8833;
      }
      .danger {
        color: #CA2716;
      }
    }
  }
}
// 首页缩小
.home {
  .video-board {
    height: 60px;
    display: flex;
    // border-radius: 8px;
    // padding: 10px;
    margin-bottom: 10px;
    .item-board {
      border-radius: 8px;
    }
    .item-traffic {
      padding: 0;
    }
    .item-carousel {
      padding: 0;
      margin-left: 10px;
      .carousel-unit {
        padding: 10px;
        border-radius: 8px;
        background: #F7F8F8;
      }
    }
    .item-stats {
      flex: 1;
      text-align: center;
      padding: 10px;
      .stats-label {
        font-size: 12px;
        line-height: 16px;
      }
      .stats-value {
        font-size: 16px;
        line-height: 24px;
        .unit {
          font-size: 12px;
          margin-left: 2px;
        }
      }
    }
  }
}
// .el-carousel__item.is-active {
//   .carousel-unit {
//     background-color: #e5e8ea;
//   }
// }
</style>
