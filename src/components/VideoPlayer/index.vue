<template>
  <div class="video-wrap">
    <video :ref="videoRef" class="video-js"></video>
  </div>
</template>

<script>
import videojs from 'video.js'
import 'videojs-flash'
import 'video.js/dist/video-js.css'

export default {
  name: 'VideoPlayer',
  props: {
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    videoRef: {
      type: String,
      default() {
        return 'videoPlayer'
      }
    }
  },
  mounted() {
    this.player = videojs(this.$refs[this.videoRef], this.options, function onPlayerReady() {
    })
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>
<style lang="scss" scoped>
.video-wrap {
  width: 100%;
  height: 100%;
}
.video-js {
  // 播放器完全铺满
  width: 100%;
}
</style>
