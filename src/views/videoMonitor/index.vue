<template>
  <div v-loading="pageLoading" class="videomonitorWrap" element-loading-text="拼命加载中">
    <!-- <el-dialog
      key="monitor-device"
      :title="cameraId ? '修改监控摄像头' : '添加监控摄像头' "
      :visible.sync="deviceChosenVisible"
      width="540px"
      @closed="onClose"
    >
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="摄像头名称" prop="cameraId" label-width="100px">
          <el-select
            v-model="form.cameraId"
            :remote-method="getCameraList"
            :loading="loading"
            filterable
            remote
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
          </el-option></el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button :loading="submiting" type="warning" @click="saveMonitor">确 定</el-button>
      </div>
    </el-dialog>-->
    <el-dialog
      key="photo"
      :visible.sync="bigPhotoVisible"
      title="抓拍照片"
      width="300px"
      style="text-align:center;"
    >
      <el-image :src="curPhoto" class="photoList-image" style="max-width:100%;" />
    </el-dialog>
    <div class="videoMonitor">
      <div class="leftPanel">
        <div class="leftContent">
          <div class="monitorBox">
            <div class="video-panel">
              <div :style="{height: heightByAuto}" class="left-part">
                <VideoPlayer
                  v-if="videoOptions.sources && videoOptions.sources[0].src"
                  :video-ref="cameraId"
                  :key="cameraId"
                  :options="videoOptions"
                />
                <div
                  v-else
                  style="width:100%;height:100%;background-color:#D9D9D9;text-align:center;position:relative;"
                >
                  <el-image
                    :src="nosrc"
                    style="position:absolute;width:138px;height:30px;object-fit:contain;top:50%;left:50%;
                  transform:translate(-50%,-50%);"
                  ></el-image>
                </div>
              </div>

              <!-- v-if="!!flv && activeTab == 'video'" -->
              <!-- :video-ref="videoRef" -->
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
            <div class="screenBottom">
              {{ cameraName }}
              <span class="screenBottom-op">
                <a title="算法配置" @click="gotoAiConfig">
                  <svg-icon icon-class="aiConfig" />
                </a>
                <!-- <a @click="deviceChosenVisible=true"><svg-icon icon-class="edit"/></a> -->
              </span>
            </div>

            <!-- <div v-else>
              <p>请选择添加一个摄像头</p>
              <div class="monitorAddress">
                <span class="displayIB addressText">摄像头地址：</span>
                <el-select class="displayIB"></el-select>
                <el-button class="displayIB" type="primary" @click="sureThis">确定</el-button>
              </div>
            </div>-->
          </div>
          <div class="censusData">
            <div class="alertTable">
              <div class="panelTitle">统计分析</div>
              <!-- :header-cell-style="{ background: '#ecedee', color: '#717171' }" -->
              <el-table :data="algorithmTblData">
                <el-table-column
                  :show-overflow-tooltip="true"
                  label="智能算法"
                  prop="realHead"
                  width="100"
                  align="center"
                  fixed
                >
                  <!-- <template slot-scope="scope">告警次数</template> -->
                </el-table-column>
                <!-- 根据返回算法渲染列 -->
                <el-table-column
                  v-for="item in tableColumn"
                  :key="item.id"
                  :prop="item.name"
                  :label="item.name"
                  align="center"
                  min-width="125"
                  width="125"
                >
                  <!-- <template slot-scope="scope"> {{ getCountByName(scope.row.taskCount, item.name) }}</template> -->
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="rightPanel">
        <div class="realTimeData">
          <div class="panelTitle">实时分析</div>
          <div class="streamData-wrapper">
            <div class="streamData">
              <div class="dataHeader"></div>
              <div class="dataPanel">
                <div class="dataTitle">今日累计</div>
                <div class="dataText">
                  <div class="dataShow displayIB">
                    <p>流入</p>
                  </div>
                  <div class="dataShow displayIB">
                    <p>流出</p>
                  </div>
                </div>
              </div>
              <div class="dataPanel">
                <div class="dataTitle">实时流量（近一小时）</div>
                <div class="dataText">
                  <div class="dataShow displayIB">
                    <p>流入</p>
                  </div>
                  <div class="dataShow displayIB">
                    <p>流出</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="streamData">
              <div class="dataHeader">人流分析</div>
              <div class="dataPanel">
                <div class="dataText">
                  <div class="dataShow displayIB">
                    <div>0人</div>
                  </div>
                  <div class="dataShow displayIB">
                    <div>0人</div>
                  </div>
                </div>
              </div>
              <div class="dataPanel">
                <div class="dataText">
                  <div class="dataShow displayIB">
                    <div>0人</div>
                  </div>
                  <div class="dataShow displayIB">
                    <div>0人</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="streamData">
              <div class="dataHeader">车流分析</div>
              <div class="dataPanel">
                <!-- <div class="dataTitle">
                  今日累计
                </div>-->
                <div class="dataText">
                  <div class="dataShow displayIB">
                    <!-- <p>流入</p> -->
                    <div>0辆</div>
                  </div>
                  <div class="dataShow displayIB">
                    <!-- <p>流出</p> -->
                    <div>0辆</div>
                  </div>
                </div>
              </div>
              <div class="dataPanel">
                <!-- <div class="dataTitle">
                  实时流量（近一小时）
                </div>-->
                <div class="dataText">
                  <div class="dataShow displayIB">
                    <!-- <p>流入</p> -->
                    <div>0辆</div>
                  </div>
                  <div class="dataShow displayIB">
                    <!-- <p>流出</p> -->
                    <div>0辆</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="photoBox">
          <div class="showPhoto">
            <span>今日实时抓拍</span>
            <el-select
              v-model="taskId"
              collapse-tags
              clearable
              class="photo-fitler-sel"
              size="mini"
              multiple
            >
              <el-option
                v-for="item in taskData"
                :key="item.id"
                :label="item.cnName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div
            v-loading="photosLoading"
            v-if="photoCardList && photoCardList.length > 0"
            class="photoContainer"
          >
            <div v-for="(item) in photoCardList" :key="item.id" class="photoList">
              <div v-if="item.myPlaceholder" style="opacity:0"></div>
              <el-card v-else :body-style="{ padding: '0px' }">
                <el-image
                  :src="item.imageCut"
                  style="width: 100%; height:120px;"
                  class="photoList-image"
                  @click="bigPhotoVisible = true; curPhoto = item.imageCut"
                />
                <div style="padding: 14px;">
                  <span>{{ getTaskById(item.taskId) }}</span>
                  <div>{{ getDateTimeStr(item.createTime) }}</div>
                </div>
              </el-card>
            </div>
          </div>
          <div v-else class="photoContainer">
            <div class="photoContainer-noData-text">暂无数据</div>
          </div>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="page"
            :limit.sync="limit"
            small
            @pagination="pageChange()"
          />
          <!-- <el-pagination
            v-show="total>0"
            :total="total"
            :page.sync="page"
            :limit.sync="limit"
            small
            layout="prev, pager, next">
          </el-pagination>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { getAlertStatics } from "@/api/dashboard";
import Pagination from "@/components/Pagination";
import VideoPlayer from "@/components/VideoPlayer";
import { getAlertInfos } from "@/api/alarm";
import { fetchAllCameraList, searchCameraList } from "@/api/camera";
import { taskList } from "@/api/algorithm";
import { play } from "@/api/monitor";
import nosrc from "@/assets/images/nosrc.png";

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
const timeFormat = "MM-DD HH:mm:ss";
export default {
  components: { Pagination, VideoPlayer },
  data() {
    return {
      cameraId: "", // '64010106001324014975', //61010010001320014342
      cameraName: "-",
      taskId: "",
      // form: {},
      // loading: false,
      // rules: {
      //   cameraId: [
      //     { required: true, message: '请选择摄像头名称', trigger: 'change' }
      //   ]
      // },
      deviceChosenVisible: false,
      bigPhotoVisible: false,
      curPhoto: "",
      nosrc,
      taskData: [],
      // algorithmTblData: [],
      photosLoading: false,
      photoCardList: [],
      pageLoading: false,
      total: 10,
      page: 0,
      limit: 10,
      showVideoSetting: false,
      videoOptions: {
        autoplay: true,
        controls: true,
        autoDisable: true
        // width: 960, // 播放器宽度
        // height: 480 // 播放器高度
      },
      tableColumn: [],
      tableData: [],
      heightByAuto: "",
      slide: 0
    };
  },
  computed: {
    algorithmTblData() {
      if (this.tableColumn) {
        const alertTotal = this.tableData[0] && this.tableData[0].alertCount;
        // const realTableData = []
        const row1 = { realHead: "触发次数" };
        const row2 = { realHead: "占比" };
        const row3 = { realHead: "是否配置" };
        this.tableColumn.forEach(({ id, name, applied, count }) => {
          row1[name] = count;
          row2[name] = count
            ? ((count * 100) / alertTotal).toFixed(2) + "%"
            : "0%";
          row3[name] = applied ? "是" : "否";
        });
        return [row1, row2, row3];
      } else return [];
    }
  },
  watch: {
    taskId(taskId) {
      this.getPhotoList(taskId);
    },
    videoOptions(v) {
      // v.map(item => {
      //   this.allCameraList.forEach(one => {
      //     if (one.id === item.cameraId) {
      //       item.name = one.name
      //     }
      //   })
      // })
      this.$nextTick(() => {
        const boxHeight = document.querySelector(".video-panel").offsetHeight;
        console.log("test---->", boxHeight);
        this.heightByAuto = boxHeight + "px";
      });
    }
  },
  async created() {
    const { cameraId } = this.$route.query;
    this.cameraId = cameraId;
    this.$nextTick(() => {
      this.getTaskList();
      this.getPhotoList();
      this.getAlertDetailList();
      this.getLiveStream();
      this.getCameraById();
      console.log("crreated", this.$route);
    });
  },
  mounted() {
    // this.cameraId = this.$route.params.cameraId
    console.log("mounted", this.$route);
    window.onresize = () => {
      const boxHeight = document.querySelector(".video-panel").offsetHeight;
      console.log("test---->", boxHeight);
      this.heightByAuto = boxHeight + "px";
    };
  },
  methods: {
    saveMonitor() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.submiting = true;
          console.log("form", this.form);
        } else {
          return false;
        }
      });
    },
    getCameraById() {
      const { cameraId } = this.$route.query;
      if (cameraId) {
        this.loading = true;
        const params = {
          cascade: true,
          page: {
            index: 1,
            size: 10
          },
          params: [
            {
              field: "id",
              operator: "EQUALS",
              value: cameraId
            }
          ]
        };
        searchCameraList(params).then(res => {
          const data = res.body.data || [];
          // 已添加到九宫格的摄像头要过滤掉
          console.log("获取摄像头信息", data[0]);
          const { name } = data[0];
          this.cameraName = name;
        });
      } else {
        this.cameraName = "-";
      }
    },
    getCameraList(keyword) {
      if (keyword !== "") {
        this.loading = true;
        const params = {
          cascade: true,
          page: {
            index: 1,
            size: 20
          },
          params: [
            {
              field: "name",
              operator: "LIKE",
              value: `%${keyword}%`
            },
            {
              field: "online",
              operator: "EQUALS",
              value: 0
            }
          ]
        };
        searchCameraList(params).then(res => {
          let data = res.body.data || [];
          // 已添加到九宫格的摄像头要过滤掉
          data = data.filter(
            i => !this.deviceList.find(r => r.cameraId === i.id)
          );
          this.options = data.map(item => {
            return {
              value: item.id,
              label: item.address,
              name: item.name
            };
          });
          this.loading = false;
        });
      } else {
        this.options = [];
      }
    },
    onClose() {
      this.$refs["ruleForm"].resetFields();
      this.submiting = false;
      this.form = {};
      this.dialogFormVisible = false;
      this.id = null;
    },
    gotoAiConfig() {
      this.$router.push("/algorithmconfig");
    },
    sureThis() {
      this.showVideoSetting = true;
    },
    getTaskById(id) {
      const target = this.taskData.find(item => item.id === id);
      return target.cnName;
    },
    getTaskList() {
      const query = {
        cascade: true,
        page: {
          index: 1,
          size: 100
        },
        params: {}
      };
      taskList(query)
        .then(res => {
          if (res.code === 0) {
            this.taskData = res.body.data;
            //   this.algorithmId = res.body.data[0].id
            // this. = false
          } else {
            this.taskData = [];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    pageChange(e) {
      console.log("change");
      //   this.currentTab = e.label
      //   const s = e.label + ' ' + this.startTime + ':00'
      //   const end = e.label + ' ' + this.endTime + ':00'
      //   const h = this.formInline.typeValue
      //   this.page = 1
      this.getPhotoList();
    },
    getDateTimeStr(time) {
      return moment(time).format(timeFormat);
    },
    getPhotoList() {
      this.photosLoading = true;
      const { cameraId } = this.$route.query;
      const param = [
        {
          field: "createTime",
          operator: "BETWEEN",
          value: {
            start: moment()
              .startOf("day")
              .format(dateTimeFormat),
            end: moment()
              .endOf("day")
              .format(dateTimeFormat)
          }
        },
        {
          field: "cameraId",
          operator: "EQUALS",
          value: cameraId
        }
      ];
      if (this.taskId && this.taskId.length) {
        param.push({
          field: "taskId",
          operator: "IN",
          value: [...this.taskId]
        });
      }
      const params = {
        cascade: true,
        page: {
          index: this.page,
          size: this.limit
        },
        params: param,
        sorts: [
          {
            field: "create_Time",
            type: "desc"
          }
        ]
      };
      getAlertInfos(params)
        .then(res => {
          const {
            body: {
              data,
              page: { total }
            }
          } = res;
          this.photoCardList = data;
          this.total = total;
          this.photosLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.photosLoading = false;
        });
    },
    getCountByName(taskCount, name) {
      for (const item of taskCount) {
        if (item.name === name) {
          return item.count;
        }
      }
      return "-";
    },
    getAlertDetailList() {
      const { cameraId } = this.$route.query;
      this.pageLoading = true;
      const query = {
        page: {
          index: 1,
          size: 10
        },
        params: {
          id: cameraId
        }
        // sorts: [{ field: 'create_time', type: 'desc' }]
      };
      getAlertStatics(query).then(res => {
        if (res.code !== 0) return;
        this.tableData = res.body.data;
        this.tableColumn = res.body.data[0] ? res.body.data[0].taskCount : [];
        // this.total = res.body.page.total
      });
    },
    getLiveStream() {
      this.pageLoading = true;
      const { cameraId } = this.$route.query;
      play(cameraId, {
        type: 2
      })
        .then(res => {
          const data = res.body.data || [];
          // const xx = {
          //     ...data,
          //     image: null,
          //     flvSrc: data.rtmpuri,
          console.log("视频流--------", data.rtmpuri);
          this.videoOptions = {
            autoplay: true,
            controls: true,
            width: 400, // 播放器宽度
            height: 300, // 播放器高度
            // poster: 'http://www.jq22.com/demo/vide7.1.0201807161136/m.jpg',
            fluid: true, // 流体布局，自动充满，并保持播放其比例
            sources: [
              {
                src: data.rtmpuri ? data.rtmpuri + "&a.flv" : "",
                type: this.video_type(
                  data.rtmpuri ? data.rtmpuri + "&a.flv" : ""
                )
              }
            ]
          };
          // }
          this.pageLoading = false;
        })
        .catch(err => {
          this.$message(err.message || "获取摄像头播放流失败.");
          this.pageLoading = false;
        });
    },
    video_type(_url) {
      var url = _url.toLowerCase();
      if (url.startsWith("rtmp")) {
        return "rtmp/flv";
      } else if (url.endsWith("m3u8") || url.endsWith("m3u")) {
        return "application/x-mpegURL";
      } else if (url.endsWith("webm")) {
        return "video/webm";
      } else if (url.endsWith("mp4")) {
        return "video/mp4";
      } else if (url.endsWith("ogv")) {
        return "video/ogg";
      } else if (url.endsWith("hls")) {
        return "application/x-mpegURL";
      }
    }
  }
};
</script>
<style lang='scss'>
#app {
  min-height: 100% !important;
  height: 100% !important;
  .openSidebar {
    height: 100%;
  }
  .hideSidebar {
    height: 100%;
  }
}
.videomonitorWrap {
  .el-dialog {
    .el-dialog__header {
      text-align: left;
    }
    .photoList-image {
      img {
        object-fit: contain;
      }
    }
  }

  padding: 20px;
  height: 100%;
  background: #f0f2f5;
  .displayIB {
    display: inline-block;
  }
  .panelTitle {
    font-size: 16px;
    padding-bottom: 20px;
  }
  .videoMonitor {
    display: flex;
    height: 100%;
    .leftPanel {
      width: 600px;
      flex-grow: 2;
      flex-shrink: 1;
      .leftContent {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
      }
      .monitorBox {
        // height: 330px;
        height: 50%;
        // min-height: 200px;
        width: 100%;
        flex-grow: 1;
        flex-shrink: 1;
        // border: 1px dashed #D9D9D9;
        background: #fff;
        border-radius: 2px;
        position: relative;
        .left-part {
          width: calc(100% - 200px);
        }
        p {
          margin: 24px;
        }
      }
    }
    .rightPanel {
      width: 600px;
      height: 100%;
      flex-grow: 1;
      flex-shrink: 1.5;
      display: flex;
      flex-direction: column;
      .realTimeData {
        // flex-grow: 1;
        // width:50%;
        height: 190px;
        margin-left: 20px;
        background: #ffffff;
        padding: 20px;
        .panelTitle {
          padding-bottom: 10px;
        }
        .streamData {
          width: 100%;
          display: table;
          // border: 1px solid #F0EFEF;
        }
        .dataHeader {
          display: table-cell;
          width: 20%;
          min-width: 90px;
          height: 30px;
          line-height: 30px;
          // font-size: 14px;
          // background: #F0EFEF;
          padding-left: 18px;
          color: rgba(0, 0, 0, 0.85);
          // 注意回退
          padding-top: 10px;
          font-size: 16px;
        }
        .dataPanel {
          display: table-cell;
          width: 40%;
          .dataTitle {
            font-size: 14px;
            margin-left: 20px;
          }
          .dataText {
            margin-left: 20px;
          }
          .dataShow {
            width: 40%;
            p {
              font-size: 12px;
              color: rgba(0, 0, 0, 0.85);
              margin: 10px 0 0px;
            }
            div {
              font-size: 14px;
            }
          }
        }
      }
    }
    .photoBox {
      flex-grow: 1;
      flex-shrink: 1;
      position: relative;
      background: #fff;
      width: calc(100% - 20px);
      height: calc(100% - 340px);
      // min-height: 200px;
      margin: 20px 20px 0 20px;
      // height:100%;
      padding: 20px;
      .showPhoto {
        height: 40px;
        line-height: 28px;
        font-size: 16px;
        position: relative;
        .photo-fitler-sel {
          width: 180px;
          position: absolute;
          right: 0;
        }
      }
      .photoContainer {
        display: flex;
        max-height: calc(100% - 80px);
        overflow-y: auto;
        flex-wrap: wrap;
        // justify-content: space-between;
        align-items: flex-start;
        .photoList-image {
          img {
            object-fit: contain;
            background-color: #f5f7fa;
          }
        }
        .photoList-image:hover {
          cursor: zoom-in;
        }
        @media screen and (max-width: 1400px) {
          .photoList {
            // display: inline-block;
            width: 31%;
            height: 180px;
            margin-bottom: 20px;
            margin-right: 2%;
          }
        }
        @media screen and (min-width: 1401px) and (max-width: 1600px) {
          .photoList {
            // display: inline-block;
            width: 23%;
            height: 180px;
            margin-bottom: 20px;
            margin-right: 2%;
          }
        }
        @media screen and (min-width: 1601px) {
          .photoList {
            // display: inline-block;
            width: 18%;
            height: 180px;
            margin-bottom: 20px;
            margin-right: 2%;
          }
        }
        .photoContainer-noData {
          &-text {
            width: 100%;
            margin-top: calc(25% - 15px);
            font-size: 20px;
            color: #999;
            text-align: center;
            vertical-align: middle;
          }
        }
      }
    }
  }
  // .monitorAddress{
  //     width: 440px;
  //     position:absolute;
  //     top:50%;
  //     left:50%;
  //     transform:translate(-50%,-50%);
  //    .el-select{
  //       width: 278px;
  //       height: 36px;
  //    }
  //    .addressText{
  //       font-size: 14px;
  //       color: #4A4A4A;
  //    }
  // }
  .censusData {
    // display: flex;
    margin-top: 20px;
    //TODO1
    @media screen and (max-width: 1400px) {
      height: 350px;
      overflow-y: hidden;
    }
    @media screen and (min-width: 1400px) {
      height: 280px;
    }
    width: 100%;
    // .el-table__header-wrapper table, .el-table__body-wrapper table{
    //     width: 100% !important;
    // }
    // th,td {
    //   padding: 5px !important;
    // }
    // .el-table__body, .el-table__footer, .el-table__header{
    //   table-layout: auto;
    // }
    .el-table__header {
      tr {
        th:first-of-type {
          background-color: rgb(236, 237, 238);
          color: rgb(113, 113, 113);
          font-weight: bold;
        }
      }
    }
    .el-table__row {
      td:first-of-type {
        background-color: rgb(236, 237, 238);
        color: rgb(113, 113, 113);
        font-weight: bold;
      }
    }
    .alertTable {
      // flex-grow: 1;
      background: #ffffff;
      height: 100%;
      padding: 20px;
      width: 100%;
      // .el-table{
      //   margin-top:5px;
      // }
    }
  }

  .pagination-container {
    position: absolute;
    bottom: 20px;
    width: calc(100% - 20px);
    .el-pagination--small {
      height: 28px;
    }
    @media screen and (max-width: 1600px) {
      .el-pagination__jump {
        display: none;
      }
    }
    @media screen and (max-width: 1400px) {
      bottom: 40px;
      .showTotal {
        display: none;
      }
    }
  }
  .video-panel {
    position: relative;
    height: calc(100% - 35px);
  }
  .screenBottom {
    height: 35px;
    position: relative;
    line-height: 35px;
    background: #fafafa;
    padding: 0 20px;
    font-size: 14px;
    &-op {
      position: absolute;
      right: 20px;
      font-size: 22px;
      color: #999;
      .svg-icon:hover {
        cursor: pointer;
        color: #1989fa;
      }
    }
  }
  .right-part {
    width: 200px;
    position: absolute;
    right: 0;
    top: calc(50% - 100px);
    background: #fff;
    .video-control {
      transform: scale(0.64);
      transform-origin: top center;
      position: absolute;
      left: 50%;

      margin-left: -152px;
    }
    .alarm-panel {
      margin-top: 190px;
    }
  }
  .video-control {
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
