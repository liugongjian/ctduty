<template>
  <div v-show="isShowMain" :class="classObj">
    <div class="main-container">
      <!-- <tags-view/> -->
      <app-main/>
      <!-- <Footer style=" background: #ffffff; color: #999999"></Footer> -->
    </div>
  </div>
</template>

<script>
import { AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
// import PwdChangeCheck from './mixin/PwdChangeCheck'
import Footer from '../footer/index'

export default {
  name: 'Layout',
  components: {
    AppMain,
    TagsView,
    Footer
  },
  // mixins: [ResizeMixin, PwdChangeCheck],
  mixins: [ResizeMixin],
  data() {
    return {
      isShowMain: false
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
    document.getElementsByClassName('main-container')[1].style.marginLeft = '0px'
    document.getElementsByClassName('app-main')[1].style.paddingTop = '0px'
    this.isShowMain = true
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>
