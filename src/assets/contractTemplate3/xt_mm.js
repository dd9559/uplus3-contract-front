import { contractConfig, toChineseNumber,formatMoney } from "./base.js"
let sub = {
  'info_val5': {
    stateful: function (index) {
      return document.querySelector('*[extendparam=val5]').innerHTML !== '' ? {'val6': null} : null
    }
  },
  'info_val11': {
    stateful: function (index) {
      return document.querySelector('*[extendparam=val11]').innerHTML !== '' ? {'val12': null} : null
    }
  },
  'checkbox_one': null,
  'val14': null,
  'val15': null,
  'val16': null,
  'val17': null,
  'val18': null,
  'val19': null,
  'info_val20': {
    stateful: function (index) {
      return document.querySelector('*[extendparam=val20]').innerHTML !== '' ? {'val21': null} : null
    }
  },
  'drapdown_val22': {
    stateful: function (index) {
      return index === '(1)' ? {'drapdown_val23': {
        stateful: function (index1) {
          return index1 === '①' ? {'time_val24': null,'val25': null} : {'time_val26': null,'val27': null,'val28': null}
        }
      }} : {'time_val29':null,'val30':null,'time_val31':null}
    }
  },
  'drapdown_val32': {
    stateful: function (index) {
      return index === '(1)' ? {'val33':null} : index === '(2)' ? {'val34':null} : {'val35':null}
    }
  },
  'drapdown_val36': {
    stateful: function (index) {
      return index === '(3)' ? {'time_val37':null,'val38':null,'val39':null,'val40':null} : null
    }
  },
  'val41': null,
  'val42': null,
  'drapdown_val43': {
    stateful: function (index) {
      return index === '(2)' ? {'val44':null} : index === '(3)' ? {'val45':null,'val46':null} : null
    }
  },
  'val47': null,
  'val48': null,
}
let Obj = {
  cn_arr: ['val17', 'val19', 'val21', 'val25', 'val27', 'val28', 'val30', 'val38', 'val39', 'val48']
}

//初始化下拉控件
Dropdown.create({
  classN: 'dropdown-item',
  callBack: function (bindElem, dateObj) {
    if (bindElem.tagName.toLowerCase() === 'input') {
      bindElem.value = dateObj.value
      bindElem.setAttribute('value', bindElem.value)
      let obj = {
        'val22': {
          '(1)': {
            'write': ['val23','val24','val25','val26','val27','val28'],
            'disabled':  ['val29','val30','val31']
          },
          '(2)': {
            'disabled': ['val23','val24','val25','val26','val27','val28'],
            'write':  ['val29','val30','val31']
          }
        },
        'val23': {
          '①': {
            'write': ['val24','val25'],
            'disabled': ['val26','val27','val28']
          },
          '②': {
            'write': ['val26','val27','val28'],
            'disabled': ['val24','val25']
          }
        },
        'val32': {
          '(1)': {
            'write': ['val33'],
            'disabled': ['val34','val35']
          },
          '(2)': {
            'write': ['val34'],
            'disabled': ['val33','val35']
          },
          '(3)': {
            'write':['val35'],
            'disabled': ['val33','val34']
          }
        },
        'val36': {
          '(1)': {
            'write': [],
            'disabled': ['val37','val38','val39','val40']
          },
          '(2)': {
            'write': [],
            'disabled': ['val37','val38','val39','val40']
          },
          '(3)': {
            'write':['val37','val38','val39','val40'],
            'disabled': []
          }
        },
        'val43': {
          '(1)': {
            'write': [],
            'disabled': ['val44','val45','val46']
          },
          '(2)': {
            'write': ['val44'],
            'disabled': ['val45','val46']
          },
          '(3)': {
            'write':['val45','val46'],
            'disabled': ['val44']
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

//输入自适应
contractConfig.inputListener(function (ev, tip) {
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
      if (ev.target.value.indexOf(",") != -1) {
        ev.target.value = ev.target.value.replace(/,/g, '')
      }
      let index = toChineseNumber(ev.target.value).indexOf('元')
      document.querySelector(`*[extendparam=${cn_str}_add]`).innerHTML = toChineseNumber(ev.target.value).substring(0, index)
      if (ev.target.value.indexOf(",") == -1) {
        document.querySelector(`*[extendparam=${cn_str}]`).innerHTML = formatMoney(ev.target.value)
      }
    }
  }
}, function (tip) {
  //获取输入框的默认值
  let initVal = tip.target.innerHTML
  let strCn = tip.target.getAttribute('extendparam')
  if (Obj['cn_arr'].includes(strCn)) {
    if (initVal.length > 0) {
      if (initVal.indexOf(",") != -1) {
          initVal = initVal.replace(/,/g, '');
      }
      let index = toChineseNumber(initVal).indexOf('元')
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal).substring(0, index)
      if (initVal.indexOf(",") == -1) {
          document.querySelector(`*[extendparam=${strCn}]`).innerHTML = formatMoney(initVal)
      }
    } else {
        document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
    }
  }
})

// 勾选框逻辑
contractConfig.checkboxListener(function () { }, function (obj, index) {
  let attr = obj.currentTarget.getAttribute('name')
  let boxArray = document.getElementsByName(attr);
})


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