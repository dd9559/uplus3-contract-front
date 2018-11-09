<template>
  <div class="view-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="合同详情" name="first">
        <div class="msg">
          <div class="title">合同信息</div>
          <div class="content">
            <div class="one_">
              <p><span class="tag">签约日期：</span><span class="text">2018/09/29</span></p>
              <p><span class="tag">合同类型：</span><span class="text">买卖 / 居间</span></p>
              <p><span class="tag">成交总价：</span><span class="text">3,0026,000 元</span></p>
            </div>
            <div class="one_">
              <p><span class="tag">客户保证金：</span><span class="text">10000 元</span></p>
              <p><span class="tag">客户佣金：</span><span class="text">10000 元</span></p>
              <p><span class="tag">业主佣金：</span><span class="text">10000 元</span></p>
              <p><span class="tag">佣金支付费：</span><span class="text">10000 元</span></p>
              <p><span class="tag">佣金合计：</span><span class="text">10000 元</span></p>
            </div>
            <div class="one_">
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
              <p><span class="tag">房源编号：</span><span class="text">YQYD001163</span></p>
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
            <div class="one_">
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
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="合同主体" name="second">合同主体</el-tab-pane>
      <el-tab-pane label="资料库" name="third">资料库</el-tab-pane>
    </el-tabs>
  </div>
</template>
           
<script>
export default {
  data() {
    return {
      activeName: "first"
    };
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    }
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";

.view-container {
  /deep/.el-tabs__header{
    margin-bottom: 0;
  }
  padding: 0 20px 20px 20px;
  background: @bg-white;
  font-size: 14px;
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
        &:last-of-type{
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
        }
        .address{
          width: 600px;
        }
      }
    }
  }
}
</style>