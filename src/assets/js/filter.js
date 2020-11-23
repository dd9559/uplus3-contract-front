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
      num = num.toString();
      var index = num.indexOf(".");
      if (index !== -1) {
        num = num.substring(0, decimal + index + 1);
      } else {
        num = num.substring(0);
      }
      return parseFloat(num).toFixed(decimal);
    }
  },
}
export {
  FILTER
}
