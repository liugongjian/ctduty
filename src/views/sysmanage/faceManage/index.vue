<template>
  <div class="list">
    <!--  <div class="title">
      摄像头管理
    </div> -->
    <div class="app-container" style="padding: 20px">
      <div class="filter-container clearfix">
        <div class="pull-left">
          <el-button class="filter-item" type="warning" icon="el-icon-plus" @click="create">{{ '新增人脸数据' }}</el-button>
          <el-button class="filter-item" @click="bulkimport ">{{ '导入人脸数据' }}</el-button>
          <el-button type="text" size="small" @click="batchesDel">{{ '批量删除' }}</el-button>
          <el-dialog :visible="bulkimportVisble" title="导入人脸数据" width="50vw" height="70vh" @close="closebulkimportDialog">
            <el-table v-if="isBatchSuccess" :data="tableData" :header-cell-class-name="tableRowClassHeader" class="amountdetailTable" style="width: 100%" tooltip-effect="dark" fit @filter-change="filerStatus" @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'姓名'" prop="id"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'所属名单'" prop="online">
                <template slot-scope="scope">
                  <span>{{ scope.row.online ? "离线":"在线" }}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'图片预览'" prop="inCharge.username"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'操作'">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="editDialog(scope.row)">{{ '编辑' }}</el-button>
                  <el-button type="text" size="small" @click="delAlert(scope.row.id)">{{ '删除' }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-upload
              v-else
              class="upload-demo"
              drag
              list-type="picture"
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple
              @on-success = "batchUpSuccess">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-dialog>
          <el-dialog :visible="dialogVisable" title="新增人脸数据" width="520px" @close="closeDialog">
            <el-form :model="addFaceForm" label-position="right" label-width="130px">
              <el-form-item label="姓名: "><el-input v-model="addFaceForm.name" placeholder="请输入摄像头ID" class="filter-item" style="width: 150px;"></el-input>
              </el-form-item>
              <el-form-item label="上传人脸图像: ">
                <el-upload
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="所属名单: ">
                <el-select v-model="formInline.typeValue" style="width:120px;" class="filter-item" @change="checkModel">
                  <el-option v-for="item in typeOptions" :key="item._id" :label="item.name" :value="item._id"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button
                type="primary"
                @click="dialogConfirm('dialogForm')"
              >确 定</el-button>
              <el-button @click="dialogQuxiao">取 消</el-button>
            </div>
          </el-dialog>
        </div>
        <div class="pull-right">
          <el-input v-model="formInline.searchkey" placeholder="请输入摄像头地址" class="filter-item" style="width: 260px;" @keyup.enter.native="onSearch"></el-input>
          <el-button v-waves class="filter-item" type="warning" @click="onSearch">
            {{ '搜索' }}
          </el-button>
        </div>
      </div>
      <el-table :data="tableData" :header-cell-class-name="tableRowClassHeader" class="amountdetailTable" style="width: 100%" tooltip-effect="dark" fit @filter-change="filerStatus" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'姓名'" prop="id"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'所属名单'" prop="online">
          <template slot-scope="scope">
            <span>{{ scope.row.online ? "离线":"在线" }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'图片预览'" prop="inCharge.username"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'操作'">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editDialog(scope.row)">{{ '编辑' }}</el-button>
            <el-button type="text" size="small" @click="delAlert(scope.row.id)">{{ '删除' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible="editVisable" title="编辑" width="520px" @close="editCloseDialog">
        <el-form :model="editForm" label-position="right" label-width="130px">
          <el-form-item label="摄像头ID："><el-input v-model="editForm.id" placeholder="请输入摄像头ID" class="filter-item" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item label="摄像头名称："><el-input v-model="editForm.name" placeholder="请输入摄像头名称" class="filter-item" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item label="负责人：">
            <el-select v-model="editForm.inChargeId" :value="editForm.inChargeId" placeholder="请选择负责人">
              <el-option v-for="item in userList" :value="item.id" :label="item.username" :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="添加人：">
            <el-select v-model="editForm.creatorId" :value="editForm.creatorId" placeholder="请选择添加人">
              <el-option v-for="item in userList" :value="item.id" :label="item.username" :key="item.id">
              </el-option>
            </el-select>
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
import moment from 'moment'
import {
  fetchAllCameraList, editCamera, addCamera, delCamera
} from '@/api/camera'
import { fetchUserList } from '@/api/users'
export default {
  components: { Pagination },
  data() {
    return {
      fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
      dialogForm: {
        address: '',
        creatorId: '',
        id: '',
        name: '',
        latitude: '',
        longitude: '',
        url: '',
        inChargeId: '',
        manufacturer: '',
        model: '',
        phone: ''
      },
      isBatchSuccess: true,
      typeOptions: [{ name: '地图模式', _id: 'map' },
        { name: '列表模式', _id: 'list' }],
      imageUrl: '',
      addFaceForm: {

      },
      addrules: {
        creatorId: [
          { required: true, trigger: 'blur', message: '创建人ID不能为空' }
        ],
        name: [
          { required: true, trigger: 'blur', message: '摄像头名称不能为空' }
        ],
        url: [
          { required: true, trigger: 'blur', message: '视频流信息不能为空' }
        ],
        phone: [
          { required: true, trigger: 'blur', message: '手机号不能为空' }
        ],
        manufacturer: [
          { required: true, trigger: 'blur', message: '制造厂商不能为空' }
        ],
        model: [
          { required: true, trigger: 'blur', message: '设备型号不能为空' }
        ],
        id: [
          { required: true, trigger: 'blur', message: '摄像头ID不能为空' }
        ],
        inChargeId: [
          { required: true, trigger: 'blur', message: '负责人ID不能为空' }
        ],
        longitude: [
          { required: true, trigger: 'blur', message: '经度不能为空' }
        ],
        latitude: [
          { required: true, trigger: 'blur', message: '纬度不能为空' }
        ],
        address: [
          { required: true, trigger: 'blur', message: '地址不能为空' }
        ]
      },
      formInline: {
        searchkey: '',
        typeValue: 'list'
      },
      listLoading: false,
      filteredValue: [],
      tableData: [],
      dialogVisable: false,
      total: 0, // 假的 最后是拿到后端的pageInfo的totalItems
      page: 1,
      limit: 10,
      userId: Cookies.get('userId'),
      originCode: '',
      oldSize: 10,
      delIDArr: [],
      editVisable: false,
      editForm: {
        id: '',
        inChargeId: '',
        longitude: '',
        latitude: '',
        address: '',
        url: '',
        name: '',
        creatorId: ''
      },
      userList: [],
      bulkimportVisble: false
    }
  },
  watch: {
    limit() {
      this.page = 1
      this.pageChange()
    }
  },
  async created() {
    await Message.closeAll()
    await this.getUserList()
    await this.getList()
  },
  methods: {
    batchUpSuccess() {
      this.isBatchSuccess = true
      console.log('批量上传成功')
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    bulkimport() {
      this.bulkimportVisble = true
    },
    closebulkimportDialog() {
      this.bulkimportVisble = false
    },
    getUserList() {
      const query = {
        cascade: true,
        page: {
          index: 1,
          size: 9999999
        },
        params: {}
      }
      fetchUserList(query).then(response => {
        if (response.code !== 0) return
        this.userList = response.body.data
      })
    },
    batchesDel() {
      this.$confirm('此操作将永久删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = [...this.delIDArr]
        delCamera(params).then(response => {
          this.getList()
          this.delIDArr = []
        }).catch(() => {
          this.delIDArr = []
        })
      })
    },
    delAlert(d) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = [d]
        delCamera(params).then(response => {
          this.getList()
          this.delIDArr = []
        })
      })
    },
    formatTime: function(row, column, cellValue) {
      return moment(cellValue).format('YYYY-MM-DD HH:mm:SS')
    },
    editDialog(v) {
      this.editForm.id = v.id
      this.editForm.creatorId = v.creatorId
      this.editForm.inChargeId = v.inChargeId
      this.editForm.longitude = v.longitude
      this.editForm.latitude = v.latitude
      this.editForm.address = v.address
      this.editForm.name = v.name
      this.editForm.url = v.url
      this.editVisable = true
    },
    editCloseDialog() {
      this.editVisable = false
    },
    editDialogConfirm() {
      const params = [{
        id: this.editForm.id,
        inChargeId: this.editForm.inChargeId,
        latitude: this.editForm.latitude,
        longitude: this.editForm.longitude,
        url: this.editForm.url,
        name: this.editForm.name,
        creatorId: this.editForm.creatorId
      }]
      editCamera(params).then(response => {
        this.$notify({
          title: '成功',
          message: '编辑成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
        this.editVisable = false
      })
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
    getList() {
      const params = {
        cascade: true,
        page: {
          index: this.page,
          size: this.limit
        },
        params: {
        }
      }
      fetchAllCameraList(params).then(res => {
        this.tableData = res.body.data
        this.total = res.body.page.total
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      val.forEach(item => {
        if (this.delIDArr.indexOf(item.id) === -1) {
          this.delIDArr.push(item.id)
        }
      })
    },
    dialogQuxiao() {
      this.dialogVisable = false
    },
    dialogConfirm() {
      this.$refs.addForm.validate(valid => {
        if (!valid) return
        const params = [
          this.dialogForm
        ]
        addCamera(params).then(res => {
          this.dialogForm = {
            address: '',
            creatorId: '',
            id: '',
            name: '',
            latitude: '',
            longitude: '',
            url: '',
            inChargeId: '',
            manufacturer: '',
            model: '',
            phone: ''
          }
          this.$notify({
            title: '成功',
            message: '增加成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
          this.dialogVisable = false
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '增加失败',
            type: 'error',
            duration: 2000
          })
        })
      })
    }
  }
}
</script>

<style lang='scss'>
.list {
  overflow: auto !important;
  min-height: calc(100vh - 90px) !important;
}
.app-main {
  padding-top: 50px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .upload-demo {
    width: 300px;
    margin: 0 auto;
  }
</style>

