<!-- 结算审核 -->
<template>
  <div class="view-container" id="settlecheck">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn" :min="63" class="adjustbox">
      <el-form :inline="true" :model="adjustForm" class="adjust-form" size="mini">
        <el-form-item label="发起日期">
          <el-date-picker v-model="adjustForm.signDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="合同类型">
          <el-select v-model="adjustForm.contType" placeholder="全部" class="width150">
            <el-option label="租赁" value="1"></el-option>
            <el-option label="买卖" value="2"></el-option>
            <el-option label="代办" value="3"></el-option>
            <el-option label="意向" value="4"></el-option>
          </el-select>  
        </el-form-item>  -->
        <el-form-item label="合同类型">
          <el-select v-model="adjustForm.tradeType" placeholder="全部" class="width150" clearable>
            <el-option v-for="item in dictionary['10']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>  

        <!-- <el-form-item label="部门">
          <el-select v-model="adjustForm.item1" clearable filterable placeholder="请选择门店" class="width200">
              <el-option v-for="item in option1" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select v-model="adjustForm.item2" clearable filterable placeholder="经纪人" class="width100">
              <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="部门">
          <el-select v-model="Form.getDepName" clearable filterable remote placeholder="请选择门店" :remote-method="getDepNameFn" @change="changeDepNameFn" @clear="clearDepNameFn" class="width200">
              <el-option v-for="item in adjustForm.getDepName" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select v-model="Form.getAgentName" clearable filterable placeholder="经纪人" class="width100">
              <el-option v-for="item in adjustForm.getAgentName" :key="item.empId" :label="item.name" :value="item.empId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="审核状态">
          <el-select v-model="adjustForm.toExamineState" placeholder="全部" class="width150">
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
      <el-table :data="tableData.list" style="width: 100%">
        <el-table-column label="合同编号" width="150" fixed>
          <template slot-scope="scope">
            <div class="blue curPointer" @click="goContractDetail(scope.row)">{{scope.row.code}}</div>
          </template>
        </el-table-column>
        <el-table-column label="合同类型" prop="contType" :formatter="nullFormatter">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.contType===1">租赁</span>
            <span v-if="scope.row.contType===2">买卖</span>
            <span v-if="scope.row.contType===3">代办</span>
            <span v-if="scope.row.contType===4">意向</span>
          </template> -->
        </el-table-column>

        <el-table-column label="成交总价" :formatter="nullFormatter">
          <template slot-scope="scope">
            <p v-if="scope.row.tradeType !== '租赁'">{{scope.row.dealPrice}}元</p>
            <p v-if="scope.row.tradeType === '租赁'">{{scope.row.dealPrice}}元/季度</p>
          </template>
        </el-table-column>
       
        <el-table-column label="成交经纪人" :formatter="nullFormatter">
          <template slot-scope="scope">
            <p>{{scope.row.dealAgentStoreName}}</p>
            <p>{{scope.row.dealAgentName}}</p>
          </template>
        </el-table-column>

        <el-table-column label="发起日期">
          <template slot-scope="scope">
            <p>{{scope.row.contResults.sponsorDate | getDate}}</p>
          </template>
        </el-table-column>

        <el-table-column label="发起人" :formatter="nullFormatter">
          <template slot-scope="scope">
            <p>{{scope.row.contResults.sponsorStoreName}}</p>
            <p>{{scope.row.contResults.sponsorName}}</p>
          </template>
        </el-table-column>

        <el-table-column label="实际结算" :formatter="nullFormatter">
          <template slot-scope="scope">
            <p>{{scope.row.contResults.amount}}</p>
          </template>
        </el-table-column>

        <el-table-column label="审核状态" prop="toExamineState">
          <template slot-scope="scope">
            <span class="blue" v-if="scope.row.toExamineState===1">未提审</span>
            <span class="green" v-if="scope.row.toExamineState===2">通过</span>
            <span class="red" v-if="scope.row.toExamineState===3">驳回</span>
          </template>
        </el-table-column>

        <el-table-column label="审核日期" prop="examineDate" :formatter="nullFormatter">
          <template slot-scope="scope">
            <p>{{scope.row.contResults.examineState | getDate}}</p>
          </template>
        </el-table-column>
        
        <el-table-column label="审核人" :formatter="nullFormatter"  width="180">
          <template slot-scope="scope">
            <p>{{scope.row.contResults.examineStoreName}}</p>
            <p>{{scope.row.contResults.examineName}}</p>
          </template>
        </el-table-column>

        <el-table-column label="审核备注" width="200">
          <template slot-scope="scope">
            {{scope.row.contResults.remarks?scope.row.contResults.remarks:'-'}}
          </template>
        </el-table-column>
              
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope" v-if="scope.row.toExamineState === 1">
            <el-button type="text" class="curPointer" @click="auditApply(scope.row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @current-change="handleCurrentChange"
      :page-size="tableData.pageSize"
      :current-page="tableData.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="tableData.total">
     </el-pagination>
    </div>

    <!-- 结算审核弹框 -->
    <el-dialog title="结算审核" :visible.sync="layer.show" width="820px" class="layer-audit">
      <div class="audit-box"  :style="{ height: clientHeight() }">
        <div class="audit-col">
          <div class="col-li">
            <p>合同编号：<span class="blue">YQYD001163</span></p>
            <p>物业地址：<span>当代国际花园当代国际花园当代国际花园当代国际花园当</span></p>
          </div>
          <div class="col-li col-li2">
            <p>申请日期：<span>2018/9/14</span></p>
            <p>发起人：<span>当代一店-夏雨天</span></p>
            <p>合同类型：<span>出租</span></p>
          </div>
          <div class="col-li col-li2">
            <p>成交总价：<span>3000元</span></p>
            <p>可分配业绩：<span>3000元</span></p>
            <p>已结算：<span>3000元</span></p>
          </div>
          <div class="col-li col-li2">
            <p>合同总实收：<span>3000元</span></p>
            <p>本次结算：<span>3000元</span></p>
            <p>实际结算：<span>3000元</span></p>
          </div>
          <div class="textareabox">
            <span class="tit">金融服务费：</span>
            <el-input maxlength="9" :disabled="true"><i slot="suffix" class="i-slot">元（成本）</i></el-input>
          </div>
        </div>

        <!-- 表格 -->
        <div class="audit-col">
          <el-table :data="tableData.list" border style="width: 100%" class="table">
          <el-table-column prop="a1" label="合作门店"></el-table-column>
          <el-table-column prop="a2" label="分成比例"></el-table-column>
          <el-table-column prop="a3" label="本次违约金"></el-table-column>
          <el-table-column prop="a4" label="本次特许服务费"></el-table-column>
          <el-table-column prop="a5" label="本次刷卡手续费"></el-table-column>
          <el-table-column prop="a6" label="本次实收分成"></el-table-column>
        </el-table>            
        </div>

        <!-- 上传附件 -->
        <div class="audit-col">
          <div class="uploadfile">
              <div class="uploadtitle"><em>*</em>结算凭证<span><b>注：</b>协议支持jpg、png、docx、以及pdf格式</span></div>
              <div class="uploadbtn">
              
              </div>
          </div>     
        </div>

        <!-- 结算备注 -->
        <div class="audit-col bordernone">
          <div class="textareabox2">
            <span><em>*</em>结算备注</span>
            <el-input type="textarea" :rows="6" class="textarea" maxlength=200 placeholder="请填写备注审核"></el-input>
          </div>
        </div>

      </div>
      <div class="btnbox">
        <el-button @click="dialogVisible = true" class="refuse">驳 回</el-button>
        <el-button type="primary" @click="dialogVisible = true" class="recept">通 过</el-button>  
      </div> 
    </el-dialog>

  </div>
</template>


      
<script>
  import ScreeningTop from '@/components/ScreeningTop';
  import {FILTER} from "@/assets/js/filter";
  import {TOOL} from "@/assets/js/common";
  import { MIXINS } from "@/assets/js/mixins";
  export default {
    name: "settle-check",
    mixins: [FILTER,MIXINS],
    data(){
      return{
        clientHei: document.documentElement.clientHeight, //窗体高度
         adjustForm:{
          signDate: '', //发起日期
          tradeType: '', //合同类型
          getDepName: [{
            name: "全部",
            id: ""
          }],    //选择门店
          getAgentName: [{
            name: "全部",
            empId: ""
          }], 
          checkState: '',  //审核状态
          keyWord: ''   //关键字

        },
        Form :{
          getDepName: '',
          getAgentName: ''
        },
        dictionary: {
          //数据字典
          "10": "", //合同类型
          "17": "", //审核状态
        },

       
        // 弹框里用到的
        dialogImageUrl: '',
        dialogVisible: false,
        layer: {
            show: false,
            
        },
        // checked: false, //是否有解除协议
        
       
        
        tableData:[{
          contResults: [
            {
            "sponsorDate": "",
            "sponsorStoreName": "",
            "sponsorName": "",
            "amount": 1,
            "examineState": "",
            "examineDate": "",
            "examineStoreName": "",
            "examineName": "",
            "remarks": ""
          }
          ]
        }],

        // 分页
        pageNum: 1,
        pageSize: 50,
        total: 0,

        
      }
    },

    computed: {
        
    },

    filters: {
       getDate(val) {
         return TOOL.dateFormat(val);
       }
    },
  
    methods:{
      


      // 控制弹框body内容高度，超过显示滚动条
      clientHeight() {        
          return this.clientHei - 265 + 'px'
      },

       // 得到部门门店和经纪人信息
      getDepNameFn(e) {
        this.$ajax.get("/api/access/deps", {keyword: e})
        .then(res => {       
          let data = res.data;         
          if (res.data.status === 200) {  
            if(e === '' || !e){
              this.adjustForm.getDepName = [{
                name: "全部",
                id: ""
              },...data.data]
            }else{
              this.adjustForm.getDepName = data.data
            }  
          }
        }).catch(err => {
          console.log(err)
        })
      },

      changeDepNameFn(e) {
        if(e !== "" || !!e)
        this.$ajax.get("/api/organize/employees",{
          cityId:this.cityId,
          depId: e
        })
        .then(res => {       
                  
          if (res.data.status === 200) {  

            if(res.data.data.length > 0){ 
              this.adjustForm.getAgentName = [{
                name: "全部",
                empId: ""
              },...res.data.data]
            }
            else{
              this.adjustForm.getAgentName = res.data.data
            }
          }

        }).catch(err => {
          console.log(err)
        })

      },

      // 清除部门搜索
      clearDepNameFn(){
          this.getDepNameFn('');
      }, 
      


      // 重置
      resetFormFn() {
          this.$refs.propForm.resetFields()
      },
      
      // 查询
      queryFn() {
        let beginDate = '';
        let endDate = '';
        if(this.adjustForm.signDate.length === 2){
            beginDate = TOOL.dateFormat(this.adjustForm.signDate[0]);
            endDate = TOOL.dateFormat(this.adjustForm.signDate[1]);
        }
        let param = {
          contResultVo: {
            contractId: 1,
            beginDate,
            endDate,
            examineState: this.adjustForm.checkState,
            contractType: this.adjustForm.tradeType,
            dealAgentStoreId: this.Form.getDepName,
            dealAgentId: this.Form.getAgentName,
            keyword: this.adjustForm.keyWord
          },
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
          //结算审核列表
          // this.$ajax         
          // .postJSON("/api/contract/contResultList", param)
          // .then(res => {
          //   let data = res.data;
          //   if (res.data.status === 200) {
          //     this.tableData = data.data
              
          //   }
      
          // }).catch(error => {
          //   console.log(error)
          // })
      },

      // 点击审核事件
      auditApply(e){
        this.layer = {
            show: true,
        }
      },

      //跳转合同详情页
      goContractDetail(value){
        console.log(value)
        this.$router.push({
          path:'/contractDetails',
          query:{
            id: value.contractNo
          }
        })
      },

      handleCurrentChange(e) {
        this.pageNum = e;
        this.queryFn();
      },
      

      // 弹层里上传附件
      // handleRemove(file, fileList) {
      //   console.log(file, fileList);
      // },
      // handlePictureCardPreview(file) {
      //   this.dialogImageUrl = file.url;
      //   this.dialogVisible = true;
      // }
      
    },

    created() {
      this.queryFn();
      this.getDepNameFn();
      this.getDictionary();
    },

    mounted() {
      var _this = this;
       window.onresize = function(){
         _this.clientHei = document.documentElement.clientHeight;
       }
    },


    components: {
          ScreeningTop
      }
  };
</script>
<style lang="less">
@import "~@/assets/common.less";

#settlecheck{
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
      .el-table th{
        background-color: #F2F3F8 !important;
      }
      
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
      .col-li2{
        p:nth-child(2n){
          width: 270px;
        }
      }
      .textareabox{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        span.tit{
          width: 95px;
          line-height: 36px;
          color: #6C7986;
        }
        i.i-slot{
          width: 70px;
          color:#999;
          line-height: 36px;

        }
        .el-input{
          width: 160px;
        }
        .el-input__inner{
          width: 160px;
          height: 36px;
          padding: 0 15px 0 10px;
        }
      }
      
      .uploadfile{
        margin: 20px 0 30px;
        .uploadtitle{
          color: #6C7986;
          em{
            color: #FF3E3E;
            margin-right: 4px;
          }
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
      width: 84px;
      em{
        color: #FF3E3E;
        margin-right: 4px;
      }
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