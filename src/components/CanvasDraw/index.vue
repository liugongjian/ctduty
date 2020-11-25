<template>
  <div class="box">
    <h3 style="text-align:center;">{{ currentPickAlgorithm.cnName }}配置</h3>
    <div class="buttoninfo">
      <el-tooltip v-show="lineFlag" content="画直线">
        <el-button :disabled="type == 1" class="buttonSize" @click="choose(1)">
          <img src="../../assets/images/line.png" class="imageStyle" >
        </el-button>
      </el-tooltip>
      <el-tooltip v-show="areaFlag" content="画矩形">
        <el-button :disabled="type == 2" class="buttonSize" style="margin-left:0;" @click="choose(2)">
          <img src="../../assets/images/rect.png" class="imageStyle" >
        </el-button>
      </el-tooltip>
      <el-tooltip v-show="areaFlag" content="画多边形">
        <el-button :disabled="type == 3" class="buttonSize" @click="choose(3)">
          <img src="../../assets/images/polygon.png" class="imageStyle" >
        </el-button>
      </el-tooltip>

      <span v-show="type!=1 && stepWallCheckShow" style="vertical-align:top" >
        请选择标记类型
        <el-select v-model="value">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </span>
      <span>
        <el-tooltip content="撤销上一个标记" style="margin-left: 10px">
          <!-- <el-button @click="revoke"> 撤销 </el-button> -->
          <el-button class="buttonSize" @click="revoke">
            <img src="../../assets/images/revoke.png" class="imageStyle" >
          </el-button>

        </el-tooltip>
        <el-tooltip content="清除画布" style="margin-left: 10px">
          <!-- <el-button @click="resetTemp"> 清除 </el-button> -->
          <el-button class="buttonSize" @click="resetTemp">
            <img src="../../assets/images/clear.png" class="imageStyle" >
          </el-button>
        </el-tooltip>
      </span>
    </div>
    <div class="canvas-box">
      <canvas
        id="myCanvas"
        width="640px"
        height="360px"
        @mousedown="function (event) {
                mousedown(event);
                }
            "
        @mousemove="function (event) {
                mousemove(event);
                }
            "
        @click="chooseAreaGraph"
      ></canvas>
    </div>
    <div v-if="tempChoosePoint.length>0" >
      <h6 style="margin-left:72px;">当前选中坐标: {{ tempChoosePoint }}</h6>
    </div>
    <div class="configBtnBox">
      <el-button class="configCancleBtn" plain @click="cancleAlgorithm()">取消</el-button>
      <el-button class="configBtn " type="success" plain @click="saveAlgorithm()">保存</el-button>
    </div>
  </div>
</template>
<script>
import client from '@/api/vedioAlgo'
import store from '@/store'
export default {
  props: ['currentPickDeviceId', 'currentPickAlgorithm'],
  data() {
    return {
      start_x: '',
      start_y: '',
      end_x: '',
      end_y: '',
      flag: false,
      points: [],
      type: '',
      options: [
        { value: '1', label: '墙体' },
        { value: '2', label: '禁区' }
      ],
      value: '1', // 默认标记类型是墙体
      imageUrl: '',
      image: new Image(),
      areas: [],
      ratiox: '',
      ratioy: '',
      historyPoints: [],
      wallCount: 1,
      forbCount: 1,
      lineCount: 1,
      areaCount: 1,
      markName: '',
      tempChoosePoint: [],
      needConfigAlgorithms: [
        {
          name: 'areaAlarm',
          cnName: '区域画线告警',
          message: '标记不正确,区域画线告警需要至少一个框,请重新标注',
          need: 'area'
        },
        {
          name: 'stepWallCheck',
          cnName: '翻墙检测',
          message: '标记不正确,翻墙检测需要墙体和禁区至少各一个,请重新标注',
          need: 'area'
        },
        {
          name: 'peopleTraffic',
          cnName: '人流识别',
          message: '标记不正确,人流识别需要至少一条直线,请重新标注',
          need: 'line'
        },
        {
          name: 'plateTraffic',
          cnName: '车流识别',
          message: '标记不正确,车流识别需要至少一条直线,请重新标注',
          need: 'line'
        }
      ],
      lineFlag: '',
      areaFlag: '',
      stepWallCheckShow: ''
    }
  },
  async mounted() {
    console.log(this.currentPickAlgorithm, 'chuanru')
    this.initCanvas()
  },
  created() {
    // 页面没有渲染之前
    // this.currentPickAlgorithm.isPick = false
  },
  methods: {
    async initCanvas() {
      var algoName = this.currentPickAlgorithm.name
      var algo = this.needConfigAlgorithms.filter(eachAlgo => eachAlgo.name == algoName)
      if (algo[0].name == 'stepWallCheck') {
        this.stepWallCheckShow = true
      }
      if (algo[0].need == 'line') {
        this.lineFlag = true
      } else {
        this.areaFlag = true
      }
      const canvas = document.getElementById('myCanvas')
      this.ctx = canvas.getContext('2d')
      this.ctx.font = '24px bold 黑体'
      this.ctx.fillStyle = 'black'
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      this.ctx.fillText('图片正在加载中', 300, 200)
      var img = new Image()
      // 改变图片的src
      // img.src ="http://host31.880508.xyz:10000/taskInst/snapshot/61010010001320014340";
      // img.src ="/nvsapi/taskInst/snapshot/61010010001320014340";
      if (this.currentPickAlgorithm.isPick && this.currentPickAlgorithm.isNeedConfig && this.currentPickAlgorithm.isConfigAlready) { // 只有当被选择、需要配置且已经配置,分两种情况
        if (this.currentPickAlgorithm.isCommitStatus == true) { // 已经提交过了,获取历史坐标
          const { body: res } = await client.getHisInstAreas(this.currentPickAlgorithm.id)
          this.historyPoints = res.data
          console.log(res.data, '接口')
        } else { // 没有提交,获取对象中暂存的关于这个算法的坐标
          var beforePoints = this.currentPickAlgorithm['areas']
          if (beforePoints != undefined) {
            var points = JSON.parse(JSON.stringify(beforePoints))
            this.historyPoints = points
          }
        }
      }
      if (this.historyPoints.length > 0) {
        var lastHisArea = this.historyPoints[this.historyPoints.length - 1]
        var nameList = lastHisArea.name.split('-') // 字符分割
        if (lastHisArea.name.startsWith('wall')) {
          this.wallCount = parseInt(nameList[1]) + 1
        } else if (lastHisArea.name.startsWith('forb')) {
          this.forbCount = parseInt(nameList[1]) + 1
        } else if (lastHisArea.name.startsWith('line')) {
          this.lineCount = parseInt(nameList[1]) + 1
        } else{
          this.areaCount = parseInt(nameList[1]) + 1
        }
      }
      // 加载完成执行
      const res = await client.getImageByDeviceId(this.currentPickDeviceId)
      if (res.code === 50000) {
        this.$message({
          showClose: false,
          message: res.message == undefined ? res.message : '设备异常',
          type: 'error'
        })
        // alert(res.message)
        this.cancleAlgorithm()
        return
      }
      var imageValue = 'data:image/png;base64,' + res.body.data
      var that = this
      // img.src =require("../../assets/images/video.jpg");
      // img.src ="/nvsapi/taskInst/snapshot/"+this.currentPickDeviceId;
      img.src = imageValue
      img.onload = loadImageSuccess
      function loadImageSuccess() {
        that.ctx.clearRect(0, 0, canvas.width, canvas.height)
        that.ratiox = img.width / canvas.width
        that.ratioy = img.height / canvas.height
        that.ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        if (that.currentPickAlgorithm.isPick && that.currentPickAlgorithm.isNeedConfig && that.currentPickAlgorithm.isConfigAlready) { // 只有当被选择、需要配置且已经配置,分两种情况
          // 如果是已经提交了,第一次修改，需要格式化坐标
          if (that.currentPickAlgorithm.isCommitStatus == true) { // 已经提交过了,获取历史坐标
            that.historyPoints = that.formatHistoryPoints(that.historyPoints)
          }
        }
        that.drawGraph(that.historyPoints)
      }
      this.image = img
      // 右键菜单禁用
      canvas.oncontextmenu = function() {
        window.event.returnValue = false
      }
    },
    async getAlgorithmHistoryAreas(item) {
      const { body: res } = await client.getHisInstAreas(item.id)
      return res.data
    },
    isEmpty(obj) {
      if (typeof obj === 'undefined' || obj == null || obj == '') {
        return true
      } else {
        return false
      }
    },
    // location是每个图形的起始点
    markGraph(location, content) {
      //  this.ctx.font = "24px bold 黑体";
      //  this.ctx.fillStyle = "black";
      // 以这个起点画一个小矩形
      this.ctx.fillStyle = 'gray'
      this.ctx.fillRect(location.x, location.y, 60, 20)
      this.ctx.fillStyle = 'white'
      this.ctx.textBaseline = 'top'
      this.ctx.font = '12px Arial'
      this.ctx.fillText(content, location.x + 30, location.y + 5)
    },
    saveAlgorithm() {
      var newPointsList = this.historyPoints.concat(this.areas)
      var res = this.checkMarkCorrectAndSave(this.currentPickAlgorithm.name, newPointsList)
      if (res != null) {
        // alert(res.message)
        this.$message({
          showClose: false,
          message: res.message,
          type: 'error'
        })
      } else { // 没有错
        this.currentPickAlgorithm['areas'] = newPointsList
        this.currentPickAlgorithm['ratiox'] = this.ratiox
        this.currentPickAlgorithm['ratioy'] = this.ratioy
        this.currentPickAlgorithm.isCommitStatus = false
        this.currentPickAlgorithm.isConfigAlready = true
        this.$emit('saveAlgorithm')
        // if(this.areas.length==0 && this.currentPickAlgorithm.isCommitStatus){//如果曾经提交了，只是打开看了一下保存，直接发送事件
        //   this.$emit('saveAlgorithm');
        // }else{
        //   console.log("未提交的历史坐标aaaa",this.historyPoints)
        //   console.log("未提交的当前的坐标",this.areas)
        //   console.log("历史坐标和新的坐标结合起来的点坐标集合222222",newPointsList)
        //   this.currentPickAlgorithm["areas"]=newPointsList
        //   this.currentPickAlgorithm['ratiox']=this.ratiox
        //   this.currentPickAlgorithm['ratioy']=this.ratioy
        //   this.currentPickAlgorithm.isCommitStatus = false
        //   this.currentPickAlgorithm.isConfigAlready = true
        //   console.log("aijdjkmf",this.currentPickAlgorithm)
        //   this.$emit('saveAlgorithm');

        // }
      }
    },
    cancleAlgorithm() {
      this.$emit('saveAlgorithm')
    },

    checkMarkCorrectAndSave(algoName, areas) {
      var algo = this.needConfigAlgorithms.filter(eachAlgo => eachAlgo.name == algoName)
      var flag = false
      if (areas.length > 0) {
        var lineCount = 0
        var areaCount = 0
        var wallCount = 0
        var forbCount = 0
        areas.forEach(eachArea => {
          var markName = eachArea.name
          if (markName.startsWith('wall')) {
            wallCount++
          } else if (markName.startsWith('forb')) {
            forbCount++
          }
          var points = eachArea.points
          if (points.length == 2) { // 是直线
            lineCount = lineCount + 1
          } else {
            areaCount = areaCount + 1
          }
        })
        if (algo[0].need == 'area') { // 翻墙检测和区域告警
          if (lineCount == 0 && areaCount >= 1) {
            if (algo[0].name == 'stepWallCheck') {
              if (wallCount >= 1 && forbCount >= 1) {
                flag = true
              }
            } else {
              flag = true // 区域告警
            }
          }
        } else {
          if (lineCount >= 1 && areaCount == 0) {
            flag = true
          }
        }
      }
      return flag ? null : algo[0]
    },

    choose(type) {
      this.type = type
    },
    resetTemp() {
      this.start_x = '',
      this.start_y = '',
      this.end_x = '',
      this.end_y = '',
      this.flag = false,
      this.points = [],
      this.type = '',
      this.imageUrl = ''
      this.areas = []
      this.lineCount = 1
      this.wallCount = 1
      this.forbCount = 1
      this.areaCount = 1
      this.markName = ''
      this.historyPoints = []
      this.clearCanvas()
    },
    revoke() {
      if (this.areas.length == 0) {
        // 撤销历史记录的坐标
        if (this.historyPoints.length > 0) {
          var revokeArea = this.historyPoints.pop()
        } else {
          return
        }
      } else {
        revokeArea = this.areas.pop()
      }
      if (revokeArea.name.startsWith('wall')) {
        this.wallCount--
      } else if (revokeArea.name.startsWith('forb')) {
        this.forbCount--
      } else if (revokeArea.name.startsWith('line')){
        this.lineCount--
      } else {
        this.areaCount--
      }
      this.drawAll()
    },
    // 从后端获取的点坐标格式化
    formatHistoryPoints(historyPoints) {
      // 每个坐标按照比列缩小或者放大
      var newPoints = []
      historyPoints.forEach((v) => {
        var vchilds = []
        v.points.forEach((vchild) => {
          vchilds.push({
            x: parseInt(vchild.x / this.ratiox),
            y: parseInt(vchild.y / this.ratioy)
          })
        })
        newPoints.push({
          type: v.type == undefined ? '' : v.type,
          name: v.name,
          points: vchilds
        })
      })
      return newPoints
    },
    formatPoints(points) {
      var newPoints = []
      for (var i = 0; i < points.length; i++) {
        newPoints.push({
          x: parseInt(points[i].x * this.ratiox),
          y: parseInt(points[i].y * this.ratioy)
        })
      }
      return newPoints
    },
    mousedown(event) {
      // 鼠标开始记录坐标
      if (this.isEmpty(this.type)) return
      this.flag = true
      if (this.isEmpty(this.start_x) && this.isEmpty(this.start_y) && this.points.length == 0) {
        this.markName = this.getMarkName()
      }
      if (this.type == 3) {
        // 保存起始点
        this.points.push({
          x: event.offsetX,
          y: event.offsetY
        })
        if (event.button === 2 && this.flag) {
          // 右键结束
          // 保存历史记录多边形
          var tempPoints = this.points
          this.areas.push({
            type: this.value,
            name: this.markName,
            points: tempPoints
          })
          this.points = []
          this.resetTypeAndFlag()
          this.markName = ''
        } else {
          // 画多边形
          this.drawPolygon(this.points)
        }
      } else {
        // 是直线和矩形，只需要两个点
        if (this.isEmpty(this.start_x)) {
          // 第一个点
          this.start_x = event.offsetX
          this.start_y = event.offsetY
        } else {
          // 第二个点复制，并把起点置空
          this.end_x = event.offsetX
          this.end_y = event.offsetY
          if (this.type == 1) {
            // 直线信息
            var tempPoints = []
            tempPoints.push({
              x: this.start_x,
              y: this.start_y
            })
            tempPoints.push({
              x: this.end_x,
              y: this.end_y
            })
            this.areas.push({
              type: '',
              name: this.markName,
              points: tempPoints
            })
            this.resetTypeAndFlag()
          } else if (this.type == 2) {
            // 保存矩形坐标
            var boxs = []
            boxs.push({
              x: this.start_x,
              y: this.start_y
            })
            boxs.push({
              x: this.end_x,
              y: this.start_y
            })
            boxs.push({
              x: this.end_x,
              y: this.end_y
            })
            boxs.push({
              x: this.start_x,
              y: this.end_y
            })
            this.areas.push({
              type: this.value,
              name: this.markName,
              points: boxs
            })
          }
          this.start_x = ''
          this.start_y = ''
          this.resetTypeAndFlag()
        }
      }
    },
    mousemove(event) {
      if (this.isEmpty(this.type)) {
        return
      }
      if (this.type == 1) {
        this.drawLine(event)
      } else if (this.type == 2) {
        this.drawRect(event)
      } else {
        this.drawPolygon(
          this.points.concat({
            x: event.offsetX,
            y: event.offsetY
          })
        )
      }
    },
    chooseAreaGraph(event) {
      // 只有再不画图的时候对click事件做处理
      if (this.flag == false) {
        // 遍历所有的areas、historyPoints显示该图像的坐标点
        var chooseArea = this.getChooseArea(this.areas, event.offsetX, event.offsetY)
        if (chooseArea == null) {
          if (this.historyPoints.length > 0) {
            var chooseHisArea = this.getChooseArea(this.historyPoints, event.offsetX, event.offsetY)
            if (chooseHisArea != null) {
              this.tempChoosePoint = this.formatPoints(chooseHisArea.points)
            } else {
              this.tempChoosePoint = []
            }
          } else {
            this.tempChoosePoint = []
          }
        } else {
          this.tempChoosePoint = this.formatPoints(chooseArea.points)
        }
      }
    },
    // 获取(x,y)坐标在某个标记里的图形是坐标
    getChooseArea(areas, x, y) {
      var resArea = null
      for (var i = 0; i < areas.length; i++) {
        var checkRes = this.chenckInArea2(areas[i], x, y)
        if (checkRes) {
          resArea = areas[i]
          break
        }
      }
      return resArea
    },
    // (x,y)判断的坐标 area某个框图的点集合
    chenckInArea2(area, x, y) {
      var points = area.points
      var i, j
      var inside = false
      var pointSize = points.length
      if (pointSize == 2) {
        return this.inLine(points[0], points[1], x, y)
      }
      for (i = 0, j = pointSize - 1; i < pointSize; j = i++) {
        // 首先判断点是否在线上。如果点在线上，直接返回
        if (this.inLine(points[i], points[j], x, y)) {
          inside = true
          break
        }
        if (((points[i].y > y) != (points[j].y > y)) && (x < (points[j].x - points[i].x) * (y - points[i].y) / (points[j].y - points[i].y) + points[i].x)) {
          inside = !inside
        }
      }
      return inside
    },
    // 判断(x,y)是否在起点为startPoint终点为endPoint的直线上
    inLine(startPoint, endPoint, x, y) {
      if (startPoint.x == endPoint.x) { // 垂直
        if (x == startPoint.x) {
          return true
        } else {
          return false
        }
      } else {
        if (y == parseInt((endPoint.y - startPoint.y) / (endPoint.x - startPoint.x) * (x - startPoint.x) + startPoint.y)) {
          return true
        } else {
          return false
        }
      }
    },
    checkInArea(area, x, y) {
      var points = area.points
      var minx = points[0].x, maxx = points[0].x, miny = points[0].y, maxy = points[0].y
      points.forEach(temp => {
        if (temp.x < minx) {
          minx = temp.x
        }
        if (temp.x > maxx) {
          maxx = temp.x
        }

        if (temp.y < miny) {
          miny = temp.y
        }
        if (temp.y > maxy) {
          maxy = temp.y
        }
      })
      if (x >= minx && x <= maxx && y >= miny && y <= maxy) {
        return true
      } else { return false }
    },
    resetTypeAndFlag() {
      this.type = ''
      this.flag = false
    },
    getMarkName() {
      var name = ''
      if (this.type == 1) {
        name = 'line-' + (this.lineCount++)
        return name
      }
      if (this.currentPickAlgorithm.name=="stepWallCheck"){
        if (this.value == 1) {
          name = 'wall-' + (this.wallCount++)
        } else {
          name = 'forb-' + (this.forbCount++)
        }
      }else{
        name = 'area-' + (this.areaCount++)
      }
      
      return name
    },
    // 先绘制之前的直线、矩形、多边形
    drawAll() {
      // 清除画布，相当于橡皮擦
      const canvas = document.getElementById('myCanvas')
      this.ctx.clearRect(0, 0, canvas.width, canvas.height)
      // 绘制存在的图片
      this.ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height)
      this.ctx.lineWidth = 4
      // 绘制历史图片
      this.drawGraph(this.historyPoints)
      this.drawGraph(this.areas)
    },
    drawGraph(areas) {
      // 绘制已经保存的矩形,value是一个对象，包括x,y,width,height
      areas.forEach((eachArea) => {
        // 设置线条颜色，必须放在绘制之前
        var colour = ''
        if (eachArea.type == '1') {
          // 是墙体
          colour = 'green'
        } else if (eachArea.type == '2') {
          // 禁区
          colour = 'red'
        } else {
          // 直线用蓝颜色
          colour = 'blue'
        }
        this.ctx.lineWidth = 4
        // 写标记名字
        var location = {
          x: eachArea.points[0].x,
          y: eachArea.points[0].y
        }
        if (eachArea.points[1].x < eachArea.points[0].x) {
          location = {
            x: eachArea.points[0].x - 60,
            y: eachArea.points[0].y
          }
        }
        this.markGraph(location, eachArea.name)
        if (eachArea.type == '') {
          // 绘制直线
          this.ctx.beginPath()
          this.ctx.strokeStyle = 'blue'
          this.ctx.moveTo(eachArea.points[0].x, eachArea.points[0].y)
          this.ctx.lineTo(eachArea.points[1].x, eachArea.points[1].y)
          this.ctx.stroke()
        }
        this.drawPolygonMethod(this.ctx, colour, eachArea.points)
      })
    },
    setCanvasColour() {
      if (this.value == '1') {
        // 是墙体
        this.ctx.strokeStyle = 'green'
      } else {
        // 禁区
        this.ctx.strokeStyle = 'red'
      }
    },
    clearCanvas() {
      const canvas = document.getElementById('myCanvas')
      this.ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height)
    },

    drawRect(event) {
      if (this.flag) {
        this.end_x = event.offsetX
        this.end_y = event.offsetY
        const canvas = document.getElementById('myCanvas')
        this.ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.drawAll()
        var colour = ''
        if (this.value == '1') {
          // 是墙体
          colour = 'green'
        } else {
          // 禁区
          colour = 'red'
        }
        // var location={
        //   x:this.start_x,
        //   y:this.start_y
        // }
        // this.markGraph(location,this.markName)
        this.drawRectMethod(
          this.ctx,
          colour,
          this.start_x,
          this.start_y,
          this.end_x - this.start_x,
          this.end_y - this.start_y
        )
      }
    },

    drawPolygon(points) {
      var canvas = document.getElementById('myCanvas')
      if (this.flag) {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.drawAll()
        var colour = ''
        if (this.value == '1') {
          // 是墙体
          colour = 'green'
        } else {
          // 禁区
          colour = 'red'
        }
        var location = {
          x: points[0].x,
          y: points[0].y
        }
        if (points.length >= 2) {
          if (points[1].x < points[0].x) {
            location = {
              x: points[0].x - 60,
              y: points[0].y
            }
          }
        }
        this.markGraph(location, this.markName)
        this.drawPolygonMethod(this.ctx, colour, points)
      }
    },

    drawLine(event) {
      if (this.flag) {
        this.end_x = event.offsetX
        this.end_y = event.offsetY

        const canvas = document.getElementById('myCanvas')
        this.ctx.clearRect(0, 0, canvas.width, canvas.height)
        // 绘制之前保存的一些坐标点
        this.drawAll()
        // 开始绘制
        this.ctx.beginPath()
        // 设置线条颜色，必须放在绘制之前
        this.ctx.strokeStyle = 'blue'
        // 线宽设置，必须放在绘制之前
        this.ctx.lineWidth = 4
        // 进行矩形绘制(矩形左上角的 x 坐标,矩形左上角的 y 坐标，矩形的宽度，矩形的高度)
        var location = {
          x: this.start_x,
          y: this.start_y
        }
        if (this.end_x < this.start_x) { // 向左
          location = {
            x: this.start_x - 60,
            y: this.start_y
          }
        }
        this.markGraph(location, this.markName)
        this.ctx.moveTo(this.start_x, this.start_y)
        this.ctx.lineTo(this.end_x, this.end_y)
        this.ctx.stroke()
      }
    },

    drawLineMethod(ctx, colour, start_x, start_y, end_x, end_y) {
      ctx.strokeStyle = colour
      ctx.beginPath()
      ctx.moveTo(start_x, start_y)
      ctx.lineTo(end_x, end_y)
      ctx.stroke()
    },
    drawRectMethod(ctx, colour, start_x, start_y, width, height) {
      var location = {
        x: start_x,
        y: start_y
      }
      if (width < 0) { // 向左
        location = {
          x: start_x - 60,
          y: start_y
        }
      }
      this.markGraph(location, this.markName)

      ctx.strokeStyle = colour
      ctx.strokeRect(start_x, start_y, width, height)
    },

    drawPolygonMethod(ctx, colour, points) {
      // var location={
      //   x:points[0].x,
      //   y:points[0].y+2
      // }
      // this.markGraph(location,this.markName)
      ctx.strokeStyle = colour
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (var i = 1; i < points.length; i++) {
        this.ctx.lineTo(points[i].x, points[i].y)
      }
      // 从当前点回到起始点的路径
      ctx.closePath()
      // 绘制已经定义的路径
      this.ctx.stroke()
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-input__inner {
  height: 35px;
  line-height: 35px
}
.box {
  width: 100%;
  height: 100%;
  padding: 5px;
  position: relative;
}
.buttoninfo {
  padding-left: 76px;
  width: 100%;
  height: 40px;
  left: 50px;
  margin-bottom: 5px;
}
.buttonSize {
  width: 48px;
  height: 35px;
  padding: 5px 10px;
}
.imageStyle {
  widows: 20px;
  height: 20px;
}
.bg {
  width: 500px;
  height: 500px;
  position: relative;
  background-position: center;
  background: url("../../assets/images/video.jpg");
  background-size: cover;
}
.canvas-box{
    width: 640px;
    margin: 0 auto;
}
canvas {
  border: 1px solid red;
}
.configBtnBox{
    position: relative;
    margin-top: 2px;
    height: 36px;
    .configBtn{
        position: absolute;
        right: 320px;
    }
    .configCancleBtn{
        position: absolute;
        right: 400px;
    }
}

</style>
