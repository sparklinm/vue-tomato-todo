export default class {
  // dom节点
  el;
  // 手指移动过程中上一个坐标
  prePoint = {
    x: 0,
    y: 0
  };
  // 自定义用户数据
  customData = {
    // 滑动开始的点
    startx: 0,
    starty: 0,
    // 滑动过程的点
    endx: 0,
    endy: 0,
    // 滑动过程中与上一个点的距离
    dx: 0,
    dy: 0,
    // 滑动过程中与开始点的距离
    offsetx: 0,
    offsety: 0
  };
  constructor (el, maxSlideDx) {
    this.el = el
    // 单次的最大横向滑动距离
    this.maxSlideDx = maxSlideDx
    this._init()
  }

  _init () {
    // 注册滑动开始、过程、结束事件
    this.slidestart = new CustomEvent('slidestart', {
      detail: this.customData,
      bubbles: true,
      cancelable: true
    })
    this.slidemove = new CustomEvent('slidemove', {
      detail: this.customData,
      bubbles: true,
      cancelable: true
    })
    this.slideend = new CustomEvent('slideend', {
      detail: this.customData,
      bubbles: true,
      cancelable: true
    })
    // 监听原生触摸事件
    this.el.addEventListener('touchstart', this._start)
    this.el.addEventListener('touchmove', this._move)
    this.el.addEventListener('touchend', this._end)
  }

  _start = e => {
    const startx = e.targetTouches[0].pageX
    const starty = e.targetTouches[0].pageY
    // 初始化data
    Object.assign(this.customData, {
      startx,
      starty,
      endx: startx,
      endy: starty,
      dx: 0,
      dy: 0,
      offsetx: 0,
      offsety: 0
    })
    this.prePoint = {
      x: startx,
      y: starty
    }
    this.el.dispatchEvent(this.slidestart)
  };

  _move = e => {
    const endx = e.targetTouches[0].pageX
    const endy = e.targetTouches[0].pageY
    // 相较于上一次touchmove点的距离
    let dx = endx - this.prePoint.x
    const dy = endy - this.prePoint.y
    let offsetx = 0
    let offsety = 0

    // 单次滑动过程不能超过设定maxSlideDx值
    if (this.customData.offsetx + dx > this.maxSlideDx) {
      dx = this.maxSlideDx - this.customData.offsetx
      offsetx = this.maxSlideDx
    } else if (this.customData.offsetx + dx < -this.maxSlideDx) {
      dx = -this.maxSlideDx - this.customData.offsetx
      offsetx = -this.maxSlideDx
    } else {
      offsetx = endx - this.customData.startx
    }
    offsety = endy - this.customData.starty

    Object.assign(this.customData, {
      endx,
      endy,
      dx,
      dy,
      offsetx,
      offsety
    })
    this.prePoint = {
      x: endx,
      y: endy
    }
    this.el.dispatchEvent(this.slidemove)
  };

  _end = e => {
    const endx = e.changedTouches[0].pageX
    const endy = e.changedTouches[0].pageY
    Object.assign(this.customData, {
      endx,
      endy
    })
    this.el.dispatchEvent(this.slideend)
  };

  setMaxSlideDx (ds) {
    this.maxSlideDx = ds
  }

  // 销毁自定义事件
  destroy () {
    this.el.removeEventListener('touchstart', this._start)
    this.el.removeEventListener('touchmove', this._move)
    this.el.removeEventListener('touchend', this._end)
  }
}