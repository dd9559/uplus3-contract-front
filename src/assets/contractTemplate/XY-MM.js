
import {contractConfig} from "./base.js"
let Obj = {
  check1:{
    val20:['val21']
  },
  pay:{
    val35:['val36','val37'],
    val38:['val39']
  },
  pay_arr:['val35','val36','val37','val38','val39','val40','val41','val42','val43','val44','val45'],
  loan:{
    val43:['val44']
  },
  receive:{
    val47:['val48']
  },
  eight_paid:{
    val51:['val52'],
    val53:['val54','val55','val56','val57'],
    val58:['val59','val60']
  }
}
let Obj1 = {
  val3:'',
  val6:'',
  val9:'',
  val10:'',
  val11:'',
  val12:'',
  val14:'',
  val15:'',
  val16:'',
  val17:'',
  val18:'',
  check1:{
    name:'check1',
    require:true
  },
  val22:'',
  val23:'',
  check2:{
    name:'part2'
  },
  val27:'',
  val28:'',
  val31:'',
  val32:'',
  val33:'',
  val34:'method1',
  check3:{
    name:'receive',
    require:true
  },
  val49:'',
  val50:'',
  check8:{
    name:'eight_paid',
    require:true
  },
  val61:'',
  val62:'',
  check10_1:{
    name:'part10_1'
  },
  check10_2:{
    name:'part10_2'
  },
  val68:'',
  val69:'',
  check10_3:{
    name:'part10_3'
  },
  val74:'',
  val75:''
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

function getCheckState(ele){
  return !!(ele.querySelector('p').getAttribute('checked'))
}
let errorArr2=[]
// 非空校验
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
    if(itemType==='[object Object]'){
      let box=document.querySelectorAll(`div[name=${obj[item].name}]`)
      let arr=Array.from(box)
      let state = arr.every(function (tagItem) {
          return getCheckState(tagItem)===false
      })
      if(state){
          errorArr2.push(obj[item].name)
          break
      }else {
        //勾选后判断
        if(obj[item].require){
          let box=document.querySelectorAll(`div[name=${obj[item].name}]`)
          let detail={}
          switch (obj[item].name){
            case 'check1':
              if(getCheckState(box[1])){
                detail={
                  val21:''
                }
              }
              break
            case 'pay':
              if(getCheckState(box[0])){
                detail={
                  val36:'',
                  val37:''
                }
              }else{
                detail={
                  val39:''  
                }
              }
              break
            case 'loan':
              if(getCheckState(box[1])){
                detail={
                  val44:''
                }
              }
              break
            case 'receive':
              if(getCheckState(box[1])){
                detail={
                  val48:''
                }
              }
              break
            case 'eight_paid':
              if(getCheckState(box[0])){
                detail={
                  val52:''
                }
              }else if(getCheckState(box[1])){
                detail={
                  val54:'',
                  val55:'',
                  check:{
                    name:'part8'
                  }
                }
              }else if(getCheckState(box[2])){
                detail={
                  val59:'',
                  val60:''
                }
              }
              break
          }
          submit(e,detail,true)
        }
      }
    }else {
      let methodDetail={}
      let val
      let classList = Array.from(document.querySelector(`*[extendparam=${item}]`).classList)
      if(classList.includes('dropdown-item')||classList.includes('calendar-item')){
        val=document.querySelector(`input[extendparam=${item}]`).value
      }else{
        val=document.querySelector(`span[extendparam=${item}]`).innerHTML
      }
      document.querySelector(`*[extendparam=${item}]`).classList.remove('BODERRED')
      if(obj[item]==='method1'){
        switch (val.toLowerCase()){
          case 'a':
            methodDetail={
              check:{
                name:'pay',
                require:true
              }
            }
            break
          case 'b':
            methodDetail={
              val40:'',
              val41:'',  
              check:{
                name:'loan',
                require:true
              },
              val45:''
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
          errorArr2.push({
            type:'input',
            name:item
          })
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
      let attr = bindElem.getAttribute('inputmethod')
      if(attr){
        if(attr==='payment'){
            prohibit(bindElem,['a','b'],'payment')
        }
      }
    }
  }
})

function prohibit(val,arr,checkName){
  cleanInput(Obj.pay_arr,0)
  let tip=arr.findIndex(function(item){
    return item===val.value.toLowerCase()
  })
  let aaa = Array.from(document.querySelectorAll(`*[name*=${checkName}]`))
  aaa.forEach(function(item,index){
    item.classList.remove('modal');
    let classList = Array.from(item.classList)
    if(index!==tip&&tip>-1){
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
    let domType = dom.getAttribute('type')
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
    if(checkDom&&checkDom.length>0){
      checkDom.forEach(function(item){
        let dom = document.querySelector(`*[extendparam=${item}]`)
        if(['val21','val36','val37','val39','val44','val48','val52','val54','val55','val56','val57','val59','val60'].includes(item)){
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
})

let inputbox = document.querySelectorAll("input[tag='input']")
for (let i = 0; i < inputbox.length; i++) {
  if(document.addEventListener){
    inputbox[i].addEventListener('change', function () {
      let addrReg=/\?|\？|\*|\"|\“|\”|\'|\‘|\’|\{|\}|\[|\]|\【|\】|\：|\:|\^|\$|\&|\!|\~|\`|\|/g
      let inputValue = this.value
      inputValue=inputValue.replace(/</g,"＜").replace(/>/g,"＞").replace(addrReg,'')
      this.setAttribute('value', inputValue)
      this.value = inputValue
    })
  }else {
    inputbox[i].attachEvent('onchange', function (e) {
      this.setAttribute('value', this.value.replace(/</g,"＜").replace(/>/g,"＞"))
    })
  }
}

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
let msg = {
  code:'S0001190522002',
  ownerName:'张三',
  ownerID:'421101199801011776',
  agentName:'李四',
  agentId:'421101199801011000',
  guestName:'王五',
  guestId:'421101199801012222',
  companyNames:['中北门店加盟一'],
  propertyAddr:'襄阳市水晶之城(别墅) 水晶之城A栋1单元03B',
  dealPrice:'100000',
  storeName:'中北门店加盟一',
  houseinfoCode:'S6ECXZED000487',
  guestinfoCode:'GGS000016'
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
      let companyName = document.querySelector(`input[extendParam="val11"]`)
      let companyNameTxt = msg[readonlyItem].join(',')
      companyName.setAttribute('list',companyNameTxt)
    }
  }
  let readonlyArr = ['ownerName','ownerID','agentName','agentId','guestName','guestId','propertyAddr','dealPrice','storeName','houseinfoCode','guestinfoCode']
  if(onlyReadDom.length>0){
    onlyReadDom.forEach((element,index) => {
      if(readonlyItem==='signDate'){
        element.setAttribute('value', arr[index])
      }else if(readonlyArr.includes(readonlyItem)){
        if(element.getAttribute("extendParam")==="val13"){
          let value = msg["propertyAddr"]
          if(value.substring(0,3)==="襄阳市"){
            element.innerHTML=value.replace("襄阳市",'')
          }else{
            element.innerHTML=value
          }
        }else{
          element.innerHTML=msg[readonlyItem]
          if(readonlyItem==="dealPrice"){
            let str = toChineseNumber(element.innerHTML)
            document.querySelector(`span[extendParam="val29"]`).innerHTML=str
          }
        }
        element.classList.remove('input-before')
      }else{
        element.value=msg[readonlyItem]
        element.setAttribute('value', msg[readonlyItem])
      }
    })
  }
}

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