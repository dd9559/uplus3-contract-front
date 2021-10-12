<template>
  <div class="contractConsumption">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn" class="adjustbox">
      <el-form :inline="true" :model="downLoadForm" class="prop-form" size="small">
        <el-form-item label="日期">
          <el-date-picker
            v-model="downLoadForm.signData"
            type="monthrange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            format="yyyy-MM"
            value-format="yyyy-MM"
            style="width:330px"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <div class="contract">
      <h2 class="surplus">合同剩余份数</h2>
      <div class="contract-box">
        <div class="contract-box_one">
          <div class="contract-box_one-name">无纸化合同（份）</div>
          <div class="contract-box_one-num" :class="[paperlessQuentity <= warnQuentity ?'colorRed':'']">{{paperlessQuentity}}</div>
        </div>
        <div class="contract-box_two">
          <div class="contract-box_two-name">线上合同（份）</div>
          <div class="contract-box_two-num" :class="[onlineQuentity <= warnQuentity ?'colorRed':'']">{{onlineQuentity}}</div>
        </div>
      </div>
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
          header-row-class-name="theader-bg"
          width="400px"
          class="submit-dialog"
          border>
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column  label="城市" align="center" prop="cityName"></el-table-column>
          <el-table-column  label="体系" align="center" prop="systemtagName"></el-table-column>
          <el-table-column  label="日期" align="center" prop="dates"></el-table-column>
          <el-table-column  label="无纸化签约使用(份)" align="center" prop="papernum"></el-table-column>
          <el-table-column  label="线上签约使用(份)" align="center" prop="onlinenum"></el-table-column>
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
          signData:''
        },
        tableData:[],
        total:0,
        currentPage: 1,
        pageSize:10,
        onlineQuentity:0,
        paperlessQuentity:0,
        warnQuentity:0,
      }
    },
    mounted() {
      this.dataInfo()
      this.getInfo()
    },
    methods:{
      dataInfo() {
        let years = "",months = ""
        if(!this.downLoadForm.signData) {
          this.downLoadForm.signData = []
        }
        let params = {
          pageNum:this.currentPage,
          pageSize:this.pageSize
        }
        if(this.downLoadForm.signData.length) {
          years = this.downLoadForm.signData[1].split('-')[0]
          months = this.downLoadForm.signData[1].split('-')[1]
          params.startTime=this.downLoadForm.signData[0]+'-1',
          params.endTime=this.downLoadForm.signData[1]+'-'+new Date(years,months,0).getDate()
        }
        this.$ajax.get("/api/contract/copies/record/consumptionInfo",params).then(res=>{
          res = res.data
          if(res.status == 200) {
            const {list,total} = res.data
            this.tableData = list
            this.total = total
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      getInfo() {
        this.$ajax.get("/api/contract/copies/record/getInfo").then(res=>{
          console.log(this,999);
          res = res.data
          if(res.status == 200) {
            this.onlineQuentity = res.data.onlineQuentity
            this.paperlessQuentity  = res.data.paperlessQuentity 
            this.warnQuentity = res.data.warnQuentity
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      //翻页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.dataInfo();
      },
      //查询
      queryFn() {
        this.dataInfo()
      },
      //重置
      resetFormFn() {
        TOOL.clearForm(this.downLoadForm);
        this.currentPage = 1;
        // this.downLoadForm.signData[0] = ""
        // this.downLoadForm.signData[1] = ""
        // this.initTimePicker()
        // this.EmployeList = []
      },
    }
  }
</script>

<style lang="less" scoped>
@import "~@/assets/common.less";
.contractConsumption {
  .contract {
    padding: 0 10px;
    border-radius: 2px;
    .listTitle {
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
    .surplus {
      font-size: 25px;
      font-weight: 600;
      padding: 20px 0;
    }
    &-box {
      display: flex;
      align-items: center;
      &_one {
        padding-bottom: 10px;
        &-name {
          font-size: 15px;
          padding-bottom: 10px;
        }
        &-num {
          font-size: 16px;
          font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
          font-weight: 700;
          font-style: normal;
        }
        .colorRed {
          color: red;
        }
      }
      &_two {
        padding-left: 40px;
        padding-bottom: 10px;
        &-name {
          font-size: 15px;
          padding-bottom: 10px;
        }
        &-num {
          font-size: 16px;
          font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
          font-weight: 700;
          font-style: normal;
        }
        .colorRed {
          color: red;
        }
      }
    }
    
  }
}
</style>