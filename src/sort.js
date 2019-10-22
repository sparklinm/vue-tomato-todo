/**
 * @description 分类器
 * @param {String} id 父元素id选择器
 * @param {Array} data 可选，分类的数据
 */

export default class Sorter {
  id; // 父元素id选择器
  data; // 分类数据
  container; // 父元素节点
  items; // 分类元素对象
  nodeCopy;
  nodeInitPos;
  index;
  mouse = {};
  events = {
    down: 'touchstart',
    move: 'touchmove',
    up: 'touchend'
  };

  constructor (id, data) {
    this.id = id
    this.data = _.cloneDeep(data)
  }

  init () {
    this.container = document.querySelector(this.id)
    this.items = [...this.container.querySelectorAll('.sort-cell')].map(
      (node, index) => ({
        el: node,
        position: this.getPosition(node),
        id: index
      })
    )
    this.addlistener()
  }

  addlistener () {
    this.container.addEventListener(this.events.down, this.dragStart)
    this.container.addEventListener(this.events.move, this.dragOver)
    this.container.addEventListener(this.events.up, this.dragEnd)
  }

  removeListener () {
    this.container.removeEventListener(this.events.down, this.dragStart)
    this.container.removeEventListener(this.events.move, this.dragOver)
    this.container.removeEventListener(this.events.up, this.dragEnd)
  }

  getPosition (node) {
    const pRect = this.container.getBoundingClientRect()
    const cRect = node.getBoundingClientRect()
    const left = cRect.left - pRect.left
    const top = cRect.top - pRect.top
    const width = cRect.right - cRect.left
    const height = cRect.bottom - cRect.top
    return {
      realLeft: cRect.left,
      realTop: cRect.top,
      left,
      top,
      right: left + width,
      bottom: top + height,
      width,
      height,
      centreX: left + width / 2,
      centreY: top + height / 2
    }
  }

  setNodeCopy (index) {
    const node = this.items[index].el
    const position = this.items[index].position
    this.nodeCopy = node.cloneNode(true)
    const style = {
      position: 'absolute',
      left: position.realLeft + 'px',
      top: position.realTop + 'px',
      zIndex: 100,
      transformOrigin: '50% 50%',
      boxSizing: 'border-box',
      background: '#fff',
      opacity: 0.8,
      transition: 'none',
      width: position.width + 'px',
      height: position.height + 'px'
    }
    Object.assign(this.nodeCopy.style, style)
    this.container.appendChild(this.nodeCopy, node)
  }

  hint (x, y) {
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

  animateSwap (current, hint) {
    const hintObj = this.items[hint]
    const currentObj = this.items[current]
    const dy = hintObj.position.top - currentObj.position.top
    hintObj.el.style.transform = `translate(0,${-dy}px)`
    currentObj.el.style.transform = `translate(0,${dy}px)`
  }

  swap (current, hint, direction) {
    const hintNode = this.items[hint].el
    const currentNode = this.items[current].el
    if (direction > 0) {
      this.container.insertBefore(hintNode, currentNode)
    } else {
      this.container.insertBefore(currentNode, hintNode)
    }
    [this.items[current].el, this.items[hint].el] = [this.items[hint].el, this.items[current].el];
    [this.items[current].id, this.items[hint].id] = [this.items[hint].id, this.items[current].id]
  }

  getParentByClass (node, pClass) {
    if (!node) {
      return null
    }
    if (node.className.includes(pClass)) {
      return node
    }
    return this.getParentByClass(node.parentNode, pClass)
  }

  dragStart = e => {
    const event = e
    event.preventDefault()
    const touch = event.targetTouches[0]
    const node = this.getParentByClass(touch.target, 'sort-cell')
    if (!node) return
    const index = this.items.findIndex(item => {
      return item.el === node
    })

    this.nodeInitPos = {
      centreX: this.items[index].position.centreX,
      centreY: this.items[index].position.centreY,
      index: index
    }

    this.setNodeCopy(index)
    node.style.opacity = 0.6
    node.style.background = '#c8ebfb'

    this.mouse.originY = this.mouse.startY = touch.clientY
    this.mouse.originX = this.mouse.startX = touch.clientX
    this.index = index
  };

  dragOver = e => {
    const event = e
    const touch = event.targetTouches[0]
    const dy = touch.clientY - this.mouse.originY
    const dx = touch.clientX - this.mouse.originX
    const direction = touch.clientY - this.mouse.startY
    this.mouse.startY = touch.clientY
    this.nodeCopy.style.transform = `translate(${dx}px,${dy}px)`
    const hint = this.hint(
      this.nodeInitPos.centreX,
      this.nodeInitPos.centreY + dy,
      direction
    )

    if (hint === -1 || hint === this.index) return
    this.swap(this.index, hint, direction)
    this.index = hint
  };

  dragEnd = e => {
    const event = e
    const node = this.getParentByClass(event.target, 'sort-cell')
    if (!node) return
    this.container.removeChild(this.nodeCopy)
    node.style.background = ''
    node.style.opacity = 1
    if (Array.isArray(this.data)) {
      this.sortData()
    }
  };

  sortData () {
    const dragIndex = this.nodeInitPos.index
    const hintIndex = this.index
    const dragItem = this.data.splice(dragIndex, 1)[0]
    this.data.splice(hintIndex, 0, dragItem)
  }

  getData () {
    return this.data
  }

  destroy () {
    this.removeListener()
  }
}
