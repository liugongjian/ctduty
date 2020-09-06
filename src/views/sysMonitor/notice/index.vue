
<template>
  <div class="notice">
    <el-divider></el-divider>
    <el-row>
      <el-input ref="queryTitleRef" v-model="queryInfo.params.title" class="searchinput" placeholder="公告标题"></el-input>
      <el-input ref="queryOperatorRef" class="searchinput" placeholder="操作人员"></el-input>
      <el-select ref="queryTypeRef" v-model="queryInfo.params.type" placeholder="公告类型">
        <el-option :value="null" label="所有">所有</el-option>
        <el-option :value="0" label="公告">通知</el-option>
        <el-option :value="1" label="通知">公告</el-option>
      </el-select>
      <el-button type="warning" icon="el-icon-search" @click="getNoticeList">搜索</el-button>
      <el-button @click="resetQuery">重置</el-button>
      <el-button class="addNotice" type="warning" @click="addNoticeDialogVisible=true">+新建通知</el-button>
    </el-row>

    <el-table :data="noticeList" :header-cell-style="{background:'#ecedee',color:'#717171'}">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column label="公告标题">
        <template slot-scope="row_data">
          <el-link type="primary" @click="showEditDialog(row_data.row.id,'false')">{{ row_data.row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="公告类型" prop="type">
        <template slot-scope="row_data">
          {{ row_data.row.type === 0 ? '通知' : '公告' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state">
        <template slot-scope="row_data">
          {{ row_data.row.state === 0 ? '正常' : '紧急' }}
        </template>
      </el-table-column>
      <el-table-column label="创建者"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="row_data">
          <el-link type="primary" @click="showEditDialog(row_data.row.id,'true')">编辑</el-link>
          <el-link type="primary" @click="showDeleteDialog(row_data.row.title,row_data.row.id)">删除</el-link>
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
      :visible.sync="addNoticeDialogVisible"
      title="新增通知"
      width="50%"
      @close="addDialogClosed">
      <el-form ref="addFormRef" :rules="addFormRules" :model="addNoticeForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addNoticeForm.title" class="input_title" ></el-input>
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

        <el-form-item>
          <span>内容</span>
          <quill-editor
            ref="myQuillEditor"
            v-model="addNoticeForm.content"
            :options="editorOption">
          </quill-editor>
        </el-form-item>

        <!-- <el-form-item label="签名档">
                <el-select placeholder="请选择">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="postAddANotice">确 定</el-button>
        <el-button @click="addNoticeDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="editNoticeDialogVisible"
      title="修改通知"
      width="50%"
      @close="editDialogClosed">
      <el-form ref="editFormRef" :rules="addFormRules" :model="editNoticeForm" :disabled="modifiable==='false'">
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

        <el-form-item v-if="modifiable==='true'">
          <span>内容</span>
          <quill-editor
            ref="myQuillEditor"
            v-model="editNoticeForm.content"
            :options="editorOption">
          </quill-editor>
        </el-form-item>
        <el-form-item v-if="modifiable==='false'">
          <span>内容</span>
          <div v-html="editNoticeForm.content"></div>
        </el-form-item>

        <!-- <el-form-item label="签名档">
                <el-select placeholder="请选择">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="getEditANotice">确 定</el-button>
        <el-button @click="editNoticeDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="deleteNoticeDialogVisible"
      title="删除消息"
      width="50%">
      <span>确认删除信息{{ this.deleteNoticeTitle }}？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="deleteANotice">确 定</el-button>
        <el-button @click="deleteNoticeDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import { fetchNoticeList, postAddNotices, getNoticeInfo, updateANotice, deleteNotices } from '@/api/notice'
export default {
  data() {
    return {

      addFormRules:{
        title:[{ required: true, message: '标题不能为空', trigger: 'blur' }],
        type:[{ required: true, message: '类型不能为空', trigger: 'blur' }],
        state:[{required: true, message: '紧急成都不能为空', trigger: 'blur' }]
      },

      editor_content: '',
      editorOption: {
        modules: {
          toolbar: [
            [
              { size: ['small', 'normal', 'large', 'huge'] },
              'bold', 'italic', 'underline', 'strike', 'blockquote', { 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }, 'link'
            ]
          ]
        },
        placeholder: '请输入内容'
      },

      addUserDialogVisible: false,
      noticeList: [],
      queryInfo: {
        pagenum: 1,
        pagesize: 10,
        params: {
          title: '',
          type: null
        }
      },
      totalnum: 0,
      addNoticeDialogVisible: false,
      addNoticeForm: {
        content: '',
        state: null,
        title: '',
        type: null
      },
      editNoticeForm: {},
      editNoticeDialogVisible: false,
      deleteNoticeDialogVisible: false,
      deleteNoticeTitle: '',
      deleteNoticerId: 0,
      modifiable: false
    }
  },
  created() {
    this.getNoticeList()
  },
  methods: {
    getNoticeList() {
      const query = {
        cascade: true,
        page: {
          index: this.queryInfo.pagenum,
          size: this.queryInfo.pagesize
        },
        params: {}
      }

      if (this.queryInfo.params.title !== '') {
        query.params['title'] = this.queryInfo.params.title
      }
      if (this.queryInfo.params.type !== null) {
        query.params['type'] = this.queryInfo.params.type
      }

      fetchNoticeList(query).then(response => {
        if (response.code !== 0) return this.$message.error('获取通知信息失败')
        this.noticeList = response.body.data
        this.totalnum = response.body.page.total
      })
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
      const query = [{ ...this.addNoticeForm }]
      postAddNotices(query).then(response => {
        if (response.code !== 0) return this.$message.error('添加失败，请联系系统管理员')
        this.$message.success('添加成功')
        this.addNoticeDialogVisible = false
        this.getNoticeList()
      })
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.addNoticeForm = {}
    },
    resetQuery() {
      this.queryInfo.params.title = ''
      this.queryInfo.params.type = 0
      this.getNoticeList()
    },

    showEditDialog(id, modifiable) {
      getNoticeInfo(id).then(response => {
        // console.log(response)
        if (response.code !== 0) return this.$message.error('获取用户信息失败')
        this.editNoticeForm = response.body.data
        this.editNoticeDialogVisible = true
        this.modifiable = modifiable
      })
    },
    getEditANotice() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        updateANotice([{ ...this.editNoticeForm }]).then(response => {
          // console.log(response)
          if (response.code !== 0) return this.$message.error('更新用户信息失败,请稍后再试')
          this.editNoticeDialogVisible = false
          this.getNoticeList()
          this.$message.success('更新成功')
        })
      })
    },
    editDialogClosed() {
      this.editNoticeForm = {}
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
        if (response.code !== 0) return this.$message.error('删除失败,请稍后再试')
        this.deleteNoticeDialogVisible = false
        this.deleteNoticerId = 0
        this.deleteNoticeTitle = ''
        this.getNoticeList()
        this.$message.success('删除信息成功')
      })
    }
  }
}

</script>

<style scoped>
.notice {
  padding: 0px 20px;
}
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
    width: 250px;
}
.addNotice {
  float: right;
}
.quill-editor{
    display: inline-block;
    width:700px;
    height: 200px;
}
</style>
