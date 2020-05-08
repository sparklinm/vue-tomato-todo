import Tips from './Tips.vue'


function creatTipsPlugin (Vue, options) {
  const TipsComponent = Vue.extend(Tips)
  const instance = new TipsComponent()

  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)
  Vue.prototype.$tips = function (message, options = {}) {
    instance.message = message
    const obj = Object.assign(
      {
        style: {}
      },
      options
    )

    Object.assign(instance, obj)
    instance.show = true
    setTimeout(() => {
      instance.show = false
    }, 3000)
  }
}

export default creatTipsPlugin