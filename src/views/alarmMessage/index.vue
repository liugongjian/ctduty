<template>
  <div class="list">
    <div class="app-container" style="padding: 20px">
      <div class="filter-container clearfix">
        <div class="pull-right">
          <el-button class="filter-item" style="font-size:12px" size="mini" icon="el-icon-refresh" @click="onClear">重置</el-button>
        </div>
        <div class="pull-left">

          <div class="block filter-item">
            <div style="margin-right: 8px;font-size: 12px">
              选择日期:
            </div>
          </div>
          <div class="block filter-item">
            <el-date-picker
              v-model="value1"
              :clearable="false"
              :style="{width:250 + 'px'}"
              type="daterange"
              range-separator="to"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              size="mini"
              :picker-options="pickerOptions"
              @change="timeChange"
            >
            </el-date-picker>
          </div>
          <div class="block filter-item">
            <div style="margin-right: 8px; margin-left: 6px; font-size: 12px">
              开始时间:
            </div>
          </div>
          <div class="block filter-item">
            <el-time-picker
              :style="{width:100 + 'px',height:'10px'}"
              v-model="startTime"
              :picker-options="{
                selectableRange:'00:00:00-23:59:00'
              }"
              size="mini"
              format="HH:mm"
              value-format="HH:mm"
            >
            </el-time-picker>

          </div>

          <div class="block filter-item">
            <div style="margin-right: 8px; margin-left: 6px; font-size: 12px">
              结束时间:
            </div>
          </div>
          <div class="block filter-item">
            <el-time-picker
              :style="{width:100 + 'px'}"
              v-model="endTime"
              :picker-options="{
                selectableRange:startTime+ ':00' + '-23:59:00'
              }"
              size="mini"
              format="HH:mm"
              value-format="HH:mm"
            >
            </el-time-picker>
          </div>

          <el-select v-model="formInline.typeValue" style="width:100px; margin-left:10px; margin-right: 10px" size="mini" class="filter-item" @change="checkModel">
            <el-option v-for="item in typeOptions" :key="item._id" :label="item.name" :value="item._id"></el-option>
          </el-select>
          <el-button v-waves class="filter-item" size="mini" type="warning" @click="onSearch">
            {{ '搜索' }}
          </el-button>

        </div>
      </div>
      <div>
        <el-tabs v-model="defaultTab" type="border-card" @tab-click="tabChangeQuery">
          <el-tab-pane
            v-for="(item, index) in tabsArr"
            :key="item"
            :label="item"
            :name="item">
           <span>{{tabsArr[tabsArr.length-1]}} to {{tabsArr[0]}} 警告共计: {{allTotal}} 条 </span>
           <br></br>            
            <el-table :data="tableData" :header-cell-class-name="tableRowClassHeader" class="amountdetailTable" style="width: 100%" tooltip-effect="dark" fit @selection-change="handleSelectionChange">
              <el-table-column
                width="55">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'告警ID'" prop="id"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" :formatter="formatTime" :label="'时间'" prop="createTime">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" :formatter="formatType" :label="'事件'" prop="type" ></el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'摄像头'" prop="camera.address"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'图片'" prop="image"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'处理人'" prop="handler.username"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" :label="'处理结果'" prop="handlerId"><template slot-scope="scope">
                <svg-icon v-if="scope.row.handlerId" class="deal" icon-class="deal" />
                <svg-icon v-else class="untreated" icon-class="untreated" />
                <span>{{ scope.row.handlerId ? "已处理":"未处理" }}</span>
              </template></el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-link type="primary" @click="editDialog(scope.row)">编辑</el-link>
                    <el-link type="primary" @click="delAlert(scope.row.id)">删除</el-link>
                  </template>
                </el-table-column>
            </el-table>
          
            <el-dialog
            :visible.sync="dialogVisable"
             title="报警显示" width="520px" @close="closeDialog">
                <el-form  label-position="right" v-model="temp" label-width="100px">
                   <el-form-item label="流量状态：" prop="camera.address">
                      <span style="width: 300px;">{{temp.camera | formatNull }}</span>
                  </el-form-item> 
                   <el-form-item label="监控时间：" prop="createTime" :formatter="formatTime">
                      {{formatTime(temp.createTime) }}
                  </el-form-item>
                  <el-form-item label="原始照片：" prop="image">
                    <el-image src="temp.image"></el-image>
                  </el-form-item>
                  <el-form-item label="结构化照片：" prop="imageCut">
                      <el-image src="temp.imageCut"></el-image>
                  </el-form-item> 
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button
                    type="primary"
                    @click="dialogConfirm"
                  >正 常</el-button>
                  <el-button @click="dialogQuxiao">异 常</el-button>
                </div>
              </el-dialog>
            
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="page"
              :limit.sync="limit"
              @pagination="pageChange()"
            />
          </el-tab-pane>
        </el-tabs>
      </div>

    </div>

  </div>
</template>

<script>
import { Message } from 'element-ui'
import Cookies from 'js-cookie'
import Pagination from '@/components/Pagination'
// import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { getAlertInfos,deleteAlertInfo,getPushSet, notifyState } from '@/api/alarm'
export default {
  components: { Pagination },

  data() {
    return {
      temp:{
        camera:{},
        createTime: '',
        image: '',
        imageCut: ''
      },
      rowId:0,
      defaultTab: '',
      state: '',
      value1: [new Date(new Date().setDate(new Date().getDate() - 30)), new Date(new Date().setDate(new Date().getDate()))],
      startTime: '02:00',
      endTime: '',
      startDate: '',
      endDate: '',
      tabsArr: [],
      tabsDateArr: [],
      currentTab:'',
      formInline: {
        searchkey: '',
        typeValue: 'all'
      },
      typeOptions: [{ name: '所有警告', _id: 'all' },
        { name: '已处理', _id: 'settled' }, { name: '未处理', _id: 'unsettled' }
      ],

      listLoading: false,
      filteredValue: [],
      tableData: [],
      dialogVisable: false,
      total: 0, // 假的 最后是拿到后端的pageInfo的totalItems
      allTotal:0,
      page: 1,
      limit: 10,
      userId: Cookies.get('userId'),
      originCode: '',
      oldSize: 10,
      editVisable: false,
      editForm: {
        id: '',
        inCharge: '',
        longitude: '',
        latitude: '',
        // address: '',
        url: ''
      },
      pickerOptions: {
        disabledDate(time) {
        return time.getTime() > Date.now() - 8.64e6
      }
  },  
    }
  },
  filters: {
    formatNull: function(val) {
      if(!val) return '无'
      return val.address
    }
  },
  // computed: {
  //   ...mapGetters([
  //     'userId'
  //   ])
  // },
  watch: {
    limit() {
      this.page = 1
      this.pageChange()
    }
  },
  created() {
    
    this.getPushSetTime()
    console.log(this.startTime,"start.............")
    console.log(this.endTime,"end.............")
    this.value1=[new Date(new Date().setDate(new Date().getDate() - 30)), new Date(new Date().setDate(new Date().getDate()))],
    this.timeChange()
    this.value1=""
    this.tabsArr = this.getDayAll(this.startDate, this.endDate).reverse()
    this.defaultTab = this.tabsArr[0]
    const s = this.tabsArr[0] + ' ' + this.startTime + ':00'
    const e = this.tabsArr[0] + ' ' + this.endTime + ':00'
    const h = this.formInline.typeValue
    this.getList(s, e, h)
  },
  methods: {
    delAlert(d){
      this.rowId=d;
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.deleteAlert()
        })
    },
   
    formatTime: function(row, column, cellValue) {
      return moment(cellValue).format('YYYY-MM-DD HH:mm:SS')
    },
    formatType(row, column, cellValue) {
      return cellValue === 1 ? '人员' : cellValue === 2 ? '机动车' : '非机动车'
    },
    timeChange() {
      this.startDate = moment(this.value1[0]).format('YYYY-MM-DD')
      this.endDate = moment(this.value1[1]).format('YYYY-MM-DD')
      this.tabsDateArr = this.getDayAll(this.startDate, this.endDate).reverse()
    },
    getDayAll(begin, end) {
      var dateAllArr = new Array()
      var ab = begin.split('-')
      var ae = end.split('-')
      var db = new Date()
      db.setUTCFullYear(ab[0], ab[1] - 1, ab[2])
      var de = new Date()
      de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
      var unixDb = db.getTime()
      var unixDe = de.getTime()
      for (var k = unixDb; k <= unixDe;) {
        dateAllArr.push(moment(new Date(parseInt(k))).format('YYYY-MM-DD').toString())
        k = k + 24 * 60 * 60 * 1000
      }
      return dateAllArr
    },
    onClear() {
      this.value1=[new Date(new Date().setDate(new Date().getDate() - 30)), new Date(new Date().setDate(new Date().getDate()))],
      this.startDate = moment(this.value1[0]).format('YYYY-MM-DD')
      this.endDate = moment(this.value1[1]).format('YYYY-MM-DD')
      
      this.value1="",
      this.getPushSetTime()
      this.formInline.typeValue = 'all'
      this.tabsDateArr = this.getDayAll(this.startDate, this.endDate).reverse()
    },
    onSearch() {
      this.tabsArr = this.tabsDateArr
      if(this.tabsArr.indexOf(this.currentTab)===-1){
        this.defaultTab=this.tabsArr[0]
        this.currentTab=this.defaultTab
      }
      const s1 = this.currentTab + ' ' + this.startTime + ':00'
      const end1 = this.currentTab + ' ' + this.endTime + ':00'
      const h1 = this.formInline.typeValue
      this.oldSize = this.limit
      this.getList(s1, end1, h1)
      const s = this.tabsArr[this.tabsArr.length-1]  + ' ' + this.startTime + ':00'
      const end = this.tabsArr[0] + ' ' + this.endTime + ':00'
      //调用后续接口
      console.log(end,"??????????/")
    },
   
    editDialog(v) {
      console.log(v,"VVVVVVVVVVVVVVV"),
      this.temp=Object.assign({},v)
      this.dialogVisable = true
    },
    editCloseDialog() {
      this.editVisable = false
    },
    editDialogConfirm() {
      const params = [{
        id: this.editForm.id,
        inChargeId: this.editForm.inCharge,
        latitude: this.editForm.latitude,
        longitude: this.editForm.longitude,
        url: this.editForm.url
      }]
      editCamera(params).then(response => {
        console.log(response)
      })
      this.editVisable = false
    },
    editDialogQuxiao() {
      this.editVisable = false
    },
    create() {
      this.dialogVisable = true
    },
    closeDialog() {
      this.dialogVisable = false
    },
    checkModel() {
      console.log(this.formInline.typeValue,'type')
      this.$emit('getdata', this.formInline.typeValue)
    },
    // 表头样式
    tableRowClassHeader({ row, rowIndex }) {
      return 'tableRowClassHeader'
    },
    pageChange(e) {
      console.log('hhhh')
      const s = this.currentTab + ' ' + this.startTime + ':00'
      const end = this.currentTab + ' ' + this.endTime + ':00'
      const h = this.formInline.typeValue
     
      this.oldSize = this.limit
      this.getList(s, end, h)
    },
    tabChangeQuery(e) {
      console.log(e, '---')
      this.currentTab = e.label
      const s = e.label + ' ' + this.startTime + ':00'
      const end = e.label + ' ' + this.endTime + ':00'
      const h = this.formInline.typeValue
      console.log(h)
      this.getList(s, end, h)
    },
    deleteAlert() {
      const params=[this.rowId]
      deleteAlertInfo(params).then(()=>{
      const s = this.currentTab + ' ' + this.startTime + ':00'
      const end = this.currentTab + ' ' + this.endTime + ':00'
      const h = this.formInline.typeValue
      this.getList(s,end,h)

    
      })
      
    },
    goBack() {
      this.$router.go(-1)
    },
    getPushSetTime() {
      getPushSet().then(response => {
        const setting = response.body.data.setting
        let parseSetting
        try {
          parseSetting = JSON.parse(setting)
        } catch (err) {
          parseSetting = {}
        }
        console.log(parseSetting)
        this.startTime = parseSetting.date1
        this.endTime = parseSetting.date2
      })
    },
    // 获取列表数据
    getList(s, e, h) {
      let oper
      if (h === 'settled') {
        oper = 'NOT_NULL'
      } else if (h === 'unsettled') {
        oper = 'NULL'
      }
      const ss = {
        field: 'handlerId',
        operator: oper,
        value: 'null'
      }
      const param = h == 'all' ? [{
        field: 'createTime',
        operator: 'BETWEEN',
        value: { 'start': s || '', 'end': e || '' }
      }
      ] : [{
        field: 'createTime',
        operator: 'BETWEEN',
        value: { 'start': s || '', 'end': e || '' }
      },
      ss
      ]
      const params = {
        cascade: true,
        page: {
          index: this.page,
          size: this.limit
        },
        params: param
      }
      getAlertInfos(params).then(response => {
        this.tableData = response.body.data
        this.total = response.body.page.total
        this.listLoading = false
        console.log("nnnnnnnnnnnnnnnnnnn")
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    dialogQuxiao() {
      this.state=1
      this.dialogVisable = false
    },
    dialogConfirm(val) {
      this.state=0
      const tempData = Object.assign({}, this.temp)
      console.log(this.temp)
      const params = [{
        id: tempData.id,
        state: this.state,
        handlerId: this.userId
      }]
      console.log(params,"，，，，，，，，，，，，，，，，，，，")
      //更新state状态
      notifyState(params).then(response => {
      const s1 = this.currentTab + ' ' + this.startTime + ':00'
      const end1 = this.currentTab + ' ' + this.endTime + ':00'
      const h1 = this.formInline.typeValue
      this.oldSize = this.limit
      this.getList(s1, end1, h1)
        this.dialogVisable = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>

  <style lang='scss'>
  .title {
   width: 100%;
   height: 50px;
   line-height: 50px;
   font-family: MicrosoftYaHei;
   font-size: 22px;
   color: #333333;
   font-weight: 500;
   border-bottom: 1px solid #ccc;
   background: #FFF;
   padding: 0 20px;
 }
 .el-date-editor{
   height: 28px !important;
 }
 .el-range-separator{

   width: 30px !important;
 }
 .el-select-dropdown__item {
     font-size: 12px !important;

 }
.deal {
  fill: #44bd32 !important;
}
.untreated{
  fill: #E6A23C  !important;
}
.v-modal{
  z-index: 999  !important;
}
  </style>

