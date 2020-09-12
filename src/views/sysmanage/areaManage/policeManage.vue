<template>
  <div class="userManage">
    <el-divider></el-divider>
    <el-row>
      <el-button class="addbtn" type="warning" @click="addPoliceDialogVisible=true">+新增派出所</el-button>
      <el-input v-model="queryName" class="searchinput" placeholder="请输入派出所姓名"></el-input>
      <el-button class="searchbtn" type="warning" @click="getPoliceList">搜索</el-button>
      <el-button class="searchbtn" @click="resetQuery">重置</el-button>
    </el-row>

    <el-table :data="userList" :header-cell-style="{background:'#ecedee',color:'#717171'}">
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="派出所名称" prop="name"></el-table-column>
      <el-table-column label="所在经度" prop="longitude"></el-table-column>
      <el-table-column label="所在纬度" prop="latitude"></el-table-column>
      <el-table-column label="地址" prop="address"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="row_data">
          <el-link type="primary" @click="showEditDialog(row_data.row)">编辑</el-link>
          <el-link type="primary" @click="deleatePolice(row_data.row.id)">删除</el-link>
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
      :visible.sync="addPoliceDialogVisible"
      title="新增派出所"
      width="50%"
      @close="addDialogClosed">
      <el-form ref="addFormRef" :model="addPoliceForm" :rules="addPoliceFormRules" label-width="100px">
        <el-form-item label="派出所名称" prop="name">
          <el-input v-model="addPoliceForm.name" type="text"></el-input>
        </el-form-item>
        <el-form-item label="所在经度" prop="longitude">
          <el-input v-model="addPoliceForm.longitude" type="text"></el-input>
        </el-form-item>
        <el-form-item label="所在纬度" prop="latitude">
          <el-input v-model="addPoliceForm.latitude" type="text"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addPoliceForm.address" type="text"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="addAPolice">确 定</el-button>
        <el-button @click="addPoliceDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
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
    </el-dialog>
  </div>
</template>

<script>
import { getPoliceList, addPolice, updatePolice, deletePolice } from '@/api/areaManage'

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
      addPoliceDialogVisible: false,
      addPoliceFormRules: {
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
      totalnum: 0,
      editPoliceDialogVisible: false,
      deletePoliceName: '',
      deletePoliceDialogVisible: false,
      deletePoliceId: 0,
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
  created() {
    this.getPoliceList()
  },
  methods: {
    getPoliceList() {
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
      getPoliceList(query).then(response => {
        console.log(response)
        if (response.code !== 0) return
        this.userList = response.body.data
        this.totalnum = response.body.total
      })
    },

    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getPoliceList()
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getPoliceList()
    },
    addAPolice() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        const query = [{ ...this.addPoliceForm }]
        console.log(query)
        addPolice(query).then(response => {
          console.log(response)
          if (response.code !== 0) return this.$message.error('添加派出所失败，请联系系统管理员')
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
          if (response.code !== 0) return this.$message.error('更新派出所信息失败,请稍后再试')
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
        deletePolice(params).then(response => {
          this.getPoliceList()
          this.delIDArr = []
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }).catch(() => {
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
        if (response.code !== 0) return this.$message.error('删除派出所失败,请稍后再试')
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
  td {
    padding: 5px !important;
  }
</style>
