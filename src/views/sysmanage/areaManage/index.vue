<template>
  <div class="area" @click="watchClick">
    <div class="floatmsg">
      <div class="floatword">
        <input v-model="queryName" type="text" placeholder="请输入..." class="inputmsg" @keyup.enter.native="onSearch">
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
          <div v-for="(item,index) in local" :key="index" class="huapolice" >{{ item }}</div>
        </div>
        <div class="border"></div>
      </div>
      <div v-show="addressdata.police" class="address">
        <div class="leftborder"></div>
        <div class="addressmsg">
          <p class="msg msg1">
            <svg-icon icon-class="address" style="color: #1890FF"></svg-icon>
            {{ addressdata.police }}
          </p>
          <p class="msg msg2">
            {{ addressdata.address }}
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
import { getCountry, searchCountry } from '@/api/users'
const amapManager = new VueAMap.AMapManager()
export default {
  name: 'AreaManage',
  data() {
    return {
      data: [
        {
          id: '',
          icon: 'el-icon-remove-outline',
          label: '',
          children: [{
            id: '',
            icon: 'el-icon-remove-outline',
            label: '',
            children: [{
              id: '',
              icon: 'el-icon-house',
              label: ''
            }]
          }]
        }
      ],
      local: [],
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
        police: '玉泉派出所',
        address: '陕西省渭南市华阴市华山镇玉泉路8号'
      },
      markers: [],
      formInfo: [],
      queryName: ''
    }
  },
  created() {
    this.getCountryList()
  },
  mounted() {
    this.center = [110.112562, 34.572169]
    this.markers = [
      { position: [110.112562, 34.572169], content: `<svg class='markerImg' t="1599031324025" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="888" xmlns:xlink="http://www.w3.org/1999/xlink" width="40" height="40"><defs><style type="text/css"></style></defs><path d="M113.777778 387.470222C113.777778 601.457778 512 1024 512 1024s398.222222-422.542222 398.222222-636.529778S731.932444 0 512 0 113.777778 173.482667 113.777778 387.470222zM512 580.266667c-105.187556 0-190.464-84.053333-190.464-187.733334 0-103.68 85.276444-187.733333 190.464-187.733333 105.187556 0 190.464 84.053333 190.464 187.733333 0 103.68-85.276444 187.733333-190.464 187.733334z" p-id="889"></path><path d="M512 398.222222m-113.777778 0a113.777778 113.777778 0 1 0 227.555556 0 113.777778 113.777778 0 1 0-227.555556 0Z" p-id="890" title="华阴公安局"></path></svg>  ` }
    ]
  },
  methods: {
    // 节点点击事件
    handleNodeClick(data, node, obj) {
      if (node.level === 1) {
        this.local = []
        this.local.push(data.policeStation.name)
        this.addressdata.police = data.policeStation.name
        this.addressdata.address = data.policeStation.address
        this.center = [data.policeStation.longitude, data.policeStation.latitude]
        this.markers = [{ position: [data.policeStation.longitude, data.policeStation.latitude], content: `<svg class='markerImg' t="1599031324025" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="888" xmlns:xlink="http://www.w3.org/1999/xlink" width="40" height="40"><defs><style type="text/css"></style></defs><path d="M113.777778 387.470222C113.777778 601.457778 512 1024 512 1024s398.222222-422.542222 398.222222-636.529778S731.932444 0 512 0 113.777778 173.482667 113.777778 387.470222zM512 580.266667c-105.187556 0-190.464-84.053333-190.464-187.733334 0-103.68 85.276444-187.733333 190.464-187.733333 105.187556 0 190.464 84.053333 190.464 187.733333 0 103.68-85.276444 187.733333-190.464 187.733334z" p-id="889"></path><path d="M512 398.222222m-113.777778 0a113.777778 113.777778 0 1 0 227.555556 0 113.777778 113.777778 0 1 0-227.555556 0Z" p-id="890" title="${data.policeStation.name}"></path></svg>` }]
      }// else if(node.level === 2 ) {
      //   for (let index = 0; index < this.local.length; index++) {
      //     if (this.local[index] === data.policeStation.name) {
      //       return;
      //     }
      //   }
      //   this.local.push(data.policeStation.name)
      // }
    },
    // 模糊搜索事件 请求接口
    onSearch() {
      const query = {
        cascade: true,
        page: {
          index: 1,
          size: 10
        },
        params: [
          {
            field: 'name',
            operator: 'EQUALS',
            value: this.queryName.trim()
          }]
      }
      if (this.queryName.trim() !== '') {
        query.params.name = this.queryName
      }
      searchCountry(query).then(response => {
        if (response.code !== 0) return
        this.local = []
        this.local.push(response.body.data[0].policeStation.name)
        this.addressdata.police = response.body.data[0].policeStation.name
        this.addressdata.address = response.body.data[0].policeStation.address
        this.center = [response.body.data[0].policeStation.longitude, response.body.data[0].policeStation.latitude]
        this.markers = [{ position: [response.body.data[0].policeStation.longitude, response.body.data[0].policeStation.latitude], content: `<svg class='markerImg' t="1599031324025" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="888" xmlns:xlink="http://www.w3.org/1999/xlink" width="40" height="40"><defs><style type="text/css"></style></defs><path d="M113.777778 387.470222C113.777778 601.457778 512 1024 512 1024s398.222222-422.542222 398.222222-636.529778S731.932444 0 512 0 113.777778 173.482667 113.777778 387.470222zM512 580.266667c-105.187556 0-190.464-84.053333-190.464-187.733334 0-103.68 85.276444-187.733333 190.464-187.733333 105.187556 0 190.464 84.053333 190.464 187.733333 0 103.68-85.276444 187.733333-190.464 187.733334z" p-id="889"></path><path d="M512 398.222222m-113.777778 0a113.777778 113.777778 0 1 0 227.555556 0 113.777778 113.777778 0 1 0-227.555556 0Z" p-id="890" title="${response.body.data[0].policeStation.name}"></path></svg>` }]
      })
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
    },
    getCountryList() {
      const query = {
        cascade: true,
        params: {}
      }
      if (this.queryName.trim() !== '') {
        query.params.name = this.queryName
      }
      getCountry(query).then((res) => {
        if (res.code === 0) {
          this.data = this.formatCountry(res.body.data, 2)
        }
      })
    },
    formatCountry(arr, level) {
      return arr.map(item => {
        if (item.level < level) {
          return {
            icon: 'el-icon-remove-outline',
            label: item.name,
            id: item.id,
            children: this.formatCountry(item.children, level),
            policeStation: item.policeStation
          }
        } else {
          return {
            icon: 'el-icon-remove-outline',
            id: item.id,
            label: item.name,
            policeStation: item.policeStation
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .main-container {
    height: calc(100vh - 50px);
  }
  .area {
    height: calc(100vh - 50px);
    .floatmsg {
      position: absolute;
      left: 20px;
      top: 70px;
      overflow: hidden;
      z-index: 99;
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
          margin-right: 10px;
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
  .serachbox {
    height: 0px;
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
