import { contractConfig, toChineseNumber, formatMoney } from "./base.js";
let sub = {
  info_val116: {
    stateful: function(index) {
      return document.querySelector("*[extendparam=val116]").innerHTML !== ""
        ? { val117: null }
        : null;
    }
  },
  info_val118: {
    stateful: function(index) {
      return document.querySelector("*[extendparam=val118]").innerHTML !== ""
        ? { val119: null }
        : null;
    }
  },
  val1: null,
  val2: null,
  checkbox_one: null,
  checkbox_two: null,
  val3: null,
  checkbox_three: {
    state: true,
    stateful: function(index) {
      return index === 5 ? { val4: null } : null;
    }
  },
  val5: null,
  val6: null,
  val7: null,
  val8: null,
  val9: null,
  val10: null,
  val11: null,
  checkbox_four: null,
  checkbox_five: null,
  checkbox_four: null,
  val12: null,
  val13: null,
  val14: null,
  checkbox_six: null,
  val15: null,
  val17: null,
  checkbox_seven: null,
  checkbox_eight: {
    stateful: function(index) {
      return index === 0
        ? {
            checkbox_nine: {
              stateful: function(index) {
                return index === 2 ? { val19: null } : null;
              }
            }
          }
        : null;
    }
  },
  // 'checkbox_nine': null,
  // 'val19': null,
  info_val120: {
    stateful: function(index) {
      return document.querySelector("*[extendparam=val120]").innerHTML !== ""
        ? { val121: null }
        : null;
    }
  },
  info_val122: {
    stateful: function(index) {
      return document.querySelector("*[extendparam=val122]").innerHTML !== ""
        ? { val123: null }
        : null;
    }
  },
  val102: null,
  val103: null,
  val104: null,
  val105: null,
  info_val333: {
    stateful: function() {
      return document.querySelector("*[extendparam=val333]")
        ? { val333: null }
        : null;
    }
  },
  info_val444: {
    stateful: function() {
      return document.querySelector("*[extendparam=val444]")
        ? { val444: null }
        : null;
    }
  },
  val106: null
  // old
};
let Obj = {
  cn_arr: ["val10", "val11", "val15", "val19", "val104", "val105"]
};
//初始化下拉控件
// Dropdown.create({
//   classN: "dropdown-item",
//   callBack: function(bindElem, dateObj) {
//     if (bindElem.tagName.toLowerCase() === "input") {
//       bindElem.value = dateObj.value;
//       bindElem.setAttribute("value", bindElem.value);
//       let obj = {
//         val24: ["val26"],
//         val25: ["val26"]
//       };
//       let attr = bindElem.getAttribute("extendParam");
//       console.log(attr, "attr", dateObj.value);
//       if (obj[attr]) {
//         contractConfig.initForm(obj[attr], 0);
//       }
//     } else {
//       bindElem.innerHTML = dateObj.value;
//       bindElem.classList.remove("input-select");
//       bindElem.classList.remove("input-before");
//     }
//   }
// });

// Calendar.create({
//   classN: "calendar-item",
//   callBack: function(bindElem, dateObj) {
//     // bindElem.innerHTML = dateObj.year + '-' + dateObj.month + '-' + dateObj.date;
//     if (bindElem.tagName.toLowerCase() === "input") {
//       bindElem.value = `${dateObj.year}年${dateObj.month}月${dateObj.date}日`;
//       bindElem.setAttribute("value", bindElem.value);
//       bindElem.setAttribute("random", dateObj.random);
//     }
//   }
// });

//输入自适应
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
      let cn_str = tip.target.getAttribute("extendparam");
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
      tip.target.innerHTML = ev.target.value;
      if (Obj["cn_arr"].includes(cn_str)) {
        if (ev.target.value.indexOf(",") != -1) {
          ev.target.value = ev.target.value.replace(/,/g, "");
        }
        let index = toChineseNumber(ev.target.value).indexOf("元");
        document.querySelector(`*[extendParam=${cn_str}_add]`).innerHTML =
          toChineseNumber(ev.target.value).substring(0, index) +
          toChineseNumber(ev.target.value).substr(index);
        if (ev.target.value.indexOf(",") == -1) {
          document.querySelector(
            `*[extendParam=${cn_str}]`
          ).innerHTML = formatMoney(ev.target.value);
        }
      }
    }
  },
  function(tip) {
    //获取输入框的默认值
    let initVal = tip.target.innerHTML;
    let strCn = tip.target.getAttribute("extendparam");
    if (Obj["cn_arr"].includes(strCn)) {
      if (initVal.length > 0) {
        if (initVal.indexOf(",") != -1) {
          initVal = initVal.replace(/,/g, "");
        }
        let index = toChineseNumber(initVal).indexOf("元");
        document.querySelector(
          `*[extendparam=${strCn}_add]`
        ).innerHTML = toChineseNumber(initVal).substring(0, index);
        if (initVal.indexOf(",") == -1) {
          document.querySelector(
            `*[extendparam=${strCn}]`
          ).innerHTML = formatMoney(initVal);
        }
      } else {
        document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = "";
      }
    }
  }
);

// 勾选框逻辑
contractConfig.checkboxListener(
  function() {},
  function(obj, index) {
    let attr = obj.currentTarget.getAttribute("name");
    let boxArray = document.getElementsByName(attr);
    if (attr === "three") {
      let checkIO = ["val4"];
      boxArray.forEach((item, i) => {
        if (item === obj.currentTarget) {
          if (item.querySelector("p").getAttribute("checked")) {
            if (i === 5) {
              contractConfig.initForm(checkIO, 0);
            }
          } else {
            contractConfig.initForm(checkIO, 1);
          }
        }
      });
    }
  }
);

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

//基础数据赋值
let contractMsg, msg;
contractMsg = window.sessionStorage.getItem("contractMsg");
msg = (contractMsg && JSON.parse(contractMsg)) || {
  houseinfoCode: "Z00120226",
  wHEmpName: "向洲星",
  ownerIDs: "",
  isHaveData: 0,
  ownerTels: "",
  custCommission: 565,
  ownerCommission: 546,
  propertyAddr: "武汉市江汉区324",
  singleCompany: "",
  cityId: 52,
  dealPrice: 100,
  lepName: "吕麟峰",
  type: 1,
  signDate: 1658804380000,
  guestName: "李四",
  companyNames: ["武汉吉家正念房地产经纪服务有限公司"],
  otherCooperationCost: 0,
  guestStoreName: "武汉吉家正念房地产经纪服务有限公司",
  guestTel: "15436363636",
  id: 10018,
  guestCardType: "军官证",
  ownerCommissionUpper: "伍佰肆拾陆",
  companyBanks: [
    {
      bankAccountName: "武汉吉家正念房地产经纪服务有限公司",
      bankBranchName: "光谷支行",
      bankCard: "621400023323",
      bankCode: "CEB",
      bankId: 24,
      bankName: "中国光大银行",
      entBankList: [],
      id: 347,
      storeId: 50590,
      storeName: "叶-吉家测试二店（勿动）",
      type: 1
    }
  ],
  guestinfoCode: "R00034239",
  subscriptionPriceUpper: "零",
  guestCardTypes: "军官证",
  isRefer: 0,
  ownerID: "1",
  tendingName: "测试体系副总",
  square: 160,
  moneyUnit: "元",
  guestTels: "13912345678",
  ownerCardTypes: "",
  code: "Z0052220726001",
  ownerCardType: "军官证",
  guestStoreRegisterCode: "91420100MA49BL0W1L",
  ownerTel: "16302210025",
  dealPriceUpper: "壹佰",
  companyLepPhone: "18607118717",
  guestNames: "王五",
  propertyAddrWuYe: "叶-跨体系楼盘-无建模（有栋座单元） 0301",
  ownerName: "张三",
  guestIDs: "3",
  custEnsure: 0,
  timeUnit: "月",
  isRetained: 0,
  commissionPayment: 0,
  ownerNames: "",
  isWuHanMM: 0,
  custCommissionUpper: "伍佰陆拾伍",
  propertyCard: "",
  guestID: "2",
  squareUse: 0,
  subscriptionPrice: 0,
  remarks: ""
};

for (let readonlyItem in msg) {
  let onlyReadDom = Array.from(
    document.querySelectorAll(`*[systemparam=${readonlyItem}]`)
  );
  if (onlyReadDom.length > 0) {
    onlyReadDom.forEach((element, index) => {
      if (readonlyItem === "code") {
        element.value = msg[readonlyItem];
        element.setAttribute("value", msg[readonlyItem]);
      } else if (readonlyItem === "companyNames") {
        element.innerHTML = msg[readonlyItem][0];
        element.classList.remove("input-before");
      } else if (readonlyItem === "signDate") {
        let time = new Date(Number(msg["signDate"]));
        let y = time.getFullYear();
        let M = time.getMonth() + 1;
        let D = time.getDate();
        let signDate = `${y}年${M}月${D}日`;
        element.innerHTML = signDate;
      } else {
        element.innerHTML = msg[readonlyItem];
        element.classList.remove("input-title");
        element.classList.remove("input-title2");
        element.classList.remove("input-before");
      }
    });
  }
}
