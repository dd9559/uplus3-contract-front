<!-- 新增意向金 -->
<template>
    <div class="newintention">
        <div class="formbox" ref="ruleForm">
            <el-form :inline="true" :model="form" :rules="rules" class="form-innnerbox">
                <div class="form-content">
                <!-- 合同信息 -->
                    <div class="column-form"> 
                        <div class="column-title">合同信息</div>
                        <div class="form-cont">
                            <el-form-item label="签约日期" prop="signdate">
                                <el-date-picker v-model="form.signdate" type="date" placeholder="选择日期"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="合同类型">
                                <el-input v-model="form.contractType" :disabled="true"></el-input>
                            </el-form-item>
                            
                            <el-form-item label="认购期限" prop="subscribdate">
                                <el-date-picker v-model="form.subscribdate" type="date" placeholder="选择日期"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="认购总价" prop="subscribmoney">
                                <el-input v-model.number="form.subscribmoney" clearable>
                                    <i slot="suffix" class="yuan">元</i>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="意向金金额" prop="intentmoney">
                                <el-input v-model.number="form.intentmoney" clearable>
                                    <i slot="suffix" class="yuan">元</i>
                                    <template slot="append">伍仟元整</template>
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
                                    <el-button type="primary" v-model="form.houseno">请选择房源</el-button>
                                </el-form-item>
                                <el-form-item label="物业地址">
                                    <el-input v-model="form.address1" clearable class="big-input"></el-input>
                                </el-form-item>
                            </el-form-item>
                            
                            <el-form-item label="产证地址" class="disb">
                                <el-input v-model="form.address2" clearable class="big-input"></el-input>
                            </el-form-item>

                            <el-form-item label="房源总价" class="disb">
                                <el-input v-model.number="form.housemoney" clearable>
                                    <i slot="suffix" class="yuan">元</i>
                                </el-input>
                            </el-form-item>

                            <el-form-item label="业主信息" class="disb" required>
                                <el-form-item prop="ownname">
                                    <el-input v-model="form.ownname" clearable placeholder="姓名" class="ownwidth"></el-input>
                                </el-form-item>
                                <el-form-item prop="ownphone">
                                    <el-input v-model="form.ownphone" clearable placeholder="手机号" class="ownwidth"></el-input>
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
                                        <el-button type="primary"  v-model="form.custno">请选择客源</el-button>
                                </el-form-item>
                                <el-form-item label="成交经纪人" required>
                                    <el-form-item prop="item1">
                                        <el-select v-model="form.item1" clearable filterable placeholder="请选择门店">
                                            <el-option v-for="item in option1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item prop="item2" class="small-input">
                                        <el-select v-model="form.item2" clearable filterable placeholder="请选择经纪人">
                                            <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form-item>
                            </el-form-item>
                            <el-form-item label="客户信息" class="disb" required>
                                <el-form-item prop="custname">
                                    <el-input v-model="form.custname" clearable placeholder="姓名" class="ownwidth"></el-input>
                                </el-form-item>
                                <el-form-item prop="custphone">
                                    <el-input v-model="form.custphone" clearable placeholder="手机号" class="ownwidth"></el-input>
                                </el-form-item>
                                <el-form-item prop="custidcard">
                                    <el-input v-model="form.custidcard" clearable placeholder="身份证号" class="custwidth"></el-input>
                                </el-form-item>
                            </el-form-item>
                        </div>
                        <div class="form-cont mt30">
                            <el-form-item label="意向备注" class="disb">
                                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" placeholder="请输入内容" v-model="form.textarea" class="textareawidth"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                </div>
                <div class="form-btn">                   
                        <el-button type="primary" plain round>预 览</el-button>
                        <el-button type="primary" round @click="onSubmit('ruleForm')">保 存</el-button>                  
                </div>
            </el-form>


            
        </div>
       
            
    </div>
    
</template>

<script>

export default {
    data() {
        return {
            form: {
                signdate: '', //签约日期
                contractType: '', //合同类型
                item1: '',    //选择门店
                item2: '',  //选择成交人
                subscribdate: '', //认购期限
                subscribmoney: '', //认购总价
                intentmoney: '', //意向金金额
                houseno: '', //房源编号
                address1: '', //物业地址
                address2: '', //产权地址
                housemoney: '', //房源总价
                ownname: '', //业主姓名
                ownphone: '', //业主手机号
                custno: '', //客源编号
                custname: '', //客户姓名
                custphone: '', //客户手机号
                custidcard: '', //客户身份证号
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
                signdate: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                item1: [
                    { required: true, message: '请选择门店', trigger: 'change' }
                ],
                item2: [
                    { required: true, message: '请选择经纪人', trigger: 'change' }
                ],
                subscribdate: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                subscribmoney: [
                    { required: true, message: '请输入认购总价', trigger: 'blur' },
                    // { min: 0, max: 12, message: '输入总价在0-999999999.99之间', trigger: 'blur' }
                ],
                intentmoney: [
                    { required: true, message: '请输入意向金金额', trigger: 'blur' },
                    // { min: 0, max: 12, message: '输入金额在0-999999999.99之间', trigger: 'blur' }
                ],
                houseno: [
                    { required: true, message: '请选择房源', trigger: 'click' },
                ],
                // address1: [
                //     { required: true, message: '请输入物业地址', trigger: 'blur' },
                // ],
                // address2: [
                //     { required: true, message: '请输入产权地址', trigger: 'blur' },
                // ],
                ownname: [
                    { required: true, message: '请输入业主姓名', trigger: 'blur' },
                ],
                ownphone: [
                    { required: true, message: '请输入业主手机号', trigger: 'blur' },
                ],
                custno: [
                    { required: true, message: '请选择客源', trigger: 'click' },
                ],
                custname: [
                    { required: true, message: '请输入客户姓名', trigger: 'blur' },
                ],
                custphone: [
                    { required: true, message: '请输入客户手机号', trigger: 'blur' },
                ],
                custidcard: [
                    { required: true, message: '请输入客户身份证号', trigger: 'blur' },
                ],
        
            },
        }
    },
   
    computed: {
        
    },
    methods: {
  
        onSubmit() {
            // 新增意向金接口（post）
            this.$ajax
            .post(
                "/api/contract/editIgdCont?type=1",
                {
                    "id": 10,
                    "contType":"4",
                    "houseinfoCode":"USK092",
                    "guestinfoCode":"WQA357",
                    "signDate":"2018/11/04",
                    "subscriptionTerm":"2018/11/18",
                    "subscriptionPrice": "3000",
                    "dealAgentStoreId":"10",
                    "dealAgentStoreName":"当代一店",
                    "dealPrice":"3200.50",
                    "remarks":"意向备注"
                    // "contPersons":[
                    //     {"name": "测试1", "relation": 1, "personType": "1", "mobile": "13099942411"},
                    //     {"name": "测试2", "relation": 2, "personType": "2", "mobile": "13004325012"}
                    // ],
                    // "houseInfo":{
                    //     "houseinfoId": "100",
                    //     "propertyRightAddr": "产权地址",
                    //     "building":"楚河汉街万达环球国际中心",
                    //     "unit":"三单元",
                    //     "number": "804",
                    //     "price":"501"
                    // },
                    // "guestInfo":{
                    //     "guestinfoId": "87"
                    // }
                }
            )
            .then(res => {
                console.log(res)
            }).catch(error => {
                console.log(error)
            })
        },
    },
    mounted() {
        
    },
}
</script>

<style lang="less" scoped>
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
</style>


