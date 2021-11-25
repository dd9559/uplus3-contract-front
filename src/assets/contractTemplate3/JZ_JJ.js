import { contractConfig, toChineseNumber, formatMoney } from "./base.js";

let Obj;
(function() {
    let t = document.querySelectorAll(`[extendParam]`);
    let arr = [];

    t.forEach(e => {
        let name = e.getAttribute("extendParam")
        if (name.indexOf("_add") > 0) {
            let name2 = name.slice(0, -4);
            arr.push(name2);
        }
    });
    Obj = Obj || {};
    Obj.cn_arr = arr;
})()

let sub = {
  val1: null,
  'info_val10': {
    stateful: function () {
      return document.querySelector('*[extendparam=val10]') ? {'val10': null} : null
    }
  },
  val2: null,
  "info_two": {
    stateful: function () {
      if (!document.querySelector(`*[name=two]`)) {
        return null
      } else {
        return {"checkbox_two": {
          stateful: function (index) {
            return index === 3 ? {"val102":null} : null
          }
        }}
      }
    }
  },
  'info_val104': {
    stateful: function () {
      return document.querySelector('*[extendparam=val104]') ? {'val104': null} : null
    }
  },
};

//给按钮添加点击事件
let mainBtn = document.querySelector("#submit");
if (mainBtn) {
  mainBtn.addEventListener("click", function(e) {
    contractConfig.submit(e, sub, "templateError");
  });
} else {
  let btn = document.createElement("span");
  btn.id = "submit";
  btn.style.display = "none";
  btn.innerHTML = "click";
  document.body.appendChild(btn);
  btn.addEventListener("click", function(e) {
    contractConfig.submit(e, sub, "templateError");
  });
}

//初始化时间控件
Calendar.create({
  classN: "calendar-item",
  callBack: function(bindElem, dateObj) {
    if (bindElem.tagName.toLowerCase() === "input") {
      bindElem.value = `${dateObj.year}年${dateObj.month}月${dateObj.date}日`;
      bindElem.setAttribute("value", bindElem.value);
      bindElem.setAttribute("random", dateObj.random);
    }
  }
});

// 输入框右侧吸边
let textLong = Array.from(document.querySelectorAll(".text-limit"));
textLong.forEach(function(item) {
  item.addEventListener("input", function() {
    let leng = this.value.length;
    for (let i = 0; i < leng; i++) {
      if (this.scrollWidth > this.clientWidth) {
        this.value = this.value.substring(0, this.value.length - 1);
      }
    }
  });
});

// 选择第几个
let indexChcek = 0;
contractConfig.checkboxListener(function(obj, i) {
  indexChcek = i;
}, function(obj, boxArray) {
  // 循环
  boxArray.forEach((e, i) => {
      let bool = e.querySelector('p').getAttribute('checked');
      let name = e.getAttribute('name');
      if(name === 'two' && document.querySelector("[extendparam=val102]")){
        if (indexChcek === 3) {
          contractConfig.initForm(["val102"], 0);
        } else {
          contractConfig.initForm(["val102"], 1);
        }
      }
  });
});


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
//   guestNames: "胜负少，发士夫",
//   guestTel: "13011111111",
//   guestTels: "",
//   id: 3354,
//   isentrust: 1,
//   ownerCardType: "营业执照",
//   ownerCardTypes: "",
//   ownerID: "123",
//   ownerIDs: "ee2353-344，ii397-4839",
//   ownerName: "熊先",
//   ownerNames: "胜多少，发士夫",
//   ownerTel: "18888888888",
//   ownerTels: "",
//   propertyAddr: "a市b区c",
//   singleCompany: "是的噶几开会说",
//   dealPrice: 1000,
//   dealPriceUpper: '壹仟',
//   square: 160,
//   guestStoreRegisterCode: '213',
//   signDate: 1592465819508,
//   wtSignDate: 1592465819508,
//   organizationCode:"8888888888"
// }
for (let readonlyItem in msg) {
  //得到readonly的值
  let onlyReadDom = Array.from(
    document.querySelectorAll(`*[systemparam=${readonlyItem}]`)
  );
  let readonlyArr = [
    "code",
    "ownerName",
    "ownerID",
    "signDate",
    "wtSignDate",
    "companyNames",
    "ownerNames",
    "ownerIDs",
    "guestStoreName",
    'ownerCardType',
    'ownerTel',
    "custCommissionUpper",
    "custCommission",
    "ownerCommission",
    "ownerCommissionUpper",
    "guestName",
    'guestCardType',
    'guestTel',
    "guestID",
    "guestNames",
    "guestIDs",
    "propertyAddr",
    "dealPrice",
    "dealPriceUpper",
    "square",
    "companyBanks"
  ];
  if (onlyReadDom.length > 0) {
    onlyReadDom.forEach((element, index) => {
        if (readonlyArr.includes(readonlyItem)) {
          if (readonlyItem === 'companyNames'&&msg[readonlyItem].length>0) {
            element.innerHTML = msg[readonlyItem][0]
          } else if (readonlyItem === 'signDate' && msg["signDate"]) {
            let time = new Date(Number(msg["signDate"]));
            let y = time.getFullYear();
            let M = time.getMonth() + 1;
            let D = time.getDate();
            let signDate = `${y}年${M}月${D}日`
            element.innerHTML = signDate
          } else if(readonlyItem === 'code'){
            element.value = msg[readonlyItem]
            element.setAttribute('value', msg[readonlyItem])
          } else {
            element.innerHTML = msg[readonlyItem]
          }
          element.classList.remove('input-before')
        }
      })
}
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
        if (Obj['cn_arr'].includes(cn_str) || cn_str === 'val1') {
          ev.target.value = ev.target.value.replace(/[^\d.]/g,"");
          ev.target.value = ev.target.value.replace(/^\./g,"");
          ev.target.value = ev.target.value.replace(/\.{2,}/g,".");
          ev.target.value = ev.target.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
          ev.target.value = ev.target.value.replace(/^(\-)*(\d+)\.(\d{0,2}).*$/,'$1$2.$3');
        } else {
          ev.target.value=ev.target.value.replace(/[^\d]/g, "")
        }
        tip.target.innerHTML = ev.target.value
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
