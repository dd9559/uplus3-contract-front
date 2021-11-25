import { contractConfig, toChineseNumber,formatMoney } from "./base.js"

//基础数据赋值
// let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
let msg = {
  "houseinfoCode": "S00119148",
  "wHEmpName": "刘刘",
  "ownerIDs": "12312312321312、12312321",
  "isHaveData": 0,
  "ownerTels": "13111111111、13222222222",
  "custCommission": 434,
  "ownerCommission": 44,
  "propertyAddr": "234市24区4444444444444",
  "singleCompany": "",
  "cityId": 52,
  "dealPrice": 23,
  "lepName": "冯偏",
  "type": 2,
  "signDate": 1625561466000,
  "guestName": "搜索",
  "wtSignDate": "",
  "companyNames": [
    "西牛皮防水科技有限公司"
  ],
  "otherCooperationCost": 0,
  "guestStoreName": "西牛皮防水科技有限公司",
  "guestTel": "18735304955",
  "id": 9422,
  "guestCardType": "护照",
  "ownerCommissionUpper": "肆拾肆",
  "companyBanks": [
    {
      "bankAccountName": "西牛皮防水科技有限公司",
      "bankBranchName": "2搜索",
      "bankCard": "2333333",
      "bankCode": "CMB",
      "bankId": 18,
      "bankName": "招商银行",
      "entBankList": [],
      "id": 291,
      "storeId": 50736,
      "storeName": "测试小队2（片区）",
      "type": 1
    }
  ],
  "guestinfoCode": "G00004459",
  "subscriptionPriceUpper": "零",
  "guestCardTypes": "护照、护照",
  "isRefer": 0,
  "ownerID": "234324",
  "tendingName": "阿斯顿",
  "square": 100,
  "transFlowCode": 129,
  "moneyUnit": "元",
  "guestTels": "13112222222、13333333333",
  "ownerCardTypes": "护照、护照",
  "code": "S0052210706009",
  "ownerCardType": "护照",
  "guestStoreRegisterCode": "91450100718897478Y",
  "ownerTel": "15423467890",
  "dealPriceUpper": "贰拾叁",
  "companyLepPhone": "18217597612",
  "guestNames": "123213、41231231",
  "ownerName": "搜索",
  "guestIDs": "23123123123、123123123123213",
  "custEnsure": 0,
  "timeUnit": "",
  "isRetained": 0,
  "commissionPayment": 0,
  "ownerNames": "12312、123123",
  "isWuHanMM": 0,
  "custCommissionUpper": "肆佰叁拾肆",
  "propertyCard": "",
  "guestID": "342323232323",
  "squareUse": 99,
  "subscriptionPrice": 0,
  "remarks": ""
}
for (let readonlyItem in msg) {
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
  console.log();
  if (onlyReadDom.length > 0) {
    onlyReadDom.forEach((element, index) => {
      if (readonlyItem === 'code') {
        element.value = msg[readonlyItem]
        element.setAttribute('value', msg[readonlyItem])
      } else if (readonlyItem === "companyNames"&&msg[readonlyItem].length>0) {
        element.innerHTML = msg[readonlyItem][0]
        element.classList.remove('input-before')
      } else if (readonlyItem === "signDate") {
        let time = new Date(Number(msg["signDate"]));
        let y = time.getFullYear();
        let M = time.getMonth() + 1;
        let D = time.getDate();
        let signDate = `${y}年${M}月${D}日`
        element.innerHTML = signDate
      } else {
        if (['ownerCommissionUpper','subscriptionPriceUpper','dealPriceUpper','custCommissionUpper'].includes(readonlyItem)) {
          element.innerHTML = toChineseNumber(msg[readonlyItem.replace('Upper','')])
        } else if (['ownerCommission','subscriptionPrice','dealPrice','custCommission'].includes(readonlyItem)) {
          element.innerHTML = formatMoney(msg[readonlyItem])
        } else {
          element.innerHTML = msg[readonlyItem]
        }
        element.classList.remove('input-title')
        element.classList.remove('input-title2')
        element.classList.remove('input-before')
      }
    });
  }
}



let sub = {
  "val6": null,
  "val7": null,
  "val8": null,
  "checkbox_check1": {
    stateful: function (index) {
      return index === 4 ? {"val9": null}:null
    }
  },
  "drapdown_val10": {
    stateful: function (val) {
      let res = null;
      switch (val) {
        case '1':
          break;
        case '2':
          res = {'val11': null,'val12': null}
          break;
        case '3':
          res = {'val13': null};
          break;
      }
      return res;
    }
  },
  'checkbox_check2': null,
  "val14": null,
  "val15": null,
  "val16": null,
  "checkbox_check3": {
    stateful: function (index) {
      return index === 0 ? {"val19": null}:{"val20": null,"val21": null,"val22": null}
    }
  },
  'checkbox_check4': null,
  "val23": null,
  "val24": null,
  "val25": null,
  "val27": null,
  "val28": null,
  "val29": null,
  "val30": null,
  "val31": null,
  "val32": null,
  "info_check5": {
    stateful: function () {
      return document.querySelectorAll(`*[name=check5]`)[0].querySelector('p').getAttribute('checked') ? {'checkbox_check6': {
        stateful: function (index) {
          return index === 4 ? {"val33": null}:null
        }
      }} : null
    }
  },
  "info_check7": {
    stateful: function () {
      return document.querySelectorAll(`*[name=check7]`)[0].querySelector('p').getAttribute('checked') ? {'checkbox_check8': null} : null
    }
  },
}

let checkArr = {
  check1: {
    4 : ["val9"]
  },
  check3: {
    0 : ["val19"],
    1 : ["val20","val21","val22"],
  },
  check5: {
    0 : ["checkbox_check6","val33"]
  },
  check7: {
    0 : ["checkbox_check8"]
  },
}

let drapdownArr = {
  val10: {
    '1' : {
      write: [],
      disabled: ["val11","val12","val13"],
    },
    '2' : {
      write: ["val11","val12"],
      disabled: ["val13"]
    },
    '3' : {
      write: ["val13"],
      disabled: ["val11","val12"]
    }
  },
}

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


Calendar.create({
  classN: 'calendar-item',
  callBack: function (bindElem, dateObj) {
    // bindElem.innerHTML = dateObj.year + '-' + dateObj.month + '-' + dateObj.date;
    if (bindElem.tagName.toLowerCase() === 'input') {
      bindElem.value = `${dateObj.year}年${dateObj.month}月${dateObj.date}日`
      bindElem.setAttribute('value', bindElem.value)
      bindElem.setAttribute('random', dateObj.random)
    }
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


  //初始化下拉控件
  Dropdown.create({
    classN: 'dropdown-item',
    callBack: function(bindElem, dateObj) {
      if(bindElem.tagName.toLowerCase()==='input'){
        bindElem.value=dateObj.value
        bindElem.setAttribute('value',bindElem.value)
        let attr = bindElem.getAttribute('inputmethod')
        console.log(bindElem, dateObj,drapdownArr[attr][dateObj.value].write,23232);
        if(drapdownArr[attr]){
          if (drapdownArr[attr][dateObj.value]) {
            contractConfig.initForm(drapdownArr[attr][dateObj.value].write,  0);
            contractConfig.initForm(drapdownArr[attr][dateObj.value].disabled,  1);
          }
          if(attr==='val10'){
            contractConfig.prohibit(bindElem,['1','2','3'],'val10')
          }
        }
      }else{
        bindElem.innerHTML = dateObj.value
        bindElem.classList.remove('input-select')
        bindElem.classList.remove('input-before')
      }
    }
  })


// 选择第几个
let indexChcek = 0;
// 选择事件回调
contractConfig.checkboxListener(function(obj, i) {
    indexChcek = i;
}, function(obj, boxArray) {
    // 循环
    boxArray.forEach((e, i) => {
        let bool = e.querySelector('p').getAttribute('checked');
        let name = e.getAttribute('name');
        // 如果是选中状态
        if (name === 'check1') {
          if (checkArr[name][i]) {
            contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
          }
        }
        if (name === 'check3') {
          if (checkArr[name][i]) {
            contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
          }
        }
        if (name === 'check5') {
          if (checkArr[name][i]) {
            contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
          }
        }
        if (name === 'check7') {
          if (checkArr[name][i]) {
            contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
          }
        }
    });
});


//给按钮添加点击事件
let mainBtn = document.querySelector('#submit');
if (mainBtn) {
  mainBtn.addEventListener('click', function (e) {
    contractConfig.submit(e, sub, 'templateError1')
  })
} else {
  let btn = document.createElement('span')
  btn.id = 'submit'
  btn.style.display = 'none'
  btn.innerHTML = 'click'
  document.body.appendChild(btn)
  btn.addEventListener('click', function (e) {
    contractConfig.submit(e, sub, 'templateError1')
  })
}