import { contractConfig, toChineseNumber } from "./base.js"
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
      return index === 0 ? {'val5':null,'val6':null} : null
    }
  },
  'checkbox_prove': {
    stateful: function (index) {
      let res = null
      switch (index) {
        case 0:
          res = { 'val7': null }
          break;
        case 1:
          res = { 'val8': null }
          break;
        case 2:
          res = { 'val9': null }
          break;
        case 3:
          res = { 'val10': null }
          break;
        case 4:
          res = { 'val11': null }
          break;
        default:
          res = null
          break;
      }
      return res
    }
  },
  'checkbox_facility': {
    state:true,
    stateful: function (index) {
      return index == 5 ? {'val12':null}:null
    }
  },
  'val13': null,
  'val14': null,
  'val15': null,
  'val16': null,
  'val18': null,
  'val19': null,
  'val20': null,
  'val21': null,
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
  'parties1': null,
  'info_val35': {
    stateful: function () {
      return document.querySelector('*[extendparam=val35]').innerHTML !== '' ? {'val35': null} : document.querySelector('*[extendparam=val36]').innerHTML !== '' ?
      {'val36': null} : {'val35': null,'val36': null}
    }
  },
  'info_val37': {
    stateful: function () {
      return document.querySelector('*[extendparam=val37]').innerHTML !== '' ? {'val37': null} : document.querySelector('*[extendparam=val38]').innerHTML !== '' ?
      {'val38': null} : {'val37': null,'val38': null}
    }
  },
  'info_val39': {
    stateful: function () {
      return document.querySelector('*[extendparam=val39]').innerHTML !== '' ? {'val39': null} : document.querySelector('*[extendparam=val40]').innerHTML !== '' ?
      {'val40': null} : {'val39': null,'val40': null}
    }
  },
  'val50':null,
  'val55': null,
  'val56': null,
  'val57': null,
  'checkbox_accessCard': {
    stateful: function (index) {
      return index === 0 ? {'val58':null}:null
    }
  },
  'info_val59': {
    stateful: function () {
      return document.querySelector('*[extendparam=val59]').innerHTML !== '' ? {
        'val60': null,
        'checkbox_refrigerator':null
      } : null
    }
  },
  'info_val61': {
    stateful: function () {
      return document.querySelector('*[extendparam=val61]').innerHTML !== '' ? {
        'val62': null,
        'checkbox_microwaveOven':null
      } : null
    }
  },
  'info_val63': {
    stateful: function () {
      return document.querySelector('*[extendparam=val63]').innerHTML !== '' ? {
        'val64': null,
        'checkbox_washer':null
      } : null
    }
  },
  'info_val65': {
    stateful: function () {
      return document.querySelector('*[extendparam=val65]').innerHTML !== '' ? {
        'val66': null,
        'checkbox_calorifier':null
      } : null
    }
  },
  'info_val67': {
    stateful: function () {
      return document.querySelector('*[extendparam=val67]').innerHTML !== '' ? {
        'val68': null,
        'checkbox_airConditioner':null
      } : null
    }
  },
  'info_val69': {
    stateful: function () {
      return document.querySelector('*[extendparam=val69]').innerHTML !== '' ? {
        'val70': null,
        'checkbox_television':null
      } : null
    }
  },
  'info_val74': {
    stateful: function () {
      return document.querySelector('*[extendparam=val74]').innerHTML !== '' ? {
        'val75': null,
        'checkbox_kitchen':null
      } : null
    }
  },
  'info_val76': {
    stateful: function () {
      return document.querySelector('*[extendparam=val76]').innerHTML !== '' ? {
        'val77': null,
        'checkbox_stove':null
      } : null
    }
  },
  'info_val78': {
    stateful: function () {
      return document.querySelector('*[extendparam=val78]').innerHTML !== '' ? {
        'val79': null,
        'checkbox_phone':null
      } : null
    }
  },
  'val95': null,
  'val97': null,
  'val99': null,
}
let Obj = {
  cn_arr: ['val20', 'val21', 'val23', 'val27', 'val28',]
}
//?????????????????????
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
      bindElem.value = `${dateObj.year}???${dateObj.month}???${dateObj.date}???`
      bindElem.setAttribute('value', bindElem.value)
      bindElem.setAttribute('random', dateObj.random)
    }
  }
})

//???????????????
contractConfig.inputListener(function (ev, tip) {
  let max = tip.target.getAttribute('max')
  let textArea = document.getElementById('inputArea')
  if (max) { //??????max???????????????????????????????????????????????????
    textArea.setAttribute('maxLength', parseInt(max))
  } else {
    textArea.removeAttribute('maxLength')
  }
  //??????listen??????????????????????????????????????????
  let spanAttr = tip.target.getAttribute('listen')
  if (spanAttr === 'number') {
    ev.target.value = ev.target.value.replace(/[^\d]/g, "")
    tip.target.innerHTML = ev.target.value
    let cn_str = tip.target.getAttribute('extendparam')
    if (Obj['cn_arr'].includes(cn_str)) {
      let index = toChineseNumber(ev.target.value).indexOf('???')
      document.querySelector(`*[extendparam=${cn_str}_add]`).innerHTML = toChineseNumber(ev.target.value).substring(0, index)
    }
  }
}, function (tip) {
  //???????????????????????????
  let initVal = tip.target.innerHTML
  let strCn = tip.target.getAttribute('extendparam')
  if (Obj['cn_arr'].includes(strCn)) {
    if (initVal.length > 0) {
      let index = toChineseNumber(initVal).indexOf('???')
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal).substring(0, index)
    } else {
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
    }
  }
})

// ???????????????
contractConfig.checkboxListener(function () { }, function (obj, index) {
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
        disabled:['val8', 'val9', 'val10', 'val11'],
        write:['val7']
      },
      1: {
        disabled:['val7', 'val9', 'val10', 'val11'],
        write:['val8']
      },
      2: {
        disabled:['val7', 'val8', 'val10', 'val11'],
        write:['val9']
      },
      3: {
        disabled:['val7', 'val8', 'val9', 'val11'],
        write:['val10']
      },
      4: {
        disabled:['val7', 'val8', 'val9', 'val10'],
        write:['val11']
      }
    }
    boxArray.forEach((item, i) => {
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          contractConfig.initForm(checkIO[i].disabled, 1)
          contractConfig.initForm(checkIO[i].write, 0)
        } else {
          contractConfig.initForm(checkIO[i], 0)
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


//???????????????????????????
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

//??????????????????
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
// let msg = {
//   code: "S0001191107007",
//   companyNames: ["????????????????????????"],
//   guestCardType: "?????????",
//   guestCardTypes: "",
//   guestID: "132",
//   guestIDs: "",
//   guestName: "????????????",
//   guestNames: "",
//   guestTel: "13011111111",
//   guestTels: "",
//   id: 3354,
//   isentrust: 1,
//   ownerCardType: "????????????",
//   ownerCardTypes: "",
//   ownerID: "123",
//   ownerIDs: "",
//   ownerName: "??????",
//   ownerNames: "",
//   ownerTel: "18888888888",
//   ownerTels: "",
//   signDate: 1592465819508,
//   propertyAddr: "a???b???c",
//   singleCompany: "",
// }
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
        let signDate = `${y}???${M}???${D}???`
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