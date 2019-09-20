<template>
  <div>
    <el-form :inline="true" :model="contractForm" class="add-form" size="small">
      <!-- 合同信息 -->
      <div class="contractMsg">
        <p>合同信息</p>
        <div class="form-content">
          <el-form-item label="放款日期：" class="width-250 form-label">
            <el-date-picker type="date" value-format="yyyy/MM/dd" placeholder="选择日期" v-model="contractForm.signDate" style="width:140px"></el-date-picker>
          </el-form-item>
          <el-form-item label="纸质合同编号：" style="width:340px;text-align:right;">
            <input style="width:200px;" type="text" maxlength="30" v-model="contractForm.pCode" @input="inputCode('pCode')" placeholder="请输入" class="dealPrice">
          </el-form-item>
          <el-form-item label="项目类型：" style="width:320px;text-align:right;">
            <input style="width:200px;" type="text" maxlength="30" v-model="contractForm.pCode" @input="inputCode('project')" placeholder="请输入" class="dealPrice">
          </el-form-item>
          <br>
          <el-form-item label="放款金额：" class="form-label width-250">
            <input type="text" v-model="contractForm.dealPrice" @input="cutNumber('dealPrice')" placeholder="请输入内容" class="dealPrice">
            <i class="yuan">元</i>
          </el-form-item>
          <el-form-item label="期限时间：" style="width:470px;text-align:right;">
            <el-date-picker v-model="signDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy/MM/dd" style="width:330px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="金融专员：" style="width:270px;text-align:right;">
            <input type="text" v-model="contractForm.receivableCommission" @input="cutNumber('receivableCommission')" placeholder="请输入" class="dealPrice">
          </el-form-item>
          <br>
          <el-form-item label="经办人：" class="width-250">
            <input type="text" v-model="contractForm.dealPrice" @input="cutNumber('dealPrice')" placeholder="请输入" class="dealPrice">
          </el-form-item>
          <el-form-item label="受理人：" style="width:280px;text-align:right;">
            <input type="text" v-model="contractForm.dealPrice" @input="cutNumber('dealPrice')" placeholder="请输入" class="dealPrice">
          </el-form-item>
          <el-form-item label="岗位名称：" style="width:245px;text-align:right;">
            <input type="text" v-model="contractForm.dealPrice" @input="cutNumber('dealPrice')" placeholder="请输入" class="dealPrice">
          </el-form-item>
          <br>
          <el-form-item label="收入金额：" class="form-label width-250">
            <input type="text" v-model="contractForm.dealPrice" @input="cutNumber('dealPrice')" placeholder="请输入" class="dealPrice">
            <i class="yuan">元</i>
          </el-form-item>
          <el-form-item label="金融成本比例：" class="form-label" style="width:280px;text-align:right;">
            <input type="text" v-model="contractForm.dealPrice" @input="cutNumber('dealPrice')" placeholder="请输入" class="dealPrice">
            <i class="yuan">%</i>
          </el-form-item>
          <el-form-item label="金融成本：" class="form-label width-250">
            <input type="text" v-model="contractForm.dealPrice" @input="cutNumber('dealPrice')" placeholder="请输入" class="dealPrice">
            <i class="yuan">元</i>
          </el-form-item>
          <br>
          <el-form-item label="杂费：" class="form-label width-250">
            <input type="text" v-model="contractForm.dealPrice" @input="cutNumber('dealPrice')" placeholder="请输入" class="dealPrice">
            <i class="yuan">元</i>
          </el-form-item>
        </div>
      </div>
      <!-- 房源信息 -->
      <div class="houseMsg">
        <p>房源信息</p>
        <div class="form-content">
          <el-form-item label="房源编号：" class="width-250 form-label">
            <input type="text" v-model="contractForm.houseInfo.Square" @input="cutNumber('Square')" placeholder="请输入内容" class="dealPrice">
          </el-form-item>
          <span class="select">请选择房源</span>
          <br>
          <el-form-item label="U+地址：" class="form-label" style="width:705px;text-align:right">
            <input v-model="rightAddrCity" maxlength="10" placeholder="请输入" @input="cutAddress('city')" class="dealPrice" style="width:600px" />
          </el-form-item>
          <br>
          <el-form-item label="产权地址：" class="form-label" style="width:750px;text-align:right">
            <input v-model="rightAddrCity" maxlength="10" placeholder="请输入" @input="cutAddress('city')" class="dealPrice" style="width:100px" /> 市
            <input v-model="rightAddrArea" maxlength="10" placeholder="请输入" @input="cutAddress('area')" class="dealPrice" style="width:100px" /> 区
            <input v-model="rightAddrDetail" maxlength="70" placeholder="详细地址" @input="cutAddress('detail')" class="dealPrice" style="width:400px" />
          </el-form-item>
        </div>
      </div>
      <!-- 客源信息 -->
      <div class="houseMsg">
        <p>客源信息</p>
        <div class="form-content">
          <el-form-item label="客户姓名：" style="width:245px;text-align:right;">
            <input type="text" v-model="contractForm.dealPrice" @input="cutNumber('dealPrice')" placeholder="请输入" class="dealPrice">
          </el-form-item>
          <el-form-item label="所属区域：" style="width:245px;text-align:right;">
            <el-select v-model="contractForm.contState" placeholder="全部" :clearable="true" style="width:150px">
              <el-option v-for="item in dictionary['9']" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <!-- 签约信息 -->
      <div class="houseMsg">
        <p>签约信息</p>
        <div class="form-content">
          <el-form-item label="成交经纪人：" class="form-label" style="width:333px;text-align:right">
            <input v-model="rightAddrCity" maxlength="10" placeholder="请输入" @input="cutAddress('city')" class="dealPrice" style="width:100px" /> 
            <input v-model="rightAddrCity" maxlength="10" placeholder="请输入" @input="cutAddress('city')" class="dealPrice" style="width:100px" /> 
          </el-form-item>
          <el-form-item label="店长：" class="form-label" style="width:300px;text-align:right">
            <input v-model="rightAddrCity" maxlength="10" placeholder="请输入" @input="cutAddress('city')" class="dealPrice" style="width:100px" /> 
            <input v-model="rightAddrCity" maxlength="10" placeholder="请输入" @input="cutAddress('city')" class="dealPrice" style="width:100px" /> 
          </el-form-item>
          <br>
          <el-form-item label="合作方：" class="form-label" style="width:330px;text-align:right">
            <input v-model="rightAddrCity" maxlength="10" placeholder="请输入" @input="cutAddress('city')" class="dealPrice" style="width:200px" /> 
          </el-form-item>
        </div>
      </div>
    </el-form>
    <!-- 删除人员确认框 -->
    <el-dialog title="提示" :visible.sync="dialogDel" width="460px" :closeOnClickModal="$tool.closeOnClickModal">
      <span>确定删除当前联系人吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDel = false">取 消</el-button>
        <el-button type="primary" @click="delPeopleMsg">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
           
<script>
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
export default {
  mixins: [MIXINS],
  data(){
    return{
      contractForm:{
        houseInfo:{
          Square:''
        }
      },
      rightAddrCity:'',
      rightAddrArea:'',
      rightAddrDetail:'',
      //人员关系列表
      relationList: [],
      //业主信息
      ownerList: [
        {
          type: 1,
          encryptionCode: "",
          mobile: "",
          relation: "",
          cardType: "",
          name: "",
          propertyRightRatio: ""
        }
      ],
      //客户信息
      guestList: [
        {
          type: 2,
          encryptionCode: "",
          mobile: "",
          relation: "",
          cardType: "",
          name: "",
          propertyRightRatio: ""
        }
      ],
      delType:'',
      //删除客户确认框
      dialogDel:false,
      dictionary: {
        //数据字典
        "633":"",//证件类型(护照,身份证,营业执照)
        "6":"",
      },
    }
  },
  created () {
    this.getRelation();//人员关系
    this.getDictionary();//字典
  },
  methods:{
    //获取所在城市的人员关系
    getRelation() {
      let param = {
        type: "Relation"
      };
      this.$ajax.get("/api/dictionary/uplus", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.relationList = res.data;
        }
      });
    },
    //添加客户
    addcommissionData(type) {
      if(type==="owner"){
        if (this.guestList.length < 4) {
          this.guestList.push({
            edit: true,
            type: 2,
            encryptionCode: "",
            mobile: "",
            encryptionMobile:"",
            relation: "",
            cardType: "",
            name: "",
            propertyRightRatio: ""
          });
        } else {
          this.$message({
            message: "已达到最大数量",
            type: "warning"
          });
        }
      }else{
        if (this.ownerList.length < 4) {
          this.ownerList.push({
            edit: true,
            type: 1,
            encryptionCode: "",
            mobile: "",
            encryptionMobile:"",
            relation: "",
            cardType: "",
            name: "",
            propertyRightRatio: ""
          });
        } else {
          this.$message({
            message: "已达到最大数量",
            type: "warning"
          });
        }
      }
    },
    //删除联系人确认框
    delPeople(index,type){
      this.peopleIndex=index;
      this.delType=type;
      this.dialogDel=true;
    },
    //确认删除
    delPeopleMsg(){
      if(this.delType==="owner"){
        this.ownerList.splice(this.peopleIndex, 1);
        this.ownerList_.splice(this.peopleIndex, 1);
        this.dialogDel=false;
      }else if(this.delType==="guest"){
        this.guestList.splice(this.peopleIndex, 1);
        this.guestList_.splice(this.peopleIndex, 1);
        this.dialogDel=false;
      }
    },
    //纸质合同编号限制
    inputCode(type){
      let addrReg = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\(\)\-\_]/g
      if(this.contractForm.pCode&&type==="pCode"){
        this.contractForm.pCode=this.contractForm.pCode.replace(/\s+/g,"").replace(addrReg,'')
      }
      if(this.contractForm.project&&type==="project"){
        this.contractForm.project=this.contractForm.project.replace(/\s+/g,"").replace(addrReg,'')
      }
    },
    //数字金额限制
    cutNumber(val){
      if(val==="dealPrice"){
        this.$nextTick(()=>{
          this.contractForm.dealPrice=this.$tool.cutFloat({val:this.contractForm.dealPrice,max:999999999.99})
        })
      }else if(val==="receivableCommission"){
        this.$nextTick(()=>{
          this.contractForm.receivableCommission=this.$tool.cutFloat({val:this.contractForm.receivableCommission,max:999999999.99})
        })
      }else if(val==="Square"){
        this.$nextTick(()=>{
          this.contractForm.houseInfo.Square=this.$tool.cutFloat({val:this.contractForm.houseInfo.Square,max:999999.99})
        })
      }
    },
    //产权地址限制
    cutAddress(type){
      let addrReg=/\\|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g
      if(type==="city"){
        this.rightAddrCity=this.rightAddrCity.replace(/\s+/g,"").replace(addrReg,'').replace("市","").replace(/\//g,'')
      }else if(type==="area"){
        this.rightAddrArea=this.rightAddrArea.replace(/\s+/g,"").replace(addrReg,'').replace("区","").replace(/\//g,'')
      }else{
        this.rightAddrDetail=this.rightAddrDetail.replace(/\s+/g,"").replace(addrReg,'')
      }
    },
    //手机号验证
    verifyMobile(item,index,type) {
      if(item.isEncryption){
        if(type==="owner"){
          if(this.ownerList[index].mobile!==this.beforeChangeMobile){
            if(Number(item.mobile)){
              this.ownerList[index].mobile=item.mobile;
            }else{
              this.ownerList[index].mobile='';
            }
            // this.ownerList[index].mobile='';
            this.ownerList[index].isEncryption=false;
          }
        }else if(type==="guest"){
          if(this.guestList[index].mobile!==this.beforeChangeMobile){
            if(Number(item.mobile)){
              this.guestList[index].mobile=item.mobile;
            }else{
              this.guestList[index].mobile='';
            }
            this.guestList[index].isEncryption=false;
          }
        }
      }else{
        if(item.mobile.length===11){
          let reg = /^1[0-9]{10}$/;
          let reg_ = /^0\d{2,3}-?\d{7,8}$/
          if (!reg.test(item.mobile)&&!reg_.test(item.mobile)) {
            this.$message({
              message:'电话号码格式不正确',
              type: "warning"
            })
          }
        }
      }
    },
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/common.less";
.add-form {
  padding: 10px;
  font-size: 14px;
  background: @bg-white;
  overflow-y: auto;
}
.contractMsg {
  border-bottom: 1px solid @border-ED;
  > p {
    padding-bottom: 10px;
    padding-left: 10px;
    font-size: 14px;
    font-weight: bold;
  }
  .form-content {
    padding-left: 30px;
  }
}
.houseMsg {
  .chineseNum {
    padding-left: 10px;
    color: @color-orange;
    font-size: 14px;
  }
  border-bottom: 1px solid @border-ED;
  > p {
    padding: 20px 0 20px 10px;
    font-size: 14px;
    font-weight: bold;
  }
  .thirdParty {
    cursor: pointer;
    display: inline-block;
    .attention {
      color: #ccc;
      font-weight: normal;
    }
    .attention_ {
      color: @color-blue;
    }
  }
  .form-content {
    padding-left: 30px;
    .select {
      display: inline-block;
      text-align: center;
      color: @color-white;
      width: 140px;
      padding: 2px 0;
      line-height: 32px;
      background: @color-blue;
      border-radius: 2px;
      cursor: pointer;
    }
    .select_{
      display: inline-block;
      width: 140px;
      text-align: left;
      color:@color-blue;
      font-weight: bold;
    }
    .propertyAddress{
      cursor:not-allowed;
      min-width: 500px;
      display: inline-block;
      box-sizing: border-box;
      text-align: left;
      font-size: 14px;
      padding-left: 15px;
      color: #606266;
      border-radius: 4px;
      background: #F5F7FA;
      border: 1px solid #dcdfe6;
    }
    .color_{
      color: #c0c4cc;
    }
    .shopName{
      min-width: 200px;
      height: 32px;
    }
    .parameter{
      display: flex;
      width: 1200px;
      flex-wrap:wrap;
      padding-bottom: 10px;
      li{
        display: flex;
        height: 50px;
        width: 350px;
        line-height: 50px;
        > .title{
          width: 100px;
          cursor: pointer;
          text-align: right;
          // padding-right: 10px;
          color: #606266;
          text-overflow:ellipsis;
          white-space:nowrap;
          overflow:hidden;
          display: inline-block;
        }
        > .colon{
          padding: 0 5px;
        }
        > .unit{
          width: 70px;
          padding-left: 10px;
          color: #606266;
          overflow: hidden;
        }
      }
    }
  }
  .cooperation {
    min-height: 240px;
    padding-left: 30px;
    /deep/.el-textarea__inner {
      width: 600px;
      min-height: 200px;
    }
  }
  .peopleMsg {
    li {
      min-width: 540px;
      font-size: 14px;
      margin-bottom: 10px;
      .merge {
        border: 1px solid #dcdfe6;
        padding: 7px 2px;
        border-radius: 3px;
      }
      .shell{
        display: inline-block;
        position: relative;
        &::after {
          content: '%';
          display: inline-block;
          color: #ccc;
          position: absolute;
          top: 0;
          right: 6px;
        }
      }
      input {
        padding: 6px 0;
        color: #606266;
        &::-webkit-input-placeholder {
        color: #ccc;
        }
      }
    }
    .name_ {
      width: 250px;
      padding-left: 5px;
      border: none;
      border-right: 1px solid #dcdfe6;
    }
    .disabled {
      background-color: #f5f7fa;
    }
    .mobile_ {
      width: 100px;
      border: none;
      margin-left: -4px;
      padding-left: 2px;
    }
    .rate_ {
      width: 90px;
    }
    .idCard_ {
      width: 160px;
      padding: 7px 5px;
      padding-left: 5px;
      border: 1px solid #dcdfe6;
      border-radius: 3px;
    }
    .relation_ {
      width: 80px;
    }
    .idtype {
      width: 100px;
    }
    .icon {
      display: inline-block;
      cursor: pointer;
      .icon-tubiao_shiyong-14 {
        font-size: 22px;
        color: @color-blue;
      }
      .icon-tubiao_shiyong-4{
        font-size: 22px;
        color: @color-FF5;
      }
    }
  }
}
.width-250{
  width: 245px;
  text-align: right;
}
/deep/.form-label {
  position: relative;
  &:before {
    content: '*';
    display: inline-block;
    color: red;
  }
}
.dealPrice{
  display: inline-block;
  box-sizing: border-box;
  width: 140px;
  padding: 7px 15px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  &::-webkit-input-placeholder {
    color: #ccc;
  }
}
.yuan{
  position: absolute;
  top: 0;
  right: 6px;
  font-size: 14px;
  color: #ccc;
}
</style>