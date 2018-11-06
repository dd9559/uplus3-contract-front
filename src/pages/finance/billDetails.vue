<template>
<div class="view">
  <div class="bill-details-tab">
    <ul>
      <li v-for="item in tabs" :key="item.index" :class="[activeItem===item.index?'active':'']" @click="choseTab(item)">{{item.name}}</li>
    </ul>
    <p>
      <el-button type="primary">审核</el-button>
    </p>
  </div>
</div>
</template>

<script>
  export default {
    name: "bill-details",
    data(){
      return{
        tabs:[
          {
            index:1,
            name:'收款信息'
          },
          {
            index:2,
            name:'变更记录'
          },
          {
            index:3,
            name:'审核信息'
          }
        ],
        activeItem:1
      }
    },
    methods:{
      choseTab:function (item) {
        this.activeItem=item.index
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  .view{
    padding: 0 20px;
    background-color: @bg-white;
  }
.bill-details-tab{
  position: relative;
  >ul{
    display: flex;
    >li{
      flex: 1;
      align-self: center;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 100px;
      &.active{
        color: @color-blue;
        position: relative;
        &:after{
          content:'';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          border-bottom: 4px solid @color-blue;
        }
      }
    }
  }
  >p{
    position: absolute;
    top: 50%;
    right: 0;
    transform:translateY(-50%);
  }
}
</style>
