<template>
  <div class="view">
    <div class="view-header">
      <div class="title">
        <span>筛选条件</span>
        <p>
          <el-button type="primary">重置</el-button>
          <el-button type="primary">查询</el-button>
        </p>
      </div>
      <div class="content">
        <div class="input-group">
          <label>合同类型:</label>
          <el-select v-model="searchForm.moneyType" placeholder="请选择">
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
          <el-select v-model="searchForm.moneyState" placeholder="请选择">
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
          <el-select v-model="searchForm.department" placeholder="请选择">
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
          <el-select v-model="searchForm.contractType" placeholder="请选择">
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
          <el-select v-model="searchForm.contractType" placeholder="请选择">
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
          <el-select v-model="searchForm.contractType" placeholder="请选择">
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
          <el-select v-model="searchForm.contractType" placeholder="请选择">
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
          <el-input v-model="searchForm.keyword" placeholder="合同编号/房源编号/客源编号/物业地址/客户/房产证号/手机号"></el-input>
        </div>
      </div>
    </div>
    <div class="view-context">
      <el-table border :data="list" style="width: 100%" header-row-class-name="theader-bg">
        <el-table-column align="center" label="合同信息" min-width="200px" prop="cityName" :formatter="nullFormatter">
          <template slot-scope="scope">
            <ul class="contract-msglist">
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
    mixins: [FILTER],
    data() {
      return {
        searchForm: {
          moneyType: '',
          moneyState: '',
          department: '',
          contractType: '',
          signStart: '',
          signEnd: '',
          collectionStart: '',
          collectionEnd: '',
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
      this.getData()

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
    background-color: @color-white;
    padding: 20px;
    margin-bottom: 10px;
    border-radius: @border-radius;
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
