import {contractConfig,toChineseNumber,formatMoney} from "./base.js"

let Obj;
(function() {
    let t = document.querySelectorAll(`[extendParam]`);
    let arr = [];

    t.forEach(e => {
        let name = e.getAttribute("extendParam")
        if (name.indexOf("_add") > 0) {
            let name2 = name.slice(0, -4);
            arr.push(name2);
        }
    });
    Obj = Obj || {};
    Obj.cn_arr = arr;
})()

  let sub = {
    'val1':null,
    'val111':null,
    'checkbox_guaranty': null,
    'checkbox_payway': null,
    'checkbox_jiaju': null,
    'val2':null,
    'checkbox_recievetime': {
      stateful: function(index) {
        return index===0 ? {'val3':null} : index===1 ? {'val4':null} : null
      }
    },
    'val5':null,
    'info_gg': {
      stateful: function () {
        let list = document.querySelectorAll(`*[name=gg]`),
            flag = false,
            i;

        for(let j = 0; j < list.length; j++) {
          if (list[j].querySelector('p').getAttribute('checked')) {
            flag = true
            i = j
          }
        }

        return flag ? i === 0 ? {'val11':null} : {'val12':null} : null
      }
    }
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



// 输入框右侧吸边
let textLong = Array.from(document.querySelectorAll('.text-limit'))
textLong.forEach(function (item) {
  item.addEventListener('input', function () {
    let leng = this.value.length
    for (let i = 0; i < leng; i++) {
      if (this.scrollWidth > this.clientWidth) {
        this.value = this.value.substring(0, this.value.length - 1)
      }
    }
  })
})

//基础数据赋值
// let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
let msg={
  code: "S0001191107007",
  companyNames: ["金银湖三级门店哦"],
  guestCardType: "军官证",
  guestCardTypes: "",
  guestID: "132",
  guestIDs: "ee2353-344，ii397-4839",
  guestName: "然迪生",
  guestNames: "胜负少，发士夫",
  guestTel: "13011111111",
  guestTels: "",
  id: 3354,
  isentrust: 1,
  ownerCardType: "营业执照",
  ownerCardTypes: "",
  ownerID: "123",
  signDate:'5345436456457568',
  subscriptionPrice:100,
  ownerIDs: "ee2353-344，ii397-4839",
  ownerName: "熊先",
  ownerNames: "胜多少，发士夫",
  ownerTel: "18888888888",
  ownerTels: "",
  propertyAddr: "a市b区c",
  singleCompany: "是的噶几开会说",
  dealPrice:1000,
  dealPriceUpper:'壹仟',
  square:160
}
for (let readonlyItem in msg) {
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));

  let readonlyArr = ['code','ownerName', 'ownerID', 'guestTel','ownerNames','signDate','subscriptionPriceUpper','subscriptionPrice', 'ownerIDs', 'guestName', 'guestID', 'guestNames', 'guestIDs', 'propertyAddr', 'dealPrice', 'dealPriceUpper','companyNames','guestStoreRegisterCode']
  if(onlyReadDom.length>0){
    onlyReadDom.forEach((element,index) => {
      if(readonlyArr.includes(readonlyItem)){
        if(readonlyItem==='companyNames') {
          element.innerHTML=msg[readonlyItem][0]
        }else if(readonlyItem==='signDate'){
          let time = new Date(Number(msg["signDate"]));
          let y = time.getFullYear();
          let M = time.getMonth() + 1;
          let D = time.getDate();
          let signDate = `${y}年${M}月${D}日`
          element.innerHTML = signDate
        }else {
          if (['ownerCommissionUpper','subscriptionPriceUpper','dealPriceUpper','custCommissionUpper'].includes(readonlyItem)) {
            element.innerHTML = toChineseNumber(msg[readonlyItem.replace('Upper','')])
          } else if (['ownerCommission','subscriptionPrice','dealPrice','custCommission'].includes(readonlyItem)) {
            element.innerHTML = formatMoney(msg[readonlyItem])
          } else {
            element.innerHTML = msg[readonlyItem]
          }
        }
        element.classList.remove('input-before')
      }
    })
  }
}

// 勾选框逻辑
contractConfig.checkboxListener(function(){},function(obj,index){
  let attr = obj.currentTarget.getAttribute('name')
  let boxArray = document.getElementsByName(attr);
  if(attr==='recievetime'){
    let checkIO={
      0: ['val3'],
      1: ['val4'],
    }
    boxArray.forEach((item,i)=>{
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if(item===obj.currentTarget){
        if(item.querySelector('p').getAttribute('checked')){
          contractConfig.initForm(checkIO[i],0)
          if(i===0){
            contractConfig.initForm(checkIO[1],1)   //readonly
          }else{
            contractConfig.initForm(checkIO[0],1)
          }
        }else{
          contractConfig.initForm(checkIO[0],1)
        }
      }
    })
  }else if(attr==='gg'){
    let checkIO={
      0: ['val11'],
      1: ['val12'],
    }
    boxArray.forEach((item,i)=>{
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if(item===obj.currentTarget){
        if(item.querySelector('p').getAttribute('checked')){
          contractConfig.initForm(checkIO[i],0)
          if(i===0){
            contractConfig.initForm(checkIO[1],1)
          }else {
            contractConfig.initForm(checkIO[0],1)
          }
        }else{
          contractConfig.initForm(checkIO[i],1)
        }
      }
    })
  }
})

// 输入自适应
contractConfig.inputListener(
  function(ev, tip) {
      let max = tip.target.getAttribute("max");
      let textArea = document.getElementById("inputArea");
      if (max) {
          //监听max属性，判断文本框是有有输入长度限制
          textArea.setAttribute("maxLength", parseInt(max));
      } else {
          textArea.removeAttribute("maxLength");
      }
      //监听listen属性，判断是否有输入类型限制
      let spanAttr = tip.target.getAttribute("listen");
      if (spanAttr === "number") {
          let cn_str = tip.target.getAttribute('extendparam')
          if (Obj['cn_arr'].includes(cn_str) || max == 17) {
            ev.target.value = ev.target.value.replace(/[^\d.]/g,"");
            ev.target.value = ev.target.value.replace(/^\./g,"");
            ev.target.value = ev.target.value.replace(/\.{2,}/g,".");
            ev.target.value = ev.target.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
            ev.target.value = ev.target.value.replace(/^(\-)*(\d+)\.(\d{0,2}).*$/,'$1$2.$3');
          } else  {
            ev.target.value=ev.target.value.replace(/[^\d]/g, "")
          }
          if (Obj['cn_arr'].includes(cn_str) && max == 17) {
            tip.target.innerHTML = formatMoney(ev.target.value)
          } else {
            tip.target.innerHTML = ev.target.value
          }
          if(Obj['cn_arr'].includes(cn_str)){
    
            if (ev.target.value.indexOf(",") != -1) {
              ev.target.value = ev.target.value.replace(/,/g, '')
            }
            let index = toChineseNumber(ev.target.value).indexOf('元')
            document.querySelector(`*[extendParam=${cn_str}_add]`).innerHTML = toChineseNumber(ev.target.value).substring(0, index)+toChineseNumber(ev.target.value).substr(index)
            if (ev.target.value.indexOf(",") == -1) {
              document.querySelector(`*[extendParam=${cn_str}]`).innerHTML = formatMoney(ev.target.value)
            }
          }
      }
  },
  function(tip) {
      //获取输入框的默认值
      let initVal = tip.target.innerHTML;
      let strCn = tip.target.getAttribute("extendparam");
      let max = tip.target.getAttribute("max");
      if (max == 17) {
        document.querySelector(`*[extendParam=${strCn}]`).innerHTML = formatMoney(initVal)
      }
      if(Obj['cn_arr'].includes(strCn)){
          if(initVal.length>0){
              if (initVal.indexOf(",") != -1) {
              initVal = initVal.replace(/,/g, '');
              }
              let index = toChineseNumber(initVal).indexOf('元')
              document.querySelector(`*[extendParam=${strCn}_add]`).innerHTML = toChineseNumber(initVal).substring(0, index)+toChineseNumber(initVal).substr(index)
              if (initVal.indexOf(",") == -1) {
              document.querySelector(`*[extendParam=${strCn}]`).innerHTML = formatMoney(initVal)
              }
          }else{
              document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
          }
      }
  }
)

