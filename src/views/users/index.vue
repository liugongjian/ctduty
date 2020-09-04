
<template>
  <div>
    <span style="font-family: MicrosoftYaHei;font-size: 22px;color: #333333;margin-left:20px;inline-height:20px">用户管理</span>
    <el-divider></el-divider>
    <el-row>
      <el-button type="warning" @click="addUserDialogVisible=true">+新增用户</el-button>
      <el-input class="searchinput" placeholder="请输入内容" suffix-icon="el-icon-search"></el-input>
    </el-row>

    <el-table :data="userList" :header-cell-style="{background:'#ecedee',color:'#717171'}">
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="手机号码" prop="phone"></el-table-column>
      <el-table-column label="岗位" prop="post"></el-table-column>
      <el-table-column label="区域/部门" prop="department"></el-table-column>
      <el-table-column label="权限" prop="permissions.name"></el-table-column>
      <el-table-column label="备注"></el-table-column>
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
      title="新增用户"
      width="50%"
      @close="addDialogClosed">
      <el-form ref="addFormRef" :model="addUserForm" label-width="100px">
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="addUserForm.username" type="text"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="addUserForm.username" type="text"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addUserForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addUserForm.phone" type="text"></el-input>
        </el-form-item>
        <!-- <el-form-item v-model="addUserForm.region" label="区域/部门">
                    <el-select placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="岗位">
                    <el-select v-model="addUserForm.job" placeholder="请选择岗位">
                    <el-option label="岗位一" value="shanghai"></el-option>
                    <el-option label="岗位二" value="beijing"></el-option>
                    </el-select>
                </el-form-item> -->
        <el-form-item label="权限">
          <el-radio-group v-model="addUserForm.permissionId">
            <el-radio :label="3274944196083712">系统管理员</el-radio>
            <el-radio :label="3274944196083713">管理员</el-radio>
            <el-radio :label="3274944196083714">普通用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="备注">
                    <el-input v-model="addUserForm.des" type="textarea"></el-input>
                </el-form-item> -->
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
      @close="editDialogClosed">
      <el-form ref="editFormRef" :model="editUserForm" label-width="100px">
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="editUserForm.username" type="text"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="editUserForm.username" type="text"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editUserForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editUserForm.phone" type="text"></el-input>
        </el-form-item>
        <!-- <el-form-item v-model="addUserForm.region" label="区域/部门">
                    <el-select placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="岗位">
                    <el-select v-model="addUserForm.job" placeholder="请选择岗位">
                    <el-option label="岗位一" value="shanghai"></el-option>
                    <el-option label="岗位二" value="beijing"></el-option>
                    </el-select>
                </el-form-item> -->
        <el-form-item label="权限">
          <el-radio-group v-model="editUserForm.permissionId">
            <el-radio :label="3274944196083712">系统管理员</el-radio>
            <el-radio :label="3274944196083713">管理员</el-radio>
            <el-radio :label="3274944196083714">普通用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="备注">
                    <el-input v-model="addUserForm.des" type="textarea"></el-input>
                </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="editAUser">确 定</el-button>
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="deleteUserDialogVisible"
      title="删除用户"
      width="50%">
      <span>确认删除用户{{ this.deleteUserName }}？</span>
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
    return {
      addUserDialogVisible: false,
      addUserFormRules: {
        user_name: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ]
      },
      addUserForm: {
        username: '',
        password: '',
        name: '',
        region: '',
        job: '',
        permissionId: '',
        des: '',
        phone: ''
      },
      editUserForm: {
        id: 0,
        username: '',
        password: '',
        name: '',
        region: '',
        job: '',
        permissionId: '',
        des: '',
        phone: ''
      },
      userList: [],
      queryInfo: {
        pagenum: 1,
        pagesize: 10
      },
      totalnum: 0,
      editUserDialogVisible: false,
      deleteUserName: '',
      deleteUserDialogVisible: false,
      deleteUserId: 0
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
      const query = [{
        departmentId: 0,
        postId: 0,
        username: this.addUserForm.username,
        password: this.addUserForm.password,
        permissionId: this.addUserForm.permissionId,
        phone: this.addUserForm.phone
      }]
      // console.log(this.addUserForm.permissionId)
      postAddUser(query).then(response => {
        if (response.code !== 0) return this.$message.error('添加用户失败，请联系系统管理员')
        this.$message.success('添加用户成功')
        this.addUserDialogVisible = false
        this.getUserList()
      })
    },
    addDialogClosed() {
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
          if (response.code !== 0) return this.$message.error('更新用户信息失败,请稍后再试')
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
        if (response.code !== 0) return this.$message.error('删除用户失败,请稍后再试')
        this.deleteUserDialogVisible = false
        this.deleteUserId = 0
        this.deleteUserName = ''
        this.getUserList()
        this.$message.success('删除用户信息')
      })
    }

  }
}

</script>

<style scoped>
.title{
    width:150px;height:100px;
    border:1px solid #000;
    display:-moz-inline-box; /* css注释：for ff2 */
    display:inline-block;
}
.el-pagination{
    float: right;
}
.el-table{
    margin-top: 20px;
}
.searchinput{
    float: right;
    width: 250px;
}
</style>
