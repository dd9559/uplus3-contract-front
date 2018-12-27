<template>
  <div class="row-scroll" :style="{width:tableBody+'px',left:scrollLeft+'px'}">
    <div class="row-scroll-box" @scroll="scroll">
      <p :style="{width:scrollWidth+'px'}"></p>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  import {mapMutations,mapGetters} from 'vuex'

  export default {
    name: "scroll-bar",
    props: {
      /*box: {
        type: Number,
        default: 0
      },
      width: {
        type: Number,
        default: 0
      },
      left: {
        type: Number,
        default: 0
      },*/
      table: {
        type:Object,
        default:function () {
          return {}
        }
      }
    },
    data(){
      return{
        tableBody:0,
        scrollWidth:0,
        scrollLeft:0
      }
    },
    mounted(){
      this.$nextTick(()=>{
        this.scrollWidth=this.table.$refs.bodyWrapper.childNodes[0].clientWidth
        // debugger
        this.tableBody=this.table.$refs.bodyWrapper.clientWidth-17
        this.scrollLeft=this.table.$el.offsetLeft+65
        window.onresize=function () {
          this.tableBody=this.table.$refs.bodyWrapper.clientWidth
        }.bind(this)
      })
    },
    computed:{
      getBox:function () {
        return this.table
      },
      ...mapGetters([
        'getCollapse'
      ])
    },
    watch:{
      getCollapse:function (val) {
        this.tableBody=this.table.$refs.bodyWrapper.clientWidth
        if(!val){
          this.scrollLeft=this.table.$el.offsetLeft+161
        }else {
          this.scrollLeft=this.table.$el.offsetLeft+65
        }
      }
    },
    methods:{
      scroll:function (e) {
        this.scrollWidth=this.scrollWidth=this.table.$refs.bodyWrapper.childNodes[0].clientWidth
        console.log(this.table.$el.offsetLeft)
        this.table.$refs.bodyWrapper.scrollTo(e.target.scrollLeft,0)
        console.log(this.table)
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";

  .row-scroll {
    position: fixed;
    /*left: 0;
    right: 0;*/
    bottom: 0;
    z-index: 999;
    background-color: @bg-white;
    padding: 0 1px;
    &-box {
      width: 100%;
      overflow-x: auto;
      > p {
        height: 1px;
      }
    }
  }
</style>
