<template>
  <div
    class="layout"
    style="background-color: #f5f5f5"
    ref="tableComView"
  >
    <ScreeningTop
      @propQueryFn="queryFn"
      @propResetFormFn="resetFormFn"
    >
      <el-form
        :inline="true"
        :model="propForm"
        class="prop-form"
        size="small"
      >

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
        
        <!-- 部门 -->
        <el-form-item label="部门" style="margin-right:0px;">
              <!-- <el-select :clearable="true" ref="tree" size="small" :loading="Loading" :remote-method="remoteMethod" @visible-change="initDepList" @clear="clearDep"   v-model="propForm.department" placeholder="请选择">
                <el-option class="drop-tree" value="">
                  <el-tree :data="DepList" :props="defaultProps" @node-click="depHandleClick"></el-tree>
                </el-option>
              </el-select> -->
             <select-tree :data="DepList" :init="propForm.department" @checkCell="depHandleClick" @clear="clearDep"></select-tree>
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
              v-for="item in achStatuArr"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ScreeningTop>

    <!-- 筛选条件 end -->
    <!-- 数据列表 -->
    <div class="data-layout">
      <!-- 头部 -->
      <div class="table-tool">
        <div class="tool-left">
          <h4 class="f14"><i class="iconfont icon-tubiao-11"></i>数据列表</h4>
          <ul>
            <li>
              <span>总分成：<b class="orange">{{countData[3] ?countData[3] :'0'}}元</b>，</span>
            </li>
            <li>
              <span>分类分成：</span>
            </li>
            <li>
              <span>出售：<b class="orange">{{countData[1] ?countData[1] :'0'}}元</b>，</span>
            </li>
            <li>
              <span>代办：<b class="orange">{{countData[2] ?countData[2] :'0'}}元</b>，</span>
            </li>
            <li>
              <span>出租：<b class="orange">{{countData[0] ?countData[0] :'0'}}元</b></span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 头部 end -->

      <!-- 表格 -->
      <div
        class="data-list"
        v-loading="loading"
      >
        <el-table
          :data="selectAchList"
          style="width: 100%"
          @row-dblclick="enterDetail"
          ref="tableCom" 
          :max-height="tableNumberCom" 
          border
        >
          <el-table-column
            label="合同信息"
            width="220px"
          >
            <template slot-scope="scope">
              <p>合同：<span
                  class="blue"
                  @click="skipContDel(scope.row)"
                  style="cursor:pointer;"
                >{{scope.row.code}}</span></p>
              <p>房源：<span class="blue">{{scope.row.houseinfoCode}}</span> {{scope.row.ownerName}}</p>
              <p>客源：<span class="blue">{{scope.row.guestinfoCode}}</span> {{scope.row.customerName}}</p>
            </template>
          </el-table-column>

          <el-table-column
            label="业绩状态"
            width="90"
          >
            <template slot-scope="scope">
              <p
                v-if="scope.row.achievementState==-1"
                class="blue"
              >待提审</p>
              <p
                v-if="scope.row.achievementState==0"
                class="blue"
              >审核中</p>
              <p
                v-if="scope.row.achievementState==1"
                class="green"
              >已通过</p>
              <p
                v-if="scope.row.achievementState==2"
                class="orange"
              >已驳回</p>
            </template>
          </el-table-column>

          <el-table-column
            label="合同类型"
            width="90"
          >
            <template slot-scope="scope">
              <p>{{scope.row.contType.label}}</p>
            </template>
          </el-table-column>

          <el-table-column
            prop="propertyAddr"
            label="物业地址"
            width="240"
          >
          </el-table-column>

          <el-table-column
            label="成交经纪人"
            width="180"
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
            width="100"
          >
            <template slot-scope="scope">
              <!-- 目前一期分成类型只有业绩，暂时写死 -->
              <p>业绩</p>
            </template>
          </el-table-column>

          <el-table-column
            label="分成人"
            width="230"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.distributions.length==0">
                <div>--</div>
              </div>
              <div v-else>
                <div v-for="item in scope.row.distributions">
                  <p>{{item.level4}}-{{item.assignor}}</p>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="角色类型"
            width="100"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.distributions.length==0">
                <div>--</div>
              </div>
              <div v-else>
                <div v-for="item in scope.row.distributions">
                  <div>
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
              </div>

            </template>
          </el-table-column>

          <el-table-column
            label="分成比例"
            width="80"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.distributions.length==0">
                <div>--</div>
              </div>
              <div v-else>
                <div v-for="item in scope.row.distributions">
                  <p>{{item.ratio}}%</p>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="应收分成金额（元）"
            width="150"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.distributions.length==0">
                <div>--</div>
              </div>
              <div v-else>
                <p v-for="item in scope.row.distributions">
                  {{item.ratio/100*scope.row.receiptsCommission | rounding}}
                </p>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="当前审核人"
            width="150"
          >
            <template slot-scope="scope">
                <p>{{scope.row.auditDepName?scope.row.auditDepName:'-'}}-{{scope.row.auditName?scope.row.auditName:'-'}}</p>
                <p  style="cursor:pointer;color:#478DE3" @click="choseCheckPerson(scope.row,1)"  v-if="userMsg&&userMsg.empId==scope.row.auditId">转交审核人</p>
            </template>
          </el-table-column>

         <el-table-column
            label="下一步审核人"
            width="150"
          >
            <template slot-scope="scope">
                <p>{{scope.row.nextAuditDepName?scope.row.nextAuditDepName:'-'}}-{{scope.row.nextAuditName?scope.row.nextAuditName:'-'}}</p>
                <p  style="cursor:pointer;color:red"  @click="choseCheckPerson(scope.row,2)"  v-if="userMsg&&scope.row.auditId===userMsg.empId||scope.row.preAuditId===userMsg.empId">设置审核人</p>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            min-width="100"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.isModify==0">
                <div
                  v-if="scope.row.achievementState==-1"
                  class="check-btn"
                >
                  <span
                    @click.stop="editAch(scope.row,scope.$index)"
                    style="cursor:pointer;"
                    v-if="power['sign-yj-rev-edit'].state"
                  >编辑</span>
                  <span
                    style="cursor:pointer;"
                    v-else
                  >-</span>
                </div>

                <div
                  v-if="scope.row.achievementState==1"
                  class="check-btn"
                >
                  <span
                    @click.stop="againCheck(scope.row,scope.$index)"
                    style="cursor:pointer;"   
                    v-if="power['sign-yj-rev-fs'].state"
                  >反审核</span>
                 <span
                    style="cursor:pointer;"
                    v-else
                  >-</span>
                </div>

                <div
                  v-if="scope.row.achievementState==2"
                  class="check-btn"
                >
                  <span
                    @click.stop="editAch(scope.row,scope.$index)"
                    style="cursor:pointer;"
                    v-if="power['sign-yj-rev-edit'].state"
                  >编辑</span>
                  <span
                    style="cursor:pointer;"
                    v-else
                  >-</span>
                </div>

                <div
                  v-if="scope.row.achievementState==0"
                  class="check-btn"
                >
                  <span
                    @click.stop="chehui(scope.row,scope.$index)"
                    style="cursor:pointer;"
                    v-if="power['sign-yj-rev-retreat'].state"
                  >撤回</span>
                  <span
                    @click.stop="checkAch(scope.row,scope.$index)"
                    style="cursor:pointer;"
                    v-if="userMsg&&userMsg.empId==scope.row.auditId"
                  >审核</span> 
                  <span v-if="power['sign-yj-rev-retreat'].state==false&&(userMsg&&userMsg.empId!=scope.row.auditId)"></span>           
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
      <div class="pagination" v-if="total!=0">
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
    

    </div>

    <!-- 表单列表弹出框（业绩详情） -->
   <div>
      <el-dialog
      :visible.sync="dialogVisible"
       width="1000px"
      :close-on-click-modal="false"
      custom-class="base-dialog"
    >
    <div v-loading="loading2">
      <b
        class="el-icon-close"
        @click="closeDialog"
      ></b>
      <div class="ach-header">
        <h1 class="f14">业绩详情</h1>
        <p class="f14" style="font-weight:bold;">
          可分配业绩：<span class="orange">{{comm}}元</span>
          <span>（可分配业绩=客户佣金+业主佣金-佣金支付费-第三方合作费）</span>
        </p>
      </div>
      <div class="ach-body">
        <h1 class="f14">房源方分成</h1>
        <div class="ach-divide-list">
          <el-table
            :data="houseArr"
            style="width: 100%"
            border
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
              label="分成比例(%)"
              width="100"
            >
            </el-table-column>

            <!-- assignor -->
            <el-table-column
              prop="assignor"
              label="经纪人"
              width="100"
            >
            </el-table-column>

            <!-- isJob  在职状态(0:离职  1:在职 2:待入职) -->
            <el-table-column
              label="在职状况"
              width="75"
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
              width="100"
            >
            </el-table-column>
            <!-- level4 -->
            <el-table-column
              prop="level4"
              label="单组"
              width="135"
            >
            </el-table-column>
            <!-- level3 -->
            <el-table-column
              prop="level3"
              label="门店"
              width="135"
            >
            </el-table-column>

            <!-- amaldar -->
            <el-table-column
              prop="amaldar"
              label="区经"
              width="100"
            >
            </el-table-column>

            <!-- manager -->
            <el-table-column
              prop="manager"
              label="区总"
            >
            </el-table-column>
          </el-table>
        </div>

        <h1 class="f14">客源方分成</h1>
        <div class="ach-divide-list">
          <el-table
            :data="clientArr"
            style="width: 100%"
            border
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
              label="分成比例(%)"
              width="100"
            >
            </el-table-column>

            <!-- assignor -->
            <el-table-column
              prop="assignor"
              label="经纪人"
              width="100"
            >
            </el-table-column>

            <!-- isJob  在职状态(0:离职  1:在职 2:待入职) -->
            <el-table-column
              label="在职状况"
              width="75"
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
              width="100"
            >
            </el-table-column>
            <!-- level4 -->
            <el-table-column
              prop="level4"
              label="单组"
              width="135"
            >
            </el-table-column>
            <!-- level3 -->
            <el-table-column
              prop="level3"
              label="门店"
              width="135"
            >
            </el-table-column>

            <!-- amaldar -->
            <el-table-column
              prop="amaldar"
              label="区经"
              width="100"
            >
            </el-table-column>

            <!-- manager -->
            <el-table-column
              prop="manager"
              label="区总"
            >
            </el-table-column>
          </el-table>
        </div>

        <h1 class="f14">审核信息</h1>

        <div class="ach-check-list">
          <el-table :data="checkArr"   border>
            <!-- examineDate -->
            <el-table-column
              label="时间"
              width="150"
            >          
              <template slot-scope="scope">
                <p v-if="scope.row.examineDate">{{scope.row.examineDate|formatTime}}</p>
                <p v-else>-</p>
              </template>
            </el-table-column>
            <!-- auditorDepartment -->
            <el-table-column
              prop="auditor"
              label="姓名"
              width="200"
            >
            </el-table-column>
            <!-- auditor -->
            <el-table-column
              prop="auditorDepartment"
              label="职务"
              width="120"
            >
            </el-table-column>


           <!-- 节点名称（新增）-->
            <el-table-column
              prop="updateByName"
              label="节点名称"
              width="130"
            >
            </el-table-column>

            <!-- result审核结果(0未审核 1通过 2驳回)(薪资组审核) -->
            <el-table-column
              prop="done"
              label="操作"
              width="150"
            >
              <template slot-scope="scope">
                <div>
                  <div v-if="scope.row.contType==0">
                    <p class="blue">审核中</p>
                  </div>
                  <div v-if="scope.row.contType==-1">
                    <p class="blue">待提审</p>
                  </div>
                  <div v-else-if="scope.row.contType==1">
                    <p class="green">已通过</p>
                  </div>
                  <div v-else-if="scope.row.contType==2">
                    <p class="orange">已驳回</p>
                  </div>
                  <div v-else>
                    <p>-</p>
                  </div>
                </div>
              </template>
            </el-table-column>

            <!-- remark -->
            <el-table-column label="备注">
              <template slot-scope="scope">
                   <div v-if="scope.row.remark">
                      <el-popover trigger="hover" placement="top" :content="scope.row.remark" width="150">
                          <div style="width:160px" slot="reference" class="name-wrapper">{{scope.row.remark}}</div>
                      </el-popover>
                   </div>
                   <div v-else>
                       --
                   </div>           
              </template>
            </el-table-column>   
          </el-table>
        </div>
      </div>
      <div class="ach-footer"></div>
    </div>
 
    </el-dialog>
   </div>

    <!-- 审核，编辑，反审核，业绩分成弹框 -->
    <achDialog
      :shows="shows"
      @saveData="saveData"
      @adoptData="adoptData"
      @rejectData="rejectData"
      @close="shows=false;code2=''"
      @opens="shows=true"
      :dialogType="dialogType"
      :contractCode="code2"
      :aId="aId"
      :achIndex="achIndex"
      :achObj="achObj"
    ></achDialog>

    <!-- 撤回提审弹框 -->
    <div class="sure-layout">
      <el-dialog
        :title="'操作-'+smallTips"
        :visible.sync="recallShow"
        :close-on-click-modal="false"
        custom-class="sure-dialog"
      >
        <span class="tips">是否确认{{smallTips}}?</span>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="recallShow = false">取 消</el-button>
          <el-button
            type="primary"
            @click="changeStatus"
            v-dbClick
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>

     <!-- 选择审核人弹框 -->
    <checkPerson :show="checkPerson.state" :type="checkPerson.type" :bizCode="checkPerson.code" :flowType="checkPerson.flowType" @close="checkPerson.state=false" v-if="checkPerson.state"></checkPerson>
  </div>

</template>

<script>
// 引入审核，编辑，反审核，分成弹框
import achDialog from "./achDialog";
import { MIXINS } from "@/assets/js/mixins";
import ScreeningTop from '@/components/ScreeningTop';
import checkPerson from '@/components/checkPerson'
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
      // 筛选条件
      propForm: {
        department: "", //部门
        dealAgentStoreId:null,
        dealAgentId:null,
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
      },
      beginData: false,
      currentPage: 1,
      pageSize:10,
      comm: "", //业绩分成
      aId: null, //业绩id
      contractId: null, //合同id
      achIndex:null,
      ajaxParam:{},
      total:0,
      loading:false,
      loading2:false,
      achObj:{},
      recallShow:false,
      smallTips:"",
      statuIndex:null,
      statuContId:null,
      statuType:null,
      statuAid:null,
      achStatuArr:[
        {
          key:-1,
          value:"待提审"
        },
        {
          key:0,
          value:"审核中"
        },
        {
          key:1,
          value:"已通过"
        },
        {
          key:2,
          value:"已驳回"
        }
      ],
        //权限配置
      power: {
        'sign-yj-rev-query': {
          state: false,
          name: '查询'
        },
        'sign-yj-rev-edit': {
          state: false,
          name: '编辑'
        },
       'sign-yj-rev-addemp': {
          state: false,
          name: '录入分成'
        },
       'sign-yj-rev-retreat': {
          state: false,
          name: '撤回'
        },
      'sign-yj-rev-fs': {
          state: false,
          name: '反审核'
        } ,
      'sign-com-htdetail': {
            state: false,
            name: '合同详情'
       }
      },
      checkPerson: {
          state:false,
          type:'init',
          code:'',
          flowType:0
      },
    };
  },
  created() {
    this.ajaxParam={
        pageNum: this.currentPage,
        pageSize: this.pageSize
    } 
    this.getAdmin();//获取当前登录人信息
    this.getData(this.ajaxParam);
    // 字典初始化
    this.getDictionary();
     //部门初始化
    this.remoteMethod();
  },
  components: {
    achDialog,
    MIXINS,
    ScreeningTop,
    checkPerson
  },
  filters: {
        rounding (value) {
        return value.toFixed(2)
        }
  },
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
      this.propForm.dealAgentStoreId='';
      this.clearSelect()
    },
    depHandleClick(data) {           
      this.propForm.dealAgentStoreId=data.depId
      this.propForm.department=data.name
      this.propForm.dealAgentId=''
      this.handleNodeClick(data)
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
              }else {
              _that.countData = [0, 0, 0, 0];
            }       

            }            
        }).catch(error => {
            this.$message({message:error})
     }); 
      this.loading=false;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    // 保存操作
    saveData(index,resultArr,status){
        this.shows=false;
        this.selectAchList[index].distributions=resultArr;
        if(status||status==0){
          this.selectAchList[index].achievementState=status;
        }   
    },
    // 通过操作
    adoptData(index,resultArr,result){
        this.shows=false;
        this.selectAchList[index].distributions=resultArr;
        this.selectAchList[index].achievementState=result;
    },
    // 驳回操作
    rejectData(index,resultArr){
        this.shows=false;
        this.selectAchList[index].distributions=resultArr;
        this.selectAchList[index].achievementState=2;
    },
    tishen(value,index){
         this.smallTips="提审";
         this.statuIndex=index;
         this.statuContId=value.id;
         this.statuType=0;
         this.statuAid=value.aId;
         this.recallShow=true;
    },
    chehui(value,index){
       this.smallTips="撤回";
       this.statuIndex=index;
       this.statuContId=value.id;
       this.statuType=1;
       this.statuAid=value.aId;
       this.recallShow=true;
    },
    changeStatus(){
      // 提审
       if(this.statuType==0){
         let param={
           contId:this.statuContId,
           aId:this.statuAid,
           status:0
         }
         this.$ajax
          .postJSON("/api/achievement/applyStatusArraign", param)
          .then(res => {
            if (res.data.status == 200) {
               this.$message({ message: "操作成功", type: "success" });
               this.recallShow=false;
               this.selectAchList[this.statuIndex].achievementState=0;
            }
          }).catch(error => {
               this.$message.error({message: error})
          })
       }
      // 撤回
       if(this.statuType==1){
          let param={
           contId:this.statuContId,
           aId:this.statuAid,
           status:-1
         }    
        this.$ajax         
          .postJSON("/api/achievement/withdrawStatusArraign", param)
           .then(res => {
          if (res.data.status == 200) {
               this.$message({ message: "操作成功", type: "success" });
               this.recallShow=false;
               this.selectAchList[this.statuIndex].achievementState=-1;
            }
            }).catch(error => {
                  this.$message.error({message: error})
            })
       }
    },
    //获取应收列表详情
    enterDetail(row) {
      this.dialogVisible = true;  
      this.loading2=true;
      //合同边和获取业绩详情
      this.code = row.code;
      let param = { contCode: row.code, entrance: 3,aId:row.aId };
      this.$ajax
        .get("/api/achievement/getAchDetails", param)
        .then(res => {
          let data = res.data;
          if (res.status === 200) {
            this.houseArr = data.data.houseAgents;
            this.clientArr = data.data.customerAgents;
            if(data.data.achievements){
                this.checkArr = data.data.achievements;
                this.loading2=false;            
            }else{
              this.checkArr = [];
            }
            
            this.comm = data.data.comm;
          }
        });     
    },
    queryFn() {
    console.log(this.propForm.dateMo)
    if(this.propForm.dateMo){
      this.ajaxParam = {
        dealAgentStoreId: this.propForm.dealAgentStoreId, //部门
        dealAgentId: this.propForm.dealAgentId, //员工
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
        dealAgentStoreId: this.propForm.dealAgentStoreId, //部门
        dealAgentId: this.propForm.dealAgentId, //员工
        contractType: this.propForm.contractType, //合同类型
        distributionType: this.propForm.divideType, //分成类型
        achievementStatus: this.propForm.achType, //业绩类型
        keyword: this.propForm.search, //关键字
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
    }
    this.ajaxParam.pageNum=1;
    this.currentPage=1;
    this.getData(this.ajaxParam)
    },
    resetFormFn() {
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
      this.ajaxParam.pageNum=1;
      this.currentPage=1;
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
      this.dialogType = 0;//弹框类型
      this.achIndex=index //当前索引
      this.achObj={
        contractId:value.id,//合同id
      }
      this.shows = true;
    },
    editAch(value,index) {
        this.beginData = true;
        this.code2 =  value.code; 
        this.aId =  value.aId; 
        this.contractId =  value.id; 
        this.dialogType = 1; 
        this.achIndex=index  
        this.achObj={
          contractId:value.id,//合同id
        }
        this.shows = true;
    },
    againCheck(value,index) {
      this.beginData = true;
      this.code2 =  value.code;
      this.aId =  value.aId;
      this.contractId =  value.id;
      this.dialogType = 2;
      this.achIndex=index 
      this.achObj={
        contractId:value.id,//合同id
      }
      this.shows = true;
    },
    //分页
    handleSizeChange(val) {
      console.log(val);
      console.log(222222222);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.ajaxParam.pageNum = val;
      this.currentPage=val;
      this.getData(this.ajaxParam);
    },
    skipContDel(value) {
     if(this.power['sign-com-htdetail'].state){
       this.setPath(this.$tool.getRouter(['应收','应收列表','合同详情'],'contractList'))
        this.$router.push({
          path: "/contractDetails",
          query: {
            id: value.id,
            code: value.code,
            contType: value.contType.value
          }
        });
     }else{
       this.noPower('合同详情查看')
     }
    },
    choseCheckPerson(val,type1){
      if(type1==1){
        this.checkPerson.flowType=2;
        this.checkPerson.code=val.code;
        console.log(  this.checkPerson.code);
        this.checkPerson.state=true;
        this.checkPerson.type='init';
      }else if(type1==2){
        this.checkPerson.flowType=2;
        this.checkPerson.code=val.code;
        console.log(  this.checkPerson.code);
        this.checkPerson.state=true;
        this.checkPerson.type='set';
      }       
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/less/lsx.less";
@import "~@/assets/common.less";
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

  //业绩详情弹框改变样式
  /deep/ .el-dialog.base-dialog {
    // max-width: 1000px;
    margin: 13vh auto 0 !important;
    overflow: auto;
    padding-bottom: 30px;
    .el-dialog__headerbtn {
      right: 0;
      top: 0;
      display: none !important;
    }
    b {
      position: absolute;
      right: 30px;
      top: 30px;
      font-size: 30px;
    }
    .ach-header {
      min-height: 70px;
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
    /deep/ .ach-body {
      max-height: 500px;
      // background-color: pink;
      padding: 0 20px !important;
      box-sizing: border-box;
      overflow-y: auto;
      /deep/ .el-table {
        // font-size: 14px !important;
        margin-top: 20px;
        // td,
        // th {
        //   padding: 24px 0;
        // }
        .el-table__header {
          height: 55px;
          th {
            padding: 0;
            .cell {
              background-color: #eef2fb;
              // background-color: pink;
              // height: 55px;
              // line-height: 55px;
            }
          }
        }
        .el-table__header th .cell {
          height: 30px;
          line-height: 30px;
        }
      }
      //弹框审核信息
      h1 {
        font-size: 16px;
        color: #233241;
        margin: 13px 0 0 0px;
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
}
/deep/ .el-pagination {
  text-align: center;
  // padding-bottom: 50px;
  // padding-top: 50px;
}
/deep/ tr.el-table__row {
  overflow: scroll !important;
}
.w430 {
  width: 430px;
}
.sure-layout {
  /deep/ .sure-dialog {
    width: 450px;
    height: 200px;
    overflow: hidden;
    // .el-table__header {
    //   padding-bottom: 60px;
    // }
    .tips {
      margin-left: 10px;
      font-size: 18px;
      padding-top: 20px;
      display: block;
      padding-bottom: 30px;
    }
  }
  .el-dialog__body {
    padding: 0 !important;
  }
}

.el-dialog.base-dialog .ach-body {
  padding: 0 20px;
}
/deep/ .el-dialog.base-dialog .el-dialog__header {
  padding: 0 !important;
}

.name-wrapper {
      display: flex;
      display: -webkit-box;
      /*!autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      -webkit-line-clamp: 1;
      overflow: hidden;
      text-overflow:ellipsis;
}
</style>
