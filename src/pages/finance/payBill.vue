<template>
  <div class="view">
    <p>付款信息</p>
    <section>
      <div class="input-group">
        <label>收款方</label>
        <el-select v-model="form.person" placeholder="请选择">
          <el-option
            v-for="item in 5"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="input-group">
        <label>申请人:</label>
        <p>东野圭吾</p>
      </div>
    </section>
    <div class="input-group">
      <label>款类</label>
      <ul class="type-list">
        <li v-for="item in moneyType">{{item.name}}</li>
      </ul>
    </div>
    <div class="input-group">
      <p><label>付款金额</label><span>（可支配金额：1234）</span></p>
      <div class="span-join">
        <input type="number" class="no-style" placeholder="请填写支付金额">
        <span>元</span>
      </div>
    </div>
    <div class="input-group">
      <p><label>收款账户</label></p>
      <el-table border :data="list" style="width: 100%" header-row-class-name="theader-bg">
        <el-table-column align="center" label="收款银行">
          <template slot-scope="scope">
            <span>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="户名">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入">
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款账户 ">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入">
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额（元）">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入">
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="input-group">
      <p><label>备注信息</label></p>
      <el-input placeholder="请填写备注信息" type="textarea"></el-input>
    </div>
    <div class="input-group">
      <p><label>付款凭证</label></p>
      <ul class="upload-list">
        <li>
          <p>+</p>
        </li>
      </ul>
    </div>
    <p>
      <el-button type="primary" @click="goResult">提交付款申请</el-button>
      <el-button>取消</el-button>
    </p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          person: ''
        },
        moneyType: [
          {
            index: 1,
            name: '二手买卖佣金'
          },
          {
            index: 2,
            name: '二手低佣买卖佣金'
          },
          {
            index: 3,
            name: '租赁佣金'
          },
          {
            index: 4,
            name: '代办佣金'
          },
          {
            index: 5,
            name: '金融服务费'
          },
          {
            index: 6,
            name: '房款'
          },
          {
            index: 7,
            name: '物业保证金'
          },
          {
            index: 8,
            name: '定金'
          },
          {
            index: 9,
            name: '违约金'
          },
          {
            index: 10,
            name: '意向金'
          }
        ],
        list:[
          {}
        ]
      }
    },
    methods:{
      goResult:function () {
        this.$router.push({
          path:'payResult'
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  .input-group {
    margin: 0;
    display: block;
    max-width: 815px;
    .type-list{
      display: flex;
      flex-wrap: wrap;
      margin: 20px 0px;
      >li{
        width: 150px;
        padding: 10px;
        box-sizing: border-box;
        text-align: center;
        margin: 0 10px 10px 0;
        border: 1px solid @color-D6;
        color: @color-6c;
        &.active{
          color: @color-blue;
          border-color: @color-blue;
        }
      }
    }
    .span-join{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      max-width: 300px;
      margin: 20px 0;
      padding: 6px 8px;
      border: 1px solid @color-D6;
      border-radius: 4px;
      >input{
        flex: 1;
      }
    }
    .upload-list{
      display: flex;
      flex-wrap: wrap;
      margin: 20px 0;
      >li{
        border: 1px dashed @color-D6;
        width: 200px;
        height: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    /deep/ .el-table,.el-textarea{
      margin: 20px 0;
    }
  }

  .view {
    background-color: @bg-white;
    padding: 20px;
    > section {
      margin: 20px 0px;
      &:first-of-type {
        display: flex;
        .input-group{
          display: flex;
          &:first-of-type{
            margin-right: 40px;
          }
        }
      }
    }
  }
</style>
