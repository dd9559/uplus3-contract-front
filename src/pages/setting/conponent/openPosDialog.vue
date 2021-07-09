<template>
	<div class="posDialog">
		<el-dialog
      title="开通POS收款"
      :closeOnClickModal="$tool.closeOnClickModal"
      :visible.sync="posDialog"
      width="1200px"
      :before-close="handleClose"
      class="dep-dialog"
			@open="dialogOpen"
			@click="handleClose">
			<div class="titleBox"
			>
				<div class="title" :class="{'titleTips':index == titleIndex}" v-for="(item,index) in titleList" :key="index" >
					{{item.item}}
				</div>
			</div>
			<!-- titleIndex == 'first' -->
      <div class="posDialogBox" v-if="titleIndex == 0">
				<div class="formBox">
					<el-form label-position="right" ref="form" size="mini" :disabled="disForm" :rules="rulesForm" :model="dataInfo" label-width="140px"
					v-loading.fullscreen.lock="fullscreenLoading"
					element-loading-text="信息提交中"
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.6)">
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
						<el-form-item label="开户银行名称: " prop="bankAccountName">
							<el-select  v-model="dataInfo.bankAccountName" filterable style="width:100%"
							placeholder="选择开户银行" @change="bankList">
								<el-option v-for="m in adminBanks" :key="m.bankName" :label="m.bankName" :value="JSON.stringify(m)"></el-option>
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
							<div style="display:flex;align-items: center;position: relative;">
								<fileUp id="idCard" class="up" :rules="['png','jpg']" @getUrl="upload" :more=false :picSize=true :scane="{path:'setting'}" :maxSize="1">
                  <img :src="idCard" width="235px" height="150px" v-show="companyForm.idCard" style="border: 1px solid #8fb3fa;border-radius:10px">
                  <img src="@/assets/img/idcard.png" width="237px" height="152px" v-show="!companyForm.idCard">	
								</fileUp>
								<div class="mask" v-if="mask"></div>
								<div style="width:229px;height:147px;margin-left: 50px;">
									<fileUp id="theotherside" class="up" :rules="['png','jpg']" @getUrl="upload" :more=false :picSize=true :scane="{path:'setting'}" :maxSize="1">
										<img :src="theotherside" width="227px" height="145px" v-show="companyForm.theotherside" style="border: 1px solid #8fb3fa;border-radius:10px;">
										<img src="@/assets/img/theotherside.png" width="229px" height="147px" v-show="!companyForm.theotherside">
									</fileUp>
								</div>
								<div class="masks" v-if="mask"></div>
							</div>
						</div>
					</div>
					<div class="businessLicense" >
						<div style="margin:20px 0;">企业营业执照上传：</div>
						<div style="width:316px;height:174px;position: relative;">
							<fileUp id="businessLicense" class="up" :rules="['png','jpg']" @getUrl="upload" :more=false :picSize=true :scane="{path:'setting'}" :maxSize="1">
                <img :src="businessLicense" width="316px" height="174px" v-show="companyForm.businessLicense" style="border: 1px solid #8fb3fa;border-radius:10px">
								<img src="@/assets/img/businessLicense.png" width="316px" height="174px" v-show="!companyForm.businessLicense">
							</fileUp>
							<div class="maskbig" v-if="mask"></div>
						</div>
					</div>
				</div>
			</div>
      <div slot="footer" v-if="titleIndex == 0">
        <el-button @click="submitInfo" type="primary" :disabled='subDisable' round v-if="!next">提交信息</el-button>
				<el-button @click="nexts" type="primary" :disabled='firstDisable' v-dbClick round v-else>下一步</el-button>
      </div>
			<div style="margin-top: 30px;color: #ff0000;height: 100px;" class="qyBox" v-if="titleIndex == 1">
				<span v-if="sms == 1" class="qyBoxtips">当前状态：签约中</span>
				<span v-if="sms == 2" class="qyBoxtips">当前状态：签约完成</span>
				<el-button @click="signContract" type="primary" round v-if="sms == 1 && signContracts" size="mini">补发签约短信</el-button>
				<el-button type="primary" :class="disable ? 'contract-after-class' : ''" :disabled="disable" size="mini" @click="countDowns" round v-if="!signContracts && sms == 1">{{getCode}}</el-button>
			</div>
			<div class="contract" slot="footer" v-if="titleIndex == 1">
				<el-button @click="smsNext" type="primary" v-dbClick round>下一步</el-button>
      </div>
			<div class="inputCode" v-if="titleIndex == 2">
				<span>输入验证码：</span>
				<el-input v-model="inputCode" maxlength="6" style="width:200px" placeholder="请输入验证码" size="mini" type="number" oninput="if(value.length>6)value=value.slice(0,6)"></el-input>
				<el-button size="mini" type="primary" @click="yzCode" style="min-width:80px" v-if="getYzCode">获取验证码</el-button>
				<el-button size="mini" type="primary" :class="disable ? 'after-class' : ''" :disabled="disable"  @click="countDowns('yzCode')" style="min-width:80px" v-else>{{getCodes}}</el-button>
			</div>
			<span style="margin-left: 40px;color: rgb(255, 0, 0);height: 10px;margin-top: 10px;display: inline-block;" v-if="titleIndex == 2">当前状态：绑定中</span>
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
				bankBranch:[
				],
				branchPage: 1,
				branchTotal: 0,
				branchStr: '',
				fullscreenLoading: false,
				fourthStoreNoEdit:false,
				firstDisable: false,
				subDisable:false,
				getYzCode:false,
				signContracts:true,
				dataInfo:{
					bankAccountName:'',
					bankBranchName:'',
					bankBranchCode:'',
					bankCard:'',
					id:'',
					name:'',
					address:'',
					documentCard:'',
					lepName:'',
					bankAccountName:'',
				},
				status: false,
				disForm:false,
				mask:false,
				approved:false,
				contract:false,
				info: true,
				// signContractFlag: false,
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
				getCode:'60秒',
				getCodes:'60',
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
					bankCard:[
						{ required: true, message: '请输入银行卡号', trigger: 'blur' }
					],
					bankAccountName:[
						{ required: true, message: '请选择开户银行名称', trigger: 'blur'},
					],
					bankBranchName:[
						{ required: true, message: '请选择支行名称', trigger: 'blur' }
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
					// console.log(newName,888);
					this.dataInfo = {}
					this.dataInfo = Object.assign({},this.dataInfo,JSON.parse(JSON.stringify(newName)))
					console.log(this.dataInfo,999999);
				},
				deep: true
			},
			titleIndex:{
				handler(newName,oldName) {
					if(newName == 0) {
					}
				},
				deep: true
			},
		},
		methods:{
			//打开dialog
			dialogOpen() {
				this.status = false
				this.enterprise()
				// console.log(this.dataInfo);
			},
			clearList() {
				this.companyForm = {}
			},
      handleClose() {
				if(this.titleIndex == 0) {
					this.$refs.form.resetFields()
				}
				// this.dataInfo = {}
				this.companyForm = {
					idCard:'',
					theotherside:'',
					businessLicense:''
				},
				this.dataInfo.bankBranchCode = ''
				this.inputCode = ''
				this.titleIndex = 0
				this.currentState = '未提交'
				this.sms = 1
				this.signContracts = true
				this.contract = false
				this.next = false
				this.mask = false
				this.disForm = false
				this.subDisable = false
				this.getYzCode = false
				clearInterval(this.countDown)
				this.getYzCode = true
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
				this.dataInfo.bankAccountName = JSON.parse(val).bankName
				this.branchStr = JSON.parse(val).bankName
				this.branchPage = 1
				this.bankBranch = []
				this.$set(this.dataInfo,'bankBranchName','')
				this.$set(this.dataInfo,'bankBranchCode','')
				this.branchStr = val
				this.getBankBranch(JSON.parse(val).bankName)
			},
			bankBranchs(val) {
				this.$nextTick(()=>{
					this.$set(this.dataInfo,'bankBranchName',JSON.parse(val).branchName)
				})
				this.$set(this.dataInfo,'bankBranchCode',JSON.parse(val).branchCode)
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
			// 获取银行支行名称
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
							console.log(this.bankBranch);
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
							console.log(this.businessLicense,99);
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
						// this.signContractFlag = true
						this.$message.success('电子签约请求成功,请尽快完成签约')
						this.countDowns()
						// this.sms = 2
						// this.timer = setInterval(() =>{
						// 	this.enterprise()
						// },5000)
					}
				}).catch(error=>{
          this.$message({message:error})
        })
			},
			//倒计时
			countDowns(e) {
				if(e == 'yzCode') {
					this.disable = true
					this.getCodes = 60
					this.countDown = setInterval(()=>{
						this.getCodes--
						if(this.getCodes == 0) {
							this.getYzCode = true
							clearInterval(this.countDown)
							this.disable = false
							this.getCodes = '获取验证码'
						}
					},1000)
				}else {
					this.disable = true
					this.getCode = 60
					this.signContracts = false
					this.countDown = setInterval(()=>{
						this.getCode--
						if(this.getCode == 0) {
							this.signContracts = true
							clearInterval(this.countDown)
							this.disable = false
							this.getCode = '补发签约短信'
						}
					},1000)
				}
			},
			//验证码
			yzCode() {
				let params = {
					companyId:this.dataInfo.id,
					lepPhone:this.dataInfo.lepPhone,
				}
				this.$ajax.get('/api/enterprise_pos/checkCode',params).then(res => {
					res = res.data
					if(res.status == 200) {
						this.$message.success(res.message)
						this.getYzCode = false
						this.countDowns('yzCode')
					}
				}).catch((e)=>{
					this.$message.error(e)
				})
			},
			//确认短信
			codeConfirm() {
				if(!this.inputCode) {
					this.$message.error('验证码不能为空！')
					return
				}
				let params = {
					companyId:this.dataInfo.id,
					lepPhone:this.dataInfo.lepPhone,
					checkCode:Number(this.inputCode)
				}
				this.$ajax.postJSON('/api/enterprise_pos/bindPhone',params).then(res => {
					res= res.data
					if(res.status == 200) {
						this.$message.success(res.message)
						setTimeout(()=>{
							this.handleClose()
							this.$emit('bindingComplete',true)
						},2000)
					}
				}).catch((e)=>{
					this.$message.error(e)
				})
			},
      //提交信息
      submitInfo() {
				this.$refs.form.validate((vaid,object) =>{
					console.log(vaid,object);
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
						this.$confirm('请仔细核对注册信息，确保信息准确无误！','提示',{
							confirmButtonText: '确认提交',
							cancelButtonText: '核对信息',
							type: 'warning'
						}).then(()=>{
							// this.next = true
							this.sunmitData()
						}).catch(()=>{

						})
					}
				})
      },
			sunmitData() {
				let params = {
					companyId:this.dataInfo.id,
					name:this.dataInfo.name,
					address:this.dataInfo.address,
					documentCard:this.dataInfo.documentCard,
					lepName:this.dataInfo.lepName,
					lepDocumentCard:this.dataInfo.lepDocumentCard,
					lepPhone:this.dataInfo.lepPhone,
					bankAccountName:this.dataInfo.bankAccountName,
					bankBranchName:this.dataInfo.bankBranchName,
					bankBranchCode:this.dataInfo.bankBranchCode,
					bankCard:this.dataInfo.bankCard,
					lepCardFront:this.companyForm.idCard,
					lepCardBack:this.companyForm.theotherside,
					licenseSign:this.companyForm.businessLicense
				}
				// let params = {
				// 	companyId:this.dataInfo.id,
				// 	name: "武汉阿克涅网络科技有限公司",
				// 	address: "武汉东湖新技术开发区关南园一路20号当代华夏创业中心1、2、3栋2层19号（自贸区武汉片区）",
				// 	documentCard: "91420100MA49G98561",
				// 	lepName: "段枭宇",
				// 	lepDocumentCard: "420583199610180043",
				// 	lepPhone: "15827846050",
				// 	bankBranchName: "武汉农村商业银行光谷支行",
				// 	bankBranchCode: "402521009216",
				// 	bankCard: "210880551210017",
				// 	bankAccountName: "武汉农村商业银行",
				// 	lepCardFront:this.companyForm.idCard,
				// 	lepCardBack:this.companyForm.theotherside,
				// 	licenseSign:this.companyForm.businessLicense
				// }
				this.fullscreenLoading = true
				this.$ajax.postJSON('/api/enterprise_pos',params).then(res => {
					res= res.data
					if(res.status == 200){
						this.fullscreenLoading = false
						this.subDisable= true
						this.status= true
						this.isSubmit = true
						this.next = true
						this.disForm = true
						this.mask = true
						setTimeout(()=>{
							this.isSubmit = false
						},5000)
						this.$message({
							type:'success',
							message:res.message
						})
						this.currentState = '提交信息成功，审核中，点击（下一步）查询审核结果'
					}
				}).catch((e)=>{
					this.fullscreenLoading = false
					this.$message.error(e)
				})
			},
			//查询注册状态
			enterprise() {
				let params = {
					companyId:this.dataInfo.id
				}
				this.$ajax.get('/api/enterprise_pos',params).then(res => {
					res=res.data
					if(res.status == 200) {
						let data = JSON.parse(res.data.data),
								copyData = JSON.parse(JSON.stringify(res.data));
						if (data.status !== 2 || !data.ocrRegnumComparisonResult || !data.ocrIdcardComparisonResult ||
						(!this.status && !this.posInfo.status && data.status == 2 && data.ocrRegnumComparisonResult && data.ocrIdcardComparisonResult && 
						data.isSignContract && data.isPhoneChecked)) {
							this.titleIndex = 0
							let {ocrIdcardComparisonResult,ocrRegnumComparisonResult,status} = data,
									imgList = []
							if (status == 2) {
								this.dataInfo.name = data.companyName
								this.dataInfo.address = data.companyAddress
								this.dataInfo.lepName = data.legalName
								this.dataInfo.lepDocumentCard = data.legalIds
								this.dataInfo.lepPhone = data.legalPhone
								this.$set(this.dataInfo,'bankAccountName',data.parentBankName)
								this.$set(this.dataInfo,'bankBranchName',data.bankName)
								this.$set(this.dataInfo,'bankBranchCode',data.unionBank)
								this.$set(this.dataInfo,'bankCard',data.accountNo)
							}
							if((copyData.status == 2 && status == 2 && ocrRegnumComparisonResult == undefined && ocrIdcardComparisonResult == undefined) || copyData.status == 3) {
								imgList.push(copyData.licenseSign,copyData.lepCardFront,copyData.lepCardBack)
							}
							if(copyData.status == 2 && status == 2 && ocrRegnumComparisonResult && !ocrIdcardComparisonResult) {

							}
							if(data.status !== 2 && copyData.status == 2) {
								this.currentState = '未审核通过,个人信息审核失败,请重新提交！'
								this.disForm = false
								this.mask = false
							}
							if(data.status == 2 && data.ocrRegnumComparisonResult == 0 && copyData.status == 2) {
								this.currentState = '未审核通过,营业执照上传失败,请重新上传！'
								// this.disForm = false
								// this.mask = false
							}
							if(data.status == 2 && data.ocrRegnumComparisonResult && data.ocrIdcardComparisonResult==0 && copyData.status == 2) {
								this.currentState = '未审核通过,身份证上传失败,请重新上传！'
								this.disForm = false
								this.mask = false
							}
							if (!this.status && imgList.length) {
								this.$nextTick(() => {
									this.fileSign(imgList,'preload',false).then(res => {
										for (const key in copyData) {
											if (!['data','status'].includes(key)) {
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
														this.companyForm.theotherside = item
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
							}
							if (this.status&&(data.status != 2 || data.ocrRegnumComparisonResult == 0 || data.ocrIdcardComparisonResult == 0)) {
								if(copyData.status == 3) {
									this.currentState = '信息审核中，请稍后查询'
									this.next = true
									this.disForm = true
									this.mask = true
								}else {
									this.$message({
										type: 'warning',
										message: '证件信息审核失败,请重新提交信息!'
									})
									this.next = false
									this.firstDisable = false
									this.subDisable = false
								}
								return
							}
							return
						} else if (!data.isSignContract) {
							this.currentState = '审核通过'
							this.info = false
							if(!this.info && !this.next) {
								this.titleIndex = 0
							}
							console.log(this.info,99990);
							// if(this.titleIndex == 1 && this.info) {
							// 	this.$message.warning('请尽快完成电子签约')
							// }
							this.approved =true
							this.next = true
							this.disForm = true
							this.mask = true
							let imgList = []
							if (data.status == 2 && data.ocrRegnumComparisonResult && data.ocrIdcardComparisonResult) {
								this.dataInfo.name = data.companyName
								this.dataInfo.address = data.companyAddress
								this.dataInfo.lepName = data.legalName
								this.dataInfo.lepDocumentCard = data.legalIds
								this.dataInfo.lepPhone = data.legalPhone
								this.$set(this.dataInfo,'bankAccountName',data.parentBankName)
								this.$set(this.dataInfo,'bankBranchName',data.bankName)
								this.$set(this.dataInfo,'bankBranchCode',data.unionBank)
								this.$set(this.dataInfo,'bankCard',data.accountNo)
								imgList.push(copyData.licenseSign,copyData.lepCardFront,copyData.lepCardBack)
							}
							if(imgList.length) {
								this.$nextTick(() => {
									this.fileSign(imgList,'preload',false).then(res => {
										for (const key in copyData) {
											if (!['data','status'].includes(key)) {
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
														this.companyForm.theotherside = item
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
							}
							// console.log(data.status, data.ocrRegnumComparisonResult,data.ocrIdcardComparisonResult,this.status);
							// if (!this.status) {
							// 	this.titleIndex = 0
							// 	// this.signContract()
							// 	this.status = true
							// } else {
							// 	this.currentState = '审核通过'
							// 	this.approved = true
							// 	// this.firstDisable = false
							// 	// this.next = true
							// 	// if(this.titleIndex == 0 && this.nexts) {
							// 	// 	clearInterval(this.next)
							// 	// }
							// }
							return
						} else if (!data.isPhoneChecked) {
							if(this.signContracts) {
								this.titleIndex = 1
								this.sms = 2
							}
							if(data.isSignContract) {
								this.contract = true
							}
							// if(this.titleIndex == 1) {
							// 	this.contract = true
							// 	// this.sms = 2
							// }else {
							// 	this.titleIndex = 1
							// 	this.sms = 2
							// 	// this.getYzCode = true
							// }
							return
						} 
					}
				}).catch((e)=>{
					if(e == '服务端操作失败') {
						this.$message({message:e})
					}
				})
			},
			nexts() {
				if(this.isSubmit) {
					return this.$message.warning('审核中')
				}
				this.enterprise()
				this.info = true
				this.next = true
				if(this.approved) {
					this.titleIndex = 1 
					this.sms = 1
					this.signContracts = true
					this.signContract()
				}
			},
			smsNext() {
				this.signContracts = false
				this.enterprise()
				console.log(this.contract);
				if(this.contract) {
					this.titleIndex = 2
					this.yzCode()
				}else {
					this.$message.warning('请尽快完成电子签约')
				}
				
			}
		},
			
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
		.qyBox {
			.qyBoxtips {
				margin-left: 55px;
				
			}
			/deep/ .is-round {
					border-radius: 10px;
				}
				/deep/.contract-after-class {
					min-width: 104px;
					border-radius: 10px;
					span::after {
						width: 104px;
						text-align: center;
						content: '秒';
						padding-left: 4px;
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
			.mask {
				position: absolute;
				top: 0;
				width: 237px;
				height: 150px;
				z-index: 99;
				background-color: rgba(90, 90, 90, 0.5);
			}
			.masks {
				position: absolute;
				right: 0;
				width: 229px;
				height: 147px;
				z-index: 99;
				background-color: rgba(90, 90, 90, 0.5);
			}
			.maskbig {
				position: absolute;
				top: 0;
				width: 316px;
				height: 174px;
				z-index: 99;
				background-color: rgba(90, 90, 90, 0.5);
			}
		}
		.contract {
			
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