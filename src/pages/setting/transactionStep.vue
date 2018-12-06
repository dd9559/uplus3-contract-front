<template>
  <div class="data-list">
    <!-- 左侧 步骤类型 -->
    <div class="stepsType gap">
      <span class="sanjiao"></span>
      <div class="title">
        <span>步骤类型</span>
        <el-button type="primary" @click="addStepsType">添加步骤类型</el-button>
      </div>
      <el-table :data="listData" @cell-click="cellClick">
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
        <!-- <el-table-column align="center" label="是否短信通知">
          <template slot-scope="scope">
            <div>{{scope.row.isSms==1?'是':'否'}}</div>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="步骤附属信息">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.transStepsAttach" :key="index">{{item.title}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="信息类型">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.transStepsAttach" :key="index">{{item.type|getValue}}</p>     
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
    <el-dialog :title="modalTitle" :visible.sync="stepsTypeDialog" width="740px" class="steps-type" :closeOnClickModal="$tool.closeOnClickModal">
      <el-form :model="addForm" class="addform" size="small">
        <el-form-item label="步骤类型">
          <el-input v-model="addForm.name" autocomplete="off" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="分配负责角色">
          <el-select v-model="addForm.dutyType" filterable>
            <el-option v-for="item in roleList" :key="item.key" :label="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitForm" class="confirmBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加和编辑交易步骤 -->
    <el-dialog :title="modalTitle" :visible.sync="tradeStepsDialog" width="740px" :closeOnClickModal="$tool.closeOnClickModal">
      <div class="modal-context">
        <template>
          <div class="input-group">
            <label>步骤类型：</label>
            <span>{{stepBusiness.stepsTypeName}}</span>
          </div>
          <div class="input-group">
            <label>步骤名称：</label>
            <el-input type="text" v-model="stepBusiness.name" :maxlength="inputMax"></el-input>
            <span class="text-absolute">{{validInput}}/{{inputMax}}</span>
          </div>
          <div class="input-group">
            <label>计划天数：</label>
            <el-input type="number" v-model="stepBusiness.planDays"></el-input>
          </div>
          <div class="menu-table">
            <el-table border :data="tableForm" style="width: 100%">
              <el-table-column align="center" label="名称" min-width="150">
                <template slot-scope="scope">
                  <el-input v-model="tableForm[scope.$index].title"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="信息类型" min-width="150">
                <template slot-scope="scope">
                  <el-select v-model="tableForm[scope.$index].type" placeholder="请选择信息类型">
                    <el-option
                      v-for="item in dictionary['561']"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="是否必填" min-width="120">
                <template slot-scope="scope">
                  <el-radio-group v-model="tableForm[scope.$index].isRequired">
                    <el-radio v-for="item in dictionary['570']" :key="item.key" :label="item.value" :value="item.key"></el-radio>
                  </el-radio-group>
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
        <el-button @click="confirmForm" class="confirmBtn">确 定</el-button>
      </div>
    </el-dialog> 
  </div>
</template>
           
<script>
  import { FILTER } from "@/assets/js/filter";
  import {MIXINS} from "@/assets/js/mixins";
  let stepTypeId = 1;
  const infoType = ["文本","数字","日期","图片","视频","PDF","EXCEL","Word"]

  export default {
    mixins: [FILTER,MIXINS],
    props: ["cityId"],
    data() {
      return {
        listData: [], //步骤类型列表
        listData_other: [], //交易步骤列表
        stepsTypeDialog: false, //添加和编辑步骤类型 弹出框
        tradeStepsDialog: false, //添加和编辑交易步骤 弹出框
        modalTitle: "", //弹出框title标题
        //新增和编辑步骤类型 表单
        addForm: {
          cityId: this.cityId,
          name: '',
          dutyType: ''
        },
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
          }
        ],
        //交易步骤信息类型
        dictionary: {
          '561':'',
          '570':''
        },
        roleList: [],
        inputMax: 30,
        allRows: {}
      }
    },
    created() {
      this.getRoleList()
      this.getDictionary()
      this.getData()
    },
    methods: {
      //获取步骤类型列表
      getData: function () {
        this.$ajax.post(`/api/flowmanage/selectTypeStepsList`, {cityId: this.cityId}).then(res => {
          res = res.data
          if (res.status === 200) {
            this.listData = res.data
            this.listData_other = this.listData.length !== 0 ? this.listData[0].stepsList : []
            this.currentRow = this.listData[0]
            }
          }).catch(error => {
              this.$message({
                message:`${error.title}${error.msg}`
              })
          })
      },
      //单击步骤类型列表行单元格获取交易步骤
      cellClick(row, column, cell, event) {
        this.listData_other = row.stepsList
        this.currentRow = row
        //高亮选中的步骤类型
        let rows = cell.parentNode.parentNode.children
        this.allRows = rows
        for(var i = 0; i < rows.length; i++) {
          rows[i].firstElementChild.style.background = "#F7FBFF"
          rows[i].firstElementChild.style.color = "#478DE3"
        }
        cell.parentNode.firstElementChild.style.background = "#478DE3"
        cell.parentNode.firstElementChild.style.color = "#fff"
      },
      firstCellLight() {
        for(var i = 1; i < this.allRows.length; i++) {
          this.allRows[i].firstElementChild.style.background = "#F7FBFF"
          this.allRows[i].firstElementChild.style.color = "#478DE3"
        }
        this.allRows[0].firstElementChild.style.background = "#478DE3"
        this.allRows[0].firstElementChild.style.color = "#fff"
      },
      getRoleList() {
        this.$ajax.get('/api/roles').then(res => {
          res = res.data
          if(res.status === 200) {
            this.roleList = res.data
          }
        })
      },
      //点击添加步骤类型
      addStepsType() {
        this.stepsTypeDialog = true
        this.modalTitle = "添加步骤类型"
        this.addForm.name = ""
        this.addForm.dutyType = ""
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
        if(this.addForm.name === "") {
            this.$message("步骤类型不能为空")
          } else {
            this.roleList.find(item => {
              if(this.addForm.dutyType === item.value) {
                this.addForm.dutyId = item.key
              }
            })
            if(this.modalTitle === "添加步骤类型") {
              const url = "/api/flowmanage/insertStepsType"
              const msg = "添加步骤类型成功"
              this.stepsTypePost(url,this.addForm,msg)
            } else {
              const url = "/api/flowmanage/updateStepsType"
              let param = {
                id: this.currentRow.typeId
              }
              param = Object.assign({},this.addForm,param)
              const msg = "编辑步骤类型成功"
              this.stepsTypePost(url,param,msg)
            }  
          }
      },
      confirmForm() {
        if(this.stepBusiness.name === "") {
          this.$message("步骤名称不能为空")
        } else {
          let isOk
          this.tableForm.forEach(item => {
            isOk = false
            if(item.title) {
              if(item.type !== "") {
                if(item.isRequired) {
                  isOk = true
                } else {
                  this.$message({message:"是否必填项不能为空"})
                }
              } else {
                this.$message({message:"信息类型不能为空"})
              }
            } else {
              this.$message({message:"附属名称不能为空"})
            }
          })
          if(isOk) {
            if (this.modalTitle === "添加交易步骤") {
              const url = "/api/flowmanage/insertSteps"
              this.tradeStepsPost(url)
            } else {
              const url = "/api/flowmanage/updateSteps"
              this.tradeStepsPost(url)
            }
          } 
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
            this.firstCellLight()
          }
        }).catch(error => {
            this.$message({
              message:`${error.title}${error.msg}`
            })
        })
      },
      //添加和编辑交易步骤请求
      tradeStepsPost(url) {
        this.tableForm.forEach(item => {
          item.isRequired = item.isRequired === "是" ? 1 : 0
        })
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
            this.firstCellLight()
          }
        }).catch(error => {
            this.$message({
              message:`${error.title}${error.msg}`
            })
        })
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
              item.isRequired = item.isRequired === 1 ? "是" : "否"
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
              this.firstCellLight()
            }
          }).catch(error => {
              this.$message({
                message:`${error.title}${error.msg}`
              })
          })
        })
      }
    },
    computed: {
      validInput() {
        return this.stepBusiness.name.length
      }
    },
    watch: {
      "cityId": function(newVal,oldVal) {
        this.getData()
        this.addForm.cityId = newVal
      }
    },
    filters: {
      getValue(val) {
        for(var i = 0; i < infoType.length; i++) {
          if(val === i) {
            return infoType[i]
          }
        }
      }
    }
  }  
</script>

<style lang="less" scoped>
@import "~@/assets/common.less";
.data-list {
  margin-top: 12px;
  display: flex;
  height: calc(100% - 142px);
  //步骤类型
  .stepsType {
    min-width: 29%;
    background-color: #fff;
    position: relative;
    .sanjiao {
      width:0;
      right:-14px;
      top: 15px;
      position: absolute;
      border-width:7px;
      border-style:solid;
      border-color:transparent transparent transparent white;
    }
    .title {
      padding: 6px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: "MicrosoftYaHei";
      span {
        font-size: @size-14;
        color: rgba(35, 50, 65, 1);
      }
      .el-button {
        width: 121px;
        height: 32px;
        padding: 5px 10px;
        background: rgba(71, 141, 227, 1);
        border-radius: 18px;
      }
    }
    /deep/ .el-table {
      tr:first-child td:first-child {
        background-color: #478DE3;
        color: #fff;
      }
      tr td:first-child {
        background-color: #F7FBFF;
        color: #478DE3;
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
      padding: 6px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: "MicrosoftYaHei";
      span {
        font-size: @size-14;
        color: rgba(35, 50, 65, 1);
      }
      .el-button {
        width: 121px;
        height: 32px;
        padding: 5px 10px;
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
  .steps-type {
    /deep/ .el-dialog__body { margin-bottom: 220px; }
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
    .input-group {
      margin-bottom: 20px;
      /deep/ .el-input {
        height: 32px;
        .el-input__inner {
          height: 32px;
        }
      }
    }
    .text-absolute {
      position: absolute;
      right: 25px;
      color: #D6D6D6;
    }
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
    /deep/ .el-input {
      height: 32px;
      .el-input__inner {
        height: 32px;
      }
    }
  }
}
</style>