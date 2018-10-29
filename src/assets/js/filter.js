let FILTER={
  methods:{
    nullFormatter:function (row, column, cellValue, index) {
      // debugger
      if(!cellValue){
        return '--'
      }else {
        return cellValue
      }
    }
  }
}
export {
  FILTER
}
