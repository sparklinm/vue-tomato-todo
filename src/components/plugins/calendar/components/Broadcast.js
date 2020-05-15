import Touch from './Touch'
import DomResize from './DomResize'
import Events from './Events'

// function copyProperties (target, source) {
//   for (const key of Reflect.ownKeys(source)) {
//     if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
//       const desc = Object.getOwnPropertyDescriptor(source, key)
//       Object.defineProperty(target, key, desc)
//     }
//   }
// }

// function mix (...mixins) {
//   class Mix {
//     constructor () {
//       for (const mixin of mixins) {
//         copyProperties(this, new mixin()) // 拷贝实例属性
//       }
//     }
//   }

//   for (const mixin of mixins) {
//     copyProperties(Mix, mixin) // 拷贝静态属性
//     copyProperties(Mix.prototype, mixin.prototype) // 拷贝原型属性
//   }

//   return Mix
// }

export default class extends Events {
  // 当前轮播的元素索引
  currentIndex = 0;
  oldCurrentIndex =0;
  // 与当前元素交互的元素索引
  nextIndex = 0;
  // 父元素偏移量（transform:translateX）
  translateX = 0;
  // 元素数量（不包括前后占位元素）
  length = 0;
  // 是否正在动画
  isAnimated = false;
  // 各个轮播元素应该在的位置
  posAry = [];

  el = null;
  parentNode = null;

  constructor (el, options = {}) {
    super()
    this.el = el
    this.parentNode = this.el.parentNode
    const defaultOptions = {
      // 是否循环显示
      loop: true,
      // 是否实时根据交互元素高度设置容器高度
      timingHeight: false,
      width: 0
    }
    const curOptions = Object.assign(defaultOptions, options)

    this.loop = curOptions.loop
    this.timingHeight = curOptions.timingHeight
    this.width = curOptions.width

    this.addlistener()
    this.domResize = new DomResize(this.parentNode)

    this.domResize.on('domResize', () => {


      this.init()
      // 在滑动过程中改变dom大小时，不能直接修正到正常位置
      // this.setPos(this.getCorrectPos())
    })
    this.touch = new Touch(this.el)
  }

  init () {
    if (this.loop) {
      // 首尾元素的变化
      this.addHolder()
      // 元素的个数变化
      this.setNodes()
      this.length = this.nodes.length - 2
      // width的变化或父元素宽度变化
      this.setConSize()
      this.setConWidth()
      this.setPosAry()
      this.initNodesStyle()

      this.toItem(1, false)
    } else {
      this.setNodes()
      this.length = this.nodes.length
      this.setConSize()
      this.setConWidth()
      this.setPosAry()
      this.initNodesStyle()
    }

    this.touch.setMaxSlideDx(this.size.width)
  }

  autoResize () {}

  addlistener () {
    this.el.addEventListener('slidestart', this._slidestart)
    this.el.addEventListener('slide', this.throttle(this._slide))
    // this.el.addEventListener('slide', this._slide)
    this.el.addEventListener('slidend', this._slidend)
  }

  removeListener () {
    this.el.removeEventListener('slidestart', this._slidestart)
    this.el.removeEventListener('slide', this.throttle(this._slide))
    // this.el.addEventListener('slide', this._slide)
    this.el.removeEventListener('slidend', this._slidend)
  }

  throttle (fn) {
    let curTick = false
    const that = this
    const params = [...arguments]

    params.shift()
    return function () {
      const curParams = [...arguments]

      if (!curTick) {
        curTick = true
        requestAnimationFrame(() => {
          fn.apply(that, [...curParams, params])
          curTick = false
        })
      }
    }
  }

  _slidestart = () => {};

  _slide = e => {
    if (!this.isAnimated) {
      const pos = e.detail
      let dx = pos.dx

      if (!this.loop) {
        // 非loop模式下的 最大左滑和最大右滑
        const maxOffset = 200
        const leftLimit = this.posAry[0] + maxOffset
        const rightLimit = this.posAry[this.posAry.length - 1] - maxOffset

        if (this.translateX > leftLimit) {
          dx = 0
        } else if (this.translateX + pos.dx > leftLimit) {
          dx = maxOffset - this.translateX
        } else if (this.translateX < rightLimit) {
          dx = 0
        } else if (this.translateX + pos.dx < rightLimit) {
          dx = rightLimit - this.translateX
        }
      }

      this.slide(dx)
    }
  };

  _slidend = () => {
    this.smoothSlide(this.getCorrectPos())
    this.on(
      'animationend',
      () => {
        // loop模式下在滑动到首尾后跳转
        if (this.loop) {
          if (this.currentIndex === 0 && this.nextIndex === this.length - 1) {
            this.toLast()
          } else if (
            this.currentIndex === this.length - 1 &&
          this.nextIndex === 0
          ) {
            this.toFirst()
          }
        }
        this.setCurrentIndex()
        this.emit('slidend')
      },
      true
    )
  };

  smoothSlide (distance) {
    if (!this.isAnimated) {
      this.doSmoothSlide(distance)
      this.isAnimated = true
    }
  }

  doSmoothSlide (distance) {
    setTimeout(() => {
      let piece = 0

      if (distance > 0) {
        piece = 5
        const d = distance - piece

        if (d > 0) {
          this.setPos(piece)
          this.doSmoothSlide(d)
        } else {
          this.setPos(distance)
          this.doSmoothSlide(0)
        }
      } else if (distance < 0) {
        piece = -5
        const d = distance - piece

        if (d < 0) {
          this.setPos(piece)
          this.doSmoothSlide(d)
        } else {
          this.setPos(distance)
          this.doSmoothSlide(0)
        }
      } else {
        this.emit('animationend')
        // 不在动画状态
        this.isAnimated = false
      }
    }, 5)
  }

  slide (dx) {
    this.setPos(dx)
  }

  setPos (dx) {
    this.translateX += dx
    this.style(this.el, {
      transform: `translateX(${this.translateX}px)`
    })
    // 在滑动过程中实时获得下一个元素索引(待优化，不需要每次执行)
    this.setNextIndex()
  }

  // 滑动到某个元素（待优化）
  toItem (index, animation = true) {
    let cindex = index

    if (!this.loop) {
      if (index < 0) {
        cindex = 0
      } else if (index > this.length - 1) {
        cindex = this.length - 1
      }
    } else {
      if (index < 0) {
        cindex = this.length - 1
      } else if (index > this.length - 1) {
        cindex = 0
      }
    }

    if (cindex === this.currentIndex) {
      return
    }

    if (this.currentIndex === 0 && cindex === this.length - 1 && this.loop) {
      if (!animation) {
        this.slide(this.size.width)
        this.toLast()
        this.emit('slidend')
      } else {
        this.smoothSlide(this.size.width)
        this.on(
          'animationend',
          () => {
            this.toLast()
            this.emit('slidend')
          },
          true
        )
      }
    } else if (
      this.currentIndex === this.length - 1 &&
      cindex === 0 &&
      this.loop
    ) {
      if (!animation) {
        this.slide(-this.size.width)
        this.toFirst()
        this.emit('slidend')
      } else {
        this.smoothSlide(-this.size.width)
        this.on(
          'animationend',
          () => {
            this.toFirst()
            this.emit('slidend')
          },
          true
        )
      }
    } else {
      const distance = (this.currentIndex - cindex) * this.size.width

      if (!animation) {
        this.slide(distance)
        this.setCurrentIndex()
        this.emit('slidend')
      } else {
        this.smoothSlide(distance)
        this.on(
          'animationend',
          () => {
            this.setCurrentIndex()
            this.emit('slidend')
          },
          true
        )
      }
    }
  }

  // loop模式下跳转
  toLast () {
    const distance = (this.currentIndex - this.length) * this.size.width

    this.slide(distance)
    this.setCurrentIndex()
  }

  // loop模式下跳转
  toFirst () {
    const distance = (this.currentIndex + 1 - 0) * this.size.width

    this.slide(distance)
    this.setCurrentIndex()
  }

  next (animation = true) {
    this.toItem(this.currentIndex + 1, animation)
  }

  pre (animation = true) {
    this.toItem(this.currentIndex - 1, animation)
  }

  initNodesStyle () {
    this.nodes.forEach(node => {
      this.style(node.el, {
        display: 'inline-block',
        width: this.size.width + 'px'
      })
    })
  }

  addHolder () {
    if (this.first) {
      this.el.removeChild(this.first)
    }
    if (this.last) {
      this.el.removeChild(this.last)
    }
    const children = this.el.children

    this.last = children[0].cloneNode(true)
    this.first = children[children.length - 1].cloneNode(true)
    this.el.insertBefore(this.first, children[0])
    this.el.appendChild(this.last)
  }

  setConSize () {
    const style = window.getComputedStyle(this.parentNode)
    let styleWidth = style.width

    if (!styleWidth.includes('px')) {
      styleWidth = 300
    }

    this.size = {
      width: this.width || parseFloat(styleWidth),
      height: parseFloat(style.height)
    }
  }

  setConWidth () {
    this.style(this.el, {
      width: this.size.width * this.nodes.length + 'px'
    })
  }

  setNodes () {
    const children = this.el.children

    const nodes = []

    for (let i = 0; i < children.length; i++) {
      nodes.push({
        el: children[i],
        index: i
      })
    }
    this.nodes = nodes
  }

  setPosAry () {
    const posAry = []

    for (let i = 0; i < this.length; i++) {
      posAry[i] = this.getPosByIndex(i)
    }
    this.posAry = posAry
  }

  // 触摸事件结束时，修正元素位置
  getCorrectPos () {
    let correctedx = 0
    const firstPos = this.posAry[0]
    const lastPos = this.posAry[this.posAry.length - 1]

    if (this.translateX > firstPos) {
      // 首元素继续右移时
      if (this.loop) {
        const d = Math.abs(this.translateX - firstPos)

        if (d < this.size.width / 2) {
          correctedx = -d
        } else {
          correctedx = Math.abs(this.translateX)
        }
      } else {
        // 非loop模式下 总是回到首元素
        correctedx = -this.translateX
      }
    } else if (this.translateX < lastPos) {
      // 尾元素继续左移时
      if (this.loop) {
        const d = Math.abs(this.translateX - lastPos)

        if (d < this.size.width / 2) {
          correctedx = d
        } else {
          correctedx = d - this.size.width
        }
      } else {
        correctedx = lastPos - this.translateX
      }
    } else {
      this.posAry.forEach((item, index) => {
        if (
          this.translateX < item &&
          this.translateX > this.posAry[index + 1]
        ) {
          const d = Math.abs(this.translateX - item)

          if (d < this.size.width / 2) {
            correctedx = d
          } else {
            correctedx = this.posAry[index + 1] - this.translateX
          }
        }
      })
    }
    return correctedx
  }

  // 获得这个位置的元素索引
  getIndexByPos (offsetx) {
    const index = -offsetx / this.size.width

    return this.correctIndex(index)
  }

  // 修正两种模式下的元素索引
  correctIndex (index) {
    let cindex = index

    if (!this.loop) {
      if (index < 0) {
        cindex = 0
      } else if (index > this.length - 1) {
        cindex = this.length - 1
      }
    } else {
      cindex--
      if (index < 0) {
        cindex = this.length - 1
      } else if (index > this.length - 1) {
        cindex = 0
      }
    }
    return cindex
  }

  // 获得这个元素索引的位置
  getPosByIndex (index) {
    const pos = -index * this.size.width

    if (!this.loop) {
      return pos
    }
    return pos - this.size.width
  }

  // 实时设置容器高度（如果元素之间的高度不同）
  setConHeightTiming () {
    const curHeight = window.getComputedStyle(this.nodes[this.currentIndex].el)
      .height
    const nextHeight = window.getComputedStyle(this.nodes[this.nextIndex].el)
      .height
    const conHeight =
      Math.max(parseFloat(curHeight), parseFloat(nextHeight)) + 'px'

    this.style(this.el, {
      height: conHeight
    })
  }

  setCurrentIndex () {
    this.currentIndex = this.getIndexByPos(this.translateX)
    if (this.currentIndex !== this.oldCurrentIndex) {
      if (this.currentIndex === 0) {
        this.emit('onFirstItem')
      } else if (this.currentIndex === this.length - 1) {
        this.emit('onLastItem')
      }
      this.oldCurrentIndex = this.currentIndex
    }

    // currentIndex变化时，设置容器高度
    if (this.timingHeight) {
      this.setConHeightTiming()
    }
  }

  setNextIndex () {
    this.nextIndex = this.getIndexByPos(this.translateX)
    if (this.nextIndex > 0 && this.nextIndex < this.length - 1) {
      if (this.nextIndex > this.currentIndex) {
        this.nextIndex = Math.ceil(this.nextIndex)
      } else {
        this.nextIndex = Math.floor(this.nextIndex)
      }
    }

    // nextIndex变化时，设置容器高度
    if (this.timingHeight) {
      this.setConHeightTiming()
    }
  }

  destroy () {
    // this.removeListener()
    // this.domResize.destroy()
  }

  style (el, obj) {
    Object.assign(el.style, obj)
  }
}
