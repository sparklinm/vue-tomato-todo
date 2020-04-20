import Message from './Message.vue'

function creatMessagePlugin (Vue, options) {
  const MessageComponent = Vue.extend(Message)
  const instance = new MessageComponent()

  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)
  Vue.prototype.$message = function (message) {
    instance.title = message.title
    instance.content = message.content
    instance.show = true
    Object.assign(instance, message.options)
    return new Promise((resolve, reject) => {
      instance.$on('confirm', () => {
        resolve()
      })
      instance.$on('cancel', () => {
        reject()
      })
    })
  }
}

export default creatMessagePlugin