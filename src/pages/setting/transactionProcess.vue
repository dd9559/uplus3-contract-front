<template>
    <div class="data-list">
        <div class="table_head">
            <el-button type="primary" @click="addProcess('添加交易流程')">添加</el-button>
        </div>
        <el-table :data="listData" style="width: 100%" class="list1">
          <el-table-column align="center" :label="item.name" :prop="item.prop" :formatter="nullFormatter"
                          v-for="item in tHeader" :key="item.id">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button @click="rowOperation(scope.row,'init')" type="text" size="small">交易流程管理</el-button>
              <el-button @click="rowOperation(scope.row,'edit')" type="text" size="small">编辑</el-button>
              <el-button @click="rowOperation(scope.row,'delete')" type="text" size="small">删除</el-button>
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
        <!-- 添加编辑交易流程 弹出框 -->
        <el-dialog :title="processTitle" :visible.sync="dialogProcessVisible" width="740px" class="processDialog">
          <el-form v-model="addForm" size="small">
            <el-form-item label="名称" class="add-form-item">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="submitForm" class="confirmBtn">确定</el-button>
          </div>
        </el-dialog>
        <!-- 交易流程管理 弹出框 -->
        <el-dialog title="交易流程管理" :visible.sync="dialogManageVisible" width="740px">
          <div class="manage-title">
            <label>结算百分比 : </label>
            <el-input></el-input>%
          </div>
          <div class="manage-list">
            <el-table :data="manageData">
              <el-table-column align="center" type="index" label="序号"></el-table-column>
              <el-table-column align="center" label="步骤类型" prop="stepsTypeName"></el-table-column>
              <el-table-column align="center" label="步骤名称" prop="name"></el-table-column>
              <el-table-column align="center" label="计划天数" prop="planDays"></el-table-column>
              <el-table-column align="center" label="是否可以结算">
                <template slot-scope="scope">
                  <el-select>
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="2"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="text">上</el-button>
                  <el-button type="text">下</el-button>
                  <el-button type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div slot="footer" class="dialog-footer">
              <el-button @click="ProcessStepVisible = true" class="addBtn">添加</el-button>
              <el-button class="confirmBtn">确定</el-button>
          </div>
        </el-dialog>
        <!-- 添加流程步骤 弹出框 -->
        <el-dialog title="添加流程步骤" :visible.sync="ProcessStepVisible" width="740px">
          <el-table :data="ProcessStepOption" class="process-list">
            <el-table-column label="步骤类型">
              <template slot-scope="scope">
                <el-checkbox>{{ scope.row.stepsTypeName }}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="交易步骤">
              <template slot-scope="scope">
                <p v-for="item in scope.row.transStepsList" :key="item.id"><el-checkbox>{{ item.type }}</el-checkbox></p>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
              <el-button class="confirmBtn">确定</el-button>
          </div>
        </el-dialog>
    </div>
</template>
           
<script>
  import { FILTER } from "@/assets/js/filter"
  export default {
    mixins: [FILTER],
    props: ["cityId"],
    data() {
      return {
        //交易流程列表
        listData: [], 
        //交易流程列表表头
        tHeader: [
          {
            id: 1,
            prop: "id",
            name: "序号"
          },
          {
            id: 2,
            prop: 'name',
            name: '名称'
          },
          {
            id: 3,
            prop: "stepsNum",
            name: "交易步骤数"
          }
        ],
        addForm: {
          name: ""
        },
        processId: 0,
        processTitle: "",
        dialogProcessVisible: false, //添加交易流程
        dialogManageVisible: false, //交易流程管理
        ProcessStepVisible: false, //添加流程步骤
        //流程管理列表
        manageData: [
          {
            id: 1,
            stepsTypeName: "金融流程",
            name: "资料准备",
            planDays: 7
          }
        ],
        //流程步骤选项
        ProcessStepOption: [
          {
            id: 1,
            stepsTypeName: "担保流程",
            transStepsList: [
              {
                id: 1,
                type: "资料准备"
              },
              {
                id: 2,
                type: "转房款"
              },
              {
                id: 3,
                type: "交税、过户"
              }
            ]
          },
          {
            id: 2,
            stepsTypeName: "金融流程",
            transStepsList: []
          },
          {
            id: 3,
            stepsTypeName: "权证流程",
            transStepsList: []
          },
          {
            id: 4,
            stepsTypeName: "物业交割",
            transStepsList: []
          }
        ],
        stepsTypeName: "",
        pageSize: 5,
        pageNum: 1,
        total: 0
      };
    },
    created() {
      this.getData();
    },
    methods: {
      // 获取交易流程列表
      getData: function() {
        let param = {
          cityId: this.cityId
        };
        this.$ajax.post('/api/flowmanage/selectFlowPageList', param).then(res => {
            res = res.data;
            if (res.status === 200) {
              this.listData = res.data;
            }
          });
      },
      addProcess(title) {
        this.dialogProcessVisible = true
        this.processTitle = title
        this.addForm.name = ""
      },
      // 点击 交易流程管理 编辑 删除
      rowOperation(row, type) {
        if(type === 'edit') {
          this.dialogProcessVisible = true
          this.processTitle = "编辑交易流程"
          this.processId = row.id
          this.addForm.name = row.name
        } else if(type === 'init') {
          this.dialogManageVisible = true
          let param = {
            trans_flow_id: row.id
          }
          this.$ajax.post('/api/flowmanage/selectFlowStepsList',param).then(res => {
            res = res.data
            if(res.status === 200) {
              // this.manageData = res.data
            }
          })
        } else if(type === 'delete') {
          const param = {
            id: row.id,
            isDel: 1
          }
          this.processPost(param,type)
        }
      },
      // 提交表单
      submitForm() {
        if(this.processTitle === "添加交易流程") {
          let param = {
            cityId: 1
          }
          param = Object.assign({},this.addForm,param)
          this.processPost(param)
        } else {
          let param = {
            id: this.processId
          }
          param = Object.assign({},this.addForm,param)
          this.processPost(param)
        }
      },
      // 添加 编辑 删除 操作
      processPost(param,type) {
        this.$ajax.postJSON('/api/flowmanage/insertFLow',param).then(res => {
          res = res.data
          if(res.status === 200) {
            this.$message(res.message)
            if(!type) {
              this.dialogProcessVisible = false
            }
            this.getData()
          }
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getData()
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getData()
      }
    }
  };
</script>
<style lang="less" scoped>
  .data-list {
    .table_head {
      padding: 13px 10px;
      display: flex;
      justify-content: flex-end;
      background: #fff;
      border-top: 1px solid rgba(237,236,240,1);
      .el-button {
        width:100px;
        height:36px;
        border-radius:18px;
      }
    }
    .list1 {
      padding: 0 12px;
    }
    .el-pagination {
      text-align: center;
      margin-left: 100px;
    }
    .processDialog {
      /deep/ .el-dialog__body {
        margin-bottom: 271px;
      }
      .add-form-item {
        display: flex;
        .el-input {
          width: 656px;
        }
      }
    }
    //交易流程管理
    .manage-title {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .el-input {
        width: 90px;
        height: 32px;
        margin-left: 5px;
        /deep/ .el-input__inner { width: 100%; height: 32px; }
      }
    }
    .manage-list {
      .el-table {
        border: 1px solid rgba(237,236,240,1);
      }
      /deep/ .el-input {
        width: 94px;
        height: 32px;
        .el-input__inner { width: 100%; height: 32px; }
      }
    }
    .process-list {
      border: 1px solid #ebeef5;
      p {
        line-height: 3;
        padding-left: 50px;
        border-bottom: 1px solid #ebeef5;
        border-left: 1px solid #ebeef5;
        &:last-child { border-bottom: none; }
      }
      /deep/ .el-table__row {
          td:first-child {
            .cell { padding-left: 50px; }
          }
          td:last-child {
            padding: 0;
            .cell {
              padding: 0;
            }
          }
      }
    }
  }
</style>