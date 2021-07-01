<template>
  <div class="view-container" ref="tableComView">
    <div>
      <!-- 头部表单 -->
      <ScreeningTop
      @propQueryFn="queryFn"
      @propResetFormFn="resetFormFn">
        <el-form :inline="true" :model="searchForm" class="form-head" size="small">
          <el-form-item label="关键字">
            <el-input v-model="searchForm.keyword" style="width:220px" maxlength="50" placeholder="支持输入企业名称/银行卡号" :clearable="true"></el-input>
          </el-form-item>
          <el-form-item label="账户类型">
            <el-select v-model="searchForm.type" :clearable="true">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in bankType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="认证状态">
            <el-select v-model="searchForm.verifyState" :clearable="true" class="w180">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in verifyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="授权状态">
          <el-select v-model="searchForm.warrantState" :clearable="true">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in warrantList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门店选择">
            <el-select v-model="searchForm.dept" filterable collapse-tags remote placeholder="请输入" :clearable="true" @clear="homeStoreList = []" class="headerDep"  style="width:230px" :remote-method="remoteMethod1">
              <el-option v-for="item in homeStoreList" :key="item.depId" :title="item.name" :label="item.name" :value="JSON.stringify(item)">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </ScreeningTop>
      <!-- table表格 -->
      <div class="company-list">
        <p v-if="power['sign-set-gs'].state">
            <span><i class="iconfont icon-tubiao-11 mr-8"></i>数据列表</span>
            <span>
              <el-button @click="addDep" type="primary">绑定门店</el-button>
              <el-button @click="addCompany" icon="el-icon-plus" type="primary">公司信息</el-button>
            </span>
        </p>
        <el-table :data="tableData" style="width: 100%" border ref="tableCom" :max-height="tableNumberCom">
          <el-table-column label="企业名称" prop="name" min-width="90">
          </el-table-column>
          <el-table-column label="认证状态" min-width="50">
            <template slot-scope="scope">
              <p>{{verifyList.filter(item=>item.id == scope.row.verifyState).length>0?verifyList.filter(item=>item.id == scope.row.verifyState)[0].name:'-'}}</p>
            </template>
          </el-table-column>
          <el-table-column label="授权状态" min-width="50">
            <template slot-scope="scope">
              <p>{{warrantList.filter(item=>item.id == scope.row.warrantState).length>0?warrantList.filter(item=>item.id == scope.row.warrantState)[0].name:'-'}}</p>
            </template>
          </el-table-column>
          <el-table-column label="录入时间" prop="createTime" min-width="60">
            <template slot-scope="scope">
              <span>{{(scope.row.updateTime ? scope.row.updateTime : scope.row.createTime)|formatDate(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="录入人">
            <template slot-scope="scope">
              <span>{{scope.row.deptName + ' ' + scope.row.createByName}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="开通POS收款">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top" v-if="scope.row.status == 2">
                <div style="width:160px;word-break: break-all;word-wrap:break-word;white-space: normal;text-align: justify">
                  {{scope.row.reason}}
                </div>
                <div slot="reference" class="name-wrapper">开通待完成</div>
              </el-popover>
              <span v-else>{{!scope.row.status ? '未开通' : '已开通'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="开通时间">
            <template slot-scope="scope">
              <span>{{(scope.row.status === 1 ? scope.row.posTime : '')|formatDate(2)}}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" min-width="80">
            <template slot-scope="scope">
              <!-- <el-button type="text" @click="openPosCollection(scope.row)" size="medium" v-if="power['sign-set-bl-openPos'].state && scope.row.status !== 1">开通POS收款</el-button> -->
              <el-button type="text" @click="viewEditCompany(scope.row,'init')" size="medium" v-if="power['sign-set-gs'].state">查看</el-button>
              <el-button type="text" class="edit-btn" @click="viewEditCompany(scope.row,'edit')" size="medium" v-if="power['sign-set-gs'].state && (scope.row.verifyState == 0 ||scope.row.verifyState == 2 ||scope.row.verifyState == 1)">认证</el-button>
              <el-button type="text" class="edit-btn" @click="viewEditCompany(scope.row,'edit')" size="medium" v-if="power['sign-set-gs'].state &&editBtnShow(scope.row) && scope.row.verifyState == 3">编辑</el-button>
              <el-button type="text" class="edit-btn" @click="listConfirm(scope.row)" size="medium" v-if="power['sign-set-gs'].state && (scope.row.warrantState == 0 ||scope.row.warrantState == 2 ||scope.row.warrantState == 1) && scope.row.verifyState == 3">授权</el-button>
              <el-button type="text" @click="withdraw(scope.row)" size="medium" v-if="power['sign-set-bl-tx-tix'].state">提现</el-button>
              <el-button type="text" @click="withdrawRecord(scope.row)" size="medium" v-if="power['sign-set-bl-tx-info'].state">提现记录</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="tableData.length"
          class="pagination-info"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="count">
        </el-pagination>
      </div>
      <!-- 查看 弹出框 -->
      <el-dialog
      :closeOnClickModal="$tool.closeOnClickModal"
      :close-on-press-escape="$tool.closeOnClickModal"
      :visible.sync="dialogViewVisible"
      width="740px"
      :before-close="handleClose"
      :destroy-on-close="true"
      class="dialog-info lock-dialog">
      <div slot="title" class="title-class-box">
        <span :class="tabTitleIndex ===1 ? 'current' : ''" @click="clickTitle(1)">公司信息</span>
        <span :class="tabTitleIndex ===2 ? 'current' : ''" @click="clickTitle(2)">门店信息</span>
      </div>
      <div v-show="tabTitleIndex ===1">
        <div class="view-content">
          <p class="title">企业信息</p>
          <ul class="content-box">
            <li class="content-item">
              <span>企业名称：</span>
              <span>{{companyForm.name}}</span>
            </li>
            <li class="content-item">
              <span>企业地址：</span>
              <span>{{companyForm.address}}</span>
            </li>
            <li class="content-item">
              <span>统一社会信用代码：</span>
              <span>{{companyForm.documentCard}}</span>
            </li>
          </ul>
          
          <p class="title">法人信息</p>
          <ul class="content-box">
            <li class="content-item">
              <span>法人姓名：</span>
              <span>{{companyForm.lepName}}</span>
            </li>
            <li class="content-item">
              <span>法人证件号码：</span>
              <span>{{companyForm.lepDocumentCard}}</span>
            </li>
            <li class="content-item">
              <span>法人手机号码：</span>
              <span>{{companyForm.lepPhone}}</span>
            </li>
          </ul>

          <p class="title">银行信息</p>
          <ul class="content-box">
            <li class="content-item margin" v-for="(item,index) of companyForm.entBankList" :key="index">
              <div class="bank-item">
                <span>账户类型:</span>
                <span>{{item.type == 0 ? '个人账户' : '企业账户'}}</span>
              </div>
              <div class="bank-item">
                <span>开户银行名称：</span>
                <span>{{item.bankName}}</span>
              </div>
              <div class="bank-item" v-if="item.type == 1">
                <span>支行名称：</span>
                <span>{{item.bankBranchName ? item.bankBranchName : '-'}}</span>
              </div>
              <div class="bank-item" v-if="item.type == 1">
                <span>支付行号：</span>
                <span>{{item.bankBranchCode ? item.bankBranchCode : '-'}}</span>
              </div>
              <div class="bank-item" v-if="item.type == 0">
                <span>开户名：</span>
                <span>{{item.bankAccountName ? item.bankAccountName : '-'}}</span>
              </div>
              <div class="bank-item">
                <span>银行卡号：</span>
                <span>{{item.bankCard}}</span>
              </div>
            </li>
          </ul>

          
          <p>{{companyForm.storeName}}</p>
          <div>
            <p class="title">其它信息</p>
            <div class="stamp">
              <span>合同章: </span>
              <div @click="getPicture(1)"><img :src="preConFile[0]" alt="" width="120px" height="120px"></div>
            </div>
            <div class="stamp">
              <span>财务章: </span>
              <div @click="getPicture(2)"><img :src="preFinFile[0]" alt="" width="120px" height="120px"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="dep-container" v-show="tabTitleIndex ===2">
        <div class="dep-search">
          <span>门店搜索</span>
           <el-input v-model="deptName" style="width:220px" placeholder="请输入" :clearable="true" @clear="deptName = ''"></el-input>
           <el-button @click="getSearchDepTableData('search')" type="primary">查询</el-button>
        </div>
        <div class="dep-content">
          <div class="title">
            <span>企业名称：</span>
            <span>{{companyForm.name}}</span>
          </div>
          <el-table :data="searchDepTableData" v-loadmore="lazyLoad" style="width: 100%" border :max-height="445">
          <el-table-column label="企业管理费" prop="platformFeeRatio">
            <template slot-scope="scope">
              <span>{{scope.row.platformFeeRatio}}%</span>
            </template>
          </el-table-column>
          <el-table-column label="门店名称" prop="name"></el-table-column>
          <!-- <el-table-column label="商户号" prop="name">
            <template slot-scope="scope">
              <span>{{scope.row.vspCusid || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="终端号" prop="name">
            <template slot-scope="scope">
              <span>{{scope.row.vspTermid || '-'}}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" width="170">
            <template slot-scope="scope">
              <el-button type="text" @click="clickOpen(scope.row,'company',scope.$index)" size="medium" v-if="power['sign-set-gs'].state">解绑公司</el-button>
              <!-- <el-button type="text" @click="clickOpen(scope.row,'vsp',scope.$index)" size="medium" v-if="!scope.row.vspCusid && !scope.row.vspTermid">绑定POS</el-button>
              <el-button type="text" class="is-bind" size="medium" v-else>已绑定POS</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        </div>
      </div>
      <preview :imgList="previewFiles" v-if="preview" @close="preview=false"></preview>
      </el-dialog>
      <el-dialog
      :title="openSlot === 'company' ? '解除绑定' : '绑定POS'"
      :closeOnClickModal="$tool.closeOnClickModal"
      :visible.sync="dialogRelieveVisible"
      width="460px"
      class="relieve-dialog">
        <template v-if="openSlot === 'company'">
          <div :class="openSlot">确定是否解除与<span class="text">{{companyForm.name}}</span>的关系</div>
        </template>
        <template v-if="openSlot === 'vsp'">
          <div class="vsp-item">
            <label>输入商户号: </label>
            <el-input size="small" class="vsp-input" maxlength="20" v-model.trim="vspInfo.vspCusid" @input="inputOnly(0,'vspCusid')"></el-input>
          </div>
          <div class="vsp-item">
            <label>输入POS终端编号: </label>
            <el-input size="small" class="vsp-input" maxlength="20" v-model.trim="vspInfo.vspTermid" @input="inputOnly(0,'vspTermid')"></el-input>
          </div>
        </template>
        <div slot="footer" :class="openSlot">
          <el-button type="primary" round @click="submitRelieve">确认</el-button>
        </div>
      </el-dialog>
      <el-dialog
      title="绑定门店"
      :closeOnClickModal="$tool.closeOnClickModal"
      :visible.sync="dialogRDepisible"
      width="740px"
      class="dep-dialog">
      <div class="dep-content">
        <div class="item">
          <span class="required">企业名称</span>
           <el-select v-model="bindForm.companyId" filterable remote :clearable="true" placeholder="请输入" @clear="companyList = []" loading-text="正在根据当前关键字搜索..." no-data-text="暂无匹配企业名称！" popper-class="hover-tip" class="headerDep" style="width:300px" :remote-method="filterMethod">
            <el-option v-for="item in companyList" :key="item.id" :title="item.name" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="item">
          <span class="required">企业管理费</span>
          <el-input style="width:120px;" type="number" size="mini" maxlength="15" v-model.trim="bindForm.platformFeeRatio" @input="inputOnly(100,'platformFeeRatio')"></el-input>
        </div>
        <div class="item">
          <span class="required">选择门店</span>
          <el-select v-model="bindDeptName" multiple filterable remote :clearable="true" @change="bindChange" placeholder="请输入" @clear="bdHomeStoreList = []" class="overflow headerDep" popper-class="select-popper"  style="width:300px" :remote-method="selectRemoteMethodDep">
            <el-option v-for="item in bdHomeStoreList" :key="item.depId" :title="item.name" :label="item.name" :value="JSON.stringify(item)">
            </el-option>
          </el-select>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="clickBind" type="primary" round>确认</el-button>
      </div>
      </el-dialog>
      <!-- 提现 -->
      <el-dialog
      title="余额提现"
      :closeOnClickModal="$tool.closeOnClickModal"
      :visible.sync="dialogwithdraw"
      width="400px"
      class="withdraw-dialog">
        <ul class="withdraw-content">
          <li>
            <span>到账银行卡：{{withdrawData.bankName}}</span>
            <span>(******{{withdrawData.toBank ? withdrawData.toBank.substr(-4) : ''}})</span>
          </li>
          <li>
            <span>提现金额：</span>
            <el-input style="width:120px;" size="mini" maxlength="15" v-model.trim="money" @input="inputOnly(1,'money')"></el-input>
            <p class="tip" v-show="parseFloat(money) > parseFloat(withdrawData.allAmount)">输入金额超过可提现余额</p>
          </li>
          <li>
            <span>当前账户余额{{withdrawData.allAmount}}元，<span class="all" @click="allMoney">全部提现</span></span>
          </li>
          <li>
            <span>温馨提示：到账金额为{{parseFloat(accSub(withdrawData.fee,money)) < 0 ? 0 : accSub(withdrawData.fee,money)}}元(扣除手续费{{withdrawData.fee}}元)</span>
          </li>
        </ul>
        <div slot="footer">
          <el-button @click="clickWithdraw" type="primary">确认</el-button>
        </div>
      </el-dialog>
      <!-- 提现 -->
      <el-dialog
      title="余额提现"
      :closeOnClickModal="$tool.closeOnClickModal"
      :visible.sync="dialogSubmitWithdraw"
      width="400px"
      class="submit-dialog">
        <div class="submit-content">
          <p class="one">￥{{money}}</p>
          <p class="two">
            <span>手续费</span>
            <span>￥{{withdrawData.fee}}</span>
          </p>
          <p class="two">
            <span>温馨提示：到账金额为{{accSub(withdrawData.fee,money)}}</span>
          </p>
        </div>
        <div slot="footer">
          <el-button @click="submitWithdraw" type="primary" :disabled="submitWithdrawFlag">确认</el-button>
        </div>
      </el-dialog>
      <!-- 提现记录 -->
      <el-dialog
      title="提现记录"
      :closeOnClickModal="$tool.closeOnClickModal"
      :visible.sync="dialogwithdrawRecord"
      :destroy-on-close="true"
      width="740px"
      class="log-dialog">
        <el-button class="f_r" round type="primary" size="medium" v-if="power['sign-set-bl-tx-info'].state" @click="getExcel"
                   style="padding:9px 15px;min-width: 80px;margin: 8px;">导出
        </el-button>
        <el-table :data="withdrawRecordData" v-loadmore="withdrawLazyLoad" style="width: 100%" border :max-height="445">
          <el-table-column label="操作人">
            <template slot-scope="scope">
              <span>{{scope.row.createdByDep}}-{{scope.row.createdByName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作时间" prop="name">
            <template slot-scope="scope">
              <span>{{scope.row.createdAt|formatDate(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="提现金额" prop="amount">
          </el-table-column>
           <el-table-column label="到账金额">
             <template slot-scope="scope">
              <span>{{accSub(scope.row.fee,scope.row.amount)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="手续费（元）" prop="fee">
          </el-table-column>
        </el-table>
      </el-dialog>
      <!-- 开通pos收款 -->
      <open-pos-dialog :posInfo='posInfo' :posDialog='posDialog' @handleDialogClose='handleCloses' @bindingComplete ='queryFn'>
        
      </open-pos-dialog>
    </div>
  </div>
</template>

<script>
  import {MIXINS} from "@/assets/js/mixins";
  import { mapMutations } from "vuex";
  // import openPosDialog from './conponent/openPosDialog';
  let checkPhone = function (str) {
    return /^1[3456789]\d{9}$/.test(str)
  }
  let checkId = function (str) {
    return /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/.test(str)
  }
  let checkPassPort = function (str) {
    return /^1[45][0-9]{7}$|(^[P|p|S|s]\d{7}$)|(^[S|s|G|g|E|e]\d{8}$)|(^[Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|(^[H|h|M|m]\d{8,10}$)/.test(str)
  }
  let isHaveChinese = function (str) {
    return /[\u4E00-\u9FA5]/g.test(str)
  }
  function accMul(arg1,arg2) {
    let m=0,s1=arg1.toString(),s2=arg2.toString(); 
    try{m+=s1.split(".")[1].length}catch(e){} 
    try{m+=s2.split(".")[1].length}catch(e){} 
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m) 
  }


  export default {
    name: "company",
    mixins: [MIXINS],
    components:{
      openPosDialog:() => import('./conponent/openPosDialog')
    },
    data() {
      return {
        cityId: "",
        cityName: "",
        deptName: '',
        bindDeptName: [],
        searchDepTableData: [],
        copySearchDepTableData: [],
        end: true,
        page: 1,
        withdrawEnd: true,
        withdrawPage: 1,
        withdrawTotal: 0,
        companyId: '',
        relieveData: {},
        bindForm: {
          companyId: null,
          platformFeeRatio: null,
        },
        dialogRelieveVisible: false,
        openSlot: 'company',
        vspInfo: {
          vspCusid: '',
          vspTermid: ''
        },
        vspIndex: '',
        dialogRDepisible: false,
        dialogwithdraw: false,
        dialogSubmitWithdraw: false,
        submitWithdrawFlag: false,
        withdrawData: {},
        money: '',
        dialogwithdrawRecord: false,
        withdrawRecordData: null,
        // 搜索表单中的数据
        searchForm: {
          dept: "",
          keyword: "",
          type: "",
          verifyState: "",
          warrantState: ""
        },
        verifyList: [ // 认证状态
          {
            id:0,
            name:"未认证"
          },
          {
            id:1,
            name:"认证中"
          },
          {
            id:3,
            name:"认证成功"
          },
        ],
        warrantList: [ // 授权状态
          {
            id:0,
            name:"未授权"
          },
          {
            id:1,
            name:"授权中"
          },
          {
            id:3,
            name:"授权成功"
          },
        ],
        homeStoreList: [],
        companyList: [],
        tableData: [], //公司设置列表
        pageSize: 50,
        pageNum: 1,
        count: 0,
        companyForm: {}, //新增和编辑表单
        delIds: [],
        dialogViewVisible: false, //查看弹出框
        tabTitleIndex: 1,
        dictionary: {
          '38':'企业证件',
          '39':'合作方式',
          '40':'证件类型'
        },
        contractName: "",
        financialName: "",
        bankType:[
          {
            label:'个人账户',
            value:'0'
          },
          {
            label:'企业账户',
            value:'1'
          }
        ],
        //权限配置
        power: {
          'sign-set-gs': {
            state: false,
            name: '添加公司信息'
          },
          'sign-set-bl-tx-tix': {
            state: false,
            name: '提现'
          },
          'sign-set-bl-tx-info': {
            state: false,
            name: '提现记录'
          },
          'sign-set-bl-openPos': {
            state: false,
            name: '开通pos收款'
          }
        },
        bdHomeStoreList:[],
        preConFile: [], //合同章缩略图
        preFinFile: [], //财务章缩略图
        openpos:false,
        posInfo:{},
        posDialog:false
      }
    },
    mounted() {
      this.cityId = this.cityInfo.cityId
      this.cityName = this.cityInfo.cityName
      let res=this.getDataList
      if(res&&(res.route===this.$route.path)){
        this.tableData = res.data.list
        this.count = res.data.total
        let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
        this.searchForm = session.query
        if (this.searchForm.dept) {
          this.homeStoreList = new Array(JSON.parse(this.searchForm.dept))
          this.searchForm.dept = JSON.parse(this.searchForm.dept)
        } else {
          this.searchForm.dept = ''
        }
        delete this.searchForm.pageNum
        delete this.searchForm.pageSize
        this.pageNum = session.query.pageNum
      }else{
        // 列表查询
        this.getCompanyList()
      }
      // 枚举数据
      this.getDictionary()
    },
    directives: {
      loadmore: {
        bind(el, binding) {
          const selectWrap = el.querySelector('.el-table__body-wrapper')
          selectWrap.addEventListener('scroll', function() {
            let sign = 0
            const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
            if (scrollDistance <= sign) {
              binding.value()
            }
          })
        }
      }
    },
    watch: {
      deptName(val) {
        if (val === '') {
          this.page = 1
          this.end = true
          this.getSearchDepTableData()
        }
      }
    },
    methods: {
      // 导出功能
      getExcel() {
          if (this.withdrawRecordData.length === 0) return this.$message('没有可导出的数据!')
          this.excelCreate('/input/cashListExcel', {companyId:this.companyId})
      },
      accSub(arg1,arg2){
        var r1,r2,m,n;
        try{
          r1=arg1.toString().split(".")[1].length;
        }catch(e){
          r1=0;
        }
        try{
          r2=arg2.toString().split(".")[1].length;
        }catch(e){
          r2=0;
        }
        m=Math.pow(10,Math.max(r1,r2));
        n=(r1>=r2)?r1:r2;
        return ((arg2*m-arg1*m)/m).toFixed(n);
      },
      fomatFloat (num, decimal = 2) {
        num = num ? num : 0
        let multiples = Number('1'.padEnd(decimal+1,0)),
            multiplesNum = Math.round(parseFloat(num) * multiples) / multiples,
            strNum = multiplesNum.toString(),
            index = strNum.indexOf("."),
            decimalPoint,
            integer;

        if (index !== -1) {
          integer = strNum.substring(0,index)
          decimalPoint = strNum.substring(index+1).padEnd(decimal,0);
        } else {
          integer = strNum.substring(0);
          decimalPoint = '0'.padEnd(decimal,0)
        }
        return `${integer}.${decimalPoint}`;
      },
      filterMethod(val) {
        if(!val) return
        this.$ajax.get('/api/enterprise/all',{keyword: val}).then(res => {
          res = res.data
          if(res.status === 200) {
            this.companyList = res.data.list
          }
        }).catch(error =>{
          this.$message(res.message)
        })
      },
      // 绑定门店
      clickBind() {
        if (!this.bindForm.companyId || !this.bindForm.platformFeeRatio || this.bindDeptName.length === 0) {
          return this.$message({type:'warning',message:'请填写完整！'})
        }
        let param = {
          departmentList: this.bindDeptName.map(item => JSON.parse(item)),
          cityId:this.cityId.toString(),
          cityName:this.cityName
        }
        param = Object.assign(param,JSON.parse(JSON.stringify(this.bindForm)))
        
        this.$ajax.postJSON('/api/enterprise/dept_bind',param).then(res => {
          res = res.data
          if(res.status === 200) {
            this.$message({type:'success',message:res.message})
            this.dialogRDepisible = false
          }
        }).catch(error =>{
          this.$message(error)
        })
      },
      // 获取部门列表
      getDepList(keyword = '',type='bd') {
        if (!keyword) return
        let param = {keyword}
        this.$ajax.get('/api/enterprise/dept_all',param).then(res => {
          res = res.data
          if (res.status === 200) {
            if (type === 'search') {
              this.homeStoreList = res.data.list
            }
            this.bdHomeStoreList = res.data.list
          }
        }).catch(error => {
          this.$message(error)
        })
      },
      // 编辑按钮 显示隐藏
      editBtnShow(row) {
        if(row.version === 1) {
          // 旧版本四级门店不可编辑
          if(row.level != 4) {
            return true
          } else {
            return false
          }
        } else {
          // 新版本
          return true
        }
      },
      bindChange(data) {
        let copyData = JSON.parse(data[data.length-1])
        if (copyData.companyId) {
          this.$message(`${copyData.name}已被绑定`)
          this.bindDeptName.pop()
        }
      },
      selectRemoteMethodDep(query) {
        this.getDepList(query)
      },
      // 远程搜索
      remoteMethod1(query) {
        this.getDepList(query,'search')
      },
      // 初始化表单 数组集合
      initFormList() {
        this.companyForm = JSON.parse(JSON.stringify(obj1))
        this.companyForm.entBankList = new Array(JSON.parse(JSON.stringify(arr)))
      },
      // 获取公司设置列表
      getCompanyList: function (type="init") {
        let param = {
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
        param = Object.assign({},this.searchForm,param)
        param.deptId = param.dept ? JSON.parse(param.dept).depId : ''
        //点击查询时，缓存筛选条件
        if(type==='search'||type==='pagination'){
          sessionStorage.setItem('sessionQuery',JSON.stringify({
            path:'/company',
            url:'/enterprise',
            query:Object.assign({},param),
            methods:"get"
          }))
        }
        delete param.dept
        this.$ajax.get('/api/enterprise', param).then(res => {
          res = res.data
          if(res.status === 200) {
            this.tableData = res.data.list
            this.count = res.data.total
          }
        }).catch(error => {
            this.$message({message:error})
        })
      },
      //关闭模态窗
      handleClose(done) {
        this.delIds = []
        this.searchDepTableData = []
        this.end = true
        this.page = 1
        done()
      },
      addDep() {
        this.bdHomeStoreList = []
        this.companyList = []
        this.dialogRDepisible = true
        this.bindForm.companyId = null 
        this.bindForm.platformFeeRatio = null 
        this.bindDeptName = []
      },
      addCompany() {
        this.$router.push({
          path: '/addCompany',
          query: {
            type: true
          }
        })
      },
      listConfirm(item){
        console.log(item);
        let param = {
          id: item.id,
          cityId: item.cityId,
          cityName: item.cityName,
          name: item.name,
          address: item.address,
          documentCard: item.documentCard,
          lepName: item.lepName,
          lepDocumentCard: item.lepDocumentCard,
          lepPhone: item.lepPhone,
          contractSign: item.contractSign,
          financialSign: item.financialSign,
          entBankList: item.entBankList,
          franchiseRatio: "",
          verifyState:item.verifyState,
          warrantState:item.warrantState
        }
        this.$ajax.put(`/api/enterprise`,param).then(res => {
          res = res.data
          if(res.status === 200) {
            this.$message("授权短信已发送，请及时授权！")
            this.getCompanyList()
            this.delIds = []
          }
        }).catch(error => {
            this.$message({message:error})
        })
      },
      clickOpen(data,slot,index) {
        this.openSlot = slot
        this.vspInfo.vspCusid = '' 
        this.vspInfo.vspTermid = ''
        this.vspIndex = index
        this.dialogRelieveVisible = true
        this.relieveData = data
      },
      submitRelieve () {
        if (this.openSlot === 'vsp' && (this.vspInfo.vspCusid === '' || this.vspInfo.vspTermid === '')) {
          return this.$message('请填写完整！')
        }
        let params = this.openSlot === 'company' ? {
              companyId: this.relieveData.entId,
              storeId: this.relieveData.depId
            } : {
              depId: this.relieveData.depId,
              vspCusid: this.vspInfo.vspCusid,
              vspTermid: this.vspInfo.vspTermid
            },
            url = this.openSlot === 'company' ? '/api/enterprise/dept_unbind' : '/api/enterprise_pos/bind',
            method = this.openSlot === 'company' ? 'put' : 'postJSON';
        this.$ajax[method](url,params).then(res => {
          res = res.data
          if(res.status === 200) {
            if (this.openSlot === 'company') {
              this.searchDepTableData = this.searchDepTableData.filter(item => {
                return item.depId !== this.relieveData.depId
              })
              if (this.searchDepTableData.length === 0) {
                this.deptName = ''
              }
            } else {
              this.$set(this.searchDepTableData,this.vspIndex,Object.assign({},this.searchDepTableData[this.vspIndex],{
                vspCusid: this.vspInfo.vspCusid,
                vspTermid: this.vspInfo.vspTermid
              }))
            }
            this.dialogRelieveVisible = false
            
            this.$message({type:'success',message: res.message})
          }
        }).catch(error =>{
          this.dialogRelieveVisible = false
          this.$message(error)
        })
      },
      clickTitle(index) {
        this.tabTitleIndex = index
        if (index === 2) {
          this.end = true
        }
      },
      lazyLoad() {
        if(!this.end){
            return
        }
        if(this.page == 1){
            this.page++
        }
        this.$ajax.get('/api/enterprise/dept',{company_id: this.companyForm.id,keyword:this.deptName,pageNum:this.page}).then(res => {
          res = res.data
          if (res.status === 200) {
            if ((this.searchDepTableData.length + res.data.size) <= res.data.total) {
              this.page++
              this.searchDepTableData = this.searchDepTableData.concat(res.data.list)
            } else {
              this.end = false
            }
          }
        })
      },
      withdrawLazyLoad() {
        if(!this.withdrawEnd){
            return
        }
        if(this.withdrawPage == 1){
            this.withdrawPage++
        }
        this.$ajax.get('/api/enterprise/record_log',{companyId: this.companyId,pageNum:this.withdrawPage}).then(res => {
          res = res.data
          if (res.status === 200) {
            if ((this.withdrawRecordData.length + res.data.size) <= res.data.total) {
              this.withdrawPage++
              this.withdrawRecordData = this.withdrawRecordData.concat(res.data.list)
            } else {
              this.withdrawEnd = false
            }
          }
        })
      },
      getSearchDepTableData(type = '') {
        if (type === 'search') {
          this.page = 1
          this.end = true
        }
        this.$ajax.get('/api/enterprise/dept',{company_id: this.companyForm.id,keyword:this.deptName,pageNum:this.page}).then(res => {
          res = res.data
          if (res.status === 200) {
            this.searchDepTableData = res.data.list
            this.dialogViewVisible = true
          }
        })
      },
      withdrawRecord (row) {
        this.companyId = row.id
        this.withdrawPage = 1
        this.withdrawEnd = true
        this.$ajax.get('/api/enterprise/record_log',{companyId: row.id,pageNum:this.withdrawPage}).then(res => {
          res = res.data
          if (res.status === 200) {
            this.withdrawRecordData = res.data.list
            this.dialogwithdrawRecord = true
          }
        }).catch(error => {
          this.$message(error)
        })
      },
      // 提现
      withdraw(row,type) {
        let all = new Array(this.$ajax.get('/api/enterprise/bankCard',{companyId: row.id}),
        this.$ajax.get('/api/enterprise/funds',{companyId: row.id}))
        Promise.all(all).then((result) => {
          let bankCard = result[0],
              balance = result[1];
          if (bankCard.status === 200) {
            if (bankCard.data.status === 200) {
              let bindCardList = JSON.parse(bankCard.data.data).bindCardList.filter(item => {
                    return item.bindState == 1
                  });
              let card = {};
              console.log(bindCardList[0].bankCardNo);
              if (!bindCardList.length) {
                return this.$message('未绑定银行卡')
              } else if (bindCardList.length == 1) {
                card = bindCardList[0]
              } else {
                card = bindCardList.filter(item => {
                  return item.bankCardPro == 1
                })[0]
              }
              this.withdrawData.toBank = card.bankCardNo
              this.withdrawData.bankType = card.bankCardPro
              this.withdrawData.bindState = card.bindState
              this.withdrawData.bankName = card.bankName
            } else {
              return this.$message(bankCard.data.message)
            }
          }
          if (balance.status === 200) {
            if (balance.data.status === 200) {
              let allAmount = this.accSub(JSON.parse(balance.data.data).freezenAmount,JSON.parse(balance.data.data).allAmount)/100
              this.withdrawData.allAmount = allAmount <= 0 ? 0 : allAmount
              this.withdrawData.freezenAmount = JSON.parse(balance.data.data).freezenAmount
            } else {
              return this.$message(balance.data.message)
            }
          }
          this.withdrawData.fee = row.fee
          this.withdrawData.companyId = row.id
          this.withdrawData.companyName = row.name
          this.money = ''
          this.dialogwithdraw = true
        }).catch((error) => {
          this.$message(error)
        })
      },
      allMoney() {
        if (!Number(this.withdrawData.allAmount)){
          return this.$message('余额不足')
        }
        this.money = this.withdrawData.allAmount
      },
      clickWithdraw() {
        if (!parseFloat(this.money)) {
          return this.$message('请输入正常提现金额')
        }
        if (Number(this.withdrawData.allAmount) < Number(this.money)){
          return this.$message('余额不足')
        }
        if (Number(this.withdrawData.fee) > Number(this.money)){
          return this.$message('提现金额不得低于提现手续费')
        }
        this.dialogSubmitWithdraw = true
        this.submitWithdrawFlag = false
      },
      submitWithdraw() {
        this.submitWithdrawFlag = true
        let param = {
          companyId: this.withdrawData.companyId,
          companyName: this.withdrawData.companyName,
          toBank: this.withdrawData.toBank.toString(),
          bankType: this.withdrawData.bankType,
          fee: accMul(this.withdrawData.fee,100),
          amount: accMul(this.accSub(this.withdrawData.fee,this.money),100)
        }
        this.$ajax.postJSON('/api/enterprise/cash',param).then(res => {
          res = res.data
          console.log(res,3353434);
          if (res.status === 200) {
            this.dialogSubmitWithdraw = false
            this.dialogwithdraw = false
            this.submitWithdrawFlag = false
            this.money = ''
            this.withdrawData = {}
            this.$message({
              message: res.message,
              type: 'success'
            })
          }
        }).catch(error => {
          this.dialogSubmitWithdraw = false
          this.dialogwithdraw = false
          this.money = ''
          this.withdrawData = {}
          this.$message(error)
        })
      },
      handleCloses() {
        this.posDialog = false
      },
      //开通POS收款
      openPosCollection(data) {
        console.log(data);
        this.posInfo = data
        this.posDialog = true
      },
      //点击查看和编辑
      viewEditCompany(row, type) {
        if(type === 'init') {
          this.searchDepTableData = []
          this.deptName = ''
          this.end = true
          this.page = 1
          this.tabTitleIndex = 1
        }
        let currentRow = JSON.parse(JSON.stringify(row))
        let newForm = {
          id: currentRow.id,
          cityId: currentRow.cityId,
          cityName: currentRow.cityName,
          name: currentRow.name,
          address: currentRow.address,
          documentCard: currentRow.documentCard,
          lepName: currentRow.lepName,
          lepDocumentCard: currentRow.lepDocumentCard,
          lepPhone: currentRow.lepPhone,
          contractSign: currentRow.contractSign,
          financialSign: currentRow.financialSign,
          entBankList: currentRow.entBankList,
          franchiseRatio: "",
          verifyState:currentRow.verifyState,
          warrantState:currentRow.warrantState
        }
        this.companyForm = newForm
        //获取电子章文件名和签名展示缩略图
        this.contractName = newForm.contractSign.split('?')[1]
        this.financialName = newForm.financialSign.split('?')[1]
        let arr1 = [newForm.contractSign.split('?')[0]]
        let arr2 = [newForm.financialSign.split('?')[0]]
        this.fileSign(arr1, 'preload').then(res => {
            this.preConFile = res
        })
        this.fileSign(arr2, 'preload').then(res => {
            this.preFinFile = res
        })
        if (type !== 'init') {
          this.setCompanyData(newForm)
          this.$router.push({
            path: '/addCompany',
            query: {
              type: false
            }
          })
        } else {
          this.getSearchDepTableData()
        }
      },
      // 合同章 财务章 点击预览
      getPicture(type) {
        let img_arr = []
        if(type === 1) {
          img_arr.push({path:this.companyForm.contractSign.split('?')[0],name:this.companyForm.contractSign.split('?')[1]})
        } else {
          img_arr.push({path:this.companyForm.financialSign.split('?')[0],name:this.companyForm.financialSign.split('?')[1]})
        }
        this.previewPhoto(img_arr,0)
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getCompanyList('pagination')
      },
      // 查询
      queryFn() {
        this.pageNum = 1
        this.getCompanyList('search')
      },
      // 筛选条件重置
      resetFormFn() {
        this.searchForm.type = ""
        this.searchForm.keyword = ""
        this.searchForm.dept = ""
        this.searchForm.verifyState = ""
        this.searchForm.warrantState = ""
        this.pageNum = 1
      },
      getInt(num,index) {
        if(num===1) {
          this.searchForm.bankCard = this.$tool.numberInput(this.searchForm.bankCard)
        } else if(num===2) {
          this.companyForm.lepPhone = this.$tool.numberInput(this.companyForm.lepPhone)
        } else if(num===3) {
          this.companyForm.entBankList[index].bankCard = this.$tool.numberInput(this.companyForm.entBankList[index].bankCard)
        }
      },
      inputOnly(index,type){
        if(type==='bankAccountName') {
          this.$nextTick(()=>{
            this.companyForm.entBankList[index].bankAccountName=this.$tool.textInput(this.companyForm.entBankList[index].bankAccountName,3)
          })
        }else if(type==='bankBranchName') {
          this.$nextTick(()=>{
            this.companyForm.entBankList[index].bankBranchName=this.$tool.textInput(this.companyForm.entBankList[index].bankBranchName,4)            
          })
        }else if(type==='bankBranchCode') {
          this.$nextTick(()=>{
            this.companyForm.entBankList[index].bankBranchCode=this.$tool.numberInput(this.companyForm.entBankList[index].bankBranchCode)            
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
        } else if (type === 'platformFeeRatio') {
          this.bindForm.platformFeeRatio = this.$tool.cutFloat({
              val: this.bindForm.platformFeeRatio,
              max: 100
          });
        } else if (type === 'companyId') {
          this.bindForm.companyId = this.$tool.textInput(this.bindForm.companyId)  
        } else if (type === 'money') {
          console.log(this.money);
          this.money = this.$tool.cutFloat({
              val: this.money,
              num: 2
          });
        } else if (['vspCusid','vspTermid'].includes(type)) {
          this.vspInfo[type] = this.$tool.textInput(this.vspInfo[type],2)
        }
      },
      cutNumber(val) {
        this.$nextTick(()=>{
          this.companyForm.franchiseRatio=this.$tool.cutFloat({val:this.companyForm.franchiseRatio,max:100})
        })
      },
      // 证件类型改变 清除证件号信息
      idTypeChange() {
        this.companyForm.lepDocumentCard = ""
      },
      ...mapMutations(["setCompanyData"]),
    },
    filters: {
      formatBankCard(val) {
        return val.replace(/[\s]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ")
      }
    },
    computed: {
      cityInfo(){
        return this.getUser.user
      },
      version(){
        return this.getUser.version
      }
    }
}
</script>
<style lang="less">
.lock-dialog {
  .el-dialog__body {
    height: 600px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
.hover-tip {
  width: 300px;
}
.select-popper {
  width: 300px;
  .el-select-dropdown__item.selected::after {
    right: 12px!important;
  }
  // .selected {
  //   span::after {
  //     right: 12px;
  //   }
  // }
}
</style>
<style lang="less" scoped>
@import "~@/assets/common.less";
.required {
  &::before {
    content: "*";
    color: red;
    position: relative;
    top: 3px;
    margin-right: 1px;
  }
  &::after {
    display: none!important;
  }
}
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
  .width350{
    width: 350px!important;
  }
  .w180 {
    margin-right: 40px;
    /deep/ .el-input {
      width: 180px;
    }
  }
}
.headerDep{
  /deep/.el-select__tags-text{
    display: inline-block;
    max-width: 100px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    vertical-align:middle
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
    > span .el-button {
      width:100px;
      padding: 9px 15px;
      border-radius:20px;
      display: inline-flex;
      justify-content: center;
      color: #fff;
    }
    > span .el-button:first-of-type {
      width:90px;
      padding: 9px 15px;
      border-radius:20px;
      display: inline-flex;
      justify-content: center;
      color: rgba(71,141,227,1);
      background-color: rgba(255,255,255,1);
    }
  }
  .edit-btn{
    margin-left: 0!important;
  }
}
.dialog-info {
  /deep/ .el-dialog__header {
    padding-left: 0!important;
    .title-class-box {
      .current {
        color: #478de3;
        border-bottom: 4px solid #478de3;
      }
      span {
        padding: 8px 22px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
  .company-info {
    padding: 5px 20px 10px;
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
      color:rgba(35,50,65,1);
    }
    .tip {
      display: flex;
      span {
        color: #333;
        font-weight: bold;
        margin-right: 10px;
      }
      .message>p:last-child {
        color: #CD6D6D;
        i { font-weight: bold; color: #D56868; }
      }
    }
    &:first-child {
      .info-content {
        > .item {
          display: flex;
          > .el-form-item {
            display: flex;
            margin-bottom: 0;
            &:nth-child(-n+2) {
              margin-right: 60px;
            }
            /deep/ .el-input {
              width: 200px;
              .el-input__inner {
                height: 28px!important;
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
              width: 186px;
            }
          }
          .store-name {
            margin-left: -12px;
          }
          .id-card {
            margin-left: 14px;
          }
          .mobile {
            margin-left: -28px;
          }
          .tongyi {
            margin-left: -56px;
          }
          .gongshang {
            margin-left: -14px;
          }
          .zuzhi {
            margin-left: -28px;
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
      .addBankRow {
        position: relative;
        .row-item {
          display: flex;
          margin-top: 10px;
          >div label {
            margin-right: 8px;
            &::before {
              content: "*";
              color: red;
              position: relative;
              top: 3px;
              margin-right: 1px;
            }
          }
          >div:nth-child(-n+2) {
            margin-right: 20px;
          }
          &:nth-child(2) {
            padding-left: 28px;
          }
        }
        &:first-child {
          .button-box span:last-child {
            visibility: hidden;
          }
        }
        /deep/ .el-select, .el-input {
          width: 200px;
        }
        .zhi-hang {
          margin-left: 14px;
          /deep/ .el-input {
            width: 499px;
          }
        }
        .button-box {
          position: absolute;
          right: 25px;
          top: 25px;
        }
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
      }
    }
    &:last-child {
      border-top: 1px solid #edecf0;
      border-bottom: 1px solid #edecf0;
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
                  bottom: -30px;
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
    padding: 30px;
    .title {
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: bold;
    }
    .content-box {
      .content-item {
        margin-bottom: 20px;
        &.margin {
          margin-bottom: 40px;
        }
        span {
          display: inline-block;
          max-width: 500px;
          vertical-align: text-top;
          font-size: 14px;
          font-weight: bold;
          color: #233241;
        }
        > span:first-of-type {
          display: inline-block;
          width: 140px;
          text-align: right;
          font-weight: 300;
          color: #8492A6;
        }
        .bank-item {
          margin-bottom: 20px;
          span {
            font-size: 14px;
            font-weight: bold;
            color: #233241;
          }
          > span:first-of-type {
            display: inline-block;
            width: 140px;
            text-align: right;
            font-weight: 300;
            color: #8492A6;
          }
        }
      }
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
          width: 120px;
          height: 120px;
          background-color: rgba(236,238,241,1);
          position: relative;
          border-radius: 8px;
          /deep/ .picture {
            position: absolute;
            top: -6px;
            font-size: 160px!important;
          }
          img {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
          }
        }
      }
    }
  }
  .dep-container {
    padding: 30px 20px;
    .dep-search {
      margin-bottom: 30px;
      span {
        padding-right: 8px;
        font-size: 14px;
        color: #233241;
      }
      .el-select {
        width: 300px;
      }
    }
    .dep-content {
      .title {
        margin-bottom: 6px;
        font-size: 14px;
        > span:first-of-type {
          color: #8492A6;
        }
      }
      td {
        border: none!important;
      }
      .is-bind {
        color: rgb(114, 108, 108)
      }
    }
  }
  
  .dialog-footer {
    .el-button {
      width:100px;
      border-radius:20px;
    }
  }
}
.relieve-dialog {
  border-radius: 8px;
  .text {
    display: inline-block;
    padding: 0 3px;
    color: #478DE3;
  }
  .vsp-item {
    display: flex;
    line-height: 20px;
    .vsp-input {
      width: 150px;
    }
    &:first-child {
      margin: 20px 0;
    }
    label {
      width: 150px;
      padding-right: 8px;
      line-height: 2.2;
      text-align: right;
    }
  }
  /deep/ .el-dialog__header {
    border-radius: 8px 8px 0 0;
    font-weight: bold;
  }
  /deep/ .el-dialog__body {
    .company {
      height: 164px;
      line-height: 164px;
      text-align: center;
    }
    border-radius: 0 0 8px 8px;
  }
  /deep/ .el-dialog__close {
    font-weight: bold;
  }
  /deep/ .el-dialog__footer {
    .company {
      text-align: center;
    }
  }
}
.dep-dialog {
  .item {
    padding-bottom: 20px;
    .overflow {
      /deep/ .el-select__tags {
        max-height: 120px;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
    >span {
      display: inline-block;
      width: 78px;
      padding-right: 12px;
      text-align: right;
      color: #233241;
    }
    &:nth-of-type(2) {
      /deep/input {
        height: 40px;
      }
      /deep/::after{
        content: "%";
        display: inline-block;
        color: #ccc;
        position: absolute;
        top: 14px;
        right: 6px;
      }
    }
  }
  /deep/ .el-input {
    width: 300px;
  }
  /deep/ .el-dialog__header {
    border-radius: 8px 8px 0 0;
    font-weight: bold;
  }
  /deep/ .el-dialog__body {
    padding: 20px 30px 30px 70px;
    border-radius: 0 0 8px 8px;

  }
  /deep/ .el-dialog__close {
    font-weight: bold;
  }
}
.withdraw-dialog {
  /deep/.el-dialog__title {
    color: #606266;
  }
  .withdraw-content {
    padding: 20px;
    li {
      margin: 15px auto;
      /deep/.el-input {
        input {
          border: none;
          border-bottom: 1px solid #ccc;
          border-radius: 0;
          height: 17px;
          line-height: 17px;
          font-size: 16px;
          font-weight: bold;
        }
        &::before {
          content: "￥";
          position: absolute;
        }
      }
      .all {
        color: skyblue;
        cursor: pointer;
      }
      .tip {
        padding-left: 75px;
        color: red;
      }
    }
  }
}
.submit-dialog {
  /deep/.el-dialog__title {
    color: #606266;
  }
  .submit-content {
    padding: 20px 80px;
    p {
      display: flex;
      justify-content: center;
      padding-bottom: 20px;
    }
    .one {
      font-size: 36px;
      font-weight: bold;
    }
    .two {
      justify-content: space-between;
      font-size: 16px;
      color: skyblue;
    }
  }
}
.log-dialog {
  /deep/.el-dialog__title {
    color: #606266;
  }
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid rgba(237,236,240,1);
}
/deep/ .el-dialog__footer {
  padding-top: 10px;
  padding-bottom: 10px;
}
/deep/ .el-table th {
  background:rgba(238,242,251,1);
}
/deep/ .el-dialog__body {
  padding: 0;
}
</style>
