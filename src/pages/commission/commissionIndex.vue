<template>
  <div class="app-bj">
    <el-col :span="2" class="el-col-left">
      <el-menu :default-active="this.$route.path" router mode="horizontal" class="nav-box" @open="handleOpen"
        @close="handleClose">
        <template v-for="(item, i) in commissionTabs">
          <el-menu-item :key="i" :index="item.path" v-if="item.code">
            <template slot="title">
              <i :class="item.iconClass"></i>
              <span>{{ item.label }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-col>
    <!-- <p class="tag"></p> -->
    <router-view class="menu-right" />
  </div>
</template>

<script>
export default {
  name: "commissionIndex",
  data() {
    return {
      commissionTabs: [
        {
          label: "提成计算",
          id: 1,
          path: "/commissionCounts",
          code: true,
          iconClass: "icon-commission-01",
        },
        {
          label: "提成发放",
          id: 2,
          path: "/commissionGrant",
          code: true,
          iconClass: "icon-commission-02",
        },
        {
          label: "提成设置",
          id: 3,
          path: "/commissionSetting",
          code: true,
          iconClass: "icon-commission-03",
        },
        // {
        //   label: "结算周期设置",
        //   id: 4,
        //   path: "/accountSetting",
        //   code: true,
        // },
        {
          label: "操作日志",
          id: 5,
          path: "/commissionOperationLog",
          code: true,
          iconClass: "icon-commission-04",
        },
      ],
    };
  },
  created() {
    console.log(this.$route.path);
    console.log(this.$store.state.user.privileges);

    let arr = this.$store.state.user.privileges;
    let views = this.$tool.pathList.map((item) => Object.assign({}, item));
    console.log(views)
    let sliders = [];

    views.forEach((item, index) => {
      //获取侧边栏信息中用户可访问的元素
      item.child.forEach((tip) => {
        tip.child.forEach((grade) => {
          if (arr.includes(grade.code)) {
            sliders.push(grade);
          }
        });
      });
    });
    console.log(sliders)
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style lang="less" scoped>
.el-col-2 {
  width: 180px;
  .nav-box {
    padding: 0 4px;
    background-color: #20272f;
  }
  .el-menu-item {
    width: 100%;
    line-height: 34px;
    height: 34px;
    padding: 0 8px;
    color: #9299a5;
    margin: 18px 0 14px;
    border-bottom: 0;

    &.is-active {
      background-color: rgba(173, 195, 220, 0.2);
      color: #fff;
      &:hover {
        background-color: rgba(173, 195, 220, 0.2);
      }
      .icon-commission-01 {
        background-image: url("../../assets/img/icon-commission-01-on.png");
      }
      .icon-commission-02 {
        background-image: url("../../assets/img/icon-commission-02-on.png");
      }
      .icon-commission-03 {
        background-image: url("../../assets/img/icon-commission-03-on.png");
      }
      .icon-commission-04 {
        background-image: url("../../assets/img/icon-commission-04-on.png");
      }
    }

    &:hover {
      background-color: #20272f;
      color: #fff;
      .icon-commission-01 {
        background-image: url("../../assets/img/icon-commission-01-on.png");
      }
      .icon-commission-02 {
        background-image: url("../../assets/img/icon-commission-02-on.png");
      }
      .icon-commission-03 {
        background-image: url("../../assets/img/icon-commission-03-on.png");
      }
      .icon-commission-04 {
        background-image: url("../../assets/img/icon-commission-04-on.png");
      }
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
  padding-left: 192px;
}
.el-col-left {
  height: 100vh;
  background-color: #20272f;
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
    padding: 18px 14px;
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
      background-color: #ffa148;
      color: #fff;
      border-color: #ffa148;
      margin-right: 10px;
    }
    .btn-orange-border {
      line-height: 34px;
      height: 34px;
      padding: 0 20px;
      border-color: #ffa148;
      color: #ffa148;
      &:hover,
      &:focus {
        background-color: #fff;
      }
    }
    .fr {
      float: right;
    }
  }

  /deep/.table-box {
    width: 100%;

    th {
      padding: 18px 0;
      background-color: #eff4f8;
      & > .cell {
        line-height: 28px;
        height: 28px;
        color: #28304e;
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

  /deep/.commission-top {
    .el-input__icon {
      line-height: 34px;
    }
    .el-input__inner {
      line-height: 34px;
      height: 34px;
      &:focus {
        border-color: #ffa148;
      }
    }
    .el-range-editor.is-active {
      border-color: #ffa148;
      &:hover {
        border-color: #ffa148;
      }
    }

    &.paper-box .paper-box-content {
      margin-top: -44px;
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
        border-color: #ffa148;
        border-right: 1px solid #ffa148;
      }
    }
    .select-tree {
      width: 200px;
      display: inline-block;
      position: relative;
      top: 13px;
      .el-input {
        margin-top: 0;
      }
    }

    .paper-box-title {
      padding-top: 12px;
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
      position: relative;
      top: 1px;
      margin-top: 12px;
    }
    .item-billing-date {
      display: inline-block;
      .el-input__inner {
        border-radius: 0 4px 4px 0;
      }
    }
    .item-billing-date2 {
      .item-billing-date;
      position: relative;
      padding: 0 10px;
      top: 1px;
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
      //   .el-input {
      //     margin-top: 0;
      //   }
      &:last-child {
        margin-right: 0;
      }
      .el-input__inner {
        border-radius: 0;
        border-right: 0;
      }
      .el-select {
        &:last-child .el-input__inner {
          border-right: 1px solid #d3d6e6;
          border-radius: 0px 4px 4px 0px;
        }
        &:last-child .el-input.is-focus .el-input__inner {
          border-right: 1px solid #ffa148;
        }

        &:first-child .el-input__inner {
          border-radius: 4px 0px 0px 4px;
        }
      }
      .el-date-editor {
        &:last-child {
          border-right: 1px solid #d3d6e6;
          border-radius: 0px 4px 4px 0px;
        }
        &:first-child {
          border-radius: 4px 0px 0px 4px;
        }
        &.is-active:last-child {
          border-right: 1px solid #ffa148;
        }
      }
    }
  }
}
</style>
<style lang="less">
// 弹层
.layer-commission {
  width: 460px;
  border: 0;
  padding-bottom: 14px;
  .el-message-box__header {
    background-color: #f0f3fa;
    padding: 15px 24px;
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
        color: #ffa148;
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
    background-color: #ffa148;
    border-color: #ffa148;
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
