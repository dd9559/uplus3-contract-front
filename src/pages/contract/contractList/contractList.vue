<template>
  <div class="view-container">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn" :min="45">
      <el-form :inline="true" :model="contractForm" class="prop-form" size="small">
        <el-form-item label="签约日期">
          <el-date-picker v-model="signDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy/MM/dd" style="width:330px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同类型">
          <el-select v-model="contractForm.contType" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['10']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同状态">
          <el-select v-model="contractForm.contState" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['9']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用途">
          <el-select v-model="contractForm.houseinfoPurpose" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['538']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="keyword" placeholder="物业地址/业主/客户/房产证号/手机号/合同编号/房源编号/客源编号" style="width:420px"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-select
            v-model="contractForm.dealAgentStoreId"
            :multiple='false'
            clearable
            filterable
            remote
            reserve-keyword
            @change="getBroker"
            placeholder="部门"
            :remote-method="remoteMethod"
            :loading="loading">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                >
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="contractForm.dealAgentId" placeholder="请选择" style="width:100px">
            <el-option v-for="item in brokersList" :key="item.empId" :label="item.name" :value="item.empId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="contractForm.toExamineState" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['51']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变更/解约">
          <el-select v-model="contractForm.contChangeState" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['6']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算状态">
          <el-select v-model="contractForm.resultState" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['14']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收佣状态">
          <el-select v-model="contractForm.receiveAmountState" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['13']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业绩状态">
          <el-select v-model="contractForm.achievementState" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['54']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <!-- 合同列表 -->
    <div class="contract-list">
      <p>
        <span>
          <span class="title"><i class="iconfont icon-tubiao-11"></i>数据列表</span>
          <!-- <span class="text">有效成分汇总 </span>
          <span class="text">租赁：</span> <span class="data">123165</span>
          <span class="text">买卖：</span> <span class="data">75454</span>
          <span class="text">代办：</span> <span class="data">5565</span>
          <span class="text">意向：</span> <span class="data">0</span>
          <span class="text">定金：</span> <span class="data">0</span>
          <span class="text">可分配业绩汇总：</span> <span class="data">564654</span>
          <span class="text">单数：</span> <span class="data">13</span> -->
        </span>
        <span>
          <el-dropdown placement="bottom">
            <el-button round>
              打印空白合同<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in dictionary['10']" :key="item.key" :command="item.key">
                {{item.value}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown placement="bottom" @command="toAddcontract">
            <el-button round type="primary">
              创建正式合同<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in dictionary['10']" :key="item.key" :command="item.key">
                {{item.value}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </p>
      <el-table :data="tableData" style="width: 100%" @row-dblclick='toDetail'>
        <el-table-column align="left" label="合同信息" width="240" fixed>
          <template slot-scope="scope">
            <div class="contract_msg">
              <div class="riskLabel">
                <!-- 风险单 -->
                <i class="iconfont icon-tubiao_shiyong-1 risk" v-if="scope.row.isRisk"></i>
                <!-- 代办 -->
                <i class="iconfont icon-tubiao_shiyong-2 replace" v-if="scope.row.contMarkState&&scope.row.contMarkState.value===1"></i>
                <!-- 低佣 -->
                <i class="iconfont icon-tubiao_shiyong-3 low" v-if="scope.row.contMarkState&&scope.row.contMarkState.value===2"></i>
              </div>
              <ul class="contract-msglist">
                <li>合同编号：<span>{{scope.row.code}}</span></li>
                <li>房源编号：<span>{{scope.row.houseinfoCode}} {{scope.row.showOwnerName}}</span></li>
                <li>客源编号：<span>{{scope.row.guestinfoCode}} {{scope.row.showCustName}}</span></li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="合同类型" prop="contType.label" width="100" fixed>
        </el-table-column>
        <el-table-column align="left" label="物业地址" prop="propertyAddr" width="150" fixed>
        </el-table-column>
        <el-table-column align="left" label="成交总价" prop="dealPrice" width="100" fixed>
        </el-table-column>
        <el-table-column align="left" label="财务收付" width="100" fixed>
          <template slot-scope="scope">
            <div class="btn" @click="runningWater(scope.row.code)">流水</div>
            <div class="btn" @click="gathering(scope.row.id)">收款</div>
            <div class="btn" @click="payment(scope.row.id)">付款</div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="成交经纪人" width="150 ">
          <template slot-scope="scope">
            <p>{{scope.row.dealAgentName}}</p>
            <p>{{scope.row.dealAgentStoreName}}</p>
          </template>
        </el-table-column>
        <el-table-column align="left" label="签约日期" width="100">
          <template slot-scope="scope">
            {{scope.row.signDate.substr(0, 10)}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="可分配业绩" prop="distributableAchievement" width="100">
        </el-table-column>
        <el-table-column align="left" label="合同状态" prop="contState.label" width="100">
        </el-table-column>
        <el-table-column align="left" label="审核状态" prop="toExamineState.label" width="120">
        </el-table-column>
        <el-table-column align="left" label="备注" width="200">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <div style="width:160px">
                {{scope.row.remarks?scope.row.remarks:'-'}}
              </div>
              <div slot="reference" class="name-wrapper">
                {{scope.row.remarks?scope.row.remarks:'-'}}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="left" label="变更/解约" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.contChangeState.label==='未变更/解约'">-</span>
            <el-button type="text" size="medium" v-else @click="goChangeCancel(scope.row)">{{scope.row.contChangeState.label}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="left" label="后期状态" width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.laterStageState.label==='已拒绝'" type="text" size="medium" @click="uploadData(scope.row)">已拒绝</el-button>
            <span v-else>{{scope.row.laterStageState.label}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="后期进度" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.stepInstanceName==='-'">-</span>
            <el-button v-else type="text" size="medium" @click="showStepInstance(scope.row)">{{scope.row.stepInstanceName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="left" label="收佣状态" width="100">
          <template slot-scope="scope">
            {{scope.row.receivedCommission}}/{{scope.row.receivableCommission}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="结算状态" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="closeAccount(scope.row)">{{scope.row.resultState.label}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="left" label="业绩状态" width="110">
          <template slot-scope="scope">
            {{scope.row.achievementState.label}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="操作" width="150">
          <template slot-scope="scope">
            <div style="text-align:center">
              <el-button type="text" size="medium" v-if="scope.row.contState.value!=1" @click="upload(scope.row.id)">上传</el-button>
              <el-button type="text" size="medium" @click="goPreview(scope.row)">预览</el-button>
              <el-button type="text" size="medium" v-if="scope.row.toExamineState.value===6" @click="goCheck(scope.row)">审核</el-button> 
              <el-button type="text" size="medium" @click="toLayerAudit(scope.row)">调佣</el-button>
              <el-button type="text" size="medium" v-if="scope.row.toExamineState.value<0||scope.row.toExamineState.value===8" @click="submitAudit(scope.row)">提审</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination-info" @current-change="handleCurrentChange" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 流水明细弹框 -->
    <flowAccount :dialogTableVisible="water" :contCode="contCode" @closeRunningWater="closeWater" v-if="water"></flowAccount>
    <!-- 调佣弹框 -->
    <layerAudit :dialogVisible="tiaoyong" :contractCode="contractCode" @closeCentCommission="closeCommission" v-if='contractCode'></layerAudit>
    <!-- 结算弹窗 -->
    <layerSettle :settleDialog="jiesuan" :contId="settleId" @closeSettle="closeSettle" v-if='settleId'></layerSettle>
    <!-- 变更/解约查看 合同主体上传弹窗 -->
    <changeCancel :dialogType="dialogType" :cancelDialog="changeCancel" :contId="contId" @closeChangeCancel="ChangeCancelDialog" v-if="changeCancel"></changeCancel>
    <!-- 后期进度查看 -->
    <LayerLateProgress title="查看交易流程" ref="lateProgress"></LayerLateProgress>
  </div>
</template>
           
<script>
import ScreeningTop from "@/components/ScreeningTop";
import flowAccount from "@/components/flowAccount";
import layerAudit from "../contractDialog/layerAudit";
import layerSettle from "../contractDialog/layerSettle";
import changeCancel from "../contractDialog/changeCancel";
import LayerLateProgress from '@/components/LayerLateProgress';
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";

export default {
  mixins: [MIXINS],
  components: {
    ScreeningTop,
    flowAccount,
    layerAudit,
    layerSettle,
    changeCancel,
    LayerLateProgress
  },
  data() {
    return {
      contractForm: {},
      keyword: "",
      signDate: [],
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      water: false,
      contractCode: "",
      tiaoyong: false,
      jiesuan: false,
      changeCancel: false,
      dialogType: "",
      dictionary: {
        //数据字典
        "10": "", //合同类型
        "9": "", //合同状态
        "51": "", //审核状态
        "6": "", //变更/解约
        "14": "", //结算状态
        "13": "", //收佣状态
        "54": "", //业绩状态
        "538": "" //用途
      },
      loading:false,
      //部门选择列表
      options:[],
      //经纪人列表
      brokersList:[],
      //合同id
      contId:'',
      settleId:'',
      //流水用合同编号
      contCode:''
    };
  },
  created() {
    this.getContractList();
    this.getDictionary();
    //his.getDeps('');
  },
  methods: {
    //获取合同列表
    getContractList() {
      let param = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.keyword
      };
      param = Object.assign({}, param, this.contractForm);
      if (this.signDate.length > 0) {
        param.beginDate = this.signDate[0];
        param.endDate = this.signDate[1];
      }
      //console.log(param)
      this.$ajax.postJSON("/api/contract/contractList", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.tableData = res.data.list;
          this.total = res.data.count;
        }
      });
    },
    //重置
    resetFormFn() {
      TOOL.clearForm(this.contractForm);
      this.keyword = "";
      this.signDate = [];
    },
    // 查询
    queryFn() {
      console.log(this.signDate);
      // if(this.signDate.length>0){
      //   this.contractForm.beginDate=this.signDate[0].replace(/-/g,"/");
      //   this.contractForm.endDate=this.signDate[1].replace(/-/g,"/");
      // }
      //console.log(this.contractForm)
      this.getContractList();
    },
    //流水
    runningWater(code) {
      this.water = true;
      this.contCode=code;
    },
    //关闭流水弹窗
    closeWater() {
      this.water = false;
      this.contCode=''
    },
    //收款
    gathering(id) {
      //console.log(id);
      this.$router.push({
        path:'/receiptBill',
        query:{
          contId:id
        }
      })
    },
    //付款
    payment(id) {
      //console.log(id);
       this.$router.push({
        path:'/payBill',
        query:{
          contId:id
        }
      })
    },
    //合同详情页
    toDetail(value) {
      console.log(value)
      if(value.contType.value===1||value.contType.value===2||value.contType.value===3){
        this.$router.push({
          path: "/contractDetails",
          query: {
            id: value.id,//合同id
            code: value.code,//合同编号
            contType: value.contType.value//合同类型
          }
        });
      }else{
        this.$router.push({
        path: "/detailIntention",
        query: {
          id: value.id,
          contType: value.contType.value
        }
      });
      }
    },
    uploadData(value) {
      // console.log(value)
      this.$router.push({
        path: "/contractDetails",
        query: {
          type: "dataBank",
          id: value.id,
          contType: value.contType.value
        }
      });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getContractList();
    },
    //新增合同
    toAddcontract(command) {
      if (command === 1 || command === 2 || command === 3) {
        this.$router.push({
          path: "/addContract",
          query: {
            type: command
          }
        });
      } else if (command === 4 || command === 5) {
        this.$router.push({
          path: "/newIntention",
          query: {
            contType: command
          }
        });
      }
    },
    //合同预览
    goPreview(item) {
      this.$router.push({
        path: "/contractPreview",
        query: {
          id: item.id
        }
      });
    },
    //合同审核
    goCheck(item) {
      this.$router.push({
        path:'/contractPreview',
        query:{
          code:item.code,
          operationType:'check',
          id:item.id
        }
      })
    },
    //调佣弹窗
    //Z171231001
    toLayerAudit(item) {
      if(item.isCanChangeCommission===1){
        this.contractCode = item.code;
        this.tiaoyong = true;
      }else{
        this.$alert('已存在未审核的调佣申请，不允许重复提交！', '提示', {
          confirmButtonText: '确定',
        });
      }
    },
    //关闭调佣弹窗
    closeCommission() {
      this.tiaoyong = false;
      this.contractCode = "";
      this.getContractList();
    },
    //关闭变更解约弹窗
    ChangeCancelDialog() {
      this.changeCancel = false;
      this.contId='';
    },
    //字典查询
    getDictionaries() {
      this.$ajas.get("/api/dictionary/batchQuery", param).then(res => {});
    },
    //变更解约弹窗
    goChangeCancel(item) {
      console.log(item.contChangeState.value);
      //debugger
      if (item.contChangeState.value === 1) {
        this.changeCancel = true;
        this.dialogType = "changeLook";
        this.contId=item.id;
      } else if (item.contChangeState.value === 2) {
        this.changeCancel = true;
        this.dialogType = "cancelLook";
        this.contId=item.id;
      }
    },
    //上传合同主体
    upload(id) {
      //console.log(code);
      this.changeCancel = true;
      this.dialogType = "upload";
      this.contId = id
    },
    //获取当前部门
    getDeps(key){
      let param = {
        keyword:key
      }
      this.$ajax.get('/api/access/deps', param).then(res=>{
        this.loading=false;
        res=res.data
        if(res.status===200){
          this.options=res.data
        }
      })
    },
    remoteMethod(query){
      if (query !== '') {
        this.loading = true;
        this.getDeps(query)
      } else{

      }
    },
    getBroker(id){
      console.log(id)
      let param = {
        depId:id
      }
      this.$ajax.get('/api/organize/employees', param).then(res=>{
        res=res.data
        if(res.status===200){
          this.brokersList=res.data
        }
      })
    },
    //提审
    submitAudit(item){
      let param = {
        cityId:item.cityCode,
        flowType:3,
        bizCode:item.code
      }
      this.$ajax.get('/api/machine/submitAduit', param).then(res=>{
        res=res.data
        if(res.status===200){
          this.getContractList()
        }else{
          this.$message({
            message:res.message
          })
        }
      })
    },
    //发起结算弹窗
    closeAccount(item){
      console.log(item);
      if(item.resultState.value===2){
        this.$message({
          message:'已结算完成，无需发起结算'
        })
      }else{
        this.jiesuan=true;
        this.settleId=item.id;
      }
      
    },
    //关闭结算弹窗
    closeSettle(){
      this.jiesuan = false;
      this.settleId = "";
      this.getContractList();
    },
    //后期流程查看
    showStepInstance(item){
      let value = {
        id:item.id,
        transFlowName:item.stepInstanceName,
        statusReceiveAmount:item.receiveAmountState
      }
      this.$refs.lateProgress.show(value);
    }
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";

.view-container {
  //padding: 0 20px;
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
.contract-list {
  margin-top: 20px;
  background-color: #fff;
  padding: 0 10px;
  border-radius: 2px;
  box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  > p {
    // padding-left: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .title {
      font-size: 14px;
      color: @color-blank;
      i {
        padding-right: 8px;
      }
    }
    .text {
      font-size: 14px;
      color: @color-6c;
      padding-left: 10px;
    }
    .data {
      font-size: 14px;
      color: @color-blue;
    }
  }
  .name-wrapper {
    width: 160px;
    height: 65px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
}
.contract_msg{
  display: flex;
   align-items: center;
  .riskLabel{
    width: 20px;
    padding-right: 20px;
    color: @color-orange;
    font-size: 18px;
    .risk{
      color: @color-warning;
    }
    
  }
  .contract-msglist {
    > li {
      text-align: left;
    }
  }
}

.blue {
  color: @color-blue;
}
.yellow {
  color: @color-yellow;
}
.green {
  color: @color-green;
}
.red {
  color: @color-warning;
}
.btn {
  color: @color-blue;
  cursor: pointer;
}
/deep/ .el-table th {
  background: @bg-th;
}
</style>