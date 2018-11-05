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
      <el-button type="primary" class="el-icon-plus" @click="showModal('添加步骤类型')">添加步骤类型</el-button>
    </div>
</template>
           
<script>
import {FILTER} from "@/assets/js/filter";
export default{
        data(){
            return{
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
<style scoped>
            
</style>