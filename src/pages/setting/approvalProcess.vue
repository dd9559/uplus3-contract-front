<template>
    <div>
        <ScreeningTop
        @propQueryFn="queryFn"
        @propResetFormFn="resetFormFn">
        <div class="content">
            <div class="input-group">
                <label>选择城市</label>
                <el-select size="small" v-model="searchForm.cityId">
                    <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.cityId"></el-option>
                </el-select>
            </div>
            <div class="input-group">
                <label>流程名称</label>
                <el-input size="small" v-model="searchForm.name"></el-input>
            </div>
            <div class="input-group">
                <label>流程类型</label>
                <el-select size="small" v-model="searchForm.type" @change="changeFlowType">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in dictionary['573']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
                <el-select size="small" v-model="searchForm.branchCondition">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in conditionList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
            </div>
        </div>
        </ScreeningTop>
        <div class="aduit-list">
            <p>
                <span>数据列表</span>
                <el-button @click="operation('添加',1)">添加</el-button>
            </p>
            <div class="table">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column
                    :formatter="nullFormatter"
                    v-for="item in tHeader"
                    :key="item.id"
                    align="center"
                    :label="item.name"
                    :prop="item.prop">
                    </el-table-column>
                    <el-table-column align="center" label="分支节点">
                        <template slot-scope="scope">
                            <p v-for="item in scope.row.branch" :key="item.sort">{{item.name}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="medium" @click="operation('编辑',2,scope.row)">编辑</el-button>
                            <el-button type="text" size="medium">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
            class="pagination-info"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </div>
        <!-- 添加 编辑 弹窗 -->
        <el-dialog :title="aduitTitle" :visible.sync="aduitDialog" width="740px">
            <div class="aduit-content">
                <div class="aduit-input">
                    <label>选择城市:</label>
                    <el-select size="small" v-model="aduitForm.cityId" :disabled="editDisabled">
                        <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.cityId"></el-option>
                    </el-select>
                </div>
                <div class="aduit-input">
                    <label>流程名称:</label>
                    <el-input size="small" v-model="aduitForm.name"></el-input>
                </div>
                <div class="aduit-input">
                    <label>流程类型:</label>
                    <el-select size="small" v-model="aduitForm.type" @change="changeFlowType" :disabled="editDisabled">
                        <el-option v-for="item in dictionary['573']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </div>
                <div class="aduit-input">
                    <label>分支条件:</label>
                    <el-select size="small" v-model="aduitForm.branchCondition" :disabled="editDisabled">
                        <el-option v-for="item in conditionList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </div>
                <div class="aduit-input aduit-node">
                    <label>分支节点:</label>
                    <ul>
                        <li v-for="(item,index) in nodeList" :key="index">
                            <el-input size="small" v-model="item.name" placeholder="设置节点名称"></el-input>
                            <el-select size="small" class="people-type" v-model="item.type" @change="getTypeOption(item.type,index)">
                                <el-option v-for="item in dictionary['37']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                            <el-select v-if="item.type===2||item.type===1" size="small" class="other" v-model="item.userId" filterable @change="selectUser(item.type,index)">
                                <el-option
                                v-for="option in (item.type===1?depsList:roleList)"
                                :key="item.type===1?option.id:option.key"
                                :label="item.type===1?option.name:option.value"
                                :value="item.type===1?option.id:option.key"
                                ></el-option>
                            </el-select>
                            <div class="row-icon">
                                <span class="button" @click="addRow"><i class="icon el-icon-plus"></i></span>
                                <span class="button" @click="removeRow(index)"><i class="icon el-icon-minus"></i></span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="aduit-input">
                    <label class="mr-7">流程描述:</label>
                    <el-input type="textarea" v-model="aduitForm.flowDesc"></el-input>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isSave">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {FILTER} from "@/assets/js/filter";
    import {MIXINS} from "@/assets/js/mixins";
    let sortNo = 1
    let arr = [
        {
            name: "",
            type: "",
            sort: 1,
            userId: "",
            userName: ""
        }
    ]

    export default {
        name: "approvalProcess",
        mixins: [FILTER,MIXINS],
        data() {
            return {
                searchForm: {
                    cityId: "",
                    name: "",
                    type: "",
                    branchCondition: "",
                    flowDesc: "",
                    priority: ""
                },
                tableData: [],
                tHeader: [
                    {
                        id: 1,
                        prop: "name",
                        name: "流程名称"
                    },
                    {
                        id: 2,
                        prop: "cityId",
                        name: "城市"
                    },
                    {
                        id: 3,
                        prop: "",
                        name: "添加时间"
                    },
                    {
                        id: 4,
                        prop: "type",
                        name: "流程类型"
                    },
                    {
                        id: 5,
                        prop: "branchCondition",
                        name: "分支条件"
                    }
                ],
                cityList: [],
                aduitDialog: false,
                aduitTitle: "",
                aduitForm: {
                    cityId: "",
                    name: "",
                    type: "",
                    branchCondition: "",
                    flowDesc: "",
                    priority: ""
                },
                nodeList: [],
                dictionary: {
                    '37':'',
                    '573':'',
                    '580':'',
                    '586':'',
                    '597':'',
                    '599':'',
                    '601':'',
                    '603':''
                },
                pageSize: 3,
                pageNum: 1,
                total: 0,
                conditionList: [],
                depsList: [],
                roleList: [],
                editDisabled: false
            }
        },
        created() {
            this.getCityList()
            this.getDictionary()
            this.getData()
            this.getDeps()
            this.getRoles()
        },
        methods: {
            getData() {
                let param = {
                    pageSize: this.pageSize,
                    pageNum: this.pageNum
                }
                param = Object.assign({},this.searchForm,param)
                this.$ajax.get('/api/auditflow/selectFlowList',param).then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.tableData = res.data.data
                        this.total = res.data.total
                    }
                }).catch(error => {
                    console.log(error);
                })
            },
            getCityList() {
                this.$ajax.get('/api/organize/cities').then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.cityList = res.data
                    }
                })
            },
            getDeps() {
                this.$ajax.get('/api/access/deps').then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.depsList = res.data
                    }
                })
            },
            getRoles() {
                this.$ajax.get('/api/roles').then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.roleList = res.data
                    }
                })
            },
            operation(title,type,row) {
                this.aduitDialog = true
                this.aduitTitle = title
                if(type === 1) {
                    this.nodeList = [...arr]
                    this.nodeList[0].type = ""
                    this.nodeList[0].name = ""
                    this.$tool.clearForm(this.aduitForm)
                    this.editDisabled = false
                } else {
                    this.nodeList = [...row.branch]
                    let {...currentRow} = row
                    this.aduitForm.cityId = currentRow.cityId
                    this.aduitForm.name = currentRow.name
                    this.aduitForm.type = currentRow.type
                    this.aduitForm.branchCondition = +currentRow.branchCondition
                    this.aduitForm.flowDesc = currentRow.flowDesc
                    this.setConditionList(currentRow.type)
                    this.editDisabled = true
                }
            },
            setConditionList(val) {
                switch(val) {
                    case 0:
                        this.conditionList = this.dictionary['586']
                        break
                    case 1:
                        this.conditionList = this.dictionary['597']
                        break
                    case 2:
                        this.conditionList = this.dictionary['603']
                        break
                    case 3:
                        this.conditionList = this.dictionary['580']
                        break
                    case 4:
                        this.conditionList = this.dictionary['599']
                        break
                    case 5:
                        this.conditionList = this.dictionary['601']
                        break
                }
            },
            changeFlowType(val) {
                this.aduitForm.branchCondition = ""
                this.setConditionList(val)
            },
            getTypeOption(type,index) {
                this.nodeList[index].userId = ""
            },
            selectUser(type,index) {
                if(type === 1) {
                    this.depsList.find(item => {
                        if(this.nodeList[index].userId === item.id) {
                            this.nodeList[index].userName = item.name
                        }
                    })
                } else if(type === 2) {
                    this.roleList.find(item => {
                        if(this.nodeList[index].userId === item.key) {
                            this.nodeList[index].userName = item.value
                        }
                    })
                }
            },
            addRow() {
                let row = {
                    name: "",
                    type: "",
                    sort: ++sortNo,
                    userId: "",
                    userName: ""
                }
                this.nodeList.push(row)
            },
            removeRow(index) {
                this.nodeList.splice(index,1)
            },
            isSave() {
                let param = {
                    branch: JSON.stringify(this.nodeList)
                }
                param = Object.assign({},this.aduitForm,param)
                if(this.aduitTitle === "添加") {
                    const url = "/api/auditflow/insertFlow"
                    this.aduitPost(url,param)
                } else {
                    console.log("编辑");
                }
            },
            aduitPost(url,param) {
                this.$ajax.post(url,param).then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.aduitDialog = false
                        this.$message(res.message)
                        this.getData()
                    }
                })
            },
            queryFn() {
                this.getData()
            },
            resetFormFn() {
                this.$tool.clearForm(this.searchForm)
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.getData()
            },
            handleCurrentChange(val) {
                this.pageNum = val
                this.getData()
            }

        }
    }
</script>

<style lang="less" scoped>
.content {
    display: flex;
    color: #6C7986;
    .input-group {
        margin-right: 20px;
        label {
            font-size: 14px;
        }
        /deep/ .el-input {
            margin-left: -10px;
        }
        &:last-child {
            /deep/ .el-input {
                width: 162px;
                margin-right: 15px;
            }
        }
    }
}
.aduit-list {
    padding: 20px 10px;
    > p {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 18px;
    > .el-button {
      width:100px;
      height:36px;
      border-radius:18px;
      background-color: #478DE3;
      color: #fff;
    }
  }
}
.aduit-content {
    .aduit-input {
        display: flex;
        margin-bottom: 19px;
        > label {
            width: 70px;
            line-height: 32px;
        }
        .mr-7 {
            margin-right: 7px;
        }
        &:nth-child(-n+4) {
            /deep/ .el-input {
                width: 246px;
            }
        }
        &:last-child {
            /deep/ .el-textarea__inner {
                background-color: #ECEFF2;
            }
        }
    }
    .aduit-node {
        ul {
            li {
                display: flex;
                margin-bottom: 9px;
                /deep/ .el-input {
                    margin-right: 7px;
                    &:first-child {
                        width: 150px;
                    }
                }
                .people-type {
                    /deep/ .el-input {
                        width: 110px;
                    }
                }
                .person {
                    /deep/ .el-input {
                        width: 115px;
                    }
                }
                .other {
                    /deep/ .el-input {
                        width: 279px;
                    }
                }
                .row-icon {
                    width: 65px;
                    position: absolute;
                    right: 20px;
                    display: flex;
                    justify-content: space-between;
                    .button {
                        display: inline-block;
                        padding: 0;
                        width: 30px;
                        height: 30px;
                        line-height: 30px;
                        background: #c8c8c8;
                        border-radius: 50%;
                        text-align: center;
                        cursor: pointer;
                        i {
                            color: #fff;
                            font-weight: bold;
                        }
                    }
                }
                &:first-child {
                    .row-icon {
                        span:last-child {
                            display: none;
                        }
                    }
                }
            }
        }
    }
}
/deep/ .el-table th {
  background:#EEF2FB;
}
/deep/ .el-dialog__header {
    border-bottom: 1px solid #EDECF0;
}
/deep/ .el-dialog__body {
    padding-bottom: 0;
}
/deep/ .el-dialog__footer {
    padding-bottom: 34px;
    .el-button {
        width: 100px;
        height: 38px;
        border-radius: 19px;
        background-color: #478DE3;
        color: #fff;
    }
}
</style>
