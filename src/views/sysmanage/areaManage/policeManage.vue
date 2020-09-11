
<template>
  <div class="userManage">
    <el-divider></el-divider>
    <el-row>
      <el-button class="addbtn" type="warning" @click="addUserDialogVisible=true">+新增派出所</el-button>
      <el-input v-model="queryName" class="searchinput" placeholder="请输入派出所姓名"></el-input>
      <el-button class="searchbtn" type="warning" @click="getUserList">搜索</el-button>
      <el-button class="searchbtn" @click="resetQuery">重置</el-button>
    </el-row>

    <el-table :data="userList" :header-cell-style="{background:'#ecedee',color:'#717171'}">
      <el-table-column label="ID" prop="username"></el-table-column>
      <el-table-column label="派出所名称" prop="name"></el-table-column>
      <el-table-column label="所在经度" prop="phone"></el-table-column>
      <el-table-column label="所在纬度" prop="post.name"></el-table-column>
      <el-table-column label="区域/部门" prop="department.name"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="row_data">
          <el-link type="primary" @click="showEditDialog(row_data.row.id)">编辑</el-link>
          <el-link type="primary" @click="showDeleteDialog(row_data.row.username,row_data.row.id)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 50]"
      :page-size="queryInfo.pagesize"
      :total="totalnum"
      layout="total, prev, pager, next, sizes, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>

    <el-dialog
      :visible.sync="addUserDialogVisible"
      title="新增派出所"
      width="50%"
      @close="addDialogClosed">
      <el-form ref="addFormRef" :model="addUserForm" :rules="addUserFormRules" label-width="100px">
        <el-form-item label="派出所名称" prop="username">
          <el-input v-model="addUserForm.username" type="text"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="addAUser">确 定</el-button>
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="editUserDialogVisible"
      title="编辑派出所"
      width="50%"
      @close="editDialogClosed">
      <el-form ref="editFormRef" :rules="addUserFormRules" :model="editUserForm" label-width="100px">
        <el-form-item label="派出所名称" prop="username">
          <el-input v-model="editUserForm.username" type="text"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="editAUser">确 定</el-button>
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="deleteUserDialogVisible"
      title="删除派出所"
      width="50%">
      <span>确认删除派出所{{ deleteUserName }}？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="deleteAUser">确 定</el-button>
        <el-button @click="deleteUserDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchUserList, postAddUser, getUserInfo, updateUser, deleteUser } from '@/api/users'

export default {
  data() {
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[5-7])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      addUserDialogVisible: false,
      addUserFormRules: {
        username: [
          { required: true, message: '派出所名称不能为空', trigger: 'blur' },
          { min: 5, max: 10, message: '派出所名长度在5-12个字符之间', trigger: 'blur' }
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
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ],
        permissionId: [
          { required: true, message: '权限不能为空', trigger: 'blur' }
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
      totalnum: 0,
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
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      const query = {
        cascade: true,
        page: {
          index: this.pagenum,
          size: this.pagesize
        },
        params: {}
      }
      if (this.queryName.trim() !== '') {
        query.params.name = this.queryName
      }
      fetchUserList(query).then(response => {
        console.log(response)
        if (response.code !== 0) return
        this.userList = response.body.data
        this.totalnum = response.body.total
      })
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
        console.log(query)
        postAddUser(query).then(response => {
          console.log(response)
          if (response.code !== 0) return this.$message.error('添加派出所失败，请联系系统管理员')
          this.$message.success('添加派出所成功')
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
        if (response.code !== 0) return this.$message.error('获取派出所信息失败')
        this.editUserForm = response.body.data
        this.editUserDialogVisible = true
      })
    },
    editAUser() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        updateUser([{ ...this.editUserForm }]).then(response => {
          // console.log(response)
          if (response.code !== 0) return this.$message.error('更新派出所信息失败,请稍后再试')
          this.editUserDialogVisible = false
          this.getUserList()
          this.$message.success('更新派出所信息成功')
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
        if (response.code !== 0) return this.$message.error('删除派出所失败,请稍后再试')
        this.deleteUserDialogVisible = false
        this.deleteUserId = 0
        this.deleteUserName = ''
        this.getUserList()
        this.$message.success('删除派出所信息')
      })
    },

    resetQuery() {
      this.queryName = ''

      this.getUserList()
    }

  }
}

</script>

<style scoped>
.userManage {
  padding: 0px 20px;
}
.title{
    width:150px;height:100px;
    border:1px solid #000;
    display:-moz-inline-box; /* css注释：for ff2 */
    display:inline-block;
}
.el-divider--horizontal {
  margin-top: 0px;
}
.el-pagination{
    float: right;
}
.el-table{
    margin-top: 20px;
}
.searchinput{
    float: left;
    width: 250px;
}
.searchbtn{
  float: left;
  margin-left: 5px;

}
.addbtn{
  float: right;
}
 .el-select-dropdown {
    z-index: 9999999999999999999999999999999999 !important;
  }
</style>
