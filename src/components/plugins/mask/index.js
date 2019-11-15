import Mask from './Mask.vue'

function creatMaskPlugin (Vue, options) {
  const MaskComponent = Vue.extend(Mask)
  const instance = new MaskComponent()
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)
  Vue.prototype.$mask = function (show) {
    instance.show = show
  }
  Vue.prototype.$modals = {
    data: [],
    delete () {
      this.data.pop(this.data.length)
      this.setMask()
      this.closeMask()
    },
    add (element) {
      this.data.push(element)
      this.setMask()
    },
    setMask () {
      instance.show = true
      if (this.data.length) {
        console.log(this.data)

        instance.zIndex = this.data[this.data.length - 1].style.zIndex - 1
      }
    },
    closeMask () {
      if (!this.data.length) {

        instance.show = false
      }
    }
  }
}

export default creatMaskPlugin