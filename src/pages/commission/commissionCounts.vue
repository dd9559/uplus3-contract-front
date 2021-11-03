<template>
  <div class="page-class commission-view" ref="tableComView" v-if="power['sign-tcyw-tcjs-query'].state">
    <!-- <p class="brand-nav">财务>提成计算</p> -->
    <!-- 查询组件 -->
    <uPlusScrollTop @propResetFormFn="reset" @propQueryFn="queryFn('search')" class="commission-top" style="padding: 0px 15px 15px">
      <el-input placeholder="合同编号/纸质合同编号/物业地址" prefix-icon="el-icon-search" class="w300" v-model="searchData.keyword" 
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

        <el-select v-model="searchData.systemTag" class="w100" placeholder="体系" @change="changeSystem">
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
      <div class="triple-select">
        <el-select v-model="searchData.signDateValue" class="w100" @change="signDateChangeFn" clearable>
          <el-option v-for="item in signDateList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker class="item-billing-date2 w212" v-model="searchData.bonusDateValue" type="daterange"
          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
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
        <el-button class="fr btn-orange-border" v-if="power['sign-tcyw-tcjs-export'].state"
        v-dbClick @click="searchFn('getExcel')" round size="small">导出
        </el-button>
        <el-button class="fr btn-orange" v-if="power['sign-tcyw-tcjs-calc'].state" @click="batchCalculationFn" round size="small">批量计算提成
        </el-button>
      </div>
      <el-table :data="tableData" class="table-box" ref="tableCom" :max-height="tableNumberCom" border>
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
          <template slot="header">分账金额
            <el-tooltip content="分账金额=合同总实收-第三方合作费-佣金支付费-权证费-平台费-企业管理费-手续费" placement="top">
              <img class="icon-prompt" src="../../assets/img/icon-commissionCounts-prompt.png" alt="说明">
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            {{ scope.row.agentReceipts == null ? "-" : scope.row.agentReceipts|roundFilters}}
          </template>
        </el-table-column>
        <el-table-column prop="settleMoney" min-width="105">
          <template slot="header">结算金额
            <el-tooltip content="结算金额=合同总实收-第三方合作费-佣金支付费-权证费-平台费-企业管理费-手续费" placement="top">
              <img class="icon-prompt" src="../../assets/img/icon-commissionCounts-prompt.png" alt="说明">
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            {{ scope.row.settleMoney == null ? "-" : scope.row.settleMoney|roundFilters}}
          </template>
        </el-table-column>
        <el-table-column prop="calculationStatus" min-width="85" label="计算状态">
          <template slot-scope="scope">
            {{isCalculation[scope.row.isCalculation].label}}
          </template>
        </el-table-column>
        <el-table-column prop="bonusMoney" min-width="85" label="提成金额">
          <template slot-scope="scope">
            {{ scope.row.isCalculation === 0 ? "-" : scope.row.bonusMoney|roundFilters}}
          </template>
        </el-table-column>
        <el-table-column prop="bonusFormula" min-width="265" label="提成计算公式">
          <template slot-scope="scope">
            {{ scope.row.isCalculation === 0 ? "-" : scope.row.bonusFormula  }}
          </template>
        </el-table-column>
        <el-table-column min-width="130" label="提成生成时间">
          <template slot-scope="scope">
            {{ scope.row.isCalculation === 0 ? "-" : dateFormat(scope.row.bonusDate) }}
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
  name: "commissionCounts",
  mixins: [MIXINS, FILTER],
  data() {
    return {
      power: {
        "sign-tcyw-tcjs-query": {
          state: false,
          name: "查询",
        },
        "sign-tcyw-tcjs-calc": {
          state: false,
          name: "批量计算提成",
        },
        "sign-tcyw-tcjs-export": {
          state: false,
          name: "导出",
        },
      },
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
        // signDateStar: "", //签约日期开始
        // signDateEnd: "", //签约日期结束
        // bonusDateStar: "", //提成计算日期开始
        // bonusDateEnd: "", //提成计算日期结束
        isCalculation: "", //计算状态（0、未计算1、已计算）
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
      dialogVisible:false,
      selectDate:this.$tool.xData()[0].value,
    };
  },
  created() {
    //获取用户当前体系
    if (sessionStorage.getItem("userMsg")) {
      this.searchData.systemTag =
        JSON.parse(sessionStorage.getItem("userMsg")).user.deptSystemtag || 0;
    }
    this.setPath(this.$tool.getRouter(['提成','提成业务','提成计算'],'commissionCounts'))
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
        isCalculation: "", //计算状态（0、未计算1、已计算）
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
        this.searchFn('init');
        console.log(this.$tool.xData());
        let d = this.dateFormat(new Date()).split("-");
        console.log(d,9);
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
    searchFn(type) {
      if (this.searchData.bonusDateValue === null)
        this.searchData.bonusDateValue = "";
        this.copySearchData = { ...this.searchData };
      let data = this.getParamFn();

      // 加载中
      // this.$tool.layerAlert.call(this, { typeInfo: 2, message: "加载中" });
      Object.assign(data, {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
      });
      if (type === 'getExcel' && JSON.stringify(data) === JSON.stringify(this.ajaxParams)) {
        if (!this.total) {
          this.$message.warning('当前筛选条件结果无数据！')
        } else {
          this.excelCreate("/input/bonusListExcel", data,Object.assign(data,{
            type:0
          }))
        }
        return
      }
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
            if (['init','search','getExcel'].includes(type)) {
              this.ajaxParams = JSON.parse(JSON.stringify(data))
            }
            if (type === 'getExcel') {
              if (!this.total) {
                this.$message.warning('当前筛选条件结果无数据！')
              } else {
                this.excelCreate("/input/bonusListExcel", data,Object.assign(data,{
                  type:0
                }));
              }
            }
          }
          // 关闭加载中
          // this.$tool.layerAlertClose();
        })
        .catch((err) => {
          // 关闭加载中
          // this.$tool.layerAlertClose();
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
      let t = d[1];
      d[1] = t > 0 ? t.toString().padStart(2, "0") : 12;
      d[0] = t > 0 ? d[0] : d[0] - 1;
      d.splice(2, 1);
      this.defSettleDate = new Array(d.join("-"),d.join("-"));
      this.searchData.settleDate = new Array(d.join("-"),d.join("-"));
    },
    // 批量计算
    batchCalculationFn() {
      this.$tool.layerAlert.call(this, {
        typeInfo: 3,
        title: "确认是否计算提成",
        callback: (action) => {
          // debugger
          // 如果为选择确定
          if (action === "confirm") {
            let select = document.getElementById("selectList")
            this.copySearchData = { ...this.searchData };
            let data = this.getParamFn();
            data.bonusDate = Number(select.value)
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
      Object.assign(data, sign, signJ);
      return data;
    },
    // 导出
    clickExportFn() {
      let data = this.getParamFn();
      Object.assign(data, {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        type: 0,
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
  filters: {
    roundFilters: function (num, decimal = 2) {
      if (num == '-') {
        return "-"
      }
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
    }
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
/deep/ .el-message-box {
  width: 450px;
}

</style>
