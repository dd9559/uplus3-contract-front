<template>
  <div class="pagination-box">
    <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="currentPage" :page-size="pageSize" :total="total" layout=" prev, pager, next">
    </el-pagination>
    <div class="my-pagination">
      <el-input class="my-inp" type="number" v-model="cPageValue" :placeholder="currentPage"></el-input>
      <el-button class="my-inp-btn" @click="btnClickFn">确定</el-button>
      <span class="my-txt">共有{{ total }}条数据</span>
      <span class="my-txt">每页显示</span>
      <el-input class="my-inp" type="number" v-model="cPageSize" :placeholder="pageSize"
        @keyup.enter.native="selectChangeFn"></el-input>
      <el-button class="my-inp-btn" @click="selectChangeFn">确定</el-button>
      <!-- <el-select v-model="selectVal" class="my-select" @change="selectChangeFn">
        <el-option
          v-for="item in selectArr"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option> 
      </el-select>-->
    </div>
  </div>
</template>

<script>
export default {
  name: "myPagination",
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 1,
    },
    // pageSizes: {
    //   type: Array,
    //   default() {
    //     return [];
    //   },
    // },
  },
  data() {
    return {
      // currentIndex: 1,
      cPageValue: 1,
      cPageSize: 20,
      // selectArr: [10, 200, 300, 400],
      // selectVal: 1,
    };
  },
  // watch: {
  //   pageSize: {
  //     immediate: true,
  //     handler(val, oldVal) {
  //       this.selectVal = val;
  //     },
  //   },
  //   currentPage: {
  //     immediate: true,
  //     handler(val, oldVal) {
  //       this.currentIndex = val;
  //     },
  //   },
  // },
  methods: {
    handleSizeChange(val) {
      this.$emit("size-change", val);
    },
    handleCurrentChange(val) {
      this.$emit("current-change", val);
    },
    btnClickFn() {
      if (isNaN(this.cPageValue)) {
        return false;
      } else {
        if (this.cPageValue < 1) this.cPageValue = 1;
        this.$emit("current-change", parseInt(this.cPageValue));
      }
    },
    selectChangeFn() {
      if (isNaN(this.cPageSize)) {
        return false;
      } else {
        if (this.cPageSize < 1) this.cPageSize = 1;
        this.$emit("size-change", parseInt(this.cPageSize));
      }
    },
  },
};
</script>

<style scoped lang='less'>
// 分页
.pagination-box {
  padding: 16px 0;
  text-align: center;
  height: 24px;

  /deep/.pagination {
    //  height: 24px;
    display: inline-block;
    padding: 0;
    position: relative;
    top: -5px;
  }
  /deep/.btn-prev,
  /deep/.btn-next {
    height: 24px;
    width: 24px;
    padding: 0;
    min-width: auto;
    color: #94a1b2;
    border-radius: 4px;
    border: 1px solid #8e9cae;
    margin: 0 5px;
    &:disabled {
      background-color: #e5ebf4;
      color: #b8c1cd;
      border-color: #e5ebf4;
      &:hover {
        color: #b8c1cd;
        border-color: #e5ebf4;
      }
    }
    &:hover {
      color: #ffa148;
      border-color: #ffa148;
    }
  }

  /deep/.el-pager li {
    font-size: 12px;
    padding: 0;
    border: 1px solid #8e9cae;
    color: #8e9cae;
    border-radius: 4px;
    width: 24px;
    height: 24px;
    line-height: 22px;
    min-width: auto;
    margin: 0 5px;
    &.btn-quicknext,
    &.btn-quickprev {
      border: 0;
      width: auto;
    }
    &.active {
      background-color: #ffa148;
      color: #fff;
      border-color: #ffa148;
      &:hover {
        color: #fff;
      }
    }
    &:hover {
      color: #ffa148;
      border-color: #ffa148;
    }
  }

  .my-inp {
    width: 42px;
    padding: 0 5px;
    position: relative;
    top: -1px;

    /deep/.el-input__inner {
      line-height: 24px;
      height: 24px;
      border-color: #8e9cae;
      border-radius: 4px;
      padding: 0 5px;
      text-align: center;
      &:focus {
        border-color: #ffa148;
      }
    }
  }
  .my-pagination {
    display: inline-block;
    height: 24px;
  }
  /deep/.my-inp-btn {
    width: 42px;
    height: 24px;
    padding: 0;
    text-align: center;
    border: 1px solid #8e9cae;
    border-radius: 4px;

    & > span {
      height: 100%;
      line-height: 24px;
      font-size: 12px;
      color: #8e9cae;
    }
    &:hover {
      background-color: #fff;
      border-color: #ffa148;
      & > span {
        color: #ffa148;
      }
    }
    &:focus {
      background-color: #fff;
    }
  }
  .my-txt {
    color: #8e9cae;
    font-size: 12px;
    line-height: 24px;
    padding-left: 5px;
    font-weight: normal;
  }
  /deep/.my-select {
    width: 80px;
    margin-left: 5px;
    position: relative;
    top: -1px;
    .el-input__inner {
      line-height: 24px;
      height: 24px;
      border-color: #8e9cae;
      padding-left: 10px;
      color: #8e9cae;
    }
    .is-focus .el-input__inner {
      border-color: #ffa148;
    }
    .el-input__icon {
      line-height: 24px;
    }
  }
}
.el-popper {
  .el-select-dropdown__item.selected {
    color: #ffa148;
  }
}
</style>