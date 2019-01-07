<template>
    <el-popover
      @hide="checkInput"
      ref="popover"
      trigger="manual"
      placement="bottom"
      v-model="visible">
      <div class="select-tree">
        <el-tree accordion :data="dataList" :props="defaultProps" @node-click="depHandleClick"></el-tree>
      </div>
      <p class="tree-box" slot="reference" @click="opera('init',$event)" @mouseenter="showClear" @mouseleave="clearVal=false">
        <el-input size="small" class="w200" ref="btn" placeholder="请选择" v-model="inputVal" @clear="opera('clear',$event)" @input.native="getDep">
        </el-input>
        <span class="box-icon"><i class="iconfont el-select__caret el-icon-arrow-up" :class="[visible?'is-reverse':'']" v-if="!clearVal"></i><i class="iconfont icon-tubiao-7" v-else  @click.stop="opera('clear')"></i></span>
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
      },
      init:{
        type:String,
        default:''
      }
    },
    data(){
      return {
        inputVal:this.init,
        clearOper:false,
        visible:false,
        clearVal:false,
        iconUp:true,
        pop:true,//弹窗是否失焦
      }
    },
    watch:{
      init:function (val) {
        this.inputVal=val
        if(this.inputVal===''){
          this.getDep('',true)
        }
      }
    },
    methods:{
      showClear:function () {
        if(this.inputVal.length>0&&this.dataList.length>0){
          this.clearVal=true
        }
      },
      depHandleClick:function (data) {
        this.pop=false
        this.$refs.btn.focus()
        if(data.subs.length===0){
          // debugger
          this.$refs.popover.showPopper=false
        }
        this.inputVal=data.name
        this.$emit('checkCell',data)
      },
      popHide:function () {
        if(this.pop){
          this.visible=false
        }
      },
      opera:function (type,e) {
        // let e=event||window.event
        // console.log(e.currentTarget)
        // debugger
        if(type==='init'){
          this.visible=true
          this.$refs.popover.showPopper=true
          this.iconUp=!this.iconUp
        }else if(type==='clear') {
          this.visible=false
          this.$refs.popover.showPopper=false
          /*if(this.init.length>0){
          }else {
            this.inputVal=''
          }*/
          this.inputVal = ''
          this.$emit('clear')
        }
      },
      //部门搜索
      getDep:function (e,clear=false) {
        // console.log(e.target.value)
        if(!clear){
          this.inputVal=e.target.value
        }
        this.$ajax.get('/api/access/deps/tree',{keyword:this.inputVal}).then(res=>{
          res=res.data
          if(res.status===200){
            this.$emit('search',{list:res.data,depName:this.inputVal})
          }
        })
      },
      checkInput:function () {
        this.pop=true
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
