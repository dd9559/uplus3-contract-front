<template>
    <div>
        <ScreeningTop
        @propQueryFn="queryFn"
        @propResetFormFn="resetFormFn">
        <div class="content">
            <div class="input-group">
                <label>选择城市</label>
                <el-select size="small" v-model="searchForm.cityId" :clearable="true">
                    <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.cityId"></el-option>
                </el-select>
            </div>
            <div class="input-group">
                <label>运营模式</label>
                <el-select size="small" v-model="searchForm.deptAttr" :clearable="true">
                    <el-option v-for="item in dictionary['39']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
            </div>
            <div class="input-group">
                <label>流程名称</label>
                <el-input size="small" v-model="searchForm.name" :clearable="true" onkeyup="value=value.replace(/\s+/g,'')"></el-input>
            </div>
            <div class="input-group">
                <label>流程类型</label>
                <el-select size="small" v-model="searchForm.type" @change="changeFlowType" :clearable="true">
                    <el-option v-for="item in dictionary['573']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
                <el-select size="small" v-model="searchForm.branchCondition" :clearable="true" class="branch-condition">
                    <el-option v-for="item in conditionList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                </el-select>
            </div>
        </div>
        </ScreeningTop>
        <div class="aduit-list">
            <p>
                <span><i class="iconfont icon-tubiao-11 mr-8"></i>数据列表</span>
                <el-button @click="operation('添加',1)">添加</el-button>
            </p>
            <div class="table">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column align="center" label="流程名称" prop="name"></el-table-column>
                    <el-table-column align="center" label="城市" prop="cityName">
                        <template slot-scope="scope">
                            <span>{{scope.row.cityName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="运营模式" prop="deptAttr" :formatter="nullFormatter"></el-table-column>
                    <el-table-column align="center" label="流程类型" prop="type">
                        <template slot-scope="scope">
                            <span>{{scope.row.type|getTypeName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="分支条件" prop="branchCondition">
                        <template slot-scope="scope">
                            <span>{{scope.row.conditionName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="分支节点" prop="name">
                        <template slot-scope="scope">
                            <p v-for="item in scope.row.branch" :key="item.sort">{{item.name}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="medium" @click="operation('编辑',2,scope.row)">编辑</el-button>
                            <el-button type="text" size="medium" @click="delFlow(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
            v-show="tableData.length"
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
        <el-dialog :title="aduitTitle" :visible.sync="aduitDialog" width="740px" :closeOnClickModal="$tool.closeOnClickModal">
            <div class="aduit-content">
                <div class="aduit-input">
                    <label>选择城市:</label>
                    <el-select size="small" v-model="aduitForm.cityId" :disabled="editDisabled">
                        <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.cityId"></el-option>
                    </el-select>
                </div>
                <div class="aduit-input">
                    <label>运营模式:</label>
                    <el-select size="small" v-model="aduitForm.deptAttr" :disabled="editDisabled">
                        <el-option v-for="item in dictionary['39']" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
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
                <div class="aduit-input">
                    <label>流程名称:</label>
                    <el-input size="small" v-model="aduitForm.name" onkeyup="value=value.replace(/\s+/g,'')"></el-input>
                </div>
                <div class="aduit-node">
                    <div>
                        <label>分支节点:</label>
                        <el-radio-group v-model="isAudit">
                            <el-radio label="1">需要审核</el-radio>
                            <el-radio label="0">无需审核</el-radio>
                        </el-radio-group>
                    </div>
                    <ul v-if="isAudit==='1'">
                        <li v-for="(item,index) in nodeList" :key="index">
                            <el-input size="small" v-model="item.name" placeholder="设置节点名称" onkeyup="value=value.replace(/\s+/g,'')"></el-input>
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
                    <el-input type="textarea" v-model.trim="aduitForm.flowDesc"></el-input>
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
    const rule = {
        cityId: {
            name: "城市选择"
        },
        deptAttr: {
            name: "运营模式"
        },
        name: {
            name: "流程名称"
        },
        flowDesc: {
            name: "流程描述"
        }
    }
    let flowType = ["付款审核","收款审核","应收业绩审核","合同审核","调佣审核","结算审核"]
    let sortNo = 2
    let arr = [
        {
            name: "提审人",
            type: 0,
            sort: 1,
            userId: "",
            userName: "",
            isAudit: "1"
        },
        {
            name: "",
            type: "",
            sort: 2,
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
                    deptAttr: "",
                    type: "",
                    branchCondition: ""
                },
                tableData: [],
                cityList: [],
                aduitDialog: false,
                aduitTitle: "",
                aduitForm: {
                    cityId: "",
                    deptAttr: "",
                    name: "",
                    type: "",
                    branchCondition: "",
                    flowDesc: ""
                },
                isAudit: "",
                nodeList: [],
                dictionary: {
                    '37':'',
                    '39':'',
                    '573':'',
                    '580':'',
                    '586':'',
                    '597':'',
                    '599':'',
                    '601':'',
                    '603':''
                },
                pageSize: 5,
                pageNum: 1,
                total: 0,
                conditionList: [],
                depsList: [],
                roleList: [],
                editDisabled: false,
                currentFlowId: ""
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
                    this.$message({message:error})
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
                    this.nodeList[1].type = ""
                    this.nodeList[1].name = ""
                    this.$tool.clearForm(this.aduitForm)
                    this.isAudit = ""
                    this.editDisabled = false
                } else {
                    this.nodeList = [...row.branch]
                    let {...currentRow} = row
                    this.currentFlowId = currentRow.id
                    this.aduitForm.cityId = currentRow.cityId
                    this.aduitForm.deptAttr = currentRow.deptAttr.value
                    this.aduitForm.name = currentRow.name
                    this.aduitForm.type = currentRow.type
                    this.aduitForm.branchCondition = +currentRow.branchCondition.slice(-1)
                    this.isAudit = currentRow.branch[0].isAudit.toString()
                    this.aduitForm.flowDesc = currentRow.flowDesc
                    this.setConditionList(currentRow.type)
                    this.editDisabled = true
                }
            },
            delFlow(row) {
                let param = {
                    id: row.id
                }
                this.$confirm('是否删除该流程?', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    this.$ajax.postJSON('/api/auditflow/operateFlow',param).then(res => {
                        res = res.data
                        if(res.status === 2013) {
                            this.$message(res.message)
                        } else if(res.status === 200) {
                            this.$message("删除成功")
                            this.getData()
                        }
                    }).catch(error => {
                        this.$message({message:error})
                    })
                })   
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
                this.searchForm.branchCondition = ""
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
                this.$tool.checkForm(this.aduitForm,rule).then(() => {
                    let isOk
                    if(this.isAudit === '0') {
                        let arr1 = [{
                            name: "",
                            type: "",
                            sort: 1,
                            userId: "",
                            userName: "",
                            isAudit: "0"
                        }]
                        this.nodeList = arr1
                    } else {
                        this.nodeList.forEach(item => {
                            isOk = false
                            if(item.name) {
                                if(item.type) {
                                    if(item.userId&&item.type===1 || item.userId&&item.type===2) {
                                        isOk = true
                                    } else {
                                        this.$message({message:item.type===1?"请选择门店":"请选择职务"})
                                    }
                                } else {
                                    this.$message({message:"审批人类型不能为空"})
                                }
                            } else {
                                this.$message({message:"节点名称不能为空"})
                            }
                        })
                    }
                    let param = {
                        branch: this.nodeList
                    }
                    param = Object.assign({},this.aduitForm,param)
                    const url = "/api/auditflow/operateFlow"
                    if(isOk) {
                        if(this.aduitTitle === "添加") {
                            this.aduitPost(url,param)
                        } else {
                            param.id = this.currentFlowId
                            this.aduitPost(url,param)
                        }
                    }
                }).catch(error => {
                    this.$message({message:`${error.title}${error.msg}`})
                })
            },
            aduitPost(url,param) {
                this.$ajax.postJSON(url,param).then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.aduitDialog = false
                        this.$message(res.message)
                        this.getData()
                    }
                }).catch(error => {
                    this.$message({message:error})
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
        },
        filters: {
            getBranchName(val) {
                return val.slice(-1)
            },
            getTypeName(val) {
                for(var i = 0; i < flowType.length; i++) {
                    if(val === i) {
                        return flowType[i]
                    }
                }
            }
        }
    }
</script>

<style lang="less" scoped>
@import "~@/assets/common.less";
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
            }
        }
        .branch-condition {
            /deep/ .el-input {
                margin-left: 20px;
            }
        }
    }
}
.aduit-list {
    padding: 5px 10px;
    > p { 
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: @size-14;
    margin-bottom: 5px;
    .mr-8 {
      margin-right: 8px;
    }
    > .el-button {
      width:80px;
      height:32px;
      padding: 4px 0;
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
        &:nth-child(-n+5) {
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
        > div {
            margin-bottom: 18px;
            label {
                margin-right: 10px;
            }
        }
        ul {
            li {
                display: flex;
                margin-bottom: 9px;
                padding-left: 70px;
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
                    display: none;
                    .row-icon {
                        span:last-child {
                            display: none;
                        }
                    }
                }
                &:last-child {
                    margin-bottom: 18px;
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
