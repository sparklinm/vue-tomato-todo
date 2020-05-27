'use strict'
function boolMobile () {
  if (
    window.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    return true // 移动端
  }
  return false // PC端
}

function checkPageCanScroll () {
  const viewHeight = document.documentElement.clientHeight
  const viewWidth = document.documentElement.clientWidth
  const bodyStyle = window.getComputedStyle(document.body)
  const htmlStyle = window.getComputedStyle(document.documentElement)

  return (
    bodyStyle.overflow !== 'hidden' &&
    htmlStyle.overflow !== 'hidden' &&
    (document.documentElement.scrollHeight > viewHeight ||
      document.documentElement.scrollWidth > viewWidth)
  )
}

function checkNodeCanScroll (el) {
  const elStyle = window.getComputedStyle(el)

  return (
    elStyle.overflow !== 'visible' &&
    (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth)
  )
}

function throttle (fn) {
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

class Event {
  // on 监听的事件
  onEvents = {};
  // once 表示注册的事件只执行一次便自动移除
  on (name, callback, once = false) {
    this.onEvents[name] = this.onEvents[name] || []
    this.onEvents[name].push({
      name: name,
      callback: callback,
      once: once
    })
  }

  // 移除事件
  off (name, callback) {
    this.onEvents[name] = this.onEvents[name].filter(event => {
      return event.callback !== callback
    })
  }

  emit (name) {
    if (!this.onEvents[name]) {
      return
    }
    const params = [...arguments].slice(1)

    this.onEvents[name] = this.onEvents[name].filter(event => {
      event.callback(...params)
      // 事件执行完毕后，判断是否为一次性事件
      return !event.once
    })
  }
}
/**
 * @description 分类器
 * @param {String} id 父元素id选择器
 * @param {Array} data 可选，分类的数据
 */

class Sorter {
  // 分类数据
  data;
  // 容器节点
  container;
  // 列表元素
  items;
  // 拖拽元素的副本
  nodeCopy;
  // 拖拽元素最开始位置信息
  nodeInitPos;
  // 拖拽元素位置索引
  index;
  // 鼠标位置
  mouse = {};
  // 单次动画结束
  isMoveEnd = true;
  // 当次拖拽结束
  isDragEnd = true;
  // 是否能拖拽
  canDrag = true;

  // 相对于文档的位置
  copyPosition = {};
  // 相对于文档的位置
  bodyPosition = {};
  // 相对于文档的位置
  containerPosition = {};
  // postions 相对于文档的位置

  // simple：性能高，但多行时如果有动画，不支持元素大小不一样
  // complex: 性能低， 但支持多行时元素大小不一样

  constructor (el, initOptions, data) {
    this.container = el
    this.options = {
      // simple complex
      mode: 'complex',
      // 拖拽不能超出边界
      animation: true,
      duration: 5000,
      delay: 0,
      dragNode: 'sort-cell',
      dragClass: '',
      ...initOptions
    }
    this.event = new Event()
    // this.data = _.cloneDeep(data)
    this.data = data
  }

  init () {
    this.isMobile = boolMobile()
    this.isSimpleMode = this.options.mode === 'simple'
    this.setNodes()

    if (this.isSimpleMode) {
      let area = 0

      // horizontal vertical mixin
      this.direction = 'vertical'
      this.items = []
      this.nodes.forEach((node, index) => {
        if (!this.isMobile) {
          node.draggable = true
        }
        const position = this.getPostionInContainer(node)
        const obj = {
          el: node,
          position: position,
          id: index
        }

        if (index === 1) {
          const lastItem = this.items[0]

          if (
            lastItem.position.left !== position.left &&
            lastItem.position.top === position.top
          ) {
            this.direction = 'horizontal'
          } else if (
            lastItem.position.top !== position.top &&
            lastItem.position.left === position.left
          ) {
            this.direction = 'vertical'
          } else {
            this.direction = 'mixin'
          }
        }

        if (index > 0) {
          const lastItem = this.items[index - 1]

          if (this.direction === 'horizontal') {
            if (position.top !== lastItem.position.top) {
              area++
              lastItem.last = true
              obj.first = true
            }
          } else if (this.direction === 'vertical') {
            if (position.left !== lastItem.position.left) {
              area++
              lastItem.last = true
              obj.first = true
            }
          }
        } else {
          obj.first = true
        }

        obj.area = area
        this.items.push(obj)
      })
    } else {
      this.nodes.forEach(node => {
        if (!this.isMobile) {
          node.draggable = true
        }
      })
    }

    this.initScrollInfo()
    this.throttleTouchMove = throttle(this.touchMove)
    this.throttleDrag = throttle(this.drag)
    this.setSupportsPassive()
    this.addlistener()
  }

  static group () {
    const instances = [...arguments]

    instances.forEach(instance => {
      instance.setInstances(instances)
    })
  }

  addlistener () {
    if (this.isMobile) {
      this._on(this.container, 'touchstart', this.touchStart)
      this._on(this.container, 'touchmove', this.throttleTouchMove)
      this._on(this.container, 'touchend', this.touchEnd)
    } else {
      this._on(this.container, 'dragstart', this.dragStart)
      this._on(this.container, 'drag', this.throttleDrag)
      this._on(this.container, 'dragend', this.dragEnd)
    }
  }

  removeListener () {
    if (this.isMobile) {
      this._off(this.container, 'touchstart', this.touchStart)
      this._off(this.container, 'touchmove', this.throttleTouchMove)
      this._off(this.container, 'touchend', this.touchEnd)
    } else {
      this._off(this.container, 'dragstart', this.dragStart)
      this._off(this.container, 'drag', this.throttleDrag)
      this._off(this.container, 'dragend', this.dragEnd)
    }
  }

  // 需要在touchStart事件中使用preventDefault阻止页面的滚动行为
  // 但高版本浏览器会默认设置passive:true，无法preventDefault
  // 所以需要设置passive:false
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

  on (name, callback, once = false) {
    this.event.on(name, callback, once)
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

  dragStart = e => {
    const node = e.target
    const dragNode = this.checkNode(node)

    if (!this.isRightNode) {
      return
    }

    const index = this.start(dragNode, e.clientX, e.clientY)

    if (index < 0) {
      return
    }
    if (e.dataTransfer.setData) {
      e.dataTransfer.setData('text/html', e.target)
    }
    if (e.dataTransfer.dropEffect) {
      e.dataTransfer.dropEffect = 'move'
    }
    this.setDragNodeStyle()
  };

  drag = e => {
    if (!this.isRightNode) {
      return
    }
    this.move(e.clientX, e.clientY)
  };

  dragEnd = () => {
    if (!this.isRightNode) {
      return
    }
    this.end()
  };

  touchStart = event => {
    event.preventDefault()
    const touch = event.targetTouches[0]
    const node = touch.target
    const dragNode = this.checkNode(node)

    if (!this.isRightNode) {
      return
    }

    const index = this.start(dragNode, touch.clientX, touch.clientY)

    if (index < 0) {
      return
    }
    this.setNodeCopy(dragNode)
    this.setDragNodeStyle()
  };

  touchMove = event => {
    if (!this.isRightNode) {
      return
    }

    const touch = event.targetTouches[0]

    this.move(touch.clientX, touch.clientY)
  };

  touchEnd = () => {
    if (!this.isRightNode) {
      return
    }

    this.end()
  };

  start (node, x, y) {
    // 即使end事件触发，但动画也可能正在进行
    // 只有动画完毕才可以拖拽
    if (!this.isMoveEnd) {
      this.canDrag = false
      return -1
    }
    this.event.emit('start')
    let index = -1

    if (this.isSimpleMode) {
      index = this.items.findIndex(item => {
        return item.el === node
      })
    } else {
      this.setNodes()
      index = this.nodes.findIndex(el => {
        return el === node
      })
    }

    if (index === -1) {
      return -1
    }

    this.canDrag = true
    this.isDragEnd = false

    // 相对于容器的节点中心坐标

    // 设置copy的初始位置
    this.initCopyPostion(node)

    this.nodeInitPos = {
      index
    }

    this.moveInfo = {
      dragNode: node
    }

    this.mouse.originX = x
    this.mouse.originY = y
    this.mouse.startX = x
    this.mouse.startY = y
    if (this.isSimpleMode) {
      this.mouse.index = index
    }
    this.index = index
    return index
  }

  move (x, y) {
    const start = performance.now()

    if (!this.canDrag) {
      return
    }
    // 距离开始位置的偏移量
    const dy = y - this.mouse.originY
    const dx = x - this.mouse.originX

    this.setCopyPosition(x - this.mouse.startX, y - this.mouse.startY)
    this.mouse.startX = x
    this.mouse.startY = y

    if (this.canScrollBody || this.canScrollContainer) {
      this.scrollOnMove()
    }

    this.setNodes()
    let newX = this.copyPosition.centreX
    let newY = this.copyPosition.centreY

    // 节点位置是相对于文档的，但容器内滚动会改变相对于文档的位置
    // simple 下元素的位置只在最开始获取
    // 当容器发生滚动时，需要加上滚动的距离
    if (this.isSimpleMode && this.canScrollContainer) {
      newX += this.container.scrollLeft
      newY += this.container.scrollTop
    }

    this.event.emit('move', this.copyPosition)
    // 拖拽元素中心在另一个元素内
    const hint = this.hint(newX, newY)


    if (this.nodeCopy) {
      this.nodeCopy.style.transform = `translate(${dx}px,${dy}px)`
    }

    if (this.isSimpleMode) {
      if (hint === -1 || hint === this.mouse.index) {
        return
      }
    } else {
      if (hint === -1 || hint === this.index) {
        return
      }
      // 因为会在节点交换后，让新节点在原先位置，此时会触发事件，但不应该再次发生交换，所以不能正在交换的2个节点
      if (this.options.animation && hint === this.lastHint) {
        return
      }
    }

    this.setMoveInfo(this.index, hint)
    this.swapItem()
    if (this.isSimpleMode) {
      this.mouse.index = hint
    } else {
      // 移动节点后，hintNode索引会改变
      if (hint > this.index) {
        this.lastHint = hint - 1
      } else if (hint < this.index) {
        this.lastHint = hint + 1
      }
      this.index = hint
    }

    console.log(performance.now() - start)
  }

  end () {
    if (!this.canDrag) {
      return
    }
    this.isDragEnd = true
    if (this.nodeCopy) {
      this.nodeCopy.remove()
    }
    // 拖拽结束，但动画未结束，不触发节点交换
    if (this.isSimpleMode) {
      if (this.isMoveEnd && this.options.animation) {
        this.sortEndOnSimple()
      }
    } else {
      if (this.isMoveEnd) {
        this.sortEndOnComplex()
      }
    }
    this.event.emit('end')
  }

  swapItem () {
    if (this.isSimpleMode) {
      if (this.options.animation) {
        this.isMoveEnd = false
        this.animateSwap().then(() => {
          this.isMoveEnd = true
          // 如果动画结束，但拖拽没有结束，不触发节点交换
          if (this.isDragEnd) {
            this.sortEndOnSimple()
          }
        })
      } else {
        this.sortEndOnSimple()
      }
    } else {
      this.swapNode()
      if (this.options.animation) {
        this.isMoveEnd = false
        this.animateSwap().then(() => {
          // 动画结束后可与上一次hint元素hint
          this.lastHint = -1
          this.isMoveEnd = true
          if (this.isDragEnd) {
            this.sortEndOnComplex()
          }
        })
      }
    }
  }

  sortEndOnComplex () {
    console.log(this.moveInfo)
    this.resetDragNodeStyle()
    if (this.isRemovedNode) {
      this.nodes.splice(this.index, 1)
      this.nodes.forEach(el => {
        this.style(el, {
          transition: '',
          transform: ''
        })
      })
      this.removeData(this.index)
      this.isRemovedNode = false
    } else if (this.isAddNode) {
      this.addData(this.index, this.addedValue)
      this.isAddNode = false
    } else if (this.moveInfo.hintNode) {
      this.nodes.forEach(el => {
        this.style(el, {
          transition: '',
          transform: ''
        })
      })
      this.swapDataComplex()
    }
    this.moveInfo = null
  }

  sortEndOnSimple () {
    this.resetDragNodeStyle()
    if (this.moveInfo.hintNode === undefined) {
      return
    }
    const { dragIndex, hintIndex } = this.moveInfo

    this.swapNode()
    setTimeout(() => {
      if (hintIndex > dragIndex) {
        for (let i = dragIndex; i < hintIndex; i++) {
          [this.items[i].el, this.items[i + 1].el] = [
            this.items[i + 1].el,
            this.items[i].el
          ]
          this.items[i].position = this.getPostionInContainer(this.items[i].el)
          if (i === hintIndex - 1) {
            this.items[i + 1].position = this.getPostionInContainer(
              this.items[i + 1].el
            )
          }
        }
      } else if (hintIndex < dragIndex) {
        for (let i = dragIndex; i > hintIndex; i--) {
          [this.items[i].el, this.items[i - 1].el] = [
            this.items[i - 1].el,
            this.items[i].el
          ]
          this.items[i].position = this.getPostionInContainer(this.items[i].el)
          if (i === hintIndex - 1) {
            this.items[i - 1].position = this.getPostionInContainer(
              this.items[i - 1].el
            )
          }
        }
      }
    })

    this.items.forEach(item => {
      this.style(item.el, {
        transition: '',
        transform: ''
      })
    })

    this.index = hintIndex
    this.swapDataSerial()
    this.moveInfo = null
  }

  swapNode () {
    const { dragIndex, hintIndex, dragNode, hintNode } = this.moveInfo

    function insert (parent, newNode, refNode, before = true) {
      if (before) {
        parent.insertBefore(newNode, refNode)
      } else {
        const tempNode = document.createElement('div')

        parent.insertBefore(newNode, refNode)
        parent.replaceChild(tempNode, newNode)
        parent.replaceChild(newNode, refNode)
        parent.replaceChild(refNode, tempNode)
      }
    }

    if (this.grouped && this.hintInstance) {
      const parent = hintNode.parentNode

      dragNode.parentNode.removeChild(dragNode)
      insert(parent, dragNode, this.nodes[0])
      this.hintInstance.groupedDragNode = this.options.dragNode
      this.hintInstance.isRightNode = true
      this.hintInstance.copyPosition = this.copyPosition
      this.hintInstance.mouse = this.mouse
      this.hintInstance.index = 0
      // this.hintInstance.lastHint = hintIndex + 1
      // this.hintInstance.setMoveInfo(this.hintInstance.index, this.hintInstance.lastHint)
      // this.event.on('animationstart', () => {
      //   this.hintInstance.isMoveEnd = false
      // }, true)
      // this.event.on('animationend', () => {
      //   this.hintInstance.isMoveEnd = true
      // }, true)
      // this.event.on('end', () => {
      //   this.hintInstance.isDragEnd = true
      // }, true)
      this.hintInstance.isAddNode = true
      if (this.data) {
        this.hintInstance.addedValue = this.data[this.index]
      }

      this.isRemovedNode = true
      this.groupedDragNode = ''
      this.hintInstance = null

      return
    }
    if (hintIndex > dragIndex) {
      insert(this.container, dragNode, hintNode, false)
    } else if (hintIndex < dragIndex) {
      insert(this.container, dragNode, hintNode)
    }
  }

  animateSwap () {
    return new Promise(resolve => {
      // 当上一个动画未结束时，需要移除上一次的过渡完成事件
      if (this.moveInfo) {
        this.moveInfo.dragNode.removeEventListener(
          'transitionend',
          this.animateNodeEnd
        )
      }

      this.animateNodes()
      this.resolve = resolve

      // 所有动画的节点中，拖拽元素的动画总是是最后完成
      this.moveInfo.dragNode.addEventListener(
        'transitionend',
        this.animateNodeEnd
      )
    })
  }

  // 过渡结束触发
  animateNodeEnd = () => {
    this.moveInfo.dragNode.removeEventListener(
      'transitionend',
      this.animateNodeEnd
    )
    this.event.emit('animationend')
    this.resolve && this.resolve()
  };

  animateNodes () {
    this.event.emit('animationstart')
    if (this.isSimpleMode) {
      let swaptItems = []
      const transition = `transform ${this.options.duration}ms ease ${this.options.delay}ms`
      const { dragIndex, hintIndex, dragItem, dragNode } = this.moveInfo

      if (this.lastSwaptItems && this.lastSwaptItems.length) {
        this.lastSwaptItems.forEach(item => {
          this.style(item.el, {
            transition: transition,
            transform: 'translate(0,0px)'
          })
        })
      }

      let offsetX = 0
      let offsetY = 0

      if (this.direction === 'vertical') {
        if (hintIndex > dragIndex) {
          swaptItems = this.items.slice(dragIndex + 1, hintIndex + 1)
          offsetX = 0
          offsetY = dragItem.position.top - swaptItems[0].position.top
        } else if (dragIndex > hintIndex) {
          swaptItems = this.items.slice(hintIndex, dragIndex).reverse()
          offsetX = 0
          offsetY = dragItem.position.bottom - swaptItems[0].position.bottom
        }
      } else if (this.direction === 'horizontal') {
        if (hintIndex > dragIndex) {
          swaptItems = this.items.slice(dragIndex + 1, hintIndex + 1)
          offsetX = dragItem.position.left - swaptItems[0].position.left
          offsetY = 0
        } else if (dragIndex > hintIndex) {
          swaptItems = this.items.slice(hintIndex, dragIndex).reverse()
          offsetX = dragItem.position.right - swaptItems[0].position.right
          offsetY = 0
        }
      }

      swaptItems.forEach((item, index) => {
        // 其余元素移动的距离
        let distanceX = 0
        let distanceY = 0

        // 多行的情况下
        // 每行第一个移动到上一行最后一个
        // 每行最后一个移动到下一行第一个
        // 其他移动的等于该行第一个或最后一个元素与相临元素间距离
        if (
          (hintIndex > dragIndex && item.first) ||
          (hintIndex < dragIndex && item.last)
        ) {
          if (index === 0) {
            distanceX = dragItem.position.left - item.position.left
            distanceY = dragItem.position.top - item.position.top
          } else {
            distanceX =
              swaptItems[index - 1].position.left - item.position.left
            distanceY = swaptItems[index - 1].position.top - item.position.top
          }
          if (swaptItems[index + 1]) {
            if (this.direction === 'horizontal') {
              offsetX =
                item.position.left - swaptItems[index + 1].position.left
            } else if (this.direction === 'vertical') {
              offsetY = item.position.top - swaptItems[index + 1].position.top
            }
          }
        } else {
          distanceX = offsetX
          distanceY = offsetY
        }
        this.style(item.el, {
          transition: transition,
          transform: `translate(${distanceX}px,${distanceY}px)`
        })
      })

      this.lastSwaptItems = swaptItems
      this.style(dragNode, {
        transition: transition,
        transform: `translate(${this.moveInfo.dx}px,${this.moveInfo.dy}px)`
      })
    } else {
      this.nodes.forEach((node, index) => {
        if (index === this.moveInfo.dragIndex) {
          return
        }
        this.animateComplex(node, index, this.positions[index])
      })
      this.animateComplex(this.moveInfo.dragNode, this.moveInfo.dragIndex, this.positions[this.moveInfo.dragIndex])
      if (this.grouped && this.containerNodes) {
        this.containerNodes.forEach((node, index) => {
          this.animateComplex(node, index, this.containerNodesPositons[index])
        })
      }
    }
  }

  // directionX: dragNode 和 hintNode 之间的方向，正时 hintNode 在右边
  // ditanceX: 移动的距离
  animateComplex (el, index, position) {
    const transition = `transform ${this.options.duration}ms ease ${this.options.delay}ms`

    // 节点在文档中的位置改变后，为了准确获取改变后的位置信息
    this.style(el, {
      transition: '',
      transform: ''
    })
    const positionBefore = position
    // 获取位置信息，会强制引起重绘，所以这里能正确获取
    const positionNow = this.getPosition(el)

    if (index === 3) {
      console.log(el)

      console.log(positionBefore.left)
      console.log(positionNow.left)

    }

    if (
      positionBefore.left !== positionNow.left ||
      positionBefore.top !== positionNow.top
    ) {
      this.style(el, {
        transition: 'none',
        transform: `translate(${positionBefore.left -
          positionNow.left}px,${positionBefore.top - positionNow.top}px)`
      })
      // this.getPosition(el)
      // 在下一帧启用过渡
      // 我们需要的是 1.设置元素的 transform 2. 过渡回来原先位置
      // 这2步操作应该在 1 次重绘前后进行
      // setTimeout 是推入下一次的宏任务队列
      // 但浏览器的重绘不一定在每次的宏任务最后，
      // 重绘应该是浏览器设置，以一个默认周期去重绘，比如16.6ms，
      // 所以在使用 setTimeout 时，如果2次宏任务恰好在同一周期，1 、2步骤依然可能在一次重绘前进行

      // 解决方法
      // 1. 强制重绘，
      // 2. move事件节流，使用requestAnimationFrame。不能使用setTimeout节流
      setTimeout(() => {
        this.style(el, {
          transform: 'translate(0, 0)',
          transition: transition
        })
      })
    }
  }

  setNodes () {
    if (this.grouped) {
      this.instances.some(instance => {
        const pos = instance.containerPosition
        const { centreX: x, centreY: y } = this.copyPosition

        if (x > pos.left && x < pos.right && y > pos.top && y < pos.bottom) {
          this.nodes = instance.getNodes()
          this.containerNodes = this.getNodes()
          this.containerNodesPositons = this.containerNodes.map(node => {
            return this.getPosition(node)
          })
          if (instance !== this) {
            this.nodes.push(this.moveInfo.dragNode)
            this.index = this.nodes.length - 1
            this.hintInstance = instance
            return true
          }
        }
      })
      return
    }
    this.nodes = this.getNodes(this)
  }

  getNodes () {
    // const nodes = [...this.container.querySelectorAll(`.${this.options.dragNode}`)]
    const nodes = [...this.container.children].filter(node => {
      let can = node.className.includes(this.options.dragNode)

      if (this.grouped && this.groupedDragNode && !can) {
        can = node.className.includes(this.groupedDragNode)
      }
      return can
    })


    if (this.options.mode === 'complex') {
      if (this.nodeCopy) {
        this.nodes.pop()
      }
    }
    return nodes
  }

  setInstances (instances) {
    if (instances && instances.length) {
      this.instances = instances
      this.grouped = true
    }
  }

  hint (x, y) {
    if (this.isSimpleMode) {
      return this.items.findIndex(item => {
        const position = item.position

        return (
          x > position.left &&
          x < position.right &&
          y > position.top &&
          y < position.bottom
        )
      })
    }

    let hintIndex = -1

    this.positions = this.nodes.map((node, index) => {
      const position = this.getPosition(node)

      if (
        x > position.left &&
        x < position.right &&
        y > position.top &&
        y < position.bottom
      ) {
        hintIndex = index
      }

      return position
    })

    return hintIndex
  }

  setMoveInfo (current, hint) {
    if (this.isSimpleMode) {
      const hintObj = this.items[hint]
      const currentObj = this.items[current]
      let dx = 0
      let dy = 0

      if (hint > current) {
        dy = hintObj.position.bottom - currentObj.position.bottom
        dx = hintObj.position.right - currentObj.position.right
      } else if (hint < current) {
        dy = hintObj.position.top - currentObj.position.top
        dx = hintObj.position.left - currentObj.position.left
      }

      this.moveInfo = {
        dragItem: currentObj,
        hintItem: hintObj,
        dragNode: currentObj.el,
        hintNode: hintObj.el,
        dragIndex: current,
        hintIndex: hint,
        dx: dx,
        dy: dy
      }
    } else {
      this.moveInfo = {
        dragNode: this.nodes[current],
        hintNode: this.nodes[hint],
        dragIndex: current,
        hintIndex: hint
      }
    }
  }

  // 相对于文档的位置
  getPosition (node) {
    const scrollX = window.scrollX
    const scrollY = window.scrollY

    const cRect = node.getBoundingClientRect()
    const left = cRect.left + scrollX
    const top = cRect.top + scrollY
    const right = cRect.right + scrollX
    const bottom = cRect.bottom + scrollY
    const width = cRect.right - cRect.left
    const height = cRect.bottom - cRect.top

    return {
      left,
      right,
      bottom,
      top,
      centreX: left + width / 2,
      centreY: top + height / 2,
      width,
      height,
      viewLeft: cRect.left,
      viewRight: cRect.right,
      viewTop: cRect.top,
      viewBottom: cRect.bottom,
      viewCentreX: cRect.left + width / 2,
      viewCentreY: cRect.top + height / 2
    }
  }

  // 获取与容器滚动无关，且相对于文档的绝对位置
  getPostionInContainer (node) {
    const { scrollLeft, scrollTop } = this.container
    const position = this.getPosition(node);

    ['left', 'right', 'centreX'].forEach(item => {
      position[item] += scrollLeft
    });
    ['top', 'bottom', 'centreY'].forEach(item => {
      position[item] += scrollTop
    })
    return position
  }

  setNodeCopy (node) {
    const { left, top, width, height } = this.copyInitViewPosition

    this.nodeCopy = node.cloneNode(true)
    const style = {
      position: 'fixed',
      left: left + 'px',
      top: top + 'px',
      zIndex: 100,
      transformOrigin: '50% 50%',
      boxSizing: 'border-box',
      background: '#fff',
      opacity: 0.8,
      transition: 'none',
      width: width + 'px',
      height: height + 'px'
    }

    this.nodeCopy.classList.add('sort-copy')
    Object.assign(this.nodeCopy.style, style)
    this.container.appendChild(this.nodeCopy, node)
  }

  initCopyPostion (node) {
    const position = this.getPosition(node)

    // 初始相对于可视窗口的位置
    this.copyInitViewPosition = {
      left: position.viewLeft,
      top: position.viewTop,
      right: position.viewRight,
      bottom: position.viewBottom,
      centreX: position.viewCentreX,
      centreY: position.viewCentreY,
      width: position.width,
      height: position.height
    }

    this.copyPosition = {
      left: position.left,
      top: position.top,
      right: position.right,
      bottom: position.bottom,
      centreX: position.centreX,
      centreY: position.centreY,
      width: position.width,
      height: position.height
    }
  }

  setCopyPosition (dx, dy) {
    // 与容器滚动无关，相对于文档的位置
    this.copyPosition = {
      left: this.copyPosition.left + dx,
      right: this.copyPosition.right + dx,
      top: this.copyPosition.top + dy,
      bottom: this.copyPosition.bottom + dy,
      centreX: this.copyPosition.centreX + dx,
      centreY: this.copyPosition.centreY + dy,
      width: this.copyPosition.width,
      height: this.copyPosition.height
    }
  }

  setBodyPosition () {
    const { scrollX, scrollY } = window

    this.bodyPosition = {
      left: 0 + scrollX,
      top: 0 + scrollY,
      right: document.documentElement.clientWidth + scrollX,
      bottom: document.documentElement.clientHeight + scrollY
    }
  }

  checkContainerScroll () {
    this.canScrollContainer = checkNodeCanScroll(this.container)
  }

  checkBodyScroll () {
    this.canScrollBody = checkPageCanScroll()
  }

  initScrollInfo () {
    this.checkContainerScroll()
    // 相对于文档的位置
    this.containerPosition = this.getPosition(this.container)
    this.checkBodyScroll()
    if (this.canScrollBody) {
      // 视口相对于文档的位置
      this.setBodyPosition()
    }
  }

  scrollRelative (el, x, y) {
    el.scrollLeft += x
    el.scrollTop += y
  }

  // 鼠标距离开始地方移动的距离dx dy（不包含滚动条)
  scrollOnMove () {
    const { left, top, right, bottom } = this.copyPosition
    const piece = 20

    const scroll = (el, edge) => {
      // console.log(edge)
      if (left <= edge.left) {
        console.log('s1')
        this.scrollRelative(el, -piece, 0)
      } else if (right >= edge.right) {
        console.log('s2')
        this.scrollRelative(el, piece, 0)
      } else if (top <= edge.top) {
        console.log('s3')
        this.scrollRelative(el, 0, -piece)
      } else if (bottom >= edge.bottom) {
        console.log('s4')
        this.scrollRelative(el, 0, piece)
      }
    }

    // 暂时只能container造成body scroll或者container scroll但不造成body scroll
    if (this.canScrollContainer) {
      scroll(this.container, this.containerPosition)
      // const padding = 10
      // if (left + dx < this.containerPosition.left - padding) {
      //   console.log('s1')
      //   this.animateScrollRelative(this.container, -300, 0)
      // } else if (right + dx > this.containerPosition.right - padding) {
      //   console.log('s2')
      //   this.animateScrollRelative(this.container, 300, 0)
      // } else if (top + dy < this.containerPosition.top - padding) {
      //   console.log('s3')
      //   this.animateScrollRelative(this.container, 0, -300)
      // } else if (bottom + dy > this.containerPosition.bottom - padding) {
      //   console.log('s4')
      //   this.animateScrollRelative(this.container, 0, 300)
      // }
    } else if (this.canScrollBody) {
      const oldScrollX = window.scrollX
      const oldScrollY = window.scrollY

      scroll(document.documentElement, this.bodyPosition)
      this.setCopyPosition(scrollX - oldScrollX, scrollY - oldScrollY)
      this.setBodyPosition()
    }
  }

  animateScrollRelative (el, x, y, duration = 300) {
    const timeout = 10
    const dx = Math.ceil((x / duration) * timeout)
    const dy = Math.ceil((y / duration) * timeout)
    let remain = 0
    let d = 0

    if (x !== 0) {
      remain = x
      d = dx
    } else if (y !== 0) {
      remain = y
      d = dy
    }

    this.isScroll = true
    const animate = () => {
      if (remain <= 0) {
        this.isScroll = false
        return
      }
      this.scrollRelative(el, dx, dy)
      remain -= d
      setTimeout(() => {
        animate()
      }, timeout)
    }

    animate()
  }

  setDragNodeStyle () {
    const { dragNode } = this.moveInfo

    if (!dragNode) {
      return
    }

    if (this.options.dragClass) {
      dragNode.classList.remove(this.options.dragClass)
    } else {
      dragNode.style.opacity = 0.6
      dragNode.style.background = '#c8ebfb'
    }
  }

  resetDragNodeStyle () {
    const { dragNode } = this.moveInfo

    if (!dragNode) {
      return
    }

    if (this.options.dragClass) {
      dragNode.classList.add(this.options.dragClass)
    } else {
      dragNode.style.opacity = 1
      dragNode.style.background = ''
    }
  }

  getParentByClass (node, pClass) {
    if (!node) {
      return null
    }
    if (node.className && node.className.includes(pClass)) {
      return node
    }
    return this.getParentByClass(node.parentNode, pClass)
  }

  swapData (current, hint) {
    [this.data[current], this.data[hint]] = [
      this.data[hint],
      this.data[current]
    ]
  }

  checkNode (node) {
    // 拖拽子节点时，往上寻找 sort-cell 节点
    let dragNode = null

    dragNode = this.getParentByClass(node, this.options.dragNode)

    if (!dragNode) {
      this.isRightNode = false
      if (this.grouped) {
        this.instances.forEach(instance => {
          instance.isRightNode = false
        })
      }
    } else {
      this.isRightNode = true
      if (this.grouped) {
        this.instances.forEach(instance => {
          instance.isRightNode = true
        })
      }
    }
    return dragNode
  }

  swapDataSerial () {
    if (!this.data || !this.moveInfo) {
      return
    }

    const { dragIndex, hintIndex } = this.moveInfo
    const dragItem = this.data.splice(dragIndex, 1)[0]

    // 删除后，hintIndex 代表的元素已经代表原先的下一个
    // hintIndex 前面添加
    this.data.splice(hintIndex, 0, dragItem)
  }

  swapDataComplex () {
    if (!this.data || !this.moveInfo) {
      return
    }

    const firstIndex = this.nodeInitPos.index
    const { hintIndex } = this.moveInfo
    const dragItem = this.data.splice(firstIndex, 1)[0]

    // 删除后，hintIndex 代表的元素已经代表原先的下一个
    // hintIndex 前面添加
    this.data.splice(hintIndex, 0, dragItem)
  }


  removeData (index) {
    if (!this.data) {
      return
    }
    this.data.splice(index, 1)
  }

  addData (index, value) {
    if (!this.data) {
      return
    }
    this.data.splice(index, 0, value)
  }

  style (el, styles) {
    Object.assign(el.style, styles)
  }

  getData () {
    return this.data
  }

  setData (data) {
    this.data = data
  }

  sort (start, end) {
    if (
      start < 0 ||
      start > this.items.length ||
      end < 0 ||
      end > this.items.length
    ) {
      return
    }
    this.setMoveInfo(start, end)
    this.setDragNodeStyle()
    this.swapItem()
  }

  destroy () {
    this.removeListener()
    if (this.isMobile) {
      this.items.forEach(item => {
        item.el.draggable = false
        item.el.dataset.sortIndex = ''
      })
    }
  }
}

window.Sorter = Sorter
// export default Sorter
