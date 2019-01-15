<template>
  <div class="paper-info">
    <div class="paper-info-child">
      <div class="paper-border">
      <div class="paper-tit">专用收款收据</div>
      <div class="paper-number">合同编号：{{comNumber}}<span class="red">{{comText}}</span></div>
      <ul class="paper-ul">
        <li class="w1"><span class="cl-1 mr-10">交款单位：</span>{{comName}}</li>
        <li><span class="cl-1 mr-10">收款日期：</span>{{comCollectionTime}}</li>
        <li><span class="cl-1 mr-10">开票日期：</span>{{comInvoiceTime}}</li>
        <li class="w2"><span class="cl-1 mr-10">票据编号：</span>{{comPaper}}</li>
      </ul>
      <div class="paper-small-tit">收款项目明细<span class="paper-nomal">门店名称：{{comStoresName}}</span></div>
      <div class="paper-table">
        <table class="paper-table-main">
            <thead>
                <tr>
                    <th class="paper-table-w">摘要</th>
                    <th class="paper-table-w2">金额</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{comProject}}</td>
                    <td>￥{{comMoney}}</td>
                </tr>
            </tbody>
        </table>
        <!-- <ul class="cl-2">
          <li>摘要</li>
          <li class="wi">金额</li>
        </ul>
        <ul>
          <li>{{comProject}}</li>
          <li class="wi">￥{{comMoney}}</li>
        </ul> -->
        <div class="paper-absolute">
          <p>客</p>
          <p>户</p>
          <p>联</p>
        </div>
      </div>
      <div class="paper-ov">
        <div class="fl"><span class="fb mr-10">客户身份：</span>{{comPayerType}}</div>
        <div class="fr"><span class="mr-10">人民币大写：</span><span class="fb">{{comMoneyZh}}</span></div>
      </div>
      <div class="paper-ov">
        <div class="fl">
          <span class="fl fb mr-10">交款方式：</span>
          <span :class="i === getMethodAndAmount.length-1?'':'mr-10'" v-for="(item,i) in getMethodAndAmount" :key="i+item.method">{{item.method}}{{item.amount}}<template v-if="item.method!==''">元</template></span>
        </div>
        <div class="fr"><span class="mr-10">合计：</span><span class="fb">￥{{comMoney}}元</span></div>
      </div>
      <!-- <div class="paper-ov"> -->
        <!-- <div class="fl"><span class="fb mr-10 ml-28">备注：</span>{{comRules}}</div> -->
      <!-- </div> -->
      <div class="pr">
        <div class="paper-ov2">
          <div class="fl fb">收款单位（加盖财务专用章）：</div>
          <div class="fr"><span class="mr-10">开票人：</span><em class="fb">{{comCreate}}</em></div>
        </div>
        <div class="pr-img"><img v-if="comImgSrc!==''" :src="comImgSrc"></div>
      </div>
      <div class="paper-tips">
        <p>温馨提示：</p>
        <p>1、服务费凭此收据换正式发票；</p>
        <p>2、手动填写修改此收据无效。</p>
      </div>
    </div>
    <!-- <div class="paper-dashed"></div> -->
    <div class="paper-border">
      <div class="paper-tit">专用收款收据</div>
      <div class="paper-number">合同编号：{{comNumber}}<span class="red">{{comText}}</span></div>
      <ul class="paper-ul">
        <li class="w1"><span class="cl-1 mr-10">交款单位：</span>{{comName}}</li>
        <li><span class="cl-1 mr-10">收款日期：</span>{{comCollectionTime}}</li>
        <li><span class="cl-1 mr-10">开票日期：</span>{{comInvoiceTime}}</li>
        <li class="w2"><span class="cl-1 mr-10">票据编号：</span>{{comPaper}}</li>
      </ul>
      <div class="paper-small-tit">收款项目明细<span class="paper-nomal">门店名称：{{comStoresName}}</span></div>
      <div class="paper-table">
          <table class="paper-table-main">
            <thead>
                <tr>
                    <th class="paper-table-w">摘要</th>
                    <th class="paper-table-w2">金额</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{comProject}}</td>
                    <td>￥{{comMoney}}</td>
                </tr>
            </tbody>
        </table>
        <!-- <ul class="cl-2">
          <li>摘要</li>
          <li class="wi">金额</li>
        </ul>
        <ul>
          <li>{{comProject}}</li>
          <li class="wi">￥{{comMoney}}</li>
        </ul> -->
        <div class="paper-absolute">
          <p>记</p>
          <p>账</p>
          <p>联</p>
        </div>
      </div>
      <div class="paper-ov">
        <div class="fl"><span class="fb mr-10">客户身份：</span>{{comPayerType}}</div>
        <div class="fr"><span class="mr-10">人民币大写：</span><span class="fb">{{comMoneyZh}}</span></div>
      </div>
      <div class="paper-ov">
        <div class="fl">
          <span class="fl fb mr-10">交款方式：</span>
          <span :class="i === getMethodAndAmount.length-1?'':'mr-10'" v-for="(item,i) in getMethodAndAmount" :key="i+item.method">{{item.method}}{{item.amount}}<template v-if="item.method!==''">元</template></span>
        </div>
        <div class="fr"><span class="mr-10">合计：</span><span class="fb">￥{{comMoney}}元</span></div>
      </div>
      <div class="paper-ov">
        <div class="fl"><span class="fb mr-10 ml-28">备注：</span>{{comRules}}</div>
      </div>
      <div class="pr">
        <div class="paper-ov3">
          <div class="fl fb">收款单位（加盖财务专用章）：</div>
          <div class="fr"><span class="mr-10">开票人：</span><em class="fb">{{comCreate}}</em></div>
        </div>
          <div class="pr-img2">
            <img v-if="comImgSrc!==''" :src="comImgSrc">
          </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
  import src from './../assets/img/seal.png'

  const o = {
    a: '二手买卖佣金',
    b: '低佣买卖佣金'
  }
  export default {
    props: {
      number: {//合同编号
        type: String,
        default: '--'
      },
      name: {//交款单位
        type: String,
        default: '--'
      },
      collectionTime: {//收款日期
        type: String,
        default: '--'
      },
      invoiceTime: {//开票日期
        type: String,
        default: ''
      },
      paper: {//票据编号
        type: String,
        default: '--'
      },
      project: {//摘要（项目名）
        type: String,
        default: '--'
      },
      address: {//摘要（地址）
        type: String,
        default: '--'
      },
      money: {//交款方式（金额）
        type: String,
        default: 0
      },
      moneyZh: {//人民币大写
        type: String,
        default: ''
      },
      create: {//开票人
        type: String,
        default: '--'
      },
      rules: {//备注
        type: String,
        default: '--'
      },
      payerType: {//客户身份
        type: String,
        default: '--'
      },
      hide: {//地址是否隐藏
        type: Boolean,
        default: false
      },
      imgSrc: {//默认签章
        type: String,
        default: ''
      },
      storesName: {//门店名称
        type: String,
        default: '--'
      },
      time:{
        type:String,
        default:'',
      },
      num:{
        type:Number,
        default:0,
      },
      methodAndAmount:{
        type:Array,
        default(){
          return []
        }
      }
    },
    computed: {
      comText(){
        if(this.num > 1){
          return `第${this.num}次打印，重复无效，打印日期:${this.$tool.dateFormat(this.time)}`
        }else{
          return ``
        }
      },
      comStoresName(){
        return this.storesName
      },
      comNumber() {
        return this.defaultFn(this.number);
      },
      comName() {
        return this.defaultFn(this.name);
      },
      comCollectionTime() {
        return this.defaultFn(this.collectionTime);
      },
      comInvoiceTime() {
        let t = `${this.invoiceTime}`;
        if(!!t){
          t = t.replace(/-/g, "/");
        }
        return this.defaultFn(t);
      },
      comPaper() {
        return this.defaultFn(this.paper);
      },
      comProject() {
        if (this.hide) {
          return this.defaultFn(this.project);
        } else {
          return `${this.project}(${this.address})`
        }
      },
      comImgSrc() {
        if (this.imgSrc === '') {
          return ''
        } else {
          return this.imgSrc
        }
      },
      comMoney() {
        return this.money
      },
      comMoneyZh() {
        return this.defaultFn(this.moneyZh);
      },
      comCreate() {
        return this.defaultFn(this.create)
      },
      comRules() {
        if (this.rules == o.a || this.rules == o.b) {
          return '买卖'
        } else {
          return this.defaultFn(this.rules)
        }
      },
      comPayerType() {
        return this.defaultFn(this.payerType)
      },
      getMethodAndAmount(){
        if(this.methodAndAmount.length ===0){
          return [{
            amount:'--',
            method:''
            }]
        }else{
          return this.methodAndAmount
        }
      }
    },
    methods: {
      defaultFn(e) {
        if (e === '') {
          return '--'
        } else {
          return e
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @media print{
    /deep/.red{
      display: none;
    }
    /deep/.paper-info-child{
      margin:0 4.7mm;
      font-size: 12px;
      // height: 290mm;
      // overflow: hidden;
    }
    // /deep/.paper-info-child .paper-ul{
    //     padding-top: 16px;
    //   }
    // /deep/.paper-info-child .paper-small-tit{
    //   padding-top: 18px;
    // }
    // /deep/.paper-info-child .paper-number{
    //   padding-top: 10px;
    // }
    // /deep/.paper-info-child .paper-tit{
    //   font-size: 18px;
    // }
    /deep/.paper-info-child .paper-table-main{
      font-size: 12px;
    }
    // /deep/.paper-info-child .paper-ov{
    //   padding-top: 16px;
    // }
    // /deep/.paper-info-child .paper-border{
    //   margin-bottom: 0;
    // }
    // /deep/.paper-info-child .paper-dashed{
    //   padding-top: 20px;
    // }
    @page {
      size: auto;
      margin: 0mm;
    }
  }
  .red{
    color: #FF3E3E;
    font-weight: normal;
    float: right;
  }
  .cl-1 {
    color: #999;
  }

  .cl-2 {
    color: #666;
  }

  .mr-10 {
    margin-right: 6px;
  }

  .mr-20 {
    margin-right: 20px;
  }
  .ml-20 {
    margin-left: 20px;
  }

  .ml-28 {
    margin-left: 28px;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .fb {
    font-weight: bold;
  }

  .paper-info {
    width: 860px;
    margin: auto;
    color: #333;
    overflow: hidden;
    font-size: 14px;
  }

  .paper-border {
    border: 1px solid #E8EAF6;
    margin: 2px 0 0;
    padding: 0 48px 10px 24px;
    &:first-child{
      margin-top: 0;
    }
  }

  .paper-tit {
    font-size: 24px;
    padding-top: 12px;
    text-align: center;
    font-weight: bold;
  }

  .paper-number {
    color: #666;
    padding-top: 10px;
    // text-align: center;
    font-weight: 400;
  }

  .paper-ul {
    // display: flex;
    padding-top: 10px;
    border-bottom: 1px solid #E5E5E5;
    overflow: hidden;
  }

  .paper-ul > li {
    float: left;
    width: 25%;
    margin-bottom: 10px;
  }

  .paper-ul .w1{
      width: 23%;
  }
  .paper-ul .w2{
      width: 27%;
      text-align: right;
  }
  .paper-small-tit {
    font-weight: bold;
    padding-top: 10px;
    .paper-nomal{
      font-weight: normal;
      color: #666;
      margin-left: 30px;
    }
  }

  .paper-table {
    border-top: 1px solid #C8C8C8;
    border-left: 1px solid #C8C8C8;
    margin-top: 10px;
    position: relative;
  }

  .paper-absolute {
    position: absolute;
    right: -26px;
    top: 10px;
    line-height: 20px;
    font-weight: bold;
  }

  // .paper-table > ul {
  //   overflow: hidden;
  // }

  // .paper-table > ul > li {
  //   border-bottom: 1px solid #C8C8C8;
  //   border-right: 1px solid #C8C8C8;
  //   width: 69%;
  //   box-sizing: border-box;
  //   float: left;
  //   line-height: 40px;
  //   height: 40px;
  //   text-align: center;
  // }

  // .paper-table > ul > li.wi {
  //   width: 31%;
  // }
  .paper-table-w{
      width: 69%;
  }
  .paper-table-w2{
      width: 31%;
  }
  .paper-table-main {
      font-size: 14px;
      width: 100%;
      text-align: center;
      border-collapse: collapse;
      /* border-spacing: 1; */
      border-spacing: 0;
  }

  .paper-table-main td,
  .paper-table-main th {
      word-break: break-all;
      word-wrap: break-word;
      padding: 0;
      line-height: 32px;
      min-height: 32px;
      border-bottom: 1px solid #C8C8C8;
      border-right: 1px solid #C8C8C8;
  }

  .paper-table-main th {
      font-weight: normal;
      color: #666;
  }
  .paper-table-main td{
    font-size: 12px;
  }

  .paper-ov {
    overflow: hidden;
    padding-top: 10px;
  }

  .paper-ov2 {
    overflow: hidden;
    padding-top: 52px;
  }

  .paper-ov3 {
    overflow: hidden;
    padding: 64px 0 50px;
  }

  .paper-tips {
    margin-top: 20px;
    line-height: 20px;
    color: #666;
    padding-top: 10px;
    border-top: 1px solid #EDECF0;
  }

  .paper-dashed {
    padding-top: 10px;
    border-bottom: 1px dashed #AFAFAF;
  }

  .pr {
    position: relative;
  }

  .pr-img {
    position: absolute;
    width: 120px;
    height: 120px;
    left: 190px;
    bottom: -50px;
    // line-height: 130px;
    // text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    >img{
      // vertical-align:middle;
      max-width: 120px;
      max-height: 120px;
    }
  }

  .pr-img2 {
    position: absolute;
    width: 120px;
    height: 120px;
    left: 190px;
    bottom: -2px;
    // line-height: 130px;
    // text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    >img{
      // vertical-align:middle;
      max-width: 120px;
      max-height: 120px;
    }
  }
</style>
