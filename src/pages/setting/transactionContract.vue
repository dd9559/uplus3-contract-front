<template>
    <div class="data-list">
        <div class="table_head">
            <el-button type="primary" @click="contractVisible = true">添加</el-button>
        </div>
        <el-table :data="listData" style="width: 100%" @row-dblclick="getRowDetails" class="contract-list">
            <el-table-column align="center" :label="item.name" :prop="item.prop" :formatter="nullFormatter"
                v-for="item in tHeader" :key="item.id">
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button @click="rowOperation(scope.row,1)" type="text" size="small">编辑</el-button>
                    <el-button @click="rowOperation(scope.row,2)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column> 
        </el-table>
        <!-- 添加合同资料 -->
        <el-dialog title="添加合同资料" :visible.sync="contractVisible" width="740px">
            <el-form v-model="contractForm" class="contract-form">
                <el-form-item label="信息类型">
                    <el-select v-model="contractForm.infoType">
                        <el-option value=""></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资料名称">
                    <el-input v-model="contractForm.name" maxlength="15"></el-input>
                    
                </el-form-item>
                <el-form-item label="是否必填">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="2">否</el-radio>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
           
<script>
    import {FILTER} from "@/assets/js/filter";
    export default {
        mixins: [FILTER],
        data() {
            return {
                listData: [],
                tHeader: [
                    {
                        id: 1,
                        prop: 'id',
                        name: '序号'
                    },
                    {
                        id: 2,
                        prop: 'name',
                        name: '名称'
                    },
                    {
                        id: 3,
                        prop: 'type',
                        name: '信息类型'
                    },
                    {
                        id: 4,
                        prop: 'isNecessary',
                        name: '是否为必选项'
                    }
                ],
                contractVisible: false,
                contractForm: {
                    infoType: "",
                    name: ""
                }
            }
        },
        methods:{
            getData: function () {
                let param = {
                    cityId:1
                }
                this.$ajax.postJSON('/api/flowmanage/selectConAttachPageList',param)
                .then(res => {
                res = res.data
                if (res.status === 200) {
                    console.log(res.data)
                    this.listData = res.data
                    this.listData.forEach((item)=>{
                        item.isNecessary==1?item.isNecessary='是':item.isNecessary='否'
                    })
                }
                })
            },
            getRowDetails: function () {}
        },
        created() {
            console.log(1)
            this.getData()
        },
        mounted() {

        }
    }
</script>
<style scoped lang="less">
.data-list {
    .table_head {
        padding: 12px 10px;
        display: flex;
        justify-content: flex-end;
        background-color: #fff;
        border-top: 1px solid rgba(237,236,240,1);
        .el-button {
            width: 100px;
            height: 36px;
            border-radius: 18px;
        }
    }
    .contract-list {
        padding: 0 10px;
    }
    .contract-form {
        .el-form-item {
            display: flex;
        }
    }
} 
</style>