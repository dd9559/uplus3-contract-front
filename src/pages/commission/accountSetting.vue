<template>
  <div>
    <p class="brand-nav">财务>周期结算设置</p>
    <!-- 查询组件 -->
    <uPlusScrollTop @propResetFormFn="reset" @propQueryFn="queryFn">
      <el-input placeholder="请输入" class="w200" style="height:40px;"></el-input>
      <el-input placeholder="请输入" class="w200" style="height:40px;"></el-input>
      <el-input placeholder="请输入" class="w200" style="height:40px;"></el-input>
      <el-input placeholder="请输入" class="w200" style="height:40px;"></el-input>
      <el-input placeholder="请输入" class="w200" style="height:40px;"></el-input>
      <el-input placeholder="请输入" class="w200" style="height:40px;"></el-input>
      <el-input placeholder="请输入" class="w200" style="height:40px;"></el-input>
      <el-input placeholder="请输入" class="w200" style="height:40px;"></el-input>
    </uPlusScrollTop>

    <div class="main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "accountSetting",
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
    };
  },
  methods: {
    reset() {
      console.log("重置");
    },
    queryFn() {
      console.log("查询");
    },
  },
};
</script>

<style scoped>
.brand-nav{
  background-color: #f5f5f5;
  height: 50px;
  line-height: 50px;
  border: none;
  font-size: 16px;
  padding-left: 20px;
}
</style>
