<template>
  <div class="view-container">
    <el-form :inline="true" :model="contractForm" class="demo-form-inline">
      <el-form-item label="签约日期">
        <el-date-picker type="date" placeholder="选择日期" v-model="contractForm.signDate" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item label="合同类型">
        <el-select v-model="contractForm.contType" placeholder="">
          <el-option label="租赁" value="1"></el-option>
          <el-option label="买卖" value="2"></el-option>
          <el-option label="代办" value="3"></el-option>
          <el-option label="意向" value="4"></el-option>
          <el-option label="定金" value="5"></el-option>
        </el-select>  
      </el-form-item>
      <el-form-item label="合同状态">
        <el-select v-model="contractForm.contState" placeholder="">
          <el-option label="起草中" value="1"></el-option>
          <el-option label="已签章" value="2"></el-option>
          <el-option label="已上传" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用途">
        <el-select v-model="contractForm.houseinfoPurpose" placeholder="">
          <el-option value=""></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字">
        <el-input v-model="contractForm.keyWord" placeholder="物业地址/业主/客户/房产证号/手机号/合同编号/房源编号/客源编号"></el-input>
      </el-form-item>
      <el-form-item label="部门">
        <el-select v-model="contractForm.recordDept" placeholder="">
          <el-option label="起草中" value="1"></el-option>
          <el-option label="已签章" value="2"></el-option>
          <el-option label="已上传" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="contractForm.toExamineState" placeholder="">
          <el-option label="未提审" value="1"></el-option>
          <el-option label="审核中" value="2"></el-option>
          <el-option label="通过" value="3"></el-option>
          <el-option label="驳回" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="变更/解约">
        <el-select v-model="contractForm.contChangeState" placeholder="">
          <el-option label="已变更" value="1"></el-option>
          <el-option label="已解约" value="2"></el-option>
          <el-option label="未变更/解约" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结算状态">
        <el-select v-model="contractForm.resultState" placeholder="">
          <el-option label="未结算" value="1"></el-option>
          <el-option label="已结算" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收佣状态">
        <el-select v-model="contractForm.receiveAmountState" placeholder="">
          <el-option label="未收" value="1"></el-option>
          <el-option label="部分" value="2"></el-option>
          <el-option label="收齐" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业绩状态">
        <el-select v-model="contractForm.achievementState" placeholder="">
          <el-option label="未审核" value="1"></el-option>
          <el-option label="审核中" value="2"></el-option>
          <el-option label="通过" value="3"></el-option>
          <el-option label="驳回" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
           
<script>
export default {
  data(){
    return{
      contractForm:{

      }
    }
  },
  created(){
    //this.getContractList()
  },
  methods:{
    //获取合同列表
    getContractList(){
      let param = {
        pageNum:'1',
        pageSize:'10',
        keyWord:'',
        cont:{}
      }
      this.$ajax.post('/api/contract/contractList', param).then(res=>{

      })
    },
    //搜索
    onSearch(){}
  }
};
</script>
<style scoped>
</style>