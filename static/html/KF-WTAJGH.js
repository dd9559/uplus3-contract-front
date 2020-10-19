import { contractConfig, toChineseNumber, formatMoney } from "./base.js";


// 获取阿拉伯数字转小写的字符串add
// let Obj;
// (function() {
//     let t = document.querySelectorAll(`[extendParam]`);
//     let arr = [];

//     t.forEach(e => {
//         let name = e.getAttribute("extendParam")
//         if (name.indexOf("_add") > 0) {
//             let name2 = name.slice(0, -4);
//             arr.push(name2);
//         }
//     });
//     Obj = Obj || {};
//     Obj.cn_arr = arr;
// })()

let checkArr = {
    0: ['val7'],
    1: ['val3', 'val4', 'val5']
}

// 必填校验对象
let sub = {
    agent1_info: {
        stateful() {
            return proxyFn(1);
        }
    },
    agent3_info: {
        stateful() {
            return proxyFn(3);
        }
    },
    val1: null,
    checkbox_two: {
        stateful(i) {
            let j = {};
            checkArr[i].forEach(e => {
                j[e] = null;
            })
            return j
        }
    },
    val6: null,
};

function proxyFn(val) {
    let t = document.querySelector(`.text-limit[extendParam=agent${val}]`);
    let m = document.querySelector(`.text-limit[extendParam=agent${val + 1}]`);
    let b = document.querySelector(`.text-limit[extendParam=val${val>1? '8':'7'}]`);
    // 如果 甲方代理人有输入了 甲方代理人身份证 必须输入 
    if (t.innerText.length > 0 && m.innerText.length < 1) {
        return {
            ['agent' + (val + 1)]: null
        };
    }
    // 签章必须输入
    if (t.innerText.length > 0 && b.innerText.length < 1) {
        return {
            ['val' + (val > 1 ? '8' : '7')]: null
        };
    }
}

// 接口赋值的对象
//基础数据赋值
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
// let msg = {
//     ownerName: "甲方名字",
//     ownerID: "甲方身份证号码",
//     guestName: "乙方名字",
//     guestID: "乙方身份证号码",
//     code: "S0001191107007",
//     signDate: 1592465819508,
//     companyNames: "第三方服务公司名称"
// }

// 赋值
for (let readonlyItem in msg) {
    let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
    onlyReadDom.forEach(e => {
        if (readonlyItem === "companyNames") {
            if (msg[readonlyItem].length > 0) {
                element.innerHTML = msg[readonlyItem][0];
                element.classList.remove("input-before");
            }
        } else if (readonlyItem === 'signDate' && msg["signDate"]) {
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

//初始化下拉控件
Dropdown.create({
    classN: 'dropdown-item',
    callBack: function(bindElem, dateObj) {
        bindElem.value = dateObj.value
        bindElem.setAttribute('value', bindElem.value)
    }
})

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
// 全部禁用
contractConfig.initForm(checkArr[0].concat(checkArr[1]), 1)
// 选择事件回调
contractConfig.checkboxListener('', function(obj, boxArray) {
    // 全部禁用
    contractConfig.initForm(checkArr[0].concat(checkArr[1]), 1)
    // 循环
    boxArray.forEach((e, i) => {
        let bool = e.querySelector('p').getAttribute('checked');
        // 如果是选中状态
        if (bool) {
            // 解禁
            contractConfig.initForm(checkArr[i], 0);
        }
    });
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