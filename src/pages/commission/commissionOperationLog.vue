<template>
  <div class="page-class">
    <!-- <p class="brand-nav">财务>操作日志</p> -->
    <!-- 查询组件 -->
    <uPlusScrollTop
      @propResetFormFn="reset"
      @propQueryFn="queryFn"
      class="commission-top"
      style="padding: 0 12px 12px"
    >
      <el-input
        placeholder="操作内容"
        prefix-icon="el-icon-search"
        class="w300"
        v-model="searchData.keyword"
      ></el-input>

      <!-- 三联下拉选择 -->
      <el-select
        v-model="searchData.systemTag"
        class="w200 mr-16"
        placeholder="体系"
        clearable
      >
        <el-option
          v-for="item in systemTagSelect"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        >
        </el-option>
      </el-select>
      <div class="triple-select">
        <select-tree
          class="select-tree"
          :init="searchData.depName"
          @checkCell="depHandleClick"
          @clear="clearDep"
        ></select-tree>
        <el-select
          v-model="searchData.empId"
          v-loadmore="moreEmploye"
          class="w100"
          placeholder="选择人员"
          @change="handleEmpNodeClick"
          clearable
        >
          <el-option
            v-for="item in EmployeList"
            :key="item.empId"
            :label="item.name"
            :value="item.empId"
          >
          </el-option>
        </el-select>
      </div>

      <el-select
        v-model="searchData.isCalculation"
        class="w116 mr-16"
        placeholder="全部"
      >
        <el-option
          v-for="item in isCalculation"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <div class="triple-select">
        <div class="item-text">时间</div>
        <el-date-picker
          class="item-billing-date2 w212"
          v-model="searchData.bonusDateValue"
          type="monthrange"
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          value-format="timestamp"
        >
        </el-date-picker>
      </div>
    </uPlusScrollTop>

    <div class="main">
      <div class="reveal-box">
        <div class="reveal-txt">当前共找到【420】条数据</div>
      </div>
      <el-table :data="tableData" class="table-box">
        <el-table-column
          prop="a1"
          min-width="100"
          label="体系"
        ></el-table-column>
        <el-table-column
          prop="a2"
          min-width="130"
          label="操作日期"
        ></el-table-column>
        <el-table-column
          prop="a3"
          min-width="170"
          label="操作人"
        ></el-table-column>
        <el-table-column
          prop="a4"
          min-width="100"
          label="模块"
        ></el-table-column>
        <el-table-column
          prop="a5"
          min-width="300"
          label="操作内容"
        ></el-table-column>
        <el-table-column
          prop="a6"
          min-width="200"
          label="IP地址"
        ></el-table-column>
      </el-table>
      <myPagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
      ></myPagination>
    </div>
  </div>
</template>

<script>
import myPagination from "./myPagination";
import { MIXINS } from "@/assets/js/mixins";

export default {
  name: "commissionSetting",
  mixins: [MIXINS],
  data() {
    return {
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
        systemTag: "", //体系id
        depId: "", //部门编号
        depName: "",
        empId: "", //员工编号
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
  methods: {
    reset() {
      console.log("重置");
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
  },
  components: {
    myPagination,
  },
  mounted() {
    // 体系
    this.getSystemTagSelect();
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
</style>
