import {
  contractConfig,
  toChineseNumber,
  formatMoney
} from "./base.js"

let Obj = {
  cn_arr: ['val51', 'val52', 'val53', 'val54', 'val55', 'val56', 'val57', 'val58', 'val59']
}

let sub = {
  'info_val1': {
    stateful: function () {
      return document.querySelector('*[extendParam=val1]').innerHTML !== '' ? {
        'val2': null
      } : null
    }
  },
  'info_val3': {
    stateful: function () {
      return document.querySelector('*[extendParam=val3]').innerHTML !== '' ? {
        'val4': null
      } : null
    }
  },
  "val5": null,
  'info_val3': {
    stateful: function () {
      return document.querySelector('*[extendParam=val3]').innerHTML !== '' ? {
        'val4': null
      } : null
    }
  },
  'info_val6': {
    stateful: function () {
      return document.querySelector('*[extendParam=val6]').innerHTML !== '' ? {
        'checkbox_one': null,
      } : null
    }
  },
  'checkbox_two': {
    stateful: function (index) {
      return index === 3 ? {
        'val7': null,
      } : null
    }
  },
  'checkbox_three': {
    stateful: function (index) {
      return index === 1 ? {
        'drapdown_val8': {
          stateful: function (val) {
            let res = null;
            switch (val) {
              case "A":
                res = {
                  'val9': null
                };
                break;
              case "B":
                res = {
                  'val10': null
                };
                break;
            }
            return res;
          }
        },
      } : null
    }
  },
  //   'val50': null,
  'checkbox_four': null,
  'checkbox_five': {
    stateful: function (index) {
      return index === 0 ? {
        'checkbox_six': null,
        'val11': null,
        'checkbox_carPlace': null,
      } : null
    }
  },
  'val51': null,
  'val52': null,
  'drapdown_val12': {
    stateful: function (val) {
      let res = null;
      switch (val) {
        case 'A':
          break;
        case 'B':
          res = {
            'checkbox_seven': {
              stateful: function (index) {
                return index === 0 ? {
                  'val13': null
                } : null
              }
            },
            'val53': null,
            'val54': null,

          };
          break;
        case 'C':
          res = {
            'val14': null,
            'val55': null,
            'val56': null,
          };
          break;
        case 'D':
          res = {
            'val15': null,
            'val57': null,
            'checkbox_eight': null
          };
          break;
      }
      return res;
    }
  },
  'val58': null,
  'checkbox_nine': {
    stateful: function (index) {
      return index === 1 ? {
        'checkbox_ten': null,
        'val16': null,
        'drapdown_val17': null,
      } : null
    }
  },
  'checkbox_ele': null,
  'checkbox_twe': null,
  'checkbox_thirteen': null,
  'val18': null,
  'checkbox_other11': null,
  'checkbox_fourteen': null,
  'checkbox_fiveteen': null,
  'checkbox_sixteen': null,
  'checkbox_seventeen': null,
  'drapdown_val19': null,
  'val59': null,
  'drapdown_val20': {
    stateful: function (val) {
      let res = null;
      switch (val) {
        case 'A':
          res = {
            'val21': null,
          };
          break;
        case 'B':
          res = {
            'val22': null,
          };
          break;
        case 'C':
          res = {
            'val23': null
          };
          break;
      }
      return res;
    }
  },
  'drapdown_val24': null,
  info_val305: {
    stateful: function () {
      return document.querySelector('*[extendParam=val305]').innerHTML !== '' ? {
        val306: null
      } : null
    }
  },
  info_val311: {
    stateful: function () {
      return document.querySelector('*[extendParam=val311]').innerHTML !== '' ? {
        val312: null
      } : null
    }
  },
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
  //   val314: null,
  //   val315: null,
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

setTimeout(() => {
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
        if (attr === 'val8') {
          contractConfig.prohibit(bindElem, ['A', 'B'], 'val8')
          contractConfig.initForm(['val9', 'val10'], 0)
        }
        if (attr === 'val12') {
          contractConfig.prohibit(bindElem, ['A', 'B', 'C', 'D'], 'val12')
          contractConfig.initForm(['checkbox_seven', 'val13', 'val53', 'val54', 'val14', 'val55', 'val56', 'val15', 'val57', 'checkbox_eight'], 0)
        }
        if (attr === 'val20') {
          contractConfig.prohibit(bindElem, ['A', 'B', 'C'], 'val20')
          contractConfig.initForm(['val21', 'val22', 'val23'], 0)
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
  let msg = {}

  if (window.location.href.indexOf('//192.168') > 0 || window.location.href.indexOf('//localhost') > 0) {
    // msg = {
    //   code: "S0001191107007", //合同编号
    //   companyNames: ["金银湖三级门店哦"], //门店名称
    //   guestCardType: "军官证",
    //   guestCardTypes: "",
    //   guestID: "132", //买方身份证
    //   guestIDs: "ee2353-344，ii397-4839", //买方身份证多人
    //   guestName: "然迪生", //买方姓名
    //   guestNames: "胜负少，发士夫", //买方姓名多人
    //   guestTel: "13011111111", //买方电话
    //   guestTels: "", //买方电话多人
    //   custCommission: 300, //买方支付佣金
    //   id: 3354,
    //   isentrust: 1,
    //   ownerCardType: "营业执照",
    //   ownerCardTypes: "",
    //   ownerID: "123", //卖方身份证
    //   ownerIDs: "ee2353-344，ii397-4839", //卖方身份证多人
    //   ownerName: "熊先", //卖方姓名
    //   ownerNames: "胜多少，发士夫", //卖方姓名多人
    //   ownerTel: "18888888888", //卖方电话
    //   ownerTels: "", //卖方电话多人
    //   ownerCommission: 500, //卖方支付佣金
    //   propertyAddr: "a市b区c", //房屋地址
    //   singleCompany: "是的噶几开会说",
    //   dealPrice: 1000, //购房总价小写
    //   dealPriceUpper: '壹仟', //购房总价大写
    //   square: 160, //总面积
    //   guestStoreRegisterCode: '213',
    //   signDate: 1592465819508, //签约时间
    //   organizationCode: "8888888888"
    // }

    msg = {
      cityId: 52,
      code: "S0052201110005",
      commissionPayment: 0,
      companyBanks: [{
        bankAccountName: "张三",
        bankBranchName: "武汉泰和支行",
        bankCard: "6214284668743215",
        id: 812,
        storeId: 50534,
        storeName: "金水湾一店备注名称长点一点更长一点再长一"
      }],
      companyNames: ["关南留存房源测试小区"],
      custCommission: 1111,
      custCommissionUpper: "壹仟壹佰壹拾壹",
      custEnsure: 0,
      dealPrice: 100,
      dealPriceUpper: "壹佰",
      guestCardType: "军官证",
      guestCardTypes: "",
      guestID: "2",
      guestIDs: "ee2353-344，ii397-4839",
      guestName: "李四",
      guestNames: "李四李四李四",
      guestStoreName: "关南留存房源测试小区",
      guestStoreRegisterCode: "91420106558434940W",
      guestTel: "16522112054",
      guestTels: "",
      guestinfoCode: "G00011648",
      houseinfoCode: "S00120147",
      id: 7992,
      isHaveData: 0,
      isRefer: 0,
      isRetained: 0,
      isWuHanMM: 0,
      lepName: "金莉",
      moneyUnit: "元",
      organizationCode: "91420106558434940W",
      otherCooperationCost: 0,
      ownerCardType: "军官证",
      ownerCardTypes: "",
      ownerCommission: 2222,
      ownerCommissionUpper: "贰仟贰佰贰拾贰",
      ownerID: "1",
      ownerIDs: "ee2353-344，ii397-4839",
      ownerName: "张三",
      ownerNames: "张三张三张三",
      ownerTel: "02736258965",
      ownerTels: "",
      propertyAddr: "武汉市江汉区123456",
      propertyCard: "",
      remarks: "",
      signDate: 1604995782000,
      singleCompany: "",
      square: 133,
      squareUse: 0,
      subscriptionPrice: 0,
      subscriptionPriceUpper: "零",
      tendingName: "李璞",
      timeUnit: "",
      transFlowCode: 128,
      type: 2,
      wHEmpName: "盖祈宁",
      wtSignDate: ""
    }

  } else {
    msg = JSON.parse(window.sessionStorage.getItem("contractMsg"))
  }

  for (let readonlyItem in msg) {
    let onlyReadDom = Array.from(document.querySelectorAll(`*[systemParam=${readonlyItem}]`));

    let readonlyArr = ['code', 'square', 'ownerTel', 'organizationCode', 'guestTel', 'ownerName', 'ownerID', 'ownerNames', 'ownerIDs', 'guestName', 'guestID', 'guestNames', 'guestIDs', 'propertyAddr', 'dealPrice', 'dealPriceUpper', 'companyNames', 'guestStoreRegisterCode', 'signDate', 'ownerCommission', 'ownerCommissionUpper', 'custCommission', 'custCommissionUpper']
    if (onlyReadDom.length > 0) {
      onlyReadDom.forEach((element, index) => {
        if (readonlyArr.includes(readonlyItem)) {
          if (readonlyItem === 'companyNames') {
            element.innerHTML = msg[readonlyItem][0]
          } else if (readonlyItem === 'propertyAddr') {
            element.innerHTML = msg[readonlyItem]
            // document.querySelector(`*[extendParam=val22]`).innerHTML = msg[readonlyItem]
            // document.querySelector(`*[extendParam=val22]`).classList.remove('input-before')
          } else if (readonlyItem === 'signDate' && msg["signDate"]) {
            let time = new Date(Number(msg["signDate"]));
            let y = time.getFullYear();
            let M = time.getMonth() + 1;
            let D = time.getDate();
            let signDate = `${y}年${M}月${D}日`
            element.innerHTML = signDate
          } else {
            element.innerHTML = msg[readonlyItem]
          }
          element.classList.remove('input-before')
        }
      })
    }
  }

  // 勾选框逻辑
  contractConfig.checkboxListener(
    function () {},
    function (obj, index) {
      let attr = obj.currentTarget.getAttribute('name');
      // debugger
      let boxArray = document.getElementsByName(attr);
      if (attr === 'two') {
        let checkIO = {
          3: ['val7'],
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
              contractConfig.initForm(checkIO[5], 1)
            }
          }
        })
      } else if (attr === 'three') {
        let checkIO = {
          1: ['val8', 'val9', 'val10'],
        }
        boxArray.forEach((item, i) => {
          // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
          if (item === obj.currentTarget) {
            if (item.querySelector('p').getAttribute('checked')) {
              if (i === 1) {
                contractConfig.initForm(checkIO[1], 0)
              } else {
                contractConfig.initForm(checkIO[1], 1)
              }
            } else {
              contractConfig.initForm(checkIO[i], 1)
            }
          }
        })
      } else if (attr === 'five') {
        let checkIO = {
          0: ['checkbox_six', 'val11', 'checkbox_carPlace'],
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
              contractConfig.initForm(checkIO[i], 1)
            }
          }
        })
      } else if (attr === 'nine') {
        let checkIO = {
          1: ['checkbox_ten', 'val16', 'val17'],
        }
        boxArray.forEach((item, i) => {
          // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
          if (item === obj.currentTarget) {
            if (item.querySelector('p').getAttribute('checked')) {
              if (i === 1) {
                contractConfig.initForm(checkIO[1], 0)
              } else {
                contractConfig.initForm(checkIO[1], 1)
              }
            } else {
              contractConfig.initForm(checkIO[i], 1)
            }
          }
        })
      }
    }
  )

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
    let cn_str = tip.target.getAttribute('extendParam')
    if (spanAttr === 'number') {
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
      if (Obj['cn_arr'].includes(cn_str)) {
        if (ev.target.value.indexOf(",") != -1) {
          ev.target.value = ev.target.value.replace(/,/g, '')
        }
        let index = toChineseNumber(ev.target.value).indexOf('元')
        document.querySelector(`*[extendParam=${cn_str}_add]`).innerHTML = toChineseNumber(ev.target.value).substring(0, index)
        if (ev.target.value.indexOf(",") == -1) {
          document.querySelector(`*[extendParam=${cn_str}]`).innerHTML = formatMoney(ev.target.value)
        }
      }
    }
  }, function (tip) {
    //获取输入框的默认值
    let initVal = tip.target.innerHTML
    let strCn = tip.target.getAttribute('extendParam')
    if (Obj['cn_arr'].includes(strCn)) {
      if (initVal.length > 0) {
        if (initVal.indexOf(",") != -1) {
          initVal = initVal.replace(/,/g, '');
        }
        let index = toChineseNumber(initVal).indexOf('元')
        document.querySelector(`*[extendParam=${strCn}_add]`).innerHTML = toChineseNumber(initVal).substring(0, index)
        if (initVal.indexOf(",") == -1) {
          document.querySelector(`*[extendParam=${strCn}]`).innerHTML = formatMoney(initVal)
        }
      } else {
        document.querySelector(`*[extendParam=${strCn}_add]`).innerHTML = ''
      }
    }
  }, function () {
    // cnPrice(msg.dealPrice, 'val50_add') //成交总价
    // cnPrice(msg.ownerCommission, 'val314_add') //甲方支付佣金
    // cnPrice(msg.custCommission, 'val315_add') //乙方支付佣金
  }())

}, 50)

// 脚本静态价格大写转换
// function cnPrice(dealPrice, val) {
//   document.querySelector(`*[extendParam=${val}]`).innerHTML = toChineseNumber(dealPrice)
// }
