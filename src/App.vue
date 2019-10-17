<template>
  <div id="app">
    <router-view :key="$route.fullPath" v-if="$route.path==='/login'"/>
    <div class="main" v-else>
      <div class="nav">
        <img :src="getImg('logo.png')" alt="">
        <ul class="navbar" v-if="getUser&&getUser.user">
          <li>{{getUser.user.cityName}}</li>
          <li><span>{{getUser.user.depName}}-{{getUser.user.name}}</span></li>
        </ul>
      </div>
      <div class="container">
        <div class="slider" :class="[collapse?'':'collapse-on']">
          <el-menu
            ref="menu"
            :router="true"
            :unique-opened="true"
            :collapse-transition="false"
            :collapse="collapse"
            @select="handleSelect"
            class="el-menu-demo"
            text-color="#333333"
            active-text-color="#478DE3">
            <el-submenu :index="item.category" :class="[{'collapse-row':collapse}]" v-for="item in views" :key="item.id"
                        v-if="item.id!==6">
              <template slot="title">
                <i class="iconfont" :class="item.icon"></i>
                <span>{{item.name}}</span>
              </template>
              <template>
                <el-submenu :index="grade.category" v-for="grade in item.child" :key="grade.name"
                            class="second-grade-menu">
                  <template slot="title">{{grade.name}}</template>
                  <el-menu-item v-for="tip in grade.child" :key="tip.name" :index="tip.path">{{tip.name}}</el-menu-item>
                </el-submenu>
              </template>
            </el-submenu>
            <el-menu-item :index="views[5].category" class="navbar-item" :class="[{'collapse-row':collapse}]">
              <div class="el-submenu__title">
                <i class="iconfont" :class="views[5].icon"></i>
                <span>{{views[5].name}}</span>
              </div>
            </el-menu-item>
          </el-menu>
          <p class="slider-bar-control" @click="toCollapse"></p>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapMutations, mapGetters} from 'vuex'

  export default {
    name: "App",
    data() {
      return {
        activeIndex: '',
        views: this.$tool.pathList.map(item => Object.assign({}, item)),
        collapse: true,//menu是否折叠
        activeClass: [],//当前选择项的上级id
      }
    },
    created() {
      this.activeIndex = JSON.parse(localStorage.getItem('indexPath'))
    },
    methods: {
      getImg: function (url) {
        return require(`@/assets/img/${url}`)
      },
      /**
       * 选择侧边导航栏
       * @param key
       * @param keyPath
       */
      handleSelect(key, keyPath) {
        localStorage.setItem('indexPath', JSON.stringify(keyPath))
      },
      /**
       * 折叠侧边栏
       */
      toCollapse: function () {
        this.collapse = !this.collapse
        this.setCollapse(this.collapse)
      },
      ...mapMutations([
        'setPath',
        'setCollapse',
        'setUser'
      ])
    },
    computed: {
      ...mapGetters([
        'getUser'
      ])
    },
    watch: {
      getUser: function (val) {
        let arr = val.privileges
        this.views.forEach((item, index) => {
          let sliders = []
          if (item.id === 6) {
            let objType=Object.prototype.toString.call(item.code)
            if(objType==='[object Boolean]'){
              item.can = item.code
            }else {
              if (!arr.includes(item.code)) {
                item.can = false
              }
            }
          } else {
            item.child.forEach(tip => {
              tip.child.forEach(grade => {
                let objType=Object.prototype.toString.call(grade.code)
                if(objType==='[object Boolean]'){
                  tip.can = grade.code
                }else {
                  if (!arr.includes(grade.code)) {
                    tip.can = false
                  }
                }
              })
            })
          }
          // item.child=sliders
        })
      }
    }
  }
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
          color: #478DE3;
        }
        > span {
          color: #478DE3;
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
        color: #BBC1CD;
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
  .navbar-item{
    height: auto;
    position: relative;
    padding-left: 0 !important;
    &.collapse-row{
      padding: 30px 0 0;
      &:hover{
        background-color: white;
      }
    }
    .el-submenu__title{
      padding: 0 20px;
      >i{
        color: #BBC1CD !important;
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
              padding-left: 20px !important;
              background-color: @bg-grey;
            }
          }
          &-demo {
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
          }
        }
        &.collapse-on { /*菜单栏展开样式*/
          width: 160px;
          .el-submenu {
            &.second-grade-menu {
              background-color: @bg-th;
            }
            /deep/ .el-submenu__title {
              padding-left: 20px !important;
              > i {
                color: #BBC1CD;
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
</style>
<style lang="less">
  @import "~@/assets/common.less";

  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
  }

  /*本地打印票据iframe样式*/
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

  input, .el-input__inner {
    font-size: @size-base;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    &::-webkit-input-placeholder, &:-ms-input-placeholder {
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
      content: '*';
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

  .money-type-radio[role='radio'] {
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

  // 清除浮动
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

  // 左右浮动
  .f_l {
    float: left;
  }

  .f_r {
    float: right;
  }

  // 初始化 标题
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
    font-size: 14px
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

</style>
