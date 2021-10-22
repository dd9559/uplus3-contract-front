<template>
  <div class="view-container">
    <div class="title-box">
      <el-button round type="primary" size="medium" @click="getExcel" v-dbClick v-if="(type == 1 && power['sign-ht-fz-export'].state) || (type == 2 && power['sign-ht-dk-export'].state)" style="padding:9px 15px;min-width: 80px;">导出</el-button>
    </div>
    <el-table :data="tableData" border>
      <el-table-column align="left" label="合同编号" width="140">
        <template slot-scope="scope">
          <span>{{scope.row.contractCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="结算日期">
        <template slot-scope="scope">
          {{scope.row.settleDate|timeFormat_}}
        </template>
      </el-table-column>
      <el-table-column align="left" label="合同类型">
        <template slot-scope="scope">
          <span v-if="scope.row.loanType">{{scope.row.loanType===7?"全款买卖":"贷款买卖"}}</span>
          <span v-else>{{scope.row.contType.label}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="addres" label="物业地址">
      </el-table-column>
      <el-table-column align="left" prop="platformFee" label="平台费（元）">
        <template slot-scope="scope">
          {{scope.row.platformFee|fomatFloat}}
        </template>
      </el-table-column>
      <el-table-column align="left" prop="enterpriseFee" label="企业管理费">
        <template slot-scope="scope">
          {{scope.row.enterpriseFee|fomatFloat}}
        </template>
      </el-table-column>
      <el-table-column align="left" label="分成人" min-width="120">
        <template slot-scope="scope">
          {{scope.row.distributionStoreName+' - '+scope.row.distributionName}}
        </template>
      </el-table-column>
      <el-table-column align="left" label="业绩分成比例">
        <template slot-scope="scope">
          {{scope.row.distributionRatio}}%
        </template>
      </el-table-column>
      <el-table-column align="left" label="分成角色">
        <template slot-scope="scope">
          {{scope.row.roleType.label}}
        </template>
      </el-table-column>
      <el-table-column align="left" prop="settleMoney" label="分账金额">
        <template slot-scope="scope">
          {{scope.row.settleMoney|fomatFloat}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { MIXINS } from "@/assets/js/mixins";

export default {
   mixins: [MIXINS],
  data(){
    return{
      tableData:[],
      ids:'',
      type:'',
      isOpen:true,
      isOpen_:true,
      dictionary: {
        //数据字典
        "507": ""
      },
      power: {
        'sign-ht-fz-pay': {
          state: false,
          name: '确认打款'
        },
        'sign-com-htdetail': {
          state: false,
          name: '合同详情'
        },
        'sign-ht-fz-export': {
          state: false,
          name: '分账导出'
        },
        'sign-ht-dk-export':{
            name:'打款导出',
            state:false,
        }
      }
    }
  },
  created() {
    this.ids = this.$route.query.ids;
    this.type = parseInt(this.$route.query.type);
    this.getDictionary();//字典
    if(this.type===1){
      this.setPath(this.$tool.getRouter(['财务','分账记录','分账明细'],'routingRecord'));
    }else if(this.type===2){
      this.setPath(this.$tool.getRouter(['财务','打款记录','打款明细'],'debitRecord'));
    }
    this.getAccountList(this.ids);
  },
  beforeRouteEnter(to,from,next){
    next(em=>{
      if(from.path==='/contractDetails'){
        if(em.type===1){
          em.setPath(em.$tool.getRouter(['财务','分账记录','分账明细'],'routingRecord'));
        }else if(em.type===2){
          em.setPath(em.$tool.getRouter(['财务','打款记录','打款明细'],'debitRecord'));
        }
      }
    })
  },
  filters: {
    //运算时四舍五入保留两位小数 num为传入的值，n为保留的小数位
    fomatFloat: function (num, decimal = 2) {
      decimal = Number('1'.padEnd(decimal+1,0))
      num = Math.round(parseFloat(num) * decimal) / decimal
      num = num.toString();
      let i = 0;
      let index = num.indexOf(".");
      let decimal2,
          num2;
      if (index !== -1) {
        decimal2 = num.substring(index+1).padEnd(2,0);
        num2 = num.substring(0,index)
      } else {
        num2 = num.substring(0);
        decimal2 = '0'.padEnd(2,0)
      }
      return `${num2}.${decimal2}`;
    },
    timeFormat_: function (val) {
      if (!val) {
        return '--'
      } else {
        let time = new Date(val)
        let y = time.getFullYear()
        let M = time.getMonth() + 1
        let D = time.getDate()
        let h = time.getHours()
        let m = time.getMinutes()
        let s = time.getSeconds()
        let time_ = `${y}-${M > 9 ? M : '0' + M}-${D > 9 ? D : '0' + D} ${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`;
        return time_.substr(0, 10)
      }
    }
  },
  methods:{
    // 导出功能
    getExcel() {
        if (this.tableData.length === 0) return this.$message.warning('没有可导出的数据!')
        let url = ''
        if(this.type===1){
          url='/input/proateNotesExcel';
        }else if(this.type===2){
          url='/input/payNotesExcel'
        }
        this.excelCreate(url, {relationId:this.ids})
    },
    //分账明细列表
    getAccountList(ids){
      let param = {
        relationId:ids
      };
      let url = '/api/settlement/getProateNotes';
      // if(this.type===1){
      //   url='/api/settlement/getProateNotes';
      // }else if(this.type===2){
      //   url='/api/settlement/getProateNotes'
      // }
      this.$ajax.get(url,param).then(res=>{
        res=res.data;
        if(res.status===200){
          this.tableData=res.data;
        }
      })
    },
    openAll(){
      this.isOpen=!this.isOpen;
    },
    openAll_(){
      this.isOpen_=!this.isOpen_;
    }
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";

.view-container{
  padding: 10px;
  .title-box {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 10px;
  }
}
.contractCode{
  cursor: pointer;
  color: @color-blue;
}
/deep/.paper-box {
  padding-top: 10px !important;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 2px;
  box-sizing: border-box;
  // box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  .paper-set-tit {
    padding-bottom: 10px;
  }
}
/deep/ .el-table th {
  background: @bg-th;
}
.openAll{
  cursor: pointer;
}
</style>
