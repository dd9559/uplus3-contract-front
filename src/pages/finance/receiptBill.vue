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
      <p><label>款类</label><span>（提示：分账款收款需通过创建POS刷卡订单来发起，代管款只在线上记录款项收款信息而不发起订单）</span></p>
      <ul class="money-type-list">
        <li v-for="item in moneyType" :key="item.index" :class="[activeMoneyType===item.index?'active':'']"
            @click="choseType(item)">{{item.name}}
        </li>
      </ul>
      <el-table border :data="typeList" :span-method="collapseRow" style="width: 100%"
                header-row-class-name="theader-bg">
        <el-table-column align="center" label="款类（大类）">
          <template slot-scope="scope">
            <span>{{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="款类（小类）">
          <template slot-scope="scope">
            <div class="checkbox-info" :class="[classList.indexOf(scope.row.index)>-1?'active':'']"
                 @click="checkType(scope.row.index)">
              <span>{{scope.row.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款金额（元） ">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入">
          </template>
        </el-table-column>
        <el-table-column align="center" :label="activeMoneyType===1?'合计金额':'收款方式'">
          <template slot-scope="scope">
            <div class="collapse-context" v-if="activeMoneyType===1">
              <p>佣 金: 3000元</p>
              <p>金融费: 680元</p>
              <p>违约金: 0元</p>
              <p>合计金额: 3680元</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款账户">
          <template slot-scope="scope">
            <div class="collapse-context" v-if="activeMoneyType===1">
              <p>分账账户</p>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="input-group" v-if="activeMoneyType===2">
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
    <div class="input-group" v-if="activeMoneyType===2">
      <p><label>付款凭证</label></p>
      <ul class="upload-list">
        <li>
          <p>+</p>
        </li>
      </ul>
    </div>
    <p>
      <el-button type="primary" @click="goResult">提交付款申请</el-button>
      <el-button>取消</el-button>
    </p>
  </div>
</template>

<script>
  let stepIndex = 0 //记录执行合并次数
  let otherStep = 0 //除合并外，剩余行数
  let rowTotal = 0  //总行数
  let collapse = [] //大类合并行数

  export default {
    data() {
      return {
        form: {
          person: ''
        },
        moneyType: [
          {
            index: 1,
            name: '分账款'
          },
          {
            index: 2,
            name: '代管款'
          }
        ],
        activeMoneyType: 1,
        list: [
          {}
        ],
        typeList: [],
        typeObj: [
          {
            id: 1,
            type: '佣金',
            child: [
              {
                index: 1,
                name: '二手买卖佣金'
              },
              {
                index: 2,
                name: '二手低佣买卖佣金'
              },
              {
                index: 3,
                name: '租赁佣金'
              },
              {
                index: 4,
                name: '二手买卖佣金'
              }
            ]
          },
          {
            id: 2,
            type: '金融费',
            child: [
              {
                index: 5,
                name: '金融服务费'
              }
            ]
          },
          {
            id: 3,
            type: '违约金',
            child: [
              {
                index: 6,
                name: '违约金'
              },
              {
                index: 7,
                name: 'test1'
              }
            ]
          }
        ],
        otherTypeObj: [
          {
            id: 1,
            type: '代管类',
            child: [
              {
                index: 1,
                name: '房贷'
              },
              {
                index: 2,
                name: '物业保证金'
              },
              {
                index: 3,
                name: '定金'
              },
              {
                index: 4,
                name: '意向金'
              }
            ]
          }
        ],
        classList: [],
        show: false
      }
    },
    created() {
      this.getData(this.typeObj)
    },
    methods: {
      getData: function (list) {
        stepIndex = 0 //初始化合并次数，必需，不然再表格发生重绘时，会出现第一列消失的情况
        rowTotal = 0
        collapse = []
        this.typeList = []
        let obj = JSON.parse(JSON.stringify(list))
        console.log(obj === this.typeObj)
        obj.forEach(item => {
          // debugger
          item.child.map(cell => {
            cell.type = item.type
          })
          this.typeList = this.typeList.concat(item.child)
          rowTotal = this.typeList.length
          collapse.push(item.child.length)
        })
      },
      goResult: function () {
        this.$router.push({
          path: 'payResult'
        })
      },
      choseType: function (item) {
        this.classList = []
        this.activeMoneyType = item.index
        if(item.index===1){
          this.getData(this.typeObj)
        }else {
          this.getData(this.otherTypeObj)
        }
      },
      checkType: function (id) {
        if (this.classList.includes(id)) {
          this.classList.find((item, index) => {
            if (item === id) {
              this.classList.splice(index, 1)
              return true
            }
          })
        } else {
          this.classList.push(id)
        }
      },
      //合并单元格
      collapseRow: function ({row, column, rowIndex, columnIndex}) {
        // debugger
        if (columnIndex === 0) {
          if (rowIndex === 0 || rowIndex === rowTotal - otherStep) {
            otherStep = 0 //初始化剩余行数
            collapse.forEach((item, index) => {
              //统计剩余行数
              if (index > stepIndex) {
                otherStep += item
              }
            })
            stepIndex++
            return {
              rowspan: collapse[stepIndex - 1],
              colspan: 1
            }
          } else if (rowIndex < rowTotal - otherStep) {
            if (rowIndex + 1 === rowTotal) {
              stepIndex = 0 //初始化合并次数，必需，不然再表格发生重绘时，会出现第一列消失的情况
            }
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        } else if ((columnIndex === 3 || columnIndex === 4)&&this.activeMoneyType===1) {
          if (rowIndex === 0) {
            return {
              rowspan: rowTotal,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
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
