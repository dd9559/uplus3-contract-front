<template>
  <div class="recordSconsumption">
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
        <el-form-item label="城市">
          <el-select v-model="downLoadForm.city" filterable placeholder="请选择" :clearable="true" @clear="clear">
            <el-option
              v-for="item in cityList"
              :key="item.cityId"
              :label="item.cityName"
              :value="item.cityId"
              @click.native=citySelect(item)
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="体系">
          <el-select v-model="downLoadForm.systemTag" class="w100" placeholder="请选择" :clearable="true">
            <el-option v-for="item in systemTagSelect" :key="item.deptSystemtag" :label="item.deptSystemtagName" :value="item.deptSystemtag">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <div class="contract">
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
          signData:'',
          city:'',
          systemTag:''
        },
        cityList:[],
        tableData:[],
        currentPage: 1,
        pageSize:10,
        total:0,
      }
    },
    mounted(){
      this.dataInfo()
      this.cityInfo()
    },
    methods:{
      dataInfo() {
        let years = "",months = ""
        if(!this.downLoadForm.signData) {
          this.downLoadForm.signData = []
        }
        let params = {
          cityId:this.downLoadForm.city,
          deptSystemtag:this.downLoadForm.systemTag,
          pageNum:this.currentPage,
          pageSize:this.pageSize,
        }
        if(this.downLoadForm.signData.length) {
          years = this.downLoadForm.signData[1].split('-')[0]
          months = this.downLoadForm.signData[1].split('-')[1]
          params.startTime=this.downLoadForm.signData[0]+'-1',
          params.endTime=this.downLoadForm.signData[1]+'-'+new Date(years,months,0).getDate()
        }
        this.$ajax.get('/api/contract/copies/record/consumptionList',params).then(res=>{
           res = res.data
          if(res.status == 200) {
            const { list,total} = res.data
            this.tableData = list
            this.total = total
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      cityInfo() {
        this.$ajax.get('/api/contract/copies/recharge/cityList').then(res=>{
          res = res.data
          if(res.status == 200) {
            this.cityList = res.data
          }
        })
      },
      clear() {
        this.downLoadForm.systemTag = ''
        this.systemTagSelect = []
      },
      citySelect(i) {
        console.log(i.deptSystemTagList);
        this.systemTagSelect = i.deptSystemTagList
      },
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
        // this.initTimePicker()
        // this.EmployeList = []
      },
    }
  }
</script>

<style lang="less" scoped>
@import "~@/assets/common.less";
.recordSconsumption {
  .contract {
      padding: 0 10px;
      border-radius: 2px;
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
      .btn {
        color: @color-blue;
        cursor: pointer;
      }
  }
}
</style>