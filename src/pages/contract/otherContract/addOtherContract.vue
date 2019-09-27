<template>
  <div class="view-container">
    <component v-bind:is="contractType" v-if="contractType" :operationType="operationType" :contId="contId"></component>
    <!-- <addNewHouse v-if="contractType==='newHouse'"></addNewHouse>
    <addLongRent v-if="contractType==='longRent'"></addLongRent>
    <addFinancial v-if="contractType==='financial'"></addFinancial> -->
  </div>
</template>
           
<script>

import addNewHouse from "../otherContract/addModule/addNewHouse";
import addLongRent from "../otherContract/addModule/addLongRent";
import addFinancial from "../otherContract/addModule/addFinancial";

export default {
  components: {
    addNewHouse,
    addLongRent,
    addFinancial
  },
  data(){
    return{
      contractType:'',
       //操作类型  1 新增  2  编辑
      operationType:1,
      contId:0,
    }
  },
  created () {
    this.operationType=Number(this.$route.query.operationType)
    if(this.$route.query.id){
      this.contId=Number(this.$route.query.id)
    }
    if(this.$route.query.type==="newHouse"){
      this.contractType="addNewHouse"
    }else if(this.$route.query.type==="longRent"){
      this.contractType="addLongRent"
    }else{
      this.contractType="addFinancial"
    }
  }
};
</script>
<style scoped>
</style>