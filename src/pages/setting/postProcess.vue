<template>
  <div class="view-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }" class="colorf">首页</el-breadcrumb-item>
      <el-breadcrumb-item>后期流程设置</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="form" :model="flowForm" label-width="80px">
      <el-form-item label="城市选择" class="selectCity">
        <el-select v-model="flowForm.selectCity" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <ul class="tabs">
      <li v-for="item in tabs" :class="[activeItem===item.id?'active':'']" @click="checkTab(item)">{{item.name}}</li>
    </ul>
    <component :is="current"></component>
  </div>
</template>

<script>
import { FILTER } from "@/assets/js/filter";
import { TOOL } from "../../assets/js/common";
import TransactionStep from "./transactionStep";
import Tow from "./tow";
import Three from "./three";

let stepTypeId = 1;
let imgSize = 4 / 3;
let mouseStart = {
  start: false
};

export default {
  name: "post-process",
  mixins: [FILTER],
  data() {
    return {
      flowForm: {
        selectCity: '',
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
      listData: [],
      modal: false,
      modalTitle: "",
      current: "TransactionStep", //当前组件
      //步骤类型
      stepType: {
        type: "",
        role: ""
      },
      //交易步骤
      stepBusiness: {
        stepsTypeId: "",
        stepsTypeName: "",
        name: "",
        planDays: "",
        overTimeDays: "",
        isSms: ""
      },
      roleListData: [], //负责角色
      tableForm: [
        {
          id: 1,
          isRequired: "",
          title: "",
          type: ""
        }
      ]
    };
  },
  components: {
    TransactionStep,
    Tow,
    Three
  },
  created() {},
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
      console.log(item);
      this.activeItem = item.id;
      if (item.id == 1) {
        this.current = "TransactionStep";
      } else if (item.id == 2) {
        this.current = "Tow";
      } else {
        this.current = "Three";
      }
    },
    /**
     * 获取步骤类型的交易步骤
     * @param row
     */
    getRowDetails: function(row) {
      this.stepBusiness.stepsTypeName = row.name;
      this.stepBusiness.stepsTypeId = row.id;
      this.$ajax
        .get("/api/flowmanage/selectStepsListByType", { stepsTypeId: row.id })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.listData_other = res.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    showModal: function(title) {
      this.modalTitle = title;
      this.modal = true;
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      // debugger
      if (columnIndex === 5) {
        return [1, 3];
      } else if (columnIndex === 6 || columnIndex === 7) {
        return [0, 0];
      }
    },
    addCell: function() {
      let cell = {
        id: ++stepTypeId,
        isRequired: "",
        title: "",
        type: ""
      };
      this.tableForm.push(cell);
      console.log(this.tableForm);
    },
    /**
     * 列表操作
     * @param row
     * @param type
     */
    rowOperation: function(row, opera, type) {
      if (opera === "delete") {
        if (type === "info") {
          this.tableForm.find((item, index) => {
            if (item.id === row.id) {
              this.tableForm.splice(index, 1);
              return true;
            }
          });
        } else if (type === "stepBusiness") {
          this.$ajax
            .post("/api/flowmanage/deleteSteps", { id: row.id })
            .then(res => {
              res = res.data;
              if (res.status === 200) {
                this.$message("删除交易步骤成功");
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      }
    },
    /**
     * 提交表单
     */
    submitForm: function() {
      if (this.modalTitle === "添加交易步骤") {
        let obj = {
          transStepsAttach: this.tableForm
        };
        obj = Object.assign({}, this.stepBusiness, {
          transStepsAttach: JSON.stringify(obj)
        });
        this.$ajax
          .post("/api/flowmanage/insertSteps", obj)
          .then(res => {})
          .catch(error => {
            console.log(error);
          });
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
  /deep/ 
  .el-breadcrumb {
    font-size: 12px;
    font-family: 'MicrosoftYaHei';
    .el-breadcrumb__item {
      .is-link {
        color: rgba(153,161,170,1);
      }
    }
  }
  /deep/
  .el-form {
    background:rgba(255,255,255,1);
    box-shadow:0px 1px 6px 0px rgba(7,47,116,0.1);
    border-radius:4px;
    border: 1px solid transparent;
    margin-top: 22px;
    .selectCity {
      margin-top: 24px;
      line-height: 32px;
      height: 32px;
      .el-form-item__content, 
      .el-form-item__label {
        line-height: 32px;
      }
    }
    .el-select {
      width: 150px;
      height: 32px;
      .el-input {
        height: 100%;
        .el-input__inner {
          height: 100%;
          padding-left: 8px;
        }
        .el-input__icon {
          line-height: 32px;
        }
      }
    }
  } 
    
  .tabs {
    display: flex;
    background:rgba(250,250,251,1);
    font-size: 16px;
    > li {
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      font-family:'MicrosoftYaHei';
      color:rgba(50,72,95,1);
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
</style>
