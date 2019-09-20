<template>
<div class="view">
  <ScreeningTop @propResetFormFn="reset" @propQueryFn="getData('search')">
    <div class="content">
      <div class="input-group">
        <label>关键字:</label>
        <el-tooltip content="收款ID/合同编号/纸质合同编号/房源编号/物业地址" placement="top">
          <el-input class="w200" :clearable="true" size="small" v-model="searchForm.keyword" placeholder="请输入"></el-input>
        </el-tooltip>
      </div>
      <div class="input-group">
        <label>查询时间:</label>
        <el-date-picker
          v-model="searchForm.timeRange"
          type="daterange"
          size="small"
          class="margin-left"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="input-group">
        <label>收付状态:</label>
        <el-select :clearable="true" size="small" v-model="searchForm.checkStatus" placeholder="请选择">
          <el-option
            v-for="item in dictionary['62']"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
      </div>
    </div>
  </ScreeningTop>
  <component v-bind:is="activeComponent" :list="list"></component>
  <el-pagination
    v-if="list.length>0"
    class="pagination-info"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-size="pageSize"
    layout="total, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
</div>
</template>

<script>
  import {MIXINS} from "@/assets/js/mixins";

  const receiptCheck_xf =()=>import('@/pages/finance/receiptCheck/receiptCheck_xf');
  const receiptCheck_cz =()=>import('@/pages/finance/receiptCheck/receiptCheck_cz');
  const receiptCheck_jr =()=>import('@/pages/finance/receiptCheck/receiptCheck_jr')

  export default {
    name: "receipt-check",
    mixins: [MIXINS],
    components:{receiptCheck_xf,receiptCheck_cz,receiptCheck_jr},
    data(){
      return {
        activeComponent:'receiptCheck_xf',
        searchForm: {
          contType: [],
          timeType: '',
          depName:'',
          deptId: '',
          empId: '',
          billStatus: '',
          proAccount: '',
          checkStatus: '',
          moneyType: '',
          payMethod: '',
          keyword: '',
          timeRange:'',
          payObjType:'',
          cooperation:'',
          recordType:'',
        },
        list: ['a','b','c'],
        dictionary: {
          '23': ''
        },
        //分页
        total:0,
        currentPage:1,
        pageSize:10,
        //权限配置
        power: {
          'sign-cw-rev-query': {
            state: false,
            name: '查询'
          },
          'sign-cw-rev-export': {
            state: false,
            name: '导出'
          },
          'sign-cw-rev-void': {
            state: false,
            name: '作废'
          },
          'sign-cw-pay-query':{
            state: false,
            name: '查询'
          },
          'sign-cw-pay-export': {
            state: false,
            name: '导出'
          },
          'sign-cw-pay-void': {
            state: false,
            name: '作废'
          },
          'sign-cw-debt-invoice': {
            state: false,
            name: '开票'
          },
          'sign-cw-bill-print':{
            state: false,
            name: '打印'
          },
          'sign-cw-debt-pay': {
            state: false,
            name: '付款详情'
          },
          'sign-cw-debt-rev': {
            state: false,
            name: '收款详情'
          },
          'sign-com-htdetail': {
            state: false,
            name: '合同详情'
          },
          'sign-com-house': {
            state: false,
            name: '房源详情'
          },
          'sign-com-cust': {
            state: false,
            name: '客源详情'
          }
        }
      }
    },
    created(){
      let state = this.getPath.every(item=>{
        return ['新房','长租','金融'].includes(item.name)
      })
      if(!state){
        this.getPath.unshift({name: '新房',path:this.$route.fullPath})//unshift方法返回数组的长度
        this.setPath(this.getPath)
        this.list.push(this.$route.query.type)
      }
      this.activeComponent=`receiptCheck_${this.$route.query.type}`
    },
    methods:{
      reset:function () {
        this.$tool.clearForm(this.searchForm)
      },
      getData: function (type='init') {
        if(type==='search'){
          this.currentPage=1
        }
        let param = JSON.parse(JSON.stringify(this.searchForm))
        if(typeof param.timeRange==='object'&&Object.prototype.toString.call(param.timeRange)==='[object Array]'){
          param.startTime = param.timeRange[0]
          param.endTime = param.timeRange[1]
        }
        param.contTypes = param.contType.join(',')
        param.pageNum = this.currentPage
        param.pageSize = this.pageSize
        delete param.contType
        delete param.timeRange

        //点击查询时，缓存筛选条件
        if(type==='search'||type==='pagination'){
          sessionStorage.setItem('sessionQuery',JSON.stringify({
            path:this.$route.fullPath,
            url:'',
            query:Object.assign({},param)
          }))
        }

        let url = ''
        this.$ajax.get(`/api${url}`,param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.list = res.data.page.list
            this.total = res.data.page.total
          }
        }).catch(error => {
          this.$message({
            message:error
          })
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getData('pagination')
      },
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
        /*/deep/ .el-select, .el-input {
          flex: 1;
        }*/
      }
    }
  }
</style>
