import { contractConfig, toChineseNumber,formatMoney } from "./base.js";

let Obj = {
    cn_arr: ['val12']
};

// 必填校验对象
let sub = {
    // val1_info: {
    //     stateful() {
    //         return proxyFn(1);

    //     }
    // },
    val3_info: {
        stateful() {
            return proxyFn(3);
        }
    },
    // val5_info: {
    //     stateful() {
    //         return proxyFn(5);
    //     }
    // },
    val7_info: {
        stateful() {
            return proxyFn(7);
        }
    },
    val10: null,
    val11: null,
    val12: null,
};

function proxyFn(val) {
    let t = document.querySelector(`.text-limit[extendParam=val${val}]`);
    let m = document.querySelector(`.text-limit[extendParam=val${val + 1}]`);
    // 如果 甲方代理人有输入了 甲方代理人身份证 必须输入 
    if (t.innerText.length > 0 && m.innerText.length < 1) {
        return {
            ['val' + (val + 1)]: null
        };
    }
}

// 接口赋值的对象
//基础数据赋值
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
// let msg = {
//     sellerName: "甲方名字",
//     sellerId: "甲方身份证号码",
//     buyerName: "乙方名字",
//     buyerId: "乙方身份证号码",
//     code: "S0001191107007",
//     wtSignDate: 1592465819508
// }

// 赋值
for (let readonlyItem in msg) {
    let nameItem = readonlyItem==='wtSignDate'?'signDate':readonlyItem
    let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${nameItem}]`));
    onlyReadDom.forEach(e => {
        if (nameItem === 'signDate' && msg[readonlyItem]) {
            let time = new Date(Number(msg[readonlyItem]));
            let y = time.getFullYear();
            let M = time.getMonth() + 1;
            let D = time.getDate();
            let signDate = `${y}年${M}月${D}日`
            e.innerHTML = signDate
        } else {
            e.innerHTML = msg[readonlyItem]
        }
        e.classList.remove('input-before');
    })
}

//给按钮添加点击事件
let mainBtn = document.querySelector('#submit');
if (mainBtn) {
    mainBtn.addEventListener('click', function(e) {
        contractConfig.submit(e, sub, 'templateError')
    })
} else {
    let btn = document.createElement('span')
    btn.id = 'submit'
    btn.style.display = 'none'
    btn.innerHTML = 'click'
    document.body.appendChild(btn)
    btn.addEventListener('click', function(e) {
        contractConfig.submit(e, sub, 'templateError')
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