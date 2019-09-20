const receiptCheck={
  props:{
    list:{
      type:Array,
      default(){
        return []
      }
    }
  },
  computed:{
    getList:function () {
      return this.list
    }
  },
  methods:{
    /**
     * 合同信息操作
     * @param type
     */
    toLink:function (row,type) {
      let param={
        contType:row.contTypeId,
        contId:row.contId,
        contCode:row.contCode,
        operaType:type,
        power:type==='cont'?this.power['sign-com-htdetail']:type==='house'?this.power['sign-com-house']:type==='customer'?this.power['sign-com-cust']:''
      }
      this.msgOpera(param)
    },
    toDetails:function () {

    }
  }
}
export {
  receiptCheck
}
