<template>
  <div id="app">
    <router-view :key="$route.fullPath"
      v-if="['/login','/ledger','/error','/choseCont','/accountSetting'].includes($route.path)">
    </router-view>
    <div class="main" v-else>
      <div class="nav">
        <img :src="getUser.brandPath+'?x-oss-process=style/b_w330_h330'" alt v-if="getUser && getUser.brandPath !== '-'" />
        <!-- <img :src="getUser.brandPath" alt v-else-if="isMingRui" /> -->
        <!-- <img src="./assets/img/logo.png" v-else /> -->
        <ul class="navbar" v-if="getUser && getUser.user">
          <li>{{ getUser.user.cityName }}</li>
          <li>
            <span>{{ getUser.user.depName }}-{{ getUser.user.name }}</span>
          </li>
        </ul>
      </div>
      <div class="container">
        <div class="slider" :class="[collapse ? '' : 'collapse-on']">
          <el-menu ref="menu" :router="true" :collapse-transition="false" :collapse="collapse" @open="openAllNav"
            @select="handleSelect" class="el-menu-demo" active-text-color="#409EFF">
            <el-submenu :index="item.category" :class="[{ 'collapse-row': collapse }]" v-for="item in views"
              :key="item.id" v-if="item.id !== 7 && item.id !== 8 && item.id !== 9  && item.can">
              <template slot="title">
                <i class="iconfont" :class="item.icon"></i>
                <span>{{ item.name }}</span>
              </template>
              <template>
                <el-submenu :index="grade.category" v-for="grade in item.child" :key="grade.name"
                  class="second-grade-menu" v-if="grade.can">
                  <template slot="title">
                    <i class="iconfont icon-icon-test2" v-if="!collapse"></i>
                    {{ grade.name }}
                  </template>
                  <el-menu-item v-for="tip in grade.child" :key="tip.name" :index="tip.path" v-if="tip.can">
                    {{ tip.name }}
                  </el-menu-item>
                </el-submenu>
              </template>
            </el-submenu>
            
            <el-menu-item :index="views[8].category" class="navbar-item" :class="[{ 'collapse-row': collapse }]"
              v-if="views[8].can">
              <div class="el-submenu__title">
                <i class="iconfont" :class="views[8].icon"></i>
                <span>{{ views[8].name }}</span>
              </div>
            </el-menu-item>
            <el-menu-item :index="views[6].category" class="navbar-item" :class="[{ 'collapse-row': collapse }]"
              v-if="views[6].can">
              <div class="el-submenu__title">
                <i class="iconfont" :class="views[6].icon"></i>
                <span>{{ views[6].name }}</span>
              </div>
            </el-menu-item>
            <el-menu-item :index="views[7].category" class="navbar-item" :class="[{ 'collapse-row': collapse }]"
              v-if="views[7].can">
              <div class="el-submenu__title">
                <i class="iconfont" :class="views[7].icon"></i>
                <span>{{ views[7].name }}</span>
              </div>
            </el-menu-item>
            
          </el-menu>
          <p class="slider-bar-control" @click="toCollapse"></p>
        </div>
        <router-view></router-view>
        <p style="
            flex: 1;
            align-self: center;
            font-size: 30px;
            text-align: center;
          " v-if="loadingState">
          loading...
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import { MIXINS } from "@/assets/js/mixins";
export default {
  name: "App",
  mixins: [MIXINS],
  data() {
    return {
      activeIndex: "",
      views: this.$tool.pathList.map((item) => Object.assign({}, item)),
      collapse: false, //menu????????????
      activeClass: [], //????????????????????????id
      testIndex: "",
      loadingState: true,
    };
  },
  created() {
    if (process.env.NODE_ENV === "development") {
      console.log("dev");

      //????????????,????????????????????????????????????
      let tempPrivileges = [
        // "sign-tcyw-tcjs-query", //??????
        // "sign-tcyw-tcjs-calc", //??????????????????
        // "sign-tcyw-tcjs-export", //??????
        // "sign-tcyw-tcff-query", //??????
        // "sign-tcyw-tcff-ff", //??????/????????????
        // "sign-tcyw-tcff-export", //??????
        // "sign-tcyw-set-query", //??????
        // "sign-tcyw-set-add", //??????
        // "sign-tcyw-log-query", //??????
      ];

      let userMsg = JSON.parse(sessionStorage.getItem("userMsg")); //??????????????????
      if (tempPrivileges && tempPrivileges.length > 0) {
        tempPrivileges.forEach((item) => {
          if (userMsg.privileges.includes(item)) {
            // userMsg.privileges.splice(userMsg.privileges.indexOf(item), 1); //??????
          } else {
            userMsg.privileges.push(item); //??????
          }
        });
        // this.$store.commit("setUser", userMsg);
      }
    } else {
      console.log("pro");
    }
  },
  methods: {
    toDetail(path) {
      let newPage = this.$router.resolve({
        path,
      });
      window.open(newPage.href, "_blank");
    },
    getImg: function (url) {
      return require(`@/assets/img/${url}`);
    },
    /**
     * ?????????????????????
     * @param key
     * @param keyPath
     */
    handleSelect(key, keyPath) {
      localStorage.setItem("indexPath", JSON.stringify(keyPath));
    },
    /**
     * ???????????????????????????????????????
     */
    openAllNav(key, path) {
      if (!key.includes("-")) {
        let regex = new RegExp(`^${key}`);
        let sub = [];
        for (let item in this.$refs.menu.submenus) {
          if (regex.test(item)) {
            sub.push(item);
          }
        }
        this.$refs.menu.openedMenus = [].concat(sub);
      }
    },
    /**
     * ???????????????
     */
    toCollapse: function () {
      this.collapse = !this.collapse;
      this.setCollapse(this.collapse);
    },
    ...mapMutations(["setPath", "setCollapse", "setUser"]),
  },
  computed: {
    ...mapGetters(["getUser"]),
  },
  watch: {
    getUser: {
      handler: function (val) {
        if (val) {
          let arr = val.privileges;
          console.log(this.views);
          this.views.forEach((item, index) => {
            let sliders = [];
            if (item.id === 7 || item.id === 8 || item.id === 9) {
              let objType = Object.prototype.toString.call(item.code);
              if (objType === "[object Boolean]") {
                // item.can = item.code
                this.$set(item, "can", item.code);
                let host = window.location.host;
                if (
                  item.id === 8 &&
                  ((["localhost:8080", "sign2.ujakn.com:28879"].includes(host) &&
                    (val.user.empId === 15349 || val.user.empId === 100778)) ||
                    (host === "sign2.ujakn.com" && val.user.empId === 37109))
                ) {
                  this.$set(item, "can", true);
                }
              } else {
                if (!arr.includes(item.code)) {
                  // item.can = false
                  this.$set(item, "can", false);
                }
              }
            } else {
              item.child.forEach((tip) => {
                tip.child.forEach((grade) => {
                  let objType = Object.prototype.toString.call(grade.code);
                  if (objType === "[object Array]") {
                    let joinCell = true; //?????????????????????????????????
                    if (grade.code.length > 0) {
                      joinCell = !grade.code.every((cell) => {
                        return !arr.includes(cell);
                      });
                    }
                    // grade.can = joinCell
                    this.$set(grade, "can", joinCell);
                  } else {
                    if (!arr.includes(grade.code)) {
                      // grade.can = false
                      this.$set(grade, "can", false);
                    }
                  }
                });
                //????????????????????????????????????????????????????????????????????????
                let status = tip.child.every((cell) => {
                  return cell.can === false;
                });
                // tip.can=!status
                this.$set(tip, "can", !status);
              });
            }
            //????????????????????????????????????????????????????????????????????????
            if (item.child.length > 0) {
              let status = item.child.every((cell) => {
                return cell.can === false;
              });
              // item.can=!status
              this.$set(item, "can", !status);
            }
            // item.child=sliders
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
<style lang="less" scoped>
@import "~@/assets/common.less";

/deep/ .collapse-row {
  &:first-of-type {
    padding-top: 20px;
  }

  padding-top: 30px;

  &.active {
    .el-submenu__title {
      > i {
        color: #478de3;
      }

      > span {
        color: #478de3;
      }
    }
  }

  .el-submenu__title {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    line-height: 1.4;
    height: auto;

    > i {
      color: #bbc1cd;

      &.iconfont {
        font-size: 22px;
      }
    }

    > span {
      width: auto !important;
      height: auto !important;
      overflow: auto !important;
      visibility: visible !important;
      font-size: 12px;
    }
  }
}
/deep/.el-menu-demo {
  .el-submenu {
    .el-submenu__title {
      font-weight: bold;
      &:hover {
        background-color: unset;
      }
    }
    &.second-grade-menu {
      margin-bottom: 2px;
      &:last-of-type {
        margin-bottom: 0;
      }
      .el-submenu__title {
        font-weight: unset;
        background-color: #f3f3f3;
        display: flex;
        align-items: center;
        > i.iconfont {
          font-size: @size-base !important;
          margin-right: 8px;
        }
      }
      .el-menu-item {
        padding-left: 40px !important;
        color: @color-6c;
      }
      .el-icon-arrow-down {
        &:before {
          content: "";
        }
      }
    }
    &.is-opened {
      background-color: #dbe9f9;
      &.second-grade-menu {
        .el-submenu__title {
          color: white !important;
          background-color: #468de3;
          > i.iconfont {
            color: white !important;
          }
        }
      }
    }
  }
}

.navbar-item {
  height: auto;
  position: relative;
  padding-left: 0 !important;

  &.collapse-row {
    padding: 30px 0 0;

    &:hover {
      background-color: white;
    }
  }

  .el-submenu__title {
    padding: 0 20px;
    font-weight: bold;

    > i {
      color: #bbc1cd !important;
    }
  }
}

.main {
  min-width: 1000px;
  position: relative;
  height: 100%;

  .nav {
    height: 40px;
    background-color: @color-blue;
    color: @color-white;
    display: flex;
    align-items: center;
    position: relative;

    > img {
      margin-left: @margin-15;
      width: 118px;
      height: 30px;
      vertical-align: middle;
    }

    .navbar {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      display: flex;

      > li {
        padding-right: @margin-15;

        &:last-of-type {
          padding: 0;
        }
      }
    }
  }

  .container {
    display: flex;
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;

    .slider {
      /*max-width: 160px;*/
      border-right: 1px solid @border-e6;
      position: relative;

      /deep/ .el-menu {
        border: 0px;

        .is-opened {
          .el-menu-item {
            /*padding-left: 20px !important;*/
          }
        }

        &-demo {
          height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
        }

        .link {
          display: block;
          color: #6c7986;
          text-decoration: none;
        }
      }

      &.collapse-on {
        /*?????????????????????*/
        width: 160px;

        .el-submenu {
          &.second-grade-menu {
            background-color: @bg-th;
          }

          /deep/ .el-submenu__title {
            padding-left: 20px !important;

            > i {
              color: #bbc1cd;
              font-size: 16px;
            }
          }
        }
      }

      &-bar-control {
        width: 56px;
        height: 17px;
        position: absolute;
        right: -36px;
        top: 50%;
        transform: translateY(-50%) rotate(270deg);
        margin-left: -28px;
        z-index: 9;
        background: url(./assets/img/icon-dowm.png) no-repeat center center;
        background-size: 56px auto;
        cursor: pointer;
      }
    }
  }
}
span.link {
  color: #303133 !important;
  display: block !important;
}
</style>
<style lang="less">
@import "~@/assets/common.less";
.dialog-del {
  .del-btn-bg {
    background-color: #38bd8b !important;
    color: #ffffff;
    &:hover {
      background-color: #ffffff !important;
    }
  }
  .el-button:hover {
    background-color: inherit;
    color: #38bd8b;
  }
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}

/*??????????????????iframe??????*/
#printf {
  width: 100px;
  height: 100px;
  position: fixed;
  top: -100px;
  left: -100px;
  visibility: hidden;
}

html,
body {
  margin: 0;
  padding: 0;
  /*user-select: none;*/
  width: 100%;
  height: 100%;
  font-size: @size-base;
}

input,
.el-input__inner {
  font-size: @size-base;
  font-family: "Avenir", Helvetica, Arial, sans-serif;

  &::-webkit-input-placeholder,
  &:-ms-input-placeholder {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    font-size: @size-base;
    color: @color-C8;
  }

  &:-ms-input-placeholder {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    font-size: @size-base;
    color: @color-C8;
  }

  &::-moz-placeholder {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    font-size: @size-base;
    color: @color-C8;
  }
}

h1,
h2,
h3,
h4 {
  margin: 0;
  padding: 0;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

p {
  margin: 0;
  padding: 0;
}

.scroll-hidden {
  > textarea {
    overflow-y: hidden;
  }
}

input.no-style {
  border: 0px;
  outline: none;
  display: inline-block;
  width: 100%;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}

.el-dialog__header {
  border: 1px solid #e8eaf6 !important;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  > label {
    &:first-of-type {
      min-width: 80px;
    }

    &.no-width {
      min-width: initial;
      margin-right: @margin-10;
    }
  }
}

.margin-left-10 {
  margin-left: 10px;
}

.time-picker {
  display: flex;
  align-items: center;
}

.form-label {
  position: relative;

  &:before {
    content: "*";
    display: inline-block;
    color: red;
  }
}

.el-select-dropdown {
  .drop-tree {
    &.el-select-dropdown__item {
      height: auto;
    }
  }
}

/*.el-dialog{
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    margin: 0 !important;
  }*/
.el-dialog {
  .el-dialog__body {
    padding: 0 @margin-10;
  }
}

.money-type-radio[role="radio"] {
  display: flex;

  > span {
    &:last-of-type {
      white-space: normal;
    }
  }
}

.three-row {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  /*!autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  line-height: 1.5;
  height: 54px;
  position: relative;
}

.one-row {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// ????????????
.clearfix:after {
  content: " ";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.clearfix {
  display: inline-block;
}

.el-popover {
  word-break: break-all;
}

// ????????????
.f_l {
  float: left;
}

.f_r {
  float: right;
}

// ????????? ??????
h1,
h2,
h3,
h4,
h5,
h6,
em,
i,
select,
option,
input,
textarea {
  font-style: normal;
  font-weight: 400;
  outline: none;
}

.f14 {
  font-size: 14px;
}

.w140 {
  width: 140px !important;
}

.w200 {
  width: 200px !important;
}

.w240 {
  width: 240px !important;
}

.w300 {
  width: 300px !important;
}

.w394 {
  width: 394px !important;
}

.w400 {
  width: 400px !important;
}

.w410 {
  width: 410px !important;
}

.w430 {
  width: 430px !important;
}

.btn-info {
  min-width: 80px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.margin-bottom-base {
  margin-bottom: @margin-base;
}

.margin-left {
  margin-left: @margin-10;
}

.margin-right {
  margin-right: @margin-10;
}

.wordp {
  word-wrap: break-word;
  word-break: normal;
}
.zhuanjie {
  width: 30px;
  height: 20px;
  border-radius: 10px;
  border: 1px solid #478de3;
  padding: 0 5px;
  color: #478de3;
  box-sizing: border-box;
}
</style>
