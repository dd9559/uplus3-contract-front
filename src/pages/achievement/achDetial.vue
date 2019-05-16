<template>
    <div>
      <div class="ach-header">
        <h1 class="f14">业绩详情</h1>
        <p class="f14" style="font-weight:bold;">
          可分配业绩：<span class="orange">{{comm}}元</span>
          <span>（可分配业绩=客户佣金+业主佣金-第三方合作费）</span>
        </p>
      </div>
      <div class="ach-body">
        <h1 class="f14">房源方分成
          <!-- <el-button
                  type="primary"
                  @click="houseRecode"
                >房源价格变更记录</el-button> -->
        </h1>
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
            >
            </el-table-column>

            <!-- assignor -->
            <el-table-column
              prop="assignor"
              label="经纪人"
            >
            </el-table-column>

            <!-- isJob  在职状态(0:离职  1:在职 2:待入职) -->
            <el-table-column
              label="在职状况"
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
            >
            </el-table-column>
            <!-- level4 -->
            <el-table-column
              prop="level4"
              label="单组"
            >
            </el-table-column>
            <!-- level3 -->
            <el-table-column
              prop="level3"
              label="门店"
            >
            </el-table-column>

            <!-- amaldar -->
            <el-table-column
              prop="amaldar"
              label="总监"
            >
            </el-table-column>

            <!-- manager -->
            <el-table-column
              prop="manager"
              label="副总"
            > 
            </el-table-column>
            <el-table-column
              label="公共业绩">
              <template slot-scope="scope">
                 <div v-if="scope.row.place==-1">--</div>
                 <div v-if="scope.row.place==0">门店公共业绩</div>
                 <div v-if="scope.row.place==1">公司公共业绩</div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <h1 class="f14">客源方分成
          <!-- <el-button
                  type="primary"
                  @click="ammanger"
                >AM管理关系</el-button> -->
        </h1>
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
            >
            </el-table-column>

            <!-- assignor -->
            <el-table-column
              prop="assignor"
              label="经纪人"
            >
            </el-table-column>

            <!-- isJob  在职状态(0:离职  1:在职 2:待入职) -->
            <el-table-column
              label="在职状况"
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
            >
            </el-table-column>
            <!-- level4 -->
            <el-table-column
              prop="level4"
              label="单组"
            >
            </el-table-column>
            <!-- level3 -->
            <el-table-column
              prop="level3"
              label="门店"
            >
            </el-table-column>

            <!-- amaldar -->
            <el-table-column
              prop="amaldar"
              label="总监"
            >
            </el-table-column>

            <!-- manager -->
            <el-table-column
              prop="manager"
              label="副总"
            >
            </el-table-column>
            <el-table-column
              label="公共业绩">
              <template slot-scope="scope">
                 <div v-if="scope.row.place==-1">--</div>
                 <div v-if="scope.row.place==0">门店公共业绩</div>
                 <div v-if="scope.row.place==1">公司公共业绩</div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <h1 class="f14">审核信息</h1>

        <div class="ach-check-list">
          <el-table :data="checkArr"   border>
            <!-- examineDate -->
            <el-table-column
              label="时间"
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
            >
            </el-table-column>
            <!-- auditor -->
            <el-table-column
              prop="auditorDepartment"
              label="职务"
            >
            </el-table-column>


           <!-- 节点名称（新增）-->
            <!-- <el-table-column
              prop="updateByName"
              label="节点名称"
              width="130"
            >
            </el-table-column> -->

            <!-- result审核结果(0未审核 1通过 2驳回)(薪资组审核) -->
            <el-table-column
              prop="createDepName"
              label="操作"
            >
              <!-- <template slot-scope="scope">
                <div>
                  <div v-if="scope.row.contType==0">
                    <p class="blue">提交审核</p>
                  </div>
                  <div v-if="scope.row.contType==-1">
                    <p class="blue">待提审</p>
                  </div>
                  <div v-else-if="scope.row.contType==1">
                    <p class="green">审核通过</p>
                  </div>
                  <div v-else-if="scope.row.contType==2">
                    <p class="orange">已驳回</p>
                  </div>
                 <div v-else-if="scope.row.contType==3">
                    <p class="orange">撤销</p>
                  </div>
                  <div v-else>
                    <p>-</p>
                  </div>
                </div>
              </template> -->
            </el-table-column>

            <!-- remark -->
            <el-table-column label="备注">
              <template slot-scope="scope">
                   <div v-if="scope.row.remark">
                      <el-popover trigger="hover" placement="top" :content="scope.row.remark" width="130">
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
      <el-dialog :closeOnClickModal="$tool.closeOnClickModal" width="770px"  title="房源价格变更记录（近三天历史记录）" :visible.sync="recordShow">
            <el-table :data="recordData" class="recordtable">
              <el-table-column prop="TotalPriceBefore" label="总价（修改前）" ></el-table-column>
              <el-table-column prop="FinalPriceBefore" label="底价（修改前）" ></el-table-column>
              <el-table-column prop="TotalPriceAfter" label="总价（修改后）" ></el-table-column>
              <el-table-column prop="FinalPriceAfter" label="底价（修改后）" ></el-table-column>
              <el-table-column  label="成交价格误差（%）" width="140" >
                <template slot-scope="scope">
                  {{scope.row.PriceDifferential}}
                </template>
              </el-table-column>
              <el-table-column prop="ModificationTime" label="修改时间" width="135"></el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog :closeOnClickModal="$tool.closeOnClickModal" width="770px"  title="AM管理关系" :visible.sync="AMShow">
            <el-table :data="AMData" class="recordtable">
              <el-table-column prop="ManagerName" label="M经理" ></el-table-column>
              <el-table-column prop="ManagerLevel" label="M经理职人" ></el-table-column>
              <el-table-column prop="EmpName" label="经纪人" ></el-table-column>
              <el-table-column prop="EmpLevel" label="经纪人级别" ></el-table-column>
              <el-table-column prop="StartTime" label="开始时间" ></el-table-column>
              <el-table-column prop="EndTime" label="结束时间" ></el-table-column>
              <el-table-column prop="Remarks" label="备注" ></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
           
<script>
export default{
    data() {
      return {
        AMData:[],
        AMShow:false,
        recordData:[],
        recordShow:false,
        shows:true,
        houseArr: [], //房源列表
        clientArr: [], //客源列表
        examineDate: "", //审核时间
        comm: "", //可分配业绩
        remark: "",
        contCode:'',
        entrance:'',
        aId:'',
        checkArr:[],
        contractId2:''
      };
      
    },
    created() {
      this.contCode=this.$route.query.contCode
      this.entrance=this.$route.query.entrance
      this.aId=this.$route.query.aId
      this.contractId2=this.$route.query.contractId2
      //合同边和获取业绩详情
      let param = { contCode: this.contCode, entrance: this.entrance,aId:this.aId };
      this.$ajax
        .get("/api/achievement/getAchDetails", param)
        .then(res => {
          let data = res.data;
          if (res.status === 200) {
            this.houseArr = data.data.houseAgents;
            this.clientArr = data.data.customerAgents;
            if(data.data.achievements){
                this.checkArr = data.data.achievements;  //详情的审核信息

            }else{
              this.checkArr = [];
            }

            this.comm = data.data.comm;
          }
        });
    },
    methods: {
      ammanger(){
        let param={
          contId: this.contractId2,
        }
        this.$ajax.get("/api/achievement/getEmpAMById", param).then(res=>{
          if(res.status===200){
            this.AMShow=true
            this.AMData=res.data.data
          }
        })
      },
      houseRecode(){
        let param={
          contId: this.contractId2,
        }
        this.$ajax.get("/api/achievement/getHistoryPriceHouse", param).then(res=>{
          if(res.status===200){
            this.recordShow=true
            this.recordData=res.data.data
          }
        })
      },
    }
}
</script>
<style scoped lang="less">
    .ach-header {
      min-height: 70px;
      min-width: 100%;
      background-color: #fff;
      border-bottom: 1px solid #edecf0;
      overflow: hidden;
      h1 {
        font-size: 20px;
        color: #233241;
        margin: 20px 0 0 20px;
      }
      p {
        // font-size: 14px;
        color: #6c7986;
        margin: 12px 0 0 20px;
        line-height: 0;
      }
    }
    /deep/ .ach-body {
      padding: 0 20px !important;
      box-sizing: border-box;
      // overflow-y: scroll!important;
      h1{
        display: flex;
        justify-content: space-between;
      }
      /deep/ .el-table {
        // font-size: 14px !important;
        margin-top: 20px;
        // td,
        // th {
        //   padding: 24px 0;
        // }
        .el-table__header {
          // height: 55px;
          th {
            padding: 0;
            background-color: #eef2fb;
            .cell {
              // background-color: pink;
              // height: 55px;
              // line-height: 55px;
            }
          }
        }
        // .el-table__header th .cell {
        //   height: 30px;
        //   line-height: 30px;
        // }
      }
      //弹框审核信息
      h1 {
        font-size: 16px;
        color: #233241;
        margin: 13px 0 0 0px;
      }
      
    }        
</style>