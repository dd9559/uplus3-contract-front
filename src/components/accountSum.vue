<template>
    <div class="view-container" ref="tableComView">
        <div class="head-area">
            <el-form :inline="true" size="small">
                <el-form-item label="月份">
                    <el-date-picker
                    v-model="sumDate"
                    type="monthrange"
                    range-separator="至"
                    start-placeholder="开始月份"
                    value-format="yyyy-MM"
                    end-placeholder="结束月份">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="部门">
                    <select-tree :data="DepList" :init="depName" @checkCell="depHandleClick" @clear="clearDep"
                            @search="searchDep"></select-tree>
                </el-form-item>
            </el-form>
            <p style="white-space: nowrap;">
                <el-button
                    type="primary"
                    size="small"
                    @click="queryFn">查 询
                </el-button>
                <el-button
                    size="small"
                    @click="resetFormFn">重 置
                </el-button>
            </p>
        </div>
        <div class="view-context">
            <div class="table-tool">
                <ul>
                    <li>
                        收入<span class="color-green">{{tableHead.income}}</span>元
                    </li>
                    <li>
                        支出<span class="color-red">{{tableHead.expenditure}}</span>元
                    </li>
                    <li>
                        利润<span class="color-red">{{tableHead.profit}}</span>元
                    </li>
                </ul>
                <p>
                    <el-button class="btn-info" type="primary" size="small" @click="getExcel">导出</el-button>
                </p>
            </div>
            <el-table :data="list" border header-row-class-name="theader-bg" style="width: 100%">
                <el-table-column label="月份" prop="moneyTime"></el-table-column>
                <el-table-column label="部门" prop="deptName"></el-table-column>
                <el-table-column label="收入（元）" prop="income">
                    <template slot-scope="scope">
                        <span :class="{'color-green':scope.row.income>0}">{{scope.row.income}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="支出（元）" prop="expenditure">
                    <template slot-scope="scope">
                        <span :class="{'color-red':scope.row.expenditure>0}">{{scope.row.expenditure}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="利润（元）" prop="profit">
                    <template slot-scope="scope">
                        <span :class="scope.row.profit>0?'color-green':scope.row.profit<0?'color-red':''"></span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            v-if="total"
            class="pagination-info"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </div>

        <!-- <addPay :dialogVisible="openPay" :version="version" @closePayDialog="closePay" @refreshData="getData" v-if="openPay"></addPay> -->
    </div>
</template>

<script>
import {MIXINS} from "@/assets/js/mixins";

export default {
    name: "account-sum",
    mixins: [MIXINS],
    data() {
        return {
            sumDate: [],
            deptId: '',
            depName: '',
            list: [],
            total: 0,
            pageNum: 1,
            pageSize: 20,
            tableHead: {
                expenditure: 0,
                income: 0,
                profit: 0
            }
        }
    },
    created() {

    },
    methods: {
        getData() {
            let param = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                deptId: this.deptId
            }
            if(this.sumDate && this.sumDate.length) {
                param.moneyTimeStart = this.sumDate[0]
                param.moneyTimeEnd = this.sumDate[1]
            }
            this.$ajax.get('/api/accountBook/accountTotal', param).then(res => {
                res = res.data
                if(res.status === 200) {
                    this.list = res.data.list.list
                    this.total = res.data.list.total
                    this.tableHead = {...res.data}
                }
            })
        },
        getExcel() {
            if(!this.total)  return
            let param = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                deptId: this.deptId
            }
            if(this.sumDate && this.sumDate.length) {
                param.moneyTimeStart = this.sumDate[0]
                param.moneyTimeEnd = this.sumDate[1]
            }
            this.excelCreate('/input/accountBookExcel',param)
        },
        clearDep: function () {
            this.depName = ''
            this.clearSelect()
        },
        searchDep: function (payload) {
            // this.clearSelect('emp')
        },
        depHandleClick(data) {
            this.deptId = data.depId
            this.depName = data.name
        },
        queryFn() {
            if(this.sumDate.length&&this.depName) {
                this.pageNum = 1
                this.getData()
            }
        },
        resetFormFn() {
            this.sumDate = []
            this.deptId = ''
            this.depName = ''
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getData()
        }
    }
}
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  .head-area {
      display: flex;
      justify-content: space-between;
  }
  .view-context {
    background-color: @color-white;
    padding: 0 @margin-10;
    /deep/ .theader-bg {
      > th {
        background-color: @bg-th;
      }
    }
    .table-tool {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: @margin-base 0;
        > ul {
            display: flex;
            margin-left: 20px;
            > li {
            color: @color-6c;
            margin-right: 20px;
            }
        }
    }
    .color-green {
        color: @color-green;
    }
    .color-red {
        color: @color-red;
    }
  }
</style>