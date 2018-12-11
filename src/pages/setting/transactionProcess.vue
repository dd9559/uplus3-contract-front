<template>
    <div class="data-list">
        <div class="table_head">
            <el-button type="primary" @click="addProcess('添加交易流程')">添加</el-button>
        </div>
        <el-table :data="listData" style="width: 100%" class="list1">
          <el-table-column align="center" label="序号" type="index" :formatter="nullFormatter"></el-table-column>
          <el-table-column align="center" label="名称" prop="name" :formatter="nullFormatter"></el-table-column>
          <el-table-column align="center" label="交易步骤数" prop="stepsNum" :formatter="nullFormatter"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button @click="rowOperation(scope.row,'init')" type="text" size="small">交易流程管理</el-button>
              <el-button @click="rowOperation(scope.row,'edit')" type="text" size="small">编辑</el-button>
              <el-button @click="rowOperation(scope.row,'delete')" type="text" size="small">删除</el-button>
            </template>
          </el-table-column> 
        </el-table>
        <!-- 添加编辑交易流程 弹出框 -->
        <el-dialog :title="processTitle" :visible.sync="dialogProcessVisible" width="740px" class="processDialog" :closeOnClickModal="$tool.closeOnClickModal">
          <el-form v-model="addForm" size="small">
            <el-form-item label="名称" class="add-form-item">
              <el-input v-model.trim="addForm.name" :maxlength="inputMax" onkeyup="value=value.replace(/\s+/g,'')"></el-input>
              <span class="text-absolute">{{validInput}}/{{inputMax}}</span>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="submitForm" class="confirmBtn">确定</el-button>
          </div>
        </el-dialog>
        <!-- 交易流程管理 弹出框 -->
        <el-dialog title="交易流程管理" :visible.sync="dialogManageVisible" width="740px" :closeOnClickModal="$tool.closeOnClickModal">
          <span class="flow-name">({{flowName}})</span>
          <div class="manage-title">
            <label>结算百分比 : </label>
            <el-input v-model="settlePercent" type="number" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>%
          </div>
          <div class="manage-list">
            <el-table :data="manageData">
              <el-table-column align="center" type="index" label="序号"></el-table-column>
              <el-table-column align="center" label="步骤类型" prop="stepsTypeName"></el-table-column>
              <el-table-column align="center" label="步骤名称" prop="stepsName"></el-table-column>
              <el-table-column align="center" label="计划天数" prop="planDays"></el-table-column>
              <el-table-column align="center" label="是否可以结算">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.isSettle" @change="isSettleChange(scope.$index,$event)">
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
        <el-dialog title="添加流程步骤" :visible.sync="ProcessStepVisible" width="740px" :closeOnClickModal="$tool.closeOnClickModal">
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
                <el-checkbox-group v-model="scope.row.tempList" @change="multiSelect(scope.$index,$event)">
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
        tempManage: [],
        settlePercent: "",
        tempSetPercent: "",
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
        currentFlowId: 0,
        AllSteps: [],
        inputMax: 30,
        flowName: ""
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
        }).catch(error => {
            this.$message({message:error})
        })
      },
      addProcess(title) {
        this.dialogProcessVisible = true
        this.processTitle = title
        this.addForm.name = ""
      },
      // 点击 交易流程管理 编辑 删除
      rowOperation(row, type) {
        this.flowName = row.name
        if(type === 'edit') {
          this.dialogProcessVisible = true
          this.processTitle = "编辑交易流程"
          this.processId = row.id
          this.addForm.name = row.name
        } else if(type === 'init') {
          this.dialogManageVisible = true
          this.settlePercent = row.settlePercent ? row.settlePercent : ""
          this.tempSetPercent = row.settlePercent ? row.settlePercent : ""
          this.currentFlowId = row.id
          let param = {
            flowId: row.id
          }
          this.$ajax.post('/api/flowmanage/selectFlowStepsList',param).then(res => {
            res = res.data
            if(res.status === 200) {
              this.manageData = res.data
              this.tempManage = JSON.parse(JSON.stringify(res.data))
              this.flowCount = this.manageData.length
            }
            this.manageData.forEach(i => {
              this.AllSteps.forEach((v,index) => {
                if(i.stepsName === v.name) {
                  i.sort = ++index
                }
              })
            })
          }).catch(error => {
              this.$message({message:error})
          })
        } else if(type === 'delete') {
          const param = {
            id: row.id,
            isDel: 1,
            cityId: this.cityId
          }
          const msg = "删除成功"
          this.processPost(param,msg,type)
        }
      },
      // 提交表单
      submitForm() {
        if(this.addForm.name === "") {
          this.$message("流程名称不能为空")
        } else {
          if(this.processTitle === "添加交易流程") {
            let param = {
              cityId: this.cityId
            }
            const msg = "添加成功"
            param = Object.assign({},this.addForm,param)
            this.processPost(param,msg)
          } else {
            let param = {
              id: this.processId,
              cityId: this.cityId
            }
            const msg = "修改成功"
            param = Object.assign({},this.addForm,param)
            this.processPost(param,msg)
          }
        }    
      },
      // 添加 编辑 删除 操作
      processPost(param,msg,type) {
        this.$ajax.postJSON('/api/flowmanage/insertFLow',param).then(res => {
          res = res.data
          if(res.status === 200) {
            this.$message(msg)
            if(!type) {
              this.dialogProcessVisible = false
            }
            this.getData()
          }
        }).catch(error => {
            this.$message({message:error})
        })
      },
      getTypeSteps() {
        this.StepsOption = []
        this.$ajax.post(`/api/flowmanage/selectTypeStepsList`, {cityId: this.cityId}).then(res => {
          res = res.data
          if (res.status === 200) {
            res.data.forEach(item => {
              this.StepsOption.push({
                typeId: item.typeId,
                stepsSelect: false,
                tempList: [],
                typeName: item.typeName,
                stepsList: item.stepsList
              })
            })
            this.StepsOption.forEach(item => {
              item.stepsList.forEach(e => {
                this.AllSteps.push(e)
              })
            })
          }
        }).catch(error => {
            this.$message({message:error})
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
      isSettleChange(index,bool) {
        for(var i = 0; i < this.manageData.length; i++) {
          this.manageData[i].isSettle = 0
        }
        this.manageData[index].isSettle = bool
      },
      addBtn() {
        this.ProcessStepVisible = true
        this.StepsOption.forEach(item => {
          item.tempList = []
          item.stepsSelect = false
        })
        this.manageData.forEach(i => {
          this.StepsOption.forEach(v => {
            if(i.stepsTypeName === v.typeName) {
              v.tempList.push(i.stepsName)
            }
            if(v.tempList.length) {
              if(v.tempList.length === v.stepsList.length) {
                v.stepsSelect = true
              } else {
                v.stepsSelect = false
              }
            }
          })
        })
      },
      // 全选
      allSelect(i,bool) {
        let arr = this.StepsOption[i]
        if(bool) {
          let ar = []
          arr.stepsList.forEach(item => {
            ar.push(item.name)
          })
          arr.tempList = ar
        } else {
          arr.tempList = []
        }
      },
      // 多选
      multiSelect(i,arr) {
        let obj = this.StepsOption[i]
        let bool = obj.stepsList.length === arr.length
        obj.stepsSelect = bool
      },
      confirmSteps(type) {
        if(type === 'steps') {
          let arr1 = []
          let arr2 = []
          this.manageData.forEach(i => {
            arr1.push(i.stepsName)
          })
          this.StepsOption.forEach(v => {
            arr2 = arr2.concat(v.tempList)
          })
          function getArrDifference(m,n) {
            return arr1.concat(arr2).filter(function(v,i,arr) {
              return arr.indexOf(v) === arr.lastIndexOf(v)
            })
          }
          let arr = getArrDifference(arr1,arr2)
          if(arr1.length < arr2.length) {
            this.managePush(arr)
          } else if(arr1.length > arr2.length) {
            let ar = []
            arr.forEach(i => {
              this.manageData.forEach(v => {
                if(i === v.stepsName) {
                  ar.push(v)
                }
              })
            })
            this.manageSplice(ar)
          } else {
            let ar1 = []
            let ar2 = []
            arr.forEach(i => {
              this.manageData.forEach(v => {
                if(i === v.stepsName) {
                  ar1.push(v)
                }
              })
            })
            arr.forEach(i => {
              arr2.forEach(v => {
                if(i === v) {
                  ar2.push(i)
                }
              })
            })
            this.manageSplice(ar1)
            this.managePush(ar2)
          }
          this.ProcessStepVisible = false
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
                isSettle: item.isSettle,
                id: item.id ? item.id : null
              })
            }
          })
          let param = {
            transFlowId: this.currentFlowId,
            transStepsList: arr
          }
          let obj = {
            id: this.currentFlowId,
            cityId: this.cityId,
            settlePercent: +this.settlePercent > 100 ? "100" : this.settlePercent
          }
          if(arr.length !== 0) {
            if(this.flowCount === 0) {
              const url = "/api/flowmanage/insertFLowSteps"
              this.flowManagePost(url,param)
            } else if (this.flowCount !== 0 && this.tempManage.toString() !== this.manageData.toString()) {
              const url = "/api/flowmanage/updateFLowSteps"
              this.flowManagePost(url,param)
            } else if (this.tempManage.toString() == this.manageData.toString() && this.tempSetPercent == this.settlePercent) {
              this.$message("没有做任何修改")
            }
            if(this.tempSetPercent != this.settlePercent) {
              this.$ajax.postJSON('/api/flowmanage/insertFLow',obj).then(res => {
                res = res.data
                if(res.status === 200) {
                  this.dialogManageVisible = false
                  this.getData()
                }
              }).catch(error => {
                  this.$message({message:error})
              })
            }
          } else {
            this.$message("没有绑定任何交易步骤")
          }
        }
      },
      manageSplice(array) {
        array.forEach(i => {
          this.manageData.forEach((v,index) => {
            if(i.stepsName === v.stepsName) {
              this.manageData.splice(index,1)
            }
          })
        })
      },
      managePush(array) {
        array.forEach(i => {
          this.AllSteps.forEach((item,index) => {
            if(i === item.name) {
              this.manageData.push({
                isSettle: 0,
                isSms: 0,
                overTimeDays: item.overTimeDays,
                planDays: item.planDays,
                stepsName: item.name,
                stepsTypeName: item.stepsTypeName,
                transStepsId: item.id,
                sort: ++index
              })
            }
          })
        })
      },
      flowManagePost(url,param) {
        this.$ajax.postJSON(url, param).then(res => {
          res = res.data
          if(res.status === 200) {
            this.$message(res.message)
            this.dialogManageVisible = false
            this.getData()
          }
        }).catch(error => {
            this.$message({message:error})
        })
      }
    },
    computed: {
      validInput() {
        return this.addForm.name.length
      }
    },
    watch: {
      "cityId": function(newVal,oldVal) {
        this.getData()
        this.getTypeSteps()
      },
      // "manageData": {
      //   handler(newVal,oldVal) {
      //     for(var i = 0; i < newVal.length; i++) {
      //       newVal[i].isSettle = 0
      //     }
      //   },
      //   deep: true
      // }
    }
  };
</script>
<style lang="less" scoped>
  .data-list {
    .table_head {
      padding: 6px 10px;
      display: flex;
      justify-content: flex-end;
      background: #fff;
      border-top: 1px solid rgba(237,236,240,1);
      .el-button {
        width:80px;
        height:32px;
        padding: 4px 0;
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
        /deep/ .el-form-item__label::before {
          content: "*";
          color: red;
        }
        .el-input {
          width: 654px;
        }
        .text-absolute {
          position: absolute;
          right: 10px;
          top: 0;
          color: #D6D6D6;
        }
      }
    }
    //交易流程管理
    .flow-name {
      position: absolute;
      left: 145px;
      top: 20px;
      color: #303133;
    }
    .manage-title {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .el-input {
        width: 90px;
        height: 32px;
        margin-left: 5px;
        /deep/ .el-input__inner {height: 32px; }
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