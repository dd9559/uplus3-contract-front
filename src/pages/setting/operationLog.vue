<template>
    <div class="view-container">
        <ScreeningTop
        @propQueryFn="queryFn"
        @propResetFormFn="resetFormFn">
            <el-form  class="header" ref="propForm" size="small">
                <div class="content">
                    <el-form-item label="部门">
                         <el-select v-model="department" filterable placeholder="请选择"  @change="selUser">
                            <el-option
                            v-for="(item) in departs"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                           >
                            </el-option>
                        </el-select>
                        <el-select v-model="depUser" filterable placeholder="请选择">
                            <el-option v-for="(item,index) in users" 
                            :key="index"
                            ref="user" 
                            :label="item.name"
                            :value="item.empId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="日期">
                        <el-date-picker
                        v-model="searchTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        value-format="yyyy-MM-dd"
                        end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input v-model="keyWord" placeholder="操作内容关/模块关键字"></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </ScreeningTop>
        <div class="table-list">
            <p>
                <span><i class="iconfont icon-tubiao-11 mr-8"></i>数据列表</span>
                <!-- <span>数据列表</span> -->
            </p>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="操作日期">
                    <template slot-scope="scope">
                        {{scope.row.createTime | formatDate}}
                    </template>
                </el-table-column>
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
            :page-sizes="[1, 2, 3, 4]"
            :page-size="pageSize"
            layout="prev, pager, next,  total, sizes, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
    import ScreeningTop from '@/components/ScreeningTop';
    export default {
        data() {
            return {
                department: [],
                keyWord: "",
                searchTime: '',
                tableData: [],
                pageSize: 3,
                pageNum: 1,
                total:0,
                departs:[],
                users:[],
                depUser:'',
            }
        },
        created() {
            this.$ajax.get('/api/access/deps').then((res)=>{
                if(res.status==200){
                    this.departs=res.data.data
                }
            }),
            this.getLogList()
        },
        methods: {
            selUser(){
                console.log(this.department,'进入seluser');
                this.depUser=''
                this.$ajax.get('/api/organize/employees',{depId:this.department}).then((res)=>{
                console.log(res);
                if(res.status==200){
                    this.users=res.data.data
                    console.log(this.users);
                }
            })
            },
            handleSizeChange (val) {
            this.pageSize = val
            console.log(this.pageSize,'pageSize');
            this.getLogList()
            },
            handleCurrentChange (val) {
            this.pageNum = val
            this.getLogList()
            },
            getLogList() {
                let param = {
                    pageSize: this.pageSize,
                    pageNum: this.pageNum,
                    deptId:this.department,
                    empId:this.depUser,
                    keyword:this.keyWord,
                    startTime:this.searchTime[0],
                    endTime:this.searchTime[1],
                }
                // console.log(param.keyword,'keyword');
                console.log(this.searchTime[0],'searchTime');
                this.$ajax.get('/api/operation/getList',param).then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.total = res.data.total
                        this.tableData = res.data.list
                    }
                }).catch(error => {
                    console.log(error);
                })
            },
            // 重置
            resetFormFn() {
                this.keyWord='',
                this.searchTime='',
                this.depUser='',
                this.department=''
                this.users=''
            },
            // 查询
            queryFn(){
                console.log('查询')
                this.getLogList()
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
                border-radius:14px;
            }
        }
    }
    .content {
        display: flex;
        flex-wrap: wrap;
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
        height: 36px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 14px;
    }
}

/deep/ .el-table th {
  background:rgba(238,242,251,1);
}
/deep/ .el-pagination{
    text-align: center
}
.mr-8{
    margin-right: 8px;
}
</style>