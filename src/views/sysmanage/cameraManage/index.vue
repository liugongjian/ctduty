<template>
  <div id="cameraI" class="cameraIndex" @click="watchClick">
    <div v-if="formInline.typeValue === 'map'" class="camera">
      <div class="mapbox">
        <div class="serachbox">
          <div class="filter-container clearfix">
            <div class="pull-left">
              <el-input v-model="formInline.searchkey" placeholder="请输入摄像头地址" class="filter-item" style="width: 400px;" @keyup.enter.native="onSearch"></el-input>
              <el-button v-waves class="filter-item" type="warning" @click="onSearch">
                {{ '搜索' }}
              </el-button>
            </div>
            <div class="pull-right">
              <el-button class="filter-item" type="warning" icon="el-icon-plus" @click="create">{{ '新增摄像头' }}</el-button>
              <el-dialog :visible="dialogVisable" title="新增摄像头" width="520px" @close="closeDialog">
                <el-form :model="dialogForm" :rule="rules" label-position="right" label-width="100px">
                  <el-form-item label="摄像头ID："><el-input v-model="dialogForm.id" placeholder="请输入摄像头ID" class="filter-item" style="width: 300px;"></el-input>
                  </el-form-item>
                  <el-form-item label="负责人ID："><el-input v-model="dialogForm.inChargeId" placeholder="请输入负责人ID" class="filter-item" style="width: 300px;"></el-input>
                  </el-form-item>
                  <el-form-item label="添加人："><el-input v-model="dialogForm.creatorId" placeholder="请输入添加人" class="filter-item" style="width: 300px;"></el-input>
                  </el-form-item>
                  <el-form-item label="制造厂商："><el-input v-model="dialogForm.manufacturer" placeholder="请输入制造厂商" class="filter-item" style="width: 300px;"></el-input>
                  </el-form-item>
                  <el-form-item label="设备型号："><el-input v-model="dialogForm.model" placeholder="请输入设备型号" class="filter-item" style="width: 300px;"></el-input>
                  </el-form-item>
                  <el-form-item label="视频流："><el-input v-model="dialogForm.url" placeholder="请输入视频流" class="filter-item" style="width: 300px;"></el-input>
                  </el-form-item>
                  <el-form-item label="手机："><el-input v-model="dialogForm.phone" placeholder="请输入手机" class="filter-item" style="width: 300px;"></el-input>
                  </el-form-item>
                  <el-form-item label="摄像头经度："><el-input v-model="dialogForm.longitude" type="num" placeholder="请输入摄像头经度" class="filter-item" style="width: 300px;"></el-input>
                  </el-form-item>
                  <el-form-item label="摄像头纬度："><el-input v-model="dialogForm.latitude" type="num" placeholder="请输入摄像头纬度" class="filter-item" style="width: 300px;"></el-input>
                  </el-form-item>
                  <el-form-item label="地址："><el-input v-model="dialogForm.address" placeholder="请输入地址" class="filter-item" style="width: 300px;"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button
                    type="primary"
                    @click="dialogConfirm('dialogForm')"
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
            <el-col :span="19">
              <div class="mapcontainer">
                <el-amap
                  :amap-manager="amapManager"
                  :center="center"
                  :events="events"
                  :zoom="zoom"
                  class="amap-demo"
                  vid="amapDemo"
                >
                  <el-amap-marker v-for="(marker, index) in markers" :events="events" :id="'point'+index" :key="index" :position="marker.position" :vid="index" :content="marker.content" @click="markerClick"></el-amap-marker>
                </el-amap>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="camerainfo">
                <div class="infotitle">
                  摄像头信息
                </div>
                <div v-if="showZwMes" style="padding:30px;text-align:center;line-height:20px;font-size:14px;color:#999;">
                  <div style="padding-bottom:10px;">
                    <svg t="1599289905127" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1303" width="40" height="40"><path d="M24.380952 512c0 269.336381 218.282667 487.619048 487.619048 487.619048s487.619048-218.282667 487.619048-487.619048S781.336381 24.380952 512 24.380952 24.380952 242.663619 24.380952 512z m518.095238 274.285714c0 16.847238-13.628952 30.47619-30.47619 30.476191s-30.47619-13.628952-30.47619-30.476191S495.152762 755.809524 512 755.809524s30.47619 13.628952 30.47619 30.47619z m0-144.774095c0 16.018286-13.628952 28.964571-30.47619 28.964571s-30.47619-12.921905-30.47619-28.964571V236.202667c0-15.993905 13.628952-28.94019 30.47619-28.940191s30.47619 12.921905 30.47619 28.964572v405.308952z" fill="#999" p-id="1304"/></svg>
                  </div>
                  暂无摄像头信息！
                  <br>
                  请选择您想查看的摄像头。
                </div>
                <el-form v-else :model="form" label-position="right" label-width="85px">
                  <el-form-item label="摄像头ID：">
                    <div style=" word-wrap: break-word">{{ form.id }}</div>
                  </el-form-item>
                  <el-form-item label="负责人：">
                    <div style=" word-wrap: break-word">{{ form.inCharge.username }}</div>
                  </el-form-item>
                  <el-form-item label="经度信息：">
                    <div style=" word-wrap: break-word">{{ form.longitude.toFixed(2) }}</div>
                  </el-form-item>
                  <el-form-item label="纬度信息：">
                    <div style=" word-wrap: break-word">{{ form.latitude.toFixed(2) }}</div>
                  </el-form-item>
                  <el-form-item label="地址：">
                    <div style=" word-wrap: break-word">{{ form.address }}</div>
                  </el-form-item>
                  <el-form-item label="添加人：">
                    <div style=" word-wrap: break-word">{{ form.name }}</div>
                  </el-form-item>
                  <el-form-item label="添加时间：">
                    <div style=" word-wrap: break-word">{{ form.createTime }}</div>
                  </el-form-item>
                  <el-form-item label="视频流信息：">
                    <div style=" word-wrap: break-word">{{ form.isDeal ? '已处理':'未处理' }}</div>
                  </el-form-item>
                  <el-form-item label="告警信息：">
                    <div style=" word-wrap: break-word">{{ form.dealSum }}</div>
                  </el-form-item>
                  <el-button style="margin-left: 60px;" @click="editDialog">编辑</el-button>
                  <el-button type="text" @click="delAlert">删除</el-button>
                </el-form>
              </div>
              <el-dialog :visible="editVisable" title="编辑" width="520px" @close="editCloseDialog">
                <el-form :model="editForm" label-position="right" label-width="100px">
                  <el-form-item label="负责人："><el-input v-model="editForm.inCharge.username" placeholder="请输入负责人" class="filter-item" style="width: 300px;"></el-input>
                  </el-form-item>
                  <el-form-item label="摄像头经度："><el-input v-model="editForm.longitude" placeholder="请输入摄像头经度" class="filter-item" style="width: 300px;"></el-input>
                  </el-form-item>
                  <el-form-item label="摄像头纬度："><el-input v-model="editForm.latitude" placeholder="请输入摄像头纬度" class="filter-item" style="width: 300px;"></el-input>
                  </el-form-item>
                  <el-form-item label="视频流信息："><el-input v-model="editForm.url" placeholder="请输入视频流信息" class="filter-item" style="width: 300px;"></el-input>
                  </el-form-item>
                  <el-form-item label="地址："><el-input v-model="editForm.address" :rows="4" type="textarea" placeholder="请输入地址" class="filter-item" style="width: 300px;"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button
                    type="primary"
                    @click="editDialogConfirm"
                  >确 定</el-button>
                  <el-button @click="editDialogQuxiao">取 消</el-button>
                </div>
              </el-dialog>
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
import moment from 'moment'
import EllipsisTooltip from '@/components/EllipsisTooltip'
import {
  fetchAllCameraList, editCamera, addCamera, delCamera
} from '@/api/camera'
const amapManager = new VueAMap.AMapManager()
export default {
  components: { CameraList, EllipsisTooltip },
  data() {
    return {
      dialogForm: {
        address: '',
        creatorId: '',
        id: '',
        name: '',
        latitude: '',
        longitude: '',
        url: '',
        inChargeId: '',
        manufacturer: '',
        model: '',
        phone: ''
      },
      editVisable: false,
      editForm: {
        id: '',
        inCharge: '',
        longitude: '',
        latitude: '',
        address: '',
        url: ''
      },
      rules: {
        creatorId: [
          { required: true, trigger: 'trigger', message: '请输入创建人ID' }
        ],
        name: [
          { required: true, trigger: 'trigger', message: '请输入摄像头名称' }
        ],
        url: [
          { required: true, trigger: 'trigger', message: '请输入视频流信息' }
        ],
        manufacturer: [
          { required: true, trigger: 'trigger', message: '请输入制造厂商' }
        ],
        model: [
          { required: true, trigger: 'trigger', message: '请输入设备型号' }
        ],
        id: [
          { required: true, trigger: 'change', message: '请输入奖品名称' }/* ,
          { max: 32, message: '名称不得超过32个字符' } */
        ],
        inChargeId: [
          { required: true, trigger: 'trigger', message: '请输入负责人ID' }
        ],
        longitude: [
          { required: true, trigger: 'trigger', message: '请输入经度' }
        ],
        latitude: [
          { required: true, trigger: 'trigger', message: '请输入纬度' }
        ],
        address: [
          { required: true, trigger: 'trigger', message: '请输入地址' }
        ]
      },
      formInline: {
        searchkey: '',
        typeValue: 'map'
      },
      form: {
        id: '',
        inCharge: '',
        longitude: '',
        latitude: '',
        address: '',
        url: '',
        cl: '',
        name: '',
        createTime: ''
      },
      formInfo: [],
      hasMarker: false,
      showZwMes: true,
      typeOptions: [{ name: '地图模式', _id: 'map' },
        { name: '列表模式', _id: 'list' }],
      zoom: 11,
      center: [110.08, 34.57],
      dialogVisable: false,
      markersDom: null,
      markers: [],
      amapManager,
      events: {
        click: a => {
          /* this.$message({
            type: 'warning',
            message: '哈哈',
            duration: 0
          }) */
        }
      }
    }
  },
  watch: {
    markers(v) {
      setTimeout(() => {
        if (document.getElementsByClassName('markerImg').length) {
          this.hasMarker = true
        } else {
          this.hasMarker = false
        }
      }, 200)
    },
    hasMarker(v) {
      const that = this
      if (v) {
        [].forEach.call(document.getElementsByClassName('markerImg'), function(item, index) {
          if (index === 0) {
            item.classList.add('markerClickImg')
            that.form = JSON.parse(item.attributes[1].nodeValue)
            that.form.createTime = moment(that.form.createTime).format('YYYY-MM-DD HH:mm:SS')
            that.showZwMes = false
          }
        })
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    delAlert() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = [this.form.id]
        delCamera(params).then(response => {
          this.getList()
          this.delIDArr = []
        })
      })
    },
    watchClick(e) {
      if (!e.path.some(item => item.className === 'amap-marker-content')) {
        return
      }
      const marImgs = document.getElementsByClassName('markerImg');
      [].forEach.call(marImgs, function(item) {
        item.classList.remove('markerClickImg')
      })
      e.path.forEach(item => {
        if (item.className === 'amap-marker-content') {
          item.childNodes[1].classList.add('markerClickImg')
          this.form = JSON.parse(item.childNodes[1].attributes[1].nodeValue)
          this.form.createTime = moment(this.form.createTime).format('YYYY-MM-DD HH:mm:SS')
          this.showZwMes = false
        }
      })
    },
    editDialog(v) {
      this.editForm = this.form
      this.editVisable = true
    },
    editCloseDialog() {
      this.editVisable = false
    },
    editDialogConfirm() {
      const params = [{
        id: this.editForm.id,
        inChargeId: this.editForm.inChargeId,
        latitude: this.editForm.latitude,
        longitude: this.editForm.longitude,
        url: this.editForm.url,
        name: this.editForm.inCharge.username
      }]
      editCamera(params).then(response => {
        this.getList()
      })
      this.editVisable = false
    },
    editDialogQuxiao() {
      this.editVisable = false
    },
    create() {
      this.dialogVisable = true
    },
    onSearch() {
      this.getList()
      this.formInline.searchkey = ''
    },
    checkModel() {
      this.$emit('getdata', this.formInline.typeValue)
    },
    closeDialog() {
      this.dialogForm = {
        id: '',
        inCharge: '',
        longitude: '',
        latitude: '',
        address: ''
      }
      this.dialogVisable = false
    },
    getdata(v) {
      this.formInline.typeValue = v
    },
    dialogQuxiao() {
      this.dialogVisable = false
    },
    dialogConfirm() {
      const params = [
        this.dialogForm
      ]
      addCamera(params).then(res => {
        this.getList()
        this.dialogVisable = false
      })
    },
    positionClick(i) {
      console.log(i)
    },
    markerClick() {
      console.log('哈哈哈')
    },
    getList() {
      const params = {
        cascade: true,
        page: {
          index: 1,
          size: 20
        },
        params: {
          address: this.formInline.searchkey ? this.formInline.searchkey : null
        }
      }
      fetchAllCameraList(params).then(res => {
        this.formInfo = res.body.data
        /*  this.formInfo.forEach(item => {
          item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:SS')
        }) */
        this.markers = []
        this.showZwMes = true
        if (document.getElementsByClassName('markerClickImg').length) {
          document.getElementsByClassName('markerClickImg')[0].classList.remove('markerClickImg')
        }
        this.formInfo.forEach(item => {
          this.markers.push({ position: [item.longitude, item.latitude], /* content: `<img class='markerImg' data=${JSON.stringify(item)} src="https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png" style="width: 19px; height: 33px; top: 0px; left: 0px;">`, */
            content: `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg  class='markerImg'  data=${JSON.stringify(item)}  t="1599121043094" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2907" xmlns:xlink="http://www.w3.org/1999/xlink" width="40" height="40"><defs><style type="text/css"></style></defs><path d="M512.575 66.562c90.534 0 172.507 36.713 231.841 96.047 59.349 59.334 96.046 141.306 96.046 231.841 0 90.551-36.696 172.522-96.046 231.856-59.334 59.349-141.307 96.047-231.841 96.047-90.535 0-172.522-36.698-231.856-96.047C221.383 566.972 184.687 485 184.687 394.45c0-90.536 36.696-172.507 96.032-231.841 59.333-59.334 141.32-96.047 231.856-96.047zM441.27 439.874c16.993-53.202 41.838-91.409 97.927-125.07-60.031-17.437-129.499 48.742-97.927 125.07z m130.284 319.798v53.364l204.863 36.253v109.068H258.999V849.289l194.611-36.253v-53.349a267.622 267.622 0 0 0 58.965 6.563c20.266 0 40-2.282 58.979-6.578z m-58.979-515.121c-41.408 0-78.891 16.785-106.002 43.896-27.127 27.142-43.913 64.624-43.913 106.002 0 41.393 16.786 78.891 43.913 106.017 27.112 27.112 64.594 43.898 106.002 43.898 41.393 0 78.875-16.786 106.002-43.898 27.127-27.127 43.896-64.624 43.896-106.017 0-41.378-16.77-78.86-43.896-106.002-27.127-27.111-64.609-43.896-106.002-43.896z m73.348 76.564c-18.771-18.771-44.711-30.385-73.349-30.385-28.653 0-54.58 11.615-73.35 30.385-18.771 18.757-30.385 44.697-30.385 73.335 0 28.653 11.615 54.58 30.385 73.365 18.771 18.755 44.697 30.385 73.35 30.385 28.638 0 54.578-11.63 73.349-30.385 18.771-18.786 30.372-44.713 30.372-73.365 0-28.638-11.601-54.578-30.372-73.335z m71.424-71.439c-37.038-37.038-88.239-59.956-144.772-59.956-56.55 0-107.751 22.918-144.789 59.956-37.053 37.053-59.956 88.24-59.956 144.774 0 56.55 22.903 107.751 59.956 144.789 37.038 37.051 88.239 59.971 144.789 59.971 56.534 0 107.735-22.92 144.772-59.971C694.4 502.201 717.32 451 717.32 394.45c0-56.534-22.92-107.721-59.973-144.774z" p-id="2908"></path></svg>`
          })
        })
      })
    }
  }
}
</script>

<style lang='scss'>
 .filter-item  {
   input {
    font-size: 12px !important;
   }
 }
.main-container {
  height: 100%;
}
.app-main {
  height: 100%;
}
.cameraIndex {
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
       height: 98%;
     }
     .mapcontainer {
       height: 100%;
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
       .el-icon-warning {
         color: #E6A23C;
       }
       .el-icon-warning:before {
         display: block;
         width: 50px;
         height: 50px;
       }
       .el-form {
         padding: 5px;
         font-size: 12px !important;
         overflow:auto !important;
       }
       .el-form-item__label {
         font-weight: 500 !important;
         font-size: 12px !important;
         padding-right: 3px;
       }
       .el-form-item {
         margin-bottom: 10px;
         font-size: 12px !important;
       }
       .el-form-item__content {
         font-size: 12px !important;
       }
     }
   }
 }
 .markerImg {
   fill: #3E94F9;
 }
 .markerClickImg {
   fill: #E6A23C !important;
 }
</style>
