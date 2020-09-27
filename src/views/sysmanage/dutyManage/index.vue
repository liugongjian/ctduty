<template>
  <div class="dutyManage">
    <!-- <el-divider></el-divider> -->
    <div class="app-container" style="padding: 20px">
      <div class="filter-container clearfix">
        <div class="pull-left">
          <el-button class="filter-item" type="primary" @click="bulkimport">{{ '导入值班表' }}</el-button>
          <el-dialog
            :visible="bulkimportVisble"
            class="carDialog"
            title="导入值班表"
            width="50vw"
            height="80vh"
            @close="closebulkimportDialog"
          >
            <el-table
              v-if="isUpSuccess"
              :data="upSuccessData"
              :header-cell-class-name="tableRowClassHeader"
              class="amountdetailTable"
              style="width: 100%"
              tooltip-effect="dark"
              fit
            >
              <el-table-column :show-overflow-tooltip="true" :label="'值班日期'" prop="scheduleDate">
                <template slot-scope="scope">
                  <span>{{ renderTime(scope.row.scheduleDate) }}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'值班时间'" prop="type">
                <template slot-scope="scope">
                  <span>{{ scope.row.startTime }} - {{ scope.row.endTime }}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'值班领导'" prop="leader"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'值班民警'" prop="police"></el-table-column>
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
                <a :href="`${path}`" :download="`${path}`" @click="dlTem"><svg-icon style="margin-right:5px;width:30px;" icon-class="dltemplate" /> 下载模板文件</a>
              </p>
            </div>
            <div v-if="isUpSuccess" slot="footer" class="dialog-footer">
              <el-button type="primary" @click="importConfirm">提 交</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
      <el-table
        :data="importData"
        :header-cell-class-name="tableRowClassHeader"
        class="amountdetailTable"
        style="width: 100%"
        tooltip-effect="dark"
        fit
      >
        <el-table-column :show-overflow-tooltip="true" :label="'值班日期'" prop="scheduleDate">
          <template slot-scope="scope">
            <span>{{ renderTime(scope.row.scheduleDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'值班时间'" prop="type">
          <template slot-scope="scope">
            <span>{{ scope.row.startTime }} - {{ scope.row.endTime }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'值班领导'" prop="leader"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'值班民警'" prop="police"></el-table-column>
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
import { renderTime } from '@/utils'
import Pagination from '@/components/Pagination'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import {
  fetchCarList,
  addCarData,
  fetchDutyTemplate,
  dutyImportList,
  fetchDutyList,
  addDuty
} from '@/api/dm'
const token = Cookies.get('token')
export default {
  components: { Pagination },
  data() {
    return {
      renderTime,
      path: 'http://host31.880508.xyz:10000/Schedule/Template',
      importHeader: {
        Authorization: token
      },
      importUrl: process.env.LOT_ROOT + '/Schedule/Import',
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
          value: '嫌疑车辆黑名单',
          label: '嫌疑车辆黑名单'
        },
        {
          value: '疑似套牌车辆',
          label: '疑似套牌车辆'
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
      dialogForm: {
        creatorId: '',
        name: '',
        manufacturer: '',
        model: '',
        phone: ''
      },
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
      addFaceForm: {},
      addrules: {
        creatorId: [
          { required: true, trigger: 'blur', message: '创建人ID不能为空' }
        ],

        phone: [{ required: true, trigger: 'blur', message: '手机号不能为空' }],
        manufacturer: [
          { required: true, trigger: 'blur', message: '制造厂商不能为空' }
        ],
        id: [{ required: true, trigger: 'blur', message: '摄像头ID不能为空' }],
        inChargeId: [
          { required: true, trigger: 'blur', message: '负责人ID不能为空' }
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
      value: '',
      isUpSuccess: false
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
      fetchDutyTemplate().then(res => {
        this.$message({
          message: '模板文件下载成功',
          type: 'success'
        })
      })
    },
    // 获取列表数据
    getList() {
      const params = {
        page: {
          index: this.page,
          size: this.limit
        },
        params: {}
      }
      fetchDutyList(params).then(res => {
        this.importData = res.body.data
        this.total = res.body.page.total
        this.listLoading = false
      })
    },
    importConfirm() {
      this.upSuccessData.forEach(item => {
        const { police, leader, startTime, endTime, scheduleDate } = item
        const params = [
          {
            police,
            leader,
            startTime,
            endTime,
            scheduleDate
          }
        ]
        addDuty(params).then(res => {
          this.getList()
          this.bulkimportVisble = false
        })
      })
    },
    batchUpSuccess(res) {
      this.upSuccessData = res.body.data
      this.isUpSuccess = true
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
    closebulkimportDialog() {
      this.bulkimportVisble = false
      this.isUpSuccess = false
      this.upSuccessData = []
    },

    formatTime: function(row, column, cellValue) {
      return moment(cellValue).format('YYYY-MM-DD HH:mm:SS')
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
            this.getList()
            this.dialogVisable = false
            this.$message({
              message: '添加成功',
              type: 'success'
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
    }
  }
}
</script>

<style scoped>
.dutyManage {
  padding: 0px 20px;
}
.el-dialog__body {
  margin: 0 auto;
}
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
.carDialog {
  margin: 0 auto;
}
.el-dialog__body {
  width: 100%;
}
.carInput {
  height: 36.8px !important;
}
.el-form-item__content {
  display: flex;
  /*   .el-select--medium {
    width: 134px !important;
    margin-left: 10px;
    margin-right: 10px;
  } */

  .xuanze {
    width: 20vw !important;
  }
}
.upload-demo {
  width: 360px;
  margin: 0 auto;
}
</style>
