<template>
    <div class="view-container" ref="tableComView">
        <ScreeningTop
        @propQueryFn="queryFn"
        @propResetFormFn="resetFormFn">
            <el-form  class="header" ref="propForm" size="small">
                <div class="content">
                     <el-form-item label="关键字">
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="合同编号/纸质合同编号/物业地址"
                            placement="top"
                        >
                            <el-input v-model="keyword"  size="small"></el-input>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="签约日期">
                        <el-date-picker
                        v-model="searchTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        value-format="yyyy-MM-dd"
                        end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="部门" class="dep">
                         <select-tree :data="DepList" :init="departmentName" @checkCell="depHandleClick" @clear="clearDep" @search="searchDep"></select-tree>
                        <el-select v-model="depUser" style="margin-left:10px" :clearable="true" @change="handleEmpNodeClick" v-loadmore="moreEmploye" filterable placeholder="请选择">
                            <el-option
                                v-for="item in EmployeList"
                                :key="item.empId"
                                :label="item.name"
                                :value="item.empId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="合同类型">
                        <el-select v-model="contType" clearable  placeholder="请选择">
                            <el-option v-for="item in dictionary['10']" v-if="[1,2,3,6].includes(item.key)" :key="item.value" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="变更/解约">
                        <el-select v-model="contStatus" filterable clearable placeholder="请选择">
                            <el-option v-for="item in dictionary['6']" :key="item.value" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="签约方式">
                        <el-select v-model="signType" clearable placeholder="请选择">
                            <el-option v-for="item in dictionary['64']" :key="item.value" :label="item.value" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="在职状态">
                        <el-select v-model="jobStatus" clearable placeholder="请选择">
                            <el-option v-for="item in dictionary['20']" :key="item.value" :label="item.value" :value="{'label':item.value,'value':item.key}"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
        </ScreeningTop>
        <div class="table-list">
            <div class="table_title">
                <span><i class="iconfont icon-tubiao-11 mr-8"></i>数据列表</span>
                <div style="display:flex" class="pp">
                    <div><span>佣金支付费合计：{{achList.length>0?achList[0].commissionPayments:0}}元</span><span>权证费用合计：{{achList.length>0?achList[0].warrantFees:0}}元</span><span>签约总单数： {{achList.length>0?achList[0].amounts:0}}</span><span>合同业绩合计：{{achList.length>0?achList[0].contractAchievements:0}}元 </span><span>实收业绩合计：{{achList.length>0?achList[0].achievementActuals:0}}元</span></div>
                    <div>          
                        <el-button
                        round
                        type="primary"
                        size="medium"
                        @click="getExcel"
                        style="padding:9px 15px;min-width: 80px;"
                    >导出</el-button></div>
                </div>
            </div>
            <el-table :data="achList" ref="tableCom" style="width: 100%" border :max-height="tableNumberCom">
                <el-table-column label="合同编号" width="200">
                    <template slot-scope="scope">
                        <p>合同编号：<span>{{scope.row.code}}</span></p>
                        <p v-show="scope.row.recordType&&scope.row.recordType.value==2">纸质合同编号：<span>{{scope.row.pCode}}</span></p>
                        <p></p>
                    </template>
                </el-table-column>
                <el-table-column  label="佣金支付费（元）">
                    <template slot-scope="scope">
                        {{scope.row.commissionPayment}}
                    </template>
                </el-table-column>
                <el-table-column  label="权证费用（元）">
                    <template slot-scope="scope">
                        {{scope.row.warrantFee}}
                    </template>
                </el-table-column>
                <el-table-column  label="签约方式">
                    <template slot-scope="scope">
                        <span>{{scope.row.recordType&&scope.row.recordType.label?scope.row.recordType.label:'-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="合同类型"  prop="contType.label"></el-table-column>
                <el-table-column label="合同状态"  prop="contState.label"></el-table-column>
                <el-table-column label="签约日期" >
                    <template slot-scope="scope">
                        {{scope.row.signDate | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="物业地址"  prop="propertyDddr" width="200"></el-table-column>
                <el-table-column label="签约单数" prop="amount"></el-table-column>
                <el-table-column label="分成人" prop="assignor" ></el-table-column>
                <el-table-column label="在职状态" prop="jobStatus.label"  ></el-table-column>
                <el-table-column label="分成门店" prop="level4"  ></el-table-column>
                <el-table-column label="角色类型" prop="roleType.label"  ></el-table-column>
                <el-table-column label="分成比例(%)" prop="ratio"  ></el-table-column>
                <el-table-column prop="contractAchievement" >
                    <template slot="header" slot-scope="scope">
                        合同业绩（元）
                        <el-tooltip content="（总佣金-佣金支付费-第三方合作费-权证费用）×分成比例" placement="top">
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column  prop="achievementActual">
                      <template slot="header" slot-scope="scope">
                        实收业绩（元）
                        <el-tooltip content="（合同实收-佣金支付费-第三方合作费-权证费用）×分成比例" placement="top">
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        </div>
        </div>

    </div>
</template>

<script>
    import ScreeningTop from '@/components/ScreeningTop';
    import { MIXINS } from "@/assets/js/mixins";
    import {FILTER} from "@/assets/js/filter";
    var param={}
    export default {
        mixins: [MIXINS,FILTER],
        data() {
            return {
                Loading:false,
                departmentName:'',
                department: [],
                keyword: "",
                searchTime: [],
                tableData: [],
                contType:'',
                contStatus:'',
                signType:'',
                jobStatus:'',
                pageSize: 10,
                empName:'',
                pageNum: 1,
                total:0,
                dictionary: {
                    "10": "", //合同类型（筛选条件）
                    "9": "", //合同状态
                    "64": "", //签约方式  线上线下
                    "20":'',  //在职状态
                    "6":'',
                },
                users:[],
                type:[],
                depUser:'',
                achList:[],
                inTime:1,
                 power: {
                    'sign-set-log-query': {
                        state: false,
                        name: '查询'
                    },
                 }
            }
        },
         created(){
            this.getDictionary()
            this.getAchList2()
            this.initTimePicker()
        },
        mounted() {
            this.remoteMethod('power')
        },
        methods: {
            initTimePicker(){
                var date = new Date();
                date = date.setDate(1);
                date = this.$tool.dateFormat(date)
                var date2 = this.$tool.dateFormat(Date.now())
                this.$nextTick(()=>{
                this.searchTime=[date, date2]
                })
            },
            getAchList(){
                let param={
                    keyword:this.keyword,
                    startTime:this.searchTime&&this.searchTime.length!=0?this.searchTime[0]:'',
                    endTime:this.searchTime&&this.searchTime.length!=0?this.searchTime[1]:'',
                     depId:this.department,
                     empId:this.depUser,
                     tradeTypes:this.contType,
                     status:this.contStatus,
                     recordType:this.signType,
                     isJob:this.jobStatus.value,
                     pageNum:this.pageNum,
                     pageSize:this.pageSize,
                }
                this.$ajax.get('/api/achievementSheet/getAchievementContractSumList',param).then(res=>{
                    res=res.data
                    if(res.status==200){
                        this.achList=res.data.list
                        this.total=res.data.total
                    }
                }).catch(err => {
                    // debugger
                 this.$message.error(err);
                 });
            },
            getAchList2(){
                let param={
                    keyword:this.keyword,
                     depId:this.department,
                     empId:this.depUser,
                     tradeTypes:this.contType,
                     status:this.contStatus,
                     recordType:this.signType,
                     isJob:this.jobStatus.value,
                     pageNum:this.pageNum,
                     pageSize:this.pageSize,
                }
                this.$ajax.get('/api/achievementSheet/getAchievementContractSumList',param).then(res=>{
                    res=res.data
                    if(res.status==200){
                        this.achList=res.data.list
                        this.total=res.data.total
                    }
                }).catch(err => {
                    // debugger
                 this.$message.error(err);
                 });
            },
            getExcel(){
                let param={
                    keyword:this.keyword,
                    startTime:this.searchTime&&this.searchTime.length!=0?this.searchTime[0]:'',
                    endTime:this.searchTime&&this.searchTime.length!=0?this.searchTime[1]:'',
                     depId:this.department,
                     empId:this.depUser,
                     tradeTypes:this.contType,
                     status:this.contStatus,
                     recordType:this.signType,
                     isJob:this.jobStatus.value,
                     pageNum:this.pageNum,
                     pageSize:this.pageSize
                }
                this.excelCreate("/input/AchievementContractExcel", param);
            }, 
            searchDep:function (payload) {
                /*this.DepList=payload.list
                this.departmentName=payload.depName*/
            },
            depHandleClick(data) {
                this.depUser=''
                this.department=data.depId
                this.departmentName=data.name
                this.handleNodeClick(data)
            },
            clearDep:function () {
                    this.depUser=''
                    this.department=''
                    this.departmentName=''
                    // this.EmployeList=[]
            },
            handleSizeChange (val) {

            },
            handleCurrentChange (val) {
                this.pageNum = val
                this.getAchList()
            },
        
            // 重置
            resetFormFn() {
                this.pageNum=1
                this.keyword=''
                this.searchTime='',
                this.depUser='',
                this.department=''
                this.contType='',
                this.contStatus='',
                this.signType='',
                this.jobStatus='',
                this.departmentName=''
                this.inTime=2
                this.EmployeList = []
            },
            // 查询
            queryFn(){
                this.pageNum = 1
                this.getAchList()
            },
        },
        components:{
            ScreeningTop
        },
        computed: {
            version() {
                return this.getUser.version
            },
            userInfo() {
                return this.getUser.user
            }
        }
    }
</script>

<style lang="less" scoped>
.pp{
    width: calc(100% - 110px);
    justify-content: space-between;
    margin-left: 0!important;
}
.header {
    background-color: #fff;
    border-radius:2px;
    box-sizing: border-box;
    .form-title {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        div {
            > .el-button {
                width: 100px;
                height: 36px;
                border-radius:14px;
            }
        }
    }
    .content {
        display: flex;
        font-weight: normal;
        flex-wrap: wrap;
        > .el-form-item {
            display: flex;
            margin-right: 30px;
            &:nth-child(2) /deep/ .el-form-item__content{
                display: flex;
                span{
                    margin-right: 5px;
                }
            }
        }
    }
}

.table-list {
    background-color: #fff;
    margin: 0 10px;
    padding-top: 10px;
    .table_title{
        padding: 6px 0;
        display: flex;
        div{
            margin-left: 30px;
            span{
                &:first-of-type{
                    margin: 0;
                }
                margin: 0 15px;
                color: #f56c6c;
            }
        }
    }
}

/deep/ .el-table th {
  background:rgba(238,242,251,1);
}
/deep/ .el-pagination{
    text-align: right;
}
.el-select-dropdown__item.selected {
    font-weight: normal;
}
/deep/ .dep .el-form-item__content{
    display: flex
}
.mr-8{
    margin-right: 8px;
}
</style>
