     let obj = {
             val8:'',
             val10:'',
             val11:'',
             val12:'',
             val14:'',
             val15:'',
             val16:'',
             val17:'',
             check1:{
                 name:'part'
             },
             val20:'',
            check2:{
                name:'owner',
                require:true
            },
            check3:{
                name:'guest',
                require:true
            },
      }
      let errorArr=[]
    //表单对象非空校验
    function submit() {
        errorArr=[]
        for(let item in obj){
            let itemType=Object.prototype.toString.call(obj[item])
            console.log(itemType)
            if(itemType==='[object Object]'){
                let box=document.querySelectorAll(`div[name=${obj[item].name}]`)
                let arr=Array.from(box)
                let state = true
                if(obj[item].name==="owner"||obj[item].name==="guest"){
                    state=false
                }else{
                    state = arr.every(function (item) {
                    return !!(item.querySelector('p').getAttribute('checked'))===false
                    })
                }
                if(state){
                    if(obj[item].other){
                        let otherState = obj[item].other.every(function (tip) {
                            return document.querySelector(`input[extendparam=${tip}]`).value.length===0
                        })
                        if(otherState){
                           errorArr.push({
                               type:'input',
                               name:tip
                           })
                            break
                        }
                    }else {
                        errorArr.push({
                            name:obj[item].name
                        })
                        break
                    }
                }else {
                  //勾选后判断
                  if(obj[item].require){
                      let box=Array.from(document.querySelectorAll(`div[name=${obj[item].name}]`))
                      let detail={}
                      switch (obj[item].name){
                          case 'owner':
                            box.forEach(element => {
                                if(element.querySelector('p').getAttribute('checked')){
                                    element.parentElement.querySelector("span").style.color="#000000"
                                    let brother=element.parentElement.querySelector("input[type='text']")
                                    if(brother.value.length===0){
                                        element.parentElement.querySelector("span").style.color="red"
                                        errorArr.push({
                                            type:'input',
                                            name:brother.getAttribute('extendparam')
                                        })
                                    }
                                }
                            });
                              break
                          case 'guest':
                            box.forEach(element => {
                                if(element.querySelector('p').getAttribute('checked')){
                                    let brother=element.parentElement.querySelector("input[type='text']")
                                    if(brother.value.length===0){
                                        errorArr.push({
                                            type:'input',
                                            name:brother.getAttribute('extendparam')
                                        })
                                    }
                                }
                            });
                            break
                      }
                  }
              }
            }else {
                let val=document.querySelector(`input[extendparam=${item}]`).value
                if(val.length===0){
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

        let inputbox = document.querySelectorAll("input[tag='input']")
        for (let i = 0; i < inputbox.length; i++) {
            if(document.addEventListener){
                inputbox[i].addEventListener('change', function () {
                    let addrReg=/\?|\？|\*|\"|\“|\”|\'|\‘|\’|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g
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

    let checkboxs= document.querySelectorAll(".info-checkbox")
    for(let i=0;i<checkboxs.length;i++){
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
                tip.target.classList.remove('input-before')
                if(ev.target.value.length===0){
                    tip.target.classList.add('input-before')
                }
            }
            document.querySelector('.control-btn').onclick=function (e) {
                let btn=e.target.innerHTML
                if(btn==='取消'){
                    if(initVal.length>0){
                        tip.target.innerHTML=initVal
                        tip.target.classList.remove('input-before')
                    }else {
                        tip.target.innerHTML=''
                        tip.target.classList.add('input-before')
                    }
                }else if(btn==='保存'){

                }
                inputArea.style.display='none'
                textArea.value=''
            }
        }
    }


    //基础数据赋值
    // let msg = JSON.parse(window.localStorage.getItem("contractMsg"));
    let msg = {
        code:"D0001190322005",
        commissionPayment:1000,
        companyNames:["测试小队一"],
custCommission:1000,
custCommissionUpper:"壹仟",
custEnsure:1000,
dealPrice:100000,
dealPriceUpper:"壹拾万",
guestID:"420102199003070899",
guestIDs:"",
guestName:"刘亦菲",
guestNames:"",
guestTel:"12215454777",
guestTels:"",
guestinfoCode:"CSXD000058",
houseinfoCode:"S2A9QAZX000009",
id:1512,
isHaveData:0,
isWuHanMM:0,
moneyUnit:"元",
otherCooperationCost:0,
ownerCommission:1000,
ownerCommissionUpper:"壹仟",
ownerID:"420102199003070897",
ownerIDs:"",
ownerName:"我",
ownerNames:"",
ownerTel:"13211111111",
ownerTels:"",
propertyAddr:"万科生态花山万科小区小茹大道888号纯净水岸.花山一期（A-11，A-20，A-10，A-12，A-55）F60栋8单元88层855",
propertyCard:"",
remarks:"",
signDate:1553184000000,
square:10,
squareUse:0,
subscriptionPrice:0,
subscriptionPriceUpper:"零",
transFlowCode:22,
type:3,
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
                let companyName = document.querySelector(`input[extendParam="val10"]`)
                let companyNameTxt = msg[readonlyItem].join(',')
                companyName.setAttribute('list',companyNameTxt)
            }
        }
        if(onlyReadDom.length>0){
            onlyReadDom.forEach((element,index) => {
                if(readonlyItem==='signDate'){
                    element.setAttribute('value', arr[index])
                }else if(readonlyItem==='ownerName'){
                    if(msg['ownerNames']){
                        let names = msg['ownerName']+'、'+msg['ownerNames']
                        element.setAttribute('value', names)
                    }else{
                        element.setAttribute('value', msg['ownerName'])
                    }
                }else if(readonlyItem==='guestName'){
                    if(msg['guestNames']){
                        let names = msg['guestName']+'、'+msg['guestNames']
                        element.setAttribute('value', names)
                    }else{
                        element.setAttribute('value', msg['guestName'])
                    }
                }else if(readonlyItem==='ownerID'){
                    if(msg['ownerIDs']){
                        let names = msg['ownerID']+'、'+msg['ownerIDs']
                        element.setAttribute('value', names)
                    }else{
                        element.setAttribute('value', msg['ownerID'])
                    }
                }else if(readonlyItem==='guestID'){
                    if(msg['guestIDs']){
                        let names = msg['guestID']+'、'+msg['guestIDs']
                        element.setAttribute('value', names)
                    }else{
                        element.setAttribute('value', msg['guestID'])
                    }
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