<template>
  <div class="view-container" ref="tableComView">
    <div class="add-company-container">
      <div class="info-box">
        <el-form :model="companyForm" label-position='right'>
          <div class="company-info">
            <p class="title">企业信息</p>
            <div class="info-content">
              <div class="item item-display">
                <el-form-item label="企业名称: " class="store-name">
                  <el-input size="mini" v-model.trim="companyForm.name" placeholder="营业执照上企业名称" maxlength="50" :clearable="true" :disabled="this.companyForm.verifyState && this.companyForm.verifyState == 3" @input="inputOnly(100,'name')"></el-input>
                </el-form-item>
                <el-form-item label="企业地址: " class="store-name">
                  <el-input size="mini" v-model.trim="companyForm.address" placeholder="营业执照上企业注册地址" maxlength="80" :clearable="true" @input="inputOnly(100,'name')"></el-input>
                </el-form-item>
                <el-form-item label="统一社会信用代码: " v-if="true" >
                  <el-input size="mini" v-model.trim="companyForm.documentCard" :clearable="true" maxlength="20" :disabled="this.companyForm.verifyState && this.companyForm.verifyState == 3" @input="inputOnly(100,'name')"></el-input>
                </el-form-item>
              </div>
            </div>

            <p class="title">法人信息</p>
            <div class="info-content">
              <div class="item item-display">
                <el-form-item label="法人姓名:">
                  <el-input class="w120" size="mini" maxlength="15" v-model.trim="companyForm.lepName" :clearable="true" @input="inputOnly(999,'lepName')"></el-input>
                </el-form-item>
                <el-form-item label="法人身份证: " class="id-card">
                  <el-input class="w240" size="mini" maxlength="18" v-model.trim="companyForm.lepDocumentCard" :clearable="true" :disabled="fourthStoreNoEdit" @input="inputOnly(1000,'lepDocumentCard')"></el-input>
                </el-form-item>
                <el-form-item label="法人手机号: " class="mobile">
                  <el-input class="w240" size="mini" maxlength="11" v-model="companyForm.lepPhone" :clearable="true" :disabled="fourthStoreNoEdit" @keyup.native="getInt(2)"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="company-info">
            <p class="title">银行信息</p>
            <ul class="info-content ul">
              <li v-for="(item,index) in companyForm.entBankList" :key="index" class="addBankRow">
                <div class="row-item">
                  <div class="item-w120">
                    <label>账户类型: </label>
                    <el-select size="small" v-model="item.type" @change="changeType(item.type,index)" class="property" :disabled="fourthStoreNoEdit">
                      <el-option v-for="m in bankType" :key="m.value" :label="m.label" :value="m.value"></el-option>
                    </el-select>
                  </div>
                  <div class="item-w180">
                    <label>开户银行名称: </label>
                    <el-select size="small" v-model="item.bankName" filterable :disabled="fourthStoreNoEdit" class="bank-item">
                      <el-option v-for="m in adminBanks" :key="m.id" :label="m.bankName" :value="JSON.stringify(m)"></el-option>
                    </el-select>
                  </div>
                  <div v-if="item.type==1" class="zhi-hang">
                    <label>支行名称: </label>
                    <el-input size="small" class="bank-branch" maxlength="50" v-model.trim="item.bankBranchName" :clearable="true" :disabled="fourthStoreNoEdit" @input="inputOnly(index,'bankBranchName')"></el-input>
                  </div>
                  <div v-if="item.type==1" class="zhi-hang">
                    <label>支行行号: </label>
                    <el-input size="small" class="bank-branch" maxlength="15" v-model.trim="item.bankBranchCode" placeholder="如不清楚支付行号，请致电开户银行客服电话咨询" :clearable="true" :disabled="fourthStoreNoEdit" @input="inputOnly(index,'bankBranchCode')"></el-input>
                  </div>
                  <div>
                    <label>银行卡号: </label>
                    <el-input size="small" maxlength="20" v-model="item.bankCard" :clearable="true" :disabled="fourthStoreNoEdit" @keyup.native="getInt(3,index)"></el-input>
                  </div>
                  <div v-if="item.type==0">
                    <label>开户名: </label>
                    <el-input size="small" class="card-owner" maxlength="15" v-model.trim="item.bankAccountName" :clearable="true" :disabled="fourthStoreNoEdit" @input="inputOnly(index,'bankAccountName')"></el-input>
                  </div>
                </div>
                <div class="button-box">
                  <span @click="addRow" v-if="companyForm.entBankList.length-1 === index" class="button" :style="{width: companyForm.entBankList.length!==1 ? '184px' : '368px'}" :class="{'direct-sale':fourthStoreNoEdit}"><i class="icon el-icon-plus"></i></span>
                  <span v-if="companyForm.entBankList.length!==1" @click="removeRow(index)" class="button" :style="{width: companyForm.entBankList.length - 2 < index ? '184px' : '368px'}" :class="{'direct-sale':fourthStoreNoEdit}"><i class="icon el-icon-minus"></i></span>
                </div>
              </li>
            </ul>
          </div>
          <p class="title">其他信息</p>
          <div class="company-info bottom-container">
            <div class="upload-box">
              <div class="stamp">
                <span class="label">合同章上传</span>
                <div class="upload">
                  <ul>
                    <li class="up-content">
                      <fileUp id="imgcontract" class="up" :rules="['png','jpg']" @getUrl="upload" :more=false :picSize=true :scane="{path:'setting'}" :canvas="true"><i>+</i></fileUp>
                      <p class="text">点击上传</p>
                    </li>
                    <el-tooltip effect="dark" :content="contractName" placement="bottom">
                      <li v-show="companyForm.contractSign">
                        <div @click="getPicture(1)">
                          <img :src="preConFile[0]" width="90px" height="80px">
                        </div>
                        <p class="pic-name">{{contractName}}</p>
                        <span class="del" @click="delStamp(1)"><i class="el-icon-close"></i></span>
                      </li>
                    </el-tooltip>
                  </ul>
                </div>
              </div>
              <div class="stamp">
                <span class="label">财务章上传</span>
                <div class="upload">
                  <ul>
                    <li class="up-content">
                      <fileUp id="imgfinance" class="up" :rules="['png','jpg']" @getUrl="upload" :more=false :picSize=true :scane="{path:'setting'}" :canvas="true"><i>+</i></fileUp>
                      <p class="text">点击上传</p>
                    </li>
                    <el-tooltip effect="dark" :content="financialName" placement="bottom">
                      <li v-show="companyForm.financialSign">
                        <div @click="getPicture(2)">
                          <img :src="preFinFile[0]" width="90px" height="80px">
                        </div>
                        <p class="pic-name">{{financialName}}</p>
                        <span class="del" @click="delStamp(2)"><i class="el-icon-close"></i></span>
                      </li>
                    </el-tooltip>
                  </ul>
                </div>
              </div>
            </div>
            <div class="tip">
              <div class="message">
                <p>温馨提示: </p>
                <p>如何上传印章图片？</p>
                <p>将您的印章盖到白纸上，然后拍照或者用扫描仪扫到电脑后再上传；</p>
                <p>注意：</p>
                <p>盖在白纸上时请加深印泥的浓度，上传透明背景或白色背景的</p>
                <p>png、jpg格式的图片效果最佳，大小不超过5M</p>
                <p></p>
              </div>
            </div>
          </div>
        </el-form>

        <div class="buttom-box">
          <el-button round type="primary" @click="submitConfirm">认证企业信息</el-button>
        </div>
        <preview :imgList="previewFiles" v-if="preview" @close="preview=false"></preview>
      </div>
    </div>
  </div>
</template>

<script>
  import {MIXINS} from "@/assets/js/mixins";
  import { mapGetters } from "vuex";
  let checkPhone = function (str) {
    return /^1[3456789]\d{9}$/.test(str)
  }
  let checkId = function (str) {
    return /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/.test(str)
  }
  let checkPassPort = function (str) {
    return /^1[45][0-9]{7}$|(^[P|p|S|s]\d{7}$)|(^[S|s|G|g|E|e]\d{8}$)|(^[Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|(^[H|h|M|m]\d{8,10}$)/.test(str)
  }
  let isHaveChinese = function (str) {
    return /[\u4E00-\u9FA5]/g.test(str)
  }
  const rule = {
    name: {
      empty: "企业名称不能为空！",
      repeat: "该企业已存在！"
    },
    address: {
      empty: "企业地址不能为空！"
    },
    documentCard: {
      empty: "统一社会信用代码不能为空！",
      repeat: "该统一社会信用代码已存在！"
    },
    lepName: {
      empty: "法人姓名不能为空！",
    },
    lepDocumentCard: {
      empty: "法人身份证号不能为空！",
      repeat: "法人身份证号错误！"
    },
    lepPhone: {
      empty: "法人手机号不能为空！",
      repeat: "法人手机号错误！"
    },
    bankName: {
      empty: "开户银行名称不能为空！",
    },
    bankBranchName: {
      empty: "支行名称不能为空！",
      repeat: "支行名称必须带有中文"
    },
    bankBranchCode: {
      empty: "支行行号不能为空！",
    },
    bankAccountName: {
      empty: "开户名不能为空！",
    },
    bankCard: {
      empty: "银行卡号不能为空！",
      repeat: "银行卡号错误！"
    },
    contractSign: {
      empty: "合同章上传不能为空！",
    },
    financialSign: {
      empty: "财务章上传不能为空！",
    },
  }
  let obj1 = {
    name: "",
    address: "",
    documentCard: "",
    lepName: "",
    lepDocumentCard: "",
    lepPhone: "",
    entBankList: [],
    contractSign: "",
    financialSign: "",
  }
  let arr = {
      type: 1,
      bankId: '',
      bankName: '',
      bankCode: '',
      bankBranchName: '',
      bankBranchCode: '',
      bankCard: '',
      bankAccountName: '',
    }
  
  export default {
    name: "company",
    mixins: [MIXINS],
    data() {
      return {
        cityId: "",
        cityName: "",
        companyForm: {}, //新增和编辑表单
        delIds: [],
        dictionary: {
          '38':'企业证件',
          '39':'合作方式',
          '40':'证件类型'
        },
        contractName: "",
        financialName: "",
        bankType:[
          {
            label:'个人账户',
            value:0
          },
          {
            label:'企业账户',
            value:1
          }
        ],
        //权限配置
        adminBanks:[],
        fourthStoreNoEdit: false,
        preConFile: [], //合同章缩略图
        preFinFile: [], //财务章缩略图
      }
    },
    mounted() {
      if (this.$route.query.type) {
        this.cityId = this.cityInfo.cityId
        this.cityName = this.cityInfo.cityName
        this.initFormList()
      } else {
        this.companyForm = this.getCompanyData
        //获取电子章文件名和签名展示缩略图
        this.contractName = this.companyForm.contractSign.split('?')[1]
        this.financialName = this.companyForm.financialSign.split('?')[1]
        let arr1 = [this.companyForm.contractSign.split('?')[0]]
        let arr2 = [this.companyForm.financialSign.split('?')[0]]
        this.fileSign(arr1, 'preload').then(res => {
            this.preConFile = res
        })
        this.fileSign(arr2, 'preload').then(res => {
            this.preFinFile = res
        })
      }
      // 枚举数据
      this.getDictionary()
      // 银行列表
      this.getBanks()
      this.setPath(
        this.$tool.getRouter(
          ["设置", "业务设置","公司设置", "新增公司设置"],
          "company"
        )
      );
    },
    methods: {
      changeType(type,index) {
        if (type) return
        this.companyForm.entBankList[index].bankAccountName = ""
      },
      // 获取银行列表
      getBanks:function () {
        this.$ajax.get('/api/system/selectBankName').then(res=>{
          res=res.data
          if(res.status===200){
            this.adminBanks=res.data
          }
        }).catch(error=>{
          this.$message({message:error})
        })
      },
      // 初始化表单 数组集合
      initFormList() {
        this.companyForm = JSON.parse(JSON.stringify(obj1))
        this.companyForm.entBankList = new Array(JSON.parse(JSON.stringify(arr)))
      },
      // 添加银行账户
      addRow() {
        this.companyForm.entBankList.push(JSON.parse(JSON.stringify(arr)))
      },
      // 删除银行账户
      removeRow(index) {
        if (this.companyForm.entBankList.length === 1) {
          return this.$message({type:'warning',message:'请最少保留一个！'})
        }
        if(this.companyForm.entBankList[index].id) {
          this.delIds.push(this.companyForm.entBankList[index].id)
        }
        this.companyForm.entBankList.splice(index,1)
      },
      // 电子签章上传成功 获取存储路径和文件名称
      upload(obj) {
        if(obj.btnId === "imgcontract") {
          this.companyForm.contractSign = obj.param[0].path+`?${obj.param[0].name}`
          this.contractName = obj.param[0].name
        } else {
          this.companyForm.financialSign = obj.param[0].path+`?${obj.param[0].name}`
          this.financialName = obj.param[0].name
        }
        let preloadList = [obj.param[0].path]
        this.fileSign(preloadList, 'preload').then(res => {
            obj.btnId === 'imgcontract' ? this.preConFile = res : this.preFinFile = res
        })
      },
      // 删除电子签章
      delStamp(type) {
        type === 1 ? this.companyForm.contractSign = "" : this.companyForm.financialSign = ""
      },
      checkInfo(val,key) {
        if (key === 'lepDocumentCard' && !checkId(val)) {
          return false
        } else if (key === 'lepPhone' && !checkPhone(val)) {
          return false
        } else if (key === 'bankBranchName' && !isHaveChinese(val)) {
          return false
        }
        return true
      },
      submitConfirm() {
        for (const key in this.companyForm) {
          if (Object.hasOwnProperty.call(rule, key) || key === 'entBankList') {
            const element = this.companyForm[key];
            if (key === 'entBankList' && element.length > 0) {
              for (let index = 0; index < element.length; index++) {
                const BankElement = element[index];
                for (const bankKey in BankElement) {
                  if (Object.hasOwnProperty.call(rule, bankKey)) {
                    if (bankKey === 'bankName' && BankElement[bankKey] && BankElement[bankKey].indexOf('{') !== -1) {
                      let data = JSON.parse(BankElement[bankKey])
                      BankElement.bankId = data.id.toString()
                      BankElement.bankName = data.bankName
                      BankElement.bankCode = data.bankId
                    } else {
                      const BankArrElement = BankElement[bankKey];
                      if (BankElement.type == 0 && ['bankCard','bankAccountName','bankName'].includes(bankKey)) {
                        BankElement.bankBranchCode = ""
                        BankElement.bankBranchName = ""
                        if (!BankArrElement){
                          this.$message({message:rule[bankKey].empty,type:'warning'})
                          return
                        } else if (rule[bankKey].repeat && !this.checkInfo(BankArrElement,bankKey)) {
                          this.$message({message:rule[bankKey].repeat,type:'warning'})
                          return
                        }
                      } else if (BankElement.type == 1 && ['bankCard','bankAccountName','bankBranchName','bankBranchCode','bankName'].includes(bankKey)) {
                        if (!BankArrElement && bankKey !== 'bankAccountName'){
                          this.$message({message:rule[bankKey].empty,type:'warning'})
                          return
                        } else if (rule[bankKey].repeat && !this.checkInfo(BankArrElement,bankKey)) {
                          this.$message({message:rule[bankKey].repeat,type:'warning'})
                          return
                        } else {
                          BankElement.bankAccountName = this.companyForm.name
                        }
                      }
                    }
                  }
              }
              }
            }else if (!element){
              this.$message({message:rule[key].empty,type:'warning'})
              return
            } else if (rule[key].repeat && !this.checkInfo(element,key)) {
              this.$message({message:rule[key].repeat,type:'warning'})
              return
            }
          }
        }
        let param = {cityId:this.cityId.toString(),cityName:this.cityName},
            type = !this.$route.query.type ? 'put' : 'postJSON',
            url = !this.$route.query.type ? `/api/enterprise` : '/api/enterprise';
        if (this.delIds.length > 0) {
          param.delIds = this.delIds
        }
        this.$ajax[type](url,Object.assign(param,this.companyForm)).then(res => {
          res = res.data
            if(res.status === 200) {
              if(res.data == 200){
                this.$message({type:'success',message:res.message})
              }else{
                this.$message({type:'success',message:"认证短信已发送，请及时认证！"})
              }
              this.$router.go(-1)
            }
          }).catch(error => {
              this.$message({message:error})
          })
      },
      // 合同章 财务章 点击预览
      getPicture(type) {
        let img_arr = []
        if(type === 1) {
          img_arr.push({path:this.companyForm.contractSign.split('?')[0],name:this.companyForm.contractSign.split('?')[1]})
        } else {
          img_arr.push({path:this.companyForm.financialSign.split('?')[0],name:this.companyForm.financialSign.split('?')[1]})
        }
        this.previewPhoto(img_arr,0)
      },
      getInt(num,index) {
        if(num===1) {
          this.searchForm.bankCard = this.$tool.numberInput(this.searchForm.bankCard)
        } else if(num===2) {
          this.companyForm.lepPhone = this.$tool.numberInput(this.companyForm.lepPhone)
        } else if(num===3) {
          this.companyForm.entBankList[index].bankCard = this.$tool.numberInput(this.companyForm.entBankList[index].bankCard)
        }
      },
      inputOnly(index,type){
        if(type==='bankAccountName') {
          this.$nextTick(()=>{
            this.companyForm.entBankList[index].bankAccountName=this.$tool.textInput(this.companyForm.entBankList[index].bankAccountName,3)
          })
        }else if(type==='bankBranchName') {
          this.$nextTick(()=>{
            this.companyForm.entBankList[index].bankBranchName=this.$tool.textInput(this.companyForm.entBankList[index].bankBranchName,4)            
          })
        }else if(type==='bankBranchCode') {
          this.$nextTick(()=>{
            this.companyForm.entBankList[index].bankBranchCode=this.$tool.numberInput(this.companyForm.entBankList[index].bankBranchCode)            
          })
        } else if(type==='lepName') {
          this.$nextTick(()=>{
            this.companyForm.lepName=this.$tool.textInput(this.companyForm.lepName)            
          })
        } else if(type==='lepDocumentCard') {
          this.$nextTick(()=>{
            this.companyForm.lepDocumentCard=this.$tool.textInput(this.companyForm.lepDocumentCard,2)            
          })
        } else if(type==='name') {
          this.$nextTick(()=>{
            this.companyForm.name=this.$tool.textInput(this.companyForm.name)            
          })
        }
      },
      cutNumber(val) {
        this.$nextTick(()=>{
          this.companyForm.franchiseRatio=this.$tool.cutFloat({val:this.companyForm.franchiseRatio,max:100})
        })
      },
    },
    computed: {
      cityInfo(){
        return this.getUser.user
      },
      ...mapGetters(["getCompanyData"]),
    }
}
</script>

<style lang="less" scoped>
@import "~@/assets/common.less";
.add-company-container {
  .info-box {
    padding: 30px 40px 50px 30px;
    .title {
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: 700;
      color: #233241;
    }
    /deep/.el-form-item__label {
      width: 140px;
      &::before {
        content: "*";
        color: red;
        position: relative;
        top: 3px;
        margin-right: 1px;
      }
    }
    .w240-item {
      &.el-input {
        width: 240px;
        font-size: 12px;
      }
    }
    .w120 {
      &.el-input {
        width: 120px;
        font-size: 12px;
      }
    }
    .el-input {
      width: 314px;
      font-size: 12px;
    }
    .addBankRow {
      margin-bottom: 60px;
      .row-item {
        .item-w120 {
          /deep/.el-input {
            width: 120px;
          }
        }
        .item-w180 {
          /deep/.el-input {
            width: 180px;
          }
        }
        > div {
          margin-bottom: 20px;
          label {
            display: inline-block;
            width: 126px;
            padding-right: 12px;
            text-align: right;
            font-size: 14px;
            font-weight: 500;
            color: #8492a6;
            &::before {
              content: "*";
              color: red;
              position: relative;
              top: 3px;
              margin-right: 1px;
            }
          }
        }
      }
    }
    
    .button-box {
      padding-left: 71px;
      margin-bottom: 30px;
      .button {
        display: inline-block;
        width: 184px;
        height: 40px;
        line-height: 40px;
        border: 1px dashed #dedde2;
        text-align: center;
      }
    }
    .bottom-container {
      display: flex;
      justify-content: space-between;
      .upload-box {
        .stamp {
          margin-bottom: 30px;
          .label {
            display: inline-block;
            width: 126px;
            padding-right: 12px;
            text-align: right;
            font-size: 14px;
            font-weight: 500;
            color: #8492a6;
            &::before {
              content: "*";
              color: red;
              position: relative;
              top: 3px;
              margin-right: 1px;
            }
          }
          .upload {
            display: inline-block;
            vertical-align: text-top;
            ul {
              display: flex;
              li:last-of-type {
                width: 120px;
                height: 120px;
                border-radius: 7px;
                box-sizing: border-box;
                color: #8492a6;
                background-color: #f2f3f8;
                border: 1px dashed #dedde2;
                margin: 0 10px;
                position: relative;
                cursor: pointer;
                text-align: center;
                div {
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%,-50%);
                }
                p {
                  position: absolute;
                  font-size: 12px;
                  bottom: -30px;
                  color: #233241;
                  width: 120px;
                  height: 48px;
                  text-align: center;
                  z-index: 10;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  word-wrap: break-word;
                }
                .del {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    background-color: #f56c6c;
                    border-radius: 50%;
                    right: 8px;
                    top: 8px;
                    text-align: center;
                    line-height: 20px;
                    color: #fff;
                    display: none;
                }
                &:hover {
                  .del {
                    display: block;
                  }
                }
              }
              .up-content {
                width: 120px;
                height: 120px;
                padding: 28px 34px 20px 34px;
                border: 1px dashed #dedde2;
                border-radius: 7px;
                box-sizing: border-box;
                color: #8492a6;
                .up {
                  width: 50px;
                  height: 50px;
                  line-height: 50px;
                  margin-bottom: 10px;
                  background: #eef2fb;
                  border-radius: 4px;
                  color: #fff;
                  font-size: 40px;
                  font-weight: bold;
                  text-align: center;
                }
              }
            }
          }
        }
      }
      .tip {
        width: 212px;
        height: 262px;
        padding: 14px;
        box-sizing: border-box;
        background: #eef2fb;
        border-radius: 6px;
        box-shadow: 0px 0px 4px 0px rgba(7,47,116,0.08);
        font-size: 12px;
        line-height: 1.8;
        color: #8492A6;
        p+p {
          margin-top: 10px;
        } 
      }
    }
    .buttom-box {
      text-align: center;
    }
  }
}
.dialog-info {
  /deep/ .el-dialog__header {
    padding-left: 0!important;
    .title-class-box {
      .current {
        color: #478de3;
        border-bottom: 4px solid #478de3;
      }
      span {
        padding: 8px 22px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
  .company-info {
    padding: 5px 20px 10px;
    /deep/ .el-form-item__label::before {
      content: "*";
      color: red;
      position: relative;
      top: 3px;
      margin-right: 1px;
    }
    > p {
      font-size: 14px;
      font-weight: bold;
      color:rgba(35,50,65,1);
    }
    .tip {
      display: flex;
      span {
        color: #333;
        font-weight: bold;
        margin-right: 10px;
      }
      .message>p:last-child {
        color: #CD6D6D;
        i { font-weight: bold; color: #D56868; }
      }
    }
    &:first-child {
      .info-content {
        > .item {
          display: flex;
          > .el-form-item {
            display: flex;
            margin-bottom: 0;
            &:nth-child(-n+2) {
              margin-right: 60px;
            }
            /deep/ .el-input {
              width: 200px;
              .el-input__inner {
                height: 28px!important;
              }
            }
          }
          &.shuiwu {
            /deep/ .el-input {
              width: 186px;
            }
          }
          .allow {
            /deep/ .el-input {
              width: 186px;
            }
          }
          .store-name {
            margin-left: -12px;
          }
          .id-card {
            margin-left: 14px;
          }
          .mobile {
            margin-left: -28px;
          }
          .tongyi {
            margin-left: -56px;
          }
          .gongshang {
            margin-left: -14px;
          }
          .zuzhi {
            margin-left: -28px;
          }
        }
      }
      /deep/ .notice {
        width: 342px;
        height: 56px;
        background-color: #000;
        position: fixed;
        left: 40%;
        top: 5%;
        border-radius: 4px;
        display: flex;
        align-items: center;
        color: #fff;
        justify-content: center;
        &-icon {
          margin-right: 10px;
          margin-top: 2px;
          &::before {
            color: red;
          }
        }
      }
    }
    &:nth-child(2) {
      border-top: 1px solid #edecf0;
      .addBankRow {
        position: relative;
        .row-item {
          display: flex;
          margin-top: 10px;
          >div label {
            margin-right: 8px;
            &::before {
              content: "*";
              color: red;
              position: relative;
              top: 3px;
              margin-right: 1px;
            }
          }
          >div:nth-child(-n+2) {
            margin-right: 20px;
          }
          &:nth-child(2) {
            padding-left: 28px;
          }
        }
        &:first-child {
          .button-box span:last-child {
            visibility: hidden;
          }
        }
        /deep/ .el-select, .el-input {
          width: 200px;
        }
        .zhi-hang {
          margin-left: 14px;
          /deep/ .el-input {
            width: 499px;
          }
        }
        .button-box {
          position: absolute;
          right: 25px;
          top: 25px;
        }
        .button {
          display: inline-block;
          padding: 0;
          width: 30px;
          height: 30px;
          line-height: 30px;
          background: #c8c8c8;
          border-radius: 50%;
          text-align: center;
          cursor: pointer;
          i {
            color: #fff;
            font-weight: bold;
          }
        }
        .direct-sale {
          display: none;
        }
      }
    }
    &:last-child {
      border-top: 1px solid #edecf0;
      border-bottom: 1px solid #edecf0;
      > div {
        display: flex;
        margin-bottom: @margin-10;
        &.tip {
          margin-bottom: 0;
        }
        > .stamp {
          display: inline-block;
          flex: 1;
          > span {
            color:rgba(35,50,65,1);
          }
          > .upload {
            display: flex;
            margin-top: @margin-10;
            .point::before {
              content: "*";
              color: red;
              position: relative;
              top: 3px;
            }
            > ul {
              display: flex;
              li {
                width: 120px;
                height: 120px;
                border:1px dashed #DEDDE2;
                border-radius: 4px;
                margin-right: 10px;
                position: relative;
                cursor: pointer;
                text-align: center;
                .text {
                  position: absolute;
                  font-size: @size-base;
                  bottom: 10px;
                  left: 35px;
                  color: #233241;
                }
                .pic-name {
                  position: absolute;
                  font-size: @size-base;
                  bottom: -30px;
                  color: #233241;
                  width: 120px;
                  height: 48px;
                  text-align: center;
                  z-index: 10;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                  word-wrap: break-word;
                }
                .del {
                  position: absolute;
                  width: 20px;
                  height: 20px;
                  background-color: #F56C6C;
                  border-radius: 50%;
                  right: 8px;
                  top: 8px;
                  text-align: center;
                  line-height: 20px;
                  color: #fff;
                  display: none;
                }
                &:first-child {
                  .up {
                    width: 50px;
                    height: 50px;
                    background-color: #EEF2FB;
                    line-height: 50px;
                    text-align: center;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%,-50%);
                  }
                  i {
                    font-size: 56px;
                    color:#fff;
                  }
                }
                &:last-child {
                  >div {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%,-50%);
                  }
                  border: none;
                  background-color: #F2F3F8;
                  &:hover .del {
                    display: inline-block;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .view-content {
    padding: 30px;
    .title {
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: bold;
    }
    .content-box {
      .content-item {
        margin-bottom: 20px;
        span {
          font-size: 14px;
          font-weight: bold;
          color: #233241;
        }
        > span:first-of-type {
          display: inline-block;
          width: 140px;
          text-align: right;
          font-weight: 300;
          color: #8492A6;
        }
        .bank-item {
          margin-bottom: 20px;
          span {
            font-size: 14px;
            font-weight: bold;
            color: #233241;
          }
          > span:first-of-type {
            display: inline-block;
            width: 140px;
            text-align: right;
            font-weight: 300;
            color: #8492A6;
          }
        }
      }
    }
    > div {
      overflow: hidden;
      margin-top: 20px;
      > span {
        display: block;
        color: #333;
        font-weight: bold;
      }
      > p {
        display: flex;
        align-items: center;
        line-height: 2;
        > span {
          flex: 1;
        }
        .card-no {
          padding-left: 84px;
        }
      }
      > .stamp {
        width: 50%;
        display: flex;
        float: left;
        margin-top: 20px;
        span { margin-right: 5px; }
        > div {
          width: 120px;
          height: 120px;
          background-color: rgba(236,238,241,1);
          position: relative;
          border-radius: 8px;
          /deep/ .picture {
            position: absolute;
            top: -6px;
            font-size: 160px!important;
          }
          img {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
          }
        }
      }
    }
  }
  .dep-container {
    padding: 30px 20px;
    .dep-search {
      margin-bottom: 30px;
      span {
        padding-right: 8px;
        font-size: 14px;
        color: #233241;
      }
      .el-select {
        width: 300px;
      }
    }
    .dep-content {
      .title {
        margin-bottom: 6px;
        font-size: 14px;
        > span:first-of-type {
          color: #8492A6;
        }
      }
      td {
        border: none!important;
      }
    }
  }
  
  .dialog-footer {
    .el-button {
      width:100px;
      border-radius:20px;
    }
  }
}
.relieve-dialog {
  border-radius: 8px;
  .text {
    display: inline-block;
    padding: 0 3px;
    color: #478DE3;
  }
  /deep/ .el-dialog__header {
    border-radius: 8px 8px 0 0;
    font-weight: bold;
  }
  /deep/ .el-dialog__body {
    height: 164px;
    line-height: 164px;
    text-align: center;
    border-radius: 0 0 8px 8px;

  }
  /deep/ .el-dialog__close {
    font-weight: bold;
  }
  /deep/ .el-dialog__footer {
    text-align: center;
  }
}
.dep-dialog {
  .item {
    padding-bottom: 20px;
    >span {
      display: inline-block;
      width: 73px;
      padding-right: 12px;
      text-align: right;
      color: #233241;
    }
  }
  /deep/ .el-input {
    width: 300px;
  }
  /deep/ .el-dialog__header {
    border-radius: 8px 8px 0 0;
    font-weight: bold;
  }
  /deep/ .el-dialog__body {
    padding: 20px 30px 30px 70px;
    border-radius: 0 0 8px 8px;

  }
  /deep/ .el-dialog__close {
    font-weight: bold;
  }
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid rgba(237,236,240,1);
}
/deep/ .el-dialog__footer {
  padding-top: 10px;
  padding-bottom: 10px;
}
/deep/ .el-table th {
  background:rgba(238,242,251,1);
}
/deep/ .el-dialog__body {
  padding: 0;
}
</style>
