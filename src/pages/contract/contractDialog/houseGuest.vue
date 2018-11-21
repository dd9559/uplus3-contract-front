<template>
  <div class="view-container">
    <el-dialog :title="title" :visible="getDialogVisible" @close='close' width="1000px">
      <!-- 选择房源弹窗 -->
      <div v-if="getDialogType==='house'" class="dataList">
        <el-form :inline="true" :model="searchForm" class="search-form" size="mini">
          <el-form-item label="关键字：">
            <el-input v-model="searchForm.loupan" placeholder="楼盘名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.loupan" placeholder="楼栋单元"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="keyword" placeholder="房号/房源编号/房东手机"></el-input>
          </el-form-item>
          <el-form-item>
            <span @click="isAttention">我的关注 <span class="attention" :class="{'attention_':attention}"></span></span>
          </el-form-item>
          <el-button round class="search_btn">清空</el-button>
          <el-button type="primary" round class="search_btn" @click="inquireHouse">查询</el-button>
        </el-form>
        <div class="search_content" v-if="dataList.length>0">
          <el-table :data="dataList" border header-row-class-name="theader-bg" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column property="PropertyNo" label="房源编号" width="150"></el-table-column>
            <el-table-column property="EstateName" label="楼盘名称" width="150"></el-table-column>
            <el-table-column label="状态" property="RunningStatus" width="60"></el-table-column>
            <el-table-column property="FloorNum" label="楼层" width="80"></el-table-column>
            <el-table-column property="HouseType" label="房型" width="80"></el-table-column>
            <el-table-column label="面积" width="70">
              <template slot-scope="scope">
                {{scope.row.Square}} ㎡
              </template>
            </el-table-column>
            <el-table-column :label="priceType" width="80">
              <template slot-scope="scope">
                {{scope.row.Price}} {{scope.row.TradeInt===3?'元':'万元'}}
              </template>
            </el-table-column>
            <el-table-column property="DecorateType" label="装修" width="60"></el-table-column>
            <el-table-column property="Emp1" label="维护人"></el-table-column>
          </el-table>
          <el-pagination class="pagination-info" @current-change="handleCurrentChange1" :current-page="1" :page-size="4" layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
        <div class="noList" v-else>
          未查到相关房源
        </div>
      </div>
      <!-- 选择客源弹窗 -->
      <div v-if="getDialogType==='guest'" class="dataList">
        <el-form :inline="true" :model="searchForm" class="search-form_" size="mini">
          <div>
            <el-form-item label="交易：">
              <el-select v-model="guestType" placeholder="" :disabled="contractType!=''">
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
              <el-input v-model="keyword" placeholder="客源编号/手机号/客户姓名"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-button round class="search_btn">清空</el-button>
            <el-button type="primary" round class="search_btn">查询</el-button>
          </div>
        </el-form>
        <div class="search_content" v-if="dataList.length>0">
          <el-table :data="dataList" border header-row-class-name="theader-bg">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column property="CustName" label="姓名"></el-table-column>
            <el-table-column property="InquiryNo" label="客源编号"></el-table-column>
            <el-table-column property="Trade" label="交易">
            </el-table-column>
            <el-table-column property="DistrictName" label="意向区域" min-width="100"></el-table-column>
            <el-table-column :label="priceType" min-width="60">
              <template slot-scope="scope">
                {{scope.row.PriceMin}}-{{scope.row.PriceMax}}{{scope.row.Trade==='求租'?'元':'万元'}}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="pagination-info" @current-change="handleCurrentChange2" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
        <div class="noList" v-else>
          <p v-if="clientStatus===1">未查到相关客源</p>
          <p v-if="clientStatus===2">当前查询的客源为公客，请先在【客源资料】中进行激活<br> （当前查询的客源为已成交的私客，请先在【客源资料】中进行激活）</p>
          <p v-if="clientStatus===3">系统未查询到该客源，您可以<el-button type="text" @click="innerVisible=true">快速添加该客源</el-button>
          </p>
        </div>
        <!-- <div class="floor_btn">
          <el-button round class="search_btn">取消</el-button>
          <el-button type="primary" round class="search_btn">确定</el-button>
        </div> -->
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
      <div class="floor_btn">
        <el-button round class="search_btn" @click="close">取消</el-button>
        <el-button type="primary" round class="search_btn">确定</el-button>
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
      housetType:'',
      //客源类型  1 求租  2 求购
      guestType:'',
      guestTypeList:[
        {label:'求租', value:1},
        {label:'求购', value:2}
      ],
      priceType:'',
      keyword:''
    };
  },
  created() {
    console.log("222");
    if(this.contractType==='求租'){
      this.housetType=3
      this.guestType=1
      this.priceType='租价'
    }else if(this.contractType==='求购'){
      this.housetType=2
      this.guestType=2
      this.priceType='售价'
    }else{
      this.priceType='租/售价'
    }
    if (this.dialogType === "house") {
      this.title = "选择房源";
      this.getHouseList()
    } else if (this.dialogType === "guest") {
      this.title = "选择客源";
      this.getGuestList()
    }
  },
  methods: {
    close() {
      this.$emit("closeHouseGuest");
    },
    //我的关注
    isAttention() {
      this.attention = !this.attention;
      this.getHouseList()
    },
    handleCurrentChange1(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getHouseList()
    },
    handleCurrentChange2(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getGuestList()
    },
    //房源列表
    getHouseList(){
      let param = {
        pageSize:this.pageSize,
        pageIndex:this.currentPage,
        keyword:this.keyword,
        contType:this.housetType,
        isFocus:this.attention
      }
      this.$ajax.get('/api/resource/houses', param).then(res=>{
        res=res.data
        if(res.status===200){
          //alert('222')
          if(res.data.list){
            this.dataList=res.data.list
          }
          this.total=res.data.TotalCount
        }
      })
    },
    //客源列表
    getGuestList(){
      let param = {
        pageSize:this.pageSize,
        pageIndex:this.currentPage,
        type:this.guestType
      }
      this.$ajax.get('/api/resource/customers', param).then(res=>{
        res=res.data
        if(res.status===200){
          //alert('222')
          if(res.data.list){
            this.dataList=res.data.list
          }
          this.total=res.data.TotalCount
        }
      })
    },
    //房源查询
    inquireHouse(){
      this.getHouseList()
    },
    //选中房源客源
    handleSelectionChange(val) {
      console.log(val[0].PropertyCode);
      
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
  .dataList{
    height: 450px;
    overflow-y: auto;
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
.search-form_{
  display: flex;
  justify-content: space-between;
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
</style>