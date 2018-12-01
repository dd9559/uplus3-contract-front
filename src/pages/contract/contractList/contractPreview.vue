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
      <div class="btn" v-if="!operationType">
        <el-button type="primary" round style="width:100px" @click="toEdit">编 辑</el-button>
        <el-button type="primary" round style="width:100px" @click="dialogInvalid = true">无 效</el-button>
        <el-button round style="width:100px" v-if="examineState<0">提交审核</el-button>
        <el-button round style="width:100px" v-if="contState===3">变更</el-button>
        <el-button round style="width:100px" v-if="contState===3">解约</el-button>
        <el-button round style="width:100px" @click="signature" v-if="examineState===7">签章打印</el-button>
      </div>
      <div class="btn" v-else>
        <el-button type="primary" round style="width:100px" @click="dialogCheck = true" v-if="!isSignature">审核</el-button>
        <el-button type="primary" round style="width:100px" v-if="isSignature">签章</el-button>
      </div>
    </div>
    <div class="content">
      <img :src="src" alt="" width="620" height="800">
      <div class="btnList">
        <el-button class="paging iconfont icon-tubiao_shiyong-20" @click="del"></el-button>
        <div class="tally"><span>{{count}}</span>/<span>{{showTotal}}</span></div>
        <el-button class="paging iconfont icon-tubiao_shiyong-22" @click="add"></el-button>
      </div>
    </div>
    <!-- 合同无效弹窗 -->
    <el-dialog title="合同无效" :visible.sync="dialogInvalid" width="740px">
      <div class="top">
        <p>合同无效原因</p>
        <div class="reason">
          <el-input type="textarea" :rows="5" placeholder="请填写合同无效原因，最多100字 " v-model="textarea" resize='none' style="width:597px" maxlength="100">
          </el-input>
          <span>{{textarea.length}}/100</span>
          <p><span>注：</span>您的合同正在审核中，是否确认要做无效？无效后，合同需要重新提审！</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="dialogInvalid = false">取消</el-button>
        <el-button round type="primary" @click="dialogInvalid = false">保存</el-button>
      </span>
    </el-dialog>
    <!-- 合同审核弹窗 -->
    <el-dialog title="合同审核" :visible.sync="dialogCheck" width="740px">
      <div class="checkTop">
        <p>审核结果</p>
        <div @click="sign"><span :class="{'sign':isSign}"><i class="el-icon-success"></i></span>标记风险单</div>
      </div>
      <div class="checkBottom">
        <p><span>*</span>审核备注</p>
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
  </div>
</template>
           
<script>
export default {
  data() {
    return {
      isActive: 1,
      dialogInvalid: false,
      dialogCheck: false,
      textarea: "",
      isSign: 0,
      //审核
      operationType: "",
      //合同id
      id:'',
      code:'',
      isShowType:false,
      //审批流节点信息
      auditNodeResult:{},
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
      contType:''
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.code = this.$route.query.code;
    if (this.$route.query.operationType) {
      this.operationType = this.$route.query.operationType;
      this.getAuditNode();
    }
    this.getContImg();
  },
  methods: {
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
        }
      })
    },
    //签章
    signature(){
      let param = {
        id:this.id
      }
      this.$ajax.post('/api/contract/signture', param).then(res=>{
        res=res.data;
        if(res.status===200){
          this.$message({
            message:'操作成功'
          })
        }
      })
    },
    checked(num) {
      //驳回/风险单
      if (num===2 || this.isSign) {
        if (this.textarea.length) {
          let param = {
            bizId:this.auditNodeResult.bizId,
            bizCode:this.code,
            flowId:this.auditNodeResult.flowId,
            sort:this.auditNodeResult.nodeSort,
            ApprovalForm:{
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
      } else {
        let param = {
          bizId:this.auditNodeResult.bizId,
          bizCode:this.code,
          flowId:this.auditNodeResult.flowId,
          sort:this.auditNodeResult.nodeSort,
          ApprovalForm:{
            result: num,
            isRisk: this.isSign, //风险单
            remark: this.textarea
          }
        };
        this.toChecked(param);
      }
    },
    //获取当前待审节点
    getAuditNode(){
      let param = {
        bizCode:this.code,
        flowType:3
      }
      this.$ajax.get('/api/machine/getAuditNode', param).then(res=>{
        res=res.data;
        if(res.status===200){
          this.auditNodeResult=res.data;
        }
      })
    },
    //获取合同预览图片
    getContImg(){
      let param = {
        id:this.id
      };
      this.$ajax.get('/api/contract/preview', param).then(res=>{
        res=res.data;
        if(res.status===200){
          this.examineState=res.data.examineState.value;
          this.contState=res.data.contState.value;
          this.contType=res.data.contType.value;
          if(res.data.cityId===1&&res.data.contType.value===2){
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
      this.src = value.substr(0,value.lastIndexOf('.'))+count+value.substr(value.lastIndexOf('.'));
    },
    //编辑
    toEdit(){
      this.$router.push({
        path: "/addContract",
        query: {
          id: this.id,
          operateType: 2,
          type: this.contType
        }
      });
    }
  }
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
  .content{
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
    padding-bottom: 20px;
    display: flex;
    i {
      padding-right: 5px;
    }
    > p {
      width: 75px;
    }
    .sign {
      color: @color-blue;
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