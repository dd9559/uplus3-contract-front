<template>
<div class="login-container">
  <p>用户ID：<input type="number" v-model="userId"></p>
  <p @click="login">登录</p>
</div>
</template>

<script>
  export default {
    name: "login",
    data(){
      return{
        userId:''
      }
    },
    methods:{
      login:function () {
        this.$ajax.post('/api/verify',{empCode:this.userId}).then(res=>{
          this.$router.push({
            path:'contractList'
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
