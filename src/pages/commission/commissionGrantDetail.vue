<template>
  <div class="page-class commission-view" ref="tableComView">
    <div class="main">
      <div class="reveal-box">
        <el-button class="fr btn-orange-border"
        v-dbClick @click="clickExportFn" size="small">导出
        </el-button>
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

import { MIXINS } from "@/assets/js/mixins";
import { FILTER } from "@/assets/js/filter";
import myPagination from "./myPagination";
import { mapMutations } from "vuex";
export default {
  name: "commissionGrantDetail",
  mixins: [MIXINS, FILTER],
  components: {
    myPagination,
  },
  data() {
    return {
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
    };
  },
  created() {
    //获取用户当前体系
    if (sessionStorage.getItem("userMsg")) {
      this.searchData.systemTag =
        JSON.parse(sessionStorage.getItem("userMsg")).user.deptSystemtag || 0;
    }
    this.setPath(this.$tool.getRouter(['提成','提成发放','提成发放明细'],'commissionGrant'))
  },
  beforeUpdate() {
    this.bodyScollShowFn();
  },
  methods: {
    // 查询
    queryFn() {
      this.currentPage = 1;
      if (this.searchData.bonusDateValue === null)
        this.searchData.bonusDateValue = "";

      this.searchData.settleDetailsIds = this.$route.query.settleDetailsIds
      this.searchData.settleDate = this.$route.query.settleDate
      this.copySearchData = { ...this.searchData };
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
    // 时间处理
    dateFormat(val) {
      return this.$tool.dateFormat(val);
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
        type: 1,
      });

      this.excelCreate("/input/bonusListExcel", data);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchFn();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.searchFn();
    },
    ...mapMutations(["bodyScollShowFn"]),
  },
  mounted() {
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
</style>
