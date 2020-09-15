<template>
  <div class="monitorScreen-wrap">
    <div class="monitorScreen">
      <div class="screen" v-for="item in deviceList" :key="item.id">
        <div class="screen-inner">
          <div class="screen-head">
            <div class="head-label"><i class="el-icon-location-information"></i> {{item.name}}</div>
            <div class="head-btn">
              <div class="btn" @click="updateMonitor(item)"><i class="el-icon-setting"></i></div>
              <div class="btn" @click="deleteMonitor(item)"><i class="el-icon-delete"></i></div>
            </div>
          </div>
          <div class="screen-body"></div>
        </div>
      </div>
      <div class="screen" v-if="deviceList.length <= 9">
        <div class="screen-add" @click="addMonitor">
          <i class="el-icon-circle-plus-outline"></i> 添加监控摄像头
        </div>
      </div>
    </div>
    <el-dialog :title="this.form.name ? '修改监控摄像头' : '添加监控摄像头' " :visible.sync="dialogFormVisible" width="540px">
      <el-form :model="form">
        <el-form-item label="摄像头地址">
          <el-select v-model="form.region" 
            filterable
            remote
            :remote-method="getCameraList"
            :loading="loading"
            placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="warning" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchAllMonitor, updateMonitor, addMonitor, delMonitor } from '@/api/monitor'
import { searchCameraList } from '@/api/camera';

export default {
  data() {
    return {
      dialogFormVisible: false,
      form: {},
      options: [],
      deviceList: [
        { id: 1, name: '陕西华阴华山风景区'},
        { id: 2, name: '陕西华阴华山风景区'},
        { id: 3, name: '陕西华阴华山风景区'},
        { id: 4, name: '陕西华阴华山风景区'}
      ],
      loading: false,
    }
  },
  mounted() {
    // this.getCameraList();
  },
  methods: {
    getCameraList(keyword) {
      if (keyword !== '') {
        this.loading = true;
        const params = {
          cascade: true,
          page: {
            index: 1,
            size: 20
          },
          params: [
            {
              field: 'address',
              operator: 'LIKE',
              value: `%${keyword}%`
            }
          ]
        }
        searchCameraList(params).then(res => {
          const data = res.body.data;
          this.options = data.map(item => {
            return {
              value: item.id,
              label: item.address
            }
          })
          this.loading = false;
        })
      } else {
        this.options = [];
      }
    },
    updateMonitor(item) {
      this.form = item;
      this.dialogFormVisible = true;
    },
    deleteMonitor(item) {
      this.$confirm('确认移除该摄像头?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        // ajax
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      });
    },
    addMonitor() {
      this.form = {};
      this.dialogFormVisible = true;
    },
  }
}
</script>
<style lang='scss'>
.monitorScreen-wrap {
  padding: 20px;
  height: 100%;
  background: #F0F2F5;
  .el-input__inner {
    width: 360px;
  }
}
.monitorScreen {
  overflow: hidden;
  padding: 10px 10px;
  background: #fff;
  .screen {
    float: left;
    width: 33.33%;
    .screen-inner {
      margin: 10px 10px;
    }
    .screen-add {
      height: 340px;
      margin: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      color: #333;
      border: 1px solid #9b9da0;
      border-radius: 5px 5px 0 0;
      cursor: pointer;
      i {
        font-size: 56px;
        margin-right: 5px;
      }
    }
    .screen-head {
      position: relative;
      height: 40px;
      display: flex;
      padding: 0 10px;
      align-items: center;
      border: 1px solid #9b9da0;
      border-radius: 5px 5px 0 0;
      .head-label {
        flex: 1;
        font-size: 18px;
        line-height: 40px;
        color: #333;
      }
      .head-btn {
        display: flex;
        .btn {
          flex: 1;
          cursor: pointer;
          font-size: 20px;
          padding: 8px;
        }
      }
    }
    .screen-body {
      height: 300px;
      background: #333;
    }
  }
}
</style>
