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
            <span class="tag">签约日期：</span>
            <span class="text">{{getDetail.signDate|timeFormat_}}</span>
          </p>
          <p>
            <span class="tag">项目名称：</span>
            <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.projectName}}</span>
          </p>
        </div>
        <div class="one_">
          <p>
            <span class="tag">成交总价：</span>
            <span class="text">{{getDetail.dealPrice}} 元</span>
          </p>
          <p>
            <span class="tag">应收佣金：</span>
            <span class="text">{{getDetail.receivableCommission}} 元</span>
          </p>
        </div>
      </div>
    </div>
    <div class="msg">
      <div class="title">房源信息</div>
      <div class="content">
        <div class="one_">
          <p style="width:1000px">
            <span class="tag">产权地址：</span>
            <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.propertyRightAddr}}</span>
          </p>
        </div>
        <div class="one_">
          <p>
            <span class="tag">建筑面积：</span>
            <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.square?`${getDetail.contractInfo.square} m²`:"-"}}</span>
          </p>
          <p>
            <span class="tag">户型：</span>
            <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.houseType}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="msg">
      <div class="title">客源信息</div>
      <div class="content">
        <div class="one_">
          <p>
            <span class="tag">客源编号：</span>
            <span class="serialNumber">{{getDetail.guestinfoCode}}</span>
          </p>
        </div>
        <div class="table" v-if="getDetail.contractInfo">
          <el-table :data="getDetail.contractInfo.customerList" border header-row-class-name="theader-bg">
            <el-table-column prop="name" label="客户姓名"></el-table-column>
            <el-table-column label="电话">
              <template slot-scope="scope">
                {{scope.row.mobile}}
                <i class="iconfont icon-tubiao_shiyong-16" @click="call(scope.row,scope.$index,'guest')" v-if="power['sign-ht-xq-ly-call'].state"></i>
              </template>
            </el-table-column>
            <el-table-column prop="relation" label="关系">
            </el-table-column>
            <el-table-column min-width="150" label="证件号码">
              <template slot-scope="scope">
                {{scope.row.cardType===1?'身份证号：':scope.row.cardType===2?'护照：':'营业执照：'}}{{scope.row.cardCode}}
              </template>
            </el-table-column>
          </el-table>
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
      clientHei:'',
      power:{
        'sign-ht-xq-ly-wmemo': {
          state: false,
          name: '添加录音备注'
        },
        'sign-ht-xq-ly-call': {
          state: false,
          name: '拨打电话'
        },
        'sign-ht-xq-ly-play': {
          state: false,
          name: '听取录音'
        },
        'sign-ht-xq-ly-vmemo': {
          state: false,
          name: '查看备注'
        },
      },
    }
  },
  created () {
    
  },
  methods:{
    call(){

    }
  },
  filters: {
    timeFormat_: function (val) {
      if (!val) {
        return '--'
      } else {
        let time = new Date(val)
        let y = time.getFullYear()
        let M = time.getMonth() + 1
        let D = time.getDate()
        let h = time.getHours()
        let m = time.getMinutes()
        let s = time.getSeconds()
        let time_ = `${y}-${M > 9 ? M : '0' + M}-${D > 9 ? D : '0' + D} ${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`;
        return time_.substr(0, 10)
      }
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
          // display: -webkit-box;
          /*!autoprefixer: off */
          // -webkit-box-orient: vertical;
          /* autoprefixer: on */
          // -webkit-line-clamp: 1;
          // overflow: hidden;
          // text-overflow:ellipsis;
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