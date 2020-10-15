import { contractConfig, toChineseNumber, formatMoney } from "./base.js";

// 动态添加id
(function() {
    let t = document.querySelectorAll('.navTitle');
    t.forEach((e, i) => {
        e.setAttribute('id', 'a' + i);
    });
})()

// 获取阿拉伯数字转小写的字符串add
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

// 必填校验对象
let sub = {
    val1: null,
    val2: null,
    val3: null,
    val4: null,
    val5: null,
    val6: null,
    val7: null,
    val8: null,
    val9: null,
    val10: null,
    val11: null,
    val12: null,
    val13: null,
    val14: null,
    val15: null,
    val16: null,
    val19: null,
    val20: null,
    val24: null,
    val25: null,
    val26: null,
    val27: null,
    val28: null,
    val29: null,
    val30: null,
    val31: null,
};

// 接口赋值的对象
//基础数据赋值
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
// let msg = {
//     ownerName: "甲方名字",
//     ownerID: "甲方身份证号码",
//     ownerTel: "甲方电话号码",
//     guestName: "乙方名字",
//     guestID: "乙方身份证号码",
//     guestTel: "乙方电话号码",
//     code: "S0001191107007",
//     signDate: 1592465819508
// }

// 赋值
for (let readonlyItem in msg) {
    let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
    onlyReadDom.forEach(e => {
        if (readonlyItem === 'signDate' && msg["signDate"]) {
            let time = new Date(Number(msg["signDate"]));
            let y = time.getFullYear();
            let M = time.getMonth() + 1;
            let D = time.getDate();
            let signDate = `${y}年${M}月${D}日`
            console.log(signDate)
            e.innerHTML = signDate
        } else {
            e.innerHTML = msg[readonlyItem]
        }

        e.classList.remove('input-before');
    })
}

// 下拉初始值
let dropdownDate = {
    val7: {
        1: [],
        2: ['val71'],
        3: ['val72'],
        init: ['val71', 'val72']
    },
    val8: {
        1: [],
        2: ['val81'],
        init: ['val81']
    },
    val16: {
        1: [],
        2: [],
        3: ['val17', 'val18'],
        4: ['val161'],
        init: ['val17', 'val18', 'val161']
    },
    val20: {
        1: ["val21", 'val21_add', "val201", "val2011", "val211"],
        2: ["val22", "val22_add", "val23", "val23_add", "val231"],
        3: [],
        init: ["val21", 'val21_add', "val201", "val2011", "val211", "val22", "val22_add", "val23", "val23_add", "val231"]
    },
    val201: {
        1: [],
        2: [],
        3: ['val2011'],
        init: ['val2011']
    },
}
// 封掉整个下拉关联的值
for (const key in dropdownDate) {
    if (dropdownDate.hasOwnProperty(key)) {
        contractConfig.initForm(dropdownDate[key].init, 1)
    }
}

//初始化下拉控件
let oldValue = {};
Dropdown.create({
    classN: 'dropdown-item',
    callBack: function(bindElem, dateObj) {
        if (bindElem.tagName.toLowerCase() === 'input') {
            bindElem.value = dateObj.value
            bindElem.setAttribute('value', bindElem.value)
            let attr = bindElem.getAttribute('inputmethod')
            if (attr) {
                // 如果是选择相同值 不清空
                if (oldValue[attr] && oldValue[attr] === dateObj.value) {
                    return;
                }
                oldValue[attr] = dateObj.value;
                // 封
                contractConfig.initForm(dropdownDate[attr].init, 1)
                // 解封
                dropdownDate[attr][bindElem.value].length > 0 ? contractConfig.initForm(dropdownDate[attr][bindElem.value], 0) : ""
            }
        } else {
            bindElem.innerHTML = dateObj.value
            bindElem.classList.remove('input-select')
            bindElem.classList.remove('input-before')
        }
    }
})

//给按钮添加点击事件
let mainBtn = document.querySelector('#submit');
if (mainBtn) {
    mainBtn.addEventListener('click', function(e) {
        contractConfig.submit(e, sub, 'templateError1')
    })
} else {
    let btn = document.createElement('span')
    btn.id = 'submit'
    btn.style.display = 'none'
    btn.innerHTML = 'click'
    document.body.appendChild(btn)
    btn.addEventListener('click', function(e) {
        contractConfig.submit(e, sub, 'templateError1')
    })
}

// 选择事件
contractConfig.checkboxListener();

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
)