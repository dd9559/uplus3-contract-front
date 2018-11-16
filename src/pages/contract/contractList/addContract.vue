<template>
  <div class="view-container">
    <el-form :inline="true" :model="addForm" :rules="rules" ref="ruleForm" class="add-form" size="mini">
      <!-- 合同信息 -->
      <div class="contractMsg">
        <p>合同信息</p>
        <div class="form-content">
          <el-form-item label="签约日期：" prop="date">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.signDate" :disabled="operateType==='edit'?true:false" style="width:140px"></el-date-picker>
          </el-form-item>
          <el-form-item label="合同类型：">
            <el-input placeholder="请输入内容" :value="addForm.contType==='1'?'租赁':'买卖'" :disabled="true" style="width:140px"></el-input>
          </el-form-item>
          <el-form-item label="成交总价：" prop="dealPrice">
            <el-input v-model="addForm.dealPrice" placeholder="请输入内容" style="width:140px"><i slot="suffix">元</i></el-input>
          </el-form-item>
          <el-form-item prop="dealPrice" v-if="addForm.contType==='1'">
            <el-select v-model="addForm.time" placeholder="请选择" style="width:90px">
              <el-option label="/ 天" value="1"></el-option>
              <el-option label="/ 月" value="2"></el-option>
              <el-option label="/ 季度" value="3"></el-option>
              <el-option label="/ 年" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <span class="chineseNum">{{addForm.dealPrice|moneyFormat}}</span>
          </el-form-item>
          <br>
          <el-form-item label="客户保证金：" prop="" v-if="addForm.contType==='2'">
            <el-input v-model="addForm.custEnsure" placeholder="请输入内容" :disabled="operateType==='edit'?true:false" style="width:140px"><i slot="suffix">元</i></el-input>
          </el-form-item>
          <el-form-item label="客户佣金：" prop="">
            <el-input v-model="addForm.custCommission" placeholder="请输入内容" style="width:140px"><i slot="suffix">元</i></el-input>
          </el-form-item>
          <el-form-item label="业主佣金：" prop="">
            <el-input v-model="addForm.ownerCommission" placeholder="请输入内容" style="width:140px"><i slot="suffix">元</i></el-input>
          </el-form-item>
          <el-form-item label="佣金支付费：" prop="">
            <el-input v-model="addForm.commissionPayment" placeholder="请输入内容" style="width:140px"><i slot="suffix">元</i></el-input>
          </el-form-item>
          <br>
          <el-form-item label="交易流程：" prop="transaction" v-if="addForm.contType==='2'">
            <el-select v-model="addForm.transFlowCode" placeholder="请选择交易流程">
              <el-option label="一次性（业）+ 一次性（客）" value="1"></el-option>
              <el-option label="一次性（业）+ 按揭（客）" value="2"></el-option>
              <el-option label="按揭（业）+ 一次性（客）" value="3"></el-option>
              <el-option label="按揭（业）+ 按揭（客）" value="4"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <!-- 房源信息 -->
      <div class="houseMsg">
        <p>房源信息</p>
        <div class="form-content">
          <el-form-item label="房源编号：" prop="">
            <span class="select" @click="dialogTableVisible1=true">请选择房源</span>
          </el-form-item>
          <el-form-item label="物业地址：" prop="">
            <el-input placeholder="请输入内容" v-model="addForm.address" :disabled="true" class="address">
            </el-input>
          </el-form-item>
          <br>
          <el-form-item label="建筑面积：" prop="">
            <el-input v-model="addForm.architectureArea" placeholder="请输入内容" :disabled="operateType==='edit'?true:false" style="width:140px"><i slot="suffix">㎡</i></el-input>
          </el-form-item>
          <el-form-item label="套内面积：" prop="">
            <el-input v-model="addForm.insideArea" placeholder="请输入内容" :disabled="operateType==='edit'?true:false" style="width:140px"><i slot="suffix">㎡</i></el-input>
          </el-form-item>
          <el-form-item label="房源方门店：" prop="houseStore">
            <el-select v-model="addForm.houseStoreId" placeholder="请选择状态">
              <el-option label="光谷一店" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="店长：" prop="">
            {{addForm.shopownerName}}{{addForm.shopownerMobile}}
          </el-form-item>
          <br v-if="addForm.contType==='2'">
          <el-form-item label="产权状态：" prop="" v-if="addForm.contType==='2'">
            <el-select v-model="addForm.propertyRightStatus" placeholder="请选择状态" :disabled="operateType==='edit'?true:false" style="width:140px">
              <el-option label="抵押" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="按揭银行：" prop="" v-if="addForm.contType==='2'">
            <el-select v-model="addForm.stagesBankName" placeholder="请选择银行" :disabled="operateType==='edit'?true:false" style="width:140px">
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
          <el-form-item label="按揭欠款：" prop="" v-if="addForm.contType==='2'">
            <el-input v-model="addForm.stagesArrears" placeholder="请输入内容" :disabled="operateType==='edit'?true:false" style="width:140px"><i slot="suffix">元</i></el-input>
          </el-form-item>
          <br v-if="addForm.contType==='2'">
          <el-form-item label="产权地址：" prop="" v-if="addForm.contType==='2'">
            <el-input v-model="addForm.propertyRightAddr" placeholder="请输入内容" :disabled="operateType==='edit'?true:false" style="width:430px"></el-input>
          </el-form-item>
          <el-form-item label="房产证号：" prop="" v-if="addForm.contType==='2'">
            <el-input v-model="addForm.propertyCard" placeholder="请输入内容" :disabled="operateType==='edit'?true:false" style="width:200px"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="业主信息：" prop="peopleMsg">
            <ul class="peopleMsg">
              <li v-for="(item,index) in addForm.contPersons" :key="index">
                <span class="merge">
                  <input v-model="item.name" placeholder="姓名" class="name_" :disabled="operateType==='edit'&&!item.edit?true:false" :class="{'disabled':operateType==='edit'&&!item.edit}">
                  <input v-model="item.mobile" placeholder="电话" class="mobile_" :disabled="operateType==='edit'&&!item.edit?true:false" :class="{'disabled':operateType==='edit'&&!item.edit}">
                </span>
                <el-select v-model="item.relation" placeholder="关系" class="relation_" :disabled="operateType==='edit'&&!item.edit?true:false">
                  <el-option label="本人" value="1"></el-option>
                </el-select>
                <el-input v-model="item.propertyRightRatio" placeholder="产权比" class="rate_" :disabled="operateType==='edit'&&!item.edit?true:false"><i slot="suffix">%</i></el-input>
                <input v-model="item.identifyCode" placeholder="身份证号" class="idCard_" :disabled="operateType==='edit'&&!item.edit?true:false" :class="{'disabled':operateType==='edit'&&!item.edit}">
                <span @click.stop="addcommissionData" class="icon">
                  <i class="el-icon-plus"></i>
                </span>
                <span @click.stop="deleteRowcommissionData(index)" v-if="addForm.contPersons.length>1" class="icon delete">
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
          <el-form-item label="客源编号：" prop="">
            <span class="select" @click="dialogTableVisible2=true">请选择客源</span>
          </el-form-item>
          <el-form-item label="付款方式：" prop="">
            <el-select v-model="addForm.paymentMethod" placeholder="请选择状态" :disabled="operateType==='edit'?true:false" style="width:140px">
              <el-option label="全款" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客源方门店：" prop="">
            <el-select v-model="addForm.guestStoreId" placeholder="请选择状态">
              <el-option label="光谷一店" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="店长：" prop="">
            {{addForm.shopownerName}}{{addForm.shopownerMobile}}
          </el-form-item>
          <br>
          <el-form-item label="客户信息：" prop="">
            <ul class="peopleMsg">
              <li v-for="(item,index) in addForm.contPersons1" :key="index">
                <span class="merge">
                  <input v-model="item.name" placeholder="姓名" class="name_" :disabled="operateType==='edit'&&!item.edit?true:false" :class="{'disabled':operateType==='edit'&&!item.edit}">
                  <input v-model="item.mobile" placeholder="电话" class="mobile_" :disabled="operateType==='edit'&&!item.edit?true:false" :class="{'disabled':operateType==='edit'&&!item.edit}">
                </span>
                <el-select v-model="item.relation" placeholder="关系" class="relation_" :disabled="operateType==='edit'&&!item.edit?true:false">
                  <el-option label="本人" value="1"></el-option>
                </el-select>
                <el-input v-model="item.propertyRightRatio" placeholder="产权比" class="rate_" :disabled="operateType==='edit'&&!item.edit?true:false" :class="{'disabled':operateType==='edit'&&!item.edit}"><i slot="suffix">%</i></el-input>
                <input v-model="item.identifyCode" placeholder="身份证号" class="idCard_" :disabled="operateType==='edit'&&!item.edit?true:false" :class="{'disabled':operateType==='edit'&&!item.edit}">
                <span @click.stop="addcommissionData1" class="icon">
                  <i class="el-icon-plus"></i>
                </span>
                <span @click.stop="deleteRowcommissionData1(index)" v-if="addForm.contPersons1.length>1" class="icon delete">
                  <i class="el-icon-minus"></i>
                </span>
              </li>
            </ul>
          </el-form-item>
        </div>
      </div>
      <!-- 三方合作 -->
      <div class="houseMsg">
        <p @click="toCooperation" class="thirdParty">三方合作 <span class="attention" :class="{'attention_':cooperation}"></span></p>
        <div class="cooperation">
          <div v-show="cooperation">
            <el-form-item label="扣合作费：" prop="">
              <el-input v-model="addForm.aaa" placeholder="请输入内容" style="width:120px"></el-input>
            </el-form-item>
            <el-form-item label="类型：" prop="">
              <el-select v-model="addForm.type" placeholder="请选择" style="width:140px">
                <el-option label="客户转" value="1"></el-option>
              </el-select>
            </el-form-item>
            <br>
            <el-form-item label="合作方姓名：" prop="">
              <el-input v-model="addForm.name" placeholder="请输入内容" style="width:120px"></el-input>
            </el-form-item>
            <el-form-item label="联系方式：" prop="">
              <el-input v-model="addForm.mobile" placeholder="请输入内容" style="width:140px"></el-input>
            </el-form-item>
            <el-form-item label="身份证号：" prop="">
              <el-input v-model="addForm.identifyCode" placeholder="请输入内容"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="备注：" prop="">
              <el-input type="textarea" :rows="4" resize='none' v-model="addForm.remarks" placeholder="无备注内容"></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="btn">
        <p>录入时间：{{111}} 录入人： 最后修改：</p>
        <p>
          <el-button round>预览</el-button>
          <el-button type="success" round>提交审核</el-button>
          <el-button type="primary" round @click="submitForm('ruleForm')">保存</el-button>
          <el-button type="primary" round @click="addContract">保存1</el-button>
        </p>
      </div>
    </el-form>
    <!-- 选择房源弹窗 -->
    <el-dialog title="选择房源" :visible.sync="dialogTableVisible1">
      <el-form :inline="true" :model="searchForm1" class="search-form" size="mini">
        <el-form-item label="关键字：">
          <el-input v-model="searchForm1.loupan" placeholder="楼盘字典"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm1.loupan" placeholder="楼栋单元"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm1.loupan" placeholder="房号/房源编号/房东手机"></el-input>
        </el-form-item>
        <el-form-item>
          <span @click="isAttention">我的关注 <span class="attention" :class="{'attention_':attention}"></span></span>
        </el-form-item>
        <el-button round class="search_btn">清空</el-button>
        <el-button type="primary" round class="search_btn">查询</el-button>
      </el-form>
      <div class="search_content" v-if="houseList.length>0">
        <el-table :data="houseList" border header-row-class-name="theader-bg">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column property="houseId" label="房源编号" min-width="100"></el-table-column>
          <el-table-column property="houseName" label="楼盘名称" min-width="150"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status===1">有效</span>
              <span v-if="scope.row.status===2">无效</span>
            </template>
          </el-table-column>
          <el-table-column property="floor" label="楼层"></el-table-column>
          <el-table-column property="houseType" label="房型"></el-table-column>
          <el-table-column property="area" label="面积"></el-table-column>
          <el-table-column property="price" label="售/租价" min-width="65"></el-table-column>
          <el-table-column property="fitment" label="装修" min-width="60"></el-table-column>
          <el-table-column property="maintainer" label="维护人"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-size="4" layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <div class="noList" v-else>
        未查到相关房源
      </div>
      <div class="floor_btn">
        <el-button round class="search_btn">取消</el-button>
        <el-button type="primary" round class="search_btn">确定</el-button>
      </div>
    </el-dialog>

    <!-- 选择客源弹窗 -->
    <el-dialog title="选择客源" :visible.sync="dialogTableVisible2">
      <el-form :inline="true" :model="searchForm2" class="search-form" size="mini">
        <el-form-item label="交易：">
          <el-select v-model="searchForm2.tradeType" placeholder="">
            <el-option label="求租" value="1"></el-option>
            <el-option label="求购" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input v-model="searchForm2.keyWord" placeholder="客源编号/手机号/客户姓名"></el-input>
        </el-form-item>
        <el-button round class="search_btn">清空</el-button>
        <el-button type="primary" round class="search_btn">查询</el-button>
      </el-form>
      <div class="search_content" v-if="clientList.length>0">
        <el-table :data="clientList" border header-row-class-name="theader-bg">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column property="clientName" label="姓名"></el-table-column>
          <el-table-column property="clientId" label="客源编号"></el-table-column>
          <el-table-column label="交易">
            <template slot-scope="scope">
              <span v-if="scope.row.trade===1">求租</span>
              <span v-if="scope.row.trade===2">求购</span>
            </template>
          </el-table-column>
          <el-table-column property="area" label="意向区域" min-width="100"></el-table-column>
          <el-table-column property="price" label="租/售价" min-width="60"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-size="4" layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <div class="noList" v-else>
        <p v-if="clientStatus===1">未查到相关客源</p>
        <p v-if="clientStatus===2">当前查询的客源为公客，请先在【客源资料】中进行激活<br> （当前查询的客源为已成交的私客，请先在【客源资料】中进行激活）</p>
        <p v-if="clientStatus===3">系统未查询到该客源，您可以<el-button type="text" @click="innerVisible=true">快速添加该客源</el-button>
        </p>
      </div>
      <div class="floor_btn">
        <el-button round class="search_btn">取消</el-button>
        <el-button type="primary" round class="search_btn">确定</el-button>
      </div>
      <!-- 添加客源弹窗 -->
      <el-dialog width="30%" title="添加客源" :visible.sync="innerVisible" :modal="isModel" style="margin-top:150px" append-to-body>
        <el-form :inline="true" :model="addclient" class="search-form" size="mini">
          <el-form-item label="姓名：">
            <el-input v-model="addclient.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号：">
            <el-input v-model="addclient.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="交易类型：">
            <el-select v-model="addclient.tradeType" placeholder="" style="width:150px">
              <el-option label="求租" value="1"></el-option>
              <el-option label="求购" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用途：">
            <el-select v-model="addclient.tradeType" placeholder="">
              <el-option label="求租" value="1"></el-option>
              <el-option label="求购" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="client_b">
          <el-button round class="search_btn" @click="innerVisible=false">取消</el-button>
          <el-button type="primary" round class="search_btn" @click="innerVisible=false">确定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <custom-input v-model="text"></custom-input>
  </div>
</template>
           
<script>
import { TOOL } from "@/assets/js/common";
import customInput from "./customInput";

export default {
  components: {
    customInput
  },
  data() {
    return {
      text: "",
      addForm: {
        contPersons: [
          {
            name: "张三",
            mobile: "123456789",
            idCard: "421124199801141256",
            property: 100,
            relation: "1",
            edit: false
          }
        ],
        contPersons1: [
          {
            name: "张三",
            mobile: "123456789",
            idCard: "421124199801141256",
            property: 100,
            relation: "1",
            edit: false
          }
        ]
      },
      rules: {
        date: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        dealPrice: [{ required: true, message: "请输入总价", trigger: "blur" }],
        transaction: [
          { required: true, message: "请选择交易流程", trigger: "change" }
        ],
        houseStore: [
          { required: true, message: "请选择门店", trigger: "change" }
        ],
        peopleMsg: [{ required: true, message: "请完善信息", trigger: "blur" }],
      },
      houseList: [
        {
          houseId: "YQY110635",
          houseName: "康桥小区",
          status: 1,
          floor: "中层/28",
          houseType: "2*2*2*1",
          area: "136",
          price: "90",
          fitment: "精装",
          maintainer: "当代一店下雨天"
        },
        {
          houseId: "YQY110635",
          houseName: "康桥小区",
          status: 2,
          floor: "中层/28",
          houseType: "2*2*2*1",
          area: "136",
          price: "90",
          fitment: "精装",
          maintainer: "当代一店下雨天"
        },
        {
          houseId: "YQY110635",
          houseName: "康桥小区",
          status: 1,
          floor: "中层/28",
          houseType: "2*2*2*1",
          area: "136",
          price: "90",
          fitment: "精装",
          maintainer: "当代一店下雨天"
        },
        {
          houseId: "YQY110635",
          houseName: "康桥小区",
          status: 2,
          floor: "中层/28",
          houseType: "2*2*2*1",
          area: "136",
          price: "90",
          fitment: "精装",
          maintainer: "当代一店下雨天"
        },
        {
          houseId: "YQY110635",
          houseName: "康桥小区",
          status: 2,
          floor: "中层/28",
          houseType: "2*2*2*1",
          area: "136",
          price: "90",
          fitment: "精装",
          maintainer: "当代一店下雨天"
        },
        {
          houseId: "YQY110635",
          houseName: "康桥小区",
          status: 1,
          floor: "中层/28",
          houseType: "2*2*2*1",
          area: "136",
          price: "90",
          fitment: "精装",
          maintainer: "当代一店下雨天"
        }
      ],
      //houseList:[],
      clientList: [
        // {clientName:'张三', clientId:'YQY110635', trade:1, area:'武昌 汉街', price:'96万'},
        // {clientName:'张三', clientId:'YQY110635', trade:2, area:'武昌 汉街', price:'96万'},
        // {clientName:'张三', clientId:'YQY110635', trade:2, area:'武昌 汉街', price:'96万'},
        // {clientName:'张三', clientId:'YQY110635', trade:1, area:'武昌 汉街', price:'96万'},
      ],
      clientStatus: 3,
      //房源搜索
      searchForm1: {},
      //客源搜索
      searchForm2: {},
      dialogTableVisible1: false,
      dialogTableVisible2: false,
      attention: false,
      total: 5,
      //三方合作
      cooperation: false,
      //操作类型  默认是添加
      operateType: "add",
      //添加客源
      innerVisible: false,
      isModel: false,
      addclient: {}
    };
  },
  created() {
    this.addForm.contType = this.$route.query.type;
    if (this.$route.query.operateType) {
      this.operateType = this.$route.query.operateType;
    }
  },
  methods: {
    showVal: function(val) {
      console.log(val);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addcommissionData() {
      this.addForm.contPersons.push({ edit: true });
    },
    deleteRowcommissionData(index) {
      this.addForm.contPersons.splice(index, 1);
    },
    addcommissionData1() {
      this.addForm.contPersons1.push({ edit: true });
    },
    deleteRowcommissionData1(index) {
      this.addForm.contPersons1.splice(index, 1);
    },
    isAttention() {
      this.attention = !this.attention;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    toCooperation() {
      this.cooperation = !this.cooperation;
    },
    // haha(){
    //   var money = this.addForm.dealPrice
    //   TOOL.toChineseNumber(money)
    // }
    addContract() {
      let param = {
        leaseCont: {
          id: "14",
          type: 4,
          houseinfoCode: "HHH002",
          guestinfoCode: "GGG002",
          signDate: "2018/11/11",
          custCommission: "161.00",
          ownerCommission: "109.00",
          commissionPayment: "28.00",
          otherCooperationCost: "27.00",
          timeUnit: "1",
          dealPrice: "1030",
          contPersons: [
            {
              pid: 45,
              name: "张小宝",
              uId: 13,
              relation: 2,
              personType: "CUST",
              mobile: "13098120011"
            },
            {
              pid: 46,
              name: "牛锦涛",
              relation: 1,
              personType: "OWNER",
              mobile: "13001864012"
            }
          ],
          houseInfo: {
            houseinfoId: "901",
            architectureArea: "130",
            insideArea: "120",
            houseType: "三室一厅",
            orientation: "东北",
            renovation: "简装",
            houseStoreId: "302",
            houseStoreCode: "YqY091",
            houseStoreName: "房源当代一店",
            shopownerName: "夏雨天",
            shopownerMobile: "13588888888",
            building: "楚河汉街万达环球国际中心",
            unit: "三单元",
            number: "804"
          },
          guestInfo: {
            guestinfoId: "802",
            paymentMethod: "1",
            guestStoreId: "211",
            guestStoreCode: "Qsy481",
            guestStoreName: "客源当代一店",
            shopownerName: "夏冰雹",
            shopownerMobile: "15992233445",
            dealAgentName: "戚琪"
          },
          otherCooperationInfo: {
            type: "518",
            name: "Hibernate",
            mobile: "17720546921",
            identifyCode: "420621199603070921",
            remarks: "三方合作"
          }
        },
        type: 1
      };

      this.$ajax.postJSON("/api/contract/editLeaseCont", param).then(res => {});
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
  padding: 0 20px 20px 20px;
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
  }
  .thirdParty {
    display: inline-block;
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
      //display: flex;
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
      //margin-right: 10px;
      //padding-left: 5px;
      //border: 1px solid #dcdfe6;
      //border-radius: 3px;
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
}
.search_btn {
  padding: 8px 20px;
}
.attention {
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 1px solid #ccc;
  border-radius: 2px;
}
.attention_ {
  background: @color-blue;
}
.floor_btn {
  padding: 10px 0;
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  //float: right;
}
.noList {
  background: #dedde2;
  padding: 148px 0;
  text-align: center;
}
.client_b {
  display: flex;
  justify-content: flex-end;
}
/deep/.el-table td {
  padding: 5px 0;
}
/deep/.el-dialog__header {
  padding-top: 10px;
  .el-dialog__title {
    color: @color-blue;
  }
}
/deep/.el-dialog__body {
  padding-top: 20px;
  border-top: 1px solid #edecf0;
}
/deep/ .theader-bg {
  > th {
    background-color: @bg-th;
  }
}
</style>