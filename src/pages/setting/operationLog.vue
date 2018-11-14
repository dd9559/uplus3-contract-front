<template>
    <div class="view-container">
        <ScreeningTop
        @propQueryFn="queryFn"
        @propResetFormFn="resetFormFn">
            <el-form v-model="searchForm" class="header" size="small">
                <!-- <div class="form-title">
                    <span>筛选查询</span>
                    <div>
                        <el-button @click="onReset" class="resetBtn">重置</el-button>
                        <el-button type="primary" @click="onSearch" class="searchBth">查询</el-button>        
                    </div>
                </div> -->
                <div class="content">
                    <el-form-item label="部门">
                        <el-select v-model="searchForm.department" placeholder="请选择">
                            <el-option value=""></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="日期">
                        <el-date-picker
                        v-model="searchTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input v-model="searchForm.keyWord" placeholder="操作内容关/模块关键字"></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </ScreeningTop>
        <div class="table-list">
            <p>
                <span>数据列表</span>
            </p>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="操作日期" prop="createTime"></el-table-column>
                <el-table-column label="操作人">
                    <template slot-scope="scope">
                        <span>{{ scope.row.createByDepName }}+{{ scope.row.createByName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="功能模块" prop="functionName"></el-table-column>
                <el-table-column label="子类型" prop="type"></el-table-column>
                <el-table-column label="操作内容" prop="content"></el-table-column>
                <el-table-column label="IP地址" prop="ip"></el-table-column>
            </el-table>
        </div>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[20, 30, 40, 50]"
            :page-size="pageSize"
            layout="prev, pager, next,  total, sizes, jumper"
            :total="count">
        </el-pagination>
    </div>
</template>

<script>
    import ScreeningTop from '@/components/ScreeningTop';
    export default {
        data() {
            return {
                searchForm: {
                    department: "",
                    searchTimeStart: "",
                    searchTimeEnd: "",
                    keyWord: ""
                },
                searchTime: [],
                tableData: [],
                pageSize: 50,
                pageNum: 1
            }
        },
        created() {
            this.getLogList()
        },
        methods: {
            handleSizeChange (val) {
            console.log(`每页 ${val} 条`)
            this.pageSize = val
            this.initList()
            },
            handleCurrentChange (val) {
            console.log(`当前页: ${val}`)
            this.pageNum = val
            this.initList()
            },
            getLogList() {
                let param = {
                    pageSize: this.pageSize,
                    pageNum: this.pageNum
                }
                this.$ajax.get('/api/operation/getList',param).then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.tableData = res.data.list
                    }
                }).catch(error => {
                    console.log(error);
                })
            },
            // 重置
            resetFormFn() {
                this.$refs.propForm.resetFields()
            },
            // 查询
            queryFn(){
                console.log('查询')
            },
        },
        components:{
            ScreeningTop
        }
    }
</script>

<style lang="less" scoped>
.header {
    padding: 10px;
    background-color: #fff;
    border-radius:2px;
    box-sizing: border-box;
    box-shadow:0px 1px 6px 0px rgba(7,47,116,0.1);
    .form-title {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        div {
            > .el-button {
                width: 100px;
                height: 36px;
                border-radius:18px;
            }
        }
    }
    .content {
        display: flex;
        > .el-form-item {
            display: flex;
            margin-right: 30px;
        }
    }
}

.table-list {
    background-color: #fff;
    padding: 10px;
    margin-top: 20px;
    > p {
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 18px;
    }
}

/deep/ .el-table th {
  background:rgba(238,242,251,1);
}
/deep/ .el-pagination{
    text-align: center
}
</style>