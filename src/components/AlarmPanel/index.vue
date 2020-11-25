<template>
  <div :class="alarmClass">
    <div class="alarm-title">预警信息
      <div class="alarm-desc">共<span>{{ alarmList.length }}</span>条</div>
    </div>
    <div class="alarm-list">
      <template v-for="alarm in alarmList">
        <div slot="reference" :key="alarm.id" class="alarmTitle" @click="()=>{showBigImg(alarm.imageId)}">
          {{ alarm.message }}
          <span>{{ alarm.createTime }}</span>
        </div>
      </template>
      <el-dialog :visible="dialogVisable" title="告警图片" width="960px" @close="editCloseDialog">
        <img
          :src="formatImg(dialogImgId)"
          style="width:100%;height:100%;object-fit:cover;"
          alt=""
        >
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  fetchAll, fetchOldVehicle, fetchOldSchool, fetchOldCommunity, fetchOldFactory, alarmImg
} from '@/api/alarm'

export default {
  name: 'AlarmPanel',
  props: {
    size: {
      type: String,
      default() {
        return 'normal'
      }
    },
    border: {
      type: Boolean,
      default() {
        return false
      }
    },
    type: {
      type: String
    },
    deviceNum: {
      type: String
    }
  },
  data() {
    const alarmClass = ['box-alarm']
    if (this.size == 'mini') {
      alarmClass.push('mini')
    }
    if (this.border) {
      alarmClass.push('border')
    }
    return {
      alarmClass: alarmClass.join(' '),
      alarmList: [],
      dialogVisable: false,
      dialogImgId: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表数据
    getList() {
      let api
      if (this.type === 'all') {
        api = fetchAll
        api({ limit: 10 }).then(res => {
          this.alarmList = res.data || []
        })
      } else {
        if (this.type === 'vehicle') {
          api = fetchOldVehicle
        } else if (this.type === 'school') {
          api = fetchOldSchool
        } else if (this.type === 'community') {
          api = fetchOldCommunity
        } else if (this.type === 'factory') {
          api = fetchOldFactory
        }
        if (api && this.deviceNum) {
          api(this.deviceNum, { limit: 10 }).then(res => {
            this.alarmList = res.data || []
          })
        }
      }
    },
    formatImg(id) {
      return alarmImg(id)
    },
    editCloseDialog() {
      this.dialogVisable = false
    },
    showBigImg(id) {
      if (!id) {
        this.$confirm('暂无图片', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          showCancelButton: false
        })
      } else {
        this.dialogVisable = true
        this.dialogImgId = id
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.box-alarm {
  .alarm-title {
    position: relative;
    margin: 0;
    padding: 0;
    padding-left: 20px;
    font-size: 14px;
    border-bottom: 1px solid #F0F2F5;
    height: 40px;
    line-height: 40px;
    color: #333;
  }
  background: #fff;
  border-radius: 4px;
  .alarm-desc {
    position: absolute;
    top: 0;
    right: 20px;
    font-size: 12px;
    span {
      color: #FF9832;
      margin: 0 2px;
    }
  }
  .alarm-list {
    padding: 0 10px;
    height: 492px;
    overflow: auto;
    .alarmTitle {
      position: relative;
      margin-left: 10px;
      font-size: 12px;
      line-height: 32px;
      color: #333;
      cursor: pointer;
      span {
        color: #666;
        // width: 100px;
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
}
.mini.box-alarm {
  padding: 0 10px;
  .alarm-title {
    padding: 0;
  }
  .alarm-desc {
    right: 0;
  }
  .alarm-list {
    padding: 0;
    height: 198px;
    .alarmTitle {
      margin-left: 0;
    }
  }
}
.border.box-alarm {
  margin: 0 16px;
  border: 1px solid #ECEDE0;
  .alarm-title {
    background: #F0F2F5;
    padding: 0 10px;
  }
  .alarm-desc {
    right: 10px;
  }
  .alarm-list {
    padding: 0;
    height: 306px;
    .alarmTitle {
      margin-right: 10px;
    }
  }
}
</style>
