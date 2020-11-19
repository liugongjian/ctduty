<template>
  <div class="list">
    <div class="app-container" style="padding: 20px">
      <div class="filter-container clearfix">
        <div class="pull-left">
          <!--  <el-button class="filter-item" type="warning" icon="el-icon-plus" @click="create">{{ '新增摄像头' }}</el-button> -->
          <el-button type="warning" size="small" @click="batchesDel">{{ '批量删除' }}</el-button>
          <!--  <el-dialog :visible="dialogVisable" title="新增摄像头" width="520px" @close="closeDialog">
            <el-form ref="addForm" :model="dialogForm" :rule="addrules" label-position="right" label-width="130px">
              <el-form-item label="摄像头ID："><el-input v-model="dialogForm.id" placeholder="请输入摄像头ID" class="filter-item" style="width: 240px;"></el-input>
              </el-form-item>
              <el-form-item label="负责人：">
                <el-select v-model="dialogForm.inChargeId" :value="dialogForm.inChargeId" style="width:240px;" placeholder="请选择岗位">
                  <el-option v-for="item in userList" :value="item.id" :label="item.name" :key="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="制造厂商："><el-input v-model="dialogForm.manufacturer" placeholder="请输入制造厂商" class="filter-item" style="width: 240px;"></el-input>
              </el-form-item>
              <el-form-item label="设备型号："><el-input v-model="dialogForm.model" placeholder="请输入设备型号" class="filter-item" style="width: 240px;"></el-input>
              </el-form-item>
              <el-form-item label="视频流："><el-input v-model="dialogForm.url" placeholder="请输入视频流" class="filter-item" style="width: 240px;"></el-input>
              </el-form-item>
              <el-form-item label="手机："><el-input v-model="dialogForm.phone" placeholder="请输入手机" class="filter-item" style="width: 240px;"></el-input>
              </el-form-item>
              <el-form-item label="摄像头经度："><el-input v-model="dialogForm.longitude" type="num" placeholder="请输入摄像头经度" class="filter-item" style="width: 240px;"></el-input>
              </el-form-item>
              <el-form-item label="摄像头纬度："><el-input v-model="dialogForm.latitude" type="num" placeholder="请输入摄像头纬度" class="filter-item" style="width: 240px;"></el-input>
              </el-form-item>
              <el-form-item label="地址："><el-input v-model="dialogForm.address" placeholder="请输入地址" class="filter-item" style="width: 240px;"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button
                type="primary"
                @click="dialogConfirm('dialogForm')"
              >确 定</el-button>
              <el-button @click="dialogQuxiao">取 消</el-button>
            </div>
          </el-dialog>-->
        </div>
        <!--  <div class="pull-right">
          <el-select v-model="formInline.typeValue" style="width:120px;" class="filter-item" @change="checkModel">
            <el-option v-for="item in typeOptions" :key="item._id" :label="item.name" :value="item._id"></el-option>
          </el-select>
        </div>-->
      </div>
      <el-table
        :data="tableData"
        :header-cell-class-name="tableRowClassHeader"
        class="amountdetailTable"
        style="width: 100%"
        tooltip-effect="dark"
        fit
        @filter-change="filerStatus"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <!-- <el-table-column :show-overflow-tooltip="true" :label="'摄像头ID'" prop="id"></el-table-column> -->
        <el-table-column :show-overflow-tooltip="true" :label="'设备名称'" align="center" prop="name"></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          :label="'摄像头状态'"
          align="center"
          prop="online"
        >
          <template slot-scope="scope">
            <svg-icon
              v-if="scope.row.online"
              style="font-size:6px;line-height:23px;margin-bottom:2px;"
              icon-class="offline"
            />
            <svg-icon
              v-else
              style="font-size:6px;line-height:23px;margin-bottom:2px;"
              icon-class="online"
            />
            <span>{{ scope.row.online ? "离线":"在线" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          :label="'负责人'"
          align="center"
          prop="inCharge.name"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          :label="'经纬度信息'"
          align="center"
          prop="longitude"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.longitude + ', ' + scope.row.latitude }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          :show-overflow-tooltip="true"
          :label="'摄像头纬度'"
          align="center"
          prop="latitude"
        ></el-table-column>-->
        <!-- <el-table-column :show-overflow-tooltip="true" :label="'地址'" prop="address"></el-table-column> -->
        <el-table-column
          :show-overflow-tooltip="true"
          :formatter="formatTime"
          :label="'添加时间'"
          align="center"
          prop="createTime"
        ></el-table-column>
        <!--  <el-table-column :show-overflow-tooltip="true" :label="'视频流信息'" prop="isDeal">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.isDeal" class="deal" icon-class="deal" />
            <svg-icon v-else class="untreated" icon-class="untreated" />
            <span>{{ scope.row.isDeal ? "已处理":"未处理" }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" :label="'告警信息'" prop="dealSum"></el-table-column>-->
        <el-table-column :show-overflow-tooltip="true" :label="'操作'" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editDialog(scope.row)">{{ '编辑' }}</el-button>
            <el-button type="text" size="small" @click="delAlert(scope.row.id)">{{ '删除' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible="editVisable" title="编辑" width="520px" @close="editCloseDialog">
        <el-form :model="editForm" label-position="right" label-width="130px">
          <el-form-item label="摄像头ID：">
            <el-input
              v-model="editForm.id"
              placeholder="请输入摄像头ID"
              class="filter-item"
              style="width: 300px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="负责人：">
            <el-select
              v-model="editForm.inChargeName"
              :value="editForm.inChargeName"
              style="width:300px;"
              placeholder="请选择负责人"
            >
              <el-option
                v-for="item in userList"
                :value="item.id"
                :label="item.name"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="摄像头经纬度：">
            <el-input
              v-model="editForm.longitude"
              type="text"
              placeholder="请输入摄像头经度"
              class="filter-item"
              style="width: 140px;"
              @input="editForm.longitude=editForm.longitude.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')"
            ></el-input>
            <el-input
              type="text"
              v-model="editForm.latitude"
              placeholder="请输入摄像头纬度"
              style="width: 140px; ime-mode:disabled"
              class="filter-item"
              @input="editForm.latitude=editForm.latitude.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="摄像头纬度："></el-form-item> -->
          <el-form-item label="视频流信息：">
            <el-input
              v-model="editForm.url"
              placeholder="请输入视频流信息"
              class="filter-item"
              style="width: 300px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="地址：">
            <el-input
              v-model="editForm.address"
              :rows="4"
              type="textarea"
              placeholder="请输入地址"
              class="filter-item"
              style="width: 300px;"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editDialogConfirm">确 定</el-button>
          <el-button @click="editDialogQuxiao">取 消</el-button>
        </div>
      </el-dialog>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="page"
        :limit.sync="limit"
        @pagination="pageChange()"
      />
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";
import Cookies from "js-cookie";
import Pagination from "@/components/Pagination";
import "element-ui/lib/theme-chalk/index.css";
import moment from "moment";
import {
  fetchAllCameraList,
  editCamera,
  addCamera,
  delCamera
} from "@/api/camera";
import { fetchUserList } from "@/api/users";
import VideoConfig from "@/components/VideoConfig";
import client from "@/api/vedioAlgo";

export default {
  components: { Pagination, VideoConfig },
  data() {
    return {
      dialogForm: {
        address: "",
        creatorId: "",
        id: "",
        name: "",
        latitude: "",
        longitude: "",
        url: "",
        inChargeId: "",
        manufacturer: "",
        model: "",
        phone: ""
      },
      addrules: {
        creatorId: [
          { required: true, trigger: "blur", message: "创建人ID不能为空" }
        ],
        name: [
          { required: true, trigger: "blur", message: "摄像头名称不能为空" }
        ],
        url: [
          { required: true, trigger: "blur", message: "视频流信息不能为空" }
        ],
        phone: [{ required: true, trigger: "blur", message: "手机号不能为空" }],
        manufacturer: [
          { required: true, trigger: "blur", message: "制造厂商不能为空" }
        ],
        model: [
          { required: true, trigger: "blur", message: "设备型号不能为空" }
        ],
        id: [{ required: true, trigger: "blur", message: "摄像头ID不能为空" }],
        inChargeId: [
          { required: true, trigger: "blur", message: "负责人ID不能为空" }
        ],
        longitude: [
          { required: true, trigger: "blur", message: "经度不能为空" }
        ],
        latitude: [
          { required: true, trigger: "blur", message: "纬度不能为空" }
        ],
        address: [{ required: true, trigger: "blur", message: "地址不能为空" }]
      },
      formInline: {
        searchkey: "",
        typeValue: "list"
      },
      typeOptions: [
        { name: "地图模式", _id: "map" },
        { name: "列表模式", _id: "list" }
      ],
      listLoading: false,
      filteredValue: [],
      tableData: [],
      dialogVisable: false,
      total: 0, // 假的 最后是拿到后端的pageInfo的totalItems
      page: 1,
      limit: 10,
      userId: Cookies.get("userId"),
      originCode: "",
      oldSize: 10,
      delIDArr: [],
      editVisable: false,
      editForm: {
        id: "",
        inChargeId: "",
        inChargeName: "",
        longitude: "",
        latitude: "",
        address: "",
        url: "",
        name: "",
        creatorId: ""
      },
      userList: [],
      creatorName: ""
    };
  },
  watch: {
    limit() {
      this.page = 1;
      this.pageChange();
    }
  },
  async created() {
    await Message.closeAll();
    await this.getUserList();
    await this.getList();
  },
  methods: {
    getUserList() {
      const query = {
        cascade: true,
        page: {
          index: 1,
          size: 9999999
        },
        params: {}
      };
      fetchUserList(query).then(response => {
        if (response.code !== 0) return;
        this.userList = response.body.data;
        this.userList.forEach(item => {
          if (item.id === +this.userId) {
            this.creatorName = item.name;
          }
        });
      });
    },
    batchesDel() {
      if (!this.delIDArr.length) {
        this.$message({
          message: "请选择需要删除的摄像头!",
          type: "warning"
        });
      } else {
        this.$confirm("此操作将永久删除选中数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const params = [...this.delIDArr];
          delCamera(params)
            .then(response => {
              this.getList();
              this.delIDArr = [];
            })
            .catch(() => {
              this.delIDArr = [];
            });
        });
      }
    },
    delAlert(d) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const params = [d];
        delCamera(params).then(response => {
          this.getList();
          this.delIDArr = [];
        });
      });
    },
    formatTime: function(row, column, cellValue) {
      return moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
    },
    editDialog(v) {
      this.editForm.id = v.id;
      this.editForm.creatorId = v.creatorId;
      this.editForm.inChargeId = v.inChargeId;
      this.editForm.inChargeName = v.inCharge.name;
      this.editForm.longitude = v.longitude;
      this.editForm.latitude = v.latitude;
      this.editForm.address = v.address;
      this.editForm.name = v.name;
      this.editForm.url = v.url;
      console.log(v);
      this.editVisable = true;
    },
    editCloseDialog() {
      this.editVisable = false;
    },
    editDialogConfirm() {
      const params = [
        {
          id: this.editForm.id,
          inChargeId: this.editForm.inChargeId,
          latitude: this.editForm.latitude,
          longitude: this.editForm.longitude,
          url: this.editForm.url,
          name: this.editForm.name,
          creatorId: this.editForm.creatorId
        }
      ];
      editCamera(params).then(response => {
        this.$notify({
          title: "成功",
          message: "编辑成功",
          type: "success",
          duration: 2000
        });
        this.getList();
        this.editVisable = false;
      });
    },
    editDialogQuxiao() {
      this.editVisable = false;
    },
    create() {
      this.dialogVisable = true;
    },
    closeDialog() {
      this.dialogVisable = false;
    },
    onSearch() {},
    checkModel() {
      this.$emit("getdata", this.formInline.typeValue, true);
    },
    // 表头样式
    tableRowClassHeader({ row, rowIndex }) {
      return "tableRowClassHeader";
    },
    pageChange() {
      if (this.oldSize !== this.limit) {
        this.page = 1;
      }
      this.oldSize = this.limit;
      this.getList();
    },
    goBack() {
      this.$router.go(-1);
    },
    filerStatus(columnObj) {
      for (const key in columnObj) {
        this.originCode = columnObj[key][0];
      }
      this.page = 1;
      let columnObjKey = "";
      for (var i in columnObj) {
        columnObjKey = i;
      }
      if (columnObj[columnObjKey].length === 0) {
        this.filteredValue = [];
        this.getList();
      } else {
        this.filteredValue = columnObj[columnObjKey];
        this.getList();
      }
    },
    // 获取列表数据
    getList() {
      const params = {
        cascade: true,
        page: {
          index: this.page,
          size: this.limit
        },
        params: {}
      };
      fetchAllCameraList(params).then(res => {
        this.tableData = res.body.data;
        this.total = res.body.page.total;
        this.listLoading = false;
      });
    },
    handleSelectionChange(val) {
      this.delIDArr = val.map(item => {
        return item.id;
      });
    },
    dialogQuxiao() {
      this.dialogVisable = false;
    },
    dialogConfirm() {
      this.$refs.addForm.validate(valid => {
        if (!valid) return;
        const params = [{ ...this.dialogForm, creatorId: this.userId }];
        addCamera(params)
          .then(res => {
            this.dialogForm = {
              address: "",
              creatorId: "",
              id: "",
              name: "",
              latitude: "",
              longitude: "",
              url: "",
              inChargeId: "",
              manufacturer: "",
              model: "",
              phone: ""
            };
            this.$notify({
              title: "成功",
              message: "增加成功",
              type: "success",
              duration: 2000
            });
            this.getList();
            this.dialogVisable = false;
          })
          .catch(() => {
            this.$notify({
              title: "失败",
              message: "增加失败",
              type: "error",
              duration: 2000
            });
          });
      });
    }
  }
};
</script>

<style lang='scss'>
.app-main {
  padding-top: 50px;
}
</style>

