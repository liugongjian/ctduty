<template>
  <div v-loading="pageLoading" class="monitorScreen-wrap" element-loading-text="拼命加载中">
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
                :flv="item.flvSrc"/> -->
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
        <div class="screen-add" @click="addMonitorDialog">
          <i class="el-icon-plus"></i> 添加监控摄像头
        </div>
      </div>
    </div>
    <el-dialog
      :title="id ? '修改监控摄像头' : '添加监控摄像头' "
      :visible.sync="dialogFormVisible"
      width="540px"
      @closed="onClose"
    >
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="设备名称" prop="cameraId" label-width="100px">
          <el-select
            v-model="form.cameraId"
            :remote-method="getCameraList"
            :loading="loading"
            filterable
            remote
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
          </el-option></el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button :loading="submiting" type="warning" @click="saveMonitor">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer'
import VideoFlv from '@/components/VideoFlv'
import {
  fetchAllMonitor,
  updateMonitor,
  addMonitor,
  delMonitor,
  loadingImg
} from '@/api/monitor'
import { fetchAllCameraList, searchCameraList } from '@/api/camera'
import fakeimg from '@/assets/images/fakeimg.png'
import nosrc from '@/assets/images/nosrc.png'

export default {
  components: { VideoPlayer, VideoFlv },
  data() {
    return {
      pageLoading: true,
      dialogFormVisible: false,
      form: {},
      rules: {
        cameraId: [
          { required: true, message: '请选择设备名称', trigger: 'change' }
        ]
      },
      nosrc,
      options: [],
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
      heightByAuto: ''
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
    await this.loadFakeImg()
    await this.getAllCamera()
  },
  methods: {
    loadFakeImg() {
      this.pageLoading = true
      loadingImg().then(res => {
        if (res.body.data.length > 0) {
          // const staticImg = []
          res.body.data.forEach(item => {
            this.deviceList.push({
              address: item.address,
              image: item.image ? 'data:image/png;base64,' + item.image : fakeimg,
              id: item.id,
              name: item.name
            })
          })
          // const a = staticImg.filter((item, index) => {
          //   this.deviceList.find(val => item.id !== val.id)
          // })
          // if (a.length > 1) {
          //   this.deviceList.push(a)
          // }
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
        }
      }
      fetchAllCameraList(params).then(res => {
        if (res.code === 0) {
          this.allCameraList = res.body.data
        }
      })
    },
    getCameraList(keyword) {
      if (keyword !== '') {
        this.loading = true
        const params = {
          cascade: true,
          page: {
            index: 1,
            size: 20
          },
          params: [
            {
              field: 'name',
              operator: 'LIKE',
              value: `%${keyword}%`
            },
            {
              field: 'online',
              operator: 'EQUALS',
              value: 0
            }
          ]
        }
        searchCameraList(params).then(res => {
          let data = res.body.data || []
          // 已添加到九宫格的摄像头要过滤掉
          data = data.filter(
            i => !this.deviceList.find(r => r.cameraId === i.id)
          )
          this.options = data.map(item => {
            return {
              value: item.id,
              label: item.address,
              name: item.name
            }
          })
          this.loading = false
        })
      } else {
        this.options = []
      }
    },
    getLiveList() {
      fetchAllMonitor().then(res => {
        const data = res.body.data || []
        this.deviceList = data.map(item => {
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
                // {
                //   src: item.rtmpuri,
                //   type: 'application/x-mpegURL'
                // }
              ]
            }
          }
        })
        // 添加或修改后reload，要过滤掉已添加到九宫格的摄像头select options
        this.options = this.options.filter(
          i => !this.deviceList.find(r => r.cameraId === i.value)
        )
        this.pageLoading = false
      })
    },
    updateMonitorDialog(item) {
      this.form.cameraId = item.name
      this.dialogFormVisible = true
      this.id = item.id
    },
    deleteMonitor(item) {
      this.$confirm('确认移除该摄像头?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        delMonitor(item.id).then(res => {
          this.deviceList = this.deviceList.filter(i => i.id !== item.id) // list接口响应慢，这里先过滤掉
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getLiveList()
        })
      })
    },
    onClose() {
      this.$refs['ruleForm'].resetFields()
      this.submiting = false
      this.form = {}
      this.dialogFormVisible = false
      this.id = null
    },
    addMonitorDialog() {
      this.form = {}
      this.dialogFormVisible = true
    },
    saveMonitor() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.submiting = true
          if (this.id) {
            updateMonitor({
              id: this.id,
              cameraId: this.form.cameraId
            }).then(res => {
              // 因为添加修改接口很快，但是list接口很慢，所以可能会重复添加；这里直接开始过滤
              this.options = this.options.filter(
                i => i.value !== this.form.cameraId
              )
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.onClose()
              this.getLiveList()
              this.submiting = false
            })
          } else {
            this.options.forEach(item => {
              if (item.value === this.form.cameraId) {
                this.deviceList.push({
                  address: item.label,
                  image: fakeimg
                })
              }
            })
            addMonitor({
              cameraId: this.form.cameraId
            }).then(res => {
              // 因为添加修改接口很快，但是list接口很慢，所以可能会重复添加；这里直接开始过滤
              this.options = this.options.filter(
                i => i.value !== this.form.cameraId
              )
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.onClose()
              this.getLiveList()
              this.submiting = false
            })
          }
        } else {
          return false
        }
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
.monitorScreen-wrap {
  padding: 20px;
  height: 100%;
  background: #f0f2f5;
  /deep/.el-input__inner {
    width: 360px;
  }
  /deep/.el-form-item__content {
    margin-left: 90px;
  }
}
.monitorScreen {
  overflow: auto;
  padding: 10px 10px;
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  flex-direction:row;
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
      height: calc(35vh + 36.4px);
      // height: 210px;
      margin: 10px;
      // width: 100%;
      // height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px !important;
      color: #ccc;
      border: 1px dashed #ccc;
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
</style>
