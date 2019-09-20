<template>
  <div class="view-container">
    <addNewHouse v-if="contractType==='newHouse'"></addNewHouse>
    <addLongRent v-if="contractType==='longRent'"></addLongRent>
    <addFinancial v-if="contractType==='financial'"></addFinancial>
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
    }
  },
  created () {
    this.contractType=this.$route.query.type
  }
};
</script>
<style scoped>
</style>