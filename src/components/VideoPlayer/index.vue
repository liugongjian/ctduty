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
  beforeUpdate() {
    console.log('player beforeUpdate', this.options)
  },
  mounted() {
    this.player = videojs(this.$refs[this.videoRef], this.options, function onPlayerReady() {
      console.log('player created')
    })
  },
  updated: function () {
    console.log('updated', this.options)
    this.$nextTick(function () {
      console.log('updated2')
      // Code that will run only after the
      // entire view has been re-rendered
    })
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
      console.log('player dispose')
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
