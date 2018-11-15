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
                                       <el-select v-model="propForm.region"  class="w200" filterable>
                                           <el-option 
                                           v-for="item in rules.region" 
                                           :key="item.value"
                                           :label="item.label" 
                                           :value="item.value"></el-option>
                                       </el-select>
                                   </el-form-item>
                                   <el-form-item 
                                   prop="regionName">
                                       <el-select v-model="propForm.regionName" class="w100" filterable>
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
                            :data="selectAchList"
                            style="width: 100%"
                            @row-dblclick="enterDetail"
                            >
                               <el-table-column
                                 label="合同信息"
                                 width="240"
                                 >
                                  <template slot-scope="scope">
                                          <p>合同编号：<span class="blue">{{scope.row.code}}</span></p>
                                          <p>房源编号：<span class="blue">{{scope.row.houseinfoCode}}</span> {{scope.row.ownerName}}</p>
                                          <p>客源编号：<span class="blue">{{scope.row.guestinfoCode}}</span> {{scope.row.customerName}}</p>
                                  </template>
                               </el-table-column>

                               <el-table-column
                                 label="业绩状态"
                                 width="100">
                                  <template slot-scope="scope">
                                     <p v-if="scope.row.achievementState==0" class="blue">未审核</p>
                                     <p v-if="scope.row.achievementState==1" class="green">已通过</p>
                                     <p v-if="scope.row.achievementState==2" class="orange">已驳回</p>
                                  </template>
                               </el-table-column>

                               <el-table-column
                                 label="合同类型"
                                 width="100">
                                 <template slot-scope="scope">
                                     <p v-if="scope.row.contType==0">租赁</p>
                                     <p v-if="scope.row.contType==1">买卖</p>
                                     <p v-if="scope.row.contType==2">代办</p>
                                  </template>

                               </el-table-column>

                                <el-table-column
                                 prop="propertyAddr"
                                 label="物业地址"
                                 width="210">
                               </el-table-column>

                               <el-table-column
                                 label="成交经纪人"
                                 width="170">
                                     <template slot-scope="scope">
                                       <p v-if="scope.row.dealName">{{scope.row.dealStorefront}}-{{scope.row.dealName}}</p>
                                       <p v-else>暂无</p>
                                     </template>
                               </el-table-column>

                               <el-table-column
                                 prop="date"
                                 label="签约日期"
                                 width="110">
                                  <template slot-scope="scope">
                                       <p>{{scope.row.signDate|formatDate}}</p>
                                   </template>
                               </el-table-column>


                               <el-table-column
                                 label="分成类型"
                                 width="110">
                                   <template slot-scope="scope">
                                     <!-- 目前一期分成类型只有业绩，暂时写死 -->
                                       <p>业绩</p>
                                   </template>
                               </el-table-column>


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

                               <el-table-column
                                 label="分成比例"
                                 width="80">
                                  <template slot-scope="scope">
                                         <p v-for="item in scope.row.distributionFroms">{{item.ratio}}%</p>
                                  </template>
                               </el-table-column>

                               <el-table-column
                                 label="应收分成金额"
                               >
                                  <template slot-scope="scope">
                                         <p v-for="item in scope.row.distributionFroms">{{item.aMoney}}</p>
                                  </template>
                               </el-table-column>
                                </el-table-columfn>
                                <el-table-column
                                 label="操作"
                                 width="100">
                                 <template slot-scope="scope">                           
                                         <!-- <p>{{scope.row.statu}}</p> -->
                                         <div v-if="scope.row.achievementState==0" class="check-btn">
                                            <span @click.stop="checkAch()">审核</span>
                                            <span @click.stop="editAch()">编辑</span>
                                         </div>
                                           <div v-if="scope.row.achievementState==1" class="check-btn">
                                            <span @click.stop="checkAch()">审核</span>
                                            <span @click.stop="editAch()">编辑</span>
                                         </div>
                                          <div v-if="scope.row.achievementState==2" class="check-btn">
                                            <span @click.stop="againCheck()">反审核</span>
                                         </div>
                                  </template>
                               </el-table-column>
                          </el-table>
                      </div>

                      
                     <!-- 分页 -->
                      <el-pagination
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="1"
                           :page-size="2"
                           layout="total,prev, pager, next , jumper"
                           :total="total">
                      </el-pagination>

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
                                      :data="houseArr"
                                      style="width: 100%">
                                      <!-- roleType 分成人角色类型 :
                                                    房源>0:录入、1:维护、2:独家、3:房勘、4:钥匙、5:委托、6:建盘   
                                                    客源>7:主客方、8:推荐人、9:签约人、10:A/M、11:协议方、12:协议方2-->
                                      <el-table-column
                                        label="角色类型"
                                        width="100">
                                              <template slot-scope="scope">
                                                  <div>
                                                      <div v-if="scope.row.roleType==0">
                                                         <p>录入</p>
                                                      </div>
                                                      <div v-if="scope.row.roleType==1">
                                                         <p>维护</p>
                                                      </div>
                                                      <div v-if="scope.row.roleType==2">
                                                         <p>独家</p>
                                                      </div>
                                                       <div v-if="scope.row.roleType==3">
                                                         <p>房勘</p>
                                                      </div>
                                                       <div v-if="scope.row.roleType==4">
                                                         <p>钥匙</p>
                                                      </div>
                                                       <div v-if="scope.row.roleType==5">
                                                         <p>委托</p>
                                                      </div>
                                                       <div v-if="scope.row.roleType==6">
                                                         <p>建盘</p>
                                                      </div>
                                                       <div v-if="scope.row.roleType==7">
                                                         <p>主客方</p>
                                                      </div>
                                                       <div v-if="scope.row.roleType==8">
                                                         <p>推荐人</p>
                                                      </div>
                                                       <div v-if="scope.row.roleType==9">
                                                         <p>签约人</p>
                                                      </div>
                                                       <div v-if="scope.row.roleType==10">
                                                         <p>A/M</p>
                                                      </div>
                                                       <div v-if="scope.row.roleType==11">
                                                         <p>协议方</p>
                                                      </div>
                                                      <div v-if="scope.row.roleType==12">
                                                         <p>协议方2</p>
                                                      </div>
                                                   </div>
                                             </template>
                                      </el-table-column>
                                       
                                       <!-- ratio -->
                                      <el-table-column
                                        prop="ratio"
                                        label="分成比例"
                                        width="80">
                                      </el-table-column>

                                      <!-- assignor -->
                                      <el-table-column
                                        prop="assignor"
                                        label="经纪人"
                                        width="80">
                                      </el-table-column>
                                       <!-- isJob  在职状态(0:离职  1:在职 2:待入职) -->
                                       <el-table-column
                                        label="在职状况"
                                        width="80">
                                               <template slot-scope="scope">
                                                  <div>
                                                      <div v-if="scope.row.isJob==0">
                                                         <p>离职</p>
                                                      </div>
                                                      <div v-if="scope.row.isJob==1">
                                                         <p>在职</p>
                                                      </div>
                                                      <div v-if="scope.row.isJob==2">
                                                         <p>待入职</p>
                                                      </div>
                                                   </div>
                                             </template>
                                      </el-table-column>

                                      <!-- shopkeeper -->
                                       <el-table-column
                                        prop="shopkeeper"
                                        label="店长"
                                        width="80">
                                      </el-table-column>
                                       <!-- level4 -->
                                      <el-table-column
                                        prop="level4"
                                        label="单组"
                                        width="120">
                                      </el-table-column>
                                       <!-- level3 -->
                                       <el-table-column
                                        prop="level3"
                                        label="门店"
                                        width="110">
                                      </el-table-column>

                                      <!-- amaldar -->
                                     <el-table-column
                                        prop="amaldar"
                                        label="区经"
                                        width="60"> 
                                      </el-table-column>

                                      <!-- manager -->
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
                                      :data="clientArr"
                                      style="width: 100%">
                                      <!-- roleType 分成人角色类型 :
                                                    房源>0:录入、1:维护、2:独家、3:房勘、4:钥匙、5:委托、6:建盘   
                                                    客源>7:主客方、8:推荐人、9:签约人、10:A/M、11:协议方、12:协议方2-->
                                      <el-table-column
                                        label="角色类型"
                                        width="100">
                                              <template slot-scope="scope">
                                                  <div>
                                                      <div v-if="scope.row.roleType==0">
                                                         <p>录入</p>
                                                      </div>
                                                      <div v-if="scope.row.roleType==1">
                                                         <p>维护</p>
                                                      </div>
                                                      <div v-if="scope.row.roleType==2">
                                                         <p>独家</p>
                                                      </div>
                                                       <div v-if="scope.row.roleType==3">
                                                         <p>房勘</p>
                                                      </div>
                                                       <div v-if="scope.row.roleType==4">
                                                         <p>钥匙</p>
                                                      </div>
                                                       <div v-if="scope.row.roleType==5">
                                                         <p>委托</p>
                                                      </div>
                                                       <div v-if="scope.row.roleType==6">
                                                         <p>建盘</p>
                                                      </div>
                                                       <div v-if="scope.row.roleType==7">
                                                         <p>主客方</p>
                                                      </div>
                                                       <div v-if="scope.row.roleType==8">
                                                         <p>推荐人</p>
                                                      </div>
                                                       <div v-if="scope.row.roleType==9">
                                                         <p>签约人</p>
                                                      </div>
                                                       <div v-if="scope.row.roleType==10">
                                                         <p>A/M</p>
                                                      </div>
                                                       <div v-if="scope.row.roleType==11">
                                                         <p>协议方</p>
                                                      </div>
                                                      <div v-if="scope.row.roleType==12">
                                                         <p>协议方2</p>
                                                      </div>
                                                   </div>
                                             </template>
                                      </el-table-column>
                                       
                                       <!-- ratio -->
                                      <el-table-column
                                        prop="ratio"
                                        label="分成比例"
                                        width="80">
                                      </el-table-column>

                                      <!-- assignor -->
                                      <el-table-column
                                        prop="assignor"
                                        label="经纪人"
                                        width="80">
                                      </el-table-column>
                                       <!-- isJob  在职状态(0:离职  1:在职 2:待入职) -->
                                       <el-table-column
                                        label="在职状况"
                                        width="80">
                                               <template slot-scope="scope">
                                                  <div>
                                                      <div v-if="scope.row.isJob==0">
                                                         <p>离职</p>
                                                      </div>
                                                      <div v-if="scope.row.isJob==1">
                                                         <p>在职</p>
                                                      </div>
                                                      <div v-if="scope.row.isJob==2">
                                                         <p>待入职</p>
                                                      </div>
                                                   </div>
                                             </template>
                                      </el-table-column>

                                      <!-- shopkeeper -->
                                       <el-table-column
                                        prop="shopkeeper"
                                        label="店长"
                                        width="80">
                                      </el-table-column>
                                       <!-- level4 -->
                                      <el-table-column
                                        prop="level4"
                                        label="单组"
                                        width="120">
                                      </el-table-column>
                                       <!-- level3 -->
                                       <el-table-column
                                        prop="level3"
                                        label="门店"
                                        width="110">
                                      </el-table-column>

                                      <!-- amaldar -->
                                     <el-table-column
                                        prop="amaldar"
                                        label="区经"
                                        width="60"> 
                                      </el-table-column>

                                      <!-- manager -->
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
                                      :data="checkArr"
                                      style="width: 100%">
                                       <!-- examineDate -->
                                      <el-table-column
                                        label="时间"
                                        width="200">
                                          <template slot-scope="scope">
                                             <p>{{scope.row.examineDate|formatDate}}</p>      
                                          </template>
                                      </el-table-column>
                                      <!-- auditorDepartment -->
                                      <el-table-column
                                        prop="auditorDepartment"
                                        label="部门"
                                        width="100">
                                      </el-table-column>
                                      <!-- auditor -->
                                      <el-table-column
                                        prop="auditor"
                                        label="员工"
                                        width="100">
                                      </el-table-column>
                                     
                                     <!-- result审核结果(0未审核 1通过 2驳回)(薪资组审核) -->
                                      <el-table-column
                                        prop="done"
                                        label="操作"
                                        width="170">
                                             <template slot-scope="scope">
                                                  <div>
                                                      <div v-if="scope.row.result==0">
                                                         <p class="blue">未审核</p>
                                                      </div>
                                                      <div v-if="scope.row.result==1">
                                                         <p class="green">已通过</p>
                                                      </div>
                                                      <div v-if="scope.row.result==2">
                                                         <p class="orange">已驳回</p>
                                                      </div>
                                                   </div>
                                             </template>
                                      </el-table-column>

                                      <!-- remark -->
                                      <el-table-column
                                        prop="remark"
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

         </div>
</template>

<script>
// 引入审核，编辑，反审核，分成弹框
import achDialog from "./achDialog";

export default {
  name: "actualAchievement",
  data() {
    return {
      selectAchList: [], //应收列表数组
      countData: [], //数据统计数组
      houseArr: [], //应收详情房源数组
      clientArr: [], //应收详情客源数组
      checkArr: [], //应收详情审核信息数组
      pageSize: 5,
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
  created() {
    this.getData();
  },
  components: {
    achDialog
  },
  methods: {
    getData() {
      let param = {
        pageNum: 1,
        pageSize: 2
      };
      this.$ajax
        .get("/api/achievement/selectAchievementList", param)
        .then(res => {
          console.log(res);
          let data = res.data;
          if (res.status === 200) {
            this.selectAchList = data.data.list;
            this.countData = data.data.list[0].contractCount;
            this.total = data.data.total;
            console.log(data.data.total);
          }
        });
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    //获取应收列表详情
    enterDetail(row) {
      //合同边和获取业绩详情
      let param = { code: row.code };
      this.$ajax
        .get("/api/achievement/selectAchievementByCode", param)
        .then(res => {
          console.log(res);
          let data = res.data;
          if (res.status === 200) {
            this.houseArr = data.data[0];
            this.clientArr = data.data[1];
            this.checkArr = data.data[2];
          }
        });
      this.dialogVisible = true;
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
      console.log(val);
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
    min-height: 180px;
    background-color: #fff;
    overflow: hidden;
    padding: 20px;
    padding-bottom: 0;
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
          left: 0px;
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
    padding: 20px;
    padding-top: 0;
    background-color: #fff;
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
