import {contractConfig,toChineseNumber} from "./base.js"
//初始化下拉控件
Dropdown.create({
    classN: 'dropdown-item',
    callBack: function(bindElem, dateObj) {
        if(bindElem.tagName.toLowerCase()==='input'){
          // debugger
            bindElem.value=dateObj.value
            bindElem.setAttribute('value',bindElem.value)
        }else{
          bindElem.innerHTML = dateObj.value
          bindElem.classList.remove('input-select')
          bindElem.classList.remove('input-before')
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
    let toChineseArr = []
    let chineseStr = tip.target.getAttribute('extendparam')
    if(toChineseArr.includes(chineseStr)){
        document.querySelector(`*[extendparam=${chineseStr}_add]`).innerHTML = toChineseNumber(ev.target.value).split('元')[0]
    }
  }
    tip.target.innerHTML=ev.target.value
})

// 勾选框逻辑
contractConfig.checkboxListener()

//给按钮添加点击事件
  let mainBtn=document.querySelector('#submit');
  if(mainBtn){
    mainBtn.addEventListener('click',function(e){
      contractConfig.submit(e,sub)
    })
  }else{
    let btn=document.createElement('span')
    btn.id='submit'
    btn.style.display='none'
    btn.innerHTML='click'
    document.body.appendChild(btn)
    btn.addEventListener('click',function(e){
      contractConfig.submit(e,sub)
    })
  }

let sub = {
  'val5': null,
  'val6': null,
  'val7': null,
  'checkbox_zhizhao4': null,
  'checkbox_zhizhao5': null,
}
//基础数据赋值
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
// let msg={
// cityId: 2,
// code: "Z0002191023002",
// commissionPayment: 0,
// companyNames: ["周黑鸭", "正常测试"],
// custCommission: 600,
// custCommissionUpper: "陆佰",
// custEnsure: 0,
// dealPrice: 2400,
// dealPriceUpper: "贰仟肆佰",
// guestCardType: "护照",
// guestCardTypes: "护照",
// guestID: "111111222",
// guestIDs: "222222332",
// guestName: "熊桂兰",
// guestNames: "二傻子",
// guestTel: "18716810042",
// guestTels: "18611909690",
// guestinfoCode: "JGSD000020",
// houseinfoCode: "Z7E5CSXD000004",
// id: 3219,
// isHaveData: 0,
// isWuHanMM: 0,
// moneyUnit: "元",
// otherCooperationCost: 0,
// ownerCardType: "护照",
// ownerCardTypes: "护照",
// ownerCommission: 600,
// ownerCommissionUpper: "陆佰",
// ownerID: "222222222",
// ownerIDs: "111111111",
// ownerName: "测试数据",
// ownerNames: "跟恒",
// ownerTel: "18771790771",
// ownerTels: "18611909594",
// propertyAddr: "咸宁市大兴区288号88楼8层",
// propertyCard: "",
// remarks: "",
// signDate: 1571760000000,
// singleCompany: "",
// square: 100,
// squareUse: 22,
// subscriptionPrice: 0,
// subscriptionPriceUpper: "零",
// timeUnit: "月",
// type: 1,
// }
for(let readonlyItem in msg){
    let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
    let arr= []
    if(onlyReadDom.length>0){
        onlyReadDom.forEach((element,index) => {
           
                element.innerHTML=msg[readonlyItem]
                element.classList.remove('input-title')
                element.classList.remove('input-title2')
                element.classList.remove('input-before')
            })
        }
}