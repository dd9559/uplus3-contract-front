<!-- 编辑意向金 -->
<template>
    <div class="editintention">
        <div class="formbox">
            <el-form :inline="true" :model="ruleForm" ref="ruleForm" :validate-on-rule-change="false" class="form-innnerbox">
                <div class="form-content">
                <!-- 合同信息 -->
                    <div class="column-form"> 
                        <div class="column-title">合同信息</div>
                        <div class="form-cont">
                            <el-form-item label="签约日期">
                                 <el-input v-model="detailData.signDate" placeholder="选择日期" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="合同类型">
                                <el-input placeholder="意向金" :disabled="true" v-if="this.$route.query.contType == 4"></el-input>
                                <el-input placeholder="定金"  :disabled="true" v-if="this.$route.query.contType == 5"></el-input>
                            </el-form-item>
                            
                            <el-form-item label="认购期限" prop="subscribdate">
                                <el-date-picker v-model="ruleForm.subscribdate" type="date" :placeholder="detailData.subscriptionTerm"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="认购总价" prop="subscribmoney">
                                <el-input v-model.number="ruleForm.subscribmoney" clearable :placeholder="detailData.subscriptionPrice">
                                    <i slot="suffix" class="yuan">元</i>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="意向金金额" prop="dealPrice" v-if="this.$route.query.contType == 4">
                                <el-input v-model.number="ruleForm.dealPrice" type="number" clearable :placeholder="detailData.dealPrice">
                                    <i slot="suffix" class="yuan">元</i>
                                    <template slot="append">{{finalMoney | moneyFormat}}</template>
                                </el-input>
                            </el-form-item>

                            <el-form-item label="定金金额" prop="dealPrice" v-if="this.$route.query.contType == 5">
                                <el-input v-model.number="ruleForm.dealPrice" type="number" clearable :placeholder="detailData.dealPrice">
                                    <i slot="suffix" class="yuan">元</i>
                                    <template slot="append">{{detailData.dealPrice | moneyFormat}}</template>
                                </el-input>
                            </el-form-item>
                        </div>
                    </div>

                    <!-- 房源信息 -->
                    <div class="column-form"> 
                        <div class="column-title">房源信息</div>
                        <div class="form-cont">
                            <div class="li">
                                <div class="div1"><span>房源编号：</span><em class="blue">{{detailData.houseinfoCode}}</em></div>
                                <div class="div2"><span>物业地址：</span>{{detailData.propertyAddr}}</div>
                            </div>
                            <el-form-item label="产证地址" class="disb">
                                <el-input v-model="ruleForm.propertyRightAddr" clearable class="big-input" :placeholder="detailData.houseInfo.propertyRightAddr"></el-input>
                            </el-form-item>

                            <el-form-item label="房源总价" class="disb">
                                <el-input v-model.number="ruleForm.price" :disabled="true" :placeholder="detailData.houseInfo.price">
                                    <i slot="suffix" class="yuan">元</i>
                                </el-input>
                            </el-form-item>

                            <el-form-item label="业主信息" class="disb" required>
                                <el-form-item prop="ownname">
                                    <el-input v-model="custInfo[0].name" clearable :disabled="true"  placeholder="姓名" class="ownwidth"></el-input>
                                </el-form-item>
                                <el-form-item prop="ownphone">
                                    <el-input v-model="custInfo[0].mobile" clearable :disabled="true"  placeholder="手机号" class="ownwidth"></el-input>
                                </el-form-item>
                            </el-form-item>
                        </div>
                    </div>

                    <!-- 客源信息 -->
                    <div class="column-form"> 
                        <div class="column-title">客源信息</div>
                        <div class="form-cont">
                            <el-form-item>
                                <div class="li li2">
                                    <div class="div1"><span>客源编号：</span><em class="blue">{{detailData.guestinfoCode}}</em></div>
                                </div>
                                <el-form-item label="成交经纪人" required>
                                    <el-form-item prop="item1">
                                        <el-select v-model="ruleForm.item1" clearable filterable :placeholder="detailData.dealAgentStoreName">
                                            <el-option v-for="item in option1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item prop="item2" class="small-input">
                                        <el-select v-model="ruleForm.item2" clearable filterable :placeholder="detailData.dealAgentName">
                                            <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form-item>
                            </el-form-item>
                            <el-form-item label="客户信息" class="disb" required>
                                <el-form-item prop="custname">
                                    <el-input v-model="ownerInfo[0].name" clearable :disabled="true" placeholder="姓名" class="ownwidth"></el-input>
                                </el-form-item>
                                <el-form-item prop="custphone">
                                    <el-input v-model="ownerInfo[0].mobile" clearable :disabled="true" placeholder="手机号" class="ownwidth"></el-input>
                                </el-form-item>
                                <el-form-item prop="custidcard">
                                    <el-input v-model="ownerInfo[0].identifyCode" clearable :disabled="true" placeholder="身份证号" class="custwidth"></el-input>
                                </el-form-item>
                            </el-form-item>
                        </div>
                        <div class="form-cont mt30" v-if="this.$route.query.contType == 4">
                            <el-form-item label="意向备注" class="disb">
                                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" :placeholder="detailData.remarks" v-model="ruleForm.textarea" class="textareawidth"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                </div>
                <div class="form-btn">
                    
                        <el-button type="primary" plain round>预 览</el-button>
                        <el-button type="primary" round @click="onSubmit">保 存</el-button>
                    
                </div>
            </el-form>


            
        </div>
       
            
    </div>
    
</template>

<script>
import { TOOL } from "@/assets/js/common";
export default {

    data() {
        return {
            ruleForm: {
                signdate: '', //签约日期
                contType: '', //合同类型
                item1: '',    //选择门店
                item2: '',  //选择成交人
                subscribdate: '', //认购期限
                subscribmoney: '', //认购总价
                dealPrice: '', //意向金金额
                houseno: '', //房源编号
                address1: '', //物业地址
                propertyRightAddr: '', //产权地址
                price: '', //房源总价
                ownname: '', //业主姓名
                ownphone: '', //业主手机号
                custno: '', //客源编号
                custname: '', //客户姓名
                custphone: '', //客户手机号
                custidcard: '', //客户身份证号
                textarea: '', //备注
            
            },
            detailData: {
                contType: {
                    label: '',
                    value: ''
                },
                houseInfo: {},
                guestInfo: {},
                contPersons: [
                    {   
                        name: '',
                        mobile: '',
                        identifyCode: '',
                        personType:{
                            label: '',
                            value: ''
                        }
                    }
                ],
                
            },
            ownerInfo:[
                {
                    name: '',
                    mobile: '',
                    identifyCode: '', 
                }
            ],
            custInfo: [
                {
                    name: '',
                    mobile: '',
                    identifyCode: '', 
                }
            ],

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
            // rules: {
                
            //     item1: [
            //         { required: true, message: '请选择门店', trigger: 'change' }
            //     ],
            //     item2: [
            //         { required: true, message: '请选择经纪人', trigger: 'change' }
            //     ],
            //     subscribdate: [
            //         { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
            //     ],
            //     subscribmoney: [
            //         { required: true, message: '请输入认购总价', trigger: 'change' },
            //         // { min: 0, max: 12, message: '输入总价在0-999999999.99之间', trigger: 'blur' }
            //     ],
            //     dealPrice: [
            //         { required: true, message: '请输入意向金金额', trigger: 'change' },
            //         // { min: 0, max: 12, message: '输入金额在0-999999999.99之间', trigger: 'blur' }
            //     ],
               
            //     // address1: [
            //     //     { required: true, message: '请输入物业地址', trigger: 'blur' },
            //     // ],
            //     // propertyRightAddr: [
            //     //     { required: true, message: '请输入产权地址', trigger: 'blur' },
            //     // ],
            //     ownname: [
            //         { required: true, message: '请输入业主姓名', trigger: 'change' },
            //     ],
            //     ownphone: [
            //         { required: true, message: '请输入业主手机号', trigger: 'change' },
            //     ],
            //     // custno: [
            //     //     { required: true, message: '请选择客源', trigger: 'click' },
            //     // ],
            //     custname: [
            //         { required: true, message: '请输入客户姓名', trigger: 'change' },
            //     ],
            //     custphone: [
            //         { required: true, message: '请输入客户手机号', trigger: 'change' },
            //     ],
            //     custidcard: [
            //         { required: true, message: '请输入客户身份证号', trigger: 'change' },
            //     ],
        
            // },
        }
    },

    computed: {
        finalMoney() {
           if( this.ruleForm.dealPrice && this.ruleForm.dealPrice !==0){
               return this.ruleForm.dealPrice
           }else{
               return this.detailData.dealPrice
           }
        }
    },

    methods: {

        // 查询
        getDetail() {
            let param = {
                id: this.$route.query.id                        
            }
            //调整佣金审核列表
            this.$ajax         
            .get("/api/contract/getById", param)
            .then(res => {
            
                let data = res.data;
                if (res.status === 200) {
                    this.detailData = data.data
                    var contperson = this.detailData.contPersons
                    if (contperson.length > 0) {
                        for (let i=0; i < contperson.length; i++){
                            if (contperson[i].personType.value == 1){
                                this.ownerInfo.unshift(contperson[i])
                            }else if(contperson[i].personType.value == 2){
                                this.custInfo.unshift(contperson[i])
                            }
                        }
                    }
                }
                
            }).catch(error => {
                console.log(error)
            })
        },

        onSubmit() {
             let param = { 
                 igdCont:{      
                        "id": this.$route.query.id,		//这是合同ID，在修改时才会用到，新增时使用不会报错
                        "type": this.$route.query.contType,       //合同类型 ZL("租赁", 1), MM("买卖", 2), DB("代办", 3), YX("意向", 4)
                        // "houseinfoCode":"UUS001",                //房源编号
                        // "guestinfoCode":"SQH001",                //客源编号
                        "signDate": this.detailData.signDate,                 //签约日期
                        "subscriptionTerm": this.detailData.subscriptionTerm,         //认购期限
                        "subscriptionPrice": this.detailData.subscriptionPrice,		         //成交总价
                        // "dealAgentStoreId":"10",                 //成交经纪人门店ID
                        // "dealAgentStoreName":"当代一店",          //成交经纪人门店名字
                        "dealPrice":this.detailData.dealPrice,			         //（意向/定金金额）
                        "remarks": this.detailData.textarea,                     //（意向备注）
                        "houseInfo":{
                            // "houseinfoId": "100",
                            // "estateName":"中天国际",                           
                            // "building":"楚河汉街万达环球国际中心",
                            // "unit":"三单元",
                            // "number": "804",
                            "propertyRightAddr": this.detailData.propertyRightAddr,
                            "price": this.detailData.price
                        },
                        "guestInfo":{
                            // "guestinfoId": "87",
                            "dealAgentId": 1,
                            "dealAgentName": "成交人姓名啊"
                        },
                        "contPersons": [
                            {
                                "name": this.ownerInfo.name,
                                "type": 1,
                                "mobile":this.ownerInfo.mobile,
                                // "identifyCode": "",
                                // "uId": 1,
                                // "relation": 1
                            },
                            {
                                "name": this.detailData.custInfo.name,
                                "type": 2,
                                "mobile": this.detailData.custInfo.mobile,
                                "identifyCode": this.detailData.custInfo.identifyCode,
                                // "uId": 1,
                                // "relation": 1
                            },
                        ]
                        
                    },
                    type:2
             }
            this.$ajax
            .postJSON("/api/contract/editIgdCont", param)
            .then(res => {
                console.log(res)
            }).catch(error => {
                console.log(error)
            })
        }
    },

    filters: {
        nullData(val) {
            return TOOL.nullFormat(val);
        },
        moneyFormat: function(val) {
            if (!val) {
                return "零";
            } else {
                return TOOL.toChineseNumber(val);
            }
        }
    },

    mounted() {
        
    },
    created() {
        this.getDetail()
    },
}
</script>

<style lang="less">

    .form-innnerbox{
        background-color: #fff; 
        border-radius: 5px;
        overflow-y: auto;
        position: relative;
        .fr{
            float: right;
        }
        .mr20{
            margin-right: 20px;
        }
        .el-input-group__append{
            background-color: transparent;
            border: none;
            color: #FF9039
        }
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
                .li{
                    display: flex;
                    margin-bottom: 22px;
                    div{
                        float: left;
                        font-size: 14px;
                        span{
                            color: #606266;                
                        }
                        em.blue{
                                color: #478DE3;
                                font-weight: 700;                
                        }
                    }
                    .div1{
                        margin-right: 70px;
                    }
                }
                .li2{
                    float: left;
                    margin-bottom: 0;
                    .div1{
                        margin-right: 40px;
                    }
                }
                
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
</style>


