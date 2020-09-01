<template>
  <div>
    <router-view class="routerView"></router-view>
    <div v-if="isShowList" class="app-container" style="padding: 20px">
      <div class="filter-container clearfix">
        <!-- <div class="pull-left">
          <el-select v-model="formInline.typeValue" placeholder="全部" class="filter-item">
            <el-option v-for="item in typeOptions" :key="item._id" :label="item.name" :value="item._id"></el-option>
          </el-select>
        </div> -->
        <div class="pull-right">
          <el-input v-model="formInline.searchkey" placeholder="告警内容" class="filter-item" style="width: 200px;margin-left:10px;" @keyup.enter.native="onSearch"></el-input>
          <el-button v-waves class="filter-item" style="margin-left: 10px;" type="warning" @click="onSearch">
            {{ '搜索' }}
          </el-button>
          <el-tooltip class="toolTipItem" effect="dark" content="重置搜索" placement="top" >
            <el-button class="filter-item" icon="el-icon-refresh" @click="onClear"></el-button>
          </el-tooltip>
        </div>
      </div>
      <el-table ref="filterTable" :data="tableData" :header-cell-class-name="tableRowClassHeader" style="width: 100%" tooltip-effect="dark" fit class="filterNewStatusTable" @filter-change="filerStatus">
        <el-table-column :show-overflow-tooltip="true" :label="$t('alarm.channelId')" prop="channelId" min-width="10%">
          <template slot-scope="scope">
            <span>{{ scope.row.channelId }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="$t('alarm.sourceSystem')" prop="sourceSystem" min-width="10%">
          <template slot-scope="scope">
            <span>{{ scope.row.sourceSystem }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="$t('alarm.captureTime')" prop="createTime" min-width="10%">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="$t('alarm.image')" prop="imageId" min-width="10%">
          <template slot-scope="scope">
            <img v-if="scope.row.imageId" :src="getUrl(scope.row.imageId)" height="80px" alt="" @click="()=>{showBigImg(scope.row.imageId)}">
            <span v-else style="color:red;">暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="$t('alarm.content')" prop="content" min-width="10%">
          <template slot-scope="scope">
            <span>{{ scope.row.message }} {{ scope.row.content }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible="dialogVisable" title="告警图片" width="960px" @close="editCloseDialog">
        <img
          :src="formatImg(dialogImgId)"
          style="width:100%;height:100%;object-fit:cover;"
          alt=""
        >
      </el-dialog>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getList()"/>
    </div>
  </div>

</template>

<script>
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import { renderTime } from '@/utils'
import {
  fetchAllWarningList
} from '@/api/applications'
import { alarmImg } from '@/api/alarm'
export default {
  name: 'List',
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      formInline: {
        typeValue: '',
        searchkey: ''
      },
      renderTime,
      typeOptions: [],
      tableData: [],
      filteredValue: [],
      total: 0, // 假的 最后是拿到后端的pageInfo的totalItems
      page: 1,
      limit: 20,
      isShowList: true,
      dialogVisable: false,
      dialogImgId: null
    }
  },
  computed: {
    ...mapGetters([
      'refUid'
    ])
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
    }
  },
  methods: {
    // 表头样式
    tableRowClassHeader({ row, rowIndex }) {
      return 'tableRowClassHeader'
    },
    getUrl(id) {
      return alarmImg(id)
    },
    editCloseDialog() {
      this.dialogVisable = false
    },
    formatImg(id) {
      return alarmImg(id)
    },
    // 获取审批类型数据接口 暂定 如果不分页，就传参{isPaging: 0}
    // 获取列表数据
    getList() {
      this.listLoading = true
      const params = {
        limit: this.limit
      }
      fetchAllWarningList(params).then(response => {
        this.tableData = response.data
        this.listLoading = false
      })
    },
    showBigImg(id) {
      if (!id) {
        this.$confirm('暂无图片', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          showCancelButton: false
        })
      } else {
        this.dialogVisable = true
        this.dialogImgId = id
      }
    },
    // 表格中的状态筛选事件
    filerStatus(columnObj) {
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
    // 模糊搜索事件 请求接口
    onSearch() {
      this.page = 1
      this.formInline.searchkey = this.formInline.searchkey.trim()
      this.getList()
    },
    // 重置事件  还要再次获取数据 且要把类型 关键字清空
    onClear() {
      this.page = 1
      this.formInline.typeValue = ''
      this.formInline.searchkey = ''
      this.$refs.filterTable.clearFilter()
      this.filteredValue = []
      this.getList()
    },

    // 点击详情 跳转到详情页面
    detail(val) {
      this.$nextTick(() => {
        this.$router.push({
          path: '哈哈',
          query: {
            _id: val._id
          }
        })
      })
    }
  }
}
</script>
<style lang="scss">
.app-container {
  .el-button.el-tooltip {
    width: 30px;
  }
  .el-icon-refresh {
    margin-left: -5px;
  }
  .el-table .tableRowClassHeader {
    background-color: #ecedee;
    font-weight: 500;
    height: 50px;
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    color: #666666;
    line-height: 18px;
  }
  .el-table__body-wrapper {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #333333;
    line-height: 18px;
  }
  .circle1 {
    width: 8px;
    height: 8px;
    background-color: #81c190;
    border-radius: 8px;
  }
  .circle2 {
    width: 8px;
    height: 8px;
    background-color: #7db5e9;
    border-radius: 8px;
  }
  .circle3 {
    width: 8px;
    height: 8px;
    background-color: #e5b256;
    border-radius: 8px;
  }
  .circle4 {
    width: 8px;
    height: 8px;
    background-color: #F70909;
    border-radius: 8px;
  }
  .el-table__column-filter-trigger {
    text-indent: 5px;
  }
  .el-table-filter__list-item.is-active{
    background-color: #ffffff;
    color: #FF9832;
  }
  .el-table-filter__list {
    min-width: 0px;
    padding: 5px 15px;
  }
}
</style>
