<template>
    <div class="container">
        <div class="cont-info border-b">
            <p class="bold">合同基本信息</p>
            <div class="cont-content text">
                <p>签约日期：<span>{{dealBasicInfo.signDate}}</span></p>
                <p>合同编号：<span style="color:#478DE3;font-weight:bold">{{dealBasicInfo.code}}</span></p>
                <p>交易类型：<span>{{dealBasicInfo.contType}}</span></p>
                <p>房屋总价：<span style="color:#FF9039;">{{dealBasicInfo.dealPrice}}元 <i>{{dealBasicInfo.dealPrice|moneyFormat}}</i></span></p>
                <p>应收佣金：<span>{{dealBasicInfo.receivableCommission}}元</span></p>
            </div>
        </div>
        <div class="house-info border-b">
            <p class="bold">房屋基本信息</p>
            <div class="house-content">
                <div class="item">
                    <div class="mark">
                        <span>两证情况：</span>
                        <el-select size="small" v-model="report.cardSituation" :disabled="!saveBtnShow" class="liangzheng">
                            <el-option v-for="item in dictionary['611']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                            <el-option label="无" value="无"></el-option>
                        </el-select>
                    </div>
                    <div class="mark">
                        <span>抵押情况：</span>
                        <el-select size="small" v-model="report.mortgageSituation" :disabled="!saveBtnShow" class="diya">
                            <el-option v-for="item in dictionary['615']" :key="item.key" :label="item.value" :value="item.key"></el-option>                            
                        </el-select>
                    </div>
                    <div class="mark">
                        <span>提前还款：</span>
                        <el-select size="small" v-model="report.isEarlyRepayment" :disabled="!saveBtnShow" class="huankuan">
                            <el-option label="否" value="0"></el-option>
                            <el-option label="是" value="1"></el-option>
                        </el-select>
                    </div>
                    <div class="square mark">
                        <span class="text">建筑面积：<span>{{dealBasicInfo.Square}}㎡</span></span>
                    </div>
                    <div class="position">
                        <span class="use">土地使用权面积：</span>
                        <el-input size="small" v-model="report.landUseArea" :disabled="!saveBtnShow" @input="cutNumber('landUseArea')"></el-input>
                        <i>㎡</i>
                    </div>
                    <div>
                        <span>土地性质：</span>
                        <el-select size="small" v-model="report.landNature" :disabled="!saveBtnShow">
                            <el-option v-for="item in dictionary['618']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <div class="text-long mark">
                        <span class="text">物业地址：<span>{{dealBasicInfo.propertyAddr}}</span></span>
                    </div>
                    <div class="number mark">
                        <span>权属证号：</span>
                        <el-input size="small" v-model.trim="report.ownershipNumber" :disabled="!saveBtnShow" class="quanshu" @input="inputOnly('ownershipNumber')"></el-input>
                    </div>
                </div>
                <div class="item">
                    <div class="position shui-fei">
                        <span>缴纳税费：</span>
                        <el-input size="small" v-model="report.payTaxation" :disabled="!saveBtnShow" @input="cutNumber('payTaxation')"></el-input>
                        <i>万元</i>
                    </div>
                    <div style="min-width:152px;">
                        <span class="floor">房屋总楼层：<span>{{dealBasicInfo.FloorAll}}层</span></span>
                    </div>
                    <div>
                        <span>建筑结构：</span>
                        <el-input size="small" v-model="report.buildingStructure" :disabled="!saveBtnShow"></el-input>
                    </div>
                    <div class="position">
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
                <div class="info text">
                    <p><span>店长：</span><el-input size="small" v-model.trim="report.guestShopOwnerName" :disabled="!saveBtnShow" class="kezhang" @input="inputOnly('guestShopOwnerName')"></el-input></p>
                    <p style="margin:0 10px;" class="store"><span>门店：</span><el-input size="small" v-model.trim="report.guestStoreName" :disabled="!saveBtnShow" class="kedian" @input="inputOnly('guestStoreName')"></el-input></p>
                    <p><span>联系电话：</span><el-input size="small" type="number" v-model.trim="report.guestShopOwnerMobile" :disabled="!saveBtnShow" oninput="if(value.length>11)value=value.slice(0,11)" class="kelian" @mousewheel.native.prevent></el-input></p>
                </div>
            </div>
            <div>
                <p class="bold">房源方信息</p>
                <div class="info text">
                    <p><span>店长：</span><el-input size="small" v-model.trim="report.houseShopOwnerName" :disabled="!saveBtnShow" class="fangzhang" @input="inputOnly('houseShopOwnerName')"></el-input></p>
                    <p style="margin:0 10px;" class="store"><span>门店：</span><el-input size="small" v-model.trim="report.houseStoreName" :disabled="!saveBtnShow" class="fangdian" @input="inputOnly('houseStoreName')"></el-input></p>
                    <p><span>联系电话：</span><el-input size="small" type="number" v-model.trim="report.houseShopOwnerMobile" :disabled="!saveBtnShow" oninput="if(value.length>11)value=value.slice(0,11)" class="fanglian" @mousewheel.native.prevent></el-input></p>
                </div>
            </div>
        </div>
        <div class="house-person resource">
            <div>
                <p class="bold">买方信息</p>
                <div class="guest msg info">
                    <div class="text mai-mai">
                        <p><span>姓名：</span><span style="min-width:56px;">{{firstBuyer.name}}</span></p>
                        <p><span style="min-width:56px;">身份证：</span><span>{{firstBuyer.encryptionCode}}</span></p>
                        <p><span>电话：</span><span>{{firstBuyer.encryptionMobile}}</span></p>
                    </div>
                    <ul class="text gongyouren" v-if="buyerArr.length !== 1">
                        <li v-for="(item,index) in buyerArr" :key="index">
                            <p><span style="min-width:84px;">共有人姓名：</span><span style="min-width:56px;">{{item.name}}</span></p>
                            <p><span style="min-width:42px;">电话：</span><span>{{item.encryptionMobile}}</span></p>
                        </li>
                    </ul>
                    <div class="input">
                        <p>
                            <span>付款方式：</span>
                            <el-select size="small" v-model="report.buyerPaymentMethod" :disabled="!saveBtnShow" class="bank">
                                <el-option v-for="item in dictionary['621']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </p>
                        <p style="margin:0 10px;" class="mark">
                            <span>交易流程：</span>
                            <el-select size="small" v-model="report.transFlowCode" :disabled="transFlowEdit" class="liucheng">
                                <el-option v-for="item in flowList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </p>
                    </div>
                    <div class="input">
                        <p>
                            <span>按揭银行：</span>
                            <el-select size="small" v-model="report.stagesBankName" :disabled="noStageBank||!saveBtnShow" filterable class="bank">
                                <el-option v-for="item in bankList" :key="item.id" :label="item.name" :value="item.name"></el-option>
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
                    <div class="text mai-mai">
                        <p><span>姓名：</span><span style="min-width:56px;">{{firstSeller.name}}</span></p>
                        <p><span style="min-width:56px;">身份证：</span><span>{{firstSeller.encryptionCode}}</span></p>
                        <p><span>电话：</span><span>{{firstSeller.encryptionMobile}}</span></p>
                    </div>
                    <ul class="text gongyouren" v-if="sellerArr.length !== 1">
                        <li v-for="(item,index) in sellerArr" :key="index">
                            <p><span style="min-width:84px;">共有人姓名：</span><span style="min-width:56px;">{{item.name}}</span></p>
                            <p><span style="min-width:42px;">电话：</span><span>{{item.encryptionMobile}}</span></p>
                        </li>
                    </ul>
                    <div class="input">
                        <p class="mark" style="margin-right:15px;">
                            <span style="min-width:126px;">是否析产（继承）：</span>
                            <el-select size="small" v-model="report.isExtend" :disabled="!saveBtnShow" class="xichan">
                                <el-option label="否" value="0"></el-option>
                                <el-option label="是" value="1"></el-option>
                            </el-select>
                        </p>
                        <p>
                            <span style="min-width:70px;">婚姻状况：</span>
                            <el-select size="small" v-model="report.maritalStatus" :disabled="!saveBtnShow">
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
                        <el-input size="small" class="w100" v-model="report.buyerAgentName" :disabled="!saveBtnShow" @input="inputOnly('buyerAgentName')"></el-input>
                        <el-select size="small" class="w100" v-model="report.buyerAgentCardType" @change="cardTypeChange(1)" :disabled="!saveBtnShow">
                            <el-option v-for="item in dictionary['630']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                        <el-input size="small" maxlength="18" onkeyup="value=value.replace(/\s+/g,'')" class="w200" v-model="report.buyerAgentCard" :disabled="!saveBtnShow"></el-input>
                    </p>
                    <p>
                        <span>电话：</span>
                        <el-input size="small" type="number" class="w200" v-model="report.buyerAgentMobile" :disabled="!saveBtnShow" oninput="if(value.length>11)value=value.slice(0,11)" @mousewheel.native.prevent></el-input>
                    </p>
                </div>
            </div>
            <div>
                <p class="bold">卖方代理人信息</p>
                <div class="agent-info info">
                    <p>
                        <span>代理人姓名：</span>
                        <el-input size="small" class="w100" v-model="report.sellerAgentName" :disabled="!saveBtnShow" @input="inputOnly('sellerAgentName')"></el-input>
                        <el-select size="small" class="w100" v-model="report.sellerAgentCardType" @change="cardTypeChange(2)" :disabled="!saveBtnShow">
                            <el-option v-for="item in dictionary['630']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                        <el-input size="small" maxlength="18" onkeyup="value=value.replace(/\s+/g,'')" class="w200" v-model="report.sellerAgentCard" :disabled="!saveBtnShow"></el-input>
                    </p>
                    <p>
                        <span>电话：</span>
                        <el-input size="small" type="number" class="w200" v-model="report.sellerAgentMobile" :disabled="!saveBtnShow" oninput="if(value.length>11)value=value.slice(0,11)" @mousewheel.native.prevent></el-input>
                    </p>
                </div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button class="confirmBtn" @click="saveFn" v-if="saveBtnShow">保存</el-button>
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
    return /^[1-9]\d{5}((((19|[2-9][0-9])\d{2})(0?[13578]|1[02])(0?[1-9]|[12][0-9]|3[01]))|(((19|[2-9][0-9])\d{2})(0?[13456789]|1[012])(0?[1-9]|[12][0-9]|30))|(((19|[2-9][0-9])\d{2})0?2(0?[1-9]|1[0-9]|2[0-8]))|(((1[6-9]|[2-9][0-9])(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))0?229))\d{3}[0-9Xx]$/.test(str)
}
let checkPassPort = function (str) {
    return /^1[45][0-9]{7}$|(^[P|p|S|s]\d{7}$)|(^[S|s|G|g|E|e]\d{8}$)|(^[Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|(^[H|h|M|m]\d{8,10}$)/.test(str)
}
function addRedBorder(className) {
    let obj = document.getElementsByClassName(className)
    if(className === 'quanshu'||className === 'kezhang' ||className === 'kedian'||className === 'kelian'||
        className === 'fangzhang'||className === 'fangdian'||className === 'fanglian') {
        obj[0].firstElementChild.style.borderColor = '#f56c6c'
    } else {
        obj[0].firstElementChild.firstElementChild.style.borderColor = '#f56c6c' 
    }
}
function removeRedBorder(className) {
    let obj = document.getElementsByClassName(className)
    if(className === 'quanshu'||className === 'kezhang' ||className === 'kedian'||className === 'kelian'||
        className === 'fangzhang'||className === 'fangdian'||className === 'fanglian') {
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
        saveBtnShow: Boolean
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
                propertyAddr: "",
                FloorAll: ""
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
                { id: 1, name: "中国工商银行" },
                { id: 2, name: "中国建设银行" },
                { id: 3, name: "中国银行" },
                { id: 4, name: "中国农业银行" },
                { id: 5, name: "交通银行" },
                { id: 6, name: "招商银行" },
                { id: 7, name: "中信银行" },
                { id: 8, name: "中国民生银行" },
                { id: 9, name: "兴业银行" },
                { id: 10, name: "上海浦东发展银行" },
                { id: 11, name: "中国邮政储蓄银行" },
                { id: 12, name: "中国光大银行" },
                { id: 13, name: "平安银行" },
                { id: 14, name: "华夏银行" }
            ],
            firstBuyer: {
                name: "",
                encryptionCode: "",
                encryptionMobile: ""
            },
            buyerArr: [],
            firstSeller: {
                name: "",
                encryptionCode: "",
                encryptionMobile: ""
            },
            sellerArr: [],
            transFlowEdit: false,
            noStageBank: false
        }
    },
    created() {
        if(this.contType === '2' || this.contType === '3') {
           this.getContractDetail()
           this.getFlowList()
           this.getDictionary()
        }
    },
    methods: {
        getContractDetail() {
            this.$ajax.get('/api/contract/detail',{id:this.id}).then(res => {
                res = res.data
                if(res.status === 200) {
                    this.dealBasicInfo.signDate = res.data.signDate.substr(0, 10)
                    this.dealBasicInfo.code = res.data.code
                    this.dealBasicInfo.contType = res.data.contType.label
                    this.dealBasicInfo.dealPrice = res.data.dealPrice
                    this.dealBasicInfo.receivableCommission = res.data.receivableCommission
                    this.dealBasicInfo.Square = res.data.houseInfo.Square
                    this.dealBasicInfo.propertyAddr = res.data.propertyAddr
                    this.dealBasicInfo.FloorAll = res.data.houseInfo.FloorAll
                    this.report = res.data.dealReport ? JSON.parse(res.data.dealReport) : this.report
                    this.transFlowEdit = res.data.dealReport ? true : false
                    if(!JSON.parse(res.data.dealReport).guestShopOwnerName) {
                        this.report.guestShopOwnerName = res.data.guestInfo.ShopOwnerName
                        this.report.guestStoreName = res.data.guestInfo.GuestStoreName
                        this.report.guestShopOwnerMobile = res.data.guestInfo.ShopOwnerMobile
                        this.report.houseShopOwnerName = res.data.houseInfo.ShopOwnerName
                        this.report.houseStoreName = res.data.houseInfo.HouseStoreName
                        this.report.houseShopOwnerMobile = res.data.houseInfo.ShopOwnerMobile   
                    }
                    this.buyerArr = res.data.contPersons.filter(item => item.personType.value === 2)
                    this.sellerArr = res.data.contPersons.filter(item => item.personType.value === 1)
                    this.firstBuyer.name = this.buyerArr[0].name
                    this.firstBuyer.encryptionCode = this.buyerArr[0].encryptionCode
                    this.firstBuyer.encryptionMobile = this.buyerArr[0].encryptionMobile
                    this.firstSeller.name = this.sellerArr[0].name
                    this.firstSeller.encryptionCode = this.sellerArr[0].encryptionCode
                    this.firstSeller.encryptionMobile = this.sellerArr[0].encryptionMobile
                }
            }).catch(error => {
                this.$message({
                    message: error,
                    type: "error"
                })
            })
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
        cardTypeChange(type) {
            if(type === 1) {
                this.report.buyerAgentCard = ""
            } else {
                this.report.sellerAgentCard = ""
            }
        },
        saveFn() {
            if(this.report.cardSituation) {
                if(this.report.mortgageSituation) {
                    if(this.report.isEarlyRepayment) {
                        if(this.report.ownershipNumber) {
                            if(this.report.guestShopOwnerName) {
                                if(this.report.guestStoreName) {
                                    if(this.report.guestShopOwnerMobile) {

                                    } else {
                                        this.$message({message:"客源方联系电话不能为空"})
                                        addRedBorder('kelian')
                                        return false
                                    }
                                } else {
                                    this.$message({message:"客源方门店不能为空"})
                                    addRedBorder('kedian')
                                    return false
                                }
                            } else {
                                this.$message({message:"客源方店长不能为空"})
                                addRedBorder('kezhang')
                                return false
                            }
                        } else {
                            this.$message({message:"权属证号不能为空"})
                            addRedBorder('quanshu')
                            return false
                        }
                    } else {
                        this.$message({message:"是否提前还款不能为空"})
                        addRedBorder('huankuan')
                        return false
                    }
                } else {
                    this.$message({message:"抵押情况不能为空"})
                    addRedBorder('diya')
                    return false
                }
            } else {
                this.$message({message:"两证情况不能为空"})
                addRedBorder('liangzheng')
                return false
            }
            if(this.report.houseShopOwnerName) {
                if(this.report.houseStoreName) {
                    if(this.report.houseShopOwnerMobile) {
                        if(this.report.transFlowCode) {
                            if(this.report.isExtend) {

                            } else {
                                this.$message({message:"是否析产（继承）不能为空"})
                                addRedBorder('xichan')
                                return false
                            }
                        } else {
                            this.$message({message:"交易流程不能为空"})
                            addRedBorder('liucheng')
                            return false
                        }
                    } else {
                        this.$message({message:"房源方联系电话不能为空"})
                        addRedBorder('fanglian')
                        return false
                    }
                } else {
                    this.$message({message:"房源方门店不能为空"})
                    addRedBorder('fangdian')
                    return false
                }
            } else {
                this.$message({message:"房源方店长不能为空"})
                addRedBorder('fangzhang')
                return false
            }
            if(this.report.buyerAgentCardType) {
                if(this.report.buyerAgentCard) {
                    let type = this.report.buyerAgentCardType
                    let val = this.report.buyerAgentCard
                    if(type === 1) {
                        if(!checkIdCard(val)) {
                            this.$message({message:'买方代理人身份证号不正确',type:'warning'})
                            return false
                        }
                    } else if(type === 2) {
                        if(!checkPassPort(val)) {
                            this.$message({message:'买方代理人护照不正确',type:'warning'})
                            return false
                        }
                    }
                    if(!this.report.buyerAgentName) {
                        this.$message("买方代理人姓名不能为空")
                        return false
                    }
                } else {
                    this.$message("买方代理人证件号不能为空")
                    return false
                }
            }
            if(this.report.sellerAgentCardType) {
                if(this.report.sellerAgentCard) {
                    let type = this.report.sellerAgentCardType
                    let val = this.report.sellerAgentCard
                    if(type === 1) {
                        if(!checkIdCard(val)) {
                            this.$message({message:'卖方代理人身份证号不正确',type:'warning'})
                            return false
                        }
                    } else if(type === 2) {
                        if(!checkPassPort(val)) {
                            this.$message({message:'卖方代理人护照不正确',type:'warning'})
                            return false
                        }
                    }
                    if(!this.report.sellerAgentName) {
                        this.$message("卖方代理人姓名不能为空")
                        return false
                    }
                } else {
                    this.$message("卖方代理人证件号不能为空")
                    return false
                }
            }
            this.$ajax.postJSON('/api/contract/updateReport',{report:this.report, id:this.id}).then(res => {
                res = res.data
                if(res.status === 200) {
                    this.$message({
                        message: "保存成功",
                        type: "success"
                    })
                    this.transFlowEdit = true
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
            if(val==="landUseArea"){
                this.$nextTick(()=>{
                    this.report.landUseArea=this.$tool.cutFloat({val:this.report.landUseArea,max:999999999.99})
                })
            } else if(val==="payTaxation") {
                this.$nextTick(()=>{
                    this.report.payTaxation=this.$tool.cutFloat({val:this.report.payTaxation,max:999999999.99})
                })
            } else if(val==="evaluationValue") {
                this.$nextTick(()=>{
                    this.report.evaluationValue=this.$tool.cutFloat({val:this.report.evaluationValue,max:999999999.99})
                })
            } else if(val==="loanAmount") {
                this.$nextTick(()=>{
                    this.report.loanAmount=this.$tool.cutFloat({val:this.report.loanAmount,max:999999999.99})
                })
            } else if(val==="loanTerm") {
                this.$nextTick(()=>{
                    this.report.loanTerm=this.$tool.cutFloat({val:this.report.loanTerm,max:999999999.99})
                })
            }
        },
        inputOnly(val) {
            if(val === 'ownershipNumber') {
                this.$nextTick(()=>{
                    this.report.ownershipNumber = this.$tool.textInput(this.report.ownershipNumber,2)
                })
            } else if(val === 'buyerAgentName') {
                this.$nextTick(()=>{
                   this.report.buyerAgentName = this.$tool.textInput(this.report.buyerAgentName) 
                })
            } else if(val === 'sellerAgentName') {
                this.$nextTick(()=>{
                   this.report.sellerAgentName = this.$tool.textInput(this.report.sellerAgentName) 
                })
            } else if(val === 'guestShopOwnerName') {
                this.$nextTick(()=>{
                   this.report.guestShopOwnerName = this.$tool.textInput(this.report.guestShopOwnerName) 
                })
            } else if(val === 'guestStoreName') {
                this.$nextTick(()=>{
                   this.report.guestStoreName = this.$tool.textInput(this.report.guestStoreName) 
                })
            } else if(val === 'houseShopOwnerName') {
                this.$nextTick(()=>{
                   this.report.houseShopOwnerName = this.$tool.textInput(this.report.houseShopOwnerName) 
                })
            } else if(val === 'houseStoreName') {
                this.$nextTick(()=>{
                   this.report.houseStoreName = this.$tool.textInput(this.report.houseStoreName) 
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
                removeRedBorder('liangzheng')
            }
        },
        'report.mortgageSituation'(newVal,oldVal) {
            if(newVal) {
                removeRedBorder('diya')
            }
        },
        'report.isEarlyRepayment'(newVal,oldVal) {
            if(newVal==='0'||newVal==='1') {
                removeRedBorder('huankuan')
            }
        },
        'report.ownershipNumber'(newVal,oldVal) {
            if(newVal) {
                removeRedBorder('quanshu')
            }
        },
        'report.transFlowCode'(newVal,oldVal) {
            if(newVal) {
                removeRedBorder('liucheng')
            }
        },
        'report.isExtend'(newVal,oldVal) {
            if(newVal==='0'||newVal==='1') {
                removeRedBorder('xichan')
            }
        },
        'report.buyerPaymentMethod'(newVal,oldVal) {
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
            p {
                margin-right: 50px;
            }
            p:nth-child(odd) {
                span:first-child {
                    min-width: 42px;
                }
            }
        }
    }
    .text-long {
        min-width: 373px;
    }
    .number {
        .el-input {
            min-width: 292px;
        }
    }
    .square {
        min-width: 120px;
    }
    .mark::before {
        content: "*";
        color: red;
        position: relative;
        top: 10px;
    }
    .position {
        i {
            line-height: 32px;
        }
        &.shui-fei {
            margin-left: 6px!important;
        }
    }
    .gongyouren {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 10px;
        li {
            display: flex;
            width: 50%;
            &:first-child {
                display: none;
            }
        }
    }
    /*去掉谷歌，火狐下的type="number"中的右边箭头*/
    /deep/ input::-webkit-outer-spin-button, /deep/ input::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
    }
    /deep/ input[type="number"]{-moz-appearance:textfield;}
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
            > div {
                display: flex;
                margin: 0 22px 5px 0;
                > span {
                    min-width: 70px;
                    line-height: 32px;
                    text-align: right;
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
        min-width: 600px;
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
        }
    }
}
.house-from {
    .info {
        display: flex;
    }
    .el-input {
        width: 110px;
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
            margin-bottom: 10px;
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
        width: 253px!important;
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
    text-align: center;
}
.confirmBtn {
    width: 100px;
    height: 38px;
    border-radius: 18px;
    background-color: #478DE3;
    color: #fff;
}
</style>