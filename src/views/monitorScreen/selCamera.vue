<template>
  <el-dialog
    :title="id ? '修改监控摄像头' : '添加监控摄像头' "
    :visible.sync="visible"
    width="540px"
    class="sel-camera"
    @closed="handleClose"
  >
    <el-form ref="ruleForm" :model="form" :rules="rules">
      <el-form-item label="摄像头名称" prop="selValue" label-width="100px">
        <el-select
          :value="form.selValue"
          :remote-method="getList"
          :loading="selLoading"
          popper-class="sel-popover"
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
              :value="item.id"
            >
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
    // eslint-disable-next-line vue/require-default-prop
    id: [String, Number, Object],
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
    filter: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    curCamera: {
      type: Object,
      required: true,
      default: () => {
        return {
          id: '',
          name: ''
        }
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
    }
  },
  data() {
    return {
      form: {},
      allOption: [],
      selLoading: false,
      rules: {
        selValue: [
          { required: true, message: '请选择摄像头名称', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    options() {
      return this.allOption.map(item => {
        return {
          ...item,
          data: item.data.filter(node => {
            if (this.curCamera && node.id === this.curCamera.id) {
              return true
            }
            return !this.filter.find(cameraId => cameraId === node.id)
          })
        }
      }).filter(item => item.data && item.data.length > 0)
    }
  },
  watch: {
    curCamera() {
      console.log('curCamera change')
      this.form = {
        selValue: this.curCamera && this.curCamera.id
      }
    }
  },
  async created() {
    await this.getList()
  },
  methods: {
    selChange(item) {
      console.log(this.form.selValue)
      this.form = {
        selValue: item
      }
    },
    handleSubmit() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          let cameraName
          for (const item of this.allOption) {
            const find = item.data.find(({ id }) => id === this.form.selValue)
            if (find) {
              cameraName = find.name
              break
            }
          }
          console.log('cameraName', cameraName)
          this.onSubmit(this.form.selValue, cameraName, this.handleClose)
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.onClose()
      // this.$refs['ruleForm'].resetFields()
    },
    async getList(keywords) {
      this.selLoading = true
      const query = keywords ? {
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
        'params': [],
        sorts: [
          {
            field: 'create_time',
            type: 'desc'
          }
        ]
      }
      return getCameraTree(query).then(res => {
        if (res.code === 0) {
          this.allOption = res.body.data
            .filter(item => item.data && item.data.length > 0)
          this.selLoading = false
          return true
        }
        return false
      }).catch(err => {
        this.$message.error(err.message || '获取摄像头目录失败。')
        this.selLoading = false
        return false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sel-popover{
  .el-select-group .el-select-dropdown__item {
    padding-left: 35px;
  }
}
</style>
