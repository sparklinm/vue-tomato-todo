class FrameCounter {
  constructor () {
    // 浏览器帧数
    this.frame = 0
    this._run = false
  }

  _runFun () {
    if (this._run) {
      this.frame++
      requestAnimationFrame(this._runFun.bind(this))
    }
  }

  start () {
    this._run = true
    this._runFun()
  }

  stop () {
    this._run = false
  }
}

import Events from './Events'

export default class extends Events {
  width = 20000;
  oldWidth = 0;
  newWidth = 0;
  oldHeight = 0;
  newHeight = 0;
  supportsPassive = false;
  constructor (el) {
    super()
    this.el = el
    this._init()
  }
  _init () {
    this.oldWidth = parseFloat(window.getComputedStyle(this.el).width)
    this.oldHeight = parseFloat(window.getComputedStyle(this.el).height)
    this.setSupportsPassive()
    this.createNode()
  }

  createNode () {
    // 监听变大的DOM
    const insideBig = document.createElement('div')

    insideBig.style =
      'position: absolute;top:0;left: 0;bottom: 0;right: 0;overflow: hidden;visibility: hidden;z-index:-1'
    insideBig.innerHTML = `<div style="width:${this.width}px;height:${this.width}px"></div>`

    // 监听变小的DOM
    const insideSmall = document.createElement('div')

    insideSmall.style =
      'position: absolute;top:0;left: 0;bottom: 0;right: 0;overflow: hidden;visibility: hidden;z-index:-1'
    insideSmall.innerHTML = '<div style="width:300%;height:300%"></div>'

    this.insideBig = insideBig
    this.insideSmall = insideSmall

    this.el.appendChild(insideBig)
    this.el.appendChild(insideSmall)

    insideSmall.scrollTop = this.width
    insideSmall.scrollLeft = this.width
    insideBig.scrollTop = this.width
    insideBig.scrollLeft = this.width

    insideBig.addEventListener(
      'scroll',
      this.scroll,
      this.supportsPassive
        ? {
          passive: true
        }
        : false,
      false
    )
    insideSmall.addEventListener(
      'scroll',
      this.scroll,
      this.supportsPassive
        ? {
          passive: true
        }
        : false,
      false
    )
  }

  scroll = () => {
    this.newWidth = parseFloat(window.getComputedStyle(this.el).width)
    this.newHeight = parseFloat(window.getComputedStyle(this.el).height)
    if (this.oldWidth !== this.newWidth || this.oldHeight !== this.newHeight) {
      this.emit('domResize')
      this.oldWidth = this.newWidth
      this.oldHeight = this.newHeight
    }
    this.insideSmall.scrollTop = this.insideBig.scrollTop = this.width
    this.insideSmall.scrollLeft = this.insideBig.scrollLeft = this.width
  };

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

  destroy () {
    this.insideBig.removeEventListener('scroll', this.scroll)
    this.insideSmall.removeEventListener('scroll', this.scroll)
    this.el.removeChild(this.insideBig)
    this.el.removeChild(this.insideSmall)
  }
}
