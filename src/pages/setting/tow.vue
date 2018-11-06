<template>
    <div class="data-list">
        <div class="table_head">
            <el-button icon="el-icon-mobile-phone" circle></el-button>
            <span>交易流程</span>
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
            :current-page="1"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, next, jumper"
            :total="400">
        </el-pagination>
      <el-button type="primary" class="el-icon-plus" @click="showModal('添加步骤类型')">添加步骤类型</el-button>
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
export default {
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
      ]
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
    handleCurrentChange:function(){
            
    }
  },
  created() {
    this.getData();
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.data-list{
    .table_head{
        height:54px;
        background:rgba(238,242,251,1);
        border-radius:4px;
        button:nth-of-type(1){
            width:100px;
            height:36px;
            margin-top: 5px;
            color: white;
            margin-top: 9px;
            background:rgba(71,141,227,1);
            border-radius:18px;
        }
        button:nth-of-type(2){
            float: right;
            width:100px;
            height:36px;
            margin-top: 5px;
            color: white;
            margin-top: 9px;
            background:rgba(71,141,227,1);
            border-radius:18px;
        }
    }
}
</style>