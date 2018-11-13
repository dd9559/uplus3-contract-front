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
                <el-form-item label="交易步骤" prop="late" class="mr">
                    <el-select v-model="propForm.late" @change="lateChangeFn" class="w100">
                        <el-option v-for="item in rules.late" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="lateName">
                    <el-select v-model="propForm.lateName" class="w100" placeholder="状态">
                        <el-option v-for="item in rules.lateName" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="交易流程" prop="time">
                    <el-select v-model="propForm.time" class="w270">
                        <el-option v-for="item in rules.time" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="佣金结算状态" prop="paper">
                    <el-select v-model="propForm.paper" class="w134">
                        <el-option v-for="item in rules.paper" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门" prop="region" class="mr">
                    <el-select v-model="propForm.region" @change="regionChangeFn" class="w200" filterable>
                        <el-option v-for="item in rules.region" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="regionName">
                    <el-select v-model="propForm.regionName" class="w100" filterable>
                        <el-option v-for="item in rules.regionName" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </ScreeningTop>
        <!-- 列表 -->
        <div class="paper-table-box">
            <div class="paper-set-tit">
                <div class="paper-tit-fl"><i class="iconfont icon-tubiao-11 mr-10 font-cl1"></i>数据列表</div>
            </div>
            <el-table :data="tableData" class="paper-table mt-20">
                <el-table-column label="合同编号" min-width="161">
                    <template slot-scope="scope">
                        <el-button class="blue" type="text" @click="contractFn">{{scope.row.a1}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="a2" label="接收日期" min-width="100">
                </el-table-column>
                <el-table-column prop="a3" label="物业地址" min-width="180">
                </el-table-column>
                <el-table-column prop="a4" label="交易流程" min-width="248">
                </el-table-column>
                <el-table-column prop="a5" label="业主" min-width="70">
                </el-table-column>
                <el-table-column prop="a6" label="客户" min-width="70">
                </el-table-column>
                <el-table-column prop="a7" label="成交经纪人" min-width="140">
                </el-table-column>
                <el-table-column prop="a8" label="店长" min-width="70">
                </el-table-column>
                <el-table-column prop="a9" label="已超时步骤" min-width="110">
                    <template slot-scope="scope">
                        <el-button class="blue" type="text" @click="tradingStepsFn">{{scope.row.a9}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="a10" label="当前步骤责任人" min-width="130">
                </el-table-column>
                <el-table-column prop="a11" label="计划完成时间" min-width="130">
                </el-table-column>
                <el-table-column prop="a12" label="超时天数">
                </el-table-column>
                <el-table-column prop="a13" label="收佣状态" min-width="100">
                </el-table-column>
                <el-table-column prop="a14" label="佣金结算状态" min-width="120">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button class="blue" type="text" @click="operationFn">{{scope.row.a15}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
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

    export default {
        mixins:[],
        components:{
            ScreeningTop
        },
        data(){
            return{
                // 筛选条件
                propForm: {
                    region: '',
                    regionName: '',
                    search: '',
                    paper: '选项1',
                    time: '选项11',
                    late: '选项21',
                    dateMo: '',
                },
                // 筛选选项
                rules: {
                    region: [{
                        label: "区域一",
                        value: "shanghai"
                    },
                    {
                        label: "区域二",
                        value: "quyuer"
                    }],
                    regionName: [{
                        label: "区域一",
                        value: "shangha"
                    },
                    {
                        label: "区域二",
                        value: "quyue"
                    }, ],
                    paper: [{
                        label: "全部",
                        value: "选项1"
                    },
                    {
                        label: "区域二",
                        value: "选项2"
                    }],
                    time: [{
                        label: "全部",
                        value: "选项11"
                    },
                    {
                        label: "区域二",
                        value: "选项12"
                    }],
                    late: [{
                        label: "全部",
                        value: "选项21"
                    },
                    {
                        label: "区域二",
                        value: "选项22"
                    }]
                },
                // 列表数据
                tableData:[{
                    a1: '201809301289',
                    a2:'已开始',
                    a3:'安居苑10栋3单元1102',
                    a4:'一次性（业）+一次性（客）住宅',
                    a5:'张三',
                    a6:'张三',
                    a7:'当代一店-夏雨天',
                    a8:'王五',
                    a9:'资料准备',
                    a10:'王五',
                    a11:'2018/6/28',
                    a12:'1.6',
                    a13:'0/25000',
                    a14:'未收',
                    a15:'流水',
                }],
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
            // 重置
            resetFormFn() {
                this.$refs.propForm.resetFields()
            },
            // 查询
            queryFn() {
                console.log('查询')
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
            // 交易步骤回调
            lateChangeFn(e){
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
            }
        },
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/less/lsx.less";
</style>