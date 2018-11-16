<template>
  <div class="view">
    <ScreeningTop>
      <div class="content">
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
          <label>收款状态:</label>
          <el-select size="small" v-model="searchForm.status" placeholder="请选择">
            <el-option
              v-for="item in 5"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>部门:</label>
          <el-select size="small" v-model="searchForm.proceedsStore" placeholder="请选择">
            <el-option
              v-for="item in 5"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>合同类型:</label>
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
          <label>签约时间:</label>
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
          <label>收款时间:</label>
          <div class="time-picker">
            <el-date-picker
              v-model="searchForm.collectionTime"
              type="daterange"
              size="small"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <div class="input-group">
          <label>关键字:</label>
          <el-input size="small" v-model="searchForm.keyword" placeholder="合同编号/房源编号/客源编号/物业地址/客户/房产证号/手机号"></el-input>
        </div>
      </div>
    </ScreeningTop>
    <div class="view-context">
      <el-table :data="list" style="width: 100%" header-row-class-name="theader-bg">
        <el-table-column align="center" label="合同信息" prop="cityName" :formatter="nullFormatter">
          <template slot-scope="scope">
            <ul>
              <li>合同编号:<span>{{scope.row.contractId}}</span></li>
              <li>房源编号:<span>{{scope.row.houseId}}</span></li>
              <li>客源编号:<span>{{scope.row.customerId}}</span></li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column align="center" label="合同类型" prop="contractType" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="款类" prop="collectionType" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="成交经纪人" prop="broker" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="应收款（元）" prop="accounts_receivable" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="已收款（元）" prop="for_collection" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="待收款（元）" prop="useNum" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="操作时间" prop="operation time" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="收款状态" prop="state" :formatter="nullFormatter"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";

  export default {
    name: "actual-harvest",
    mixins: [FILTER],
    data() {
      return {
        searchForm: {
          moneyType: '',
          status: '',
          proceedsStore: '',
          contractType: '',
          signTime: '',
          collectionTime: '',
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
    },
    methods: {
      getData: function () {
        let param={
          moneyType: this.searchForm.moneyType,
          status: this.searchForm.status,
          proceedsStore: this.searchForm.proceedsStore,
          contractType: this.searchForm.contractType,
          operatingTimeQUERY:this.searchForm.moneyType,
          proceedsTimeQUERY:this.searchForm.moneyType,
          keyword: this.searchForm.keyword
        }
        this.$ajax.get('/api/finance/listCollection',param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.list = res.data.list
          }
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";

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
