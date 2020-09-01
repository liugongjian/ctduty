<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { myBrowser } from '@/utils'
export default{
  name: 'App',
  created() {
    if (myBrowser() !== 'Chrome') {
      this.$message('为了更好的体验效果，建议使用Chrome浏览器打开！')
    }
  }
}
</script>
<style lang="scss">
 #app {
   min-width: 1240px;
 }
</style>
