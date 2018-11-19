<template>
    <div class="view-container">
        <div class="data-list gap">
            <p class="title">
                <span>数据列表</span>
            </p>
            <el-table :data="tableData" @row-click="rowClick" highlight-current-row>
                <el-table-column align="center" label="序号" type="index" width="90"></el-table-column>
                <el-table-column align="center" label="款类(大类)" prop="name" width="120"></el-table-column>
                <el-table-column align="center" label="是否启用系统收款" width="150">
                    <template slot-scope="scope"  >
                        <div v-if="scope.row.name=='代收代付'">
                            <el-switch
                            v-model="scope.row.status==0?true:false"
                            active-color="rgba(71,141,227,1)"
                            inactive-color="rgba(141,144,148,1)">
                            </el-switch>
                        </div>
                        <div v-else>--</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="操作" min-width="150">
                    <template slot-scope="scope">
                        <el-button type="text" size="medium">新增</el-button>
                        <el-button type="text" size="medium">删除</el-button>
                        <el-button v-if="scope.row.moneyType === '代管'" type="text" size="medium" @click="dialogCitySettingVisible = true">城市设置</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </div>
        <div class="commission gap">
            <p class="title">
                <span>佣金</span>
            </p>
            <el-table :data="moneyTypes">
                <el-table-column align="center" label="序号" type="index"></el-table-column>
                <el-table-column align="center" label="款类(小类)" prop="name"></el-table-column>
                <el-table-column align="center" label="描述" prop="remark"></el-table-column>
                <el-table-column align="center" label="是否启用">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status==0?true:scope.row.status==1?true:false">
                            <el-switch
                                v-model="scope.row.status==0?true:false"
                                active-color="rgba(71,141,227,1)"
                                inactive-color="rgba(141,144,148,1)">
                            </el-switch>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="收款账户" prop="accountType"></el-table-column>
                <el-table-column align="center" label="操作">

                    
                    <template slot-scope="scope" v-if="isSF">
                        <el-button type="text" size="medium">新增</el-button>
                        <el-button type="text" size="medium">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
       
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [
                    
                ],
                moneyTypes: [],
                value2: true,
                cityName: "",
                isSF:''
            }
        },
        created(){
           this.initList()
         
        },
        methods: {
            // 初始化数据
            initList(){
                this.$ajax.get('api/setting/moneyType/list',{id:''},).then((res)=>{
                    if(res.status==200){
                        this.tableData=res.data.data
                        this.isSF=this.tableData.name=='代收代付'?true:false
                        console.log(this.tableData);
                    }
                    console.log(res);
                })
            },
            //城市设置弹框 确定
            confirm() {

            },
            //单击行事件
            rowClick(row, event, column) {
                this.moneyTypes=row.moneyTypes
            }
        }
    }
</script>

<style lang="less" scoped>
.view-container {
    display: flex;
    // height: calc(100% - 40px);
    .data-list {
        // flex: 1;
        // margin-right: 15px;
        min-width: 36%;
        margin-right: 1%;
        // padding: 15px 10px 0;
        background-color: #fff;
        box-shadow:0px 1px 6px 0px rgba(7,47,116,0.1);
        border-radius:4px;
        /deep/ .el-table th {
            background:rgba(242,243,248,1);
        }
        /deep/ .el-table th, 
        /deep/ .el-table td {
            &:nth-child(2) {
                border-left: 1px solid rgba(232, 234, 246, 1);
            }
            &:nth-child(3) {
                border-left: 1px solid rgba(232, 234, 246, 1);
                border-right: 1px solid rgba(232, 234, 246, 1);
            }
        }
        .el-table {
            border:1px solid rgba(232, 234, 246, 1);
            border-radius:4px 4px 0px 0px;
        }
    }
    .commission {
        // flex: 2;
        min-width: 63%;
        // padding: 15px 10px 0;
        background:rgba(254,252,247,1);
        box-shadow:0px 1px 6px 0px rgba(7,47,116,0.1);
        border-radius:4px;
        .el-table {
            background:rgba(254,252,247,1);
        }
        /deep/ .el-table th {
            background:rgba(242,243,248,1);
        }
    }
    .gap {
        padding: 15px 10px 0;
        box-sizing: border-box;
    }
    .title {
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 18px;
    }

    .citySettingContent {
        .tip {
            display: flex;
            color: #FF3E3E;
            span {
                margin-right: 5px;
            }
        }
        .cityList {
            margin: 20px 0 50px;
            .cityName {
                display: flex;
                flex-wrap: wrap;
                > .el-checkbox {
                    margin-right: 20px;
                    width: 120px;
                    &:first-child{
                        margin-left: 30px;
                    }
                }
            }
        }
        .dialog-footer {
            display: flex;
            justify-content: flex-end;
            .el-button {
                width:100px;
                height:36px;
                border-radius:18px;
            }
        }
    }
}
/deep/ .el-dialog__header {
    border: 1px solid rgba(232, 234, 246, 1);
}
</style>

