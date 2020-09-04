<template>
  <div class="list">
    <div class="title">
      摄像头管理
    </div>
    <div class="app-container" style="padding: 20px">
      <div class="filter-container clearfix">
        <div class="pull-left">
          <el-button class="filter-item" type="warning" icon="el-icon-plus" @click="create">{{ '新增摄像头' }}</el-button>
          <el-dialog :visible="dialogVisable" title="新增摄像头" width="520px" @close="closeDialog">
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
          </el-dialog>
        </div>
        <div class="pull-right">
          <el-select v-model="formInline.typeValue" style="width:120px;" class="filter-item" @change="checkModel">
            <el-option v-for="item in typeOptions" :key="item._id" :label="item.name" :value="item._id"></el-option>
          </el-select>
        </div>
      </div>
      <el-table :data="tableData" :header-cell-class-name="tableRowClassHeader" class="amountdetailTable" style="width: 100%" tooltip-effect="dark" fit @filter-change="filerStatus" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'摄像头ID'" prop="createTime"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'负责人'" prop="custName"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'经纬度信息'" prop="appName"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'地址'" prop="apiName"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'添加人'" prop="originCode"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'添加时间'" prop="createTime"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'视频流信息'" prop="consumeTime"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'告警信息'" prop="consumeTime"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'操作'" prop="consumeTime"></el-table-column>
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
  fetchAllCameraList
} from '@/api/camera'
export default {
  components: { Pagination },
  data() {
    return {
      formInline: {
        searchkey: '',
        typeValue: 'list'
      },
      typeOptions: [{ name: '地图模式', _id: 'map' },
        { name: '列表模式', _id: 'list' }],
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
    // 再次请求应用列表的数据 不分页
    getExportList() {
      const params = {
        isPaging: 0,
        limit: 999999,
        originCode: this.originCode
      }
      fetchAmountDetailList(params, this.$route.query._id).then(response => {
        if (response.data.result.length === 0) {
          this.$message({
            message: '无数据',
            type: 'warning'
          })
          return
        }
        this.exportData = response.data.result
        import('@/vendor/Export2Excel').then(excel => {
          const filterVal = ['createTime', 'custName', 'appName', 'apiName', 'originCode', 'consumeTime']
          const data = this.formatJson(filterVal, this.exportData)
          excel.export_json_to_excel({
            header: ['调用时间', '客户名称', '应用名称', '接口名称', '状态码', '耗时'], // 表头 必填,
            data, // 具体数据 必填
            filename: '调用量详情列表', // 非必填
            autoWidth: true, // 非必填
            bookType: 'xlsx' // 非必填
          })
        })
      })
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
      const params = {
        page: this.page,
        limit: this.limit
      }
      fetchAllCameraList(params, id).then(response => {
        this.tableData = response.data.result
        this.total = response.data.pageInfo.totalItems
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

</style>

