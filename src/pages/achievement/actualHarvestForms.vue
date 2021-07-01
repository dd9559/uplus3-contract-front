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
          <el-form-item label="合同状态">
            <el-select v-model="contType" style="width:200px" placeholder="请选择">
              <el-option
                v-for="item in dictionary['6']"
                :key="item.value"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </ScreeningTop>
    <div class="table-list">
      <div class="tab">
        <div class="forms-tab">
            <template v-for="(item) of formList">
              <span :class="formsCurrent == item.id+1 && formList.length == 2 ? 'curent' : ''"  :key="item.id" @click="toggleForms(item.id,'formsCurrent')">{{item.name}}</span>
            </template>
        </div>
        <div class="table-tab">
            <span :class="tabCurrent == index+1 ? 'curent' : ''" v-for="(item,index) of ['人员','分组','分店','片区','大区','事业部']" :key="index" @click="toggleForms(index,'tabCurrent')">{{item}}</span>
            <el-button round type="primary" size="medium" @click="getExcel" v-if="(formsCurrent===1 && power['sign-yj-ysjsreport-ys-export'].state) || (formsCurrent===2 && power['sign-yj-ysjsreport-js-export'].state)" style="padding:9px 15px;min-width: 80px;float:right;">导出</el-button>
        </div>
      </div>
      <el-table
        :data="achList"
        ref="tableCom"
        style="width: 100%"
        border
        v-loading="loadingList"
        :max-height="tableNumberCom"
      >
        <el-table-column v-if="tabCurrent===1" label="姓名" align="center" prop="nams" width="128"></el-table-column>
        <el-table-column label="部门" align="center" prop="dep" width="128"></el-table-column>
        <el-table-column label="部门层级" align="center" width="128">
          <template slot-scope="scope">
            <span v-if="tabCurrent===1">{{['事业部','大区','片区','分店','分组'][scope.row.levels-1]}}</span>
            <span v-else>{{['人员','分组','分店','片区','大区','事业部'][tabCurrent-1]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="买卖" align="center">
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
          <el-table-column :label="formsCurrent===1? '买卖合同值（总应收）' : '买卖合同值（分账金额）'" width="128">
            <template slot-scope="scope">
              <span>{{scope.row.mm_moneySum|fomatFloat}}</span>
            </template>
          </el-table-column>
          <el-table-column label="签单数" prop="mm_stSum" width="128">
          </el-table-column>
        </el-table-column>

        <el-table-column label="租赁" align="center">

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
          <el-table-column :label="formsCurrent===1? '租赁合同值（总应收）' : '租赁合同值（分账金额）'" width="128">
            <template slot-scope="scope">
              <span>{{scope.row.zl_moneySum|fomatFloat}}</span>
            </template>
          </el-table-column>
          <el-table-column label="签单数" prop="zl_stSum" width="128">
          </el-table-column>
        </el-table-column>

        <el-table-column label="代办" align="center">
          <el-table-column :label="formsCurrent===1? '代办合同值（总应收）' : '代办合同值（分账金额）'" width="128">
            <template slot-scope="scope">
              <span>{{scope.row.db_moneySum|fomatFloat}}</span>
            </template>
          </el-table-column>
          <el-table-column label="签单数" prop="db_stSum" width="128">
          </el-table-column>
        </el-table-column>

        <el-table-column label="总业绩" align="center">
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
      loadingList: false,
      formsCurrent: 1,
      tabCurrent: 1,
      searchTime: null,
      contType: 3,
      pageSize: 50,
      empName: "",
      pageNum: 1,
      total: 0,
      ajaxParam: {},
      dictionary: {
        "6": "", //合同状态（筛选条件）
      },
      achList: [],
      copyAchList: [],
      formList: [
        {name: '应收报表',id: 0},
        {name: '结算报表',id: 1}
      ],
      power: {
        "sign-yj-ysjsreport-ys-query": {
          state: false,
          name: "应收报表查询",
        },
        "sign-yj-ysjsreport-ys-export": {
          state: false,
          name: "应收报表导出",
        },
        "sign-yj-ysjsreport-js-query": {
          state: false,
          name: "结算报表查询",
        },
        "sign-yj-ysjsreport-js-export": {
          state: false,
          name: "结算报表导出",
        },
      },
    };
  },
  created() {
    this.getAdmin(); //获取当前登录人信息
    this.getDictionary();
    this.initTimePicker();
    console.log(this.$router);
  },
  mounted() {
    this.remoteMethod("power");
    this.formList = this.formList.filter(item => {
      if (item.id === 0 && this.power['sign-yj-ysjsreport-ys-query'].state) return true
      if (item.id === 1 && this.power['sign-yj-ysjsreport-js-query'].state) return true
      return false
    })
    if (this.formList.length === 1) {
      this.formsCurrent = this.formList[0].id + 1
    }
    this.getAchList()
  },
  methods: {
    // 导出功能
    getExcel() {
        let url = this.formsCurrent === 1 ? '/input/YSachievementExcel' : '/input/JSachievementExcel'
        this.excelCreate(url, this.ajaxParam)
    },
    toggleForms(curent,key) {
        if (key==='formsCurrent' && this.formList.length === 1) return
        this[key] = curent+1
        if (key==='formsCurrent') {
          this.tabCurrent = 1
        }
        this.pageNum = 1
        this.getAchList()
    },
    initTimePicker() {
      var date = new Date();
      date = date.setDate(1);
      date = this.$tool.dateFormat(date);
      var date2 = this.$tool.dateFormat(Date.now());
      this.searchTime = [date, date2];
    },
    getAchList(page) {
      let param = {
        signDateStar:
          this.searchTime && this.searchTime.length != 0
            ? this.searchTime[0]
            : "",
         signDateEnd:
          this.searchTime && this.searchTime.length != 0
            ? this.searchTime[1]
            : "",
        contartType: this.contType,
        level: this.tabCurrent,
        pageNum: page ? page : this.pageNum,
        pageSize: this.pageSize,
      };
      let apiUrl = ''
      if(this.formsCurrent == 1) {
        apiUrl = '/api/achievement/AchievementList'
      }else {
        apiUrl = '/api/settlement/settleList'
      }
      this.loadingList = true
      this.$ajax
        .get(apiUrl, param)
        .then((res) => {
          res = res.data;
          if (res.status == 200) {
            this.ajaxParam = param
            this.$nextTick(() => { //在数据加载完，重新渲染表格
              if (this.tabCurrent !== 1) {
                this.copyAchList = res.data.map(item => {
                  let dep = ''
                  switch (this.tabCurrent) {
                    case 1:
                    case 2:
                      dep = item.depName
                      break;
                    case 3:
                      dep = item.r4name
                      break;
                    case 4:
                      dep = item.r3name
                      break;
                    case 5:
                      dep = item.r2name
                      break;
                    case 6:
                      dep = item.r1name
                      break;
                  }
                  return Object.assign({dep},item)
                });
                let start = (this.pageNum-1)*this.pageSize,
                    end = this.pageNum*this.pageSize;
                console.log(start,end,res.data,'res.data');
                this.achList = this.copyAchList.slice(start,end);
                this.total = res.data.length;
              } else {
                this.achList = res.data.list.map(item => {
                  let dep = ''
                  switch (this.tabCurrent) {
                    case 1:
                    case 2:
                      dep = item.depName
                      break;
                    case 3:
                      dep = item.r4name
                      break;
                    case 4:
                      dep = item.r3name
                      break;
                    case 5:
                      dep = item.r2name
                      break;
                    case 6:
                      dep = item.r1name
                      break;
                  }
                  return Object.assign({dep},item)
                });
                // this.achList = res.data.list;
                this.total = res.data.total;
              }
              // this.achList = res.data.list;
              // this.total = res.data.total;
            })
          }
          this.loadingList = false
        })
        .catch((err) => {
          this.achList = [];
          this.total = 0;
          this.loadingList = false
          this.$message.error(err);
        });
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {

      if (this.tabCurrent !== 1) {
        if (val === Math.ceil(this.total / this.pageSize)) {
          this.getAchList(1);
        } else {
          let start = (val-1)*this.pageSize,
              end = val*this.pageSize;
          this.achList = this.copyAchList.slice(start,end);
        }
        this.pageNum = val;
      } else {
        this.pageNum = val;
        this.getAchList();
      }
    },

    // 重置
    resetFormFn() {
      this.pageNum = 1;
      this.searchTime = null;
      (this.contType = 3);
      this.initTimePicker();
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
            padding: 10px;
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
              padding: 8px 22px;
              margin-bottom: 8px;
              background-color: #f4f4f5;
              border-radius: 6px;
              font-size: 14px;
              font-weight: bold;
              cursor: pointer;
              color: #909399;
          }
          .curent {
            background-color: #409eff;
            color: #fff;
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
  /deep/ .is-group th {
    border-right: 1px solid #b7c4e4;
  }
}


/deep/ .el-pagination {
  text-align: right;
}
</style>
