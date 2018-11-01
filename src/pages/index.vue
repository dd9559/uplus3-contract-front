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
          class="el-menu-demo"
          @select="handleSelect"
          text-color="#333333"
          active-text-color="#478DE3">
          <el-menu-item index="1">合同</el-menu-item>
          <el-submenu index="setting">
            <template slot="title">设置</template>
            <el-menu-item index="contractTemplate">合同模板设置</el-menu-item>
          </el-submenu>
          <el-submenu index="postSigning">
            <template slot="title">签后</template>
            <el-menu-item index="postReceive">后期接收</el-menu-item>
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
            name:'设置',
            path:'setting'
          },
          {
            id:2,
            name:'签后',
            path:'postSigning'
          }
        ]
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        // debugger
        this.$router.push({
          path:`${keyPath.join('/')}`
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
