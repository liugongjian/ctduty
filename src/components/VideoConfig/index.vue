<template>
  <div>
    <div class="test configBox">
      <div class="config-info">
        <div v-for="(item, index) in arr2" :key="item.id" class="config-box">
          <div class="aiConfigBox">
            <div>
              <el-checkbox
                v-model="item.isPick"
                @change="
                  (checked) => checkboxchange(checked, item, index)
                "
              >
                <span class="configName configGlobal">{{ item.cnName }}</span>
              </el-checkbox>
              <span class="configImg  configGlobal">
                <el-image :src="getImgUrl(item.name)" class="iconBox" ></el-image>
              </span>
              <span class="configDesc configGlobal">
                {{ item.description }}
              </span>
              <span class="config-btn">
                <el-button
                  v-show="item.isPick == true && item.isNeedConfig == false"
                  size="small"
                  class="changeBtn"
                  disabled
                >无需配置</el-button
                >
                <el-button
                  v-show="
                    item.isPick == true &&
                      item.isNeedConfig == true &&
                      item.isConfigAlready == false
                  "
                  size="small"
                  class="hasChange changeBtn"
                  @click="operateCanvas(item)"
                >待配置</el-button
                >
                <el-button
                  v-show="
                    item.isPick == true &&
                      item.isNeedConfig == true &&
                      item.isConfigAlready == true
                  "
                  size="small"
                  class="hasChange changeBtn"
                  @click="operateCanvas(item)"
                >修改</el-button
                >
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div v-if="canvasVisable" class="configchangebox">
      <CanvasDraw
        :if-show="canvasVisable"
        :current-pick-device-id="deviceId"
        :current-pick-algorithm="currentItem"
        @saveAlgorithm="closeCanvas"
        @cancelAlgorithm="cancelThis"
        @sureSave="saveThis"></CanvasDraw>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import CanvasDraw from '@/components/CanvasDraw'
import client from '@/api/vedioAlgo'
import { getInstanceList } from '@/api/vedioAlgoNew'
import store from '@/store'
export default {
  components: {
    CanvasDraw
  },
  props: ['deviceId', 'arr2'],
  data() {
    return {
      currentItem: null,
      // arr2: [],
      timer: '',
      currentNum: null,
      currentId: null,
      algorithmListOrigin: [],
      algorithmListOriginCopy: [], // 保存原始的一份数据(一直不变)
      canvasVisable: false
    }
  },
  created() {
    // this.algorithmListOrigin = this.getAlgorithmList(this.deviceId)
    // await this.getAlgorithmListNew()
    // this.algorithmListOrigin = this.algorithmListOrigin.map(
    //   this.saveUpdatePick
    // );
    // console.log("处理后的列表", this.algorithmListOrigin);

    // this.arr2 = this.algorithmListOrigin.reduce(
    //   (prev, next, idx) => {
    //     const inner = prev[~~(idx / 3)];
    //     if (inner !== undefined) {
    //       inner.push(next);
    //     } else {
    //       prev.push([next]);
    //     }
    //     return prev;
    //   },
    //   [[]]
    // );
  },
  methods: {
    canvasCloseDialog() {
      this.canvasVisable = false
    },

    getImgUrl(name) {
      const arr = [
        'carPersonCheck', 'faceRecognize', 'plateRecognize', 'areaAlarm', 'stepWallCheck', 'peopleTraffic', 'plateTraffic', 'safetyHat',
        'workingClothes', 'carTypeDetect', 'peopleCrowd', 'fightDetect', 'fallDownDetect', 'roadsideStall', 'wanderTarry'
      ]
      if (arr.indexOf(name) > -1) {
        return require('../../assets/icon/algorithmIcons/' + name + '.png')
      }
      return require('../../assets/icon/algorithmIcons/default.png')
    },
    checkboxchange(bol, item, index) {
      item.beforePickStatus = bol
      if (item.isPick === true && item.isNeedConfig === true && item.isConfigAlready === false) {
        this.operateCanvas(item)
      } else if (item.isPick === true && item.isNeedConfig === false) {
        this.$emit('sureAlgorithm', true)
      } else if (item.isPick === false) {
        this.$emit('sureAlgorithm', true)
      }
      // 刚开始选择后来不选择,由true->false的转变
    //   if(item.isConfigAlready && !bol ){
    //       console.log("xxxxsdcf",store)
    //       store.state.algorithmInfo.deletedAlgorithm.push({
    //           "action":"delete",
    //           "taskName":item.name
    //       })
    //       console.log("xxxxxsjifxxxxx",store.state.algorithmInfo.deletedAlgorithm)
    //   }
    //    console.log("xxxxxsjifxxffffxxx",store.state.algorithmInfo.deletedAlgorithm)
      //    this.algorithmListOrigin=this.algorithmListOrigin.map(this.saveUpdatePick)
      //    this.configwith = bol
    },
    saveUpdatePick(item) {
      if (item.isPick) {
        item['isConfigAlready'] = true
        item['beforePickStatus'] = true
        item['isCommitStatus'] = true
      } else {
        item['isConfigAlready'] = false
        item['beforePickStatus'] = false
        item['isCommitStatus'] = false
      }
      return item
    },
    operateCanvas(item) {
      this.currentItem = item
      // this.currentNum = idx
      this.currentId = item.id
      this.timer = new Date().getTime()
      this.canvasVisable = true
      this.$emit('canvasShow', true)
    },
    async getAlgorithmHistoryAreas(item) {
      const { body: res } = await client.getHisInstAreas(item.id)
      return res.data
    },
    closeCanvas() {
      // console.log("监听到子组件发布的saveAlgorithm事件")
      // this.currentNum = -1
      // console.log("操作之后的数据内容",this.algorithmListOrigin)
      this.canvasVisable = false
      this.$emit('canvasShow', false)
    },
    cancelThis() {
      this.currentItem.isPick = false
      this.currentItem.beforePickStatus = false
      this.$emit('sureAlgorithm', true)
    },
    saveThis() {
      this.$emit('sureAlgorithm', true)
    },
    async getAlgorithmList(deviceId) {
      const { body: res } = await client.getInstanceList(deviceId)
      this.algorithmListOrigin = res.data
      this.algorithmListOriginCopy = JSON.parse(JSON.stringify(this.algorithmListOrigin))
      this.algorithmListOrigin = this.algorithmListOrigin.map(this.saveUpdatePick)
      this.arr2 = this.changeToTwoDiArray(this.algorithmListOrigin, 3)
    },

    getAlgorithmListNew() {
      getInstanceList().then(res => {
        if (res.code === 0) {
          this.algorithmListOrigin = res.body.data
          this.algorithmListOrigin = this.algorithmListOrigin.map(this.saveUpdatePick)
          this.arr2 = this.algorithmListOrigin.reduce(
            (prev, next, idx) => {
              const inner = prev[~~(idx / 3)]
              if (inner !== undefined) {
                inner.push(next)
              } else {
                prev.push([next])
              }
              return prev
            },
            [[]]
          )
        }
      })
    },
    changeToTwoDiArray(dataList, num) {
      return dataList.reduce(
        (prev, next, idx) => {
          const inner = prev[~~(idx / num)]
          if (inner !== undefined) {
            inner.push(next)
          } else {
            prev.push([next])
          }
          return prev
        },
        [[]]
      )
    }

  }
}
</script>
<style lang="scss" scoped>

.configBox{
  border: 1px solid #e9e9e9;
}
.config-box {
  // flex:1;
  border-bottom: 1px solid #e9e9e9;
  &:last-child{
    border-bottom: none;
  }
}
.configchangebox{
  /deep/.el-dialog{
    width: 730px;
  }
  /deep/.el-dialog .el-dialog__body{
    padding: 5px 5px 20px;
  }
}
.aiConfigBox {
  height: 50px;
  line-height: 50px;
  padding-left: 20px;
  position: relative;
  .configGlobal{
    display: inline-block;
  }
  .configName{
    width: 100px;
    // margin: 0 20px 0 10px;
    font-weight: bold;
  }
  .configDesc{
    color: #666666;
    margin-left: 10px;
  }
  .config-btn {
    position: absolute;
    right: 14px;
    .changeBtn{
      width: 66px;
      text-align: center;
      border-radius: 5px;
    }
    .hasChange{
      border: 1px solid #FF9832;
      color: #FF9832;
    }
  }
  /deep/.el-checkbox{
    &:last-of-type{
      margin:0 20px 0 10px
    }
  }
}

.iconBox {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 13px;
}
.iconStyle {
  widows: 20px;
  height: 20px;
}
/deep/.el-button--small {
  padding: 5px 8px;
}
// /deep/ *, *:after,*:before{
//     box-sizing: border-box !important;
// }
</style>
