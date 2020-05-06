import Events from './Events'

export default class extends Events {
  el= null

  constructor (el) {
    super()
    this.el = el
    el.addEventListener('load', this.showImg)

  }

  setSrc (src) {
    return new Promise((resolve) => {
      Object.assign(this.el.style, {
        opacity: 0,
        visibility: 'hidden'
      })
      setTimeout(() => {
        this.el.src = src
      })
      this.on('shown', () => {
        resolve()
      })
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
        this.emit('shown')
      })
    }, 300)
  }
}
