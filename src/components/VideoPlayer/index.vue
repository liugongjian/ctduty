<template>
  <div class="video-wrap">
    <div v-if="false" class="fuzzyImg">
      <img src="../../images/al0arm.jpg" alt class="fuzzy" />
    </div>
    <video :ref="videoRef" :controls="false" class="video-js"></video>
  </div>
</template>

<script>
import videojs from "video.js";
import "videojs-flash";
import "video.js/dist/video-js.css";

export default {
  name: "VideoPlayer",
  props: {
    options: {
      type: Object,
      default() {
        return {};
      }
    },
    videoRef: {
      type: String,
      default() {
        return "videoPlayer";
      }
    }
  },
  mounted() {
    console.log("this.options", this.options);
    this.player = videojs(
      this.$refs[this.videoRef],
      this.options,
      function onPlayerReady() {
        console.log("player created");
      }
    );
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
      console.log("player dispose");
    }
  }
};
</script>
<style lang="scss" scoped>
.video-wrap {
  width: 100%;
  height: 100%;
  text-align: center;
  margin-top: 20px;
  position: relative;
  overflow: hidden;

  .fuzzyImg {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;

    .fuzzy {
      width: 100%;
      height: 100%;
      filter: blur(20px);
    }
  }
}
.video-js {
  // 播放器完全铺满
  width: 100%;
  height: 100%;
  object-fit: fill !important;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50px;
}
</style>
