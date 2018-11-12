<template>
  <div class="view-container">
    <div class="header">
      <div class="title">
        <p><span>合同预览</span>合同需签章打印且双方签字后生效</p>
      </div>
      <div class="type">
          <span :class="{'active':isActive===1}" @click="changeType(1)">居间合同</span>
          <span :class="{'active':isActive===2}" @click="changeType(2)">买卖合同</span>
      </div>
      <div class="btn">
        <el-button type="primary" round style="width:100px">编 辑</el-button>
        <el-button type="primary" round style="width:100px" @click="dialogCheck = true">审核</el-button>
        <el-button type="primary" round style="width:100px" @click="dialogInvalid = true">无 效</el-button>
        <el-button round style="width:100px">提交审核</el-button>
      </div>
    </div>
    <div class="content"></div>
    <!-- 合同无效弹窗 -->
    <el-dialog title="合同无效" :visible.sync="dialogInvalid" width="740px">
      <div class="top">
        <p>合同无效原因</p>
        <div class="reason">
          <el-input
          type="textarea"
          :rows="5"
          placeholder="请填写合同无效原因，最多100字 "
          v-model="textarea"
          resize='none'
          style="width:597px"
          maxlength="100">
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
          <el-input
          type="textarea"
          :rows="5"
          placeholder="请填写审核原因以及风险单原因，最多100字 "
          v-model="textarea"
          resize='none'
          style="width:624px"
          maxlength="100">
          </el-input>
          <span>{{textarea.length}}/100</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="dialogInvalid = false">驳回</el-button>
        <el-button round type="success" @click="dialogInvalid = false">通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>
           
<script>
export default {
  data(){
    return{
      isActive:1,
      dialogInvalid: false,
      dialogCheck:false,
      textarea:'',
      isSign:false
    }
  },
  methods:{
    changeType(value){
      this.isActive=value
    },
    sign(){
      this.isSign=!this.isSign
    }
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

.view-container{
  background: @bg-white;
  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    border-bottom: 2px solid @border-CE;
    .title{
      > p{
        font-size: 12px;
        color: @color-6c;
        > span{
          color: @color-blank;
          font-size: 18px;
          padding-right: 10px;
        }
      }
    }
    .type{
      width: 200px;
      height: 36px;
      align-items: center;
      box-sizing: border-box;
      border: 2px solid @color-blue;
      border-radius: 18px;
      overflow: hidden;
      display: flex;
      > span{
        width: 50%;
        height: 36px;
        line-height: 36px;
        text-align: center;
        font-size: 14px;
        color: @color-blue;
      }
      .active{
        background: @color-blue;
        color: @color-white;
      }
    }
    .btn{
      /deep/.el-button.is-round{
        padding: 10px 23px
      }
    }
  }
  /deep/.el-dialog__header{
    border-bottom: 1px solid @border-ED;
  }
  .top{
    display: flex;
    > p{
      padding-right: 15px;
      font-size: 14px;
      width: 90px;
      color: @color-6c;
    }
    >.reason{
      position: relative;
      > span{
        position: absolute;
        top: 90px;
        right: 10px;
        color: @color-6c;
      }
      > p{
        padding-top: 10px;
        color: @color-6c;
        font-size: 12px;
        > span{
          color: @color-blank;
        }
      }
    }
  }
  .checkTop{
    padding-bottom: 20px;
    display: flex;
    i{
      padding-right: 5px;
    }
    > p{
      width: 75px;
    }
    .sign{
      color: @color-blue;
    }
  }
  .checkBottom{
    display: flex;
    > p{
      font-size: 14px;
      width: 75px;
      color: @color-6c;
      >span{
        color:red;
        font-size: 16px;
      }
    }
    >.reason{
      position: relative;
      > span{
        position: absolute;
        top: 90px;
        right: 10px;
        color: @color-6c;
      }
      > p{
        padding-top: 10px;
        color: @color-6c;
        font-size: 12px;
        > span{
          color: @color-blank;
        }
      }
    }
  }
}
</style>