<template>
  <div class="view">
    <div class="view-context">
      <h3>{{type===1?'POS收款订单创建成功':'收款信息录入成功'}}</h3>
      <p>已成功生成收款单</p>
      <div class="bill-result-table">
        <p v-if="type===1">请在POS机上进行收款</p>
        <el-table border :data="list" style="width: 100%" header-row-class-name="theader-bg">
          <el-table-column align="center" label="现金">
            <template slot-scope="scope">
              <span>-</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="转账">
            <template slot-scope="scope">

            </template>
          </el-table-column>
          <el-table-column align="center" label="POS刷卡">
            <template slot-scope="scope">

            </template>
          </el-table-column>
          <el-table-column align="center" label="合计金额">
            <template slot-scope="scope">

            </template>
          </el-table-column>
        </el-table>
      </div>
      <p>
        <el-button type="primary">开票</el-button>
        <el-button @click="goBack('contract')">返回合同列表</el-button>
        <el-button @click="goBack('bill')">返回收付款列表</el-button>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "receipt-result",
    data(){
      return{
        list:[
          {}
        ],
        type:1,//1=POS收款单
      }
    },
    mounted(){
      this.steps.find(item=>{
        if(!item.state){
          this.activeStep=item.index-1
          return true
        }
      })
    },
    methods:{
      goBack:function (page) {
        this.$router.push({
          path:page
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  .view{
    background-color: @bg-white;
    position: relative;
    &-context{
      position: absolute;
      top: 50%;
      left: 50%;
      transform:translate(-50%,-50%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      >h3{
        color: @color-324;
      }
      >p{
        &:first-of-type{
          color: @color-99A;
          margin: 20px 0;
        }
      }
      .bill-result-table{
        margin: 70px 0;
        text-align: center;
        >p{
          color: @color-324;
          margin-bottom: 20px;
        }
      }
    }
  }
</style>
