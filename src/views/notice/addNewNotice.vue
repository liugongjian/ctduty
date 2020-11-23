<!--  -->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: 'notice' }">通知公告</el-breadcrumb-item>
      <el-breadcrumb-item>新增通知公告</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

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
          ref="myQuillEditor"
          v-model="editor_content"
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

      <el-button type="warning" @click="addUserDialogVisible = false">确 定</el-button>
      <el-button @click="addUserDialogVisible = false">取 消</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      editor_content: '',
      editorOption: {
        modules: {
          toolbar: [
            [
              { size: ['small', 'normal', 'large', 'huge'] },
              'bold', 'italic', 'underline', 'strike', 'blockquote', { 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }, 'link', 'image'
            ]
          ]
        },
        placeholder: '请输入内容'
      }
    }
  }
}

</script>

<style lang='scss' scoped>
.el-breadcrumb{
    font-family: MicrosoftYaHei;
    font-size: 22px;
    color: #151515;
    line-height: 29px;
}
.el-form{
    margin-left: 30px;
    width: 1100px;
}
.input_title{
    width: 390px;
}
.quill-editor{
    display: inline-block;
    width:800px;
    height: 380px;
}
</style>
