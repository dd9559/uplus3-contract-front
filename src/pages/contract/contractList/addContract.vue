<template>
  <div class="view-container">
    <el-form :inline="true" :model="addForm" :rules="rules" ref="ruleForm" class="add-form" size="mini">
      <!-- 合同信息 -->
      <div class="contractMsg">
        <p>合同信息</p>
        <div class="form-content">
          <el-form-item label="签约日期：" prop="date">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.date" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="合同类型：">
            <el-input
              placeholder="请输入内容"
              v-model="addForm.contType"
              :disabled="true">
            </el-input>
          </el-form-item>
          <el-form-item label="成交总价：" prop="">
            <el-input v-model="addForm.dealPrice" placeholder="请输入内容"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="客户保证金：" prop="">
            <el-input v-model="addForm.dealPrice" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="客户佣金：" prop="">
            <el-input v-model="addForm.custCommission" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="业主佣金：" prop="">
            <el-input v-model="addForm.ownerCommission" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="佣金支付费：" prop="">
            <el-input v-model="addForm.commissionPayment" placeholder="请输入内容"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="交易流程：" prop="">
            <el-select v-model="addForm.jylc" placeholder="请选择交易流程">
              <el-option label="一次性（业）+ 按揭（客）" value="1"></el-option>
            </el-select>  
          </el-form-item>
          <el-form-item label="按揭手续费：" prop="">
            <el-select v-model="addForm.sxf1" placeholder="" class="sxf_1">
              <el-option label="另外出" value="1"></el-option>
              <el-option label="佣金扣" value="2"></el-option>
              <el-option label="无" value="3"></el-option>
            </el-select>  
            <el-select v-model="addForm.sxf2" placeholder="" class="sxf_2">
              <el-option label="客户" value="1"></el-option>
              <el-option label="业主" value="2"></el-option>
              <el-option label="无" value="3"></el-option>
            </el-select>  
            <el-input v-model="addForm.sxf3" placeholder="" class="sxf_3"></el-input>  
          </el-form-item>
        </div>
      </div>
      <!-- 房源信息 -->
      <div class="houseMsg">
        <p>房源信息</p>
        <div class="form-content">
          <el-form-item label="房源编号：" prop="">
            <span class="select" @click="dialogTableVisible1=true">请选择房源</span> 
          </el-form-item>
          <el-form-item label="物业地址：">
            <el-input
              placeholder="请输入内容"
              v-model="addForm.contType"
              :disabled="true" class="address">
            </el-input>
          </el-form-item>
          <br>
          <el-form-item label="建筑面积：" prop="">
            <el-input v-model="addForm.architectureArea" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="套内面积：" prop="">
            <el-input v-model="addForm.insideArea" placeholder="请输入内容"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="产权状态：" prop="">
            <el-select v-model="addForm.cqzt" placeholder="请选择状态">
              <el-option label="抵押" value="1"></el-option>
            </el-select>  
          </el-form-item>
          <el-form-item label="按揭银行：" prop="">
            <el-select v-model="addForm.ajyh" placeholder="请选择银行">
              <el-option label="中国工商银行" value="1"></el-option>
              <el-option label="中国建设银行" value="2"></el-option>
              <el-option label="中国银行" value="3"></el-option>
              <el-option label="中国农业银行" value="4"></el-option>
              <el-option label="交通银行" value="5"></el-option>
              <el-option label="招商银行" value="6"></el-option>
              <el-option label="中信银行" value="7"></el-option>
              <el-option label="中国民生银行" value="8"></el-option>
              <el-option label="兴业银行" value="9"></el-option>
              <el-option label="上海浦东发展银行" value="10"></el-option>
              <el-option label="中国邮政储蓄银行" value="11"></el-option>
              <el-option label="中国光大银行" value="12"></el-option>
              <el-option label="平安银行" value="13"></el-option>
              <el-option label="华夏银行" value="14"></el-option>
            </el-select>  
          </el-form-item>
          <el-form-item label="按揭欠款：" prop="">
            <el-input v-model="addForm.ajqk" placeholder="请输入内容"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="产权地址：" prop="">
            <el-input v-model="addForm.cqdz" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="房产证号：" prop="">
            <el-input v-model="addForm.property" placeholder="请输入内容"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="房源方门店：" prop="">
            <el-select v-model="addForm.houseStoreId" placeholder="请选择状态">
              <el-option label="光谷一店" value="1"></el-option>
            </el-select>  
          </el-form-item>
          <el-form-item label="店长：" prop="">
              {{addForm.shopownerName}}{{addForm.shopownerMobile}}
          </el-form-item>
          <br>
          <el-form-item label="业主信息：" prop="">
            <ul class="peopleMsg">
              <li v-for="(item,index) in addForm.contPersons" :key="index">
                <span class="merge">
                  <input v-model="item.name" placeholder="姓名" class="name_">
                  <input v-model="item.mobile" placeholder="电话" class="mobile_">
                </span>
                <el-select v-model="addForm.houseStoreId" placeholder="关系" class="relation_">
                  <el-option label="本人" value="1"></el-option>
                </el-select> 
                <input v-model="addForm.property" placeholder="产权比" class="rate_">
                <input v-model="item.idCard" placeholder="身份证号" class="idCard_">
                <span @click.stop="addcommissionData" class="icon">
                  <i class="el-icon-plus"></i>
                </span>
                <span @click.stop="deleteRowcommissionData(index)" v-if="addForm.contPersons.length>1" class="icon delete">
                  <i class="el-icon-minus"></i>
                </span>
              </li>
            </ul>
          </el-form-item>
        </div>
      </div>
      <!-- 客源信息 -->
      <div class="houseMsg">
        <p>客源信息</p>
        <div class="form-content">
          <el-form-item label="客源编号：" prop="">
            <span class="select" @click="dialogTableVisible2=true">请选择客源</span> 
          </el-form-item>
          <el-form-item label="付款方式：" prop="">
            <el-select v-model="addForm.houseStoreId" placeholder="请选择状态">
              <el-option label="全款" value="1"></el-option>
            </el-select>  
          </el-form-item>
          <br>
          <el-form-item label="客源方门店：" prop="">
            <el-select v-model="addForm.paymentMethod" placeholder="请选择状态">
              <el-option label="光谷一店" value="1"></el-option>
            </el-select>  
          </el-form-item>
          <el-form-item label="店长：" prop="">
              {{addForm.shopownerName}}{{addForm.shopownerMobile}}
          </el-form-item>
          <br>
          <el-form-item label="客户信息：" prop="">
            <ul class="peopleMsg">
              <li v-for="(item,index) in addForm.contPersons" :key="index">
                <span class="merge">
                  <input v-model="item.name" placeholder="姓名" class="name_">
                  <input v-model="item.mobile" placeholder="电话" class="mobile_">
                </span>
                <el-select v-model="addForm.houseStoreId" placeholder="关系" class="relation_">
                  <el-option label="本人" value="1"></el-option>
                </el-select> 
                <input v-model="addForm.property" placeholder="产权比" class="rate_">
                <input v-model="item.idCard" placeholder="身份证号" class="idCard_">
                <span @click.stop="addcommissionData" class="icon">
                  <i class="el-icon-plus"></i>
                </span>
                <span @click.stop="deleteRowcommissionData(index)" v-if="addForm.contPersons.length>1" class="icon delete">
                  <i class="el-icon-minus"></i>
                </span>
              </li>
            </ul>
          </el-form-item>
        </div>
      </div>
      <!-- 三方合作 -->
      <div class="houseMsg">
        <p>三方合作</p>
        <div class="form-content">
          <el-form-item label="扣合作费：" prop="">
            <el-input v-model="addForm.aaa" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="类型：" prop="">
            <el-select v-model="addForm.type" placeholder="请选择">
              <el-option label="客户转" value="1"></el-option>
            </el-select>  
          </el-form-item>
          <br>
          <el-form-item label="合作方姓名：" prop="">
            <el-input v-model="addForm.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="联系方式：" prop="">
            <el-input v-model="addForm.mobile" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="身份证号：" prop="">
            <el-input v-model="addForm.identifyCode" placeholder="请输入内容"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="备注：" prop="">
            <el-input type="textarea" :rows="4" v-model="addForm.desc" clear="textarea" placeholder="无备注内容"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="btn">
        <p>录入时间：{{111}} 录入人： 最后修改：</p>
        <p>
          <el-button round>预览</el-button>
          <el-button type="success" round>提交审核</el-button>
          <el-button type="primary" round @click="submitForm('ruleForm')">保存</el-button>
        </p>
        
      </div>
    </el-form>
    <!-- 选择房源弹窗 -->
    <el-dialog title="选择房源" :visible.sync="dialogTableVisible1">
      <el-form :inline="true" :model="searchForm1" class="search-form" size="mini">
        <el-form-item label="关键字：">
          <el-input v-model="searchForm1.loupan" placeholder="楼盘字典"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm1.loupan" placeholder="楼栋单元"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm1.loupan" placeholder="房号/房源编号/房东手机"></el-input>
        </el-form-item>
        <el-form-item>
          <span @click="isAttention">我的关注 <span class="attention" :class="{'attention_':attention}"></span></span>
        </el-form-item>
        <el-button round class="search_btn">清空</el-button>
        <el-button type="primary" round class="search_btn">查询</el-button>
      </el-form>
      <div class="search_content" v-if="houseList.length>0">
        <el-table :data="houseList" border>
          <el-table-column type="selection" width="59"></el-table-column>
          <el-table-column property="houseId" label="房源编号" width="100"></el-table-column>
          <el-table-column property="houseName" label="楼盘名称" width="150"></el-table-column>
          <el-table-column label="状态" width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.status===1">有效</span>
              <span v-if="scope.row.status===2">无效</span>
            </template>
          </el-table-column>
          <el-table-column property="floor" label="楼层" width="100"></el-table-column>
          <el-table-column property="houseType" label="房型" width="100"></el-table-column>
          <el-table-column property="area" label="面积" width="100"></el-table-column>
          <el-table-column property="price" label="售/租价" width="80"></el-table-column>
          <el-table-column property="fitment" label="装修" width="80"></el-table-column>
          <el-table-column property="maintainer" label="维护人" width="100"></el-table-column>
        </el-table>
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-size="4"
        layout="total, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
      </div>
      <div class="noList" v-else>
        未查到相关房源
      </div>
      <div class="floor_btn">
        <el-button round class="search_btn">取消</el-button>
        <el-button type="primary" round class="search_btn">确定</el-button>
      </div>
    </el-dialog>

    <!-- 选择客源弹窗 -->
    <el-dialog title="选择客源" :visible.sync="dialogTableVisible2">
      <el-form :inline="true" :model="searchForm2" class="search-form" size="mini">
        <el-form-item label="交易：">
          <el-select v-model="searchForm2.tradeType" placeholder="">
            <el-option label="求租" value="1"></el-option>
            <el-option label="求购" value="2"></el-option>
          </el-select>  
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input v-model="searchForm2.keyWord" placeholder="客源编号/手机号/客户姓名"></el-input>
        </el-form-item>
        <el-button round class="search_btn">清空</el-button>
        <el-button type="primary" round class="search_btn">查询</el-button>
      </el-form>
      <div class="search_content" v-if="clientList.length>0">
        <el-table :data="clientList" border>
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column property="clientName" label="姓名" width="150"></el-table-column>
          <el-table-column property="clientId" label="客源编号" width="200"></el-table-column>
          <el-table-column label="交易" width="168">
            <template slot-scope="scope">
              <span v-if="scope.row.trade===1">求租</span>
              <span v-if="scope.row.trade===2">求购</span>
            </template>
          </el-table-column>
          <el-table-column property="area" label="意向区域" width="200"></el-table-column>
          <el-table-column property="price" label="租/售价" width="150"></el-table-column>
        </el-table>
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-size="4"
        layout="total, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
      </div>
      <div class="noList" v-else>
        未查到相关房源
      </div>
      <div class="floor_btn">
        <el-button round class="search_btn">取消</el-button>
        <el-button type="primary" round class="search_btn">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
           
<script>
export default {
  data(){
    return{
      addForm:{
        contPersons:[
          {name:'张三', mobile:'123456789',idCard:'421124199801141256'}
        ]
      },
      rules: {
        date: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      houseList:[
        {houseId:'YQY110635',houseName:'康桥小区', status:1, floor:'中层/28', houseType:'2*2*2*1', area:'136', price:'90', fitment:'精装',maintainer:'当代一店下雨天'},
        {houseId:'YQY110635',houseName:'康桥小区', status:2, floor:'中层/28', houseType:'2*2*2*1', area:'136', price:'90', fitment:'精装',maintainer:'当代一店下雨天'},
        {houseId:'YQY110635',houseName:'康桥小区', status:1, floor:'中层/28', houseType:'2*2*2*1', area:'136', price:'90', fitment:'精装',maintainer:'当代一店下雨天'},
        {houseId:'YQY110635',houseName:'康桥小区', status:2, floor:'中层/28', houseType:'2*2*2*1', area:'136', price:'90', fitment:'精装',maintainer:'当代一店下雨天'},
        {houseId:'YQY110635',houseName:'康桥小区', status:2, floor:'中层/28', houseType:'2*2*2*1', area:'136', price:'90', fitment:'精装',maintainer:'当代一店下雨天'},
        {houseId:'YQY110635',houseName:'康桥小区', status:1, floor:'中层/28', houseType:'2*2*2*1', area:'136', price:'90', fitment:'精装',maintainer:'当代一店下雨天'},
      ],
      //houseList:[],
      clientList:[
        {clientName:'张三', clientId:'YQY110635', trade:1, area:'武昌 汉街', price:'96万'},
        {clientName:'张三', clientId:'YQY110635', trade:2, area:'武昌 汉街', price:'96万'},
        {clientName:'张三', clientId:'YQY110635', trade:2, area:'武昌 汉街', price:'96万'},
        {clientName:'张三', clientId:'YQY110635', trade:1, area:'武昌 汉街', price:'96万'},
      ],
      searchForm1:{},
      searchForm2:{},
      dialogTableVisible1:false,
      dialogTableVisible2:false,
      attention:false,
      total:5
    }
  },
  methods:{
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    addcommissionData(){
      this.addForm.contPersons.push({});
    },
    deleteRowcommissionData(index){
      this.addForm.contPersons.splice(index, 1);
    },
    isAttention(){
      this.attention=!this.attention
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>
<style scoped lang="less">

@import "~@/assets/common.less";
.view-container{
  padding: 0 20px 20px 20px;
  .add-form{
    padding: 10px;
    font-size: 14px;
    background: @bg-white;
  }
}
.contractMsg{
  border-bottom: 1px solid @border-ED;
  > p{
    padding-bottom: 10px;
    padding-left: 20px;
    font-size: 14px;
  }
  .form-content{
    padding-left: 30px;
    .sxf_1{
      width: 100px;
    }
    .sxf_2{
      width: 80px;
    }
    .sxf_3{
      width: 80px;
    }
  }
}
.houseMsg{
  border-bottom: 1px solid @border-ED;
  > p{
    padding: 20px 0 10px 20px;
    font-size: 14px;
  }
  .form-content{
    padding-left: 30px;
    .select{
      display: inline-block;
      text-align: center;
      color: @color-white;
      width: 140px;
      padding: 4px 0;
      background: @color-blue;
      border-radius: 2px;
    }
    .address{
      width: 500px;
    }
    /deep/.el-textarea__inner{
      width: 600px;
      min-height: 200px;
    }
  }
  .peopleMsg{
    li{
      //display: flex;
      font-size: 14px;
      margin-bottom: 10px;
      .merge{
        border: 1px solid #ccc;
        padding: 5px 0;
        border-radius: 3px;
      }
    }
    input{
      padding: 5px 0;
    }
    .name_{
      width: 60px;
      padding-left: 5px;
      border: none;
      border-right: 1px solid #ccc;
    }
    .mobile_{
      width: 100px;
      border: none;
    }
    .rate_{
      width: 60px;
      margin-right: 10px;
      padding-left: 5px;
      border: 1px solid #ccc;
      border-radius: 3px;
    }
    .idCard_{
      width: 140px;
      padding-left: 5px;
      border: 1px solid #ccc;
      border-radius: 3px;
    }
    .relation_{
      width: 80px;
    }
    .icon{
      display: inline-block;
      padding: 0 7px;
      border-radius: 15px;
      border: 1px solid @color-blue;  
      i{
        color: @color-blue;
        font-weight: bold;
      }
    }
    .delete{
      border: 1px solid @color-FF5;
      i{
        color: @color-FF5;
      }
    }
  }
}
.btn{
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
}
.search_btn{
  padding: 8px 20px;
}
.attention{
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 1px solid #ccc;
  border-radius: 2px;
}
.attention_{
  background: @color-blue;
}
.floor_btn{
  padding: 10px 0;
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  //float: right;
}
.noList{
  background: #DEDDE2;
  padding: 148px 0;
  text-align: center;
}
/deep/.el-table td{
  padding: 5px 0;
}
/deep/.el-dialog__header{
  padding-top: 10px;
  .el-dialog__title{
    color: @color-blue;
  }
}
/deep/.el-dialog__body{
  padding-top: 20px;
  border-top: 1px solid #EDECF0
}
</style>