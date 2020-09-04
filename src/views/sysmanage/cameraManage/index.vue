<template>
  <div class="cemeraIndex">
    <div v-if="formInline.typeValue === 'map'" class="camera">
      <div class="title">
        摄像头管理
      </div>
      <div class="mapbox">
        <div class="serachbox">
          <div class="filter-container clearfix">
            <div class="pull-left">
              <el-input v-model="formInline.searchkey" placeholder="请输入摄像头ID、地址、负责人" class="filter-item" style="width: 400px;" @keyup.enter.native="onSearch"></el-input>
              <el-button v-waves class="filter-item" type="warning" @click="onSearch">
                {{ '搜索' }}
              </el-button>
            </div>
            <div class="pull-right">
              <el-button class="filter-item" type="warning" icon="el-icon-plus" @click="create">{{ '新增摄像头' }}</el-button>
              <el-dialog :visible="dialogVisable" title="新增摄像头" width="520px" @close="closeDialog">
                <el-form :model="viewXq" label-position="right" label-width="100px">
                  <el-form-item label="摄像头ID："><el-input placeholder="请输入摄像头ID" class="filter-item" style="width: 300px;"></el-input>
                  </el-form-item>
                  <el-form-item label="负责人："><el-input placeholder="请输入负责人" class="filter-item" style="width: 300px;"></el-input>
                  </el-form-item>
                  <el-form-item label="摄像头经度："><el-input placeholder="请输入摄像头经度" class="filter-item" style="width: 300px;"></el-input>
                  </el-form-item>
                  <el-form-item label="摄像头纬度："><el-input placeholder="请输入摄像头纬度" class="filter-item" style="width: 300px;"></el-input>
                  </el-form-item>
                  <el-form-item label="地址："><el-input :rows="4" type="textarea" placeholder="请输入地址" class="filter-item" style="width: 350px;"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button
                    type="primary"
                    @click="dialogConfirm"
                  >确 定</el-button>
                  <el-button @click="dialogQuxiao">取 消</el-button>
                </div>
              </el-dialog>
              <el-select v-model="formInline.typeValue" style="width:120px;" class="filter-item" @change="checkModel">
                <el-option v-for="item in typeOptions" :key="item._id" :label="item.name" :value="item._id"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="map">
          <el-col :span="24" class="status">
            <el-col :span="19" style="height:100%;">
              <div class="mapcontainer">
                <el-amap
                  :amap-manager="amapManager"
                  :center="center"
                  :events="events"
                  :zoom="zoom"
                  class="amap-demo"
                  vid="amapDemo"
                >
                  <div @click="()=>{positionClick(index)}">
                    <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :vid="index" :content="marker.content"></el-amap-marker>
                  </div>
                </el-amap>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="camerainfo">
                <div class="infotitle">
                  摄像头信息
                </div>
                <el-form :model="viewXq" label-position="right" label-width="100px">
                  <el-form-item label="摄像头ID：">
                    <div style=" word-wrap: break-word">{{ '1234567890' }}</div>
                  </el-form-item>
                  <el-form-item label="负责人：">
                    <div style=" word-wrap: break-word">{{ '李四四' }}</div>
                  </el-form-item>
                  <el-form-item label="经纬度信息：">
                    <div style=" word-wrap: break-word">{{ '110.13、34.6' }}</div>
                  </el-form-item>
                  <el-form-item label="地址：">
                    <div style=" word-wrap: break-word">{{ '我是地址我是地址我是地址,我的文字多可回行' }}</div>
                  </el-form-item>
                  <el-form-item label="添加人：">
                    <div style=" word-wrap: break-word">{{ '李三三' }}</div>
                  </el-form-item>
                  <el-form-item label="添加时间：">
                    <div style=" word-wrap: break-word">{{ '2020年9月3日' }}</div>
                  </el-form-item>
                  <el-form-item label="视频流信息：">
                    <div style=" word-wrap: break-word">{{ '已处理' }}</div>
                  </el-form-item>
                  <el-form-item label="告警信息：">
                    <div style=" word-wrap: break-word">{{ '1/123' }}</div>
                  </el-form-item>
                  <el-button style="margin-left: 60px;" @click="submitForm('ruleForm')">编辑</el-button>
                  <el-button type="text" @click="resetForm('ruleForm')">删除</el-button>
                </el-form>
              </div>
            </el-col>
          </el-col>
        </div>
      </div>
    </div>
    <div v-else-if="formInline.typeValue === 'list'">
      <CameraList @getdata="getdata"></CameraList>
    </div>
  </div>

</template>

<script>
import VueAMap from 'vue-amap'
import CameraList from './list.vue'
import { Alert } from 'element-ui'

const amapManager = new VueAMap.AMapManager()
export default {
  components: { CameraList },
  data() {
    return {
      viewXq: {

      },
      formInline: {
        searchkey: '',
        typeValue: 'map'
      },
      form: {},
      typeOptions: [{ name: '地图模式', _id: 'map' },
        { name: '列表模式', _id: 'list' }],
      zoom: 12,
      center: [110.09, 34.58],
      dialogVisable: false,
      markers: [
        { position: [110.09, 34.58],
          content: `<img src="https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png" style="width: 19px; height: 33px; top: 0px; left: 0px;">`
        },
        { position: [110.088, 34.56],
          content: `<img src="https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png" style="width: 19px; height: 33px; top: 0px; left: 0px;">` },
        { position: [110.086, 34.54],
          content: `<img src="https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png" style="width: 19px; height: 33px; top: 0px; left: 0px;">` },
        { position: [110.074, 34.42],
          content: `<img src="https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png" style="width: 19px; height: 33px; top: 0px; left: 0px;">` },
        { position: [110.064, 34.53],
          content: `<img src="https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png" style="width: 19px; height: 33px; top: 0px; left: 0px;">` },
        { position: [110.034, 34.56],
          content: `<img src="https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png" style="width: 19px; height: 33px; top: 0px; left: 0px;">` },
        { position: [110.006, 32.58],
          content: `<img src="https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png" style="width: 19px; height: 33px; top: 0px; left: 0px;">` },
        { position: [110.079, 34.59],
          content: `<img src="https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png" style="width: 19px; height: 33px; top: 0px; left: 0px;">` },
        { position: [110.066, 34.53],
          content: `<img src="https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png" style="width: 19px; height: 33px; top: 0px; left: 0px;">` }
      ],
      amapManager
    }
  },
  mounted() {
    const points = document.getElementsByClassName('amap-marker')
    points.forEach(marker => {
      marker.on('click', function(e) {
        console.log('哈哈')
      })
    })
  },
  methods: {
    create() {
      this.dialogVisable = true
    },
    onSearch() {
      console.log('搜索')
    },
    checkModel() {
      this.$emit('getdata', this.formInline.typeValue)
    },
    closeDialog() {
      this.dialogVisable = false
    },
    getdata(v) {
      this.formInline.typeValue = v
    },
    dialogQuxiao() {
      this.dialogVisable = false
    },
    dialogConfirm() {
      this.dialogVisable = false
    },
    positionClick(i) {
      console.log(i)
    }
  }
}
</script>

<style lang='scss'>
.main-container {
  height: 100%;
}
.app-main {
  height: 100%;
}
.cemeraIndex {
  height: 100%;
}
.camera {
  height: 100%;
}
 .title {
   width: 100%;
   height: 50px;
   line-height: 50px;
   padding: 0 20px;
   font-family: MicrosoftYaHei;
   font-size: 22px;
   color: #333333;
   font-weight: 500;
   border-bottom: 1px solid #D8D8D8;
 }
 .mapbox {
   padding: 20px;
   padding-bottom: 20px !important;
   height: 100%;
   .serachbox {
     height: 50px;
   }
   .map {
     width: 100%;
     height: 100%;
     margin-bottom: 20px;
     padding-bottom: 20px;
     .el-col {
       height: 97%;
       padding-bottom:20px;
     }
     .mapcontainer {
       height: 100%;
       padding-bottom: 20px;
     }
     .camerainfo {
       height: 100%;
       border: 1px solid #D8D8D8;
       border-radius: 5px;
       border-radius: 5px;
       margin-left:20px;
       .infotitle {
         height: 30px;
         background-color: #D8D8D8;
         line-height: 30px;
         padding: 0 20px;
         opacity: 0.85;
         font-family: PingFangSC-Medium;
         font-size: 16px;
         color: rgba(0,0,0,0.85);
         letter-spacing: -0.2px;
       }
       .el-form {
         padding: 20px;
       }
       .el-form-item__label {
         font-weight: 500 !important;
       }
       .el-form-item {
         margin-bottom: 10px;
       }
     }
   }
 }
</style>
