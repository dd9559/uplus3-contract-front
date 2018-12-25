<template>
  <div class="view">
    <ScreeningTop @propResetFormFn="reset" @propQueryFn="getData('search')">
      <div class="content">
        <div class="input-group">
          <label>合同类型:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.contType" placeholder="请选择">
            <el-option
              v-for="item in dictionary['10']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>查询时间:</label>
          <div class="time-picker">
            <el-select :clearable="true" size="small" v-model="searchForm.timeType" placeholder="请选择">
              <el-option
                v-for="item in $tool.dropdown.dateType_money"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker
              v-model="searchForm.timeRange"
              type="daterange"
              size="small"
              class="margin-left"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <div class="input-group">
          <label>部门:</label>
          <select-tree :data="DepList" :init="searchForm.depName" @checkCell="depHandleClick" @clear="clearDep"></select-tree>
          <!--<el-select class="w200" :clearable="true" ref="tree" size="small" :loading="Loading" :remote-method="remoteMethod" @visible-change="initDepList" @clear="clearDep" v-model="searchForm.depName" placeholder="请选择">
            <el-option class="drop-tree" value="">
              <el-tree :data="DepList" :props="defaultProps" @node-click="depHandleClick"></el-tree>
            </el-option>
          </el-select>-->
          <el-select :clearable="true" v-loadmore="moreEmploye" class="margin-left" size="small" v-model="searchForm.empId" placeholder="请选择">
            <el-option
              v-for="item in EmployeList"
              :key="item.empId"
              :label="item.name"
              :value="item.empId">
            </el-option>
          </el-select>
        </div>
        <div class="input-group" v-if="activeView===1">
          <label>票据状态:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.billStatus" placeholder="请选择">
            <el-option
              v-for="item in dictionary['56']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收款账户:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.proAccount" placeholder="请选择">
            <el-option
              v-for="item in dictionary['32']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收付状态:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.checkStatus" placeholder="请选择">
            <el-option
              v-for="item in dictionary['23']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收付款类:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.moneyType" placeholder="请选择">
            <el-option
              v-for="item in drop_MoneyType"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收付方式:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.payMethod" placeholder="请选择">
            <el-option
              v-for="item in dictionary['24']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>关键字:</label>
          <el-input class="w394" size="small" v-model="searchForm.keyword" placeholder="合同编号/房源编号/客源编号/物业地址/业主/客户/手机号"></el-input>
        </div>
      </div>
    </ScreeningTop>
    <div class="view-context">
      <div class="table-tool">
        <h4 class="f14"><i class="iconfont icon-tubiao-11"></i>数据列表</h4>
        <p>
          <el-button class="btn-info" round size="small" type="primary" @click="getExcel">导出</el-button>
        </p>
      </div>
      <el-table ref="dataList" border :data="list" :key="activeView" style="width: 100%" header-row-class-name="theader-bg" @row-dblclick="toDetails">
        <el-table-column align="center" min-width="150" :label="getView" prop="payCode"
                         :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="合同信息" min-width="200px" prop="cityName" :formatter="nullFormatter">
          <template slot-scope="scope">
            <ul class="contract-msglist">
              <li>合同编号:<span @click="toLink(scope.row,'cont')">{{scope.row.contCode}}</span></li>
              <li>房源编号:<span>{{scope.row.houseCode}}</span><span>{{scope.row.houseOwner}}</span></li>
              <li>客源编号:<span>{{scope.row.custCode}}</span><span>{{scope.row.custName}}</span></li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="150" label="物业地址" prop="address"
                         :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="合同类型" prop="contType" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="款类" prop="moneyType" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="收付方式" prop="method" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="对象">
          <template slot-scope="scope">
            <span>{{scope.row.type===1?scope.row.outObjType:scope.row.inObjType|getLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="activeView===1?'收款人':'付款人'" min-width="140">
          <template slot-scope="scope">
            <span>{{scope.row.store}}</span>
            <p>{{scope.row.type===1?scope.row.inObjName:scope.row.createByName}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="当前审核人" min-width="140">
          <template slot-scope="scope">
            <span>{{scope.row.auditStore}}</span>
            <p>{{scope.row.auditName}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额（元）" prop="amount" :formatter="nullFormatter"></el-table-column>
        <!--<el-table-column align="center" label="刷卡手续费" prop="fee" :formatter="nullFormatter"></el-table-column>-->
        <el-table-column align="center" :label="activeView===1?'收付时间':'付款时间'" prop="createTime" :formatter="nullFormatter" min-width="140">
          <template slot-scope="scope">
            <span>{{scope.row.createTime|formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="入账时间" prop="toAccountTime" :formatter="nullFormatter" v-if="activeView===1" min-width="140">
          <template slot-scope="scope">
            <span>{{scope.row.toAccountTime|formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" prop="payStatus"></el-table-column>
        <el-table-column align="center" label="结算信息" v-if="activeView===1">
          <template slot-scope="scope">
            <span>{{scope.row.moneyType}}{{scope.row.amount}}元</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="票据状态" prop="billStatus.label" v-if="activeView===1"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" min-width="120">
          <template slot-scope="scope">
            <template v-if="(scope.row.auditButton&&power[activeView===1?'sign-cw-rev-verify':'sign-cw-pay-verify'].state)||(scope.row.caozuo===1&&power[activeView===1?'sign-cw-rev-void':'sign-cw-pay-void'].state)">
              <el-button type="text" @click="cellOpera(scope.row)" v-if="scope.row.auditButton&&power[activeView===1?'sign-cw-rev-verify':'sign-cw-pay-verify'].state">审核</el-button>
              <el-button type="text" @click="cellOpera(scope.row,'del')" v-if="scope.row.caozuo===1&&power[activeView===1?'sign-cw-rev-void':'sign-cw-pay-void'].state">作废</el-button>
            </template>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="list.length>0"
        class="pagination-info"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!--作废dialog-->
    <el-dialog
      title="作废"
      :visible.sync="layer.show"
      :closeOnClickModal="$tool.closeOnClickModal"
      width="740px">
      <div class="delete-dialog" v-if="layer.content.length>0">
        <p>是否作废该{{activeView===1?'收款单':'付款单'}}</p>
        <el-table border :data="layer.content" style="width: 100%" header-row-class-name="theader-bg" key="other">
          <el-table-column align="center" min-width="120" label="收付编号" prop="payCode" :formatter="nullFormatter"></el-table-column>
          <el-table-column align="center" :label="activeView===1?'收款金额':'付款金额'" prop="cityName" :formatter="nullFormatter">
            <template slot-scope="scope">
              <span>{{scope.row.amount}}元</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="activeView===1?'付款方':'收款方'" prop="cityName" :formatter="nullFormatter">
            <template slot-scope="scope">
              <span>{{scope.row.type===1?scope.row.outObjType.label:scope.row.inObjType.label}}{{scope.row.type===1?scope.row.outObjName?`-${scope.row.outObjName}`:'':scope.row.inObjName?`-${scope.row.inObjName}`:''}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button size="small" class="btn-info" round @click="layer.show = false">返 回</el-button>
    <el-button size="small" class="btn-info" round type="primary" @click="deleteBill">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";
  import {MIXINS} from "@/assets/js/mixins";
  import {UPLOAD} from "@/assets/js/uploadMixins";

  export default {
    mixins: [FILTER, MIXINS,UPLOAD],
    data() {
      return {
        activeView: '',
        searchForm: {
          contType: '',
          timeType: '',
          depName:'',
          depId: '',
          empId: '',
          billStatus: '',
          proAccount: '',
          checkStatus: '',
          moneyType: '',
          payMethod: '',
          keyword: '',
          timeRange:'',
        },
        list: [],
        dictionary: {
          '10': '',
          '56': '',
          '32': '',
          '23': '',
          '24': '',
          '25': '',
          '507': ''
        },
        drop_MoneyType:[],
        //分页
        total:0,
        currentPage:1,
        pageSize:10,
        //作废
        layer:{
          show:false,
          content:[]
        },
        //权限配置
        power: {
          'sign-cw-rev-query': {
            state: false,
            name: '查询'
          },
          'sign-cw-rev-export': {
            state: false,
            name: '导出'
          },
          'sign-cw-rev-void': {
            state: false,
            name: '作废'
          },
          'sign-cw-rev-verify': {
            state: false,
            name: '审核'
          },
          'sign-cw-rev-contract': {
            state: false,
            name: '合同详情'
          },
          'sign-cw-rev-house': {
            state: false,
            name: '房源详情'
          },
          'sign-cw-rev-cust': {
            state: false,
            name: '客源详情'
          }
        }
      }
    },
    created() {
      this.activeView = parseInt(this.$route.query.type)
      if(this.activeView===2){
        this.power=Object.assign({},{
          'sign-cw-pay-query': {
            state: false,
            name: '查询'
          },
          'sign-cw-pay-export': {
            state: false,
            name: '导出'
          },
          'sign-cw-pay-void': {
            state: false,
            name: '作废'
          },
          'sign-cw-pay-verify': {
            state: false,
            name: '审核'
          },
          'sign-cw-pay-contract': {
            state: false,
            name: '合同详情'
          },
          'sign-cw-pay-house': {
            state: false,
            name: '房源详情'
          },
          'sign-cw-pay-cust': {
            state: false,
            name: '客源详情'
          }})
      }
      for (let item in this.power){
        this.power[item].state=true
        /*if(this.getUser){
          if(this.getUser.privileges.indexOf(item)>-1){
            this.power[item].state=true
          }
        }*/
      }

      this.getData()
      this.remoteMethod()
      this.getDictionary()
      this.getMoneyTypes()
    },
    beforeRouteUpdate(to, from, next) {
      this.list = []
      this.activeView = parseInt(to.query.type)
      this.$tool.clearForm(this.searchForm)   //初始化筛选查询
      this.clearDep()
      if(this.activeView===2){
        this.power=Object.assign({},{
          'sign-cw-pay-query': {
            state: false,
            name: '查询'
          },
          'sign-cw-pay-export': {
            state: false,
            name: '导出'
          },
          'sign-cw-pay-void': {
            state: false,
            name: '作废'
          },
          'sign-cw-pay-verify': {
            state: false,
            name: '审核'
          },
          'sign-cw-pay-contract': {
            state: false,
            name: '合同详情'
          },
          'sign-cw-pay-house': {
            state: false,
            name: '房源详情'
          },
          'sign-cw-pay-cust': {
            state: false,
            name: '客源详情'
          }})
      }else{
        this.power=Object.assign({},{
          'sign-cw-rev-query': {
            state: false,
            name: '查询'
          },
          'sign-cw-rev-export': {
            state: false,
            name: '导出'
          },
          'sign-cw-rev-void': {
            state: false,
            name: '作废'
          },
          'sign-cw-rev-verify': {
            state: false,
            name: '审核'
          },
          'sign-cw-rev-contract': {
            state: false,
            name: '合同详情'
          },
          'sign-cw-rev-house': {
            state: false,
            name: '房源详情'
          },
          'sign-cw-rev-cust': {
            state: false,
            name: '客源详情'
          }
        })
      }
      for (let item in this.power){
        this.power[item].state=true
        /*if(this.getUser){
          if(this.getUser.privileges.indexOf(item)>-1){
            this.power[item].state=true
          }
        }*/
      }

      this.getData()
      this.getDictionary()
      next()
    },
    methods: {
      getExcel:function () {
        this.$ajax.post('/api/postSigning/getExcel').then(res=>{
          debugger
        })
      },
      /**
       * 列表横行滚动
       */
      scroll:function () {
        // debugger
        let box=this.$refs.dataList.$refs.bodyWrapper
        console.log(box.clientWidth,box.scrollWidth)
        box.scrollTo(box.scrollLeft+30,0)
        console.log(box.scrollLeft)
      },
      reset:function () {
        this.$tool.clearForm(this.searchForm)
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val
        this.getData()
      },
      initDepList:function (val) {
        if(!val){
          this.remoteMethod()
        }
      },
      clearDep:function () {
        this.searchForm.depId=''
        this.searchForm.depName=''
        // this.EmployeList=[]
        this.searchForm.empId=''
        this.clearSelect()
      },
      depHandleClick(data) {
        this.searchForm.depId=data.depId
        this.searchForm.depName=data.name
        this.searchForm.empId=''
        this.handleNodeClick(data)
      },
      getData: function (type='init') {
        if(type==='search'){
          this.currentPage=1
        }
        let powerMsg=this.power[this.activeView===1?'sign-cw-rev-query':'sign-cw-pay-query']
        if(powerMsg.state){
          let param = JSON.parse(JSON.stringify(this.searchForm))
          if(typeof param.timeRange==='object'&&Object.prototype.toString.call(param.timeRange)==='[object Array]'){
            param.startTime = param.timeRange[0]
            param.endTime = param.timeRange[1]
          }
          delete param.timeRange
          param.pageNum = this.currentPage
          param.pageSize = this.pageSize
          let url = this.activeView===1?'/payInfo/proceedsAuditList':'/payInfo/payMentAuditList'
          this.$ajax.get(`/api${url}`,param).then(res => {
            res = res.data
            if (res.status === 200) {
              this.list = res.data.page.list
              this.total = res.data.page.total
            }
          }).catch(error => {
            console.log(error)
          })
        }else {
          this.noPower(powerMsg.name)
        }
      },
      toDetails:function (item) {
        let powerMsg=this.power[this.activeView===1?'sign-cw-rev-verify':'sign-cw-pay-verify'].state
        let param = {
          path: 'billDetails'
        }
        if (this.activeView === 1) {
          param.query = {
            tab: '收款信息',
            id:item.id,
            type:item.inAccountType,
            power:powerMsg
          }
          this.setPath(this.getPath.concat({name:'收款详情'}))
        } else {
          param.query = {
            tab: '付款信息',
            id:item.id,
            power:powerMsg
          }
          this.setPath(this.getPath.concat({name:'付款详情'}))
        }
        this.$router.push(param)
      },
      //操作
      cellOpera: function (item,type='check') {
        if(type==='check'){
          this.toDetails(item)
        }else {
          this.layer.show=true
          this.layer.content=[].concat(item)
        }
      },
      /**
       * 合同信息操作
       * @param type
       */
      toLink:function (row,type) {
        let param={
          contType:row.contTypeId,
          contId:row.contId,
          contCode:row.contCode,
          operaType:type,
          power:type==='cont'?this.power[this.activeView===1?'sign-cw-rev-contract':'sign-cw-pay-contract']:type==='house'?this.power[this.activeView===1?'sign-cw-rev-house':'sign-cw-pay-house']:type==='customer'?this.power[this.activeView===1?'sign-cw-rev-cust':'sign-cw-pay-cust']:''
        }
        this.msgOpera(param)
      },
      /*msgOpera:function (row,type) {
        this.setPath(this.$tool.getRouter(['合同','合同列表','合同详情'],'contractList'))
        if(type==='cont'){
          this.$router.push({
            path:row.contTypeId===this.$tool.contType['4']||row.contTypeId===this.$tool.contType['5']?'detailIntention':'contractDetails',
            query:{
              contType:row.contTypeId,
              id:row.contId,
              code:row.contCode
            }
          })
        }
      },*/
      //作废
      deleteBill:function () {
        let src = this.activeView===1?'/payInfo/updateProceedsIsDel':'/payInfo/updatePaymentIsDel'
        this.$ajax.put(`/api${src}`,{payId:this.layer.content[0].id},2).then(res=>{
          res=res.data
          if(res.status===200){
            this.getData()
            this.layer.show=false
            this.$message({
              message:'作废成功'
            })
          }
        }).catch(error=>{
          this.$message({
            message:error
          })
        })
      },
      // 获取收付款类
      getMoneyTypes:function () {
        this.$ajax.get('/api/payInfo/selectSmallMoneyType').then(res=>{
          res=res.data
          if(res.status===200){
            this.drop_MoneyType=res.data
          }
        })
      }
    },
    computed: {
      getView: function () {
        if (this.activeView === 1) {
          return '收款ID'
        } else {
          return '付款ID'
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  .delete-dialog{
    >p{
      text-align: center;
      margin-bottom: @margin-10;
      font-size: @size-16;
    }
  }

  .contract-msglist {
    > li {
      text-align: left;
      > span {
        &:first-of-type {
          color: @color-blue;
          margin-right: 10px;
          cursor: pointer;
        }
      }
    }
  }

  .view-header {
    .title {
      position: relative;
      height: 60px;
      display: flex;
      align-items: center;
      > p {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      .input-group {
        margin-right: 10px;
        > label {
          text-align: center;
        }
        /deep/ .el-select, .el-input {
          flex: 1;
        }
      }
    }
  }

  .view-context {
    background-color: @color-white;
    padding: 0 @margin-10 @margin-10;
    /deep/ .theader-bg {
      > th {
        background-color: @bg-th;
      }
    }
  }
  .table-tool{
    /*height: 60px;*/
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: @margin-base 0;
    >h4{
      >i{
        margin-right: 8px;
      }
    }
    /*>p{
      position: absolute;
      top: 50%;
      right: 0;
      transform:translateY(-50%);
    }*/
  }
</style>
