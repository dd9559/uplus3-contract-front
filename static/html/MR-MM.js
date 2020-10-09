import {
    contractConfig,
    toChineseNumber,
    formatMoney
} from "./base.js"

let Obj = {
    cn_arr: ['val50', 'val51', 'val52', 'val53', 'val54', 'val55', 'val56', 'val57', 'val58', 'val59', 'val314', 'val315']
}

let sub = {
    // 'info_val1': {
    //     stateful: function () {
    //         return document.querySelector('*[extendparam=val1]').innerHTML !== '' ? {
    //             'val2': null
    //         } : null
    //     }
    // },
    // 'info_val3': {
    //     stateful: function () {
    //         return document.querySelector('*[extendparam=val3]').innerHTML !== '' ? {
    //             'val4': null
    //         } : null
    //     }
    // },
    // "val5": null,
    // 'info_val3': {
    //     stateful: function () {
    //         return document.querySelector('*[extendparam=val3]').innerHTML !== '' ? {
    //             'val4': null
    //         } : null
    //     }
    // },
    // 'info_val6': {
    //     stateful: function () {
    //         return document.querySelector('*[extendparam=val6]').innerHTML !== '' ? {
    //             'checkbox_one': null,
    //         } : null
    //     }
    // },
    // 'checkbox_two': {
    //     stateful: function (index) {
    //         return index === 3 ? {
    //             'val7': null,
    //         } : null
    //     }
    // },
    // 'checkbox_three': {
    //     stateful: function (index) {
    //         return index === 1 ? {
    //             'drapdown_val8': {
    //                 stateful: function (val) {
    //                     let res = null;
    //                     switch (val) {
    //                         case 'A':
    //                             res = {
    //                                 'val9': null
    //                             };
    //                         case 'B':
    //                             res = {
    //                                 'val10': null
    //                             };
    //                             break;
    //                     }
    //                     return res;
    //                 }
    //             },
    //         } : null
    //     }
    // },
    // 'val50': null,
    // 'checkbox_four': null,
    // 'checkbox_five': {
    //     stateful: function (index) {
    //         return index === 0 ? {
    //             'checkbox_six': null,
    //             'val11': null,
    //             'checkbox_carPlace': null,
    //         } : null
    //     }
    // },
    // 'val51': null,
    // 'val52': null,
    // 'drapdown_val12': {
    //     stateful: function (val) {
    //         let res = null;
    //         switch (val) {
    //             case 'A':
    //                 break;
    //             case 'B':
    //                 res = {
    //                     'checkbox_seven': {
    //                         stateful: function (index) {
    //                             return index === 0 ? {
    //                                 'val13': null
    //                             } : null
    //                         }
    //                     },
    //                     'val53': null,
    //                     'val54': null,

    //                 };
    //                 break;
    //             case 'C':
    //                 res = {
    //                     'val14': null,
    //                     'val55': null,
    //                     'val56': null,
    //                 };
    //                 break;
    //             case 'D':
    //                 res = {
    //                     'val15': null,
    //                     'val57': null,
    //                     'checkbox_eight': null
    //                 };
    //                 break;
    //         }
    //         return res;
    //     }
    // },
    // 'val58': null,
    // 'checkbox_nine': {
    //     stateful: function (index) {
    //         return index === 1 ? {
    //             'checkbox_ten': null,
    //         } : null
    //     }
    // },
    // 'val16': null,
    // 'drapdown_val17': null,
    // 'checkbox_ele': null,
    // 'checkbox_twe': null,
    // 'checkbox_thirteen': null,
    // 'val18': null,
    // 'checkbox_fourteen': null,
    // 'checkbox_fiveteen': null,
    // 'checkbox_sixteen': null,
    // 'checkbox_seventeen': null,
    // 'drapdown_val19': null,
    // 'val59': null,
    // 'drapdown_val20': {
    //     stateful: function (val) {
    //         let res = null;
    //         switch (val) {
    //             case 'A':
    //                 res = {
    //                     'val21': null,
    //                 };
    //                 break;
    //             case 'B':
    //                 res = {
    //                     'val22': null,
    //                 };
    //                 break;
    //             case 'C':
    //                 res = {
    //                     'val23': null
    //                 };
    //                 break;
    //         }
    //         return res;
    //     }
    // },
    // info_val305: {
    //     stateful: function () {
    //         return document.querySelector('*[extendparam=val305]').innerHTML !== '' ? {
    //             val306: null
    //         } : null
    //     }
    // },
    // info_val311: {
    //     stateful: function () {
    //         return document.querySelector('*[extendparam=val311]').innerHTML !== '' ? {
    //             val312: null
    //         } : null
    //     }
    // },
    // val314: null,
    // val315: null,

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
        signDate: 1592465819508,
        organizationCode: "8888888888"
    }
    for (let readonlyItem in msg) {
        let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));

        let readonlyArr = ['code', 'square', 'ownerTel', 'organizationCode', 'guestTel', 'ownerName', 'ownerID', 'ownerNames', 'ownerIDs', 'guestName', 'guestID', 'guestNames', 'guestIDs', 'propertyAddr', 'dealPrice', 'dealPriceUpper', 'companyNames', 'guestStoreRegisterCode', 'signDate']
        if (onlyReadDom.length > 0) {
            onlyReadDom.forEach((element, index) => {
                if (readonlyArr.includes(readonlyItem)) {
                    if (readonlyItem === 'companyNames') {
                        element.innerHTML = msg[readonlyItem][0]
                    } else if (readonlyItem === 'propertyAddr') {
                        element.innerHTML = msg[readonlyItem]
                        // document.querySelector(`*[extendparam=val22]`).innerHTML = msg[readonlyItem]
                        // document.querySelector(`*[extendparam=val22]`).classList.remove('input-before')
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
        function () { }, function (obj, index) {
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
                    1: ['checkbox_ten'],
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
        if (spanAttr === 'number') {
            ev.target.value = ev.target.value.replace(/[^\d]/g, "")
            tip.target.innerHTML = ev.target.value
            let cn_str = tip.target.getAttribute('extendparam')
            if (Obj['cn_arr'].includes(cn_str)) {
                let index = toChineseNumber(ev.target.value).indexOf('元')
                document.querySelector(`*[extendparam=${cn_str}_add]`).innerHTML = toChineseNumber(ev.target.value).substring(0, index)
                if (ev.target.value.indexOf(",") == -1) {
                    document.querySelector(`*[extendparam=${cn_str}]`).innerHTML = formatMoney(ev.target.value)
                }
            }
        }
    }, function (tip) {
        //获取输入框的默认值
        let initVal = tip.target.innerHTML
        let strCn = tip.target.getAttribute('extendparam')
        if (Obj['cn_arr'].includes(strCn)) {
            if (initVal.length > 0) {
                let index = toChineseNumber(initVal).indexOf('元')
                document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal).substring(0, index)
            } else {
                document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
            }
        }
    })

}, 100)
