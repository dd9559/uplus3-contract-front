import { contractConfig, toChineseNumber } from "./base.js";

let Obj = {
  cn_arr: ["val7", "val8", "val9", "val10"]
};

let sub = {
  val1: null,
  val2: null,
  val3: null,
  val4: null,
  val5: null,
  val6: null,
  checkbox_one: null,
  val7: null,
  checkbox_two: null,
  checkbox_three: null,
  checkbox_four: null,
};

//给按钮添加点击事件
let mainBtn = document.querySelector("#submit");
if (mainBtn) {
  mainBtn.addEventListener("click", function(e) {
    contractConfig.submit(e, sub, "templateError1");
  });
} else {
  let btn = document.createElement("span");
  btn.id = "submit";
  btn.style.display = "none";
  btn.innerHTML = "click";
  document.body.appendChild(btn);
  btn.addEventListener("click", function(e) {
    contractConfig.submit(e, sub, "templateError1");
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
//初始化下拉控件
Dropdown.create({
  classN: "dropdown-item",
  callBack: function(bindElem, dateObj) {
    if (bindElem.tagName.toLowerCase() === "input") {
      bindElem.value = dateObj.value;
      bindElem.setAttribute("value", bindElem.value);
      let attr = bindElem.getAttribute("inputmethod");
      if (attr) {
        contractConfig.initForm(
          Obj[
            attr === "pay"
              ? "part3"
              : attr === "handle"
              ? "part5"
              : attr === "deal"
              ? "part6"
              : "part7"
          ],
          0
        );
        if (attr === "pay") {
          contractConfig.prohibit(bindElem, ["(一)", "(二)", "(三)"], "pay");
        }
        if (attr === "deal") {
          contractConfig.prohibit(bindElem, ["a", "b", "c"], "deal");
        }
        if (attr === "solve") {
          contractConfig.prohibit(bindElem, ["1", "2", "3", "4"], "solve");
        }
        if (attr === "handle") {
          contractConfig.prohibit(bindElem, ["a", "b"], "handle");
        }
      }
    } else {
      bindElem.innerHTML = dateObj.value;
      bindElem.classList.remove("input-select");
      bindElem.classList.remove("input-before");
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

contractConfig.checkboxListener(
  function() {},
  function(obj, index) {
    let attr = obj.currentTarget.getAttribute("name");
    let boxArray = document.getElementsByName(attr);
    if (attr === "one") {
      let checkIO = {
        0: ["val7"],
        1: ["val8","val9",'val10']
      };
      boxArray.forEach((item, i) => {
        if (item === obj.currentTarget) {
          if (item.querySelector("p").getAttribute("checked")) {
            contractConfig.initForm(checkIO[i], 0);
            if (i === 0) {
              contractConfig.initForm(checkIO[1], 1); //readonly
            } else {
              contractConfig.initForm(checkIO[0], 1);
            }
          } else {
            i === 0
              ? contractConfig.initForm(checkIO[0], 1)
              : contractConfig.initForm(checkIO[1], 1);
          }
        }
      });
    }
  }
);

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
//   organizationCode:"8888888888"
// }
for (let readonlyItem in msg) {
  //得到readonly的值
  let onlyReadDom = Array.from(
    document.querySelectorAll(`*[systemparam=${readonlyItem}]`)
  );
  let readonlyArr = [
    "ownerName",
    "ownerID",
    "signDate",
    "companyNames",
    "ownerNames",
    "ownerIDs",
    "guestStoreName",
    "custCommissionUpper",
    "custCommission",
    "ownerCommission",
    "ownerCommissionUpper",
    "guestName",
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
      if (readonlyItem === "signDate") {
        let time = new Date(Number(msg["signDate"]));
        let y = time.getFullYear();
        let M = time.getMonth() + 1;
        let D = time.getDate();
        let signDate = `${y}年${M}月${D}日`;
        element.innerHTML = signDate;
      } else if (readonlyItem === "companyNames") {
        if (msg[readonlyItem].length > 0) {
          element.innerHTML = msg[readonlyItem][0];
          element.classList.remove("input-before");
        }
      } else if (readonlyArr.includes(readonlyItem)) {
        if (element.getAttribute("extendParam") === "val25") {
          let value = msg["propertyAddr"];
          if (value.substring(0, 3) === "咸宁市") {
            element.innerHTML = value.replace("咸宁市", "");
          } else {
            element.innerHTML = value;
          }
        } else if (element.getAttribute("extendParam") === "val45") {
          if (msg["companyBanks"] && msg["companyBanks"].length > 0) {
            let value = msg["companyBanks"][0];
            element.innerHTML =
              value &&
              (value.bankAccountName === "—" ? "" : value.bankAccountName);
          } else {
            element.innerHTML = "";
          }
        } else if (element.getAttribute("extendParam") === "val46") {
          if (msg["companyBanks"] && msg["companyBanks"].length > 0) {
            let value = msg["companyBanks"][0];
            element.innerHTML =
              value &&
              (value.bankBranchName === "—" ? "" : value.bankBranchName);
          } else {
            element.innerHTML = "";
          }
        } else if (element.getAttribute("extendParam") === "val48") {
          if (msg["companyBanks"] && msg["companyBanks"].length > 0) {
            let value = msg["companyBanks"][0];
            element.innerHTML =
              value && (value.bankCard === "—" ? "" : value.bankCard);
          } else {
            element.innerHTML = "";
          }
        } else {
          element.innerHTML = msg[readonlyItem];
        }
        element.classList.remove("input-before");
      } else {
        element.value = msg[readonlyItem];
        element.setAttribute("value", msg[readonlyItem]);
      }
    });
  }
}

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
      ev.target.value = ev.target.value.replace(/[^\d]/g, "");
      tip.target.innerHTML = ev.target.value;
      let cn_str = tip.target.getAttribute("extendparam");
      if (Obj["cn_arr"].includes(cn_str)) {
        document.querySelector(
          `*[extendparam=${cn_str}_add]`
        ).innerHTML = toChineseNumber(ev.target.value);
      }
    }
  },
  function(tip) {
    //获取输入框的默认值
    let initVal = tip.target.innerHTML;
    let strCn = tip.target.getAttribute("extendparam");
    if (Obj["cn_arr"].includes(strCn)) {
      if (initVal.length > 0) {
        document.querySelector(
          `*[extendparam=${strCn}_add]`
        ).innerHTML = toChineseNumber(initVal);
      } else {
        document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = "";
      }
    }
  }
);
