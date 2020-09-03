<template>
  <div>
    <div v-if="showChild === 'map'">
      <cameraMap @getdata="getdata"></cameraMap>
    </div>
    <div v-else-if="showChild === 'list'">
      <cameraList @getdata="getdata"></cameraList>
    </div>
  </div>
</template>

<script>
import cameraMap from './map.vue'
import cameraList from './list.vue'
export default {
  components: { cameraMap, cameraList },
  data() {
    return {
      showChild: 'map'
    }
  },
  methods: {
    getdata(v) {
      this.showChild = v
    }
  }
}
</script>

<style>
#mapcontainer {
  height: 100vh;
}
.amap-maps {
  height: 100vh;
}
</style>
