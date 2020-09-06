<template>
  <div class="area" style="height: 100%" @click="watchClick">
    <div class="floatmsg">
      <div class="floatword">
        <input type="text" placeholder="请输入..." class="inputmsg" @keyup.enter.native="onSearch">
        <button class="btnmsg" @click="onSearch">{{ $t('navbar.search') }}</button>
      </div>
      <div class="floatsearch">
        <div class="floatsearch-tree">
          <el-tree
            v-if="openOrNot"
            :data="data"
            :indent="indent"
            node-key="id"
            accordion
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>
                <i :class="[data.icon]"></i>{{ node.label }}
              </span>
            </span>
          </el-tree>
        </div>
        <div class="local">
          <div v-for="(item, index) in local" :key="index" class="huapolice" >{{ item }}</div>
        </div>
        <div class="border"></div>
      </div>
      <div class="address">
        <div class="leftborder"></div>
        <div class="addressmsg" :model="addressdata" v-if="addressdata.mengpolice">
          <p class="msg msg1">
            <svg-icon icon-class="address" style="color: #1890FF"></svg-icon>
            孟塬镇派出所
          </p>
          <p class="msg msg2">
            陕西省渭南市华阴市孟塬镇孟塬大酒店西南150米
          </p>
        </div>
        <div class="addressmsg" :model="addressdata" v-else-if="addressdata.huapolice">
          <p class="msg msg1">
            <svg-icon icon-class="address" style="color: #1890FF"></svg-icon>
            华阴市公安支队
          </p>
          <p class="msg msg2">
            陕西省渭南市华阴市华岳东路岳庙中学向东300米左右
          </p>
        </div>
        <div class="addressmsg" :model="addressdata" v-else-if="addressdata.mountainpolice">
          <p class="msg msg1">
            <svg-icon icon-class="address" style="color: #1890FF"></svg-icon>
            华山镇派出所
          </p>
          <p class="msg msg2">
            玉泉路与金勃路交叉口西北150米
          </p>
        </div>
        <div class="addressimg">
          <img src="../../../assets/images/police.jpg" alt="">
        </div>
      </div>
    </div>
    <div class="map" style="width: 100%; height:100%;">
      <el-amap
        :amap-manager="amapManager"
        :center="center"
        :events="events"
        :zoom="zoom"
        class="amap-demo"
        vid="amapDemo"
        style="height: 100%"
      >
        <el-amap-marker v-for="(marker, index) in markers" :events="events" :id="'point'+index" :key="index" :position="marker.position" :vid="index" :content="marker.content" @click="markerClick"></el-amap-marker>
      </el-amap>
    </div>
  </div>
</template>

<script>
import VueAMap from 'vue-amap'
const amapManager = new VueAMap.AMapManager()
export default {
  name: 'AreaManage',
  data() {
    return {
      data: [
        {
          id: 1,
          icon: 'el-icon-remove-outline',
          label: '华阴市',
          children: [{
            id: 2,
            icon: 'el-icon-remove-outline',
            label: '孟塬镇',
            children: [{
              id: 3,
              icon: 'el-icon-house',
              label: '小寨村'
            }, {
              id: 4,
              icon: 'el-icon-house',
              label: '宋峪村'
            }, {
              id: 5,
              icon: 'el-icon-house',
              label: '晓棚村'
            }, {
              id: 6,
              icon: 'el-icon-house',
              label: '三义村'
            }, {
              id: 7,
              icon: 'el-icon-house',
              label: '大寨北城'
            }, {
              id: 8,
              icon: 'el-icon-house',
              label: '彭家村'
            }]
          }, {
            id: 8,
            icon: 'el-icon-remove-outline',
            label: '华山镇',
            children: [{
              id: 9,
              icon: 'el-icon-house',
              label: '高家村'
            }]
          }]
        }
      ],
      local: [
        '华阴公安支队'
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      openOrNot: true,
      indent: 40,
      // 地图数据
      zoom: 12,
      center: [110.09, 34.58],
      dialogVisable: false,
      amapManager,
      events: {
        click: a => {
          console.log(a)
        }
      },
      addressdata: {
        huapolice: true,
        mengpolice: false,
        mountainpolice: false
      },
      markers: [],
      formInfo: [],

    }
  },
  mounted() {
    this.markers = [
      { position: [110.112562, 34.572169], content: `<img class='markerImg' src="https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png" style="width: 19px; height: 33px; top: 0px; left: 0px;" title="华阴市公安支队">` }
    ]
  },
  methods: {
    // 节点点击事件
    handleNodeClick(data, node, obj) {
      console.log(node)
      if (node.level === 2 && data.label === '孟塬镇') {
        this.local = []
        this.local.push('孟塬镇派出所')
        this.addressdata.mengpolice = true
        this.addressdata.mountainpolice = false
        this.addressdata.huapolice = false
        this.markers = [{position: [110.147774, 34.558654], content: `<img class='markerImg' src="https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png" style="width: 19px; height: 33px; top: 0px; left: 0px;" title="孟塬镇派出所">` }]
      } else if (node.level === 2 && data.label === '华山镇') {
        this.local = []
        this.local.push('华山镇派出所')
        this.addressdata.mountainpolice = true
        this.addressdata.huapolice = false
        this.addressdata.mengpolice = false
        this.markers = [{position: [110.0877, 34.534504], content: `<img class='markerImg' src="https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png" style="width: 19px; height: 33px; top: 0px; left: 0px;" title="华山镇派出所">` }]
      } else if (node.level === 1 && !node.expanded) {
        this.openOrNot = false
        this.local = []
        this.local.push('华阴公安支队')
        this.addressdata.huapolice = true
        this.addressdata.mengpolice = false
        this.addressdata.mountainpolice = false
        this.markers = [{ position: [110.112562, 34.572169], content: `<img class='markerImg' src="https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png" style="width: 19px; height: 33px; top: 0px; left: 0px;">` }]
        setTimeout(() => {
          this.openOrNot = true
        })
        clearTimeout()
      }
    },
    // 模糊搜索事件 请求接口
    onSearch() {
      this.page = 1
      if (this.formInline.searchkey.trim().length === 0) {
        this.$message({
          message: '请输入非空字符进行搜索！',
          type: 'warning'
        })
        return false
      } else {
        this.formInline.searchkey = this.formInline.searchkey.trim()
        this.getList()
      }
    },
    watchClick(e) {
      e.path.forEach(item => {
        if (item.className === 'markerImg') {
          this.form = JSON.parse(item.attributes[1].nodeValue)
          this.showZwMes = false
        }
      })
    },
    markerClick() {
      console.log('哈哈哈')
    }
  }

}
</script>

<style  lang="scss">
  .main-container {
    height: 100%;
  }
  .app-main {
    height: 100%;
  }
  .area {
    .floatmsg {
      position: absolute;
      left: 20px;
      top: 70px;
      overflow: hidden;
      z-index: 9999;
      .floatword {
        background-color: #fff;
        .inputmsg {
          width: 300px;
          height: 40px;
          padding: 0 10px;
          background: #FFFFFF;
          border: 1px solid #D9D9D9;
          border-radius: 4px 0px 0px 4px;
          outline-color: #D9D9D9;
        }
        .btnmsg {
          width: 70px;
          height: 40px;
          margin-left: -6px;
          border: 1px solid #FF9832;
          color: #FFF;
          background: #FF9832;
          border-radius: 0 4px 4px 0;
          outline:none;
        }
      }
      .floatsearch {
        width: 368px;
        height: 100%;
        padding: 20px 20px;
        background-color: #fff;
        margin-top: 20px;
        position: relative;
        display: flex;
        border-radius: 4px 4px 0px 0px;
        .floatsearch-tree {
          flex: 2;
        }
        .el-tree-node__expand-icon {
          display: none;
        }
        .huapolice {
          width: 100%;
          line-height: 32px;
          text-align: center;
          font-size: 14px;
          padding-left: 5px;
        }
        .mengpolice {
          position: absolute;
          top: 42px;
          right: 30px;
          color: #606266;
          font-size: 14px;
        }
        .mountainpolice {
          position: absolute;
          top: 268px;
          right: 30px;
          color: #606266;
          font-size: 14px;
        }
      }
      .border {
        width: 320px;
        height: 1px;
        position: absolute;
        bottom: 0;
        background-color: #E9E9E9;
      }
      .address {
        width: 368px;
        height: 100px;
        background-color: #fff;
        display: flex;
        padding: 20px 20px;
        border-radius: 0px 0px 4px 4px;
        .leftborder {
          width: 2px;
          height: 60px;
          background-color: #C9C9C9 ;
        }
        .addressmsg {
          width: 248px;
          height: 60px;
          margin-left: 20px;
          .msg {
            margin: 0;
            padding: 0;
            font-size: 14px;
          }
          .msg1 {
            font-weight: 500;
          }
          .msg2 {
            margin-top: 8px;
            color: rgba(0,0,0,0.45);
            line-height: 22px;
          }
        }
      }
      .addressimg {
        width: 100px;
        height: 60px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .el-icon-remove-outline,.el-icon-house {
    margin-right: 10px;
  }
  .el-tree-node__content {
    height: 32px;
  }
  .custom-tree-node {
    font-size: 14px;
  }

</style>
