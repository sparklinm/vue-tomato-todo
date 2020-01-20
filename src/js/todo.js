export default {
  filterStopData (todo, start, end) {
    let data = []
    if (todo.focus && todo.focus.length) {
      data = todo.focus.filter(item => {
        return item.start >= start && item.start <= end && item.status === 'stopped'
      })
      return data
    }
    return data
  },
  getStopData (todos, start = new Date(2000), end = new Date()) {
    const stopData = []
    todos.forEach(todo => {
      const data = this.filterStopData(todo, start, end)
      stopData.push(...data)
    })
    return stopData
  }
}