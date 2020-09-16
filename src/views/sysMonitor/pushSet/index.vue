<template>
  <div class="push">
    <el-form ref="form" :model="form" label-width="120px" label-position="right">
      <el-form-item label="开始时间" prop="date1">
        <el-col :span="11">
          <el-time-picker
            v-model="form.date1"
            :picker-options="{
              selectableRange:'00:00:00 -23:59:00'
            }"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="选择时间">
          </el-time-picker>
        </el-col>
      </el-form-item>

      <el-form-item label="结束时间" prop="date2">
        <el-col :span="11">
          <el-time-picker
            v-model="form.date2"
            :picker-options="{
              selectableRange: form.date1+ ':00' + '- 23:59:00'
            }"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="选择时间">
          </el-time-picker>
        </el-col>
      </el-form-item>

      <el-form-item label="弹窗推送服务" prop="deliveryPush">
        <el-switch v-model="form.deliveryPush"></el-switch>
      </el-form-item>
      <el-form-item label="短信服务" prop="deliveryMessage">
        <el-switch v-model="form.deliveryMessage"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getPushSet, pushSet } from '../../../api/alarm.js'
export default {
  data() {
    return {
      form: {
        date1: '02:00',
        date2: '05:00',
        deliveryPush: false,
        deliveryMessage: true
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    submitForm(form) {
      const param = {
        date1: this.form.date1,
        date2: this.form.date2,
        deliveryPush: this.form.deliveryPush,
        deliveryMessage: this.form.deliveryMessage
      }
      this.$refs[form].validate((valid) => {
        if (valid) {
          pushSet(param).then(res => {
            this.$message({
              message: '提交成功！',
              type: 'success'
            })
          }).catch(err => {
            this.$message.error('提交失败！')
          })
        } else {
          return false
        }
      })
    },
    getList() {
      getPushSet().then(response => {
        const setting = response.body.data.setting
        let parseSetting
        try {
          parseSetting = JSON.parse(setting)
        } catch (err) {
          parseSetting = {}
        }
        this.form.date1 = parseSetting.date1
        this.form.date2 = parseSetting.date2
        this.form.deliveryMessage = parseSetting.deliveryMessage
        this.form.deliveryPush = parseSetting.deliveryPush
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }

}

</script>

<style lang="scss">
.main-container {
  height: 100% !important;
}
  .push{
    padding: 20px;
    width: 100%;
    height: calc(100vh - 50px);
  }
  .title {
   width: 100%;
   height: 50px;
   line-height: 50px;
   font-family: MicrosoftYaHei;
   font-size: 22px;
   color: #333333;
   font-weight: 500;
   border-bottom: 1px solid #ccc;
   background: #FFF;
   padding: 0 20px;
 }
.el-form {
  width: 100%;
  height: 92%;
  padding: 20px;
  background: #FFF;
  margin-bottom: 20px;
}

</style>
