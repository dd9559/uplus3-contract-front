<template>
  <div class="view-container">
    <div class="header">
      <div class="title">
        <p><span>合同预览</span>合同需签章打印且双方签字后生效</p>
      </div>
      <div class="type" v-if="isShowType">
        <span :class="{'active':isActive===1}" @click="changeType(1)">居间合同</span>
        <span :class="{'active':isActive===2}" @click="changeType(2)">买卖合同</span>
      </div>
      <div class="btn" v-if="contType<4">
        <el-button type="primary" round style="width:100px" v-if="power['sign-ht-info-edit'].state&&(examineState<0||examineState===2)" @click="toEdit">编辑</el-button>
        <el-button type="primary" round style="width:100px" v-if="power['sign-ht-xq-void'].state&&contState!=3&&contState!=0" @click="dialogInvalid = true">撤单</el-button>
        <el-button round type="primary" style="width:100px" v-if="power['sign-ht-view-toverify'].state&&examineState<0&&contType<4" @click="isSubmitAudit=true">提交审核</el-button>
        <el-button round type="primary" style="width:100px" v-if="power['sign-ht-xq-modify'].state&&contState===3&&contChangeState!=2&&contChangeState!=1" @click="goChangeCancel(1)">变更</el-button>
        <el-button round type="danger"  style="width:100px" v-if="power['sign-ht-xq-cancel'].state&&contState===3&&contChangeState!=2"  @click="goChangeCancel(2)">解约</el-button>
        <el-button round style="width:100px" v-if="power['sign-ht-view-print'].state&&examineState===1&&contState===1" @click="signature(3)"  v-loading.fullscreen.lock="fullscreenLoading">签章打印</el-button>
        <el-button round style="width:100px" v-if="power['sign-ht-view-print'].state&&examineState===1&&contState===2" @click="dayin">签章打印</el-button>
        <el-button type="primary" round style="width:100px" @click="dialogCheck = true" v-if="examineState===0&&userMsg.empId===auditId">审核</el-button>
        <el-button round style="width:100px" v-if="examineState===0&&userMsg.empId!==auditId">审核中</el-button>
      </div>
      <div class="btn" v-else>
        <el-button type="primary" round style="width:100px" v-if="power['sign-ht-info-edit'].state" @click="toEdit">编辑</el-button>
      </div>
    </div>

    <div class="yulan" :style="{ height: clientHei }">
      <div class="content">
        <img :src="src" alt="" width="620" height="800">
        <div class="btnList">
          <el-button class="paging iconfont icon-tubiao_shiyong-20" @click="del"></el-button>
          <div class="tally"><span>{{count}}</span>/<span>{{showTotal}}</span></div>
          <el-button class="paging iconfont icon-tubiao_shiyong-22" @click="add"></el-button>
        </div>
      </div>
    </div>
    
    <!-- 合同撤单弹窗 -->
    <el-dialog title="合同撤单" :visible.sync="dialogInvalid" width="740px" :closeOnClickModal="$tool.closeOnClickModal">
      <div class="top">
        <p class="form-label">合同撤单原因</p>
        <div class="reason">
          <el-input type="textarea" :rows="5" placeholder="请填写合同撤单原因，最多100字 " v-model="invalidReason" resize='none' style="width:597px" maxlength="100">
          </el-input>
          <span>{{invalidReason.length}}/100</span>
          <p v-if="examineState>-1&&contState!=2"><span>注：</span>您的合同正在审核中，是否确认要做撤单？撤单后，合同需要重新提审！</p>
          <p v-if="contState===2"><span>注：</span>您的合同已签章，是否确认要做撤单？撤单后，合同需要重新提审！</p>
          <p v-if="examineState<0"><span>注：</span>您的合同是否确认要做撤单？撤单后，合同需要重新提审！</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="dialogInvalid = false">取消</el-button>
        <el-button round type="primary" @click="setInvalid">保存</el-button>
      </span>
    </el-dialog>
    <!-- 合同审核弹窗 -->
    <el-dialog title="合同审核" :visible.sync="dialogCheck" width="740px" :closeOnClickModal="$tool.closeOnClickModal">
      <div class="checkTop">
        <div @click="sign"><span :class="{'sign':isSign}">标记风险单</span></div>
      </div>
      <div class="checkBottom">
        <p><span v-if="isSign">*</span>审核备注</p>
        <div class="reason">
          <el-input type="textarea" :rows="5" placeholder="请填写审核原因以及风险单原因，最多100字 " v-model="textarea" resize='none' style="width:624px" maxlength="100">
          </el-input>
          <span>{{textarea.length}}/100</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="checked(2)">驳回</el-button>
        <el-button round type="success" @click="checked(1)">通过</el-button>
      </span>
    </el-dialog>
    <!-- 变更/解约编辑弹窗 -->
    <changeCancel :dialogType="canceldialogType" :cancelDialog="changeCancel_" :contId="changeCancelId" @closeChangeCancel="changeCancelDialog" v-if="changeCancel_"></changeCancel>
     <!-- 提审确认框 -->
    <el-dialog title="提示" :visible.sync="isSubmitAudit" width="460px">
      <span>确定提审？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isSubmitAudit = false">取 消</el-button>
        <el-button type="primary" @click="submitAudit">确 定</el-button>
      </span>
    </el-dialog>
    <PdfPrint :url="pdfUrl" ref="pdfPrint" v-if="haveUrl"></PdfPrint>
    <!-- 设置/转交审核人 -->
    <checkPerson :show="checkPerson.state" :type="checkPerson.type" :showLabel="checkPerson.label" :bizCode="checkPerson.code" :flowType="checkPerson.flowType" @close="checkPerson.state=false" v-if="checkPerson.state"></checkPerson>
  </div>
</template>
           
<script>
import changeCancel from "../contractDialog/changeCancel";
import PdfPrint from '@/components/PdfPrint';
import { MIXINS } from "@/assets/js/mixins";
import checkPerson from '@/components/checkPerson';

export default {
  mixins: [MIXINS],
  components: {
    changeCancel,
    PdfPrint,
    checkPerson
  },
  data() {
    return {
      isActive: 1,
      dialogInvalid: false,
      dialogCheck: false,
      invalidReason: "",
      textarea:"",
      isSign: 0,
      //审核
      operationType: "",
      //合同id
      id:'',
      code:'',
      cityId:'',
      isShowType:false,
      //审批流节点信息
      // auditNodeResult:{},
      //签章
      isSignature:false,
      //买卖合同地址
      business:'',
      total_b:'',
      //居间合同地址
      residence:'',
      total_r:'',
      //其他合同地址
      address:'',
      total_a:'',
      //展示地址
      showAddress:'',
      showTotal:'',
      src:'',
      count:1,
      //合同状态
      contState:'',
      //审核状态
      examineState:'',
      //合同类型
      contType:'',
      //变更解约
      contChangeState:'',
      //当前待审人id
      auditId:'',
      //当前登录人信息
      userMsg:{},
      subCheck:'提交审核',
      canceldialogType:'',
      changeCancel_:'',
      changeCancelId:'',
      isSubmitAudit:false,
      //客源方门店id
      guestStoreId:'',
      //合同打印的pdf地址
      pdfUrl:'',
      haveUrl:false,
      //加载等待
      fullscreenLoading:false,
      clientHei:'',
      checkPerson: {
        state:false,
        type:'init',
        code:'',
        flowType:0,
        label:false
      },
      power: {
        'sign-ht-info-edit': {
          state: false,
          name: '编辑'
        },
        'sign-ht-xq-void': {
          state: false,
          name: '撤单'
        },
        'sign-ht-view-toverify': {
          state: false,
          name: '提交审核'
        },
        'sign-ht-xq-modify': {
          state: false,
          name: '变更'
        },
        'sign-ht-xq-cancel': {
          state: false,
          name: '解约'
        },
        'sign-ht-view-print': {
          state: false,
          name: '签章打印'
        }
      }
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.code = this.$route.query.code;
    if (this.$route.query.operationType) {
      this.operationType = this.$route.query.operationType;
    }
    this.getContImg();
    this.getAdmin();//获取当前登录人信息
  },
  methods: {
    // 控制弹框body内容高度，超过显示滚动条
    clientHeight() {        
      this.clientHei= document.documentElement.clientHeight -120 + 'px'
    },
    //居间买卖切换
    changeType(value) {
      this.isActive = value;
      if(value===1){
        this.count=1;
        this.showAddress=this.residence;
        this.setSrc(this.showAddress,this.count);
        this.showTotal=this.total_r
      }else{
        this.count=1;
        this.showAddress=this.business;
        this.setSrc(this.showAddress,this.count);
        this.showTotal=this.total_b;
      }
    },
    //翻页
    add(){
      if(this.count<this.showTotal){
        this.count++;
        this.setSrc(this.showAddress,this.count);
      }
    },
    del(){
      if(this.count>1){
        this.count--;
        this.setSrc(this.showAddress,this.count);
      }
    },
    //标记风险单
    sign() {
      if (this.isSign) {
        this.isSign = 0;
      } else {
        this.isSign = 1;
      }
    },
    //通过驳回
    toChecked(param){
      this.$ajax.postJSON('/api/machine/audit', param).then(res=>{
        res=res.data
        if(res.status===200){
          this.dialogCheck=false;
          this.isSignature=true;
          this.getContImg();
          this.$message({
            message:'审核成功'
          })
        }
      }).catch(error => {
          if(error.message==='下一节点审批人不存在'){
            this.checkPerson.flowType=3;
            this.checkPerson.code=this.code;
            this.checkPerson.state=true;
            this.checkPerson.type="set";
            this.checkPerson.label=true;
          }else{
            this.$message({
              message:error,
              type: "error"
            })
          }
        })
    },
    //签章
    signature(value){
      if(value===3){
        let param = {
          id:this.id,
          type:value
        }
        this.fullscreenLoading=true;
        //签章
        this.$ajax.post('/api/contract/signture', param).then(res=>{
          res=res.data;
          if(res.status===200){
            let pdfUrl=res.data;
            // debugger
            this.getUrl(pdfUrl);
            this.haveUrl=true;
            setTimeout(()=>{
              this.dayin();
              this.fullscreenLoading=false;
            },2000);
            this.getContImg()
          }
        }).catch(error =>{
          this.fullscreenLoading=false;
          this.$message({
            message:error,
            type: "error"
          })
        })
      }else if(value===4){
        let param = {
          id:this.id,
          type:value
        }
        this.$ajax.post('/api/contract/signture', param).then(res=>{})
      }else{
        let param = {
          id:this.id,
          type:value
        }
        this.$ajax.post('/api/contract/signture', param).then(res=>{
          res=res.data;
          if(res.status===200){
            let pdfUrl=res.data;
            this.getUrl(pdfUrl);
            this.haveUrl=true;
          }
        })
      }
    },
    dayin(){
      this.$refs.pdfPrint.print();
      this.signature(4);
    },
    //获取签名
    getUrl(url){
      let param = {
        url:url
      }
      this.$ajax.get("/api/load/generateAccessURL",param).then(res=>{
        res = res.data
        if(res.status ===200){
          this.pdfUrl = res.data.url;
        }
      })
    },
    checked(num) {
      //驳回/风险单
      if (num===2 || this.isSign) {
        if (this.textarea.length>0) {
          this.textarea=this.textarea.replace(/\s/g,"");
          if(this.textarea.length>0){
            let param = {
              bizCode:this.code,
              flowType:3,
              approvalForm:{
                result: num,
                isRisk: this.isSign, //风险单
                remark: this.textarea
              }
            };
            this.toChecked(param);
          }else{
            this.$message({
              message: '请填写审核原因以及风险单原因',
              type: 'warning'
            });
          }
        }else{
          this.$message({
            message: '请填写审核原因以及风险单原因',
            type: 'warning'
          });
        }
      } else {
        let param = {
          bizCode:this.code,
          flowType:3,
          approvalForm:{
            result: num,
            isRisk: this.isSign, //风险单
            remark: this.textarea
          }
        };
        this.toChecked(param);
      }
    },
    //获取当前待审节点
    // getAuditNode(){
    //   let param = {
    //     bizCode:this.code,
    //     flowType:3
    //   }
    //   this.$ajax.get('/api/machine/getAuditNode', param).then(res=>{
    //     res=res.data;
    //     if(res.status===200){
    //       this.auditNodeResult=res.data;
    //     }
    //   })
    // },
    //获取合同预览图片
    getContImg(type){
      let param = {
        id:this.id
      };
      this.$ajax.get('/api/contract/preview', param).then(res=>{
        res=res.data;
        if(res.status===200){
          if(res.data.contState.value===2&&!type){
            this.signature(2)
          }
          this.examineState=res.data.examineState.value;
          this.contState=res.data.contState.value;
          this.contType=res.data.contType.value;
          this.guestStoreId=res.data.guestStoreId;
          this.contChangeState=res.data.contChangeState.value;
          this.cityId=res.data.cityId;
          this.auditId=res.data.auditId;
          this.isSign=res.data.isRisk;
          if(res.data.cityId===1&&(res.data.contType.value===2||res.data.contType.value===3)){  //||res.data.contType.value===3
            this.isShowType=true;
            //买卖
            this.business=res.data.imgAddress.business;
            this.total_b=res.data.imgCount.business;
            //居间
            this.residence=res.data.imgAddress.residence; 
            this.total_r=res.data.imgCount.residence;
            this.showAddress=res.data.imgAddress.residence;
            this.showTotal=res.data.imgCount.residence;
            this.setSrc(this.showAddress,this.count);
          }else {
            //其他
            this.address=res.data.imgAddress.address;
            this.total_a=res.data.imgCount.count;
            this.showAddress=res.data.imgAddress.address;
            this.showTotal=res.data.imgCount.count;
            this.setSrc(this.showAddress,this.count);
          }
        }
      })
    },
    //拼接地址
    setSrc(value,count){
      let src = value.substr(0,value.lastIndexOf('.'))+count+value.substr(value.lastIndexOf('.'));
      let param = {
        url:src
      }
      this.$ajax.get("/api/load/generateAccessURL",param).then(res=>{
        res = res.data
        if(res.status ===200){
          this.src = res.data.url;
        }
      })
    },
    //编辑
    toEdit(){
      this.setPath(this.$tool.getRouter(['合同','合同列表','合同编辑'],'contractList'));
      if(this.contType>3){
        this.$router.replace({
          path: "/newIntention",
          query: {
            id: this.id,
            contType: this.contType,
            operateType: 2
          }
        });
      }else{
        this.$router.replace({
          path: "/addContract",
          query: {
            id: this.id,
            operateType: 2,
            type: this.contType
          }
        });
      }
      
    },
     //提审
    submitAudit(){
      let param = {
        cityId:this.cityId,
        flowType:3,
        bizCode:this.code
      }
      this.$ajax.get('/api/machine/submitAduit', param).then(res=>{
        res=res.data
        if(res.status===200){
          this.$message({
            message:'提交审核成功',
            type:'success'
          });
          this.getContImg();
          this.isSubmitAudit=false
          this.subCheck="审核中"
        }else{
          this.$message({
            message:res.message,
          })
          this.isSubmitAudit=false
        }
      }).catch(error => {
          if(error.message==='下一节点审批人不存在'){
            this.checkPerson.flowType=3;
            this.checkPerson.code=this.code;
            this.checkPerson.state=true;
            this.checkPerson.type="set";
            this.checkPerson.label=true;
          }else{
            this.$message({
              message:error,
              type: "error"
            })
          }
        })
    },
    // 变更解约弹窗
    goChangeCancel(value) {
      this.changeCancelId = Number(this.id);
      if (value === 1) {
        this.canceldialogType = "changeEdit";
        this.changeCancel_ = true;
      } else if (value === 2) {
        this.canceldialogType = "cancelEdit";
        this.changeCancel_ = true;
      }
    },
    // 关闭变更解约弹窗
    changeCancelDialog() {
      this.changeCancel_ = false;
      this.canceldialogType = "";
      this.changeCancelId = "";
    },
    //撤单
    setInvalid(){
      if(this.invalidReason.length>0){
        this.invalidReason=this.invalidReason.replace(/\s/g,"")
        if(this.invalidReason.length>0){
          let param = {
            id: this.id,
            reason: this.invalidReason
          };
          this.$ajax.post('/api/contract/invalid', param).then(res=>{
            res=res.data;
            if(res.status===200){
              this.getContImg();
              this.dialogInvalid=false;
              this.$message({
                message:'操作成功'
              })
            }
          }).catch(error => {
            this.$message({
              message:error,
              type: "error"
            })
          })
        }else{
          this.$message({
            message:'请填写撤单原因'
          })
        }
      }else{
        this.$message({
          message:'请填写撤单原因'
        })
      }
    },
  },
  mounted(){
    window.onresize = this.clientHeight;
  },
  beforeUpdate() {
    this.clientHeight();
  },
  // watch:{
  //   textarea:function(val){
  //     if(val.length>10){
  //       console.log('test')
  //     }
  //   }
  // }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";

.view-container {
  background: @bg-white;
  .header {
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    height: 60px;
    box-sizing: border-box;
    border-bottom: 2px solid @border-CE;
    position: relative;
    .title {
      position: absolute;
      left: 30px;
      top: 15px;
      > p {
        font-size: 12px;
        color: @color-6c;
        > span {
          color: @color-blank;
          font-size: 18px;
          padding-right: 10px;
        }
      }
    }
    .type {
      width: 200px;
      height: 36px;
      align-items: center;
      box-sizing: border-box;
      border: 2px solid @color-blue;
      border-radius: 18px;
      overflow: hidden;
      display: flex;
      position: absolute;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);
      > span {
        width: 50%;
        height: 36px;
        line-height: 36px;
        text-align: center;
        font-size: 14px;
        color: @color-blue;
        cursor: pointer;
      }
      .active {
        background: @color-blue;
        color: @color-white;
      }
    }
    .btn {
      position: absolute;
      right: 30px;
      top: 12px;
      /deep/.el-button.is-round {
        padding: 10px 23px;
      }
    }
  }
  .yulan{
    overflow-y: auto;
  }
  .content{
    padding-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    img{
      border: 1px solid #ccc;
    }
    .btnList{
      margin-left: 20px;
      .tally{
        padding: 20px 0;
      }
      .paging{
        width: 36px;
        height: 36px;
        box-sizing: border-box;
        border-radius: 50%;
        padding: 0;
        font-size: 22px;
        font-weight: bold;
        color: @color-6c;
      }
    }
  }
  /deep/.el-dialog__header {
    border-bottom: 1px solid @border-ED;
  }
  .top {
    display: flex;
    padding-top: 20px;
    > p {
      padding-right: 15px;
      font-size: 14px;
      width: 90px;
      color: @color-6c;
    }
    > .reason {
      position: relative;
      > span {
        position: absolute;
        top: 90px;
        right: 10px;
        color: @color-6c;
      }
      > p {
        padding-top: 10px;
        color: @color-6c;
        font-size: 12px;
        > span {
          color: @color-blank;
        }
      }
    }
  }
  .checkTop {
    padding: 20px 0 20px 80px;
    span{
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      color: @color-blank;
      font-size: 14px;
      cursor: pointer;
    }
    .sign {
      color: @color-warning;
      border-color: @color-warning;
    }
  }
  .checkBottom {
    display: flex;
    > p {
      font-size: 14px;
      width: 75px;
      color: @color-6c;
      > span {
        color: red;
        font-size: 16px;
      }
    }
    > .reason {
      position: relative;
      > span {
        position: absolute;
        top: 90px;
        right: 10px;
        color: @color-6c;
      }
      > p {
        padding-top: 10px;
        color: @color-6c;
        font-size: 12px;
        > span {
          color: @color-blank;
        }
      }
    }
  }
}
</style>