<template>
  <div class="page-view">
    <div class="page-view-index">
      <ul>
        <li v-for="(item,index) in Index" :key="index" @click="toLink(item,index)">{{item.name}}</li>
      </ul>
      <p
        class="operation"
        @click="goBack"
        v-if="Index.length>3&&$route.path!=='/routingRemitDetail' && $route.path!=='/storeReceive' && $route.path!=='/achDetial' && $route.path!=='/detailIntention'&& $route.path!=='/contractDetails'&&$route.path!=='/achPage'&& $route.path!=='/otherContractList'&&( $route.path!=='/receiptBill'||!$route.query.deAudit)"
      >
        <i class="iconfont icon-fanhui"></i>
        <span>返回</span>
      </p>
    </div>
    <div class="page-view-content">
      <router-view class="router-view" :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "index",
  data() {
    return {
      Index: [], //面包屑list
      back: false //返回按钮是否显示
    };
  },
  created() {
    console.log(this.$route.path);
    console.log(this.$route.query);
    this.Index = this.getPath;
    this.$parent.loadingState = false;
  },
  methods: {
    toLink: function(item, index) {
      if (index < 3) {
        if (item.path.includes("/storeReceive")) {
          //业绩报表特殊路由处理
          item.path = item.path.split("?")[0];
        }
        this.$router.push({
          path: item.path
        });
      }
    },
    goBack: function() {
      if (this.$route.path === "/extendParams") {
        let backMsg = {
          type: 2
        };
        localStorage.setItem("backMsg", JSON.stringify(backMsg));
      }
      this.$router.go(-1);
    }
  },
  computed: {
    ...mapGetters(["getPath"])
  },
  watch: {
    getPath: function(val) {
      this.Index = val;
    }
  }
};
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";

  .page-view {
    flex: 1;
    overflow-x: auto;
    position: relative;
    background-color: @bg-grey;
    &-index {
      height: 40px;
      margin: 0 20px;
      position: relative;
      > ul {
        height: 100%;
        display: flex;
        align-items: center;
        > li {
          position: relative;
          margin-right: 10px;
          color: @color-99A;
          cursor: pointer;
          &:after {
            content: ">";
            margin-left: 10px;
            /*width: 40px;
              height: 40px;*/
          }
          &:last-of-type {
            color: @color-324;
            &:after {
              content: "";
              margin: 0;
            }
          }
        }
      }
      .operation {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        background-color: @bg-white;
        padding: @margin-base @margin-base @margin-base 0;
        border-radius: 4px;
      }
    }
    &-content {
      // padding: 0px @margin-15;
      position: absolute;
      top: 40px;
      right: @margin-15;
      bottom: 0;
      left: @margin-15;
      // overflow-y: auto;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background-color: @bg-white;
      }
      /deep/.theader-bg {
        > th {
          background-color: @bg-th;
          > .cell {
            white-space: nowrap;
          }
        }
      }
      /deep/.el-table {
        font-size: @size-base;
        th,
        td {
          padding: @margin-base 0;
          > .cell {
            // white-space: nowrap;
            .span-cursor {
              color: @color-blue;
              cursor: pointer;
            }
          }
        }
        // &.info-scrollbar{
        //   margin-bottom: 54px;
        //   .el-table__body-wrapper{
        //     margin-bottom: -17px;
        //   }
        //   .el-table__fixed-right{
        //     padding-bottom: 17px;
        //   }
        // }
      }
      .router-view {
        // min-height: 100%;
        background-color: @bg-white;
        position: relative;
        // z-index: 1;
      }
    }
  }

  /deep/ .pagination-info {
    text-align: right;
  }

  /deep/ .el-table__empty-block {
    line-height: 60px;
  }

  /deep/ .el-dialog__headerbtn {
    top: 16px;
    .el-dialog__close {
      font-size: 24px;
      color: #32485f;
    }
  }

// 页面内容
/deep/.commission-view {
  .brand-nav {
    background-color: #f5f5f5;
    height: 50px;
    line-height: 50px;
    border: none;
    font-size: 16px;
    padding-left: 20px;
  }
  .main {
    padding: 0 10px;
    background-color: #fff;
    border-radius: 4px;
  }

  .cl-red {
    color: #ff1738;
  }
  .cl-green {
    color: #00b179;
  }
  .cl-blue {
    color: #5795f7;
  }

  .reveal-box {
    overflow: hidden;
    padding: 8px 14px;
    line-height: 34px;
    font-size: 14px;
    .reveal-txt {
      float: left;
      font-weight: bold;
      color: #28304e;
      font-weight: bold;
    }
    .reveal-p1 {
      font-weight: normal;
      color: #28304e;
      font-size: 12px;
    }
    .btn-orange {
      line-height: 34px;
      height: 34px;
      padding: 0 20px;
      background-color: #409eff;
      color: #fff;
      margin-right: 10px;
    }
    .btn-orange-border {
      line-height: 34px;
      height: 34px;
      padding: 0 20px;
      background-color: #409eff;
      color: #fff;
    }
    .fr {
      float: right;
    }
  }


  .table-box {
    width: 100%;

    th {
      padding: 6px 0;
      background-color: #eff4f8;
      & > .cell {
        line-height: 23px;
        height: 23px;
        // color: #28304e;
        padding-left: 25px;
        padding-right: 0;
      }
    }
    td {
      padding: 14px 0;
      & > .cell {
        padding-left: 25px;
        padding-right: 0;
        line-height: 20px;
      }
    }
    tr.hover-row > td {
      background-color: rgba(255, 161, 72, 0.1);
    }
  }

  .commission-top {
    .el-input__icon {
      line-height: 34px;
    }
    .el-input__inner {
      line-height: 34px;
      height: 34px;
    }
    
    &.paper-box .paper-box-content {
      margin-top: -8px;
      font-size: 0;
    }
    &.paper-box.collapse-off .paper-box-content {
      max-height: 47px;
    }
    .el-input {
      margin-top: 12px;
      margin-right: 16px;
      &:last-child {
        margin-right: 0;
      }
    }
    .select-tree {
      width: 200px;
      display: inline-block;
      position: relative;
      top: 12px;
      .el-input {
        margin-top: 0;
      }
    }

    .paper-box-title {
      padding-top: 6px;
    }
    .item-text {
      font-size: 12px;
      color: #28304e;
      line-height: 34px;
      height: 34px;
      box-sizing: border-box;
      padding: 0 14px;
      border: 1px solid #d3d6e6;
      display: inline-block;
      border-right: 0;
      border-radius: 4px 0 0 4px;
      margin-top: 12px;
      background: #fff;
    }
    .item-billing-date {
      display: inline-block;
      .el-input__inner {
        position: relative;
        top: -1px;
        border-radius: 0 4px 4px 0;
      }
    }
    .item-billing-date2 {
      .item-billing-date;
      position: relative;
      padding: 0 10px;
    }
    .w160 {
      width: 160px;
    }
    .w212 {
      width: 212px;
    }
    .w100 {
      width: 100px;
    }
    .w116 {
      width: 116px;
    }
    .mr-16 {
      margin-right: 16px;
    }
    .triple-select {
      display: inline-block;
      margin-right: 16px;
      &:last-child {
        margin-right: 0;
      }
      .el-input__inner {
        border-radius: 0;
      }
      .el-select {
        &:last-child .el-input__inner {
          border-right: 1px solid #d3d6e6;
          border-radius: 0px 4px 4px 0px;
        }

        &:first-child .el-input__inner {
          border-radius: 4px 0px 0px 4px;
        }
      }
      .el-date-editor {
        .el-range-input {
          width: 34%;
          height: 30px;
          line-height: 30px;
          position: relative;
          top: 0;
          font-size: 13px;
        }
      }
    }
    .paper-box-btns {
      position: relative;
      top: 3px;
    }
    .select-emp {
      position: relative;
      top: -1px;
    }
  }
}
</style>

<style lang="less">
  // 弹层
  .layer-commission {
    width: 460px;
    padding-bottom: 14px;
    .el-message-box__header {
      padding: 15px 24px;
      border-bottom: 1px solid #e8eaf6;
    }
    .el-message-box__title {
      font-size: 14px;
      color: #28304e;
      font-weight: bold;
    }
    .el-message-box__headerbtn {
      font-size: 18px;
      top: 50%;
      transform: translateY(-50%);
    }
    .layer-txt {
      padding: 55px 0;
      text-align: center;
      font-size: 14px;
      color: #28304e;
    }
    .el-message-box__btns {
      padding: 0 24px 0 0;
      .btn-sure {
        margin-left: 20px;
      }
    }
    .el-button {
      width: 80px;
      line-height: 36px;
      height: 36px;
      padding: 0;
      font-size: 16px;
    }
    .btn-close {
      background-color: #dddddd;
      color: #28304e;
    }

    &.layer-succes {
      .el-message-box__header {
        background-color: #fff;
      }
      .layer-succes-txt {
        padding-top: 14px;
        padding-bottom: 32px;
        .img {
          height: 98px;
          background: url("../assets/img/icon-commission-05.png") no-repeat
            center center;
        }
        .p {
          font-size: 14px;
          line-height: 22px;
          padding-top: 12px;
          color: #28304e;
          text-align: center;
        }
      }
    }
    &.layer-loading {
      .el-message-box__header {
        background-color: #fff;
      }
      .layer-loading-txt {
        padding-top: 30px;
        padding-bottom: 32px;
        .img {
          height: 60px;
          background: url("../assets/img/icon-commission-06.png") no-repeat
            center center;
          background-size: 66px;
          -webkit-animation: layerLoding 0.5s infinite linear;
        }
        .p {
          font-size: 14px;
          line-height: 22px;
          padding-top: 30px;
          color: #28304e;
          text-align: center;
        }
      }
      .el-message-box__headerbtn {
        font-size: 0;
      }
    }
    @-webkit-keyframes layerLoding {
      0% {
        transform: rotate(360deg);
      }
      100% {
        transform: rotate(0deg);
      }
    }
  }
</style>

