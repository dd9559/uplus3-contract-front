<template>
  <div class="view-container reissue_chose_person">
    <el-dialog
      title="查看签署状态"
      :visible="getDialogVisible"
      width="900px"
      @close="submit('close')"
      :closeOnClickModal="$tool.closeOnClickModal"
    >
      <div class="table-content">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          ref="tableCom"
          :max-height="tableNumberCom"
          header-row-class-name="theader-bg"
        >
          <el-table-column label="角色" prop="signerTypeName">
          </el-table-column>
          <el-table-column label="姓名" prop="signerName">
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">{{scope.row.signerResult&&scope.row.signerResult.label}}</template>
          </el-table-column>
          <el-table-column label="签署时间">
            <template slot-scope="scope">
              <span v-if="scope.row.signerResultTime">{{scope.row.signerResultTime && scope.row.signerResultTime|formatTime(false)}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="medium"
              ><span @click="reissueNote(scope.row)" v-show="scope.row.show">{{scope.row.signerResult&&scope.row.signerResult.value === 2&&scope.row.ssqSignUrl? '补发签署短信': '-'}}</span>
              <span v-show="!scope.row.show">{{scope.row.count&&scope.row.count}}s</span></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
          <p>合同内容发生变更，我要<span @click="submitDialog=true">重新发起签署</span></p>
          <p>注：一旦重新发起签署，之前已经签署的角色人也需重新签署</p>
      </div>
    </el-dialog>
    <!-- <chosePerson
      :dialogVisible="chosePersonDialog"
      :closeTitle="closeTitle"
      :ownerList="ownerList"
      :localChoseList="localChoseList"
      :contCode="contCode"
      :guestList="guestList"
      :choseQuery="choseQuery"
    ></chosePerson> -->
    <!-- 删除人员确认框 -->
    <el-dialog
      title="确认发起"
      :visible.sync="submitDialog"
      width="460px"
      class="submit_dialog"
      :closeOnClickModal="$tool.closeOnClickModal"
    >
        <div class="submit_content">
            <p>确认合同内容发生变更需要重新发起签署？</p>
            <p style="color:red">内容没有变更无需重新发起签署</p>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="goChosePerson">是，合同内容发生变更</el-button>
        <el-button @click="submitDialog = false" type="primary">否，合同内容没有变更</el-button>
      </span>
    </el-dialog>
  </div>
</template>
           
<script>
import { MIXINS } from "@/assets/js/mixins";
// import chosePerson from "./chosePerson";
export default {
  name: "reissueChosePerson",
  // components: {
  //   chosePerson
  // },
  mixins: [MIXINS],
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    // chosePersonDialog: {
    //   type: Boolean,
    //   default: false,
    // },
    ssqId: {
      type: String,
      default: null,
    },
    // ownerList: {
    //   type: Array,
    //   default() {
    //     return [];
    //   }
    // },
    // guestList: {
    //   type: Array,
    //   default() {
    //     return [];
    //   }
    // },
    choseQuery: {
      type: Object,
      default() {
        return {};
      }
    },
    // contCode: {
    //   type: String,
    //   default() {
    //     return "";
    //   }
    // },
    // localChoseList: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // }
  },
  data() {
    return {
      closeTitle: '重新发起签署',
      tableData: [],
      submitDialog: false,
    };
  },
  created() {
    this.tableData = []
    this.getDictionary(); //字典
  },
  methods: {
    getSignRecords() {
      this.$ajax
        .get("/api/signRecord/getSignRecordsByContractId", {
          contractId: this.ssqId,
        })
        .then((res) => {
          res = res.data;
          if (res.status === 200) {
            this.tableData = res.data.map((item,index) => {
              return Object.assign({show: true,count: '',timer: null,index},item)
            });
          }
        })
        .catch((error) => {
          this.$message(error);
        });
    },
    reissueNote(val) {
      let params = {
        mobilePhone: val.mobilePhone,
        cityId: val.cityId,
        ssqSignUrl: val.ssqSignUrl,
        contType: this.choseQuery.contTypeLabel,
        id: val.id,
      };
      this.$ajax
        .get("/api/signRecord/sendMessage", params)
        .then((res) => {
          res = res.data;
          if (res.status === 200) {
            this.$message('补发签署短信成功');
            this.getCode(val.index)
          }
        })
        .catch((error) => {
          this.$message(error);
        });
    },
    getCode(index){
      const TIME_COUNT = 60;
      if (!this.tableData[index].timer) {
          this.tableData[index].count = TIME_COUNT;
          this.tableData[index].show = false;
          this.tableData[index].timer = setInterval(() => {
            if (this.tableData[index].count > 0 && this.tableData[index].count <= TIME_COUNT) {
            this.tableData[index].count--;
            } else {
            this.tableData[index].show = true;
            clearInterval(this.tableData[index].timer);
            this.tableData[index].timer = null;
            }
          }, 1000)
        }
    },
    submit(type) {
      this.$emit("closeChose", { type: "reissueChosePerson", status: false });
      this.tableData.forEach(element => {
        clearInterval(element.timer);
      });
    },
    goChosePerson() {
      this.submitDialog = false
      this.$emit("closeChose", { type: "reissueChosePerson", status: false });
      this.tableData.forEach(element => {
        clearInterval(element.timer);
      });
      this.$emit("closeChose", {type: 'openChosePersonDialog'});
    }
  },
  watch: {},
  computed: {
    getDialogVisible() {
      if (this.dialogVisible) {
        this.getSignRecords();
      }
      return this.dialogVisible;
    },
  },
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.reissue_chose_person {
    .table-content {
        padding: 20px 6px;
        .el-button {
          padding: 0 20px;
        }
    }
    .footer {
        p {
            text-align: right;
            color: #a7adbf;
        }
        p:first-child {
            font-size: 12px;
            span{
                color: #9bd6ef;
                cursor: pointer;
            }
        }
        p:last-child {
            margin-top: 10px;
            padding-bottom: 20px;
            color: red;
        }
    }
    .submit_dialog {
        .submit_content {
            padding: 30px 0;
            text-align: center;
        }
        /deep/.el-dialog__footer {
            padding: 0;
            margin: 0;
            .el-button {
              width: 49%;
              margin: 0;
              box-sizing: border-box;
              border: none;
              &:nth-child(1) {
                background-color:#fff;
                color:#606266
              }
            }
        }
    }
    

}
</style>