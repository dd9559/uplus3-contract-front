<template>
  <div class="view-container">
    <el-form :model="searchForm" class="form-head" size="small">
      <el-form-item label="城市选择">
        <el-select v-model="searchForm.cityId" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <ul class="tabs">
      <li v-for="item in tabs" :class="[activeItem===item.id?'active':'']" @click="checkTab(item)" :key="item.id">{{item.name}}</li>
    </ul>
    <component :is="current"></component>
  </div>
</template>

<script>
  import { FILTER } from "@/assets/js/filter";
  import { TOOL } from "../../assets/js/common";
  import TransactionStep from "./transactionStep";
  import transactionProcess from "./transactionProcess";
  import transactionContract from "./transactionContract";

  let imgSize = 4 / 3;
  let mouseStart = {
    start: false
  };

  export default {
    name: "post-process",
    data() {
      return {
        searchForm: {
          cityId: ""
        },
        tabs: [
          {
            id: 1,
            name: "交易步骤",
            url: "/flowmanage/selectTypeStepsList"
          },
          {
            id: 2,
            name: "交易流程",
            url: "/flowmanage/selectFlowList"
          },
          {
            id: 3,
            name: "合同资料库",
            url: "/flowmanage/getTypeAndStepsList"
          }
        ],
        activeItem: 1, //Tab当前项
        current: "TransactionStep", //当前组件
      };
    },
    components: {
      TransactionStep,
      transactionProcess,
      transactionContract
    },
    mounted() {
      let objX = 0;
      let objY = 0;
      let dragObj = this.$refs.dropBtn; //拖拽对象
      if (dragObj) {

        dragObj.onmousedown = function() {
          mouseStart = Object.assign({ start: true }, TOOL.getMousePos());
          // console.log(mouseStart)
          objX = !dragObj.style.left
            ? 0
            : parseInt(dragObj.style.left.split("px")[0]);
          objY = !dragObj.style.top
            ? 0
            : parseInt(dragObj.style.top.split("px")[0]);
        };

        document.onmousemove = function() {
          if (mouseStart.start) {
            let location = TOOL.getMousePos();
            dragObj.style.left = `${location.x - mouseStart.x + objX}px`;
            dragObj.style.top = `${location.y - mouseStart.y + objY}px`;
          }
        };

        document.onmouseup = function() {
          mouseStart = { start: false };
          let dragWindow = this.$refs.dragWindow;
          let rateX =
            parseInt(dragObj.style.left.split("px")[0]) / dragWindow.clientWidth;
          console.log(rateX.toFixed(2));
        }.bind(this);
      }
    },
    methods: {
      getImg: function(url) {
        return require("@/assets/img/" + url);
      },
      checkTab: function(item) {
        this.activeItem = item.id;
        if (item.id == 1) {
          this.current = "TransactionStep";
        } else if (item.id == 2) {
          this.current = "transactionProcess";
        } else {
          this.current = "transactionContract";
        }
      },
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        // debugger
        if (columnIndex === 5) {
          return [1, 3];
        } else if (columnIndex === 6 || columnIndex === 7) {
          return [0, 0];
        }
      },
      mouseDown: function() {
        let target = this.$refs.dropBtn;
        mouseStart = Object.assign({ start: true }, TOOL.getMousePos());
        console.log(document);
        /*document.onmousemove = function (event) {
            let location = TOOL.getMousePos()
            console.log(location)
            if(mouseStart.start){
              target.style.left = `${location.x}px`
              target.style.top = `${location.y}px`
            }
          }
          document.onmouseup = function () {
            mouseStart = {start:false}
          }*/
      },
      mouseEnd: function() {
        /*debugger
          mouseStart = {start:false}*/
      }
    },
    computed: {
      imgHeight: function() {
        return `${1000 / imgSize}px`;
      }
    }
  };
</script>

<style scoped lang="less">
@import "~@/assets/common.less";

.view-container {
  background-color: #F2F3F8!important;
  .form-head {
    height: 82px;
    background: #fff;
    box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
    border-radius: 4px 4px 0 0;
    display: flex;
    align-items: center;
    padding-left: 20px;
    .el-form-item {
      display: flex;
      margin-bottom: 0;
    }
  }
  .tabs {
    height: 48px;
    display: flex;
    background: rgba(250, 250, 251, 1);
    font-size: 16px;
    padding-left: 30px;
    > li {
      display: flex;
      align-items: center;
      padding: 0 20px;
      font-family: "MicrosoftYaHei";
      color: rgba(50, 72, 95, 1);
      margin-right: 30px;
      &.active {
        color: @color-blue;
        border-bottom: 4px solid @color-blue;
      }
      &:nth-of-type(n + 2) {
        border-left: 0px;
      }
    }
  }
}
/deep/ .el-table th {
  background:rgba(238,242,251,1);
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid rgba(237,236,240,1);
}
/deep/ .el-input__inner {
  border: 1px solid #DEDDE2;
}
/deep/ .confirmBtn {
  width: 100px;
  height: 38px;
  border-radius: 18px;
  background-color: #478DE3;
  color: #fff;
}
/deep/ .addBtn {
  background-color: #fff;
  width: 100px;
  height: 38px;
  border-radius: 18px;
  border-color: #478DE3;
  color: #478DE3;
}
</style>
