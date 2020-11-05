<template>
  <div class="video-wrap">
    <div class="fuzzyImg" :visible.sync="DialogImg">
      <img src="../../images/alarm.jpg" alt class="fuzzy" />
    </div>
    <video :ref="videoRef" :controls="false" class="video-js"></video>
  </div>
</template>

<script>
import videojs from "video.js";
import "videojs-flash";
import "video.js/dist/video-js.css";
import { loadingImg } from "@/api/monitor";

export default {
  name: "VideoPlayer",
  props: {
    options: {
      type: Object,
      default() {
        return {
          DialogImg: false
        };
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
  },
  updated() {
    let imgList = document.getElementsByClassName("fuzzyImg");
    let imgCount = imgList.length;
    let imgLoad = 0;

    for (let i = 0; i < imgCount; i++) {
      imgList[i].onload = () => {
        imgLoad++;
        // console.log(imgLoad);
        if (imgLoad === imgCount) {
          this.loading = false;
          this.display = true;
        }
      };
    }

    setTimeout(() => {
      if (!this.display) {
        this.loading = false;
        this.display = !this.display;
        console.log("11111");
      }
    }, 5000);
  },
  methods: {
    getLoadImg() {
      loadingImg().then(res => {
        let data = res.body.data || [];
        // this.deviceList = data
        //   .filter(i => i.address)
        //   .map(item => {
        //     return { ...item };
        //   });
        const dataImg = res.body.data || [];
        console.log(this.dataImg);
        this.form.cameraId = item.cameraId;
        this.form.address = item.address;
        this.DialogImg = true;
        this.id = item.id;
      });
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
