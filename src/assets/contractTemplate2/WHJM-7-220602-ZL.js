import { contractConfig, toChineseNumber,formatMoney } from "./base.js"
let sub = {
  // 'info_val116': {
  //   stateful: function (index) {
  //     return document.querySelector('*[extendparam=val116]').innerHTML !== '' ? {'val117': null} : null
  //   }
  // },
  // 'info_val118': {
  //   stateful: function (index) {
  //     return document.querySelector('*[extendparam=val118]').innerHTML !== '' ? {'val119': null} : null
  //   }
  // },
  // 'val1': null,
  // 'val2': null,
  // 'checkbox_one': {
  //   stateful: function(index) {
  //     return index === 3 ? {'val555': null} : null
  //   }
  // },
  // 'checkbox_two': null,
  // 'val3': null,
  // 'checkbox_three': {
  //   state:true,
  //   stateful: function (index) {
  //     return index === 5 ? {'val4': null} : null
  //   }
  // },
  // 'val5': null,
  // 'val6': null,
  // 'val7': null,
  // 'val8': null,
  // 'val9': null,
  // 'val10': null,
  // 'val11': null,
  // 'checkbox_four': null,
  // 'checkbox_five': null,
  // 'checkbox_four': null,
  // 'val12': null,
  // 'val13': null,
  // 'val14': null,
  // 'checkbox_six': null,
  // 'val15': null,
  // 'val17': null,
  // 'checkbox_seven': null,
  'checkbox_eight': {
    stateful: function (index) {
      return index === 0 ? {'checkbox_nine': {
        stateful: function (index) {
          return index === 2 ? {'val19': null} : null
        }
      }} : null
    }
  },
  'other111': null,
  'other222': null,
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
contractConfig.checkboxListener(function () { }, function (obj, index) {
  let attr = obj.currentTarget.getAttribute('name')
  let boxArray = document.getElementsByName(attr);
  if (attr === 'one') {
    let checkIO = ['val555']
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 3) {
            contractConfig.initForm(checkIO, 0)
          } else {
            contractConfig.initForm(checkIO, 1)
          }
        } else {
          contractConfig.initForm(checkIO, 1)
        }
      }
    })
  } else if (attr === 'three') {
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
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
// let msg = {
//   code: "S0001191107007",
//   companyNames: ["金银湖三级门店哦"],
//   guestStoreRegisterCode: '3421321321',
//   guestCardType: "军官证",
//   guestCardTypes: "",
//   guestID: "132",
//   guestIDs: "",
//   guestName: "然爱迪生",
//   guestNames: "",
//   guestTel: "13011111111",
//   guestTels: "",
//   id: 3354,
//   isentrust: 1,
//   ownerCardType: "营业执照",
//   ownerCardTypes: "",
//   ownerID: "123",
//   ownerIDs: "",
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