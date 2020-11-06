<template>
  <div class="list">
    <div class="app-container" style="padding: 20px">
      <div class="filter-container clearfix">
        <div class="pull-right">
          <el-button
            class="filter-item"
            style="font-size:12px"
            icon="el-icon-refresh"
            @click="onClear"
          >重置</el-button>
        </div>
        <div class="pull-left">
          <div class="block filter-item">
            <div style="margin-right: 8px;font-size: 12px">选择日期:</div>
          </div>
          <div class="block filter-item">
            <el-date-picker
              v-model="value1"
              :clearable="false"
              :style="{width:250 + 'px'}"
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
            <div style="margin-right: 8px; margin-left: 6px; font-size: 12px">开始时间:</div>
          </div>
          <div class="block filter-item">
            <el-time-picker
              :style="{width:100 + 'px',height:'10px'}"
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
              :style="{width:100 + 'px'}"
              v-model="endTime"
              :picker-options="{
                selectableRange:startTime+ ':00' + '-23:59:00'
              }"
              size="mini"
              format="HH:mm"
              value-format="HH:mm"
            ></el-time-picker>
          </div>

          <el-select
            v-model="formInline.typeValue"
            style="width:100px; margin-left:10px; margin-right: 10px"
            size="mini"
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
          <el-button
            v-waves
            class="filter-item"
            size="mini"
            type="warning"
            @click="onSearch"
          >{{ '搜索' }}</el-button>
        </div>
      </div>
      <div>
        <div class="kb">{{ tabsArr[tabsArr.length-1] }} to {{ tabsArr[0] }} 警告共计: {{ allTotal }} 条</div>
        <el-tabs v-model="defaultTab" type="border-card" @tab-click="tabChangeQuery">
          <el-tab-pane v-for="item in tabsArr" :key="item" :label="item" :name="item">
            <el-table
              :data="tableData"
              :header-cell-class-name="tableRowClassHeader"
              class="alaMesTable"
              style="width: 100%"
              tooltip-effect="dark"
              fit
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                :show-overflow-tooltip="true"
                :label="'告警ID'"
                align="center"
                min-width="7.5%"
                prop="id"
              ></el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                :formatter="formatTime"
                :label="'时间'"
                align="center"
                min-width="7.5%"
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
              <el-table-column
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
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                :label="'布控标签'"
                align="center"
                min-width="5%"
                width="100"
              >
                <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.label === 1 ? 'success':scope.row.label === 2? 'danger':'' "
                  >{{ scope.row.label === 1 ? '白名单':scope.row.label === 2? '黑名单':'其他' }}</el-tag>
                </template>
              </el-table-column>
              <!--  <el-table-column :show-overflow-tooltip="true" :label="'摄像头'" min-width="15%" prop="camera.address"></el-table-column> -->
              <el-table-column :label="'图片'" min-width="10%">
                <template slot-scope="scope">
                  <!-- <el-popover
                    placement="left"
                    trigger="hover"
                  >
                    <el-image :src="scope.row.imageCompress" style="width:340px; height:194px;"/>
                    <el-image slot="reference" :src="scope.row.imageCut" class="image" @click="openBig(scope.row.image)" />
                  </el-popover> -->
                  <el-image :src="scope.row.imageCompress" style="width:170px; height:97px;" @click="openBig(scope.row.image)" />
                </template>
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                :label="'处理人'"
                align="center"
                min-width="5%"
                prop="handler.username"
                width="100"
              >
                <template slot-scope="scope">
                  <span
                    style="text-indent:30px"
                  >{{ scope.row.handler ? scope.row.handler.username:'-' }}</span>
                </template>
              </el-table-column>
              <el-table-column
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
              </el-table-column>
              <el-table-column min-width="12%" align="center" label="操作">
                <template slot-scope="scope">
                  <el-link type="primary" @click="editDialog(scope.row)">处理</el-link>
                  <el-link type="primary" @click="delAlert(scope.row.id)">删除</el-link>
                </template>
              </el-table-column>
            </el-table>

            <el-dialog
              :visible.sync="dialogVisable"
              title="报警显示"
              width="750px"
              @close="closeDialog"
            >
              <el-form v-model="temp" label-position="right" label-width="100px">
                <el-form-item label="摄像头地址：" prop="camera.address">
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
                <!-- 车牌 -->
                <el-form-item v-if="temp.license" label="车牌:" prop="license">
                  <span>{{ temp.license }}</span>
                </el-form-item>
                <!-- 人员 -->
                <el-form-item v-if="temp.username" label="姓名:" prop="username">
                  <span>{{ temp.username }}</span>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogConfirm">正 常</el-button>
                <el-button type="warning" @click="dialogQuxiao">异 常</el-button>
              </div>
            </el-dialog>

            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="page"
              :limit.sync="limit"
              @pagination="pageChange()"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { renderTime } from '@/utils'
import Cookies from 'js-cookie'
import Pagination from '@/components/Pagination'
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
  components: { Pagination },
  filters: {
    formatNull: function(val) {
      if (!val) return '无'
      return val.address
    }
  },
  data() {
    return {
      renderTime,
      else: '其他',
      temp: {
        camera: {},
        createTime: '',
        image: '',
        imageCut: ''
      },
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
      editVisable: false,
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
      }
    }
  },
  // computed: {
  //   ...mapGetters([
  //     'userId'
  //   ])
  // },
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
  methods: {
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
      return moment(cellValue).format('YYYY-MM-DD HH:mm:SS')
    },
    formatType(row, column, cellValue) {
      return cellValue === 1 ? '人员' : cellValue === 2 ? '机动车' : '非机动车'
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
    onClear() {
      (this.value1 = [
        new Date(new Date().setDate(new Date().getDate() - 29)),
        new Date(new Date().setDate(new Date().getDate()))
      ]),
      (this.startDate = moment(this.value1[0]).format('YYYY-MM-DD'))
      this.endDate = moment(this.value1[1]).format('YYYY-MM-DD');
      (this.value1 = ''),
      (this.page = 1),
      // this.startTime = '02:00'
      // this.endTime = '05:00'
      (this.formInline.typeValue = 'all')
      // this.tabsDateArr = this.getDayAll(this.startDate, this.endDate).reverse()
      // this.defaultTab=this.endDate
      // this.getList(s1, end1, h1)
      this.tabsArr = this.getDayAll(this.startDate, this.endDate).reverse()
      this.defaultTab = this.tabsArr[0]
      this.currentTab = this.defaultTab
      this.getPushSetTime()
      // const s = this.tabsArr[0] + ' ' + this.startTime + ':00'
      // const e = this.tabsArr[0] + ' ' + this.endTime + ':00'
      // const h = this.formInline.typeValue
      // this.getList(s, e, h)

      // const s1 = this.startDate + 'T' + this.startTime + ':00.000Z'
      // const e1 = this.endDate + 'T' + this.endTime + ':00.000Z'
      // this.getTimeAllTotal(s1, e1, h)
    },
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
      const h1 = this.formInline.typeValue
      this.oldSize = this.limit
      this.getList(s1, end1, h1)
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
      this.temp = Object.assign({}, v)
      this.dialogVisable = true
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
      this.$emit('getdata', this.formInline.typeValue)
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
      let oper
      if (h === 'settled') {
        oper = 'NOT_NULL'
      } else if (h === 'unsettled') {
        oper = 'NULL'
      }
      const ss = {
        field: 'handlerId',
        operator: oper,
        value: 'null'
      }
      const param = h == 'all' ? [{
        field: 'createTime',
        operator: 'BETWEEN',
        value: { 'start': s || '', 'end': e || '' }
      }, {
        field: 'username',
        operator: 'NULL'
      }
      ] : [{
        field: 'createTime',
        operator: 'BETWEEN',
        value: { 'start': s || '', 'end': e || '' }
      }, {
        field: 'username',
        operator: 'NULL'
      },
      ss
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
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
 /*  td {
    padding:0 !important;
    text-align: center;
  } */
 .image {
    width:100%;
    height:39px;
    img{
     object-fit: contain;//cover;
    // background-color: rgb(245, 247, 250);
    }
  }
 .title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-family: MicrosoftYaHei;
    font-size: 22px;
    color: #333333;
    font-weight: 500;
    border-bottom: 1px solid #ccc;
    background: #FFF;
    padding: 0 20px;
  }
  .el-date-editor{
    height: 28px !important;
  }
  .el-range-separator{

    width: 30px !important;
  }
  .el-select-dropdown__item {
      font-size: 12px !important;

  }
  .deal {
    fill: #44bd32 !important;
  }
  .untreated{
    fill: #E6A23C  !important;
  }
  .v-modal{
    z-index: 999  !important;
  }
  .buttonText{
    color: #409EFF;
    text-decoration:underline;
  }
  .kb{
    margin-block-end: 14px;
  }
  td {
    padding: 0 !important;
  }

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
  height: 28px !important;
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
  fill: #e6a23c !important;
}
.v-modal {
  z-index: 999 !important;
}
.buttonText {
  color: #409eff;
  text-decoration: underline;
}
.kb {
  margin-block-end: 14px;
}
td {
  .el-image {
    vertical-align: middle;
  }
}
</style>
