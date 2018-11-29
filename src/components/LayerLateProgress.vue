<template>
    <div>
        <!-- 后期进度弹层 -->
        <el-dialog :title="getTitle" :visible.sync="layerShow" width="1000px" class="layer-paper">
            <div class="layer-progress">
                <ul class="ul">
                    <li>
                        <span class="cl-2 mr-30">{{layerShowData.transFlowName}}</span>
                    </li>
                    <li>
                        <span class="cl-1 mr-10">佣金结算状态：</span>
                        <span class="cl-2">{{layerShowData.statusReceiveAmount.label}}</span>
                    </li>
                </ul>
                <el-table border v-loading="loading" :data="tableProgress" :formatter="nullFormatter" class="paper-table mt-20">
                    <el-table-column label="步骤类型" align="center">
                        <template slot-scope="scope">
                            <span :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'">{{getDataVal(scope.row.transactionStepsType)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="步骤名称" align="center">
                        <template slot-scope="scope">
                            <span :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'">{{getDataVal(scope.row.transactionSteps)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作人" align="center">
                        <template slot-scope="scope">
                            <span :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'">{{getDataVal(scope.row.operatorName)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作日期" align="center">
                        <template slot-scope="scope">
                            <span :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'">{{dateFormat(scope.row.operationTime)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="责任人" align="center">
                        <template slot-scope="scope">
                            <span :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'">{{getDataVal(scope.row.personLiableName)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="确定日期" align="center">
                        <template slot-scope="scope">
                            <span :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'">{{dateFormat(scope.row.endDatetime)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="办理天数" align="center">
                        <template slot-scope="scope">
                            <span :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'">{{getDataVal(scope.row.actualDay)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="规定天数" align="center">
                        <template slot-scope="scope">
                            <span :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'">{{getDataVal(scope.row.specifiedDay)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="120px" align="center">
                        <template slot-scope="scope">
                            <el-button class="blue" type="text">查看</el-button>
                            <!--  @click="operationFn(scope.row.id)" -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import { FILTER } from '@/assets/js/filter';
    import { TOOL } from '@/assets/js/common';

    // 是否超时
    const ISOVERTIME = 1;

    export default {
        mixins: [FILTER],
        data() {
            return {
                // 显示隐藏
                layerShow: false,
                // 后期进度列表
                tableProgress: [],
                // 是否超时
                ISOVERTIME,
                layerShowData: {
                    statusReceiveAmount: {
                        label: '',
                    }
                },
                // 加载
                loading: true,
            }
        },
        props: {
            title: {
                type: String,
                default: '',
            }
        },
        computed: {
            getTitle() {
                return this.title;
            }
        },
        methods: {
            // 时间处理
            dateFormat(val) {
                return TOOL.dateFormat(val);
            },
            // 后期进度获取数据
            lateProgressFn() {
                this.$ajax.get('/api/postSigning/getLastStepList', {
                    id: this.layerShowData.id
                }).then(res => {
                    res = res.data;
                    if (res.status === 200) {
                        this.tableProgress = res.data;
                    }
                    this.loading = false;
                }).catch(err => {
                    console.log(err)
                })
            },
            show(data) {
                this.loading = true;
                this.layerShow = true;
                this.layerShowData = data;
                this.lateProgressFn();
            },
            hid() {
                this.layerShow = false;
            }
        },
    }
</script>

<style lang="less">
@import "~@/assets/common.less";
.blue {
    color: @color-blue;
}
.mr-30 {
    margin-right: 30px;
}
.mt-20 {
    margin-top: 20px;
}
.red {
    color: #FF3E3E;
}
.cl-2 {
    color: #233241;
}
// 弹层
.layer-paper {
    /deep/.el-dialog__body {
        padding: 0;
    }
    /deep/.el-dialog__header {
        padding: 20px;
        border-bottom: 1px solid #EDECF0;
    }
}
// 列表
.paper-table {
    // width: 100%;
    /deep/.el-table__header-wrapper,
    /deep/.el-table__fixed-header-wrapper {
        border-radius: 4px;
        overflow: hidden;
    }
    /deep/.el-table__header th {
        background-color: #EEF2FB;
        line-height: 30px;
        color: #6C7986;
    }
    /deep/&.el-table td {
        padding: 25px 0;
    }
    /deep/&.el-table td:last-child>.cell {
        padding-right: 0;
    }
    .line {
        background-color: #e5e4ea;
        display: inline-block;
        height: 14px;
        width: 1px;
        margin: 0 6px;
        position: relative;
        top: 3px;
    }
}
// 后期进度弹层
.layer-progress {
    padding: 30px 20px;
    line-height: 36px;
    .ul {
        display: flex;
    }
    .ul-line {
        line-height: 36px;
    }
    /deep/.paper-table.el-table td {
        padding: 15px 0;
    }
}
</style>