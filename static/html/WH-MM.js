import {
  contractConfig,
  toChineseNumber
} from "./base.js"

let Obj = {
  cn_arr: ['val23','val32','val31','val34','val37','val39','val41','val43','val44','val49','val52']
}

let sub = {
  // 'val1': null,
  // 'val2': null,
  // 'val7': null,
  // 'val8': null,
  // 'checkbox_one':null,
  // 'val102':null,
  // 'checkbox_two':{
  //   state: true,
  //   stateful: function (index) {
  //     return index === 6 ? {
  //       'val13':null
  //     }: null
  //   }
  // },
  // 'checkbox_three':{
  //   state: true,
  //   stateful: function (index) {
  //     return index === 3 ? {
  //       'val14':null
  //     }: null
  //   }
  // },
  // 'checkbox_four':null,
  'checkbox_five': {
    state: true,
    stateful: function (index) {
      let _18=document.querySelector(`span[extendParam=val18`)
      let _19=document.querySelector(`span[extendParam=val19`)
      let obj = {}
      if(_18.innerHTML!=''){
        obj = {'val18':null}
      }else if (_19.innerHTML!=''){
        obj = {'val19':null}
      } else {
        obj = {'val18':null,'val19':null}
      }
        return index === 0 ? {
          'val15':null,'val17':null,
      } : index === 1 ? Object.assign(obj,{
        'val20': null,
        'checkbox_six': null,
        'val21': null
      }): null
    }
  },
  'checkbox_seven': {
    state: true,
    stateful: function (index) {
      return index === 1 ? {
        'val22': null,
        'val23': null,
        'val24': null,
        'drapdown_val25': {
          state: true,
          stateful: function (val) {
            let res = null;
            switch (val) {
              case '1':
                break;
              case '2':
                res = {
                  'checkbox_eight': null,
                  'val26': null
                };
                break;
              case '3':
                res = {
                  'checkbox_nine': null,
                  'checkbox_ten': null,
                  'checkbox_eleven': null,
                };
                break;
            }
            return res;
          }
        },
      } : null
    }
  },
  'checkbox_twelve': {                                                                         
    stateful: function (index) {
      return index === 1 ? {
        'val27': null,
        'drapdown_val28': {
          state: true,
          stateful: function (val) {
            let res = null;
            switch (val) {
              case '1':
                res = {
                  'checkbox_threeteen': {
                    state: true,
                    stateful: function (val) {
                      return val === 2 ? {
                        'val29': null
                      } : null
                    }
                  },
                  'checkbox_fourteen': {
                    state: true,
                    stateful: function (val) {
                      return val === 2 ? {
                        'val30': null
                      } : null
                    }
                  },
                  'checkbox_fiveteen':null
                }
                break;
              case '2':
                break;
            }
            return res;
          }
        }
      } : null
    }
  },
  'val31':null,
  'checkbox_sixteen': {                                                                         
    stateful: function (index) {
      return index === 1 ? {
        'val32': null
      } : null
    }
  },
  'checkbox_seventeen': {                                                                         
    stateful: function (index) {
      return index === 1 ? {
        'checkbox_eightteen':null,
        'val101': null,
        'val33': null,
        'val34': null,
        'val35': null,
        'checkbox_nineteen':null,
      } : null
    }
  },
  'checkbox_twenty': null,
  'val36':null,
  'checkbox_twenty-one': null,
  'val37':null,
  'val38':null,
  'val39':null,
  'checkbox_twenty-two': null,
  'val40':null,
  'val41':null,
  'checkbox_twenty-three': null,
  'val42':null,
  'val43':null,
  'checkbox_twenty-four': null,
  'checkbox_twenty-five': null,
  'val44':null,
  'checkbox_twenty-six': {                                                                         
    stateful: function (index) {
      return index === 0 ? {
        'val45': null,
      } :index === 1?{
        'val46': null,
      } :index === 2?{
        'val47': null,
      }:null
    }
  },
  'val48':null,
  'checkbox_twenty-seven': {                                                                         
    stateful: function (index) {
      return index === 1 ? {
        'val49': null,
        'val50': null,
        'checkbox_twenty-eight':null
      }:null
    }
  },
  'checkbox_twenty-nine': {                                                                         
    stateful: function (index) {
      return index === 0 ? {
        'val51': null,
      }:null
    }
  },
    'checkbox_thirty': {                                                                         
    stateful: function (index) {
      return index === 1 ? {
        'val52': null,
        'val53': null,
        'checkbox_thirty-two':null
      }:null
    }
  },
  'checkbox_thirty-three':null,
  'checkbox_thirty-four':null,
  'val54':null,
    'checkbox_thirty-five': {                                                                         
    stateful: function (index) {
      return  index===0?{
        'val55': null,
      }:index === 1 ? {
        'val56': null,
        'val57': null,
      } :index === 2?{
        'val58': null,
      } :index === 3?{
        'val59': null,
        'val60': null,
      } :index === 4?{
        'val61': null,
      }: null
    }
  },
  'val62':null,
  'checkbox_thirty-six':null,
  'checkbox_thirty-seven':null,
  'checkbox_thirty-eight':null,
  'checkbox_thirty-nine':null,
  'drapdown_val63':null,
  'drapdown_val64': {
    stateful: function (val) {
      let res = null;
      switch (val) {
        case '1':
          res = {
            'val65': null,
          };
          break;
        case '2':
          res = {
            'val66': null,
          };
          break;
        case '3':
          res = {
            'val67': null
          };
          break;
      }
      return res;
    }
  },
  'drapdown_val68':null,
  'checkbox_forty': null,
  'drapdown_val70':null,
    'checkbox_forty-two': {                                                                         
    stateful: function (index) {
      return index === 0 ? {
        'val71': null,
      }:null
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
      // debugger
      bindElem.value = dateObj.value
      bindElem.setAttribute('value', bindElem.value)
      let obj = {
        'val25': {
          2: ['checkbox_nine','checkbox_ten','checkbox_eleven'],
          3: ['checkbox_eight', 'val26'],
          'init': ['checkbox_eight', 'val26', 'checkbox_nine','checkbox_ten','checkbox_eleven']
        },
        'val28': {
          2: ['checkbox_threeteen','val29','checkbox_fourteen','val30','checkbox_fiveteen'],
          'init': ['checkbox_threeteen','val29','checkbox_fourteen','val30','checkbox_fiveteen']
        },
        'val64':{
          1:['val66','val67'],
          2:['val65','val67'],
          3:['val65','val66'],
          'init': ['val65','val66','val67']
        }
      }
      let attr = bindElem.getAttribute('extendParam')
      if (obj[attr] && attr == 'val25') {
        contractConfig.initForm(obj[attr]['init'], 0)
        contractConfig.initForm(obj[attr][Number(dateObj.value)], 1)
      }
      if (obj[attr] && attr == 'val28') {
        contractConfig.initForm(obj[attr]['init'], 0)
        contractConfig.initForm(obj[attr][Number(dateObj.value)], 1)
      }
      if (obj[attr] && attr == 'val64') {
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
  let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
// let msg = {
//   code: "S0001191107007",
//   companyNames: ["金银湖三级门店哦"],
//   guestCardType: "军官证",
//   guestCardTypes: "",
//   guestID: "132",
//   guestIDs: "ee2353-344，ii397-4839",
//   guestName: "然迪生",
//   guestNames: "",
//   guestTel: "13011111111",
//   guestTels: "",
//   id: 3354,
//   isentrust: 1,
//   ownerCardType: "营业执照",
//   ownerCardTypes: "",
//   ownerID: "123",
//   ownerIDs: "ee2353-344，ii397-4839",
//   ownerName: "熊先",
//   ownerNames: "",
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
for (let readonlyItem in msg) {
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));

  let readonlyArr = ['code', 'ownerTel','ownerCardType', 'organizationCode','guestCardTypes','guestIDs', 'ownerTels','ownerCardTypes','guestTel', 'ownerName', 'ownerID', 'ownerNames', 'ownerIDs', 'guestName','guestCardType', 'guestID', 'guestNames', 'guestIDs', 'propertyAddr', 'dealPrice', 'dealPriceUpper', 'companyNames', 'guestStoreRegisterCode', 'signDate']
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
        }else if(readonlyItem==='ownerNames'){
          if(msg[readonlyItem]!=''){
            element.innerHTML = msg[readonlyItem]
          }else{
            delete sub['val2']
          }
        }else if(readonlyItem==='guestNames'){
          if(msg[readonlyItem]!=''){
            element.innerHTML = msg[readonlyItem]
          }else{
            delete sub['val8']
          }
        }
         else {
          element.innerHTML = msg[readonlyItem]
        }
        element.classList.remove('input-before')
      }
    })
  }
}

// 勾选框逻辑
contractConfig.checkboxListener(function () {}, function (obj, index) {
  let attr = obj.currentTarget.getAttribute('name')
  let boxArray = document.getElementsByName(attr);
  if (attr === 'two') {
    let checkIO = {
      6: ['val13'],
    }
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 6) {
            contractConfig.initForm(checkIO[6], 0)
          }else{
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
      3: ['val14'],
    }
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 3) {
            contractConfig.initForm(checkIO[3], 0)
          }else{
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
      0: ['val15','val100','val16','val17'],
      1: ['val20','checkbox_six','val21'],
    }
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          contractConfig.initForm(checkIO[i], 0)
          if (i === 0) {
            contractConfig.initForm(checkIO[1], 1)
          } else {
            contractConfig.initForm(checkIO[0], 1)
          }
        }else{
          contractConfig.initForm(checkIO[i], 1)
        }
      }
    })
  } 
  if (attr === 'seven') {
    let checkIO = {
      1: ['val22','val23','val24','val25','checkbox_eight','val26','checkbox_nine','checkbox_ten','checkbox_eleven'],
    }
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 0) {
            contractConfig.initForm(checkIO[1], 1)
          }else{
            contractConfig.initForm(checkIO[1], 0)
          }
        }else{
          contractConfig.initForm(checkIO[1], 1)
        }
      }
    })
  }
  if (attr === 'twelve') {
    let checkIO = {
      1: ['val27','val28','checkbox_threeteen','val29','checkbox_fourteen','checkbox_fiveteen'],
    }
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 1) {
            contractConfig.initForm(checkIO[1], 0)
          }else{
            contractConfig.initForm(checkIO[1], 1)
          }
        } else {
          contractConfig.initForm(checkIO[1], 1)
        }
      }
    })
  }
  if (attr === 'sixteen') {
    let checkIO = {
      1: ['val32'],
    }
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 1) {
            contractConfig.initForm(checkIO[1], 0)
          }else{
            contractConfig.initForm(checkIO[1], 1)
          }
        } else {
          contractConfig.initForm(checkIO[1], 1)
        }
      }
    })
  }
  if (attr === 'seventeen') {
    let checkIO = {
      1: ['checkbox_eightteen','val101','val33','val34','val35'],
    }
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 1) {
            contractConfig.initForm(checkIO[1], 0)
          }else{
            contractConfig.initForm(checkIO[1], 1)
          }
        } else {
          contractConfig.initForm(checkIO[1], 1)
        }
      }
    })
  }
  if (attr === 'twenty-six') {
    let checkIO = {
      0: ['val45'],
      1: ['val46'],
      2: ['val47'],
    }
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          contractConfig.initForm(checkIO[i], 0)
          if (i === 0) {
            contractConfig.initForm(checkIO[1].concat(checkIO[2]), 1)
          }else if(i === 1){
            contractConfig.initForm(checkIO[0].concat(checkIO[2]), 1)
          }else {
            contractConfig.initForm(checkIO[0].concat(checkIO[1]), 1)
          }
        } else {
          contractConfig.initForm(checkIO[i], 1)
        }
      }
    })
  }
  if (attr === 'twenty-seven') {
    let checkIO = {
      1: ['val49','val50','checkbox_twenty-eight'],
    }
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 1) {
            contractConfig.initForm(checkIO[1], 0)
          }else{
            contractConfig.initForm(checkIO[1], 1)
          }
        } else {
          contractConfig.initForm(checkIO[1], 1)
        }
      }
    })
  }
  if (attr === 'twenty-nine') {
    let checkIO = {
      0: ['val51'],
    }
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 0) {
            contractConfig.initForm(checkIO[0], 0)
          }else{
            contractConfig.initForm(checkIO[0], 1)
          }
        } else {
          contractConfig.initForm(checkIO[0], 1)
        }
      }
    })
  }
  if (attr === 'thirty') {
    let checkIO = {
      1: ['val52','val53','checkbox_thirty-two'],
    }
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 1) {
            contractConfig.initForm(checkIO[1], 0)
          }else{
            contractConfig.initForm(checkIO[1], 1)
          }
        } else {
          contractConfig.initForm(checkIO[1], 1)
        }
      }
    })
  }
  if (attr === 'thirty-five') {
    let checkIO = {
      0: ['val55'],
      1: ['val56','val57'],
      2: ['val58'],
      3: ['val59','val60'],
      4: ['val61'],
    }
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          contractConfig.initForm(checkIO[i], 0)
          if (i === 0) {
            contractConfig.initForm(checkIO[1].concat(checkIO[2].concat(checkIO[3]).concat(checkIO[4])), 1)
          }else if(i === 1){
            contractConfig.initForm(checkIO[0].concat(checkIO[2].concat(checkIO[3]).concat(checkIO[4])), 1)
          }else if (i === 2) {
            contractConfig.initForm(checkIO[0].concat(checkIO[1]).concat(checkIO[3].concat(checkIO[4])), 1)
          }else if(i===3){
            contractConfig.initForm(checkIO[0].concat(checkIO[1]).concat(checkIO[2]).concat(checkIO[4]), 1)
          }else{
            contractConfig.initForm(checkIO[0].concat(checkIO[1]).concat(checkIO[2]).concat(checkIO[3]), 1)
          }
        } else {
          contractConfig.initForm(checkIO[i], 1)
        }
      }
    })
  }
  if (attr === 'forty-two') {
    let checkIO = {
      0: ['val71'],
    }
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        if (item.querySelector('p').getAttribute('checked')) {
          if (i === 0) {
            contractConfig.initForm(checkIO[0], 0)
          }else{
            contractConfig.initForm(checkIO[0], 1)
          }
        } else {
          contractConfig.initForm(checkIO[0], 1)
        }
      }
    })
  }
})

//输入自适应
contractConfig.inputListener(function (ev, tip) {
  if(tip.target.getAttribute('extendParam')=='val18'){
    document.querySelector(`span[extendParam=val19]`).innerHTML=''
    document.querySelector(`span[extendParam=val19]`).classList.add('input-before')
    sub.checkbox_five={
      state: true,
      stateful: function (index) {
        return index === 0 ? {
            'val15':null,'val100':null,'val16':null,'val17':null,
        } : index === 1 ? {
          'val18':null,
          'val20': null,
          'checkbox_six': null,
          'val21': null
        } : null
      }
    }
  }else if(tip.target.getAttribute('extendParam')=='val19'){
    document.querySelector(`span[extendParam=val18]`).innerHTML=''
    document.querySelector(`span[extendParam=val18]`).classList.add('input-before')
    sub.checkbox_five={
      state: true,
      stateful: function (index) {
        return index === 0 ? {
            'val15':null,'val100':null,'val16':null,'val17':null,
        } : index === 1 ? {
          'val19':null,
          'val20': null,
          'checkbox_six': null,
          'val21': null
        } : null
      }
    }
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
      let index = toChineseNumber(ev.target.value).indexOf('元')
      document.querySelector(`*[extendparam=${cn_str}_add]`).innerHTML = toChineseNumber(ev.target.value).substring(0, index)
    }
  }
}, function (tip) {
  //获取输入框的默认值
  let initVal = tip.target.innerHTML
  let strCn = tip.target.getAttribute('extendparam')
  if (Obj['cn_arr'].includes(strCn)) {
    if (initVal.length > 0) {
      let index = toChineseNumber(initVal).indexOf('元')
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal).substring(0, index)
    } else {
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
    }
  }
})
