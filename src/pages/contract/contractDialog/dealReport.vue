<template>
    <div class="container">
        <div class="cont-info border-b">
            <p class="bold">合同基本信息</p>
            <div class="cont-content text">
                <p>签约日期：<span>{{dealBasicInfo.signDate}}</span></p>
                <p>合同编号：<span style="color:#478DE3;font-weight:bold">{{dealBasicInfo.code}}</span></p>
                <p>交易类型：<span>{{dealBasicInfo.contType}}</span></p>
                <p>房屋总价：<span style="color:#FF9039;">{{dealBasicInfo.dealPrice}}元 <i>{{dealBasicInfo.dealPrice|moneyFormat}}</i></span></p>
                <p>应收佣金：<span>{{dealBasicInfo.commissionPayment}}元</span></p>
            </div>
        </div>
        <div class="house-info border-b">
            <p class="bold">房屋基本信息</p>
            <div class="house-content">
                <div class="item">
                    <div class="mark">
                        <span>两证情况：</span>
                        <el-select size="small" v-model="report.cardSituation">
                            <el-option v-for="item in dictionary['611']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </div>
                    <div class="mark">
                        <span>抵押情况：</span>
                        <el-select size="small" v-model="report.mortgageSituation">
                            <el-option v-for="item in dictionary['615']" :key="item.key" :label="item.value" :value="item.key"></el-option>                            
                        </el-select>
                    </div>
                    <div class="mark">
                        <span>提前还款：</span>
                        <el-select size="small" v-model="report.isEarlyRepayment">
                            <el-option label="否" value="0"></el-option>
                            <el-option label="是" value="1"></el-option>
                        </el-select>
                    </div>
                    <div class="square mark">
                        <span class="text">建筑面积：<span>{{dealBasicInfo.Square}}㎡</span></span>
                    </div>
                    <div class="position">
                        <span class="use">土地使用权面积：</span>
                        <el-input size="small" v-model="report.landUseArea"></el-input>
                        <i>㎡</i>
                    </div>
                    <div>
                        <span>土地性质：</span>
                        <el-select size="small" v-model="report.landNature">
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
                        <el-input size="small" v-model="report.ownershipNumber"></el-input>
                    </div>
                </div>
                <div class="item">
                    <div class="position">
                        <span>缴纳税费：</span>
                        <el-input size="small" v-model="report.payTaxation"></el-input>
                        <i>万元</i>
                    </div>
                    <div style="min-width:120px;">
                        <span class="floor">房屋总楼层：<span>{{dealBasicInfo.FloorAll}}层</span></span>
                    </div>
                    <div>
                        <span>建筑结构：</span>
                        <el-input size="small" v-model="report.buildingStructure"></el-input>
                    </div>
                    <div class="position">
                        <span>评估值：</span>
                        <el-input size="small" v-model="report.evaluationValue"></el-input>
                        <i>万元</i>
                    </div>
                </div>
            </div>
        </div>
        <div class="house-from resource resource-info">
            <div>
                <p class="bold">客源方信息</p>
                <div class="info text">
                    <p>店长：<span>{{dealBasicInfo.guestOwnerName}}</span></p>
                    <p>门店：<span>{{dealBasicInfo.guestStoreName}}</span></p>
                    <p>联系电话：<span>{{dealBasicInfo.guestOwnerMobile}}</span></p>
                </div>
            </div>
            <div>
                <p class="bold">房源方信息</p>
                <div class="info text">
                    <p>店长：<span>{{dealBasicInfo.houseOwnerName}}</span></p>
                    <p>门店：<span>{{dealBasicInfo.houseStoreName}}</span></p>
                    <p>联系电话：<span>{{dealBasicInfo.houseOwnerMobile}}</span></p>
                </div>
            </div>
        </div>
        <div class="house-person resource resource-info">
            <div>
                <p class="bold">买方信息</p>
                <div class="guest msg info">
                    <div class="text">
                        <p>姓名：<span></span></p>
                        <p>身份证：<span></span></p>
                        <p>电话：<span></span></p>
                    </div>
                    <div class="text">
                        <p>共有人姓名：<span></span></p>
                        <p>电话：<span></span></p>
                    </div>
                    <div class="input">
                        <p>
                            <span>付款方式：</span>
                            <el-select size="small" v-model="report.buyerPaymentMethod">
                                <el-option v-for="item in dictionary['621']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </p>
                        <p>
                            <span>交易流程：</span>
                            <el-select size="small" v-model="report.transFlowCode">
                                <el-option v-for="item in flowList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </p>
                        <p>
                            <span>按揭银行：</span>
                            <el-select size="small" v-model="report.stagesBankName" filterable>
                                <el-option v-for="item in bankList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                            </el-select>
                        </p>
                    </div>
                    <div class="input">
                        <p>
                            <span>贷款金额：</span>
                            <el-input size="small" v-model="report.loanAmount"></el-input>
                            <span>万</span>
                        </p>
                        <p>
                            <span>贷款期限：</span>
                            <el-input size="small" v-model="report.loanTerm"></el-input>
                            <span>年</span>
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <p class="bold">卖方信息</p>
                <div class="owner msg info">
                    <div class="text">
                        <p>姓名：<span></span></p>
                        <p>身份证：<span></span></p>
                        <p>电话：<span></span></p>
                    </div>
                    <div class="text">
                        <p>共有人姓名：<span></span></p>
                        <p>电话：<span></span></p>
                    </div>
                    <div class="input">
                        <p class="mark" style="margin-right:10px;">
                            <span>是否析产（继承）：</span>
                            <el-select size="small" v-model="report.isExtend">
                                <el-option label="否" value="0"></el-option>
                                <el-option label="是" value="1"></el-option>
                            </el-select>
                        </p>
                        <p>
                            <span>婚姻状况：</span>
                            <el-select size="small" v-model="report.maritalStatus">
                                <el-option v-for="item in dictionary['624']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="agent resource">
            <div>
                <p class="bold">代理人信息</p>
                <div class="agent-info info">
                    <p>
                        <span>代理人姓名：</span>
                        <el-input size="small" class="w100" v-model="report.buyerAgentName"></el-input>
                        <el-select size="small" class="w100" v-model="report.buyerAgentCardType">
                            <el-option v-for="item in dictionary['630']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                        <el-input size="small" class="w200" v-model="report.buyerAgentCard"></el-input>
                    </p>
                    <p>
                        <span>电话：</span>
                        <el-input size="small" class="w200" v-model="report.buyerAgentMobile"></el-input>
                    </p>
                </div>
            </div>
            <div>
                <p class="bold">代理人信息</p>
                <div class="agent-info info">
                    <p>
                        <span>代理人姓名：</span>
                        <el-input size="small" class="w100" v-model="report.sellerAgentName"></el-input>
                        <el-select size="small" class="w100" v-model="report.sellerAgentCardType">
                            <el-option v-for="item in dictionary['630']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                        <el-input size="small" class="w200" v-model="report.sellerAgentCard"></el-input>
                    </p>
                    <p>
                        <span>电话：</span>
                        <el-input size="small" class="w200" v-model="report.sellerAgentMobile"></el-input>
                    </p>
                </div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button class="confirmBtn" @click="saveFn">保存</el-button>
            <el-button class="cancelBtn" @click="cancelFn">取消</el-button>
        </div>
    </div>
</template>

<script>
import { MIXINS } from "@/assets/js/mixins";
import { TOOL } from "@/assets/js/common";

export default {
    mixins: [MIXINS],
    props: {
        id: Number,
        contType: String
    },
    data() {
        return {
            // 带出不可编辑字段
            dealBasicInfo: {
                signDate: "",
                code: "",
                contType: "",
                dealPrice: "",
                commissionPayment: "",
                Square: "",
                propertyAddr: "",
                FloorAll: "",
                guestOwnerName: "",
                guestStoreName: "",
                guestOwnerMobile: "",
                houseOwnerName: "",
                houseStoreName: "",
                houseOwnerMobile: ""
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
                sellerAgentMobile: ""
            },
            tempReport: {},
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
            ]
        }
    },
    created() {
        if(this.contType === '2' || this.contType === 3) {
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
                    this.dealBasicInfo.commissionPayment = res.data.commissionPayment
                    this.dealBasicInfo.Square = res.data.houseInfo.Square
                    this.dealBasicInfo.propertyAddr = res.data.propertyAddr
                    this.dealBasicInfo.FloorAll = res.data.houseInfo.FloorAll
                    this.report = res.data.dealReport ? JSON.parse(res.data.dealReport) : this.report
                    this.tempReport = {...this.report}
                    this.dealBasicInfo.guestOwnerName = res.data.guestInfo.ShopOwnerName
                    this.dealBasicInfo.guestStoreName = res.data.guestInfo.GuestStoreName
                    this.dealBasicInfo.guestOwnerMobile = res.data.guestInfo.ShopOwnerMobile
                    this.dealBasicInfo.houseOwnerName = res.data.houseInfo.ShopOwnerName
                    this.dealBasicInfo.houseStoreName = res.data.houseInfo.HouseStoreName
                    this.dealBasicInfo.houseOwnerMobile = res.data.houseInfo.ShopOwnerMobile
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
        saveFn() {
            this.$ajax.postJSON('/api/contract/updateReport',{report:this.report, id:this.id}).then(res => {
                res = res.data
                if(res.status === 200) {
                    this.$message({
                        message: "保存成功",
                        type: "success"
                    })
                }
            }).catch(error => {
                this.$message({
                    message: error,
                    type: "error"
                })
            })
        },
        cancelFn() {
            this.report = {...this.tempReport}
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
    }
    .text-long {
        min-width: 410px;
    }
    .number {
        .el-input {
            min-width: 330px;
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
            min-width: 28px;
            line-height: 32px;
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
            margin-right: 70px;
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
                margin: 0 20px 5px 0;
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
                    max-width: 120px;
                }
                .el-input {
                    max-width: 120px;
                }
            }
        }
    }
}

.resource {
    display: flex;
    > div {
        min-width: 35%;
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
        }
    }
    &-info {
        p {
            min-width: 33.33%;
        }
    }
}
.house-from {
    .info {
        display: flex;
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
    .guest {
        .input {
            span {
                min-width: 70px;
            }
        }
    }
    .msg {
        .input {
            span {
                line-height: 32px;
            }
            .el-select {
                max-width: 120px;
            }
            .el-input {
                max-width: 120px;
            }
        }
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
            width: 200px;
        }
    }
}

.dialog-footer {
    width: 70%;
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
.cancelBtn {
    background-color: #fff;
    width: 100px;
    height: 38px;
    border-radius: 18px;
    border-color: #478DE3;
    color: #478DE3;
}
</style>