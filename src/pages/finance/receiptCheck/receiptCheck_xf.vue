<template>
  <div class="content">
    <el-table class="info-scrollbar" ref="tableCom" :max-height="tableNumberCom" border :data="getList" header-row-class-name="theader-bg" style="width: 100%;max-height:500px;" @row-dblclick="toDetails">
      <el-table-column align="center" min-width="120" label="收款ID" prop="payCode"
                       :formatter="nullFormatter"></el-table-column>
      <el-table-column align="center" label="合同信息" min-width="200px" prop="cityName" :formatter="nullFormatter">
        <template slot-scope="scope">
          <ul class="contract-msglist">
            <li>合同:<span @click="toLink(scope.row,'cont')">{{scope.row.contCode}}</span></li>
            <li class="code-paper">纸质合同编号:<span @click="toLink(scope.row,'cont')">{{scope.row.paperCode|getLabel}}</span></li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="120" label="项目名称" prop="address"
                       :formatter="nullFormatter"></el-table-column>
      <el-table-column align="center" min-width="60" label="签约日期" prop="contType" :formatter="nullFormatter"></el-table-column>
      <el-table-column align="center" min-width="60" label="成交总价" prop="recordType" :formatter="nullFormatter"></el-table-column>
      <el-table-column align="center" min-width="60" label="实收/应收（佣金)" prop="moneyType" :formatter="nullFormatter"></el-table-column>
      <el-table-column align="center" min-width="80" label="收佣状态"></el-table-column>
      <el-table-column align="center" min-width="60" label="成交经纪人">
        <template slot-scope="scope">
          <span>{{scope.row.type===1?scope.row.outObjType:scope.row.inObjType|getLabel}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="店长" min-width="120">
        <template slot-scope="scope">

        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="客户姓名"></el-table-column>
      <el-table-column align="center" min-width="80" label="产权地址"></el-table-column>
      <el-table-column align="center" min-width="80" label="户型"></el-table-column>
      <el-table-column align="center" min-width="80" label="建筑面积（㎡）"></el-table-column>
      <el-table-column align="center" min-width="80" label="收款人"></el-table-column>
      <el-table-column align="center" label="当前审核人" min-width="120">
        <template slot-scope="scope">
          <p v-if="!scope.row.auditStore&&!scope.row.auditName">-</p>
          <template v-else>
            <span>{{scope.row.auditStore}}</span>
            <p>{{scope.row.auditName}}</p>
          </template>
          <p class="btn-text-info" type="text" v-if="getUser.user&&(getUser.user.empId===scope.row.preAuditId||getUser.user.empId===scope.row.auditBy)&&scope.row.checkStatus&&scope.row.checkStatus.value===0" @click="choseCheckPerson(scope.row,getUser.user.empId===scope.row.auditBy?2:1)">{{getUser.user.empId===scope.row.auditBy?'转交审核人':'设置审核人'}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下一步审核人" min-width="120">
        <template slot-scope="scope">
          <p v-if="!scope.row.nextAuditStore&&!scope.row.nextAuditName">-</p>
          <template v-else>
            <span>{{scope.row.nextAuditStore}}</span>

            <p>{{scope.row.nextAuditName}}</p>
          </template>
          <p class="btn-text-info color-red" type="text" v-if="getUser.user&&(scope.row.nextAuditId!==0&&getUser.user.empId===scope.row.auditBy)&&scope.row.checkStatus&&scope.row.checkStatus.value===0" @click="choseCheckPerson(scope.row,3)">设置审核人</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" :formatter="nullFormatter" min-width="90">
        <template slot-scope="scope">
          <span>{{scope.row.createTime|formatTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="收款时间" prop="toAccountTime" :formatter="nullFormatter" min-width="90">
        <template slot-scope="scope">
          <span>{{scope.row.toAccountTime|formatTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80" label="状态" prop="payStatus">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" min-width="120">
        <template slot-scope="scope">
          <template v-if="scope.row.auditButton">
            <el-button type="text" @click="cellOpera(scope.row)" v-if="scope.row.auditButton">审核</el-button>
            <el-button type="text" @click="cellOpera(scope.row,'del')">编辑</el-button>
          </template>
          <span v-else>--</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {MIXINS} from "@/assets/js/mixins";
  import {FILTER} from "@/assets/js/filter";
  import {receiptCheck} from "./check";

  export default {
    mixins:[MIXINS,FILTER,receiptCheck],
  }
</script>

<style scoped>

</style>
