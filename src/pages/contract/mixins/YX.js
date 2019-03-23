let Obj4 = {
  val3: '',
  val8: '',
  val9: '',
  val12: '',
  val13: '',
  val16: '',
}
let errorArr1=[]
const MIXINS_DB={
  data(){
    return{

    }
  },
  methods:{
    //获取自定义勾选框选中状态
    getCheckState(ele){
      return	!!(ele.querySelector('p').getAttribute('checked'))
    },
    //意向校验
    agreementCheck(iframe,obj=Obj4){
      errorArr1=[]
      for (let item in obj) {
        obj[item] = iframe.document.querySelector(`input[extendparam=${item}]`).value
        iframe.document.querySelector(`input[extendparam=${item}]`).classList.remove('BODERRED')
        if (obj[item].length === 0) {
          errorArr1.push({
            type:'input',
            name:item
          })
          break
        }
      }
      console.log(errorArr1)
      return errorArr1
    },
  }
}
export {
  MIXINS_DB
}
