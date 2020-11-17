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
    name: {
      type: String,
      default: ''
    },
    nameLength: {
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
  beforeDestroy() {
    window.clearInterval(this.timer)
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
        var name = this.name
        var nameLength = this.nameLength
        img.onload = function() {
          this.width = 1920
          this.height = 1080
          canvas.width = 1920
          canvas.height = 1080
          ctx.globalCompositeOperation = 'source-over'
          ctx.drawImage(img, 1920, 1080)
          ctx.lineWidth = 4
          ctx.strokeStyle = 'red'
          ctx.textBaseline = 'top'
          ctx.font = '48px Arial'
          this.timer = setInterval(() => {
            ctx.strokeRect(Math.ceil(coor.leftTop[0]), Math.ceil(coor.leftTop[1]), Math.ceil(_width), Math.ceil(_height))
            ctx.fillStyle = 'red'
            if (Math.ceil(coor.leftTop[1]) - 80 < 0) {
              ctx.strokeRect(Math.ceil(coor.leftTop[0]), Math.ceil(coor.rightBottom[1]), nameLength === '4' ? 200 : nameLength === '3' ? 160 : nameLength === '2' ? 120 : NaN, 80)
              ctx.fillRect(Math.ceil(coor.leftTop[0]), Math.ceil(coor.rightBottom[1]), nameLength === '4' ? 200 : nameLength === '3' ? 160 : nameLength === '2' ? 120 : NaN, 80)
              ctx.fillStyle = 'white'
              ctx.fillText(name, Math.ceil(coor.rightBottom[0]) + 10 - _width, Math.ceil(coor.rightBottom[1]) + 15)
            } else {
              ctx.strokeRect(Math.ceil(coor.leftTop[0]), Math.ceil(coor.leftTop[1]) - 80, nameLength === '4' ? 200 : nameLength === '3' ? 160 : nameLength === '2' ? 120 : NaN, 80)
              ctx.fillRect(Math.ceil(coor.leftTop[0]), Math.ceil(coor.leftTop[1]) - 80, nameLength === '4' ? 200 : nameLength === '3' ? 160 : nameLength === '2' ? 120 : NaN, 80)
              ctx.fillStyle = 'white'
              ctx.fillText(name, Math.ceil(coor.leftTop[0]) + 10, Math.ceil(coor.leftTop[1]) - 65)
            }
            setTimeout(() => {
              ctx.clearRect(0, 0, 1920, 1080)
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
