<template>
    <div class="data-list">
        <div class="table_head">
            <el-button type="primary" plain>添加</el-button>
        </div>
        <el-table :data="listData" style="width: 100%">
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
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, next, jumper"
            :total="total">
        </el-pagination>
        <el-dialog title="添加交易流程" :visible.sync="dialogFormVisible">
          <el-form :model="form" label-width="90px">
            <el-form-item label="活动名称：">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-form>
        </el-dialog>
    </div>
</template>
           
<script>
  import { FILTER } from "@/assets/js/filter"
  export default {
    mixins: [FILTER],
    data() {
      return {
        listData: [],
        dialogFormVisible: false,
        form: {
          name: ""
        },
        tHeader: [
          {
            id: 1,
            prop: "id",
            name: "序号"
          },
          {
            id: 2,
            prop: "name",
            name: "名称"
          },
          {
            id: 3,
            prop: "stepsNum",
            name: "步骤数量"
          }
        ],
        pageSize: 5,
        pageNum: 1,
        total: 0
      };
    },
    methods: {
      getData: function() {
        let param = {
          cityId: "1"
        };
        this.$ajax
          .postJSON(`/api/flowmanage/selectFlowPageList`, param)
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              console.log(res.data);
              this.listData = res.data;
            }
          });
      },
      rowOperation(row, type) {
        
      },
      handleSizeChange(val) {
        this.pageSize = val
      },
      handleCurrentChange(val) {
        this.pageNum = val
      }
    },
    created() {
      this.getData();
    },
    mounted() {}
  };
</script>
<style lang="less" scoped>
  .data-list {
    .table_head {
      height:54px;
      background: #fff;
      border-top: 1px solid rgba(237,236,240,1);
      button:nth-of-type(1){
        float: right;
        width:100px;
        height:36px;
        margin-right: 15px;
        color: white;
        margin-top: 9px;
        background:rgba(71,141,227,1);
        border-radius:18px;
      }
    }
    /deep/
    .el-table {
      height: 500px;
      margin-bottom: 15px;
    }
    /deep/
    .el-pagination {
      text-align: center;
      margin-left: 100px;
    }
    /deep/ .el-table th {
      background:rgba(238,242,251,1);
    }
  }
</style>