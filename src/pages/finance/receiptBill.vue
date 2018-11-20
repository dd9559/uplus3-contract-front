<template>
  <div class="view">
    <p>收款信息</p>
    <section>
      <div class="input-group">
        <label>付款方</label>
        <el-select v-model="form.person" placeholder="请选择">
          <el-option
            v-for="item in 5"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="input-group">
        <label>收款人:</label>
        <el-select v-model="form.person" placeholder="请选择">
          <el-option
            v-for="item in 5"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </section>
    <div class="input-group">
      <p><label>款类</label></p>
      <ul class="money-type-list">
        <li v-for="item in types" :key="item.id" :class="[activeType===item.id?'active':'']"
            @click="choseType(item)">{{item.name}}
        </li>
      </ul>
      <el-table border :data="moneyType" :span-method="collapseRow" style="width: 100%"
                header-row-class-name="theader-bg">
        <el-table-column align="center" label="款类（大类）"></el-table-column>
        <el-table-column align="center" label="款类（小类）">
          <template slot-scope="scope"></template>
        </el-table-column>
        <el-table-column align="center" label="收款金额（元） ">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入" v-if="false">
            <span>请输入</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="activeType===1?'金额大写':'收款方式'">
          <template slot-scope="scope"></template>
        </el-table-column>
        <el-table-column align="center" label="收款账户">
          <template slot-scope="scope">
            <div class="collapse-context" v-if="activeType===1">
              <p>分账账户</p>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="input-group" v-if="activeType===2">
      <p><label>刷卡资料补充</label></p>
      <el-table border :data="list" style="width: 100%" header-row-class-name="theader-bg">
        <el-table-column align="center" label="刷卡银行">
          <template slot-scope="scope">
            <span>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="户名">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入">
          </template>
        </el-table-column>
        <el-table-column align="center" label="账户 ">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入">
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额（元）">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入">
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单编号">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入">
          </template>
        </el-table-column>
        <el-table-column align="center" label="手续费（元）">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入">
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text">新增</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="input-group">
      <p><label>备注信息</label></p>
      <el-input placeholder="请填写备注信息" type="textarea"></el-input>
    </div>
    <div class="input-group" v-if="activeType===2">
      <p><label>付款凭证</label></p>
      <ul class="upload-list">
        <li>
          <p>+</p>
        </li>
      </ul>
    </div>
    <p>
      <el-button type="primary" @click="goResult">录入信息并提交审核</el-button>
      <el-button>取消</el-button>
    </p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          person: ''
        },
        types: [
          {
            id:1,
            name:'收入',
          },
          {
            id:2,
            name:'代收代付'
          }
        ],
        activeType: 1,
        moneyType:[],
        list: [{}],
        show: false
      }
    },
    created() {
      this.getMoneyType()
    },
    methods: {
      /**
       * 获取所有款类
       */
      getMoneyType:function () {
        this.$ajax.get('/api/payInfo/selectMoneyType').then(res=>{
          res=res.data
          if(res.status===200){
            this.moneyType = res.data
          }
        })
      },
      goResult: function () {
        this.$router.push({
          path: 'receiptResult'
        })
      },
      choseType: function (item) {
        this.activeType = item.id
      },
      //合并单元格
      collapseRow: function ({rowIndex, columnIndex}) {
        // debugger
        /*let param = {
          rowIndex:rowIndex,
          rowTotal:rowTotal,
          collapse:collapse,

          type:'info'
        }
        if (columnIndex === 0) {
          return TOOL.collapseRow(param)
        } else if ((columnIndex === 3 || columnIndex === 4)&&this.activeMoneyType===1) {
          param.type='all'
          return TOOL.collapseRow(param)
        }*/
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";

  .checkbox-info {
    display: flex;
    align-items: center;
    position: relative;
    &:before {
      content: '';
      display: inline-block;
      border: 1px solid @color-B9;
      width: 16px;
      height: 16px;
    }
    &.active {
      &:before {
        content: 'A';
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    > span {
      line-height: initial;
      margin-left: 10px;
    }
  }

  .input-group {
    margin: 0;
    display: block;
    max-width: 815px;
    > p {
      > span {
        color: @color-red;
        margin-left: 20px;
      }
    }
    .money-type-list {
      display: flex;
      background-color: @bg-grey;
      padding: 0 15px;
      margin-top: 20px;
      > li {
        height: 40px;
        min-width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        &.active {
          color: @color-blue;
          position: relative;
          &:after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            border-top: 4px solid @color-blue;
          }
        }
      }
    }
    .type-list {
      display: flex;
      flex-wrap: wrap;
      margin: 20px 0px;
      > li {
        width: 150px;
        padding: 10px;
        box-sizing: border-box;
        text-align: center;
        margin: 0 10px 10px 0;
        border: 1px solid @color-D6;
        color: @color-6c;
        &.active {
          color: @color-blue;
          border-color: @color-blue;
        }
      }
    }
    .span-join {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      max-width: 300px;
      margin: 20px 0;
      padding: 6px 8px;
      border: 1px solid @color-D6;
      border-radius: 4px;
      > input {
        flex: 1;
      }
    }
    .upload-list {
      display: flex;
      flex-wrap: wrap;
      margin: 20px 0;
      > li {
        border: 1px dashed @color-D6;
        width: 200px;
        height: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    /deep/ .el-table, .el-textarea {
      margin: 20px 0;
    }
  }

  .view {
    background-color: @bg-white;
    padding: 20px;
    > section {
      margin: 20px 0px;
      &:first-of-type {
        display: flex;
        .input-group {
          display: flex;
          &:first-of-type {
            margin-right: 40px;
          }
        }
      }
    }
  }
</style>
