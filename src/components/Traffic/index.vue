<template>
  <div>
    <el-carousel v-if="carousel.length > 1" :interval="4000" type="card" indicator-position="none">
      <el-carousel-item v-for="item in carousel" :key="item.id">
        <div v-if="item.capture" class="video-board">
          <div class="item-stats">
            <div class="stats-label">{{ item.label }}</div>
            <div class="stats-value"><span :class="level">{{ item.content || '' }}</span></div>
          </div>
        </div>
        <div v-if="!item.capture" class="video-board">
          <div class="item-stats">
            <div class="stats-label">流量状态</div>
            <div class="stats-value"><span :class="level">{{ traffic.message || '' }}</span></div>
          </div>
          <div class="item-stats">
            <div class="stats-label">实时{{ type == 'vehicle' ? '车流' : '人流' }}</div>
            <div class="stats-value">{{ traffic.traffic != undefined ? traffic.traffic : '' }}<span class="unit">{{ traffic.unit || '' }}</span></div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div v-if="carousel.length <= 1 && traffic.message && traffic.unit" class="video-board">
      <div class="item-stats">
        <div class="stats-label">流量状态</div>
        <div class="stats-value"><span :class="level">{{ traffic.message || '' }}</span></div>
      </div>
      <div class="item-stats">
        <div class="stats-label">实时{{ type == 'vehicle' ? '车流' : '人流' }}</div>
        <div class="stats-value">{{ traffic.traffic != undefined ? traffic.traffic : '' }}<span class="unit">{{ traffic.unit || '' }}</span></div>
      </div>
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
      // 跑马灯, 把抓拍和流量统一放在跑马灯里
      carousel: [],
      // 流量
      traffic: {},
      level: 'normal',
      timer: null
    }
  },
  mounted() {
    // this.getTraffic()
    // this.getSnap()
    this.getBoard()
    this.timer = setInterval(() => {
      this.getBoard()
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
    // getSnap() {
    //   let api
    //   let level
    //   if (this.type == 'vehicle') {
    //     api = fetchVehicleSnap
    //     level = 'normal'
    //   } else if (this.type == 'school') {
    //     api = fetchSchoolSnap
    //     level = 'warning'
    //   } else if (this.type == 'community') {
    //     api = fetchCommunitySnap
    //     level = 'danger'
    //   } else if (this.type == 'factory') {
    //     api = fetchFactorySnap
    //   } else if (this.type == 'face') {
    //     api = fetchFaceSnap
    //   }
    //   if (api && this.deviceNum) {
    //     api(this.deviceNum, {limit:3}).then(res => {
    //       this.capture = res.data || [];
    //     })
    //   }
    // },
    getBoard() {
      const promiseArr = []
      if (this.type == 'vehicle') {
        promiseArr.push(fetchVehicleSnap(this.deviceNum, { limit: 3 }))
        promiseArr.push(getVehicleTraffic(this.deviceNum))
      } else if (this.type == 'school') {
        promiseArr.push(fetchSchoolSnap(this.deviceNum, { limit: 3 }))
        promiseArr.push(getHumanTraffic(this.deviceNum))
      } else if (this.type == 'community') {
        promiseArr.push(fetchCommunitySnap(this.deviceNum, { limit: 3 }))
        promiseArr.push(getHumanTraffic(this.deviceNum))
      } else if (this.type == 'factory') {
        promiseArr.push(fetchFactorySnap(this.deviceNum, { limit: 3 }))
        promiseArr.push(getHumanTraffic(this.deviceNum))
      } else if (this.type == 'face') {
        promiseArr.push(fetchFaceSnap(this.deviceNum, { limit: 3 }))
        promiseArr.push(getHumanTraffic(this.deviceNum))
      }
      Promise.all(promiseArr).then(res => {
        this.carousel = []
        this.traffic = {}
        res.map(r => {
          if (Array.isArray(r.data)) {
            r.data.map(c => {
              this.carousel.push({
                capture: true,
                id: c.id + Date.now(),
                label: c.message,
                content: c.content
              })
            })
          } else if (r.data) {
            this.carousel.push({
              ...r.data,
              id: this.type + Date.now()
            })
            this.traffic = r.data
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
  background: #F7F8F8;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  .item-stats {
    flex: 1;
    text-align: center;
    .stats-label {
      font-size: 14px;
      line-height: 20px;
    }
    .stats-value {
      font-size: 28px;
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
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
    .item-stats {
      flex: 1;
      text-align: center;
      .stats-label {
        font-size: 12px;
        line-height: 16px;
      }
      .stats-value {
        font-size: 18px;
        line-height: 24px;
        .unit {
          font-size: 12px;
          margin-left: 2px;
        }
      }
    }
  }
}
.el-carousel__item.is-active {
  .video-board {
    background-color: #e5e8ea;
  }
}
</style>
