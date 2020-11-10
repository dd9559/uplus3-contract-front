<template>
  <div class="view" ref="tableComView">
    <ScreeningTop @propResetFormFn="reset" @propQueryFn="getData('search')">
      <div class="content">
        <div class="input-group">
          <label>关键字:</label>
          <el-tooltip content="合同编号/纸质合同编号/房源编号/客源编号/物业地址/业主/客户/手机号/收付ID" placement="top">
            <el-input class="w200" :clearable="true" size="small" v-model="searchForm.keyword" placeholder="请输入">
            </el-input>
          </el-tooltip>
        </div>
        <div class="input-group">
          <label>合同类型:</label>
          <el-select :clearable="true" class="width200" :class="{'width325':searchForm.contType.length>3}" multiple
            size="small" v-model="searchForm.contType" placeholder="请选择">
            <el-option v-for="item in dictionary['10']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>查询时间:</label>
          <div class="time-picker">
            <el-select :clearable="true" size="small" v-model="searchForm.timeType" placeholder="请选择">
              <el-option v-for="item in $tool.dropdown.dateType_money_zk" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
            <el-date-picker v-model="searchForm.timeRange" type="daterange" size="small" class="margin-left"
              value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <div class="input-group">
          <label>部门:</label>
          <div>
            <select-tree :data="DepList" :init="searchForm.depName" @checkCell="depHandleClick" @clear="clearDep"
              @search="searchDep"></select-tree>
          </div>
          <el-select :clearable="true" filterable remote :remote-method="test" v-loadmore="moreEmploye"
            @visible-change="empHandle" class="margin-left" size="small" v-model="searchForm.empName" placeholder="请选择"
            @change="empHandleAdd" @clear="clearDep">
            <el-option v-for="item in EmployeList" :key="item.empId" :label="item.name"
              :value="item.empId+'/'+item.depName+'/'+item.depId"></el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>票据状态:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.billStatus" placeholder="请选择">
            <el-option v-for="item in dictionary['56']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>审核状态：</label>
          <el-select :clearable="true" size="small" v-model="searchForm.zkAuditState" placeholder="请选择">
            <el-option v-for="item in dictionary['77']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收付款类:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.moneyType" placeholder="请选择">
            <el-option v-for="item in drop_MoneyType" :key="item.id" :label="item.name" :value="item.key"></el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>签约方式:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.recordType" placeholder="请选择">
            <el-option v-for="item in dictionary['64']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </div>
      </div>
    </ScreeningTop>
    <div class="view-context" ref="box">
      <div class="table-tool">
        <div class="tool-left">
          <h4 class="f14">
            <i class="iconfont icon-tubiao-11"></i>数据列表
          </h4>
        </div>
        <p>
          <el-button class="btn-info" round type="primary" size="small" @click="getExcel"
            v-if="power['sign-cw-zk-export'].state">导出</el-button>
        </p>
      </div>
      <el-table ref="tableCom" :max-height="tableNumberCom" border :data="list" header-row-class-name="theader-bg"
        class="info-scrollbar" style="width: 100%" @row-dblclick="toZkDetail">
        <el-table-column min-width="120" label="收付ID" prop="payCode" :formatter="nullFormatter"></el-table-column>
        <el-table-column label="合同信息" min-width="200" prop="cityName" :formatter="nullFormatter">
          <template slot-scope="scope">
            <ul class="contract-msglist">
              <li>
                合同:
                <span @click="toLink(scope.row,'cont')">{{scope.row.contCode}}</span>
              </li>
              <li class="code-paper" v-if="scope.row.recordType.value===2">
                纸质合同编号:
                <span @click="toLink(scope.row,'cont')">{{scope.row.paperCode|getLabel}}</span>
              </li>
              <li>
                房源:
                <span>{{scope.row.houseCode}}</span>
                <span>{{scope.row.houseOwner}}</span>
              </li>
              <li>
                客源:
                <span>{{scope.row.custCode}}</span>
                <span>{{scope.row.custName}}</span>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column min-width="160" label="物业地址">
          <template slot-scope="scope">
            <span v-if="scope.row.address.length===0">--</span>
            <template v-else>
              <p>{{scope.row.address.split(' ')[0]}}</p>
              <p>{{scope.row.address.split(' ')[1]}}</p>
            </template>
          </template>
        </el-table-column>
        <el-table-column min-width="60" label="合同类型" prop="contType" :formatter="nullFormatter"></el-table-column>
        <el-table-column min-width="60" label="签约方式" prop="recordType.label" :formatter="nullFormatter">
        </el-table-column>
        <el-table-column min-width="80" label="款类" prop="moneyType" :formatter="nullFormatter"></el-table-column>
        <el-table-column min-width="80" label="转款人">
          <template slot-scope="scope">
            <span>{{scope.row.inObjStore+"-"+scope.row.inObjName}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="120" label="当前审核人">
          <template slot-scope="scope">
            <p v-if="!scope.row.auditStore&&!scope.row.auditName">-</p>
            <template v-else>
              <span>{{scope.row.auditStore}}</span>
              <p>{{scope.row.auditName}}</p>
            </template>
            <p class="btn-text-info" type="text"
              v-if="getUser.user&&(getUser.user.empId===scope.row.preAuditId||getUser.user.empId===scope.row.auditBy)&&scope.row.checkStatus&&scope.row.checkStatus.value===0"
              @click="choseCheckPerson(scope.row,getUser.user.empId===scope.row.auditBy?2:1)">
              {{getUser.user.empId===scope.row.auditBy?'转交审核人':'设置审核人'}}</p>
          </template>
        </el-table-column>
        <el-table-column min-width="120" label="下一步审核人">
          <template slot-scope="scope">
            <p v-if="!scope.row.nextAuditStore&&!scope.row.nextAuditName">-</p>
            <template v-else>
              <span>{{scope.row.nextAuditStore}}</span>

              <p>{{scope.row.nextAuditName}}</p>
            </template>
            <p class="btn-text-info color-red" type="text"
              v-if="getUser.user&&(scope.row.nextAuditId!==0&&getUser.user.empId===scope.row.auditBy)&&scope.row.checkStatus&&scope.row.checkStatus.value===0"
              @click="choseCheckPerson(scope.row,3)">设置审核人</p>
          </template>
        </el-table-column>
        <el-table-column min-width="80" label="金额（元）">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.amoutList" :key="index">{{item.amount}}</p>
          </template>
        </el-table-column>
        <el-table-column label="转款时间" prop="createTime" :formatter="nullFormatter" min-width="130">
          <template slot-scope="scope">
            <span>{{scope.row.createTime|formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核时间" prop="createTime" :formatter="nullFormatter" min-width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.payStatus.value===3 || scope.row.payStatus.value===11">-</span>
            <span v-else>{{scope.row.toAccountTime|formatTime}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column min-width="90" label="收付状态">
          <template slot-scope="scope">
            <span v-if="scope.row.payStatusValue!==10">{{scope.row.payStatus|getLabel}}</span>
            <span class="text-warning" v-else @click="getErrorMsg(scope.row)">{{scope.row.payStatus|getLabel}}</span>
          </template>
        </el-table-column> -->
        <el-table-column min-width="80" label="审核状态" prop="payStatus">
          <template slot-scope="scope">
            <span v-if="scope.row.payStatus.value===11">已驳回</span>
            <span v-else-if="scope.row.payStatus.value===3">审核中</span>
            <span v-else>已通过</span>
          </template>
        </el-table-column>
        <el-table-column min-width="80" label="票据状态">
          <template slot-scope="scope">{{scope.row|billState}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120" class-name="null-formatter operation-btns">
          <template slot-scope="scope">

            <el-button type="text" @click="btnOpera(scope.row,1)" v-if="(power['sign-cw-zk-edit'].state&&
            (scope.row.payStatus.value===3||scope.row.payStatus.value===11))">编辑</el-button>

            <el-button type="text" @click="toZkDetail(scope.row)"
              v-if="((scope.row.auditBy===getUser.user.empId)&&scope.row.isDeal==3&&scope.row.payStatus.value!==11)||scope.row.grabDept&&scope.row.payStatus.value!==11">
              审核</el-button>

            <div style="color:red"
              v-if="scope.row.auditStore&&scope.row.auditName&&scope.row.auditBy!==getUser.user.empId&&scope.row.payStatus.value===3&&!scope.row.grabDept">
              {{scope.row.auditName}}正在审核
            </div>

            <template
              v-if="!(power['sign-cw-zk-edit'].state&&
            (scope.row.payStatus.value===3||scope.row.payStatus.value===11))&&!(((scope.row.auditBy===getUser.user.empId)&&scope.row.isDeal==3)||scope.row.grabDept)">
              -
            </template>

            <!-- {{[scope.row.auditBy,getUser.user.empId,scope.row.isDeal,scope.row.grabDept]}} -->

          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="list.length>0" class="pagination-info" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
        layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <!-- 转款 -->
    <div v-show="transterShow">
      <el-dialog title="编辑转款" :visible.sync="transterShow" :closeOnClickModal="$tool.closeOnClickModal" width="800px">
        <div class="transter-detail">
          <p class="title">合同信息</p>
          <p class="info">
            <span>合同编号：{{selectPayInfo&&selectPayInfo.contCode?selectPayInfo.contCode:"-"}}</span>&nbsp;&nbsp;&nbsp;
            <span>款类：{{transterInfoPerson&&transterInfoPerson.outPayType}}</span>&nbsp;&nbsp;&nbsp;
            <span>金额：{{transterInfoPerson&&transterInfoPerson.outMoney}}元&nbsp;&nbsp;
              {{transterInfoPerson&&transterInfoPerson.outMoney|moneyFormat}}</span>
          </p>
          <p>物业地址：{{selectPayInfo&&selectPayInfo.address?selectPayInfo.address:"-"}}</p>
          <p class="title">转款操作</p>
          <p>
            转入合同：
            <span
              v-if="transterInfoPerson.inContractId">{{transterInfoPerson&&transterInfoPerson.inContractCode?transterInfoPerson.inContractCode:"-"}}</span>
            <span class="select" style="margin:0 0 10px 0px;" @click="chooseCont()"
              v-else>{{(transterInfoPerson&&transterInfoPerson.inContractCode)?transterInfoPerson.inContractCode:"请选择合同"}}</span>
          </p>
          <p>物业地址：{{transterInfoPerson&&transterInfoPerson.propertyAddr?transterInfoPerson.propertyAddr :"-"}}</p>
          <div class="kuanlei clearfix">
            <label>选择款类：</label>
            <ul>
              <li v-for="(item,index) in kuanleiVal" :key="index">
                <moneyTypePop style="display: inline-block;" ref="moneyType" :data="moneyType" @checkCell="getCell"
                  :chooseIndex="index" v-if="transterShow" :init="item.name"></moneyTypePop>
                <el-input size="small" class="w200" placeholder="请输入金额" v-model="item.outMoney" @input="cutNum(index)">
                </el-input>
              </li>
            </ul>
          </div>
          <p style="color:#FF2711;">注：一旦转款成功，不同合同转款，实收金额相应增减；同一合同转款，实收金额不变</p>
          <p style="text-align:right;margin:50px 50px 0 0;">
            <el-button size="small" class="btn-info" round @click="transterShow=false">取消</el-button>
            <el-button size="small" class="btn-info" round type="primary" @click="transterSave()">保存</el-button>
          </p>
        </div>
        <el-dialog width="600px" title="选择合同" :visible.sync="chooseContShow" append-to-body
          :closeOnClickModal="$tool.closeOnClickModal" height="300" style="margin-top:-8vh;" v-show="chooseContShow">
          <div>
            <p style="width:600px;height:40px;line-height:65px;">
              <span style="float:left;" class="clearfix">关键字：</span>
              <el-input v-model="contKeyWord" maxlength="100" class="w200" style="float:left;" placeholder="请输入收款ID">
              </el-input>
              <el-button size="small" class="btn-info" round type="primary" style="float:right;margin:20px 20px 0 0;"
                @click="toContWord()">查询</el-button>
            </p>
            <div style="padding:0 0 50px 0;" class="about-cont">
              <el-table border :data="contList" style="width: 100%" header-row-class-name="theader-bg" key="other"
                @row-click="selectItem">
                <el-table-column width="40">
                  <template slot-scope="scope">
                    <span class="outSide">
                      <span class="inLine" :class="{'inLineBg':selectCode===scope.row.code}"></span>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width="120" label="合同编号" prop="code" :formatter="nullFormatter">
                </el-table-column>
                <el-table-column align="center" min-width="120" label="物业地址" prop="propertyAddr"
                  :formatter="nullFormatter"></el-table-column>
              </el-table>
              <el-pagination class="pagination-info" @current-change="handleCurrentChange2" :current-page="currentPage2"
                :page-size="pageSize2" layout="total, prev, pager, next, jumper" :total="contTotal"
                style="margin-top:30px;"></el-pagination>

              <p style="text-align:right;margin:50px 50px 0 0;">
                <el-button size="small" class="btn-info" round @click="chooseContShow=false">取消</el-button>
                <el-button size="small" class="btn-info" round type="primary" @click="sureCont()">确定</el-button>
              </p>
            </div>
          </div>
        </el-dialog>
        <el-dialog width="600px" title="确认保存" :visible.sync="sureSaveTransterShow" append-to-body
          :closeOnClickModal="$tool.closeOnClickModal" style="margin-top:8vh;">
          <div class="sure-transter-dialog">
            <p>确认转款？</p>
            <p>转款成功后，不同合同转款，原合同实收金额会减掉，转入合同</p>
            <p>实收金额会增加；同一个合同转款，实收金额不变</p>
            <p style="text-align:right;margin:50px 50px 0 0;">
              <el-button size="small" class="btn-info" round @click="sureSaveTransterShow=false">取消</el-button>
              <el-button size="small" class="btn-info" round type="primary" @click="transterSaveFinal()" v-dbClick>保存
              </el-button>
            </p>
          </div>
        </el-dialog>
      </el-dialog>
    </div>
    <checkPerson :show="checkPerson.state" :type="checkPerson.type" :bizCode="checkPerson.code"
      :flowType="checkPerson.flowType" @close="checkPerson.state=false" v-if="checkPerson.state" @submit="personChose"
      :showLabel="checkPerson.label" :page="checkPerson.page"></checkPerson>
  </div>
</template>

<script>
import { FILTER } from "@/assets/js/filter";
import { MIXINS } from "@/assets/js/mixins";
import { TOOL } from "@/assets/js/common";
import scrollBar from "@/components/scrollBar";
import moneyTypePop from "@/components/moneyTypePop";
import checkPerson from "@/components/checkPerson";
export default {
  mixins: [MIXINS, FILTER],
  components: {
    scrollBar,
    moneyTypePop,
    checkPerson,
  },
  data() {
    return {
      tableBody: 0,
      scrollWidth: 0,
      scrollLeft: 0,
      tableBox: null,
      activeView: "",
      searchForm: {
        contType: [],
        timeType: "",
        depName: "",
        deptId: "",
        empId: "",
        billStatus: "",
        proAccount: "",
        checkStatus: "",
        moneyType: "",
        payMethod: "",
        keyword: "",
        timeRange: "",
        payObjType: "",
        cooperation: "",
        recordType: "",
        hasCont: "", //有/无合同
        zkAuditState: "", //转款审核
      },
      tableTotal: {},
      list: [],
      dictionary: {
        10: "",
        56: "",
        64: "",
        77: "",
      },
      drop_MoneyType: [],
      //分页
      total: 0,
      currentPage: 1,
      pageSize: 10,
      //开票
      paperShow: false,
      paperInfoData: {}, //票据对象
      moneyTypes: [], //临时存放勾选的款类
      activeType: 0, //当前预览项
      activeRow: {}, //当前操作项
      //作废
      layer: {
        show: false,
        content: [],
      },
      //权限配置
      power: {
        "sign-cw-debt-export": {
          state: false,
          name: "导出",
        },
        "sign-cw-bill-invoice": {
          state: false,
          name: "开票",
        },
        "sign-cw-debt-edit": {
          state: false,
          name: "修改",
        },
        "sign-cw-debt-void": {
          state: false,
          name: "作废",
        },
        /*'sign-cw-bill-print':{
                      state: false,
                      name: '打印'
                    },*/
        "sign-cw-debt-rev": {
          state: false,
          name: "收款详情",
        },
        "sign-cw-debt-pay": {
          state: false,
          name: "付款详情",
        },
        "sign-com-htdetail": {
          state: false,
          name: "合同详情",
        },
        "sign-com-house": {
          state: false,
          name: "房源详情",
        },
        "sign-com-cust": {
          state: false,
          name: "客源详情",
        },
        "sign-cw-rev-update": {
          state: false,
          name: "编辑",
        },
        "sign-cw-bill-zk": {
          state: false,
          name: "转款",
        },
        "sign-cw-zk-edit": {
          state: false,
          name: "转款编辑",
        },
        "sign-cw-zk-export": {
          state: false,
          name: "转款导出",
        },
        "sign-cw-bill-print": {
          state: false,
          name: "打印",
        },
        "sign-cw-debt-invoice": {
          state: false,
          name: "开票",
        },
        "sign-viewcol-room": {
          state: false,
          name: "物业地址",
        },
      },
      transterShow: false,
      kuanleiVal: [
        {
          outType: "",
          outTypeId: "",
          outMoney: "",
        },
      ],
      chooseContShow: false, //控制选择合同弹框
      contKeyWord: "",
      contList: [], //合同数组
      contTotal: 1,
      selectCode: "", //选择合同编号
      selectCodeAll: "",
      currentPage2: 1,
      pageSize2: 5,
      sureSaveTransterShow: false,
      selectPayInfo: null,
      moneyType: [],
      transterInfoPerson: {},
      checkPerson: {
        state: false,
        type: "init",
        code: "",
        label: false,
        flowType: 0,
        page: "list",
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      let res = this.getDataList;
      if (res && res.route === this.$route.path) {
        this.list = res.data.page.list;
        this.total = res.data.page.total;
        this.tableTotal = Object.assign(
          {},
          res.data.payMentDataList,
          res.data.paymentDataList,
          { balance: res.data.balance },
          { sumFees: res.data.fees && res.data.fees.sumFees }
        );
        let session = JSON.parse(sessionStorage.getItem("sessionQuery"));
        this.searchForm = Object.assign({}, this.searchForm, session.query, {
          contType:
            session.query.contTypes.length > 0
              ? session.query.contTypes.split(",")
              : [],
        });
        // this.$set(this.searchForm,'contType',session.query.contTypes.split(','))
        // this.$
        this.searchForm.contType = this.searchForm.contType.map((item) => {
          return Number(item);
        });
        if (session.query.startTime) {
          this.searchForm.timeRange = [
            session.query.startTime,
            session.query.endTime,
          ];
          delete this.searchForm.startTime;
          delete this.searchForm.endTime;
        } else {
          this.searchForm.timeRange = [];
        }
        if (this.searchForm.empId) {
          this.dep = Object.assign({}, this.dep, {
            id: this.searchForm.deptId,
            empId: this.searchForm.empId,
            empName: this.searchForm.empName,
          });
          this.EmployeList.unshift({
            empId: this.searchForm.empId,
            name: this.searchForm.empName,
          });
          this.getEmploye(this.searchForm.deptId);
        }
        this.currentPage = this.searchForm.pageNum;
      } else {
        this.getData();
      }
      this.getDictionary();
      this.getMoneyTypes();
      this.getMoneyType();
      // this.remoteMethod()
    });
  },
  methods: {
    getExcel: function () {
      this.getData("search");
      let param = JSON.parse(JSON.stringify(this.searchForm));
      if (
        typeof param.timeRange === "object" &&
        Object.prototype.toString.call(param.timeRange) === "[object Array]"
      ) {
        param.startTime = param.timeRange[0];
        param.endTime = param.timeRange[1];
      }
      param.contTypes = param.contType.join(",");
      delete param.contType;
      delete param.timeRange;
      this.excelCreate("/input/zkAuditExcel", param);
    },
    test: function (val) {
      this.getEmployeByText(val);
    },
    reset: function () {
      this.$tool.clearForm(this.searchForm);
      this.EmployeList = [];
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData("pagination");
    },
    clearDep: function () {
      // 部门
      this.searchForm.deptId = "";
      this.searchForm.depName = "";
      // 员工
      this.searchForm.empId = "";
      this.searchForm.empName = "";
      this.clearSelect();
    },
    searchDep: function (payload) {
      /*this.DepList=payload.list
                this.searchForm.depName=payload.depName*/
      this.searchForm.empId = "";
      this.clearSelect("emp");
    },
    depHandleClick(data) {
      this.searchForm.deptId = data.depId;
      this.searchForm.depName = data.name;
      this.searchForm.empId = "";
      this.handleNodeClick(data);
    },
    empHandle: function (val) {
      console.log(this.searchForm.empId);
      if (
        val &&
        this.EmployeInit !== this.employeTotal &&
        this.searchForm.deptId
      ) {
        this.getEmployeByText();
      }
    },
    empHandleAdd(val) {
      let depVal = val.split("/");
      this.searchForm.empId = depVal[0];
      this.searchForm.deptId = depVal[2];
      this.searchForm.depName = depVal[1];
      this.EmployeList = [];
      this.getEmploye(this.searchForm.deptId);
    },
    getData: function (type = "init") {
      if (type === "search") {
        this.currentPage = 1;
      }
      let param = JSON.parse(JSON.stringify(this.searchForm));
      if (
        typeof param.timeRange === "object" &&
        Object.prototype.toString.call(param.timeRange) === "[object Array]"
      ) {
        param.startTime = param.timeRange[0];
        param.endTime = param.timeRange[1];
      }
      param.contTypes = param.contType.join(",");
      param.pageNum = this.currentPage;
      param.pageSize = this.pageSize;
      delete param.contType;
      delete param.timeRange;

      //点击查询时，缓存筛选条件
      if (type === "search" || type === "pagination") {
        sessionStorage.setItem(
          "sessionQuery",
          JSON.stringify({
            path: this.$route.fullPath,
            url: "/payInfo/zkAuditList",
            query: Object.assign({}, param, {
              empName: this.dep.empName,
            }),
          })
        );
      }
      this.$ajax
        .get("/api/payInfo/zkAuditList", param)
        .then((res) => {
          res = res.data;
          if (res.status === 200) {
            this.list = res.data.page.list;
            this.total = res.data.page.total;
            this.tableTotal = Object.assign(
              {},
              res.data.payMentDataList,
              res.data.paymentDataList,
              { balance: res.data.balance },
              { sumFees: res.data.fees && res.data.fees.sumFees }
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * 跳转详情页
     * @param row
     */
    toDetails: function (row) {},
    btnOpera: function (val) {
      this.transterShow = true;
      // console.log(val);
      // let param = {
      //   payId: val.id,
      // };
      // this.$ajax
      //   .get("/api/payInfo/validateInOut", param)
      //   .then((res) => {
      //     res = res.data;
      //     if (res.status === 200) {
      //       if (res.data) {
      this.kuanleiVal = [
        {
          outType: val.moneyTypeId,
          outTypeId: val.moneyTypePid,
          name: val.moneyType,
          outMoney: val.amount,
        },
      ];
      this.selectPayInfo = val;
      this.getTransterInfo(val.id);
      //       this.transterShow = true;
      //       this.selectPayInfo = val;
      //       this.getTransterInfo(val.id);
      //     } else {
      //       this.$message({
      //         message: `${res.message}`,
      //       });
      //     }
      //   }
      // })
      // .catch((error) => {
      //   this.$message({
      //     message: `${error}`,
      //   });
      // });
    },
    /**
     * 合同信息操作
     * @param type
     */
    toLink: function (row, type) {
      let param = {
        contType: row.contTypeId,
        contId: row.contId,
        contCode: row.contCode,
        operaType: type,
        power:
          type === "cont"
            ? this.power["sign-com-htdetail"]
            : type === "house"
            ? this.power["sign-com-house"]
            : type === "customer"
            ? this.power["sign-com-cust"]
            : "",
      };
      this.msgOpera(param);
    },
    // 获取收付款类
    getMoneyTypes: function () {
      this.$ajax.get("/api/payInfo/selectSmallMoneyType").then((res) => {
        res = res.data;
        if (res.status === 200) {
          this.drop_MoneyType = res.data;
        }
      });
    },
    // 转款操作
    btnTransfer(val) {
      console.log(val);
      let param = {
        payId: val.id,
      };
      this.$ajax
        .get("/api/payInfo/validateInOut", param)
        .then((res) => {
          res = res.data;
          if (res.status === 200) {
            if (res.data) {
              this.kuanleiVal = [
                {
                  outType: "",
                  outTypeId: "",
                  outMoney: "",
                },
              ];
              this.transterShow = true;
              this.selectPayInfo = val;
              this.getTransterInfo(val.id);
            } else {
              this.$message({
                message: `${res.message}`,
              });
            }
          }
        })
        .catch((error) => {
          this.$message({
            message: `${error}`,
          });
        });
    },
    getTransterInfo(id) {
      let param = {
        payId: id,
        isEdit: true,
      };
      this.$ajax
        .get("/api/payInfo/inOutContractInfo", param)
        .then((res) => {
          res = res.data;
          if (res.status === 200) {
            if (res.data.inContractCode) {
              this.transterInfoPerson = res.data;
            } else {
              this.transterInfoPerson = {};
            }
          }
        })
        .catch((error) => {
          this.$message({
            message: `${error}`,
          });
        });
    },
    addcommissionData() {
      this.kuanleiVal.push({
        outType: "",
        outTypeId: "",
        outMoney: "",
      });
    },
    delPeople(index) {
      this.kuanleiVal.splice(index, 1);
    },
    chooseCont() {
      this.chooseContShow = true;
      this.getContractList(1);
    },
    getContractList(pageNum, keyword) {
      let param = {
        pageNum: pageNum,
        pageSize: 5,
        keyword: keyword,
      };
      this.$ajax.postJSON("/api/contract/contractList", param).then((res) => {
        res = res.data;
        if (res.status === 200) {
          this.contList = res.data.list;
          this.contTotal = res.data.count;
          console.log(`this.contTotal${this.contTotal}`);
        }
      });
    },
    //选择合同
    selectItem(val) {
      console.log(val);
      if (this.selectCode === val.code) {
        this.selectCode = "";
      } else {
        this.selectCode = val.code;
        this.selectCodeAll = val;
      }
    },
    handleCurrentChange2(val) {
      console.log(`当前页: ${val}`);
      this.selectCode = "";
      this.currentPage2 = val;
      this.getContractList(val, this.contKeyWord);
    },
    transterSave() {
      let hash = {};
      // 判断是否有重复款类
      let flagArr = this.kuanleiVal.reduce((pre, cur) => {
        hash[cur.outType] ? "" : (hash[cur.outType] = true && pre.push(cur));
        return pre;
      }, []);

      let allMoney = null,
        nullType = 1;
      this.kuanleiVal.map((item) => {
        console.log(item.outMoney);
        if (!item.outMoney) {
          nullType = 2;
        }
        if (!item.outType) {
          nullType = 3;
        }
        allMoney += Number(item.outMoney);
      });
      if (!this.transterInfoPerson.inContractCode) {
        this.$message({
          message: "请选择转入合同",
        });
        // this.sureSaveTransterShow = false;
        return;
      }
      if (nullType == 2) {
        this.$message({
          message: "请输入转款金额",
        });
        // this.sureSaveTransterShow = false;
        return;
      } else if (nullType == 3) {
        this.$message({
          message: "请选择款类",
        });
        // this.sureSaveTransterShow = false;
        return;
      }
      if (allMoney > this.transterInfoPerson.inMoney) {
        this.$message({
          message: "编辑金额不能超过申请金额！",
        });
        return;
      }
      if (allMoney === 0) {
        this.$message({
          message: "转款金额不能为0",
        });
        // this.sureSaveTransterShow = false;
        return;
      }
      if (flagArr.length != this.kuanleiVal.length) {
        this.$message({
          message: "不能选择重复款类",
        });
        return;
      }
      this.sureSaveTransterShow = true;
    },
    transterSaveFinal() {
      let param = {
        InOutFormList: JSON.parse(JSON.stringify(this.kuanleiVal)),
        outId: this.selectPayInfo.contId, //转出的合同ID
        outCode: this.selectPayInfo.contCode, //转出的合同编号
        outPayInfoId: this.selectPayInfo.id, //转出的款项id
        outType: this.selectPayInfo.moneyTypeId, //转出的款类key
        outTypeId: this.selectPayInfo.moneyTypePid, //转出的款类id
        outMoney: this.selectPayInfo.amount, //转出时款类金额
        inId: this.transterInfoPerson.inId
          ? this.transterInfoPerson.inId
          : this.transterInfoPerson.inContractId, //转入的合同ID
        inCode: this.transterInfoPerson.inContractCode
          ? this.transterInfoPerson.inContractCode
          : "", //转入的合同编号
        payId: this.selectPayInfo.id,
      };
      this.$ajax
        .postJSON("/api/payInfo/editInOutPayInfo", param)
        .then((res) => {
          res = res.data;
          if (res.status === 200) {
            this.$message({
              message: "提交成功！",
              type: "success",
            });
            this.transterShow = false;
            this.sureSaveTransterShow = false;
            this.getData();
          }
        })
        .catch((error) => {
          this.$message({
            message: error,
            type: "error",
          });
        });
    },
    toContWord() {
      this.currentPage2 = 1;
      this.selectCode = "";
      this.getContractList(1, this.contKeyWord);
    },
    sureCont() {
      if (!this.selectCode) {
        this.$message({
          message: "请选择合同",
        });
        return;
      }
      this.$set(
        this.transterInfoPerson,
        "inContractCode",
        this.selectCodeAll.code
      );
      this.$set(
        this.transterInfoPerson,
        "propertyAddr",
        this.selectCodeAll.propertyAddr
      );
      this.$set(this.transterInfoPerson, "inId", this.selectCodeAll.id);
      this.chooseContShow = false;
      console.log(this.selectCodeAll);
      console.log(this.selectCodeAll.code);
      console.log(this.selectCodeAll.propertyAddr);
    },
    getMoneyType() {
      let param = {};
      this.$ajax.get("/api/payInfo/selectMoneyType", param).then((res) => {
        res = res.data;
        if (res.status === 200) {
          this.moneyType = this.moneyType.concat(res.data);
        }
      });
    },
    getCell: function (label, index) {
      this.kuanleiVal[index].outType = label.key;
      this.kuanleiVal[index].outTypeId = label.pId;
    },
    cutNum: function (index) {
      this.kuanleiVal[index].outMoney = this.$tool.cutFloat({
        val: this.kuanleiVal[index].outMoney,
        max: 999999999.99,
      });
    },
    toPayPages() {
      this.$router.push({
        path: "payBill",
        query: {
          payBillNoCont: 1,
        },
      });
    },
    personChose: function () {
      this.checkPerson.state = false;
      this.getData();
    },
    // 选择审核人
    choseCheckPerson: function (row, type) {
      this.checkPerson.flowType = 13; //转款审核
      this.checkPerson.code = row.payCode;
      this.checkPerson.state = true;
      this.checkPerson.type = type;
      if (row.nextAuditId === -1) {
        this.checkPerson.label = true;
      } else {
        this.checkPerson.label = false;
      }
    },
    //详情
    toZkDetail(item) {
      if (item.grabDept) {
        this.$ajax
          .get("/api/machine/getAuditAuth", {
            bizCode: item.payCode,
            flowType: 13,
          })
          .then((res) => {
            res = res.data;
            if (res.status === 200) {
              this.toZkDetailFun(item);
            }
          })
          .catch((error) => {
            this.$message({
              message: `${error}`,
            });
          });
      } else {
        this.toZkDetailFun(item);
      }
    },
    toZkDetailFun(item) {
      this.$router.push({
        path: "billDetails",
        query: {
          tab: "转款信息",
          id: item.id,
          type: item.inAccountType,
          power: this.getUser.user.empId === item.auditBy,
          print: this.power["sign-cw-bill-print"].state,
          bill: this.power["sign-cw-debt-invoice"].state,
          listName: 4,
          isZk: true,
        },
      });
    },
  },
  filters: {
    zeroFormatter: function (val) {
      if (!val) {
        return 0;
      } else {
        return val;
      }
    },
    billState: function (val) {
      if (!val) {
        return "--";
      } else {
        if (val.type === 2) {
          return "--";
        } else {
          return val.billStatus && val.billStatus.label
            ? val.billStatus.label
            : "--";
        }
      }
    },
    moneyFormat: function (val) {
      if (!val) {
        return "零";
      } else {
        return TOOL.toChineseNumber(val);
      }
    },
  },
};
</script>

<style scoped lang="less">
@import "~@/assets/common.less";
@import "~@/assets/less/lsx.less";

/deep/ .null-formatter {
  .cell:empty {
    position: relative;

    &:before {
      content: "--";
      width: 30px;
      display: inline-block;
    }
  }
}
/deep/.operation-btns {
  .el-button:nth-of-type(3n) {
    margin-left: 0;
  }
}

.width200 {
  width: 200px !important;
}

.width325 {
  width: 325px !important;
}

/deep/ .theader-bg {
  > th > .cell {
    white-space: normal !important;
  }
}

.row-scroll {
  position: fixed;
  /*left: 0;
    right: 0;*/
  bottom: 0;
  z-index: 999;
  background-color: @bg-white;
  padding: 0 1px;

  &-box {
    width: 100%;
    overflow-x: auto;

    > p {
      height: 1px;
    }
  }
}

.text-warning {
  color: red;
  cursor: pointer;
}

.margin-left-10 {
  margin-left: 10px;
}

.checkbox-info {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 1px solid @border-e6;

  &.active {
    position: relative;
    color: @color-blue;

    &:after {
      content: "\e65d";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.layer-paper {
  .center {
    text-align: center;
  }

  .paper-btn-blue {
    color: @color-white;
  }

  .paper-btn-float {
    position: absolute;
    right: 0;
    bottom: 20px;
  }
}

.paper-edit-box {
  margin: 0 40px;
  padding: 20px 0 80px;
  border-bottom: 1px solid @border-D8;
  position: relative;

  > ul {
    &:first-of-type {
      > li {
        margin-bottom: 20px;
        display: flex;
        align-items: center;

        > label {
          margin-right: 10px;
        }

        &:first-of-type,
        &:nth-of-type(2) {
          > p {
            &:first-of-type {
              width: 200px;
            }
          }
        }

        &:last-of-type {
          margin-bottom: 0px;
        }
      }
    }
  }

  .type-list {
    display: flex;

    > p {
      min-width: 140px;
      margin-right: 20px;
      display: inherit;
      align-items: center;

      > label.checkbox-info {
        margin-right: 10px;
      }
    }

    .input-group {
      margin-bottom: 0;
      margin-right: 20px;
    }
  }
}

.paper-watch-tab {
  > p {
    color: @color-blue;
    text-align: center;
    font-weight: bold;
    margin: 32px;
  }

  > ul {
    display: flex;
    justify-content: center;
    margin-bottom: 26px;

    > li {
      border-top: 2px solid @color-blue;
      border-bottom: 2px solid @color-blue;
      min-width: 100px;
      height: 36px;
      display: inherit;
      align-items: center;
      justify-content: center;

      &:first-of-type {
        border-left: 2px solid @color-blue;
        border-top-left-radius: 18px;
        border-bottom-left-radius: 18px;
      }

      &:last-of-type {
        border-right: 2px solid @color-blue;
        border-top-right-radius: 18px;
        border-bottom-right-radius: 18px;
      }

      &.active {
        background-color: @color-blue;
        color: @color-white;
      }
    }
  }
}

.contract-msglist {
  > li {
    text-align: left;

    > span {
      &:first-of-type {
        margin-right: 10px;
      }
    }

    &:first-of-type,
    &.code-paper {
      > span {
        &:first-of-type {
          color: @color-blue;
          margin-right: 10px;
          cursor: pointer;
        }
      }
    }
  }
}

.delete-dialog {
  > p {
    text-align: center;
    margin-bottom: @margin-10;
    font-size: @size-16;
  }
}

.view-header {
  .title {
    position: relative;
    height: 60px;
    display: flex;
    align-items: center;

    > p {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    }
  }

  .content {
    display: flex;
    flex-wrap: wrap;

    .input-group {
      margin-right: 10px;

      > label {
        text-align: center;
      }

      /*/deep/ .el-select, .el-input {
          width: 200px;
        }*/
    }
  }
}

.view-context {
  background-color: @color-white;
  padding: 0 @margin-10;

  /deep/ .theader-bg {
    > th {
      background-color: @bg-th;
    }
  }

  .table-tool {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: @margin-base 0;

    .tool-left {
      display: inherit;
      align-items: center;

      > h4 {
        > i {
          margin-right: 8px;
        }
      }

      > ul {
        display: flex;
        margin-left: 20px;

        > li {
          color: @color-6c;

          > span {
            color: @color-red;
          }
        }
      }
    }

    /*>p{
        position: absolute;
        top: 50%;
        right: 0;
        transform:translateY(-50%);
      }*/
  }
}

// 转款弹框
.transter-detail {
  padding: 20px 20px 50px 20px;
  .title {
    font-weight: bold;
  }
  .kuanlei {
    width: 100%;
    label {
      float: left;
      margin-top: 5px;
    }
    ul {
      li {
        float: right;
        margin: 10px 221px 0 0;
        &:first-of-type {
          margin-top: 0;
        }
      }
    }
  }
  > p {
    line-height: 40px;
    .select {
      display: inline-block;
      text-align: center;
      color: #fff;
      width: 140px;
      padding: 2px 0;
      background: #478de3;
      border-radius: 2px;
      cursor: pointer;
      height: 30px;
      line-height: 30px;
    }
  }
  .info {
    span {
      width: 33.3333%;
    }
  }
  .icon {
    display: inline-block;
    cursor: pointer;
    .icon-tubiao_shiyong-14 {
      font-size: 22px;
      color: @color-blue;
    }
    .icon-tubiao_shiyong-4 {
      font-size: 22px;
      color: @color-FF5;
    }
  }
}
.outSide {
  display: flex;
  justify-content: center;
  align-items: center;
  //box-sizing: border-box;
  //padding: 2px;
  width: 18px;
  height: 18px;
  border: 1px solid #ccc;
  border-radius: 50%;
  .inLine {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  .inLineBg {
    background: @color-blue;
  }
}
// /deep/ .pagination-info {
//   text-align: center;
//   margin-top: 30px;
// }
.about-cont {
  /deep/ .cell {
    line-height: 15px;
  }
}
.sure-transter-dialog {
  p {
    text-align: center;
    &:first-of-type {
      font-weight: bold;
      margin-top: 30px;
      font-size: 18px;
    }
    &:nth-of-type(2) {
      margin-top: 20px;
    }
    &:nth-of-type(2),
    &:nth-of-type(3) {
      color: #ff2711;
    }
  }
  padding-bottom: 20px;
  padding-block-start: 1.25vw;
}
.btn-text-info {
  padding: 0;
  color: @color-blue;
  cursor: pointer;

  &.color-red {
    color: red;
  }
}
</style>

