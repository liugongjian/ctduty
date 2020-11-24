<template>
  <div class="userManage">
    <div class="pull-left" style="margin:20px 0;">
      <el-button class="addbtn" type="warning" @click="addPoliceDialogVisible=true">+新增派出所</el-button>
    </div>

    <el-table
      :data="userList"
      :header-cell-style="{background:'#ecedee',color:'#717171'}"
      @filter-change="filerStatus"
    >
      <el-table-column
        :filter-multiple="false"
        :v-model="filterName"
        :filters="allPoliceArr"
        label="县 (市、区) 公安局"
        filter-placement="bottom"
        prop="name"
      >
        <template slot-scope="scope" class="name">
          <span>{{ scope.row.name }}</span>
          <!--  <div v-if="scope.row.status === 1" class="nomalStatus">正常</div>
          <div v-else-if="scope.row.status === 0" class="stopStatus">已暂停</div>
          <div v-else-if="scope.row.status === -2" class="closeStatus">已关闭</div>-->
        </template>
      </el-table-column>
      <el-table-column label="派出所名称" prop="address"></el-table-column>
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
    return {
      page: 1,
      limit: 10,
      oldSize: 10,
      allPoliceArr: [],
      filterName: '',
      addPoliceDialogVisible: false,
      addPoliceFormRules: {
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
      })
    },
    addAPolice() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        const query = [{ ...this.addPoliceForm }]
        addPolice(query).then(response => {
          if (response.code !== 0) { return this.$message.error('添加派出所失败，请联系系统管理员') }
          this.$message.success('添加派出所成功')
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
          if (response.code !== 0) { return this.$message.error('更新派出所信息失败,请稍后再试') }
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
        if (response.code !== 0) { return this.$message.error('删除派出所失败,请稍后再试') }
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

<style scoped>
.userManage {
  padding: 0px 20px;
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
td {
  padding: 5px !important;
}
</style>
