<template>
  <div class="main">
    <div class="nav">
      <ul class="navbar">
        <li>退出</li>
      </ul>
    </div>
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
            <li v-for="(item,index) in Index" :key="index">{{item}}</li>
          </ul>
          <p class="operation">
            <el-button  type="text" @click="goBack">返回</el-button>
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

  export default {
    name: "index",
    data() {
      return {
        activeIndex: '',
        views:[
          {
            id:1,
            name:'合同',
            path:'1',
            child:[
              {
                name:'合同列表',
                path:'contractList'
              },
              {
                name:'调佣审核',
                path:'12'
              },
              {
                name:'结算审核',
                path:'13'
              },
            ]
          },
          {
            id:2,
            name:'财务',
            path:'2',
            child:[
              {
                name:'收付款单',
                path:'Bill'
              },
              {
                name:'收款审核',
                path:'moneyCheck?type=1'
              },
              {
                name:'付款审核',
                path:'moneyCheck?type=2'
              },
              {
                name:'应收实收',
                path:'actualHarvest'
              },
              {
                name:'票据管理',
                path:'paperSet'
              }
            ]
          },
          {
            id:3,
            name:'业绩',
            path:'3',
            child:[
              {
                name:'应收业绩',
                path:'actualAchievement'
              },
              {
                name:'实收业绩',
                path:'receivableAchievement'
              },
              {
                name:'门店实收',
                path:'storeReceive'
              }
            ]
          },
          {
            id:4,
            name:'签后',
            path:'4',
            child:[
              {
                name:'后期接收',
                path:'postReceive'
              },
              {
                name:'后期管理',
                path:'postManage'
              },
              {
                name:'后期监控',
                path:'postMonitor'
              }
            ]
          },
          {
            id:5,
            name:'设置',
            path:'setting',
            child:[
              {
                name:'公司设置',
                path:'company'
              },
              {
                name:'合同模板设置',
                path:'contractTemplate'
              },
              {
                name:'后期流程设置',
                path:'postProcess'
              },
              {
                name:'款类设置',
                path:'moneyType'
              },
              {
                name:'操作日志',
                path:'operationLog'
              }
            ]
          }
        ],
        Index:[]
      }
    },
    beforeRouteEnter(to,from,next){
      // debugger
      next(vm=>{
        vm.activeIndex = to.fullPath.split('/')[1]
      })
    },
    beforeRouteUpdate(to,from,next){
      this.activeIndex = to.fullPath.split('/')[1]
      next()
    },
    created(){

    },
    methods: {
      handleSelect(key, keyPath) {
        this.Index = []
        keyPath.forEach(item=>{
          var myRe = new RegExp(`"name":"([^"]*?)","path":"${item.replace('?','\\?')}"`)
          console.log(myRe)
          var myArray = myRe.exec(JSON.stringify(this.views));
          console.log(myArray)
          this.Index.push(myArray[1])
        })
      },
      goBack:function () {
        this.$router.go(-1)
      }
    }
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
      top: 60px;
      left: 0;
      right: 0;
      bottom: 0;
      .slider{
        min-width: 200px;
        max-width: 200px;
        border-right: 1px solid @border-e6;
        /deep/ .el-menu{
          border: 0px;
        }
      }
      .page-view{
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
          padding: 0px 20px;
          position: absolute;
          top: 40px;
          right: 0;
          bottom: 0;
          left: 0;
          overflow-y: auto;
          /deep/ .theader-bg{
            >th{
              background-color: @bg-th;
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
</style>

