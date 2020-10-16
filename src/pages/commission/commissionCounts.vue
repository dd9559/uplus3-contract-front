<template>
    <div class="page-class">
        <!-- <p class="brand-nav">财务>提成计算</p> -->
        <!-- 查询组件 -->
        <uPlusScrollTop @propResetFormFn="reset"
            @propQueryFn="queryFn"
            class="commission-top"
            style="padding:0 12px 12px;">
            <el-input placeholder="合同编号/纸质合同编号/物业地址"
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
            <div class="triple-select">
                <el-select v-model="value1"
                    class="w100"
                    placeholder="体系">
                    <el-option v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
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

            <el-select v-model="value5"
                class="w116"
                placeholder="计算状态">
                <el-option v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>

        </uPlusScrollTop>
        <div class="main">
            <div class="reveal-box">
                <div class="reveal-txt">当前共找到【420】条数据</div>
                <el-button class="fr btn-orange-border">导出</el-button>
                <el-button class="fr btn-orange">批量计算提成</el-button>
            </div>
            <el-table :data="tableData"
                class="table-box">
                <el-table-column prop="name"
                    min-width="100"
                    label="姓名"></el-table-column>
                <el-table-column prop="department"
                    min-width="110"
                    label="部门"></el-table-column>
                <el-table-column prop="position"
                    min-width="100"
                    label="职位"></el-table-column>
                <el-table-column prop="working"
                    min-width="80"
                    label="在职状态"></el-table-column>
                <el-table-column prop="employeeId"
                    min-width="80"
                    label="员工编号"></el-table-column>
                <el-table-column prop="settlementDate"
                    min-width="105"
                    label="结算日期"></el-table-column>
                <el-table-column prop="contractDate"
                    min-width="105"
                    label="签约日期"></el-table-column>
                <el-table-column prop="type"
                    min-width="105"
                    label="合同类型"></el-table-column>
                <el-table-column prop="contractNo"
                    min-width="125"
                    label="合同编号"></el-table-column>
                <el-table-column prop="address"
                    min-width="145"
                    label="物业地址"></el-table-column>
                <el-table-column prop="amount"
                    min-width="85"
                    label="结算金额"></el-table-column>
                <el-table-column prop="calculationStatus"
                    min-width="85"
                    label="计算状态"></el-table-column>
                <el-table-column prop="commissionAmount"
                    min-width="85"
                    label="提成金额"></el-table-column>
                <el-table-column prop="formula"
                    min-width="265"
                    label="提成计算公式"></el-table-column>
                <el-table-column prop="time"
                    min-width="100"
                    label="提成生成时间"></el-table-column>
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
    name: "commissionCounts",
    data() {
        return {
            billingDate: "",
            billingDate2: "",
            options1: [
                {
                    value: "选项1",
                    label: "签约时间",
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
                    name: "王小虎",
                    department: "所在部门",
                    position: "经纪人",
                    working: "离职",
                    employeeId: "1234",
                    settlementDate: "2018/08/06",
                    contractDate: "2018/08/06",
                    type: "买卖",
                    contractNo: "S2020565656",
                    address: "成交时的u+物业地 址",
                    amount: "900000",
                    calculationStatus: "已计算",
                    commissionAmount: "500000",
                    formula: "200*10%+800*20%+(1400-800*30%)",
                    time: "2020/07/25",
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
    mounted() {
        // 提示弹层
        // this.$tool.layerAlert.call(this, {
        //     message: "确定计算 [结算周期] 的提成吗？",
        //     title: "确认是否计算提成",
        //     callback(){
        //         console.log(11)
        //     }
        // })
        // 结算完成
        // this.$tool.layerAlert.call(this, { typeInfo: 1 });

        // 加载中
        // this.$tool.layerAlert.call(this, { typeInfo: 2 });

        // 关闭加载中
        // setTimeout(() => {
        //     this.$tool.layerAlertClose();
        // }, 2000);
    },
};
</script>

<style scoped lang="less">
</style>
