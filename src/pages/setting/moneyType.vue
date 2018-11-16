<template>
    <div class="view-container">
        <div class="data-list gap">
            <p class="title">
                <span>数据列表</span>
            </p>
            <el-table :data="tableData" @row-click="rowClick" highlight-current-row>
                <el-table-column align="center" label="序号" type="index" width="90"></el-table-column>
                <el-table-column align="center" label="款类(大类)" prop="moneyType" width="120"></el-table-column>
                <el-table-column align="center" label="是否启用" width="150">
                    <template slot-scope="scope">
                        <el-switch
                        v-model="value2"
                        active-color="rgba(71,141,227,1)"
                        inactive-color="rgba(141,144,148,1)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="150">
                    <template slot-scope="scope">
                        <el-button type="text" size="medium">新增</el-button>
                        <el-button type="text" size="medium">删除</el-button>
                        <el-button v-if="scope.row.moneyType === '代管'" type="text" size="medium" @click="dialogCitySettingVisible = true">城市设置</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="commission gap">
            <p class="title">
                <span>佣金</span>
            </p>
            <el-table :data="commissionData">
                <el-table-column align="center" label="序号" type="index"></el-table-column>
                <el-table-column align="center" label="款类(小类)"></el-table-column>
                <el-table-column align="center" label="描述"></el-table-column>
                <el-table-column align="center" label="是否启用">
                    <template slot-scope="scope">
                        <el-switch
                        v-model="value2"
                        active-color="rgba(71,141,227,1)"
                        inactive-color="rgba(141,144,148,1)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="收款账户"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="medium">新增</el-button>
                        <el-button type="text" size="medium">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
        title="代管款类监管城市设置"
        :visible.sync="dialogCitySettingVisible"
        width="740px">
        <div class="citySettingContent">
            <div class="tip">
                <span>提示:</span>
                <div class="message">
                    <p>设置代管款类交管系统收款后，代管款类需在交管系统进行收款记录。</p>
                    <p>（未勾选的城市需在联动优势公众号进行代管类的收款）</p>
                </div>
            </div>
            <div class="cityList">
                <el-checkbox-group v-model="cityName" class="cityName">
                    <el-checkbox  v-for="item in cityListData" :key="item.id">{{ item.name }}</el-checkbox>
                </el-checkbox-group>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogCitySettingVisible = false">取消</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </div>
        </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [
                    {
                        id: 1,
                        moneyType: "佣金",
                    },
                    {
                        id: 2,
                        moneyType: "金融类",
                    },
                    {
                        id: 3,
                        moneyType: "违约金",
                    },
                    {
                        id: 4,
                        moneyType: "代管",
                    }
                ],
                commissionData: [],
                value2: true,
                dialogCitySettingVisible: false,
                cityListData: [
                    { id: 1, name: "武汉" },
                    { id: 2, name: "乌鲁木齐" },
                    { id: 3, name: "长沙" },
                    { id: 4, name: "武汉" },
                    { id: 5, name: "武汉" },
                    { id: 6, name: "长沙" },
                    { id: 7, name: "乌鲁木齐" },
                    { id: 8, name: "武汉" },
                    { id: 9, name: "武汉" },
                    { id: 10, name: "武汉" },
                    { id: 11, name: "石家庄" },
                    { id: 12, name: "长沙" }
                ],
                cityName: ""
            }
        },
        created(){
           this.initList()
         
        },
        methods: {
            // 初始化数据
            initList(){
                this.$ajax.get('api/setting/moneyType/list',{id:''},).then((res)=>{
                    console.log(res);
                })
            },
            //城市设置弹框 确定
            confirm() {

            },
            //单击行事件
            rowClick(row, event, column) {
                
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

