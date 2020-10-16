<template>
    <div class="page-class">
        <!-- <p class="brand-nav">财务>提成发放</p> -->
        <!-- 查询组件 -->
        <uPlusScrollTop @propResetFormFn="reset"
            @propQueryFn="queryFn"
            class="commission-top"
            style="padding:0 12px 12px;">
            <el-input placeholder="登录账号/员工工号"
                prefix-icon="el-icon-search"
                class="w300"></el-input>
            <!-- 日期 -->
            <div class="item-text">结算周期</div>
            <el-date-picker class="item-billing-date w160"
                v-model="billingDate"
                type="date"
                placeholder="选择日期"
                value-format="timestamp">
            </el-date-picker>

            <!-- 三联下拉选择 -->
            <el-select v-model="value1"
                class="w100 mr-16"
                placeholder="体系">
                <el-option v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>

            <div class="triple-select">

                <el-select v-model="value2"
                    class="w200"
                    placeholder="选择部门">
                    <el-option v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="value3"
                    class="w100"
                    placeholder="选择人员">
                    <el-option v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <el-select v-model="value5"
                class="w116 mr-16"
                placeholder="在职状态">
                <el-option v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>

            <div class="triple-select">
                <el-select v-model="value4"
                    class="w100">
                    <el-option v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-date-picker class="item-billing-date2 w212"
                    v-model="billingDate2"
                    type="monthrange"
                    range-separator="至"
                    start-placeholder="开始月份"
                    end-placeholder="结束月份">
                </el-date-picker>
            </div>

        </uPlusScrollTop>

        <div class="main">
            <div class="reveal-box">
                <div class="reveal-txt">当前共找到【420】条数据<span class="reveal-p1">发放人数：<em class="cl-red">20</em>人 提成总金额：<em class="cl-red">20000.00</em>元 已发放总金额：<em class="cl-red">18000.00</em>元 未发放总金额：<em class="cl-red">2000.00</em>元</span></div>
                <el-button class="fr btn-orange-border">导出</el-button>
                <el-button class="fr btn-orange">批量发放</el-button>
            </div>
            <el-table :data="tableData"
                class="table-box">
                <el-table-column type="selection"
                    min-width="60">
                </el-table-column>
                <el-table-column prop="billingCycle"
                    min-width="100"
                    label="结算周期"></el-table-column>
                <el-table-column min-width="100"
                    label="发放状态">
                    <template slot-scope="scope">
                        <span :class="scope.row.releaseStatus === '未发放'?'cl-red':'cl-green'">{{scope.row.releaseStatus}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="IssueDate"
                    min-width="140"
                    label="发放日期"></el-table-column>
                <el-table-column prop="name"
                    min-width="250"
                    label="员工姓名"></el-table-column>
                <el-table-column prop="workingStatus"
                    min-width="100"
                    label="在职状态"></el-table-column>
                <el-table-column prop="commission"
                    min-width="130"
                    label="提成（元）"></el-table-column>
                <el-table-column min-width="120"
                    label="操作">
                    <template slot-scope="scope">
                        <span :class="scope.row.operating === '发放'?'cl-blue':''">{{scope.row.operating || '--'}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <myPagination @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="pageSizes"
                :page-size="pageSize"
                :total="total"></myPagination>
        </div>
    </div>
</template>

<script>
import myPagination from "./myPagination";
export default {
    name: "commissionGrant",
    data() {
        return {
            billingDate: "",
            billingDate2: "",
            options1: [
                {
                    value: "选项1",
                    label: "发放时间",
                },
                {
                    value: "选项2",
                    label: "双皮奶",
                },
                {
                    value: "选项3",
                    label: "蚵仔煎",
                },
                {
                    value: "选项4",
                    label: "龙须面",
                },
                {
                    value: "选项5",
                    label: "北京烤鸭",
                },
            ],
            value1: "",
            value2: "",
            value3: "",
            value4: "选项1",
            value5: "",
            tableData: [
                {
                    billingCycle: "2016-05-02",
                    releaseStatus: "未发放",
                    address: "上海市普陀区金沙江路 1518 弄",
                    IssueDate: "2019/04/31",
                    name: "黄小玉-保利利利利保利保利花园一店",
                    workingStatus: "在职",
                    commission: "120.00",
                    operating: "发放",
                },
            ],
            currentPage: 3,
            pageSize: 10,
            total: 400,
            pageSizes: [10, 200, 300, 400],
        };
    },
    methods: {
        reset() {
            console.log("重置");
        },
        queryFn() {
            console.log("查询");
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`2当前页: ${val}`);
        },
    },
    components: {
        myPagination,
    },
};
</script>

<style scoped>
.brand-nav {
    background-color: #f5f5f5;
    height: 50px;
    line-height: 50px;
    border: none;
    font-size: 16px;
    padding-left: 20px;
}
</style>
