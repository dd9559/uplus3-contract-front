import {
  contractConfig,
  toChineseNumber,
  formatMoney
} from "./base.js"

let Obj = {
  cn_arr: ['val50', 'val60', 'val62', 'val64', 'val69', 'val70', 'val110', 'val112', 'val122','val20201']
}

let sub = {
  'val22': null,
  'val24': null,
  'val26': null,
  'val28': null,
  'val30': null,
  'val32': null,
  'checkbox_houseUse': {
    stateful: function (index) {
      return index === 4 ? {
        'val34': null
      } : null
    }
  },
  'drapdown_val36': {
    stateful: function (val) {
      let res = null;
      switch (val) {
        case '1':
          break;
        case '2':
          res = {
            'val38': null,
            'val40': null
          };
          break;
        case '3':
          res = {
            'val42': null
          };
          break;
      }
      return res;
    }
  },
  'checkbox_houseStatus': null,
  'val46': null,
  'time_val48': null,
  'val50': null,
  'val52': null,
  'val54': null,
  'checkbox_payment': {
    stateful: function (index) {
      return index === 0 ? {
        'time_val56': null
      } : {
        'time_val58': null,
        'val60': null,
        'time_val61': null,
        'checkbox_loan': null,
        'val62': null,
      }
    }
  },
  'val64': null,
  'time_val66': null,
  'val68': null,
  'val69': null,
  'val70': null,
  'time_val72': null,
  'val74': null,
  'val75': null,
  'val76': null,
  'val77': null,
  'val80': null,
  'checkbox_negotiation': {
    state: true,
    stateful: function (index) {
      return index === 0 ? {
        'checkbox_rights': {
          state: true,
          stateful: function (val) {
            return val === 5 ? {
              'val82': null
            } : null
          }
        }
      } : index === 1 ? {
        'checkbox_debt': null
      } : null
    }
  },
  // 'val104': null,
  // 'checkbox_wtloan': {
  //   stateful: function (index) {
  //     return index === 0 ? null : {
  //       'val106': null
  //     }
  //   }
  // },
  // 'val108': null,
  // 'val110': null,
  // 'val112': null,
  // 'val114': null,
  // 'val116': null,
  // 'val118': null,
  // 'val122': null,
  // 'val123': null,
  // 'val124': null,
  // 'checkbox_manType': null,
  // 'checkbox_zhengjianType': {
  //   state: true,
  //   stateful: function (index) {
  //     let res = {};
  //     switch (index) {
  //       case 0:
  //         res = {
  //           'val2011': null
  //         };
  //         break;
  //       case 1:
  //         res = {
  //           'val2022': null
  //         };
  //         break;
  //       case 2:
  //         res = {
  //           'val2033': null
  //         };
  //         break;
  //     }
  //     return res;
  //   }
  // },
  // 'checkbox_wupin': null,
  // 'val125': null,
  // 'val20201': null,

}

//???????????????????????????
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

//?????????????????????
Calendar.create({
  classN: 'calendar-item',
  callBack: function (bindElem, dateObj) {
    if (bindElem.tagName.toLowerCase() === 'input') {
      bindElem.value = `${dateObj.year}???${dateObj.month}???${dateObj.date}???`
      bindElem.setAttribute('value', bindElem.value)
      bindElem.setAttribute('random', dateObj.random)
    }
  }
})
//?????????????????????
Dropdown.create({
  classN: 'dropdown-item',
  callBack: function (bindElem, dateObj) {
    if (bindElem.tagName.toLowerCase() === 'input') {
      bindElem.value = dateObj.value
      bindElem.setAttribute('value', bindElem.value)
      let obj = {
        'val36': {
          1: ['val38', 'val40', 'val42'],
          2: ['val42'],
          3: ['val38', 'val40'],
          'init': ['val38', 'val40', 'val42']
        },
      }
      let attr = bindElem.getAttribute('extendParam')
      if (obj[attr]) {
        contractConfig.initForm(obj[attr]['init'], 0)
        contractConfig.initForm(obj[attr][Number(dateObj.value)], 1)
      }
    } else {
      bindElem.innerHTML = dateObj.value
      bindElem.classList.remove('input-select')
      bindElem.classList.remove('input-before')
    }
  }
})


// ?????????????????????
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

//??????????????????
// let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
let msg = {
  code: "S0001191107007",
  companyNames: ["????????????????????????"],
  guestCardType: "?????????",
  guestCardTypes: "",
  guestID: "132",
  guestIDs: "ee2353-344???ii397-4839",
  guestName: "?????????",
  guestNames: "?????????????????????",
  guestTel: "13011111111",
  guestTels: "",
  id: 3354,
  isentrust: 1,
  ownerCardType: "????????????",
  ownerCardTypes: "",
  ownerID: "123",
  ownerIDs: "ee2353-344???ii397-4839",
  ownerName: "??????",
  ownerNames: "?????????????????????",
  ownerTel: "18888888888",
  ownerTels: "",
  propertyAddr: "a???b???c",
  singleCompany: "?????????????????????",
  dealPrice: 1000000,
  dealPriceUpper: '??????',
  square: 160,
  guestStoreRegisterCode: '213',
  signDate: 1592465819508,
  organizationCode:"8888888888"
}
for (let readonlyItem in msg) {
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));

  let readonlyArr = ['code', 'ownerTel', 'organizationCode','guestTel', 'ownerName', 'ownerID', 'ownerNames', 'ownerIDs', 'guestName', 'guestID', 'guestNames', 'guestIDs', 'propertyAddr', 'dealPrice', 'dealPriceUpper', 'companyNames', 'guestStoreRegisterCode', 'signDate']
  if (onlyReadDom.length > 0) {
    onlyReadDom.forEach((element, index) => {
      if (readonlyArr.includes(readonlyItem)) {
        if (readonlyItem === 'companyNames') {
          element.innerHTML = msg[readonlyItem][0]
        } else if (readonlyItem === 'propertyAddr') {
          element.innerHTML = msg[readonlyItem]
          document.querySelector(`*[extendparam=val22]`).innerHTML = msg[readonlyItem]
          document.querySelector(`*[extendparam=val22]`).classList.remove('input-before')
        } else if (readonlyItem === 'signDate' && msg["signDate"]) {
          let time = new Date(Number(msg["signDate"]));
          let y = time.getFullYear();
          let M = time.getMonth() + 1;
          let D = time.getDate();
          let signDate = `${y}???${M}???${D}???`
          element.innerHTML = signDate
        } else {
          element.innerHTML = msg[readonlyItem]
        }
        element.classList.remove('input-before')
      }
    })
  }
}

// ???????????????
contractConfig.checkboxListener(function () {}, function (obj, index) {
  let attr = obj.currentTarget.getAttribute('name')
  let boxArray = document.getElementsByName(attr);
  if (attr === 'houseUse') {
    let checkIO = {
      4: ['val34'],
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 4) {
            contractConfig.initForm(checkIO[4], 0)
          } else {
            contractConfig.initForm(checkIO[4], 1)
          }
        } else {
          contractConfig.initForm(checkIO[4], 1)
        }
      }
    })
  } else if (attr === 'payment') {
    let checkIO = {
      0: ['val56'],
      1: ['val58', 'val60', 'val61', 'checkbox_loan', 'val62'],
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          contractConfig.initForm(checkIO[i], 0)
          if (i === 0) {
            contractConfig.initForm(checkIO[1], 1)
          } else {
            contractConfig.initForm(checkIO[0], 1)
          }
        } else {
          contractConfig.initForm(checkIO[i], 1)
        }
      }
    })
  } else if (attr === 'negotiation') {
    let checkIO = {
      0: ['checkbox_rights', 'val82'],
      1: ['checkbox_debt'],
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (!item.querySelector('p').getAttribute('checked')) {
          contractConfig.initForm(checkIO[i], 1)
        } else {
          contractConfig.initForm(checkIO[i], 0)
        }
      }
    })
  } else if (attr === 'zhengjianType') {
    let checkIO = {
      0: ['val2011'],
      1: ['val2022'],
      2: ['val2033'],
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (!item.querySelector('p').getAttribute('checked')) {
          contractConfig.initForm(checkIO[i], 1)
        } else {
          contractConfig.initForm(checkIO[i], 0)
        }
      }
    })
  } else if (attr === 'rights') {
    let checkIO = {
      5: ['val82'],
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 5) {
            contractConfig.initForm(checkIO[5], 0)
          } else {
            contractConfig.initForm(checkIO[5], 1)
          }
        } else {
          contractConfig.initForm(checkIO[5], 1)
        }
      }
    })
  }
})

// ???????????????
contractConfig.inputListener(
  function(ev, tip) {
      let max = tip.target.getAttribute("max");
      let textArea = document.getElementById("inputArea");
      if (max) {
          //??????max???????????????????????????????????????????????????
          textArea.setAttribute("maxLength", parseInt(max));
      } else {
          textArea.removeAttribute("maxLength");
      }
      //??????listen??????????????????????????????????????????
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
            let index = toChineseNumber(ev.target.value).indexOf('???')
            document.querySelector(`*[extendParam=${cn_str}_add]`).innerHTML = toChineseNumber(ev.target.value).substring(0, index)+toChineseNumber(ev.target.value).substr(index)
            if (ev.target.value.indexOf(",") == -1) {
              document.querySelector(`*[extendParam=${cn_str}]`).innerHTML = formatMoney(ev.target.value)
            }
          }
      }
  },
  function(tip) {
      //???????????????????????????
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
              let index = toChineseNumber(initVal).indexOf('???')
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
