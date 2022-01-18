<template>
  <!-- 所有跟进日志 -->
    <el-dialog :visible.sync="visible" title="跟进日志">
      <div class="follow-log">
        <el-table style="width: 100%" :data="data" border class="paper-table" v-loading="isLoading">
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
            width="140px"
            label="创建时间">
            <template slot-scope="{row}">
              <span>{{ row.createTime | formatTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="reportingDate"
            label="创建时间">
            <template slot-scope="{row}">
              <span>{{ row.reportingDate | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="reportingtor"
            label="跟进人">
            <template slot-scope="{row}">
              <span>{{ (row.reportingtorDep ? row.reportingtorDep + '-' : '') + row.reportingtor }}</span>
            </template>
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
      isLoading: false,
    }
  },
  props: {
    id: {
      type: Number,
      default: 0,
    }
  },
  watch: {
    visible(val) {
      if(!val) {
        this.data = null;
      }
    }
  },
  methods: {
    open() {
      this.visible = true;
      this.getFollowLog();
    },
    getFollowLog() {
      this.isLoading = true;
      this.$ajax.get('/api/postSigning/lookStepReporting', {
        id: this.id
      })
        .then(res => {
          console.log(res);
          this.data = res.data.data;
        })
        .finally(() => {
          this.isLoading = false;
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