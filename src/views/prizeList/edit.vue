<template>
  <div class="createContainer" style="padding: 50px 90px;">
    <el-form ref="editXq" :model="editXq" :rules="rules" label-width="150px" label-position="right">
      <el-form-item label="名称：" prop="name">
        <el-input v-model="editXq.name" placeholder="请输入奖品名称" @blur="trimBlur"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-switch
          v-model="editXq.status"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <el-form-item label="默认奖品：">
        <el-switch
          v-model="editXq.default"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <el-form-item label="数量：" prop="amount">
        <el-input v-model="editXq.amount" type="number" placeholder="请输入奖品数量"></el-input>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input v-model="editXq.sort" type="number" placeholder="请输入排序优先级(1-100)"></el-input>
      </el-form-item>
      <el-form-item label="概率：" prop="percent">
        <el-input v-model="editXq.percent" type="number" placeholder="请输入获奖概率(1-100)"></el-input>
      </el-form-item>
      <el-form-item label="图片：" prop="img">
        <el-upload
          :action="apiPackagesUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :headers="uploadFileHeaders"
          v-model="editXq.img"
          :class="isImg ? 'isimg' : ''"
          class="avatar-uploader">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label>
        <div style="display: flex">
          <div class="cancel">
            <el-button type="default" @click="cancel()">取消</el-button>
          </div>
          <div class="submit" style="margin-left: 20px">
            <el-button type="warning" @click="submit('editXq')">提交</el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import config from '../../config'
import Cookies from 'js-cookie'
import { fetchPrizeView, submitPrizeEdit } from '@/api/applications'
export default {
  name: 'Create',
  components: {},
  data() {
    const validatePercent = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入获奖概率'))
      } else if (+value < 0) {
        callback(new Error('获奖概率不能为负数'))
      } else if (+value > 100) {
        callback(new Error('获奖概率不能大于100'))
      } else {
        callback()
      }
    }
    const validateSort = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入排序优先级'))
      } else if (+value < 0) {
        callback(new Error('排序优先级不能为负数'))
      } else if (+value > 100) {
        callback(new Error('排序优先级不能大于100'))
      } else {
        callback()
      }
    }
    const validateImg = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择图片'))
      } else {
        callback()
      }
    }
    const validateAmount = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入奖品数量'))
      } else if (+value < 0) {
        callback(new Error('奖品数量不能为负数'))
      } else if (+value > 1000000) {
        callback(new Error('奖品数量不能大于一百万'))
      } else {
        callback()
      }
    }
    const {
      prefix: { lotteryPrefix }
    } = config
    return {
      userId: Cookies.get('userId'),
      apiPackagesUrl: lotteryPrefix + '/v1/lottery/upload',
      uploadFileHeaders: { Authorization: Cookies.get('token') },
      imageUrl: '',
      editXq: {
        name: '',
        status: false,
        amount: '',
        percent: '',
        img: '',
        default: false,
        sort: ''
      },
      isImg: false,
      saleTypeOptions: [{
        _id: 1,
        name: '正式包'
      }, {
        _id: 2,
        name: '试用包'
      }],
      productLineOptions: [],
      apisData: [],
      renderFunc(h, option) {
        return h(
          'span', {
            attrs: {
              id: option.key,
              title: option.label + '(' + option.code + ')'
            },
            domProps: {
              innerHTML: option.label + '(' + option.code + ')'
            }
          }
        )
      },
      rules: {
        name: [
          { required: true, trigger: 'change', message: '请输入奖品名称' },
          { max: 32, message: '名称不得超过32个字符' }
        ],
        percent: [
          { required: true, trigger: 'trigger', validator: validatePercent }
        ],
        amount: [
          { required: true, trigger: 'trigger', validator: validateAmount }
        ],
        sort: [
          { required: true, trigger: 'trigger', validator: validateSort }
        ],
        img: [
          { required: true, trigger: 'trigger', validator: validateImg }
        ]
      }
    }
  },
  watch: {

  },
  created() {
    this.getPrizeView(this.$route.query._id)
  },
  methods: {
    // 穿梭框的搜索
    filterMethod(query, item) {
      const i = item.label + '(' + item.code + ')'
      return i.indexOf(query) > -1
    },
    handleAvatarSuccess(res, file) {
      // res里面会有后端返回的path和name
      this.imageUrl = (res.data)[0].path
      this.editXq.img = (res.data)[0].path
    },
    // trim输入框的空格
    trimBlur() {
      this.editXq.name = this.editXq.name.trim()
    },
    getPrizeView(id) {
      fetchPrizeView(id).then((res) => {
        this.editXq.name = res.data.name
        this.editXq.status = !!res.data.status
        this.editXq.default = !!res.data.type
        this.editXq.sort = res.data.sort
        this.editXq.amount = res.data.amount
        this.editXq.percent = res.data.percent
        this.editXq.img = res.data.img
        this.imageUrl = res.data.img
        if (res.data.img) {
          this.isImg = true
        }
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 创建的取消
    cancel() {
      this.$router.go(-1)
    },
    // 创建的提交 请求数据接口
    postApiPackagesEdit() {
      const data = {
        name: this.editXq.name,
        amount: +this.editXq.amount,
        percent: +this.editXq.percent,
        status: this.editXq.status ? 1 : 0,
        type: this.editXq.default ? 1 : 0,
        img: this.imageUrl,
        sort: +this.editXq.sort
      }
      submitPrizeEdit(data, this.$route.query._id)
        .then(() => {
          this.$notify({
            title: '成功',
            message: '编辑成功',
            type: 'success',
            duration: 1000
          })
          this.$nextTick(() => {
            this.$router.push({
              path: '/activitycenter/prize'
            })
          })
        })
        .catch(res => {
        //   this.$message.error(res.msg);
        })
    },

    submit(form) {
      this.$refs.editXq.validate(valid => {
        if (valid) {
          this.postApiPackagesEdit()
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
 .el-form-item{
    .el-input{
      width: 380px;
    }
  }
  .createContainer{
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
.isimg{
  .el-upload {
    border: none !important;
  }
}

</style>
