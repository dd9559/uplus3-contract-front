<template>
  <div class="view">
    <p>收款信息</p>
    <section>
      <div class="input-group">
        <label class="form-label">付款方</label>
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
        <label class="form-label">收款人:</label>
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
      <p><label class="form-label">款类</label></p>
      <ul class="money-type-list">
        <li v-for="item in types" :key="item.id" :class="[activeType===item.id?'active':'']"
            @click="choseType(item)">{{item.name}}
        </li>
      </ul>
      <el-table v-if="activeType===1" class="collapse-cell" border :data="moneyType" :span-method="collapseRow" style="width: 100%"
                header-row-class-name="theader-bg">
        <el-table-column align="center" prop="name" label="款类（大类）"></el-table-column>
        <el-table-column align="center" label="款类（小类）">
          <template slot-scope="scope">
            <ul>
              <li v-for="item in scope.row.moneyTypes">
                <el-radio v-model="form.moneyType" :label="item.key" @change="getType(scope.row)">{{item.name}}</el-radio>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款金额（元） ">
          <template slot-scope="scope">
            <ul>
              <li v-for="item in scope.row.moneyTypes">
                <input type="text" class="no-style" placeholder="请输入" v-model="form.smallAmount" v-if="form.moneyType===item.key">
                <span v-else>请输入</span>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="activeType===1?'金额大写':'收款方式'">
          <template slot-scope="scope">
            <span v-if="amount">{{amount.balance|formatChinese}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款账户">
          <template slot-scope="scope">
            <div class="collapse-context" v-if="activeType===1">
              <p>分账账户</p>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-else class="collapse-cell" border :data="moneyTypeOther" :span-method="collapseRow" style="width: 100%"
                header-row-class-name="theader-bg" key="other">
        <el-table-column align="center" label="款类（大类）">
          <template slot-scope="scope">代收代付</template>
        </el-table-column>
        <el-table-column align="center" label="款类（小类）">
          <template slot-scope="scope">
            <el-radio v-model="form.moneyType" @change="getType(scope.row)">{{scope.row.name}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款金额（元） ">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入" v-model="form.smallAmount">
            <!--<span v-else>请输入</span>-->
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款方式">
          <template slot-scope="scope">
            <el-select v-model="form.person" placeholder="请选择">
              <el-option
                v-for="item in 5"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款账户">
          <template slot-scope="scope">
            <el-select v-model="form.person" placeholder="请选择">
              <el-option
                v-for="item in 5"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <ul class="table-total" v-if="activeType===2">
        <li>现金收款:<span>3000元</span></li>
        <li>转账收款:<span>3000元</span></li>
        <li>POS刷卡收款:<span>3000元</span></li>
        <li>合计金额:<span>9000元</span></li>
      </ul>
    </div>
    <div class="input-group" v-if="activeType===2">
      <p><label class="form-label">刷卡资料补充</label></p>
      <el-table border :data="cardList" style="width: 100%" header-row-class-name="theader-bg">
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
            <el-button type="text" @click="cardOpera('add')">新增</el-button>
            <el-button type="text" @click="cardOpera('delete',scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="input-group">
      <p><label>备注信息</label></p>
      <el-input placeholder="请填写备注信息" type="textarea"></el-input>
    </div>
    <div class="input-group" v-if="activeType===2">
      <p><label class="form-label">付款凭证</label></p>
      <ul class="upload-list">
        <li>
          <file-up class="upload-context">
            <i class="iconfont icon-shangchuan"></i>
            <p><span>点击可上传图片附件或拖动图片到此处以上传附件</span>（买卖交易合同、收据、租赁合同、解约协议、定金协议、意向金协议）</p>
          </file-up>
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
  import {MIXINS} from "@/assets/js/mixins";

  let cardID = 2;

  export default {
    mixins:[MIXINS],
    data() {
      return {
        form: {
          contId:2,
          remark:'',
          inObj:'',
          inObjId:'',
          inObjType:'',
          moneyType:'',
          moneyTypePid:'',
          smallAmount:'',
          filePath:'123',
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
        moneyTypeOther:[],
        list: [{}],
        cardList:[
          {
            id:1,
            bankName:'',
            userName:'',
            cardNumber:'',
            amount:'',
            orderNo:'',
            fee:''
          }
        ],
        amount: null,
        dictionary: {
          '534': ''
        },
        activeSelect:'',
      }
    },
    created() {
      this.getMoneyType()
      this.getDictionary()
    },
    methods: {
      /**
       * 获取所有款类
       */
      getMoneyType:function () {
        this.$ajax.get('/api/payInfo/selectMoneyType').then(res=>{
          res=res.data
          if(res.status===200){
            this.moneyType = this.moneyType.concat(res.data)
            res.data.forEach((item,index)=>{
              if(item.name==='代收代付'){
                this.moneyType.splice(index,1)
                this.moneyTypeOther = res.data.splice(index,1)[0].moneyTypes
              }
            })
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
        if(columnIndex>=3&&this.activeType===1){
          if (rowIndex === 0) {
            return [this.moneyType.length,1]
          } else {
            return [0,0]
          }
        }
      },
      showSelect:function (row) {
        this.activeSelect = this.activeSelect===row.key?'':row.key
      },
      /**
       * 刷卡资料补充
       */
      cardOpera:function (type,row) {
        if(type==='add'){
          let cell = {
            id:cardID++,
            bankName:'',
            userName:'',
            cardNumber:'',
            amount:'',
            orderNo:'',
            fee:''
          }
          this.cardList.push(cell)
        }else {
          this.cardList.find((item,index)=>{
            if(item.id===row.id){
              this.cardList.splice(index,1)
              return
            }
          })
        }
      },
      getType:function (label) {
        this.form.moneyTypePid = label.id
        this.getAmount()
      },
      getAmount:function () {
        let param={
          contId:this.form.contId,
          moneyTypePid:this.form.moneyTypePid,
          moneyType:this.form.moneyType
        }
        this.$ajax.get('/api/payInfo/selectAvailableBalance',param).then(res=>{
          res=res.data
          if(res.status===200){
            this.amount = res.data
          }
        })
      },
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  /deep/.collapse-cell{
    margin-top: 13px !important;
    .el-table__row{
      >td{
        padding: 0;
        .cell{
          padding: 0;
          >ul{
            >li{
              padding: 12px 10px;
              border-bottom: 1px solid #ebeef5;
              text-align: left;
              &:last-of-type{
                border: 0;
              }
            }
          }
        }
      }
    }
  }
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
  .select-info{
    position: relative;
    &-list{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background-color: @bg-white;
      height: 90px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      >li{
        height: 30px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        &:hover{
          background-color: #f5f7fa;
        }
      }
    }
    &-input{
      text-align: center;
      .iconfont{
        font-size: @size-12;
        color: #A1A1A1;
        margin-left: 20px;
      }
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
    .table-total{
      margin: 0 0 47px;
      padding: 0;
      >li{
        display: inline-block;
        font-weight: bold;
        font-size: @size-base;
        margin-right: 20px;
        >span{
          color: @color-red;
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
        width: 250px;
        height: 170px;
        display: flex;
        align-items: center;
        justify-content: center;
        .upload-context{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          >i{
            color: @bg-th;
            width: 58px;
            height: 58px;
            border-radius: 50%;
            overflow: hidden;
            &.iconfont{
              position: relative;
              display: flex;
              align-items: center;
              &:before{
                font-size: 58px;
              }
            }
          }
          >p{
            font-size: @size-12;
            color: @color-99A;
            padding: 12px 20px;
            >span{
              &:first-of-type{
                font-size: @size-base;
                color: @color-blue;
              }
            }
          }
        }
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
