<template>
  <div class="layout" style="background-color: #f5f5f5">
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
      <!-- 筛选条件 -->
      <el-form :inline="true" ref="propForm" :model="propForm" class="prop-form" size="small">
        <el-form-item label="签约日期" prop="dateMo" class="mr">
          <el-date-picker
            v-model="propForm.dateMo"
            class="w330"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <!-- 部门 -->
        <el-form-item label="部门" style="margin-right:0px;">
              <el-select :clearable="true" ref="tree" size="small" filterable remote :loading="Loading" :remote-method="remoteMethod" @visible-change="initDepList" @clear="clearDep"   v-model="propForm.department" placeholder="请选择">
                <el-option class="drop-tree" value="">
                  <el-tree :data="DepList" :props="defaultProps" @node-click="depHandleClick"></el-tree>
                </el-option>
              </el-select>
       </el-form-item>

        <el-form-item>
             <el-select :clearable="true" v-loadmore="moreEmploye" class="margin-left" size="small" v-model="propForm.dealAgentId" placeholder="请选择">
               <el-option
                 v-for="item in EmployeList"
                 :key="item.empId"
                 :label="item.name"
                 :value="item.empId">
               </el-option>
             </el-select>
       </el-form-item>

        <el-form-item label="合同类型" prop="contractType">
          <el-select v-model="propForm.contractType" class="w120" :clearable="true">
            <el-option
              v-for="item in dictionary['10']"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="关键字" prop="search">
          <el-input
            class="w430"
            v-model="propForm.search"
            placeholder="合同编号/房源编号/客源编号物业地址/业主/客户/房产证号/手机号"
            :trigger-on-focus="false"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <!-- 筛选条件 end -->
    <!-- 数据列表 -->
    <div class="data-layout">
      <!-- 头部 -->
      <div class="table-tool">
        <div class="tool-left">
          <h4 class="f14">
            <i class="iconfont icon-tubiao-11"></i>数据列表
          </h4>
          <ul>
            <li>
              <span>
                总分成：
                <b class="orange">{{countData[3]}}元</b>，
              </span>
            </li>
            <li>
              <span>分类分成：</span>
            </li>
            <li>
              <span>
                出售：
                <b class="orange">{{countData[1]}}元</b>，
              </span>
            </li>
            <li>
              <span>
                代办：
                <b class="orange">{{countData[2]}}元</b>，
              </span>
            </li>
            <li>
              <span>
                出租：
                <b class="orange">{{countData[0]}}元</b>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 头部 end -->
      <!-- 表格 -->
      <div class="data-list" v-loading="loading">
        <el-table :data="receivableList" style="width: 100%" @row-dblclick="dialogVisible = true">
          <!-- code -->
          <el-table-column label="合同信息" width="140">
            <template slot-scope="scope">
              <p>
                <span class="blue" @click="skipContDel(scope.row)">{{scope.row.code}}</span>
              </p>
            </template>
          </el-table-column>

          <!-- contType  合同类型(0:租赁 1:低佣 2:二手  3:代办)-->
          <el-table-column label="合同类型" width="80">
            <template slot-scope="scope">
              <p>{{scope.row.contType.label}}</p>
            </template>
          </el-table-column>

          <!-- propertyAddr -->
          <el-table-column prop="propertyAddr" label="物业地址" width="220"></el-table-column>

          <!-- dealStorefront   dealName -->
          <el-table-column prop="man" label="成交经纪人" width="190">
            <template slot-scope="scope">
              <div v-if="scope.row.dealName">
                <p>{{scope.row.dealStorefront}}-{{scope.row.dealName}}</p>
              </div>
              <div v-else>
                <p>暂无</p>
              </div>
            </template>
          </el-table-column>

          <!-- signDate -->
          <el-table-column prop="date" label="签约日期" width="100">
            <template slot-scope="scope">
              <p>{{scope.row.signDate|formatDate}}</p>
            </template>
          </el-table-column>

          <el-table-column prop="receiptsCommission" label="应收佣金(元)" width="100"></el-table-column>
          <el-table-column prop="receiptsAchievement" label="可分配业绩(元)" width="120">
            <!-- <template slot-scope="scope">
                                          <p>3000/5000</p>
            </template>-->
          </el-table-column>
          <el-table-column prop="amount" label="合同实收(元)" width="130">
            <!-- <template slot-scope="scope">
                                          <p>280000</p>
            </template>-->
          </el-table-column>

          <!-- level4 assignor -->
          <el-table-column label="分成人" width="190">
            <template slot-scope="scope">
              <div v-if="scope.row.distributionFroms.length==0">
                <div>--</div>
              </div>
              <div v-else>
                <div v-for="item in scope.row.distributionFroms">
                  <p>{{item.level4}}-{{item.assignor}}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- roleType -->
          <el-table-column label="角色类型" width="130">
            <template slot-scope="scope">
              <div v-if="scope.row.distributionFroms.length==0">
                <div>--</div>
              </div>
              <div v-else>
                <div v-for="item in scope.row.distributionFroms">
                  <div v-if="item.roleType==1">
                    <p>录入</p>
                  </div>
                  <div v-if="item.roleType==2">
                    <p>维护</p>
                  </div>
                  <div v-if="item.roleType==3">
                    <p>独家</p>
                  </div>
                  <div v-if="item.roleType==4">
                    <p>房勘</p>
                  </div>
                  <div v-if="item.roleType==5">
                    <p>钥匙</p>
                  </div>
                  <div v-if="item.roleType==15">
                    <p>委托</p>
                  </div>
                  <div v-if="item.roleType==16">
                    <p>建盘</p>
                  </div>

                  <div v-if="item.roleType==6">
                    <p>主客方</p>
                  </div>

                  <div v-if="item.roleType==14">
                    <p>签约人</p>
                  </div>

                  <div v-if="item.roleType==11">
                    <p>A/M</p>
                  </div>
                  <div v-if="item.roleType==7">
                    <p>协议方</p>
                  </div>
                  <div v-if="item.roleType==17">
                    <p>协议方2</p>
                  </div>

                  <div v-if="item.roleType==8">
                    <p>金融业绩分成人</p>
                  </div>

                  <div v-if="item.roleType==9">
                    <p>其他业绩分成人</p>
                  </div>

                  <div v-if="item.roleType==12">
                    <p>意向违约金</p>
                  </div>

                  <div v-if="item.roleType==13">
                    <p>公共业绩</p>
                  </div>

                  <div v-if="item.roleType==10">
                    <p>推荐人</p>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- ratio -->
          <el-table-column label="分成比例" width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.distributionFroms.length==0">
                <div>--</div>
              </div>
              <div v-else>
                <p v-for="item in scope.row.distributionFroms">{{item.ratio}}%</p>
              </div>
            </template>
          </el-table-column>

          <!-- agentReceipts -->
          <el-table-column label="实收分成金额(元)" width="130">
            <template slot-scope="scope">
              <div v-if="scope.row.distributionFroms.length==0">
                <div>--</div>
              </div>
              <div v-else>
                <p v-for="item in scope.row.distributionFroms">{{item.agentReceipts}}</p>
              </div>
            </template>
          </el-table-column>

          <!-- agentPlatformFee -->
          <!-- <el-table-column
                                 label="特许服务费(元)"
                                 width="120"
                                 >
                                   <template slot-scope="scope">
                                         <p v-for="item in scope.row.distributionFroms">{{item.agentPlatformFee}}</p>
                                  </template>
          </el-table-column>-->
          <!-- agentPayFee -->
          <el-table-column label="刷卡手续费(元)" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.distributionFroms.length==0">
                <div>--</div>
              </div>
              <div v-else>
                <p v-for="item in scope.row.distributionFroms">{{item.agentPayFee}}</p>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total,prev, pager, next , jumper"
        :total="total"
        v-if="total!=0"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { MIXINS } from "@/assets/js/mixins";
export default {
  mixins: [MIXINS],
  name: "actualAchievement",
  data() {
    return {
      receivableList: [], //实收数据列表数组
      countData: [], //数据统计数组
      departs: [],
      depUser: "",
      users: [],
      // 筛选条件
      propForm: {
        department: "", //部门
        dealAgentStoreId:null,
        dealAgentId:null,
        departmentDetail: "", //部门详情
        contractType: "", //合同类型
        dateMo: "", //时间
        search: "" //关键字
      },
      dictionary: {
        //数据字典
        "10": "" //合同类型
      },
      pageSize: 10,
      currentPage: 1,
      ajaxParam: {},
      total: 0,
      loading: true
    };
  },
  created() {
    //  实收列表
    this.ajaxParam = {
      pageNum: this.currentPage,
      pageSize: this.pageSize
    };
    this.getData(this.ajaxParam);
    // 字典初始化
    this.getDictionary();
     
    //部门初始化
    this.remoteMethod();
  },
  components: {},
  methods: {
       //获取当前部门
    initDepList:function (val) {
      if(!val){
        this.remoteMethod()
      }
    },   
     clearDep:function () {
      this.propForm.department=''
      this.EmployeList=[]
      this.propForm.dealAgentId=''
      this.clearSelect()
    },
     depHandleClick(data) {
      this.propForm.dealAgentStoreId=data.depId
      this.propForm.department=data.name
      this.propForm.dealAgentId=''
      this.handleNodeClick(data)
    },
    queryFn() {
      // console.log("ssssssssssss");
      // console.log(this.ajaxParam);
      // console.log(this.propForm);
      if (this.propForm.dateMo) {
        this.ajaxParam = {
          dealAgentStoreId: this.propForm.dealAgentStoreId, //部门
          dealAgentId: this.propForm.dealAgentId, //员工
          contractType: this.propForm.contractType, //合同类型
          startTime: this.propForm.dateMo[0], //开始时间
          endTime: this.propForm.dateMo[1], //结束时间
          keyword: this.propForm.search, //关键字
          pageNum: this.currentPage,
          pageSize: this.pageSize
        };
      } else {
        this.ajaxParam = {
          dealAgentStoreId: this.propForm.dealAgentStoreId, //部门
          dealAgentId: this.propForm.dealAgentId, //员工
          contractType: this.propForm.contractType, //合同类型
          keyword: this.propForm.search, //关键字
          pageNum: this.currentPage,
          pageSize: this.pageSize
        };
      }
      this.ajaxParam.pageNum = 1;
      this.currentPage = 1;
      this.getData(this.ajaxParam);
    },
    resetFormFn() {
      this.ajaxParam = {
        dealAgentStoreId: "", //部门
        dealAgentId: "", //员工
        contractType: "", //合同类型
        startTime: "", //开始时间
        endTime: "", //结束时间
        keyword: "" //关键字
      };
      this.ajaxParam.pageNum = 1;
      this.currentPage = 1;
      this.propForm = {
        department: "", //部门
        departmentDetail: "", //部门详情（员工）
        contractType: "", //合同类型
        dateMo: "",
        search: ""
      };
    },
    getData(param) {
      // 实收列表
      let _that = this;
      this.$ajax.get("/api/achievement/selectReceiptsList", param).then(res => {
        let data = res.data;
        if (res.status === 200) {
          _that.receivableList = data.data.list;
          if (data.data.list[0]) {
            _that.countData = data.data.list[0].contractCount;
          } else {
            _that.countData = [0, 0, 0, 0];
          }
          _that.total = data.data.total;
          this.loading = false;
        }
      });
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.ajaxParam.pageNum = val;
      this.currentPage = val;
      this.getData(this.ajaxParam);
    },
    // 跳转合同详情
    skipContDel(value) {
      this.setPath(
        this.$tool.getRouter(["业绩", "实收列表", "合同详情"], "contractList")
      );
      this.$router.push({
        path: "/contractDetails",
        query: {
          id: value.id,
          code: value.code,
          contType: value.contType.value
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/less/lsx.less";
.layout {
  .check-btn span {
    color: #478de3;
  }
  .check-btn span:first-of-type {
    margin-right: 8px;
  }
  .blue {
    color: #478de3;
  }
  .orange {
    color: #f56c6c;
  }
  .green {
    color: #54d384;
  }
  // 改变头部面包屑样式
  .head {
    .head-left {
      float: left;
      /deep/ .el-breadcrumb {
        // font-size: 12px !important;
      }

      /deep/ .el-breadcrumb__inner {
        color: #99a1aa !important;
      }
      /deep/ .el-breadcrumb__item:nth-of-type(2) .el-breadcrumb__inner {
        color: #32485f !important;
      }
    }
    .head-right {
      float: right;
    }
  }
  //  筛选条件
  .filter-layout {
    // width: 1680px;
    background-color: #fff;
    padding: 20px;
    padding-bottom: 0;
    position: relative;
    .btn {
      width: 56px;
      height: 17px;
      position: absolute;
      bottom: -17px;
      left: 50%;
      margin-left: -28px;
      z-index: 9;
      background: url(../../assets/img/icon-dowm.png) no-repeat center center;
      background-size: 56px auto;
      cursor: pointer;
    }
    .filter-left {
      h1 {
        color: #233241;
        position: relative;
        padding-left: 28px;
        b {
          position: absolute;
          width: 16px;
          height: 16px;
          // background-color: red;
          left: 00px;
          top: 50%;
          margin-top: -8px;
        }
      }
    }
    .filter-right {
      .el-button--primary {
        width: 100px;
        height: 36px;
        border-radius: 18px;
        line-height: 36px;
        padding: 0;
      }
      .el-button--primary:first-of-type {
        background-color: #fff;
        color: #32485f;
        border: 2px solid #e8eaf6;
      }
      .el-button--primary:nth-of-type(2) {
        background-color: #478de3;
        color: #fff;
        border: 0;
      }
    }
  }

  //数据列表
  .data-layout {
    background-color: #fff;
    padding: 20px;
    padding-top: 0;
    margin-top: 20px;
    .table-tool {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: @margin-base 0;
      .tool-left {
        display: inherit;
        align-items: center;
        > h4 {
          > i {
            margin-right: 8px;
          }
        }
        > ul {
          display: flex;
          margin-left: 20px;
          > li {
            color: @color-6c;
          }
        }
      }
      /*>p{
        position: absolute;
        top: 50%;
        right: 0;
        transform:translateY(-50%);
      }*/
    }
  }
  // 展示数据
  .data-list {
    width: 100%;
    /deep/ .el-table {
      // font-size: 14px !important;
      td,
      th {
        padding: 24px 0;
      }
      .el-table__header {
        height: 55px;
        th {
          padding: 0;
          .cell {
            background-color: #eef2fb;
            // background-color: pink;
            height: 55px;
            line-height: 55px;
          }
        }
      }
    }
  }
}
/deep/ .el-pagination {
  text-align: center;
  padding-bottom: 50px;
  padding-top: 50px;
}
.w430 {
  width: 430px;
}
</style>
