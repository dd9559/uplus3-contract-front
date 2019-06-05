import {contractConfig} from "./base.js"
let obj = {
  val6:'',
  check1:{
    name:'proveType',
    require:true
  },
  val11:'',
  check2:{
    name:'isPledge'
  },
  val12:'',
  val13:'',
  val14:'',
  val15:'',
  val16:'',
  val17:'',
  val18:'',
  val19:'',
  check3:{
    name:'methodType'
  },
  val22:'',
  check4:{
    name:'payType'
  },
  val23:'',
  val24:'',
  val25:'',
  val26:'',
  val27:'',
  val29:'',
  val30:'',
  check5:{
    name:'payType1'
  },
  val31:'',
  val32:'',
  check6:{
    name:'payType2'
  },
  val33:'',
  val36:'',
  val37:'',
  val38:'',
  val39:'',
  val40:'',
}
let errorArr=[]

function getCheckState(ele){
  return	!!(ele.querySelector('p').getAttribute('checked'))
}

//给按钮添加点击事件
let mainBtn=document.querySelector('#submit');
if(mainBtn){
  mainBtn.addEventListener('click',function(e){
    submit(e,Obj1,true)
  })
}else{
  let btn=document.createElement('span')
  btn.id='submit'
  btn.style.display='none'
  btn.innerHTML='click'
  document.body.appendChild(btn)
  btn.addEventListener('click',function(e){
    submit(e,Obj1,true)
  })
}

//初始化时间控件
Calendar.create({
  classN: 'calendar-item',
  callBack: function(bindElem, dateObj) {
    if(bindElem.tagName.toLowerCase()==='input'){
      bindElem.value=`${dateObj.year}年${dateObj.month}月${dateObj.date}日`
      bindElem.setAttribute('value',bindElem.value)
      bindElem.setAttribute('random',dateObj.random)
    }
  }
})

//输入自适应
contractConfig.inputListener(function(ev,tip){
  let max=tip.target.getAttribute('max')
  let textArea=document.getElementById('inputArea')
  if(max){//监听max属性，判断文本框是有有输入长度限制
    textArea.setAttribute('maxLength',parseInt(max))
  }else {
    textArea.removeAttribute('maxLength')
  }
  //监听listen属性，判断是否有输入类型限制
  let spanAttr=tip.target.getAttribute('listen')
  if(spanAttr==='number'){
    ev.target.value=ev.target.value.replace(/[^\d]/g, "")
    let toChineseArr = ['val22','val25','val30','val32']
    let chineseStr = tip.target.getAttribute('extendparam')
    if(toChineseArr.includes(chineseStr)){
        document.querySelector(`*[extendparam=${chineseStr}_add]`).innerHTML = toChineseNumber(ev.target.value)
    }
  }
  if(spanAttr==='chinese'){
    ev.target.value=ev.target.value.replace(/[^\d]/g, "")
    if(ev.target.value.length>0){
    let str = toChineseNumber(ev.target.value)
    let value=str.split('元')[0]
    tip.target.innerHTML=value
    }else {
    tip.target.innerHTML=''
    tip.target.classList.add('input-before')
    }
  }else {
    tip.target.innerHTML=ev.target.value
  }
},function(tip){
  //获取输入框的默认值
  let initVal=tip.target.innerHTML
  let ArrCn = ['val6','val8','val10']
  let strCn = tip.target.getAttribute('extendparam')
  if(initVal.length>0){
    document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal)
  }else{
    if(ArrCn.includes(strCn)){
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
    }  
  }
})

// 勾选框逻辑
contractConfig.checkboxListener(function(){},function(obj,index){
  if(obj.currentTarget.getAttribute('name')==='proveType'){
    console.log('111')
    document.querySelector(`span[extendparam="val9"]`).innerHTML=''
    document.querySelector(`span[extendparam="val10"]`).innerHTML=''
    document.querySelector(`span[extendparam="val9"]`).classList.add("input-before")
    document.querySelector(`span[extendparam="val10"]`).classList.add("input-before")
    let proveTypeDoms = document.getElementsByName("proveType")
    debugger
    if(proveTypeDoms[0].querySelector('p').getAttribute('checked')==='true'){
        document.querySelector(`span[extendparam="val10"]`).setAttribute('systemParam','true')
    }else{
        document.querySelector(`span[extendparam="val10"]`).removeAttribute('systemParam')
    }
  }
})

//基础数据赋值
// let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
let msg = {
  code: "Z0001190604004",
  commissionPayment: 0,
  companyNames: ["森林小镇二店"],
  custCommission: 0,
  custCommissionUpper: "零",
  custEnsure: 0,
  ownerCardType:'身份证',
  ownerCardTypes:'护照、营业执照',
  guestCardType:'护照',
  guestCardTypes:'',
  dealPrice: 3265,
  dealPriceUpper: "叁仟贰佰陆拾伍",
  guestID: "456321199111111111",
  guestIDs: "",
  guestName: "撒的发生",
  guestNames: "",
  guestTel: "13071291915",
  guestTels: "",
  guestinfoCode: "CSXD000064",
  houseinfoCode: "ZB83XZYD000472",
  id: 1977,
  isHaveData: 0,
  isWuHanMM: 0,
  moneyUnit: "元",
  otherCooperationCost: 0,
  ownerCommission: 12312,
  ownerCommissionUpper: "壹万贰仟叁佰壹拾贰",
  ownerID: "123123123",
  ownerIDs: "456321199111111112、45465465464654646465",
  ownerName: "梵蒂冈",
  ownerNames: "ss、aa",
  ownerTel: "11320568832",
  ownerTels: "13222222222、13211111111",
  propertyAddr: "合肥市好尬是大将军奥斯卡的",
  propertyCard: "",
  remarks: "",
  signDate: 1559577600000,
  square: 102,
  squareUse: 0,
  subscriptionPrice: 0,
  subscriptionPriceUpper: "零",
  timeUnit: "月",
  type: 1
}
for(let readonlyItem in msg){
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
  let arr= []
  if(readonlyItem==='signDate'){
    let time = new Date(msg.signDate)
    arr.push(time.getFullYear())
    arr.push(time.getMonth()+1)
    arr.push(time.getDate())
  }
  if(readonlyItem==="companyNames"){
    if(msg[readonlyItem].length>0){
      let companyName = document.querySelector(`*[extendParam="val6"]`)
      let companyNameTxt = msg[readonlyItem].join(',')
      companyName.setAttribute('list',companyNameTxt)
    }
  }
  if(onlyReadDom.length>0){
    onlyReadDom.forEach((element,index) => {
      if(readonlyItem==='signDate'){
        element.setAttribute('value', arr[index])
      }else if(readonlyItem==='ownerName'){
        if(msg['ownerNames']){
          let names = msg['ownerName']+'、'+msg['ownerNames']
          element.innerHTML = names
        }else{
          element.innerHTML = msg['ownerName']
        }
      }else if(readonlyItem==='ownerID'){
        if(msg['ownerIDs']){
          let types = msg['ownerID']+'、'+msg['ownerIDs']
          element.innerHTML = types
        }else{
          element.innerHTML = msg['ownerID']
        }
      }else if(readonlyItem==='ownerCardType'){
        if(msg['ownerCardTypes']){
          let types = msg['ownerCardType']+'、'+msg['ownerCardTypes']
          element.innerHTML = types
        }else{
          element.innerHTML = msg['ownerCardType']
        }
      }else if(readonlyItem==='guestName'){
        if(msg['guestNames']){
          let names = msg['guestName']+'、'+msg['guestNames']
          element.innerHTML = names
        }else{
          element.innerHTML = msg['guestName']
        }
      }else if(readonlyItem==='guestID'){
        if(msg['guestIDs']){
          let types = msg['guestID']+'、'+msg['guestIDs']
          element.innerHTML = types
        }else{
          element.innerHTML = msg['guestID']
        }
      }else if(readonlyItem==='guestCardType'){
        if(msg['guestCardTypes']){
          let types = msg['guestCardType']+'、'+msg['guestCardTypes']
          element.innerHTML = types
        }else{
          element.innerHTML = msg['guestCardType']
        }
      }else if(readonlyItem==='propertyAddr'){
        if(element.getAttribute("extendParam")==="val7"){
          let value = msg["propertyAddr"]
          if(value.substring(0,3)==="合肥市"){
            element.innerHTML=value.replace("合肥市",'')
          }else{
            element.innerHTML=value
          }
        }else{
          element.innerHTML=msg[readonlyItem]
        }
      }else if(readonlyItem==='timeUnit'){
        element.querySelector('p').removeAttribute('checked')
        if(element.getAttribute('value')===msg[readonlyItem]){
            element.querySelector('p').setAttribute('checked', 'true')
        }
      }else{
        element.innerHTML=msg[readonlyItem]
      }
      element.classList.remove('input-before')
    });
  }
}