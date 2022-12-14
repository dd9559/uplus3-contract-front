import {
    contractConfig,
    toChineseNumber
} from "./base.js"

let Obj = {
    cn_arr: ['val23', 'val32', 'val31', 'val34', 'val37', 'val39', 'val41', 'val43', 'val44', 'val49', 'val52']
}

let sub = {
    'val1': null,
    'info_val500': {
        stateful: function () {
            return document.querySelector('*[extendparam=val500]').innerHTML !== '' ? {
                'val2': null,
            } : null
        }
    },
    'info_val3': {
        stateful: function () {
            return document.querySelector('*[extendparam=val3]').innerHTML !== '' ? {
                'val4': null,
                'val5': null,
                'val6': null
            } : null
        }
    },
    'val7': null,
    'info_val501': {
        stateful: function () {
            return document.querySelector('*[extendparam=val501]').innerHTML !== '' ? {
                'val8': null,
            } : null
        }
    },
    'info_val9': {
        stateful: function () {
            return document.querySelector('*[extendparam=val9]').innerHTML !== '' ? {
                'val10': null,
                'val11': null,
                'val12': null
            } : null
        }
    },
    'checkbox_one': null,
    'val102': null,
    'checkbox_two': {
        state: true,
        stateful: function (index) {
            return index === 6 ? {
                'val13': null
            } : null
        }
    },
    'checkbox_three': {
        state: true,
        stateful: function (index) {
            return index === 3 ? {
                'val14': null
            } : null
        }
    },
    'checkbox_four': null,
    // 'val15': null,
    'checkbox_five': {
        state: true,
        stateful: function (index) {
            return index === 0 ? {
                'val15': null,
                // 'val100': null,
                // 'val16': null,
                'val17': null,
            } : index === 1 ? {
                'info_val19': {
                    stateful: function () {
                        return document.querySelector('*[extendparam=val19]').innerHTML === '' ? {
                            'val18': null,
                            'val20': null,
                            'checkbox_six': null,
                            'val21': null
                        } : null
                    }
                },
                'info_val18': {
                    stateful: function () {
                        return document.querySelector('*[extendparam=val18]').innerHTML === '' ? {
                            'val19': null,
                            'val20': null,
                            'checkbox_six': null,
                            'val21': null
                        } : null
                    }
                }
            } : null
        }
    },
    'checkbox_seven': {
        state: true,
        stateful: function (index) {
            return index === 1 ? {
                'val22': null,
                'val23': null,
                'val24': null,
                'drapdown_val25': {
                    state: true,
                    stateful: function (val) {
                        let res = null;
                        switch (val) {
                            case '1':
                                break;
                            case '2':
                                res = {
                                    'checkbox_eight': null,
                                    'val26': null
                                };
                                break;
                            case '3':
                                res = {
                                    'checkbox_nine': null,
                                    'checkbox_ten': null,
                                    'checkbox_eleven': null,
                                };
                                break;
                        }
                        return res;
                    }
                },
            } : null
        }
    },
    'checkbox_twelve': {
        stateful: function (index) {
            return index === 1 ? {
                'val27': null,
                'drapdown_val28': {
                    state: true,
                    stateful: function (val) {
                        let res = null;
                        switch (val) {
                            case '1':
                                res = {
                                    'checkbox_threeteen': {
                                        state: true,
                                        stateful: function (val) {
                                            return val === 2 ? {
                                                'val29': null
                                            } : null
                                        }
                                    },
                                    'checkbox_fourteen': {
                                        state: true,
                                        stateful: function (val) {
                                            return val === 2 ? {
                                                'val30': null
                                            } : null
                                        }
                                    },
                                    'checkbox_fiveteen': null
                                }
                                break;
                            case '2':
                                break;
                        }
                        return res;
                    }
                }
            } : null
        }
    },
    // 'drapdown_val28': {
    //   stateful: function (val) {
    //     let res = null;
    //     switch (val) {
    //       case '1':
    //         res = {
    //           'checkbox_threeteen': {
    //             state: true,
    //             stateful: function (val) {
    //               return val === 2 ? {
    //                 'val29': null
    //               } : null
    //             }
    //           },
    //           'checkbox_fourteen': {
    //             state: true,
    //             stateful: function (val) {
    //               return val === 2 ? {
    //                 'val30': null
    //               } : null
    //             }
    //           },
    //           'checkbox_fiveteen':null
    //         }
    //         break;
    //       case '2':
    //         break;
    //     }
    //     return res;
    //   }
    // },
    'val31': null,
    'checkbox_sixteen': {
        stateful: function (index) {
            return index === 1 ? {
                'val32': null
            } : null
        }
    },
    'checkbox_seventeen': {
        stateful: function (index) {
            return index === 1 ? {
                'checkbox_eightteen': null,
                'val101': null,
                'val33': null,
                'val34': null,
                'val35': null,
                'checkbox_nineteen': null,
            } : null
        }
    },
    'checkbox_twenty': {
        stateful: function (index) {
            return index === 1 ? {
                'checkbox_twenty-five': null,
                'val44': null,
                'checkbox_twenty-six': {
                    stateful: function (index) {
                        return index === 0 ? {
                            'val45': null,
                        } : index === 1 ? {
                            'val46': null,
                        } : index === 2 ? {
                            'val47': null,
                        } : null
                    }
                },
                'val48': null,
            } : null
        }
    },
    'val36': null,
    'checkbox_twenty-one': null,
    'val37': null,
    'val38': null,
    'val39': null,
    'checkbox_twenty-two': null,
    // 'val40': null,
    // 'val41': null,
    // 'checkbox_twenty-three': null,
    // 'val42': null,
    // 'val43': null,
    // 'checkbox_twenty-four': null,
    'checkbox_twenty-seven': {
        stateful: function (index) {
            return index === 1 ? {
                'val49': null,
                'val50': null,
                'checkbox_twenty-eight': null
            } : null
        }
    },
    'checkbox_twenty-nine': {
        stateful: function (index) {
            return index === 0 ? {
                'val51': null,
            } : null
        }
    },
    'checkbox_thirty': {
        stateful: function (index) {
            return index === 1 ? {
                'val52': null,
                'val53': null,
                'checkbox_thirty-two': null
            } : null
        }
    },
    'checkbox_thirty-three': null,
    'checkbox_thirty-four': null,
    'val54': null,
    'checkbox_thirty-five': {
        stateful: function (index) {
            return index === 0 ? {
                'val55': null,
            } : index === 1 ? {
                'val56': null,
                'val57': null,
            } : index === 2 ? {
                'val58': null,
            } : index === 3 ? {
                'val59': null,
                'val60': null,
            } : index === 4 ? {
                'val61': null,
            } : null
        }
    },
    'val62': null,
    'checkbox_thirty-six': null,
    'checkbox_thirty-seven': null,
    'checkbox_thirty-eight': null,
    'checkbox_thirty-nine': null,
    'drapdown_val63': {
        stateful: function (val) {
            let res = null;
            switch (val) {
                case '4':
                    res = {
                        'val300': null,
                    };
                    break;
            }
            return res;
        }
    },
    'drapdown_val64': {
        stateful: function (val) {
            let res = null;
            switch (val) {
                case '1':
                    res = {
                        'val65': null,
                    };
                    break;
                case '2':
                    res = {
                        'val66': null,
                    };
                    break;
                case '3':
                    res = {
                        'val67': null
                    };
                    break;
            }
            return res;
        }
    },
    // 'drapdown_val68': null,
    'checkbox_forty': null,
    'drapdown_val70': null,
    'checkbox_forty-two': {
        stateful: function (index) {
            return index === 0 ? {
                'val71': null,
            } : null
        }
    },
}

//???????????????????????????
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
    //?????????????????????
    Calendar.create({
        classN: 'calendar-item',
        callBack: function (bindElem, dateObj) {
            if (bindElem.tagName.toLowerCase() === 'input') {
                bindElem.value = `${dateObj.year}???${dateObj.month}???${dateObj.date}???`
                bindElem.setAttribute('value', bindElem.value)
                bindElem.setAttribute('random', dateObj.random)
            }
        }
    })
    //?????????????????????
    Dropdown.create({
        classN: 'dropdown-item',
        callBack: function (bindElem, dateObj) {
            if (bindElem.tagName.toLowerCase() === 'input') {
                bindElem.value = dateObj.value
                bindElem.setAttribute('value', bindElem.value)
                let attr = bindElem.getAttribute('inputmethod');
                if (attr === 'val25') {
                    contractConfig.prohibit(bindElem, ['1', '2', '3'], 'val25')
                    contractConfig.initForm(['checkbox_eight', 'val26', 'checkbox_nine', 'checkbox_ten', 'checkbox_eleven'], 0)
                }
                if (attr === 'val28') {
                    contractConfig.prohibit(bindElem, ['1', '2'], 'val28')
                    contractConfig.initForm(['checkbox_threeteen', 'val29', 'checkbox_fourteen', 'val30', 'checkbox_fiveteen'], 0)
                }
                if (attr === 'val64') {
                    contractConfig.prohibit(bindElem, ['1', '2', '3'], 'val64')
                    contractConfig.initForm(['val65', 'val66', 'val67'], 0)
                }
            } else {
                bindElem.innerHTML = dateObj.value
                bindElem.classList.remove('input-select')
                bindElem.classList.remove('input-before')
            }
        }
    })


    // ?????????????????????
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

    //??????????????????
    let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
    // let msg = {
    //     code: "S0001191107007",
    //     companyNames: ["????????????????????????"],
    //     guestCardType: "?????????",
    //     guestCardTypes: "11,22,33,44,55",
    //     guestID: "132",
    //     guestIDs: "ee2353-344???ii397-4839",
    //     guestName: "?????????",
    //     guestNames: "?????????1????????????1",
    //     guestTel: "13011111111",
    //     guestTels: "",
    //     id: 3354,
    //     isentrust: 1,
    //     ownerCardType: "????????????",
    //     ownerCardTypes: "2222,333,444,8888",
    //     ownerID: "123",
    //     ownerIDs: "ee2353-344???ii397-4839",
    //     ownerName: "??????",
    //     ownerNames: "?????????2????????????2",
    //     ownerTel: "18888888888",
    //     ownerTels: "",
    //     propertyAddr: "a???b???c",
    //     singleCompany: "?????????????????????",
    //     dealPrice: 1000,
    //     dealPriceUpper: '??????',
    //     square: 160,
    //     guestStoreRegisterCode: '213',
    //     signDate: 1592465819508,
    //     organizationCode: "8888888888"
    // }
    for (let readonlyItem in msg) {
        let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
        let readonlyArr = ['code', 'ownerTel', 'organizationCode', 'ownerCardType', 'guestCardType', 'ownerCardTypes', 'guestCardTypes', 'guestTel', 'ownerName', 'ownerID', 'ownerNames', 'ownerIDs', 'guestName', 'guestID', 'guestNames', 'guestIDs', 'propertyAddr', 'dealPrice', 'dealPriceUpper', 'companyNames', 'guestStoreRegisterCode', 'signDate']
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
                        let signDate = `${y}???${M}???${D}???`
                        element.innerHTML = signDate
                    } else {
                        element.innerHTML = msg[readonlyItem]
                    }
                    element.classList.remove('input-before')
                }
            })
        }
    }

    // ???????????????
    contractConfig.checkboxListener(function () { }, function (obj, index) {
        let attr = obj.currentTarget.getAttribute('name')
        let boxArray = document.getElementsByName(attr);
        if (attr === 'two') {
            let checkIO = {
                6: ['val13'],
            }
            boxArray.forEach((item, i) => {
                if (item === obj.currentTarget) {
                    if (item.querySelector('p').getAttribute('checked')) {
                        if (i === 6) {
                            contractConfig.initForm(checkIO[6], 0)
                        } else {
                            contractConfig.initForm(checkIO[6], 1)
                        }
                    } else {
                        contractConfig.initForm(checkIO[6], 1)
                    }
                }
            })
        }
        if (attr === 'three') {
            let checkIO = {
                3: ['val14'],
            }
            boxArray.forEach((item, i) => {
                if (item === obj.currentTarget) {
                    if (item.querySelector('p').getAttribute('checked')) {
                        if (i === 3) {
                            contractConfig.initForm(checkIO[3], 0)
                        } else {
                            contractConfig.initForm(checkIO[3], 1)
                        }
                    } else {
                        contractConfig.initForm(checkIO[3], 1)
                    }
                }
            })
        }
        if (attr === 'five') {
            let checkIO = {
                0: ['val15', 'val100', 'val16', 'val17'],
                1: ['val18', 'val19', 'val20', 'checkbox_six', 'val21'],
            }
            boxArray.forEach((item, i) => {
                if (item === obj.currentTarget) {
                    if (item.querySelector('p').getAttribute('checked')) {
                        contractConfig.initForm(checkIO[i], 0)
                        if (i === 0) {
                            contractConfig.initForm(checkIO[1], 1)
                        } else {
                            contractConfig.initForm(checkIO[0], 1)
                        }
                    } else {
                        contractConfig.initForm(checkIO[i], 1)
                    }
                }
            })
        }
        if (attr === 'seven') {
            let checkIO = {
                1: ['val22', 'val23', 'val24', 'val25', 'checkbox_eight', 'val26', 'checkbox_nine', 'checkbox_ten', 'checkbox_eleven'],
            }
            boxArray.forEach((item, i) => {
                if (item === obj.currentTarget) {
                    if (item.querySelector('p').getAttribute('checked')) {
                        if (i === 0) {
                            contractConfig.initForm(checkIO[1], 1)
                        } else {
                            contractConfig.initForm(checkIO[1], 0)
                        }
                    } else {
                        contractConfig.initForm(checkIO[1], 1)
                    }
                }
            })
        }
        if (attr === 'twelve') {
            let checkIO = {
                1: ['val27', 'val28', 'checkbox_threeteen', 'val29', 'checkbox_fourteen', 'checkbox_fiveteen'],
            }
            boxArray.forEach((item, i) => {
                if (item === obj.currentTarget) {
                    if (item.querySelector('p').getAttribute('checked')) {
                        if (i === 1) {
                            contractConfig.initForm(checkIO[1], 0)
                        } else {
                            contractConfig.initForm(checkIO[1], 1)
                        }
                    } else {
                        contractConfig.initForm(checkIO[1], 1)
                    }
                }
            })
        }
        if (attr === 'sixteen') {
            let checkIO = {
                1: ['val32'],
            }
            boxArray.forEach((item, i) => {
                if (item === obj.currentTarget) {
                    if (item.querySelector('p').getAttribute('checked')) {
                        if (i === 1) {
                            contractConfig.initForm(checkIO[1], 0)
                        } else {
                            contractConfig.initForm(checkIO[1], 1)
                        }
                    } else {
                        contractConfig.initForm(checkIO[1], 1)
                    }
                }
            })
        }
        if (attr === 'seventeen') {
            let checkIO = {
                1: ['checkbox_eightteen', 'val101', 'val33', 'val34', 'val35'],
            }
            boxArray.forEach((item, i) => {
                if (item === obj.currentTarget) {
                    if (item.querySelector('p').getAttribute('checked')) {
                        if (i === 1) {
                            contractConfig.initForm(checkIO[1], 0)
                        } else {
                            contractConfig.initForm(checkIO[1], 1)
                        }
                    } else {
                        contractConfig.initForm(checkIO[1], 1)
                    }
                }
            })
        }
        if (attr === 'twenty') {
            let checkIO = {
                1: ['checkbox_twenty-five', 'val44', 'checkbox_twenty-six', 'val45', 'val46', 'val47', "val48"],
            }
            boxArray.forEach((item, i) => {
                if (item === obj.currentTarget) {
                    if (item.querySelector('p').getAttribute('checked')) {
                        if (i === 1) {
                            contractConfig.initForm(checkIO[1], 0)
                        } else {
                            contractConfig.initForm(checkIO[1], 1)
                        }
                    } else {
                        contractConfig.initForm(checkIO[1], 1)
                    }
                }
            })
        }
        if (attr === 'twenty-six') {
            let checkIO = {
                0: ['val45'],
                1: ['val46'],
                2: ['val47'],
            }
            boxArray.forEach((item, i) => {
                if (item === obj.currentTarget) {
                    if (item.querySelector('p').getAttribute('checked')) {
                        contractConfig.initForm(checkIO[i], 0)
                        if (i === 0) {
                            contractConfig.initForm(checkIO[1].concat(checkIO[2]), 1)
                        } else if (i === 1) {
                            contractConfig.initForm(checkIO[0].concat(checkIO[2]), 1)
                        } else {
                            contractConfig.initForm(checkIO[0].concat(checkIO[1]), 1)
                        }
                    } else {
                        contractConfig.initForm(checkIO[i], 1)
                    }
                }
            })
        }
        if (attr === 'twenty-seven') {
            let checkIO = {
                1: ['val49', 'val50', 'checkbox_twenty-eight'],
            }
            boxArray.forEach((item, i) => {
                if (item === obj.currentTarget) {
                    if (item.querySelector('p').getAttribute('checked')) {
                        if (i === 1) {
                            contractConfig.initForm(checkIO[1], 0)
                        } else {
                            contractConfig.initForm(checkIO[1], 1)
                        }
                    } else {
                        contractConfig.initForm(checkIO[1], 1)
                    }
                }
            })
        }
        if (attr === 'twenty-nine') {
            let checkIO = {
                0: ['val51'],
            }
            boxArray.forEach((item, i) => {
                if (item === obj.currentTarget) {
                    if (item.querySelector('p').getAttribute('checked')) {
                        if (i === 0) {
                            contractConfig.initForm(checkIO[0], 0)
                        } else {
                            contractConfig.initForm(checkIO[0], 1)
                        }
                    } else {
                        contractConfig.initForm(checkIO[0], 1)
                    }
                }
            })
        }
        if (attr === 'thirty') {
            let checkIO = {
                1: ['val52', 'val53', 'checkbox_thirty-two'],
            }
            boxArray.forEach((item, i) => {
                if (item === obj.currentTarget) {
                    if (item.querySelector('p').getAttribute('checked')) {
                        if (i === 1) {
                            contractConfig.initForm(checkIO[1], 0)
                        } else {
                            contractConfig.initForm(checkIO[1], 1)
                        }
                    } else {
                        contractConfig.initForm(checkIO[1], 1)
                    }
                }
            })
        }
        if (attr === 'thirty-five') {
            let checkIO = {
                0: ['val55'],
                1: ['val56', 'val57'],
                2: ['val58'],
                3: ['val59', 'val60'],
                4: ['val61'],
            }
            boxArray.forEach((item, i) => {
                if (item === obj.currentTarget) {
                    if (item.querySelector('p').getAttribute('checked')) {
                        contractConfig.initForm(checkIO[i], 0)
                        if (i === 0) {
                            contractConfig.initForm(checkIO[1].concat(checkIO[2].concat(checkIO[3]).concat(checkIO[4])), 1)
                        } else if (i === 1) {
                            contractConfig.initForm(checkIO[0].concat(checkIO[2].concat(checkIO[3]).concat(checkIO[4])), 1)
                        } else if (i === 2) {
                            contractConfig.initForm(checkIO[0].concat(checkIO[1]).concat(checkIO[3].concat(checkIO[4])), 1)
                        } else if (i === 3) {
                            contractConfig.initForm(checkIO[0].concat(checkIO[1]).concat(checkIO[2]).concat(checkIO[4]), 1)
                        } else {
                            contractConfig.initForm(checkIO[0].concat(checkIO[1]).concat(checkIO[2]).concat(checkIO[3]), 1)
                        }
                    } else {
                        contractConfig.initForm(checkIO[i], 1)
                    }
                }
            })
        }
        if (attr === 'forty-two') {
            let checkIO = {
                0: ['val71'],
            }
            boxArray.forEach((item, i) => {
                if (item === obj.currentTarget) {
                    if (item.querySelector('p').getAttribute('checked')) {
                        if (i === 0) {
                            contractConfig.initForm(checkIO[0], 0)
                        } else {
                            contractConfig.initForm(checkIO[0], 1)
                        }
                    } else {
                        contractConfig.initForm(checkIO[0], 1)
                    }
                }
            })
        }
    })

    //???????????????
    contractConfig.inputListener(function (ev, tip) {
        let max = tip.target.getAttribute('max')
        let textArea = document.getElementById('inputArea')
        if (max) { //??????max???????????????????????????????????????????????????
            textArea.setAttribute('maxLength', parseInt(max))
        } else {
            textArea.removeAttribute('maxLength')
        }

        //??????listen??????????????????????????????????????????
        let spanAttr = tip.target.getAttribute('listen')
        if (spanAttr === 'number') {
            ev.target.value = ev.target.value.replace(/[^\d]/g, "")
            tip.target.innerHTML = ev.target.value
            let cn_str = tip.target.getAttribute('extendparam')
            if (Obj['cn_arr'].includes(cn_str)) {
                let index = toChineseNumber(ev.target.value).indexOf('???')
                document.querySelector(`*[extendparam=${cn_str}_add]`).innerHTML = toChineseNumber(ev.target.value).substring(0, index)
            }
        }
        if (tip.target.getAttribute('extendParam') === "val18") {
            document.querySelector(`*[extendparam=val19]`).innerHTML = "";
            document.querySelector(`*[extendparam=val19]`).classList.add('input-before')
        }
        if (tip.target.getAttribute('extendParam') === "val19") {
            document.querySelector(`*[extendparam=val18]`).innerHTML = "";
            document.querySelector(`*[extendparam=val18]`).classList.add('input-before')
        }
    }, function (tip) {
        //???????????????????????????
        let initVal = tip.target.innerHTML
        let strCn = tip.target.getAttribute('extendparam')
        if (Obj['cn_arr'].includes(strCn)) {
            if (initVal.length > 0) {
                let index = toChineseNumber(initVal).indexOf('???')
                document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal).substring(0, index)
            } else {
                document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
            }
        }
    })
}, 100)

