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
          <el-submenu :index="item.path" v-for="item in views" :key="item.id" v-if="item.child.length>0">
            <template slot="title">
              <i class="iconfont" :class="item.icon"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item :index="grade.path" v-for="grade in item.child" :key="grade.name">{{grade.name}}</el-menu-item>
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
  import { mapMutations,mapGetters } from 'vuex'

  const pathList= [
    {
      id: 1,
      name: '合同',
      path: '1',
      icon: 'icon-hetong',
      child: [
        {
          name: '合同列表',
          path: 'contractList',
          code: 'sign-ht-info-query'
        },
        {
          name: '调佣审核',
          path: 'adjustCheck',
          code: 'sign-ht-maid-query'
        },
        {
          name: '结算审核',
          path: 'settleCheck',
          code: 'sign-ht-js-query'
        },
        {
          name: '合同审核',
          path: 'contractCheck',
          code: 'sign-ht-htsh-query'
        },
        {
          name: '分账记录',
          path: 'routingRecord',
          code: 'sign-ht-fz-query'
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
          path: 'Bill',
          code: 'sign-cw-debt-query'
        },
        {
          name: '收款审核',
          path: 'moneyCheck?type=1',
          code: 'sign-cw-rev-query'
        },
        {
          name: '付款审核',
          path: 'moneyCheck?type=2',
          code: 'sign-cw-pay-query'
        },
        {
          name: '应收实收',
          path: 'actualHarvest',
          code: 'sign-cw-rec-query'
        },
        {
          name: '票据管理',
          path: 'paperSet',
          code: 'sign-cw-bill-query'
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
          path: 'actualAchievement',
          code: 'sign-yj-rev-query'
        },
        {
          name: '结算业绩',
          path: 'receivableAchievement',
          code: 'sign-yj-rec-query'
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
          path: 'postReceive',
          code: 'sign-qh-rev-query'
        },
        {
          name: '后期管理',
          path: 'postManage',
          code: 'sign-qh-mgr-query'
        },
        {
          name: '后期监控',
          path: 'postMonitor',
          code: 'sign-qh-cont-query'
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
          path: 'company',
          code: 'sign-set-gs'
        },
        {
          name: '合同模板设置',
          path: 'contractTemplate',
          code: 'sign-set-ht-query'
        },
        {
          name: '后期流程设置',
          path: 'postProcess',
          code: 'sign-set-hq'
        },
        {
          name: '款类设置',
          path: 'moneyType',
          code: 'sign-set-kl-query'
        },
        {
          name: '操作日志',
          path: 'operationLog',
          code: 'sign-set-log-query'
        },
        {
          name: '审核流程',
          path: 'approvalProcess',
          code: 'sign-set-verify'
        }
      ]
    }
  ]
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
                path: 'contractList',
                code: 'sign-ht-info-query'
              },
              {
                name: '调佣审核',
                path: 'adjustCheck',
                code: 'sign-ht-maid-query'
              },
              {
                name: '结算审核',
                path: 'settleCheck',
                code: 'sign-ht-js-query'
              },
              {
                name: '合同审核',
                path: 'contractCheck',
                code: 'sign-ht-htsh-query'
              },
              {
                name: '分账记录',
                path: 'routingRecord',
                code: 'sign-ht-fz-query'
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
                path: 'Bill',
                code: 'sign-cw-debt-query'
              },
              {
                name: '收款审核',
                path: 'moneyCheck?type=1',
                code: 'sign-cw-rev-query'
              },
              {
                name: '付款审核',
                path: 'moneyCheck?type=2',
                code: 'sign-cw-pay-query'
              },
              {
                name: '应收实收',
                path: 'actualHarvest',
                code: 'sign-cw-rec-query'
              },
              {
                name: '票据管理',
                path: 'paperSet',
                code: 'sign-cw-bill-query'
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
                path: 'actualAchievement',
                code: 'sign-yj-rev-query'
              },
              {
                name: '结算业绩',
                path: 'receivableAchievement',
                code: 'sign-yj-rec-query'
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
                path: 'postReceive',
                code: 'sign-qh-rev-query'
              },
              {
                name: '后期管理',
                path: 'postManage',
                code: 'sign-qh-mgr-query'
              },
              {
                name: '后期监控',
                path: 'postMonitor',
                code: 'sign-qh-cont-query'
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
                path: 'company',
                code: 'sign-set-gs'
              },
              {
                name: '合同模板设置',
                path: 'contractTemplate',
                code: 'sign-set-ht-query'
              },
              {
                name: '后期流程设置',
                path: 'postProcess',
                code: 'sign-set-hq'
              },
              {
                name: '款类设置',
                path: 'moneyType',
                code: 'sign-set-kl-query'
              },
              {
                name: '操作日志',
                path: 'operationLog',
                code: 'sign-set-log-query'
              },
              {
                name: '审核流程',
                path: 'approvalProcess',
                code: 'sign-set-verify'
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
      this.activeIndex = this.Index[1].path.split('/')[1]
      this.$ajax.get('/api/me').then(res=>{
        res=res.data
        if(res.status===200){
          // debugger
          let arr=res.data.privileges
          this.setUser(res.data)
          // console.log(this.$store.state.user.privileges)
          this.views.forEach((item,index)=>{
            let sliders=[]
            item.child.forEach(tip=>{
              if(arr.indexOf(tip.code)>-1){
                sliders.push(tip)
              }
            })
            item.child=sliders
          })
        }
      })
      /*this.$nextTick(()=>{
        let arr=this.$store.state.user&&this.$store.state.user.privileges
        // console.log(this.$store.state.user.privileges)
        this.views.forEach((item,index)=>{
          let sliders=[]
          if(item.name!=='财务'){
            item.child.forEach(tip=>{
              if(arr.indexOf(tip.code)>-1){
                sliders.push(tip)
              }
            })
            item.child=sliders
          }
        })
      })*/
    },
    beforeRouteUpdate(to,from,next){
      if(from.path==='/login'){
        this.views = pathList.map(item=>Object.assign({},item))
        this.$ajax.get('/api/me').then(res=>{
          res=res.data
          if(res.status===200){
            let arr=res.data.privileges
            this.setUser(res.data)
            // console.log(this.$store.state.user.privileges)
            this.views.forEach((item,index)=>{
              let sliders=[]
              if(item.name!=='财务'){
                item.child.forEach(tip=>{
                  if(arr.indexOf(tip.code)>-1){
                    sliders.push(tip)
                  }
                })
                item.child=sliders
              }
            })
            console.log(this.views)
          }
        })
      }
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
      toCollapse:function () {
        this.collapse=!this.collapse
        this.setCollapse(this.collapse)
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
        'setCollapse',
        'setUser'
      ])
    },
    ...mapGetters([
      'getPath',
      'getUser',
      'getLoading'
    ])
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
    text-align: center;
    margin-top: @margin-15;
  }
</style>

