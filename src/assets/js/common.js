let stepIndex = 0 //记录执行合并次数
let otherStep = 0 //除合并外，剩余行数

let TOOL = {
  /**
   * 获取鼠标坐标
   * @param event
   * @returns {{x: number, y: number}}
   */
  getMousePos: function (event) {
    var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;

    return {
      'x': x,
      'y': y
    };
  },
  /**
   * 合并表格某列的单元格
   * @param rowIndex 当前单元格的行数
   * @param rowTotal 该列的总行数
   * @param collapse 该列单元格的合并场景，举例：[3,2,1]表示1-3行合并；4-5行合并，6单独
   * @param type     该列所有单元格是否合并为一个
   * @returns {*}
   */
  collapseRow: function ({
    rowIndex,
    rowTotal,
    collapse,
    type
  }) {
    // debugger
    if (type === 'all') {
      if (rowIndex === 0) {
        return {
          rowspan: rowTotal,
          colspan: 1
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    }
    if (rowIndex === 0 || rowIndex === rowTotal - otherStep) {
      otherStep = 0 //初始化剩余行数
      collapse.forEach((item, index) => {
        //统计剩余行数
        if (index > stepIndex) {
          otherStep += item
        }
      })
      stepIndex++
      return {
        rowspan: collapse[stepIndex - 1],
        colspan: 1
      }
    } else if (rowIndex < rowTotal - otherStep) {
      if (rowIndex + 1 === rowTotal) {
        stepIndex = 0 //初始化合并次数，必需，不然再表格发生重绘时，会出现第一列消失的情况
      }
      return {
        rowspan: 0,
        colspan: 0
      };
    }
  },
  /**
   * 重置表单对象
   * @param form
   */
  clearForm: function (form) {
    for (let item in form) {
      let type = typeof form[item]
      switch (type) {
        case 'string':
          form[item] = ''
          break;
        case 'number':
          form[item] = ''
          break;
        case 'boolean':
          form[item] = false
          break;
        case 'object':
          if (Object.prototype.toString.call(form[item]) === '[object Array]') {
            form[item] = []
          } else {
            form[item] = {}
          }
          break;
        default:
          form[item] = ''
      }
    }
  },
  /**
   * 表单校验 rule{'propName':{name:'label',type:'变量类型'}}
   */
  checkForm:function (form,rule) {
    return new Promise((resolve,reject)=>{
      for(let item in rule){
        let val = form[item]
        let type = Object.prototype.toString.call(val)
        let typeInfo = rule[item].type
        let res = {
          title:rule[item].name,
          msg:''
        }
        // debugger
        if(type==='[object Number]'){
          if(val<=0){
            res.msg = '请输入大于0的数字'
            reject(res)
            return
          }
        }
        if(type==='[object String]'){
          if(!val){
            res.msg='不能为空'
            reject(res)
            return
          }else if(typeInfo==='money'){
            if(parseFloat(val)<=0){
              res.msg = '请输入大于0的数字'
              reject(res)
              return
            }
          }else if(typeInfo==='bankCard'){
            if(val.length<16){
              res.msg = '银行卡号位数不正确'
              reject(res)
              return
            }
          }else if(typeInfo==='mobile'){
            if(val.length<11){
              res.msg = '手机号不正确'
              reject(res)
              return
            }
          }else if(typeInfo==='idCard'){
            if(val.length<18){
              res.msg = '身份证号不正确'
              reject(res)
              return
            }
          }
        }
        if(type==='[object Array]'){
          if(val.length===0){
            res.msg='不能为空'
            reject(res)
            return
          }
        }
      }
      resolve()
    })
  },

  //数字转中文数字
  toChineseNumber: function(money) {
    //汉字的数字
    var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
    //基本单位
    var cnIntRadice = new Array('', '拾', '佰', '仟');
    //对应整数部分扩展单位
    var cnIntUnits = new Array('', '万', '亿', '兆');
    //对应小数部分单位
    var cnDecUnits = new Array('角', '分', '毫', '厘');
    //整数金额时后面跟的字符
    var cnInteger = '整';
    //整型完以后的单位
    var cnIntLast = '元';
    //最大处理的数字
    var maxNum = 999999999.99;
    //金额整数部分
    var integerNum;
    //金额小数部分
    var decimalNum;
    //输出的中文金额字符串
    var chineseStr = '';
    //分离金额后用的数组，预定义
    var parts;
    if (!money) {
      chineseStr = cnNums[0] + cnIntLast + cnInteger;
      return chineseStr;
    }
    money = parseFloat(money);
    if (money >= maxNum) {
      //超出最大处理数字
      return '';
    }
    //转换为字符串
    money = money.toString();
    if (money.indexOf('.') == -1) {
      integerNum = money;
      decimalNum = '';
    } else {
      parts = money.split('.');
      integerNum = parts[0];
      decimalNum = parts[1].substr(0, 4);
    }
    //获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
      var zeroCount = 0;
      var IntLen = integerNum.length;
      for (var i = 0; i < IntLen; i++) {
        var n = integerNum.substr(i, 1);
        var p = IntLen - i - 1;
        var q = p / 4;
        var m = p % 4;
        if (n == '0') {
          zeroCount++;
        } else {
          if (zeroCount > 0) {
            chineseStr += cnNums[0];
          }
          //归零
          zeroCount = 0;
          chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
        }
        if (m == 0 && zeroCount < 4) {
          chineseStr += cnIntUnits[q];
        }
      }
      chineseStr += cnIntLast;
    }
    //小数部分
    if (decimalNum != '') {
      var decLen = decimalNum.length;
      for (var i = 0; i < decLen; i++) {
        var n = decimalNum.substr(i, 1);
        if (n != '0') {
          chineseStr += cnNums[Number(n)] + cnDecUnits[i];
        }
      }
    }
    if (chineseStr == '') {
      chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNum == '') {
      chineseStr += cnInteger;
    }
    return chineseStr;
  },
  dateFormat:function (val) {
    if(!val){
      return '--'
    }else {
      let time = new Date(val)
      let y = time.getFullYear()
      let M = time.getMonth() + 1
      let D = time.getDate()
      return `${y}-${M>9?M:'0'+M}-${D>9?D:'0'+D}`
    }
  },
  timeFormat:function (val) {
    if(!val){
      return '--'
    }else {
      let time = new Date(val)
      let y = time.getFullYear()
      let M = time.getMonth() + 1
      let D = time.getDate()
      let h = time.getHours()
      let m = time.getMinutes()
      let s = time.getSeconds()
      return `${y}-${M>9?M:'0'+M}-${D>9?D:'0'+D} ${h>9?h:'0'+h}:${m>9?m:'0'+m}:${s>9?s:'0'+s}`
    }
  },
  nullFormat:function (val) {
    if (!val && typeof(val) !== 'number'){
      return '--'
    }
    else {
      return val
    }
  }
}

export {
  TOOL
}
