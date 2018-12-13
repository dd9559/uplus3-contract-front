<template>
  <div class="view">
    <!--<iframe id='test' :src="test" frameborder="0"></iframe>
    <span @click="toPrint">test</span>-->
    <div class="bill-details-tab">
      <ul>
        <li v-for="(item,index) in tabs" :key="index" class="f14" :class="[activeItem===item?'active':'']"
            @click="choseTab(item)">{{item}}
        </li>
      </ul>
      <p v-if="(activeItem==='收款信息'&&receiptBill===4)||activeItem==='付款信息'">
        <el-button class="btn-info" round size="small" type="primary" @click="showDialog" v-if="activeItem==='付款信息'||billMsg.audit&&billMsg.audit.auditResult!==100">审核</el-button>
      </p>
    </div>
    <ul class="bill-details-content">
      <li>
        <h4 class="f14">{{activeItem}}</h4>
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
              <span>{{billMsg.createTime|formatTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="收款时间" v-else>
            <template slot-scope="scope">
              <span>{{billMsg.createTime|formatTime}}</span>
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
        <h4 class="f14">合计金额</h4>
        <p class="total-text">合计：<span>{{billMsg.amount}}</span>元</p>
        <el-table border :data="billMsg.inAccountType===4?billMsg.inAccount:[{}]" header-row-class-name="theader-bg">
          <el-table-column align="center" label="款类">
            <template slot-scope="scope">
              <span>{{billMsg.moneyTypeName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="票据">
            <template slot-scope="scope">
              <span class="span-cursor" @click="getPaper('details')" v-if="billMsg.billCode">{{billMsg.billCode}}</span>
              <span v-else>--</span>
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
              <p v-if="billMsg.inAccountType===4">{{scope.row.userName}} {{scope.row.bankName}} {{scope.row.cardNumber}}</p>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <!--{{billMsg.checkStatus|getLabel}}-->
              <span>{{billMsg.statusName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="入账时间">
            <template slot-scope="scope">
              {{billMsg.toAccountTime|formatDate}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="getPaper('create')" v-if="billMsg.checkStatus&&(billMsg.checkStatus.value===1||billMsg.checkStatus.value===4)">开票</el-button>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
      </li>
      <li v-if="activeItem==='收款信息'">
        <h4 class="f14">刷卡信息</h4>
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
        <h4 class="f14">账户信息</h4>
        <el-table border :data="billMsg.account" header-row-class-name="theader-bg">
          <el-table-column align="center" prop="bankName" label="收款银行"></el-table-column>
          <el-table-column align="center" prop="userName" label="户名"></el-table-column>
          <el-table-column align="center" prop="cardNumber" label="收款账户"></el-table-column>
          <el-table-column align="center" prop="amount" label="金额（元）"></el-table-column>
        </el-table>
      </li>
      <li>
        <h4 class="f14">其他信息</h4>
        <div class="input-group">
          <label>备注信息:</label>
          <p>{{billMsg.remark|nullFormatter}}</p>
        </div>
        <div class="input-group">
          <label>付款凭证:</label>
          <ul class="image-list" v-if="files.length>0">
            <li class="margin-right" v-for="(item,index) in files" :key="index" @click="previewPhoto(files,index)">
              <upload-cell :type="item.type"></upload-cell>
              <span>{{item.name}}</span>
            </li>
          </ul>
          <span v-else>无</span>
        </div>
      </li>
      <li ref="checkBox">
        <h4 class="f14">审核信息</h4>
        <el-table border :data="checkList" header-row-class-name="theader-bg">
          <el-table-column align="center" label="时间">
            <template slot-scope="scope">
              <span>{{scope.row.auditTime|formatTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="userName" label="姓名"></el-table-column>
          <el-table-column align="center" prop="roleName" label="职务"></el-table-column>
          <el-table-column align="center" label="操作"></el-table-column>
          <el-table-column align="center" prop="auditInfo" label="备注"></el-table-column>
        </el-table>
        <!--<el-pagination
          v-if="checkList.length>1"
          class="pagination-info"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>-->
      </li>
    </ul>
    <el-dialog
      title="审核"
      :closeOnClickModal="$tool.closeOnClickModal"
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
      <ul class="radio-dialog" v-if="radioMask">
        <li>
          <p>大类可支配金额：<span>{{amount.CategoriesBalance}}元</span></p>
          <p>合同余额：<span>{{amount.ContractBalance}}元</span></p>
          <p>代收代付余额：<span>{{amount.agentBalance}}元</span></p>
        </li>
        <li><span>支付方式</span>（若通过审核，则支付方式必填）</li>
        <li>
          <el-radio v-model="payRadio" label="1">线上支付（联动优势）</el-radio>
          <el-radio v-model="payRadio" label="2">线下支付（线下财物打款）</el-radio>
        </li>
        <li class="color-light">
          * 当支付方式为“线上支付”时，系统会对接第三方系统进行自动支付
        </li>
        <li class="color-light">
          * 当支付方式为“线下付款”时，需财务进行线下打款
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
    <el-button round @click="checkBill(2)">拒 绝</el-button>
    <el-button round type="primary" @click="checkBill(1)">同 意</el-button>
  </span>
    </el-dialog>
    <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
    <layer-invoice ref="layerInvoice" @emitPaperSet="emitPaperSetFn"></layer-invoice>
  </div>
</template>

<script>
  import LayerInvoice from '@/components/LayerInvoice'
  import {FILTER} from "@/assets/js/filter";
  import {MIXINS} from "@/assets/js/mixins";

  let timer = null
  let target = 0
  let scrollHeight = 0

  export default {
    name: "bill-details",
    mixins: [FILTER,MIXINS],
    components:{
      LayerInvoice
    },
    data() {
      return {
        tabs: ['审核信息'],
        activeItem: '',
        billId: 0,
        billMsg: {},
        list: [
          {}
        ],
        receiptBill:4,
        checkList: [],//审核信息
        layer: {
          show: false,
          reasion: ''
        },
        invalidMax: 200,
        files: [],
        radioMask: false,
        amount:{},
        payRadio:0,
        //分页
        currentPage:1,
        pageSize:10,
        total:0
      }
    },
    created() {
      // debugger
      this.activeItem = this.$route.query.tab
      this.billId = this.$route.query.id
      this.tabs.unshift(this.activeItem)
      this.getData()
      if(this.$route.query.type){
        this.receiptBill=parseInt(this.$route.query.type)
      }
    },
    methods: {
      previewImg:function () {
        let arr=[]
        this.files.forEach(item=>{
          arr.push(item.path)
        })
        this.fileSign(arr)
      },
      //监听点击票据打印
      emitPaperSetFn:function () {

      },
      //开票
      getPaper:function (type) {
        if(type==='details'){
          this.$refs.layerInvoice.show(this.billMsg.billId)
        }else {
          this.$refs.layerInvoice.show(this.billId,true)
        }
      },
      // 判断审核弹窗显示内容
      showDialog: function () {
        this.layer.show = true
        if(this.activeItem==='付款信息'){
          let param={
            payId: this.billMsg.id,
            moneyType:this.billMsg.moneyType,
            moneyTypePid:this.billMsg.moneyTypePid,
            contId:this.billMsg.contId
          }
          this.$ajax.get('/api/payInfo/auditOption', param).then(res => {
            res = res.data
            if (res.status === 200) {
              this.radioMask = res.data.num === 2 ? true : false
              this.amount=Object.assign({},res.data)
            }
          })
        }
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val
        this.getData()
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
            if (res.data.filePath) {
              this.files = this.$tool.cutFilePath(JSON.parse(res.data.filePath))
            }
            this.getCheckData()
          }
        })
      },
      /**
       * 获取审核信息
       */
      getCheckData:function () {
        let param={
          pageSize:this.pageSize,
          pageNum:this.currentPage,
          flowType:this.billMsg.audit.flowType,
          bizCode:this.billMsg.audit.bizCode
        }
        this.$ajax.get('/api/machine/getAuditList',param).then(res=>{
          // debugger
          res=res.data
          if(res.status===200){
            this.checkList = res.data.data
            this.total=res.data.total
          }
        })
      },
      /**
       * 审核
       */
      checkBill: function (type) {
        if(this.radioMask&&!this.payRadio){
          this.$message({
            message:'请选择支付方式'
          })
          return
        }
        let param = {
          // bizId: this.billMsg.audit.bizId,
          bizCode: this.billMsg.audit.bizCode,
          // flowId: this.billMsg.audit.flowId,
          // sort: this.billMsg.audit.nodeSort,
          flowType: this.activeItem==='付款信息'?0:1
        }
        param.ApprovalForm = {
          result: type,
          remark: this.layer.reasion
        }
        this.$ajax.postJSON('/api/machine/audit', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.getData()
            if(this.radioMask){
              this.secondCheck()
            }else {
              this.$message({
                message:res.message
              })
              this.layer.show = false
            }
          }
        })
      },
      secondCheck:function () {
        let param={
          payId:this.billId,
          payMethod:parseInt(this.payRadio)
        }
        this.$ajax.put('/api/payInfo/auditPass',param,2).then(res=>{
          res=res.data
          if(res.status===200){
            this.$message({
              message:res.message
            })
            this.payRadio=0
            this.layer.show = false
          }
        })
      },
      clearLayer: function () {
        this.layer.reasion = ''
        this.layer.show = false
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
    },
    filters:{
      nullFormatter:function (val,type=1) {
        if(!val){
          return type===1?'无':'--'
        }else {
          return val
        }
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
      max-width: 60px;
      min-width: 60px;
    }
    > p {
      line-height: 1.6;
    }
    ul.image-list {
      display: flex;
      align-items: center;
      > li {
        width: 120px;
        height: 120px;
        background-color: @bg-grey;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        span {
          width: 100px;
          text-align: center;
          /*word-break: break-all;*/
          white-space: nowrap;
          overflow: hidden;
          text-overflow:ellipsis;
        }
      }
    }
  }

  .reasion-dialog {
    display: flex;
    > label {
      min-width: 46px;
    }
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

  .radio-dialog {
    margin-left: 46px;
    color: @color-6c;
    > li {
      padding: @margin-base;
      &:first-of-type {
        display: flex;
        > p {
          margin-right: @margin-10;
          span {
            color: @color-red;
          }
        }
      }
      &:nth-of-type(2){
        >span{
          color: @color-233;
        }
      }
      &:nth-of-type(3){
        .el-radio{
          color: @color-233;
        }
      }
    }
    .color-light {
      color: @color-red;
    }
  }

  .view {
    /*padding: 0 20px;*/
    background-color: @bg-white;
  }

  .bill-details-tab {
    position: relative;
    border-bottom: 1px solid @border-CE;
    padding: 0 @margin-10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > ul {
      display: flex;
      > li {
        flex: 1;
        align-self: center;
        /*height: 50px;*/
        display: flex;
        align-items: center;
        justify-content: center;
        /*min-width: 100px;*/
        padding: @margin-10 @margin-15;
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
    /*> p {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
    }*/
  }

  .bill-details-content {
    padding: 0 @margin-10;
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
