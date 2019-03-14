<!-- 新增意向金 -->
<template>
    <div class="newintention" id="newIntention">
        <div class="formbox">
            <el-form :inline="true" :model="contractForm" :rules="rules" ref="contractForm" class="form-innnerbox">
                <div class="form-content">
                <!-- 合同信息 -->
                    <div class="column-form"> 
                        <div class="column-title">合同信息</div>
                        <div class="form-cont">
                            <el-form-item label="签约日期：" prop="signDate">
                                <el-date-picker v-model="contractForm.signDate" type="date" value-format="yyyy/MM/dd" placeholder="选择日期"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="合同类型：">
                                <el-input placeholder="意向金" :disabled="true" v-if="this.contractForm.type == 4"></el-input>
                                <el-input placeholder="定金"  :disabled="true" v-if="this.contractForm.type == 5"></el-input>
                            </el-form-item>
                            <br>
                            <el-form-item label="认购期限：" prop="subscriptionTerm">
                                <el-date-picker v-model="contractForm.subscriptionTerm" value-format="yyyy/MM/dd" type="date" placeholder="选择日期"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="认购总价：" prop="subscriptionPrice">
                                <el-input v-model="contractForm.subscriptionPrice" type="text" clearable @input="cutNumber('subscriptionPrice')" >
                                    <i slot="suffix" class="yuan">元</i>
                                </el-input>
                            </el-form-item>
                            
                            <el-form-item label="意向金金额：" prop="dealPrice" v-if="this.contractForm.type == 4">
                                <el-input v-model="contractForm.dealPrice" type="text" clearable @input="cutNumber('dealPrice')">
                                    <i slot="suffix" class="yuan">元</i>
                                    <template slot="append">{{contractForm.dealPrice | moneyFormat}}</template>
                                </el-input> 
                            </el-form-item>

                            <el-form-item label="定金金额：" prop="dealPrice" v-if="this.contractForm.type == 5">
                                <el-input v-model="contractForm.dealPrice" type="text" clearable @input="cutNumber('dealPrice')">
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
                                    <el-button type="text" v-if="this.$route.query.operateType==2">{{contractForm.houseinfoCode}}</el-button>
                                </el-form-item>
                                <el-form-item label="物业地址：" class="ml30">
                                    <div v-if="type===1">{{contractForm.houseInfo.EstateName}}</div>
                                    <div v-if="this.$route.query.operateType==2">{{contractForm.propertyAddr}}</div>
                                </el-form-item>
                            </el-form-item>
                            
                            <el-form-item label="产权地址：" class="disb">
                                <el-input v-model="contractForm.houseInfo.propertyRightAddr" clearable class="big-input" maxlength=30></el-input>
                            </el-form-item>

                            <el-form-item label="房源总价：" class="disb">
                                <el-input v-model.number="contractForm.houseInfo.ListingPrice" clearable disabled>
                                    <i slot="suffix" class="yuan" v-if="contractForm.houseInfo.TradeInt == 2">万元</i>
                                    <i slot="suffix" class="yuan" v-if="contractForm.houseInfo.TradeInt == 3">元/月</i>
                                </el-input>
                            </el-form-item>

                            <el-form-item label="业主信息：" class="disb" required>
                                <el-form-item prop="ownname">
                                    <el-input v-model="contractForm.ownname" @input="cutText('ownname')" clearable placeholder="姓名" class="ownwidth" :disabled="this.$route.query.operateType==2?true:false" maxlength=5></el-input>
                                </el-form-item>
                                <el-form-item prop="ownmobile" v-if="this.type===1">
                                    <el-input v-model="contractForm.ownmobile" type="tel" maxlength=11 clearable placeholder="手机号"  class="ownwidth"></el-input>
                                </el-form-item>
                                <el-form-item v-if="this.$route.query.operateType==2">
                                    <el-input v-model="contractForm.ownmobile" type="tel" maxlength=11 clearable placeholder="手机号"  class="ownwidth" disabled></el-input>
                                </el-form-item>
                                <el-form-item prop="ownIdentifyCode" v-if="this.type===1">
                                    <el-input v-model="contractForm.ownIdentifyCode" clearable placeholder="身份证号" class="custwidth" maxlength=18></el-input>
                                </el-form-item>
                                <el-form-item v-if="this.$route.query.operateType==2">
                                    <el-input v-model="contractForm.ownIdentifyCode" clearable placeholder="身份证号" class="custwidth" maxlength=18></el-input>               
                                </el-form-item>
                            </el-form-item>
                        </div>
                    </div>

                    <!-- 客源信息 -->
                    <div class="column-form"> 
                        <div class="column-title">客源信息</div>
                        <div class="form-cont">
                            <div>

                                <el-form-item label="客源编号：" prop="guestinfoCode">
                                  <el-button-group v-model="contractForm.guestinfoCode">
                                        <el-button type="primary" @click="toLayerGuest()" v-if="type===1" v-model="contractForm.guestinfoCode">{{contractForm.guestinfoCode?contractForm.guestinfoCode:'请选择客源'}}</el-button>
                                        <el-button type="text" v-if="this.$route.query.operateType==2" v-model="contractForm.guestinfoCode">{{contractForm.guestinfoCode}}</el-button>
                                        
                                  </el-button-group>
                                </el-form-item>

                                <el-form-item label="成交经纪人：" required>
                                    <el-form-item>
                                        <!-- <el-select v-model="contractForm.guestInfo.GuestStoreName" placeholder="请选择门店">
                                            <el-option v-for="item in option2" :key="item.id" :label="item.name" :value="item.id + ',' + item.name"></el-option>
                                        </el-select> -->
                                        <el-input v-model="contractForm.guestInfo.GuestStoreName" placeholder="请选择门店" :disabled=true></el-input>
                                    </el-form-item>
                                    <el-form-item class="small-input">
                                        <!-- <el-select v-model="contractForm.guestInfo.EmpName" placeholder="请选择经纪人">
                                            <el-option v-for="item in option3" :key="item.empId" :label="item.name" :value="item.empId + ',' + item.name"></el-option>
                                        </el-select> -->
                                         <el-input v-model="contractForm.guestInfo.EmpName" placeholder="请选择经纪人" :disabled=true></el-input>
                                    </el-form-item>
                                    
                                </el-form-item>
                            </div>
                            <el-form-item label="客户信息：" class="disb" required>
                                <el-form-item prop="custname">
                                    <el-input v-model="contractForm.custname" @input="cutText('custname')" clearable placeholder="姓名" class="ownwidth" :disabled="this.$route.query.operateType==2?true:false" maxlength=5></el-input>
                                </el-form-item>
                                <el-form-item prop="custmobile" v-if="this.type===1">
                                    <el-input v-model="contractForm.custmobile" clearable placeholder="手机号" type="tel" maxlength=11 class="ownwidth"></el-input>
                                </el-form-item>
                                <el-form-item v-if="this.$route.query.operateType==2">
                                    <el-input v-model="contractForm.custmobile" clearable placeholder="手机号" type="tel" maxlength=11 class="ownwidth" disabled></el-input>
                                </el-form-item>
                                
                                <el-form-item prop="custIdentifyCode" v-if="this.type===1">
                                    <el-input v-model="contractForm.custIdentifyCode" clearable placeholder="身份证号" class="custwidth" maxlength=18></el-input>
                                </el-form-item>
                                <el-form-item v-if="this.$route.query.operateType==2">
                                    <el-input v-model="contractForm.custIdentifyCode" clearable placeholder="身份证号" class="custwidth" maxlength=18></el-input>               
                                </el-form-item>
                            </el-form-item>
                            
                        </div>
                        <div class="form-cont mt30" v-if="this.contractForm.type == 4">
                            <el-form-item label="意向备注：" class="disb textlengthbox">
                                <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 5}"  placeholder="请输入内容" v-model="contractForm.remarks" class="textareawidth" maxlength=200></el-input>
                                <span class="textLength">{{contractForm.remarks.length}}/200</span>
                            </el-form-item>
                        </div>
                    </div>
                </div>
                
            </el-form>


            
        </div>
        <div class="form-btn">                     
                <el-button type="primary" round @click="checkRule('contractForm')" v-if="hidBtn!==1">保存并进入下一步</el-button>                  
        </div>
        <!-- 房客源弹框 -->
        <houseGuest :dialogType="dialogType" :dialogVisible="isShowDialog" :choseHcode="choseHcode" :choseGcode="choseGcode"  @closeHouseGuest="closeCommission" v-if='isShowDialog'></houseGuest>
        <!-- 确定保存合同弹框 -->
        <el-dialog title="提示" :visible.sync="dialogSure" class="myconfirm" :closeOnClickModal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal">
            <span>确定保存合同？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogSure = false">取 消</el-button>
                <el-button v-if="type===1" type="primary" @click="onSubmit1()" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
                <el-button v-if="this.$route.query.operateType==2" type="primary" @click="onSubmit2()" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 创建合同成功提示框 -->
        <el-dialog title="提示" :visible.sync="dialogSuccess" width="460px" :closeOnClickModal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal">
          <span>是否继续上传附件？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="toContract">取 消</el-button>
            <el-button type="primary" @click="toUpload">确 定</el-button>
          </span>
        </el-dialog>
          
    </div>
    
</template>

<script>
import houseGuest from "../contractDialog/houseGuest";
//  import {FILTER} from "@/assets/js/filter";
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
export default {
  mixins: [MIXINS],
  data() {
    // 表单正则
    var checkNull = (rule, value, callback) => {
      if (!value || value !=='') {
        return callback(new Error());
      }
    };

    var checkPrice = (rule, value, callback) => {
      
      if (!value) {
        return callback(new Error("请输入价格"));
      } else {
        if (value < 0 || value > 999999999.99) {
          callback(new Error("输入总价在0-999999999.99之间"));
        } else {
          callback();
        }
      }
    };
    

    //身份证号验证规则
    var idCard = (rule, value, callback) => {
    
      let idcard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
       
        if (!value) {
           return callback(new Error("请输入身份证号"));
        } else {
          if (!idcard.test(value)) {
           
            callback(new Error("请输入正确格式的身份证号"));
          } else {
            callback();
          }
        }
      
    };

    //手机号验证规则
    var telPhone = (rule, value, callback) => {
      let myreg = /^[1][0-9]{10}$/;
      if (!value) {
        return callback(new Error("请输入手机号"));
      } else {
        if (!myreg.test(value)) {
          callback(new Error("请输入1开头的11位手机号码"));
        } else {
          callback();
        }
      }
    };

    return {
      choseHcode:0,//选择的房源编号
      choseGcode:0,//选择的客源编号
      fullscreenLoading:false,//创建按钮防抖
      isShowDialog: false,
      dialogType: "",
      loading: false,
      dialogSure: false,
      dialogSuccess:false,
      type: 1,
      //编辑时的合同id
      id: "",
      //创建合同成功后的id
      detailId:'',
      contractForm: {
        type: '',
        signDate: "",
        houseinfoCode: "",
        guestinfoCode: "",
        subscriptionTerm: "",
        subscriptionPrice: "",
        dealPrice: "",
        remarks: "",

        houseInfo: {
          EstateName: "",
          BuildingName: "",
          Unit: "",
          RoomNo: ""
        },
        guestInfo: {
          GuestStoreCode: "",
          GuestStoreName: "",
          EmpCode: "",
          EmpName: ""
        },
        //合同人员相关信息
        contPersons: [
          //业主信息
          {
            name: "",
            encryptionMobile: "",
            // identifyCode: '',
            type: 1
            // relation: ''
          },
          //客户信息
          {
            name: "",
            encryptionMobile: "",
            encryptionCode: "",
            type: 2,
            relation: ""
          }
        ],
        //业主信息
        ownname: "",
        ownmobile: "",
        ownIdentifyCode:"",

        //客户信息
        custname: "",
        custmobile: "",
        custIdentifyCode: ""
      },

      //门店选择列表

      option2: [],
      option3: [],

      // 表单校验规则
      rules: {
        signDate: [
          {
            type: "string",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],

        subscriptionTerm: [
          {
            type: "string",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        subscriptionPrice: [{required: true, validator: checkPrice,trigger:'change' }],
        dealPrice: [{ required: true, validator: checkPrice,trigger:'change' }],
        ownname: [{ required: true, message: "请输入业主姓名",trigger:'change' }],
        ownmobile: [{ validator: telPhone,trigger:'change' }],

        custname: [{ required: true, message: "请输入客户姓名",trigger:'change' }],
        custmobile: [{ validator: telPhone,trigger:'change' }],

        guestinfoCode: [
          { required: true, message: "请选择客源编号", trigger:'change'}
        ],

        custIdentifyCode: [{ required: true,validator: idCard,trigger:'change'}],

        ownIdentifyCode: [{ required: true,validator: idCard,trigger:'change'}]

      },
      hidBtn:'',//隐藏保存按钮
      //权限配置
      power: {
       
        'sign-com-htdetail': {
          state: false,
          name: '合同详情'
        },
        'sign-ht-xq-data-add': {
          state: false,
          name: '编辑资料库'
        },
      }
    };
  },



  components: {
    houseGuest
  },

  computed: {},

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
    // depHandleClick(data) {
    //   // this.getEmploye(data.depId)
    //   this.contractForm.guestInfo.GuestStoreCode=data.depId
    //   this.contractForm.guestInfo.GuestStoreName=data.name
    //   this.contractForm.guestInfo.EmpCode = ''
    //   this.contractForm.guestInfo.EmpName = ''

    //   this.handleNodeClick(data)
    // },

    // clearDep:function () {
    //   this.contractForm.guestInfo.GuestStoreCode=''
    //   this.contractForm.guestInfo.GuestStoreName=''
    //   // this.EmployeList=[]
    //   this.contractForm.guestInfo.EmpCode=''
    //   this.contractForm.guestInfo.EmpName = ''
    //   this.clearSelect()
    // },

    // initDepList:function (val) {
    //   if(!val){
    //     this.remoteMethod()
    //   }
    // },


    cutText(val) {
      // console.log(val)
      if (val === "ownname") {  
         this.$nextTick(() => {
           this.contractForm.ownname = this.$tool.textInput(this.contractForm.ownname);
         })
        
      } else if (val === "custname") {
        this.$nextTick(() => {
         this.contractForm.custname = this.$tool.textInput(this.contractForm.custname);
         })
      }
    },

    cutNumber(val) {
      // console.log(val)
      if (val === "subscriptionPrice") {
        this.$nextTick(() => {
          this.contractForm.subscriptionPrice = this.$tool.cutFloat({
            val: this.contractForm.subscriptionPrice,
            max: 999999999.99
          });
        });
      } else if (val === "dealPrice") {
        this.$nextTick(() => {
          this.contractForm.dealPrice = this.$tool.cutFloat({
            val: this.contractForm.dealPrice,
            max: 999999999.99
          });
        });
      }
    },



    //选择房源弹框
    toLayerHouse() {
      this.isShowDialog = true;
      this.dialogType = "house";
    },
    trim(str){  
      return str.replace(/(^\s*)|(\s*$)/g, "")
    },

    toLayerGuest() {
      this.isShowDialog = true;
      this.dialogType = "guest";
    },

    //根据房源id获取房源信息
    getHousedetail(id) {
      console.log("房源");
      let param = {
        houseId: id
      };
      this.$ajax
        .get("/api/resource/houses/one", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            let houseMsg = res.data;
            console.log(houseMsg);
            this.contractForm.houseinfoCode = houseMsg.PropertyNo; //房源编号
            this.contractForm.houseInfo = houseMsg;

          }
        })
        .catch(error => {
          this.$message({
            message: error
          });
        });
    },

    //根据客源id获取客源信息
    getGuestDetail(id) {
      console.log("客源");
      let param = {
        customerId: id
      };
      this.$ajax
        .get("/api/resource/customers/one", param)
        .then(res => {
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
              type: 2
            };
            this.contractForm.custname = guestMsg.OwnerInfo.CustName;
            this.contractForm.custmobile = guestMsg.OwnerInfo.CustMobile;

            this.$nextTick(function() {    
              if(this.contractForm.guestinfoCode !==''){
                this.$refs.contractForm.validateField('guestinfoCode');
              }
            })
             
            // this.contractForm.custrelation = guestMsg.OwnerInfo.CustRelation;
          }
          // this.getEmployee()
        })
        .catch(error => {
          this.isShowDialog = false;
          this.$message({
            message: error
          });
        });
    },

    //根据合同id查询合同详细信息（编辑接口会用到）
    getContractDetail() {
      let param = {
        id: this.id
      };
      this.$ajax
        .get("/api/contract/detail", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.contractForm = res.data;
            this.contractForm.signDate = res.data.signDate.substr(0, 10);
            this.contractForm.subscriptionTerm = res.data.subscriptionTerm.substr(
              0,
              10
            );
            this.contractForm.type = res.data.contType.value;

            // this.contractForm.guestInfo.GuestStoreName = res.data.guestInfo.GuestStoreName;
            // this.contractForm.guestInfo.GuestStoreCode = res.data.guestInfo.GuestStoreCode;
            // this.contractForm.guestInfo.EmpName = res.data.guestInfo.EmpName;
            // this.contractForm.guestInfo.empId = res.data.guestInfo.EmpCode;

            for (let i = 0; i < res.data.contPersons.length; i++) {
              if (res.data.contPersons[i].personType.value === 1) {
                this.contractForm.contPersons[0].name =
                  res.data.contPersons[i].name;
                this.contractForm.contPersons[0].mobile =
                  res.data.contPersons[i].mobile;
                this.contractForm.contPersons[0].relation =
                  res.data.contPersons[i].relation;
                this.contractForm.contPersons[0].identifyCode =
                  res.data.contPersons[i].identifyCode;
                this.contractForm.contPersons[0].type =
                  res.data.contPersons[i].personType.value;
                this.contractForm.ownname = res.data.contPersons[i].name;
                this.contractForm.ownmobile = res.data.contPersons[i].mobile;
                this.contractForm.ownIdentifyCode = res.data.contPersons[i].identifyCode;
                // this.contractForm.ownrelation = this.contractForm.contPersons[i].relation;
              } else if (
                this.contractForm.contPersons[i].personType.value === 2
              ) {
                this.contractForm.contPersons[1].name =
                  res.data.contPersons[i].name;
                this.contractForm.contPersons[1].mobile =
                  res.data.contPersons[i].mobile;
                this.contractForm.contPersons[1].relation =
                  res.data.contPersons[i].relation;
                (this.contractForm.contPersons[1].identifyCode =
                  res.data.contPersons[i].identifyCode),
                  (this.contractForm.contPersons[1].type =
                    res.data.contPersons[i].personType.value);
                this.contractForm.custname = res.data.contPersons[i].name;
                this.contractForm.custmobile = res.data.contPersons[i].mobile;
                this.contractForm.custIdentifyCode = res.data.contPersons[i].identifyCode;
              }
            }
            
            // this.getEmployee()
          }


        })
        .catch(error => {
          this.$message({
            message: error
          });
        });
    },

    //关闭选择房源客源弹窗
    closeCommission(value,contractForm) {
      if (value) {
        if (value.dialogType === "house") {
          
          this.getHousedetail(value.selectCode);
          this.choseHcode=value.selectCode;
          this.isShowDialog = false;
        } else if (value.dialogType === "guest") {
          
          this.getGuestDetail(value.selectCode);
          this.choseGcode=value.selectCode;
          this.isShowDialog = false;
      
        }
      } else {
        this.isShowDialog = false;
        
      }
    },

    checkRule(contractForm) {
     
      
         
        this.$refs[contractForm].validate(valid => {
          if (valid) {
            let idcard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if(this.contractForm.ownmobile !=='' &&this.contractForm.custmobile !== ''&&((this.contractForm.ownmobile).trim() === (this.contractForm.custmobile).trim())){
              this.$message({
                type: "warning",
                message: "业主手机号和客户手机号不能重复!"
              });
            }
            else if(this.contractForm.custIdentifyCode !=='' &&this.contractForm.ownIdentifyCode !== ''&&((this.contractForm.ownIdentifyCode).trim() === (this.contractForm.custIdentifyCode).trim())){
              this.$message({
                type: "warning",
                message: "业主身份证号和客户身份证号不能重复!"
              });
            }
            else if(this.contractForm.custIdentifyCode == ''){
              this.$message({
                type: "warning",
                message: "客户身份证号不能为空"
              });
            }
            else if(this.contractForm.ownIdentifyCode == ''){
              this.$message({
                type: "warning",
                message: "业主身份证号不能为空"
              });
            }
            else if(!idcard.test(this.contractForm.custIdentifyCode) || !idcard.test(this.contractForm.ownIdentifyCode)){
              this.$message({
                  type: "warning",
                  message: "请输入正确格式的身份证号"
                });
            } 
            else if(this.type===1){
              this.onSubmit1()
            }else if(this.type===2){
              this.onSubmit2()
            }
              return true           
            } else {
              return false;
            }
        })
    
      
    },

    // 新增意向金接口（post）
    onSubmit1() {
      this.dialogSure = false
        this.fullscreenLoading=true
         
        let param = {
          igdCont: {
            type: this.contractForm.type,
            signDate: this.contractForm.signDate,
            houseinfoCode: this.contractForm.houseinfoCode,
            guestinfoCode: this.contractForm.guestinfoCode,
            subscriptionTerm: this.contractForm.subscriptionTerm,
            subscriptionPrice: this.contractForm.subscriptionPrice,
            dealPrice: this.contractForm.dealPrice,
            remarks: this.contractForm.remarks,
            houseInfo:this.contractForm.houseInfo,
            guestInfo:this.contractForm.guestInfo,
            contPersons: [ 
              //业主信息
              {
                name: this.contractForm.ownname,
                encryptionMobile: this.contractForm.ownmobile,
                encryptionCode: this.contractForm.ownIdentifyCode,
                type: 1
              },
              //客户信息
              {
                name: this.contractForm.custname,
                encryptionMobile: this.contractForm.custmobile,
                encryptionCode: this.contractForm.custIdentifyCode,
                type: 2,
               
              }] 
          },
          type: this.type
        };
       
       

        this.$ajax
          .postJSON("/api/contract/addContract", param)
          .then(res => {
            this.fullscreenLoading=false
            let tips = res.data.message;
            if (res.data.status === 200) {
              let contractMsg = res.data.data
              this.hidBtn=1
              localStorage.setItem("contractMsg", JSON.stringify(contractMsg));
              // this.setPath(this.$tool.getRouter(['合同','合同列表','新增合同'],'contractList'));
              this.$router.push({
                path: "/extendParams"
              });
            } else {
              this.fullscreenLoading=false
              this.$message.error(tips);
            }
          })
          .catch(error => {
            this.fullscreenLoading=false
            this.$message({
              message: error,
              type:"error"
            });
          });           
    },
    //创建成功提示
    toUpload(value){//上传合同资料库
      this.dialogSuccess=false;
      if(this.power['sign-com-htdetail'].state){
      if(this.power['sign-ht-xq-data-add'].state){
      this.setPath(this.$tool.getRouter(['合同','合同列表','合同详情'],'contractList'));
      this.$router.replace({
        path: "/detailIntention",
        query: {
          type: "dataBank",
          id: this.detailId,
          contType: this.contractForm.type
        }
      });
      }else{
          this.$message({
            message:'没有资料库权限,无法跳转到资料库'
          });
          this.$router.push('/contractList');
        }
      }else{
        this.$message({
          message:'没有合同详情权限,无法跳转到资料库'
        });
        this.$router.push('/contractList');
      }
    },
    toContract(){//回到合同列表
      this.dialogSuccess=false;
      this.$router.push('/contractList');
    },
    // 编辑意向金接口
    onSubmit2() {    
        this.dialogSure = false
        this.fullscreenLoading=true

        let param = {
          igdCont: this.contractForm,
          type: this.type
        };
        param.igdCont.contPersons[0].name = this.contractForm.ownname;
        param.igdCont.contPersons[0].encryptionMobile = this.contractForm.ownmobile;
        param.igdCont.contPersons[0].identifyCode = this.contractForm.ownIdentifyCode;
        param.igdCont.contPersons[0].encryptionCode = this.contractForm.ownIdentifyCode;
        param.igdCont.contPersons[1].name = this.contractForm.custname;
        param.igdCont.contPersons[1].encryptionMobile = this.contractForm.custmobile;
        param.igdCont.contPersons[1].identifyCode = this.contractForm.custIdentifyCode;
        param.igdCont.contPersons[1].encryptionCode = this.contractForm.custIdentifyCode;
        if (this.$route.query.operateType== 2) {
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
          delete param.igdCont.propertyAddr;
          delete param.igdCont.propertyCard;
          delete param.igdCont.timeUnit;
          delete param.igdCont.moneyUnit;
          delete param.igdCont.createTime;
          delete param.igdCont.updateTime;
          delete param.igdCont.isHavaCooperation;
          delete param.igdCont.extendParams;
          delete param.igdCont.otherCooperationInfo;
          delete param.igdCont.receivableCommission;
          delete param.igdCont.isHaveData;
          delete param.igdCont.toExamineState;
          delete param.igdCont.previewImg;
          delete param.igdCont.isHaveCooperation;
          delete param.igdCont.remarksExamine;
          delete param.igdCont.showCustName;
          delete param.igdCont.showOwnerName;
          delete param.igdCont.distributableAchievement;
          delete param.igdCont.dataType;
          delete param.igdCont.dealAgentId;
          delete param.igdCont.dealAgentName;
          delete param.igdCont.dealAgentStoreId;
          delete param.igdCont.dealAgentStoreName;
          delete param.igdCont.contPersons[0].personType;
          delete param.igdCont.contPersons[0].contractId;
          delete param.igdCont.contPersons[0].createTime;
          delete param.igdCont.contPersons[0].isDel;
          // delete param.igdCont.contPersons[0].pid;
          delete param.igdCont.contPersons[0].propertyRightRatio;
          delete param.igdCont.contPersons[0].uId;
          delete param.igdCont.contPersons[0].updateTime;

          delete param.igdCont.contPersons[1].personType;
          delete param.igdCont.contPersons[1].contractId;
          delete param.igdCont.contPersons[1].createTime;
          delete param.igdCont.contPersons[1].isDel;
          // delete param.igdCont.contPersons[1].pid;
          delete param.igdCont.contPersons[1].propertyRightRatio;
          delete param.igdCont.contPersons[1].uId;
          delete param.igdCont.contPersons[1].updateTime;

          delete param.igdCont.achievementState;
        }
        delete param.igdCont.ownname;
        delete param.igdCont.ownmobile;
        delete param.igdCont.ownIdentifyCode;
        delete param.igdCont.custname;
        delete param.igdCont.custmobile;
        delete param.igdCont.custIdentifyCode;



        this.$ajax
          .postJSON("/api/contract/updateContract", param)
          .then(res => {
            this.fullscreenLoading=false
            let tips = res.data.message;

            if (res.data.status === 200) {
              let contractMsg = res.data.data
              localStorage.setItem("contractMsg", JSON.stringify(contractMsg));
              // this.setPath(this.$tool.getRouter(['合同','合同列表','合同编辑'],'contractList'));
              this.$router.push({
                path: "/extendParams"
              });
            } else {
              this.fullscreenLoading=false
              this.$message.error(tips);
            }
          })
          .catch(error => {
            this.fullscreenLoading=false
            this.$message({
              message: error,
              type:"error"
            });
          });     
    },

  },


  created() {
    // this.remoteMethod()
    // this.getShopList();
    this.contractForm.type = this.$route.query.contType //区分合同类型
   
    //编辑页面刷新时，页面数据会清空，这时获取不了this.$route.query.operateType
    if (this.$route.query.operateType) {
        this.type = this.$route.query.operateType
      if(this.$route.query.operateType ==2 ){
        this.type = this.$route.query.operateType;
        this.id = this.$route.query.id;
        this.getContractDetail();
      }
    }


    

  }
};
</script>

<style lang="less" scoped>


   .myconfirm{
        /deep/.el-dialog{
            width: 420px;
    
            .el-dialog__header {
                border-bottom: 1px solid #edecf0;
                padding: 15px 20px 10px;
            }
            .el-dialog__headerbtn{
                top: 14px;
                font-size: 22px;
            }
            .el-dialog__body{
                text-align: center;
                color: #233241;
                font-size: 16px;
                padding-top: 60px;
                padding-bottom: 26px;
            }
            .el-dialog__footer{
                text-align: center;
                padding: 20px 20px 30px;
            }
            .dialog-footer{
                text-align: center;
                
                .el-button{
                    padding: 11px 30px;
                    border-radius: 30px;
                }
                .el-button+.el-button{
                    margin-left: 16px;
                }
            }
            
        }
    }



#newIntention {
  /deep/.el-input-group__append {
    background-color: transparent;
    border: none;
    color: #ff9039;
  }

  .el-button--text {
    font-weight: 700;
  }
  .fr {
    float: right;
  }
  .mr20 {
    margin-right: 20px;
  }
  .ml30 {
    margin-left: 30px;
  }
  .form-innnerbox {
    background-color: #fff;
    border-radius: 5px;
    overflow-y: auto;
    position: relative;
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 200px;
    }
    .el-input--suffix .el-input__inner {
      padding-right: 15px;
    }
    .form-content {
      padding: 30px 30px 40px 30px;
    }
    .column-form {
      margin-bottom: 30px;
      .column-title {
        font-size: 16px;
        color: #233241;
        margin-bottom: 30px;
        font-weight: bold;
      }
      .form-cont {
        border-bottom: 1px solid #edecf0;
        padding-bottom: 10px;
        .small-input {
          width: 140px;
        }
        .big-input {
          width: 500px;
        }
        .yuan {
          line-height: 40px;
          padding-right: 12px;
        }
        .disb {
          display: block;
        }
        .ownwidth {
          width: 140px;
        }
        .custwidth {
          width: 190px;
        }
        .textareawidth {
          width: 650px;
          height: 120px;
        }
      }
      .mt30 {
        margin-top: 30px;
      }
      .pb30 {
        padding-bottom: 30px;
      }
    }
    
  }
  .textlengthbox {
    position: relative;
  }
  .textLength {
    position: absolute;
    bottom: 0px;
    right: 24px;
    color: #6c7986;
  }
  .form-btn {
    overflow: hidden;
    position: fixed;
    bottom: 50px;
    right: 138px;
    background-color: #fff;
  }
  .select {
    display: inline-block;
    text-align: center;
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
    width: 112px;
    height: 40px;
    line-height: 38px;
    cursor: pointer;
    border-radius: 4px;
  }
  .select_{
    display: inline-block;
    text-align: left;
    color: #409EFF;
    font-weight: bold;
  }
}
</style>


