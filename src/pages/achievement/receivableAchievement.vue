<template>   
      <div class="layout" style="background-color: #f5f5f5">
                 <!-- 筛选条件  -->
                <div class="filter-layout">
                         
                           <div style="overflow:hidden;">
                                 <div class="filter-left f_l">
                                     <h1>
                                      <b class="iconfont icon-tubiao-5" style="color:#55657A;font-weight:normal;"></b>
                                       筛选查询
                                      </h1>
                               </div>
                               <div class="filter-right f_r">
                                  <el-button type="primary" round>重置</el-button>
                                  <el-button type="primary" round @click="filterData">查询</el-button>
                              </div>
                           </div>
                   

                           <div class="filter-item" v-show="filterShow">
                               <!-- 筛选条件 -->
                               <el-form 
                               :inline="true"
                               ref="propForm"
                               :model="propForm" 
                               class="prop-form"
                               size="small">

                                 <el-form-item 
                                   label="签约日期"
                                   prop="dateMo"
                                   class="mr">
                                       <el-date-picker
                                           v-model="propForm.dateMo"
                                           class="w330"
                                           type="daterange"
                                           range-separator="至"
                                           value-format="yyyy-MM-dd"
                                           start-placeholder="开始日期"
                                           end-placeholder="结束日期">
                                       </el-date-picker>
                                   </el-form-item>  


                                    <!-- 部门 -->
                              <!-- 部门 -->
                                   <el-form-item 
                                   label="部门" 
                                   class="mr">
                                       <el-select v-model="propForm.department"  class="w200" filterable @change="selUser">
                                           <el-option 
                                             v-for="item in departs" 
                                              :key="item.id"
                                              :label="item.name"
                                              :value="item.id"></el-option>
                                       </el-select>
                                   </el-form-item>

                                   <el-form-item>
                                       <el-select v-model="propForm.departmentDetail" class="w100" filterable>
                                           <el-option 
                                            v-for="(item,index) in users" 
                                            :key="index"
                                             ref="user" 
                                            :label="item.name"
                                            :value="item.empId"></el-option>
                                       </el-select>
                                   </el-form-item>
                               
                                    <el-form-item 
                                   label="合同类型" 
                                   prop="contractType">
                                       <el-select v-model="propForm.contractType" class="w120">
                                           <el-option 
                                           v-for="item in dictionary['10']" 
                                           :key="item.value"
                                           :label="item.value" 
                                           :value="item.key"></el-option>
                                       </el-select>
                                   </el-form-item>

                                  <el-form-item label="关键字" prop="search">
                                          <el-input
                                          class="w312"
                                          v-model="propForm.search"
                                          placeholder="开票人员/合同编号/票据编"
                                          :trigger-on-focus="false"
                                          clearable
                                          ></el-input>
                                 </el-form-item>
                              
                               </el-form>
                           </div>

                           <div class="btn" @click="filterShow=!filterShow"></div>
                </div> 
                <!-- 筛选条件 end -->
                <!-- 数据列表 -->
                 <div class="data-layout">
                      <!-- 头部 -->
                      <div class="data-head">
                           <div class="data-head-left f_l">
                             <b class="iconfont icon-tubiao-11" style="color:#55657A;font-weight:normal;"></b> 
                              <span>

                                  数据列表
                              </span> 
                           </div>
                          <div class="data-head-right f_l">
                              <span>总分成：<b>{{countData[0]}}元</b>，</span>
                              <span>分类分成：</span>
                              <span>出售：<b>{{countData[1]}}元</b>，</span>
                              <span>代办：<b>{{countData[2]}}元</b>，</span>
                              <span>出租：<b>{{countData[3]}}元</b></span>
                          </div>      
                      </div>
                      <!-- 头部 end -->

                      <!-- 表格 -->
                      <div class="data-list">
                         <el-table
                            :data="receivableList"
                            style="width: 100%"
                            @row-dblclick="dialogVisible = true"
                            >
                               <!-- code -->
                               <el-table-column
                                 label="合同信息"
                                 width="160"
                                 >
                                  <template slot-scope="scope">
                                          <p><span class="blue">{{scope.row.code}}</span></p>
                                  </template>
                               </el-table-column>
                                
                                <!-- contType  合同类型(0:租赁 1:低佣 2:二手  3:代办)-->
                               <el-table-column
                                 label="合同类型"
                                 width="100">
                                   <template slot-scope="scope">
                                     <p>{{scope.row.contType.label}}</p>
                                  </template>
                               </el-table-column>

                                <!-- propertyAddr -->
                                <el-table-column
                                 prop="propertyAddr"
                                 label="物业地址"
                                 width="140">
                               </el-table-column>

                               <!-- dealStorefront   dealName -->
                                   <el-table-column
                                 prop="man"
                                 label="成交经纪人"
                                 width="150">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.dealName">
                                         <p>{{scope.row.dealStorefront}}</p>
                                         <p>{{scope.row.dealName}}</p>
                                    </div>
                                    <div v-else>
                                         <p>暂无</p>
                                    </div>
                                  </template>
                               </el-table-column>

                               <!-- signDate -->
                                   <el-table-column
                                 prop="date"
                                 label="签约日期"
                                 width="100">
                                 <template slot-scope="scope">
                                       <p>{{scope.row.signDate|formatDate}}</p>
                                 </template>
                               </el-table-column>


                               <el-table-column
                                 prop="receiptsCommission"
                                 label="应收佣金(元)"
                                 width="120">
                               </el-table-column>
                                <el-table-column
                                 prop="receiptsAchievement"
                                 label="可分配业绩(元)"
                                 width="100">
                                  <!-- <template slot-scope="scope">
                                          <p>3000/5000</p>
                                  </template> -->
                               </el-table-column>
                               <el-table-column
                                 prop="amount"
                                 label="合同实收(元)"
                                 width="130">
                                  <!-- <template slot-scope="scope">
                                          <p>280000</p>
                                  </template> -->
                               </el-table-column>

                                <!-- level4 assignor -->
                                <el-table-column
                                 label="分成人"
                                 width="170">
                                   <template slot-scope="scope">
                                         <div  v-for="item in scope.row.distributionFroms">
                                                  <p>{{item.level4}}</p>
                                                  <p>{{item.assignor}}</p>
                                         </div>
                                  </template>
                               </el-table-column>
                                <!-- roleType -->
                               <el-table-column
                                 label="角色类型"
                                 width="130">
                                   <template slot-scope="scope">
                                          <div  v-for="item in scope.row.distributionFroms">
                                               <div v-if="item.roleType==0">
                                                  <p>房源维护人</p>
                                                  <p>录入</p>
                                               </div>
                                               <div v-if="item.roleType==1">
                                                  <p>房源维护人</p>
                                                  <p>维护</p>
                                               </div>
                                               <div v-if="item.roleType==2">
                                                  <p>房源维护人</p>
                                                  <p>独家</p>
                                               </div>
                                                <div v-if="item.roleType==3">
                                                  <p>房源维护人</p>
                                                  <p>房勘</p>
                                               </div>
                                                <div v-if="item.roleType==4">
                                                  <p>房源维护人</p>
                                                  <p>钥匙</p>
                                               </div>
                                                <div v-if="item.roleType==5">
                                                  <p>房源维护人</p>
                                                  <p>委托</p>
                                               </div>
                                                <div v-if="item.roleType==6">
                                                  <p>房源维护人</p>
                                                  <p>建盘</p>
                                               </div>

                                                <div v-if="item.roleType==7">
                                                  <p>客源维护人</p>
                                                  <p>主客方</p>
                                               </div>
                                                <div v-if="item.roleType==8">
                                                  <p>客源维护人</p>
                                                  <p>推荐人</p>
                                               </div>
                                                <div v-if="item.roleType==9">
                                                  <p>客源维护人</p>
                                                  <p>签约人</p>
                                               </div>
                                                <div v-if="item.roleType==10">
                                                  <p>客源维护人</p>
                                                  <p>A/M</p>
                                               </div>
                                                <div v-if="item.roleType==11">
                                                  <p>客源维护人</p>
                                                  <p>协议方</p>
                                               </div>
                                               <div v-if="item.roleType==12">
                                                  <p>客源维护人</p>
                                                  <p>协议方2</p>
                                               </div>
                                          </div>
                                  </template>
                               </el-table-column>
                               <!-- ratio -->
                               <el-table-column
                                 label="分成比例"
                                 width="80">
                                  <template slot-scope="scope">
                                         <p v-for="item in scope.row.distributionFroms">{{item.ratio}}%</p>
                                  </template>
                               </el-table-column>

                               <!-- agentReceipts -->
                               <el-table-column
                                 label="实收分成金额(元)"
                                 width="120"
                                 >
                                 <template slot-scope="scope">
                                         <p v-for="item in scope.row.distributionFroms">{{item.agentReceipts}}</p>
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
                               </el-table-column> -->

                                 <!-- agentPayFee -->
                                <el-table-column
                                 label="刷卡手续费(元)"
                                 width="120"
                                 >
                                <template slot-scope="scope">
                                         <p v-for="item in scope.row.distributionFroms">{{item.agentPayFee}}</p>
                                  </template>
                               </el-table-column>
                          </el-table>
                      </div>

                         <!-- 分页 -->
                         <el-pagination
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="1"
                           layout="total, prev, pager, next, jumper"
                           :total="total">
                        </el-pagination>
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
      filterShow: true,
      departs: [],
      depUser: "",
      users: [],
      // 筛选条件
      propForm: {
        department: "", //部门
        departmentDetail: "", //部门详情
        contractType: "", //合同类型
        dateMo: "", //时间
        search: "" //关键字
      },
      // 筛选选项
      rules: {
        department: [
          {
            label: "部门1",
            value: "1"
          },
          {
            label: "部门2",
            value: "2"
          }
        ],
        departmentDetail: [
          {
            label: "员工1",
            value: "1"
          },
          {
            label: "员工2",
            value: "2"
          }
        ],
        contractType: [
          {
            label: "合同类型1",
            value: "1"
          },
          {
            label: "合同类型2",
            value: "2"
          }
        ]
      },
      total: 0,
      dictionary: {
        //数据字典
        "10": "" //合同类型
      }
    };
  },
  created() {
    // 字典初始化
    this.getDictionary();
    // 实收列表
    let param = {
      pageNum: 1,
      pageSize: 10
    };
    this.$ajax.get("/api/achievement/selectReceiptsList", param).then(res => {
      console.log(res);
      let data = res.data;
      if (res.status === 200) {
        this.receivableList = data.data.list;
        this.countData = data.data.list[0].contractCount;
      }
    });
    // 查询部门
    this.$ajax.get("/api/access/deps").then(res => {
      if (res.status == 200) {
        this.departs = res.data.data;
      }
    });
  },
  components: {},
  methods: {
    filterData() {
      let param = {
        departmentId: this.propForm.department, //部门
        employeeIdQUERY: this.propForm.departmentDetail, //员工
        contract_type: this.propForm.contractType, //合同类型
        start_time: this.propForm.dateMo[0], //开始时间
        end_time: this.propForm.dateMo[1], //结束时间
        keyword: this.propForm.search //关键字
      };
      console.log(param);
    },
    // 查询部门员工
    selUser() {
      this.propForm.departmentDetail = "";
      this.$ajax
        .get("/api/organize/employees", { depId: this.department })
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            this.users = res.data.data;
            console.log(this.users);
          }
        });
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
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
        font-size: 12px !important;
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
        font-size: 18px;
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
    .data-head {
      height: 68px;
      background-color: #fff;
      // padding-left: 48px;
      .data-head-left {
        position: relative;
        b {
          position: absolute;
          width: 16px;
          height: 16px;
          left: 0px;
          top: 63%;
          // margin-top: -8px;
        }
        span:first-of-type {
          color: #233241;
          display: inline-block;
          margin-top: 30px;
          font-size: 18px;
          margin-left: 28px;
        }
      }
      .data-head-right {
        font-size: 14px;
        margin-top: 35px;
        margin-left: 15px;
        span {
          color: #6c7986;
          b {
            color: #f56c6c;
            font-weight: normal;
          }
        }
      }
    }
  }
  // 展示数据
  .data-list {
    width: 100%;
    /deep/ .el-table {
      font-size: 14px !important;
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
</style>
