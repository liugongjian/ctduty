<template>
  <!-- :disabled="disabledTip" -->
  <el-tooltip
    ref="tlp"
    :content="text"
    :disabled="!tooltipFlag"
    :placement="placement"
    effect="dark"
    class="tooltip"
  >
    <span :class="className" @mouseenter="visibilityChange($event)">{{ text }}</span>
  </el-tooltip>
</template>

<script>
export default {
  name: 'EllipsisTooltip',
  props: {
    text: { type: String, default: '' }, // 字符内容
    placement: { type: String, default: 'top-start' },
    className: { type: String, default: 'text' } // class
  },
  data() {
    return {
      disabledTip: false,
      tooltipFlag: false
    }
  },
  methods: {
    // tooltip的可控
    visibilityChange(event) {
      const ev = event.target
      const ev_height = ev.offsetHeight // 文本的实际高度
      const content_height = this.$refs.tlp.$el.parentNode.clientHeight // 文本容器高度
      if (content_height < ev_height) {
        // 实际内容高度 > 文本高度 =》内容溢出
        this.tooltipFlag = true // NameIsIncludeWord ? true : !!false
      } else {
        // 否则为不溢出
        this.tooltipFlag = false
      }
    }
  }
}
</script>
 <style lang="scss">
 .tooltip-wrap {
    height: 16px; // 必须要有高度设置，因为tooltip的显示条件是通过高度来判断的
    display: inline-block;
    display: -webkit-box;
    -webkit-line-clamp: 1; // 因为通过高度所以只显示一行，溢出显示省略号
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;//英文数字折行
    span{
        line-height: 1.3;//这个行高看自定义样式文本高度
    }
 }
 </style>
