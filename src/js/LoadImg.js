
export default class {
  el= null

  constructor (el) {
    this.el = el
    el.addEventListener('load', this.showImg)

  }

  setSrc (src) {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        Object.assign(this.el.style, {
          opacity: 0,
          visibility: 'hidden'
        })
        requestAnimationFrame(() => {
          this.el.src = src
        })
      })
      this.resolve = resolve
    })
  }

  showImg =(e) => {
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
        this.resolve && this.resolve()
        this.resolve = null
      })
    }, 300)
  }
}
