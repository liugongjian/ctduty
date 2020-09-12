
<template>
  <div class="userManage">
    <el-divider></el-divider>
    <el-row>
      <el-button class="addbtn" type="warning" @click="addUserDialogVisible=true">+新增区域</el-button>
      <el-input v-model="queryName" class="searchinput" placeholder="请输入..."></el-input>
      <el-button class="searchbtn" type="warning" @click="getareaList">搜索</el-button>
      <el-button class="searchbtn" @click="resetQuery">重置</el-button>
    </el-row>
    <el-table :data="areaList" :header-cell-style="{background:'#ecedee',color:'#717171'}">
      <el-table-column label="区域名称" prop="name"></el-table-column>
      <el-table-column label="公安局名称" prop="policeStation.name">{{policeStation ? policeStation.name : ''}}</el-table-column>
      <el-table-column label="创建时间" prop="createTime">
        <template slot-scope="scope">
          <span>{{ renderTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime">
        <template slot-scope="scope">
          <span>{{ renderTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作">
        <template slot-scope="row_data">
          <el-link type="primary" @click="showEditDialog(row_data.row.id)">编辑</el-link>
          <el-link type="primary" @click="showDeleteDialog(row_data.row.username,row_data.row.id)">删除</el-link>
        </template>
      </el-table-column> -->
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
      title="新增区域"
      width="40%"
      @close="addDialogClosed">
      <el-form ref="addFormRef" :model="town" :rules="addUserFormRules" label-width="100px">   
        <el-form-item label="村/镇" prop="level">
          <el-radio-group v-model="town.level">
            <el-radio :label="1">镇</el-radio>
            <el-radio :label="2">村</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="town.level === 1">
          <el-form-item label="镇名">
            <el-input v-model="town.name" type="text"></el-input>
          </el-form-item>
          <el-form-item label="所属派出所">
            <el-select v-model="town.policeStationId" placeholder="请选择所属派出所">
              <el-option v-for="item in this.policeList" :value="item.value" :label="item.label" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-if="town.level === 2">
          <el-form-item label="村名">
            <el-input v-model="town.name" type="text"></el-input>
          </el-form-item>
          <el-form-item label="隶属" v-model="town.parentId">
            <div class="block">
              <el-cascader
                v-model="value"
                :options="options"
                @change="handleChange"
              >
              </el-cascader>
            </div>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="addAUser">确 定</el-button>
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- <el-dialog
      :visible.sync="deleteUserDialogVisible"
      title="删除用户"
      width="50%">
      <span>确认删除用户{{ this.deleteUserName }}？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="deleteAUser">确 定</el-button>
        <el-button @click="deleteUserDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { renderTime } from '@/utils'
import { fetchAreaList, postAddUser, getUserInfo, updateUser, deleteUser, getCountry, addCountry, getPolice } from '@/api/users'

export default {
  data() {
    return {
      renderTime,
      policeList: [],
      addUserDialogVisible: false,
      addUserFormRules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在5-12个字符之间', trigger: 'blur' }
        ]
      },
      town: {
        name: '',
        level: 1,
        parentId: '0',
        policeStationId: ''
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
      regionalism: 'town',
      aboutTown: [],
      options: [{
        value: '',
        label: '',
        children: [{
          value: '',
          label: ''}]
      }],
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
      areaList: [],
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
    }
  },
  async created() {
    await this.getareaList()
    await this.getCountryList()
    this.getTownList()
  },
  methods: {
    getareaList() {
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
      fetchAreaList(query).then(response => {
        console.log(response, 'area')
        if (response.code !== 0) return
        this.areaList = response.body.data
        this.totalnum = response.body.total
      })
    },

    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getareaList()
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getareaList()
    },
    addAUser() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        const query = [{ ...this.town }]
        console.log(query)
        addCountry(query).then(response => {
          console.log(response)
          if (response.code !== 0) return this.$message.error('添加区域失败，请联系系统管理员')
          this.$message.success('添加区域成功')
          this.addUserDialogVisible = false
          this.getareaList()
        })
      })
    },
    addDialogClosed() {
      this.addUserForm = {}
      this.$refs.addFormRef.resetFields()
    },
    // showEditDialog(id) {
    //   const { data: res } = getUserInfo(id).then(response => {
    //     // console.log(response)
    //     if (response.code !== 0) return this.$message.error('获取用户信息失败')
    //     this.editUserForm = response.body.data
    //     this.editUserDialogVisible = true
    //   })
    // },
    // editDialogClosed() {
    //   this.editUserForm = {}
    // },
    // showDeleteDialog(username, id) {
    //   this.deleteUserDialogVisible = true
    //   this.deleteUserName = username
    //   this.deleteUserId = id
    // },

    // deleteAUser() {
    //   const ids = []
    //   ids.push(this.deleteUserId)
    //   deleteUser(ids).then(response => {
    //     if (response.code !== 0) return this.$message.error('删除用户失败,请稍后再试')
    //     this.deleteUserDialogVisible = false
    //     this.deleteUserId = 0
    //     this.deleteUserName = ''
    //     this.getareaList()
    //     this.$message.success('删除用户信息')
    //   })
    // },

    resetQuery() {
      this.queryName = ''

      this.getareaList()
    },

    handleChange(value) {
      this.town.parentId = value.reverse()[0]
    },

    getCountryList() {
      getCountry().then((res) => {
        if (res.code === 0) {
          console.log('村镇res', res.body.data)
          this.options = this.formatCountry(res.body.data, 1);
        }
      })
    },
    formatCountry(arr, level) {
      return arr.map(item => {
        if (item.level < level) {
          return {
            label: item.name,
            value: item.id,
            children: this.formatCountry(item.children, level)
          }
        } else {
          return {
            value: item.id,
            label: item.name
          };
        }
      })
    },

    getTownList() {
      getPolice({}).then((res) => {
        if (res.code === 0) {
          console.log('村res', res.body.data)
          this.policeList = res.body.data.map(item => {
            return {
              label: item.name,
              value: item.id
            }
          })
          console.log(this.policeList)
        }
      })
    },

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
