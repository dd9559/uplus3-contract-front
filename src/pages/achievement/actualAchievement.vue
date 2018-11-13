<template>   
      <div class="layout">
                 <!-- 头部面包屑 -->
                <!-- <div class="head clearfix">
                    <div class="head-left">
                       <el-breadcrumb separator-class="el-icon-arrow-right">
                          <el-breadcrumb-item :to="{ path: '/' }">业绩</el-breadcrumb-item>
                          <el-breadcrumb-item>应收业绩</el-breadcrumb-item>
                       </el-breadcrumb>
                    </div>
                    <div class="head-right">
                       <button>刷新</button>
                       <button>返回</button>
                    </div> 
                </div> -->
                <!-- 头部面包屑 end-->

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
                               
                                   <el-form-item 
                                   label="合同类型" 
                                   prop="paper">
                                       <el-select v-model="propForm.paper" class="w120">
                                           <el-option 
                                           v-for="item in rules.paper" 
                                           :key="item.value"
                                           :label="item.label" 
                                           :value="item.value"></el-option>
                                       </el-select>
                                   </el-form-item>

                                    <el-form-item 
                                   label="分成类型" 
                                   prop="paper">
                                       <el-select v-model="propForm.paper" class="w120">
                                           <el-option 
                                           v-for="item in rules.paper" 
                                           :key="item.value"
                                           :label="item.label" 
                                           :value="item.value"></el-option>
                                       </el-select>
                                   </el-form-item>

                                    <el-form-item 
                                   label="业绩状态" 
                                   prop="paper">
                                       <el-select v-model="propForm.paper" class="w120">
                                           <el-option 
                                           v-for="item in rules.paper" 
                                           :key="item.value"
                                           :label="item.label" 
                                           :value="item.value"></el-option>
                                       </el-select>
                                   </el-form-item>

                                   <el-form-item 
                                   label="签约日期"
                                   prop="dateMo"
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


                                   <p>
                                         <el-form-item label="关键字" prop="search">
                                       <el-autocomplete
                                       class="w312"
                                       v-model="propForm.search"
                                       placeholder="开票人员/合同编号/票据编"
                                       :trigger-on-focus="false"
                                       clearable
                                       ></el-autocomplete>
                                   </el-form-item>
                                   </p>
                               </el-form>
                     </div>
                </div> 
                <!-- 筛选条件 end -->
                <!-- 数据列表 -->
                 <div class="data-layout">
                      <!-- 头部 -->
                      <div class="data-head">
                           <div class="data-head-left f_l">
                              <b class="el-icon-date"></b> 
                              <span>

                                  数据列表
                              </span> 
                           </div>
                          <div class="data-head-right f_l">
                              <span>总分成：<b>55922元</b>，</span>
                              <span>分类分成：<b>45392元</b>，</span>
                              <span>出售：<b>11754元</b>，</span>
                              <span>代办：<b>2000元</b>，</span>
                              <span>出租：<b>52747元</b></span>
                          </div>      
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
                                 label="合同信息"
                                 width="240"
                                 >
                                  <template slot-scope="scope">
                                          <p>合同编号：<span class="blue">YQYD001163</span></p>
                                          <p>房源编号：<span class="blue">YQYD001163</span> 姓名</p>
                                          <p>客源编号：<span class="blue">YQYD001163</span> 姓名</p>
                                  </template>
                               </el-table-column>
                               <el-table-column
                                 prop="statu"
                                 label="业绩状态"
                                 width="100">
                                  <template slot-scope="scope">
                                     <p v-if="scope.row.statu==0" class="blue">未审核</p>
                                     <p v-if="scope.row.statu==1" class="green">已通过</p>
                                     <p v-if="scope.row.statu==2" class="orange">已驳回</p>
                                  </template>
                               </el-table-column>
                               <el-table-column
                                 prop="type"
                                 label="合同类型"
                                 width="100">
                               </el-table-column>
                                <el-table-column
                                 prop="address"
                                 label="物业地址"
                                 width="210">
                               </el-table-column>
                                   <el-table-column
                                 prop="man"
                                 label="成交经纪人"
                                 width="170">
                               </el-table-column>
                                   <el-table-column
                                 prop="date"
                                 label="签约日期"
                                 width="110">
                               </el-table-column>
                               <el-table-column
                                 prop="type1"
                                 label="分成类型"
                                 width="110">
                               </el-table-column>
                                <el-table-column
                                 label="分成人"
                                 width="170">
                                  <template slot-scope="scope">
                                          <p>当代一店-夏天雨</p>
                                          <p>当代一店-秋天叶</p>
                                  </template>
                               </el-table-column>
                               <el-table-column
                                 label="角色类型"
                                 width="130">
                                  <template slot-scope="scope">
                                          <p>房源维护人</p>
                                          <p>主客方</p>
                                  </template>
                               </el-table-column>
                                 <el-table-column
                                 label="分成比例"
                                 width="100">
                                  <template slot-scope="scope">
                                         <p>10%</p>
                                         <p>20%</p>
                                         <p>50%</p>
                                  </template>
                               </el-table-column>
                                 <el-table-column
                                 prop="amout"
                                 label="应收分成金额"
                               >
                               </el-table-column>
                                </el-table-columfn>
                                <el-table-column
                                 label="操作"
                                 width="100">
                                 <template slot-scope="scope">                           
                                         <!-- <p>{{scope.row.statu}}</p> -->
                                         <div v-if="scope.row.statu==0" class="check-btn">
                                            <span @click.stop="checkAch()">审核</span>
                                            <span @click.stop="editAch()">编辑</span>
                                         </div>
                                           <div v-if="scope.row.statu==1" class="check-btn">
                                            <span @click.stop="checkAch()">审核</span>
                                            <span @click.stop="editAch()">编辑</span>
                                         </div>
                                          <div v-if="scope.row.statu==2" class="check-btn">
                                            <span @click.stop="againCheck()">反审核</span>
                                         </div>
                                  </template>
                               </el-table-column>
                          </el-table>
                      </div>
                </div>

                   <!-- 表单列表弹出框（业绩详情） -->
                     <el-dialog
                         :visible.sync="dialogVisible"
                         width="30%"
                         >
                          <b class="el-icon-close" @click="closeDialog"></b>
                           <div class="ach-header">
                             <h1>业绩详情</h1>  
                             <p>可分配业绩：<span class="orange">3000元</span></p>
                           </div> 
                           <div class="ach-body">

                                <h1>房源方分成</h1>
                                <div class="ach-divide-list">
                                     <el-table
                                      :data="achDetail"
                                      style="width: 100%">
                                      <el-table-column
                                        prop="role_type"
                                        label="角色类型"
                                        width="100">
                                      </el-table-column>

                                      <el-table-column
                                        prop="distributionList"
                                        label="分成比例"
                                        width="80">
                                      </el-table-column>

                                      <el-table-column
                                        prop="name"
                                        label="经纪人"
                                        width="80">
                                      </el-table-column>

                                       <el-table-column
                                        prop="is_job"
                                        label="在职状况"
                                        width="80">
                                      </el-table-column>

                                      
                                       <el-table-column
                                        prop="shopowner"
                                        label="店长"
                                        width="80">
                                      </el-table-column>

                                      <el-table-column
                                        prop="level4"
                                        label="单组"
                                        width="120">
                                      </el-table-column>

                                       <el-table-column
                                        prop="level3"
                                        label="门店"
                                        width="110">
                                      </el-table-column>

                                     <el-table-column
                                        prop="amaldar"
                                        label="区经"
                                        width="60"> 
                                      </el-table-column>

                                      
                                     <el-table-column
                                        prop="manager"
                                        label="区总"
                                        width="60"> 
                                      </el-table-column>
                                    </el-table>
                                </div>

                                <h1>客源方分成</h1>
                                <div class="ach-divide-list">
                                     <el-table
                                      :data="achDetail"
                                      style="width: 100%">
                                      <el-table-column
                                        prop="role_type"
                                        label="角色类型"
                                        width="100">
                                      </el-table-column>

                                      <el-table-column
                                        prop="distributionList"
                                        label="分成比例"
                                        width="80">
                                      </el-table-column>

                                      <el-table-column
                                        prop="name"
                                        label="经纪人"
                                        width="80">
                                      </el-table-column>

                                       <el-table-column
                                        prop="is_job"
                                        label="在职状况"
                                        width="80">
                                      </el-table-column>

                                      
                                       <el-table-column
                                        prop="shopowner"
                                        label="店长"
                                        width="80">
                                      </el-table-column>

                                      <el-table-column
                                        prop="level4"
                                        label="单组"
                                        width="120">
                                      </el-table-column>

                                       <el-table-column
                                        prop="level3"
                                        label="门店"
                                        width="110">
                                      </el-table-column>

                                     <el-table-column
                                        prop="amaldar"
                                        label="区经"
                                        width="60"> 
                                      </el-table-column>

                                      
                                     <el-table-column
                                        prop="manager"
                                        label="区总"
                                        width="60"> 
                                      </el-table-column>
                                    </el-table>
                                </div>


                                <h1>审核信息</h1>

                                <div class="ach-check-list">
                                      <el-table
                                      :data="checkDetail"
                                      style="width: 100%">

                                      <el-table-column
                                        prop="date"
                                        label="时间"
                                        width="200">
                                      </el-table-column>

                                      <el-table-column
                                        prop="part"
                                        label="部门"
                                        width="100">
                                      </el-table-column>

                                      <el-table-column
                                        prop="job"
                                        label="员工"
                                        width="100">
                                      </el-table-column>
                                     
                                     
                                      <el-table-column
                                        prop="done"
                                        label="操作"
                                        width="170">
                                      </el-table-column>

                                      
                                      <el-table-column
                                        prop="beizhu"
                                        label="备注"
                                        width="190">
                                      </el-table-column>

                                    </el-table>
                                </div>
                           </div> 
                           <div class="ach-footer"></div> 
                     </el-dialog>

                     <!-- 审核，编辑，反审核，业绩分成弹框 -->
                     <achDialog :shows="shows" v-on:close="shows=false" :dialogType="dialogType"></achDialog>

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
import achDialog from "./achDialog";

export default {
  name: "actualAchievement",
  data() {
    return {
      tableData: [
        {
          name:
            "合同编号：YQYD001163房源编号：YQYD001163-姓名客源编号：YQYD001163-姓名",
          statu: 0,
          type: "租赁",
          address: "安居苑10栋3单元1102",
          man: "当代一店-夏雨天",
          date: "2018/6/28",
          type1: "业绩分成",
          man1: "当代一店-夏雨天当代一店-夏雨天当代一店-夏雨天当代一店-夏雨天",
          type2: "房源维护人主客方",
          radio: "20%-80%",
          amout: "400-500"
        },
        {
          name:
            "合同编号：YQYD001163房源编号：YQYD001163-姓名客源编号：YQYD001163-姓名",
          statu: 1,
          type: "租赁",
          address: "安居苑10栋3单元1102",
          man: "当代一店-夏雨天",
          date: "2018/6/28",
          type1: "业绩分成",
          man1: "当代一店-夏雨天当代一店-夏雨天",
          type2: "房源维护人主客方",
          radio: "20%-80%",
          amout: "400-500"
        },
        {
          name:
            "合同编号：YQYD001163房源编号：YQYD001163-姓名客源编号：YQYD001163-姓名",
          statu: 2,
          type: "租赁",
          address: "安居苑10栋3单元1102",
          man: "当代一店-夏雨天",
          date: "2018/6/28",
          type1: "业绩分成",
          man1: "当代一店-夏雨天当代一店-夏雨天",
          type2: "房源维护人主客方",
          radio: "20%-80%",
          amout: "400-500"
        },
        {
          name:
            "合同编号：YQYD001163房源编号：YQYD001163-姓名客源编号：YQYD001163-姓名",
          statu: 0,
          type: "租赁",
          address: "安居苑10栋3单元1102",
          man: "当代一店-夏雨天",
          date: "2018/6/28",
          type1: "业绩分成",
          man1: "当代一店-夏雨天当代一店-夏雨天",
          type2: "房源维护人主客方",
          radio: "20%-80%",
          amout: "400-500"
        },
        {
          name:
            "合同编号：YQYD001163房源编号：YQYD001163-姓名客源编号：YQYD001163-姓名",
          statu: 1,
          type: "租赁",
          address: "安居苑10栋3单元1102",
          man: "当代一店-夏雨天",
          date: "2018/6/28",
          type1: "业绩分成",
          man1: "当代一店-夏雨天当代一店-夏雨天",
          type2: "房源维护人主客方",
          radio: "20%-80%",
          amout: "400-500"
        },
        {
          name:
            "合同编号：YQYD001163房源编号：YQYD001163-姓名客源编号：YQYD001163-姓名",
          statu: 2,
          type: "租赁",
          address: "安居苑10栋3单元1102",
          man: "当代一店-夏雨天",
          date: "2018/6/28",
          type1: "业绩分成",
          man1: "当代一店-夏雨天当代一店-夏雨天",
          type2: "房源维护人主客方",
          radio: "20%-80%",
          amout: "400-500"
        },
        {
          name:
            "合同编号：YQYD001163房源编号：YQYD001163-姓名客源编号：YQYD001163-姓名",
          statu: 0,
          type: "租赁",
          address: "安居苑10栋3单元1102",
          man: "当代一店-夏雨天",
          date: "2018/6/28",
          type1: "业绩分成",
          man1: "当代一店-夏雨天当代一店-夏雨天",
          type2: "房源维护人主客方",
          radio: "20%-80%",
          amout: "400-500"
        }
      ],
      achDetail: [
        {
          role_type: "房源录入人",
          distributionList: "10",
          name: "经纪人",
          is_job: "离职",
          shopowner: "店长",
          level4: "楚河汉街一店",
          level3: "门店名称",
          amaldar: "区经",
          manager: "区总"
        },
        {
          role_type: "房源录入人",
          distributionList: "10",
          name: "经纪人",
          is_job: "离职",
          shopowner: "店长",
          level4: "楚河汉街一店",
          level3: "门店名称",
          amaldar: "区经",
          manager: "区总"
        }
      ],
      checkDetail: [
        {
          date: "2018/10/23 10:24",
          part: "技术部",
          job: "冬天雪",
          done: "审批通过",
          beizhu: "审核备注信息"
        },
        {
          date: "2018/10/23 10:24",
          part: "技术部",
          job: "冬天雪",
          done: "审批通过",
          beizhu: "审核备注信息"
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
      dialogVisible: false,
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
      shows: false,
      dialogType: 0, //0代表审核  1代表编辑  2代表反审核  3代表业绩分成
      total: 0
    };
  },
  components: {
    achDialog
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false;
    },
    checkAch() {
      this.dialogType = 0;
      console.log(this.dialogType);
      this.shows = true;
    },
    editAch() {
      this.dialogType = 1;
      console.log(this.dialogType);
      this.shows = true;
    },
    againCheck() {
      this.dialogType = 2;
      console.log(this.dialogType);
      this.shows = true;
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
    height: 180px;
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
    background-color: skyblue;
    margin-top: 15px;
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

  //业绩详情弹框改变样式
  /deep/ .el-dialog {
    min-width: 856px;
    height: 666px;
    overflow: auto;
    b {
      position: absolute;
      right: 30px;
      top: 30px;
      font-size: 30px;
    }
    .ach-header {
      min-height: 80px;
      min-width: 100%;
      background-color: #fff;
      border-bottom: 1px solid #edecf0;
      overflow: hidden;
      h1 {
        font-size: 20px;
        color: #233241;
        margin: 20px 0 0 30px;
      }
      p {
        font-size: 14px;
        color: #6c7986;
        margin: 12px 0 0 30px;
        line-height: 0;
      }
    }
    .ach-body {
      min-height: 585px;
      min-width: 100%;
      // background-color: pink;
      padding: 0 30px;
      box-sizing: border-box;
      overflow-y: auto;
      /deep/ .el-table {
        font-size: 14px !important;
        margin-top: 20px;
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
      //弹框审核信息
      h1 {
        font-size: 16px;
        color: #233241;
        margin: 20px 0 0 0px;
      }
    }
  }
  /deep/ .el-dialog__header,
  /deep/ .el-dialog__footer,
  /deep/ .el-dialog__body {
    padding: 0 !important;
  }
  /deep/ .el-dialog__header {
    .el-dialog__headerbtn {
      right: 0;
      top: 0;
      display: none;
    }
  }
}
/deep/ .el-pagination {
text-align: center;
padding-bottom: 50px;
padding-top: 50px;
}
</style>
