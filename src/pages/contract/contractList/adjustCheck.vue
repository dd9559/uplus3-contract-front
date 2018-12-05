<!-- 调佣审核 -->
<template>
  <div class="view-container" id="adjustcheck">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn" :min="63"  class="adjustbox">
      <el-form :inline="true" :model="adjustForm" class="adjust-form" size="mini" ref="adjustCheckForm">

        <el-form-item label="发起日期">
          <el-date-picker v-model="adjustForm.signDate" type="daterange" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
          </el-date-picker>

        </el-form-item>
        <el-form-item label="合同类型">
          <el-select v-model="adjustForm.tradeType" placeholder="全部" class="width150" clearable>
            <el-option v-for="item in dictionary['10']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>         
        <el-form-item label="部门"> 
          <el-select v-model="Form.getDepName" clearable filterable remote placeholder="请选择门店" :remote-method="getDepNameFn" @change="changeDepNameFn" :loading="loading" @clear="clearDepNameFn" class="width200">
              <el-option v-for="item in adjustForm.getDepName" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select v-model="Form.getAgentName" clearable filterable placeholder="经纪人" :loading="loading2" class="width100">
              <el-option v-for="item in adjustForm.getAgentName" :key="item.empId" :label="item.name" :value="item.empId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="审核状态">
          <el-select v-model="adjustForm.checkState" placeholder="全部" class="width150" clearable>
            <el-option label="未审核" value="6"></el-option>
            <el-option label="通过" value="7"></el-option>
            <el-option label="驳回" value="8"></el-option>
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
        <el-table-column label="合同编号" width="150" fixed :formatter="nullFormatter">
          <template slot-scope="scope">
            <div class="blue curPointer" @click="goContractDetail(scope.row)">{{scope.row.contractCode}}</div>
          </template>
        </el-table-column>
        <el-table-column label="合同类型" prop="tradeType" :formatter="nullFormatter"></el-table-column>
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
        <el-table-column label="签约日期">
          <template slot-scope="scope">
            <p>{{scope.row.signDate | getDate}}</p>
          </template>
        </el-table-column>
        <el-table-column label="发起日期">
          <template slot-scope="scope">
            <p>{{scope.row.createTime | getDate}}</p>
          </template>
        </el-table-column>
        <el-table-column label="发起人" :formatter="nullFormatter">
          <template slot-scope="scope">
            <p>{{scope.row.createByDepName}}</p>
            <p>{{scope.row.createByName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" :formatter="nullFormatter" align="center">
          <template slot-scope="scope">
            <span class="blue" v-if="scope.row.checkState === 6">未审核</span>
            <span class="green" v-if="scope.row.checkState === 7">通过</span>
            <span class="red" v-if="scope.row.checkState === 8">驳回</span>
          </template>
        </el-table-column>
        <el-table-column label="审核日期">
          <template slot-scope="scope">
            <p>{{scope.row.checkTime | getDate}}</p>
          </template>
        </el-table-column>   
        <el-table-column label="当前审核人" :formatter="nullFormatter">
          <template slot-scope="scope">
            <p>{{scope.row.checkByDepName}}</p>
            <p>{{scope.row.checkByName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="审核备注" width="200" prop="checkRemark" :formatter="nullFormatter"></el-table-column>             
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope" v-if="scope.row.checkState === 6">
            <el-button type="text" class="curPointer" @click="auditApply(scope.row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @current-change="handleCurrentChange"
      :page-size="tableData.pageSize"
      :current-page="tableData.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="tableData.total"
      v-if="tableData.total > 0"
      >
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
            <p>申请日期：<span>{{layerAudit.createTime | getDate}}</span></p>
            <p>申请人：<span>{{layerAudit.createByDepName + '-' + layerAudit.createByName}}</span></p>
          </div>
          <div class="col-li">
            <p>合同类型：<span>{{layerAudit.tradeType}}</span></p>
            <p class="mr100">成交总价：<span>{{layerAudit.dealPrice}}</span></p>
            <p>可分配业绩：<span>{{layerAudit.money}}</span></p>
          </div>
          <div class="col-li">
            <p>调整类型：<span>佣金调整</span></p>
            <p><el-checkbox v-model="relieveFn" :disabled="true">有解除协议</el-checkbox></p>
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
                      <el-select v-model="auditForm.getDepName" class="width70 mr10" :disabled="true">
                        <el-option label="另外出" value="另外出"></el-option>
                        <el-option label="佣金扣" value="佣金扣"></el-option>
                        <el-option label="无" value="无"></el-option>
                      </el-select>
                    </div>
                    <div>
                      <el-select v-model="auditForm.getAgentName" class="width70 mr10" :disabled="true">
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
            <ul class="ulData">

                <li v-for="(item,index) in uploadList" :key="item.index" @mouseover="moveIn(item.index+item.path)" @mouseout="moveOut(item.index+item.path)" @click="previewPhoto(uploadList,index)">
                    <div class="namePath">
                        <upload-cell :type="item.fileType"></upload-cell>
                        <p>{{item.name}}</p>
                    </div>
                    <i class="iconfont icon-tubiao-6" @click="ZTdelectData(index)" v-if="isDelete===item.index+item.path"></i>
                </li>
            </ul>
          </div>                  
        </div>
        <!-- 审核备注 -->
        <div class="textareabox2">
          <span>审核备注</span>
          <el-input type="textarea" :rows="6"  v-model="auditForm.textarea" class="textarea" maxlength=200 ></el-input>
        </div>  
      </div>
      <div class="btnbox">
        <el-button class="refuse" @click="refuseFn()">驳 回</el-button>
        <el-button type="primary"  @click="receptFn()" class="recept">通 过</el-button>  
      </div> 
      <!-- 图片放大 -->
    <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
    </el-dialog>

  </div>
</template>


      
<script>
  import ScreeningTop from '@/components/ScreeningTop';
  import { Message } from 'element-ui';

  import {FILTER} from "@/assets/js/filter";
  import {TOOL} from "@/assets/js/common";
  import { MIXINS } from "@/assets/js/mixins";
  
  export default {
    name: "adjust-check",
    // mixins: [FILTER],
    mixins: [FILTER,MIXINS],
    data(){
      return{   
        clientHei: document.documentElement.clientHeight, //窗体高度
        loading:false,
        loading2:false,
        loadingTable:false,

        // 分页
        pageNum: 1,
        pageSize: 50,
        total: 0,
        Form :{
          getDepName: '',
          getAgentName: ''
        },
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
        dictionary: {
          //数据字典
          "10": "", //合同类型
          "17": "", //审核状态
        },
      
        layerAudit:{

        },

        isDelete:'',
        
        myCheckId: '',
        //上传的协议
        uploadList: [],

        auditForm: {
          textarea: '', //备注
        },
        // 弹框里用到的
        dialogImageUrl: '',
        dialogVisible: false,
        // checked: false, //是否有解除协议
       
        tableData:[],

        

        
      }
    },

    computed: {
      relieveFn() {
        if(this.layerAudit.relieve === 1){
          return true
        }else if(this.layerAudit.relieve === 0){
          return false
        }
      }

    
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
            message:`${error.title}${error.msg}`
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
              message:`${error.title}${error.msg}`
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
        let startTime = '';
        let endTime = '';
        
        if(this.adjustForm.signDate.length === 2){
            startTime = TOOL.dateFormat(this.adjustForm.signDate[0]);
            endTime = TOOL.dateFormat(this.adjustForm.signDate[1]);
        }
          let param = {
            pageNum: this.pageNum,                 
            pageSize: this.pageSize,          
            deptId: this.Form.getDepName,              
            empId: this.Form.getAgentName,               
            startTime,    
            endTime,      
            contractType: this.adjustForm.tradeType,           
            checkState: this.adjustForm.checkState,                              
            keyword: this.adjustForm.keyWord             
          }
          //调整佣金审核列表
          this.$ajax         
          .get("/api/commission/updateList", param)
          .then(res => {
            let data = res.data;
            if (res.data.status === 200) {
              this.tableData = data.data            
            }
            this.loadingTable = false;
      
          }).catch(error => {
            this.$message({
              message:`${error.title}${error.msg}`
            })
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
          if (res.data.status === 200) {
            console.log(data.data)
            this.layerAudit = data.data;
            this.myCheckId = data.data.checkId;
            this.uploadList = data.data.voucher;
          }
        }).catch(error => {
            this.$message({
              message:`${error.title}${error.msg}`
            })
        });
      },

      // 驳回操作
      refuseFn() {
        let param = {
          checkId: this.myCheckId,
          remark: this.auditForm.textarea
        }
        if(this.auditForm.textarea !== ""){
          this.$ajax.get("/api/commission/updateReject", param)
          .then(res => {

            if (res.data.status === 200) {
              this.$message('已驳回');
              let _this = this
              setTimeout(() => {
                _this.dialogVisible = false
              }, 2000);
            }
          }).catch(error => {
              this.$message({
                message:`${error.title}${error.msg}`
              })
          });
        }else{
          this.$message('调整原因不能为空');
        }
        
      },

      // 通过操作
      receptFn() {
        let param = {
          checkId: this.myCheckId,
          remark: this.auditForm.textarea
        }
        this.$ajax.get("/api/commission/update", param)
        .then(res => {

          if (res.data.status === 200) {
            console.log(res)
            this.$message('已通过');
            let _this = this
            setTimeout(() => {
              _this.dialogVisible = false
            }, 2000);
          }
        }).catch(error => {
            this.$message({
              message:`${error.title}${error.msg}`
            })
        });
      },

      //跳转合同详情页
      goContractDetail(value){
        console.log(value)
        this.$router.push({
          path:'/contractDetails',
          query:{
            id: value.contId,
            code: value.contractCode,
            contType: value.tradeType
          }
        })
      },
      
      handleCurrentChange(e) {
        this.pageNum = e;
        this.queryFn();
      },

    
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
          width: 80px;
          em{
            color:#FF3E3E;
            margin-right: 3px;
          }
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
        display: flex;
        .uploadtitle{
          color: #6C7986;
          width: 78px;
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