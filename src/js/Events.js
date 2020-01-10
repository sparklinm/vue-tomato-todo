export default class {
  // on 监听的事件数组
  onEvents = [];
  on (name, callback, once = false) {
    this.onEvents.push({
      name: name,
      callback: callback,
      once: once
    })
  }

  off (name, callback) {
    this.onEvents = this.onEvents.filter(event => {
      return event.name !== name || event.callback !== callback
    })
  }

  emit (name, arg1, arg2, arg3) {
    this.onEvents = this.onEvents.filter(event => {
      if (event.name === name) {
        event.callback(arg1, arg2, arg3)
      }
      return !event.once
    })
  }
}
