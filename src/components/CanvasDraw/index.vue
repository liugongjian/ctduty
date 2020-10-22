<template>
  <div class="box">
    <div class="buttoninfo">
      <el-tooltip content="画直线">
        <el-button :disabled="type == 1" @click="choose(1)" class="buttonSize">
          <img src="../assets/line.png" class="imageStyle" />
        </el-button>
      </el-tooltip>
      <el-tooltip content="画矩形">
        <el-button :disabled="type == 2" @click="choose(2)" class="buttonSize">
          <img src="../assets/rect.png" class="imageStyle" />
        </el-button>
      </el-tooltip>
      <el-tooltip content="画多边形">
        <el-button :disabled="type == 3" @click="choose(3)" class="buttonSize">
          <img src="../assets/polygon.png" class="imageStyle" />
        </el-button>
      </el-tooltip>

      <span v-show="type==2 || type==3" style="vertical-align:top" >
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
          <el-button @click="revoke" class="buttonSize">
            <img src="../assets/revoke.png" class="imageStyle" />
          </el-button>

        </el-tooltip>
        <el-tooltip content="清除画布" style="margin-left: 10px">
          <!-- <el-button @click="resetTemp"> 清除 </el-button> -->
          <el-button @click="resetTemp" class="buttonSize">
            <img src="../assets/clear.png" class="imageStyle" />
          </el-button>
        </el-tooltip>
      </span>
    </div>

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
      @click='chooseAreaGraph'
    ></canvas>
    <div v-if="tempChoosePoint.length>0" >
      <h6>当前选中坐标: {{tempChoosePoint}}</h6>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      start_x: "",
      start_y: "",
      end_x: "",
      end_y: "",
      flag: false,
      points: [],
      type: "",
      options: [
        { value: "1", label: "墙体" },
        { value: "2", label: "禁区" },
      ],
      value: "1", //默认标记类型是墙体
      imageUrl: "",
      image: new Image(),
      areas: [],
      ratiox: "",
      ratioy: "",
      historyPoints: [],
      wallCount:1,
      forbCount:1,
      lineCount:1,
      markName:"",
      tempChoosePoint:[]
    };
  },
//   props: ["deviceId","algorithm"],
  async mounted() {
    // console.log("xxxx从父组件传值到子组件xxxx",this.deviceId,this.algorithm)
    //页面渲染之后
    const canvas = document.getElementById("myCanvas");
    this.ctx = canvas.getContext("2d");
    //初始化画布
    // 设置字体
    this.ctx.font = "24px bold 黑体";
    // 设置颜色
    this.ctx.fillStyle = "black";
    // 设置水平对齐方式
    this.ctx.textAlign = "center";
    // 设置垂直对齐方式
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("图片正在加载中", 300, 200);
    // let {data:res} = await this.$http.get(`${baseUrl}/device/snapshot/`+this.deviceId)
    let { data: res } = await client.getImageByDeviceId(this.deviceId);
    var imageValue = "data:image/png;base64," + res;

// 创建对象
    var img = new Image();
    // 改变图片的src
    img.src = imageValue;

    //调用这个摄像头的标注信息
    this.historyPoints = [
      {
        type: "1",
        name:"wall-1",
        points: [
          {
            x: 67,
            y: 75,
          },
          {
            x: 67,
            y: 207,
          },
          {
            x: 716,
            y: 207,
          },
          {
            x: 716,
            y: 75,
          },
        ],
      },
    ];

    //加载完成执行
    var that = this;
    img.onload = loadImageSuccess;
    function loadImageSuccess() {
      that.ctx.clearRect(0, 0, canvas.width, canvas.height);
      that.ratiox = img.width / canvas.width;
      that.ratioy = img.height / canvas.height;
      that.ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      var newHistoryPoints = that.formatHistoryPoints(that.historyPoints);
      that.drawGraph(newHistoryPoints);
    }
    this.image = img;
    //右键菜单禁用
    canvas.oncontextmenu = function () {
      window.event.returnValue = false;
    };
  },
  created() {
    //页面没有渲染之前
  },
  methods: {
    isEmpty(obj) {
      if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
      } else {
        return false;
      }
    },
    //location是每个图形的起始点
    markGraph(location,content){
      //  this.ctx.font = "24px bold 黑体";
      //  this.ctx.fillStyle = "black";
      //以这个起点画一个小矩形
       this.ctx.fillStyle="gray";
       this.ctx.fillRect(location.x,location.y,60,20)
       this.ctx.fillStyle="white";
       this.ctx.textBaseline="top";
       this.ctx.font = "12px Arial";
       this.ctx.fillText(content, location.x+30, location.y+5);
    },
    choose(type) {
      this.type = type;
    },
    resetTemp() {
      this.start_x = "",
      this.start_y = "",
      this.end_x = "",
      this.end_y = "",
      this.flag = false,
      this.points = [],
      this.type = "",
      this.imageUrl = "";
      this.areas = [];
      this.lineCount = 1;
      this.wallCount = 1;
      this.forbCount = 1;
      this.markName = "";
      this.historyPoints = [];
      this.clearCanvas();
    },
    revoke() {
      if(this.areas.length==0)
        return
      var revokeArea=this.areas.pop();
      if(revokeArea.name.startsWith("wall")){
        this.wallCount--
      }else if(revokeArea.name.startsWith("forb")){
        this.forbCount--
      }else{
        this.lineCount--
      }
      this.$store.state.tempAllPoints.pop();
      this.drawAll();
    },
    //从后端获取的点坐标格式化
    formatHistoryPoints(historyPoints) {
      //每个坐标按照比列缩小或者放大
      var newPoints = [];
      historyPoints.forEach((v) => {
        var vchilds = [];
        v.points.forEach((vchild) => {
          vchilds.push({
            x: parseInt(vchild.x / this.ratiox),
            y: parseInt(vchild.y / this.ratioy),
          });
        });
        newPoints.push({
          type: v.type,
          name: "his-"+v.name,
          points: vchilds,
        });
      });
      return newPoints;
    },
    formatPoints(points) {
      var newPoints = [];
      for (var i = 0; i < points.length; i++) {
        newPoints.push({
          x: parseInt(points[i].x * this.ratiox),
          y: parseInt(points[i].y * this.ratioy),
        });
      }
      return newPoints;
    },
    mousedown(event) {
      // 鼠标开始记录坐标
      if (this.isEmpty(this.type)) return;
      this.flag = true;
      if(this.isEmpty(this.start_x) && this.isEmpty(this.start_y) && this.points.length==0){
        this.markName=this.getMarkName();
      }
      if (this.type == 3) {
        //保存起始点
        this.points.push({
          x: event.offsetX,
          y: event.offsetY,
        });
        if (event.button === 2 && this.flag) {
          //右键结束
          //保存历史记录多边形
          var tempPoints = this.points;
          this.areas.push({
            type: this.value,
            name: this.markName,
            points: tempPoints,
          });
          var newPoints = this.formatPoints(tempPoints);
          this.$store.state.tempAllPoints.push({
            type: this.value,
            name: this.markName,
            points: newPoints,
          });
          this.points = [];
          this.resetTypeAndFlag();
          this.markName=""
        } else {
          //画多边形
          this.drawPolygon(this.points);
        }
      } else {
        //是直线和矩形，只需要两个点
        if (this.isEmpty(this.start_x)) {
          //第一个点
          this.start_x = event.offsetX;
          this.start_y = event.offsetY;
        } else {
          //第二个点复制，并把起点置空
          this.end_x = event.offsetX;
          this.end_y = event.offsetY;
          if (this.type == 1) {
            //直线信息
            var tempPoints = [];
            tempPoints.push({
              x: this.start_x,
              y: this.start_y,
            });
            tempPoints.push({
              x: this.end_x,
              y: this.end_y,
            });
            this.areas.push({
              type: "",
              name: this.markName,
              points: tempPoints,
            });
            var newPoints = this.formatPoints(tempPoints);
            this.$store.state.tempAllPoints.push({
              type: this.value,
              name: this.markName,
              points: newPoints,
            });
            this.resetTypeAndFlag();

          } else if (this.type == 2) {
            // 保存矩形坐标
            var boxs = [];
            boxs.push({
              x: this.start_x,
              y: this.start_y,
            });
            boxs.push({
              x: this.end_x,
              y: this.start_y,
            });
            boxs.push({
              x: this.end_x,
              y: this.end_y,
            });
            boxs.push({
              x: this.start_x,
              y: this.end_y,
            });
           
           
            this.areas.push({
              type: this.value,
              name: this.markName,
              points: boxs,
            });
            var newPoints = this.formatPoints(boxs);
            this.$store.state.tempAllPoints.push({
              type: this.value,
              name: this.markName,
              points: newPoints,
            });
          }
          this.start_x = "";
          this.start_y = "";
          this.resetTypeAndFlag();
        }
      }
    },
    mousemove(event) {
      if (this.isEmpty(this.type)) {
        return;
      }
      if (this.type == 1) {
        this.drawLine(event);
      } else if (this.type == 2) {
        this.drawRect(event);
      } else {
        this.drawPolygon(
          this.points.concat({
            x: event.offsetX,
            y: event.offsetY,
          })
        );
      }
    },
    chooseAreaGraph(event){
      //只有再不画图的时候对click事件做处理
      console.log("进入该click方法")
      if(this.flag==false){
        //遍历所有的areas、historyPoints显示该图像的坐标点
        var chooseArea=this.getChooseArea(this.areas,event.offsetX,event.offsetY)
        if(chooseArea==null){
          if(this.historyPoints.length>0){
            var canvasHisAreas=this.formatHistoryPoints(this.historyPoints)
            var chooseHisArea=this.getChooseArea(canvasHisAreas,event.offsetX,event.offsetY)
            if(chooseHisArea!=null){
              this.tempChoosePoint=this.formatPoints(chooseHisArea.points)
            }else{
              this.tempChoosePoint=[]
            }
          }else{
            this.tempChoosePoint=[]
          }
        }else{
          this.tempChoosePoint=this.formatPoints(chooseArea.points)
        }
        
      }
    },
    //获取(x,y)坐标在某个标记里的图形是坐标
    getChooseArea(areas,x,y){
       var resArea=null
       for(var i=0;i<areas.length;i++){
         var checkRes=this.chenckInArea2(areas[i],x,y)
          if(checkRes){
            resArea=areas[i]
            break
          }
       }
       return resArea
    },  
    //(x,y)判断的坐标 area某个框图的点集合
    chenckInArea2(area,x,y){
      var points=area.points
      var i,j
      var inside=false
      var pointSize=points.length
      if(pointSize==2){
        return this.inLine(points[0],points[1],x,y)
      }
      for(i=0,j=pointSize-1;i<pointSize;j=i++){
        //首先判断点是否在线上。如果点在线上，直接返回
        if(this.inLine(points[i],points[j],x,y)){
          inside=true
          break
        }
        if(((points[i].y>y)!=(points[j].y>y)) && (x < (points[j].x-points[i].x)*(y-points[i].y)/(points[j].y-points[i].y)+points[i].x)){
          inside = !inside
        } 
      }
      return inside
    },
    //判断(x,y)是否在起点为startPoint终点为endPoint的直线上
    inLine(startPoint,endPoint,x,y){
      if(startPoint.x==endPoint.x){//垂直
        if(x==startPoint.x){
          return true
        }else{
          return false
        }
      }else{
        if(y==(endPoint.y-startPoint.y)/(endPoint.x-startPoint.x)*(x-startPoint.x)+startPoint.y){
          return true
        }else{
          return false
        }
      }
    },
    checkInArea(area,x,y){
      console.log("area==>",area)
      var points=area.points
      var minx=points[0].x,maxx=points[0].x,miny=points[0].y,maxy=points[0].y
      console.log("最大最小值start",minx,maxx,miny,maxy,"最大最小值end")
      console.log("x--",x,"y--",y)
      points.forEach(temp=>{
        if(temp.x<minx){
          minx=temp.x
        }
        if(temp.x>maxx){
          maxx=temp.x
        }

        if(temp.y<miny){
          miny=temp.y
        }
        if(temp.y>maxy){
          maxy=temp.y
        }
      })
      console.log("找到最大最小值start",minx,maxx,miny,maxy,"找到最大最小值end")
      if(x>=minx && x<=maxx && y>=miny && y<=maxy){
        return true
      }else
        return false

    },
    resetTypeAndFlag(){
      this.type=""
      this.flag=false
    },
    getMarkName(){
        var name=""
        if(this.type==1){
          name="line-"+(this.lineCount++)
          return name
        }
        if(this.value==1){
          name="wall-"+(this.wallCount++)
        }else{
          name="forb-"+(this.forbCount++)
        }
        return name
    },
    //先绘制之前的直线、矩形、多边形
    drawAll() {
      // 清除画布，相当于橡皮擦
      const canvas = document.getElementById("myCanvas");
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      //绘制存在的图片
      this.ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
      this.ctx.lineWidth = 4;
      //绘制历史图片
      this.drawGraph(this.formatHistoryPoints(this.historyPoints));
      this.drawGraph(this.areas);
    },
    drawGraph(areas) {
      //绘制已经保存的矩形,value是一个对象，包括x,y,width,height
      areas.forEach((eachArea) => {
        //设置线条颜色，必须放在绘制之前
        var colour = "";
        if (eachArea.type == "1") {
          //是墙体
          colour = "green";
        } else if (eachArea.type == "2") {
          //禁区
          colour = "red";
        } else {
          //直线用蓝颜色
          colour = "blue";
        }
        this.ctx.lineWidth = 4;
        //写标记名字
        var location={
          x:eachArea.points[0].x,
          y:eachArea.points[0].y
        }
        if(eachArea.points[1].x<eachArea.points[0].x){
          location={
            x:eachArea.points[0].x-60,
            y:eachArea.points[0].y
          }
        }
        this.markGraph(location,eachArea.name)
        if (eachArea.type == "") {
          //绘制直线
          this.ctx.beginPath();
          this.ctx.strokeStyle = "blue";
          this.ctx.moveTo(eachArea.points[0].x, eachArea.points[0].y);
          this.ctx.lineTo(eachArea.points[1].x, eachArea.points[1].y);
          this.ctx.stroke();
        }
        this.drawPolygonMethod(this.ctx, colour, eachArea.points);
      });
    },
    setCanvasColour() {
      if (this.value == "1") {
        //是墙体
        this.ctx.strokeStyle = "green";
      } else {
        //禁区
        this.ctx.strokeStyle = "red";
      }
    },
    clearCanvas() {
      const canvas = document.getElementById("myCanvas");
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
    },

    drawRect(event) {
      if (this.flag) {
        this.end_x = event.offsetX;
        this.end_y = event.offsetY;
        const canvas = document.getElementById("myCanvas");
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawAll();
        var colour = "";
        if (this.value == "1") {
          //是墙体
          colour = "green";
        } else {
          //禁区
          colour = "red";
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
        );
      }
    },

    drawPolygon(points) {
      var canvas = document.getElementById("myCanvas");
      if (this.flag) {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawAll();
        var colour = "";
        if (this.value == "1") {
          //是墙体
          colour = "green";
        } else {
          //禁区
          colour = "red";
        }
        var location={
          x:points[0].x,
          y:points[0].y
        }
        if(points.length>=2){
          if(points[1].x<points[0].x){
            location={
              x:points[0].x-60,
              y:points[0].y
            }
          }
        }
        this.markGraph(location,this.markName)
        this.drawPolygonMethod(this.ctx, colour, points);
      }
    },

    drawLine(event) {
      if (this.flag) {
        this.end_x = event.offsetX;
        this.end_y = event.offsetY;

        const canvas = document.getElementById("myCanvas");
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        //绘制之前保存的一些坐标点
        this.drawAll();
        // 开始绘制
        this.ctx.beginPath();
        //设置线条颜色，必须放在绘制之前
        this.ctx.strokeStyle = "blue";
        // 线宽设置，必须放在绘制之前
        this.ctx.lineWidth = 4;
        // 进行矩形绘制(矩形左上角的 x 坐标,矩形左上角的 y 坐标，矩形的宽度，矩形的高度)
        var location={
          x:this.start_x,
          y:this.start_y
        }
        if(this.end_x<this.start_x){//向左
          location={
            x:this.start_x-60,
            y:this.start_y
          }
        }
        this.markGraph(location,this.markName)
        this.ctx.moveTo(this.start_x, this.start_y);
        this.ctx.lineTo(this.end_x, this.end_y);
        this.ctx.stroke();
      }
    },

    drawLineMethod(ctx, colour, start_x, start_y, end_x, end_y) {
      ctx.strokeStyle = colour;
      ctx.beginPath();
      ctx.moveTo(start_x, start_y);
      ctx.lineTo(end_x, end_y);
      ctx.stroke();
    },
    drawRectMethod(ctx, colour, start_x, start_y, width, height) {
      console.log("width,height------",width,height)
      var location={
          x:start_x,
          y:start_y
        }
      if(width<0){//向左
        location={
          x:start_x-60,
          y:start_y
        }
      }
      this.markGraph(location,this.markName)


      ctx.strokeStyle = colour;
      ctx.strokeRect(start_x, start_y, width, height);
    },

    drawPolygonMethod(ctx, colour, points) {
      // var location={
      //   x:points[0].x,
      //   y:points[0].y+2
      // }
      // this.markGraph(location,this.markName)
      ctx.strokeStyle = colour;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (var i = 1; i < points.length; i++) {
        this.ctx.lineTo(points[i].x, points[i].y);
      }
      //从当前点回到起始点的路径
      ctx.closePath();
      //绘制已经定义的路径
      this.ctx.stroke();
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.el-input__inner {
  height: 35px; 
  line-height: 35px
}
.box {
  width: 100%;
  height: 100%;
}
.buttoninfo {
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
  background-size: cover;
}
canvas {
  border: 1px solid red;
}

</style>
