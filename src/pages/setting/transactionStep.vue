<template>
  <div class="data-list">
    <!-- 左侧 步骤类型 -->
    <div class="stepsType gap">
      <div class="title">
          <span>步骤类型</span>
          <el-button type="primary" @click="stepsTypeDialog = true">添加步骤类型</el-button>
      </div>
      <el-table :data="listData" @row-click="line" highlight-current-row>
          <el-table-column
          align="center"
          :label="item.name"
          :prop="item.prop"
          :formatter="nullFormatter"
          v-for="item in tHeader"
          :key="item.id">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button @click="rowOperation(scope.row,1)" type="text" size="small">编辑</el-button>
              <el-button @click="rowOperation(scope.row,2)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
      </el-table>
    </div>
    <!-- 右侧 交易步骤 -->
    <div class="tradeSteps gap">
      <div class="title">
        <span>交易步骤</span>
        <el-button type="primary" @click="tradeStepsDialog = true">添加交易步骤</el-button>
      </div>
      <el-table :data="listotherdata">
        <el-table-column align="center" :label="item.name" :prop="item.prop" :formatter="nullFormatter"
                        v-for="item in tHeader_other" :key="item.id">
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
            <el-button type="text" size="medium">编辑</el-button>
            <el-button type="text" size="medium">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加和编辑步骤类型 -->
    <el-dialog title="添加步骤类型" :visible.sync="stepsTypeDialog" width="740px">
      <el-form :model="addform">
        <el-form-item label="添加步骤名称" label-width="120px">
          <el-input v-model="addform.typeName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分配负责角色" label-width="120px">
          <el-select v-model="addform.dutyType">
            <el-option v-for="(item,index) in listData" :key="index" :label="item.dutyType" :value="item.dutyType"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="stepsTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="addstep">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加和编辑交易步骤 -->
    <el-dialog :title="modalTitle" :visible.sync="tradeStepsDialog" width="740px">
      <div class="modal-context">
        <template>
          <div class="input-group">
            <label>步骤名称：</label>
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
              <el-table-column align="center" label="名称">
                <template slot-scope="scope">
                  <el-input width='100%' v-model="tableForm[scope.$index].title"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="信息类型">
                <template slot-scope="scope">
                  <el-select v-model="tableForm[scope.$index].type" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="是否必填" min-width="140px">
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
              <el-button @click="addCell" class="el-icon-plus">添加</el-button>
            </p>
          </div>
        </template>
      </div>
      <div slot="footer" class="modal-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog> 
  </div>
</template>
           
<script>
  import { FILTER } from "@/assets/js/filter";
  let stepTypeId = 1;

  export default {
    mixins: [FILTER],
    data() {
      return {
        listData: [], //步骤类型列表
        listotherdata:[], //交易步骤列表
        stepsTypeDialog:false, //添加和编辑步骤类型 弹出框
        tradeStepsDialog:false, //添加和编辑交易步骤 弹出框
        transStepsAttach:[],
        modalTitle: "",
        tableForm: [
          {
            id: 1,
            isRequired: "",
            title: "",
            type: ""
          }
        ],
        addform:{
          typeName:'',
          dutyType:''
        },
        stepBusiness: {
          stepsTypeId: "",
          stepsTypeName: "",
          name: "",
          planDays: "",
          overTimeDays: "",
          isSms: ""
        },
        //步骤类型 表头
        tHeader:[
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
          },
          {
            id: 5,
            prop: "isSms",
            name: "是否短信通知"
          },
        ],
      }
    },
    created() {
      this.getData()
    },
    methods: {
      addstep() {
        this.stepsTypeDialog = false
      },
      line(row,column,e) {
        this.listotherdata = row.stepsList
        for(var i=0;i<this.listotherdata.length;i++){
          this.listotherdata[i].transStepsAttach = JSON.parse(this.listotherdata[i].transStepsAttach)
        }
      },
      getData: function () {
        this.$ajax.post(`/api/flowmanage/selectTypeStepsList`, {cityId: 1}).then(res => {
        res = res.data
        if (res.status === 200) {
          this.listData = res.data
          }
        })
      },
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
      /**
       * 提交表单
       */
      submitForm: function() {
        if (this.modalTitle === "添加交易步骤") {
          let obj = {
            transStepsAttach: this.tableForm
          };
          obj = Object.assign({}, this.stepBusiness, {
            transStepsAttach: JSON.stringify(obj)
          });
          this.$ajax
            .post("/api/flowmanage/insertSteps", obj)
            .then(res => {})
            .catch(error => {
              console.log(error);
            });
        }
      },
      /**
       * 列表操作
       * @param row
       * @param type
       */
      rowOperation: function(row, opera, type) {
        if (opera === "delete") {
          if (type === "info") {
            this.tableForm.find((item, index) => {
              if (item.id === row.id) {
                this.tableForm.splice(index, 1);
                return true;
              }
            });
          } else if (type === "stepBusiness") {
            this.$ajax
              .post("/api/flowmanage/deleteSteps", { id: row.id })
              .then(res => {
                res = res.data;
                if (res.status === 200) {
                  this.$message("删除交易步骤成功");
                }
              })
              .catch(error => {
                console.log(error);
              });
          }
        }
      },
    }     
  }  
</script>

<style lang="less" scoped>
.data-list {
  margin-top: 12px;
  display: flex;
  //步骤类型
  .stepsType {
    background: #fff;
    min-width: 29%;
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
    }
  }
  .gap {
    padding: 0 12px;
    box-sizing: border-box;
    border-radius: 4px;
  }
}
/deep/ .el-table {
  border-left: 1px solid #EDECF0;
  td {
    border-right: 1px solid #EDECF0;
  }
}
</style>