<template>
  <div id="dashID" class="dashboard-container">
    <div class="overviews">
      <div class="cameraPanel">
        <div class="cameraPanel-content">
          <div class="cameraPanel-icon cameraPanel-icon-online"> <svg-icon icon-class="dashboardCamera"></svg-icon></div>
          <div class="cameraPanel-info">
            <div class="cameraPanel-title">在线摄像头</div>
            <div class="cameraPanel-number">{{ realTimeData.onlineCameras }} 个</div>
          </div>
        </div>
        <div class="cameraPanel-footer">占比 {{ cameraOnlineRateText }}</div>
      </div>
      <div class="cameraPanel">
        <div class="cameraPanel-content">
          <div class="cameraPanel-icon"> <svg-icon icon-class="dashboardCamera"></svg-icon></div>
          <div class="cameraPanel-info">
            <div class="cameraPanel-title">离线摄像头</div>
            <div class="cameraPanel-number">{{ realTimeData.offlineCameras }} 个</div>
          </div>
        </div>
        <div class="cameraPanel-footer">占比 {{ cameraOfflineRateText }}</div>
      </div>
      <div class="amount-flipper">
        <div class="overviews-itemTitle">今日告警数</div>
        <div class="flip-container">
          <Flipper ref="millionFlag" />
          <span class="number-split" />
          <Flipper ref="thousand100" />
          <span class="span5px" />
          <Flipper ref="thousand10" />
          <span class="span5px" />
          <Flipper ref="thousand" />
          <span class="number-split" />
          <Flipper ref="hundred" />
          <span class="span5px" />
          <Flipper ref="tenFlag" />
          <span class="span5px" />
          <Flipper ref="digitFlag" />
        </div>
      </div>
      <div class="summaryBar">
        <div class="overviews-itemTitle">智能算法应用概览</div>
        <div>
          <div><StackedBar id="summary-bar-chart" :chart-data="taskAppliedByCameraList" width="600px" height="100px"/></div>
        </div>
      </div>
    </div>
    <div class="charts">
      <div class="chart1">
        <div class="chart-title">告警排行</div>
        <SimpleBar id="times-bar" key="times-bar" :chart-data="alertStatisByCameraChartData"/>
      </div>
      <div class="chart2">
        <div class="chart-title">告警趋势</div>
        <SimpleBar id="trend-bar" key="trend-bar" :chart-data="alertStatisByDayChartData"/>
      </div>
    </div>
    <div class="alarm-detail">
      <div class="chart-title">告警详情</div>
      <div class="alarm-detail-table"><el-table
        :data="tableData"
        :header-cell-style="{ background: '#ecedee', color: '#717171' }"
      >
        <el-table-column label="摄像头名称" prop="cameraName" width="250"></el-table-column>
        <el-table-column label="值更检测" >
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '值更检测') }}</template>
        </el-table-column>
        <el-table-column label="人脸识别">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '人脸识别') }}</template>
        </el-table-column>
        <el-table-column label="车牌识别">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '车牌识别') }}</template>
        </el-table-column>
        <el-table-column label="区域画线告警">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '区域画线告警') }}</template>
        </el-table-column>
        <el-table-column label="翻墙检测">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '翻墙检测') }}</template>
        </el-table-column>
        <el-table-column label="人流识别">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '人流识别') }}</template>
        </el-table-column>
        <el-table-column label="车流识别">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '车流识别') }}</template>
        </el-table-column>
        <el-table-column label="安全帽识别">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '安全帽识别') }}</template>
        </el-table-column>
        <el-table-column label="车型检测">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '车型检测') }}</template>
        </el-table-column>
        <el-table-column label="人群聚集检测">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '人群聚集检测') }}</template>
        </el-table-column>
        <!-- <el-table-column label="打架斗殴检测" prop="djdojc"></el-table-column>
        <el-table-column label="摔倒检测" prop="sdjc"></el-table-column>
        <el-table-column label="占道经营检测" prop="zdjyjc"></el-table-column>
        <el-table-column label="人员逗留检测" prop="rydljc"></el-table-column> -->
      </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="page"
          :limit.sync="limit"
          @pagination="pageChange()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import Pagination from '@/components/Pagination'
import Flipper from '@/components/Charts/Flipper'
import StackedBar from '@/components/Charts/stackedBar'
import SimpleBar from '@/components/Charts/simpleBar'
import DoughntPie from '@/components/Charts/doughntPie'
// 引入水波球
import 'echarts-liquidfill'
// 引入基本模板
// const echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import {
  fetchAllData, fetchNowInfo, getAlertStatics
} from '@/api/dashboard'
export default {
  name: 'Dashboard',
  // mixins: [PreCheck],
  components: {
    Flipper,
    StackedBar,
    SimpleBar,
    DoughntPie,
    Pagination
  },
  data() {
    return {
      page: 1,
      limit: 10,
      oldSize: 10,
      total: 0,
      timer: null,
      flipObjs: [],
      cardStyle: {
        height: '67px',
        lineHeight: '67px'
      },
      realTimeData: {
        cameraOnlineRate: null,
        offlineCameras: '-',
        onlineCameras: '-',
        todayAlerts: 0
      },
      tableData: [],
      testData: [
        {
          'id': 1,
          'name': '智能侦测 ',
          'data': 320,
          'percent': 10
        },
        {
          'id': 2,
          'name': '算法A',
          'data': 310,
          'percent': 20
        },
        {
          'id': 3,
          'name': '算法B',
          'data': 100,
          'percent': 15
        },
        {
          'id': 4,
          'name': '算法C',
          'data': 130,
          'percent': 15
        },
        {
          'id': 5,
          'name': '其它',
          'data': 333,
          'percent': 40
        }
      ],
      taskAppliedByCameraList: [],
      // 告警趋势
      alertStatisByDayList: [],
      // [
      //   {
      //     'calDay': '08月01日',
      //     'alertCount': 11,
      //     'typeCount': [{ 'type': 1, 'count': 1 }, { 'type': 2, 'count': 10 }]
      //   },
      //   {
      //     'calDay': '08月02日',
      //     'alertCount': 4011,
      //     'typeCount': [{ 'type': 1, 'count': 1 }, { 'type': 2, 'count': 10 }]
      //   },
      //   {
      //     'calDay': '08月03日',
      //     'alertCount': 15834,
      //     'typeCount': [{ 'type': 1, 'count': 1 }, { 'type': 2, 'count': 10 }]
      //   }
      // ],
      // 告警排行
      alertStatisByCameraList: []
      // [
      //   {
      //     'cameraId': '1111',
      //     'cameraName': 'nnn',
      //     'alertCount': 11,
      //     'typeCount': [{ 'type': 1, 'count': 1 }, { 'type': 2, 'count': 10 }]
      //   },
      //   {
      //     'cameraId': '2222',
      //     'cameraName': 'yyyy',
      //     'alertCount': 10,
      //     'typeCount': [{ 'type': 1, 'count': 1 }, { 'type': 2, 'count': 10 }]
      //   },
      //   {
      //     'cameraId': '3333',
      //     'cameraName': 'zzz',
      //     'alertCount': 11,
      //     'typeCount': [{ 'type': 1, 'count': 1 }, { 'type': 2, 'count': 10 }]
      //   }
      // ],
    }
  },
  computed: {
    cameraOnlineRateText() {
      const { cameraOnlineRate } = this.realTimeData
      return cameraOnlineRate ? (cameraOnlineRate * 100).toFixed(2) + '%' : '-'
    },
    cameraOfflineRateText() {
      const { cameraOnlineRate } = this.realTimeData
      return cameraOnlineRate ? ((1 - cameraOnlineRate) * 100).toFixed(2) + '%' : '-'
    },
    alertStatisByDayChartData() {
      const categoryData = []
      const valueData = []
      this.alertStatisByDayList.forEach(({ calDay, alertCount }) => {
        categoryData.push(calDay)
        valueData.push(alertCount)
      })
      return {
        xAxis: {
          type: 'category',
          data: categoryData
        },
        yAxis: {
          type: 'value',
          data: valueData
        }
      }
    },
    alertStatisByCameraChartData() {
      const categoryData = []
      const valueData = []
      this.alertStatisByCameraList.forEach(({ cameraName, alertCount }) => {
        categoryData.push(cameraName)
        valueData.push(alertCount)
      })
      return {
        yAxis: {
          type: 'category',
          data: categoryData
        },
        xAxis: {
          type: 'value',
          data: valueData
        }

      }
    }
  },
  watch: {
    limit() {
      this.page = 1
      this.pageChange()
    },
    realTimeData: function(newVal, oldVal) {
      let { todayAlerts: newAlerts } = newVal
      let { todayAlerts: oldAlerts } = oldVal
      if (newAlerts === oldAlerts) {
        return
      }
      newAlerts = this.padLeftZero(newAlerts)
      oldAlerts = this.padLeftZero(oldAlerts)
      for (let i = 0; i < this.flipObjs.length; i++) {
        if (newAlerts[i] === oldAlerts[i]) {
          continue
        }
        this.flipObjs[i].flipDown(
          oldAlerts[i],
          newAlerts[i]
        )
      }
    }
  },
  mounted() {
    this.flipObjs = [
      this.$refs.millionFlag,
      this.$refs.thousand100,
      this.$refs.thousand10,
      this.$refs.thousand,
      this.$refs.hundred,
      this.$refs.tenFlag,
      this.$refs.digitFlag
    ]
    this.init()
    this.getRealtimeData()
    this.getChartsData()
    this.getAlertDetailList()
    this.timer = setInterval(() => {
      this.getRealtimeData()
      // const {
      //   cameraOnlineRate = 0.1,
      //   offlineCameras = 0,
      //   onlineCameras = 0,
      //   todayAlerts = 0
      // } = this.realTimeData
      // this.realTimeData = {
      //   cameraOnlineRate: cameraOnlineRate + 0.1,
      //   offlineCameras: offlineCameras + 1,
      //   onlineCameras: onlineCameras + 1,
      //   todayAlerts: todayAlerts + 123
      // }
    }, 3000)
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    getCountByName(taskCount, name) {
      for (const item of taskCount) {
        if (item.name === name) {
          return item.count
        }
      }
      return '-'
    },
    pageChange() {
      if (this.oldSize !== this.limit) {
        this.page = 1
      }
      this.oldSize = this.limit
      this.getAlertDetailList()
    },
    getAlertDetailList() {
      const query = {
        page: {
          index: this.page,
          size: this.limit
        },
        params: {}
        // sorts: [{ field: 'create_time', type: 'desc' }]
      }
      getAlertStatics(query).then(res => {
        if (res.code !== 0) return
        this.tableData = res.body.data
        this.total = res.body.page.total
      })
    },
    // 初始化数字
    init() {
      for (let i = 0; i < this.flipObjs.length; i++) {
        this.flipObjs[i].setFront(0)
      }
    },
    // 数字翻牌器补零
    padLeftZero(str) {
      str = str + ''
      if (str.length > 7) {
        this.$message('告警数过大无法显示全！')
        return str.substring(str.length - 7, 7)
      }
      while (str.length < 7) {
        str = '0' + str
      }
      return str
    },
    getRealtimeData() {
      // fetchAllData
      const params = {
        cascade: true,
        page: {
          index: 1,
          size: 20
        },
        params: {
        }
      }
      fetchNowInfo(params).then(res => {
        const { body: { data }} = res
        this.realTimeData = data
        // const { body: { data: {
        //   cameraOnlineRate,
        //   offlineCameras,
        //   onlineCameras,
        //   todayAlerts
        // }}} = res
        // this.cameraOnlineRate = cameraOnlineRate
        // this.offlineCameras = offlineCameras
        // this.onlineCameras = onlineCameras
        // this.todayAlerts = todayAlerts
      })
    },
    getChartsData() {
      const params = {
        cascade: true
      }
      fetchAllData(params).then(({ body: { data }}) => {
        const {
          alertStatisByCameraList,
          alertStatisByDayList,
          taskAppliedByCameraList
        } = data
        this.alertStatisByCameraList = alertStatisByCameraList
        this.alertStatisByDayList = alertStatisByDayList
        this.taskAppliedByCameraList = taskAppliedByCameraList
      })
    }
  }
}

</script>

<style lang="scss" scoped>
$iconHeight: 65px;
$cameraWidth: 220px;
$flipperWidth: 350px;
$summaryBarWidth: 600px;
.dashboard-container{
  padding:20px;
  background-color:#F0F2F5;
  min-height: 100%;
  min-width: 2 * $cameraWidth + $flipperWidth + $summaryBarWidth + 20px * 5;
  .span5px{
    display:inline-block;
    width: 3px;
  }
  .number-split{
    display:inline-block;
    width: 7px;
  }
  .number-split::before{
    content: ",";
    color:#3AA0FF;
    font-size: 36px;
  }
  .chart-title{
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #333333;
    padding-bottom: 10px;
    border-bottom: 1px solid #E8E8E8;
  }
  .overviews{
    display:flex;
    height: 147px;
    justify-content: space-between;
    &-itemTitle{
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      margin-bottom: 20px;
    }
    .cameraPanel{
      flex-grow:0.5;
      margin-right: 20px;
      border-radius: 2px;
      width: $cameraWidth;
      background-color: white;
      padding:20px;
      &-content{
        height: $iconHeight+20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #E8E8E8;
      }
      &-icon{
        width: $iconHeight;
        height: $iconHeight;
        line-height: $iconHeight;
        font-size: 50px;
        display: inline-block;
        color: #999;
        vertical-align: top;
        &-online{
          color:#1890FF;
        }
      }
      &-info{
        height: $iconHeight;
        display: inline-block;
      }
      &-title{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        line-height: 22px;
        padding-top: 5px;
      }
      &-number{
        font-family: HelveticaNeue;
        font-size: 30px;
        color: rgba(0,0,0,0.85);
        line-height: 38px;
        height:38px;
      }
      &-footer{
        margin-top:10px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0,0,0,0.65);
        line-height: 22px;
      }
    }
    .amount-flipper{
      flex-grow:1;
      border-radius: 2px;
      width:$flipperWidth;
      background-color:white;
      padding:20px;
      margin-right: 20px;
      .flip-container{
        margin: 10px auto;
        width:$flipperWidth;
      }
    }
    .summaryBar{
      flex-grow:0.5;
      border-radius: 2px;
      width:$summaryBarWidth;
      background-color:white;
      padding:20px;
    }
  }
  .charts{
    height: 420px;
    margin: 20px 0;
    display: flex;
    .chart1, .chart2{
      width:50%;
      padding:20px;
      background-color: white;
      border-radius: 2px;
    }
    .chart1{
      margin-right: 10px;
    }
     .chart2{
      margin-left: 10px;
    }
  }
  .alarm-detail{
    padding:20px;
    background-color: white;
    border-radius: 2px;
    &-table{
      margin-top: 20px;
    }
  }
}
</style>
