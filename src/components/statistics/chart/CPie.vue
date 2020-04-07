<template>
  <div
    ref="chartContainer"
    class="pie-contianer"
  >
    <v-chart
      id="pie"
      ref="chart"
      :init-options="chartInitOptions"
      :options="chartOptions"
      autoresize
      theme="roma"
    />
  </div>
</template>

<script>
export default {
  props: {
    radius: {
      type: Number,
      default: 0.2
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      chartInitHeight: 0,
      chartInitOptions: {},
      chartOptions: {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          left: 'left',
          bottom: 0,
          padding: 0,
          itemGap: 5,
          itemWidth: 8,
          itemHeight: 8,
          formatter: '{name}',
          textStyle: {
            fontSize: 10,
            color: '#fff'
          }
        },
        series: [
          {
            type: 'pie',
            radius: '40%',
            label: {
              show: true,
              formatter: `{b}({c}${this.$t('word.minute')})`,
              position: 'outside',
              fontSize: 10,
              color: '#fff'
            },
            labelLine: {
              show: true,
              length: 0,
              length2: 15,
              lineStyle: {
                color: '#fff'
              }
            },
            center: ['50%', '43%'],
            selectedMode: 'single',
            selectedOffset: 0,
            data: []
          }
        ],
        animationDuration: 2000
      }
    }
  },
  watch: {
    options (val) {
      Object.assign(this.chartOptions, val)
    }
  },
  mounted () {
    window.addEventListener('resize', this.resize)
    this.resize()
  },
  methods: {
    resize () {
      const style = window.getComputedStyle(this.$refs.chartContainer)
      const initWidth = parseFloat(style.width)
      const radius = initWidth * this.radius

      this.chartOptions.series[0].radius = radius
      this.setHeight()
    },
    setHeight () {
      this.$nextTick(() => {
        const chart = document.querySelector('#pie')
        const rootFontSize = parseInt(document.documentElement.style.fontSize)
        const legendHeight =
          this.getLegendHeight(
            this.$refs.chart.computedOptions.legend[0],
            parseInt(window.getComputedStyle(chart).width)
          ) / rootFontSize
        const container = this.$refs.chartContainer

        this.chartInitHeight =
          this.chartInitHeight ||
          parseInt(window.getComputedStyle(container).height) / rootFontSize
        container.style.height = this.chartInitHeight + legendHeight + 'rem'
      })
    },
    getTextWidth (text, fontStyle) {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      document.body.appendChild(canvas)
      context.font = fontStyle
      document.body.removeChild(canvas)
      return context.measureText(text).width
    },
    getChartFontStyle (textStyle) {
      function getValue (value) {
        return typeof value === 'undefined' ? '' : value + ' '
      }
      function getFamily (value) {
        return typeof value === 'undefined' ? 'sans-serif' : value
      }
      function getSize (fontSize, lineHeight) {
        if (
          typeof fontSize !== 'undefined' &&
          typeof lineHeight !== 'undefined'
        ) {
          return `${fontSize}px/${lineHeight}px `
        }
        if (typeof fontSize !== 'undefined') {
          return getValue(fontSize + 'px')
        }
        if (typeof lineHeight !== 'undefined') {
          return getValue(lineHeight + 'px')
        }
        return ''
      }
      const font = `${getValue(textStyle.fontStyle)}${getValue(
        textStyle.fontWeight
      )}${getSize(textStyle.fontSize, textStyle.lineHeight)}${getFamily(
        textStyle.fontFamily
      )}`

      return font
    },
    getLegendHeight (legend, chartWidth) {
      const {
        data,
        itemWidth: iconWidth,
        itemHeight: iconHeight,
        itemGap,
        height
      } = legend

      if (height) {
        return height
      }
      if (!data || !data.length) {
        return 0
      }

      let leftWidth = legend.width || chartWidth
      let rowCount = 1
      const textStyle = _.cloneDeep(legend.textStyle)

      textStyle.fontSize = textStyle.fontSize < 12 ? 12 : textStyle.fontSize
      data.forEach(item => {
        const name = typeof item === 'object' ? item.name : item
        const text = legend.formatter(name)
        const textWidth = this.getTextWidth(text, textStyle)
        const iconGap = 5
        const totalWidth = iconWidth + textWidth + iconGap

        if (totalWidth > leftWidth) {
          rowCount++
          leftWidth = legend.width || chartWidth
        }
        leftWidth -= totalWidth
      })
      const textHeight = legend.textStyle.fontSize || 12
      const itemHeight = textHeight > iconHeight ? textHeight : iconHeight
      const lineHeight = legend.textStyle.lineHeight || 1.2
      let rowHeight = itemHeight

      if (lineHeight === 1.2) {
        rowHeight *= 1.2
      } else if (lineHeight > itemHeight) {
        rowHeight = lineHeight
      }
      const legendHeight = rowCount * (rowHeight + itemGap) - itemGap

      return legendHeight
    }
  }
}
</script>

<style lang="less">
.pie-contianer {
  width: 7.56rem;
  height: 4rem;
}
</style>
