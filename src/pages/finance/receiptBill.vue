<template>
  <div class="view">
    <p class="f14">收款信息</p>
    <section>
      <div class="input-group">
        <label class="form-label no-width f14">付款方</label>
        <el-select size="small" v-model="form.outObjType" placeholder="请选择" @change="getOption(form.outObjType,1)">
          <el-option
            v-for="item in dropdown"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="input-group">
        <label class="form-label no-width f14">收款人:</label>
        <el-select :clearable="true" ref="tree" size="small" filterable remote :loading="Loading" :remote-method="remoteMethod" @clear="clearSelect('dep')" v-model="dep.name" placeholder="请选择">
          <el-option class="drop-tree" value="">
            <el-tree :data="DepList" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
          </el-option>
        </el-select>
        <el-select :clearable="true" ref="employe" v-loadmore="moreEmploye" class="margin-left" size="small" v-model="form.inObjId" placeholder="请选择" @clear="clearSelect('emp')" @focus="employeInfo=false" @change="getOption(form.inObjId,2)">
          <el-option :label="form.inObj" :value="form.inObjId" v-if="employeInfo"></el-option>
          <el-option
            v-for="(item,index) in EmployeList"
            :key="index"
            :label="item.name"
            :value="item.empId">
          </el-option>
        </el-select>
        <!--<el-select size="small" v-model="form.inObjId" placeholder="请选择" @change="getOption(form.inObjId,2)">
          <el-option
            v-for="item in receiptMan"
            :key="item.empId"
            :label="item.name"
            :value="item.empId">
          </el-option>
        </el-select>-->
      </div>
    </section>
    <div class="input-group">
      <p><label class="form-label f14">款类</label></p>
      <ul class="money-type-list">
        <li v-for="item in types" :key="item.id" :class="[activeType===item.id?'active':'']"
            @click="choseType(item)">{{item.name}}
        </li>
      </ul>
      <el-table v-if="activeType===1" class="collapse-cell" border :data="moneyType" :span-method="collapseRow"
                style="width: 100%"
                header-row-class-name="theader-bg">
        <el-table-column align="center" prop="pName" label="款类（大类）"></el-table-column>
        <el-table-column min-width="100" align="center" label="款类（小类）">
          <template slot-scope="scope">
            <el-radio class="money-type-radio" v-model="form.moneyType" :label="scope.row.key" @change="getType(scope.row)">{{scope.row.name}}</el-radio>
            <!--<ul>
              <li v-for="item in scope.row.moneyTypes">
                <el-radio class="money-type-radio" v-model="form.moneyType" :label="item.key" @change="getType(scope.row)">{{item.name}}
                </el-radio>
              </li>
            </ul>-->
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款金额（元） ">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入" v-focus v-model="form.smallAmount" @input="cutNum(1)" v-if="form.moneyType===scope.row.key">
            <span v-else @click="getType(scope.row,'focus')">请输入</span>
            <!--<ul>
              <li v-for="(item,index) in scope.row.moneyTypes">
                <input type="text" class="no-style" placeholder="请输入" v-focus @input="cutNum(1)" v-model="form.smallAmount"
                       v-if="form.moneyType===item.key">
                <span v-else @click="getType(scope.row,'focus',index)">请输入</span>
              </li>
            </ul>-->
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
      <el-table v-else-if="moneyTypeOther.length>0" class="collapse-cell" border :data="moneyTypeOther[0].moneyTypes" :span-method="collapseRow"
                style="width: 100%"
                header-row-class-name="theader-bg" key="other">
        <el-table-column align="center" label="款类（大类）">
          <template slot-scope="scope">{{moneyTypeOther[0].name}}</template>
        </el-table-column>
        <el-table-column min-width="100" align="center" label="款类（小类）">
          <template slot-scope="scope">
            <div class="box box-left">
              <el-radio class="money-type-radio" v-model="form.moneyType" :label="scope.row.key" @change="getType(scope.row,'other')">
                {{scope.row.name}}
              </el-radio>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款金额（元） ">
          <template slot-scope="scope">
            <div class="box">
              <input type="text" class="no-style" placeholder="请输入" v-focus @input="cutNum(1)" v-model="form.smallAmount"
                     v-if="form.moneyType===scope.row.key">
              <span v-else @click="getType(scope.row,'other')">请输入</span>
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
      <p><label class="form-label f14">刷卡资料补充</label></p>
      <el-table border :data="cardList" style="width: 100%" header-row-class-name="theader-bg">
        <el-table-column align="center" label="刷卡银行">
          <template slot-scope="scope">
            <span>{{scope.row.bankName|formatNull}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="户名">
          <template slot-scope="scope">
            <input type="text" v-model.trim="scope.row.userName" maxlength="6" class="no-style" placeholder="请输入" @input="inputOnly(scope.$index)">
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
            <input type="text" v-model="scope.row.amount" class="no-style" @input="cutNum(scope.row,'amount')" placeholder="请输入">
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单编号">
          <template slot-scope="scope">
            <input type="text" v-model="scope.row.orderNo" class="no-style" placeholder="请输入">
          </template>
        </el-table-column>
        <el-table-column align="center" label="手续费（元）">
          <template slot-scope="scope">
            <input type="text" v-model="scope.row.fee" class="no-style" @input="cutNum(scope.row,'fee')" placeholder="请输入">
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
      <p><label class="f14">备注信息</label></p>
      <el-input v-model="form.remark" placeholder="请填写备注信息" maxlength="200" type="textarea"></el-input>
    </div>
    <div class="input-group" v-if="activeType===2">
      <p><label class="form-label f14">付款凭证</label></p>
      <ul class="upload-list">
        <li>
          <file-up class="upload-context" @getUrl="getFiles">
            <i class="iconfont icon-shangchuan"></i>
            <span>点击上传</span>
          </file-up>
        </li>
        <li v-for="(item,index) in imgList" :key="index" @mouseenter="activeLi=index" @mouseleave="activeLi=''"  @click="previewPhoto(imgList,index)">
          <upload-cell :type="item.type"></upload-cell>
          <span>{{item.name}}</span>
          <p v-show="activeLi===index" @click.stop="delFile"><i class="iconfont icon-tubiao-6"></i></p>
        </li>
      </ul>
    </div>
    <p>
      <el-button class="btn-info" round size="small" type="primary" v-dbClick @click="goResult">{{activeType===1?'创建POS收款订单':'录入信息并提交审核'}}</el-button>
      <el-button class="btn-info" round size="small" @click="goCancel">取消</el-button>
    </p>
    <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
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
      name:'收款金额',
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
      name:'收款金额',
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
    bankName:{
      name:'刷卡银行'
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
        contId:'',
        dep:{
          id:'',
          name:''
        },
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
        dictionary: {
          '534': ''
        },
        activeAdmin: '',
        account: [],
        dropdown: [],
        receiptMan: [],
        files:[],
        imgList:[],
        activeLi:'',
        employeInfo:true,
        employePage:1,
        collapseMsg:{
          total:0,
          row:[]
        }
      }
    },
    created() {
      this.form.contId = this.$route.query.contId?parseInt(this.$route.query.contId):''
      this.getMoneyType()
      this.getDictionary()
      this.remoteMethod()
      this.getAcount()
      this.getDropdown()
      // this.getReceiptman()
      this.getAdmin()
      let type = this.$route.query.edit
      let inAccount = this.$route.query.type
      if (type) {
        this.getDetails({type: type, payId: this.$route.query.id})
      }
      if(inAccount){
        this.activeType=parseInt(inAccount)===4?2:1
      }
    },
    methods: {
      clearData:function () {
        this.$tool.clearForm(this.form)
        this.cardList=[]
        this.files=[]
        this.imgList=[]
      },
      cutNum:function (val,item) {
        if(val===1){
          this.form.smallAmount=this.$tool.cutFloat({val:this.form.smallAmount,max:999999999.99})
        }else {
          val[item]=this.$tool.cutFloat({val:val[item],max:999999999.99})
        }
      },
      inputOnly:function (index) {
        this.cardList[index].userName=this.$tool.textInput(this.cardList[index].userName)
      },
      getPicture:function () {
        let arr=[]
        this.imgList.forEach(item=>{
          arr.push(item.path)
        })
        this.fileSign(arr)
      },
      //收款人下拉选项操作
      clearSelect:function (type='dep') {
        if(type==='dep'){
          this.dep.name=''
          this.EmployeList=[]
          this.form.inObjId=''
          this.form.inObj=''
          this.employePage=1
        }else {
          this.form.inObj=''
          /*this.employePage=1
          this.EmployeList=[]*/
        }
      },
      handleNodeClick(data) {
        this.getEmploye(data.depId)
        this.clearSelect()
        this.dep.id=data.depId
        this.dep.name=data.name
        if(data.subs.length===0){
          this.$refs.tree.blur()
        }
      },
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
            this.dep.id=res.data.deptId
            this.dep.name=res.data.store
            this.getEmploye(res.data.deptId)
            if(res.data.filePath){
              this.imgList=this.$tool.cutFilePath(JSON.parse(res.data.filePath))
            }
            this.imgList.forEach(item=>{
              this.files.push(`${item.path}?${item.name}`)
            })
            this.cardList = res.data.account //刷卡补充
            if(res.data.inAccount&&res.data.inAccount.length>0){ //收账账户
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
            // this.moneyType = this.moneyType.concat(res.data)
            res.data.forEach((item, index) => {
              if (item.name === '代收代付') {
                // this.moneyType.splice(index, 1)
                this.moneyTypeOther = res.data.splice(index, 1)
              }
            })
            res.data.forEach(item=>{
              this.collapseMsg.total=this.collapseMsg.total+item.moneyTypes.length
              this.collapseMsg.row.push(item.moneyTypes.length)
              item.moneyTypes.forEach(cell=>{
                cell.pId=item.id
                cell.pName=item.name
              })
              this.moneyType = this.moneyType.concat(item.moneyTypes)
            })
          }
        })
      },
      /**
       * 获取上传文件
       */
      getFiles:function (payload) {
        this.files=this.files.concat(this.$tool.getFilePath(payload.param))
        this.imgList=this.$tool.cutFilePath(this.files)
      },
      delFile:function () {
        this.imgList.splice(this.activeLi,1)
        this.files.splice(this.activeLi,1)
      },
      goCancel:function () {
        this.$confirm('是否取消当前操作',{closeOnClickModal:false}).then(()=>{
          this.$router.go(-1)
        }).catch(()=>{

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
          let state = false
          if(this.activeType===2){
            if(param.inAccount.length===0){
              this.$message({
                message:'收账账户不能为空'
              })
            }else {
              // let state=false
              let arr=[]
              let moneyArr=[] //刷卡资料补充,输入金额集合
              let feeArr=[] //刷卡资料补充,输入手续费集合

              let count=0
              param.outAccount.find((item,index)=>{
                /*if(!state){
                  this.$tool.checkForm(item,RULE).then(()=>{
                    let count=0
                    param.outAccount.forEach(item=>{
                      count = count+parseFloat(item.amount)
                      // return count
                    })
                    if(count!==parseFloat(this.form.smallAmount)){
                      this.$message({
                        message:'刷卡金额要等于收款金额'
                      })
                      return true
                    }
                    if(index===param.outAccount.length-1){
                      if(this.files.length===0){
                        this.$message({
                          message:'收款凭证不能为空'
                        })
                      }else {
                        param.filePath = [].concat(this.files)
                        this.getResult(param,this.$route.query.edit?'edit':'')
                      }
                    }
                  }).catch(error=>{
                    // debugger
                    state=true
                    this.$message({
                      message:error.title==='刷卡银行'?'银行卡号输入有误':`${error.title}${error.msg}`
                    })
                  })
                }*/
                count = count+parseFloat(item.amount)
                moneyArr.push(item.amount)
                feeArr.push(item.fee)
                arr.push(this.$tool.checkForm(item,RULE))
              })
              Promise.all(arr).then(res=>{
                if(count!==parseFloat(this.form.smallAmount)){
                  this.$message({
                    message:'刷卡金额要等于收款金额'
                  })
                  return true
                }else if(moneyArr.includes('0')){
                  this.$message({
                    message:'输入金额必须大于0'
                  })
                  return
                }else if(feeArr.includes('0')){
                  this.$message({
                    message:'输入手续费必须大于0'
                  })
                  return
                }
                if(this.files.length===0){
                  this.$message({
                    message:'收款凭证不能为空'
                  })
                }else {
                  param.filePath = [].concat(this.files)
                  this.getResult(param,this.$route.query.edit?'edit':'')
                }
              }).catch(error=>{
                this.$message({
                  message:error.title==='刷卡银行'?'银行卡号输入有误':`${error.title}${error.msg}`
                })
              })
            }
          }
          if(this.activeType===1){
            this.getResult(param,this.$route.query.edit?'edit':'')
          }
        }).catch(error=>{
          this.$message({
            message:`${error.title}${error.msg}`
          })
        })
      },
      getResult:function (param,type='add') {
        if (type==='edit') {
            this.$ajax.put('/api/payInfo/updateProceedsInfo', param).then(res => {
              res=res.data
              if(res.status===200){
                this.$message({
                  message:'修改成功'
                })
                this.$router.go(-1)
              }
            }).catch(error=>{
              this.$message({
                message:error
              })
            })
          } else {
            this.$ajax.postJSON('/api/payInfo/saveProceeds', param).then(res => {
              res = res.data
              if (res.status === 200) {
                this.$router.push({
                  path: 'receiptResult',
                  query:{
                    type:this.activeType,
                    content:JSON.stringify(res.data)
                  }
                })
              }
            }).catch(error=>{
              this.$message({
                message:error
              })
            })
          }
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
        this.form = Object.assign({},this.form,obj)
      },
      //合并单元格
      collapseRow: function ({rowIndex, columnIndex}) {
        // debugger
        if (this.activeType === 1) {
          if(columnIndex >= 3){
            if (rowIndex === 0) {
              return [this.moneyType.length, 1]
            } else {
              return [0, 0]
            }
          }
          if(columnIndex===0){
            return this.$tool.collapseRow({
              rowIndex:rowIndex,
              rowTotal:this.collapseMsg.total,
              collapse:this.collapseMsg.row
            })
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
        let list = type === 1 ? this.dropdown : this.EmployeList
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
        row.cardNumber=this.$tool.numberInput(row.cardNumber)
        let param = {
          cardNumber: row.cardNumber
        }
        if(param.cardNumber.length>20){
          row.cardNumber = row.cardNumber.substr(0,20)
          return
        }
        if (param.cardNumber.length >= 16) {
          this.$ajax.get('/api/system/selectBankNameByCard', param).then(res => {
            res = res.data
            if (res.status === 200) {
              this.cardList[index].bankName = res.data.bankName?res.data.bankName:''
            }
          })
        }
      },
      getType: function (label, type = 'init',index) {
        let obj = {
          /*moneyType: '',
          moneyTypePid: '',*/
          smallAmount: '',
          proceedsType: '',
        }
        this.activeAdmin = ''
        this.form = Object.assign({},this.form,obj)
        if (type === 'init'||type==='focus') {
          this.form.moneyTypePid = label.pId
        } else if(type==='other') {
          this.form.moneyType=label.key
          this.form.moneyTypePid = this.moneyTypeOther[0].id
        }
        if(type==='focus'){
          this.form.moneyType=label.key
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
      },
      userMsg:function (val) {
        if(!this.$route.query.edit){
          this.dep.id=val.depId
          this.dep.name=val.depName
          this.getEmploye(val.depId)
          this.form.inObjId=val.empId
          this.form.inObj=val.name
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";

  /deep/ .collapse-cell {
    /*margin-top: 13px !important;*/
    .el-table__row {
      > td {
        padding: 0;
        .cell {
          padding: 0 @margin-10;
          >input{
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
    margin: @margin-10 0 0;
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
      flex-wrap: wrap;
      margin: @margin-base 0;
      >li{
        border: 1px dashed @color-D6;
        width: 120px;
        height: 120px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        >span{
          width: 100px;
          text-align: center;
          /*word-break: break-all;*/
          white-space: nowrap;
          overflow: hidden;
          text-overflow:ellipsis;
        }
        &:first-of-type{
          .iconfont{
            color: @bg-th;
            font-size: 58px;
            position: relative;
            display: flex;
            align-items: center;
            &:before{

            }
          }
        }
        &:nth-of-type(n+1){
          margin-right: @margin-base;
          position: relative;
          >p{
            position: absolute;
            top: 0;
            right: 0;
            color: @color-red;
            .iconfont{
              font-size: 20px;
            }
          }
        }
      }
    }
    .upload-text{
      color: @color-99A;
      padding: @margin-base;
      >span{
        &:first-of-type{
          color: @color-blue;
        }
      }
    }
    /deep/ .el-table, .el-textarea {
      margin: @margin-base 0;
    }
  }

  .view {
    background-color: @bg-white;
    padding: @margin-10;
    > section {
      margin: @margin-10 0px;
      &:first-of-type {
        display: flex;
        .input-group {
          display: flex;
          margin: 0;
          &:first-of-type {
            margin-right: @margin-15;
          }
        }
      }
    }
    >p{
      &:last-of-type{
        margin-top: @margin-15;
      }
    }
  }
</style>
