<template>
  <div class="view-container">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn" :min="45">
      <el-form :inline="true" :model="contractForm" class="prop-form" size="mini">
        <el-form-item label="签约日期">
          <el-date-picker v-model="contractForm.signDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:330px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同类型">
          <el-select v-model="contractForm.contType" placeholder="请选择合同类型" style="width:150px">
            <el-option label="租赁" value="1"></el-option>
            <el-option label="买卖" value="2"></el-option>
            <el-option label="代办" value="3"></el-option>
            <el-option label="意向" value="4"></el-option>
          </el-select>  
        </el-form-item>
        <el-form-item label="合同状态">
          <el-select v-model="contractForm.contState" placeholder="请选择合同状态" style="width:150px">
            <el-option label="起草中" value="1"></el-option>
            <el-option label="已签章" value="2"></el-option>
            <el-option label="已上传" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用途">
          <el-select v-model="contractForm.houseinfoPurpose" placeholder="请选择用途" style="width:150px">
            <el-option value=""></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="contractForm.keyWord" placeholder="关键字" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="contractForm.recordDept" placeholder="请选择部门" style="width:200px">
            <el-option label="起草中" value="1"></el-option>
            <el-option label="已签章" value="2"></el-option>
            <el-option label="已上传" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="contractForm.recordDept" placeholder="请选择" style="width:100px">
            <el-option label="起草中" value="1"></el-option>
            <el-option label="已签章" value="2"></el-option>
            <el-option label="已上传" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="contractForm.toExamineState" placeholder="请选择审核状态" style="width:150px">
            <el-option label="未提审" value="1"></el-option>
            <el-option label="审核中" value="2"></el-option>
            <el-option label="通过" value="3"></el-option>
            <el-option label="驳回" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变更/解约">
          <el-select v-model="contractForm.contChangeState" placeholder="" style="width:150px">
            <el-option label="已变更" value="1"></el-option>
            <el-option label="已解约" value="2"></el-option>
            <el-option label="未变更/解约" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算状态">
          <el-select v-model="contractForm.resultState" placeholder="" style="width:150px">
            <el-option label="未结算" value="1"></el-option>
            <el-option label="已结算" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收佣状态">
          <el-select v-model="contractForm.receiveAmountState" placeholder="" style="width:150px">
            <el-option label="未收" value="1"></el-option>
            <el-option label="部分" value="2"></el-option>
            <el-option label="收齐" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业绩状态">
          <el-select v-model="contractForm.achievementState" placeholder="" style="width:150px">
            <el-option label="未审核" value="1"></el-option>
            <el-option label="审核中" value="2"></el-option>
            <el-option label="通过" value="3"></el-option>
            <el-option label="驳回" value="4"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <!-- 合同列表 -->
    <div class="contract-list">
      <p>
        <span>
          <span class="title"><i class="iconfont icon-tubiao-11"></i>数据列表</span>
          <span class="text">有效成分汇总 </span>
          <span class="text">租赁：</span> <span class="data">123165</span>
          <span class="text">买卖：</span> <span class="data">75454</span>
          <span class="text">代办：</span> <span class="data">5565</span>
          <span class="text">意向：</span> <span class="data">0</span>
          <span class="text">定金：</span> <span class="data">0</span>
          <span class="text">可分配业绩汇总：</span> <span class="data">564654</span>
          <span class="text">单数：</span> <span class="data">13</span>
        </span>
        <span>
          <el-dropdown placement="bottom">
            <el-button round>
              打印空白合同<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>租赁</el-dropdown-item>
              <el-dropdown-item>买卖</el-dropdown-item>
              <el-dropdown-item>代办</el-dropdown-item>
              <el-dropdown-item>意向</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown  placement="bottom" @command="toAddcontract">
            <el-button round>
              创建正式合同<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">租赁</el-dropdown-item>
              <el-dropdown-item command="2">买卖</el-dropdown-item>
              <el-dropdown-item command="3">代办</el-dropdown-item>
              <el-dropdown-item command="4">意向</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </p>
      <el-table :data="tableData" style="width: 100%" @row-dblclick='toDetail'>
        <el-table-column align="left" label="合同信息" width="250" fixed>
          <template slot-scope="scope">
            <ul class="contract-msglist">
              <li>合同编号：<span>{{scope.row.code}}</span></li>
              <li>房源编号：<span>{{scope.row.houseinfoCode}}</span></li>
              <li>客源编号：<span>{{scope.row.guestinfoCode}}</span></li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column align="left" label="合同类型" width="100" fixed>
          <template slot-scope="scope">
            <span v-if="scope.row.contType===1">租赁</span>
            <span v-if="scope.row.contType===2">买卖</span>
            <span v-if="scope.row.contType===3">代办</span>
            <span v-if="scope.row.contType===4">意向</span>
          </template>
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
        <el-table-column align="left" label="成交经纪人" prop="dealAgentStoreName" width="150 ">
        </el-table-column>
        <el-table-column align="left" label="签约日期" prop="signDate" width="100">
        </el-table-column>
        <el-table-column align="left" label="可分配业绩" prop="receivedCommission" width="100">
        </el-table-column>
        <el-table-column align="left" label="合同状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.contState===1">起草中</span>
            <span v-if="scope.row.contState===2">已签章</span>
            <span v-if="scope.row.contState===3">已上传</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="审核状态" prop="toExamineState" width="100">
          <template slot-scope="scope">
            <span class="blue" v-if="scope.row.toExamineState===1">未提审</span>
            <span class="yellow" v-if="scope.row.toExamineState===2">审核中</span>
            <span class="green" v-if="scope.row.toExamineState===3">通过</span>
            <span class="red" v-if="scope.row.toExamineState===4">驳回</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="备注" width="200">
          <template slot-scope="scope">
            {{scope.row.remarks?scope.row.remarks:'-'}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="变更/解约" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.contChangeState===1">变更</span>
            <span v-if="scope.row.contChangeState===2">解约</span>
            <span v-if="scope.row.contChangeState===3">-</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="后期状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.laterStageState===1">未提交</span>
            <span v-if="scope.row.laterStageState===2">已提交</span>
            <span v-if="scope.row.laterStageState===3">已开始</span>
            <el-button v-if="scope.row.laterStageState===4" type="text" size="medium" @click="uploadData(scope.row)">已拒绝</el-button>
            <span v-if="scope.row.laterStageState===5">已结束</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="后期进度" width="100">
          <template slot-scope="scope">
            资料准备
          </template>
        </el-table-column>
        <el-table-column align="left" label="收佣状态" width="100">
          <template slot-scope="scope">
            {{scope.row.receivedCommission}}/{{scope.row.receivableCommission}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="结算状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.resultState===1">已结算</span>
            <span v-if="scope.row.resultState===2">未结算</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="业绩状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.contState===1">起草中</span>
            <span v-if="scope.row.contState===2">已签章</span>
            <span v-if="scope.row.contState===3">已上传</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="medium">上传</el-button>
            <el-button type="text" size="medium" @click="goPreview">预览</el-button>
            <el-button type="text" size="medium">提审</el-button>
            <el-button type="text" size="medium" @click="tiaoyong=true">调佣</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </div>
    <!-- 流水明细弹框 -->
    <flowAccount :dialogTableVisible="liushui" @closeRunningWater="closeWater"></flowAccount>
    <!-- 调佣弹框 -->
    <layerAudit :dialogVisible="tiaoyong" @closeCentCommission="closeCommission"></layerAudit>
  </div>
</template>
           
<script>
import ScreeningTop from '@/components/ScreeningTop';
import flowAccount from '@/components/flowAccount';
import layerAudit from '../contractDialog/layerAudit';

export default {
  components: {
    ScreeningTop,
    flowAccount,
    layerAudit
  },
  data(){
    return{
      contractForm:{},
      tableData:[{
        code:'YQYD110063',
        houseinfoCode:'YQYD110063张三',
        guestinfoCode:'YQYD110063张三',
        contType:1,
        propertyAddr:'沿河花园',
        dealPrice:'12345121',
        dealAgentStoreName:'当代一店下雨天',
        signDate:'2018/11/07',
        receivedCommission:'3500',
        receivableCommission:'3500',
        contState:2,
        toExamineState:1,
        remarks:'',
        contChangeState:1,
        laterStageState:4,
        resultState:1
      },
      {
        code:'YQYD110063',
        houseinfoCode:'YQYD110063张三',
        guestinfoCode:'YQYD110063张三',
        contType:2,
        propertyAddr:'沿河花园',
        dealPrice:'12345121',
        dealAgentStoreName:'当代一店下雨天',
        signDate:'2018/11/07',
        receivedCommission:'3500',
        receivableCommission:'3500',
        contState:2,
        toExamineState:2,
        remarks:'',
        contChangeState:1,
        laterStageState:5,
        resultState:1
      },
      {
        code:'YQYD110063',
        houseinfoCode:'YQYD110063张三',
        guestinfoCode:'YQYD110063张三',
        contType:2,
        propertyAddr:'沿河花园',
        dealPrice:'12345121',
        dealAgentStoreName:'当代一店下雨天',
        signDate:'2018/11/07',
        receivedCommission:'3500',
        receivableCommission:'3500',
        contState:2,
        toExamineState:3,
        remarks:'',
        contChangeState:1,
        laterStageState:5,
        resultState:1
      },
      {
        code:'YQYD110063',
        houseinfoCode:'YQYD110063张三',
        guestinfoCode:'YQYD110063张三',
        contType:1,
        propertyAddr:'沿河花园',
        dealPrice:'12345121',
        dealAgentStoreName:'当代一店下雨天',
        signDate:'2018/11/07',
        receivedCommission:'3500',
        receivableCommission:'3500',
        contState:2,
        toExamineState:4,
        remarks:'',
        contChangeState:1,
        laterStageState:5,
        resultState:1
      }],
      total:0,
      liushui:false,
      tiaoyong:false
    }
  },
  created(){
    this.getContractList()
  },
  methods:{
    //获取合同列表
    getContractList(){
      let param = {
        pageNum:'1',
        pageSize:'10',
        // keyWord:'',
        cont:{}
      }
      this.$ajax.post('/api/contract/contractList', param).then(res=>{

      })
    },
    resetFormFn() {
      this.$refs.propForm.resetFields()
    },
    // 查询
    queryFn() {
        console.log('查询')
    },
    //流水
    runningWater(){
      this.liushui=true
    },
    //收款
    gathering(){},
    //付款
    payment(){},
    //合同详情页
    toDetail(value){
      console.log(value)
      this.$router.push({
        path:'/contractDetails',
        query:{
          id: value.code,
          contType:value.contType
        }
      })
    },
    uploadData(value){
      // console.log(value)
       this.$router.push({
        path:'/contractDetails',
        query:{
          type:'dataBank',
          id: value.code,
          contType:value.contType
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    //新增合同
    toAddcontract(command){
      if(command==='1'||command==='2'){
        this.$router.push({
          path:'/addContract',
          query:{
            type:command
          }
        })
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
    //关闭流水弹窗
    closeWater(){
      this.liushui=false
    },
    //关闭调佣弹窗
    closeCommission(){
      this.tiaoyong=false
    }
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";

.view-container{
  padding: 0 20px;
}
/deep/.paper-box{
  padding-top: 10px !important;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius:2px;
  box-sizing: border-box;
  box-shadow:0px 1px 6px 0px rgba(7,47,116,0.1);
  .paper-set-tit{
    padding-bottom: 10px;
  }
}
.contract-list {
  margin-top:20px;
  background-color: #fff;
  padding: 10px;
  border-radius:2px;
  box-shadow:0px 1px 6px 0px rgba(7,47,116,0.1);
  > p {
    padding: 10px 0 10px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .title{
      font-size: 18px;
      color: @color-blank;
      i{
        padding-right: 8px;
      }
    }
    .text{
      font-size: 14px;
      color:@color-6c;
      padding-left: 10px;
    }
    .data{
      font-size: 14px;
      color: @color-blue;
    }
  }
}
.contract-msglist{
  >li{
    text-align: left;
  }
}
.blue{
  color: @color-blue;
}
.yellow{
  color: @color-yellow;
}
.green{
  color: @color-green;
}
.red{
  color: @color-warning;
}
.btn{
  color: @color-blue;
  cursor: pointer;
}
/deep/ .el-table th {
  background:@bg-th;
}
</style>