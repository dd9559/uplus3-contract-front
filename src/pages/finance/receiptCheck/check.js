const receiptCheck={
  props:{
    type:{
      type:Number,
      default:1
    },
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
    toDetails:function (row) {
      this.setPath(this.getPath.concat({name: '收款详情'}))
      this.$router.push({
        path:'/receiptBillDetails',
        query:{
          id:row.id
        }
      })
    },
    //操作
    cellOpera:function (row,type='check') {
      if(type==='edit'){
        this.setPath(this.getPath.concat({name: '编辑收款'}))
        this.$router.push({
          path:'/receiptBill_simple',
          query:{
            contId:row.id,
            type:this.type,
            edit:true
          }
        })
      }else{

      }
    }
  }
}
export {
  receiptCheck
}
