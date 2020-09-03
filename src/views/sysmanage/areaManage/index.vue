<template>
  <div class="area">
    <div class="floatmsg">
      <div class="floatword">
        <input type="text" placeholder="请输入..." class="inputmsg" @keyup.enter.native="onSearch">
        <button class="btnmsg" @click="onSearch">{{ $t('navbar.search') }}</button>
      </div>
      <div class="floatsearch">
        <p class="huapolice">华阴公安支队</p>
        <p class="mengpolice">孟塬镇派出所</p>
        <p class="mountainpolice">华山镇派出所</p>
        <el-tree
          :data="data"
          :indent='40'
          node-key="id"
          default-expand-all
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
              <i :class="[data.icon]"></i>{{ node.label }}
            </span>       
          </span>
        </el-tree>
      </div>
      <div class="border"></div>
      <div class="address">
        <div class="leftborder"></div>
        <div class="addressmsg">
          <p class="msg msg1">
            <svg-icon icon-class="address" style="color: #1890FF"></svg-icon>
            孟源派出所公安局
          </p>
          <p class="msg msg2">
            陕西省渭南市华阴市孟塬镇孟塬大酒店西南150米
          </p>
        </div>
        <div class="addressimg"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'areaManage',
  data() {
    return {
      data: [
        {
          id: 1,
          icon:'el-icon-remove-outline',
          label: '华阴市',
          children: [{
            id: 2,
            icon:'el-icon-remove-outline',
            label: '孟塬镇',
            children: [{
              id:3,
              icon: 'el-icon-house',
              label: '小寨村' 
            },{
              id:4,
              icon: 'el-icon-house',
              label: '宋峪村'
            },{
              id:5,
              icon: 'el-icon-house',
              label: '晓棚村'
            },{
              id:6,
              icon: 'el-icon-house',
              label: '三义村'
            },{
              id:7,
              icon: 'el-icon-house',
              label: '大寨北城'
            },{
              id:8,
              icon: 'el-icon-house',
              label: '彭家村'
            }]
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
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted() {

  },
  methods: {
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
    }
  },
}
</script>

<style  lang="scss">
  .area {
    .floatmsg {
      margin-left: 20px;
      .floatword {
        margin-top: 20px;
        .inputmsg {
          width: 300px;
          height: 40px;
          padding: 0 10px;
          background: #FFFFFF;
          border: 1px solid #D9D9D9;
          border-radius: 4px 0px 0px 4px;
        }
        .btnmsg {
          width: 70px;
          height: 40px;
          margin-left: -6px;
          border: 1px solid #FF9832;
          color: #FFF;
          background: #FF9832;
          border-radius: 0 4px 4px 0;
        }
      }
      .floatsearch {
        width: 368px;
        height: 320px;
        // background-color: red;
        margin-top: 20px;
        position: relative;
        .el-tree-node__expand-icon {
          display: none;
        }
        .el-tree {
          position: absolute;
        }
        .huapolice {
          position: absolute;
          top: -8px;
          right: 10px;
          color: #606266;
          font-size: 14px;
        }
        .mengpolice {
          position: absolute;
          top: 22px;
          right: 10px;
          color: #606266;
          font-size: 14px;
        }
        .mountainpolice {
          position: absolute;
          top: 246px;
          right: 10px;
          color: #606266;
          font-size: 14px;
        }
      }
      .border {
        width: 320px;
        height: 1px;
        margin-left: 20px;
        margin-top: 20px;
        background-color: #E9E9E9;
      }
      .address {
        width: 368px;
        height: 100px;
        // background-color: red;
        display: flex;
        padding: 20px 20px;
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
