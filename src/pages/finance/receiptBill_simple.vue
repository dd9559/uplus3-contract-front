<template>
  <div class="view">
    <div class="view-context">
      <p class="f14 txt-title">收款信息</p>
      <ul class="bill-form">
        <li>
          <p class="block-receipt-type worth-list" v-if="firstCreate.content.contCommission">
            <span>应收佣金（元）：{{firstCreate.content.contCommission.receivableCommission}}</span><span>已收（元）：{{firstCreate.content.contCommission.receivedCommission}}</span><span
            class="warning-text">未收（元）：{{firstCreate.content.contCommission.uncollected}}</span>
          </p>
        </li>
        <li>
          <div class="input-group col">
            <div class="flex-box tool-tip">
              <label class="form-label no-width f14 margin-bottom-base">
                <span>款类</span>
              </label>
              <el-tooltip content="当未找到需要的款类时，可联系管理员进行配置" placement="top">
                <p class="tip-message"><i class="iconfont icon-wenhao"></i>填写帮助</p>
              </el-tooltip>
            </div>
            <moneyTypePop :data="moneyType" :init="moneyTypeName" @checkCell="getCell"
                          @clear="clearMoneyType"></moneyTypePop>
          </div>
          <div class="input-group col" :class="[inputPerson?'active-360':'']">
            <label class="form-label no-width f14 margin-bottom-base">收付对象</label>
            <div class="flex-box">
              <el-select size="small" class="w200" v-model="form.outObjType" placeholder="请选择"
                         @change="getOption(form.outObjType,1)">
                <el-option
                  v-for="item in dropdown"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <input type="text" size="small" class="w140 el-input__inner person" placeholder="请输入" maxlength="20"
                     v-model.trim="form.outObj" @input="inputOnly('normal')" v-if="inputPerson">
            </div>
          </div>
          <div class="input-group col active-400">
            <label class="form-label no-width f14 margin-bottom-base">收款人:</label>
            <div class="flex-box w400" v-if="inObjPerson">
              <select-tree v-if="firstCreate.state" :data="DepList" :init="dep.name" @checkCell="handleNodeClick"
                           @clear="clearSelect('dep')" @search="searchDep" key="other"></select-tree>
              <div class="h32" :class="[!firstCreate.state?'no-min':'']" v-else>{{firstCreate.content.storeName}}</div>
              <el-select :clearable="true" ref="employe" v-loadmore="moreEmploye" class="margin-left" size="small"
                         v-model="form.inObjId" placeholder="请选择" @clear="clearSelect('emp')" @focus="employeInfo=false"
                         @change="getOption(form.inObjId,2)">
                <el-option :label="form.inObj" :value="form.inObjId" v-if="employeInfo"></el-option>
                <el-option
                  v-for="(item,index) in EmployeList"
                  :key="index"
                  :label="item.name"
                  :value="item.empId">
                </el-option>
              </el-select>
            </div>
            <div class="h32" v-else>{{dep.name}}-{{form.inObj}}</div>
          </div>
        </li>
        <li>
          <div class="input-group col no-max">
            <div class="flex-box tool-tip no-max">
              <label class="form-label no-width f14 margin-bottom-base">{{receiptType|typeFormatter}}（元）</label><span>{{form.amount|formatChinese}}</span>
            </div>
            <input type="text" size="small" class="w430 el-input__inner" placeholder="请输入" v-model="form.amount"
                   @input="cutNum(1)">
          </div>
          <div class="input-group col">
            <label class="form-label no-width f14 margin-bottom-base">结款时间</label>
            <el-date-picker
              class="w400"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="form.createTime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </div>
        </li>
      </ul>
      <section>
        <p class="txt-title">其他信息</p>
        <div class="col-other other-message">
          <div class="input-group">
            <p><label class="f14">备注信息</label></p>
            <el-input v-model="form.remark" class="info-textarea"
                      :class="[form.remark&&form.remark.length>0?'':'scroll-hidden']" placeholder="请填写备注信息" rows="5"
                      maxlength="200" type="textarea"></el-input>
          </div>
        </div>
      </section>
    </div>
    <p>
      <el-button class="btn-info" round size="small" @click="goCancel">取消</el-button>
      <el-button class="btn-info" round size="small" type="primary" @click="goResult"
                 v-loading.fullscreen.lock="fullscreenLoading">创建收款信息
      </el-button>
    </p>
  </div>
</template>

<script>
  import {MIXINS} from "@/assets/js/mixins";
  import moneyTypePop from '@/components/moneyTypePop'

  const rule = {
    outObjId: {
      name: '付款方',
      type: 'negativeNum'
    },
    outObj: {
      name: '付款方',
    },
    inObjId: {
      name: '收款人',
    },
    createTime: {
      name: '收款时间'
    },
    moneyType: {
      name: '款类',
    },
    amount: {
      name: '收款金额',
      type: 'money'
    },
    admin: {
      name: '收账账户'
    }
  }

  export default {
    mixins: [MIXINS],
    components: {
      moneyTypePop,
    },
    data() {
      return {
        receiptType: 'xf',
        contId: '',
        dep: {
          id: '',
          name: ''
        },
        inputPerson: false,//是否显示第三方输入框
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
          amount: '',
          createTime: '',
        },
        moneyType: [],
        moneyTypeName: '',
        dictionary: {
          '534': ''
        },
        activeAdmin: '',
        account: [],
        dropdown: [],
        employeInfo: true,
        employePage: 1,
        fullscreenLoading: false,//提交表单防抖
        showAmount: false,//款类是否为代收代付
        inObjPerson: true,//收款人是否可选
        firstCreate: {
          state: true,
          content: {}
        },//合同是否第一次创建
      }
    },
    mounted() {
      this.form.contId = this.$route.query.contId ? parseInt(this.$route.query.contId) : ''
      this.getMoneyType()
      this.getDictionary()
      this.getDropdown()

      this.addInit(this.$route.query.contId)
    },
    methods: {
      //判断用户该合同是否第一次选择收款人部门
      addInit: function (id) {
        this.$ajax.get('/api/payInfo/toInsert', {contId: id}).then(res => {
          res = res.data
          if (res.status === 200) {
            this.firstCreate.content = Object.assign({}, res.data)
            if (!res.data.showAccount) {
              this.firstCreate.state = false

              if (!this.firstCreate.content.showAccount) {
                this.activeAdmin = res.data.account[0].accountId
              }
              this.getEmploye(res.data.storeId)
            } else {
              // console.log(this.getUser)
              this.firstCreate.state = true

              this.dep.id = this.getUser.user.depId
              this.dep.name = this.getUser.user.depName
              this.getEmploye(this.getUser.user.depId)
              this.form.inObjId = this.getUser.user.empId
              this.form.inObj = this.getUser.user.name
            }
          }
        })
      },
      inputOnly: function (type, index) {//输入框限制
        this.form.outObj = this.$tool.textInput(this.form.outObj)
      },
      searchDep: function (payload) {
        this.form.inObjId = ''
        this.clearSelect('emp')
      },
      //收款人下拉选项操作
      clearSelect: function (type = 'dep') {
        if (type === 'dep') {
          this.dep.name = ''
          this.EmployeList = []
          this.form.inObjId = ''
          this.form.inObj = ''
          this.employePage = 1
        } else {
          this.form.inObj = ''
        }
      },
      handleNodeClick(data) {
        this.getEmploye(data.depId, 1, false)
        this.clearSelect()
        this.dep.id = data.depId
        this.dep.name = data.name
      },
      /**
       * 获取所有款类
       */
      getMoneyType: function () {
        let param = {}
        if (this.$route.query.edit) {
          param.payId = this.$route.query.id
        }
        this.$ajax.get('/api/payInfo/selectMoneyType', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.moneyType = this.moneyType.concat(res.data)
          }
        })
      },
      goCancel: function () {
        this.$confirm('是否取消当前操作', {closeOnClickModal: false}).then(() => {
          this.$router.go(-1)
        }).catch(() => {

        })
      },
      goResult: function () {
      },
      /**
       * 获取下拉框数据
       */
      getDropdown: function () {
        let param = {
          contId: this.form.contId
        }
        this.$ajax.get('/api/payInfo/selectValue', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.dropdown = res.data
          }
        })
      },
      /**
       * 获取收款账户
       */
      getAcount: function (empId) {
        let param = {
          contId: this.form.contId,
          empId: empId
        }
        this.$ajax.get('/api/payInfo/selectProceedsAccount', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.account = [].concat(res.data)
          }
        })
      },
      /**
       * 款类选择操作
       */
      getCell: function (label) {
        this.showAmount = label.pName === '代收代付' ? false : true
        this.form.moneyType = label.key
        this.form.moneyTypePid = label.pId
      },
      clearMoneyType: function () {
        this.form.moneyType = ''
        this.form.moneyTypePid = ''
        this.moneyTypeName = ''
        this.$tool.clearForm(this.amount, true)
      },
      /**
       * 获取下拉框选择对象
       * @param item
       */
      getOption: function (item, type) {
        let obj = {}
        let list = type === 1 ? this.dropdown : this.EmployeList
        list.find(tip => {
          if (tip[type === 1 ? 'value' : 'empId'] === item) {
            if (type === 1) {
              obj.outObjId = tip.custId
              obj.outObj = tip.custName
              if (item === 3) {
                this.inputPerson = true
              } else {
                this.inputPerson = false
              }
            } else {
              obj.inObj = tip.name
              if (this.firstCreate.state) {
                this.activeAdmin = ''
                this.getAcount(this.form.inObjId)
              }
            }
            return
          }
        })

        this.form = Object.assign({}, this.form, obj)
      },
    },
    filters: {
      typeFormatter(val) {
        let res = ''
        switch (val) {
          case 'xf':
            res = '返店佣金'
            break;
          case 'cz':
          case 'jr':
            res = '佣金'
            break;
          default:
            res='佣金'
        }
        return res;
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";

  .h32 {
    height: 32px;
    line-height: 32px;
    min-width: 118px;
    &.other {
      min-width: 300px;
    }
    &.no-min {
      min-width: initial;
    }
  }

  .artice-margin {
    margin-bottom: 30px;
  }

  .txt-title {
    font-weight: bold;
    margin-bottom: @margin-15;
    font-size: @size-14;
  }

  input[size='small'] {
    height: 32px;
  }

  input.person {
    margin-left: @margin-10;
  }

  .flex-box {
    display: flex;
    &.tool-tip {
      max-width: 200px;
      justify-content: space-between;
    }
    &.no-max {
      max-width: none;
    }
    .tip-message {
      margin-left: @margin-10;
      display: flex;
      align-items: center;
      cursor: pointer;
      font-weight: normal;
      > i {
        margin-right: 4px;
        font-size: @size-14;
      }
    }
  }

  /deep/ .info-textarea {
    width: 400px;
    .el-textarea__inner {
      height: 115px;
    }
  }

  .col-other {
    > p {
      &:first-of-type {
        margin-bottom: @margin-10;
      }
    }
    > .input-group {
      > p {
        margin-bottom: @margin-10;
      }
    }
  }

  .other-message {
    .input-group {
      margin-right: 60px;
    }
  }

  .bill-form {
    margin-bottom: 30px;
    > li {
      display: flex;
      &:last-of-type {
        .col {
          margin-bottom: 0px;
        }
      }
      .col {
        max-width: 210px;
        margin: 0 30px 21px 0;
        &.no-max {
          max-width: none;
        }
        &.active-360 {
          max-width: 360px;
        }
        &.active-400 {
          max-width: 400px;
        }
        > label {
          display: block;
        }
        > input {
          height: 32px;
          line-height: 32px;
        }
        .text-height {
          height: 32px;
          line-height: 32px;
        }
      }
    }
  }

  .pay-list {
    margin: @margin-15 0 44px;
    > li {
      display: flex;
      align-items: flex-end;
      /*justify-content: space-between;*/
      border-bottom: 1px @color-E9 dashed;
      padding-bottom: @margin-15;
      margin-bottom: @margin-15;
      &:last-of-type {
        /*border: 0px;*/
        margin-bottom: 0px;
      }
      > i {
        color: @color-C8;
        font-size: @icon-size-30;
      }
    }
    .message-box {
      > section {
        display: flex;
        flex-direction: column;
        margin-right: 60px;
        &:nth-of-type(2) {
          > input {
            height: 32px;
          }
        }
      }
    }
  }

  /deep/ .collapse-cell {
    /*margin-top: 13px !important;*/
    .el-table__row {
      > td {
        padding: 0;
        .cell {
          padding: 0 @margin-10;
          > input {
            text-align: center;
          }
          /*padding: 0;
          > ul {
            > li {
              padding: 12px 10px;
              border-bottom: 1px solid #ebeef5;
              text-align: left;
              &:last-of-type {
                border: 0;
              }
            }
          }*/
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

  .icon-xialazhankai {
    color: #A1A1A1;
    font-size: @size-base;
    margin-left: 10px;
  }

  .box {
    padding: 0 @margin-base;
    &-left {
      text-align: left;
    }
  }

  .input-group {
    display: block;
    max-width: 1110px;
    /*> p {
      > span {
        color: @color-red;
        margin-left: 20px;
      }
    }*/
    .money-type-list {
      display: flex;
      background-color: @bg-grey;
      padding: 0 15px;
      margin-top: @margin-base;
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
      flex-wrap: nowrap;
      margin: @margin-base 0;
      width: 810px;
      overflow-x: auto;
      > li {
        border: 1px dashed @color-D6;
        width: 115px;
        min-width: 115px;
        height: 115px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .span {
          width: 100px;
          text-align: center;
          /*word-break: break-all;*/
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        &:first-of-type {
          .iconfont {
            color: @bg-th;
            font-size: 58px;
            position: relative;
            display: flex;
            align-items: center;
            &:before {

            }
          }
        }
        &:nth-of-type(n+1) {
          margin-right: @margin-base;
          position: relative;
          > p {
            position: absolute;
            top: 0;
            right: 0;
            color: @color-red;
            .iconfont {
              font-size: 20px;
            }
          }
        }
      }
    }
    .upload-text {
      color: @color-99A;
      padding: 0 @margin-base;
      > span {
        &:first-of-type {
          color: @color-blue;
          margin: 0;
        }
      }
    }
    /deep/ .el-table, .el-textarea {

    }
  }

  .view {
    background-color: @bg-white;
    height: 100%;
    box-sizing: border-box;
    &-context {
      height: 100%;
      overflow: auto;
      padding: @margin-10 @margin-10 60px;
      box-sizing: border-box;
    }
    section {
      margin: @margin-10 0px;
      /*&:first-of-type {
        display: flex;
        .input-group {
          display: flex;
          margin: 0;
          &:first-of-type {
            margin-right: @margin-15;
          }
        }
      }*/
    }
    > p {
      &:last-of-type {
        position: absolute;
        bottom: @margin-10;
        right: @margin-15;
        text-align: right;
      }
    }
  }

  p.block-receipt-type {
    display: inline-block;
    &.worth-list {
      font-size: 14px;
      margin-left: 40px;
      & > span {
        margin-right: 30px;
      }
    }
    .icon-wenhao {
      margin-left: 10px;
    }
  }

  .warning-text {
    color: red;
  }
</style>
