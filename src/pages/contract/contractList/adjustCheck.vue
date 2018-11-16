<!-- 调佣审核 -->
<template>
  <div class="view-container" id="adjustcheck">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn" :min="63"  class="adjustbox">
      <el-form :inline="true" :model="adjustForm" class="adjust-form" size="mini" ref="adjustCheckForm">

        <el-form-item label="发起日期">
          <!-- <el-date-picker v-model="adjustForm.signDate" type="daterange" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
          </el-date-picker> -->

        </el-form-item>
        <el-form-item label="合同类型">
          <el-select v-model="adjustForm.tradeType" placeholder="全部" class="width150">
            <el-option label="租赁" value="1"></el-option>
            <el-option label="买卖" value="2"></el-option>
            <el-option label="代办" value="3"></el-option>
            <el-option label="意向" value="4"></el-option>
            <el-option label="定金" value="5"></el-option>
          </el-select>  
        </el-form-item>         
        <el-form-item label="部门">
          <el-select v-model="adjustForm.item1" clearable filterable placeholder="请选择门店" class="width200">
              <el-option v-for="item in option1" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select v-model="adjustForm.item2" clearable filterable placeholder="经纪人" class="width100">
              <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="adjustForm.checkState" placeholder="全部" class="width150">
            <el-option label="未审核" value="1"></el-option>
            <el-option label="通过" value="2"></el-option>
            <el-option label="驳回" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="adjustForm.keyWord" clearable placeholder="合同编号/房源编号/客源编号"  class="width250"></el-input>
        </el-form-item>
      </el-form>
    </ScreeningTop>

    <!-- 数据列表 -->
    <div class="contract-list">  
      <div class="form-title-fl"><i class="iconfont icon-tubiao-11 mr8"></i>数据列表</div>   
      <el-table :data="tableData" style="width: 100%" >
        <el-table-column label="合同编号" width="150" fixed :formatter="nullFormatter">
          <template slot-scope="scope">
            <div class="blue curPointer" @click="goContractDetail(scope.row)">{{scope.row.contractCode}}</div>
          </template>
        </el-table-column>
        <el-table-column label="合同类型" prop="tradeType" :formatter="nullFormatter"></el-table-column>
        <el-table-column label="成交总价" prop="dealPrice" :formatter="nullFormatter"></el-table-column>
        <el-table-column label="成交经纪人" prop="dealPerson" :formatter="nullFormatter"></el-table-column>
        <el-table-column label="签约日期" prop="signDate" :formatter="nullFormatter"></el-table-column>
        <el-table-column label="发起日期" prop="createTime" :formatter="nullFormatter"></el-table-column>
        <el-table-column label="发起人" prop="createByName" :formatter="nullFormatter"></el-table-column>
        <el-table-column label="审核状态" :formatter="nullFormatter">
          <template slot-scope="scope">
            <span class="blue" v-if="scope.row.checkState===1">未提审</span>
            <span class="green" v-if="scope.row.checkState===2">通过</span>
            <span class="red" v-if="scope.row.checkState===3">驳回</span>
          </template>
        </el-table-column>
        <el-table-column label="审核日期" prop="checkTime" :formatter="nullFormatter"></el-table-column>   
        <el-table-column label="当前审核人" prop="checkByName" :formatter="nullFormatter"></el-table-column>
        <el-table-column label="审核备注" width="200" prop="checkRemark" :formatter="nullFormatter"></el-table-column>             
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" class="curPointer" @click="auditApply(scope.row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-size="50"
      :pager-count="11"
      :current-page="currentPage"
      layout="total, prev, pager, next, jumper"
      :total="total">
     </el-pagination>
    </div>

    <!-- 调佣审核弹框 -->
    <el-dialog title="调佣审核" :visible.sync="dialogVisible" width="820px" class="layer-audit">
      <div class="audit-box"  :style="{ height: clientHeight() }">
        <div class="audit-col">
          <div class="col-li">
            <p>合同编号：<span class="blue">{{layerAudit.contractCode}}</span></p>
            <p>物业地址：<span>{{layerAudit.propertyAddr}}</span></p>
          </div>
          <div class="col-li">
            <p>申请日期：<span>{{layerAudit.createTime}}</span></p>
            <p>申请人：<span>{{layerAudit.createByDepName + '-' + layerAudit.createByName}}</span></p>
          </div>
          <div class="col-li">
            <p>合同类型：<span>{{layerAudit.tradeType}}</span></p>
            <p class="mr100">成交总价：<span>{{layerAudit.dealPrice}}</span></p>
            <p>可分配业绩：<span>{{layerAudit.money}}</span></p>
          </div>
          <div class="col-li">
            <p>调整类型：<span>佣金调整</span></p>
            <p><el-checkbox v-model="layerAudit.relieve" :disabled="true">有解除协议</el-checkbox></p>
          </div>
          <div class="textareabox">
            <span>调整原因</span>
            <el-input type="textarea" :rows="3"  v-model="layerAudit.reason" class="textarea" maxlength=100 :disabled="true"></el-input>
          </div>
        </div>

        <div class="audit-col bordernone">
          <!-- 表格 -->
          <table class="table">
            <thead>
              <tr>
                <th></th>
                <th>业主佣金</th>
                <th>客户佣金</th>
                <!-- <th>按揭手续费</th> -->
                <th>合作费扣除</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>原金额</td>
                <td>{{layerAudit.ownerCommission}}</td>
                <td>{{layerAudit.custCommission}}</td>
                <!-- <td>另外出<span>;</span>客户<span>;</span>0元</td> -->
                <td>{{layerAudit.otherCooperationCost}}</td>
              </tr>
              <tr>
                <td>调整为</td>
                <td>{{layerAudit.newOwnerCommission}}</td>
                <td>{{layerAudit.newCustCommission}}</td>
                <!-- <td class="flex">       
                    <div>
                      <el-select v-model="auditForm.item1" class="width70 mr10" :disabled="true">
                        <el-option label="另外出" value="另外出"></el-option>
                        <el-option label="佣金扣" value="佣金扣"></el-option>
                        <el-option label="无" value="无"></el-option>
                      </el-select>
                    </div>
                    <div>
                      <el-select v-model="auditForm.item2" class="width70 mr10" :disabled="true">
                        <el-option label="客户" value="客户"></el-option>
                        <el-option label="业主" value="业主"></el-option>
                        <el-option label="无" value="无"></el-option>
                      </el-select>
                    </div> 
                    <div><el-input v-model="auditForm.money3" placeholder="输入金额" class="width70" :disabled="true"></el-input>元</div>
                  
                </td> -->
                <td>{{layerAudit.newOtherCooperationCost}}</td>
              </tr>
            </tbody>
          </table>
          <!-- 上传附件 -->
          <div class="uploadfile">
            <div class="uploadtitle">附件:</div>
            <div class="uploadbtn">
              
            </div>
          </div>                  
        </div>
        <!-- 审核备注 -->
        <div class="textareabox2">
          <span>调整原因</span>
          <el-input type="textarea" :rows="6"  v-model="auditForm.textarea" class="textarea" maxlength=200 ></el-input>
        </div>  
      </div>
      <div class="btnbox">
        <el-button class="refuse" @click="refuseFn">驳 回</el-button>
        <el-button type="primary"  @click="receptFn" class="recept">通 过</el-button>  
      </div> 
    </el-dialog>

  </div>
</template>


      
<script>
  import ScreeningTop from '@/components/ScreeningTop';
  import { Message } from 'element-ui';

  import {FILTER} from "@/assets/js/filter";
  export default {
    name: "adjust-check",
    mixins: [FILTER],
    data(){
      return{   
        clientHei: document.documentElement.clientHeight, //窗体高度
        
        adjustForm:{
          signDate: '', //发起日期
          tradeType: '', //合同类型
          item1: '',    //选择门店
          item2: '',  //选择成交人
          checkState: '',  //审核状态
          keyWord: ''   //关键字

        },
        layerAudit:{

        },

        auditForm: {
          textarea: '', //备注
          item1: '', //另外出-佣金扣-无
          item2: '', //客户-业主-无
          money1: '', //业主佣金
          money2: '', //客户佣金
          money3: '', //按揭收费
          money4: '', //合作费扣除
        },
        // 弹框里用到的
        dialogImageUrl: '',
        dialogVisible: false,
        // checked: false, //是否有解除协议
        // 选择门店
        option1: [{
            value: '选项1',
            label: '黄金糕'
        }, {
            value: '选项2',
            label: '双皮奶'
        }],
        // 选择经纪人
        option2: [{
            value: '选项1',
            label: '黄金糕'
        }, {
            value: '选项2',
            label: '双皮奶'
        }, {
            value: '选项3',
            label: '蚵仔煎'
        }],
        
        tableData:[
        //   {
        //     // contractCode:'YQYD110063', //合同编号
        //     // tradeType:1,              //合同类型
        //     // dealPrice:'12345121',
        //     // dealPerson:'当代一店下雨天1',
        //     // signDate:'2018/11/07',
        //     // createTime:'2018/11/07',
        //     // createByName:'当代一店下雨天2',
        //     // checkState:1,
        //     // checkTime:'2018/11/07',
        //     // checkByName: '当代一店下雨天3',
        //     // checkRemark:''
        // },
        
        ],

        // 分页
        currentPage: 1,
        total: 100,

        
      }
    },

    computed: {
       
    },
  
    methods:{
      


      // 控制弹框body内容高度，超过显示滚动条
      clientHeight() {        
          return this.clientHei - 265 + 'px'
      },

      // 得到部门门店和经纪人信息
      getData() {
        // this.$ajax.get("/api/access/deps")
        // .then(res => {
        //   console.log(res.data.data);
        //   let data = res.data;
        //   if (res.status === 200) {
        //     this.option1 = data.data
        //     // console.log(this.option1)
        //   }
        // });
        // this.$ajax.get("/api/organize/employee/agent")
        // .then(res => {
        //   console.log(res.data.data);
        //   let data = res.data;
        //   if (res.status === 200) {
        //     this.option2 = data.data
        //     // console.log(this.option1)
        //   }
        // });

      },

      // 重置
      resetFormFn() {
          this.$refs.adjustCheckForm.resetFields()
      },

      // 查询
      queryFn() {
          let param = {
            "pageNum": 1,                 
            "pageSize": 50,          
            "deptId": 273,              
            "empId": 441,               
            "startTime": "2018-11-07",    
            "endTime": "2018-11-10",      
            "contractType": this.adjustForm.tradeType,           
            "checkState": 2 ,                              
            "keyword": ''             
          }
          //调整佣金审核列表
          this.$ajax         
          .get("/api/commission/updateList", param)
          .then(res => {
            console.log(res);
            let data = res.data;
            if (res.status === 200) {
              this.tableData = data.data.list
            }
            

          }).catch(error => {
            console.log(error)
          })
      },

      // 点击审核事件
      auditApply(e) {
        this.dialogVisible = true
        let param = {
          checkId: e.checkId,
          contractCode: e.contractCode
        }
        this.$ajax.get("/api/commission/toCheck", param)
        .then(res => {
          console.log(e);
          let data = res.data;
          if (res.status === 200) {
            console.log(data.data)
            this.layerAudit = data.data;
          }
        }).catch(error => {
          console.log(error)
        });
      },

      // 驳回操作
      refuseFn() {
        let param = {
          checkId: 5,
          remark: this.auditForm.textarea
        }
        this.$ajax.get("/api/commission/updateReject", param)
        .then(res => {
          let tips = res.data.message;
          if (res.status === 200) {
            this.$message(tips);
            // let _this = this
            // setTimeout(() => {
            //   _this.dialogVisible = false
            // }, 2000);
          }
        }).catch(error => {
          console.log(error)
        });
      },

      // 通过操作
      receptFn() {
        let param = {
          checkId: 5,
          remark: this.auditForm.textarea
        }
        this.$ajax.get("/api/commission/update", param)
        .then(res => {
          let tips = res.data.message;
          if (res.status === 200) {
            this.$message(tips);
            // let _this = this
            // setTimeout(() => {
            //   _this.dialogVisible = false
            // }, 2000);
          }
        }).catch(error => {
          console.log(error)
        });
      },

      //跳转合同详情页
      goContractDetail(value){
        console.log(value)
        this.$router.push({
          path:'/contractDetails',
          query:{
            id: value.contractCode
          }
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },

      
      
    },

    created() {
      this.getData();
    },

    mounted() {
      var _this = this;
       window.onresize = function(){
         _this.clientHei = document.documentElement.clientHeight;
       }
    },

    components: {
          ScreeningTop,
          Message
      }
  };
</script>
<style lang="less">
@import "~@/assets/common.less";

#adjustcheck{
  .el-form-item--mini .el-form-item__content, .el-form-item--mini .el-form-item__label{
    line-height: 32px;
  }
  .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
    width: 330px;
    line-height: 32px;
    height: 32px;
  }
  .el-range-editor--mini.el-input__inner{
    height: 32px;
    font-size: 14px;
  }
  .el-range-editor--mini .el-range-input{
    font-size: 14px;
  }
  .el-input--mini .el-input__inner{
    height: 32px;
    line-height: 32px;
    font-size: 14px;
  }
  .el-pagination{
      text-align: center;
      padding: 30px 0 20px;
  }

  .adjustbox{
    box-shadow:0px 1px 6px 0px rgba(7,47,116,0.1);
  }

  .adjust-form {
    padding: 12px 0px 0px 0px;
    margin-bottom: 10px;
    background-color: #fff;
    border-radius:2px;
    box-sizing: border-box;
  }

  .contract-list {
    background-color: #fff;
    padding: 10px 12px;
    margin-top: 20px;
    .form-title-fl{
      font-size: 18px;
      color: #233241;
      margin: 10px 0 20px 10px;
      .mr8{
        margin-right: 8px;
      }
    }
    .el-table{
      th{
        background-color: #EEF2FB;
        &:first-child{
          padding-left: 20px;
        }
      }
      tr{
        td{
          &:first-child{
            padding-left: 20px;
          }
        }
      }
      
    }
  }

  .blue{
    color: @color-blue;
  }
  .yellow{
    color: @color-yellow;
  }
  .green{
    color: @color-green;
  }
  .red{
    color: @color-warning;
  }
  .btn{
    color: @color-blue;
    cursor: pointer;
  }

  .width250{
    width: 250px;
  }
  .width200{
    width: 200px;
  }
  .width150{
    width: 150px;
  }
  .width100{
    width: 100px;
  }
  .mr100{
    margin-right: 100px;
  }
  .curPointer{
    cursor: pointer;
    &:hover{
      text-decoration: underline;
    }
  }
  // 调佣审核弹层样式
  .layer-audit{
    .el-dialog{
      margin: 80px auto 60px !important;
      margin-top: 0vh;
    }
    .el-dialog__header{
      border-bottom: 1px solid #EDECF0;
      padding: 16px 20px 15px;
      span{
          color: #233241;
          font-size: 20px;
          
          
      }
      .el-dialog__headerbtn{
          top: 16px;
          .el-dialog__close{
              font-size: 24px;
              color: #32485F;
          }
      } 
    }
    .el-dialog__body{
          padding: 0;
      }
  }
  .audit-box{
    padding: 0 20px 0px 20px;
    overflow-y: auto;
    .audit-col{
      padding: 30px 0;
      border-bottom: 1px solid #EDECF0;
      .col-li{
        overflow: hidden;
        clear: left;
        margin-bottom: 18px;
        p{
          float: left;
          &:first-child{
            width: 250px;
            color: #6C7986;
            span{
              color: #233241;
              &.blue{
                color: #478DE3;
              }
            }
          }
        }
      }
      .textareabox{
        display: flex;
        align-items: flex-start;
        span{
          width: 76px;
        }
      }
      .table{
        width: 100%;
        border-collapse:collapse;
        border-spacing:1;
        border-top: 1px solid #E8EAF6;
        border-left: 1px solid #E8EAF6;
        text-align: center;
        .el-input__inner{
          height: 28px;
          line-height: 28px;
          padding: 0;
          text-align: center;
        }
        .el-input__icon{
          line-height: 28px;
        }
        .el-input__suffix{
          right: 0px;
        }
        tr th{
          background-color:#F2F3F8;
          border-right: 1px solid #E8EAF6;
          border-bottom: 1px solid #E8EAF6;
          line-height: 40px;
          height: 40px;
        }
        tr td{
          overflow: hidden;
          padding: 14px 10px;
          border-right: 1px solid #E8EAF6;
          border-bottom: 1px solid #E8EAF6;
          &.flex{
            display: flex;
            align-items: center;
            justify-content: center;
  
          }
          .width70{
            width: 72px;
            height: 28px;
            line-height: 28px;
            margin-right: 3px;
           
          }
          .mr10{
            margin-right: 10px;
            .el-input__inner{
              text-align: left;
              padding-left: 10px;
            }
          }
          .fl{
            float: left;
          }
        }
      }
      .uploadfile{
        margin: 40px 0 30px;
        .uploadtitle{
          color: #6C7986;
          span{
            margin-left: 16px;
            color: #8E8E8E;
            b{
              color: #6C7986;
            }
          }
        }       
        .uploadbtn{
          margin: 0 0 0 15px;
          .el-upload--picture-card{
            background-color: #fff;
            border: 2px dashed #DEDDE2;
            border-radius: 6px;
            width: 130px;
            height: 130px;
            line-height: 130px;
            margin-top: 20px;
            i{
                color: #EEF2FB;
                font-size: 56px;
            }
          }
          .el-upload-list--picture-card .el-upload-list__item{
            margin: 20px 20px 0 0;
            width: 130px;
            height: 130px;
            &:nth-child(5n){
              margin-right: 0;
            }
          }
        }
      }
      
    }   
    .bordernone{
      border-bottom: none;
    }
  }
  .textareabox2{
    display: flex;
    align-items: flex-start;
    margin-bottom: 30px;
    span{
      width: 76px;
    }
  }
  .btnbox{
    display: flex;
    justify-content: flex-end;
    padding: 15px 20px 15px 0;
    border-top: 1px solid #EDECF0;
    .el-button{
      width: 100px;
      height: 38px;
      border-radius: 18px;
      padding: 0;
      &.refuse{
        background-color: #EAEFF5;
      }
      &.recept{
        background-color: #54D384;
        border-color: #54D384;
      }
      
    }
  }

}






</style>