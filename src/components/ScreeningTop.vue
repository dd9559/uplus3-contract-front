<template>
  <!-- 筛选 -->
  <div class="paper-box view-header" :class="[show?'collapse-on':'collapse-off']">
    <div class="paper-box-title">
      <p><i class="iconfont icon-tubiao-5 mr-10 font-cl1"></i>筛选查询</p>
      <p>
        <el-button
          class="paper-btn"
          size="medium"
          @click="resetFormFn"
          round>重 置
        </el-button>
        <el-button
          class="paper-btn paper-btn-blue"
          type="primary"
          size="medium"
          @click="queryFn"
          round>查 询
        </el-button>
      </p>
    </div>
    <!-- 筛选条件 -->
    <div class="paper-box-content" v-show="show">
      <slot></slot>
    </div>
    <div class="btn" @click="show=!show"></div>
  </div>
</template>

<script>
  export default {
    props: {
      min: {
        type: Number,
        default: 61
      }
    },
    data() {
      return {
        show: true
      }
    },
    methods: {
      // 点击查询
      queryFn() {
        this.$emit('propQueryFn')
      },
      // 点击重置
      resetFormFn() {
        this.$emit('propResetFormFn')
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/common.less";

  .font-cl1 {
    color: #55657A;
  }

  .mr-10 {
    margin-right: 10px;
  }

  .paper-box {
    background-color: @bg-white;
    position: relative;
    &:after {
      content: '';
      width: 100%;
      height: 20px;
      position: absolute;
      left: 0;
      right: 0;
      bottom: -20px;
      background-color: @bg-grey;
    }
    &.collapse-on{
      padding-bottom: 0;
    }
    &.collapse-off{
      /*padding: 10px 20px;*/
      .paper-box-title{
        margin-bottom: 0;
      }
    }
    &-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    &-content{

    }
    .btn {
      width: 50px;
      height: 12px;
      background-color: gray;
      position: absolute;
      bottom: -12px;
      left: 50%;
      margin-left: -25px;
      z-index: 9;
    }
  }
  .view-header {
    background-color: @color-white;
    padding: 10px 20px;
    border-radius: @border-radius;
    margin-bottom: 20px;
  }

  // 按钮
  .paper-btn {
    width: 100px;
    text-align: center;
  }

  .paper-btn-blue {
    background-color: @color-blue;
    border-color: @color-blue;
  }

</style>
