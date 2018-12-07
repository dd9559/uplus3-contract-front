<template>
  <div class="main">
    <!--<div class="nav">
      <ul class="navbar">
        <li>退出</li>
      </ul>
    </div>-->
    <div class="container">
      <div class="slider">
        <el-menu
          :default-active="activeIndex"
          :unique-opened="true"
          class="el-menu-demo"
          :router="true"
          @select="handleSelect"
          text-color="#333333"
          active-text-color="#478DE3">
          <el-submenu :index="item.path" v-for="item in views" :key="item.id">
            <template slot="title">{{item.name}}</template>
            <el-menu-item :index="grade.path" v-for="grade in item.child" :key="grade.name">{{grade.name}}</el-menu-item>
          </el-submenu>
        </el-menu>
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
          <p class="operation">
            <el-button  type="text" @click="goBack" v-if="Index.length>2">返回</el-button>
          </p>
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
  import { mapMutations } from 'vuex'

  export default {
    name: "index",
    data() {
      return {
        activeIndex: '',
        views:this.$tool.routers,
        Index:[],
        back:false
      }
    },
    /*beforeRouteEnter(to,from,next){
      next(vm=>{
        let path=to.fullPath
        if(to.meta.getParent){
          path=localStorage.getItem('route')
          vm.back=true
        }else {
          vm.back=false
        }
        vm.views.forEach(item=>{
          item.child.forEach(tip=>{
            if(tip.path===path.split('/')[1]){
              vm.Index.push(item.name)
              vm.Index.push(tip.name)
            }else {
              return
            }
          })
        })
        vm.activeIndex = to.fullPath.split('/')[1]
      })
    },
    beforeRouteUpdate(to,from,next){
      console.log(this.Index)
      if(to.meta.getParent){
        this.back=true
      }else {
        this.back=false
      }
      this.activeIndex = to.fullPath.split('/')[1]
      next()
    },
    created(){

    },*/
    created(){
      this.Index=this.$store.state.path
      this.activeIndex = this.Index[1].path.split('/')[1]
    },
    beforeRouteUpdate(to,from,next){
      this.Index=this.$store.state.path
      this.activeIndex = this.Index[1].path.split('/')[1]
      next()
    },
    methods: {
      handleSelect(key, keyPath) {
        /*this.Index = []
        keyPath.forEach(item=>{
          var myRe = new RegExp(`"name":"([^"]*?)","path":"${item.replace('?','\\?')}"`)
          // console.log(myRe)
          var myArray = myRe.exec(JSON.stringify(this.views));
          // console.log(myArray)
          this.Index.push(myArray[1])
          this.setPath(this.Index)
        })*/
      },
      toLink:function (item,index) {
        if(index<2){
          this.$router.push({
            path:item.path
          })
        }
      },
      goBack:function () {
        // this.setPath(localStorage.getItem('router').split(',').substring(0,2))
        this.$router.go(-1)
      },
      ...mapMutations([
        'setPath',
        'sliderRouter'
      ])
    },
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  .main {
    min-width: 1000px;
    position: relative;
    height: 100%;
    .nav{
      height: 60px;
      background-color: @color-blue;
      color: @color-white;
      display: flex;
      align-items: center;
      position: relative;
      .navbar{
        position: absolute;
        top: 50%;
        right: 20px;
        transform:translateY(-50%);
      }
    }
    .container {
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      .slider{
        width: 160px;
        border-right: 1px solid @border-e6;
        /deep/ .el-menu{
          border: 0px;
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
          }
        }
        &-content{
          padding: 0px @margin-10;
          position: absolute;
          top: 40px;
          right: 0;
          bottom: 0;
          left: 0;
          overflow-y: auto;
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
          }
          .router-view{
            min-height: 100%;
            background-color: @bg-white;
          }
        }
      }
    }
  }
  /deep/ .pagination-info{
    text-align: center;
    margin-top: @margin-15;
  }
</style>

