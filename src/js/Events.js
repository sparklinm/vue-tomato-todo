export default class {
  // on 监听的事件
  onEvents = {};
  // once:表示注册的事件只执行一次便自动移除
  on (name, callback, once = false) {
    this.onEvents[name] = this.onEvents[name] || []
    this.onEvents[name].push({
      name: name,
      callback: callback,
      once: once
    })
  }

  // 移除事件
  off (name, callback) {
    this.onEvents[name] = this.onEvents[name].filter(event => {
      return event.callback !== callback
    })
  }

  emit (name) {
    if (!this.onEvents[name]) {
      return
    }
    const params = [...arguments].slice(1)

    this.onEvents[name] = this.onEvents[name].filter(event => {
      event.callback(...params)
      // 事件执行完毕后，判断是否为一次性事件
      return !event.once
    })
  }
}
