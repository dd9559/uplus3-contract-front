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
          unique-opened="true"
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
                path:''
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
                path:''
              },
              {
                name:'收付款单',
                path:''
              },
              {
                name:'票据管理',
                path:''
              },
              {
                name:'房款监管',
                path:''
              },
              {
                name:'加盟账务',
                path:''
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
                path:''
              },
              {
                name:'实收业绩',
                path:''
              },
              {
                name:'门店实收',
                path:''
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
                path:''
              },
              {
                name:'后期管理',
                path:''
              },
              {
                name:'后期监控',
                path:''
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
                path:''
              },
              {
                name:'后期流程设置',
                path:''
              },
              {
                name:'公司账户设置',
                path:''
              },
              {
                name:'电子签章设置',
                path:''
              },
              {
                name:'款类设置',
                path:''
              },
              {
                name:'职务-权限设置',
                path:''
              },
              {
                name:'个人-权限设置',
                path:''
              }
            ]
          }
        ]
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        // debugger
        /*this.$router.push({
          path:`${keyPath.join('/')}`
        })*/
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
      .slider{
        width: 200px;
      }
      .page-content{
        flex: 1;
      }
    }
  }
</style>
