import {contractConfig,toChineseNumber} from "./base.js"
// let obj = {
//     val22:'',
//     val25:'',
//     val26:'',
//     val27:'',
//     check4:{
//       name:'zhizhao4',
//       require:true
//     },
//     val33:'',
//     check5:{
//       name:'zhizhao5',
//       require:true,
//       // other:['val40','val41']
//     },
//     val42:'',
//     check6:{
//       name:'zhizhao6'
//     },
//     check18:{
//       name:'facility',
//       require:true
//     },
//     val52:'',
//     val53:'',
//     val56:'',
//     // val59:'',
//     val60:'',
//     val61:'',
//     // val64:'',
//     val65:'',
//     val66:'',
//     // check7:{
//     //     name:'zhizhao7'
//     // },
//     val73:'',
//     check8:{
//       name:'zhizhao8'
//     },
//     val300:'',
//     // val79:'',
//     val80:'',
//     val82:'',
//     val83:'',
//     val84:'',
//     val92:'',
//     val93:'',
//     val94:'',
//     val301:'',
//     val400:'',
//     check9:{
//       name:'zhizhao9',
//       require:true
//     },
//     check10:{
//       name:'zhizhao10',
//       require:true
//     },
//     check11:{
//       name:'zhizhao11',
//       require:true
//     },
//     check12:{
//       name:'zhizhao12',
//       require:true
//     },
//     check15:{
//       name:'zhizhao15',
//       require:true
//     },
//     check16:{
//       name:'remote',
//       require:true
//     },
//     check17:{
//       name:'zhizhao16',
//       require:true
//     },
// // }
// let errorArr1=[]
//初始化时间控件
Calendar.create({
    classN: 'calendar-item',
    callBack: function(bindElem, dateObj) {
        // bindElem.innerHTML = dateObj.year + '-' + dateObj.month + '-' + dateObj.date;
        if(bindElem.tagName.toLowerCase()==='input'){
            bindElem.value=`${dateObj.year}年${dateObj.month}月${dateObj.date}日`
            bindElem.setAttribute('value',bindElem.value)
            bindElem.setAttribute('random',dateObj.random)
        }
    }
})
//初始化下拉控件
Dropdown.create({
    classN: 'dropdown-item',
    callBack: function(bindElem, dateObj) {
        // bindElem.innerHTML = dateObj.year + '-' + dateObj.month + '-' + dateObj.date;
        if(bindElem.tagName.toLowerCase()==='input'){
            bindElem.value=dateObj.value
            bindElem.setAttribute('value',bindElem.value)
        }
    }
})

//输入自适应
contractConfig.inputListener(function(ev,tip){
  let max=tip.target.getAttribute('max')
  let textArea=document.getElementById('inputArea')
  if(max){//监听max属性，判断文本框是有有输入长度限制
    textArea.setAttribute('maxLength',parseInt(max))
  }else {
    textArea.removeAttribute('maxLength')
  }
  //监听listen属性，判断是否有输入类型限制
  let spanAttr=tip.target.getAttribute('listen')
  if(spanAttr==='number'){
    ev.target.value=ev.target.value.replace(/[^\d]/g, "")
    let toChineseArr = ['val22','val25','val30','val73','val80']
    let chineseStr = tip.target.getAttribute('extendparam')
    if(toChineseArr.includes(chineseStr)){
        document.querySelector(`*[extendparam=${chineseStr}_add]`).innerHTML = toChineseNumber(ev.target.value).split('元')[0]
    }
  }
  if(spanAttr==='chinese'){
    ev.target.value=ev.target.value.replace(/[^\d]/g, "")
    if(ev.target.value.length>0){
    let str = toChineseNumber(ev.target.value)
    let value=str.split('元')[0]
    tip.target.innerHTML=value
    }else {
    tip.target.innerHTML=''
    tip.target.classList.add('input-before')
    }
  }else {
    tip.target.innerHTML=ev.target.value
  }
},function(tip){
  //获取输入框的默认值
  let initVal=tip.target.innerHTML
  let ArrCn = ['val22','val25','val30','val73','val80']
  let strCn = tip.target.getAttribute('extendparam')
  if(ArrCn.includes(strCn)){
    if(initVal.length>0){
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal)
   }else{
     debugger
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
   }
   }
})

// 勾选框逻辑
contractConfig.checkboxListener(function(){},function(obj,index){
  if(obj.currentTarget.getAttribute('name')==='zhizhao5'){
    document.querySelector(`span[extendparam="val40"]`).innerHTML=''
    document.querySelector(`span[extendparam="val41"]`).innerHTML=''
    document.querySelector(`span[extendparam="val40"]`).classList.add("input-before")
    document.querySelector(`span[extendparam="val41"]`).classList.add("input-before")
    let proveTypeDoms = document.getElementsByName("zhizhao5")
    if(proveTypeDoms[0].querySelector('p').getAttribute('checked')==='true'){
        document.querySelector(`span[extendparam="val41"]`).setAttribute('systemParam','true')
    }else{
        document.querySelector(`span[extendparam="val41"]`).removeAttribute('systemParam')
    }
  }
})

function getCheckState(ele) {
    return !!(ele.querySelector('p').getAttribute('checked'))
}
//给按钮添加点击事件
let mainBtn=document.querySelector('#submit');
if(mainBtn){
    mainBtn.addEventListener('click',submit)
}else{
    let btn=document.createElement('span')
    btn.id='submit'
    btn.style.display='none'
    btn.innerHTML='click'
    document.body.appendChild(btn)
    btn.addEventListener('click',submit)
}

/**
 * 校验配置对象
 * 勾选框key值必须使用'checkbox'开头，下划线后面跟勾选框的name属性值
 * 下拉框key值必须使用'drapdown'开头，下划线后面跟下拉框的inputmethod属性值
 * 时间选择控件key值必须使用'time'开头，下划线后面跟控件的extendparam属性值
 * 输入框key值使用相应的extendparam属性值
 * 重点：1.有子项校验时，value值为一个带有stateful属性的对象，否则取null;
 * 2.stateful为一个返回子项校验配置对象的方法;
 * 3.key值带有'info'表示stateful方法有自定义校验
 */
let sub = {
  'checkbox_prove': {
    clear: ['checkbox_acquire', 'val12', 'val15', 'checkbox_trader']
  },
  'checkbox_acquire':{
    stateful:function (index) {
      return index===0?{'val12':null}:{'val15':null,'checkbox_trader':null,}
    },
    clear: ['val12', 'val15','checkbox_trader'],
  },
  'checkbox_hasRunsh':{
    stateful:function (index) {//index勾选框对应选项
      return index===0?{'val19':null}:null
    },
    clear:['val19']
  },
  'checkbox_loans':null,
  'checkbox_pledge':null,
  'checkbox_transaction':null,
  'info_first': {
    stateful: function () {
      let inputVal=document.querySelector('*[extendparam=val30]').innerHTML;
      if(inputVal.length===0){
        return {'checkbox_nature':null};
      }else{
        return null;
      }
    }
  },
  'checkbox_setting':{
    stateful:function (index) {
      return index===0?null:{'drapdown_diya':null}
    }
  },
  'drapdown_diya': {
    stateful: function (val) {
      return val.toLowerCase() === 'a' ? {
        'checkbox_thirdparty': {
          stateful: function (index) {
            return index === 0 ? {'time_val35': null} : null
          }
        }
      } : {
        'checkbox_cash': {
          stateful: function (index) {
            return index === 0 ? {'time_val40': null} : {'val44': null}
          }
        },
        'val45':null
      }
    }
  },
  'val46':null,
  'checkbox_furniture':{
    stateful:function (index) {
      return index===0?{'val62':null}:null
    }
  },
  'checkbox_carport':{
    stateful:function (index) {
      return index===0?{'checkbox_right':null,'val67':null,'val68':null}:null
    }
  },
  'val70': null,
  'val71': null,
  'drapdown_pay': {
    stateful: function (val) {
      let res = null;
      switch (val.toLowerCase()) {
        case 'b':
          res = {
            'checkbox_psecond': {
              stateful: function (index) {
                return index === 0 ? {'time_val74': null} : {'val78': null}
              }
            }, 'val79': null, 'val80': null
          };
          break;
        case 'c':
          res = {'time_val81': null, 'val84': null};
          break;
        case 'd':
          res = {'time_val85': null, 'val88': null}
      }
      return res;
    }
  },
  'val93': null,
  'drapdown_loans1': {
    stateful: function (val) {
      return val.toLowerCase() === 'a' ? null : {
        'checkbox_loanstype': null, 'time_val98': null, 'drapdown_reject': {
          stateful: function (val) {
            return val.toLowerCase()==='a'?null:{'val100':null,'val101':null}
          }
        }
      }
    }
  }
}



//基础数据赋值
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
for(let readonlyItem in msg){
    let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
    let arr= []
    if(readonlyItem==='signDate'){
        let time = new Date(msg.signDate)
        arr.push(time.getFullYear())
        arr.push(time.getMonth()+1)
        arr.push(time.getDate())
    }
    if(readonlyItem==="companyNames"){
        if(msg[readonlyItem].length>0){
            let companyName = document.querySelector(`input[extendParam="val25"]`)
            let companyNameTxt = msg[readonlyItem].join(',')
            companyName.setAttribute('list',companyNameTxt)
        }
    }
    if(onlyReadDom.length>0){
        onlyReadDom.forEach((element,index) => {
            if(readonlyItem==='timeUnit'){
                element.querySelector('p').removeAttribute('checked')
                if(element.getAttribute('value')===msg[readonlyItem]){
                    element.querySelector('p').setAttribute('checked', 'true')
                }
            }else if(readonlyItem==='signDate'){
                element.value=msg[readonlyItem]
                element.setAttribute('value', arr[index])
            // }else if(readonlyItem==='propertyAddr'||readonlyItem==='guestTel'||readonlyItem==='square'||readonlyItem==='dealPrice'||readonlyItem==='dealPriceUpper'||readonlyItem==='ownerName'||readonlyItem==='guestName'){
            }else if(readonlyItem==='houseinfoCode'||readonlyItem==='guestinfoCode'||readonlyItem==='code'){
                element.value=msg[readonlyItem]
                element.setAttribute('value', msg[readonlyItem])
            }else{
                if(element.getAttribute("extendParam")==="val33"){
                    let value = msg["propertyAddr"]
                    if(value.substring(0,3)==="咸宁市"){
                        element.innerHTML=value.replace("咸宁市",'')
                    }else{
                        element.innerHTML=value
                    }
                }else{
                    element.innerHTML=msg[readonlyItem]
                }
                element.classList.remove('input-title')
                element.classList.remove('input-title2')
                element.classList.remove('input-before')
            }
        });
    }
}