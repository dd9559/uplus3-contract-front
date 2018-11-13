<template>
    <div class="paper-info">
        <div class="paper-border">
            <div class="paper-tit">专用收款收据</div>
            <div class="paper-number">合同编号：{{comNumber}}</div>
            <ul class="paper-ul">
                <li class="w1"><span class="cl-1 mr-10">交款单位：</span>{{comName}}</li>
                <li><span class="cl-1 mr-10">收款日期：</span>{{comCollectionTime}}</li>
                <li><span class="cl-1 mr-10">开票日期：</span>{{comInvoiceTime}}</li>
                <li class="w2"><span class="cl-1 mr-10">票据编号：</span>{{comPaper}}</li>
            </ul>
            <div class="paper-small-tit">收款项目明细</div>
            <div class="paper-table">
                <ul class="cl-2">
                    <li>摘要</li>
                    <li class="wi">金额</li>
                </ul>
                <ul>
                    <li>{{comProject}}</li>
                    <li class="wi">￥{{comMoney}}</li>
                </ul>
                <div class="paper-absolute">
                    <p>客</p>
                    <p>户</p>
                    <p>联</p>
                </div>
            </div>
            <div class="paper-ov">
                <div class="fl"><span class="fb mr-10">交款方式：</span>刷卡{{comMoney}}元</div>
                <div class="fr"><span class="mr-10">合计：</span><span class="fb">￥{{comMoney}}元</span></div>
                <div class="fr mr-20"><span class="mr-10">人民币大写：</span><span class="fb">{{comMoneyZh}}</span></div>
            </div>
            <div class="paper-ov">
                <div class="fl"><span class="fb mr-10 ml-28">备注：</span>{{comRules}}</div>
            </div>
            <div class="pr">
                <div class="paper-ov2">
                    <div class="fr fb"><span class="mr-10">开票人：</span>{{comCreate}}</div>
                    <div class="fl fb">收款单位（加盖财务专用章）：</div>
                </div>
                <img class="pr-img" :src="comImgSrc">
            </div>
            <div class="paper-tips">
                <p>温馨提示：</p>
                <p>1、服务费凭此收换正式发票；</p>
                <p>2、手动填写修改此收据无效；</p>
            </div>
        </div>
        <div class="paper-dashed"></div>
        <div class="paper-border">
            <div class="paper-tit">专用收款收据</div>
            <div class="paper-number">合同编号：{{comNumber}}</div>
            <ul class="paper-ul">
                <li class="w1"><span class="cl-1 mr-10">交款单位：</span>{{comName}}</li>
                <li><span class="cl-1 mr-10">收款日期：</span>{{comCollectionTime}}</li>
                <li><span class="cl-1 mr-10">开票日期：</span>{{comInvoiceTime}}</li>
                <li class="w2"><span class="cl-1 mr-10">票据编号：</span>{{comPaper}}</li>
            </ul>
            <div class="paper-small-tit">收款项目明细</div>
            <div class="paper-table">
                <ul class="cl-2">
                    <li>摘要</li>
                    <li class="wi">金额</li>
                </ul>
                <ul>
                    <li>{{comProject}}</li>
                    <li class="wi">￥{{comMoney}}</li>
                </ul>
                <div class="paper-absolute">
                    <p>记</p>
                    <p>账</p>
                    <p>联</p>
                </div>
            </div>
            <div class="paper-ov">
                <div class="fl"><span class="fb mr-10">客户身份：</span>{{comPayerType}}</div>
                <div class="fr"><span class="mr-10">合计：</span><span class="fb">￥{{comMoney}}元</span></div>
            </div>
            <div class="paper-ov">
                <div class="fl"><span class="fb mr-10">交款方式：</span>刷卡{{comMoney}}元</div>
            </div>
            <div class="paper-ov">
                <div class="fl"><span class="fb mr-10 ml-28">备注：</span>{{comRules}}</div>
            </div>
            <div class="pr">
                <div class="paper-ov3">
                    <div class="fr fb"><span class="mr-10">开票人：</span>{{comCreate}}</div>
                    <div class="fl fb">收款单位（加盖财务专用章）：</div>
                </div>
                <img class="pr-img2" :src="comImgSrc">
            </div>
        </div>
    </div>
</template>

<script>
import src from './../assets/img/seal.png'

const o = {
    a:'二手买卖佣金',
    b:'低佣买卖佣金'
}
export default {
    props:{
        number:{
            type:String,
            default:'--'
        },
        name:{
            type:String,
            default:'--'
        },
        collectionTime:{
            type:String,
            default:'--'
        },
        invoiceTime:{
            type:String,
            default:'--'
        },
        paper:{
            type:String,
            default:'--'
        },
        project:{
            type:String,
            default:'--'
        },
        hide:{
            type:Boolean,
            default:false
        },
        address:{
            type:String,
            default:'--'
        },
        imgSrc:{
            type:String,
            default:''
        },
        money:{
            type:Number,
            default:0
        },
        moneyZh:{
            type:String,
            default:''
        },
        create:{
            type:String,
            default:'--'
        },
        rules:{
            type:String,
            default:'--'
        },
        payerType:{
            type:String,
            default:'--'
        }
    },
    computed:{
        comNumber(){
            return this.defaultFn(this.number);
        },
        comName(){
            return this.defaultFn(this.name);
        },
        comCollectionTime(){
            return this.defaultFn(this.collectionTime);
        },
        comInvoiceTime(){
            return this.defaultFn(this.invoiceTime);
        },
        comPaper(){
             return this.defaultFn(this.paper);
        },
        comProject(){
            if(this.hide){
                 return this.defaultFn(this.project);
            }else{
                return `${this.project}(${this.address})`
            }
        },
        comImgSrc(){
            if(this.imgSrc === ''){
                return src
            }else{
                return this.imgSrc
            }
        },
        comMoney(){
            return this.money
        },
        comMoneyZh(){
            return this.defaultFn(this.moneyZh);
        },
        comCreate(){
            return this.defaultFn(this.create)
        },
        comRules(){
            if(this.rules == o.a || this.rules == o.b){
                return '买卖'
            }else{
                return this.defaultFn(this.rules)
            }
        },
        comPayerType(){
            return this.defaultFn(this.payerType)
        }
    },
    methods:{
        defaultFn(e){
            if(e === ''){
                return '--'
            }else{
                return e
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .cl-1{
        color: #999;
    }
    .cl-2{
        color: #666;
    }
    .mr-10{
        margin-right: 10px;
    }
    .mr-20{
        margin-right: 20px;
    }
    .ml-28{
        margin-left: 28px;
    }
    .fl{
        float: left;
    }
    .fr{
        float: right;
    }
    .fb{
        font-weight:bold;
    }
    .paper-info{
        width: 780px;
        margin:auto;
        color: #333;
    }
    .paper-border{
        border: 1px solid #E8EAF6;
        margin:20px 0;
        padding: 0 48px 10px 24px;
    }
    .paper-tit{
        font-size: 24px;
        padding-top: 28px;
        text-align: center;
        font-weight:bold;
    }
    .paper-number{
        color: #666;
        padding-top: 14px;
        text-align: center;
        font-weight:400;
    }
    .paper-ul{
        overflow: hidden;
        padding: 26px 0 16px;
        border-bottom: 1px solid #E5E5E5;
    }
    .paper-ul >li{
        float: left;
        width: 28%;
    }
    .paper-ul .w1{
        width: 23%;
    }
    .paper-ul .w2{
        width: 21%;
    }
    .paper-small-tit{
        font-weight:bold;
        padding-top: 24px;
    }
    .paper-table{
        border-top: 1px solid #C8C8C8;
        border-left: 1px solid #C8C8C8;
        margin-top: 10px;
        position: relative;
    }
    .paper-absolute{
        position: absolute;
        right: -26px;
        top:10px;
        line-height: 20px;
        font-weight:bold;
    }
    .paper-table > ul{
        overflow: hidden;
    }
    .paper-table > ul > li{
        border-bottom: 1px solid #C8C8C8;
        border-right: 1px solid #C8C8C8;
        width: 69%;
        box-sizing: border-box;
        float: left;
        line-height: 40px;
        height: 40px;
        text-align: center;
    }
    .paper-table > ul > li.wi{
        width: 31%;
    }
    .paper-ov{
        overflow: hidden;
        padding-top: 20px;
    }
    .paper-ov2{
        overflow: hidden;
        padding-top: 55px;
    }
    .paper-ov3{
        overflow: hidden;
        padding: 85px 0 55px;
    }
    .paper-tips{
        margin-top: 40px;
        line-height: 24px;
        color: #666;
        padding-top: 14px;
        border-top: 1px solid #EDECF0;
    }
    .paper-dashed{
        border-bottom: 1px dashed #AFAFAF;
    }
    .pr{
        position: relative;
    }
    .pr-img{
        position: absolute;
        width: 130px;
        height: 130px;
        left: 146px;
        bottom: -36px;
    }
    .pr-img2{
        position: absolute;
        width: 130px;
        height: 130px;
        left: 146px;
        bottom: 19px;
    }
</style>
