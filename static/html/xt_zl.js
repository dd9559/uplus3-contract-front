import { contractConfig, toChineseNumber, formatMoney } from "./base.js";

// 获取阿拉伯数字转小写的字符串add
let Obj;
(function() {
  let t = document.querySelectorAll(`[extendParam]`);
  let arr = [];

  t.forEach(e => {
    let name = e.getAttribute("extendParam");
    if (name.indexOf("_add") > 0) {
      let name2 = name.slice(0, -4);
      arr.push(name2);
    }
  });
  Obj = Obj || {};
  Obj.cn_arr = arr;
})();

let checkArr = {
  check1: {
    3: ["val5"]
  },
  check4: {
    5: ["val8"]
  },
  check7: {
    0: ["val148"],
    1: ["val149"],
    2: ["val150"]
  },
  check8: {
    0: ["val151"],
    1: []
  }
};

// 必填校验对象
let sub = {
  val1_info: {
    stateful() {
      return proxyFn(1);
    }
  },
  val3_info: {
    stateful() {
      return proxyFn(3);
    }
  },
  checkbox_check1: {
    stateful(i) {
      return i === 3
        ? {
            [checkArr["check1"][i]]: null
          }
        : null;
    }
  },
  checkbox_check2: null,
  val7: null,
  checkbox_check3: null,
  val9: null,
  val10: null,
  val11: null,
  val12: null,
  val13: null,
  val14: null,
  val15: null,
  val16: null,
  val17: null,
  checkbox_check5: null,
  val18: null,
  checkbox_check6: null,
  val19: null,
  val20: null,
  val21s: null,
  val21: null,
  val22: null,
  val23: null,
  val24: null,
  val27: null,
  val300: null
};

function proxyFn(val) {
  let t = document.querySelector(`.text-limit[extendParam=val${val}]`);
  let m = document.querySelector(`.text-limit[extendParam=val${val + 1}]`);
  // let p = val == 1 ? '30' : '31';
  // let b = document.querySelector(`.text-limit[extendParam=val${p}]`);
  // 如果 甲方代理人有输入了 甲方代理人身份证 必须输入
  if (t.innerText.length > 0 && m.innerText.length < 1) {
    return {
      ["val" + (val + 1)]: null
    };
  }
  // 签章必须输入
  // if (t.innerText.length > 0 && b && b.innerText.length < 1) {
  //     return {
  //         ['val' + p]: null
  //     };
  // }
}

//基础数据赋值
let msg = {};

if (
  window.location.href.indexOf("//192.168") > 0 ||
  window.location.href.indexOf("//localhost") > 0
) {
  msg = {
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
    ownerCardTypes: "营业执照",
    ownerID: "123",
    ownerIDs: "ee2353-344，ii397-4839",
    ownerName: "熊先",
    ownerNames: "胜多少，发士夫",
    ownerTel: "18888888888",
    ownerTels: "",
    propertyAddr: "a市b区c",
    singleCompany: "是的噶几开会说",
    dealPrice: 1000,
    dealPriceUpper: "壹仟",
    square: 160,
    guestStoreRegisterCode: "213",
    signDate: 1592465819508,
    organizationCode: "8888888888"
  };
} else {
  msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
}
setTimeout(() => {
  // 赋值
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
  // 选择事件
  // 禁用
  for (const key in checkArr) {
    if (checkArr.hasOwnProperty(key)) {
      let e = checkArr[key];
      for (const k in e) {
        if (e.hasOwnProperty(k)) {
          let tag = document.querySelectorAll(`[name='${key}']`);
          console.log(tag[k].querySelector("p").getAttribute("checked"), 8888);
          if (!tag[k].querySelector("p").getAttribute("checked")) {
            contractConfig.initForm(e[k], 1);
          }
        }
      }
    }
  }

  // 选择第几个
  let indexChcek = 0;
  // 选择事件回调
  contractConfig.checkboxListener(
    function(obj, i) {
      indexChcek = i;
    },
    function(obj, boxArray) {
      // 循环
      boxArray.forEach((e, i) => {
        let bool = e.querySelector("p").getAttribute("checked");
        let name = e.getAttribute("name");
        // 如果是选中状态
        if (name === "check4" && i === 5) {
          if (indexChcek === 5) {
            contractConfig.initForm(checkArr[name][indexChcek], bool ? 0 : 1);
          }
        }
        if (name === "check7" && i === indexChcek) {
          contractConfig.initForm(checkArr[name][indexChcek], bool ? 0 : 1);
        }
        if (name === "check8" || (name === "check1" && i === 3)) {
          contractConfig.initForm(checkArr[name][i], bool ? 0 : 1);
        }
      });
    }
  );

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
        ev.target.value = ev.target.value.replace(/[^\d]/g, "");
        tip.target.innerHTML = ev.target.value;
        let cn_str = tip.target.getAttribute("extendparam");

        if (Obj["cn_arr"].includes(cn_str)) {
          document.querySelector(
            `*[extendparam=${cn_str}_add]`
          ).innerHTML = toChineseNumber(ev.target.value);
          document.querySelector(
            `*[extendparam=${cn_str}]`
          ).innerHTML = formatMoney(ev.target.value);
        }
      }
    },
    function(tip) {
      //获取输入框的默认值
      let initVal = tip.target.innerHTML;
      let strCn = tip.target.getAttribute("extendparam");

      // if (Obj["cn_arr"].includes(strCn)) {
      //     if (initVal.length > 0) {
      //         document.querySelector(
      //             `*[extendparam=${strCn}_add]`
      //         ).innerHTML = toChineseNumber(initVal);
      //     } else {
      //         document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = "";
      //     }
      // }
    }
  );
}, 100);
