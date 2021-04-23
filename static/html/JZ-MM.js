import { contractConfig, toChineseNumber,formatMoney } from "./base.js"
let sub = {
  // "checkbox_check1": {
  //   stateful: function (index) {
  //     return [0,1].includes(index) ? {"val4": null}:''
  //   }
  // },
  // "checkbox_check2": {
  //   stateful: function (index) {
  //     return index === 0 ? {"val5":null,"val6":null,"val7":null,"val8":null,} : {"val9":null,"checkbox_check3":null}
  //   }
  // },
  // "checkbox_check4": null, // 新添加
  "checkbox_check4": {
    stateful: function (index) {
      return index === 3 ? {"val555":null} : null
    }
  },
  "checkbox_check5": {
    stateful: function (index) {
      return index === 1 ? {"val10":null,"drapdown_val11":{
        stateful: function (i) {
          return i === "(1)" ? {"val12": null,"val13":null} : {"val14": null,"val15": null}
        }
      }} : null
    }
  },
  "checkbox_check6": null,
  "val16": null,
  "val18": null,
  "checkbox_check7": null,
  "checkbox_check8": {
    stateful: function (index) {
      return index === 0 ? {"checkbox_check9":null,"val19":null,"val20":null} : null
    }
  },
  "val21": null,
  "val22": null,
  "val23": null,
  "drapdown_val24":{
    stateful: function (i) {
      return i === "(1)" ? {"val25": null} : i === "(2)" ? {"val26": null,"val27": null,"val28": null,"val29": null} : {"val333": null}
    }
  },
  "val30": null,
  "drapdown_val31":{
    stateful: function (i) {
      return i === "(1)" ? {"val32": null} : {"checkbox_check20": null,"val33": null,"drapdown_val34":{
        stateful: function (i) {
          return i === "(2)" ? {"val35": null} : null
        }
      }}
    }
  },
  "val36": null,
  "checkbox_check10": null,
  "checkbox_check11": null,
  "val37": null,
  "val38": null,
  "drapdown_val39":{
    stateful: function (i) {
      return i === "(2)" ? {"val40": null} : null
    }
  },
  "checkbox_check12": null,
  "checkbox_check13": null,
  "checkbox_check14": null,
  "checkbox_check15": null,
  "drapdown_val41": null,
  "drapdown_val42": {
    stateful: function (i) {
      return i === "(1)" ? {"val43": null} : i === "(2)" ? {"val44": null} : {"val45": null}
    }
  },
  "val46": null,
  "checkbox_check22": null,
  "drapdown_val49":{
    stateful: function (i) {
      return i === "(1)" ? {"val50": null} : null
    }
  }
}

let checkArr = {
  check1: {
    0 : ["val4"],
    1 : ["val4"],
  },
  check2: {
    0 : ["val5","val6","val7","val8"],
    1 : ["val9","checkbox_check3"]
  },
  check5: {
    1 : ["val10","val11","val12","val13","val14","val15"]
  },
  check8: {
    0 : ["checkbox_check9","val19","val20"]
  },
  check30: {
    0 : ["val80"]
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

//初始化下拉控件
Dropdown.create({
  classN: 'dropdown-item',
  callBack: function (bindElem, dateObj) {
    if (bindElem.tagName.toLowerCase() === 'input') {
      bindElem.value = dateObj.value
      bindElem.setAttribute('value', bindElem.value)
      let obj = {
        'val11': {
          '(1)': {
            'write': ['val12','val13'],
            'disabled':  ['val14','val15']
          },
          '(2)': {
            'disabled': ['val12','val13'],
            'write': ['val14','val15']
          }
        },
        'val24': {
          '(1)': {
            'write': ['val25'],
            'disabled': ['val26','val27','val28','val29']
          },
          '(2)': {
            'write': ['val26','val27','val28','val29'],
            'disabled': ['val25']
          },
          '(3)': {
            'write': ['val333'],
            'disabled': ['val25','val26','val27','val28','val29']
          }
        },
        'val31': {
          '(1)': {
            'write': ['val32'],
            'disabled': ['checkbox_check20','val33','val34','val35']
          },
          '(2)': {
            'write': ['checkbox_check20','val33','val34','val35'],
            'disabled': ['val32']
          }
        },
        'val34': {
          '(1)': {
            'write': [],
            'disabled': ['val35']
          },
          '(2)': {
            'write': ['val35'],
            'disabled': []
          }
        },
        'val39': {
          '(1)': {
            'write': [],
            'disabled': ['val40']
          },
          '(2)': {
            'write': ['val40'],
            'disabled': []
          }
        },
        'val42': {
          '(1)': {
            'write': ['val43'],
            'disabled': ['val44','val45']
          },
          '(2)': {
            'write': ["val44"],
            'disabled': ['val43','val45']
          },
          '(3)': {
            'write': ['val45'],
            'disabled': ['val43','val44']
          }
        },
        'val49': {
          '(1)': {
            'write': ['val50'],
            'disabled': []
          },
          '(2)': {
            'write': [],
            'disabled': ['val50']
          }
        }
      }
      let attr = bindElem.getAttribute('extendParam')
      if (obj[attr] && obj[attr][dateObj.value]) {
        contractConfig.initForm(obj[attr][dateObj.value].write, 0)
        contractConfig.initForm(obj[attr][dateObj.value].disabled, 1)
      }
    } else {
      bindElem.innerHTML = dateObj.value
      bindElem.classList.remove('input-select')
      bindElem.classList.remove('input-before')
    }
  }
})

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
}, function(obj, boxArray) {
    // 循环
    boxArray.forEach((e, i) => {
        let bool = e.querySelector('p').getAttribute('checked');
        let name = e.getAttribute('name');
        // 如果是选中状态
        if(name === 'check1'){
          contractConfig.initForm(checkArr[name][i], 0);
        }
        if(name === 'check4' && document.querySelector("[extendparam=val555]")){
          if (indexChcek === 3) {
            contractConfig.initForm(["val555"], 0);
          } else {
            contractConfig.initForm(["val555"], 1);
          }
        }
        if (name === 'check5') {
            if (i === 1) {
                contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
            } else {
                contractConfig.initForm(checkArr[name][1], 0);
            }
        }
        if (name === 'check2') {
            contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
        }
        if (name === 'check8' && indexChcek === 0) {
          if (i === 0) {
              contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
          }
        } else if (name === 'check8' && indexChcek === 1 && i === 1) {
            contractConfig.initForm(checkArr[name][0], 1);
        }
        if (name === 'check30' && indexChcek === 0) {
          if (i === 0) {
              contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
          }
        } else if (name === 'check30' && indexChcek === 1 && i === 1) {
            contractConfig.initForm(checkArr[name][0], 1);
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

//基础数据赋值
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
// let msg = {
//   code: "S0001191107007",
//   companyNames: ["金银湖三级门店哦"],
//   guestCardType: "军官证",
//   guestCardTypes: "",
//   guestID: "132",
//   guestIDs: "1212121212",
//   guestName: "然爱迪生",
//   guestNames: "",
//   guestTel: "13011111111",
//   guestTels: "",
//   id: 3354,
//   isentrust: 1,
//   ownerCardType: "营业执照",
//   ownerCardTypes: "",
//   ownerID: "123",
//   ownerIDs: "12121212121",
//   ownerName: "熊先",
//   ownerNames: "",
//   ownerTel: "18888888888",
//   ownerTels: "",
//   signDate: 1592465819508,
//   propertyAddr: "a市b区c",
//   singleCompany: "",
// }
for (let readonlyItem in msg) {
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
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
        element.innerHTML = msg[readonlyItem]
        element.classList.remove('input-title')
        element.classList.remove('input-title2')
        element.classList.remove('input-before')
      }
    });
  }
}