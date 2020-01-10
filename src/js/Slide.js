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
  curIndex = 0;
  lastCurIndex = 0;
  // 父元素偏移量（transform:translateX）
  translateX = 0;
  // 元素数量（不包括前后占位元素）
  length = 0;
  // 是否正在动画
  isAnimated = false;
  // 各个轮播元素应该在的位置
  nodes = [];

  el = null;
  parentNode = null;

  constructor (el, options = {}, data) {
    super()
    this.el = el
    // this.parentNode = this.el.parentNode
    const defaultOptions = {
      // 是否循环显示
      loop: false,
      // 是否实时根据交互元素高度设置容器高度
      timingHeight: false,
      width: 0,
      visiableRowCount: 3,
      selectedIndex: 1
    }
    this.options = Object.assign(defaultOptions, options)
    this.data = data
    this.addlistener()
    // const domResize = new DomResize(this.parentNode)
    // domResize.on('domResize', () => {
    //   this.init()
    //   // 在滑动过程中改变dom大小时，不能直接修正到正常位置
    //   // this.setPos(this.getCorrectPos())
    // })
    this.touch = new Touch(this.el)
  }

  init () {
    this.setNodes()
    this.style(this.el.parentNode, {
      height: this.options.visiableRowCount * this.nodes[0].height + 'px',
      overflow: 'hidden'
    })
    this.topPos = this.nodes[0].y
    this.bottomPos = this.nodes[this.nodes.length - 1].y
    this.setPos(this.topPos)
    this.addSelectBox()
    console.log(this.nodes)
    // this.touch.setMaxSlideDx(this.size.width)
  }

  reInit (data) {
    this.data = data
    this.setNodes()
    if (this.nodes.length) {
      this.style(this.el.parentNode, {
        height: this.options.visiableRowCount * this.nodes[0].height + 'px',
        overflow: 'hidden'
      })
      this.topPos = this.nodes[0].y
      this.bottomPos = this.nodes[this.nodes.length - 1].y
      if (this.curIndex > this.nodes.length - 1) {
        this.curIndex = this.nodes.length - 1
      }
      this.setPosDirect(this.nodes[this.curIndex].y)
      this.emit(
        'change',
        this.nodes[this.curIndex].el,
        this.data[this.curIndex],
        this.nodes.map(node => node.el)
      )
    }
  }

  addlistener () {
    this.el.addEventListener('slidestart', this._slidestart)
    this.el.addEventListener('slide', this.throttle(this._slide))
    this.el.addEventListener('slidend', this._slidend)
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
      const d = pos.dy
      this.slide(d)
    }
  };

  _slidend = () => {
    this.smoothSlide(this.getCorrectPos())
    this.on(
      'animationend',
      () => {
        this.setCurIndex()
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

  slide (d) {
    this.setPos(d)
  }

  setPos (dx) {
    this.translateX += dx
    this.style(this.el, {
      transform: `translateY(${this.translateX}px)`
    })
    // 在滑动过程中实时获得下一个元素索引(待优化，不需要每次执行)
    this.setCurIndex()
    this.emit(
      'slide',
      this.nodes[this.curIndex].el,
      this.data[this.curIndex],
      this.nodes.map(node => node.el)
    )
  }

  setPosDirect (translate) {
    this.translateX = translate
    this.style(this.el, {
      transform: `translateY(${translate}px)`
    })
    this.setCurIndex()
    this.emit(
      'slide',
      this.nodes[this.curIndex].el,
      this.data[this.curIndex],
      this.nodes.map(node => node.el)
    )
  }

  // 滑动到某个元素（待优化）
  toItem (index, animation = true) {
    let cindex = index

    if (index < 0) {
      cindex = this.nodes.length - 1
    } else if (index > this.nodes.length - 1) {
      cindex = 0
    }

    if (cindex === this.curIndex) {
      return
    }

    const distance = (this.curIndex - cindex) * this.size.width
    if (!animation) {
      this.slide(distance)
      this.setCurIndex()
      this.emit('slidend')
    } else {
      this.smoothSlide(distance)
      this.on(
        'animationend',
        () => {
          this.setCurIndex()
          this.emit('slidend')
        },
        true
      )
    }
  }

  next (animation = true) {
    this.toItem(this.curIndex + 1, animation)
  }

  pre (animation = true) {
    this.toItem(this.curIndex - 1, animation)
  }

  // 元素初始的宽高、位置信息
  setNodes () {
    const children = this.el.children
    const nodes = []
    for (let i = 0; i < children.length; i++) {
      const width = children[i].offsetWidth
      const height = children[i].offsetHeight

      let y = 0
      if (i === 0) {
        const offset = this.options.selectedIndex * height
        y = 0 + offset
      } else {
        y = nodes[i - 1].y - nodes[i - 1].height
      }
      nodes.push({
        el: children[i],
        index: i,
        width,
        height,
        x: 0,
        y
      })
    }
    this.nodes = nodes
  }

  // 触摸事件结束时，修正元素位置
  getCorrectPos () {
    let correctedx = 0
    const firstPos = this.topPos
    const lastPos = this.bottomPos
    if (this.translateX > firstPos) {
      // 首元素继续右移时
      correctedx = firstPos - this.translateX
    } else if (this.translateX < lastPos) {
      // 尾元素继续左移时
      correctedx = lastPos - this.translateX
    } else {
      const index = this.getIndexByPos(this.translateX)
      correctedx = this.nodes[index].y - this.translateX
    }
    return correctedx
  }

  // 获得这个位置的元素索引
  getIndexByPos (offsetx) {
    let tindex = 0
    this.nodes.some((item, index) => {
      const nextItme = this.nodes[index + 1]
      if (offsetx > this.topPos) {
        tindex = 0
        return true
      }
      if (offsetx < this.bottomPos) {
        tindex = this.nodes.length - 1
        return true
      }

      if (offsetx === item.y) {
        tindex = index
        return true
      }

      if (offsetx < item.y && offsetx > nextItme.y) {
        const d = item.y - offsetx
        if (d > nextItme.height / 2) {
          tindex = index + 1
        } else {
          tindex = index
        }
        return true
      }
    })
    return tindex
  }

  setCurIndex () {
    this.curIndex = this.getIndexByPos(this.translateX)
    if (this.lastCurIndex !== this.curIndex) {
      this.emit(
        'change',
        this.nodes[this.curIndex].el,
        this.data[this.curIndex],
        this.nodes.map(node => node.el)
      )
      this.lastCurIndex = this.curIndex
    }
  }

  addSelectBox () {
    const selectBox = document.createElement('div')
    this.el.parentNode.style.position = 'relative'
    const height = this.nodes[0].height
    this.style(selectBox, {
      width: this.el.parentNode.offsetWidth + 'px',
      height: height + 'px',
      position: 'absolute',
      left: 0,
      top: this.options.selectedIndex * height + 'px',
      borderTop: '1px solid rgb(3, 136, 189)',
      borderBottom: '1px solid rgb(3, 136, 189)',
      zIndex: -1
    })
    this.el.parentNode.appendChild(selectBox)
  }

  style (el, obj) {
    Object.assign(el.style, obj)
  }
}

