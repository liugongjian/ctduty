<template>
  <div class="faceindexlist">
    <div class="app-container" style="padding: 20px">
      <div class="filter-container clearfix">
        <div class="pull-left">
          <el-input
            v-model="addFaceForm.searchkey"
            placeholder="请输入姓名"
            class="filter-item"
            style="width: 260px;"
            @keyup.enter.native="onSearch"
          ></el-input>
          <el-button
            v-waves
            class="filter-item"
            size="mini"
            style="height: 36px;margin-left:5px;"
            type="warning"
            @click="onSearch"
          >{{ '搜索' }}</el-button>
          <el-button
            class="filter-item"
            style="font-size:12px; height: 36px;"
            size="mini"
            @click="resetQuery"
          >重置</el-button>
        </div>
        <div class="pull-right">
          <el-button
            class="filter-item"
            type="warning"
            icon="el-icon-plus"
            @click="addFace"
          >{{ '新增人脸数据' }}</el-button>
          <el-button class="filter-item" @click="bulkimport ">{{ '导入人脸数据' }}</el-button>
          <el-button class="filter-item" @click="gohistory ">{{ '历史抓拍' }}</el-button>
          <el-button type="text" size="small" @click="batchesDel">{{ '批量删除' }}</el-button>
        </div>
        <el-dialog
          :visible="bulkimportVisble"
          title="导入人脸数据"
          width="50vw"
          height="70vh"
          @close="closebulkimportDialog"
        >
          <el-table
            v-loading="tableLoading"
            v-if="isBatchSuccess"
            :data="mulTableData"
            :header-cell-class-name="tableRowClassHeader"
            class="amountdetailTable"
            style="width: 100%"
            tooltip-effect="dark"
            fit
          >
            <el-table-column :show-overflow-tooltip="true" :label="'姓名'" prop="name"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" :label="'所属名单'" prop="select">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.nameList"
                  style="width:120px;"
                  class="filter-item"
                  @change="checkModel"
                >
                  <el-option
                    v-for="item in scope.row.typeOptions"
                    :key="item._id"
                    :label="item.name"
                    :value="item._id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" :label="'图片预览'">
              <template slot-scope="scope">
                <el-popover placement="left-end" width="424" trigger="hover" popper-class="img-popper">
                  <el-image :src="scope.row.image" alt width="400" class="hoverImg" />
                  <el-image
                    slot="reference"
                    :src="scope.row.image"
                    alt
                    style="width: 120px; height: 100px"
                  />
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" :label="'操作'">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="()=>{delmulTableInfo(scope.row.id)}"
                >{{ '删除' }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-upload
            v-else
            :action="upMulUrl"
            :headers="upSingleHeaders"
            :data="mulUpData"
            :before-upload="beforeMulUpload"
            :on-success="batchUpSuccess"
            class="upload-demo"
            drag
            list-type="picture"
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip" style="width: 400px">
              支持的格式：图片仅支持.png格式
              <br >图片命名规则：使用图片中人脸的姓名进行图片命名，如张三.png
            </div>
          </el-upload>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogConfirm('dialogForm')">提 交</el-button>
          </div>
        </el-dialog>
        <el-dialog :visible="dialogVisable" title="新增人脸数据" width="520px" @close="closeDialog">
          <el-form
            ref="addForm"
            :rules="addrules"
            :model="addFaceForm"
            label-position="right"
            label-width="130px"
          >
            <el-form-item label="姓名: " prop="name">
              <el-input
                v-model="addFaceForm.name"
                placeholder="请输入姓名"
                class="filter-item"
                style="width: 178px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="上传人脸图像: " prop="imageUrl">
              <el-upload
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :on-success="handleAvatarSuccess"
                :action="upSingleUrl"
                :headers="upSingleHeaders"
                :data="upSingleData"
                class="avatar-uploader"
              >
                <el-image v-if="addFaceForm.imageUrl" :src="addFaceForm.imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="所属名单: " prop="typeValue">
              <el-select
                v-model="addFaceForm.typeValue"
                style="width:178px;"
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
      <el-row v-if="tableData.length>0">
        <div class="colwrapper">
          <el-col
            v-for="(item,index) in tableData"
            :span="3"
            :key="index"
            :index="index"
            class="face-col"
          >
            <el-card :body-style="{ padding: '0px' }" class="face-card" shadow="never">
              <el-checkbox
                :key="item.id"
                class="face-checkbox"
                @change="checked=>checkboxchange(checked,item)"
              ></el-checkbox>
              <el-image :src="item.image" class="image" />
              <div class="face-info">
                <div style="display:flex;">
                  <el-tooltip
                    :content="item.name"
                    placement="bottom-start"
                  >
                    <div class="face-name" style="width:auto;max-width:48px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;" >
                      {{ item.name }}
                    </div>
                  </el-tooltip>
                  <el-tag
                    :type="item.nameList === 1 ? 'success' : item.nameList === 2 ? 'danger' : ''"
                    style="margin-top:3px;"
                    size="mini"
                  >{{ item.nameList === 1 ? "白名单" : item.nameList === 2 ? "黑名单" : "其他" }}</el-tag>
                </div>
                <div class="btn-box">
                  <el-button
                    type="text"
                    icon="el-icon-edit-outline"
                    style="width:10px;height:10px;color: #898989; margin-right: 4px;margin-top:.2px;"
                    size="mini"
                    @click="editDialog(item)"
                  ></el-button>
                  <div style="width:16px;height:24px;padding-left:6px;padding-top:8px;">
                    <div
                      style="display:inline-block;width: 1px;height: 12px; background: #e9e9e9; margin-right: 4px;"
                    ></div>
                  </div>
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    style="width:10px;height:10px;color: #a6a6a6;"
                    size="mini"
                    @click="delAlert(item.id)"
                  ></el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </div>
      </el-row>
      <div v-else class="face-nodata">暂无数据</div>
      <!-- <el-table
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
            <span v-if="scope.row.nameList === 1"> 白名单 </span>
            <span v-else-if="scope.row.nameList === 2">黑名单</span>
            <span v-else-if="scope.row.nameList === 3">其他</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'图片预览'">
          <template slot-scope="scope">
            <el-popover placement="left-end" width="424" trigger="hover">
              <el-image :src="scope.row.image" alt width="400" class="hoverImg" />
              <el-image slot="reference" :src="scope.row.image" alt style="width: 120px; height: 100px" />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'操作'">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editDialog(scope.row)">{{ '编辑' }}</el-button>
            <el-button type="text" size="small" @click="delAlert(scope.row.id)">{{ '删除' }}</el-button>
          </template>
        </el-table-column>
      </el-table>-->

      <el-dialog :visible="editVisable" title="编辑" width="520px" @close="editCloseDialog">
        <el-form :model="editForm" label-position="right" label-width="130px">
          <el-form-item label="姓名：">
            <el-input
              v-model="editForm.name"
              placeholder="请输入姓名"
              class="filter-item"
              style="width: 178px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="上传人脸图像: ">
            <template>
              <div class="editPictrue">
                <el-upload
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :on-success="editAvatarSuccess"
                  :action="upSingleUrl"
                  :headers="upSingleHeaders"
                  :data="upSingleData"
                  class="avatar-uploader"
                >
                  <el-image v-if="editForm.image" :src="editForm.image" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="所属名单: ">
            <el-select
              v-model="editForm.nameList"
              placeholder="请选择名单"
              style="width:178px;"
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
          <el-button type="primary" @click="editFaceConfirm">确 定</el-button>
          <el-button @click="editCloseDialog">取 消</el-button>
        </div>
      </el-dialog>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="page"
        :limit.sync="limit"
        :page-sizes="[12,24,36,48]"
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
  fetchFaceList,
  fetchAddFace,
  fetchDeleteFace,
  fetchUpdateFace,
  fetchSearchFace
} from '@/api/face'
const token = Cookies.get('token')
export default {
  components: { Pagination },
  data() {
    return {
      tableLoading: null,
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
      editForm: {},
      isBatchSuccess: false,
      typeOptions: [
        { name: '白名单', _id: 1 },
        { name: '黑名单', _id: 2 },
        { name: '其他', _id: 3 }
      ],
      addFaceForm: {
        name: '',
        imageUrl: '',
        searchkey: '',
        typeValue: 1
      },
      addrules: {
        name: [{ required: true, trigger: 'blur', message: '名称不能为空' }],
        imageUrl: [
          { required: true, trigger: 'blur', message: '图片不能为空' }
        ],
        typeValue: [
          { required: true, trigger: 'blur', message: '所属名单不能为空' }
        ]
      },
      listLoading: false,
      filteredValue: [],
      tableData: [],
      dialogVisable: false,
      total: 0, // 假的 最后是拿到后端的pageInfo的totalItems
      page: 1,
      limit: 12,
      userId: Cookies.get('userId'),
      originCode: '',
      oldSize: 10,
      delIDArr: [],
      editVisable: false,
      faceList: [],
      bulkimportVisble: false,
      imageUrl: '',
      delMulId: null
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
  },
  methods: {
    delmulTableInfo(id) {
      this.delMulId = id
      this.$confirm('你确定要删除此条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.mulTableData = this.mulTableData.filter(item => {
            return item.id !== this.delMulId
          })
        })
        .catch(() => {
          return null
        })
    },
    handleAvatarProgress(e, file) {},
    checkModel() {},
    batchUpSuccess(res, file) {
      this.isBatchSuccess = true
      this.mulTableData.push({
        name: file.name.split('.')[0],
        image: res.body.data[file.name.split('.')[0]],
        nameList: 1,
        typeOptions: [
          { name: '白名单', _id: 1 },
          { name: '黑名单', _id: 2 },
          { name: '其他', _id: 3 }
        ],
        id: new Date().getTime()
      })
    },
    handleAvatarSuccess(res, file) {
      this.addFaceForm.imageUrl = res.body.data[file.name.split('.')[0]]
    },
    editAvatarSuccess(res, file) {
      this.editForm.image = res.body.data[file.name.split('.')[0]]
    },
    handleAvatarError(res, file) {
      console.log(res, file, '哈哈')
    },
    beforeAvatarUpload(file) {
      this.upSingleData.name = file.name.split('.')[0]
      const isJPG = file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isJPG && !isLt1M) {
        this.$message.error('上传人脸图片只能是 PNG 格式 且大小不能超过1M!')
      } else if (!isJPG) {
        this.$message.error('上传人脸图片只能是 PNG 格式!')
      } else if (!isLt1M) {
        this.$message.error('上传人脸图片大小不能超过 1MB!')
      }

      return isJPG && isLt1M
    },
    beforeMulUpload(file) {
      const isJPG = file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isJPG && !isLt1M) {
        this.$message.error('上传人脸图片只能是 PNG 格式 且大小不能超过1M!')
      } else if (!isJPG) {
        this.$message.error('上传人脸图片只能是 PNG 格式!')
      } else if (!isLt1M) {
        this.$message.error('上传人脸图片大小不能超过 1MB!')
      } else {
        this.mulUpData.name = file.name.split('.')[0]
        this.isBatchSuccess = true
      }
      return isJPG && isLt1M
    },
    bulkimport() {
      this.bulkimportVisble = true
    },
    closebulkimportDialog() {
      this.bulkimportVisble = false
      this.isBatchSuccess = false
      this.mulTableData = []
    },
    getfaceList() {
      this.tableLoading = true
      const query = {
        page: {
          index: this.page,
          size: this.limit
        },
        params: {}
      }
      fetchFaceList(query).then(response => {
        if (response.code !== 0) return
        this.faceList = response.body.data
        this.tableData = response.body.data
        this.total = response.body.page.total
        this.listLoading = false
        this.tableLoading = false
      })
    },
    batchesDel() {
      if (!this.delIDArr.length) {
        this.$message({
          message: '请选择需要删除的数据!',
          type: 'warning'
        })
      } else {
        this.$confirm('此操作将永久删除选中数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = [...this.delIDArr]
          fetchDeleteFace(params)
            .then(response => {
              this.getfaceList()
              this.delIDArr = []
              if (response.code !== 0) {
                return
              }
              this.$notify({
                title: '成功',
                message: '批量删除成功',
                type: 'success',
                duration: 2000
              })
            })
            .catch(() => {
              this.delIDArr = []
            })
        })
      }
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
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    editDialog(v) {
      this.editForm = JSON.parse(JSON.stringify(v))
      this.editVisable = true
    },
    editCloseDialog() {
      this.editVisable = false
    },
    editFaceConfirm() {
      const params = [
        {
          name: this.editForm.name,
          image: this.editForm.image,
          nameList: this.editForm.nameList,
          id: this.editForm.id
        }
      ]
      fetchUpdateFace(params).then(response => {
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
      (this.addFaceForm = {
        name: '',
        imageUrl: '',
        typeValue: '',
        searchkey: ''
      }),
      (this.dialogVisable = false)
      this.clearValidate('addForm')
    },
    clearValidate(formName) {
      this.$refs[formName].clearValidate()
    },
    onSearch() {
      this.page = 1
      const params = {
        page: {
          index: this.page,
          size: this.limit
        },
        params: [
          {
            field: 'name',
            operator: 'LIKE',
            value: `%${this.addFaceForm.searchkey}%`
          }
        ]
      }
      fetchSearchFace(params).then(res => {
        this.faceList = res.body.data
        this.tableData = res.body.data
        this.page = 1
        this.total = res.body.page.total
      })
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
    handleSelectionChange(val) {
      val.forEach(item => {
        if (this.delIDArr.indexOf(item.id) === -1) {
          this.delIDArr.push(item.id)
        }
      })
    },
    checkboxchange(e, val) {
      if (e) {
        this.delIDArr.push(val.id)
      } else {
        const idx = this.delIDArr.indexOf(val.id)
        this.delIDArr.splice(idx, 1)
      }
    },
    addFaceConfirm() {
      this.$refs.addForm.validate(valid => {
        if (!valid) return
        const params = [
          {
            name: this.addFaceForm.name,
            image: this.addFaceForm.imageUrl,
            nameList: this.addFaceForm.typeValue
          }
        ]
        fetchAddFace(params)
          .then(res => {
            this.addFaceForm = {
              name: '',
              imageUrl: ''
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
      this.mulTableData.forEach(item => {
        const { name, image, nameList } = item
        const params = [
          {
            name,
            image,
            nameList
          }
        ]
        fetchAddFace(params).then(res => {
          this.dialogForm = {
            name: '',
            image: '',
            nameList: '',
            id: ''
          }
          this.getfaceList()
          this.bulkimportVisble = false
        })
      })
    },
    // 重置
    resetQuery() {
      this.addFaceForm.searchkey = ''
      this.page = 1
      this.limit = 12
      this.getfaceList()
    },
    gohistory() {
      this.$router.push('/sysmanage/faceManage/faceHistory')
    }
  }
}
</script>

<style lang='scss'>
.img-popper{
    z-index: 100000001 !important;
}
.app-main {
  padding-top: 50px;
}
.faceindexlist {
    overflow: auto !important;
    .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
   .el-checkbox {
      width: 15px;
    }
    .el-button--text {
      color: #fa8334 !important;
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
      width: 150px;
      height: 210px;
      display: block;
    }
    .upload-demo {
      width: 360px;
      margin: 0 auto;
    }
    .el-dialog__body {
      width: 100%;
    }
    .el-popover.el-popover--plain {
      z-index: 9999999999999999999999 !important;
    }
    .face-col {
      width: 15%;
      margin: 10px 2%;
    }
    .face-col:nth-of-type(n+1) {
      margin-left: 0px;
    }
    .face-col:nth-of-type(6n) {
      margin-right: 0px;
    }
    .face-card:hover {
      .face-checkbox {
        display: block;
      }
    }
    .face-card {
      position: relative;
      border-radius: 4px;
      img {
        width: 100%;
      }
      .face-info {
        font-size: 14px;
        height: 30px;
        padding: 0 10px;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        background-color: #fafafa;
      }

      .face-name {
        padding: 7px 0;
        font-size: 12px;
        margin-right: 5px;
      }
      .face-kind {
        font-size: 12px;
      }
      .btn-box {
        width: 30px;
        display: flex;
        justify-content: space-between;
        margin-right: 10px;
        margin-bottom: 5px;
      }
      .image {
        width: 100%;
        // max-width: 250px;
        height: 200px;
        img {
          object-fit: contain; //cover;
        }
      }
      /deep/.el-checkbox {
        display: none;
        position: absolute;
        top: 4px;
        right: 5px;
      }
      /deep/.is-checked {
        display: block;
      }
    }
    .face-nodata {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
    }
    .namespan {
      width:35px;
      overflow:hidden !important;
      white-space:nowrap !important;
      text-overflow:ellipsis !important;
    }
    .el-input__inner {
      height:36px;
      border-radius: 2px;
    }
    .el-row {
      height: 100%;
    }
    .colwrapper {
      width: 100%;
      display: flex;
      flex-wrap:wrap;
    }
}
</style>

