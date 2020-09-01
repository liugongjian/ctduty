<template>
  <div>
    <router-view class="routerView"></router-view>
    <div v-if="isShowList" class="app-container" >
      <div class="filter-container clearfix">
        <template :gutter="10">
          <!-- <div class="pull-left">
            <el-select v-model="formInline.typeValue" placeholder="全部" class="filter-item">
              <el-option v-for="item in typeOptions" :key="item._id" :label="item.name" :value="item._id"></el-option>
            </el-select>
          </div> -->
          <div class="pull-right">
            <div class="block filter-item">
              <!-- <el-date-picker
                v-model="value1"
                :clearable="false"
                :style="{width:dateSelectWidth + 'px'}"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                size="small"
                @change="timeChange"
              >
              </el-date-picker> -->
              <el-date-picker
                v-model="value1"
                :default-time="['00:00:00', '00:00:00']"
                :clearable="false"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
                @change="timeChange">
              </el-date-picker>
            </div>
            <el-input v-model="formInline.searchkey" placeholder="设备编号" class="filter-item" style="width: 200px;margin-left:10px;" @keyup.enter.native="onSearch"></el-input>
            <el-button v-waves :style="{width:buttonWidth + 'px',padding:`10px ${buttonPadding}px`,marginLeft: '10px'}" class="filter-item" type="warning" @click="onSearch">
              {{ '搜索' }}
            </el-button>
            <el-tooltip class="toolTipItem" effect="dark" content="重置搜索" placement="top" >
              <el-button class="filter-item" icon="el-icon-refresh" @click="onClear"></el-button>
            </el-tooltip>
          </div>
        </template>
      </div>
      <div>
        <el-table :data="tableData" :header-cell-class-name="tableRowClassHeader" style="width: 100%" tooltip-effect="dark" fit>
          <el-table-column :label="$t('vsearch.httpUri')" :show-overflow-tooltip="true" prop="httpUri"></el-table-column>
          <el-table-column :label="$t('vsearch.playDataSize')+ ' (MB)'" :show-overflow-tooltip="true" prop="playDataSize"></el-table-column>
          <el-table-column :label="$t('vsearch.playStartTime')" :show-overflow-tooltip="true" prop="playStartTime"></el-table-column>
          <el-table-column :label="$t('vsearch.playEndTime')" :show-overflow-tooltip="true" prop="playEndTime"></el-table-column>
          <el-table-column :label="$t('vsearch.operate')" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="play(scope.row)">播放</el-button>
              <el-button type="text" size="small"><a :href="scope.row.httpUri" target="_blank">下载</a></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog :visible="dialogVisable" width="960px" @close="editCloseDialog">
          <VideoFlv v-if="dialogVisable" :options="videoOptions" />
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
  </div>

</template>

<script>
import { Message } from 'element-ui'
import Cookies from 'js-cookie'
import VideoFlv from '@/components/VideoFlv'
import moment from 'moment'
import Pagination from '@/components/Pagination'
import {
  fetchVsearchList
} from '@/api/applications'
export default {
  name: 'List',
  components: { Pagination, VideoFlv },
  data() {
    return {
      listLoading: false,
      formInline: {
        userValue: '',
        APPValue: '',
        APIValue: ''
      },
      selectWidth: 150,
      dateSelectWidth: 300,
      buttonWidth: 68,
      buttonPadding: 20,
      userOptions: [],
      isAPPSelected: false,
      isAPISelected: false,
      APPOptions: [],
      APIOptions: [],
      tableData: [],
      screenWidth: '',
      total: 0, // 假的最后是拿到后端的pageInfo的totalItems
      page: 1,
      limit: 20,
      user_Id: '',
      APPId: '',
      APIId: '',
      dialogVisable: false,
      isAPPDisabled: false,
      isAPIDisabled: false,
      userId: Cookies.get('userId'),
      startTime: `${moment(new Date(new Date().setDate(new Date().getDate() - 7))).format('YYYY-MM-DD%00:00:00')}`,
      endTime: `${moment(new Date()).format('YYYY-MM-DD%00:00:00')}`,
      value1: [moment(new Date(new Date().setDate(new Date().getDate() - 7))).format('YYYY-MM-DD%00:00:00'), moment(new Date()).format('YYYY-MM-DD%00:00:00')],
      productLine: '',
      isShowList: true,
      typeOptions: []
    }
  },
  watch: {
    screenWidth(v, oldV) {
      if (v > 1400) {
        this.selectWidth = 150
        this.dateSelectWidth = 300
        this.buttonWidth = 68
        this.buttonPadding = 20
      }
      if (v <= 1400) {
        this.selectWidth = 120
        this.dateSelectWidth = 240
        this.buttonWidth = 58
        this.buttonPadding = 15
      }
      if (v < 1250) {
        this.selectWidth = 90
        this.dateSelectWidth = 220
        this.buttonWidth = 48
        this.buttonPadding = 10
      }
    },
    value1(v) {
      if (v[1] - new Date() > 0) {
        this.$message({
          message: '不能超过当前时间',
          type: 'warning'
        })
        this.value1 = [moment(new Date(new Date().setDate(new Date().getDate() - 7))).format('YYYY-MM-DD%00:00:00'), moment(new Date()).format('YYYY-MM-DD%00:00:00')]
      } else if (v[1] - v[0] > 604800000) {
        this.$message({
          message: '选择时间不能超过一周',
          type: 'warning'
        })
        this.value1 = [moment(new Date(new Date().setDate(new Date().getDate() - 7))).format('YYYY-MM-DD%00:00:00'), moment(new Date()).format('YYYY-MM-DD%00:00:00')]
      }
    }
  },
  created() {
    Message.closeAll()
    this.getList()
  },
  mounted() {
    if (document.getElementsByClassName('routerView').length) {
      this.isShowList = false
    } else {
      this.isShowList = true
      this.screenWidth = document.documentElement.clientWidth
      window.onresize = () => {
        return (() => {
          this.screenWidth = document.documentElement.clientWidth
        })()
      }
    }
  },
  methods: {
    // 表头样式
    tableRowClassHeader({ row, rowIndex }) {
      return 'tableRowClassHeader'
    },
    play(row) {
      this.videoOptions = {
        autoplay: true,
        controls: true,
        width: 960, // 播放器宽度
        height: 480, // 播放器高度
        sources: [
          {
            src: row.httpUri,
            type: 'video/mp4'
          }
        ]
      }
      this.dialogVisable = true
    },
    download(row) {

    },
    editCloseDialog() {
      this.dialogVisable = false
    },
    timeChange() {
      this.startTime = moment(this.value1[0]).format('YYYY-MM-DD%HH:mm:SS')
      this.endTime = moment(this.value1[1]).format('YYYY-MM-DD%HH:mm:SS')
    },
    pageChange() {
      this.productLine = 'risk'
      this.getList()
    },
    onClear() {
      this.value1 = [moment(new Date(new Date().setDate(new Date().getDate() - 7))).format('YYYY-MM-DD%00:00:00'), moment(new Date()).format('YYYY-MM-DD%00:00:00')]
      this.startTime = `${moment(new Date(new Date().setDate(new Date().getDate() - 7))).format('YYYY-MM-DD%00:00:00')}`
      this.endTime = `${moment(new Date()).format('YYYY-MM-DD%00:00:00')}`
      this.getList()
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      this.productLine = 'risk'
      const params = {
        limit: this.limit,
        // startTime: this.startTime,
        // endTime: this.endTime,
        deviceNum: '64050200001327323707'
      }
      fetchVsearchList(params).then(response => {
        this.tableData = response.data || []
        this.total = this.tableData.length
        this.listLoading = false
        this.productLine = ''
      })
    },
    // 模糊搜索事件 请求接口
    onSearch() {
      this.page = 1
      this.productLine = 'risk'
      this.getList()
    },
    // 点击详情 跳转到api详情页面
    detail(val) {
      window.open(`amount/detail?_id=${val.id}&_code=${val.statusCode}`)
    }
  }
}
</script>
<style lang="scss">
.app-container{
  padding: 0 20px;
}
.el-range-input{
  font-size: 13px !important;
}
.filter-container{
  padding: 10px 0;
  vertical-align: middle !important;
  font-size: 13px !important;
  .el-button{
    font-size: 13px;
  }
  .el-input__icon{
    font-size: 16px !important;
  }
  .pull-left {
   .filter-item{
     .el-input__inner{
       padding-left: 5px;
     }
   }
    .el-select{
   margin-right: 10px;
   .el-input {
     input{
      font-size: 13px;
     }
   }
 }
 }
}
.el-range-separator{
  display: block;
  font-size: 12px;
  width: 20px !important;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.selectFade-enter-active, .selectFade-leave-active {
  transition: opacity .5s
}
.selectFade-enter, .selectFade-leave-active {
  opacity: 0
}
.el-dialog__body {
  padding: 10px !important;
}
</style>