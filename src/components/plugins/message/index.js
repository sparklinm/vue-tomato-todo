import Message from './Message.vue'

function creatMessagePlugin (Vue, options) {
  const MessageComponent = Vue.extend(Message)
  const instance = new MessageComponent()
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)
  Vue.prototype.$message = function (title, content) {
    instance.title = title
    instance.content = content
  }
}

export default creatMessagePlugin