<template>
  <div v-loading="pageLoading" class="algorithmConfigWrap" element-loading-text="拼命加载中">
    <div class="algorithmConfig">
      <el-row>
        <el-col :span="7" class="videoQueryBox">
          <div class="videoTotalBox">
            <div class="videoTotal">
              <span class="videoTotalText">摄像头列表</span>
              <span class="videoTotalNum">总计：{{ total }}个摄像头</span>
            </div>
            <el-input v-model="queryKeyword" placeholder="请输入摄像头地址" @change="searchList">
              <el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
            </el-input>

          </div>
          <!-- <ul v-if="nameList.length>0" :style="styleObj" class="videoResult" @scroll="listenScroll">
            <li v-for="(v,k) in nameList" :key="k" :class="activeVideoResult === k ? 'active' :''" @click="changeDeviceId(v.id,k)" @mouseover="checkNameLen(k)">
              <div>
                <span class="displayIB">
                  <svg-icon icon-class="monitorIcon" class="svgBtn"/>
                </span>
                <el-tooltip :disabled="deviceShowTooltip" placement="top">
                  <div slot="content">{{ v.name }}</div>
                  <span class="seviceName displayIB" >
                    {{ v.name }}
                  </span>
                </el-tooltip>
                <span @click.stop="toMonitorDetail(v.id)">
                  <svg-icon icon-class="videoDetail" class="svgBtn detailSvg"/>
                </span>
              </div>
            </li>
          </ul> -->
          <!--default-expanded-keys-->
          <el-tree
            v-if="caremaTreeData.length>0"
            :style="styleObj"
            :data="caremaTreeData"
            :default-expanded-keys="[expendId]"
            :render-after-expand="false"
            node-key="expendId"
            icon-class="el-icon-arrow-down"
            class="cameraTree"
            @node-click="cameraTreeClick">
            <div slot-scope="{ node, data }">
              <div v-if="data.ifChild" :data-id="data.info.id" :data-parentname="data.parentName" @mouseenter="checkTreeName">
                <span class="displayIB">
                  <svg-icon icon-class="monitorIcon" class="svgBtn"/>
                </span>
                <el-tooltip :disabled="deviceShowTooltip" placement="top">
                  <div slot="content">{{ node.label }}</div>
                  <span class="seviceName displayIB" >
                    {{ node.label }}
                  </span>
                </el-tooltip>
                <span @click.stop="toMonitorDetail(data.info.id,node)">
                  <svg-icon icon-class="videoDetail" class="svgBtn detailSvg"/>
                </span>
              </div>
              <div v-else>
                {{ node.label }}
              </div>
            </div>
          </el-tree>
          <div v-else class="noResult">暂无摄像头</div>
          <!-- <pagination
                v-show="total>0"
                :total="total"
                :page.sync="page"
                :limit.sync="limit"
                :pager-count="5"
                small
                layout="prev, pager, next"
                @pagination="pageChange"
              /> -->
        </el-col>
        <el-col :span="17" class="algorithmConfigList totalLine">
          <div v-if="algorithmList.length>0" class="algorithmBox">
            <VideoConfig :device-id="deviceId" :arr2="algorithmList" @canvasShow="setCanvasShow" @sureAlgorithm="applyAlgorithms"></VideoConfig>
            <div class="totalNum">算法总计：{{ algorithmList.length }}</div>
          </div>
          <div v-else class="nodata">
            稍后再试
          </div>
        </el-col>
      </el-row>
      <!-- <div class="listBtnBox">
        <el-button :loading="btnLoading" type="primary" @click="applyAlgorithms(true)">确定</el-button>
      </div> -->
    </div>
  </div>
</template>

<script>
// import VideoPlayer from '@/components/VideoPlayer'
import Pagination from '@/components/Pagination'
import VideoPlayer from '@/components/VideoPlayer'
import VideoConfig from '@/components/VideoConfig'
import client from '@/api/vedioAlgo'
import SvgIcon from '@/components/SvgIcon'
import {
  taskList, videoListByAlgorithmId, getCameraList, getCameraTree
} from '@/api/algorithm'

export default {
  components: { Pagination, VideoPlayer, VideoConfig, SvgIcon },
  data() {
    return {
      activeName: 'first',
      pageLoading: true,
      activeAlgorithm: 0,
      videoWithConfig: [],
      nameList: [],
      taskData: [],
      deviceId: '',
      algorithmList: [],
      algorithmListTwoDim: [],
      algorithmId: '',
      activeVideoResult: 0,
      totalCameras: 0,
      cameraListByQuery: [],
      total: 0,
      page: 1,
      limit: 30,
      queryKeyword: '',
      canvasShowStatus: false,
      controlShow: false,
      listtotal: 0,
      listpage: 1,
      listlimit: 10,
      winHeight: '',
      styleObj: {
        height: ''
      },
      btnLoading: false,
      deviceShowTooltip: true,
      caremaTreeData: [],
      expendId: '',
      chooseEle: ''
    }
  },
  watch: {
    limit() {
      this.page = 1
      this.pageChange()
      this.listpageChange()
    }
  },
  mounted() {
    const { cameraId } = this.$route.query
    this.deviceId = cameraId
  },
  async created() {
    await this.getList()
  },
  methods: {
    // handleClick(tab, event) {
    //   this.pageLoading = true
    //   if (tab.index === '0' || tab.index === 0) {
    //     this.getTaskList()
    //   } else {
    //     this.getList()
    //   }
    // },
    getSomeHeight() {
      this.winHeight = window.innerHeight
      // console.log('winHeight------>', this.winHeight)
      // const topH = document.querySelector('.videoTotalBox').offsetHeight
      this.styleObj.height = (this.winHeight - 260) + 'px'
    },
    changeActive(k, id) {
      this.activeAlgorithm = k
      this.pageLoading = true
      this.getVideoList(id)
    },
    getTaskList() {
      const query = {
        cascade: true,
        page: {
          index: this.listpage,
          size: this.listlimit
        },
        params: {}
      }
      taskList(query).then(res => {
        if (res.code === 0) {
          this.taskData = res.body.data
          //   this.algorithmId = res.body.data[0].id
          this.listLoading = false
          const id = res.body.data[0].id
          this.taskName = res.body.data[0].name
          this.getVideoList(id)
        }
      })
    },
    getVideoList(id) {
      videoListByAlgorithmId(id).then(res => {
        if (res.code === 0) {
          this.pageLoading = false
          this.videoWithConfig = res.body.data.configCameras
          this.totalCameras = res.body.data.totalCameras
          this.listtotal = res.body.data.configCameras ? res.body.data.configCameras.length : 0
        }
      })
    },
    listenScroll(e) {
      const ele = e.srcElement ? e.srcElement : e.target
      if (ele.scrollTop + ele.offsetHeight > ele.scrollHeight - 100) {
        if (this.nameList.length >= this.total) {
          return false
        }
        ++this.page
        this.getList()
      }
    },
    searchList() {
      this.page = 1
      this.nameList = []
      this.getList()
    },
    getList() {
      const query = this.queryKeyword ? {
        'page': {
          'index': this.page,
          'size': this.limit
        },
        'params': [
          {
            'field': 'name',
            'operator': 'LIKE',
            'value': `%${this.queryKeyword.trim()}%`

          }],
        sorts: [
          {
            field: 'create_time',
            type: 'desc'
          }
        ]
      } : {
        'page': {
          'index': this.page,
          'size': this.limit
        },
        'params': [],
        sorts: [
          {
            field: 'create_time',
            type: 'desc'
          }
        ]
      }
      // getCameraList(query).then(res => {
      //   if (res.code === 0) {
      //     if (this.queryKeyword) {
      //       const dataList = res.body.data
      //       for (const val in dataList) {
      //         this.nameList.push(dataList[val])
      //       }
      //     } else {
      //       const dataList = res.body.data
      //       for (const val in dataList) {
      //         this.nameList.push(dataList[val])
      //       }
      //     }

      //     //   this.nameList.push(res.body.data)
      //     this.total = res.body.page.total
      //     this.listLoading = false
      //     this.deviceId = this.deviceId ? this.deviceId : res.body.data[0].id
      //     const getId = this.nameList[this.activeVideoResult] ? this.nameList[this.activeVideoResult].id : ''
      //     getId && this.getAlgorithmList(getId)
      //   }
      // })
      getCameraTree(query).then(res => {
        if (res.code === 0) {
          const tempData = res.body.data.filter(item => item.data.length > 0)
          const { cameraId } = this.$route.query
          this.caremaTreeData = tempData.map(item => {
            return {
              label: item.name,
              expendId: item.name,
              children: item.data.map(val => {
                return {
                  label: val.name,
                  info: val,
                  ifChild: true, // 用来判断是否是子级
                  parentName: item.name // 存储父级，用于默认展开
                }
              })
            }
          })
          this.deviceId = this.deviceId ? this.deviceId : tempData[0].data[0].id
          this.$nextTick(function() {
            if (cameraId) {
              const dataCamera = document.querySelector(`[data-id="${cameraId}"]`)
              this.expendId = dataCamera.getAttribute('data-parentname')
              dataCamera.parentNode.parentNode.parentNode.classList.add('is-current')
            } else {
              this.expendId = tempData.length > 0 ? tempData[0].name : ''
              const ele = document.querySelector('.el-tree-node__children .el-tree-node.is-focusable')
              ele.classList.add('is-current')
            }
          })

          this.getAlgorithmList(this.deviceId)
        }
      })
    },
    cameraTreeClick(data, node, ele) {
      if (data.ifChild) {
        this.chooseEle = ele.$el
        this.deviceId = data.info.id
        this.controlShow = false
        this.canvasShowStatus = false
        this.pageLoading = true
        const eles = document.querySelectorAll('.el-tree-node__children .el-tree-node.is-focusable')
        for (let i = 0; i < eles.length; i++) {
          eles[i].classList.remove('is-current')
        }
        this.chooseEle.classList.add('is-current')
        this.getAlgorithmList(this.deviceId)
      } else {
        ele.$el.classList.remove('is-current')
        if (this.chooseEle) {
          this.chooseEle.classList.add('is-current')
        }
      }
    },
    chooseThis(e) {
      // console.log(e)
    },
    checkTreeName(e) {
      // console.log(e, e.target.offsetWidth)
      const eleWidth = e.target.offsetWidth
      if (eleWidth > 200) {
        this.deviceShowTooltip = false
      } else {
        this.deviceShowTooltip = true
      }
    },
    changeDeviceId(id, k) {
      this.controlShow = false
      this.canvasShowStatus = false
      this.pageLoading = true
      this.deviceId = id
      this.activeVideoResult = k
      this.getAlgorithmList(id)
    },
    async getAlgorithmList(deviceId) {
      const { body: res } = await client.getInstanceList(deviceId)
      this.algorithmList = res.data
      this.controlShow = true
      this.algorithmList = this.algorithmList.map(this.saveUpdatePick)
      //   this.algorithmListTwoDim = this.changeToTwoDiArray(this.algorithmList, 3)
      this.pageLoading = false

      this.getSomeHeight()
    },
    saveUpdatePick(item) {
      if (item.isPick) {
        item['isConfigAlready'] = true
        item['beforePickStatus'] = true
        item['isCommitStatus'] = true
        item['originalPickStatus'] = true
      } else {
        item['isConfigAlready'] = false
        item['beforePickStatus'] = false
        item['isCommitStatus'] = false
        item['originalPickStatus'] = false
      }
      return item
    },
    changeToTwoDiArray(dataList, num) {
      return dataList.reduce(
        (prev, next, idx) => {
          const inner = prev[~~(idx / num)]
          if (inner !== undefined) {
            inner.push(next)
          } else {
            prev.push([next])
          }
          return prev
        },
        [[]]
      )
    },
    // applyAlgorithmsTest(val) {
    //   console.log('测试----------->', val)
    // },
    applyAlgorithms(flag) {
      if (flag) {
        // 先组装参数，包含删除、增加、修改
        // var allDatas = []
        // var nowAlgorithmList = [].concat.apply([], this.algorithmListTwoDim)
        // console.log('现在转化成一维数组', nowAlgorithmList)
        // console.log('二维数组---', this.algorithmListTwoDim)
        var params = []
        // var flag = true
        for (var i = 0; i < this.algorithmList.length; i++) {
          var algorithmObject = this.algorithmList[i]
          var param = {
            taskId: algorithmObject.id,
            id: algorithmObject.id,
            taskName: algorithmObject.name
          }
          if (algorithmObject.originalPickStatus && !algorithmObject.isPick) {
            // 删除
            param['action'] = 'delete'
            params.push(param)
          } else if (!algorithmObject.originalPickStatus && algorithmObject.isPick) {
            // 增加(检查，如果该配置的没有配置需要弹窗告警)
            param['action'] = 'add'
            if (algorithmObject.isNeedConfig) {
              const areas = algorithmObject['areas']
              if (areas === undefined || areas.length === 0) {
                alert(algorithmObject.cnName + '没有标注，请标注再提交或者取消选择')
                flag = false
                break
              } else {
                // console.log('原来的areas', algorithmObject['areas'])
                param['areas'] = this.formatAreas(areas, algorithmObject.ratiox, algorithmObject.ratioy)
              }
            }
            params.push(param)
          } else if (algorithmObject.originalPickStatus && algorithmObject.isPick && !algorithmObject.isCommitStatus) {
            // 修改、肯定需要标注（检查，如果该配置的没有配置需要弹窗告警）
            param['action'] = 'update'
            const areas = algorithmObject['areas']
            if (areas === undefined || areas.length === 0) {
              alert(algorithmObject.cnName + '没有标注，请标注再提交或者取消选择')
              flag = false
              break
            }
            param['areas'] = this.formatAreas(areas, algorithmObject.ratiox, algorithmObject.ratioy)
            params.push(param)
          }
        }
        if (flag) {
          if (params.length > 0) {
            // console.log('组装的参数是-----', params)
            var finalBody = {
              deviceId: this.deviceId,
              taskInstParams: params
            }
            // console.log('最终组装的参数是-----', finalBody)
            this.pageLoading = true

            this.btnLoading = true
            this.configTask(finalBody)
          }
          this.configVisable = false
        }
      } else {
        this.configVisable = false
      }
    },
    formatAreas(areas, ratiox, ratioy) {
      var newAreas = areas.map(eachArea => {
        var newPoints = this.formatPoints(eachArea.points, ratiox, ratioy)
        return {
          type: eachArea.type,
          name: eachArea.name,
          points: newPoints
        }
      })
      return newAreas
    },
    formatPoints(points, ratiox, ratioy) {
      var newPoints = []
      for (var i = 0; i < points.length; i++) {
        newPoints.push({
          x: parseInt(points[i].x * ratiox),
          y: parseInt(points[i].y * ratioy)
        })
      }
      return newPoints
    },
    configTask(body) {
      client.configInstance(body).then(res => {
        if (res.code === 0) {
          const { deviceId } = body
          this.btnLoading = false
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.getAlgorithmList(deviceId)
        }
      }).catch(err => {
        // this.pageLoading = false
        this.getAlgorithmList(this.deviceId)
        this.$message({
          message: err.message,
          type: 'warning'
        })
      })
      // console.log('任务实例配置调用接口返回-----', res)
      // const { deviceId } = body
      // if (res.code === 0) {
      //   this.btnLoading = false
      //   this.$message({
      //     message: '更新成功',
      //     type: 'success'
      //   })
      //   this.getAlgorithmList(deviceId)
      // } else {
      //   this.pageLoading = false
      //   this.$message({
      //     message: res.message,
      //     type: 'warning'
      //   })
      // }
    },
    setCanvasShow(payload) {
      this.canvasShowStatus = payload
    },
    pageChange(obj) {
      this.getList()
    },
    listpageChange(obj) {
      this.listpageChange = obj.page
      this.getTaskList()
    },
    getStatus(status) {
      return status === 1 ? '在线' : '离线'
    },
    toMonitorDetail(id) {
      this.$router.push({ path: '/cameraManage/videomonitor', params: { cameraId: id }, query: { cameraId: id }})
    },
    checkNameLen(k) {
      const eleWidth = document.querySelectorAll('.seviceName')[k].offsetWidth
      if (eleWidth > 179) {
        this.deviceShowTooltip = false
      } else {
        this.deviceShowTooltip = true
      }
    }

  }
}
</script>
<style lang='scss'>
.algorithmConfigWrap{
    padding: 20px;
    background: #F0F2F5;
    height: 100%;
    .algorithmConfig{
        background: #fff;
        // height: 100%;
      /deep/.el-tree{
        overflow-y: auto;
        &::-webkit-scrollbar {
            display: none;
        }
      }
    }
    // /deep/.el-tabs__header{
    //     margin: 5px 0 5px;
    // }
    // /deep/.el-tabs__item{
    //     height: 40px;
    //     line-height: 40px;
    // }

    /deep/.el-tabs__content{
        overflow:inherit;
         &::-webkit-scrollbar {
            display: none;
        }
    }

    .tabCon{
        padding: 0 22px;
        min-width: 900px;
        p{
            font-size: 16px;
            color: #333333;
        }
        .btnBox{
            padding-bottom: 10px;
            border-bottom: 1px dashed #E9E9E9;
            width: 100%;

        }
        .tabBox{
            margin-top: 20px;
        }
        .btnTab{
            display: inline-block;
            font-size: 14px;
            color: rgba(0,0,0,0.65);
            cursor: pointer;
            width: 12%;
            margin: 0.3%;
            text-align: center;
            padding: 5px;
            &.active{
                background:#FF9832;
                border-radius: 5px;
                color: #FFFFFF;
            }
        }
        .btnCon{
            display: none;
            &.on{
                display: block;
            }
        }
    }
    .nameList{
        display: flex;
        flex-wrap: wrap;
        list-style: none;
        padding: 0;
        margin: 20px 0;
        border: 1px solid #EEE;
        li{
            margin: 10px 20px 10px 10px;
        }
    }
    .nodata{
        font-size: 16px;
        color: #333;
        border: 1px solid #EEE;
        margin: 5px 0;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }
    .videoList{
        // margin-top: 20px;
        padding: 20px 22px;
        /deep/.el-table__header-wrapper{
            // border-radius: 5px;
            border-top-right-radius: 7px;
            border-top-left-radius: 7px;
        }
        /deep/.pagination-container{
          margin-top: 20px;
        }
        .facilicyId{
            // width: 25%;
            padding-left: 15px;
        }
        .facilicyName{
            // width: 30%;
        }
    }
    .videoInfo{
        .infoName{
            font-size: 16px;
            color: #333333;
        }
        .infoDetail{
            font-size: 12px;
            color: #666666;
        }
    }
    //算法配置
    // .videoContainerBox{
    //     margin-bottom: 15px;
    //     position: relative;
    // }
    .totalLine{
        border-left: 1px solid #EEE;
    }
    .videoQueryBox{
        position: relative;
        padding: 0 10px;
        .noResult{
            font-size: 16px;
            color: #333;
            border: 1px solid #EEE;
            margin: 20px 10px;
            height: 50px;
            line-height: 50px;
            text-align: center;
        }
    }
    .videoQueryBox{
        /deep/.pagination-container .showTotal{
            display: none;
        }
        /deep/.pagination-container{
            margin: 5px 0 0;
        }
    }

    /deep/.pagination-container .el-pagination{
        position: inherit;
        // float:right;
        margin-left:auto;
    }

    .videoTotalBox{
        padding:10px;
    }
    .videoTotal{
        position: relative;
        margin-bottom: 10px;
    }
    .videoTotalText{
        font-size: 16px;
        color: #333;
        font-weight: bolder;
    }
    .videoTotalNum{
        font-size: 12px;
        color: #666666;
        position: absolute;
        top:4px;
        right: 10px;
    }
    .videoResult{
        // display: flex;
        // flex-wrap: wrap;
        list-style: none;
        padding: 0 10px;
        margin: 10px 0 5px;
        // height: 575px;
        overflow: auto;
        &::-webkit-scrollbar {
            display: none;
        }

        li, /deep/.el-tree-node__content{
            margin: 5px 0;
            cursor: pointer;
            font-size: 13px;
            position: relative;
            &:hover{
              background: #f0f8ff;
              .detailSvg{
                display: inline;
              }
            }
            div{
                padding: 5px 7px;
                // display: inline-block;
                // overflow: hidden;
                // text-overflow: ellipsis;
                // white-space: nowrap;
            }
            .detailSvg{
              display: none;
              position: absolute;
              right: 12px;
              &:hover{
                font-size: 14px;
                color: #FF9832;
              }
            }
            .displayIB{
              display: inline-block;
              vertical-align: middle;
            }
            .seviceName{
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              max-width: 180px;
            }
            &.active{
                div{
                    background: #FF9832;
                    border-radius: 5px;
                    color: #FFFFFF;
                    .svgBtn{
                      fill: #fff;
                    }
                }
            }
        }

    }
    .cameraTree{
      /deep/.el-tree-node__content{
        margin: 5px 0;
        cursor: pointer;
        font-size: 13px;
        position: relative;
       &:hover{
          background: #f0f8ff;
          .detailSvg{
            display: inline;
          }
        }
        div{
            padding: 5px 7px;
            // display: inline-block;
            // overflow: hidden;
            // text-overflow: ellipsis;
            // white-space: nowrap;
        }
        .detailSvg{
          display: none;
          position: absolute;
          right: 12px;
          &:hover{
            font-size: 14px;
            color: #FF9832;
          }
        }
        .displayIB{
          display: inline-block;
          vertical-align: middle;
        }
        .seviceName{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 180px;
        }
      }
      /deep/.el-tree-node__children /deep/.is-current /deep/.el-tree-node__content{
        background: #FF9832;
        border-radius: 5px;
        color: #FFFFFF;
        .svgBtn{
          fill: #fff;
        }
      }
    }
    .totalNum{
        color: #666666;
        margin: 30px 0;
    }
    .listBtnBox{
        // text-align: right;
        height: 60px;
        line-height: 60px;
        width: 100%;
        box-shadow: 0 -2px 4px 0 rgba(0,0,0,0.07);
        background: #fff;
        position: fixed;
        z-index: 99;
        bottom: 0;
        left: 0;
        text-align: right;
        padding-right: 20px;
    }
    .algorithmConfigList{
        // margin-left: 2.083335%;
        // padding-left: 2.083335%;
        padding: 24px 20px 14px;
        margin: 24px 0 18px;
        .algorithmBox{
            padding-bottom: 20px;
        }
        .test{
            // padding-left: 5px;
        }
        .configBox{
            // display: inline-block;
        }
        .config-info{
            // display:inline-block;
            // min-width: 840px;
            // margin: 0 auto;
            // font-size: 0;
            // padding: 10px;
        }
        .configchangebox{
             margin: 20px auto;
        }
    }
}
</style>
