import {
  contractConfig,
  toChineseNumber
} from "./base.js"

let Obj = {
  cn_arr: []
}

let sub = {
  // 'checkbox_one': null,
  // 'val210': null,
  // 'checkbox_two': {
  //   stateful: function (index) {
  //     return index === 6 ? {
  //       'val211': null,
  //     } : null
  //   }  
  // },
  // 'checkbox_three': {
  //   stateful: function (index) {
  //     return index === 3 ? {
  //       'val212': null,
  //     } : null
  //   }
  // },
  // 'checkbox_four': null,
  'checkbox_five': {
    stateful: function (index) {
      return index === 0 ? {
        'val213': null,
        'val214': null,
        'val215': null,
      } : index === 1 ? Object.assign(document.querySelector('*[extendparam=val216]').innerHTML !== '' ? {'val216': null}:
      document.querySelector('*[extendparam=val217]').innerHTML !== ''?{'val217': null}:{'val216': null,'val217': null},{
        'val218': null,
        'checkbox_fiveOne': null,
      }) : null
    }
  },
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
        contractConfig.initForm(Obj[attr === 'pay' ? 'part3' : attr === 'handle' ? 'part5' : attr === "deal" ? 'part6' : 'part7'], 0)
        if (attr === 'pay') {
          contractConfig.prohibit(bindElem, ['(一)', '(二)', '(三)'], 'pay')
        }
        if (attr === 'deal') {
          contractConfig.prohibit(bindElem, ['a', 'b', 'c'], 'deal')
        }
        if (attr === 'solve') {
          contractConfig.prohibit(bindElem, ['1', '2', '3', '4'], 'solve')
        }
        if (attr === 'handle') {
          contractConfig.prohibit(bindElem, ['a', 'b'], 'handle')
        }
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

contractConfig.checkboxListener(function () {}, function (obj, index) {
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
})

//基础数据赋值
// let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
let msg = {
  code: "S0001191107007",
  companyNames: ["金银湖三级门店哦"],
  guestCardType: "军官证",
  guestCardTypes: "11111111",
  guestID: "132",
  guestIDs: "11.22,333",
  guestName: "然迪生",
  guestNames: "eeeeee",
  guestTel: "13011111111",
  guestTels: "",
  id: 3354,
  isentrust: 1,
  ownerCardType: "营业执照",
  ownerCardTypes: "22222222",
  ownerID: "123",
  ownerIDs: "11.22,333",
  ownerName: "熊先",
  ownerNames: "sffffs",
  ownerTel: "18888888888",
  ownerTels: "",
  propertyAddr: "a市b区c",
  singleCompany: "是的噶几开会说",
  dealPrice: 1000,
  dealPriceUpper: '壹仟',
  square: 160,
  guestStoreRegisterCode: '213',
  signDate: 1592465819508,
  organizationCode: "8888888888"
}
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
