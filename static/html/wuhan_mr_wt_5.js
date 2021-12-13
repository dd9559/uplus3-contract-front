import { contractConfig, toChineseNumber,formatMoney } from "./base.js"
let sub = {
  'info_val3': {
    stateful: function (index) {
      return document.querySelector('*[extendparam=val3]').innerHTML !== '' ? {'val4': null} : null
    }
  },
  'info_val7': {
    stateful: function (index) {
      return document.querySelector('*[extendparam=val7]').innerHTML !== '' ? {'val8': null} : null
    }
  },
  checkbox_six: null,
  checkbox_seven2: null,
  checkbox_nine: {
    state: true,
    stateful: function(index) {
      if(index == 0 || index == 1) {
        return { 
          checkbox_eleven : null,
          checkbox_twelve: null,
          val21: null,
          val22: null
        }
      }
      else if(index == 2) {
        return { 
          checkbox_fourteen: {
            state: true,
            stateful: function(index) {
              if(index == 0) {
                return {
                  val15: null,
                  checkbox_two: null
                }
              }
            }
          },
          checkbox_three: null
        }
      }
      else {
        return null
      }
    }
  }
}
let Obj = {
  cn_arr: ['val14', 'val15','val21', 'val22']
}
//初始化下拉控件
Dropdown.create({
  classN: 'dropdown-item',
  callBack: function (bindElem, dateObj) {
    if (bindElem.tagName.toLowerCase() === 'input') {
      bindElem.value = dateObj.value
      bindElem.setAttribute('value', bindElem.value)
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
    // ev.target.value = ev.target.value.replace(/[^\d]/g, "")
    let cn_str = tip.target.getAttribute('extendparam')
    if (Obj["cn_arr"].includes(cn_str)) {
      ev.target.value = ev.target.value.replace(/[^\d.]/g, "");
      ev.target.value = ev.target.value.replace(/^\./g, "");
      ev.target.value = ev.target.value.replace(/\.{2,}/g, ".");
      ev.target.value = ev.target.value
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      ev.target.value = ev.target.value.replace(
        /^(\-)*(\d+)\.(\d{0,2}).*$/,
        "$1$2.$3"
      );
    } else {
      ev.target.value = ev.target.value.replace(/[^\d]/g, "");
    }
    tip.target.innerHTML = ev.target.value
    if (Obj['cn_arr'].includes(cn_str)) {
      if (ev.target.value.indexOf(",") != -1) {
        ev.target.value = ev.target.value.replace(/,/g, '')
      }
      if(cn_str == 'val21' || cn_str == 'val22') {
        ev.target.value = ev.target.value<=100 ? ev.target.value : 0
      }
      if(cn_str == 'val21' && ev.target.value!="") {
        document.querySelector(`*[extendparam="val22"]`).innerHTML = (100 - ev.target.value).toFixed(2);
        document.querySelector(`*[extendparam="val22"]`).classList.remove('input-before');
      }
      if(cn_str == 'val22' && ev.target.value!="") {
        document.querySelector(`*[extendparam="val21"]`).innerHTML = (100 - ev.target.value).toFixed(2);
        document.querySelector(`*[extendparam="val21"]`).classList.remove('input-before');
      }
      if(ev.target.value=="") {
        document.querySelector(`*[extendparam="val21"]`).innerHTML = "";
        document.querySelector(`*[extendparam="val22"]`).innerHTML = "";
        document.querySelector(`*[extendparam="val21"]`).classList.add('input-before');
        document.querySelector(`*[extendparam="val22"]`).classList.add('input-before');
      }
      let index = toChineseNumber(ev.target.value).indexOf('元')
      if(document.querySelector(`*[extendparam=${cn_str}_add]`))
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
      if(document.querySelector(`*[extendparam=${strCn}_add]`))
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
  if(attr == 'seven') { 
    let dom_eight = document.querySelectorAll('[name="eight"]');
    let dom_ten = document.querySelectorAll('[name="ten"]');
    dom_eight.forEach(item => {
      if(boxArray[0].querySelector('p').getAttribute('checked')) {
        item.removeAttribute('readonly');
      } else {
        item.setAttribute('readonly','readonly');
        item.querySelector('p').removeAttribute('checked')
      }
    })
    dom_ten.forEach(item => {
      if(boxArray[1].querySelector('p').getAttribute('checked')) {
        item.removeAttribute('readonly');
      } else {
        item.setAttribute('readonly','readonly');
        item.querySelector('p').removeAttribute('checked')
      }
    })
    // 如果选择了办理银行按揭
    if(boxArray[0].querySelector('p').hasAttribute('checked')) {
      sub.checkbox_eight = null;
    } else {
      delete sub.checkbox_eight;
    }
    // 如果选择的是自定义内容
    if(boxArray[1].querySelector('p').hasAttribute('checked')) {
      sub.val20 = null;
      sub.checkbox_ten = null;
    } else {
      delete sub.val20;
      delete sub.checkbox_ten;
    }
  }
  if(attr == 'eight' || 'nine' || 'ten') {
    let checkboxA = [...document.getElementsByClassName('checkA')];
    let checkboxB = [...document.getElementsByClassName('checkB')];
    let twelve0 = document.querySelectorAll('[name="twelve"]')[0];
    let twelve1 = document.querySelectorAll('[name="twelve"]')[1];
    let checkedA = checkboxA.some(item => {
      return item.getAttribute('checked') == 'true';
    })
    let checkedB = checkboxB.some(item => {
      return item.getAttribute('checked') == 'true';
    })
    let p0 = document.querySelectorAll('[name="eleven"]')[0].querySelector('p');
    let p1 = document.querySelectorAll('[name="eleven"]')[1].querySelector('p');
    let d_21 = document.querySelector('[extendparam="val21"]');
    let d_22 = document.querySelector('[extendparam="val22"]');
    checkedA ? p0.setAttribute('checked', 'true') : p0.removeAttribute('checked');
    checkedB ? p1.setAttribute('checked', 'true') : p1.removeAttribute('checked');
    // 如果选择了委托办理人甲方或者乙方
    if(checkedA || checkedB) {
      twelve0.removeAttribute('readonly');
      twelve1.removeAttribute('readonly');
      d_21.removeAttribute('systemparam');
      d_22.removeAttribute('systemparam');
      sub.checkbox_twelve = null;
      sub.val21 = null;
      sub.val22 = null;
    } else {
      twelve0.setAttribute('readonly','readonly');
      twelve1.setAttribute('readonly','readonly');
      d_21.setAttribute('systemparam','true');
      d_22.setAttribute('systemparam','true');
      twelve0.querySelector('p').removeAttribute('checked');
      twelve1.querySelector('p').removeAttribute('checked');
      d_21.innerHTML = '';
      d_22.innerHTML = '';
      d_21.classList.add('input-before');
      d_22.classList.add('input-before');
      delete sub.checkbox_twelve;
      delete sub.val21;
      delete sub.val22;
    }
  }
  if(attr == 'eight') {
    let d_thirteen = document.querySelectorAll('[name="thirteen"]');
    let d_one = document.querySelectorAll('[name="one"]');
    let d_14 = document.querySelector('[extendparam="val14"]');
    let d_14_add = document.querySelector('[extendparam="val14_add"]');
    if(boxArray[2].querySelector('p').getAttribute('checked')) {
      d_thirteen.forEach(item => {
        item.removeAttribute('readonly');
      })
      d_one.forEach(item => {
        item.removeAttribute('readonly');
      })
      d_14.removeAttribute('systemparam');
      // sub.checkbox_thirteen = null;
      sub.checkbox_thirteen =  {
        state: true,
        stateful: function(index) {
          if(index == 0) {
            return {
              val14: null
            }
          }
        }
      }
    } else {
      delete sub.checkbox_thirteen;
      d_one.forEach(item => {
        item.setAttribute('readonly','readonly');
        item.querySelector('p').removeAttribute('checked');
      })
      d_thirteen.forEach(item => {
        item.setAttribute('readonly','readonly');
        item.querySelector('p').removeAttribute('checked');
      })
      d_14.setAttribute('systemparam','true');
      d_14.innerHTML = '';
      d_14_add.innerHTML = '';
      d_14.classList.add('input-before');
    }
  }
  if(attr == 'nine') {
    let d_fourteen = document.querySelectorAll('[name="fourteen"]');
    let d_two = document.querySelectorAll('[name="two"]');
    let d_three = document.querySelectorAll('[name="three"]');
    let d_15 = document.querySelector('[extendparam="val15"]');
    let d_15_add = document.querySelector('[extendparam="val15_add"]');
    if(boxArray[2].querySelector('p').getAttribute('checked')) {
      d_fourteen.forEach(item => {
        item.removeAttribute('readonly');
      })
      d_two.forEach(item => {
        item.removeAttribute('readonly');
      })
      d_three.forEach(item => {
        item.removeAttribute('readonly');
      })
      d_15.removeAttribute('systemparam');
    } else {
      d_fourteen.forEach(item => {
        item.setAttribute('readonly','readonly');
        item.querySelector('p').removeAttribute('checked');
      })
      d_two.forEach(item => {
        item.setAttribute('readonly','readonly');
        item.querySelector('p').removeAttribute('checked');
      })
      d_three.forEach(item => {
        item.setAttribute('readonly','readonly');
        item.querySelector('p').removeAttribute('checked');
      })
      d_15.setAttribute('systemparam','true');
      d_15.innerHTML = '';
      d_15_add.innerHTML = '';
      d_15.classList.add('input-before');
    }
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