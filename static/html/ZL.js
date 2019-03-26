    let Obj = {
        val22:'',
        val25:'',
        val26:'',
        val27:'',
        check4:{
            name:'zhizhao4',
            require:true
        },
        val33:'',
        val34:'',
        check5:{
            name:'zhizhao5',
            require:true
        },
        val42:'',
        check6:{
            name:'zhizhao6'
        },
        check18:{
            name:'facility',
            require:true
        },
        val52:'',
        val53:'',
        val56:'',
        val59:'',
        val60:'',
        val61:'',
        val64:'',
        val65:'',
        val66:'',
        // check7:{
        //     name:'zhizhao7'
        // },
        val73:'',
        check8:{
            name:'zhizhao8'
        },
        val79:'',
        val80:'',
        val82:'',
        val83:'',
        val84:'',
        val86:'',
        val88:'',
        val92:'',
        val93:'',
        val94:'',
        check9:{
            name:'zhizhao9',
            require:true
        },
        check10:{
            name:'zhizhao10',
            require:true
        },
        check11:{
            name:'zhizhao11',
            require:true
        },
        check12:{
            name:'zhizhao12',
            require:true
        },
        check15:{
            name:'zhizhao15',
            require:true
        },
        check16:{
            name:'remote',
            require:true
        },
        check17:{
            name:'zhizhao16',
            require:true
        },
    }
    let errorArr=[]
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
    function getCheckState(ele) {
        return !!(ele.querySelector('p').getAttribute('checked'))
    }
     function submit(obj=Obj) {
        for(let item in obj){
            let itemType=Object.prototype.toString.call(obj[item])
            if(itemType==='[object Object]'){
                let state=false
                if(obj[item].name==="textarea"){
                    state=true
                }else{
                   let box=document.querySelectorAll(`div[name=${obj[item].name}]`)
                   let arr=Array.from(box)
                   let list=['facility','zhizhao9','zhizhao10','zhizhao11','zhizhao12','zhizhao15','zhizhao16','remote']
                   if(!list.includes(obj[item].name)){
                        state = arr.every(function (item) {
                            return !!(item.querySelector('p').getAttribute('checked'))===false
                        })
                   }
                }
                if(state){
                    if(obj[item].other){
                        let otherState = obj[item].other.every(function (tip) {
                            return document.querySelector(`input[extendparam=${tip}]`).value.length===0
                        })
                        if(otherState){
                            errorArr.push({
                                name:obj[item].name
                            })
                            break
                        }
                    }else {
                        errorArr.push({
                            name:obj[item].name
                        })
                        break
                    }
                }else{
                    //勾选后判断
                  if(obj[item].require){
                      let box=document.querySelectorAll(`div[name=${obj[item].name}]`)
                      let detail={}
                      switch (obj[item].name){
                          case 'zhizhao9':
                            if(getCheckState(box[box.length-1])){
                                detail={
                                    val114:''
                                }
                            }
                              break
                          case 'zhizhao10':
                          if(getCheckState(box[box.length-1])){
                                detail={
                                    val119:''
                                }
                            }
                            break
                        case 'facility':
                          if(getCheckState(box[box.length-1])){
                                detail={
                                    val51:''
                                }
                            }
                            break
                        case 'zhizhao11':
                          if(getCheckState(box[box.length-1])){
                                detail={
                                    val125:''
                                }
                            }
                            break
                        case 'zhizhao12':
                          if(getCheckState(box[box.length-1])){
                                detail={
                                    val130:''
                                }
                            }
                            break
                        case 'zhizhao15':
                          if(getCheckState(box[box.length-1])){
                                detail={
                                    val139:''
                                }
                            }
                            break
                        case 'zhizhao16':
                          if(getCheckState(box[0])){
                                detail={
                                    val148:''
                                }
                            }
                            break
                        case 'remote':
                          if(getCheckState(box[0])){
                                detail.val141=''
                            }
                            if(getCheckState(box[1])){
                                detail.val143=''
                            }
                            if(getCheckState(box[2])){
                                detail.val145=''
                            }
                            break
                        case 'zhizhao4':
                        if(getCheckState(box[box.length-1])){
                                detail={
                                    val32:''
                                }
                            }
                            break
                          case 'zhizhao5':
                              if(getCheckState(box[0])){
                                  detail={
                                      val40:''
                                  }
                              }
                              if(getCheckState(box[2])){
                                  detail={
                                      val41:''
                                  }
                              }
                              break
                      }
                      submit(detail)
                  }
                }
            }else {
                obj[item]=document.querySelector(`input[extendparam=${item}]`).value
                if(obj[item].length===0){
                    errorArr.push({
                        type:'input',
                        name:item
                    })
                    break
                }
            }
        }
        console.log(errorArr)
    }
     
    let inputAutoBoxs = document.querySelectorAll("span[tag='input-auto']")
    for(let i=0;i<inputAutoBoxs.length;i++){
        if(inputAutoBoxs[i].getAttribute('systemParam')){
            continue
        }
        inputAutoBoxs[i].onclick=function (tip) {
            //获取span标签的基本配置属性
            let initVal=tip.target.innerHTML
            let type=tip.target.getAttribute('listen')
            let max=tip.target.getAttribute('max')
            let brother = tip.target.getAttribute('brother')

            let inputArea=document.querySelector('.model')
            inputArea.style.display='block'
            //获取文本框，并赋初值
            let textArea=document.getElementById('inputArea')
            textArea.value=initVal
            textArea.focus()
            if(max){//监听max属性，判断文本框是有有输入长度限制
                textArea.setAttribute('maxLength',parseInt(max))
            }else {
                textArea.removeAttribute('maxLength')
            }
            let tips= document.querySelectorAll(`span[brother="${brother}"]`)
            // alert(tips)
            textArea.oninput=function (ev) {
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
                    //限制特殊字符的输入
                    let addrReg=/\?|\？|\*|\"|\“|\”|\'|\‘|\’|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g;
                    ev.target.value=ev.target.value.replace(/</g,"＜").replace(/>/g,"＞").replace(addrReg,'')
                    tip.target.innerHTML=ev.target.value
                }
                //监听brother属性,判断是否有关联元素
                if(brother){
                    tips[1].innerHTML=toChineseNumber(ev.target.value)
                }
                tip.target.classList.remove('input-before')
                tip.target.classList.remove('input-title2')
                tip.target.classList.remove('input-title')
                if(ev.target.value.length===0){
                    tip.target.classList.add('input-before')
                }
            }
            document.querySelector('.control-btn').onclick=function (e) {
                let btn=e.target.innerHTML
                if(btn==='取消'){
                    if(initVal.length>0){
                        tip.target.innerHTML=initVal
                        tips[1].innerHTML=toChineseNumber(initVal)
                        tip.target.classList.remove('input-before')
                    }else {
                        tip.target.innerHTML=''
                        tip.target.classList.add('input-before')
                        if(brother){
                            tips[1].innerHTML=''
                        }   
                    }
                }else if(btn==='保存'){

                }
                inputArea.style.display='none'
                textArea.value=''
            }
        }
    }

    let inputbox = document.querySelectorAll("input[tag='input']")
    for (let i = 0; i < inputbox.length; i++) {
        // debugger
        if(document.addEventListener){
            inputbox[i].addEventListener('input', function () {
                let param = this.getAttribute('extendparam')
                if(param==='val73'){
                    let numPanel=document.querySelector("input[extendparam='val74']")
                    numPanel.value=toChineseNumber(this.value)
                    numPanel.setAttribute('value',toChineseNumber(this.value))
                }
                if(param==='val80'){
                    let numPanel=document.querySelector("input[extendparam='val81']")
                    numPanel.value=toChineseNumber(this.value)
                    numPanel.setAttribute('value',toChineseNumber(this.value))
                }
                if(param==='val86'){
                    let numPanel=document.querySelector("input[extendparam='val87']")
                    numPanel.value=toChineseNumber(this.value)
                    numPanel.setAttribute('value',toChineseNumber(this.value))
                }
                if(param==='val88'){
                    let numPanel=document.querySelector("input[extendparam='val89']")
                    numPanel.value=toChineseNumber(this.value)
                    numPanel.setAttribute('value',toChineseNumber(this.value))
                }
                let addrReg=/\?|\？|\*|\"|\“|\”|\'|\‘|\’|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g
                let inputValue = this.value
                inputValue=inputValue.replace(/</g,"＜").replace(/>/g,"＞").replace(addrReg,'')
                this.setAttribute('value', inputValue)
                this.value = inputValue
            })
        }else {
            inputbox[i].attachEvent('onpropertychange', function (e) {
                this.setAttribute('value', this.value.replace(/</g,"＜").replace(/>/g,"＞"))
            })
        }
    }

    let numInput = document.querySelectorAll("input[listen='number']")
    for (let i = 0; i < numInput.length; i++) {
        // debugger
        if(document.addEventListener){
            numInput[i].addEventListener('input', function () {
                this.value=this.value.replace(/[^\d]/g, "")
                this.setAttribute('value', this.value)
            })
        }else {
            numInput[i].attachEvent('onpropertychange', function (e) {
                this.value=this.value.replace(/[^\d]/g, "")
                this.setAttribute('value', this.value)
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

    let checkboxs= document.querySelectorAll(".info-checkbox")
    for(let i=0;i<checkboxs.length;i++){
        var isDisbaled = checkboxs[i].getAttribute('disabled')
        if(!isDisbaled){
            checkboxs[i].addEventListener('click',function (obj) {
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
            })
        } 
    }

    function dateFormatter(val){
        let date = new Date(val)
        let y = date.getFullYear()
        let m = date.getMonth()+1
        let d = date.getDay()
        return `${y}年${m}月${d}日`
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
//     let msg = {
//         code:"D0001190322005",
//         commissionPayment:1000,
//         companyNames:["测试小队一"],
// custCommission:1000,
// custCommissionUpper:"壹仟",
// custEnsure:1000,
// dealPrice:100000,
// dealPriceUpper:"壹拾万",
// guestID:"420102199003070899",
// guestIDs:"",
// guestName:"刘亦菲",
// guestNames:"",
// guestTel:"12215454777",
// guestTels:"",
// guestinfoCode:"CSXD000058",
// houseinfoCode:"S2A9QAZX000009",
// id:1512,
// isHaveData:0,
// isWuHanMM:0,
// moneyUnit:"元",
// otherCooperationCost:0,
// ownerCommission:1000,
// ownerCommissionUpper:"壹仟",
// ownerID:"420102199003070897",
// ownerIDs:"",
// ownerName:"我",
// ownerNames:"",
// ownerTel:"13211111111",
// ownerTels:"",
// propertyAddr:"万科生态花山万科小区小茹大道888号纯净水岸.花山一期（A-11，A-20，A-10，A-12，A-55）F60栋8单元88层855",
// propertyCard:"",
// remarks:"",
// signDate:1553184000000,
// square:10,
// squareUse:0,
// subscriptionPrice:0,
// subscriptionPriceUpper:"零",
// transFlowCode:22,
// type:3,
//     }
    for(let readonlyItem in msg){
        let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
        let arr= []
        if(readonlyItem==='signDate'){
            let time = new Date(msg.signDate)
            arr.push(time.getFullYear())
            arr.push(time.getMonth()+1)
            arr.push(time.getDate())
        }
        if(readonlyItem==="ownerCardType"){
            let cardsDom = Array.from(document.querySelectorAll(`*[name='zhizhao']`))
            cardsDom.forEach(function(item){
                item.querySelector('p').removeAttribute('checked')
            })
            if(msg[readonlyItem]==="1"){
                cardsDom[0].querySelector('p').setAttribute('checked', 'true')
            }
            if(msg[readonlyItem]==="2"){
                cardsDom[1].querySelector('p').setAttribute('checked', 'true')
            }
            if(msg[readonlyItem]==="3"){
                cardsDom[2].querySelector('p').setAttribute('checked', 'true')
            }
        }
        if(readonlyItem==="guestCardType"){
            let cardsDom = Array.from(document.querySelectorAll(`*[name='zhizhao3']`))
            cardsDom.forEach(function(item){
                item.querySelector('p').removeAttribute('checked')
            })
            if(msg[readonlyItem]==="1"){
                cardsDom[0].querySelector('p').setAttribute('checked', 'true')
            }
            if(msg[readonlyItem]==="2"){
                cardsDom[1].querySelector('p').setAttribute('checked', 'true')
            }
            if(msg[readonlyItem]==="3"){
                cardsDom[2].querySelector('p').setAttribute('checked', 'true')
            }
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
                }else if(readonlyItem==='propertyAddr'){
                    console.log(msg[readonlyItem])
                    element.innerHTML=msg[readonlyItem]
                    element.classList.remove('input-title')
                    element.classList.remove('input-before')
                }else{
                    element.value=msg[readonlyItem]
                    element.setAttribute('value', msg[readonlyItem])
                }
            });
        }
    }