<template>
	<div class="posDialog" v-loading.fullscreen.lock="fullscreenLoading">
		<el-dialog
      title="开通POS收款"
      :closeOnClickModal="$tool.closeOnClickModal"
      :visible.sync="posDialog"
      width="1200px"
      :before-close="handleClose"
      class="dep-dialog"
			@open="dialogOpen"
			@click="handleClose">
			<div class="titleBox">
				<div class="title" :class="{'titleTips':index == titleIndex}" v-for="(item,index) in titleList" :key="index" >
					{{item.item}}
				</div>
			</div>
			<!-- titleIndex == 'first' -->
      <div class="posDialogBox" v-if="titleIndex == 0">
				<div class="formBox">
					<el-form label-position="right" ref="form" size="mini" :rules="rulesForm" :model="dataInfo" label-width="140px">
						<el-form-item label="企业名称：">
							<span>{{dataInfo.name}}</span>
						</el-form-item>
						<el-form-item label="企业地址：" prop="address">
							<el-input v-model="dataInfo.address" maxlength="80" :clearable="true" @input="inputOnly('name')"></el-input>
						</el-form-item>
						<el-form-item label="统一社会信用代码：">
							<span>{{dataInfo.documentCard}}</span>
						</el-form-item>
						<el-form-item label="法人姓名：" prop="lepName">
							<el-input v-model="dataInfo.lepName" maxlength="15" :clearable="true" @input="inputOnly('lepName')"></el-input>
						</el-form-item>
						<el-form-item label="法人身份证号码：" prop="lepDocumentCard">
							<el-input v-model="dataInfo.lepDocumentCard" maxlength="18" :clearable="true" @input="inputOnly('lepDocumentCard')"></el-input>
						</el-form-item>
						<el-form-item label="法人手机号：" prop="lepPhone">
							<el-input v-model="dataInfo.lepPhone" maxlength="11" :clearable="true" @keyup.native="getInt(2)"></el-input>
						</el-form-item>
						<el-form-item label="开户银行名称: " prop="bankName">
							<el-select  v-model="dataInfo.bankName" filterable style="width:100%"
							placeholder="选择开户银行" @change="bankList">
								<el-option v-for="m in adminBanks" :key="m.id" :label="m.bankName" :value="JSON.stringify(m)"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="支行名称：" prop="bankBranchName">
							<el-select  v-model="dataInfo.bankBranchName" filterable v-loadmore="moreAssignors" style="width:100%"
							placeholder="选择支行名称" remote reserve-keyword :remote-method="bankBranchList" @change="bankBranchs">
								<el-option v-for="m in bankBranch" :key="m.branchCode" :label="m.branchName" :title="m.branchName" :value="JSON.stringify(m)"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="支行行号：">
							<el-input v-model="dataInfo.bankBranchCode" maxlength="15" :disabled='true' :clearable="true"
							@input="inputOnly('bankBranchCode')"></el-input>
						</el-form-item>
						<el-form-item label="银行卡号：" prop="bankCard">
							<el-input v-model="dataInfo.bankCard" :clearable="true" maxlength="20" @keyup.native="getInt(3)"></el-input>
						</el-form-item>
						<span style="margin-left: 40px;color: rgb(255, 0, 0);height: 10px;margin-top: 10px;display: inline-block;">当前状态：{{currentState}}</span>
					</el-form>
				</div>
				<div style="margin-left: 115px;">
					<div class="tips">温馨提示：每次仅支持上传一张图片，大小不超过1M； 格式：jpg，png</div>
					<div style="display:flex;align-items: center;">
						
						<div class="idCard">
							<div style="margin-bottom: 15px;">法人身份证照片上传：</div>
							<div style="display:flex;align-items: center;">
								<fileUp id="idCard" class="up" :rules="['png','jpg']" @getUrl="upload" :more=false :picSize=true :scane="{path:'setting'}" :maxSize="1">
                  <img :src="idCard" width="235px" height="150px" v-show="companyForm.idCard" style="border: 1px solid #8fb3fa;border-radius:10px">
                  <img src="@/assets/img/idcard.png" width="237px" height="152px" v-show="!companyForm.idCard">
								</fileUp>
								<div style="width:229px;height:147px;margin-left: 50px;">
									<fileUp id="theotherside" class="up" :rules="['png','jpg']" @getUrl="upload" :more=false :picSize=true :scane="{path:'setting'}" :maxSize="1">
										<img :src="theotherside" width="227px" height="145px" v-show="companyForm.theotherside" style="border: 1px solid #8fb3fa;border-radius:10px;">
										<img src="@/assets/img/theotherside.png" width="229px" height="147px" v-show="!companyForm.theotherside">
									</fileUp>
								</div>
							</div>
						</div>
					</div>
					<div class="businessLicense" >
						<div style="margin:20px 0;">企业营业执照上传：</div>
						<div style="width:316px;height:174px">
							<fileUp id="businessLicense" class="up" :rules="['png','jpg']" @getUrl="upload" :more=false :picSize=true :scane="{path:'setting'}" :maxSize="1">
                <img :src="businessLicense" width="316px" height="174px" v-show="companyForm.businessLicense" style="border: 1px solid #8fb3fa;border-radius:10px">
								<img src="@/assets/img/businessLicense.png" width="316px" height="174px" v-show="!companyForm.businessLicense">
							</fileUp>
						</div>
					</div>
				</div>
			</div>
      <div slot="footer" v-if="titleIndex == 0">
        <el-button @click="submitInfo" type="primary" round v-if="!next">提交信息</el-button>
				<el-button @click="nexts" type="primary" :disabled='firstDisable' v-dbClick round v-else>下一步</el-button>
      </div>
			<div style="margin-top: 30px;color: #ff0000;height: 100px;" v-if="titleIndex == 1">
				<span v-if="sms == 1">当前状态：签约中</span>
				<span v-if="sms == 2">当前状态：签约完成</span>
			</div>
			<div slot="footer" v-if="titleIndex == 1">
        <el-button @click="signContract" type="primary" round v-if="sms == 1">补发签约短信</el-button>
				<el-button @click="smsNext" type="primary" round v-if="sms == 2">下一步</el-button>
      </div>
			<div class="inputCode" v-if="titleIndex == 2">
				<span>输入验证码：</span>
				<el-input v-model="inputCode" maxlength="6" style="width:200px" placeholder="请输入验证码" size="mini" type="number" oninput="if(value.length>6)value=value.slice(0,6)"></el-input>
				<el-button size="mini" type="primary" :class="disable ? 'after-class' : ''" :disabled="disable"  @click="countDowns" style="min-width:80px">{{getCode}}</el-button>
			</div>
			<div slot="footer" v-if="titleIndex == 2">
				<el-button @click="codeConfirm" type="primary" round>确定</el-button>
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
					{item:'第三步：绑定手机号'}
				],
				adminBanks:[],
				bankBranch:[],
				branchPage: 1,
				branchTotal: 0,
				branchStr: '',
				fullscreenLoading: false,
				fourthStoreNoEdit:false,
				firstDisable: false,
				dataInfo:{},
				status: false,
        entBank:{},
        companyForm: {
					idCard:'',
					theotherside:'',
					businessLicense:''
				},
        idCard:[],
        theotherside:[],
        businessLicense:[],
				titleIndex:0,
				sms:1,
				inputCode:'',
				getCode:'获取验证码',
				disable:false,
				next:false,
				rulesForm: {
					address:[
						{ required: true, message: '请输入企业地址', trigger: 'blur' },
					],
					lepName:[
						{ required: true, message: '请输入法人姓名', trigger: 'blur' },
					],
					lepDocumentCard:[
						{ required: true, message: '请输入法人身份证号码', trigger: 'blur' },
					],
					lepPhone:[
						{ required: true, message: '请输入法人手机号', trigger: 'blur' },
					],
					bankName:[
						{ required: true, message: '请选择开户银行名称', trigger: 'change' },
					],
					bankBranchName:[
						{ required: true, message: '请选择支行名称', trigger: 'change' }
					],
					bankCard:[
						{ required: true, message: '请输入银行卡号', trigger: 'blur' }
					]
				},
				loading:true,
				currentState:'未提交',
				//权限配置
        power: {
          'sign-set-bl-openPos': {
            state: false,
            name: '开通pos收款'
          }
        },
			}
		},
		created() {
		},
		mounted() {
			// 银行列表
			if(this.power['sign-set-bl-openPos'].state) {
				this.getBanks()
			}
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
					this.status = Boolean(this.dataInfo.status)
				},
				deep: true
			},
			titleIndex:{
				handler(newName,oldName) {
					console.log(newName);
					if(newName == 0) {
					}
				},
				deep: true
			}
		},
		methods:{
			//打开dialog
			dialogOpen() {
				this.status = false
				this.enterprise()
			},
			clearList() {
				this.companyForm = {}
			},
      handleClose() {
				if(this.titleIndex == 0) {
					this.$refs.form.resetFields()
				}
				this.dataInfo.bankBranchCode = ''
				this.inputCode = ''
				this.titleIndex = 0
				clearInterval(this.timer);
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
			bankList(val) {
				this.branchStr = JSON.parse(val).bankName
				this.branchPage = 1
				this.bankBranch = []
				this.branchStr = val
				this.getBankBranch(JSON.parse(val).bankName)
			},
			bankBranchs(val) {
				this.dataInfo.bankBranchCode = JSON.parse(val).branchCode
			},
			bankBranchList(val) {
				console.log(val.length);
				if(val.length >= 2) {
					this.branchStr = val
					this.branchPage = 1
					this.bankBranch = []
					this.getBankBranch(val)
				}else {
					this.bankBranch = []
				}
			},
			moreAssignors() {
				if(this.bankBranch.length>= this.branchTotal){
          return
        }else {
          this.branchPage++;
          this.getBankBranch(this.branchStr);
        }
			},
			//获取银行支行名称
			getBankBranch(Keyword) {
				let params = {
					Keyword:Keyword,
					pageNum:this.branchPage,
					pageSize:100,
				}
				this.$ajax.get('/api/enterprise_pos/tlBank_branch',params).then(res=>{
					res=res.data
					console.log(res);
					if(res.status===200){
            if (!res.data.length) {
              this.bankBranch=[]
              this.branchTotal=0
							this.dataInfo.bankBranchName = ''
            } else {
              this.bankBranch=this.bankBranch.concat(res.data)
              this.branchTotal=res.data[0].total
            }
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
          this.dataInfo.lepPhone = this.$tool.numberInput(this.dataInfo.lepPhone)
        } else if(num===3) {
          this.dataInfo.bankCard = this.$tool.numberInput(this.dataInfo.bankCard)
        }
      },
			inputOnly(type){
       if(type==='lepName') {
          this.$nextTick(()=>{
            this.dataInfo.lepName=this.$tool.textInput(this.dataInfo.lepName)            
          })
        } else if(type==='lepDocumentCard') {
          this.$nextTick(()=>{
            this.dataInfo.lepDocumentCard=this.$tool.textInput(this.dataInfo.lepDocumentCard,2)            
          })
        } else if(type==='name') {
          this.$nextTick(()=>{
            this.dataInfo.address=this.$tool.textInput(this.dataInfo.address)            
          })
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
              this.idCard = res[0]
            }else if(data.btnId === "theotherside") {
              this.theotherside = res[0]
            }else if(data.btnId === "businessLicense") {
              this.businessLicense = res[0]
            }
        })
      },
			//电子签约短信
			signContract() {
				let params = {
					companyId:this.dataInfo.id,
				}
				this.$ajax.get('/api/enterprise_pos/signContract',params).then(res => {
					res = res.data
					if(res.status == 200) {
						clearInterval(this.timer);
						this.$message.success(res.message)
						this.timer = setInterval(() =>{
							this.enterprise()
						},5000)
					}
				}).catch(error=>{
          this.$message({message:error})
        })
			},
			//倒计时
			countDowns() {
				console.log(123);
				this.disable = true
				this.getCode = 60
				this.yzCode()
				this.countDown = setInterval(()=>{
					this.getCode--
					if(this.getCode == 0) {
						clearInterval(this.countDown)
						this.getCode = '获取验证码'
						this.disable = false
					}
				},1000)
			},
			//验证码
			yzCode() {
				let params = {
					companyId:this.dataInfo.id,
					lepPhone:'15827846050',
				}
				this.$ajax.get('/api/enterprise_pos/checkCode',params).then(res => {
					res = res.data
					if(res.status == 200) {
						this.$message.success(res.message)
					}
				}).catch((e)=>{
					this.$message.error(e)
				})
			},
			//确认短信
			codeConfirm() {
				let params = {
					companyId:this.dataInfo.id,
					lepPhone:'13986469852',
					checkCode:this.inputCode
				}
				this.$ajax.postJSON('/api/enterprise_pos/bindPhone',params).then(res => {
					res= res.data
					if(res.status == 200) {
						this.$message.success(res.message)
						this.handleClose()
					}
				}).catch((e)=>{
					this.$message.error(e)
				})
			},
      //提交信息
      submitInfo() {
				this.$confirm('请仔细核对注册信息，确保信息准确无误！','提示',{
					confirmButtonText: '确认提交',
					cancelButtonText: '核对信息',
					type: 'warning'
				}).then(()=>{
					// this.next = true
					this.sunmitData()
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
        //   bankAccountName:this.dataInfo.bankAccountName,
        //   bankBranchName:this.dataInfo.bankBranchName,
        //   bankBranchCode:this.dataInfo.bankBranchCode,
        //   bankCard:this.dataInfo.bankCard,
        //   lepCardFront:this.idCard[0],
        //   lepCardBack:this.theotherside[0],
        //   licenseSign:this.businessLicense[0]
        // }
				
      },
			sunmitData() {
				this.$refs.form.validate((vaid) =>{
					if(vaid) {
						if(this.idCard.length == 0) {
							this.$message({
								message: '请上传身份证正面照',
								type: 'warning'
							})
							return
						}
						if(this.theotherside.length == 0) {
							this.$message({
								message: '请上传身份证背面照',
								type: 'warning'
							})
							return
						}
						if(this.businessLicense.length == 0) {
							this.$message({
								message: '请上传营业执照',
								type: 'warning'
							})
							return
						}
					let params = {
							companyId:this.dataInfo.id,
							name: "武汉阿克涅网络科技有限公司",
							address: "武汉东湖新技术开发区关南园一路20号当代华夏创业中心1、2、3栋2层19号（自贸区武汉片区）",
							documentCard: "91420100MA49G98561",
							lepName: "段枭宇",
							lepDocumentCard: "420583199610180043",
							lepPhone: "15827846050",
							bankBranchName: "武汉农村商业银行光谷支行",
							bankBranchCode: "402521009216",
							bankCard: "210880551210017",
							bankAccountName: "武汉农村商业银行",
							lepCardFront:this.companyForm.idCard,
							lepCardBack:this.companyForm.theotherside,
							licenseSign:this.companyForm.businessLicense
						}
						this.fullscreenLoading = true
						this.$ajax.postJSON('/api/enterprise_pos',params).then(res => {
							res= res.data
							if(res.status == 200){
								this.fullscreenLoading = false
								this.next = true
								this.$message({
									type:'success',
									message:res.message
								})
							}
						}).catch((e)=>{
							this.fullscreenLoading = false
							this.$message.error(e)
						})
					}else {
						return false;
					}
				})
			},
			//查询注册状态
			enterprise(index) {
				let params = {
					companyId:this.dataInfo.id
				}
				this.$ajax.get('/api/enterprise_pos',params).then(res => {
					res=res.data
					if(res.status == 200) {
						let data = JSON.parse(res.data.data),
								copyData = JSON.parse(JSON.stringify(res.data));

						if (!this.status || data.status !== 2 || !data.ocrRegnumComparisonResult || !data.ocrIdcardComparisonResult) {
							if (!this.status && data.status == 2 && data.ocrRegnumComparisonResult == 1 && data.ocrIdcardComparisonResult == 1) {
								this.$nextTick(() => {
									let imgList = new Array(copyData.lepCardFront,copyData.lepCardBack,copyData.licenseSign)
									this.fileSign(imgList,'preload',false).then(res => {
										for (const key in copyData) {
											if (key !== 'data') {
												let element = copyData[key],
														elementName = element.split('?')[0].split('/');
												res.some(item => {
													let itemName = item.split('?')[0].split('/');

													if (key === 'lepCardFront' && itemName[itemName.length-1] === elementName[elementName.length-1]) {
														this.idCard = item
														this.companyForm.idCard = item
													}
													if (key === 'lepCardBack' && itemName[itemName.length-1] === elementName[elementName.length-1]) {
														this.theotherside = item
														this.companyForm.idCard = item
													}
													if (key === 'licenseSign' && itemName[itemName.length-1] === elementName[elementName.length-1]) {
														this.businessLicense = item
														this.companyForm.businessLicense = item
													}
												})
											}
										}
										this.status = true
									})
								})
							} else if (this.status && (data.status != 2 || data.ocrRegnumComparisonResult == 0 || data.ocrIdcardComparisonResult == 0)) {
								clearInterval(this.timer);
								this.$message({
									type: 'warning',
									message: '证件信息审核失败！'
								})
								this.firstDisable = false
								return
							}
							this.titleIndex = 0
							return
						} else if (!data.isSignContract) {
							this.currentState = '审核通过'
							this.titleIndex = 1
							this.firstDisable = false
							if (!this.timer) {
								this.timer = setInterval(() =>{
									this.enterprise()
								},5000)
							}
							return
						} else if (!data.isPhoneChecked) {
							this.titleIndex = 3
							this.sms = 2
							clearInterval(this.timer);
							return
						} 
						
						
						// if (!this.dataInfo.status && data.status == 2 && data.ocrRegnumComparisonResult == 1 && data.ocrIdcardComparisonResult == 1) {
						// 	let imgList = new Array(copyData.lepCardFront,copyData.lepCardBack,copyData.licenseSign)
						// 	this.fileSign(imgList,'preload',false).then(res => {
						// 		for (const key in copyData) {
						// 			if (key !== 'data') {
						// 				let element = copyData[key],
						// 						elementName = element.split('?')[0].split('/');
						// 				res.some(item => {
						// 					let itemName = item.split('?')[0].split('/');

						// 					if (key === 'lepCardFront' && itemName[itemName.length-1] === elementName[elementName.length-1]) {
						// 						this.idCard = item
						// 						this.companyForm.idCard = item
						// 					}
						// 					if (key === 'lepCardBack' && itemName[itemName.length-1] === elementName[elementName.length-1]) {
						// 						this.theotherside = item
						// 						this.companyForm.idCard = item
						// 					}
						// 					if (key === 'licenseSign' && itemName[itemName.length-1] === elementName[elementName.length-1]) {
						// 						this.businessLicense = item
						// 						this.companyForm.businessLicense = item
						// 					}
						// 				})
						// 			}
						// 		}
						// 	})
						// 	this.titleIndex = 0
						// 	return
						// }
						// if(this.dataInfo.status == 2 && data.status == 2 && this.titleIndex == 0 && !data.ocrRegnumComparisonResult && !data.ocrIdcardComparisonResult) {
						// 	console.log(798);
						// 	let imgList = new Array(copyData.lepCardFront,copyData.lepCardBack,copyData.licenseSign)
						// 	this.fileSign(imgList,'preload',false).then(res => {
						// 		for (const key in copyData) {
						// 			if (key !== 'data') {
						// 				let element = copyData[key],
						// 						elementName = element.split('?')[0].split('/');
						// 				res.some(item => {
						// 					let itemName = item.split('?')[0].split('/');

						// 					if (key === 'lepCardFront' && itemName[itemName.length-1] === elementName[elementName.length-1]) {
						// 						this.idCard = item
						// 						this.companyForm.idCard = item
						// 					}
						// 					if (key === 'lepCardBack' && itemName[itemName.length-1] === elementName[elementName.length-1]) {
						// 						this.theotherside = item
						// 						this.companyForm.idCard = item
						// 					}
						// 					if (key === 'licenseSign' && itemName[itemName.length-1] === elementName[elementName.length-1]) {
						// 						this.businessLicense = item
						// 						this.companyForm.businessLicense = item
						// 					}
						// 				})
						// 			}
						// 		}
						// 	})
						// 	return
						// }
						// if(data.status != 2 && this.titleIndex == 0) {
						// 	this.$message.error('个人信息提交失败，请重新提交！')
						// 	this.firstDisable = false
						// 	clearInterval(this.timer);
						// 	return
						// }
						// if(!data.ocrRegnumComparisonResult && this.titleIndex == 0) {
						// 	if (data.ocrRegnumComparisonResult === 0) {
						// 		this.$message.error('上传营业执照失败，请重新上传！')
						// 		this.firstDisable = false
						// 		clearInterval(this.timer);
						// 	}
						// 	return
						// }
						// if(!data.ocrIdcardComparisonResult && this.titleIndex == 0) {
						// 	if (data.ocrIdcardComparisonResult === 0) {
						// 		this.$message.error('上传身份证照失败，请重新上传！')
						// 		this.firstDisable = false
						// 		clearInterval(this.timer);
						// 	}
						// 	// clearInterval(this.timer);
						// 	return
						// }
						// if(data.status == 2 && data.ocrRegnumComparisonResult == 1 && data.ocrIdcardComparisonResult == 1 && this.titleIndex == 0 && this.dataInfo.status != 0) {
						// 	// this.$message.success('信息审核成功')
						// 	this.firstDisable = false
						// 	clearInterval(this.timer);
						// 	this.titleIndex = 1
						// 	this.signContract()
						// 	return
						// }
						// if(this.titleIndex == 1 && data.isSignContract == true) {
						// 	this.sms = 2
						// 	clearInterval(this.timer);
						// 	return
						// }
						
					}
				}).catch((e)=>{
					console.log(e);
					// clearInterval(this.timer);
					// this.$message({message:e})
				})
			},
			nexts() {
				// this.titleIndex = 1 
				this.$message.success('信息审核中，请稍后！')
				this.status = true
				this.firstDisable = true
				// this.signContract()
				// this.timer = setInterval(() =>{
				// 	this.enterprise()
				// },5000)
			},
			smsNext() {
				this.titleIndex = 2
			}
		},
		beforeDestroy() {
			clearInterval(this.timer);
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
			/deep/.after-class {
				span::after {
					content: '秒';
					padding-left: 4px;
				}
			}
		}
	}
</style>