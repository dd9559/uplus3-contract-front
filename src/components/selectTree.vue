<template>
  <el-popover
    @show="initList('show')"
    @hide="initList('hide')"
    ref="popover"
    placement="bottom"
    v-model="visible">
    <div class="select-tree">
      <el-tree accordion :data="list" :props="defaultProps" @node-click="depHandleClick"></el-tree>
    </div>
    <p class="tree-box" slot="reference" @click="opera('init',$event)" @mouseenter="showClear"
       @mouseleave="clearVal=false">
      <el-input size="small" class="w200" ref="btn" placeholder="请选择" v-model="inputVal" @keyup.native="getDep">
      </el-input>
      <!--<input type="text" placeholder="请选择" ref="btn" v-model="inputVal" @input="getDep">-->
      <span class="box-icon"><i class="iconfont el-select__caret el-icon-arrow-up" :class="[visible?'is-reverse':'']"
                                v-if="!clearVal"></i><i class="iconfont icon-tubiao-7" v-else
                                                        @click.stop="opera('clear')"></i></span>
    </p>
  </el-popover>
</template>

<script>
  let _list = []
  let _inputVal = ''
  export default {
    name: "select-tree",
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      defaultProps: {
        type: Object,
        default() {
          return {
            children: 'subs',
            label: 'name'
          }
        }
      },
      init: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        inputVal: this.init,
        clearOper: false,
        visible: false,
        clearVal: false,
        iconUp: true,
        pop: true,//弹窗是否失焦
        list: [],
        cellClick:false,//是否选择
      }
    },
    mounted(){
      this.getList()
      this.$nextTick(()=>{
        document.body.addEventListener('mousedown',this.bodyClick)
      })
    },
    beforeDestroy(){
      document.body.removeEventListener('mousedown',this.bodyClick)
    },
    watch: {
      init: function (val) {
        this.inputVal = val
      }
    },
    methods: {
      bodyClick:function (e) {
        if(this.$refs.popover&&!(this.$refs.popover.$refs.popper.innerHTML.indexOf(e.target.parentNode.innerHTML)>-1)&&!(e.target.parentNode===this.$refs.btn.$el)){
          this.visible=false
        }
      },
      showClear: function () {
        // debugger
        if (this.inputVal.length > 0 && this.list.length > 0) {
          this.clearVal = true
        }
      },
      depHandleClick: function (data) {
        this.cellClick=true
        _inputVal=data.name
        if (data.subs.length === 0) {
          // debugger
          this.$refs.popover.showPopper = false
        }
        this.inputVal = data.name
        this.$emit('checkCell', data)
      },
      opera: function (type, e) {
        if (type === 'init') {
          this.visible = true
          this.$refs.popover.showPopper = true
          this.iconUp = !this.iconUp
        } else if (type === 'clear') {
          this.visible = false
          this.$refs.popover.showPopper = false
          this.list = _list.map(item=>Object.assign({},item))
          /*if(this.init.length>0){
          }else {
            this.inputVal=''
          }*/
          this.inputVal = ''
          this.$emit('clear')
        }
      },
      initList:function (type='hide') {
        // this.inputVal=''
        if(type==='hide'){
          if(_inputVal!==this.inputVal){
            this.inputVal=''
          }
          /*if(this.list.length!==_list.length){
            this.list = _list.map(item=>Object.assign({},item))
          }*/
        }else {
          this.list = _list.map(item=>Object.assign({},item))
          _inputVal=this.inputVal
          this.cellClick=false
        }
      },
      getList:function (keyword='',type='init') {
        this.$ajax.get('/api/access/deps/tree', {keyword: keyword}).then(res => {
          res = res.data
          if (res.status === 200) {
            this.list=res.data
            if(type==='init'){
              _list=res.data.map(item=>Object.assign({},item))
            }
          }
        })
      },
      //部门搜索
      getDep: function (e, clear = false) {
        this.visible=true
        this.inputVal = e.target.value
        if(this.inputVal.length>0){
          this.getList(this.inputVal,'search')
          this.$emit('search')
        }else {
          this.list = _list.map(item=>Object.assign({},item))
        }
      }
    },
    computed: {
      dataList: function () {
        return this.data
      },
    },
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";

  .tree-box {
    position: relative;
    .box-icon {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      > i {
        color: #c0c4cc;
        &.el-select__caret {
          color: #c0c4cc;
          font-size: 14px;
          -webkit-transition: -webkit-transform .3s;
          transition: -webkit-transform .3s;
          transition: transform .3s;
          transition: transform .3s, -webkit-transform .3s;
          transition: transform .3s, -webkit-transform .3s;
          -webkit-transform: rotateZ(180deg);
          transform: rotateZ(180deg);
          cursor: pointer;
        }
        &.is-reverse {
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
