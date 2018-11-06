<template>   
    <div class="layout">
             <!-- 筛选 -->
              <div class="filter-layout">
                部门：
                 <el-select v-model="value" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
               合同类型：
               <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
               分成类型：
               <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
                    业绩状态：
                    <el-select v-model="value" placeholder="请选择">
                       <el-option
                         v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
                       </el-option>
              </el-select>
                   <div class="block" style="margin-top:20px;">
                       <span class="demonstration"> 签约日期：</span>
                       <el-date-picker
                         v-model="value1"
                         type="date"
                         placeholder="选择日期">
                       </el-date-picker>
                        -
                        <el-date-picker
                         v-model="value2"
                         type="date"
                         placeholder="选择日期">
                       </el-date-picker>
                    </div>
              </div>
         
            <!-- 数据列表 -->
              <div class="data-layout">
                  <p>总分成：55922，分类分成：出售：11754，代办：2000，出租：52747</p>  
              </div>
          
           <!-- 数据表单展示 -->
             <div class="table-layout">
                  <el-table
                    :data="tableData"
                    style="width: 100%"
                    @row-dblclick="dialogVisible = true"
                    >
                    <el-table-column
                      prop="name"
                      label="合同信息"
                      width="120"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="statu"
                      label="业绩状态"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="type"
                      label="合同类型"
                      width="120">
                    </el-table-column>
                     <el-table-column
                      prop="address"
                      label="物业地址"
                      width="120">
                    </el-table-column>
                        <el-table-column
                      prop="man"
                      label="成交经纪人"
                      width="120">
                    </el-table-column>
                        <el-table-column
                      prop="date"
                      label="签约日期"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="type1"
                      label="分成类型"
                      width="120">
                    </el-table-column>
                     <el-table-column
                      prop="man1"
                      label="分成人"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="type2"
                      label="角色类型"
                      width="120">
                    </el-table-column>
                      <el-table-column
                      prop="radio"
                      label="分成比例"
                      width="120">
                    </el-table-column>
                      <el-table-column
                      prop="amout"
                      label="应收分成金额"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="done"
                      label="操作">
                    </el-table-column>

                     <el-table-column
                     label="单选框"
                     >
                       <template slot-scope="scope">
                                <el-checkbox>备选项</el-checkbox>
                       </template>
                    </el-table-column>
                </el-table>
             </div>
            <!-- 表单列表弹出框（业绩详情） -->
            <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
                <span>这是一段信息</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>

          
    </div>
</template>

<script>
export default {
  name: "receivableAchievement",
  data() {
    return {
      tableData: [
        {
          name:
            "合同编号：YQYD001163房源编号：YQYD001163-姓名客源编号：YQYD001163-姓名",
          statu: "未审核",
          type: "租赁",
          address: "安居苑10栋3单元1102",
          man: "当代一店-夏雨天",
          date: "2018/6/28",
          type1: "业绩分成",
          man1: "当代一店-夏雨天当代一店-夏雨天",
          type2: "房源维护人主客方",
          radio: "20%-80%",
          amout: "400-500",
          done: "审核  编辑"
        },
        {
          name:
            "合同编号：YQYD001163房源编号：YQYD001163-姓名客源编号：YQYD001163-姓名",
          statu: "未审核",
          type: "租赁",
          address: "安居苑10栋3单元1102",
          man: "当代一店-夏雨天",
          date: "2018/6/28",
          type1: "业绩分成",
          man1: "当代一店-夏雨天当代一店-夏雨天",
          type2: "房源维护人主客方",
          radio: "20%-80%",
          amout: "400-500",
          done: "审核  编辑"
        },
        {
          name:
            "合同编号：YQYD001163房源编号：YQYD001163-姓名客源编号：YQYD001163-姓名",
          statu: "未审核",
          type: "租赁",
          address: "安居苑10栋3单元1102",
          man: "当代一店-夏雨天",
          date: "2018/6/28",
          type1: "业绩分成",
          man1: "当代一店-夏雨天当代一店-夏雨天",
          type2: "房源维护人主客方",
          radio: "20%-80%",
          amout: "400-500",
          done: "审核  编辑"
        },
        {
          name:
            "合同编号：YQYD001163房源编号：YQYD001163-姓名客源编号：YQYD001163-姓名",
          statu: "未审核",
          type: "租赁",
          address: "安居苑10栋3单元1102",
          man: "当代一店-夏雨天",
          date: "2018/6/28",
          type1: "业绩分成",
          man1: "当代一店-夏雨天当代一店-夏雨天",
          type2: "房源维护人主客方",
          radio: "20%-80%",
          amout: "400-500",
          done: "审核  编辑"
        },
        {
          name:
            "合同编号：YQYD001163房源编号：YQYD001163-姓名客源编号：YQYD001163-姓名",
          statu: "未审核",
          type: "租赁",
          address: "安居苑10栋3单元1102",
          man: "当代一店-夏雨天",
          date: "2018/6/28",
          type1: "业绩分成",
          man1: "当代一店-夏雨天当代一店-夏雨天",
          type2: "房源维护人主客方",
          radio: "20%-80%",
          amout: "400-500",
          done: "审核  编辑"
        }
      ],
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value1: "",
      value2: "",
      value: "",
      input: "",
      dialogVisible: false
    };
  },
  methods: {
    handleClose() {
      alert(1);
    }
  }
};
</script>

<style scoped lang="less">
.layout {
  padding: 30px;
  .el-table th > .cell {
    text-align: center !important;
  }
  /deep/ .el-table .cell {
    text-align: center !important;
  }
  .data-layout {
    height: 60px;
    line-height: 60px;
    font-size: 20px;
  }
}
</style>