import Vue from 'vue'

function marquee (el, binding) {
  const opt = binding.value || {}

  Object.assign(el.style, {
    whiteSpace: 'normal'
  })
  const visibleWidth = opt.width || el.parentNode.offsetWidth || 200

  Object.assign(el.style, {
    whiteSpace: 'nowrap'
  })
  Object.assign(el.parentNode.style, {
    overflow: 'hidden'
  })
  const gapWidth = opt.gap || visibleWidth / 3
  const width = el.offsetWidth
  const maxTranslateX = -(width + gapWidth)

  if (width <= visibleWidth) {
    return
  }

  const container = document.createElement('div')
  const div1 = document.createElement('div')
  const div2 = document.createElement('div')
  const copy1 = el.cloneNode(true)
  const copy2 = el.cloneNode(true)

  div1.appendChild(copy1)
  div2.appendChild(copy2)
  container.appendChild(div1)
  container.appendChild(div2)

  for (let i = 0; i < el.childNodes.length;) {
    el.removeChild(el.childNodes[i])
  }
  el.appendChild(container)

  Object.assign(div1.style, {
    display: 'inline-block',
    marginRight: gapWidth + 'px'
  })
  Object.assign(div2.style, {
    display: 'inline-block'
  })
  Object.assign(container.style, {
    display: 'inline-block'
  })
  Object.assign(el.style, {
    display: 'inline-block',
    overflow: 'hidden',
    width: visibleWidth + 'px'
  })

  const piece = 1
  let translateX = piece

  function doMarquee () {
    translateX -= piece
    let timeout = 25

    if (translateX > maxTranslateX && translateX < 0) {
      container.style.transform = `translateX(${translateX}px)`
    } else if (translateX === 0) {
      container.style.transform = `translateX(${translateX}px)`
      timeout = 300
    } else {
      container.style.transform = `translateX(${maxTranslateX}px)`
      translateX = piece
    }
    setTimeout(() => {
      doMarquee()
    }, timeout)
  }

  doMarquee()
}

Vue.directive('marquee', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding) {
    marquee(el, binding)
  },
  componentUpdated: function (el, binding) {
    const opt = binding.value || {}

    if (!opt.changed) {
      return
    }
    opt.changed = false
    marquee(el, binding)
  }
})

function getIndexByTextLength (str, length) {
  let realLength = 0
  let charCode = -1
  let index = 0

  for (let i = 0; i < str.length; i++) {
    charCode = str.charCodeAt(i)
    if (charCode >= 0 && charCode <= 128) {
      // 占一个宽度的字符
      realLength += 1
    } else {
      // 占两个宽度的字符，例如：汉字
      realLength += 2
    }
    if (realLength / 2 > length) {
      index = i
      break
    }
  }
  return index
}

let oldText = ''

function addEllipses (el, binding) {
  const text = el.innerText

  if (text === oldText) {
    return
  }

  oldText = text
  // 中文字符长度
  const length = binding.value || 40
  const index = getIndexByTextLength(text, length)

  if (index > length - 1) {
    el.innerText = text.slice(0, index) + '...'
  }
}

Vue.directive('ellipsis', {
  inserted: function (el, binding) {
    addEllipses(el, binding)
  },
  componentUpdated: function (el, binding) {
    addEllipses(el, binding)
  }
})