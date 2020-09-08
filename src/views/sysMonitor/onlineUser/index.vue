<template>
  <div class="list">
    <div class="app-container" style="padding: 20px">
      <div class="filter-container clearfix">
        <div class="pull-left">
          <!-- <el-button class="filter-item" type="warning" @click="forcedExit">{{ '强退' }}</el-button> -->
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

      <el-table :data="tableData" :header-cell-class-name="tableRowClassHeader" class="amountdetailTable" style="width: 100%" tooltip-effect="dark" fit @filter-change="filerStatus" >
        <!--批量操作事件 @selection-change="handleSelectionChange" -->
        <!-- <el-table-column
          type="selection"
          width="55">
        </el-table-column> -->
        <el-table-column :show-overflow-tooltip="true" :label="'会话编号'" style="text-align: center" prop="code">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'登录名称'" style="text-align: center" prop="username">
          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'部门名称'" style="text-align: center" prop="name">
          <template slot-scope="scope">
            <span>{{ scope.row.permissions.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'主机'" style="text-align: center" prop="ip">
          <template slot-scope="scope">
            <span>{{ scope.row.ip }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'浏览器'" style="text-align: center" prop="browser">
          <template slot-scope="scope">
            <span>{{ scope.row.browser }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'操作系统'" style="text-align: center" prop="system">
          <template slot-scope="scope">
            <span>{{ scope.row.system }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'登录时间'" style="text-align: center" prop="firstLoginTime">
          <template slot-scope="scope">
            <span>{{ renderTime(scope.row.firstLoginTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'最近访问时间'" style="text-align: center" prop="lastAccessTime">
          <template slot-scope="scope">
            <span>{{ renderTime(scope.row.lastAccessTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'操作'" style="text-align: center">
          <template slot-scope="scope">
            <el-button class="forced" type="warning" size="small" @click="delAlert(scope.row.code)">{{ $t('login.logout') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="page"
        :limit.sync="limit"
      />
      <!-- @pagination="pageChange()" -->
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Cookies from 'js-cookie'
import Pagination from '@/components/Pagination'
import 'element-ui/lib/theme-chalk/index.css'
import { renderTime } from '@/utils'
import { fetchOnlineList, fetchOnlineLogout } from '@/api/user'
export default {
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      filteredValue: [],
      tableData: [],
      code: '',
      dialogVisable: false,
      total: 0, // 假的 最后是拿到后端的pageInfo的totalItems
      page: 1,
      limit: 20,
      userId: Cookies.get('userId'),
      originCode: '',
      oldSize: 20,
      renderTime,
      dialogVisible: false,
      code: ''
    }
  },
  // watch: {
  //   limit() {
  //     this.page = 1
  //     this.pageChange()
  //   }
  // },
  created() {
    Message.closeAll()
    this.getList()
  },
  methods: {
    create() {
      this.dialogVisable = true
    },
    closeDialog() {
      this.dialogVisable = false
    },
    // 强退
    delAlert(code) {
      const token = Cookies.get('token')
      this.code = code
      if (this.token === this.code) {
        this.$confirm('此操作将强制退出本账号, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.lineLogout()
        })
      } else {
        this.$confirm('此操作将强制退出该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.forcedSure()
        })
      }

    },
    forcedSure() {
      const token = Cookies.get('token')
      fetchOnlineLogout(this.code).then(response => {
        if (response.code === 0) {
          this.getList()
        }
      })
    },
    lineLogout() {
      // window.location.href = `${process.env.LOGOUT_URL}`;
      Cookies.remove('token')
      Cookies.remove('username')
      Cookies.remove('userId')
      Cookies.remove('level')
      this.$router.push('/login')
    },
    onSearch() {
      console.log('搜索')
    },
    // 表头样式
    tableRowClassHeader({ row, rowIndex }) {
      return 'tableRowClassHeader'
    },
    // pageChange() {
    //   if (this.oldSize !== this.limit) {
    //     this.page = 1
    //   }
    //   this.oldSize = this.limit
    //   this.getList(this.$route.query._id)
    // },
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
    getList() {
      fetchOnlineList().then(response => {
        this.tableData = []
        for (let i = 0; i < response.body.data.length; i++) {
          this.code = response.body.data[i].code
          this.tableData.push(Object.assign(response.body.data[i]))
        }
        // this.tableData = response.data.result
        // this.total = response.data.pageInfo.totalItems
        // this.listLoading = false
      })
    },

    // 批量操作
    // handleSelectionChange(val) {
    //   this.multipleSelection = val
    // },
    dialogQuxiao() {
      this.dialogVisable = false
    },
    dialogConfirm() {
      this.dialogVisable = false
    }
  }
}
</script>

<style lang='scss' scoped>
</style>

