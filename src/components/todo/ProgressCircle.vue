<template>
  <div
    class="progress-bar-circle"
    :style="{ width: width + 'px', height: width + 'px' }"
  >
    <svg>
      <circle
        :cx="centreX"
        :cy="centreY"
        :r="radius"
        :stroke-width="strokeWidth"
        :class="{
          'progress-bar__circle-sector': type === 'sector',
          'progress-bar__circle-arc': type === 'arc'
        }"
      />
      <!-- <path
        v-else
        :d="circlePath"
        :stroke-width="strokeWidth"
        fill="none"
        stroke="gray"
      /> -->
      <path
        :d="path"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :class="{
          'progress-bar__sector': type === 'sector',
          'progress-bar__arc': type === 'arc'
        }"
      />
      <text
        :x="centreX"
        :y="centreY"
        fill="white"
        class="progress-bar__text"
        :style="{fontSize:fontSize+'px'}"
      >
        {{ text || progress + '%' }}
      </text>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 100
    },
    progress: {
      type: Number,
      default: 60
    },
    type: {
      type: String,
      default: 'sector'
    },
    strokeWidth: {
      type: Number,
      default: 4
    },
    text: {
      type: String,
      default: ''
    },
    fontSize: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {}
  },
  computed: {
    radius () {
      return this.width / 2 - (this.type === 'sector' ? 0 : this.strokeWidth)
    },
    centreX () {
      return this.width / 2
    },
    centreY () {
      return this.width / 2
    },
    currentProgress () {
      return this.progress > 100 ? 100 : this.progress
    },
    circlePath () {
      return `M ${this.centreX} ${this.strokeWidth} A ${this.radius} ${
        this.radius
      } 0 1 1 ${this.centreX} ${this.centreY + this.radius} A ${this.radius} ${
        this.radius
      } 0 1 1 ${this.centreX} ${this.strokeWidth}`
    },
    path () {
      const angle = (this.currentProgress / 100) * Math.PI * 2
      const endX = Math.floor(Math.sin(angle) * this.radius + this.centreX)
      const endY = this.centreY - Math.cos(angle) * this.radius
      // 决定弧线是大角度还是小角度
      const largeArcFlag = angle > Math.PI ? 1 : 0
      if (this.type === 'sector') {
        return `M ${this.centreX} ${this.centreY} L ${this.centreX} 0 A ${this.radius} ${this.radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`
      }
      return `M ${this.centreX} ${this.strokeWidth} A ${this.radius} ${this.radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`
    }
  },
  methods: {}
}
</script>

<style lang="less">
.progress-bar-circle {
  svg {
    width: 100%;
    height: 100%;
  }
  .sector {
    fill: @theme-base-color-1;
  }
}

.progress-bar__text {
  font-size: 8px;
  dominant-baseline: middle;
  text-anchor: middle;
}
</style>
