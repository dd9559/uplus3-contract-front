<template>
  <div class="view">
    <p>付款信息</p>
    <section>
      <div class="input-group">
        <label>收款方</label>
        <el-select v-model="form.person" placeholder="请选择">
          <el-option
            v-for="item in dropdown"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="input-group">
        <label>申请人:</label>
        <p>东野圭吾</p>
      </div>
    </section>
    <div class="input-group">
      <label>款类</label>
      <el-table class="collapse-cell" :span-method="collapse" border :data="moneyType" style="width: 100%"
                header-row-class-name="theader-bg">
        <el-table-column align="center" label="款类（大类）" prop="name"></el-table-column>
        <el-table-column align="center" label="款类（小类）">
          <template slot-scope="scope">
            <ul>
              <li v-for="item in scope.row.moneyTypes">
                <el-radio v-model="form.radio" :label="item.key">{{item.name}}</el-radio>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column align="center" label="付款金额（元） ">
          <template slot-scope="scope">
            <ul>
              <li v-for="item in scope.row.moneyTypes"><input type="text" class="no-style" placeholder="请输入"></li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column align="center" label="可支配金额">
          <template slot-scope="scope"></template>
        </el-table-column>
      </el-table>
    </div>
    <!--<div class="input-group">
      <p><label>付款金额</label><span>（可支配金额：1234）</span></p>
      <div class="span-join">
        <input type="number" class="no-style" placeholder="请填写支付金额">
        <span>元</span>
      </div>
    </div>-->
    <div class="input-group">
      <p><label>收款账户</label></p>
      <el-table border :data="list" style="width: 100%" header-row-class-name="theader-bg">
        <el-table-column align="center" label="收款银行">
          <template slot-scope="scope">
            <span>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="户名">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入">
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款账户 ">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入" v-model="form.bankCard" @input="getBank">
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额（元）">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入">
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="input-group">
      <p><label>备注信息</label></p>
      <el-input placeholder="请填写备注信息" type="textarea"></el-input>
    </div>
    <div class="input-group">
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
  export default {
    data() {
      return {
        form: {
          person: '',
          radio:'',
          bankCard:''
        },
        moneyType: [],
        list:[
          {}
        ],
        dropdown:[]
      }
    },
    created(){
      this.getDropdown()
      this.getMoneyType()
    },
    methods:{
      /**
       * 获取下拉框数据
       */
      getDropdown:function () {
        let param = {
          contId:18
        }
        this.$ajax.get('/api/payInfo/selectValue',param).then(res=>{
          res=res.data
          if(res.status===200){
            this.dropdown = res.data
          }
        })
      },
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
      /**
       * 根据卡号获取银行信息
       */
      getBank:function () {
        let param = {
          cardNumber:this.form.bankCard
        }
        if(this.form.bankCard.length>=16){
          this.$ajax.get('/api/system/selectBankNameByCard',param).then(res=>{
            // debugger

          })
        }
      },
      /**
       * 合并所有行
       */
      collapse:function ({ rowIndex, columnIndex }) {
        if(columnIndex===3){
          if (rowIndex === 0) {
            return [this.moneyType.length,1]
          } else {
            return [0,0]
          }
        }
      },
      goResult:function () {
        this.$router.push({
          path:'payResult'
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  /deep/.collapse-cell{
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
  .input-group {
    margin: 0;
    display: block;
    max-width: 815px;
    .type-list{
      display: flex;
      flex-wrap: wrap;
      margin: 20px 0px;
      >li{
        width: 150px;
        padding: 10px;
        box-sizing: border-box;
        text-align: center;
        margin: 0 10px 10px 0;
        border: 1px solid @color-D6;
        color: @color-6c;
        &.active{
          color: @color-blue;
          border-color: @color-blue;
        }
      }
    }
    .span-join{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      max-width: 300px;
      margin: 20px 0;
      padding: 6px 8px;
      border: 1px solid @color-D6;
      border-radius: 4px;
      >input{
        flex: 1;
      }
    }
    .upload-list{
      display: flex;
      flex-wrap: wrap;
      margin: 20px 0;
      >li{
        border: 1px dashed @color-D6;
        width: 200px;
        height: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    /deep/ .el-table,.el-textarea{
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
        .input-group{
          display: flex;
          &:first-of-type{
            margin-right: 40px;
          }
        }
      }
    }
  }
</style>
