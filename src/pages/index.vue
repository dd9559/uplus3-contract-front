<template>
  <div class="main">
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
          <el-submenu :index="item.category" :class="[{'collapse-row':collapse}]" v-for="item in views" :key="item.id">
            <template slot="title">
              <i class="iconfont" :class="item.icon"></i>
              <span>{{item.name}}</span>
            </template>
            <template v-if="item.id!==6">
              <el-submenu :index="grade.category" v-for="grade in item.child" :key="grade.name" class="second-grade-menu">
                <template slot="title">{{grade.name}}</template>
                <el-menu-item v-for="tip in grade.child" :index="tip.path">{{tip.name}}</el-menu-item>
              </el-submenu>
            </template>
            <el-menu-item v-for="grade in item.child" :index="grade.path" v-else>{{grade.name}}</el-menu-item>
          </el-submenu>
        </el-menu>
        <p class="slider-bar-control" @click="toCollapse"></p>
        <!--<ul>
          <li v-for="item in views">
            <span>{{item.name}}</span>
            <ul>
              <li v-for="grade in item.child" @click="handleSelect(grade)">{{grade.name}}</li>
            </ul>
          </li>
        </ul>-->
      </div>
      <div class="page-view">
        <div class="page-view-index">
          <ul>
            <li v-for="(item,index) in Index" :key="index" @click="toLink(item,index)">{{item.name}}</li>
          </ul>
          <p class="operation" @click="goBack" v-if="Index.length>2&&$route.path!=='/routingRemitDetail' && $route.path!=='/storeReceive' && $route.path!=='/detailIntention'&& $route.path!=='/contractDetails'">
            <i class="iconfont icon-fanhui"></i>
            <span>返回</span>
          </p>
          <!--<p style="position: absolute;top:50%;left:50%;transform:translate(-50%,-50%);cursor: pointer">
            <span @click="logout(1)">退出登录</span>
            <span @click="logout(2)">登录</span>
          </p>-->
        </div>
        <div class="page-view-content">
          <router-view class="router-view"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import index from "../router";
  import { mapMutations,mapGetters } from 'vuex'

  export default {
    name: "index",
    data() {
      return {
        activeIndex: '',
        views:this.$tool.pathList.map(item=>Object.assign({},item)),
        Index:[],//面包屑list
        back:false,
        collapse:true,//menu是否折叠
        activeClass:[],//当前选择项的上级id
      }
    },
    created(){
      this.Index=this.getPath
      this.activeIndex = JSON.parse(localStorage.getItem('indexPath'))
      /*let arr=this.getUser?this.getUser.privileges:[]
      this.views.forEach((item,index)=>{
        let sliders=[]
        item.child.forEach(tip=>{
          if(!tip['child']){
            if(!arr.includes(tip.code)){
              tip.can=false
            }
          }else {
            tip.child.forEach(grade=>{
              if(!arr.includes(grade.code)){
                tip.can=false
              }
            })
          }
        })
        // item.child=sliders
      })*/
    },
    mounted(){
      this.$nextTick(()=>{
        // this.$refs.menu.open(this.activeIndex.slice(-2)[0])
      })
    },
    /*beforeRouteEnter(to,from,next){
      next(vm=>{
        if(to.path==='/login'){
          vm.Index=[]
        }
      })
    },
    beforeRouteUpdate(to,from,next){
      if(to.path!=='/login'){
        let arr=this.getUser.privileges
        this.views=this.$tool.pathList.map(item=>Object.assign({},item))

        this.views.forEach((item,index)=>{
          let sliders=[]
          item.child.forEach(tip=>{
            if(arr.indexOf(tip.code)>-1){
              sliders.push(tip)
            }
          })
          item.child=sliders
        })
        this.Index=this.getPath
        this.activeIndex = this.Index[1].path.split('/')[1]
      }else {
        let arr=[]
        this.views=this.$tool.pathList.map(item=>Object.assign({},item))

        this.views.forEach((item,index)=>{
          let sliders=[]
          item.child.forEach(tip=>{
            if(arr.indexOf(tip.code)>-1){
              sliders.push(tip)
            }
          })
          item.child=sliders
        })
        this.Index=[]
        // this.activeIndex = this.Index[1].path.split('/')[1]
      }
      next()
    },*/
    methods: {
      getImg:function (url) {
        return require(`@/assets/img/${url}`)
      },
      logout:function (type) {
        // console.log(this.getUser)
        if(type===1){
          this.$ajax.post('/api/logout').then(res=>{
            this.$router.push({
              path:'login'
            })
          })
        }else {
          this.logout(1)
          this.$router.push({
            path:'login'
          })
        }
      },
      handleSelect(key, keyPath) {
        localStorage.setItem('indexPath',JSON.stringify(keyPath))
      },
      toCollapse:function () {
        this.collapse=!this.collapse
        this.setCollapse(this.collapse)
      },
      toLink:function (item,index) {
        if(index<2){
          if(item.path.includes('/storeReceive')){//业绩报表特殊路由处理
            item.path=item.path.split('?')[0]
          }
          this.$router.push({
            path:item.path
          })
        }
      },
      goBack:function () {
        // this.setPath(localStorage.getItem('router').split(',').substring(0,2))
        if(this.$route.path==="/extendParams"){
          let backMsg = {
            type:2
          }
          localStorage.setItem("backMsg", JSON.stringify(backMsg));
        }
        this.$router.go(-1)
      },
      ...mapMutations([
        'setPath',
        'setCollapse',
        'setUser'
      ])
    },
    computed:{
      ...mapGetters([
        'getPath',
        'getUser',
        'getLoading'
      ])
    },
    watch:{
      getUser:function (val) {
        let arr=val.privileges
        this.views.forEach((item,index)=>{
          let sliders=[]
          item.child.forEach(tip=>{
            if(!tip['child']){
              if(!arr.includes(tip.code)){
                tip.can=false
              }
            }else {
              tip.child.forEach(grade=>{
                if(!arr.includes(grade.code)){
                  tip.can=false
                }
              })
            }
          })
          // item.child=sliders
        })
      },
      getPath:function(val){
        this.Index=val
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  /deep/ .collapse-row{
    &:first-of-type{
      padding-top: 20px;
    }
    padding-top: 30px;
    &.active{
      .el-submenu__title{
        >i{
          color: #478DE3;
        }
        >span{
          color: #478DE3;
        }
      }
    }
    .el-submenu__title{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      line-height: 1.4;
      height: auto;
      >i{
        color: #BBC1CD;
        &.iconfont{
          font-size: 22px;
        }
      }
      >span{
        width: auto !important;
        height: auto !important;
        overflow: auto !important;
        visibility: visible !important;
        font-size: 12px;
      }
    }
  }
  .main {
    min-width: 1000px;
    position: relative;
    height: 100%;
    .nav{
      height: 40px;
      background-color: @color-blue;
      color: @color-white;
      display: flex;
      align-items: center;
      position: relative;
      >img{
        margin-left: @margin-15;
      }
      .navbar{
        position: absolute;
        top: 50%;
        right: 20px;
        transform:translateY(-50%);
        display: flex;
        >li{
          padding-right: @margin-15;
          &:last-of-type{
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
      .slider{
        /*max-width: 160px;*/
        border-right: 1px solid @border-e6;
        position: relative;
        /deep/ .el-menu{
          border: 0px;
          &-item{
            padding-left: 20px !important;
          }
          &-demo{
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
          }
        }
        &.collapse-on{/*菜单栏展开样式*/
          width:160px;
           .el-submenu{
             &.second-grade-menu{
               background-color: @color-E9;
             }
             /deep/.el-submenu__title{
               padding-left: 20px !important;
               >i{
                 color: #BBC1CD;
                 font-size: 16px;
               }
            }
          }
        }
        &-bar-control{
          width: 56px;
          height: 17px;
          position: absolute;
          right: -36px;
          top: 50%;
          transform: translateY(-50%) rotate(270deg);
          margin-left: -28px;
          z-index: 9;
          background: url(.././assets/img/icon-dowm.png) no-repeat center center;
          background-size: 56px auto;
          cursor: pointer;
        }
      }
      /deep/ .page-view{
        flex: 1;
        overflow-x: auto;
        position: relative;
        background-color: @bg-grey;
        &-index{
          height: 40px;
          margin: 0 20px;
          position: relative;
          >ul{
            height: 100%;
            display: flex;
            align-items: center;
            >li{
              position: relative;
              margin-right: 10px;
              color: @color-99A;
              cursor: pointer;
              &:after{
                content:'>';
                margin-left: 10px;
                /*width: 40px;
                height: 40px;*/
              }
              &:last-of-type{
                color: @color-324;
                &:after{
                  content:'';
                  margin: 0;
                }
              }
            }
          }
          .operation{
            position: absolute;
            top: 50%;
            right: 0;
            transform:translateY(-50%);
            display: flex;
            align-items: center;
            background-color: @bg-white;
            padding: @margin-base @margin-base @margin-base 0;
            border-radius: 4px;
          }
        }
        &-content{
          // padding: 0px @margin-15;
          position: absolute;
          top: 40px;
          right: @margin-15;
          bottom: 0;
          left: @margin-15;
          // overflow-y: auto;
          &::before{
              content: '';
              position: absolute;
              left: 0;
              top:0;
              bottom: 0;
              right: 0;
              background-color:  @bg-white;
            }
          .theader-bg{
            >th{
              background-color: @bg-th;
              >.cell{
                white-space: nowrap;
              }
            }
          }
          .el-table{
            font-size: @size-base;
            th,td{
              padding: @margin-base 0;
              >.cell{
                // white-space: nowrap;
                .span-cursor{
                  color: @color-blue;
                  cursor: pointer;
                }
              }
            }
            .el-table__body-wrapper{
              /*overflow-y: scroll;*/
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
          .router-view{
            // min-height: 100%;
            background-color: @bg-white;
            position: relative;
            // z-index: 1;
          }
        }
      }
    }
  }
  /deep/ .pagination-info{
    text-align: right;
  }
  /deep/ .el-table__empty-block {
    line-height: 60px;
  }
  /deep/ .el-dialog__headerbtn {
      top: 16px;
      .el-dialog__close{
          font-size: 24px;
          color: #32485F;
      }
  }
</style>

