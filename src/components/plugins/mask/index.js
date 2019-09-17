import Mask from './Mask.vue'

function creatMaskPlugin (Vue, options) {
  const MaskComponent = Vue.extend(Mask)
  const instance = new MaskComponent()
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)
  Vue.prototype.$mask = function (show) {
    instance.show = show
  }
}

export default creatMaskPlugin