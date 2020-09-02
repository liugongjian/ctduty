<template>
  <div class="dashboard-container">
    <el-row :gutter="12">
      <el-col :span="18" class="status">
        <div class="map">1</div>
      </el-col>
      <el-col :span="6" style="{width: '50%'; height: '532px'; margin-top: 20px;}">
        <div class="trend">
          2
        </div>
        <div class="dispose">
          3
        </div>
      </el-col>
      <el-col :span="18" style="margin-top:20px;margin-bottom:20px;">
        <el-col :span="16" style="padding-left:0;">
          <div class="classify">
            4
          </div>
        </el-col>
        <el-col :span="8" style="padding-right:0;">
          <div class="hotarea">
            5
          </div>
        </el-col>
      </el-col>
      <el-col :span="6" style="margin-top: 20px;margin-bottom:20px;">
        <div class="net">
          6
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
// 引入基本模板
// const echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import {
  fetchUser, fetchCommunity, alarmStatus
} from '@/api/user'

export default {
  name: 'Dashboard',
  // mixins: [PreCheck],
  components: {

  },
  data() {
    return {
    }
  },
  computed: {},
  created() {
  },
  async mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 0px 20px;
  background: #F0F2F5;
  .map {
    height: 450px;
    background-color: #fff;
  }
  .trend{
    height: 215px;
    background-color: #fff;
  }
  .dispose {
    height: 215px;
    background-color: #fff;
    margin-top:20px;
  }
  .classify {
    height: 200px;
    background-color: #fff;
  }
  .hotarea {
    height: 200px;
    background-color: #fff;
  }
  .net {
    height: 200px;
    background-color: #fff;
  }
  .status {
    margin-top: 20px;
  }
  .box-device {
    .device-panel {
      display: flex;
      height: 120px;
      .device-unit {
        flex: 1;
        padding: 15px 0;
        text-align: center;
        .unit-label {
          font-size: 14px;
          line-height: 40px;
          color: #ccc;
        }
        .unit-val {
          font-size: 26px;
          line-height: 50px;
          color: #FF9832;
        }
      }
    }
  }
  .box-line {
    margin-top: 20px;
  }
  .dash-title {
    position: relative;
    margin: 0;
    padding: 0;
    padding-left: 20px;
    font-size: 14px;
    border-bottom: 1px solid #F0F2F5;
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
}
</style>
