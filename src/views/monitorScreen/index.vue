<template>
  <div class="monitorScreen-wrap">
    <div class="monitorScreen">
      <div v-for="item in deviceList" :key="item.id" class="screen">
        <div class="screen-inner">
          <div class="screen-head">
            <div class="head-label">
              <i class="el-icon-location-information"></i>
              <span :title="item.address">{{ item.address }}</span>
            </div>
            <div class="head-btn">
              <div class="btn" @click="updateMonitorDialog(item)"><i class="el-icon-setting"></i></div>
              <div class="btn" @click="deleteMonitor(item)"><i class="el-icon-delete"></i></div>
            </div>
          </div>
          <div class="screen-body">
            <VideoPlayer :video-ref="item.id" :options="item.videoOptions"/>
          </div>
        </div>
      </div>
      <div v-if="deviceList.length < 6" class="screen">
        <div class="screen-add" @click="addMonitorDialog">
          <i class="el-icon-circle-plus-outline"></i> 添加监控摄像头
        </div>
      </div>
    </div>
    <el-dialog :title="this.id ? '修改监控摄像头' : '添加监控摄像头' " :visible.sync="dialogFormVisible" width="540px" @closed="onClose">
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="摄像头地址" prop="cameraId">
          <el-select
            v-model="form.cameraId"
            :remote-method="getCameraList"
            :loading="loading"
            filterable
            remote
            filterable
            remote
            placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
import { fetchAllMonitor, updateMonitor, addMonitor, delMonitor } from '@/api/monitor'
import { searchCameraList } from '@/api/camera'

export default {
  components: { VideoPlayer },
  data() {
    return {
      dialogFormVisible: false,
      form: {},
      rules: {
        cameraId: [
          { required: true, message: '请选择摄像头地址', trigger: 'change' }
        ]
      },
      options: [],
      deviceList: [],
      loading: false,
      submiting: false,
      id: '',
      videoOptions: {
        autoplay: true,
        controls: true,
        width: 960, // 播放器宽度
        height: this.size == 'small' ? 310 : 480 // 播放器高度
        // poster: 'http://www.jq22.com/demo/vide7.1.0201807161136/m.jpg',
        // fluid: true, // 流体布局，自动充满，并保持播放其比例
        // sources: this.sources
      }
    }
  },
  mounted() {
    this.getLiveList()
  },
  methods: {
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
              field: 'address',
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
          data = data.filter(i => !this.deviceList.find(r => r.cameraId === i.id))
          this.options = data.map(item => {
            return {
              value: item.id,
              label: item.address
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
            videoOptions: {
              autoplay: true,
              controls: true,
              width: 400, // 播放器宽度
              height: 300, // 播放器高度
              // poster: 'http://www.jq22.com/demo/vide7.1.0201807161136/m.jpg',
              // fluid: true, // 流体布局，自动充满，并保持播放其比例
              sources: [
                {
                  src: item.flv + '&a.flv',
                  type: this.video_type(item.flv + '&a.flv')
                }
              ]
            }
          }
        })
        // 添加或修改后reload，要过滤掉已添加到九宫格的摄像头select options
        this.options = this.options.filter(i => !this.deviceList.find(r => r.cameraId === i.value))
      })
    },
    updateMonitorDialog(item) {
      this.form.cameraId = item.address
      this.dialogFormVisible = true
      this.id = item.id
    },
    deleteMonitor(item) {
      this.$confirm('确认移除该摄像头?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        delMonitor(item.id).then(res => {
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
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.submiting = true
          if (this.id) {
            updateMonitor({
              id: this.id,
              cameraId: this.form.cameraId
            }).then(res => {
              this.onClose()
              this.getLiveList()
              this.submiting = false
            })
          } else {
            addMonitor({
              cameraId: this.form.cameraId
            }).then(res => {
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
      }
    }
  }
}
</script>
<style lang='scss'>
.monitorScreen-wrap {
  padding: 20px;
  height: 100%;
  background: #F0F2F5;
  .el-input__inner {
    width: 360px;
  }
  .el-form-item__content {
    margin-left: 90px;
  }
}
.monitorScreen {
  overflow: hidden;
  padding: 10px 10px;
  background: #fff;
  .screen {
    float: left;
    width: 33.33%;
    .screen-inner {
      margin: 10px 10px;
    }
    .screen-add {
      height: 340px;
      margin: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      color: #333;
      border: 1px solid #9b9da0;
      border-radius: 5px 5px 0 0;
      cursor: pointer;
      i {
        font-size: 56px;
        margin-right: 5px;
      }
    }
    .screen-head {
      position: relative;
      height: 40px;
      display: flex;
      padding: 0 10px;
      align-items: center;
      border: 1px solid #9b9da0;
      border-radius: 5px 5px 0 0;
      .head-label {
        flex: 1;
        font-size: 18px;
        line-height: 40px;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .head-btn {
        display: flex;
        .btn {
          flex: 1;
          cursor: pointer;
          font-size: 20px;
          padding: 8px;
        }
      }
    }
    .screen-body {
      height: 300px;
      background: #333;
    }
  }
}
</style>
