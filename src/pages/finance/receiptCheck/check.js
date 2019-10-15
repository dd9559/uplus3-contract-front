const receiptCheck={
  props:{
    type:{//列表类型
      type:Number,
      default:1
    },
    list:{
      type:Array,
      default(){
        return []
      }
    },
    tableHeight:{//列表table的maxHeight设置初值
      type:Number,
      default:0
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
      this.setPath(this.getPath.concat({name:'合同详情'}))
      this.$router.push({
        path:'/otherContractDetail',
        query:{
          id:row.cid,
          type:this.type===1?'newHouse':this.type===2?'longRent':this.type===3?'financial':''
        }
      })
    },
    toDetails:function (row) {
      this.$router.push({
        path:'/receiptBillDetails',
        query:{
          id:row.id,
          type:this.type
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
            id:row.id,
            contId:row.cid,
            type:this.type,
            edit:true
          }
        })
      }else{
        this.toDetails(row)
      }
    },
    //设置审核人
    choseCheckPerson(row,type){
      this.$emit('choseCheckPerson',{row,type})
    }
  }
}
export {
  receiptCheck
}