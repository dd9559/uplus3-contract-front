<template>
  <div class="page-class" ref="tableComView">
    <!-- <p class="brand-nav">财务>提成计算</p> -->
    <!-- 查询组件 -->
    <uPlusScrollTop @propResetFormFn="reset" @propQueryFn="queryFn" class="commission-top" style="padding: 0 12px 12px">
      <el-input placeholder="合同编号/纸质合同编号/物业地址" prefix-icon="el-icon-search" class="w300" v-model="searchData.keyword">
      </el-input>
      <!-- 日期 -->
      <div class="item-text">结算周期</div>
      <el-date-picker class="item-billing-date w160" v-model="searchData.settleDate" type="month"
        value-format="yyyy-MM">
      </el-date-picker>
      <!-- 三联下拉选择 -->
      <div class="triple-select">

        <el-select v-model="searchData.systemTag" class="w100" placeholder="体系" @change="changeSystem">
          <el-option v-for="item in systemTagSelect" :key="item.key" :label="item.value" :value="item.key">
          </el-option>
        </el-select>

        <select-tree class="select-tree" :systemKey="searchData.systemTag.toString()" :init="searchData.depName"
          @checkCell="depHandleClick" @clear="clearDep">
        </select-tree>

        <el-select class="w100" placeholder="请选择人员" v-loadmore="moreEmploye" v-model="searchData.empId"
          @clear="clearEmp">
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
      <div class="triple-select">
        <el-select v-model="searchData.signDateValue" class="w100" @change="signDateChangeFn" clearable>
          <el-option v-for="item in signDateList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker class="item-billing-date2 w212" v-model="searchData.bonusDateValue" type="daterange"
          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp">
        </el-date-picker>
      </div>

      <el-select v-model="searchData.isCalculation" class="w116" placeholder="计算状态" clearable>
        <el-option v-for="item in isCalculation" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </uPlusScrollTop>
    <div class="main">
      <div class="reveal-box">
        <div class="reveal-txt">当前共找到【{{ total }}】条数据</div>
        <el-button class="fr btn-orange-border" @click="clickExportFn">导出</el-button>
        <el-button class="fr btn-orange" @click="batchCalculationFn">批量计算提成</el-button>
      </div>
      <el-table :data="tableData" class="table-box" ref="tableCom" :max-height="tableNumberCom">
        <el-table-column prop="empName" min-width="100" label="姓名"></el-table-column>
        <el-table-column prop="depName" min-width="110" label="部门"></el-table-column>
        <el-table-column prop="positionName" min-width="100" label="职位"></el-table-column>
        <el-table-column min-width="100" label="在职状态">
          <template slot-scope="scope">
            {{isWorking[scope.row.rstatus].label}}
          </template>
        </el-table-column>
        <el-table-column prop="empCode" min-width="100" label="员工编号"></el-table-column>
        <el-table-column min-width="105" label="结算日期">
          <template slot-scope="scope">
            {{ dateFormat(scope.row.settleTime) }}
          </template>
        </el-table-column>
        <el-table-column min-width="105" label="签约日期">
          <template slot-scope="scope">
            {{ dateFormat(scope.row.signDate) }}
          </template>
        </el-table-column>
        <el-table-column min-width="105" label="合同类型">
          <template slot-scope="scope">
            {{ scope.row.contType.label }}
          </template>
        </el-table-column>
        <el-table-column prop="contCode" min-width="125" label="合同编号"></el-table-column>
        <el-table-column prop="proAddr" min-width="145" label="物业地址"></el-table-column>
        <el-table-column prop="settleMoney" min-width="105">
          <template slot="header">结算金额
            <el-tooltip content="结算金额=合同总实收-第三方-佣金支付费-权证费" placement="top">
              <img class="icon-prompt" src="../../assets/img/icon-commissionCounts-prompt.png" alt="说明">
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="calculationStatus" min-width="85" label="计算状态">
          <template slot-scope="scope">
            {{isCalculation[scope.row.isCalculation].label}}
          </template>
        </el-table-column>
        <el-table-column prop="bonusMoney" min-width="85" label="提成金额"></el-table-column>
        <el-table-column prop="bonusFormula" min-width="265" label="提成计算公式"></el-table-column>
        <el-table-column min-width="130" label="提成生成时间">
          <template slot-scope="scope">
            {{ dateFormat(scope.row.bonusDate) }}
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
  name: "commissionCounts",
  mixins: [MIXINS],
  data() {
    return {
      //   签约时间
      signDateList: [
        {
          value: 0,
          label: "签约时间",
        },
        {
          value: 1,
          label: "提成生成时间",
        },
      ],
      //   在职状态
      isWorking: [
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
      ],
      //   计算状态
      isCalculation: [
        {
          value: 0,
          label: "未计算",
        },
        {
          value: 1,
          label: "已计算",
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
        // signDateStar: "", //签约日期开始
        // signDateEnd: "", //签约日期结束
        // bonusDateStar: "", //提成计算日期开始
        // bonusDateEnd: "", //提成计算日期结束
        isCalculation: "", //计算状态（0、未计算1、已计算）
        // pageSize: "",
        // pageNum: "",
      },
      copySearchData: {},
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 20,
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
        depName: "", //部门名称
        empId: "", //员工编号
        empName: "", //员工姓名
        signDateValue: 0,
        bonusDateValue: "",
        isCalculation: "", //计算状态（0、未计算1、已计算）
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
    // 搜索数据
    searchFn() {
      let data = this.getParamFn();

      // 加载中
      this.$tool.layerAlert.call(this, { typeInfo: 2, message: "加载中" });

      Object.assign(data, {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
      });

      this.$ajax
        .get("/api/bonus/bonusList", data)
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
    // 选择部门
    depHandleClick(data) {
      this.searchData.depId = data.depId;
      this.searchData.depName = data.name;
      this.searchData.empId = "";
      this.searchData.empName = "";
      this.handleNodeClick(data);
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
      console.log("employeByText");
      this.getEmployeByText(val);
    },
    // 选择体系
    changeSystem() {
      console.log("changeSystem");
      this.searchData.depId = "";
      this.searchData.depName = "";
      this.searchData.empId = "";
      this.searchData.empName = "";
      this.clearSelect();
      this.remoteMethod();
    },
    // 部门清空
    clearDep() {
      console.log("clearDep");
      this.searchData.depId = "";
      this.searchData.empId = "";
      this.searchData.empName = "";
      this.clearSelect();
      this.remoteMethod();
    },
    // 人员清空
    clearEmp() {
      console.log("clearEmp");
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
      let t = d[1] - 1;
      d[1] = t > 0 ? t.toString().padStart(2, "0") : 12;
      d.splice(2, 1);
      this.searchData.settleDate = d.join("-");
    },
    // 批量计算
    batchCalculationFn() {
      this.$tool.layerAlert.call(this, {
        message: "确认计算提成",
        title: "确认是否计算提成",
        callback: (action) => {
          // debugger
          // 如果为选择确定
          if (action === "confirm") {
            let data = this.getParamFn();
            // 加载中
            this.$tool.layerAlert.call(this, {
              typeInfo: 2,
              message: "加载中",
            });

            this.$ajax
              .get("/api/bonus/saveBonus", data)
              .then((res) => {
                res = res.data;
                if (res.status === 200 && res.data === "操作成功！") {
                  this.queryFn();
                  // 关闭加载中
                  this.$tool.layerAlertClose();
                  // 结算完成
                  this.$tool.layerAlert.call(this, { typeInfo: 1 });
                } else {
                  this.$tool.layerAlertClose();
                }
              })
              .catch((err) => {
                // 关闭加载中
                this.$tool.layerAlertClose();

                this.$message({
                  message: err,
                  type: "error",
                });
              });
          }
        },
      });
    },
    // 获取请求参数
    getParamFn() {
      let data = { ...this.copySearchData };
      let sign = {
        signDateStar: "", //签约日期开始
        signDateEnd: "", //签约日期结束
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

      Object.assign(data, sign, signJ);

      return data;
    },
    // 导出
    clickExportFn() {
      let data = this.getParamFn();
      Object.assign(data, {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
      });
      this.excelCreate("/input/bonusListExcel", data);
    },
  },
  components: {
    myPagination,
  },
  mounted() {
    // 提示弹层
    // this.$tool.layerAlert.call(this, {
    //     message: "确定计算 [结算周期] 的提成吗？",
    //     title: "确认是否计算提成",
    //     callback(){
    //         console.log(11)
    //     }
    // })
    // 结算完成
    // this.$tool.layerAlert.call(this, { typeInfo: 1 });

    // 加载中
    // this.$tool.layerAlert.call(this, { typeInfo: 2 });

    // 关闭加载中
    // setTimeout(() => {
    //     this.$tool.layerAlertClose();
    // }, 2000);

    // 时间
    this.initialTimeFn();
    // 体系
    this.getSystemTagSelect();
    // 获取数据
    this.queryFn();
  },
};
</script>

<style scoped lang="less">
.icon-prompt {
  width: 14px;
  height: 14px;
  display: inline-block;
  position: relative;
  top: -1px;
  vertical-align: middle;
  margin-left: 4px;
}
</style>
