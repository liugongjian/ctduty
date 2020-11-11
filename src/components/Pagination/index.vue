<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <div class="showTotal">{{alarmtext}}：{{ total }} 条</div>
    <!-- {{ tabsArr[tabsArr.length-1] }} to {{ tabsArr[0] }} 起止告警时间注释 -->
    <div class="kb" v-if="alarmtext === '当日告警总计'"> 告警总计: {{ allTotal }} 条</div>
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scrollTo'

export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    alarmtext: {
      type: String,
      default: '总计'
    },
    // tabsArr: [],
    allTotal: 0,
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
      // set(val) {
      //   console.log('eeeeee', this.total, this.limit, val)
      //   if (this.total/this.limit + 1  <= val) {
      //     val = 1
      //   }
      //   this.$emit('update:page', val)
      // }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style lang="scss">
.pagination-container {
  background: #fff;
  display: flex;
  .showTotal {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #666666;
    text-align: left;
    line-height: 32px;
  }
  .el-pagination {
    position: absolute;
    top: auto;
    right: 10px;
  }
}
.pagination-container.hidden {
  display: none;
}
.kb {
  font-family: PingFangSC-Regular;
  color: #666666;
  line-height: 32px;
  margin-left: 30px;
}
</style>