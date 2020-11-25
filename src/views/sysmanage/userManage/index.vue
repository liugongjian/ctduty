<template>
  <div class="userManage">
    <!-- <el-divider></el-divider> -->
    <div class="container">
      <div class="clearfix">
        <div class="pull-left">
          <el-input v-model="queryName" class="searchinput" placeholder="请输入用户姓名"></el-input>
          <el-button
            v-waves
            class="filter-item searchbtn"
            size="mini"
            style="height: 36px"
            type="warning"
            @click="getUserList"
          >{{ '搜索' }}</el-button>
          <el-button
            class="filter-item searchbtn"
            style="font-size:12px; height: 36px"
            size="mini"
            @click="resetQuery"
          >重置</el-button>
        </div>
        <div class="pull-right">
          <el-button class="addbtn" type="warning" @click="addUserDialogVisible = true">+新增用户</el-button>
        </div>
      </div>
    </div>

    <el-table
      v-loading="tableLoading"
      :data="userList"
      :header-cell-style="{ background: '#ecedee', color: '#717171' }"
    >
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="手机号码" prop="phone"></el-table-column>
      <el-table-column label="岗位" prop="post.name"></el-table-column>
      <el-table-column label="区域/部门" prop="department.name"></el-table-column>
      <el-table-column label="权限" prop="permissions.name"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="row_data">
          <el-button type="text" size="small" @click="showEditDialog(row_data.row.id)">{{ "编辑" }}</el-button>
          <el-button
            type="text"
            size="small"
            @click="showDeleteDialog(row_data.row.username, row_data.row.id)"
          >{{ "删除" }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="page"
      :limit.sync="limit"
      @pagination="pageChange()"
    />

    <el-dialog
      :visible.sync="addUserDialogVisible"
      title="新增用户"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form ref="addFormRef" :model="addUserForm" :rules="addUserFormRules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" type="text"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="username">
          <el-input v-model="addUserForm.name" type="text"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addUserForm.phone" type="text"></el-input>
        </el-form-item>
        <el-form-item label="区域/部门" prop="departmentId">
          <el-select v-model="addUserForm.departmentId" placeholder="请选择区域/部门">
            <el-option
              v-for="item in departmentInfo"
              :value="item.departmentId"
              :label="item.department"
              :key="item.departmentId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="postId">
          <el-select v-model="addUserForm.postId" placeholder="请选择岗位">
            <el-option
              v-for="item in postInfo"
              :value="item.postId"
              :label="item.post"
              :key="item.postId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限" prop="permissionId">
          <el-radio-group v-model="addUserForm.permissionId">
            <el-radio :label="3274944196083712">系统管理员</el-radio>
            <el-radio :label="3274944196083713">管理员</el-radio>
            <el-radio :label="3274944196083714">普通用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="备注">
                    <el-input v-model="addUserForm.des" type="textarea"></el-input>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="addAUser">确 定</el-button>
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="editUserDialogVisible"
      title="修改用户"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :rules="addUserFormRules"
        :model="editUserForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" type="text"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="username">
          <el-input v-model="editUserForm.name" type="text"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editUserForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editUserForm.phone" type="text"></el-input>
        </el-form-item>
        <el-form-item label="区域/部门" prop="departmentId">
          <!-- <el-select v-model="editUserForm.departmentId" :value="()=>{departmentInfo.find(item => item.departmentId == editUserForm.departmentId)}" placeholder="请选择区域/部门"> -->
          <el-select
            v-model="editUserForm.departmentId"
            :value="editUserForm.departmentId"
            placeholder="请选择区域/部门"
          >
            <el-option
              v-for="item in this.departmentInfo"
              :value="item.departmentId"
              :label="item.department"
              :key="item.departmentId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="postId">
          <el-select v-model="editUserForm.postId" :value="editUserForm.postId" placeholder="请选择岗位">
            <el-option
              v-for="item in this.postInfo"
              :value="item.postId"
              :label="item.post"
              :key="item.postId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限" prop="permissionId">
          <el-radio-group v-model="editUserForm.permissionId">
            <el-radio :label="3274944196083712">系统管理员</el-radio>
            <el-radio :label="3274944196083713">管理员</el-radio>
            <el-radio :label="3274944196083714">普通用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="备注">
                    <el-input v-model="addUserForm.des" type="textarea"></el-input>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="editAUser">确 定</el-button>
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="deleteUserDialogVisible" title="删除用户" width="50%">
      <span>确认删除用户{{ this.deleteUserName }}？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="deleteAUser">确 定</el-button>
        <el-button @click="deleteUserDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  fetchUserList,
  postAddUser,
  getUserInfo,
  updateUser,
  deleteUser
} from '@/api/users'

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
      tableLoading: null,
      page: 1,
      limit: 10,
      oldSize: 10,
      addUserDialogVisible: false,
      addUserFormRules: {
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' },
          {
            min: 5,
            max: 10,
            message: '用户名长度在5-12个字符之间',
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
        phone: [
          {
            required: true,
            message: '手机号不能为空',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '长度为11个字符',
            trigger: 'blur'
          } /* ,
          {
            validator: checkMobile,
            trigger: 'blur'
          } */
        ],
        permissionId: [
          { required: true, message: '权限不能为空', trigger: 'blur' }
        ],
        departmentId: [
          { required: true, message: '区域/部门不能为空', trigger: 'blur' }
        ],
        postId: [
          { required: true, message: '岗位不能为空', trigger: 'blur' }
        ]
      },
      addUserForm: {
        username: '',
        name: '',
        password: '',
        permissionId: '',
        departmentId: null,
        postId: null,
        phone: ''
      },
      editUserForm: {
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
      editUserDialogVisible: false,
      deleteUserName: '',
      deleteUserDialogVisible: false,
      deleteUserId: 0,
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
      ],

      postInfo: [
        {
          postId: 3275699862609920,
          post: '所长'
        },
        {
          postId: 3275699862609921,
          post: '副所长'
        },
        {
          postId: 3275699862609922,
          post: '民警'
        },
        {
          postId: 3275699862609923,
          post: '普通员工'
        },
        {
          postId: 3275699862611968,
          post: '管控中心'
        },
        {
          postId: 3275699862611969,
          post: '监控中心'
        }
      ]
    }
  },
  watch: {
    limit() {
      this.page = 1
      this.pageChange()
    }
  },
  // watch: {
  //   limit() {
  //     this.page = 1;
  //     this.pageChange();
  //   }
  // },
  created() {
    this.getUserList()
  },
  methods: {
    // pageChange() {
    //   if (this.oldSize !== this.limit) {
    //     this.page = 1
    //   }
    //   this.oldSize = this.limit
    //   this.getgetPoliceList()
    // },
    getUserList() {
      this.tableLoading = true
      const query = {
        cascade: true,
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
      if (this.queryName.trim() !== '') {
        query.params.name = this.queryName
      }
      fetchUserList(query).then(response => {
        if (response.code !== 0) return
        this.userList = response.body.data
        this.total = response.body.page.total
      })
    },
    pageChange() {
      if (this.oldSize !== this.limit) {
        this.page = 1
      }
      this.oldSize = this.limit
      this.getUserList()
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    addAUser() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        const query = [{ ...this.addUserForm }]
        postAddUser(query).then(response => {
          if (response.code !== 0) {
            return this.$message.error('添加用户失败，请联系系统管理员')
          }
          this.$message.success('添加用户成功')
          this.addUserDialogVisible = false
          this.getUserList()
        })
      })
    },
    addDialogClosed() {
      this.addUserForm = {}
      this.$refs.addFormRef.resetFields()
    },
    showEditDialog(id) {
      const { data: res } = getUserInfo(id).then(response => {
        // console.log(response)
        if (response.code !== 0) return this.$message.error('获取用户信息失败')
        this.editUserForm = response.body.data
        this.editUserDialogVisible = true
      })
    },
    editAUser() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        updateUser([{ ...this.editUserForm }]).then(response => {
          // console.log(response)
          if (response.code !== 0) {
            return this.$message.error('更新用户信息失败,请稍后再试')
          }
          this.editUserDialogVisible = false
          this.getUserList()
          this.$message.success('更新用户信息成功')
        })
      })
    },
    editDialogClosed() {
      this.editUserForm = {}
    },
    showDeleteDialog(username, id) {
      this.deleteUserDialogVisible = true
      this.deleteUserName = username
      this.deleteUserId = id
    },

    deleteAUser() {
      const ids = []
      ids.push(this.deleteUserId)
      deleteUser(ids).then(response => {
        if (response.code !== 0) {
          return this.$message.error('删除用户失败,请稍后再试')
        }
        this.deleteUserDialogVisible = false
        this.deleteUserId = 0
        this.deleteUserName = ''
        this.getUserList()
        this.$message.success('删除用户信息')
      })
    },

    resetQuery() {
      this.queryName = ''
      this.getUserList()
    }
  }
}
</script>

<style lang='scss' scoped>
.userManage {
  padding: 20px;
  .el-button--text {
    color: #fa8334 !important;
  }
  .el-input__inner {
    height: 38px;
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
  label {
    display: inline-block;
    width: 100px !important;
    text-align: left !important;
  }
}
</style>

