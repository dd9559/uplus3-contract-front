<template>
  <!-- 筛选 -->
  <div class="paper-box view-header" :class="[show?'collapse-on':'collapse-off']" style="padding: 20px;">
    <div class="paper-box-title">
      <p class="f14"><i class="mr-10 iconfont icon-tubiao-5 font-cl1"></i>筛选查询</p>
      <p class="paper-box-btns">
        <el-button class="paper-btn btn-info paper-btn-blue" type="primary" size="small" @click="queryFn" round>查 询
        </el-button>
        <el-button class="paper-btn btn-info paper-btn-gray" size="small" @click="resetFormFn" round>重 置</el-button>
      </p>
    </div>
    <!-- 筛选条件 -->
    <!-- <div class="paper-box-content" ref="content"> -->
    <div class="paper-box-content">
      <slot></slot>
    </div>
    <div class="btn" @click="show=!show" v-if="ishidden">
      <i class="iconfont icon-zhankai"></i>
      <span style="left: 18px;top: -5px;font-size: 13px;">{{show?"收起":"展开"}}</span>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  props: {
    min: {
      type: Number,
      default: 57,
    },
    // height: {
    //   type: Number,
    //   default() {
    //     return 0
    //   }
    // }
  },
  data() {
    return {
      show: false,
      ishidden:false
    };
  },
  mounted(){
    let _this = this
    this.$nextTick(()=>{
      _this.ishidden = _this.getHidden()
      window.onresize = ()=>{
        //调用methods中的事件
        _this.ishidden = _this.getHidden()
      }
    })
  },
  methods: {
    // 点击查询
    queryFn() {
      this.$emit("propQueryFn");
    },
    // 点击重置
    resetFormFn() {
      this.$emit("propResetFormFn");
    },
    ...mapMutations(["bodyScollShowFn"]),
    getHidden(){
      let content = document.getElementsByClassName('paper-box-content')[0]
      if(content.scrollHeight>content.clientHeight+40){
        return true
      }else{
        return false
      }
    }
  },
  // computed: {
  //   isShowOpen() {
  //     if (this.height === 0) {
  //       return true
  //     } else {
  //       return this.height > this.min
  //     }
  //   }
  // },
  beforeUpdate() {
    this.bodyScollShowFn();
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/common.less";

.font-cl1 {
  color: #55657a;
}

.mr-10 {
  margin-right: 10px;
}

.paper-box {
  background-color: @bg-white;
  position: relative;

  &:after { 
    content: "";
    width: 100%;
    height: 15px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -15px;
    // background-color: @bg-grey;
  }
  &.collapse-on {
    // padding-bottom: 0;
    .paper-box-content {
      width: 85%;
    }
  }
  &.collapse-off {
    /*padding: 10px 20px;*/
    .paper-box-title {
      margin-bottom: 0;
    }
    .paper-box-content {
      max-height: 40px;
      overflow-y: hidden;
      width: 85%;
    }
  }
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  /deep/ .paper-box-content {
    margin-top: -8px;
    font-size: @size-14;
    .el-select {
      width: 140px;
    }
    .el-range-editor {
      width: 240px;
    }
  }
  .btn {
    i {
      font-size: 12px;
    }
    color: #6c7986;
    width: 100px;
    height: 17px;
    position: absolute;
    bottom: -17px;
    left: 50%;
    margin-left: -28px;
    z-index: 9;
    font-size: 10px;
    text-align: center;
    // background: url(.././assets/img/icon-dowm.png) no-repeat center right;
    background-size: 56px auto;
    background-color: white;
    cursor: pointer;
  }
}
.view-header {
  background-color: @color-white;
  padding: @margin-10;
  border-radius: @border-radius;
  margin-bottom: @margin-15;
}

// 按钮
.paper-btn {
  text-align: center;
  // border-radius: 4px;
  padding: 10px 15px;
}

.paper-btn-blue {
  background-color: #66b1ff;
  border-color: #fff;
  &:hover {
    // background-color: #66b1ff;
  }
}
.paper-btn-gray {
  background-color: #fff;
  border-color: #edeff5;
  color: #606266;
  &:hover {
    background-color: #edeff5;
    // color: #333;
  }
}
</style>
