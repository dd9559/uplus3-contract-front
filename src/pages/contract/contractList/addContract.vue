<template>
  <div class="view-container">
    <el-form :inline="true" :model="contractForm" class="add-form" size="mini">
      <!-- 合同信息 -->
      <div class="contractMsg">
        <p>合同信息</p>
        <div class="form-content">
          <el-form-item label="签约日期：" class="form-label">
            <el-date-picker type="date" value-format="yyyy/MM/dd" placeholder="选择日期" v-model="contractForm.signDate" :disabled="type===2?true:false" style="width:140px"></el-date-picker>
          </el-form-item>
          <el-form-item label="合同类型：">
            <el-input placeholder="请输入内容" :value="contractForm.type===1?'租赁':'买卖'" :disabled="true" style="width:140px"></el-input>
          </el-form-item>
          <el-form-item label="成交总价：" class="form-label">
            <el-input v-model="contractForm.dealPrice" placeholder="请输入内容" style="width:140px"><i slot="suffix">元</i></el-input>
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
          <el-form-item label="客户保证金：" v-if="contractForm.type===2">
            <el-input v-model="contractForm.custEnsure" placeholder="请输入内容" :disabled="type===2?true:false" style="width:140px"><i slot="suffix">元</i></el-input>
          </el-form-item>
          <el-form-item label="客户佣金：">
            <el-input v-model="contractForm.custCommission" placeholder="请输入内容" style="width:140px"><i slot="suffix">元</i></el-input>
          </el-form-item>
          <el-form-item label="业主佣金：">
            <el-input v-model="contractForm.ownerCommission" placeholder="请输入内容" style="width:140px"><i slot="suffix">元</i></el-input>
          </el-form-item>
          <br>
          <el-form-item label="佣金支付费：">
            <el-input v-model="contractForm.commissionPayment" placeholder="请输入内容" style="width:140px"><i slot="suffix">元</i></el-input>
          </el-form-item>
          <el-form-item label="交易流程：" v-if="contractForm.type===2" class="form-label">
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
          <el-form-item label="房源编号：" class="form-label">
            <span class="select" @click="showDialog('house')" v-if="type===1">{{contractForm.houseinfoCode?contractForm.houseinfoCode:'请选择房源'}}</span>
            <span class="select" v-else>{{contractForm.houseinfoCode}}</span>
          </el-form-item>
          <el-form-item label="物业地址：" class="form-label">
            <el-input placeholder="请输入内容" v-model="contractForm.houseInfo.Address" :disabled="true" class="address">
            </el-input>
          </el-form-item>
          <br>
          <el-form-item label="建筑面积：">
            <el-input v-model="contractForm.houseInfo.Square" placeholder="请输入内容" :disabled="type===2?true:false" style="width:140px"><i slot="suffix">㎡</i></el-input>
          </el-form-item>
          <el-form-item label="套内面积：">
            <el-input v-model="contractForm.houseInfo.SquareUse" placeholder="请输入内容" :disabled="type===2?true:false" style="width:140px"><i slot="suffix">㎡</i></el-input>
          </el-form-item>
          <el-form-item label="房源方门店：" class="form-label">
            <el-select v-model="contractForm.houseInfo.houseStoreName" placeholder="请选择状态">
              <el-option label="光谷一店" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="店长：">
            {{contractForm.houseInfo.ShopOwnerName}} {{contractForm.houseInfo.ShopOwnerMobile}}
          </el-form-item>
          <br v-if="contractForm.type===2">
          <el-form-item label="产权状态：" v-if="contractForm.type===2">
            <el-select v-model="contractForm.houseInfo.propertyRightStatus" placeholder="请选择状态" :disabled="type===2?true:false" style="width:140px">
              <el-option v-for="item in dictionary['514']" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="按揭银行：" v-if="contractForm.type===2">
            <el-select v-model="contractForm.houseInfo.stagesBankName" placeholder="请选择银行" :disabled="type===2?true:false" style="width:140px">
              <el-option label="中国工商银行" value="1"></el-option>
              <el-option label="中国建设银行" value="2"></el-option>
              <el-option label="中国银行" value="3"></el-option>
              <el-option label="中国农业银行" value="4"></el-option>
              <el-option label="交通银行" value="5"></el-option>
              <el-option label="招商银行" value="6"></el-option>
              <el-option label="中信银行" value="7"></el-option>
              <el-option label="中国民生银行" value="8"></el-option>
              <el-option label="兴业银行" value="9"></el-option>
              <el-option label="上海浦东发展银行" value="10"></el-option>
              <el-option label="中国邮政储蓄银行" value="11"></el-option>
              <el-option label="中国光大银行" value="12"></el-option>
              <el-option label="平安银行" value="13"></el-option>
              <el-option label="华夏银行" value="14"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="按揭欠款：" v-if="contractForm.type===2">
            <el-input v-model="contractForm.houseInfo.stagesArrears" placeholder="请输入内容" :disabled="type===2?true:false" style="width:140px"><i slot="suffix">元</i></el-input>
          </el-form-item>
          <br v-if="contractForm.type===2">
          <el-form-item label="产权地址：" v-if="contractForm.type===2">
            <el-input v-model="contractForm.houseInfo.propertyRightAddr" placeholder="请输入内容" :disabled="type===2?true:false" style="width:430px"></el-input>
          </el-form-item>
          <el-form-item label="房产证号：" v-if="contractForm.type===2">
            <el-input v-model="contractForm.propertyCard" placeholder="请输入内容" :disabled="type===2?true:false" style="width:200px"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="业主信息：" class="form-label">
            <ul class="peopleMsg">
              <li v-for="(item,index) in ownerList" :key="index" v-if="item.type===1">
                <span class="merge">
                  <input v-model="item.name" placeholder="姓名" class="name_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}">
                  <input v-model="item.mobile" placeholder="电话" class="mobile_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}">
                </span>
                <el-select v-model="item.relation" placeholder="关系" class="relation_" :disabled="type===2&&!item.edit?true:false">
                  <el-option label="本人" value="1"></el-option>
                </el-select>
                <el-input v-model="item.propertyRightRatio" placeholder="产权比" class="rate_" :disabled="type===2&&!item.edit?true:false"><i slot="suffix">%</i></el-input>
                <input v-model="item.identifyCode" placeholder="身份证号" class="idCard_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}">
                <span @click.stop="addcommissionData" class="icon">
                  <i class="el-icon-plus"></i>
                </span>
                <span @click.stop="deleteRowcommissionData(index)" v-if="ownerList.length>1" class="icon delete">
                  <i class="el-icon-minus"></i>
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
          <el-form-item label="客源编号：" class="form-label">
            <span class="select" @click="showDialog('guest')" v-if="type===1">{{contractForm.guestinfoCode?contractForm.guestinfoCode:'请选择房源'}}</span>
            <span class="select" v-else>{{contractForm.guestinfoCode}}</span>
          </el-form-item>
          <el-form-item label="付款方式：" class="form-label">
            <el-select v-model="contractForm.guestInfo.paymentMethod" placeholder="请选择状态" :disabled="type===2?true:false" style="width:140px">
              <el-option v-for="item in dictionary['534']" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客源方门店：" class="form-label">
            <el-select v-model="contractForm.guestInfo.guestStoreName" placeholder="请选择状态">
              <el-option label="光谷一店" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="店长：">
            {{contractForm.guestInfo.ShopOwnerName}}{{contractForm.guestInfo.ShopOwnerMobile}}
          </el-form-item>
          <br>
          <el-form-item label="客户信息：" class="form-label">
            <ul class="peopleMsg">
              <li v-for="(item,index) in guestList" :key="index" v-if="item.type===2">
                <span class="merge">
                  <input v-model="item.name" placeholder="姓名" class="name_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}">
                  <input v-model="item.mobile" placeholder="电话" class="mobile_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}">
                </span>
                <el-select v-model="item.relation" placeholder="关系" class="relation_" :disabled="type===2&&!item.edit?true:false">
                  <el-option label="本人" value="1"></el-option>
                </el-select>
                <el-input v-model="item.propertyRightRatio" placeholder="产权比" class="rate_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}"><i slot="suffix">%</i></el-input>
                <input v-model="item.identifyCode" placeholder="身份证号" class="idCard_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}">
                <span @click.stop="addcommissionData1" class="icon">
                  <i class="el-icon-plus"></i>
                </span>
                <span @click.stop="deleteRowcommissionData1(index)" v-if="guestList.length>1" class="icon delete">
                  <i class="el-icon-minus"></i>
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
            <el-form-item label="扣合作费：">
              <el-input v-model="contractForm.otherCooperationCost" placeholder="请输入内容" style="width:120px"></el-input>
            </el-form-item>
            <el-form-item label="类型：">
              <el-select v-model="contractForm.otherCooperationInfo.type" placeholder="请选择" style="width:140px">
                <el-option v-for="item in dictionary['517']" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <br>
            <el-form-item label="合作方姓名：">
              <el-input v-model="contractForm.otherCooperationInfo.name" placeholder="请输入内容" style="width:120px"></el-input>
            </el-form-item>
            <el-form-item label="联系方式：">
              <el-input v-model="contractForm.otherCooperationInfo.mobile" placeholder="请输入内容" style="width:140px"></el-input>
            </el-form-item>
            <el-form-item label="身份证号：">
              <el-input v-model="contractForm.otherCooperationInfo.identifyCode" placeholder="请输入内容"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="备注：">
              <el-input type="textarea" :rows="4" resize='none' v-model="contractForm.otherCooperationInfo.remarks" placeholder="无备注内容"></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="houseMsg">
        <p>扩展参数</p>
      </div>
      <div class="btn">
        <div>
          <div v-if="type===2">
            <p><span>录入时间：</span>{{contractForm.createTime}}</p>
            <p><span>录入人：</span>{{contractForm.dealAgentStoreName}}-{{contractForm.dealAgentName}}</p>
            <p><span>最后修改：</span>{{contractForm.updateTime}}</p>
          </div>
        </div>
        <div>
          <el-button round>预览</el-button>
          <el-button type="success" round>提交审核</el-button>
          <el-button type="primary" round @click="submitForm">保存</el-button>
          <el-button type="primary" round @click="addContract">保存1</el-button>
        </div>
      </div>
    </el-form>

    <!-- 房源客源弹窗 -->
    <houseGuest :dialogType="dialogType" :dialogVisible="isShowDialog" :contractType="contractType" @closeHouseGuest="closeHouseGuest" v-if="isShowDialog">
    </houseGuest>
    <!-- <custom-input v-model="text"></custom-input> -->
  </div>
</template>
           
<script>
import { TOOL } from "@/assets/js/common";
import customInput from "./customInput";
import { MIXINS } from "@/assets/js/mixins";
import houseGuest from "../contractDialog/houseGuest";

export default {
  mixins: [MIXINS],
  components: {
    customInput,
    houseGuest
  },
  data() {
    return {
      contractForm: {
        // type: 2,
        // houseinfoCode: "HHH002",
        // guestinfoCode: "GGG002",
        // signDate: "2018/11/11",
        // custCommission: "161.00",
        // ownerCommission: "109.00",
        // commissionPayment: "28.00",
        // otherCooperationCost: "27.00",
        // timeUnit: 1,
        // dealPrice: "1030",
        contPersons: [
          // {
          //   pid: 45,
          //   name: "张小宝",
          //   uId: 13,
          //   relation: 2,
          //   type: 2,
          //   mobile: "13098120011"
          // },
          // {
          //   pid: 46,
          //   name: "牛锦涛",
          //   relation: 1,
          //   type: 1,
          //   mobile: "13001864012"
          // }
        ],
        houseInfo: {
          // houseinfoId: "901",
          // architectureArea: "130",
          // insideArea: "120",
          // houseType: "三室一厅",
          // orientation: "东北",
          // renovation: "简装",
          // houseStoreId: "302",
          // houseStoreCode: "YqY091",
          // houseStoreName: "房源当代一店",
          // shopownerName: "夏雨天",
          // shopownerMobile: "13588888888",
          // building: "楚河汉街万达环球国际中心",
          // unit: "三单元",
          // number: "804"
        },
        guestInfo: {
          // guestinfoId: "802",
          // paymentMethod: 1,
          // guestStoreId: "211",s
          // guestStoreCode: "Qsy481",
          // guestStoreName: "客源当代一店",
          // shopownerName: "夏冰雹",
          // shopownerMobile: "15992233445",
          // dealAgentName: "戚琪"
        },
        otherCooperationInfo: {
          // type: 1,
          // name: "Hibernate",
          // mobile: "17720546921",
          // identifyCode: "420621199603070921",
          // remarks: "三方合作"
        }
        // isHavaCooperation:0
      },
      //业主信息
      ownerList: [
        {type: 1}
        // {
        //   pid: 45,
        //   name: "张小宝",
        //   uId: 13,
        //   relation: 2,
        //   type: 1,
        //   mobile: "13098120011"
        // }
      ],
      //客户信息
      guestList: [
        {type:2}
        // {
        //   pid: 46,
        //   name: "牛锦涛",
        //   relation: 1,
        //   type: 2,
        //   mobile: "13001864012"
        // }
      ],
      dialogType: "",
      isShowDialog: false,
      //三方合作
      cooperation: false,
      //操作类型  默认是添加
      type: 1,
      dictionary: {
        //数据字典
        "514": "", //产权状态
        "534": "", //支付方式
        "507": "", //时间单位
        "517": "", //第三方合作类型
        "12": "" //第三方合作类型
      },
      transFlowList: [],
      contractType: ""
    };
  },
  created() {
    this.contractForm.type = Number(this.$route.query.type);
    if (this.$route.query.operateType) {
      this.type = this.$route.query.operateType;
    }
    this.getDictionary();
    this.getTransFlow();
  },
  methods: {
    submitForm() {},
    addcommissionData() {
      this.ownerList.push({ edit: true, type: 1 });
    },
    deleteRowcommissionData(index) {
      this.ownerList.splice(index, 1);
    },
    addcommissionData1() {
      this.guestList.push({ edit: true, type: 2 });
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
    /* 新增/编辑合同 */
    addContract() {
      this.ownerList.forEach(element => {
        console.log('22')
        this.contractForm.contPersons.push(element)
      });
      this.guestList.forEach(element => {
        console.log('11')
        this.contractForm.contPersons.push(element)
      });
      /* 新增/编辑租赁合同 */
      if (this.contractForm.type === 1) {
        let param = {
          leaseCont: this.contractForm,
          type: this.type
        };
        this.$ajax.postJSON("/api/contract/editSaleCont", param).then(res => {});
      }
      /* 新增/编辑买卖合同 */
      if (this.contractForm.type === 2) {
        let param = {
          saleCont: this.contractForm,
          type: this.type
        };
        this.$ajax.postJSON("/api/contract/editLeaseCont", param).then(res => {});
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
          this.ownerList[0]={
            name: houseMsg.OwnerInfo.OwnerName,
            mobile: houseMsg.OwnerInfo.OwnerMobile,
            type:1
          }
        }
      });
    },
    //根据客源id获取客源信息
    getGuestDetail(id) {
      console.log("客源");
      let param = {
        customerId: id
      }
      this.$ajax.get("/api/resource/customers/one", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          let guestMsg = res.data;
          console.log(guestMsg);
          this.contractForm.guestinfoCode = guestMsg.InquiryNo; //客源编号
          this.contractForm.guestInfo = guestMsg;
          this.guestList[0]={
            name: guestMsg.OwnerInfo.CustName,
            mobile: guestMsg.OwnerInfo.CustMobile,
            type:2
          }
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
      }else{
        this.isShowDialog = false;
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
      padding: 4px 0;
      background: @color-blue;
      border-radius: 2px;
    }
    .address {
      width: 500px;
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
        padding: 5px 0;
        border-radius: 3px;
      }
      input {
        padding: 5px 0;
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
      width: 140px;
      padding-left: 5px;
      border: 1px solid #dcdfe6;
      border-radius: 3px;
    }
    .relation_ {
      width: 80px;
    }
    .icon {
      display: inline-block;
      padding: 0 7px;
      border-radius: 15px;
      border: 1px solid @color-blue;
      i {
        color: @color-blue;
        font-weight: bold;
      }
    }
    .delete {
      border: 1px solid @color-FF5;
      i {
        color: @color-FF5;
      }
    }
  }
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