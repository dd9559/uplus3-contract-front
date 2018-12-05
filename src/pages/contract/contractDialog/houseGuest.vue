<template>
  <div class="view-container">
    <el-dialog
      :title="title"
      :visible="getDialogVisible"
      @close='close'
      width="1000px"
    >
      <!-- 选择房源弹窗 -->
      <div
        v-if="getDialogType==='house'"
        class="dataList"
      >
        <el-form
          :inline="true"
          :model="searchForm"
          class="search-form"
          size="mini"
        >
          <el-form-item label="关键字：">
            <el-select
              v-model="estateCode"
              :multiple='false'
              clearable
              filterable
              remote
              reserve-keyword
              @change="getBuildList"
              placeholder="楼盘名称"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in options"
                :key="item.EstateCode"
                :label="item.EstateName"
                :value="item.EstateCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="BuildingCode"
              placeholder="楼栋单元"
              :clearable="true"
            >
              <el-option
                v-for="item in buildList"
                :key="item.BuildingCode"
                :label="item.BuildingName"
                :value="item.BuildingCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="houseKeyword"
              placeholder="房号/房源编号/房东手机"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <span @click="isAttention">我的关注 <span
                class="attention"
                :class="{'attention_':attention}"
              ></span></span>
          </el-form-item>
          <el-button
            round
            class="search_btn"
            @click="resetFormFn"
          >清空</el-button>
          <el-button
            type="primary"
            round
            class="search_btn"
            @click="inquireHouse"
          >查询</el-button>
        </el-form>
        <div
          class="search_content"
          v-loading="loading_"
        >
          <el-table
            :data="dataList"
            border
            header-row-class-name="theader-bg"
            @row-click="selectItem"
            v-if="showDataList"
            :row-class-name="tableRowClassName"
          >
            <el-table-column width="40">
              <template slot-scope="scope">
                <span class="outSide">
                  <span
                    class="inLine"
                    :class="{'inLineBg':selectCode===scope.row.PropertyCode}"
                  ></span>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="PropertyNo"
              label="房源编号"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="EstateName"
              label="楼盘名称"
              width="150"
            ></el-table-column>
            <el-table-column
              label="状态"
              prop="RunningStatus"
              width="60"
            ></el-table-column>
            <el-table-column
              prop="FloorNum"
              label="楼层"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="HouseType"
              label="房型"
              width="80"
            ></el-table-column>
            <el-table-column
              label="面积"
              width="70"
            >
              <template slot-scope="scope">
                {{scope.row.Square}} ㎡
              </template>
            </el-table-column>
            <el-table-column
              :label="priceType"
              width="80"
            >
              <template slot-scope="scope">
                {{scope.row.Price}} {{scope.row.TradeInt===3?'元':'万元'}}
              </template>
            </el-table-column>
            <el-table-column
              prop="DecorateType"
              label="装修"
              width="60"
            ></el-table-column>
            <el-table-column
              prop="Emp1"
              label="维护人"
            ></el-table-column>
          </el-table>
          <el-pagination
            class="pagination-info"
            @current-change="handleCurrentChange1"
            :current-page="1"
            :page-size="4"
            layout="total, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>

        </div>
        <div
          class="noList"
          v-if="!showDataList"
        >
          未查到相关房源
        </div>
      </div>
      <!-- 选择客源弹窗 -->
      <div
        v-if="getDialogType==='guest'"
        class="dataList"
      >
        <el-form
          :inline="true"
          :model="searchForm"
          class="search-form_"
          size="mini"
        >
          <div>
            <el-form-item label="交易：">
              <el-select
                v-model="guestType"
                placeholder=""
                :disabled="contractType!=''"
              >
                <el-option
                  v-for="item in guestTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字：">
              <el-input
                v-model="guestKeyword"
                placeholder="客源编号/手机号/客户姓名"
              ></el-input>
            </el-form-item>
          </div>
          <div>
            <el-button
              round
              class="search_btn"
              @click="resetFormFn"
            >清空</el-button>
            <el-button
              type="primary"
              round
              class="search_btn"
              @click="inquireGuest"
            >查询</el-button>
          </div>
        </el-form>
        <div
          class="search_content"
          v-loading="loading_"
        >
          <el-table
            :data="dataList"
            border
            header-row-class-name="theader-bg"
            @row-click="selectItem"
            v-if="showDataList"
          >
            <el-table-column width="40">
              <template slot-scope="scope">
                <span class="outSide">
                  <span
                    class="inLine"
                    :class="{'inLineBg':selectCode===scope.row.InquiryCode}"
                  ></span>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="CustName"
              label="姓名"
            ></el-table-column>
            <el-table-column
              prop="InquiryNo"
              label="客源编号"
            ></el-table-column>
            <el-table-column
              prop="Trade"
              label="交易"
            >
            </el-table-column>
            <el-table-column
              prop="DistrictName"
              label="意向区域"
              min-width="100"
            ></el-table-column>
            <el-table-column
              :label="priceType"
              min-width="60"
            >
              <template slot-scope="scope">
                {{scope.row.PriceMin}}-{{scope.row.PriceMax}}{{scope.row.Trade==='求租'?'元':'万元'}}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="pagination-info"
            @current-change="handleCurrentChange2"
            :current-page="currentPage"
            layout="total, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
        <div
          class="noList"
          v-if="!showDataList"
        >
          <p v-if="clientStatus===1">未查到相关客源</p>
          <p v-if="clientStatus===2">当前查询的客源为公客，请先在【客源资料】中进行激活<br> （当前查询的客源为已成交的私客，请先在【客源资料】中进行激活）</p>
          <p v-if="clientStatus===3">系统未查询到该客源，您可以<el-button
              type="text"
              @click="innerVisible=true"
            >快速添加该客源</el-button>
          </p>
        </div>
        <!-- <div class="floor_btn">
          <el-button round class="search_btn">取消</el-button>
          <el-button type="primary" round class="search_btn">确定</el-button>
        </div> -->
        <!-- 添加客源弹窗 -->
        <el-dialog
          width="30%"
          title="添加客源"
          :visible.sync="innerVisible"
          :modal="isModel"
          style="margin-top:150px"
          append-to-body
        >
          <el-form
            :inline="true"
            :model="addclient"
            class="search-form"
            size="mini"
          >
            <el-form-item label="姓名：">
              <el-input
                v-model="addclient.name"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号：">
              <el-input
                v-model="addclient.mobile"
                placeholder="请输入手机号"
              ></el-input>
            </el-form-item>
            <el-form-item label="交易类型：">
              <el-select
                v-model="addclient.tradeType"
                placeholder=""
                style="width:150px"
              >
                <el-option
                  label="求租"
                  value="1"
                ></el-option>
                <el-option
                  label="求购"
                  value="2"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用途：">
              <el-select
                v-model="addclient.tradeType"
                placeholder=""
              >
                <el-option
                  label="求租"
                  value="1"
                ></el-option>
                <el-option
                  label="求购"
                  value="2"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="client_b">
            <el-button
              round
              class="search_btn"
              @click="innerVisible=false"
            >取消</el-button>
            <el-button
              type="primary"
              round
              class="search_btn"
              @click="innerVisible=false"
            >确定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="floor_btn">
        <el-button
          round
          class="search_btn"
          @click="close"
        >取消</el-button>
        <el-button
          type="primary"
          round
          class="search_btn"
          @click="confirm"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
           
<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogType: {
      type: String,
      default: "" //房源 house  客源 guest
    },
    contractType: {
      type: String,
      default: "" //求租  求购
    }
  },
  data() {
    return {
      title: "",
      //查询表单
      searchForm: {},
      //房源客源列表
      dataList: [],
      //添加客源信息
      addclient: {},
      //添加客源弹窗
      innerVisible: false,
      clientStatus: 1,
      isModel: false,
      currentPage: 1,
      pageSize: 5,
      total: 0,
      attention: false,
      //房源类型  2 出售  3 租价
      housetType: "",
      //客源类型  1 求租  2 求购
      guestType: "",
      guestTypeList: [{ label: "求租", value: 1 }, { label: "求购", value: 2 }],
      priceType: "",
      houseKeyword: "",
      guestKeyword: "",
      //楼盘
      options: [],
      loading: false,
      //楼盘id
      estateCode: "",
      //楼栋
      buildList: [],
      //楼栋id
      BuildingCode: "",
      selectCode: "",
      loading_: false,
      showDataList: true
    };
  },
  created() {
    console.log("222");
    if (this.contractType === "求租") {
      this.housetType = 3;
      this.guestType = 1;
      this.priceType = "租价";
    } else if (this.contractType === "求购") {
      this.housetType = 2;
      this.guestType = 2;
      this.priceType = "售价";
    } else {
      this.priceType = "租/售价";
    }
    if (this.dialogType === "house") {
      this.title = "选择房源";
      this.getHouseList();
    } else if (this.dialogType === "guest") {
      this.title = "选择客源";
      this.getGuestList();
    }
  },
  methods: {
    close() {
      this.$emit("closeHouseGuest");
    },
    //我的关注
    isAttention() {
      this.attention = !this.attention;
      this.getHouseList();
    },
    handleCurrentChange1(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getHouseList();
    },
    handleCurrentChange2(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getGuestList();
    },
    //房源列表
    getHouseList() {
      this.loading_ = true;
      let param = {
        pageSize: this.pageSize,
        pageIndex: this.currentPage,
        keyword: this.houseKeyword,
        contType: this.housetType,
        isFocus: this.attention,
        estateCode: this.estateCode,
        buildingCode: this.BuildingCode
      };
      this.$ajax.get("/api/contract/houses", param).then(res => {
        res = res.data;
        this.loading_ = false;
        if (res.status === 200) {
          //alert('222')
          this.dataList = [];
          if (res.data.TotalCount > 0) {
            this.dataList = res.data.list;
          } else {
            this.dataList = [];
            this.showDataList = false;
          }
          this.total = res.data.TotalCount;
        }
      });
    },
    //客源列表
    getGuestList() {
      this.loading_ = true;
      let param = {
        pageSize: this.pageSize,
        pageIndex: this.currentPage,
        type: this.guestType,
        keyword: this.guestKeyword
      };
      this.$ajax.get("/api/resource/customers", param).then(res => {
        this.loading_ = false;
        res = res.data;
        if (res.status === 200) {
          //alert('222')
          if (res.data.list.length > 0) {
            this.dataList = res.data.list;
          } else {
            this.showDataList = false;
          }
          this.total = res.data.TotalCount;
        }
      });
    },
    //楼盘名称
    remoteMethod(query) {
      this.options = [];
      this.buildList = [];
      if (query !== "") {
        this.loading = true;
        let param = {
          keyword: query
        };
        this.$ajax.get("/api/resource/buildings", param).then(res => {
          res = res.data;
          this.loading = false;
          if (res.status === 200) {
            this.options = res.data;
          }
        });
      }
    },
    //楼栋
    getBuildList(id) {
      console.log(id);
      this.buildList = [];
      this.BuildingCode = "";
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].EstateCode === id) {
          this.buildList = this.options[i].BuildingList;
        }
      }
    },
    //房源查询
    inquireHouse() {
      this.getHouseList();
    },
    //客源查询
    inquireGuest() {
      this.getGuestList();
    },
    //选中房源客源
    selectItem(value) {
      console.log(value);
      if (this.dialogType === "house") {
        if (value.invalid) {
          if (this.selectCode === value.PropertyCode) {
            this.selectCode = "";
          } else {
            this.selectCode = value.PropertyCode;
          }
        } else {
          this.$message({
            message: "不能选择已锁定房源"
          });
        }
      } else if (this.dialogType === "guest") {
        if (this.selectCode === value.InquiryCode) {
          this.selectCode = "";
        } else {
          this.selectCode = value.InquiryCode;
        }
      }
    },
    //确定选择
    confirm() {
      if (this.selectCode) {
        this.$emit("closeHouseGuest", {
          selectCode: this.selectCode,
          dialogType: this.dialogType
        });
      } else {
        if (this.dialogType === "house") {
          this.$alert("请先选择房源", "提示", {
            confirmButtonText: "确定"
          });
        } else if (this.dialogType === "guest") {
          this.$alert("请先选择带看客源", "提示", {
            confirmButtonText: "确定"
          });
        }
      }
    },
    //重置
    resetFormFn() {
      // contType:this.housetType,
      // isFocus:this.attention,
      // estateCode:this.estateCode,
      // buildingCode:this.BuildingCode
      this.houseKeyword = "";
      this.guestKeyword = "";
      this.attention = false;
      this.estateCode = "";
      this.BuildingCode = "";
      this.options = [];
      this.buildList = [];
    },
    tableRowClassName({ row, rowIndex }) {
      if (!row.invalid) {
        return "warning-row";
      }
    }
  },
  computed: {
    getDialogVisible: function() {
      return this.dialogVisible;
    },
    getDialogType: function() {
      return this.dialogType;
    },
    getContractType: function() {
      return this.contractType;
    }
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";

.view-container {
  .search_content {
    min-height: 300px;
  }
  .dataList {
    height: 360px;
    overflow-y: auto;
  }
  .outSide {
    display: flex;
    justify-content: center;
    align-items: center;
    //box-sizing: border-box;
    //padding: 2px;
    width: 18px;
    height: 18px;
    border: 1px solid #ccc;
    border-radius: 50%;
    .inLine {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .inLineBg {
      background: @color-blue;
    }
  }
  .search_btn {
    padding: 8px 20px;
  }
  .attention {
    display: inline-block;
    width: 10px;
    height: 10px;
    border: 1px solid #ccc;
    border-radius: 2px;
  }
  .attention_ {
    background: @color-blue;
  }
  .floor_btn {
    padding: 10px 0;
    overflow: hidden;
    display: flex;
    justify-content: flex-end;
    //float: right;
  }
  .noList {
    background: #dedde2;
    padding: 148px 0;
    text-align: center;
  }
}
.search-form_ {
  display: flex;
  justify-content: space-between;
}
/deep/.warning-row {
  background: oldlace;
}
/deep/.el-dialog {
  .el-dialog__header {
    padding-top: 15px;
    padding-bottom: 15px;
    .el-dialog__title {
      color: @color-blue;
    }
  }
  .el-dialog__body {
    padding-top: 20px;
    border-top: 1px solid #edecf0;
  }
  .client_b {
    display: flex;
    justify-content: flex-end;
    .el-button.is-round {
      padding: 8px 20px;
    }
  }
}
/deep/ .pagination-info {
  text-align: center;
  margin-top: 30px;
}
</style>