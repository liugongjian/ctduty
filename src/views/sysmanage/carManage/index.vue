<template>
  <div class="carlist">
    <div class="app-container" style="padding: 20px">
      <div class="filter-container clearfix">
        <div class="pull-left">
          <el-input
            v-model="formInline.searchkey"
            placeholder="请输入车牌号"
            class="filter-item"
            style="width: 260px;"
            @keyup.enter.native="onSearch"
          ></el-input>
          <el-button
            v-waves
            class="filter-item sureItem"
            size="mini"
            type="warning"
            style="margin-bottom: 10px; margin-left: 10px"
            @click="onSearch"
          >{{ '搜索' }}</el-button>
          <el-button class="searchbtn filter-item sureItem" size="mini" @click="resetQuery">重置</el-button>
        </div>

        <div class="pull-right">
          <el-button
            class="filter-item"
            type="warning"
            icon="el-icon-plus"
            @click="create"
          >{{ '新增车牌数据' }}</el-button>
          <el-button class="filter-item" @click="bulkimport">{{ '导入车牌数据' }}</el-button>
          <el-button class="filter-item" @click="toHistory">{{ '历史抓拍' }}</el-button>
          <el-button type="text" size="small" @click="batchesDel">{{ '批量删除' }}</el-button>
        </div>

        <el-dialog
          :visible="bulkimportVisble"
          class="carDialog"
          title="导入车牌数据"
          width="50vw"
          height="80vh"
          @close="closebulkimportDialog"
        >
          <el-table
            v-if="isBatchSuccess"
            :data="imSuccessData"
            :header-cell-class-name="tableRowClassHeader"
            class="amountdetailTable"
            style="width: 55vw"
            tooltip-effect="dark"
            fit
            @filter-change="filerStatus"
            @selection-change="handleSelectionChange"
          >
            <el-table-column :show-overflow-tooltip="true" :label="'车牌'" prop="licenseNo"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" :label="'所属名单'" prop="type"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" :label="'车牌颜色'" prop="color"></el-table-column>
          </el-table>
          <div v-else>
            <el-upload
              :action="importUrl"
              :on-success="batchUpSuccess"
              :headers="importHeader"
              :before-upload="beforeAvatarUpload"
              class="upload-demo"
              name="file"
              multiple
              drag
              list-type="picture"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div slot="tip" class="el-upload__tip" style="width: 400px">支持的格式：仅支持xlsx格式文件</div>
            </el-upload>
            <p
              class="dlTem"
              style="text-align:center;width:100%;height:30px;margin-top:20px;line-height:30px;"
            >
              <a :href="`#`" @click="dlTem">
                <svg-icon style="margin-right:5px;width:30px;" icon-class="dltemplate" />下载模板文件
              </a>
            </p>
          </div>
          <div v-if="isBatchSuccess" slot="footer" class="dialog-footer">
            <el-button type="primary" @click="importConfirm">提 交</el-button>
          </div>
        </el-dialog>
        <!-- 新增车牌数据的显示框 -->
        <el-dialog :visible="dialogVisable" title="新增车牌数据" width="520px" @close="closeDialog">
          <el-form
            ref="addCarForm"
            :rules="addrules"
            :model="addCarForm"
            label-position="right"
            label-width="130px"
          >
            <el-form-item label="车牌号: " class="carInput" prop="province">
              <el-select
                v-model="addCarForm.province"
                placeholder="省市区"
                style="width:90px;margin-right:10px;"
                class="filter-item"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item._id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-form-item prop="carWord" style="display:inline-block">
                <el-input
                  v-model="addCarForm.carWord"
                  style="width:130px;"
                  placeholder="请输入车牌号"
                ></el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item label="所属名单：" prop="carlist">
              <el-select
                v-model="addCarForm.carlist"
                :value="addCarForm.carlist"
                style="width:230px;"
                placeholder="请选择所属名单"
              >
                <el-option
                  v-for="item in subordinateList"
                  :value="item.value"
                  :label="item.label"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="车牌颜色：" prop="color">
              <el-select
                v-model="addCarForm.color"
                :value="addCarForm.color"
                style="width:230px;"
                placeholder="请选择颜色"
              >
                <el-option
                  v-for="item in colorList"
                  :value="item.value"
                  :label="item.label"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addCar()">确 定</el-button>
            <el-button @click="dialogQuxiao">取 消</el-button>
          </div>
        </el-dialog>
      </div>
      <el-table
        v-loading="tableLoading"
        :data="importData"
        :header-cell-class-name="tableRowClassHeader"
        class="amountdetailTable"
        style="width: 100%"
        tooltip-effect="dark"
        fit
        @filter-change="filerStatus"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'车牌'" prop="licenseNo"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'所属名单'" prop="type">
          <template slot-scope="scope">
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'车牌颜色'" prop="color"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'操作'">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="editDialog(scope.row, scope.row.id)"
            >{{ '编辑' }}</el-button>
            <el-button type="text" size="small" @click="delAlert(scope.row.id)">{{ '删除' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible="editVisable" title="编辑" width="520px" @close="editCloseDialog">
        <el-form
          ref="editCarForm"
          :rules="carRules"
          :model="editForm"
          label-position="right"
          label-width="130px"
        >
          <el-form-item label="车牌号：" prop="carNumber" >
            <el-input v-model="editForm.carNumber" style="width:203.8px;"></el-input>
          </el-form-item>
          <el-form-item label="所属名单：">
            <el-select v-model="editForm.carList" :value="editForm.carList" placeholder="请选择所属名单">
              <el-option
                v-for="item in subordinateList"
                :value="item.value"
                :label="item.label"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车牌颜色：">
            <el-select v-model="editForm.carColor" :value="editForm.carColor" placeholder="请选择颜色">
              <el-option
                v-for="item in colorList"
                :value="item.value"
                :label="item.label"
                :key="item.value"
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
import Pagination from '@/components/Pagination'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import { downLoadByUrl } from '@/utils'
import {
  fetchCarList,
  fetchSingleCarData,
  downloadModel,
  addCarData,
  importCarData,
  deleteCarData,
  carEditConfirm,
  searchList,
  dlTemplate,
  checkCarLicense
} from '@/api/dm'
const token = Cookies.get('token')
export default {
  components: { Pagination },
  data() {
    const checkIfCarLicense = (rule, value, callback) => {
      if (!value) {
        callback(new Error('车牌号不能为空'))
      } else {
        const { province } = this.addCarForm
        checkCarLicense(`${province}${value}`).then(res => {
          if (res.body.data) {
            callback(new Error('车牌号已存在'))
          } else {
            callback()
          }
        })
      }
    }

    const checkEditIfCarLicense = (rule, value, callback) => {
      if (!value) {
        callback(new Error('车牌号不能为空'))
      } else {
        console.log("进入编辑调用车牌号码是否存在页面")
        console.log(this.tempEditCarInfo)
        const { licenseNo } = this.tempEditCarInfo
        if (value !== licenseNo) {
          checkCarLicense(value).then(res => {
            if (res.body.data) {
              callback(new Error('车牌号已存在'))
            } else {
              callback()
            }
          })
        }else{
          callback()
        }
      }
    }
    return {
      // path: 'http://host31.880508.xyz:10000/CarLicense/Template',
      importHeader: {
        Authorization: token
      },
      importUrl: process.env.LOT_ROOT + '/CarLicense/Import',
      colorList: [
        {
          value: '黑色',
          label: '黑色'
        },
        {
          value: '白色',
          label: '白色'
        },
        {
          value: '蓝色',
          label: '蓝色'
        },
        {
          value: '绿色',
          label: '绿色'
        }
      ],
      tableLoading: null,
      headers: {
        Authorization: localStorage.getItem('token')
      },
      isBatchSuccess: false,
      subordinateList: [
        {
          value: '白名单',
          label: '白名单'
        },
        {
          value: '黑名单',
          label: '黑名单'
        },
        {
          value: '其他',
          label: '其他'
        }
      ],
      value: '',
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
      typeOptions: [
        { name: '浙', id: '浙' },
        { name: '京', id: '京' },
        { name: '沪', id: '沪' },
        { name: '粤', id: '粤' }
      ],
      imageUrl: '',
      addCarForm: {
        carWord: '',
        province: '',
        carlist: '',
        color: ''
      },
      addrules: {
        province: [
          { required: true, trigger: 'blur', message: '车牌号不能为空' }
        ],
        carWord: [
          // { required: true, trigger: 'blur', message: '车牌号不能为空' }
          { validator: checkIfCarLicense, trigger: 'blur', required: true }
        ],
        carlist: [
          { required: true, trigger: 'blur', message: '所属名单不能为空' }
        ],
        color: [
          { required: true, trigger: 'blur', message: '车牌颜色不能为空' }
        ]
      },
      carRules: {
        carNumber: [
          // { required: true, trigger: 'blur', message: '车牌号不能为空' }
          { validator: checkEditIfCarLicense, trigger: 'blur', required: true }
        ]
      },
      formInline: {
        searchkey: '',
        typeValue: 'list'
      },
      listLoading: false,
      filteredValue: [],
      importData: [],
      imSuccessData: [],
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
        carNumber: '',
        carList: '',
        carColor: ''
      },
      bulkimportVisble: false,
      tempEditCarInfo: {}
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
    await this.getList()
  },
  methods: {
    dlTem() {
      downLoadByUrl(
        '/nvsapi/CarLicense/Template',
        '车牌数据导入模板'
      ).catch(err => {
        this.$message.error(err.message || '下载失败')
      })
      // dlTemplate().then(res => {
      //   this.$message({
      //     message: '模板文件下载成功',
      //     type: 'success'
      //   })
      // })
    },
    editCloseDialog() {
      this.editVisable = false
    },
    // 获取列表数据
    getList() {
      this.tableLoading = true
      const params = {
        page: {
          index: this.page,
          size: this.limit
        },
        params: {},
        sorts: [
          {
            field: 'create_time',
            type: 'desc'
          }
        ]
      }
      fetchCarList(params).then(res => {
        this.importData = res.body.data
        this.total = res.body.page.total
        this.$nextTick(() => {
          var cellArr = document.getElementsByClassName('cell')
          var arr = Array.from(cellArr)
          arr.forEach(item => {
            item.style.lineHeight =
              (document.getElementsByTagName('html')[0].clientHeight - 260) /
                11 +
              'px'
            item.style.paddingTop = '2px'
            item.style.paddingBottom = '2px'
          })
        })
        this.listLoading = false
        this.tableLoading = false
      })
    },
    importConfirm() {
      const lastSuccessIndex = this.imSuccessData.length - 1
      this.imSuccessData.forEach((item, index) => {
        const { color, licenseNo, type } = item
        const params = [
          {
            color,
            licenseNo,
            type
          }
        ]
        addCarData(params).then(res => {
          if (lastSuccessIndex === index) {
            this.$message({
              type: 'success',
              message: '上传成功!'
            })
          }
          this.getList()
          this.bulkimportVisble = false
        })
      })
    },
    batchUpSuccess(res) {
      this.imSuccessData = res.body.data
      this.isBatchSuccess = true
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      console.log(file.type, file, 'file.typefile.type')
      const isxlsx =
        file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isxlsx) {
        this.$message.error('导入数据只能是 xlsx 格式!')
      }
      return isxlsx
    },
    beforeExcelUpload(file) {},
    excelCommit() {},
    bulkimport() {
      this.bulkimportVisble = true
    },
    toHistory() {
      const {
        currentRoute: { path }
      } = this.$router
      this.$router.push(`${path}/carHistory`)
    },
    closebulkimportDialog() {
      this.bulkimportVisble = false
      this.isBatchSuccess = false
      this.imSuccessData = []
    },
    batchesDel() {
      if (!this.delIDArr.length) {
        this.$message({
          message: '请选择需要删除的车牌!',
          type: 'warning'
        })
      } else {
        this.$confirm('此操作将永久删除选中数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = [...this.delIDArr]
          deleteCarData(params)
            .then(response => {
              this.getList()
              this.delIDArr = []
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
        deleteCarData(params).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
          this.delIDArr = []
        })
      })
    },
    formatTime: function(row, column, cellValue) {
      return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
    },
    editDialog(v, w) {
      this.editForm.id = w
      this.editForm.carNumber = v.licenseNo
      this.editForm.carList = v.type
      this.editForm.carColor = v.color
      this.tempEditCarInfo = v // 存储当前编辑的车牌信息，用来比对
      this.editVisable = true
    },
    editDialogConfirm() {
      console.log("点击编辑确定")
      this.$refs.editCarForm.validate(valid => {

        console.log("valid",valid)

        if (!valid) return
        const params = [
          {
            id: this.editForm.id,
            licenseNo: this.editForm.carNumber,
            type: this.editForm.carList,
            color: this.editForm.carColor
            // carNumber: this.editForm.carNumber,
            // carList: this.editForm.carList,
            // carColor: this.editForm.carColor
          }
        ]
        carEditConfirm(params).then(response => {
          this.$notify({
            title: '成功',
            message: '编辑成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
          this.editVisable = false
        })
      })
    },
    submit() {},
    editDialogQuxiao() {
      this.editVisable = false
    },
    create() {
      this.dialogVisable = true
    },
    closeDialog() {
      this.addCarForm = {
        carWord: '',
        province: '',
        carlist: '',
        color: ''
      }
      this.dialogVisable = false
      this.clearValidate('addCarForm')
    },
    clearValidate(formName) {
      this.$refs[formName].clearValidate()
    },
    onSearch() {
      const query = this.formInline.searchkey
        ? {
          page: {
            index: this.page,
            size: this.limit
          },
          params: [
            {
              field: 'license_no',
              operator: 'LIKE',
              value: `%${this.formInline.searchkey}%`
            }
          ],
          sorts: [
            {
              field: 'create_time',
              type: 'desc'
            }
          ]
        }
        : {
          page: {
            index: this.page,
            size: this.limit
          },
          params: [],
          sorts: [
            {
              field: 'create_time',
              type: 'desc'
            }
          ]
        }
      searchList(query).then(response => {
        // if (response.data !== 0) return;
        // this.getList();
        this.importData = response.body.data
        this.total = response.body.page.total
        this.page = 1
        // this.formInline.searchkey = ''
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
    addCar() {
      this.$refs.addCarForm.validate(valid => {
        if (!valid) return
        const params = [
          {
            licenseNo: this.addCarForm.province + this.addCarForm.carWord,
            type: this.addCarForm.carlist,
            color: this.addCarForm.color
          }
        ]
        addCarData(params)
          .then(res => {
            if (res.code == 100025) {
              return this.$message.error('车牌号已存在,请勿重复添加')
            }
            if (res.code !== 0) {
              return this.$message.error('添加车牌号失败，请联系系统管理员')
            }
            this.getList()
            this.dialogVisable = false
            this.$notify({
              title: '成功',
              type: 'success',
              message: '添加成功!'
            })
            this.addCarForm = {
              carWord: '',
              province: '',
              carlist: '',
              color: ''
            }
          })
          .catch(err => {})
      })
    },
    // 重置
    resetQuery() {
      this.formInline.searchkey = ''
      this.page = 1
      this.limit = 10
      this.getList()
    }
  }
}
</script>

<style lang='scss'>
.app-main {
  padding-top: 50px;
}

.carlist {
  overflow: auto !important;
  .el-input__inner {
    height: 38px;
  }
  .el-button--text {
    color: #fa8334 !important;
  }
  .dlTem:hover {
    a {
      color: #409eff;
    }
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
  .carDialog {
    margin: 0 auto;
  }
  .carInput {
    height: 36.8px !important;
  }
  .upload-demo {
    width: 360px;
    margin: 0 auto;
  }
  td,
  th {
    padding: 0px;
  }
}
.sureItem {
  height: 36px;
}
.el-form-item__content>.el-select{
  margin-bottom: 0px !important;
}
</style>

