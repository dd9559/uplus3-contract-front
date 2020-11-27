<template>
  <div class="select-tree-container">
    <el-select
      placeholder="部门"
      ref="select"
      :size="size"
      v-model="returnDataLabels"
      :disabled="disabled"
      :multiple="multiple"
      :filterable="filterable"
      :reserve-keyword="reserveKeyword"
      :filter-method="filterMethod"
      :clearable="clearable"
      :collapse-tags="collapseTags"
      @remove-tag="removeTag"
      @clear="clean"
      @focus="selectFocus"
      class="tree-select"
      :style="{width:width+'px'}"
    >
      <template slot="empty">
        <el-checkbox v-if="showAll" v-model="all">全部</el-checkbox>
        <el-tree
          class="common-tree"
          :class="{'show':show}"
          ref="tree"
          :data="treeData"
          :props="obj"
          :show-checkbox="multiple"
          :node-key="obj.id"
          :check-strictly="checkStrictly"
          :default-checked-keys="defaultKeys"
          :expand-on-click-node="multiple && expandClickNode"
          :check-on-click-node="checkClickNode"
          :filter-node-method="filterNode"
          :highlight-current="true"
          :accordion="true"
          :auto-expand-parent="false"
          :render-after-expand="false"
          @check="nodeClick"
        ></el-tree>
          <!-- @check-change="nodeClick" -->
      </template>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "selectTree",
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
    // 是否禁用
    disabled: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 配置是否可多选
    multiple: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 配置是否显示全选按钮
    checkAll: {
      type: Boolean,
      default() {
        return false
      }
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
      type: Boolean,
      default() {
        return false;
      },
    },
    // 选择后是否去掉关键字
    reserveKeyword: {
      type: Boolean,
      default() {
        return false
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
    size: {
      type: String,
      default() {
        return "small";
      },
    },
    width: {
      type: String,
      default() {
        return "200"
      }
    },
    show: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  //上面是父组件可传入参数
  data() {
    return {
      treeData: [], //tree数据
      options: [], //select option选项
      returnDataKeys: [], //返回父组件数组主键值
      returnDataLabels: [], //返回父组件数组label值
      query: ''
    };
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  computed: {
    all: {
      get () {
        return this.returnDataKeys.length === this.treeData.length
      },
      set (value) {
        if (value){
          let all = this.treeData.map(item => {
            return item[this.obj.id]
          })
          this.setDataKey("init",all)
          return value
        } else {
          this.setDataKey("init",[]);
          return value
        }
      }  
    },
    showAll () {
        return this.multiple && this.checkAll && !this.query
    }
  },
  methods: {
    //   初始化数据
    init() {
        if (!!this.data && Object.prototype.toString.call(this.data).indexOf("Array") !== -1) {
          this.initTrereData("init",this.data)
        }
        if(!!this.defaultKeys && Object.prototype.toString.call(this.defaultKeys).indexOf("Array") !== -1 && this.defaultKeys.length > 0) {
            this.setDataKey("init",this.defaultKeys)
        }
    },
    
    // 初始化tree数据
    initTrereData(type,data) {
        this.treeData = data
    },

    // 设置选中项key
    setDataKey(type,key) {
        if (type === "init") {
            this.$nextTick(() => {
              this.$refs.tree.setCheckedKeys(key);
              this.returnDataKeys = key
              this.returnDataLabels = this.$refs.tree.getCheckedNodes().map(item => {
                  return item[this.obj.label]
              })
              this.options = this.$refs.tree.getCheckedNodes().map(item => {
                  return {label:item[this.obj.label],value:item[this.obj.id]}
              })
              this.$emit('cleanDefault')
              this.$emit('getValue',this.returnDataKeys,this.returnDataLabels)
            })
        } else if (type === 'delete') {
            this.options = this.options.filter(item => {
                return item.value !== key
            })
            this.returnDataKeys = this.options.map(item => {
              return item.value
            });
            this.returnDataLabels = this.options.map(item => {
                return item.label
            })
            this.$emit('cleanDefault')
            this.$emit('getValue',this.returnDataKeys,this.returnDataLabels)
        } else {
            let node = this.$refs.tree.getNode(key).data
            this.$refs.tree.setCurrentKey(key);
            this.returnDataKeys.push(key)
            this.returnDataLabels.push(node[this.obj.label])
            this.options.push({
                label:node[this.obj.label],
                value:node[this.obj.id]
            })
            this.$emit('cleanDefault')
            this.$emit('getValue',this.returnDataKeys,this.returnDataLabels)
        }
        
    },

    // tree节点店家事件
    nodeClick(data,keys,halfDatas,halfKeys) {
      if (this.defaultKeys.length > 0) {
        this.$emit('cleanDefault')
      }
      let type = 'click'
      if (keys.checkedKeys.includes(data[this.obj.id])) {
        this.setDataKey(type,data[this.obj.id]);
      } else {
        type = 'delete'
        this.setDataKey(type,data[this.obj.id]);
      }
    },

    // 过滤tree数据
    filterNode(value, data) {
      if (!value) return true;
      return data[this.obj.label].indexOf(value) !== -1;
    },
    // 搜索方法
    filterMethod(val) {
      this.query = val
      this.$refs.tree.filter(val);
    },
    // 聚焦触发赋值
    selectFocus() {
      this.init()
      this.$refs.tree.filter();
      this.query = ""
      this.$refs.select.query = ""
    },
    //单选:清空选中
    clean() {
      this.$refs.tree.setCheckedKeys([]); //清除树选中key
      this.returnDataKeys = [];
      this.returnDataLabels = [];
      this.options = [];
      this.$emit('cleanDefault')
      this.$emit('getValue',this.returnDataKeys,this.returnDataLabels)
    },
    // 多选,删除任一select选项的回调
    removeTag(val) {
      if (this.defaultKeys.length > 0) {
        this.$emit('cleanDefault')
      }
      let value = this.options.find((item) => {
        return item.label === val;
      }).value;
      this.$refs.tree.setChecked(value, false);
      this.setDataKey("delete",value);
    },
  },
  watch: {
    data() {
      this.returnDataKeys = []
      this.returnDataLabels = []
      this.options = []
      this.$refs.tree.setCheckedKeys([]);
      this.init()
    }
  }
};
</script>

<style lang="less" scoped>
.select-tree-container {
  display: inline-block;
}
.el-checkbox {
  padding: 6px 0px 6px 25px;
}
.common-tree {
  max-height: 300px;
  padding-right: 12px;
  overflow: auto;
  &.show {
    /deep/ .el-tree-node__children .el-checkbox {
      display: none;
    }
  }
}
</style>