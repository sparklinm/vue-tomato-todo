/**
 * 封装鼠标触摸事件。
 * @example
 * const el = document.querySelector('#container')
 * new Slide(el, 200, 200)
 * el.addEventListener('slidemove', (e) => {
 *   console.log(e.detail)
 *   // {
 *   //    // 滑动开始的点
 *   //    startx: ,
 *   //    starty: ,
 *   //    // 滑动过程的点
 *   //    endx: ,
 *   //    endy: ,
 *   //    // 滑动过程中与上一个点的距离
 *   //    dx: ,
 *   //    dy: ,
 *   //    // 滑动过程中与开始点的距离
 *   //    offsetx: ,
 *   //    offsety:
 *   // }
 * })
 */

export default class {
  // dom节点
  el = null
  // 手指移动过程中上一个坐标
  prePoint = {
    x: 0,
    y: 0
  }
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
  }

  /**
   * @param {HTMLElement} el - html 节点。
   * @param {Number} maxSlideDx - x 方向最大移动距离。
   * @param {Number} maxSlideDy - y 方向最大移动距离。
   * @param {Boolean} [limitArea=false] - 是否限制区域。
   * 如果为true，当滑动超过 maxSlideDx 限定的区域内，
   * 获取到的 dx 为 0，offsetx 为 ±maxSlideDx。
   * 如果为false，当滑动超过 maxSlideDx 限定的区域内，
   * 获取到的 dx 为 正常值，offsetx 为 ±maxSlideDx。
   */

  constructor (
    el,
    options = {
      limitArea: false
    }
  ) {
    this.el = el
    // 单次的最大横向滑动距离
    this.maxSlideDx = options.maxSlideDx
    this.maxSlideDy = options.maxSlideDy
    this.limitArea = options.limitArea
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
    this.setSupportsPassive()
    if ('ontouchstart' in window) {
      this._on(this.el, 'touchstart', this._start)
      this._on(this.el, 'touchmove', this._move)
      this._on(this.el, 'touchend', this._end)
    } else {
      this._on(window, 'mousedown', this._start)
      this._on(window, 'mousemove', this._move)
      this._on(window, 'mouseup', this._end)
    }
  }

  _on (el, event, fn) {
    el.addEventListener(
      event,
      fn,
      this.supportsPassive
        ? {
          capture: false,
          passive: false
        }
        : false
    )
  }

  _off (el, event, fn) {
    el.removeEventListener(
      event,
      fn,
      this.supportsPassive
        ? {
          capture: false,
          passive: false
        }
        : false
    )
  }

  setSupportsPassive () {
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: () => {
          this.supportsPassive = true
          return true
        }
      })

      window.addEventListener('testPassive', null, opts)
      window.removeEventListener('testPassive', null, opts)
    } catch (e) {
      console.error(e)
    }
  }

  checkNode (node) {
    if (!node) {
      return false
    }
    if (node === this.el) {
      return true
    }
    return this.checkNode(node.parentNode)
  }

  _start = (e) => {
    let startx = 0
    let starty = 0

    if (e.type === 'mousedown') {
      if (e.button !== 0) {
        return
      }
      if (this.checkNode(e.target)) {
        this.canSlide = true
      } else {
        this.canSlide = false
        return
      }
      startx = e.pageX
      starty = e.pageY
    } else {
      e.preventDefault()
      startx = e.targetTouches[0].pageX
      starty = e.targetTouches[0].pageY
    }

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
  }

  _move = (e) => {
    let endx = 0
    let endy = 0

    if (e.type === 'mousemove') {
      if (!this.canSlide) {
        return
      }
      endx = e.pageX
      endy = e.pageY
    } else {
      endx = e.targetTouches[0].pageX
      endy = e.targetTouches[0].pageY
    }

    // 相较于上一次touchmove点的距离
    let dx = endx - this.prePoint.x
    let dy = endy - this.prePoint.y
    let offsetx = 0
    let offsety = 0

    // 单次滑动过程不能超过设定maxSlideDx值
    if (this.maxSlideDx) {
      if (this.customData.offsetx + dx >= this.maxSlideDx) {
        dx = this.maxSlideDx - this.customData.offsetx
        offsetx = this.maxSlideDx
      } else if (this.customData.offsetx + dx <= -this.maxSlideDx) {
        dx = -this.maxSlideDx - this.customData.offsetx
        offsetx = -this.maxSlideDx
      } else {
        if (!this.limitArea) {
          offsetx = this.customData.offsetx + dx
        } else {
          const x = endx - this.customData.startx

          // 鼠标在界限范内
          if (x > -this.maxSlideDx && x < this.maxSlideDx) {
            // 处理边界问题
            // 如果是上次鼠标位置在左边界外面，然后移动到里面
            // 修正 dx 的值
            if (this.prePoint.x - this.customData.startx < -this.maxSlideDx) {
              dx = x - -this.maxSlideDx
            } else if (
              this.prePoint.x - this.customData.startx >
              this.maxSlideDx
            ) {
              dx = x - this.maxSlideDx
            }
            offsetx = x
          } else {
            offsetx = this.customData.offsetx
            dx = 0
          }
        }
      }
    } else {
      offsetx = endx - this.customData.startx
    }

    // 单次滑动过程不能超过设定maxSlideDy值
    if (this.customData.offsety + dy > this.maxSlideDy) {
      dy = this.maxSlideDy - this.customData.offsety
      offsety = this.maxSlideDy
    } else if (this.customData.offsety + dy < -this.maxSlideDy) {
      dy = -this.maxSlideDy - this.customData.offsety
      offsety = -this.maxSlideDy
    } else {
      offsety = endy - this.customData.starty
    }

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
  }

  _end = (e) => {
    let endx = 0
    let endy = 0

    if (e.type === 'mouseup') {
      if (!this.canSlide) {
        return
      }
      endx = e.pageX
      endy = e.pageY
      this.canSlide = false
    } else {
      endx = e.changedTouches[0].pageX
      endy = e.changedTouches[0].pageY
    }

    Object.assign(this.customData, {
      endx,
      endy
    })
    this.el.dispatchEvent(this.slideend)
  }

  setMaxSlideDx (ds) {
    this.maxSlideDx = ds
  }

  setMaxSlideDy (ds) {
    this.maxSlideDy = ds
  }

  // 销毁自定义事件
  destroy () {
    this._off(this.el, 'touchstart', this._start)
    this._off(this.el, 'touchmove', this._move)
    this._off(this.el, 'touchend', this._end)
    this._off(window, 'mousedown', this._start)
    this._off(window, 'mousemove', this._move)
    this._off(window, 'mouseup', this._end)
  }
}
