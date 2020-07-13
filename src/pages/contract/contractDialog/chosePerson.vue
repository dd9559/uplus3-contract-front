<template>
    <div class="view-container">
      <el-dialog
        title="选择签署客户/业主"
        :visible="getDialogVisible"
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
                    <input type="text" class="inputStyle" v-model="item.name" @input="inputOnly(index,'name')">
                    <i :class="showSelect?'el-icon-arrow-up':'el-icon-arrow-down'" @click="showSelect=!showSelect"></i>
                    <ul class="selectList" v-if="showSelect">
                      <li>张三</li>
                      <li>李四</li>
                      <li>王五</li>
                      <li>赵六</li>
                      <li>田七</li>
                    </ul>
                  </li>
                  <li>
                    <span class="form-label">角色：</span>
                    <input type="text" class="inputStyle" v-model="item.roleName">
                  </li>
                  <li>
                    <span class="form-label">电话：</span>
                    <input type="text" class="inputStyle" v-model="item.mobile">
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
                    <input type="text" class="inputStyle" v-model="item.encryptionCode">
                  </li>
                  <li v-if="item.cardType===3">
                    <span class="form-label">企业名称：</span>
                    <input type="text" class="inputStyle" v-model="item.companyName">
                  </li>
                  <li v-if="item.cardType===3">
                    <span class="form-label">法人名称：</span>
                    <input type="text" class="inputStyle" v-model="item.lepName">
                  </li>
                  <li v-if="item.cardType===3">
                    <span class="form-label">法人身份证号：</span>
                    <input type="text" class="inputStyle" v-model="item.lepIdentity">
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
var brokerId = 0
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
    }
  },
  data(){
    return{
      choseOwnerM:[],
      choseOwner:[],
      choseGuestM:[],
      choseGuest:[],

      brokerList:[],
      choseBrokerId:[],
      choseBroker:[],
      dialogDel:false,
      delId:'',
      delIndex:'',

      showSelect:false,
      dictionary: {
        //数据字典
        "633": "" //证件类型(护照,身份证,营业执照)
      },
    }
  },
  created(){
    this.getDictionary(); //字典
  },
  methods:{
    inputOnly(index, type) {
        if (type === "name") {
            this.ownerList[index].name = this.$tool.textInput(
                this.ownerList[index].name
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
        if(index>-1){
          this.choseOwnerM.splice(index,1)
          this.choseOwner.splice(index,1)
        }else{
          this.choseOwnerM.push(val.mobile)
          this.choseOwner.push(val)
        }
      }else if(type==="guest"){
        let index = this.choseGuest.indexOf(val.mobile)
        if(index>-1){
          this.choseGuestM.splice(index,1)
          this.choseGuest.splice(index,1)
        }else{
          this.choseGuestM.push(val.mobile)
          this.choseGuest.push(val)
        }
      }else{
        debugger
        let index = this.choseBrokerId.indexOf(val.id)
        if(index>-1){
          this.choseBrokerId.splice(index,1)
          // this.choseBroker.splice(index,1)
        }else{
          for(let prop in val){
            if(!val[prop]){
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
          id:++brokerId,
          name:"",
          mobile:"",
          roleName:"",
          cardType:"",
          encryptionCode:"",
          companyName:"",
          lepName:"",
          lepIdentity:"",
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
      debugger
      let state = true
      circulation:
      for (let i = 0; i < this.choseBroker.length; i++) {
        const element = this.choseBroker[i];
        for(let prop in element){
          if(!element[prop]){
            state=true
            this.$message('居间签署人信息未填写完整')
            break circulation
          }
        }
      }
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
          let owner=[],customer=[]
          this.choseOwner.forEach(element => {
              let item = {
                  name:element.name,
                  identityType:element.cardType,
                  identity:element.encryptionCode,
                  mobile:element.mobile,
                  email:element.email,
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
              }
              customer.push(item)
          });
          debugger
          if(this.verify()) return
          param.owner=owner
          param.customer=customer
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
      return this.ownerList;
    },
    getGuestList(){
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