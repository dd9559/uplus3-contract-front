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
        userId:'',
        code:''
      }
    },
    created(){
      this.code=this.$route.query.empcode?parseInt(this.$route.query.empcode):''
      if(this.code){
        this.login('info')
      }
    },
    methods:{
      login:function (type) {
        let param={}
        if(type==='info'){
          param.empCode = this.code
        }else {
          param.empCode=this.userId
        }
        this.$ajax.post('/api/verify',param).then(res=>{
          this.$ajax.get('/api/me',{time:new Date()}).then(res=>{
            res=res.data
            if(res.status===200){
              this.$store.commit('setUser',res.data)
              if(res.data.privileges.length>0){
                this.$router.push({
                  path:'contractList'
                })
              }else {
                this.$message({
                  message:'无任何权限'
                })
              }
            }
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
