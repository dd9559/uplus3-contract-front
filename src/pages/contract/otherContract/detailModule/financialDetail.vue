<template>
  <div class="firstDetail">
    <div class="msg">
      <div class="title">合同信息</div>
      <div class="content">
        <div class="one_">
          <p style="position:relative;">
            <span class="tag">合同编号：</span>
            <el-tooltip class="item" effect="dark" :content="getDetail.code" placement="bottom">
              <div class="contractDetailCode">
                {{getDetail.code}}
              </div>
            </el-tooltip>
          </p>
          <p style="position:relative;">
            <span class="tag">纸质合同编号：</span>
            <el-tooltip class="item" effect="dark" :content="getDetail.pCode" placement="bottom">
              <div class="contractDetailCode">
                {{getDetail.pCode?getDetail.pCode:"-"}}
              </div>
            </el-tooltip>
          </p>
          <p>
            <span class="tag">放款日期：</span>
            <span class="text">{{getDetail.contractInfo.loanDate}}</span>
          </p>
          <p>
            <span class="tag">项目类型：</span>
            <span class="text">{{getDetail.contractInfo.projectType?getDetail.contractInfo.projectType:"-"}}</span>
          </p>
        </div>
        <div class="one_">
          <p>
            <span class="tag">放款金额：</span>
            <span class="text">{{getDetail.contractInfo.loanAmount}} 元</span>
          </p>
          <p>
            <span class="tag">期限时间：</span>
            <span class="text">{{getDetail.contractInfo.termStart?`${getDetail.contractInfo.termStart} ~ ${getDetail.contractInfo.termEnd}`:'-'}}</span>
          </p>
        </div>
        <div class="one_">
          <p>
            <span class="tag">金融专员：</span>
            <span class="text">{{getDetail.contractInfo.financeCommissioner?getDetail.contractInfo.financeCommissioner:"-"}}</span>
          </p>
          <p>
            <span class="tag">经办人：</span>
            <span class="text">{{getDetail.contractInfo.transactor?getDetail.contractInfo.transactor:"-"}}</span>
          </p>
          <p>
            <span class="tag">受理人：</span>
            <span class="text">{{getDetail.contractInfo.acceptor?getDetail.contractInfo.acceptor:"-"}}</span>
          </p>
          <p>
            <span class="tag">岗位名称：</span>
            <span class="text">{{getDetail.contractInfo.positionName?getDetail.contractInfo.positionName:"-"}}</span>
          </p>
        </div>
        <div class="one_">
          <p>
            <span class="tag">收入金额：</span>
            <span class="text">{{getDetail.contractInfo.incomeAmount}} 元</span>
          </p>
          <p>
            <span class="tag">金融成本比例：</span>
            <span class="text">{{getDetail.contractInfo.financeCostRatio}}</span>
          </p>
          <p>
            <span class="tag">金融成本：</span>
            <span class="text">{{getDetail.contractInfo.financeCost}} 元</span>
          </p>
        </div>
      </div>
    </div>
    <div class="msg">
      <div class="title">房源信息</div>
      <div class="content">
        <div class="one_">
          <p><span class="tag">房源编号：</span><span class="serialNumber">{{getDetail.houseinfoCode}}</span></p>
          <p style="width:1000px"><span class="tag">U+地址：</span><span class="text">{{getDetail.contractInfo.propertyAddr}}</span></p>
        </div>
        <div class="one_">
          <p style="width:1000px"><span class="tag">产权地址：</span><span class="text">{{getDetail.contractInfo.propertyRightAddr}}</span></p>
        </div>
      </div>
    </div>
    <div class="msg">
      <div class="title">客源信息</div>
      <div class="content">
        <div class="one_">
          <p><span class="tag">客户姓名：</span><span class="text">{{getDetail.contractInfo.customerName}}</span></p>
          <p><span class="tag">所属区域：</span><span class="text">{{getDetail.contractInfo.customerArea}}</span></p>
        </div>
      </div>
    </div>
    <div class="msg">
      <div class="title">签约信息</div>
      <div class="content">
        <div class="one_">
          <p>
            <span class="tag">成交经纪人：</span>
            <span class="text">{{getDetail.dealAgentStoreName+" - "+getDetail.dealAgentName}}</span>
          </p>
          <p>
            <span class="tag">店长：</span>
            <span class="text">{{getDetail.shopOwnerStoreName+" - "+getDetail.shopOwnerName}}</span>
          </p>
        </div>
        <div class="one_">
          <p>
            <span class="tag">合作方：</span>
            <span class="text">{{getDetail.cooperationName?getDetail.cooperationName:"-"}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="msg">
      <div class="title">店佣信息</div>
      <div class="content">
        <div class="table">
          <template>
            <el-table :data="clientrData" border header-row-class-name="theader-bg">
              <el-table-column prop="name" label="客户姓名"></el-table-column>
              <el-table-column label="电话">
                <template slot-scope="scope">
                  {{scope.row.mobile}}
                  <i class="iconfont icon-tubiao_shiyong-16" @click="call(scope.row,scope.$index,'guest')" v-if="power['sign-ht-xq-ly-call'].state"></i>
                </template>
              </el-table-column>
              <el-table-column prop="relation" label="关系"></el-table-column>
              <el-table-column label="产权比">
                <template slot-scope="scope">
                  {{scope.row.propertyRightRatio+'%'}}
                </template>
              </el-table-column>
              <el-table-column min-width="150" label="证件号码">
                <template slot-scope="scope">
                  {{scope.row.identifyCode}}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
           
<script>
export default {
  props:{
    detail:{
      type: Object,
      default() {
        return {}
      }
    }
  },
  data(){
    return{
      clientrData:[],
    }
  },
  computed: {
    getDetail: function() {
      return this.detail;
    },
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.contractDetailCode{
  position: absolute;
  left: 100px;
  top:50%;
  transform: translateY(-50%);
  width: 150px;
  display: inline-block;
  box-sizing: border-box;
  color: @color-blue;
  font-weight: bold;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.msg {
  border-bottom: 1px solid @border-ED;
  display: flex;
  padding: 20px 0 20px 0;
  .title {
    width: 70px;
    font-weight: bold;
    color: @color-blank;
    white-space: nowrap;
  }
  .content {
    .one_ {
      margin-bottom: 10px;
      &:last-of-type {
        margin-bottom: 0;
      }
      > p {
        width: 270px;
        display: inline-block;
        .tag {
          display: inline-block;
          width: 100px;
          text-align: right;
          color: @color-6c;
        }
        .text {
          color: @color-blank;
        }
        .dealPrice {
          color: @color-yellow;
        }
        .serialNumber {
          color: @color-blue;
          font-weight: bold;
        }
      }
      .address {
        width: 600px;
      }
    }
    .extendParams{
      width: 1000px;
      display: flex;
      flex-wrap: wrap;
      > p{
        display: flex;
        width: 300px;
        padding: 4px 0;
        .tag{
          width: 100px;
          cursor: pointer;
        }
        .text{
          max-width: 110px;
          cursor: pointer;
        }
        .colon{
          color: @color-6c;
        }
        .extendUnit{
          color: @color-6c;
          padding-left: 5px;
        }
        .tagHidden{
          text-overflow:ellipsis;
          white-space:nowrap;
          overflow:hidden;
          display: inline-block;
        }
      }
    }
    .performance {
      > p {
        color: @color-6c;
        .orange {
          color: @color-orange;
        }
      }
    }
    .table {
      padding: 10px 0;
      width: 1050px;
      /deep/ .theader-bg {
        > th {
          background-color: @bg-th;
        }
      }
      i {
        font-size: 20px;
        padding-left: 5px;
        color: #54d384;
        cursor: pointer;
      }
      > p {
        color: @color-6c;
        padding-bottom: 10px;
      }
    }
    .remark {
      display: flex;
      padding-left: 15px;
      >span{
        color: @color-6c;
      }
      > p {
        color: @color-6c;
        width: 650px;
        height: 100px;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid rgba(236, 239, 242, 1);
        background: @bg-FA;
      }
      /deep/.el-textarea.is-disabled .el-textarea__inner{
        color: #606266;
      }
    }
  }
}
</style>