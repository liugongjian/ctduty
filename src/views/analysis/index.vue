<template>
  <div v-if="showAnalysis" class="analysis">
    <el-row :gutter="12">
      <el-col :span="12">
        <Subsystem :datax="carXData" :datay="carYData" :ids="carIds" title="车辆子系统"></Subsystem>
      </el-col>
      <el-col :span="12">
        <Subsystem :datax="schoolXData" :datay="schoolYData" :ids="schoolIds" title="学校子系统"></Subsystem>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="12">
        <Subsystem :datax="factoryXData" :datay="factoryYData" :ids="factoryIds" title="工厂子系统"></Subsystem>
      </el-col>
      <el-col :span="12">
        <Subsystem :datax="communityXData" :datay="communityYData" :ids="communityIds" title="社区子系统"></Subsystem>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="12">
        <Subsystem :datax="faceXData" :datay="faceYData" :ids="faceIds" title="人脸子系统"></Subsystem>
      </el-col>
      <div></div>
    </el-row>
  </div>
</template>
<script>
import Subsystem from '../../components/Subsystem'
import { fetchCarList } from '@/api/vehicle'
import { fetchSchoolList } from '@/api/school'
import { fetchFactoryList } from '@/api/factory'
import { fetchCommunityList } from '@/api/community'
import { fetchFaceList } from '@/api/face'
export default {
  name: '',
  components: {
    Subsystem
  },
  data() {
    return {
      charts: '',
      carXData: [],
      carYData: [],
      schoolXData: [],
      schoolYData: [],
      factoryXData: [],
      factoryYData: [],
      communityXData: [],
      communityYData: [],
      faceXData: [],
      faceYData: [],
      carIds: ['carLine', 'carPie'],
      schoolIds: ['schoolLine', 'schoolPie'],
      factoryIds: ['factoryLine', 'factoryPie'],
      communityIds: ['communityLine', 'communityPie'],
      faceIds: ['faceLine', 'facePie'],
      showAnalysis: false
    }
  },
  // 调用
  async created() {
    await fetchCarList().then(res => {
      res.data.map((item, index) => {
        this.carXData.push(item.day.substring(item.day.length - 5, item.day.length))
        this.carYData.push(item.count)
      })
    })
    await fetchSchoolList().then(res => {
      res.data.map((item, index) => {
        this.schoolXData.push(item.day.substring(item.day.length - 5, item.day.length))
        this.schoolYData.push(item.count)
      })
    })
    await fetchFactoryList().then(res => {
      res.data.map((item, index) => {
        this.factoryXData.push(item.day.substring(item.day.length - 5, item.day.length))
        this.factoryYData.push(item.count)
      })
    })
    await fetchCommunityList().then(res => {
      res.data.map((item, index) => {
        this.communityXData.push(item.day.substring(item.day.length - 5, item.day.length))
        this.communityYData.push(item.count)
      })
    })
    await fetchFaceList().then(res => {
      res.data.map((item, index) => {
        this.faceXData.push(item.day.substring(item.day.length - 5, item.day.length))
        this.faceYData.push(item.count)
      })
    })
    this.showAnalysis = true
  }
}
</script>
<style lang='scss' scoped>
    .analysis {
      background: #F0F2F5;
      padding: 15px;
    }
    .title {
      padding: 0 20px;
      width: 100%;
      height: 50px;
      line-height: 50px;
      font-weight: 700;
      border-bottom: 1px solid #ccc;
      box-sizing: content-box;
    }
    .chart {
      display: flex;
      .chartbox {
        flex: 1;
        width: 50%;
        height: 100%;
        p {
          height: 50px;
          line-height: 50px;
          padding: 0 20px;
          font-weight: 700;
        }
      }
    }
    .el-row {
      margin:10px;
    }
    .el-col>div {
      background-color: #fff;
    }
</style>
