<!-- 打款记录 -->
<template>
  <div class="view-container" id="adjustcheck" ref="tableComView">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn" class="adjustbox">
      <el-form :inline="true" :model="adjustForm" class="adjust-form" size="mini" ref="adjustCheckForm">
        <el-form-item label="关键字">
          <el-tooltip effect="dark" content="打款人/账户/备注/金额" placement="top">
            <el-input v-model="adjustForm.keyWord" style="width:150px" clearable placeholder="请输入"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="打款日期">
          <el-date-picker v-model="adjustForm.signDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="分账门店">
          <el-select v-model="adjustForm.outStoreAttr" placeholder="全部" class="width150" clearable @change="changeStoreAttr_out">
            <el-option v-for="item in dictionary['53']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
                
        <el-form-item label="部门"> 
          <!-- <select-tree :data="DepList" :init="adjustForm.depName1" @checkCell="depHandleClick1" @clear="clearDep(1)" @search="searchDep1" class="fl"></select-tree> -->
          <el-select
            v-model="adjustForm.outStoreId"
            :multiple="false"
            filterable
            remote
            placeholder="全部"
            :remote-method="remoteMethod_out"
            v-loadmore.out="moreDeps"
            :clearable="true"
            @clear="clearOutList('out')"
            :loading="loading">
            <el-option
              v-for="item in outStoreList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="收账门店">
          <el-select v-model="adjustForm.inStoreAttr" placeholder="全部" class="width150" clearable @change="changeStoreAttr_in">
            <el-option v-for="item in dictionary['53']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
                
        <el-form-item label="部门"> 
          <!-- <select-tree :data="DepList" :init="adjustForm.depName2" @checkCell="depHandleClick2" @clear="clearDep(2)" @search="searchDep2" class="fl"></select-tree> -->
          <el-select
            v-model="adjustForm.inStoreId"
            :multiple="false"
            filterable
            remote
            placeholder="全部"
            :remote-method="remoteMethod_in"
            v-loadmore.in="moreDeps"
            :clearable="true"
            @clear="clearOutList('in')"
            :loading="loading">
            <el-option
              v-for="item in inStoreList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>      
        
      </el-form>
    </ScreeningTop>

    <!-- 数据列表 -->
    <div class="contract-list">     
      <el-table :data="tableData.list" ref="tableCom" :max-height="tableNumberCom" style="width: 100%" v-loading="loadingTable" @row-dblclick='toDetail' border>

        <el-table-column label="分账门店" :formatter="nullFormatter">
          <template slot-scope="scope">
            <p>{{scope.row.outStoreName}}</p>
          </template>
        </el-table-column>

        <el-table-column label="分账门店账户" :formatter="nullFormatter">
          <template slot-scope="scope">
            <p>{{scope.row.outBankCard}}</p>
          </template>
        </el-table-column>

         <el-table-column label="收款门店" :formatter="nullFormatter">
          <template slot-scope="scope">
            <p>{{scope.row.inStoreName}}</p>
          </template>
        </el-table-column>

        <el-table-column label="收款门店账户" :formatter="nullFormatter">
          <template slot-scope="scope">
            <p>{{scope.row.inBankCard}}</p>
          </template>
        </el-table-column>

         <el-table-column label="分账金额（元）" :formatter="nullFormatter">
          <template slot-scope="scope">
            <p>{{scope.row.accountAmount}} 元</p> 
          </template>
        </el-table-column>
       
        <el-table-column label="分账周期">
          <template slot-scope="scope">
            <p>{{scope.row.startTime | getDate}} ~ {{scope.row.endTime | getDate}}</p>
          </template>
        </el-table-column>

        <el-table-column label="打款人" :formatter="nullFormatter">
          <template slot-scope="scope">
            <p>{{scope.row.moneyOutDepName + ' - ' + scope.row.moneyOutByName}}</p>
          </template>
        </el-table-column>
        
        <el-table-column label="打款日期" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.moneyOutTime | getDate}}</p>
          </template>
        </el-table-column>   
        
        <el-table-column label="打款备注" width="200">
          <template slot-scope="scope">
              <span v-if="scope.row.remark&&(scope.row.remark).trim().length > 0">
                <el-popover trigger="hover" placement="top">
                  <div style="width:160px;word-break: break-all;word-wrap:break-word;white-space: normal;text-align: justify">
                    {{scope.row.remark}}
                  </div>
                  <div slot="reference" class="name-wrapper" :class="{'isFlex':scope.row.remark.length<16}">
                    {{scope.row.remark}}
                  </div>
                </el-popover>
              </span>
              <span v-else>--</span>
          </template>
        </el-table-column>
               
       
      </el-table>
      <el-pagination
      @current-change="handleCurrentChange"
      :page-size="tableData.pageSize"
      :current-page="tableData.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="tableData.total"
      v-if="tableData.total > 0"
      >
     </el-pagination>
    </div>
    <!-- 打款详情 -->
    <!-- <el-dialog title="打款明细" :visible.sync="dialogVisible2" width="1000px" class="layer-audit" :closeOnClickModal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal">
      <div class="audit-box"  :style="{ height: clientHeight2() }">
       
        <div class="audit-col">
          <el-table :data="layerAudit" border style="width: 100%" class="table">
            <el-table-column label="合同编号" width="120" fixed :formatter="nullFormatter" align="center">
              <template slot-scope="scope">
                <div class="blue curPointer" @click="goContractDetail(scope.row)">{{scope.row.code}}</div>
              </template>
            </el-table-column>

            <el-table-column label="合同类型" prop="contType.label" :formatter="nullFormatter" align="center"></el-table-column>

            <el-table-column label="物业地址" prop="address"></el-table-column>

            <el-table-column label="成交总价" :formatter="nullFormatter" prop="dealPrice">
              <template slot-scope="scope">
                <span>{{scope.row.dealPrice}} 元</span>
                <span v-for="item in dictionary['507']" :key="item.key" v-if="item.key===scope.row.timeUnit&&scope.row.contType.value===1"> / {{item.value}}</span>
              </template>
            </el-table-column>

            <el-table-column label="成交经纪人" :formatter="nullFormatter">
              <template slot-scope="scope">
                <p>{{scope.row.dealAgentStoreName}}</p>
                <p>{{scope.row.dealAgentName}}</p>
              </template>
            </el-table-column>

            <el-table-column prop="thisSettlement" label="当期实收（元）"></el-table-column>

            <el-table-column prop="ratioSettlement" label="结算比例"></el-table-column>

            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <span class="openAll" @click="openAll">当期成本(元)</span>
              </template>
              <template slot-scope="scope">
                {{scope.row.thisCost}}
              </template>
            </el-table-column>

            <el-table-column v-if="!isOpen">
              <template slot="header" slot-scope="scope">
                <span>金融服务费(元)</span>
              </template>
              <template slot-scope="scope">
                {{scope.row.serviceFee}}
              </template>
            </el-table-column>
            
            <el-table-column v-if="!isOpen">
              <template slot="header" slot-scope="scope">
                <span>按揭手续费(元)</span>
              </template>
              <template slot-scope="scope">
                {{scope.row.mortgageFee}}
              </template>
            </el-table-column>


            <el-table-column prop="actualSettlement" label="实际结算"></el-table-column>
            

            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <span class="openAll" @click="openAll2">业绩分成比例</span>
              </template>
              <template slot-scope="scope">
                {{scope.row.achieveDisRatio}}
              </template>
            </el-table-column>

            <el-table-column label="分成角色" align="center" v-if="!isOpen2">
              <template slot-scope="scope">
                <div v-if="scope.row.resultDetailsList.length==0">
                  <div>--</div>
                </div>
                <div v-else>
                  <p v-for="item in scope.row.resultDetailsList">
                    {{item.disDeptName + '-' + item.disName +  '-' + item.roleType}}
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="分成比例" align="center" v-if="!isOpen2">
              <template slot-scope="scope">
                <div v-if="scope.row.resultDetailsList.length==0">
                  <div>--</div>
                </div>
                <div v-else>
                  <div v-for="item in scope.row.resultDetailsList">
                    {{item.disRatio}}%
                  </div>
                </div>
              </template>
            </el-table-column>
           

            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <span class="openAll" @click="openAll3">门店承担成本（元）</span>
              </template>
              <template slot-scope="scope">
                {{scope.row.storeCost}}
              </template>
            </el-table-column>

            <el-table-column v-if="!isOpen3">
              <template slot="header" slot-scope="scope">
                <span>特许服务费（元）</span>
              </template>
              <template slot-scope="scope">
                {{scope.row.platformFee}}
              </template>
            </el-table-column>

            <el-table-column v-if="!isOpen3">
              <template slot="header" slot-scope="scope">
                <span>当期刷卡手续费（元）</span>
              </template>
              <template slot-scope="scope">
                {{scope.row.payCardFee}}
              </template>
            </el-table-column>
           

            <el-table-column prop="disAmount" label="当期实收分成（元）"></el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog> -->
   
  </div>
</template>


      
<script>
  import ScreeningTop from '@/components/ScreeningTop';
  import {FILTER} from "@/assets/js/filter";
  import {TOOL} from "@/assets/js/common";
  import { MIXINS } from "@/assets/js/mixins";
  
  export default {
    name: "debit-record",
    // mixins: [FILTER],
    mixins: [FILTER,MIXINS],
    data(){
      return{ 
        isOpen:true,
        isOpen2:true,
        isOpen3:true,

        clientHei: document.documentElement.clientHeight, //窗体高度
        // loading:false,
        // loading2:false,
        loadingTable:false, //列表的加载loading
        visiableColumn1:true,
        userMsg:{},

        // 列表分页
        pageNum: 1,
        pageSize: 50,
        total: 0,
        
        // Form :{
        //   getDepName: '',
        //   getAgentName: ''
        // },
        adjustForm:{
          signDate: '', //发起日期
          outStoreId: '', //分账门店id
          inStoreId: '', //分账门店属性
          outStoreAttr: '', //收款门店id
          inStoreAttr: '', //收款门店属性
          keyWord: ''   //关键字
        },

        // 部门搜索分页
        pageSize_:50,
        outStoreList:[],//分账门店
        inStoreList:[],//收款门店
        currentPage_out:1,//分账    
        currentPage_in:1,//收款
        total_out:0,
        total_in:0,
        loading:false,
        //部门选择列表
        options:[],
        currentPage_:1,
        firstTotal:0,

        dictionary: {
          //数据字典
          "507": "", // 成交总价单位
          "53": "" //合作方式
        },
      
        layerAudit:[],
        

        checkInfo:[],


        //上传的协议
        uploadList: [],

        auditForm: {
          textarea: '', //备注
        },
        // 弹框里用到的
        dialogVisible2: false,
        // checked: false, //是否有解除协议
       
        tableData:[],

        power: {
          'sign-ht-maid-query': {
            state: false,
            name: '查询'
          },
          'sign-ht-maid-vdetail': {
            state: false,
            name: '打款明细'
          },
          'sign-com-htdetail':{
              name:'合同详情',
              state:false,
          },
        }

        

        
      }
    },

    computed: {
    
    },

    filters: {
       getDate(val) {
         return TOOL.dateFormat(val);
       },
       getTime(val) {
         if(val === ''){
           return '-'
         }
         return TOOL.timeFormat(val)
       }
    },
  
    methods:{
      openAll(){
        this.isOpen=!this.isOpen;
      },
      openAll2(){
        this.isOpen2=!this.isOpen2;
      },
      openAll3(){
        this.isOpen3=!this.isOpen3;
      },

     
      // 控制弹框body内容高度，超过显示滚动条
      clientHeight() {        
          return this.clientHei - 265 + 'px'
      },

      clientHeight2() {        
          return this.clientHei - 197 + 'px'
      },
      trim(str){
        return str.replace(/(^\s*)|(\s*$)/g, "")
      },


      // 重置
      resetFormFn() {
          TOOL.clearForm(this.adjustForm);
          this.pageNum = 1; 
          this.outStoreList=this.options//分账门店
          this.inStoreList=this.options//收款门店
          this.currentPage_out=1//分账
          this.currentPage_in=1//收款
          this.total_out=this.firstTotal
          this.total_in=this.firstTotal     
      },

      // 查询
      queryFn() {
        // console.log(this.power)
        // if(this.power['sign-ht-maid-query'].state){
          // console.log(this.userMsg.empId)
        this.loadingTable = true; 
        // this.adjustForm.signDate = TOOL.dateFormat(this.adjustForm.signDate);
          
            let param = {
              outStoreId:  this.adjustForm.outStoreId,
              outStoreAttr: this.adjustForm.outStoreAttr,
              inStoreId:  this.adjustForm.inStoreId,
              inStoreAttr: this.adjustForm.inStoreAttr,
              moneyOutTime:this.adjustForm.signDate,
              pageNum: this.pageNum,                 
              pageSize: this.pageSize,                                      
              keyword: this.adjustForm.keyWord             
            }
            //调整佣金审核列表
            this.$ajax         
            .get("/api/separate/money/out/list", param)
            .then(res => {
              this.$nextTick(() => {
                this.loadingTable = false;
              })
              let data = res.data;
              if (res.data.status === 200) {
                this.tableData = data.data  
                          
              }
              
              
        
            }).catch(error => {
              this.$nextTick(() => {
                this.loadingTable = false;
              })
              this.$message({
                message: error
              })
            })
        // }else{
        //   this.noPower(this.power['sign-ht-maid-query'].name)
        // }
        
      },

      // 双击详情事件
      toDetail(e) {
          // this.dialogVisible2 = true
          // let param = {
          //   settleDetailsIds: e.settleDetailsIds,
          // }
          // this.$ajax.get("/api/separate/money/out/details", param)
          // .then(res => {
          //   let data = res.data;
          //   if (res.data.status === 200) {
          //     this.layerAudit = data.data;
          //   }
          // }).catch(error => {
          //     this.$message({
          //       message: error
          //     })
          // });

          let newPage = this.$router.resolve({ 
            path: '/routingRemitDetail',
            query:{
              ids: e.settleDetailsIds,
              type: 2
            }
          });
       
        
      },

      //跳转合同详情页
      goContractDetail(value){
        if(this.power['sign-com-htdetail'].state){
            
          // console.log(value)
          this.setPath(this.$tool.getRouter(['合同','调佣审核','合同详情'],'contractList'));
          this.$router.push({
            path:'/contractDetails',
            query:{
              id: value.contId,
              code: value.contractCode,
              contType: value.tradeType
            }
          })
        }else{
           this.noPower(this.power['sign-com-htdetail'].name);
        }
      },
      
      handleCurrentChange(e) {
        this.pageNum = e;
        this.queryFn();
      },

    
    getDepList(param,first=true,type='out'){
      this.$ajax.get('/api/organize/deps/pages',param).then(res=>{
        res=res.data;
        if(res.status===200){
          if(first){
            this.outStoreList=res.data.list;
            this.inStoreList=res.data.list;
            this.options=res.data.list;
            this.firstTotal=res.data.total;
            this.total_out=res.data.total
            this.total_in=res.data.total
          }else{
            if(type==='out'){
              this.outStoreList=res.data.list;
              this.total_out=res.data.total
            }else{
              this.inStoreList=res.data.list;
              this.total_in=res.data.total
            }
          }
        }
      })
    },

       //搜索
    remoteMethod_out(keyword){
      if(keyword!==''){
        this.currentPage_out=1;
        let param = {
          type:'G',
          keyword:keyword,
          pageSize:this.pageSize_,
          pageNum:this.currentPage_out,
          depAttr:''
        }
        if(this.adjustForm.outStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.adjustForm.outStoreAttr===2){
          param.depAttr='JOIN'
        }
        this.getDepList(param,false,'out')
      }
    },
    remoteMethod_in(keyword){
      if(keyword!==''){
        this.currentPage_in=1;
        let param = {
          type:'G',
          keyword:keyword,
          pageSize:this.pageSize_,
          pageNum:this.currentPage_in,
          depAttr:''
        }
        if(this.adjustForm.inStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.adjustForm.inStoreAttr===2){
          param.depAttr='JOIN'
        }
        this.getDepList(param,false,'in')
      }
    },
    //门店下拉加载更多
    moreDeps(type){
      if(type==='out'){
        if(this.total_out>this.outStoreList.length){
          this.currentPage_out++;
          let param = {
            type:'G',
            pageNum:this.currentPage_out,
            pageSize:this.pageSize_
          }
          this.$ajax.get('/api/organize/deps/pages',param).then(res=>{
            res=res.data;
            if(res.status===200){
              this.outStoreList=this.outStoreList.concat(res.data.list);
            }
          })
        }
      }else{
        if(this.total_in>this.inStoreList.length){
          this.currentPage_in++;
          let param = {
            type:'G',
            pageNum:this.currentPage_in,
            pageSize:this.pageSize_
          }
          this.$ajax.get('/api/organize/deps/pages',param).then(res=>{
            res=res.data;
            if(res.status===200){
              this.inStoreList=this.inStoreList.concat(res.data.list);
            }
          })
        }
      }
    },
    //改变门店类型
    changeStoreAttr_out(value){
      this.currentPage_out=1;
      this.adjustForm.outStoreId='';
      let param = {
        type:'G',
        pageNum:this.currentPage_out,
        pageSize:this.pageSize_,
        depAttr:''
      }
      if(value===1){
        param.depAttr='DIRECT'
      }else if(value===2){
        param.depAttr='JOIN'
      }
      this.getDepList(param,false,'out')
    },
    changeStoreAttr_in(value){
      this.currentPage_in=1;
      this.adjustForm.inStoreId='';
      let param = {
        type:'G',
        pageNum:this.currentPage_in,
        pageSize:this.pageSize_,
        depAttr:''
      }
      if(value===1){
        param.depAttr='DIRECT'
      }else if(value===2){
        param.depAttr='JOIN'
      }
      this.getDepList(param,false,'in')
    },
    //清空选择的门店
    clearOutList(type){
      if(type==='out'){
        this.currentPage_out=1;
        let param = {
          type:'G',
          pageNum:this.currentPage_out,
          pageSize:this.pageSize_,
          depAttr:''
        }
        if(this.adjustForm.outStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.adjustForm.outStoreAttr===2){
          param.depAttr='JOIN'
        }
        this.getDepList(param,false,'out')
      }else{
        this.currentPage_in=1;
        let param = {
          type:'G',
          pageNum:this.currentPage_in,
          pageSize:this.pageSize_,
          depAttr:''
        }
        if(this.adjustForm.inStoreAttr===1){
          param.depAttr='DIRECT'
        }else if(this.adjustForm.inStoreAttr===2){
          param.depAttr='JOIN'
        }
        this.getDepList(param,false,'in')
        }
      },


  
      

      
    
    },

    created() {
      this.queryFn();
      // this.getDepNameFn();
      this.getDictionary();
      this.getDepList({
        type:'G',
        pageNum:this.currentPage_,
        pageSize:this.pageSize_,
      })
      // this.getAdmin();
      // this.remoteMethod()
      

     
    },

    mounted() {
      var _this = this;
       window.onresize = function(){
         _this.clientHei = document.documentElement.clientHeight;
       }
    },

    components: {
          ScreeningTop,
          
         
      }
  };
</script>
<style lang="less">

@import "~@/assets/common.less";

#adjustcheck{
  .btn-text-info{
    padding: 0;
    &.color-red{
      color: red;
    }
  }
  .el-textarea.is-disabled .el-textarea__inner{
        color:#233241;
    }
  .fl{
    float: left;
  }

  .mt20{
    margin-bottom: 20px;
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    margin-bottom: 10px;
  }
  .el-form-item--mini .el-form-item__content, .el-form-item--mini .el-form-item__label{
    line-height: 32px;
  }
  .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
    width: 330px;
    line-height: 32px;
    height: 32px;
  }
  .el-range-editor--mini.el-input__inner{
    height: 32px;
    font-size: 14px;
  }
  .el-range-editor--mini .el-range-input{
    font-size: 14px;
  }
  .el-input--mini .el-input__inner{
    height: 32px;
    line-height: 32px;
    font-size: 14px;
  }
  .el-pagination{
     text-align: right;
  }

  .adjustbox{
    box-shadow:0px 1px 6px 0px rgba(7,47,116,0.1);
  }

  .adjust-form {
    margin-bottom: 10px;
    background-color: #fff;
    border-radius:2px;
    box-sizing: border-box;
  }

  .contract-list {
      background-color: #fff;
      padding: 10px 12px 0;
    .form-title-fl{
      font-size: 14px;
      color: #233241;
      padding: 6px 0;
      
      .mr8{
        margin-right: 8px;
      }
    }
    .el-table{
      th{
        background-color: #EEF2FB;
        &:first-child{
          padding-left: 20px;
        }
      }
      tr{
        td{
          &:first-child{
            padding-left: 20px;
          }
        }
      }
      
    }
  }

  .blue{
    color: @color-blue;
  }
  .yellow{
    color: @color-yellow;
  }
  .green{
    color: @color-green;
  }
  .red{
    color: @color-warning;
  }
  .btn{
    color: @color-blue;
    cursor: pointer;
  }

  .width250{
    width: 250px;
  }
  .width200{
    width: 200px;
  }
  .width150{
    width: 150px;
  }
  .mb20{
    margin-bottom: 20px;
  }
  .width100{
    width: 100px;
  }
  .mr100{
    margin-right: 100px;
  }
  .curPointer{
    cursor: pointer;
    &:hover{
      text-decoration: underline;
    }
  }
  // 调佣审核弹层样式
  .layer-audit{
    .el-dialog{
      margin: 80px auto 60px !important;
      margin-top: 0vh;
    }
    .el-dialog__header{
      border-bottom: 1px solid #EDECF0;
      padding: 16px 20px 15px;
      span{
          color: #233241;
          font-size: 20px;
          
          
      }
      .el-dialog__headerbtn{
          top: 16px;
          .el-dialog__close{
              font-size: 24px;
              color: #32485F;
          }
      } 
    }
    .el-dialog__body{
          padding: 0;
      }
  }
  .audit-box{
    padding: 0 20px 0px 20px;
    overflow-y: auto;
    .audit-col{
      padding: 20px 0;
      .col-li{
        overflow: hidden;
        clear: left;
        margin-bottom: 18px;
        p{
          float: left;
          &:first-child{
            width: 250px;
            color: #6C7986;
            span{
              color: #233241;
              &.blue{
                color: #478DE3;
              }
            }
          }
        }
      }
      .textareabox{
        display: flex;
        align-items: flex-start;
        span{
          width: 80px;
          em{
            color:#FF3E3E;
            margin-right: 3px;
          }
        }
      }
      .table{
        width: 100%;
        border-collapse:collapse;
        border-spacing:1;
        border-top: 1px solid #E8EAF6;
        border-left: 1px solid #E8EAF6;
        text-align: center;
        .el-input__inner{
          height: 28px;
          line-height: 28px;
          padding: 0;
          text-align: center;
        }
        .el-input__icon{
          line-height: 28px;
        }
        .el-input__suffix{
          right: 0px;
        }
        tr th{
          background-color:#F2F3F8;
          border-right: 1px solid #E8EAF6;
          border-bottom: 1px solid #E8EAF6;
          line-height: 40px;
          height: 40px;
        }
        tr td{
          overflow: hidden;
          padding: 14px 10px;
          border-right: 1px solid #E8EAF6;
          border-bottom: 1px solid #E8EAF6;
          &.flex{
            display: flex;
            align-items: center;
            justify-content: center;
  
          }
          .width70{
            width: 72px;
            height: 28px;
            line-height: 28px;
            margin-right: 3px;
           
          }
          .mr10{
            margin-right: 10px;
            .el-input__inner{
              text-align: left;
              padding-left: 10px;
            }
          }
          .fl{
            float: left;
          }
        }
      }
      .table2{
        tr td{
          padding: 12px 0;
        }
      }
      .uploadfile{
        margin: 40px 0 0;
        display: flex;
        .uploadtitle{
          color: #6C7986;
          width: 78px;
          span{
            margin-left: 16px;
            color: #8E8E8E;
            b{
              color: #6C7986;
            }
          }
        }       
        .ulData{
 
            width: 100%;
            overflow: hidden;
            li{
                margin-right: 20px;
                margin-bottom: 20px;
                position: relative;
                float: left;
                &:nth-child(5n){
                  margin-right: 0;
                }
                > i{
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    color: #F56C6C;
                    font-size: 20px;
                    cursor: pointer;
                }
            }
        }

        .namePath{
            display: inline-block;
            text-align: center;
            width: 120px;
            height: 120px;
            padding-top: 20px;
            box-sizing: border-box;
            border-radius:4px;
            background: #F2F3F8;
            > p{
              padding-top: 5px;
              display: inline-block;
              width: 100px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
        }

      }
      
    }   
    .bordernone{
      border-bottom: none;
    }
  }
  .textareabox2{
    display: flex;
    align-items: flex-start;
    margin-bottom: 30px;
    span{
      width: 76px;
    }
  }
  .btnbox{
    display: flex;
    justify-content: flex-end;
    padding: 15px 20px 15px 0;
    border-top: 1px solid #EDECF0;
    .el-button{
      width: 100px;
      height: 38px;
      border-radius: 18px;
      padding: 0;
      &.refuse{
        background-color: #EAEFF5;
      }
      &.recept{
        background-color: #54D384;
        border-color: #54D384;
      }
      
    }
  }
  .name-wrapper {
    min-width: 80px;
    max-height: 65px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: normal;
    word-break: break-all;
    word-wrap:break-word;
  }
   
  .isFlex{
    display: flex;
    align-items: center;
  }


}





</style>