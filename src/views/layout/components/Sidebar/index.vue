<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :default-openeds="openeds"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
      <div class="logo-con">
        <!-- <img v-show="!isCollapse" key="max-logo" :src="maxLogo" @click="toHome">
        <img v-show="isCollapse" key="min-logo" :src="minLogo" >-->
        <img v-show="!isCollapse" key="max-logo" :src="maxLogo" class="max-logo" @click="toHome" >
        <img v-show="isCollapse" key="min-logo" :src="minLogo" class="min-logo" >
      </div>
      <sidebar-item
        v-for="route in permission_routers"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import store from '@/store'
import minLogo from '@/assets/images/logo-minnew.png'
import maxLogo from '@/assets/images/logo-max.png'

export default {
  components: { SidebarItem },
  data() {
    return {
      minLogo,
      maxLogo,
      openeds: ['/sysMonitor', '/sysmanage']
    }
  },
  computed: {
    ...mapGetters(['permission_routers', 'sidebar']),
    isCollapse() {
      return !this.sidebar.opened
    }
  },

  methods: {
    // toggleSideBar() {
    //   this.$store.dispatch('toggleSideBar')
    // }
    toHome() {
      this.$nextTick(() => {
        this.$router.push({
          path: store.getters.level === 2 ? '/ecloudwatch' : '/'
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.logo-con {
  height: 60px !important;
  padding: 15px 10px;
  margin-right: 5px;
  .max-logo {
    width: 94px;
    height: 30.4px;
    display: block;
    margin: 0 auto;
  }
  .min-logo {
    width: 30px;
    height: 32px !important;
    display: block;
    margin: auto;
  }
}
.header-con {
  background: #fff;
  padding: 0 20px;
  width: 100%;
}
.main-layout-con {
  height: 100%;
  overflow: hidden;
}
.el-menu--collapse {
  .logo-con {
    height: 44px;
    img {
      height: 16px;
    }
  }
}
#app .sidebar-container .el-menu,
.el-menu--vertical .el-menu {
  background-color: #001940 !important;
}
</style>
