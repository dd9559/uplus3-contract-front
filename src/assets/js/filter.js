let FILTER={
  methods:{
    nullFormatter:function (row, column, cellValue) {
      // console.log(row[column.property])
      if(!cellValue){
        return '--'
      }else if(row[column.property] instanceof Object){
        return cellValue.label
      }else {
        return cellValue
      }
    }
  },
  filters:{
    getLabel:function (val) {
      if(!val){
        return '--'
      }else if(val instanceof Object){
        return val.label
      }else {
        return val
      }
    }
  }
}
export {
  FILTER
}
