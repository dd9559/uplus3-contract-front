<template>
  <div class="view-container">
    <div class="top">
      <div class="type" v-if="isShowType">
        <div :class="{'active':isActive===1}" @click="changeType(1)">居间合同</div>
        <div :class="{'active':isActive===2}" @click="changeType(2)">买卖合同</div>
      </div>
    </div>
    <div class="contentBox">
      <div class="nav" :class="{'hid':isShowType&&isActive===2}">
        <ul>
          <li><span @click="goNav('#one_')">第一条、房屋基本情况</span></li>
          <li><span @click="goNav('#two_')">第二条、房屋交易流程</span></li>
          <li><span @click="goNav('#three_')">第三条、房屋权属情况</span></li>
          <li><span @click="goNav('#four_')">第四条、成交方式</span></li>
          <li><span @click="goNav('#five_')">第五条、房产转让价格</span></li>
          <li><span @click="goNav('#six_')">第六条、付款约定</span></li>
          <li><span @click="goNav('#seven_')">第七条、房屋产权及具体状况的承诺</span></li>
          <li><span @click="goNav('#eight_')">第八条、房产过户</span></li>
          <li><span @click="goNav('#nine_')">第九条、房产交付</span></li>
          <li><span @click="goNav('#ten_')">第十条、户口迁移及学籍、学位</span></li>
          <li><span @click="goNav('#eleven_')">第十一条 、违约责任</span></li>
          <li><span @click="goNav('#twelve_')">第十二条、不可抗力</span></li>
          <li><span @click="goNav('#thirteen_')">第十三条、其他</span></li>
          <li><span @click="goNav('#fourteen_')">第十四条、争议解决</span></li>
          <li><span @click="goNav('#fifteen_')">第十五条、生效要件</span></li>
        </ul>
      </div>
      <iframe :src="src1" frameborder="0" ref='iframeFirst' :style="{ height: clientHei }" v-show="isActive===1"></iframe>
      <iframe :src="src2" frameborder="0" ref='iframeSecond' :style="{ height: clientHei }" v-show="isActive===2"></iframe>
      <div class="btn">
        <el-button round @click="isSave(1)" v-loading.fullscreen.lock="fullscreenLoading">保存</el-button><br>
        <el-button type="primary" round @click="submit" v-loading.fullscreen.lock="fullscreenLoading">提审</el-button>
      </div>
    </div>
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
    val53:'',
    val54:'',
    val55:'',
    val56:'',
    val57:'',
    val58:'',
    val59:'',
    val60:'',
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
    check13:{
        name:'check01'
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
    val124:'method5',
    val128:'',
    val129:'',
    val130:'',
    val131:'',
    val132:'',
    val138:'',
}
//租赁
let Obj2 = {
    check1:{
        name:'zhizhao'
    },
    val6:'',
    check2:{
        name:'zhizhao2'
    },
    val13:'',
    check3:{
        name:'zhizhao3'
    },
    val21:'',
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
        name:'zhizhao5'
    },
    val40:'',
    val41:'',
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
    val54:'',
    val55:'',
    val56:'',
    val57:'',
    val58:'',
    val59:'',
    val60:'',
    val61:'',
    val62:'',
    val63:'',
    val64:'',
    val65:'',
    val66:'',
    // check7:{
    //     name:'zhizhao7'
    // },
    val73:'',
    val74:'',
    check8:{
        name:'zhizhao8'
    },
    val79:'',
    val80:'',
    val81:'',
    val82:'',
    val83:'',
    val84:'',
    val86:'',
    val87:'',
    val88:'',
    val89:'',
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
    val6:'',
    val7:'',
    val8:'',
    val9:'',
    val10:'',
    val11:'',
    val12:'',
    val13:'',
    check1:{
        name:'manage'
    },
    val16:'',
    val17:'',
    val18:'',
    val19:'',
    val20:'',
    val21:'',
    val22:'',
    val23:'',
    val24:'',
    val25:'',
    val26:'',
    val27:'',
    val28:'',
    val29:'',
    val30:'',
    val31:'',
    val32:'',
    check2:{
        name:'pay',
        other:['val35','val36'],//勾选框的补充项
    },
    val37:'',
    val38:'',
    val39:'',
    val40:'',
    val41:'',
    val42:'',
    check3:{
        name:'person'
    }
}
//居间
let Obj6 = {
    val3:'',
    val8:'',
    val10:'',
    val12:''
}
let errorArr1=[]
let errorArr2=[]
export default {
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
			fullscreenLoading:false
    }
  },
  created(){
    // http://localhost:8080/api/contract/showHtml?id=327&type=residence
    this.clientHeight();
    this.Msg = JSON.parse(localStorage.getItem("contractMsg"));
    console.log(window.location.origin)
    let http = window.location.origin
    
    if(this.Msg.type===1){
      //租赁
      this.src1=`${http}/api/contract/showHtml?id=${this.Msg.id}&type=address`
    }else if(this.Msg.type===2){
      //买卖
      this.isShowType=true;
      this.src1=`${http}/api/contract/showHtml?id=${this.Msg.id}&type=residence`//居间
      this.src2=`${http}/api/contract/showHtml?id=${this.Msg.id}&type=business`//买卖
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
    // this.isHaveHtml=parseInt(this.$route.query.isHaveHtml);

    // if(this.isHaveHtml===1){
    //   this.htmlPath = JSON.parse(localStorage.getItem("htmlPath"));
		// }
		// this.isSave(2)
  },
  methods: {
    getHtml(param){
      // this.$ajax.get('/api/contract/showHtml',param).then(res=>{

      // })
    },
    // 控制弹框body内容高度，超过显示滚动条
    clientHeight() {        
      this.clientHei= document.documentElement.clientHeight -150 + 'px'
    },
    //居间买卖切换
    changeType(value) {
      this.isActive = value;
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
      let iframebox=this.$refs.iframeSecond
      iframebox.contentWindow.document.querySelector(id).click()

    },
    isSave(operation){
			// console.log(this.gethtml)
			// debugger
			this.fullscreenLoading=true
			var param={};
			var isFull=0;//合同是否填写完整
			let iframebox1=this.$refs.iframeFirst
			let iframebox2=this.$refs.iframeSecond
			let htmlTxt1 = `<!DOCTYPE html><html lang="en">${iframebox1.contentWindow.document.getElementsByTagName('html')[0].innerHTML}</html>`
			let htmlTxt2 = `<!DOCTYPE html><html lang="en">${iframebox2.contentWindow.document.getElementsByTagName('html')[0].innerHTML}</html>`
			
			errorArr1=[]
			errorArr2=[]
			if(this.Msg.type===2){
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
					this.fullscreenLoading=false
					if(operation===1){
						this.$message({
							message:'保存成功',
							type:'success'
						})
					}
				}
      }).catch(error=>{
				this.fullscreenLoading=false
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
							inputHeight1 = iframebox1.contentWindow.document.querySelector(`input[extendparam=${emptyInput1[0].name}]`).offsetTop
						}else{
							inputHeight1 = iframebox1.contentWindow.document.querySelector(`input[name=${emptyInput1[0]}]`).offsetTop
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
							inputHeight2 = iframebox2.contentWindow.document.querySelector(`input[extendparam=${emptyInput2[0].name}]`).offsetTop
						}else{
							inputHeight2 = iframebox2.contentWindow.document.querySelector(`input[name=${emptyInput2[0]}]`).offsetTop
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
			}else{
				let emptyInput1=0
				if(this.Msg.type===1){//租赁
					emptyInput1 = this.leaseCheck(iframebox1.contentWindow)
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
						inputHeight1 = iframebox1.contentWindow.document.querySelector(`input[extendparam=${emptyInput1[0].name}]`).offsetTop
					}else{
						inputHeight1 = iframebox1.contentWindow.document.querySelector(`input[name=${emptyInput1[0]}]`).offsetTop
					}
					iframebox1.contentWindow.scrollTo(0,inputHeight1)
				}
			}
      if(errorArr1.length===0&&errorArr2.length===0){
				this.fullscreenLoading=true
				let htmlTxt1=''
				let htmlTxt2=''
				let param = {}
				if(this.Msg.type===2){
					htmlTxt1 = `<!DOCTYPE html><html lang="en">${iframebox1.contentWindow.document.getElementsByTagName('html')[0].innerHTML}</html>`
					htmlTxt2 = `<!DOCTYPE html><html lang="en">${iframebox2.contentWindow.document.getElementsByTagName('html')[0].innerHTML}</html>`
					param = {
						id:this.Msg.id,
						html:{
							residence:htmlTxt1,
            	business:htmlTxt2
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
				this.$ajax.postJSON('/api/contract/updateContractAudit', param).then(res => {
					res=res.data
					if(res.status===200){
						this.fullscreenLoading=false
						this.$message({
							message:'提审成功',
							type:'success'
						})
					}
				}).catch(error=>{
					this.fullscreenLoading=false
					this.$message({
						message:error,
						type:'error'
					})
				})
			}
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
                    let box=iframe.document.querySelectorAll(`input[name=${obj[item].name}]`)
                    let arr=[...box]
                    state = arr.every(function (tagItem) {
                        return tagItem.checked===false
                    })
                }
                if(state){
                    if(obj[item].other){
                        let otherState = obj[item].other.every(function (tip) {
                            return iframe.document.querySelector(`input[extendparam=${tip}]`).value.length===0
                        })
                        if(otherState){
                          errorArr2.push({
														type:'input',
														name:obj[item].other[0]
													})
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
                        let box=iframe.document.querySelectorAll(`input[name=${obj[item].name}]`)
                        let detail={}
                        switch (obj[item].name){
                            case 'acquire':
                                if(box[0].checked){
                                    detail={
                                        val12:'',
                                        val13:''
                                    }
                                }else {
                                    detail={
                                        val15:'',
                                        check:{
                                            name:'trader'
                                        }
                                    }
                                }
                                break
                            case 'hasRunsh':
                                if(box[0].checked){
                                    detail={
                                        val19:''
                                    }
                                }
                                break
                            case 'setting':
                                if(box[1].checked){
                                    detail={
                                        val33:'method1'
                                    }
                                }
                                break
                            case 'thirdparty':
                                if(box[0].checked){
                                    detail={
                                        val35:'',
                                        val36:'',
                                        val37:''
                                    }
                                }
                                break
                            case 'cash':
                                if(box[0].checked){
                                    detail={
                                        val40:'',
                                        val41:'',
                                        val42:''
                                    }
                                }
                                break
                            case 'pass':
                                if(box[0].checked){
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
                                if(box[0].checked){
                                    detail={
                                        val62:''
                                    }
                                }
                                break
                            case 'carport':
                                if(box[0].checked){
                                    detail={
                                        check:{
                                            name:'right'
                                        },
                                        val67:'',
                                        val68:''
                                    }
                                }
                                break
                            case 'payb':
                                if(box[0].checked){
                                    detail={
                                        val74:'',
                                        val75:'',
                                        val76:''
                                    }
                                }else{
                                    detail={
                                        val78:''
                                    }
                                }
                                break
                            case 'loanstype':
                                if(box[2].checked){
                                    detail={
                                        val98:'',
                                        val99:'method4'
                                    }
                                }
                                break
                            case 'check02':
                                if(box[0].checked){
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
                if(obj[item]==='method1'){
                    switch (val){
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
                        case 'c':
                            methodDetail={
                                check:{
                                    name:'pass',
                                    require:true
                                },
                                val50:''
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
                    switch (val){
                        case 'a':
                            break
                        case 'b':
                            methodDetail={
                                check:{
                                    name:'payb',
                                    require:true
                                },
                                val79:'',
                                val80:''
                            }
                            break
                        case 'c':
                            methodDetail={
                                val81:'',
                                val82:'',
                                val83:'',
                                val84:''
                            }
                            break
                        case 'd':
                            methodDetail={
                                val85:'',
                                val86:'',
                                val87:'',
                                val88:'',
                                check1:{
                                    name:'payd'
                                },
                                check2:{
                                    name:'payd1'
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
                }else if(obj[item]==='method3'){
                    switch (val){
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
                    switch (val){
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
                    switch (val){
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
                   let box=iframe.document.querySelectorAll(`input[name=${obj[item].name}]`)
                   let arr=[...box]
                   let list=['facility','zhizhao9','zhizhao10','zhizhao11','zhizhao12','zhizhao15','zhizhao16','remote']
                   if(!list.includes(obj[item].name)){
                        state = arr.every(function (item) {
                            return item.checked===false
                        })
                   }
                }
                if(state){
                    // debugger
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
                        // console.log(obj[item].name,iframe.document.querySelector(`input[name=${obj[item].name}]`).offsetTop,'请勾选')
                        errorArr1.push(obj[item].name)
                        break
                    }
                }else{
                    //勾选后判断
                  if(obj[item].require){
                      let box=iframe.document.querySelectorAll(`input[name=${obj[item].name}]`)
                      let detail={}
                      switch (obj[item].name){
                          case 'zhizhao9':
                            if(box[box.length-1].checked){
                                detail={
                                    val114:''
                                }
                            }
                              break
                          case 'zhizhao10':
                          if(box[box.length-1].checked){
                                detail={
                                    val119:''
                                }
                            }
                            break
                        case 'facility':
                          if(box[box.length-1].checked){
                                detail={
                                    val51:''
                                }
                            }
                            break
                        case 'zhizhao11':
                          if(box[box.length-1].checked){
                                detail={
                                    val125:''
                                }
                            }
                            break
                        case 'zhizhao12':
                          if(box[box.length-1].checked){
                                detail={
                                    val130:''
                                }
                            }
                            break
                        case 'zhizhao15':
                          if(box[box.length-1].checked){
                                detail={
                                    val139:''
                                }
                            }
                            break
                        case 'zhizhao16':
                          if(box[0].checked){
                                detail={
                                    val148:''
                                }
                            }
                            break
                        case 'remote':
                          if(box[0].checked){
                                detail.val141=''
                            }
                            if(box[1].checked){
                                detail.val143=''
                            }
                            if(box[2].checked){
                                detail.val145=''
                            }
                            break
                        case 'zhizhao4':
                        if(box[box.length-1].checked){
                                detail={
                                    val32:''
                                }
                            }
                            break
                      }
                      this.leaseCheck(iframe,detail)
                  }
                }
            }else {
                obj[item]=iframe.document.querySelector(`input[extendparam=${item}]`).value
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
                let box=iframe.document.querySelectorAll(`input[name=${obj[item].name}]`)
                let arr=[...box]
                let state = true
                if(obj[item].name==="owner"||obj[item].name==="guest"){
                    state=false
                }else{
                    state = arr.every(function (item) {
                    return item.checked===false
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
                      let box=iframe.document.querySelectorAll(`input[name=${obj[item].name}]`)
                      let detail={}
                      switch (obj[item].name){
                          case 'owner':
                            box.forEach(element => {
                                if(element.checked){
                                    let brother=element.parentElement.querySelector("input[type='text']")
                                    if(brother.value.length===0){
                                        errorArr1.push(brother.getAttribute('extendparam'))
                                    }
                                }
                            });
                              break
                          case 'guest':
                            box.forEach(element => {
                                if(element.checked){
                                    let brother=element.parentElement.querySelector("input[type='text']")
                                    if(brother.value.length===0){
                                        errorArr1.push(brother.getAttribute('extendparam'))
                                    }
                                }
                            });
                            break
                      }
                  }
              }
            }else {
                let val=iframe.document.querySelector(`input[extendparam=${item}]`).value
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
                    let box=iframe.document.querySelectorAll(`input[name=${obj[item].name}]`)
                    let arr=[...box]
                    state = arr.every(function (item) {
                        return item.checked===false
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
                }
            }else {
                obj[item]=iframe.document.querySelector(`input[extendparam=${item}]`).value
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
	destroyed(){
		// this.isSave(2)
	},
  mounted(){
    window.onresize = this.clientHeight;
    var vibibleState ='';
    var visibleChange ='';
    if (typeof document.visibilityState !='undefined') {
      visibleChange ='visibilitychange';
      vibibleState ='visibilityState';
    }else if (typeof document.webkitVisibilityState !='undefined') {
      visibleChange ='webkitvisibilitychange';
      vibibleState ='webkitVisibilityState';
    }if (visibleChange) {
			let that=this
      document.addEventListener(visibleChange, function() {if (document[vibibleState] =='hidden') {
				// that.isSave(2)
				// alert('页面可见');
				console.log(document[vibibleState])}})
    }
  },
  beforeUpdate() {
    this.clientHeight();
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
      span{
        cursor: pointer;
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
  }
}
</style>