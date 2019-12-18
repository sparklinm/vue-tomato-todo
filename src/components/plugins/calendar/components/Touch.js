export default class {
  el;
  prePoint = {
    x: 0,
    y: 0
  };
  movePoint = {
    x: 0,
    y: 0
  };
  slideObj={
    dx: 0,
    dy: 0,
    offsetx: 0,
    offsety: 0
  }
  constructor (el, maxSlideDx) {
    this.el = el
    // 单次的最大滑动距离
    this.maxSlideDx = maxSlideDx
    this._init()
  }

  _init () {
    this._slideEv = document.createEvent('CustomEvent')
    this._slideEv.initCustomEvent('slide', true, true, this.slideObj)
    this._slidendEv = document.createEvent('CustomEvent')
    this._slidendEv.initCustomEvent('slidend', true, true, this.slideObj)
    this._slidestartEv = document.createEvent('CustomEvent')
    this._slidestartEv.initCustomEvent('slidestart', true, true, this.slideObj)
    this.el.addEventListener('touchstart', this._start)
    this.el.addEventListener('touchmove', this._move)
    this.el.addEventListener('touchend', this._end)
  }

  _start = e => {
    const x = e.targetTouches[0].pageX
    const y = e.targetTouches[0].pageY
    this.prePoint = {
      x: x,
      y: y
    }
    Object.assign(this.slideObj, {
      startx: x,
      starty: y,
      offsetx: 0,
      offsety: 0,
      dx: 0,
      dy: 0
    })
    this.el.dispatchEvent(this._slidestartEv)
  }

  _move = e => {
    const x = e.targetTouches[0].pageX
    const y = e.targetTouches[0].pageY
    this.movePoint = {
      x: x,
      y: y
    }

    let dx = x - this.prePoint.x
    const dy = y - this.prePoint.y
    let offsetx = 0
    let offsety = 0

    if (this.slideObj.offsetx + dx > this.maxSlideDx) {
      dx = this.maxSlideDx - this.slideObj.offsetx
      offsetx = this.maxSlideDx
    } else if (this.slideObj.offsetx + dx < -this.maxSlideDx) {
      dx = -this.maxSlideDx - this.slideObj.offsetx
      offsetx = -this.maxSlideDx
    } else {
      offsetx = x - this.slideObj.startx
    }
    offsety = y - this.slideObj.starty

    Object.assign(this.slideObj, {
      endx: x,
      endy: y,
      dx: dx,
      dy: dy,
      offsetx: offsetx,
      offsety: offsety
    })
    this.prePoint = this.movePoint
    this.el.dispatchEvent(this._slideEv)
  }

  _end = e => {
    const x = e.changedTouches[0].pageX
    const y = e.changedTouches[0].pageY
    this.endPoint = {
      x: x,
      y: y
    }
    Object.assign(this.slideObj, {
      endx: x,
      endy: y
    })
    this.el.dispatchEvent(this._slidendEv)
  };

  setMaxSlideDx (ds) {
    this.maxSlideDx = ds
  }

  destroy () {
    this.el.removeEventListener('touchstart', this._start)
    this.el.removeEventListener('touchmove', this._move)
    this.el.removeEventListener('touchend', this._end)
  }
}
