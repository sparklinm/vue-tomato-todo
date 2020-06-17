import Vue from 'vue'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import roma from './roma'
ECharts.registerTheme('roma', roma.theme)
Vue.component('v-chart', ECharts)

export default {
  registerTheme () {
    ECharts.registerTheme('roma', roma.getTheme())
  }
}