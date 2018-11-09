<template>
    <div class="view">
      <div class="view-context">
        <h3>付款单创建成功</h3>
        <p>请等待付款审核结果</p>
        <ul class="step-list">
          <li v-for="item in steps" :key="item.index" :class="[item.state?'active':'',activeStep===item.index?'active-last-step':'']">
            <section>{{item.name}}<p v-if="item.index===1"><span>东野圭吾</span><span>2018/09/30 12:00</span></p></section>
          </li>
        </ul>
        <p>
          <el-button type="primary" @click="goBack('contract')">返回合同列表</el-button>
          <el-button @click="goBack('bill')">返回收付款列表</el-button>
        </p>
      </div>
    </div>
</template>

<script>
  export default {
    name: "pay-result",
    data(){
      return{
        steps:[
          {
            index:1,
            name:'提交申请',
            state:true
          },{
            index:2,
            name:'付款审核',
            state:true
          },{
            index:3,
            name:'申请成功',
            state:false
          },{
            index:4,
            name:'付款',
            state:false
          }
        ],
        activeStep:0,
      }
    },
    mounted(){
      this.steps.find(item=>{
        if(!item.state){
          this.activeStep=item.index-1
          return true
        }
      })
    },
    methods:{
      goBack:function (page) {
        this.$router.push({
          path:page
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
.view{
  background-color: @bg-white;
  position: relative;
  &-context{
    position: absolute;
    top: 50%;
    left: 50%;
    transform:translate(-50%,-50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    >h3{
      color: @color-324;
    }
    >p{
      &:first-of-type{
        color: @color-99A;
        margin: 20px 0;
      }
      &:last-of-type{
        margin-top: 140px;
      }
    }
    >ul.step-list{
      display: flex;
      margin: 50px 0;
      >li{
        width: 200px;
        height: 2px;
        background-color: @bg-grey;
        position: relative;
        padding-left: 14px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        &:last-of-type{
          width: 0px;
        }
        &.active{
          background-color: @color-blue;
          &:before{
            background-color: @color-blue;
          }
          &-last-step{
            background-color: @bg-grey;
            &:before{
              width: 20px;
              height: 20px;
            }
            >section{
              color: @color-blue;
              left: 10px;
            }
          }
        }
        &:before{
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          transform:translateY(-50%);
          width: 14px;
          height: 14px;
          background-color: @color-A3;
          border-radius: 50%;
        }
        >section{
          /*min-width: 80px;*/
          position: absolute;
          top: 24px;
          left: 7px;
          transform:translateX(-50%);
          white-space: nowrap;
          text-align: center;
          color: @color-324;
          >p{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            color: @color-99A;
            >span{
              &:first-of-type{
                margin-bottom: 10px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
