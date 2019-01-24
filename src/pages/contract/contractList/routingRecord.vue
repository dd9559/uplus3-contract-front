<template>
  <div class="view-container">
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn" :min="45">
      <el-form :inline="true" :model="searchForm" class="prop-form" size="small">
        <el-form-item label="结算日期">
          <el-date-picker v-model="signDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy/MM/dd" style="width:330px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="分账门店">
          <el-select v-model="searchForm.outStoreAttr" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['53']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select style="width:160px" :clearable="true" ref="tree" size="small" :loading="Loading" :remote-method="remoteMethod" @visible-change="initDepList" @clear="clearDep" v-model="searchForm.outStoreId" placeholder="请选择">
            <el-option class="drop-tree" value="">
              <el-tree :data="DepList" :props="defaultProps" @node-click="depHandleClick"></el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-select style="width:100px" :clearable="true" v-loadmore="moreEmploye" class="margin-left" size="small" v-model="searchForm.dealAgentId" placeholder="请选择">
            <el-option
              v-for="item in EmployeList"
              :key="item.empId"
              :label="item.name"
              :value="item.empId">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="收账门店">
          <el-select v-model="searchForm.inStoreAttr" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['53']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select style="width:160px" :clearable="true" ref="tree" size="small" :loading="Loading" :remote-method="remoteMethod" @visible-change="initDepList" @clear="clearDep" v-model="searchForm.inStoreId" placeholder="请选择">
            <el-option class="drop-tree" value="">
              <el-tree :data="DepList" :props="defaultProps" @node-click="depHandleClick"></el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="打款状态">
          <el-select v-model="searchForm.contractType" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['10']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
    </ScreeningTop>
    <!-- 列表 -->
    <div class="routing-list">
      <p><span class="title"><i class="iconfont icon-tubiao-11"></i>数据列表</span></p>
      <el-table :data="tableData" border>
        <el-table-column align="left" label="分账门店" prop="outStoreName" width="150">
        </el-table-column>
        <el-table-column align="left" label="分账门店账户" prop="outBankCard" width="250">
        </el-table-column>
        <el-table-column align="left" label="收款门店" prop="inStoreName" width="150">
        </el-table-column>
        <el-table-column align="left" label="收款门店账户" width="250">
          <template slot-scope="scope">
            <p v-for="item in scope.row.inBank" :key="item.bankCard">{{item.bankCard}}</p>
          </template>
        </el-table-column>
        <el-table-column align="left" label="分账周期" width="250">
          <template slot-scope="scope">
            <span>{{scope.row.startTime|timeFormat_}}</span> ~
            <span>{{scope.row.endTime|timeFormat_}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="分账金额(元)" prop="accountAmount" width="150">
        </el-table-column>
        <el-table-column align="left" label="操作" width="250">
          <template slot-scope="scope">
            <el-button type="text" size="medium">确认收款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination-info" @current-change="handleCurrentChange" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
           
<script>
import ScreeningTop from "@/components/ScreeningTop";
import { MIXINS } from "@/assets/js/mixins";
import { TOOL } from "@/assets/js/common";

export default {
  mixins: [MIXINS],
  components: {
    ScreeningTop
  },
  data() {
    return {
      searchForm: {
        outStoreId:'',//分账门店id
        outStoreAttr:'',//分账门店属性
        inStoreId:'',//收款门店id
        inStoreAttr:''//收款门店属性
      },
      signDate: [],
      tableData:[],
      currentPage:1,
      pageSize:10,
      total:0,
      loading:false,
      //部门选择列表
      options:[],
      //经纪人列表
      brokersList:[],
      dictionary: {
        //数据字典
        "53": "", //合作方式
      },
    };
  },
  created() {
    // this.remoteMethod();//部门
    this.getDictionary();//字典
  },
  methods: {
    //获取分账记录列表
    getProateNotes(){
      let param = {
        pageNum:this.currentPage,
        pageSize:this.pageSize
      }
      param = Object.assign({}, param, this.searchForm);
      if (this.signDate.length > 0) {
        param.startTime = this.signDate[0];
        param.endTime = this.signDate[1];
      };
      this.$ajax.get('/api/separate/account/list',param).then(res=>{
        res=res.data;
        if(res.status===200){
          this.tableData=res.data.list;
        }
      }).catch(error=>{
        this.$message({
          message:error.message,
          type:"error"
        })
      })
    },
    // 查询
    queryFn() {
      if(this.signDate.length>1){
        this.getProateNotes();
      }else{
        this.$message({
          message:"请选择时间范围",
          type:'warning'
        })
      }
    },
    // 重置
    resetFormFn() {
      TOOL.clearForm(this.searchForm);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    //合同详情
    goContractDetail(value){
      // console.log('111')
      if(value.contType.value===1||value.contType.value===2||value.contType.value===3){
        this.$router.push({
          path: "/contractDetails",
          query: {
            id: value.contractId,//合同id
            code: value.contractCode,//合同编号
            contType: value.contType.value//合同类型
          }
        });
      }else{
        this.$router.push({
        path: "/detailIntention",
        query: {
          id: value.contractId,
          contType: value.contType.value
        }
      });
      }
    },
    //分账详情
    toDetail(){
      let newPage = this.$router.resolve({ 
        path: '/contractList',
        query:{
          objectType:1,
          infoId:1
        }
      });
      window.open(newPage.href, '_blank');
    },
    //获取当前部门
    initDepList:function (val) {
      if(!val){
        this.remoteMethod()
      }
    },
    clearDep:function () {
      this.searchForm.dealAgentStoreId=''
      this.searchForm.depName=''
      // this.EmployeList=[]
      this.searchForm.dealAgentId=''
      this.clearSelect()
    },
    depHandleClick(data) {
      // this.getEmploye(data.depId)
      this.searchForm.dealAgentStoreId=data.depId
      this.searchForm.depName=data.name

      this.handleNodeClick(data)
    }
  },
  filters: {
    timeFormat_: function (val) {
      if (!val) {
        return '--'
      } else {
        let time = new Date(val)
        let y = time.getFullYear()
        let M = time.getMonth() + 1
        let D = time.getDate()
        let h = time.getHours()
        let m = time.getMinutes()
        let s = time.getSeconds()
        let time_ = `${y}-${M > 9 ? M : '0' + M}-${D > 9 ? D : '0' + D} ${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`;
        return time_.substr(0, 10)
      }
    }
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.red{
  color: red;
}
.routing-list {
  // margin-top: 20px;
  background-color: #fff;
  padding: 0 10px 10px 10px;
  border-radius: 2px;
  box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  >p{
    padding: 10px 0 10px 0;
    .title{
      padding-left: 10px;
      i{
        padding-right: 10px;
      }
    }
  }
  .contCode{
    color: @color-blue;
    cursor: pointer;
  }
}
/deep/.paper-box {
  padding-top: 10px !important;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 2px;
  box-sizing: border-box;
  box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  .paper-set-tit {
    padding-bottom: 10px;
  }
}
/deep/ .el-table th {
  background: @bg-th;
}
/deep/.margin-left{
  margin-left: 0;
}
</style>