import Alert from './Alert.vue'


function creatAlertPlugin (Vue, options) {
  const AlertComponent = Vue.extend(Alert)
  const instance = new AlertComponent()
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)
  Vue.prototype.$alert = function (message) {
    instance.message = message
    instance.show = true
    setTimeout(() => {
      instance.show = false
    }, 3000)
  }
}

export default creatAlertPlugin