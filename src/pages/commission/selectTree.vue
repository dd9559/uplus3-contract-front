<!--
    /**
     * 树形下拉选择组件，下拉框展示树形结构，提供选择某节点功能，方便其他模块调用
     * @author wz
     * @date 2020-06-09
     * 调用示例：
     * <tree-select :height="400" // 下拉框中树形高度
     *              :width="200" // 下拉框中树形宽度 不填写自适应el-select input框大小
     *              size="small"  // 输入框的尺寸: medium/small/mini
     *              :data="data" // 树结构的数据或者普通包含主键，父主键的普通集合
                    :obj="{}"    //可自定义字段，字段映射如下
     *              multiple   // 多选
                    //默认值：单选可传入数字，字符串，对象；多选传入【数字|字符|对象】数组，其他非法
                    :default-key="..."
     *              clearable   // 可清空选择
     *              collapseTags   // 多选时将选中值按文字的形式展示
                    expand-click-node   //点击节点自动展开。多选有效
                    check-click-node // 是否点击节点是选中 多选生效
     *              checkStrictly // 多选时，严格遵循父子不互相关联 效果参考elementui 对应属性效果
     *              @getValue="父组件获取值方法"> // 事件有两个参数：第一个是所有选中的节点ID，第二个是所有选中的节点数据
     *              </tree-select>
      <select-tree
     obj 字段映射如下，值填写你实际字段，可拓展字段。最终返回主键以及选择对象【全部字段】
                        id:'id',//可改成自己对应主键【改值】
                        label: 'name',// 显示名称
                        children: 'children', //子级字段名
                        path:'path',//路径
                        content:'content',//描述
                        pid:'pid',//父id
     */
-->
<template>
  <div class="select-tree-container" style="display: inline-block">
    <el-select
      slot="reference"
      placeholder="部门"
      ref="select"
      :size="size"
      v-model="returnDataLabels"
      :multiple="multiple"
      :filterable="filterable"
      :remote="remote"
      reserve-keyword
      :loading="loading"
      :loading-text="loadingText"
      :remote-method="remoteMethod"
      :filter-method="filterMethod"
      :clearable="clearable"
      :collapse-tags="collapseTags"
      @click.native="selectClick"
      @remove-tag="removeTag"
      @clear="clean"
      class="tree-select"
    >
      <template slot="empty">
          <el-tree
            class="common-tree"
            ref="tree"
            :data="treeData"
            :props="obj"
            :show-checkbox="multiple"
            :node-key="obj.id"
            :check-strictly="checkStrictly"
            :default-expanded-keys="defaultKeys"
            :expand-on-click-node="multiple && expandClickNode"
            :check-on-click-node="checkClickNode"
            :highlight-current="true"
            accordion
            @check-change="nodeClick"
            @node-click="nodeClick"
          ></el-tree>
      </template>
    </el-select>
  </div>
</template>
 
<script>
export default {
  name: "test-code",
  props: {
    // 树结构数据
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    obj: {
      type: Object,
      required: false,
      default: () => {
        return {
          id: "id", // ID
          label: "name", // 显示名称
          children: "children", //子级字段名
          path: "path", //路径
          content: "content", //描述
          pid: "pid", //父id
        };
      },
    },
    // 配置是否可多选
    multiple: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 配置是否可清空选择
    clearable: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 配置多选时是否将选中值按文字的形式展示
    collapseTags: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 是否可搜索 
    filterable: {
      tepe: Boolean,
      default() {
        return false
      }
    },
    // 是否可远程搜索 filterable
    remote: {
      tepe: Boolean,
      default() {
        return false
      }
    },
    // 是否正在从远程加载数据
    loading: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 远程加载时显示的文字
    loadingText: {
      type: String,
      default() {
        return "加载中"
      }
    },
    // 默认选中项
    defaultKeys: {
      type: Array,
      default() {
        return [];
      },
    },
    // 显示复选框情况下，是否严格遵循父子不互相关联
    checkStrictly: {
      type: Boolean,
      default() {
        return false;
      },
    },
    //多选是设置点击节点是否可以选中
    checkClickNode: {
      type: Boolean,
      default() {
        return false;
      },
    },
    //多选时：点击节点展开还是点三角标
    expandClickNode: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 默认选中的节点key
    defaultKey: {
      type: [Number, String, Array, Object],
      default() {
        return [];
      },
    },
    size: {
      type: String,
      default() {
        return "small";
      },
    },
  },
  //上面是父组件可传入参数
  data() {
    return {
      options1: [{ label: 1, value: 1 }],
      // popoverWidth:"auto",//下拉框大小
      isShowSelect: false, // 是否显示树状选择器
      options: [], //select option选项
      returnDatas: [], //返回给父组件数组对象
      returnDataKeys: [], //返回父组件数组主键值
      returnData: [], //返回父组件数组
      returnDataLabels: [], //返回父组件数组label值
      remoteKeyWord: '', //远程搜索关键字
      filterKeyWord: '', //远程搜索关键字
    };
  },
  computed: {
    treeData() {
      // 若非树状结构，则转化为树状结构数据
      return JSON.stringify(this.data).indexOf(this.obj.children) !== -1
        ? this.data
        : this.switchTree();
    },
  },
  methods: {
    init() {
      if (!this.$refs.tree) return
      console.log('我看看跑了几次');
      // eslint-disable-next-line no-undef,no-debugger
      // debugger
      if (this.defaultKey != undefined && this.defaultKey.length > 0) {
        if (this.multiple) {
          // 多选
          if (
            Object.prototype.toString.call(this.defaultKey).indexOf("Array") !=
            -1
          ) {
            if (
              Object.prototype.toString
                .call(this.defaultKey[0])
                .indexOf("Object") != -1
            ) {
              //对象
              this.setDatas(this.defaultKey);
            } else if (
              Object.prototype.toString
                .call(this.defaultKey[0])
                .indexOf("Number") != -1 ||
              Object.prototype.toString
                .call(this.defaultKey[0])
                .indexOf("String") != -1
            ) {
              this.setKeys(this.defaultKey);
            } else {
              console.log("多选：传入参数类型不匹配");
              return;
            }
          } else {
            console.log("多选：传入参数类型不匹配");
            return;
          }
        } else {
          // 单选
          if (
            Object.prototype.toString.call(this.defaultKey).indexOf("Number") !=
              -1 ||
            Object.prototype.toString.call(this.defaultKey).indexOf("String") !=
              -1 ||
            Object.prototype.toString.call(this.defaultKey).indexOf("Object") !=
              -1
          ) {
            this.setKey(this.defaultKey);
          } else {
            console.log("单选：传入参数类型不匹配");
            return;
          }
        }
      }
    },
    //下拉框select点击[入口]
    selectClick() {
      this.$nextTick(function () {
        //设置下拉框自适应宽度
        this.popoverWidth = this.$refs.select.$el.clientWidth - 26;
      });
      //显示下拉框
      return (this.isShowSelect = !this.isShowSelect);
    },
    //单选: 树点击方法
    nodeClick(data, node) {
      if (!this.multiple) {
        //单选
        this.isShowSelect = false;
        this.setKey(node.key);
      } else {
        //多选
        var checkedKeys = this.$refs.tree.getCheckedKeys(); // 所有被选中的节点的 key 所组成的数组数据
        var t = [];
        this.options = checkedKeys.map((item) => {
          //设置option选项
          var node = this.$refs.tree.getNode(item); // 所有被选中的节点对应的node
          t.push(node.data);
          return { label: node.label, value: node.key };
        });
        // console.log(this.options,'this.options============');

        this.returnData = this.options.map((item) => {
          return {value:item.value,label:item.label};
        });
        this.returnDataKeys = this.options.map((item) => {
          return item.value;
        });
        this.returnDataLabels = this.options.map((item) => {
          return item.label;
        });
        // console.log('this.returnData============',this.returnData,'this.returnDataKeys============',this.returnDataKeys,'this.returnDataLabels============',this.returnDataLabels);
        this.returnDatas = t;
      }
    },
    // select聚焦时相关逻辑
    // selectFocus() {
    //   this.$emit("selectFocus",true,'')
    // },
    // 搜索方法
    filterMethod(val) {
      console.log(val,223311);
      if (val) {
        this.$emit("selectFocus",true,'')
        this.$refs.select.remoteMethod(val)
      }
    },
    // 远程搜素方法
    remoteMethod(val) {
      if(val) {
        this.$emit("selectFocus",true,val)
      }
    },
    //单选:清空选中
    clean() {
      this.$refs.tree.setCheckedKeys([]); //清除树选中key
      this.returnDatas = null;
      this.returnDataKeys = "";
      this.returnData = [];
      this.popoverHide();
    //   console.log(this.returnData,this.returnDataKeys,this.returnDataLabels,99999);
    },
    //单选:设置、初始化值 key
    setKey(thisKey) {
      this.$refs.tree.setCurrentKey(thisKey);
      var node = this.$refs.tree.getNode(thisKey);
      this.setData(node.data);
    },
    //单选：设置、初始化对象
    setData(data) {
      this.options = [];
      this.options.push({
        label: data[this.obj.label],
        value: data[this.obj.id],
      });
      this.returnDatas = data;
      this.returnDataKeys = data[this.obj.id];
    },
    //多选:设置、初始化值 keys
    setKeys(thisKeys) {
      console.log(this.$refs,889999999999);
      this.$refs.tree.setCheckedKeys(thisKeys);
      this.returnDataKeys = thisKeys;
      var t = [];
      thisKeys.map((item) => {
        console.log(item,'史蒂芬霍金炬华科技和');
        //设置option选项
        var node = this.$refs.tree.getNode(item); // 所有被选中的节点对应的node
        t.push(node.data);
        return { label: node.label, value: node.key };
      });
      this.returnDatas = t;
      this.popoverHide();
    },
    //多选:设置、初始化对象
    setDatas(data) {
      this.$refs.tree.setCheckedNodes(data);
      this.returnDatas = data;
      var t = [];
      data.map((item) => {
        //设置option选项
        t.push(item[this.obj.id]);
      });
      this.returnDataKeys = t;
      this.popoverHide();
    },
    // 多选,删除任一select选项的回调
    removeTag(val) {
        // console.log(val,this.returnData,78788);
        let value = this.returnData.filter(item => {
            return item.label === val
        })[0].value
      this.$refs.tree.setChecked(value, false); //设置为未选中
      var node = this.$refs.tree.getNode(value); //获取节点
      if (!this.checkStrictly && node.childNodes.length > 0) {
        this.treeToList(node).map((item) => {
          if (item.childNodes.length <= 0) {
            this.$refs.tree.setChecked(item, false);
          }
        });
      }
    //   console.log(this.returnData,this.returnDataKeys,this.returnDataLabels,99999);
      this.nodeClick();
      this.popoverHide();
    },
    //下拉框关闭执行
    popoverHide() {
    //   console.log(this.$refs.popoverRef, 890098098);
      this.$emit("getValue", this.returnDataKeys, this.returnDatas);
    },
    // 多选，清空所有勾选
    clearSelectedNodes() {
      var checkedKeys = this.$refs.tree.getCheckedKeys(); // 所有被选中的节点的 key 所组成的数组数据
      for (let i = 0; i < checkedKeys.length; i++) {
        this.$refs.tree.setChecked(checkedKeys[i], false);
      }
    },

    //树形转为集合
    treeToList(tree) {
      var queen = [];
      var out = [];
      queen = queen.concat(tree);
      while (queen.length) {
        var first = queen.shift();
        if (first.childNodes) {
          queen = queen.concat(first.childNodes);
        }
        out.push(first);
      }
      return out;
    },
    switchTree() {
      return this.buildTree(this.data, this.defaultValue);
    },
    // 将一维的扁平数组转换为多层级对象
    buildTree(data, id) {
      const fa = (id) => {
        const temp = [];
        for (let i = 0; i < data.length; i++) {
          const n = data[i];
          if (n[this.obj.pid] === id) {
            n[this.obj.children] = fa(n[this.obj.id]);
            temp.push(n);
          }
        }
        return temp;
      };
      return fa(id);
    },
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    returnDataKeys () {
      this.$emit("getValue", this.returnDataKeys, this.returnDatas);
    },
    treeData() {
      // debugger
      this.$nextTick(() => {
        this.init();
      });
    },
  },
};
</script>
 
<style lang="less" scoped>
.select-tree-container {
  display: inline-block;
    .el-select {
      width: 266px !important;
    }
}
.common-tree {
  max-height: 300px;
  padding-right: 12px;
  overflow: auto;
  /deep/ .el-tree-node__children .el-checkbox {
    display: none;
  }
}
</style>