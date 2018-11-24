<template>
  <div class="view-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="合同详情" name="first">
        <div class="msg">
          <div class="title">合同信息</div>
          <div class="content">
            <div class="one_">
              <p><span class="tag">签约日期：</span><span class="text">{{contractDetail.signDate}}</span></p>
              <p>
                <span class="tag">合同类型：</span>
                <span class="text" v-if="contractDetail.contType.value===1">租赁</span>
                <span class="text" v-if="contractDetail.contType.value===2">买卖</span>
                <span class="text" v-if="contractDetail.contType.value===3">代办</span>
                <span class="text" v-if="contractDetail.contType.value===4">意向</span>
                <span class="text" v-if="contractDetail.contType.value===5">定金</span>
              </p>
              <p><span class="tag">成交总价：</span><span class="text">{{contractDetail.dealPrice}} 元</span></p>
            </div>
            <div class="one_">
              <p v-if="contType!='1'"><span class="tag">客户保证金：</span><span class="text">{{contractDetail.custEnsure}} 元</span></p>
              <p><span class="tag">客户佣金：</span><span class="text">{{contractDetail.custCommission}} 元</span></p>
              <p><span class="tag">业主佣金：</span><span class="text">{{contractDetail.ownerCommission}} 元</span></p>
              <p><span class="tag">佣金支付费：</span><span class="text">{{contractDetail.commissionPayment}} 元</span></p>
            </div>
            <div class="one_" v-if="contType!='1'">
              <p v-if="contType!='1'">
                <span class="tag">佣金合计：</span>
                <span class="text">{{contractDetail.custCommission+contractDetail.ownerCommission-contractDetail.commissionPayment}} 元</span>
              </p>
              <p class="address">
                <span class="tag">交易流程：</span>
                <span class="text" v-for="item in transFlowList" :key="item.id" v-if="item.id===contractDetail.transFlowCode">{{item.name}}</span>
              </p>
              <!-- <p><span class="tag">按揭手续费：</span><span class="text">另外出-客户-300 元</span></p>
              <p><span class="tag">按揭员：</span><span class="text">夏雨天</span></p> -->
            </div>
          </div>
        </div>
        <div class="msg">
          <div class="title">房源信息</div>
          <div class="content">
            <div class="one_">
              <p><span class="tag">房源编号：</span><span class="serialNumber">{{contractDetail.houseinfoCode}}</span></p>
              <p class="address"><span class="tag">物业地址：</span><span class="text">{{contractDetail.propertyAddr}}</span></p>
            </div>
            <div class="one_">
              <p><span class="tag">建筑面积：</span><span class="text">{{contractDetail.houseInfo.square}} m²</span></p>
              <p><span class="tag">套内面积：</span><span class="text">{{contractDetail.houseInfo.squareUse}} m²</span></p>
              <p><span class="tag">用 途：</span><span class="text">住宅</span></p>
            </div>
            <div class="one_">
              <p><span class="tag">房 型：</span><span class="text">{{contractDetail.houseInfo.houseType}}</span></p>
              <p><span class="tag">朝 向：</span><span class="text">{{contractDetail.houseInfo.orientation}}</span></p>
              <p><span class="tag">装 修：</span><span class="text">{{contractDetail.houseInfo.decorateType}}</span></p>
            </div>
            <div class="one_" v-if="contType!='1'">
              <p>
                <span class="tag">产权状态：</span>
                <span class="text" v-for="item in dictionary['514']" :key="item.key" v-if="item.key===contractDetail.houseInfo.propertyRightStatus">{{item.value}}</span>
              </p>
              <p><span class="tag">按揭银行：</span><span class="text">{{contractDetail.houseInfo.stagesBankName}}</span></p>
              <p><span class="tag">按揭欠款：</span><span class="text">{{contractDetail.houseInfo.stagesArrears}} 元</span></p>
              <p><span class="tag">房产证号：</span><span class="text">{{contractDetail.propertyCard}}</span></p>
            </div>
            <div class="one_">
              <p><span class="tag">房源方门店：</span><span class="text">{{contractDetail.houseInfo.houseStoreName}}</span></p>
              <p><span class="tag">店 长：</span><span class="text">{{contractDetail.houseInfo.shopOwnerName}}</span></p>
              <p><span class="tag">手 机：</span><span class="text">{{contractDetail.houseInfo.shopOwnerMobile}}</span></p>
            </div>
            <div class="table">
              <template>
                <el-table :data="ownerData" border header-row-class-name="theader-bg">
                  <el-table-column prop="name" label="业主姓名"></el-table-column>
                  <el-table-column prop="mobile" label="电话"></el-table-column>
                  <el-table-column prop="personType.label" label="关系"></el-table-column>
                  <el-table-column prop="propertyRightRatio" label="产权比"></el-table-column>
                  <el-table-column prop="identifyCode" min-width="150" label="身份证号"></el-table-column>
                </el-table>
              </template>
            </div>
          </div>
        </div>
        <div class="msg">
          <div class="title">客源信息</div>
          <div class="content">
            <div class="one_">
              <p><span class="tag">客源编号：</span><span class="serialNumber">{{contractDetail.guestinfoCode}}</span></p>
              <p><span class="tag">付款方式：</span><span class="text">{{contractDetail.guestInfo.paymentMethod.label}}</span></p>
            </div>
            <div class="one_">
              <p><span class="tag">客源方门店：</span><span class="text">{{contractDetail.guestInfo.guestStoreName}}</span></p>
              <p><span class="tag">店 长：</span><span class="text">{{contractDetail.guestInfo.shopOwnerName}}</span></p>
              <p><span class="tag">手 机：</span><span class="text">{{contractDetail.guestInfo.shopOwnerMobile}}</span></p>
            </div>
            <div class="table">
              <template>
                <el-table :data="clientrData" border header-row-class-name="theader-bg">
                  <el-table-column prop="name" label="客户姓名"></el-table-column>
                  <el-table-column label="电话">
                    <template slot-scope="scope">
                      {{scope.row.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}} <i class="iconfont icon-icon_contract_phone" @click="call(scope.row.mobile)"></i>
                    </template>
                  </el-table-column>
                  <el-table-column prop="personType.label" label="关系"></el-table-column>
                  <el-table-column prop="propertyRightRatio" label="产权比"></el-table-column>
                  <el-table-column prop="identifyCode" min-width="150" label="身份证号"></el-table-column>
                </el-table>
              </template>
            </div>
          </div>
        </div>
        <div class="msg" v-if="contractDetail.isHavaCooperation">
          <div class="title">三方合作</div>
          <div class="content">
            <div class="one_">
              <p><span class="tag">扣合作费：</span><span class="text">{{contractDetail.otherCooperationCost}}元</span></p>
              <p>
                <span class="tag">类型：</span>
                <span class="text" v-for="item in dictionary['517']" :key="item.key" v-if='item.key===contractDetail.otherCooperationInfo.type'>{{item.value}}</span>
              </p>
            </div>
            <div class="one_">
              <p><span class="tag">合作方姓名：</span><span class="text">{{contractDetail.otherCooperationInfo.name}}</span></p>
              <p><span class="tag">联系方式：</span><span class="text">{{contractDetail.otherCooperationInfo.mobile}}</span></p>
              <p><span class="tag">身份证号：</span><span class="text">{{contractDetail.otherCooperationInfo.identifyCode}}</span></p>
            </div>
            <div class="remark">
              <p v-if="contractDetail.otherCooperationInfo.remarks">{{contractDetail.otherCooperationInfo.remarks}}</p>
              <p v-else>暂无备注</p>
            </div>
          </div>
        </div>
        <div class="msg">
          <div class="title">业绩分成</div>
          <div class="content">
            <div class="one_ performance">
              <p>(可分配业绩：<span class="orange">{{contractDetail.distributableAchievement}}</span>元)</p>
            </div>
            <div class="table">
              <p>房源方分成</p>
              <el-table :data="employeeData.house" border header-row-class-name="theader-bg">
                <el-table-column prop="category" label="角色类型">
                  <template slot-scope="scope">
                    房源录入人
                  </template>
                </el-table-column>
                <el-table-column prop="Royalties" label="分成比例"></el-table-column>
                <el-table-column prop="EmpName" label="经纪人"></el-table-column>
                <el-table-column prop="ZFStatus" label="在职状态"></el-table-column>
                <el-table-column prop="DeptName" label="门店"></el-table-column>
                <el-table-column prop="DeptManage" label="店长"></el-table-column>
                <el-table-column prop="GroupName" label="单组"></el-table-column>
                <el-table-column prop="PartitionManager" label="区经"></el-table-column>
                <el-table-column prop="RegionalDirector" label="区总"></el-table-column>
              </el-table>
            </div>
            <div class="table">
              <p>客源方分成</p>
              <el-table :data="employeeData.customer" border header-row-class-name="theader-bg">
                <el-table-column prop="category" label="角色类型">
                  <template slot-scope="scope">
                    客源录入人
                  </template>
                </el-table-column>
                <el-table-column prop="Royalties" label="分成比例"></el-table-column>
                <el-table-column prop="EmpName" label="经纪人"></el-table-column>
                <el-table-column prop="ZFStatus" label="在职状态"></el-table-column>
                <el-table-column prop="DeptName" label="门店"></el-table-column>
                <el-table-column prop="DeptManage" label="店长"></el-table-column>
                <el-table-column prop="GroupName" label="单组"></el-table-column>
                <el-table-column prop="PartitionManager" label="区经"></el-table-column>
                <el-table-column prop="RegionalDirector" label="区总"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="footer">
          <div>
            <p><span>录入时间：</span>{{contractDetail.createTime|formatTime}}</p>
            <p><span>录入人：</span>{{contractDetail.dealAgentStoreName}}-{{contractDetail.dealAgentName}}</p>
            <p><span>最后修改：</span>{{contractDetail.updateTime|formatTime}}</p>
          </div>
          <div>
            <el-button round class="search_btn" @click="goPreview">预览</el-button>
            <el-button round type="danger" class="search_btn" @click="goChangeCancel(2)" v-if="contractDetail.contState.value===3">解约</el-button>
            <el-button round type="danger" @click="dialogInvalid=true" class="search_btn" v-if="contractDetail.contState.value!=3">无效</el-button>
            <el-button round class="search_btn" @click="goChangeCancel(1)" v-if="contractDetail.contState.value===3">变更</el-button>
            <el-button type="primary" round class="search_btn" @click="goEdit" v-if="contractDetail.contState.value===1">编辑</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="合同主体" name="second">合同主体</el-tab-pane>
      <el-tab-pane label="资料库" name="third">资料库</el-tab-pane>
      <el-tab-pane label="回访录音" name="fourth">
        <div class="type">
          <span :class="{'active':isActive===1}" @click="changeType(1)">客源</span>
          <span :class="{'active':isActive===2}" @click="changeType(2)">房源</span>
        </div>
        <div class="record">
          <el-table :data="recordData" border style="width: 100%" header-row-class-name="theader-bg">
            <el-table-column prop="visitTime" label="回访时间">
            </el-table-column>
            <el-table-column prop="visitPeople" label="回访人">
            </el-table-column>
            <el-table-column label="回访电话">
              <template slot-scope="scope">
                {{scope.row.visitMobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}}
              </template>
            </el-table-column>
            <el-table-column prop="record" label="录音">
              <audio src="www.baidu.com"></audio>
            </el-table-column>
            <el-table-column prop="remakes" label="备注" width="320">
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="functionTable">
      <el-button round class="search_btn">打印成交报告</el-button>
      <!-- <el-button type="primary" round class="search_btn" @click="dialogSupervise = true">资金监管</el-button> -->
      <el-button type="primary" round class="search_btn" @click="fencheng">分成</el-button>
    </div>

    <!-- 拨号弹出框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="460px">
      <div>
        <div class="icon">
          <i class="el-icon-success"></i>
        </div>
        <div class="text">
          <p>号码绑定成功！ </p>
          <p>请拨打此号码 {{callNumber}} 联系客户</p>
        </div>
      </div>
    </el-dialog>

    <!-- 资金监管弹窗(暂缓) -->
    <!-- <el-dialog title="资金监管" :visible.sync="dialogSupervise" width="740px">
      <div class="download">
        <p>资金监管合同模板下载</p>
      </div>
      <div class="upload">
        <p>资金监管合同上传</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSupervise = false">取 消</el-button>
        <el-button type="primary" @click="dialogSupervise = false">确 定</el-button>
      </span>
    </el-dialog> -->

    <!-- 合同无效弹窗 -->
    <el-dialog title="合同无效" :visible.sync="dialogInvalid" width="740px">
      <div class="top">
        <p>合同无效原因</p>
        <div class="reason">
          <el-input type="textarea" :rows="5" placeholder="请填写合同无效原因，最多100字 " v-model="textarea" resize='none' style="width:597px" maxlength="100">
          </el-input>
          <span>{{textarea.length}}/100</span>
          <p><span>注：</span>您的合同正在审核中，是否确认要做无效？无效后，合同需要重新提审！</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="dialogInvalid = false">取消</el-button>
        <el-button round type="primary" @click="dialogInvalid = false">保存</el-button>
      </span>
    </el-dialog>

    <!-- 审核，编辑，反审核，业绩分成弹框 -->
    <achDialog :shows="shows" v-on:close="shows=false" :contractCode="contCode" :dialogType="dialogType"></achDialog>
    <!-- 变更/解约编辑弹窗 -->
    <changeCancel :dialogType="canceldialogType" :cancelDialog="changeCancel" @closeChangeCancel="changeCancelDialog"></changeCancel>
  </div>
</template>
           
<script>
import achDialog from "./../../achievement/achDialog";
import changeCancel from "../contractDialog/changeCancel";
import { MIXINS } from "@/assets/js/mixins";
export default {
  mixins: [MIXINS],
  components: {
    achDialog,
    changeCancel
  },
  data() {
    return {
      dialogVisible: false,
      dialogSupervise: false,
      //合同无效弹窗内容
      dialogInvalid: false,
      textarea: "",
      activeName: "first",
      //合同信息
      contractDetail:{
        contType:{},
        houseInfo:{},
        guestInfo:{
          paymentMethod:{}
        },
        otherCooperationInfo:{},
        contState:{}
      },
      //业主信息
      ownerData: [],
      //客户信息
      clientrData: [],
      //录音
      recordData:[
        {visitTime:'2018/11/11',visitPeople:'万科四季花城-夏雨天',visitMobile:'18571606238',remakes:'萨瓦迪卡哈哈哈'},
        {visitTime:'2018/11/11',visitPeople:'万科四季花城-夏雨天',visitMobile:'18571606238',remakes:'萨瓦迪卡哈哈哈'},
        {visitTime:'2018/11/11',visitPeople:'万科四季花城-夏雨天',visitMobile:'18571606238',remakes:'萨瓦迪卡哈哈哈'},
      ],
      callNumber: "",
      //合同类型
      contType: 2,
      //合同id
      id:'',
      //合同编号
      contCode:'',
      //分成
      shows: false,
      dialogType: 3,
      canceldialogType: "",
      changeCancel: false,
      isActive:1,
      dictionary: {
        //数据字典
        "514": "", //产权状态
        "517": "", //三方合作类型
      },
      //交易流程
      transFlowList:[],
      //分成人员
      employeeData:{}
    };
  },
  created() {
    this.contType = this.$route.query.contType.toString();
    this.id = this.$route.query.id;
    this.contCode = this.$route.query.code;
    if (this.$route.query.type === "dataBank") {
      this.activeName = "third";
    }
    this.getContractDetail();
    this.getDictionary();
    this.getTransFlow();
    //this.getAchievement();
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    //打电话
    call(value) {
      this.dialogVisible = true;
      this.callNumber = value;
    },
    //合同预览
    goPreview() {
      this.$router.push({
        path: "/contractPreview",
        query: {
          id: 1
        }
      });
    },
    // 分成弹窗
    fencheng() {
      this.dialogType = 3;
      this.shows = true;
    },
    // 合同编辑
    goEdit() {
      this.$router.push({
        path: "/addContract",
        query: {
          id: 1,
          operateType: 2,
          type: this.contType
        }
      });
    },
    // 变更解约弹窗
    goChangeCancel(value) {
      if (value === 1) {
        this.canceldialogType = "changeEdit";
        this.changeCancel = true;
      } else if (value === 2) {
        this.canceldialogType = "cancelEdit";
        this.changeCancel = true;
      }
    },
    // 关闭变更解约弹窗
    changeCancelDialog() {
      this.changeCancel = false;
      this.canceldialogType = "";
    },
    //房源客源切换
    changeType(value){
      this.isActive=value
    },
    //合同详情
    getContractDetail(){
      let param={
        id:this.id
      }
      this.$ajax.get('/api/contract/getById',param).then(res=>{
        res=res.data
        if(res.status===200){
          this.contractDetail=res.data
          this.contractDetail.signDate=res.data.signDate.substr(0, 10)
          for(var i=0;i<this.contractDetail.contPersons.length;i++){
            if(this.contractDetail.contPersons[i].personType.value===1){
              this.ownerData.push(this.contractDetail.contPersons[i])
            }else if(this.contractDetail.contPersons[i].personType.value===2){
              this.clientrData.push(this.contractDetail.contPersons[i])
            }
          }
        }
      })
    },
     //获取所在城市的交易类型
    getTransFlow(){
      this.$ajax.get('/api/contract/getTransFlowListByCity').then(res=>{
        res=res.data;
        if(res.status===200){
          console.log(res.data)
          this.transFlowList=res.data
        }
      })
    },
    //业绩分成
    getAchievement(){
      let param = {
        contCode:this.contCode
      }
      this.$ajax.get('/apiachievement/employee', param).then(res=>{
        res=res.data;
        if(res.status===200){
          this.employeeData=res.data
        }
      })
    }
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";

.view-container {
  /deep/.el-tabs__header {
    margin-bottom: 0;
  }
  /deep/.el-tabs__item {
    font-size: 18px;
    height: 60px;
    line-height: 60px;
  }
  padding-left: 20px;
  background: @bg-white;
  font-size: 14px;
  position: relative;
  .msg {
    border-bottom: 1px solid @border-ED;
    display: flex;
    padding: 20px 0 20px 0;
    .title {
      width: 70px;
      font-weight: bold;
      color: @color-blank;
      white-space: nowrap;
    }
    .content {
      .one_ {
        margin-bottom: 10px;
        &:last-of-type {
          margin-bottom: 0;
        }
        > p {
          width: 270px;
          display: inline-block;
          .tag {
            display: inline-block;
            width: 100px;
            text-align: right;
            color: @color-6c;
          }
          .text {
            color: @color-blank;
          }
          .serialNumber {
            color: @color-blue;
            font-weight: bold;
          }
        }
        .address {
          width: 600px;
        }
      }
      .performance {
        > p {
          color: @color-6c;
          .orange {
            color: @color-orange;
          }
        }
      }
      .table {
        padding: 10px 0;
        width: 1050px;
        /deep/ .theader-bg {
          > th {
            background-color: @bg-th;
          }
        }
        i {
          font-size: 16px;
          padding-left: 5px;
          color: #54d384;
          cursor: pointer;
        }
        > p {
          color: @color-6c;
          padding-bottom: 10px;
        }
      }
      .remark {
        width: 650px;
        height: 100px;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid rgba(236, 239, 242, 1);
        background: @bg-FA;
        > p {
          color: @color-D6;
        }
      }
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    p {
      color: @color-6c;
      display: inline-block;
      padding-right: 20px;
      font-size: 12px;
    }
    > div {
      &:last-of-type {
        padding-right: 20px;
        /deep/.el-button.is-round {
          padding: 10px 20px;
        }
      }
    }
  }
  /deep/.el-dialog__header {
    border-bottom: 1px solid @border-ED;
  }
  /deep/.el-dialog__body {
    .icon {
      text-align: center;
      font-size: 50px;
      padding-bottom: 20px;
      color: #54d384;
    }
    .text {
      text-align: center;
      p {
        line-height: 30px;
      }
    }
  }
  .functionTable {
    position: absolute;
    right: 0;
    top: 10px;
    padding-right: 20px;
    /deep/.el-button.is-round {
      padding: 10px 20px;
    }
  }
  .download,
  .upload {
    height: 200px;
  }
  .type {
    margin-top: 20px;
    width: 168px;
    height: 36px;
    align-items: center;
    box-sizing: border-box;
    border: 2px solid @color-blue;
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    > span {
      width: 50%;
      height: 36px;
      line-height: 36px;
      text-align: center;
      font-size: 14px;
      color: @color-blue;
    }
    .active {
      background: @color-blue;
      color: @color-white;
    }
  }
  .record{
    width: 950px;
    padding-top: 20px;
  }
}
</style>