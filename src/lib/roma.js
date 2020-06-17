
import config from '../config'

function getTheme () {
  const curTheme = Object.values(config.getTheme())

  curTheme.shift()
  const colorPalette = [...curTheme]

  const theme = {
    color: colorPalette,

    visualMap: {
      color: [
        '#e01f54',
        '#e7dbc3'
      ],
      textStyle: {
        color: '#333'
      }
    },

    candlestick: {
      itemStyle: {
        normal: {
          color: '#e01f54',
          color0: '#001852',
          lineStyle: {
            width: 1,
            color: '#f5e8c8',
            color0: '#b8d2c7'
          }
        }
      }
    },

    graph: {
      color: colorPalette
    },

    gauge: {
      axisLine: {
        lineStyle: {
          color: [
            [
              0.2,
              '#E01F54'
            ],
            [
              0.8,
              '#b8d2c7'
            ],
            [
              1,
              '#001852'
            ]
          ],
          width: 8
        }
      }
    }
  }

  return theme
}


export default {
  theme: getTheme(),
  getTheme
}