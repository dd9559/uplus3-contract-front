<template>
    <div class="preview">
      <div class="view-container">

      </div>
      <p class="pagination page-prev"><i class="iconfont icon-xiangzuo"></i></p>
      <p class="pagination page-next"><i class="iconfont icon-xiangyou"></i></p>
      <p class="tools btn-close"><i class="iconfont icon-guanbi1"></i></p>
      <ul class="tools">
        <li><i class="iconfont"></i></li>
        <li><i class="iconfont"></i></li>
        <li><i class="iconfont"></i></li>
        <li><i class="iconfont"></i></li>
      </ul>
    </div>
</template>

<script>
  export default {
    name: "preview"
  }
</script>

<style scoped lang="less">
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
    .iconfont{
      font-size: 80px;
      background-color: #C9C9C9;
      border-radius: 50%;
      width: 80px;
      height: 80px;
      :after{

      }
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
    left: 260px;
  }
  .page-next{
    right: 260px;
  }
</style>
