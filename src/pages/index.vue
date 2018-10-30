<template>
  <div class="main">
    <div class="nav">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
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
      <!--<ul class="navbar">
        <li v-for="item in views" @click="linkTo(item)">{{item.name}}</li>
      </ul>-->
    </div>
    <router-view></router-view>
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
  .main {
    min-width: 1000px;
    .container {
      font-size: 40px;
    }
  }
</style>
