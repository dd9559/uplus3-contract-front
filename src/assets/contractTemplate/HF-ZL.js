import {contractConfig} from "./base.js"
let obj = {
  val6:'',
  check1:{
    name:'proveType',
    require:true
  },
  val11:'',
  check2:{
    name:'isPledge'
  },
  val12:'',
  val13:'',
  val14:'',
  val15:'',
  val16:'',
  val17:'',
  val18:'',
  val19:'',
  check3:{
    name:'methodType'
  },
  val22:'',
  check4:{
    name:'payType'
  },
  val23:'',
  val24:'',
  val25:'',
  val26:'',
  val27:'',
  val29:'',
  val30:'',
  check5:{
    name:'payType1'
  },
  val31:'',
  val32:'',
  check6:{
    name:'payType2'
  },
  val33:'',
  val36:'',
  val37:'',
  val38:'',
  val39:'',
  val40:'',
}
let errorArr=[]

function getCheckState(ele){
  return	!!(ele.querySelector('p').getAttribute('checked'))
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