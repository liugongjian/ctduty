<template>
  <div class="monitorScreen-wrap">
    <div class="monitorScreen">
      <template v-for="(item,index) in deviceList">
        <div v-if="index < 6" :key="`${item.id}_${index}`" class="screen">
          <div class="screen-inner">
            <div :style="{height: heightByAuto}" class="screen-body">
              <el-image
                v-if="item.image"
                :src="item.image"
                style="width:100%;height:100%;object-fit:contain;filter:blur(6px);"
              ></el-image>
              <VideoPlayer
                v-else-if="item.videoOptions.sources[0].src"
                :video-ref="item.cameraId"
                :key="item.cameraId"
                :options="item.videoOptions"
              />
              <!-- <VideoFlv
                v-else-if="item.flvSrc"
                :video-ref="item.cameraId"
                :key="item.cameraId"
              :flv="item.flvSrc"/>-->
              <div
                v-else
                style="width:100%;height:100%;background-color:#D9D9D9;text-align:center;position:relative;"
              >
                <el-image
                  :src="nosrc"
                  style="position:absolute;width:138px;height:30px;object-fit:contain;top:50%;left:50%;
                  transform:translate(-50%,-50%);"
                ></el-image>
              </div>
            </div>
            <div class="screen-head">
              <div class="head-label">
                <!-- <i class="el-icon-location-information"></i> -->
                <span :title="item.name">{{ item.name }}</span>
              </div>
              <div class="head-btn">
                <div class="btn" @click="updateMonitorDialog(item)">
                  <i class="el-icon-edit-outline" style="color:#898989;"></i>
                </div>
                <div class="btn" style="width:0px;height:24px;padding-left:6px;padding-top:8px;">
                  <div style="display:inline-block;width: 1px;height: 12px; background: #e9e9e9;"></div>
                </div>
                <div class="btn" @click="deleteMonitor(item)">
                  <i class="el-icon-delete" style="color:#a6a6a6;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-if="deviceList.length < 6 && !pageLoading || !deviceList.length" class="screen">
        <div
          :style="{height: `${parseInt(heightByAuto,10)+36}px`}"
          class="screen-add"
          @click="addMonitorDialog"
        >
          <i class="el-icon-plus"></i> 添加监控摄像头
        </div>
      </div>
    </div>
    <SelCamera
      :visible="dialogFormVisible"
      :on-submit="saveMonitor"
      :on-close="onClose"
      :filter="deviceList.map(item => item.cameraId)"
      :id="id"
      :cur-camera="curCamera"
      :submit-loading="submiting"
    />
  </div>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer'
import VideoFlv from '@/components/VideoFlv'
import SelCamera from './selCamera'
import Cookies from 'js-cookie'
import {
  fetchAllMonitor,
  updateMonitor,
  addMonitor,
  delMonitor,
  loadingImg
} from '@/api/monitor'
import { fetchAllCameraList } from '@/api/camera'
import fakeimg from '@/assets/images/fakeimg.png'
import nosrc from '@/assets/images/nosrc.png'
export default {
  components: { VideoPlayer, VideoFlv, SelCamera },
  data() {
    return {
      pageLoading: true,
      dialogFormVisible: false,
      changeName: '',
      curCamera: {},
      nosrc,
      deviceList: [],
      loading: false,
      submiting: false,
      id: '',
      videoOptions: {
        autoplay: true,
        controls: true,
        autoDisable: true,
        width: 960, // 播放器宽度
        height: 480 // 播放器高度
        // poster: 'http://www.jq22.com/demo/vide7.1.0201807161136/m.jpg',
        // fluid: true // 流体布局，自动充满，并保持播放其比例
        // sources: this.sources
      },
      allCameraList: [],
      heightByAuto: '',
      userId: ''
    }
  },
  watch: {
    deviceList(v) {
      v.map(item => {
        this.allCameraList.forEach(one => {
          if (one.id === item.cameraId) {
            item.name = one.name
          }
        })
      })
      this.$nextTick(() => {
        const boxWidth = document.querySelector('.screen-body').offsetWidth
        // const test = document.querySelector('.monitorScreen-wrap').offsetWidth
        const windowWidth = window.innerWidth
        // const windowHeight = window.innerHeight
        // console.log(boxWidth, windowWidth, windowHeight, (windowWidth - 240) / windowHeight, test)
        if (windowWidth > 1440) {
          this.heightByAuto = boxWidth / 1.3 + 'px'
        } else if (windowWidth <= 1440 && windowWidth > 1300) {
          this.heightByAuto = boxWidth / 1.366 + 'px'
        } else {
          this.heightByAuto = boxWidth / 1.45 + 'px'
        }
      })
    }
  },
  async mounted() {
    this.userId = Cookies.get('userId')
    await this.loadFakeImg()
    await this.getAllCamera()
  },
  methods: {
    loadFakeImg() {
      this.pageLoading = true
      loadingImg(this.userId).then(res => {
        if (res.code === 0) {
          res.body.data.forEach(item => {
            this.deviceList.push({
              address: item.address,
              image: item.image
                ? 'data:image/png;base64,' + item.image
                : fakeimg,
              id: item.id,
              name: item.name,
              cameraId: item.cameraId
            })
          })
          this.getLiveList()
          this.pageLoading = false
        }
      })
    },
    getAllCamera() {
      const params = {
        cascade: true,
        page: {
          index: 1,
          size: 999999
        },
        params: {
          inChargeId: this.userId
        }
      }
      fetchAllCameraList(params).then(res => {
        if (res.code === 0) {
          this.allCameraList = res.body.data
        }
      })
    },
    getLiveList() {
      fetchAllMonitor(this.userId).then(res => {
        const data = res.body.data || []
        this.deviceList = data.map(item => {
          return {
            ...item,
            image: null,
            // flvSrc: item.rtmpuri,
            videoOptions: {
              // autoplay: true,
              controls: true,
              width: 400, // 播放器宽度
              height: 300, // 播放器高度
              // poster: 'http://www.jq22.com/demo/vide7.1.0201807161136/m.jpg',
              fluid: true, // 流体布局，自动充满，并保持播放其比例
              sources: [
                {
                  src: item.m3u8uri,
                  type: this.video_type(item.m3u8uri)
                }
              ],
              techOrder: ['html5', 'flash'],
              autoplay: 'any'
            }
          }
        })
        this.pageLoading = false
      })
    },
    updateMonitorDialog(item) {
      this.id = item.id
      this.curCamera = {
        id: item.cameraId,
        name: item.name
      }
      this.dialogFormVisible = true
    },
    deleteMonitor(item) {
      this.$confirm('确认移除该摄像头?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMonitor(item.id).then(res => {
          this.deviceList = this.deviceList.filter(i => i.id !== item.id) // list接口响应慢，这里先过滤掉
          this.$notify({
            title: '成功',
            message: '移除成功',
            type: 'success',
            duration: 2000
          })
          this.getLiveList()
        })
      })
    },
    onClose() {
      // this.$refs['ruleForm'].resetFields()
      this.submiting = false
      this.dialogFormVisible = false
      this.id = null
    },
    addMonitorDialog() {
      // this.form = {}
      // this.options = []
      this.curCamera = {}
      this.dialogFormVisible = true
    },
    saveMonitor(cameraId, cameraName, close) {
      this.submiting = true
      if (this.id) {
        updateMonitor({
          id: this.id,
          cameraId: cameraId
        }).then(res => {
          // 因为添加修改接口很快，但是list接口很慢，所以可能会重复添加；这里直接开始过滤
          // this.options = this.options.filter(
          //   i => i.value !== this.curCameraId
          // )
          this.deviceList.forEach(item => {
            if (item.id === this.id) {
              item.image = fakeimg
              item.name = cameraName
              item.cameraId = cameraId
            }
          })
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          close()
          this.getLiveList()
          this.submiting = false
        })
      } else {
        this.deviceList.push({
          name: cameraName,
          image: fakeimg,
          id: cameraId,
          cameraId: cameraId
        })
        addMonitor({
          cameraId: cameraId
        }).then(res => {
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000
          })
          close()
          this.getLiveList()
          this.submiting = false
        })
      }
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
.monitorScreen-wrap {
  padding: 20px;
  min-height:100%;
  // height: 100%;
  background: #f0f2f5;
  /deep/.el-input__inner {
    width: 360px;
  }
  /deep/.el-form-item__content {
    margin-left: 90px;
  }
  .monitorScreen {
  overflow: auto;
  padding: 10px 10px;
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  // justify-content: center;

  .screen {
    float: left;
    width: 50%;
    // height: 48%;
    height: auto;
    min-width: 420px;
    .screen-inner {
      margin: 10px 10px;
      border-radius: 3px 3px 0 0;
    }
    .screen-add {
      // height: calc(35vh + 36.4px);
      height: 460px;
      margin: 10px;
      // width: 100%;
      // height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px !important;
      color: #ccc;
      border: 1px dashed #9b9b9b;
      border-radius: 5px 5px 0 0;
      cursor: pointer;
      i {
        font-size: 56px;
        margin-right: 5px;
      }
    }
    .screen-head {
      position: relative;
      display: flex;
      width: calc(100% + 0.5px);
      // width: 400px;
      padding: 0 10px;
      align-items: center;
      border: 1px solid #ebeef5;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border-radius: 0 0 3px 3px;
      .head-label {
        flex: 1;
        font-size: 14px;
        line-height: 30px;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .head-btn {
        display: flex;
        justify-content: space-around;
        .btn {
          flex: 1;
          cursor: pointer;
          font-size: 16px;
          padding: 8px;
        }
      }
    }
    .screen-body {
      // height: 35vh;
      width: auto;
      background: #333;
    }
    .el-icon-plus {
      font-size: 14px !important;
    }
  }
}
.screen-body {
  overflow: hidden;
}
}

</style>
