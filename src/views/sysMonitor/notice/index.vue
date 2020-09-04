
<template>
  <div>
    <span style="font-family: MicrosoftYaHei;font-size: 22px;color: #333333;margin-left:20px;inline-height:20px">通知公告</span>
    <el-divider></el-divider>
    <el-row>
      <el-input v-model="input2" class="searchinput" placeholder="公告标题"></el-input>
      <el-input v-model="input2" class="searchinput" placeholder="操作人员"></el-input>
      <el-select placeholder="公告类型">
        <el-option label="所有" value="shanghai"></el-option>
        <el-option label="通知" value="beijing"></el-option>
      </el-select>
      <el-button type="warning" icon="el-icon-search">搜索</el-button>
      <el-button>重置</el-button>
    </el-row>

    <el-table :header-cell-style="{background:'#ecedee',color:'#717171'}">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column label="公告标题"></el-table-column>
      <el-table-column label="公告类型"></el-table-column>
      <el-table-column label="状态"></el-table-column>
      <el-table-column label="创建者"></el-table-column>
      <el-table-column label="创建时间"></el-table-column>
      <el-table-column label="操作"></el-table-column>
    </el-table>

    <el-pagination
      :current-page="currentPage4"
      :page-sizes="[10, 20, 50]"
      :page-size="100"
      :total="400"
      layout="total, prev, pager, next, sizes, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>

    <el-dialog
      :visible.sync="addUserDialogVisible"
      :before-close="handleClose"
      title="新增用户"
      width="50%">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item label="用户名称">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="区域/部门">
          <el-select placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位">
          <el-select placeholder="请选择岗位">
            <el-option label="岗位一" value="shanghai"></el-option>
            <el-option label="岗位二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限">
          <el-radio-group>
            <el-radio label="管理员"></el-radio>
            <el-radio label="普通用户"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="addUserDialogVisible = false">确 定</el-button>
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addUserDialogVisible: false
    }
  },
  methods: {

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

</style>
