<template>
  <div v-loading="pageLoading" class="algorithmConfigWrap" element-loading-text="拼命加载中">
    <div class="algorithmConfig">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="配置详情" name="first">
          <div class="tabCon">
            <p>智能算法</p>
            <div class="btnBox">
              <span v-for="(v,k) in taskData" :key="k" :class="activeAlgorithm === k ? 'btnTab active' : 'btnTab'" @click="changeActive(k)">
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
              <span class="infoDetail">
                (已配置视频数：111路，已配置视频数占比：12%)
              </span>
            </div>
            <ul class="nameList">
              <li v-for="(v,k) in nameList" :key="k" >
                {{ v.name }}
              </li>
            </ul>
          </div>
        </el-tab-pane>
        <el-tab-pane label="算法配置" name="second">
          <el-row>
            <el-col :span="6" class="totalLine">
              <div class="videoTotalBox">
                <div class="videoTotal">
                  <span>视频列表</span>
                  <span>总计：25个摄像头</span>
                </div>
                <el-input placeholder="请输入关键字" suffix-icon="el-icon-search"></el-input>
              </div>
              <ul class="videoResult">
                <li v-for="(v,k) in nameList" :key="k" @click="changeDeviceId(v.id)">
                  {{ v.name }}
                </li>
              </ul>
            </el-col>
            <el-col :span="18">
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
  taskList
} from '@/api/algorithm'
import {
  fetchAllCameraList
} from '@/api/camera'
export default {
  components: { Pagination, VideoPlayer, VideoConfig },
  data() {
    return {
      activeName: 'first',
      pageLoading: false,
      activeAlgorithm: 0,
      nameList: [],
      taskData: [],
      deviceId: '',
      algorithmListTwoDim: []
    }
  },
  mounted() {
    //    this.nameList = ['A视频啊我是', 'A视频啊我是', 'A视频啊我是', 'A视频啊我是', 'A视频啊我是', 'A视频啊我是', 'A视频啊我是', 'A视频啊我是', 'A视频啊我是', 'A视频啊我是', 'A视频啊我是', 'A视频啊我是', 'A视频啊我是', 'A视频啊我是', 'A视频啊我是', 'A视频啊我是']

    // this.getTaskList()
    // this.getList()
    console.log(this.deviceId)
  },
  async created() {
    await this.getTaskList()
    await this.getList()
  },
  methods: {
    handleClick(tab, event) {
    //   console.log(tab, event)
    },
    changeActive(k) {
      this.activeAlgorithm = k
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
          this.algorithmValue = res.body.data[0].id
          this.taskName = res.body.data[0].name
        }
      })
    },
    getList() {
      const params = {
        cascade: true,
        page: {
          index: this.page,
          size: this.limit
        },
        params: {
        }
      }
      fetchAllCameraList(params).then(res => {
        this.nameList = res.body.data
        this.total = res.body.page.total
        this.listLoading = false
        this.deviceId = res.body.data[0].id
        this.getAlgorithmList(this.deviceId)
        // console.log('id-------------->', res.body.data[0].id, this.deviceId)
      })
    },
    changeDeviceId(id) {
      this.deviceId = id
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
    }
  }
}
</script>
<style lang='scss'>
.algorithmConfigWrap{
    padding: 20px;
    background: #F0F2F5;
    height: 100%;
    .algorithmConfig{
        background: #fff;
        height: 100%;
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
    .totalLine{
        height: 100%;
        border-right: 1px solid #EEE;
    }
    .videoTotalBox{
        padding:20px;
    }
    .videoResult{
        display: flex;
        flex-wrap: wrap;
        list-style: none;
        padding: 0 20px;
        margin: 20px 0;
        li{
            margin: 10px 20px 10px 10px;
            cursor: pointer;
        }
    }
    .test{
        width: 828px;
        margin: 0 auto;
    }
}
</style>
