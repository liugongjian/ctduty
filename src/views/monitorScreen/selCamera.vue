<template>
  <el-dialog
    :title="id ? '修改监控摄像头' : '添加监控摄像头' "
    :visible.sync="visible"
    width="540px"
    @closed="handleClose"
  >
    <el-form ref="ruleForm" :model="form" :rules="rules">
      <el-form-item label="摄像头名称" prop="changeName" label-width="100px">
        <el-select
          v-model="form.changeName"
          :remote-method="getList"
          :loading="selLoading"
          filterable
          remote
          placeholder="请选择"
          @change="selChange"
        >
          <el-option-group
            v-for="(group, idx) in options"
            :v-if="group.data&& group.data.length"
            :key="idx"
            :label="group.name">
            <el-option
              v-for="item in group.data"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              {{ item.name }}
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button :loading="submitLoading" type="warning" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getCameraTree
} from '@/api/algorithm'
export default {
  props: {
    selChange: {
      type: Function,
      required: true,
      default: () => {
      }
    },
    onClose: {
      type: Function,
      required: true,
      default: () => {
      }
    },
    onSubmit: {
      type: Function,
      required: true,
      default: () => {
      }
    },
    form: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    submitLoading: {
      type: Boolean,
      required: true,
      default: false
    },
    selLoading: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      options: [],
      rules: {
        changeName: [
          { required: true, message: '请选择摄像头名称', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // selChange(value) {
    //   console.log('change', value)
    // },
    handleSubmit() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.onSubmit(this.handleClose)
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.$refs['ruleForm'].resetFields()
      this.onClose
    },
    getList(keywords) {
      const query = keywords ? {
        // 'page': {
        // 'index': this.page,
        // 'size': this.limit
        // },
        'params': [
          {
            'field': 'name',
            'operator': 'LIKE',
            'value': `%${keywords}%`

          }],
        sorts: [
          {
            field: 'create_time',
            type: 'desc'
          }
        ]
      } : {
        // 'page': {
        //   'index': this.page,
        //   'size': this.limit
        // },
        'params': [],
        sorts: [
          {
            field: 'create_time',
            type: 'desc'
          }
        ]
      }
      getCameraTree(query).then(res => {
        if (res.code === 0) {
          this.options = res.body.data.filter(item => item.data && item.data.length > 0)
          // res.body.data.map(item => {
          //   return {
          //     label: item.name,
          //     children: item.data.map(val => {
          //       return {
          //         label: val.name,
          //         info: val,
          //         ifChild: true // 用来判断是否是子级
          //       }
          //     })
          //   }
          // })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
