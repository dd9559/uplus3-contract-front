import { contractConfig, toChineseNumber,formatMoney } from "./base.js"
let sub = {
  'info_val116': {
    stateful: function (index) {
      return document.querySelector('*[extendparam=val116]').innerHTML !== '' ? {'val117': null} : null
    }
  },
  'info_val118': {
    stateful: function (index) {
      return document.querySelector('*[extendparam=val118]').innerHTML !== '' ? {'val119': null} : null
    }
  },
  'val1': null,
  'val2': null,
  'checkbox_one': null,
  'checkbox_two': null,
  'val3': null,
  'checkbox_three': {
    state:true,
    stateful: function (index) {
      return index === 5 ? {'val4': null} : null
    }
  },
  'val5': null,
  'val6': null,
  'val7': null,
  'val8': null,
  'val9': null,
  'val10': null,
  'val11': null,
  'checkbox_four': null,
  'checkbox_five': null,
  'checkbox_four': null,
  'val12': null,
  'val13': null,
  'val14': null,
  'checkbox_six': null,
  'val15': null,
  'val17': null,
  'checkbox_seven': null,
  'checkbox_eight': {
    stateful: function (index) {
      return index === 0 ? {'checkbox_nine': {
        stateful: function (index) {
          return index === 2 ? {'val19': null} : null
        }
      }} : null
    }
  },
  // 'checkbox_nine': null,
  // 'val19': null,
  'info_val120': {
    stateful: function (index) {
      return document.querySelector('*[extendparam=val120]').innerHTML !== '' ? {'val121': null} : null
    }
  },
  'info_val122': {
    stateful: function (index) {
      return document.querySelector('*[extendparam=val122]').innerHTML !== '' ? {'val123': null} : null
    }
  },
  'val102': null,
  'val103': null,
  'val104': null,
  'val105': null,
  'info_val333': {
    stateful: function () {
      return document.querySelector('*[extendparam=val333]') ? {'val333': null} : null
    }
  },
  'info_val444': {
    stateful: function () {
      return document.querySelector('*[extendparam=val444]') ? {'val444': null} : null
    }
  },
  // old
}
let Obj = {
  cn_arr: ['val10', 'val11', 'val15', 'val19', 'val104','val105']
}
//εε§εδΈζζ§δ»Ά
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
      bindElem.value = `${dateObj.year}εΉ΄${dateObj.month}ζ${dateObj.date}ζ₯`
      bindElem.setAttribute('value', bindElem.value)
      bindElem.setAttribute('random', dateObj.random)
    }
  }
})

//θΎε₯θͺιεΊ
contractConfig.inputListener(function (ev, tip) {
  let max = tip.target.getAttribute('max')
  let textArea = document.getElementById('inputArea')
  if (max) { //ηε¬maxε±ζ§οΌε€ζ­ζζ¬ζ‘ζ―ζζθΎε₯ιΏεΊ¦ιεΆ
    textArea.setAttribute('maxLength', parseInt(max))
  } else {
    textArea.removeAttribute('maxLength')
  }
  //ηε¬listenε±ζ§οΌε€ζ­ζ―ε¦ζθΎε₯η±»ειεΆ
  let spanAttr = tip.target.getAttribute('listen')
  if (spanAttr === 'number') {
    ev.target.value = ev.target.value.replace(/[^\d]/g, "")
    tip.target.innerHTML = ev.target.value
    let cn_str = tip.target.getAttribute('extendparam')
    if (Obj['cn_arr'].includes(cn_str)) {
      if (ev.target.value.indexOf(",") != -1) {
        ev.target.value = ev.target.value.replace(/,/g, '')
      }
      let index = toChineseNumber(ev.target.value).indexOf('ε')
      document.querySelector(`*[extendparam=${cn_str}_add]`).innerHTML = toChineseNumber(ev.target.value).substring(0, index)
      if (ev.target.value.indexOf(",") == -1) {
        document.querySelector(`*[extendparam=${cn_str}]`).innerHTML = formatMoney(ev.target.value)
      }
    }
  }
}, function (tip) {
  //θ·εθΎε₯ζ‘ηι»θ?€εΌ
  let initVal = tip.target.innerHTML
  let strCn = tip.target.getAttribute('extendparam')
  if (Obj['cn_arr'].includes(strCn)) {
    if (initVal.length > 0) {
      if (initVal.indexOf(",") != -1) {
          initVal = initVal.replace(/,/g, '');
      }
      let index = toChineseNumber(initVal).indexOf('ε')
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal).substring(0, index)
      if (initVal.indexOf(",") == -1) {
          document.querySelector(`*[extendparam=${strCn}]`).innerHTML = formatMoney(initVal)
      }
    } else {
        document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
    }
  }
})

// εΎιζ‘ι»θΎ
contractConfig.checkboxListener(function () { }, function (obj, index) {
  let attr = obj.currentTarget.getAttribute('name')
  let boxArray = document.getElementsByName(attr);
  if (attr === 'three') {
    let checkIO = ['val4']
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 5) {
            contractConfig.initForm(checkIO, 0)
          }
        } else {
          contractConfig.initForm(checkIO, 1)
        }
      }
    })
  }
})


//η»ζι?ζ·»ε ηΉε»δΊδ»Ά
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

//εΊη‘ζ°ζ?θ΅εΌ
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
// let msg = {
//   code: "S0001191107007",
//   companyNames: ["ιιΆζΉδΈηΊ§ι¨εΊε¦"],
//   guestCardType: "εε?θ―",
//   guestCardTypes: "",
//   guestID: "132",
//   guestIDs: "",
//   guestName: "ηΆη±θΏͺη",
//   guestNames: "",
//   guestTel: "13011111111",
//   guestTels: "",
//   id: 3354,
//   isentrust: 1,
//   ownerCardType: "θ₯δΈζ§η§",
//   ownerCardTypes: "",
//   ownerID: "123",
//   ownerIDs: "",
//   ownerName: "ηε",
//   ownerNames: "",
//   ownerTel: "18888888888",
//   ownerTels: "",
//   signDate: 1592465819508,
//   propertyAddr: "aεΈbεΊc",
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
        let signDate = `${y}εΉ΄${M}ζ${D}ζ₯`
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