import { contractConfig, toChineseNumber } from "./base.js";

let Obj = {
  cn_arr: []
};

let sub = {
  'checkbox_two':{
    stateful:function(index){
        return index===0?{
          'val1':null
        }:null
    } 
  },
  'val3':-1,
  'val5':-1,
  'val7':-1,
  'val9':-1,
  'val11':-1,
  'val13':-1,
  'val15':-1,
  'val17':-1,
  'val19':-1,
  'checkbox_three':{
    stateful:function(index){
        return index===0?{
          'val20':null
        }:null
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
//初始化下拉控件
Dropdown.create({
    classN: 'dropdown-item',
    callBack: function (bindElem, dateObj) {
      if (bindElem.tagName.toLowerCase() === 'input') {
        bindElem.value = dateObj.value
        bindElem.setAttribute('value', bindElem.value)
        let obj = {
          'val36': {
            1: ['val38', 'val40', 'val42'],
            2: ['val42'],
            3: ['val38', 'val40'],
            'init': ['val38', 'val40', 'val42']
          },
        }
        let attr = bindElem.getAttribute('extendParam')
        if (obj[attr]) {
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
    if (attr === "two") {
      let checkIO = {
        0: ["val1"],
      };
      boxArray.forEach((item, i) => {
        if (item === obj.currentTarget) {
          if (item.querySelector("p").getAttribute("checked")) {
            if (i === 0) {
              contractConfig.initForm(checkIO[0], 0); //readonly
            } else {
              contractConfig.initForm(checkIO[0], 1);
            }
          } else {
               contractConfig.initForm(checkIO[0], 1)
          }
        }
      });
    }
    if (attr === "three") {
      let checkIO = {
        0: ["val20"],
      };
      boxArray.forEach((item, i) => {
        if (item === obj.currentTarget) {
          if (item.querySelector("p").getAttribute("checked")) {
            if (i === 0) {
              contractConfig.initForm(checkIO[0], 0); //readonly
            } else {
              contractConfig.initForm(checkIO[0], 1);
            }
          } else {
               contractConfig.initForm(checkIO[0], 1)
          }
        }
      });
    }
  }
);

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
  // signDate: 1592465819508,
  wtSignDate: 1592465819508,
  organizationCode:"8888888888"
}
for (let readonlyItem in msg) {
  //得到readonly的值
  let onlyReadDom = Array.from(
    document.querySelectorAll(`*[systemparam=${readonlyItem}]`)
  );
  let readonlyArr = [
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
          if (readonlyItem === 'companyNames') {
            element.innerHTML = msg[readonlyItem][0]
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

// 输入自适应
contractConfig.inputListener(
  function(ev, tip) {
    if(tip.target.getAttribute('extendParam')=='val2'&&document.querySelector(`span[extendParam=val2`).innerHTML!=''){
      sub.val3=null
    }
    if(tip.target.getAttribute('extendParam')=='val4'&&document.querySelector(`span[extendParam=val4`).innerHTML!=''){
      sub.val5=null
    }
    if(tip.target.getAttribute('extendParam')=='val6'&&document.querySelector(`span[extendParam=val6`).innerHTML!=''){
      sub.val7=null
    }
    if(tip.target.getAttribute('extendParam')=='val8'&&document.querySelector(`span[extendParam=val8`).innerHTML!=''){
      sub.val9=null
    }
    if(tip.target.getAttribute('extendParam')=='val10'&&document.querySelector(`span[extendParam=val10`).innerHTML!=''){
      sub.val11=null
    }
    if(tip.target.getAttribute('extendParam')=='val12'&&document.querySelector(`span[extendParam=val12`).innerHTML!=''){
      sub.val13=null
    }
    if(tip.target.getAttribute('extendParam')=='val14'&&document.querySelector(`span[extendParam=val14`).innerHTML!=''){
      sub.val15=null
    }
    if(tip.target.getAttribute('extendParam')=='val16'&&document.querySelector(`span[extendParam=val16`).innerHTML!=''){
      sub.val17=null
    }
    if(tip.target.getAttribute('extendParam')=='val18'&&document.querySelector(`span[extendParam=val18`).innerHTML!=''){
      sub.val19=null
    }
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
)
