<template>
    <div class="container">
        <div class="cont-info border-b">
            <p class="bold">合同基本信息</p>
            <div class="cont-content text">
                <p>签约日期：<span>{{dealBasicInfo.signDate}}</span></p>
                <p>合同编号：<span style="color:#478DE3;font-weight:bold">{{dealBasicInfo.code}}</span></p>
                <p>合同类型：<span>{{setTypeFn(dealBasicInfo.contType)}}</span></p>
                <p>房屋总价：<span style="color:#FF9039;">{{dealBasicInfo.dealPrice}}元 <i>{{dealBasicInfo.dealPrice|moneyFormat}}</i></span></p>
                <p>应收佣金：<span>{{dealBasicInfo.receivableCommission}}元</span></p>
            </div>
        </div>
        <div class="house-info border-b">
            <p class="bold">房屋基本信息</p>
            <div class="house-content">
                <div class="item">
                    <div>
                        <span class="mark">两证情况：</span>
                        <el-select size="small" v-model="report.cardSituation" :disabled="!saveBtnShow" class="liangzheng">
                            <el-option v-for="item in dictionary['611']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                            <el-option label="无" value="无"></el-option>
                        </el-select>
                    </div>
                    <div>
                        <span class="mark">抵押情况：</span>
                        <el-select size="small" v-model="report.mortgageSituation" :disabled="!saveBtnShow" class="diya">
                            <el-option v-for="item in dictionary['615']" :key="item.key" :label="item.value" :value="item.key"></el-option>                            
                        </el-select>
                    </div>
                    <div>
                        <span class="mark">提前还款：</span>
                        <el-select size="small" v-model="report.isEarlyRepayment" :disabled="!saveBtnShow" class="huankuan">
                            <el-option label="否" value="0"></el-option>
                            <el-option label="是" value="1"></el-option>
                        </el-select>
                    </div>
                    <div class="square">
                        <span class="mark">建筑面积：<span>{{dealBasicInfo.Square}}㎡</span></span>
                    </div>
                    <div class="position">
                        <span class="use">土地使用权面积：</span>
                        <el-input size="small" v-model="report.landUseArea" :disabled="!saveBtnShow" @input="cutNumber('landUseArea')"></el-input>
                        <i>㎡</i>
                    </div>
                    <div>
                        <span>土地性质：</span>
                        <el-select size="small" v-model="report.landNature" :disabled="!saveBtnShow" clearable>
                            <el-option v-for="item in dictionary['618']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <div>
                        <span class="mark">权属证号：</span>
                        <el-input size="small" v-model.trim="report.ownershipNumber" maxlength="45" :disabled="!saveBtnShow" class="quanshu w300" @input="inputOnly('ownershipNumber')"></el-input>
                    </div>
                    <div style="margin-right: 50px">
                        <span class="mark">建成年代：</span>
                        <span>{{yearFormatFn(dealBasicInfo.CompleteYear)}}</span>
                    </div>
                    <div class="text-long">
                        <span class="mark">产权地址：<span>{{dealBasicInfo.propertyRightAddrmi?dealBasicInfo.propertyRightAddrmi:'-'}}</span></span>
                    </div>
                </div>
                <div class="item">
                    <div class="position shui-fei">
                        <span>预缴税费：</span>
                        <el-input size="small" v-model="report.payTaxation" :disabled="!saveBtnShow" @input="cutNumber('payTaxation')"></el-input>
                        <i>万元</i>
                    </div>
                    <div style="min-width:152px;">
                        <span class="floor">房屋总楼层：<span>{{dealBasicInfo.FloorAll}}层</span></span>
                    </div>
                    <div>
                        <span>建筑结构：</span>
                        <el-input size="small" v-model="report.buildingStructure" maxlength="10" :disabled="!saveBtnShow" class="jianzhu" @input="inputOnly('buildingStructure')"></el-input>
                    </div>
                    <div class="position" style="text-align: right;">
                        <span>评估值：</span>
                        <el-input size="small" v-model="report.evaluationValue" :disabled="!saveBtnShow" @input="cutNumber('evaluationValue')"></el-input>
                        <i>万元</i>
                    </div>
                </div>
            </div>
        </div>
        <div class="house-from resource">
            <div>
                <p class="bold">客源方信息</p>
                <div class="info" :class="recordVersion==2?'version-mark':''">
                    <p><span>店长：</span><el-input size="small" v-model.trim="report.guestShopOwnerName" maxlength="10" :disabled="!saveBtnShow" class="kezhang" @input="inputOnly('guestShopOwnerName')"></el-input></p>
                    <p style="margin:0 10px;" class="store"><span>门店：</span><el-input size="small" v-model.trim="report.guestStoreName" maxlength="20" :disabled="!saveBtnShow" class="kedian" @input="inputOnly('guestStoreName')"></el-input></p>
                    <p><span>联系电话：</span><el-input size="small" v-model.trim="report.guestShopOwnerMobile" :disabled="!saveBtnShow" oninput="if(value.length>11)value=value.slice(0,11)" class="kelian" @input="inputOnly('guestShopOwnerMobile')"></el-input></p>
                </div>
            </div>
            <div>
                <p class="bold">房源方信息</p>
                <div class="info text">
                    <p><span>店长：</span><el-input size="small" v-model.trim="report.houseShopOwnerName" maxlength="10" :disabled="!saveBtnShow" class="fangzhang" @input="inputOnly('houseShopOwnerName')"></el-input></p>
                    <p style="margin:0 10px;" class="store"><span>门店：</span><el-input size="small" v-model.trim="report.houseStoreName" maxlength="20" :disabled="!saveBtnShow" class="fangdian" @input="inputOnly('houseStoreName')"></el-input></p>
                    <p><span>联系电话：</span><el-input size="small" v-model.trim="report.houseShopOwnerMobile" :disabled="!saveBtnShow" oninput="if(value.length>11)value=value.slice(0,11)" class="fanglian" @input="inputOnly('houseShopOwnerMobile')"></el-input></p>
                </div>
            </div>
        </div>
        <div class="house-person resource">
            <div>
                <p class="bold">买方信息</p>
                <div class="guest msg info">
                    <div class="text mai-mai" v-for="(item,i) in buyerArr" :key="i">
                        <p><span>{{i==0?'姓名':'共有人'}}：</span><span style="width:135px;word-wrap:break-word;">{{item.name}}</span></p>
                        <p><span>电话：</span><span>{{item.mobile}}</span></p>
                        <p><span>{{item.cardType===1?"身份证":item.cardType===2?"护照":item.cardType===3?"营业执照":"军官证"}}：</span><span style="width:160px;word-wrap:break-word;">{{recordVersion==2?item.encryptionCode:'--'}}</span></p>
                    </div>
                    <div class="input">
                        <p>
                            <span class="mark">付款方式：</span>
                            <el-select size="small" v-model="report.buyerPaymentMethod" :disabled="loadType||!saveBtnShow" class="bank fukuan" @change="changeBuyerPaymentMethod">
                                <el-option v-for="item in dictionary['621']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </p>
                        <p style="margin:0 10px;">
                            <span class="mark">交易流程：</span>
                            <el-select size="small" v-model="report.transFlowName" :disabled="!saveBtnShow||reportFlowShow" class="liucheng" @change="transFlowSelect" v-if="transFlowNameShow">
                                <el-option v-for="item in flowList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                            </el-select>
                            <span class="transFlow" v-else>{{report.transFlowName?report.transFlowName:'-'}}</span>
                            <span class="mark">权证费用：</span>
                            <span class="warrant">{{report.flowQZfee?report.flowQZfee:0}}元</span>
                        </p>
                    </div>
                    <div class="input">
                        <p style="margin-left:5px;">
                            <span>按揭银行：</span>
                            <el-select size="small" v-model="report.stagesBankName" :disabled="noStageBank||!saveBtnShow" filterable clearable class="bank">
                                <el-option v-for="item in bankList" :key="item.id" :label="item.bankName" :value="item.bankName"></el-option>
                            </el-select>
                        </p>
                        <p style="margin:0 15px;">
                            <span>贷款金额：</span>
                            <el-input size="small" v-model="report.loanAmount" :disabled="noStageBank||!saveBtnShow" @input="cutNumber('loanAmount')"></el-input>
                            <span style="min-width:28px;">万元</span>
                        </p>
                        <p>
                            <span>贷款期限：</span>
                            <el-input size="small" v-model="report.loanTerm" :disabled="noStageBank||!saveBtnShow" @input="cutNumber('loanTerm')"></el-input>
                            <span>年</span>
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <p class="bold">卖方信息</p>
                <div class="owner msg info">
                    <div class="text mai-mai" v-for="(item,i) in sellerArr" :key="i">
                        <p><span>{{i==0?'姓名':'共有人'}}：</span><span style="width:135px;word-wrap:break-word;">{{item.name}}</span></p>
                        <p><span>电话：</span><span>{{item.mobile}}</span></p>
                        <p><span>{{item.cardType===1?"身份证":item.cardType===2?"护照":item.cardType===3?"营业执照":"军官证"}}：</span><span style="width:160px;word-wrap:break-word;">{{recordVersion==2?item.encryptionCode:'--'}}</span></p>
                    </div>
                    <div class="input">
                        <p style="margin-right:15px;">
                            <span style="min-width:126px;" class="mark">是否析产（继承）：</span>
                            <el-select size="small" v-model="report.isExtend" :disabled="!saveBtnShow" class="xichan">
                                <el-option label="否" value="0"></el-option>
                                <el-option label="是" value="1"></el-option>
                            </el-select>
                        </p>
                        <p>
                            <span style="min-width:70px;">婚姻状况：</span>
                            <el-select size="small" v-model="report.maritalStatus" :disabled="!saveBtnShow" clearable>
                                <el-option v-for="item in dictionary['624']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="agent resource">
            <div>
                <p class="bold">买方代理人信息</p>
                <div class="agent-info info">
                    <p>
                        <span>代理人姓名：</span>
                        <el-input size="small" class="w100" v-model="report.buyerAgentName" maxlength="10" :disabled="!saveBtnShow" @input="inputOnly('buyerAgentName')"></el-input>
                        <el-select size="small" class="w100" v-model="report.buyerAgentCardType" @change="cardTypeChange(1)" :disabled="!saveBtnShow" clearable>
                            <el-option v-for="item in dictionary['630']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                        <el-input size="small" :maxlength="report.buyerAgentCardType===1?18:report.buyerAgentCardType===2?30:report.buyerAgentCardType===3?20:18" @input="inputLimit($event,'report',1)" class="w200" v-model="report.buyerAgentCard" :disabled="!saveBtnShow"></el-input>
                    </p>
                    <p>
                        <span>电话：</span>
                        <el-input size="small" class="w200" v-model="report.buyerAgentMobile" :disabled="!saveBtnShow" oninput="if(value.length>11)value=value.slice(0,11)" @input="inputOnly('buyerAgentMobile')"></el-input>
                    </p>
                </div>
            </div>
            <div>
                <p class="bold">卖方代理人信息</p>
                <div class="agent-info info">
                    <p>
                        <span>代理人姓名：</span>
                        <el-input size="small" class="w100" v-model="report.sellerAgentName" maxlength="10" :disabled="!saveBtnShow" @input="inputOnly('sellerAgentName')"></el-input>
                        <el-select size="small" class="w100" v-model="report.sellerAgentCardType" @change="cardTypeChange(2)" :disabled="!saveBtnShow" clearable>
                            <el-option v-for="item in dictionary['630']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                        <el-input size="small" :maxlength="report.sellerAgentCardType===1?18:report.sellerAgentCardType===2?30:report.sellerAgentCardType===3?20:18" @input="inputLimit($event,'report',2)" class="w200" v-model="report.sellerAgentCard" :disabled="!saveBtnShow"></el-input>
                    </p>
                    <p>
                        <span>电话：</span>
                        <el-input size="small" class="w200" v-model="report.sellerAgentMobile" :disabled="!saveBtnShow" oninput="if(value.length>11)value=value.slice(0,11)" @input="inputOnly('sellerAgentMobile')"></el-input>
                    </p>
                </div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" class="confirmBtn" @click="saveFn" v-if="saveBtnShow">保 存</el-button>
        </div>
    </div>
</template>

<script>
import { MIXINS } from "@/assets/js/mixins";
import { TOOL } from "@/assets/js/common";
let checkPhone = function (str) {
    return /^1[3456789]\d{9}$/.test(str)
}
let checkIdCard = function (str) {
    return /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/.test(str)
}
let checkPassPort = function (str) {
    return /^1[45][0-9]{7}$|(^[P|p|S|s]\d{7}$)|(^[S|s|G|g|E|e]\d{8}$)|(^[Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|(^[H|h|M|m]\d{8,10}$)/.test(str)
}
function addRedBorder(className,type=1) {
    let obj = document.getElementsByClassName(className)
    if(type===1) {
        obj[0].firstElementChild.style.borderColor = '#f56c6c'
    } else {
        obj[0].firstElementChild.firstElementChild.style.borderColor = '#f56c6c' 
    }
}
function removeRedBorder(className,type=1) {
    let obj = document.getElementsByClassName(className)
    if(type===1) {
        obj[0].firstElementChild.style.borderColor = '#dcdfe6'
    } else {
        obj[0].firstElementChild.firstElementChild.style.borderColor = '#dcdfe6'  
    }
}
export default {
    mixins: [MIXINS],
    props: {
        id: Number,
        contType: String,
        saveBtnShow: Boolean,
        reportFlowShow: Boolean,
        defaultInfo: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    data() {
        return {
            // 带出不可编辑字段
            dealBasicInfo: {
                signDate: "",
                code: "",
                contType: "",
                dealPrice: "",
                receivableCommission: "",
                Square: "",
                propertyRightAddrmi: "",
                FloorAll: "",
                CompleteYear: ""
            },
            report: {
                cardSituation: "",
                mortgageSituation: "",
                isEarlyRepayment: "",
                landUseArea: "",
                landNature: "",
                ownershipNumber: "",
                payTaxation: "",
                buildingStructure: "",
                evaluationValue: "",
                buyerPaymentMethod: "",
                transFlowCode: "",
                transFlowName: "",
                stagesBankName: "",
                loanAmount: "",
                loanTerm: "",
                isExtend: "",
                maritalStatus: "",
                buyerAgentName: "",
                buyerAgentCardType: "",
                buyerAgentCard: "",
                buyerAgentMobile: "",
                sellerAgentName: "",
                sellerAgentCardType: "",
                sellerAgentCard: "",
                sellerAgentMobile: "",
                guestShopOwnerName: "",
                guestStoreName: "",
                guestShopOwnerMobile: "",
                houseShopOwnerName: "",
                houseStoreName: "",
                houseShopOwnerMobile: ""
            },
            flowList: [], //交易流程
            //数据字典
            dictionary: {
                "611": "", //两证情况
                "615": "", //抵押情况
                "618": "", //土地性质
                "621": "", //买方付款方式
                "624": "", //婚姻状况
                "630": "" //代理人证件类型
            },
            //银行列表
            bankList: [
                // { id: 1, name: "中国工商银行" },
                // { id: 2, name: "中国建设银行" },
                // { id: 3, name: "中国银行" },
                // { id: 4, name: "中国农业银行" },
                // { id: 5, name: "交通银行" },
                // { id: 6, name: "招商银行" },
                // { id: 7, name: "中信银行" },
                // { id: 8, name: "中国民生银行" },
                // { id: 9, name: "兴业银行" },
                // { id: 10, name: "上海浦东发展银行" },
                // { id: 11, name: "中国邮政储蓄银行" },
                // { id: 12, name: "中国光大银行" },
                // { id: 13, name: "平安银行" },
                // { id: 14, name: "华夏银行" }
            ],
            buyerArr: [],
            sellerArr: [],
            noStageBank: true,
            recordVersion: '', //合同页面版式
            loadType: false, //是否武汉全款贷款买卖
            transFlowNameShow:false
        }
    },
    created() {
        if(this.contType === '2' || this.contType === '3' ||this.contType === '6') {
           this.getContractDetail()
           this.getFlowList()
           this.getDictionary()
           this.changeBuyerPaymentMethod(this.report.buyerPaymentMethod)
        }
    },
    methods: {
        changeBuyerPaymentMethod(val) {
            if (val === 2 && this.bankList.length === 0) {
                this.$ajax.get('/api/system/selectBankName').then(res=>{
                    res=res.data
                if(res.status===200){
                    this.bankList=res.data
                }
                }).catch(error=>{
                    this.$message({message:error})
                })
            }
        },
        inputLimit(val,type,index){
            if(index == 1){
                this[type].buyerAgentCard = val.replace(/\s+/g,'')
            }else{
                this[type].sellerAgentCard = val.replace(/\s+/g,'')
            }
        },
        setTypeFn(val) {
            if(this.loadType) {
                if(this.report.buyerPaymentMethod === 1) {
                    return `全款${val}`
                } else {
                    return `贷款${val}`
                }
            } else {
                return val
            }
        },
        yearFormatFn(val) {
            if(val) {
                if(val.includes('年')) {
                    return val
                } else {
                    return val=='0'||val=='--' ? '--' : `${val}年`
                }
            } else {
                return '--'
            }
        },
        getContractDetail() {
            let data = JSON.parse(JSON.stringify(this.defaultInfo))
            this.dealBasicInfo.signDate = data.signDate.substr(0, 16)
            this.dealBasicInfo.code = data.code
            this.dealBasicInfo.contType = data.contType.label
            this.dealBasicInfo.dealPrice = data.dealPrice
            this.dealBasicInfo.receivableCommission = data.receivableCommission
            this.dealBasicInfo.Square = data.houseInfo.Square
            this.dealBasicInfo.CompleteYear = data.houseInfo.CompleteYear
            this.dealBasicInfo.propertyRightAddrmi = data.propertyRightAddrmi
            this.dealBasicInfo.FloorAll = data.houseInfo.FloorAll
            this.report = data.dealReport ? JSON.parse(data.dealReport) : this.report
            // 交易流程字段取合同详情的数据
            this.report.transFlowCode=data.transFlowCode
            this.report.transFlowName=data.transFlow
            data.transFlow?this.transFlowNameShow=false:this.transFlowNameShow=true;
            this.report.flowQZfee=data.flowQZfee
            this.recordVersion = data.recordVersion
            if(data.loanType) {
                this.report.buyerPaymentMethod = data.loanType == 7 ? 1: 2
            }
            this.loadType = data.loanType ? true : false
            if(!data.dealReport) {
                this.report.guestShopOwnerName = this.recordVersion === 1 ? data.dealAgentShopowner : data.guestInfo.ShopOwnerName
                this.report.guestStoreName = this.recordVersion === 1 ? data.dealAgentStoreName : data.guestInfo.GuestStoreName
                this.report.guestShopOwnerMobile = this.recordVersion === 1 ? data.dealAgentShopownerMobile :data.guestInfo.ShopOwnerMobile
                this.report.houseShopOwnerName = data.houseInfo.ShopOwnerName
                this.report.houseStoreName = data.houseInfo.HouseStoreName
                this.report.houseShopOwnerMobile = data.houseInfo.ShopOwnerMobile   
            }
            this.buyerArr = data.contPersons.filter(item => item.personType.value === 2)
            this.sellerArr = data.contPersons.filter(item => item.personType.value === 1)
        },
        getFlowList() {
            this.$ajax.get('/api/contract/getTransFlowListByCity').then(res => {
                res = res.data
                if(res.status === 200) {
                    this.flowList = res.data
                }
            }).catch(error => {
                this.$message({
                    message: error,
                    type: "error"
                })
            })
        },
        transFlowSelect(val) {
            this.flowList.find(item => {
                if(item.name === val) {
                    this.report.transFlowCode = item.id
                    this.report.flowQZfee = item.warrantFee
                }
            })
        },
        cardTypeChange(type) {
            if(type === 1) {
                this.report.buyerAgentCard = ""
            } else {
                this.report.sellerAgentCard = ""
            }
        },
        saveFn() {
            let arr_basic = [
                { val: this.report.cardSituation, className: 'liangzheng', msg: '两证情况', type: 2 },
                { val: this.report.mortgageSituation, className: 'diya', msg: '抵押情况', type: 2 },
                { val: this.report.isEarlyRepayment, className: 'huankuan', msg: '是否提前还款', type: 2 },
                { val: this.report.ownershipNumber, className: 'quanshu', msg: '权属证号', type: 1 },
            ]
            let arr_cus = [
                { val: this.report.guestShopOwnerName, className: 'kezhang', msg: '客源方店长', type: 1 },
                { val: this.report.guestStoreName, className: 'kedian', msg: '客源方门店', type: 1 },
                { val: this.report.guestShopOwnerMobile, className: 'kelian', msg: '客源方联系电话', type: 1 }
            ]
            let arr_hou = [
                { val: this.report.houseShopOwnerName, className: 'fangzhang', msg: '房源方店长', type: 1 },
                { val: this.report.houseStoreName, className: 'fangdian', msg: '房源方门店', type: 1 },
                { val: this.report.houseShopOwnerMobile, className: 'fanglian', msg: '房源方联系电话', type: 1 }
            ]
            let arr_deal = [
                { val: this.report.buyerPaymentMethod, className: 'fukuan', msg: '付款方式', type: 2 },
                // { val: this.report.transFlowName, className: 'liucheng', msg: '交易流程', type: 2 },
                { val: this.report.isExtend, className: 'xichan', msg: '是否析产（继承）', type: 2 }
            ]
            let arr = []
            if(this.recordVersion==2){ //复杂版
                arr = [].concat(arr_basic,arr_cus,arr_hou,arr_deal)
            } else { //温州基础版客源方信息非必填
                arr = [].concat(arr_basic,arr_hou,arr_deal)
            }
            for(let i = 0; i < arr.length; i++) {
                if(!arr[i].val) {
                    this.$message(`${arr[i].msg}不能为空`)
                    addRedBorder(arr[i].className,arr[i].type)
                    return
                }
            }
            if(!checkPhone(this.report.guestShopOwnerMobile)&&this.recordVersion==2) {
                this.$message({message:"请输入11位正确的客源方联系电话",type:"warning"})
                return
            }
            if(!checkPhone(this.report.houseShopOwnerMobile)) {
                this.$message({message:"请输入11位正确的房源方联系电话",type:"warning"})
                return
            }
            if(this.report.buyerAgentCardType) {
                if(this.report.buyerAgentCard) {
                    let type = this.report.buyerAgentCardType
                    let val = this.report.buyerAgentCard
                    if(type === 1) {
                        if(!checkIdCard(val)) {
                            this.$message({message:'买方代理人身份证号不正确',type:'warning'})
                            return
                        }
                    }
                    if(!this.report.buyerAgentName) {
                        this.$message("买方代理人姓名不能为空")
                        return
                    }
                } else {
                    this.$message("买方代理人证件号不能为空")
                    return
                }
            }
            if(this.report.sellerAgentCardType) {
                if(this.report.sellerAgentCard) {
                    let type = this.report.sellerAgentCardType
                    let val = this.report.sellerAgentCard
                    if(type === 1) {
                        if(!checkIdCard(val)) {
                            this.$message({message:'卖方代理人身份证号不正确',type:'warning'})
                            return
                        }
                    }
                    if(!this.report.sellerAgentName) {
                        this.$message("卖方代理人姓名不能为空")
                        return
                    }
                } else {
                    this.$message("卖方代理人证件号不能为空")
                    return
                }
            }
            if(this.report.buyerAgentMobile&&!this.report.buyerAgentName) {
                this.$message("买方代理人姓名不能为空")
                return
            }
            if(this.report.sellerAgentMobile&&!this.report.sellerAgentName) {
                this.$message("卖方代理人姓名不能为空")
                return
            }
            this.$ajax.postJSON('/api/contract/updateReport',{report:this.report, id:this.id}).then(res => {
                res = res.data
                if(res.status === 200) {
                    this.$message({
                        message: "保存成功",
                        type: "success"
                    })
                    this.$emit("changeBtnStatus")
                }
            }).catch(error => {
                this.$message({
                    message: error,
                    type: "error"
                })
            })
        },
        cutNumber(val) {
            this.$nextTick(() =>{
                this.report[val] = this.$tool.cutFloat({val:this.report[val],max:999999999.99})
            })
        },
        inputOnly(val) {
            if(val === 'ownershipNumber') {
                this.$nextTick(()=>{
                   this.report.ownershipNumber = this.report.ownershipNumber.replace(/[^\-\/\(\)\（\）\s\d\a-zA-Z\u4E00-\u9FA5]/g, "")
                })
            }else if(val === 'buildingStructure') {
                this.$nextTick(()=>{
                    this.report.buildingStructure = this.$tool.textInput(this.report.buildingStructure,3) 
                })
            }else if(val === 'guestShopOwnerMobile'||val === 'houseShopOwnerMobile'||val === 'buyerAgentMobile'||val === 'sellerAgentMobile') {
                this.$nextTick(()=>{
                   this.report[val] = this.$tool.numberInput(this.report[val]) 
                })
            }else {
                this.$nextTick(()=>{
                    this.report[val] = this.$tool.textInput(this.report[val])
                })
            }
        }
    },
    filters: {
        moneyFormat: function(val) {
            if (!val) {
                return "零";
            } else {
                return TOOL.toChineseNumber(val);
            }
        }
    },
    watch: {
        'report.cardSituation'(newVal,oldVal) {
            if(newVal) {
                removeRedBorder('liangzheng',2)
            }
        },
        'report.mortgageSituation'(newVal,oldVal) {
            if(newVal) {
                removeRedBorder('diya',2)
            }
        },
        'report.isEarlyRepayment'(newVal,oldVal) {
            if(newVal==='0'||newVal==='1') {
                removeRedBorder('huankuan',2)
            }
        },
        'report.ownershipNumber'(newVal,oldVal) {
            if(newVal) {
                removeRedBorder('quanshu')
            }
        },
        // 'report.transFlowName'(newVal,oldVal) {
        //     if(newVal) {
        //         removeRedBorder('liucheng',2)
        //     }
        // },
        'report.isExtend'(newVal,oldVal) {
            if(newVal==='0'||newVal==='1') {
                removeRedBorder('xichan',2)
            }
        },
        'report.buyerPaymentMethod'(newVal,oldVal) {
            if(newVal) {
                removeRedBorder('fukuan',2)
            }
            if(newVal === 1) {
                this.noStageBank = true
                this.report.stagesBankName = ""
                this.report.loanAmount = ""
                this.report.loanTerm = ""
            } else {
                this.noStageBank = false
            }
        },
        'report.guestShopOwnerName'(newVal,oldVal) {
            if(newVal) {
                removeRedBorder('kezhang')
            }
        },
        'report.guestStoreName'(newVal,oldVal) {
            if(newVal) {
                removeRedBorder('kedian')
            }
        },
        'report.guestShopOwnerMobile'(newVal,oldVal) {
            if(newVal) {
                removeRedBorder('kelian')
            }
        },
        'report.houseShopOwnerName'(newVal,oldVal) {
            if(newVal) {
                removeRedBorder('fangzhang')
            }
        },
        'report.houseStoreName'(newVal,oldVal) {
            if(newVal) {
                removeRedBorder('fangdian')
            }
        },
        'report.houseShopOwnerMobile'(newVal,oldVal) {
            if(newVal) {
                removeRedBorder('fanglian')
            }
        },
    }
}
</script>

<style scoped lang="less">
@import "~@/assets/common.less";
.container {
    overflow-x: auto;
    color: @color-6c;
    .bold {
        font-weight: bold;
        color: @color-blank;
        margin-bottom: 10px;
    }
    .border-b {
        border-bottom: 1px solid #EDECF0;
    }
    .text {
        p {
            display: flex;
            align-items: center;
            &::before {
                content: "*";
                color: red;
                position: relative;
                top: 3px;
            }
        }
        span {
            color: @color-blank;
        }
        &.mai-mai {
            span {
                display: inline-block;
            }
            p:first-child {
                width: 202px;
            }
            p:nth-child(2) {
                width: 160px;
            }
        }
    }
    .text-long {
        min-width: 373px;
    }
    .square {
        min-width: 120px;
    }
    .jianzhu {
        min-width: 160px;
    }
    .mark::before {
        content: "*";
        color: red;
        position: relative;
        top: 3px;
    }
    .position {
        i {
            line-height: 32px;
        }
        &.shui-fei {
            margin-left: 6px!important;
        }
    }
}

.cont-info {
    margin: 20px 0 10px 0;
    .cont-content {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 10px;
        p {
            margin-right: 50px;
        }
    }
}

.house-info {
    margin-bottom: 10px;
    .house-content {
        margin-bottom: 10px;
        .item {
            display: flex;
            flex-wrap: wrap;
            width: 1200px;
            > div {
                display: flex;
                margin: 0 22px 5px 0;
                > span {
                    min-width: 70px;
                    line-height: 32px;
                    &.use {
                        min-width: 112px;
                    }
                    &.floor {
                        min-width: 84px;
                        span {
                            color: @color-blank;
                        }
                    }
                }
                .el-select {
                    width: 100px;
                }
                .el-input {
                    width: 100px;
                }
            }
        }
    }
}

.resource {
    display: flex;
    > div {
        min-width: 620px;
        border: 1px solid #ebeef5;
        margin-right: 10px;
        > p {
            border-bottom: 1px solid #ebeef5;
            text-align: center;
            background-color: #EEF2FB;
            line-height: 30px;
        }
        .info {
            padding-left: 10px;
            margin-bottom: 10px;
            span:first-child {
                color: @color-6c;
            }
            &.version-mark p::before {
                content: "*";
                color: red;
                position: relative;
                top: 3px;
            }
        }
    }
}
.house-from {
    .info {
        display: flex;
    }
    .el-input {
        width: 115px;
    }
    .store {
        .el-input {
            width: 170px;
        }
    }
}
.house-person {
    margin: 10px 0;
    .guest,
    .owner {
        > div {
            display: flex;
            margin-bottom: 5px;
            > p {
                display: flex;
            }
        }
    }
    .msg {
        .input {
            span {
                line-height: 32px;
            }
            .el-select {
                width: 145px;
            }
            .el-input {
                width: 70px;
            }
        }
    }
    .liucheng {
        width: 180px!important;
    }
    .transFlow{
        display: inline-block;
        width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .warrant{
        display: inline-block;
        width: 100px;
    }
    .bank {
        width: 145px!important;
    }
}

.agent {
    .agent-info p {
        display: flex;
        margin-bottom: 10px;
        span {
            min-width: 84px;
            text-align: right;
            line-height: 32px;
        }
        .w100 {
            width: 100px;
            margin-right: 10px;
        }
        .w200 {
            width: 210px!important;
        }
    }
}

.dialog-footer {
    width: 1200px;
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: center;
}
.confirmBtn {
    width: 100px;
    height: 38px;
    border-radius: 18px;
    color: #fff;
}
</style>