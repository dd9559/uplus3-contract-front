<template>
  <div class="view-container">
    <el-form :inline="true" :model="contractForm" class="add-form" size="small">
      <!-- 合同信息 -->
      <div class="contractMsg">
        <p>合同信息</p>
        <div class="form-content">
          <el-form-item label="签约日期：" class="form-label width-250">
            <el-date-picker type="date" value-format="yyyy/MM/dd" placeholder="选择日期" v-model="contractForm.signDate" :disabled="type===2?true:false" style="width:140px"></el-date-picker>
          </el-form-item>
          <el-form-item label="合同类型：" class="width-250">
            <el-input placeholder="请输入内容" value="租赁" :disabled="true" style="width:140px" v-if="contractForm.type===1"></el-input>
            <el-input placeholder="请输入内容" value="买卖" :disabled="true" style="width:140px" v-if="contractForm.type===2"></el-input>
            <el-input placeholder="请输入内容" value="代办" :disabled="true" style="width:140px" v-if="contractForm.type===3"></el-input>
          </el-form-item>
          <el-form-item label="成交总价：" class="form-label width-250">
            <el-input v-model="contractForm.dealPrice" maxlength="13" placeholder="请输入内容" style="width:140px"><i slot="suffix" v-if="contractForm.type!=1">元</i></el-input>
          </el-form-item>
          <el-form-item v-if="contractForm.type===1">
            <el-select v-model="contractForm.timeUnit" placeholder="请选择" style="width:90px">
              <el-option v-for="item in dictionary['507']" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <span class="chineseNum">{{contractForm.dealPrice|moneyFormat}}</span>
          </el-form-item>
          <br>
          <el-form-item label="客户保证金：" v-if="contractForm.type===2" class="width-250">
            <el-input v-model="contractForm.custEnsure" maxlength="13" placeholder="请输入内容" :disabled="type===2?true:false" style="width:140px"><i slot="suffix">元</i></el-input>
          </el-form-item>
          <el-form-item label="客户佣金：" class="width-250">
            <el-input v-model="contractForm.custCommission" maxlength="13" placeholder="请输入内容" style="width:140px"><i slot="suffix">元</i></el-input>
          </el-form-item>
          <el-form-item label="业主佣金：" class="width-250">
            <el-input v-model="contractForm.ownerCommission" maxlength="13" placeholder="请输入内容" style="width:140px"><i slot="suffix">元</i></el-input>
          </el-form-item>
          <br>
          <el-form-item label="佣金支付费：" class="width-250">
            <el-input v-model="contractForm.commissionPayment" maxlength="13" placeholder="请输入内容" style="width:140px"><i slot="suffix">元</i></el-input>
          </el-form-item>
          <el-form-item label="交易流程：" class="form-label" style="width:325px;text-align:right">
            <el-select v-model="contractForm.transFlowCode" placeholder="请选择交易流程">
              <el-option v-for="item in transFlowList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <!-- 房源信息 -->
      <div class="houseMsg">
        <p>房源信息</p>
        <div class="form-content">
          <el-form-item label="房源编号：" class="form-label width-250">
            <span class="select" @click="showDialog('house')" v-if="type===1">{{contractForm.houseinfoCode?contractForm.houseinfoCode:'请选择房源'}}</span>
            <span class="select" v-else>{{contractForm.houseinfoCode}}</span>
          </el-form-item>
          <el-form-item label="物业地址：" class="form-label" style="width:605px;text-align:right">
            <el-input placeholder="" v-model="contractForm.houseInfo.Address" :disabled="true" class="address">
            </el-input>
          </el-form-item>
          <br>
          <el-form-item label="建筑面积：" class="width-250">
            <el-input v-model="contractForm.houseInfo.Square" placeholder="请输入内容" :disabled="type===2?true:false" style="width:140px"><i slot="suffix">㎡</i></el-input>
          </el-form-item>
          <el-form-item label="套内面积：" class="width-250">
            <el-input v-model="contractForm.houseInfo.SquareUse" placeholder="请输入内容" :disabled="type===2?true:false" style="width:140px"><i slot="suffix">㎡</i></el-input>
          </el-form-item>
          <el-form-item label="房源方门店：" class="form-label" style="width:320px;text-align:right">
            <el-select v-model="contractForm.houseInfo.HouseStoreCode" :multiple='false' clearable filterable remote reserve-keyword @change="getShop" placeholder="部门" :remote-method="remoteMethod" :loading="loading">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <!-- <el-input v-model="contractForm.houseInfo.HouseStoreName"></el-input> -->
            <!-- <el-select v-model="contractForm.houseInfo.houseStoreName" placeholder="请选择状态">
              <el-option label="光谷一店" value="1"></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="店长：">
            {{contractForm.houseInfo.ShopOwnerName}} {{contractForm.houseInfo.ShopOwnerMobile}}
          </el-form-item>
          <br v-if="contractForm.type===2">
          <el-form-item label="产权状态：" v-if="contractForm.type===2" class="width-250">
            <el-select v-model="contractForm.houseInfo.propertyRightStatus" placeholder="请选择状态" :disabled="type===2?true:false" style="width:140px">
              <el-option v-for="item in dictionary['514']" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="按揭银行：" v-if="contractForm.type===2" class="width-250">
            <el-select v-model="contractForm.houseInfo.stagesBankName" placeholder="请选择银行" :disabled="type===2?true:false" style="width:140px">
              <el-option label="中国工商银行" value="中国工商银行"></el-option>
              <el-option label="中国建设银行" value="中国建设银行"></el-option>
              <el-option label="中国银行" value="中国银行"></el-option>
              <el-option label="中国农业银行" value="中国农业银行"></el-option>
              <el-option label="交通银行" value="交通银行"></el-option>
              <el-option label="招商银行" value="招商银行"></el-option>
              <el-option label="中信银行" value="中信银行"></el-option>
              <el-option label="中国民生银行" value="中国民生银行"></el-option>
              <el-option label="兴业银行" value="兴业银行"></el-option>
              <el-option label="上海浦东发展银行" value="上海浦东发展银行"></el-option>
              <el-option label="中国邮政储蓄银行" value="中国邮政储蓄银行"></el-option>
              <el-option label="中国光大银行" value="中国光大银行"></el-option>
              <el-option label="平安银行" value="平安银行"></el-option>
              <el-option label="华夏银行" value="华夏银行"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="按揭欠款：" v-if="contractForm.type===2" class="width-250">
            <el-input v-model="contractForm.houseInfo.stagesArrears" placeholder="请输入内容" :disabled="type===2?true:false" style="width:140px"><i slot="suffix">元</i></el-input>
          </el-form-item>
          <br v-if="contractForm.type===2">
          <el-form-item label="产权地址：" v-if="contractForm.type===2" style="width:535px;text-align:right">
            <el-input v-model="contractForm.houseInfo.propertyRightAddr" placeholder="请输入内容" style="width:430px"></el-input>
          </el-form-item>
          <el-form-item label="房产证号：" v-if="contractForm.type===2">
            <el-input v-model="contractForm.propertyCard" placeholder="请输入内容" :disabled="type===2?true:false" style="width:200px"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="业主信息：" class="form-label" style="padding-left:18px">
            <ul class="peopleMsg">
              <li v-for="(item,index) in ownerList" :key="index" v-if="item.type===1">
                <span class="merge">
                  <input v-model="item.name" placeholder="姓名" class="name_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}">
                  <input v-model="item.mobile" type="tel" maxlength="11" placeholder="电话" class="mobile_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}">
                </span>
                <el-select v-model="item.relation" placeholder="关系" class="relation_" :disabled="type===2&&!item.edit?true:false">
                  <el-option v-for="item in relationList" :key="item.key" :label="item.value" :value="item.value">
                  </el-option>
                </el-select>
                <el-input v-model="item.propertyRightRatio" placeholder="产权比" class="rate_" :disabled="type===2&&!item.edit?true:false"><i slot="suffix">%</i></el-input>
                <input v-model="item.identifyCode" type="text" maxlength="18" placeholder="身份证号" class="idCard_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}">
                <span @click.stop="addcommissionData" class="icon">
                  <i class="iconfont icon-tubiao_shiyong-14"></i>
                </span>
                <span @click.stop="deleteRowcommissionData(index)" v-if="ownerList.length>1" class="icon">
                  <i class="iconfont icon-tubiao_shiyong-4"></i>
                </span>
              </li>
            </ul>
          </el-form-item>
        </div>
      </div>
      <!-- 客源信息 -->
      <div class="houseMsg">
        <p>客源信息</p>
        <div class="form-content">
          <el-form-item label="客源编号：" class="form-label width-250">
            <span class="select" @click="showDialog('guest')" v-if="type===1">{{contractForm.guestinfoCode?contractForm.guestinfoCode:'请选择客源'}}</span>
            <span class="select" v-else>{{contractForm.guestinfoCode}}</span>
          </el-form-item>
          <el-form-item label="付款方式：" class="form-label">
            <el-select v-model="contractForm.guestInfo.paymentMethod" placeholder="请选择状态" :disabled="type===2?true:false" style="width:140px">
              <el-option v-for="item in dictionary['556']" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客源方门店：" class="form-label">
            <el-select v-model="contractForm.guestInfo.GuestStoreCode" :multiple='false' clearable filterable remote reserve-keyword @change="getShop_" placeholder="部门" :remote-method="remoteMethod_" :loading="loading">
              <el-option v-for="item in options_" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="店长：">
            {{contractForm.guestInfo.ShopOwnerName}}{{contractForm.guestInfo.ShopOwnerMobile}}
          </el-form-item>
          <br>
          <el-form-item label="客户信息：" class="form-label" style="padding-left:18px">
            <ul class="peopleMsg">
              <li v-for="(item,index) in guestList" :key="index" v-if="item.type===2">
                <span class="merge">
                  <input v-model="item.name" placeholder="姓名" class="name_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}">
                  <input v-model="item.mobile" type="tel" maxlength="11" placeholder="电话" class="mobile_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}">
                </span>
                <el-select v-model="item.relation" placeholder="关系" class="relation_" :disabled="type===2&&!item.edit?true:false">
                  <el-option v-for="item in relationList" :key="item.key" :label="item.value" :value="item.value">
                  </el-option>
                </el-select>
                <el-input v-model="item.propertyRightRatio" placeholder="产权比" class="rate_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}"><i slot="suffix">%</i></el-input>
                <input v-model="item.identifyCode" maxlength="18" type="text" placeholder="身份证号" class="idCard_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}">
                <span @click.stop="addcommissionData1" class="icon">
                  <i class="iconfont icon-tubiao_shiyong-14"></i>
                </span>
                <span @click.stop="deleteRowcommissionData1(index)" v-if="guestList.length>1" class="icon">
                  <i class="iconfont icon-tubiao_shiyong-4"></i>
                </span>
              </li>
            </ul>
          </el-form-item>
        </div>
      </div>
      <!-- 三方合作 -->
      <div class="houseMsg">
        <p @click="toCooperation" class="thirdParty">三方合作 <span class="attention iconfont icon-tubiao-10" :class="{'attention_':cooperation}"></span></p>
        <div class="cooperation">
          <div v-show="cooperation">
            <el-form-item label="扣合作费：" class="width-250">
              <el-input v-model="contractForm.otherCooperationCost" placeholder="请输入内容" style="width:140px"></el-input>
            </el-form-item>
            <el-form-item label="类型：" class="width-250">
              <el-select v-model="contractForm.otherCooperationInfo.type" placeholder="请选择" style="width:140px">
                <el-option v-for="item in dictionary['517']" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <br>
            <el-form-item label="合作方姓名：" class="width-250">
              <el-input v-model="contractForm.otherCooperationInfo.name" placeholder="请输入内容" style="width:140px"></el-input>
            </el-form-item>
            <el-form-item label="联系方式：" class="width-250">
              <el-input v-model="contractForm.otherCooperationInfo.mobile" placeholder="请输入内容" style="width:140px"></el-input>
            </el-form-item>
            <el-form-item label="身份证号：" style="width:300px;text-align:right">
              <el-input v-model="contractForm.otherCooperationInfo.identifyCode" placeholder="请输入内容"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="备注：" style="padding-left:51px">
              <el-input type="textarea" :rows="4" resize='none' v-model="contractForm.otherCooperationInfo.remarks" placeholder="无备注内容"></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="houseMsg">
        <p>扩展参数</p>
        <div class="form-content">
          <ul class="parameter">
            <li v-for="item in parameterList" :key="item.id">
              <span class="title" :class="{'form-label':item.isRequired}">{{item.name+':'}}</span>
              <!-- class="form-label" -->
              <!-- 输入框 -->
              <el-input v-model="contractForm.extendParams[item.name]" placeholder="请输入内容" style="width:140px" v-if="item.inputType.value===1" size="small"></el-input>
              <!-- 下拉框 -->
              <el-select v-model="contractForm.extendParams[item.name]" placeholder="请选择" style="width:140px" v-if="item.inputType.value===2" size="small">
                <el-option v-for="item_ in item.options" :key="item_" :label="item_" :value="item_">
                </el-option>
              </el-select>
              <span class="unit">{{item.unit}}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="btn">
        <div>
          <div v-if="type===2">
            <p><span>录入时间：</span>{{contractForm.createTime|formatTime}}</p>
            <p><span>录入人：</span>{{contractForm.dealAgentStoreName}}-{{contractForm.dealAgentName}}</p>
            <p><span>最后修改：</span>{{contractForm.updateTime|formatTime}}</p>
          </div>
        </div>
        <div>
          <!-- <el-button round>预览</el-button> -->
          <el-button type="success" round @click="isSave(1)">提交审核</el-button>
          <el-button type="primary" round @click="isSave(0)">保存</el-button>
        </div>
      </div>
    </el-form>

    <!-- 房源客源弹窗 -->
    <houseGuest :dialogType="dialogType" :dialogVisible="isShowDialog" :contractType="contractType" @closeHouseGuest="closeHouseGuest" v-if="isShowDialog">
    </houseGuest>
    <!-- 保存合同确认框 -->
    <el-dialog title="提示" :visible.sync="dialogSave" width="460px">
      <span>确定保存已创建合同？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSave = false">取 消</el-button>
        <el-button type="primary" @click="saveCont">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
           
<script>
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
import houseGuest from "../contractDialog/houseGuest";
const rule = {
  signDate: {
    name: "签约日期"
  },
  dealPrice: {
    name: "成交总价",
    type: "money"
  },
  transFlowCode: {
    name: "交易流程"
  },
  houseinfoCode: {
    name: "房源"
  },
  guestinfoCode: {
    name: "客源"
  },
  name: {
    name: "姓名"
  },
  mobile: {
    name: "电话号码",
    type: "mobile"
  },
  relation: {
    name: "关系"
  },
  propertyRightRatio: {
    name: "产权比"
  },
  identifyCode: {
    name: "身份证号",
    type: "idCard"
  }
};

export default {
  mixins: [MIXINS],
  components: {
    houseGuest
  },
  data() {
    return {
      contractForm: {
        // type: 2,
        houseinfoCode: "",
        guestinfoCode: "",
        signDate: "",
        transFlowCode: "",
        // custCommission: "161.00",
        // ownerCommission: "109.00",
        // commissionPayment: "28.00",
        // otherCooperationCost: "27.00",
        // timeUnit: 1,
        dealPrice: "",
        contPersons: [],
        houseInfo: {
          HouseStoreCode: ""
        },
        guestInfo: {},
        otherCooperationInfo: {},
        extendParams:{},
        isHavaCooperation: 0
      },
      //业主信息
      ownerList: [
        {
          type: 1,
          identifyCode: "",
          mobile: "",
          relation: "",
          name: "",
          propertyRightRatio: ""
        }
      ],
      //客户信息
      guestList: [
        {
          type: 2,
          identifyCode: "",
          mobile: "",
          relation: "",
          name: "",
          propertyRightRatio: ""
        }
      ],
      dialogType: "",
      isShowDialog: false,
      dialogSave: false,
      //三方合作
      cooperation: false,
      //操作类型  默认是添加
      type: 1,
      dictionary: {
        //数据字典
        "514": "", //产权状态
        "507": "", //时间单位
        "517": "", //第三方合作类型
        "12": "", //第三方合作类型
        "556": "" //付款方式
      },
      transFlowList: [],
      contractType: "",
      loading: false,
      //门店选择列表
      options: [],
      options_: [],
      //人员关系列表
      relationList: [],
      //编辑时的合同id
      id:'',
      //扩展参数类型
      parameterList:[],
      //扩展参数验证
      parameterRule:{}
    };
  },
  created() {
    this.contractForm.type = Number(this.$route.query.type);
    if (this.$route.query.operateType) {
      this.type = this.$route.query.operateType;
      if (this.type === 2) {
        this.id=this.$route.query.id
        this.getContractDetail();
      }
    }
    this.getDictionary();
    this.getTransFlow();
    this.getRelation();
    this.getExtendParams();//扩展参数
  },
  methods: {
    addcommissionData() {
      if (this.ownerList.length < 5) {
        this.ownerList.push({
          edit: true,
          type: 1,
          identifyCode: "",
          mobile: "",
          relation: "",
          name: "",
          propertyRightRatio: ""
        });
      } else {
        this.$message({
          message: "已达到最大数量",
          type: "warning"
        });
      }
    },
    deleteRowcommissionData(index) {
      this.ownerList.splice(index, 1);
    },
    addcommissionData1() {
      if (this.guestList.length < 5) {
        this.guestList.push({
          edit: true,
          type: 2,
          identifyCode: "",
          mobile: "",
          relation: "",
          name: "",
          propertyRightRatio: ""
        });
      } else {
        this.$message({
          message: "已达到最大数量",
          type: "warning"
        });
      }
    },
    deleteRowcommissionData1(index) {
      this.guestList.splice(index, 1);
    },
    toCooperation() {
      this.cooperation = !this.cooperation;
      if (this.contractForm.isHavaCooperation) {
        this.contractForm.isHavaCooperation = 0;
      } else {
        this.contractForm.isHavaCooperation = 1;
      }
    },
    //获取合同扩展参数
    getExtendParams(){
      let param = {
        type:Number(this.$route.query.type)
      }
      this.$ajax.get('/api/contract/getExtendParamsByType', param).then(res=>{
        res=res.data;
        if(res.status===200){
          this.parameterList=res.data;
          res.data.forEach(element => {
            if(element.isRequired){
              let name_ = element.name;
              //console.log(name_);
              this.parameterRule[name_]={name:element.name};
              if(this.type===1){
                // this.contractForm.extendParams[name_]='';
                this.$set(this.contractForm.extendParams,name_,'')
              }
            }
          });
        }
      })
    },
    //验证合同信息
    isSave(value) {
      this.contractForm.haveExamine=value;
      //验证合同信息
      this.$tool.checkForm(this.contractForm, rule).then(() => {
          // debugger
          if (
            this.contractForm.custCommission > 0 ||
            this.contractForm.ownerCommission > 0
          ) {
            if (this.contractForm.houseInfo.HouseStoreCode) {
              //业主产权比
              let ownerRightRatio = 0;

              let isOk;
              this.ownerList.forEach(element => {
                isOk = false;
                if (element.name) {
                  if (element.mobile.length === 11) {
                    if (element.relation) {
                      if (element.propertyRightRatio) {
                        if (element.identifyCode) {
                          isOk = true;
                          ownerRightRatio += element.propertyRightRatio - 0;
                        } else {
                          this.$message({
                            message: "身份证号不正确"
                          });
                        }
                      } else {
                        this.$message({
                          message: "产权比不能为空"
                        });
                      }
                    } else {
                      this.$message({
                        message: "关系不能为空"
                      });
                    }
                  } else {
                    this.$message({
                      message: "电话号码不正确"
                    });
                  }
                } else {
                  this.$message({
                    message: "姓名不能为空"
                  });
                }
              });
              if (isOk) {
                console.log(ownerRightRatio);
                if (ownerRightRatio === 100) {
                  if (this.contractForm.guestInfo.paymentMethod) {
                    if (this.contractForm.guestInfo.GuestStoreCode) {
                      //客户产权比
                      let guestRightRatio = 0;
                      let isOk_;
                      this.guestList.forEach(element => {
                        isOk_ = false;
                        if (element.name) {
                          if (element.mobile.length === 11) {
                            if (element.relation) {
                              if (element.propertyRightRatio) {
                                if (element.identifyCode) {
                                  isOk_ = true;
                                  guestRightRatio +=
                                    element.propertyRightRatio - 0;
                                } else {
                                  this.$message({
                                    message: "身份证号不正确"
                                  });
                                }
                              } else {
                                this.$message({
                                  message: "产权比不能为空"
                                });
                              }
                            } else {
                              this.$message({
                                message: "关系不能为空"
                              });
                            }
                          } else {
                            this.$message({
                              message: "电话号码不正确"
                            });
                          }
                        } else {
                          this.$message({
                            message: "姓名不能为空"
                          });
                        }
                      });
                      if (isOk_) {
                        console.log(guestRightRatio);
                        if (guestRightRatio === 100) {
                          this.$tool.checkForm(this.contractForm.extendParams, this.parameterRule).then(() => {
                            this.dialogSave = true;
                          }).catch(error => {
                              this.$message({
                                message: `${error.title}${error.msg}`
                              });
                            });
                          //this.dialogSave = true;
                        } else {
                          this.$message({
                            message: "客户产权比和必须为100%"
                          });
                        }
                      }
                    } else {
                      this.$message({
                        message: "客源方门店不能为空"
                      });
                    }
                  } else {
                    this.$message({
                      message: "付款方式不能为空"
                    });
                  }
                } else {
                  this.$message({
                    message: "业主产权比和必须为100%"
                  });
                }
              }
            } else {
              this.$message({
                message: "房源方门店不能为空"
              });
            }
          } else {
            this.$message({
              message: "佣金不能为零"
            });
          }
        })
        .catch(error => {
          this.$message({
            message: `${error.title}${error.msg}`
          });
        });
    },
    saveCont() {
      this.addContract()
    },
    /* 新增/编辑合同 */
    addContract() {
      //debugger
      this.contractForm.contPersons=[]
      this.ownerList.forEach(element => {
        console.log("22");
        this.contractForm.contPersons.push(element);
      });
      this.guestList.forEach(element => {
        console.log("11");
        this.contractForm.contPersons.push(element);
      });
      /* 新增/编辑租赁合同 */
      if (this.contractForm.type === 1) {
        let param = {
          leaseCont: this.contractForm,
          type: this.type
        };
        if(this.type===2){
          delete param.leaseCont.contChangeState;
          delete param.leaseCont.contState;
          delete param.leaseCont.contType;
          delete param.leaseCont.laterStageState;
          delete param.leaseCont.toExamineState;
          delete param.leaseCont.previewImg;
          delete param.leaseCont.updateTimes;
          delete param.leaseCont.propertyRightRatios;
          delete param.leaseCont.pids;
          delete param.leaseCont.pmobiles;
          delete param.leaseCont.pnames;
        }
        console.log(param);
        this.$ajax.postJSON("/api/contract/editLeaseCont", param).then(res => {
          res = res.data;
          if (res.status === 200) {
            this.dialogSave=false
            this.$message({
              message: "操作成功",
              type: "success"
            });
          }
        });
      }
      /* 新增/编辑买卖合同 */
      if (this.contractForm.type === 2 || this.contractForm.type === 3) {
        let param = {
          saleCont: this.contractForm,
          type: this.type
        };
        if(this.type===2){
          delete param.saleCont.contChangeState;
          delete param.saleCont.contState;
          delete param.saleCont.contType;
          delete param.saleCont.laterStageState;
          delete param.saleCont.toExamineState;
          delete param.saleCont.previewImg;
          delete param.saleCont.subscriptionTerm;
          delete param.saleCont.updateTime;
          param.saleCont.signDate=param.saleCont.signDate.replace(/-/g,"/");  
        }

        this.$ajax.postJSON("/api/contract/editSaleCont", param).then(res => {
          res = res.data;
          if (res.status === 200) {
            this.dialogSave=false
            this.$message({
              message: "操作成功",
              type: "success"
            });
          }
        });
      }
    },
    //获取所在城市的交易类型
    getTransFlow() {
      this.$ajax.get("/api/contract/getTransFlowListByCity").then(res => {
        res = res.data;
        if (res.status === 200) {
          console.log(res.data);
          this.transFlowList = res.data;
        }
      });
    },
    //获取所在城市的人员关系
    getRelation() {
      let param = {
        type: "Relation"
      };
      this.$ajax.get("/api/dictionary/uplus", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.relationList = res.data;
        }
      });
    },
    //房源客源弹窗
    showDialog(value) {
      if (this.contractForm.type === 1) {
        this.contractType = "求租";
      } else {
        this.contractType = "求购";
      }
      this.isShowDialog = true;
      this.dialogType = value;
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
          this.ownerList[0] = {
            name: houseMsg.OwnerInfo.OwnerName,
            mobile: houseMsg.OwnerInfo.OwnerMobile,
            type: 1,
            relation: houseMsg.OwnerInfo.Relation
          };
          this.options.push({
            name: houseMsg.HouseStoreName,
            id: houseMsg.HouseStoreCode
          });
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
          this.guestList[0] = {
            name: guestMsg.OwnerInfo.CustName,
            mobile: guestMsg.OwnerInfo.CustMobile,
            type: 2,
            relation: guestMsg.OwnerInfo.CustRelation
          };
          this.options_.push({
            name: guestMsg.GuestStoreName,
            id: guestMsg.GuestStoreCode
          });
        }
      });
    },
    //关闭房源客源弹窗
    closeHouseGuest(value) {
      console.log(value);
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
    //获取门店
    getShopList(value,type) {
      let param = {
        keyword: value
      };
      this.$ajax.get("/api/contract/getDepsByCityId", param).then(res => {
        this.loading = false;
        res = res.data;
        if (res.status === 200) {
          if(type === "house"){
            this.options=res.data
          }else if(type === "guest"){
            this.options_=res.data
          }
          // res.data.forEach(element => {
          //   if (type === "house") {
          //     this.options.push(element);
          //   } else if (type === "guest") {
          //     this.options_.push(element);
          //   }
          // });
        }
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        this.getShopList(query,'house');
      }
    },
    remoteMethod_(query) {
      if (query !== "") {
        this.loading = true;
        this.getShopList(query,'guest');
      }
    },
    getShop(id) {
      console.log(id);
      this.options.forEach(element => {
        if(element.id===id){
          this.contractForm.houseInfo.HouseStoreName=element.name
        }
      });
      if(id){
        let param = {
          depId: id,
          briefInfo:false,
          roleId:2
        };
        this.$ajax.get('/api/organize/employees', param).then(res=>{
          res=res.data  
          if(res.status===200){
            this.contractForm.houseInfo.ShopOwnerName=res.data[0].name;
            this.contractForm.houseInfo.ShopOwnerMobile=res.data[0].mobile;
          }
        })
      }
    },
    getShop_(id) {
      console.log(id);
      this.options.forEach(element => {
        if(element.id===id){
          this.contractForm.guestInfo.GuestStoreName=element.name
        }
      });
      let param = {
        depId: id
      };
      // this.$ajax.get('/api/organize/employees', param).then(res=>{
      //   res=res.data
      //   if(res.status===200){

      //   }
      // })
    },
    //获取合同信息
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
          this.contractForm.extendParams=JSON.parse(res.data.extendParams);
          this.options.push({id:res.data.houseInfo.HouseStoreCode,name:res.data.houseInfo.HouseStoreName});
          this.options_.push({id:res.data.guestInfo.GuestStoreCode,name:res.data.guestInfo.GuestStoreName});
          if(res.data.isHavaCooperation){
            this.cooperation=true
          }
          this.ownerList=[];
          this.guestList=[];
          for (var i = 0; i < this.contractForm.contPersons.length; i++) {
            if (this.contractForm.contPersons[i].personType.value === 1) {
              // this.ownerList[0].name = this.contractForm.contPersons[i].name;
              // this.ownerList[0].mobile = this.contractForm.contPersons[i].mobile;
              // this.ownerList[0].relation = this.contractForm.contPersons[i].relation;
              // this.ownerList[0].propertyRightRatio = this.contractForm.contPersons[i].propertyRightRatio;
              // this.ownerList[0].identifyCode = this.contractForm.contPersons[i].identifyCode;
              this.ownerList.push({
                name:this.contractForm.contPersons[i].name,
                mobile:this.contractForm.contPersons[i].mobile,
                relation:this.contractForm.contPersons[i].relation,
                propertyRightRatio:this.contractForm.contPersons[i].propertyRightRatio,
                identifyCode:this.contractForm.contPersons[i].identifyCode,
                type:1,
              });
            } else if (this.contractForm.contPersons[i].personType.value === 2) {
              // this.guestList[0].name = this.contractForm.contPersons[i].name;
              // this.guestList[0].mobile = this.contractForm.contPersons[i].mobile;
              // this.guestList[0].relation = this.contractForm.contPersons[i].relation;
              // this.guestList[0].propertyRightRatio = this.contractForm.contPersons[i].propertyRightRatio;
              // this.guestList[0].identifyCode = this.contractForm.contPersons[i].identifyCode;
              this.guestList.push({
                name:this.contractForm.contPersons[i].name,
                mobile:this.contractForm.contPersons[i].mobile,
                relation:this.contractForm.contPersons[i].relation,
                propertyRightRatio:this.contractForm.contPersons[i].propertyRightRatio,
                identifyCode:this.contractForm.contPersons[i].identifyCode,
                type:2,
              });
            }
          }
        }
      });
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
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.view-container {
  padding: 0 20px 20px 0;
  .add-form {
    padding: 10px;
    font-size: 14px;
    background: @bg-white;
  }
}
/deep/.form-label {
    position: relative;
    &:before {
      content: '*';
      display: inline-block;
      color: red;
    }
  }
.contractMsg {
  border-bottom: 1px solid @border-ED;
  > p {
    padding-bottom: 10px;
    padding-left: 20px;
    font-size: 14px;
    font-weight: bold;
  }
  .form-content {
    padding-left: 30px;
    .sxf_1 {
      width: 100px;
    }
    .sxf_2 {
      width: 80px;
    }
    .sxf_3 {
      width: 80px;
    }
    .chineseNum {
      padding-left: 10px;
      color: @color-orange;
      font-size: 14px;
    }
  }
}
.houseMsg {
  border-bottom: 1px solid @border-ED;
  > p {
    padding: 20px 0 10px 20px;
    font-size: 14px;
    font-weight: bold;
  }
  .thirdParty {
    display: inline-block;
    .attention {
      color: #ccc;
      font-weight: normal;
    }
    .attention_ {
      color: @color-blue;
    }
  }
  .form-content {
    padding-left: 30px;
    .select {
      display: inline-block;
      text-align: center;
      color: @color-white;
      width: 140px;
      padding: 2px 0;
      background: @color-blue;
      border-radius: 2px;
    }
    .address {
      width: 500px;
    }
    .parameter{
      display: flex;
      width: 800px;
      flex-wrap:wrap;
      padding-bottom: 10px;
      li{
        display: flex;
        height: 50px;
        width: 250px;
        line-height: 50px;
        > .title{
          width: 130px;
          text-align: right;
          padding-right: 10px;
          color: #606266;
        }
        > .unit{
          width: 40px;
          padding-left: 10px;
          color: #606266;
        }
      }
    }
  }
  .cooperation {
    height: 196px;
    padding-left: 30px;
    /deep/.el-textarea__inner {
      width: 600px;
      min-height: 200px;
    }
  }
  .peopleMsg {
    li {
      font-size: 14px;
      margin-bottom: 10px;
      .merge {
        border: 1px solid #dcdfe6;
        padding: 7px 0;
        border-radius: 3px;
      }
      input {
        padding: 6px 0;
        color: #606266;
      }
    }
    .name_ {
      width: 60px;
      padding-left: 5px;
      border: none;
      border-right: 1px solid #dcdfe6;
    }
    .disabled {
      background-color: #f5f7fa;
    }
    .mobile_ {
      width: 100px;
      border: none;
      margin-left: -4px;
      padding-left: 2px;
    }
    .rate_ {
      width: 90px;
    }
    .idCard_ {
      width: 160px;
      padding: 7px 5px;
      padding-left: 5px;
      border: 1px solid #dcdfe6;
      border-radius: 3px;
    }
    .relation_ {
      width: 80px;
    }
    .icon {
      display: inline-block;
      .icon-tubiao_shiyong-14 {
        font-size: 22px;
        color: @color-blue;
      }
      .icon-tubiao_shiyong-4{
        font-size: 22px;
        color: @color-FF5;
      }
    }
  }
}
.width-250{
  width: 245px;
  text-align: right;
}
.btn {
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  p {
    color: @color-6c;
    display: inline-block;
    padding-right: 20px;
    font-size: 12px;
  }
}
</style>