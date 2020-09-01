<template>
  <div>
    <el-table
      :data="snapList"
      style="width: 100%">
      <el-table-column
        label="抓拍图像">
        <template slot-scope="scope">
          <div @click="()=>{showBigImg(scope.row.imageId)}">
            <el-image
              v-if="scope.row.imageId"
              :src="formatImg(scope.row.imageId)"
              style="width: 100px; cursor:pointer;"
              fit="contain"
              alt=""
            ></el-image>
            <span v-else style="color:red;">暂无图片</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="图像内容">
        <template slot-scope="scope">
          <span>{{ scope.row.message }} {{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="抓拍时间">
      </el-table-column>
    </el-table>
    <el-dialog :visible="dialogVisable" title="告警图片" width="960px" @close="editCloseDialog">
      <img
        :src="formatImg(dialogImgId)"
        style="width:100%;height:100%;object-fit:cover;"
        alt=""
      >
    </el-dialog>
    <pagination :total="total" :page.sync="page" :limit.sync="limit" @pagination="getList()"/>
  </div>
</template>
<script>
import {
  fetchVehicle, fetchSchool, fetchCommunity, fetchFactory, fetchFace, alarmImg
} from '@/api/alarm'
import Pagination from '@/components/Pagination'

export default {
  name: 'SnapList',
  components: { Pagination },
  props: {
    type: {
      type: String
    },
    deviceNum: {
      type: String
    }
  },
  data() {
    return {
      snapList: [],
      total: 0,
      page: 1,
      limit: 10,
      dialogVisable: false,
      dialogImgId: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表数据
    getList() {
      let api
      if (this.type == 'vehicle') {
        api = fetchVehicle
      } else if (this.type == 'school') {
        api = fetchSchool
      } else if (this.type == 'community') {
        api = fetchCommunity
      } else if (this.type == 'factory') {
        api = fetchFactory
      } else if (this.type == 'face') {
        api = fetchFace
      }
      if (api && this.deviceNum) {
        api(this.deviceNum, { limit: 10 }).then(res => {
          this.snapList = res.data || []
          this.total = this.snapList.length
        })
      }
    },
    editCloseDialog() {
      this.dialogVisable = false
    },
    formatImg(id) {
      return alarmImg(id)
    },
    showBigImg(id) {
      if (!id) {
        this.$confirm('暂无图片', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          showCancelButton: false
        })
      } else {
        this.dialogVisable = true
        this.dialogImgId = id
      }
    }
  }
}
</script>
