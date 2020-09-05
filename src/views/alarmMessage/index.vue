<template>
  <div class="list">
    <div class="title">
      告警信息
    </div>
    <div class="app-container" style="padding: 20px">
      <div class="filter-container clearfix">
        <div class="pull-right">
          <el-button class="filter-item" style="font-size:12px" size="mini" icon="el-icon-refresh" @click="onClear">重置</el-button>
        </div>
        <div class="pull-left">

          <div class="block filter-item">
            <div style="margin-right: 8px;font-size: 12px">
              选择日期:
            </div>
          </div>
          <div class="block filter-item">
            <el-date-picker
              v-model="value1"
              :clearable="false"
              :style="{width:250 + 'px'}"
              type="daterange"
              range-separator="to"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              size="mini"
              @change="timeChange"
            >
            </el-date-picker>
          </div>
          <div class="block filter-item">
            <div style="margin-right: 8px; margin-left: 6px; font-size: 12px">
              开始时间:
            </div>
          </div>
          <div class="block filter-item">
            <el-time-picker
              :style="{width:100 + 'px',height:'10px'}"
              v-model="startTime"
              :picker-options="{
                selectableRange:'00:00:00 -23:59:00'
              }"
              size="mini"
              format="HH:mm"
              value-format="HH:mm"
            >
            </el-time-picker>

          </div>

          <div class="block filter-item">
            <div style="margin-right: 8px; margin-left: 6px; font-size: 12px">
              结束时间:
            </div>
          </div>
          <div class="block filter-item">
            <el-time-picker
              :style="{width:100 + 'px'}"
              v-model="endTime"
              :picker-options="{
                selectableRange:startTime+ ':00' + '- 23:59:00'
              }"
              size="mini"
              format="HH:mm"
              value-format="HH:mm"
            >
            </el-time-picker>
          </div>

          <el-select v-model="formInline.typeValue" style="width:100px; margin-left:10px; margin-right: 10px" size="mini" class="filter-item" @change="checkModel">
            <el-option v-for="item in typeOptions" :key="item._id" :label="item.name" :value="item._id"></el-option>
          </el-select>
          <el-button v-waves class="filter-item" size="mini" type="warning" @click="onSearch">
            {{ '搜索' }}
          </el-button>

        </div>
      </div>
      <div>
        <el-tabs v-model="defaultTab" type="border-card">
          <el-tab-pane
            v-for="(item, index) in tabsArr"
            :key="item"
            :label="item"
            :name="item">
            <el-table :data="tableData" :header-cell-class-name="tableRowClassHeader" class="amountdetailTable" style="width: 100%" tooltip-effect="dark" fit @filter-change="filerStatus" @selection-change="handleSelectionChange">
              <el-table-column
                width="55">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'告警ID'" prop="id"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'时间'" prop="inCharge"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'事件'" prop="longitude"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'摄像头'" prop="latitude"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'图片'" prop="address"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'处理人'" prop="creator"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'处理结果'" prop="createTime"></el-table-column>
                      </el-table-column>
            </el-table>
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
import Cookies from 'js-cookie'
import Pagination from '@/components/Pagination'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import {
  fetchAllCameraList, editCamera
} from '@/api/camera'
export default {
  components: { Pagination },

  data() {
    return {
      defaultTab: '',
      value1: [new Date(new Date().setDate(new Date().getDate() - 6)), new Date(new Date().setDate(new Date().getDate()))],
      startTime: '02:00',
      endTime: '05:00',
      startDate: '',
      endDate: '',
      tabsArr: [],
      formInline: {
        searchkey: '',
        typeValue: 'all'
      },
      typeOptions: [{ name: '所有警告', _id: 'all' },
        { name: '已处理', _id: 'settled' }, { name: '未处理', _id: 'unsettled' }
      ],
      listLoading: false,
      filteredValue: [],
      tableData: [],
      dialogVisable: false,
      total: 0, // 假的 最后是拿到后端的pageInfo的totalItems
      page: 1,
      limit: 20,
      userId: Cookies.get('userId'),
      originCode: '',
      oldSize: 20,
      editVisable: false,
      editForm: {
        id: '',
        inCharge: '',
        longitude: '',
        latitude: '',
        address: '',
        url: ''
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
    Message.closeAll()
    this.getList(this.$route.query._id)
    this.timeChange()
  },
  methods: {
    timeChange() {
      this.startDate = moment(this.value1[0]).format('YYYY-MM-DD')
      this.endDate = moment(this.value1[1]).format('YYYY-MM-DD')
      this.tabsArr = this.getDayAll(this.startDate, this.endDate)
      this.defaultTab = this.tabsArr[0]
    },
    getDayAll(begin, end) {
      var dateAllArr = new Array()
      var ab = begin.split('-')
      var ae = end.split('-')
      var db = new Date()
      db.setUTCFullYear(ab[0], ab[1] - 1, ab[2])
      var de = new Date()
      de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
      var unixDb = db.getTime()
      var unixDe = de.getTime()
      for (var k = unixDb; k <= unixDe;) {
        dateAllArr.push(moment(new Date(parseInt(k))).format('YYYY-MM-DD').toString())
        k = k + 24 * 60 * 60 * 1000
      }
      return dateAllArr
    },
    onClear() {
      this.value1 = [new Date(new Date().setDate(new Date().getDate() - 6)), new Date(new Date().setDate(new Date().getDate()))],
      this.startTime = '02:00',
      this.endTime = '05:00',
      this.startDate = moment(this.value1[0]).format('YYYY-MM-DD'),
      this.endDate = moment(this.value1[1]).format('YYYY-MM-DD'),
      this.tabsArr = this.getDayAll(this.startDate, this.endDate),
      this.defaultTab = this.tabsArr[0],
      this.formInline.typeValue = 'all'
    },
    onSearch() {},
    editDialog(v) {
      this.editForm.id = v.id
      this.editForm.inCharge = v.inCharge
      this.editForm.longitude = v.longitude
      this.editForm.latitude = v.latitude
      this.editForm.address = v.address
      this.editForm.url = v.url
      this.editVisable = true
    },
    editCloseDialog() {
      this.editVisable = false
    },
    editDialogConfirm() {
      const params = [{
        id: this.editForm.id,
        inChargeId: this.editForm.inCharge,
        latitude: this.editForm.latitude,
        longitude: this.editForm.longitude,
        url: this.editForm.url
      }]
      editCamera(params).then(response => {
        console.log(response)
      })
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
    onSearch() {
      console.log('搜索')
    },
    checkModel() {
      this.$emit('getdata', this.formInline.typeValue)
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
      this.getList(this.$route.query._id)
    },
    goBack() {
      this.$router.go(-1)
    },
    // 导出列表为excel
    onExport() {
      if (!this.tableData.length) {
        this.$message({
          message: '无数据',
          type: 'warning'
        })
        return
      }
      this.getExportList()
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
        this.getList(this.$route.query._id)
      } else {
        this.filteredValue = columnObj[columnObjKey]
        this.getList(this.$route.query._id)
      }
    },
    // 获取列表数据
    getList(id) {
      const params = {
        cascade: true,
        page: {
          index: 1,
          size: 20
        },
        params: {
        }
      }
      fetchAllCameraList(params).then(response => {
        console.log(response)
        this.tableData = response.body.data
        this.total = response.body.page.total
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    dialogQuxiao() {
      this.dialogVisable = false
    },
    dialogConfirm() {
      this.dialogVisable = false
    }
  }
}
</script>

  <style lang='scss'>
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
  </style>

