<template>
  <div class="view-container">
    <el-form :inline="true" :model="contractForm" class="add-form" size="small">
      <!-- 合同信息 -->
      <div class="contractMsg">
        <p>合同信息</p>
        <div class="form-content">
          <el-form-item label="签约日期：" class="width-250" :class="{'form-label':type===1}">
            <el-date-picker type="date" value-format="yyyy/MM/dd" placeholder="选择日期" v-model="contractForm.signDate" :disabled="type===2?true:false" style="width:140px"></el-date-picker>
          </el-form-item>
          <el-form-item label="合同类型：" class="width-250">
            <el-input placeholder="请输入内容" value="租赁" :disabled="true" style="width:140px" v-if="contractForm.type===1"></el-input>
            <el-input placeholder="请输入内容" value="买卖" :disabled="true" style="width:140px" v-if="contractForm.type===2"></el-input>
            <el-input placeholder="请输入内容" value="代办" :disabled="true" style="width:140px" v-if="contractForm.type===3"></el-input>
          </el-form-item>
          <el-form-item label="成交总价：" class="form-label width-250">
            <input type="text" v-model="contractForm.dealPrice" @input="cutNumber('dealPrice')" placeholder="请输入内容" class="dealPrice">
            <i class="yuan" v-if="contractForm.type!==1">元</i>
            <!-- <el-input :value="contractForm.dealPrice" type="text" maxlength="13" placeholder="请输入内容" style="width:140px" @change="cutNumber"><i slot="suffix" v-if="contractForm.type!=1">元</i></el-input> -->
          </el-form-item>
          <el-form-item v-if="contractForm.type===1">
            <el-select v-model="contractForm.timeUnit" placeholder="请选择" style="width:100px">
              <el-option v-for="item in dictionary['507']" :key="item.key" :label="`元 / ${item.value}`" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <span class="chineseNum">{{contractForm.dealPrice|moneyFormat}}</span>
          </el-form-item>
          <br>
          <el-form-item label="客户保证金：" class="width-250" v-if="contractForm.type===2||contractForm.type===3">
            <input type="text" v-model="contractForm.custEnsure" @input="cutNumber('custEnsure')" placeholder="请输入内容" class="dealPrice" :disabled="type===2?true:false" :class="{'forbid':type===2}">
            <i class="yuan">元</i>
            <!-- <el-input v-model="contractForm.custEnsure" maxlength="13" placeholder="请输入内容" :disabled="type===2?true:false" style="width:140px"><i slot="suffix">元</i></el-input> -->
          </el-form-item>
          <el-form-item label="客户佣金：" class="width-250">
            <input type="text" v-model="contractForm.custCommission" @input="cutNumber('custCommission')" placeholder="请输入内容" class="dealPrice">
            <i class="yuan">元</i>
            <!-- <el-input v-model="contractForm.custCommission" maxlength="13" placeholder="请输入内容" style="width:140px"><i slot="suffix">元</i></el-input> -->
          </el-form-item>
          <el-form-item label="业主佣金：" class="width-250">
            <input type="text" v-model="contractForm.ownerCommission" @input="cutNumber('ownerCommission')" placeholder="请输入内容" class="dealPrice">
            <i class="yuan">元</i>
            <!-- <el-input v-model="contractForm.ownerCommission" maxlength="13" placeholder="请输入内容" style="width:140px"><i slot="suffix">元</i></el-input> -->
          </el-form-item>
          <br>
          <el-form-item label="佣金支付费：" class="width-250">
            <input type="text" v-model="contractForm.commissionPayment" @input="cutNumber('commissionPayment')" placeholder="请输入内容" class="dealPrice">
            <i class="yuan">元</i>
            <!-- <el-input v-model="contractForm.commissionPayment" maxlength="13" placeholder="请输入内容" style="width:140px"><i slot="suffix">元</i></el-input> -->
          </el-form-item>
          <el-form-item label="交易流程：" class="form-label" style="width:325px;text-align:right">
            <el-select v-model="contractForm.transFlowCode" placeholder="请选择交易流程" :clearable="true">
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
          <el-form-item label="房源编号：" class="width-250" :class="{'form-label':type===1}">
            <span class="select" @click="showDialog('house')" v-if="type===1">{{contractForm.houseinfoCode?contractForm.houseinfoCode:'请选择房源'}}</span>
            <span class="select_" v-else>{{contractForm.houseinfoCode}}</span>
          </el-form-item>
          <el-form-item label="物业地址：" :class="{'form-label':type===1}" style="width:605px;text-align:right">
            <span class="propertyAddress" v-if="contractForm.houseinfoCode">{{contractForm.houseInfo.EstateName+contractForm.houseInfo.BuildingName+contractForm.houseInfo.Unit+contractForm.houseInfo.RoomNo}}</span>
            <span class="propertyAddress color_" v-else>物业地址</span>
          </el-form-item>
          <br>
          <el-form-item label="建筑面积：" class="width-250">
            <!-- <el-input v-model="contractForm.houseInfo.Square" placeholder="请输入内容" :disabled="type===2?true:false" style="width:140px"><i slot="suffix">㎡</i></el-input> -->
            <input type="text" v-model="contractForm.houseInfo.Square" @input="cutNumber('Square')" placeholder="请输入内容" class="dealPrice" :disabled="type===2?true:false" :class="{'forbid':type===2}">
            <i class="yuan">㎡</i>
          </el-form-item>
          <el-form-item label="套内面积：" class="width-250">
            <!-- <el-input v-model="contractForm.houseInfo.SquareUse" placeholder="请输入内容" :disabled="type===2?true:false" style="width:140px"><i slot="suffix">㎡</i></el-input> -->
            <input type="text" v-model="contractForm.houseInfo.SquareUse" @input="cutNumber('SquareUse')" placeholder="请输入内容" class="dealPrice" :disabled="type===2?true:false" :class="{'forbid':type===2}">
            <i class="yuan">㎡</i>
          </el-form-item>
          <el-form-item label="房源方门店：" class="form-label" style="width:320px;text-align:right">
            <!-- <el-select v-model="contractForm.houseInfo.HouseStoreCode" :multiple='false' clearable filterable remote reserve-keyword @change="getShop" placeholder="部门" :remote-method="remoteMethod" :loading="loading">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select> -->
            <el-select v-model="contractForm.houseInfo.HouseStoreCode" filterable placeholder="请选择" :clearable="true" @change="getShop" @clear="allClear('owner')">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="店长：">
            {{contractForm.houseInfo.ShopOwnerName}} {{contractForm.houseInfo.ShopOwnerMobile}}
          </el-form-item>
          <br v-if="contractForm.type===2||contractForm.type===3">
          <el-form-item label="产权状态：" v-if="contractForm.type===2||contractForm.type===3" class="width-250">
            <el-select v-model="contractForm.houseInfo.propertyRightStatus" placeholder="请选择" :disabled="type===2?true:false" style="width:140px" :clearable="true">
              <el-option  label="无" :value="0"></el-option>
              <el-option v-for="item in dictionary['514']" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="按揭银行：" v-if="contractForm.type===2||contractForm.type===3" class="width-250">
            <el-select v-model="contractForm.houseInfo.stagesBankName" placeholder="请选择银行" :disabled="type===2?true:false" style="width:140px" :clearable="true">
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
          <el-form-item label="按揭欠款：" v-if="contractForm.type===2||contractForm.type===3" class="width-250">
            <!-- <el-input v-model="contractForm.houseInfo.stagesArrears" placeholder="请输入内容" :disabled="type===2?true:false" style="width:140px"><i slot="suffix">元</i></el-input> -->
            <input type="text" v-model="contractForm.houseInfo.stagesArrears" :disabled="type===2?true:false" @input="cutNumber('stagesArrears')" placeholder="请输入内容" class="dealPrice" :class="{'forbid':type===2}">
            <i class="yuan">元</i>
          </el-form-item>
          <br v-if="contractForm.type===2||contractForm.type===3">
          <el-form-item label="产权地址：" v-if="contractForm.type===2||contractForm.type===3" style="width:520px;text-align:right">
            <el-input v-model="contractForm.houseInfo.propertyRightAddr" maxlength="30" placeholder="请输入内容" :disabled="type===2?true:false" style="width:416px"></el-input>
          </el-form-item>
          <el-form-item label="房产证号：" v-if="contractForm.type===2||contractForm.type===3" :class="{'form-label':type===1}">
            <el-input v-model="contractForm.propertyCard" maxlength="30" placeholder="请输入内容" :disabled="type===2?true:false" style="width:200px"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="业主信息：" class="form-label" style="padding-left:18px">
            <ul class="peopleMsg">
              <li v-for="(item,index) in ownerList" :key="index" v-if="item.type===1">
                <span class="merge" :class="{'disabled':type===2&&!item.edit}">
                  <input v-model="item.name" placeholder="姓名" maxlength="6" @input="inputOnly(index,'owner')" class="name_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}">
                  <input v-model="item.mobile" type="tel" maxlength="11" placeholder="电话" class="mobile_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}" @input="verifyMobile(item.mobile)">
                </span>
                <el-select v-model="item.relation" placeholder="关系" class="relation_" :disabled="type===2&&!item.edit?true:false">
                  <el-option v-for="item in relationList" :key="item.key" :label="item.value" :value="item.value">
                  </el-option>
                </el-select>
                <span class="shell" v-if="contractForm.type!=1"><input type="text" v-model="item.propertyRightRatio" @input="cutNumber_(index,'owner')" placeholder="产权比" class="propertyRight" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}"></span>
                <input v-model="item.identifyCode" type="text" maxlength="18" placeholder="身份证号" class="idCard_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}" @input="verifyIdcard(item.identifyCode)">
                <span @click.stop="addcommissionData" class="icon">
                  <i class="iconfont icon-tubiao_shiyong-14"></i>
                </span>
                <span @click.stop="delPeople(index,'owner')" v-if="ownerList.length>1" class="icon">
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
          <el-form-item label="客源编号：" class="width-250" :class="{'form-label':type===1}">
            <span class="select" @click="showDialog('guest')" v-if="type===1">{{contractForm.guestinfoCode?contractForm.guestinfoCode:'请选择客源'}}</span>
            <span class="select_" v-else>{{contractForm.guestinfoCode}}</span>
          </el-form-item>
          <el-form-item label="付款方式：" :class="{'form-label':type===1}">
            <el-select v-model="contractForm.guestInfo.paymentMethod" placeholder="请选择" :disabled="type===2?true:false" style="width:140px" :clearable="true">
              <el-option v-for="item in dictionary['556']" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客源方门店：" class="form-label">
            <!-- <el-select v-model="contractForm.guestInfo.GuestStoreCode" :multiple='false' clearable filterable remote reserve-keyword @change="getShop_" placeholder="部门" :remote-method="remoteMethod_" :loading="loading">
              <el-option v-for="item in options_" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select> -->
            <el-select v-model="contractForm.guestInfo.GuestStoreCode" filterable placeholder="请选择" :clearable="true" @change="getShop_" @clear="allClear('guest')">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
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
                <span class="merge" :class="{'disabled':type===2&&!item.edit}">
                  <input v-model="item.name" placeholder="姓名" maxlength="6" @input="inputOnly(index,'guest')"  class="name_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}">
                  <input v-model="item.mobile" type="tel" maxlength="11" placeholder="电话" class="mobile_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}"  @input="verifyMobile(item.mobile)">
                </span>
                <el-select v-model="item.relation" placeholder="关系" class="relation_" :disabled="type===2&&!item.edit?true:false">
                  <el-option v-for="item in relationList" :key="item.key" :label="item.value" :value="item.value">
                  </el-option>
                </el-select>
                <!-- <el-input v-model="item.propertyRightRatio" placeholder="产权比" class="rate_" @input="cutNumber_(index,'guest')" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}"><i slot="suffix">%</i></el-input> -->
                <span class="shell" v-if="contractForm.type!=1"><input type="text" v-model="item.propertyRightRatio" @input="cutNumber_(index,'guest')" placeholder="产权比" class="propertyRight" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}"></span>
                <input v-model="item.identifyCode" maxlength="18" type="text" placeholder="身份证号" class="idCard_" :disabled="type===2&&!item.edit?true:false" :class="{'disabled':type===2&&!item.edit}" @input="verifyIdcard(item.identifyCode)">
                <span @click.stop="addcommissionData1" class="icon">
                  <i class="iconfont icon-tubiao_shiyong-14"></i>
                </span>
                <span @click.stop="delPeople(index,'guest')" v-if="guestList.length>1" class="icon">
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
              <input type="text" v-model="contractForm.otherCooperationCost" @input="cutNumber('otherCooperationCost')" placeholder="请输入内容" class="dealPrice">
              <i class="yuan">元</i>
            </el-form-item>
            <el-form-item label="类型：" class="width-250">
              <el-select v-model="contractForm.otherCooperationInfo.type" placeholder="请选择" style="width:140px">
                <el-option label="无" :value="0">
                </el-option>
                <el-option v-for="item in dictionary['517']" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <br>
            <el-form-item label="合作方姓名：" class="width-250">
              <!-- <el-input v-model="contractForm.otherCooperationInfo.name" maxlength="6" placeholder="请输入姓名" style="width:140px"></el-input> -->
              <input type="text" v-model="contractForm.otherCooperationInfo.name" maxlength="6" @input="inputOnly(999,'other')" placeholder="请输入姓名" class="dealPrice">
            </el-form-item>
            <el-form-item label="联系方式：" class="width-250">
              <el-input v-model="contractForm.otherCooperationInfo.mobile" type="tel" maxlength="11" placeholder="请输入手机号" style="width:140px" @input="verifyMobile(contractForm.otherCooperationInfo.mobile)"></el-input>
            </el-form-item>
            <el-form-item label="身份证号：" style="width:300px;text-align:right">
              <el-input v-model="contractForm.otherCooperationInfo.identifyCode" maxlength="18" placeholder="请输入身份证号" @input="verifyIdcard(contractForm.otherCooperationInfo.identifyCode)"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="备注：" style="padding-left:51px">
              <el-input type="textarea" :rows="6" maxlength="200" resize='none' v-model="contractForm.otherCooperationInfo.remarks" placeholder="无备注内容"></el-input>
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
          <el-button type="success" round @click="isSave(1)">提交审核</el-button>
          <el-button type="primary" round @click="isSave(0)">保存</el-button>
        </div>
      </div>
    </el-form>

    <!-- 房源客源弹窗 -->
    <houseGuest :dialogType="dialogType" :dialogVisible="isShowDialog" :contractType="contractType" :choseHcode="choseHcode" :choseGcode="choseGcode" @closeHouseGuest="closeHouseGuest" v-if="isShowDialog">
    </houseGuest>
    <!-- 保存合同确认框 -->
    <el-dialog title="提示" :visible.sync="dialogSave" width="460px">
      <span>{{hintText}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSave = false">取 消</el-button>
        <el-button type="primary" @click="saveCont" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除人员确认框 -->
    <el-dialog title="提示" :visible.sync="dialogDel" width="460px">
      <span>确定删除当前联系人吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDel = false">取 消</el-button>
        <el-button type="primary" @click="delPeopleMsg">确 定</el-button>
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
          HouseStoreCode: "",
          ShopOwnerMobile:'',
          ShopOwnerName:''
        },
        guestInfo: {
          ShopOwnerMobile:'',
          ShopOwnerName:''
        },
        otherCooperationInfo: {
          identifyCode:'',
          mobile:''
        },
        extendParams:{},
        isHaveCooperation: 0
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
      parameterRule:{},
      fullscreenLoading:false,
      hintText:'',
      haveExamine:0,
      //人员信息下标
      peopleIndex:'',
      dialogDel:false,
      delType:'',
      choseHcode:0,//选择的房源编号
      choseGcode:0,//选择的客源编号
    };
  },
  created() {
    console.log(this.$tool.repeatCell(['1','2']))
    this.contractForm.type = Number(this.$route.query.type);
    if (this.$route.query.operateType) {
      this.type = parseInt(this.$route.query.operateType);
      if (this.type == 2) {
        this.id=parseInt(this.$route.query.id)
        this.getContractDetail();
      }
    }
    // if(this.contractForm.type!=1){
    //   rule.propertyCard={
    //     name:'房产证号'
    //   }
    // }
    console.log(rule)
    this.getDictionary();//字典
    this.getTransFlow();//交易类型
    this.getRelation();//人员关系
    this.getExtendParams();//扩展参数
    this.getShopList()//门店
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
    // deleteRowcommissionData(index) {
    //   this.ownerList.splice(index, 1);
    // },
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
    // deleteRowcommissionData1(index) {
    //   this.guestList.splice(index, 1);
    // },
    //删除联系人确认框
    delPeople(index,type){
      this.peopleIndex=index;
      this.delType=type;
      this.dialogDel=true;
    },
    //确认删除
    delPeopleMsg(){
      if(this.delType==="owner"){
        this.ownerList.splice(this.peopleIndex, 1);
        this.dialogDel=false;
      }else if(this.delType==="guest"){
        this.guestList.splice(this.peopleIndex, 1);
        this.dialogDel=false;
      }
    },
    toCooperation() {
      this.cooperation = !this.cooperation;
      if (this.contractForm.isHaveCooperation) {
        this.contractForm.isHaveCooperation = 0;
      } else {
        this.contractForm.isHaveCooperation = 1;
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
    //身份证验证
    verifyIdcard(value){
      if(value.length===18){
        // let reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;
        let reg = /^[1-9]\d{5}((((19|[2-9][0-9])\d{2})(0?[13578]|1[02])(0?[1-9]|[12][0-9]|3[01]))|(((19|[2-9][0-9])\d{2})(0?[13456789]|1[012])(0?[1-9]|[12][0-9]|30))|(((19|[2-9][0-9])\d{2})0?2(0?[1-9]|1[0-9]|2[0-8]))|(((1[6-9]|[2-9][0-9])(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))0?229))\d{3}[0-9Xx]$/;
        if (!reg.test(value)) {
          this.$message({
            message:'身份证格式不正确'
          })
        }
      }
    },
    //手机号验证
    verifyMobile(value) {
      //let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if(value.length===11){
        let reg = /^1[0-9]{10}$/;
        if (!reg.test(value)) {
          this.$message({
            message:'手机号格式不正确'
          })
        }
      }
      
    },
    //验证合同信息
    isSave(value) {
      this.haveExamine=value;
      if(value){
        this.hintText='确定提审？'
      }else{
        this.hintText='确定保存合同？'
      }
      //验证合同信息
      this.$tool.checkForm(this.contractForm, rule).then(() => {
          if (
            this.contractForm.custCommission > 0 ||
            this.contractForm.ownerCommission > 0
          ) {
            if (this.contractForm.houseInfo.HouseStoreCode) {
              if(this.contractForm.propertyCard){
                this.contractForm.propertyCard=this.contractForm.propertyCard.replace(/\s/g,"");
              }
              if(this.contractForm.propertyCard||this.contractForm.type===1){
                //业主产权比
              let ownerRightRatio = 0;

              let isOk;
              // this.ownerList.forEach(element => {
              for(var i=0;i<this.ownerList.length;i++){
                let element = this.ownerList[i]
                isOk = false;
                if (element.name) {
                  if(element.name.replace(/\s/g,"")){
                    element.name=element.name.replace(/\s/g,"");
                    if (element.mobile.length === 11) {
                    let reg = /^1[0-9]{10}$/;
                    if (reg.test(element.mobile)) {
                      if (element.relation) {
                        if(this.type===2){
                          if(!element.propertyRightRatio){
                            element.propertyRightRatio="0"
                          }
                        }      
                        if ((element.propertyRightRatio&&element.propertyRightRatio>0)||element.propertyRightRatio==='0'||this.contractForm.type===1) {
                          if (element.identifyCode) {
                            let reg = /^[1-9]\d{5}((((19|[2-9][0-9])\d{2})(0?[13578]|1[02])(0?[1-9]|[12][0-9]|3[01]))|(((19|[2-9][0-9])\d{2})(0?[13456789]|1[012])(0?[1-9]|[12][0-9]|30))|(((19|[2-9][0-9])\d{2})0?2(0?[1-9]|1[0-9]|2[0-8]))|(((1[6-9]|[2-9][0-9])(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))0?229))\d{3}[0-9Xx]$/;
                            if (reg.test(element.identifyCode)) {
                              isOk = true;
                              ownerRightRatio += element.propertyRightRatio - 0;
                            }else{
                              this.$message({
                                message: "业主身份证号不正确"
                              });
                              break
                            }
                          } else {
                            this.$message({
                              message: "业主身份证号不能为空"
                            });
                            break
                          }
                        } else {
                          this.$message({
                            message: "业主产权比不能为空或负"
                          });
                          break
                        }
                    } else {
                      this.$message({
                        message: "业主关系不能为空"
                      });
                      break
                    }
                    }else{
                      this.$message({
                        message: "业主电话号码不正确"
                      });
                      break
                    }
                  } else {
                    this.$message({
                      message: "业主电话号码不正确"
                    });
                    break
                  }
                  }else{
                    this.$message({
                      message: "业主姓名不能为空"
                    });
                    break
                  }
                } else {
                  this.$message({
                    message: "业主姓名不能为空"
                  });
                  break
                }
              };
              if (isOk) {
                if (ownerRightRatio === 100||this.contractForm.type===1) {
                  if (this.contractForm.guestInfo.paymentMethod) {
                    if (this.contractForm.guestInfo.GuestStoreCode) {
                      //客户产权比
                      let guestRightRatio = 0;
                      let isOk_;
                      // this.guestList.forEach(element => {
                      for(var i=0;i<this.guestList.length;i++){
                        let element = this.guestList[i];
                        isOk_ = false;
                        if (element.name) {
                          if(element.name.replace(/\s/g,"")){
                            element.name=element.name.replace(/\s/g,"");
                            if (element.mobile.length === 11) {
                            let reg = /^1[0-9]{10}$/;
                            if (reg.test(element.mobile)) {
                              if (element.relation) {
                              if ((element.propertyRightRatio&&element.propertyRightRatio>0)||element.propertyRightRatio==='0'||this.contractForm.type===1) {
                                if (element.identifyCode) {
                                  let reg = /^[1-9]\d{5}((((19|[2-9][0-9])\d{2})(0?[13578]|1[02])(0?[1-9]|[12][0-9]|3[01]))|(((19|[2-9][0-9])\d{2})(0?[13456789]|1[012])(0?[1-9]|[12][0-9]|30))|(((19|[2-9][0-9])\d{2})0?2(0?[1-9]|1[0-9]|2[0-8]))|(((1[6-9]|[2-9][0-9])(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))0?229))\d{3}[0-9Xx]$/;
                                  if (reg.test(element.identifyCode)) {
                                    isOk_ = true;
                                    guestRightRatio += element.propertyRightRatio - 0;
                                  }else{
                                    this.$message({
                                      message: "客户身份证号不正确"
                                    });
                                    break
                                  }
                                } else {
                                  this.$message({
                                    message: "客户身份证号不能为空"
                                  });
                                  break
                                }
                              } else {
                                this.$message({
                                  message: "客户产权比不能为空或负"
                                });
                                break
                              }
                            } else {
                              this.$message({
                                message: "客户关系不能为空"
                              });
                              break
                            }
                            }else{
                              this.$message({
                                message: "业主电话号码不正确"
                              });
                              break
                            }
                          } else {
                            this.$message({
                              message: "客户电话号码不正确"
                            });
                            break
                          }
                          }else{
                            this.$message({
                              message: "客户姓名不能为空"
                            });
                            break
                          }
                        } else {
                          this.$message({
                            message: "客户姓名不能为空"
                          });
                          break
                        }
                      };
                      if (isOk_) {
                        if (guestRightRatio === 100||this.contractForm.type===1) {
                          //验证身份证是否重复
                          let IdCardList = [];
                          this.ownerList.forEach(element => {
                            IdCardList.push(element.identifyCode);
                          });
                          this.guestList.forEach(element => {
                            IdCardList.push(element.identifyCode)
                          });
                          let IdCardList_= Array.from(new Set(IdCardList));
                          if(IdCardList.length===IdCardList_.length){
                            //验证扩展参数
                            if(this.contractForm.isHaveCooperation){
                              let mobileOk=true;
                              let IDcardOk=true;
                              // contractForm.otherCooperationInfo.mobile
                              if(this.contractForm.otherCooperationInfo.mobile){
                                mobileOk=false;
                                let reg = /^1[0-9]{10}$/;
                                if (reg.test(this.contractForm.otherCooperationInfo.mobile)) {
                                  mobileOk=true;
                                }else{
                                  this.$message({
                                    message: "三方合作手机号码不正确"
                                  });
                                }
                              };
                              if(this.contractForm.otherCooperationInfo.identifyCode){
                                IDcardOk=false;
                                let reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;
                                if (reg.test(this.contractForm.otherCooperationInfo.identifyCode)) {
                                  IDcardOk=true;
                                }else{
                                  this.$message({
                                    message: "三方合作身份证号不正确"
                                  });
                                }
                              };
                              if(mobileOk&&IDcardOk){
                                // 合同扩展参数验证
                                this.$tool.checkForm(this.contractForm.extendParams, this.parameterRule).then(() => {
                                  this.dialogSave = true;
                                }).catch(error => {
                                    this.$message({
                                      message: `${error.title}${error.msg}`
                                    });
                                  });
                              }
                            }else{
                              // 合同扩展参数验证
                              this.$tool.checkForm(this.contractForm.extendParams, this.parameterRule).then(() => {
                                this.dialogSave = true;
                              }).catch(error => {
                                  this.$message({
                                    message: `${error.title}${error.msg}`
                                  });
                                });
                            }
                          }else{
                            this.$message({
                              message:'身份证号码重复'
                            })
                          }
                          // console.log(this.$tool.repeatCell(IdCardList));

                          
                          // 合同扩展参数验证
                          // this.$tool.checkForm(this.contractForm.extendParams, this.parameterRule).then(() => {
                          //   this.dialogSave = true;
                          // }).catch(error => {
                          //     this.$message({
                          //       message: `${error.title}${error.msg}`
                          //     });
                          //   });
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
              }else{
                this.$message({
                  message:'房产证号不能为空'
                })
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
      this.fullscreenLoading=true;
      this.addContract()
    },
    // 新增合同
    addContract(){
      this.contractForm.contPersons=[];
      this.ownerList.forEach(element => {
        delete element.edit;
        this.contractForm.contPersons.push(element);
      });
      this.guestList.forEach(element => {
        delete element.edit;
        this.contractForm.contPersons.push(element);
      });
      if (this.contractForm.type === 1) {//租赁合同
        var param = {
          leaseCont: this.contractForm,
          type: this.type,
          haveExamine:this.haveExamine
        };
      }else if(this.contractForm.type === 2 || this.contractForm.type === 3){//买卖代办合同
        var param = {
          saleCont: this.contractForm,
          type: this.type,
          haveExamine:this.haveExamine
        };
      }
      if(this.type===1){//新增
        if(this.haveExamine===1){//新增并提审
          var url = '/api/contract/addContractAudit';
        }else{
          var url = '/api/contract/addContract';
        }
        this.$ajax.postJSON(url, param).then(res => {
          res = res.data;
          this.fullscreenLoading=false;
          if (res.status === 200) {
            this.dialogSave=false
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.$router.push('/contractList');
          }
        }).catch(error => {
          this.fullscreenLoading=false;
          console.log(error)
          this.$message({
            message:error
          })
        })
      }else if(this.type===2){//编辑
        if(this.contractForm.type===1){
          delete param.leaseCont.contChangeState;
          delete param.leaseCont.contState;
          delete param.leaseCont.contType;
          delete param.leaseCont.laterStageState;
          delete param.leaseCont.toExamineState;
          delete param.leaseCont.previewImg;
          delete param.leaseCont.subscriptionTerm;
          delete param.leaseCont.updateTime;
          delete param.leaseCont.distributableAchievement;
          delete param.leaseCont.achievementState;
        }else if(this.contractForm.type === 2 || this.contractForm.type === 3){
          delete param.saleCont.contChangeState;
          delete param.saleCont.contState;
          delete param.saleCont.contType;
          delete param.saleCont.laterStageState;
          delete param.saleCont.toExamineState;
          delete param.saleCont.previewImg;
          delete param.saleCont.subscriptionTerm;
          delete param.saleCont.updateTime;
          delete param.saleCont.distributableAchievement;
          delete param.saleCont.achievementState;
        }
        if(this.haveExamine===1){//编辑并提审
          var url = '/api/contract/updateContractAudit';
        }else{
          var url = '/api/contract/updateContract';
        }
        this.$ajax.postJSON(url, param).then(res => {
          res = res.data;
          this.fullscreenLoading=false;
          if (res.status === 200) {
            this.dialogSave=false
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.$router.push('/contractList');
          }
        }).catch(error => {
          this.fullscreenLoading=false;
          console.log(error)
          this.$message({
            message:error
          })
        })
      }
    },
    /* 新增/编辑合同 */
    // addContract1() {
    //   this.contractForm.contPersons=[]
    //   this.ownerList.forEach(element => {
    //     delete element.edit
    //     this.contractForm.contPersons.push(element);
    //   });
    //   this.guestList.forEach(element => {
    //     delete element.edit
    //     this.contractForm.contPersons.push(element);
    //   });

    //   /* 新增/编辑租赁合同 */
    //   if (this.contractForm.type === 1) {
    //     let param = {
    //       leaseCont: this.contractForm,
    //       type: this.type,
    //       haveExamine:this.haveExamine
    //     };
    //     if(this.type===2){
    //       delete param.leaseCont.contChangeState;
    //       delete param.leaseCont.contState;
    //       delete param.leaseCont.contType;
    //       delete param.leaseCont.laterStageState;
    //       delete param.leaseCont.toExamineState;
    //       delete param.leaseCont.previewImg;
    //       delete param.leaseCont.updateTimes;
    //       delete param.leaseCont.propertyRightRatios;
    //       delete param.leaseCont.pids;
    //       delete param.leaseCont.pmobiles;
    //       delete param.leaseCont.pnames;
    //       delete param.saleCont.distributableAchievement;
    //     }
    //     this.$ajax.postJSON("/api/contract/editLeaseCont", param).then(res => {
    //       res = res.data;
    //       this.fullscreenLoading=false;
    //       if (res.status === 200) {
    //         this.dialogSave=false
    //         this.$message({
    //           message: "操作成功",
    //           type: "success"
    //         });
    //         this.$router.push('/contractList');
    //       }
    //     }).catch(error => {
    //       this.fullscreenLoading=false;
    //       console.log(error)
    //       this.$message({
    //         message:error
    //       })
    //     })
    //   }
    //   /* 新增/编辑买卖合同 */
    //   if (this.contractForm.type === 2 || this.contractForm.type === 3) {
    //     let param = {
    //       saleCont: this.contractForm,
    //       type: this.type,
    //       haveExamine:this.haveExamine
    //     };
    //     if(this.type===2){
    //       delete param.saleCont.contChangeState;
    //       delete param.saleCont.contState;
    //       delete param.saleCont.contType;
    //       delete param.saleCont.laterStageState;
    //       delete param.saleCont.toExamineState;
    //       delete param.saleCont.previewImg;
    //       delete param.saleCont.subscriptionTerm;
    //       delete param.saleCont.updateTime;
    //       delete param.saleCont.distributableAchievement;
    //       param.saleCont.signDate=param.saleCont.signDate.replace(/-/g,"/");  
    //     }

    //     this.$ajax.postJSON("/api/contract/editSaleCont", param).then(res => {
    //       res = res.data;
    //       this.fullscreenLoading=false;
    //       if (res.status === 200) {
    //         this.dialogSave=false
    //         this.$message({
    //           message: "操作成功",
    //           type: "success"
    //         });
    //         this.$router.push('/contractList');
    //       }
    //     }).catch(error => {
    //       this.fullscreenLoading=false;
    //       this.$message({
    //         message:'数据异常'
    //       })
    //     })
    //   }
    // },
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
          this.contractForm.houseinfoCode = houseMsg.PropertyNo; //房源编号
          if(houseMsg.TradeInt===2){
            this.contractForm.dealPrice = houseMsg.ListingPrice*10000;//成交总价
          }else{
            this.contractForm.dealPrice = houseMsg.ListingPrice;
            this.contractForm.timeUnit=2
          }
          this.contractForm.houseInfo = houseMsg;
          if(houseMsg.OwnerInfoList.length>0){
            this.ownerList=[];
            houseMsg.OwnerInfoList.forEach(element => {
              // console.log(element);
              element.type=1;
              element.identifyCode='';
              element.propertyRightRatio='';
              element.name=element.OwnerName;
              element.mobile=element.OwnerMobile;
              element.relation=element.Relation;
              delete element.OwnerName
              delete element.OwnerMobile
              delete element.Relation
              let obj = Object.assign({}, element);
              this.ownerList.push(obj);
            });
          }
          // this.options.push({
          //   name: houseMsg.HouseStoreName,
          //   id: houseMsg.HouseStoreCode
          // });
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
          this.guestList=[];
          this.guestList.push({
            name: guestMsg.OwnerInfo.CustName,
            mobile: guestMsg.OwnerInfo.CustMobile,
            type: 2,
            relation: guestMsg.OwnerInfo.CustRelation,
            identifyCode:'',
            propertyRightRatio:''
          })
          // this.guestList[0] = {
          //   name: guestMsg.OwnerInfo.CustName,
          //   mobile: guestMsg.OwnerInfo.CustMobile,
          //   type: 2,
          //   relation: guestMsg.OwnerInfo.CustRelation
          // };
          // this.options_.push({
          //   name: guestMsg.GuestStoreName,
          //   id: guestMsg.GuestStoreCode
          // });
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
          this.choseHcode=value.selectCode;
        } else if (value.dialogType === "guest") {
          this.isShowDialog = false;
          this.getGuestDetail(value.selectCode);
          this.choseGcode=value.selectCode;
        }
      } else {
        this.isShowDialog = false;
      }
    },
    //获取门店
    getShopList() {
      let param = {
        keyword: ''
      };
      this.$ajax.get("/api/contract/getDepsByCityId", param).then(res => {
        this.loading = false;
        res = res.data;
        if (res.status === 200) {
            this.options=res.data
            this.options_=res.data
        }
      });
    },
    getShop(id) {
      console.log(id);
      if(id){
        this.contractForm.houseInfo.ShopOwnerName='';
        this.contractForm.houseInfo.ShopOwnerMobile='';
        this.options.forEach(element => {
          if(element.id===id){
            this.contractForm.houseInfo.HouseStoreName=element.name;
          }
        });
        let param1 = {
          depId: id,
          type:1
        };
        this.$ajax.get('/api/organize/dep/manager', param1).then(res=>{
          res=res.data;  
          if(res.status===200){
            if(res.data){
              this.contractForm.houseInfo.ShopOwnerName=res.data.name;
              this.contractForm.houseInfo.ShopOwnerMobile=res.data.mobile;
            }else{
              let param2 = {
                depId: id,
                type:2
              };
              this.$ajax.get('/api/organize/dep/manager', param2).then(res=>{
                res=res.data;
                if(res.status===200){
                  if(res.data){
                    this.contractForm.houseInfo.ShopOwnerName=res.data.name;
                    this.contractForm.houseInfo.ShopOwnerMobile=res.data.mobile;
                  }else{
                    let param3 = {
                      depId: id,
                      type:3
                    };
                    this.$ajax.get('/api/organize/dep/manager', param3).then(res=>{
                      res=res.data;
                      if(res.status===200){
                        if(res.data){
                          this.contractForm.houseInfo.ShopOwnerName=res.data.name;
                          this.contractForm.houseInfo.ShopOwnerMobile=res.data.mobile;
                        }else{
                          this.$message({
                            message:'该门店没有店长'
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          }
        }).catch(error=>{
          this.$message({
            message:error
          })
        })
      }
    },
    getShop_(id) {
      if(id){
        this.contractForm.guestInfo.ShopOwnerName='';
        this.contractForm.guestInfo.ShopOwnerMobile='';
        this.options_.forEach(element => {
          if(element.id===id){
            this.contractForm.guestInfo.GuestStoreName=element.name
          }
        });
        let param1 = {
          depId: id,
          type:1
        };
        this.$ajax.get('/api/organize/dep/manager', param1).then(res=>{
          res=res.data;  
          if(res.status===200){
            if(res.data){
              this.contractForm.guestInfo.ShopOwnerName=res.data.name;
              this.contractForm.guestInfo.ShopOwnerMobile=res.data.mobile;
            }else{
              let param2 = {
                depId: id,
                type:2
              };
              this.$ajax.get('/api/organize/dep/manager', param2).then(res=>{
                res=res.data;
                if(res.status===200){
                  if(res.data){
                    this.contractForm.guestInfo.ShopOwnerName=res.data.name;
                    this.contractForm.guestInfo.ShopOwnerMobile=res.data.mobile;
                  }else{
                    let param3 = {
                      depId: id,
                      type:3
                    };
                    this.$ajax.get('/api/organize/dep/manager', param3).then(res=>{
                      res=res.data;
                      if(res.status===200){
                        if(res.data){
                          this.contractForm.guestInfo.ShopOwnerName=res.data.name;
                          this.contractForm.guestInfo.ShopOwnerMobile=res.data.mobile;
                        }else{
                          this.$message({
                            message:'该门店没有店长'
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          }
        }).catch(error=>{
          this.$message({
            message:error
          })
        })
      }
    },
    allClear(type){
      if(type==='owner'){
        this.contractForm.houseInfo.ShopOwnerName='';
        this.contractForm.houseInfo.ShopOwnerMobile='';
      }else if(type==='guest'){
        this.contractForm.guestInfo.ShopOwnerName='';
        this.contractForm.guestInfo.ShopOwnerMobile='';
      }
      
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
          // this.options.push({id:res.data.houseInfo.HouseStoreCode,name:res.data.houseInfo.HouseStoreName});
          // this.options_.push({id:res.data.guestInfo.GuestStoreCode,name:res.data.guestInfo.GuestStoreName});
          if(res.data.isHaveCooperation){
            this.cooperation=true
          }
          this.ownerList=[];
          this.guestList=[];
          for (var i = 0; i < this.contractForm.contPersons.length; i++) {
            if (this.contractForm.contPersons[i].personType.value === 1) {
              if(this.ownerList.length>0){
                this.ownerList.push({
                  name:this.contractForm.contPersons[i].name,
                  mobile:this.contractForm.contPersons[i].mobile,
                  relation:this.contractForm.contPersons[i].relation,
                  propertyRightRatio:this.contractForm.contPersons[i].propertyRightRatio,
                  identifyCode:this.contractForm.contPersons[i].identifyCode,
                  type:1,
                  edit:true
                });
              }else{
                this.ownerList.push({
                  name:this.contractForm.contPersons[i].name,
                  mobile:this.contractForm.contPersons[i].mobile,
                  relation:this.contractForm.contPersons[i].relation,
                  propertyRightRatio:this.contractForm.contPersons[i].propertyRightRatio,
                  identifyCode:this.contractForm.contPersons[i].identifyCode,
                  type:1,
                });
              }
            } else if (this.contractForm.contPersons[i].personType.value === 2) {
              if(this.guestList.length>0){
                this.guestList.push({
                  name:this.contractForm.contPersons[i].name,
                  mobile:this.contractForm.contPersons[i].mobile,
                  relation:this.contractForm.contPersons[i].relation,
                  propertyRightRatio:this.contractForm.contPersons[i].propertyRightRatio,
                  identifyCode:this.contractForm.contPersons[i].identifyCode,
                  type:2,
                  edit:true
                });
              }else{
                this.guestList.push({
                  name:this.contractForm.contPersons[i].name,
                  mobile:this.contractForm.contPersons[i].mobile,
                  relation:this.contractForm.contPersons[i].relation,
                  propertyRightRatio:this.contractForm.contPersons[i].propertyRightRatio,
                  identifyCode:this.contractForm.contPersons[i].identifyCode,
                  type:2
                });
              }
            }
          }
        }
      });
    },
    cutNumber(val){
      // console.log(val)
      if(val==="dealPrice"){
        this.$nextTick(()=>{
          this.contractForm.dealPrice=this.$tool.cutFloat({val:this.contractForm.dealPrice,max:999999999.99})
        })
      }else if(val==="custEnsure"){
        this.$nextTick(()=>{
          this.contractForm.custEnsure=this.$tool.cutFloat({val:this.contractForm.custEnsure,max:999999999.99})
        })
      }else if(val==="custCommission"){
        this.$nextTick(()=>{
          this.contractForm.custCommission=this.$tool.cutFloat({val:this.contractForm.custCommission,max:999999999.99})
        })
      }else if(val==="ownerCommission"){
        this.$nextTick(()=>{
          this.contractForm.ownerCommission=this.$tool.cutFloat({val:this.contractForm.ownerCommission,max:999999999.99})
        })
      }else if(val==="commissionPayment"){
        this.$nextTick(()=>{
          this.contractForm.commissionPayment=this.$tool.cutFloat({val:this.contractForm.commissionPayment,max:999999999.99})
        })
      }else if(val==="stagesArrears"){
        this.$nextTick(()=>{
          this.contractForm.houseInfo.stagesArrears=this.$tool.cutFloat({val:this.contractForm.houseInfo.stagesArrears,max:999999999.99})
        })
      }else if(val==="otherCooperationCost"){
        this.$nextTick(()=>{
          this.contractForm.otherCooperationCost=this.$tool.cutFloat({val:this.contractForm.otherCooperationCost,max:999999999.99})
        })
      }else if(val==="Square"){
        this.$nextTick(()=>{
          this.contractForm.houseInfo.Square=this.$tool.cutFloat({val:this.contractForm.houseInfo.Square,max:999999.99})
        })
      }else if(val==="SquareUse"){
        this.$nextTick(()=>{
          this.contractForm.houseInfo.SquareUse=this.$tool.cutFloat({val:this.contractForm.houseInfo.SquareUse,max:999999.99})
        })
      }
    },
    cutNumber_(index,type){
      if(type==='guest'){
        this.guestList[index].propertyRightRatio=this.$tool.cutFloat({val:this.guestList[index].propertyRightRatio,max:100})
      }else if(type==='owner'){
        this.ownerList[index].propertyRightRatio=this.$tool.cutFloat({val:this.ownerList[index].propertyRightRatio,max:100})
      }
    },
    inputOnly(index,type){
      if(type==='owner'){
        this.ownerList[index].name=this.$tool.textInput(this.ownerList[index].name)
      }else if(type==='guest'){
        this.guestList[index].name=this.$tool.textInput(this.guestList[index].name)
      }else if(type==='other'){
        this.contractForm.otherCooperationInfo.name=this.$tool.textInput(this.contractForm.otherCooperationInfo.name)
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
/deep/.form-label {
    position: relative;
    &:before {
      content: '*';
      display: inline-block;
      color: red;
    }
  }
  .dealPrice{
    display: inline-block;
    box-sizing: border-box;
    width: 140px;
    padding: 7px 15px;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    &::-webkit-input-placeholder {
      color: #ccc;
    }
  }
  .propertyRight{
    width: 80px;
    box-sizing: border-box;
    padding: 7px 10px!important;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
  }
  .forbid{
    background: #f5f7fa;
  }
  .yuan{
    position: absolute;
    top: 0;
    right: 6px;
    font-size: 14px;
    color: #ccc;
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
    cursor: pointer;
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
      cursor: pointer;
    }
    .select_{
      display: inline-block;
      width: 140px;
      text-align: left;
      color:@color-blue;
      font-weight: bold;
    }
    .propertyAddress{
      cursor:not-allowed;
      min-width: 500px;
      display: inline-block;
      box-sizing: border-box;
      text-align: left;
      font-size: 14px;
      padding-left: 15px;
      color: #606266;
      border-radius: 4px;
      background: #F5F7FA;
      border: 1px solid #dcdfe6;
    }
    .color_{
      color: #c0c4cc;
    }
    .parameter{
      display: flex;
      width: 800px;
      flex-wrap:wrap;
      padding-bottom: 10px;
      li{
        display: flex;
        height: 50px;
        width: 365px;
        line-height: 50px;
        > .title{
          width: 200px;
          text-align: right;
          padding-right: 10px;
          color: #606266;
        }
        > .unit{
          width: 66px;
          padding-left: 10px;
          color: #606266;
          overflow: hidden;
        }
      }
    }
  }
  .cooperation {
    min-height: 240px;
    padding-left: 30px;
    /deep/.el-textarea__inner {
      width: 600px;
      min-height: 200px;
    }
  }
  .peopleMsg {
    li {
      min-width: 540px;
      font-size: 14px;
      margin-bottom: 10px;
      .merge {
        border: 1px solid #dcdfe6;
        padding: 7px 0;
        border-radius: 3px;
      }
      .shell{
        display: inline-block;
        position: relative;
        &::after {
          content: '%';
          display: inline-block;
          color: #ccc;
          position: absolute;
          top: 0;
          right: 6px;
        }
      }
      input {
        padding: 6px 0;
        color: #606266;
        &::-webkit-input-placeholder {
        color: #ccc;
        }
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