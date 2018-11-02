<template>
    <div class="data-list">    
      <div class="one">
        <div class="title">
          <span>步骤类型</span>
          <el-button type="primary" class="el-icon-plus" @click="showModal('添加步骤类型')">添加步骤类型</el-button>
        </div>
          <el-table :data="listData" style="width: 400px" class="onetable">
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
      </div>
      <div class="two">
          <div class="title">
            <span></span>
            <span>交易步骤</span>
          </div>
          <el-table :data="listData" class="twotable">
            <el-table-column align="center" :label="item.name" :prop="item.prop" :formatter="nullFormatter"
                            v-for="item in tHeader2" :key="item.id">
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button @click="rowOperation(scope.row,1)" type="text" size="small">编辑</el-button>
                <el-button @click="rowOperation(scope.row,2)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
      </div>
    </div>
</template>
           
<script>
import {FILTER} from "@/assets/js/filter";
export default{
        data(){
          return {
             listData: [],
             listData2: [],
              tHeader: [
                  {
                    id: 1,
                    prop: 'typeName',
                    name: '步骤类型'
                  },
                  {
                    id: 2,
                    prop: 'dutyType',
                    name: '负责角色'
                  },
                  {
                    id: 3,
                    prop: 'stepsNum',
                    name: '步骤数量'
                  }
                ],
              tHeader2: [
                  {
                    id: 1,
                    prop: 'stepsList.stepsTypeName',
                    name: '步骤类型'
                  },
                  {
                    id: 2,
                    prop: 'dutyType',
                    name: '步骤名称'
                  },
                  {
                    id: 3,
                    prop: 'stepsNum',
                    name: '步骤数量'
                  }
                ],
                
          }
        },
        methods:{
            getData: function () {
                this.$ajax.get(`/api/flowmanage/selectTypeStepsList`, {cityId: 1}).then(res => {
                res = res.data
                if (res.status === 200) {
                    console.log(res.data)
                    this.listData = res.data
                    // this.listData2=this.listData.
                }
                })
            },
      },
      created(){
            this.getData();
      }     
  }
</script>
<style lang="less" scoped>

.data-list{
    width: 100%;
    background-color: pink;
    height: 800px;
    .one{
      float: left;
      .title{
        line-height: 40px;
        button{
          float: right;
        }
      }
    }
    .two{
      float:right;
      .title{
        line-height: 40px;
      }
      
    }
}
</style>