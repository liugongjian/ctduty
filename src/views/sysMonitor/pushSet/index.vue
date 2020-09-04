<template>
  <div class="push">
    <div class="title">
      天翼值更系统推送服务设置
    </div>
    <el-form ref="form" :model="form" label-width="80px">

      <el-form-item label="开始时间">
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

      <el-form-item label="结束时间">
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

      <el-form-item label="弹窗推送服务">
        <el-switch v-model="form.deliveryPush"></el-switch>
      </el-form-item>
      <el-form-item label="短信服务">
        <el-switch v-model="form.deliveryMessage"></el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        date1: '',
        date2: '',
        deliveryPush: false,
        deliveryMessage: false
      }
    }
  }
}
</script>

<style lang="scss">
  .push{
    padding: 20px;
    background: #F0F2F5;
    width: 100%;
    height: 100%;
  }
  .title {
   width: 100%;
   height: 50px;
   line-height: 50px;
   padding:  20px;
   font-family: MicrosoftYaHei;
   font-size: 22px;
   color: #333333;
   font-weight: 500;
   border-bottom: 1px solid #ccc;
   background: #FFF;
 }
.el-form {
  width: 100%;
  padding: 20px;
  background: #FFF;
}
</style>
