<template>
  <div class="list">
    <div class="title">
      摄像头管理
    </div>
    <div class="app-container" style="padding: 20px">
      <div class="filter-container clearfix">
        <div class="pull-left">
          <el-button class="filter-item" type="warning" icon="el-icon-plus" @click="create">{{ '新增摄像头' }}</el-button>
          <el-button type="text" size="small" @click="detail()">{{ '批量删除' }}</el-button>
          <el-dialog :visible="dialogVisable" title="新增摄像头" width="520px" @close="closeDialog">
            <el-form :model="dialogForm" label-position="right" label-width="100px">
              <el-form-item label="摄像头ID："><el-input v-model="dialogForm.id" placeholder="请输入摄像头ID" class="filter-item" style="width: 300px;"></el-input>
              </el-form-item>
              <el-form-item label="负责人："><el-input v-model="dialogForm.inCharge" placeholder="请输入负责人" class="filter-item" style="width: 300px;"></el-input>
              </el-form-item>
              <el-form-item label="摄像头经度："><el-input v-model="dialogForm.longitude" placeholder="请输入摄像头经度" class="filter-item" style="width: 300px;"></el-input>
              </el-form-item>
              <el-form-item label="摄像头纬度："><el-input v-model="dialogForm.latitude" placeholder="请输入摄像头纬度" class="filter-item" style="width: 300px;"></el-input>
              </el-form-item>
              <el-form-item label="地址："><el-input v-model="dialogForm.address" :rows="4" type="textarea" placeholder="请输入地址" class="filter-item" style="width: 300px;"></el-input>
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
        <el-table-column :show-overflow-tooltip="true" :label="'摄像头ID'" prop="id"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'负责人'" prop="inCharge"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'摄像头经度'" prop="longitude"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'摄像头纬度'" prop="latitude"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'地址'" prop="address"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'添加人'" prop="creator"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'添加时间'" prop="createTime"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'视频流信息'" prop="url"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'告警信息'" prop="consumeTime"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'操作'">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editDialog(scope.row)">{{ '编辑' }}</el-button>
            <el-button type="text" size="small" @click="detail(scope.row)">{{ '删除' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible="editVisable" title="编辑" width="520px" @close="editCloseDialog">
        <el-form :model="editForm" label-position="right" label-width="100px">
          <el-form-item label="摄像头ID："><el-input v-model="editForm.id" placeholder="请输入摄像头ID" class="filter-item" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item label="负责人："><el-input v-model="editForm.inCharge" placeholder="请输入负责人" class="filter-item" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item label="摄像头经度："><el-input v-model="editForm.longitude" placeholder="请输入摄像头经度" class="filter-item" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item label="摄像头纬度："><el-input v-model="editForm.latitude" placeholder="请输入摄像头纬度" class="filter-item" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item label="视频流信息："><el-input v-model="editForm.url" placeholder="请输入视频流信息" class="filter-item" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item label="地址："><el-input v-model="editForm.address" :rows="4" type="textarea" placeholder="请输入地址" class="filter-item" style="width: 300px;"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="editDialogConfirm"
          >确 定</el-button>
          <el-button @click="editDialogQuxiao">取 消</el-button>
        </div>
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
</template>

<script>
import { Message } from 'element-ui'
import Cookies from 'js-cookie'
import Pagination from '@/components/Pagination'
import 'element-ui/lib/theme-chalk/index.css'
import {
  fetchAllCameraList, editCamera
} from '@/api/camera'
export default {
  components: { Pagination },
  data() {
    return {
      dialogForm: {
        id: '',
        inCharge: '',
        longitude: '',
        latitude: '',
        address: ''
      },
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
    this.getList()
  },
  methods: {
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
      this.getList()
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
        this.getList()
      } else {
        this.filteredValue = columnObj[columnObjKey]
        this.getList()
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
      fetchAllCameraList(params).then(res => {
        console.log(res)
        this.tableData = res.body.data
        this.total = res.body.page.total
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

