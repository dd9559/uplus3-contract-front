import {contractConfig,toChineseNumber} from "./base.js"

let sub = {
  'val3':null,
  'val8':null,
  'val9':null,
  'val12':null,
  'val13':null,
  'val17':null,
  'val18':null,
  'val19':null,
}

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

//基础数据赋值
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
for(let readonlyItem in msg){
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
  let arr= []
  if(onlyReadDom.length>0){
    onlyReadDom.forEach((element,index) => {
      if(readonlyItem==='signDate'){
        let time = new Date(msg.signDate)
        let y = time.getFullYear();
        let M = time.getMonth() + 1;
        let D = time.getDate();
        let H = time.getHours()
        let signDate = `${y}年${M}月${D}日${H}时`
        console.log(signDate);
        element.innerHTML = signDate
      } else {
        element.innerHTML=msg[readonlyItem]
        element.setAttribute('value', msg[readonlyItem])
        element.classList.remove('input-before')
      }
    });
  }
}

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
    tip.target.innerHTML = ev.target.value
    document.querySelector(`*[extendparam=val19]`).innerHTML = toChineseNumber(ev.target.value).split("元")[0]
  }
  if(spanAttr==='chinese'){
    ev.target.value=ev.target.value.replace(/[^\d]/g, "")
    tip.target.innerHTML = toChineseNumber(ev.target.value).split("元")[0]
  }
})

