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
  // 所选元素索引
  curIndex = 0;
  // 上一个所选元素索引
  lastIndex = 0;
  // 父元素偏移量（transform:translateY）
  translateY = 0;
  // 元素数量（不包括前后占位元素）
  // 是否正在动画
  isAnimated = false;
  // 列表元素信息
  nodeInfo = {
    width: 30,
    height: 30,
    total: 0
  };
  el = null;

  constructor (el) {
    super()
    this.el = el
    this.addlistener()
    // const domResize = new DomResize(this.parentNode)
    // domResize.on('domResize', () => {
    //   this.init()
    //   // 在滑动过程中改变dom大小时，不能直接修正到正常位置
    //   // this.setPos(this.getCorrectPos())
    // })
    this.touch = new Touch(this.el)
  }

  init (options = {}, data, value) {
    const defaultOptions = {
      visiableRowCount: 5,
      // 初始位置索引
      startIndex: 0,
      // 保持索引位置不变
      keepIndex: true,
      // 选择框
      selectBox: {
      // 选择框所在位置
        position: 2,
        style: {}
      }
    }

    this.options = Object.assign(defaultOptions, options)
    this.data = data
    this.value = value
    this.setNodes()
    if (!this.nodeInfo.total) {
      this.emit('finsh', null, '', [])
      return
    }
    this.style(this.el, {
      height: this.options.visiableRowCount * this.nodeInfo.height + 'px',
      overflow: 'hidden'
    })
    // 开始位置的优先级 value > startIndex > keepIndex > 默认第一个
    if (this.value) {
      this.curIndex = this.getValueIndex()
    } else if (this.options.startIndex >= 0) {
      this.curIndex = this.options.startIndex
    } else if (this.options.keepIndex) {
      if (this.curIndex > this.nodeInfo.total - 1) {
        this.curIndex = this.nodeInfo.total - 1
      }
    } else {
      this.curIndex = 0
    }
    this.setPosDirect(this.getSelectedPos(this.curIndex))
    this.addSelectBox()
    this.emit(
      'finsh',
      this.list.children[this.curIndex],
      this.data[this.curIndex],
      [...this.list.children]
    )
    // this.touch.setMaxSlideDx(this.size.width)
  }

  getValueIndex () {
    return this.data.findIndex(item => item.value === this.value) || 0
  }

  addlistener () {
    this.el.addEventListener('slidestart', this._slidestart)
    this.el.addEventListener('slidemove', this._slide)
    this.el.addEventListener('slideend', this._slidend)
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
      this.slide(e.detail.dy)
    }
  };

  _slidend = () => {
    this.smoothSlide(this.getCorrectPos() - this.translateY)
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
    let piece = 0
    let dy = 0
    let newDistance = 0

    if (distance > 0) {
      piece = 5
      const d = distance - piece

      if (d > 0) {
        dy = piece
        newDistance = d
      } else {
        dy = distance
        newDistance = 0
      }
    } else if (distance < 0) {
      piece = -5
      const d = distance - piece

      if (d < 0) {
        dy = piece
        newDistance = d
      } else {
        dy = distance
        newDistance = 0
      }
    } else {
      this.emit('animationend')
      // 不在动画状态
      this.isAnimated = false
    }
    this.setPos(dy)
    setTimeout(() => {
      this.doSmoothSlide(newDistance)
    }, 5)
  }

  slide (d) {
    this.setPos(d)
  }

  setPos (dy) {
    this.translateY += dy
    this.style(this.list, {
      transform: `translateY(${this.translateY}px)`
    })
    // 在滑动过程中实时获得下一个元素索引(待优化，不需要每次执行)
    this.setCurIndex()
    this.emit(
      'slide',
      this.list.children[this.curIndex],
      this.data[this.curIndex],
      [...this.list.children]
    )
  }

  setPosDirect (y) {
    this.translateY = y
    this.style(this.list, {
      transform: `translateY(${y}px)`
    })
    this.setCurIndex()
    this.emit(
      'slide',
      this.list.children[this.curIndex],
      this.data[this.curIndex],
      [...this.list.children]
    )
  }

  // 滑动到某个元素（待优化）
  toItem (index, animation = true) {
    let cindex = index
    const firstIndex = 0
    const lastIndex = this.nodeInfo.total - 1

    if (index < firstIndex) {
      cindex = firstIndex
    } else if (index > lastIndex) {
      cindex = lastIndex
    }

    if (cindex === this.curIndex) {
      return
    }

    const distance = (this.curIndex - cindex) * this.nodeInfo.height

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

  setNodes () {
    const list = this.el.querySelector('.slide-list')

    // 每个元素大小相同
    this.nodeInfo = {
      // offsetWidth在元素隐藏时无效
      width: list.children[0].offsetWidth || 30,
      height: list.children[0].offsetHeight || 30,
      total: list.children.length
    }
    this.list = list
  }

  // 触摸事件结束时，修正元素位置
  getCorrectPos () {
    const correctIndex = this.getTopIndex(this.translateY)
    const correctTranslateY = -correctIndex * this.nodeInfo.height

    return correctTranslateY
  }

  // 获得这个位置的元素索引
  getTopIndex (y) {
    let topIndex = -Math.round(y / this.nodeInfo.height)
    // 顶端元素在选择框内时，无法再下滑动
    const minTopIndex = 0 - this.options.selectBox.position
    const maxTopIndex = this.nodeInfo.total - 1 - this.options.selectBox.position

    if (topIndex < minTopIndex) {
      topIndex = minTopIndex
    } else if (topIndex > maxTopIndex) {
      topIndex = maxTopIndex
    }
    return topIndex
  }

  getSelectedIndex (y) {
    return this.getTopIndex(y) + this.options.selectBox.position
  }

  getSelectedPos (index) {
    return (-index + this.options.selectBox.position) * this.nodeInfo.height
  }

  setCurIndex () {
    this.curIndex = this.getSelectedIndex(this.translateY)

    if (this.lastIndex !== this.curIndex) {
      this.emit(
        'change',
        this.list.children[this.curIndex],
        this.data[this.curIndex],
        [...this.list.children]
      )
      this.lastIndex = this.curIndex
    }
  }

  addSelectedClass () {
    const curItem = this.list.children[this.curIndex]
    const lastItem = this.list.children[this.lastIndex]

    curItem.classList.add('checked')
    lastItem.classList.remove('checked')
  }

  addSelectBox () {

    // 添加前，如果存在先remove掉
    if (this.selectBox) {
      this.el.removeChild(this.selectBox)
    }

    const customSelectBox = this.el.querySelector('.slide-select-box')
    const height = this.nodeInfo.height

    // 相对于父元素定位
    this.el.style.position = 'relative'
    if (customSelectBox) {
      const copy = customSelectBox.cloneNode(true)

      this.el.appendChild(copy)
      // customSelectBox.style.display = 'none'
      const computedStyle = window.getComputedStyle(copy)

      this.style(
        copy, {
          left: 0,
          top: this.options.selectBox.position * height + 'px',
          position: 'absolute',
          width: computedStyle.width,
          height: computedStyle.height
        }
      )
      this.selectBox = copy

      return
    }

    const selectBox = document.createElement('div')

    this.style(selectBox, {
      width: this.el.offsetWidth + 'px',
      height: height + 'px',
      position: 'absolute',
      left: 0,
      top: this.options.selectBox.position * height + 'px',
      borderTop: '1px solid rgb(3, 136, 189)',
      borderBottom: '1px solid rgb(3, 136, 189)',
      background: 'rgb(169, 221, 241)',
      opacity: 0.4,
      ...this.options.selectBox.style
    })
    this.el.appendChild(selectBox)
    this.selectBox = selectBox
  }

  destroy () {
    if (this.selectBox) {
      this.el.removeChild(this.selectBox)
    }
    this.touch.destroy()
    this.el.removeEventListener('slidestart', this._slidestart)
    this.el.removeEventListener('slidemove', this._slide)
    this.el.removeEventListener('slideend', this._slidend)
  }

  style (el, obj) {
    Object.assign(el.style, obj)
  }
}

// 重新初始化，位置
// 1. value > startIndex > keepIndex > 默认顶部
