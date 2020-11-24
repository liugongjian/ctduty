<template>
  <div>
    <video :ref="videoRef" class="video-js"></video>
  </div>
</template>

<script>
import flvjs from 'flv.js'
import 'video.js/dist/video-js.css'

export default {
  name: 'VideoFlv',
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
        return 'videoFlv'
      }
    },
    flv: {
      type: String
    }
  },
  mounted() {
    if (flvjs.isSupported() && this.flv) {
      this.player = flvjs.createPlayer({
        type: 'flv',
        isLive: true,
        url: this.flv
      })
      this.player.attachMediaElement(this.$refs[this.videoRef])
      this.player.load()
      this.player.play()
    }
  },
  beforeDestroy() {
    console.log('player beforeDestroy')
    if (this.player) {
      this.player.pause()
      this.player.destroy()
      this.player = null
    }
  }
}
</script>
<style lang="scss" scoped>
.video-js {
  // 播放器完全铺满
  width: 100%;
  object-fit: fill;
}
</style>
