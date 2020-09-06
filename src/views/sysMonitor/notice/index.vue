
<template>
  <div>
    <span style="font-family: MicrosoftYaHei;font-size: 22px;color: #333333;margin-left:20px;inline-height:20px">通知公告</span>
    <el-divider></el-divider>
    <el-row>
      <el-input v-model="this.queryInfo.params.title" class="searchinput" placeholder="公告标题"></el-input>
      <el-input class="searchinput" placeholder="操作人员"></el-input>
      <el-select placeholder="公告类型" v-model="this.queryInfo.params.type" >
        <el-option :label="null">所有</el-option>
        <el-option :label="0">公告</el-option>
        <el-option :label="1">通知</el-option>
      </el-select>
      <el-button type="warning" icon="el-icon-search" @click="getNoticeList">搜索</el-button>
      <el-button>重置</el-button>
      <el-button class="addNotice" type="warning" @click="addNoticeDialogVisible=true">+新建通知</el-button>
    </el-row>

    <el-table :header-cell-style="{background:'#ecedee',color:'#717171'}">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column label="公告标题" prop="title"></el-table-column>
      <el-table-column label="公告类型" prop="type">
        <template slot-scope="row_data">
            {{row_data.row.type === 0 ? '通知' : '公告'}}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state">
        <template slot-scope="row_data">
            {{row_data.row.state === 0 ? '正常' : '紧急'}}
        </template>
      </el-table-column>
      <el-table-column label="创建者"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="row_data">
          <el-link type="primary" @click="showEditDialog(row_data.row.id)">编辑</el-link>
          <el-link type="primary" @click="showDeleteDialog(row_data.row.id)">删除</el-link>
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
      <el-form>
        <el-form-item label="标题">
             <el-input class="input_title"></el-input>
        </el-form-item>
        <el-form-item label="类型">
            <el-radio-group>
                <el-radio label="通知"></el-radio>
                <el-radio label="公告"></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="紧急程度">
            <el-radio-group>
                <el-radio label="普通"></el-radio>
                <el-radio label="紧急"></el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item>
            <span>内容</span>
            <quill-editor
                v-model="editor_content"
                ref="myQuillEditor"
                :options="editorOption"
                @focus="onEditorFocus($event)"
                @blur="onEditorBlur($event)"
                @change="onEditorChange($event)">
            </quill-editor>
        </el-form-item>

        <el-form-item label="签名档">
                <el-select placeholder="请选择">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="addAUser">确 定</el-button>
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { fetchNoticeList } from '@/api/notice'
export default {
  data() {
    return {

      editor_content: '',
      editorOption: {
　　　　　modules: {
　　　　　toolbar: [
　　　　　　　　[
                {size: [ 'small', 'normal', 'large', 'huge' ]},
                'bold', 'italic', 'underline', 'strike','blockquote',{ 'list': 'ordered'},{ 'list': 'bullet' },{ 'indent': '-1'}, { 'indent': '+1' },'link','image'
                ]
　　　　　　　]
　　　　　　},
　　　　　　　　　placeholder: '请输入内容'
      },

      addUserDialogVisible: false,
      noticeList:[],
      queryInfo: {
        pagenum: 1,
        pagesize: 10,
        params:{
          title:'',
          type:null,
        },
      },
      totalnum: 0,
      addNoticeDialogVisible:false,
    }
  },
  created(){
    this.getNoticeList();
  },
  methods: {


    getNoticeList(){
      const query = {
        cascade: true,
        page: {
          index: this.queryInfo.pagenum,
          size: this.queryInfo.pagesize
        },
        params: {
          title:this.queryInfo.params.title,
          type:this.queryInfo.params.type
        }
      }
      fetchNoticeList(query).then(response=>{
        if(response.code!==0) return this.$message.error('获取通知信息失败')
        this.noticeList = response.body.data
        this.totalnum = response.body.total
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
