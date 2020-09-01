<template>
  <div class="viewContainer">
    <el-form ref="viewXq" :model="viewXq" label-position="right" label-width="120px">
      <el-form-item label="名称：" >
        <div style="margin-left:30px; word-wrap: break-word">{{ viewXq.name }}</div>
      </el-form-item>
      <el-form-item label="状态：" class="status">
        <div v-if="viewXq.status === 1" class="nomalStatus" style="margin-left:30px;">开启</div>
        <div v-else-if="viewXq.status === 0" class="closeStatus" style="margin-left:30px;">关闭</div>
      </el-form-item>
      <el-form-item label="默认奖品：" class="status">
        <div v-if="viewXq.default === 1" class="nomalStatus" style="margin-left:30px;">默认</div>
        <div v-else-if="viewXq.default === 0" class="closeStatus" style="margin-left:30px;">非默认</div>
      </el-form-item>
      <el-form-item label="数量：" >
        <div style="margin-left:30px; word-wrap: break-word">{{ viewXq.amount }}</div>
      </el-form-item>
      <el-form-item label="排序：" >
        <div style="margin-left:30px; word-wrap: break-word">{{ viewXq.sort }}</div>
      </el-form-item>
      <el-form-item label="概率：" >
        <div style="margin-left:30px; word-wrap: break-word">{{ viewXq.percent + '%' }}</div>
      </el-form-item>
      <el-form-item label="图片：" >
        <div style="margin-left:30px; word-wrap: break-word">
          <img :src="viewXq.img" width="100px" height="100px">
        </div>
      </el-form-item>
      <el-form-item label="">
        <div class="back" style="margin-left:30px">
          <el-button type="default" @click="back">返回</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { fetchPrizeView } from '@/api/applications'
export default {
  name: 'Detail',
  data() {
    return {
      viewXq: {
      }
    }
  },
  created() {
    Message.closeAll()
    this.getApiPackagesView(this.$route.query._id)
  },
  methods: {
    // 表头样式
    tableRowClassHeader({ row, rowIndex }) {
      return 'tableRowClassHeader'
    },
    getApiPackagesView(_id) {
      fetchPrizeView(_id).then(response => {
        this.viewXq = {}
        this.viewXq.name = response.data.name
        this.viewXq.status = response.data.status
        this.viewXq.amount = response.data.amount
        this.viewXq.percent = response.data.percent
        this.viewXq.img = response.data.img
        this.viewXq.default = response.data.type
        this.viewXq.sort = response.data.sort
      })
    },
    detail(val) {
      this.$nextTick(() => {
        this.$router.push({
          path: '/openapi/apis/detail',
          query: {
            _id: val._id
          }
        })
      })
    },
    // 返回上层页面
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss">
  .viewContainer{
    .el-form-item{
      margin-bottom: 5px;
    }
    padding: 30px 90px;
    .el-form-item__label {
       font-family: PingFangSC-Regular;
       font-size: 14px;
       color: #333333;
    }
    .api-icon {
       width: 14px;
       height: 14px;
       background: url(../../assets/images/apiPackages.png) no-repeat center;
    }
    .back {
      margin-top: 10px;
    }
    .api-table{
      .el-form-item__content {
        overflow: hidden;
      }
    }

    .content {
      .el-form-item__label {
        height: 64px;
        line-height: 64px;
      }
    }

  }
 .el-form-item{
    .el-input{
      width: 380px;
    }
  }
</style>
