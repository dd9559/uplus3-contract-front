<template>
  <div class="view-container">
    <el-dialog
      :title="closeTitle"
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
              <span class="relation">关系：{{item.relation == ''? '-':item.relation}}</span>
              <span
                class="cardType"
              >证件类型：{{item.cardType===1?'身份证号':item.cardType===2?'护照':item.cardType===3?'营业执照':'军官证'}}</span>
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
              <span class="relation">关系：{{item.relation == ''? '-':item.relation}}</span>
              <span
                class="cardType"
              >证件类型：{{item.cardType===1?'身份证号':item.cardType===2?'护照':item.cardType===3?'营业执照':'军官证'}}</span>
              <span class="cardId">证件号码：{{item.encryptionCode}}</span>
            </div>
          </li>
        </ul>
        <div class="title">
          <span v-if="brokerList.length>0">居间方签署人：</span>
        </div>
        <ul class="list" v-show="brokerList.length>0">
          <li v-for="(item,index) in brokerList" :key="index">
            <div class="personType">
              签署人{{index+1}}
            </div>
            <div class="addPerson">
              <ul>
                <li>
                  <span class="form-label">角色：</span>
                  <el-select class="disabled" size="small" v-model="item.roleName" disabled placeholder="请选择">
                    <template v-for="childItem in dictionary['781']">
                      <el-option
                        v-if="childItem.key>2"
                        :key="childItem.key"
                        :label="childItem.value"
                        :value="childItem.key"
                      ></el-option>
                    </template>
                  </el-select>
                </li>
                <li class="nameStyle">
                  <span class="form-label">姓名：</span>
                  <input
                    type="text"
                    class="inputStyle"
                    placeholder="请输入"
                    v-model="item.name"
                    maxlength="10"
                    @input="inputOnly(index,'name')"
                  />
                </li>
                <li>
                  <span class="form-label">电话：</span>
                  <input
                    type="text"
                    maxlength="11"
                    placeholder="请输入"
                    class="inputStyle"
                    @input="verifyMobile_(item,index)"
                    v-model="item.mobile"
                  />
                </li>
                <li>
                  <span class="form-label">证件类型：</span>
                  <el-select
                    class="disabled"
                    size="small"
                    v-model="item.cardType"
                    placeholder="请选择"
                    @change="changeCadrType($event,index)"
                    disabled
                  >
                    <template v-for="item in dictionary['633']">
                      <el-option
                        v-if="item.key!=4"
                        :key="item.key"
                        :label="item.value"
                        :value="item.key"
                      ></el-option>
                    </template>
                  </el-select>
                </li>
                <li>
                  <span class="form-label">证件号：</span>
                  <input
                    type="text"
                    :maxlength="item.cardType===1?18:item.cardType===2?30:item.cardType===3?20:10"
                    class="inputStyle"
                    @input="verifyIdcard(item,2,index)"
                    placeholder="请输入"
                    v-model="item.encryptionCode"
                  />
                </li>
                <li v-if="item.cardType===3">
                  <span class="form-label">企业名称：</span>
                  <input
                    type="text"
                    class="inputStyle"
                    placeholder="请输入"
                    maxlength="100"
                    v-model="item.companyName"
                  />
                </li>
                <li v-if="item.cardType===3">
                  <span class="form-label">法人名称：</span>
                  <input
                    type="text"
                    class="inputStyle"
                    placeholder="请输入"
                    maxlength="10"
                    @input="inputOnly(index,'lepName')"
                    v-model="item.lepName"
                  />
                </li>
                <li v-if="item.cardType===3">
                  <span class="form-label">法人身份证号：</span>
                  <input
                    type="text"
                    class="inputStyle"
                    placeholder="请输入"
                    @input="verifyIdcard(item,1,index)"
                    maxlength="18"
                    v-model="item.lepIdentity"
                  />
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div class="floor_btn">
        <el-button round class="search_btn" @click="submit('close')">取消</el-button>
        <el-button type="primary" round class="search_btn" @click="submit('confirm')">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
function ID2(prefix) {
  return (prefix || '') + new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
};
import { MIXINS } from "@/assets/js/mixins";
export default {
  name: 'chosePerson',
  mixins: [MIXINS],
  props: {
    closeTitle: {
      type: String,
      default: '发起签署'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    ownerList: {
      type: Array,
      default() {
        return [];
      }
    },
    guestList: {
      type: Array,
      default() {
        return [];
      }
    },
    choseQuery: {
      type: Object,
      default() {
        return {};
      }
    },
    contCode: {
      type: String,
      default() {
        return "";
      }
    },
    localChoseList: {
      type: Array,
      default() {
        return []
      }
    },
    checkPersonData: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      choseOwnerM: [],
      choseOwner: [],
      choseGuestM: [],
      choseGuest: [],
      brokerList: [],
      selectNameList: [],
      delId: "",
      delIndex: "",
      dictionary: {
        //数据字典
        "633": "", //证件类型(护照,身份证,营业执照)
        "781": "" //证件类型(护照,身份证,营业执照)
      },
      // checkPersonData: null,
      checkPersonList: [],
      checkSignInfo: [],
      ownerMobileList: [], //业主手机号
      guestMobileList: [], //客户手机号
      brokerMobileList: [], //签署人手机号
      isCheckOwnerSign: false,
      isCheckGuestSign: false,
      isOverCheckSign: true
    };
  },
  created() {
    this.getDictionary(); //字典
  },
  methods: {
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
          num = num.substr(0, 6) + "19" + num.substr(6, num.length - 6);
          for (i = 0; i < 17; i++) {
            nTemp += num.substr(i, 1) * arrInt[i];
          }
          num += arrCh[nTemp % 11];
          return true;
        }
      }
      if (len == 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
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
          return false;
        } else {
          return true;
        }
      }
      return false;
    },
    //身份证验证
    verifyIdcard(value, type,index) {
      if (type == 2) {
        if (value.encryptionCode.length === 18) {
          if (!this.isIdCardNo(value.encryptionCode) && value.cardType === 1) {
            this.$message({
              message: "身份证格式不正确",
              type: "warning"
            });
            this.$set(this.brokerList[index],'checkEncryptionCode',{
              flag: true,
              key: 'encryptionCode',
              type: 'warning',
              msg: '身份证格式不正确'
            })
          } else {
            if (this.brokerList[index].checkEncryptionCode) {
              this.$set(this.brokerList[index],'checkEncryptionCode',{
                flag: false,
                key: 'encryptionCode',
                type: 'warning',
                msg: '身份证格式不正确'
              })
            }
          }
        } else {
          this.$set(this.brokerList[index],'checkEncryptionCode',{
            flag: true,
            key: 'encryptionCode',
            type: 'warning',
            msg: '身份证格式不正确'
          })
        }
      } else if (value.lepIdentity.length === 18) {
        if (!this.isIdCardNo(value.lepIdentity) && value.cardType === 3) {
          this.$message({
            message: "法人身份证格式不正确",
            type: "warning"
          });
          this.$set(this.brokerList[index],'checkLepIdentity',{
            flag: true,
            key: 'lepIdentity',
            type: 'warning',
            msg: '法人身份证格式不正确'
          })
        }else {
          if (this.brokerList[index].checkMobile) {
            this.$set(this.brokerList[index],'checkLepIdentity',{
              flag: false,
              key: 'lepIdentity',
              type: 'warning',
              msg: '法人身份证格式不正确'
            })
          }
        }
      } else {
        this.$set(this.brokerList[index],'checkLepIdentity',{
          flag: true,
          key: 'lepIdentity',
          type: 'warning',
          msg: '法人身份证格式不正确'
        })
      }
    },
    verifyMobile_(item,index) {
      let value = item.mobile
      if (value.length >= 11) {
        let reg = /^1[0-9]{10}$/;
        let reg_ = /^0\d{2,3}\-?\d{7,8}$/;
        if (!reg.test(value) && !reg_.test(value)) {
          this.$message({
            message: "电话号码格式不正确",
            type: "warning"
          });
          this.$set(this.brokerList[index],'checkMobile',{
            flag: true,
            key: 'mobile',
            type: 'warning',
            msg: '电话号码格式不正确'
          })
        } else {
          let checkBrokerMobole = (this.brokerMobileList && this.brokerMobileList.map((item,i) => {
            if (item.index !== index) {
              return item.mobile
            } else {
              return -1
            }
          }))
          if (this.ownerMobileList.includes(value) || this.guestMobileList.includes(value) || checkBrokerMobole.includes(value)) {
            this.$set(this.brokerList[index],'checkMobile',{
              flag: true,
              key: 'mobile',
              type: 'warning',
              msg: "业主,客户,居间方手机号不能相同"
            })
          } else {
            if (item.checkMobile) {
              this.$set(this.brokerList[index],'checkMobile',{
                flag: false
              })
              this.brokerMobileList && (this.brokerMobileList = this.brokerMobileList.filter((item,i) => {
                return item.index !== index
              }))
              this.brokerMobileList.push({mobile:value,index:index})
            } else {
              this.brokerMobileList && (this.brokerMobileList = this.brokerMobileList.filter((item,i) => {
                return item.index !== index
              }))
              this.brokerMobileList.push({mobile:value,index:index})
            }
          }
        }
      } else {
        this.$set(this.brokerList[index],'checkMobile',{
          flag: true,
          key: 'mobile',
          type: 'warning',
          msg: '电话号码格式不正确'
        })
      }
    },
    inputOnly(index, type) {
      if (type === "name" || type === "companyName" || type === "lepName") {
        this.brokerList[index][type] = this.brokerList[index][type].replace(/[^\u4E00-\u9FA5]*(先生|小姐|男士|女士|太太)+[\u4e00-\u9fa5]*/g, "").replace(/\s/g, "")
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
    chose(type, val) {
      if (type === "owner" && this.checkPersonList.includes(0)) {
        let index = this.choseOwnerM.indexOf(val.mobile);
        if (index > -1) {
          this.choseOwnerM.splice(index, 1);
          this.choseOwner.splice(index, 1);
        } else {
            this.choseOwnerM.push(val.mobile);
            this.choseOwner.push(val);
        }
      } else if (type === "guest" &&  this.checkPersonList.includes(1)) {
        let index = this.choseGuestM.indexOf(val.mobile);
        if (index > -1) {
          this.choseGuestM.splice(index, 1);
          this.choseGuest.splice(index, 1);
        } else {
            this.choseGuestM.push(val.mobile);
            this.choseGuest.push(val);
        }
      } else {
        this.$message("本合同不支持该角色签署");
      }
    },
    //证件类型切换
    changeCadrType(value, index) {
      this.brokerList[index].encryptionCode = "";
      if (value != 3) {
        this.brokerList[index].companyName = "";
        this.brokerList[index].lepName = "";
        this.brokerList[index].lepIdentity = "";
      }
    },
    //添加居间签署人
    addBroker(roleName) {
      if (this.brokerList.length < 5) {
        let item = {
          id: ID2(new Date().getTime()),
          time: ID2(new Date().getTime()),
          contCode: this.contCode,
          name: "",
          mobile: "",
          roleName,
          cardType: 1,
          encryptionCode: "",
          email: "-",
          companyName: "",
          lepName: "",
          lepIdentity: "",
          showSelectName: false
        };
        this.brokerList.push(item);
      } else {
        this.$message({
          message: "已达上限",
          type: "warning"
        });
      }
    },
    //验证居间签署人信息是否填写完整
    verify() {
      let state = false,
          msg = null;
      circulation: for (let i = 0; i < this.brokerList.length; i++) {
        const element = this.brokerList[i];
        if (element.checkMobile && element.checkMobile.flag) {
          return msg = {
            message: element.checkMobile.msg,
            type: element.checkMobile.type
          };
        }
        if (element.cardType === 1 && element.checkEncryptionCode && element.checkEncryptionCode.flag) {
          return msg = {
            message: element.checkEncryptionCode.msg,
            type: element.checkEncryptionCode.type
          };
        }
        if (element.cardType === 3 && element.checkLepIdentity && element.checkLepIdentity.flag) {
          return msg = {
            message: element.checkLepIdentity.msg,
            type: element.checkLepIdentity.type
          };
        }
        if (element.cardType === 3) {
          for (let prop in element) {
            if (prop !== "showSelectName" && !element[prop]) {
              return msg = {
                message: "居间签署人信息未填写完整",
                type: 'warning'
              };
            }
          }
        } else {
          for (let prop in element) {
            if (
              prop !== "companyName" &&
              prop !== "lepName" &&
              prop !== "lepIdentity" &&
              prop !== "showSelectName" &&
              !element[prop]
            ) {
              return msg = {
                message: "居间签署人信息未填写完整",
                type: 'warning'
              };
            }
          }
        }
      }
      let localBrokerList = [],
          choseBrokerId = [];
      this.brokerList.forEach(item => {
        localBrokerList.push(item)
        choseBrokerId.push(item.id)
      });
      let oldLocal = []
      if (localStorage.getItem("brokerList")) {
        oldLocal = JSON.parse(localStorage.getItem("brokerList")).filter((item,index) => {
          return item !== null && !choseBrokerId.includes(item.id)
        })
      }
      localBrokerList = localBrokerList.concat(oldLocal);
      if (localBrokerList.length > 5) {
        localBrokerList.splice(5, localBrokerList.length - 1);
      }
      localStorage.setItem("brokerList", JSON.stringify(localBrokerList));
      return state;
    },
    //确认/取消
    submit(type) {
      if (type === "confirm") {
          if(this.brokerList.length > 0){
            if (this.verify()) {
              return this.$message(this.verify())
            }
          }
          let selectRoleList = []
          let param = {
            contId: this.getChoseQuery.id,
            type: 1, //签章
            isentrust: this.getChoseQuery.isentrust, //非委托
            storeId: this.getChoseQuery.storeId //门店id
          };
          let owner = [],
            customer = [],
            signer = [];
          this.brokerList.forEach(element => {
            let item = {}
            if (element.cardType == 3) {
              item = {
                name: element.name,
                identityType: element.cardType,
                identity: element.encryptionCode,
                mobile: element.mobile,
                email: element.email,
                companyName: element.companyName,
                lepName:element.lepName,
                lepIdentity:element.lepIdentity,
                signerType: element.roleName
              };
            } else {
              item = {
                name: element.name,
                identityType: element.cardType,
                identity: element.encryptionCode,
                mobile: element.mobile,
                email: element.email,
                signerType: element.roleName
              };
            }
            signer.push(item);
            !selectRoleList.includes(element.roleName) && selectRoleList.push(element.roleName)
          });
          this.choseOwner.forEach(element => {
            let item = {}
            if (element.cardType == 3) {
              item = {
                name: element.name,
                identityType: element.cardType,
                identity: element.encryptionCode,
                mobile: element.mobile,
                email: element.email,
                lepName:element.lepName,
                lepIdentity:element.lepIdentity,
                signerType: 0,
              };
            } else {
              item = {
                name: element.name,
                identityType: element.cardType,
                identity: element.encryptionCode,
                mobile: element.mobile,
                email: element.email,
                signerType: 0,
              };
            }
            owner.push(item);
            !selectRoleList.includes(0) && selectRoleList.push(0)
          });
          this.choseGuest.forEach(element => {
            let item = {}
            if (element.cardType == 3) {
              item = {
                name: element.name,
                identityType: element.cardType,
                identity: element.encryptionCode,
                mobile: element.mobile,
                email: element.email,
                lepName:element.lepName,
                lepIdentity:element.lepIdentity,
                signerType: 1
              };
            }else {
              item = {
                name: element.name,
                identityType: element.cardType,
                identity: element.encryptionCode,
                mobile: element.mobile,
                email: element.email,
                signerType: 1
              };
            }
            customer.push(item);
            !selectRoleList.includes(1) && selectRoleList.push(1)
          });
          for (let index = 0; index < this.checkPersonList.length; index++) {
            const item = this.checkPersonList[index];
            if (!selectRoleList.includes(item)) {
              let msg = ''
              switch (item) {
                case 0:
                  msg = '业主'
                  break;
                case 1:
                  msg = '客户'
                  break;
                case 3:
                  msg = '大区总监'
                  break;
                case 4:
                  msg = '区域总监'
                  break;
                case 5:
                  msg = '店长'
                  break;
                case 6:
                  msg = '成交经纪人'
                  break;
                default:
                  break;
              }
              return this.$message(`本合同缺失签署角色${msg}，请重新添加`);
            }
          }
          this.$emit("closeChose", { type: "choseLoading" });
          param.owner = owner.length>0?owner:null;
          param.customer = customer.length>0?customer:null;
          param.signer = signer.length>0?signer:null;
          this.$emit("closeChose", { type: "closeChose" });
          // this.$ajax
          //   .postJSON("/api/app/contract/sendCont", param)
          //   .then(res => {
          //     res = res.data;
          //     if (res.status === 200) {
          //       this.$emit("closeChose", { type: "closeChose" });
          //     }
          //   })
          //   .catch(error => {
          //     this.$emit("closeChose",false)
          //     this.$message({
          //       message:error,
          //       type:"error"
          //     })
          //   });
      } else {
        this.$emit("closeChose", false);
      }
    }
  },
  watch: {
    checkPersonData(val) {
      let brokerCheckPersonList = []
      this.checkPersonList = []
      for (const key in val) {
        if (val.hasOwnProperty(key)) {
          val[key] && this.checkPersonList.push(Number(key))
          val[key] && key > 1 && brokerCheckPersonList.push(Number(key))
        }
      }
      let includeRoleList = []
      if (this.localChoseList&&this.localChoseList.length > 0) {
        this.brokerList = this.localChoseList.filter(item => {
          if (includeRoleList.includes(item.id)) {
            return false
          } else {
            if (item.contCode === this.contCode && this.checkPersonList.includes(item.roleName)) {
              includeRoleList.push(item.id)
              this.brokerMobileList.push({mobile:item.mobile,index:-1})
              brokerCheckPersonList = brokerCheckPersonList.filter(Fitem => Fitem != item.roleName)
              return true
            }
          }
        })
      }
      
      brokerCheckPersonList.forEach(item => {
        this.addBroker(item)
      })
    },
    ownerList(val) {
      this.choseOwnerM = []
      this.choseOwner = []
      this.isCheckOwnerSign = false
      if (this.ownerList.length == 1) {
      }
      this.ownerMobileList = val.map(item => {
        if (item.mobile) {
          return item.mobile
        } else {
          return null
        }
      })
    },
    guestList(val) {
      this.choseGuestM = []
      this.choseGuest = []
      this.isCheckGuestSign = false
      if (this.guestList.length == 1) {
      }
      this.guestMobileList = val.map(item => {
        if (item.mobile) {
          return item.mobile
        } else {
          return null
        }
      })
    },
  },
  computed: {
    getDialogVisible() {
      if (this.dialogVisible) {
      }
      return this.dialogVisible;
    },
    getOwnerList() {
      return this.ownerList;
    },
    getGuestList() {
      return this.guestList;
    },
    getChoseQuery() {
      return this.choseQuery;
    }
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.personMsg {
  padding: 10px;
  height: 500px;
  &::-webkit-scrollbar {
    display: none;
  }
  overflow-y: auto;
  color: @color-blank;
  .title {
    padding: 0 10px;
    padding-top: 6px;
    &:last-of-type {
      margin-top: 10px;
    }
    .add {
      cursor: pointer;
      float: right;
      width: 60px;
      margin-right: 10px;
      color: @color-blue;
      font-size: 16px;
      position: relative;
      i {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0;
        font-size: 24px;
      }
    }
  }
  > .list {
    > li {
      // overflow: hidden;
      border-radius: 5px;
      box-shadow: -1px 1px 3px 2px #f2f2f2;
      margin-top: 10px;
      .personType {
        position: relative;
        color: @color-grey;
        background-color: #f2f2f2;
        padding: 10px;
        > span {
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
          > span {
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
      div {
        padding: 12px 10px;
        > span {
          margin-right: 20px;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .name {
          width: 120px;
        }
        .mobile {
          width: 150px;
        }
        .relation {
          width: 100px;
        }
        .cardType {
          width: 130px;
        }
        .cardId {
          width: 220px;
        }
      }
    }
  }
  .addPerson {
    position: relative;
    .delBtn {
      cursor: pointer;
      color: @color-blue;
      position: absolute;
      top: 50%;
      right: 5px;
      transform: translateY(-50%);
    }
    ul {
      .disabled {
        /deep/input {
          background-color: #fff;
          color: black;
        }
      }
      .nameStyle {
        position: relative;
        .selectList {
          width: 180px;
          position: absolute;
          top: 40px;
          right: 15px;
          z-index: 10;
          padding: 6px 0;
          background-color: @color-white;
          border-radius: 4px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e4e7ed;
          overflow: hidden;
          li {
            padding: 0 20px;
            margin: 0;
            line-height: 38px;
            cursor: pointer;
            &:hover {
              background-color: #f5f7fa;
            }
            &.selected {
              color: #409eff;
              font-weight: 700;
            }
          }
        }
        .inputStyle {
          padding-right: 25px;
        }
        > i {
          color: #c0c4cc;
          position: absolute;
          top: 50%;
          right: 25px;
          transform: translateY(-50%);
        }
      }
      li {
        display: inline-block;
        width: 310px;
        margin-bottom: 15px;
        span {
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
          &:focus {
            border-color: @color-blue;
          }
          &::-webkit-input-placeholder {
            color: #ccc;
          }
        }
        /deep/.el-select--small {
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
.delHint {
  padding: 20px 0 10px 0;
  text-align: center;
  p {
    &:last-of-type {
      color: red;
      margin-top: 10px;
    }
  }
}
</style>