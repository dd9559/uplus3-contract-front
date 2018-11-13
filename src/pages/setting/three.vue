<template>
    <div class="data-list">
      <el-table :data="listData" style="width: 100%" @row-dblclick="getRowDetails">
       <el-table-column align="center" :label="item.name" :prop="item.prop" :formatter="nullFormatter"
                         v-for="item in tHeader" :key="item.id">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
              <el-button @click="rowOperation(scope.row,1)" type="text" size="small">交易流程管理</el-button>
            <el-button @click="rowOperation(scope.row,1)" type="text" size="small">编辑</el-button>
            <el-button @click="rowOperation(scope.row,2)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column> 
      </el-table>
      <!-- 分页 -->
      <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, next, jumper"
            :total="total">
       </el-pagination>
      <!-- 添加合同资料 -->
      <el-dialog class="addContractMsg" title="添加合同资料" :visible.sync="addContractMsg">
        <el-form :model="ContractMsgForm">
          <el-form-item label="消息类型" label-width="120px" class="news">
            <el-select v-model="ContractMsgForm.msgType">
              <el-option value=''></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资料名称" label-width="120px" class="dataname">
            <el-input v-model="ContractMsgForm.dataName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否必填" label-width="120px">
            <el-radio-group v-model="ContractMsgForm.isNecessary">
                <el-radio label="是"></el-radio>
                <el-radio label="否"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addContractMsg = false">取 消</el-button>
          <el-button type="primary" @click="addHT">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
           
<script>
import {FILTER} from "@/assets/js/filter";
export default{
        mixins: [FILTER],
        data(){
            return{
                ContractMsgForm:{
                    msgType:'',
                    dataName:'',
                    isNecessary:''
                },
                 listData: [],
                 tHeader: [
                 {id: 1,  prop: 'id', name: '序号'},
                 {id: 2, prop: 'name',  name: '名称'},
                 {id: 3,prop: 'type',name: '信息类型'},
                 {id: 4, prop: 'isNecessary',name: '是否为必选项'}
                 ],
                 addContractMsg:true,
                 pageNum:1,
                 pageSize:10,
                 total:10,
                }
            },
        methods:{
            handleSizeChange(){
                console.log('sizCchange');
            },
            handleCurrentChange(){
                console.log('handleCurrentChange')
            },
            addHT(){
                alert(1)
            },
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
            getRowDetails:function(){}
        },
        created(){
            console.log(1)
            this.getData()
        },
        mounted(){

        }
}
</script>
<style lang='less' scoped>
/deep/ .el-pagination{
        text-align: center
    }
.addContractMsg{
    .dataname /deep/ .el-input__inner{
        width: auto
    }
}
</style>