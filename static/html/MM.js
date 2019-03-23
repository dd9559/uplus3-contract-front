 var Obj={
    check1:{
      val11:['val12'],
      val14:['val15']
    },
    check2:{
      val18:['val19']
    },
    setting:{
          val31:[],
          val32:['val33','val34','val35','val38','val39','val40','val43','val44','val45']
      },
      part3:['val34','val35','val38','val39','val40','val43','val44','val45'],
      thirdparty:{
          val34:['val35'],
          val38:[]
      },
      cash:{
          val39:['val40','val45'],
          val43:['val44','val45']
      },
      pass:{
          val44:['val45','val46','val47'],
          val48:['val49']
      },
      furniture:{
          val61:['val62'],
          val63:[]
      },
      carport:{
          val64:['val65','val66','val67','val68'],
          val69:[]
      },
      part6_2:['val73','val74','val77','val78','val79','val80','val81','val84','val85','val88','val89','val90','val91','val92'],
      part6_3:['val95','val96','val97','val98','val99','val100','val101'],
      part6_4:['val100','val101'],
      part9:['val125','val126','val127'],
      psecond:{
          val73:['val74'],
          val77:['val78']
      },
      check02:{
          val106:['val107'],
          val108:['val109']
      }
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
                    if(attr==='diya'){
                        prohibit(bindElem,['a','b'],'diya')
                    }
                    if(attr==='delivery'){
                        prohibit(bindElem,['a','b','c'],'delivery')
                    }
                    if(attr==='reject'){
                        prohibit(bindElem,['a','b','c'],'reject')
                    }
                    if(attr==='loans1'){
                        prohibit(bindElem,['a','b'],'loans1',0)
                    }
                    if(attr==='pay'){
                        prohibit(bindElem,['a','b','c','d'],'pay')
                    }
                }
            }
        }
    })
  function cleanInput(tagNameList,onlyRead=1){
    tagNameList.forEach(function(item){
    let dom = document.querySelector(`*[extendparam=${item}]`)
    if(onlyRead===1){
      dom.setAttribute("readonly","readonly");
      dom.setAttribute('disabled',"disabled")
    }
    let domType = dom.getAttribute('type')
    if(domType==='text'||domType==='number'){
      dom.value=''
      dom.removeAttribute("value")
    }else{
      dom.querySelector('p').removeAttribute('checked')
    }
  })
  }

  let inputbox = document.querySelectorAll("input[tag='input']")
  for (let i = 0; i < inputbox.length; i++) {
      if(document.addEventListener){
          inputbox[i].addEventListener('change', function () {
              let addrReg=/\?|\？|\*|\"|\“|\”|\'|\‘|\’|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g
              let inputValue = this.value
              inputValue=inputValue.replace(/</g,"＜").replace(/>/g,"＞").replace(addrReg,'')
              this.setAttribute('value', inputValue)
              this.value = inputValue
              let attr = inputbox[i].getAttribute('inputmethod')
              if(attr){
                  if(attr==='diya'){
                      prohibit(inputbox[i],['a','b'],'diya')
                  }
                  if(attr==='delivery'){
                      prohibit(inputbox[i],['a','b','c'],'delivery')
                  }
                  if(attr==='reject'){
                      prohibit(inputbox[i],['a','b','c'],'reject')
                  }
                  if(attr==='loans1'){
                      prohibit(inputbox[i],['a','b'],'loans1',0)
                  }
                  if(attr==='pay'){
                      prohibit(inputbox[i],['a','b','c','d'],'pay')
                  }
                  if(attr==="totalprice"){
                    this.value=toChineseNumber(this.value)
                    this.setAttribute('value', this.value)
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

  let checkboxs= document.querySelectorAll(".info-checkbox")
  for(let i=0;i<checkboxs.length;i++){
      checkboxs[i].addEventListener('click',function (obj) {
          let able = obj.currentTarget.getAttribute('readonly')
          if(!able){
              let tagName = obj.currentTarget.getAttribute('checkmodel')
              if(tagName){
                  var tagNameList=[]
                  for(var i in Obj[tagName]) {
                      tagNameList=tagNameList.concat(Obj[tagName][i])
                  }
                  cleanInput(tagNameList)
                  let checkDom=Obj[tagName][obj.currentTarget.getAttribute('extendparam')]
                  if(checkDom&&checkDom.length>0){
                      checkDom.forEach(function(item){
                        let dom = document.querySelector(`*[extendparam=${item}]`)
                        if(!['val33','val35','val40','val74'].includes(item)){
                          let classList = Array.from(dom.classList)
                          dom.removeAttribute('readonly')
                          dom.removeAttribute('disabled')
                        }else{
                          dom.removeAttribute('disabled')
                        }
                      })
                  }
              }

              var boxArray = document.getElementsByName(obj.currentTarget.getAttribute('name'));
              for (let i = 0; i <= boxArray.length - 1; i++) {
                  if(boxArray[i] == obj.currentTarget){
                      if(boxArray[i].querySelector('p').getAttribute('checked')==='true'){
                          boxArray[i].querySelector('p').removeAttribute('checked')
                      }else {
                          boxArray[i].querySelector('p').setAttribute('checked', true)
                      }
                  }else {
                      if(!obj.currentTarget.getAttribute('more')){
                          boxArray[i].querySelector('p').removeAttribute('checked')
                      }
                  }
              }
          }
      })
  }

  // 输入框右侧吸边
  let contentWidth = document.querySelector('.container').clientWidth
  let textarea = document.querySelectorAll('.text-long')
  for(let i=0;i<textarea.length;i++){
      let textareaLeft = textarea[i].offsetLeft - parseInt((document.body.offsetWidth - contentWidth) / 2)
      textarea[i].style.width = contentWidth - 40 - textareaLeft+'px'
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

  //基础数据赋值
  let msg = JSON.parse(window.localStorage.getItem("contractMsg"));
  let owner_ = document.querySelector(`*[systemparam='ownerNames']`)
  let guest_ = document.querySelector(`*[systemparam='guestNames']`)
  owner_.value=''
  guest_.value=''
  owner_.removeAttribute("value")
  guest_.removeAttribute("value")
  for(let readonlyItem in msg){
    let onlyReadDom = Array.from(document.querySelectorAll(`input[systemparam=${readonlyItem}]`));
    let arr= []
    if(readonlyItem==='signDate'){
      let time = new Date(msg.signDate)
      arr.push(time.getFullYear())
      arr.push(time.getMonth()+1)
      arr.push(time.getDate())
    }
    if(readonlyItem==="companyNames"){
      if(msg[readonlyItem].length>0){
        let companyName = document.querySelector(`input[extendParam="val46"]`)
        let companyNameTxt = msg[readonlyItem].join(',')
        companyName.setAttribute('list',companyNameTxt)
      }
    }
    if(onlyReadDom.length>0){
      onlyReadDom.forEach((element,index) => {
        if(readonlyItem==='signDate'){
          element.setAttribute('value', arr[index])
        }else if(readonlyItem==='propertyAddr'){
            let addr1 = document.querySelector(`*[systemparam='propertyAddr']`);
            let addr2 = document.querySelector('input[extendParam="val777"]')
            addr1.value=''
            addr2.value=''
            addr1.setAttribute('value','')
            addr2.setAttribute('value','')
            if(msg["propertyAddr"].length>=25){
                let propertyAddr1=msg["propertyAddr"].substring(0,25);
                let propertyAddr2=msg["propertyAddr"].substring(25);
                addr1.setAttribute('value',propertyAddr1)
                addr2.setAttribute('value',propertyAddr2)
                addr1.value=propertyAddr1
                addr2.value=propertyAddr2
              }else{
                element.setAttribute('value', msg[readonlyItem])
                element.value=msg[readonlyItem]
              }
        }else{
          element.value=msg[readonlyItem]
          element.setAttribute('value', msg[readonlyItem])
        }
      });
    }
  }

  function prohibit(val,arr,checkName,onlyTwo=1){
    cleanInput(Obj[checkName==='loans1'?'part6_3':checkName==='delivery'?'part9':checkName==="diya"?'part3':checkName==='pay'?'part6_2':'part6_4'],0)
    let aaa = Array.from(document.querySelectorAll(`*[name*=${checkName}]`))
    let tip=arr.findIndex(function(item){
      return item===val.value.toLowerCase()
    })
    aaa.forEach(function(item,index){
      item.classList.remove('model');
      let classList = Array.from(item.classList)
      if(onlyTwo===1){
        if(index!==tip&&tip>-1){
          if(!classList.includes('info-checkbox')){
            item.classList.add('model')
          }
        }
      }else if(tip===0){
        if(!classList.includes('info-checkbox')){
            item.classList.add('model')
          }
      }
    })

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
            chineseStr = cnNums[0] + cnIntLast + cnInteger;
            return chineseStr;
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