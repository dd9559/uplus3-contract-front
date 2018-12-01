<template>
    <div class="preview">
      <div class="view-container">
        <img :src="imgSrc" alt="">
      </div>
      <p class="pagination page-prev"><img :src="getImg('btn-prev.png')" alt=""></p>
      <p class="pagination page-next"><img :src="getImg('btn-next.png')" alt=""></p>
      <p class="tools btn-close"><img :src="getImg('btn-close.png')" alt=""></p>
      <ul class="tools">
        <li><i class="iconfont icon-yuanjiaojuxing"></i></li>
        <li><i class="iconfont icon-tubiao-12"></i></li>
        <li><i class="iconfont icon-icon-test3"></i></li>
        <li><i class="iconfont icon-yuanjiaojuxing1"></i></li>
      </ul>
    </div>
</template>

<script>
  export default {
    name: "preview",
    props:{
      imgList:{
        type:Array,
        default:function () {
          return []
        }
      }
    },
    data(){
      return{
        imgSrc:'',
        activePage:0
      }
    },
    mounted(){
      if(this.getImages.length>0){
        this.imgSrc=this.getImages[0]
      }
    },
    methods:{
      getImg:function (src) {
        return require('@/assets/img/'+src)
      }
    },
    computed:{
      getImages:function () {
        return [].concat(this.imgList)
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
.preview{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background:rgba(0,0,0,0.6);
  z-index: 99;
}
  .pagination,.btn-close{
    position: absolute;
    img{
      width: 60%;
    }
  }
  .page-prev,.page-next{
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  .page-prev{
    left: 10%;
  }
  .page-next{
    right: 10%;
  }
  .btn-close{
    top: 50px;
    right: 10%;
  }
  ul.tools{
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform:translateX(-50%);
    display: flex;
    width:190px;
    background:rgba(0,0,0,0.6);
    border-radius:4px;
    >li{
      flex: 1;
      text-align: center;
      padding: @margin-10 0;
      color: @color-white;
    }
  }
  .view-container{
    max-width: 60%;
    background-color: @bg-white;
  }
</style>
