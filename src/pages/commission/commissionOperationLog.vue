<template>
  <div class="page-class" ref="tableComView">
    <!-- <p class="brand-nav">财务>操作日志</p> -->
    <!-- 查询组件 -->
    <uPlusScrollTop @propResetFormFn="reset" @propQueryFn="queryFn" class="commission-top" style="padding: 0 12px 12px">
      <el-input placeholder="操作内容" prefix-icon="el-icon-search" class="w300" v-model="searchData.keyword" clearable>
      </el-input>

      <!-- 三联下拉选择 -->
      <div class="triple-select">

        <el-select v-model="searchData.systemTag" class="w100" placeholder="体系" @change="changeSystem">
          <el-option v-for="item in systemTagSelect" :key="item.key" :label="item.value" :value="item.key">
          </el-option>
        </el-select>

        <select-tree class="select-tree" :systemKey="searchData.systemTag.toString()" :init="searchData.depName"
          :searchStatus="searchData.searchStatus" @checkCell="depHandleClick" @clear="clearDep">
        </select-tree>

        <el-select class="w100" placeholder="请选择人员" v-loadmore="moreEmploye" v-model="searchData.empId"
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

      <el-select v-model="searchData.typeId" class="w116 mr-16" placeholder="全部" clearable>
        <el-option v-for="item in isCalculation" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>

      <div class="triple-select">
        <div class="item-text">时间</div>
        <el-date-picker class="item-billing-date2 w212" v-model="searchData.bonusDateValue" type="daterange"
          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp">
        </el-date-picker>
      </div>
    </uPlusScrollTop>

    <div class="main">
      <div class="reveal-box">
        <div class="reveal-txt">当前共找到【{{ total }}】条数据</div>
      </div>
      <el-table :data="tableData" class="table-box" ref="tableCom" :max-height="tableNumberCom">
        <el-table-column prop="systemtagName" min-width="100" label="体系"></el-table-column>
        <el-table-column min-width="130" label="操作日期">
          <template slot-scope="scope">
            {{ dateFormat(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column min-width="170" label="操作人">
          <template slot-scope="scope">
            <span>{{ scope.row.createByDepName }}-{{
                scope.row.createByName
              }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="objectType.label" min-width="100" label="模块"></el-table-column>
        <el-table-column prop="content" min-width="300" label="操作内容"></el-table-column>
        <el-table-column prop="ip" min-width="200" label="IP地址"></el-table-column>
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
  name: "commissionSetting",
  mixins: [MIXINS],
  data() {
    return {
      //   计算状态
      isCalculation: [
        {
          value: 42,
          label: "提成计算",
        },
        {
          value: 43,
          label: "提成发放",
        },
        {
          value: 44,
          label: "提成设置",
        },
        {
          value: "",
          label: "全部",
        },
      ],
      searchData: {
        keyword: "", //内容
        systemTag: "", //体系
        depId: "", //部门编号
        depName: "", //部门名称
        empId: "", //员工编号
        empName: "", //员工姓名
        bonusDateValue: "",
        // startTime: "", //开始日期
        // endTime: "", //结束日期
        typeId: "", // 日志类型 （41、提成计算 42、提成发放 43、提成设置）
        // pageSize: "", //条数
        // pageNum: "", //页码
        searchStatus: true,
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
    reset() {
      this.searchData = {
        keyword: "", //内容
        // systemTag: this.$store.state.user.user.deptSystemtag || 0, //体系id
        systemTag: "",
        depId: "", //部门编号
        depName: "", //部门名称
        empId: "", //员工编号
        empName: "", //员工姓名
        bonusDateValue: "",
        typeId: "", // 日志类型
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
  watch: {
    "searchData.systemTag"(val) {
      val === ""
        ? (this.searchData.searchStatus = false)
        : (this.searchData.searchStatus = true);
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
</style>
