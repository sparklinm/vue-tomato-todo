'use strict'

import calendar from './ev-calendar.vue'
import event from './components/cal-event.vue'

function install (Vue, options = {}) {
  const defaultOptions = {
    locale: 'zh',
    color: '#f29543'
  }

  Vue.component('ev-calendar', calendar)
  Vue.component('ev-event', event)

  Object.assign(defaultOptions, options)
  Vue.prototype.$EventCalendar = defaultOptions
}

export default install

if (typeof module === 'object' && module.exports) {
  module.exports.install = install
}
