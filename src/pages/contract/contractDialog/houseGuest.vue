<template>
  <div class="view-container">
    <el-dialog :title="title" :visible="getDialogVisible" @close='close' width="1000px">
      <!-- 选择房源弹窗 -->
      <div v-if="getDialogType==='house'">
        <el-form :inline="true" :model="searchForm" class="search-form" size="mini">
          <el-form-item label="关键字：">
            <el-input v-model="searchForm.loupan" placeholder="楼盘字典"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.loupan" placeholder="楼栋单元"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.loupan" placeholder="房号/房源编号/房东手机"></el-input>
          </el-form-item>
          <el-form-item>
            <span @click="isAttention">我的关注 <span class="attention" :class="{'attention_':attention}"></span></span>
          </el-form-item>
          <el-button round class="search_btn">清空</el-button>
          <el-button type="primary" round class="search_btn">查询</el-button>
        </el-form>
        <div class="search_content" v-if="dataList.length>0">
          <el-table :data="houseList" border header-row-class-name="theader-bg">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column property="houseId" label="房源编号" min-width="100"></el-table-column>
            <el-table-column property="houseName" label="楼盘名称" min-width="150"></el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status===1">有效</span>
                <span v-if="scope.row.status===2">无效</span>
              </template>
            </el-table-column>
            <el-table-column property="floor" label="楼层"></el-table-column>
            <el-table-column property="houseType" label="房型"></el-table-column>
            <el-table-column property="area" label="面积"></el-table-column>
            <el-table-column property="price" label="售/租价" min-width="65"></el-table-column>
            <el-table-column property="fitment" label="装修" min-width="60"></el-table-column>
            <el-table-column property="maintainer" label="维护人"></el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-size="4" layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
        <div class="noList" v-else>
          未查到相关房源
        </div>
        <div class="floor_btn">
          <el-button round class="search_btn">取消</el-button>
          <el-button type="primary" round class="search_btn">确定</el-button>
        </div>
      </div>
      <!-- 选择客源弹窗 -->
      <div v-if="getDialogType==='guest'">
        <el-form :inline="true" :model="searchForm" class="search-form_" size="mini">
          <div>
            <el-form-item label="交易：">
              <el-select v-model="searchForm.tradeType" placeholder="">
                <el-option label="求租" value="1"></el-option>
                <el-option label="求购" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字：">
              <el-input v-model="searchForm.keyWord" placeholder="客源编号/手机号/客户姓名"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-button round class="search_btn">清空</el-button>
            <el-button type="primary" round class="search_btn">查询</el-button>
          </div>
          
        </el-form>
        <div class="search_content" v-if="dataList.length>0">
          <el-table :data="clientList" border header-row-class-name="theader-bg">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column property="clientName" label="姓名"></el-table-column>
            <el-table-column property="clientId" label="客源编号"></el-table-column>
            <el-table-column label="交易">
              <template slot-scope="scope">
                <span v-if="scope.row.trade===1">求租</span>
                <span v-if="scope.row.trade===2">求购</span>
              </template>
            </el-table-column>
            <el-table-column property="area" label="意向区域" min-width="100"></el-table-column>
            <el-table-column property="price" label="租/售价" min-width="60"></el-table-column>
          </el-table>
          <el-pagination class="pagination-info" @current-change="handleCurrentChange" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
        <div class="noList" v-else>
          <p v-if="clientStatus===1">未查到相关客源</p>
          <p v-if="clientStatus===2">当前查询的客源为公客，请先在【客源资料】中进行激活<br> （当前查询的客源为已成交的私客，请先在【客源资料】中进行激活）</p>
          <p v-if="clientStatus===3">系统未查询到该客源，您可以<el-button type="text" @click="innerVisible=true">快速添加该客源</el-button>
          </p>
        </div>
        <div class="floor_btn">
          <el-button round class="search_btn">取消</el-button>
          <el-button type="primary" round class="search_btn">确定</el-button>
        </div>
        <!-- 添加客源弹窗 -->
        <el-dialog width="30%" title="添加客源" :visible.sync="innerVisible" :modal="isModel" style="margin-top:150px" append-to-body>
          <el-form :inline="true" :model="addclient" class="search-form" size="mini">
            <el-form-item label="姓名：">
              <el-input v-model="addclient.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号：">
              <el-input v-model="addclient.mobile" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="交易类型：">
              <el-select v-model="addclient.tradeType" placeholder="" style="width:150px">
                <el-option label="求租" value="1"></el-option>
                <el-option label="求购" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用途：">
              <el-select v-model="addclient.tradeType" placeholder="">
                <el-option label="求租" value="1"></el-option>
                <el-option label="求购" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="client_b">
            <el-button round class="search_btn" @click="innerVisible=false">取消</el-button>
            <el-button type="primary" round class="search_btn" @click="innerVisible=false">确定</el-button>
          </div>
        </el-dialog>
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
      clientStatus: 3,
      isModel: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      attention: false
    };
  },
  created() {
    console.log("222");
    if (this.dialogType === "house") {
      this.title = "选择房源";
    } else if (this.dialogType === "guest") {
      this.title = "选择客源";
    }
  },
  methods: {
    close() {
      this.$emit("closeHouseGuest");
    },
    //我的关注
    isAttention() {
      this.attention = !this.attention;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  },
  computed: {
    getDialogVisible: function() {
      return this.dialogVisible;
    },
    getDialogType: function() {
      return this.dialogType;
    }
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";

.view-container {
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
.search-form_{
  display: flex;
  justify-content: space-between;
}
/deep/.el-dialog {
  .el-dialog__header {
    padding-top: 10px;
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
</style>