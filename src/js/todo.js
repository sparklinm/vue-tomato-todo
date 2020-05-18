export default {
  filterStopData (todo, start, end) {
    let data = []

    if (todo.focus && todo.focus.length) {
      data = todo.focus.filter(item => {
        return (
          item.start >= start && item.start <= end && item.status === 'stopped'
        )
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
  },
  filterTodo (todo, startDate, endDate) {
    let currentTodo = null
    let focusData = []

    if (todo.focus && todo.focus.length) {
      focusData = this.getFocusByTime(todo.focus, startDate, endDate)
    }
    if (focusData.length) {
      currentTodo = _.cloneDeep(todo)
      currentTodo.focus = []
      currentTodo.focus.push(...focusData)
    }
    return currentTodo
  },
  getTodosByFocusTime (todos, startDate = new Date(2000), endDate = new Date()) {
    const currentTodos = []

    todos.forEach(todo => {
      const currentTodo = this.filterTodo(todo, startDate, endDate)

      if (currentTodo) {
        currentTodos.push(currentTodo)
      }
    })
    return currentTodos
  },
  getCompletedFocus (focus, start = new Date(2000), end = new Date()) {
    let focusData = []

    focusData = focus.filter(item => {
      return item.start >= start && item.start <= end && item.status === 'completed'
    })
    return focusData
  },
  getFocusByTime (focus, start = new Date(2000), end = new Date()) {
    let focusData = []

    focusData = focus.filter(item => {
      return item.start >= start && item.start <= end && item.duration > 0
    })
    return focusData
  },
  countFocus (focus) {
    const duration = focus.reduce((total, data) => {
      return total + data.duration
    }, 0)

    return {
      times: focus.length,
      duration
    }
  },
  formatFocus (focus) {
    const result = {}

    focus.forEach(item => {
      const { start: time, duration } = item
      const date = time.getDate()
      const hours = time.getHours()
      const thisDate = new Date(
        time.getFullYear(),
        time.getMonth(),
        time.getDate()
      )

      const thisTime = thisDate.getTime()

      result[thisTime] = result[thisTime] || 0
      if (hours + duration / 60 > 24) {
        const cduraion = (24 - hours) * 60

        result[thisTime] += (24 - hours) * 60
        const nextDate = new Date(thisDate.setDate(date + 1))

        result[nextDate.getTime()] = duration - cduraion
      } else {
        result[thisTime] += duration
      }
    })
    return result
  },
  hideTodo (todo, start, end) {
    if (todo.hideAfterComplete) {
      const focus = todo.focus.find(data => {
        return data.end <= end && data.end >= start && data.status === 'completed'
      })

      if (focus) {
        return true
      }
      return false
    }
    return false
  },
  setCompletedTime (todos) {
    const curTodos = []
    const date = new Date()
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const yesterday = new Date(today)

    yesterday.setDate(date.getDate() - 1)

    todos.forEach(todo => {
      const focus = todo.focus.find(data => {
        return data.end <= new Date() && data.end >= today && data.status === 'completed'
      })

      const isHide = this.hideTodo(todo, yesterday, today)

      if (!isHide) {
        if (focus) {
          curTodos.push({
            ...todo,
            completedTime: focus.end
          })
        } else {
          curTodos.push({
            ...todo
          })
        }
      }
    })
    return curTodos
  },
  // 已完成的待办在最后
  sortTodosByCompletedTime (todos) {
    const sortedTodos = []
    const completedTodos = []
    const date = new Date()
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const yesterday = new Date(today)

    yesterday.setDate(date.getDate() - 1)

    todos.forEach(todo => {
      const focus = todo.focus.find(data => {
        return data.end <= new Date() && data.end >= today && data.status === 'completed'
      })

      const isHide = this.hideTodo(todo, yesterday, today)

      if (!isHide) {
        if (focus) {
          completedTodos.push({
            ...todo,
            completedTime: focus.end
          })
        } else {
          sortedTodos.push({
            ...todo
          })
        }
      }
    })
    completedTodos.sort((a, b) => {
      return a.completedTime - b.completedTime
    })
    return sortedTodos.concat(completedTodos)
  }
}
