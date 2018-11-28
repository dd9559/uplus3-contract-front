<template>
  <div class="view">
    <p>收款信息</p>
    <section>
      <div class="input-group">
        <label class="form-label">付款方</label>
        <el-select v-model="form.outObjType" placeholder="请选择" @change="getOption(form.outObjType,1)">
          <el-option
            v-for="item in dropdown"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="input-group">
        <label class="form-label">收款人:</label>
        <el-select v-model="form.inObjId" placeholder="请选择" @change="getOption(form.inObjId,2)">
          <el-option
            v-for="item in receiptMan"
            :key="item.empId"
            :label="item.name"
            :value="item.empId">
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
      <el-table v-if="activeType===1" class="collapse-cell" border :data="moneyType" :span-method="collapseRow"
                style="width: 100%"
                header-row-class-name="theader-bg">
        <el-table-column align="center" prop="name" label="款类（大类）"></el-table-column>
        <el-table-column align="center" label="款类（小类）">
          <template slot-scope="scope">
            <ul>
              <li v-for="item in scope.row.moneyTypes">
                <el-radio v-model="form.moneyType" :label="item.key" @change="getType(scope.row)">{{item.name}}
                </el-radio>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款金额（元） ">
          <template slot-scope="scope">
            <ul>
              <li v-for="item in scope.row.moneyTypes">
                <input type="text" class="no-style" placeholder="请输入" v-model="form.smallAmount"
                       v-if="form.moneyType===item.key">
                <span v-else>请输入</span>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额大写">
          <template slot-scope="scope">
            <span>{{form.smallAmount|formatChinese}}</span>
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
      <el-table v-else class="collapse-cell" border :data="moneyTypeOther[0].moneyTypes" :span-method="collapseRow"
                style="width: 100%"
                header-row-class-name="theader-bg" key="other">
        <el-table-column align="center" label="款类（大类）">
          <template slot-scope="scope">{{moneyTypeOther[0].name}}</template>
        </el-table-column>
        <el-table-column align="center" label="款类（小类）">
          <template slot-scope="scope">
            <div class="box box-left">
              <el-radio v-model="form.moneyType" :label="scope.row.key" @change="getType(scope.row,'other')">
                {{scope.row.name}}
              </el-radio>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款金额（元） ">
          <template slot-scope="scope">
            <div class="box">
              <input type="text" class="no-style" placeholder="请输入" v-model="form.smallAmount"
                     v-if="form.moneyType===scope.row.key">
              <span v-else>请输入</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款方式">
          <template slot-scope="scope">
            <div class="box">
              <el-select v-model="form.proceedsType" placeholder="请选择" v-if="form.moneyType===scope.row.key">
                <el-option
                  v-for="item in dictionary['534']"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
              <span v-else>请选择<i class="iconfont icon-xialazhankai"></i></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款账户">
          <template slot-scope="scope">
            <div class="box">
              <el-select v-model="activeAdmin" placeholder="请选择" v-if="form.moneyType===scope.row.key">
                <el-option
                  v-for="item in account"
                  :key="item.bankCard"
                  :label="`${item.bankAccountName} ${item.bankBranchName} ${item.bankCard}`"
                  :value="item.bankCard">
                  {{item.bankAccountName}}<span style="margin: 0 4px;">{{item.bankBranchName}}</span>{{item.bankCard}}
                </el-option>
              </el-select>
              <span v-else>请选择<i class="iconfont icon-xialazhankai"></i></span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--<ul class="table-total" v-if="activeType===2">
        <li>现金收款:<span>3000元</span></li>
        <li>转账收款:<span>3000元</span></li>
        <li>POS刷卡收款:<span>3000元</span></li>
        <li>合计金额:<span>9000元</span></li>
      </ul>-->
    </div>
    <div class="input-group" v-if="activeType===2">
      <p><label class="form-label">刷卡资料补充</label></p>
      <el-table border :data="cardList" style="width: 100%" header-row-class-name="theader-bg">
        <el-table-column align="center" label="刷卡银行">
          <template slot-scope="scope">
            <span>{{scope.row.bankName|formatNull}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="户名">
          <template slot-scope="scope">
            <input type="text" v-model="scope.row.userName" class="no-style" placeholder="请输入">
          </template>
        </el-table-column>
        <el-table-column align="center" label="账户 ">
          <template slot-scope="scope">
            <input type="text" v-model="scope.row.cardNumber" class="no-style" placeholder="请输入"
                   @input="getBank(scope.row,scope.$index)">
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额（元）">
          <template slot-scope="scope">
            <input type="text" v-model="scope.row.amount" class="no-style" placeholder="请输入">
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单编号">
          <template slot-scope="scope">
            <input type="text" v-model="scope.row.orderNo" class="no-style" placeholder="请输入">
          </template>
        </el-table-column>
        <el-table-column align="center" label="手续费（元）">
          <template slot-scope="scope">
            <input type="text" v-model="scope.row.fee" class="no-style" placeholder="请输入">
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="cardOpera('add')">新增</el-button>
            <el-button type="text" @click="cardOpera('delete',scope.row,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="input-group">
      <p><label>备注信息</label></p>
      <el-input v-model="form.remark" placeholder="请填写备注信息" type="textarea"></el-input>
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
      <el-button type="primary" @click="goResult">{{activeType===1?'创建POS收款订单':'录入信息并提交审核'}}</el-button>
      <el-button>取消</el-button>
    </p>
  </div>
</template>

<script>
  import {MIXINS} from "@/assets/js/mixins";

  const rule={
    outObj:{
      name:'付款方'
    },
    inObj:{
      name:'收款人',
    },
    moneyType:{
      name:'款类',
    },
    smallAmount:{
      name:'付款金额',
      type:'money'
    }
  }
  const otherRule={
    outObj:{
      name:'付款方'
    },
    inObj:{
      name:'收款人',
    },
    moneyType:{
      name:'款类',
    },
    smallAmount:{
      name:'付款金额',
      type:'money'
    },
    proceedsType:{
      name:'收款方式'
    },
    userName:{
      name:'户名'
    },
    cardNumber:{
      name:'账户'
    },
    amount:{
      name:'金额'
    },
    orderNo:{
      name:'订单号'
    },
    fee:{
      name:'手续费'
    }
  }

  export default {
    mixins: [MIXINS],
    data() {
      return {
        form: {
          contId: '',
          remark: '',
          inObj: '',
          inObjId: '',
          // inObjType:'',
          outObj: '',
          outObjId: '',
          outObjType: '',
          moneyType: '',
          moneyTypePid: '',
          smallAmount: '',
          proceedsType: '',
        },
        types: [
          {
            id: 1,
            name: '收入',
          },
          {
            id: 2,
            name: '代收代付'
          }
        ],
        activeType: 1,
        moneyType: [],
        moneyTypeOther: [],
        cardList: [
          {
            bankName: '',
            userName: '',
            cardNumber: '',
            amount: '',
            orderNo: '',
            fee: ''
          }
        ],
        amount: {
          balance: 0
        },
        dictionary: {
          '534': ''
        },
        activeAdmin: '',
        account: [],
        dropdown: [],
        receiptMan: []
      }
    },
    created() {
      this.getMoneyType()
      this.getDictionary()
      this.getAcount()
      this.getDropdown()
      this.getReceiptman()
      let type = this.$route.query.edit
      if (type) {
        this.getDetails({type: type, payId: this.$route.query.id})
      }
    },
    methods: {
      /**
       * 修改款单，获取初始数据
       */
      getDetails: function (param) {
        this.$ajax.get('/api/payInfo/selectPayInfoDetail', param).then(res => {
          res = res.data
          if (res.status === 200) {
            let obj = {
              remark: res.data.remark,
              inObj: res.data.inObjName,
              inObjId: res.data.inObjId,
              // inObjType:'',
              outObj: res.data.outObj,
              outObjId: res.data.outObjId,
              outObjType: res.data.outObjType.value,
              moneyType: res.data.moneyType,
              moneyTypePid: res.data.moneyTypePid,
              smallAmount: res.data.amount,
              proceedsType: res.data.type,
              id: res.data.id
            }
            this.cardList = res.data.account
            if(res.data.inAccount&&res.data.inAccount.length>0){
              this.activeAdmin = res.data.inAccount[0].cardNumber
            }
            this.form = Object.assign({}, this.form, obj)
          }
        })
      },
      /**
       * 获取所有款类
       */
      getMoneyType: function () {
        this.$ajax.get('/api/payInfo/selectMoneyType').then(res => {
          res = res.data
          if (res.status === 200) {
            this.moneyType = this.moneyType.concat(res.data)
            res.data.forEach((item, index) => {
              if (item.name === '代收代付') {
                this.moneyType.splice(index, 1)
                this.moneyTypeOther = res.data.splice(index, 1)
              }
            })
          }
        })
      },
      goResult: function () {
        let RULE = this.activeType===1?rule:otherRule
        let param = Object.assign({}, this.form)

        param.outAccount=[]
        param.inAccount=[]
        if (this.activeType === 2) {
          param.outAccount = [].concat(this.cardList)
          this.account.find(item => {
            if (item.bankCard === this.activeAdmin) {
              let obj = {
                bankName: item.bankBranchName,
                userName: item.bankAccountName,
                cardNumber: item.bankCard,
                amount: this.form.smallAmount
              }
              param.inAccount = [].concat(obj)
              return true
            }
          })
        }
        this.$tool.checkForm(param,RULE).then(()=>{
          // debugger
          if(this.activeType===2){
            if(param.inAccount.length===0){
              this.$message({
                message:'收账账户不能为空'
              })
            }else {
              param.outAccount.find((item,index)=>{
                this.$tool.checkForm(item,RULE).then(()=>{

                }).catch(error=>{
                  this.$message({
                    message:`${index>0?`刷卡资料补充第${index+1}行数据填写不全`:''}  ${error.title}${error.msg}`
                  })
                  return true
                })
              })
            }
          }
          /*if (this.$route.query.edit) {
            param.filePath = ['123']
            this.$ajax.put('/api/payInfo/updateProceedsInfo', param).then(res => {
              res=res.data
              if(res.status===200){
                this.$message({
                  message:'修改成功'
                })
                this.$router.go(-1)
              }
            })
          } else {
            //测试用
            param.contId = 1
            param.filePath = ['123']
            this.$ajax.postJSON('/api/payInfo/saveProceeds', param).then(res => {
              res = res.data
              if (res.status === 200) {
                this.$router.push({
                  path: 'receiptResult'
                })
              }
            })
          }*/
        }).catch(error=>{
          this.$message({
            message:`${error.title}${error.msg}`
          })
        })
      },
      choseType: function (item) {
        let obj = {
          moneyType: '',
          moneyTypePid: '',
          smallAmount: '',
          proceedsType: '',
        }
        // this.activeAdmin = ''
        this.activeType = item.id
        // this.form = Object.assign({},this.form,obj)
      },
      //合并单元格
      collapseRow: function ({rowIndex, columnIndex}) {
        if (columnIndex >= 3 && this.activeType === 1) {
          if (rowIndex === 0) {
            return [this.moneyType.length, 1]
          } else {
            return [0, 0]
          }
        }
        if (columnIndex === 0 && this.activeType === 2) {
          if (rowIndex === 0) {
            return [this.moneyTypeOther[0].moneyTypes.length, 1]
          } else {
            return [0, 0]
          }
        }
      },
      /**
       * 获取下拉框数据
       */
      getDropdown: function () {
        let param = {
          contId: 1
        }
        this.$ajax.get('/api/payInfo/selectValue', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.dropdown = res.data
          }
        })
      },
      /**
       * 获取收款人
       */
      getReceiptman: function () {
        this.$ajax.get('/api/organize/currentdep/employee').then(res => {
          res = res.data
          if (res.status === 200) {
            this.receiptMan = res.data
          }
        })
      },
      /**
       * 获取收款账户
       */
      getAcount: function () {
        this.$ajax.get('/api/payInfo/selectProceedsAccount').then(res => {
          res = res.data
          if (res.status === 200) {
            this.account = res.data
          }
        })
      },
      /**
       * 获取下拉框选择对象
       * @param item
       */
      getOption: function (item, type) {
        let obj = {}
        let list = type === 1 ? this.dropdown : this.receiptMan
        list.find(tip => {
          if (tip[type === 1 ? 'value' : 'empId'] === item) {
            if (type === 1) {
              obj.outObjId = tip.custId
              obj.outObj = tip.custName
            } else {
              obj.inObj = tip.name
            }
            return
          }
        })

        this.form = Object.assign({}, this.form, obj)
      },
      /**
       * 刷卡资料补充
       */
      cardOpera: function (type, row,index) {
        if (type === 'add') {
          let cell = {
            bankName: '',
            userName: '',
            cardNumber: '',
            amount: '',
            orderNo: '',
            fee: ''
          }
          this.cardList.push(cell)
        } else {
          this.cardList.splice(index, 1)
        }
      },
      /**
       * 根据卡号获取银行信息
       */
      getBank: function (row, index) {
        let param = {
          cardNumber: row.cardNumber
        }
        if (param.cardNumber.length >= 16) {
          this.$ajax.get('/api/system/selectBankNameByCard', param).then(res => {
            res = res.data
            if (res.status === 200) {
              this.cardList[index].bankName = res.data.bankName
            }
          })
        }
      },
      getType: function (label, type = 'init') {
        let obj = {
          /*moneyType: '',
          moneyTypePid: '',*/
          smallAmount: '',
          proceedsType: '',
        }
        this.activeAdmin = ''
        this.form = Object.assign({},this.form,obj)
        if (type === 'init') {
          this.form.moneyTypePid = label.id
        } else {
          this.form.moneyTypePid = this.moneyTypeOther[0].id
        }
      },
    },
    watch:{
      cardList:function (val) {
        if(val.length===0){
          this.cardList.push({
            bankName: '',
            userName: '',
            cardNumber: '',
            amount: '',
            orderNo: '',
            fee: ''
          })
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";

  /deep/ .collapse-cell {
    margin-top: 13px !important;
    .el-table__row {
      > td {
        padding: 0;
        .cell {
          padding: 0;
          > ul {
            > li {
              padding: 12px 10px;
              border-bottom: 1px solid #ebeef5;
              text-align: left;
              &:last-of-type {
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

  .iconfont {
    color: #A1A1A1;
    font-size: @size-12;
    margin-left: 10px;
  }

  .box {
    padding: 10px;
    &-left {
      text-align: left;
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
    .table-total {
      margin: 0 0 47px;
      padding: 0;
      > li {
        display: inline-block;
        font-weight: bold;
        font-size: @size-base;
        margin-right: 20px;
        > span {
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
        .upload-context {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          > i {
            color: @bg-th;
            width: 58px;
            height: 58px;
            border-radius: 50%;
            overflow: hidden;
            &.iconfont {
              position: relative;
              display: flex;
              align-items: center;
              &:before {
                font-size: 58px;
              }
            }
          }
          > p {
            font-size: @size-12;
            color: @color-99A;
            padding: 12px 20px;
            > span {
              &:first-of-type {
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
