<template>
  <div class="list">
    <div class="app-container" style="padding: 20px;">
      <div class="filter-container clearfix">
        <div class="pull-right alarmmsgright">
          <el-button
            v-waves
            class="filter-item sureItem"
            size="mini"
            type="warning"
            style="margin-bottom: 2px"
            @click="onSearch"
          >{{ '确定' }}</el-button>
          <button
            class="filter-item clearsearch"
            style="font-size:12px; width: 20%;height:36px;"
            icon="el-icon-refresh"
            @click="resetQuery"
          >重置</button>
          <span class="open" @click="opendraw">
            展开
            <i class="el-icon-arrow-down"></i>
          </span>
        </div>
        <div class="pull-left alarmmsgleft">
          <div class="block filter-item">
            <div style="margin-top: 10px; margin-right: 8px; font-size: 12px;">设备名称:</div>
          </div>
          <el-input
            v-model="formInline.searchkey"
            placeholder="设备名称"
            class="searchinp"
            size="mini"
            @keyup.enter.native="onSearch"
          >
          </el-input>
          <div class="block filter-item">
            <div style="margin-top: 10px; margin-right: 8px; margin-left: 6px; font-size: 12px;">事件名称:</div>
          </div>
          <el-select
            v-model="algorithmList.typeValue"
            multiple
            placeholder="请选择事件名称"
            min-width="300px"
            collapse-tags
            @change="checkModel"
          >
            <el-option
              v-for="item in algorithm"
              :key="item._id"
              :label="item.name"
              :value="item._id">
            </el-option>
          </el-select>
          <div class="block filter-item">
            <div style="margin-top: 10px; margin-right: 8px; margin-left: 6px; font-size: 12px;">算法名称:</div>
          </div>
          <el-select
            v-model="algorithmNameList.typeValue"
            multiple
            placeholder="请选择算法名称"
            min-width="350px"
            collapse-tags
            @change="algorithmCheck"
          >
            <el-option
              v-for="item in algorithmName"
              :key="item._id"
              :label="item.name"
              :value="item._id">
            </el-option>
          </el-select>
          <div class="draw">
            <div class="block filter-item">
              <div style="margin-right: 8px;font-size: 12px">选择日期:</div>
            </div>
            <div class="block filter-item">
              <el-date-picker
                v-model="value1"
                :clearable="false"
                :style="{width:210 + 'px', height: 36 + 'px'}"
                :picker-options="pickerOptions"
                type="daterange"
                range-separator="to"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                size="mini"
                @change="timeChange"
              ></el-date-picker>
            </div>
            <div class="block filter-item">
              <div style="margin-right: 8px; margin-left: 6px; font-size: 12px;">开始时间:</div>
            </div>
            <div class="block filter-item">
              <el-time-picker
                :style="{width:95 + 'px',height:'36px'}"
                v-model="startTime"
                :picker-options="{
                  selectableRange:'00:00:00-23:59:00'
                }"
                size="mini"
                format="HH:mm"
                value-format="HH:mm"
              ></el-time-picker>
            </div>
            <div class="block filter-item">
              <div style="margin-right: 8px; margin-left: 6px; font-size: 12px">结束时间:</div>
            </div>
            <div class="block filter-item">
              <el-time-picker
                :style="{width:95 + 'px', height: 36 + 'px'}"
                v-model="endTime"
                :picker-options="{
                  selectableRange:startTime+ ':00' + '-23:59:00'
                }"
                size="mini"
                format="HH:mm"
                value-format="HH:mm"
              ></el-time-picker>
            </div>
          </div>

        </div>
      </div>
      <div>
        <el-tabs v-model="defaultTab" type="border-card" @tab-click="tabChangeQuery">
          <el-tab-pane v-for="item in tabsArr" :key="item" :label="item" :name="item">
            <el-table
              :data="tableData"
              :header-cell-class-name="tableRowClassHeader"
              class="alaMesTable"
              style="width: 100%"
              tooltip-effect="dark"
              fit
            >
              <el-table-column
                :show-overflow-tooltip="true"
                :formatter="formatTime"
                :label="'时间'"
                align="center"
                min-width="4%"
                prop="createTime"
              ></el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                :formatter="formatType"
                :label="'事件'"
                align="center"
                min-width="5%"
                prop="type"
                width="100"
              ></el-table-column>
              <!-- <el-table-column
                :show-overflow-tooltip="true"
                :label="'内容'"
                align="center"
                min-width="10%"
                prop="content"
                width="100"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.content ? scope.row.content:'-' }}</span>
                </template>
              </el-table-column>-->
              <el-table-column
                :show-overflow-tooltip="true"
                :label="'布控标签'"
                align="center"
                min-width="4%"
              >
                <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.label === 1 ? 'success':scope.row.label === 2? 'danger':'' "
                  >{{ scope.row.label === 1 ? '白名单':scope.row.label === 2? '黑名单':'其他' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                :label="'设备名称'"
                align="center"
                min-width="8%"
                prop="camera.name"
              >
                <template slot-scope="scope">
                  <span style="text-indent:30px">{{ scope.row.camera ? scope.row.camera.name:'-' }}</span>
                </template>
              </el-table-column>
              <!--  <el-table-column :show-overflow-tooltip="true" :label="'摄像头'" min-width="15%" prop="camera.name"></el-table-column> -->
              <el-table-column :label="'图片'" align="center" min-width="6%">
                <template slot-scope="scope">
                  <!-- <el-popover
                    placement="left"
                    trigger="hover"
                  >
                    <el-image :src="scope.row.imageCompress" style="width:340px; height:194px;"/>
                    <el-image slot="reference" :src="scope.row.imageCut" class="image" @click="openBig(scope.row.image)" />
                  </el-popover>-->
                  <el-image
                    :src="scope.row.imageCompress"
                    style="object-fit:fill;"
                    @click="openBig(scope.row.image)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                :label="'算法名称'"
                :formatter="formattername"
                align="center"
                min-width="5%"
                prop="taskId"
              ></el-table-column>
              <!--    <el-table-column
                :show-overflow-tooltip="true"
                :label="'处理结果'"
                align="center"
                min-width="5%"
                prop="handlerId"
                width="100"
              >
                <template slot-scope="scope">
                  <svg-icon v-if="scope.row.handlerId" class="deal" icon-class="deal" />
                  <svg-icon v-else class="untreated" icon-class="untreated2" />
                  <span>{{ scope.row.handlerId ? "已处理":"未处理" }}</span>
                </template>
              </el-table-column>-->
              <el-table-column min-width="4%" align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="editDialog(scope.row)">详情</el-button>
                  <el-button type="text" size="small" @click="delAlert(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="page"
              :limit.sync="limit"
              :all-total="allTotal"
              :alarmtext="alarmtext"
              @pagination="pageChange()"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisable"
      v-model="temp"
      :show-close="false"
      width="500px"
      class="mesdialog"
      style="height:100%;"
      @close="closeDialog"
    >
      <div style="width:500px;height:320px; padding: 10px 10px 0px">
        <div :model="temp" label-position="right" label-width="100px">
          <div
            prop="image"
            style="width:480px;height:270px;position:relative;"
            @click="()=>{openBig(temp.image)}"
          >
            <img :src="temp.image" width="480" height="220" style="z-index:1;" >
            <CanvasDialog
              v-if="dialogVisable"
              :img-url="temp.image"
              :left-top="[points[0],points[1]]"
              :name="temp.type === 1?'人员':temp.type === 2?'机动车':'非机动车'"
              :name-length="temp.type === 1?'2':temp.type === 2?'3':'4'"
              :right-bottom="[points[2],points[3]]"
              style="z-index:2;position:absolute;top:0;left:0;"
            ></CanvasDialog>
          </div>
          <div class="popfooter">
            <el-tooltip
              :content="temp.camera.name"
              class="item"
              effect="light"
              placement="top-start"
            >
              <div class="popfooteraddress">
                <svg-icon icon-class="pulladdress" style="color:#898989;"></svg-icon>
                <span style="width: 260px;">{{ temp.camera?temp.camera.name : '' }}</span>
              </div>
            </el-tooltip>
            <div class="popfootertime">
              <svg-icon icon-class="pulltime" style="color:#a6a6a6;"></svg-icon>
              <span style="width: 260px;">
                {{
                  renderTime(temp.createTime)
                }}
              </span>
            </div>
          </div>
        </div>
        <!-- <div slot="footer" class="dialog-footer" style="text-align: center; margin-top: 10px">
          <el-button
            class="warnnormal popwarn"
            round
            style="border-radius: 2px"
            @click="dialogConfirm"
          >
            <span class="spantext">正 常</span>
          </el-button>
          <el-button
            class="warnunnormal popwarn"
            type="warning"
            round
            style="border-radius: 2px"
            @click="dialogQuxiao"
          >
            <span class="spantext">异 常</span>
        </el-button>-->

        <!-- >
            <el-form-item label="设备名称：" prop="camera.name">
              <span style="width: 300px;">{{ temp.camera | formatNull }}</span>
            </el-form-item>
            <el-form-item label="监控时间：" prop="createTime">
              <span style="width: 300px;"></span>
              {{ renderTime(temp.createTime) }}
            </el-form-item>
            <el-form-item label="原始照片：" prop="image">
              <el-image
                :src="temp.imageCompress"
                style="width:525px; height:300px"
                @click="()=>{openBig(temp.image)}"
              ></el-image>
            </el-form-item>
            <el-form-item label="结构化照片：" prop="imageCut">
              <el-image :src="temp.imageCut"></el-image>
            </el-form-item>
            <el-form-item v-if="temp.type === 1 || temp.type === 2" label="触发事件:" prop="type">
              <span v-if="temp.type === 1">人员</span>
              <span v-else-if="temp.type === 2">机动车</span>
            </el-form-item>
            <el-form-item v-if="temp.label || temp.label === null" label="布控标签:" prop="label">
              <span v-if="temp.label === 1">白名单</span>
              <span v-else-if="temp.label === 2">黑名单</span>
              <span v-else>其他</span>
            </el-form-item>

            <el-form-item v-if="temp.license" label="车牌:" prop="license">
              <span>{{ temp.license }}</span>
            </el-form-item>

        </el-form>-->
        <!-- </div> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { renderTime } from '@/utils'
import Cookies from 'js-cookie'
import Pagination from '@/components/Pagination'
import CanvasDialog from '@/components/CanvasDialog'
// import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import { mapGetters } from 'vuex'
import {
  getAlertInfos,
  deleteAlertInfo,
  getPushSet,
  notifyState,
  getAllTotal
} from '@/api/alarm'
export default {
  components: { Pagination, CanvasDialog },
  filters: {
    formatNull: function(val) {
      if (!val) return '无'
      return val.name
    }
  },
  data() {
    return {
      alarmtext: '当日告警总计',
      renderTime,
      else: '其他',
      temp: {
        camera: {},
        createTime: '',
        image: '',
        imageCut: ''
      },
      points: [],
      rowId: 0,
      defaultTab: '',
      state: '',
      value1: [
        new Date(new Date().setDate(new Date().getDate() - 29)),
        new Date(new Date().setDate(new Date().getDate()))
      ],
      startTime: '',
      endTime: '',
      startDate: '',
      endDate: '',
      tabsArr: [],
      tabsDateArr: [],
      currentTab: '',
      formInline: {
        searchkey: '',
        typeValue: 'all'
      },
      typeOptions: [
        { name: '所有警告', _id: 'all' },
        { name: '已处理', _id: 'settled' },
        { name: '未处理', _id: 'unsettled' }
      ],
      algorithmList: {
        searchkey: '',
        typeValue: '行人'
      },
      algorithm: [
        { name: '行人', _id: 1 },
        { name: '机动车', _id: 2 },
        { name: '非机动车', _id: 3 },
        { name: '翻墙', _id: 4 },
        { name: '人员逗留', _id: 5 },
        { name: '人员聚集', _id: 6 },
        { name: '区域划线', _id: 7 },
        { name: '安全帽', _id: 8 },
        { name: '打架斗殴', _id: 9 },
        { name: '摔倒', _id: 10 },
        { name: '占道经营', _id: 11 }
      ],
      algorithmNameList: {
        searchkey: '',
        typeValue: '值更检测'
      },
      algorithmName: [
        { name: '值更检测', _id: 1 },
        { name: '人脸识别', _id: 2 },
        { name: '车牌识别', _id: 3 },
        { name: '人脸对比', _id: 4 },
        { name: '人脸属性', _id: 5 },
        { name: '区域划线告警', _id: 6 },
        { name: '翻墙检测', _id: 7 },
        { name: '人流识别', _id: 8 },
        { name: '车流识别', _id: 9 },
        { name: '安全帽识别', _id: 10 },
        { name: '工服识别', _id: 11 },
        { name: '车型检测', _id: 12 },
        { name: '人群聚集检测', _id: 13 },
        { name: '打架斗殴检测', _id: 14 },
        { name: '摔倒检测', _id: 15 },
        { name: '占道经营检测', _id: 16 },
        { name: '人员逗留检测', _id: 17 },
        { name: '推流任务', _id: 18 }
      ],
      listLoading: false,
      filteredValue: [],
      tableData: [],
      dialogVisable: false,
      total: 0, // 假的 最后是拿到后端的pageInfo的totalItems
      allTotal: 0,
      page: 1,
      limit: 10,
      userId: '',
      originCode: '',
      oldSize: 10,
      tableHeight: null,
      editVisable: false,
      hasTdHeight: false,
      editForm: {
        id: '',
        inCharge: '',
        longitude: '',
        latitude: '',
        // address: '',
        url: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      warngingKind: {
        1: '行人',
        2: '机动车',
        3: '非机动车',
        4: '翻墙',
        5: '人员逗留',
        6: '人员聚集',
        7: '区域划线',
        8: '安全帽',
        9: '打架斗殴',
        10: '摔倒',
        11: '占道经营'
      },
      warngingname: {
        1: '值更检测',
        2: '人脸识别',
        3: '车牌识别',
        4: '人脸比对',
        5: '人脸属性',
        6: '区域划线告警',
        7: '翻墙检测',
        8: '人流识别',
        9: '车流识别',
        10: '安全帽识别',
        11: '工服识别',
        12: '车型检测',
        13: '人群聚集检测',
        14: '打架斗殴检测',
        15: '摔倒检测',
        16: '占道经营检测',
        17: '人员逗留检测',
        18: '推流任务'
      }
    }
  },
  watch: {
    limit() {
      this.page = 1
      this.pageChange()
    }
  },
  created() {
    this.userId = Cookies.get('userId');
    (this.value1 = [
      new Date(new Date().setDate(new Date().getDate() - 29)),
      new Date(new Date().setDate(new Date().getDate()))
    ]),
    this.timeChange()
    this.value1 = ''
    this.tabsArr = this.getDayAll(this.startDate, this.endDate).reverse()
    this.defaultTab = this.tabsArr[0]
    this.currentTab = this.defaultTab
    this.getPushSetTime()
    // const s = this.tabsArr[0] + ' ' + this.startTime + ':00'
    // const e = this.tabsArr[0] + ' ' + this.endTime + ':00'
    // const h = this.formInline.typeValue
    // const s1 = this.startDate + 'T' + this.startTime + ':00.000Z'
    // const e1 = this.endDate + 'T' + this.endTime + ':00.000Z'
    // this.getTimeAllTotal(s1, e1, h)
    // this.getList(s, e, h)
  },
  mounted() {
    // var tdHeight = document.getElementsByClassName('el-table__body')[0].clientHeight / 10
  },
  methods: {
    opendraw() {

    },
    openBig(url) {
      window.open(url)
    },
    delAlert(d) {
      this.rowId = d
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteAlert()
      })
    },
    formatTime: function(row, column, cellValue) {
      // YYYY-MM-DD
      return moment(cellValue).format('HH:mm:ss')
    },
    formatType(row, column, cellValue) {
      if (this.warngingKind[cellValue]) {
        return this.warngingKind[cellValue]
      }
      return '人员'
    },
    formattername(row, column, cellValue) {
      if (this.warngingname[cellValue]) {
        return this.warngingname[cellValue]
      }
      return '值更检测'
    },
    timeChange() {
      this.startDate = moment(this.value1[0]).format('YYYY-MM-DD')
      this.endDate = moment(this.value1[1]).format('YYYY-MM-DD')
      this.tabsDateArr = this.getDayAll(this.startDate, this.endDate).reverse()
    },
    getDayAll(start, end) {
      var result = []
      if (start === end) {
        result.push(start)
        return result
      }
      var beginDay = start.split('-')
      var endDay = end.split('-')
      var diffDay = new Date()
      var dateList = new Array()
      var i = 0
      diffDay.setDate(beginDay[2])
      diffDay.setMonth(beginDay[1] - 1)
      diffDay.setFullYear(beginDay[0])
      result.push(start)
      while (i == 0) {
        var countDay = diffDay.getTime() + 24 * 60 * 60 * 1000
        diffDay.setTime(countDay)
        dateList[2] = diffDay.getDate()
        dateList[1] = diffDay.getMonth() + 1
        dateList[0] = diffDay.getFullYear()
        if (String(dateList[1]).length == 1) {
          dateList[1] = '0' + dateList[1]
        }
        if (String(dateList[2]).length == 1) {
          dateList[2] = '0' + dateList[2]
        }
        result.push(dateList[0] + '-' + dateList[1] + '-' + dateList[2])
        if (
          dateList[0] == endDay[0] &&
          dateList[1] == endDay[1] &&
          dateList[2] == endDay[2]
        ) {
          i = 1
        }
      }

      return result
    },
    // 重置搜索
    // 重置
    resetQuery() {
      this.formInline.searchkey = ''
      this.page = 1
      this.limit = 10
      const s = this.currentTab + ' ' + this.startTime + ':00'
      const e = this.currentTab + ' ' + this.endTime + ':00'
      this.getList(s, e, 'all')
    },
    // 重置起止时间的搜索
    // onClear() {
    //   (this.value1 = [
    //     new Date(new Date().setDate(new Date().getDate() - 29)),
    //     new Date(new Date().setDate(new Date().getDate()))
    //   ]),
    //   (this.startDate = moment(this.value1[0]).format("YYYY-MM-DD"));
    //   this.endDate = moment(this.value1[1]).format("YYYY-MM-DD");
    //   (this.value1 = ""),
    //   (this.page = 1),
    //     // this.startTime = '02:00'
    //     // this.endTime = '05:00'
    //   (this.formInline.typeValue = "all");
    //   // this.tabsDateArr = this.getDayAll(this.startDate, this.endDate).reverse()
    //   // this.defaultTab=this.endDate
    //   // this.getList(s1, end1, h1)
    //   this.tabsArr = this.getDayAll(this.startDate, this.endDate).reverse();
    //   this.defaultTab = this.tabsArr[0];
    //   this.currentTab = this.defaultTab;
    //   this.getPushSetTime();
    //   // const s = this.tabsArr[0] + ' ' + this.startTime + ':00'
    //   // const e = this.tabsArr[0] + ' ' + this.endTime + ':00'
    //   // const h = this.formInline.typeValue
    //   // this.getList(s, e, h)

    //   // const s1 = this.startDate + 'T' + this.startTime + ':00.000Z'
    //   // const e1 = this.endDate + 'T' + this.endTime + ':00.000Z'
    //   // this.getTimeAllTotal(s1, e1, h)
    // },
    onSearch() {
      this.tabsArr = this.getDayAll(this.startDate, this.endDate).reverse()
      // this.tabsArr = this.tabsDateArr
      // this.value1=[ this.tabsArr[this.tabsArr.length - 1],this.tabsArr[0]
      // this.value1=[this.startDate,this.endDate]
      if (this.tabsArr.indexOf(this.currentTab) === -1) {
        this.defaultTab = this.tabsArr[0]
        this.currentTab = this.defaultTab
      }
      const s1 = this.currentTab + ' ' + this.startTime + ':00'
      const end1 = this.currentTab + ' ' + this.endTime + ':00'
      const h1 = this.algorithmList.typeValue
      const h2 = this.algorithmNameList.typeValue
      const h = {
        type: h1,
        taskId: h2
      }
      this.oldSize = this.limit
      this.getList(s1, end1, h)
      // 调用后续得到allTotal接口在created和onClear都要写
      const s =
        this.tabsArr[this.tabsArr.length - 1] +
        'T' +
        this.startTime +
        ':00.000Z'
      const end = this.tabsArr[0] + 'T' + this.endTime + ':00.000Z'
      this.getTimeAllTotal(s, end, h1)
    },

    editDialog(v) {
      setTimeout(() => {
        this.closeDialog()
      }, 0)
      setTimeout(() => {
        this.dialogVisable = true
      }, 1)
      this.temp = Object.assign({}, v)
      this.points = JSON.parse(this.temp.box)
      if (this.temp.box == null) {
        this.points = ''
      }
    },
    editCloseDialog() {
      this.editVisable = false
    },
    editDialogConfirm() {
      const params = [
        {
          id: this.editForm.id,
          inChargeId: this.editForm.inCharge,
          latitude: this.editForm.latitude,
          longitude: this.editForm.longitude,
          url: this.editForm.url
        }
      ]
      editCamera(params).then(response => {})
      this.editVisable = false
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
    checkModel() {
      console.log('ssssssssssss', this.algorithmList.typeValue)
      this.$emit('getdata', this.algorithmList.typeValue)
    },
    algorithmCheck() {
      console.log('ccccccccccccccc', this.algorithmNameList.typeValue)
      // this.$emit('getdata', this.algorithmNameList.typeValue)
    },
    // 表头样式
    tableRowClassHeader({ row, rowIndex }) {
      return 'tableRowClassHeader'
    },
    pageChange(e) {
      const s = this.currentTab + ' ' + this.startTime + ':00'
      const end = this.currentTab + ' ' + this.endTime + ':00'
      const h = this.formInline.typeValue
      this.oldSize = this.limit
      this.getList(s, end, h)
    },
    tabChangeQuery(e) {
      this.currentTab = e.label
      const s = e.label + ' ' + this.startTime + ':00'
      const end = e.label + ' ' + this.endTime + ':00'
      const h = this.formInline.typeValue
      this.page = 1
      this.getList(s, end, h)
    },
    deleteAlert() {
      const params = [this.rowId]
      deleteAlertInfo(params).then(() => {
        const s = this.currentTab + ' ' + this.startTime + ':00'
        const end = this.currentTab + ' ' + this.endTime + ':00'
        const h = this.formInline.typeValue
        this.getList(s, end, h)
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    getPushSetTime() {
      getPushSet().then(response => {
        const setting = response.body.data.setting
        let parseSetting
        try {
          parseSetting = JSON.parse(setting)
        } catch (err) {
          parseSetting = {}
        }
        this.startTime = parseSetting.date1
        this.endTime = parseSetting.date2
        const s = this.tabsArr[0] + ' ' + this.startTime + ':00'
        const e = this.tabsArr[0] + ' ' + this.endTime + ':00'
        const h = this.formInline.typeValue
        const s1 = this.startDate + 'T' + this.startTime + ':00.000Z'
        const e1 = this.endDate + 'T' + this.endTime + ':00.000Z'
        this.getTimeAllTotal(s1, e1, h)
        this.getList(s, e, h)
      })
    },

    // 获取多天告警总数
    getTimeAllTotal(s, e, h) {
      let oper
      if (h === 'settled') {
        oper = false
      } else if (h === 'unsettled') {
        oper = true
      } else if (h === 'all') {
        oper = null
      }
      const params = {
        start: s,
        end: e,
        null: oper
      }

      getAllTotal(params).then(response => {
        this.allTotal = response.body.data
        this.listLoading = false
      })
    },

    // 获取列表数据
    getList(s, e, h) {
      const { type, taskId } = h
      const param = [
        {
          field: 'camera.name',
          operator: 'LIKE',
          value: `%${this.formInline.searchkey}%`
        },
        {
          field: 'createTime',
          operator: 'BETWEEN',
          value: { start: s || '', end: e || '' }
        },
        {
          field: 'username',
          operator: 'NULL'
        },
        {
          field: 'camera.inChargeId',
          operator: 'EQUALS',
          value: this.userId
        },
        {
          field: 'type',
          operator: 'IN',
          value: type
        },
        {
          field: 'taskId',
          operator: 'IN',
          value: taskId
        }
      ]
      const params = {
        cascade: true,
        page: {
          index: this.page,
          size: this.limit
        },
        params: param,
        sorts: [
          {
            field: 'create_Time',
            type: 'desc'
          }
        ]
      }
      getAlertInfos(params).then(response => {
        this.tableData = response.body.data
        this.total = response.body.page.total
        this.listLoading = false
        setTimeout(() => {
          var cellArr = document.getElementsByClassName('cell')
          var arr = Array.from(cellArr)
          arr.forEach(item => {
            this.hasTdHeight = true
            item.style.lineHeight = (document.getElementsByTagName('html')[0].clientHeight - 320) / 11 + 'px'
            const child = item.children
            const childArr = Array.from(child)
            childArr.forEach(dom => {
              if (dom.className === 'el-image') {
                dom.style.height = (document.getElementsByTagName('html')[0].clientHeight - 320) / 11 + 'px'
              } else if (dom.className === 'el-tag') {
                dom.style.lineHeight = (document.getElementsByTagName('html')[0].clientHeight - 320) / 11 + 'px'
              }
            })
          })
        }, 300)
      })
    },
    dialogQuxiao(val) {
      this.state = 1
      const tempData = Object.assign({}, this.temp)
      const params = [
        {
          id: tempData.id,
          state: this.state,
          handlerId: this.userId
        }
      ]
      // 更新state状态
      notifyState(params).then(response => {
        const s1 = this.currentTab + ' ' + this.startTime + ':00'
        const end1 = this.currentTab + ' ' + this.endTime + ':00'
        const h1 = this.formInline.typeValue
        this.oldSize = this.limit
        this.getList(s1, end1, h1)
        this.dialogVisable = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },

    dialogConfirm(val) {
      this.state = 0
      const tempData = Object.assign({}, this.temp)
      const params = [
        {
          id: tempData.id,
          state: this.state,
          handlerId: this.userId
        }
      ]
      // 更新state状态
      notifyState(params).then(response => {
        const s1 = this.currentTab + ' ' + this.startTime + ':00'
        const end1 = this.currentTab + ' ' + this.endTime + ':00'
        const h1 = this.formInline.typeValue
        this.oldSize = this.limit
        this.getList(s1, end1, h1)
        this.dialogVisable = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style lang='scss'>
.el-input__inner {
  text-indent: 0px;
}
// .alaMesTable {
//   td {
//     padding: 2px 0 !important;
//   }
// }

.title {
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-family: MicrosoftYaHei;
  font-size: 22px;
  color: #333333;
  font-weight: 500;
  border-bottom: 1px solid #ccc;
  background: #fff;
  padding: 0 20px;
}
.el-date-editor {
  // height: 32px !important;
}
.el-range-separator {
  width: 30px !important;
}
.el-select-dropdown__item {
  font-size: 12px !important;
}
.deal {
  fill: #44bd32 !important;
}
.untreated {
  fill: #ff9832 !important;
}
.buttonText {
  color: #409eff;
  text-decoration: underline;
}
.el-table--medium {
  td {
    padding:0px;
  }
}
td {
  .el-image {
    vertical-align: middle;
  }
}
.sureItem {
  height: 36px;
}
.pull-left.alarmmsgleft {
  width: 75%;
}
.pull-right.alarmmsgright {
  position: relative;
  width: 25%;
  .clearsearch {
    position: absolute;
    top: 0px;
    // right: 0px;
    height: 34px;
    margin-left: 10px;
    width: 60px;
    // margin-left: 16px;
    border: 1px solid #ccc;
    background: none;
    border-radius: 3px;
    outline: none;
  }
  .clearsearch:active {
    background-color: rgb(243, 241, 241);
  }
}
.searchsure {
  position: absolute;
  top: 1px;
  height: 34px;
  right: 22%;
  // border-left: none;
  border-radius: 4px;
}
// .el-input--mini .el-input__inner {
//   text-indent: 0px;
// }
.el-range-editor.el-input__inner {
  padding: 5px 5px;
}
.mesdialog {
  .el-dialog__header {
    padding: 0 !important;
  }
  .el-dialog .el-dialog__body {
    padding: 0 !important;
    overflow: hidden;
  }
  .el-dialog__footer {
    padding: 0 !important;
  }
  .dialog-footer {
    padding: 10px 0 !important;
  }
}
.popfooter {
  padding-top: 4px;
  padding-left: 4px;
  display: flex;
  .popfooteraddress {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 330px;
  }
  .popfootertime {
    width: 150px;
  }
}
.el-button--text {
  color: #fa8334 !important;
}
.el-button--small {
  font-size: 14px;
}
.searchinp {
  width: 20%;
}
.el-select.el-select--medium {
  width: 260px;
}
.el-input--mini .el-input__inner {
  height: 36px;
  line-height: 36px;
}
.el-select.el-select--medium {
  // height: 28px;
  margin-bottom: 10px;
  // .el-input--medium.el-input--suffix {
  //   height: 28px;
  // }
}
.el-input--mini .el-input__icon {
  line-height: 36px;
}
.open {
  margin-left: 90px;
  color: #ff9832;
}
.draw {
  display: none;
}
.tdimage {
  object-fit: contain !important;
}
</style>
