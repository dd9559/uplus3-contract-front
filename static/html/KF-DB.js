import {
    contractConfig,
    toChineseNumber,
    formatMoney
} from "./base.js"
let Obj = {
    cn_arr: ['val2','val3','val4','val5','val6','val7']
}

let sub = {
    'info_val8': {
        stateful: function () {
            return document.querySelector('*[extendparam=val8]').innerHTML !== '' ? {'val9': null,'val10': null} : null
        }
    },
    'info_val11': {
        stateful: function () {
            return document.querySelector('*[extendparam=val11]').innerHTML !== '' ? {'val12': null,'val13': null} : null
        }
    },
    'val2': null,
    'val3': null,
    'val4': null,
    'val5': null,
    'val6': null,
    'val7': null,
}

//给按钮添加点击事件
let mainBtn = document.querySelector('#submit');
if (mainBtn) {
    mainBtn.addEventListener('click', function (e) {
        contractConfig.submit(e, sub, 'templateError')
    })
} else {
    let btn = document.createElement('span')
    btn.id = 'submit'
    btn.style.display = 'none'
    btn.innerHTML = 'click'
    document.body.appendChild(btn)
    btn.addEventListener('click', function (e) {
        contractConfig.submit(e, sub, 'templateError')
    })
}
setTimeout(() => {

    //初始化时间控件
    // Calendar.create({
    //   classN: 'calendar-item',
    //   callBack: function (bindElem, dateObj) {
    //     if (bindElem.tagName.toLowerCase() === 'input') {
    //       bindElem.value = `${dateObj.year}年${dateObj.month}月${dateObj.date}日`
    //       bindElem.setAttribute('value', bindElem.value)
    //       bindElem.setAttribute('random', dateObj.random)
    //     }
    //   }
    // })
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

        let readonlyArr = ['code', 'ownerTel', 'organizationCode', 'guestTel', 'ownerName', 'ownerID', 'ownerNames', 'ownerIDs', 'guestName', 'guestID', 'guestNames', 'guestIDs', 'propertyAddr', 'dealPrice', 'dealPriceUpper', 'companyNames', 'guestStoreRegisterCode', 'signDate']
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
    contractConfig.checkboxListener(function () { }, function (obj, index) {
        let attr = obj.currentTarget.getAttribute('name')
        let boxArray = document.getElementsByName(attr);
    })

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
                if (ev.target.value.indexOf(",") != -1) {
                    ev.target.value = ev.target.value.replace(/,/g, '')
                }
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
                if (initVal.indexOf(",") != -1) {
                    initVal = initVal.replace(/,/g, '');
                }
                let index = toChineseNumber(initVal).indexOf('元')
                document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal).substring(0, index)
                if (initVal.indexOf(",") == -1) {
                    document.querySelector(`*[extendparam=${strCn}]`).innerHTML = formatMoney(initVal)
                }
            } else {
                document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
            }
        }
    })
}, 100)
