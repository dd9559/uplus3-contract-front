<template>
    <div class="data-list">    
      <div class="one">
        <div class="title">
            <span>步骤类型</span>
            <el-button type="primary" @click="addstepstype('添加步骤类型')">添加步骤类型</el-button>
        </div>
        <el-table :data="listData" @row-click="line" highlight-current-row>
            <el-table-column align="center" :label="item.name"
             :prop="item.prop" :formatter="nullFormatter"
              v-for="item in tHeader" :key="item.id">
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button @click="rowOperation(scope.row,1)" type="text" size="small">编辑</el-button>
                <el-button @click="rowOperation(scope.row,2)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
      </div>
      <div class="two">
          <div class="title">
            <span>交易步骤</span>
            <el-button type="primary" @click="showrightdialog">添加交易步骤</el-button>
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
        </el-table>
      </div>
      <!-- 添加步骤类型 -->
      <el-dialog title="添加步骤类型" :visible.sync="addstepsdialog">
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
          <el-button @click="addstepsdialog = false">取 消</el-button>
          <el-button type="primary" @click="addstep">确 定</el-button>
        </div>
      </el-dialog>
       <!-- 添加交易步骤 -->
        <el-dialog :title="modalTitle" :visible.sync="rightmodal">
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
            <div class="input-group">
              <label>超时提醒：</label>
              <el-input type="text" v-model="stepBusiness.overTimeDays"></el-input>
            </div>
            <div class="input-group">
              <label>是否短信提醒：</label>
              <el-radio v-model="stepBusiness.isSms" label="1">是</el-radio>
              <el-radio v-model="stepBusiness.isSms" label="2">否</el-radio>
            </div>
            <div class="menu-table">
              <p>附属信息</p>
              <el-table border :data="tableForm" style="width: 100%">
                <el-table-column align="center" label="名称">
                  <template slot-scope="scope">
                    <el-input v-model="tableForm[scope.$index].title"></el-input>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="信息类型">
                  <template slot-scope="scope">
                    <!--<el-select v-model="tableForm[scope.$index].type" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>-->
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
import {FILTER} from "@/assets/js/filter";
export default{
        data(){
          return {
            addformrightdialog:false,
             addstepsdialog:false,
             listData: [],
             rightmodal:false,
             listotherdata:[],
             transStepsAttach:[],
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
        methods:{
          showrightdialog(){
            this.rightmodal = true
          },
          addstep(){
            this.addstepsdialog = false
          },
          addstepstype(){
            this.addstepsdialog = true
          },
          rowOperation2(row){
            console.log(row)
          },   
          line(row,column,e){
            this.listotherdata = row.stepsList
            console.log(this.listotherdata)
            for(var i=0;i<this.listotherdata.length;i++){
              this.listotherdata[i].transStepsAttach = JSON.parse(this.listotherdata[i].transStepsAttach)
            }
          },
            getData: function () {
                this.$ajax.post(`/api/flowmanage/selectTypeStepsList`, {cityId: 1}).then(res => {
                res = res.data
                if (res.status === 200) {
                    console.log(res.data)
                    this.listData = res.data
                    }
                  })
                },
            },
        created(){
            this.getData();
        }     
  }
        
</script>
<style lang="less" scoped>
.data-list {
  margin-top: 12px;
  .one {
    float: left;
    padding: 0 20px 0 12px;
    background: #fff;
    width: 29%;
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
    /deep/ .el-table {
      .has-gutter {
        tr {
          border-radius: 4px;
          th {
            background: rgba(238, 242, 251, 1) !important;
          }
        }
      }
    }
  }
  .two {
    float: left;
    width: 64%;
    margin-left: 2px;
    padding: 0 20px 0 12px;
    background: rgba(254, 252, 247, 1);
    box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
    border-radius: 4px;
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
    /deep/ .el-table {
      .has-gutter {
        tr {
          border-radius: 4px;
          th {
            background: rgba(238, 242, 251, 1) !important;
          }
        }
      }
      tbody{
        tr {
          background:rgba(254,252,247,1)
        }
      }
    }
  }
}
</style>