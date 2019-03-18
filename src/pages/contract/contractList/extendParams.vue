<template>
  <div class="view-container">
    <div class="top" v-if="isShowType">
      <div class="type">
        <div :class="{'active':isActive===1}" @click="changeType(1)">居间合同</div>
        <div :class="{'active':isActive===2}" @click="changeType(2)">买卖合同</div>
      </div>
    </div>
    <div class="contentBox">
      <div class="nav" :class="{'hid':isActive===2}">
        <ul>
          <li><span :class="{'navBlue':navId==='#one'}" @click="goNav('#one')">第一条、房屋基本情况</span></li>
          <li><span :class="{'navBlue':navId==='#two'}" @click="goNav('#two')">第二条、房屋交易流程</span></li>
          <li><span :class="{'navBlue':navId==='#three'}" @click="goNav('#three')">第三条、房屋权属情况</span></li>
          <li><span :class="{'navBlue':navId==='#four'}" @click="goNav('#four')">第四条、成交方式</span></li>
          <li><span :class="{'navBlue':navId==='#five'}" @click="goNav('#five')">第五条、房产转让价格</span></li>
          <li><span :class="{'navBlue':navId==='#six'}" @click="goNav('#six')">第六条、付款约定</span></li>
          <li><span :class="{'navBlue':navId==='#seven'}" @click="goNav('#seven')">第七条、房屋产权及具体状况的承诺</span></li>
          <li><span :class="{'navBlue':navId==='#eight'}" @click="goNav('#eight')">第八条、房产过户</span></li>
          <li><span :class="{'navBlue':navId==='#nine'}" @click="goNav('#nine')">第九条、房产交付</span></li>
          <li><span :class="{'navBlue':navId==='#ten'}" @click="goNav('#ten')">第十条、户口迁移及学籍、学位</span></li>
          <li><span :class="{'navBlue':navId==='#eleven'}" @click="goNav('#eleven')">第十一条 、违约责任</span></li>
          <li><span :class="{'navBlue':navId==='#twelve'}" @click="goNav('#twelve')">第十二条、不可抗力</span></li>
          <li><span :class="{'navBlue':navId==='#thirteen'}" @click="goNav('#thirteen')">第十三条、其他</span></li>
          <li><span :class="{'navBlue':navId==='#fourteen'}" @click="goNav('#fourteen')">第十四条、争议解决</span></li>
          <li><span :class="{'navBlue':navId==='#fifteen'}" @click="goNav('#fifteen')">第十五条、生效要件</span></li>
        </ul>
      </div>
      <iframe :src="src1" frameborder="0" ref='iframeFirst' :style="{ height: clientHei }" v-show="isActive===1"></iframe>
      <iframe :src="src2" frameborder="0" ref='iframeSecond' :style="{ height: clientHei }" v-show="isActive===2"></iframe>
      <div class="btn">
        <el-button round @click="isSave(1)">保存</el-button><br>
        <el-button v-if="(Msg.type===1||Msg.type===2||Msg.type===3)&&power['sign-ht-info-toverify'].state" type="primary" round @click="submit" v-loading.fullscreen.lock="fullscreenLoading">提审</el-button><br>
        <span class="huojian" @click="backTop"><img src="/static/img/huojian.png" alt=""></span>
      </div>
    </div>
		<!-- 合同提审弹窗 -->
		<el-dialog title="提示" :visible.sync="dialogSub" width="460px" :closeOnClickModal="$tool.closeOnClickModal">
      <span>确定合同填写无误并提交审核？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSub = false">取 消</el-button>
        <el-button type="primary" @click="toSubmit">确 定</el-button>
      </span>
    </el-dialog>
		<!-- 创建合同成功提示框 -->
    <el-dialog title="提示" :visible.sync="dialogSuccess" width="460px" :closeOnClickModal="$tool.closeOnClickModal" :showClose="false">
      <span>是否继续上传附件？如果不上传附件权证将无法办理！（你也可以以后再上传，上传附件后权证将接收办理）</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toContract">取 消</el-button>
        <el-button type="primary" @click="toUpload">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//买卖
let Obj1={
    check0:{
        name:'prove'
    },
    check1:{
        name:'acquire',
        require:true
		},
		check120:{
			name:'trader'
		},
    check2:{
        name:'hasRunsh',
        require:true
    },
    check7:{
        name:'loans'
    },
    check8:{
        name:'pledge'
    },
    check9:{
        name:'transaction'
    },
    check10:{//房屋性质
        name:'nature',
        other:['val30'],
        },
    check3:{
        name:'setting',
        require:true
    },
    check11:{
        name:'rentout'
	},
	val46:'',
    val53:'',
    check4:{
        name:'furniture',
        require:true
    },
    check5:{
        name:'carport',
        require:true
    },
    val70:'',
    val71:'',
    val72:'method2',
    val93:'',
    val94:'method3',
    check12:{
        name:'yes'
    },
    check6:{
        name:'check02',
        require:true
    },
    val110:'',
    val111:'',
    check14:{
        name:"check03"
    },
    check15:{
        name:"check04"
    },
    check16:{
        name:"check05"
    },
    check17:{
        name:"check06"
    },
    val121:'',
    check18:{
        name:"check07"
		},
		val200:'',
    val124:'method5',
    val128:'',
		val129:'',
		check13:{
        name:'check01'
    },
    val130:'',
    val131:'',
    val132:'',
    val138:'',
}
//租赁
let Obj2 = {
    val22:'',
		val25:'',
		val26:'',
		val27:'',
		check4:{
				name:'zhizhao4',
				require:true
		},
		val33:'',
		val34:'',
		check5:{
				name:'zhizhao5',
				require:true
		},
		val42:'',
		check6:{
				name:'zhizhao6'
		},
		check18:{
				name:'facility',
				require:true
		},
		val52:'',
		val53:'',
		val56:'',
		val59:'',
		val60:'',
		val61:'',
		val64:'',
		val65:'',
		val66:'',
		// check7:{
		//     name:'zhizhao7'
		// },
		val73:'',
		check8:{
				name:'zhizhao8'
		},
		val79:'',
		val80:'',
		val82:'',
		val83:'',
		val84:'',
		val86:'',
		val88:'',
		val92:'',
		val93:'',
		val94:'',
		check9:{
				name:'zhizhao9',
				require:true
		},
		check10:{
				name:'zhizhao10',
				require:true
		},
		check11:{
				name:'zhizhao11',
				require:true
		},
		check12:{
				name:'zhizhao12',
				require:true
		},
		check15:{
				name:'zhizhao15',
				require:true
		},
		check16:{
				name:'remote',
				require:true
		},
		check17:{
				name:'zhizhao16',
				require:true
		},
}
//代办
let Obj3 = {
    val8:'',
    val10:'',
    val11:'',
    val12:'',
    val14:'',
    val15:'',
    val16:'',
    val17:'',
    check1:{
        name:'part'
    },
    val20:'',
    check2:{
        name:'owner',
        require:true
    },
    check3:{
        name:'guest',
        require:true
    },
}
//意向
let Obj4 = {
    val3: '',
    val8: '',
    val9: '',
    val12: '',
    val13: '',
    val16: '',
}
//定金
let Obj5 = {
    val5:'',
		textarea:{
				name:'textarea',
				other:['val6','val7'],//勾选框的补充项
		},
		val13:'',
		check1:{
				name:'manage'
		},
		val16:'',
		val17:'',
		val20:'',
		val25:'',
		check2:{
				name:'pay',
				other:['val35','val36'],//勾选框的补充项
		},
		val37:'',
		check3:{
				name:'person'
		}
}
//居间
let Obj6 = {
    val3:'',
		val5:'',
		val6:'',
		val9:'',
		val10:''
}
let errorArr1=[]
let errorArr2=[]
let loading=null
import { MIXINS } from "@/assets/js/mixins";
export default {
	mixins: [MIXINS],
  data(){
    return{
      clientHei:'',
      Msg:'',//合同信息
      isHaveHtml:'',//是否有html文件 1.有 2.没有
      htmlPath:'',//html
      isShowType:false,
      isActive: 1,
      src1:'',
      src2:'',
      html:'',
      fullscreenLoading:false,
      navId:'',
			dialogSuccess:false,
			dialogSub:false,
			param:'',
			//权限
			power:{
				'sign-com-htdetail': {
          state: false,
          name: '合同详情'
				},
				'sign-ht-xq-data': {
          state: false,
          name: '资料库权限'
				},
				'sign-ht-info-toverify': {
          state: false,
          name: '提交审核'//编辑+提审
        },
        'sign-ht-info-sverify': {
          state: false,
          name: '提交审核'//新增+提审
        },
			},
			iframe1State:false,
			iframe2State:false
    }
  },
  created(){
		// this.fullscreenLoading=true
		loading=this.$loading({
			lock: true,
			text: 'Loading',
			spinner: 'el-icon-loading',
			background: 'rgba(0, 0, 0, 0.5)'
		});
		this.getAdmin();//获取当前登录人信息
    // http://localhost:8080/api/contract/showHtml?id=327&type=residence
		this.clientHeight();
		this.Msg = JSON.parse(localStorage.getItem("contractMsg"));
    if (!window.location.origin) {
        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    }
    // console.log(window.location.origin)
    let http = window.location.origin
    let dayRandomTime=new Date().getTime()
    if(this.Msg.type===1){
      //租赁
      this.src1=`${http}/api/contract/showHtml?id=${this.Msg.id}&type=address`
    }else if(this.Msg.type===2){
			//买卖
			if(this.Msg.isWuHanMM){//是否是武汉的买卖合同
				this.isShowType=true;
				this.src1=`${http}/api/contract/showHtml?id=${this.Msg.id}&type=residence&dayRandomTime=${dayRandomTime}`//居间
				this.src2=`${http}/api/contract/showHtml?id=${this.Msg.id}&type=business&dayRandomTime=${dayRandomTime+10}`//买卖
			}else{
				this.isShowType=false;
				this.isActive=2;
				this.src2=`${http}/api/contract/showHtml?id=${this.Msg.id}&type=address`//居间
			}
      
    }else if(this.Msg.type===3){
      //代办
      this.src1=`${http}/api/contract/showHtml?id=${this.Msg.id}&type=address`
    }else if(this.Msg.type===4){
      //意向
      this.src1=`${http}/api/contract/showHtml?id=${this.Msg.id}&type=address`
    }else if(this.Msg.type===5){
      //定金
      this.src1=`${http}/api/contract/showHtml?id=${this.Msg.id}&type=address`
		}
  },
  methods: {
    // 控制弹框body内容高度，超过显示滚动条
    clientHeight() {        
			// this.clientHei= screen.height -300 + 'px'
			// console.log('teddddddd')
      this.clientHei= document.documentElement.clientHeight -130 + 'px'
    },
    //居间买卖切换
    changeType(value) {
			this.isActive = value;
			this.navId='';
      if(value===1){
        // this.count=1;
        // this.showAddress=this.residence;
        // this.setSrc(this.showAddress,this.total_r);
      }else{
        // this.count=1;
        // this.showAddress=this.business;
        // this.setSrc(this.showAddress,this.total_b);
      }
    },
    //导航跳转
    goNav(id){
			this.navId=id;
			let iframebox=this.$refs.iframeSecond
			let navHeight = iframebox.contentWindow.document.querySelector(id).offsetTop+5
			iframebox.contentWindow.scrollTo(0,navHeight)
    },
    //回到顶部
    backTop(){
			let iframebox1=this.$refs.iframeFirst;
			let iframebox2=this.$refs.iframeSecond;
			iframebox1.contentWindow.scrollTo(0,0)
			iframebox2.contentWindow.scrollTo(0,0)
		},
		//创建成功提示
    toUpload(){//上传合同资料库
      this.dialogSuccess=false;
      if(this.power['sign-com-htdetail'].state){
        if(this.power['sign-ht-xq-data'].state){
          this.setPath(this.$tool.getRouter(['合同','合同列表','合同详情'],'contractList'));
          this.$router.replace({
            path: "/contractDetails",
            query: {
              type: "dataBank",
              id: this.Msg.id,//合同id
              code: this.Msg.code,//合同编号
              contType: this.Msg.type//合同类型
            }
          });
        }else{
          this.$message({
            message:'没有资料库权限,无法跳转到资料库'
          });
          this.$router.push('/contractList');
        }
      }else{
        this.$message({
          message:'没有合同详情权限,无法跳转到资料库'
        });
        this.$router.push('/contractList');
      }
    },
		toContract(){//回到合同列表
      this.dialogSuccess=false;
      this.$router.push('/contractList');
    },
		//保存
    isSave(operation){
			if(operation===1){
				// this.fullscreenLoading=true
				loading=this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.5)'
				});
			}
			var param={};
			var isFull=0;//合同是否填写完整
			let iframebox1=this.$refs.iframeFirst
			let iframebox2=this.$refs.iframeSecond
			iframebox2.contentWindow.document.body.click()
			let htmlTxt1 = `<!DOCTYPE html><html lang="en">${iframebox1.contentWindow.document.getElementsByTagName('html')[0].innerHTML}</html>`
			let htmlTxt2 = `<!DOCTYPE html><html lang="en">${iframebox2.contentWindow.document.getElementsByTagName('html')[0].innerHTML}</html>`
			
			errorArr1=[]
			errorArr2=[]
			if(this.Msg.type===2){
				if(this.Msg.isWuHanMM){
					let emptyInput1 = this.brokerageCheck(iframebox1.contentWindow)
					let emptyInput2 = this.dealCheck(iframebox2.contentWindow)
					param = {
						id:this.Msg.id,
						html:{
							residence:htmlTxt1,
							business:htmlTxt2
						},
						isCanAudit:isFull//1.完整 0.否
					}
				}else{
					let emptyInput2 = this.dealCheck(iframebox2.contentWindow)
					param = {
						id:this.Msg.id,
						html:{
							address:htmlTxt2
						},
						isCanAudit:isFull//1.完整 0.否
					}
				}
			}else{
				let emptyInput1=[]
				if(this.Msg.type===1){//租赁
					emptyInput1 = this.leaseCheck(iframebox1.contentWindow)
				}else if(this.Msg.type===3){
					emptyInput1 = this.commissionCheck(iframebox1.contentWindow)
				}else if(this.Msg.type===4){
					emptyInput1 = this.agreementCheck(iframebox1.contentWindow)
				}else if(this.Msg.type===5){
					emptyInput1 = this.depositAgreementCheck(iframebox1.contentWindow)
				}
				param = {
					id:this.Msg.id,
					html:{
						address:htmlTxt1
					},
					isCanAudit:isFull//1.完整 0.否
				}
			}
      if(errorArr1.length===0&&errorArr2.length===0){
				param.isCanAudit=1
			}
      this.$ajax.postJSON('/api/contract/updateHtml', param).then(res => {
				res=res.data
				if(res.status===200){
					// this.fullscreenLoading=false
					loading.close()
					if(operation===1){
						this.$message({
							message:'保存成功',
							type:'success'
						})
						// this.$router.push('/contractList');
					}
				}
      }).catch(error=>{
				// this.fullscreenLoading=false
				loading.close()
				this.$message({
					message:error,
					type:'error'
				})
			})
    },
    submit(){
			let iframebox1=this.$refs.iframeFirst;
			let iframebox2=this.$refs.iframeSecond;
			errorArr1=[]
			errorArr2=[]
			if(this.Msg.type===2){
				if(this.Msg.isWuHanMM){
					let emptyInput1 = this.brokerageCheck(iframebox1.contentWindow)
					let emptyInput2 = this.dealCheck(iframebox2.contentWindow)
					if(this.isActive===1){
						if(emptyInput1.length>0){
							this.$message({
								message:'合同信息未填写完整',
								type:'warning'
							})
							let inputHeight1=0
							if(emptyInput1[0].type){
								let inputTag = iframebox1.contentWindow.document.querySelector(`input[extendparam=${emptyInput1[0].name}]`)
								inputTag.classList.add("BODERRED")
								inputHeight1 = inputTag.offsetTop
							}else{
								inputHeight1 = iframebox1.contentWindow.document.querySelector(`div[name=${emptyInput1[0]}]`).offsetTop
							}
							iframebox1.contentWindow.scrollTo(0,inputHeight1)
						}else if(emptyInput2.length>0){
							this.$message({
								message:'买卖合同信息未填写完整',
								type:'warning'
							})
						}
				}else{
					if(emptyInput2.length>0){
						this.$message({
							message:'合同信息未填写完整',
							type:'warning'
						})
						let inputHeight2=0
						if(emptyInput2[0].type){
							let inputTag = iframebox2.contentWindow.document.querySelector(`input[extendparam=${emptyInput2[0].name}]`)
							inputTag.classList.add("BODERRED")
							inputHeight2 = inputTag.offsetTop
						}else{
							inputHeight2 = iframebox2.contentWindow.document.querySelector(`div[name=${emptyInput2[0]}]`).offsetTop
						}
						// let inputHeight2 = iframebox2.contentWindow.document.querySelector(`input[name=${emptyInput2[0]}]`).offsetTop
						iframebox2.contentWindow.scrollTo(0,inputHeight2)
					}else if(emptyInput1.length>0){
						this.$message({
							message:'居间合同信息未填写完整',
							type:'warning'
						})
					}
				}
			}else{//非武汉买卖
			// debugger
				let emptyInput2 = this.dealCheck(iframebox2.contentWindow)
				if(emptyInput2.length>0){
					this.$message({
						message:'合同信息未填写完整',
						type:'warning'
					})
					let inputHeight2=0
					if(emptyInput2[0].type){
						let inputTag = iframebox2.contentWindow.document.querySelector(`input[extendparam=${emptyInput2[0].name}]`)
						inputTag.classList.add("BODERRED")
						inputHeight2 = inputTag.offsetTop
					}else{
						inputHeight2 = iframebox2.contentWindow.document.querySelector(`div[name=${emptyInput2[0]}]`).offsetTop
					}
					// let inputHeight2 = iframebox2.contentWindow.document.querySelector(`input[name=${emptyInput2[0]}]`).offsetTop
					iframebox2.contentWindow.scrollTo(0,inputHeight2)
				}
			}
				
			}else{
				let emptyInput1=0
				if(this.Msg.type===1){//租赁
					// debugger
					emptyInput1 = this.leaseCheck(iframebox1.contentWindow)
					console.log(emptyInput1)
				}else if(this.Msg.type===3){
					emptyInput1 = this.commissionCheck(iframebox1.contentWindow)
				}else if(this.Msg.type===4){
					emptyInput1 = this.agreementCheck(iframebox1.contentWindow)
				}else if(this.Msg.type===5){
					emptyInput1 = this.depositAgreementCheck(iframebox1.contentWindow)
				}
				if(emptyInput1.length>0){
					this.$message({
						message:'合同信息未填写完整',
						type:'warning'
					})
					let inputHeight1=0
					if(emptyInput1[0].type){
						let inputTag = iframebox1.contentWindow.document.querySelector(`input[extendparam=${emptyInput1[0].name}]`)
						inputTag.classList.add("BODERRED")
						if(inputTag.offsetParent.tagName==="TD"){
							inputHeight1=inputTag.offsetParent.offsetTop + inputTag.offsetParent.offsetParent.offsetTop
						}else{
							inputHeight1 = inputTag.offsetTop
						}
					}else{
						inputHeight1 = iframebox1.contentWindow.document.querySelector(`div[name=${emptyInput1[0]}]`).offsetTop
					}
					iframebox1.contentWindow.scrollTo(0,inputHeight1)
				}
			}
			if(errorArr1.length===0&&errorArr2.length===0){
				let htmlTxt1=''
				let htmlTxt2=''
				let param = {}
				if(this.Msg.type===2){
					htmlTxt1 = `<!DOCTYPE html><html lang="en">${iframebox1.contentWindow.document.getElementsByTagName('html')[0].innerHTML}</html>`
					htmlTxt2 = `<!DOCTYPE html><html lang="en">${iframebox2.contentWindow.document.getElementsByTagName('html')[0].innerHTML}</html>`
					if(this.Msg.isWuHanMM){
						param = {
							id:this.Msg.id,
							html:{
								residence:htmlTxt1,
								business:htmlTxt2
							}
						}
					}else{
						param = {
							id:this.Msg.id,
							html:{
								address:htmlTxt2
							}
						}
					}
				}else{
					htmlTxt1 = `<!DOCTYPE html><html lang="en">${iframebox1.contentWindow.document.getElementsByTagName('html')[0].innerHTML}</html>`
					param = {
						id:this.Msg.id,
						html:{
							address:htmlTxt1
						}
					}
				}
				this.param = param;
				this.dialogSub=true
				// this.$ajax.postJSON('/api/contract/updateContractAudit', param).then(res => {
				// 	res=res.data
				// 	if(res.status===200){
				// 		this.fullscreenLoading=false
				// 		this.$message({
				// 			message:'提审成功',
				// 			type:'success'
				// 		})
				// 		if(this.Msg.isHaveData){
				// 			this.$router.push('/contractList');
				// 		}else{
				// 			this.dialogSuccess=true
				// 		}
				// 	}
				// }).catch(error=>{
				// 	this.fullscreenLoading=false
				// 	this.$message({
				// 		message:error,
				// 		type:'error'
				// 	})
				// })
			}
		},
		//确定提审
		toSubmit(){
			// this.fullscreenLoading=true
			loading=this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.5)'
				});
			this.$ajax.postJSON('/api/contract/updateContractAudit', this.param).then(res => {
				res=res.data
				if(res.status===200){
					// this.fullscreenLoading=false
					loading.close()
					this.dialogSub=false
					this.$message({
						message:'提审成功',
						type:'success'
					})
					if(this.Msg.isHaveData){
						this.$router.push('/contractList');
					}else{
						this.dialogSuccess=true
					}
				}
			}).catch(error=>{
				// this.fullscreenLoading=false
				loading.close()
				this.$message({
					message:error,
					type:'error'
				})
			})
		},
		//获取自定义勾选框选中状态
		getCheckState(ele){
			return	!!(ele.querySelector('p').getAttribute('checked'))
		},
    //买卖校验
    dealCheck(iframe,obj=Obj1){
      for(let item in obj){
				let itemType=Object.prototype.toString.call(obj[item])
				if(itemType==='[object Object]'){
					let state=false
					if(obj[item].name==='textarea'){
							state=true
					}else {
						let box=iframe.document.querySelectorAll(`div[name=${obj[item].name}]`)
						let arr=Array.from(box)
						let that=this
						state = arr.every(function (tagItem) {
							// return tagItem.checked===false
							return that.getCheckState(tagItem)===false
						})
					}
					if(state){
						if(obj[item].other){
							let otherState = obj[item].other.every(function (tip) {
								return iframe.document.querySelector(`input[extendparam=${tip}]`).value.length===0
							})
							if(otherState){
								// errorArr2.push({
								// 	type:'input',
								// 	name:obj[item].other[0]
								// })
								errorArr2.push(obj[item].name)
								break
							}
						}else {
							// console.log(obj[item].name,iframe.document.querySelector(`input[name=${obj[item].name}]`).offsetTop,'请勾选')
							errorArr2.push(obj[item].name)
							break
						}
					}else {
						//勾选后判断
						if(obj[item].require){
							let box=iframe.document.querySelectorAll(`div[name=${obj[item].name}]`)
							let detail={}
							switch (obj[item].name){
								case 'acquire':
									if(this.getCheckState(box[0])){
										detail={
											val12:''
										}
									}else {
										detail={
											val15:''
										}
									}
									break
								case 'hasRunsh':
									if(this.getCheckState(box[0])){
										detail={
											val19:''
										}
									}
									break
								case 'setting':
									if(this.getCheckState(box[1])){
										detail={
											val33:'method1'
										}
									}
									break
								case 'thirdparty':
									if(this.getCheckState(box[0])){
										detail={
											val35:'',
										}
									}
									break
								case 'cash':
									if(this.getCheckState(box[0])){
										detail={
											val40:'',
											val45:''
										}
									}else{
										detail={
											val44:'',
											val45:''
										}
									}
									break
								case 'pass':
									if(this.getCheckState(box[0])){
										detail={
											val45:'',
											val46:'',
											val47:''
										}
									}else {
										detail={
											val49:''
										}
									}
									break
								case 'furniture':
									if(this.getCheckState(box[0])){
										detail={
											val62:''
										}
									}
									break
								case 'carport':
									if(this.getCheckState(box[0])){
										detail={
											check:{
												name:'right'
											},
											val67:'',
											val68:''
										}
									}
									break
								case 'psecond':
									if(this.getCheckState(box[0])){
										detail={
											val74:''
										}
									}else{
										detail={
											val78:''
										}
									}
									break
								case 'loanstype':
									if(this.getCheckState(box[0])||this.getCheckState(box[1])||this.getCheckState(box[2])){
										detail={
											val98:'',
											val99:'method4'
										}
									}
									break
								case 'check02':
									if(this.getCheckState(box[0])){
										detail={
											val107:''
										}
									}else {
										detail={
											val109:''
										}
									}
									break
							}
							this.dealCheck(iframe,detail)
						}
				}
				}else {
					let methodDetail={}
					let val=iframe.document.querySelector(`input[extendparam=${item}]`).value
					iframe.document.querySelector(`input[extendparam=${item}]`).classList.remove('BODERRED')
					if(obj[item]==='method1'){
						switch (val.toLowerCase()){
							case 'a':
								methodDetail={
									check:{
										name:'thirdparty',
										require:true
									}
								}
								break
							case 'b':
								methodDetail={
									check:{
										name:'cash',
										require:true
									}
								}
								break
							default:
							errorArr2.push({
									type:'input',
									name:item
							})
						}
						this.dealCheck(iframe,methodDetail)
					}else if(obj[item]==='method2'){
						switch (val.toLowerCase()){
							case 'a':
								break
							case 'b':
								methodDetail={
									check:{
										name:'psecond',
										require:true
									},
									val79:'',
									val80:''
								}
								break
							case 'c':
								methodDetail={
									val81:'',
									val84:''
								}
								break
							case 'd':
								methodDetail={
									val85:'',
									val88:'',
									check1:{
										name:'pthird'
									},
									check2:{
										name:'pfourth'
									}
								}
								break
							default:
							errorArr2.push({
									type:'input',
									name:item
							})
						}
						this.dealCheck(iframe,methodDetail)
					}else if(obj[item]==='method3'){
						switch (val.toLowerCase()){
							case 'a':
								break
							case 'b':
								methodDetail={
									check:{
										name:'loanstype',
										require:true
									}
								}
								break
							default:
							errorArr2.push({
									type:'input',
									name:item
							})
										// reject(`请输入,${item}`)
						}
						this.dealCheck(iframe,methodDetail)
					}else if(obj[item]==='method4'){
						switch (val.toLowerCase()){
							case 'a':
								break
							case 'b':
								methodDetail={
									val100:'',
									val101:''
								}
								break
							case 'c':
								break
							default:
							errorArr2.push({
								type:'input',
								name:item
							})
									// reject(`请输入,${item}`)
						}
						this.dealCheck(iframe,methodDetail)
					}else if(obj[item]==='method5'){
						switch (val.toLowerCase()){
							case 'a':
								methodDetail={
									val125:''
								}
								break
							case 'b':
								methodDetail={
									val126:''
								}
								break
							case 'c':
								methodDetail={
									val127:''
								}
								break
							default:
							errorArr2.push({
									type:'input',
									name:item
							})
						}
						this.dealCheck(iframe,methodDetail)
					}else {
						if(val.length===0){
							errorArr2.push({
								type:'input',
								name:item
						})
							break
						}
					}
				}
      }
      return errorArr2
		},
    //租赁校验
    leaseCheck(iframe,obj=Obj2){
			for(let item in obj){
				let itemType=Object.prototype.toString.call(obj[item])
				if(itemType==='[object Object]'){
						let state=false
						if(obj[item].name==="textarea"){
								state=true
						}else{
								let box=iframe.document.querySelectorAll(`div[name=${obj[item].name}]`)
								let arr=Array.from(box)
								let list=['facility','zhizhao9','zhizhao10','zhizhao11','zhizhao12','zhizhao15','zhizhao16','remote']
								let that=this
								if(!list.includes(obj[item].name)){
										state = arr.every(function (item) {
												return that.getCheckState(item)===false
										})
								}
						}
						if(state){
								if(obj[item].other){
										let otherState = obj[item].other.every(function (tip) {
												return iframe.document.querySelector(`input[extendparam=${tip}]`).value.length===0
										})
										if(otherState){
												errorArr1.push(obj[item].name)
												break
										}
								}else {
										// console.log(obj[item].name,iframe.document.querySelector(`input[name=${obj[item].name}]`).offsetTop,'请勾选')
										errorArr1.push(obj[item].name)
										break
								}
						}else{
								//勾选后判断
								// debugger
							if(obj[item].require){
									let box=iframe.document.querySelectorAll(`div[name=${obj[item].name}]`)
									let detail={}
									switch (obj[item].name){
										case 'zhizhao9':
											if(this.getCheckState(box[box.length-1])){
												detail={
													val114:''
												}
											}
											break
										case 'zhizhao10':
											if(this.getCheckState(box[box.length-1])){
												detail={
													val119:''
												}
											}
											break
										case 'facility':
											if(this.getCheckState(box[box.length-1])){
												detail={
													val51:''
												}
											}
											break
										case 'zhizhao11':
											if(this.getCheckState(box[box.length-1])){
												detail={
													val125:''
												}
											}
											break
										case 'zhizhao12':
											if(this.getCheckState(box[box.length-1])){
												detail={
													val130:''
												}
											}
											break
										case 'zhizhao15':
											if(this.getCheckState(box[box.length-1])){
												detail={
													val139:''
												}
											}
											break
										case 'zhizhao16':
											if(this.getCheckState(box[0])){
												detail={
													val148:''
												}
											}
											break
										case 'remote':
											if(this.getCheckState(box[0])){
												detail.val141=''
											}
											if(this.getCheckState(box[1])){
												detail.val143=''
											}
											if(this.getCheckState(box[2])){
												detail.val145=''
											}
											break
										case 'zhizhao4':
											if(this.getCheckState(box[box.length-1])){
												detail={
													val32:''
												}
											}
											break
										case 'zhizhao5':
											if(this.getCheckState(box[0])){
												detail={
													val40:''
												}
											}
											if(this.getCheckState(box[2])){
												detail={
													val41:''
												}
											}
											break
									}
									this.leaseCheck(iframe,detail)
							}
						}
				}else {
					obj[item]=iframe.document.querySelector(`input[extendparam=${item}]`).value
					iframe.document.querySelector(`input[extendparam=${item}]`).classList.remove('BODERRED')
					if(obj[item].length===0){
						errorArr1.push({
							type:'input',
							name:item
						})
						break
					}
				}
			}
			return errorArr1
    },
    // 代办校验
    commissionCheck(iframe,obj=Obj3){
        for(let item in obj){
            let itemType=Object.prototype.toString.call(obj[item])
            // console.log(itemType)
            if(itemType==='[object Object]'){
                let box=iframe.document.querySelectorAll(`div[name=${obj[item].name}]`)
                let arr=Array.from(box)
                let state = true
                let that = this
                if(obj[item].name==="owner"||obj[item].name==="guest"){
                    state=false
                }else{
                    state = arr.every(function (item) {
                    return that.getCheckState(item)===false
                    })
                }
                if(state){
                    if(obj[item].other){
                        let otherState = obj[item].other.every(function (tip) {
                            return iframe.document.querySelector(`input[extendparam=${tip}]`).value.length===0
                        })
                        if(otherState){
                           errorArr1.push({
                                type:'input',
                                name:obj[item].other[0]
                            })
                            break
                        }
                    }else {
                        // console.log(document.querySelector(`input[name=${obj[item].name}]`).offsetTop,'请勾选')
                        errorArr1.push(obj[item].name)
                        break
                    }
                }else {
                  //勾选后判断
                  if(obj[item].require){
                      let box=Array.from(iframe.document.querySelectorAll(`div[name=${obj[item].name}]`))
                      let detail={}
                      switch (obj[item].name){
                          case 'owner':
                            box.forEach(element => {
                                if(this.getCheckState(element)){
																	let brother=element.parentElement.querySelector("input[type='text']")
																	let spanTag = element.parentElement.querySelector("span")
																	if(spanTag){
																		spanTag.classList.remove('WARNING')
																	}else{
																		brother.classList.remove('BODERRED')
																	}
																	if(brother.value.length===0){
																		if(spanTag){
																			spanTag.classList.add('WARNING')
																		}
																		errorArr1.push({
																				type:'input',
																				name:brother.getAttribute('extendparam')
																		})
																	}
                                }
                            });
                              break
                          case 'guest':
                            box.forEach(element => {
                                if(this.getCheckState(element)){
																	let brother=element.parentElement.querySelector("input[type='text']")
																	let spanTag = element.parentElement.querySelector("span")
																	if(spanTag){
																		spanTag.classList.remove('WARNING')
																	}else{
																		brother.classList.remove('BODERRED')
																	}
																	if(brother.value.length===0){
																		if(spanTag){
																			spanTag.classList.add('WARNING')
																		}
																		errorArr1.push({
																				type:'input',
																				name:brother.getAttribute('extendparam')
																		})
																	}
                                }
                            });
                            break
                      }
                  }
              }
            }else {
                let val=iframe.document.querySelector(`input[extendparam=${item}]`).value
                iframe.document.querySelector(`input[extendparam=${item}]`).classList.remove('BODERRED')
                if(val.length===0){
                    errorArr1.push({
                        type:'input',
                        name:item
                    })
                    break
                }
                }
            }
        return errorArr1
    },
    //意向校验
    agreementCheck(iframe,obj=Obj4){
         for (let item in obj) {
            obj[item] = iframe.document.querySelector(`input[extendparam=${item}]`).value
            iframe.document.querySelector(`input[extendparam=${item}]`).classList.remove('BODERRED')
            if (obj[item].length === 0) {
                errorArr1.push({
                    type:'input',
                    name:item
                })
                break
            }
        }
        return errorArr1
    },
    //定金校验
    depositAgreementCheck(iframe,obj=Obj5){
        for(let item in obj){
            let itemType=Object.prototype.toString.call(obj[item])
            // console.log(itemType)
            if(itemType==='[object Object]'){
                let state=false
                if(obj[item].name==='textarea'){
                    state=true
                }else {
                    let box=iframe.document.querySelectorAll(`div[name=${obj[item].name}]`)
                    let arr=Array.from(box)
                    let that = this
                    state = arr.every(function (item) {
                        return that.getCheckState(item)===false
                    })
                }
                if(state){
                    if(obj[item].other){
                        let otherState = obj[item].other.every(function (tip) {
                            return iframe.document.querySelector(`input[extendparam=${tip}]`).value.length===0
                        })
                        if(otherState){
                            if(obj[item].name==='textarea'){
                                errorArr1.push({
                                    type:'input',
                                    name:obj[item].other[0]
                                })
                            }else {
                                errorArr1.push(obj[item].name)
                            }
                            break
                        }
                    }else {
                        // console.log(document.querySelector(`input[name=${obj[item].name}]`).offsetTop,'请勾选')
                        errorArr1.push(obj[item].name)
                        break
                    }
                }
            }else {
                obj[item]=iframe.document.querySelector(`input[extendparam=${item}]`).value
                iframe.document.querySelector(`input[extendparam=${item}]`).classList.remove('BODERRED')
                if(obj[item].length===0){
                    errorArr1.push({
                        type:'input',
                        name:item
                    })
                    break
                }
            }
        }
        return errorArr1
    },
    //居间校验
    brokerageCheck(iframe,obj=Obj6){
				for(let item in obj){
						obj[item]=iframe.document.querySelector(`input[extendparam=${item}]`).value
						iframe.document.querySelector(`input[extendparam=${item}]`).classList.remove('BODERRED')
            if(obj[item].length===0){
                errorArr1.push({
                    type:'input',
                    name:item
                })
                break
            }
        }
        return errorArr1
    }
	},
	// beforeDestroy(){
	// 	console.log(document.body)
	// 	this.isSave(2)
	// },
  mounted(){
		var iframe1 = this.$refs.iframeFirst;
		var iframe2 = this.$refs.iframeSecond;
		var that = this
		if(this.Msg.type===2){
			if(this.Msg.isWuHanMM){
				iframe2.onload=function(){
					that.iframe2State=true
				}
				iframe1.onload=function(){
					that.iframe1State=true
				}
			}else{
				iframe2.onload=function(){
					that.isSave(2)
				}
			}
		}else{
			iframe1.onload=function(){
				that.isSave(2)
			}
		}
		window.onresize = this.clientHeight;
  },
  beforeUpdate() {
    this.clientHeight();
	},
	computed:{
		iframeState:function(val){
			return this.iframe1State&&this.iframe2State
		}
	},
	watch:{
		iframeState:function(val){
			if(val){
				this.isSave(2)
			}
		}
	}
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.view-container{
  position: relative;
  // text-align: center;
  .top{
    height: 50px;
  }
  .type {
    width: 200px;
    height: 36px;
    align-items: center;
    box-sizing: border-box;
    border: 2px solid @color-blue;
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    > div {
      width: 50%;
      height: 36px;
      line-height: 36px;
      text-align: center;
      font-size: 14px;
      color: @color-blue;
      cursor: pointer;
    }
    .active {
      background: @color-blue;
      color: @color-white;
    }
  }
  .contentBox{
    margin-top: 20px;
    display: flex;
    justify-content: center;
    .nav{
      text-align: left;
      font-size: 16px;
      visibility: hidden;
      >ul{
        padding: 10px;
        border: 1px solid #ccc;
      }
      span{
        cursor: pointer;
        line-height: 1.6;
      }
      .navBlue{
          color:@color-blue
      }
    }
    .hid{
      visibility: initial;
    }
    iframe{
      width: 870px;
    }
    .btn{
      margin-right: 160px;
      margin-left: 20px;
      box-sizing: border-box;
      padding-top: 200px;
      /deep/.is-round{
        margin-bottom: 20px;
      }
    }
    .huojian{
			display: inline-block;
			width: 75px;
			text-align: center;
			cursor: pointer;
    }
  }
}
</style>