<template>
  <div v-loading="pageLoading" class="algorithmConfigWrap" element-loading-text="拼命加载中">
    <div class="algorithmConfig">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="配置详情" name="first">
          <div class="tabCon">
            <!-- <p>智能算法</p> -->
            <div class="btnBox">
              <span v-for="(v,k) in taskData" :key="k" :class="activeAlgorithm === k ? 'btnTab active' : 'btnTab'" @click="changeActive(k,v.id)">
                {{ v.cnName }}
              </span>
            </div>
            <!-- <div class="tabBox">
              <div v-for="(v,k) in taskData" :key="`${k}_${k}`" :class="activeAlgorithm === k ? 'btnCon on' : 'btnCon'">
                {{ v.description }}
              </div>
            </div> -->
          </div>
          <div class="videoList">
            <!-- <div class="videoInfo">
              <span class="infoName">
                已配置视频列表
              </span>
              <span v-if="videoWithConfig && videoWithConfig.length > 0" class="infoDetail">
                (已配置视频数：{{ videoWithConfig.length }}路，已配置视频数占比：{{ (videoWithConfig.length/totalCameras*100).toFixed(2) }}%)
              </span>
              <span v-else class="infoDetail">
                (已配置视频数：0路，已配置视频数占比：0%)
              </span>
            </div> -->
            <!-- <ul v-if=" videoWithConfig && videoWithConfig.length > 0 " class="nameList">
              <li v-for="(v,k) in videoWithConfig" :key="k" >
                {{ v.name }}
              </li>
            </ul> -->
            <el-table
              v-if=" videoWithConfig && videoWithConfig.length > 0 "
              :data="videoWithConfig"
              :header-cell-class-name="'tableRowClassHeader'"
              style="width: 100%"
              fit>
              <el-table-column
                prop="id"
                label="设备号"
                min-width="25%"
                class-name="facilicyId"
              >
              </el-table-column>
              <el-table-column
                prop="name"
                label="设备名称"
                min-width="35%"
                class-name="facilicyName"
              >
              </el-table-column>
              <el-table-column
                prop="online"
                label="设备状态"
                class-name="facilicy-status"
                min-width="10%"
              >
                <template slot-scope="scope">
                  <svg-icon v-if="scope.row.online" style="font-size:6px;line-height:23px;margin-bottom:2px;" icon-class="offline" />
                  <svg-icon v-else style="font-size:6px;line-height:23px;margin-bottom:2px;" icon-class="online" />
                  <span>{{ scope.row.online ? "离线":"在线" }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column
                prop="online"
                label="负责人"
                align="center">
              </el-table-column> -->
              <el-table-column
                prop="address"
                label="设备地址"
                min-width="30%"
                class-name="facilicyAddress"
              >
              </el-table-column>
            </el-table>
            <div v-else class="nodata">
              暂无已配置视频
            </div>
            <pagination
              v-show="listtotal>0"
              :total="listtotal"
              :page.sync="listpage"
              :limit.sync="listlimit"
              :pager-count="5"
              small
              layout="prev, pager, next"
              @pagination="listpageChange"
            />
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
                <el-input v-model="queryKeyword" placeholder="请输入摄像头地址" @change="searchList">
                  <el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
                </el-input>

              </div>
              <ul v-if="nameList.length>0" class="videoResult" @scroll="listenScroll">
                <li v-for="(v,k) in nameList" :key="k" :class="activeVideoResult === k ? 'active' :''" @click="changeDeviceId(v.id,k)">
                  <div>{{ v.name }}</div>
                </li>
              </ul>
              <div v-else class="noResult">暂无视频</div>
              <!-- <pagination
                v-show="total>0"
                :total="total"
                :page.sync="page"
                :limit.sync="limit"
                :pager-count="5"
                small
                layout="prev, pager, next"
                @pagination="pageChange"
              /> -->
            </el-col>
            <el-col :span="17" class="algorithmConfigList totalLine">
              <div v-if="algorithmList.length>0" class="algorithmBox">
                <VideoConfig :device-id="deviceId" :arr2="algorithmList" @canvasShow="setCanvasShow"></VideoConfig>
                <div class="totalNum">算法总计：{{ algorithmList.length }}</div>
              </div>
              <div v-else class="nodata">
                稍后再试
              </div>
            </el-col>
          </el-row>
          <div class="listBtnBox">
            <el-button type="primary" @click="applyAlgorithms(true)">确定</el-button>
          </div>
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
      algorithmList: [],
      algorithmListTwoDim: [],
      algorithmId: '',
      activeVideoResult: 0,
      totalCameras: 0,
      cameraListByQuery: [],
      total: 0,
      page: 1,
      limit: 20,
      queryKeyword: '',
      canvasShowStatus: false,
      controlShow: false,
      listtotal: 0,
      listpage: 1,
      listlimit: 10,
      winHeight: '',
      styleObj: {
        height: ''
      }
    }
  },
  watch: {
    limit() {
      this.page = 1
      this.pageChange()
      this.listpageChange()
    }
  },
  mounted() {

  },
  async created() {
    await this.getTaskList()
  },
  methods: {
    handleClick(tab, event) {
      this.pageLoading = true
      if (tab.index === 0) {
        this.getTaskList()
      } else {
        this.getList()
      }
    },
    getSomeHeight() {
      this.winHeight = document.querySelector('.videoContainerBox').clientHeight
      const topH = document.querySelector('.videoTotalBox').offsetHeight
      this.styleObj.height = (this.winHeight - topH) + 'px'
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
          index: this.listpage,
          size: this.listlimit
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
          this.listtotal = res.body.data.configCameras ? res.body.data.configCameras.length : 0
        }
      })
    },
    listenScroll(e) {
      const ele = e.srcElement ? e.srcElement : e.target
      if (ele.scrollTop + ele.offsetHeight > ele.scrollHeight - 100) {
        if (this.nameList.length >= this.total) {
          return false
        }
        ++this.page
        this.getList()
      }
    },
    searchList() {
      this.page = 1
      this.nameList = []
      this.getList()
    },
    getList() {
      const query = this.queryKeyword ? {
        'page': {
          'index': this.page,
          'size': this.limit
        },
        'params': [
          {
            'field': 'name',
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
          if (this.queryKeyword) {
            const dataList = res.body.data
            for (const val in dataList) {
              this.nameList.push(dataList[val])
            }
          } else {
            const dataList = res.body.data
            for (const val in dataList) {
              this.nameList.push(dataList[val])
            }
          }

          //   this.nameList.push(res.body.data)
          this.total = res.body.page.total
          this.listLoading = false
          this.deviceId = this.deviceId ? this.deviceId : res.body.data[0].id
          const getId = this.nameList[this.activeVideoResult] ? this.nameList[this.activeVideoResult].id : ''
          getId && this.getAlgorithmList(getId)
        }
      })
    },
    changeDeviceId(id, k) {
      this.controlShow = false
      this.canvasShowStatus = false
      this.pageLoading = true
      this.deviceId = id
      this.activeVideoResult = k
      this.getAlgorithmList(id)
    },
    async getAlgorithmList(deviceId) {
      const { body: res } = await client.getInstanceList(deviceId)
      this.algorithmList = res.data
      this.controlShow = true
      this.algorithmList = this.algorithmList.map(this.saveUpdatePick)
      //   this.algorithmListTwoDim = this.changeToTwoDiArray(this.algorithmList, 3)
      this.pageLoading = false

      this.getSomeHeight()
    },
    saveUpdatePick(item) {
      if (item.isPick) {
        item['isConfigAlready'] = true
        item['beforePickStatus'] = true
        item['isCommitStatus'] = true
        item['originalPickStatus'] = true
      } else {
        item['isConfigAlready'] = false
        item['beforePickStatus'] = false
        item['isCommitStatus'] = false
        item['originalPickStatus'] = false
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
    applyAlgorithms(flag) {
      if (flag) {
        console.log('调用后端接口保存标注坐标列表')
        // 先组装参数，包含删除、增加、修改
        // var allDatas = []
        // var nowAlgorithmList = [].concat.apply([], this.algorithmListTwoDim)
        // console.log('现在转化成一维数组', nowAlgorithmList)
        // console.log('二维数组---', this.algorithmListTwoDim)
        var params = []
        // var flag = true
        for (var i = 0; i < this.algorithmList.length; i++) {
          var algorithmObject = this.algorithmList[i]
          var param = {
            taskId: algorithmObject.id,
            id: algorithmObject.id,
            taskName: algorithmObject.name
          }
          if (algorithmObject.originalPickStatus && !algorithmObject.isPick) {
            // 删除
            param['action'] = 'delete'
            params.push(param)
          } else if (!algorithmObject.originalPickStatus && algorithmObject.isPick) {
            // 增加(检查，如果该配置的没有配置需要弹窗告警)
            param['action'] = 'add'
            if (algorithmObject.isNeedConfig) {
              const areas = algorithmObject['areas']
              if (areas === undefined || areas.length === 0) {
                alert(algorithmObject.cnName + '没有标注，请标注再提交或者取消选择')
                flag = false
                break
              } else {
                // console.log('原来的areas', algorithmObject['areas'])
                param['areas'] = this.formatAreas(areas, algorithmObject.ratiox, algorithmObject.ratioy)
              }
            }
            params.push(param)
          } else if (algorithmObject.originalPickStatus && algorithmObject.isPick && !algorithmObject.isCommitStatus) {
            // 修改、肯定需要标注（检查，如果该配置的没有配置需要弹窗告警）
            param['action'] = 'update'
            console.log('algorithmObject', algorithmObject)
            const areas = algorithmObject['areas']
            if (areas === undefined || areas.length === 0) {
              alert(algorithmObject.cnName + '没有标注，请标注再提交或者取消选择')
              flag = false
              break
            }
            console.log('原来的areas', algorithmObject['areas'])
            param['areas'] = this.formatAreas(areas, algorithmObject.ratiox, algorithmObject.ratioy)
            params.push(param)
          }
        }
        if (flag) {
          if (params.length > 0) {
            // console.log('组装的参数是-----', params)
            var finalBody = {
              deviceId: this.deviceId,
              taskInstParams: params
            }
            // console.log('最终组装的参数是-----', finalBody)
            this.pageLoading = true
            this.configTask(finalBody)
          }
          this.configVisable = false
        }
      } else {
        this.configVisable = false
      }
    },
    formatAreas(areas, ratiox, ratioy) {
      var newAreas = areas.map(eachArea => {
        var newPoints = this.formatPoints(eachArea.points, ratiox, ratioy)
        return {
          type: eachArea.type,
          name: eachArea.name,
          points: newPoints
        }
      })
      return newAreas
    },
    formatPoints(points, ratiox, ratioy) {
      console.log('参数值', points, ratiox, ratiox)
      var newPoints = []
      for (var i = 0; i < points.length; i++) {
        newPoints.push({
          x: parseInt(points[i].x * ratiox),
          y: parseInt(points[i].y * ratioy)
        })
      }
      return newPoints
    },
    async configTask(body) {
      const res = await client.configInstance(body)
      //   console.log('任务实例配置调用接口返回-----', res)
      if (res.code === 0) {
        this.pageLoading = false
        this.$message({
          message: '更新成功',
          type: 'success'
        })
      }
    },
    setCanvasShow(payload) {
      this.canvasShowStatus = payload
    },
    pageChange(obj) {
      this.getList()
    },
    listpageChange(obj) {
      this.listpageChange = obj.page
      this.getTaskList()
    },
    getStatus(status) {
      return status === 1 ? '在线' : '离线'
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
        // min-height: 100%;

    }
    // /deep/.el-tabs__header{
    //     margin: 5px 0 5px;
    // }
    // /deep/.el-tabs__item{
    //     height: 40px;
    //     line-height: 40px;
    // }

    /deep/.el-tabs__content{
        overflow:inherit;
         &::-webkit-scrollbar {
            display: none;
        }
    }
    .tabCon{
        padding: 0 22px;
        min-width: 900px;
        p{
            font-size: 16px;
            color: #333333;
        }
        .btnBox{
            padding-bottom: 10px;
            border-bottom: 1px dashed #E9E9E9;
            width: 100%;

        }
        .tabBox{
            margin-top: 20px;
        }
        .btnTab{
            display: inline-block;
            font-size: 14px;
            color: rgba(0,0,0,0.65);
            cursor: pointer;
            width: 12%;
            margin: 0.3%;
            text-align: center;
            padding: 5px;
            &.active{
                background:#FF9832;
                border-radius: 5px;
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
        /deep/.el-table__header-wrapper{
            // border-radius: 5px;
            border-top-right-radius: 7px;
            border-top-left-radius: 7px;
        }
        .facilicyId{
            // width: 25%;
            padding-left: 15px;
        }
        .facilicyName{
            // width: 30%;
        }
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
        position: relative;
    }
    .totalLine{
        border-left: 1px solid #EEE;
    }
    .videoQueryBox{
        position: relative;
        padding: 0 10px;
        .noResult{
            font-size: 16px;
            color: #333;
            border: 1px solid #EEE;
            margin: 20px 10px;
            height: 50px;
            line-height: 50px;
            text-align: center;
        }
    }
    .videoQueryBox{
        /deep/.pagination-container .showTotal{
            display: none;
        }
        /deep/.pagination-container{
            margin: 5px 0 0;
        }
    }

    /deep/.pagination-container .el-pagination{
        position: inherit;
        // float:right;
        margin-left:auto;
    }

    .videoTotalBox{
        padding:10px;
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
        // display: flex;
        // flex-wrap: wrap;
        list-style: none;
        padding: 0 10px;
        margin: 0 0 5px;
        height: 575px;
        overflow: auto;
        &::-webkit-scrollbar {
            display: none;
        }
        li{
            margin: 5px 0;
            cursor: pointer;
            font-size: 13px;
            div{
                padding: 5px 7px;
                // display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            &.active{
                div{
                    background: #FF9832;
                    border-radius: 5px;
                    color: #FFFFFF;
                }
            }
        }
    }
    .totalNum{
        color: #666666;
        margin: 30px 0;
    }
    .listBtnBox{
        // text-align: right;
        height: 60px;
        line-height: 60px;
        width: 100%;
        box-shadow: 0 -2px 4px 0 rgba(0,0,0,0.07);
        background: #fff;
        position: fixed;
        z-index: 99;
        bottom: 0;
        left: 0;
        text-align: right;
        padding-right: 20px;
    }
    .algorithmConfigList{
        // margin-left: 2.083335%;
        // padding-left: 2.083335%;
        padding: 0 20px;
        .algorithmBox{
            padding-bottom: 20px;
        }
        .test{
            // padding-left: 5px;
        }
        .configBox{
            // display: inline-block;
        }
        .config-info{
            // display:inline-block;
            // min-width: 840px;
            // margin: 0 auto;
            // font-size: 0;
            // padding: 10px;
        }
        .configchangebox{
             margin: 20px auto;
        }
    }
}
</style>
