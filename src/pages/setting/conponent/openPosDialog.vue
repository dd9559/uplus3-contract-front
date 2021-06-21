<template>
	<div class="posDialog">
		<el-dialog
      title="开通POS收款"
      :closeOnClickModal="$tool.closeOnClickModal"
      :visible.sync="posDialog"
      width="1200px"
      :before-close="handleClose"
      class="dep-dialog">
			<div class="titleBox">
				<div class="title" :class="{'titleTips':index == titleIndex}" v-for="(item,index) in titleList" :key="index" >
					{{item.item}}
				</div>
			</div>
			<!-- titleIndex == 'first' -->
      <div class="posDialogBox" v-if="titleIndex == 0">
				<div class="formBox">
					<el-form label-position="right" ref="form" size="mini" :model="form" label-width="140px">
						<el-form-item label="企业名称：">
							<span>{{dataInfo.name}}</span>
						</el-form-item>
						<el-form-item label="企业地址：">
							<el-input v-model="dataInfo.address" maxlength="80" :clearable="true" @input="inputOnly(100,'name')"></el-input>
						</el-form-item>
						<el-form-item label="统一社会信用代码：">
							<span>{{dataInfo.documentCard}}</span>
						</el-form-item>
						<el-form-item label="法人姓名：">
							<el-input v-model="dataInfo.lepName" maxlength="15" :clearable="true" @input="inputOnly(999,'lepName')"></el-input>
						</el-form-item>
						<el-form-item label="法人身份证号码：">
							<el-input v-model="dataInfo.lepDocumentCard" maxlength="18" :clearable="true" @input="inputOnly(1000,'lepDocumentCard')"></el-input>
						</el-form-item>
						<el-form-item label="法人手机号：">
							<el-input v-model="dataInfo.lepPhone" maxlength="11" :clearable="true" @keyup.native="getInt(2)"></el-input>
						</el-form-item>
						<el-form-item label="开户银行名称: " >
							<el-select  v-model="entBank.bankName" filterable style="width:100%"
							placeholder="选择开户银行" @change="bankList">
								<el-option v-for="m in adminBanks" :key="m.id" :label="m.bankName" :value="JSON.stringify(m)"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="支行名称：">
							<el-select  v-model="entBank.bankBranchName" filterable  style="width:100%"
							placeholder="选择开户银行" @change="bankBranchList">
								<el-option v-for="m in bankBranch" :key="m.branchCode" :label="m.branchName" :value="JSON.stringify(m)"></el-option>
							</el-select>
							<!-- <el-input v-model="entBank.bankBranchName" maxlength="50" :clearable="true" @input="inputOnly('bankBranchName')"></el-input> -->
						</el-form-item>
						<el-form-item label="支行行号：">
							<el-input v-model="entBank.bankBranchCode" maxlength="15" :clearable="true"
							@input="inputOnly('bankBranchCode')"></el-input>
						</el-form-item>
						<el-form-item label="银行卡号：">
							<el-input v-model="entBank.bankCard" maxlength="20" @keyup.native="getInt(3)"></el-input>
						</el-form-item>
					</el-form>
				</div>
				<div style="margin-left: 115px;">
					<div class="tips">温馨提示：每次仅支持上传一张图片，大小不超过1M； 格式：jpg，png</div>
					<div style="display:flex;align-items: center;">
						
						<div class="idCard">
							<div style="margin-bottom: 15px;">法人身份证照片上传：</div>
							<div style="display:flex;align-items: center;">
								<fileUp id="idCard" class="up" :rules="['png','jpg']" @getUrl="upload" :more=false :picSize=true :scane="{path:'setting'}" :canvas="true">
                  <img :src="idCard[0]" width="235px" height="150px" v-show="companyForm.idCard" style="border: 1px solid #8fb3fa;border-radius:10px">
                  <img src="@/assets/img/idcard.png" width="237px" height="152px" v-show="!companyForm.idCard">
								</fileUp>
								<div style="width:229px;height:147px;margin-left: 50px;">
									<fileUp id="theotherside" class="up" :rules="['png','jpg']" @getUrl="upload" :more=false :picSize=true :scane="{path:'setting'}" :canvas="true">
										<img :src="theotherside[0]" width="227px" height="145px" v-show="companyForm.theotherside" style="border: 1px solid #8fb3fa;border-radius:10px;">
										<img src="@/assets/img/theotherside.png" width="229px" height="147px" v-show="!companyForm.theotherside">
									</fileUp>
								</div>
							</div>
						</div>
					</div>
					<div class="businessLicense" >
						<div style="margin:20px 0;">企业营业执照上传：</div>
						<div style="width:316px;height:174px">
							<fileUp id="businessLicense" class="up" :rules="['png','jpg']" @getUrl="upload" :more=false :picSize=true :scane="{path:'setting'}" :canvas="true">
                <img :src="businessLicense[0]" width="316px" height="174px" v-show="companyForm.businessLicense" style="border: 1px solid #8fb3fa;border-radius:10px">
								<img src="@/assets/img/businessLicense.png" width="316px" height="174px" v-show="!companyForm.businessLicense">
							</fileUp>
						</div>
					</div>
				</div>
			</div>
      <div slot="footer" v-if="titleIndex == 0">
        <el-button @click="submitInfo" type="primary" round v-if="!next">提交信息</el-button>
				<el-button @click="nexts" type="primary" round v-if="next">下一步</el-button>
      </div>
			<!-- titleIndex == 'second' -->
			<div style="height:300px" v-if="titleIndex == 1">
				32123132132
			</div>
			<div slot="footer" v-if="titleIndex == 1">
        <el-button @click="submitInfo" type="primary" round>补发签约短信</el-button>
      </div>
			<div class="inputCode" v-if="titleIndex == 2">
				<span>输入验证码：</span>
				<el-input v-model="input" maxlength="6" style="width:200px" placeholder="请输入验证码" size="mini" type="number" oninput="if(value.length>6)value=value.slice(0,6)"></el-input>
				<el-button size="mini" type="primary" :disabled="disable">{{getCode}}</el-button>
			</div>
			<div slot="footer" v-if="titleIndex == 2">

			</div>
    </el-dialog>
	</div>
</template>

<script>
	import {MIXINS} from "@/assets/js/mixins";
	export default {
		mixins: [MIXINS],
		props:{
			posDialog:{
				type:Boolean,
				default:false
			},
			posInfo:{
				type:Object,
				default:{}
			}
		},
		data() {
			return {
				form:{
					bankName:''
				},
				titleList:[
					{item:'第一步：提交企业信息',},
					{item:'第二步：签约'},
					{item:'第三步：绑定手机号'},
					// {item:'第四步：绑定银行卡'},
				],
				adminBanks:[],
				bankBranch:[],
				fourthStoreNoEdit:false,
				dataInfo:{},
        entBank:{},
        companyForm: {},
        idCard:[],
        theotherside:[],
        businessLicense:[],
				titleIndex:0,
				input:'',
				getCode:60,
				disable:false,
				next:false
			}
		},
		created() {
		},
		mounted() {
			// 银行列表
			this.getBanks()
			// this.getBankBranch()
			// this.countDown()
		},
    computed:{
    },
		watch:{
			posDialog:{
				handler(newName,oldName) {
					if(newName == false) {
						this.clearList()
					}
				},
				deep: true
			},
			posInfo:{
				handler(newName,oldName) {
					this.dataInfo = newName
          // this.entBank = this.dataInfo.entBankList[0]
				},
				// immediate: true,
				deep: true
			}
		},
		methods:{
			clearList() {
				this.companyForm = {}
			},
      handleClose() {
        this.$emit("handleDialogClose",this.clearList);
      },
			// 获取银行列表
      getBanks:function () {
        this.$ajax.get('/api/enterprise_pos/tlBank').then(res=>{
          res=res.data
          if(res.status===200){
            this.adminBanks=res.data
          }
        }).catch(error=>{
          this.$message({message:error})
        })
      },
			bankBranchList(val) {
				console.log(val,123123132);
			},
			//获取银行支行名称
			getBankBranch() {
				let params = {
					Keyword:this.entBank.bankBranchName
				}
				this.$ajax.get('/api/enterprise_pos/tlBank_branch',params).then(res=>{
					res=res.data
					console.log(res);
					if(res.status===200){
            this.bankBranch=res.data.splice(0,100)
          }
				}).catch(error=>{
          this.$message({message:error})
        })
			},
			//正则
			getInt(num,index) {
        if(num===1) {
          this.searchForm.bankCard = this.$tool.numberInput(this.searchForm.bankCard)
        } else if(num===2) {
          this.companyForm.lepPhone = this.$tool.numberInput(this.companyForm.lepPhone)
        } else if(num===3) {
          this.companyForm.entBankList[index].bankCard = this.$tool.numberInput(this.companyForm.entBankList[index].bankCard)
        }
      },
      upload(data) {
        if(data.btnId === "idCard") {
          this.companyForm.idCard = data.param[0].path+`?${data.param[0].name}`
          this.contractName = data.param[0].name
        }else if(data.btnId === "theotherside") {
          this.companyForm.theotherside = data.param[0].path+`?${data.param[0].name}`
          this.contractName = data.param[0].name
        }else if(data.btnId === "businessLicense") {
          this.companyForm.businessLicense = data.param[0].path+`?${data.param[0].name}`
          this.contractName = data.param[0].name
        }
        let preloadList = [data.param[0].path]
        this.fileSign(preloadList, 'preload',false).then(res => {
            if(data.btnId === 'idCard') {
              this.idCard = res
            }else if(data.btnId === "theotherside") {
              this.theotherside = res
            }else if(data.btnId === "businessLicense") {
              this.businessLicense = res
            }
        })
      },
			//倒计时
			countDown() {
				this.disable = true
				// this.getCode = this.getCode+'s'
				this.countDown = setInterval(()=>{
					this.getCode--
					if(this.getCode == 0) {
						clearInterval(this.countDown)
						this.getCode = '获取验证码'
						this.disable = false
					}
				},1000)
			},
      //提交信息
      submitInfo() {
				this.$confirm('请仔细核对注册信息，确保信息准确无误！','提示',{
					confirmButtonText: '确认提交',
					cancelButtonText: '核对信息',
					type: 'warning'
				}).then(()=>{
					this.next = true
					// this.sunmitData()
				}).catch(()=>{

				})
        // let params = {
        //   companyId:this.dataInfo.id,
        //   name:this.dataInfo.name,
        //   address:this.dataInfo.address,
        //   documentCard:this.dataInfo.documentCard,
        //   lepName:this.dataInfo.lepName,
        //   lepDocumentCard:this.dataInfo.lepDocumentCard,
        //   lepPhone:this.dataInfo.lepPhone,
        //   bankAccountName:this.entBank.bankAccountName,
        //   bankBranchName:this.entBank.bankBranchName,
        //   bankBranchCode:this.entBank.bankBranchCode,
        //   bankCard:this.entBank.bankCard,
        //   lepCardFront:this.idCard[0],
        //   lepCardBack:this.theotherside[0],
        //   licenseSign:this.businessLicense[0]
        // }
				
      },
			sunmitData() {
				let params = {
					"companyId": "888",
					"name": "武汉阿克涅网络科技有限公司",
					"address": "武汉东湖新技术开发区关南园一路20号当代华夏创业中心1、2、3栋2层19号（自贸区武汉片区）",
					"documentCard": "91420100MA49G98561",
					"lepName": "段枭宇",
					"lepDocumentCard": "420583199610180043",
					"lepPhone": "15068130606",
					"bankBranchName": "武汉农村商业银行光谷支行",
					"bankBranchCode": "402521009216",
					"bankCard": "210880551210017",
					"bankAccountName": "武汉农村商业银行",
					"licenseSign": "https://jjw-test.oss-cn-shenzhen.aliyuncs.com/other/20210617/3Fk8qNEOh3QbTM8sJUXJcG1623914905583.jpg?33333.png",
					"lepCardFront": "https://jjw-test.oss-cn-shenzhen.aliyuncs.com/other/20210617/2mOhPqpJ17TFppPE7XoOqw1623909692024.png?图片1.png",
					"lepCardBack": "https://jjw-test.oss-cn-shenzhen.aliyuncs.com/other/20210617/3Fk8qNEOh3QbTM8sJUXJcG1623914909085.png?图片2.png"
				}
        console.log(params);
        this.$ajax.postJSON('/api/enterprise_pos',params).then(res => {
          this.next = true
        })
			},
			nexts() {
				let params = {
					"companyId": "9999",
				}
				this.$ajax.get('/api/enterprise_pos',params).then(res => {
					if(res.status == 200) {
						let da
					}
        })
			}
		}
			
	}
</script>

<style lang="less" scoped>
	.posDialog {
		.formBox {
			width: 410px;
		}
		.tips {
			position: absolute;
			top: 125px;
		}
		.dep-dialog {
			/deep/ .el-dialog {
				border-radius: 10px;
				.el-dialog__header {
					border: none !important;
				}
				.el-dialog__body {
					margin-top: 20px;
					padding: 0 40px;
				}
			}
		}
		.titleBox {
			text-align: center;
			display: flex;
			align-items: center;
			.title {
				width: 500px;
				height: 30px;
				line-height: 30px;
				border: 1px solid #8fb3fa;
				border-radius: 5px;
			}
			.title:nth-child(2){
				margin-left: 30px;
				margin-right: 15px;
			}
			.title:nth-child(3){
				margin-left: 15px;
				margin-right: 30px;
			}
			.titleTips {
				font-size: 16px;
				color: #FFF;
				background: #169bd5;
			}
			
		}
		.posDialogBox {
			margin-top: 20px;
			display: flex;
			align-items: center;
			
		}
		.inputCode {
			margin-top: 40px;
			text-align: center;
			margin-right: 30px;
		}
	}
</style>