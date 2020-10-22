import {
  contractConfig,
  toChineseNumber,
  formatMoney
} from "./base.js";
let Obj = {
  cn_arr: ['val329', 'val330', 'val332', 'val336', 'val337']
};

let sub = {
  // val301: null, //甲方(出租人)
  // val302: null, //证件类型
  // val303: null, //证件号
  // val304: null, //共有权人
  // val305: null, //证件类型
  // val306: null, //证件号
  // val307: null, //乙方(承租人)
  // val308: null, //证件类型
  // val309: null, //证件号
  // val310: null, //丙方（居间人）

  checkbox_cb1: {
    //类型
    stateful: function (index) {
      return index === 3 ? {
          val311: null
        } :
        null;
    }
  },
  val312: null, //物业地址
  val313: null, //总面积
  val314: null, //承租面积
  checkbox_cb2: {
    stateful: function (index) {
      // 是否承租车位
      return index === 0 ? {
        val315: null,
        val316: null
      } : null;
    }
  },
  checkbox_cb3: {
    // 房屋权属证明
    state: true,
    stateful: function (index) {
      let res = null;
      switch (index) {
        case 0:
          res = {
            val317: null
          };
          break;
        case 1:
          res = {
            val318: null
          };
          break;
        case 2:
          res = {
            val319: null
          };
          break;
        case 3:
          res = {
            val320: null
          };
          break;
        case 4:
          res = {
            val321: null
          };
          break;
        default:
          res = null;
          break;
      }
      return res;
    }
  },
  checkbox_cb4: {
    //基本设施
    state: true,
    stateful: function (index) {
      return index === 5 ? {
        val322: null
      } : null;
    }
  },
  val323: null, //租赁该房屋作为
  val324: null, //日期
  val325: null, //日期
  val326: null, //日期
  // val326_1: null, //后视为交付完成
  val327: null, //合同期满前
  val328: null, //合同期满前
  val329: null, //金额
  val330: null, //金额
  checkbox_cb5: null, //支付方式
  val331: null, //天
  val332: null, //金额
  val333: null, //项费用由甲方承担
  val334: null, //项费用由乙方承担
  val335: null, //其它费用
  val336: null, //金额
  val337: null, //金额
  val338: null, //甲方有下列情形之一的
  val339: null, //甲方有下列情形之一的
  val340: null, //天
  val341: null, //其他约定
  val342: null, //其他约定事项
  // info_val345: {
  //   // 自来水
  //   stateful: function () {
  //     return document.querySelector("*[extendparam=val345]").innerHTML !== "" ? {
  //         val345: null
  //       } :
  //       document.querySelector("*[extendparam=val346]").innerHTML !== "" ? {
  //         val346: null
  //       } : {
  //         val345: null,
  //         val346: null
  //       };
  //   }
  // },
  // info_val347: {
  //   // 供电
  //   stateful: function () {
  //     return document.querySelector("*[extendparam=val347]").innerHTML !== "" ? {
  //         val347: null
  //       } :
  //       document.querySelector("*[extendparam=val348]").innerHTML !== "" ? {
  //         val348: null
  //       } : {
  //         val347: null,
  //         val348: null
  //       };
  //   }
  // },
  // info_val349: {
  //   // 燃气
  //   stateful: function () {
  //     return document.querySelector("*[extendparam=val349]").innerHTML !== "" ? {
  //         val349: null
  //       } :
  //       document.querySelector("*[extendparam=val350]").innerHTML !== "" ? {
  //         val350: null
  //       } : {
  //         val349: null,
  //         val350: null
  //       };
  //   }
  // },
  // val360: null, //物业费已缴费至
  // 家具家电交付清单
  info_val369: {
    //冰箱
    stateful: function () {
      return document.querySelector("*[extendparam=val369").innerHTML !== "" ? {
        val370: null,
        checkbox_cb7: null
      } : null
    }
  },
  info_val371: {
    //微波炉
    stateful: function () {
      return document.querySelector("*[extendparam=val371").innerHTML !== "" ? {
        val372: null,
        checkbox_cb8: null
      } : null
    }
  },
  info_val373: {
    //洗衣机
    stateful: function () {
      return document.querySelector("*[extendparam=val373").innerHTML !== "" ? {
        val374: null,
        checkbox_cb9: null
      } : null
    }
  },
  info_val375: {
    //热水器
    stateful: function () {
      return document.querySelector("*[extendparam=val375").innerHTML !== "" ? {
        val376: null,
        checkbox_cb10: null
      } : null
    }
  },
  info_val377: {
    //空调
    stateful: function () {
      return document.querySelector("*[extendparam=val377").innerHTML !== "" ? {
        val378: null,
        checkbox_cb11: null
      } : null
    }
  },
  info_val379: {
    //电视
    stateful: function () {
      return document.querySelector("*[extendparam=val379").innerHTML !== "" ? {
        val380: null,
        checkbox_cb12: null
      } : null
    }
  },
  info_val384: {
    //油烟机
    stateful: function () {
      return document.querySelector("*[extendparam=val384").innerHTML !== "" ? {
        val385: null,
        checkbox_cb13: null
      } : null
    }
  },
  info_val386: {
    //燃气灶
    stateful: function () {
      return document.querySelector("*[extendparam=val386").innerHTML !== "" ? {
        val387: null,
        checkbox_cb14: null
      } : null
    }
  },
  info_val388: {
    //固定电话
    stateful: function () {
      return document.querySelector("*[extendparam=val388").innerHTML !== "" ? {
        val389: null,
        checkbox_cb15: null
      } : null
    }
  },
  //坐便器
  info_val390: {
    stateful: function () {
      return document.querySelector("*[extendparam=val390").innerHTML !== "" ? {
        val391: null,
        checkbox_cb16: null
      } : null
    }
  },
  //床
  info_val392: {
    stateful: function () {
      return document.querySelector("*[extendparam=val392").innerHTML !== "" ? {
        val393: null
      } : null
    }
  },
  info_val394: {
    stateful: function () {
      return document.querySelector("*[extendparam=val394").innerHTML !== "" ? {
        val395: null
      } : null
    }
  },
  //沙发
  info_val396: {
    stateful: function () {
      return document.querySelector("*[extendparam=val396").innerHTML !== "" ? {
        checkbox_cb17: null
      } : null
    }
  },
  info_val397: {
    stateful: function () {
      return document.querySelector("*[extendparam=val397").innerHTML !== "" ? {
        checkbox_cb17: null
      } : null
    }
  },
  info_val398: {
    stateful: function () {
      return document.querySelector("*[extendparam=val398").innerHTML !== "" ? {
        checkbox_cb17: null
      } : null
    }
  },
  //衣柜
  info_val400: {
    stateful: function () {
      return document.querySelector("*[extendparam=val400").innerHTML !== "" ? {
        val401: null
      } : null
    }
  },
  info_val402: {
    stateful: function () {
      return document.querySelector("*[extendparam=val402").innerHTML !== "" ? {
        val403: null
      } : null
    }
  },
  info_val404: {
    stateful: function () {
      return document.querySelector("*[extendparam=val404").innerHTML !== "" ? {
        val405: null
      } : null
    }
  },
  //茶几
  info_val406: {
    stateful: function () {
      return document.querySelector("*[extendparam=val406").innerHTML !== "" ? {
        val407: null,
        checkbox_cb18: null
      } : null
    }
  },
  //餐桌
  info_val409: {
    stateful: function () {
      return document.querySelector("*[extendparam=val409").innerHTML !== "" ? {
        val410: null,
        checkbox_cb19: null
      } : null
    }
  },
  //椅子
  info_val412: {
    stateful: function () {
      return document.querySelector("*[extendparam=val412").innerHTML !== "" ? {
        checkbox_cb20: null
      } : null
    }
  },
};

//给按钮添加点击事件
let mainBtn = document.querySelector("#submit");
if (mainBtn) {
  mainBtn.addEventListener("click", function (e) {
    contractConfig.submit(e, sub, "templateError");
  });
} else {
  let btn = document.createElement("span");
  btn.id = "submit";
  btn.style.display = "none";
  btn.innerHTML = "click";
  document.body.appendChild(btn);
  btn.addEventListener("click", function (e) {
    contractConfig.submit(e, sub, "templateError");
  });
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
  // Dropdown.create({
  //   classN: 'dropdown-item',
  //   callBack: function (bindElem, dateObj) {
  //     if (bindElem.tagName.toLowerCase() === 'input') {
  //       if (attr) {

  //         if (attr === 'val222') {
  //           contractConfig.prohibit(bindElem, ['1', '2', '3'], 'val222')
  //           contractConfig.initForm(['checkbox_sixOne', 'val223', 'checkbox_sixTwo', 'checkbox_sixThree', 'checkbox_sixFour'], 0)
  //         }
  //       }
  //     } else {
  //       bindElem.innerHTML = dateObj.value
  //       bindElem.classList.remove('input-select')
  //       bindElem.classList.remove('input-before')
  //     }
  //   }
  // })

  // 输入框右侧吸边
  let textLong = Array.from(document.querySelectorAll(".text-limit"));
  textLong.forEach(function (item) {
    item.addEventListener("input", function () {
      let leng = this.value.length;
      for (let i = 0; i < leng; i++) {
        if (this.scrollWidth > this.clientWidth) {
          this.value = this.value.substring(0, this.value.length - 1);
        }
      }
    });
  });

  //基础数据赋值
  let msg = {}

  if (window.location.href.indexOf('//192.168') > 0 || window.location.href.indexOf('//localhost') > 0) {
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
    }
  } else {
    msg = JSON.parse(window.sessionStorage.getItem("contractMsg"))
  }


  for (let readonlyItem in msg) {
    let onlyReadDom = Array.from(
      document.querySelectorAll(`*[systemparam=${readonlyItem}]`)
    );

    let readonlyArr = [
      "code",
      "ownerTel",
      "organizationCode",
      "guestTel",
      "ownerName",
      "ownerCardType",
      "ownerID",
      "ownerNames",
      "ownerCardTypes",
      "ownerIDs",
      "guestName",
      "guestCardType",
      "guestID",
      "guestNames",
      "guestIDs",
      "propertyAddr",
      "dealPrice",
      "dealPriceUpper",
      "companyNames",
      "guestStoreRegisterCode",
      "signDate"
    ];
    if (onlyReadDom.length > 0) {
      onlyReadDom.forEach((element, index) => {
        if (readonlyArr.includes(readonlyItem)) {
          if (readonlyItem === "companyNames") {
            element.innerHTML = msg[readonlyItem][0];
          } else if (readonlyItem === "propertyAddr") {
            element.innerHTML = msg[readonlyItem];
          } else if (readonlyItem === "signDate" && msg["signDate"]) {
            let time = new Date(Number(msg["signDate"]));
            let y = time.getFullYear();
            let M = time.getMonth() + 1;
            let D = time.getDate();
            let signDate = `${y}年${M}月${D}日`;
            element.innerHTML = signDate;
          } else {
            element.innerHTML = msg[readonlyItem];
          }
          element.classList.remove("input-before");
        }
      });
    }
  }

  // 勾选框逻辑
  contractConfig.checkboxListener(
    function () {},
    function (obj, index) {
      let attr = obj.currentTarget.getAttribute("name");
      let boxArray = document.getElementsByName(attr);

      if (attr === "cb1") {
        //类型
        let checkIO = {
          3: ["val311"]
        };
        boxArray.forEach((item, i) => {
          if (item === obj.currentTarget) {
            if (item.querySelector("p").getAttribute("checked")) {
              if (i === 3) {
                contractConfig.initForm(checkIO[3], 0);
              }
            } else {
              if (i === 3) {
                contractConfig.initForm(checkIO[3], 1);
              }
            }
          }
        });
      } else if (attr === "cb2") {
        //是否承租车位
        let checkIO = {
          0: ["val315", "val316"],
          1: ["val315", "val316"]
        };
        boxArray.forEach((item, i) => {
          if (item === obj.currentTarget) {
            if (item.querySelector("p").getAttribute("checked")) {
              contractConfig.initForm(checkIO[i], 0);
              if (i === 0) {
                contractConfig.initForm(checkIO[i], 0);
              } else {
                contractConfig.initForm(checkIO[0], 1);
              }
            } else {
              contractConfig.initForm(checkIO[i], 1);
            }
          }
        });
      } else if (attr === "cb3") {
        //房屋权属证明
        let checkIO = {
          0: ["val317"],
          1: ["val318"],
          2: ["val319"],
          3: ["val320"],
          4: ["val321"],
        }
        boxArray.forEach((item, i) => {
          if (item === obj.currentTarget) {
            if (item.querySelector("p").getAttribute("checked")) {
              contractConfig.initForm(checkIO[i], 0);
            } else {
              contractConfig.initForm(checkIO[i], 1);
            }
          }
        });
        // let checkIO = {
        //   0: {
        //     disabled: ["val318", "val319", "val320", "val321"],
        //     write: ["val317"]
        //   },
        //   1: {
        //     disabled: ["val317", "val319", "val320", "val321"],
        //     write: ["val318"]
        //   },
        //   2: {
        //     disabled: ["val317", "val318", "val320", "val321"],
        //     write: ["val319"]
        //   },
        //   3: {
        //     disabled: ["val317", "val318", "val319", "val321"],
        //     write: ["val320"]
        //   },
        //   4: {
        //     disabled: ["val317", "val318", "val319", "val320"],
        //     write: ["val321"]
        //   }
        // };
        // boxArray.forEach((item, i) => {
        //   if (item === obj.currentTarget) {
        //     if (item.querySelector("p").getAttribute("checked")) {
        //       contractConfig.initForm(checkIO[i].disabled, 1);
        //       contractConfig.initForm(checkIO[i].write, 0);
        //     } else {
        //       contractConfig.initForm(checkIO[i].disabled, 1);
        //       contractConfig.initForm(checkIO[i].write, 1);
        //     }
        //   }
        // });
      } else if (attr === "cb4") {
        //类型
        let checkIO = {
          5: ["val322"]
        };
        boxArray.forEach((item, i) => {
          if (item === obj.currentTarget) {
            if (item.querySelector("p").getAttribute("checked")) {
              if (i === 5) {
                contractConfig.initForm(checkIO[i], 0);
              }
            } else {
              if (i === 5) {
                contractConfig.initForm(checkIO[5], 1);
              }
            }
          }
        });
      } else if (attr === "cb6") {
        //门禁卡
        let index = 0 //需填写栏对应的索引
        let checkIO = {
          [index]: ["val368"]
        };
        boxArray.forEach((item, i) => {
          if (item === obj.currentTarget) {
            if (item.querySelector("p").getAttribute("checked")) {
              if (i === index) {
                sub.val368 = null
                contractConfig.initForm(checkIO[index], 0);
              } else {
                delete sub.val368
                contractConfig.initForm(checkIO[index], 1);
              }
            } else {
              delete sub.val368
              contractConfig.initForm(checkIO[i], 1);
            }
          }
        });
      } else if (attr === "cb17") {
        //沙发
        let index = 3 //需填写栏对应的索引
        let checkIO = {
          [index]: ["val399"]
        };
        boxArray.forEach((item, i) => {
          if (item === obj.currentTarget) {
            if (item.querySelector("p").getAttribute("checked")) {
              if (i === index) {
                sub.val399 = null
                contractConfig.initForm(checkIO[i], 0);
              } else {
                delete sub.val399
                contractConfig.initForm(checkIO[index], 1);
              }
            } else {
              delete sub.val399
              contractConfig.initForm(checkIO[index], 1);
            }
          }
        });
      } else if (attr === "cb18") {
        //茶几
        let index = 3 //需填写栏对应的索引
        let checkIO = {
          [index]: ["val408"]
        };
        boxArray.forEach((item, i) => {
          if (item === obj.currentTarget) {
            if (item.querySelector("p").getAttribute("checked")) {
              if (i === index) {
                contractConfig.initForm(checkIO[i], 0);
              } else {
                contractConfig.initForm(checkIO[index], 1);
              }
            } else {
              contractConfig.initForm(checkIO[index], 1);
            }
          }
        });
      } else if (attr === "cb19") {
        //餐桌
        let index = 3 //需填写栏对应的索引
        let checkIO = {
          [index]: ["val411"]
        };
        boxArray.forEach((item, i) => {
          if (item === obj.currentTarget) {
            if (item.querySelector("p").getAttribute("checked")) {
              if (i === index) {
                contractConfig.initForm(checkIO[i], 0);
              } else {
                contractConfig.initForm(checkIO[index], 1);
              }
            } else {
              contractConfig.initForm(checkIO[index], 1);
            }
          }
        });
      } else if (attr === "cb20") {
        //椅子
        let index = 3 //需填写栏对应的索引
        let checkIO = {
          [index]: ["val413"]
        };
        boxArray.forEach((item, i) => {
          if (item === obj.currentTarget) {
            if (item.querySelector("p").getAttribute("checked")) {
              if (i === index) {
                contractConfig.initForm(checkIO[i], 0);
              } else {
                contractConfig.initForm(checkIO[index], 1);
              }
            } else {
              contractConfig.initForm(checkIO[index], 1);
            }
          }
        });
      } else if (attr === "cb21") {
        //卧室地板
        let index = 4 //需填写栏对应的索引
        let checkIO = {
          [index]: ["val414"]
        };
        boxArray.forEach((item, i) => {
          if (item === obj.currentTarget) {
            if (item.querySelector("p").getAttribute("checked")) {
              if (i === index) {
                contractConfig.initForm(checkIO[i], 0);
              } else {
                contractConfig.initForm(checkIO[index], 1);
              }
            } else {
              contractConfig.initForm(checkIO[index], 1);
            }
          }
        });
      } else if (attr === "cb22") {
        //客厅地板
        let index = 4 //需填写栏对应的索引
        let checkIO = {
          [index]: ["val415"]
        };
        boxArray.forEach((item, i) => {
          if (item === obj.currentTarget) {
            if (item.querySelector("p").getAttribute("checked")) {
              if (i === index) {
                contractConfig.initForm(checkIO[i], 0);
              } else {
                contractConfig.initForm(checkIO[index], 1);
              }
            } else {
              contractConfig.initForm(checkIO[index], 1);
            }
          }
        });
      } else if (attr === "cb23") {
        //厨房墙面
        let index = 3 //需填写栏对应的索引
        let checkIO = {
          [index]: ["val416"]
        };
        boxArray.forEach((item, i) => {
          if (item === obj.currentTarget) {
            if (item.querySelector("p").getAttribute("checked")) {
              if (i === index) {
                contractConfig.initForm(checkIO[i], 0);
              } else {
                contractConfig.initForm(checkIO[index], 1);
              }
            } else {
              contractConfig.initForm(checkIO[index], 1);
            }
          }
        });
      } else if (attr === "cb24") {
        //客厅墙面
        let index = 3 //需填写栏对应的索引
        let checkIO = {
          [index]: ["val417"]
        };
        boxArray.forEach((item, i) => {
          if (item === obj.currentTarget) {
            if (item.querySelector("p").getAttribute("checked")) {
              if (i === index) {
                contractConfig.initForm(checkIO[i], 0);
              } else {
                contractConfig.initForm(checkIO[index], 1);
              }
            } else {
              contractConfig.initForm(checkIO[index], 1);
            }
          }
        });
      } else if (attr === "cb25") {
        //客厅墙面
        let index = 3 //需填写栏对应的索引
        let checkIO = {
          [index]: ["val418"]
        };
        boxArray.forEach((item, i) => {
          if (item === obj.currentTarget) {
            if (item.querySelector("p").getAttribute("checked")) {
              if (i === index) {
                contractConfig.initForm(checkIO[i], 0);
              } else {
                contractConfig.initForm(checkIO[index], 1);
              }
            } else {
              contractConfig.initForm(checkIO[index], 1);
            }
          }
        });
      }
    }
  );

  //输入自适应
  contractConfig.inputListener(
    function (ev, tip) {
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
          if (ev.target.value.indexOf(",") != -1) {
            ev.target.value = ev.target.value.replace(/,/g, "");
          }
          let index = toChineseNumber(ev.target.value).indexOf("元");
          document.querySelector(
            `*[extendparam=${cn_str}_add]`
          ).innerHTML = toChineseNumber(ev.target.value).substring(0, index);
          if (ev.target.value.indexOf(",") == -1) {
            document.querySelector(
              `*[extendparam=${cn_str}]`
            ).innerHTML = formatMoney(ev.target.value);
          }
        }
      }
    },
    function (tip) {
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
}, 100);
