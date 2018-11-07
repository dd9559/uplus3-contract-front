<template>
  <div class="view-container">
    <el-form :inline="true" :model="addForm" :rules="rules" ref="ruleForm" class="add-form" size="mini">
      <!-- 合同信息 -->
      <div class="contractMsg">
        <p>合同信息</p>
        <div class="form-content">
          <el-form-item label="签约日期：" prop="date">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.date" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="合同类型：">
            <el-input
              placeholder="请输入内容"
              v-model="addForm.contType"
              :disabled="true">
            </el-input>
          </el-form-item>
          <el-form-item label="成交总价：" prop="">
            <el-input v-model="addForm.dealPrice" placeholder="请输入内容"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="客户保证金：" prop="">
            <el-input v-model="addForm.dealPrice" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="客户佣金：" prop="">
            <el-input v-model="addForm.custCommission" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="业主佣金：" prop="">
            <el-input v-model="addForm.ownerCommission" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="佣金支付费：" prop="">
            <el-input v-model="addForm.commissionPayment" placeholder="请输入内容"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="交易流程：" prop="">
            <el-select v-model="addForm.jylc" placeholder="请选择交易流程">
              <el-option label="一次性（业）+ 按揭（客）" value="1"></el-option>
            </el-select>  
          </el-form-item>
          <el-form-item label="按揭手续费：" prop="">
            <el-select v-model="addForm.sxf" placeholder="请选择手续费">
              <el-option label="另外出-客户-300元" value="1"></el-option>
            </el-select>  
          </el-form-item>
        </div>
      </div>
      <!-- 房源信息 -->
      <div class="houseMsg">
        <p>房源信息</p>
        <div class="form-content">
          <el-form-item label="房源编号：" prop="">
            <span class="select">请选择房源</span> 
          </el-form-item>
          <el-form-item label="物业地址：">
            <el-input
              placeholder="请输入内容"
              v-model="addForm.contType"
              :disabled="true">
            </el-input>
          </el-form-item>
          <br>
          <el-form-item label="建筑面积：" prop="">
            <el-input v-model="addForm.architectureArea" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="套内面积：" prop="">
            <el-input v-model="addForm.insideArea" placeholder="请输入内容"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="产权状态：" prop="">
            <el-select v-model="addForm.cqzt" placeholder="请选择状态">
              <el-option label="抵押" value="1"></el-option>
            </el-select>  
          </el-form-item>
          <el-form-item label="按揭银行：" prop="">
            <el-select v-model="addForm.ajyh" placeholder="请选择银行">
              <el-option label="中国工商银行" value="1"></el-option>
              <el-option label="中国建设银行" value="2"></el-option>
              <el-option label="中国银行" value="3"></el-option>
              <el-option label="中国农业银行" value="4"></el-option>
              <el-option label="交通银行" value="5"></el-option>
              <el-option label="招商银行" value="6"></el-option>
              <el-option label="中信银行" value="7"></el-option>
              <el-option label="中国民生银行" value="8"></el-option>
              <el-option label="兴业银行" value="9"></el-option>
              <el-option label="上海浦东发展银行" value="10"></el-option>
              <el-option label="中国邮政储蓄银行" value="11"></el-option>
              <el-option label="中国光大银行" value="12"></el-option>
              <el-option label="平安银行" value="13"></el-option>
              <el-option label="华夏银行" value="14"></el-option>
            </el-select>  
          </el-form-item>
          <el-form-item label="按揭欠款：" prop="">
            <el-input v-model="addForm.ajqk" placeholder="请输入内容"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="产权地址：" prop="">
            <el-input v-model="addForm.cqdz" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="房产证号：" prop="">
            <el-input v-model="addForm.property" placeholder="请输入内容"></el-input>
          </el-form-item>
        </div>
      </div>
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
    </el-form>
  </div>
</template>
           
<script>
export default {
  data(){
    return{
      addForm:{},
      rules: {
        date: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ]
      }
    }
  },
  methods:{
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
};
</script>
<style scoped lang="less">

@import "~@/assets/common.less";
.view-container{
  background: @bg-white;
  .add-form{
    padding: 10px;
    font-size: 14px;
  }
}
.contractMsg{
  border-bottom: 1px solid @border-ED;
  > p{
    padding-bottom: 10px;
    padding-left: 20px;
    font-size: 14px;
  }
  .form-content{
    padding-left: 30px;
  }
}
.houseMsg{
  border-bottom: 1px solid @border-ED;
  > p{
    padding: 20px 0 10px 20px;
    font-size: 14px;
  }
  .form-content{
    padding-left: 30px;
    .select{
      display: inline-block;
      text-align: center;
      color: @color-white;
      width: 140px;
      padding: 4px 0;
      background: @color-blue;
      border-radius: 2px;
    }
  }
}
</style>