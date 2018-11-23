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
          <el-input v-model="keyword" placeholder="关键字" style="width:250px"></el-input>
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
            <el-option v-for="item in dictionary['17']" :key="item.key" :label="item.value" :value="item.key">
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
            <el-option v-for="item in dictionary['2']" :key="item.key" :label="item.value" :value="item.key">
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
              <!-- <el-dropdown-item command="1">租赁</el-dropdown-item>
              <el-dropdown-item command="2">买卖</el-dropdown-item>
              <el-dropdown-item command="3">代办</el-dropdown-item>
              <el-dropdown-item command="4">意向</el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </p>
      <el-table :data="tableData" style="width: 100%" @row-dblclick='toDetail'>
        <el-table-column align="left" label="合同信息" width="220" fixed>
          <template slot-scope="scope">
            <div class="contract_msg">
              <div class="riskLabel">
                <i class="iconfont icon-tubiao-6"></i>
                <i class="iconfont icon-tubiao-6"></i>
              </div>
              <ul class="contract-msglist">
                <li>合同编号：<span>{{scope.row.code}}</span></li>
                <li>房源编号：<span>{{scope.row.houseinfoCode}}</span></li>
                <li>客源编号：<span>{{scope.row.guestinfoCode}}</span></li>
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
            <div class="btn" @click="runningWater(scope.row)">流水</div>
            <div class="btn" @click="gathering(scope.row)">收款</div>
            <div class="btn" @click="payment(scope.row)">付款</div>
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
        <el-table-column align="left" label="后期进度" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.stepInstanceName==='-'">-</span>
            <el-button v-else type="text" size="medium">{{scope.row.stepInstanceName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="left" label="收佣状态" width="100">
          <template slot-scope="scope">
            {{scope.row.receivedCommission}}/{{scope.row.receivableCommission}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="结算状态" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="medium">{{scope.row.resultState.label}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="left" label="业绩状态" width="100">
          <template slot-scope="scope">
            {{scope.row.achievementState.label}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="操作" width="150">
          <template slot-scope="scope">
            <div style="text-align:center">
              <el-button type="text" size="medium" v-if="scope.row.contState.value!=3" @click="upload(scope.row.code)">上传</el-button>
              <el-button type="text" size="medium" @click="goPreview">预览</el-button>
              <el-button type="text" size="medium" v-if="scope.row.toExamineState.value===2" @click="goCheck(scope.row.id)">审核</el-button>
              <el-button type="text" size="medium" @click="toLayerAudit(scope.row)">调佣</el-button>
              <el-button type="text" size="medium" v-if="scope.row.toExamineState.value===1" @click="submitAudit(scope.row.id)">提审</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination-info" @current-change="handleCurrentChange" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 流水明细弹框 -->
    <flowAccount :dialogTableVisible="water" @closeRunningWater="closeWater" v-if="water"></flowAccount>
    <!-- 调佣弹框 -->
    <layerAudit :dialogVisible="tiaoyong" :contractCode="contractCode" @closeCentCommission="closeCommission" v-if='contractCode'></layerAudit>
    <!-- 变更/解约查看弹窗 -->
    <changeCancel :dialogType="dialogType" :cancelDialog="changeCancel" @closeChangeCancel="ChangeCancelDialog" v-if="changeCancel"></changeCancel>
  </div>
</template>
           
<script>
import ScreeningTop from "@/components/ScreeningTop";
import flowAccount from "@/components/flowAccount";
import layerAudit from "../contractDialog/layerAudit";
import changeCancel from "../contractDialog/changeCancel";
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";

export default {
  mixins: [MIXINS],
  components: {
    ScreeningTop,
    flowAccount,
    layerAudit,
    changeCancel
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
      changeCancel: false,
      dialogType: "",
      dictionary: {
        //数据字典
        "10": "", //合同类型
        "9": "", //合同状态
        "17": "", //审核状态
        "6": "", //变更/解约
        "14": "", //结算状态
        "13": "", //收佣状态
        "2": "", //业绩状态
        "538": "" //用途
      },
      loading:false,
      //部门选择列表
      options:[],
      //经纪人列表
      brokersList:[]
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
    runningWater() {
      this.water = true;
    },
    //收款
    gathering() {},
    //付款
    payment() {},
    //合同详情页
    toDetail(value) {
      console.log(value)
      if(value.contType.value===1||value.contType.value===2||value.contType.value===3){
        this.$router.push({
          path: "/contractDetails",
          query: {
            id: value.id,
            contType: value.contType.value
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
    goPreview() {
      this.$router.push({
        path: "/contractPreview",
        query: {
          id: 1
        }
      });
    },
    //合同审核
    goCheck(contId) {
      debugger
      this.$router.push({
        path:'/contractPreview',
        query:{
          id:contId,
          operationType:'check'
        }
      })
    },
    //关闭流水弹窗
    closeWater() {
      this.water = false;
    },
    //调佣弹窗
    //Z171231001
    toLayerAudit(item) {
      debugger
      if(item.isCanChangeCommission===1){
        this.contractCode = item.code;
        this.tiaoyong = true;
      }else{
        this.$alert('存在未审核的调佣申请,请处理后重试', '提示', {
          confirmButtonText: '确定',
        });
      }
    },
    //关闭调佣弹窗
    closeCommission() {
      this.tiaoyong = false;
      this.contractCode = "";
    },
    //关闭变更解约弹窗
    ChangeCancelDialog() {
      this.changeCancel = false;
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
      } else if (item.contChangeState.value === 2) {
        this.changeCancel = true;
        this.dialogType = "cancelLook";
      }
    },
    //上传合同主体
    upload(code) {
      console.log(code);
      this.changeCancel = true;
      this.dialogType = "upload";
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

        }
      })
    },
    //提审
    submitAudit(id){
      let param = {
        contractId:id
      }
      this.$ajax.post('/api/contract/contExamine', param).then(res=>{
        res=res.data
        if(res.status===200){
          this.getContractList()
        }
      })
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
  padding: 10px;
  border-radius: 2px;
  box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  > p {
    padding: 10px 0 10px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .title {
      font-size: 18px;
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