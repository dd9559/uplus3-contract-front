<template>
  <div class="view-container">
    1
  </div>
</template>

<script>
  export default {
    name: "contract-template",
    data(){
      return{

      }
    },
    created(){
      this.getList()
    },
    methods:{
      getList:function () {
        let param={
          cityId:2
        }
        this.$ajax.get('/api/setting/contractTemplate/list',param).then(res=>{
          debugger
        }).catch(error=>{
          debugger
        })
      }
    }
  }
</script>

<style scoped>

</style>
