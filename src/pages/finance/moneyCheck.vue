<template>
  <div class="view">
    <ScreeningTop>
      <div class="content">
        <div class="input-group">
          <label>合同类型:</label>
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
          <label>查询时间:</label>
          <div class="time-picker">
            <el-date-picker
              v-model="searchForm.signTime"
              type="daterange"
              size="small"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <div class="input-group">
          <label>部门:</label>
          <el-select size="small" v-model="searchForm.moneyState" placeholder="请选择">
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
          <el-select size="small" v-model="searchForm.department" placeholder="请选择">
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
          <el-select size="small" v-model="searchForm.contractType" placeholder="请选择">
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
          <el-select size="small" v-model="searchForm.contractType" placeholder="请选择">
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
          <el-select size="small" v-model="searchForm.contractType" placeholder="请选择">
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
          <el-select size="small" v-model="searchForm.contractType" placeholder="请选择">
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
      <el-table border :data="list" style="width: 100%" header-row-class-name="theader-bg">
        <el-table-column align="center" :label="getView" prop="contractType" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="合同信息" min-width="200px" prop="cityName" :formatter="nullFormatter">
          <template slot-scope="scope">
            <ul class="contract-msglist">
              <li>合同编号:<span>{{scope.row.contractId}}</span></li>
              <li>房源编号:<span>{{scope.row.houseId}}</span></li>
              <li>客源编号:<span>{{scope.row.customerId}}</span></li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column align="center" label="物业地址" prop="contractType" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="合同类型" prop="contractType" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="款类" prop="collectionType" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="收付方式" prop="broker" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="对象" prop="accounts_receivable" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" :label="activeView===1?'收款人':'付款人'" prop="for_collection" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="金额（元）" prop="useNum" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="付款时间" prop="operation time" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="状态" prop="state" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="票据" prop="contractType" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="cellOpera">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";

  let formObj = {
    moneyType: '',
    moneyState: '',
    department: '',
    contractType: '',
    signStart: '',
    signEnd: '',
    collectionStart: '',
    collectionEnd: '',
    keyword: ''
  }

  export default {
    mixins: [FILTER],
    data() {
      return {
        activeView:'',
        searchForm: {
          moneyType: '',
          moneyState: '',
          department: '',
          contractType: '',
          signTime: '',
          keyword: ''
        },
        list: [
          {
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
        ]
      }
    },
    created() {
      // this.getData()
      this.activeView = parseInt(this.$route.query.type)
    },
    beforeRouteUpdate (to, from, next) {
      this.searchForm = Object.assign(JSON.parse(JSON.stringify(formObj)))
      this.activeView = parseInt(to.query.type)
      next()
    },
    methods: {
      getData: function () {
        this.$ajax.get('/api/finance/listCollection').then(res => {
          res = res.data
          if (res.status === 200) {
            this.list = res.data.list
          }
        }).catch(error => {
          console.log(error)
        })
      },
      //操作
      cellOpera:function () {
        let param = {
          path:'billDetails'
        }
        if(this.activeView===1){
          param.query={
            tab:'收款信息'
          }
        }else {
          param.query={
            tab:'付款信息'
          }
        }
        this.$router.push(param)
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
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";

  .contract-msglist{
    >li{
      text-align: left;
      >span{
        color: @color-blue;
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
  .view-context{
    background-color: @color-white;
    padding: 20px;
    /deep/ .theader-bg{
      >th{
        background-color: @bg-th;
      }
    }
  }
</style>
