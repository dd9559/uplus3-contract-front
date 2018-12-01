<template>
    <i class="iconfont" :style="getFontSize" :class="[type==='.png'||type==='.jpg'||type==='.jpeg'?'icon-tupian':'',type==='.mp3'?'icon-yinpin1':'',type==='.mp4'||type==='.avi'?'icon-shipin1':'',type==='.txt'||type==='.pdf'||type==='.xlsx'||type==='.doc'?'icon-wendang':'',type==='.zip'?'icon-yasuobao1':'',!otherFile?'icon-qita1':'']"></i>
</template>

<script>
  export default {
    name: "upload-cell",
    props:{
      type:{
        type:String,
        default:'.png'
      },
      size:{
        type:Number,
        default:60
      }
    },
    data(){
      return{
        typeList:['.png','.jpg','.jpeg','.mp3','.mp4','.avi','.txt','.pdf','.xlsx','.docx','.zip']
      }
    },
    computed:{
      otherFile:function () {
        return this.typeList.indexOf(this.type)>-1
      },
      getFontSize:function () {
        return {
          fontSize:`${this.size}px`
        }
      }
    }
  }
</script>

<style scoped lang="less">
@import "~@/assets/common.less";
  .icon-tupian{
    color: @color-png;
  }
  .icon-yinpin1{
    color:@color-mp3;
  }
  .icon-shipin1{
    color: @color-mp4;
  }
  .icon-wendang{
    color: @color-doc;
  }
  .icon-yasuobao1{
    color: @color-zip;
  }
  .icon-qita1{
    color: @color-other;
  }
</style>
