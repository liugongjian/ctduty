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
          type="daterange"
          range-separator="～"
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
          placeholder="结束时间">
        </el-time-picker>
      </span>
      <el-button type="primary" @click="onSearch">搜索</el-button>
    </div>
    <div v-loading="listLoading">
      <div class="card-wrapper">
        <el-card v-for="(item, index) in tableData" :body-style="{ padding: '0px' }" :key="item.id" class="card">
          <img :src="item.imageCut" class="image">
          <div class="card-desp">
            <span class="card-desp-title">
              <span>{{ item.licence || '' }}</span>
              <span>{{ item.plateType? `${item.plateType}车牌` : '' }}</span>
              <span>{{ item.label? listType[item.label] : '' }}</span>
            </span>
            <div class="bottom clearfix">
              <div class="location">
                <i class="el-icon-map-location" />
                <span>{{ item.camera.address }}</span>
              </div>
              <div class="location">
                <i class="el-icon-time" />
                <time class="time">{{ getDateTimeStr(item.createTime) }}</time>
                <el-button type="text" class="button" title="导入车牌库" @click="() => onImportCar(item.licence, item.plateType, item.label? listType[item.label] : '')">
                  <svg-icon icon-class="import"></svg-icon>
                <!-- <i class="el-icon-upload" /> -->
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
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
const timeFormate = 'hh:mm:ss'
const dateFormate = 'YYYY-MM-DD'

export default {
  components: { Pagination },
  data() {
    return {
      currentDate: new Date().toLocaleString(),
      dateRange: [moment().subtract(7, 'days'), moment()],
      startTime: moment('02:00:00', 'hh:mm:ss'),
      endTime: moment('22:00:00', 'hh:mm:ss'),
      dialogVisible: false,
      carEdit: {
        licenseNo: '',
        type: '',
        color: ''
      },
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
      ]
    }
  },
  watch: {
    limit() {
      this.page = 1
      this.pageChange()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    onSearch() {
      console.log(this.dateRange)
      console.log(this.startTime)
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
      return moment(time).format('YYYY-MM-DD hh:mm:ss')
    },
    getList() {
      this.listLoading = true
      const param = [{
        field: 'createTime',
        operator: 'BETWEEN',
        value: { 'start': `${this.dateRange[0].format(dateFormate)} ${this.startTime.format(timeFormate)}` || '', 'end': `${this.dateRange[1].format(dateFormate)} ${this.endTime.format(timeFormate)}` || '' }
      },
      {
        field: 'type',
        operator: 'EQUALS',
        value: 2
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
      })
    }
  }
}
</script>

<style lang='scss'>
.carHistory {
  .filter-wrapper{
    margin:20px;
    &>span{
        display: inline-block;
        .el-date-editor {
            height: 36px !important;
        }
        font-size: 14px;
        padding-right: 10px;
    }
  }
  .pagination-wrapper{
    margin: 0 20px;
    .pagination-container{
        margin-top:0;
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
            max-width: 250px;
            height:150px;
            object-fit: fill;//cover;
            display: block;
        }
        .card-desp{
            padding:10px;
            &-title{
                font-size:14px;
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
                margin-top: 13px;
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
//   overflow: auto !important;
//   min-height: calc(100vh - 90px) !important;
}
</style>

