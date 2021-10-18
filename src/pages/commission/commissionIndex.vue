<template>
  <div class="app-bj">
    <!-- <el-col :span="2" class="el-col-left">
      <el-menu :default-active="this.$route.path" router mode="horizontal" class="nav-box" @open="handleOpen"
        @close="handleClose">
        <template v-for="(item, i) in commissionTabs">
          <el-menu-item :key="i" :index="item.path" v-if="item.code&&item.can">
            <template slot="title">
              <i :class="item.iconClass"></i>
              <span>{{ item.name }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-col> -->
    <!-- <p class="tag"></p> -->
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
    <router-view class="menu-right" />
  </div>
</template>

<script>
import router from "vue-router";
import { mapGetters } from "vuex";
export default {
  name: "commissionIndex",
  data() {
    return {
      commissionTabs: [],
      Index: [], //面包屑list
      back: false, //返回按钮是否显示
    };
  },
  mounted() {
    setTimeout(() => {
      let arr = [];
      let sliders = [];

      if (sessionStorage.getItem("userMsg")) {
        let userMsg = JSON.parse(sessionStorage.getItem("userMsg"));
        if (userMsg && userMsg.privileges) {
          // 导航权限判断
          let arr = userMsg.privileges || [];
          if (arr === []) {
            this.commissionTabs.push(this.$tool.pathCommission[0]);
          }
          this.$tool.pathCommission.forEach((item) => {
            if (arr.includes(item.code)) {
              sliders.push(item);
            }
          });
          this.commissionTabs = sliders;
        }
      } else {
        console.log("commissionIndex-else");
        this.$router.push({
          path: "/login",
        });
      }
    }, 200);
    this.Index = this.getPath;
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
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
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

<style lang="less" scoped>
@import "~@/assets/common.less";
.page-view-index {
  height: 40px;
  // margin-left: 192px;
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
.el-col-2 {
  width: 180px;
  .nav-box {
    padding: 0 4px;
    background-color: #fff;
  }
  .el-menu-item {
    width: 100%;
    line-height: 50px;
    height: 50px;
    padding: 0 8px;
    color: #303133;
    font-weight: bold;
    // margin: 18px 0 14px;
    border-bottom: 0;

    &.is-active {
      background-color: #ecf5ff;
      color: #669eff;
      // &:hover {
      //   background-color: #ecf5ff;
      // }
      // .icon-commission-01 {
      //   background-image: url("../../assets/img/icon-commission-01-on.png");
      // }
      // .icon-commission-02 {
      //   background-image: url("../../assets/img/icon-commission-02-on.png");
      // }
      // .icon-commission-03 {
      //   background-image: url("../../assets/img/icon-commission-03-on.png");
      // }
      // .icon-commission-04 {
      //   background-image: url("../../assets/img/icon-commission-04-on.png");
      // }
    }
    .icon-commission-01 {
      background-image: url("../../assets/img/icon-commission-01-on.png");
      background-size: 16px;
    }
    .icon-commission-02 {
      background-image: url("../../assets/img/icon-commission-02-on.png");
      background-size: 16px;
    }
    .icon-commission-03 {
      background-image: url("../../assets/img/icon-commission-03-on.png");
      background-size: 16px;
    }
    .icon-commission-04 {
      background-image: url("../../assets/img/icon-commission-04-on.png");
      background-size: 16px;
    }

    &:hover {
      background-color: #ecf5ff;
      // color: #fff;
      // .icon-commission-01 {
      //   background-image: url("../../assets/img/icon-commission-01-on.png");
      // }
      // .icon-commission-02 {
      //   background-image: url("../../assets/img/icon-commission-02-on.png");
      // }
      // .icon-commission-03 {
      //   background-image: url("../../assets/img/icon-commission-03-on.png");
      // }
      // .icon-commission-04 {
      //   background-image: url("../../assets/img/icon-commission-04-on.png");
      // }
    }
  }
}
.icon-commission {
  width: 25px;
  height: 100%;
  display: inline-block;
  background: no-repeat left center;
}
.icon-commission-01 {
  .icon-commission;
  background-image: url("../../assets/img/icon-commission-01.png");
}
.icon-commission-02 {
  .icon-commission;
  background-image: url("../../assets/img/icon-commission-02.png");
}
.icon-commission-03 {
  .icon-commission;
  background-image: url("../../assets/img/icon-commission-03.png");
}
.icon-commission-04 {
  .icon-commission;
  background-image: url("../../assets/img/icon-commission-04.png");
}
.menu-right {
  // padding-left: 192px;
}
.el-col-left {
  height: 100vh;
  background-color: #fff;
  .el-menu {
    border-bottom: 0;
  }
}
.app-bj::after {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: #f2f5f8;
  content: "";
  z-index: -1;
}
// .tag {
//     width: 20px;
//     background-color: red;
//     float: left;
//     height: 100vh;
//     z-index: 1000;
//     margin-left: 20px;
//     background-color: #f5f5f5;
// }

// 页面内容
/deep/.page-class {
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
      background-color: #66b1ff;
      color: #fff;
      margin-right: 10px;
    }
    .btn-orange-border {
      line-height: 34px;
      height: 34px;
      padding: 0 20px;
      background-color: #66b1ff;
      color: #fff;
      &:hover,
      &:focus {
        // background-color: #fff;
      }
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
      &:focus {
        // border-color: #ffa148;
      }
    }
    .el-range-editor.is-active {
      // border-color: #ffa148;
      &:hover {
        // border-color: #ffa148;
      }
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
      &.is-focus .el-input__inner {
        // border-color: #ffa148;
        // border-right: 1px solid #ffa148;
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
      // position: relative;
      // top: 1px;
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
      // top: 1px;
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
        // border-right: 0;
      }
      .el-select {
        &:last-child .el-input__inner {
          border-right: 1px solid #d3d6e6;
          border-radius: 0px 4px 4px 0px;
        }
        &:last-child .el-input.is-focus .el-input__inner {
          // border-right: 1px solid #ffa148;
        }

        &:first-child .el-input__inner {
          border-radius: 4px 0px 0px 4px;
        }
      }
      .el-date-editor {
        // &:last-child {
        //   // border-right: 1px solid #d3d6e6;
        //   border-radius: 0px 4px 4px 0px;
        // }
        // &:first-child {
        //   border-radius: 4px 0px 0px 4px;
        // }
        // &.is-active:last-child {
        //   // border-right: 1px solid #ffa148;
        // }
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
// /deep/.el-button--warning {
//   // background-color: #ffa148;
//   // border-color: #ffa148;
// }
</style>
<style lang="less">
// 弹层
.layer-commission {
  width: 460px;
  // border: 0;
  padding-bottom: 14px;
  .el-message-box__header {
    // background-color: #f0f3fa;
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
    &:hover {
      .el-message-box__close {
        // color: #ffa148;
      }
    }
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
  .btn-sure {
    // background-color: #ffa148 !important;
    // border-color: #ffa148 !important;
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
        background: url("../../assets/img/icon-commission-05.png") no-repeat
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
        background: url("../../assets/img/icon-commission-06.png") no-repeat
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

// .el-menu--horizontal > .el-menu-item.is-active {
//   border: 0 !important;
//   span {
//     // color: #fff !important;
//   }
// }
</style>
