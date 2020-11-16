<template>
  <div class="notice">
    <div>
      <div class="clearfix">
        <div class="pull-left">
          <el-input
            ref="queryTitleRef"
            v-model="queryInfo.params.title"
            class="searchinput"
            placeholder="公告标题"
          ></el-input>
          <el-input
            ref="queryOperatorRef"
            v-model="username"
            class="searchinput"
            placeholder="创建者姓名"
          ></el-input>
          <el-select ref="queryTypeRef" v-model="queryInfo.params.type" placeholder="公告类型">
            <el-option :value="null" label="所有">所有</el-option>
            <el-option :value="0" label="公告">通知</el-option>
            <el-option :value="1" label="通知">公告</el-option>
          </el-select>
          <el-button type="warning" icon="el-icon-search" @click="getNoticeList">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </div>
        <div class="pull-right">
          <el-button class="addNotice" type="warning" @click="addNoticeDialogVisible=true">+新建通知</el-button>
        </div>
      </div>
      <el-table
        :data="noticeList"
        :header-cell-class-name="tableRowClassHeader"
        class="amountdetailTable"
        tooltip-effect="dark"
        fit
        style="width: 120vw"
        @filter-change="filerStatus"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="公告标题">
          <template slot-scope="row_data">
            <el-link
              type="primary"
              @click="showEditDialog(row_data.row.id,'false')"
            >{{ row_data.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="公告类型" prop="type">
          <template slot-scope="row_data">{{ row_data.row.type === 0 ? '通知' : '公告' }}</template>
        </el-table-column>
        <el-table-column label="状态" prop="state">
          <template slot-scope="row_data">{{ row_data.row.state === 0 ? '正常' : '紧急' }}</template>
        </el-table-column>
        <el-table-column label="创建者" prop="creator.username"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'操作'">
          <template slot-scope="row_data">
            <el-button
              type="text"
              size="small"
              @click="showEditDialog(row_data.row.id,'true')"
            >{{ '编辑' }}</el-button>
            <el-button
              type="text"
              size="small"
              @click="showDeleteDialog(row_data.row.title,row_data.row.id)"
            >{{ '删除' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- <el-table
      :data="noticeList"
      :header-cell-class-name="tableRowClassHeader"
      class="amountdetailTable"
      tooltip-effect="dark"
      fit
      style="width: 120vw"
      @filter-change="filerStatus"
    >
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column label="公告标题">
        <template slot-scope="row_data">
          <el-link
            type="primary"
            @click="showEditDialog(row_data.row.id,'false')"
          >{{ row_data.row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="公告类型" prop="type">
        <template slot-scope="row_data">{{ row_data.row.type === 0 ? '通知' : '公告' }}</template>
      </el-table-column>
      <el-table-column label="状态" prop="state">
        <template slot-scope="row_data">{{ row_data.row.state === 0 ? '正常' : '紧急' }}</template>
      </el-table-column>
      <el-table-column label="创建者" prop="creator.username"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" :label="'操作'">
        <template slot-scope="row_data">
          <a
            style="color: #FA8334; text-decoration:none;"
            type="text"
            size="small"
            @click="showEditDialog(row_data.row.id,'true')"
          >{{ '编辑' }}</a>
          <el-button
            type="text"
            size="small"
            @click="showDeleteDialog(row_data.row.title,row_data.row.id)"
          >{{ '删除' }}</el-button>
        </template>
      </el-table-column>
    </el-table>-->

    <!-- <el-pagination
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 50]"
      :page-size="queryInfo.pagesize"
      :total="totalnum"
      layout="total, prev, pager, next, sizes, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination> -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryInfo.pagenum"
      :limit.sync="limit"
      @pagination="pageChange()"
    />

    <el-dialog
      :visible.sync="addNoticeDialogVisible"
      title="新增通知"
      width="520px"
      @close="addDialogClosed"
    >
      <el-form
        ref="addFormRef"
        :rules="addFormRules"
        :model="addNoticeForm"
        label-width="80px"
        label-position="right"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="addNoticeForm.title" class="input_title"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="addNoticeForm.type">
            <el-radio :label="0">通知</el-radio>
            <el-radio :label="1">公告</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="紧急程度" prop="state">
          <el-radio-group v-model="addNoticeForm.state">
            <el-radio :label="0">普通</el-radio>
            <el-radio :label="1">紧急</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="内容">
          <quill-editor ref="myQuillEditor" v-model="addNoticeForm.content" :options="editorOption"></quill-editor>
        </el-form-item>

        <el-form-item class="select" label="签名档" style="margin-top:1px;">
          <el-select v-model="addNoticeForm.signatureId" class="select" placeholder="请选择">
            <!-- <el-option value="1" label="1"></el-option> -->
            <el-option
              v-for="(item,key) in departmentInfo"
              :key="key"
              :label="item.department"
              :value="item.departmentId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="postAddANotice">确 定</el-button>
        <el-button @click="addNoticeDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="editNoticeDialogVisible"
      title="修改通知"
      width="520px"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :rules="addFormRules"
        :model="editNoticeForm"
        :disabled="modifiable==='false'"
        label-width="80px"
        label-position="right"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="editNoticeForm.title" class="input_title"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="editNoticeForm.type">
            <el-radio :label="0">通知</el-radio>
            <el-radio :label="1">公告</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="紧急程度" prop="state">
          <el-radio-group v-model="editNoticeForm.state">
            <el-radio :label="0">普通</el-radio>
            <el-radio :label="1">紧急</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="modifiable==='true'" label="内容">
          <quill-editor
            ref="myQuillEditor"
            v-model="editNoticeForm.content"
            :options="editorOption"
          ></quill-editor>
        </el-form-item>
        <el-form-item v-if="modifiable==='false'" label="内容">
          <div v-html="editNoticeForm.content"></div>
        </el-form-item>
        <el-form-item label="签名档">
          <el-select
            v-model="editNoticeForm.signatureId"
            :value="editNoticeForm.signatureId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in departmentInfo"
              :value="item.departmentId"
              :label="item.department"
              :key="item.departmentId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="modifiable==='true'" type="warning" @click="getEditANotice">确 定</el-button>
        <el-button @click="editNoticeDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="deleteNoticeDialogVisible" title="删除消息" width="400px">
      <span>确认删除信息{{ deleteNoticeTitle }}？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="deleteANotice">确 定</el-button>
        <el-button @click="deleteNoticeDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchNoticeList,
  postAddNotices,
  getNoticeInfo,
  updateANotice,
  deleteNotices
} from '@/api/notice'
import Pagination from '@/components/Pagination'
import { fetchUserList } from '@/api/users'
import { notReadNotices } from '@/api/notice'
export default {
  components: { Pagination },
  data() {
    return {
      page: 1,
      limit: 10,
      oldSize: 10,
      searchName: '',
      searchUserIds: [],
      addFormRules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        creatorId: [
          { required: true, message: '创建者不能为空', trigger: 'blur' }
        ],
        type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
        state: [
          { required: true, message: '紧急程度不能为空', trigger: 'blur' }
        ]
      },

      editor_content: '',
      editorOption: {
        modules: {
          toolbar: [
            [
              { size: ['small', 'normal', 'large', 'huge'] },
              'bold',
              'italic',
              'underline',
              'strike',
              'blockquote',
              { list: 'ordered' },
              { list: 'bullet' },
              { indent: '-1' },
              { indent: '+1' },
              'link'
            ]
          ]
        },
        placeholder: '请输入内容'
      },

      addUserDialogVisible: false,
      noticeList: [],
      username: '',
      userid: null,
      queryInfo: {
        pagenum: 1,
        pagesize: 10,
        params: {
          title: '',
          type: null
        }
      },
      total: 0,
      addNoticeDialogVisible: false,
      addNoticeForm: {
        content: '',
        state: null,
        title: '',
        type: null,
        signatureId: null,
        creatorId: ''
      },
      editNoticeForm: {},
      editNoticeDialogVisible: false,
      deleteNoticeDialogVisible: false,
      deleteNoticeTitle: '',
      deleteNoticerId: 0,
      modifiable: false,

      departmentInfo: [
        {
          departmentId: 3275699862611970,
          department: '华阴公安局'
        },
        {
          departmentId: 3275699862611971,
          department: '孟塬镇派出所'
        },
        {
          departmentId: 3275699862611972,
          department: '华山镇派出所'
        }
      ]
    }
  },
  watch: {
    'addNoticeForm.content'(v) {
      if (v.length > 500) {
        this.$message({
          type: 'warning',
          message: '内容长度不能大于500!'
        })
      }
    },
    'editNoticeForm.content'(v) {
      if (v.length > 500) {
        this.$message({
          type: 'warning',
          message: '内容长度不能大于500!'
        })
      }
    },
    limit() {
      this.page = 1
      this.pageChange()
    }
  },
  created() {
    this.getNoticeList()
  },
  methods: {
    async getNoticeList() {
      const query = {
        cascade: true,
        page: {
          index: this.queryInfo.pagenum,
          size: this.queryInfo.pagesize
        },
        params: {},
        sorts: [
          {
            field: 'create_time',
            type: 'desc'
          }
        ]
      }

      if (this.queryInfo.params.title.trim() !== '') {
        query.params['title'] = this.queryInfo.params.title
      }
      if (this.queryInfo.params.type !== null) {
        query.params['type'] = this.queryInfo.params.type
      }

      if (this.username.trim() !== '') {
        await this.searchUserId()
        if (this.userid !== null) {
          query.params['creatorId'] = this.userid
        } else {
          this.userid = {}
          return
        }
      }
      fetchNoticeList(query).then(response => {
        if (response.code !== 0) return this.$message.error('获取通知信息失败')
        this.noticeList = response.body.data
        this.noticeList.map(item => {
          item.createTime = item.createTime.substring(0, 19).replace(/T/, ' ')
        })
        this.total = response.body.page.total
      })
    },
    pageChange() {
      if (this.oldSize !== this.limit) {
        this.page = 1
      }
      this.oldSize = this.limit
      this.getNoticeList()
    },
    tableRowClassHeader({ row, rowIndex }) {
      return 'tableRowClassHeader'
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

    async searchUserId() {
      await fetchUserList({ params: { username: this.username }}).then(
        response => {
          if (response.body.data.length == 0) {
            return this.$message.error('该用户不存在，请重新输入')
          }
          this.userid = response.body.data[0].id
        }
      )
    },

    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getNoticeList()
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getNoticeList()
    },

    postAddANotice() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        const query = [{ ...this.addNoticeForm }]
        query[0].creatorId = this.getCookie('userId')
        // console.log(query[0].creatorId)
        // query[0].creatorId = parseInt(window.localStorage.getItem('userId'))
        // console.log(query)
        postAddNotices(query).then(response => {
          if (response.code !== 0) {
            return this.$message.error('添加失败，请联系系统管理员')
          }
          this.$message.success('添加成功')

          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.addNoticeDialogVisible = false
          this.getNoticeList()
          const params = {
            index: 1,
            size: 10000,
            total: 0
          }
          notReadNotices(params).then(res => {
            if (res.body.data.length > 0) {
              this.$store.commit('SET_NOTICETOTAL', res.body.page.total)
              this.$store.commit('SET_NOTICEARR', res.body.data)
            }
          })
        })
      })
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.addNoticeForm = {}
      this.username = ''
      this.userid = null
    },
    resetQuery() {
      this.queryInfo.params.title = ''
      this.queryInfo.params.type = null
      this.username = ''
      this.userid = null
      this.getNoticeList()
    },

    showEditDialog(id, modifiable) {
      getNoticeInfo(id).then(response => {
        // console.log(response)
        if (response.code !== 0) return this.$message.error('获取信息失败')
        this.editNoticeForm = response.body.data
        this.editNoticeDialogVisible = true
        this.modifiable = modifiable
      })
    },
    getEditANotice() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        updateANotice([{ ...this.editNoticeForm }]).then(response => {
          if (response.code !== 0) {
            return this.$message.error('更新信息失败,请稍后再试')
          }
          this.editNoticeDialogVisible = false
          this.getNoticeList()
          this.$message.success('更新成功')
        })
      })
    },
    editDialogClosed() {
      this.editNoticeForm = {}
      this.username = ''
      this.userid = null
    },

    showDeleteDialog(title, id) {
      this.deleteNoticeDialogVisible = true
      this.deleteNoticeTitle = title
      this.deleteNoticerId = id
    },
    deleteANotice() {
      const ids = []
      ids.push(this.deleteNoticerId)
      deleteNotices(ids).then(response => {
        if (response.code !== 0) {
          return this.$message.error('删除失败,请稍后再试')
        }
        this.deleteNoticeDialogVisible = false
        this.deleteNoticerId = 0
        this.deleteNoticeTitle = ''
        this.getNoticeList()
        this.$message.success('删除信息成功')
      })
    },
    getCookie(objName) {
      // 获取指定名称的cookie的值
      var arrStr = document.cookie.split('; ')
      for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split('=')
        if (temp[0] == objName) {
          return decodeURI(temp[1])
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.notice {
  padding: 10px 20px;
}
.input_title {
  width: 360px;
}
.title {
  width: 150px;
  height: 100px;
  border: 1px solid #000;
  display: -moz-inline-box; /* css注释：for ff2 */
  display: inline-block;
}
.el-pagination {
  float: right;
}
.el-table {
  margin-top: 20px;
}
.searchinput {
  width: 250px;
}
/* .addNotice {
  float: right;
} */
.quill-editor {
  display: inline-block;
  width: 360px;
  height: 150px;
}
.el-row {
  margin-top: 20px;
}
.el-select-dropdown {
  z-index: 9999999999999999999999999999999999 !important;
}
</style>
