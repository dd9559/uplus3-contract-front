<template>
    <el-popover
      @show="show"
      ref="popover"
      placement="bottom"
      v-model="visible">
      <div class="select-tree">
        <el-tree accordion :data="dataList" :props="defaultProps" @node-click="depHandleClick"></el-tree>
      </div>
      <p class="tree-box" slot="reference" @click="opera('init')" @mouseenter="test" @mouseleave="clearVal=false">
        <el-input size="small" class="w200" :clearable="clearVal" ref="btn" readOnly placeholder="请选择" v-model="inputVal" @clear="opera('clear')">
        </el-input>
        <span class="box-icon"><i class="iconfont el-select__caret el-icon-arrow-up" :class="[visible?'is-reverse':'']" v-if="!clearVal"></i></span>
      </p>
    </el-popover>
</template>

<script>
  export default {
    name: "select-tree",
    props:{
      data:{
        type:Array,
        default(){
          return []
        }
      },
      defaultProps:{
        type:Object,
        default(){
          return {
            children: 'subs',
            label: 'name'
          }
        }
      }
    },
    data(){
      return {
        inputVal:'',
        clearOper:false,
        visible:false,
        clearVal:false,
        iconUp:true,
      }
    },
    mounted(){
      /*this.$nextTick(()=>{
        this.getInput.onMouseenter=function () {
          console.log('test')
        }
      })*/
    },
    methods:{
      test:function () {
        if(this.inputVal.length>0){
          this.clearVal=true
        }
      },
      depHandleClick:function (data) {
        this.$refs.btn.focus()
        if(data.subs.length===0){
          // debugger
          this.$refs.popover.showPopper=false
        }
        this.inputVal=data.name
        this.$emit('checkCell',data)
      },
      opera:function (type) {
        let e=event||window.event
        console.log(e.currentTarget)
        // debugger
        if(type==='init'){
          this.visible=true
          this.$refs.popover.showPopper=true
          this.iconUp=!this.iconUp
        }else if(type==='clear') {
          this.inputVal=''
          this.visible=false
          this.$refs.popover.showPopper=false
          this.$emit('clear')
        }
      },
      show:function () {
        /*if(this.clearOper){
          console.log('test')
          this.$refs.popover.showPopper=false
          return
        }*/
      }
    },
    computed:{
      dataList:function () {
        return this.data
      },
      getInput:function () {
        return this.$refs.reference
      }
    },
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  .tree-box{
    position: relative;
    .box-icon{
      position: absolute;
      top: 50%;
      right: 10px;
      transform:translateY(-50%);
      >i{
        color: #c0c4cc;
        &.el-select__caret{
          color: #c0c4cc;
          font-size: 14px;
          -webkit-transition: -webkit-transform .3s;
          transition: -webkit-transform .3s;
          transition: transform .3s;
          transition: transform .3s, -webkit-transform .3s;
          transition: transform .3s,-webkit-transform .3s;
          -webkit-transform: rotateZ(180deg);
          transform: rotateZ(180deg);
          cursor: pointer;
        }
        &.is-reverse{
          -webkit-transform: rotateZ(0);
          transform: rotateZ(0);
        }
      }
    }
  }
  .select-tree {
    width: 100%;
    max-height: 300px;
    overflow: hidden;
    .el-tree {
      margin-right: -17px; /*滚动条的宽度17px*/
      max-height: 300px;
      overflow-y: scroll;
    }
  }
</style>
