<!-- 新增意向金 -->
<template>
    <div class="newintention" id="newIntention">
        <div class="formbox">
            <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" class="form-innnerbox">
                <div class="form-content">
                <!-- 合同信息 -->
                    <div class="column-form"> 
                        <div class="column-title">合同信息</div>
                        <div class="form-cont">
                            <el-form-item label="签约日期" prop="signDate">
                                <el-date-picker v-model="ruleForm.signDate" type="date" placeholder="选择日期"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="合同类型">
                                <el-input placeholder="意向金" :disabled="true" v-if="this.$route.query.contType == 4"></el-input>
                                <el-input placeholder="定金"  :disabled="true" v-if="this.$route.query.contType == 5"></el-input>
                            </el-form-item>
                            
                            <el-form-item label="认购期限" prop="subscriptionTerm">
                                <el-date-picker v-model="ruleForm.subscriptionTerm" type="date" placeholder="选择日期"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="认购总价" prop="subscriptionPrice">
                                <el-input v-model.number="ruleForm.subscriptionPrice" type="number" clearable>
                                    <i slot="suffix" class="yuan">元</i>
                                </el-input>
                            </el-form-item>
                            
                            <el-form-item label="意向金金额" prop="dealPrice" v-if="this.$route.query.contType == 4">
                                <el-input v-model.number="ruleForm.dealPrice" type="number" clearable>
                                    <i slot="suffix" class="yuan">元</i>
                                    <template slot="append">{{ruleForm.dealPrice | moneyFormat}}</template>
                                </el-input>
                            </el-form-item>

                            <el-form-item label="定金金额" prop="dealPrice" v-if="this.$route.query.contType == 5">
                                <el-input v-model.number="ruleForm.dealPrice" type="number" clearable>
                                    <i slot="suffix" class="yuan">元</i>
                                    <template slot="append">{{ruleForm.dealPrice | moneyFormat}}</template>
                                </el-input>
                            </el-form-item>
                        </div>
                    </div>

                    <!-- 房源信息 -->
                    <div class="column-form"> 
                        <div class="column-title">房源信息</div>
                        <div class="form-cont">
                            <el-form-item>
                                <el-form-item label="房源编号" prop="houseno">
                                    <el-button type="primary" v-model="ruleForm.houseno" @click="toLayerHouse()">请选择房源</el-button>
                                </el-form-item>
                                <el-form-item label="物业地址">
                                    <div>当代国际花园元帅哈萨克卡覅</div>
                                </el-form-item>
                            </el-form-item>
                            
                            <el-form-item label="产证地址" class="disb">
                                <el-input v-model="ruleForm.propertyRightAddr" clearable class="big-input"></el-input>
                            </el-form-item>

                            <el-form-item label="房源总价" class="disb">
                                <el-input v-model.number="ruleForm.price" clearable>
                                    <i slot="suffix" class="yuan">元</i>
                                </el-input>
                            </el-form-item>

                            <el-form-item label="业主信息" class="disb">
                                <el-form-item prop="ownerInfo.ownname">
                                    <el-input v-model="ruleForm.ownerInfo.ownname" clearable placeholder="姓名" class="ownwidth"></el-input>
                                </el-form-item>
                                <el-form-item prop="ownerInfo.ownphone">
                                    <el-input v-model="ruleForm.ownerInfo.ownphone" clearable placeholder="手机号" class="ownwidth"></el-input>
                                </el-form-item>
                            </el-form-item>
                        </div>
                    </div>

                    <!-- 客源信息 -->
                    <div class="column-form"> 
                        <div class="column-title">客源信息</div>
                        <div class="form-cont">
                            <el-form-item>
                                <el-form-item label="客源编号"  prop="custno">
                                        <el-button type="primary"  v-model="ruleForm.custno" @click="toLayerGuest()">请选择客源</el-button>
                                </el-form-item>
                                <el-form-item label="成交经纪人">
                                    <el-form-item prop="item1">
                                        <el-select v-model="ruleForm.item1" clearable filterable placeholder="请选择门店">
                                            <el-option v-for="item in option1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item prop="item2" class="small-input">
                                        <el-select v-model="ruleForm.item2" clearable filterable placeholder="请选择经纪人">
                                            <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form-item>
                            </el-form-item>
                            <el-form-item label="客户信息" class="disb">
                                <el-form-item prop="custInfo.custname">
                                    <el-input v-model="ruleForm.custInfo.custname" clearable placeholder="姓名" class="ownwidth"></el-input>
                                </el-form-item>
                                <el-form-item prop="custInfo.custphone">
                                    <el-input v-model="ruleForm.custInfo.custphone" clearable placeholder="手机号" class="ownwidth"></el-input>
                                </el-form-item>
                                <el-form-item prop="custInfo.custidcard">
                                    <el-input v-model="ruleForm.custInfo.custidcard" clearable placeholder="身份证号" class="custwidth"></el-input>
                                </el-form-item>
                            </el-form-item>
                        </div>
                        <div class="form-cont mt30" v-if="this.$route.query.contType == 4">
                            <el-form-item label="意向备注" class="disb">
                                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" placeholder="请输入内容" v-model="ruleForm.textarea" class="textareawidth"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                </div>
                <div class="form-btn">                   
                        <el-button type="primary" plain round @click="onPreview()">预 览</el-button>
                        <el-button type="primary" round @click="onSubmit('ruleForm')">保 存</el-button>                  
                </div>
            </el-form>


            
        </div>
        <!-- 房客源弹框 -->
        <houseGuest :dialogVisible="layerhouse" :dialogType="dialogType"  @closeHouseGuest="closeCommission" v-if='layerhouse'></houseGuest>
          
    </div>
    
</template>

<script>
import houseGuest from '../contractDialog/houseGuest';
import { TOOL } from "@/assets/js/common";
export default {
    data() {
        return {
            layerhouse:false,
            dialogType: '',
            ruleForm: {
                signDate: '', //签约日期
                contType: '', //合同类型
                item1: '',    //选择门店
                item2: '',  //选择成交人
                subscriptionTerm: '', //认购期限
                subscriptionPrice: '', //认购总价
                dealPrice: '', //意向金金额
                
                houseno: '', //房源编号
                address1: '', //物业地址
                propertyRightAddr: '', //产权地址
                price: '', //房源总价
                ownerInfo: {
                    ownname: '', //业主姓名
                    ownphone: '', //业主手机号
                },
                custInfo: {
                    custname: '', //客户姓名
                    custphone: '', //客户手机号
                    custidcard: '', //客户身份证号
                },             
                custno: '', //客源编号              
                textarea: '', //备注
            
            },
            // 选择门店
            option1: [{
                value: '选项1',
                label: '黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            }],
            // 选择经纪人
            option2: [{
                value: '选项1',
                label: '黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            }, {
                value: '选项3',
                label: '蚵仔煎'
            }],
            // 表单校验规则
            rules: {
                signDate: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                
                subscriptionTerm: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                subscriptionPrice: [
                    { required: true, message: '请输入认购总价' },
                    // { min: 0, max: 12, message: '输入总价在0-999999999.99之间', trigger: 'blur' }
                ],
                dealPrice: [
                    { required: true, message: '请输入意向金金额' },
                    // { min: 0, max: 12, message: '输入金额在0-999999999.99之间', trigger: 'blur' }
                ],
                // houseno: [
                //     { required: true, message: '请选择房源', trigger: 'click' },
                // ],
                // address1: [
                //     { required: true, message: '请输入物业地址', trigger: 'blur' },
                // ],
                // propertyRightAddr: [
                //     { required: true, message: '请输入产权地址', trigger: 'blur' },
                // ],
                ownerInfo: {
                    ownname: [
                        { required: true, message: '请输入业主姓名' },
                    ],
                    ownphone: [
                        { required: true, message: '请输入业主手机号'},
                    ],
                },
                custInfo: {
                    custname: [
                        { required: true, message: '请输入客户姓名' },
                    ],
                    custphone: [
                        { required: true, message: '请输入客户手机号' },
                    ],
                    custidcard: [
                        { required: true, message: '请输入客户身份证号' },
                    ],
                },
                
                custno: [
                    { required: true, message: '请选择客源', trigger: 'click' },
                ],
                item1: [
                    { required: true, message: '请选择门店', trigger: 'change' }
                ],
                item2: [
                    { required: true, message: '请选择经纪人', trigger: 'change' }
                ],
                
        
            },
        }
    },

    components: {
        houseGuest
    },
   
    computed: {
        
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

    methods: {
        //选择房源弹框
        toLayerHouse(){
            this.layerhouse = true
            this.dialogType = "house"
        },

        toLayerGuest(){
            this.layerhouse = true
            this.dialogType = "guest"
        },

         //关闭选择房源客源弹窗
        closeCommission(){
             this.layerhouse = false;
        },

        //预览事件
        onPreview() {
            this.$router.push({
                path:'/contractPreview',
                query:{
                    // contractCode: value.contractCode
                }
            })
        },
        
       
        // 新增意向金接口（post）
        onSubmit(ruleForm) {
            this.$refs[ruleForm].validate((valid) => {
                if (valid) {
                    let param = { 
                        igdCont:{      
                            // "id": 23,		//这是合同ID，在修改时才会用到，新增时使用不会报错
                            "type":this.$route.query.contType,       //合同类型 ZL("租赁", 1), MM("买卖", 2), DB("代办", 3), YX("意向", 4)
                            // "houseinfoCode":"UUS001",                //房源编号
                            // "guestinfoCode":"SQH001",                //客源编号
                            "signDate": this.ruleForm.signDate,                 //签约日期
                            "subscriptionTerm": this.ruleForm.subscriptionTerm,         //认购期限
                            "subscriptionPrice": this.ruleForm.subscriptionPrice,		         //成交总价
                            // "dealAgentStoreId":"10",                 //成交经纪人门店ID
                            // "dealAgentStoreName":"当代一店",          //成交经纪人门店名字
                            "dealPrice":this.ruleForm.dealPrice,			         //（意向/定金金额）
                            "remarks": this.ruleForm.textarea,                     //（意向备注）
                            "houseInfo":{
                                // "houseinfoId": "100",
                                // "estateName":"中天国际",                           
                                // "building":"楚河汉街万达环球国际中心",
                                // "unit":"三单元",
                                // "number": "804",
                                "propertyRightAddr": this.ruleForm.propertyRightAddr,
                                "price": this.ruleForm.price
                            },
                            "guestInfo":{
                                // "guestinfoId": "87",
                                "dealAgentId": 1,
                                "dealAgentName": "成交人姓名啊"
                            },
                            "contPersons": [
                                {
                                    "name": this.ruleForm.ownerInfo.name,
                                    "type": 1,
                                    "mobile":this.ruleForm.ownerInfo.mobile,
                                    // "custidcard": "",
                                    // "uId": 1,
                                    // "relation": 1
                                },
                                {
                                    "name": this.ruleForm.custInfo.name,
                                    "type": 2,
                                    "mobile": this.ruleForm.custInfo.mobile,
                                    "custidcard": this.ruleForm.custInfo.custidcard,
                                    // "uId": 1,
                                    // "relation": 1
                                },
                            ]
                            
                        },
                        type:1
                    }
                    this.$confirm('确定保存已创建合同?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info',
                        roundButton: true

                    }).then(() => {
                        this.$ajax
                        .postJSON("/api/contract/editIgdCont", param)
                        .then(res => {
                            console.log(res.status)
                            if (res.status === 500) {
                                this.$message({
                                    type: 'success',
                                    message: '已保存!'
                                });
                            }
                        }).catch(error => {
                            console.log(error)
                        })
                    
                    }).catch(() => {

                    })
                }else{
                    return false
                }
            })
            
            
            
        },
    },
    mounted() {
        
    },
}
</script>

<style lang="less">
    
.el-message-box{
    .el-message-box__headerbtn{
        top: 12px;
        .el-message-box__close{
            font-size: 22px;
        }
    }
    .el-message-box__header{
        border-bottom: 1px solid #EDECF0;
    }
    .el-message-box__status.el-icon-info{
        color: transparent;
    }
    .el-message-box__status+.el-message-box__message{
        padding: 50px 0 40px;
        text-align: center;
        p{
            color: #233241;
            font-size: 16px;
        }
    }
    .el-message-box__btns{
        text-align: center;
        padding-bottom: 20px;
        button{
            width: 100px;
            height: 38px;
            font-size: 16px;
            line-height: 38px;
            padding: 0;
            &:nth-child(2){
                margin-left: 24px;
            }
        }
    }

}
#newIntention{
    .el-input-group__append{
        background-color: transparent;
        border: none;
        color: #FF9039
    }
    .fr{
        float: right;
    }
    .mr20{
        margin-right: 20px;
    }

    .form-innnerbox{
        background-color: #fff; 
        border-radius: 5px;
        overflow-y: auto;
        position: relative;
        .el-date-editor.el-input, .el-date-editor.el-input__inner{
            width: 200px;
        }
        .el-input--suffix .el-input__inner{
            padding-right: 15px;
        }
        .form-content{
            padding: 30px 30px 40px 30px;
        }
        .column-form{
            margin-bottom: 30px;
            .column-title{
                font-size:16px;
                color: #233241;
                margin-bottom: 30px;
                font-weight: bold;
            }
            .form-cont{
                border-bottom: 1px solid #EDECF0;
                padding-bottom: 10px;
                .small-input{
                    width: 140px;
                }
                .big-input{
                    width: 500px;
                }
                .yuan{
                    line-height: 40px;
                    padding-right: 12px;
                }
                .disb{
                    display: block;
                }  
                .ownwidth{
                    width: 140px;
                } 
                .custwidth{
                    width: 190px;
                } 
                .textareawidth{
                    width: 650px;
                    height: 120px;
                } 
            }
            .mt30{
                margin-top: 30px;
            }
            .pb30{
                padding-bottom: 30px;
            }
        }
        .form-btn{
            overflow: hidden;
            position: fixed;
            bottom: 50px;
            right: 60px;
            background-color: #fff;
        }
        
        
    }
}
        
    
    
</style>


