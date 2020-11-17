<template>
  <div class="page-class" ref="tableComView">
    <!-- <p class="brand-nav">财务>提成发放</p> -->
    <!-- 查询组件 -->
    <uPlusScrollTop @propResetFormFn="reset" @propQueryFn="queryFn" class="commission-top" style="padding: 0 12px 12px">
      <el-input placeholder="登录账号/员工工号" prefix-icon="el-icon-search" class="w300" v-model="searchData.keyword">
      </el-input>
      <!-- 日期 -->
      <div class="item-text">结算周期</div>
      <el-date-picker class="item-billing-date w160" v-model="searchData.settleDate" type="month"
        :placeholder="initialTime" value-format="yyyy-MM">
      </el-date-picker>

      <!-- 三联下拉选择 -->
      <div class="triple-select">

        <el-select v-model="searchData.systemTag" class="w100" placeholder="体系" @change="clearSystem">
          <el-option v-for="item in systemTagSelect" :key="item.key" :label="item.value" :value="item.key">
          </el-option>
        </el-select>

        <select-tree class="select-tree" :systemKey="searchData.systemTag.toString()" :init="searchData.depName"
          @checkCell="depHandleClick" @clear="clearDep">
        </select-tree>

        <el-select v-model="searchData.empId" v-loadmore="moreEmploye" class="w100" placeholder="选择人员"
          @change="handleEmpNodeClick" clearable>
          <el-option v-for="item in EmployeList" :key="item.empId" :label="item.name" :value="item.empId">
          </el-option>

        </el-select>
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
        <el-date-picker class="item-billing-date2 w212" v-model="searchData.bonusDateValue" type="monthrange"
          range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份" value-format="timestamp">
        </el-date-picker>
      </div>
    </uPlusScrollTop>

    <div class="main">
      <div class="reveal-box">
        <div class="reveal-txt">当前共找到【{{ total }}】条数据 <span class="reveal-p1">发放人数：<em class="cl-red">{{empCount}}</em>人
            提成总金额：<em class="cl-red">{{moneySum}}</em>元 已发放总金额：<em class="cl-red">{{moneyFFSum}}</em>元
            未发放总金额：<em class="cl-red">{{moneyWFFSum}}</em>元</span>
        </div>
        <el-button class="fr btn-orange-border" @click="clickExportFn">导出</el-button>
        <el-button class="fr btn-orange" @click="batchCalculationFn">批量发放</el-button>
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
        <el-table-column prop="bonusMoney" min-width="130" label="提成（元）"></el-table-column>
        <el-table-column min-width="120" label="操作">
          <template slot-scope="scope">
            <span :class="scope.row.status === 0 ? 'cl-blue' : ''"
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
import myPagination from "./myPagination";
import { MIXINS } from "@/assets/js/mixins";
export default {
  name: "commissionGrant",
  mixins: [MIXINS],
  data() {
    return {
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
        depName: "",
        empId: "", //员工编号
        signDateValue: 0,
        bonusDateValue: "",
        // signDateStar: "", //发起日期开始
        // signDateEnd: "", //发起日期结束
        // bonusDateStar: "", //提成生成日期开始
        // bonusDateEnd: "", //提成生成日期结束
        isCalculation: "", //在职状态: 0待入职，1在职，2离职
        // pageSize: "",
        // pageNum: "",
      },
      copySearchData: {},
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 20,
      initialTime: "",
      selectionList: [],
      empCount: 0, //人数
      moneySum: 0, //提成总额
      moneyFFSum: 0, //已发放
      moneyWFFSum: 0, //未发放
    };
  },
  created() {
    this.searchData.systemTag = this.$store.state.user.user.deptSystemtag || 0; //获取用户当前体系
  },
  methods: {
    //重置
    reset() {
      this.searchData = {
        keyword: "", //关键字
        settleDate: "", //yyyy-mm 结算周期
        systemTag: this.$store.state.user.user.deptSystemtag || 0, //体系id
        depId: "", //部门编号
        depName: "",
        empId: "", //员工编号
        signDateValue: 0,
        bonusDateValue: "",
        isCalculation: "", //在职状态: 0待入职，1在职，2离职
      };
    },
    // 查询
    queryFn() {
      this.currentPage = 1;
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
              total
            });
            
            if (list.length > 0) {
              let arr = {};
              arr.empCount = list[0].empCount; //人数
              arr.moneySum = list[0].moneySum; //提成总额
              arr.moneyFFSum = list[0].moneyFFSum; //已发放
              arr.moneyWFFSum = list[0].moneyWFFSum; //未发放

              Object.assign(this, arr);
            }
          }
          // 关闭加载中
          this.$tool.layerAlertClose();
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
    // 签约时间下拉列表切换
    signDateChangeFn(val) {
      this.searchData.bonusDateValue = "";
    },
    // 体系选择清空部门/人员
    clearSystem() {
      this.searchData.depName = "";
      this.searchData.depId = "";
      this.searchData.empId = "";
      this.clearSelect();
      this.remoteMethod();
    },
    // 部门第二版 选择部门
    depHandleClick(data) {
      this.searchData.depId = data.depId;
      this.searchData.depName = data.name;
      this.searchData.empId = "";
      this.handleNodeClick(data);
    },
    // 部门第二版 删除
    clearDep() {
      this.searchData.depId = "";
      this.searchData.empId = "";
      this.clearSelect();
      this.remoteMethod();
    },
    // 时间处理
    dateFormat(val) {
      return this.$tool.dateFormat(val);
    },
    // 初始时间
    initialTimeFn() {
      let d = this.dateFormat(new Date()).split("-");
      let t = d[1] - 1;
      d[1] = t > 0 ? t.toString().padStart(2, "0") : 12;
      d.splice(2, 1);
      this.initialTime = d.join("-");
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
        message: "确定计算 [结算周期] 的提成吗？",
        title: "确认是否计算提成",
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
        title: "确认是否发放提成",
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
  watch: {
    "searchData.systemTag"(val) {
      console.log(val);
    },
  },
};
</script>

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
