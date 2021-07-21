<template>
  <div class="view-container" ref="tableComView">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn" class="adjustbox">
      <el-form :inline="true" :model="downLoadForm" class="prop-form" size="small">
        <el-form-item label="申请日期">
          <el-date-picker
            v-model="downLoadForm.signData"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width:330px"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <div class="contract-list">
      <div class="listTitle">
        <div>
          <span class="title">
            <i class="iconfont icon-tubiao-11"></i>数据列表
          </span>
        </div>
      </div>
      <div>
        <el-table
        :data="tableData"
        border>
          <el-table-column label="文件名称" align="center" prop="fileName"></el-table-column>
          <el-table-column label="文件生成状态" align="center" prop="state">
            <template slot-scope="scope">
              <span v-if="scope.row.state == 0">生成中</span>
              <span v-if="scope.row.state == 1">已生成</span>
              <span v-if="scope.row.state == 2">生成失败</span>
            </template>
          </el-table-column>
          <el-table-column label="申请时间" align="center">
            <template slot-scope="scope">
              {{scope.row.createTime | formatTime}}
            </template>
          </el-table-column>
          <el-table-column label="文件生成时间" align="center">
            <template slot-scope="scope">
              {{scope.row.fileCreateTime | formatTime}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="openDownload(scope.row)" size="medium" v-if="scope.row.state == 1">
                下载
              </el-button>
              <span v-else>-</span>
            </template>
          </el-table-column>  
          <!-- 固定滚动条 -->
        </el-table>
        <div class="pagination" v-if="tableData.length > 0">
          <el-pagination
            class="pagination-info"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ScreeningTop from '@/components/ScreeningTop';
  import {TOOL} from "@/assets/js/common";
  import { MIXINS } from "@/assets/js/mixins";
export default {
  mixins: [MIXINS],
  components:{
    ScreeningTop
  },
  data() {
    return {
      downLoadForm:{
        signData:[]
      },
      tableData:[],
      total:0,
      currentPage: 1,
      pageSize:10,
    }
  },
  created() {
    this.initTimePicker()
  },
  mounted() {
    this.downLoadInfo()
  },
  methods:{
    initTimePicker() {
      var date = new Date();
      // date = date.setDate(1);
      console.log(date);
      date = this.$tool.dateFormat(date);
      this.downLoadForm.signData[0] = date
      var date2 = this.$tool.dateFormat(Date.now());
      this.downLoadForm.signData[1] = date2
      this.currentDate = date2
      this.$nextTick(() => {
        this.downLoadForm.signData = [date, date2];
      });
      // console.log(this.downLoadForm.signData,999);
    },
    downLoadInfo() {
      // console.log(this.downLoadForm.signData[0]);
      let params = {
        applyStartTime:this.downLoadForm.signData[0],
        applyEndTime:this.downLoadForm.signData[1],
        pageNum:this.currentPage,
        pageSize:this.pageSize
      }
      this.$ajax.get("/api/ossFile/findOssFileList", params).then(res => {
        res = res.data
        console.log(res);
        if(res.status == 200) {
          this.tableData = res.data.list
          this.total = res.data.total
        }
      })
    },
    openDownload(e) {
      let data = e.ossPath
      this.fileSign([data], 'download')
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.downLoadInfo();
    },
    //查询
    queryFn() {
      this.downLoadInfo()
    },
    //重置
    resetFormFn() {
      TOOL.clearForm(this.downLoadForm);
      this.pageNum = 1;
      this.initTimePicker()
      // this.EmployeList = []
    },
  }
}
</script>

<style lang="less" scoped>
  @import "~@/assets/common.less";
  .contract-list {
    background-color: #fff;
    padding: 0 10px;
    border-radius: 2px;
    // box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
    > .listTitle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      .title {
        font-size: 14px;
        color: @color-blank;
        i {
          padding-right: 8px;
        }
      }
    }
  }
</style>