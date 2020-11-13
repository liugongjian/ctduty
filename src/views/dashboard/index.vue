<template>
  <div id="dashID" class="dashboard-container">
    <div class="overviews">
      <div class="cameraPanel">
        <div class="cameraPanel-content">
          <div class="cameraPanel-icon cameraPanel-icon-online"> <svg-icon icon-class="dashboardCamera" class-name="cameraPanel-icon-content"></svg-icon></div>
          <div class="cameraPanel-info">
            <div class="cameraPanel-title">在线摄像头</div>
            <div class="cameraPanel-number">{{ realTimeData.onlineCameras }} 个</div>
            <div class="cameraPanel-footer">占比 {{ cameraOnlineRateText }}</div>
          </div>
        </div>
      </div>
      <div class="cameraPanel">
        <div class="cameraPanel-content">
          <div class="cameraPanel-icon"> <svg-icon icon-class="dashboardCamera" class-name="cameraPanel-icon-content"></svg-icon></div>
          <div class="cameraPanel-info">
            <div class="cameraPanel-title">离线摄像头</div>
            <div class="cameraPanel-number">{{ realTimeData.offlineCameras }} 个</div>
            <div class="cameraPanel-footer">占比 {{ cameraOfflineRateText }}</div>
          </div>
        </div>
      </div>
      <div class="amount-flipper">
        <div class="overviews-itemTitle">今日检测结果统计</div>
        <div class="flip-container">
          <Flipper ref="millionFlag" />
          <div class="number-split" />
          <Flipper ref="thousand100" />
          <Flipper ref="thousand10" />
          <Flipper ref="thousand" />
          <div class="number-split" />
          <Flipper ref="hundred" />
          <Flipper ref="tenFlag" />
          <Flipper ref="digitFlag" />
        </div>
      </div>
    </div>
    <div class="charts">
      <div class="summaryBar">
        <div class="chart-title">智能算法应用概览</div>
        <SimpleBar id="algorith-pie" key="algorith-pie" :chart-data="taskAppliedByCameraListChartData"/>
      </div>
      <div class="chart1">
        <div class="chart-title">检测排行</div>
        <SimpleBar id="times-bar" key="times-bar" :chart-data="alertStatisByCameraChartData"/>
      </div>
      <div class="chart2">
        <div class="chart-title">检测趋势</div>
        <LineChart id="trend-bar" key="trend-bar" :chart-data="alertStatisByDayChartData"/>
      </div>
    </div>
    <div class="alarm-detail">
      <div class="chart-title">检测详情</div>
      <div class="alarm-detail-table"><el-table
        :data="tableData"
        :header-cell-style="{ background: '#ecedee', color: '#717171' }"
      >
        <el-table-column :show-overflow-tooltip="true" label="摄像头名称" prop="cameraName" width="150" align="center" fixed>
          <template slot-scope="scope"> {{ scope.row.cameraName }}</template>
        </el-table-column>
        <el-table-column label="值更检测" align="center" min-width="125">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '值更检测') }}</template>
        </el-table-column>
        <el-table-column label="人脸识别" align="center" min-width="125">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '人脸识别') }}</template>
        </el-table-column>
        <el-table-column label="车牌识别" align="center" min-width="125">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '车牌识别') }}</template>
        </el-table-column>
        <el-table-column label="区域画线告警" align="center" min-width="125">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '区域画线告警') }}</template>
        </el-table-column>
        <el-table-column label="翻墙检测" align="center" min-width="125">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '翻墙检测') }}</template>
        </el-table-column>
        <el-table-column label="人流识别" align="center" min-width="125">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '人流识别') }}</template>
        </el-table-column>
        <el-table-column label="车流识别" align="center" min-width="125">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '车流识别') }}</template>
        </el-table-column>
        <el-table-column label="安全帽识别" align="center" min-width="125">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '安全帽识别') }}</template>
        </el-table-column>
        <el-table-column label="车型检测" align="center" min-width="125">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '车型检测') }}</template>
        </el-table-column>
        <el-table-column label="人群聚集检测" align="center" min-width="125">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '人群聚集检测') }}</template>
        </el-table-column>
        <el-table-column label="打架斗殴检测" align="center" min-width="125">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '打架斗殴检测') }}</template>
        </el-table-column>
        <el-table-column label="摔倒检测" align="center" min-width="125">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '摔倒检测') }}</template>
        </el-table-column>
        <el-table-column label="占道经营检测" align="center" min-width="125">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '占道经营检测') }}</template>
        </el-table-column>
        <el-table-column label="人员逗留检测" align="center" min-width="125">
          <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, '人员逗留检测') }}</template>
        </el-table-column>
      </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="page"
          :limit.sync="limit"
          :auto-scroll="false"
          @pagination="pageChange()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import Flipper from '@/components/Charts/Flipper'
import StackedBar from '@/components/Charts/stackedBar'
import SimpleBar from '@/components/Charts/simpleBar'
import LineChart from '@/components/Charts/lineChart'
import DoughntPie from '@/components/Charts/doughntPie'
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
    Pagination,
    LineChart
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
      taskAppliedByCameraList: [],
      // 告警趋势
      alertStatisByDayList: [],
      // 告警排行
      alertStatisByCameraList: []
    }
  },
  computed: {
    cameraOnlineRateText() {
      const { cameraOnlineRate } = this.realTimeData
      return cameraOnlineRate || cameraOnlineRate === 0 ? (cameraOnlineRate * 100).toFixed(2) + '%' : '-'
    },
    cameraOfflineRateText() {
      const { cameraOnlineRate } = this.realTimeData
      return cameraOnlineRate || cameraOnlineRate === 0 ? ((1 - cameraOnlineRate) * 100).toFixed(2) + '%' : '-'
    },
    taskAppliedByCameraListChartData() {
      const categoryData = []
      const valueData = []
      const ranking = [...this.taskAppliedByCameraList].reverse()
      ranking.forEach(({ name, data, percent }) => {
        categoryData.push(name)
        valueData.push({
          value: data,
          percent
        })
      })
      return {
        yAxis: {
          type: 'category',
          data: categoryData
          // name: '已配置摄像头数/路'
        },
        xAxis: {
          type: 'value',
          data: valueData
        },
        unit: '路',
        tooltip: {
          formatter: ({ name, data }) => {
            return `${name}<br/>已配置摄像头数: ${data.value}路<br/>已配置占比: ${(data.percent * 100).toFixed(2)}%`
          }
        },
        series: {
          label: {
            show: true,
            position: 'insideLeft',
            formatter: ({ data }) => {
              return `${data.value}路(${(data.percent * 100).toFixed(2)}%)`
            }
          }
        }
      }
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
        },
        unit: '次'
      }
    },
    alertStatisByCameraChartData() {
      const categoryData = []
      const valueData = []
      const ranking = [...this.alertStatisByCameraList].reverse()
      ranking.forEach(({ cameraName, alertCount }) => {
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
        },
        unit: '次',
        series: {
          label: {
            show: true,
            position: 'insideLeft',
            formatter: ({ data }) => {
              return `${data}次`
            }
          }
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
$iconHeight: 80px;
// $cameraWidth: 220px;
// $flipperWidth: 280px;
// $summaryBarWidth: 600px;
$chartsHeight:370px;
$overviewsHeight:147px;

.dashboard-container{
  padding:20px;
  background-color:#F0F2F5;
  min-height: 100%;
  // min-width: 2 * $cameraWidth + $flipperWidth + $summaryBarWidth + 20px * 5;
  .span5px{
    display:inline-block;
    width: 3px;
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
    height: $overviewsHeight;
    justify-content: space-between;
    &-itemTitle{
      font-family: PingFangSC-Medium; //PingFangSC-Regular;
      font-size: 16px;
      color: #333333;
      margin-bottom: 20px;
    }
    .cameraPanel{
      flex-grow:1;
      margin-right: 20px;
      width:200px;
      border-radius: 2px;
      // width: $cameraWidth;
      background-color: white;
      padding:20px;
      &-content{
        height: 107px;
        width:300px;
        margin: 0 auto;
        // padding-bottom: 20px;
        // border-bottom: 1px solid #E8E8E8;
      }
      &-icon{
        // margin-left: 15%;
        width: $iconHeight;
        height: $iconHeight;
        line-height: 107px;
        font-size: $iconHeight;
        display: inline-block;
        color: #999;
        vertical-align: top;
        &-content{
          // width:100%;
          margin: 0 auto;
          height: 100%;
          width: 100%;
        }
        &-online{
          color:#1890FF;
        }
      }
      &-info{
        margin-left: 15%;
        height: $iconHeight;
        display: inline-block;
      }
      &-title{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        line-height: 22px;
        padding-top: 13px;
      }
      &-number{
        font-family: HelveticaNeue;
        font-size: 30px;
        color: rgba(0,0,0,0.85);
        line-height: 38px;
        height:38px;
        margin-bottom: 5px;
      }
      &-footer{
        margin-top: 5px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #9B9B9B;
        line-height: 22px;
      }
    }
    .amount-flipper{
      flex-grow:1;
      border-radius: 2px;
      // width:$flipperWidth;
      width:200px;
      background-color:white;
      padding:20px;
      .flip-container{
        margin: 10px auto;
        // width:$flipperWidth;
        width:100%;
        display:flex;
        align-items: center;
        justify-content: center;
        .M-Flipper{
          flex-shrink: 1;
          margin:0 5px;
        }
      }
    }
  }
  .charts{
    height: $chartsHeight;
    margin: 20px 0;
    display: flex;
    .summaryBar{
      flex-grow:1;
      border-radius: 2px;
      width:200px;
      background-color:white;
      padding:20px;
      margin-right: 10px;
    }
    .chart1, .chart2{
      flex-grow:1;
      // width:50%;
      width:200px;
      padding:20px;
      background-color: white;
      border-radius: 2px;
    }
    .chart1{
       margin-left: 10px;
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
  .pagination-container{
    position: relative;

  }
}
</style>
