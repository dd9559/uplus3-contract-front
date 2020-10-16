<template>
  <div class="choose">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
      <el-form
        :inline="true"
        :model="searchForm"
        class="prop-form"
        size="small"
      >
        <el-form-item label="体系">
          <el-select
            v-model="searchForm.systemTag"
            placeholder="请选择"
            :clearable="true"
            style="width: 150px"
          >
            <el-option
              v-for="item in systemOpt"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同类型">
          <el-select
            v-model="searchForm.tradeType"
            placeholder="请选择"
            :clearable="true"
            style="width: 150px"
          >
            <el-option label="租赁" value="1"></el-option>
            <el-option label="买卖/代办" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <div class="contract-list">
      <div class="listTitle">
        <span class="title"
          ><i class="iconfont icon-tubiao-11"></i>数据列表</span
        >
        <el-button
          class="btn-info"
          icon="el-icon-plus"
          round
          type="primary"
          size="small"
          @click="addChoose('add')"
          v-if="power['sign-set-bl-jssz-edit'].state"
          >新增结算设置</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        ref="tableCom"
        :max-height="tableNumberCom"
        header-row-class-name="theader-bg"
      >
        <el-table-column label="体系" prop="systemName"></el-table-column>
        <el-table-column label="合同类型" prop="tradeType">
          <template slot-scope="scope">
            {{ scope.row.tradeType === 1 ? "租赁" : "买卖/代办" }}
          </template>
        </el-table-column>
        <el-table-column label="结算设置">
          <template slot-scope="scope">
            <span>{{ scope.row.conditions | chooseRule(scope.row.way) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设置时间" prop="createTime">
          <template slot-scope="scope">{{
            scope.row.createTime | formatTime(false)
          }}</template>
        </el-table-column>
        <el-table-column label="最新修改时间">
          <template slot-scope="scope">
            <span v-if="scope.row.updateTime">{{
              scope.row.updateTime | formatTime(false)
            }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="medium"
              @click="addChoose('edit', scope.row)"
              v-if="power['sign-set-bl-jssz-edit'].state"
              >编辑</el-button
            >
            <p v-else>-</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑/新增 弹窗 -->
    <el-dialog
      class="choose-dialog"
      :title="dialogTitle"
      :visible.sync="dialogAddChoose"
      width="740px"
      :closeOnClickModal="$tool.closeOnClickModal"
      @close="dialogAddChoose = false"
    >
      <div class="dialog-item">
        <p class="form-label system">体系：</p>
        <el-select
          v-model="chooseData.system"
          size="small"
          placeholder="请选择"
          :disabled="type === 'edit'"
          :clearable="type === 'add'"
          style="width: 200px"
        >
          <el-option
            v-for="item in systemOpt"
            :key="item.key"
            :label="item.value"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
      <div
        class="dialog-item flex-item"
        v-if="type === 'add' || (type === 'edit' && tradeType === 1)"
      >
        <div class="left">
          <p class="form-label system">租赁：</p>
          <el-select
            v-model="chooseData.leaseWay"
            size="small"
            placeholder="请选择"
            :clearable="true"
            style="width: 135px"
          >
            <el-option label="人工申请结算" value="1"></el-option>
            <!-- <el-option label="系统自动结算" value="2"></el-option> -->
          </el-select>
        </div>
        <div>
          <el-radio-group v-model="chooseData.leaseConditions">
            <el-radio :label="'1'">存在实收</el-radio>
            <el-radio :label="'2'">佣金收齐</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div
        class="dialog-item flex-item"
        v-if="type === 'add' || (type === 'edit' && tradeType === 2)"
      >
        <div class="left">
          <p class="form-label system">买卖/代办：</p>
          <el-select
            v-model="chooseData.dealWay"
            size="small"
            placeholder="请选择"
            :clearable="true"
            style="width: 135px"
          >
            <el-option label="人工申请结算" value="1"></el-option>
            <!-- <el-option label="系统自动结算" value="2"></el-option> -->
          </el-select>
        </div>
        <div>
          <el-radio-group v-model="chooseData.dealConditions">
            <el-radio :label="'1'">存在实收</el-radio>
            <el-radio :label="'2'">佣金收齐</el-radio>
            <el-radio :label="'1,3'">过户且存在实收</el-radio>
            <el-radio :label="'2,3'">过户且佣金收齐</el-radio>
            <el-radio :label="'1,4'">结案且存在实收</el-radio>
            <el-radio :label="'2,4'">结案且佣金收齐</el-radio>
          </el-radio-group>
        </div>
      </div>
      <p style="color: red">
        注：设置新的结算设置成功后，原来的结算设置被替换。
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="dialogAddChoose = false">取消</el-button>
        <el-button
          round
          type="primary"
          v-if="type === 'add'"
          @click="save('add')"
          >保存</el-button
        >
        <el-button round type="primary" v-else @click="save('edit')"
          >保存</el-button
        >
      </span>
    </el-dialog>
    <!-- 保存比例确认框 -->
    <el-dialog
      title="确认保存"
      :visible.sync="dialogSave"
      class="ratioMsg"
      width="500px"
      :closeOnClickModal="$tool.closeOnClickModal"
    >
      <div class="warning-box">
        <p>确认{{ type === "add" ? "保存" : "修改" }}该结算设置？</p>
        <p style="color: red; margin-bottom: 12px">
          新的结算设置会覆盖原来的结算设置
        </p>
        <ul>
          <li>
            <p
              v-if="type === 'add' || (type === 'edit' && tradeType === 1)"
              style="color: red"
            >
              租赁：{{
                chooseData.leaseConditions | chooseRule(chooseData.leaseWay)
              }}
            </p>
            <p
              v-if="type === 'add' || (type === 'edit' && tradeType === 2)"
              style="color: red"
            >
              买卖/代办：{{
                chooseData.dealConditions | chooseRule(chooseData.dealWay)
              }}
            </p>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="dialogSave = false">取消</el-button>
        <el-button round type="primary" @click="addEdit">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { MIXINS } from "@/assets/js/mixins";
import { TOOL } from "@/assets/js/common";
export default {
  name: "choose",
  mixins: [MIXINS],
  props: {
    systemArr: {
      type: Array,
      default: function () {
        return [];
      },
    },
    systemOpt: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      dialogAddChoose: false,
      dialogSave: false,
      searchForm: {
        systemTag: "",
        tradeType: "",
      },
      tableData: [],
      dictionary: {
        //数据字典
        71: "", //合同类型（筛选条件）
      },
      systemType: "", //弹窗体系
      radio: "",
      dialogTitle: "新增结算设置",
      chooseData: {
        system: null,
        leaseWay: -1, // 租赁结算方式
        leaseConditions: "", // 租赁结算条件
        dealWay: -1, // 买卖/代办结算方式
        dealConditions: "", // 买卖/代办结算条件
      },
      settlementFrom: {},
      type: "add",
      tradeType: "",
      addSystemOpt: [],
      // cityId: '',
      //权限配置
      power: {
        "sign-set-bl-jssz-edit": {
          state: false,
          name: "结算设置新增/编辑",
        },
      },
    };
  },
  filters: {
    chooseRule: function (conditions, way) {
      console.log(conditions, way);
      let mag = "";
      mag = way.toString() === "1" ? "人工申请结算-" : "系统自动结算-";
      switch (conditions) {
        case "1":
          mag += "存在实收";
          break;
        case "2":
          mag += "佣金收齐";
          break;
        case "1,3":
          mag += "过户且存在实收";
          break;
        case "2,3":
          mag += "过户且佣金收齐";
          break;
        case "1,4":
          mag += "结案且存在实收";
          break;
        case "2,4":
          mag += "结案且佣金收齐";
          break;
        default:
          "-";
          break;
      }
      return mag;
    },
  },
  created() {
    this.getDictionary();
    // this.cityId = JSON.parse(sessionStorage.getItem('userMsg')).user.cityId
    let res = this.getDataList;
    if (res && res.route === this.$route.path) {
      let session = JSON.parse(sessionStorage.getItem("sessionQuery"));
      let query = session.query;
      this.tableData = res.data.list;
      this.searchForm.systemTag = query.systemTag;
      this.searchForm.tradeType = query.tradeType;
    } else {
      // 列表
      this.getData();
    }
  },
  methods: {
    queryFn() {
      this.getData("search");
    },
    resetFormFn() {
      this.searchForm.systemTag = "";
      this.searchForm.tradeType = "";
    },
    getData(type = "init") {
      let settlementSetDO = {
        systemTag: this.searchForm.systemTag,
        tradeType: this.searchForm.tradeType,
      };
      //点击查询时，缓存筛选条件
      if (type === "search") {
        sessionStorage.setItem(
          "sessionQuery",
          JSON.stringify({
            path: "/divideRatio",
            url: "/settlement/listSettlement",
            query: settlementSetDO,
          })
        );
      }

      this.$ajax
        .postJSON("/api/settlement/listSettlement", settlementSetDO)
        .then((res) => {
          res = res.data;
          if (res.status === 200) {
            this.tableData = res.data.list;
          }
        })
        .catch((error) => {
          this.$message({ message: error });
        });
    },
    addChoose(type, item) {
      this.type = type;
      for (const key in this.chooseData) {
        if (this.chooseData.hasOwnProperty(key)) {
          if (key === "system") {
            this.chooseData[key] = null;
          } else if (key === "leaseWay" || key === "dealWay") {
            this.chooseData[key] = "1";
          } else {
            this.chooseData[key] = "";
          }
        }
      }
      if (type === "edit") {
        this.chooseData.id = item.id;
        this.tradeType = item.tradeType;
        this.chooseData.system = {
          key: item.systemTag,
          value: item.systemName,
        };
        // this.chooseData.cityId = item.cityId
        if (item.tradeType === 1) {
          this.chooseData.leaseWay = item.way.toString();
          this.chooseData.leaseConditions = item.conditions;
        } else {
          this.chooseData.dealWay = item.way.toString();
          this.chooseData.dealConditions = item.conditions;
        }
      }
      this.dialogAddChoose = true;
    },
    save(type) {
      this.settlementFrom = {};
      let settlementSetTypes = [];
      let leaseData = {};
      let dealData = {};
      if (type === "add") {
        if (
          !this.chooseData.system ||
          this.chooseData.leaseWay === "" ||
          this.chooseData.leaseConditions === "" ||
          this.chooseData.dealWay === "" ||
          this.chooseData.dealConditions === ""
        ) {
          return this.$message({
            type: "warning",
            message: "请填写完整信息",
          });
        }
      } else {
        if (
          this.tradeType === 1 &&
          (this.chooseData.leaseWay === "" ||
            this.chooseData.leaseConditions === "")
        ) {
          return this.$message({
            type: "warning",
            message: "请填写完整信息",
          });
        } else if (
          this.tradeType === 2 &&
          (this.chooseData.dealWay === "" ||
            this.chooseData.dealConditions === "")
        ) {
          return this.$message({
            type: "warning",
            message: "请填写完整信息",
          });
        }
      }
      this.settlementFrom = {
        // cityId: this.cityId,
        tradeType: this.tradeType,
        systemTag: this.chooseData.system.key,
        systemName: this.chooseData.system.value,
      };
      if (type === "edit") {
        this.settlementFrom.id = this.chooseData.id;
        if (this.tradeType === 1) {
          this.settlementFrom["way"] = Number.parseInt(
            this.chooseData.leaseWay
          );
          this.settlementFrom["conditions"] = this.chooseData.leaseConditions;
        } else {
          this.settlementFrom["way"] = Number.parseInt(this.chooseData.dealWay);
          this.settlementFrom["conditions"] = this.chooseData.dealConditions;
        }
      } else {
        leaseData["tradeType"] = 1;
        leaseData["way"] = Number.parseInt(this.chooseData.leaseWay);
        leaseData["conditions"] = this.chooseData.leaseConditions;

        dealData["tradeType"] = 2;
        dealData["way"] = Number.parseInt(this.chooseData.dealWay);
        dealData["conditions"] = this.chooseData.dealConditions;
        settlementSetTypes.push(leaseData, dealData);
        this.settlementFrom["settlementSetTypes"] = settlementSetTypes;
      }
      this.dialogSave = true;
    },
    addEdit() {
      let url = "";
      url = this.type === "add" ? "insertSettlement" : "updateSettlement";
      this.$ajax
        .postJSON(`/api/settlement/${url}`, this.settlementFrom)
        .then((res) => {
          if (res.status === 200) {
            this.$message({
              type: "success",
              message: res.data.message,
            });
            this.getData();
          }
        })
        .catch((error) => {
          this.$message({ message: error });
        });
      this.dialogSave = false;
      this.dialogAddChoose = false;
    },
  },
};
</script>

<style scoped lang="less">
@import "~@/assets/common.less";
.choose {
  .contract-list {
    background-color: #fff;
    padding: 0 10px;
    border-radius: 2px;
    // box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  }
  .listTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
  }
  .choose-dialog {
    /deep/ .el-dialog__body {
      padding: 20px;
      border-bottom: 1px solid #edecf0;
    }
    .dialog-item + .dialog-item {
      margin: 18px 0;
    }
    .flex-item {
      display: flex;
      align-items: flex-end;
      .left {
        margin-right: 20px;
      }
    }
  }
  .warning-box {
    text-align: center;
  }
  /deep/ .el-radio {
    margin-top: 4px;
  }
  /deep/ .el-table th {
    background: #eef2fb;
  }
}
</style>