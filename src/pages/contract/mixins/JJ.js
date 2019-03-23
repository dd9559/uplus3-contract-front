let Obj6 = {
  val3:'',
  val5:'',
  val6:'',
  val9:'',
  val10:''
}
let errorArr1=[]
const MIXINS_JJ={
  data(){
    return{

    }
  },
  methods:{
    //获取自定义勾选框选中状态
    getCheckState(ele){
      return	!!(ele.querySelector('p').getAttribute('checked'))
    },
    //居间校验
    brokerageCheck(iframe,obj=Obj6){
      errorArr1=[]
      for(let item in obj){
        obj[item]=iframe.document.querySelector(`input[extendparam=${item}]`).value
        iframe.document.querySelector(`input[extendparam=${item}]`).classList.remove('BODERRED')
        if(obj[item].length===0){
          errorArr1.push({
            type:'input',
            name:item
          })
          break
        }
      }
      console.log(errorArr1)
      return errorArr1
    }
  }
}
export {
  MIXINS_JJ
}
