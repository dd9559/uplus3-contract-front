<template>
  <el-popover
    ref="popover"
    placement="bottom"
    v-model="visible">
    <div class="select-tree">
      <el-tree accordion :data="dataList" :props="defaultProps" @node-click="depHandleClick"></el-tree>
    </div>
    <el-input size="small" class="w200" slot="reference" :clearable="true" readOnly placeholder="请选择" v-model="inputVal" @click="opera('init')" @clear="opera('clear')"></el-input>
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
        clearOper:true,
      }
    },
    methods:{
      depHandleClick:function (data) {
        this.inputVal=data.name
        this.visible = false;
        this.$emit('checkCell',data)
      },
      opera:function (type) {
        // debugger
        if(type==='init'){
          this.visible=(true&&this.clearOper)
        }else {
          this.inputVal=''
          this.clearOper = false
          this.visible=false
          this.$emit('clear')
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
