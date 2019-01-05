<template>
  <div class="view">
    <div class="view-context">
      <h1><i class="iconfont icon-chenggong"></i></h1>
      <h3>{{type===1?edit?'POS收款订单修改成功':'POS收款订单创建成功':edit?'收款信息修改成功':'收款信息录入成功'}}</h3>
      <p>已成功生成收款单</p>
      <div class="bill-result-table">
        <p v-if="type===1">请在POS机上进行收款</p>
        <el-table border :data="list" style="width: 100%" header-row-class-name="theader-bg" v-if="type===2">
          <el-table-column align="center" label="现金">
            <template slot-scope="scope">
              <span>{{result.detail['1']}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="转账">
            <template slot-scope="scope">
              <span>{{result.detail['2']}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="POS刷卡">
            <template slot-scope="scope">
              <span>{{result.detail['3']}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="合计金额">
            <template slot-scope="scope">
              <span>{{result.amount}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table border :data="list" style="width: 100%" header-row-class-name="theader-bg" key="other" v-else>
          <el-table-column min-width="160" align="center" label="订单编号">
            <template slot-scope="scope">
              <span>{{result.payCode}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="160" align="center" label="订单金额">
            <template slot-scope="scope">
              <span>{{result.amount}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="160" align="center" label="订单条码">
            <template slot-scope="scope">
              <img :src="result.RQcode" alt="">
            </template>
          </el-table-column>
        </el-table>
      </div>
      <p class="tool-bar" :class="[type!==1?'tool-bar-other':'']">
        <el-button round class="make-bill" type="primary" v-if="type===1&&power['sign-cw-debt-invoice'].state" @click="toBill">开票</el-button>
        <el-button round @click="goBack('contractList')" v-if="power['sign-ht-info-query'].state">返回合同列表</el-button>
        <el-button round @click="goBack('Bill')" v-if="power['sign-cw-debt-query'].state">返回收付款列表</el-button>
        <span class="btn-question" @click="answer" v-if="type===1">支付遇到问题？</span>
      </p>
    </div>
    <el-dialog
      :closeOnClickModal="$tool.closeOnClickModal"
      title="提示"
      :visible.sync="confirm"
      width="460px"
      class="dialog-answer">
      <p>支付遇到问题？您可以拨打以下客服电话处理咨询：</p>
      <h4>400 112 5883</h4>
    </el-dialog>
    <layer-invoice ref="layerInvoice" @emitPaperSet="emitPaperSetFn"></layer-invoice>
    <checkPerson :show="checkPerson.state" :showBtn="power['sign-cw-bill-print'].state" :type="checkPerson.type" :bizCode="checkPerson.code" :flowType="checkPerson.flowType" @close="checkPerson.state=false" @submit="checkPerson.state=false" v-if="checkPerson.state"></checkPerson>
  </div>
</template>

<script>
  import {MIXINS} from "@/assets/js/mixins";
  import LayerInvoice from '@/components/LayerInvoice'
  import checkPerson from '@/components/checkPerson'
  export default {
    name: "receipt-result",
    mixins: [MIXINS],
    components:{
      LayerInvoice,
      checkPerson
    },
    data() {
      return {
        list: [{}],
        type: 1,//1=创建 2=录入
        edit:false,//是否为修改结果页
        result: {},
        confirm: false,
        checkPerson: {
          state:false,
          type:'set',
          code:'',
          flowType:1
        },
        power:{
          'sign-cw-debt-invoice': {
            state: false,
            name: '开票'
          },
          'sign-cw-bill-print':{
            state: false,
            name: '打印'
          },
          'sign-ht-info-query':{
            state: false,
            name: '合同列表'
          },
          'sign-cw-debt-query':{
            state: false,
            name: '收付款单列表'
          },
        }
      }
    },
    created() {
      this.type = parseInt(this.$route.query.type)
      this.edit = parseInt(this.$route.query.edit)===1?true:false
      this.result = JSON.parse(this.$route.query.content)
      /*if(this.result.payCode&&this.result.payCode.length>0){
        this.checkPerson.state=true
        this.checkPerson.code=this.result.payCode
      }*/
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if(from.path==='/receiptBill'&&from.query.errorCode==='dialog'){
          let param={
            state:true,
            code:vm.result.payCode
          }
          vm.checkPerson=Object.assign(vm.checkPerson,param)
        }
      })
    },
    methods: {
      goBack: function (page) {
        this.$router.push({
          path: page
        })
      },
      answer: function () {
        this.confirm = true
      },
      toBill:function () {
        this.$ajax.get('/api/payInfo/checkBill',{payCode:this.result.payCode}).then(res=>{
          res=res.data
          if(res.status===200&&res.data.value===1){
            this.$refs.layerInvoice.show(this.result.id,true)
          }else {
            this.$message({
              message:'未付款还不能开票'
            })
          }
        })
      },
      emitPaperSetFn:function () {

      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";

  .view {
    background-color: @bg-white;
    position: relative;
    height: 100%;
    &-context {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      >h1{
        margin-bottom: 41px;
        .iconfont{
          color: @color-58b;
          font-size: 89px;
        }
      }
      > h3 {
        color: @color-324;
        font-size: 28px;
      }
      > p {
        &:first-of-type {
          color: @color-99A;
          margin: 20px 0;
          font-size: 18px;
        }
      }
      .bill-result-table {
        margin: 70px 0;
        text-align: center;
        > p {
          color: @color-324;
          margin-bottom: 20px;
          font-size: 18px;
        }
      }
    }
  }

  .make-bill {
    min-width: 150px;
  }

  .tool-bar {
    position: relative;
    padding-right: 130px;
    white-space: nowrap;
    &-other{
      padding: 0;
    }
    .btn-question {
      position: absolute;
      right: 0;
      bottom: 0;
      color: @color-blue;
      font-size: @size-base;
      cursor: pointer;
    }
  }
  .dialog-answer{
    p{
      text-align: center;
    }
    h4{
      margin: 28px 0;
      text-align: center;
      font-weight: bold;
    }
  }
</style>
