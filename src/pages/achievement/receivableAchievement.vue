<template>
  <div class="layout" style="background-color: #f5f5f5" ref="tableComView">
    <ScreeningTop @propQueryFn="queryFn('search')" @propResetFormFn="resetFormFn">
      <!-- 筛选条件 -->
      <el-form :inline="true" ref="propForm" :model="propForm" class="prop-form" size="small">

        <el-form-item label="关键字" prop="search">
          <el-tooltip content="合同编号/纸质合同编号/房源编号/客源编号/物业地址" placement="top">
            <el-input
              class="w200"
              v-model="propForm.search"
              placeholder="请输入"
              :trigger-on-focus="false"
              clearable
            ></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item class="mr" style="width:400px;">
          <!-- <div style="width:400px;"> -->
          <el-select :clearable="false" size="small" placeholder="请选择" class="f_l" style="margin-right:10px;"
                     v-model="propForm.timeType" @change="changeTimeType">
            <el-option
              v-for="item in timeArr"
              :key="item.val"
              :label="item.desc"
              :value="item.val">
            </el-option>
          </el-select>
          <el-date-picker
            v-model="propForm.dateMo"
            class="w330 f_l"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <!-- </div> -->

        </el-form-item>

        <!-- 部门 -->
        <el-form-item label="部门" style="margin-right:0px;">
          <select-tree :data="DepList" :init="propForm.department" @checkCell="depHandleClick"
                       @clear="clearDep"></select-tree>
        </el-form-item>

        <el-form-item>
          <el-select 
          :clearable="true" 
          filterable 
          remote
          :remote-method="test" 
          v-loadmore="moreEmploye"
          @visible-change="empHandle"
          @change="empHandleAdd"
          @clear="clearDep"
          class="margin-left"
          size="small" 
          v-model="propForm.dealAgentId" 
          placeholder="请选择">
            <el-option
              v-for="item in EmployeList"
              :key="item.empId"
              :label="item.name"
              :value="item.empId+'/'+item.depName+'/'+item.depId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="合同类型" prop="contractType">
          <el-select v-model="propForm.contractType" class="width200"
                     :class="{'width325':propForm.contractType.length>3}" multiple :clearable="true">
            <el-option
              v-for="item in dictionary['10']"
              v-if="![4,5].includes(item.key)"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="合作方式" prop="contractType">
          <el-select v-model="propForm.joinMethods" class="w120" :clearable="true">
            <el-option
              v-for="item in dictionary['53']"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="签约方式">
          <el-select v-model="propForm.recordType" class="w120" :clearable="true">
            <el-option
              v-for="item in dictionary['64']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
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
          <h4 class="f14">
            <i class="iconfont icon-tubiao-11"></i>数据列表
          </h4>
        </div>
        <el-button class="f_r" round type="primary" size="medium" @click="queryFn('getExcel')" v-dbClick
                   style="padding:9px 15px;min-width: 80px;" v-if="power['sign-yj-rec-export'].state">导出
        </el-button>
      </div>
      <!-- 头部 end -->
      <!-- 表格 -->
      <div class="data-list" v-loading="loading">
        <el-table :data="receivableList" style="width: 100%" @row-dblclick="dialogVisible = true" ref="tableCom"
                  :max-height="tableNumberCom" border>
          <!-- code -->
          <el-table-column label="合同信息" min-width="120">
            <template slot-scope="scope">
              <p>
                合同:
                <span class="blue" @click="skipContDel(scope.row)" style="cursor:pointer;">{{scope.row.code}}</span>
              </p>
              <p v-if="scope.row.recordType.value===2">
                纸质合同编号:
                <span class="blue" @click="skipContDel(scope.row)" style="cursor:pointer;">{{scope.row.pCode}}</span>
              </p>
            </template>
          </el-table-column>

          <!-- dealStorefront   dealName -->
          <el-table-column prop="man" label="成交经纪人" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.dealName">
                <p>{{scope.row.dealStorefront}}-{{scope.row.dealName}}</p>
              </div>
              <div v-else>
                <p>暂无</p>
              </div>
            </template>
          </el-table-column>

          <!-- contType  合同类型(0:租赁 1:低佣 2:二手  3:代办)-->
          <el-table-column label="合同类型" min-width="80">
            <template slot-scope="scope">
              <p v-if="scope.row.isEntrust === 0">委托合同</p>
              <p v-else-if="scope.row.loanType&&scope.row.loanType==7">全款买卖</p>
              <p v-else-if="scope.row.loanType&&scope.row.loanType==8">贷款买卖</p>
              <p v-else>{{scope.row.contType.label}}</p>
            </template>
          </el-table-column>

          <el-table-column prop="recordType.label" label="签约方式" min-width="60"></el-table-column>
          <el-table-column label="上传合同主体时间" min-width="90">
            <template slot-scope="scope">
              <p>{{scope.row.uploadTime|formatTime(false)}}</p>
            </template>
          </el-table-column>

          <!-- propertyAddr -->
          <el-table-column prop="propertyAddr" label="物业地址" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.propertyAddr.length===0">--</span>
              <template v-else>
                <p>{{scope.row.propertyAddr.split(' ')[0]}}</p>
                <p>{{scope.row.propertyAddr.split(' ')[1]}}</p>
              </template>
            </template>
          </el-table-column>

          <!-- signDate -->
          <el-table-column prop="date" label="签约时间" min-width="90">
            <template slot-scope="scope">
              <p>{{scope.row.signDate|formatTime(false)}}</p>
            </template>
          </el-table-column>


          <el-table-column prop="actualSettlement" label="结算金额（元）" min-width="80"></el-table-column>

          <el-table-column label="结算日期" min-width="90">
            <template slot-scope="scope">
              <p>{{scope.row.settleTime|formatDate}}</p>
            </template>
          </el-table-column>

          <el-table-column label="分成人" min-width="120">
            <template slot-scope="scope">
              <p>{{scope.row.level4}}-{{scope.row.assignor}}</p>
            </template>
          </el-table-column>

          <el-table-column prop="roleName" label="角色类型" min-width="60"></el-table-column>

          <el-table-column prop="ratio" label="分成比例（%）" min-width="100"></el-table-column>

          <el-table-column prop="agentPayFee" label="刷卡手续费（元）" min-width="80"></el-table-column>

          <el-table-column prop="agentPlatformFee" label="平台费（元）" min-width="80"></el-table-column>

          <el-table-column label="企业管理费" min-width="80">
            <template slot-scope="scope">
              <p v-if="scope.row.enterpriseFee">{{scope.row.enterpriseFee|fomatFloat}}</p>
              <p v-else>0.00</p>
            </template>
          </el-table-column>

          <el-table-column label="实收金额（元）" min-width="80">
            <template slot-scope="scope">
              <p>{{scope.row.receivableComm|fomatFloat}}</p>
            </template>
          </el-table-column>

          <el-table-column label="结算留存" min-width="80">
            <template slot-scope="scope">
              <p v-if="scope.row.depositMoney">{{(scope.row.depositMoney < 0 ? 0 : scope.row.depositMoney)|fomatFloat}}</p>
              <p v-else>0.00</p>
            </template>
          </el-table-column>

          <el-table-column prop="agentReceipts" label="分账金额（元）" min-width="80">
            <template slot="header">分账金额（元）
              <el-tooltip placement="top">
                <div slot="content">
                  <span>分账金额(主合同)=合同总实收-第三方合作费-佣金支付费-权证费-平台费-企业管理费-手续费</span><br/>
                  <span>分账金额(委托合同)=委托合同总实收-手续费</span>
                </div>
                <img class="icon-prompt" src="../../assets/img/icon-commissionCounts-prompt.png" alt="说明">
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total,prev, pager, next , jumper"
          :total="total"
          v-if="total!=0"
        ></el-pagination>
      </div>

      <!-- 分页 -->
      <!-- <div class="pagination" v-if="total!=0">

      </div> -->

    </div>
  </div>
</template>

<script>
    import {MIXINS} from "@/assets/js/mixins";

    export default {
        mixins: [MIXINS],
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
                    dealAgentStoreId: null,
                    dealAgentId: null,
                    departmentDetail: "", //部门详情
                    contractType: "", //合同类型
                    dateMo: "", //时间
                    search: "",//关键字
                    timeType: 0,
                    joinMethods: "",//合作方式
                    empName: '',
                    recordType: "" //签约方式
                },
                dictionary: {
                    //数据字典
                    "10": "", //合同类型
                    "53": "",  //合作方式
                    "64": "" //签约方式
                },
                pageSize: 10,
                currentPage: 1,
                ajaxParam: {},
                total: 0,
                loading: true,
                //权限配置
                power: {
                    'sign-yj-rec-query': {
                        state: false,
                        name: '查询'
                    },
                    'sign-com-htdetail': {
                        state: false,
                        name: '合同详情'
                    },
                    'sign-yj-rec-export': {
                        state: false,
                        name: '导出'
                    }
                },
                timeArr: [
                    {
                        desc: "全部",
                        val: 0
                    },
                    {
                        desc: "结算日期",
                        val: 1
                    },
                    {
                        desc: "签约日期",
                        val: 2
                    }
                ]
            };
        },
        created() {
            //  实收列表
            this.ajaxParam = {
                pageNum: this.currentPage,
                pageSize: this.pageSize
            };
            this.$nextTick(() => {
                let res = this.getDataList
                if (res && (res.route === this.$route.path)) {
                    this.receivableList = res.data.list;
                    this.total = res.data.total;
                    let session = JSON.parse(sessionStorage.getItem('sessionQuery')).query
                    this.propForm.dateMo = session.startTime ? [session.startTime, session.endTime] : []
                    this.propForm.search = session.keyword
                    this.propForm.dealAgentStoreId = session.dealAgentStoreId
                    this.propForm.dealAgentId = session.dealAgentId
                    this.propForm.empName = session.empName
                    this.propForm.department = session.department
                    this.propForm.pageNum = session.pageNum
                    this.propForm.pageSize = session.pageSize

                    this.propForm.contractType = session.contractType.split(',')
                    if (this.propForm.contractType[0] != '') {
                        for (let i = 0; i < this.propForm.contractType.length; i++) {
                            this.propForm.contractType[i] = Number(this.propForm.contractType[i])
                        }
                    } else {
                        this.propForm.contractType = []
                    }
                    if (this.propForm.dealAgentId) {
                        this.dep = Object.assign({}, this.dep, {
                            id: this.propForm.dealAgentStoreId,
                            empId: this.propForm.dealAgentId,
                            empName: this.propForm.empName
                        })
                        this.EmployeList.unshift({
                            empId: this.propForm.dealAgentId,
                            name: this.propForm.empName
                        })
                        this.getEmploye(this.propForm.dealAgentStoreId)
                    }

                    this.currentPage = session.pageNum
                    this.pageSize = session.pageSize
                    this.propForm.timeType = session.timeType
                    this.propForm.joinMethods = session.joinMethods
                    this.propForm.recordType = session.recordType
                    // this.propForm = Object.assign({},this.ajaxParam,session.query)
                    this.$nextTick(() => {
                        this.loading = false;
                    })
                } else {
                    this.getData(this.ajaxParam,'init');
                }
            })
            // 字典初始化
            this.getDictionary();
            //部门初始化
            this.remoteMethod();
        },
        components: {},
        filters: {
          //运算时四舍五入保留两位小数 num为传入的值，n为保留的小数位
          fomatFloat: function (num, decimal = 2) {
            num = num ? num : 0
            let multiples = Number('1'.padEnd(decimal+1,0)),
                multiplesNum = Math.round(parseFloat(num) * multiples) / multiples,
                strNum = multiplesNum.toString(),
                index = strNum.indexOf("."),
                decimalPoint,
                integer;

            if (index !== -1) {
              integer = strNum.substring(0,index)
              decimalPoint = strNum.substring(index+1).padEnd(decimal,0);
            } else {
              integer = strNum.substring(0);
              decimalPoint = '0'.padEnd(decimal,0)
            }
            return `${integer}.${decimalPoint}`;

            // decimal = Number('1'.padEnd(decimal+1,0))
            // num = Math.round(parseFloat(num) * decimal) / decimal
            // num = num.toString();
            // let i = 0;
            // let index = num.indexOf(".");
            // let decimal2,
            //     num2;
            // if (index !== -1) {
            //   decimal2 = num.substring(index+1).padEnd(2,0);
            //   num2 = num.substring(0,index)
            // } else {
            //   num2 = num.substring(0);
            //   decimal2 = '0'.padEnd(2,0)
            // }
            // return `${num2}.${decimal2}`;
          }
        },
        methods: {
            // 导出功能
            getExcel() {
                // this.queryFn();
                // this.ajaxParam.is_Receivable=2;
                let param = Object.assign({}, this.ajaxParam)
                this.excelCreate('/input/exportSettleExcel', param)
            },
            getData(ajaxParam, typeshow, param) {
                if (typeshow != 1 && param == 2) {
                    this.currentPage = 1
                }
                this.loading = true;
                // 实收列表
                let _that = this;
                if (ajaxParam.dealAgentId) {
                  ajaxParam.dealAgentId = ajaxParam.dealAgentId.split("/")[0];
                }
                this.$ajax.get("/api/achievement/selectReceiptsList", ajaxParam).then(res => {
                    let data = res.data;
                    if (res.status === 200) {
                        console.log(data.data.list);
                        _that.receivableList = data.data.list;
                        // if (data.data.list[0]) {
                        //   _that.countData = data.data.list[0].contractCount;
                        // } else {
                        //   _that.countData = [0, 0, 0, 0];
                        // }
                        _that.total = data.data.total;
                        if (['init','search','getExcel'].includes(typeshow)) {
                          this.ajaxParams = JSON.parse(JSON.stringify(ajaxParam))
                        }
                        if (typeshow === 'getExcel') {
                          if (!this.total) {
                            this.$message.warning('当前筛选条件结果无数据！')
                          } else {
                            this.excelCreate('/input/exportSettleExcel', ajaxParam)
                          }
                        }
                        this.$nextTick(() => {
                            this.loading = false;
                        })

                    }
                }).catch(error => {
                    this.$message({message: error})
                    this.$nextTick(() => {
                        this.loading = false;
                    })
                });
                ;
            },
            test: function(val) {
              this.getEmployeByText(val);
            },
            empHandle: function(val) {
              console.log(this.propForm.dealAgentId);
              if (
                val &&
                this.EmployeInit !== this.employeTotal &&
                this.propForm.dealAgentId
              ) {
                this.getEmployeByText();
              }
            },
            empHandleAdd(val) {
              console.log(val,'val');
              let depVal = val.split("/");
              this.propForm.dealAgentStoreId = depVal[2];
              this.propForm.department = depVal[1];
              this.EmployeList = [];
              this.getEmploye(this.propForm.dealAgentStoreId);
            },
            clearDep: function () {
                this.propForm.department = '';
                this.EmployeList = [];
                this.propForm.dealAgentId = '';
                this.propForm.dealAgentStoreId = '';
                this.clearSelect()
            },
            depHandleClick(data) {
                this.propForm.dealAgentStoreId = data.depId
                this.propForm.department = data.name
                this.propForm.dealAgentId = ''
                this.handleNodeClick(data)
            },
            queryFn(typeshow) {
                if (this.propForm.dateMo) {
                    this.ajaxParam = {
                        dealAgentStoreId: this.propForm.dealAgentStoreId, //部门
                        dealAgentId: this.propForm.dealAgentId, //员工
                        contractType: this.propForm.contractType.length === 0 ? '' : this.propForm.contractType.join(','), //合同类型
                        startTime: this.propForm.dateMo[0], //开始时间
                        endTime: this.propForm.dateMo[1], //结束时间
                        keyword: this.propForm.search, //关键字
                        pageNum: this.currentPage,
                        department: this.propForm.department,
                        pageSize: this.pageSize,
                        timeType: this.propForm.timeType,
                        joinMethods: this.propForm.joinMethods,//合作方式
                        recordType: this.propForm.recordType
                    };
                } else {
                    this.ajaxParam = {
                        dealAgentStoreId: this.propForm.dealAgentStoreId, //部门
                        dealAgentId: this.propForm.dealAgentId, //员工
                        contractType: this.propForm.contractType.length === 0 ? '' : this.propForm.contractType.join(','), //合同类型
                        keyword: this.propForm.search, //关键字
                        pageNum: this.currentPage,
                        department: this.propForm.department,
                        pageSize: this.pageSize,
                        joinMethods: this.propForm.joinMethods,//合作方式
                        recordType: this.propForm.recordType
                    };
                }
                // this.ajaxParam.pageNum = 1;
                // this.currentPage = 1;
                let param = JSON.parse(JSON.stringify(this.ajaxParam))
                sessionStorage.setItem('sessionQuery', JSON.stringify({
                    path: '/receivableAchievement',
                    url: '/achievement/selectReceiptsList',
                    query: Object.assign({}, param, {empName: this.dep.empName}),
                    methods: 'get'
                }))
                this.getData(this.ajaxParam, typeshow, 2);
            },
            resetFormFn() {
                this.ajaxParam = {
                    dealAgentStoreId: "", //部门
                    dealAgentId: "", //员工
                    contractType: "", //合同类型
                    startTime: "", //开始时间
                    endTime: "", //结束时间
                    keyword: "",//关键字
                    timeType: 0,
                    joinMethods: "",//合作方式
                    recordType: ""
                };
                this.ajaxParam.pageNum = 1;
                this.currentPage = 1;
                this.propForm = {
                    department: "", //部门
                    dealAgentStoreId: null,
                    dealAgentId: null,
                    departmentDetail: "", //部门详情（员工）
                    contractType: [], //合同类型
                    dateMo: "",
                    search: "",
                    timeType: 0,
                    joinMethods: "",
                    recordType: ""
                };
                this.EmployeList = []
            },
            handleCurrentChange(val) {
                this.ajaxParam.pageNum = val;
                this.currentPage = val;
                this.queryFn(1);
            },
            // 跳转合同详情
            skipContDel(value) {
              this.$ajax.get("/api/contract/isDetailAuth",{contId:value.id}).then(res=>{
                res=res.data
                if(res.status===200){
                  if(res.data){
                    this.$router.push({
                      path:'/contractDetails',
                      query: {
                        id: value.id,
                        code: value.code,
                        contType: value.contType.value
                      }
                    })
                  }else{
                    this.$message({
                      message:"没有合同详情查看权限",
                      type:"warning"
                    })
                  }
                }
              }).catch(error=>{
                this.$message({
                  message: error,
                  type: "error"
                });
            })
            },
            changeTimeType() {
                this.propForm.dateMo = "";
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
      padding: 10px;
      padding-top: 0;
      margin-top: 20px;
      padding-bottom: 0;

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
          th {
            padding: 6px 0;
            background-color: #eef2fb;
          }
        }
      }
    }
  }

  // /deep/ .pagination{
  //   padding-top: 0;
  .el-pagination {
    text-align: right;
    // padding-bottom: 50px;
    // padding-top: 50px;
  }

  .width200 {
    width: 200px !important;
  }

  .width325 {
    width: 325px !important;
  }

  // }
  .w430 {
    width: 430px;
  }
  .icon-prompt {
  width: 14px;
  height: 14px;
  display: inline-block;
  position: relative;
  top: -1px;
  vertical-align: middle;
  margin-left: 4px;
}
</style>
