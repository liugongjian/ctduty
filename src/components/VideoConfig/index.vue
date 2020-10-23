<template>
  <div>
    <div class="test">
      <div class="config-box" v-for="(val, idx) in arr2" :key="idx">
        <div class="config-info">
          <div class="aiConfigBox" v-for="(item, index) in val" :key="item.id">
            <div style="margin: 10px; vertical-align: middle">
              <span>
                  <img :src="getImgUrl(item.cnName)" class="iconBox"/>
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
                  item.isConfigAreadly == false
                "
                @click="operateCanvas(item, idx)"
                >待配置</el-button
              >
              <el-button
                size="small"
                v-show="
                  item.isPick == true &&
                  item.isNeedConfig == true &&
                  item.isConfigAreadly == true
                "
                @click="operateCanvas(item, idx)"
                >已配置,修改</el-button
              >
            </div>
          </div>
        </div>
        <div class="configchangebox" v-show="currentNum == idx">
          <CanvasDraw></CanvasDraw>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import CanvasDraw from "@/components/CanvasDraw";
export default {
  components: {
    CanvasDraw,
  },
  data() {
    return {
      pickwithnoconfig: false,
      arr2: [],
      currentNum: null,
      algorithmListOrigin: [
        {
          id: 1,
          name: "carPersonCheck",
          cnName: "值更检测",
          description: "可识别人、机动车辆、非机动车辆",
          isNeedConfig: false,
          isPick: true,
        },
        {
          id: 2,
          name: "faceRecognize",
          cnName: "人脸识别",
          description: "可识别人脸",
          isNeedConfig: false,
          isPick: false,
        },
        {
          id: 3,
          name: "plateRecognize",
          cnName: "车牌识别",
          description: "可识别车辆牌照，对黑名单、白名单车辆出现时，进行预警",
          isNeedConfig: false,
          isPick: false,
        },
        {
          id: 4,
          name: "faceCompare",
          cnName: "人脸比对",
          description: "对黑名单、白名单人员出现时，进行预警",
          isNeedConfig: false,
          isPick: false,
        },
        {
          id: 5,
          name: "faceAttribute",
          cnName: "人脸属性",
          description: "可识别性别、年龄以及表情",
          isNeedConfig: false,
          isPick: false,
        },
        {
          id: 6,
          name: "areaAlarm",
          cnName: "区域画线告警",
          description: "通过在地图上圈定边界，发现有人入侵时进行预警",
          isNeedConfig: true,
          isPick: true,
        },
        {
          id: 7,
          name: "stepWallCheck",
          cnName: "翻墙检测",
          description: "通过在地图上圈定墙体及禁区,发现翻墙行为时进行预警",
          isNeedConfig: true,
          isPick: false,
        },
        {
          id: 8,
          name: "peopleTraffic",
          cnName: "人流识别",
          description: "可识别人流,人流较大时进行预警",
          isNeedConfig: true,
          isPick: false,
        },
        {
          id: 9,
          name: "plateTraffic",
          cnName: "车流识别",
          description: "可识别车流，人流较大时进行预警",
          isNeedConfig: true,
          isPick: false,
        },
        {
          id: 10,
          name: "safetyHat",
          cnName: "安全帽识别",
          description: "可识别安全帽时，对未带安全帽者预警",
          isNeedConfig: false,
          isPick: false,
        },
        {
          id: 11,
          name: "workingClothes",
          cnName: "工服识别",
          description: "可识别工服，对未穿工服者进行预警",
          isNeedConfig: false,
          isPick: false,
        },
      ],
    };
  },
  methods: {
    getImgUrl(name){
        return require("../../assets/icon/"+name+".png")
    },
    checkboxchange(bol, item, index, idx) {
      console.log("checkedstatus----->", bol, item, index, idx);
      //    this.algorithmListOrigin=this.algorithmListOrigin.map(this.saveUpdatePick)
      //    this.configwith = bol
    },
    saveUpdatePick(item) {
      console.log("增加一个字段表示是否已经配置", item);
      if (item.isPick) {
        item["isConfigAreadly"] = true;
      } else {
        item["isConfigAreadly"] = false;
      }
      return item;
    },
    operateCanvas(item, idx) {
      console.log("进入到这个方法进行操作画布", item, idx);
      console.log("第一步根据设备id获取截图");
      console.log("获取之前的配置");
      this.currentNum = idx;
    },
  },
  created() {
    //页面没有渲染之前
    //第一步调用后端接口获取已经选择的算法列表this.algorithmList
    // for(var i=0;i<this.algorithmListOrigin.length;i++){
    //     var eachAlgo=this.algorithmListOrigin[i]
    //     console.log("xxxxxx",eachAlgo)
    //     var filterItems=this.algorithmList.filter(item=>item.name==eachAlgo.name)
    //     if(filterItems.length>0 && filterItems[0].isPick){//选择了这个算法
    //         eachAlgo['isPick']=true
    //     }
    // }
    // // ajax.then(res => this.algorithmListOrigin = res.)
    // console.log("处理后的列表",this.algorithmListOrigin)
    //保存之前的选择
    console.log("xxxxx");
    this.algorithmListOrigin = this.algorithmListOrigin.map(
      this.saveUpdatePick
    );
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
