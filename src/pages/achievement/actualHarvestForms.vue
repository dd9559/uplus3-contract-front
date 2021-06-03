<template>
  <div class="view-container" ref="tableComView">
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
      <el-form class="header" ref="propForm" size="small">
        <div class="content">
          <el-form-item label="签约日期">
            <el-date-picker
              v-model="searchTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="合同类型">
            <el-select v-model="contType" style="width:200px" multiple clearable placeholder="请选择">
              <el-option
                v-for="item in dictionary['10']"
                v-if="[1,2,3].includes(item.key)"
                :key="item.value"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门" class="dep">
            <select-tree
              :data="DepList"
              :init="departmentName"
              @checkCell="depHandleClick"
              @clear="clearDep"
              @search="searchDep"
            ></select-tree>
            <el-select
              :clearable="true"
              filterable
              remote
              :remote-method="test"
              v-loadmore="moreEmploye"
              @visible-change="empHandle"
              class="margin-left"
              size="small"
              v-model="depUser"
              placeholder="请选择"
              @change="empHandleAdd"
            >
              <el-option
                v-for="item in EmployeList"
                :key="item.empId"
                :label="item.name"
                :value="item.empId+'/'+item.depName+'/'+item.depId"
                @clear="clearDep"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </ScreeningTop>
    <div class="table-list">
      <div class="tab">
        <div class="forms-tab">
            <span :class="formsCurrent == index ? 'curent' : ''" v-for="(item,index) of ['应收报表','结算报表']" :key="index" @click="toggleForms(index,'formsCurrent')">{{item}}</span>
        </div>
        <div class="table-tab">
            <span :class="tabCurrent == index ? 'curent' : ''" v-for="(item,index) of ['人员','分组','分店','片区','大区','事业部']" :key="index" @click="toggleForms(index,'tabCurrent')">{{item}}</span>
        </div>
      </div>
      <el-table
        :data="achList"
        ref="tableCom"
        style="width: 100%"
        border
        :max-height="tableNumberCom"
      >
        <el-table-column label="买卖">
        <el-table-column label="合同编号" width="128">
          <template slot-scope="scope">
            <p>
              合同编号：
              <span>{{scope.row.code}}</span>
            </p>
            <p v-show="scope.row.recordType&&scope.row.recordType.value==2">
              纸质合同编号：
              <span>{{scope.row.pCode}}</span>
            </p>
            <p></p>
          </template>
        </el-table-column>
        <el-table-column label="佣金支付费（元）" width="128">
          <template slot-scope="scope">{{userInfo.cityId != 1 ? scope.row.commissionPayment:0}}</template>
        </el-table-column>
        <el-table-column label="权证费用（元）" width="128">
          <template slot-scope="scope">{{scope.row.warrantFee}}</template>
        </el-table-column>
        <el-table-column label="建筑面积" width="128">
          <template slot-scope="scope">{{scope.row.builtArea?scope.row.builtArea:'-'}}</template>
        </el-table-column>
        <el-table-column label="签约方式" width="128">
          <template slot-scope="scope">
            <span>{{scope.row.recordType&&scope.row.recordType.label?scope.row.recordType.label:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同类型" prop="contType.label" width="128"></el-table-column>

        </el-table-column>

        <el-table-column label="租赁">

        <el-table-column label="变更/解约" prop="contChangeState.label" width="128"></el-table-column>
        <el-table-column label="签约日期" width="100">
          <template slot-scope="scope">{{scope.row.signDate | formatTime}}</template>
        </el-table-column>
        <el-table-column label="物业地址" prop="propertyAddr" width="100"></el-table-column>
        <el-table-column label="签约单数" prop="amount" width="100"></el-table-column>


        </el-table-column>

        <el-table-column label="代办">


        <el-table-column label="分成人" prop="assignor" width="100"></el-table-column>
        <el-table-column label="在职状态" prop="jobStatus.label" width="100"></el-table-column>
        <el-table-column label="分成门店" prop="level4" width="150"></el-table-column>

        </el-table-column>

        <el-table-column label="总业绩">

        <el-table-column label="角色类型" prop="roleType.label" width="50"></el-table-column>
        <el-table-column label="分成比例(%)" prop="ratio"></el-table-column>
        </el-table-column>
        
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import ScreeningTop from "@/components/ScreeningTop";
import { MIXINS } from "@/assets/js/mixins";
import { FILTER } from "@/assets/js/filter";
var param = {};
export default {
  mixins: [MIXINS, FILTER],
  data() {
    return {
        formsCurrent: 0,
        tabCurrent: 0,






      Loading: false,
      departmentName: "",
      department: [],
      keyword: "",
      searchTime: [],
      tableData: [],
      contType: "",
      contStatus: "",
      signType: "",
      jobStatus: "",
      pageSize: 50,
      empName: "",
      pageNum: 1,
      total: 0,
      dictionary: {
        "10": "", //合同类型（筛选条件）
        "9": "", //合同状态
        "64": "", //签约方式  线上线下
        "20": "", //在职状态
        "6": "",
      },
      users: [],
      userMsg: {}, //当前登录人信息
      type: [],
      depUser: "",
      achList: [],
      power: {
        "sign-set-log-query": {
          state: false,
          name: "查询",
        },
      },
    };
  },
  created() {
    this.getAdmin(); //获取当前登录人信息
    this.getDictionary();
    this.getAchList2();
    this.initTimePicker();
  },
  mounted() {
    this.remoteMethod("power");
  },
  methods: {
      toggleForms(curent,key) {
          this[key] = curent
      },






    initTimePicker() {
      var date = new Date();
      date = date.setDate(1);
      date = this.$tool.dateFormat(date);
      var date2 = this.$tool.dateFormat(Date.now());
      this.$nextTick(() => {
        this.searchTime = [date, date2];
      });
    },
    getAchList() {
      let param = {
        keyword: this.keyword,
        startTime:
          this.searchTime && this.searchTime.length != 0
            ? this.searchTime[0]
            : "",
        endTime:
          this.searchTime && this.searchTime.length != 0
            ? this.searchTime[1]
            : "",
        depId: this.department,
        empId: this.depUser,
        tradeTypes: this.contType.length == 0 ? "" : this.contType.join(","),
        status: this.contStatus,
        recordType: this.signType,
        isJob: this.jobStatus.value,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      if (param.empId) {
        param.empId = param.empId.split("/")[0];
      }
      this.$ajax
        .get("/api/achievementSheet/getAchievementContractSumList", param)
        .then((res) => {
          res = res.data;
          if (res.status == 200) {
            this.achList = res.data.list;
            this.total = res.data.total;
          }
        })
        .catch((err) => {
          // debugger
          this.$message.error(err);
        });
    },
    getAchList2() {
      let param = {
        keyword: this.keyword,
        depId: this.department,
        empId: this.depUser,
        tradeTypes: this.contType,
        status: this.contStatus,
        recordType: this.signType,
        isJob: this.jobStatus.value,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      this.$ajax
        .get("/api/achievementSheet/getAchievementContractSumList", param)
        .then((res) => {
          res = res.data;
          if (res.status == 200) {
            this.achList = res.data.list;
            this.total = res.data.total;
          }
        })
        .catch((err) => {
          // debugger
          this.$message.error(err);
        });
    },
    getExcel() {
      let param = {
        keyword: this.keyword,
        startTime:
          this.searchTime && this.searchTime.length != 0
            ? this.searchTime[0]
            : "",
        endTime:
          this.searchTime && this.searchTime.length != 0
            ? this.searchTime[1]
            : "",
        depId: this.department,
        empId: this.depUser,
        tradeTypes: this.contType.join(","),
        status: this.contStatus,
        recordType: this.signType,
        isJob: this.jobStatus.value,
        // pageNum: this.pageNum,
        // pageSize: this.pageSize,
      };
      if (param.empId) {
        param.empId = param.empId.split("/")[0];
      }
      this.excelCreate("/input/AchievementContractExcel", param);
    },
    searchDep: function (payload) {
      /*this.DepList=payload.list
                this.departmentName=payload.depName*/
    },
    depHandleClick(data) {
      this.depUser = "";
      this.department = data.depId;
      this.departmentName = data.name;
      this.handleNodeClick(data);
    },
    clearDep: function () {
      this.depUser = "";
      this.department = "";
      this.departmentName = "";
      // this.EmployeList=[]
    },
    test: function (val) {
      this.getEmployeByText(val);
    },
    empHandle: function (val) {
      console.log(this.depUser);
      if (val && this.EmployeInit !== this.employeTotal && this.depUser) {
        this.getEmployeByText();
      }
    },
    empHandleAdd(val) {
      let depVal = val.split("/");
      this.department = depVal[2];
      this.departmentName = depVal[1];
      this.EmployeList = [];
      this.getEmploye(this.department);
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getAchList();
    },

    // 重置
    resetFormFn() {
      this.pageNum = 1;
      this.keyword = "";
      (this.searchTime = ""), (this.depUser = ""), (this.department = "");
      (this.contType = []),
        (this.contStatus = ""),
        (this.signType = ""),
        (this.jobStatus = ""),
        (this.departmentName = "");
      this.EmployeList = [];
    },
    // 查询
    queryFn() {
      this.pageNum = 1;
      this.getAchList();
    },
  },
  components: {
    ScreeningTop,
  },
  computed: {
    version() {
      return this.getUser.version;
    },
    userInfo() {
      return this.getUser.user;
    },
  },
};
</script>

<style lang="less" scoped>
.table-list {
  background-color: #fff;
  margin: 0 10px;
  padding-top: 10px;
  .tab {
      .forms-tab {
        margin-bottom: 15px;
        border-bottom: 1px solid #d7d7d7;
        font-size: 16px;
        font-weight: bold;
        span {
            display: inline-block;
            margin-right: 8px;
            cursor: pointer;
        }
        .curent {
            border-bottom: 2px solid #409eff;
        }
      }
      .table-tab {
				margin-bottom: 8px;
          span {
              display: inline-block;
              padding: 4px 22px;
              background-color: #bcbcbc;
              border-radius: 6px;
              font-size: 14px;
              font-weight: bold;
              cursor: pointer;
          }
          .curent {
            background-color: #468de3;;
					}
          span + span {
              margin-left: 8px;
          }
      }
  }
	.title {
    width: 100px;
    float: left;
		padding: 10px 0;
		border: 1px solid #cccccc;
		background-color: #eef2fb;
		text-align: center;
		font-size: 14px;
		font-weight: bold;
	}
}


/deep/ .el-pagination {
  text-align: right;
}
</style>
