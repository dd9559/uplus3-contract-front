<template>
  <el-popover
    @show="show"
    ref="popover"
    placement="bottom"
    trigger="focus">
    <div class="select-tree">
      <el-tree accordion :data="dataList" :props="defaultProps" @node-click="depHandleClick"></el-tree>
    </div>
    <el-input size="small" class="w200" ref="btn" slot="reference" :clearable="true" readOnly placeholder="请选择" v-model="inputVal" @focus="opera('init')" @clear="opera('clear')"></el-input>
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
        visible:false,
        clearOper:false,
        boxBlur:true,
      }
    },
    methods:{
      depHandleClick:function (data) {
        if(data.subs.length===0){
          // debugger
          this.$refs.popover.showPopper=false
        }
        this.inputVal=data.name
        this.$emit('checkCell',data)
      },
      opera:function (type) {
        console.log('test')
        if(type==='init'){
          // this.visible=true
          this.clearOper=false
        }else if(type==='clear') {
          this.inputVal=''
          this.clearOper = true
          this.$emit('clear')
        }else {
          this.visible=false
        }
      },
      show:function () {
        debugger
        if(this.clearOper){
          this.$refs.popover.showPopper=false
        }
      }
    },
    computed:{
      dataList:function () {
        return this.data
      }
    },
  }
</script>

<style scoped lang="less">
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
