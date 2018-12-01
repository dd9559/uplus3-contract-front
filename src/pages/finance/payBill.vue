<template>
  <div class="view">
    <p>付款信息</p>
    <section>
      <div class="input-group">
        <label class="form-label">收款方</label>
        <el-select v-model="form.inObjType" placeholder="请选择" @change="getOption">
          <el-option
            v-for="item in dropdown"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="input-group">
        <label class="form-label">申请人:</label>
        <p v-if="userMsg">{{userMsg.name}}</p>
      </div>
    </section>
    <div class="input-group">
      <label class="form-label">款类</label>
      <el-table class="collapse-cell" :span-method="collapse" border :data="moneyType" style="width: 100%"
                header-row-class-name="theader-bg">
        <el-table-column align="center" label="款类（大类）" prop="name"></el-table-column>
        <el-table-column align="center" label="款类（小类）">
          <template slot-scope="scope">
            <ul>
              <li v-for="item in scope.row.moneyTypes">
                <el-radio v-model="form.moneyType" :label="item.key" @change="getType(scope.row)">{{item.name}}</el-radio>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column align="center" label="付款金额（元） ">
          <template slot-scope="scope">
            <ul>
              <li v-for="item in scope.row.moneyTypes">
                <input type="text" class="no-style" placeholder="请输入" v-model="form.smallAmount" v-if="form.moneyType===item.key">
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
        <el-table-column align="center" label="可支配金额">
          <template slot-scope="scope">
            <div v-if="amount" style="margin: 0 10px;">
              <p><span>款类大类余额：{{amount.balance}}元</span></p>
              <p><span>合同余额：{{amount.contractBalance}}元</span></p>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="input-group">
      <p><label class="form-label">收款账户</label></p>
      <el-table border :data="list" style="width: 100%" header-row-class-name="theader-bg">
        <el-table-column align="center" label="收款银行">
          <template slot-scope="scope">
            <span>{{scope.row.bankName|formatNull}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="户名">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入" v-model="scope.row.userName">
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款账户 ">
          <template slot-scope="scope">
            <input type="number" class="no-style" placeholder="请输入6228480059053520074" maxlength="20" v-model="scope.row.cardNumber" @input="getBank(scope.row)">
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额（元）">
          <template slot-scope="scope">
            <span>{{form.smallAmount}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="input-group">
      <p><label>备注信息</label></p>
      <el-input placeholder="请填写备注信息" type="textarea" maxlength="200" v-model="form.remark"></el-input>
    </div>
    <div class="input-group">
      <p><label class="form-label">付款凭证</label></p>
      <ul class="upload-list">
        <li>
          <file-up class="upload-context" @getUrl="getFiles">
            <i class="iconfont icon-shangchuan"></i>
            <span>点击上传</span>
          </file-up>
        </li>
        <li v-for="item in imgList" @click="getPicture">
          <upload-cell :type="item.type"></upload-cell>
          <span>{{item.name}}</span>
        </li>
      </ul>
      <p class="upload-text"><span>点击可上传图片附件或拖动图片到此处以上传附件</span>（买卖交易合同、收据、租赁合同、解约协议、定金协议、意向金协议）</p>
    </div>
    <p>
      <el-button type="primary" @click="goResult">提交付款申请</el-button>
      <el-button>取消</el-button>
    </p>
    <preview :imgList="previewFiles" v-if="preview" @close="preview=false"></preview>
  </div>
</template>

<script>
  import {UPLOAD} from "@/assets/js/uploadMixins";
  import {MIXINS} from "@/assets/js/mixins";

  const rule={
    inObjType:{
      name:'收款方',
    },
    moneyType:{
      name:'款类',
    },
    smallAmount:{
      name:'付款金额',
      type:'money'
    },
    userName:{
      name:'户名',
    },
    cardNumber:{
      name:'收账账户',
      type:'bankCard'
    },
    filePath:{
      name:'付款凭证',
    },
  }

  export default {
    mixins: [UPLOAD,MIXINS],
    data() {
      return {
        form: {
          contId:1,
          remark:'',
          inObj:'',
          inObjId:'',
          inObjType:'',
          moneyType:'',
          moneyTypePid:'',
          smallAmount:'',
        },
        moneyType: [],
        list:[
          {
            bankName:'',
            userName:'',
            cardNumber:'',
            amount:''
          }
        ],
        dropdown:[],
        amount:null,
        files:[],
        imgList:[],
      }
    },
    created(){
      this.getDropdown()
      this.getMoneyType()
      this.getAdmin()

      let type = this.$route.query.edit
      if (type) {
        this.getDetails({type: type, payId: this.$route.query.id})
      }
    },
    methods:{
      getPicture:function () {
        let arr=[]
        this.imgList.forEach(item=>{
          arr.push(item.path)
        })
        this.fileSign(arr)
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
              inObjType:res.data.inObjType.value,
              moneyType: res.data.moneyType,
              moneyTypePid: res.data.moneyTypePid,
              smallAmount: res.data.amount,
              id: res.data.id
            }
            if(res.data.filePath){
              this.imgList=this.$tool.cutFilePath(JSON.parse(res.data.filePath))
            }
            this.imgList.forEach(item=>{
              this.files.push(`${item.path}?${item.name}`)
            })
            this.list = res.data.account
            this.form = Object.assign({}, this.form, obj)
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
      /**
       * 获取下拉框数据
       */
      getDropdown:function () {
        let param = {
          contId:1
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
            res.data.forEach((item,index)=>{
              if(item.name==='代收代付'){
                this.moneyType.splice(index,1)
              }
            })
          }
        })
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
      /**
       * 根据卡号获取银行信息
       */
      getBank:function (row) {
        let param = {
          cardNumber:row.cardNumber
        }
        if(param.cardNumber.length>=16&&param.cardNumber.length<=20){
          this.$ajax.get('/api/system/selectBankNameByCard',param).then(res=>{
            res=res.data
            if(res.status===200){
              row.bankName = res.data.bankName
            }
          })
        }
        if(param.cardNumber.length>20){
          row.cardNumber = row.cardNumber.substr(0,20)
        }
      },
      /**
       * 合并所有行
       */
      collapse:function ({ rowIndex, columnIndex }) {
        if(columnIndex>=3){
          if (rowIndex === 0) {
            return [this.moneyType.length,1]
          } else {
            return [0,0]
          }
        }
      },
      /**
       * 获取下拉框选择对象
       * @param item
       */
      getOption:function (item) {
        let obj = {
          inObjId:'',
          inObj:''
        }
        console.log(obj)
        this.dropdown.find(tip=>{
          if(tip.value===item&&!!tip.custId){
            obj.inObjId = tip.custId
            obj.inObj = tip.custName
            return
          }
        })
        this.form = Object.assign({},this.form,obj)
      },
      goResult:function () {
        let param = Object.assign({},this.form)
        this.list[0].amount = param.smallAmount
        param.inAccount = [].concat(this.list)

        this.$tool.checkForm(param,rule).then((res)=>{
          this.$tool.checkForm(this.list[0],rule).then(()=>{
            if(this.files.length===0){
              this.$message({
                message:'付款凭证不能为空'
              })
            }else {
              param.filePath = [].concat(this.files)
              if(this.$route.query.edit){
                delete param.contId
                this.$ajax.put('/api/payInfo/updatePayMentInfo', param).then(res => {
                  res = res.data
                  if (res.status === 200) {
                    this.$message({
                      message:'修改成功'
                    })
                    this.$router.go(-1)
                  }
                })
              }else {
                this.$ajax.postJSON('/api/payInfo/savePayment', param).then(res => {
                  res = res.data
                  if (res.status === 200) {
                    this.$router.push({
                      path: 'payResult',
                      query:{
                        content:JSON.stringify(res.data)
                      }
                    })
                  }
                })
              }
            }
          }).catch((error)=>{
            this.$message({
              message:`${error.title}${error.msg}`
            })
          })
        }).catch((error)=>{
          this.$message({
            message:`${error.title}${error.msg}`
          })
        })
      }
    },
    watch:{
      list:function (val) {
        if(val.length===0){
          this.list.push({
            bankName:'',
            userName:'',
            cardNumber:'',
            amount:''
          })
        }
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
      margin: @margin-base;
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
          word-break: break-all;
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
