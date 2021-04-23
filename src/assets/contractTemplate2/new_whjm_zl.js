import {
  contractConfig,
  toChineseNumber,
  formatMoney
} from "./base.js"
let sub = {
  'checkbox_houseType': {
    stateful: function (index) {
      return index === 3 ? {
        'val1': null
      } : null
    }
  },
  'val2': null,
  'val3': null,
  'val4': null,
  'checkbox_lessee': {
    stateful: function (index) {
      return index === 0 ? {
        'val5': null,
        'val6': null
      } : null
    }
  },
  'checkbox_prove': {
    stateful: function (index) {
      let res = null
      switch (index) {
        case 0:
          res = {
            'val7': null
          }
          break;
        case 1:
          res = {
            'val8': null
          }
          break;
        case 2:
          res = {
            'val9': null
          }
          break;
        case 3:
          res = {
            'val10': null
          }
          break;
        case 4:
          res = {
            'val11': null
          }
          break;
        default:
          res = null
          break;
      }
      return res
    }
  },
  'checkbox_facility': {
    state: true,
    stateful: function (index) {
      return index == 5 ? {
        'val12': null
      } : null
    }
  },
  'val13': null,
  'val14': null,
  'val15': null,
  'val16': null,
  'val18': null,
  'val19': null,
  'val20': null,
  'checkbox_payment': null,
  'val22': null,
  'val23': null,
  'val24': null,
  'val25': null,
  // 'drapdown_val24': {
  //   stateful: function (index) {
  //     return index === '(13)' ? { 'val26': null } : null
  //   }
  // },
  // 'drapdown_val25': {
  //   stateful: function (index) {
  //     return index === '(13)' ? { 'val26': null } : null
  //   }
  // },
  'val27': null,
  'val28': null,
  'val32': null,
  'info_val111': {
    stateful: function () {
      return document.querySelector('*[extendparam=val111]') ? {'val111': null} : null
    }
  },
  'info_val222': {
    stateful: function () {
      return document.querySelector('*[extendparam=val222]') ? {'val222': null} : null
    }
  },
}
let Obj = {
  cn_arr: ['val20', 'val21', 'val23', 'val27', 'val28', ]
}
//初始化下拉控件
Dropdown.create({
  classN: 'dropdown-item',
  callBack: function (bindElem, dateObj) {
    if (bindElem.tagName.toLowerCase() === 'input') {
      bindElem.value = dateObj.value
      bindElem.setAttribute('value', bindElem.value)
      let obj = {
        'val24': ['val26'],
        'val25': ['val26'],
      }
      let attr = bindElem.getAttribute('extendParam')
      console.log(attr, 'attr', dateObj.value);
      if (obj[attr]) {
        contractConfig.initForm(obj[attr], 0)
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

// 勾选框逻辑
contractConfig.checkboxListener(function (obj,i) {
  if (obj.currentTarget.getAttribute('name') === 'facility') {
    let checkIO = {
      5: ['val12'],
    }
    if (obj.currentTarget.querySelector('p').getAttribute('checked')) {
      if (i === 5) {
        contractConfig.initForm(checkIO[5], 1)
      }
    }
  } 
}, function (obj, index) {
  let attr = obj.currentTarget.getAttribute('name')
  let boxArray = document.getElementsByName(attr);
  if (attr === 'houseType') {
    let checkIO = {
      3: ['val1'],
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 3) {
            contractConfig.initForm(checkIO[3], 0)
          } else {
            contractConfig.initForm(checkIO[3], 1)
          }
        } else {
          contractConfig.initForm(checkIO[3], 1)
        }
      }
    })
  } else if (attr === 'lessee') {
    let checkIO = {
      0: ['val5', 'val6'],
      1: ['val5', 'val6'],
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          contractConfig.initForm(checkIO[i], 0)
          if (i === 0) {
            contractConfig.initForm(checkIO[1], 0)
          } else {
            contractConfig.initForm(checkIO[0], 1)
          }
        } else {
          contractConfig.initForm(checkIO[i], 1)
        }
      }
    })
  } else if (attr === 'prove') {
    let checkIO = {
      0: {
        write: ['val7'],
        disable: ['val8', 'val9', 'val10', 'val11']
      },
      1: {
        write: ['val8'],
        disable: ['val7', 'val9', 'val10', 'val11']
      },
      2: {
        write: ['val9'],
        disable: ['val7', 'val8', 'val10', 'val11']
      },
      3: {
        write: ['val10'],
        disable: ['val7', 'val8', 'val9', 'val11']
      },
      4: {
        write: ['val11'],
        disable: ['val7', 'val8', 'val9', 'val10']
      }
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (!item.querySelector('p').getAttribute('checked')) {
          contractConfig.initForm(checkIO[i].write, 1)
          contractConfig.initForm(checkIO[i].disable, 1)
        } else {
          contractConfig.initForm(checkIO[i].write, 0)
          contractConfig.initForm(checkIO[i].disable, 1)
        }
      }
    })
  } else if (attr === 'facility') {
    let checkIO = {
      5: ['val12'],
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 5) {
            contractConfig.initForm(checkIO[5], 0)
          }
        }
      }
    })
  } else if (attr === 'accessCard') {
    let checkIO = {
      0: ['val58'],
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 0) {
            contractConfig.initForm(checkIO[0], 0)
          } else {
            contractConfig.initForm(checkIO[0], 1)
          }
        } else {
          contractConfig.initForm(checkIO[0], 1)
        }
      }
    })
  } else if (attr === 'bedroomFloor') {
    let checkIO = {
      4: ['val100'],
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 4) {
            contractConfig.initForm(checkIO[i], 0)
          } else {
            contractConfig.initForm(checkIO[4], 1)
          }
        } else {
          contractConfig.initForm(checkIO[4], 1)
        }
      }
    })
  } else if (attr === 'drawingFloor') {
    let checkIO = {
      4: ['val101'],
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 4) {
            contractConfig.initForm(checkIO[i], 0)
          } else {
            contractConfig.initForm(checkIO[4], 1)
          }
        } else {
          contractConfig.initForm(checkIO[4], 1)
        }
      }
    })
  } else if (attr === 'kitchenWall') {
    let checkIO = {
      3: ['val102'],
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 3) {
            contractConfig.initForm(checkIO[i], 0)
          } else {
            contractConfig.initForm(checkIO[3], 1)
          }
        } else {
          contractConfig.initForm(checkIO[3], 1)
        }
      }
    })
  } else if (attr === 'drawingWall') {
    let checkIO = {
      3: ['val103'],
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 3) {
            contractConfig.initForm(checkIO[i], 0)
          } else {
            contractConfig.initForm(checkIO[3], 1)
          }
        } else {
          contractConfig.initForm(checkIO[3], 1)
        }
      }
    })
  } else if (attr === 'bedroomWall') {
    let checkIO = {
      3: ['val104'],
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 3) {
            contractConfig.initForm(checkIO[i], 0)
          } else {
            contractConfig.initForm(checkIO[3], 1)
          }
        } else {
          contractConfig.initForm(checkIO[3], 1)
        }
      }
    })
  } else if (attr === 'sofa') { //1
    let checkIO = {
      3: ['other1'],
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 3) {
            contractConfig.initForm(checkIO[i], 0)
          } else {
            contractConfig.initForm(checkIO[3], 1)
          }
        } else {
          contractConfig.initForm(checkIO[3], 1)
        }
      }
    })
  } else if (attr === 'teaTable') {
    let checkIO = {
      3: ['other2'],
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 3) {
            contractConfig.initForm(checkIO[i], 0)
          } else {
            contractConfig.initForm(checkIO[3], 1)
          }
        } else {
          contractConfig.initForm(checkIO[3], 1)
        }
      }
    })
  } else if (attr === 'diningTable') {
    let checkIO = {
      3: ['other3'],
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 3) {
            contractConfig.initForm(checkIO[i], 0)
          } else {
            contractConfig.initForm(checkIO[3], 1)
          }
        } else {
          contractConfig.initForm(checkIO[3], 1)
        }
      }
    })
  } else if (attr === 'chair') {
    let checkIO = {
      3: ['other4'],
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 3) {
            contractConfig.initForm(checkIO[i], 0)
          } else {
            contractConfig.initForm(checkIO[3], 1)
          }
        } else {
          contractConfig.initForm(checkIO[3], 1)
        }
      }
    })
  }
})


//给按钮添加点击事件
let mainBtn = document.querySelector('#submit');
if (mainBtn) {
  mainBtn.addEventListener('click', function (e) {
    contractConfig.submit(e, sub, 'templateError')
  })
} else {
  let btn = document.createElement('span')
  btn.id = 'submit'
  btn.style.display = 'none'
  btn.innerHTML = 'click'
  document.body.appendChild(btn)
  btn.addEventListener('click', function (e) {
    contractConfig.submit(e, sub, 'templateError')
  })
}

//基础数据赋值
// let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
let msg = {
  code: "S0001191107007",
  companyNames: ["金银湖三级门店哦"],
  guestCardType: "军官证",
  guestCardTypes: "",
  guestID: "132",
  guestIDs: "",
  guestName: "然爱迪生",
  guestNames: "",
  guestTel: "13011111111",
  guestTels: "",
  id: 3354,
  isentrust: 1,
  ownerCardType: "营业执照",
  ownerCardTypes: "",
  ownerID: "123",
  ownerIDs: "",
  ownerName: "熊先",
  ownerNames: "",
  ownerTel: "18888888888",
  ownerTels: "",
  signDate: 1592465819508,
  propertyAddr: "a市b区c",
  singleCompany: "",
}
for (let readonlyItem in msg) {
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
  if (onlyReadDom.length > 0) {
    onlyReadDom.forEach((element, index) => {
      if (readonlyItem === 'code') {
        element.value = msg[readonlyItem]
        element.setAttribute('value', msg[readonlyItem])
      } else if (readonlyItem === "companyNames") {
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
