<template>
  <div class="info-dialog" @click="showInput('init')">
    <!-- 合同变更（编辑） -->
    <el-dialog :title="`合同${dialogOperation==='details' && getDialogType === '变更' ? '内容' : ''}${getDialogType}${dialogOperation==='details' && getDialogType === '变更' && !isContractList ? '审核' : ''}`" :visible="getCancelDialog" width="740px" @close='close' :closeOnClickModal="false">
      <div class="audit-box">
        <div class="textareabox">
          <p :class="{'form-label':!getContentHidden}">{{getDialogType}}原因：</p>
          <!-- <el-input type="textarea" :rows="3" placeholder="请填写合同变更原因，最多100字" class="textarea" maxlength=100></el-input> -->
          <div class="reason">
            <el-input type="textarea" :rows="4" :placeholder="`请填写合同${getDialogType}原因`" :disabled="getContentHidden" v-model="textarea" @input.native="inputOnly('textarea')" resize='none' maxlength="100">
            </el-input>
            <span>{{textarea.length}}/100</span>
          </div>
        </div>
        <div class="box" v-if="getDialogContType===1 && !editFlag">
          <p v-if="dialogOperation==='details' && getDialogType === '变更'">合同信息（{{recordTypeText}}）</p>
          <p v-else>佣金金额：</p>
          <el-table v-if="dialogOperation==='details' && getDialogType === '变更'" :data="changeDetailTableData" border header-row-class-name="theader-bg" max-height="300" style="width: 100%">
            <el-table-column type="index" align="center" width="98" label="序号"></el-table-column>
            <el-table-column type="index" align="center" width="200" label="字段">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column type="index" align="center" width="200" label="变更前">
              <template slot-scope="scope">
                <span v-if="scope.row.key === 'estTransferTime'">{{scope.row.beforeText|formatDate}}</span>
                <span v-else-if="scope.row.key === 'signDate'">{{scope.row.beforeText|formatTime}}</span>
                <span v-else-if="scope.row.key === 'otherCooperationInfo_type'">{{scope.row.beforeText === 1 ? '客户转' : '无'}}</span>
                <span v-else>{{scope.row.beforeText || scope.row.default}}</span>
              </template>
            </el-table-column>
            <el-table-column type="index" align="center" width="200" label="变更后">
              <template slot-scope="scope">
                <span v-if="scope.row.key === 'estTransferTime'">{{scope.row.afterText|formatDate}}</span>
                <span v-else-if="scope.row.key === 'otherCooperationInfo_type'">{{scope.row.afterText === 1 ? '客户转' : '无'}}</span>
                <span v-else style="display: inline-block;padding-right:15px">{{scope.row.afterText || scope.row.default}}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-table v-else :data="tableData" border header-row-class-name="theader-bg" style="width: 100%">
            <el-table-column align="center" prop="name"></el-table-column>
            <el-table-column align="center" label="业主佣金">
              <template slot-scope="scope">
                <div class="info-inputbox" v-if="scope.$index===1&&!getContentHidden">
                  <template v-if="!scope.row.ownerState">
                    <input type="text" class="el-input__inner" placeholder="请输入" @click.stop="" v-model="moneyData.owner" @input="cutNum('owner')">
                    <span class="info-cell">元</span>
                  </template>
                  <span v-else class="info-cell">{{moneyData.owner}}元<i class="iconfont icon-xiugai1" @click.stop="showInput(scope.row,'ownerState')"></i></span>
                </div>
                <span v-else class="info-cell">{{scope.$index===1?moneyData.owner:commission.owner}}元</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="客户佣金">
              <template slot-scope="scope">
                <div class="info-inputbox" v-if="scope.$index===1&&!getContentHidden">
                  <template v-if="!scope.row.userState">
                    <input type="text" class="el-input__inner" placeholder="请输入" @click.stop="" v-model="moneyData.user" @input="cutNum('user')">
                    <span class="info-cell">元</span>
                  </template>
                  <span v-else class="info-cell">{{moneyData.user}}元<i class="iconfont icon-xiugai1" @click.stop="showInput(scope.row,'userState')"></i></span>
                </div>
                <span v-else class="info-cell">{{scope.$index===1?moneyData.user:commission.user}}元</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 上传附件 -->
        <div class="uploadfile">
          <div class="uploadtitle" :class="{'form-label':!getContentHidden && !isCheckFile}">{{getDialogType}}协议:
            <template v-if="!getContentHidden">
              <span><b>注：</b>协议支持所有格式</span>
              <!-- <span class="iconfont" @click="downloadFile" v-if="dialogType!=='bg'">
                <i class="el-icon-document"></i>下载解约协议
              </span> -->
            </template>
            <span v-if="uploadList.length===0&&getContentHidden">无</span>
          </div>
          <div class="uploadbtn">
            <ul>
              <li v-if="!getContentHidden">
                <file-up class="uploadSubject" :scane="cancelScane" @getUrl="uploadSubject" id="cancel_">
                  <i class="iconfont icon-shangchuan"></i>
                  <p>点击上传</p>
                </file-up>
              </li>
              <li v-for="(item,index) in uploadList" :key="item.index" @mouseover="moveIn(item.index+item.path)" @mouseout="moveOut(item.index+item.path)">
                <el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
                  <div class="namePath" @click="previewPhoto(uploadList,index)">
                    <img class="signImage" :src="item.path|getSignImage(changeCancelFiles)" alt="" v-if="isPictureFile(item.fileType)">
                    <upload-cell :type="item.fileType" v-else></upload-cell>
                    <p>{{item.name}}</p>
                  </div>
                </el-tooltip>
                <i class="iconfont icon-tubiao-6" @click="delectData(index)" v-if="!getContentHidden" :class="{'deleteShow':isDelete===item.index+item.path}"></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="btnbox" slot="footer" v-if="!getOperationType">
        <el-button round @click="close()">取 消</el-button>
        <el-button round type="primary" @click="saveFile()" :disabled="forbid">{{getContentHidden?'审 核':'保 存'}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="审核" :visible="checkDialogState" width="560px" @close='close' :closeOnClickModal="false">
      <div class="audit-box">
        <div class="textareabox">
          <div class="reason">
            <el-input type="textarea" :rows="6" placeholder="请输入通过或者驳回原因" v-model.trim="checkDialogReasion" @input="inputOnly('check')" resize='none' maxlength="200">
            </el-input>
            <span>{{checkDialogReasion.length}}/200</span>
          </div>
        </div>
      </div>
      <div class="btnbox" slot="footer">
        <el-button round @click="toCheck(2)">驳 回</el-button>
        <el-button round type="primary" @click="toCheck(1)" :disabled="forbid">通 过</el-button>
      </div>
    </el-dialog>
    <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
    <checkPerson :show="checkPerson.state" :bizCode="checkPerson.code" :flowType="checkPerson.flowType" @close="closePerson(1)" @submit="closePerson(2)" v-if="checkPerson.state"></checkPerson>
  </div>
</template>

<script>
  import {MIXINS} from "@/assets/js/mixins";
  import checkPerson from '@/components/checkPerson';

  function getCardType (val) {
    let cardType;
    switch (val) {
      case 1:
        cardType = '身份证/'
        break;
      case 2:
        cardType = '护照/'
        break;
      case 3:
        cardType = '营业执照/'
        break;
      case 4:
        cardType = '军官证/'
        break;
      default: 
        cardType = ''
    }
    return cardType
  }

   function getUnitType (val) {
      let UnitType;
      switch (val) {
          case 1:
            UnitType = '元/月'
            break;
          case 2:
            UnitType = '元/季度'
            break;
          case 3:
            UnitType = '元/半年'
            break;
          case 4:
            UnitType = '元/年'
            break;
        }
      return UnitType
    }

  export default {
    mixins: [MIXINS],
    components:{
      checkPerson
    },
    props: {
      //类型 变更bg 解约jy
      dialogType: {
        type: String,
        default: "bg"
      },
      //发起add 详情details
      dialogOperation:{
        type:String,
        default:"add"
      },
      operationType:{
        type:String,
        default:"edit"
      },
      contId: {
        type: Number,
        default: 0
      },
      code: {
        type: String,
        default: ""
      },
      cityCode:{
        type: Number,
        default: 0
      },
      cancelDialog: {//弹窗显示或关闭
        type: Boolean,
        default: false
      },
      commission:{//原佣金
        type:Object,
        default:function () {
          return {owner:12,user:24}
        }
      },
      //合同类型(租赁买卖代办1 意向定金2)
      dialogContType:{
        type:Number,
        default:1
      },
      // 是否是2.6.8版本新加的编辑变更逻辑
      editFlag: {
        type: Number,
        default: function () {
          return 0
        }
      },
      editParam: {
        type: Object,
        default: function () {
          return null
        }
      },
      // 是否需要变更协议
      isCheckFile: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      isContractList:{
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        title: "",
        //上传文件的路径数组
        uploadList: [],
        isImg: false,
        textarea: '',
        isDelete: '',
        //保存按钮是否可点击
        forbid: false,
        cancelScane: {
          path: "jieyue",
          id: this.code
        },
        changeCancelFiles: [],//图片缩略图
        tableData: [
          {name: '原金额'},
          {name: '调整为',ownerState:true,userState:true}
        ],
        changeDetailTableData:[],
        recordTypeText: '',
        moneyData:{//调整佣金
          owner:0,
          user:0
        },
        checkDialogState:false,//详情审核弹窗
        checkDialogReasion:'',
        checkPerson: {
          state:false,
          type:3,
          code:this.code,
          flowType:this.dialogType==='bg'?9:10
        },
      };
    },

    computed: {
      getCancelDialog() {
        return this.cancelDialog;
      },
      getDialogType() {
        return this.dialogType === 'bg' ? '变更' : '解约';
      },
      getContId() {
        return this.contId;
      },
      getCode() {
        return this.code;
      },
      getContentHidden(){
        return this.dialogOperation==='details'
      },
      getOperationType(){
        return this.operationType==='look'
      },
      getDialogContType(){
        return this.dialogContType
      },
    },

    methods: {
      cutNum:function (prop) {
        this.$set(this.moneyData,prop,this.$tool.cutFloat({val:this.moneyData[prop],max:999999999.99}))
      },
      inputOnly(type){
        let addrReg=/\\|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g
        if(type==="textarea"){
          this.textarea=this.textarea.replace(/\s+/g,"").replace(addrReg,'')
        }else{
          this.checkDialogReasion=this.checkDialogReasion.replace(/\s+/g,"").replace(addrReg,'')
        }
      },
      showInput:function(row,state){//编辑佣金
        if(row==='init'){
            this.tableData[1].ownerState=true
            this.tableData[1].userState=true
            return
        }
        //初始化
        row.ownerState=true
        row.userState=true
        row[state]=false
      },
      //下载解约协议操作--新增xu
      downloadFile: function () {
        this.excelCreate('/contract/getAttachment', {type: 2})
      },
      close(operation=1) {
        this.$emit(operation===1?"close":'success');
      },
      //设置审核人成功
      closePerson(type){
        this.close(type)
      },
      //获取文件路径数组
      uploadSubject(data) {
        let arr = data.param;
        arr.forEach(element => {
          let fileType = this.$tool.get_suffix(element.name);
          element.fileType = fileType;
        });
        this.uploadList = this.uploadList.concat(arr);
        let preloadList = []
        arr.forEach((item, index) => {//判断附件是否为图片，是则存入临时数组获取签名用于缩略图展示
          if (this.isPictureFile(item.fileType)) {
            preloadList.push(item.path)
          }
        })
        this.fileSign(preloadList, 'preload').then(res => {
          this.changeCancelFiles = this.changeCancelFiles.concat(res)
        })
      },
      moveIn(value) {
        this.isDelete = value
      },
      moveOut(value) {
        if (this.isDelete === value) {
          this.isDelete = ''
        }
      },
      delectData(index) {//删除附件操作
        this.uploadList.splice(index, 1);
      },
      //提交变更解约
      subChangeCancel(url, param) {
        this.forbid = true;
        this.$ajax.postJSON(url, param).then(res => {
          res = res.data;
          if (res.status === 200) {
            // this.forbid = false;
            // this.$message({
            //   message: '操作成功',
            //   type: 'success'
            // });
            // this.close(2);
            this.submitAudit()
          }
        }).catch(error => {
          this.forbid = false;
          this.$message({
            message: error,
            type: "error"
          })
        })
      },
      //发起变更解约后需要提审
      submitAudit(){
        let param = {
          cityId:this.cityCode,
          flowType:this.getDialogType==='变更'?9:10,
          bizCode:this.code,
          modularType:0//合同类型
        }
        this.$ajax.get('/api/machine/submitAduit', param).then(res=>{
          res=res.data;
          if(res.status===200){
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.close(2);
          }else{
            this.$message({
              message:res.message,
              type:"error"
            })
          }
        }).catch(error => {
            if(error.message==='下一节点审批人不存在'){
              this.checkPerson.code=this.code;
              this.checkPerson.state=true;
              this.checkPerson.type=3;
              this.checkPerson.label=true;
            }else{
              this.$message({
                message:error,
                type: "error"
              })
            }
          })
      },
      //保存上传文件
      saveFile() {
        if(this.getContentHidden){
          this.checkDialogState=true
          return
        }
        let rule={
          'reason':{
            name:`${this.getDialogType}原因`
          }
        }
        var url = this.getDialogType==='变更'? this.editFlag ? "/api/contract/editChange" : "/api/contract/change":"/api/contract/cancel";
        var param = {
          id: this.contId,
          reason: this.textarea,
          address: this.uploadList,
          type:this.getDialogType==='变更'?1:2,
          newOwnerCommission:Number(this.moneyData.owner),
          newCustCommission:Number(this.moneyData.user)
        }
        if (this.editFlag) {
          param.editFlag = 1
          param.editParam = this.editParam
        }
        this.$tool.checkForm(param,rule).then(res=>{
          if (this.isCheckFile) {
            this.subChangeCancel(url, param);
          } else {
            if(this.uploadList.length===0){
              this.$message({
                message:`请上传${this.getDialogType}协议`,
                type:"warning"
              })
            }else{
              this.subChangeCancel(url, param);
            }
          }
        }).catch(error=>{
          this.$message({
            message:`${error.title}${error.msg}`,
            type:"error"
          })
        })
      },
      //获取变更解约详情
      getChangeDetail(type) {
        console.log(type,111);
        let param = {
          type: type,
          // id: this.contId
        };
        param[this.isContractList ? 'contId' : 'id'] = this.contId
        this.$ajax.get("/api/contract/changeDetail", param).then(res => {
          res = res.data;
          if (res.status === 200) {
            this.textarea = res.data.changeReason;
            if (res.data.afterCont && res.data.beforeCont) {
              let afterCont = JSON.parse(res.data.afterCont),//变更后数据
                  beforeCont = JSON.parse(res.data.beforeCont),//变更前数据
                  keyList = [ // 合同变更时可编辑字段
                    {key: 'signDate',name:'签约时间',default:'-'},
                    {key: 'estTransferTime',name:'预计过户时间',default:'-'},
                    {key: 'transFlow',name:'交易流程',default:'-'},
                    {key: 'flowQZfee',name:'权证费用',default:'-'},
                    {key: 'custCommission',name:'客户佣金',default:0},
                    {key: 'ownerCommission',name:'业主佣金',default:0},
                    {key: 'commissionTotal',name:'总佣金',default:0},
                    {key: 'commissionPayment',name:'佣金支付费',default:0},
                    {key: 'houseinfoCode',name:'房源编号',default:'-'},
                    {key: 'dealPrice',name:'成交总价/租金',default:0},
                    {key: 'propertyAddr',name:'物业地址',default:'-'},
                    {key: 'houseInfo_CompleteYear',name:'建成年代',default:'-'},
                    {key: 'propertyRightAddr',name:'产权地址',default:'-'},
                    {key: 'houseInfo_Square',name:'建筑面积',default:0},
                    {key: 'houseInfo_SquareUse',name:'套内面积',default:0},
                    {key: 'guestinfoCode',name:'客源编号',default:'-'},
                    {key: 'Owner',name:'业主信息',default:'-'},
                    {key: 'Guest',name:'客户信息',default:'-'},
                    {key: 'CommOwner',name:'业主后期代办人信息',default:'-'},
                    {key: 'CommGuest',name:'客户后期代办人信息',default:'-'},
                    {key: 'remarks',name:'备注内容',default:'-'},
                    {key: 'otherCooperationCost',name:'三方合作-扣合作费',default:0},
                    {key: 'otherCooperationInfo_type',name:'三方合作-类型',default:'无'},
                    {key: 'otherCooperationInfo_name',name:'三方合作-合作方姓名',default:'-'},
                    {key: 'otherCooperationInfo_mobile',name:'三方合作-联系方式',default:'-'},
                    {key: 'otherCooperationInfo_identifyCode',name:'三方合作-身份证号',default:'-'},
                    {key: 'otherCooperationInfo_remarks',name:'三方合作-备注',default:'-'}
                  ],
                  contPersons = {//业主/客户/后期联系人特殊处理，拼接字段比较
                    Owner: {
                      afterOwner:[],
                      beforeOwner:[],
                      key: 'Owner',
                      name: '业主信息'
                    },
                    Guest: {
                      afterGuest:[],
                      beforeGuest:[],
                      key: 'Guest',
                      name: '客户信息'
                    },
                    CommOwner: {
                      afterCommOwner:[],
                      beforeCommOwner:[],
                      key: 'CommOwner',
                      name: '业主后期代办人信息'
                    },
                    CommGuest: {
                      afterCommGuest:[],
                      beforeCommGuest:[],
                      key: 'CommGuest',
                      name: '客户后期代办人信息'
                    },
                  },
                  getInfo = [];


              switch (afterCont.recordType) {
                case 'ON_LINE':
                  this.recordTypeText = '线上合同'
                  break;
                case 'NOT_LINE':
                  this.recordTypeText = '线下合同'
                  keyList.unshift({key: 'pCode',name:'纸质合同编号',default:'-'})
                  break;
                case 'APP':
                  this.recordTypeText = '无纸化合同'
                  break;
              }
              console.log(afterCont,beforeCont);
              
              afterCont.contPersons.forEach(item => {
                if (item.personType) {
                  if (item.personType === 'OWNER') {
                    contPersons.Owner.afterOwner.push(item)
                  } else if (item.personType === 'CUST') {
                    contPersons.Guest.afterGuest.push(item)
                  } else if (item.personType === 'OWNERAFTER') {
                    contPersons.CommOwner.afterCommOwner.push(item)
                  } else if (item.personType === 'CUSTAFTER') {
                    contPersons.CommGuest.afterCommGuest.push(item)
                  }
                } else {
                  if(item.type == 1) {
                    contPersons.Owner.afterOwner.push(item)
                  } else if (item.type == 2) {
                    contPersons.Guest.afterGuest.push(item)
                  } else if (item.type == 3) {
                    contPersons.CommGuest.afterCommGuest.push(item)
                  } else if (item.type == 4) {
                    contPersons.CommOwner.afterCommOwner.push(item)
                  }
                }
              })
              beforeCont.contPersons.filter(item => {
                if (item.personType) {
                  if (item.personType === 'OWNER') {
                    contPersons.Owner.beforeOwner.push(item)
                  } else if (item.personType === 'CUST') {
                    contPersons.Guest.beforeGuest.push(item)
                  } else if (item.personType === 'OWNERAFTER') {
                    contPersons.CommOwner.beforeCommOwner.push(item)
                  } else if (item.personType === 'CUSTAFTER') {
                    contPersons.CommGuest.beforeCommGuest.push(item)
                  }
                } else {
                  if(item.type == 1) {
                    contPersons.Owner.beforeOwner.push(item)
                  } else if (item.type == 2) {
                    contPersons.Guest.beforeGuest.push(item)
                  } else if (item.type == 3) {
                    contPersons.CommGuest.beforeCommGuest.push(item)
                  } else if (item.type == 4) {
                    contPersons.CommOwner.beforeCommOwner.push(item)
                  }
                }
              })
              keyList.forEach(item => {
                let keys = item.key.split('_'),
                    afterText,beforeText;

                if (keys.length === 1) {
                  if (keys[0] === 'dealPrice' && afterCont.contType === 'ZL') {
                    afterText = afterCont[keys[0]] + getUnitType(afterCont.timeUnit)
                    beforeText = beforeCont[keys[0]] + getUnitType(beforeCont.timeUnit)
                  } else if (['Owner','Guest','CommOwner','CommGuest'].includes(keys[0])) {
                    let num = 0;
                    contPersons[keys[0]][`after${keys[0]}`].forEach((item,index) => {
                      let beforeIndex,
                          beforeItem = contPersons[keys[0]][`before${keys[0]}`].filter((bfItem,bfIndex) => {
                            let flag = false
                            if (bfItem.pid === item.pid) {
                              beforeIndex = bfIndex;
                              flag = true
                            }
                            return flag
                          }),
                          afterText,beforeText;
                      if (['Owner','Guest'].includes(keys[0])) {
                        afterText = `${item.name}/${item.encryptionMobile}/${item.relation}${item.propertyRightRatio ? '/' + item.propertyRightRatio + '%' : ''}${afterCont.recordVersion == 1 ? '' : '/' + getCardType(item.cardType)+item.encryptionCode}`
                      } else {
                        afterText = `${item.name}/${item.encryptionMobile}`
                      }
                      if (!beforeItem.length) {
                        beforeText = '-'
                      } else {
                        if (['Owner','Guest'].includes(keys[0])) {
                          beforeText = `${beforeItem[0].name}/${beforeItem[0].encryptionMobile}/${beforeItem[0].relation}${beforeItem[0].propertyRightRatio ? '/' + beforeItem[0].propertyRightRatio + '%' : ''}${beforeCont.recordVersion == 1 ? '' : '/' + getCardType(beforeItem[0].cardType)+beforeItem[0].encryptionCode}`
                        } else {
                          beforeText = `${beforeItem[0].name}/${beforeItem[0].encryptionMobile}`
                        }
                        contPersons[keys[0]][`before${keys[0]}`].splice(beforeIndex,1)
                      }
                      if (afterText !== beforeText) {
                        ++num
                        let afterText,beforeText;
                        if (['Owner','Guest'].includes(keys[0])) {
                          afterText = `${item.name}/${item.encryptionMobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}/${item.relation}${item.propertyRightRatio ? '/' + item.propertyRightRatio + '%' : ''}${afterCont.recordVersion == 1 ? '' : '/' + getCardType(item.cardType)+item.encryptionCode}`
                          if (beforeItem.length) {
                            beforeText = `${beforeItem[0].name}/${beforeItem[0].encryptionMobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}/${beforeItem[0].relation}${beforeItem[0].propertyRightRatio ? '/' + beforeItem[0].propertyRightRatio + '%' : ''}${beforeCont.recordVersion == 1 ? '' : '/' + getCardType(beforeItem[0].cardType)+beforeItem[0].encryptionCode}`
                          }
                        } else {
                          afterText = `${item.name}/${item.encryptionMobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}`
                          if (beforeItem.length) {
                            beforeText = `${beforeItem[0].name}/${beforeItem[0].encryptionMobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}`
                          }
                        }
                        getInfo.push({
                          key: `${contPersons[keys[0]].key}${num}`,
                          name:`${contPersons[keys[0]].name}${num}`,
                          afterText,
                          beforeText: !beforeItem.length ? '-' : beforeText
                        })
                      }
                    })

                    if (contPersons[keys[0]][`before${keys[0]}`].length) {
                      contPersons[keys[0]][`before${keys[0]}`].forEach((item,index) => {
                        ++num
                        let beforeText;
                        if (['Owner','Guest'].includes(keys[0])) {
                          beforeText = `${item.name}/${item.encryptionMobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}/${item.relation}${item.propertyRightRatio ? '/' + item.propertyRightRatio + '%' : ''}${beforeCont.recordVersion == 1 ? '' : '/' + getCardType(item.cardType)+item.encryptionCode}`
                        } else {
                          beforeText = `${item.name}/${item.encryptionMobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}`
                        }
                        getInfo.push({
                          key: `${contPersons[keys[0]].key}${num}`,
                          name:`${contPersons[keys[0]].name}${num}`,
                          afterText: '-',
                          beforeText,
                        })
                      })
                    }
                  } else {
                    afterText = afterCont[keys[0]] || '-'
                    beforeText = beforeCont[keys[0]] || '-'
                  }
                } else {
                  afterText = afterCont[keys[0]] ? (afterCont[keys[0]][keys[1]] || '-') : '-'
                  beforeText = beforeCont[keys[0]] ? (beforeCont[keys[0]][keys[1]] || '-') : '-'
                }
                
                if (afterText !== beforeText) {
                  getInfo.push(Object.assign(item,{afterText:afterText,beforeText:beforeText}))
                }
              })
              this.changeDetailTableData = JSON.parse(JSON.stringify(getInfo))
            }

            Object.assign(this.moneyData,{owner:res.data.newOwnerCommission,user:res.data.newCustCommission})
            Object.assign(this.commission,{owner:res.data.ownerCommission,user:res.data.custCommission})

            
            let address_ = JSON.parse(res.data.changeAtta);
            //console.log(address_);
            // let fileType = this.$tool.get_suffix(arr[0].name);
            address_.value.forEach(element => {
              let fileType = this.$tool.get_suffix(element.name);
              element.fileType = fileType;
            });
            this.uploadList = [].concat(address_.value);
            let preloadList = []
            address_.value.forEach((item, index) => {//判断附件是否为图片，是则存入临时数组获取签名用于缩略图展示
              if (this.isPictureFile(item.fileType)) {
                preloadList.push(item.path)
              }
            })
            if (preloadList.length) {
              this.fileSign(preloadList, 'preload').then(res => {
                this.changeCancelFiles = res
              })
            }
          }
        }).catch(error => {
          console.error(error)
          this.$message({
            message: error,
            type:"error"
          })
        })
      },
      //变更解约详情审核
      toCheck(type){
        if(type===2&&this.checkDialogReasion.length===0){
          this.$message({
            message:'请输入驳回原因'
          })
          return
        }
        let param = {
          bizCode: this.getCode,
          flowType: this.getDialogType==='变更'?9:10,
          modularType: 0
        }
        param.ApprovalForm = {
          result: type,
          remark: this.checkDialogReasion
        }
        this.$ajax.postJSON('/api/machine/audit', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.$message({
              message: res.message,
              type:"success"
            })
            this.checkDialogState = false
            this.close(2)
          }
        }).catch(error => {
          if (error.message === '下一节点审批人不存在') {
            this.checkPerson.code=this.code;
            this.checkPerson.state=true;
            this.checkPerson.type=3;
            this.checkPerson.label=true;
          } else {
            this.$message({
              message: error,
              type:"error"
            })
          }
        })
      }
  },
  created() {
    if(this.dialogOperation==='details'){
      this.getChangeDetail(this.getDialogType==='变更'?2:1)//获取详情 2变更 1解约
    }else{
      Object.assign(this.moneyData,{owner:this.commission.owner,user:this.commission.user})
    }
  },
  filters: {
    /**
     * 过滤显示图片缩略图
     * @param val后端返回的所有文件资源遍历的当前项
     * @param list图片资源获取签名后的临时数组
     */
    getSignImage(val, list) {
      if (list.length === 0) {
        return '';
      } else {
        return list.find(item => {
          return item.includes(val)
        })
      }
    }
  }
};
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  .info-cell{
    display: flex;
    align-items: center;
    justify-content: center;
    i.icon-xiugai1{
      font-size: 20px;
      margin-left: 3px;
      cursor: pointer;
    }
  }
  .info-inputbox{
    display: flex;
    justify-content: center;
    /deep/.el-input{
      max-width: 70px;
      margin-right: 3px;
    }
    .el-input__inner{
      max-width: 70px;
      margin-right: 3px;
      height: 30px;
      line-height: 30px;
    }
  }

  .info-dialog {
    /deep/ .el-dialog__body {
      padding: @margin-15 20px;
    }

    /deep/ .el-dialog__footer {
      border-top: 1px solid #edecf0;
      padding: @margin-10 20px;
    }
  }

  .box {
    margin-top: @margin-15;

    > p {
      margin-bottom: @margin-10;
      font-size: 14px;
      color: @color-6c;
    }
    /deep/.el-table__body .el-table__row{
      height: 44px;
      line-height: 44px;
    }
  }

  .uploadfile {
    margin-top: @margin-15;

    .uploadtitle {
      color: #6c7986;
      margin-bottom: @margin-10;

      span {
        margin-left: 16px;
        color: #8e8e8e;

        &.iconfont {
          color: @color-blue;
          font-size: @size-14;
          cursor: pointer;

          > i {
            font-size: @size-16;
          }
        }

        b {
          color: #6c7986;
        }
      }
    }

    .uploadbtn {
      .uploadSubject {
        display: inline-block;
        text-align: center;
        width: 120px;
        height: 120px;
        box-sizing: border-box;
        padding-top: 20px;
        border: 2px dashed @border-DE;

        i {
          color: @bg-th;
          font-size: 59px;
        }

        p {
          padding-top: 5px;
          color: @color-324;
          font-size: 14px;
        }
      }

      .dataPreview {
        display: inline-block;
        text-align: center;
        width: 130px;
        height: 130px;
        margin-right: 18px;
        box-sizing: border-box;
        background: skyblue;
        border: 2px solid @border-DE;
      }

      .deleteShow {
        display: block !important;
      }

      ul {
        display: flex;
        flex-wrap: nowrap;
        max-width: 100%;
        overflow-x: auto;

        li {
          margin-right: 10px;
          margin-bottom: 10px;
          position: relative;

          > i {
            display: none;
            position: absolute;
            top: 5px;
            right: 5px;
            color: @color-warning;
            font-size: 20px;
            cursor: pointer;
          }
        }
      }

      .namePath {
        display: inline-block;
        text-align: center;
        width: 120px;
        height: 120px;
        padding-top: 20px;
        box-sizing: border-box;
        border-radius: 4px;
        background: @color-F2;

        .signImage {
          width: 60px;
          height: 60px;
          margin: 1px 0;
        }

        > p {
          padding-top: 5px;
          display: inline-block;
          width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .textareabox {
    display: flex;
    flex-direction: column;

    > p {
      margin-bottom: @margin-10;
      font-size: 14px;
      color: @color-6c;
    }

    .reason {
      position: relative;

      > span {
        position: absolute;
        bottom: 10px;
        right: 20px;
        color: @color-6c;
      }
    }
  }
</style>


