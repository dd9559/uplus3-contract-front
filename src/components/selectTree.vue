<template>
  <el-popover @show="initList('show')" @hide="initList('hide')" ref="popover" trigger="manual" placement="bottom"
    v-model="visible">
    <div class="select-tree">
      <el-tree accordion node-key="depId" :default-expanded-keys="expandedArr" :data="list" :props="defaultProps" @node-click="depHandleClick"></el-tree>
    </div>
    <p class="tree-box" slot="reference" @click="opera('init',$event)" @mouseenter="showClear"
      @mouseleave="clearVal=false">
      <el-input size="small" class="w200" ref="btn" placeholder="请选择" v-model="inputVal" @keyup.native="getDep">
      </el-input>
      <!--<input type="text" placeholder="请选择" ref="btn" v-model="inputVal" @input="getDep">-->
      <span class="box-icon" ref="triggerBtn">
        <i class="el-select__caret el-icon-arrow-up" :class="[visible?'is-reverse':'']" v-if="!clearVal"></i>
        <i class="iconfont icon-tubiao-7" v-else @click.stop="opera('clear')"></i>
      </span>
    </p>
  </el-popover>
</template>

<script>
let _list = [];
let _inputVal = "";
function findDep (item,arr = []) {
  if (item.subs.length === 0) {
    arr.push(item)
  } else {
    arr.push(item)
    item.subs.map(itemChild => {
      findDep(itemChild,arr)
    })
  }
  return arr
}
export default {
  name: "select-tree",
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultProps: {
      type: Object,
      default() {
        return {
          children: "subs",
          label: "name",
        };
      },
    },
    init: {
      type: String,
      default: "",
    },
    treeType: {
      type: String,
      default: "none",
    },
    systemKey: {
      type: String,
      default: "",
    },
    searchStatus: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      inputVal: this.init,
      clearOper: false,
      visible: false,
      clearVal: false,
      iconUp: true,
      pop: true, //弹窗是否失焦
      list: [],
      cellClick: false, //是否选择
      operaTime: null, //键盘输入时间
      operaStatus: false,
      expandedArr: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getList();
      document.body.addEventListener("mousedown", this.bodyClick);
    });
  },
  beforeDestroy() {
    document.body.removeEventListener("mousedown", this.bodyClick);
  },
  watch: {
    init: function (val) {
      this.inputVal = val;
      // this.getList(this.inputVal,'search')
    },
    systemKey: function (val) {
      this.getList();
    },
    list: function (val) {
      if (val.length > 0 && this.inputVal) {
        this.expandedArr = []
        val.map(item => {
          this.expandedArr.push(findDep(item)[findDep(item).length -1].depId)
        })
      } else {
        this.expandedArr = []
      }
    }
  },
  methods: {
    bodyClick: function (e) {
      if (
        this.$refs.popover &&
        !(
          this.$refs.popover.$refs.popper.innerHTML.indexOf(
            e.target.parentNode.innerHTML
          ) > -1
        ) &&
        !(
          e.target.parentNode === this.$refs.btn.$el ||
          e.target.parentNode === this.$refs.triggerBtn
        )
      ) {
        this.visible = false;
      }
    },
    showClear: function () {
      // debugger
      if (this.inputVal.length > 0 && this.list.length > 0) {
        this.clearVal = true;
      }
    },
    depHandleClick: function (data) {
      this.cellClick = true;
      _inputVal = data.name;
      // if (data.subs.length === 0) {
      //   // debugger
      this.$refs.popover.showPopper = false; //z改动
      // }
      this.inputVal = data.name;
      if (!data.depId) {
        data.depId = data.id;
      }
      this.$emit("checkCell", data);
    },
    opera: function (type, e) {
      if (type === "init") {
        this.visible = !this.visible;
        // this.$refs.popover.showPopper = true
        this.iconUp = !this.iconUp;
      } else if (type === "clear") {
        this.visible = false;
        // this.$refs.popover.showPopper = false
        this.list = _list.map((item) => Object.assign({}, item));
        /*if(this.init.length>0){
          }else {
            this.inputVal=''
          }*/
        this.inputVal = "";
        this.$emit("clear");
      }
    },
    initList: function (type = "hide") {
      // this.inputVal=''
      if (type === "hide") {
        if (_inputVal !== this.inputVal) {
          this.inputVal = "";
          this.$emit("clear");
          //部门选择添加初始值--2019/05/28
          /*if(_list.length===0){
              this.getList()
            }*/
        }
        /*if(this.list.length!==_list.length){
            this.list = _list.map(item=>Object.assign({},item))
          }*/
      } else {
        this.list = _list.map((item) => Object.assign({}, item));
        _inputVal = this.inputVal;
        this.cellClick = false;
      }
    },

    getList: function (keyword = "", type = "init", addType = 1) {
      if (this.searchStatus) {
        let url = "";
        if (addType == 1) {
          url = "/api/access/deps/tree";
        } else {
          url = "/api/access/deps";
        }

        let isControl = true;
        if (this.treeType !== "none") {
          url = "/api/contract/access/deps/tree";
          if (this.treeType === "house") {
            isControl = false;
          }
        }
        this.treeType === "power" && (url = "/api/access/deps");
        let param = {
          keyword: keyword,
          isControl: isControl,
        };
        if (this.systemKey) {
          //如果是审核流程页面根据选择的体系请求树形数据
          url = "/api/access/systemtag/deps/tree";
          // addType != 1 && (url = '/api/access/systemtag/deps')
          // addType == 1 &&this.systemKey!='-100' && (url = '/api/access/systemtag/deps/tree')
          if (this.systemKey != "-100") {
            param.systemTag = this.systemKey;
          }
        }
        this.$ajax.get(url, param).then((res) => {
          res = res.data;
          if (res.status === 200) {
            this.list = res.data;
            if (type === "init") {
              _list = res.data.map((item) => Object.assign({}, item));
            }
          }
        });
      } else {
        _list = [];
      }
    },
    //部门搜索
    getDep: function (e, clear = false) {
      this.visible = true;
      this.inputVal = e.target.value.replace(/\s/g, "");
      this.operaStatus = false;
      if (!this.operaStatus) {
        clearTimeout(this.operaTime);
        this.operaTime = setTimeout(() => {
          if (this.inputVal.length > 0) {
            console.log(this.inputVal, 888);
            this.getList(this.inputVal, "search", 2);
            this.$emit("search");
          } else {
            this.list = _list.map((item) => Object.assign({}, item));
            //部门选择添加初始值--2019/05/28
            /*if(_list.length===0){
                this.getList()
              }*/
          }
        }, 800);
      }
      // debugger
    },
  },
  computed: {
    dataList: function () {
      return this.data;
    },
  },
};
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
        -webkit-transition: -webkit-transform 0.3s;
        transition: -webkit-transform 0.3s;
        transition: transform 0.3s;
        transition: transform 0.3s, -webkit-transform 0.3s;
        transition: transform 0.3s, -webkit-transform 0.3s;
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
