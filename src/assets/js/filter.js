let getVal=function (val) {
  if(!val){
    return '--'
  }else if(val instanceof Object){
    return val.label
  }else {
    return val
  }
}

let FILTER={
  methods:{
    nullFormatter:function (row, column, cellValue) {
      return getVal(cellValue)
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
      return getVal(val)
    }
  }
}
export {
  FILTER
}
