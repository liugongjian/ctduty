<template>
  <div class="app-container" style="padding: 20px">
    <div class="filter-container clearfix">
      <div class="pull-right">
        <el-input v-model="formInline.searchkey" placeholder="奖品名称" class="filter-item" style="width: 200px;margin-left:10px;" @keyup.enter.native="onSearch"></el-input>
        <el-button v-waves class="filter-item" style="margin-left: 10px;" type="warning" @click="onSearch">
          {{ $t('prizeList.search') }}
        </el-button>
        <el-tooltip class="toolTipItem" effect="dark" content="重置搜索" placement="top" >
          <el-button class="filter-item" icon="el-icon-refresh" @click="onClear"></el-button>
        </el-tooltip>
      </div>
      <div class="pull-left">
        <el-button v-permission="['/activitycenter/prize/:create']" class="filter-item" type="warning" icon="el-icon-plus" @click="create">{{ $t('prizeList.create') }}</el-button>
      </div>
    </div>
    <el-table ref="filterTable" :data="tableData" :header-cell-class-name="tableRowClassHeader" style="width: 100%" tooltip-effect="dark" fit class="apiPackagesStatus" @filter-change="filerStatus">
      <el-table-column :label="$t('prizeList.name')" :show-overflow-tooltip="true" prop="name" min-width="25%">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('prizeList.status')" prop="status" min-width="18%" >
        <template slot-scope="scope" class="status">
          <div v-if="scope.row.status === 1" class="nomalStatus">开启</div>
          <div v-else-if="scope.row.status === 0" class="closeStatus">关闭</div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('prizeList.default')" :show-overflow-tooltip="true" min-width="25%">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">默认</span>
          <span v-else>非默认</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('prizeList.pic')" :show-overflow-tooltip="true" min-width="25%">
        <template slot-scope="scope">
          <img :src="scope.row.img" width="50" height="50" >
        </template>
      </el-table-column>
      <el-table-column :label="$t('prizeList.count')" :show-overflow-tooltip="true" prop="amount" min-width="25%">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('prizeList.probability')" :show-overflow-tooltip="true" prop="percent" min-width="25%">
        <template slot-scope="scope">
          <span>{{ scope.row.percent }}%</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('prizeList.actions')" width="180px">
        <template slot-scope="scope">
          <el-button v-permission="['/activitycenter/prize/:detail']" type="text" size="small" @click="detail(scope.row)">{{ $t('prizeList.detail') }}</el-button>
          <el-button v-permission="['/activitycenter/prize/:edit']" type="text" size="small" @click="edit(scope.row)">{{ $t('prizeList.edit') }}</el-button>
          <el-button v-permission="['/activitycenter/prize/:delete']" type="text" size="small" @click="del(scope.row)">{{ $t('prizeList.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getList()"/>
  </div>
</template>

<script>
// import Cookies from 'js-cookie'
import { Message } from 'element-ui'
import Pagination from '@/components/Pagination'
import { renderTime } from '@/utils'
import {
  fetchPrizeList, delPrize
} from '@/api/applications'
export default {
  name: 'List',
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      formInline: {
        searchkey: ''
      },
      renderTime,
      tableData: [],
      total: 0, // 假的 最后是拿到后端的pageInfo的totalItems
      page: 1,
      limit: 20,
      filteredValue: []
    }
  },
  watch: {

  },
  created() {
    Message.closeAll()
    this.getList()
  },
  methods: {
    // 表头样式
    tableRowClassHeader({ row, rowIndex }) {
      return 'tableRowClassHeader'
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      const params = {
        page: this.page,
        limit: this.limit,
        name: this.formInline.searchkey,
        status: this.filteredValue && this.filteredValue[0]
      }
      fetchPrizeList(params).then(response => {
        this.tableData = response.data.result
        this.total = response.data.pageInfo.totalItems
        this.listLoading = false
      })
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
      if (this.formInline.searchkey.trim().length === 0) {
        this.$message({
          message: '请输入非空字符进行搜索！',
          type: 'warning'
        })
        return false
      } else {
        this.formInline.searchkey = this.formInline.searchkey.trim()
        this.getList()
      }
    },
    // 重置事件  还要再次获取数据 且要把类型 关键字清空
    onClear() {
      this.page = 1
      this.formInline.searchkey = ''
      this.$refs.filterTable.clearFilter()
      this.filteredValue = []
      this.getList()
    },
    // 点击创建 跳转到创建页面
    create() {
      this.$nextTick(() => {
        this.$router.push({
          path: '/activitycenter/prize/create'
        })
      })
    },
    // 点击详情 跳转到详情页面
    detail(val) {
      this.$nextTick(() => {
        this.$router.push({
          path: '/activitycenter/prize/detail',
          query: {
            _id: val._id
          }
        })
      })
    },
    del(val) {
      this.$confirm('此操作将删除这条奖品数据，是否继续', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delPrize(val._id).then((res) => {
            this.getList()
            this.$message({
              type: 'info',
              message: '删除成功'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 点击编辑 跳转到编辑页面
    edit(val) {
      this.$nextTick(() => {
        this.$router.push({
          path: '/activitycenter/prize/edit',
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
</style>
