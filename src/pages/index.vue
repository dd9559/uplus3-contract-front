<template>
  <div class="main">
    <!--<div class="nav">
      <ul class="navbar">
        <li>退出</li>
      </ul>
    </div>-->
    <div class="container">
      <div class="slider" :class="[collapse?'':'collapse-on']">
        <el-menu
          :default-active="activeIndex"
          :unique-opened="true"
          class="el-menu-demo"
          :router="true"
          :collapse="collapse"
          :collapse-transition="false"
          @select="handleSelect"
          text-color="#333333"
          active-text-color="#478DE3">
          <el-submenu :index="item.path" v-for="item in views" :key="item.id">
            <template slot="title">
              <i class="iconfont" :class="item.icon"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item :index="grade.path" v-for="grade in item.child" :key="grade.name">{{grade.name}}</el-menu-item>
          </el-submenu>
        </el-menu>
        <p class="slider-bar-control" @click="collapse=!collapse"></p>
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
          <p class="operation" @click="goBack" v-if="Index.length>2">
            <i class="iconfont icon-fanhui"></i>
            <span>返回</span>
          </p>
          <p style="position: absolute;top:50%;left:50%;transform:translate(-50%,-50%);cursor: pointer">
            <span @click="logout(1)">退出登录</span>
            <span @click="logout(2)">登录</span>
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
        views:[
          {
            id: 1,
            name: '合同',
            path: '1',
            icon: 'icon-hetong',
            child: [
              {
                name: '合同列表',
                path: 'contractList'
              },
              {
                name: '调佣审核',
                path: 'adjustCheck'
              },
              {
                name: '结算审核',
                path: 'settleCheck'
              },
              {
                name: '分账记录',
                path: 'routingRecord'
              },
            ]
          },
          {
            id: 2,
            name: '财务',
            path: '2',
            icon: 'icon-caiwu',
            child: [
              {
                name: '收付款单',
                path: 'Bill'
              },
              {
                name: '收款审核',
                path: 'moneyCheck?type=1'
              },
              {
                name: '付款审核',
                path: 'moneyCheck?type=2'
              },
              {
                name: '应收实收',
                path: 'actualHarvest'
              },
              {
                name: '票据管理',
                path: 'paperSet'
              }
            ]
          },
          {
            id: 3,
            name: '业绩',
            path: '3',
            icon: 'icon-yeji',
            child: [
              {
                name: '应收业绩',
                path: 'actualAchievement'
              },
              {
                name: '实收业绩',
                path: 'receivableAchievement'
              },
              // {
              //   name:'门店实收',
              //   path:'storeReceive'
              // }
            ]
          },
          {
            id: 4,
            name: '签后',
            path: '4',
            icon: 'icon-qianhou',
            child: [
              {
                name: '后期接收',
                path: 'postReceive'
              },
              {
                name: '后期管理',
                path: 'postManage'
              },
              {
                name: '后期监控',
                path: 'postMonitor'
              }
            ]
          },
          {
            id: 5,
            name: '设置',
            path: 'setting',
            icon: 'icon-shezhi',
            child: [
              {
                name: '公司设置',
                path: 'company'
              },
              {
                name: '合同模板设置',
                path: 'contractTemplate'
              },
              {
                name: '后期流程设置',
                path: 'postProcess'
              },
              {
                name: '款类设置',
                path: 'moneyType'
              },
              {
                name: '操作日志',
                path: 'operationLog'
              },
              {
                name: '审核流程',
                path: 'approvalProcess'
              }
            ]
          }
        ],
        Index:[],
        back:false,
        collapse:true
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
      // debugger
      this.activeIndex = this.Index[1].path.split('/')[1]
    },
    beforeRouteUpdate(to,from,next){
      this.Index=this.$store.state.path
      this.activeIndex = this.Index[1].path.split('/')[1]
      next()
    },
    methods: {
      logout:function (type) {
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
        'setPath'
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
        /*max-width: 160px;*/
        border-right: 1px solid @border-e6;
        position: relative;
        /deep/ .el-menu{
          border: 0px;
        }
        &.collapse-on{
          width:160px
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
          padding: 0px @margin-15;
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

