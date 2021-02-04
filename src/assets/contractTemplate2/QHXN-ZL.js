import {contractConfig,toChineseNumber,formatMoney} from "./base.js"
let Obj = {
  cn_arr:[]
}
let sub = {
  'val5': null,
  'val6': null,
  'val7': null,
  'val8': null,
  'val9': null,
  'val10': null,
  'checkbox_facility': null,
  'val11': null,
  'val12': null,
  'drapdown_val36': null,
  'val29': null,
  'val30': null,
  'val34': null,
  'val35': null,
}


//给按钮添加点击事件
let mainBtn=document.querySelector('#submit');
if(mainBtn){
  mainBtn.addEventListener('click',function(e){
    contractConfig.submit(e,sub,'templateError')
  })
}else{
  let btn=document.createElement('span')
  btn.id='submit'
  btn.style.display='none'
  btn.innerHTML='click'
  document.body.appendChild(btn)
  btn.addEventListener('click',function(e){
    contractConfig.submit(e,sub,'templateError')
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
  if (spanAttr === "number") {
    let cn_str = tip.target.getAttribute('extendparam')
    if (Obj['cn_arr'].includes(cn_str) || max == 16) {
      ev.target.value = ev.target.value.replace(/[^\d.]/g,"");
      ev.target.value = ev.target.value.replace(/^\./g,"");
      ev.target.value = ev.target.value.replace(/\.{2,}/g,".");
      ev.target.value = ev.target.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
      ev.target.value = ev.target.value.replace(/^(\-)*(\d+)\.(\d{0,2}).*$/,'$1$2.$3');
    } else {
      ev.target.value=ev.target.value.replace(/[^\d]/g, "")
    }
    tip.target.innerHTML = ev.target.value
    if(Obj['cn_arr'].includes(cn_str) || max == 16){

      if (ev.target.value.indexOf(",") != -1) {
        ev.target.value = ev.target.value.replace(/,/g, '')
      }
      let index = toChineseNumber(ev.target.value).indexOf('元')
      if (tip.target.getAttribute('money')) {
        document.querySelector(`*[extendParam=${cn_str}]`).innerHTML = toChineseNumber(ev.target.value).substring(0, index)+toChineseNumber(ev.target.value).substr(index)
      } else {
        document.querySelector(`*[extendParam=${cn_str}_add]`).innerHTML = toChineseNumber(ev.target.value).substring(0, index)+toChineseNumber(ev.target.value).substr(index)
      }
      if (ev.target.value.indexOf(",") == -1) {
        document.querySelector(`*[extendParam=${cn_str}]`).innerHTML = formatMoney(ev.target.value)
      }
    }
}
},function(tip){
  //获取输入框的默认值
  let initVal=tip.target.innerHTML
  let strCn = tip.target.getAttribute('extendparam')
  let max=tip.target.getAttribute('max')
  if(Obj['cn_arr'].includes(strCn) || max == 16){
    if(initVal.length>0){
        if (initVal.indexOf(",") != -1) {
        initVal = initVal.replace(/,/g, '');
        }
        let index = toChineseNumber(initVal).indexOf('元')
        if (tip.target.getAttribute('money')) {
          document.querySelector(`*[extendParam=${strCn}]`).innerHTML = toChineseNumber(initVal).substring(0, index)+toChineseNumber(initVal).substr(index)
        } else {
          document.querySelector(`*[extendParam=${strCn}_add]`).innerHTML = toChineseNumber(initVal).substring(0, index)+toChineseNumber(initVal).substr(index)
        }
        
        if (initVal.indexOf(",") == -1) {
        document.querySelector(`*[extendParam=${strCn}]`).innerHTML = formatMoney(initVal)
        }
    }else{
      if (tip.target.getAttribute('money')) {
        document.querySelector(`*[extendparam=${strCn}]`).innerHTML = ''
      } else {
        document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
      }
        
    }
  }
})

// 勾选框逻辑
contractConfig.checkboxListener()

//初始化下拉控件
Dropdown.create({
  classN: 'dropdown-item',
  callBack: function (bindElem, dateObj) {
    if (bindElem.tagName.toLowerCase() === 'input') {
      bindElem.value = dateObj.value
      bindElem.setAttribute('value', bindElem.value)
    } 
  }
})

//基础数据赋值
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
// let msg={
//   code: "S0001191107007",
//   companyNames: ["金银湖三级门店哦"],
//   guestCardType: "军官证",
//   guestCardTypes: "",
//   guestID: "132",
//   guestIDs: "ee2353-344，ii397-4839",
//   guestName: "然迪生",
//   guestNames: "胜负少，发士夫",
//   guestTel: "13011111111",
//   guestTels: "",
//   id: 3354,
//   isentrust: 1,
//   ownerCardType: "营业执照",
//   ownerCardTypes: "",
//   ownerID: "123",
//   signDate:'5436456457568',
//   subscriptionPrice:100,
//   ownerIDs: "ee2353-344，ii397-4839",
//   ownerName: "熊先",
//   ownerNames: "胜多少，发士夫",
//   ownerTel: "18888888888",
//   ownerTels: "",
//   propertyAddr: "a市b区c",
//   singleCompany: "是的噶几开会说",
//   dealPrice:1000000.22,
//   dealPriceUpper:'壹仟',
//   square:16033.34
// }
for(let readonlyItem in msg){
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
  let readonlyArr = ['code','ownerName','ownerID','guestID','ownerNames','guestName','guestNames','propertyAddr','dealPrice','dealPriceUpper','square','signDate']
  if(onlyReadDom.length>0){
    onlyReadDom.forEach((element,index) => {
      if (readonlyItem === 'signDate' && msg["signDate"]) {
        let time = new Date(Number(msg["signDate"]));
        let y = time.getFullYear();
        let M = time.getMonth() + 1;
        let D = time.getDate();
        let signDate = `${y}年${M}月${D}日`
        element.innerHTML = signDate
      } else if((readonlyItem === 'dealPrice' && msg["dealPrice"])){
        element.innerHTML=formatMoney(msg[readonlyItem])
        element.classList.remove('input-before')
      } else if(readonlyArr.includes(readonlyItem)){
        element.innerHTML=msg[readonlyItem]
        element.classList.remove('input-before')
      }
    })
  }
}
