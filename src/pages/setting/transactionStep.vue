<template>
  <div class="data-list">
    <!-- 左侧 步骤类型 -->
    <div class="stepsType gap">
      <div class="title">
        <span>步骤类型</span>
        <el-button type="primary" @click="addStepsType">添加步骤类型</el-button>
      </div>
      <el-table :data="listData" @cell-click="cellClick" highlight-current-row>
        <el-table-column
        align="center"
        :label="item.name"
        :prop="item.prop"
        :formatter="nullFormatter"
        v-for="item in tHeader"
        :key="item.id">
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="90">
          <template slot-scope="scope">
            <el-button @click="rowOperation(scope.row,'edit',1)" type="text" size="small">编辑</el-button>
            <el-button @click="rowOperation(scope.row,'delete','stepsType')" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 右侧 交易步骤 -->
    <div class="tradeSteps gap">
      <div class="title">
        <span>交易步骤</span>
        <el-button type="primary" @click="addTradeSteps">添加交易步骤</el-button>
      </div>
      <el-table :data="listData_other">
        <el-table-column align="center" :label="item.name" :prop="item.prop" :formatter="nullFormatter"
                        v-for="item in tHeader_other" :key="item.id">
        </el-table-column>
        <el-table-column align="center" label="是否短信通知">
          <template slot-scope="scope">
            <div>{{scope.row.isSms==1?'是':'否'}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="步骤附属信息">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.transStepsAttach" :key="index">{{item.title}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="信息类型">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.transStepsAttach" :key="index">{{item.type}}</p>     
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否必须">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.transStepsAttach" :key="index">{{item.isRequired==1?'是':'否'}}</p>     
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="rowOperation(scope.row,'edit',2)">编辑</el-button>
            <el-button type="text" size="medium" @click="rowOperation(scope.row,'delete','stepBusiness')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加和编辑步骤类型 -->
    <el-dialog :title="modalTitle" :visible.sync="stepsTypeDialog" width="740px">
      <el-form :model="addForm" class="addform" size="small">
        <el-form-item label="步骤类型">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分配负责角色">
          <el-select v-model="addForm.dutyType">
            <el-option v-for="(item,index) in listData" :key="index" :label="item.dutyType" :value="item.dutyType"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitForm" class="confirmBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加和编辑交易步骤 -->
    <el-dialog :title="modalTitle" :visible.sync="tradeStepsDialog" width="740px">
      <div class="modal-context">
        <template>
          <div class="input-group">
            <label>步骤类型：</label>
            <span>{{stepBusiness.stepsTypeName}}</span>
          </div>
          <div class="input-group">
            <label>步骤名称：</label>
            <el-input type="text" v-model="stepBusiness.name"></el-input>
          </div>
          <div class="input-group">
            <label>计划天数：</label>
            <el-input type="text" v-model="stepBusiness.planDays"></el-input>
          </div>
          <div class="menu-table">
            <el-table border :data="tableForm" style="width: 100%">
              <el-table-column align="center" label="名称" min-width="150">
                <template slot-scope="scope">
                  <el-input width='100%' v-model="tableForm[scope.$index].title"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="信息类型" min-width="150">
                <template slot-scope="scope">
                  <el-select v-model="tableForm[scope.$index].type" placeholder="请选择信息类型">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="是否必填" min-width="120">
                <template slot-scope="scope">
                  <el-radio v-model="tableForm[scope.$index].isRequired" label="1">是</el-radio>
                  <el-radio v-model="tableForm[scope.$index].isRequired" label="2">否</el-radio>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button @click="rowOperation(scope.row,'delete','info')" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <p>
              <el-button @click="addCell" class="el-icon-plus"></el-button>
            </p>
          </div>
        </template>
      </div>
      <div slot="footer" class="modal-footer">
        <el-button @click="submitForm" class="confirmBtn">确 定</el-button>
      </div>
    </el-dialog> 
  </div>
</template>
           
<script>
  import { FILTER } from "@/assets/js/filter";
  let stepTypeId = 1;
  let obj = {
    cityId: 1,
    name: '',
    dutyType: ''
  }
  export default {
    mixins: [FILTER],
    data() {
      return {
        listData: [], //步骤类型列表
        listData_other: [], //交易步骤列表
        stepsTypeDialog: false, //添加和编辑步骤类型 弹出框
        tradeStepsDialog: false, //添加和编辑交易步骤 弹出框
        modalTitle: "", //弹出框title标题
        addForm: {}, //新增和编辑步骤类型 表单
        currentRow: {}, //步骤类型列表当前行
        //新增和编辑交易步骤 表单
        stepBusiness: {
          stepsTypeId: "",
          stepsTypeName: "",
          name: "",
          planDays: "",
          overTimeDays: 0,
          isSms: 0
        },
        //新增和编辑交易步骤 表格行
        tableForm: [
          {
            id: 1,
            isRequired: "",
            title: "",
            type: ""
          }
        ],
        //步骤类型 表头
        tHeader: [
          {
            id: 1,
            prop: "typeName",
            name: "步骤类型"
          },
          {
            id: 2,
            prop: "dutyType",
            name: "负责角色"
          },
          {
            id: 3,
            prop: "stepsNum",
            name: "步骤数量"
          },
        ],
        //交易步骤 表头
        tHeader_other: [
          {
            id: 1,
            prop: "stepsTypeName",
            name: "步骤类型"
          },
          {
            id: 2,
            prop: "name",
            name: "步骤名称"
          },
          {
            id: 3,
            prop: "planDays",
            name: "计划天数"
          },
          {
            id: 4,
            prop: "overTimeDays",
            name: "超时提醒"
          }
        ],
        //交易步骤信息类型
        options: [
          {
            label: "文本",
            value: 1
          },
          {
            label: "数字",
            value: 2
          },
          {
            label: "图片",
            value: 3
          },
          {
            label: "视频",
            value: 4
          },
          {
            label: "PDF",
            value: 5
          },
          {
            label: "Excel",
            value: 6
          },
          {
            label: "Word",
            value: 7
          }
        ]
      }
    },
    created() {
      this.getData()
      this.addForm = JSON.parse(JSON.stringify(obj))
    },
    methods: {
      //获取步骤类型列表
      getData: function () {
        this.$ajax.post(`/api/flowmanage/selectTypeStepsList`, {cityId: 1}).then(res => {
          res = res.data
          if (res.status === 200) {
            this.listData = res.data
            this.listData_other = this.listData[0].stepsList
            this.currentRow = this.listData[0]
            }
          }) 
      },
      //单击步骤类型列表行单元格获取交易步骤
      cellClick(row, column, cell, event) {
        this.listData_other = row.stepsList
        this.currentRow = row
        //高亮选中的步骤类型
        let rows = cell.parentNode.parentNode.children
        for(var i = 0; i < rows.length; i++) {
          rows[i].firstElementChild.style.background = "#fff"
          rows[i].firstElementChild.style.color = "#606267"
        }
        cell.parentNode.firstElementChild.style.background = "#478DE3"
        cell.parentNode.firstElementChild.style.color = "#fff"
      },
      //点击添加步骤类型
      addStepsType() {
        this.stepsTypeDialog = true
        this.modalTitle = "添加步骤类型"
        this.addForm = JSON.parse(JSON.stringify(obj))
      },
      //点击添加交易步骤
      addTradeSteps() {
        this.tradeStepsDialog = true
        this.modalTitle = "添加交易步骤"
        let obj = {
          stepsTypeId: this.currentRow.typeId,
          stepsTypeName: this.currentRow.typeName,
          name: "",
          planDays: "",
          overTimeDays: 0,
          isSms: 0
        }
        let arr = [
          {
            id: 1,
            isRequired: "",
            title: "",
            type: ""
          }
        ]
        this.stepBusiness = obj
        this.tableForm = arr
      },
      /**
       * 提交表单
       */
      submitForm: function() {
        if(this.modalTitle === "添加步骤类型") {
          const url = "/api/flowmanage/insertStepsType"
          let param = this.addForm
          const msg = "添加步骤类型成功"
          this.stepsTypePost(url,param,msg)
        } else if(this.modalTitle === "编辑步骤类型") {
          const url = "/api/flowmanage/updateStepsType"
          let param = {
            id: this.currentRow.typeId
          }
          param = Object.assign({},this.addForm,param)
          const msg = "编辑步骤类型成功"
          this.stepsTypePost(url,param,msg)
        } else if (this.modalTitle === "添加交易步骤") {
          let url = "/api/flowmanage/insertSteps"
          this.tradeStepsPost(url)
        } else if (this.modalTitle === "编辑交易步骤") {
          let url = "/api/flowmanage/updateSteps"
          this.tradeStepsPost(url)
        }
      },
      //添加和编辑步骤类型请求
      stepsTypePost(url,param,msg) {
        this.$ajax.postJSON(url, param).then(res => {
          res = res.data
          if(res.status === 200) {
            this.$message(msg)
            this.stepsTypeDialog = false
            this.getData()
          }
        }).catch(error => {
          console.log(error);
        })
      },
      //添加和编辑交易步骤请求
      tradeStepsPost(url) {
        let obj = {
          transStepsAttach: JSON.stringify(this.tableForm)
        }
        let param = Object.assign({}, this.stepBusiness, obj)
        this.$ajax.post(url, param).then(res => {
          res = res.data
          if(res.status === 200) {
            this.$message(res.message)
            this.tradeStepsDialog = false
            this.getData()
          }
        }).catch(error => {
            console.log(error);
        });
      },
      //交易步骤弹出框 列表 增加行
      addCell: function() {
        let cell = {
          id: ++stepTypeId,
          isRequired: "",
          title: "",
          type: ""
        };
        this.tableForm.push(cell);
        console.log(this.tableForm);
      },
      //点击 编辑 删除 操作
      rowOperation: function(row, opera, type) {
        if(opera === "edit") {
          if(type === 1) {
            this.stepsTypeDialog = true
            this.modalTitle = "编辑步骤类型"
            this.addForm.name = row.typeName
            this.addForm.dutyType = row.dutyType
          } else if (type === 2) {
            this.tradeStepsDialog = true
            this.modalTitle = "编辑交易步骤"
            this.tableForm = JSON.parse(JSON.stringify(row.transStepsAttach))
            this.tableForm.forEach(item => {
              item.isRequired = item.isRequired.toString()
            })
            let obj = {
              id: row.id,
              stepsTypeName: row.stepsTypeName,
              name: row.name,
              planDays: row.planDays,
              overTimeDays: 0,
              isSms: 0
            }
            this.stepBusiness = obj
          }
        } else if (opera === "delete") {
          if (type === "info") {
            this.tableForm.find((item, index) => {
              if (item.id === row.id) {
                this.tableForm.splice(index, 1);
                return true;
              }
            });
          } else if (type === "stepsType") {
            const url = "/api/flowmanage/deleteStepsType"
            const info = "删除步骤类型"
            let param = {
              id: row.typeId
            }
            const msg = "删除步骤类型成功"
            this.deleteStepsPost(url,info,param,msg)
          } else if (type === "stepBusiness") {
            const url = "/api/flowmanage/deleteSteps"
            const info = "删除交易步骤"
            let param = {
              id: row.id
            }
            const msg = "删除交易步骤成功"
            this.deleteStepsPost(url,info,param,msg)
          }
        }
      },
      //删除步骤类型和交易步骤请求
      deleteStepsPost(url,info,param,msg) {
        this.$confirm('是否删除该信息?', info, {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$ajax.post(url,param).then(res => {
            res = res.data
            if(res.status === 200) {
              this.$message(msg)
              this.getData()
            }
          }).catch(error => {
            console.log(error);
          })
        })
      }
    }     
  }  
</script>

<style lang="less" scoped>
.data-list {
  margin-top: 12px;
  display: flex;
  //步骤类型
  .stepsType {
    min-width: 29%;
    background-color: #fff;
    .title {
      height: 63px;
      line-height: 63px;
      display: flex;
      justify-content: space-between;
      font-family: "MicrosoftYaHei";
      span {
        font-size: 18px;
        color: rgba(35, 50, 65, 1);
      }
      .el-button {
        margin-top: 14px;
        width: 121px;
        height: 36px;
        background: rgba(71, 141, 227, 1);
        border-radius: 18px;
      }
    }
    /deep/ .el-table {
      tr:first-child td:first-child {
        background-color: #478DE3;
        color: #fff;
      }
    }
  }
  //交易步骤
  .tradeSteps {
    min-width: 70%;
    margin-left: 1%;
    background: rgba(254, 252, 247, 1);
    box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
    .title {
      height: 63px;
      line-height: 63px;
      font-family: "MicrosoftYaHei";
      span {
        font-size: 18px;
        color: rgba(35, 50, 65, 1);
      }
      .el-button {
        float: right;
        margin-top: 14px;
        width: 121px;
        height: 36px;
        background: rgba(71, 141, 227, 1);
        border-radius: 18px;
      }
    }
    /deep/ .el-table td {
      background-color: rgba(254,252,247,1);
      padding: 0;
      .cell {
        padding: 0;
        p {
          border-bottom: 1px solid #EDECF0;
          line-height: 2.4;
          &:last-child {
            border: none;
          }
        }
      }
    }
  }
  .gap {
    padding: 0 12px;
    box-sizing: border-box;
    border-radius: 4px;
    /deep/ .el-table {
      border-left: 1px solid #EDECF0;
      td {
        border-right: 1px solid #EDECF0;
      }
    }
  }
  .addform {
    .el-form-item {
      display: flex;
      &:first-child {
        /deep/ .el-form-item__label::before {
          content: "*";
          color: red;
        }
        .el-input { width: 305px; }
      }
      &:last-child {
        /deep/ .el-input { width: 282px; }
      }
    }
  }
  .modal-context {
    .menu-table {
      p {
        width: 100%;
        .el-button { 
          width: 100%;
          border-top: none;
          &.el-icon-plus:before {
            font-size: 18px;
            color: #CECECE;
          }
        }
      }
    }
  }
}
</style>