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
  "houseinfoCode": "S00120557",
  "wHEmpName": "刘才",
  "ownerIDs": "",
  "isHaveData": 0,
  "ownerTels": "",
  "custCommission": 0,
  "ownerCommission": 0,
  "propertyAddr": "湖北省武汉市洪山区天罗地网",
  "singleCompany": "",
  "cityId": 52,
  "dealPrice": 452.33,
  "lepName": "张小虎",
  "type": 5,
  "signDate": 1629794747000,
  "guestName": "冯偏",
  "companyNames": [
      "贵州文洋农业科技发展有限责任公司"
  ],
  "otherCooperationCost": 0,
  "guestStoreName": "贵州文洋农业科技发展有限责任公司",
  "guestTel": "18217597612",
  "id": 9672,
  "guestCardType": "身份证",
  "ownerCommissionUpper": "零",
  "companyBanks": [
      {
          "bankAccountName": "贵州文洋农业科技发展有限责任公司",
          "bankBranchName": "蜂花粉",
          "bankCard": "65265564654848548545",
          "bankCode": "GDB",
          "bankId": 4,
          "bankName": "广东发展银行",
          "entBankList": [],
          "id": 272,
          "storeId": 50609,
          "storeName": "太玄剑派第一分派",
          "type": 1
      },
      {
          "bankAccountName": "发个红包发的",
          "bankBranchName": "",
          "bankCard": "65646556",
          "bankCode": "CMB",
          "bankId": 18,
          "bankName": "招商银行",
          "entBankList": [],
          "id": 277,
          "storeId": 50609,
          "storeName": "太玄剑派第一分派",
          "type": 0
      }
  ],
  "guestinfoCode": "R00033742",
  "subscriptionPriceUpper": "壹仟贰佰叁拾叁圆叁角陆分",
  "guestCardTypes": "",
  "isRefer": 0,
  "ownerID": "429006199209094008",
  "tendingName": "叶吉家经纪人",
  "square": 12131,
  "moneyUnit": "元",
  "guestTels": "",
  "ownerCardTypes": "",
  "code": "J0052210824002",
  "ownerCardType": "身份证",
  "guestStoreRegisterCode": "9152000055661346X9",
  "ownerTel": "18627783021",
  "dealPriceUpper": "肆佰伍拾贰圆叁角叁分",
  "companyLepPhone": "15926302312",
  "guestNames": "",
  "propertyAddrWuYe": "当代梦工厂测试 3栋1单元128",
  "ownerName": "骆玲",
  "guestIDs": "",
  "custEnsure": 0,
  "timeUnit": "",
  "isRetained": 0,
  "commissionPayment": 0,
  "ownerNames": "",
  "subscriptionTerm": "2021-08-24 00:00:00",
  "isWuHanMM": 0,
  "custCommissionUpper": "零",
  "propertyCard": "",
  "guestID": "429006199111192507",
  "squareUse": 1234,
  "subscriptionPrice": 1233.36,
  "remarks": ""
}
for (let readonlyItem in msg) {
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));

  let readonlyArr = ['code','companyBanks','ownerName','ownerID', 'guestTel','ownerNames','signDate','subscriptionPriceUpper','subscriptionPrice', 'ownerIDs', 'guestName', 'guestID', 'guestNames', 'guestIDs', 'propertyAddr', 'dealPrice', 'dealPriceUpper','companyNames','guestStoreRegisterCode']
  if(onlyReadDom.length>0){
    onlyReadDom.forEach((element,index) => {
      console.log(element);
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
        }else if(readonlyItem === 'companyBanks') {
          element.innerHTML= msg[readonlyItem][0].storeName
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

