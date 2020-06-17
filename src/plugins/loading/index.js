import Loading from './Loading.vue'

function creatLoadingPlugin (Vue, options) {
  const LoadingComponent = Vue.extend(Loading)
  const instance = new LoadingComponent()

  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)
  Vue.prototype.$loading = instance
}

export default creatLoadingPlugin