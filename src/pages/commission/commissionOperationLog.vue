<template>
  <div class="page-class" ref="tableComView">
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
        v-model="searchData.typeId"
        class="w116 mr-16"
        placeholder="全部"
        clearable
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
        <div class="reveal-txt">当前共找到【{{ total }}】条数据</div>
      </div>
      <el-table
        :data="tableData"
        class="table-box"
        ref="tableCom"
        :max-height="tableNumberCom"
      >
        <el-table-column
          prop="systemtagName"
          min-width="100"
          label="体系"
        ></el-table-column>
        <el-table-column min-width="130" label="操作日期">
          <template slot-scope="scope">
            {{ dateFormat(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column min-width="170" label="操作人">
          <template slot-scope="scope">
            <span
              >{{ scope.row.createByDepName }}-{{
                scope.row.createByName
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="objectType.label"
          min-width="100"
          label="模块"
        ></el-table-column>
        <el-table-column
          prop="content"
          min-width="300"
          label="操作内容"
        ></el-table-column>
        <el-table-column
          prop="ip"
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
          value: 41,
          label: "提成计算",
        },
        {
          value: 42,
          label: "提成发放",
        },
        {
          value: 43,
          label: "提成设置",
        },
      ],
      searchData: {
        keyword: "", //内容
        systemTag: "", //体系
        depId: "", //部门id
        depName: "",
        empId: "", //员工id
        bonusDateValue: "",
        // startTime: "", //开始日期
        // endTime: "", //结束日期
        typeId: "", // 日志类型 （41、提成计算 42、提成发放 43、提成设置）
        // pageSize: "", //条数
        // pageNum: "", //页码
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
      this.searchData = {
        keyword: "", //内容
        systemTag: "", //体系
        depId: "", //部门id
        depName: "",
        empId: "", //员工id
        bonusDateValue: "",
        typeId: "", // 日志类型 （41、提成计算 42、提成发放 43、提成设置）
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
    // 搜索数据
    searchFn() {
      let data = { ...this.copySearchData };

      // 加载中
      this.$tool.layerAlert.call(this, { typeInfo: 2, message: "加载中" });

      Object.assign(data, {
        startTime: data.bonusDateValue[0] || "",
        endTime: data.bonusDateValue[1] || "",
        pageSize: this.pageSize,
        pageNum: this.currentPage,
      });
      // 删除多余属性
      delete data.bonusDateValue;

      this.$ajax
        .get("/api/operation/getBonusList", data)
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
  },
  components: {
    myPagination,
  },
  mounted() {
    // 体系
    this.getSystemTagSelect();
    // 获取数据
    this.queryFn();
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
