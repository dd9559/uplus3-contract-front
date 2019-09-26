<template>
  <div class="view-container">
    <div class="mainContent">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="成交报告" name="detail">
          <!-- <newHouseDetail :style="{ height: clientHei }"></newHouseDetail> -->
          <component v-bind:is="contractType" :detail="contractDetail" :style="{ height: clientHei }"></component>
          <div class="footer">
            <div>
              <p><span>录入时间：</span>{{contractDetail.createTime|formatTime}}</p>
              <p><span>录入人：</span>{{contractDetail.recordDeptName}}-{{contractDetail.recordName}}</p>
              <p><span>最后修改：</span>{{contractDetail.updateTime|formatTime}}</p>
            </div>
            <div>
              <el-button round type="primary" class="search_btn" @click="goEdit">编辑</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="回访录音" name="recording">
          <longRentDetail></longRentDetail>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
           
<script>
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
import newHouseDetail from "../otherContract/detailModule/newHouseDetail";
import longRentDetail from "../otherContract/detailModule/longRentDetail";
import financialDetail from "../otherContract/detailModule/financialDetail";

export default {
  mixins: [MIXINS],
  components: {
    newHouseDetail,
    longRentDetail,
    financialDetail,
  },
  data(){
    return{
      activeName:"detail",
      contractDetail:{},
      clientHei:"",
      contId:"",//列表带过来的id
      contractType:"",
    }
  },
  created () {
    this.contId=Number(this.$route.query.id)
    if(this.$route.query.type==="newHouse"){
      this.contractType="newHouseDetail"
    }else if(this.$route.query.type==="longRent"){
      this.contractType="longRentDetail"
    }else{
      this.contractType="financialDetail"
    }
    this.getContractDetail();//合同详情
  },
  methods:{
    // 控制弹框body内容高度，超过显示滚动条
    clientHeight() {
      this.clientHei= document.documentElement.clientHeight -200 + 'px'
    },
    //tab切换
    handleClick(tab, event) {
      console.log(tab.name);
      this.activeName=tab.name;
      if(tab.name==="recording"){
        // this.getRecordList();//电话录音
      }
    },
    //合同详情
    getContractDetail(){
      let url,param
      param = {
        id:this.contId
      }
      if(this.contractType==="newHouseDetail"){
        url="/api/contractInfo/newHouse/detail"
      }else if(this.contractType==="longRentDetail"){
        url="/api/contractInfo/longLease/detail"
      }else{
        url="/api/contractInfo/finance/detail"
      }
      this.$ajax.get(url,param).then(res=>{
        res=res.data
        if(res.status===200){
          this.contractDetail=res.data
          this.$set(this.contractDetail,"contractInfo",JSON.parse(this.contractDetail.contractInfo))
        }
      })
    },
    //编辑
    goEdit(){

    }
  },
  mounted(){
    window.onresize = this.clientHeight;
  },
  beforeUpdate() {
    this.clientHeight();
  },
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.view-container {
  position: relative;
  min-height: 100%;
  padding-left: 20px;
  background: @bg-white;
  font-size: 14px;
  .firstDetail{
    overflow-y: auto;
  }
  .mainContent{
    /deep/.el-tabs{
      .el-tabs__header {
        margin-bottom: 0;
      }
      .el-tabs__item {
        font-size: 18px;
        height: 50px;
        line-height: 50px;
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
  }
}
</style>