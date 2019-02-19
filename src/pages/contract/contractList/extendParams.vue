<template>
  <div class="view-container">
    <iframe src="../static/dealContract.html" frameborder="0" ref='iframeFirst' :style="{ height: clientHei }"></iframe>
  </div>
</template>
           
<script>
export default {
  data(){
    return{
      clientHei:''
    }
  },
  methods: {
    // 控制弹框body内容高度，超过显示滚动条
    clientHeight() {        
      this.clientHei= document.documentElement.clientHeight + 'px'
    },
  },
  mounted(){
    window.onresize = this.clientHeight;
  },
  beforeUpdate() {
    this.clientHeight();
  },
};
</script>
<style scoped lang="less">
.view-container{
  text-align: center;
  iframe{
    width: 870px;
  }
}
</style>