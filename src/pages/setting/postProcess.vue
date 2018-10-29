<template>
  <div class="view-container">
    <ul class="tabs">
      <li v-for="item in tabs" :class="[activeItem===item.id?'active':'']" @click="checkTab(item)">{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "post-process",
    data(){
      return{
        tabs:[
          {
            id:1,
            name:'交易步骤',
            url:'/flowmanage/selectTypeStepsList'
          },
          {
            id:2,
            name:'交易流程',
            url:'/flowmanage/selectFlowList'
          },
          {
            id:3,
            name:'合同资料库',
            url:'/flowmanage/selectDatabaseList'
          }
        ],
        activeItem:1
      }
    },
    methods:{
      checkTab:function (item) {
        this.activeItem = item.id
        this.getData(item.url)
      },
      getData:function (type) {
        this.$ajax.get(`/api${type}`,{cityId:1}).then(res=>{

        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
.tabs{
  display: flex;
  >li{
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    border: 1px solid @color-grey;
    &.active{
      background-color: @color-blue;
      color: @color-white;
    }
    &:nth-of-type(n+2){
      border-left: 0px;
    }
  }
}
</style>
