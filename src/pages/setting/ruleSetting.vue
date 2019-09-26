<template>
    <div class="view-container" >
    <ul class="tabs">
      <li v-for="item in tabs" :class="[activeItem===item.id?'active':'']" @click="checkTab(item)" :key="item.id">{{item.name}}</li>
    </ul>
    <low-commission v-if="activeItem==1"></low-commission>
    <house-status-setting v-if="activeItem==2"></house-status-setting>
    <apl-time v-if="activeItem==3"></apl-time>

    </div>
</template>
           
<script>
  import { FILTER } from "@/assets/js/filter";
  import {MIXINS} from "@/assets/js/mixins";
  import aplTime from "./aplTime";
  import lowCommission from "./lowCommission";
  import houseStatusSetting from "./houseStatusSetting";
export default{
    mixins: [FILTER,MIXINS],
    data() {
        return {
           activeItem: 1, //Tab当前项
           tabs: [
          {
            id: 1,
            name: "低佣比例设置",
          },
          {
            id: 2,
            name: "房源状态设置",
          },
          {
            id: 3,
            name: "申诉时间设置",
          },
          {
            id: 4,
            name: "合同附件库设置",
          }
        ],
        }
    },
    methods:{
        checkTab(item) {
            this.activeItem = item.id;
        }
    },
    components:{
        aplTime,
        lowCommission,
        houseStatusSetting
    }
}
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.view-container {
    .tabs {
      height: 48px;
      display: flex;
      background: rgba(250, 250, 251, 1);
      font-size: 16px;
      padding-left: 30px;
    > li {
      display: flex;
      align-items: center;
      padding: 0 20px;
      font-family: "MicrosoftYaHei";
      color: rgba(50, 72, 95, 1);
      margin-right: 30px;
      &.active {
        color: @color-blue;
        border-bottom: 4px solid @color-blue;
      }
      &:nth-of-type(n + 2) {
        border-left: 0px;
      }
    }
  }
}
</style>