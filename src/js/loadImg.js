const obj = {
  el: null,
  setSrc (src) {
    Object.assign(this.el.style, {
      opacity: 0,
      visibility: 'hidden'
    })
    setTimeout(() => {
      this.el.src = src
    })
  },
  showImg (e) {
    const el = e.target

    setTimeout(() => {
      Object.assign(el.style, {
        opacity: 1,
        transition: 'opacity 0.5s ease',
        visibility: 'visible'
      })

      el.addEventListener('transitionend', () => {
        Object.assign(el.style, {
          transition: 'initial'
        })
      })
    }, 300)
  }
}

export function loadImg (el) {
  el.addEventListener('load', obj.showImg)
  obj.el = el
  return obj
}