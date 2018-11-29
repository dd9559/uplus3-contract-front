<template>
  <div class="view-container">
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn" :min="45">
      <el-form :inline="true" :model="searchForm" class="prop-form" size="small">
        <el-form-item label="分账日期">
          <el-date-picker v-model="signDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy/MM/dd" style="width:330px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同类型">
          <el-select v-model="searchForm.contType" placeholder="请选择合同类型" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['10']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select
            v-model="searchForm.dealAgentStoreId"
            :multiple='false'
            clearable
            filterable
            remote
            reserve-keyword
            @change="getBroker"
            placeholder="部门"
            :remote-method="remoteMethod"
            :loading="loading">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                >
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.dealAgentId" placeholder="请选择" style="width:100px">
            <el-option v-for="item in brokersList" :key="item.empId" :label="item.name" :value="item.empId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="keyword" placeholder="合同编号/房源编号/客源编号" style="width:250px"></el-input>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <!-- 列表 -->
    <div class="routing-list">
      <p><span class="title"><i class="iconfont icon-tubiao-11"></i>数据列表</span></p>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column align="left" label="合同编号" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="goContractDetail(scope.row)">{{scope.row.contractCode}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="left" label="合同类型" prop="contType.label" width="100">
        </el-table-column>
        <el-table-column align="left" label="成交总价" prop="price" width="150">
        </el-table-column>
        <el-table-column align="left" label="成交经纪人" width="200">
          <template slot-scope="scope">
            <p>{{scope.row.people}}</p>
            <!-- <p>{{scope.row.dealAgentStoreName}}</p> -->
          </template>
        </el-table-column>
        <el-table-column align="left" label="合作门店" prop="store">
        </el-table-column>
        <el-table-column align="left" label="分账日期" width="150">
          <template slot-scope="scope">
            <!-- {{scope.row.time.substr(0, 10)}} -->
            {{scope.row.time}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="本次实收分成（元）" prop="shishou">
        </el-table-column>
        <el-table-column align="left" label="分账手续费（元）" prop="shouxufei">
        </el-table-column>
        <el-table-column align="left" label="实际到账金额（元）" prop="daozhang">
        </el-table-column>
      </el-table>
      <el-pagination class="pagination-info" @current-change="handleCurrentChange" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
           
<script>
import ScreeningTop from "@/components/ScreeningTop";
import { MIXINS } from "@/assets/js/mixins";

export default {
  mixins: [MIXINS],
  components: {
    ScreeningTop
  },
  data() {
    return {
      searchForm: {},
      signDate: [],
      keyword: "",
      tableData:[
        {contractCode:'M1100221515', contType:{label:'买卖',value:2}, price:'12025102', people:'武汉江岸区当代店最长字符 夏天雨', store:'当代一店',time:'2018/11/20 20:30', shishou:'1231651', shouxufei:'1511', daozhang:'1215613'},
        {contractCode:'M1100221515', contType:{label:'买卖',value:2}, price:'12025102', people:'武汉江岸区当代店最长字符 夏天雨', store:'当代一店',time:'2018/11/20 20:30', shishou:'1231651', shouxufei:'1511', daozhang:'1215613'},
        {contractCode:'M1100221515', contType:{label:'买卖',value:2}, price:'12025102', people:'武汉江岸区当代店最长字符 夏天雨', store:'当代一店',time:'2018/11/20 20:30', shishou:'1231651', shouxufei:'1511', daozhang:'1215613'},
        {contractCode:'M1100221515', contType:{label:'买卖',value:2}, price:'12025102', people:'武汉江岸区当代店最长字符 夏天雨', store:'当代一店',time:'2018/11/20 20:30', shishou:'1231651', shouxufei:'1511', daozhang:'1215613'},
        {contractCode:'M1100221515', contType:{label:'买卖',value:2}, price:'12025102', people:'武汉江岸区当代店最长字符 夏天雨', store:'当代一店',time:'2018/11/20 20:30', shishou:'1231651', shouxufei:'1511', daozhang:'1215613'},
        {contractCode:'M1100221515', contType:{label:'买卖',value:2}, price:'12025102', people:'武汉江岸区当代店最长字符 夏天雨', store:'当代一店',time:'2018/11/20 20:30', shishou:'1231651', shouxufei:'1511', daozhang:'1215613'},
        {contractCode:'M1100221515', contType:{label:'买卖',value:2}, price:'12025102', people:'武汉江岸区当代店最长字符 夏天雨', store:'当代一店',time:'2018/11/20 20:30', shishou:'1231651', shouxufei:'1511', daozhang:'1215613'},
        {contractCode:'M1100221515', contType:{label:'买卖',value:2}, price:'12025102', people:'武汉江岸区当代店最长字符 夏天雨', store:'当代一店',time:'2018/11/20 20:30', shishou:'1231651', shouxufei:'1511', daozhang:'1215613'},
      ],
      currentPage:1,
      total:0,
      dictionary: {
        //数据字典
        "10": "" //合同类型
      },
      loading:false,
      //部门选择列表
      options:[],
      //经纪人列表
      brokersList:[]
    };
  },
  created() {
    this.getDictionary();
  },
  methods: {
    // 查询
    queryFn() {},
    // 重置
    resetFormFn() {},
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    //合同详情
    goContractDetail(item){
      console.log('111')
    },
    //获取当前部门
    getDeps(key){
      let param = {
        keyword:key
      }
      this.$ajax.get('/api/access/deps', param).then(res=>{
        this.loading=false;
        res=res.data
        if(res.status===200){
          this.options=res.data
        }
      })
    },
    remoteMethod(query){
      if (query !== '') {
        this.loading = true;
        this.getDeps(query)
      } else{

      }
    },
    getBroker(id){
      console.log(id)
      let param = {
        depId:id
      }
      this.$ajax.get('/api/organize/employees', param).then(res=>{
        res=res.data
        if(res.status===200){
          this.brokersList=res.data
        }
      })
    },
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.routing-list {
  margin-top: 20px;
  background-color: #fff;
  padding: 10px;
  border-radius: 2px;
  box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  >p{
    padding: 10px 0 20px 0;
    .title{
      padding-left: 10px;
      i{
        padding-right: 10px;
      }
    }
  }
  
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