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
            <el-select v-model="contType" style="width:200px" clearable placeholder="请选择">
              <el-option
                v-for="item in dictionary['10']"
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
            <span :class="formsCurrent == index+1 ? 'curent' : ''" v-for="(item,index) of ['应收报表','结算报表']" :key="index" @click="toggleForms(index,'formsCurrent')">{{item}}</span>
        </div>
        <div class="table-tab">
            <span :class="tabCurrent == index+1 ? 'curent' : ''" v-for="(item,index) of ['人员','分组','分店','片区','大区','事业部']" :key="index" @click="toggleForms(index,'tabCurrent')">{{item}}</span>
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
          <el-table-column :label="tabCurrent===1? '姓名' : '部门'" prop="name" width="128"></el-table-column>
          <el-table-column label="部门层级" width="128">
            <template>{{['人员','分组','分店','片区','大区','事业部'][tabCurrent-1]}}</template>
          </el-table-column>
          <el-table-column label="佣金支付费（元）" width="128">
            <template slot-scope="scope">{{scope.row.mm_commfee|fomatFloat}}</template>
          </el-table-column>
          <el-table-column label="权证费（元）" width="128">
            <template slot-scope="scope">{{scope.row.mm_qzfee|fomatFloat}}</template>
          </el-table-column>
          <el-table-column label="企业管理费（元）" width="128">
            <template slot-scope="scope">
              <span>{{scope.row.mm_fee|fomatFloat}}</span>
            </template>
          </el-table-column>
          <el-table-column label="可分配业绩" width="128">
            <template slot-scope="scope">
              <span>{{scope.row.mm_money|fomatFloat}}</span>
            </template>
          </el-table-column>
          <el-table-column label="合同值（总应收）" width="128">
            <template slot-scope="scope">
              <span>{{scope.row.mm_moneySum|fomatFloat}}</span>
            </template>
          </el-table-column>
          <el-table-column label="签单数" prop="mm_stSum" width="128">
          </el-table-column>
        </el-table-column>

        <el-table-column label="租赁">

          <el-table-column label="佣金支付费（元）" width="128">
            <template slot-scope="scope">{{scope.row.zl_commfee|fomatFloat}}</template>
          </el-table-column>
          <el-table-column label="企业管理费（元）" width="128">
            <template slot-scope="scope">
              <span>{{scope.row.zl_fee|fomatFloat}}</span>
            </template>
          </el-table-column>
          <el-table-column label="可分配业绩" width="128">
            <template slot-scope="scope">
              <span>{{scope.row.zl_money|fomatFloat}}</span>
            </template>
          </el-table-column>
          <el-table-column label="合同值（总应收）" width="128">
            <template slot-scope="scope">
              <span>{{scope.row.zl_moneySum|fomatFloat}}</span>
            </template>
          </el-table-column>
          <el-table-column label="签单数" prop="zl_stSum" width="128">
          </el-table-column>
        </el-table-column>

        <el-table-column label="代办">
          <el-table-column label="代办合同值（结算金额）" width="128">
            <template slot-scope="scope">
              <span>{{scope.row.db_moneySum|fomatFloat}}</span>
            </template>
          </el-table-column>
          <el-table-column label="签单数" prop="db_stSum" width="128">
          </el-table-column>
        </el-table-column>

        <el-table-column label="总业绩">
          <el-table-column label="买卖+租赁+代办" width="128">
            <template slot-scope="scope">
              <span>{{(scope.row.mm_moneySum+scope.row.db_moneySum+scope.row.zl_moneySum)|fomatFloat}}</span>
            </template>
          </el-table-column>
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
      searForm: {},
      formsCurrent: 1,
      tabCurrent: 1,
      departmentName: "",
      department: [],
      searchTime: null,
      contType: "",
      pageSize: 50,
      empName: "",
      pageNum: 1,
      total: 0,
      dictionary: {
        "10": "", //合同类型（筛选条件）
      },
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
    this.initTimePicker();
    this.getAchList()
  },
  mounted() {
    this.remoteMethod("power");
  },
  methods: {
    toggleForms(curent,key) {
        this[key] = curent+1
        this.getAchList()
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
        signDateStar:
          this.searchTime && this.searchTime.length != 0
            ? this.searchTime[0]
            : "",
         signDateEnd:
          this.searchTime && this.searchTime.length != 0
            ? this.searchTime[1]
            : "",
        depId: this.department,
        empId: this.depUser,
        contartType: this.contType,
        level: this.tabCurrent,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      if (param.empId) {
        param.empId = param.empId.split("/")[0];
      }
      let apiUrl = ''
      if(this.formsCurrent == 1) {
        apiUrl = '/api/achievement/AchievementList'
      }else {
        apiUrl = '/api/settlement/settleList'
      }
      this.$ajax
        .get(apiUrl, param)
        .then((res) => {
          res = res.data;
          if (res.status == 200) {
            this.achList = res.data.list;
            this.total = res.data.total;
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    getExcel() {
      let param = {
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
        // pageNum: this.pageNum,
        // pageSize: this.pageSize,
      };
      if (param.empId) {
        param.empId = param.empId.split("/")[0];
      }
      this.excelCreate("/input/AchievementContractExcel", param);
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
    },
    test: function (val) {
      this.getEmployeByText(val);
    },
    empHandle: function (val) {
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
      this.searchTime = null;
      (this.depUser = ""), (this.department = "");
      (this.contType = []),
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
  @import "~@/assets/less/lsx.less";
  @import "~@/assets/common.less";
.header {
  background-color: #fff;
  border-radius: 2px;
  box-sizing: border-box;
  .form-title {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    div {
      > .el-button {
        width: 100px;
        height: 36px;
        border-radius: 14px;
      }
    }
  }
  .content {
    display: flex;
    font-weight: normal;
    flex-wrap: wrap;
    > .el-form-item {
      display: flex;
      margin-right: 30px;
      &:nth-child(2) /deep/ .el-form-item__content {
        display: flex;
        span {
          margin-right: 5px;
        }
      }
    }
  }
}

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
/deep/ .dep .el-form-item__content {
  display: flex;
}
</style>
