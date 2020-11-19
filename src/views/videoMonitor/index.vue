<template>
  <div v-loading="pageLoading" class="videomonitorWrap" element-loading-text="拼命加载中">
    <div class="videoMonitor">
      <div class="leftPanel">
        <div class="leftContent">
          <div class="monitorBox">
            <div class="video-panel">
              <div class="left-part">
                <VideoPlayer
                  :video-ref="device[0].cameraId"
                  :key="device[0].cameraId"
                  :options="device[0].videoOptions"
                />
              </div>
              <!-- v-if="!!flv && activeTab == 'video'" -->
              <!-- :video-ref="videoRef" -->
              <div class="right-part">
                <div class="video-control">
                  <div class="control-box">
                    <i class="icon center"></i>
                    <i class="icon up"></i>
                    <i class="icon down"></i>
                    <i class="icon left"></i>
                    <i class="icon right"></i>
                    <i class="icon leftup"></i>
                    <i class="icon rightup"></i>
                    <i class="icon leftdown"></i>
                    <i class="icon rightdown"></i>
                  </div>
                  <div class="opt-btn">
                    <el-row>
                      <el-col :span="8">
                        <div class="opt-box">
                          <i title="放大" class="icon enlarge"></i>
                          <el-divider direction="vertical"></el-divider>
                          <i title="缩小" class="icon zoomin"></i>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="opt-box">
                          <i title="焦距放大" class="icon jiaol"></i>
                          <el-divider direction="vertical"></el-divider>
                          <i title="焦距缩小" class="icon jiaos"></i>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="opt-box">
                          <i title="光圈放大" class="icon guangl"></i>
                          <el-divider direction="vertical"></el-divider>
                          <i title="光圈缩小" class="icon guangs"></i>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="control-slider">
                    <span>云台速度：</span>
                    <el-slider v-model="slide"></el-slider>
                  </div>
                </div>
              </div>
            </div>
          <!-- <div v-else>
              <p>请选择添加一个摄像头</p>
              <div class="monitorAddress">
                <span class="displayIB addressText">摄像头地址：</span>
                <el-select class="displayIB"></el-select>
                <el-button class="displayIB" type="primary" @click="sureThis">确定</el-button>
              </div>
            </div> -->

          </div>
          <div class="censusData">
            <div class="alertTable">
              <div class="panelTitle">统计分析</div>
              <el-table
                :data="tableData"
                fit
                style="width: 100%">
                <el-table-column
                  prop="date"
                  label="事件"
                  align="center"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="告警次数"
                  align="center"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="address"
                  align="center"
                  label="占比">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>

      </div>
      <div class="rightPanel">
        <div class="realTimeData">
          <!-- <div class="panelTitle">实时分析</div> -->
          <div class="streamData-wrapper">
            <div class="streamData">
              <div class="dataHeader">人流分析</div>
              <div class="dataTitle">
                今日累计
              </div>
              <div class="dataText">
                <div class="dataShow displayIB">
                  <p>流入</p>
                  <div>0人</div>
                </div>
                <div class="dataShow displayIB">
                  <p>流出</p>
                  <div>0人</div>
                </div>
              </div>
              <div class="dataTitle">
                实时流量（近一小时）
              </div>
              <div class="dataText">
                <div class="dataShow displayIB">
                  <p>流入</p>
                  <div>0人</div>
                </div>
                <div class="dataShow displayIB">
                  <p>流出</p>
                  <div>0人</div>
                </div>
              </div>
            </div>
            <div class="streamData">
              <div class="dataHeader">车流分析</div>
              <div class="dataTitle">
                今日累计
              </div>
              <div class="dataText">
                <div class="dataShow displayIB">
                  <p>流入</p>
                  <div>0辆</div>
                </div>
                <div class="dataShow displayIB">
                  <p>流出</p>
                  <div>0辆</div>
                </div>
              </div>
              <div class="dataTitle">
                实时流量（近一小时）
              </div>
              <div class="dataText">
                <div class="dataShow displayIB">
                  <p>流入</p>
                  <div>0辆</div>
                </div>
                <div class="dataShow displayIB">
                  <p>流出</p>
                  <div>0辆</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="photoBox">
          <div class="showPhoto">
            <span>今日实时抓拍</span>
            <el-select
              v-model="taskId"
              collapse-tags
              clearable
              class="photo-fitler-sel"
              size="mini"
              multiple
            >
              <el-option
                v-for="item in taskData"
                :key="item.id"
                :label="item.cnName"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div v-loading="photosLoading" v-if="photoCardList && photoCardList.length > 0" class="photoContainer" >
            <div v-for="(item) in photoCardList" :key="item.id" class="photoList">
              <div v-if="item.myPlaceholder" style="opacity:0"></div>
              <el-card v-else :body-style="{ padding: '0px' }">
                <el-image :src="item.imageCut" style="width: 100%; height:120px;" class="photoList-image" />
                <div style="padding: 14px;">
                  <span>{{ getTaskById(item.taskId) }}</span>
                  <div>{{ getDateTimeStr(item.createTime) }}</div>
                </div>
              </el-card>
            </div>
          </div>
          <div v-else class="photoContainer photoContainer-noData">
            <div class="photoContainer-noData-text">暂无数据</div>
          </div>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="page"
            :limit.sync="limit"
            small
            @pagination="pageChange()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Pagination from '@/components/Pagination'
import VideoPlayer from '@/components/VideoPlayer'
import { getAlertInfos } from '@/api/alarm'
import { taskList } from '@/api/algorithm'
import {
  fetchAllMonitor
} from '@/api/monitor'
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss'
const timeFormat = 'MM-DD HH:mm:ss'
export default {
  components: { Pagination, VideoPlayer },
  data() {
    return {
      cameraId: '61010010001320014342',
      taskId: '',
      taskData: [],
      photosLoading: false,
      photoCardList: [],
      pageLoading: false,
      total: 10,
      page: 0,
      limit: 10,
      showVideoSetting: false,
      videoOptions: {
        autoplay: true,
        controls: true,
        width: 400, // 播放器宽度
        height: 300, // 播放器高度
        // poster: 'http://www.jq22.com/demo/vide7.1.0201807161136/m.jpg',
        fluid: true, // 流体布局，自动充满，并保持播放其比例
        sources: [
          {

          }
          // {
          //   src: item.rtmpuri,
          //   type: 'application/x-mpegURL'
          // }
        ]
      },
      tableData: [{
        date: '2222',
        name: '111',
        address: '33%'
      }, {
        date: '2222',
        name: '111',
        address: '33%'
      }, {
        date: '2222',
        name: '111',
        address: '33%'
      }, {
        date: '2222',
        name: '111',
        address: '33%'
      }],
      device: []
    }
  },
  watch: {
    taskId(taskId) {
      this.getPhotoList(taskId)
    }
  },
  async created() {
    await this.getTaskList()
    await this.getPhotoList()
    await this.getLiveList()
  },
  methods: {
    sureThis() {
      this.showVideoSetting = true
    },
    getTaskById(id) {
      const target = this.taskData.find(item => item.id === id)
      return target.cnName
    },
    getTaskList() {
      const query = {
        cascade: true,
        page: {
          index: 1,
          size: 100
        },
        params: {}
      }
      taskList(query).then(res => {
        if (res.code === 0) {
          this.taskData = res.body.data
          //   this.algorithmId = res.body.data[0].id
          // this. = false
        } else {
          this.taskData = []
        }
      }).catch(err => {
        console.log(err)
      })
    },
    pageChange(e) {
      console.log('change')
      //   this.currentTab = e.label
      //   const s = e.label + ' ' + this.startTime + ':00'
      //   const end = e.label + ' ' + this.endTime + ':00'
      //   const h = this.formInline.typeValue
      //   this.page = 1
      this.getPhotoList()
    },
    getDateTimeStr(time) {
      return moment(time).format(timeFormat)
    },
    getPhotoList() {
      this.photosLoading = true
      const param = [{
        field: 'createTime',
        operator: 'BETWEEN',
        value: { 'start': moment().startOf('day').format(dateTimeFormat), 'end': moment().endOf('day').format(dateTimeFormat) }
      }
      ]
      if (this.taskId && this.taskId.length) {
        param.push({
          field: 'taskId',
          operator: 'IN',
          value: [...this.taskId]
        })
      }
      const params = {
        cascade: true,
        page: {
          index: this.page,
          size: this.limit
        },
        params: param,
        sorts: [
          {
            field: 'create_Time',
            type: 'desc'
          }
        ]
      }
      getAlertInfos(params).then(res => {
        const { body: { data, page: { total }}} = res
        this.photoCardList = data
        this.total = total
        this.photosLoading = false
      }).catch(err => {
        console.log(err)
        this.photosLoading = false
      })
    },
    getLiveList() {
      fetchAllMonitor().then(res => {
        const data = res.body.data || []
        this.device = data.map(item => {
          return {
            ...item,
            image: null,
            flvSrc: item.rtmpuri,
            videoOptions: {
              autoplay: true,
              controls: true,
              width: 400, // 播放器宽度
              height: 300, // 播放器高度
              // poster: 'http://www.jq22.com/demo/vide7.1.0201807161136/m.jpg',
              fluid: true, // 流体布局，自动充满，并保持播放其比例
              sources: [
                {
                  src: item.rtmpuri ? item.rtmpuri + '&a.flv' : '',
                  type: this.video_type(item.rtmpuri ? item.rtmpuri + '&a.flv' : '')
                }
              ]
            }
          }
        })
        console.log('devide', this.device)
        this.pageLoading = false
      })
    },
    video_type(_url) {
      var url = _url.toLowerCase()
      if (url.startsWith('rtmp')) {
        return 'rtmp/flv'
      } else if (url.endsWith('m3u8') || url.endsWith('m3u')) {
        return 'application/x-mpegURL'
      } else if (url.endsWith('webm')) {
        return 'video/webm'
      } else if (url.endsWith('mp4')) {
        return 'video/mp4'
      } else if (url.endsWith('ogv')) {
        return 'video/ogg'
      } else if (url.endsWith('hls')) {
        return 'application/x-mpegURL'
      }
    }
  }
}
</script>
<style lang='scss'>
.videomonitorWrap {
  padding: 20px;
  height:100%;
  background: #F0F2F5;
  .displayIB{
    display: inline-block;
  }
  .panelTitle{
    font-size: 16px;
    padding-bottom:20px;
  }
  .videoMonitor{
    display: flex;
    height:100%;
    .leftPanel{
      width:50%;
      flex-grow: 1;
      .leftContent{
        display: flex;
        flex-direction:column;
        height: 100%;
        width:100%;
      }
      .monitorBox{
        // height: 330px;
        height:50%;
        min-height: 300px;
        width:100%;
        flex-grow: 1;
        flex-shrink: 1;
        border: 1px dashed #D9D9D9;
        background: #fff;
        border-radius: 2px;
        position: relative;
        p{
            margin: 24px;
        }
      }
    }
    .rightPanel{
      width:50%;
      height:100%;
      flex-grow: 1;
      display:flex;
      flex-direction: column;
      .realTimeData{
        // flex-grow: 1;
        // width:50%;
        height:210px;
        margin-left: 20px;
        // background: #ffffff;
        // padding:20px;
        .streamData-wrapper{
          display:flex;
          justify-content: space-between;
        }
        .streamData{
          width: 48%;
          background: #ffffff;
          border: 1px solid #F0EFEF;
          padding-bottom: 15px;
        }
        .dataHeader{
            height: 30px;
            line-height: 30px;
            // font-size: 14px;
            // background: #F0EFEF;
            padding-left: 18px;
            color:rgba(0,0,0,0.85);
            // 注意回退
             padding-top:10px;
             font-size:16px;
        }
        .dataTitle{
            font-size: 14px;
            margin-top: 15px;
            margin-left: 20px;
        }
        .dataText{
            margin-left: 20px;
        }
        .dataShow{
          width:100px;
            p{
                font-size: 12px;
                color:rgba(0,0,0,0.85);
                margin: 16px 0 7px;
            }
            div{
                font-size: 14px;
            }
        }
      }
    }
    .photoBox{
      flex-grow:1;
      flex-shrink: 1;
      position:relative;
      background: #fff;
      width:calc(100% - 20px);
      height:calc(100% - 340px);
      min-height: 200px;
      margin: 20px 20px 0 20px;
      // height:100%;
      padding:20px;
      .showPhoto{
        height: 40px;
        line-height: 28px;
        font-size: 16px;
        position:relative;
        .photo-fitler-sel{
          width:180px;
          position: absolute;
          right:0;
        }
      }
      .photoContainer{
        display: flex;
        height: calc(100% - 80px);
        overflow-y:auto;
        flex-wrap: wrap;
        // justify-content: space-between;
        .photoList-image{
          object-fit: contain;
        }
        @media screen and (max-width: 1400px){
          .photoList{
            // display: inline-block;
            width: 31%;
            height:170px;
            margin-bottom: 20px;
            margin-right: 2%;
          }
        }
        @media screen and (min-width: 1401px) and (max-width: 1500px){
          .photoList{
            // display: inline-block;
            width: 23%;
            height:170px;
            margin-bottom: 20px;
            margin-right: 2%;
          }
        }
         @media screen and (min-width: 1501px){
          .photoList{
            // display: inline-block;
            width: 18%;
            height:170px;
            margin-bottom: 20px;
            margin-right: 2%;
          }
        }
          .photoContainer-noData{
            &-text{
              height: 100%;
              width:100%;
              line-height: 250px;
              font-size: 20px;
              color:#999;
              text-align: center;
              vertical-align: middle;
            }
          }

      }
    }
  }
  // .monitorAddress{
  //     width: 440px;
  //     position:absolute;
  //     top:50%;
  //     left:50%;
  //     transform:translate(-50%,-50%);
  //    .el-select{
  //       width: 278px;
  //       height: 36px;
  //    }
  //    .addressText{
  //       font-size: 14px;
  //       color: #4A4A4A;
  //    }
  // }
  .censusData{
    // display: flex;
    margin-top: 20px;
    height:300px;
    width: 100%;
    .el-table__header-wrapper table, .el-table__body-wrapper table{
        width: 100% !important;
    }
    th,td {
      padding: 5px !important;
    }
    .el-table__body, .el-table__footer, .el-table__header{
      table-layout: auto;
    }
    .alertTable{
      // flex-grow: 1;
      background: #ffffff;
      height:100%;
      padding:20px;
      width:100%;
    }
  }

  .pagination-container{
    position: absolute;
    bottom: 20px;
    width:calc(100% - 20px);
  }
//   .video-panel {
//     position: relative;
//     height: 100%;
//   }
  .right-part {
    width: 200px;
    position: absolute;
    right: 0;
    top: calc(50% - 100px);
    background: #fff;
    .video-control {
      transform: scale(0.64);
      transform-origin: top center;
      position: absolute;
      left: 50%;

      margin-left: -152px;
    }
    .alarm-panel {
      margin-top: 190px;
    }
  }
  .video-control{
  width: 304px;
  // height: 100%;
  .control-box {
    background: url(../../assets/images/control/control_bg.png) no-repeat 50%;
    width: 207px;
    height: 207px;
    margin: 0 auto;
    position: relative;
  }
  .icon {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
  }
  .center {
    background: url(../../assets/images/control/icon_refresh.png);
    width: 111px;
    height: 111px;
    position: absolute;
    top: 57px;
    left: 49px;
  }
  .up {
    background: url(../../assets/images/control/icon_up.png);
    width: 18px;
    height: 11px;
    position: absolute;
    top: 30px;
    left: 95px;
  }
  .down {
    background: url(../../assets/images/control/icon_down.png);
    width: 18px;
    height: 11px;
    position: absolute;
    top: 168px;
    left: 95px;
  }
  .left {
    background: url(../../assets/images/control/icon_left.png);
    width: 10px;
    height: 17px;
    position: absolute;
    top: 92px;
    left: 32px;
  }
  .right {
    background: url(../../assets/images/control/icon_right.png);
    width: 10px;
    height: 17px;
    position: absolute;
    top: 92px;
    left: 166px;
  }
  .leftup {
    background: url(../../assets/images/control/icon_leftup.png);
    width: 13px;
    height: 13px;
    position: absolute;
    top: 50px;
    left: 55px;
  }
  .rightup {
    background: url(../../assets/images/control/icon_rightup.png);
    width: 13px;
    height: 13px;
    position: absolute;
    top: 50px;
    left: 144px;
  }
  .leftdown {
    background: url(../../assets/images/control/icon_leftdown.png);
    width: 13px;
    height: 13px;
    position: absolute;
    top: 143px;
    left: 51px;
  }
  .rightdown {
    background: url(../../assets/images/control/icon_rightdown.png);
    width: 13px;
    height: 13px;
    position: absolute;
    top: 144px;
    left: 144px;
  }
  .opt-btn {
    margin-top: 20px;
    padding: 0 10px;
  }
  .opt-box {
    width: 76px;
    height: 27px;
    border: 1px solid #666;
    border-radius: 14px;
    margin: 0 auto;
    text-align: center;
    box-sizing: content-box;
    line-height: 24px;
  }
  .enlarge {
    background: url(../../assets/images/control/enlarge.png);
    width: 25px;
    height: 25px;
  }
  .zoomin {
    background: url(../../assets/images/control/zoomin.png);
    width: 25px;
    height: 25px;
  }
  .jiaol {
    background: url(../../assets/images/control/jiaol.png);
    width: 18px;
    height: 19px;
  }
  .jiaos {
    background: url(../../assets/images/control/jiaos.png);
    width: 19px;
    height: 19px;
  }
  .guangl {
    background: url(../../assets/images/control/guangl.png);
    width: 21px;
    height: 21px;
  }
  .guangs {
    background: url(../../assets/images/control/guangs.png);
    width: 21px;
    height: 21px;
  }
  .control-slider {
    display: flex;
    padding: 0 20px;
    span {
      width: 72px;
      line-height: 38px;
      font-size: 14px;
    }
    .el-slider {
      flex: 1;
    }
  }
}
}

</style>
