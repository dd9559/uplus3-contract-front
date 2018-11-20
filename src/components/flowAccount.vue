<template>
<div id="flowaccount">
    <!-- <el-button type="text" @click="dialogTableVisible = true">流水明细弹出层</el-button> -->
    <!-- 弹框明细 -->
    <el-dialog title="流水明细" :visible="getDialogTableVisible" @close='close'>
        <el-tabs v-model="activeName">
            <!-- 分类账 -->
            <el-tab-pane label="分类账" name="first">
                <el-table :data="gridData1" :span-method="objectSpanMethod" border>
                    <el-table-column prop="moneyClass" label="款类"></el-table-column>
                    <el-table-column prop="collectMoney" label="收款（元）"> </el-table-column>
                    <el-table-column prop="payMoney" label="付款（元）"></el-table-column>
                    <el-table-column prop="totalMoney" label="金额（元）"></el-table-column>
                </el-table>
            </el-tab-pane>
            <!-- 业主分类账 -->
            <el-tab-pane label="业主分类账" name="second">
                <el-table :data="gridData2" :span-method="objectSpanMethod" border>
                    <el-table-column prop="moneyClass" label="款类"></el-table-column>
                    <el-table-column prop="collectMoney" label="收款（元）"> </el-table-column>
                    <el-table-column prop="payMoney" label="付款（元）"></el-table-column>
                    <el-table-column prop="totalMoney" label="金额（元）"></el-table-column>
                </el-table>
            </el-tab-pane>
            <!-- 客户分类账 -->
            <el-tab-pane label="客户分类账" name="third">
                <el-table :data="gridData1" :span-method="objectSpanMethod" border>
                    <el-table-column prop="moneyClass" label="款类"></el-table-column>
                    <el-table-column prop="collectMoney" label="收款（元）"> </el-table-column>
                    <el-table-column prop="payMoney" label="付款（元）"></el-table-column>
                    <el-table-column prop="totalMoney" label="金额（元）"></el-table-column>
                </el-table>
                
            </el-tab-pane>
            <!-- 分类流水账 -->
            <el-tab-pane label="分类流水账" name="fourth">
                <el-table :data="gridData4" :span-method="objectSpanMethod" border>
                    <el-table-column prop="moneyClass" label="款类"></el-table-column>
                    <el-table-column prop="billNo" label="收付款编号"> </el-table-column>
                    <el-table-column prop="categoryType" label="类型"></el-table-column>
                    <el-table-column prop="businessTime" label="业务日期"></el-table-column>
                    <el-table-column prop="businessObj" label="业务对象"></el-table-column>
                    <el-table-column prop="collectMoney" label="收款（元）"> </el-table-column>
                    <el-table-column prop="payMoney" label="付款（元）"></el-table-column>
                    <el-table-column prop="totalMoney" label="金额（元）"></el-table-column>
                    <el-table-column prop="checkStatus" label="审核状态"></el-table-column>
                </el-table>
            </el-tab-pane>
            <!-- 流水账 -->
            <el-tab-pane label="流水账" name="fifth">
                <el-table :data="gridData5" border>
                    <el-table-column prop="entryName" label="录入人"></el-table-column>
                    <el-table-column prop="entryDep" label="录入门店"> </el-table-column>
                    <el-table-column prop="entryTime" label="录入日期"></el-table-column>
                    <el-table-column prop="flowType" label="类型"></el-table-column>
                    <el-table-column prop="flowBusiness" label="业务对象"></el-table-column>
                    <el-table-column prop="moneyClass" label="款类"></el-table-column>
                    <el-table-column prop="flowAmount" label="金额（元）"> </el-table-column>
                    <el-table-column prop="billStatus" label="票据状态"></el-table-column>
                    <el-table-column prop="payStatus" label="状态"></el-table-column>
                </el-table>
            </el-tab-pane>
            <!-- 票据 -->
            <el-tab-pane label="票据" name="sixth">
                <el-table :data="gridData6" border>
                    <el-table-column prop="moneyClass" label="款类"></el-table-column>
                    <el-table-column prop="billTime" label="开票时间"> </el-table-column>
                    <el-table-column prop="billAmount" label="开票金额（元）"></el-table-column>
                    <el-table-column prop="billNo" label="票据号"></el-table-column>
                    <el-table-column prop="billState" label="票据状态"></el-table-column>
                    <el-table-column prop="billPerson" label="开票人"></el-table-column>           
                </el-table>
            </el-tab-pane>
            <!-- 应实对照 -->
            <el-tab-pane label="应实对照" name="seventh">
                <el-table :data="gridData7" border>
                    <el-table-column prop="moneyClass" label="款类"></el-table-column>
                    <el-table-column prop="realReceive" label="实收"> </el-table-column>
                    <el-table-column prop="realPay" label="实付"></el-table-column>
                    <el-table-column prop="shouldReceive" label="应收"></el-table-column>
                    <el-table-column prop="shouldPay" label="应付"></el-table-column>
                    <el-table-column prop="surPlus" label="结余"></el-table-column>
                    <el-table-column prop="receiveNote" label="备注"></el-table-column>           
                </el-table>
            </el-tab-pane>
            <!-- 佣金明细 -->
            <el-tab-pane label="佣金明细" name="eighth">
                <el-table :data="gridData8" border>
                    <el-table-column prop="moneyClass" label="款类"></el-table-column>
                    <el-table-column prop="divideAmount" label="分佣金额（元）"> </el-table-column>
                    <el-table-column prop="divideTime" label="分佣时间"></el-table-column>
                    <el-table-column prop="divideName" label="被拆名称"></el-table-column>
                    <el-table-column prop="originalAmount" label="原始金额"></el-table-column>          
                </el-table>
            </el-tab-pane>
        </el-tabs>
    
        
    </el-dialog>
</div>
</template>

<script>
    export default {
         props: {
            dialogTableVisible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                activeName: 'first',
                //dialogTableVisible: false,
                gridData1: [
                    {
                        moneyClass: '佣金',
                        collectMoney: '666',
                        payMoney: '0',
                        totalMoney: '666'
                    }, {
                        moneyClass: '佣金',
                        collectMoney: '666',
                        payMoney: '0',
                        totalMoney: '666'
                    }, {
                        moneyClass: '佣金',
                        collectMoney: '666',
                        payMoney: '0',
                        totalMoney: '666'
                    }, 
                    {
                        moneyClass: '代收代付',
                        collectMoney: '666',
                        payMoney: '0',
                        totalMoney: '665'
                    },
                    {
                        moneyClass: '代收代付',
                        collectMoney: '666',
                        payMoney: '0',
                        totalMoney: '666'
                    },
                    
                ],
                gridData2: [
                    {
                        moneyClass: '佣金',
                        collectMoney: '666',
                        payMoney: '0',
                        totalMoney: '666'
                    }, {
                        moneyClass: '佣金',
                        collectMoney: '666',
                        payMoney: '0',
                        totalMoney: '666'
                    }, {
                        moneyClass: '佣金',
                        collectMoney: '666',
                        payMoney: '0',
                        totalMoney: '666'
                    },                   
                ],
                gridData4: [
                    {
                        moneyClass: '',  //款类
                        billNo: '',   //收付款编号
                        categoryType: '',  //类型
                        businessTime: '',   //业务日期
                        businessObj: '',  //业务对象
                        collectMoney: '',     //收款（元）
                        payMoney: '',    //付款（元）
                        totalMoney: '',     //金额（元）
                        checkStatus: ''       //审核状态

                    }
                ],
                gridData5: [
                    {
                        entryName: '',  //录入人
                        entryDep: '',   //录入门店
                        entryTime: '',  //录入日期
                        flowType: '',   //类型
                        flowBusiness: '',  //业务对象
                        moneyType: '',     //款类
                        flowAmount: '',    //金额（元）
                        billStatus: '',     //票据状态
                        payStatus: ''       //状态

                    }
                ],
                gridData6: [
                    {
                        billType: '',  //款类
                        billTime: '',   //开票时间
                        billAmount: '',  //开票金额（元）
                        billNo: '',   //票据号
                        billState: '',  //票据状态
                        billPerson: ''    //开票人

                    }
                ],
                gridData7: [
                    {
                        moneyClass: '',  //款类
                        realReceive: '',   //实收
                        realPay: '',  //实付
                        shouldReceive: '',   //应收
                        shouldPay: '',  //应付
                        surPlus: '',    //结余
                        receiveNote: '',    //备注

                    }
                ],
                gridData8: [
                    {
                        moneyClass: '',  //款类
                        divideAmount: '',   //分佣金额（元）
                        divideTime: '',  //分佣时间
                        divideName: '',   //被拆名称
                        originalAmount: ''  //原始金额

                    }
                ]           
            }
        },
        
        methods: {
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    if (rowIndex % 3 === 0) {
                        return {
                            rowspan: 3,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
            },
            close(){
                //this.dialogTableVisible=false
                this.$emit('closeRunningWater')
            }

        },
        computed: {
            getDialogTableVisible: function () {
                return this.dialogTableVisible
            }
        },
    }
</script>

<style lang="less">
    #flowaccount{
        .el-dialog{
            width: 760px;
            min-height: 600px;
        }
        .el-dialog__body{
            padding: 10px 20px 30px;
            color: #233241;
        }
        .el-tabs__nav-wrap::after{
            background-color: transparent;
        }
        .el-dialog__header{
            border-bottom: 1px solid #EDECF0;
            padding: 16px 20px 15px;
            span{
                color: #233241;
                font-size: 20px;
                
                
            }
            .el-dialog__headerbtn{
                top: 16px;
                .el-dialog__close{
                    font-size: 24px;
                    color: #32485F;
                }
            } 
        }
        .el-table .cell{
            text-align: center;
        }
        .el-table th{
            background-color: #EEF2FB;
        }
        .el-table th div{
            color: #6C7986;
        }
    }
</style>