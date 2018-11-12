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
        </div>
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
            }
        },
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/less/lsx.less";
</style>