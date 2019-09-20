<template>
  <el-table ref="tableCom" class="info-scrollbar" :data="tableDate" style="width: 100%" @row-dblclick='toDetail' border>
    <el-table-column align="center" label="合同信息" min-width="200" fixed>
      <template slot-scope="scope">
        <ul class="contract-msglist">
          <li>合同：<span class="blueColor" @click="toDetail(scope.row)">{{scope.row.code}}</span></li>
          <li>纸质合同编号：<span class="blueColor" @click="toDetail(scope.row)">{{scope.row.pCode}}</span></li>
        </ul>
      </template>
    </el-table-column>

    <el-table-column align="center" label="项目类型" prop="contType.label" min-width="100">
    </el-table-column>

    <el-table-column align="center" label="放款日期" prop="recordType.label" min-width="100">
    </el-table-column>

    <el-table-column align="center" label="放款金额(元)" prop="dealPrice" min-width="90">
      <template slot-scope="scope">
        <span>{{scope.row.dealPrice}}元</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="期限开始时间" prop="recordType.label" min-width="100">
    </el-table-column>

    <el-table-column align="center" label="期限结束时间" prop="recordType.label" min-width="100">
    </el-table-column>

    <el-table-column align="center" label="收入金额(元)" min-width="100">
      <template slot-scope="scope">
        <span>{{scope.row.receivedCommission}}/{{scope.row.receivableCommission}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="金融成本比例" min-width="100">
      <template slot-scope="scope">
        <span>-</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="金融成本(元)" min-width="100">
      <template slot-scope="scope">
        <span>-</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="实收佣金(元)" min-width="100">
      <template slot-scope="scope">
        <span>-</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="杂费(元)" min-width="80">
      <template slot-scope="scope">
        <span>-</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="收佣状态" min-width="80">
      <template slot-scope="scope">
        <span>-</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="财务收款" min-width="80">
      <template slot-scope="scope">
        <div class="btn" @click="gathering(scope.row)">收款</div>
      </template>
    </el-table-column>

    <el-table-column align="center" label="金融专员" min-width="120">
      <template slot-scope="scope">
        <p>{{scope.row.dealAgentStoreName}}</p>
        <p>{{scope.row.dealAgentName}}</p>
      </template>
    </el-table-column>

    <el-table-column align="center" label="经办人" min-width="120">
      <template slot-scope="scope">
        <p>{{scope.row.dealAgentStoreName}}</p>
        <p>{{scope.row.dealAgentName}}</p>
      </template>
    </el-table-column>

    <el-table-column align="center" label="受理人" min-width="120">
      <template slot-scope="scope">
        <p>{{scope.row.dealAgentStoreName}}</p>
        <p>{{scope.row.dealAgentName}}</p>
      </template>
    </el-table-column>

    <el-table-column align="center" label="成交经纪人" min-width="120">
      <template slot-scope="scope">
        <p>{{scope.row.dealAgentStoreName}}</p>
        <p>{{scope.row.dealAgentName}}</p>
      </template>
    </el-table-column>

    <el-table-column align="center" label="店长" min-width="80">
      <template slot-scope="scope">
          <span v-if="scope.row.contType.value<4">{{scope.row.distributableAchievement}}</span>
          <span v-else>-</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="岗位名称" min-width="70">
      <template slot-scope="scope">
        <span>{{scope.row.contState.label}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="客户姓名" min-width="70">
      <template slot-scope="scope">
        <span>{{scope.row.contState.label}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="所属区域">
      <template slot-scope="scope">
        <span>{{scope.row.printCount}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="房源编号">
      <template slot-scope="scope">
        <span>{{scope.row.printCount}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="产权地址">
      <template slot-scope="scope">
        <span>{{scope.row.printCount}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>
           
<script>
export default{
  props:{
    tableDate:{
      type: Array,
      default() {
        return []
      }
    }
  },
  methods:{
    //收款
    gathering(val){
      this.$emit('getMoney',val)
    },
    toDetail(){

    },
  }             
}
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.contract-msglist {
  > li {
    text-align: left;
    .blueColor{
      color: @color-blue;
      cursor: pointer;
    }
  }
}   
</style>