<template>
  <div class="monitor-container">
    <div class="monitor-header"></div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="视频" name="video">
        <div class="video-panel">
          <div class="left-part">
            <!-- 通过v-if来实现组件的加载和卸载，从而控制定时器的清理 -->
            <Traffic2 v-if="!!deviceNum && activeTab == 'video'" :type="type" :device-num="deviceNum" />
            <div class="video-player">
              <!-- 通过v-if来实现video组件的加载和卸载，无须再手工调方法控制 -->
              <VideoPlayer v-if="!!flv && activeTab == 'video'" :video-ref="videoRef" :options="videoOptions"/>
            </div>
            <div class="video-foot">
              <div class="v-position"><i class="icon-camera-position"></i> {{deviceName}}</div>
              <div class="v-btn"><el-button :size="size == 'small' ? 'mini' : ''" @click="goVsearch">视频下载</el-button></div>
              <div class="v-btn"><el-button :size="size == 'small' ? 'mini' : ''" @click="capture">视频抓拍</el-button></div>
            </div>
          </div>
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
            <div class="alarm-panel">
              <!-- 人脸没有告警 -->
              <AlarmPanel v-if="!!deviceNum && activeTab == 'video' && type != 'face'" :size="alarmSize" :border="border" :type="type" :device-num="deviceNum" />
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="图像抓拍" name="snap">
        <SnapList v-if="activeTab == 'snap'" :type="type" :device-num="deviceNum" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer'
import AlarmPanel from '@/components/AlarmPanel'
import SnapList from '@/components/SnapList'
import Traffic from '@/components/Traffic'
import Traffic2 from '@/components/Traffic/index2'

import {
  getDeviceSystemInfo, captureUpload, getliveStream
} from '@/api/device'

export default {
  name: 'Monitor',
  components: { VideoPlayer, AlarmPanel, SnapList, Traffic, Traffic2 },
  props: {
    size: {
      type: String,
      default() {
        return 'large'
      }
    },
    videoRef: {
      type: String
    },
    alarmSize: {
      type: String
    },
    // 视频直播子系统类型
    type: {
      type: String,
      default() {
        return this.$route.name
      }
    }
  },
  data() {
    return {
      activeTab: 'video',
      slide: 30,
      border: this.size != 'small',
      videoOptions: {
        autoplay: true,
        controls: true,
        width: 960, // 播放器宽度
        height: this.size == 'small' ? 320 : 480 // 播放器高度
        // poster: 'http://www.jq22.com/demo/vide7.1.0201807161136/m.jpg',
        // fluid: true, // 流体布局，自动充满，并保持播放其比例
        // sources: this.sources
      },
      // 直播流的设备号 假号
      deviceNum: '',
      deviceName: '',
      flv: '' // 直播流地址
    }
  },
  mounted() {
    this.getDeviceNum()
    // 获取设备号之后，根据设备号获取直播源
  },
  methods: {
    // 获取设备号
    getDeviceNum() {
      getDeviceSystemInfo().then(res => {
        const deviceList = res.data || []
        const device = deviceList.find(i => i.aiSystemName == this.type)
        if (device) { 
          this.deviceNum = device.deviceNum;
          this.deviceName = device.deviceName;
        }
        this.getLive()
      })
    },
    getLive() {
      getliveStream(this.deviceNum).then(res => {
        this.flv = res.data
        this.videoOptions = {
          autoplay: true,
          controls: true,
          width: 960, // 播放器宽度
          height: this.size == 'small' ? 320 : 480, // 播放器高度
          // poster: 'http://www.jq22.com/demo/vide7.1.0201807161136/m.jpg',
          // fluid: true, // 流体布局，自动充满，并保持播放其比例
          sources: [
            {
              src: res.data + '&a.flv',
              type: this.video_type(res.data + '&a.flv')
            }
          ]
        }
      })
    },
    video_type(_url){
      var url = _url.toLowerCase();
      if (url.startsWith('rtmp')) {
        return "rtmp/flv";
      }else if (url.endsWith('m3u8') || url.endsWith('m3u')) {
        return 'application/x-mpegURL';
      }else if (url.endsWith('webm')) {
        return 'video/webm';
      }else if (url.endsWith('mp4')) {
        return 'video/mp4';
      }else if (url.endsWith('ogv')) {
        return 'video/ogg';
      }
    },
    // 抓拍上报
    capture() {
      captureUpload({ deviceNum: this.deviceNum, systemName: this.type }).then(res => console.log(res))
    },
    goVsearch() {
      this.$router.push('/vsearch')
    }
  }
}
</script>

<style lang="scss" scoped>
.monitor-container {
  padding: 20px;
}
// overwrite
.video-js {
  // 播放器完全铺满
  width: 100%;
}
.left-part {
  margin-right: 304px;
  .video-player {
    position: relative;
    height: 480px;
    margin-top: 15px;
  }
  .video-foot {
    display: flex;
    align-items: center;
    padding: 10px 0;
    .v-position {
      flex: 1;
      font-size: 16px;
    }
    .v-btn {
      margin-left: 20px;
    }
  }
}
.right-part {
  width: 304px;
  position: absolute;
  right: 0;
  top: 0;
  background: #fff;
}
.icon-camera-position {
  display: inline-block;
  vertical-align: middle;
  background: url(../../assets/images/camera-position.png) no-repeat;
  background-size: contain;
  width: 16px;
  height: 20px;
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

// 首页缩小
.home {
  .monitor-container {
    padding: 0 10px;
  }
  .left-part {
    margin-right: 200px;
    .video-player {
      position: relative;
      height: 320px;
      margin-top: 10px;
    }
    .video-foot {
      .v-position {
        font-size: 14px;
      }
      .v-btn {
        margin-left: 10px;
      }
    }
  }
  .right-part {
    width: 200px;
    .video-control {
      transform: scale(0.64);
      transform-origin: top center;
      position: absolute;
      left: 50%;
      top: 0;
      margin-left: -152px;
    }
    .alarm-panel {
      margin-top: 190px;
    }
  }
  .icon-camera-position {
    width: 12px;
    height: 15px;
    background-size: contain;
  }
  .el-table__body-wrapper {
    overflow: auto;
    height: 332px;
  }
}
.video-player {
  background-color: #000;
}

</style>
