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
    },
    booleanFormatter: function(row, column, cellValue, index) {
      // debugger
      if (!cellValue) {
        return "--";
      } else {
        return cellValue===1?'是':'否';
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
