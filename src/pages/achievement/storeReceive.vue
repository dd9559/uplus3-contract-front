<template>   
      <div class="layout">
          

                 <!-- 筛选条件  -->
                <div class="filter-layout">
                         
                           <div style="overflow:hidden;">
                                 <div class="filter-left f_l">
                                     <h1>
                                       <b class="el-icon-search"></b> 
                                       筛选查询
                                      </h1>
                               </div>
                               <div class="filter-right f_r">
                                  <el-button type="primary" round>重置</el-button>
                                  <el-button type="primary" round>查询</el-button>
                              </div>
                           </div>
                   

                     <div class="filter-item">
                               <!-- 筛选条件 -->
                               <el-form 
                               :inline="true"
                               ref="propForm"
                               :model="propForm" 
                               class="prop-form"
                               size="small">
                                   <!-- <span>签约日期：</span> -->
                                   <el-form-item 
                                   prop="dateMo"
                                   label="签约日期"
                                   class="mr">
                                       <el-date-picker
                                           v-model="propForm.dateMo"
                                           class="w330"
                                           type="daterange"
                                           range-separator="至"
                                           start-placeholder="开始日期"
                                           end-placeholder="结束日期">
                                       </el-date-picker>
                                   </el-form-item> 


                                   <el-form-item 
                                   label="部门" 
                                   prop="region"
                                   class="mr">
                                       <el-select v-model="propForm.region"  class="w200">
                                           <el-option 
                                           v-for="item in rules.region" 
                                           :key="item.value"
                                           :label="item.label" 
                                           :value="item.value"></el-option>
                                       </el-select>
                                   </el-form-item>
                                   <el-form-item 
                                   prop="regionName">
                                       <el-select v-model="propForm.regionName" class="w100">
                                           <el-option 
                                           v-for="item in rules.regionName" 
                                           :key="item.value"
                                           :label="item.label" 
                                           :value="item.value"></el-option>
                                       </el-select>
                                   </el-form-item>                            
                               </el-form>
                     </div>
                </div> 
                <!-- 筛选条件 end -->
                <!-- 数据列表 -->
                 <div class="data-layout">
                      <!-- 头部 -->
                      <div class="data-head">
                           <div class="data-head-left">
                              <b class="el-icon-date"></b> 
                              <span>
                                  数据列表
                              </span> 
                           </div> 
                          <!-- 面包屑 -->
                    
                          <div class="head-left" v-show="brandShow">
                             <el-breadcrumb separator-class="el-icon-arrow-right">
                                 <el-breadcrumb-item>全公司</el-breadcrumb-item>
                                 <el-breadcrumb-item v-for="(item,index) in brandArr" :key="index" @click.native="askData(item.id,index)">{{item.name}}</el-breadcrumb-item>
                                <!-- <el-breadcrumb-item>全公司</el-breadcrumb-item>
                                <el-breadcrumb-item>王德凯（区总）</el-breadcrumb-item>
                                <el-breadcrumb-item>李夏莉（区经）</el-breadcrumb-item>
                                <el-breadcrumb-item>林无熙（店长）</el-breadcrumb-item> -->
                             </el-breadcrumb>
                          </div>
                          <!--面包屑 end-->                    
                      </div>
                      <!-- 头部 end -->

                  

                      <!-- 表格 -->
                      <div class="data-list">
                         <el-table
                            :data="tableData"
                            style="width: 100%"
                            @row-dblclick="dialogVisible = true"
                            >
                               <el-table-column
                                 label="区总"
                                 width="80"
                                 >
                                  <template slot-scope="scope">
                                          <p><a class="blue" style="text-decoration:underline;" @click="nextStep(scope.row.id,scope.row.name)">{{scope.row.name}}</a></p>
                                  </template>
                               </el-table-column>
                                
                               <el-table-column
                                 prop="partName"
                                 label="部门名称"
                                 width="100">
                               </el-table-column>

                               <el-table-column label="成交单数" align="center">                              
                                       <el-table-column
                                         prop="num1"
                                         label="租赁"
                                         width="100">
                                       </el-table-column>
                                       <el-table-column
                                         prop="num1"
                                         label="低佣买卖"
                                         width="100">
                                       </el-table-column>
                                       <el-table-column
                                         prop="num1"
                                         label="二手买卖"
                                         width="100">
                                       </el-table-column>
                                        <el-table-column
                                         prop="num1"
                                         label="代办"
                                         width="100">
                                       </el-table-column>
                              </el-table-column>
                              
                              <el-table-column label="当期实收金额(元)" align="center">                              
                                       <el-table-column
                                         prop="num1"
                                         label="租赁"
                                         width="100">
                                       </el-table-column>
                                       <el-table-column
                                         prop="num1"
                                         label="低佣买卖"
                                         width="100">
                                       </el-table-column>
                                       <el-table-column
                                         prop="num1"
                                         label="二手买卖"
                                         width="100">
                                       </el-table-column>
                                        <el-table-column
                                         prop="num1"
                                         label="代办"
                                         width="100">
                                       </el-table-column>
                              </el-table-column>
                             
                               <el-table-column
                                 prop="num2"
                                 label="当期实收金额合计(元)"
                                 width="160">
                               </el-table-column>
                              
                               <el-table-column label="当期应收金额(元)" align="center">                              
                                       <el-table-column
                                         prop="num1"
                                         label="租赁"
                                         width="100">
                                       </el-table-column>
                                       <el-table-column
                                         prop="num1"
                                         label="低佣买卖"
                                         width="100">
                                       </el-table-column>
                                       <el-table-column
                                         prop="num1"
                                         label="二手买卖"
                                         width="100">
                                       </el-table-column>
                                        <el-table-column
                                         prop="num1"
                                         label="代办"
                                         width="100">
                                       </el-table-column>
                              </el-table-column>
                              
                              <el-table-column
                                 prop="num2"
                                 label="当期应收金额合计(元)"
                                 width="160">
                              </el-table-column>
                             

                              <el-table-column
                                 prop="num2"
                                 label="本期期末未收金额(元)"
                                 width="160">
                              </el-table-column>

                             <el-table-column
                                 prop="num2"
                                 label="当期违约金合计(元)"
                                 width="160">
                              </el-table-column>  


                            <el-table-column label="当期成本合计(元)" align="center">                              
                                       <el-table-column
                                         prop="num1"
                                         label="特许服务费"
                                         width="100">
                                       </el-table-column>
                                       <el-table-column
                                         prop="num1"
                                         label="刷卡手续费"
                                         width="100">
                                       </el-table-column>
                            </el-table-column>
                               
                           
                             <el-table-column
                                 label="总实收金额(元)"
                                 width="160">
                                 <template slot-scope="scope">
                                          <p class="orange">{{scope.row.num2}}</p>
                                  </template>                         
                            </el-table-column> 



                          </el-table>
                      </div>
                      
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
</template>

<script>
export default {
  name: "actualAchievement",
  data() {
    return {
      tableData: [
        {
          partName: "汉口大区",
          num1: 200,
          num2: 6000000,
          name: "张三",
          id: 0
        },
        {
          partName: "汉口大区",
          num1: 200,
          num2: 6000000,
          name: "李四",
          id: 1
        },
        {
          partName: "汉口大区",
          num1: 200,
          num2: 6000000,
          name: "王五",
          id: 2
        },
        {
          partName: "汉口大区",
          num1: 200,
          num2: 6000000,
          name: "李六",
          id: 3
        }
      ],
      rules: {
        region: [
          {
            label: "区域一",
            value: "shanghai"
          },
          {
            label: "区域二",
            value: "quyuer"
          }
        ]
      },
      // 筛选条件
      propForm: {
        region: "",
        regionName: "",
        search: "",
        paper: "选项1",
        time: "选项11",
        dateMo: ""
      },
      // 筛选选项
      rules: {
        region: [
          {
            label: "区域一",
            value: "shanghai"
          },
          {
            label: "区域二",
            value: "quyuer"
          }
        ],
        regionName: [
          {
            label: "区域一",
            value: "shangha"
          },
          {
            label: "区域二",
            value: "quyue"
          }
        ],
        paper: [
          {
            label: "合同1",
            value: "yi"
          },
          {
            label: "合同2",
            value: "er"
          }
        ],
        time: [
          {
            label: "开票日期",
            value: "选项11"
          },
          {
            label: "区域二",
            value: "选项21"
          }
        ]
      },
      total: 0,
      brandShow: false,
      brandArr: []
    };
  },
  components: {},
  methods: {
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    nextStep(id, name) {
      console.log(id);
      this.brandArr.push({ name: name, id: id });
      console.log(this.brandArr);
      this.brandShow = true;
    },
    askData(id,index) {
     console.log(id);
     console.log(index);
     this.brandArr.splice(index,this.brandArr.length-index-1)
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
  //  筛选条件
  .filter-layout {
    min-height: 128px;
    // width: 1680px;
    margin-right: 20px;
    background-color: #fff;
    overflow: hidden;
    .filter-left {
      h1 {
        font-size: 18px;
        color: #233241;
        margin-top: 28px;
        position: relative;
        padding-left: 48px;
        b {
          position: absolute;
          width: 16px;
          height: 16px;
          // background-color: red;
          left: 20px;
          top: 50%;
          margin-top: -8px;
        }
      }
    }
    .filter-right {
      margin-top: 19px;
      margin-right: 30px;
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
    // height: 1000px;
    margin-right: 20px;
    margin-top: 15px;
    /deep/ .el-table__header th {
      background-color: #eef2fb;
    }
    // /deep/ .has-gutter tr th:nth-of-type(3) > .cell:first-of-type {
    //   text-align: center !important;
    //   color: red;
    // }
    .data-head {
      height: 120px;
      background-color: #fff;
      // padding-left: 48px;
      .data-head-left {
        position: relative;
        b {
          position: absolute;
          width: 16px;
          height: 16px;
          left: 20px;
          top: 63%;
          // margin-top: -8px;
        }
        span:first-of-type {
          color: #233241;
          display: inline-block;
          margin-top: 30px;
          font-size: 18px;
          margin-left: 48px;
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

  .el-breadcrumb {
    padding-left: 45px;
    margin-top: 20px;

    /deep/ .el-breadcrumb__inner {
      color: #99a1aa !important;
      font-size: 14px;
      font-weight: normal;
      text-decoration: underline;
      display: inline-block;
    }
    /deep/ .el-breadcrumb__item:last-of-type span {
      color: #478de3 !important;
      text-decoration: none;
    }
    // /deep/ .el-breadcrumb__item:last-of-type {
    //   color: #478de3 !important;
    // }
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
