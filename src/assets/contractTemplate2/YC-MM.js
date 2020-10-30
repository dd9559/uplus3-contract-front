import {contractConfig} from "./base.js"

let Obj={
    check2:{
      val29:['val30','val31','val32','val33','val300'],
      val37:['val38','val39','val40']
    },
    check03:{
      val95:['val303'],
      val96:['val305']
    },
    setting:{
      val43:[],
      val44:['val45','val46','val47','val48','val49','val50']
    },
    part2:['val47','val48','val49','val50'],
    part5_1:['val71','val73','val74'],
    part5_2:['val79','val80','val81'],
    part7:['val94'],
    part8:['val125','val126','val127']
  }

  let Obj1={
    check0:{
      name:'prove'
    },
    check2:{
      name:'acquire',
      require:true
    },
    check10:{
      name:'nature'
    },
    check3:{
      name:'setting',
      require:true
    },
    check11:{
      name:'rentout'
    },
    val56:'',
    check4:{
      name:'furniture'
    },
    val66:'',
    val68:'',
    val70:'method2',
    val76:'',
    val78:'method3',
    val83:'',
    val307:'',
    val85:'',
    check12:{
      name:'yes'
    },
    check13:{
      name:'yes1'
    },

    val91:'',
    val92:'',
    check14:{
      name:"check03",
      require:true
    },
    check15:{
      name:"check04"
    },
    check16:{
      name:"check05"
    },
    check17:{
      name:"check06"
    },
    val103:'',
    val124:'method5',
    val128:'',
    check19:{
      name:'transfer'
    }
  }
  function getCheckState(ele){
    return	!!(ele.querySelector('p').getAttribute('checked'))
  }
  let errorArr2=[]
  function submit(e,obj=Obj1,clear=false) {
    sessionStorage.setItem('templateError1',JSON.stringify([]))
    if(clear){
      errorArr2=[]
    }
    for(let item in obj){
      let itemType=Object.prototype.toString.call(obj[item])
      let errorMsg = JSON.parse(sessionStorage.getItem('templateError1'))
      if(errorMsg.length>0){
        break
      }
      debugger
      if(itemType==='[object Object]'){
        let box=document.querySelectorAll(`div[name=${obj[item].name}]`)
        let arr=Array.from(box)
        let state = arr.every(function (tagItem) {
          return getCheckState(tagItem)===false    //简单复选框
        })
        if(state){
          errorArr2.push(obj[item].name)
          break
        }else {
          //勾选后判断
          debugger
          if(obj[item].require){
            let box=document.querySelectorAll(`div[name=${obj[item].name}]`)   //获取name 例如obj1  setting
            let detail={}
            switch (obj[item].name){   //对应obj中的name
              case 'acquire':
                if(getCheckState(box[0])){    //获取第一个选中状态 ，如果没有选中
                  detail={
                    val30:'',
                    val31:'',
                    check0:{
                      name:'property'
                    },
                    val33:'',
                    val300:'',
                    val36:''
                  }
                }else{
                  detail={
                    val38:'',
                    check:{
                      name:'trader'
                    }
                  }
                }
                break
              case 'check03':
                if(getCheckState(box[0])){
                  debugger
                  detail={
                    val303:'',
                  }
                }
                else if(etCheckState(box[2])){
                  detail={
                    val305:'',
                  }
                }
                break
              case 'setting':
              if(getCheckState(box[1])){
                detail={
                  val45:'',
                  val46:'method1'
                }
              }
              break

              case 'psecond':
                if(getCheckState(box[0])){
                  detail={
                    val74:''
                  }
                }else{
                  detail={
                    val78:''
                  }
                }
                break
            }
            debugger
            submit(e,detail,true)
          }
        }
      }else {
        let methodDetail={}
        let val
        let classList = Array.from(document.querySelector(`*[extendparam=${item}]`).classList)
        if(classList.includes('dropdown-item')||classList.includes('calendar-item')){
          if(item==='val56'){
            val=document.querySelector(`span[extendparam=${item}]`).innerHTML
          }else{
            val=document.querySelector(`input[extendparam=${item}]`).value
          }
        }else{
          val=document.querySelector(`span[extendparam=${item}]`).innerHTML
        }
        document.querySelector(`*[extendparam=${item}]`).classList.remove('BODERRED')
        if(obj[item]==='method1'){
          switch (val.toLowerCase()){
            case '1':
              methodDetail={
                val47:'',
                val48:''
              }
              break
            case '2':
              methodDetail={
                val49:'',
                val50:''
              }
              break
            default:
              errorArr2.push({
                type:'input',
                name:item
              })
          }
        }else if(obj[item]==='method2'){
          switch (val.toLowerCase()){
            case '1':
              methodDetail={
                val71:''
              }
              break
            case '2':
              methodDetail={
                val73:'',
                val74:''
              }
              break
            default:
              errorArr2.push({
                type:'input',
                name:item
              })
          }
        }else if(obj[item]==='method3'){
          switch (val.toLowerCase()){
            case '1':
              break
            case '2':
              methodDetail={
                check:{
                  name:'loanstype'
                },
                val82:''
              }
              break
            default:
              errorArr2.push({
                type:'input',
                name:item
              })
          }
        }else if(obj[item]==='method4'){
          switch (val.toLowerCase()){
            case '1':
              break
            case '2':
              methodDetail={
                val94:''
              }
              break
            default:
              errorArr2.push({
                type:'input',
                name:item
              })
          }
        }else if(obj[item]==='method5'){
          switch (val.toLowerCase()){
            case '1':
              methodDetail={
                val125:''
              }
              break
            case '2':
              methodDetail={
                val126:''
              }
              break
            case '3':
              methodDetail={
                val127:''
              }
              break
            default:
              errorArr2.push({
                type:'input',
                name:item
              })
          }
        }else {
          if(val.length===0){
            let _errorMsg={
              type:'input',
              name:item
            }
            document.querySelector(`*[extendparam=${item}]`).getAttribute('company')&&(_errorMsg.company=true)
            errorArr2.push(_errorMsg)
            break
          }
        }
        if(errorArr2.length===0){
          submit(e,methodDetail)
        }else{
          break
        }
      }
    }
    sessionStorage.setItem('templateError1',JSON.stringify(errorArr2))
    return errorArr2
  }
  //给按钮添加点击事件
  let mainBtn=document.querySelector('#submit');
  if(mainBtn){
    mainBtn.addEventListener('click',function(e){
      submit(e,Obj1,true)
    })
  }else{
    let btn=document.createElement('span')
    btn.id='submit'
    btn.style.display='none'
    btn.innerHTML='click'
    document.body.appendChild(btn)
    btn.addEventListener('click',function(e){
      submit(e,Obj1,true)
    })
  }

//初始化时间控件
Calendar.create({
  classN: 'calendar-item',
  callBack: function(bindElem, dateObj) {
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
    if(bindElem.tagName.toLowerCase()==='input'){
      bindElem.value=dateObj.value
      bindElem.setAttribute('value',bindElem.value)
      let attr = bindElem.getAttribute('inputmethod')
      if(attr){
        if(attr==='diya'){
            prohibit(bindElem,['1','2','3'],'diya')
        }
        if(attr==='delivery'){
            prohibit(bindElem,['1','2','3'],'delivery')
        }
        if(attr==='solve'){
            prohibit(bindElem,['1','2',],'solve')
        }
        if(attr==='loans1'){
            prohibit(bindElem,['1','2'],'loans1',0)
        }
        if(attr==='pay'){
            prohibit(bindElem,['1','2'],'pay')
        }
      }
    }else{
      bindElem.innerHTML = dateObj.value
      bindElem.classList.remove('input-select')
      bindElem.classList.remove('input-before')
    }
  }
})

function prohibit(val,arr,checkName,onlyTwo=1){
  cleanInput(Obj[checkName==='diya'?'part2':checkName==='delivery'?'part8':checkName==="solve"?'part7':checkName==='loans1'?'part5_2':'part5_1'],0)
  let aaa = Array.from(document.querySelectorAll(`*[name*=${checkName}]`))
  let tip=arr.findIndex(function(item){
    return item===val.value.toString()
  })
  aaa.forEach(function(item,index){
    item.classList.remove('modal');
    let classList = Array.from(item.classList)
    if(onlyTwo===1){
      if(index!==tip&&tip>-1){
        if(!classList.includes('info-checkbox')){
          item.classList.add('modal')
        }
      }
    }else if(tip===0){
      if(!classList.includes('info-checkbox')){
          item.classList.add('modal')
        }
    }
  })
}

function cleanInput(tagNameList,onlyRead=1){
  tagNameList.forEach(function(item){
  let dom = document.querySelector(`*[extendparam=${item}]`)
  if(onlyRead===1){
    dom.setAttribute("readonly","readonly");
    dom.setAttribute('disabled',"disabled")
    dom.setAttribute('systemParam',"true")
  }
  let domType;
  if(dom.getAttribute('type')){
   domType = dom.getAttribute('type')
  }
  let domType1 = dom.getAttribute('tag')
  if(domType==='text'||domType==='number'||domType1==='input-auto'){
    if(dom.tagName.toLocaleLowerCase()==='input'){
      dom.value=''
      dom.removeAttribute("value")
    }else{
      dom.innerHTML=''
      dom.classList.add('input-before')
    }
  }else{
    dom.querySelector('p').removeAttribute('checked')
  }
})
}

let inputbox = document.querySelectorAll("input[tag='input']")
for (let i = 0; i < inputbox.length; i++) {
  if(document.addEventListener){
    inputbox[i].addEventListener('change', function () {
      let addrReg=/\?|\？|\*|\"|\“|\”|\'|\‘|\’|\{|\}|\[|\]|\【|\】|\：|\:|\^|\$|\&|\!|\~|\`|\|/g
      let inputValue = this.value
      inputValue=inputValue.replace(/</g,"＜").replace(/>/g,"＞").replace(addrReg,'')
      this.setAttribute('value', inputValue)
      this.value = inputValue
      let attr = inputbox[i].getAttribute('inputmethod')
      if(attr){
        if(attr==='diya'){
            prohibit(inputbox[i],['a','b','c'],'diya')
        }
        if(attr==='delivery'){
            prohibit(inputbox[i],['a','b','c'],'delivery')
        }
        if(attr==='solve'){
            prohibit(inputbox[i],['a','b'],'solve')
        }
        if(attr==='loans1'){
            prohibit(inputbox[i],['a','b'],'loans1',0)
        }
        if(attr==='pay'){
            prohibit(inputbox[i],['a','b'],'pay')
        }
      }
    })

    inputbox[i].addEventListener('input', function () {
      let inputType = inputbox[i].getAttribute('inputmethod')
      if(inputType){
        if(inputType==="number"){
          this.setAttribute('value', this.value.replace(/[^0-9]/ig,""))
          this.value=this.value.replace(/[^0-9]/ig,"")
        }
        if(inputType==="priceone"){
          let numArr=["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"]
          if(!numArr.includes(this.value)){
            let num = this.value.replace(/[^0-9]/ig,"")
            if(num||num==='0'){
              num = parseInt(num)
              this.value=numArr[num]
              this.setAttribute('value', numArr[num])
            }else{
              this.value=''
              this.setAttribute('value', '')
            }
          }
        }
      }
    })
  }else {
    inputbox[i].attachEvent('onchange', function (e) {
        this.setAttribute('value', this.value.replace(/</g,'＜').replace(/>/g,'＞'))
    })
  }
}

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

let toChineseNumber = function (money) {
      //汉字的数字
      var cnNums = new Array(
          "零",
          "壹",
          "贰",
          "叁",
          "肆",
          "伍",
          "陆",
          "柒",
          "捌",
          "玖"
      );
      //基本单位
      var cnIntRadice = new Array("", "拾", "佰", "仟");
      //对应整数部分扩展单位
      var cnIntUnits = new Array("", "万", "亿", "兆");
      //对应小数部分单位
      var cnDecUnits = new Array("角", "分", "毫", "厘");
      //整数金额时后面跟的字符
      var cnInteger = "整";
      //整型完以后的单位
      var cnIntLast = "元";
      //最大处理的数字
      var maxNum = 9999999999999.99;
      //金额整数部分
      var integerNum;
      //金额小数部分
      var decimalNum;
      //输出的中文金额字符串
      var chineseStr = "";
      //分离金额后用的数组，预定义
      var parts;
      if (!money) {
          if(money==='0'){
              return cnNums[0];
          }else{
              return ''
          }
      }
      money = parseFloat(money);
      if (money >= maxNum) {
          //超出最大处理数字
          return "";
      }
      //转换为字符串
      money = money.toString();
      if (money.indexOf(".") == -1) {
          integerNum = money;
          decimalNum = "";
      } else {
          parts = money.split(".");
          integerNum = parts[0];
          decimalNum = parts[1].substr(0, 4);
      }
      //获取整型部分转换
      if (parseInt(integerNum, 10) > 0) {
          var zeroCount = 0;
          var IntLen = integerNum.length;
          for (var i = 0; i < IntLen; i++) {
              var n = integerNum.substr(i, 1);
              var p = IntLen - i - 1;
              var q = p / 4;
              var m = p % 4;
              if (n == "0") {
                  zeroCount++;
              } else {
                  if (zeroCount > 0) {
                      chineseStr += cnNums[0];
                  }
                  //归零
                  zeroCount = 0;
                  chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
              }
              if (m == 0 && zeroCount < 4) {
                  chineseStr += cnIntUnits[q];
              }
          }
          chineseStr += cnIntLast;
      }
      //小数部分
      if (decimalNum != "") {
          var decLen = decimalNum.length;
          for (var i = 0; i < decLen; i++) {
              var n = decimalNum.substr(i, 1);
              if (n != "0") {
                  chineseStr += cnNums[Number(n)] + cnDecUnits[i];
              }
          }
      }
      if (chineseStr == "") {
          chineseStr += cnNums[0] + cnIntLast + cnInteger;
      } else if (decimalNum == "") {
          chineseStr += cnInteger;
      }
      return chineseStr.split('元')[0];
  }

//基础数据赋值
// let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
let msg={

  "houseinfoCode":"S00117253",
  "ownerIDs":"",
  "isHaveData":0,
  "ownerTels":"",
  "custCommission":124123.0,
  "ownerCommission":1231231.0,
  "propertyAddr":"1市1区1",
  "singleCompany":"新房测试一组",
  "cityId":40,
  "dealPrice":123.0,
  "type":2,
  "signDate":1592187032000,
  "guestName":"vb",
  "companyNames":['33'],
  "otherCooperationCost":0.0,
  "guestStoreName":"",
  "guestTel":"18963258741",
  "id":4992,
  "guestCardType":"护照",
  "ownerCommissionUpper":"壹佰贰拾叁万壹仟贰佰叁拾壹",
  "companyBanks":[],
  "guestinfoCode":"G00004483",
  "subscriptionPriceUpper":"零",
  "guestCardTypes":"",
  "isRefer":0,
  "ownerID":"5123",
  "square":215.0,
  "moneyUnit":"元",
  "guestTels":"",
  "ownerCardTypes":"",
  "code":"S0040200615001",
  "ownerCardType":"护照",
  "guestStoreRegisterCode":"",
  "ownerTel":"16549848784",
  "dealPriceUpper":"壹佰贰拾叁",
  "guestNames":"",
  "ownerName":"fd",
  "guestIDs":"",
  "custEnsure":0.0,
  "timeUnit":"",
  "isRetained":0,
  "commissionPayment":0.0,
  "ownerNames":"",
  "isWuHanMM":1,
  "custCommissionUpper":"壹拾贰万肆仟壹佰贰拾叁",
  "propertyCard":"",
  "guestID":"6111111",
  "squareUse":0.0,
  "subscriptionPrice":0.0,
  "remarks":"",
}
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
      let companyName = document.querySelector(`*[extendParam="val56"]`)
      // let companyNameTxt = msg[readonlyItem].join(',')
      // companyName.setAttribute('list',companyNameTxt)
      companyName.innerHTML = msg[readonlyItem][0]
      if(companyName.innerHTML){
        companyName.removeAttribute('systemparam')
      }
    }
  }

  let readonlyArr = ['ownerName','ownerCardType','ownerID','ownerNames','ownerCardTypes','ownerIDs','guestName','guestCardType','guestID','guestNames','guestCardTypes','guestIDs','propertyAddr','dealPriceUpper','square']
  if(onlyReadDom.length>0){
    onlyReadDom.forEach((element,index) => {
      if(readonlyItem==='signDate'){
         element.setAttribute('value', arr[index])
      }else if(readonlyArr.includes(readonlyItem)){
        if(element.getAttribute("extendParam")==="val25"){
            let value = msg["propertyAddr"]
            if(value.substring(0,3)==="宜昌市"){
                element.innerHTML=value.replace("宜昌市",'')
            }else{
                element.innerHTML=value
            }
        }else{
            element.innerHTML=msg[readonlyItem]
        }
        element.classList.remove('input-before')
      }else{
        element.value=msg[readonlyItem]
        element.setAttribute('value', msg[readonlyItem])
      }
    })
  }
}

// 勾选框逻辑
contractConfig.checkboxListener(function(obj,index){
  let tagName = obj.currentTarget.getAttribute('checkmodel')
  if(tagName){
    var tagNameList=[]
    for(var i in Obj[tagName]) {
        tagNameList=tagNameList.concat(Obj[tagName][i])
    }
    cleanInput(tagNameList)
    let checkDom=Obj[tagName][obj.currentTarget.getAttribute('extendparam')]
    let bool = obj.currentTarget.querySelector('p').getAttribute('checked')
    let arr = []
    let removeArr = ['val30','val31','val32','val33','val305','val303','val300',
    'val38','val39','val40','val45','val46','val47','val48','val49','val50','val51','val52','val61','val62','val63','val64']
    if(checkDom&&checkDom.length>0){
      checkDom.forEach(function(item){
        let dom = document.querySelector(`*[extendparam=${item}]`)
        if(removeArr.includes(item)){
          dom.removeAttribute('readonly')
          dom.removeAttribute('disabled')
          dom.removeAttribute('systemParam')
        }
      })
      arr = tagNameList.concat(checkDom).filter(function(v,i,arr){
        return arr.indexOf(v) === arr.lastIndexOf(v)
      })
    }else{
      arr = tagNameList
    }
    let property = document.getElementsByName('property')
    if(obj.currentTarget.getAttribute('name')==='acquire'){
      if(index===0&&!(obj.currentTarget.querySelector('p').getAttribute('checked')==='true')){
        Array.from(property).forEach(item=>{
          item.querySelector('p').setAttribute('checked', true)
          item.setAttribute('readonly','readonly')
        })
      }
    }
    if(bool){
      arr.forEach(function(item){
        let dom = document.querySelector(`*[extendparam=${item}]`)
        dom.removeAttribute('readonly')
        dom.removeAttribute('disabled')
        dom.removeAttribute('systemParam')
      }) 
    }
  }
},function(){})

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
      let toChineseArr = ['val52','val66','val68','val71','val74','val76','val83','val85']
      let chineseStr = tip.target.getAttribute('extendparam')
      if(toChineseArr.includes(chineseStr)){
        document.querySelector(`*[extendparam=${chineseStr}_add]`).innerHTML = toChineseNumber(ev.target.value)
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
    let ArrCn = ['val52','val66','val68','val71','val74','val76','val83','val85']
    let strCn = tip.target.getAttribute('extendparam')
    if(ArrCn.includes(strCn)){
      if(initVal.length>0){
        document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal)
     }else{
        document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
     }
     }
  })