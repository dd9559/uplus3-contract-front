<template>
  <div class="view-container">
    <el-table :data="tableData" border>
      <el-table-column align="left" label="合同编号" prop="outStoreName">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.startTime|timeFormat_}}</span> ~ -->
          <span @click="toDetail(scope.row)">{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="合同类型" prop="outBankCard">
      </el-table-column>
      <el-table-column align="left" label="成交总价" prop="inStoreName">
      </el-table-column>
      <el-table-column align="left" label="成交经纪人" prop="inStoreName">
      </el-table-column>
      <el-table-column align="left" label="当期实收(元)" prop="inStoreName">
      </el-table-column>
      <el-table-column align="left" label="结算比率" prop="inStoreName">
      </el-table-column>
      <el-table-column align="left" label="金融服务费(元)" prop="inStoreName">
      </el-table-column>
      <el-table-column align="left" label="按揭手续费(元)" prop="inStoreName">
      </el-table-column>
      <el-table-column align="left" label="实际结算" prop="inStoreName">
      </el-table-column>
      <el-table-column align="left" label="分成角色">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.startTime|timeFormat_}}</span> ~ -->
          <span>{{scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="分成比率">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.startTime|timeFormat_}}</span> ~ -->
          <span>{{scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="特许服务费(元)" prop="inStoreName">
      </el-table-column>
      <el-table-column align="left" label="当期刷卡手续费(元)" prop="inStoreName">
      </el-table-column>
      <el-table-column align="left" label="当期实收分成(元)" prop="inStoreName">
      </el-table-column>
    </el-table>
    <!-- 固定滚动条 -->
    <div class="pagination" v-if="tableData.length>0">
      <el-pagination
        class="pagination-info"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
           
<script>
export default {
  data(){
    return{
      tableData:[],
      currentPage:1,
      pageSize:10,
      total:0,
      power: {
        'sign-com-htdetail': {
          state: false,
          name: '合同详情'
        }
      }
    }
  },
  created() {
    
  },
  methods:{
    //合同详情页
    toDetail(value) {
      if(this.power['sign-com-htdetail'].state){
        this.setPath(this.$tool.getRouter(['合同','合同列表','合同详情'],'contractList'));
        if(value.contType.value===1||value.contType.value===2||value.contType.value===3){
          this.$router.push({
            path: "/contractDetails",
            query: {
              id: value.id,//合同id
              code: value.code,//合同编号
              contType: value.contType.value//合同类型
            }
          });
        }else{
          this.$router.push({
            path: "/detailIntention",
            query: {
              id: value.id,
              contType: value.contType.value
            }
          });
        }
      }else{
        this.noPower('合同详情查看')
      }
    },
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";

.view-container{
  padding: 10px;
}
/deep/.paper-box {
  padding-top: 10px !important;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 2px;
  box-sizing: border-box;
  box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  .paper-set-tit {
    padding-bottom: 10px;
  }
}
/deep/ .el-table th {
  background: @bg-th;
}
</style>