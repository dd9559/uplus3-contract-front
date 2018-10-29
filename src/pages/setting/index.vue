<template>
  <div class="view">
    <ul class="view-tabs">
      <li v-for="item in tabs" @click="linkTo(item)" :class="[item.path===activeItem?'active':'']">{{item.name}}</li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        tabs: [
          {
            id: 1,
            name: '合同模板设置',
            path: 'contractTemplate'
          },
          {
            id: 2,
            name: '后期流程设置',
            path: 'postProcess'
          },
          {
            id: 3,
            name: '公司设置',
            path: 'company'
          }
        ],
        activeItem:'contractTemplate'
      }
    },
    created(){
      this.activeItem=this.$route.path.split('setting/')[1]
    },
    methods: {
      linkTo: function (item) {
        this.activeItem = item.path
        this.$router.push({
          path: item.path
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";

  .view {
    &-tabs {
      height: 50px;
      padding: 0 30px;
      display: flex;
      align-items: center;
      background-color: @bg-grey;
      >li{
        margin-right: 30px;
        &.active{
          color: @color-blue;
        }
      }
    }
  }
</style>
