<template>
  <div class="view">
    <!--<iframe id='test' :src="test" frameborder="0"></iframe>
    <span @click="toPrint">test</span>-->
    <div class="bill-details-tab">
      <ul>
        <li v-for="(item,index) in tabs" :key="index" :class="[activeItem===item?'active':'']"
            @click="choseTab(item)">{{item}}
        </li>
      </ul>
      <p>
        <el-button round size="small" type="primary" @click="layer.show=true">审核</el-button>
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
              <span>{{billMsg.moneyTypeName}}</span>
            </template>
          </el-table-column>
        </el-table>
      </li>
      <li v-if="activeItem==='收款信息'">
        <h4>合计金额</h4>
        <p class="total-text">合计：<span>{{billMsg.amount}}</span>元</p>
        <el-table border :data="billMsg.inAccount" header-row-class-name="theader-bg">
          <el-table-column align="center" label="款类">
            <template slot-scope="scope">
              <span>{{billMsg.moneyTypeName}}</span>
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
          <ul class="image-list" v-if="files.length>0">
            <li v-for="item in files">
              <upload-cell :type="item.type"></upload-cell>
              <span>{{item.name}}</span>
            </li>
          </ul>
          <span v-else>无</span>
        </div>
      </li>
      <li ref="checkBox">
        <h4>审核信息</h4>
        <el-table border :data="checkList" header-row-class-name="theader-bg">
          <el-table-column align="center" label="时间">
            <template slot-scope="scope">
              <span>{{scope.row.time|formatTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="姓名"></el-table-column>
          <el-table-column align="center" prop="position" label="职务"></el-table-column>
          <el-table-column align="center" label="操作"></el-table-column>
          <el-table-column align="center" prop="remark" label="备注"></el-table-column>
        </el-table>
      </li>
    </ul>
    <el-dialog
      title="审核"
      :visible.sync="layer.show"
      width="740px"
      @close="clearLayer">
      <div class="reasion-dialog">
        <label>备注：</label>
        <div class="input">
          <el-input type="textarea" resize="none" placeholder="请输入同意/退回理由" :maxlength="invalidMax"
                    v-model="layer.reasion"
                    class="input-textarea">
          </el-input>
          <div class="text-absloute">{{invalidNumber}}/{{invalidMax}}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button round @click="checkBill(2)">拒 绝</el-button>
    <el-button round type="primary" @click="checkBill(1)">同 意</el-button>
  </span>
    </el-dialog>
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
        billId: 0,
        billMsg: {},
        list: [
          {}
        ],
        checkList:[],//审核信息
        layer: {
          show: false,
          reasion: ''
        },
        invalidMax: 200,
        files:[],
        test:''
      }
    },
    created() {
      // debugger
      this.activeItem = this.$route.query.tab
      this.billId = this.$route.query.id
      this.tabs.unshift(this.activeItem)
      this.getData()
    },
    methods: {
      toPrint:function () {
        this.test='http://jjw-test.oss-cn-shenzhen.aliyuncs.com/bill/20181129/SJ1811290099.pdf?Expires=1543495955&OSSAccessKeyId=LTAI699jkFRmo7TI&Signature=twA%2BLRPn4RK9eR9Mz4AcTHtVN%2B4%3D'
        document.getElementById('test').contentWindow.print()
      },
      getData: function () {
        let param = {
          payId: this.billId,
          type: this.activeItem === '收款信息' ? 1 : 2
        }
        this.$ajax.get('/api/payInfo/selectPayInfoDetail', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.billMsg = Object.assign({}, res.data)
            if(res.data.auditInfo){
              this.checkList = res.data.auditInfo
            }
            if(res.data.filePath){
              this.files=this.$tool.cutFilePath(JSON.parse(res.data.filePath))
            }
          }
        })
      },
      /**
       * 审核
       */
      checkBill: function (type) {
        let param = {
          bizId: this.billMsg.audit.bizId,
          bizCode: this.billMsg.audit.bizCode,
          flowId: this.billMsg.audit.flowId,
          sort: this.billMsg.audit.nodeSort,
        }
        param.ApprovalForm={
          result: type,
          remark: this.layer.reasion
        }
        debugger
        this.$ajax.postJSON('/api/machine/audit',param).then(res=>{
          res=res.data
          if(res.status===200){
            this.layer.show=false
          }
        })
      },
      clearLayer:function () {
        this.layer.reasion=''
        this.layer.show=false
      },
      choseTab: function (item) {
        // this.activeItem = item
        if (item !== '审核信息') {
          return
        }
        target = this.$refs.checkBox.offsetTop
        scrollHeight = document.querySelector('.view').parentNode.clientHeight
        console.log(`target:${target}`)
        console.log(`容器：${scrollHeight}`)
        this.scrollTop()
      },
      scrollTop: function () {
        let scrollTop = document.querySelector('.view').parentNode.scrollTop
        document.querySelector('.view').parentNode.scrollTop = scrollTop + 30
        console.log(scrollTop)
        if (scrollTop + scrollHeight >= target) {
          clearTimeout(timer)
        } else {
          timer = setTimeout(() => {
            this.scrollTop()
          }, 50)
        }
      }
    },
    computed: {
      invalidNumber() {
        return this.layer.reasion.length
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";

  .input-group {
    align-items: flex-start;
    max-width: 812px;
    &:first-of-type {
      margin-bottom: @margin-base;
    }
    > label {
      color: @color-6c;
    }
    > p {
      line-height: 1.6;
    }
    ul.image-list {
      > li {
        width: 120px;
        height: 120px;
        background-color: @bg-grey;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        span{
          font-size: @size-base;
          display: inline-block;
          width: 100px;
          word-break: break-all;
        }
      }
    }
  }

  .reasion-dialog {
    display: flex;
    /deep/ .input {
      flex: 1;
      position: relative;
      &-textarea {
        .el-textarea__inner {
          border: 0;
          height: 235px;
          background-color: @bg-FA;
        }
      }
      .text-absloute {
        position: absolute;
        bottom: 11px;
        right: 14px;
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

  .bill-details-content {
    padding: 0 20px;
    > li {
      h4 {
        margin: @margin-base 0;
        font-weight: bold;
      }
      .total-text {
        margin-bottom: 10px;
        > span {
          color: @color-orange;
        }
      }
    }
  }
</style>
