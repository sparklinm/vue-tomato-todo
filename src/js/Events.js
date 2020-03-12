export default class {
  // on 监听的事件数组
  onEvents = [];
  // once:表示注册的事件只执行一次便自动移除
  on (name, callback, once = false) {
    this.onEvents.push({
      name: name,
      callback: callback,
      once: once
    })
  }

  // 移除事件
  off (name, callback) {
    this.onEvents = this.onEvents.filter(event => {
      return event.name !== name || event.callback !== callback
    })
  }

  emit (name, arg1, arg2, arg3, arg4) {
    this.onEvents = this.onEvents.filter(event => {
      if (event.name === name) {
        event.callback(arg1, arg2, arg3, arg4)
        // 事件执行完毕后，判断是否为一次性事件
        return !event.once
      }
      return true
    })
  }
}
