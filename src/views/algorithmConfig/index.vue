<template>
  <div v-loading="pageLoading" class="algorithmConfigWrap" element-loading-text="拼命加载中">
    <div class="algorithmConfig">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="配置详情" name="first">
          <div class="tabCon">
            <p>智能算法</p>
            <div class="btnBox">
              <span v-for="(v,k) in taskData" :key="k" :class="activeAlgorithm === k ? 'btnTab active' : 'btnTab'" @click="changeActive(k,v.id)">
                {{ v.cnName }}
              </span>
            </div>
            <div class="tabBox">
              <div v-for="(v,k) in taskData" :key="`${k}_${k}`" :class="activeAlgorithm === k ? 'btnCon on' : 'btnCon'">
                {{ v.description }}
              </div>
            </div>
          </div>
          <div class="videoList">
            <div class="videoInfo">
              <span class="infoName">
                已配置视频列表
              </span>
              <span v-if="videoWithConfig && videoWithConfig.length > 0" class="infoDetail">
                (已配置视频数：{{ videoWithConfig.length }}路，已配置视频数占比：{{ (videoWithConfig.length/totalCameras*100).toFixed(2) }}%)
              </span>
              <span v-else class="infoDetail">
                (已配置视频数：0路，已配置视频数占比：0%)
              </span>
            </div>
            <ul v-if=" videoWithConfig && videoWithConfig.length > 0 " class="nameList">
              <li v-for="(v,k) in videoWithConfig" :key="k" >
                {{ v.name }}
              </li>
            </ul>
            <div v-else class="nodata">
              暂无已配置视频
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="算法配置" name="second" class="videoContainerBox">
          <el-row>
            <el-col :span="7" class="videoQueryBox">
              <div class="videoTotalBox">
                <div class="videoTotal">
                  <span class="videoTotalText">视频列表</span>
                  <span class="videoTotalNum">总计：{{ total }}个摄像头</span>
                </div>
                <el-input v-model="queryKeyword" placeholder="请输入关键字" @change="getList"><el-button slot="append" icon="el-icon-search" @click="getList"></el-button></el-input>

              </div>
              <ul class="videoResult">
                <li v-for="(v,k) in nameList" :key="k" :class="activeVideoResult === k ? 'active' :''" @click="changeDeviceId(v.id,k)">
                  {{ v.name }}
                </li>
              </ul>
              <pagination
                v-show="total>0"
                :total="total"
                :page.sync="page"
                :limit.sync="limit"
                small
                pager-count="5"
                layout="prev, pager, next"
                @pagination="pageChange"
              />
            </el-col>
            <el-col :span="17" class="algorithmConfigList totalLine">
              <VideoConfig v-if="true" :device-id="deviceId" :arr2="algorithmListTwoDim" @canvasShow="setCanvasShow"></VideoConfig>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
// import VideoPlayer from '@/components/VideoPlayer'
import Pagination from '@/components/Pagination'
import VideoPlayer from '@/components/VideoPlayer'
import VideoConfig from '@/components/VideoConfig'
import client from '@/api/vedioAlgo'
import {
  taskList, videoListByAlgorithmId, getCameraList
} from '@/api/algorithm'

export default {
  components: { Pagination, VideoPlayer, VideoConfig },
  data() {
    return {
      activeName: 'first',
      pageLoading: true,
      activeAlgorithm: 0,
      videoWithConfig: [],
      nameList: [],
      taskData: [],
      deviceId: '',
      algorithmListTwoDim: [],
      algorithmId: '',
      activeVideoResult: 0,
      totalCameras: 0,
      cameraListByQuery: [],
      total: 0,
      page: 1,
      limit: 20,
      queryKeyword: ''
    }
  },
  watch: {
    limit() {
      this.page = 1
      this.pageChange()
    }
  },
  mounted() {},
  async created() {
    await this.getTaskList()
  },
  methods: {
    handleClick(tab, event) {
      if (tab.index === 0) {
        this.getTaskList()
      } else {
        this.getList()
      }
    },
    changeActive(k, id) {
      this.activeAlgorithm = k
      this.pageLoading = true
      this.getVideoList(id)
    },
    getTaskList() {
      const query = {
        cascade: true,
        page: {
          index: 1,
          size: 9999999
        },
        params: {}
      }
      taskList(query).then(res => {
        if (res.code === 0) {
          this.taskData = res.body.data
          //   this.algorithmId = res.body.data[0].id
          this.listLoading = false
          const id = res.body.data[0].id
          this.taskName = res.body.data[0].name
          this.getVideoList(id)
        }
      })
    },
    getVideoList(id) {
      videoListByAlgorithmId(id).then(res => {
        if (res.code === 0) {
          this.pageLoading = false
          this.videoWithConfig = res.body.data.configCameras
          this.totalCameras = res.body.data.totalCameras
        }
      })
    },
    getList() {
      const query = this.queryKeyword ? {
        'page': {
          'index': this.page,
          'size': this.limit
        },
        'params': [
          {
            'field': 'address',
            'operator': 'LIKE',
            'value': `%${this.queryKeyword.trim()}%`

          }]
      } : {
        'page': {
          'index': this.page,
          'size': this.limit
        },
        'params': []
      }
      getCameraList(query).then(res => {
        if (res.code === 0) {
          this.nameList = res.body.data
          this.total = res.body.page.total
          this.listLoading = false
          this.deviceId = res.body.data[0].id
          this.total = res.body.page.total
          this.getAlgorithmList(this.deviceId)
        }
      })
    },
    changeDeviceId(id, k) {
      this.deviceId = id
      this.activeVideoResult = k
      this.getAlgorithmList(id)
    },
    async getAlgorithmList(deviceId) {
      const { body: res } = await client.getInstanceList(deviceId)
      this.algorithmList = res.data
      this.algorithmList = this.algorithmList.map(this.saveUpdatePick)
      this.algorithmListTwoDim = this.changeToTwoDiArray(this.algorithmList, 3)
    },
    saveUpdatePick(item) {
      if (item.isPick) {
        item['isConfigAlready'] = true
        // item['beforePickStatus'] = true
        // item['isCommitStatus'] = true
        // item['originalPickStatus'] = true
      } else {
        item['isConfigAlready'] = false
        // item['beforePickStatus'] = false
        // item['isCommitStatus'] = false
        // item['originalPickStatus'] = false
      }
      return item
    },
    changeToTwoDiArray(dataList, num) {
      return dataList.reduce(
        (prev, next, idx) => {
          const inner = prev[~~(idx / num)]
          if (inner !== undefined) {
            inner.push(next)
          } else {
            prev.push([next])
          }
          return prev
        },
        [[]]
      )
    },
    setCanvasShow(payload) {
      this.canvasShowStatus = payload
    },
    pageChange(obj) {
      this.page = obj.page
      this.getList()
    }
  }
}
</script>
<style lang='scss'>
.algorithmConfigWrap{
    padding: 20px;
    background: #F0F2F5;
    // height: 100%;
    .algorithmConfig{
        background: #fff;
        // height: 100%;
    }
    // /deep/.el-tabs__header{
    //     margin: 0 0 5px;
    // }
    // /deep/.el-tabs__item{
    //     height: 40px;
    //     line-height: 40px;
    // }
    /deep/.el-tabs__content{
        overflow: auto;
    }
    .tabCon{
        padding: 0 22px;
        p{
            font-size: 16px;
            color: #333333;
        }
        .btnBox{
            padding-bottom: 10px;
            border-bottom: 1px dashed #E9E9E9;
        }
        .tabBox{
            margin-top: 20px;
        }
        .btnTab{
            display: inline-block;
            font-size: 14px;
            color: rgba(0,0,0,0.65);
            cursor: pointer;
            margin: 10px 40px 10px 0;
            &.active{
                background: #FA8334;
                padding: 2px 5px;
                border-radius: 2px;
                color: #FFFFFF;
            }
        }
        .btnCon{
            display: none;
            &.on{
                display: block;
            }
        }
    }
    .nameList{
        display: flex;
        flex-wrap: wrap;
        list-style: none;
        padding: 0;
        margin: 20px 0;
        border: 1px solid #EEE;
        li{
            margin: 10px 20px 10px 10px;
        }
    }
    .nodata{
        font-size: 16px;
        color: #333;
        border: 1px solid #EEE;
        margin: 20px 0;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }
    .videoList{
        margin-top: 20px;
        padding: 0 22px;
    }
    .videoInfo{
        .infoName{
            font-size: 16px;
            color: #333333;
        }
        .infoDetail{
            font-size: 12px;
            color: #666666;
        }
    }
    //算法配置
    .videoContainerBox{
        margin-bottom: 15px;
    }
    .totalLine{
        border-left: 1px solid #EEE;
    }
    .videoQueryBox{
        position: relative;
    }
    /deep/.pagination-container .showTotal{
        display: none;
    }
    .videoTotalBox{
        padding:20px;
    }
    .videoTotal{
        position: relative;
        margin-bottom: 10px;
    }
    .videoTotalText{
        font-size: 16px;
        color: #333;
        font-weight: bolder;
    }
    .videoTotalNum{
        font-size: 12px;
        color: #666666;
        position: absolute;
        top:4px;
        right: 10px;
    }
    .videoResult{
        display: flex;
        flex-wrap: wrap;
        list-style: none;
        padding: 0 20px;
        margin: 0 0 20px;
        li{
            margin: 7px 20px 7px 10px;
            padding: 2px 5px;
            cursor: pointer;
            &.active{
                background: #FA8334;
                border-radius: 2px;
                color: #FFFFFF;
            }
        }
    }
    .algorithmConfigList{
        .test{
            width: 828px;
            margin: 0 auto 20px;
        }
    }
}
</style>
