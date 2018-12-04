<template>
  <div
    class="layout"
    style="background-color: #f5f5f5"
  >
    <!-- 筛选条件  -->
    <div class="filter-layout">

      <div style="overflow:hidden;">
        <div class="filter-left f_l">
          <h1 class="f14">
            <b
              class="iconfont icon-tubiao-5"
              style="color:#55657A;font-weight:normal;"
            ></b>
            筛选查询
          </h1>
        </div>
        <div class="filter-right f_r">
          <el-button
            type="primary"
            round
            @click="resetData"
          >重置</el-button>
          <el-button
            type="primary"
            round
            @click="filterData"
          >查询</el-button>
        </div>
      </div>

      <div
        class="filter-item"
        v-show="filterShow"
      >
        <!-- 筛选条件 -->
        <el-form
          :inline="true"
          :model="propForm"
          class="prop-form"
          size="small"
        >

          <!-- 部门 -->
          <el-form-item
            label="部门"
            class="mr"
          >
            <el-select
              v-model="propForm.department"
              class="w200"
              filterable
              @change="selUser"
            >
              <el-option
                v-for="(item,index) in departs"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select
              v-model="propForm.departmentDetail"
              class="w100"
              filterable
            >
              <el-option
                v-for="(item,index) in users"
                :key="index"
                ref="user"
                :label="item.name"
                :value="item.empId"
              ></el-option>
            </el-select>
          </el-form-item>

          

          <el-form-item
            label="合同类型"
            prop="contractType"
          >
            <el-select
              v-model="propForm.contractType"
              class="w120"
              :clearable="true"
            >
              <el-option
                v-for="item in dictionary['10']"
                :key="item.value"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="分成类型"
            prop="divideType"
          >
            <el-select
              v-model="propForm.divideType"
              class="w120"
              :clearable="true"
            >
              <el-option
                v-for="item in dictionary['21']"
                :key="item.value"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="业绩状态"
            prop="achType"
          >
            <el-select
              v-model="propForm.achType"
              class="w120"
              :clearable="true"
            >
              <el-option
                v-for="item in dictionary['52']"
                :key="item.value"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="签约日期"
            prop="dateMo"
            class="mr"
          >
            <el-date-picker
              v-model="propForm.dateMo"
              class="w330"
              type="daterange"
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item
            label="关键字"
            prop="search"
          >
            <el-input
              class="w460"
              v-model="propForm.search"
              placeholder="合同编号/房源编号/客源编号物业地址/业主/客户/房产证号/手机号"
              :trigger-on-focus="false"
              clearable
            ></el-input>
          </el-form-item>

        </el-form>
      </div>

      <div
        class="btn"
        @click="filterShow=!filterShow"
      ></div>
    </div>
    <!-- 筛选条件 end -->
    <!-- 数据列表 -->
    <div class="data-layout">
      <!-- 头部 -->
      <div class="data-head">
        <div class="data-head-left f_l">
          <b
            class="iconfont icon-tubiao-11"
            style="color:#55657A;font-weight:normal;"
          ></b>
          <span>
            数据列表
          </span>
        </div>
        <div class="data-head-right f_l">
          <span>总分成：<b>{{countData[3]}}元</b>，</span>
          <span>分类分成：</span>
          <span>出售：<b>{{countData[1]}}元</b>，</span>
          <span>代办：<b>{{countData[2]}}元</b>，</span>
          <span>出租：<b>{{countData[0]}}元</b></span>
        </div>
      </div>
      <!-- 头部 end -->

      <!-- 表格 -->
      <div class="data-list"  v-loading="loading">
        <el-table
          :data="selectAchList"
          style="width: 100%"
          @row-dblclick="enterDetail"
        >
          <el-table-column
            label="合同信息"
            width="250"
          >
            <template slot-scope="scope">
              <p>合同编号：<span
                  class="blue"
                  @click="skipContDel(scope.row)"
                  style="cursor:pointer;"
                >{{scope.row.code}}</span></p>
              <p>房源编号：<span class="blue">{{scope.row.houseinfoCode}}</span> {{scope.row.ownerName}}</p>
              <p>客源编号：<span class="blue">{{scope.row.guestinfoCode}}</span> {{scope.row.customerName}}</p>
            </template>
          </el-table-column>

          <el-table-column
            label="业绩状态"
            width="100"
          >
            <template slot-scope="scope">
              <p
                v-if="scope.row.achievementState==6"
                class="blue"
              >待审核</p>
              <p
                v-if="scope.row.achievementState==7"
                class="green"
              >通过</p>
              <p
                v-if="scope.row.achievementState==8"
                class="orange"
              >驳回</p>
            </template>
          </el-table-column>

          <el-table-column
            label="合同类型"
            width="80"
          >
              <template slot-scope="scope">
                   <p>{{scope.row.contType.label}}</p>
              </template>
          </el-table-column>

          <el-table-column
            prop="propertyAddr"
            label="物业地址"
            width="210"
          >
          </el-table-column>

          <el-table-column
            label="成交经纪人"
            width="170"
          >
            <template slot-scope="scope">
              <p v-if="scope.row.dealName">{{scope.row.dealStorefront}}-{{scope.row.dealName}}</p>
              <p v-else>暂无</p>
            </template>
          </el-table-column>

          <el-table-column
            prop="date"
            label="签约日期"
            width="110"
          >
            <template slot-scope="scope">
              <p>{{scope.row.signDate|formatDate}}</p>
            </template>
          </el-table-column>

          <el-table-column
            label="分成类型"
            width="80"
          >
            <template slot-scope="scope">
              <!-- 目前一期分成类型只有业绩，暂时写死 -->
              <p>业绩</p>
            </template>
          </el-table-column>

          <el-table-column
            label="分成人"
            width="190"
          >
            <template slot-scope="scope">
              <div v-for="item in scope.row.distributionFroms">
                <p>{{item.level4}}-{{item.assignor}}</p>
                <!-- <p></p> -->
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="角色类型"
            width="120"
          >
            <template slot-scope="scope">
              <div v-for="item in scope.row.distributionFroms">
                <div v-if="item.roleType==1">
                  <p>录入</p>
                </div>
                <div v-else-if="item.roleType==2">
                  <p>维护</p>
                </div>
                <div v-else-if="item.roleType==3">
                  <p>独家</p>
                </div>
                <div v-else-if="item.roleType==4">
                  <p>房勘</p>
                </div>
                <div v-else-if="item.roleType==5">
                  <p>钥匙</p>
                </div>
                <div v-else-if="item.roleType==15">
                  <p>委托</p>
                </div>
                <div v-else-if="item.roleType==16">
                  <p>建盘</p>
                </div>
                <div v-else-if="item.roleType==6">
                  <p>主客方</p>
                </div>
                <div v-else-if="item.roleType==10">
                  <p>推荐人</p>
                </div>
                <div v-else-if="item.roleType==14">
                  <p>签约人</p>
                </div>
                <div v-else-if="item.roleType==11">
                  <p>A/M</p>
                </div>
                <div v-else-if="item.roleType==7">
                  <p>协议方</p>
                </div>
                <div v-else-if="item.roleType==17">
                  <p>协议方2</p>
                </div>
                <div v-else>
                  <p>-</p>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="分成比例"
            width="80"
          >
            <template slot-scope="scope">
              <p v-for="item in scope.row.distributionFroms">{{item.ratio}}%</p>
            </template>
          </el-table-column>

          <el-table-column label="应收分成金额（元）" width="150">
            <template slot-scope="scope">
              <p v-for="item in scope.row.distributionFroms">{{item.aMoney}}</p>
            </template>
          </el-table-column>
          </el-table-columfn>
          <el-table-column
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.isModify==0">
                       <div
                         v-if="scope.row.achievementState==6"
                         class="check-btn"
                       >
                         <span @click.stop="checkAch(scope.row,scope.$index)" style="cursor:pointer;">审核</span>
                         <span @click.stop="editAch(scope.row,scope.$index)" style="cursor:pointer;">编辑</span>
                       </div>
                       <div
                         v-if="scope.row.achievementState==7"
                         class="check-btn"
                       >
                         <span @click.stop="againCheck(scope.row,scope.$index)" style="cursor:pointer;">反审核</span>
                       </div>
                       <div
                         v-if="scope.row.achievementState==8"
                         class="check-btn"
                       >
                         <span @click.stop="checkAch(scope.row,scope.$index)" style="cursor:pointer;">审核</span>
                         <span @click.stop="editAch(scope.row,scope.$index)" style="cursor:pointer;">编辑</span>
                       </div>
              </div>
             <div v-else>
                   <p>-</p>
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
      >
      </el-pagination>

    </div>

    <!-- 表单列表弹出框（业绩详情） -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
    >
      <b
        class="el-icon-close"
        @click="closeDialog"
      ></b>
      <div class="ach-header">
        <h1 class="f14">业绩详情</h1>
        <p class="f14">可分配业绩：<span class="orange">{{comm}}元</span></p>
      </div>
      <div class="ach-body">

        <h1 class="f14">房源方分成</h1>
        <div class="ach-divide-list">
          <el-table
            :data="houseArr"
            style="width: 100%"
          >
            <!-- roleType 分成人角色类型 :
             房源>0:录入、1:维护、2:独家、3:房勘、4:钥匙、5:委托、6:建盘   
             客源>7:主客方、8:推荐人、9:签约人、10:A/M、11:协议方、12:协议方2-->
            <el-table-column
              label="角色类型"
              width="100"
            >
              <template slot-scope="scope">
                <div>
                  <p>{{scope.row.roleName}}</p>
                </div>
              </template>
            </el-table-column>

            <!-- ratio -->
            <el-table-column
              prop="ratio"
              label="分成比例"
              width="80"
            >
            </el-table-column>

            <!-- assignor -->
            <el-table-column
              prop="assignor"
              label="经纪人"
              width="80"
            >
            </el-table-column>
            <!-- isJob  在职状态(0:离职  1:在职 2:待入职) -->
            <el-table-column
              label="在职状况"
              width="80"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.isJob">
                  <p>{{scope.row.isJob.label}}</p>
                </div>
              </template>
            </el-table-column>

            <!-- shopkeeper -->
            <el-table-column
              prop="shopkeeper"
              label="店长"
              width="80"
            >
            </el-table-column>
            <!-- level4 -->
            <el-table-column
              prop="level4"
              label="单组"
              width="120"
            >
            </el-table-column>
            <!-- level3 -->
            <el-table-column
              prop="level3"
              label="门店"
              width="110"
            >
            </el-table-column>

            <!-- amaldar -->
            <el-table-column
              prop="amaldar"
              label="区经"
              width="60"
            >
            </el-table-column>

            <!-- manager -->
            <el-table-column
              prop="manager"
              label="区总"
              width="60"
            >
            </el-table-column>
          </el-table>
        </div>

        <h1 class="f14">客源方分成</h1>
        <div class="ach-divide-list">
          <el-table
            :data="clientArr"
            style="width: 100%"
          >
            <!-- roleType 分成人角色类型 :
                                                    房源>0:录入、1:维护、2:独家、3:房勘、4:钥匙、5:委托、6:建盘   
                                                    客源>7:主客方、8:推荐人、9:签约人、10:A/M、11:协议方、12:协议方2-->
            <el-table-column
              label="角色类型"
              width="100"
            >
              <template slot-scope="scope">
                <div>
                  <p>{{scope.row.roleName}}</p>
                </div>
              </template>
            </el-table-column>

            <!-- ratio -->
            <el-table-column
              prop="ratio"
              label="分成比例"
              width="80"
            >
            </el-table-column>

            <!-- assignor -->
            <el-table-column
              prop="assignor"
              label="经纪人"
              width="80"
            >
            </el-table-column>
            <!-- isJob  在职状态(0:离职  1:在职 2:待入职) -->
            <el-table-column
              label="在职状况"
              width="80"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.isJob">
                   <p>{{scope.row.isJob.label}}</p>
                </div>
              </template>
            </el-table-column>

            <!-- shopkeeper -->
            <el-table-column
              prop="shopkeeper"
              label="店长"
              width="80"
            >
            </el-table-column>
            <!-- level4 -->
            <el-table-column
              prop="level4"
              label="单组"
              width="120"
            >
            </el-table-column>
            <!-- level3 -->
            <el-table-column
              prop="level3"
              label="门店"
              width="110"
            >
            </el-table-column>

            <!-- amaldar -->
            <el-table-column
              prop="amaldar"
              label="区经"
              width="60"
            >
            </el-table-column>

            <!-- manager -->
            <el-table-column
              prop="manager"
              label="区总"
              width="60"
            >
            </el-table-column>
          </el-table>
        </div>

        <h1 class="f14">审核信息</h1>

        <div class="ach-check-list">
          <el-table
            :data="checkArr"
          >
            <!-- examineDate -->
            <el-table-column
              label="时间"
              width="200"
            >
              <template slot-scope="scope">
                   <p v-if="scope.row.examineDate">{{scope.row.examineDate|formatDate}}</p>
                   <p v-else>-</p>
              </template>
            </el-table-column>
            <!-- auditorDepartment -->
            <el-table-column
              prop="auditorDepartment"
              label="部门"
              width="100"
            >
            </el-table-column>
            <!-- auditor -->
            <el-table-column
              prop="auditor"
              label="员工"
              width="100"
            >
            </el-table-column>

            <!-- result审核结果(0未审核 1通过 2驳回)(薪资组审核) -->
            <el-table-column
              prop="done"
              label="操作"
              width="170"
            >
              <template slot-scope="scope">
                <div>
                  <div v-if="scope.row.result.value==6">
                    <p class="blue">未审核</p>
                  </div>
                  <div v-else-if="scope.row.result.value==7">
                    <p class="green">通过</p>
                  </div>
                  <div v-else-if="scope.row.result.value==8">
                    <p class="orange">驳回</p>
                  </div>
                  <div v-else>
                    <p>-</p>
                  </div>
                </div>
              </template>
            </el-table-column>

            <!-- remark -->
            <el-table-column
              label="备注"
            >
               <template slot-scope="scope">
                   {{scope.row.remark?scope.row.remark:'-'}}
              </template>
            </el-table-column>

          </el-table>
        </div>
      </div>
      <div class="ach-footer"></div>
    </el-dialog>

    <!-- 审核，编辑，反审核，业绩分成弹框 -->
    <achDialog
      :shows="shows"
      @close="close"
      :dialogType="dialogType"
      :contractCode="code2"
      :aId="aId"
      :contractId="contractId"
      :achIndex="achIndex"
    ></achDialog>
  </div>
</template>

<script>
// 引入审核，编辑，反审核，分成弹框
import achDialog from "./achDialog";
import { MIXINS } from "@/assets/js/mixins";
export default {
  mixins: [MIXINS],
  name: "actualAchievement",
  data() {
    return {
      selectAchList: [], //应收列表数组
      countData: [], //数据统计数组
      houseArr: [], //应收详情房源数组
      clientArr: [], //应收详情客源数组
      checkArr: [], //应收详情审核信息数组
      departs: [], //部门
      depUser: "",
      users: [],
      dialogVisible: false, //详情弹框
      filterShow: true,
      // 筛选条件
      propForm: {
        department: "", //部门
        departmentDetail: "", //部门详情（员工）
        contractType: "", //合同类型
        divideType: "", //分成类型
        achType: "", //业绩类型
        dateMo: "",
        search: ""
      },
      shows: false,
      dialogType: 0, //0代表审核  1代表编辑  2代表反审核  3代表业绩分成
      code: "",
      code2: "",
      dictionary: {
        //数据字典
        "10": "", //合同类型
        "21": "", //分成状态
        "52": "" //业绩状态
      },
      beginData: false,
      currentPage: 1,
      pageSize:5,
      comm: "", //业绩分成
      aId: null, //业绩id
      contractId: null, //合同id
      achIndex:null,
      ajaxParam:{},
      total:0,
      loading:true
    };
  },
  created() {
    this.ajaxParam={
        pageNum: this.currentPage,
        pageSize: this.pageSize
    } 
    this.getData(this.ajaxParam);
    // 获取部门列表
    this.$ajax.get("/api/access/deps").then(res => {
      if (res.status == 200) {
        console.log(res.data.data);
        this.departs = res.data.data;
      }
    });
    // 字典初始化
    this.getDictionary();

  
  },
  components: {
    achDialog,
    MIXINS
  },
  methods: {
    selUser() {
      this.propForm.departmentDetail = "";
      this.$ajax
        .get("/api/organize/employees", { depId: this.propForm.department })
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            this.users = res.data.data;
          }
        });
    },
    getData(ajaxParam) {
      let _that=this;
      this.$ajax
        .get("/api/achievement/selectAchievementList", ajaxParam)
        .then(res => {
          console.log(res);
          let data = res.data;
          if (res.status === 200) {
            // debugger;
             _that.selectAchList = data.data.list;
             _that.total = data.data.total;
            if(data.data.list[0]){
                 _that.countData = data.data.list[0].contractCount;
                  this.loading=false;
            }         
           
          }
      });
    },
    close(val1,val2){
      console.log(val1);
      console.log(val2);
      this.shows=false;
      this.code2='';
      if(val1&&val2){
        this.selectAchList[val1].achievementState=val2;
      }
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    //获取应收列表详情
    enterDetail(row) {
      //合同边和获取业绩详情
      this.code = row.code;
      let param = { contCode: row.code, entrance: 3 };
      this.$ajax
        .get("/api/achievement/selectAchievementByCode", param)
        .then(res => {
          let data = res.data;
          if (res.status === 200) {
            this.houseArr = data.data.houseAgents;
            this.clientArr = data.data.customerAgents;
            if(data.data.achievements){
                this.checkArr = data.data.achievements;
            }else{
              this.checkArr = [];
            }
            
            this.comm = data.data.comm;
          }
        });
      this.dialogVisible = true;
    },
    filterData() {
    console.log(this.propForm.dateMo)
    if(this.propForm.dateMo){
      this.ajaxParam = {
        dealAgentStoreId: this.propForm.department, //部门
        dealAgentId: this.propForm.departmentDetail, //员工
        contractType: this.propForm.contractType, //合同类型
        distributionType: this.propForm.divideType, //分成类型
        achievementStatus: this.propForm.achType, //业绩类型
        startTime: this.propForm.dateMo[0], //开始时间
        endTime: this.propForm.dateMo[1], //结束时间
        keyword: this.propForm.search, //关键字
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
    }else{
       this.ajaxParam = {
        dealAgentStoreId: this.propForm.department, //部门
        dealAgentId: this.propForm.departmentDetail, //员工
        contractType: this.propForm.contractType, //合同类型
        distributionType: this.propForm.divideType, //分成类型
        achievementStatus: this.propForm.achType, //业绩类型
        keyword: this.propForm.search, //关键字
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
    }

      this.getData(this.ajaxParam)
    },
    resetData() {
      this.ajaxParam = {
        dealAgentStoreId: "", //部门
        dealAgentId: "", //员工
        contractType: "", //合同类型
        distributionType: "", //分成类型
        achievementStatus: "", //业绩类型
        startTime: "", //开始时间
        endTime: "", //结束时间
        keyword: "", //关键字
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
      this.propForm={
        department: "", //部门
        departmentDetail: "", //部门详情（员工）
        contractType: "", //合同类型
        divideType: "", //分成类型
        achType: "", //业绩类型
        dateMo: "",
        search: ""
      }
    },
    checkAch(value,index) {
      this.beginData = true;
      this.code2 = value.code;//合同编号
      this.aId = value.aId;//业绩id
      this.contractId = value.id;//合同id
      this.dialogType = 0;//弹框类型
      this.achIndex=index //当前索引
      this.shows = true;
    },
    editAch(value,index) {
      this.beginData = true;
      this.code2 =  value.code; 
      this.aId =  value.aId; 
      this.contractId =  value.id; 
      this.dialogType = 1; 
      this.achIndex=index  
      this.shows = true;
    },
    againCheck(value,index) {
      this.beginData = true;
      this.code2 =  value.code;
      this.aId =  value.aId;
      this.contractId =  value.id;
      this.dialogType = 2;
      // console.log(this.dialogType);
      this.shows = true;
    },
    //分页
    handleSizeChange(val) {
      console.log(val);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.ajaxParam.pageNum = val;
      this.getData(this.ajaxParam);
    },
    skipContDel(value) {
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
    // min-height: 180px;
    background-color: #fff;
    padding: 20px;
    padding-bottom: 0px;
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
        // font-size: 18px;
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
          // font-size: 18px;
          margin-left: 28px;
        }
      }
      .data-head-right {
        // font-size: 14px;
        margin-top: 30px;
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
        // font-size: 14px;
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
        // font-size: 14px !important;
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
/deep/ tr.el-table__row{
  overflow: scroll!important;
}
.w430{
    width: 430px;
}
</style>
