<template>
  <div class="view">
    <!--<preview></preview>-->
    <ScreeningTop @propResetFormFn="reset" @propQueryFn="getData">
      <div class="content">
        <div class="input-group">
          <label>收付款类:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.moneyType" placeholder="请选择">
            <el-option
              v-for="item in dictionary['25']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>收款状态:</label>
          <el-select :clearable="true" size="small" v-model="searchForm.receiveAmountState" placeholder="请选择">
            <el-option
              v-for="item in dictionary['23']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="input-group">
          <label>部门:</label>
          <el-select :clearable="true" size="small" filterable remote :loading="Loading" :remote-method="remoteMethod" @change="getEmploye" v-model="searchForm.dealAgentStoreId" placeholder="请选择">
            <el-option
              v-for="item in DepList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select :clearable="true" size="small" v-model="searchForm.dealAgentId" placeholder="请选择">
            <el-option
              v-for="item in EmployeList"
              :key="item.empId"
              :label="item.name"
              :value="item.empId">
            </el-option>
          </el-select>
        </div>
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
          <el-input :clearable="true" size="small" v-model="searchForm.keyword" placeholder="合同编号/房源编号/客源编号/物业地址/客户/房产证号/手机号"></el-input>
        </div>
      </div>
    </ScreeningTop>
    <div class="view-context">
      <div class="table-tool">
        <h4><i class="iconfont icon-tubiao-11"></i>数据列表</h4>
        <p>
          <el-button round size="small" type="primary">导出</el-button>
        </p>
      </div>
      <el-table :data="list" style="width: 100%" header-row-class-name="theader-bg">
        <el-table-column min-width="200" align="center" label="合同信息" prop="cityName" :formatter="nullFormatter">
          <template slot-scope="scope">
            <ul class="contract-msglist">
              <li>合同编号:<span>{{scope.row.code}}</span></li>
              <li>房源编号:<span>{{scope.row.houseinfoCode}}</span></li>
              <li>客源编号:<span>{{scope.row.guestinfoCode}}</span></li>
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
  import {MIXINS} from "@/assets/js/mixins";

  export default {
    name: "actual-harvest",
    mixins: [MIXINS,FILTER],
    data() {
      return {
        dictionary:{
          '10': '',
          '23': '',
          '25': '',
        },
        searchForm: {
          moneyType: '',
          contType: '',
          dealAgentStoreId: '',
          dealAgentId: '',
          receiveAmountState:'',
          signTime: '',
          collectionTime: '',
          keyword: ''
        },
        list: [],
        //分页
        pageSize:10,
        pageNum:1
      }
    },
    created() {
      this.getData()
      this.getDictionary()
    },
    methods: {
      reset:function () {
        this.$tool.clearForm(this.searchForm)
      },
      getData: function () {
        // let param={}
        let param=Object.assign({},this.searchForm)
        if(typeof param.signTime==='object'&&Object.prototype.toString.call(param.signTime)==='[object Array]'){
          param.beginDate = param.signTime[0]
          param.endDate = param.signTime[1]
        }
        if(typeof param.collectionTime==='object'&&Object.prototype.toString.call(param.collectionTime)==='[object Array]'){
          param.beginProDate = param.collectionTime[0]
          param.endProDate = param.collectionTime[1]
        }
        delete param.signTime
        delete param.collectionTime
        delete param.moneyType
        param.pageNum=this.pageNum
        param.pageSize=this.pageSize
        this.$ajax.put('/api/payInfo/receivables',param,1).then(res => {
          res = res.data
          if (res.status === 200) {
            this.list = res.data.list
          }
        }).catch(error => {
          console.log(error)
        })
      },
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
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
        /deep/ .el-select, .el-input {
          flex: 1;
        }
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
  }
  .table-tool{
    height: 60px;
    position: relative;
    display: flex;
    align-items: center;
    >h4{
      >i{
        margin-right: 8px;
      }
    }
    >p{
      position: absolute;
      top: 50%;
      right: 0;
      transform:translateY(-50%);
    }
  }
</style>
