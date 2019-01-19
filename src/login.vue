<template>
<div class="login-container" v-if="show">
  <!--<p>用户ID：<input type="number" v-model="userId"></p>
  <p @click="login">登录</p>-->
</div>
</template>

<script>
  import {mapMutations} from 'vuex'
  export default {
    name: "login",
    data(){
      return{
        userId:'',
        code:{},
        show:false
      }
    },
    created(){
      let param=this.$route.query
      // this.setPath([])
      for (let item in param){
        if(item==='empcode'){
          param[item]=parseInt(param[item])
        }
      }
      this.code=Object.assign({},param)
      if(Object.keys(this.code).length===3){
        this.login('info')
      }else {
        this.show=true
      }
    },
    methods:{
      login:function (type) {
        let param={}
        if(type==='info'){
          param = this.code
        }else {
          param.empcode=this.userId
        }
        this.$ajax.post('/api/verify',param).then(res=>{
          res=res.data
          if(res.status===200){
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
          }
        })
      },
      ...mapMutations([
        'setPath'
      ])
    }
  }
</script>

<style scoped>

</style>
