<template>
  <div class="canvasBox">
    <canvas id="canvas" style="width:480px;height:270px;"></canvas>
  </div>
</template>

<script>

export default {
  props: {
    imgUrl: {
      type: String,
      default: ''
    },
    leftTop: {
      type: Array,
      default: () => {
        return []
      }
    },
    rightBottom: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  created() {
    this.step1()
  },
  methods: {
    step1() {
      setTimeout(() => {
        var canvas = document.getElementById('canvas')
        var img = new Image()
        var coor = {
          leftTop: this.leftTop,
          rightBottom: this.rightBottom
        }
        var _width = coor.rightBottom[0] - coor.leftTop[0]
        var _height = coor.rightBottom[1] - coor.leftTop[1]
        var ctx = canvas.getContext('2d')
        img.src = this.imgUrl
        img.onload = function() {
          canvas.width = _width = this.width
          canvas.height = _height = this.height
          ctx.globalCompositeOperation = 'source-over'
          ctx.drawImage(img, 0, 0)
          ctx.lineWidth = 4
          ctx.strokeStyle = 'red'
          setInterval(() => {
            ctx.strokeRect(Math.ceil(coor.leftTop[0] / 4), Math.ceil(coor.leftTop[1] / 4), Math.ceil(_width / 4), Math.ceil(_height / 4))
            setTimeout(() => {
              ctx.clearRect(0, 0, _width, _height)
            }, 300)
          }, 600)
        }
      }, 0)
    }
  }

}
</script>

<style lang='scss'>
.canvasBox{
  position: absolute;
}
</style>
