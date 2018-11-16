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
        <el-form-item label="合同类型">
          <el-select v-model="adjustForm.contType" placeholder="全部" class="width150">
            <el-option label="租赁" value="1"></el-option>
            <el-option label="买卖" value="2"></el-option>
            <el-option label="代办" value="3"></el-option>
            <el-option label="意向" value="4"></el-option>
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
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="合同编号" width="150" fixed>
          <template slot-scope="scope">
            <div class="blue curPointer" @click="goContractDetail(scope.row)">{{scope.row.contractNo}}</div>
          </template>
        </el-table-column>
        <el-table-column label="合同类型">
          <template slot-scope="scope">
            <span v-if="scope.row.contType===1">租赁</span>
            <span v-if="scope.row.contType===2">买卖</span>
            <span v-if="scope.row.contType===3">代办</span>
            <span v-if="scope.row.contType===4">意向</span>
          </template>
        </el-table-column>

        <el-table-column label="成交总价" prop="dealPrice">
        </el-table-column>
       
        <el-table-column label="成交经纪人" prop="dealPerson" width="180">
        </el-table-column>

        <el-table-column label="发起日期" prop="sponsorDate">
        </el-table-column>

        <el-table-column label="发起人" prop="sponsorPerson" width="180">
        </el-table-column>

        <el-table-column label="实际结算" prop="realSettle">
        </el-table-column>

        <el-table-column label="审核状态" prop="toExamineState">
          <template slot-scope="scope">
            <span class="blue" v-if="scope.row.toExamineState===1">未提审</span>
            <span class="green" v-if="scope.row.toExamineState===2">通过</span>
            <span class="red" v-if="scope.row.toExamineState===3">驳回</span>
          </template>
        </el-table-column>

        <el-table-column label="审核日期" prop="examineDate">
        </el-table-column>
        
        <el-table-column label="审核人" prop="examinePerson" width="180">
        </el-table-column>

        <el-table-column label="审核备注" width="200">
          <template slot-scope="scope">
            {{scope.row.remarks?scope.row.remarks:'-'}}
          </template>
        </el-table-column>
              
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
          <el-table :data="jiesuanData" border style="width: 100%" class="table">
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
  export default {
    data(){
      return{
        clientHei: document.documentElement.clientHeight, //窗体高度
        adjustForm:{
          signDate: '', //发起日期
          contType: '', //合同类型
          item1: '',    //选择门店
          item2: '',  //选择成交人
          toExamineState: '',  //审核状态
          keyWord: ''   //关键字

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
        layer: {
            show: false,
            
        },
        checked: false, //是否有解除协议
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
        jiesuanData:[{
            a1: '当代一店',
            a2: '20%',
            a3: '金额*分成比例',
            a4: '',
            a5: '',
            a6: '',

        },
        {
            a1: '当代二店',
            a2: '20%',
            a3: '金额*分成比例',
            a4: '400',
            a5: '300',
            a6: '1200',

        }],
        
        tableData:[{
          contractNo:'YQYD110063', //合同编号
          contType:1,              //合同类型
          dealPrice:'12345121',
          dealPerson:'当代一店下雨天1',         
          sponsorDate:'2018/11/07',
          sponsorPerson:'当代一店下雨天2',
          realSettle: 2000,
          toExamineState:1,
          examineDate:'2018/11/07',
          examinePerson: '当代一店下雨天3',
          remarks:''
        },
        {
          contractNo:'YQYD110063', //合同编号
          contType:2,              //合同类型
          dealPrice:'12345121',
          dealPerson:'当代一店下雨天1',         
          sponsorDate:'2018/11/07',
          sponsorPerson:'当代一店下雨天2',
          realSettle: 2000,
          toExamineState:1,
          examineDate:'2018/11/07',
          examinePerson: '当代一店下雨天3',
          remarks:''
        },
        {
          contractNo:'YQYD110063', //合同编号
          contType:3,              //合同类型
          dealPrice:'12345121',
          dealPerson:'当代一店下雨天1',         
          sponsorDate:'2018/11/07',
          sponsorPerson:'当代一店下雨天2',
          realSettle: 2000,
          toExamineState:2,
          examineDate:'2018/11/07',
          examinePerson: '当代一店下雨天3',
          remarks:''
        },
        {
          contractNo:'YQYD110063', //合同编号
          contType:4,              //合同类型
          dealPrice:'12345121',
          dealPerson:'当代一店下雨天1',         
          sponsorDate:'2018/11/07',
          sponsorPerson:'当代一店下雨天2',
          realSettle: 2000,
          toExamineState:3,
          examineDate:'2018/11/07',
          examinePerson: '当代一店下雨天3',
          remarks:''
        },
        ],

        // 分页
        currentPage: 1,
        total: 100,

        
      }
    },

    computed: {
        
    },
  
    methods:{
      //获取合同列表
      // getContractList(){
      //   let param = {
      //     pageNum:'1',
      //     pageSize:'10',
      //     keyWord:'',
      //     cont:{}
      //   }
      //   this.$ajax.post('/api/contract/contractList', param).then(res=>{

      //   })
      // },


      // 控制弹框body内容高度，超过显示滚动条
      clientHeight() {        
          return this.clientHei - 265 + 'px'
      },
      

      // 重置
      resetFormFn() {
          this.$refs.propForm.resetFields()
      },
      // 查询
      queryFn() {
          console.log('查询')
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
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
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