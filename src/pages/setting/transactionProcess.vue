<template>
    <div class="data-list">
        <div class="table_head">
            <el-button type="primary" plain @click="addProcess">添加</el-button>
        </div>
        <el-table :data="listData" style="width: 100%">
          <el-table-column align="center" :label="item.name" :prop="item.prop" :formatter="nullFormatter"
                          v-for="item in tHeader" :key="item.id">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button @click="rowOperation(scope.row,1)" type="text" size="small">交易流程管理</el-button>
              <el-button @click="rowOperation(scope.row,'edit')" type="text" size="small">编辑</el-button>
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
        <!-- 添加交易流程 弹出框 -->
        <el-dialog :title="processTitle" :visible.sync="dialogProcessVisible" width="740px">
          <el-form v-model="addForm" label-width="90px" v-if="processTitle == '添加交易流程'">
            <el-form-item label="名称">
                <el-input v-model="addForm.name"></el-input>
            </el-form-item>
          </el-form>
          <el-form v-model="editForm" label-width="90px" v-else>
            <el-form-item label="名称">
                <el-input v-model="editForm.name"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="Confirm">确定</el-button>
          </div>
        </el-dialog>
        <!-- 交易流程管理 弹出框 -->
        <el-dialog title="交易流程管理" :visible.sync="dialogManageVisible" width="740px">
          <div class="manage-list">
            <el-table :data="manageData">
              <el-table-column align="center" type="index" label="序号"></el-table-column>
              <el-table-column align="center" label="步骤类型" prop="stepsTypeName"></el-table-column>
              <el-table-column align="center" label="步骤名称" prop="name"></el-table-column>
              <el-table-column align="center" label="计划天数" prop="planDays"></el-table-column>
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
              <el-button type="primary" @click="AddProcessVisible = true">添加</el-button>
              <el-button type="primary">确定</el-button>
          </div>
        </el-dialog>
        <!-- 添加流程步骤 弹出框 -->
        <el-dialog title="添加流程步骤" :visible.sync="AddProcessVisible" width="740px">
          <el-table :data="addProcessOption" class="process-list">
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
        </el-dialog>
    </div>
</template>
           
<script>
  import { FILTER } from "@/assets/js/filter"
  export default {
    mixins: [FILTER],
    data() {
      return {
        listData: [
          {
            typeName: "一次性（业）+一次性（客）住宅",
            stepsNum: 1
          }
        ], //交易流程列表
        //交易流程列表表头
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
        addForm: {
          name: ""
        },
        editForm: {
          name: ""
        },
        processTitle: "",
        dialogProcessVisible: false, //添加交易流程
        dialogManageVisible: false, //交易流程管理
        AddProcessVisible: false, //添加流程步骤
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
        addProcessOption: [
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
    methods: {
      getData: function() {
        let param = {
          cityId: 1
        };
        this.$ajax
          .postJSON(`/api/flowmanage/selectFlowPageList`, param)
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              console.log(res.data);
              // this.listData = res.data;
            }
          });
      },
      addProcess() {
        this.dialogProcessVisible = true
        this.processTitle = "添加交易流程"
      },
      rowOperation(row, type) {
        if(type === 'edit') {
          this.dialogProcessVisible = true
          this.processTitle = "编辑交易流程"
        } else if(type === 1) {
          this.dialogManageVisible = true
          let param = {
            trans_flow_id: row.id
          }
          this.$ajax.post('/api/flowmanage/selectFlowStepsList',param).then(res => {
            res = res.data
            if(res.status === 200) {
              // this.manageData = res.data.list
            }
          })
        }
      },
      Confirm() {
        this.$ajax.post('/api/flowmanage/insertFLow',this.addForm).then(res => {
          console.log(res);
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
    .el-pagination {
      text-align: center;
      margin-left: 100px;
    }
    //交易流程管理
    .manage-list {
      .el-table {
        border: 1px solid rgba(237,236,240,1);
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