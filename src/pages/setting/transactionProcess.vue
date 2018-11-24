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
            <el-input v-model="settlePercent"></el-input>%
          </div>
          <div class="manage-list">
            <el-table :data="manageData">
              <el-table-column align="center" type="index" label="序号"></el-table-column>
              <el-table-column align="center" label="步骤类型" prop="stepsTypeName"></el-table-column>
              <el-table-column align="center" label="步骤名称" prop="stepsName"></el-table-column>
              <el-table-column align="center" label="计划天数" prop="planDays"></el-table-column>
              <el-table-column align="center" label="是否可以结算">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.isSettle">
                    <el-option v-for="item in isSettleOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="Operation(scope.$index, 'up')" :disabled="scope.$index === 0">上</el-button>
                  <el-button type="text" @click="Operation(scope.$index, 'down')" :disabled="scope.$index === (manageData.length - 1)">下</el-button>
                  <el-button type="text" @click="Operation(scope.$index, 'delete')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div slot="footer" class="dialog-footer">
              <el-button @click="addBtn" class="addBtn">添加</el-button>
              <el-button class="confirmBtn" @click="confirmSteps('flow')">确定</el-button>
          </div>
        </el-dialog>
        <!-- 添加流程步骤 弹出框 -->
        <el-dialog title="添加流程步骤" :visible.sync="ProcessStepVisible" width="740px">
          <el-table :data="StepsOption" border class="process-list">
            <el-table-column label="步骤类型">
              <template slot-scope="scope">
                <p>
                  <el-checkbox v-model="scope.row.stepsSelect" @change="allSelect(scope.$index,$event)">{{ scope.row.typeName }}</el-checkbox>
                </p>
              </template>
            </el-table-column>
            <el-table-column label="交易步骤">
              <template slot-scope="scope">
                <el-checkbox-group v-model="scope.row.stepsTypeList" @change="select(scope.$index,$event)">
                  <p v-for="item in scope.row.stepsList" :key="item.id"><el-checkbox :label="item.name">{{ item.name }}</el-checkbox></p>
                </el-checkbox-group>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
              <el-button class="confirmBtn" @click="confirmSteps('steps')">确定</el-button>
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
        manageData: [],
        settlePercent: "",
        isSettleOption: [
          {
            value: 0,
            label: '否'
          },
          {
            value: 1,
            label: '是'
          }
        ],
        //流程步骤选项
        StepsOption: [],
        flowCount: 0,
        currentFlowId: 0
      };
    },
    created() {
      this.getData();
      this.getTypeSteps()
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
          this.currentFlowId = row.id
          let param = {
            flowId: row.id
          }
          this.$ajax.post('/api/flowmanage/selectFlowStepsList',param).then(res => {
            res = res.data
            if(res.status === 200) {
              this.manageData = res.data
              this.flowCount = this.manageData.length
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
      getTypeSteps() {
        this.$ajax.post(`/api/flowmanage/selectTypeStepsList`, {cityId: this.cityId}).then(res => {
          res = res.data
          if (res.status === 200) {
            res.data.forEach(item => {
              this.StepsOption.push({
                typeId: item.typeId,
                stepsSelect: false,
                stepsTypeList: [],
                typeName: item.typeName,
                stepsList: item.stepsList
              })
            })
          }
        }) 
      },
      Operation(index,type) {
        if(type === "up") {
          if(index > 0) {
            let upSort = this.manageData[index - 1]
            this.manageData.splice(index - 1, 1)
            this.manageData.splice(index, 0, upSort)
          }
        } else if(type === "down") {
          if((index + 1) !== this.manageData.length) {
            let downSort = this.manageData[index + 1]
            this.manageData.splice(index + 1, 1)
            this.manageData.splice(index, 0, downSort)
          }
        } else {
          this.manageData.splice(index, 1)
        }
      },
      addBtn() {
        this.ProcessStepVisible = true
      },
      // 全选
      allSelect(i,bool) {
        let arr = this.StepsOption[i]
        if(bool) {
          let ar = []
          arr.stepsList.forEach(item => {
            ar.push(item.name)
          })
          arr.stepsTypeList = ar
        } else {
          arr.stepsTypeList = []
        }
      },
      // 多选
      select(i,arr) {
        let obj = this.StepsOption[i]
        let bool = obj.stepsList.length === arr.length
        obj.stepsSelect = bool
      },
      confirmSteps(type) {
        if(type === 'steps') {
          this.manageData = []
          let arr = []
          let id = 1
          this.ProcessStepVisible = false
          this.StepsOption.forEach(e => {
            e.stepsTypeList.forEach(i => {
              arr.push({
                id: id++,
                name: i
              })
            })
          })
          this.StepsOption.forEach(item => {
            if(item.stepsTypeList.length) {
              item.stepsTypeList.forEach(i => {
                item.stepsList.forEach(v => {
                  if(i === v.name) {
                    this.manageData.push({
                      isSettle: 0,
                      overTimeDays: v.overTimeDays,
                      planDays: v.planDays,
                      stepsName: v.name,
                      stepsTypeName: v.stepsTypeName,
                      transStepsId: v.id
                    })
                  }
                })
              })
            }
          })
          this.manageData.forEach(item => {
            arr.forEach(value => {
              if(item.stepsName === value.name) {
                item.sort = value.id
              }
            })
          })
        } else if(type === 'flow') {
          let arr = []
          this.manageData.forEach(item => {
            if(this.flowCount === 0) {
              arr.push({
                transStepsId: item.transStepsId,
                sort: item.sort,
                isSettle: item.isSettle
              })
            } else {
              arr.push({
                transStepsId: item.transStepsId,
                sort: item.sort,
                id: item.id ? item.id : null
              })
            }
          })
          let param = {
            transFlowId: this.currentFlowId,
            transStepsList: arr
          }
          if(this.flowCount === 0) {
            this.$ajax.postJSON('/api/flowmanage/insertFLowSteps', param).then(res => {

            })
          } else {
            this.$ajax.postJSON('/api/flowmanage/updateFLowSteps', param).then(res => {

            })
          }
        }
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
        .el-input__icon { line-height: 0; }
      }
    }
    .process-list {
      border: 1px solid #ebeef5;
      p {
        line-height: 3;
        padding-left: 50px;
        border-bottom: 1px solid #ebeef5;
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