<template>
  <div class="page-class" ref="tableComView" v-if="power['sign-tcyw-tcff-query'].state">
    <!-- <p class="brand-nav">财务>提成发放</p> -->
    <!-- 查询组件 -->
    <uPlusScrollTop @propResetFormFn="reset" @propQueryFn="queryFn" class="commission-top" style="padding: 0 15px 15px">
      <el-input placeholder="登录账号/员工工号" prefix-icon="el-icon-search" class="w300" v-model="searchData.keyword"
        clearable>
      </el-input>
      <!-- 日期 -->
      <div class="triple-select set-data-class">
        <div class="item-text">结算周期</div>
        <el-date-picker class="item-billing-date w160" v-model="searchData.settleDate" type="monthrange"
          value-format="yyyy-MM">
        </el-date-picker>
      </div>
      
      <!-- 三联下拉选择 -->
      <div class="triple-select">

        <el-select class="w100" placeholder="体系" v-model="searchData.systemTag" @change="changeSystem">
          <el-option v-for="item in systemTagSelect" :key="item.key" :label="item.value" :value="item.key">
          </el-option>
        </el-select>

        <select-tree class="select-tree" :systemKey="searchData.systemTag.toString()" :init="searchData.depName"
          :searchStatus="searchData.searchStatus" @checkCell="depHandleClick" @clear="clearDep">
        </select-tree>

        <el-select class="w100 select-emp" placeholder="请选择人员" v-loadmore="moreEmploye" v-model="searchData.empId"
          @clear="clearEmp" clearable>
          <el-option v-for="item in EmployeList" :key="item.empId" :label="item.name" :value="item.empId">
          </el-option>
        </el-select>

        <!-- 接口还未实现体系兼职，延后上 -->
        <!-- <el-select filterable remote class="w100" placeholder="请选择" :clearable="true" :remote-method="employeByText" v-loadmore="moreEmploye"
          v-model="searchData.empName" @change="empHandleAdd" @clear="clearEmp">
          <el-option v-for="item in EmployeList" :key="item.empId" :label="item.name"
            :value="item.systemtag + '/' + item.depId + '/' + item.depName + '/' + item.empId + '/' + item.name">
          </el-option>
        </el-select> -->
      </div>

      <el-select v-model="searchData.isCalculation" class="w116 mr-16" placeholder="在职状态" clearable>
        <el-option v-for="item in isCalculation" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>

      <div class="triple-select">
        <el-select v-model="searchData.signDateValue" class="w100" @change="signDateChangeFn" clearable>
          <el-option v-for="item in signDateList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker class="item-billing-date2 w212" v-model="searchData.bonusDateValue" type="daterange"
          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>

      <el-select v-model="searchData.status" class="w116 mr-16" placeholder="发放状态" clearable>
        <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>

    </uPlusScrollTop>

    <div class="main">
      <div class="reveal-box">
        <div class="reveal-txt">当前共找到【{{ total }}】条数据 <span class="reveal-p1">发放人数：<em class="cl-red">{{empCount}}</em>人
            提成总金额：<em class="cl-red">{{moneySum|fomatFloat}}</em>元 已发放总金额：<em
              class="cl-red">{{moneyFFSum|fomatFloat}}</em>元
            未发放总金额：<em class="cl-red">{{moneyWFFSum|fomatFloat}}</em>元</span>
        </div>
        <el-button class="fr btn-orange-border" v-if="power['sign-tcyw-tcff-export'].state" @click="clickExportFn">导出
        </el-button>
        <el-button class="fr btn-orange" v-if="power['sign-tcyw-tcff-ff'].state" @click="batchCalculationFn">批量发放
        </el-button>
      </div>
      <el-table :data="tableData" class="table-box" @selection-change="handleSelectionChange" ref="tableCom"
        :max-height="tableNumberCom">
        <el-table-column type="selection" min-width="60" :selectable="selectableFn">
        </el-table-column>
        <el-table-column min-width="100" label="结算周期">
          <template slot-scope="scope">
            {{ scope.row.settleDate }}
          </template>
        </el-table-column>
        <el-table-column min-width="100" label="发放状态">
          <template slot-scope="scope">
            <span :class="scope.row.status == 0 ? 'cl-red' : 'cl-green'">{{
              scope.row.status == 0 ? "未发放" : "已发放"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="140" label="发放日期">
          <template slot-scope="scope">
            {{ dateFormat(scope.row.bonusDate) }}
          </template>
        </el-table-column>
        <el-table-column min-width="250" label="员工姓名">
          <template slot-scope="scope">
            {{ scope.row.bonusName +'-'+ scope.row.bonusSorterName }}
          </template>
        </el-table-column>
        <el-table-column min-width="100" label="在职状态">
          <template slot-scope="scope">
            {{isCalculation[scope.row.empStatus].label}}
          </template>
        </el-table-column>
        <el-table-column min-width="130" label="提成（元）">
          <template slot-scope="scope">
            {{scope.row.bonusMoney|fomatFloat}}
          </template>
        </el-table-column>
        <el-table-column min-width="120" label="操作">
          <template slot-scope="scope">
            <span v-if="power['sign-tcyw-tcff-ff'].state" :class="scope.row.status === 0 ? 'cl-blue' : ''"
              @click="clickIssueFn(scope)">{{ scope.row.status === 0 ? "发放" : "--" }}</span>
          </template>
        </el-table-column>
      </el-table>
      <myPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-size="pageSize" :total="total"></myPagination>
    </div>
  </div>
</template>

<script>
function getYearAndMonth(start, end) {
    var result = [];
    var newResult=[];
    var starts = start.split('-');
    var ends = end.split('-');
    var staYear = parseInt(starts[0]);
    var staMon = parseInt(starts[1]);
    var endYear = parseInt(ends[0]);
    var endMon = parseInt(ends[1]);
    while (staYear <= endYear) {
      if (staYear === endYear) {
        while (staMon <= endMon) {
            result.push({year: staYear, month: staMon});
            staMon++;
        }
        staYear++;
      } else {
        if (staMon > 12) {
          staMon = 1;
          staYear++;
        }
        result.push({year: staYear, month: staMon});
        staMon++;
      }
    }

  for(var i=0;i<result.length;i++){
    var year=result[i].year;
    var monthinit=result[i].month;
    if(monthinit<10){
      var month='0'+monthinit;
    }else{
      var month=monthinit;
    }
    var ym=year+'-'+month;
    newResult.push(ym);
  }

  return newResult;
}
import myPagination from "./myPagination";
import { MIXINS } from "@/assets/js/mixins";
import { FILTER } from "@/assets/js/filter";
export default {
  name: "commissionGrant",
  mixins: [MIXINS, FILTER],
  data() {
    return {
      power: {
        "sign-tcyw-tcff-query": {
          state: false,
          name: "查询",
        },
        "sign-tcyw-tcff-ff": {
          state: false,
          name: "发放/批量发放",
        },
        "sign-tcyw-tcff-export": {
          state: false,
          name: "导出",
        },
      },
      //   发放状态
      status: [
        {
          value: 0,
          label: "未发放",
        },
        {
          value: 1,
          label: "已发放",
        },
        {
          value: "",
          label: "全部",
        },
      ],
      //   签约时间
      signDateList: [
        {
          value: 0,
          label: "发放时间",
        },
        {
          value: 1,
          label: "提成生成时间",
        },
      ],
      //   在职状态
      isCalculation: [
        {
          value: 0,
          label: "待入职",
        },
        {
          value: 1,
          label: "在职",
        },
        {
          value: 2,
          label: "离职",
        },
        {
          value: "",
          label: "全部",
        },
      ],
      searchData: {
        keyword: "", //关键字
        settleDate: "", //yyyy-mm 结算周期
        systemTag: "", //体系id
        depId: "", //部门编号
        depName: "", //部门名称
        empId: "", //员工编号
        empName: "", //员工姓名
        signDateValue: 0,
        bonusDateValue: "",
        status: "", //发放状态
        // signDateStar: "", //发起日期开始
        // signDateEnd: "", //发起日期结束
        // bonusDateStar: "", //提成生成日期开始
        // bonusDateEnd: "", //提成生成日期结束
        isCalculation: "", //在职状态: 0待入职，1在职，2离职
        // pageSize: "",
        // pageNum: "",
        searchStatus: true,
      },
      defSettleDate: "", //初始化结算周期
      copySearchData: {},
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 20,
      selectionList: [],
      empCount: 0, //人数
      moneySum: 0, //提成总额
      moneyFFSum: 0, //已发放
      moneyWFFSum: 0, //未发放
    };
  },
  created() {
    //获取用户当前体系
    if (sessionStorage.getItem("userMsg")) {
      this.searchData.systemTag =
        JSON.parse(sessionStorage.getItem("userMsg")).user.deptSystemtag || 0;
    }
  },
  methods: {
    //重置
    reset() {
      this.searchData = {
        keyword: "", //关键字
        // settleDate: "", //yyyy-mm 结算周期
        settleDate: "", //yyyy-mm 结算周期
        // systemTag: this.$store.state.user.user.deptSystemtag || 0, //体系id
        systemTag: "",
        depId: "", //部门编号
        depName: "", //部门名称
        empId: "", //员工编号
        empName: "", //员工姓名
        signDateValue: 0,
        bonusDateValue: "",
        isCalculation: "", //在职状态: 0待入职，1在职，2离职
        status: "", //发放状态
        searchStatus: false,
      };
      this.EmployeList = []; //清空已获取的人员
    },
    // 查询
    queryFn() {
      this.currentPage = 1;
      if (this.searchData.bonusDateValue === null)
        this.searchData.bonusDateValue = "";
      this.copySearchData = { ...this.searchData };
      this.searchFn();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchFn();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.searchFn();
    },
    handleSelectionChange(val) {
      this.selectionList = val;
    },
    // 搜索数据
    searchFn() {
      let data = this.getParamFn();

      // 加载中
      this.$tool.layerAlert.call(this, { typeInfo: 2, message: "加载中" });

      let arr = {};
      arr.empCount = 0;
      arr.moneySum = 0;
      arr.moneyFFSum = 0;
      arr.moneyWFFSum = 0;

      this.$ajax
        .get("/api/bonus/bonusSummaryList", data)
        .then((res) => {
          res = res.data;
          if (res.status === 200) {
            let { list = [], pageSize = 20, pageNum = 1, total = 0 } =
              res.data || {};
            // 赋值
            Object.assign(this, {
              tableData: list,
              currentPage: pageNum || 1,
              pageSize,
              total,
            });

            if (list.length > 0) {
              arr.empCount = list[0].empCount || 0; //人数
              arr.moneySum = list[0].moneySum || 0; //提成总额
              arr.moneyFFSum = list[0].moneyFFSum || 0; //已发放
              arr.moneyWFFSum = list[0].moneyWFFSum || 0; //未发放
            }
            Object.assign(this, arr);
          }
          // 关闭加载中
          this.$tool.layerAlertClose();
        })
        .catch((err) => {
          Object.assign(this, arr);
          // 关闭加载中
          this.$tool.layerAlertClose();

          this.$message({
            message: err,
            type: "error",
          });
        });
    },
    // 签约时间下拉列表切换
    signDateChangeFn(val) {
      this.searchData.bonusDateValue = "";
    },
    // 选择部门
    depHandleClick(data) {
      this.searchData.depId = data.depId;
      this.searchData.depName = data.name;
      this.searchData.empId = "";
      this.searchData.empName = "";
      this.handleNodeClick(data,true);
    },
    // 获取员工信息
    empHandleAdd(val) {
      let depVal = val.split("/");
      this.searchData.systemTag = depVal[0];
      this.searchData.depId = depVal[1];
      this.searchData.depName = depVal[2];
      this.searchData.empId = depVal[3];
      this.searchData.empName = depVal[4];
      this.EmployeList = [];
      this.getEmploye(this.searchData.depId);
    },
    //人员搜索
    employeByText(val) {
      this.getEmployeByText(val);
    },
    // 选择体系
    changeSystem() {
      this.searchData.depId = "";
      this.searchData.depName = "";
      this.searchData.empId = "";
      this.searchData.empName = "";
      this.clearSelect();
      this.remoteMethod();
    },
    // 部门清空
    clearDep() {
      this.searchData.depId = "";
      this.searchData.empId = "";
      this.searchData.empName = "";
      this.clearSelect();
      this.remoteMethod();
    },
    // 人员清空
    clearEmp() {
      this.searchData.empId = "";
      this.searchData.empName = "";
      // this.clearSelect();
      // this.remoteMethod();
    },
    // 时间处理
    dateFormat(val) {
      return this.$tool.dateFormat(val);
    },
    // 初始时间
    initialTimeFn() {
      let d = this.dateFormat(new Date()).split("-");
      let t = d[1];
      d[1] = t > 0 ? t.toString().padStart(2, "0") : 12;
      d[0] = t > 0 ? d[0] : d[0] - 1;
      d.splice(2, 1);
      this.defSettleDate = new Array(d.join("-"),d.join("-"));
      this.searchData.settleDate = new Array(d.join("-"),d.join("-"));
    },
    // 批量发放
    batchCalculationFn() {
      let arr = [];

      if (this.selectionList.length <= 0) {
        this.$message({
          message: "未勾选数据！",
          type: "warning",
        });
        return false;
      }
      // 提示弹层
      this.$tool.layerAlert.call(this, {
        message: "确定发放提成吗？",
        title: "确定是否发放提成",
        callback: (action) => {
          // 如果为选择确定
          if (action === "confirm") {
            this.selectionList.forEach((e) => {
              arr.push(e.id);
            });
            this.updateBonusFn(arr);
          }
        },
      });
    },
    // 发放
    clickIssueFn(scope) {
      console.log(scope);
      let { row } = scope || {};
      let { id = 0 } = row || {};

      this.$tool.layerAlert.call(this, {
        message: `确定发放 ${scope.row.settleDate} 的提成吗？`,
        title: "确定是否发放提成",
        callback: (action) => {
          // 如果为选择确定
          if (action === "confirm" && id) {
            this.updateBonusFn([id]);
          }
        },
      });
    },
    // 批量发放请求
    updateBonusFn(arr = []) {
      // 加载中
      this.$tool.layerAlert.call(this, { typeInfo: 2 });
      this.$ajax
        .post("/api/bonus/updateBonus", { ids: arr.join() })
        .then((res) => {
          res = res.data;
          if (res.status === 200) {
            // 关闭加载中
            this.$tool.layerAlertClose();
            // 数据刷新
            this.searchFn();
          }
          // console.log(res);
        })
        .catch((err) => {
          // 关闭加载中
          this.$tool.layerAlertClose();

          this.$message({
            message: err,
            type: "error",
          });
        });
    },
    // 请求数据生成
    getParamFn() {
      let data = { ...this.copySearchData };
      let sign = {
        signDateStar: "", //发起日期开始
        signDateEnd: "", //发起日期结束
        bonusDateStar: "", //提成计算日期开始
        bonusDateEnd: "", //提成计算日期结束
      };

      data.settleDate = data.settleDate ? getYearAndMonth(data.settleDate[0],data.settleDate[1]).join() : '';
      let signJ =
        data.signDateValue === 0
          ? {
              signDateStar: data.bonusDateValue[0],
              signDateEnd: data.bonusDateValue[1],
            }
          : {
              bonusDateStar: data.bonusDateValue[0],
              bonusDateEnd: data.bonusDateValue[1],
            };

      // 删除多余属性
      delete data.bonusDateValue;

      Object.assign(data, sign, signJ, {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
      });
      
      return data;
    },
    // 导出
    clickExportFn() {
      let p = this.getParamFn();
      this.excelCreate("/input/bonusSummaryExcel", p);
    },
    // 勾选禁用
    selectableFn(row, rowIndex) {
      return row.status == 0 ? true : false;
    },
  },
  components: {
    myPagination,
  },
  mounted() {
    // 时间
    this.initialTimeFn();
    // 体系
    this.getSystemTagSelect();
    // 获取数据
    this.queryFn();
  },
  filters: {
    roundFilters: function (num, decimal = 2) {
      let str = num.toString()
      var index = str.indexOf(".");
      if (index !== -1) {
        num = Math.round(parseFloat(num) *100) /100
      } else {
        num = parseFloat(num).toFixed(decimal);
      }
      return parseFloat(num).toFixed(decimal);
    }
  },
  watch: {
    "searchData.systemTag"(val) {
      val === ""
        ? (this.searchData.searchStatus = false)
        : (this.searchData.searchStatus = true);
    },
  },
};
</script>
<style lang="less">
  .set-data-class {
    display: inline-flex;
    .item-billing-date {
      top: 3px;
      i,input,span {
        position: relative;
        top: -3px !important;
      }
    }
  }
</style>
<style scoped>
.brand-nav {
  background-color: #f5f5f5;
  height: 50px;
  line-height: 50px;
  border: none;
  font-size: 16px;
  padding-left: 20px;
}
.cl-blue {
  cursor: pointer;
}
</style>
