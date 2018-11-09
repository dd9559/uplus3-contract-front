let stepIndex = 0 //记录执行合并次数
let otherStep = 0 //除合并外，剩余行数

let TOOL = {
  /**
   * 获取鼠标坐标
   * @param event
   * @returns {{x: number, y: number}}
   */
  getMousePos:function (event) {
    var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;

    return { 'x': x, 'y': y };
  },
  /**
   * 合并表格某列的单元格
   * @param rowIndex 当前单元格的行数
   * @param rowTotal 该列的总行数
   * @param collapse 该列单元格的合并场景，举例：[3,2,1]表示1-3行合并；4-5行合并，6单独
   * @param type     该列所有单元格是否合并为一个
   * @returns {*}
   */
  collapseRow:function ({rowIndex,rowTotal,collapse,type}) {
    // debugger
    if(type==='all'){
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
  }
}
export {
  TOOL
}
