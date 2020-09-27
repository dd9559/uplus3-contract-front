import {
  contractConfig,
  toChineseNumber
} from "./base.js"

let Obj = {
  cn_arr: ["val7", "val8", "val9", "val10", 'val220', 'val228', 'val229', 'val232', 'val235', 'val237', 'val239', 'val241', 'val242', 'val248', 'val251']
}

let sub = {
  'val1': null,
  'val2': null,
  'val3': null,
  'val5': null,
  'info_val6': {
    stateful: function () {
      return document.querySelector('*[extendparam=val6]').innerHTML !== '' ? {
        'val7': null,
        'val8': null,
        'val9': null,
        'val10': null,
        'val11': null,
        'val12': null,
        'val13': null,
      } : null
    }
  },
  'info_val14': {
    stateful: function () {
      return document.querySelector('*[extendparam=val14]').innerHTML !== '' ? {
        'val15': null,
        'val16': null,
        'val17': null,
        'val18': null,
        'val19': null,
        'val20': null,
        'val21': null,
      } : null
    }
  },
  'info_val22': {
    stateful: function () {
      return document.querySelector('*[extendparam=val22]').innerHTML !== '' ? {
        'val23': null,
        'val24': null,
        'val25': null,
        'val26': null,
        'val27': null,
        'val28': null,
        'val29': null,
      } : null
    }
  },
  'info_val30': {
    stateful: function () {
      return document.querySelector('*[extendparam=val30]').innerHTML !== '' ? {
        'val31': null,
        'val32': null,
        'val33': null,
        'val34': null,
        'val35': null,
        'val36': null,
        'val37': null,
      } : null
    }
  },
  'val38': null,
  'val39': null,
  'val40': null,
  'val41': null,
  'info_val42': {
    stateful: function () {
      return document.querySelector('*[extendparam=val42]').innerHTML !== '' ? {
        'val43': null,
        'val44': null,
        'val45': null,
        'val46': null,
        'val47': null,
        'val48': null,
        'val49': null,
      } : null
    }
  },
  'info_val50': {
    stateful: function () {
      return document.querySelector('*[extendparam=val50]').innerHTML !== '' ? {
        'val51': null,
        'val52': null,
        'val53': null,
        'val54': null,
        'val55': null,
        'val56': null,
        'val57': null,
      } : null
    }
  },
  'info_val58': {
    stateful: function () {
      return document.querySelector('*[extendparam=val58]').innerHTML !== '' ? {
        'val59': null,
        'val60': null,
        'val61': null,
        'val62': null,
        'val63': null,
        'val64': null,
        'val65': null,
      } : null
    }
  },
  'info_val66': {
    stateful: function () {
      return document.querySelector('*[extendparam=val66]').innerHTML !== '' ? {
        'val67': null,
        'val68': null,
        'val69': null,
        'val70': null,
        'val71': null,
        'val72': null,
        'val73': null,
      } : null
    }
  },
  'checkbox_one': null,
  'val210': null,
  'checkbox_two': {
    stateful: function (index) {
      return index === 6 ? {
        'val211': null,
      } : null
    }
  },
  'checkbox_three': {
    stateful: function (index) {
      return index === 3 ? {
        'val212': null,
      } : null
    }
  },
  'checkbox_four': null,
  'checkbox_five': {
    stateful: function (index) {
      let obj;
      if (document.querySelector('*[extendparam=val216]').innerHTML !== '') {
        obj = { 'val216': null }
      } else if (document.querySelector('*[extendparam=val217]').innerHTML !== '') {
        obj = { 'val217': null }
      } else {
        obj = { 'val216': null, 'val217': null }
      }
      return index === 0 ? {
        'val213': null,
        'val214': null,
        'val215': null,
      } : index === 1 ? Object.assign(obj, {
        'val218': null,
        'checkbox_fiveOne': null,
      }) : null
    }
  },
  'checkbox_six': {
    stateful: function (index) {
      let obj = document.querySelectorAll('*[inputmethod=val222]')[0].value === '2' ? { 'checkbox_sixOne': null, 'val223': null } : document.querySelectorAll('*[inputmethod=val222]')[0].value === '3' ? { 'checkbox_sixTwo': null, 'checkbox_sixThree': null, 'checkbox_sixFour': null } : {}
      return index === 0 ? null : Object.assign({ 'val219': null, 'val220': null, 'val221': null, "drapdown_val222": null }, obj)
    }
  },
  'checkbox_seven': {
    stateful: function (index) {
      let obj = document.querySelectorAll('*[inputmethod=val225]')[0].value === '1' ? { 'checkbox_sevenOne': null, 'checkbox_sevenTwo': null, 'checkbox_sevenThree': null } : {}
      return index === 0 ? null : Object.assign({ 'time_val224': null, 'drapdown_val225': null }, obj)
    }
  },
  'val228': null,
  'checkbox_eightOne': null,
  'val229': null,
  'checkbox_eightTwo': null,
  'checkbox_eightThree': null,
  'val230': null,
  'val231': null,
  'val232': null,
  'val233': null,
  'checkbox_eightFour': null,
  'checkbox_nine': {
    stateful: function (index) {
      return index === 0 ? null : { 'checkbox_nineFive': null, 'val242': null, 'checkbox_nineSix1': null, 'val243': null, 'checkbox_nineSix2': null, 'val244': null, 'val246': null }
    }
  },
  'val234': null,
  'checkbox_nineOne': null,
  'val235': null,
  'val236': null,
  'val237': null,
  'checkbox_nineTwo': null,
  'val238': null,
  'val239': null,
  'checkbox_nineThree': null,
  'val240': null,
  'val241': null,
  'checkbox_nineFour': null,
  'checkbox_nineSeven': null,
  'val248': null,
  'val249': null,
  'checkbox_nineEight': null,
  'checkbox_nineTen': {
    stateful: function (index) {
      return index === 1 ? { 'val251': null, 'val252': null, 'checkbox_nineEleven': null } : null
    }
  },
  'val253': null,
  'checkbox_twelve': {
    stateful: function (index) {
      let obj;
      switch (index) {
        case 0:
          obj = { 'val254': null }
          break;
        case 1:
          obj = { 'val255': null, 'val256': null }
          break;
        case 2:
          obj = { 'val257': null }
          break;
        case 3:
          obj = { 'val258': null, 'val259': null }
          break;
        default:
          obj = { 'val260': null }
          break;
      }
      return obj
    }
  },
  'val261': null,
  'drapdown_val263': {
    stateful: function (index) {
      return index === '1' ? { 'val264': null } : index === '2' ? { 'val265': null } : { 'val266': null }
    }
  },
  'val277': null,
  'val279': null,
  'val280': null,
  'val281': null,
  'val282': null,
  'val283': null,
  'val284': null,
  'val286': null,
}

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

//初始化时间控件
Calendar.create({
  classN: 'calendar-item',
  callBack: function (bindElem, dateObj) {
    if (bindElem.tagName.toLowerCase() === 'input') {
      bindElem.value = `${dateObj.year}年${dateObj.month}月${dateObj.date}日`
      bindElem.setAttribute('value', bindElem.value)
      bindElem.setAttribute('random', dateObj.random)
    }
  }
})
//初始化下拉控件
Dropdown.create({
  classN: 'dropdown-item',
  callBack: function (bindElem, dateObj) {
    if (bindElem.tagName.toLowerCase() === 'input') {
      bindElem.value = dateObj.value
      bindElem.setAttribute('value', bindElem.value)
      let attr = bindElem.getAttribute('inputmethod')
      if (attr) {

        if (attr === 'val222') {
          contractConfig.prohibit(bindElem, ['1', '2', '3'], 'val222')
          contractConfig.initForm(['checkbox_sixOne', 'val223', 'checkbox_sixTwo', 'checkbox_sixThree', 'checkbox_sixFour'], 0)
        }
        if (attr === 'val225') {
          contractConfig.prohibit(bindElem, ['1', '2'], 'val225')
          contractConfig.initForm(['checkbox_sevenOne', 'val226', 'checkbox_sevenTwo', 'val227', 'checkbox_sevenThree'], 0)
        }
        if (attr === 'val263') {
          contractConfig.prohibit(bindElem, ['1', '2', '3'], 'val263')
          contractConfig.initForm(['val264', 'val265', 'val266'], 0)
        }
        // if (attr === 'handle') {
        //   contractConfig.prohibit(bindElem, ['a', 'b'], 'handle')
        // }
      }
    } else {
      bindElem.innerHTML = dateObj.value
      bindElem.classList.remove('input-select')
      bindElem.classList.remove('input-before')
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

contractConfig.checkboxListener(function () { }, function (obj, index) {
  let attr = obj.currentTarget.getAttribute('name')
  let boxArray = document.getElementsByName(attr);
  if (attr === 'two') {
    let checkIO = {
      6: ['val211'],
    }
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 6) {
            contractConfig.initForm(checkIO[6], 0)
          } else {
            contractConfig.initForm(checkIO[6], 1)
          }
        } else {
          contractConfig.initForm(checkIO[6], 1)
        }
      }
    })
  }
  if (attr === 'three') {
    let checkIO = {
      3: ['val212'],
    }
    boxArray.forEach((item, i) => {
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
  }
  if (attr === 'five') {
    let checkIO = {
      0: {
        write: ['val213', 'val214', 'val215'],
        disabled: ['val216', 'val217', 'val218', 'checkbox_fiveOne']
      },
      1: {
        write: ['val216', 'val217', 'val218', 'checkbox_fiveOne'],
        disabled: ['val213', 'val214', 'val215']
      },
    }
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          contractConfig.initForm(checkIO[i].write, 0)
          contractConfig.initForm(checkIO[i].disabled, 1)
        }
      }
    })
  }
  if (attr === 'six') {
    let checkIO = {
      0: {
        disabled: ['val219', 'val220', 'val221', 'val222', 'checkbox_sixOne', "val223", "checkbox_sixTwo", "checkbox_sixThree", "checkbox_sixFour"]
      },
    }
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 0) {
            contractConfig.initForm(checkIO[0].disabled, 1)
          } else {
            contractConfig.initForm(checkIO[0].disabled, 0)
          }
        }
      }
    })
  }
  if (attr === 'seven') {
    let checkIO = {
      0: {
        disabled: ['val224', 'val225', 'checkbox_sevenOne', 'val226', 'checkbox_sevenTwo', 'val227', 'checkbox_sevenThree']
      },
    }
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 1) {
            contractConfig.initForm(checkIO[0].disabled, 0)
          } else {
            contractConfig.initForm(checkIO[0].disabled, 1)
          }
        }
      }
    })
  }
  if (attr === 'sevenOne') {
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i !== 2) {
            contractConfig.initForm(['val226'], 1)
          } else {
            contractConfig.initForm(['val226'], 0)
          }
        }
      }
    })
  }
  if (attr === 'sevenTwo') {
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i !== 2) {
            contractConfig.initForm(['val227'], 1)
          } else {
            contractConfig.initForm(['val227'], 0)
          }
        }
      }
    })
  }
  if (attr === 'nine') {
    let checkIO = ['checkbox_nineFive', 'val242', 'checkbox_nineSix1', 'val243', 'checkbox_nineSix2', 'val244', 'checkbox_nineSix', 'val245', 'val246']
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 0) {
            contractConfig.initForm(checkIO, 1)
          } else {
            contractConfig.initForm(checkIO, 0)
          }
        }
      }
    })
  }
  if (attr === 'nineNine') {
    let checkIO = ['val250']
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 0) {
            contractConfig.initForm(checkIO, 0)
          } else {
            contractConfig.initForm(checkIO, 1)
          }
        }
      }
    })
  }
  if (attr === 'nineTen') {
    let checkIO = ['val250']
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 0) {
            contractConfig.initForm(checkIO, 0)
          } else {
            contractConfig.initForm(checkIO, 1)
          }
        }
      }
    })
  }
  if (attr === 'twelve') {
    let checkIO = {
      0: {
        write: ['val254'],
        desabled: ['val255', 'val256', 'val257', 'val259', 'val260']
      },
      1: {
        write: ['val255', 'val256'],
        desabled: ['val254', 'val257', 'val259', 'val260']
      },
      2: {
        write: ['val257'],
        desabled: ['val255', 'val256', 'val254', 'val259', 'val260']
      },
      3: {
        write: ['val259'],
        desabled: ['val255', 'val256', 'val257', 'val254', 'val260']
      },
      4: {
        write: ['val260'],
        desabled: ['val255', 'val256', 'val257', 'val259', 'val254']
      }
    }
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          contractConfig.initForm(checkIO[i].write, 0)
          contractConfig.initForm(checkIO[i].desabled, 1)
        }
      }
    })
  }
  if (attr === 'eighteen') {
    let checkIO = ['val270']
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 1) {
            contractConfig.initForm(checkIO, 1)
          } else {
            contractConfig.initForm(checkIO, 0)
          }
        }
      }
    })
  }
})

//基础数据赋值
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
// let msg = {
//   code: "S0001191107007",
//   companyNames: ["金银湖三级门店哦"],
//   guestCardType: "军官证",
//   guestCardTypes: "11111111",
//   guestID: "132",
//   guestIDs: "11.22,333",
//   guestName: "然迪生",
//   guestNames: "eeeeee",
//   guestTel: "13011111111",
//   guestTels: "",
//   id: 3354,
//   isentrust: 1,
//   ownerCardType: "营业执照",
//   ownerCardTypes: "22222222",
//   ownerID: "123",
//   ownerIDs: "11.22,333",
//   ownerName: "熊先",
//   ownerNames: "sffffs",
//   ownerTel: "18888888888",
//   ownerTels: "",
//   propertyAddr: "a市b区c",
//   singleCompany: "是的噶几开会说",
//   dealPrice: 1000,
//   dealPriceUpper: '壹仟',
//   square: 160,
//   guestStoreRegisterCode: '213',
//   signDate: 1592465819508,
//   organizationCode: "8888888888"
// }
for (let readonlyItem in msg) { //得到readonly的值
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
  let readonlyArr = ['code', 'ownerTel', 'ownerCardType', 'organizationCode', 'guestCardTypes', 'guestIDs', 'ownerTels', 'ownerCardTypes', 'guestTel', 'ownerName', 'ownerID', 'ownerNames', 'ownerIDs', 'guestName', 'guestCardType', 'guestID', 'guestNames', 'guestIDs', 'propertyAddr', 'dealPrice', 'dealPriceUpper', 'companyNames', 'guestStoreRegisterCode', 'signDate']
  if (onlyReadDom.length > 0) {
    onlyReadDom.forEach((element, index) => {
      if (readonlyArr.includes(readonlyItem)) {
        if (readonlyItem === 'companyNames') {
          element.innerHTML = msg[readonlyItem][0]
        } else if (readonlyItem === 'signDate' && msg["signDate"]) {
          let time = new Date(Number(msg["signDate"]));
          let y = time.getFullYear();
          let M = time.getMonth() + 1;
          let D = time.getDate();
          let signDate = `${y}年${M}月${D}日`
          element.innerHTML = signDate
        }
        // else if (readonlyItem === 'ownerNames') {
        //   if (msg[readonlyItem] != '') {
        //     element.innerHTML = msg[readonlyItem]
        //   } else {
        //     delete sub['val200'];
        //     delete sub['val201'];
        //   }
        // } else if (readonlyItem === 'guestNames') {
        //   if (msg[readonlyItem] != '') {
        //     element.innerHTML = msg[readonlyItem]
        //   } else {
        //     delete sub['val205'];
        //     delete sub['val206'];
        //   }
        // }
        else {
          element.innerHTML = msg[readonlyItem]
        }
        element.classList.remove('input-before')
      }
    })
  }
}

//输入自适应
contractConfig.inputListener(function (ev, tip) {
  if (tip.target.getAttribute('extendParam') == 'val216' && document.querySelector('*[extendparam=val216]').innerHTML !== '') {
    contractConfig.initForm(['val217'], 1)
  } else if (tip.target.getAttribute('extendParam') == 'val217' && document.querySelector('*[extendparam=val217]').innerHTML !== '') {
    contractConfig.initForm(['val216'], 1)
  }
  if (tip.target.getAttribute('extendParam') == 'val202' && document.querySelector(`span[extendParam=val202]`).innerHTML != '') {
    sub.val203 = null
    sub.val204 = null
  }
  if (tip.target.getAttribute('extendParam') == 'val207' && document.querySelector(`span[extendParam=val207]`).innerHTML != '') {
    sub.val208 = null
    sub.val209 = null
  }
  let max = tip.target.getAttribute('max')
  let textArea = document.getElementById('inputArea')
  if (max) { //监听max属性，判断文本框是有有输入长度限制
    textArea.setAttribute('maxLength', parseInt(max))
  } else {
    textArea.removeAttribute('maxLength')
  }
  //监听listen属性，判断是否有输入类型限制
  let spanAttr = tip.target.getAttribute('listen')
  if (spanAttr === 'number') {
    ev.target.value = ev.target.value.replace(/[^\d]/g, "")
    tip.target.innerHTML = ev.target.value
    let cn_str = tip.target.getAttribute('extendparam')
    if (Obj['cn_arr'].includes(cn_str)) {
      document.querySelector(`*[extendparam=${cn_str}_add]`).innerHTML = toChineseNumber(ev.target.value)
    }
  }
}, function (tip) {
  //获取输入框的默认值
  let initVal = tip.target.innerHTML
  let strCn = tip.target.getAttribute('extendparam')
  if (Obj['cn_arr'].includes(strCn)) {
    if (initVal.length > 0) {
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal)
    } else {
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
    }
  }
})
