<template>
  <div class="view-container" ref="tableComView">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
      <el-form :inline="true" :model="contractForm" class="prop-form" size="small">
        <el-form-item label="关键字">
          <el-tooltip class="item" effect="dark" content="物业地址/业主/客户/房产证号/手机号/合同编号/纸质合同编号/房源编号/客源编号/房客源店长" placement="top">
            <el-input v-model="contractForm.keyword" style="width:150px" placeholder="请输入" :clearable="true"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="所属部门">
          <select-tree :data="DepList" :init="contractForm.depName" @checkCell="depHandleClick" @clear="clearDep" @search="searchDep"></select-tree>
        </el-form-item>
        <el-form-item>
          <el-select style="width:100px" :clearable="true" v-loadmore="moreEmploye" class="margin-left" size="small" v-model="contractForm.dealAgentId" @change="handleEmpNodeClick" placeholder="请选择">
            <el-option
              v-for="item in EmployeList"
              :key="item.empId"
              :label="item.name"
              :value="item.empId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="签约日期" v-if="contractType!='financial'">
          <el-date-picker v-model="signDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy/MM/dd" style="width:330px">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="结款时间" v-if="contractType==='newHouse'">
          <el-date-picker v-model="signDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy/MM/dd" style="width:330px">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="放款日期" v-if="contractType==='financial'">
          <el-date-picker v-model="signDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy/MM/dd" style="width:330px">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="交易方式" v-if="contractType==='longRent'">
          <el-select v-model="contractForm.recordType" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['64']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="收佣状态">
          <el-select v-model="contractForm.receiveAmountState" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['13']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ScreeningTop>
     <!-- 合同列表 -->
    <div class="contract-list">
      <div class="listTitle">
        <div>
          <span class="title"><i class="iconfont icon-tubiao-11"></i>数据列表</span>
        </div>
        <div>
          <el-button class="btn-info" v-if="power['sign-ht-info-export'].state"  round type="primary" size="small" @click="toAddcontract">新增合同</el-button>
          <el-button class="btn-info" v-if="power['sign-ht-info-export'].state"  round type="primary" size="small" @click="getExcel">导出</el-button>
        </div>
      </div>
      <!-- 新房 -->
      <newHouse v-if="contractType==='newHouse'" :tableDate="list" @getMoney="getMoney"></newHouse>
      <!-- 长租 -->
      <longRent v-if="contractType==='longRent'" :tableDate="list" @getMoney="getMoney"></longRent>
      <!-- 金融 -->
      <financial v-if="contractType==='financial'" :tableDate="list" @getMoney="getMoney"></financial>
      <!-- 固定滚动条 -->
      <div class="pagination" v-if="list.length>0">
        <el-pagination
         class="pagination-info"
         @current-change="handleCurrentChange"
         :current-page="currentPage"
         layout="total, prev, pager, next, jumper"
         :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
import ScreeningTop from "@/components/ScreeningTop";
import newHouse from "../otherContract/listModule/newHouse";
import longRent from "../otherContract/listModule/longRent";
import financial from "../otherContract/listModule/financial";

export default {
  mixins: [MIXINS],
  components: {
    ScreeningTop,
    newHouse,
    longRent,
    financial
  },
  data() {
    return {
      contractForm:{},
      signDate:[],
      dictionary: {
        //数据字典
        "13": "", //收佣状态
      },
      total: 0,
      currentPage: 1,
      pageSize: 10,
      //合同类型
      contractType:'newHouse',
      //列表数据
      list:[],
       //权限配置
      power: {
        'sign-ht-info-export': {
          state: false,
          name: '导出'
        }
      }
    }
  },
  created () {
    console.log(this.$route.query.type)
    if(this.$route.query.type==="xf"){
      this.contractType='newHouse'
      this.setPath(this.$tool.getRouter(['新房','合同','合同列表'],'otherContractList'));
    }else if(this.$route.query.type==="cz"){
      this.contractType='longRent'
      this.setPath(this.$tool.getRouter(['长租','合同','合同列表'],'otherContractList'));
    }else if(this.$route.query.type==="jr"){
      this.contractType='financial'
      this.setPath(this.$tool.getRouter(['金融','合同','合同列表'],'otherContractList'));
    }
    this.getDictionary();//字典
    this.remoteMethod();//部门
  },
  methods:{
    //查询
    queryFn(){

    },
    //重置
    resetFormFn(){

    },
    //获取当前部门
    initDepList:function (val) {
      if(!val){
        this.remoteMethod()
      }
    },
    searchDep:function (payload) {
      /*this.DepList=payload.list
      this.contractForm.depName=payload.depName*/
    },
    clearDep:function () {
      this.contractForm.dealAgentStoreId=''
      this.contractForm.depName=''
      // this.EmployeList=[]
      this.contractForm.dealAgentId=''
      this.clearSelect()
    },
    depHandleClick(data) {
      // this.getEmploye(data.depId)
      this.contractForm.dealAgentStoreId=data.depId
      this.contractForm.depName=data.name

      this.handleNodeClick(data)
    },
    //新增合同
    toAddcontract(){
      // addOtherContract
      let router
      if(this.contractType==="newHouse"){
        router="新房"
      }else if(this.contractType==="longRent"){
        router="长租"
      }else{
        router="金融"
      }
      this.setPath(this.$tool.getRouter([router,'合同','新增合同'],'addOtherContract'));
      this.$router.push({
        path: "/addOtherContract",
        query: {
          type: this.contractType,
        }
      });
    },
    //导出
    getExcel(){

    },
    //获取列表数据
    getContractList(){

    },
    //合同详情
    toDetail(){

    },
    //收款
    getMoney(){

    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getContractList("page");
    },

  }
}
</script>

<style scoped lang="less">
@import "~@/assets/common.less";
.contract-list {
  background-color: #fff;
  padding: 0 10px;
  border-radius: 2px;
  box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
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
/deep/ .el-table th {
  background: @bg-th;
}
/deep/.margin-left{
  margin-left: 0;
}
</style>