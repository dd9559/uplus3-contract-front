<template>
    <div class="paper-set">
        <!-- 筛选 -->
        <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
            <el-form :inline="true" ref="propForm" :model="propForm" class="prop-form" size="small">
                <el-form-item label="关键字" prop="search">
                    <el-autocomplete class="w322" v-model="propForm.search" :fetch-suggestions="querySearch" placeholder="合同编号/物业地址/业主/客户/房产证号/手机号" :trigger-on-focus="false" @select="handleSelect" clearable></el-autocomplete>
                </el-form-item>
                <el-form-item label="查询时间" prop="dateMo">
                    <el-date-picker v-model="propForm.dateMo" class="w330" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <div class="in-block">
                    <el-form-item 
                    label="交易步骤" 
                    prop="late" 
                    class="mr">
                        <el-select 
                        v-model="propForm.late" 
                        placeholder="交易步骤"
                        class="w100">
                            <el-option 
                            v-for="item in rules.late" 
                            :key="'steps'+item.id" 
                            :label="item.name" 
                            :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="lateName">
                        <el-select 
                        v-model="propForm.lateName" 
                        class="w100" 
                        placeholder="状态">
                            <el-option 
                            v-for="item in rules.lateName" 
                            :key="'lateName'+item.key" 
                            :label="item.value" 
                            :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item label="交易流程" prop="time">
                    <el-select v-model="propForm.time" class="w270">
                        <el-option 
                            v-for="item in rules.time" 
                            :key="'time'+item.id" 
                            :label="item.name" 
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="佣金结算状态" prop="paper">
                    <el-select v-model="propForm.paper" class="w134">
                        <el-option v-for="item in rules.paper" 
                        :key="'paper'+item.key" 
                        :label="item.value" 
                        :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <div class="in-block">
                    <el-form-item label="部门" 
                    prop="department"
                    class="mr">
                        <el-select 
                        v-model="propForm.department" 
                        :remote-method="regionMethodFn"
                        :loading="loading"
                        @change="regionChangeFn"
                        @clear="regionClearFn"
                        clearable
                        remote 
                        filterable
                        class="w200">
                            <el-option 
                            v-for="item in rules.department" 
                            :key="'department'+item.id"
                            :label="item.name" 
                            :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="departmentMo">
                        <el-select 
                        v-model="propForm.departmentMo" 
                        :loading="loading2"
                        clearable
                        filterable
                        class="w100">
                            <el-option 
                            v-for="item in rules.departmentMo" 
                            :key="'departmentMo'+item.empId" 
                            :label="item.name"
                            :value="item.empId"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
        </ScreeningTop>
        <!-- 列表 -->
        <div class="paper-table-box">
            <div class="paper-set-tit">
                <div class="paper-tit-fl"><i class="iconfont icon-tubiao-11 mr-10 font-cl1"></i>数据列表</div>
            </div>
            <el-table :data="tableData.list" class="paper-table mt-20">
                <el-table-column label="合同编号" min-width="161">
                    <template slot-scope="scope">
                        <el-button class="blue" type="text" @click="contractFn">{{scope.row.code}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="接收日期" min-width="100">
                    <template slot-scope="scope">
                        {{dateFormat(scope.row.receiveTime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="propertyAddr" label="物业地址" min-width="180">
                </el-table-column>
                <el-table-column prop="transFlowName" label="交易流程" min-width="248">
                </el-table-column>
                <el-table-column prop="owner" label="业主" min-width="70">
                </el-table-column>
                <el-table-column prop="customer" label="客户" min-width="70">
                </el-table-column>
                <el-table-column label="成交经纪人" min-width="140">
                    <template slot-scope="scope">
                        {{agentFn(scope.row.dealagentStoreName,scope.row.agent)}}
                    </template>
                </el-table-column>
                <el-table-column prop="guestinfo.shopownerName" label="店长" min-width="70">
                </el-table-column>
                <el-table-column label="已超时步骤" min-width="110">
                    <template slot-scope="scope">
                        <el-button class="blue" type="text" @click="tradingStepsFn">{{scope.row.overtimeSteps}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="overtimeName" label="当前步骤责任人" min-width="130">
                </el-table-column>
                <el-table-column prop="specifiedTime" label="计划完成时间" min-width="130">
                </el-table-column>
                <el-table-column prop="overtimeDay" label="超时天数">
                </el-table-column>
                <el-table-column label="收佣状态" min-width="100">
                    <template slot-scope="scope">
                        {{scope.row.receivedCommission}}/{{scope.row.receivableCommission}}
                    </template>
                </el-table-column>
                <el-table-column prop="statusReceiveamount.label" label="佣金结算状态" min-width="120">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button class="blue" type="text" @click="operationFn">流水</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagination" v-if="tableData.total">
            <el-pagination
                :current-page="tableData.pageNum"
                :page-size="tableData.pageSize"
                @current-change="currentChangeFn"
                layout=" total, prev, next, jumper"
                :total="tableData.total">
            </el-pagination>
        </div>
        <!-- 后期进度弹层 -->
        <el-dialog :title="layer.tit" :visible.sync="layer.show" width="1000px"  class="layer-paper">
            <div class="layer-progress">
                <ul class="ul">
                    <li>
                        <span class="cl-2 mr-30">一次性（业）+一次性（客）住宅</span>
                    </li>
                    <li>
                        <span class="cl-1 mr-10">佣金结算状态：</span>
                        <span class="cl-2">部分</span>
                    </li>
                </ul>
                <el-table 
                border
                :data="tableProgress" 
                class="paper-table mt-20">
                    <el-table-column 
                    label="步骤类型" 
                    align="center">
                        <template slot-scope="scope">
                           <span :class="scope.row.state?'red':'cl-2'">{{scope.row.a1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                    label="步骤名称" 
                    align="center">
                        <template slot-scope="scope">
                           <span :class="scope.row.state?'red':'cl-2'">{{scope.row.a2}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                    label="操作人" 
                    align="center">
                        <template slot-scope="scope">
                           <span :class="scope.row.state?'red':'cl-2'">{{scope.row.a3}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                    label="操作日期" 
                    align="center">
                        <template slot-scope="scope">
                           <span :class="scope.row.state?'red':'cl-2'">{{scope.row.a4}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                    label="责任人" 
                    align="center">
                        <template slot-scope="scope">
                           <span :class="scope.row.state?'red':'cl-2'">{{scope.row.a5}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                    label="确定日期" 
                    align="center">
                        <template slot-scope="scope">
                           <span :class="scope.row.state?'red':'cl-2'">{{scope.row.a6}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                    label="办理天数" 
                    align="center">
                        <template slot-scope="scope">
                           <span :class="scope.row.state?'red':'cl-2'">{{scope.row.a7}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                    label="规定天数" 
                    align="center">
                        <template slot-scope="scope">
                           <span :class="scope.row.state?'red':'cl-2'">{{scope.row.a8}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                    label="操作" 
                    align="center">
                        <template slot-scope="scope">
                           <el-button class="blue" type="text" @click="operationFn">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import ScreeningTop from '@/components/ScreeningTop';
    import {FILTER} from '@/assets/js/filter';
    import {MIXINS} from '@/assets/js/mixins';
    import {TOOL} from '@/assets/js/common';

    export default {
        mixins: [FILTER,MIXINS],
        components:{
            ScreeningTop
        },
        data(){
            return{
                // 初始列表页面
                pageNum:1,
                pageSize:5,
                // 加载
                loading:false,
                loading2:false,
                // 城市
                cityId:1,
                // 枚举数据
                dictionary:{
                    '13':'收佣状态',
                    '18':'步骤状态',
                },
                // 筛选条件
                propForm: {
                    department:'',
                    departmentMo:'',
                    search: '',
                    paper: '',
                    time: '',
                    late: '',
                    dateMo: '',
                },
                // 筛选选项
                rules: {
                    department:[{
                        name: "全部",
                        id: ""
                    }],
                    departmentMo:[{
                        name: "全部",
                        empId: ""
                    }],
                    paper: [{
                        value: "全部",
                        key: ""
                    }],
                    time: [{
                        name: "全部",
                        id: ""
                    }],
                    late: [],
                    lateName:[]
                },
                // 列表数据
                tableData:{},
                // 后期进度弹层
                layer:{
                    tit:'查看交易流程',
                    show:false,
                },
                // 后期进度列表
                tableProgress:[{
                    state:false,
                    a1:'担保流程',
                    a2:'资料准备',
                    a3:'李四',
                    a4:'2018-09-08',
                    a5:'李四',
                    a6:'2018-09-08',
                    a7:'8',
                    a8:'7',
                }]
            }
        },
        methods:{
            // 成功提示
            successMeFn(e){
                this.$message({
                    message: e,
                    type: 'success'
                });
            },
            // 错误提示
            errMeFn(e){
                this.$message.error(e);
            },
            // 重置
            resetFormFn() {
                this.$refs.propForm.resetFields();
                this.pageNum=1;
                this.getListData();
            },
            // 查询
            queryFn() {
                this.pageNum=1;
                this.getListData();
            },
            // 筛选搜索
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
                console.log(item);
            },
            // 部门筛选回调
            regionChangeFn(e) {
                console.log(e)
            },
            // 合同编号弹层
            contractFn(){
                console.log('合同编号弹层')
            },
            // 交易步骤
            tradingStepsFn(){
                this.layer.show = true;
            },
            // 操作
            operationFn(){
                console.log('操作')
            },
            // 时间处理
            dateFormat(val){
                return TOOL.dateFormat(val);
            },
            // 分页
            currentChangeFn(e){
                this.pageNum = e;
                this.getListData();
            },
            // 经纪人
            agentFn(s,t){
                if(!!s && !!t){
                    return `${s}-${t}`
                }else if(!!s){
                    return s
                }else if(!!t){
                    return t
                }else{
                    return '--'
                }
            },
            // 获取列表数据
            getListData(){
                let receiveTimeEnd = '';
                let receiveTimeStar = '';
                let time = this.propForm.dateMo;
                if(time === 2){
                    receiveTimeStar = this.dateFormat(time[0]);
                    receiveTimeEnd = this.dateFormat(time[1]);
                }
                this.$ajax.postJSON('/api/postSigning/getMonitorContract',{
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    dealAgentId:this.propForm.departmentMo,
                    dealDeptId:this.propForm.department,
                    statusResult:this.propForm.paper,
                    transFlowCode:this.propForm.time,
                    stepState:this.propForm.lateName,
                    stepInstanceCode:this.propForm.late,
                    receiveTimeEnd,
                    receiveTimeStar,
                    keyword:this.propForm.search,
                }).then(res=>{
                    res = res.data;
                    if(res.status === 200){
                        console.log(res)
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 分页
            currentChangeFn(e){
                this.pageNum = e;
                this.getListData();
            },
            // 交易步骤获取数据
            getTradingSteps(){
                this.$ajax.get('/api/postSigning/getAllStepFlows').then(res=>{
                    res = res.data;
                    if(res.status === 200){
                        this.rules.late = res.data;
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 部门筛选回调
            regionChangeFn(e) {
                if( e !=="" || !!e){
                    this.loading2 = true;
                    this.$ajax.get("/api/organize/employees",{
                    cityId:this.cityId,
                    depId:e,
                    }).then(res=>{
                        res = res.data
                        if(res.status === 200){
                            this.propForm.departmentMo = '';
                            let arr = [];
                            if(res.data.length > 0){
                                    arr = [{
                                    name: "全部",
                                    empId: ""
                                },...res.data]
                            }
                            this.rules.departmentMo = arr;
                            this.loading2 = false;
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
                }else{
                    this.propForm.departmentMo = '';
                    this.rules.departmentMo = [{
                                        name: "全部",
                                        empId: ""
                                    }]
                }
                
            },
            // 部门下拉搜索
            regionMethodFn(e){
                this.loading = true;
                this.$ajax.get("/api/access/deps",{
                    keyword:e
                }).then(res=>{
                    res = res.data
                    if(res.status === 200){
                        if(e==='' || !e){
                            this.rules.department = [{
                                name: "全部",
                                id: ""
                            },...res.data]
                        }else{
                            this.rules.department = res.data
                        }
                        this.loading = false;
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            // 清除部门搜索
            regionClearFn(){
                this.regionMethodFn('');
            },
            // 交易流程获取数据
            getTransactionProcess(){
                this.$ajax.post('/api/flowmanage/selectFlowPageList',{
                    cityId:this.cityId
                }).then(res=>{
                    res = res.data
                    if (res.status === 200) {
                        this.rules.time = [{
                            name: "全部",
                            id: ""
                        },...res.data];
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
        },
        mounted() {
            // 交易步骤
            this.getTradingSteps();
            // 交易流程
            this.getTransactionProcess();
            // 部门搜索
            this.regionMethodFn('');
            // 枚举数据查询
            this.getDictionary();
            // 列表数据
            this.getListData();
        },
        watch:{
            dictionary(newData,oldData){
                // 步骤状态
                this.rules.lateName = [...newData[18]];
                // 收佣状态
                this.rules.paper = [{
                            value: "全部",
                            key: ""
                        },...newData[13]];
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/less/lsx.less";
</style>