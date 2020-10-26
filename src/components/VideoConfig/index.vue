<template>
  <div>
    <div class="test" v-if="canvasVisable==false">
      <div class="config-box" v-for="(val, idx) in arr2" :key="idx">
        <div class="config-info">
          <div class="aiConfigBox" v-for="(item, index) in val" :key="item.id">
            <div style="margin: 10px; vertical-align: middle">
              <span>
                <img :src="getImgUrl(item.name)" class="iconBox" />
              </span>
              <span style="font-weight: bold">{{ item.cnName }}</span>
              <span
                style="
                  margin-right: 10px;
                  vertical-align: middle;
                  text-align: right;
                "
              >
                <el-checkbox
                  v-model="item.isPick"
                  @change="
                    (checked) => checkboxchange(checked, item, index, idx)
                  "
                >
                  <span v-if="item.isPick == false || item.isPick == null"
                    >未选择</span
                  >
                  <span v-else>已选择</span>
                </el-checkbox>
              </span>
            </div>
            <div style="margin: 20px 10px 20px 10px">
              {{ item.description }}
            </div>
            <div class="config-btn">
              <el-button
                size="small"
                disabled
                v-show="item.isPick == true && item.isNeedConfig == false"
                >无需配置</el-button
              >
              <el-button
                size="small"
                v-show="
                  item.isPick == true &&
                  item.isNeedConfig == true &&
                  item.isConfigAlready == false
                "
                @click="operateCanvas(item, idx)"
                >待配置</el-button
              >
              <el-button
                size="small"
                v-show="
                  item.isPick == true &&
                  item.isNeedConfig == true &&
                  item.isConfigAlready == true
                "
                @click="operateCanvas(item, idx)"
                >已配置,修改</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="configchangebox" v-if="canvasVisable">
      <CanvasDraw :currentPickDeviceId='deviceId' :currentPickAlgorithm='currentItem' @saveAlgorithm="closeCanvas"></CanvasDraw>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import CanvasDraw from "@/components/CanvasDraw";
import client from "@/api/vedioAlgo";
import {getInstanceList} from '@/api/vedioAlgoNew'
import store from '@/store'
export default {
  components: {
    CanvasDraw,
  },
  props:["deviceId","arr2"],
  data() {
    return {
      currentItem:null,
      // arr2: [],
      timer:'',
      currentNum: null,
      currentId: null,
      algorithmListOrigin: [],
      algorithmListOriginCopy:[], //保存原始的一份数据(一直不变)
      canvasVisable:false
    };
  },
  methods: {
    canvasCloseDialog(){
      this.canvasVisable=false
    },
    getImgUrl(name) {
      return require("../../assets/icon/" + name + ".png");
    },
    checkboxchange(bol, item, index, idx) {
      console.log("checkedstatus----->", bol, item, index, idx);
      console.log("修改之后的数据",item.beforePickStatus,bol)
      item.beforePickStatus = bol

      //刚开始选择后来不选择,由true->false的转变
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
      console.log("增加一个字段表示是否已经配置", item);
      if (item.isPick) {
        item["isConfigAlready"] = true;
        item["beforePickStatus"]= true;
        item["isCommitStatus"]= true;
      } else {
        item["isConfigAlready"] = false;
        item["beforePickStatus"]= false;
        item["isCommitStatus"]= false;
      }
      return item;
    },
    operateCanvas(item, idx) {
      console.log("进入到这个方法进行操作画布", item, idx);
      console.log("第一步根据设备id获取截图");
      console.log("获取之前的配置");
      this.currentItem=item
      this.currentNum = idx
      this.currentId=item.id
      this.timer=new Date().getTime()
      console.log("xxxavcdddd",this.currentItem,this.currentId)
      this.canvasVisable=true
      this.$emit('canvasShow',true);
    },
    async getAlgorithmHistoryAreas(item){
      let {body: res} = await client.getHisInstAreas(item.id)
      console.log("xxxxxxxxx调用接口获取的历史坐标接口xxxxx",res.data)
      return res.data
    },
    closeCanvas(){
        // console.log("监听到子组件发布的saveAlgorithm事件")
        // this.currentNum = -1
        // console.log("操作之后的数据内容",this.algorithmListOrigin)
        this.canvasVisable=false
        this.$emit('canvasShow',false);

    },
    async getAlgorithmList(deviceId){
      let {body: res} = await client.getInstanceList(deviceId)
      console.log("ssssss-----",res.data)
      this.algorithmListOrigin=res.data
      this.algorithmListOriginCopy=JSON.parse(JSON.stringify(this.algorithmListOrigin))
      console.log("赋值acvvv-------------",this.algorithmListOrigin)
      this.algorithmListOrigin = this.algorithmListOrigin.map(this.saveUpdatePick);
      this.arr2=this.changeToTwoDiArray(this.algorithmListOrigin,3)
    },

    getAlgorithmListNew(){
        getInstanceList().then(res => {
            if (res.code === 0) {
                this.algorithmListOrigin = res.body.data
                console.log("赋值-------------",this.algorithmListOrigin)
                this.algorithmListOrigin = this.algorithmListOrigin.map(this.saveUpdatePick);
                console.log("处理后的列表", this.algorithmListOrigin);
                this.arr2 = this.algorithmListOrigin.reduce(
                (prev, next, idx) => {
                    const inner = prev[~~(idx / 3)];
                    if (inner !== undefined) {
                    inner.push(next);
                    } else {
                    prev.push([next]);
                    }
                    return prev;
                },
                [[]]
                );
            }
        })
    },
    changeToTwoDiArray(dataList,num){
        return dataList.reduce(
                    (prev, next, idx) => {
                        const inner = prev[~~(idx / num)];
                        if (inner !== undefined) {
                        inner.push(next);
                        } else {
                        prev.push([next]);
                        }
                        return prev;
                    },
                    [[]]
                );
    }


  },
  created() {
    console.log("xxxxx从父组件传过来的值",this.deviceId,this.arr2);
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
};
</script>
<style lang="scss" scoped>
.config-info {
  display: flex;
  flex-wrap: wrap;
}
.configchangebox {
  border-style: solid;
  border-width: 1px;
  width: 800px;
  margin: 10px 14px;
}
.aiConfigBox {
  width: 260px;
  height: 140px;
  border-style: solid;
  border-width: 1px;
  border-color: #d3d3d3;
  //   display: inline-block;
  margin: 8px;
  position: relative;
  .config-btn {
    position: absolute;
    right: 5px;
    bottom: 5px;
  }
}

.iconBox {
  width: 25px;
  height: 25px;
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
