<template>
  <div class="view-container" ref="tableComView">
    <!-- 头部表单 -->
    <ScreeningTop
    @propQueryFn="queryFn"
    @propResetFormFn="resetFormFn">
      <el-form :inline="true" :model="searchForm" class="form-head" size="small">
        <el-form-item label="关键字">
          <el-input v-model="searchForm.keyword" maxlength="50" placeholder="添加人/开户行/开户名" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="添加时间">
          <el-date-picker
          v-model="searchTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="城市">
          <el-select v-model="searchForm.cityId" filterable @change="getStoreList" :clearable="true" class="w140">
            <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.cityId"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="门店选择">
          <el-select v-model="searchForm.storeId" filterable remote :clearable="true" class="w180" :remote-method="remoteMethod1" v-loadmore="moreStore1" @visible-change="showView1">
            <el-option v-for="item in homeStoreList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户类型">
          <el-select v-model="searchForm.type" :clearable="true">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in bankType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合作方式">
          <el-select v-model="searchForm.cooperationMode" :clearable="true" class="w140">
            <el-option v-for="item in dictionary['39']" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="银行卡号">
          <el-input v-model="searchForm.bankCard" :clearable="true" @keyup.native="getInt(1)"></el-input>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <!-- table表格 -->
    <div class="company-list">
      <p v-if="power['sign-set-gs'].state">
        <span><i class="iconfont icon-tubiao-11 mr-8"></i>数据列表</span>
        <el-button @click="addCompany" icon="el-icon-plus">公司信息</el-button>
      </p>
      <el-table :data="tableData" style="width: 100%" border ref="tableCom" :max-height="tableNumberCom">
        <el-table-column align="center" label="城市" prop="cityName" width="90">
        </el-table-column>
        <el-table-column align="center" label="门店" prop="storeName">
        </el-table-column>
        <el-table-column align="center" label="账户类型" min-width="50">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.companyBankList" :key="index">{{ item.type===0?'个人账户':'企业账户' }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开户名" min-width="180">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.companyBankList" :key="index">{{ item.bankAccountName }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行卡号">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.companyBankList" :key="index">{{ item.bankCard|formatBankCard }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.companyBankList" :key="index">{{ item.bankName }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支行">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.companyBankList" :key="index">{{ item.bankBranchName==='—'?'--':item.bankBranchName }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="合作方式" prop="cooperationMode.label" min-width="50">
        </el-table-column>
        <el-table-column align="center" label="添加时间" prop="createTime" min-width="60">
          <template slot-scope="scope">
            <span>{{scope.row.createTime|formatDate(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="添加人" prop="createByName">
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="60">
          <template slot-scope="scope">
            <el-button type="text" @click="viewEditCompany(scope.row,'init')" size="medium" v-if="power['sign-set-gs'].state">查看</el-button>
            <el-button type="text" class="edit-btn" @click="viewEditCompany(scope.row,'edit')" size="medium" v-if="power['sign-set-gs'].state&&scope.row.level!==4">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="tableData.length"
        class="pagination-info"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="count">
      </el-pagination>
    </div>
    <!-- 添加和编辑公司信息 弹出框 -->
    <el-dialog
    :closeOnClickModal="$tool.closeOnClickModal"
    :close-on-press-escape="$tool.closeOnClickModal"
    :title="companyFormTitle"
    :visible.sync="AddEditVisible"
    width="1180px"
    :before-close="handleClose"
    class="dialog-info">
      <el-form :model="companyForm" label-position='right'>
        <div class="company-info">
          <p>添加企业信息</p>
          <div class="info-content">
            <div class="item item-display">
              <el-form-item label="当前城市: ">
                <!-- <el-select placeholder="请选择" size="mini" v-model="companyForm.cityId" filterable @change="getStoreList">
                  <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.cityId"></el-option>
                </el-select> -->
                <el-input v-model="companyForm.cityName" size="mini" disabled></el-input>
              </el-form-item>
              <el-form-item label="门店选择: ">
                <el-select placeholder="请选择" size="mini" v-model="companyForm.storeId" filterable remote clearable @change="storeSelect" :disabled="storeNoChange" :remote-method="remoteMethod2" v-loadmore="moreStore2" @visible-change="showView2" @clear="clearStore">
                  <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="合作方式: ">
                <!-- <el-select v-model="companyForm.cooperationMode" size="mini" @change="cooModeChange">
                  <el-option v-for="item in dictionary['39']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select> -->
                <el-input v-model="companyForm.cooperationMode" size="mini" disabled></el-input>
              </el-form-item>
            </div>
            <div class="item item-display">
              <el-form-item label="门店特许费比例: " class="allow">
                <el-input v-model="companyForm.franchiseRatio" size="mini"  :disabled="fourthStoreNoEdit" @input="cutNumber('franchiseRatio')"></el-input>%
              </el-form-item>
              <el-form-item label="门店名称: " class="store-name">
                <el-input size="mini" v-model.trim="companyForm.name" placeholder="营业执照上的名字" maxlength="50" :disabled="fourthStoreNoEdit" @input="inputOnly(100,'name')"></el-input>
              </el-form-item>
              <el-form-item label="法人姓名: ">
                <el-input size="mini" maxlength="15" v-model.trim="companyForm.lepName" :disabled="fourthStoreNoEdit" @input="inputOnly(999,'lepName')"></el-input>
              </el-form-item>
            </div>
            <div class="item item-display">
              <el-form-item label="证件类型: ">
                <el-select placeholder="请选择" size="mini" v-model="companyForm.lepDocumentType" :disabled="fourthStoreNoEdit" @change="idTypeChange">
                  <el-option v-for="item in dictionary['40']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="证件号: " class="id-card">
                <el-input size="mini" :maxlength="companyForm.lepDocumentType===1?18:companyForm.lepDocumentType===2?9:11" v-model.trim="companyForm.lepDocumentCard" :disabled="fourthStoreNoEdit" @input="inputOnly(1000,'lepDocumentCard')"></el-input>
              </el-form-item>
              <el-form-item label="法人手机号码: ">
                <el-input size="mini" oninput="if(value.length>11)value=value.slice(0,11)" v-model="companyForm.lepPhone" :disabled="fourthStoreNoEdit" @keyup.native="getInt(2)"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="企业证件: ">
                <el-select placeholder="请选择" size="mini" v-model="companyForm.documentType" @change="documentTypeChange" :disabled="fourthStoreNoEdit">
                  <el-option v-for="item in dictionary['38']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="统一社会信用代码: " v-if="creditCodeShow" class="tongyi">
                <el-input size="mini" v-model.trim="documentCard.creditCode" :disabled="fourthStoreNoEdit" @input="inputOnly(1,'creditCode')"></el-input>
              </el-form-item>
              <el-form-item label="工商注册号: " v-if="icRegisterShow" class="gongshang">
                <el-input size="mini" v-model.trim="documentCard.icRegisterCode" :disabled="fourthStoreNoEdit" @input="inputOnly(2,'icRegisterCode')"></el-input>
              </el-form-item>
              <el-form-item label="组织机构代码: " v-if="icRegisterShow" class="zuzhi">
                <el-input size="mini" v-model.trim="documentCard.organizationCode" :disabled="fourthStoreNoEdit" @input="inputOnly(3,'organizationCode')"></el-input>
              </el-form-item>
            </div>
            <div class="item shuiwu">
              <el-form-item label="税务登记证: " v-if="icRegisterShow">
                <el-input size="mini" v-model.trim="documentCard.taxRegisterCode" :disabled="fourthStoreNoEdit" @input="inputOnly(4,'taxRegisterCode')"></el-input>
              </el-form-item>
            </div>
            <div class="tip tip-top">
              <span>温馨提示: </span>
              <div class="message">
                <p>1. 门店名称必须和营业执照证件上登记的名称一致；</p>
                <p>2. 如个体工商户在营业执照上无企业名称的，请填“经营者”名字；</p>
                <p>3. 三证合一企业证件，只需要填写“统一社会信用代码”；老三证，请分别填写工商注册号、组织机构代码、税务登记证；</p>
                <p>4. 只支持设置三级门店公司信息</p>
              </div>
            </div>
          </div>
          <div class="notice" v-show="noticeShow"><i class="el-icon-info notice-icon"></i>门店信息已经录入，请选择其他门店</div>
        </div>
        <div class="company-info">
          <p>添加企业银行账户</p>
          <div class="info-content">
            <el-table style="width: 100%" :data="companyBankList" class="addBankRow">
              <el-table-column align="center" label="" width="170">
                <template slot-scope="scope">
                  <el-form-item label="账户类型: ">
                    <el-select size="small" v-model="companyBankList[scope.$index].type" class="property" :disabled="fourthStoreNoEdit">
                      <el-option v-for="item in bankType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" label="" width="260">
                <template slot-scope="scope">
                  <el-form-item label="开户名: ">
                    <el-input size="small" class="card-owner" maxlength="30" v-model.trim="companyBankList[scope.$index].bankAccountName" :disabled="fourthStoreNoEdit" @input="inputOnly(scope.$index,'bankAccountName')"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" label="" width="238">
                <template slot-scope="scope">
                  <el-form-item label="银行卡号: ">
                    <el-input size="small" oninput="if(value.length>20)value=value.slice(0,20)" v-model="companyBankList[scope.$index].bankCard" :disabled="fourthStoreNoEdit" @keyup.native="getInt(3,scope.$index)"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" label="" width="215">
                <template slot-scope="scope">
                  <el-form-item label="银行: ">
                    <el-select size="small" v-model="companyBankList[scope.$index].bankId" filterable :disabled="fourthStoreNoEdit" class="bank-item">
                      <el-option v-for="item in adminBanks" :key="item.id" :label="item.bankName" :value="item.bankId"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" label="" width="192">
                <template slot-scope="scope" v-if="companyBankList[scope.$index].type===1">
                  <el-form-item label="支行: ">
                    <el-input size="small" class="bank-branch" v-model.trim="companyBankList[scope.$index].bankBranchName" :disabled="fourthStoreNoEdit" @input="inputOnly(scope.$index,'bankBranchName')"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="" width="64">
                <template slot-scope="scope">
                  <span @click="addRow" class="button" :class="{'direct-sale':fourthStoreNoEdit}"><i class="icon el-icon-plus"></i></span>
                  <span @click="removeRow(scope.$index)" class="button" :class="{'direct-sale':fourthStoreNoEdit}"><i class="icon el-icon-minus"></i></span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="company-info">
          <p>添加电子签章</p>
          <div>
            <div class="stamp">
              <span>合同章上传</span>
              <div class="upload">
                <span class="point">上传电子签章图片：</span>
                <ul>
                  <li>
                    <fileUp id="imgcontract" class="up" :rules="['png']" @getUrl="upload" :more=false :picSize=true :scane="{path:'setting'}"><i>+</i></fileUp>
                    <p class="text">点击上传</p>
                  </li>
                  <el-tooltip effect="dark" :content="contractName" placement="bottom">
                    <li v-show="companyForm.contractSign!==''">
                      <div @click="getPicture(1)"><upload-cell type=".png"></upload-cell></div>
                      <p class="pic-name">{{contractName}}</p>
                      <span class="del" @click="delStamp(1)"><i class="el-icon-close"></i></span>
                    </li>
                  </el-tooltip>
                </ul>
              </div>
            </div>
            <div class="stamp">
              <span>财务章上传</span>
              <div class="upload">
                <span class="point">上传电子签章图片：</span>
                <ul>
                  <li>
                    <fileUp id="imgfinance" class="up" :rules="['png']" @getUrl="upload" :more=false :picSize=true :scane="{path:'setting'}"><i>+</i></fileUp>
                    <p class="text">点击上传</p>
                  </li>
                  <el-tooltip effect="dark" :content="financialName" placement="bottom">
                    <li v-show="companyForm.financialSign!==''">
                      <div @click="getPicture(2)">
                        <upload-cell type=".png"></upload-cell>
                      </div>
                      <p class="pic-name">{{financialName}}</p>
                      <span class="del" @click="delStamp(2)"><i class="el-icon-close"></i></span>
                    </li>
                  </el-tooltip>
                </ul>
              </div>
            </div>
          </div>
          <div class="tip">
            <span>温馨提示: </span>
            <div class="message">
              <p>请上传<i>png透明</i>格式的图片,大小不超过<i>5M</i>；</p>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitConfirm">确 定</el-button>
      </div>
      <preview :imgList="previewFiles" v-if="preview" @close="preview=false"></preview>
    </el-dialog>
    <!-- 查看 弹出框 -->
    <el-dialog
    :closeOnClickModal="$tool.closeOnClickModal"
    :close-on-press-escape="$tool.closeOnClickModal"
    title="详情信息"
    :visible.sync="dialogViewVisible"
    width="740px"
    :before-close="handleClose"
    class="dialog-info">
    <div class="view-content">
      <p>{{companyForm.storeName}}</p>
      <div>
        <span>法人信息</span>
        <p><span>法人姓名: {{ companyForm.lepName }}</span><span>法人手机号码: {{ companyForm.lepPhone }}</span></p>
        <p><span>证件类型: {{ companyForm.lepDocumentType }}</span><span class="card-no">证件号: {{ companyForm.lepDocumentCard }}</span></p>
        <p><span>门店特许费比例: {{companyForm.franchiseRatio}}%</span></p>
      </div>
      <div>
        <span>营业执照信息</span>
        <p v-if="creditCodeShow">统一社会信用代码: {{ documentCard.creditCode }}</p>
        <p v-if="icRegisterShow"><span>工商注册号: {{ documentCard.icRegisterCode }}</span><span>组织机构代码: {{ documentCard.organizationCode }}</span></p>
        <p v-if="icRegisterShow">税务登记证: {{ documentCard.taxRegisterCode }}</p>
      </div>
      <div>
        <span>电子签章信息</span>
        <div class="stamp">
          <span>合同章: </span>
          <div @click="getPicture(1)"><upload-cell type=".png" class="picture" v-show="companyForm.contractSign!==''"></upload-cell></div>
        </div>
        <div class="stamp">
          <span>财务章: </span>
          <div @click="getPicture(2)"><upload-cell type=".png" class="picture" v-show="companyForm.financialSign!==''"></upload-cell></div>
        </div>
      </div>
    </div>
    <preview :imgList="previewFiles" v-if="preview" @close="preview=false"></preview>
    </el-dialog>
  </div>
</template>

<script>
  import {MIXINS} from "@/assets/js/mixins";
  let checkPhone = function (str) {
    return /^1[3456789]\d{9}$/.test(str)
  }
  let checkId = function (str) {
    return /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/.test(str)
  }
  let checkPassPort = function (str) {
    return /^1[45][0-9]{7}$|(^[P|p|S|s]\d{7}$)|(^[S|s|G|g|E|e]\d{8}$)|(^[Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|(^[H|h|M|m]\d{8,10}$)/.test(str)
  }
  const rule = {
    cityId: {
      name: "城市选择"
    },
    storeId: {
      name: "门店选择"
    },
    cooperationMode: {
      name: "合作方式"
    },
    franchiseRatio: {
      name: "门店特许费比例"
    },
    name: {
      name: "门店名称"
    },
    lepName: {
      name: "法人姓名"
    },
    lepDocumentType: {
      name: "证件类型"
    }
  }
  let obj1 = {
    cityId: "",
    cityName: "",
    storeId: "",
    storeName: "",
    cooperationMode: "",
    franchiseRatio: "",
    name: "",
    lepName: "",
    lepDocumentType: "",
    lepDocumentCard: "",
    lepPhone: "",
    documentType: "",
    contractSign: "",
    financialSign: "",
    level: ""
  }
  let obj2 = {
    creditCode: "",
    icRegisterCode: "",
    organizationCode: "",
    taxRegisterCode: ""
  }
  let arr = [
    {
      bankBranchName: '',
      bankAccountName: '',
      bankCard: '',
      type: 1,
      bankId: ''
    }
  ]
  export default {
    name: "company",
    mixins: [MIXINS],
    data() {
      return {
        // 搜索表单中的数据
        searchForm: {
          cityId: "",
          storeId: "",
          cooperationMode: "",
          bankCard: "",
          keyword: "",
          type: ""
        },
        cityList: [],
        homeStoreList: [],
        storeList: [],
        searchTime: [],
        tableData: [], //公司设置列表
        pageSize: 10,
        pageNum: 1,
        count: 0,
        AddEditVisible: false, //新增编辑公司信息 弹出框
        companyFormTitle: "", //新增编辑弹出框 标题
        companyForm: {}, //新增和编辑表单
        documentCard: {}, //营业执照信息
        companyBankList: [], //银行账户集合
        delIds: [],
        directInfo: {}, //直营属性证件信息
        fourthStoreNoEdit: false,
        dialogViewVisible: false, //查看弹出框
        creditCodeShow: false,
        icRegisterShow: false,
        noticeShow: false,
        dictionary: {
          '38':'',
          '39':'',
          '40':''
        },
        contractName: "",
        financialName: "",
        imgList: [],
        bankType:[
          {
            label:'个人账户',
            value:0
          },
          {
            label:'企业账户',
            value:1
          }
        ],
        //权限配置
        power: {
          'sign-set-gs': {
            state: false,
            name: '添加公司信息'
          }
        },
        storeNoChange: false, //门店选择不可编辑
        adminBanks:[],
        homeStorePage:1,
        homeStoreTotal:0,
        storePage:1,
        storeTotal:0,
        temKey: ""
      }
    },
    created() {
      this.searchForm.cityId = parseInt(localStorage.getItem('initId'))
      this.getCompanyList()
      this.selectDirectInfo()
      this.initFormList()
      this.getDictionary()
      this.getStoreList(1)
      this.getBanks()
    },
    methods: {
      clearStore() {
        this.storeList = []
        this.storePage = 1
        this.getStoreList(2)
      },
      showView1(bol) {
        if(!bol&&this.temKey){
          this.homeStoreList = []
          this.homeStorePage = 1
          this.getStoreList(1)
        }
      },
      showView2(bol) {
        if(!bol&&this.temKey){
          if(this.companyForm.storeId){
            return
          }
          this.clearStore()
        }
      },
      remoteMethod1(query) {
        setTimeout(() => {
          this.homeStoreList = []
          this.homeStorePage = 1
          this.getStoreList(1,this.homeStorePage,query)
        },200)
      },
      remoteMethod2(query) {
        setTimeout(() => {
          this.storeList = []
          this.storePage = 1
          this.getStoreList(2,this.storePage,query)
        },200)
      },
      //门店滚动加载更多
      moreStore1:function () {
        if(this.homeStoreList.length>=this.homeStoreTotal){
          return
        }else {
          this.getStoreList(1,++this.homeStorePage,this.temKey)
        }
      },
      moreStore2:function () {
        if(this.storeList.length>=this.storeTotal){
          return
        }else {
          this.getStoreList(2,++this.storePage,this.temKey)
        }
      },
      /**
       * 获取银行列表
       */
      getBanks:function () {
        this.$ajax.get('/api/system/selectBankName').then(res=>{
          res=res.data
          if(res.status===200){
            this.adminBanks=res.data
          }
        }).catch(error=>{

        })
      },
      // 初始化表单 数组集合
      initFormList() {
        this.companyForm = JSON.parse(JSON.stringify(obj1))
        this.documentCard = JSON.parse(JSON.stringify(obj2))
        this.companyBankList = JSON.parse(JSON.stringify(arr))
      },
      /**
       * 获取公司设置列表
       */
      getCompanyList: function () {
        let param = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          startTime: this.searchTime == null ? "" : this.searchTime[0],
          endTime: this.searchTime == null ? "" : this.searchTime[1]
        }
        param = Object.assign({},this.searchForm,param)
        this.$ajax.get('/api/setting/company/list', param).then(res => {
          res = res.data
          if(res.status === 200) {
            this.tableData = res.data.list
            this.count = res.data.total
          }
        }).catch(error => {
            this.$message({message:error})
        })
      },
      getStoreList(val,page=1,keyword='') {
        this.temKey = keyword
        this.$ajax.get('/api/setting/company/queryAllStore', {type: val,pageNum: page,keyword: keyword}).then(res => {
          res = res.data
          if(res.status === 200) {
            if(val === 2) {
              this.storeList = this.storeList.concat(res.data.list)
              this.storeTotal = res.data.total
            } else {
              this.homeStoreList = this.homeStoreList.concat(res.data.list)
              this.homeStoreTotal = res.data.total
            }
          }
        }).catch(error => {
          this.$message({message:error})
        })
      },
      storeSelect(val) {
        if(!val) {
          this.companyForm.cooperationMode = ""
          this.cooModeChange(2)
          this.companyForm.name = ""
          this.companyForm.franchiseRatio = ""
          this.companyForm.contractSign = ""
          this.companyForm.financialSign = ""
          return
        }
        this.$ajax.get('/api/setting/company/checkStore', { storeId: val }).then(res => {
          res = res.data
          if(res.status === 200 && !res.message) {
            let obj
            this.storeList.find(item => {
              if(val === item.id) {
                obj = item
              }
            })
            if(obj.isCheck) {
              this.companyForm.storeName = obj.name
              this.companyForm.level = obj.level
              if(obj.cooperationMode) {
                this.companyForm.cooperationMode = obj.cooperationMode.label
                this.cooModeChange(obj.cooperationMode.value)
              }
              this.fourthStoreNoEdit = false  
            } else {
              this.$message({message:"四级门店不能录入公司信息",type:"warning"})
              this.companyForm.storeId = ""
              this.companyForm.cooperationMode = ""
              this.cooModeChange(2)
              this.fourthStoreNoEdit = true
              this.clearStore()
            }
            this.companyForm.name = ""
            this.companyForm.franchiseRatio = ""
            this.companyForm.contractSign = ""
            this.companyForm.financialSign = ""
          } else {
            this.noticeShow = true
            setTimeout(() => {
              this.noticeShow = false
            }, 2000)
            if(this.companyFormTitle === "添加企业信息") {
              this.companyForm.storeId = ""
              this.companyForm.cooperationMode = ""
              this.companyForm.franchiseRatio = ""
              this.companyForm.name = ""
              this.companyForm.contractSign = ""
              this.companyForm.financialSign = ""
              this.cooModeChange(2)
              this.fourthStoreNoEdit = false
              this.clearStore()
            }
          }
        }).catch(error => {
          console.log(error);
        })
      },
      //关闭模态窗
      handleClose(done) {
        this.creditCodeShow = false
        this.icRegisterShow = false
        this.delIds = []
        done()
      },
      addCompany() {
        this.AddEditVisible = true
        this.companyFormTitle = "添加企业信息"
        this.storeNoChange = false
        this.initFormList()
        this.fourthStoreNoEdit = false
        this.companyForm.cityId = this.searchForm.cityId
        this.companyForm.cityName = localStorage.getItem('cityName')
        this.clearStore()
      },
      //切换到直营属性时,自动带出证件信息
      selectDirectInfo() {
        this.$ajax.get('/api/setting/company/selectDirectInfo').then(res => {
          res = res.data
          if(res.status === 200) {
            this.directInfo = res.data
          }
        }).catch(error => {
            this.$message({message:error})
        })
      },
      //合作方式选择
      cooModeChange(val) {
        if(val === 1) {
          this.companyForm.lepName = this.directInfo.lepName
          this.companyForm.lepDocumentType = this.directInfo.lepDocumentType.value
          this.companyForm.lepDocumentCard = this.directInfo.lepDocumentCard
          this.companyForm.lepPhone = this.directInfo.lepPhone
          this.companyForm.documentType = this.directInfo.documentType.value
          if(this.companyForm.documentType === 2) {
            this.icRegisterShow = true
            this.creditCodeShow = false
          } else {
            this.creditCodeShow = true
            this.icRegisterShow = false
          }
          this.documentCard = this.directInfo.documentCard
          this.companyBankList = [...this.directInfo.companyBankList]
        } else {
          this.companyForm.lepName = ""
          this.companyForm.lepDocumentType = ""
          this.companyForm.lepDocumentCard = ""
          this.companyForm.lepPhone = ""
          this.companyForm.documentType = ""
          this.icRegisterShow = false
          this.creditCodeShow = false
          this.documentCard = JSON.parse(JSON.stringify(obj2))
          this.companyBankList = JSON.parse(JSON.stringify(arr))
        }
      },
      //企业证件选择
      documentTypeChange(val) {
        if(val === 2) {
          this.creditCodeShow = false
          this.icRegisterShow = true
        } else {
          this.icRegisterShow = false
          this.creditCodeShow = true
        }
      },
      addRow() {
        let row = {
          bankName: '',
          bankAccountName: '',
          bankCard: '',
          type: 1,
          bankId: ''
        }
        this.companyBankList.push(row)
      },
      removeRow(index) {
        if(this.companyBankList[index].id) {
          this.delIds.push(JSON.stringify(this.companyBankList[index].id))
        }
        this.companyBankList.splice(index,1)
      },
      upload(obj) {
        if(obj.btnId === "imgcontract") {
          this.companyForm.contractSign = obj.param[0].path+`?${obj.param[0].name}`
          this.contractName = obj.param[0].name
        } else {
          this.companyForm.financialSign = obj.param[0].path+`?${obj.param[0].name}`
          this.financialName = obj.param[0].name
        }
      },
      delStamp(type) {
        type === 1 ? this.companyForm.contractSign = "" : this.companyForm.financialSign = ""
      },
      submitConfirm() {
        this.$tool.checkForm(this.companyForm,rule).then(() => {
          if(this.companyForm.lepDocumentCard) {
            let val = this.companyForm.lepDocumentCard
            let type = this.companyForm.lepDocumentType
            if(val&&type===1) {
              if(!checkId(val)) {
                this.$message({message:'身份证号格式不正确',type:'warning'})
                return false
              }
            }
            // else if(val&&type===2) {
            //   if(!checkPassPort(val)) {
            //     this.$message({message:'护照格式不正确',type:'warning'})
            //     return false
            //   }
            // }
            else if(val&&type===3) {
              if(!/^[HMhm]{1}([0-9]{10}|[0-9]{8})$/.test(val)) {
                this.$message({message:'港澳通行证格式不正确',type:'warning'})
                return false
              }
            }
          } else {
            this.$message({message:"证件号不能为空"})
            return false
          }
          if(this.companyForm.lepPhone) {
            let val = this.companyForm.lepPhone
            if(!checkPhone(val)) {
              this.$message({message:'手机号码不正确',type:'warning'})
              return false
            } else {
              if(!this.companyForm.documentType) {
                this.$message({message:"企业证件不能为空"})
                return false
              }
            }
          } else {
            this.$message({message:"法人手机号码不能为空"})
            return false
          }
          let isOk
          let that_ = this
          function checkBank() {
            let bankList = that_.companyBankList
            for(let i = 0; i < bankList.length; i++) {
              isOk = false
              if(bankList[i].bankAccountName) {
                if(bankList[i].bankCard) {
                  if(bankList[i].bankCard.length >= 16) {
                    if(bankList[i].bankId) {
                      if(bankList[i].type === 1 && !bankList[i].bankBranchName) {
                        that_.$message({message:"支行不能为空"})
                        break
                      } else if(bankList[i].type === 0) {
                        bankList[i].bankBranchName = ""
                      }
                      if(that_.companyForm.contractSign) {
                        if(that_.companyForm.financialSign) {
                          if(bankList.length === 1) {
                            isOk = true
                          } else if(bankList.length === 2) {
                            if(bankList[0].bankCard === bankList[1].bankCard) {
                              that_.$message({message:"银行卡号不能相同",type:"warning"})
                            } else {
                              isOk = true
                            }
                          } else if(bankList.length > 2) {
                            let ar1 = []
                            bankList.forEach(item => {
                              ar1.push(item.bankCard)
                            })
                            let ar2 = Array.from(new Set(ar1))
                            if(ar1.length !== ar2.length) {
                              that_.$message({message:"银行卡号不能相同",type:"warning"})
                            } else {
                              isOk = true
                            }
                          }
                        } else {
                          that_.$message({message:"财务章上传不能为空"})
                        }
                      } else {
                        that_.$message({message:"合同章上传不能为空"})
                      }
                    } else {
                      that_.$message({message: "银行不能为空"})
                    }
                  } else {
                    that_.$message({message: "请输入正确的银行卡号"})
                  }
                } else {
                  that_.$message({message: "银行卡号不能为空"})
                }
              } else {
                that_.$message({message: "开户名不能为空"})
              }
            }
          }
          if(this.companyForm.documentType === 1) {
            if(this.documentCard.creditCode) {
              this.documentCard.icRegisterCode = ""
              this.documentCard.organizationCode = ""
              this.documentCard.taxRegisterCode = ""
              checkBank()
            } else {
              this.$message({message:"统一社会信用代码不能为空"})
            }
          } else {
            if(this.documentCard.icRegisterCode) {
              if(this.documentCard.organizationCode) {
                if(this.documentCard.taxRegisterCode) {
                  this.documentCard.creditCode = ""
                  checkBank()
                } else {
                  this.$message({message:"税务登记证不能为空"})
                }
              } else {
                this.$message({message:"组织机构代码不能为空"})
              }
            } else {
              this.$message({message:"工商注册号不能为空"})
            }
          }
          if(isOk) {
            let obj = {
              companyBankList: this.companyBankList
            }
            let param = {
              documentCard: this.documentCard
            }
            param = Object.assign({},this.companyForm,obj,param)
            param.cooperationMode = param.cooperationMode == "直营" ? 1 : 2
            if(this.companyFormTitle === "添加企业信息") {
              if(this.power['sign-set-gs'].state) {
                this.$ajax.postJSON('/api/setting/company/insert',param).then(res => {
                  res = res.data
                  if(res.status === 200) {
                    this.AddEditVisible = false
                    this.$message(res.message)
                    this.getCompanyList()
                  }
                }).catch(error => {
                    this.$message({message:error})
                })
              } else {
                this.noPower(this.power['sign-set-gs'].name)
              }
            } else {
              let obj = {
                delIds: this.delIds
              }
              param = Object.assign({},param,obj)
              let tmp = param.storeId
              param.storeId = param.storeName
              param.storeName = tmp
              this.$ajax.put('/api/setting/company/update',param).then(res => {
                res = res.data
                if(res.status === 200) {
                  this.AddEditVisible = false
                  this.$message(res.message)
                  this.getCompanyList()
                  this.delIds = []
                }
              }).catch(error => {
                  this.$message({message:error})
              })
            }
          }
        }).catch(error => {
          this.$message({message:`${error.title}${error.msg}`})
        })
      },
      //点击查看和编辑
      viewEditCompany(row, type) {
        if(type === 'init') {
          this.dialogViewVisible = true
        } else {
          this.AddEditVisible = true
          this.companyFormTitle = "编辑企业信息"
          this.storeNoChange = true
        }
        if(row.documentType.value === 2) {
          this.icRegisterShow = true
          this.creditCodeShow = false
        } else {
          this.icRegisterShow = false
          this.creditCodeShow = true
        }
        this.documentCard = JSON.parse(JSON.stringify(row.documentCard))
        this.companyBankList = JSON.parse(JSON.stringify(row.companyBankList))
        this.companyBankList.forEach(item=>{
          if(item.type === 0) {
            item.bankBranchName = ""
          }
        })
        let currentRow = JSON.parse(JSON.stringify(row))
        this.contractName = currentRow.contractSign.split('?')[1]
        this.financialName = currentRow.financialSign.split('?')[1]
        let newForm = {
          id: currentRow.id,
          cityId: currentRow.cityId,
          cityName: currentRow.cityName,
          storeId: type === 'init' ? currentRow.storeId : currentRow.storeName,
          storeName: type === 'init' ? currentRow.storeName : currentRow.storeId,
          cooperationMode: currentRow.cooperationMode.label,
          name: currentRow.name,
          lepName: currentRow.lepName,
          lepDocumentType: type === 'init' ? currentRow.lepDocumentType.label :currentRow.lepDocumentType.value,
          lepDocumentCard: currentRow.lepDocumentCard,
          lepPhone: currentRow.lepPhone,
          documentType: currentRow.documentType.value,
          contractSign: currentRow.contractSign,
          financialSign: currentRow.financialSign,
          level: currentRow.level ? currentRow.level : "",
          franchiseRatio: ""
        }
        this.companyForm = newForm
        this.$ajax.get('/api/setting/company/updateShowFee',{storeId:type==='init'?this.companyForm.storeId:this.companyForm.storeName}).then(res => {
          res = res.data
          if(res.status === 200) {
            this.companyForm.franchiseRatio = res.data.franchiseRatio.toString()
          }
        }).catch(error => {
          this.$message({
              message: error,
              type: "error"
          })
        })
      },
      getPicture(type) {
        this.imgList = []
        let pic1 = this.companyForm.contractSign
        let pic2 = this.companyForm.financialSign
        if(type === 1) {
          if(pic2 === "") {
            this.imgList.push(pic1.split('?')[0])
          } else {
            this.imgList.push(pic1.split('?')[0],pic2.split('?')[0])
          }
        } else if(type === 2) {
          if(pic1 === "") {
            this.imgList.push(pic2.split('?')[0])
          } else {
            this.imgList.push(pic2.split('?')[0],pic1.split('?')[0])
          }
        }
        this.fileSign(this.imgList)
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getCompanyList()
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getCompanyList()
      },
      queryFn() {
        this.getCompanyList()
      },
      resetFormFn() {
        this.searchForm.storeId = ""
        this.searchForm.cooperationMode = ""
        this.searchForm.bankCard = ""
        this.searchForm.keyword = ""
        this.searchForm.type = ""
        this.searchTime = []
        this.pageNum = 1
      },
      getInt(num,index) {
        if(num===1) {
          this.searchForm.bankCard = this.searchForm.bankCard.replace(/[^\?\d]/g,'')
        } else if(num===2) {
          this.companyForm.lepPhone = this.companyForm.lepPhone.replace(/[^\?\d]/g,'')
        } else if(num===3) {
          this.companyBankList[index].bankCard = this.companyBankList[index].bankCard.replace(/[^\?\d]/g,'')
        }
      },
      inputOnly(index,type){
        if(type==='bankAccountName') {
          this.$nextTick(()=>{
            this.companyBankList[index].bankAccountName=this.$tool.textInput(this.companyBankList[index].bankAccountName,3)
          })
        }else if(type==='bankBranchName') {
          this.$nextTick(()=>{
            this.companyBankList[index].bankBranchName=this.$tool.textInput(this.companyBankList[index].bankBranchName,3)            
          })
        } else if(type==='lepName') {
          this.$nextTick(()=>{
            this.companyForm.lepName=this.$tool.textInput(this.companyForm.lepName)            
          })
        } else if(type==='lepDocumentCard') {
          this.$nextTick(()=>{
            this.companyForm.lepDocumentCard=this.$tool.textInput(this.companyForm.lepDocumentCard,2)            
          })
        } else if(type==='name') {
          this.$nextTick(()=>{
            this.companyForm.name=this.$tool.textInput(this.companyForm.name)            
          })
        } else if(type==='creditCode') {
          this.$nextTick(()=>{
            this.documentCard.creditCode=this.$tool.textInput(this.documentCard.creditCode,2)            
          })
        } else if(type==='icRegisterCode') {
          this.$nextTick(()=>{
            this.documentCard.icRegisterCode=this.$tool.textInput(this.documentCard.icRegisterCode,2)            
          })
        } else if(type==='organizationCode') {
          this.$nextTick(()=>{
            this.documentCard.organizationCode=this.$tool.textInput(this.documentCard.organizationCode,2)            
          })
        } else if(type==='taxRegisterCode') {
          this.$nextTick(()=>{
            this.documentCard.taxRegisterCode=this.$tool.textInput(this.documentCard.taxRegisterCode,2)            
          })
        }
      },
      cutNumber(val) {
        this.$nextTick(()=>{
          this.companyForm.franchiseRatio=this.$tool.cutFloat({val:this.companyForm.franchiseRatio,max:100})
        })
      },
      idTypeChange() {
        this.companyForm.lepDocumentCard = ""
      }
    },
    filters: {
      formatBankCard(val) {
        return val.replace(/[\s]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ")
      }
    }
}
</script>

<style lang="less" scoped>
@import "~@/assets/common.less";
.form-head {
  background-color: #fff;
  border-radius:2px;
  box-sizing: border-box;
  .el-form-item {
    margin-bottom: @margin-10;
    &:first-child,
    &:last-child {
      /deep/ .el-input {
        width: 180px;
      }
    }
  }
  .w140 {
    .el-input {
      width: 140px;
    }
  }
  .w180 {
    margin-right: 40px;
    /deep/ .el-input {
      width: 180px;
    }
  }
}
.company-list {
  background-color: #fff;
  padding: 0 10px;
  margin-top: 20px;
  > p {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: @size-14;
    .mr-8 {
      margin-right: 8px;
    }
    > .el-button {
      width:100px;
      padding: 9px 15px;
      border-radius:18px;
      display: flex;
      justify-content: center;
      background-color: #478DE3;
      color: #fff;
    }
  }
  .edit-btn{
    margin-left: 0!important;
  }
}
.dialog-info {
  .company-info {
    padding: 10px 20px;
    /deep/ .el-form-item__label::before {
      content: "*";
      color: red;
      position: relative;
      top: 3px;
      margin-right: 1px;
    }
    > p {
      font-size: 14px;
      font-weight: bold;
      // margin-bottom: @margin-10;
      color:rgba(35,50,65,1);
    }
    .tip {
      display: flex;
      span {
        color: #333;
        font-weight: bold;
        margin-right: 10px;
      }
      .message {
        color: #CD6D6D;
        i { font-weight: bold; color: #D56868; }
      }
    }
    &:first-child {
      .info-content {
        > .item {
          display: flex;
          &-display {
            justify-content: space-between;
          }
          > .el-form-item {
            display: flex;
            margin-bottom: 0;
            /deep/ .el-input {
              width: 200px;
              .el-input__inner {
                height: 32px!important;
              }
            }
          }
          &.shuiwu {
            /deep/ .el-input {
              width: 186px;
            }
          }
          .allow {
            /deep/ .el-input {
              width: 158px;
            }
          }
          .store-name {
            margin-left: -12px;
          }
          .id-card {
            margin-left: 42px;
          }
          .tongyi {
            margin-left: 97px;
          }
          .gongshang {
            margin-left: 139px;
          }
          .zuzhi {
            margin-left: 124px;
          }
        }
      }
      /deep/ .notice {
        width: 342px;
        height: 56px;
        background-color: #000;
        position: fixed;
        left: 40%;
        top: 5%;
        border-radius: 4px;
        display: flex;
        align-items: center;
        color: #fff;
        justify-content: center;
        &-icon {
          margin-right: 10px;
          margin-top: 2px;
          &::before {
            color: red;
          }
        }
      }
    }
    &:nth-child(2) {
      border-top: 1px solid #edecf0;
      /deep/ .el-table__header-wrapper {
        display: none;
      }
      .el-table__row {
        .el-form-item {
          // display: flex;
          margin-bottom: 0;
          /deep/ .el-form-item__label{
            padding: 0;
          }
        }
      }
      .addBankRow {
        .button {
          display: inline-block;
          padding: 0;
          width: 30px;
          height: 30px;
          line-height: 30px;
          background: #c8c8c8;
          border-radius: 50%;
          text-align: center;
          cursor: pointer;
          i {
            color: #fff;
            font-weight: bold;
          }
        }
        .direct-sale {
          display: none;
        }
        /deep/ .el-input {
          width: 168px;
        }
        /deep/ .card-owner {
          width: 200px;
        }
        /deep/ .bank-branch {
          width: 150px!important;
        }
        /deep/ .property {
          .el-input {
            width: 95px!important;
            height: 32px;
          }
        }
        /deep/ .bank-item {
          .el-input {
            height: 32px;
          }
        }
        &.el-table {
          tr:first-child td:last-child {
            span:last-child {
              display: none;
            }
          }
          /deep/ .cell {
            padding: 0;
          }
        }
      }
      /deep/ .el-table::before {
        display: none;
      }
      /deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
        background-color: #fff!important;
      }
      /deep/ .el-table td { border: 0; padding: 0; }
    }
    &:last-child {
      border-top: 1px solid #edecf0;
      > div {
        display: flex;
        margin-bottom: @margin-10;
        &.tip {
          margin-bottom: 0;
        }
        > .stamp {
          display: inline-block;
          flex: 1;
          > span {
            color:rgba(35,50,65,1);
          }
          > .upload {
            display: flex;
            margin-top: @margin-10;
            .point::before {
              content: "*";
              color: red;
              position: relative;
              top: 3px;
            }
            > ul {
              display: flex;
              li {
                width: 120px;
                height: 120px;
                border:1px dashed #DEDDE2;
                border-radius: 4px;
                margin-right: 10px;
                position: relative;
                cursor: pointer;
                text-align: center;
                > img {
                  width: 60px;
                  height: 60px;
                  border-radius: 4px;
                }
                .text {
                  position: absolute;
                  font-size: @size-base;
                  bottom: 10px;
                  left: 35px;
                  color: #233241;
                }
                .pic-name {
                  position: absolute;
                  font-size: @size-base;
                  bottom: -25px;
                  color: #233241;
                  width: 120px;
                  height: 48px;
                  text-align: center;
                  z-index: 10;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                  word-wrap: break-word;
                }
                .del {
                  position: absolute;
                  width: 20px;
                  height: 20px;
                  background-color: #F56C6C;
                  border-radius: 50%;
                  right: 8px;
                  top: 8px;
                  text-align: center;
                  line-height: 20px;
                  color: #fff;
                  display: none;
                }
                &:first-child {
                  .up {
                    width: 50px;
                    height: 50px;
                    background-color: #EEF2FB;
                    line-height: 50px;
                    text-align: center;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%,-50%);
                  }
                  i {
                    font-size: 56px;
                    color:#fff;
                  }
                }
                &:last-child {
                  >div {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%,-50%);
                  }
                  border: none;
                  background-color: #F2F3F8;
                  &:hover .del {
                    display: inline-block;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .view-content {
    padding: 20px 20px 50px;
    > p {
      text-align: center;
      font-size: 20px;
    }
    > div {
      overflow: hidden;
      margin-top: 20px;
      > span {
        display: block;
        color: #333;
        font-weight: bold;
      }
      > p {
        display: flex;
        align-items: center;
        line-height: 2;
        > span {
          flex: 1;
        }
        .card-no {
          padding-left: 84px;
        }
      }
      > .stamp {
        width: 50%;
        display: flex;
        float: left;
        margin-top: 20px;
        span { margin-right: 5px; }
        > div {
          width: 160px;
          height: 160px;
          background-color: rgba(236,238,241,1);
          position: relative;
          border-radius: 8px;
          /deep/ .picture {
            position: absolute;
            top: -6px;
            font-size: 160px!important;
          }
        }
      }
    }
  }
  .dialog-footer {
    height: 36px;
    .el-button {
      width:100px;
      height:36px;
      border-radius:18px;
    }
  }
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid rgba(237,236,240,1);
}
/deep/ .el-dialog__footer {
  padding-top: 0;
  padding-bottom: 10px;
}
/deep/ .el-table th {
  background:rgba(238,242,251,1);
}
/deep/ .el-dialog__body {
  padding: 0;
}
</style>
