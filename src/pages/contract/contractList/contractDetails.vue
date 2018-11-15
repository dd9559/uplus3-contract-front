<template>
  <div class="view-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="合同详情" name="first">
        <div class="msg">
          <div class="title">合同信息</div>
          <div class="content">
            <div class="one_">
              <p><span class="tag">签约日期：</span><span class="text">2018/09/29</span></p>
              <p><span class="tag">合同类型：</span><span class="text">{{contType==='2'?'买卖':'租赁'}}</span></p>
              <p><span class="tag">成交总价：</span><span class="text">3,0026,000 元</span></p>
            </div>
            <div class="one_">
              <p v-if="contType==='2'"><span class="tag">客户保证金：</span><span class="text">10000 元</span></p>
              <p><span class="tag">客户佣金：</span><span class="text">10000 元</span></p>
              <p><span class="tag">业主佣金：</span><span class="text">10000 元</span></p>
              <p><span class="tag">佣金支付费：</span><span class="text">10000 元</span></p>
              <p v-if="contType==='2'"><span class="tag">佣金合计：</span><span class="text">10000 元</span></p>
            </div>
            <div class="one_" v-if="contType==='2'">
              <p><span class="tag">交易流程：</span><span class="text">一次性（业）+ 按揭（客）</span></p>
              <p><span class="tag">按揭手续费：</span><span class="text">另外出-客户-300 元</span></p>
              <p><span class="tag">按揭员：</span><span class="text">夏雨天</span></p>
            </div>
          </div>
        </div>
        <div class="msg">
          <div class="title">房源信息</div>
          <div class="content">
            <div class="one_">
              <p><span class="tag">房源编号：</span><span class="serialNumber">YQYD001163</span></p>
              <p class="address"><span class="tag">物业地址：</span><span class="text">当代国际花园当代国际花园当代国际花园当代国际花园当代国际花园</span></p>
            </div>
            <div class="one_">
              <p><span class="tag">建筑面积：</span><span class="text">100.62 m²</span></p>
              <p><span class="tag">套内面积：</span><span class="text">100.62 m²</span></p>
              <p><span class="tag">用 途：</span><span class="text">住宅</span></p>
            </div>
            <div class="one_">
              <p><span class="tag">房 型：</span><span class="text">3*2*1*1</span></p>
              <p><span class="tag">朝 向：</span><span class="text">东南</span></p>
              <p><span class="tag">装 修：</span><span class="text">毛坯</span></p>
            </div>
            <div class="one_" v-if="contType==='2'">
              <p><span class="tag">产权状态：</span><span class="text">抵押</span></p>
              <p><span class="tag">按揭银行：</span><span class="text">招商银行</span></p>
              <p><span class="tag">按揭欠款：</span><span class="text">10000 元</span></p>
              <p><span class="tag">房产证号：</span><span class="text">权 0001563</span></p>
            </div>
            <div class="one_">
              <p><span class="tag">房源方门店：</span><span class="text">当代一店</span></p>
              <p><span class="tag">店 长：</span><span class="text">夏雨天</span></p>
              <p><span class="tag">手 机：</span><span class="text">15845127895</span></p>
            </div>
            <div class="table">
              <template>
                <el-table :data="tableData" border header-row-class-name="theader-bg">
                  <el-table-column prop="name" label="业主姓名"></el-table-column>
                  <el-table-column prop="mobile" label="电话"></el-table-column>
                  <el-table-column prop="relation" label="关系"></el-table-column>
                  <el-table-column prop="address" label="地域"></el-table-column>
                  <el-table-column prop="property" label="产权比"></el-table-column>
                  <el-table-column prop="idCard" min-width="150" label="身份证号"></el-table-column>
                </el-table>
              </template>
            </div>
          </div>
        </div>
        <div class="msg">
          <div class="title">客源信息</div>
          <div class="content">
            <div class="one_">
              <p><span class="tag">客源编号：</span><span class="serialNumber">YQYD001163</span></p>
              <p><span class="tag">付款方式：</span><span class="text">转账</span></p>
            </div>
            <div class="one_">
              <p><span class="tag">房源方门店：</span><span class="text">当代一店</span></p>
              <p><span class="tag">店 长：</span><span class="text">夏雨天</span></p>
              <p><span class="tag">手 机：</span><span class="text">15845127895</span></p>
            </div>
            <div class="table">
              <template>
                <el-table :data="tableData" border header-row-class-name="theader-bg">
                  <el-table-column prop="name" label="客户姓名"></el-table-column>
                  <el-table-column label="电话">
                    <template slot-scope="scope">
                      {{scope.row.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}}<i class="el-icon-phone-outline" @click="call(scope.row.mobile)"></i>
                    </template>
                  </el-table-column>
                  <el-table-column prop="relation" label="关系"></el-table-column>
                  <el-table-column prop="address" label="地域"></el-table-column>
                  <el-table-column prop="property" label="产权比"></el-table-column>
                  <el-table-column prop="idCard" min-width="150" label="身份证号"></el-table-column>
                </el-table>
              </template>
            </div>
          </div>
        </div>
        <div class="msg">
          <div class="title">三方合作</div>
          <div class="content">
            <div class="one_">
              <p><span class="tag">扣合作费：</span><span class="text">2018元</span></p>
              <p><span class="tag">类型：</span><span class="text">客户转</span></p>
            </div>
            <div class="one_">
              <p><span class="tag">合作方姓名：</span><span class="text">夏雨天</span></p>
              <p><span class="tag">联系方式：</span><span class="text">15845127895</span></p>
              <p><span class="tag">身份证号：</span><span class="text">11054854565656144444</span></p>
            </div>
            <div class="remark">
              <p>暂无备注</p>
            </div>
          </div>
        </div>
        <div class="msg">
          <div class="title">业绩分成</div>
          <div class="content">
            <div class="one_ performance">
              <p>(可分配业绩：<span class="orange">30000</span>元)</p>
            </div>
            <div class="table">
              <p>房源方分成</p>
              <el-table :data="performanceData" border header-row-class-name="theader-bg">
                <el-table-column prop="category" label="角色类型"></el-table-column>
                <el-table-column prop="proportion" label="分成比例"></el-table-column>
                <el-table-column prop="broker" label="经纪人"></el-table-column>
                <el-table-column prop="status" label="在职状态"></el-table-column>
                <el-table-column prop="store" label="门店"></el-table-column>
                <el-table-column prop="storer" label="店长"></el-table-column>
                <el-table-column prop="address" label="单组"></el-table-column>
                <el-table-column prop="manager" label="区经"></el-table-column>
                <el-table-column prop="generalManager" label="区总"></el-table-column>
              </el-table>
            </div>
            <div class="table">
              <p>客源方分成</p>
              <el-table :data="performanceData" border header-row-class-name="theader-bg">
                <el-table-column prop="category" label="角色类型"></el-table-column>
                <el-table-column prop="proportion" label="分成比例"></el-table-column>
                <el-table-column prop="broker" label="经纪人"></el-table-column>
                <el-table-column prop="status" label="在职状态"></el-table-column>
                <el-table-column prop="store" label="门店"></el-table-column>
                <el-table-column prop="storer" label="店长"></el-table-column>
                <el-table-column prop="address" label="单组"></el-table-column>
                <el-table-column prop="manager" label="区经"></el-table-column>
                <el-table-column prop="generalManager" label="区总"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="footer">
          <div>
            <p><span>录入时间：</span>2018/9/11 12:20</p>
            <p><span>录入人：</span>当代一店-夏雨天</p>
            <p><span>最后修改：</span>2018/9/11 12:20</p>
          </div>
          <div>
            <el-button round class="search_btn" @click="goPreview">预览</el-button>
            <el-button round type="danger" class="search_btn">解约</el-button>
            <el-button round type="danger" @click="dialogInvalid=true" class="search_btn">无效</el-button>
            <el-button round class="search_btn">变更</el-button>
            <el-button type="primary" round class="search_btn" @click="goEdit">编辑</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="合同主体" name="second">合同主体</el-tab-pane>
      <el-tab-pane label="资料库" name="third">资料库</el-tab-pane>
    </el-tabs>
    <div class="functionTable">
      <el-button round class="search_btn">打印成交报告</el-button>
      <el-button type="primary" round class="search_btn" @click="dialogSupervise = true">资金监管</el-button>
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

    <!-- 资金监管弹窗 -->
    <el-dialog title="资金监管" :visible.sync="dialogSupervise" width="740px">
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
    </el-dialog>

    <!-- 合同无效弹窗 -->
    <el-dialog title="合同无效" :visible.sync="dialogInvalid" width="740px">
      <div class="top">
        <p>合同无效原因</p>
        <div class="reason">
          <el-input
          type="textarea"
          :rows="5"
          placeholder="请填写合同无效原因，最多100字 "
          v-model="textarea"
          resize='none'
          style="width:597px"
          maxlength="100">
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
    <achDialog :shows="shows" v-on:close="shows=false" :dialogType="dialogType"></achDialog>
  </div>
</template>
           
<script>
import achDialog from "./../../achievement/achDialog";
export default {
  components: {
    achDialog
  },
  data() {
    return {
      dialogVisible: false,
      dialogSupervise: false,
      //合同无效弹窗内容
      dialogInvalid: false,
      textarea:'',
      activeName: "first",
      tableData: [
        {
          name: "下雨天",
          mobile: "15845127895",
          relation: "本人",
          address: "本地",
          property: "100%",
          idCard: "11054854565656144444"
        }
      ],
      performanceData: [
        {
          category: "房源录入人",
          proportion: "10%",
          broker: "夏雨天",
          status: "在职",
          store: "当代一店",
          storer: "夏雨天",
          address: "波光园二店",
          manager: "夏雨天",
          generalManager: "夏雨天"
        }
      ],
      callNumber: "",
      contType: "2",
      shows: false,
      dialogType:3
    };
  },
  created() {
    this.contType = (this.$route.query.contType).toString();
    if(this.$route.query.type==='dataBank'){
      this.activeName='third'
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
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
    fencheng(){
      this.dialogType = 3;
      this.shows = true;
    },
    goEdit(){
      this.$router.push({
        path: "/addContract",
        query: {
          id: 1,
          operateType:'edit',
          type:this.contType
        }
      });
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
}
</style>