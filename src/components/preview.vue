<template>
    <div class="preview">
      <div class="view-container">
        <img ref="img" :src="imgSrc" :style="{width:getWidth,transform:getRotate}" alt="">
      </div>
      <p class="pagination page-prev" @click="chose('prev')"><img :src="getImg('btn-prev.png')" alt=""></p>
      <p class="pagination page-next" @click="chose('next')"><img :src="getImg('btn-next.png')" alt=""></p>
      <p class="tools btn-close" @click="chose('close')"><img :src="getImg('btn-close.png')" alt=""></p>
      <ul class="tools">
        <li @click="opera(1)"><i class="iconfont icon-yuanjiaojuxing"></i></li>
        <li @click="opera(2)"><i class="iconfont icon-tubiao-12"></i></li>
        <li @click="opera(3)"><i class="iconfont icon-icon-test3"></i></li>
        <li @click="opera(4)"><i class="iconfont icon-yuanjiaojuxing1"></i></li>
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
        activePage:0,
        imgWidth:100,
        initWidth:0,
        transform:0
      }
    },
    mounted(){
      if(this.getImages.length>0){
        this.imgSrc=this.getImages[this.activePage]
      }
      this.$nextTick(()=>{
        this.initWidth=this.$refs.img.offsetWidth
      })
    },
    methods:{
      getImg:function (src) {
        return require('@/assets/img/'+src)
      },
      chose:function (type) {
        if(type==='next'){
          if(this.activePage===this.getImages.length-1){
            this.activePage=0
          }else {
            this.activePage+=1
          }
        }else if(type==='prev') {
          if(this.activePage===0){
            this.activePage=this.getImages.length-1
          }else {
            this.activePage-=1
          }
        }else {
          this.$emit('close')
        }
      },
      opera:function (type) {
        switch (type){
          case 1:
            this.$emit('saveFile')
            break
          case 2:
            this.transform+=90
            break
          case 3:
            this.imgWidth+=50
            break
          case 4:
            this.imgWidth-=50
            break
        }
      }
    },
    computed:{
      getImages:function () {
        return [].concat(this.imgList)
      },
      getWidth:function () {
        if(this.imgWidth+50===this.initWidth){
          this.imgWidth+=50
        }else if(this.imgWidth>300+this.initWidth){
          this.imgWidth-=50
        }
        return `${this.imgWidth}%`
      },
      getRotate:function () {
        return `rotate(${this.transform}deg)`
      }
    },
    watch:{
      activePage:function (val) {
        this.imgSrc=this.getImages[this.activePage]
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
    /*width: 60%;*/
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
</style>
