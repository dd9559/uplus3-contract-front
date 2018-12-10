<!-- 结算审核 -->
<template>
  <div class="view-container" id="settlecheck">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn" class="adjustbox">
      <el-form :inline="true" :model="adjustForm" class="adjust-form" size="mini">
        <el-form-item label="发起日期">
          <el-date-picker v-model="adjustForm.signDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="合同类型">
          <el-select v-model="adjustForm.contType" placeholder="全部" class="width150" clearable>
            <el-option v-for="item in dictionary['10']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>  

        <el-form-item label="部门">
          <el-select v-model="Form.getDepName" clearable filterable remote placeholder="请选择门店" :remote-method="getDepNameFn" @change="changeDepNameFn" @clear="clearDepNameFn" :loading="loading" class="width200">
              <el-option v-for="item in adjustForm.getDepName" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select v-model="Form.getAgentName" clearable filterable placeholder="经纪人" :loading="loading2" class="width100">
              <el-option v-for="item in adjustForm.getAgentName" :key="item.empId" :label="item.name" :value="item.empId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="审核状态">
          <el-select v-model="adjustForm.examineState" placeholder="全部" class="width150">
            <!-- <el-option
              v-for="item in toExamineState"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option> -->
            <el-option label="审核中" value="0"></el-option>
            <el-option label="通过" value="1"></el-option>
            <el-option label="驳回" value="2"></el-option>
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
      <el-table :data="tableData.list" style="width: 100%" v-loading="loadingTable">
        <el-table-column label="合同编号" width="150" fixed>
          <template slot-scope="scope">
            <div class="blue curPointer" @click="goContractDetail(scope.row)">{{scope.row.code}}</div>
          </template>
        </el-table-column>
        <el-table-column label="合同类型" prop="contType" :formatter="nullFormatter">
          
        </el-table-column>

        <el-table-column label="成交总价" :formatter="nullFormatter">
          <template slot-scope="scope">
            <p v-if="scope.row.contType.label !== '租赁'">{{scope.row.dealPrice}}元</p>
            <p v-if="scope.row.contType.label === '租赁'">{{scope.row.dealPrice}}元/季度</p>
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
            <p>{{scope.row.sponsorDate | getDate}}</p>
          </template>
        </el-table-column>

        <el-table-column label="发起人" :formatter="nullFormatter">
          <template slot-scope="scope">
            <p>{{scope.row.sponsorStoreName}}</p>
            <p>{{scope.row.sponsorName}}</p>
          </template>
        </el-table-column>

        <el-table-column label="实际结算" :formatter="nullFormatter">
          <template slot-scope="scope">
            <p>{{scope.row.amount}}</p>
          </template>
        </el-table-column>

        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <span class="blue" v-if="scope.row.examineState.value===0">审核中</span>
            <span class="green" v-if="scope.row.examineState.value===1">通过</span>
            <span class="red" v-if="scope.row.examineState.value===2">驳回</span>
          </template>
        </el-table-column>

        <el-table-column label="审核日期" prop="examineDate" :formatter="nullFormatter">
          <template slot-scope="scope">
            <p>{{scope.row.examineDate | getDate}}</p>
          </template>
        </el-table-column>
        
        <el-table-column label="审核人" :formatter="nullFormatter"  width="180">
          <template slot-scope="scope">
            <p>{{scope.row.examineStoreName}}</p>
            <p>{{scope.row.examineName}}</p>
          </template>
        </el-table-column>

        <el-table-column label="审核备注" width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.remarks">
              <el-popover trigger="hover" placement="top">
                <div style="width:160px">
                  {{scope.row.remarks}}
                </div>
                <div slot="reference" class="name-wrapper" :class="{'isFlex':scope.row.remarks.length<16}">
                  {{scope.row.remarks}}
                </div>
              </el-popover>
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
              
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope" v-if="scope.row.examineState.value=== 0">
            <el-button type="text" class="curPointer" @click="auditApply(scope.row)">审核</el-button>
          </template>
        </el-table-column>
        
      </el-table>
      <el-pagination
      @current-change="handleCurrentChange"
      :page-size="tableData.pageSize"
      :current-page="tableData.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="tableData.count"
      v-if="tableData.count > 0">
     </el-pagination>
    </div>

    <!-- 结算审核弹框 -->
    <el-dialog title="结算审核" :visible.sync="dialogVisible" width="820px" class="layer-audit" :closeOnClickModal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal">
      <div class="audit-box"  :style="{ height: clientHeight() }">
        <div class="audit-col">
          <div class="col-li col-li2">
            <p>合同编号：<span class="blue">{{layerAudit.contractCode}}</span></p>
            <p>发起日期：<span>{{layerAudit.createTime | getDate}}</span></p>
            <p>发起人：<span>{{layerAudit.sponsorStoreName + '-' + layerAudit.sponsorName}}</span></p>
            
          </div>
          <div class="col-li">
            <p>物业地址：<span>{{layerAudit.propertyAddr}}</span></p>
           
          </div>
          <div class="col-li col-li2">
            <p>合同类型：<span>{{layerAudit.contractType.label}}</span></p>
            <p>后期状态：<span>{{layerAudit.statusLaterStage.label}}</span></p>
            <p>合同总实收：<span>{{layerAudit.receivablesSum}}元</span></p>
            
            
          </div>
          <div class="col-li col-li2">
            <p>已结算：<span>{{layerAudit.alreadysettlement}}元</span></p>
            <p>当期实收：<span>{{layerAudit.thissettlement}}元</span></p>
            <p>当期实际结算：<span>{{layerAudit.actualsettlement}}元</span></p>
          </div>
          <!-- <div class="textareabox">
            <span class="tit">金融服务费：</span>
            <el-input maxlength="9" :disabled="true"><i slot="suffix" class="i-slot">元（成本）</i></el-input>
          </div> -->
        </div>

        <!-- 表格 -->
        <div class="audit-col">
          <el-table :data="layerAudit.settlementFroms" border style="width: 100%" class="table">
            <el-table-column prop="level4" label="合作门店"></el-table-column>
            <el-table-column prop="ratio" label="业绩分成比例"></el-table-column>
            <el-table-column prop="serviceFee" label="当期刷卡手续费（元）"></el-table-column>
            <el-table-column prop="storefrontReceipts" label="当期实收分成（元）"></el-table-column>
          </el-table> 
          <div class="zhushi">注：结算中的当期实收分成金额包含扣除的特许服务费，具体请结算通过后在分账记录列表中查看</div>           
        </div>

        <!-- 上传附件 -->
        <div class="audit-col">
          <div class="uploadfile">
              <div class="uploadtitle">结算凭证</div>
              <ul class="ulData">
                <li v-for="(item,index) in uploadList" :key="item.index" @mouseover="moveIn(item.index+item.path)" @mouseout="moveOut(item.index+item.path)" @click="previewPhoto(uploadList,index)">
                  <el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
                    <div class="namePath">
                        <upload-cell :type="item.fileType"></upload-cell>
                        <p>{{item.name}}</p>
                    </div>
                  </el-tooltip>
                  <i class="iconfont icon-tubiao-6" @click="ZTdelectData(index)" v-if="isDelete===item.index+item.path"></i>
                </li>
            </ul>
          </div>     
        </div>

        <!-- 结算备注 -->
        <div class="audit-col">
          <div class="textareabox2 mt0">
            <span><em>*</em>结算备注</span>
            <el-input type="textarea" :rows="6" class="textarea" maxlength=200 v-model="layerAudit.settlementRemarks" :disabled="true"></el-input>
          </div>
        </div>

        <!-- 审核备注 -->
        <div class="audit-col bordernone">
          <div class="textareabox2">
            <span><em>*</em>审核备注</span>
            <el-input type="textarea" :rows="6" class="textarea" maxlength=200 placeholder="请填写备注审核" v-model="auditForm.textarea"></el-input>
          </div>
        </div>

      </div>
      <div class="btnbox">
        <el-button class="refuse" @click="refuseFn()">驳 回</el-button>
        <el-button type="primary" class="recept"  @click="receptFn()">通 过</el-button>  
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
        loading:false,
        loading2:false,
        loadingTable:false,
         adjustForm:{
          signDate: '', //发起日期
          contType: '', //合同类型
          examineState:'',
          getDepName: [{
            name: "全部",
            id: ""
          }],    //选择门店
          getAgentName: [{
            name: "全部",
            empId: ""
          }], 
                     //审核状态
          keyWord: ''   //关键字

        },
       

        // toExamineState: [{
        //   label: '审核中',
        //   value: 0
        // },
        // {
        //   label: '通过',
        //   value: 1
        // },
        // {
        //   label: '驳回',
        //   value: 2
        // }],
        Form :{
          getDepName: '',
          getAgentName: ''
        },
        dictionary: {
          //数据字典
          "10": "", //合同类型
          "17": "", //审核状态
        },
        layerAudit:{
          contractType:{
            label: ""
          },
          statusLaterStage: {
            label:""
          }

        },
        isDelete:'',
        //上传的协议
        uploadList: [],
        myCheckId: '',
        
        auditForm: {
          textarea: '', //备注
        },

        // 弹框里用到的
        dialogImageUrl: '',
        dialogVisible: false,
      
        
       
        
        tableData:[],

        // 分页
        pageNum: 1,
        pageSize: 50,
        count: 0,

        
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
      //合同主体的删除
      ZTdelectData(index){
          this.uploadList.splice(index,1)
      },

      //显示删除按钮
      moveIn(value){
          this.isDelete=value
      },
      moveOut(value){
          if(this.isDelete===value){
              this.isDelete=''
          }
      },


      // 控制弹框body内容高度，超过显示滚动条
      clientHeight() {        
          return this.clientHei - 265 + 'px'
      },

      // 得到部门门店和经纪人信息
      getDepNameFn(e) {
        this.loading = true;
        this.$ajax.get("/api/access/deps", {keyword: e})
        .then(res => {       
          let data = res.data;         
          if (res.data.status === 200) { 
            this.loading = false; 
            if(e === '' || !e){
              this.adjustForm.getDepName = [{
                name: "全部",
                id: ""
              },...data.data]
            }else{
              this.adjustForm.getDepName = data.data
            } 
             
          }
        }).catch(error => {
            this.$message({
              message: error
            })
        })
      },


      changeDepNameFn(e) {
        if(e !== "" || !!e){
          this.loading2 = true;
          this.$ajax.get("/api/organize/employees",{
            cityId:this.userMsg.cityId,
            depId: e
          })
          .then(res => {       
                    
            if (res.data.status === 200) {  
              this.loading2 = false;
              this.Form.getAgentName = ''; 
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

          }).catch(error => {
              this.$message({
                message: error
              })
          })  
        }else{    
            this.Form.getAgentName = '';       
            this.adjustForm.getAgentName = [{
                name: "全部",
                empId: ""
            }]
            this.Form.getDepName = '全部'; 
            this.getDepNameFn('');
        }
      },

      // 清除部门搜索
      clearDepNameFn(){
          this.getDepNameFn('');
      }, 
      


      // 重置
      resetFormFn() {
          TOOL.clearForm(this.adjustForm);
          this.changeDepNameFn('');
          // this.pageNum=1;
          // this.queryFn();
      },
      
      // 查询
      queryFn() {
        this.loadingTable = true;
        let beginDate;
        let endDate;
        
        if(this.adjustForm.signDate.length === 2){
            beginDate = TOOL.dateFormat(this.adjustForm.signDate[0]);
            endDate = TOOL.dateFormat(this.adjustForm.signDate[1]);
        }else if(this.adjustForm.signDate.length === 0){
            beginDate = null
            endDate = null
        }
        let param = {
          contResultVo: {
            beginDate,
            endDate,
            examineState: this.adjustForm.examineState,    //this.examineState
            contractType: this.adjustForm.contType,    //this.adjustForm.contType.key,
            dealAgentStoreId:this.Form.getDepName,    //this.Form.getDepName.id,
            dealAgentId: this.Form.getAgentName,    //this.Form.getAgentName.empId,
            keyword: this.adjustForm.keyWord
            
          },
          pageNum: this.pageNum,
          pageSize: this.pageSize
          
        }
          // 结算审核列表
          this.$ajax         
          .postJSON("/api/contract/contResultList", param)
          .then(res => {
            let data = res.data;
            if (res.data.status === 200) {
              this.tableData = data.data              
            }
            this.loadingTable = false;
      
          }).catch(error => {
              this.$message({
                message: error
              })
          })
      },

      // 点击审核事件
      auditApply(e){
        this.dialogVisible = true
        let param = {
          id: e.id,
        }
        this.$ajax.get("/api/settlement/applyExamineById", param)
        .then(res => {
          let data = res.data;
          if (res.data.status === 200) {
            console.log(data.data)
            this.layerAudit = data.data;
            this.myCheckId = data.data.id; //结算id
            this.uploadList = data.data.vouchers;
          }
        }).catch(error => {
            this.$message({
             message: error
            })
        });
      },

      // 驳回操作
      refuseFn() {
        
        if(this.auditForm.textarea !== ""){
          let param = {
            id: 1,
            examine: 2, //驳回
            examineRemark: this.auditForm.textarea
          }
          this.$ajax.post("/api/settlement/examineSettlement", param)
          .then(res => {
           
            if (res.data.status === 200) {
              this.$message('已驳回');
              let _this = this
              setTimeout(() => {
                _this.dialogVisible = false
                // 数据刷新
                this.queryFn();

              }, 2000);
            }
          }).catch(error => {
              this.$message({
                message: error
              })
          });
        }else{
          this.$message('审核备注不能为空');
        }
        
      },

      // 通过操作
      receptFn() {
        let param = {
          id: 1,
          examine: 1, //通过
          examineRemark: this.auditForm.textarea
        }
        this.$ajax.post("/api/settlement/examineSettlement", param)
        .then(res => {

          if (res.data.status === 200) {
            console.log(res)
            this.$message('已通过');
            let _this = this
            setTimeout(() => {
              _this.dialogVisible = false
              // 数据刷新
              this.queryFn();
            }, 2000);
          }
        }).catch(error => {
            this.$message({
              message: error
            })
        });
      },


      //跳转合同详情页
      goContractDetail(e){
        console.log(e)
        this.$router.push({
          path:'/contractDetails',
          query: {
            id: e.contractId,
            code: e.code,
            contType: e.contType.value
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
      this.getAdmin();
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
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    margin-bottom: 10px;
  }
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
    margin-bottom: 10px;
    background-color: #fff;
    border-radius:2px;
    box-sizing: border-box;
  }

  .contract-list {
    background-color: #fff;
    padding: 0px 12px;
    .form-title-fl{
      font-size: 14px;
      color: #233241;
      padding: 6px 0;
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
    padding: 0 30px 0px 30px;
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
        &:last-child{
          margin-bottom: 0;
        }
       
      }
      .col-li2{
        p:nth-child(2n){
          width: 250px;
        }
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
        .ulData{
 
            width: 100%;
            overflow: hidden;
            li{
                margin-right: 20px;
                margin-bottom: 20px;
                position: relative;
                float: left;
                &:nth-child(5n){
                  margin-right: 0;
                }
                > i{
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    color: #F56C6C;
                    font-size: 20px;
                    cursor: pointer;
                }
            }
        }

        .namePath{
            display: inline-block;
            text-align: center;
            width: 120px;
            height: 120px;
            padding-top: 20px;
            box-sizing: border-box;
            border-radius:4px;
            background: #F2F3F8;
            > p{
              padding-top: 5px;
              display: inline-block;
              width: 100px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
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
    &.mt0{
      margin-bottom: 0;
    }
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
  .zhushi{
      margin-top: 20px;
      font-size: 12px;
      color: #6C7986;
  }
  .name-wrapper {
    min-width: 80px;
    height: 65px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow:ellipsis;
  }
  .isFlex{
    display: flex;
    align-items: center;
  }

}






</style>