export const imagerror = {
  inserted (dom, options) {
    // dom 表示当前指定的dom对象
    // options 是指变量的解释,有个属性叫做value
    // 核心原理就是通过拿到img元素监听图片的onerror事件
    dom.onerror = function () {
      // 失败就让图片显示一个默认值
      dom.src = options.value
    }
  }
}
