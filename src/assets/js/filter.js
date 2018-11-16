let FILTER={
  methods:{
    nullFormatter:function (row, column, cellValue, index) {
      // debugger
      if(!cellValue){
        return '--'
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
  }
}
export {
  FILTER
}
