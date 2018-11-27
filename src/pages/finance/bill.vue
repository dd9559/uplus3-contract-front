<template>
  <div class="view">
    <ScreeningTop>
      <div class="content">
        <div class="input-group">
          <label>合同类型:</label>
          <el-select size="small" v-model="searchForm.contType" placeholder="请选择">
            <el-option
              v-for="item in dictionary['10']"
              :key="item.key"
              :label="item.value"
              :value="item.parentId">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>查询时间:</label>
          <div class="time-picker">
            <el-select size="small" v-model="searchForm.timeType" placeholder="请选择">
              <el-option
                v-for="item in 5"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker
              v-model="searchForm.timeRange"
              type="daterange"
              size="small"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <div class="input-group">
          <label>部门:</label>
          <el-select size="small" v-model="searchForm.deptId" placeholder="请选择">
            <el-option
              v-for="item in dictionary['10']"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select class="margin-left-10" size="small" v-model="searchForm.empId" placeholder="请选择" v-show="searchForm.deptId">
            <el-option
              v-for="item in 5"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>票据状态:</label>
          <el-select size="small" v-model="searchForm.billStatus" placeholder="请选择">
            <el-option
              v-for="item in 5"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收款账户:</label>
          <el-select size="small" v-model="searchForm.proAccount" placeholder="请选择">
            <el-option
              v-for="item in 5"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收付状态:</label>
          <el-select size="small" v-model="searchForm.checkStatus" placeholder="请选择">
            <el-option
              v-for="item in 5"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收付款类:</label>
          <el-select size="small" v-model="searchForm.moneyType" placeholder="请选择">
            <el-option
              v-for="item in 5"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收付方式:</label>
          <el-select size="small" v-model="searchForm.payMethod" placeholder="请选择">
            <el-option
              v-for="item in 5"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>关键字:</label>
          <el-input size="small" v-model="searchForm.keyword" placeholder="合同编号/房源编号/客源编号/物业地址/客户/房产证号/手机号"></el-input>
        </div>
      </div>
    </ScreeningTop>
    <div class="view-context">
      <div class="table-tool">
        <h4 title="hello">数据列表</h4>
        <ul>
          <li>
            收款<span>{{tableTotal.ProceedsCount|zeroFormatter}}</span>笔，总额<span>{{tableTotal.ProceedsSum|zeroFormatter}}</span>元；
          </li>
          <li>
            付款<span>{{tableTotal.payMentCount|zeroFormatter}}</span>笔，总额<span>{{tableTotal.payMentSum|zeroFormatter}}</span>元；
          </li>
          <li>
            账户余额：<span>{{tableTotal.ProceedsSum-tableTotal.payMentSum|zeroFormatter}}</span>元
          </li>
        </ul>
        <p>
          <el-button type="primary">导出</el-button>
        </p>
      </div>
      <el-table border :data="list" style="width: 100%" header-row-class-name="theader-bg" @row-dblclick="toDetails">
        <el-table-column align="center" label="收付ID" prop="payCode" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="合同信息" min-width="200px" prop="cityName" :formatter="nullFormatter">
          <template slot-scope="scope">
            <ul class="contract-msglist">
              <li>合同编号:<span>{{scope.row.contCode}}</span></li>
              <li>房源编号:<span>{{scope.row.houseCode}}</span><span>{{scope.row.houseOwner}}</span></li>
              <li>客源编号:<span>{{scope.row.custCode}}</span><span>{{scope.row.custName}}</span></li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="160" label="物业地址" prop="address" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="合同类型" prop="contType" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="款类" prop="moneyType" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="收付方式" prop="method" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="对象">
          <template slot-scope="scope">
            <span>{{scope.row.type===1?scope.row.inObjType:scope.row.outObjType|getLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款人">
          <template slot-scope="scope">
            <span>{{scope.row.type===1?scope.row.inObjName:scope.row.outObjName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额（元）" prop="amount" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="刷卡手续费" prop="fee" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="收付时间" prop="createTime" :formatter="nullFormatter">
          <template slot-scope="scope">
            <span>{{scope.row.createTime|formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="入账时间" prop="toAccountTime" :formatter="nullFormatter">
          <template slot-scope="scope">
            <span>{{scope.row.toAccountTime|formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收付状态" prop="checkStatus.label"></el-table-column>
        <el-table-column align="center" label="结算信息">
          <template slot-scope="scope">
            <span>{{scope.row.moneyType}}{{scope.row.amount}}元</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" min-width="160">
          <template slot-scope="scope">
            <el-button type="text" v-show="scope.row.type===1">开票</el-button>
            <el-button type="text" @click="btnOpera(scope.row,1)">修改</el-button>
            <el-button type="text" @click="btnOpera(scope.row,2)">作废</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination-info"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";
  import {MIXINS} from "@/assets/js/mixins";

  export default {
    mixins: [FILTER,MIXINS],
    data() {
      return {
        activeView:'',
        searchForm: {
          contType: '',
          timeType: '',
          deptId: '',
          empId: '',
          billStatus: '',
          proAccount: '',
          checkStatus: '',
          moneyType: '',
          payMethod: '',
          keyword: '',
          timeRange:'',
        },
        tableTotal:{},
        list: [
          {
            id:1,
            contractId: '201809301289',
            houseId: "HRYY000039",
            customerId: "HRYY000039",
            contractType: "买卖&居间",
            collectionType: "佣金",
            broker: "东野圭吾-当代一店",
            accounts_receivable: 1000,
            payment_received: 1000,
            for_collection: 1000,
            operation_time: "2018/09/30 12:00",
            state: "未收"
          }
        ],
        dictionary: {
          '10': '',
          '33': '',
          '32': '',
          '23': '',
          '24': '',
          '25': '',
          '507': ''
        },
        //分页
        total:0,
        currentPage:1,
        pageSize:10
      }
    },
    created() {
      this.getData()
      this.getDictionary()
    },
    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val
        this.getData()
      },
      getData: function () {
        let param = JSON.parse(JSON.stringify(this.searchForm))
        if(typeof param.timeRange==='object'&&Object.prototype.toString.call(param.timeRange)==='[object Array]'){
          param.startTime = param.timeRange[0]
          param.endTime = param.timeRange[1]
        }
        delete param.timeRange
        param.pageNum = this.currentPage
        param.pageSize = this.pageSize
        this.$ajax.get('/api/payInfo/selectPayInfoList',param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.list = res.data.page.list
            this.total = res.data.page.total
            this.tableTotal = Object.assign({},res.data.payMentDataList,res.data.paymentDataList)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 跳转详情页
       * @param row
       */
      toDetails:function (row) {
        this.$router.push({
          path:'billDetails',
          query:{
            id:row.id,
            tab:row.type===1?'收款信息':'付款信息'
          }
        })
      },
      btnOpera:function (row,type) {
        if(type===1){
          this.$router.push({
            path:row.type===1?'receiptBill':'payBill',
            query:{
              edit:row.type,
              id:row.id
            }
          })
        }
      }
    },
    computed:{
      getView:function () {
        if(this.activeView===1){
          return '收款ID'
        }else {
          return '付款ID'
        }
      }
    },
    filters:{
      zeroFormatter:function (val) {
        if(!val){
          return 0
        }else {
          return val
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  .margin-left-10{
    margin-left:10px;
  }

  .contract-msglist{
    >li{
      text-align: left;
      >span{
        &:first-of-type{
          color: @color-blue;
          margin-right: 10px;
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
        /*/deep/ .el-select, .el-input {
          width: 200px;
        }*/
      }
    }
  }
  .view-context{
    background-color: @color-white;
    padding: 0 20px 20px;
    /deep/ .theader-bg{
      >th{
        background-color: @bg-th;
      }
    }
    .table-tool{
      height: 60px;
      position: relative;
      display: flex;
      align-items: center;
      >ul{
        display: flex;
        margin-left: 20px;
        >li{
          color: @color-6c;
          >span{
            color: @color-red;
          }
        }
      }
      >p{
        position: absolute;
        top: 50%;
        right: 0;
        transform:translateY(-50%);
      }
    }
  }
</style>
