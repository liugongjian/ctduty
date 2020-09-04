<template>
  <div class="list">
    <div class="app-container" style="padding: 20px">
      <div class="filter-container clearfix">
        <div class="pull-left">
          <el-button class="filter-item" type="warning" @click="create">{{ '强退' }}</el-button>
          <!-- <el-dialog :visible="dialogVisable" title="新增摄像头" width="520px" @close="closeDialog">
            <el-form :model="viewXq" label-position="right" label-width="100px">
              <el-form-item label="摄像头ID："><el-input placeholder="请输入摄像头ID" class="filter-item" style="width: 350px;"></el-input>
              </el-form-item>
              <el-form-item label="负责人："><el-input placeholder="请输入负责人" class="filter-item" style="width: 350px;"></el-input>
              </el-form-item>
              <el-form-item label="摄像头经度："><el-input placeholder="请输入摄像头经度" class="filter-item" style="width: 350px;"></el-input>
              </el-form-item>
              <el-form-item label="摄像头纬度："><el-input placeholder="请输入摄像头纬度" class="filter-item" style="width: 350px;"></el-input>
              </el-form-item>
              <el-form-item label="地址："><el-input :rows="4" type="textarea" placeholder="请输入地址" class="filter-item" style="width: 350px;"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button
                type="primary"
                @click="dialogConfirm"
              >确 定</el-button>
              <el-button @click="dialogQuxiao">取 消</el-button>
            </div>
          </el-dialog> -->
        </div>
      </div>
      <el-table :data="tableData" :header-cell-class-name="tableRowClassHeader" class="amountdetailTable" style="width: 100%" tooltip-effect="dark" fit @filter-change="filerStatus" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'会话编号'" prop="code"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'登录名称'" prop="username"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'部门名称'" prop="name"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'主机'" prop="ip"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'浏览器'" prop="browser"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'操作系统'" prop="system"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'登录时间'" prop="firstLoginTime"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'最近访问时间'" prop="lastAccessTime"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'操作'">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="logout(scope.row)">{{ $t('login.logout') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
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
import {
  fetchOnlineList
} from '@/api/applications'
export default {
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      filteredValue: [],
      tableData: [],
      dialogVisable: false,
      total: 0, // 假的 最后是拿到后端的pageInfo的totalItems
      page: 1,
      limit: 20,
      userId: Cookies.get('userId'),
      originCode: '',
      oldSize: 20
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
  },
  methods: {
    create() {
      this.dialogVisable = true
    },
    closeDialog() {
      this.dialogVisable = false
    },
    onSearch() {
      console.log('搜索')
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
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'consumeTime') {
          return v[j] + 'ms'
        } else {
          return v[j]
        }
      }))
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
      fetchOnlineList().then(response => {
        this.tableData = response.body.data
        console.log('response',response)
        console.log('this tabledata', this.tableData)
        // this.tableData = response.data.result
        // this.total = response.data.pageInfo.totalItems
        // this.listLoading = false
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

</style>

