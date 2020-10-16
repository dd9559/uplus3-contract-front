<template>
    <div class="page-class">
        <!-- <p class="brand-nav">财务>操作日志</p> -->
        <!-- 查询组件 -->
        <uPlusScrollTop @propResetFormFn="reset"
            @propQueryFn="queryFn"
            class="commission-top"
            style="padding:0 12px 12px;">
            <el-input placeholder="操作内容"
                prefix-icon="el-icon-search"
                class="w300"></el-input>

            <!-- 三联下拉选择 -->
            <el-select v-model="value1"
                class="w200 mr-16"
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
                placeholder="全部">
                <el-option v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>

            <div class="triple-select">
                <div class="item-text">时间</div>
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
                <div class="reveal-txt">当前共找到【420】条数据</div>
            </div>
            <el-table :data="tableData"
                class="table-box">
                <el-table-column prop="a1"
                    min-width="100"
                    label="体系"></el-table-column>
                <el-table-column prop="a2"
                    min-width="130"
                    label="操作日期"></el-table-column>
                <el-table-column prop="a3"
                    min-width="170"
                    label="操作人"></el-table-column>
                <el-table-column prop="a4"
                    min-width="100"
                    label="模块"></el-table-column>
                <el-table-column prop="a5"
                    min-width="300"
                    label="操作内容"></el-table-column>
                <el-table-column prop="a6"
                    min-width="200"
                    label="IP地址"></el-table-column>
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
    name: "commissionSetting",
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
                    a1: "吉家体系",
                    a2: "2020/07/22",
                    a3: "测试小队-丁禹奚",
                    a4: "提成设置",
                    a5: "由设置开启扣除规则修改为关闭规则",
                    a6: "59.175.116.134",
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
