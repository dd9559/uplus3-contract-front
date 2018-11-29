<!-- 新增意向金 -->
<template>
    <div class="newintention" id="newIntention">
        <div class="formbox">
            <el-form :inline="true" :model="contractForm" ref="contractForm" class="form-innnerbox">
                <div class="form-content">
                <!-- 合同信息 -->
                    <div class="column-form"> 
                        <div class="column-title">合同信息</div>
                        <div class="form-cont">
                            <el-form-item label="签约日期：" prop="signDate">
                                <el-date-picker v-model="contractForm.signDate" type="date" value-format="yyyy/MM/dd" :disabled="type===2?true:false" placeholder="选择日期"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="合同类型：">
                                <el-input placeholder="意向金" :disabled="true" v-if="this.$route.query.contType == 4"></el-input>
                                <el-input placeholder="定金"  :disabled="true" v-if="this.$route.query.contType == 5"></el-input>
                            </el-form-item>
                            
                            <el-form-item label="认购期限：" prop="subscriptionTerm">
                                <el-date-picker v-model="contractForm.subscriptionTerm" value-format="yyyy/MM/dd" type="date" placeholder="选择日期"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="认购总价：" prop="subscriptionPrice">
                                <el-input v-model.number="contractForm.subscriptionPrice" type="number" clearable>
                                    <i slot="suffix" class="yuan">元</i>
                                </el-input>
                            </el-form-item>
                            
                            <el-form-item label="意向金金额：" prop="dealPrice" v-if="this.$route.query.contType == 4">
                                <el-input v-model.number="contractForm.dealPrice" type="number" clearable>
                                    <i slot="suffix" class="yuan">元</i>
                                    <template slot="append">{{contractForm.dealPrice | moneyFormat}}</template>
                                </el-input>
                            </el-form-item>

                            <el-form-item label="定金金额：" prop="dealPrice" v-if="this.$route.query.contType == 5">
                                <el-input v-model.number="contractForm.dealPrice" type="number" clearable>
                                    <i slot="suffix" class="yuan">元</i>
                                    <template slot="append">{{contractForm.dealPrice | moneyFormat}}</template>
                                </el-input>
                            </el-form-item>
                        </div>
                    </div>

                    <!-- 房源信息 -->
                    <div class="column-form"> 
                        <div class="column-title">房源信息</div>
                        <div class="form-cont">
                            <el-form-item>
                                <el-form-item label="房源编号：" prop="houseno">
                                    <el-button type="primary" @click="toLayerHouse()" v-if="type===1">{{contractForm.houseinfoCode?contractForm.houseinfoCode:'请选择房源'}}</el-button>
                                    <el-button type="text" v-if="type===2">{{contractForm.houseinfoCode}}</el-button>
                                </el-form-item>
                                <el-form-item label="物业地址：" class="ml30">
                                    <div>{{contractForm.houseInfo.Address}}</div>
                                </el-form-item>
                            </el-form-item>
                            
                            <el-form-item label="产证地址：" class="disb">
                                <el-input v-model="contractForm.houseInfo.EstateNameA" clearable class="big-input"></el-input>
                            </el-form-item>

                            <el-form-item label="房源总价：" class="disb">
                                <el-input v-model.number="contractForm.houseInfo.ListingPrice" clearable disabled>
                                    <i slot="suffix" class="yuan">元</i>
                                </el-input>
                            </el-form-item>

                            <el-form-item label="业主信息：" class="disb" required>
                                <el-form-item prop="name">
                                    <el-input v-model="contractForm.contPersons[0].name" clearable placeholder="姓名" class="ownwidth" :disabled="type===2?true:false"></el-input>
                                </el-form-item>
                                <el-form-item prop="mobile">
                                    <el-input v-model.number="contractForm.contPersons[0].mobile" type="number" clearable placeholder="手机号" class="ownwidth" :disabled="type===2?true:false"></el-input>
                                </el-form-item>
                            </el-form-item>
                        </div>
                    </div>

                    <!-- 客源信息 -->
                    <div class="column-form"> 
                        <div class="column-title">客源信息</div>
                        <div class="form-cont">
                            <el-form-item>
                                <el-form-item label="客源编号：" prop="custno" required>
                                        <el-button type="primary"  @click="toLayerGuest()" v-if="type===1">{{contractForm.guestinfoCode?contractForm.guestinfoCode:'请选择客源'}}</el-button>
                                        <el-button type="text" v-if="type===2">{{contractForm.guestinfoCode}}</el-button>
                                </el-form-item>
                                <el-form-item label="成交经纪人：" required>
                                    <el-form-item prop="item1">
                                        <el-select v-model="contractForm.guestInfo.GuestStoreName" clearable filterable remote placeholder="请选择门店" @change="getShop_" :remote-method="getShopList" :loading="loading">
                                            <el-option v-for="item in option2" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item prop="item2" class="small-input">
                                        <el-select v-model="contractForm.guestInfo.EmpName" clearable filterable placeholder="请选择经纪人" @change="getAgent">
                                            <el-option v-for="item in option3" :key="item.empId" :label="item.name" :value="item.empId"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form-item>
                            </el-form-item>
                            <el-form-item label="客户信息：" class="disb" required>
                                <el-form-item prop="guestList_name">
                                    <el-input v-model="contractForm.contPersons[1].name" clearable placeholder="姓名" class="ownwidth" :disabled="type===2?true:false"></el-input>
                                </el-form-item>
                                <el-form-item prop="guestList_mobile">
                                    <el-input v-model="contractForm.contPersons[1].mobile" clearable placeholder="手机号" class="ownwidth" :disabled="type===2?true:false"></el-input>
                                </el-form-item>
                                <el-form-item prop="guestList_identifyCode">
                                    <el-input v-model="contractForm.contPersons[1].identifyCode" clearable placeholder="身份证号" class="custwidth" :disabled="type===2?true:false"></el-input>
                                </el-form-item>
                            </el-form-item>
                        </div>
                        <div class="form-cont mt30" v-if="this.$route.query.contType == 4">
                            <el-form-item label="意向备注：" class="disb">
                                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" placeholder="请输入内容" v-model="contractForm.remarks" class="textareawidth"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                </div>
                <div class="form-btn">                   
                        <el-button type="primary" plain round @click="onPreview()" v-if="type===1">预 览</el-button>
                        <el-button type="primary" round @click="onSubmit('contractForm')">保 存</el-button>                  
                </div>
            </el-form>


            
        </div>
        <!-- 房客源弹框 -->
        <houseGuest :dialogType="dialogType" :dialogVisible="isShowDialog"  @closeHouseGuest="closeCommission" v-if='isShowDialog'></houseGuest>
          
    </div>
    
</template>

<script>
import houseGuest from '../contractDialog/houseGuest';
import { TOOL } from "@/assets/js/common";
export default {
    data() {
        return {
            isShowDialog:false,
            dialogType: '',
            loading: false,
            type: 1,
            //编辑时的合同id
            id:'',
            contractForm: {
                type: this.$route.query.contType,
                signDate: "",
                houseinfoCode: "",
                guestinfoCode: "",
                subscriptionTerm: "",                       
                subscriptionPrice: "",
                dealPrice: "",
                remarks: "",

                houseInfo: {
               
                },
                guestInfo: {
                    
                },
                //合同人员相关信息
                contPersons: [
                    //业主信息
                    {
                        name: '',
                        mobile: '',
                        identifyCode: '',
                        type: 1,
                        relation: ''
                    },
                    //客户信息
                    {
                        name: '',
                        mobile: '',
                        identifyCode: '',
                        type: 2,
                        relation: ''
                    }
                ],
                               
            },
            
            
            

            //门店选择列表
            
            
            option2: [],
            option3: [],
            
            // 表单校验规则
            // rules: {
            //     signDate: [
            //         { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
            //     ],
                
            //     subscriptionTerm: [
            //         { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
            //     ],
            //     subscriptionPrice: [
            //         { required: true, message: '请输入认购总价'},
            //         // { min: 0, max: 12, message: '输入总价在0-999999999.99之间', trigger: 'blur' }
            //     ],
            //     dealPrice: [
            //         { required: true, message: '请输入意向金金额'},
            //         // { min: 0, max: 12, message: '输入金额在0-999999999.99之间', trigger: 'blur' }
            //     ],
                
            //     name: [
            //         { required: true, message: '请输入业主姓名', trigger: 'submit'},
            //     ],
            //     mobile: [
            //         { required: true, message: '请输入业主手机号', trigger: 'submit'},
            //     ],

            //     guestList_name: [
            //         { required: true, message: '请输入客户姓名', trigger: 'submit' },
            //     ],
            //     guestList_mobile: [
            //         { required: true, message: '请输入客户手机号', trigger: 'submit'  },
            //     ],
            //     guestList_identifyCode: [
            //         { required: true, message: '请输入客户身份证号', trigger: 'submit'  },
            //     ],
                
            //     custno: [
            //         { required: true, message: '请选择客源', trigger: 'click' },
            //     ],
            //     item1: [
            //         { required: true, message: '请选择门店', trigger: 'submit' }
            //     ],
            //     item2: [
            //         { required: true, message: '请选择经纪人', trigger: 'submit' }
            //     ],
                
        
            // },
        }
    },

    components: {
        houseGuest
    },
   
    computed: {
        getEmpName(){
            let EmpName = this.contractForm.guestInfo.EmpName
            if(!EmpName){
                return ''
            }else{
                return EmpName
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

    methods: {
        //选择房源弹框
        toLayerHouse(){
            this.isShowDialog = true
            this.dialogType = "house"
        },

        toLayerGuest(){
            this.isShowDialog = true
            this.dialogType = "guest"
        },

        //根据房源id获取房源信息
        getHousedetail(id) {
            console.log("房源");
            let param = {
                houseId: id
            };
            this.$ajax.get("/api/resource/houses/one", param).then(res => {
                res = res.data;
                if (res.status === 200) {
                let houseMsg = res.data;
                console.log(houseMsg);
                this.contractForm.houseinfoCode = houseMsg.PropertyNo; //房源编号
                this.contractForm.houseInfo = houseMsg;
                this.contractForm.contPersons[0] = {
                    name: houseMsg.OwnerInfo.OwnerName,
                    mobile: houseMsg.OwnerInfo.OwnerMobile,
                    relation: houseMsg.OwnerInfo.Relation,
                    type: 1,
                };
                
                }
            });
        },

         //根据客源id获取客源信息
        getGuestDetail(id) {
            console.log("客源");
            let param = {
                customerId: id
            };
            this.$ajax.get("/api/resource/customers/one", param).then(res => {
                res = res.data;
                if (res.status === 200) {
                let guestMsg = res.data;
                console.log(guestMsg);
                this.contractForm.guestinfoCode = guestMsg.InquiryNo; //客源编号
                this.contractForm.guestInfo = guestMsg;
                this.contractForm.contPersons[1] = {
                    name: guestMsg.OwnerInfo.CustName,
                    mobile: guestMsg.OwnerInfo.CustMobile,
                    relation: guestMsg.OwnerInfo.CustRelation,
                    type: 2,
                };
                // this.option2.push({
                //     name: guestMsg.GuestStoreName,
                //     id: guestMsg.GuestStoreCode
                // });
                // this.option3.push({
                //     name: guestMsg.EmpName,
                //     empId: guestMsg.EmpCode
                // });
                }
            });
        },


        //根据合同id查询合同详细信息
        getContractDetail() {
            let param = {
                id: this.id
            };
            this.$ajax.get("/api/contract/detail", param).then(res => {
                res = res.data;
                if (res.status === 200) {
                    this.contractForm = res.data;
                    this.contractForm.signDate = res.data.signDate.substr(0, 10);
                    this.contractForm.type=res.data.contType.value;
                    this.option2.push({id:res.data.houseInfo.HouseStoreCode,name:res.data.houseInfo.HouseStoreName});
                    this.option3.push({id:res.data.guestInfo.GuestStoreCode,name:res.data.guestInfo.GuestStoreName});
                    
                    for (var i = 0; i < this.contractForm.contPersons.length; i++) {
                        if (this.contractForm.contPersons[i].personType.value === 1) {
                            this.ownerList[0].name = this.contractForm.contPersons[i].name;
                            this.ownerList[0].mobile = this.contractForm.contPersons[i].mobile;
                            this.ownerList[0].relation = this.contractForm.contPersons[i].relation;
                            this.ownerList[0].identifyCode = this.contractForm.contPersons[i].identifyCode;
                        } else if (this.contractForm.contPersons[i].personType.value === 2) {
                            this.guestList[0].name = this.contractForm.contPersons[i].name;
                            this.guestList[0].mobile = this.contractForm.contPersons[i].mobile;
                            this.guestList[0].relation = this.contractForm.contPersons[i].relation;
                            this.guestList[0].identifyCode = this.contractForm.contPersons[i].identifyCode;
                        }
                    }
                }
            });
        },

        //获取门店
        getShopList(e) {
            let param = {
                keyword: e
            };
            this.$ajax.get("/api/contract/getDepsByCityId", param).then(res => {
                
                res = res.data;
                if (res.status === 200) {
                    this.loading = false;

                     if(e === '' || !e){
                        if(res.data.length > 0){ 
                            this.option2 = res.data;       
                        }
                     }else{
                         this.option2.push({
                            name: guestMsg.GuestStoreName,
                            id: guestMsg.GuestStoreCode
                        });
                     }
                    
                   
                }
            });
        },

        //获取门店更改时的
        getShop_(id) {
           
            if(id !== "" || !!id){
                
                this.guestInfo.EmpName = ''
                this.loading2 = true;
                let param = {
                    depId: id
                };
                this.$ajax.get('/api/organize/employees', param).then(res=>{
                res=res.data
                if(res.status===200){                 
                     
                    this.option3 = res.data; 
                    this.loading = false;       
                                                     
                }
                })
            }
            
         },

         getAgent(id){
             this.contractForm.guestInfo.EmpName = id
         },

       

         //关闭选择房源客源弹窗
        closeCommission(value){
            if (value) {
                if (value.dialogType === "house") {
                    this.isShowDialog = false;
                    this.getHousedetail(value.selectCode);
                } else if (value.dialogType === "guest") {
                    this.isShowDialog = false;
                    this.getGuestDetail(value.selectCode);
                }
            } else {
                this.isShowDialog = false;
            }
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
        onSubmit(contractForm) {
            // this.$refs[contractForm].validate((valid) => {
            //     if (valid) {                  
                    
                    let param = { 
                        igdCont: this.contractForm,
                        type: this.type                            
                    }
                    this.$confirm('确定保存合同?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info',
                        roundButton: true

                    }).then(() => {
                        this.$ajax
                        .postJSON("/api/contract/editIgdCont", param)
                        .then(res => {
                            
                            if (res.data.status === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '已保存!'
                                });
                            }
                        }).catch(error => {
                            console.log(error)
                        })
                    
                    }).catch((err) => {
                        console.log(err)
                    })
            //     }else{
            //         return false
            //     }
            // })
                       
        },
    },
    created() {
        this.getShopList();
        
        if (this.$route.query.operateType) {
        this.type = this.$route.query.operateType;
            if (this.type === 2) {
                this.id=this.$route.query.id
                this.getContractDetail();
            }
        }
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
    .el-button--text{
        font-weight: 700;
    }
    .fr{
        float: right;
    }
    .mr20{
        margin-right: 20px;
    }
    .ml30{
        margin-left: 30px;
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


