<!-- 新增意向金 -->
<template>
    <div class="newintention" id="newIntention">
        <div class="formbox">
            <el-form :inline="true" :model="contractForm" :rules="rules" :validate-on-rule-change="false" ref="contractForm" class="form-innnerbox">
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
                                <el-input v-model.number="contractForm.subscriptionPrice" type="number" clearable @input="cutNumber('subscriptionPrice')" >
                                    <i slot="suffix" class="yuan">元</i>
                                </el-input>
                            </el-form-item>
                            
                            <el-form-item label="意向金金额：" prop="dealPrice" v-if="this.$route.query.contType == 4">
                                <el-input v-model.number="contractForm.dealPrice" type="number" clearable @input="cutNumber('dealPrice')">
                                    <i slot="suffix" class="yuan">元</i>
                                    <template slot="append">{{contractForm.dealPrice | moneyFormat}}</template>
                                </el-input>
                                
                            </el-form-item>

                            <el-form-item label="定金金额：" prop="dealPrice" v-if="this.$route.query.contType == 5">
                                <el-input v-model.number="contractForm.dealPrice" type="number" clearable @input="cutNumber('dealPrice')">
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
                                    <div>{{contractForm.houseInfo.EstateName + contractForm.houseInfo.BuildingName + contractForm.houseInfo.Unit + contractForm.houseInfo.RoomNo}}</div>
                                </el-form-item>
                            </el-form-item>
                            
                            <el-form-item label="产证地址：" class="disb">
                                <el-input v-model="contractForm.houseInfo.propertyRightAddr" clearable class="big-input"></el-input>
                            </el-form-item>

                            <el-form-item label="房源总价：" class="disb">
                                <el-input v-model.number="contractForm.houseInfo.ListingPrice" clearable disabled>
                                    <i slot="suffix" class="yuan">元</i>
                                </el-input>
                            </el-form-item>

                            <el-form-item label="业主信息：" class="disb" required>
                                <el-form-item prop="ownname">
                                    <el-input v-model="contractForm.ownname" clearable placeholder="姓名" class="ownwidth" :disabled="type===2?true:false"></el-input>
                                </el-form-item>
                                <el-form-item prop="ownmobile">
                                    <el-input v-model.number="contractForm.ownmobile" type="number" clearable placeholder="手机号" class="ownwidth" :disabled="type===2?true:false"></el-input>
                                </el-form-item>
                            </el-form-item>
                        </div>
                    </div>

                    <!-- 客源信息 -->
                    <div class="column-form"> 
                        <div class="column-title">客源信息</div>
                        <div class="form-cont">
                            <el-form-item>
                                <el-form-item label="客源编号：" prop="guestinfoCode" required>
                                        <el-button type="primary"  @click="toLayerGuest()" v-if="type===1" v-model="contractForm.guestinfoCode">{{contractForm.guestinfoCode?contractForm.guestinfoCode:'请选择客源'}}</el-button>
                                        <el-button type="text" v-if="type===2" v-model="contractForm.guestinfoCode">{{contractForm.guestinfoCode}}</el-button>
                                </el-form-item>
                                <el-form-item label="成交经纪人：" required>
                                    <el-form-item prop="guestInfo.GuestStoreName">
                                        <el-select v-model="contractForm.guestInfo.GuestStoreName" clearable filterable remote placeholder="请选择门店" @change="getShop_" :remote-method="getShopList" :loading="loading">
                                            <el-option v-for="item in option2" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item prop="guestInfo.EmpName" class="small-input">
                                        <el-select v-model="contractForm.guestInfo.EmpName" clearable filterable placeholder="请选择经纪人" ref="select2" @clear="clearEmpName" @change="changeAgent">
                                            <el-option v-for="item in option3" :key="item.empId" :label="item.name" :value="item.empId"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form-item>
                            </el-form-item>
                            <el-form-item label="客户信息：" class="disb" required>
                                <el-form-item prop="custname">
                                    <el-input v-model="contractForm.custname" clearable placeholder="姓名" class="ownwidth" :disabled="type===2?true:false"></el-input>
                                </el-form-item>
                                <el-form-item prop="custmobile">
                                    <el-input v-model.number="contractForm.custmobile" clearable placeholder="手机号" type="number" class="ownwidth" :disabled="type===2?true:false"></el-input>
                                </el-form-item>
                                <el-form-item prop="custIdentifyCode" v-if="this.type===1">
                                    <el-input v-model.number="contractForm.custIdentifyCode" clearable placeholder="身份证号" type="number" class="custwidth"></el-input>
                                    
                                </el-form-item>
                                <el-form-item v-if="this.type===2">
                                    <el-input v-model="contractForm.contPersons[1].identifyCode" clearable placeholder="身份证号" class="custwidth" disabled></el-input>
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
        // 表单正则
        var checkPrice = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入价格'));
            }else {
                if (value < 0 || value > 999999999.99) {
                callback(new Error('输入总价在0-999999999.99之间'));
                } else {
                callback();
                }
            }
            
        };
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
                    EstateName:'',
                    BuildingName: '',
                    Unit: '',
                    RoomNo: ''
                },
                guestInfo: {
                    GuestStoreCode: '',
                    GuestStoreName: '',
                    EmpCode: '',
                    EmpName: ''
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
                //业主信息
                ownname: '',
                ownmobile: '',
                // ownrelation: '',

                //客户信息
                custname: '',
                custmobile: '',
                custIdentifyCode: '',
                               
            },

            //门店选择列表
            
            
            option2: [],
            option3: [],
            
            // 表单校验规则
            rules: {
                signDate: [
                    { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
                ],
                
                subscriptionTerm: [
                    { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
                ],
                subscriptionPrice: [
                    { validator: checkPrice}
                   
                ],
                dealPrice: [
                    { validator: checkPrice}
                ],
                ownname: [
                    { required: true, message: '请输入业主姓名'},
                ],
                ownmobile: [
                    { required: true, message: '请输入业主手机号'},
                ],

                custname: [
                    { required: true, message: '请输入客户姓名'},
                ],
                custmobile: [
                    { required: true, message: '请输入客户手机号' },
                ],
                
                guestinfoCode: [
                    { required: true, message: '请选择客源编号', trigger: 'click'},
                ],
                guestInfo: {
                    GuestStoreName: [
                        { required: true, message: '请选择门店' }
                    ],
                    EmpName: [
                        { required: true, message: '请选择经纪人'}
                    ],
                    
                    
                    
                },
                custIdentifyCode: [
                        { required: true, message: '请输入客户身份证号' },
                    ], 
                // contPersons:{
                //     // name: '',
                //     // mobile: '',
                    
                // }                    
               
               
                
        
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
        cutNumber(val){
            // console.log(val)
            if(val==="subscriptionPrice"){
                this.$nextTick(()=>{
                    this.contractForm.subscriptionPrice=this.$tool.cutFloat({val:this.contractForm.subscriptionPrice,max:999999999.99})
                })
            }else if(val==="dealPrice"){
                this.$nextTick(()=>{
                    this.contractForm.dealPrice=this.$tool.cutFloat({val:this.contractForm.dealPrice,max:999999999.99})
                })
            }
        },
        
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
                    
                    this.contractForm.ownname = houseMsg.OwnerInfo.OwnerName;
                    this.contractForm.ownmobile = houseMsg.OwnerInfo.OwnerMobile; 
                    // this.contractForm.ownrelation = houseMsg.OwnerInfo.Relation;            
                
                }
            }).catch((error) => {
                  this.$message({
                    message: error
                })
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
                    identifyCode: this.contractForm.custIdentifyCode,
                    type: 2,
                };
                this.contractForm.custname = guestMsg.OwnerInfo.CustName;
                this.contractForm.custmobile = guestMsg.OwnerInfo.CustMobile; 
                // this.contractForm.custrelation = guestMsg.OwnerInfo.CustRelation; 
                
                }
            }).catch((error) => {
                  this.$message({
                   message: error
                })
            });
        },


        //根据合同id查询合同详细信息（编辑接口会用到）
        getContractDetail() {
            let param = {
                id: this.id
            };
            this.$ajax.get("/api/contract/detail", param).then(res => {
                res = res.data;
                if (res.status === 200) {
                    this.contractForm = res.data;
                    console.log(res.data)
                    this.contractForm.signDate = res.data.signDate.substr(0, 10);
                    this.contractForm.subscriptionTerm = res.data.subscriptionTerm.substr(0, 10);
                    this.contractForm.type=res.data.contType.value;
                    
                    
                    // this.contractForm.guestInfo.GuestStoreName = res.data.guestInfo.GuestStoreName;
                    // this.contractForm.guestInfo.GuestStoreCode = res.data.guestInfo.GuestStoreCode;
                    // this.contractForm.guestInfo.EmpName = res.data.guestInfo.EmpName;
                    // this.contractForm.guestInfo.empId = res.data.guestInfo.EmpCode;

                    

                    
                    for (let i = 0; i < res.data.contPersons.length; i++) {
                        if (res.data.contPersons[i].personType.value === 1) {
                            this.contractForm.contPersons[0].name = res.data.contPersons[i].name;
                            this.contractForm.contPersons[0].mobile = res.data.contPersons[i].mobile;
                            this.contractForm.contPersons[0].relation = res.data.contPersons[i].relation;
                            this.contractForm.contPersons[0].identifyCode = res.data.contPersons[i].identifyCode;
                            this.contractForm.contPersons[0].type = res.data.contPersons[i].personType.value;
                            this.contractForm.ownname = res.data.contPersons[i].name;
                            this.contractForm.ownmobile = res.data.contPersons[i].mobile; 
                            // this.contractForm.ownrelation = this.contractForm.contPersons[i].relation;

                        } else if (this.contractForm.contPersons[i].personType.value === 2) {
                            this.contractForm.contPersons[1].name = res.data.contPersons[i].name;
                            this.contractForm.contPersons[1].mobile = res.data.contPersons[i].mobile;
                            this.contractForm.contPersons[1].relation = res.data.contPersons[i].relation;
                            this.contractForm.contPersons[1].identifyCode =  res.data.contPersons[i].identifyCode,
                            this.contractForm.contPersons[1].type = res.data.contPersons[i].personType.value;
                            this.contractForm.custname = res.data.contPersons[i].name;
                            this.contractForm.custmobile = res.data.contPersons[i].mobile; 
                            // this.contractForm.custrelation = this.contractForm.contPersons[i].relation;
                        }
                    }
                }
            }).catch((error) => {
                  this.$message({
                    message: error
                })
            });
        },

        //获取门店
        getShopList(e) {
            let param = {
                keyword: e
            };
            this.$ajax.get("/api/contract/getDepsByCityId", param).then(res => {
                               
                this.loading = true;
                if (res.data.status === 200) {
                    this.loading = false;

                    if(res.data.data.length > 0){ 
                        this.option2 = res.data.data;       
                    }
                    
                    console.log(this.option2)
                   
                }
            }).catch((error) => {
                  this.$message({
                    message: error
                })
            });
        },

        changeAgent(id){
            //   this.$set(this.contractForm.guestInfo,this.contractForm.guestInfo.EmpName,name)
              this.$set(this.contractForm.guestInfo,this.contractForm.guestInfo.EmpCode,id)
        },

        clearEmpName(){
            this.contractForm.guestInfo.EmpName = ''
        },

        //获取门店更改时的
        getShop_(id) {
           
            // if(id !== "" || !!id){
                
                this.loading2 = true;
                let param = {
                    depId: id
                };
                
                
                this.$ajax.get('/api/organize/employees', param).then(res=>{
                    
                    if(res.data.status===200){ 
                                       
                        this.loading = false; 
                        
                        
                        console.log(id)

                        if(res.data.data.length > 0){ 
                            this.option3 = res.data.data;
                        }         
                        console.log(this.option3)                               
                    }
                }).catch((error) => {
                    this.$message({
                        message: error
                    })
                });
                // debugger
                this.clearEmpName()
                
               
            // }
            
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
            } else {getContractDetaily
                this.isShowDialog = false;
            }
        },
        
       
        // 新增意向金接口（post）
        onSubmit(contractForm) {
            this.$refs[contractForm].validate((valid) => {
             
                if(this.type ===1){
                    this.contractForm.contPersons[0].name = this.contractForm.ownname
                    this.contractForm.contPersons[0].mobile = this.contractForm.ownmobile
                    this.contractForm.contPersons[1].name = this.contractForm.custname
                    this.contractForm.contPersons[1].mobile = this.contractForm.custmobile
                    this.contractForm.contPersons[1].identifyCode = this.contractForm.custIdentifyCode
                }
                


                if (valid) {                  
                    let param = { 
                        igdCont: this.contractForm,
                        type: this.type                            
                    }
                    if(this.type===2){
                        
                    
                        delete param.igdCont.code;
                        delete param.igdCont.contType;
                        delete param.igdCont.recordName;
                        delete param.igdCont.recordDept;
                        delete param.igdCont.custEnsure;
                        delete param.igdCont.custCommission;
                        delete param.igdCont.ownerCommission;
                        delete param.igdCont.commissionPayment;
                        delete param.igdCont.otherCooperationCost;
                        delete param.igdCont.transFlowCode;
                        delete param.igdCont.contChangeState;
                        delete param.igdCont.laterStageState;
                        delete param.igdCont.contState;
                        delete param.igdCont.propertyAddr
                        delete param.igdCont.propertyCard
                        delete param.igdCont.timeUnit
                        delete param.igdCont.moneyUnit
                        delete param.igdCont.createTime
                        delete param.igdCont.updateTime
                        delete param.igdCont.isHavaCooperation
                        delete param.igdCont.extendParams
                        delete param.igdCont.otherCooperationInfo
                        delete param.igdCont.receivableCommission
                        delete param.igdCont.isHaveData
                        delete param.igdCont.toExamineState
                        delete param.igdCont.previewImg
                        delete param.igdCont.isHaveCooperation
                        delete param.igdCont.remarksExamine
                        delete param.igdCont.showCustName
                        delete param.igdCont.showOwnerName
                        delete param.igdCont.distributableAchievement
                        delete param.igdCont.dataType
                        delete param.igdCont.dealAgentId
                        delete param.igdCont.dealAgentName
                        delete param.igdCont.dealAgentStoreId
                        delete param.igdCont.dealAgentStoreName
                        delete param.igdCont.contPersons[0].personType
                        delete param.igdCont.contPersons[0].contractId
                        delete param.igdCont.contPersons[0].createTime
                        delete param.igdCont.contPersons[0].isDel
                        delete param.igdCont.contPersons[0].pid
                        delete param.igdCont.contPersons[0].propertyRightRatio
                        delete param.igdCont.contPersons[0].uId
                        delete param.igdCont.contPersons[0].updateTime

                        delete param.igdCont.contPersons[1].personType
                        delete param.igdCont.contPersons[1].contractId
                        delete param.igdCont.contPersons[1].createTime
                        delete param.igdCont.contPersons[1].isDel
                        delete param.igdCont.contPersons[1].pid
                        delete param.igdCont.contPersons[1].propertyRightRatio
                        delete param.igdCont.contPersons[1].uId
                        delete param.igdCont.contPersons[1].updateTime
                       
                    }
                    delete param.igdCont.ownname;
                    delete param.igdCont.ownmobile;
                    // delete param.igdCont.ownrelation;
                    delete param.igdCont.custname;
                    delete param.igdCont.custmobile;
                    delete param.igdCont.custIdentifyCode;

                    this.$confirm('确定保存合同?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info',
                        roundButton: true

                    }).then(() => {
                        this.$ajax
                        .postJSON("/api/contract/editIgdCont", param)
                        .then(res => {
                            let tips = res.data.message

                            // this.contractForm.ownname = this.contractForm.contPersons[0].name 
                            // this.contractForm.ownmobile = this.contractForm.contPersons[0].mobile
                            // this.contractForm.custname = this.contractForm.contPersons[1].name 
                            // this.contractForm.custmobile = this.contractForm.contPersons[1].mobile
                            // this.contractForm.custIdentifyCode = this.contractForm.contPersons[1].identifyCode

                            if (res.data.status === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '已保存!'
                                });
                                this.$router.push({
                                    path:'/contractList',
                                    // query:{
                                    //     id: this.id
                                    // }
                                })
                            }else{
                                this.$message.error(tips)
                            }
                        }).catch(error => {
                            this.$message({
                                message: error
                            })
                        })
                    
                    }).catch((error) => {
                       this.$message({
                            message:'取消'
                        })
                    })
                }else{
                    return false
                }
            })
                       
        },
    },
    created() {
        this.getShopList();
        
        
        if (this.$route.query.operateType) {
        this.type = this.$route.query.operateType;
            if (this.type === 2) {
                this.getShopList();
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


