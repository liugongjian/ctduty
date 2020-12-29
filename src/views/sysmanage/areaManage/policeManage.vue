<template>
  <div class="policemanage">
    <div class="pull-left" style="margin:20px 0;">
      <el-button class="addbtn" type="warning" @click="addPoliceDialogVisible=true">+新增派出所</el-button>
    </div>

    <el-table
      v-loading="tableLoading"
      :data="userList"
      :header-cell-style="{background:'#ecedee',color:'#717171'}"
      row-class-name="police-talbe-row"
      @filter-change="filerStatus"
    >
      <el-table-column
        :filter-multiple="false"
        :v-model="filterName"
        :filters="allPoliceArr"
        label="县 (市、区) 公安局"
        filter-placement="right-end"
        prop="name"
      >
        <template slot-scope="scope" class="name">
          <el-tooltip :content="scope.row.name" class="item" effect="dark" placement="top-start">
<<<<<<< HEAD
            <span>{{ ellipsis(scope.row.name) }}</span>
=======
            <div>{{ ellipsis(scope.row.name) }}</div>
>>>>>>> 67909134044e23bc2809182ad3d09715606ad748
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="派出所名称" prop="address">
        <template slot-scope="scope" class="name">
          <el-tooltip :content="scope.row.address" class="item" effect="dark" placement="top-start">
<<<<<<< HEAD
            <span>{{ ellipsis(scope.row.address) }}</span>
=======
            <div>{{ ellipsis(scope.row.address) }}</div>
>>>>>>> 67909134044e23bc2809182ad3d09715606ad748
          </el-tooltip>
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
    <el-dialog
      :visible.sync="addPoliceDialogVisible"
      title="新增派出所"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        ref="addFormRef"
        :model="addPoliceForm"
        :rules="addPoliceFormRules"
        label-width="100px"
      >
        <el-form-item label="公安局名称" prop="name">
          <el-input v-model="addPoliceForm.name" type="text"></el-input>
        </el-form-item>
        <el-form-item label="派出所名称" prop="address">
          <el-input v-model="addPoliceForm.address" type="text"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="addAPolice">确 定</el-button>
        <el-button @click="addPoliceDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog
      :visible.sync="editPoliceDialogVisible"
      title="编辑派出所"
      width="50%"
      @close="editDialogClosed">
      <el-form ref="editFormRef" :rules="addPoliceFormRules" :model="editPoliceForm" label-width="100px">
        <el-form-item label="派出所名称" prop="name">
          <el-input v-model="editPoliceForm.name" type="text"></el-input>
        </el-form-item>
        <el-form-item label="所在经度" prop="longitude">
          <el-input v-model="editPoliceForm.longitude" type="text"></el-input>
        </el-form-item>
        <el-form-item label="所在纬度" prop="latitude">
          <el-input v-model="editPoliceForm.latitude" type="text"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="editPoliceForm.address" type="text"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="editAPolice">确 定</el-button>
        <el-button @click="editPoliceDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="deletePoliceDialogVisible"
      title="删除派出所"
      width="50%">
      <span>确认删除派出所{{ deletePoliceName }}？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="deleteAPolice">确 定</el-button>
        <el-button @click="deletePoliceDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>

<script>
import {
  getPoliceList,
  addPolice,
  updatePolice,
  deletePolice,
  filterPoliceList,
  getAllPolice
} from '@/api/areaManage'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[5-7])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    var checkNotEmpty = (rule, value, cb) => {
      if (value.trim() === '') {
        cb(new Error('该项不能为空'))
      } else {
        cb()
      }
    }
    return {
      tableLoading: null,
      page: 1,
      limit: 10,
      oldSize: 10,
      allPoliceArr: [],
      filterName: '',
      addPoliceDialogVisible: false,
      addPoliceFormRules: {
        name: [
          { required: true, message: '公安局名称不能为空', trigger: 'blur' },
          { validator: checkNotEmpty, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '派出所名称不能为空', trigger: 'blur' },
          { validator: checkNotEmpty, trigger: 'blur' }
        ],
        username: [
          { required: true, message: '派出所名称不能为空', trigger: 'blur' },
          {
            min: 5,
            max: 10,
            message: '派出所名长度在5-12个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            min: 8,
            max: 20,
            message: '密码长度在8-20个字符之间',
            trigger: 'blur'
          }
        ],
        permissionId: [
          { required: true, message: '权限不能为空', trigger: 'blur' }
        ]
      },
      addPoliceForm: {
        username: '',
        name: '',
        password: '',
        permissionId: '',
        departmentId: null,
        postId: null,
        phone: ''
      },
      editPoliceForm: {
        id: 0,
        username: '',
        name: '',
        password: '',
        permissionId: '',
        departmentId: null,
        postId: null,
        phone: ''
      },
      userList: [],
      queryInfo: {
        pagenum: 1,
        pagesize: 10
      },
      queryName: '',
      total: 0,
      editPoliceDialogVisible: false,
      deletePoliceName: '',
      deletePoliceDialogVisible: false,
      deletePoliceId: 0,
      oldFilterName: '',
      departmentInfo: [
        {
          departmentId: 3275699862611970,
          department: '华阴公安局'
        },
        {
          departmentId: 3275699862611971,
          department: '孟塬派出所'
        },
        {
          departmentId: 3275699862611972,
          department: '华山镇派出所'
        }
      ]
    }
  },
  watch: {
    limit() {
      this.page = 1
      this.pageChange()
    },
    filterName(v) {
      this.oldFilterName = v
    }
  },
  created() {
    this.getPoliceList()
    this.getAllPolice()
  },
  methods: {

    ellipsis(value) {
      if (!value) return ''
      if (value.length > 10) {
        return value.slice(0, 10) + '...'
      }
      return value
    },
    getAllPolice() {
      getAllPolice().then(res => {
        res.body.data.map(item => {
          this.allPoliceArr.push({
            text: item,
            value: item
          })
        })
      })
    },
    filerStatus(columnObj) {
      this.page = 1
      for (const key in columnObj) {
        if (!columnObj[key][0]) {
          this.filterName = ''
          this.getPoliceList()
          return
        }
        this.filterName = columnObj[key][0]
      }
      const query = {
        cascade: true,
        page: {
          index: this.page,
          size: this.limit
        },
        params: [
          {
            field: 'name',
            operator: 'EQUALS',
            value: this.filterName
          }
        ]
      }
      filterPoliceList(query).then(response => {
        if (response.code !== 0) return
        this.userList = response.body.data
        this.total = response.body.page.total
<<<<<<< HEAD
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
=======
        // setTimeout(() => {
        //   var cellArr = document.getElementsByClassName('cell')
        //   var arr = Array.from(cellArr)
        //   arr.forEach(item => {
        //     item.style.lineHeight =
        //       (document.getElementsByTagName('html')[0].clientHeight - 260) /
        //         11 +
        //       'px'
        //     item.style.paddingTop = '2px'
        //     item.style.paddingBottom = '2px'
        //   })
        // }, 100)
>>>>>>> 67909134044e23bc2809182ad3d09715606ad748
        this.queryName = ''
      })
    },
    pageChange() {
      if (this.oldSize !== this.limit) {
        this.page = 1
      }
      if (this.filterName !== this.oldFilterName) {
        this.page = 1
      }
      this.oldSize = this.limit
      if (this.filterName) {
        const query = {
          cascade: true,
          page: {
            index: this.page,
            size: this.limit
          },
          params: [
            {
              field: 'name',
              operator: 'EQUALS',
              value: this.filterName
            }
          ]
        }
        if (this.queryName.trim() !== '') {
          query.params.name = this.queryName
        }
        filterPoliceList(query).then(response => {
          if (response.code !== 0) return
          this.userList = response.body.data
          this.total = response.body.page.total
          this.queryName = ''
        })
      } else {
        this.getPoliceList()
      }
    },
    getPoliceList() {
      this.tableLoading = true
      const query = {
        cascade: true,
        page: {
          index: this.page,
          size: this.limit
        },
        params: {}
      }
      if (this.queryName.trim() !== '') {
        query.params.name = this.queryName
      }
      getPoliceList(query).then(response => {
        if (response.code !== 0) return
        this.userList = response.body.data
        this.total = response.body.page.total
        // setTimeout(() => {
        //   var cellArr = document.getElementsByClassName('cell')
        //   var arr = Array.from(cellArr)
        //   arr.forEach(item => {
        //     item.style.lineHeight =
        //       (document.getElementsByTagName('html')[0].clientHeight - 260) /
        //         11 +
        //       'px'
        //     item.style.paddingTop = '2px'
        //     item.style.paddingBottom = '2px'
        //   })
        // }, 100)
        this.tableLoading = false
      })
    },
    addAPolice() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        const query = [{ ...this.addPoliceForm }]
        addPolice(query).then(response => {
          if (response.code !== 0) {
            return this.$message.error('添加派出所失败，请联系系统管理员')
          }
          // this.$message.success('添加派出所成功')
          this.$notify({
            title: '成功',
            type: 'success',
            message: '添加派出所成功!'
          })
          this.addPoliceDialogVisible = false
          this.getPoliceList()
        })
      })
    },
    addDialogClosed() {
      this.addPoliceForm = {}
      this.$refs.addFormRef.resetFields()
    },
    showEditDialog(item) {
      this.editPoliceForm = item
      this.editPoliceDialogVisible = true
    },
    editAPolice() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        updatePolice([{ ...this.editPoliceForm }]).then(response => {
          if (response.code !== 0) {
            return this.$message.error('更新派出所信息失败,请稍后再试')
          }
          this.editPoliceDialogVisible = false
          this.$message.success('更新派出所信息成功')
          this.getPoliceList()
        })
      })
    },
    editDialogClosed() {
      this.editPoliceForm = {}
    },
    deleatePolice(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = [id]
        deletePolice(params)
          .then(response => {
            this.getPoliceList()
            this.delIDArr = []
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
          .catch(() => {
            this.$message({
              type: 'warning',
              message: '删除失败'
            })
          })
      })
    },

    deleteAPolice() {
      const ids = []
      ids.push(this.deletePoliceId)
      deletePolice(ids).then(response => {
        if (response.code !== 0) {
          return this.$message.error('删除派出所失败,请稍后再试')
        }
        this.deletePoliceDialogVisible = false
        this.deletePoliceId = 0
        this.deletePoliceName = ''
        this.getPoliceList()
        this.$message.success('删除派出所信息')
      })
    },

    resetQuery() {
      this.queryName = ''

      this.getPoliceList()
    }
  }
}
</script>

<style lang='scss'>

.policemanage {
  padding: 0px 20px 20px 20px;

.police-talbe-row{
  height: calc((100vh - 240px) / 10);
  min-height: 30px;
}
  .title {
    width: 150px;
    height: 100px;
    border: 1px solid #000;
    display: -moz-inline-box; /* css注释：for ff2 */
    display: inline-block;
  }
  .el-divider--horizontal {
    margin-top: 0px;
  }
  .el-pagination {
    float: right;
  }
  .el-table {
    margin-top: 20px;
  }
  .searchinput {
    float: left;
    width: 250px;
  }
  .searchbtn {
    float: left;
    margin-left: 5px;
  }
  .addbtn {
    float: right;
  }
  td,
  th {
    padding: 0px;
  }
}
</style>
