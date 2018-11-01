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
  }
}
export {
  TOOL
}
