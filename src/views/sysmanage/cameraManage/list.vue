<template>
  <div class="cameralist">
    <div class="app-container" style="padding: 20px">
      <div class="filter-container clearfix">
        <div class="pull-left">
          <!--  <el-button class="filter-item" type="warning" icon="el-icon-plus" @click="create">{{ '新增摄像头' }}</el-button> -->
          <el-button type="warning" size="small" style="height:36px;" @click="batchesDel">{{ '批量删除' }}</el-button>
          <!--  <el-dialog :visible="dialogVisable" title="新增摄像头" width="520px" @close="closeDialog">
            <el-form ref="addForm" :model="dialogForm" :rule="addrules" label-position="right" label-width="130px">
              <el-form-item label="摄像头ID："><el-input v-model="dialogForm.id" placeholder="请输入摄像头ID" class="filter-item" style="width: 240px;"></el-input>
              </el-form-item>
              <el-form-item label="负责人：">
                <el-select v-model="dialogForm.inChargeId" :value="dialogForm.inChargeId" style="width:240px;" placeholder="请选择岗位">
                  <el-option v-for="item in userList" :value="item.id" :label="item.name" :key="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="制造厂商："><el-input v-model="dialogForm.manufacturer" placeholder="请输入制造厂商" class="filter-item" style="width: 240px;"></el-input>
              </el-form-item>
              <el-form-item label="设备型号："><el-input v-model="dialogForm.model" placeholder="请输入设备型号" class="filter-item" style="width: 240px;"></el-input>
              </el-form-item>
              <el-form-item label="视频流："><el-input v-model="dialogForm.url" placeholder="请输入视频流" class="filter-item" style="width: 240px;"></el-input>
              </el-form-item>
              <el-form-item label="手机："><el-input v-model="dialogForm.phone" placeholder="请输入手机" class="filter-item" style="width: 240px;"></el-input>
              </el-form-item>
              <el-form-item label="摄像头经度："><el-input v-model="dialogForm.longitude" type="num" placeholder="请输入摄像头经度" class="filter-item" style="width: 240px;"></el-input>
              </el-form-item>
              <el-form-item label="摄像头纬度："><el-input v-model="dialogForm.latitude" type="num" placeholder="请输入摄像头纬度" class="filter-item" style="width: 240px;"></el-input>
              </el-form-item>
              <el-form-item label="地址："><el-input v-model="dialogForm.name" placeholder="请输入地址" class="filter-item" style="width: 240px;"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button
                type="primary"
                @click="dialogConfirm('dialogForm')"
              >确 定</el-button>
              <el-button @click="dialogQuxiao">取 消</el-button>
            </div>
          </el-dialog>-->
        </div>
        <div class="pull-right">
          <el-select
            v-model="formInline.typeValue"
            style="width:120px;"
            class="filter-item"
            @change="checkModel"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        :header-cell-class-name="tableRowClassHeader"
        class="amountdetailTable"
        style="width: 100%"
        tooltip-effect="dark"
        fit
        @filter-change="filerStatus"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'摄像头ID'" prop="id"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'摄像头状态'" prop="online">
          <template slot-scope="scope">
            <svg-icon
              v-if="scope.row.online"
              style="font-size:6px;line-height:23px;margin-bottom:2px;"
              icon-class="offline"
            />
            <svg-icon
              v-else
              style="font-size:6px;line-height:23px;margin-bottom:2px;"
              icon-class="online"
            />
            <span>{{ scope.row.online ? "离线":"在线" }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'负责人'" prop="inCharge.name"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'摄像头经纬度'">
          <template slot-scope="scope">
            <span>{{ scope.row.longitude+ ', ' + scope.row.latitude }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'摄像头名称'" prop="name"></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          :formatter="formatTime"
          :label="'添加时间'"
          prop="createTime"
        ></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'视频流信息'" prop="isDeal">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.isDeal" class="deal" icon-class="deal" />
            <svg-icon v-else class="untreated" icon-class="untreated2" />
            <span>{{ scope.row.isDeal ? "已处理":"未处理" }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'告警信息'" prop="dealSum"></el-table-column>
        <!-- <el-table-column :show-overflow-tooltip="true" :label="'操作'"> -->
        <el-table-column :label="'操作'" width="140px">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editDialog(scope.row)">{{ '编辑' }}</el-button>
            <el-button
              :disabled="(scope.row.online==1)"
              type="text"
              size="small"
              @click="configDialog(scope.row.id)"
            >{{ '配置' }}</el-button>
            <el-button type="text" size="small" @click="delAlert(scope.row.id)">{{ '删除' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible="editVisable" title="编辑" width="520px" @close="editCloseDialog">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-position="right" label-width="130px">
          <el-form-item label="摄像头ID：" prop="id">
            <el-input
              v-model="editForm.id"
              placeholder="请输入摄像头ID"
              class="filter-item"
              style="width: 300px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="摄像头经纬度：" prop="tude">
            <el-input
              v-model="editForm.tude"
              type="text"
              placeholder="请输入摄像头经纬度"
              style="width:300px;"
              class="filter-item"
            ></el-input>
          </el-form-item>
          <el-form-item label="视频流信息：" prop="url">
            <el-input
              v-model="editForm.url"
              placeholder="请输入视频流信息"
              class="filter-item"
              style="width: 300px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="地址：" prop="name">
            <el-input
              v-model="editForm.name"
              :rows="4"
              type="textarea"
              placeholder="请输入地址"
              class="filter-item"
              style="width: 300px;"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editDialogConfirm">确 定</el-button>
          <el-button @click="editDialogQuxiao">取 消</el-button>
        </div>
      </el-dialog>

      <el-dialog
        :visible="configVisable"
        :title="configName"
        width="920px"
        center
        @close="configCloseDialog"
      >
        <VideoConfig
          v-if="configVisable"
          :device-id="currentPickDeviceId"
          :arr2="algorithmListTwoDim"
          @canvasShow="setCanvasShow"
        ></VideoConfig>
        <!-- <VideoConfig :deviceId='currentPickDeviceId' v-if="configVisable" :arr2='algorithmListTwoDim'></VideoConfig> -->
        <span v-show="!canvasShowStatus" slot="footer" class="dialog-footer">
          <el-button @click="applyAlgorithms(false)">取消</el-button>
          <el-button type="primary" @click="applyAlgorithms(true)">确定</el-button>
        </span>
      </el-dialog>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="page"
        :limit.sync="limit"
        @pagination="pageChange()"
      />
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Cookies from 'js-cookie'
import Pagination from '@/components/Pagination'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import {
  fetchAllCameraList,
  editCamera,
  addCamera,
  delCamera
} from '@/api/camera'
import { fetchUserList } from '@/api/users'
import VideoConfig from '@/components/VideoConfig'
import client from '@/api/vedioAlgo'

export default {
  components: { Pagination, VideoConfig },
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
      editFormRules: {
        creator: [
          { required: true, trigger: 'blur', message: '请选择负责人' }
        ],
        url: [
          { required: true, trigger: 'blur', message: '视频流信息不能为空' }
        ],
        tude: [
          { required: true, trigger: 'blur', message: '经纬度信息不能为空' },
          {
            pattern: /^[\-\+]?(0?\d{1,2}\.\d{1,6}|1[0-7]?\d{1}\.\d{1,6}|180\.0{1,6})\,[\-\+]?([0-8]?\d{1}\.\d{1,6}|90\.0{1,6})/g,
            message: '请输入正确经纬度信息',
            trigger: 'blur'
          }
        ],
        manufacturer: [
          { required: true, trigger: 'blur', message: '制造厂商不能为空' }
        ],
        model: [
          { required: true, trigger: 'blur', message: '摄像头型号不能为空' }
        ],
        id: [{ required: true, trigger: 'blur', message: '摄像头ID不能为空' }],
        inChargeId: [
          { required: true, trigger: 'blur', message: '负责人ID不能为空' }
        ],
        longitude: [
          { required: true, trigger: 'blur', message: '经度不能为空' }
        ],
        latitude: [
          { required: true, trigger: 'blur', message: '纬度不能为空' }
        ],
        name: [{ required: true, trigger: 'blur', message: '地址不能为空' }]
      },
      formInline: {
        searchkey: '',
        typeValue: 'list'
      },
      typeOptions: [
        { name: '地图模式', _id: 'map' },
        { name: '列表模式', _id: 'list' }
      ],
      listLoading: false,
      filteredValue: [],
      tableData: [],
      dialogVisable: false,
      total: 0, // 假的 最后是拿到后端的pageInfo的totalItems
      page: 1,
      limit: 10,
      userId: '',
      originCode: '',
      oldSize: 10,
      delIDArr: [],
      editVisable: false,
      editForm: {
        id: '',
        inChargeId: '',
        longitude: '',
        latitude: '',
        address: '',
        url: '',
        name: '',
        creatorId: '',
        tude: ''
      },
      userList: [],
      creatorName: '',
      configVisable: false,
      currentPickDeviceId: '',
      algorithmList: [],
      algorithmListCopy: [],
      algorithmListTwoDim: [],
      timer: '11',
      canvasShowStatus: false,
      configName: '视频AI配置',
      tableLoading: null
    }
  },
  watch: {
    limit() {
      this.page = 1
      this.pageChange()
    }
  },
  async created() {
    this.userId = Cookies.get('userId')
    await Message.closeAll()
    await this.getUserList()
    await this.getList()
  },
  methods: {
    setCanvasShow(payload) {
      this.canvasShowStatus = payload
      if (payload == true) {
        this.configName = ''
      } else {
        this.configName = '视频AI配置'
      }
    },
    async getAlgorithmList(deviceId) {
      const { body: res } = await client.getInstanceList(deviceId)
      this.algorithmList = res.data
      this.algorithmListCopy = JSON.parse(JSON.stringify(this.algorithmList))
      this.algorithmList = this.algorithmList.map(this.saveUpdatePick)
      this.algorithmListTwoDim = this.changeToTwoDiArray(this.algorithmList, 3)
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
    applyAlgorithms(flag) {
      if (flag) {
        // 先组装参数，包含删除、增加、修改
        var allDatas = []
        var nowAlgorithmList = [].concat.apply([], this.algorithmListTwoDim)
        var params = []
        var flag = true
        for (var i = 0; i < nowAlgorithmList.length; i++) {
          var algorithmObject = nowAlgorithmList[i]
          var param = {
            taskId: algorithmObject.id,
            id: algorithmObject.id,
            taskName: algorithmObject.name
          }
          if (algorithmObject.originalPickStatus && !algorithmObject.isPick) {
            // 删除
            param['action'] = 'delete'
            params.push(param)
          } else if (
            !algorithmObject.originalPickStatus &&
            algorithmObject.isPick
          ) {
            // 增加(检查，如果该配置的没有配置需要弹窗告警)
            param['action'] = 'add'
            if (algorithmObject.isNeedConfig) {
              var areas = algorithmObject['areas']
              if (areas == undefined || areas.length == 0) {
                // alert(algorithmObject.cnName+"没有标注，请标注再提交或者取消选择")
                this.$message({
                  showClose: false,
                  message:
                    algorithmObject.cnName +
                    '没有标注，请标注再提交或者取消选择',
                  type: 'error'
                })
                flag = false
                break
              } else {
                param['areas'] = this.formatAreas(
                  areas,
                  algorithmObject.ratiox,
                  algorithmObject.ratioy
                )
              }
            }
            params.push(param)
          } else if (
            algorithmObject.originalPickStatus &&
            algorithmObject.isPick &&
            !algorithmObject.isCommitStatus
          ) {
            // 修改、肯定需要标注（检查，如果该配置的没有配置需要弹窗告警）
            param['action'] = 'update'
            var areas = algorithmObject['areas']
            if (areas == undefined || areas.length == 0) {
              // alert(algorithmObject.cnName+"没有标注，请标注再提交或者取消选择")
              this.$message({
                showClose: false,
                message:
                  algorithmObject.cnName + '没有标注，请标注再提交或者取消选择',
                type: 'error'
              })
              flag = false
              break
            }
            param['areas'] = this.formatAreas(
              areas,
              algorithmObject.ratiox,
              algorithmObject.ratioy
            )
            params.push(param)
          }
        }
        if (flag) {
          if (params.length > 0) {
            var finalBody = {
              deviceId: this.currentPickDeviceId,
              taskInstParams: params
            }
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
    async configTask(body) {
      const res = await client.configInstance(body)
    },
    configDialog(v) {
      this.currentPickDeviceId = v
      this.timer = new Date().getTime()
      this.configVisable = true
      this.getAlgorithmList(v)
    },
    configCloseDialog() {
      this.configVisable = false
    },
    getUserList() {
      const query = {
        cascade: true,
        page: {
          index: 1,
          size: 9999999
        },
        params: {}
      }
      fetchUserList(query).then(response => {
        if (response.code !== 0) return
        this.userList = response.body.data
        this.userList.forEach(item => {
          if (item.id === +this.userId) {
            this.creatorName = item.name
          }
        })
      })
    },
    batchesDel() {
      if (!this.delIDArr.length) {
        this.$message({
          message: '请选择需要删除的摄像头!',
          type: 'warning'
        })
      } else {
        this.$confirm('此操作将永久删除选中数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = [...this.delIDArr]
          delCamera(params)
            .then(response => {
              this.getList()
              this.delIDArr = []
            })
            .catch(() => {
              this.delIDArr = []
            })
        })
      }
    },
    delAlert(d) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = [d]
        delCamera(params).then(response => {
          this.getList()
          this.delIDArr = []
        })
      })
    },
    formatTime: function(row, column, cellValue) {
      return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
    },
    editDialog(v) {
      this.editForm.id = v.id
      this.editForm.creatorId = v.creatorId
      this.editForm.tude = v.longitude + ',' + v.latitude
      this.editForm.inChargeId = v.inChargeId
      this.editForm.longitude = v.longitude
      this.editForm.latitude = v.latitude
      this.editForm.name = v.name
      this.editForm.name = v.name
      this.editForm.url = v.url
      this.editVisable = true
    },
    editCloseDialog() {
      this.editVisable = false
    },
    editDialogConfirm() {
      this.$refs.editFormRef.validate(valid=>{
        if(!valid) return;
        const params = [
          {
            id: this.editForm.id,
            inChargeId: this.editForm.inChargeId,
            latitude: this.editForm.tude.split(',')[1].trim(),
            longitude: this.editForm.tude.split(',')[0].trim(),
            url: this.editForm.url,
            name: this.editForm.name,
            creatorId: this.editForm.creatorId
          }
        ]
        editCamera(params).then(response => {
          this.$notify({
            title: '成功',
            message: '编辑成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
          this.editVisable = false
        })
      })

    },
    editDialogQuxiao() {
      this.editVisable = false
    },
    create() {
      this.dialogVisable = true
    },
    closeDialog() {
      this.dialogVisable = false
    },
    onSearch() {},
    checkModel() {
      this.$emit('getdata', this.formInline.typeValue, true)
    },
    // 表头样式
    tableRowClassHeader({ row, rowIndex }) {
      return 'tableRowClassHeader'
    },
    pageChange() {
      if (this.oldSize !== this.limit) {
        this.page = 1
      }
      this.oldSize = this.limit
      this.getList()
    },
    goBack() {
      this.$router.go(-1)
    },
    filerStatus(columnObj) {
      for (const key in columnObj) {
        this.originCode = columnObj[key][0]
      }
      this.page = 1
      let columnObjKey = ''
      for (var i in columnObj) {
        columnObjKey = i
      }
      if (columnObj[columnObjKey].length === 0) {
        this.filteredValue = []
        this.getList()
      } else {
        this.filteredValue = columnObj[columnObjKey]
        this.getList()
      }
    },
    // 获取列表数据
    getList() {
      this.tableLoading = true
      const params = {
        cascade: true,
        page: {
          index: this.page,
          size: this.limit
        },
        params: {
          // inChargeId: this.userId
        }
      }
      fetchAllCameraList(params).then(res => {
        this.tableData = res.body.data
        this.total = res.body.page.total
        setTimeout(() => {
          var cellArr = document.getElementsByClassName('cell')
          var arr = Array.from(cellArr)
          arr.forEach(item => {
            item.style.lineHeight =
              (document.getElementsByTagName('html')[0].clientHeight - 260) /
                11 +
              'px'
            item.style.paddingTop = '2px'
            item.style.paddingBottom = '2px'
          })
        }, 100)
        this.listLoading = false
        this.tableLoading = false
      })
    },
    handleSelectionChange(val) {
      this.delIDArr = val.map(item => {
        return item.id
      })
    },
    dialogQuxiao() {
      this.dialogVisable = false
    },
    dialogConfirm() {
      this.$refs.addForm.validate(valid => {
        if (!valid) return
        const params = [{ ...this.dialogForm, creatorId: this.userId }]
        addCamera(params)
          .then(res => {
            this.dialogForm = {
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
            }
            this.$notify({
              title: '成功',
              message: '增加成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
            this.dialogVisable = false
          })
          .catch(() => {
            this.$notify({
              title: '失败',
              message: '增加失败',
              type: 'error',
              duration: 2000
            })
          })
      })
    }
  }
}
</script>

<style lang='scss'>
.cameralist {
  overflow: auto !important;
  .el-button--text {
    color: #fa8334 !important;
  }
  .el-button.is-disabled {
    color: #c0c4cc !important;
  }
  td,th {
    padding:0px;
  }
}
.app-main {
  padding-top: 50px;
}
</style>

