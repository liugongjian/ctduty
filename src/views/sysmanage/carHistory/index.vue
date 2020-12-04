<template>
  <div class="carHistory">
    <el-dialog
      :visible.sync="dialogVisible"
      title="导入车牌库"
      width="30%">
      <div class="car-import-edit">
        <el-form ref="carEdit" :model="carEdit" label-position="right" label-width="80px">
          <el-form-item
            :rules="[
              { required: true, message: '车牌号不能为空'}
            ]"
            prop="licenseNo"
            label="车牌号">
            <el-input v-model="carEdit.licenseNo" style="width:230px;"></el-input>
          </el-form-item>
          <el-form-item
            :rules="[
              { required: true, message: '布控标签不能为空'}
            ]"
            prop="type"
            label="布控标签">
            <el-select
              v-model="carEdit.type"
              style="width:230px;"
              placeholder="请选择所属名单"
            >
              <el-option
                v-for="item in subordinateList"
                :value="item.value"
                :label="item.label"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :rules="[
              { required: true, message: '车牌颜色不能为空'}
            ]"
            prop="color"
            label="车牌颜色">
            <el-select v-model="carEdit.color" style="width:230px;" placeholder="请选择颜色">
              <el-option
                v-for="item in colorList"
                :value="item.value"
                :label="item.label"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAddCar">确 定</el-button>
      </span>
    </el-dialog>
    <div class="filter-wrapper">
      <span>
        选择日期：
        <el-date-picker
          v-model="dateRange"
          :clearable="false"
          :picker-options="{
            disabledDate(time) {
              return time.getTime() > Date.now() - 8.64e6
            }
          }"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </span>
      <span>
        开始时间：
        <el-time-picker
          v-model="startTime"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59'
          }"
          :clearable="false"
          style="width:110px;"
          placeholder="开始时间">
        </el-time-picker>
      </span>
      <span>
        结束时间：
        <el-time-picker
          v-model="endTime"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59'
          }"
          :clearable="false"
          style="width:110px;"
          placeholder="结束时间">
        </el-time-picker>
      </span>
      <span style="float:right;">
        <el-button
          v-waves
          class="filter-item sureItem"
          size="mini"
          type="warning"
          style="margin-bottom: 10px; margin-left: 10px"
          @click="onSearch"
        >{{ '搜索' }}</el-button>
        <el-button class="searchbtn filter-item sureItem" size="mini" @click="onClear">重置</el-button>
      </span>
    </div>
    <el-tabs v-model="defaultTab" type="border-card" class="tab-wrapper" @tab-click="tabChangeQuery">
      <el-tab-pane
        v-for="item in tabsArr"
        :key="item"
        :label="item"
        :name="item">
        <div v-loading="listLoading">
          <div v-if="tableData&& tableData.length >0" class="card-wrapper">
            <el-card v-for="item in tableData" :body-style="{ padding: '0px' }" :key="item.id" class="card">
              <el-image :src="item.imageCut" class="image" />
              <div class="card-desp">
                <span class="card-desp-title">
                  <span>{{ item.license || '' }}</span>
                  <span>{{ item.plateType? `${item.plateType}车牌` : '' }}</span>
                  <el-tag
                    :type="item.label === '1' ? 'success' : item.label === '2' ? 'danger' : ''"
                    size="mini"
                  >{{ item.label? listType[item.label] : '' }}</el-tag>
                </span>
                <div class="bottom clearfix">
                  <div
                    class="location"
                    style="height:20px;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 3;overflow: hidden;"
                  >
                    <i class="el-icon-map-location" />
                    <el-tooltip
                      :content="item.camera.address"
                      class="item"
                      effect="dark"
                      placement="top-start"
                    >
                      <span>{{ item.camera && item.camera.address || '未知' }}</span>
                    </el-tooltip>
                  </div>
                  <div class="location">
                    <i class="el-icon-time" />
                    <time class="time">{{ getDateTimeStr(item.createTime) }}</time>
                    <el-button :disabled="!item.license" type="text" class="button" title="导入车牌库" @click="() => onImportCar(item.license, item.plateType, item.label? listType[item.label] : '')">
                      <svg-icon icon-class="import"></svg-icon>
                      <!-- <i class="el-icon-upload" /> -->
                    </el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
          <div v-else class="noData">
            暂无数据
          </div>
          <div class="pagination-wrapper">
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="page"
              :limit.sync="limit"
              @pagination="pageChange()"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import Cookies from 'js-cookie'
import Pagination from '@/components/Pagination'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import { downLoadByUrl } from '@/utils'
import { getAlertInfos } from '@/api/alarm'
import {
  addCarData
} from '@/api/dm'
import {

} from '@/api/dm'
const token = Cookies.get('token')
const timeFormate = 'HH:mm:ss'
const dateFormat = 'YYYY-MM-DD'
const initialFilterProps = {
  dateRange: [moment().subtract(7, 'days'), moment()],
  startTime: moment('02:00:00', timeFormate),
  endTime: moment('22:00:00', timeFormate)
}
export default {
  components: { Pagination },
  data() {
    return {
    //   dateRange: [moment().subtract(7, 'days'), moment()],
    //   startTime: moment('02:00:00', 'hh:mm:ss'),
    //   endTime: moment('22:00:00', 'hh:mm:ss'),
      ...initialFilterProps,
      dialogVisible: false,
      carEdit: {
        licenseNo: '',
        type: '',
        color: ''
      },
      tabsArr: [],
      defaultTab: '', currentTab: '',
      total: 0, // 假的 最后是拿到后端的pageInfo的totalItems
      allTotal: 0,
      page: 1,
      limit: 10,
      listLoading: true,
      tableData: [],
      listType: {
        1: '白名单',
        2: '黑名单',
        3: '其他'
      },
      colorList: [
        {
          value: '黑色',
          label: '黑色'
        },
        {
          value: '白色',
          label: '白色'
        },
        {
          value: '蓝色',
          label: '蓝色'
        },
        {
          value: '绿色',
          label: '绿色'
        }
      ],
      subordinateList: [
        {
          value: '白名单',
          label: '白名单'
        },
        {
          value: '黑名单',
          label: '黑名单'
        },
        {
          value: '其他',
          label: '其他'
        }
      ],
      userId: Cookies.get('userId')
    }
  },
  watch: {
    limit() {
      this.page = 1
      this.pageChange()
    }
  },
  created() {
    this.onSearch()
  },
  methods: {
    onClear() {
      Object.keys(initialFilterProps).forEach(key => {
        this[key] = initialFilterProps[key]
      })
      this.onSearch()
    },
    onSearch() {
      console.log(this.dateRange)
      const [startDate, endDate] = this.dateRange
      console.log(this.startTime)
      this.tabsArr = this.getDayAll(moment(startDate).format(dateFormat), moment(endDate).format(dateFormat)).reverse()
      // this.tabsArr = this.tabsDateArr
      // this.value1=[ this.tabsArr[this.tabsArr.length - 1],this.tabsArr[0]
      // this.value1=[this.startDate,this.endDate]
      if (this.tabsArr.indexOf(this.currentTab) === -1) {
        this.defaultTab = this.tabsArr[0]
        this.currentTab = this.defaultTab
      }
      this.page = 1
      this.getList()
    },
    tabChangeQuery(e) {
      this.currentTab = e.label
      this.page = 1
      this.getList()
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
        if (String(dateList[1]).length == 1) { dateList[1] = '0' + dateList[1] }
        if (String(dateList[2]).length == 1) { dateList[2] = '0' + dateList[2] }
        result.push(dateList[0] + '-' + dateList[1] + '-' + dateList[2])
        if (dateList[0] == endDay[0] && dateList[1] == endDay[1] && dateList[2] == endDay[2]) {
          i = 1
        }
      }

      return result
    },
    onAddCar() {
      this.$refs['carEdit'].validate((valid) => {
        if (valid) {
          const params = [this.carEdit]
          addCarData(params)
            .then(res => {
              this.dialogVisible = false
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            })
            .catch(err => {})
        } else {
          return false
        }
      })
    },
    onImportCar(licenseNo, color, type) {
      this.dialogVisible = true
      this.carEdit = {
        licenseNo,
        type,
        color
      }
    },
    pageChange(e) {
      console.log('change')
      //   this.currentTab = e.label
      //   const s = e.label + ' ' + this.startTime + ':00'
      //   const end = e.label + ' ' + this.endTime + ':00'
      //   const h = this.formInline.typeValue
      //   this.page = 1
      this.getList()
    },
    getDateTimeStr(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    getList() {
      this.listLoading = true
      const param = [
        {
          field: 'createTime',
          operator: 'BETWEEN',
          value: { 'start': `${this.currentTab} ${moment(this.startTime).format(timeFormate)}` || '', 'end': `${this.currentTab} ${moment(this.endTime).format(timeFormate)}` || '' }
        },
        {
          field: 'type',
          operator: 'EQUALS',
          value: 2
        }, {
          field: 'camera.inChargeId',
          operator: 'EQUALS',
          value: this.userId
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
      getAlertInfos(params).then(res => {
        const { body: { data, page: { total, size, index }}} = res
        this.tableData = data
        this.total = total
        this.listLoading = false
      }).catch(err => { console.log(err) })
    }
  }
}
</script>

<style lang='scss'>
.carHistory {
  .el-button--text {
    // color: #fa8334 !important;
  }
  .filter-wrapper{
    margin:20px;
    &>span{
        display: inline-block;
        .el-date-editor {
            height: 36px !important;
        }
        font-size: 12px;
        padding-right: 10px;
    }
  }
  .pagination-wrapper{
    margin: 0 20px;
    .pagination-container{
        margin-top:0;
    }
  }
  .noData{
      height: 50px;
      width:100%;
      text-align: center;
      line-height: 50px;
      color:#999;
  }
  .tab-wrapper{
    margin: 0 20px 20px 20px;
    .el-tabs__content {
        padding: 20px 0;
    }
  }
  .card-wrapper{
      margin-left: 20px;
      margin-bottom:20px;
      display: flex;
      justify-content: flex-start;
    //   justify-content: space-between;
      flex-wrap:wrap;
      .card{
        width: 18%;
        margin-bottom: 20px;
        margin-right: 2%;
        .image {
            width: 100%;
            // max-width: 250px;
            height:150px;
            img{
                object-fit: contain;//cover;
                 background-color: rgb(245, 247, 250);
            }
        }
        .card-desp{
            padding:10px;
            &-title{
                font-size:12px;
                &>span{
                    display:inline-block;
                }
            }
            .button{
                font-size: 16px;
                float: right;
                padding: 0;
            }
            .bottom {
                margin-top: 10px;
                line-height: 20px;
                font-size:13px;
                color:#999;
            }
            .clearfix:before,
            .clearfix:after {
                display: table;
                content: "";
            }
            .clearfix:after {
                clear: both
            }
        }
      }

  }
  .location {
    overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
  }
  .el-input--suffix .el-input__inner {
    padding-right: 0px;
  }
  .el-date-editor--daterange.el-input__inner {
    width: 300px;
  }
  .el-date-editor .el-range-separator {
    width: 6%;
  }
}
.el-range-editor--mini .el-range-separator {
  line-height: 28px;
  font-size: 14px;
}
.el-range-editor--mini .el-range__icon {
  line-height: 28px;
}
.el-range-editor--medium .el-range-input {
  font-size: 12px;
}
.el-input--medium {
  font-size: 12px;
}
.sureItem {
  height: 36px;
}
</style>

