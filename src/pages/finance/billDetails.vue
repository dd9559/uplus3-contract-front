<template>
  <div class="view">
    <div class="bill-details-tab">
      <ul>
        <li v-for="(item,index) in tabs" :key="index" :class="[activeItem===item?'active':'']"
            @click="choseTab(item)">{{item}}
        </li>
      </ul>
      <p>
        <el-button type="primary">审核</el-button>
      </p>
    </div>
    <ul class="bill-details-content">
      <li>
        <h4>{{activeItem}}</h4>
        <el-table border :data="list" header-row-class-name="theader-bg">
          <el-table-column align="center" label="合同编号">
            <template slot-scope="scope">
              <span>{{billMsg.contCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="activeItem==='付款信息'?'付款ID':'收款ID'">
            <template slot-scope="scope">
              <span>{{billMsg.payCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="物业地址 ">
            <template slot-scope="scope">
              <span>{{billMsg.address}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="收款方" v-if="activeItem==='付款信息'">
            <template slot-scope="scope">
              <span>{{billMsg.inObjType|getLabel}}-{{billMsg.inObjName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="付款方" v-else>
            <template slot-scope="scope">
              <span>{{billMsg.outObjType|getLabel}}-{{billMsg.outObj}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="付款时间" v-if="activeItem==='付款信息'">
            <template slot-scope="scope">
              <span>{{billMsg.toAccountTime|formatDate}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="收款时间" v-else>
            <template slot-scope="scope">
              <span>{{billMsg.createTime|formatDate}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="发起人" v-if="activeItem==='付款信息'">
            <template slot-scope="scope">
              <span>{{billMsg.createByName}}-{{billMsg.store}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="收款人" v-else>
            <template slot-scope="scope">
              <span>{{billMsg.inObjName}}-{{billMsg.store}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="款类" v-if="activeItem==='付款信息'">
            <template slot-scope="scope">
              <span>{{billMsg.moneyType}}</span>
            </template>
          </el-table-column>
        </el-table>
      </li>
      <li v-if="activeItem==='收款信息'">
        <h4>合计金额</h4>
        <p class="total-text">合计：<span>23680</span>元</p>
        <el-table border :data="billMsg.inAccount" header-row-class-name="theader-bg">
          <el-table-column align="center" label="款类">
            <template slot-scope="scope">
              <span>{{billMsg.moneyType}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="票据">
            <template slot-scope="scope">
              <span>{{billMsg.billCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="支付方式">
            <template slot-scope="scope">
              <span>{{billMsg.method}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="金额（元）">
            <template slot-scope="scope">
              <span>{{billMsg.amount}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="200" align="center" label="收款账户">
            <template slot-scope="scope">
              <p>{{scope.row.userName}} {{scope.row.bankName}} {{scope.row.cardNumber}}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              {{billMsg.checkStatus|getLabel}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="入账时间">
            <template slot-scope="scope">
              {{billMsg.toAccountTime|formatDate}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text">开票</el-button>
            </template>
          </el-table-column>
        </el-table>
      </li>
      <li v-if="activeItem==='收款信息'">
        <h4>刷卡信息</h4>
        <el-table border :data="billMsg.account" header-row-class-name="theader-bg">
          <el-table-column align="center" prop="bankName" label="刷卡/转账银行"></el-table-column>
          <el-table-column align="center" prop="userName" label="户名"></el-table-column>
          <el-table-column align="center" prop="cardNumber" label="账户"></el-table-column>
          <el-table-column align="center" prop="orderNo" label="订单编号"></el-table-column>
          <el-table-column align="center" prop="amount" label="金额（元）"></el-table-column>
          <el-table-column align="center" prop="fee" label="手续费（元）"></el-table-column>
        </el-table>
      </li>
      <li v-if="activeItem==='付款信息'">
        <h4>账户信息</h4>
        <el-table border :data="billMsg.account" header-row-class-name="theader-bg">
          <el-table-column align="center" prop="bankName" label="收款银行"></el-table-column>
          <el-table-column align="center" prop="userName" label="户名"></el-table-column>
          <el-table-column align="center" prop="cardNumber" label="收款账户"></el-table-column>
          <el-table-column align="center" prop="amount" label="金额（元）"></el-table-column>
        </el-table>
      </li>
      <li>
        <h4>其他信息</h4>
        <div class="input-group">
          <label>备注信息:</label>
          <p>{{billMsg.remark}}</p>
        </div>
        <div class="input-group">
          <label>付款凭证:</label>
          <ul class="image-list">
            <li></li>
          </ul>
        </div>
      </li>
      <li ref="checkBox">
        <h4>审核信息</h4>
        <el-table border :data="list" header-row-class-name="theader-bg">
          <el-table-column align="center" label="时间">
            <template slot-scope="scope">
              <span>-</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="姓名">
            <template slot-scope="scope">

            </template>
          </el-table-column>
          <el-table-column align="center" label="职务">
            <template slot-scope="scope">

            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">

            </template>
          </el-table-column>
          <el-table-column align="center" label="备注">
            <template slot-scope="scope">

            </template>
          </el-table-column>
        </el-table>
      </li>
    </ul>
  </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";

  let timer = null
  let target = 0
  let scrollHeight = 0

  export default {
    name: "bill-details",
    mixins: [FILTER],
    data() {
      return {
        tabs: ['审核信息'],
        activeItem: '',
        billId:0,
        billMsg:{},
        list: [
          {}
        ]
      }
    },
    created(){
      // debugger
      this.activeItem = this.$route.query.tab
      this.billId = this.$route.query.id
      this.tabs.unshift(this.activeItem)
      this.getData()
    },
    methods: {
      getData:function () {
        let param = {
          payId:this.billId,
          type:this.activeItem==='收款信息'?1:2
        }
        this.$ajax.get('/api/payInfo/selectPayInfoDetail',param).then(res=>{
          res=res.data
          if(res.status===200){
            this.billMsg = Object.assign({},res.data)
          }
        })
      },

      choseTab: function (item) {
        // this.activeItem = item
        if(item!=='审核信息'){
          return
        }
        target = this.$refs.checkBox.offsetTop
        scrollHeight = document.querySelector('.view').parentNode.clientHeight
        console.log(`target:${target}`)
        console.log(`容器：${scrollHeight}`)
        this.scrollTop()
      },
      scrollTop:function () {
        let scrollTop = document.querySelector('.view').parentNode.scrollTop
        document.querySelector('.view').parentNode.scrollTop = scrollTop+30
        console.log(scrollTop)
        if(scrollTop+scrollHeight>=target){
          clearTimeout(timer)
        }else {
          timer = setTimeout(()=>{
            this.scrollTop()
          },50)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  .input-group{
    align-items: flex-start;
    max-width: 812px;
    &:first-of-type{
      margin-bottom: 20px;
    }
    >label{
      color: @color-6c;
    }
    >p{
      line-height: 1.6;
    }
    ul.image-list{
      >li{
        width: 146px;
        height: 104px;
        background-color: @bg-grey;
      }
    }
  }

  .view {
    /*padding: 0 20px;*/
    background-color: @bg-white;
  }

  .bill-details-tab {
    position: relative;
    border-bottom: 1px solid @border-CE;
    padding: 0 20px;
    > ul {
      display: flex;
      > li {
        flex: 1;
        align-self: center;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 100px;
        &.active {
          color: @color-blue;
          position: relative;
          &:after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            border-bottom: 4px solid @color-blue;
          }
        }
      }
    }
    > p {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
    }
  }
  .bill-details-content{
    padding: 0 20px;
    >li{
      h4{
        margin: 30px 0 20px;
        font-weight: bold;
      }
      .total-text{
        margin-bottom: 10px;
        >span{
          color: @color-orange;
        }
      }
    }
  }
</style>
