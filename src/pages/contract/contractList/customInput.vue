<template>
  <div>
    <div class="input_">
      <input
      v-bind:value="value.value"
      v-on:input="$emit('input', $event.target.value)"
      @click="isShowUl"
      placeholder="请选择">
      <ul v-if="showUl">
        <li v-for="item in list" :key="item.id"  @click="selsctInput(item)">{{item.value}}</li>
        <li class="triangle"></li>
      </ul>
    </div>
   
  </div>
</template>
           
<script>
export default {
  props:['value'],
  data(){
    return {
      showUl:false,
      list:[{id:1,value:'全款'},{id:2,value:'全款2'},{id:3,value:'全款3'}]
    }
  },
  methods:{
    isShowUl(){
      this.showUl=!this.showUl
    },
    selsctInput(value){
      this.$emit('input', value);
      this.showUl=!this.showUl
    }
  }
};
</script>
<style scoped lang="less">
.input_{
  > input{
    height: 32px;
    width: 200px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    outline: 0;
    padding: 0 15px;
  }
  > ul{
    max-width: 200px;
    margin-top: 10px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    padding: 6px 0;
    position: relative;
    li{
      font-size: 14px;
      padding: 0 20px;
      color: #606266;
      height: 34px;
      line-height: 34px;
      &:hover{
        background-color: #f5f7fa;
      }
    }
    .triangle{
      height:0;
      width:0;
      padding: 0;
      position: absolute;
      top: -6px;
      left: 40px;
      border-right:solid 6px rgba(0,0,0,0);
      border-bottom:solid 6px #ebeef5;
      border-left:solid 6px rgba(0,0,0,0);
      &::after{
        content: '';
        height:0;
        width:0;
        position: absolute;
        top: 2px;
        left: -6px;
        border-right:solid 6px rgba(0,0,0,0);
        border-bottom:solid 6px #fff;
        border-left:solid 6px rgba(0,0,0,0);
      }
    }
  }
}

</style>