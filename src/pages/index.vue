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
          @select="handleSelect"
          text-color="#333333"
          active-text-color="#478DE3">
          <el-submenu :index="item.path" v-for="item in views" :key="item.id">
            <template slot="title">{{item.name}}</template>
            <el-menu-item :index="grade.path" v-for="grade in item.child" :key="grade.name">{{grade.name}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <router-view class="page-content"></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        activeIndex: 'setting',
        views:[
          {
            id:1,
            name:'合同',
            path:'1',
            child:[
              {
                name:'交易合同',
                path:'11'
              }
            ]
          },
          {
            id:2,
            name:'财务',
            path:'2',
            child:[
              {
                name:'应收实收',
                path:'21'
              },
              {
                name:'收付款单',
                path:'22'
              },
              {
                name:'票据管理',
                path:'23'
              },
              {
                name:'房款监管',
                path:'24'
              },
              {
                name:'加盟账务',
                path:'25'
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
                path:'31'
              },
              {
                name:'实收业绩',
                path:'32'
              },
              {
                name:'门店实收',
                path:'33'
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
                path:'41'
              },
              {
                name:'后期管理',
                path:'42'
              },
              {
                name:'后期监控',
                path:'43'
              }
            ]
          },
          {
            id:5,
            name:'设置',
            path:'setting',
            child:[
              {
                name:'合同模板设置',
                path:'contractTemplate'
              },
              {
                name:'后期流程设置',
                path:'postProcess'
              },
              {
                name:'公司账户设置',
                path:'company'
              },
              {
                name:'电子签章设置',
                path:'51'
              },
              {
                name:'款类设置',
                path:'52'
              },
              {
                name:'职务-权限设置',
                path:'53'
              },
              {
                name:'个人-权限设置',
                path:'54'
              }
            ]
          }
        ]
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        // debugger
        this.$router.push({
          path:key
        })
      },
      linkTo:function (item) {
        this.$router.push({
          path:item.path
        })
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
      .page-content{
        flex: 1;
        background-color: @bg-grey;
      }
    }
  }
</style>
