<template>
  <div v-loading="pageLoading" class="videomonitorWrap" element-loading-text="拼命加载中">
    <div class="videoMonitor">
      <el-row>
        <el-col :span="12">
          <div class="monitorBox">
            <div v-if="showVideoSetting" class="video-panel">
              <div class="left-part">
                <VideoPlayer v-if="!!flv && activeTab == 'video'" :video-ref="videoRef" :options="videoOptions"/>
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
              </div>
            </div>
            <div v-else>
              <p>请选择添加一个摄像头</p>
              <div class="monitorAddress">
                <span class="displayIB addressText">摄像头地址：</span>
                <el-select class="displayIB"></el-select>
                <el-button class="displayIB" type="primary" @click="sureThis">确定</el-button>
              </div>
            </div>

          </div>
          <div class="censusData">
            <el-row>
              <el-col :span="13">
                <el-table
                  :data="tableData"
                  fit
                  style="width: 100%">
                  <el-table-column
                    prop="date"
                    label="事件"
                    align="center"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="告警次数"
                    align="center"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    align="center"
                    label="占比">
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="10" class="actualData">
                <div class="actualTitle">实时分析</div>
                <div class="streamData">
                  <div class="dataHeader">人流分析</div>
                  <div class="dataTitle">
                    今日累计
                  </div>
                  <div class="dataText">
                    <div class="dataShow displayIB">
                      <p>流入</p>
                      <div>18人</div>
                    </div>
                    <div class="dataShow displayIB">
                      <p>流出</p>
                      <div>12人</div>
                    </div>
                  </div>
                  <div class="dataTitle">
                    实时流量（近一小时）
                  </div>
                  <div class="dataText">
                    <div class="dataShow displayIB">
                      <p>流入</p>
                      <div>18人</div>
                    </div>
                    <div class="dataShow displayIB">
                      <p>流出</p>
                      <div>12人</div>
                    </div>
                  </div>
                </div>
                <div class="streamData">
                  <div class="dataHeader">车流分析</div>
                  <div class="dataTitle">
                    今日累计
                  </div>
                  <div class="dataText">
                    <div class="dataShow displayIB">
                      <p>流入</p>
                      <div>18人</div>
                    </div>
                    <div class="dataShow displayIB">
                      <p>流出</p>
                      <div>12人</div>
                    </div>
                  </div>
                  <div class="dataTitle">
                    实时流量（近一小时）
                  </div>
                  <div class="dataText">
                    <div class="dataShow displayIB">
                      <p>流入</p>
                      <div>18人</div>
                    </div>
                    <div class="dataShow displayIB">
                      <p>流出</p>
                      <div>12人</div>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>

          </div>
        </el-col>
        <el-col :span="12" class="photoBox">
          <div class="showPhoto">
            <span>实时抓拍</span>
            <el-select></el-select>
          </div>
          <div class="photoContainer">
            <div v-for="(o, index) in 12" :key="o" class="photoList">
              <el-card :body-style="{ padding: '0px' }">
                <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" style="width: 100%; height:120px">
                <div style="padding: 14px;">
                  <span>人员</span>
                  <div>2020-08-31  23:00:00 </div>
                </div>
              </el-card>
            </div>
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="page"
              :limit.sync="limit"
              @pagination="pageChange()"
            />
          </div>

        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// import VideoPlayer from '@/components/VideoPlayer'
import Pagination from '@/components/Pagination'
import VideoPlayer from '@/components/VideoPlayer'
export default {
  components: { Pagination, VideoPlayer },
  data() {
    return {
      pageLoading: false,
      total: 10,
      page: 0,
      showVideoSetting: false,
      tableData: [{
        date: '2222',
        name: '111',
        address: '33%'
      }, {
        date: '2222',
        name: '111',
        address: '33%'
      }, {
        date: '2222',
        name: '111',
        address: '33%'
      }, {
        date: '2222',
        name: '111',
        address: '33%'
      }]
    }
  },
  methods: {
    sureThis() {
      this.showVideoSetting = true
    }
  }
}
</script>
<style lang='scss'>
.videomonitorWrap {
  padding: 20px;
  background: #F0F2F5;
  .el-col-12{
    width: 48%;
    margin-right: 2%;
  }
  .displayIB{
    display: inline-block;
  }
  .videoMonitor{
    // padding: 10px 10px;
  }
  .monitorBox{
      height: 330px;
      border: 1px dashed #D9D9D9;
      background: #fff;
      border-radius: 2px;
      position: relative;
      p{
          margin: 24px;
      }
  }
  .monitorAddress{
      width: 440px;
      position:absolute;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%);
     .el-select{
        width: 278px;
        height: 36px;
     }
     .addressText{
        font-size: 14px;
        color: #4A4A4A;
     }
  }
  .censusData{
      margin-top: 20px;
      .el-table__header-wrapper table, .el-table__body-wrapper table{
          width: 100% !important;
      }
      th,td {
        padding: 5px !important;
      }
      .el-table__body, .el-table__footer, .el-table__header{
        table-layout: auto;
      }
  }
  .actualData{
      float: right;
      background: #ffffff;
      padding:0 24px 20px;
      .actualTitle{
          font-size: 16px;
          padding-top:20px;
      }
      .streamData{
          height: 266px;
          border: 1px solid #F0EFEF;
          margin-top: 20px;
      }
      .dataHeader{
          height: 47px;
          line-height: 47px;
          font-size: 16px;
          background: #F0EFEF;
          padding-left: 18px;
          color:rgba(0,0,0,0.85);
      }
      .dataTitle{
          font-size: 14px;
          margin-top: 24px;
          margin-left: 20px;
      }
      .dataText{
          margin-left: 20px;
          margin-top: 5px;
      }
      .dataShow{
          p{
              font-size: 12px;
              color:rgba(0,0,0,0.85);
              margin: 16px 0 7px;
          }
          div{
              font-size: 14px;
          }
      }
  }
  .photoContainer{
      position: relative;
    //   height: 100%;
  }
  .photoBox{
      background: #fff;
      height: 980px;
      .photoList{
          display: inline-block;
          width: 20%;
          margin: 2.5%;
          text-align: center;
      }
  }
  .pagination-container{
    margin-top: 250px;
    .showTotal{
      padding-left: 10px;
    }
  }
//   .video-panel {
//     position: relative;
//     height: 100%;
//   }
  .right-part {
    width: 200px;
    position: absolute;
    right: 0;
    top: 40px;
    background: #fff;
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
}

</style>
