<template>
  <!-- 所有跟进日志 -->
    <el-dialog :visible.sync="visible" title="跟进日志">
      <div class="follow-log">
        <el-table style="width: 100%" :data="data" border class="paper-table">
          <el-table-column
            prop="transactionStepsType"
            label="步骤类型">
          </el-table-column>
          <el-table-column
            prop="transactionSteps"
            label="步骤名称">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="reportingtor"
            label="跟进人">
          </el-table-column>
          <el-table-column
            prop="reportingRemake"
            label="日志内容">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      data: null,
    }
  },
  props: {
    id: {
      type: Number,
      default: 0,
    }
  },
  methods: {
    open() {
      this.getFollowLog();
      this.visible = true;
    },
    getFollowLog() {
      this.$ajax.get('/api/postSigning/lookStepReporting', {
        id: this.id
      })
        .then(res => {
          console.log(res);
          this.data = res.data.data;
        });
    }
  }
}
</script>

<style lang="less" scoped>
  .follow-log {
    padding: 20px 10px;
     /deep/ .paper-table  {
     .el-table__header th {
        background-color: #EEF2FB;
        color: #6C7986;
      }
    }
  }
</style>