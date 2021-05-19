let getVal = function (val) {
  let type = Object.prototype.toString.call(val)
  if (type !== '[object Number]' && !val) {
    return '--'
  } else if (type === '[object Object]') {
    return getVal(val.label)
  } else {
    return val
  }
}

let FILTER = {
  methods: {
    nullFormatter: function (row, column, cellValue) {
      return getVal(cellValue)
    },
    booleanFormatter: function (row, column, cellValue, index) {
      // debugger
      if (!cellValue && cellValue != 0) {
        return "--";
      } else {
        return cellValue === 1 ? '是' : '否';
      }
    },
    nullFormatterData(row, column, cellValue) {
      return this.getDataVal(cellValue)
    },
    getDataVal(val) {
      if (val == undefined || val === '') {
        return '--'
      } else {
        return val
      }
    }
  },
  filters: {
    getLabel: function (val) {
      return getVal(val)
    },
    getSignImage(val, list) {
      if (list.length === 0) {
        return '';
      } else {
        return list.find(item => {
          return item.includes(val)
        })
      }
    },
    //运算时四舍五入保留两位小数 num为传入的值，n为保留的小数位
    fomatFloat: function (num, decimal = 2) {
      num = num ? num : 0
      let multiples = Number('1'.padEnd(decimal+1,0)),
          multiplesNum = Math.round(parseFloat(num) * multiples) / multiples,
          strNum = multiplesNum.toString(),
          index = strNum.indexOf("."),
          decimalPoint,
          integer;

      if (index !== -1) {
        integer = strNum.substring(0,index)
        decimalPoint = strNum.substring(index+1).padEnd(decimal,0);
      } else {
        integer = strNum.substring(0);
        decimalPoint = '0'.padEnd(decimal,0)
      }
      return `${integer}.${decimalPoint}`;
    }
  },
}
export {
  FILTER
}
