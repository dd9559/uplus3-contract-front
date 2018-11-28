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
                <el-input size="small" v-model="searchForm.flowType"></el-input>
            </div>
            <div class="input-group">
                <label>流程类型</label>
                <el-select size="small" v-model="searchForm.bizCode">
                    <!-- <el-option></el-option> -->
                </el-select>
                <el-select size="small" v-model="searchForm.condition">
                    <!-- <el-option></el-option> -->
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
                    v-for="item in tHeader"
                    :key="item.id"
                    align="center"
                    :label="item.name"
                    :prop="item.prop">
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="medium" @click="operation('编辑',2)">编辑</el-button>
                            <el-button type="text" size="medium">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 添加 编辑 弹窗 -->
        <el-dialog :title="aduitTitle" :visible.sync="aduitDialog" width="740px">
            <div class="aduit-content">
                <div class="aduit-input">
                    <label>选择城市:</label>
                    <el-select size="small" v-model="aduitForm.cityId">
                        <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.cityId"></el-option>
                    </el-select>
                </div>
                <div class="aduit-input">
                    <label>流程名称:</label>
                    <el-input size="small" v-model="aduitForm.flowType"></el-input>
                </div>
                <div class="aduit-input">
                    <label>流程类型:</label>
                    <el-select size="small" v-model="aduitForm.bizCode">
                        <!-- <el-option></el-option> -->
                    </el-select>
                </div>
                <div class="aduit-input">
                    <label>分支条件:</label>
                    <el-select size="small" v-model="aduitForm.condition">
                        <!-- <el-option></el-option> -->
                    </el-select>
                </div>
                <div class="aduit-input aduit-node">
                    <label>分支节点:</label>
                    <ul>
                        <li v-for="(item,index) in nodeList" :key="index">
                            <el-input size="small" v-model="item.name" placeholder="设置节点名称"></el-input>
                            <el-select size="small" class="people-type" v-model="item.type">
                                <el-option v-for="item in dictionary['37']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                            </el-select>
                            <div v-if="false">
                                <el-select size="small" class="department" v-model="item.department"></el-select>
                                <el-select size="small" class="person" v-model="item.people"></el-select>
                            </div>
                            <el-select v-if="false" size="small" class="other" v-model="item.role"></el-select>
                            <div class="row-icon">
                                <span class="button" @click="addRow"><i class="icon el-icon-plus"></i></span>
                                <span class="button" @click="removeRow(index)"><i class="icon el-icon-minus"></i></span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="aduit-input">
                    <label class="mr-7">流程描述:</label>
                    <el-input type="textarea"></el-input>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {MIXINS} from "@/assets/js/mixins";
    let arr = [
        {
            name: "",
            type: "",
            department: "",
            people: "",
            role: ""
        }
    ]

    export default {
        name: "approvalProcess",
        mixins: [MIXINS],
        data() {
            return {
                searchForm: {
                    cityId: "",
                    flowType: "",
                    bizCode: "",
                    condition: ""
                },
                tableData: [],
                tHeader: [
                    {
                        id: 1,
                        prop: "",
                        name: "流程名称"
                    },
                    {
                        id: 2,
                        prop: "",
                        name: "城市"
                    },
                    {
                        id: 3,
                        prop: "",
                        name: "添加时间"
                    },
                    {
                        id: 4,
                        prop: "",
                        name: "流程类型"
                    },
                    {
                        id: 5,
                        prop: "",
                        name: "分支条件"
                    },
                    {
                        id: 6,
                        prop: "",
                        name: "分支节点"
                    }
                ],
                cityList: [],
                aduitDialog: false,
                aduitTitle: "",
                aduitForm: {
                    cityId: "",
                    flowType: "",
                    bizCode: "",
                    condition: ""
                },
                nodeList: [],
                dictionary: {
                    '37':''
                }
            }
        },
        created() {
            this.getCityList()
            this.getDictionary()
            this.getData()
            this.nodeList = JSON.parse(JSON.stringify(arr))
        },
        methods: {
            getData() {
                let param = {
                    cityId: 0
                }
                this.$ajax.get('/api/auditflowinstance/selectFlowList',param).then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.tableData = res.data
                    }
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
            operation(title,type) {
                this.aduitDialog = true
                this.aduitTitle = title
            },
            addRow() {
                let row = {
                    name: "",
                    type: ""
                }
                this.nodeList.push(row)
            },
            removeRow(index) {
                this.nodeList.splice(index,1)
            },
            queryFn() {

            },
            resetFormFn() {

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
        }
        .mr-7 {
            margin-right: 7px;
        }
        &:nth-child(-n+4) {
            /deep/ .el-input {
                width: 246px;
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
                .department {
                    /deep/ .el-input {
                        width: 156px;
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
</style>
