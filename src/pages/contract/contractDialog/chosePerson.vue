<template>
    <div class="view-container">
      <el-dialog
        title="选择签署客户/业主"
        :visible="getDialogVisible"
        width="900px"
        @close="submit('close')"
        :closeOnClickModal="$tool.closeOnClickModal"
        >
        <div class="personMsg">
          <div class="title">业主</div>
          <ul class="list">
            <li v-for="(item,index) in getOwnerList" :key="index">
              <div class="personType">
                业主{{index+1}}
                <span @click="chose('owner',item)">
                  <span v-if="choseOwnerM.includes(item.mobile)"></span>
                </span>
              </div>
              <div>
                <span class="name" :title="item.name.length>5?item.name:''">姓名：{{item.name}}</span>
                <span class="mobile">电话：{{item.mobile}}</span>
                <span class="relation">关系：{{item.relation}}</span>
                <span class="cardType">证件类型：{{item.cardType===1?'身份证号':item.cardType===2?'护照':item.cardType===3?'营业执照':'军官证'}}</span>
                <span class="cardId">证件号码：{{item.encryptionCode}}</span>
              </div>
            </li>
          </ul>
          <div class="title">客户</div>
          <ul class="list">
            <li v-for="(item,index) in getGuestList" :key="index">
              <div class="personType">
                客户{{index+1}}
                <span @click="chose('guest',item)">
                  <span v-if="choseGuestM.includes(item.mobile)"></span>
                </span>
              </div>
              <div>
                <span class="name" :title="item.name.length>5?item.name:''">姓名：{{item.name}}</span>
                <span class="mobile">电话：{{item.mobile}}</span>
                <span class="relation">关系：{{item.relation}}</span>
                <span class="cardType">证件类型：{{item.cardType===1?'身份证号':item.cardType===2?'护照':item.cardType===3?'营业执照':'军官证'}}</span>
                <span class="cardId">证件号码：{{item.encryptionCode}}</span>
              </div>
            </li>
          </ul>
          <div class="title">
            <span v-if="brokerList.length>0">居间方签署人：</span>
            <span class="add" @click="addBroker">添加<i class="el-icon-circle-plus"></i></span>
          </div>
          <ul class="list" v-show="brokerList.length>0">
            <li v-for="(item,index) in brokerList" :key="index">
              <div class="personType">
                签署人{{index+1}}
                <span @click="chose('broker',item)">
                  <span v-if="choseBrokerId.includes(item.id)"></span>
                </span>
              </div>
              <div class="addPerson">
                <ul>
                  <li class="nameStyle">
                    <span class="form-label">姓名：</span>
                    <input type="text" class="inputStyle" placeholder="姓名" v-model="item.name" maxlength="10" @input="inputOnly(index,'name')">
                    <i :class="item.showSelectName?'el-icon-arrow-up':'el-icon-arrow-down'" @click="showSelect(item,index)"></i>
                    <ul class="selectList" v-if="item.showSelectName && selectNameList && selectNameList.length > 0">
                        <li v-for="(item,childIndex) in selectNameList" :class="item.name===item?'selected':''" @click="selectName(item,index)" :key="childIndex">{{item.name}}</li>
                    </ul>
                  </li>
                  <li>
                    <span class="form-label">角色：</span>
                    <el-select 
                      size="small"
                      v-model="item.roleName"
                      placeholder="角色">
                      <template v-for="item in dictionary['781']">
                        <el-option
                            v-if="item.key>2"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key"
                            @click.native="selectRole(item,index)">
                        </el-option>
                      </template>
                    </el-select>
                  </li>
                  <li>
                    <span class="form-label">电话：</span>
                    <input type="text" maxlength="11" placeholder="电话" class="inputStyle" @input="verifyMobile_(item.mobile)" v-model="item.mobile">
                  </li>
                  <li>
                    <span class="form-label">证件类型：</span>
                    <el-select 
                      size="small"
                      v-model="item.cardType"
                      placeholder="证件类型"
                      @change="changeCadrType($event,index)">
                      <template v-for="item in dictionary['633']">
                        <el-option
                            v-if="item.key!=4"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key">
                        </el-option>
                      </template>
                    </el-select>
                  </li>
                  <li>
                    <span class="form-label">证件号：</span>
                    <input type="text" :maxlength="item.cardType===1?18:item.cardType===2?30:item.cardType===3?20:10" class="inputStyle" @input="verifyIdcard(item)" placeholder="证件号" v-model="item.encryptionCode">
                  </li>
                  <li v-if="item.cardType===3">
                    <span class="form-label">企业名称：</span>
                    <input type="text" class="inputStyle" placeholder="企业名称" maxlength="100" v-model="item.companyName">
                  </li>
                  <li v-if="item.cardType===3">
                    <span class="form-label">法人名称：</span>
                    <input type="text" class="inputStyle" placeholder="法人名称" maxlength="10" v-model="item.lepName">
                  </li>
                  <li v-if="item.cardType===3">
                    <span class="form-label">法人身份证号：</span>
                    <input type="text" class="inputStyle" placeholder="法人身份证号" maxlength="18" v-model="item.lepIdentity">
                  </li>
                </ul>
                <span class="delBtn" @click="del(index,item.id)">删除</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="floor_btn">
          <el-button round class="search_btn" @click="submit('close')">取消</el-button>
          <el-button type="primary" round class="search_btn" @click="submit('confirm')">确认</el-button>
        </div>
      </el-dialog>
      <!-- 删除人员确认框 -->
      <el-dialog title="确认删除"
          :visible.sync="dialogDel"
          width="460px"
          :closeOnClickModal="$tool.closeOnClickModal">
          <div class="delHint">
            <p>确定删除？</p>
            <p>该居间方签署人信息将会被删除</p>
          </div>
          <span slot="footer"
              class="dialog-footer">
              <el-button round @click="dialogDel = false">取 消</el-button>
              <el-button type="primary" round @click="delPerson">确 定</el-button>
          </span>
      </el-dialog>
    </div>
</template>
           
<script>
import { MIXINS } from "@/assets/js/mixins";
export default{
  mixins: [MIXINS],
  props:{
    dialogVisible:{
      type:Boolean,
      default:false
    },
    ownerList:{
      type:Array,
      default(){
        return []
      }
    },
    guestList:{
      type:Array,
      default(){
        return []
      }
    },
    choseQuery:{
      type:Object,
      default(){
        return {}
      }
    },
    contCode:{
      type:String,
      default(){
        return ''
      }
    }
  },
  data(){
    return{
      choseOwnerM:[],
      choseOwner:[],
      choseGuestM:[],
      choseGuest:[],

      brokerList:[],
      selectNameList: [],
      choseBrokerId:[],
      choseBroker:[],
      dialogDel:false,
      delId:'',
      delIndex:'',

    //   showSelect:false,
      dictionary: {
        //数据字典
        "633": "", //证件类型(护照,身份证,营业执照)
        "781": "" //证件类型(护照,身份证,营业执照)
      },
    }
  },
  created(){
    this.getDictionary(); //字典
  },
  methods:{
    selectRole(val,index) {
        this.brokerList[index].roleName = ''
        let param = {
            contCode: this.contCode,
            signerType: Number(val.roleName),
        }
        this.$ajax.get("/api/app/contract/checkSignPosition", param).then(res => {
            res = res.data;
            if (res) {
                this.brokerList[index].roleName = val.key
            } else {
                this.$message('本合同不支持该角色签署')
            }
        }).catch(error => {
            this.$message(error)
        });
    },
    //这个可以验证15位和18位的身份证，并且包含生日和校验位的验证。
    isIdCardNo(num) {
        num = num.toUpperCase();
        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
        if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)) {
            // alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
            return false;
        }
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        //下面分别分析出生日期和校验位
        var len, re;
        len = num.length;
        if (len == 15) {
            re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
            var arrSplit = num.match(re);
            //检查生日日期是否正确
            var dtmBirth = new Date(
                "19" + arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]
            );
            var bGoodDay;
            bGoodDay =
                dtmBirth.getYear() == Number(arrSplit[2]) &&
                dtmBirth.getMonth() + 1 == Number(arrSplit[3]) &&
                dtmBirth.getDate() == Number(arrSplit[4]);
            if (!bGoodDay) {
                // alert('输入的身份证号里出生日期不对！');
                return false;
            } else {
                //将15位身份证转成18位
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                var arrInt = new Array(
                    7,
                    9,
                    10,
                    5,
                    8,
                    4,
                    2,
                    1,
                    6,
                    3,
                    7,
                    9,
                    10,
                    5,
                    8,
                    4,
                    2
                );
                var arrCh = new Array(
                    "1",
                    "0",
                    "X",
                    "9",
                    "8",
                    "7",
                    "6",
                    "5",
                    "4",
                    "3",
                    "2"
                );
                var nTemp = 0,
                    i;
                num =
                    num.substr(0, 6) + "19" + num.substr(6, num.length - 6);
                for (i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                num += arrCh[nTemp % 11];
                return true;
            }
        }
        if (len == 18) {
            re = new RegExp(
                /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/
            );
            var arrSplit = num.match(re);
            //检查生日日期是否正确
            var dtmBirth = new Date(
                arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]
            );
            var bGoodDay;
            bGoodDay =
                dtmBirth.getFullYear() == Number(arrSplit[2]) &&
                dtmBirth.getMonth() + 1 == Number(arrSplit[3]) &&
                dtmBirth.getDate() == Number(arrSplit[4]);
            if (!bGoodDay) {
                // alert(dtmBirth.getYear());
                // alert(arrSplit[2]);
                // alert('输入的身份证号里出生日期不对！');
                return false;
            } else {
                //检验18位身份证的校验码是否正确。
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                // var valnum;
                // var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                // var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                // var nTemp = 0, i;
                // for (i = 0; i < 17; i++) {
                //     nTemp += num.substr(i, 1) * arrInt[i];
                // }
                // valnum = arrCh[nTemp % 11];
                // if (valnum != num.substr(17, 1)) {
                //     // alert('18位身份证的校验码不正确！应该为：' + valnum);
                //     return false;
                // }
                return true;
            }
        }
        return false;
    },
    //身份证验证
    verifyIdcard(value, type = 1) {
        // let reg = /^[1-9]\d{5}((((19|[2-9][0-9])\d{2})(0?[13578]|1[02])(0?[1-9]|[12][0-9]|3[01]))|(((19|[2-9][0-9])\d{2})(0?[13456789]|1[012])(0?[1-9]|[12][0-9]|30))|(((19|[2-9][0-9])\d{2})0?2(0?[1-9]|1[0-9]|2[0-8]))|(((1[6-9]|[2-9][0-9])(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))0?229))\d{3}[0-9Xx]$/;
        // let reg = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
        if (type === 2) {
            if (value.length === 18) {
                if (!this.isIdCardNo(value)) {
                    this.$message({
                        message: "身份证格式不正确",
                        type: "warning"
                    });
                }
            }
        } else {
            if (value.encryptionCode.length === 18) {
                if (
                    !this.isIdCardNo(value.encryptionCode) &&
                    value.cardType === 1
                ) {
                    this.$message({
                        message: "身份证格式不正确",
                        type: "warning"
                    });
                }
            }
        }
    },
    verifyMobile_(value) {
        if (value.length >= 11) {
            let reg = /^1[0-9]{10}$/;
            let reg_ = /^0\d{2,3}\-?\d{7,8}$/;
            if (!reg.test(value) && !reg_.test(value)) {
                this.$message({
                    message: "电话号码格式不正确",
                    type: "warning"
                });
            }
        }
    },
    showSelect(item,index) {
        item.showSelectName = !item.showSelectName
        this.selectNameList = localStorage.getItem("brokerList") && JSON.parse(localStorage.getItem("brokerList"));
    },
    selectName(item,index) {
        this.$set(this.brokerList,index,JSON.parse(JSON.stringify(Object.assign({},item,{id:Date.parse(new Date())}))))
        this.brokerList[index].showSelectName = false
    },
    inputOnly(index, type) {
        if (type === "name") {
            this.brokerList[index].name = this.$tool.textInput(
            this.brokerList[index].name
            );
        } else if (type === "guest") {
            this.guestList[index].name = this.$tool.textInput(
                this.guestList[index].name
            );
        } else if (type === "other") {
            this.contractForm.otherCooperationInfo.name = this.$tool.textInput(
                this.contractForm.otherCooperationInfo.name
            );
        }
    },
    //选择
    chose(type,val){
      if(type==="owner"){
        let index = this.choseOwnerM.indexOf(val.mobile)
        if(index>-1 && this.ownerList.length !== 1){
          this.choseOwnerM.splice(index,1)
          this.choseOwner.splice(index,1)
        }else{
          this.choseOwnerM.push(val.mobile)
          this.choseOwner.push(val)
        }
      }else if(type==="guest"){
        let index = this.choseGuest.indexOf(val.mobile)
        if(index>-1 && this.guestList.length !== 1){
          this.choseGuestM.splice(index,1)
          this.choseGuest.splice(index,1)
        }else{
          this.choseGuestM.push(val.mobile)
          this.choseGuest.push(val)
        }
      }else{
        let index = this.choseBrokerId.indexOf(val.id)
        if(index>-1){
          this.choseBrokerId.splice(index,1)
          // this.choseBroker.splice(index,1)
        }else{
          for(let prop in val){
            if((prop !== 'companyName' && prop !== 'lepName' && prop !== 'lepIdentity' && prop !== 'showSelectName') && !val[prop]){
              return this.$message('居间签署人信息未填写完整')
            }
          }
          this.choseBrokerId.push(val.id)
          // this.choseBroker.push(val)
        }
        // let index = this.choseBroker.indexOf(val.mobile)
        // if(index>-1){
        //   this.choseBrokerM.splice(index,1)
        //   this.choseBroker.splice(index,1)
        // }else{
        //   this.choseBrokerM.push(val.mobile)
        //   this.choseBroker.push(val)
        // }
      }
    },
    //证件类型切换
    changeCadrType(value, index) {
      this.brokerList[index].encryptionCode = "";
      if(value!=3){
          this.brokerList[index].companyName=""
          this.brokerList[index].lepName=""
          this.brokerList[index].lepIdentity=""
      }
    },
    //添加居间签署人
    addBroker(){
      if(this.brokerList.length<5){
        let item = {
          id:Date.parse(new Date()),
          name:"",
          mobile:"",
          roleName:"",
          cardType:"",
          encryptionCode:"",
          email: "-",
          companyName:"",
          lepName:"",
          lepIdentity:"",
          showSelectName:false,
          
        }
        this.brokerList.push(item)
        // this.choseBrokerId.push(item.id)
        // this.choseBroker.push(item)
      }else{
        this.$message({
          message:"已达上限",
          type:"warning"
        })
      }
    },
    // 删除居间签署人
    del(index,id){
      this.delIndex=index
      this.delId=id
      this.dialogDel=true
    },
    delPerson(){
        let that = this
      let i = this.choseBrokerId.indexOf(this.delId)
      if(i>-1){
        this.choseBrokerId.splice(i,1)
        this.choseBroker.splice(i,1)
      }
      this.brokerList.splice(this.delIndex,1)
      this.dialogDel=false
    },
    //验证居间签署人信息是否填写完整
    verify(){
      let state = false
      console.log(this.choseBroker,6768687);
      circulation:
      for (let i = 0; i < this.choseBroker.length; i++) {
        const element = this.choseBroker[i];
        console.log(this.choseBroker,6768687);
        for(let prop in element){
            
          if(!element[prop]){
            state=true
            this.$message('居间签署人信息未填写完整')
            break circulation
          }
        }
      }
      let localBrokerList = this.brokerList.filter(item => {
          return this.choseBrokerId.includes(item.id)
      })
      localBrokerList = localBrokerList.concat(JSON.parse(localStorage.getItem("brokerList")))
      if (localBrokerList.length > 5) {
          localBrokerList.splice(5,localBrokerList.length-1)
      }
      localStorage.setItem('brokerList', JSON.stringify(localBrokerList));
      return state
    },
    //确认/取消
    submit(type){
      if(type==='confirm'){
        if(this.choseOwner.length>0&&this.choseGuest.length>0){
          let param = {
              contId:this.getChoseQuery.id,
              type:1,//签章
              isentrust:0,//非委托
              storeId:this.getChoseQuery.storeId//门店id
          }
          let owner=[],customer=[],sign = []
          let localBrokerList = this.brokerList.filter(item => {
              return this.choseBrokerId.includes(item.id)
          })
          localBrokerList.forEach(element => {
              let item = {
                  name:element.name,
                  identityType:element.cardType,
                  identity:element.encryptionCode,
                  mobile:element.mobile,
                  email: element.email,
                  signerType: element.roleName,
              }
              sign.push(item)
          });
          this.choseOwner.forEach(element => {
              let item = {
                  name:element.name,
                  identityType:element.cardType,
                  identity:element.encryptionCode,
                  mobile:element.mobile,
                  email:element.email,
                  signerType: 0,
              }
              owner.push(item)
          });
          this.choseGuest.forEach(element => {
              let item = {
                  name:element.name,
                  identityType:element.cardType,
                  identity:element.encryptionCode,
                  mobile:element.mobile,
                  email:element.email,
                  signerType: 1,
              }
              customer.push(item)
          });
          if(this.verify()) return
          param.owner=owner
          param.customer=customer
          param.sign = sign;
          this.$ajax.postJSON('/api/app/contract/sendCont',param).then(res=>{
              res=res.data
              if(res.status===200){
                  this.$emit("closeChose",true)
              }
          }).catch(error=>{
              this.$message({
                message:error,
                type:"error"
              })
          })
        }else{
          this.$message({
            message:this.choseOwner.length>0?'请选择客户':'请选择业主',
            type:"warning",
          })
        }
      }else{
        this.$emit("closeChose",false)
      }
    },
  },
  computed:{
    getDialogVisible(){
      return this.dialogVisible;
    },
    getOwnerList(){
      if (this.ownerList.length == 1) {
        this.chose('owner',this.ownerList[0])
      }
      return this.ownerList;
    },
    getGuestList(){
      if (this.guestList.length == 1) {
        this.chose('guest',this.guestList[0])
      }
      return this.guestList;
    },
    getChoseQuery(){
      return this.choseQuery;
    },
  }     
}
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.personMsg{
  padding: 10px;
  height: 500px;
  &::-webkit-scrollbar {
    display: none;
  }
  overflow-y: auto;
  color: @color-blank;
  .title{
    padding: 0 10px;
    padding-top: 6px;
    &:last-of-type{
      margin-top: 10px;
    }
    .add{
      cursor: pointer;
      float: right;
      width: 60px;
      margin-right: 10px;
      color: @color-blue;
      font-size: 16px;
      position: relative;
      i{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0;
        font-size: 24px;
      }
    }
  }
  >.list{
    >li{
      // overflow: hidden;
      border-radius: 5px;
      box-shadow: -1px 1px 3px 2px #f2f2f2;
      margin-top: 10px;
      .personType{
        position: relative;
        color: @color-grey;
        background-color: #f2f2f2;
        padding: 10px;
        >span{
          cursor: pointer;
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid @color-blue;
          border-radius: 50%;
          >span{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateY(-50%) translateX(-50%);
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: @color-blue;
          }
        }
      }
      div{
        padding: 12px 10px;
        >span{
          margin-right: 20px;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .name{
          width: 120px;
        }
        .mobile{
          width: 150px;
        }
        .relation{
          width: 100px;
        }
        .cardType{
          width: 130px;
        }
        .cardId{
          width: 220px;
        }
      }
    }
  }
  .addPerson{
    position: relative;
    .delBtn{
      cursor: pointer;
      color: @color-blue;
      position: absolute;
      top: 50%;
      right: 5px;
      transform: translateY(-50%);
    }
    ul{
      .nameStyle{
        position: relative;
        .selectList{
          width: 180px;
          position: absolute;
          top: 40px;
          right: 15px;
          z-index: 10;
          padding: 6px 0;
          background-color: @color-white;
          border-radius: 4px;
          box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
          border: 1px solid #E4E7ED;
          overflow: hidden;
          li{
            padding: 0 20px;
            margin: 0;
            line-height: 38px;
            cursor: pointer;
            &:hover{
              background-color: #f5f7fa;
            }
            &.selected {
                color: #409EFF;
                font-weight: 700;
            }
          }
        }
        .inputStyle{
          padding-right: 25px;
        }
        >i{
          color: #C0C4CC;
          position: absolute;
          top: 50%;
          right: 25px;
          transform: translateY(-50%);
        }
      }
      li{
        display: inline-block;
        width: 310px;
        margin-bottom: 15px;
        span{
          display: inline-block;
          width: 110px;
          text-align: right;
        }
        .inputStyle {
          display: inline-block;
          box-sizing: border-box;
          width: 180px;
          padding: 7px 16px;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          &:focus{
            border-color: @color-blue;
          }
          &::-webkit-input-placeholder {
              color: #ccc;
          }
        }
        /deep/.el-select--small{
          padding: 0;
          width: 180px;
        }
      }
    }
  }
}
.floor_btn {
  overflow: hidden;
  display: flex;
  padding: 10px;
  justify-content: flex-end;
  //float: right;
  .search_btn {
    padding: 8px 15px;
  }
} 
.delHint{
  padding: 20px 0 10px 0;
  text-align: center;
  p{
    &:last-of-type{
      color:red;
      margin-top: 10px;
    }
  }
}       
</style>