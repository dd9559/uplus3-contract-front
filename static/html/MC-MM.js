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
      } else if (readonlyItem === "ownerName") {
        console.log(element,99999);
        if (element.getAttribute('extendParam') === 'val1') {
          let owner = ''
          if (msg['ownerNames']) {
            owner = `${msg['ownerName']}、${msg['ownerNames']}`
          } else {
            owner = msg['ownerName']
          }
          element.innerHTML = owner
        } else {
          element.innerHTML = msg[readonlyItem]
        }
      } else {
        element.innerHTML = msg[readonlyItem]
        element.classList.remove('input-title')
        element.classList.remove('input-title2')
        element.classList.remove('input-before')
      }
    });
  }
}



let sub = {
  'checkbox_check1': null,
  'val1': null,
  'val2': null,
  "checkbox_check2": {
    stateful: function (index) {
      return index === 6 ? {"val3": null}:null
    }
  },
  'checkbox_check3': null,
  'checkbox_check4': null,
  'checkbox_check5': null,
  "checkbox_check6": {
    stateful: function (index) {
      if (index === 1) {
        let owner = ''
        if (msg['ownerNames']) {
          owner = `${msg['ownerName']}、${msg['ownerNames']}`
        } else {
          owner = msg['ownerName']
        }
        console.log(document.querySelector('*[extendparam=val4]'),99999);
        document.querySelector('*[extendparam=val4]').innerHTML = owner
        return {'val5': null, 'val6': null}
      } else {
        return null
      }
    }
  },
  "checkbox_check7": {
    stateful: function (index) {
      return index === 1 ? {'val7': null,'checkbox_check8': {
        stateful: function (index) {
          return index === 0 ? {'checkbox_check9': {
            stateful: function (index) {
              return index === 2 ? {'val8': null} : null
            }
          },'val9': null} : null
        }
      }} : null
    }
  },
  '"checkbox_check10': null,
  "checkbox_check11": {
    stateful: function (index) {
      return index === 0 ? {'checkbox_check12': null,'val10': null,'val11': null,'val12': null,'val13': null,} : null
    }
  },
  'checkbox_check13': {
    stateful: function (index) {
      return index === 1 ? {'val14': null,'val15': null,'checkbox_check14': null,'val16': null,'checkbox_check15': {
        stateful: function (index) {
          let obj = null
          switch (index) {
            case 0:
              obj = {"val17": null}
              break;
            case 1:
              obj = {"val18": null}
              break;
            case 2:
              obj = {"val19": null}
              break;
            default:
              obj = null
              break;
          }
          return obj
        }
      },'checkbox_check16': {
        stateful: function (index) {
          return index === 1 ? {'val20': null} : null
        }
      }} : null
    }
  },
  'val21': null,
  'val22': null,
  'val23': null,
  "checkbox_check17": {
    stateful: function (index) {
      return index === 2 ? {'val24': null,'val25': null} : null
    }
  },
  'checkbox_check18': {
    stateful: function (index) {
      let obj = null
      switch (index) {
        case 0:
          obj = {"val26": null}
          break;
        case 1:
          obj = {"val27": null,'val28': null}
          break;
        case 2:
          obj = {"val29": null}
          break;
        case 3:
          obj = {"val30": null,'val31': null}
          break;
        case 4:
          obj = {"val32": null}
          break;
        default:
          obj = null
          break;
      }
      return obj
    }
  },
  "val33": null,
  'checkbox_check19': {
    stateful: function (index) {
      let obj = null
      switch (index) {
        case 0:
          obj = {"val34": null}
          break;
        case 1:
          obj = {"val35": null}
          break;
        case 2:
          obj = {"val36": null}
          break;
        case 3:
          obj = {"val37": null}
          break;
        default:
          obj = null
          break;
      }
      return obj
    }
  },
  "checkbox_check20": {
    stateful: function (index) {
      return index === 0 ? {'val38': null} : null
    }
  },
  "val39": null,
  "val40": null,
  "val41": null
}

let checkArr = {
  check6: {
    0 : ["val4","val5","val6"],
    1 : ["val4","val5","val6"],
  },
  check7: {
    1 : ["val7","checkbox_check8","checkbox_check9",'val8','val9']
  },
  check8: {
    0 : ["checkbox_check9",'val8','val9']
  },
  check9: {
    2 : ['val8']
  },
  check11: {
    0 : ["checkbox_check12",'val10','val11','val12','val13']
  },
  check13: {
    1 : ['val14','val15','checkbox_check14','val16','checkbox_check15',"val17","val18","val19",'checkbox_check16','val20']
  },
  check15: {
    0 : ["val17"],
    1 : ["val18"],
    2 : ["val19"]
  },
  check16: {
    1 : ["val20"]
  },
  check17: {
    1 : ["val24","val25"]
  },
  check18: {
    0 : ["val26"],
    1 : ["val27","val28"],
    2 : ["val29"],
    3 : ["val30","val31"],
    4 : ["val32"]
  },
  check18: {
    0 : ["val26"],
    1 : ["val27","val28"],
    2 : ["val29"],
    3 : ["val30","val31"],
    4 : ["val32"]
  },
  check19: {
    0 : ["val34"],
    1 : ["val35"],
    2 : ["val36"],
    3 : ["val37"]
  },
  check20: {
    0 : ["val38"]
  }
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
          if (max == 17) {
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

// 选择第几个
let indexChcek = 0;
// 选择事件回调
contractConfig.checkboxListener(function(obj, i) {
    indexChcek = i;
    console.log(obj,i,'第一个回调');
}, function(obj, boxArray) {
  console.log(obj,boxArray,'第二个回调');
    // 循环
    boxArray.forEach((e, i) => {
        let bool = e.querySelector('p').getAttribute('checked');
        let name = e.getAttribute('name');
        // 如果是选中状态

        if (name === 'check6') {
          if (indexChcek === 1) {
            contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
            let owner = ''
            if (msg['ownerNames']) {
              owner = `${msg['ownerName']}、${msg['ownerNames']}`
            } else {
              owner = msg['ownerName']
            }
            document.querySelector('*[extendparam=val4]').innerHTML = owner
          } else {
            document.querySelector('*[extendparam=val4]').innerHTML = ''
            contractConfig.initForm(checkArr[name][1], 1);
          }
        }
        if (name === 'check7') {
          if (checkArr[name][i]) {
            contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
          }
        }
        if (name === 'check8') {
          if (checkArr[name][i]) {
            contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
          }
        }
        if (name === 'check9') {
          if (checkArr[name][i]) {
            contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
          }
        }
        if (name === 'check11') {
          if (checkArr[name][i]) {
            contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
          }
        }
        if (name === 'check13') {
          if (checkArr[name][i]) {
            contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
          }
        }
        if (name === 'check15') {
          if (checkArr[name][i]) {
            contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
          }
        }
        if (name === 'check16') {
          if (checkArr[name][i]) {
            contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
          }
        }
        if (name === 'check17') {
          if (checkArr[name][i]) {
            contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
          }
        }
        if (name === 'check18') {
          if (checkArr[name][i]) {
            contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
          }
        }
        if (name === 'check19') {
          if (checkArr[name][i]) {
            contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
          }
        }
        if (name === 'check20') {
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