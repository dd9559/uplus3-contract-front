import {
  contractConfig,
  toChineseNumber,
  formatMoney
} from "./base.js"

let sub = {
  'val5': null,
  'checkbox_one': null,
  'val6': null,
  'val7': null,
  'checkbox_two': null,
  'val8': null,
  'info_val222': {
    stateful: function () {
      let i = 0,
          arr = document.querySelectorAll('*[name=three]'),
          len = arr.length,
          flag = false,
          res = null;
      for(;i < len;i++) {
        if(arr[i].querySelector('p').getAttribute('checked'))  {
          flag = true;
          break;
        }
      }
      if (flag) {
        return {
          'checkbox_three': {
            state: true,
            stateful: function (index) {
              switch (index) {
                case 0:
                  res = {'val9':null}
                  break;
                case 1:
                  res = {'val10':null}
                  break;
                case 2:
                  res = {'val11':null}
                  break;
                case 3:
                  res = {'val12':null}
                  break;
                case 4:
                  res = {'val13':null}
                  break;
                case 5:
                  res = {'val14':null}
                  break;
                case 6:
                  res = {'val15':null}
                  break;
                case 7:
                  res = {'val16':null}
                  break;
                case 8:
                  res = {'val17':null}
                  break;
                default:
                  break;
              }
              return res
            }
          }
        }
      } else {
        return res
      }
    }
  },
  'info_val333': {
    stateful: function () {
      let i = 0,
          arr = document.querySelectorAll('*[name=four]'),
          len = arr.length,
          flag = false,
          res = null;
      for(;i < len;i++) {
        if(arr[i].querySelector('p').getAttribute('checked'))  {
          flag = true;
          break;
        }
      }
      if (flag) {
        return {
          'checkbox_four': {
            state: true,
            stateful: function (index) {
              switch (index) {
                case 0:
                  res = {'val18':null}
                  break;
                case 1:
                  res = {'val19':null}
                  break;
                case 2:
                  res = {'val20':null}
                  break;
                case 3:
                  res = {'val21':null}
                  break;
                case 4:
                  res = {'val22':null}
                  break;
                case 5:
                  res = {'val23':null}
                  break;
                default:
                  break;
              }
              return res
            }
          }
        }
      } else {
        return res
      }
    }
  },
}

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

//基础数据赋值
// let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
let msg = {
  code: "S0001191107007",
  companyNames: ["金银湖三级门店哦"],
  guestCardType: "军官证",
  guestCardTypes: "",
  guestID: "132",
  guestIDs: "ee2353-344，ii397-4839",
  guestName: "然迪生",
  guestNames: "胜负少，发士夫",
  guestTel: "13011111111",
  guestTels: "",
  id: 3354,
  isentrust: 1,
  ownerCardType: "营业执照",
  ownerCardTypes: "",
  ownerID: "123",
  ownerIDs: "ee2353-344，ii397-4839",
  ownerName: "熊先",
  ownerNames: "胜多少，发士夫",
  ownerTel: "18888888888",
  ownerTels: "",
  propertyAddr: "a市b区c",
  singleCompany: "是的噶几开会说",
  dealPrice: 1000,
  dealPriceUpper: '壹仟',
  square: 160,
  guestStoreRegisterCode: '213',
  signDate: 1592465819508,
  organizationCode:"8888888888"
}
for (let readonlyItem in msg) {
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
  let arr = []
  if (readonlyItem === 'signDate') {
    let time = new Date(msg.signDate)
    arr.push(time.getFullYear())
    arr.push(time.getMonth() + 1)
    arr.push(time.getDate())
  }
  if (onlyReadDom.length > 0) {
    onlyReadDom.forEach((element, index) => {
      if (readonlyItem === "companyNames") {
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


// 勾选框逻辑
contractConfig.checkboxListener(function (obj, index) {
  let attr = obj.currentTarget.getAttribute('name')
  let boxArray = document.getElementsByName(attr);
  if (attr === 'three') {
    let checkIO = {
      0: ['val9'],
      1: ['val10'],
      2: ['val11'],
      3: ['val12'],
      4: ['val13'],
      5: ['val14'],
      6: ['val15'],
      7: ['val16'],
      8: ['val17'],
    }
    console.log(obj,obj.target.getAttribute('checked'),index)
    if (obj.target.getAttribute('checked')) {
      contractConfig.initForm(checkIO[index], 1)
    } else {
      contractConfig.initForm(checkIO[index], 0)
    }
  }
  if (attr === 'four') {
    let checkIO = {
      0: ['val18'],
      1: ['val19'],
      2: ['val20'],
      3: ['val21'],
      4: ['val22'],
      5: ['val23']
    }
    console.log(obj,obj.target.getAttribute('checked'),index)
    if (obj.target.getAttribute('checked')) {
      contractConfig.initForm(checkIO[index], 1)
    } else {
      contractConfig.initForm(checkIO[index], 0)
    }
  }
}, function (obj, index) {
})


let Obj = {
  cn_arr: ['val8']
}
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
