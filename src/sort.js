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
  index = -1;
  count = 0;
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
    if (!this.onEvents[name] || !this.onEvents[name].length) {
      return
    }
    this.onEvents[name] = this.onEvents[name].filter((event, index) => {
      let flag = true

      // 在emit的回调中，可能会off事件
      if (event.callback === callback) {
        flag = false
        if (index <= this.index && name === this.name) {
          this.count++
        }
      }

      return flag
    })
  }

  emit (name) {
    if (!this.onEvents[name] || !this.onEvents[name].length) {
      return
    }

    const params = [...arguments].slice(1)

    this.name = name

    for (let i = 0; i < this.onEvents[name].length; i++) {
      const event = this.onEvents[name][i]

      // 需要先判断是否为一次性事件，移除
      // 以防在事件回调中继续触发当前事件时即使是一次性事件也会执行多次
      if (event.once) {
        this.onEvents[name].splice(i, 1)
        i--
      }
      // 记录此时的index，如果回调中off事件，需要记录off的小于等于这个index的个数
      this.index = i
      event.callback(...params)
      i -= this.count
      this.count = 0
    }
    this.count = 0
    this.index = -1
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
      way: 'mouse',
      // 拖拽不能超出边界
      animation: true,
      duration: 200,
      delay: 0,
      dragNode: 'sort-cell',
      dragClass: '',
      group: {
        clone: true,
        put: true
      },
      sort: true,
      ...initOptions
    }
    this.event = new Event()
    // this.data = _.cloneDeep(data)
    this.data = data
  }

  static group () {
    const instances = [...arguments]
    let cloned = false
    let cloneInfo = {
      instance: null,
      node: null,
      index: -1
    }
    let firstInstance = null

    let animationend = false
    let dragend = false
    let dragInstance = null
    let hintInstance = null
    let isResetNode = true
    // 切换排序列表后，第一次拖拽结束执行
    const reset = () => {
      cloned = false
      firstInstance = null
      if (isResetNode) {
        hintInstance.resetDragNodeStyle()
        hintInstance.resetNodesTransitionStyle()
        hintInstance.canDrag = true
      }

      dragInstance.isMoveEnd = hintInstance.isMoveEnd = true
      dragInstance.isDragEnd = hintInstance.isDragEnd = true
      dragInstance.hasNodeCopy = hintInstance.hasNodeCopy = false
      cloneInfo = {
        instance: null,
        node: null,
        index: -1
      }
      hintInstance.off('animationend', handleAnimationEnd)
      hintInstance.off('animationstart', handleAnimationStart)
    }

    const handleAnimationStart = () => {
      animationend = false
    }

    const handleAnimationEnd = () => {
      animationend = true
      if (dragend) {
        reset()
      }
    }

    const handleDragEnd = () => {
      dragend = true
      if (animationend) {
        reset()
      }
    }

    const handleChange = () => {
      isResetNode = false
    }

    const addEndEvent = (dinstance, htInstance) => {
      dragInstance = dinstance
      hintInstance = htInstance
      animationend = false
      dragend = false
      isResetNode = true

      dragInstance.off('animationend', handleAnimationEnd)
      dragInstance.off('dragend', handleDragEnd)

      hintInstance.on('animationend', handleAnimationEnd)
      hintInstance.on('animationstart', handleAnimationStart)
      hintInstance.on('dragend', handleDragEnd, true)
      hintInstance.on('change', handleChange, true)
    }

    const handleMove = dragInstance => {
      return function (position) {
        instances.some(hintInstance => {
          const { centreX: x, centreY: y } = position

          if (hintInstance.checkInContainer(x, y)) {
            if (hintInstance !== dragInstance) {

              let ingore = false
              let put = true

              if (
                hintInstance.options.group &&
                !hintInstance.options.group.put
              ) {
                ingore = true
                put = false
              }

              if (hintInstance === firstInstance && cloned) {
                ingore = false
              }

              if (ingore) {
                return true
              }

              firstInstance = firstInstance || dragInstance
              const nodes = hintInstance.getNodes()
              let hintIndex = -1

              nodes.forEach((node, index) => {
                const position = hintInstance.getPosition(node)

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

              if (hintIndex === -1) {
                return true
              }

              const { dragNode } = dragInstance.moveInfo
              const dragInstanceIndex = dragInstance.index
              let index = hintIndex + 1
              let lastHint = hintIndex
              // dragNode 是否动画移动结束
              let isMoveEnd = false
              const position = dragInstance.getPosition(dragNode)
              const positionsBefore = dragInstance.getPositions(
                dragInstance.getNodes()
              )

              let dragNodeCopy = dragNode

              if (put) {
                if (cloned) {
                  if (hintInstance === firstInstance) {
                    hintInstance
                      .start()
                      .removeNode(cloneInfo.index)
                      .addNode({
                        index: hintIndex + 1,
                        node: dragNode,
                        position
                      })
                      .end(true)
                    // hint前会移除copy元素，所以lastHint代表的索引减1
                    if (hintIndex > cloneInfo.index) {
                      index = hintIndex
                      lastHint = hintIndex - 1
                      // 不移除copy元素，index在hint的下一个元素
                    } else if (hintIndex < cloneInfo.index) {
                      index = hintIndex + 1
                      lastHint = hintIndex
                    } else {
                      index = hintIndex
                    }
                    positionsBefore.splice(dragInstanceIndex, 1)
                  }
                } else {
                  hintInstance.addNodeAnimated({
                    index: hintIndex + 1,
                    newNode: dragNode,
                    position
                  })
                  positionsBefore.splice(dragInstanceIndex, 1)
                }
              } else {
                if (cloned) {
                  if (hintInstance === firstInstance) {
                    hintInstance
                      .start()
                      .removeNode(cloneInfo.index)
                      .addNode({
                        index: cloneInfo.index,
                        node: dragNode
                      })
                      .end()
                    index = hintInstance.index
                    positionsBefore.splice(dragInstanceIndex, 1)
                    hintInstance.resetTransitionStyle(dragNode)
                    isMoveEnd = true
                  }
                }
              }

              if (
                firstInstance.options.group &&
                firstInstance.options.group.clone
              ) {
                if (!cloned) {
                  // 记录copy的初始位置
                  const copyPosition = dragInstance.getPosition(dragNode)

                  dragNodeCopy = dragNode.cloneNode(true)
                  dragInstance.resetDragStyle(dragNodeCopy)
                  dragInstance.addNode(dragInstanceIndex, dragNodeCopy)
                  dragInstance.animateComplex(dragNodeCopy, copyPosition)
                  cloneInfo = {
                    instance: dragInstance,
                    node: dragNodeCopy,
                    index: dragInstanceIndex
                  }
                  cloned = true
                } else {
                  dragInstance.animateNodesDiffPos(
                    dragInstance.getNodes(),
                    positionsBefore
                  )
                }
              } else {
                dragInstance.animateNodesDiffPos(
                  dragInstance.getNodes(),
                  positionsBefore
                )
              }

              if (hintInstance === firstInstance && cloned) {
                cloned = false
              }

              dragInstance.isRightNode = false
              // 设置hint实例状态，因为不会触发hint实例的start事件，直接触发move事件
              hintInstance.isRightNode = true
              hintInstance.copyPosition = dragInstance.copyPosition
              hintInstance.mouse = dragInstance.mouse
              hintInstance.nodeInitPos = {
                index
              }
              if (dragInstance.nodeCopy) {
                hintInstance.nodeCopy = dragInstance.nodeCopy
              }
              hintInstance.moveInfo = {
                dragNode: dragNode,
                dragIndex: index
              }
              hintInstance.index = index
              hintInstance.lastHint = lastHint
              dragInstance.isMoveEnd = hintInstance.isMoveEnd = isMoveEnd
              hintInstance.isDragEnd = false
              // 兼容鼠标离开浏览器后不响应mouseup事件
              if (dragInstance.options.way === 'mouse') {
                if (dragInstance.isMouseLeft) {
                  dragInstance.isMouseLeft = false
                  hintInstance.isMouseLeft = true
                }
                hintInstance.addNode(10000, dragInstance.nodeCopy)
                hintInstance.hasNodeCopy = true

                dragInstance.nodeCopy = null
                dragInstance.hasNodeCopy = false
              }

              // 如果只是插入到第一个hint的节点之后，不移动的话不会再触发move事件，需要手动在动画或拖拽结束时复原拖拽节点样式
              addEndEvent(dragInstance, hintInstance)

              return true
            }
          }
        })
      }
    }

    const moveFuns = []

    const groupDragNodes = []

    instances.forEach(instance => {
      groupDragNodes.push(instance.options.dragNode)
    })
    instances.forEach((instance, index) => {
      moveFuns[index] = handleMove(instance)
      instance.groupDragNodes = groupDragNodes
      instance.on('outcontaner', moveFuns[index])
    })
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
      const firstNodePos = this.getPosition(this.nodes[0])
      const secondNodePos = this.getPosition (this.nodes[1])

      if (
        secondNodePos.left !== firstNodePos.left &&
        secondNodePos.top === firstNodePos.top
      ) {
        this.direction = 'horizontal'
      } else if (
        secondNodePos.top !== firstNodePos.top &&
        secondNodePos.left === firstNodePos.left
      ) {
        this.direction = 'vertical'
      } else {
        this.direction = 'mixin'
      }
    }

    this.initScrollInfo()
    this.throttleTouchMove = throttle(this.touchMove)
    this.throttleDrag = throttle(this.drag)
    this.throttleMouseMove = throttle(this.mouseMove)
    this.setSupportsPassive()
    this.addlistener()
  }

  addlistener () {
    // 对container监听的话，移出container外会出现不灵敏的卡顿现象
    if (this.isMobile) {
      this._on(this.container, 'touchstart', this.touchStart)
      this._on(this.container, 'touchmove', this.throttleTouchMove)
      // this._on(this.container, 'touchmove', this.touchMove)
      this._on(this.container, 'touchend', this.touchEnd)
    } else {
      // this._on(document.body, 'dragstart', this.dragStart)
      // this._on(document.body, 'drag', this.throttleDrag)
      // this._on(document.body, 'dragend', this.dragEnd)
      if (this.options.way === 'drag') {
        this._on(this.container, 'dragstart', this.dragStart)
        this._on(this.container, 'drag', this.throttleDrag)
        this._on(this.container, 'dragend', this.dragEnd)
        this._on(this.container, 'dragover', this.dragOver)
      } else {
        this._on(document.body, 'mousedown', this.mouseDown)
        this._on(document.body, 'mousemove', this.throttleMouseMove)
        // this._on(document.body, 'mousemove', this.mouseMove)
        this._on(document.body, 'mouseleave', this.mouseLeave)
        this._on(document.body, 'mouseup', this.mouseUp)
      }
    }
  }

  removeListener () {
    if (this.isMobile) {
      this._off(this.container, 'touchstart', this.touchStart)
      this._off(this.container, 'touchmove', this.throttleTouchMove)
      this._off(this.container, 'touchend', this.touchEnd)
    } else {
      // this._off(document.body, 'dragstart', this.dragStart)
      // this._off(document.body, 'drag', this.throttleDrag)
      // this._off(document.body, 'dragend', this.dragEnd)
      if (this.options.way === 'drag') {
        this._off(this.container, 'dragstart', this.dragStart)
        this._off(this.container, 'drag', this.throttleDrag)
        this._off(this.container, 'dragend', this.dragEnd)
      } else {
        this._off(document.body, 'mousedown', this.mouseDown)
        this._off(document.body, 'mousemove', this.throttleMouseMove)
        this._off(document.body, 'mouseleave', this.mouseLeave)
        this._off(document.body, 'mouseup', this.mouseUp)
      }
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

  off (name, callback) {
    this.event.off(name, callback)
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

    const index = this._start(dragNode, e.clientX, e.clientY)

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

    // e.clientX和e.clientY突然出现一瞬间的0 0
    // console.log('clientX：' + e.clientX + '；' + 'clientY：' + e.clientY)

    this._move(e.clientX, e.clientY)
  };

  dragEnd = () => {
    if (!this.isRightNode) {
      return
    }
    this._end()
  };

  dragOver (ev) {
    ev.preventDefault()
  }

  mouseDown = event => {
    if (event.button !== 0) {
      return
    }


    event.preventDefault()
    const node = event.target
    const dragNode = this.checkNode(node)


    // 鼠标移出浏览器时不会触发mouseup事件，此时进入浏览器点击鼠标左键需要执行上一次的end

    if (!this.isRightNode) {
      return
    }
    if (this.isMouseLeft) {
      this._end()
      return
    }
    const index = this._start(dragNode, event.clientX, event.clientY)

    if (index < 0) {
      return
    }
    this.setDragNodeStyle()
    this.setNodeCopy(dragNode)
  };

  mouseMove = event => {
    if (!this.isRightNode || !this.nodeCopy) {
      return
    }

    this._move(event.clientX, event.clientY)
  };


  mouseLeave = () => {
    if (!this.isRightNode) {
      return
    }
    // 只有存在copy元素才算离开过
    if (this.nodeCopy) {
      this.isMouseLeft = true
    }
  }

  mouseUp = () => {
    if (!this.isRightNode) {
      return
    }

    this._end()
    // 即使mouseup触发  mousemove还是会触发
    this.isRightNode = false
    this.isMouseLeft = false
  };

  touchStart = event => {
    event.preventDefault()
    const touch = event.targetTouches[0]
    const node = touch.target
    const dragNode = this.checkNode(node)

    if (!this.isRightNode) {
      return
    }

    const index = this._start(dragNode, touch.clientX, touch.clientY)

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

    this._move(touch.clientX, touch.clientY)
  };

  touchEnd = () => {
    if (!this.isRightNode) {
      return
    }
    this._end()
  };

  _start (node, x, y) {
    // 即使end事件触发，但动画也可能正在进行
    // 只有动画完毕才可以拖拽
    if (!this.isMoveEnd) {
      this.canDrag = false
      return -1
    }

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
      dragNode: node,
      dragIndex: index
    }


    this.mouse.originX = x
    this.mouse.originY = y
    this.mouse.startX = x
    this.mouse.startY = y
    if (this.isSimpleMode) {
      this.mouse.index = index
    }
    this.index = index
    this.event.emit('dragstart')
    return index
  }

  _move (x, y) {
    if (!this.canDrag) {
      return
    }
    const start = performance.now()

    // 距离开始位置的偏移量
    const offsety = y - this.mouse.originY
    const offsetx = x - this.mouse.originX

    const dx = x - this.mouse.startX
    const dy = y - this.mouse.startY

    if (dx === 0 && dy === 0) {
      return
    }

    this.setCopyPosition(dx, dy)
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

    if (this.nodeCopy) {
      this.nodeCopy.style.transform = `translate(${offsetx}px,${offsety}px)`
    }

    this.event.emit('dragmove', this.copyPosition)
    // 不在容器内
    if (
      !this.checkInContainer(
        this.copyPosition.centreX,
        this.copyPosition.centreY
      )
    ) {
      this.event.emit('outcontaner', this.copyPosition)
      return
    }

    if (!this.options.sort) {
      return
    }

    // 拖拽元素中心在另一个元素内
    const hint = this.hint(newX, newY)


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
    this.event.emit('change', this.moveInfo)

    console.log('total:' + (performance.now() - start))
  }

  _end () {
    if (!this.canDrag) {
      return
    }
    this.isDragEnd = true
    if (this.nodeCopy) {
      this.nodeCopy.remove()
      this.nodeCopy = null
      this.hasNodeCopy = false
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
    this.event.emit('dragend')
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
    if (!this.moveInfo) {
      return
    }
    this.canDrag = true
    this.resetDragNodeStyle()
    if (this.moveInfo.hintNode) {
      this.resetNodesTransitionStyle()
      this.swapDataComplex()
      this.nodeInitPos = null
    }
    this.moveInfo = null
  }

  sortEndOnSimple () {
    if (!this.moveInfo) {
      return
    }
    this.canDrag = true
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
      this.resetTransitionStyle(item.el)
    })

    this.index = hintIndex
    this.swapDataSerial()
    this.moveInfo = null
  }

  insertNode (newNode, refNode, before = true) {
    const parentNode = refNode.parentNode

    if (before) {
      parentNode.insertBefore(newNode, refNode)
    } else {
      const tempNode = document.createElement('div')

      parentNode.insertBefore(newNode, refNode)
      parentNode.replaceChild(tempNode, newNode)
      parentNode.replaceChild(newNode, refNode)
      parentNode.replaceChild(refNode, tempNode)
    }
  }

  swapNode () {
    const { dragIndex, hintIndex, dragNode, hintNode } = this.moveInfo

    if (hintIndex > dragIndex) {
      this.insertNode(dragNode, hintNode, false)
    } else if (hintIndex < dragIndex) {
      this.insertNode(dragNode, hintNode)
    }
  }

  animateSwap () {
    return new Promise(resolve => {
      this.animateNodes()
      this.emitAnimationEvent(this.moveInfo.dragNode)
      this.resolve = resolve
    })
  }

  animateNodes () {
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
      // this.nodes.forEach((node, index) => {
      //   if (index === this.moveInfo.dragIndex) {
      //     return
      //   }
      //   this.animateComplex(node, this.positions[index])
      // })
      // this.animateComplex(
      //   this.moveInfo.dragNode,
      //   this.positions[this.moveInfo.dragIndex]
      // )
      this.animateNodesDiffPos(this.nodes, this.positions)
    }
  }

  animateNodesDiffPos (nodes, positionsBefore) {
    // 先将全部节点过渡取消
    nodes.forEach(el => {
      // 节点在文档中的位置改变后，为了准确获取改变后的位置信息
      this.resetTransitionStyle(el)
    })

    // 再获取现在的位置
    // 因为获取位置时会重绘制，如果取消一个节点过渡，就离开获取位置，那么会重绘n次
    // 这样虽然遍历次数增加一倍，但重绘制只有一次，性能提高很多
    const positionsNow = this.getPositions(nodes)

    // 最后对2次的位置进行过渡动画
    nodes.forEach((node, index) => {
      this.animateDiffPos(node, positionsBefore[index], positionsNow[index])
    })
  }

  animateDiffPos (el, positionBefore, positionNow) {
    const transition = `transform ${this.options.duration}ms ease ${this.options.delay}ms`

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
      this.lastAnimateNode = el
    }
  }

  // directionX: dragNode 和 hintNode 之间的方向，正时 hintNode 在右边
  // ditanceX: 移动的距离
  animateComplex (el, position) {
    const transition = `transform ${this.options.duration}ms ease ${this.options.delay}ms`

    // 节点在文档中的位置改变后，为了准确获取改变后的位置信息
    this.resetTransitionStyle(el)
    const positionBefore = position
    // 获取位置信息，会强制引起重绘，所以这里能正确获取
    const positionNow = this.getPosition(el)

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
      requestAnimationFrame(() => {
        this.style(el, {
          transform: 'translate(0, 0)',
          transition: transition
        })
      })
      this.lastAnimateNode = el
    }
  }

  setNodes () {
    this.nodes = this.getNodes()
  }

  getNodes () {
    // const nodes = [...this.container.querySelectorAll(`.${this.options.dragNode}`)]
    const nodes = [...this.container.children].filter(node => {
      if (this.groupDragNodes && this.groupDragNodes.length) {
        return this.groupDragNodes.some(item => {
          return node.className.includes(item)
        })
      }

      return node.className.includes(this.options.dragNode)
    })

    if (this.options.mode === 'complex') {
      if (this.hasNodeCopy) {
        nodes.pop()
      }
    }
    return nodes
  }

  setPostions () {
    this.positions = this.getPositions(this.nodes)
  }

  getPositions (nodes) {
    return nodes.map(node => {
      return this.getPosition(node)
    })
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
    let isHintIndex = false
    let isDragIndex = false
    const piece = 0

    this.setPostions()
    this.positions.forEach((position, index) => {
      if (
        x > position.left + piece &&
        x < position.right - piece &&
        y > position.top + piece &&
        y < position.bottom - piece
      ) {
        // 多行时，处于换行动画的元素不hint
        // 如果hint，会发生和预期不同的交换结果
        if (
          this.direction === 'horizontal' &&
          this.positions[index - 1] &&
          this.positions[index + 1] &&
          position.top !== this.positions[index + 1].top &&
          position.top !== this.positions[index - 1].top
        ) {
          return
        }
        if (
          this.direction === 'vertical' &&
          this.positions[index - 1] &&
          this.positions[index + 1] &&
          position.left !== this.positions[index + 1].left &&
          position.left !== this.positions[index - 1].left
        ) {
          return
        }
        // 元素重叠时，正在drag和hint的优先
        if (index === this.moveInfo.dragIndex) {
          isDragIndex = true
        } else if (index === this.moveInfo.hintIndex) {
          isHintIndex = true
        } else {
          hintIndex = index
        }
      }
    })

    if (isHintIndex) {
      return this.moveInfo.hintIndex
    }

    if (isDragIndex) {
      return this.moveInfo.dragIndex
    }

    return hintIndex
  }

  checkInContainer (x, y) {
    const pos = this.containerPosition

    return x > pos.left && x < pos.right && y > pos.top && y < pos.bottom
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
      background: '#c8ebfb',
      opacity: 0.8,
      transition: 'none',
      width: width + 'px',
      height: height + 'px'
    }

    this.nodeCopy.classList.add('sort-copy')
    this.hasNodeCopy = true
    Object.assign(this.nodeCopy.style, style)
    this.container.appendChild(this.nodeCopy)
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
    if (this.canScrollBody) {
      // 由容器造成的页面滚动
      if (
        this.containerPosition.bottom <= document.documentElement.clientHeight
      ) {
        this.canScrollBody = false
      }
    }
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
      return new Promise(resolve => {
        // console.log(edge)
        if (left <= edge.left) {
          resolve()
          this.scrollRelative(el, -piece, 0)
        } else if (right >= edge.right) {
          resolve()
          this.scrollRelative(el, piece, 0)
        } else if (top <= edge.top) {
          resolve()
          this.scrollRelative(el, 0, -piece)
        } else if (bottom >= edge.bottom) {
          resolve()
          this.scrollRelative(el, 0, piece)
        }
      })
    }

    // 暂时只能container造成body scroll或者container scroll但不造成body scroll
    if (this.canScrollContainer) {
      scroll(this.container, this.containerPosition)
    } else if (this.canScrollBody) {
      scroll(document.documentElement, this.bodyPosition).then(() => {
        // 重绘是昂贵的
        const oldScrollX = window.scrollX
        const oldScrollY = window.scrollY

        this.setCopyPosition(scrollX - oldScrollX, scrollY - oldScrollY)
        this.setBodyPosition()
      })
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
      dragNode.style.zIndex = 10
      dragNode.style.position = 'relative'
    }
  }

  resetDragNodeStyle () {
    const { dragNode } = this.moveInfo

    if (!dragNode) {
      return
    }

    this.resetDragStyle(dragNode)
  }

  resetDragStyle (node) {
    if (this.options.dragClass) {
      node.classList.add(this.options.dragClass)
    } else {
      node.style.opacity = ''
      node.style.background = ''
      node.style.zIndex = ''
      node.style.position = ''
    }
  }

  resetNodesTransitionStyle () {
    this.nodes.forEach(node => {
      this.resetTransitionStyle(node)
    })
  }

  resetTransitionStyle (node) {
    this.style(node, {
      transition: '',
      transform: ''
    })
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

    if (this.groupDragNodes && this.groupDragNodes.length) {
      this.groupDragNodes.some(item => {
        dragNode = this.getParentByClass(node, item)
        return dragNode
      })
    } else {
      dragNode = this.getParentByClass(node, this.options.dragNode)
    }

    if (!dragNode || dragNode.parentNode !== this.container) {
      this.isRightNode = false
    } else {
      this.isRightNode = true
    }
    return dragNode
  }

  swapDataSerial () {
    if (!this.data || !this.moveInfo) {
      return
    }

    const { dragIndex, hintIndex } = this.moveInfo

    this.sortData(this.data, dragIndex, hintIndex)
  }

  swapDataComplex () {
    if (!this.data || !this.moveInfo || !this.nodeInitPos) {
      return
    }

    const firstIndex = this.nodeInitPos.index
    const { hintIndex } = this.moveInfo

    this.sortData(this.data, firstIndex, hintIndex)
  }

  sortData (data, start, end) {
    if (!data || !data.length) {
      return
    }
    const dragItem = this.data.splice(start, 1)[0]

    // 如果 end > start，删除后，end 代表的元素已经代表原先的下一个
    // end 前面添加
    data.splice(end, 0, dragItem)
  }

  emitAnimationEvent (node) {
    return new Promise(resolve => {
      this.event.emit('animationstart')
      node.removeEventListener('transitionend', this.animateNodeEnd)
      node.addEventListener('transitionend', this.animateNodeEnd)
      this.animatedNode = node
      this.resolve = resolve
    })
  }

  // 过渡结束触发
  animateNodeEnd = () => {
    this.animatedNode.removeEventListener('transitionend', this.animateNodeEnd)
    // 触发end的条件，拖拽元素有发生交换，拖拽元素有动画
    this.event.emit('animationend')
    this.resolve && this.resolve()
  };

  start () {
    const nodes = this.getNodes()
    const positions = this.getPositions(nodes)
    const that = this
    const fills = []
    let lastAddNode = null
    let addCount = 0

    fills.length = positions.length
    fills.fill[1]

    let addNodeChanin = null
    let removeNodeChain = null

    const end = function (animation = false) {
      if (animation) {
        const nodes = that.getNodes()

        that.animateNodesDiffPos(nodes, positions)
        that.emitAnimationEvent(lastAddNode || that.lastAnimateNode)
      }
    }

    removeNodeChain = function (index) {
      if (fills[index] === 0) {
        return {
          removeNode: removeNodeChain,
          addNode: addNodeChanin,
          end
        }
      }

      let mindex = index

      for (let i = 0; i < index + addCount; i++) {
        if (fills[i] === 0) {
          mindex--
        } else if (fills[i] === 2) {
          mindex++
        }
      }

      const { index: cindex, node } = that.removeNode(mindex)

      if (cindex >= 0) {
        positions.splice(cindex, 1)
        fills.splice(index, 1, 0)
      }
      return {
        removeNode: removeNodeChain,
        addNode: addNodeChanin,
        end
      }
    }

    addNodeChanin = function ({ index, node, value, position, callback }) {
      let mindex = index

      for (let i = 0; i < index + addCount; i++) {
        if (fills[i] === 0) {
          mindex--
        } else if (fills[i] === 2) {
          mindex++
        }
      }

      const { index: cindex, node: cnode } = that.addNode(mindex, node, value)

      if (cindex >= 0) {
        positions.splice(cindex, 0, position || that.getPosition(cnode))
        fills.splice(index, 0, 2)
        addCount++
        lastAddNode = node
      }
      if (callback) {
        callback(cindex, cnode)
      }

      return {
        removeNode: removeNodeChain,
        addNode: addNodeChanin,
        end
      }
    }

    return {
      removeNode: removeNodeChain,
      addNode: addNodeChanin
    }
  }

  // 删除节点
  removeNode (index) {
    if (!Number.isInteger(index)) {
      return
    }

    const nodes = this.getNodes()
    let curIndex = index

    curIndex = this.limitNumber(index, 0, nodes.length - 1)
    this.container.removeChild(nodes[curIndex])

    this.removeData(curIndex)

    this.event.emit('removed', {
      index: curIndex,
      node: nodes[curIndex]
    })
    return {
      index: curIndex,
      node: nodes[curIndex]
    }
  }

  removeNodeAnimated (index) {
    if (!Number.isInteger(index)) {
      return
    }

    const nodes = this.getNodes()
    let curIndex = index

    curIndex = this.limitNumber(index, 0, nodes.length - 1)

    const beforePostions = this.getPositions(nodes)

    this.container.removeChild(nodes[curIndex])
    this.animateNodesDiffPos(nodes, beforePostions)
    this.emitAnimationEvent(this.lastAnimateNode).then(() => {
      this.removeData(curIndex)
      this.event.emit('removed', {
        index: curIndex,
        node: nodes[curIndex]
      })
    })
  }

  removeData (index) {
    if (!this.data) {
      return
    }
    this.data.splice(index, 1)
  }

  // 添加index出节点
  addNode (index, node, value) {
    if (!Number.isInteger(index)) {
      return
    }

    const nodes = this.getNodes()
    let curIndex = index

    curIndex = this.limitNumber(index, 0, nodes.length)
    if (curIndex === nodes.length) {
      this.insertNode(node, nodes[nodes.length - 1], false)
    } else {
      this.container.insertBefore(node, nodes[curIndex])
    }

    this.addData(curIndex, value)
    this.event.emit('added', {
      index: curIndex,
      node: node
    })
    return {
      index: curIndex,
      node: node
    }
  }

  /**
   * @description 从指定位置动画添加节点
   * @param {Number} index 插入位置的索引
   * @param {Object} newNode 插入的节点
   * @param {Object} position 节点的初始位置
   */

  addNodeAnimated ({ index, newNode, position, value }) {
    if (!Number.isInteger(index)) {
      return
    }
    const nodes = this.getNodes()
    const beforePostions = this.getPositions(nodes)
    const newNodePosition = position || this.getPosition(newNode)
    let curIndex = index

    curIndex = this.limitNumber(index, 0, nodes.length)

    if (curIndex === nodes.length) {
      this.insertNode(newNode, nodes[nodes.length - 1], false)
    } else {
      this.container.insertBefore(newNode, nodes[curIndex])
    }

    this.animateNodesDiffPos(nodes, beforePostions)

    this.animateComplex(newNode, newNodePosition)
    this.emitAnimationEvent(newNode).then(() => {
      this.addData(curIndex, value)
      this.event.emit('added', {
        index: curIndex,
        node: newNode
      })
    })
  }

  addData (index, value) {
    if (!this.data || value === undefined) {
      return
    }
    this.data.splice(index, 0, value)
  }

  limitNumber (value, min, max) {
    if (value < min) {
      return min
    }

    if (value > max) {
      return max
    }
    return value
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
    if (this.isSimpleMode) {
      const curStart = this.limitNumber(start, 0, this.items.length - 1)
      const curEnd = this.limitNumber(end, 0, this.items.length - 1)

      this.setMoveInfo(curStart, curEnd)
      this.setDragNodeStyle()
      this.swapItem()
    } else {
      const nodes = this.getNodes()
      const curStart = this.limitNumber(start, 0, nodes.length - 1)
      const curEnd = this.limitNumber(end, 0, nodes.length - 1)

      this.setMoveInfo(curStart, curEnd)
      this.setPostions()
      this.swapItem()
    }
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
console.log('ss')

export default Sorter
