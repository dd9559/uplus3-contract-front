<template>
    <div>
       <div class="dialog1">
               <el-dialog
             :visible.sync="shows"
             :before-close="handleClose"
             >
                           <b class="el-icon-close" @click="closeDialog"></b>
                           <div class="ach-header">
                             <h1 v-if="dialogType==0">业绩审核</h1> 
                             <h1 v-if="dialogType==1">业绩编辑</h1> 
                             <h1 v-if="dialogType==2">业绩反审核</h1>  
                             <h1 v-if="dialogType==3">业绩分成</h1> 
                             <p>可分配业绩：<span class="orange">3000元</span></p>
                           </div> 
                           <div class="ach-body">
              
                                <div class="house-divide">
                                    <div class="house-left f_l">
                                              <h1>房源方分成</h1>
                                    </div>
                                    <div class="house-right f_r">
                                             <el-button type="primary" @click="relativeMans">相关人员</el-button>
                                             <el-button type="primary"  @click="addMansHouse">添加分配人</el-button>
                                    </div>
                                </div>
                                <div class="ach-divide-list">
                                       <el-table                                      
                                       :data="achDetail"
                                       style="width: 100%">
                                      <el-table-column
                                        label="角色类型"
                                        width="110">
                                       <template slot-scope="scope">
                                            <el-select v-model="value" placeholder="请选择">
                                                   <el-option
                                                     v-for="item in options"
                                                     :key="item.value"
                                                     :label="item.label"
                                                     :value="item.value">
                                                   </el-option>
                                             </el-select> 

                                               <!-- <el-autocomplete
                                                class="inline-input"
                                                v-model="state1"
                                                :fetch-suggestions="querySearch"
                                                placeholder="请输入内容"
                                                @select="handleSelect"
                                              ></el-autocomplete> -->
                                        </template>
                                      </el-table-column>

                                      <el-table-column
                                        label="分成比例"
                                        width="100">
                                        <template slot-scope="scope">
                                          <el-input v-model="input" placeholder="请输入"></el-input>
                                        </template>
                                      </el-table-column>

                                      <el-table-column
                                        label="经纪人"
                                        width="100">
                                           <template slot-scope="scope">
                                              <el-input v-model="scope.row.name" placeholder="请输入"></el-input>
                                           </template>
                                      </el-table-column>

                                       <el-table-column
                                        label="在职状况"
                                        width="110">
                                         <template slot-scope="scope">
                                            <el-select v-model="value" placeholder="请选择">
                                                   <el-option
                                                     v-for="item in options"
                                                     :key="item.value"
                                                     :label="item.label"
                                                     :value="item.value">
                                                   </el-option>
                                             </el-select> 
                                        </template>
                                      </el-table-column>

                                      
                                      <el-table-column
                                        label="门店"
                                        width="110">
                                        <template slot-scope="scope">
                                            <el-select v-model="value" placeholder="请选择">
                                                   <el-option
                                                     v-for="item in options"
                                                     :key="item.value"
                                                     :label="item.label"
                                                     :value="item.value">
                                                   </el-option>
                                             </el-select> 
                                        </template>
                                      </el-table-column>


                                       <el-table-column
                                        label="店长"
                                        width="80">
                                        <template slot-scope="scope">
                                              <el-input v-model="scope.row.shopowner" placeholder="请输入"></el-input>
                                        </template>
                                      </el-table-column>

                                      <el-table-column
                                        label="单组"
                                        width="120">
                                         <template slot-scope="scope">
                                              <el-input v-model="scope.row.level4" placeholder="请输入"></el-input>
                                        </template>
                                      </el-table-column>

                                    

                                     <el-table-column
                                        label="区经"
                                        width="80"> 
                                        <template slot-scope="scope">
                                              <el-input v-model="scope.row.amaldar" placeholder="请输入"></el-input>
                                        </template>
                                      </el-table-column>

                                      
                                     <el-table-column
                                        label="区总"
                                        width="80"> 
                                        <template slot-scope="scope">
                                              <el-input v-model="scope.row.manager" placeholder="请输入"></el-input>
                                        </template>
                                      </el-table-column>

                                     <el-table-column
                                        label="门店公共业绩"
                                        width="120"> 
                                        <template slot-scope="scope">
                                              <el-radio v-model="scope.row.radio" name="scope.row.name1" label="门店"></el-radio>
                                             <!-- <p> <input type="radio" :name="scope.row.name1"></p> -->
                                        </template>
                                      </el-table-column>

                                      <el-table-column
                                        label="公司公共业绩"
                                        width="120"> 
                                         <template slot-scope="scope">
                                           <el-radio v-model="scope.row.radio" name="scope.row.name1" label="公司"></el-radio>
                                          <!-- <p> <input type="radio"   :name="scope.row.name1"></p> -->
                                        </template>
                                      </el-table-column>

                                     <el-table-column
                                        prop="manager"
                                        label="操作"
                                        width="80"> 
                                         <template slot-scope="scope">
                                            <a  class="delete" style="color:#478de3;text-decoration:underline;" @click="deleteHouse(scope.$index,achDetail)">删除</a>
                                            <!-- <a href="javascript:;" class="delete" style="color:#478de3;" @click="delete(index)">删除</a> -->
                                        </template>
                                      </el-table-column>
                                    </el-table>
                                </div>

                                <div class="house-divide">
                                    <div class="house-left f_l">
                                              <h1>客源方分成</h1>
                                    </div>
                                    <div class="house-right f_r">
                                             <el-button type="primary" @click="relativeMans">相关人员</el-button>
                                             <el-button type="primary" @click="addMansClient">添加分配人</el-button>
                                    </div>
                                </div>

                                <div class="ach-check-list">
                                      <el-table                                      
                                       :data="achDetail1"
                                       style="width: 100%">
                                      <el-table-column
                                        label="角色类型"
                                        width="110">
                                       <template slot-scope="scope">
                                            <el-select v-model="value" placeholder="请选择">
                                                   <el-option
                                                     v-for="item in options"
                                                     :key="item.value"
                                                     :label="item.label"
                                                     :value="item.value">
                                                   </el-option>
                                             </el-select> 
                                        </template>
                                      </el-table-column>

                                      <el-table-column
                                        label="分成比例"
                                        width="100">
                                        <template slot-scope="scope">
                                          <el-input v-model="input" placeholder="请输入"></el-input>
                                        </template>
                                      </el-table-column>

                                      <el-table-column
                                        label="经纪人"
                                        width="100">
                                           <template slot-scope="scope">
                                              <el-input v-model="scope.row.name" placeholder="请输入"></el-input>
                                           </template>
                                      </el-table-column>

                                       <el-table-column
                                        label="在职状况"
                                        width="110">
                                         <template slot-scope="scope">
                                            <el-select v-model="value" placeholder="请选择">
                                                   <el-option
                                                     v-for="item in options"
                                                     :key="item.value"
                                                     :label="item.label"
                                                     :value="item.value">
                                                   </el-option>
                                             </el-select> 
                                        </template>
                                      </el-table-column>

                                      
                                       <el-table-column
                                        label="店长"
                                        width="80">
                                        <template slot-scope="scope">
                                              <el-input v-model="scope.row.shopowner" placeholder="请输入"></el-input>
                                        </template>
                                      </el-table-column>

                                      <el-table-column
                                        label="单组"
                                        width="120">
                                         <template slot-scope="scope">
                                              <el-input v-model="scope.row.level4" placeholder="请输入"></el-input>
                                        </template>
                                      </el-table-column>

                                       <el-table-column
                                        label="门店"
                                        width="110">
                                        <template slot-scope="scope">
                                            <el-select v-model="value" placeholder="请选择">
                                                   <el-option
                                                     v-for="item in options"
                                                     :key="item.value"
                                                     :label="item.label"
                                                     :value="item.value">
                                                   </el-option>
                                             </el-select> 
                                        </template>
                                      </el-table-column>

                                     <el-table-column
                                        label="区经"
                                        width="80"> 
                                        <template slot-scope="scope">
                                              <el-input v-model="scope.row.amaldar" placeholder="请输入"></el-input>
                                        </template>
                                      </el-table-column>

                                      
                                     <el-table-column
                                        label="区总"
                                        width="80"> 
                                        <template slot-scope="scope">
                                              <el-input v-model="scope.row.manager" placeholder="请输入"></el-input>
                                        </template>
                                      </el-table-column>

                                     <el-table-column
                                        label="门店公共业绩"
                                        width="120"> 
                                        <template slot-scope="scope">
                                              <el-radio v-model="scope.row.radio" name="scope.row.name1" label="门店"></el-radio>
                                             <!-- <p> <input type="radio" :name="scope.row.name1"></p> -->
                                        </template>
                                      </el-table-column>

                                      <el-table-column
                                        label="公司公共业绩"
                                        width="120"> 
                                         <template slot-scope="scope">
                                           <el-radio v-model="scope.row.radio" name="scope.row.name1" label="公司"></el-radio>
                                          <!-- <p> <input type="radio"   :name="scope.row.name1"></p> -->
                                        </template>
                                      </el-table-column>

                                     <el-table-column
                                        prop="manager"
                                        label="操作"
                                        width="80"> 
                                         <template slot-scope="scope">
                                             <a  class="delete" style="color:#478de3;text-decoration:underline;" @click="deleteHouse(scope.$index,achDetail1)">删除</a>
                                            <!-- <a href="javascript:;" class="delete" style="color:#478de3;" @click="delete(index)">删除</a> -->
                                        </template>
                                      </el-table-column>
                                    </el-table>
                                </div>
                           </div> 

                           <!-- 业绩审核底部 -->
                          <div class="ach-footer" v-if="dialogType==0">
                               <p>
                                    备注：
                                    <el-input
                                      type="textarea"
                                      :rows="2"
                                      placeholder="请输入内容"
                                      class="f_l"
                                      v-model="textarea"
                                      >  
                                    </el-input>
                                </p>
                                <div class="footer-btn-layout f_r">
                                       <el-button type="primary" round @click="passClose" class="color-green">通过</el-button>
                                       <el-button type="primary" round @click="closeDialog" class="color-red">驳回</el-button>                       
                                </div>
                           </div> 

                            <!-- 业绩编辑底部 -->
                           <div class="ach-footer" v-else="dialogType==1">
                                <div class="footer-btn-layout f_r">
                                       <el-button type="primary" round @click="passClose" class="color-blue">保存</el-button>
                                </div>
                           </div>
                             <!-- 业绩反审核底部 -->
                           <div class="ach-footer" v-else="dialogType==2">
                               <p>
                                    审核日期：
                                     <el-date-picker
                                      v-model="value1"
                                      type="date"
                                      placeholder="选择日期">
                                    </el-date-picker>
                                </p>
                                <div class="footer-btn-layout f_r">
                                       <el-button type="primary" round @click="passClose" class="color-blue">保存</el-button>
                                </div>
                           </div>

                           <!-- 业绩分成底部      -->
                           <div class="ach-footer" v-else="dialogType==3">
                                <div class="footer-btn-layout f_r">
                                       <el-button type="primary" round @click="passClose" class="color-white">取消</el-button>
                                       <el-button type="primary" round @click="passClose" class="color-blue">保存</el-button>
                                </div>
                           </div>
                          
                           
                             <div class="dialog2">
                                 <el-dialog
                                     :visible.sync="showTips"
                                     append-to-body
                                     custom-class="dialog2In"
                                     >
                                     <h1>选择相关人员</h1>
                                  <div class="mansList">
                                        <el-table
                                           :data="mansList"
                                           style="width: 100%"
                                           @selection-change="handleSelectionChange">
                                                <!-- <el-table-column
                                                  prop="role_type"
                                                  width="70">
                                                       <template slot-scope="scope">
                                                            <el-checkbox v-model="checked"></el-checkbox>
                                                       </template>
                                                       <template slot="header" slot-scope="slot">
                                                            <el-checkbox v-model="checked"></el-checkbox> 
                                                      </template>
                                                 </el-table-column> -->
                                                
                                                    <el-table-column
                                                      type="selection"
                                                      width="70">
                                                    </el-table-column>
                                                                                                

                                                 <el-table-column
                                                   label="经纪人"
                                                   prop="distributionList"
                                                   width="90">
                                                   <template slot-scope="scope">
                                                            <p>{{scope.row.agent}}</p>
                                                   </template>
                                                  </el-table-column>

                                                  <el-table-column
                                                     label="门店"
                                                     prop="distributionList"
                                                     width="120">
                                                     <template slot-scope="scope">
                                                           <p>{{scope.row.mendian}}</p>
                                                     </template>
                                                  </el-table-column>

                                                  <el-table-column
                                                    label="角色类型"
                                                    prop="distributionList"
                                                    width="120">
                                                    <template slot-scope="scope">
                                                             <p>{{scope.row.type}}</p>
                                                    </template>
                                                  </el-table-column>
                                     </el-table>
                                 </div>

                                  <div class="dialog2-btn f_r">
                                       <el-button type="primary" round @click="showTips = false">取消</el-button>
                                       <el-button type="primary" round @click="showTips = false">确定</el-button>
                                  </div>
                             </el-dialog>
                             </div>
                </el-dialog>
       </div>


     
    </div>
</template>

<script>
export default {
  name: "achDialog",
  data() {
    return {
      achDetail: [
        {
          role_type: "房源录入人",
          distributionList: "10",
          name: "经纪人",
          is_job: "离职",
          shopowner: "店长",
          level4: "楚河汉街一店",
          level3: "门店名称",
          amaldar: "区经",
          manager: "区总",
          name1: 1,
          radio: 1
        },
        {
          role_type: "房源录入人",
          distributionList: "10",
          name: "经纪人",
          is_job: "离职",
          shopowner: "店长",
          level4: "楚河汉街一店",
          level3: "门店名称",
          amaldar: "区经",
          manager: "区总",
          name1: 2,
          radio: 2
        }
      ],
      achDetail1: [
        {
          role_type: "房源录入人",
          distributionList: "10",
          name: "经纪人",
          is_job: "离职",
          shopowner: "店长",
          level4: "楚河汉街一店",
          level3: "门店名称",
          amaldar: "区经",
          manager: "区总",
          name1: 1,
          radio: 1
        }
      ],
      mansList: [
        {
          agent: "春天风",
          mendian: "楚河汉街一店",
          type: "房源录入人"
        },
        {
          agent: "春天风",
          mendian: "楚河汉街一店",
          type: "房源录入人"
        },
        {
          agent: "春天风",
          mendian: "楚河汉街一店",
          type: "房源录入人"
        }
      ],
      showTips: false,
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "",
      input: "",
      value1: "",
      textarea: ""
    };
  },
  props: {
    shows: Boolean,
    dialogType: Number
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    info() {
      this.$emit("close");
    },
    closeDialog() {
      this.$emit("close");
    },
    relativeMans() {
      this.showTips = true;
    },
    addMansHouse() {
      // alert(this.mansList);
      let obj = {
        role_type: "",
        distributionList: "",
        name: "",
        is_job: "",
        shopowner: "",
        level4: "",
        level3: "",
        amaldar: "",
        manager: "",
        name1: null,
        radio: null
      };
      this.achDetail.push(obj);
    },
    addMansClient() {
      let obj = {
        role_type: "",
        distributionList: "",
        name: "",
        is_job: "",
        shopowner: "",
        level4: "",
        level3: "",
        amaldar: "",
        manager: "",
        name1: null,
        radio: null
      };
      this.achDetail1.push(obj);
    },
    deleteHouse(index, rows) {
      rows.splice(index, 1);
    },
    delete1(index, rows) {
      rows.splice(index, 1);
    },
    passClose() {
      this.$emit("close");
      console.log(22222222);
    },
    closeDialog() {
      this.$emit("close");
    },
    handleSelectionChange() {
      this.multipleSelection = val;
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .dialog2In {
  width: 400px !important;
  height: 400px !important;
  background-color: #fff;
  margin-top: 30vh !important;
  overflow: auto;
  .is-checked {
    color: #478de3 !important;
  }
  /deep/ .el-dialog__header {
    padding: 0 !important;
  }
  /deep/ .el-dialog__body {
    padding: 0 !important;
  }
  h1 {
    height: 53px;
    line-height: 53px;
    font-size: 20px;
    color: #233241;
    padding-left: 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #edecf0;
    // /deep/ .delete {
    //   color: #478de3 !important;
    // }
  }
  .mansList {
    margin-top: 25px;
  }
  /deep/ tr td:first-of-type,
  th:first-of-type {
    padding-left: 20px;
  }

  .dialog2-btn {
    margin-top: 40px;
    margin-right: 20px;
    button {
      width: 100px;
      height: 38px;
      border-radius: 19px;
    }
    button:first-of-type {
      background-color: #fff;
      color: #000;
      border: 1px solid #e8eaf6;
    }
  }
}

//业绩详情弹框改变样式
.dialog1 {
  /deep/ .el-dialog {
    max-width: 1000 !important;
    height: 666px;
    overflow: auto;
    /deep/ .el-input__inner {
      border: 0;
      box-shadow: 0;
      padding: 0;
      padding-left: 10px;
    }
    /deep/ .el-input__suffix {
      right: 21px;
    }
    b {
      position: absolute;
      right: 30px;
      top: 30px;
      font-size: 30px;
    }
    .ach-header {
      min-height: 80px;
      min-width: 100%;
      background-color: #fff;
      border-bottom: 1px solid #edecf0;
      overflow: hidden;
      h1 {
        font-size: 20px;
        color: #233241;
        margin: 20px 0 0 30px;
      }
      p {
        font-size: 14px;
        color: #6c7986;
        margin: 12px 0 0 30px;
        line-height: 0;
      }
    }
    .ach-body {
      min-height: 585px;
      min-width: 1200;
      // background-color: pink;
      padding: 0 30px;
      box-sizing: border-box;
      overflow-y: auto;
      .house-divide {
        width: 100%;
        //   background-color: pink;
        .house-left {
          margin-top: 30px;
          margin-bottom: 30px;
          h1 {
            font-size: 16px !important;
            color: #233241 !important;
            margin: 0px !important;
          }
        }

        .house-right {
          margin-top: 20px;
          button {
            padding: 0 !important;
            border-radius: 0;
          }
          button:first-of-type {
            width: 90px;
            height: 36px;
            border-radius: 18px;
          }
          button:nth-of-type(2) {
            width: 105px;
            height: 36px;
            border-radius: 18px;
          }
          .el-button--primary {
            background-color: #409eff;
            border: 0;
          }
        }
      }
      /deep/ .el-table {
        font-size: 14px !important;
        margin-top: 20px;
        td,
        th {
          padding: 24px 0;
        }
        .el-table__header {
          height: 55px;
          th {
            padding: 0;
            .cell {
              background-color: #eef2fb;
              // background-color: pink;
              height: 55px;
              line-height: 55px;
            }
          }
        }
      }
      //弹框审核信息
      h1 {
        font-size: 16px;
        color: #233241;
        margin: 0px !important;
      }
    }

    .ach-footer {
      min-height: 100px;
      width: 100%;
      background-color: #fff;
      padding-left: 20px;
      box-sizing: border-box;
      position: relative;
      p {
        margin-top: 30px;
      }
      .el-textarea {
        position: absolute;
        left: 70px;
        top: 0;
        padding-bottom: 80px;
        width: 60%;
      }
      textarea {
        width: 500px !important;
      }
      .footer-btn-layout {
        height: 38px;
        text-align: right;
        padding-right: 30px;
        margin-top: 15px;
        button {
          width: 100px;
          height: 38px;
          border-radius: 19px;
          border: 0;
        }
        .color-green {
          background-color: #54d384;
        }
        .color-red {
          background-color: #f56c6c;
          margin-left: 20px;
        }
        .color-blue {
          background-color: #478de3;
        }
        .color-white {
          background-color: #fff;
          color: #000;
          border: 1px solid #e8eaf6;
        }
      }
    }
    /deep/ .el-dialog__header,
    /deep/ .el-dialog__footer,
    /deep/ .el-dialog__body {
      padding: 0 !important;
    }
    /deep/ .el-dialog__header {
      .el-dialog__headerbtn {
        right: 0;
        top: 0;
        display: none;
      }
    }
  }
}
</style>
