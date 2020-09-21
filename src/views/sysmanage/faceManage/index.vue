<template>
  <div class="list">
    <!--  <div class="title">
      摄像头管理
    </div>-->
    <div class="app-container" style="padding: 20px">
      <div class="filter-container clearfix">
        <div class="pull-left">
          <el-button
            class="filter-item"
            type="warning"
            icon="el-icon-plus"
            @click="addFace"
          >{{ '新增人脸数据' }}</el-button>
          <el-button class="filter-item" @click="bulkimport ">{{ '导入人脸数据' }}</el-button>
          <el-button type="text" size="small" @click="batchesDel">{{ '批量删除' }}</el-button>
          <el-dialog
            :visible="bulkimportVisble"
            title="导入人脸数据"
            width="50vw"
            height="70vh"
            @close="closebulkimportDialog"
          >
            <el-table
              v-if="isBatchSuccess"
              :data="mulTableData"
              :header-cell-class-name="tableRowClassHeader"
              class="amountdetailTable"
              style="width: 100%"
              tooltip-effect="dark"
              fit
              @on-success="batchUpSuccess"
            >
              <el-table-column :show-overflow-tooltip="true" :label="'姓名'" prop="id"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'所属名单'" prop="online">
                <template slot-scope="scope">
                  <span>{{ scope.row.online ? "离线":"在线" }}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'人员图片'">
                <template slot-scope="scope">
                  <el-popover placement="left-end" width="424" trigger="hover">
                    <img :src="scope.row.image" alt width="400" class="hoverImg" >
                    <img slot="reference" :src="scope.row.image" alt style="width: 120px; height: 100px">
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'操作'">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="editDialog(scope.row)">{{ '编辑' }}</el-button>
                  <el-button type="text" size="small" @click="delAlert(scope.row.id)">{{ '删除' }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-upload
              v-else
              :action="upMulUrl"
              :headers="upSingleHeaders"
              :data="mulUpData"
              :before-upload="beforeMulUpload"
              :limit="99999999999"
              class="upload-demo"
              drag
              list-type="picture"
              multiple
              @on-success="batchUpSuccess"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div slot="tip" class="el-upload__tip" style="width: 400px">
                支持的格式：图片仅支持120*108像素.jpg格式
                <br >图片命名规则：使用图片中人脸的姓名进行图片命名，如张三.jpg
              </div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogConfirm('dialogForm')">提 交</el-button>
            </div>
          </el-dialog>
          <el-dialog :visible="dialogVisable" title="新增人脸数据" width="520px" @close="closeDialog">
            <el-form ref="addForm" :model="addFaceForm" label-position="right" label-width="130px">
              <el-form-item label="姓名: ">
                <el-input
                  v-model="addFaceForm.name"
                  placeholder="请输入姓名"
                  class="filter-item"
                  style="width: 150px;"
                ></el-input>
              </el-form-item>
              <el-form-item label="上传人脸图像: ">
                <el-upload
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :on-error="handleAvatarError"
                  :before-upload="beforeAvatarUpload"
                  :action="upSingleUrl"
                  :on-progress="handleAvatarProgress"
                  :headers="upSingleHeaders"
                  :data="upSingleData"
                  class="avatar-uploader"
                >
                  <img v-if="addFaceForm.imageUrl" :src="addFaceForm.imageUrl" class="avatar" >
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="所属名单: ">
                <el-select
                  v-model="formInline.typeValue"
                  style="width:120px;"
                  class="filter-item"
                  @change="checkModel"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item._id"
                    :label="item.name"
                    :value="item._id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="addFaceConfirm('dialogForm')">确 定</el-button>
              <el-button @click="closeDialog">取 消</el-button>
            </div>
          </el-dialog>
        </div>
        <div class="pull-right">
          <el-input
            v-model="formInline.searchkey"
            placeholder="请输入"
            class="filter-item"
            style="width: 260px;"
            @keyup.enter.native="onSearch"
          ></el-input>
          <el-button v-waves class="filter-item" type="warning" @click="onSearch">{{ '搜索' }}</el-button>
          <el-button class="searchbtn filter-item" @click="resetQuery">重置</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        :header-cell-class-name="tableRowClassHeader"
        class="amountdetailTable"
        style="width: 100%"
        tooltip-effect="dark"
        fit
        @filter-change="filerStatus"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'姓名'" prop="name"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'所属名单'" prop="nameList">
          <template slot-scope="scope">
            <span v-if="scope.row.nameList === 1"> 居民白名单 </span>
            <span v-else-if="scope.row.nameList === 2">员工白名单</span>
            <span v-else-if="scope.row.nameList === 3">嫌疑人员</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'人员图片'">
          <template slot-scope="scope">
            <el-popover placement="left-end" width="424" trigger="hover">
              <img :src="scope.row.image + '.png'" alt width="400" class="hoverImg" >
              <img slot="reference" :src="scope.row.image + '.png'" alt >
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'操作'">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editDialog(scope.row)">{{ '编辑' }}</el-button>
            <el-button type="text" size="small" @click="delAlert(scope.row.id)">{{ '删除' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible="editVisable" title="编辑" width="520px" @close="editCloseDialog">
        <el-form :model="editForm" label-position="right" label-width="130px">
          <el-form-item label="姓名：">
            <el-input
              v-model="editForm.name"
              placeholder="请输入姓名"
              class="filter-item"
              style="width: 300px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="上传人脸图像: ">
            <template>
              <div class="editPictrue">
                <el-upload :auto-upload="false" action="#" list-type="picture-card">
                  <i slot="default" class="el-icon-plus"></i>
                  <div slot="file" slot-scope="{file}">
                    <img :src="file.url" class="el-upload-list__item-thumbnail" alt >
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)"
                      >
                        <i class="el-icon-zoom-in"></i>
                      </span>
                      <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleDownload(file)"
                      >
                        <i class="el-icon-download"></i>
                      </span>
                      <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)"
                      >
                        <i class="el-icon-delete"></i>
                      </span>
                    </span>
                  </div>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img :src="dialogImageUrl" width="100%" alt >
                </el-dialog>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="所属名单: ">
            <el-select
              v-model="formInline.typeValue"
              style="width:120px;"
              class="filter-item"
              @change="checkModel"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editDialogConfirm">确 定</el-button>
          <el-button @click="editCloseDialog">取 消</el-button>
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
import config from '../../../config'
import Pagination from '@/components/Pagination'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import {
  uploadImage,
  uploadMultiImage
} from '@/api/dm'
import {
  fetchFaceList,
  fetchAddFace,
  fetchDeleteFace,
  fetchUpdateFace,
  fetchCheckFace
} from '@/api/face'
import { fetchUserList } from '@/api/users'
const token = Cookies.get('token')
export default {
  components: { Pagination },
  data() {
    return {
      upSingleHeaders: {
        Authorization: token
      },
      upSingleData: {
        name: ''
      },
      mulUpData: {
        name: ''
      },
      mulTableData: [],
      upSingleUrl: process.env.LOT_ROOT + '/Userface/UploadImage',
      upMulUrl: process.env.LOT_ROOT + '/Userface/UploadMultiImage',
      fileList: [
        {
          name: 'food.jpeg',
          url:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          name: 'food2.jpeg',
          url:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
      ],
      dialogForm: {
        name: '',
        image: '',
        nameList: '',
        id: ''
      },
      isBatchSuccess: false,
      typeOptions: [
        { name: '居民白名单', _id: 1 },
        { name: '员工白名单', _id: 2 },
        { name: '嫌疑人员', _id: 3 }
      ],
      addFaceForm: {
        name: '',
        imageUrl: ''
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
        phone: [{ required: true, trigger: 'blur', message: '手机号不能为空' }],
        manufacturer: [
          { required: true, trigger: 'blur', message: '制造厂商不能为空' }
        ],
        model: [
          { required: true, trigger: 'blur', message: '设备型号不能为空' }
        ],
        id: [{ required: true, trigger: 'blur', message: '摄像头ID不能为空' }],
        inChargeId: [
          { required: true, trigger: 'blur', message: '负责人ID不能为空' }
        ],
        longitude: [
          { required: true, trigger: 'blur', message: '经度不能为空' }
        ],
        latitude: [
          { required: true, trigger: 'blur', message: '纬度不能为空' }
        ],
        address: [{ required: true, trigger: 'blur', message: '地址不能为空' }]
      },
      formInline: {
        searchkey: '',
        typeValue: 1
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
      faceList: [],
      bulkimportVisble: false,
      imageUrl: ''
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
    await this.getfaceList()
    await this.getfaceList()
  },
  methods: {
    handleAvatarProgress(e, file) {
      console.log(e, file, '呼呼')
    },
    checkModel() {

    },
    batchUpSuccess() {
      this.isBatchSuccess = true
      console.log('批量上传成功')
    },
    handleAvatarSuccess(res, file) {
      console.log(res.body.data[0], '嘻嘻')
      this.addFaceForm.imageUrl = 'http://36.41.71.26:8920/' + res.body.data[0]
      console.log(this.addFaceForm.imageUrl)
    },
    handleAvatarError(res, file) {
      console.log(res, file, '哈哈')
    },
    beforeAvatarUpload(file) {
      this.upSingleData.name = file.name.split('.')[0]
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
    beforeMulUpload(file) {
      this.mulUpData.name = file.name.split('.')[0]
      this.isBatchSuccess = true
    },
    bulkimport() {
      this.bulkimportVisble = true
    },
    closebulkimportDialog() {
      this.bulkimportVisble = false
      this.isBatchSuccess = false
    },
    getfaceList() {
      const query = {
        page: {
          index: 1,
          size: 9999999
        },
        params: {}
      }
      fetchFaceList(query).then(response => {
        if (response.code !== 0) return
        this.faceList = response.body.data
        this.tableData = response.body.data
        this.total = response.body.page.total
        this.listLoading = false
      })
    },
    batchesDel() {
      this.$confirm('此操作将永久删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = [...this.delIDArr]
        delCamera(params)
          .then(response => {
            this.getfaceList()
            this.delIDArr = []
          })
          .catch(() => {
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
        fetchDeleteFace(params).then(response => {
          this.getfaceList()
          this.delIDArr = []
        })
      })
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
      const params = [
        {
          id: this.editForm.id,
          inChargeId: this.editForm.inChargeId,
          latitude: this.editForm.latitude,
          longitude: this.editForm.longitude,
          url: this.editForm.url,
          name: this.editForm.name,
          creatorId: this.editForm.creatorId
        }
      ]
      editCamera(params).then(response => {
        this.$notify({
          title: '成功',
          message: '编辑成功',
          type: 'success',
          duration: 2000
        })
        this.getfaceList()
        this.editVisable = false
      })
    },
    addFace() {
      this.dialogVisable = true
    },
    closeDialog() {
      this.dialogVisable = false
    },
    onSearch() {},
    // 表头样式
    tableRowClassHeader({ row, rowIndex }) {
      return 'tableRowClassHeader'
    },
    pageChange() {
      if (this.oldSize !== this.limit) {
        this.page = 1
      }
      this.oldSize = this.limit
      this.getfaceList()
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
        this.getfaceList()
      } else {
        this.filteredValue = columnObj[columnObjKey]
        this.getfaceList()
      }
    },
    // 获取列表数据
    // getfaceList() {
    //   const params = {
    //     cascade: true,
    //     page: {
    //       index: this.page,
    //       size: this.limit
    //     },
    //     params: {}
    //   }
    //   fetchFaceList(params).then(res => {
    //     this.tableData = res.body.data
    //     this.total = res.body.page.total
    //     this.listLoading = false
    //   })
    // },
    handleSelectionChange(val) {
      val.forEach(item => {
        if (this.delIDArr.indexOf(item.id) === -1) {
          this.delIDArr.push(item.id)
        }
      })
    },
    addFaceConfirm() {
      this.$refs.addForm.validate(valid => {
        if (!valid) return
        const params = [{
          name: this.addFaceForm.name,
          image: this.addFaceForm.imageUrl,
          nameList: this.formInline.typeValue
        }]
        fetchAddFace(params)
          .then(res => {
            this.dialogForm = {
              name: '',
              image: '',
              nameList: '',
              id: ''
            }
            this.$notify({
              title: '成功',
              message: '增加成功',
              type: 'success',
              duration: 2000
            })
            this.getfaceList()
            this.dialogVisable = false
          })
          .catch(() => {
            this.$notify({
              title: '失败',
              message: '增加失败',
              type: 'error',
              duration: 2000
            })
          })
      })
    },
    dialogConfirm() {

    },
    // 重置
    resetQuery() {
      this.formInline.searchkey = ''
      this.page = 1
      this.limit = 10
      this.getfaceList()
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
  border-color: #409eff;
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
.el-dialog__body {
  width: 100%;
}
.el-popover.el-popover--plain {
  z-index: 9999999999999999999999 !important;
}
</style>

