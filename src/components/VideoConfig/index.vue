<template>
  <div>
      <!-- <div v-for="(algorithm,index) in algorithmListOrigin"  :key="algorithm.id" >
           <div class="aiConfigBox">
                <div style="margin:10px;vertical-align:middle;">
                    <span><img src="../../assets/icon/normal.png" class="iconBox" /></span>
                    <span  style="font-weight:bold">{{algorithm.chinese}}</span>
                    <span style="margin-right:10px;vertical-align:middle;text-align: right;">
                        <el-checkbox v-model="algorithm.isPick" @change="checked=>checkboxchange(checked,algorithm)">
                            <span v-if="algorithm.isPick==false || algorithm.isPick==null">未选择</span>
                            <span v-else>已选择</span>
                        </el-checkbox>
                    </span>
                </div>
                <div style="margin: 20px 10px 20px 10px;">
                    {{algorithm.des}}
                </div>
                <div class="config-btn">
                        <el-button size="small" disabled v-show=" algorithm.isPick==true && algorithm.tagConfig==false">无需配置</el-button>
                        <el-button size="small" v-show="algorithm.isPick==true && algorithm.tagConfig==true && algorithm.isPickBefore==false">待配置</el-button> 
                        <el-button size="small" v-show="algorithm.isPick==true && algorithm.tagConfig==true && algorithm.isPickBefore==true">已配置,修改</el-button>
                </div>
            </div>

      </div> -->
      <div class="test">
          <div  class="config-box" v-for="(val,idx) in arr2" :key="idx">
              <div  class="aiConfigBox" v-for="(item,index) in val" :key="item.id">
                  <div style="margin:10px;vertical-align:middle;">
                    <span><img src="../../assets/icon/normal.png" class="iconBox" /></span>
                    <span  style="font-weight:bold">{{item.chinese}}</span>
                    <span style="margin-right:10px;vertical-align:middle;text-align: right;">
                        <el-checkbox v-model="item.isPick" @change="checked=>checkboxchange(checked,item)">
                            <span v-if="item.isPick==false || item.isPick==null">未选择</span>
                            <span v-else>已选择</span>
                        </el-checkbox>
                    </span>
                </div>
                <div style="margin: 20px 10px 20px 10px;">
                    {{item.des}}
                </div>
                <div class="config-btn">
                        <el-button size="small" disabled v-show=" item.isPick==true && item.tagConfig==false">无需配置</el-button>
                        <el-button size="small" v-show="item.isPick==true && item.tagConfig==true && item.isPickBefore==false">待配置</el-button> 
                        <el-button size="small" v-show="item.isPick==true && item.tagConfig==true && item.isPickBefore==true">已配置,修改</el-button>
                </div>
              </div>
                <div class="configchangebox" v-show="configwith">
                    12321321
                </div>
          </div>
      </div>
      <!-- <div class="aiConfigBox" >
          <div style="margin:10px;vertical-align:middle;">
              <span><img src="../../assets/icon/normal.png" class="iconBox" /></span>
              <span  style="margin-right:25px;font-weight: bold">人脸识别</span>
              <span style="margin-right:10px;vertical-align:middle;text-align: right;">
                  <el-checkbox v-model="checked">未选择</el-checkbox>
              </span>
          </div>
          <div style="margin: 20px 10px 20px 10px;">
              可识别人脸，对黑名单、白名单人员出现时，进行预警
          </div>
          <div style="text-align: right;margin-right: 10px;">
                <el-button size="small">无需配置</el-button>
          </div>
      </div> -->
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
export default {
    data() {
      return {
        pickwithnoconfig:false,
        arr2:[],
        algorithmList:[
            {
                "id": 1,
                "name": "carPersonCheck",
                "taskCnName": "车辆人员检测",
                "isPick": true
            },
            {
                "id": 2,
                "name": "faceRecognize",
                "taskCnName": "人脸识别",
                "isPick": false
            },
            {
                "id": 3,
                "name": "plateRecognize",
                "taskCnName": "车牌识别",
                "isPick": false
            }
        ],
        algorithmListOrigin:[
            {
                "id":1,
                "name": "carPersonCheck",
                "chinese": "值更检测",
                "des": "可识别人、机动车辆、非机动车辆",
                "tagConfig": false,
                "isPick": true
            },
            {
                "id":2,
                "name": "faceRecognize",
                "chinese": "人脸识别",
                "des": "可识别人脸",
                "tagConfig": false
            },
            {
                "id":3,
                "name": "plateRecognize",
                "chinese": "车牌识别",
                "des": "可识别车辆牌照，对黑名单、白名单车辆出现时，进行预警",
                "tagConfig": false
            },
            {

                "id":4,
                "name": "faceCompare",
                "chinese": "人脸比对",
                "des": "对黑名单、白名单人员出现时，进行预警",
                "tagConfig": false
            },
            {
                "id":5,
                "name": "faceAttribute",
                "chinese": "人脸属性",
                "des": "可识别性别、年龄以及表情",
                "tagConfig": false
            },
            {
                "id":6,
                "name": "areaAlarm",
                "chinese": "区域画线告警",
                "des": "通过在地图上圈定边界，发现有人入侵时进行预警",
                "tagConfig": true,
                "isPick": true
            },
            {
                "id":7,
                "name": "stepWallCheck",
                "chinese": "翻墙检测",
                "des": "通过在地图上圈定墙体及禁区,发现翻墙行为时进行预警",
                "tagConfig": true
            },
            {
                "id":8,
                "name": "peopleTraffic",
                "chinese": "人流识别",
                "des": "可识别人流,人流较大时进行预警",
                "tagConfig": true
            },
            {
                "id":9,
                "name": "plateTraffic",
                "chinese": "车流识别",
                "des": "可识别车流，人流较大时进行预警",
                "tagConfig": true
            },
            {
                "id":10,
                "name": "safetyHat",
                "chinese": "安全帽识别",
                "des": "可识别安全帽时，对未带安全帽者预警",
                "tagConfig": false
            },
            {
                "id":11,
                "name": "workingClothes",
                "chinese": "工服识别",
                "des": "可识别工服，对未穿工服者进行预警",
                "tagConfig":false
            }
        ]
      };
    },
    methods:{
       checkboxchange(bol,item){
           
           console.log("checkedstatus----->",bol,item)
        //    this.algorithmListOrigin=this.algorithmListOrigin.map(this.saveUpdatePick)
        this.configwith = bol
       },
       saveUpdatePick(item){
           console.log("增加一个之前的选择值",item)
           if(item.isPick){
               item['isPickBefore']=true
           }else{
               item['isPickBefore']=false
           }
           return item

       }

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
        console.log("xxxxx")
        this.algorithmListOrigin=this.algorithmListOrigin.map(this.saveUpdatePick)
        console.log("处理后的列表",this.algorithmListOrigin)

        this.arr2 = this.algorithmListOrigin.reduce((prev,next,idx)=>{
            const inner = prev[~~(idx/3)]
            if(inner !== undefined){
                inner.push(next)
            }else{
                prev.push([next])
            }
            return prev
        },[[]])

    },

};
</script>
<style lang="scss" scoped>
.config-box{
    display: flex;
    flex-wrap: wrap;
}
.aiConfigBox {
  width: 260px;
  height: 140px;
  border-style: solid;
  border-width:1px;
  border-color:#D3D3D3;
  display: inline-block;
  margin: 8px;
  position: relative;
    .config-btn{
        position: absolute;
        right: 5px;
        bottom: 5px;
    }
}
.iconBox{
    width:25px;
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
</style>
