<template>
  <div class="view-container">
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn" :min="45">
      <el-form :inline="true" :model="searchForm" class="prop-form" size="small">
        <el-form-item label="分账日期">
          <el-date-picker v-model="signDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy/MM/dd" style="width:330px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同类型">
          <el-select v-model="searchForm.contractType" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['10']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <!-- <el-select v-model="searchForm.dealAgentStoreId" filterable placeholder="全部" :clearable="true" style="width:150px" @change="selectDep">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select> -->

          <el-select style="width:160px" :clearable="true" ref="tree" size="small" :loading="Loading" :remote-method="remoteMethod" @visible-change="initDepList" @clear="clearDep" v-model="searchForm.depName" placeholder="请选择">
            <el-option class="drop-tree" value="">
              <el-tree :data="DepList" :props="defaultProps" @node-click="depHandleClick"></el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- <el-select v-model="searchForm.dealAgentId" placeholder="全部" style="width:100px" :clearable="true">
            <el-option v-for="item in brokersList" :key="item.empId" :label="item.name" :value="item.empId">
            </el-option>
          </el-select> -->

          <el-select style="width:100px" :clearable="true" v-loadmore="moreEmploye" class="margin-left" size="small" v-model="searchForm.dealAgentId" placeholder="请选择">
            <el-option
              v-for="item in EmployeList"
              :key="item.empId"
              :label="item.name"
              :value="item.empId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="searchForm.keyword" placeholder="合同编号/房源编号/客源编号" style="width:250px"></el-input>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <!-- 列表 -->
    <div class="routing-list">
      <p><span class="title"><i class="iconfont icon-tubiao-11"></i>数据列表</span></p>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column align="left" label="合同编号" width="200">
          <template slot-scope="scope">
            <span class="contCode" @click="goContractDetail(scope.row)">{{scope.row.contractCode}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="合同类型" prop="contType.label" width="80">
        </el-table-column>
        <el-table-column align="left" label="成交总价" prop="totalPrice" width="150">
        </el-table-column>
        <el-table-column align="left" label="成交经纪人" prop="dealAgentName" width="150">
          <template slot-scope="scope">
            <p>{{scope.row.dealStoreName}}</p>
            <p>{{scope.row.dealAgentName}}</p>
          </template>
        </el-table-column>
        <el-table-column align="left" label="合作门店">
          <template slot-scope="scope">
            <p v-for="item in scope.row.settlementFroms[0]" :key="item.storefront4Id">{{item.level4}}</p>
          </template>
        </el-table-column>
        <el-table-column align="left" label="业绩分成比例">
          <template slot-scope="scope">
            <p v-for="item in scope.row.settlementFroms[0]" :key="item.storefront4Id" v-if="item.ratio">{{item.ratio}}%</p>
          </template>
        </el-table-column>
        <el-table-column align="left" label="特许服务费比例">
          <template slot-scope="scope">
            <p v-for="item in scope.row.settlementFroms[0]" :key="item.storefront4Id" v-if="item.storefront4Id">{{item.platformRatio}}%</p>
          </template>
        </el-table-column>
        <el-table-column align="left" label="特许服务费（元）">
          <template slot-scope="scope">
            <p v-for="item in scope.row.settlementFroms[0]" :key="item.storefront4Id">{{item.platform}}</p>
          </template>
        </el-table-column>
        <el-table-column align="left" label="分账时间" width="150">
          <template slot-scope="scope">
            <p v-for="item in scope.row.settlementFroms[0]" :key="item.storefront4Id">{{item.prorate|formatTime}}</p>
          </template>
        </el-table-column>
        <el-table-column align="left" label="当期实收分成（元）" prop="shishou">
          <template slot-scope="scope">
            <p v-for="item in scope.row.settlementFroms[0]" :key="item.storefront4Id">{{item.platform}}</p>
          </template>
        </el-table-column>
        <el-table-column align="left" label="分账手续费（元）" prop="shouxufei">
          <template slot-scope="scope">
            <p v-for="item in scope.row.settlementFroms[0]" :key="item.storefront4Id">{{item.serviceFee}}</p>
          </template>
        </el-table-column>
        <el-table-column align="left" label="实际到账金额（元）">
          <template slot-scope="scope">
            <p v-for="item in scope.row.settlementFroms[0]" :key="item.storefront4Id">{{item.storefrontReceipts}}</p>
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
        contractType:'',
        dealAgentStoreId:'',
        dealAgentId:'',
        keyword:''
      },
      signDate: [],
      tableData:[],
      currentPage:1,
      pageSize:10,
      total:0,
      dictionary: {
        //数据字典
        "10": "" //合同类型
      },
      loading:false,
      //部门选择列表
      options:[],
      //经纪人列表
      brokersList:[]
    };
  },
  created() {
    this.getDictionary();//字典
    this.getProateNotes();//列表
    this.remoteMethod();//部门
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
      this.$ajax.get('/api/settlement/getProateNotes',param).then(res=>{
        res=res.data;
        if(res.status===200){
          this.tableData=res.data;

        }
      })
    },
    // 查询
    queryFn() {
      this.getProateNotes();
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
    },
    // getDeps(key){
    //   let param = {
    //     keyword:key
    //   }
    //   this.$ajax.get('/api/access/deps', param).then(res=>{
    //     this.loading=false;
    //     res=res.data
    //     if(res.status===200){
    //       this.options=res.data
    //     }
    //   })
    // },
    // selectDep(value){
    //   delete this.searchForm.dealAgentId;
    //   this.brokersList=[];
    //   if(value){
    //     this.getBroker(value)
    //   }
    // },
    // getBroker(id){
    //   console.log(id)
    //   let param = {
    //     depId:id
    //   }
    //   this.$ajax.get('/api/organize/employees', param).then(res=>{
    //     res=res.data
    //     if(res.status===200){
    //       this.brokersList=res.data
    //     }
    //   })
    // },
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
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
</style>